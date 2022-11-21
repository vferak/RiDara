FROM node:18.12.1-alpine

RUN apk add bash

WORKDIR /app

COPY . .

RUN npm install -g typescript ts-node

RUN npm install

EXPOSE 3000

USER node

CMD npm run start:dev