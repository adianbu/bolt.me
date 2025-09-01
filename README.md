# bolt.me 🚀

A modern AI-powered website builder that generates complete, working websites from text prompts.

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

## Tech Stack 🛠️

### Frontend 🎨
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Monaco Editor (for code editing)
- WebContainer API (for in-browser code execution)
- Lucide React (for icons)
- JSZip (for download functionality)

### Backend 🔧
- Node.js
- Express
- TypeScript
- Anthropic AI SDK (Claude)
- Google Gemini AI SDK

## Quick Start 🚀

### Prerequisites 📋

- Node.js (v20 or higher)
- Docker and Docker Compose
- API Keys:
  - Anthropic API key
  - Google Gemini API key

### 🎯 Fastest Way to Start

```bash
# Clone the repository
git clone <your-repo-url>
cd bolt.me

# Copy environment template
cp .env.local.template .env.local

# Edit .env.local with your API keys
# ANTHROPIC_API_KEY=your_key_here
# GEMINI_API_KEY=your_key_here

# Start with the convenience script
./local-development.sh
```

**Access URLs:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

### Manual Development Setup

```bash
# Always use environment file to avoid API errors
docker-compose --env-file .env.local up --build -d

# View logs
docker-compose --env-file .env.local logs -f

# Stop containers
docker-compose --env-file .env.local down
```

**⚠️ Important**: Never run `docker-compose up` without `--env-file .env.local` as this causes 500 API errors!

## Environment Variables 🔐

Create `.env.local` file with:

```bash
# API Keys (required)
ANTHROPIC_API_KEY=sk-ant-api03-...
GEMINI_API_KEY=AIzaSy...

# Docker Configuration
REGISTRY_NAME=localhost
IMAGE_TAG=latest
FRONTEND_PORT=8080
BACKEND_PORT=3000
NODE_ENV=development
VITE_API_URL=http://localhost:3000

# Docker Settings
RESTART_POLICY=unless-stopped
LOG_MAX_SIZE=10m
LOG_MAX_FILE=3
ENV_FILE_PATH=./backend/.env
```

## Scripts Reference 📖

The project includes two main scripts:

### 🛠️ `local-development.sh`
**Purpose**: Daily development workflow
- Validates environment configuration
- Builds from local source code
- Starts development environment
- Performs health checks

```bash
./local-development.sh
```

### 🧪 `ci-cd-validation.sh`
**Purpose**: CI/CD pipeline testing
- Builds and pushes to Docker Hub
- Tests published Docker images
- Comprehensive API validation
- Release candidate testing

```bash
./ci-cd-validation.sh [your-dockerhub-username]
```

## Download Feature 📥

The download code feature allows users to export generated websites as ZIP files.

### Features:
- **Smart File Processing**: Handles nested folder structures
- **Visual Feedback**: Real-time download progress
- **Error Handling**: Comprehensive error messages
- **File Validation**: Checks for empty projects
- **Compression**: Optimized ZIP file generation
- **Smart Naming**: Project-based filenames with timestamps

### Usage:
1. Generate a website using AI prompts
2. Wait for files to appear in File Explorer
3. Click "Download Code" button
4. ZIP file downloads automatically

### Troubleshooting Download Issues:
- **Button Disabled**: Generate a website first
- **"No files available"**: Wait for generation to complete
- **Download Fails**: Check browser console (F12) for errors
- **Empty ZIP**: Verify files have content in File Explorer

## API Integration 🔌

### Supported AI Providers:
- **Anthropic Claude**: Primary AI for website generation
- **Google Gemini**: Additional AI capabilities

### API Endpoints:
- `POST /api/geminiTemplate` - Generate website templates
- `POST /api/geminichat` - AI chat functionality
- `GET /health` - Health check endpoint

### API Error Resolution:
If you encounter 500 Internal Server Error:
1. Ensure API keys are set in `.env.local`
2. Always start with `--env-file .env.local`
3. Verify keys loaded: `docker exec boltme-backend-1 printenv | grep API_KEY`
4. Use the startup script: `./local-development.sh`

## Azure Deployment ☁️

### Quick Deploy (10 minutes)

**Cost-Optimized Options:**

| Tier | Monthly Cost | Best For | Resources |
|------|-------------|----------|----------|
| 💚 **Minimal** | $15-20 | Personal projects | 0.75 cores, 1.5GB RAM |
| 💛 **Balanced** | $20-30 | Small business | 1.25 cores, 2.5GB RAM |
| 💙 **Performance** | $35-50 | Production | 2.5 cores, 5GB RAM |

### Azure Container Apps Deployment (Recommended) 🔥

**Features:**
- ✅ Built-in HTTPS with managed certificates
- ✅ Auto-scaling based on traffic
- ✅ Cost optimization tiers ($8-30/month)
- ✅ Zero-downtime deployments

**Quick Deploy:**
```bash
# 1. Deploy infrastructure
./deploy-container-apps.sh

# 2. Configure frontend-backend connectivity
./configure-frontend-backend.sh
```

