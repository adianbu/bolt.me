# Azure Deployment Guide for bolt.me

This guide will help you deploy the bolt.me application to Azure using Azure Container Instances (ACI).

## Prerequisites

1. **Azure CLI**: Install from [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
2. **Azure Subscription**: Active Azure subscription
3. **GitHub Account**: For Docker image registry
4. **API Keys**: 
   - Anthropic API Key
   - Google Gemini API Key

## Setup Instructions

### 1. Configure Azure CLI

```bash
# Login to Azure
az login

# Set your subscription (if you have multiple)
az account set --subscription "your-subscription-id"

# Verify your login
az account show
```

### 2. Configure GitHub Container Registry

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Create a new token with `packages:write` permission
3. Save the token securely

### 3. Prepare Configuration Files

#### Update `azure-parameters.json`

Replace the placeholder values in `azure-parameters.json`:

```json
{
  "anthropicApiKey": {
    "value": "YOUR_ACTUAL_ANTHROPIC_API_KEY"
  },
  "geminiApiKey": {
    "value": "YOUR_ACTUAL_GEMINI_API_KEY"
  },
  "dockerRegistryUsername": {
    "value": "your-github-username"
  },
  "dockerRegistryPassword": {
    "value": "your-github-token"
  }
}
```

### 4. Build and Push Docker Images

#### Option 1: Using GitHub Actions (Recommended)

1. Push your code to GitHub
2. The GitHub Actions workflow will automatically build and push images
3. Images will be available at:
   - `ghcr.io/your-username/bolt.me/frontend:latest`
   - `ghcr.io/your-username/bolt.me/backend:latest`

#### Option 2: Manual Build and Push

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u your-username --password-stdin

# Build and push using production environment
docker-compose --env-file .env.production build
docker-compose --env-file .env.production push
```

### 5. Deploy to Azure

#### Using the Deployment Script

```bash
# Make the script executable
chmod +x deploy-azure.sh

# Run the deployment
./deploy-azure.sh
```

#### Manual Deployment

```bash
# Create resource group
az group create --name bolt-me-rg --location "East US"

# Deploy ARM template
az deployment group create \
  --resource-group bolt-me-rg \
  --template-file azure-arm-template.json \
  --parameters @azure-parameters.json
```

## Configuration Details

### Environment Variables

The application uses the following environment variables:

#### Frontend
- `VITE_API_URL`: Backend API URL (automatically configured)

#### Backend
- `NODE_ENV`: Set to "production"
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `GEMINI_API_KEY`: Your Google Gemini API key
- `PORT`: Port number (3000)

### Resource Configuration

The ARM template creates:

1. **Container Group**: Hosts both frontend and backend containers
2. **Virtual Network**: Provides network isolation
3. **Network Security Group**: Controls network access
4. **Public IP**: Provides external access
5. **Log Analytics Workspace**: For monitoring and logs
6. **Application Insights**: For application monitoring
7. **Storage Account**: For persistent storage (if needed)

### Health Checks

Both containers have health checks configured:

- **Frontend**: `GET /health` on port 80
- **Backend**: `GET /health` on port 3000

## Monitoring and Troubleshooting

### View Logs

```bash
# View container logs
az container logs --resource-group bolt-me-rg --name your-container-group-name --container-name frontend
az container logs --resource-group bolt-me-rg --name your-container-group-name --container-name backend
```

### Monitor Resources

1. Go to Azure Portal
2. Navigate to your resource group
3. Check Container Instances for status and metrics
4. Use Application Insights for detailed monitoring

### Common Issues

1. **Container fails to start**: Check logs for error messages
2. **Health checks failing**: Verify endpoints are responding
3. **Image pull errors**: Verify registry credentials and image names
4. **Network issues**: Check security group rules and network configuration

## Scaling and Updates

### Update Application

1. Build and push new Docker images with new tags
2. Update `azure-parameters.json` with new image tags
3. Re-run the deployment script

### Scaling

For production workloads, consider:

1. **Azure Container Apps**: Better scaling and load balancing
2. **Azure Kubernetes Service (AKS)**: Full orchestration platform
3. **Azure App Service**: Platform-as-a-Service option

## Security Considerations

1. **API Keys**: Store in Azure Key Vault for production
2. **Network Security**: Use private networks and proper security groups
3. **Image Security**: Regularly update base images and scan for vulnerabilities
4. **Access Control**: Use Azure RBAC for resource access

## Cost Optimization

1. **Resource Sizing**: Monitor and adjust CPU/memory allocations
2. **Auto-shutdown**: Consider shutting down non-production environments
3. **Reserved Instances**: Use for long-running production workloads

## Support

For issues and questions:

1. Check Azure documentation
2. Review container logs
3. Monitor Application Insights
4. Contact Azure support if needed