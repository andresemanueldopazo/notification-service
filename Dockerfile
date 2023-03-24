FROM node:16-alpine

WORKDIR service/

# TO DO: TRIM TO ONLY-NEEDED FILES
COPY ./ ./

RUN npm ci

RUN npm run build

CMD node ./dist/src/app.js
