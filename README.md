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

## Tech Stack 🛠️

### Frontend 🎨
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Monaco Editor (for code editing)
- WebContainer API (for in-browser code execution)
- Lucide React (for icons)

### Backend 🔧
- Node.js
- Express
- TypeScript
- Anthropic AI SDK (Claude)


## Development Setup 🔨

### Prerequisites 📋

- Node.js (v20 or higher)
- Docker and Docker Compose
- Kubernetes (for production deployment)

### Environment Variables 🔐

#### Backend
- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude

#### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:3000)

### Local Development 💻

1. **For local development:**
```bash
# Use local environment configuration
docker-compose --env-file .env.local up --build
```

2. **For production testing:**
```bash
# Use production environment configuration
docker-compose --env-file .env.production up --build
```

3. Access the application:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

## Deployment 🚀

### Azure Deployment ☁️
For detailed Azure deployment instructions, see:
- [Azure Deployment Guide](AZURE_DEPLOYMENT.md) - Comprehensive guide
- [Azure Quick Start](AZURE_QUICKSTART.md) - 10-minute setup

### Docker Deployment 🐳
The project uses a single, environment-aware Docker Compose configuration:

```bash
# Local development
docker-compose --env-file .env.local up --build

# Production deployment
docker-compose --env-file .env.production up --build -d
```

### Kubernetes Deployment ⚓
Deploy to a Kubernetes cluster:

```bash
kubectl apply -f k8s-deployment.yaml
```

### CI/CD Pipeline 🔄
The project uses GitHub Actions for automated image building:

**What happens automatically:**
- ✅ Builds Docker images for frontend and backend
- ✅ Pushes images to GitHub Container Registry (ghcr.io)
- ✅ Supports multi-platform builds (AMD64, ARM64)
- ✅ Automatic tagging based on branches and releases

**Manual deployment options:**
- 🅰️ **Azure**: Use provided ARM templates and scripts
- ⚓ **Kubernetes**: Use `k8s-deployment.yaml`
- 🐳 **Docker**: Use environment-specific configurations

**Required GitHub Secrets:** 🔑
- `GITHUB_TOKEN`: Automatically provided by GitHub
- No additional setup required!

## License ⚖️
MIT License