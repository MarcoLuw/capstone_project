# FROM bitnami/spark:3.4.2
FROM python:3.10-bullseye

# Add Dependencies for PySpark
RUN apt-get update && apt-get install -y \
    curl \
    vim \
    wget \
    software-properties-common
RUN apt-get update -y && apt-get install -y \
    ssh \
    net-tools \
    ca-certificates \
    sudo \
    unzip \
    rsync \
    openjdk-11-jdk \
    build-essential \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt


ENV SPARK_VERSION=3.4.2 \
HADOOP_VERSION=3.3.6 \
SPARK_HOME=/opt/spark \
JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 \
PATH=$PATH:$JAVA_HOME/bin

RUN wget --no-verbose -O apache-spark.tgz "https://archive.apache.org/dist/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop3.tgz" \
&& mkdir -p /opt/spark \
&& tar -xf apache-spark.tgz -C /opt/spark --strip-components=1 \
&& rm apache-spark.tgz

# Install project dependencies

WORKDIR /opt/spark

ENV SPARK_MASTER_PORT=7077 \
SPARK_MASTER_WEBUI_PORT=8080 \
SPARK_LOG_DIR=/opt/spark/logs \
SPARK_MASTER_LOG=/opt/spark/logs/spark-master.out \
SPARK_WORKER_LOG=/opt/spark/logs/spark-worker.out \
SPARK_WORKER_WEBUI_PORT=8080 \
SPARK_WORKER_PORT=7000 \
SPARK_MASTER="spark://spark-master:7077" \
SPARK_WORKLOAD="master" \
PYSPARK_PYTHON=python3

ENV PYTHONPATH=$SPARK_HOME/python/:$PYTHONPATH

EXPOSE 8080 7077 7000

RUN mkdir -p $SPARK_LOG_DIR && \
touch $SPARK_MASTER_LOG && \
touch $SPARK_WORKER_LOG && \
ln -sf /dev/stdout $SPARK_MASTER_LOG && \
ln -sf /dev/stdout $SPARK_WORKER_LOG

COPY start-spark.sh /
RUN chmod +x /start-spark.sh
CMD ["/bin/bash", "/start-spark.sh"]