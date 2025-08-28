#!/bin/bash

# Azure Deployment Script for bolt.me
# This script deploys the bolt.me application to Azure with cost optimization options

set -e

# Configuration variables
RESOURCE_GROUP_NAME="bolt-me-rg"
LOCATION="East US"
DEPLOYMENT_NAME="bolt-me-deployment-$(date +%Y%m%d-%H%M%S)"
TEMPLATE_FILE="azure-arm-template.json"
PARAMETERS_FILE="azure-parameters.json"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions for colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[BOLT.ME DEPLOYER]${NC} $1"
}

print_header "🚀 Azure Deployment for bolt.me"
echo
echo "Choose your deployment cost level:"
echo
echo "1) 💚 MINIMAL COST (~\$15-20/month)"
echo "   - Best for: Personal projects, testing, low traffic"
echo "   - Resources: 0.75 cores, 1.5GB RAM total"
echo "   - Monitoring: Disabled"
echo
echo "2) 💛 BALANCED COST (~\$20-30/month) [RECOMMENDED]"
echo "   - Best for: Small business, moderate traffic"
echo "   - Resources: 1.25 cores, 2.5GB RAM total"
echo "   - Monitoring: Basic (14-day retention)"
echo
echo "3) 💙 PERFORMANCE (~\$35-50/month)"
echo "   - Best for: Production, high traffic"
echo "   - Resources: 2.5 cores, 5GB RAM total"
echo "   - Monitoring: Full (30-day retention)"
echo
echo "4) 🔧 CUSTOM - Use existing parameters file"
echo

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        COST_LEVEL="minimal"
        ESTIMATED_COST="\$15-20"
        print_info "Selected: MINIMAL COST deployment"
        ;;
    2)
        COST_LEVEL="balanced"
        ESTIMATED_COST="\$20-30"
        print_info "Selected: BALANCED COST deployment (Recommended)"
        ;;
    3)
        COST_LEVEL="performance"
        ESTIMATED_COST="\$35-50"
        print_info "Selected: PERFORMANCE deployment"
        ;;
    4)
        COST_LEVEL="custom"
        ESTIMATED_COST="Variable"
        print_info "Selected: CUSTOM deployment (using existing parameters)"
        ;;
    *)
        print_error "Invalid choice. Using BALANCED as default."
        COST_LEVEL="balanced"
        ESTIMATED_COST="\$20-30"
        ;;
esac

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if user is logged in to Azure CLI
if ! az account show &> /dev/null; then
    print_error "You are not logged in to Azure CLI. Please run 'az login' first."
    exit 1
fi

# Check if required files exist
if [[ ! -f "$TEMPLATE_FILE" ]]; then
    print_error "ARM template file '$TEMPLATE_FILE' not found!"
    exit 1
fi

if [[ ! -f "$PARAMETERS_FILE" ]]; then
    print_error "Parameters file '$PARAMETERS_FILE' not found!"
    exit 1
fi

# Create temporary parameters file with selected cost level
if [[ "$COST_LEVEL" != "custom" ]]; then
    TEMP_PARAMS_FILE="azure-parameters-temp.json"
    
    # Read the original parameters file and update costOptimizationLevel
    jq --arg costLevel "$COST_LEVEL" '.parameters.costOptimizationLevel.value = $costLevel' "$PARAMETERS_FILE" > "$TEMP_PARAMS_FILE"
    
    if [[ $? -ne 0 ]]; then
        print_error "Failed to create temporary parameters file. Make sure jq is installed."
        print_warning "Install jq with: brew install jq (macOS) or apt install jq (Ubuntu)"
        print_info "Proceeding with original parameters file..."
        TEMP_PARAMS_FILE="$PARAMETERS_FILE"
    else
        PARAMETERS_FILE="$TEMP_PARAMS_FILE"
        print_info "Created temporary parameters file with cost level: $COST_LEVEL"
    fi
fi

print_header "Starting Azure deployment..."
echo "💰 Estimated monthly cost: $ESTIMATED_COST"
echo "📍 Location: $LOCATION"
echo "🏷️  Cost level: $COST_LEVEL"
echo

# Create resource group if it doesn't exist
print_info "Creating resource group '$RESOURCE_GROUP_NAME' in '$LOCATION'..."
az group create \
    --name "$RESOURCE_GROUP_NAME" \
    --location "$LOCATION" \
    --output table

# Validate the ARM template
print_info "Validating ARM template..."
az deployment group validate \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --template-file "$TEMPLATE_FILE" \
    --parameters "@$PARAMETERS_FILE" \
    --output table

