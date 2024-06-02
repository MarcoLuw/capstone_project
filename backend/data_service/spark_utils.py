# import os
# import paramiko
# import logging
# import time
# import subprocess
# #---------------------------------
# # Configure the logger
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s: [%(levelname)s] - %(message)s')

# #---------------------------------

# def run_command(command):
#     logging.info("Executing command:", command)
#     result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
#     if result.returncode != 0:
#         logging.error("Error:", result.stderr.strip())
#         return None
#     return result.stdout.strip()

# def trigger_etl(username):
#     submit_cmd = f'spark-submit --master spark://spark-master:7077 --py-files /opt/spark_apps/utils.zip --deploy-mode client --executor-memory 1000Mb --total-executor-cores 2 --driver-memory 1G /opt/spark_apps/spark_etl.py {username}'
#     command = f'docker exec spark-master {submit_cmd}'
#     result = run_command(command)
#     return 
# #---------------------------------

# def getEtlTriggerCmd(username):
#     spark_command = f"""spark-submit --master spark://spark-master:7077 --py-files /opt/spark_apps/utils.zip --deploy-mode client --executor-memory 1000Mb --total-executor-cores 2 --driver-memory 1G /opt/spark_apps/spark_etl.py {username}"""
#     return spark_command

# def trigger_spark_job(ssh, username):
#     spark_command = getEtlTriggerCmd(username)
#     stdin, stdout, stderr = ssh.exec_command(spark_command)
#     output = stdout.read().decode()
#     error = stderr.read().decode()
#     print("output", output)
#     print("error", error)
#     if error:
#         logging.error(f"Error: {error}")
#         return None

#     logging.info(output)
#     return extract_application_id(output)

# def extract_application_id(output):
#     # Extract the application ID from the output (adjust regex as necessary)
#     import re
#     match = re.search(r'application_\d+_\d+', output)
#     if match:
#         return match.group(0)
#     return None

# def check_spark_job_status(ssh, app_id):
#     check_command = f"spark-submit --status {app_id}"
#     stdin, stdout, stderr = ssh.exec_command(check_command)
#     status_output = stdout.read().decode()
#     if "FINISHED" in status_output:
#         return ("Done", True)
#     elif "FAILED" in status_output:
#         return ("Done", False)
#     return (None, False)

# def main(username, host):
#     # Spark container details
#     spark_host = host
#     spark_user = 'root'
#     ssh = paramiko.SSHClient()
#     ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
#     ssh.connect(spark_host, username=spark_user)

#     try:
#         app_id = trigger_spark_job(ssh, username)
#     except Exception as e:
#         print(e)
#     if not app_id:
#         logging.error("Failed to start Spark job.")
#         return None

#     logging.info(f"Spark job started with application ID: {app_id}")
#     job_status = None
#     flag = False
#     while True:
#         job_status, flag = check_spark_job_status(ssh, app_id)
#         if job_status and flag == True:
#             logging.info(f"Spark job {app_id} executed successfully.")
#             break
#         elif job_status and flag == False:
#             logging.error(f"Spark job {app_id} failed.")
#             break
#         logging.info(f"Spark job {app_id} is still running...")
#         time.sleep(20)  # Wait for 30 seconds before checking again

#     # Proceed with the next steps
#     ssh.close()
#     return flag

# --------------------------------- Spark Event Listener ---------------------------------

# import subprocess
# import logging
# import time

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# def run_command(command):
#     logger.info("Executing command: %s", command)
#     process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
#     while True:
#         output = process.stdout.readline().strip()
#         if output:
#             logger.info(output)
#         return_code = process.poll()
#         if return_code is not None:
#             break
#     stdout, stderr = process.communicate()
#     return return_code, stdout.strip() if stdout is not None else None, stderr.strip() if stderr is not None else None

