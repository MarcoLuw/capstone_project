FROM node:18-alpine

# Declaring env
ENV NODE_ENV development

WORKDIR /app/frontend/

COPY package*.json /app/frontend/

RUN npm install

COPY . /app/frontend/

CMD ["npm", "start"]