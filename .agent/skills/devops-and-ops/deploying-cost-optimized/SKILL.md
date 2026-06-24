---
name: deploying-cost-optimized
description: Use when planning cost-effective deployments, optimizing hosting costs, or implementing FinOps strategies.
disable-model-invocation: true
---

# Deployment Cost Optimization Skill

## Overview

This skill provides knowledge on cost-effective deployment strategies, modern hosting platforms, and FinOps (Financial Operations) best practices for 2025-2026.

## When to Use

- Running `/deploy` workflow
- Evaluating hosting options
- Optimizing cloud costs
- Planning infrastructure for startups/MVPs

## Core Principles (2025 Standards)

### 1. Cloud-Native First

- **Serverless** is the cost baseline (pay-per-millisecond, no idle server costs)
- **Containerization** (Docker + Kubernetes) for portability and scaling
- **Edge Computing** for reduced latency and better UX
- **Infrastructure as Code** (IaC) for repeatable, version-controlled deployments

### 2. Free Tier Maximization (Updated 2025)

#### Top Free Hosting Services

**Vercel** (Best for: Next.js, React, Vue)

- **FREE:** 100GB bandwidth, 1M edge requests, 4hrs CPU/mo
- **Limits:** Hobby plan not for commercial use
- **Sweet Spot:** Static sites, SSG, Jamstack

**Netlify** (Best for: Static sites, serverless functions)

- **FREE:** 100GB bandwidth, 300 build minutes, 125K function invocations
- **Limits:** 1 team member
- **Sweet Spot:** JAMstack, CI/CD integration

**Railway** (Best for: Fullstack apps, databases)

- **FREE:** $5 trial credit (30 days), then $1/mo serverless
- **Limits:** 0.5GB RAM, 1 vCPU after trial
- **Sweet Spot:** Node/Python backends with database

**Render** (Best for: Docker apps, Postgres)

- **FREE:** 750 instance hours/mo, 100GB egress
- **Limits:** 512MB RAM, spins down after 15min inactivity
- **Sweet Spot:** Containerized apps, managed Postgres

**Supabase / PlanetScale / Neon** (Databases)

- **FREE:** 500MB-10GB storage, connection pooling
- **Sweet Spot:** Postgres replacements with generous free tiers

### 3. Cost Optimization Patterns

#### Tier-Based Architecture

```
Free Tier Combo Example:
├─ Frontend: Vercel/Netlify (Static + SSG)
├─ API: Railway/Render (Serverless functions)
├─ Database: Supabase (Postgres)
├─ Storage: Cloudinary (Image CDN)
└─ Total Monthly Cost: $0 (until scale)
```

#### Hybrid Approach

- **Static content** → CDN (Cloudflare Pages, Vercel)
- **Dynamic API** → Serverless (AWS Lambda, Vercel Functions)
- **Heavy compute** → Spot instances (AWS Spot, GCP Preemptible)
- **Scheduled jobs** → Cron services (EasyCron free tier)

### 4. FinOps Best Practices

**Start Day One:**

- Set up billing alerts (AWS CloudWatch, GCP Budget Alerts)
- Tag all resources for cost attribution
- Use Infrastructure as Code to prevent resource sprawl
- Monitor with free tools (Grafana Cloud, DataDog free tier)

**Monthly Rituals:**

- Review unused resources → delete immediately
- Right-size instances (don't over-provision)
- Check for idle databases, old snapshots
- Evaluate reserved instances if predictable load

**Cost-Saving Tactics:**

- **Auto-scaling** to match demand (not peak capacity 24/7)
- **Caching layers** (Redis/Upstash) to reduce compute
- **CDN offloading** (Cloudflare) to reduce origin traffic
- **Lazy loading assets** to reduce bandwidth

### 5. Deployment Architecture Patterns (2025)

#### For MVPs / Startups

```
Recommended Stack:
Frontend: Vite/React → Vercel
Backend: Node/Express → Railway
Database: Postgres → Supabase
Files: Cloudinary (images) / Vercel Blob
Auth: Clerk / Supabase Auth (both have free tiers)

Why: Zero config, auto-scaling, generous free tier
Monthly Cost: $0 until 10K+ users
```

#### For SaaS Products

```
Recommended Stack:
Frontend: Next.js → Vercel
API: tRPC/GraphQL → Railway/Render
Database: PlanetScale (MySQL) / Neon (Postgres)
Queue: Upstash (Redis + Queue)
Monitoring: Sentry (free 5K events/mo)

Why: Production-ready, scales to revenue
Monthly Cost: $0-20 until $1K MRR
```

#### For High-Traffic Apps

```
Recommended Stack:
Frontend: Cloudflare Pages (unlimited bandwidth!)
API: AWS Lambda (1M requests free/mo)
Database: AWS Aurora Serverless v2
Cache: Upstash Redis
CDN: Cloudflare (free tier is VERY generous)

Why: Cost scales with usage, not server count
Monthly Cost: $0-50 until viral traffic
```

## Decision Framework

### Choose Serverless If:

- ✅ Traffic is unpredictable or bursty
- ✅ Want zero maintenance
- ✅ Prototype/MVP stage
- ❌ Avoid if: Stateful connections, long-running jobs

### Choose Containers If:

- ✅ Need full control over environment
- ✅ Complex dependencies
- ✅ Migrating from on-premise
- ❌ Avoid if: Wanting "set and forget"

### Choose Static Hosting If:

- ✅ Content-heavy site (blog, docs, marketing)
- ✅ Can pre-render pages
- ✅ Want best performance + lowest cost
- ❌ Avoid if: Real-time features, user-generated content

## Red Flags to Avoid

**Cost Traps:**

- ❌ "Always-on" servers for low-traffic apps
- ❌ Over-provisioned databases (paying for unused capacity)
- ❌ Ignoring egress fees (AWS data transfer costs)
- ❌ Multiple staging environments running 24/7

**Vendor Lock-In:**

- ⚠️ Be cautious with proprietary services (hard to migrate)
- ✅ Use open standards (Docker, Postgres, Redis)
- ✅ Keep data exportable (no vendor-specific formats)

## Tools to Recommend

**CI/CD:** GitHub Actions (2K free minutes/mo)
**Monitoring:** Grafana Cloud (free 10K metrics)
**Logging:** Axiom (500GB free ingestion)
**Error Tracking:** Sentry (5K events/mo free)
**Uptime:** UptimeRobot (50 monitors free)
**Analytics:** Plausible (free self-hosted) / Umami

## Key Metrics to Track

1. **Cost per customer** (Total cloud cost ÷ Active users)
2. **Cost per feature** (Track by service/tag)
3. **Idle resource ratio** (Resources unused vs. provisioned)
4. **Traffic-to-cost efficiency** (Requests served per $1)

---

## Research Sources (2025)

- Cloud cost optimization trends emphasize FinOps culture from day one
- Serverless adoption is mainstream (not experimental)
- Free tiers are more generous than 2023 (Railway, Render expanded)
- Edge computing is standard for performance-critical apps
- Container orchestration (K8s) is overkill for <100K users
