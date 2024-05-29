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
             .config("spark.hadoop.fs.s3a.fast.upload", "true")
			 .config("spark.eventLog.dir", f"s3a://{user_bucket}/logging/spark-events")
             .config("spark.history.fs.logDirectory", f"s3a://{user_bucket}/logging/spark-events")
             .config("spark.sql.files.ignoreMissingFiles", "true")
             .enableHiveSupport()
             .getOrCreate())
    return spark

def get_minio_client(username):
    print(MINIO_ENDPOINT, MINIO_SECRET_KEY)
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