if [[ $? -ne 0 ]]; then
    print_error "ARM template validation failed!"
    # Clean up temporary file if created
    [[ -f "azure-parameters-temp.json" ]] && rm -f "azure-parameters-temp.json"
    exit 1
fi

print_info "ARM template validation successful!"

# Show cost estimate before deployment
echo
print_header "💰 COST BREAKDOWN ESTIMATE"
case $COST_LEVEL in
    "minimal")
        echo "• Container Instances: ~$12-15/month"
        echo "• Public IP: ~$3/month"
        echo "• Network: ~$1/month"
        echo "• Monitoring: $0 (disabled)"
        ;;
    "balanced")
        echo "• Container Instances: ~$18-22/month"
        echo "• Public IP: ~$3/month"
        echo "• Network: ~$1/month"
        echo "• Log Analytics: ~$2-3/month"
        echo "• Application Insights: ~$1-2/month"
        ;;
    "performance")
        echo "• Container Instances: ~$30-40/month"
        echo "• Public IP: ~$3/month"
        echo "• Network: ~$2/month"
        echo "• Log Analytics: ~$3-5/month"
        echo "• Application Insights: ~$2-3/month"
        echo "• Storage: ~$2-3/month"
        ;;
    "custom")
        echo "• Cost depends on your custom configuration"
        ;;
esac
echo "📊 Total estimated: $ESTIMATED_COST/month"
echo

read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Deployment cancelled."
    # Clean up temporary file if created
    [[ -f "azure-parameters-temp.json" ]] && rm -f "azure-parameters-temp.json"
    exit 0
fi

# Deploy the ARM template
print_info "Deploying ARM template..."
az deployment group create \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$DEPLOYMENT_NAME" \
    --template-file "$TEMPLATE_FILE" \
    --parameters "@$PARAMETERS_FILE" \
    --output table

if [[ $? -ne 0 ]]; then
    print_error "Deployment failed!"
    exit 1
fi

# Get deployment outputs
print_info "Getting deployment outputs..."
FQDN=$(az deployment group show \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$DEPLOYMENT_NAME" \
    --query 'properties.outputs.containerGroupFqdn.value' \
    --output tsv)

IP_ADDRESS=$(az deployment group show \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$DEPLOYMENT_NAME" \
    --query 'properties.outputs.containerGroupIpAddress.value' \
    --output tsv)

INSIGHTS_KEY=$(az deployment group show \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$DEPLOYMENT_NAME" \
    --query 'properties.outputs.applicationInsightsInstrumentationKey.value' \
    --output tsv)

# Display deployment information
print_header "🎉 Deployment completed successfully!"
echo
echo "=== DEPLOYMENT INFORMATION ==="
echo "💰 Cost Level: $COST_LEVEL"
echo "💵 Estimated Monthly Cost: $ESTIMATED_COST"
echo "🌎 Application URL: http://$FQDN"
echo "📍 IP Address: $IP_ADDRESS"
echo "📦 Resource Group: $RESOURCE_GROUP_NAME"
echo "🏷️  Deployment Name: $DEPLOYMENT_NAME"
if [[ "$INSIGHTS_KEY" != "null" && "$INSIGHTS_KEY" != "" ]]; then
    echo "📊 Application Insights Key: $INSIGHTS_KEY"
fi
echo

# Clean up temporary file if created
[[ -f "azure-parameters-temp.json" ]] && rm -f "azure-parameters-temp.json" && print_info "Cleaned up temporary files"

# Cost optimization tips
print_header "💡 COST OPTIMIZATION TIPS"
echo "1. 🕐 Monitor usage with Azure Cost Management"
echo "2. 📈 Use Azure Advisor for optimization recommendations"
echo "3. 📉 Scale down during low-traffic periods"
echo "4. 🗟️  Delete unused resources regularly"
echo "5. 📄 Set up cost alerts to avoid surprises"
echo

# Test the deployment
print_info "Testing the deployment..."
sleep 30  # Wait for containers to start

if curl -f -s "http://$FQDN/health" > /dev/null; then
    print_info "✅ Frontend health check passed!"
else
    print_warning "⚠️  Frontend health check failed. The application might still be starting up."
fi

if curl -f -s "http://$FQDN:3000/health" > /dev/null; then
    print_info "✅ Backend health check passed!"
else
    print_warning "⚠️  Backend health check failed. The application might still be starting up."
fi

print_header "🎯 Deployment complete! Your optimized application is ready."
print_info "📱 Access your app at: http://$FQDN"
print_info "💰 Monitor costs at: https://portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/overview"

# Optional: Open the application in the default browser
read -p "Do you want to open the application in your browser? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "http://$FQDN"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "http://$FQDN"
    else
        print_info "Please open http://$FQDN in your browser"
    fi
fi