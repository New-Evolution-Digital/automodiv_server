#Base Image
FROM node:lts-alpine as base

# Create App Directory
WORKDIR /app

COPY package*.json ./

# Install node_modules into app directory
RUN npm install

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN npm run build

FROM prod as dev

EXPOSE 7001

RUN npm install -g nodemon

RUN npm install --only=dev

CMD ["npm","run","dev"]