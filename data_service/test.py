from minio import Minio
from minio.error import S3Error
import os
from dotenv import load_dotenv
import json

load_dotenv()

MINIO_ENDPOINT = os.getenv("MINIO_URL")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")

print(MINIO_ENDPOINT)
print("MINIO_ACCESS_KEY:", MINIO_ACCESS_KEY)
print("MINIO_SECRET_KEY:", MINIO_SECRET_KEY)

client = Minio(MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

def upload_file():
    try:
        source_file = 'data_train.csv'
        bucket_name = 'ductien'
        destination_file = source_file

        found = client.bucket_exists(bucket_name)

        if not found:
            client.make_bucket(bucket_name)
            print("Created bucket", bucket_name)
        else:
            print("Bucket", bucket_name, "already exists")

        # Upload the file, renaming it in the process
        client.fput_object(
            bucket_name, destination_file, source_file,
        )
        print(
            source_file, "successfully uploaded as object",
            destination_file, "to bucket", bucket_name,
        )

    except S3Error as exc:
        raise exc

def create_new_user():
    username = "logging"
    bucket_name = username  
    # Todo: write a sub process using mc to create new user

    try:
        found = client.bucket_exists(bucket_name)

        if not found:
            client.make_bucket(bucket_name)
            print("Created bucket", bucket_name)
        else:
            print("Bucket", bucket_name, "already exists")
            
        policy = {
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": "*"},
                    "Action": [
                        "s3:GetBucketLocation",
                        "s3:ListBucket",
                        "s3:ListBucketMultipartUploads",
                    ],
                    "Resource": f"arn:aws:s3:::{bucket_name}",
                },
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": "*"},
                    "Action": [
                        "s3:GetObject",
                        "s3:PutObject",
                        "s3:DeleteObject",
                        "s3:ListMultipartUploadParts",
                        "s3:AbortMultipartUpload",
                    ],
                    "Resource": f"arn:aws:s3:::{bucket_name}/images/*",
                },
            ],
        }

        client.set_bucket_policy(bucket_name, json.dumps(policy))
    except S3Error as e:
        print("Error occured:", e)


try:
    create_new_user()
    # upload_file()
except Exception as e: 
    print(e)


# spark-submit \
#   --master spark://127.0.0.1:7077 \
#   --deploy-mode cluster \
#   --driver-memory 1g \
#   --executor-memory 1g\
#   --executor-cores 1 \
#   --num-executors 1 \
#   --py-files spark-test.py

# curl -XPOST http://spark-master:6066/v1/submissions/create \
# --header "Content-Type:application/json;charset=UTF-8" \
# --data '{
#   "appResource": "file:/Users/kayden.ho.int/Documents/capstone_project/data_service/spark-test.py",
#   "sparkProperties": {
#     "spark.master": "spark://spark-mas:7077",
#     "spark.app.name": "SimpleDataFrameExample",
#     "spark.driver.memory": "1g",
#     "spark.driver.cores": "1",
#   },
#   "mainClass": "org.apache.spark.deploy.SparkSubmit",
#   "action": "CreateSubmissionRequest",
#   "appArgs": [ "/Users/kayden.ho.int/Documents/capstone_project/data_service/spark-test.py"]
# }'


# spark-submit \
# --packages 'org.apache.hadoop:hadoop-aws:3.3.6,org.apache.hadoop:hadoop-aws:3.3.6' \
# --exclude-packages 'com.amazonaws:aws-java-sdk-bundle' \
# --conf 'spark.driver.extraClassPath=/opt/spark/jars/aws-java-sdk-bundle-1.12.541.jar' \
# --conf 'spark.executor.extraClassPath=/opt/spark/jars/aws-java-sdk-bundle-1.12.541.jar' \
# spark-test.py
