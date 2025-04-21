FROM node:22.14-alpine AS builder
WORKDIR /app

RUN echo "//gitlab-edu.supsi.ch/api/v4/projects/1051/packages/npm/:_authToken=${CI_JOB_TOKEN}" > .npmrc
RUN echo "@dti-isin:registry=https://gitlab-edu.supsi.ch/api/v4/projects/1051/packages/npm/" >> .npmrc

COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27.4-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]