from rest_framework import serializers
from order.models import Order

class requestsSerializers(serializers.ModelSerializer):
    title = serializers.CharField(source='item.title')
    class Meta:
        model = Order
        fields = ('title', 'o_id', 'user', 'checkin', 'checkout', 'guest_num', 'price_per_day', 'comment',)

class ordersSerializers(serializers.ModelSerializer):
    title = serializers.CharField(source='item.title')
    class Meta:
        model = Order
        fields = ('title', 'o_id', 'item', 'checkin', 'checkout', 'guest_num', 'price_per_day', 'comment',)