from django.db import models


class User(models.Model):
    def __str__(self):
        return self.username
    
    u_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=20, default = '123456')
    firstname = models.CharField(max_length=20, default = 'John')
    lastname = models.CharField(max_length=20, default = 'Doe')
    birthday = models.DateField()
    email = models.EmailField(unique=True)
    
    c_time = models.DateTimeField(auto_now_add=True)

class Host(models.Model):
    
    h_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, unique=True)
    rating = models.PositiveIntegerField(default = 0)
    
    c_time = models.DateTimeField(auto_now_add=True)
