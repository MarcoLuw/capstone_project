import os
import paramiko
import logging
import time
import argparse
#---------------------------------
# Configure the logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s: [%(levelname)s] - %(message)s')

#---------------------------------

def getEtlTriggerCmd(username):
    spark_command = f"""spark-submit --master spark://spark-master:7077 --py-files /opt/spark_apps/utils.zip --deploy-mode client --executor-memory 1000Mb --total-executor-cores 2 --driver-memory 1G /opt/spark_apps/spark_etl.py {username}"""
    return spark_command

def trigger_spark_job(ssh, username):
    spark_command = getEtlTriggerCmd(username)
    stdin, stdout, stderr = ssh.exec_command(spark_command)
    output = stdout.read().decode()
    error = stderr.read().decode()

    if error:
        logging.error(f"Error: {error}")
        return None

    logging.info(output)
    return extract_application_id(output)

def extract_application_id(output):
    # Extract the application ID from the output (adjust regex as necessary)
    import re
    match = re.search(r'application_\d+_\d+', output)
    if match:
        return match.group(0)
    return None

def check_spark_job_status(ssh, app_id):
    check_command = f"spark-submit --status {app_id}"
    stdin, stdout, stderr = ssh.exec_command(check_command)
    status_output = stdout.read().decode()
    if "FINISHED" in status_output:
        return ("Done", True)
    elif "FAILED" in status_output:
        return ("Done", False)
    return (None, False)

def main(username, host):
    # Spark container details
    spark_host = host
    spark_user = 'root'
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(spark_host, username=spark_user)

    app_id = trigger_spark_job(ssh, username)
    if not app_id:
        logging.error("Failed to start Spark job.")
        return None

    logging.info(f"Spark job started with application ID: {app_id}")
    job_status = None
    flag = False
    while True:
        job_status, flag = check_spark_job_status(ssh, app_id)
        if job_status and flag == True:
            logging.info(f"Spark job {app_id} executed successfully.")
            break
        elif job_status and flag == False:
            logging.error(f"Spark job {app_id} failed.")
            break
        logging.info(f"Spark job {app_id} is still running...")
        time.sleep(20)  # Wait for 30 seconds before checking again

    # Proceed with the next steps
    ssh.close()
    return flag