# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Accept build arguments
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Install dependencies for better caching
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:1.26-alpine

# Accept build argument from GitHub Actions
ARG VITE_BACKEND_URL

# Install additional tools for debugging and envsubst
RUN apk add --no-cache curl gettext

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy custom entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set BACKEND_URL from build argument with fallback to default
ENV BACKEND_URL=${VITE_BACKEND_URL:-https://bolt-me-backend-zkedlr.livelyrock-95a93c0b.eastus.azurecontainerapps.io}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["/docker-entrypoint.sh"]