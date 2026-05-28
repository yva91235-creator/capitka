# CapitalFlow Architecture

## System Overview
```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (SPA)                       │
│  React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion│
├─────────────────────────────────────────────────────────────┤
│                      API Gateway (Nginx)                     │
├─────────────────────────────────────────────────────────────┤
│                    Backend API (Express.js)                  │
├─────────────────────────────────────────────────────────────┤
│   Turso (LibSQL)  │  Telegram Bot  │  Redis Cache           │
└─────────────────────────────────────────────────────────────┘
```

## Core Features (50+ Modules)
1. Advanced Analytics Engine
2. Portfolio Risk Heatmap
3. Real-time Blockchain Sync
4. Auto-rebalancing Portfolio
5. AI ROI Forecasting
6. Anti-DDoS WAF Integration
7. Biometric Session Lock
8. End-to-End Encryption (AES-256)
9. Institutional Grade Custody
10. 3-Tier Referral System
11. Multi-currency euro
12. Automated AML Scoring
13. KYC Document OCR
14. Telegram Bot Integration
15. Behavioral Auth System
16. Quantum Guard Protection
17. Cold Storage Foundation
18. Multi-Region Node Routing
19. Audit 2.0 Public Logs
20. Zero-Knowledge Proofs

## Security
- SHA-256 password hashing with salt
- AES-256 document encryption
- TLS 1.3 transport security
- Anti-DDoS rate limiting
- XSS/SQL injection protection
- Device fingerprint cookies
- Session token rotation

## Deployment
```bash
docker-compose up --build -d
```
