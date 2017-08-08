FROM node:6
MAINTAINER Abakus Webkom <webkom@abakus.no>

RUN mkdir -p /app
COPY . /app/
WORKDIR /app

RUN set -e \
  && apt-get update \
  && apt-get -qq install graphicsmagick \
  && apt-get clean \
  && make install-deps && make

VOLUME ["/app/public/images/unions"]

ENTRYPOINT ["make", "server"]
