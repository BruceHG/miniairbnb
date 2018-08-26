from django.urls import path

from . import views

app_name = 'User'
urlpatterns = [
#    path('profile/', views.profile, name='profile'),
    path('becomehost/', views.becomeHost, name='becomeHost'),
]