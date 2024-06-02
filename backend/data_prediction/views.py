from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
import userdb.views as userdbViews
import data_analysis.views as dataAnalysisViews
from datetime import datetime


import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import joblib
import numpy as np
from tensorflow.keras.models import load_model
from mlxtend.frequent_patterns import association_rules, fpgrowth
from mlxtend.preprocessing import TransactionEncoder
import os
import logging

# --------------------------------------------------
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s: [%(levelname)s] - %(message)s')

# --------------------------------------------------
    
def loadModel():
    # Load the model
    model_path = os.path.dirname(os.path.abspath(__file__)) + '/models/LSTM_Combine.hdf5'
    model = load_model(model_path)
    return model

def getData(conn, start_date=None, end_date=None):
    # Get data from database
    cursor = conn.cursor()
    cmd = ""
    if start_date is None or end_date is None:
        cmd = f"""
        SELECT 
            fs.product_key, 
            dp.product_name, 
            fs.order_date, 
            SUM(fs.order_quantity) AS total_quantity 
        FROM 
            shopee_fact_sales fs
        JOIN 
            dim_product dp ON fs.product_key = dp.product_key
        GROUP BY 
            fs.product_key, 
            dp.product_name, 
            fs.order_date
        """
    else:
        cmd = f"""
        SELECT 
            fs.product_key, 
            dp.product_name, 
            fs.order_date, 
            SUM(fs.order_quantity) AS total_quantity 
        FROM 
            shopee_fact_sales fs
        JOIN 
            dim_product dp ON fs.product_key = dp.product_key
        WHERE 
            fs.order_date BETWEEN '{start_date}' AND '{end_date}'
        GROUP BY 
            fs.product_key, 
            dp.product_name, 
            fs.order_date
        """
    # Specify column names
    cursor.execute(cmd)
    rows = cursor.fetchall()
    conn.close()
    
    # Specify column names
    columns = ['product_key', 'product_name', 'order_date', 'total_quantity']
    df = pd.DataFrame(rows, columns=columns)
    
    return df

def processingAndPredict(model, df: pd.DataFrame):
    # Khởi tạo DataFrame để lưu kết quả
    results_df = pd.DataFrame(columns=['order_date', 'product_key', 'product_name', 'current_total_quantity', 'predict_total_quantity', 'growth'])
    look_back = 3

    # Loại bỏ cột order_date trước khi trả về
    df_predict = df.drop(columns=['product_name'])  
    print("df_predict", df_predict.head(10))
    
    # Tạo danh sách chứa tất cả các product_key
    list_product_key = df['product_key']
    
    # Duyệt qua các sản phẩm trong list_product_key
    for product_key in list_product_key[:10]:
        # Chọn một sản phẩm để phân tích
        product_example = df_predict[df_predict['product_key'] == product_key]
        
        if product_example.empty:
            continue
        
        product_example = product_example.sort_values('total_quantity')

        # Lấy dữ liệu total_quantity
        sales_data = product_example['total_quantity'].values
        
        scaler = MinMaxScaler()
        sales_data_scaled = scaler.fit_transform(sales_data.reshape(-1, 1))

        # Lấy dữ liệu ngày cuối cùng và chuẩn bị cho mô hình LSTM
        last_data = sales_data_scaled[-look_back:].reshape((1, look_back, 1))

        # Dự đoán cho 5 ngày tiếp theo
        for _ in range(5):
            next_quantity = model.predict(last_data)
            last_data = np.append(last_data[:, 1:, :], next_quantity.reshape(1, 1, 1), axis=1)

        # Lấy dự đoán cho ngày cuối cùng và tính toán tăng trưởng
        final_prediction = scaler.inverse_transform(next_quantity)
        last_actual = sales_data[-1]
        growth = ((final_prediction[0, 0] - float(last_actual)) / float(last_actual)) * 100

        # Lấy product_name từ DataFrame ban đầu bằng cách sử dụng product_key
        product_name = df[df['product_key'] == product_key]['product_name'].values[0]

        # Thêm dữ liệu vào DataFrame kết quả
        new_row = pd.DataFrame({
            'order_date': [product_example['order_date'].values[-1]],  # Thêm order_date vào để sắp xếp
            'product_key': [product_key],
            'product_name': [product_name],
            'current_total_quantity': [last_actual],
            'predict_total_quantity': [final_prediction[0, 0]],
            'growth': [growth]
        })
        results_df = pd.concat([results_df, new_row], ignore_index=True)
    
    # Hiển thị kết quả và loại bỏ cột order_date
    results_df = results_df.sort_values("growth", ascending=False)
    results_df = results_df.drop(columns=['order_date'])  # Loại bỏ cột order_date trước khi trả về
    return results_df

