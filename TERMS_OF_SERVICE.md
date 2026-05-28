# CapitalFlow Deployment Guide

## Prerequisites
- Docker & Docker Compose v3.8+
- Node.js 20+
- Turso account with database URL
- Telegram Bot Token (optional)

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/capitalflow/platform.git
cd capitalflow
cp .env.example .env
npm install
```

### 2. Configure Environment
Edit `.env` with your Turso credentials and Telegram token.

### 3. Build & Run
```bash
# Development
npm run dev

# Production (Docker)
docker-compose up --build -d
```

### 4. Access
- Frontend: http://localhost:80
- API: http://localhost:3001/api/health
- Admin: admin@capitalflow.io / CapitalFlowAdmin2025!

## Architecture
```
Frontend (React SPA)  →  Nginx Reverse Proxy  →  Express API
                                                   ↓
                                            Turso (LibSQL)
                                            Telegram Bot
                                            Redis Cache
```

## Migrations
```bash
# Auto-migration on first start
# Manual migration:
cat migrations/001_initial.sql | turso db shell capitalflow-db
```

## Monitoring
- Health: GET /api/health
- Rate limit: 100 req/min per IP
- Logs: docker-compose logs -f
