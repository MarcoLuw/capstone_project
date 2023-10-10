# CAPSTONE PROJECT

This guide provides essential commands for working with Docker Compose and managing a Python virtual environment.

## Build and Run Images in Detach Mode

To **build** and **run** Docker images in detached mode, use the following command:
```shell
docker-compose up -d --build
```

## Stop and Remove Running Containers

To **stop** and **remove** the running Docker containers, use the following command:
```shell
docker-compose down
```

## Django and ReactJS Services

- Django service is accessible on **port 8000**.
- ReactJS service is accessible on **port 3000**.

## Activate Virtual Environment

Before coding or integrating with any Python file, **it's compulsory to activate** the virtual environment to ensure dependencies are isolated. Use the following command to activate the virtual environment:

```shell
.venv\Scripts\activate
```

## Deactivate Virtual Environment

To **deactivate** the virtual environment, simply run:

```shell
deactivate
```
