from pyspark.sql.types import *

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
		"fulltime": "DateType",
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
		"sale_key": "IntegerType",
		"date_key": "IntegerType",
		"time_key": "IntegerType",
		"product_key": "IntegerType",
		"customer_key": "IntegerType",
		"channel_key": "IntegerType",
		"store_key": "IntegerType",
		"promotion_key": "IntegerType",
		"order_id": "StringType",
		"order_quantity": "IntegerType",
		"unit_price": "FloatType",
		"unit_cost": "FloatType",
		"unit_discount": "FloatType",
		"sales_amount": "DecimalType",
		"order_line_number": "IntegerType",
		"order_date": "DateType",
		"order_time": "DateType",
		"ship_date": "DateType",
		"payment_date": "DateType"
	},
	"primary_key": ["sale_key"],
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


# Column mappings
## KPIM
default_kpim_schema = [
	'_c0',
	'order_number',
	'order_line_number',
	'order_date',
	'order_time',
	'customer_key',
	'channel_name',
	'store_key',
	'product_key',
	'unit_price',
	'order_quantity',
	'total_sale',
	'first_name',
	'last_name',
	'loyal_group',
	'birthday',
	'gender',
	'marital_status',
	'education',
	'occupation',
	'yearly_income',
	'total_children',
	'is_active',
	'product_name',
	'product_category',
	'product_subcategory',
	'uom',
	'price',
	'cost',
	'country ',
	'brand',
	'suplier_name',
	'link',
	'product_category_image',
	'store',
	'manager',
	'manager_image',
	'city',
	'district',
	'ward',
	'address',
	'latitude',
	'longitude'
 ]

## Shopee
default_shopee_column_rename_mapping = {
    'Mã đơn hàng': 'order_number',
    'Ngày đặt hàng': 'order_date',
    'Trạng Thái Đơn Hàng': 'order_status',
    'Mã vận đơn': 'tracking_code',
    'Đơn Vị Vận Chuyển': 'shipping_company',
    'Phương thức giao hàng': 'delivery_method',
    'Loại đơn hàng': 'order_type',
    'Ngày giao hàng dự kiến': 'expected_delivery_date',
    'Ngày gửi hàng': 'ship_date',
    'SKU sản phẩm': 'product_key',
    'Tên sản phẩm': 'product_name',
    'Cân nặng sản phẩm': 'weight',
    'SKU phân loại hàng': 'category_sku',
    'Tên phân loại hàng': 'category_name',
    'Giá gốc': 'unit_price',
    'Người bán trợ giá': 'seller_discount',
    'Được Shopee trợ giá': 'shopee_discount',
    'Giá ưu đãi': 'unit_discount',
    'Số lượng': 'ordered_quantity',
    'Returned quantity': 'returned_quantity',  # This needs translation
    'Tổng giá bán (sản phẩm)': 'total_product_price',
    'Tổng giá trị đơn hàng (VND)': 'total_order_price',
    'Mã giảm giá của Shop': 'shop_discount_code',
    'Mã giảm giá của Shopee': 'shopee_discount_code',
    'Phí vận chuyển (dự kiến)': 'estimated_shipping_fee',
    'Phí vận chuyển mà người mua trả': 'shipping_fee_paid_by_buyer',
    'Phí vận chuyển tài trợ bởi Shopee (dự kiến)': 'shopee_sponsored_shipping_fee',
    'Phí trả hàng': 'return_fee',
    'Thời gian đơn hàng được thanh toán': 'payment_date',
    'Phương thức thanh toán': 'payment_method',
	'Người Mua': 'buyer_name',
    'Tỉnh/Thành phố': 'city',
    'TP / Quận / Huyện': 'district',
    'Quận': 'ward',
    'Địa chỉ nhận hàng': 'delivery_address',
    'Quốc gia': 'country',
}

