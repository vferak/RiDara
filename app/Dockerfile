FROM node:16.18.1-alpine

RUN apk add bash

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3010

USER node

CMD npm run dev