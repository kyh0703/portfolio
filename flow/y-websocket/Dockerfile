FROM node:18-alpine
RUN mkdir -p /app/node_modules && chown -R node:node /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 1234
CMD [ "npm", "start" ]
