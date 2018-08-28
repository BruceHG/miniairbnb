from django.db import models
from enum import IntEnum


class UserStatus(IntEnum):
    GUEST = 0
    HOST_PENDING = 1
    HOST = 2
    ADMIN = 3


class User(models.Model):
    def __str__(self):
        return self.username

    u_id = models.AutoField(primary_key=True)
    avatar = models.CharField(max_length=200, null=True)
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=20)
    firstname = models.CharField(max_length=20, null=True)
    lastname = models.CharField(max_length=20, null=True)
    birthday = models.DateField(null=True)
    email = models.EmailField(unique=True)
    status = models.IntegerField(default=UserStatus.GUEST)
    c_time = models.DateTimeField(auto_now_add=True)


class Host(models.Model):

    h_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, unique=True)
    rating = models.PositiveIntegerField(default=0)

    c_time = models.DateTimeField(auto_now_add=True)
