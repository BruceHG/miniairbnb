from django.urls import path

from . import views

app_name = 'Order'
urlpatterns = [
    path('booking/', views.booking, name='booking'), 
    path('requests/', views.requests, name='requests'), 
    path('orders/', views.orders, name='orders'), 
    path('cancel/<int:order_id>/', views.cancel, name='cancel'), 
    path('reject/<int:order_id>/', views.reject, name='reject'), 
]

