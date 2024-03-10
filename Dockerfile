FROM node:slim

RUN apt-get update && apt-get install -y openssl libssl-dev

WORKDIR /api.dedsec.cl
COPY . .
RUN npm i -g nodemon
RUN npm i
EXPOSE 8543

CMD ["nodemon", "src/index.ts"]
