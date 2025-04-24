FROM node:22.14-alpine AS builder
WORKDIR /app

ARG CI_JOB_TOKEN
ARG VITE_AZURE_CLIENT_ID
ARG VITE_AZURE_TENANT_ID
ARG VITE_REDIRECT_URI
ARG VITE_LOGOUT_REDIRECT_URI
ARG VITE_BACKEND_CLIENT_ID
ARG VITE_BACKEND_URL

ENV VITE_AZURE_CLIENT_ID=$VITE_AZURE_CLIENT_ID \
    VITE_AZURE_TENANT_ID=$VITE_AZURE_TENANT_ID \
    VITE_REDIRECT_URI=$VITE_REDIRECT_URI \
    VITE_LOGOUT_REDIRECT_URI=$VITE_LOGOUT_REDIRECT_URI \
    VITE_BACKEND_CLIENT_ID=$VITE_BACKEND_CLIENT_ID \
    VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN echo "//gitlab-edu.supsi.ch/api/v4/projects/1051/packages/npm/:_authToken=${CI_JOB_TOKEN}" > .npmrc
RUN echo "@dti-isin:registry=https://gitlab-edu.supsi.ch/api/v4/projects/1051/packages/npm/" >> .npmrc

COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27.4-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]