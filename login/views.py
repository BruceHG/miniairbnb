from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status

from user.models import User
from user.serializers import loginSerializer, profileSerializer, registerSerializer


@api_view(['POST'])
def login(request):
    try:
#        data = JSONParser().parse(request)
        data = request.data
        login_user = loginSerializer(data = request.data)
        login_user.is_valid()
        data = login_user.data
        user = User.objects.get(username = data['username'])
        if user.password == data['password']:
            profile = profileSerializer(user)
            result = {
                'code': status.HTTP_200_OK,
                'msg': 'Successful login',
                'data': profile.data,
            }
        else:
            raise Exception('Wrong password')
    except User.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'User not found',
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])


@api_view(['POST'])
def register(request):
    try:
#        data = JSONParser().parse(request)
        new_user = registerSerializer(data = request.data)
        data = new_user.initial_data
        filterResult = User.objects.filter(
            Q(username=data['username']) | Q(email=data['email']))
        for u in filterResult:
            if u.username == data['username']:
                raise Exception('username has been registered')
            if u.email == data['email']:
                raise Exception('email has been registered')
        new_user.is_valid()
        new_user.save()
        print(new_user.validated_data)
        profile = profileSerializer(User.objects.get(username = data['username']))
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'Successful register',
            'data': profile.data,
        }
    except User.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'User not found',
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])
