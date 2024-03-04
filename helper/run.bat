@echo off

echo "Starting docker-compose..."

docker-compose -f ./backend/docker-compose.yml up
docker-compose -f ./frontend/docker-compose.yml up