from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
# from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import DatabaseConnectionSerializer, FileUploadSerializer
from authentication.models import User
from django.core.files.storage import default_storage
from data_service import file_uploader, create_user

import logging
import psycopg2
import pymysql
import jwt
import os
from django.core.cache import cache

from .processData import ProcessData
# Create your views here.

# Config logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s: [%(levelname)s] - %(message)s')

FILE_PATH = os.path.dirname(os.path.abspath(__file__))
# ROOT PATH is empty because the file is in the root directory already 
# Reference to the backend/dockerfile
# STORAGE_PATH = ROOT_PATH + '/storage'
ROOT_PATH = ''


# Get the user from the token
def getUser(id: int):
    user = User.objects.filter(id=id).first()
    return user

# Check if the user is authenticated
def isAuthenticate(request):
    token = request.COOKIES.get('jwt')
    # Check if the token exists
    if not token:
        raise AuthenticationFailed('Token not existed - Unauthenticated!')
    
    try:
        # Decode the token
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Incompatible token - Unauthenticated!')
    
    # Get the user from the payload
    user = getUser(payload['id'])
    if not user:
        raise AuthenticationFailed('User not found!')
    return True, payload

""" Import data from a database """
class ImportDataView(APIView):
    def post(self, request):
        serializer = DatabaseConnectionSerializer(data=request.data)
        if serializer.is_valid():
            engine = serializer.validated_data['engine']
            name = serializer.validated_data['name']
            user = serializer.validated_data['user']
            password = serializer.validated_data['password']
            host = serializer.validated_data['host']
            port = serializer.validated_data.get('port', self.getDefaultDatabasePort(engine))

            # return Response({"message": "Data imported succesfully."}, status=status.HTTP_200_OK)
            print (engine, name, user, password, host, port)
            if engine == 'postgresql':
                try:
                    conn = psycopg2.connect(database=name, user=user, password=password, host=host, port=port)
                except:
                    return Response({"Error": "Could not connect to the database."}, status=status.HTTP_400_BAD_REQUEST)
            elif engine == 'mysql':
                try:
                    conn = pymysql.connect(database=name, user=user, password=password, host=host, port=port)
                except:
                    return Response({"Error": "Could not connect to the database."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"Error": "Unsupported database engine."}, status=status.HTTP_400_BAD_REQUEST)

            cursor = conn.cursor()
            cursor.execute("SELECT * FROM test limit 10;")
            rows = cursor.fetchall()

            for row in rows:
                print(row)

            conn.close()
            return Response({"message": "Data imported succesfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def getDefaultDatabasePort(self, engine):
        default_ports = {
            'postgresql': 5432,
            'mysql': 3306,
        }
        return default_ports[engine]
    
""" Import data from a file """
class ImportDataFromFileView(APIView):
    # parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        # if 'file' not in request.FILES:
        #     return Response({"Error": "No file was uploaded."}, status=status.HTTP_400_BAD_REQUEST)
        isAuth, payload = isAuthenticate(request)
        print(f'Payload: {payload}')
        if not isAuth:
            return Response({"Error": "Unauthenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = FileUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file = serializer.validated_data['file']
        print(f'File name: {file.name}')
        filepath = self.saveFile(file)

        """ Processing area for the file """    
        # Upload data to frontend for preview
        dataProcessor = ProcessData(file)
        json_data = dataProcessor.getSampleDataUI()

        # Upload the file to MinIO
        user = getUser(payload['id'])
        print(f'User info: {user}')
        print(f'User name: {user.username}')
        
        # Check if the user exists in MinIO
        if not create_user.is_user_exists(user.username):
            create_user.create_user_and_set_policy(user.username)
            logging.info(f'User {user.username} created successfully')
        
        upload_result = file_uploader.uploadFile(filepath, user.username)
        if not upload_result:
            return Response({"Error": "Could not upload the file."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "File uploaded successfully.", "data": json_data}, status=status.HTTP_200_OK)

    def saveFile(self, file):
        storage_path = os.path.normpath(os.path.join(ROOT_PATH, 'storage'))
        print(f'Storage path: {storage_path}')
        print(f'Check file: {os.path.exists(storage_path)}')
        if not os.path.exists(storage_path):
            print(f'Create storage path: {storage_path}')
            os.makedirs(storage_path, exist_ok=True)
        filepath = os.path.normpath(os.path.join(storage_path, file.name))
        with open(filepath, 'wb+') as destination:
            destination.write(b'')
            for chunk in file.chunks():
                destination.write(chunk)
        cache.set('FILE_NAME', file.name, timeout=None)
        return filepath

""" Read the dashboard state of the user """
class DashboardStateView(APIView):
    def get(self, request):
        isAuth, payload = isAuthenticate(request)
        if not isAuth:
            return Response({"Error": "Unauthenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = getUser(payload['id'])
        dashboard_data = user.dashboard_state
        return Response({"visualist": dashboard_data}, status=status.HTTP_200_OK)

    def post(self, request):
        isAuth, payload = isAuthenticate(request)
        if not isAuth:
            return Response({"Error": "Unauthenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = getUser(payload['id'])
        user.dashboard_state = request.data
        user.save()
        return Response({"message": "Dashboard state saved successfully."}, status=status.HTTP_200_OK)