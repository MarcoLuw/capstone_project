from minio import Minio
from minio.error import S3Error
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
MINIO_ENDPOINT = os.getenv('MINIO_URL')
MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY')

print(f'MINIO ENDPOINT: {MINIO_ENDPOINT}')

def generate_dynamic_credentials(username):
    # Generate the access key
    access_key = f'{username}_access_key'
    # Generate the secret key
    secret_key = f'{username}_secret_key'
    return access_key, secret_key

def uploadFile(filepath: str, username: str):
    # Create a client with the MinIO server playground, its access key
    # and secret key.
    client = Minio (
        MINIO_ENDPOINT,
        secure=False,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
    )

    # The destination bucket where the file will be uploaded.
    bucket_name = username
    source_file = destination_file = filepath


    # Make the bucket if it doesn't exist.
    found = client.bucket_exists(bucket_name)
    if not found:
        client.make_bucket(bucket_name)
        print(f'Created bucket: {bucket_name}')
    else:
        print(f'Bucket {bucket_name} already exists')
    
    # Upload the file with the name destination_file to the bucket.
    try:
        result = client.fput_object(bucket_name, source_file, destination_file, None)
        print(f'Uploaded {filepath} to {bucket_name}')
        return result
    except S3Error as exc:
        print("Error occurred: ", exc)
        return None

# uploadFile('backend/userdb/storage/dim_store.csv', 'admin')