from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from django.db.models import Min, Max
from django.core.cache import cache
from datetime import datetime

import userdb.views as userdbViews
from data_service import file_uploader
from data_service import spark_utils
import os

import logging
import pandas as pd
import json
import pymysql
import subprocess
from trino.dbapi import Connection
from openai import OpenAI
# Create your views here.

# Storage path
STORAGE_PATH = 'storage'

# Config logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s: [%(levelname)s] - %(message)s')

# Lưu columns và matching_result vào cache
def save_to_cache(columns, matching_result):
    cache.set('columns', columns, timeout=None)  # timeout=None để lưu trữ vô thời hạn
    cache.set('matching_result', matching_result, timeout=None)

# Tải columns và matching_result từ cache
def load_from_cache():
    columns = cache.get('columns', [])
    matching_result = cache.get('matching_result', {})
    return columns, matching_result

COLUMN_MAPPING = {}

# TEMP_MAPPING = {
#         "Mã đơn hàng": {
#             "table": "fact_ecommerce_sales",
#             "field": "order_number"
#         },
#         "Ngày đặt hàng": {
#             "table": "fact_ecommerce_sales",
#             "field": "order_date"
#         },
#         "SKU sản phẩm": {
#             "table": "dim_product",
#             "field": "product_key"
#         },
#         "Tên sản phẩm": {
#             "table": "dim_product",
#             "field": "product_name"
#         },
#         "Loại sản phẩm": {
#             "table": "dim_product",
#             "field": "product_category"
#         },
#         "Số lượng": {
#             "table": "fact_ecommerce_sales",
#             "field": "order_quantity"
#         },
#         "Tổng giá bán (sản phẩm)": {
#             "table": "fact_ecommerce_sales",
#             "field": "total_sale"
#         },
#         "Người Mua": {
#             "table": "dim_customer",
#             "field": "full_name"
#         }
#     }

# Define The NUMERIC_FIELDS and AGGREGATION_OPTIONS
# NUMERIC_FIELDS = [
#                 'order_key', 'order_number', 'order_line_number', 'order_date', 
#                 'order_time', 'customer_key', 'store_key', 'product_key', 
#                 'unit_price', 'unit_cost', 'order_quantity', 'sales_amount'
#                 ]

SCHEMAS_JSON = {
    "tables": {
        "fact_ecommerce_sales": [
            {"field": "date_key", "description": "Foreign key to dim_date"},
            {"field": "customer_key", "description": "Foreign key to dim_customer"},
            {"field": "product_key", "description": "Foreign key to dim_product"},
            {"field": "promotion_key", "description": "Foreign key to dim_promotion"},
            {"field": "shipment_key", "description": "Foreign key to dim_shipment"},
            {"field": "order_number", "description": "Unique identifier for the order"},
            {"field": "order_date", "description": "The date the order was placed"},
            {"field": "ship_date", "description": "The date the order was shipped"},
            {"field": "order_quantity", "description": "Number of items ordered"},
            {"field": "unit_price", "description": "Price per unit of the product"},
            {"field": "unit_discount", "description": "Discount applied per unit"},
            {"field": "sales_amount", "description": "Total sales amount"},
            {"field": "payment_date", "description": "The date the payment was made"}
        ],
        "dim_product": [
            {"field": "product_key", "description": "Unique key for the product dimensional table or SKU of product"},
            {"field": "product_name", "description": "Name of the product"},
            {"field": "product_category", "description": "Category name of the product"},
            {"field": "price", "description": "Price of the product"},
            {"field": "weight", "description": "Weight of the product"}
        ],
        "dim_date": [
            {"field": "date_key", "description": "Key of date dimensional table"},
            {"field": "day", "description": "Day of the month"},
            {"field": "month", "description": "Month of the year"},
            {"field": "year", "description": "Year"},
            {"field": "quarter", "description": "Quarter of the year"},
            {"field": "day_of_week", "description": "Day of the week"},
            {"field": "day_of_week_number", "description": "Number of the day in the week"}
        ],
        "dim_promotion": [
            {"field": "promotion_key", "description": "Surrogate key of promotion dimensional table"},
            {"field": "promotion", "description": "Promotion code"}
        ],
        "dim_shipment": [
            {"field": "shipment_key", "description": "Surrogate key of shipment dimensional table"},
            {"field": "shipping_company", "description": "Company responsible for shipping"}
        ],
        "dim_customer": [
            {"field": "customer_key", "description": "Surrogate key of customer dimensional table"},
            {"field": "customer_name", "description": "Name of the customer"}
        ]
    }
}



