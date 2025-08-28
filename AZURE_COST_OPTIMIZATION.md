# 💰 Azure Cost Optimization Guide for bolt.me

## 🎯 Cost Reduction Overview

**Original Cost:** $40-65/month  
**Optimized Cost:** $15-50/month  
**Potential Savings:** Up to 75% reduction!

## 🔧 Optimization Strategies Implemented

### 1. **Resource Right-Sizing** (Biggest savings: ~$20-30/month)

| Component | Original | Minimal | Balanced | Performance |
|-----------|----------|---------|----------|-------------|
| **Frontend CPU** | 1.0 core | 0.25 core | 0.5 core | 1.0 core |
| **Frontend RAM** | 2.0 GB | 0.5 GB | 1.0 GB | 2.0 GB |
| **Backend CPU** | 2.0 cores | 0.5 core | 0.75 core | 1.5 cores |
| **Backend RAM** | 4.0 GB | 1.0 GB | 1.5 GB | 3.0 GB |
| **Monthly Cost** | $40-50 | $12-15 | $18-22 | $30-40 |

### 2. **Conditional Monitoring** (Savings: ~$5-10/month)

- **Minimal:** No monitoring/logging (save ~$8/month)
- **Balanced:** Basic monitoring with 14-day retention (save ~$3/month)
- **Performance:** Full monitoring with 30-day retention (original cost)

### 3. **Simplified Architecture** (Savings: ~$5-8/month)

Removed unnecessary components:
- ❌ Virtual Network (use default networking)
- ❌ Network Security Groups (use container-level security)
- ❌ Reserved Static IP (use dynamic with DNS)
- ❌ Storage Account (only for performance tier)

### 4. **Optimized Health Checks** (Savings: ~$1-2/month)

- Reduced health check frequency: 30s → 60s
- Simplified probes (liveness only for minimal tier)

## 📊 Detailed Cost Breakdown

### 💚 Minimal Cost (~$15-20/month)
```
Container Instances (0.75 total cores, 1.5GB RAM): $12-15
Public IP (dynamic): $3
Network egress: $1
Monitoring: $0 (disabled)
Storage: $0 (not included)
─────────────────
Total: $16-19/month
```

### 💛 Balanced Cost (~$20-30/month) **[RECOMMENDED]**
```
Container Instances (1.25 total cores, 2.5GB RAM): $18-22
Public IP (dynamic): $3
Network egress: $1
Log Analytics (14-day retention): $2-3
Application Insights: $1-2
Storage: $0 (not included)
─────────────────
Total: $25-31/month
```

### 💙 Performance (~$35-50/month)
```
Container Instances (2.5 total cores, 5GB RAM): $30-40
Public IP (static): $3
Network egress: $2
Log Analytics (30-day retention): $3-5
Application Insights: $2-3
Storage Account: $2-3
─────────────────
Total: $42-56/month
```

## 🚀 Quick Start - Deploy Cost-Optimized Version

### Single Interactive Deployment (Recommended)
```bash
chmod +x deploy-azure.sh
./deploy-azure.sh
```

The script will prompt you to choose your cost level:
- 💚 **Minimal** (~$15/month)
- 💛 **Balanced** (~$25/month) - Recommended
- 💙 **Performance** (~$40/month)
- 🔧 **Custom** - Your own configuration

### Manual Deployment

**Edit parameters first:**
```bash
# Edit azure-parameters.json and set:
# "costOptimizationLevel": "minimal", "balanced", or "performance"
```

**Then deploy:**
```bash
az deployment group create \
  --resource-group bolt-me-rg \
  --template-file azure-arm-template.json \
  --parameters @azure-parameters.json
```

## 🔄 Migration from Current Setup

If you have an existing deployment:

```bash
# 1. Export current configuration
az deployment group export \
  --resource-group bolt-me-rg \
  --name your-current-deployment-name

# 2. Deploy cost-optimized version
./deploy-azure-cost-optimized.sh

# 3. Test the new deployment

# 4. Delete old resources if satisfied
az group delete --name old-resource-group --yes
```

## 📈 Additional Cost Savings Strategies

### 1. **Auto-Shutdown for Development**
```bash
# For non-production environments
az container stop --resource-group bolt-me-rg --name your-container-group
# Savings: ~70% of container costs during shutdown periods
```

### 2. **Regional Optimization**
Cheaper Azure regions for your workload:
- **East US**: Standard pricing (current)
- **South Central US**: ~10% cheaper
- **West US 2**: ~5% cheaper
- **Central India**: ~30% cheaper (higher latency)

### 3. **Reserved Instances** (For stable workloads)
- 1-year commitment: 30% savings
- 3-year commitment: 50% savings
- Only for performance tier with consistent usage

### 4. **Spot Instances** (For development/testing)
```bash
# Use spot pricing for container instances (up to 90% savings)
# Note: Can be preempted, suitable for dev/test only
```

## 🔍 Cost Monitoring & Alerts

### Set up Budget Alerts
```bash
# Create budget alert at $30/month
az consumption budget create \
  --resource-group bolt-me-rg \
  --budget-name bolt-me-budget \
  --amount 30 \
  --time-grain Monthly \
  --time-period-start-date $(date -d "first day of this month" +%Y-%m-%d) \
  --time-period-end-date $(date -d "last day of this month" +%Y-%m-%d)
```

### Monitor with Azure Cost Management
1. Go to [Azure Cost Management](https://portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/overview)
2. Set up daily/weekly cost alerts
3. Use cost analysis to identify optimization opportunities

## 🎯 Performance Impact Analysis

| Tier | Response Time | Concurrent Users | AI Generation Speed |
|------|---------------|------------------|-------------------|
| **Minimal** | ~500ms | 10-20 | 3-5 seconds |
| **Balanced** | ~300ms | 30-50 | 2-3 seconds |
| **Performance** | ~200ms | 100+ | 1-2 seconds |

## 🛠 Scaling Strategies

### Scale Up When Needed
```bash
# Temporary scale up for high traffic
az container update \
  --resource-group bolt-me-rg \
  --name your-container-group \
  --cpu 2 --memory 4
```

### Scale Down During Low Traffic
```bash
# Scale down during nights/weekends
az container update \
  --resource-group bolt-me-rg \
  --name your-container-group \
  --cpu 0.5 --memory 1
```

## ⚠️ What to Expect with Each Tier

### 💚 Minimal Tier
✅ **Pros:**
- Very low cost
- Sufficient for personal projects
- Good for testing/demos

⚠️ **Considerations:**
- Slower response times
- Limited concurrent users
- No monitoring/alerting

### 💛 Balanced Tier (Recommended)
✅ **Pros:**
- Good price/performance ratio
- Basic monitoring included
- Handles moderate traffic
- Suitable for small businesses

⚠️ **Considerations:**
- May need scaling for traffic spikes

### 💙 Performance Tier
✅ **Pros:**
- Best performance
- Full monitoring and alerting
- Handles high traffic
- Production-ready

⚠️ **Considerations:**
- Higher cost
- May be overkill for simple use cases

## 🎉 Summary

Choose your tier based on:

- **Budget < $25/month**: Minimal tier
- **Budget $25-35/month**: Balanced tier (recommended)
- **Budget > $35/month**: Performance tier
- **Development/Testing**: Minimal with auto-shutdown
- **Production Business**: Balanced or Performance

The cost-optimized templates provide significant savings while maintaining the core functionality of your bolt.me application!