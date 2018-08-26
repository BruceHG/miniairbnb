from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse
from user.models import User, Host
from hostadmin.models import HostRequest

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status

#def profile(request):
#    if request.session.get('current_user', None):
#        current_user = request.session.get('current_user', None)
#        message = 'Login successful, welcome '
#        current_user_info = get_object_or_404(User, username = current_user)
#        userform = UserUpdateForm(instance = current_user_info)
#        for f in userform.fields:
#            userform.fields[f].widget.attrs['disabled'] = True
#        
#        context = {
#                'message': message + current_user_info.firstname,
#                'form': userform
#                }
#        try:
#            Host.objects.get(user = current_user_info.u_id)
#            context['host'] = 1
#        except Host.DoesNotExist:
#            context['host'] = 0
#        return render(request, 'user/profile.html', context)
#    context = {
#            'login_message': 'Login'
#            }
#    return render(request, 'login/login.html', context)

@api_view(['POST'])
def becomeHost(request):
    try:
#        data = JSONParser().parse(request)
        data = request.data
        username = data['username']
        current_user_info = get_object_or_404(User, username = username)
        try:
            Host.objects.get(user = current_user_info)
            result = {
                    'code': status.HTTP_400_BAD_REQUEST,
                    'msg': 'you already are a host',
                    'data': {'user': username},
                    }
        except Host.DoesNotExist:
            phone = data['phone']
            request = HostRequest(user = current_user_info, 
                                      username = current_user_info.username,
                                      email = current_user_info.email,
                                      phone = phone)
            request.save()
            result = {
                    'code': status.HTTP_200_OK,
                    'msg': 'request has been sent',
                    'data': {'user': username},
                    }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])
    

        
        
        
        
    
