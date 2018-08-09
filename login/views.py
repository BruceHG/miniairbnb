from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse

from user.models import User
from user.forms import UserCreateForm

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from user.serializers import UserCreateSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

def login(request):
    if request.session.get('current_user', None):
        return HttpResponseRedirect(reverse('User:profile'))
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        request.session['current_user'] = username
        try:
            loginUser = User.objects.get(username = username)
        except User.DoesNotExist:
            context = {
                'login_message': 'Login',
                'error_message': 'Unsername does not exist!'
                }
            return render(request, 'login/login.html', context)
        
        if loginUser.password == password:
            return HttpResponseRedirect(reverse('User:profile'))
        else:
            context = {
                'login_message': 'Login',
                'error_message': 'Wrong password!'
                }
            return render(request, 'login/login.html', context)
    context = {
            'login_message': 'Login'
            }
    return render(request, 'login/login.html', context)

@api_view(['GET', 'POST'])
def register(request, format=None):
    if request.session.get('current_user', None):
        return HttpResponseRedirect(reverse('User:profile'))
#    if request.method == "POST":
#        userform = UserCreateForm(request.POST)
#        if userform.is_valid():
#            user = userform.save()
#            request.session['current_user'] = user.username
#        return HttpResponseRedirect(reverse('User:profile'))
        
    if request.method == 'POST':
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
    else:
        userform = UserCreateForm()
        context = {
                'message': 'Register',
                'form': userform
                }
        return render(request, 'login/register.html', context)

def logout(request):
    request.session['current_user'] = None
    hello_message = 'Welcome to miniAirbnb, logout.'
    context = {
            'hello_message': hello_message
            }
    return render(request, 'homepage/index.html', context)
    
    
    
