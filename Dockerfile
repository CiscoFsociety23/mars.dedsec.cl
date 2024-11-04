FROM node:slim

RUN apt-get update && apt-get install -y openssl libssl-dev

WORKDIR /api.dedsec.cl
COPY ./dist .
RUN npm i 
EXPOSE 8543

CMD ["node", "./index.js"]
