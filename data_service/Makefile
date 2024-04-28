clean:
	docker compose down --rmi="all" --volumes

down:
	docker compose down

run:
	make down && docker compose up

run-generated:
	make down && sh ./generate-docker-compose.sh 3 && docker compose -f docker-compose.generated.yml up

run-scaled:
	make down && docker compose up --scale spark-worker=3

run-d:
	make down && docker compose up -d

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