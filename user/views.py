from django.shortcuts import render
from user.models import User

def profile(request):
    message = 'Login successful'
    current_user = request.session.get('current_user')
    current_user_info = User.objects.get(username = current_user)
    context = {
            'message': message,
            'username': current_user_info.username,
            'firstname': current_user_info.first_name,
            'lastname': current_user_info.last_name,
            'email': current_user_info.email
            }
    return render(request, 'user/profile.html', context)
