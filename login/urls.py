#from django.urls import path
from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

#app_name = 'Login'
#urlpatterns = [
#    path('', views.login, name='login'),
#    path('register/', views.register, name='register'),
#]

urlpatterns = [
    url(r'', views.login),
]

#urlpatterns = format_suffix_patterns(urlpatterns)