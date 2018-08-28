from django.db.models import Q

from user.models import User, Host
from user.serializers import profileSerializer, guestDetailSerializer, hostDetailSerializer
from hostadmin.models import HostRequest

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status

@api_view(['PUT'])
def becomeHost(request):
    try:
#        data = JSONParser().parse(request)
        username = request.META.get("HTTP_USERNAME")
        phone = request.data['phone']
        current_user_info = User.objects.get(username = username)
        if current_user_info.status == User.HOST:
            raise Exception('you already are a host')
        elif current_user_info.status == User.HOST_PENDING:
            raise Exception('this user is waiting for authentication')
        else:
            hostfilter = Host.objects.filter(phone=phone)
            if len(hostfilter) > 0:
                raise Exception('this phone number has been used')
            requestfilter = HostRequest.objects.filter(phone=phone)
            if len(requestfilter) > 0:
                raise Exception('this phone number has been used')
            request = HostRequest(user = current_user_info, 
                                  phone = phone)
            request.save()
            current_user_info.status = User.HOST_PENDING
            current_user_info.save()
            profile = profileSerializer(current_user_info)
            result = {
                    'code': status.HTTP_200_OK,
                    'msg': 'request has been sent',
                    'data': profile.data,
                    }
    except User.DoesNotExist:
        result = {
                'code': status.HTTP_400_BAD_REQUEST,
                'msg': 'user not found',
                }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])

@api_view(['GET'])
def profile(request):
    try:
        username = request.META.get("HTTP_USERNAME")
        target = User.objects.get(username = username)
        if target.status == User.HOST:
            host = Host.objects.get(user = target)
            profile = hostDetailSerializer(host)
        else:
            profile = guestDetailSerializer(target)
        result = {
                'code': status.HTTP_200_OK,
                'msg': 'request has been sent',
                'data': profile.data,
                }
    except User.DoesNotExist:
        result = {
                'code': status.HTTP_400_BAD_REQUEST,
                'msg': 'user not found',
                }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])
    

        
        
        
        
    
