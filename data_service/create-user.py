from minio import Minio
from minio.error import S3Error, InvalidResponseError
import os
import subprocess
import sys
import json

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
    policy_name = f"{username}_policy"
    policy_document = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": ["s3:*"],
                "Resource": f"arn:aws:s3:::{username}"
            },
            {
                "Effect": "Allow",
                "Action": ["s3:*"],
                "Resource": f"arn:aws:s3:::{username}/*"
            }
        ]
    }
    policy_json = json.dumps(policy_document)

    # Save the policy to a temporary JSON file on the host
    host_policy_path = 'tmp'
    if not os.path.exists(host_policy_path):
        os.makedirs(host_policy_path)
        host_policy_path = os.path.join(host_policy_path, f"{policy_name}.json")

    with open(host_policy_path, 'w') as f:
        f.write(policy_json)

    # Copy the policy JSON file to the Docker container
    container_policy_path = '/tmp/policy.json'  # Change as needed based on container path preferences
    copy_command = f"docker cp {host_policy_path} minio-client:{container_policy_path}"
    if run_command(copy_command) is None:
        print("Failed to copy policy file to container")
        return

    # Use the mc command to create the policy in MinIO inside the Docker container
    create_policy_cmd = f"docker exec minio-client mc admin policy create {MINIO_ALIAS} {policy_name} {container_policy_path}"
    if run_command(create_policy_cmd) is None:
        print(f"Failed to create policy '{policy_name}'")
        return

    # Apply the policy to the user
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
    else:
        print("Username not provided.")
