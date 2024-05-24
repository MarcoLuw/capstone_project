import sys

from delta.tables import DeltaTable
from pyspark.sql import SparkSession
from utils.common import get_spark_session, get_minio_client

def main(username):
    spark = get_spark_session(
        f"{username}_ETL",
        username,
    )
    
	mc = get_minio_client(username)
	
    
	



if __name__ == "__main__":

    if len(sys.argv) > 0:
		username = sys.argv[1]
	
	
	