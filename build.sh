#!/bin/bash

mkdir .database

cp ./api/config/config.yaml.dist ./api/config/config.yaml
cp ./app/.env.dist ./app/.env

docker-compose build

docker-compose run api npm install

docker-compose run app npm install

docker-compose run api npm run database:fresh:seeded

docker-compose down

docker-compose up --force-recreate
