import json
from django.http import HttpResponse
from user.models import User
from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status


@api_view(['POST'])
def login(request):
    try:
        data = JSONParser().parse(request)
        username = data['username']
        password = data['password']
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            result = {
                'code': status.HTTP_400_BAD_REQUEST,
                'msg': 'User not found',
            }
        if user.password == password:
            result = {
                'code': status.HTTP_200_OK,
                'msg': 'Success login',
                'data': {'user': username},
            }
        else:
            result = {
                'code': status.HTTP_400_BAD_REQUEST,
                'msg': 'Wrong password',
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
        data = JSONParser().parse(request)
        filterResult = User.objects.filter(
            Q(username=data['username']) | Q(email=data['email']))
        if len(filterResult) > 0:
            result = {
                'code': status.HTTP_400_BAD_REQUEST,
                'msg': 'User exists',
            }
        else:
            User.objects.create(username=data['username'],
                                password=data['password'],
                                firstname=data['firstname'],
                                lastname=data['lastname'],
                                birthday=data['birthday'],
                                email=data['email'])
            result = {
                'code': status.HTTP_200_OK,
                'msg': 'Success register',
                'data': {'user': data['username']},
            }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])
