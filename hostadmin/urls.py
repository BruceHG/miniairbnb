from django.urls import path

from . import views

app_name = 'Hostadmin'
urlpatterns = [
    path('requests/', views.hostAdmin, name='hostAdmin'),
    path('approve/', views.approve, name='approve'),
    path('decline/', views.decline, name='decline'),
#    path('adminlogin/', views.adminLogin, name='adminLogin'),
]