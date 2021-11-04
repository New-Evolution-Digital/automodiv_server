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