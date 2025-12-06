## Build stage
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package files first
COPY package.json pnpm-lock.yaml ./

# Install build dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build


## Production image
FROM node:18-alpine
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy build artifacts from builder stage
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main"]