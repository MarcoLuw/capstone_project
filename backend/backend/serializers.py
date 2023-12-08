from rest_framework import serializers
from backend.models import DetailCustomer,DimCustomer,DimProduct,DimStore,FactEcommerceSales


class DetailCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model=DetailCustomer 
        fields=('customer_key','first_name','last_name','loyal_group','birthday','gender','marital_status','education','occupation','yearly_income','total_children','is_active','customer_since','recency','frequency','monetary','monetary_m','rfm','segment')
       
class DimCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model=DimCustomer 
        fields=("customer_key","first_name","last_name","loyal_group","birthday","gender","marital_status","education","occupation","yearly_income","total_children","is_active")

class DimProductSerializer(serializers.ModelSerializer):
    class Meta:
        model= DimProduct
        fields = ('product_key','product_name','product_category','product_subcategory','uom','price','cost','country','brand','suplier_name','weight','uom_weight','volume','uom_volumn','length','width','heigth','uom_size','link','product_category_image','description')


class DimStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model= DimStore
        fields = ('store_key','store','manager','manager_image','city','district','ward','address','latitude','longitude')

class FactEcommerceSalesSerializer(serializers.ModelSerializer):
    class Meta:
        model= FactEcommerceSales
        fields = ('order_key','order_number','order_line_number','order_date','order_time','customer_key','channel_name','store_key','product_key','unit_price','order_quantity','total_sale') 