# Create your views here.
class PredictDataView(APIView):
    def get(self, request):
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response('Unauthenticated!', status=status.HTTP_401_UNAUTHORIZED)
        user = userdbViews.getUser(payload['id'])
        # Load model
        try:
            model = loadModel()
            logging.info('Model loaded successfully')
        except Exception as e:
            logging.error(e)
            return Response('Could not load the model', status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Initial database connection
        conn = dataAnalysisViews.connectToDB(user.username)
        if conn is None:
            return Response('Could not connect to the database', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        start_date = request.GET.get('start_date', None)
        end_date = request.GET.get('end_date', None)
        data = getData(conn, start_date, end_date)
        result = processingAndPredict(model, data)
        return Response(result.to_dict(orient='records'), status=status.HTTP_200_OK)
    
class GetBasketDataView(APIView):
    def get(self, request):
        # Authentication check
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response({"message": "Unauthenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        user = userdbViews.getUser(payload['id'])

        # Get start_date and end_date from request parameters
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        if not start_date or not end_date:
            return Response({"message": "start_date and end_date parameters are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Convert dates to datetime objects to ensure correct format
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return Response({"message": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Columns to be selected
        selected_columns = [
            "shopee_fact_sales.order_number",
            "shopee_fact_sales.product_key",
            "dim_product.product_name"
        ]

        # Generate the SQL query
        from_clause = "shopee_fact_sales JOIN dim_product ON shopee_fact_sales.product_key = dim_product.product_key"
        where_clause = f"order_date BETWEEN '{start_date}' AND '{end_date}'"
        select_clause = ", ".join(selected_columns)

        query = f"SELECT {select_clause} FROM {from_clause} WHERE {where_clause} LIMIT 50"

        conn = dataAnalysisViews.connectToDB(user.username)

        try:
            cursor = conn.cursor()
            cursor.execute(query)
            rows = cursor.fetchall()
            data = [self.formatRow(row, selected_columns) for row in rows]

            # Chuyển đổi kết quả thành DataFrame
            df = pd.DataFrame(data)

            # Áp dụng luật kết hợp fpgrowth
            result = self.apply_fpgrowth(df)
            
            return Response({"data": result}, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error executing query: {e}")
            return Response({"message": f"Error executing query: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
    def formatRow(self, row, fields):
        # Strip table names from field names for the response
        stripped_fields = [field.split('.')[-1] for field in fields]
        return {field: value for field, value in zip(stripped_fields, row)}

    def apply_fpgrowth(self, df):
        # Nhóm sản phẩm theo order_number và tạo danh sách các sản phẩm mua trong mỗi đơn hàng
        grouped = df.groupby('order_number')['product_key'].apply(list)

        # Sử dụng TransactionEncoder để chuyển đổi dữ liệu
        te = TransactionEncoder()
        te_ary = te.fit(grouped).transform(grouped)
        basket = pd.DataFrame(te_ary, columns=te.columns_)

        # Chuyển đổi số lượng thành dữ liệu nhị phân
        basket_sets = basket.applymap(lambda x: 1 if x else 0)

        # Áp dụng FP-growth để tìm các itemsets thường xuyên
        frequent_itemsets = fpgrowth(basket_sets, min_support=0.005, use_colnames=True)

        # Lọc các itemsets có độ dài không quá 2
        frequent_itemsets = frequent_itemsets[frequent_itemsets['itemsets'].apply(lambda x: len(x) <= 2)]

        # Tạo luật kết hợp từ các itemsets thường xuyên
        rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.1)

        # Giả sử pro là DataFrame chứa các cột 'product_key' và 'product_name'
        product_keys = df['product_key'].unique()
        product_names = df['product_name'].unique()
        pro = pd.DataFrame({
            'product_key': product_keys,
            'product_name': product_names
        })
        product_map = pro.set_index('product_key')['product_name'].to_dict()

        # Thay thế antecedents và consequents trong rules bằng tên sản phẩm
        rules['antecedents'] = rules['antecedents'].apply(lambda x: self.map_product_name(x, product_map))
        rules['consequents'] = rules['consequents'].apply(lambda x: self.map_product_name(x, product_map))

        # Select and rename the appropriate columns
        output = rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']]
        output.columns = ['When buying this product', 'Customers also often buy', 'Appear together in (%)', 'Likelihood of buying together (%)', 'Buy together more often than usual (times)']
        output['Appear together in (%)'] = (output['Appear together in (%)'] * 100).round(2)
        output['Likelihood of buying together (%)'] = (output['Likelihood of buying together (%)'] * 100).round(2)

        # Convert frozensets to strings for display
        output['When buying this product'] = output['When buying this product'].apply(lambda x: ', '.join(x))
        output['Customers also often buy'] = output['Customers also often buy'].apply(lambda x: ', '.join(x))

        return output.to_dict(orient='records')

    def map_product_name(self, itemset, product_map):
        return frozenset(product_map[item] for item in itemset)
    
class GetCustomerDataView(APIView):
    def get(self, request):
        # Authentication check
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response({"message": "Unauthenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        user = userdbViews.getUser(payload['id'])

        # Get start_date and end_date from request parameters
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        if not start_date or not end_date:
            return Response({"message": "start_date and end_date parameters are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Convert dates to datetime objects to ensure correct format
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return Response({"message": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate the SQL query
        recent_date_query = f"(SELECT MAX(order_date) FROM shopee_fact_sales WHERE order_date BETWEEN '{start_date}' AND '{end_date}')"
        
        # Columns to be selected from dim_customer
        customer_columns = [
            "dim_customer.customer_key",
            "dim_customer.first_name",
            "dim_customer.last_name"
        ]

        # Columns to be selected from shopee_fact_sales
        selected_columns = [
            "DATEDIFF(" + recent_date_query + ", MAX(shopee_fact_sales.order_date)) AS recency",
            "COUNT(shopee_fact_sales.order_date) AS frequency",
            "SUM(shopee_fact_sales.total_sale) AS monetary"
        ]

        # Generate the SQL query
        from_clause = "shopee_fact_sales JOIN dim_customer ON shopee_fact_sales.customer_key = dim_customer.customer_key"
        where_clause = f"shopee_fact_sales.order_date BETWEEN '{start_date}' AND '{end_date}'"
        select_clause = ", ".join(customer_columns + selected_columns)
        group_by_clause = ", ".join(customer_columns)

        query = f"""
        SELECT {select_clause}
        FROM {from_clause}
        WHERE {where_clause}
        GROUP BY {group_by_clause}
        LIMIT 50
        """

        conn = dataAnalysisViews.connectToDB(user.username)

        try:
            cursor = conn.cursor()
            cursor.execute(query)
            rows = cursor.fetchall()
            data = [self.formatRow(row, cursor.description) for row in rows]

            # Chuyển đổi kết quả thành DataFrame
            df = pd.DataFrame(data)

            # Áp dụng mô hình RFM để phân khúc khách hàng
            result, segment_count = self.apply_rfm(df)
            
            return Response({"segment_count": segment_count, "data": result}, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error executing query: {e}")
            return Response({"message": f"Error executing query: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
    def formatRow(self, row, description):
        # Lấy tên các cột từ cursor.description
        columns = [col[0] for col in description]
        return {columns[i]: value for i, value in enumerate(row)}

    def apply_rfm(self, df):
        # Chuyển đổi các cột recency, frequency, và monetary sang kiểu float
        df["recency"] = df["recency"].astype(float)
        df["frequency"] = df["frequency"].astype(float)
        df["monetary"] = df["monetary"].astype(float)

        # Tính điểm RFM
        df["recency_score"] = pd.qcut(df["recency"], 5, labels=[5, 4, 3, 2, 1])
        df["frequency_score"] = pd.qcut(df["frequency"].rank(method="first"), 5, labels=[1, 2, 3, 4, 5])
        df["monetary_score"] = pd.qcut(df["monetary"], 5, labels=[1, 2, 3, 4, 5])

        df["rfm_score"] = df["recency_score"].astype("str") + df["frequency_score"].astype("str") + df["monetary_score"].astype("str")

        # Định nghĩa các phân khúc khách hàng
        seg_map = {
            r'[4-5][4-5]5': 'VIP Customer',
            r'[4-5]5[1-4]': 'Loyal Customer',
            r'[4-5][2-3][4-5]': 'Potential Customer',
            r'[4-5]1[1-5]': 'New Customer',
            r'[1-2][3-4][1-5]': 'At-Risk Customer',
            r'[1-2][1-2][1-5]': 'Lost Customer'
        }

        df['segment'] = df['rfm_score'].replace(seg_map, regex=True)

        # Kiểm tra và gán 'General Customer' cho những giá trị không khớp
        df['segment'] = df['segment'].apply(lambda x: 'General Customer' if x == x and x not in seg_map.values() else x)

        # Tính số lượng của từng phân khúc
        segment_count_series = df['segment'].value_counts()
        segment_count = [{"categoryfield": seg, "valuefield": count} for seg, count in segment_count_series.items()]

        # Loại bỏ các cột tính điểm trước khi trả về kết quả
        df = df.drop(columns=["recency_score", "frequency_score", "monetary_score", "rfm_score"])

        # Đảm bảo cột 'segment' ở cuối DataFrame
        columns = [col for col in df.columns if col != 'segment'] + ['segment']
        df = df[columns]

        # Chuyển đổi DataFrame thành dict để trả về JSON
        result = df.to_dict(orient='records')
        return result, segment_count
