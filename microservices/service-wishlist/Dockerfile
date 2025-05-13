FROM node:18.18.2 AS builder

WORKDIR /marketplace

COPY package.json ./
COPY swagger.json ./

# Install pnpm
RUN npm install -g pnpm typescript

# Install dependencies
RUN pnpm install

# Copy source
COPY . .

# Build
RUN pnpm run build

# Production image
FROM node:18.18.2-slim

ENV PORT 8000
ENV NODE_ENV production

WORKDIR /marketplace

COPY --from=builder /marketplace .
# COPY --from=builder /marketplace/dist ./dist
# COPY --from=builder /marketplace/package.json ./package.json
COPY --from=builder /marketplace/swagger.json ./dist/swagger.json
# COPY ./drizzle.config.ts .
# COPY ./entrypoint.sh .

RUN npm install --only=production --omit=dev

EXPOSE 8000

CMD ["./entrypoint.sh"]