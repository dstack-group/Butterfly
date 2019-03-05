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
RUN yarn cache clean && yarn && rm -rf /tmp/*
# Move production dependencies in a temporary folder
RUN cp -R node_modules /tmp/node_modules

### TEST
FROM deps AS test
# Copy NodeJS dependencies from deps
COPY --from=deps /tmp/node_modules ./node_modules
# Copy app source files
COPY . .
# Validate linting rules and prepare build
RUN yarn lint && yarn clean
# Build app
RUN yarn build
# Move dependencies and dist files in a temporary folder
RUN cp -R package.json /tmp/package.json
RUN cp -R dist /tmp/dist

### PRODUCTION
FROM base as production
# Copy production dependencies
COPY --from=deps /tmp/node_modules ./node_modules
# Copy app dist files
COPY --from=test /tmp/package.json ./package.json
COPY --from=test /tmp/dist ./dist
# Launch the app
EXPOSE ${APP_PORT}
CMD ["node", "dist/index.js"]
