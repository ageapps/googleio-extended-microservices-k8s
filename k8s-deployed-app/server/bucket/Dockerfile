FROM debian:jessie-slim

MAINTAINER Adrián García <age.apps.dev@gmail.com>
# Install needed tools
RUN apt-get update && apt-get install -y lsb-release && apt-get install -y curl

WORKDIR /server 

ENV FUSE_MOUNT_DIR=/content
ENV FUSE_BUCKET_NAME=fuse-test-bucket
# Add gcsfuse to resources.list 
RUN export GCSFUSE_REPO=gcsfuse-`lsb_release -c -s` && echo "deb http://packages.cloud.google.com/apt $GCSFUSE_REPO main" | tee /etc/apt/sources.list.d/gcsfuse.list
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -

# Update and install gcsfuse
RUN apt-get update && apt-get install -y gcsfuse


# Bundle app source
COPY ./app /server

RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh

RUN /bin/bash nodesource_setup.sh

RUN apt-get install -y nodejs && apt-get install -y build-essential  

# Install npm and bower dependencies
RUN npm install

COPY ./bucket/credentials . 
# Inject configurration script
COPY ./setUp.sh .


CMD /bin/bash ./setUp.sh && npm start