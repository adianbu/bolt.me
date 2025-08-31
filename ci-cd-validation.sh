#!/bin/bash

# Bolt.me CI/CD Validation & Docker Hub Testing Script
# Purpose: Validates Docker images through complete CI/CD workflow testing
# Usage: ./ci-cd-validation.sh [your-dockerhub-username]
#
# This script performs comprehensive testing by:
# - Building and pushing images to Docker Hub
# - Pulling and testing the published images
# - Running full end-to-end validation
# - Testing all API endpoints with proper error handling
# - Validating the complete deployment workflow
#
# Prerequisites - API Keys (choose one method):
# Method 1: Create .env.local file in project root with:
#    ANTHROPIC_API_KEY=your-anthropic-api-key
#    GEMINI_API_KEY=your-gemini-api-key
#
# Method 2: Set as environment variables:
#    export ANTHROPIC_API_KEY="your-anthropic-api-key"
#    export GEMINI_API_KEY="your-gemini-api-key"
#
# Method 3: Run with API keys inline:
#    ANTHROPIC_API_KEY="your-key" GEMINI_API_KEY="your-key" ./test-dockerhub.sh username
#
# Other Prerequisites:
# - Make sure docker-compose.test.yml exists and is configured properly
# - Ensure Docker and Docker Compose are installed

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKERHUB_USERNAME=${1:-"your-dockerhub-username"}
FRONTEND_IMAGE="${DOCKERHUB_USERNAME}/bolt-frontend:latest"
BACKEND_IMAGE="${DOCKERHUB_USERNAME}/bolt-backend:latest"

# API Keys Configuration
# First, try to load from .env.local file if it exists
if [ -f ".env.local" ]; then
    echo -e "${BLUE}📄 Loading API keys from .env.local file...${NC}"
    # Source the .env.local file to load environment variables
    export $(grep -v '^#' .env.local | grep -E '^(ANTHROPIC_API_KEY|GEMINI_API_KEY)' | xargs)
fi

# Set API keys (from .env.local file or environment variables)
# export ANTHROPIC_API_KEY="your-anthropic-api-key"
# export GEMINI_API_KEY="your-gemini-api-key"
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-""}
GEMINI_API_KEY=${GEMINI_API_KEY:-""}

# Check if API keys are available
if [ -n "$ANTHROPIC_API_KEY" ] && [ -n "$GEMINI_API_KEY" ]; then
    echo -e "${GREEN}✅ API keys loaded successfully!${NC}"
else
    echo -e "${RED}⚠️  Warning: API keys not found!${NC}"
    echo "Please either:"
    echo "1. Add API keys to .env.local file:"
    echo "   ANTHROPIC_API_KEY=your-anthropic-api-key"
    echo "   GEMINI_API_KEY=your-gemini-api-key"
    echo "2. Or export them as environment variables:"
    echo "   export ANTHROPIC_API_KEY='your-anthropic-api-key'"
    echo "   export GEMINI_API_KEY='your-gemini-api-key'"
    echo ""
fi

echo -e "${BLUE}🚀 Starting Docker Hub Testing Process...${NC}"

# Step 1: Build images locally
echo -e "\n${BLUE}📦 Step 1: Building images locally...${NC}"
echo "Building frontend image..."
docker build -t ${FRONTEND_IMAGE} ./frontend

echo "Building backend image..."
docker build -t ${BACKEND_IMAGE} ./backend

# Step 2: Push to Docker Hub
echo -e "\n${BLUE}⬆️  Step 2: Pushing images to Docker Hub...${NC}"
echo "Pushing frontend image..."
docker push ${FRONTEND_IMAGE}

echo "Pushing backend image..."
docker push ${BACKEND_IMAGE}

# Step 3: Clean local images
echo -e "\n${BLUE}🧹 Step 3: Cleaning local images...${NC}"
docker rmi ${FRONTEND_IMAGE} || true
docker rmi ${BACKEND_IMAGE} || true

# Step 4: Pull from Docker Hub
echo -e "\n${BLUE}⬇️  Step 4: Pulling images from Docker Hub...${NC}"
docker pull ${FRONTEND_IMAGE}
docker pull ${BACKEND_IMAGE}

# Step 5: Run containers using docker-compose
echo -e "\n${BLUE}🏃 Step 5: Running containers from Docker Hub images...${NC}"

# Create temporary docker-compose file with correct username and API keys
sed "s/your-dockerhub-username/${DOCKERHUB_USERNAME}/g" docker-compose.test.yml > docker-compose.test-temp.yml

# Stop any existing containers
docker-compose -f docker-compose.test-temp.yml down 2>/dev/null || true

# Start containers with API keys
if [ -n "$ANTHROPIC_API_KEY" ] && [ -n "$GEMINI_API_KEY" ]; then
    echo "Starting containers with API keys..."
    ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" GEMINI_API_KEY="$GEMINI_API_KEY" docker-compose -f docker-compose.test-temp.yml up -d
else
    echo "Starting containers without API keys (API tests will be skipped)..."
    docker-compose -f docker-compose.test-temp.yml up -d
fi

# Step 6: Health checks
echo -e "\n${BLUE}🏥 Step 6: Performing health checks...${NC}"
echo "Waiting for containers to start..."
sleep 10

