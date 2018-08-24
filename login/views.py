import json
from django.http import HttpResponse
from user.models import User
from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status

def __dict2reponse(result):
    return HttpResponse(json.dumps(result), status=result['code'])


#def login1(request):
#    result = {}
#    try:
#        data = json.loads(request.body)
#        username = data['username']
#        password = data['password']
#        try:
#            user = User.objects.get(username=username)
#        except User.DoesNotExist:
#            result = {
#                'msg': 'User not found',
#                'success': False,
#                'code': 400
#            }
#            return __dict2reponse(result)
#
#        if user.password == password:
#            result = {
#                'msg': 'Success login',
#                'data': {'user': username},
#                'success': True,
#                'code': 200
#            }
#        else:
#            result = {
#                'msg': 'Wrong password',
#                'success': False,
#                'code': 400
#            }
#    except Exception as e:
#        result = {
#            'msg': str(e),
#            'success': False,
#            'code': 400
#        }
#
#    return __dict2reponse(result)

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
                    'msg': 'User not found',
                    'success': False
                    }
            s = status.HTTP_400_BAD_REQUEST
        if user.password == password:
            result = {
                    'msg': 'Success login',
                    'success': True
                    }
            s = status.HTTP_200_OK
        else:
            result = {
                    'msg': 'Wrong password',
                    'success': False
                    }
            s = status.HTTP_400_BAD_REQUEST
    except Exception as e:
        result = {
            'msg': str(e),
            'success': False,
        }
        s = status.HTTP_400_BAD_REQUEST
    return Response(result, status = s)



#def register(request):
#    result = {}
#    try:
#        data = json.loads(request.body)
#
#        filterResult = User.objects.filter(
#            Q(username=data['username']) | Q(email=data['email']))
#        if len(filterResult) > 0:
#            result = {
#                'msg': 'User exists',
#                'success': False,
#                'code': 400
#            }
#        else:
#            User.objects.create(username=data['username'],
#                                password=data['password'],
#                                firstname=data['firstname'],
#                                lastname=data['lastname'],
#                                birthday=data['birthday'],
#                                email=data['email'])
#            result = {
#                'msg': 'Success register',
#                'data': {'user': data['username']},
#                'success': True,
#                'code': 200
#            }
#    except Exception as e:
#        result = {
#            'msg': str(e),
#            'success': False,
#            'code': 400
#        }
#    return __dict2reponse(result)

@api_view(['POST'])
def register(request):
    try:
        data = JSONParser().parse(request)

        filterResult = User.objects.filter(
            Q(username=data['username']) | Q(email=data['email']))
        if len(filterResult) > 0:
            result = {
                'msg': 'User exists',
                'success': False
            }
            s = status.HTTP_400_BAD_REQUEST
        else:
            User.objects.create(username=data['username'],
                                password=data['password'],
                                firstname=data['firstname'],
                                lastname=data['lastname'],
                                birthday=data['birthday'],
                                email=data['email'])
            result = {
                'msg': 'Success register',
                'data': {'user': data['username']},
                'success': True
            }
            s = status.HTTP_200_OK
    except Exception as e:
        result = {
            'msg': str(e),
            'success': False
        }
        s = status.HTTP_400_BAD_REQUEST
    return Response(result, status = s)
