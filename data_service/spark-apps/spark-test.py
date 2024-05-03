from delta.tables import DeltaTable
from pyspark.sql import SparkSession

def main():
    source_bucket = "test-user"

    spark = SparkSession.builder \
        .appName("CSV File to Delta Lake Table") \
        .config("spark.jars.packages", "io.delta:delta-core_2.13:2.4.0,org.apache.hadoop:hadoop-aws:3.3.6") \
        .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
        .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \
        .config("spark.jars.excludes", "com.amazonaws:aws-java-sdk-bundle") \
        .config("spark.driver.extraClassPath", "/opt/spark/jars/aws-java-sdk-bundle-1.12.541.jar") \
        .config("spark.executor.extraClassPath", "/opt/spark/jars/aws-java-sdk-bundle-1.12.541.jar") \
        .config("spark.sql.warehouse.dir", f"s3a://{source_bucket}/warehouse") \
        .config("hive.metastore.warehouse.dir", f"s3a://{source_bucket}/warehouse") \
        .enableHiveSupport() \
        .getOrCreate()

    # Create schema if not exists
    spark.sql(f"CREATE SCHEMA IF NOT EXISTS `{source_bucket.replace('-', '_')}`")

    # Use warehouse database
    spark.sql("CREATE DATABASE IF NOT EXISTS warehouse")
    spark.sql("USE warehouse")

    input_path = f"s3a://{source_bucket}/raw/data_train.csv"
    delta_path = f"s3a://{source_bucket}/delta/tables/"

    df = spark.read.csv(input_path, header=True, inferSchema=True)
    df.show()

    # Save DataFrame as Delta table
    delta_table_path = f'{delta_path}/test_table'
    df.write.mode("overwrite").format("delta") \
        .option("delta.columnMapping.mode", "name") \
        .save(delta_table_path)

    # Register Delta table
    delta_table_name = f"`{source_bucket.replace('-', '_')}`.`test_table`"
    spark.sql(f"CREATE TABLE IF NOT EXISTS {delta_table_name} USING DELTA LOCATION '{delta_table_path}'")

    # Load Delta table using DeltaTable
    dt = DeltaTable.forPath(spark, delta_table_path)
    dt.toDF().show()

if __name__ == "__main__":
    main()
