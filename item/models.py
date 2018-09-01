from django.db import models
from user.models import Host

class Item(models.Model):
    
    House = 0
    Flat = 1
    Apartment = 2
    Townhouse = 3
    Others = 4
    item_type = (
        (House, 'House'),
        (Flat, 'Flat'),
        (Apartment, 'Apartment'),
        (Townhouse, 'Townhouse'),
        (Others, 'Others'),
    )
    
    R1 = 0
    R2 = 1
    R3 = 2
    cancellation_rules = (
        (R1, 'free cancel'),
        (R2, 'free cancel before 24h'),
        (R3, 'charging 10% for cancellation'),
    )
    
    Wifi = '0'
    Parking = '1'
    Nonsmoking = '2'
    feature_type = {
            Wifi: "Wi-Fi",
            Parking: "Parking",
            Nonsmoking: "non-smoking"
            }
    
    
    i_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(Host, on_delete=models.CASCADE)
    
    i_type = models.IntegerField(
        choices = item_type,
        default = House,
        )
    title = models.CharField(max_length=100)
    album_first = models.TextField(null=True)
    album = models.TextField(null=True)
    desc = models.CharField(max_length=100, null=True)
    adv_desc = models.CharField(max_length=1000, null=True)
    address = models.CharField(max_length=100)
    longitude = models.CharField(max_length=100, null=True)
    latitude = models.CharField(max_length=100, null=True)
    
    avaliable = models.TextField(null=True)
#    checkin = models.DateField(auto_now_add=True)
#    checkout = models.DateField(auto_now_add=True)
    price_per_day = models.PositiveIntegerField()
    guest_num = models.PositiveIntegerField(default = 1)
    bedroom_num = models.PositiveIntegerField(default = 0)
    bed_num = models.PositiveIntegerField(default = 0)
    bathroom_num = models.PositiveIntegerField(default = 0)
    features = models.TextField(null=True)
    rules = models.IntegerField(
        choices = cancellation_rules,
        default = R1,
        )
    c_time = models.DateTimeField(auto_now=True)














