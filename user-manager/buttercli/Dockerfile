# @project:   Butterfly
# @author:    DStack Group
# @module:    buttercli
# @fileName:  Dockerfile
# @created:   2019-03-07
#
# --------------------------------------------------------------------------------------------
# Copyright (c) 2019 DStack Group.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
#
# @description:

# Multi-build docker image for a Node.js service
# ~293 MB of docker image

# Base layer with the essential build tools
FROM node:10.15.3-alpine AS base

# Install git
# RUN apk update && apk upgrade && \
#     apk add --no-cache git openssh

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
RUN yarn build
RUN yarn standalone

FROM base
# Set the working directory
WORKDIR /usr/app

# Copy production dependencies from base stage
COPY --from=base /usr/app/node_modules node_modules

# Copy package.json and compiled artifact from staging stage
COPY --from=staging /usr/app/package.json package.json
COPY --from=staging /usr/app/dist dist

# Copy bin directory
COPY --from=staging /usr/app/bin bin

CMD ["yarn", "standalone"]
