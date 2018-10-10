from django.db import models
from item.models import Item
from user.models import User

class Order(models.Model):
    o_id = models.AutoField(primary_key=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    checkin = models.DateField()
    checkout = models.DateField()
    guest_num = models.PositiveIntegerField(default = 1)
    price_per_day = models.PositiveIntegerField()   #a copy of item.price_per_day
    comment = models.TextField(max_length=200)
    
    c_time = models.DateTimeField(auto_now_add=True)
    item_ctime = models.DateTimeField()  #a copy of item.c_time
    
    Pending = 0
    Accepted = 1
    Completed = 2
    Rejected = 3
    Completed_and_rated = 4
    status_type = (
        (Pending, 'Pending'),
        (Accepted, 'Accepted'),
        (Completed, 'Completed'),
        (Rejected, 'Rejected'),
        (Completed_and_rated, 'Completed_and_rated'),
    )
    status = models.IntegerField(
        choices = status_type,
        default = Pending,
        )

    rating =  models.IntegerField(default = None, null=True)