# CAPSTONE PROJECT

This guide provides essential commands for working with Docker Compose and managing a Python virtual environment.
## Initial Environment
At the root directory (capstone_project/), you should **create a virtual environment** in order to install all required dependencies of Python.
```shell
python -m venv .venv
```

### Activate Virtual Environment

Before coding or integrating with any Python file, **it's compulsory to activate** the virtual environment to ensure dependencies are isolated. Use the following command to activate the virtual environment:

```shell
.venv\Scripts\activate
```

**Install all dependencies**
```shell
pip install -r requirements.txt
```

### Deactivate Virtual Environment
To **deactivate** the virtual environment, simply run:

```shell
deactivate
```

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
To **start** container again:
```shell
docker-compose up
```

### Django and ReactJS Services

- Django service is accessible on **port 8000**.
- ReactJS service is accessible on **port 3000**.

## Connect a PostgreSQL container with PostgresSQL Client tools
This step provides developers with the handy approach to manage data in database and allows efficiently tracking database tables or columns.

1. Determine the Container IP Address
Find the IP address of PostgreSQL container.
```shell
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' your-postgres-container-name
```
Replace **your-container-name** with the name of your PostgreSQL container.

2. Access into the POSTGRES CONTAINER
```shell
docker exec -it {postgres-container-name} bash
```
3. Using Command-Line Tools **(psql)**
```shell
psql -h your-host -d your-database -U your-username -W
```
Replace **your-container-ip**,  **your-database**, **your-username**, and **your-password** with your specific values.
\
\
*Note: After the last command is executes, it will get your database password*
4. If you're still outside the database, these command maybe handful
- **List all the database:** ``\l``
- **Connect to the database:** ``\c {your-database-name}``
- **List all the table of the database:** ``\dt``
- **View the specified table:** ``SELECT * FROM "User";``
\
\
*Note: Postgres is "Case-Sensitive", so please be careful when using DML or DDL commands*

## Naming Convention
**How to specify the correct branch name ?**
\
\
In this project, we will mostly utilize *CAMEL CASE* for services and *KEBAB CASE* for features.
\
(Follow this link: https://www.freecodecamp.org/news/programming-naming-conventions-explained/#what-is-kebab-case)
\
1. **Feature**
- Rules: ``feature/{service-name}-{feature-name}-[testing?]``
- Examples:
    - **Authentication** feature for **Backend**: ``feature/backend-authentication``
    - Feature for **Datawarehouse**: ``feature/datastorage-storedata``
    - If there is a **test branch**: ``feature/backend-authentication-testing``
2. **Bugfix**
- Rules: ``bugfix/{service-name}-{feature-name}-[component?]``
- Examples:
    - ``bugfix/backend-authentication``
    - ``bugfix/frontend-main-dashboard-login-button``
