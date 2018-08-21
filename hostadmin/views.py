from django.shortcuts import render, get_object_or_404
from hostadmin.models import HostRequest
from user.models import Host, User

def hostAdmin(request):
    if request.method == "POST":
        username = request.POST['username']
        phone = request.POST['phone']
        target = get_object_or_404(User, username = username)
        new_host = Host(user = target,
                        phone = phone)
        new_host.save()
        HostRequest.objects.get(user = target).delete()
    all_request = HostRequest.objects.all()
    context = {'all_request': all_request}
    return render(request, 'hostadmin/hostAdmin.html', context)

#def acceptHost(request):
    
