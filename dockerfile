FROM node:20.10.0
WORKDIR /app
COPY . .
WORKDIR /app/recognify_client
RUN npm i
RUN npm run build

WORKDIR /app/recognify_backed
RUN npm i
RUN npm uni bcrypt
RUN npm i bcrypt
EXPOSE 5000
CMD [ "node","bin/www"]