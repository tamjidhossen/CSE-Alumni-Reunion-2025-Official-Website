# Build stage
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM caddy:2
COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile