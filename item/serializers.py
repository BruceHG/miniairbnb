from rest_framework import serializers
from item.models import Item

class itemDetailSerializers(serializers.ModelSerializer):
    username = serializers.CharField(source='owner.user.username')
    avatar = serializers.CharField(source='owner.user.avatar')
#    rating = serializers.IntegerField(source='owner.rating')
    class Meta:
        model = Item
        fields = ('i_id', 'username', 'avatar', 'title', 'desc', 'i_type', 'price_per_day', 'guest_num', 'bedroom_num', 'bed_num',
                  'bathroom_num', 'address', 'latitude', 'longitude', 'rating', 'rules', 'album', 'features',)

class searchResultSerializers(serializers.ModelSerializer):
    username = serializers.CharField(source='owner.user.username')
#    rating = serializers.IntegerField(source='owner.rating')
    class Meta:
        model = Item
        fields = ('i_id', 'username', 'title', 'i_type', 'price_per_day', 'rating', 'album_first', 'address', 'latitude', 'longitude',)
        
class availableSerializers(serializers.ModelSerializer):
    max_guests = serializers.CharField(source='guest_num')
    available_date = serializers.CharField(source='avaliable')
    class Meta:
        model = Item
        fields = ('max_guests', 'available_date',)
        
class itemUpdateSerializers(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('title', 'desc', 'i_type', 'price_per_day', 'avaliable', 'guest_num', 'bedroom_num', 'bed_num', 'bathroom_num',
                  'address', 'rules', 'features')
        
class adsSerializers(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('i_id', 'title', 'price_per_day', 'album_first', 'address',)


