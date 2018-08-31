from django.urls import path

from . import views

app_name = 'Item'
urlpatterns = [
    path('import_real_data/', views.import_real_data, name='import_real_data'),
]
