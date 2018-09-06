from django.urls import path

from . import views

app_name = 'Item'
urlpatterns = [
    path('booking/', views.booking, name='booking'), 
]

