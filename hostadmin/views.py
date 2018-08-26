from django.shortcuts import render, get_object_or_404
from hostadmin.models import HostRequest
from user.models import Host, User
from hostadmin.serializers import hostRequestSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status

@api_view(['POST'])
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
        data = request.data
        username = data['username']
        phone = data['phone']
        target = get_object_or_404(User, username = username)
        new_host = Host(user = target,
                        phone = phone)
        new_host.save()
        HostRequest.objects.get(user = target).delete()
        result = {
                'code': status.HTTP_200_OK,
                'msg': 'host request approved',
                'data': {'user': data['username']},
                }
    
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])
