@echo off

IF "%1"=="install" (
  docker network create --subnet=172.20.0.0/16 hadoopnet

  rem Starting Postresql Hive metastore
  ECHO ">> Starting postgresql hive metastore ..."
  docker run -d --net hadoopnet --ip 172.20.1.4 --hostname psqlhms --name psqlhms -e POSTGRES_PASSWORD=hive -it capstone_project/hadoop_cluster:postgresql-hms
  TIMEOUT /t 5 /nobreak > nul
  
  rem 3 nodes
  ECHO ">> Starting master and worker nodes ..."
  docker run -d --net hadoopnet --ip 172.20.1.1 -p 8088:8088 --hostname masternode --add-host node2:172.20.1.2 --add-host node3:172.20.1.3 --name masternode -it capstone_project/hadoop_cluster:hive
  docker run -d --net hadoopnet --ip 172.20.1.2 --hostname node2 --add-host masternode:172.20.1.1 --add-host node3:172.20.1.3 --name node2 -it capstone_project/hadoop_cluster:spark
  docker run -d --net hadoopnet --ip 172.20.1.3 --hostname node3 --add-host masternode:172.20.1.1 --add-host node2:172.20.1.2 --name node3 -it capstone_project/hadoop_cluster:spark

  rem Format masternode
  ECHO ">> Formatting hdfs ..."
  docker exec -u hadoop -it masternode hdfs namenode -format
  call :startServices
  EXIT /B 0
)


IF "%1"=="stop" (
  call :stopServices
  EXIT /B 0
)


IF "%1"=="uninstall" (
  call :stopServices
  docker rmi capstone_project/hadoop_cluster:hadoop capstone_project/hadoop_cluster:spark capstone_project/hadoop_cluster:hive capstone_project/hadoop_cluster:postgresql-hms -f
  docker network rm hadoopnet
  docker system prune -f
  EXIT /B 0
)


IF "%1"=="start" (
  docker start psqlhms masternode node2 node3
  call :startServices
  EXIT /B 0
)

IF "%1"=="pull_images" (
  docker pull -a capstone_project/hadoop_cluster
  EXIT /B 0
)

ECHO "Usage: cluster.bat pull_images|install|start|stop|uninstall"
ECHO "                 pull_images - download all docker images"
ECHO "                 install - Prepare to run and start for first time all containers"
ECHO "                 start  - start existing containers"
ECHO "                 stop   - stop running processes"
ECHO "                 uninstall - remove all docker images"


EXIT /B 0

rem Bring the services up
:startServices
docker start masternode node2 node3
TIMEOUT /t 5 /nobreak > nul
ECHO ">> Starting hdfs ..."
docker exec -u hadoop -it masternode start-dfs.sh
TIMEOUT /t 5 /nobreak > nul
ECHO ">> Starting yarn ..."
docker exec -u hadoop -d masternode start-yarn.sh
TIMEOUT /t 5 /nobreak > nul
ECHO ">> Starting MR-JobHistory Server ..."
docker exec -u hadoop -d masternode mr-jobhistory-daemon.sh start historyserver
TIMEOUT /t 5 /nobreak > nul
ECHO ">> Starting Spark ..."
docker exec -u hadoop -d masternode start-master.sh
docker exec -u hadoop -d node2 start-slave.sh masternode:7077
docker exec -u hadoop -d node3 start-slave.sh masternode:7077
TIMEOUT /t 5 /nobreak > nul
ECHO ">> Starting Spark History Server ..."
docker exec -u hadoop masternode start-history-server.sh
TIMEOUT /t 5 /nobreak > nul
ECHO ">> Preparing hdfs for hive ..."
docker exec -u hadoop -it masternode hdfs dfs -mkdir -p /tmp
docker exec -u hadoop -it masternode hdfs dfs -mkdir -p /user/hive/warehouse
docker exec -u hadoop -it masternode hdfs dfs -chmod -R 777 /tmp
docker exec -u hadoop -it masternode hdfs dfs -chmod -R 777 /user/hive/warehouse
TIMEOUT /t 5 /nobreak > nul
ECHO ">> Starting Hive Metastore ..."
docker exec -u hadoop -d masternode hive --service metastore
docker exec -u hadoop -d masternode hive --service hiveserver2

ECHO "Hadoop info @ masternode: http://172.20.1.1:8088/cluster"
ECHO "DFS Health @ masternode : http://172.20.1.1:50070/dfshealth"
ECHO "MR-JobHistory Server @ masternode : http://172.20.1.1:19888"
ECHO "Spark info @ masternode  : http://172.20.1.1:8080"
ECHO "Spark History Server @ masternode : http://172.20.1.1:18080"
EXIT /B 0

:stopServices
ECHO ">> Stopping Spark Master and slaves ..."
docker exec -u hadoop -d masternode stop-master.sh
docker exec -u hadoop -d node2 stop-slave.sh
docker exec -u hadoop -d node3 stop-slave.sh

ECHO ">> Stopping containers ..."
docker stop masternode node2 node3 psqlhms
EXIT /B 0
