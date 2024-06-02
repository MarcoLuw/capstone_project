import os
import sys
import logging

from minio import Minio
from minio.error import S3Error, InvalidResponseError
from pyspark import StorageLevel
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import (IntegerType, StringType, FloatType, DoubleType, DateType, DecimalType, BooleanType, ByteType, StructField, StructType)

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
             .config("spark.jars.excludes", "com.amazonaws:aws-java-sdk-bundle")
             .config("spark.driver.extraClassPath", "/opt/spark/jars/aws-java-sdk-1.12.541.jar:/opt/spark/jars/aws-java-sdk-bundle-1.12.541.jar") \
             .config("spark.executor.extraClassPath", "/opt/spark/jars/aws-java-sdk-1.12.541.jar:/opt/spark/jars/aws-java-sdk-bundle-1.12.541.jar") \
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

def get_spark_type(data_type):
    if data_type == "IntegerType":
        return IntegerType()
    elif data_type == "StringType":
        return StringType()
    elif data_type == "FloatType":
        return FloatType()
    elif data_type == "DoubleType":
        return DoubleType()
    elif data_type == "DateType":
        return DateType()
    elif data_type == "DecimalType":
        return DecimalType()
    elif data_type == "BooleanType":
        return BooleanType()
    elif data_type == "ByteType":
        return ByteType()
    else:
        raise ValueError(f"Unsupported data type: {data_type}")

def create_schema(table_schema):
    fields = []
    for field_name, field_type in table_schema['fields'].items():
        fields.append(StructField(field_name, get_spark_type(field_type), True))
    return StructType(fields)