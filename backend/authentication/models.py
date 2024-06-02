from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    # save json format to dashboard_state column, it can be empty
    dashboard_state = models.JSONField(default=dict)

    # This one is necessary for login with email (unique email)
    USERNAME_FIELD = 'email'
    # These below fields are not necessary because we use AbstractUser
    REQUIRED_FIELDS = []

    """These below function is not necessary because we use AbstractUser"""
    # # Hash the password before saving the user
    # def set_password(self, password):
    #     self.password = make_password(password)

    # # Check the password against the stored hash
    # def check_password(self, password):
    #     self.password = check_password(password, self.password)

    class Meta:
        db_table= 'User'