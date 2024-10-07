# Switch to Debian-based Node.js image
FROM node:22-bullseye AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack for pnpm
RUN corepack enable

WORKDIR /workspace/freelyform-front

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
