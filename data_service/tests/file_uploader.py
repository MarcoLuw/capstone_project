from minio import Minio
from minio.error import S3Error
from dotenv import load_dotenv
import os
import logging

#---------------------------------
# Configure the logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s: [%(levelname)s] - %(message)s')


#---------------------------------
# Load environment variables
load_dotenv()
MINIO_ENDPOINT = os.getenv('MINIO_URL')
MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY')

print(f'MINIO ENDPOINT: {MINIO_ENDPOINT}')

def uploadFile(filepath: str, username: str):
    # Create a client with the MinIO server, using generated credentials
    client = Minio(
        MINIO_ENDPOINT,
        secure=False,
        access_key=username,
        secret_key='password',
    )

    # The destination bucket where the file will be uploaded.
    bucket_name = username
    source_file = filepath  # The source file path
    object_name = "raw/data_train.csv"  # The object name inside the bucket

    # Make the bucket if it doesn't exist.
    found = client.bucket_exists(bucket_name)
    if not found:
        client.make_bucket(bucket_name)
        logging.info(f'Created bucket: {bucket_name}')
    else:
        print(f'Bucket {bucket_name} already exists')

    # Upload the file with the name object_name to the bucket.
    try:
        result = client.fput_object(bucket_name, object_name, source_file)
        print(f'Uploaded {filepath} to {bucket_name} as {object_name}')
        return result
    except S3Error as exc:
        logging.error("Error occurred: ", exc)
        return None

if __name__ == "__main__":
    uploadFile('data_train.csv', 'kayden')  # Adjust the path as necessary
