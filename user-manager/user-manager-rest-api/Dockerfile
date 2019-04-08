# Multi-build docker image for a Node.js service
# ~293 MB of docker image

# Base layer with the essential build tools
FROM node:10.15.3-alpine AS base
# Set the working directory
WORKDIR /usr/app
# Copy dependencies specification and lock files
COPY package.json yarn.lock ./
# Install NodeJS production dependencies
RUN yarn --production

# Run lint and test checks
FROM base as staging
# Set the working directory
WORKDIR /usr/app
COPY --from=base /usr/app/node_modules ./node_modules
# Copy source code
ADD . /usr/app
# Add devDependencies
RUN yarn
RUN yarn lint
RUN yarn test:unit
RUN yarn build

FROM base
# Set the working directory
WORKDIR /usr/app

# Copy production dependencies from base stage
COPY --from=base /usr/app/node_modules node_modules

# Copy package.json and compiled artifact from staging stage
COPY --from=staging /usr/app/package.json package.json
COPY --from=staging /usr/app/dist dist

# Launch the app
EXPOSE ${APP_PORT}
ENTRYPOINT ["node", "dist/index.js"]
