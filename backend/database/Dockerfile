# FROM python:3.10-alpine

# ENV PYTHONUNBUFFERED=1
# ENV PYTHONDONTWRITEBYTECODE=1

# WORKDIR /app/backend

# COPY requirements.txt /app/backend/

# # Build psycopg2-binary from source -- add required required dependencies
# RUN apk add --virtual .build-deps --no-cache postgresql-dev gcc python3-dev musl-dev && \
#         pip install --no-cache-dir -r requirements.txt && \
#         apk --purge del .build-deps

# COPY . /app/backend/

# CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]

FROM python:3.10-alpine

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip 

# copy project
COPY . /usr/src/app

EXPOSE 8000

CMD [".", "./.venv/Scripts/activate","python", "manage.py", "runserver", "0.0.0.0:8000"]