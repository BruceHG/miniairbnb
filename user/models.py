from django.db import models

class User(models.Model):
    def __str__(self):
        return self.username
    
    GUEST = 0
    HOST_PENDING = 1
    HOST = 2
    ADMIN = 3
    user_status = (
        (GUEST, 'guest'),
        (HOST_PENDING, 'host_pending'),
        (HOST, 'host'),
        (ADMIN, 'admin'),
    )

    u_id = models.AutoField(primary_key=True)
    avatar = models.CharField(max_length=200, null=True)
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=20)
    firstname = models.CharField(max_length=20, null=True)
    lastname = models.CharField(max_length=20, null=True)
    birthday = models.DateField(null=True)
    email = models.EmailField(unique=True)
    status = models.IntegerField(choices=user_status, default=GUEST)
    c_time = models.DateTimeField(auto_now_add=True)


class Host(models.Model):

    h_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, unique=True)
#    rating = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)

    c_time = models.DateTimeField(auto_now_add=True)
