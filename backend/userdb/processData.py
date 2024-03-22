import os
import csv
import json
# import pandas as pd
# import numpy as np

ROOT_PATH = os.path.dirname(os.path.abspath(__file__))
STORAGE_PATH = os.path.join(ROOT_PATH, 'storage')

class ProcessData:
    def __init__(self, file):
        self.file = file

    """ Get data from file """
    def createFile(self):
        with open(os.path.join(STORAGE_PATH, self.file.name), 'r', encoding='utf-8-sig') as file:
            csv_reader = csv.reader(file)
            columns = next(csv_reader)
            rows = []

            for i, row in enumerate(csv_reader):
                # Limit the number of rows to 10
                if i == 10:
                    break
                row_dict = {columns[j]: value for j, value in enumerate(row)}
                rows.append(row_dict)
            
        with open(os.path.join(STORAGE_PATH, 'output.json'), 'w', encoding='utf-8') as json_file:
            json.dump(rows, json_file, indent=4, ensure_ascii=False)
        
        return rows

# data = ProcessData('dim_product.csv')
# data.createFile()
    