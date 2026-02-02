# Stage 1: Build & All Dependencies
FROM node:24.13.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Stage 2: Production Dependencies Only
FROM node:24.13.0-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 3: Final Runtime
FROM node:24.13.0-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy only what is strictly necessary
COPY --from=prod-deps /app/node_modules ./node_modules
COPY . .

# Security: Run as non-root user
USER node
EXPOSE 3000

# Direct node invocation for better signal handling
CMD ["node", "index.js"]