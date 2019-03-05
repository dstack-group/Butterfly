### BASE
# Base layer with the essential build tools
FROM node:10.15.1-alpine AS base
RUN apk --no-cache add --update git
RUN apk --no-cache add bash \
      g++ \
      ca-certificates \
      lz4-dev \
      musl-dev \
      cyrus-sasl-dev \
      openssl-dev \
      make \
      python
RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev bsd-compat-headers py-setuptools bash
# Set the working directory
WORKDIR /usr/app
# Copy dependencies specification and lock files
COPY package.json yarn.lock ./

### DEPS
FROM base AS deps
# Install NodeJS dependencies
RUN yarn --production && yarn cache clean && rm -rf /tmp/*
# Install every NodeJS dependencies
RUN yarn
# Move dependencies in a temporary folder
RUN cp -R node_modules /tmp/node_modules

### TEST
FROM deps AS test
# Copy app source files
COPY . .
# Validate linting rules and execute tests
RUN yarn lint && yarn clean

### PRODUCTION
FROM base as production
# Copy production dependencies
COPY --from=deps /tmp/node_modules ./node_modules
# Copy app source files
COPY . .
# Build app
RUN yarn build
# Launch the app
ARG APP_PORT
EXPOSE ${APP_PORT}

ENTRYPOINT ["node", "./dist/index.js"]
