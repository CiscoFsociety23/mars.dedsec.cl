FROM node:slim

RUN apt-get update && apt-get install -y openssl libssl-dev

WORKDIR /api.dedsec.cl
COPY ./package.json .
COPY ./dist .
RUN npm install
RUN npx prisma generate
EXPOSE 8543

CMD ["node", "./index.js"]
