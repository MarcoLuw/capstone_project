from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import DatabaseConnectionSerializer, FileUploadSerializer
import pymysql
import psycopg2
import os
# Create your views here.

ROOT_PATH = os.path.dirname(os.path.abspath(__file__))
# STORAGE_PATH = os.path.join(ROOT_PATH, 'storage')

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
                conn = pymysql.connect(database=name, user=user, password=password, host=host, port=port)
            else:
                return Response({"Error": "Unsupported database engine."}, status=status.HTTP_400_BAD_REQUEST)

            # cursor = conn.cursor()
            # cursor.execute("SELECT * FROM some_table")
            # rows = cursor.fetchall()

            # for row in rows:
            #     pass

            # conn.close()
            return Response({"message": "Data imported succesfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def getDefaultDatabasePort(self, engine):
        default_ports = {
            'postgresql': 5432,
            'mysql': 3306,
        }
        return default_ports[engine]
    
class ImportDataFromFileView(APIView):
    # parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        # if 'file' not in request.FILES:
        #     return Response({"Error": "No file was uploaded."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = FileUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file = serializer.validated_data['file']
        self.saveFile(file)

        """ Processing area for the file """

        return Response({"message": "File uploaded successfully."}, status=status.HTTP_200_OK)

    def saveFile(self, file):
        if not os.path.exists(ROOT_PATH + '/storage'):
            os.makedirs(ROOT_PATH + '/storage', exist_ok=True)
        with open(ROOT_PATH + '/storage/' + file.name, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        return ROOT_PATH + '/' + file.name
        

    # def post(self, request, *args, **kwargs):
        # serializer = FileUploadSerializer(data=request.data)
        # if serializer.is_valid():
        #     file = serializer.validated_data['file']
            

        #     """ Processing area for the file """

        #     return Response({"message": "File uploaded successfully."}, status=status.HTTP_200_OK)
        
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)