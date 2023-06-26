
#######################################################
# Stage 0

#getting started with docker
FROM node:20.3-alpine3.17@sha256:ff86266a784bbe13506b72602326be208068ffb27b343c409233b60ce681d366 AS dependencies


LABEL maintainer="Deep Patel <dpatel425@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

ENV NODE_ENV=production
# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Option 3: explicit filenames - Copy the package.json and package-lock.json
# files into the working dir (/app), using full paths and multiple source
# files.  All of the files will be copied into the working dir `./app`
COPY package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
#RUN npm install
RUN npm ci --only=production


#####################################################################################################

# Stage 1
FROM node:20.3-alpine3.17@sha256:ff86266a784bbe13506b72602326be208068ffb27b343c409233b60ce681d366 AS build

WORKDIR /app

COPY --from=dependencies /app /app
# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080

#####################################################################################################

