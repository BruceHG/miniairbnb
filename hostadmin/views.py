from hostadmin.models import HostRequest
from user.models import Host, User
from hostadmin.serializers import hostRequestSerializer, newRequestSerializer

from django.contrib.auth import authenticate

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status

@api_view(['GET'])
def hostAdmin(request):
    try:
#        data = request.data
        all_request = hostRequestSerializer(HostRequest.objects.all(), many=True)
        result = {
                'code': status.HTTP_200_OK,
                'msg': 'host request list',
                'data': all_request.data,
                }
    
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])

@api_view(['POST'])
def approve(request):
    try:
        approve_request = newRequestSerializer(data = request.data)
        approve_request.is_valid()
        data = approve_request.data
        target = User.objects.get(username = data['username'])
        HostRequest.objects.get(user = target, username = data['username'], phone = data['phone']).delete()
        new_host = Host(user = target,
                        phone = data['phone'])
        new_host.save()
        target.host_status = 1
        target.save()
        
        result = {
                'code': status.HTTP_200_OK,
                'msg': 'host request approved',
                'data': {'username': data['username']},
                }
    except User.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'user not found',
        }
    except HostRequest.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'host request mismatch',
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])

@api_view(['POST'])
def adminLogin(request):
    try:
        data = request.data
        username = data['username']
        password = data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
#                login(request, user)
                result = {
                    'code': status.HTTP_200_OK,
                    'msg': 'admin login successful',
                    'data': {'username': username},
                }
            else:
                raise Exception('inactive admin')
        else:
            raise Exception('invalid login info')
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])
