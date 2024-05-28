import os
from functools import reduce
from minio import Minio
from minio.error import S3Error, InvalidResponseError
from pyspark.sql import DataFrame
from utils.schema_config import (
	shopee_raw_schema_columns, 
    default_shopee_column_rename_mapping,
    kpim_schema
)
from typing import List

class Silver:

    def __init__(self, spark, minio_client, username):
        self.spark = spark
        self.username = username
        self.mc = minio_client
        self.file_list = []

    def process(self):
        self.__load_raw_data()
        self.__rename_columns()
        self.__transform()
        return self.df
        # self.__validate_and_load()
        # self.load_to_silver()

    def load_to_silver(self):
        # target_path = f"s3a://{self.username}/silver"
        # self.df.write.mode("overwrite").parquet(target_path)

        # create silver database
        self.spark.sql("CREATE DATABASE IF NOT EXISTS DB_SILVER;")


    def __create_hive_table(self):
        pass

    def __load_raw_data(self):
        try:
            # Get all files in raw
            objects = self.mc.list_objects(self.username, prefix="raw", recursive=True)
            self.file_list = [f"s3a://{self.username}/{obj.object_name}" for obj in objects if obj.object_name.endswith('.csv') or obj.object_name.endswith('.json')]
            if not self.file_list:
                raise SystemExit("No data source files found in the Bronze.")
            
            csv_files = [file for file in self.file_list if file.endswith('.csv')]
            self.source, self.matching_info = self.__extract_matching_info()
            
            df_list = []  # Initialize an empty list to store DataFrames
            for file in csv_files:
                temp_df = self.spark.read.csv(file, header=True, inferSchema=True)
                if self.__validate_schema(temp_df):
                    df_list.append(temp_df)  # Append the valid DataFrame to the list
                else:
                    print(f"Schema validation failed for file: {file}")  # Log the invalid schema

            if df_list:
                self.df = self.__merge_dataframes(df_list)  # Merge all DataFrames into one
            else:
                raise SystemExit("No valid CSV files to load.")

        except S3Error as e:
            raise SystemExit(e)
        except InvalidResponseError as e:
            raise SystemExit(e)

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

    def __validate_schema(self, df: DataFrame) -> bool:
        file_schema = set(df.columns)
        if self.source == 'shopee': 
            expected_schema = set(shopee_raw_schema_columns)
        elif self.source == 'kpim':
            expected_schema = set(kpim_schema)
        return file_schema.issubset(expected_schema)

    def __rename_columns(self):
        # Extract the mapping from self.matching_info
        if self.matching_info:
            # Create a dictionary mapping from source_field to field
            rename_mapping = {row.source_field: row.field for row in self.matching_info}            

            # Rename columns in self.df using the mapping
            for source_field, field in rename_mapping.items():
                if source_field in self.df.columns:
                    self.df = self.df.withColumnRenamed(source_field, field)
        
        for old_name, new_name in default_shopee_column_rename_mapping.items():
            self.df = self.df.withColumnRenamed(old_name, new_name)

    def __move_to_archive(self):
        pass
