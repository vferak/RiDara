FROM node:16.18.1-alpine

RUN apk add bash

WORKDIR /app

COPY . .

RUN npm install -g typescript ts-node @nestjs/cli

RUN npm install

EXPOSE 3000

USER node

CMD npm run start:dev