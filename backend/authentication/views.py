from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from .models import User

import minio_connector.file_uploader as file_uploader
import jwt, datetime

# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        
        # Check if the user exists
        user = User.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('User not found!')
        # Check if the password is correct
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')
        
        # Generate the JWT token
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60), # expire in 60 minutes
            'iat': datetime.datetime.utcnow() # issued at
        }

        # Encode the payload with the secret key
        # payload : the data we want to encode
        # 'secret' : the secret key
        # algorithm : the algorithm we want to use
        # jwt.encode() returns a string
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        access_key, secret_key = file_uploader.generate_dynamic_credentials(user.username)

        response = Response()

        # Set the cookie with the token
        # httponly : the cookie cannot be accessed by javascript
        response.set_cookie(key='jwt', value=token, httponly=True)

        response.data = {
            'jwt': token,
            'message': 'success'
        }

        # Return the token
        return response

# Get the user from the token
class UserView(APIView):
    def get(self, request):
        # Get the token from the cookie
        token = request.COOKIES.get('jwt')

        # Check if the token exists
        if not token:
            raise AuthenticationFailed('Token not existed! Unauthenticated!')
        
        try:
            # Decode the token
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Incompatible token! Unauthenticated!')
        
        # Get the user from the payload
        user = User.objects.filter(id=payload['id']).first()
        if not user:
            raise AuthenticationFailed('User not found!')
        
        serializer = UserSerializer(user)
        print(type(user))
        return Response(serializer.data)

# Logout
class LogoutView(APIView):
    def post(self, request):
        # Delete the cookie
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response