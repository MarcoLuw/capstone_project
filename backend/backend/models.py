from django.db import models

class DetailCustomer(models.Model):
    customer_key =models.AutoField(primary_key=True)	
    first_name = models.CharField(max_length=10)	
    last_name	= models.CharField(max_length=30)	
    loyal_group	= models.CharField(max_length=10)	
    birthday	= models.CharField(max_length=10)	
    gender	= models.CharField(max_length=10)	
    marital_status	= models.CharField(max_length=10)	
    education	= models.CharField(max_length=10)	
    occupation	= models.CharField(max_length=10)	
    yearly_income	= models.IntegerField()	
    total_children	= models.IntegerField(null=True)
    is_active	= models.IntegerField()	
    customer_since	= models.CharField(max_length=10)
    recency	= models.IntegerField(null=True)	
    frequency	= models.DecimalField(max_digits=20,decimal_places=8)	
    monetary	= models.IntegerField()
    monetary_m =	models.DecimalField(max_digits=20,decimal_places=6,db_column='monetary_m_')	
    rfm	= models.IntegerField()	
    segment	= models.CharField(max_length=20)

    class Meta:
        db_table= 'detail_customer'


class DimCustomer(models.Model):
    customer_key =models.AutoField(primary_key=True)	
    first_name	= models.CharField(max_length=10)
    last_name	= models.CharField(max_length=30)	
    loyal_group	= models.CharField(max_length=10)
    birthday	= models.CharField(max_length=10)	
    gender	= models.CharField(max_length=10)
    marital_status	= models.CharField(max_length=10)	
    education	= models.CharField(max_length=10)	
    occupation	= models.CharField(max_length=20)	
    yearly_income	= models.IntegerField()	
    total_children	= models.IntegerField(null=True)
    is_active	= models.IntegerField(null=True)

    class Meta:
        db_table= 'dim_customer'

class DimProduct(models.Model):
    product_key	= models.AutoField(primary_key=True)
    product_name	= models.CharField(max_length=60)	
    product_category	= models.CharField(max_length=30)
    product_subcategory	= models.CharField(max_length=30)	
    uom	= models.CharField(max_length=10)	
    price	= models.IntegerField()	
    cost	= models.IntegerField()	
    country	= models.CharField(max_length=20)
    brand	= models.CharField(max_length=40)
    suplier_name= models.CharField(max_length=20)
    weight	= models.CharField(max_length=10,null=True)	
    uom_weight	= models.CharField(max_length=10,null=True)	
    volume	= models.CharField(max_length=10,null=True)	
    uom_volumn	= models.CharField(max_length=10,null=True)	
    length	= models.CharField(max_length=10,null=True)	
    width	= models.CharField(max_length=10,null=True)	
    heigth	= models.CharField(max_length=10,null=True)	
    uom_size	= models.CharField(max_length=10,null=True)	
    link	= models.CharField(max_length=190)	
    product_category_image	= models.CharField(max_length=40)	
    description	= models.TextField()

    class Meta:
        db_table = 'dim_product'	

class DimStore(models.Model):
    store_key=models.AutoField(primary_key=True)
    store	= models.CharField(max_length=40)	
    manager	= models.CharField(max_length=20)	
    manager_image	= models.CharField(max_length=50)	
    city	= models.CharField(max_length=10)	
    district  = models.CharField(max_length=20)	
    ward	= models.CharField(max_length=20)	
    address	= models.CharField(max_length=110)	
    latitude	= models.DecimalField(max_digits=20,decimal_places=8)	
    longitude	=models.DecimalField(max_digits=20,decimal_places=7)

    class Meta:
        db_table = 'dim_store'	

class FactEcommerceSales(models.Model):
    order_key = models.AutoField(primary_key=True)	
    order_number	= models.CharField(max_length=30)	
    order_line_number	= models.IntegerField()	
    order_date	= models.DateField()	
    order_time	= models.CharField(max_length=20)		
    customer_key	= models.IntegerField()	
    channel_name	= models.CharField(max_length=10)	
    store_key	= models.IntegerField()	
    product_key	= models.IntegerField()	
    unit_price	= models.IntegerField()	
    order_quantity	= models.IntegerField()
    total_sale	= models.IntegerField()

    class Meta:
        db_table = 'fact_ecommerce_sales'	
    