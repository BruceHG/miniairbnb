from rest_framework import serializers
from user.models import User

class UserCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('username', 'password', 'firstname', 'lastname', 'birthday', 'email',)
        
class UserUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'firstname', 'lastname', 'email',)

