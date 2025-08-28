FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -D -H -u 1001 -h /home/nodejs -s /bin/sh -G nodejs -g nodejs nodejs

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build || (echo "TypeScript build failed" && exit 1)

# Remove dev dependencies to reduce image size
RUN npm ci --only=production && npm cache clean --force

# Create .env file from example if it doesn't exist
RUN if [ ! -f .env ]; then cp -n .env.example .env || echo "No .env.example found"; fi

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

# Switch to non-root user
USER nodejs

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]