shopee_raw_schema_columns = [
    "Mã đơn hàng", "Mã Kiện Hàng", "Ngày đặt hàng", "Trạng Thái Đơn Hàng", "Lý do hủy",
    "Nhận xét từ Người mua", "Mã vận đơn", "Đơn Vị Vận Chuyển", "Phương thức giao hàng", "Loại đơn hàng",
    "Ngày giao hàng dự kiến", "Ngày gửi hàng", "Thời gian giao hàng", "Trạng thái Trả hàng/Hoàn tiền",
    "SKU sản phẩm", "Tên sản phẩm", "Cân nặng sản phẩm", "Tổng cân nặng", "SKU phân loại hàng",
    "Tên phân loại hàng", "Giá gốc", "Người bán trợ giá", "Được Shopee trợ giá",
    "Tổng số tiền được người bán trợ giá", "Giá ưu đãi", "Số lượng", "Returned quantity",
    "Tổng giá bán (sản phẩm)", "Tổng giá trị đơn hàng (VND)", "Mã giảm giá của Shop", "Hoàn Xu",
    "Mã giảm giá của Shopee", "Chỉ tiêu Combo Khuyến Mãi", "Giảm giá từ combo Shopee", "Giảm giá từ Combo của Shop",
    "Shopee Xu được hoàn", "Số tiền được giảm khi thanh toán bằng thẻ Ghi nợ",
    "Phí vận chuyển (dự kiến)", "Phí vận chuyển mà người mua trả",
    "Phí vận chuyển tài trợ bởi Shopee (dự kiến)", "Phí trả hàng", "Tổng số tiền người mua thanh toán",
    "Thời gian hoàn thành đơn hàng", "Thời gian đơn hàng được thanh toán", "Phương thức thanh toán",
    "Phí cố định", "Phí Dịch Vụ", "Phí thanh toán", "Tiền ký quỹ", "Người Mua", "Tên Người nhận",
    "Số điện thoại", "Tỉnh/Thành phố", "TP / Quận / Huyện", "Quận", "Địa chỉ nhận hàng",
    "Quốc gia", "Ghi chú"
]

shopee_bronze_schema = StructType(
[
	StructField("order_number", StringType(), True),
	StructField("order_date", DateType(), True),
	StructField("order_status", StringType(), True),
	StructField("tracking_code", StringType(), True),
	StructField("shipping_company", StringType(), True),
	StructField("delivery_method", StringType(), True),
	StructField("order_type", StringType(), True),
	StructField("expected_delivery_date", DateType(), True),
	StructField("ship_date", DateType(), True),
	StructField("product_key", StringType(), True),
	StructField("product_name", StringType(), True),
	StructField("weight", DoubleType(), True),
	StructField("category_sku", StringType(), True),
	StructField("category_name", StringType(), True),
	StructField("ordered_quantity", IntegerType(), True),
	StructField("unit_price", FloatType(), True),
	StructField("seller_discount", FloatType(), True),
	StructField("shopee_discount", FloatType(), True),
	StructField("unit_discount", FloatType(), True),
	StructField("returned_quantity", IntegerType(), True),
	StructField("total_product_price", DoubleType(), True),
	StructField("total_order_price", FloatType(), True),
	StructField("shop_discount_code", StringType(), True),
	StructField("shopee_discount_code", StringType(), True),
	StructField("estimated_shipping_fee", FloatType(), True),
	StructField("shipping_fee_paid_by_buyer", FloatType(), True),
	StructField("shopee_sponsored_shipping_fee", FloatType(), True),
	StructField("return_fee", FloatType(), True),
	StructField("payment_date", FloatType(), True),
	StructField("payment_method", StringType(), True),
	StructField("buyer_name", StringType(), True),
	StructField("delivery_address", StringType(), True),
	StructField("city", StringType(), True),
	StructField("district", StringType(), True),
	StructField("ward", StringType(), True)
]
)

# # Example of how to create a PySpark DataFrame schema from one of the tables
# from pyspark.sql.types import *

# def create_schema(table_definition):
# fields = [StructField(name, getattr(globals()[dtype], dtype)(), True) for name, dtype in table_definition['fields'].items()]
# return StructType(fields)

# # Example: Creating a schema for the dim_date table
# dim_date_schema = create_schema(star_schema["dim_date"])
# print(dim_date_schema)
