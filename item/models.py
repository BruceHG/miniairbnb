from django.db import models
from user.models import Host

class Item(models.Model):
    i_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(Host, on_delete=models.CASCADE)
    item_type = (
        ('Flat', 'Flat'),
        ('House', 'House'),
        ('Apartment', 'Apartment'),
    )
    i_type = models.CharField(
        max_length = 10,
        choices = item_type,
        default = 'House',
    )
    title = models.CharField(max_length=100)
    album = models.TextField()
    desc = models.CharField(max_length=100)
    adv_desc = models.CharField(max_length=1000)
    address = models.CharField(max_length=100)
    longitude = models.CharField(max_length=100, null=True)
    latitude = models.CharField(max_length=100, null=True)
    
    avaliable = models.DurationField()
#    checkin = models.DateField(auto_now_add=True)
#    checkout = models.DateField(auto_now_add=True)
    price_per_day = models.PositiveIntegerField()
    guest_num = models.PositiveIntegerField(default = 1)
    bedroom_num = models.PositiveIntegerField(default = 0)
    bed_num = models.PositiveIntegerField(default = 0)
    bathroom_num = models.PositiveIntegerField(default = 0)

    wifi = models.BooleanField(default = False)
    smoking = models.BooleanField(default = False)
    other_facilities = models.TextField()
    cancellation_rules = (
        ('R1', 'R1'),
        ('R2', 'R2'),
        ('R3', 'R3'),
    )
    cancellation = models.CharField(
        max_length = 10,
        choices = cancellation_rules,
        default = 'R1',
    )
    
    c_time = models.DateTimeField(auto_now=True)














