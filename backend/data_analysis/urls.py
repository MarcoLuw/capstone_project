from django.urls import path
from .views import GetALLColumnsView, GetCardView, GetBCPView

urlpatterns = [
    path('api/getAllColumn', GetALLColumnsView.as_view(), name='get_all_columns_api'),
    path('api/getDataCard', GetCardView.as_view(), name='get_card_api'),
    path('api/getDataBCP', GetBCPView.as_view(), name='get_bcp_api'),
    # path('api/import-file/', ImportDataFromFileView.as_view(), name='import_data_from_file_api'),
]