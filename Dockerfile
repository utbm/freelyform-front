# Dockerfile

# Common Base
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Development Stage
FROM base AS development
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
EXPOSE 3000
CMD ["pnpm", "run", "dev"]

# Production Stage
FROM base AS production
WORKDIR /app
COPY . .
RUN pnpm run build
EXPOSE 3000
CMD ["pnpm", "run", "start"]
