from hostadmin.models import HostRequest
from user.models import Host, User
from hostadmin.serializers import hostRequestSerializer
from user.serializers import loginSerializer


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status

@api_view(['GET'])
def hostAdmin(request):
    try:
#        data = request.data
        admin = request.META.get("HTTP_USERNAME")
        User.objects.get(username = admin, status = User.ADMIN)
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
        admin = request.META.get("HTTP_USERNAME")
        User.objects.get(username = admin, status = User.ADMIN)
        username = (request.data['username'])
        target = User.objects.get(username = username)
        applicant = HostRequest.objects.get(user = target)
        new_host = Host(user = target,
                        phone = applicant.phone)
        new_host.save()
        applicant.delete()
        target.status = User.HOST
        target.save()
        result = {
                'code': status.HTTP_200_OK,
                'msg': 'host request approved',
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
def decline(request):
    try:
        admin = request.META.get("HTTP_USERNAME")
        User.objects.get(username = admin, status = User.ADMIN)
        username = (request.data['username'])
        target = User.objects.get(username = username)
        applicant = HostRequest.objects.get(user = target)
        applicant.delete()
        target.status = User.GUEST
        target.save()
        result = {
                'code': status.HTTP_200_OK,
                'msg': 'request has been declined',
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
