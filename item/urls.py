from django.urls import path

from . import views

app_name = 'Item'
urlpatterns = [
    path('import_real_data/', views.import_real_data, name='import_real_data'),
    path('<int:item_id>/', views.itemDetail, name='itemDetail'),
    path('features/', views.features, name='features'),
    path('search/', views.search, name='search'),
    path('<int:item_id>/available_info/', views.available_info, name='available_info'),
    path('update_item/<int:item_id>/', views.update_item, name='update_item'),
]
