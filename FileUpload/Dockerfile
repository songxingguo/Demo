FROM node:20.12.1
WORKDIR /app
COPY package.json server.js ./
RUN npm install
EXPOSE 3000
CMD node server.js