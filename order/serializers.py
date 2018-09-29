from rest_framework import serializers
from order.models import Order

class requestsSerializers(serializers.ModelSerializer):
    title = serializers.CharField(source='item.title')
    album_first = serializers.CharField(source='item.album_first')
    class Meta:
        model = Order
        fields = ('title', 'album_first', 'o_id', 'user', 'checkin', 'checkout', 'guest_num', 'price_per_day', 'comment',)

class ordersSerializers(serializers.ModelSerializer):
    title = serializers.CharField(source='item.title')
    class Meta:
        model = Order
        fields = ('title', 'album_first', 'o_id', 'item', 'checkin', 'checkout', 'guest_num', 'price_per_day', 'comment',)