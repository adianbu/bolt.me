# bolt.me 🚀

A modern AI-powered website builder that generates complete, working websites from text prompts.

## Table of Contents

- [Overview](#overview-🌟)
- [Features](#features-✨)
- [Project Structure](#project-structure-📁)
- [Tech Stack](#tech-stack-🛠️)
- [Prerequisites](#prerequisites-📋)
- [Quick Start](#quick-start-🚀)
- [API Keys Setup](#api-keys-setup-🔐)
- [Environment Configuration](#environment-configuration-🔧)
- [Local Development](#local-development-💻)
- [Docker Development](#docker-development-🐳)
- [Production Deployment](#production-deployment-🌐)
- [Azure Deployment](#azure-deployment-☁️)
- [API Reference](#api-reference-🔌)
- [Testing](#testing-🧪)
- [Troubleshooting](#troubleshooting-🛠️)
- [Contributing](#contributing-🤝)
- [License](#license-⚖️)

## Overview 🌟

bolt.me is a full-stack web application that allows users to describe the website they want to create and watch it come to life in seconds. The application uses AI to generate clean, responsive code based on user prompts.

## Features ✨

- **AI-Powered Website Generation**: Create complete websites using just text descriptions
- **Lightning Fast**: Generate websites in seconds with just a text prompt
- **Clean Code**: Well-structured, maintainable code that's easy to customize
- **Responsive Design**: Mobile-friendly websites that look great on all devices
- **Live Preview**: View your generated website in real-time
- **Code Editor**: Examine and modify the generated code
- **WebContainer Integration**: Run the generated code directly in the browser
- **Download Feature**: Export generated code as ZIP files with proper structure

## Project Structure 📁

```
bolt.me/
├── backend/                    # Node.js/Express API server
│   ├── src/
│   │   ├── defaults/
│   │   │   └── node.ts         # Default Node.js configurations
│   │   ├── constants.ts        # Application constants
│   │   ├── index.ts           # Main server entry point
│   │   ├── prompts.ts         # AI prompt configurations
│   │   └── stripindents.ts    # String formatting utilities
│   ├── Dockerfile             # Backend Docker configuration
│   ├── package.json           # Backend dependencies
│   └── tsconfig.json          # TypeScript configuration
│
├── frontend/                   # React/Vite frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/
│   │   │   │   └── Button.tsx # Reusable UI components
│   │   │   ├── CodePreview.tsx     # Code editor component
│   │   │   ├── ExecutionSteps.tsx  # Build steps display
│   │   │   ├── FileExplorer.tsx    # Project file browser
│   │   │   ├── FilePreview.tsx     # File content viewer
│   │   │   ├── Header.tsx          # App header
│   │   │   ├── PreviewFrame.tsx    # Website preview iframe
│   │   │   └── PromptInput.tsx     # AI prompt input
│   │   ├── hooks/
│   │   │   └── useWebContainer.ts  # WebContainer API hook
│   │   ├── pages/
│   │   │   ├── HomePage.tsx        # Landing page
│   │   │   └── ResultsPage.tsx     # Generated website results
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript type definitions
│   │   ├── utils/
│   │   │   ├── cn.ts              # CSS class utility
│   │   │   ├── config.ts          # App configuration
│   │   │   └── parseXML.ts        # XML parsing utilities
│   │   ├── App.tsx               # Main React component
│   │   ├── index.css             # Global styles
│   │   ├── main.tsx              # React entry point
│   │   └── vite-env.d.ts         # Vite type definitions
│   ├── Dockerfile                # Frontend Docker configuration
│   ├── docker-entrypoint.sh      # Docker startup script
│   ├── nginx.conf                # NGINX configuration
│   ├── package.json              # Frontend dependencies
│   └── vite.config.ts            # Vite build configuration
│
├── deployment/                   # Deployment configurations
│   ├── azure-container-apps-template.json  # Container Apps template (recommended)
│   ├── azure-container-apps-parameters.json # Container Apps parameters
│   ├── azure-portal-parameters-template.json # Portal deployment parameters
│   ├── k8s-deployment.yaml             # Kubernetes deployment
│   └── docker-compose.yml              # Local Docker Compose configuration
│
├── scripts/                      # Essential deployment scripts
│   ├── local-development.sh           # Local development setup
│   ├── ci-cd-validation.sh            # CI/CD testing script
│   ├── deploy-azure.sh                # Azure Container Instances deployment
│   └── deploy-container-apps.sh       # Azure Container Apps deployment
│
├── .env.local.template               # Environment variables template
├── .env.azure.template               # Azure deployment template
└── README.md                         # This comprehensive documentation
```

## Tech Stack 🛠️

### Frontend 🎨
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **Runtime**: WebContainer API (in-browser code execution)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **File Handling**: JSZip (for download functionality)
- **Routing**: React Router DOM

### Backend 🔧
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Integration**: 
  - Anthropic AI SDK (Claude)
  - Google Gemini AI SDK
- **CORS**: Enabled for cross-origin requests
- **Environment**: dotenv for configuration

### Infrastructure 🏗️
- **Containerization**: Docker & Docker Compose
- **Web Server**: NGINX (for frontend)
- **Cloud Platforms**: Azure Container Apps, Azure Container Instances
- **Container Registry**: GitHub Container Registry (ghcr.io)
- **Orchestration**: Kubernetes support

## Prerequisites 📋

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **Docker** and **Docker Compose** - [Download](https://docs.docker.com/get-docker/)
- **Git** - [Download](https://git-scm.com/downloads)

### Required API Keys:
- **Anthropic API Key** - [Get from Anthropic Console](https://console.anthropic.com/)
- **Google Gemini API Key** - [Get from AI Studio](https://aistudio.google.com/app/apikey)

Optional for deployment:
- **Azure Account** - [Create free account](https://azure.microsoft.com/free/)
- **GitHub Account** - [Sign up](https://github.com/) (for container registry)

## Quick Start 🚀

### 🎯 Fastest Way to Start (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/bolt.me.git
cd bolt.me

# 2. Create environment file
cp .env.local.template .env.local

# 3. Add your API keys to .env.local
# ANTHROPIC_API_KEY=sk-ant-api03-...
# GEMINI_API_KEY=AIzaSy...

# 4. Start the application
./local-development.sh
```

**Access URLs:**
- 🌐 Frontend: http://localhost:8080
- 🔧 Backend API: http://localhost:3000
- ❤️ Health Check: http://localhost:3000/health

## API Keys Setup 🔐

### 1. Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-api03-`)

### 2. Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key (starts with `AIzaSy`)

### 3. GitHub Personal Access Token (For Deployment)
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select `packages:read` scope
4. Copy the generated token

## Environment Configuration 🔧

### Local Development Environment

Create `.env.local` file in the project root:

```bash
# ====================
# API KEYS (REQUIRED)
# ====================
ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-key-here
GEMINI_API_KEY=AIzaSy-your-gemini-key-here

# ====================
# DOCKER CONFIGURATION
# ====================
REGISTRY_NAME=ghcr.io
IMAGE_TAG=latest
FRONTEND_PORT=8080
BACKEND_PORT=3000
NODE_ENV=development
VITE_API_URL=http://localhost:3000

# ====================
# DOCKER SETTINGS
# ====================
RESTART_POLICY=unless-stopped
LOG_MAX_SIZE=10m
LOG_MAX_FILE=3
ENV_FILE_PATH=./backend/.env
```

### Production Environment

For production deployments, create `.env.production`:

```bash
# Production API Keys
ANTHROPIC_API_KEY=your-production-anthropic-key
GEMINI_API_KEY=your-production-gemini-key

# Production Configuration
NODE_ENV=production
REGISTRY_NAME=ghcr.io
IMAGE_TAG=latest
FRONTEND_PORT=80
BACKEND_PORT=3000
VITE_API_URL=https://your-backend-domain.com

# Security Settings
RESTART_POLICY=always
LOG_MAX_SIZE=50m
LOG_MAX_FILE=5
```

## Local Development 💻

### Option 1: Automated Setup (Recommended)

Use the provided development script that handles everything:

```bash
# Start development environment
./local-development.sh
```

This script will:
- ✅ Validate your environment configuration
- ✅ Build containers from local source code
- ✅ Start the development environment
- ✅ Perform health checks
- ✅ Test API endpoints
- ✅ Provide useful debugging commands

### Option 2: Manual Setup

```bash
# Stop any existing containers
docker-compose --env-file .env.local down

# Build and start containers
docker-compose --env-file .env.local up --build -d

# View logs
docker-compose --env-file .env.local logs -f

# Stop containers when done
docker-compose --env-file .env.local down
```

### Option 3: Node.js Development (Without Docker)

**Backend Setup:**
```bash
cd backend
npm install
npm run build
npm run dev
```

**Frontend Setup (separate terminal):**
```bash
cd frontend
npm install
npm run dev
```

**⚠️ Important**: Never run `docker-compose up` without `--env-file .env.local` as this causes 500 API errors!

## Docker Development 🐳

### Container Architecture

```
┌──────────────────────────────────────────────────┐
│                Load Balancer                    │
│                (NGINX)                          │
│            Port 8080 → 80                       │
└────────────────┬─────────────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                            │
┌───▼──────────────┐    ┌────────────▼──────────────┐
│   Frontend     │    │      Backend       │
│   (React)      │    │   (Node.js/Express)│
│   Port 80      │    │     Port 3000      │
│                │    │                    │
│ • React App    │    │ • API Endpoints    │
│ • Monaco Editor│    │ • AI Integration   │
│ • WebContainer │    │ • Health Checks    │
│ • File Download│    │                    │
└────────────────┘    └────────────────────┘
```

### Docker Compose Services

#### Frontend Service
- **Base Image**: `nginx:1.26-alpine`
- **Build Context**: `./frontend`
- **Exposed Port**: `8080:80`
- **Features**:
  - React application built with Vite
  - NGINX reverse proxy for API requests
  - Health checks enabled
  - Log rotation configured

#### Backend Service
- **Base Image**: `node:20-alpine`
- **Build Context**: `./backend`
- **Exposed Port**: `3000:3000`
- **Features**:
  - Express.js API server
  - AI integrations (Anthropic Claude, Google Gemini)
  - Health check endpoint
  - Environment variable validation

### Docker Commands Reference

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View container logs
docker logs boltme-backend-1 -f
docker logs boltme-frontend-1 -f

# Execute commands in containers
docker exec -it boltme-backend-1 sh
docker exec -it boltme-frontend-1 sh

# Check environment variables
docker exec boltme-backend-1 printenv | grep API_KEY

# Restart specific container
docker restart boltme-backend-1

# Remove all containers and rebuild
docker-compose --env-file .env.local down
docker-compose --env-file .env.local up --build -d
```

## Production Deployment 🌐

### Scripts Reference 📖

The project includes several deployment scripts:

#### 🛠️ `local-development.sh`
**Purpose**: Daily development workflow
- Validates environment configuration
- Builds from local source code
- Starts development environment
- Performs health checks

```bash
./local-development.sh
```

#### 🧪 `ci-cd-validation.sh`
**Purpose**: CI/CD pipeline testing
- Builds and pushes to Docker Hub
- Tests published Docker images
- Comprehensive API validation
- Release candidate testing

```bash
./ci-cd-validation.sh [your-dockerhub-username]
```

#### ☁️ `deploy-container-apps.sh`
**Purpose**: Azure Container Apps deployment (Recommended)
- Infrastructure deployment
- Container registry setup
- Automated scaling configuration
- **Automatic frontend-backend connection**

#### 🏢 `deploy-azure.sh`
**Purpose**: Azure Container Instances deployment (Legacy)
- Container Instances deployment
- Manual networking setup
- Basic Azure deployment

### Kubernetes Deployment ⚓
```bash
# Deploy to Kubernetes cluster
kubectl apply -f k8s-deployment.yaml

# Check deployment status
kubectl get pods -n bolt-me
kubectl get services -n bolt-me

# View logs
kubectl logs -f deployment/bolt-me-frontend -n bolt-me
kubectl logs -f deployment/bolt-me-backend -n bolt-me
```

## Azure Deployment ☁️

### Quick Deploy (10 minutes) - Azure Portal Method

#### Required Information:
- **Anthropic API Key**: Get from https://console.anthropic.com/
- **Google Gemini API Key**: Get from https://aistudio.google.com/app/apikey  
- **GitHub Personal Access Token**: For accessing container images
  - Go to GitHub → Settings → Developer settings → Personal access tokens
  - Create token with `packages:read` permission

#### Step-by-Step Deployment

1. **Access Azure Portal**
   - Go to https://portal.azure.com
   - Sign in with your Azure account

2. **Navigate to Custom Deployment**
   - Search: "Deploy a custom template"
   - Click "Build your own template in the editor"

3. **Upload ARM Template** 
   - Click "Load file"
   - Upload: `azure-container-apps-template.json`
   - Click "Save"

4. **Configure Deployment Parameters**
   - **Resource group**: `bolt-me-rg` (create new)
   - **Region**: `East US`
   - **Cost level**: `balanced` (recommended)
   - **API Keys**: Paste your Anthropic and Gemini keys
   - **GitHub Token**: Paste your GitHub Personal Access Token

5. **Deploy**
   - Click "Review + create"
   - Wait for deployment (5-10 minutes)

#### Cost Optimization Tiers

| Tier | Monthly Cost | Best For | Resources |
|------|-------------|----------|----------|
| 💚 **Minimal** | $8-12 | Testing/low traffic | 0.25 CPU, 0.5Gi RAM |
| 💛 **Balanced** | $12-18 | **Recommended for production** | 0.5 CPU, 1Gi RAM |
| 💙 **Performance** | $20-30 | High traffic | 1.0 CPU, 2Gi RAM |

### Azure Container Apps Features

- ✅ **Built-in HTTPS** with managed certificates
- ✅ **Auto-scaling** based on traffic (including scale to zero)
- ✅ **Cost optimization** with multiple tiers
- ✅ **Zero-downtime deployments**
- ✅ **Automatic frontend-backend connection**

### Backend URL Configuration Flow

The system automatically handles frontend-backend connectivity through Azure Container Apps internal networking:

```
Azure Container Apps Environment
    ↓ (automatic service discovery)
Frontend Container (NGINX)
    ↓ (proxy_pass /api/ → backend)
Backend Container (Express)
    ↓ (AI endpoints)
Anthropic Claude & Google Gemini
```

**Key Benefits:**
1. **Zero Configuration**: Works out-of-the-box with Azure Container Apps
2. **Built-in HTTPS**: Managed certificates for both frontend and backend
3. **Internal Networking**: Secure service-to-service communication
4. **Auto-scaling**: Both containers scale independently based on demand
5. **Cost Optimized**: Scale-to-zero when not in use

### ✅ Automatic Connection (Default)

The Azure Container Apps deployment now includes **automatic frontend-backend connectivity**! The ARM template configures:

- **NGINX Proxy**: Frontend automatically proxies `/api/` requests to backend
- **Environment Variables**: Backend URL is automatically injected during deployment
- **Container Apps Integration**: Uses Azure's internal networking for seamless communication

**No manual configuration needed!** Just deploy and test. 🎉

### Backup Configuration (If Needed)

If for any reason automatic connection doesn't work:

```bash
# Get backend URL
BACKEND_URL=$(az containerapp show --name $(az containerapp list --resource-group bolt-me-rg --query "[?contains(name, 'backend')].name" -o tsv) --resource-group bolt-me-rg --query "properties.configuration.ingress.fqdn" -o tsv)
echo "Backend URL: https://$BACKEND_URL"

# Get frontend app name
FRONTEND_APP=$(az containerapp list --resource-group bolt-me-rg --query "[?contains(name, 'frontend')].name" -o tsv)

# Build and update frontend with backend URL
git clone https://github.com/your-username/bolt.me.git && cd bolt-me
docker build --build-arg VITE_BACKEND_URL="https://$BACKEND_URL" -t ghcr.io/your-username/bolt-me-frontend:configured ./frontend
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u your-username --password-stdin
docker push ghcr.io/your-username/bolt-me-frontend:configured
az containerapp update --name $FRONTEND_APP --resource-group bolt-me-rg --image ghcr.io/your-username/bolt-me-frontend:configured
```

## API Reference 🔌

### Supported AI Providers
- **Anthropic Claude**: Primary AI for website generation
- **Google Gemini**: Additional AI capabilities

### API Endpoints

#### `POST /api/geminiTemplate`
Generate website templates using AI

**Request:**
```json
{
  "prompt": "Create a React portfolio website"
}
```

**Response:**
```json
{
  "success": true,
  "files": {
    "index.html": "<!DOCTYPE html>...",
    "style.css": "body { margin: 0; }...",
    "script.js": "console.log('Hello')..."
  }
}
```

#### `POST /api/geminichat`
AI chat functionality

**Request:**
```json
{
  "messages": [
    {
      "role": "user", 
      "content": "How do I add a contact form?"
    }
  ]
}
```

#### `GET /health`
Health check endpoint

**Response:**
```json
"OK"
```

### API Error Resolution
If you encounter 500 Internal Server Error:
1. Ensure API keys are set in `.env.local`
2. Always start with `--env-file .env.local`
3. Verify keys loaded: `docker exec boltme-backend-1 printenv | grep API_KEY`
4. Use the startup script: `./local-development.sh`

## Testing 🧪

### Manual Testing

1. **Frontend**: Visit http://localhost:8080 → Should show bolt.me interface
2. **Backend Health**: Visit http://localhost:3000/health → Should return "OK"
3. **AI Generation**: Try creating a website → Should work!

### API Endpoint Testing

```bash
# Test Gemini Template endpoint
curl -X POST http://localhost:8080/api/geminiTemplate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer abcd123" \
  -d '{"prompt": "Create a simple React app"}'

# Test Gemini Chat endpoint  
curl -X POST http://localhost:8080/api/geminichat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer abcd123" \
  -d '{"messages": [{"role": "user", "content": "Hello AI"}]}'

# Test health endpoint
curl -f http://localhost:3000/health
```

### Automated Testing

```bash
# Test Docker Hub images
./ci-cd-validation.sh your-dockerhub-username

# Run comprehensive health checks
./local-development.sh
```

### Download Feature Testing

The download code feature allows users to export generated websites as ZIP files.

**Features:**
- Smart file processing with nested folder structures
- Visual feedback with real-time download progress
- Comprehensive error handling
- File validation for empty projects
- Optimized ZIP file generation
- Smart naming with timestamps

**Usage:**
1. Generate a website using AI prompts
2. Wait for files to appear in File Explorer
3. Click "Download Code" button
4. ZIP file downloads automatically

**Troubleshooting Download Issues:**
- **Button Disabled**: Generate a website first
- **"No files available"**: Wait for generation to complete
- **Download Fails**: Check browser console (F12) for errors
- **Empty ZIP**: Verify files have content in File Explorer

## Troubleshooting 🛠️

### Common Issues

#### 1. API 500 Errors
**Cause**: Missing API keys in Docker containers

**Solution**:
```bash
# Always use environment file
docker-compose --env-file .env.local up -d

# Verify API keys loaded
docker exec boltme-backend-1 printenv | grep API_KEY

# Use startup script (recommended)
./local-development.sh
```

#### 2. Download Button Always Disabled
**Cause**: `isGenerating` state not properly managed

**Solution**: Generate a website first, button enables when files are ready

#### 3. Docker Build Failures
**Cause**: Registry connectivity or cache issues

**Solutions**:
```bash
# Clear Docker cache
docker builder prune -a

# Force rebuild without cache
docker build --no-cache -t your-image:tag .

# Restart Docker daemon (Linux/macOS)
sudo systemctl restart docker
```

#### 4. Port Already in Use
**Cause**: Ports 3000 or 8080 occupied

**Solutions**:
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8080

# Kill process using port
sudo kill -9 $(lsof -t -i:3000)

# Use different ports in .env.local
FRONTEND_PORT=8081
BACKEND_PORT=3001
```

#### 5. Frontend Can't Connect to Backend
**Cause**: NGINX proxy configuration or environment variables

**Solutions**:
```bash
# Check NGINX configuration
docker exec boltme-frontend-1 cat /etc/nginx/conf.d/default.conf

# Verify backend URL environment variable
docker exec boltme-frontend-1 printenv | grep BACKEND

# Test backend connectivity from frontend container
docker exec boltme-frontend-1 wget -qO- http://backend:3000/health
```

### Debugging Commands

```bash
# View all container logs
docker-compose --env-file .env.local logs -f

# View specific container logs
docker logs boltme-backend-1 -f
docker logs boltme-frontend-1 -f

# Check container status
docker ps

# Execute commands in container
docker exec -it boltme-backend-1 sh
docker exec -it boltme-frontend-1 sh

# Check environment variables
docker exec boltme-backend-1 printenv
docker exec boltme-frontend-1 printenv

# Test network connectivity
docker network ls
docker network inspect bolt-network
```

### CI/CD Pipeline 🔄

#### GitHub Actions
- **Automatic**: Builds Docker images on push
- **Registry**: GitHub Container Registry (ghcr.io)
- **Multi-platform**: AMD64, ARM64 support
- **Tagging**: Based on branches and releases

#### Required Secrets
- `GITHUB_TOKEN`: Automatically provided
- No additional setup required!

#### Manual Deployment Options
- 🅰️ **Azure**: Use ARM templates and deployment scripts
- ⚓ **Kubernetes**: Use `k8s-deployment.yaml`
- 🐳 **Docker**: Use environment-specific configurations

## Performance Optimization 🚀

### Docker Optimizations

```dockerfile
# Use Alpine variants for smaller images
FROM node:20-alpine

# Multi-stage builds
FROM node:20-alpine AS build
# ... build steps
FROM nginx:1.26-alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

### Resource Limits

```yaml
# In docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

### NGINX Optimizations

```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/css application/javascript application/json;

# Enable caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Security 🔒

### API Key Management
- ✅ Store API keys in `.env.local` (not in version control)
- ✅ Use environment files with Docker
- ✅ Rotate API keys regularly
- ⚠️ Never commit API keys to git
- ⚠️ Keep `.env.local` in `.gitignore`

### Docker Security

```dockerfile
# Use non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -D -H -u 1001 -h /home/nodejs nodejs
USER nodejs

# Use specific image versions
FROM node:20.11.1-alpine

# Remove package managers in production
RUN apk del npm
```

### HTTPS Configuration

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}

# Security headers
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
```

## Contributing 🤝

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** following project standards
4. **Test locally**: `./local-development.sh`
5. **Test production build**: `./ci-cd-validation.sh`
6. **Submit pull request**

### Code Standards

- **TypeScript** for type safety
- **ESLint** for code quality
- **Proper error handling** with try-catch blocks
- **Comprehensive logging** for debugging
- **Docker best practices** for containerization
- **Environment variable validation**
- **Health check endpoints**

### Project Structure Guidelines

- Keep components small and focused
- Use proper TypeScript interfaces
- Follow React hooks best practices
- Maintain consistent naming conventions
- Add proper JSDoc comments
- Include proper error boundaries

## Support 🆘

### Getting Help

1. **Check this README** for common issues
2. **Review container logs**: `docker-compose --env-file .env.local logs -f`
3. **Verify environment configuration**: Check `.env.local` file
4. **Test API endpoints manually**: Use curl commands provided
5. **Check Docker/Kubernetes documentation**

### Useful Resources

- [Docker Documentation](https://docs.docker.com)
- [Azure Container Apps Documentation](https://docs.microsoft.com/azure/container-apps)
- [Azure Container Instances Documentation](https://docs.microsoft.com/azure/container-instances)
- [Kubernetes Documentation](https://kubernetes.io/docs)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [Google Gemini API Documentation](https://ai.google.dev)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express.js Documentation](https://expressjs.com)

### Quick Reference Commands

```bash
# Local development
./local-development.sh

# View logs
docker-compose --env-file .env.local logs -f

# Stop all containers
docker-compose --env-file .env.local down

# Rebuild everything
docker system prune -f
docker-compose --env-file .env.local up --build -d

# Check health
curl http://localhost:3000/health
curl http://localhost:8080

# Azure deployment
./deploy-container-apps.sh
```

## ✅ Repository Cleanup Complete!

**Removed Redundant Files:**
- `configure-frontend-backend.sh` - No longer needed (automatic connection)
- `build-frontend-for-azure.sh` - No longer needed (automatic connection) 
- `deploy-frontend-with-backend.sh` - No longer needed (automatic connection)
- `test-backend-url-flow.sh` - No longer needed (automatic connection)
- `AZURE_ARM_TEMPLATE_DEPLOYMENT.md` - Consolidated into README
- `BACKEND_URL_FLOW.md` - Consolidated into README
- `QUICK_DEPLOYMENT_REFERENCE.md` - Consolidated into README
- `HTTPS_SETUP.md` - Was empty, removed

**Remaining Essential Scripts:**
- ✅ `local-development.sh` - Local development setup
- ✅ `ci-cd-validation.sh` - CI/CD testing
- ✅ `deploy-container-apps.sh` - Azure Container Apps deployment (recommended)
- ✅ `deploy-azure.sh` - Azure Container Instances deployment (legacy)
- ✅ `frontend/docker-entrypoint.sh` - Docker container startup

---

## License ⚖️

MIT License

Copyright (c) 2024 bolt.me

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## 🎉 Quick Start Summary

**For the impatient developer:**

```bash
# 1. Get the code
git clone https://github.com/your-username/bolt.me.git && cd bolt.me

# 2. Setup environment (add your API keys)
cp .env.local.template .env.local && nano .env.local

# 3. Start everything
./local-development.sh

# 4. Open and start building!
open http://localhost:8080
```

**That's it! Start building websites with AI!** 🚀

---

**📧 Need help?** Check the [troubleshooting section](#troubleshooting-🛠️) or review container logs with `docker-compose --env-file .env.local logs -f`