from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
import userdb.views as userdbViews
import data_analysis.views as dataAnalysisViews


import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import joblib
import numpy as np
from tensorflow.keras.models import load_model
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
        cmd = f"""SELECT product_key, order_date, SUM(order_quantity) AS total_quantity FROM fact_ecommerce_sales_copy GROUP BY product_key, order_date;"""
    else:
        cmd = f"""SELECT product_key, order_date, SUM(order_quantity) AS total_quantity FROM fact_ecommerce_sales_copy WHERE order_date BETWEEN '{start_date}' AND '{end_date}' GROUP BY product_key, order_date;"""
    cursor.execute(cmd)
    rows = cursor.fetchall()
    conn.close()
    df = pd.DataFrame(rows)
    return df

def processingAndPredict(model, df: pd.DataFrame):
    # Khởi tạo DataFrame để lưu kết quả
    results_df = pd.DataFrame(columns=['order_date', 'product_key', 'current_total_quantity', 'predict_total_quantity', 'growth'])
    look_back = 3
    # Duyệt qua các sản phẩm từ 1 đến 10 (Test trước 10 sản phẩm)
    for product_key in range(1, 11):
        # Chọn một sản phẩm để phân tích
        product_example = df[df[0] == product_key]
        product_example = product_example.sort_values(1)

        # Lấy dữ liệu total_quantity
        sales_data = product_example[2].values
        scaler = MinMaxScaler()
        sales_data_scaled = scaler.fit_transform(sales_data.reshape(-1, 1))

        # Lấy dữ liệu ngày cuối cùng và chuẩn bị cho mô hình LSTM
        last_data = sales_data_scaled[-look_back:].reshape((1, look_back, 1))

        # Dự đoán cho 30 ngày tiếp theo
        for _ in range(30):
            next_quantity = model.predict(last_data)
            last_data = np.append(last_data[:, 1:, :], next_quantity.reshape(1, 1, 1), axis=1)

        # Lấy dự đoán cho ngày thứ 30 và tính toán tăng trưởng
        final_prediction = scaler.inverse_transform(next_quantity)
        last_actual = sales_data[-1]
        growth = ((final_prediction[0, 0] - float(last_actual)) / float(last_actual)) * 100

        # Thêm dữ liệu vào DataFrame
        new_row = pd.DataFrame({
            'order_date': [product_example[1].iloc[-1]],
            'product_key': [product_key],
            'current_total_quantity': [last_actual],
            'predict_total_quantity': [final_prediction[0, 0]],
            'growth': [growth]
        })
        results_df = pd.concat([results_df, new_row], ignore_index=True)
    # Hiển thị kết quả
    results_df = results_df.sort_values("growth", ascending=False)
    return results_df

# Create your views here.
class PredictDataView(APIView):
    def get(self, request):
        isAuth, payload = userdbViews.isAuthenticate(request)
        if not isAuth:
            return Response('Unauthenticated!', status=status.HTTP_401_UNAUTHORIZED)
        
        # Load model
        try:
            model = loadModel()
            logging.info('Model loaded successfully')
        except Exception as e:
            logging.error(e)
            return Response('Could not load the model', status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Initial database connection
        conn = dataAnalysisViews.connectToDB()
        if conn is None:
            return Response('Could not connect to the database', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        start_date = request.GET.get('start_date', None)
        end_date = request.GET.get('end_date', None)
        data = getData(conn, start_date, end_date)
        result = processingAndPredict(model, data)
        return Response(result.to_dict(orient='records'), status=status.HTTP_200_OK)
