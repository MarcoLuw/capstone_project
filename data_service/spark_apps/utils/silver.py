import os
from functools import reduce
from minio import Minio
from minio.error import S3Error, InvalidResponseError
from pyspark.sql import DataFrame
from utils.schema_config import (
	shopee_raw_schema_columns, 
    default_shopee_column_rename_mapping,
    kpim_schema
)
from typing import List

class Silver:

    def __init__(self, spark, username, source):
        self.spark = spark
        self.username = username
        self.silver_df = self.__read_silver_data()
        self.source = source

    def run(self):
        self.__load_raw_data()
        self.__rename_columns()
        self.__transform()
        return self.df
        # self.__validate_and_load()
        # self.load_to_silver()

    def __read_silver_data(self):
        pass

    def transform(self):
        if self.source == 'shopee':
            return self.__shopee_transform()
        
    def __shopee_transform():
        pass