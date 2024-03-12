from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import DatabaseConnectionSerializer
import pymysql
import psycopg2

# Create your views here.
class ImportDataView(APIView):
    def post(self, request):
        serializer = DatabaseConnectionSerializer(data=request.data)
        if serializer.is_valid():
            engine = serializer.validated_data['engine']
            name = serializer.validated_data['name']
            user = serializer.validated_data['user']
            password = serializer.validated_data['password']
            host = serializer.validated_data['host']
            port = serializer.validated_data['port']

            return Response({"message": "Data imported succesfully."}, status=status.HTTP_200_OK)

            if engine == 'postgresql':
                conn = psycopg2.connect(database=name, user=user, password=password, host=host, port=port)
            elif engine == 'mysql':
                conn = pymysql.connect(database=name, user=user, password=password, host=host, port=port)
            else:
                return Response({"Error": "Unsupported database engine."}, status=status.HTTP_400_BAD_REQUEST)

            cursor = conn.cursor()
            cursor.execute("SELECT * FROM some_table")
            rows = cursor.fetchall()

            for row in rows:
                pass

            conn.close()
            return Response({"message": "Data imported succesfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def getDefaultDatabasePort(self, engine):
        default_ports = {
            'postgresql': 5432,
            'mysql': 3306,
        }
        return default_ports[engine]