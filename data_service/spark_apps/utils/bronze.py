import os
import logging
from functools import reduce
from minio import Minio
from minio.error import S3Error, InvalidResponseError
from minio.commonconfig import REPLACE, CopySource
from pyspark.sql import DataFrame
from pyspark.sql.functions import year, month, col
from pyspark.sql.functions import col, lit
from delta.tables import DeltaTable
from typing import List

from utils.schema_config import (
	shopee_raw_schema_columns, 
    default_shopee_column_rename_mapping,
    shopee_silver_schema,
    default_kpim_schema
)

class Bronze:
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    def __init__(self, spark, minio_client, username):
        self.spark = spark
        self.username = username
        self.mc = minio_client
        self.file_list = []
        self.source_path = f's3a://{username}'
        self.__create_silver_db()

    def __create_silver_db(self):
        sql_ddl = f"CREATE DATABASE IF NOT EXISTS silver_{self.username}"
        self.spark.sql(sql_ddl)

    def run(self):
        renamed_raw_df = self.load_raw_data()
        # Merge raw_df to silver schema
        self.df.printSchema()
        self.append_raw_to_self(renamed_raw_df)
        # write to delta lake format
        self.write_to_delta_upsert()
        # self.move_files_to_archive()

    def load_raw_data(self):
        try:
            objects = self.mc.list_objects(self.username, prefix="raw", recursive=True)
            self.file_list = [f"{self.source_path}/{obj.object_name}" for obj in objects if obj.object_name.endswith('.csv') or obj.object_name.endswith('.json')]
            self.logger.info(f"Files found: {self.file_list}")
            if not self.file_list:
                raise SystemExit("No data source files found in the Bronze.")
            
            csv_files = [file for file in self.file_list if file.endswith('.csv')]
            self.source, self.matching_info = self.__extract_matching_info()   
            self.df = self.__create_silver_df()
            df_list = []
            for file in csv_files:
                temp_df = self.spark.read.csv(file, header=True, inferSchema=True)
                self.logger.info(f"Schema of {file}: {temp_df.schema}")
                if self.__validate_schema(temp_df):
                    df_list.append(temp_df)
                else:
                    self.logger.warning(f"Schema validation failed for file: {file}")

            if df_list:
                df = self.__merge_dataframes(df_list)
            else:
                raise SystemExit("No valid CSV files to load.")

        except S3Error as e:
            raise SystemExit(e)
        except InvalidResponseError as e:
            raise SystemExit(e)
        df = self.__rename_columns(df)

        return df
    
    def write_to_delta_upsert(self):
        output_delta_path = f's3a://{self.username}/silver/{self.source}_sales'
        print(f"CREATE TABLE IF NOT EXISTS {self.source}_sales USING DELTA LOCATION '{output_delta_path}'")
        try:
            # Add year and month columns
            self.df = self.df.withColumn("year", year(col("order_date")))
            self.df = self.df.withColumn("month", month(col("order_date")))

            # Calculate min and max year and month in the DataFrame
            min_year_month = self.df.select("year", "month").groupBy().min().collect()[0]
            max_year_month = self.df.select("year", "month").groupBy().max().collect()[0]

            # Iterate over each month and write data to Delta Lake incrementally
            for year_val, month_val in self.generate_year_month_range(min_year_month, max_year_month):
                month_df = self.df.filter((col("year") == year_val) & (col("month") == month_val))
                # Remove duplicate rows based on 'order_number'
                month_df = month_df.dropDuplicates(["order_number"])
                
                # Check if the Delta table already exists
                if DeltaTable.isDeltaTable(self.spark, output_delta_path):
                    delta_table = DeltaTable.forPath(self.spark, output_delta_path)
                    # Perform upsert using merge
                    delta_table.alias("tgt").merge(
                        month_df.alias("src"),
                        "tgt.order_number = src.order_number"
                    ).whenMatchedUpdateAll().whenNotMatchedInsertAll().execute()
                else:
                    # If the table does not exist, write the data for the first time
                    month_df.write.format("delta").partitionBy("year", "month").mode("overwrite").save(output_delta_path)
                    # Resgiter to metastore
                    self.spark.sql(f"USE silver_{self.username}")
                    create_table_sql = f"CREATE TABLE IF NOT EXISTS {self.source}_sales USING DELTA LOCATION '{output_delta_path}'"
                    self.spark.sql(create_table_sql)

            print("Data has been successfully upserted to Delta Lake incrementally.")
        except Exception as e:
            # Handle the error appropriately
            print("Error occurred while upserting data to Delta Lake incrementally:", str(e))

    def generate_year_month_range(self, start_year_month, end_year_month):
        start_year, start_month = start_year_month["min(year)"], start_year_month["min(month)"]
        end_year, end_month = end_year_month["max(year)"], end_year_month["max(month)"]
        for year in range(start_year, end_year + 1):
            start = start_month if year == start_year else 1
            end = end_month if year == end_year else 12
            for month in range(start, end + 1):
                yield year, month
    def move_files_to_archive(self):
        # Move files to the archive folder after processing
        for file_path in self.file_list:
            try:
                file_name = os.path.basename(file_path)
                
                # Copy file to archive folder
                self.mc.copy_object(self.username, "archive", CopySource(self.username, f"raw/{file_name}"))
                print(f"Moved {file_name} to the archive folder.")
                
                # Remove original file
                self.mc.remove_object(self.username, file_path[len(f's3a://{self.username}/'):])
                print(f"Removed original file {file_name}.")
            except Exception as e:
                print(f"Error moving file {file_name} to the archive folder:", str(e))

    def __rename_columns(self, df):
        # Extract the mapping from self.matching_info
        if self.matching_info:
            # Create a dictionary mapping from source_field to field
            rename_mapping = {row.source_field: row.field for row in self.matching_info}      
            self.logger.info(rename_mapping)

            # Rename columns in df using the mapping
            for source_field, field in rename_mapping.items():
                if source_field in df.columns:
                    df = df.withColumnRenamed(source_field, field)
        
        for old_name, new_name in default_shopee_column_rename_mapping.items():
            df = df.withColumnRenamed(old_name, new_name)

        self.logger.info(df.printSchema())
        return df
    
    def __merge_dataframes(self, df_list: List[DataFrame]) -> DataFrame:
        return reduce(lambda df1, df2: df1.unionByName(df2, allowMissingColumns=True), df_list)

    def __extract_matching_info(self):
        json_file_path = ''
        for file in self.file_list:
            if file.endswith(".json"):
                json_file_path = file
                break

        if not json_file_path:
            return None, None
        json_df = self.spark.read.option("multiline", "true").json(json_file_path)
        json_data = json_df.collect()[0].asDict()
        return json_data.get('source', ''), json_data.get('matching_result', {})

    def __create_silver_df(self):
        if self.source == 'shopee':
            schema = shopee_silver_schema
        return self.spark.createDataFrame(self.spark.sparkContext.emptyRDD(), schema)

    def __validate_schema(self, df: DataFrame) -> bool:
        file_schema = set(df.columns)
        expected_schema = set()

        if self.source == 'shopee': 
            expected_schema = set(shopee_raw_schema_columns)
        elif self.source == 'kpim':
            expected_schema = set(kpim_schema)

        # Find columns that are in file_schema but not in expected_schema
        missing_columns = file_schema - expected_schema

        if missing_columns:
            self.logger.warning(f"Columns in file_schema but not in expected_schema: {missing_columns}")
        
        # Return True if file_schema is a subset of expected_schema, otherwise False
        return file_schema.issubset(expected_schema)
        
    def append_raw_to_self(self, raw_df):
        self_schema = self.df.schema
        
        # Create a list of columns present in both DataFrames
        common_columns = list(set(raw_df.columns).intersection(set(self.df.columns)))
        
        # Select the common columns from raw_df
        raw_common_df = raw_df.select(*common_columns)
        
        # Add missing columns to raw_common_df with null values
        for field in self_schema.fields:
            if field.name not in raw_common_df.columns:
                raw_common_df = raw_common_df.withColumn(field.name, lit(None).cast(field.dataType))
        
        # Reorder the columns to match self.df schema
        raw_common_df = raw_common_df.select([field.name for field in self_schema.fields])   
        # # Append the new data to self.df
        self.df = self.df.unionByName(raw_common_df, allowMissingColumns=True)