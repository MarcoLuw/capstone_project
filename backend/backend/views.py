from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from django.http.response import JsonResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# from backend.models import DetailCustomer
# from backend.serializers import DetailCustomerSerializer

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