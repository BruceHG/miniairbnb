from django.db.models import Q

from user.models import User, Host
from hostadmin.serializers import newRequestSerializer
from hostadmin.models import HostRequest

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status

@api_view(['PUT'])
def becomeHost(request):
    try:
#        data = JSONParser().parse(request)
        newRequest = newRequestSerializer(data = request.data)
        newRequest.is_valid()
        data = newRequest.data
        current_user_info = User.objects.get(username = data['username'])
        if current_user_info.host_status == 1:
            raise Exception('you already are a host')
        elif current_user_info.host_status == 2:
            raise Exception('this user is waiting for authentication')
        else:
            hostfilter = Host.objects.filter(phone=data['phone'])
            if len(hostfilter) > 0:
                raise Exception('this phone number has been used')
            requestfilter = HostRequest.objects.filter(phone=data['phone'])
            if len(requestfilter) > 0:
                raise Exception('this phone number has been used')
            request = HostRequest(user = current_user_info, 
                                  username = current_user_info.username,
                                  email = current_user_info.email,
                                  phone = data['phone'])
            request.save()
            current_user_info.host_status = 2
            current_user_info.save()
            result = {
                    'code': status.HTTP_200_OK,
                    'msg': 'request has been sent',
                    'data': {'username': data['username']},
                    }
    except User.DoesNotExist:
        result = {
                'code': status.HTTP_400_BAD_REQUEST,
                'msg': 'user not found',
                'data': {'username': data['username']},
                }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
            'data': {'username': data['username']},
        }
    return Response(result, status=result['code'])
    

        
        
        
        
    
