FROM node:22-alpine

RUN npm install -g pnpm@10

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]