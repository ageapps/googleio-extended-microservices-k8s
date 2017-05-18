FROM node:6.10-slim

# Create app directory
WORKDIR /app

# Bundle app source
COPY /SocketIOChatDemo /app

# Install npm and bower dependencies
RUN npm install

CMD npm start

