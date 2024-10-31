# Common Base
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile  # Install all dependencies

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
# Set environment variable for production
ENV NODE_ENV=production

# Build the app
RUN pnpm run build

# Remove dev dependencies after build
RUN pnpm prune --prod  # This will remove all dev dependencies, keeping only production dependencies.

EXPOSE 3000
CMD ["pnpm", "run", "start"]
