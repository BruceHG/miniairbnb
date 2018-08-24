from django.shortcuts import redirect


def index(request):
    return redirect('/static/build/index.html')
