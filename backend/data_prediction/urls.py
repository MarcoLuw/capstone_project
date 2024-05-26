from django.urls import path
from .views import PredictDataView

urlpatterns = [
    path('api/predict', PredictDataView.as_view(), name='get_all_columns_api'),
]