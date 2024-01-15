from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']

        # Hide the password from the API
        extra_kwargs = {'password': {'write_only': True}}
    
    # Overwrite the create method to hash the password
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            # Hash the password
            instance.set_password(password)
        instance.save()
        return instance
