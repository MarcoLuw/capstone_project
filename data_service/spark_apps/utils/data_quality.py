from pyspark.sql import DataFrame
from pyspark.sql.functions import col

class DataQualityChecker:
    def __init__(self, df: DataFrame):
        self.df = df

    def check_data_source_type(self, raw_file_list):
        

    def check_nulls(self, columns: list):
        null_counts = {}
        for column in columns:
            null_count = self.df.filter(col(column).isNull()).count()
            null_counts[column] = null_count
        return null_counts

    def check_duplicates(self, columns: list):
        duplicate_count = self.df.groupBy(columns).count().filter("count > 1").count()
        return duplicate_count

    def check_data_types(self, column_data_types: dict):
        data_type_issues = {}
        for column, expected_type in column_data_types.items():
            actual_type = dict(self.df.dtypes)[column]
            if actual_type != expected_type:
                data_type_issues[column] = actual_type
        return data_type_issues

    def check_value_ranges(self, column_ranges: dict):
        range_violations = {}
        for column, (min_value, max_value) in column_ranges.items():
            violations = self.df.filter((col(column) < min_value) | (col(column) > max_value)).count()
            range_violations[column] = violations
        return range_violations