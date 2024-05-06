import os
import sys
import logging

from pyspark import StorageLevel
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

def get_spark_session(appname, minio_url,
                      minio_access_key, minio_secret_key):
    user_bucket = minio_access_key

    spark = (SparkSession.builder
             .appName(appname)
             .config("spark.network.timeout", "10000s")
             .config("hive.exec.dynamic.partition", "true")
             .config("hive.exec.dynamic.partition.mode", "nonstrict")
             .config("spark.sql.sources.partitionOverwriteMode", "dynamic")
             .config("spark.hadoop.fs.s3a.multiobjectdelete.enable", "true")
             .config("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
             .config("spark.hadoop.fs.s3a.fast.upload", "true")
             .config("spark.hadoop.fs.s3a.endpoint", minio_url)
             .config("spark.hadoop.fs.s3a.access.key", minio_access_key)
             .config("spark.hadoop.fs.s3a.secret.key", minio_secret_key)
             .config("spark.hadoop.fs.s3a.path.style.access", "true")
			 .config("spark.eventLog.dir", f"s3a://{user_bucket}/logging/spark-events")
			 .config("spark.sql.warehouse.dir", f"s3a://{user_bucket}/warehouse")
			 .config("hive.metastore.warehouse.dir", f"s3a://{user_bucket}/warehouse")
             .config("spark.sql.files.ignoreMissingFiles", "true")
             .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
             .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
             .enableHiveSupport()
             .getOrCreate())
    return spark

