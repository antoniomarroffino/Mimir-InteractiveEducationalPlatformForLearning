FROM node:22.14-alpine AS builder
WORKDIR /app
COPY .env .env
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev"]