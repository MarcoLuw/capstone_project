import pyodbc

numeric_fields = [
                'date_key', 'time_key', 'channel_key', 'customer_key', 'product_key',
                'store_key', 'promotion_key', 'order_quantity', 'unit_price', 'unit_cost',
                'unit_discount', 'sales_amount', 'order_line_number'
                ]

aggregation_options = ['SUM', 'AVERAGE', 'COUNT', 'DISTINCT']

def generateAggregationQueryCard(field: str, aggre: str):
    if field not in numeric_fields and aggre in ['SUM', 'AVERAGE']:
        return 'This type of aggregation is not supported for this field'
    
    if aggre == 'SUM':
        query = f'SELECT SUM({field}) FROM fact_ecommerce_sales;'
    elif aggre == 'AVERAGE':
        query = f'SELECT AVG({field}) FROM fact_ecommerce_sales;'
    elif aggre == 'COUNT':
        query = f'SELECT COUNT({field}) FROM fact_ecommerce_sales;'
    elif aggre == 'DISTINCT':
        query = f'SELECT COUNT(DISTINCT {field}) FROM fact_ecommerce_sales;'
    else: 
        query = 'Invalid aggregation option'
    
    return query

def main():
    # Database connection information
    server = '222.252.14.117'
    database = 'kpim_mart_v2'
    username = 'bi7'
    password = 'BI7@2023'
    driver = '{FreeTDS}' # Adjust the driver based on your SQL Server version

    # Create the connection string
    connection_string = f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}'

    # Connect to the database
    try:
        conn = pyodbc.connect(connection_string)
        print("Connection successful")
        print('--------------------------------')
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        exit()

    # Perform a query
    try:
        cursor = conn.cursor()
        # cmd = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';"
        # cmd = "SELECT * FROM dim_product;"
        # cmd = "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'fact_ecommerce_sales';"
        # cmd = "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'dim_product';"
        cmd = generateAggregationQueryCard('order_quantity', 'SUM')
        cursor.execute(cmd) # Replace 'YourTableName' with the actual table name
        rows = cursor.fetchall()
        for row in rows:
            print(row)
    except Exception as e:
        print(f"Error executing query: {e}")

    # Close the connection
    conn.close()
    print('--------------------------------')
    print("Connection closed")

if __name__ == '__main__':
    main()