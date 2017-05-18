# Deplopy an application with Docker


## 1. Using Docker for building an image
After cloning source code, we will create our application´s image using the [Official NodeJS base image](https://hub.docker.com/_/node/).
for this we will use a custom [Dockerfile](./Dockerfile)

```
git clone https://github.com/ageapps/SocketIOChatDemo.git
docker build -t node-chat .
docker run -p 8080:4000 node-chat
```

## 2. Using docker-compose
Now we are goung to build a multicontainer app using [docker-compose] having as services:
 + a modified version of ou app
 + the [Official MongoDB base image](https://hub.docker.com/_/mongo/). 

First of all install the new version of the app
```
git clone https://github.com/ageapps/docker-chat.git
```

Using docker-compose we can deploy multiple containers at once and make links between them. Developing using containers could look very triky, but here we are going to set up 2 enviroments:

### 2.1 Production enviroment

```
docker-compose up
```
### 2.2 Develop enviroment

```
docker-compose -f docker-compose.debug.yml up
```
