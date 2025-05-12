# bolt.me

A modern AI-powered website builder that generates complete, working websites from text prompts.

## Overview

bolt.me is a full-stack web application that allows users to describe the website they want to create and watch it come to life in seconds. The application uses AI to generate clean, responsive code based on user prompts.

## Features

- **AI-Powered Website Generation**: Create complete websites using just text descriptions
- **Lightning Fast**: Generate websites in seconds with just a text prompt
- **Clean Code**: Well-structured, maintainable code that's easy to customize
- **Responsive Design**: Mobile-friendly websites that look great on all devices
- **Live Preview**: View your generated website in real-time
- **Code Editor**: Examine and modify the generated code
- **WebContainer Integration**: Run the generated code directly in the browser

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Monaco Editor (for code editing)
- WebContainer API (for in-browser code execution)
- Lucide React (for icons)

### Backend
- Node.js
- Express
- TypeScript
- Anthropic AI SDK (Claude)


## Development Setup

### Prerequisites

- Node.js (v20 or higher)
- Docker and Docker Compose
- Kubernetes (for production deployment)

### Environment Variables

#### Backend
- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude

#### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:3000)

### Local Development

1. Start the development environment:
```bash
docker-compose up --build
```
2. Access the application:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

## Deployment
### Docker Deployment
The project includes Docker configurations for containerized deployment:

```bash
docker-compose -f docker-compose.yml up

--build -d
```

### Kubernetes Deployment
Deploy to a Kubernetes cluster:

```bash
kubectl apply -f k8s-deployment.yaml
```

### CI/CD Pipeline
The project uses GitHub Actions for automated deployment:

1. Build and Push Images :
   
   - Builds Docker images for frontend and backend
   - Pushes images to Docker Hub
2. Deploy :
   
   - Deploys to Kubernetes cluster
   - Updates services and ingress configurations
Required GitHub Secrets:

- DOCKERHUB_USERNAME : Docker Hub username
- DOCKERHUB_TOKEN : Docker Hub access token
- KUBE_CONFIG : Kubernetes configuration

## License
MIT License