from django.urls import path

from . import views

app_name = 'Order'
urlpatterns = [
    path('booking/', views.booking, name='booking'), 
]

