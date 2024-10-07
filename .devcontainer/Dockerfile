# Base image with Node.js 22 and Alpine Linux
FROM node:22-alpine

# Set up pnpm environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack for pnpm
RUN corepack enable

# Install dependencies needed for your build tools and general development
RUN apk add --no-cache bash git

# Create and set the working directory
WORKDIR /workspace/freelyform-front

# Copy over the package files to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Expose the Next.js port
EXPOSE 3000

# Run pnpm dev by default for a local development server
CMD ["pnpm", "run", "dev"]
