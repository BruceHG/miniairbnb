from django.shortcuts import render
from hostadmin.models import HostRequest

def hostAdmin(request):
    all_request = HostRequest.objects.all()
    context = {'all_request': all_request}
    return render(request, 'hostadmin/hostAdmin.html', context)
