#!/bin/sh

# Startup script for NGINX with environment variable substitution
# This script processes environment variables in the NGINX configuration template

echo "🔧 Starting NGINX with environment variable substitution..."

# Display the backend URL being used
echo "Backend URL: ${BACKEND_URL:-https://bolt-me-backend-zkedlr.livelyrock-95a93c0b.eastus.azurecontainerapps.io}"

# Process environment variables in NGINX template
envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Validate NGINX configuration
if nginx -t; then
    echo "✅ NGINX configuration is valid"
else
    echo "❌ NGINX configuration error!"
    exit 1
fi

# Start NGINX
echo "🚀 Starting NGINX..."
exec nginx -g "daemon off;"