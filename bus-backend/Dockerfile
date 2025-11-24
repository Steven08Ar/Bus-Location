FROM node:20-alpine as base

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

# build
COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
