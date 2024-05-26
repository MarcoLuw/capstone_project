import os
import csv
import json
import pandas as pd

STORAGE_PATH = 'storage'

class ProcessData:
    def __init__(self, file):
        self.file = file

    """ Get data from file """
    def getSampleDataUI(self):
        file_path = os.path.join(STORAGE_PATH, self.file.name)
        if self.file.name.endswith('.csv'):
            return self._get_csv_data(file_path)
        elif self.file.name.endswith('.xlsx'):
            return self._get_excel_data(file_path)
        else:
            raise ValueError("Unsupported file format. Please provide a .csv or .xlsx file.")

    def _get_csv_data(self, file_path):
        with open(file_path, 'r', encoding='utf-8-sig') as file:
            csv_reader = csv.reader(file)
            columns = next(csv_reader)
            rows = []
            row_count = 0  # Initialize a counter for the number of rows read

            for row in csv_reader:
                # Limit the number of rows to 10
                if row_count == 10:
                    break
                # Check if the row length matches the column length
                if len(row) != len(columns):
                    continue
                row_dict = {columns[j]: value for j, value in enumerate(row)}
                rows.append(row_dict)
                row_count += 1  # Increment the counter
            
        self._write_json(rows)
        return rows

    def _get_excel_data(self, file_path):
        # Read only the first 10 rows from the Excel file
        df = pd.read_excel(file_path, nrows=10)
        rows = df.to_dict(orient='records')
        self._write_json(rows)
        return rows

    def _write_json(self, data):
        with open(os.path.join(STORAGE_PATH, 'output.json'), 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, indent=4, ensure_ascii=False)