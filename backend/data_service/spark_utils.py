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