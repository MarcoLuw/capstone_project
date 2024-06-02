import os
import logging
from functools import reduce
from minio import Minio
from minio.error import S3Error, InvalidResponseError
from pyspark.sql import DataFrame, Window
from pyspark.sql.functions import monotonically_increasing_id
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
        self.load_dim_date()
        self.load_dim_product()
        self.load_dim_customer()
        self.load_dim_promotion()
        self.load_dim_shipment()
        self.load_shopee_fact_sales()

    def __truncate_gold_tables(self):
        self.spark.sql(f"DROP DATABASE IF EXISTS gold_{self.username} CASCADE")
    
    def __create_gold_database(self):
        self.spark.sql(f"CREATE DATABASE IF NOT EXISTS gold_{self.username}")

    def load_dim_date(self):
        self.logger.info("Loading data to date dimension.")
        query = f"""
            SELECT DISTINCT
                CAST(date_format(order_date, 'yyyyMMdd') AS INT) AS date_key,
                order_date AS date,
                day,
                month,
                quarter,
                year,
                day_of_week,
                day_of_week_number
            FROM silver_{self.username}.{self.source}_sales_silver
        """
        dim_date_df = self.spark.sql(query)

        # Save dim_date DataFrame to Delta Lake
        dim_date_df.write.format("delta").mode("overwrite").save(f"s3a://{self.username}/gold/dim_date")

        # Create Delta table for easy querying
        self.spark.sql(f"""
            CREATE TABLE IF NOT EXISTS gold_{self.username}.dim_date
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
            CREATE TABLE IF NOT EXISTS gold_{self.username}.dim_product
            USING DELTA 
            LOCATION 's3a://{self.username}/gold/dim_product'
        """)

    def load_dim_customer(self):
        self.logger.info("Loading data to customer dimension.")

        # Query to get distinct customer names
        query = f"""
            SELECT DISTINCT
                customer_name
            FROM silver_{self.username}.{self.source}_sales_silver
        """
        
        self.logger.info("Executing SQL query for distinct customer names.")
        distinct_customer_df = self.spark.sql(query)

        # Add customer_key as surrogate key
        self.logger.info("Adding customer_key as surrogate key.")
        dim_customer_df = distinct_customer_df.withColumn("customer_key", monotonically_increasing_id())

        # Reorder columns to make customer_key the first column
        self.logger.info("Reordering columns to make customer_key the first column.")
        columns = ['customer_key'] + [col for col in dim_customer_df.columns if col != 'customer_key']
        dim_customer_df = dim_customer_df.select(columns)

        # Save dim_customer DataFrame to Delta Lake
        self.logger.info("Writing dim_customer DataFrame to Delta Lake.")
        dim_customer_df.write.format("delta").mode("overwrite").save(f"s3a://{self.username}/gold/dim_customer")

        # Create Delta table for easy querying
        self.logger.info("Creating Delta table for dim_customer.")
        self.spark.sql(f"""
            CREATE TABLE IF NOT EXISTS gold_{self.username}.dim_customer
            USING DELTA 
            LOCATION 's3a://{self.username}/gold/dim_customer'
        """)
        self.logger.info("dim_customer loaded and Delta table created successfully.")
    
    def load_dim_promotion(self):
        self.logger.info("Loading data to promotion dimension.")

        # Query to get distinct promotions
        query = f"""
            SELECT DISTINCT
                promotion
            FROM silver_{self.username}.{self.source}_sales_silver
        """
        
        self.logger.info("Executing SQL query for distinct promotions.")
        distinct_promotion_df = self.spark.sql(query)

        # Add promotion_key as surrogate key
        self.logger.info("Adding promotion_key as surrogate key.")
        dim_promotion_df = distinct_promotion_df.withColumn("promotion_key", monotonically_increasing_id())

        # Reorder columns to make promotion_key the first column
        self.logger.info("Reordering columns to make promotion_key the first column.")
        columns = ['promotion_key'] + [col for col in dim_promotion_df.columns if col != 'promotion_key']
        dim_promotion_df = dim_promotion_df.select(columns)

        # Save dim_promotion DataFrame to Delta Lake
        self.logger.info("Writing dim_promotion DataFrame to Delta Lake.")
        dim_promotion_df.write.format("delta").mode("overwrite").save(f"s3a://{self.username}/gold/dim_promotion")

        # Create Delta table for easy querying
        self.logger.info("Creating Delta table for dim_promotion.")
        self.spark.sql(f"""
            CREATE TABLE IF NOT EXISTS gold_{self.username}.dim_promotion
            USING DELTA 
            LOCATION 's3a://{self.username}/gold/dim_promotion'
        """)
        self.logger.info("dim_promotion loaded and Delta table created successfully.")
    
    def load_dim_shipment(self):
        self.logger.info("Loading data to shipment dimension.")
		# Query to get distinct shipping companies 
        query = f"""
			SELECT DISTINCT
				shipping_company
			FROM silver_{self.username}.{self.source}_sales_silver
		"""
        self.logger.info("Executing SQL query for distinct shipping companies.")
        distinct_shipping_df = self.spark.sql(query)
        
        # Add shipment_key as surrogate key
        self.logger.info("Adding shipment_key as surrogate key.")
        dim_shipment_df = distinct_shipping_df.withColumn("shipment_key", monotonically_increasing_id())

		# Reorder columns to make shipment_key the first column
        self.logger.info("Reordering columns to make shipment_key the first column.")
        columns = ['shipment_key'] + [col for col in dim_shipment_df.columns if col != 'shipment_key']
        dim_shipment_df = dim_shipment_df.select(columns)

		# Save dim_shipment DataFrame to Delta Lake
        self.logger.info("Writing dim_shipment DataFrame to Delta Lake.")
        dim_shipment_df.write.format("delta").mode("overwrite").save(f"s3a://{self.username}/gold/dim_shipment")

		# Create Delta table for easy querying
        self.logger.info("Creating Delta table for dim_shipment.")
        self.spark.sql(f"""
			CREATE TABLE IF NOT EXISTS gold_{self.username}.dim_shipment
			USING DELTA 
			LOCATION 's3a://{self.username}/gold/dim_shipment'
		""")
        self.logger.info("dim_shipment loaded and Delta table created successfully.")

    def load_shopee_fact_sales(self):
        try:
            self.logger.info("Loading data to shopee fact sales table.")
            query = f"""
                SELECT
                    monotonically_increasing_id() AS sale_key,
                    date_dim.date_key AS date_key,
                    product_dim.product_key AS product_key,
                    customer_dim.customer_key AS customer_key,
                    promotion_dim.promotion_key AS promotion_key,
                    shipment_dim.shipment_key AS shipment_key,
                    silver.order_number,
                    silver.order_quantity,
                    silver.unit_price,
                    silver.unit_discount,
                    silver.sales_amount,
                    silver.order_date,
                    silver.ship_date,
                    silver.payment_date
                FROM
                    silver_{self.username}.{self.source}_sales_silver AS silver
                LEFT JOIN
                    gold_{self.username}.dim_date AS date_dim
                ON
                    CAST(date_format(silver.order_date, 'yyyyMMdd') AS INT) = date_dim.date_key
                LEFT JOIN
                    gold_{self.username}.dim_product AS product_dim
                ON
                    silver.product_key = product_dim.product_key
                LEFT JOIN
                    gold_{self.username}.dim_customer AS customer_dim
                ON
                    silver.customer_name = customer_dim.customer_name
                LEFT JOIN
                    gold_{self.username}.dim_promotion AS promotion_dim
                ON
                    silver.promotion = promotion_dim.promotion
                LEFT JOIN
                    gold_{self.username}.dim_shipment AS shipment_dim
                ON silver.shipping_company = shipment_dim.shipping_company
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
                CREATE TABLE IF NOT EXISTS gold_{self.username}.shopee_fact_sales
                USING DELTA 
                LOCATION 's3a://{self.username}/gold/shopee_fact_sales'
            """)

            # Optimize and Z-Order the table
            self.spark.sql(f"""
                OPTIMIZE gold_{self.username}.shopee_fact_sales
                ZORDER BY (product_key, customer_key)
            """)
            self.logger.info("Data loaded to shopee fact sales table successfully.")
        except Exception as e:
            self.logger.error(f"Error loading data to shopee fact sales table: {str(e)}")
