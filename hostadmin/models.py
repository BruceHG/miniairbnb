from django.db import models
from user.models import User

class HostRequest(models.Model):
    r_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, unique=True)
#    status = models.BooleanField(default = False)