import pytest
from pyspark.sql import SparkSession
from minio import Minio
from unittest.mock import MagicMock
from data_service.spark_apps.utils.silver import Silver

@pytest.fixture(scope="class")
def spark():
    return SparkSession.builder.appName("SilverUnitTest").getOrCreate()

@pytest.fixture(scope="session")
def minio_client():
    MINIO_ENDPOINT = "localhost:9000/"
    MINIO_ACCESS_KEY = "kayden"
    MINIO_SECRET_KEY = "password"

    return Minio(
        endpoint=MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False
    )

@pytest.fixture(scope="class")
def silver(spark, minio_client):
    username = "kayden"
    return Silver(spark, minio_client, username)

class TestSilver:

    def test_load_raw_data_no_files(self, silver):
        silver.minio_client.list_objects.return_value = []
        with pytest.raises(SystemExit) as cm:
            silver._Silver__load_raw_data()
        assert str(cm.value) == "No data source files found in the Bronze."

    def test_load_raw_data_with_invalid_schema(self, silver):
        silver.minio_client.list_objects.return_value = [MagicMock(object_name="raw/test.csv")]
        invalid_schema_df = silver.spark.createDataFrame([(1, 2)], ["InvalidCol1", "InvalidCol2"])
        silver.spark.read.csv = MagicMock(return_value=invalid_schema_df)
        with pytest.raises(SystemExit) as cm:
            silver._Silver__load_raw_data()
        assert "Schema validation failed for file" in str(cm.value)

    def test_load_raw_data_with_valid_schema(self, silver):
        silver.minio_client.list_objects.return_value = [MagicMock(object_name="raw/test.csv")]
        valid_schema_df = silver.spark.createDataFrame([(1, "value")], ["Mã đơn hàng", "Mã Kiện Hàng"])
        silver.spark.read.csv = MagicMock(return_value=valid_schema_df)
        silver._Silver__load_raw_data()
        assert isinstance(silver.df, silver.DataFrame)

    def test_rename_columns(self, silver):
        df = silver.spark.createDataFrame([(1, "value")], ["Mã đơn hàng", "Mã Kiện Hàng"])
        renamed_df = silver._Silver__rename_columns(df)
        assert "order_id" in renamed_df.columns
        assert "package_id" in renamed_df.columns

    def test_merge_dataframes(self, silver):
        df1 = silver.spark.createDataFrame([(1, "value1")], ["Mã đơn hàng", "Mã Kiện Hàng"])
        df2 = silver.spark.createDataFrame([(2, "value2")], ["Mã đơn hàng", "Mã Kiện Hàng"])
        merged_df = silver._Silver__merge_dataframes([df1, df2])
        assert merged_df.count() == 2
        assert "Mã đơn hàng" in merged_df.columns
        assert "Mã Kiện Hàng" in merged_df.columns

    def test_process(self, silver):
        with pytest.raises(AttributeError):
            silver.process()

    def test_load_to_silver(self, silver):
        with pytest.raises(AttributeError):
            silver.load_to_silver()

    def test_create_hive_table(self, silver):
        with pytest.raises(AttributeError):
            silver._Silver__create_hive_table()

    def test_extract_matching_info(self, silver):
        silver.file_list = ["raw/test.json"]
        silver.spark = MagicMock()
        silver.spark.read.json.return_value.collect.return_value = [{"source": "shopee", "mapping_results": {}}]
        source, mapping_info = silver._Silver__extract_matching_info()
        assert source == "shopee"
        assert mapping_info == {}

    def test_transform_shopee(self, silver):
        silver.file_list = ["raw/test.csv"]
        silver.spark = MagicMock()
        silver.spark.read.csv.return_value = silver.spark.createDataFrame([(1, "value")], ["Mã đơn hàng", "Mã Kiện Hàng"])
        with pytest.raises(SystemExit):
            silver._Silver__transform_shopee()

    def test_validate_schema(self, silver):
        df = silver.spark.createDataFrame([(1, "value")], ["Mã đơn hàng", "Mã Kiện Hàng"])
        assert silver._Silver__validate_schema(df)

    def test_move_to_archive(self, silver):
        with pytest.raises(AttributeError):
            silver._Silver__move_to_archive()
