FROM node:17.6.0

ARG DB_URI
ENV DB_URI=$DB_URI

ARG BOT_TOKEN
ENV BOT_TOKEN=$BOT_TOKEN

ARG WS_ADDR
ENV WS_ADDR=$WS_ADDR

WORKDIR /app_home/
RUN mkdir ./app

COPY ./app .
COPY ./package.json .

RUN npm install



ENTRYPOINT [ "npm", "start" ]