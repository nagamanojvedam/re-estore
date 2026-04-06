FROM node:22-alpine AS frontend

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm config set node-linker hoisted
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

##################################################

FROM nginx:stable-alpine

COPY --from=frontend /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx","-g","daemon off;"]