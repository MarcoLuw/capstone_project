FROM node:18.18.0-alpine

WORKDIR /app/frontend/

COPY package*.json /app/frontend/

RUN npm install

COPY . /app/frontend/

CMD ["npm", "start"]