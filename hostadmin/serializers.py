from rest_framework import serializers
from hostadmin.models import HostRequest


class hostRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = HostRequest
        fields = ('username', 'email', 'phone',)