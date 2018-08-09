from django.shortcuts import render, get_object_or_404
from user.models import User
from user.forms import UserUpdateForm
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from user.serializers import UserUpdateSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET', 'POST'])
def profile(request, format=None):
    if request.session.get('current_user', None):
        current_user = request.session.get('current_user', None)
#        message = 'Login successful, welcome '
#        current_user_info = User.objects.get(username = current_user)
        
        if request.method == 'GET':
            current_user_info = get_object_or_404(User, username = current_user)
            serializer = UserUpdateSerializer(current_user_info)
            return Response(serializer.data)
        
        
#        current_user_info = get_object_or_404(User, username = current_user)
#        userform = UserUpdateForm(instance = current_user_info)
#        for f in userform.fields:
#            userform.fields[f].widget.attrs['disabled'] = True
#        
#        context = {
#                'message': message + current_user_info.firstname,
#                'form': userform
#                }
#        return render(request, 'user/profile.html', context)
    context = {
            'login_message': 'Login'
            }
    return render(request, 'login/login.html', context)
