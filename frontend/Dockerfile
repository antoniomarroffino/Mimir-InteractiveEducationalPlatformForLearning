FROM node:22.14-alpine AS builder
WORKDIR /app
COPY .env.production .env
COPY package.json .
COPY .npmrc .npmrc
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27.4-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]