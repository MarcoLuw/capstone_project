from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache

import userdb.views as userdbViews

import logging
import pandas as pd
import json
import pymysql
# Create your views here.

# Demo information
FILE_PATH = 'storage/dim_store.csv'

# Config logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s: [%(levelname)s] - %(message)s')

# Define The NUMERIC_FIELDS and AGGREGATION_OPTIONS
NUMERIC_FIELDS = [
                'order_key', 'order_number', 'order_line_number', 'order_date', 
                'order_time', 'customer_key', 'store_key', 'product_key', 
                'unit_price', 'unit_cost', 'order_quantity', 'total_sale'
                ]

AGGREGATION_OPTIONS = ['SUM', 'AVERAGE', 'COUNT', 'DISTINCT']

def readCsvFile(filepath: str) -> pd.DataFrame:
    # Read the CSV file
    df = pd.read_csv(filepath)
    return df

def readJsonFile(filepath: str):
    # Read the JSON file
    with open(filepath, 'r') as f:
        data = json.load(f)
    return data

def loadDataFrame(filepath: str) -> pd.DataFrame:
    # Try to read the cache
    # df = readCsvFile(cache_key)
    file_name = FILE_PATH.split('/')[-1]
    cache_key = file_name
    # print(f'[INFO]    File to be use: {file_name}')
    logging.info(f'Load Full DataFrame from: {FILE_PATH}')
    logging.info(f'File to be use: {file_name}')

    df = cache.get(cache_key)
    if df is None:
        logging.info(f'Cache miss for {cache_key}')
        logging.info(f'Reading the file {filepath}')
        try:
            # Read the CSV file and set the cache
            df = readCsvFile(filepath)
            cache.set(cache_key, df, timeout=60*60*24)
            logging.info(f'Read Successfully! Cache set for {cache_key}')
        except Exception as e:
            logging.error(e)
            logging.error(f'Could not read the file {filepath}')
    else:
        logging.info(f'Cache hit for {cache_key}')
        logging.info(f'Get the data from cache for {cache_key}')
    return df

def connectToDB():
    # Database connection information
    server = 'host.docker.internal'
    database = 'dw'
    username = 'root'
    password = 'root'

    # Create the connection string
    connection_string = {
        'host': server,
        'user': username,
        'password': password,
        'database': database
    }

    # Connect to the database
    try:
        conn = pymysql.connect(**connection_string)
        logging.info("Connection successful")
    except Exception as e:
        logging.error(f"Error connecting to the database: {e}")
        exit()

    return conn


class GetALLColumnsView(APIView):
    def get(self, request):
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response({"message": "Unauthenticated!"}, status=status.HTTP_401_UNAUTHORIZED)

        # Load the full dataframe
        try:
            full_df = loadDataFrame(FILE_PATH)
        except Exception as e:
            # print(f'[ERROR]   {e}')
            logging.error(e)
            return Response({"message": "Could not read the file!"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the columns
        columns = full_df.columns.tolist()
        
        return Response({"columns": columns}, status=status.HTTP_200_OK)


class GetCardView(APIView):
    def get(self, request):
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response({"message": "Unauthenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get the field and aggregation from the request
        field = request.GET.get('field', None)
        aggre = request.GET.get('agg', None)

        # print(f'Field: {field}, Aggregation: {aggre}')

        # Get command
        cmd = self.generateAggregationQueryCard(field, aggre)
        if cmd == 'Invalid':
            return Response({"data": 0}, status=status.HTTP_204_NO_CONTENT)

        # Initialize connection to db
        conn = connectToDB()
        # return Response({"message": "Connect to DB successfully."}, status=status.HTTP_200_OK)
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


    # helper function to generate aggregation query for card view
    def generateAggregationQueryCard(self, field: str, aggre: str):
        if field not in NUMERIC_FIELDS and aggre in ['SUM', 'AVERAGE']:
            return 'Invalid'
        
        if aggre == 'SUM':
            query = f'SELECT SUM({field}) FROM fact_ecommerce_sales;'
        elif aggre == 'AVERAGE':
            query = f'SELECT AVG({field}) FROM fact_ecommerce_sales;'
        elif aggre == 'COUNT':
            query = f'SELECT COUNT({field}) FROM fact_ecommerce_sales;'
        elif aggre == 'DISTINCT':
            query = f'SELECT COUNT(DISTINCT {field}) FROM fact_ecommerce_sales;'
        else: 
            query = 'Invalid'
        
        return query


""" ----- Get Bar - Column - Pie View ----- """
class GetBCPView(APIView):
    def get(self, request):
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response({"message": "Unauthenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get the field, valuefield and aggregation from the request
        categoryfield = request.GET.get('categoryfield', None)
        valuefield = request.GET.get('valuefield', None)
        agg = request.GET.get('agg', None)

        # Initialize connection to db
        conn = connectToDB()

        # Get command
        cmd = self.generateAggregationQueryBCP(categoryfield, valuefield, agg)
        if cmd == 'Invalid':
            return Response({"data": []}, status=status.HTTP_204_NO_CONTENT)
        
        # Perform a query
        try:
            cursor = conn.cursor()
            cursor.execute(cmd)
            rows = cursor.fetchall()
            # Handle data string
            data = []
            for row in rows:
                categoryfield, value = row
                data.append({'categoryfield': categoryfield, 'value': value})
            return Response({"data": data}, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error executing query: {e}")
            return Response({"message": "Error executing query."}, status=status.HTTP_400_BAD_REQUEST)

    
    def generateAggregationQueryBCP(self, categoryfield: str, valuefield: str, agg: str):
        if categoryfield not in NUMERIC_FIELDS and valuefield not in NUMERIC_FIELDS:
            return 'Invalid'

        if valuefield in NUMERIC_FIELDS and agg not in AGGREGATION_OPTIONS:
            return 'Invalid'
        
        if agg == 'SUM':
            query = f'SELECT {categoryfield}, SUM({valuefield}) as sum_value FROM fact_ecommerce_sales GROUP BY {categoryfield} ORDER BY sum_value DESC LIMIT 10;'
        elif agg == 'AVERAGE':
            query = f'SELECT {categoryfield}, AVG({valuefield}) as avg_value FROM fact_ecommerce_sales GROUP BY {categoryfield} ORDER BY avg_value DESC LIMIT 10;'
        elif agg == 'COUNT':
            query = f'SELECT {categoryfield}, COUNT({valuefield}) as count_value FROM fact_ecommerce_sales GROUP BY {categoryfield} ORDER BY count_value DESC LIMIT 10;'
        elif agg == 'DISTINCT':
            query = f'SELECT {categoryfield}, COUNT(DISTINCT {valuefield}) as distinct_value FROM fact_ecommerce_sales GROUP BY {categoryfield} ORDER BY distinct_value DESC LIMIT 10;'
        else: 
            query = 'Invalid'
        
        return query