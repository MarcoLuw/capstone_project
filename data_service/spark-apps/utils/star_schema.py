
dim_date = {
	"fields": {
		"date_key": "IntegerType",
		"date": "DateType",
		"day": "IntegerType",
		"month": "IntegerType",
		"quarter": "IntegerType",
		"year": "IntegerType",
		"day_of_week": "StringType",
		"day_of_week_number": "ByteType",
		"year_month": "StringType"
	},
	"primary_key": ["date_key"]
} 

dim_time = {
	"fields": {
		"time_key": "IntegerType",
		"fulltime": "TimestampType",
		"hour24": "IntegerType",
		"hour12": "IntegerType",
		"minute": "IntegerType",
		"second": "IntegerType"
	},
	"primary_key": ["time_key"]
}

dim_product = {
	"fields": {
		"product_key": "IntegerType",
		"product_name": "StringType",
		"product_category": "StringType",
		"product_subcategory": "StringType",
		"uom": "StringType",
		"price": "FloatType",
		"cost": "FloatType",
		"country": "StringType",
		"brand": "StringType",
		"supplier_name": "StringType",
		"weight": "FloatType",
		"uom_weight": "StringType",
		"volume": "FloatType",
		"uom_volumn": "StringType",
		"length": "FloatType",
		"width": "FloatType",
		"height": "FloatType",
		"uom_size": "StringType",
		"link": "StringType",
		"product_category_image": "StringType",
		"description": "StringType"
	},
	"primary_key": ["product_key"]
}

dim_customer = {
	"fields": {
		"customer_key": "IntegerType",
		"first_name": "StringType",
		"last_name": "StringType",
		"loyal_group": "StringType",
		"birthday": "DateType",
		"gender": "StringType",
		"marital_status": "StringType",
		"education": "StringType",
		"occupation": "StringType",
		"yearly_income": "DecimalType",
		"total_children": "IntegerType",
		"is_active": "BooleanType"
	},
	"primary_key": ["customer_key"]
}

dim_store = {
	"fields": {
		"store_key": "IntegerType",
		"store": "StringType",
		"manager": "StringType",
		"city": "StringType",
		"district": "StringType",
		"ward": "StringType",
		"address": "StringType"
	},
	"primary_key": ["store_key"]
},

dim_channel = {
	"fields": {
		"channel_key": "IntegerType",
		"channel_name": "StringType"
	},
	"primary_key": ["channel_key"]
}

dim_promotion = {
	"fields": {
		"promotion_key": "IntegerType",
		"promotion": "StringType",
		"discount_percent": "FloatType",
		"type": "StringType",
		"start_date": "DateType",
		"end_date": "DateType",
		"min_quantity": "IntegerType",
		"max_quantity": "IntegerType"
	},
	"primary_key": ["promotion_key"]
}

fact_e_commerce_sales = {
	"fields": {
		"date_key": "IntegerType",
		"time_key": "IntegerType",
		"product_key": "IntegerType",
		"customer_key": "IntegerType",
		"channel_key": "IntegerType",
		"store_key": "IntegerType",
		"promotion_key": "IntegerType",
		"order_quantity": "IntegerType",
		"unit_price": "FloatType",
		"unit_cost": "FloatType",
		"unit_discount": "FloatType",
		"sales_amount": "DecimalType",
		"order_number": "StringType",
		"order_line_number": "IntegerType",
		"order_date": "DateType",
		"order_time": "TimestampType",
		"ship_date": "DateType",
		"payment_date": "DateType"
	},
	"primary_key": [],
	"foreign_keys": {
		"date_key": "dim_date",
		"time_key": "dim_time",
		"product_key": "dim_product",
		"customer_key": "dim_customer",
		"channel_key": "dim_channel",
		"store_key": "dim_store",
		"promotion_key": "dim_promotion"
	}
}


# # Example of how to create a PySpark DataFrame schema from one of the tables
# from pyspark.sql.types import *

# def create_schema(table_definition):
# fields = [StructField(name, getattr(globals()[dtype], dtype)(), True) for name, dtype in table_definition['fields'].items()]
# return StructType(fields)

# # Example: Creating a schema for the dim_date table
# dim_date_schema = create_schema(star_schema["dim_date"])
# print(dim_date_schema)
