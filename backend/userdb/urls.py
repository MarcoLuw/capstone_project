from django.urls import path
from .views import ImportDataView

urlpatterns = [
    path('api/import-data/', ImportDataView.as_view(), name='import_data_api'),
]