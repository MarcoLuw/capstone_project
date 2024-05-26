from django.urls import path
from .views import PredictDataView, GetBasketDataView, GetCustomerDataView

urlpatterns = [
    path('api/predict', PredictDataView.as_view(), name='get_all_columns_api'),
    path('api/getCustomer', GetCustomerDataView.as_view(), name='get_customer_api'),
    path('api/getBasket', GetBasketDataView.as_view(), name='get_basket_api'),
]