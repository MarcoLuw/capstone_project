from pyspark.sql import SparkSession
# from minio import Minio
from utils.common import get_spark_session

spark = get_spark_session(
	"CSV to delta lake",
	"http://minio:9000",
	"kayden",
	"password"
    )

input_path = "s3a://kayden/raw/shopee_fake_data.xlsx"
# df = spark.read.format("csv").load(input_path, header = True, inferSchema = True)
# df.printSchema()
df = spark.read \
        .format("com.crealytics.spark.excel") \
        .option("header", "true") \
        .option("inferSchema", "true") \
        .load(input_path)
df.printSchema()

