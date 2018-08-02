from django.shortcuts import render
from user.models import User
from django.http import HttpResponseRedirect
from django.urls import reverse

def login(request):
#    username = request.POST['username']
#    password = request.POST['password']
#    if username and password:
#        request.session['current_user'] = username
#        try:
#            loginUser = User.objects.get(username = username)
#        except User.DoesNotExist:
#            context = {
#                'login_massage': 'Login',
#                'error_massage': 'Unsername does not exist!'
#                }
#            return render(request, 'login/login.html', context)
#        if loginUser.password == password:
#            context = {
#                    'username': username,
#                    'password': password
#                    }
#            return HttpResponseRedirect(reverse('User:profile'))
#    #        return render(request, 'login/loginVerify.html', context)
#        else:
#            context = {
#                'login_massage': 'Login',
#                'error_massage': 'Wrong password!'
#                }
#            return render(request, 'login/login.html', context)
    
    context = {
            'login_message': 'Login'
            }
    return render(request, 'login/login.html', context)

def loginVerify(request):
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
        context = {
                'username': username,
                'password': password
                }
        return HttpResponseRedirect(reverse('User:profile'))
#        return render(request, 'login/loginVerify.html', context)
    else:
        context = {
            'login_message': 'Login',
            'error_message': 'Wrong password!'
            }
        return render(request, 'login/login.html', context)
