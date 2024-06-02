import os
import logging
from functools import reduce
from minio import Minio
from minio.error import S3Error, InvalidResponseError
from pyspark.sql import DataFrame, Window
from pyspark.sql.functions import col, when, last, desc, dense_rank, to_date, date_format, lit
from delta.tables import DeltaTable
from typing import List

class Gold:
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)
    def __init__(self, spark, username, source):
        self.spark = spark
        self.username = username
        self.source = source
        self.__truncate_gold_tables()
        self.__create_gold_database()

    def run(self):
        self.logger.info("Starting ETL process.")
        self.__load_dim_date()
        self.load_dim_product()
        self.load_dim_customer()
        self.load_dim_promotion()
        self.load_dim_shipment()
        self.load_shopee_fact_sales()

    def __truncate_gold_tables(self):
        self.spark.sql(f"DROP DATABASES IF EXISTS gold_{self.username} CASCADE")
    
    def __create_gold_database(self):
        self.spark.sql(f"CREATE DATABASE IF NOT EXISTS gold_{self.username}")

    def __load_dim_date(self):
        self.logger.info("Loading data to date dimension.")
        query = f"""
            SELECT DISTINCT
                CAST(date_format(order_date, 'yyyyMMdd') AS INT) AS date_key,
                order_date AS date,
                day,
                month,
                quarter,
                AS year,
                day_of_week,
                day_of_week_number
            FROM silver_{self.username}.{self.source}_sales_silver
        """
        dim_date_df = self.spark.sql(query)

        # Save dim_date DataFrame to Delta Lake
        dim_date_df.write.format("delta").mode("overwrite").save(f"s3a://{self.username}/gold/dim_date")

        # Create Delta table for easy querying
        self.spark.sql(f"""
            CREATE TABLE IF NOT EXISTS gold_{self.username}_dim_date
            USING DELTA 
            LOCATION 's3a://{self.username}/gold/dim_date'
        """)
    def load_dim_product(self):
        query = f"""
            SELECT DISTINCT
                product_key,
                product_name,
                product_category,
                price,
                weight
            FROM silver_{self.username}.{self.source}_sales_silver
        """
        dim_product_df = self.spark.sql(query)

        # Save dim_product DataFrame to Delta Lake
        dim_product_df.write.format("delta").mode("overwrite").save(f"s3a://{self.username}/gold/dim_product")

        # Create Delta table for easy querying
        self.spark.sql(f"""
            CREATE TABLE IF NOT EXISTS gold_{self.username}_dim_product
            USING DELTA 
            LOCATION 's3a://{self.username}/gold/dim_product'
        """)

    def load_dim_customer(self):
        query = f"""
            SELECT DISTINCT
                monotonically_increasing_id() AS customer_key,
                customer_name,
            FROM silver_{self.username}.{self.source}_sales_silver
        """
        dim_customer_df = self.spark.sql(query)

        # Save dim_customer DataFrame to Delta Lake
        dim_customer_df.write.format("delta").mode("overwrite").save(f"s3a://{self.username}/gold/dim_customer")

        # Create Delta table for easy querying
        self.spark.sql(f"""
            CREATE TABLE IF NOT EXISTS gold_{self.username}_dim_customer
            USING DELTA 
            LOCATION 's3a://{self.username}/gold/dim_customer'
        """)
    
    def load_dim_promotion(self):
        query = f"""
            SELECT DISTINCT
                monotonically_increasing_id() AS promotion_key
                promotion,
            FROM silver_{self.username}.{self.source}_sales_silver
        """
        dim_promotion_df = self.spark.sql(query)

        # Save dim_promotion DataFrame to Delta Lake
        dim_promotion_df.write.format("delta").mode("overwrite").save(f"s3a://{self.username}/gold/dim_promotion")

        # Create Delta table for easy querying
        self.spark.sql(f"""
            CREATE TABLE IF NOT EXISTS gold_{self.username}_dim_promotion
            USING DELTA 
            LOCATION 's3a://{self.username}/gold/dim_promotion'
        """)

    def load_dim_shipment(self):
        query = f"""
            SELECT DISTINCT
                monotonically_increasing_id() AS shipment_key
                shipping_company
            FROM silver_{self.username}.{self.source}_sales_silver
        """
        dim_shipment_df = self.spark.sql(query)

        # Save dim_shipment DataFrame to Delta Lake
        dim_shipment_df.write.format("delta").mode("overwrite").save(f"s3a://{self.username}/gold/dim_shipment")

        # Create Delta table for easy querying
        self.spark.sql(f"""
            CREATE TABLE IF NOT EXISTS gold_{self.username}_dim_shipment
            USING DELTA 
            LOCATION 's3a://{self.username}/gold/dim_shipment'
        """)

    def load_shopee_fact_sales(self):
        try:
            self.logger.info("Loading data to shopee fact sales table.")
            query = f"""
                SELECT
                    monotonically_increasing_id() AS sale_key,
                    date_dim.date_key AS date_key,
                    time_dim.time_key AS time_key,
                    product_dim.product_key AS product_key,
                    customer_dim.customer_key AS customer_key,
                    promotion_dim.promotion_key AS promotion_key,
                    silver.order_number,
                    silver.order_quantity,
                    silver.unit_price,
                    silver.unit_cost,
                    silver.unit_discount,
                    silver.sales_amount,
                    silver.order_date,
                    silver.ship_date,
                    silver.payment_date
                FROM
                    silver_{self.username}.{self.source}_sales_silver AS silver
                LEFT JOIN
                    gold_{self.username}_dim_date AS date_dim
                ON
                    CAST(date_format(silver.order_date, 'yyyyMMdd') AS INT) = date_dim.date_key
                LEFT JOIN
                    gold_{self.username}_dim_time AS time_dim
                ON
                    CAST(date_format(silver.order_date, 'HHmmss') AS INT) = time_dim.time_key
                LEFT JOIN
                    gold_{self.username}_dim_product AS product_dim
                ON
                    silver.product_key = product_dim.product_key
                LEFT JOIN
                    gold_{self.username}_dim_customer AS customer_dim
                ON
                    silver.customer_name = customer_dim.customer_name
                LEFT JOIN
                    gold_{self.username}_dim_promotion AS promotion_dim
                ON
                    silver.promotion = promotion_dim.promotion
            """

            fact_sales_df = self.spark.sql(query)

            # Save fact_sales DataFrame to Delta Lake with partitioning and Z-Ordering
            fact_sales_df.write \
                .format("delta") \
                .mode("overwrite") \
                .partitionBy("date_key") \
                .save(f"s3a://{self.username}/gold/shopee_fact_sales")

            # Create Delta table for easy querying
            self.spark.sql(f"""
                CREATE TABLE IF NOT EXISTS gold_{self.username}_shopee_fact_sales
                USING DELTA 
                LOCATION 's3a://{self.username}/gold/shopee_fact_sales'
            """)

            # Optimize and Z-Order the table
            self.spark.sql(f"""
                OPTIMIZE gold_{self.username}_shopee_fact_sales
                ZORDER BY (product_key, customer_key)
            """)
            self.logger.info("Data loaded to shopee fact sales table successfully.")
        except Exception as e:
            self.logger.error(f"Error loading data to shopee fact sales table: {str(e)}")