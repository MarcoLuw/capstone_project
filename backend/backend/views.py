from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from django.http.response import JsonResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from backend.models import DetailCustomer,DimCustomer,DimProduct,FactEcommerceSales,DimStore
from backend.serializers import DetailCustomerSerializer,DimCustomerSerializer,DimProductSerializer,DimStoreSerializer,FactEcommerceSalesSerializer

from django.core.files.storage import default_storage

# Create your views here.

@csrf_exempt
def DetailCustomerApi(request,id=0):
    if request.method=='GET':
        
        detail_customer = DetailCustomer.objects.all()
        
        page_number = request.GET.get('page', None)
        page_size = request.GET.get('pageSize', None)
        
        if page_number is not None and page_size is not None:
            try:
                page_number = int(page_number)
                page_size = int(page_size)
            except ValueError:
                return JsonResponse({"error": "'page' and 'pageSize' must be integers"}, status=400)

            paginator = Paginator(detail_customer, page_size)
            try:
                paginated_detail_customer = paginator.page(page_number)
            except EmptyPage:
                return JsonResponse([], safe=False)  
            except PageNotAnInteger:
                return JsonResponse({"error": "'page' must be an integer"}, status=400)
            
            detail_customer_serializer = DetailCustomerSerializer(paginated_detail_customer, many=True)
            return JsonResponse(detail_customer_serializer.data, safe=False)
        
        detail_customer_serializer = DetailCustomerSerializer(detail_customer, many=True)
        return JsonResponse(detail_customer_serializer.data,safe=False)
        

def DimCustomerApi(request,id=0):
    if request.method=='GET':
        
        dim_customer = DimCustomer.objects.all()
        
        page_number = request.GET.get('page', None)
        page_size = request.GET.get('pageSize', None)

        if page_number is not None and page_size is not None:
            try:
                page_number = int(page_number)
                page_size = int(page_size)
            except ValueError:
                return JsonResponse({"error": "'page' and 'pageSize' must be integers"}, status=400)

            paginator = Paginator(dim_customer, page_size)
            try:
                paginated_dim_customer = paginator.page(page_number)
            except EmptyPage:
                return JsonResponse([], safe=False)  
            except PageNotAnInteger:
                return JsonResponse({"error": "'page' must be an integer"}, status=400)
            
            dim_customer_serializer = DimCustomerSerializer(paginated_dim_customer, many=True)
            return JsonResponse(dim_customer_serializer.data, safe=False)
        
        dim_customer_serializer = DimCustomerSerializer(dim_customer, many=True)
        return JsonResponse(dim_customer_serializer.data,safe=False)
    
def DimProductApi(request,id=0):
    if request.method=='GET':
        dim_product = DimProduct.objects.all()
        dim_product_serializer=DimProductSerializer(dim_product,many=True)
        return JsonResponse(dim_product_serializer.data,safe=False)
    
def DimStoreApi(request,id=0):
    if request.method=='GET':
        dim_store = DimStore.objects.all()
        
        page_number = request.GET.get('page', None)
        page_size = request.GET.get('pageSize', None)

        if page_number is not None and page_size is not None:
            try:
                page_number = int(page_number)
                page_size = int(page_size)
            except ValueError:
                return JsonResponse({"error": "'page' and 'pageSize' must be integers"}, status=400)

            paginator = Paginator(dim_store, page_size)
            try:
                paginated_dim_store = paginator.page(page_number)
            except EmptyPage:
                return JsonResponse([], safe=False)  
            except PageNotAnInteger:
                return JsonResponse({"error": "'page' must be an integer"}, status=400)
            
            dim_store_serializer = DimStoreSerializer(paginated_dim_store, many=True)
            return JsonResponse(dim_store_serializer.data, safe=False)
        
        dim_store_serializer = DimStoreSerializer(dim_store, many=True)
        return JsonResponse(dim_store_serializer.data,safe=False)
    
def FactEcommerceSalesApi(request,id=0):
    if request.method=='GET':
        fact_ecommerce_sales = FactEcommerceSales.objects.all()
        # fact_ecommerce_sales = FactEcommerceSales.objects.get(order_key=334324)
        fact_ecommerce_sales_serializer=FactEcommerceSalesSerializer(fact_ecommerce_sales,many=True)
        return JsonResponse(fact_ecommerce_sales_serializer.data,safe=False)
    
def DetailCustomerAVGApi(request,id=0):
    if request.method=='GET':
        detail_customer = DetailCustomer.objects.all()
        nam = request.GET.get('nam', None)
        nu = request.GET.get('nu', None)

        if nam is not None:
            nam_count = DetailCustomer.objects.filter(gender='Nam').count()
            return JsonResponse({"nam_count": nam_count}, status=200)
        
        if nu is not None:
            nu_count = DetailCustomer.objects.filter(gender='Nữ').count()
            return JsonResponse({"nu_count": nu_count}, status=200)

        return JsonResponse({"info": "What do you want ??"}, status=200)