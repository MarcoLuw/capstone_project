import sys

from delta.tables import DeltaTable
from pyspark.sql import SparkSession
from minio import Minio
from utils.common import get_spark_session, get_minio_client
from utils.bronze import Bronze
from utils.silver import Silver

def main(username):
    spark = get_spark_session(
        f"{username}_ETL",
        username,
    )

    log_path = f"s3a://{username}/logging"

    spark._jsc.hadoopConfiguration().set("log4j.appender.file", "org.apache.log4j.FileAppender")
    spark._jsc.hadoopConfiguration().set("log4j.appender.file.File", log_path)
    spark._jsc.hadoopConfiguration().set("log4j.appender.file.layout", "org.apache.log4j.PatternLayout")
    spark._jsc.hadoopConfiguration().set("log4j.appender.file.layout.ConversionPattern", "%d{yyyy-MM-dd HH:mm:ss} %-5p %c{1}:%L - %m%n")

    # mc = get_minio_client(username)
    MINIO_ENDPOINT = "minio:9000/"
    MINIO_ACCESS_KEY = username
    MINIO_SECRET_KEY = "password"

    mc = Minio(
        endpoint=MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False
    )

    bronze = Bronze(spark, mc, username)
    bronze.run()
    
    # source = bronze.source

    # silver = Silver(spark, username, source)
    # silver.run()
if __name__ == "__main__":

    if len(sys.argv) > 0:
        username = sys.argv[1]
        main(username)