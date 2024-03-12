from rest_framework import serializers

class DatabaseConnectionSerializer(serializers.Serializer):
    engine = serializers.ChoiceField(choices=[
        ('postgresql', 'PostgreSQL'),
        ('mysql', 'MySQL'),
        ('sqlite', 'SQLite'),
    ])

    name = serializers.CharField(max_length=100)
    user = serializers.CharField(max_length=100)
    password = serializers.CharField(style={'input_type': 'password'})
    host = serializers.CharField(max_length=100)
    port = serializers.IntegerField()