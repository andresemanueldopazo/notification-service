# First build the static files of the site
FROM node:16-alpine as builder

WORKDIR /app

# TO DO: TRIM TO ONLY-NEEDED FILES
COPY ./ ./

RUN npm i
RUN npm run build

# Now the image that we'll be used to run the app
FROM nginx:alpine as production

COPY --from=builder /app/build /usr/share/nginx/html
# nginx config from the host
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

