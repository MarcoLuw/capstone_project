import os
import sys
import logging

from minio import Minio
from minio.error import S3Error, InvalidResponseError
from pyspark import StorageLevel
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

MINIO_ENDPOINT = os.getenv('MINIO_URL')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY')
MINIO_ALIAS = "minio"

def get_spark_session(appname,
                      username):
    user_bucket = username

    spark = (SparkSession.builder
             .appName(appname)
             .config("spark.network.timeout", "10000s")
             .config("hive.exec.dynamic.partition", "true")
             .config("hive.exec.dynamic.partition.mode", "nonstrict")
             .config("spark.sql.sources.partitionOverwriteMode", "dynamic")
             .config("spark.hadoop.fs.s3a.multiobjectdelete.enable", "true")
             .config("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
             .config("spark.hadoop.fs.s3a.fast.upload", "true")
             .config("spark.hadoop.fs.s3a.endpoint", MINIO_ENDPOINT)
             .config("spark.hadoop.fs.s3a.access.key", username)
             .config("spark.hadoop.fs.s3a.secret.key", MINIO_SECRET_KEY)
             .config("spark.hadoop.fs.s3a.path.style.access", "true")
			 .config("spark.eventLog.dir", f"s3a://{user_bucket}/logging/spark-events")
			 .config("spark.sql.warehouse.dir", f"s3a://hive/warehouse")
			 .config("hive.metastore.warehouse.dir", f"s3a://hive/warehouse")
             .config("spark.sql.files.ignoreMissingFiles", "true")
             .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
             .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
             .enableHiveSupport()
             .getOrCreate())
    return spark

def get_minio_client(username):
    try:
        minio_client = Minio(
            endpoint=MINIO_ENDPOINT,
            access_key=username,
            secret_key=MINIO_SECRET_KEY,
            secure=False
        )
        return minio_client
    except S3Error as e:
        raise SystemExit(e)