FROM apache/hive:4.0.0

WORKDIR /opt

COPY entrypoint.sh /entrypoint.sh

USER hive
EXPOSE 9083

ENTRYPOINT ["bash", "/entrypoint.sh"]