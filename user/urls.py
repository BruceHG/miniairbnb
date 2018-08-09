from django.urls import path
from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

app_name = 'User'
urlpatterns = [
#    path('profile/', views.profile, name='profile'),
    url(r'^profile/$', views.profile, name='profile'),
]

urlpatterns = format_suffix_patterns(urlpatterns)