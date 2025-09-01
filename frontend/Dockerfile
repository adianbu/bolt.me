# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies for better caching
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:1.26-alpine

# Install additional tools for debugging and envsubst
RUN apk add --no-cache curl gettext

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Create startup script to handle environment variable substitution
RUN echo '#!/bin/sh' > /docker-entrypoint.d/30-envsubst.sh && \
    echo 'envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.d/30-envsubst.sh && \
    chmod +x /docker-entrypoint.d/30-envsubst.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]