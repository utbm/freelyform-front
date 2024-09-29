# Dockerfile

# Common Base
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# Development Stage
FROM base AS development
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production Stage
FROM base AS production
WORKDIR /app
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
