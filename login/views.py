from django.shortcuts import render
from user.models import User
from django.http import HttpResponseRedirect
from django.urls import reverse

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
    
def register(request):
    if request.session.get('current_user', None):
        return HttpResponseRedirect(reverse('User:profile'))
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        firstname = request.POST['firstname']
        lastname = request.POST['lastname']
        email = request.POST['email']
        new_user = User(
                username = username,
                password = password,
                firstname = firstname,
                lastname = lastname,
                email = email
                )
        new_user.save()
        request.session['current_user'] = username
        return HttpResponseRedirect(reverse('User:profile'))
    
    context = {
            'message': 'Register'
            }
    return render(request, 'login/register.html', context)

def logout(request):
    request.session['current_user'] = None
    hello_message = 'Welcome to miniAirbnb, logout.'
    context = {
            'hello_message': hello_message
            }
    return render(request, 'homepage/index.html', context)
    
    
    