AGGREGATION_OPTIONS = ['SUM', 'AVERAGE', 'COUNT', 'DISTINCT']


def readJsonFile(filepath: str) -> pd.DataFrame:
    # Read the JSON file
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    # Convert JSON data to DataFrame
    df = pd.DataFrame(data)
    return df

def writeJsonFile(data: dict, filepath: str):
    # Write the JSON file
    with open(filepath, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
    logging.info(f"Data written to {filepath}")

# def connectToDB():
#     # Database connection information
#     server = 'host.docker.internal'
#     database = 'dw'
#     username = 'root'
#     password = 'lengochoa2002'

#     # Create the connection string
#     connection_string = {
#         'host': server,
#         'user': username,
#         'password': password,
#         'database': database
#     }

#     # Connect to the database
#     try:
#         conn = pymysql.connect(**connection_string)
#         logging.info("Connection successful")
#     except Exception as e:
#         logging.error(f"Error connecting to the database: {e}")
#         exit()

#     return conn

def connectToDB(username):
    # Trino connection information 
    host = 'localhost'  # Adjust this to your Trino host
    port = 8888  # Default Trino port
    catalog = 'warehouse'  # Your catalog name
    schema = f'gold_{username}'  # Your schema name
    user = 'trino'  # Your Trino user

    # Create the connection string
    connection_string = {
        'host': host,
        'port': port,
        'user': user,
        'catalog': catalog,
        'schema': schema
    }

    # Connect to the database
    try:
        conn = Connection(**connection_string)
        logging.info("Connection successful")
    except Exception as e:
        logging.error(f"Error connecting to the database: {e}")
        exit()

    return conn

class GetInfoFieldView(APIView):
    def get(self, request):
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response({"message": "Unauthenticated!"}, status=status.HTTP_401_UNAUTHORIZED)

        field = request.GET.get('field', None)
        if not field:
            return Response({"message": "Field parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        columns, matching_result = load_from_cache()
        global COLUMN_MAPPING
        COLUMN_MAPPING = matching_result

        # Map the field using COLUMN_MAPPING
        if field in COLUMN_MAPPING:
            table_name = COLUMN_MAPPING[field]['table']
            column_name = COLUMN_MAPPING[field]['field']
        else:
            return Response({"message": "Invalid field name."}, status=status.HTTP_400_BAD_REQUEST)

        # Get field type from database
        field_type = self.getFieldType(column_name, table_name)
        if not field_type:
            return Response({"message": "Could not determine field type."}, status=status.HTTP_400_BAD_REQUEST)

        if field_type in ['int','float','date','datetime','tinyint']:
            min_value, max_value = self.getMinAndMaxValues(column_name, table_name)
            if min_value is None or max_value is None:
                return Response({"data": None}, status=status.HTTP_204_NO_CONTENT)
            return Response({"type": field_type, "values": {"min": min_value, "max": max_value}}, status=status.HTTP_200_OK)
        else:
            unique_values = self.getDistinctValues(column_name, table_name)
            return Response({"type": field_type, "values": list(unique_values)}, status=status.HTTP_200_OK)

    def getFieldType(self, column_name, table_name):
        conn = connectToDB()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = %s AND column_name = %s
        """, (table_name, column_name))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result[0] if result else None

    def getMinAndMaxValues(self, column_name, table_name):
        conn = connectToDB()
        cursor = conn.cursor()
        cursor.execute(f"SELECT MIN({column_name}), MAX({column_name}) FROM {table_name}")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result

    def getDistinctValues(self, column_name, table_name):
        conn = connectToDB()
        cursor = conn.cursor()
        cursor.execute(f"SELECT DISTINCT {column_name} FROM {table_name}")
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return [row[0] for row in results]

class GetAllColumnsView(APIView):
    def get(self, request):
        # Load matching_result from cache
        matching_result = cache.get('matching_result', {})

        
        if not matching_result:
            return Response({"message": "No matching result found in cache."}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({"matching_result": matching_result}, status=status.HTTP_200_OK)



class GetMappingColumnsView(APIView):   
    def get(self, request):
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response({"message": "Unauthenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        
        OPENAI_API_KEY=  ""
        self.client = OpenAI(api_key=OPENAI_API_KEY)

        # file_name = cache.get('FILE_NAME')
        # FILE_PATH = f'storage/{file_name}'
        FILE_PATH = f'storage/output.json'
        # Load the full dataframe
        try:
            sample_df = readJsonFile(FILE_PATH)
        except Exception as e:
            # print(f'[ERROR]   {e}')
            logging.error(e)
            return Response({"message": "Could not read the file!"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the columns
        columns = sample_df.columns.tolist()

        # Chuyển dòng đầu tiên của DataFrame thành dict
        sample_dict = sample_df.iloc[0].to_dict()
        sample = json.dumps(sample_dict , ensure_ascii=False, indent=4)
        schemas = json.dumps(SCHEMAS_JSON, indent=4)


        # Nếu bạn muốn xem nội dung của biến sample
        response_result = self.matching_columns(schemas,sample)
        matching_result = self.extract_json(response_result)
        # print("json ngu",extract_result)
        # matching_result = extract_result#json.loads(extract_result)

        global COLUMN_MAPPING
        COLUMN_MAPPING = matching_result

        # Lưu columns và matching_result vào cache
        save_to_cache(columns, matching_result)
        
        # # Transform matching_result to mapping format for ETL
        # source_mapping = {
        #     "source": "shopee",
        #     "matching_result": []
        # }
        # for source_field, source_detail in matching_result.items():
        #     source_mapping["matching_result"].append({
        #         "source_field": source_field,
        #         "table": source_detail["table"],
        #         "field": source_detail["field"]
        #     })

        # # Write matching_result to a JSON file
        # writeDestination = f'{STORAGE_PATH}/{source_mapping["source"]}_mapping.json'
        # writeJsonFile(source_mapping, writeDestination)
        # # Upload matching_result to minio
        # user = userdbViews.getUser(payload['id'])
        # file_uploader.uploadFile(writeDestination, user.username)

        return Response({"columns":columns,"matching_result": matching_result}, status=status.HTTP_200_OK)
    
    def extract_json(self, string):
        # Tìm vị trí bắt đầu và kết thúc của chuỗi JSON
        start = string.find('{')
        end = string.rfind('}') + 1
        # Trích xuất chuỗi JSON
        json_str = string[start:end]
        # Chuyển chuỗi JSON thành đối tượng Python
        json_obj = json.loads(json_str)
        # Trả về đối tượng JSON
        return json_obj
    
    def matching_columns(self, schemas, user_columns):

        system_config = """
        You are a data engineering chatbot. Your task is to match the user's columns with the default schemas based on similar meanings.
        If a user's column matches a default column, provide only a "tables" and a "field" it matches. Otherwise, do nothing.
        Generate the matching results for all user's columns in JSON format. Only output JSON. Do not include any other text.
        Format:
        "User's column here": {
            "table": "Default Table here",
            "field": "Default field here"
        },
        """

        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_config},
                {"role": "system", "content": schemas},
                {"role": "user", "content": user_columns}
            ],
            max_tokens=4096,
            temperature=0,
        )
        return response.choices[0].message.content
        
class UpdateColumnMappingView(APIView):
    def post(self, request):
        global COLUMN_MAPPING
        updates = request.data  # Expecting a dictionary of updates

        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response({"message": "Unauthenticated!"}, status=status.HTTP_401_UNAUTHORIZED)

        if not isinstance(updates, dict):
            return Response({"message": "Invalid data format, expecting a dictionary"}, status=status.HTTP_400_BAD_REQUEST)

        for defaultField, newField in updates.items():
            if defaultField in COLUMN_MAPPING:
                # Get the current mapping information
                current_mapping = COLUMN_MAPPING[defaultField]
                # Delete the old entry
                del COLUMN_MAPPING[defaultField]
                # Add the new entry with updated key
                COLUMN_MAPPING[newField] = current_mapping
                # Keep the original 'field' value unchanged
            else:
                continue
                # return Response({"message": f"Invalid default field: {defaultField}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Cập nhật cache với COLUMN_MAPPING
        columns, _ = load_from_cache()
        save_to_cache(columns, COLUMN_MAPPING)
        columns, matching_result = load_from_cache()

        # Transform matching_result to mapping format for ETL
        source_mapping = {
            "source": "shopee",
            "matching_result": []
        }
        for source_field, source_detail in matching_result.items():
            source_mapping["matching_result"].append({
                "source_field": source_field,
                "table": source_detail["table"],
                "field": source_detail["field"]
            })

        # Write matching_result to a JSON file
        writeDestination = f'{STORAGE_PATH}/{source_mapping["source"]}_mapping.json'
        writeJsonFile(source_mapping, writeDestination)
        # Upload matching_result to minio
        user = userdbViews.getUser(payload['id'])
        file_uploader.uploadFile(writeDestination, user.username)

        # Trigger ETL
        # Run at least 4 minutes
        result = subprocess.run(
                ["docker", "inspect", "-f", "{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}", "spark-master"],
                capture_output=True,
                text=True,
                check=True
            )
        spark_host = result.stdout.strip()
        flag_etl = spark_utils.main(user.username)
        if not flag_etl:
            return Response({"message": "Error triggering ETL."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Column mappings updated successfully"}, status=status.HTTP_200_OK)

class GetCardView(APIView):
    def get(self, request):
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response({"message": "Unauthenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Load COLUMN_MAPPING from cache
        columns, matching_result = load_from_cache()
        global COLUMN_MAPPING
        COLUMN_MAPPING = matching_result

        # Get the field and aggregation from the request
        field = request.GET.get('field', None)
        aggre = request.GET.get('agg', None)

        if not field or not aggre:
            return Response({"message": "Field and aggregation type are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Map the field using COLUMN_MAPPING
        if field in COLUMN_MAPPING:
            table = COLUMN_MAPPING[field]['table']
            original_field = COLUMN_MAPPING[field]['field']
        else:
            return Response({"message": "Invalid field."}, status=status.HTTP_400_BAD_REQUEST)

        # Collect filter parameters and map them
        where_clauses = []
        tables = {table}  # Set to keep track of all tables involved in the query
        join_conditions = []

        i = 1
        while True:
            filter_field_key = f'filter_field{i}'
            filter_field = request.GET.get(filter_field_key, None)
            if not filter_field:
                break

            # Map the filter field using COLUMN_MAPPING
            if filter_field in COLUMN_MAPPING:
                filter_table = COLUMN_MAPPING[filter_field]['table']
                filter_column = COLUMN_MAPPING[filter_field]['field']
                tables.add(filter_table)  # Add table to the set

                # Add join condition only if the tables are different
                if filter_table != table:
                    join_condition = f"{table}.product_key = {filter_table}.product_key"
                    if join_condition not in join_conditions:
                        join_conditions.append(join_condition)
            else:
                return Response({"message": f"Invalid filter field: {filter_field}."}, status=status.HTTP_400_BAD_REQUEST)

            filter_value = request.GET.get(f'filter_value{i}', None)
            if filter_value:
                values = "', '".join(filter_value.split(','))
                where_clauses.append(f"{filter_column} IN ('{values}')")
            else:
                filter_start = request.GET.get(f'filter_field{i}_start', None)
                filter_end = request.GET.get(f'filter_field{i}_end', None)
                if filter_start and filter_end:
                    where_clauses.append(f"{filter_column} BETWEEN '{filter_start}' AND '{filter_end}'")

            i += 1

        where_clause = ' AND '.join(where_clauses) if where_clauses else '1=1'
        from_clause = ', '.join(tables)
        if join_conditions:
            join_clause = ' AND '.join(join_conditions)
            where_clause = f"{join_clause} AND {where_clause}"

        # Generate the command
        cmd = self.generateAggregationQueryCard(from_clause, original_field, aggre, where_clause)
        print("cmd ngu",cmd)
        if cmd == 'Invalid':
            return Response({"data": 0}, status=status.HTTP_204_NO_CONTENT)

        # Initialize connection to db
        conn = connectToDB()
        
        # Perform a query
        try:
            cursor = conn.cursor()
            cursor.execute(cmd)
            rows = cursor.fetchall()
            # Handle data string
            data = rows[0][0]
            return Response({"data": data}, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error executing query: {e}")
            return Response({"message": "Error executing query."}, status=status.HTTP_400_BAD_REQUEST)

    # Helper function to generate aggregation query for card view
    def generateAggregationQueryCard(self, from_clause: str, field: str, aggre: str, where_clause: str):
        if aggre == 'SUM':
            query = f'SELECT SUM({field}) FROM {from_clause} WHERE {where_clause};'
        elif aggre == 'AVERAGE':
            query = f'SELECT AVG({field}) FROM {from_clause} WHERE {where_clause};'
        elif aggre == 'COUNT':
            query = f'SELECT COUNT({field}) FROM {from_clause} WHERE {where_clause};'
        elif aggre == 'DISTINCT':
            query = f'SELECT COUNT(DISTINCT {field}) FROM {from_clause} WHERE {where_clause};'
        else: 
            query = 'Invalid'
        
        return query

    


""" ----- Get Bar - Column - Pie View ----- """
class GetBCPView(APIView):
    def get(self, request):
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response({"message": "Unauthenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        
        columns, matching_result = load_from_cache()
        global COLUMN_MAPPING
        COLUMN_MAPPING = matching_result
        
        categoryfield = request.GET.get('categoryfield', None)
        valuefield = request.GET.get('valuefield', None)
        agg = request.GET.get('agg', None)
        sort_category = request.GET.get('sort_category', None)  # Mặc định DESC cho categoryfield
        sort_value = request.GET.get('sort_value', None)  # Mặc định ASC cho {agg_func}({valuefield})
        top = request.GET.get('top', None)

        if not categoryfield or not valuefield or not agg:
            return Response({"message": "Category field, value field, and aggregation type are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Map the fields using COLUMN_MAPPING
        if categoryfield in COLUMN_MAPPING:
            category_table = COLUMN_MAPPING[categoryfield]['table']
            category_field = COLUMN_MAPPING[categoryfield]['field']
        else:
            return Response({"message": "Invalid category field."}, status=status.HTTP_400_BAD_REQUEST)

        if valuefield in COLUMN_MAPPING:
            value_table = COLUMN_MAPPING[valuefield]['table']
            value_field = COLUMN_MAPPING[valuefield]['field']
        else:
            return Response({"message": "Invalid value field."}, status=status.HTTP_400_BAD_REQUEST)

        # Collect filter parameters and map them
        where_clauses = []
        
        i = 1
        while True:
            filter_field_key = f'filter_field{i}'
            filter_field = request.GET.get(filter_field_key, None)
            if not filter_field:
                break

            # Map the filter field using COLUMN_MAPPING
            if filter_field in COLUMN_MAPPING:
                filter_column = COLUMN_MAPPING[filter_field]['field']
            else:
                return Response({"message": f"Invalid filter field: {filter_field}."}, status=status.HTTP_400_BAD_REQUEST)

            filter_value = request.GET.get(f'filter_value{i}', None)
            if filter_value:
                values = "', '".join(filter_value.split(','))
                where_clauses.append(f"{filter_column} IN ('{values}')")
            else:
                filter_start = request.GET.get(f'filter_field{i}_start', None)
                filter_end = request.GET.get(f'filter_field{i}_end', None)
                if filter_start and filter_end:
                    where_clauses.append(f"{filter_column} BETWEEN '{filter_start}' AND '{filter_end}'")

            i += 1

        where_clause = ' AND '.join(where_clauses) if where_clauses else '1=1'

        conn = connectToDB()
        cmd = self.generateAggregationQueryBCP(category_table, category_field, value_table, value_field, agg, where_clause, sort_category, sort_value, top)
        if cmd == 'Invalid':
            return Response({"data": []}, status=status.HTTP_204_NO_CONTENT)

        try:
            cursor = conn.cursor()
            cursor.execute(cmd)
            rows = cursor.fetchall()
            data = [self.formatRow(row) for row in rows]
            
            if top:
                top = int(top)  # Convert the top parameter to an integer
                data = data[:top]
            
            return Response({"data": data}, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error executing query: {e}")
            return Response({"message": "Error executing query."}, status=status.HTTP_400_BAD_REQUEST)

    def generateAggregationQueryBCP(self, category_table: str, category_field: str, value_table: str, value_field: str, agg: str, where_clause: str, sort_category: str, sort_value: str, top: str):
        # Xác định hàm tổng hợp
        agg_func = ''
        if agg == 'SUM':
            agg_func = 'SUM'
        elif agg == 'AVERAGE':
            agg_func = 'AVG'
        elif agg == 'COUNT':
            agg_func = 'COUNT'
        elif agg == 'DISTINCT':
            agg_func = f'COUNT(DISTINCT {value_field})'
        else:
            return 'Invalid'

        # Xây dựng câu truy vấn với JOIN
        query = (f"SELECT {category_table}.{category_field}, {agg_func}({value_table}.{value_field}) as agg_value "
                 f"FROM fact_ecommerce_sales "
                 f"JOIN dim_product ON fact_ecommerce_sales.product_key = dim_product.product_key "
                 f"WHERE {where_clause} "
                 f"GROUP BY {category_table}.{category_field}")

        # Áp dụng sắp xếp cho categoryfield
        if sort_category:
            query += f" ORDER BY {category_table}.{category_field} {sort_category}"
        if sort_value:
            # Áp dụng sắp xếp cho giá trị được tính toán
            if not sort_category:
                query += " ORDER BY"
            else:
                query += ","
            query += f" agg_value {sort_value}"

        # Áp dụng giới hạn cho kết quả truy vấn
        if top:
            try:
                top = int(top)
                query += f" LIMIT {top}"
            except ValueError:
                return 'Invalid'
            
        return query

    # Phương thức formatRow sửa đổi
    def formatRow(self, row):
        return {"categoryfield": row[0], "valuefield": row[1]}


    
class GetDataTableView(APIView):
    def get(self, request):
        # Authentication check
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response({"message": "Unauthenticated!"}, status=status.HTTP_401_UNAUTHORIZED)

        list_field = request.GET.get('list_field')
        if not list_field:
            return Response({"message": "list_field parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Load COLUMN_MAPPING from cache
        columns, matching_result = load_from_cache()
        global COLUMN_MAPPING
        COLUMN_MAPPING = matching_result

        # Map fields using COLUMN_MAPPING
        list_fields = list_field.split(',')
        mapped_fields = []
        for field in list_fields:
            if field in COLUMN_MAPPING:
                table = COLUMN_MAPPING[field]['table']
                original_field = COLUMN_MAPPING[field]['field']
                mapped_fields.append((table, original_field))
            else:
                return Response({"message": f"Invalid field: {field}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Collect filter parameters and map them
        where_clauses = []
        tables = {field[0] for field in mapped_fields}  # Set to keep track of all tables involved in the query
        join_conditions = []

        i = 1
        while True:
            filter_field_key = f'filter_field{i}'
            filter_field = request.GET.get(filter_field_key, None)
            if not filter_field:
                break

            # Map the filter field using COLUMN_MAPPING
            if filter_field in COLUMN_MAPPING:
                filter_table = COLUMN_MAPPING[filter_field]['table']
                filter_column = COLUMN_MAPPING[filter_field]['field']
                tables.add(filter_table)  # Add table to the set

                # Add join condition only if the tables are different
                if filter_table not in tables:
                    join_condition = f"{table}.product_key = {filter_table}.product_key"
                    if join_condition not in join_conditions:
                        join_conditions.append(join_condition)
            else:
                return Response({"message": f"Invalid filter field: {filter_field}."}, status=status.HTTP_400_BAD_REQUEST)

            filter_value = request.GET.get(f'filter_value{i}', None)
            if filter_value:
                values = "', '".join(filter_value.split(','))
                where_clauses.append(f"{filter_column} IN ('{values}')")
            else:
                filter_start = request.GET.get(f'filter_field{i}_start', None)
                filter_end = request.GET.get(f'filter_field{i}_end', None)
                if filter_start and filter_end:
                    where_clauses.append(f"{filter_column} BETWEEN '{filter_start}' AND '{filter_end}'")

            i += 1

        where_clause = ' AND '.join(where_clauses) if where_clauses else '1=1'
        from_clause = ', '.join(tables)
        if join_conditions:
            join_clause = ' AND '.join(join_conditions)
            where_clause = f"{join_clause} AND {where_clause}"

        conn = connectToDB()

        # Generate the command
        cmd = self.generate_select_query(mapped_fields, from_clause, where_clause)

        try:
            cursor = conn.cursor()
            cursor.execute(cmd)
            rows = cursor.fetchall()
            data = [self.formatRow(row, [field[1] for field in mapped_fields]) for row in rows]  # Pass list_fields to formatRow

            return Response({"data": data}, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error executing query: {e}")
            return Response({"message": f"Error executing query: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
    def formatRow(self, row, fields):
        return {field: value for field, value in zip(fields, row)}

    def generate_select_query(self, mapped_fields, from_clause, where_clause):
        # Collect unique tables needed for the query
        tables = {field[0] for field in mapped_fields}
        if len(tables) == 1:
            table = tables.pop()
            select_clause = ", ".join(field[1] for field in mapped_fields)
            return f"SELECT {select_clause} FROM {table} WHERE {where_clause} LIMIT 50"
        else:
            return self.generate_complex_query(mapped_fields, tables, where_clause)

    def generate_complex_query(self, mapped_fields, tables, where_clause):
        primary_table = list(tables)[0]
        join_conditions = []
        for table in tables:
            if table != primary_table:
                join_conditions.append(f"JOIN {table} ON {primary_table}.product_key = {table}.product_key")
        join_clause = " ".join(join_conditions)
        select_clause = ", ".join(f"{field[0]}.{field[1]}" for field in mapped_fields)
        return f"SELECT {select_clause} FROM {primary_table} {join_clause} WHERE {where_clause} LIMIT 50"
    

class GetChatBotView(APIView):
    def get(self, request):
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response({"message": "Unauthenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        
        OPENAI_API_KEY=""
        self.client = OpenAI(api_key=OPENAI_API_KEY)

        # Load COLUMN_MAPPING from cache
        columns, matching_result = load_from_cache()
        global COLUMN_MAPPING
        COLUMN_MAPPING = json.dumps(matching_result, indent=4)

        user_prompt = request.GET.get('prompt')

        retries = 2
        for attempt in range(retries):
            try:
                response_text = self.generate_query(COLUMN_MAPPING, user_prompt)
                print(response_text)
                json_result = self.extract_json(response_text)
                message_text = json_result.get('message')
                hint_text = json_result.get('hint')
                query_text = json_result.get('query')
                
                if not query_text or query_text == "NULL":
                    result = {"message": message_text, "data": "", "hint": hint_text}
                    return Response(result, status=status.HTTP_200_OK)

                conn = connectToDB()
                try:
                    cursor = conn.cursor()
                    cursor.execute(query_text)
                    rows = cursor.fetchall()

                    if not rows:
                        raise ValueError("không có dữ liệu phù hợp cho yêu cầu của bạn.")

                    # Fetch column names
                    column_names = [desc[0] for desc in cursor.description]

                    # Convert rows to a list of dictionaries
                    data = [dict(zip(column_names, row)) for row in rows]

                    if data:
                        result = {"message": message_text, "data": data, "hint": hint_text}
                        return Response(result, status=status.HTTP_200_OK)

                except Exception as e:
                    logging.error(f"Error executing query: {e}")
                    raise ValueError("yêu cầu truy vấn của bạn không thể thực hiện được.")
                finally:
                    cursor.close()
                    conn.close()
            except ValueError as e:
                result = {"message": message_text + f" Rất tiếc vì {str(e)}", "data": "", "hint": hint_text}
                if attempt >= retries - 1:
                    break  # Thoát vòng lặp nếu đây là lần thử cuối cùng

        return Response(result, status=status.HTTP_400_BAD_REQUEST)
    
    def extract_json(self, string):
        # Tìm vị trí bắt đầu và kết thúc của chuỗi JSON
        start = string.find('{')
        end = string.rfind('}') + 1
        # Trích xuất chuỗi JSON
        json_str = string[start:end]
        # Chuyển chuỗi JSON thành đối tượng Python
        json_obj = json.loads(json_str)
        # Trả về đối tượng JSON
        return json_obj
    
    def generate_query(self, schemas, user_prompt):

        system_config = """You are chatbot about data analyst. You will write query MySQL. But you don't say about MySQL. 
        Respond format json like this:
        {"message":Short describe how to query the data for non-tech users, 
        "query": insert SQL command here on oneline, always LIMIT 100 
        "hint":list of 3 questions help user can ask about data, related of user prompt, format like this ["","",""]}"
        If user ask vague question with you, talk something to instruct how to use in "message" and return "" in "query" and list 3 questions in "hint" 
        Answer by the language of user
        """

        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_config},
                {"role": "system", "content": schemas},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=4096,
            temperature=0,
        )
        return response.choices[0].message.content