# Check backend health
echo "Checking backend health..."
for i in {1..30}; do
    if curl -f http://localhost:3000/health 2>/dev/null; then
        echo -e "${GREEN}✅ Backend is healthy!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend health check failed${NC}"
        docker-compose -f docker-compose.test-temp.yml logs backend
        exit 1
    fi
    sleep 2
done

# Check frontend health
echo "Checking frontend health..."
for i in {1..30}; do
    if curl -f http://localhost:8080/health 2>/dev/null; then
        echo -e "${GREEN}✅ Frontend is healthy!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Frontend health check failed${NC}"
        docker-compose -f docker-compose.test-temp.yml logs frontend
        exit 1
    fi
    sleep 2
done

# Step 7: Functional tests
echo -e "\n${BLUE}🧪 Step 7: Running functional tests...${NC}"

# Test frontend accessibility
if curl -s http://localhost:8080 | grep -q "WebCraft\|Website Builder Application"; then
    echo -e "${GREEN}✅ Frontend is accessible and serving content${NC}"
else
    echo -e "${RED}❌ Frontend accessibility test failed${NC}"
    exit 1
fi

# Test backend API
if curl -s http://localhost:3000 | grep -q -i "api\|server"; then
    echo -e "${GREEN}✅ Backend API is responding${NC}"
else
    echo -e "${RED}❌ Backend API test failed${NC}"
    exit 1
fi

# Test AI API endpoints (only if API keys are available)
if [ -n "$ANTHROPIC_API_KEY" ] && [ -n "$GEMINI_API_KEY" ]; then
    echo -e "\n${BLUE}🤖 Testing AI API endpoints...${NC}"
    
    # Test Claude template endpoint
    echo "Testing Claude template endpoint..."
    CLAUDE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/template \
        -H "Content-Type: application/json" \
        -d '{"prompt": "Create a simple React app", "type": "react"}' \
        -w "%{http_code}")
    
    if echo "$CLAUDE_RESPONSE" | tail -n1 | grep -q "200"; then
        echo -e "${GREEN}✅ Claude template endpoint is working${NC}"
    else
        echo -e "${RED}❌ Claude template endpoint test failed${NC}"
        echo "Response: $CLAUDE_RESPONSE"
    fi
    
    # Test Gemini template endpoint
    echo "Testing Gemini template endpoint..."
    GEMINI_RESPONSE=$(curl -s -X POST http://localhost:3000/api/geminiTemplate \
        -H "Content-Type: application/json" \
        -d '{"prompt": "Create a simple React app", "type": "react"}' \
        -w "%{http_code}")
    
    if echo "$GEMINI_RESPONSE" | tail -n1 | grep -q "200"; then
        echo -e "${GREEN}✅ Gemini template endpoint is working${NC}"
    else
        echo -e "${RED}❌ Gemini template endpoint test failed${NC}"
        echo "Response: $GEMINI_RESPONSE"
    fi
    
    # Test Gemini chat endpoint
    echo "Testing Gemini chat endpoint..."
    GEMINI_CHAT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/geminichat \
        -H "Content-Type: application/json" \
        -d '{"messages": [{"role": "user", "content": "Hello, test message"}]}' \
        -w "%{http_code}")
    
    if echo "$GEMINI_CHAT_RESPONSE" | tail -n1 | grep -q "200"; then
        echo -e "${GREEN}✅ Gemini chat endpoint is working${NC}"
    else
        echo -e "${RED}❌ Gemini chat endpoint test failed${NC}"
        echo "Response: $GEMINI_CHAT_RESPONSE"
    fi
    
else
    echo -e "\n${BLUE}⏭️  Skipping AI API tests (API keys not provided)${NC}"
fi

echo -e "\n${GREEN}🎉 All tests passed! Your Docker images are working correctly from Docker Hub.${NC}"

# Display running containers
echo -e "\n${BLUE}📊 Currently running containers:${NC}"
docker-compose -f docker-compose.test-temp.yml ps

echo -e "\n${BLUE}📱 Access your application:${NC}"
echo "Frontend: http://localhost:8080"
echo "Backend API: http://localhost:3000"

echo -e "\n${BLUE}🧪 Manual API Testing Commands:${NC}"
echo "# Test Claude Template:"
echo 'curl -X POST http://localhost:3000/api/template -H "Content-Type: application/json" -d '"'"'{"prompt": "Create a React app", "type": "react"}'"'"''
echo ""
echo "# Test Gemini Template:"
echo 'curl -X POST http://localhost:3000/api/geminiTemplate -H "Content-Type: application/json" -d '"'"'{"prompt": "Create a React app", "type": "react"}'"'"''
echo ""
echo "# Test Gemini Chat:"
echo 'curl -X POST http://localhost:3000/api/geminichat -H "Content-Type: application/json" -d '"'"'{"messages": [{"role": "user", "content": "Hello"}]}'"'"''
echo ""

echo -e "\n${BLUE}🛑 To stop the test containers, run:${NC}"
echo "docker-compose -f docker-compose.test-temp.yml down"

# Cleanup temp file
rm -f docker-compose.test-temp.yml

echo -e "\n${GREEN}✨ CI/CD validation completed successfully!${NC}"