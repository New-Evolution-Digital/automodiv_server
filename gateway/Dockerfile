#Base Image
FROM node:lts-alpine3.11 as prod

# Create App Directory
WORKDIR /app

COPY package*.json ./

# Install node_modules into app directory
RUN npm install

COPY . .

ENV NODE_ENV=production

CMD [ "npm", "start"]

FROM prod as dev

EXPOSE 7000

ENV NODE_ENV=development

RUN npm install -g nodemon

RUN npm install --only=dev

CMD ["npm","run","dev"]