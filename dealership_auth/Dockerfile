#Base Image
FROM node:latest

#define node modules(nm's) cache
RUN mkdir /usr/src/cache
WORKDIR /usr/src/cache

#install nm's in cache
COPY package*.json ./
RUN npm install


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./entrypoint.sh /usr/src/app/
COPY . .
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

CMD [ "npm", "start" ]