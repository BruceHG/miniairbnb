from rest_framework import serializers
from order.models import Order

class ordersSerializers(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('o_id', 'user', 'checkin', 'checkout', 'guest_num', 'price_per_day', 'comment',)

