from django.urls import path
from .views import GetMappingColumnsView, GetCardView, GetBCPView, GetDataTableView, GetInfoFieldView,UpdateColumnMappingView,GetAllColumnsView,GetChatBotView

urlpatterns = [
    path('api/getMappingColumns', GetMappingColumnsView.as_view(), name='get_mapping_columns_api'),
    path('api/getAllColumns', GetAllColumnsView.as_view(), name='get_all_columns_api'),
    path('api/getDataCard', GetCardView.as_view(), name='get_card_api'),
    path('api/getDataBCP', GetBCPView.as_view(), name='get_bcp_api'),
    path('api/getInfoField', GetInfoFieldView.as_view(), name='get_info_field_api'),
    path('api/getDataTable', GetDataTableView.as_view(), name='get_data_api'),
    path('api/updateColumns', UpdateColumnMappingView.as_view(), name='update_columns_mapping'),
    path('api/getChatBot', GetChatBotView.as_view(), name='get_chat_bot_api'),
    # path('api/getCustomer', GetCustomerDataView.as_view(), name='get_customer_api'),
    # path('api/import-file/', ImportDataFromFileView.as_view(), name='import_data_from_file_api'),
]