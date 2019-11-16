##############################
##
## Base stage
##
## This stage starts with the minimum config for any other stages
##
FROM node:12.6-alpine AS base

WORKDIR /usr/src/app

## copy files needed to install dependencies
COPY package.json yarn.lock ./

##############################
##
## Dependencies stage
##
## This stage creates both production and dev dependency installs so both
## can be cached as a single layer that doesn't need rebuilt unless the
## dependencies change. Production dependencies are installed to a non-default
## folder so they don't interfere with any build or validation commands in
## the following stages but can be easily copied to the final production image
##
FROM base AS dependencies
ARG NPM_TOKEN

RUN apk add --no-cache --virtual .gyp python make g++ \
  && npm install -g node-pre-gyp \
  && npm config set progress false

RUN yarn install --production --modules-folder production_nm_folder --frozen-lockfile \
  && yarn install \
  && rm -f .npmrc

##############################
##
## Validation stage
##
## This stage runs static analysis, dependency analysis, and automated unit tests
##
FROM dependencies AS validation

## copy all source files (minus exclusions from .dockerignore) into image
COPY . .

## run the linter, tests, and dependency check
RUN yarn run tslint \
  && yarn run test \
  && yarn run check-deps

##############################
##
## Compile stage
##
## This stage compiles the source to the final JS output files. It is based
## on the `dependencies` stage so no `validation` stage artifacts are
## carried over
##
FROM dependencies AS compile

## copy all source files (minus exclusions from .dockerignore) into image
COPY . .

## run the build
RUN yarn run raw-build

##############################
##
## Release stage
##
## This stage builds a production release image from the `dependencies`
## stage and the `compile` stage
##
FROM base AS release

## copy production node modules from `dependencies` stage
COPY --from=dependencies /usr/src/app/production_nm_folder ./node_modules

## copy built application from `compile` stage
COPY --from=compile /usr/src/app/lib ./lib

## start app
CMD ["node", "lib/index.js"]
