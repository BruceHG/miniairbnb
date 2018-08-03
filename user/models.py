from django.db import models


class User(models.Model):
    def __str__(self):
        return self.firstname
    
    username = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=200)
    firstname = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    c_time = models.DateTimeField(auto_now_add=True)
#    gender = (
#        ('male'),
#        ('female'),
#    )
#
#    username = models.CharField(max_length=200)
#    password = models.CharField(max_length=256)
#    firstname = models.CharField(max_length=200)
#    lastname = models.CharField(max_length=200)
#    email = models.EmailField(unique=True)
#    sex = models.CharField(max_length=32,choices=gender,default='male')
#    c_time = models.DateTimeField(auto_now_add=True)
#
#    def __str__(self):
#        return self.name
#
#    class Meta:
#        ordering = ['c_time']
##        verbose_name = '用户'
##        verbose_name_plural = '用户'
