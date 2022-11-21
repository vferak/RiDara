FROM node:18.12.1-alpine

RUN apk add bash curl

RUN curl -fsSL "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -o /bin/pnpm; chmod +x /bin/pnpm

WORKDIR /app

COPY . .

RUN pnpm install

EXPOSE 3000

USER node

CMD pnpm start:dev