from rest_framework import serializers
from item.models import Item

class itemDetailSerializers(serializers.ModelSerializer):
    username = serializers.CharField(source='owner.user.username')
    rating = serializers.IntegerField(source='owner.rating')
    class Meta:
        model = Item
        fields = ('i_id', 'username', 'title', 'desc', 'i_type', 'price_per_day', 'guest_num', 'bedroom_num', 'bed_num',
                  'bathroom_num', 'address', 'latitude', 'longitude', 'rating', 'rules', 'album', 'features',)

class searchResultSerializers(serializers.ModelSerializer):
    username = serializers.CharField(source='owner.user.username')
    rating = serializers.IntegerField(source='owner.rating')
    class Meta:
        model = Item
        fields = ('i_id', 'username', 'title', 'i_type', 'price_per_day', 'rating', 'album_first', 'address', 'latitude', 'longitude',)


