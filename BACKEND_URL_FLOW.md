# 🔄 Backend URL Flow Documentation

## Complete Flow: GitHub Actions → Docker → NGINX

This document explains how the backend URL flows from GitHub Actions through the Docker build process to NGINX configuration.

### 🎯 Flow Overview

```
GitHub Actions
    ↓ (build-args)
Dockerfile (Production Stage)
    ↓ (ENV variable)
docker-entrypoint.sh
    ↓ (envsubst)
NGINX Configuration
    ↓ (proxy_pass)
Backend API
```

### 📋 Detailed Flow Steps

#### 1. **GitHub Actions** (`/.github/workflows/deploy.yml`)
```yaml
env:
  BACKEND_URL: https://bolt-me-backend-zkedlr.livelyrock-95a93c0b.eastus.azurecontainerapps.io

build-args: |
  VITE_BACKEND_URL=${{ env.BACKEND_URL }}
```
- **Purpose**: Passes backend URL as build argument
- **Variable**: `VITE_BACKEND_URL`

#### 2. **Dockerfile - Production Stage** (`/frontend/Dockerfile`)
```dockerfile
# Accept build argument from GitHub Actions
ARG VITE_BACKEND_URL

# Set BACKEND_URL from build argument with fallback to default
ENV BACKEND_URL=${VITE_BACKEND_URL:-https://bolt-me-backend-zkedlr.livelyrock-95a93c0b.eastus.azurecontainerapps.io}
```
- **Purpose**: Converts build argument to environment variable
- **Input**: `VITE_BACKEND_URL` (build arg)
- **Output**: `BACKEND_URL` (env var)

#### 3. **Entrypoint Script** (`/frontend/docker-entrypoint.sh`)
```bash
# Process environment variables in NGINX template
envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
```
- **Purpose**: Substitutes environment variable in NGINX template
- **Input**: `${BACKEND_URL}` in template
- **Output**: Processed NGINX configuration

#### 4. **NGINX Configuration** (`/frontend/nginx.conf`)
```nginx
location /api/ {
    # Forward to backend Container App using BACKEND_URL
    proxy_pass ${BACKEND_URL};
    proxy_set_header Host $proxy_host;
    # ... other headers
}
```
- **Purpose**: Proxies API requests to backend
- **Input**: `${BACKEND_URL}` (gets substituted by envsubst)
- **Output**: API requests forwarded to backend

### 🔧 Key Configuration Points

#### **GitHub Actions Build Argument**
- ✅ `VITE_BACKEND_URL` passed as build argument
- ✅ Uses environment variable `BACKEND_URL` from workflow

#### **Dockerfile Multi-Stage Build**
- ✅ Build stage accepts `VITE_BACKEND_URL` 
- ✅ Production stage accepts `VITE_BACKEND_URL`
- ✅ Sets `BACKEND_URL` environment variable with fallback
- ✅ Uses custom entrypoint script

#### **Environment Variable Substitution**
- ✅ `gettext` package installed for `envsubst`
- ✅ Custom entrypoint script processes template
- ✅ NGINX configuration validation included

#### **NGINX Configuration**
- ✅ Uses `${BACKEND_URL}` variable for proxy_pass
- ✅ Proper Host header using `$proxy_host`
- ✅ Content Security Policy includes backend URL
- ✅ Template copied to `/etc/nginx/templates/default.conf.template`

### 🎉 Benefits of This Approach

1. **Single Source of Truth**: Backend URL defined once in GitHub Actions
2. **No Manual Configuration**: Everything automated through build process
3. **Environment Flexibility**: Can override backend URL per deployment
4. **Portal Deployment Ready**: Pre-configured containers work with Azure Portal
5. **No Post-Deployment Steps**: Eliminates need for configuration scripts

### 🧪 Testing the Flow

Run the test script to verify everything works:
```bash
./test-backend-url-flow.sh
```

This will:
- Build the frontend container with backend URL
- Verify environment variable is set correctly
- Check NGINX configuration substitution
- Confirm proxy_pass uses the correct URL

### 🚀 Deployment

1. **Commit and Push**: Changes trigger GitHub Actions build
2. **New Images**: Built with backend URL pre-configured
3. **Deploy via Portal**: Use new images in Azure Container Apps
4. **Automatic Connection**: Frontend automatically connects to backend

No more 502 errors! 🎉