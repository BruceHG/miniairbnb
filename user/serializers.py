from rest_framework import serializers
from user.models import User, Host


class profileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'avatar', 'status')
        
class loginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'avatar', 'status')
        
class registerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'avatar','firstname', 'lastname', 'birthday',)
        
class guestDetailSerializer(serializers.ModelSerializer):
    guest_c_time = serializers.DateTimeField(source='c_time')
    class Meta:
        model = User
        fields = ('username', 'email', 'status', 'avatar','firstname', 'lastname', 'birthday', 'guest_c_time',)

class hostDetailSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    status = serializers.IntegerField(source='user.status')
    avatar = serializers.CharField(source='user.avatar')
    firstname = serializers.CharField(source='user.firstname')
    lastname = serializers.CharField(source='user.lastname')
    birthday = serializers.DateField(source='user.birthday')
    guest_c_time = serializers.DateTimeField(source='user.c_time')
    host_c_time = serializers.DateTimeField(source='c_time')
    class Meta:
        model = Host
        fields = ('username', 'email', 'status', 'avatar','firstname', 'lastname', 'birthday', 'guest_c_time',
                  'phone', 'rating', 'host_c_time',)