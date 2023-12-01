FROM postgres:15-alpine


USER root

RUN export LANGUAGE=en_US.UTF-8
ADD configs/hive-schema.postgres.sql /hive/hive-schema.postgres.sql
ADD configs/hive-txn-schema.postgres.sql /hive/hive-txn-schema.postgres.sql

COPY configs/init-hive-db.sh /docker-entrypoint-initdb.d/init-user-db.sh
