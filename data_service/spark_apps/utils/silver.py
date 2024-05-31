import os
from functools import reduce
from minio import Minio
from minio.error import S3Error, InvalidResponseError
from pyspark.sql import DataFrame, Window
from pyspark.sql.functions import col, when, last, desc, dense_rank, to_date, date_format, lit
from delta.tables import DeltaTable
from utils.schema_config import (
	shopee_raw_schema_columns, 
    default_shopee_column_rename_mapping,
    shopee_bronze_schema
)
from typing import List

import logging

class Silver:

    # Set up logging
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')
    logger = logging.getLogger(__name__)

    def __init__(self, spark, username, source):
        self.spark = spark
        self.username = username
        # self.bronze_df = self.__read_bronze_data()
        self.source = source
        self.quality_issues = []

    def run(self):
        self.logger.info("Starting ETL process.")
        self.spark.sql(f"CREATE DATABASE IF NOT EXISTS silver_{self.username}")
        transformed_df = self.transform()
        if self.__ensure_data_quality(transformed_df):
            self.__write_to_silver(transformed_df)
        else:
            self.__report_quality_issues()

    def transform(self):
        if self.source == 'shopee':
            self.logger.info("Transforming Shopee data.")
            return self.__shopee_transform()
        
    def __shopee_transform(self):
        self.logger.info("Starting Shopee data transformation.")
        self.spark.sql(f"USE bronze_{self.username}")
        table = f"bronze_{self.username}.shopee_sales"
        query = f"""
            SELECT 
                order_number,
                order_date,
                ship_date,
                order_quantity,
                unit_price,
                unit_discount,
                CAST(total_order_price AS FLOAT) as sales_amount,
                payment_date,
                product_key,
                product_name,
                category_name as product_category,
                unit_price as price,
                weight,
                DAY(order_date) AS day,
                MONTH(order_date) AS month,
                YEAR(order_date) as year,
                QUARTER(order_date) as quarter,
                DATE_FORMAT(order_date, 'EEEE') AS day_of_week,
                DAYOFWEEK(order_date) AS day_of_week_number,
                shop_discount_code,
                shopee_discount_code,
                tracking_code,
                shipping_company,
                buyer_name as customer_name
            FROM {table}
        """

        sql_transformed_df = self.spark.sql(query)
        self.logger.info("Shopee data transformed using SQL query.")

        # Clean data
        cleaned_df = sql_transformed_df \
            .filter(col("order_number").isNotNull() & col("product_key").isNotNull() & col("order_date").isNotNull()) \
            .withColumn("product_name", when(col("product_name").isNull(), 
                                            last("product_name", ignorenulls=True)
                                            .over(Window.partitionBy("product_key").orderBy("order_date")))
                        .otherwise(col("product_name"))) \
            .na.drop(subset=["order_number", "product_key", "order_date", "product_name"]) \
            .withColumn("rank", dense_rank().over(Window.partitionBy("order_number", "product_key").orderBy(desc("order_date")))) \
            .filter(col("rank") == 1) \
            .drop("rank")
        
        # Transform data
        numeric_columns = ['unit_price', 'unit_discount', 'sales_amount', 'price', 'weight']
        for col_name in numeric_columns:
            transformed_df = cleaned_df.withColumn(col_name, when(col(col_name).isNull() | (col(col_name) < 0), 0).otherwise(col(col_name)))

        transformed_df = transformed_df.withColumn('order_quantity', when(col('order_quantity').isNull() | (col('order_quantity') == 0), 1).otherwise(col('order_quantity')))
        
        # Replace null or 0 values in sales_amount with (unit_price * ordered_quantity) - unit_discount
        transformed_df = transformed_df.withColumn('sales_amount', when((col('sales_amount').isNull()) | (col('sales_amount') == 0), (col('unit_price') * col('order_quantity')) - col('unit_discount')).otherwise(col('sales_amount')))
            
        # Format date columns to 'yyyy-MM-dd'
        date_columns = ['order_date', 'ship_date', 'payment_date']
        for col_name in date_columns:
            transformed_df = transformed_df.withColumn(col_name, to_date(col(col_name), 'yyyy-MM-dd').cast('date'))
        
        # Format order_date to 'yyyy-MM-dd'
        transformed_df = transformed_df.withColumn('order_date', date_format(col('order_date'), 'yyyy-MM-dd'))

        self.logger.info("Shopee data transformation completed.")
        return transformed_df
    
    def __ensure_data_quality(self, df: DataFrame) -> bool:
        self.logger.info("Starting data quality checks.")
        quality_checks_passed = True
        
        # Example quality checks:
        
        # Check for null values in critical columns
        null_checks = ["order_number", "order_date", "product_key", "product_name"]
        for column in null_checks:
            null_count = df.filter(col(column).isNull()).count()
            if null_count > 0:
                issue = f"Column '{column}' has {null_count} null values."
                self.quality_issues.append(issue)
                self.logger.warning(issue)
                quality_checks_passed = False

        # Check for negative values in numerical columns
        negative_checks = ['unit_price', 'unit_discount', 'sales_amount', 'price', 'weight']
        for column in negative_checks:
            negative_count = df.filter(col(column) < 0).count()
            if negative_count > 0:
                issue = f"Column '{column}' has {negative_count} negative values."
                self.quality_issues.append(issue)
                self.logger.warning(issue)
                quality_checks_passed = False

        # Check for invalid date ranges
        date_checks = ['order_date', 'ship_date', 'payment_date']
        for column in date_checks:
            invalid_dates_count = df.filter(col(column) > lit("2100-01-01")).count()
            if invalid_dates_count > 0:
                issue = f"Column '{column}' has {invalid_dates_count} invalid future dates."
                self.quality_issues.append(issue)
                self.logger.warning(issue)
                quality_checks_passed = False

        # Add additional quality checks as needed

        self.logger.info("Data quality checks completed.")
        return quality_checks_passed

    def __write_to_silver(self, df: DataFrame):
        silver_table_path = f's3a://{self.username}/silver/{self.source}_sales_silver'
        silver_table = f"silver_{self.username}.{self.source}_sales_silver"
        try: 
            self.logger.info(f"Writing data to Silver at {silver_table_path}.")
            if DeltaTable.isDeltaTable(self.spark, silver_table_path):
                delta_table = DeltaTable.forPath(self.spark, silver_table_path)
                delta_table.alias("tgt").merge(
                    df.alias("src"),
                    "tgt.order_number = src.order_number AND tgt.product_key = src.product_key"
                ).whenMatchedUpdateAll().whenNotMatchedInsertAll().execute()
            else:
                df.write.format("delta").mode("overwrite").save(silver_table_path)

            self.spark.sql(f"CREATE TABLE IF NOT EXISTS {silver_table} USING DELTA LOCATION '{silver_table_path}'")
            self.logger.info("Data has been successfully loaded to Silver.")
        except Exception as e:
            self.logger.error("Error occurred while loading data to Silver:", exc_info=True)

    def __report_quality_issues(self):
        # Report quality issues (e.g., log to a file, print to console, etc.)
        self.logger.info("Data quality issues found:")
        for issue in self.quality_issues:
            self.logger.error(issue)