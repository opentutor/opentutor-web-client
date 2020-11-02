FROM cypress/base:12
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY cypress ./cypress
COPY cypress.json .
ENTRYPOINT ["tail", "-f", "/dev/null"]