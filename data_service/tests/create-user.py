from minio import Minio
from minio.error import S3Error, InvalidResponseError
import os
import subprocess
import sys
import json
import io

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# MinIO client configuration
MINIO_ENDPOINT = os.getenv('MINIO_URL')
MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY')
MINIO_ALIAS = "minio"

# Initialize the MinIO client
try:
    minio_client = Minio(
        endpoint=MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False
    )
except S3Error as e:
    raise SystemExit(e)

# Function to execute commands inside a Docker container
def run_command(command):
    print("Executing command:", command)
    result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        print("Error:", result.stderr.strip())
        return None
    return result.stdout.strip()

def set_user_policy(username):
    # Apply the policy to the user
    policy_name = "user_policy"
    link_policy_cmd = f"docker exec minio-client mc admin policy attach {MINIO_ALIAS} {policy_name} --user {username}"
    if run_command(link_policy_cmd) is None:
        print(f"Failed to attach policy '{policy_name}' to user '{username}'")
        return

    print(f"Policy '{policy_name}' created and linked to user '{username}' successfully.")


def create_user_and_bucket(username):
    # Create IAM user using mc command
    create_user_cmd = f"docker exec minio-client mc admin user add {MINIO_ALIAS} {username} password"
    user_creation_result = run_command(create_user_cmd)
    if user_creation_result is None:
        print(f"Failed to create user '{username}'")
        return

    # Check if the bucket already exists
    if minio_client.bucket_exists(username):
        print(f"Bucket '{username}' already exists.")
        return

    # Create a bucket named after the username
    try:
        minio_client.make_bucket(username)
        print("Created bucket:", username)
    except InvalidResponseError as err:
        print(f"Error creating bucket: {err}")
        return

    set_user_policy(username)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        username = sys.argv[1]
        create_user_and_bucket(username)
        minio_client.put_object(username, "logging/spark-events" + "/", io.BytesIO(b''), 0)
    else:
        print("Username not provided.")
