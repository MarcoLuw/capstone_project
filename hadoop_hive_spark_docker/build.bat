@echo off
REM Construccion de los Contendores Docker
@REM echo "Y" | ssh-keygen -t rsa -P "" -f configs/id_rsa

REM Hadoop build
@REM docker build -f ./hadoop/Dockerfile . -t capstone_project/hadoop_cluster:hadoop

REM Spark
docker build -f ./spark/Dockerfile . -t capstone_project/hadoop_cluster:spark

REM PostgreSQL Hive Metastore Server
docker build -f ./postgresql-hms/Dockerfile . -t capstone_project/hadoop_cluster:postgresql-hms

REM Hive
docker build -f ./hive/Dockerfile . -t capstone_project/hadoop_cluster:hive

