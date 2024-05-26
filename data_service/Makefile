clean:
	docker compose down --rmi="all" --volumes

down:
	docker compose down

run:
	make down && docker compose up -d

run-generate:
	make down && sh download-jarfiles.sh

run-scaled:
	make down && docker compose up -d --scale spark-worker=3

stop:
	docker compose stop

submit:
	docker exec data_service-spark-master-1 spark-submit --master spark://spark-master-1:7077 --deploy-mode client ./apps/$(app)

submit-py-pi:
	docker exec data_servive-spark-master-1 spark-submit --master spark://spark-master-1:7077 /opt/spark/examples/src/main/python/pi.py

submit-py:
	docker exec data_servive-spark-master-1 spark-submit --master spark://spark-master-1:7077 --py-files $(script)

rm-results:
	rm -r data/results/*