**Cost Tiers:**
- **Minimal**: $8-12/month (0.25 CPU, 0.5Gi RAM)
- **Balanced**: $12-18/month (0.5 CPU, 1Gi RAM) - **Recommended**
- **Performance**: $20-30/month (1.0 CPU, 2Gi RAM)

**⚠️ Schema Fix Applied**: Fixed "invalid req body for env" error by removing circular dependencies in ARM template.

### Azure Container Instances Deployment (Legacy)

1. **Prepare Environment**:
```bash
# Copy Azure template
cp .env.azure.template .env.azure

# Edit with your API keys
nano .env.azure
```

2. **Deploy to Azure**:
```bash
# Interactive deployment with cost optimization
chmod +x deploy-azure.sh
./deploy-azure.sh
```

3. **Access Your App**:
- Your app will be available at: `http://your-app-name-prod-xxxxxx.eastus.azurecontainer.io`

### Azure Monitoring:
```bash
# View container logs
az container logs --resource-group bolt-me-rg --name YOUR_CONTAINER_GROUP_NAME --container-name frontend

# Check deployment status
az deployment group show --resource-group bolt-me-rg --name bolt-me-deployment-YYYYMMDD-HHMMSS
```

## Docker Deployment 🐳

### Local Development:
```bash
# Recommended: Use the startup script
./local-development.sh

# Manual approach
docker-compose --env-file .env.local up --build -d
```

### Production Deployment:
```bash
# Use production environment
docker-compose --env-file .env.production up --build -d
```

### Kubernetes Deployment ⚓
```bash
# Deploy to Kubernetes cluster
kubectl apply -f k8s-deployment.yaml

# Check deployment status
kubectl get pods -n bolt-me
kubectl get services -n bolt-me
```

## Troubleshooting 🛠️

### Common Issues:

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

# Restart Docker daemon
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

### Debugging Commands:
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

# Check environment variables
docker exec boltme-backend-1 printenv
```

## Testing 🧪

### Manual Testing:
1. **Frontend**: Visit http://localhost:8080
2. **Backend Health**: Visit http://localhost:3000/health
3. **API Endpoints**:
```bash
# Test Gemini Template endpoint
curl -X POST http://localhost:8080/api/geminiTemplate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer abcd123" \
  -d '{"prompt": "Create a React app"}'

# Test Gemini Chat endpoint
curl -X POST http://localhost:8080/api/geminichat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer abcd123" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

### Automated Testing:
```bash
# Test Docker Hub images
./ci-cd-validation.sh your-dockerhub-username

# Run health checks
curl -f http://localhost:3000/health
curl -f http://localhost:8080/health
```

## CI/CD Pipeline 🔄

### GitHub Actions:
- **Automatic**: Builds Docker images on push
- **Registry**: GitHub Container Registry (ghcr.io)
- **Multi-platform**: AMD64, ARM64 support
- **Tagging**: Based on branches and releases

### Required Secrets:
- `GITHUB_TOKEN`: Automatically provided
- No additional setup required!

### Manual Deployment:
- 🅰️ **Azure**: Use ARM templates and deployment scripts
- ⚓ **Kubernetes**: Use `k8s-deployment.yaml`
- 🐳 **Docker**: Use environment-specific configurations

## Performance Optimization 🚀

### Docker Optimizations:
```dockerfile
# Use Alpine variants for smaller images
FROM node:20-alpine

# Multi-stage builds
FROM node:20-alpine AS build
# ... build steps
FROM nginx:1.26-alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

### Resource Limits:
```yaml
# In docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

## Security 🔒

### API Key Management:
- ✅ Store API keys in `.env.local` (not in version control)
- ✅ Use environment files with Docker
- ✅ Rotate API keys regularly
- ⚠️ Never commit API keys to git
- ⚠️ Keep `.env.local` in `.gitignore`

### Docker Security:
```dockerfile
# Use non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -D -H -u 1001 -h /home/nodejs nodejs
USER nodejs
```

## Contributing 🤝

### Development Workflow:
1. Fork the repository
2. Create feature branch
3. Make changes following project standards
4. Test using `./local-development.sh`
5. Submit pull request

### Code Standards:
- TypeScript for type safety
- ESLint for code quality
- Proper error handling
- Comprehensive logging
- Docker best practices

## Support 🆘

### Getting Help:
1. Check this README for common issues
2. Review container logs: `docker-compose logs -f`
3. Verify environment configuration
4. Test API endpoints manually
5. Check Docker/Kubernetes documentation

### Useful Resources:
- [Docker Documentation](https://docs.docker.com)
- [Azure Container Instances](https://docs.microsoft.com/azure/container-instances)
- [Kubernetes Documentation](https://kubernetes.io/docs)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [Google Gemini API Documentation](https://ai.google.dev)

## License ⚖️
MIT License

---

**🎉 Quick Start Summary:**
1. `cp .env.local.template .env.local` (add your API keys)
2. `./local-development.sh`
3. Visit http://localhost:8080
4. Start building websites with AI! 🚀