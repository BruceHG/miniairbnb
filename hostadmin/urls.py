from django.urls import path

from . import views

app_name = 'Hostadmin'
urlpatterns = [
    path('', views.hostAdmin, name='hostAdmin'),
    path('approve/', views.approve, name='approve'),
    path('adminlogin/', views.adminLogin, name='adminLogin'),
]