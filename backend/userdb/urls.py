from django.urls import path
from .views import ImportDataView, ImportDataFromFileView

urlpatterns = [
    path('api/import-data/', ImportDataView.as_view(), name='import_data_api'),
    path('api/import-file/', ImportDataFromFileView.as_view(), name='import_data_from_file_api'),
]