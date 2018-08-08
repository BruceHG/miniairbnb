from django.db import models


class User(models.Model):
    def __str__(self):
        return self.username
    
    u_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=20)
    firstname = models.CharField(max_length=20)
    lastname = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    c_time = models.DateTimeField(auto_now_add=True)

class Host(models.Model):
    def __str__(self):
        return self.username
    
    h_id = models.AutoField(primary_key=True)
    u_id = models.ForeignKey(User, on_delete=models.CASCADE)
    c_time = models.DateTimeField(auto_now_add=True)
