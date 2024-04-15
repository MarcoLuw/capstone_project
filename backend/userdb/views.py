from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
# from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import DatabaseConnectionSerializer, FileUploadSerializer
from authentication.models import User
from django.core.files.storage import default_storage


import minio_connector.file_uploader as file_uploader
import psycopg2
import pymysql
import jwt
import os

from .processData import ProcessData
# Create your views here.

ROOT_PATH = os.path.dirname(os.path.abspath(__file__))
# STORAGE_PATH = os.path.join(ROOT_PATH, 'storage')

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
        if not isAuth:
            return Response({"Error": "Unauthenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = FileUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file = serializer.validated_data['file']
        filepath = self.saveFile(file)

        """ Processing area for the file """    
        # Upload data to frontend for preview
        dataProcessor = ProcessData(file)
        json_data = dataProcessor.getSampleDataUI()

        # Upload the file to MinIO
        user = getUser(payload['id'])
        access_key, secret_key = file_uploader.generate_dynamic_credentials(user.username)

        upload_result = file_uploader.uploadFile(filepath, user.username)
        if not upload_result:
            return Response({"Error": "Could not upload the file."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "File uploaded successfully.", "data": json_data}, status=status.HTTP_200_OK)

    def saveFile(self, file):
        if not os.path.exists(ROOT_PATH + '/storage'):
            os.makedirs(ROOT_PATH + '/storage', exist_ok=True)
        with open(ROOT_PATH + '/storage/' + file.name, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        return ROOT_PATH + '/storage/' + file.name
        