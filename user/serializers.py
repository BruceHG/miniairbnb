from rest_framework import serializers
from user.models import User


class profileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('avatar', 'username', 'firstname', 'lastname', 'birthday', 'email', 'host_status')
        
class loginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password',)
        
class registerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('avatar', 'username', 'password', 'firstname', 'lastname', 'birthday', 'email',)