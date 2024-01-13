# pull official base image
FROM node:16-alpine

# set working directory
WORKDIR /app/frontend

# add `/app/frontend/node_modules/.bin` to $PATH
ENV PATH /app/frontend/node_modules/.bin:$PATH

# install app dependencies
COPY package*.json ./
RUN npm install --silent
RUN npm install react-scripts@4.0.0 -g --silent

# add app
COPY . ./

# Expose port
EXPOSE 3000

# start app
CMD ["npm", "start"]
