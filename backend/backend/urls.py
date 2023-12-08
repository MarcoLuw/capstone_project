"""
URL configuration for DataWareHouse_BE project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from backend import views


urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('detail_customer/all', views.DetailCustomerApi),
    path('detail_customer/agv', views.DetailCustomerAVGApi),

    path('dim_customer/all', views.DimCustomerApi),
    path('dim_product/all', views.DimProductApi),
    path('dim_store/all', views.DimStoreApi),
    path('fact_ecommerce_sales/all', views.FactEcommerceSalesApi), 


]