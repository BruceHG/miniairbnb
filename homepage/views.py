from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404


def index(request):
    hello_massage = 'Welcome to miniAirbnb'
    context = {
            'hello_massage': hello_massage
            }
    return render(request, 'homepage/index.html', context)