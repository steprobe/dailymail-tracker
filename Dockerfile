FROM node:14.3.0
WORKDIR /app

COPY package.json /app/
RUN npm install

COPY . /app/
WORKDIR /app/ 
CMD ["npm", "start"]

