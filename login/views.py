from django.shortcuts import render

def login(request):
    login_massage = 'Login'
    context = {
            'login_massage': login_massage
            }
    return render(request, 'login/login.html', context)

def loginVerify(request):
    username = request.POST['username']
    password = request.POST['password']
    context = {
            'username': username,
            'password': password
            }
    return render(request, 'login/loginVerify.html', context)
