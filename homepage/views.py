from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404


def index(request):
#     request.session['current_user'] = None
    hello_message = 'Welcome to miniAirbnb'
    context = {
            'hello_message': hello_message
            }
    return render(request, 'homepage/index.html', context)