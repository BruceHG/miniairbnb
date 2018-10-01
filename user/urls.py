from django.urls import path

from . import views

app_name = 'User'
urlpatterns = [
#    path('profile/', views.profile, name='profile'),
    path('becomehost/', views.becomeHost, name='becomeHost'),
    path('profile/', views.profile, name='profile'),
    path('ad_delete/<int:item_id>/', views.ad_delete, name='ad_delete'),
    path('ads/', views.ads, name='ads'),
]