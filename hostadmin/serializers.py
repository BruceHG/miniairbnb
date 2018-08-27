from rest_framework import serializers
from hostadmin.models import HostRequest


class hostRequestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    avatar = serializers.CharField(source='user.avatar')
    class Meta:
        model = HostRequest
        fields = ('username', 'avatar', 'phone',)