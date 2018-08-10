from django.shortcuts import render, get_object_or_404
from user.models import User
from user.forms import UserUpdateForm

def profile(request):
    if request.session.get('current_user', None):
        current_user = request.session.get('current_user', None)
        message = 'Login successful, welcome '
#        current_user_info = User.objects.get(username = current_user)
        current_user_info = get_object_or_404(User, username = current_user)
        userform = UserUpdateForm(instance = current_user_info)
        for f in userform.fields:
            userform.fields[f].widget.attrs['disabled'] = True
        
        context = {
                'message': message + current_user_info.firstname,
#                'username': current_user_info.username,
#                'firstname': current_user_info.firstname,
#                'lastname': current_user_info.lastname,
#                'email': current_user_info.email,
                'form': userform
                }
        return render(request, 'user/profile.html', context)
    context = {
            'login_message': 'Login'
            }
    return render(request, 'login/login.html', context)
