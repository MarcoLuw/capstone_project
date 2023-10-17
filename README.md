# CAPSTONE PROJECT

This guide provides essential commands for working with Docker Compose and managing a Python virtual environment.


### Build and Run Images in Detach Mode

To **build** and **run** Docker images in detached mode, use the following command:
```shell
docker-compose up -d --build
```

### Stop and Remove Running Containers

To **stop** and **remove** the running Docker containers, use the following command:
```shell
docker-compose down
```

### Django and ReactJS Services

- Django service is accessible on **port 8000**.
- ReactJS service is accessible on **port 3000**.

### Activate Virtual Environment

Before coding or integrating with any Python file, **it's compulsory to activate** the virtual environment to ensure dependencies are isolated. Use the following command to activate the virtual environment:

```shell
.venv\Scripts\activate
```

### Deactivate Virtual Environment

To **deactivate** the virtual environment, simply run:

```shell
deactivate
```

## Install required packages and dependencies on local machine
If you want to working the directories, it demands some libraries and technologies installed for interacting with the source code.

### Install core libraries
1. Install python packages and libraries
```shell
pip install django==4.2.5
```
```shell
pip install djangorestframework==3.14.0
```
```shell
pip install django-cors-headers==4.2.0
```
```shell
pip install psycopg2-binary==2.9.9
```
2. Install Node
3. Install PostgreSQL - Follow the link: https://www.pgadmin.org/download/

### Connect a PostgreSQL container with PostgresSQL Client tools
This step provides developers with the handy approach to manage data in database and allows efficiently tracking database tables or columns.

1. Determine the Container IP Address
Find the IP address of PostgreSQL container.
```shell
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' your-postgres-container-name
```
Replace **your-container-name** with the name of your PostgreSQL container.
2. Using Command-Line Tools **(psql)**
```shell
psql -h your-container-ip -p your-port -d your-database -U your-username -W
```
Replace **your-container-ip**, **your-port**, **your-database**, **your-username**, and **your-password** with your specific values.
*Note: After the last command is executes, it will get your database password*