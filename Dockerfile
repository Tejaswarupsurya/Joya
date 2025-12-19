# Stage 1: Builder
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# Stage 2: Production
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "app.js"]
