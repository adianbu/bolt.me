# Azure Quick Start Guide for bolt.me

## 🚀 Quick Deploy to Azure

This guide will get your bolt.me application running on Azure in under 10 minutes.

### 💰 Choose Your Cost Level

**NEW: Cost-Optimized Deployments Available!**

| Tier | Monthly Cost | Best For | Resources |
|------|-------------|----------|----------|
| 💚 **Minimal** | $15-20 | Personal projects, testing | 0.75 cores, 1.5GB RAM |
| 💛 **Balanced** | $20-30 | Small business, moderate traffic | 1.25 cores, 2.5GB RAM |
| 💙 **Performance** | $35-50 | Production, high traffic | 2.5 cores, 5GB RAM |

**Quick Deploy:**
```bash
./deploy-azure.sh
```

### Prerequisites

- Azure CLI installed and logged in
- GitHub account
- Anthropic API key
- Google Gemini API key

### Step 1: Prepare Your Environment

```bash
# Clone or navigate to your project
cd /path/to/bolt.me

# Copy environment template
cp .env.azure.template .env.azure

# Edit the environment file with your actual values
# nano .env.azure
```

### Step 2: Configure Azure Parameters

Edit `azure-parameters.json` and replace:

- `YOUR_ANTHROPIC_API_KEY_HERE` → Your actual Anthropic API key
- `YOUR_GEMINI_API_KEY_HERE` → Your actual Gemini API key  
- `YOUR_GITHUB_USERNAME` → Your GitHub username
- `YOUR_GITHUB_TOKEN_HERE` → Your GitHub personal access token

### Step 3: Build and Push Docker Images

#### Option A: Automatic (GitHub Actions)
```bash
# Push to GitHub - images will be built automatically
git add .
git commit -m "Deploy to Azure"
git push origin main
```

#### Option B: Manual Build
```bash
# Login to GitHub Container Registry
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Build and push using production environment
docker-compose --env-file .env.production build
docker-compose --env-file .env.production push
```

### Step 4: Deploy to Azure

#### 🎯 Single Deployment Script (Recommended)
```bash
# Interactive deployment with cost optimization built-in
chmod +x deploy-azure.sh
./deploy-azure.sh
```

The script will prompt you to choose:
- 💚 **Minimal Cost** (~$15/month) - Personal projects
- 💛 **Balanced Cost** (~$25/month) - Recommended for most users  
- 💙 **Performance** (~$40/month) - High traffic production
- 🔧 **Custom** - Use your own configuration

#### 🔧 Manual Deployment
```bash
# Direct deployment with custom parameters
az deployment group create \
  --resource-group bolt-me-rg \
  --template-file azure-arm-template.json \
  --parameters @azure-parameters.json
```

### Step 5: Access Your Application

After deployment completes, your application will be available at:
- `http://your-app-name-prod-xxxxxx.eastus.azurecontainer.io`

## 🔧 Configuration Options

### Changing Azure Region

Edit `azure-parameters.json`:
```json
{
  "location": {
    "value": "West US 2"  // or any other Azure region
  }
}
```

### Using Custom Domain

After deployment, you can configure a custom domain:

1. Get the public IP from Azure portal
2. Create DNS A record pointing to the IP
3. Configure SSL certificate (optional)

### Scaling Resources

Edit the ARM template `azure-arm-template.json` to adjust:

```json
"resources": {
  "requests": {
    "cpu": 1.0,        // Increase for more performance
    "memoryInGB": 2.0  // Increase for more memory
  }
}
```

## 🔍 Monitoring

### View Logs
```bash
# Get resource group containers
az container list --resource-group bolt-me-rg --output table

# View specific container logs
az container logs \
  --resource-group bolt-me-rg \
  --name YOUR_CONTAINER_GROUP_NAME \
  --container-name frontend
```

### Health Checks
- Frontend: `http://your-domain/health`
- Backend: `http://your-domain:3000/health`

## 🛠 Troubleshooting

### Common Issues

1. **"Image not found"**
   - Verify GitHub Container Registry credentials
   - Check image names in parameters file

2. **"Health check failed"**
   - Wait 2-3 minutes for containers to fully start
   - Check container logs for errors

3. **"API not working"**
   - Verify API keys are correctly set
   - Check backend container logs

### Get Help

```bash
# Check deployment status
az deployment group show \
  --resource-group bolt-me-rg \
  --name bolt-me-deployment-YYYYMMDD-HHMMSS

# View all resources
az resource list --resource-group bolt-me-rg --output table
```

## 💰 Cost Estimation

**Cost-Optimized Options:**

### 💚 Minimal Cost (~$15-20/month)
- Container Instances: $12-15
- Public IP: $3
- Network: $1
- Monitoring: $0 (disabled)

### 💛 Balanced Cost (~$20-30/month) **[RECOMMENDED]**
- Container Instances: $18-22
- Public IP: $3
- Network: $1
- Log Analytics: $2-3
- Application Insights: $1-2

### 💙 Performance (~$35-50/month)
- Container Instances: $30-40
- Public IP: $3
- Network: $2
- Full monitoring: $5-8
- Storage: $2-3

**📊 Use the cost calculator:** `./azure-cost-calculator.sh`

*Costs may vary based on usage and region*

## 🔄 Updates and Maintenance

### Update Application
```bash
# Build new images with updated code
git push origin main

# Update image tags in azure-parameters.json
# Re-run deployment
./deploy-azure.sh
```

### Backup and Recovery
- Configuration: Store parameters file securely
- Data: Use Azure Storage for persistence if needed
- Monitoring: Application Insights provides 90 days of data

## 📚 Next Steps

1. **Custom Domain**: Configure your own domain name
2. **SSL Certificate**: Set up HTTPS with Azure Front Door
3. **Monitoring**: Configure alerts in Application Insights  
4. **Scaling**: Consider Azure Container Apps for auto-scaling
5. **CI/CD**: Set up automated deployments

## 🆘 Support

- Azure Documentation: [docs.microsoft.com](https://docs.microsoft.com/azure)
- Container Instances: [Azure Container Instances docs](https://docs.microsoft.com/azure/container-instances)
- GitHub Actions: [GitHub Actions docs](https://docs.github.com/actions)

---

**🎉 You're all set!** Your bolt.me application is now running on Azure with enterprise-grade security, monitoring, and scalability.