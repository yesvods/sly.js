FROM node:latest
MAINTAINER Firef0x

RUN cd /opt \
 && git clone https://github.com/Firef0x/json-server.git \
 && cd /opt/json-server \
 && npm install -g forever \
 && npm install \
 && chmod 755 /opt/json-server/run

EXPOSE 3003/tcp

VOLUME ["/opt/json-server/db", "/opt/json-server/log"]
WORKDIR /opt/json-server
CMD ["/opt/json-server/run"]
