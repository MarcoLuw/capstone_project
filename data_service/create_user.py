from minio import Minio
from minio.error import S3Error, InvalidResponseError
import os
import subprocess
import sys
import json

#---------------------------------
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s: [%(levelname)s] - %(message)s')

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
    logging.info("Executing command:", command)
    result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        logging.error("Error:", result.stderr.strip())
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
        logging.error("Failed to copy policy file to container")
        return
    else:
        logging.info("Policy file copied to container successfully")

    # Use the mc command to create the policy in MinIO inside the Docker container
    create_policy_cmd = f"docker exec minio-client mc admin policy create {MINIO_ALIAS} {policy_name} {container_policy_path}"
    if run_command(create_policy_cmd) is None:
        logging.error(f"Failed to create policy '{policy_name}'")
        return
    else:
        logging.info(f"Policy '{policy_name}' created successfully")

    # Apply the policy to the user
    link_policy_cmd = f"docker exec minio-client mc admin policy attach {MINIO_ALIAS} {policy_name} --user {username}"
    if run_command(link_policy_cmd) is None:
        logging.error(f"Failed to attach policy '{policy_name}' to user '{username}'")
        return

    logging.info(f"Policy '{policy_name}' created and linked to user '{username}' successfully.")


def is_user_exists(username):
    user_list_cmd = f"docker exec minio-client mc admin user list {MINIO_ALIAS}"
    user_list = run_command(user_list_cmd)
    if user_list is None:
        logging.error("Failed to get user list")
        return False
    return username in user_list

def is_bucket_exists(username):
    return minio_client.bucket_exists(username)

def create_bucket(username):
    logging.info(f"Creating bucket for '{username}'...")
    # Create a bucket named after the username
    try:
        minio_client.make_bucket(username)
        logging.info("Created bucket:", username)
    except InvalidResponseError as err:
        logging.error(f"Error creating bucket: {err}")
        return

def create_user_and_bucket(username):
    # Create IAM user using mc command
    create_user_cmd = f"docker exec minio-client mc admin user add {MINIO_ALIAS} {username} password"

    try:
        user_creation_result = run_command(create_user_cmd)
        if user_creation_result is None:
            logging.error(f"Failed to create user '{username}'")
            return
        else:
            logging.info(f"User '{username}' created successfully")
    except Exception as e:
        logging.error(f"Error creating user: {e}")
        return

    # Set the user policy
    try:
        set_user_policy(username)
        logging.info("User policy set successfully.")
    except Exception as e:
        logging.error(f"Error setting user policy: {e}")
        return

# if __name__ == "__main__":
#     if len(sys.argv) > 1:
#         username = sys.argv[1]
#         create_user_and_bucket(username)
#     else:
#         print("Username not provided.")
