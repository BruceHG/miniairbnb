from django.shortcuts import render
from user.models import User

def profile(request):
    if request.session.get('current_user', None):
        current_user = request.session.get('current_user', None)
        message = 'Login successful, welcome '
        current_user_info = User.objects.get(username = current_user)
        context = {
                'message': message + current_user_info.firstname,
                'username': current_user_info.username,
                'firstname': current_user_info.firstname,
                'lastname': current_user_info.lastname,
                'email': current_user_info.email
                }
        return render(request, 'user/profile.html', context)
    context = {
            'login_message': 'Login'
            }
    return render(request, 'login/login.html', context)
