FROM node:14.15.1 as builder
ARG NODE_ENV
ARG OPENTUTOR_CLIENT_VERSION
ENV OPENTUTOR_CLIENT_VERSION=${OPENTUTOR_CLIENT_VERSION}
RUN apt-get update && \
    apt-get install -y \
        libgif-dev \
        libglu1 \
        libjpeg-dev \
        libpng-dev \
        libtiff-dev \
        libxi-dev && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /build
COPY client ./client
RUN cd client && \
    npm ci && \
    npm run build
FROM node:14.15.1-slim
ENV TINI_VERSION=v0.16.1
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini 
WORKDIR /app
COPY docker .
COPY --from=builder /build/client/public /app/public/tutor
RUN npm ci --production 
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/tini", "--", "/app/entrypoint.sh"]