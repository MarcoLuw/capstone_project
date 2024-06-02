# FROM python:3.10-bullseye

# ENV PYTHONUNBUFFERED=1
# ENV PYTHONDONTWRITEBYTECODE=1

# WORKDIR /app/backend

# COPY requirements.txt ./

# # Update apk
# RUN apk update

# # Install Docker CLI
# RUN apk add docker-cli

# # Build psycopg2-binary from source -- add required required dependencies
# RUN apk add --virtual .build-deps --no-cache postgresql-dev gcc g++ python3-dev musl-dev unixodbc-dev && \
#         pip install --no-cache-dir -r requirements.txt && \
#         apk --purge del .build-deps

# COPY . ./

# RUN chmod +x entrypoint.sh

# ENTRYPOINT ["sh", "entrypoint.sh"]

# # CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]

# Use the official Python image based on Debian Bullseye
FROM python:3.10-bullseye

# Set environment variables to prevent Python from writing pyc files to disk
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set the working directory inside the container
WORKDIR /app/backend

# Copy the requirements.txt file into the container
COPY requirements.txt ./

# Update the package lists for upgrades and new package installations
RUN apt-get update

# Install PostgreSQL development files and other dependencies required for psycopg2-binary
RUN apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    g++ \
    python3-dev \
    musl-dev \
    unixodbc-dev \
    docker.io \
    openssh-server \
    libhdf5-dev

# Install the requirements
RUN pip install --no-cache-dir -r requirements.txt

# Clean up APT when done
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the rest of the application code into the container
COPY . ./

# Make the entrypoint script executable
RUN chmod +x entrypoint.sh

# Set the entrypoint script as the default command to run when the container starts
ENTRYPOINT ["sh", "entrypoint.sh"]

# Uncomment the CMD line if you want to override the ENTRYPOINT with a default command
# CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
