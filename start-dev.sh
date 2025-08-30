#!/bin/bash

# Bolt.me Development Startup Script
# This script ensures the application starts with proper API key configuration

set -e  # Exit on error

echo "🚀 Starting Bolt.me Development Environment"
echo "=========================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your API keys:"
    echo "ANTHROPIC_API_KEY=your_anthropic_key"
    echo "GEMINI_API_KEY=your_gemini_key"
    exit 1
fi

# Check if required API keys are set in .env.local
if ! grep -q "ANTHROPIC_API_KEY=" .env.local || ! grep -q "GEMINI_API_KEY=" .env.local; then
    echo "⚠️  Warning: API keys might not be properly configured in .env.local"
    echo "Please ensure both ANTHROPIC_API_KEY and GEMINI_API_KEY are set"
fi

echo "📋 Environment configuration:"
echo "   - Using .env.local for environment variables"
echo "   - Frontend will be available at: http://localhost:8080"
echo "   - Backend API will be available at: http://localhost:3000"
echo ""

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose --env-file .env.local down

echo ""
echo "🔨 Building and starting containers with proper environment..."
docker-compose --env-file .env.local up --build -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🔍 Checking service health..."

# Check backend health
if curl -f -s http://localhost:3000/health > /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    echo "Check logs with: docker logs boltme-backend-1"
fi

# Check frontend
if curl -f -s http://localhost:8080 > /dev/null; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    echo "Check logs with: docker logs boltme-frontend-1"
fi

# Test API endpoints
echo ""
echo "🧪 Testing API endpoints..."

if curl -f -s -X POST http://localhost:8080/api/geminiTemplate \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer abcd123" \
    -d '{"prompt": "test"}' > /dev/null; then
    echo "✅ Gemini Template API is working"
else
    echo "❌ Gemini Template API test failed"
    echo "Check backend logs for API key issues"
fi

echo ""
echo "🎉 Bolt.me is ready!"
echo "=========================================="
echo "Frontend: http://localhost:8080"
echo "Backend:  http://localhost:3000"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker-compose --env-file .env.local logs -f"
echo "   Stop:      docker-compose --env-file .env.local down"
echo "   Rebuild:   docker-compose --env-file .env.local up --build"
echo ""