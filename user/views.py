from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse
from user.models import User, Host
from hostadmin.models import HostRequest
from user.forms import UserUpdateForm

def profile(request):
    if request.session.get('current_user', None):
        current_user = request.session.get('current_user', None)
        message = 'Login successful, welcome '
        current_user_info = get_object_or_404(User, username = current_user)
        userform = UserUpdateForm(instance = current_user_info)
        for f in userform.fields:
            userform.fields[f].widget.attrs['disabled'] = True
        
        context = {
                'message': message + current_user_info.firstname,
                'form': userform
                }
        try:
            Host.objects.get(user = current_user_info.u_id)
            context['host'] = 1
        except Host.DoesNotExist:
            context['host'] = 0
        return render(request, 'user/profile.html', context)
    context = {
            'login_message': 'Login'
            }
    return render(request, 'login/login.html', context)

def becomeHost(request):
    if not request.session.get('current_user', None):
        return HttpResponseRedirect(reverse('Homepage:index'))
    else:
        current_user = request.session.get('current_user', None)
        current_user_info = get_object_or_404(User, username = current_user)
    if request.method == "POST":
        phone = request.POST['phone']
        request = HostRequest(user = current_user_info, 
                                  username = current_user_info.username,
                                  email = current_user_info.email,
                                  phone = phone)
        request.save()
        return HttpResponseRedirect(reverse('User:profile'))
    
    else:
        try:
            Host.objects.get(user = current_user_info)
            return HttpResponseRedirect(reverse('User:profile'))
        except Host.DoesNotExist:
            return render(request, 'user/hostRegister.html')
    

        
        
        
        
    