# def trigger_spark_job(username):
#     spark_command = f'spark-submit --master spark://spark-master:7077 --py-files /opt/spark_apps/utils.zip --deploy-mode client --executor-memory 1000Mb --total-executor-cores 2 --driver-memory 1G /opt/spark_apps/spark_etl.py {username}'
#     command = f'docker exec spark-master {spark_command}'  # Assuming Spark master container is named 'spark-master'
#     return run_command(command)

# def check_spark_job_status(app_id):
#     check_command = f"docker exec spark-master spark-submit --status {app_id}"  # Assuming Spark master container is named 'spark-master'
#     return run_command(check_command)

# def main(username):
#     try:
#         return_code, stdout, stderr = trigger_spark_job(username)
#         if return_code != 0:
#             logging.error(f"Error triggering Spark job: {stderr}")
#             return False

#         # Extract application ID from stdout (adjust as necessary)
#         app_id = extract_application_id(stdout)
#         if not app_id:
#             logging.error("Failed to extract application ID.")
#             return False

#         logging.info(f"Spark job started with application ID: {app_id}")
        
#         while True:
#             return_code, stdout, stderr = check_spark_job_status(app_id)
#             if return_code != 0:
#                 logging.error(f"Error checking Spark job status: {stderr}")
#                 break
                
#             if "FINISHED" in stdout:
#                 logging.info(f"Spark job {app_id} executed successfully.")
#                 return True
#             elif "FAILED" in stdout:
#                 logging.error(f"Spark job {app_id} failed.")
#                 return False
                
#             logging.info(f"Spark job {app_id} is still running...")
#             time.sleep(20)  # Wait for 20 seconds before checking again
#             logging.info("Re-check process", app_id)
            
#     except Exception as e:
#         logging.error(f"Exception occurred: {e}")
#         return False

#     return False

# # Function to extract application ID from stdout (adjust as necessary)
# def extract_application_id(output):
#     import re
#     match = re.search(r'application_\d+_\d+', output)
#     if match:
#         return match.group(0)
#     return None

import requests
import logging
import time
import subprocess
import threading


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')


SPARK_MASTER_URL = 'http://spark-master:8080/json/v1/applications'
CHECK_INTERVAL = 10  # seconds

def run_command(command):
    logging.info("Executing command: %s", command)
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    while True:
        output = process.stdout.readline().strip()
        if output:
            logging.info(output)
        return_code = process.poll()
        if return_code is not None:
            break
    stdout, stderr = process.communicate()
    return return_code, stdout.strip() if stdout is not None else None, stderr.strip() if stderr is not None else None

def trigger_etl(username):
    submit_cmd = f'spark-submit --master spark://spark-master:7077 --py-files /opt/spark_apps/utils.zip --deploy-mode client --executor-memory 1000Mb --total-executor-cores 2 --driver-memory 1G /opt/spark_apps/spark_etl.py {username}'
    command = f'docker exec spark-master {submit_cmd}'
    result = run_command(command)
    return 
#---------------------------------

def get_application_status():
    response = requests.get(SPARK_MASTER_URL)
    print(response)
    if response.status_code == 200:
        return response.json()
    else:
        logging.error(f"Failed to fetch applications. Status code: {response.status_code}")
        return None

def main(username):
    # Start trigger_etl in a separate thread
    trigger_thread = threading.Thread(target=trigger_etl, args=(username,))
    trigger_thread.start()

    # Monitor the Spark master for the application status
    app_id = None
    while True:
        data = get_application_status()
        logging.info(f'Fetch data from spark master')
        if data:
            # Check for active application
            if data['activeapps']:
                app_id = data['activeapps'][0]['id']
                logging.info(f"Active Application ID: {app_id}")

            # Check if the application has moved to completedapps
            if app_id and any(app['id'] == app_id for app in data['completedapps']):
                logging.info(f"Application {app_id} has completed.")
                return True
        
        logging.info(f"Checking again in {CHECK_INTERVAL} seconds...")
        time.sleep(CHECK_INTERVAL)