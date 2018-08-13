from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse

from user.models import User
from user.forms import UserCreateForm

def login(request):
    if request.session.get('current_user', None):
        return HttpResponseRedirect(reverse('User:profile'))
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        try:
            loginUser = User.objects.get(username = username)
        except User.DoesNotExist:
            context = {
                'login_message': 'Login',
                'error_message': 'Unsername does not exist!'
                }
            return render(request, 'login/login.html', context)
        
        if loginUser.password == password:
            request.session['current_user'] = username
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
    
def register(request):
    if request.session.get('current_user', None):
        return HttpResponseRedirect(reverse('User:profile'))
    if request.method == "POST":
        userform = UserCreateForm(request.POST)
        if userform.is_valid():
            user = userform.save()
            request.session['current_user'] = user.username
        
        return HttpResponseRedirect(reverse('User:profile'))
    
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
    
    
    
