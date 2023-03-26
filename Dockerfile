FROM node:16-alpine as builder

WORKDIR build/

# TO DO: TRIM TO ONLY-NEEDED FILES
COPY ./ ./
# install all dependencies, including dev
RUN npm ci
# because we need them to build
RUN npm run build
# then, delete all those dependencies
RUN rm -rf ./node_modules
# and install the production dependencies
RUN npm ci --omit=dev

FROM node:16-alpine as runner

WORKDIR service/

COPY --from=builder ./build/dist/src/ ./src
# copy the production dependencies
COPY --from=builder ./build/node_modules ./node_modules

CMD node ./src/app.js
