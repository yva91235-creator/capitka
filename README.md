# CapitalFlow — Enterprise Investment Platform 🏭

**Version:** 9.0.0 | **License:** MIT | **Status:** Production Ready

CapitalFlow is a comprehensive industrial investment platform connecting investors with founders. Built with enterprise-grade security, multilingual support, and real-time blockchain integration.

## 🌟 Features (50+ Modules)

| Category | Features |
|----------|----------|
| 🏦 **Core** | AI ROI Forecasting, Portfolio Risk Heatmap, Auto-rebalancing |
| 🔒 **Security** | AES-256 Encryption, SHA-256 Hashing, TLS 1.3, Anti-DDoS WAF |
| 🌐 **Languages** | Full Russian/English bilingual support |
| 🤖 **Bot** | Telegram Bot for password recovery |
| 💰 **Financial** | Multi-currency (EUR/USDT), 3-Tier Referrals, Auto-staking |
| 📊 **Analytics** | Advanced Analytics Engine, Real-time Blockchain Sync |
| 🛡️ **Compliance** | KYC/AML, GDPR-ready, Audit 2.0 Public Logs |

## 🚀 Quick Start

```bash
# Copy environment
cp .env.example .env

# Install
npm install

# Build
npm run build

# Production (Docker)
docker-compose up --build -d
```

## 👤 Admin Access
- **Email:** admin@capitalflow.io
- **Password:** CapitalFlowAdmin2025!

## 📁 Project Structure (80+ files)

```
├── src/               # Frontend (React + TypeScript)
│   ├── pages/         # 12 pages (Dashboard, Wallet, KYC, etc.)
│   ├── components/    # UI components & Sidebar
│   ├── store/         # Zustand state (auth, language)
│   ├── lib/           # Database client, cookies, utilities
│   └── App.tsx        # Router & layout
├── server/            # Backend API (Express.js)
├── telegram_bot/      # Telegram Bot for recovery
├── migrations/        # SQL migrations
├── scripts/           # Seed, migrate, backup
├── docs/              # Full documentation
├── monitoring/        # Prometheus config
└── docker-compose.yml # Infrastructure as code
```

## 🔗 Links
- **API:** http://localhost:3001/api/health
- **TG Bot:** @CapitalFlowBot
- **Support:** @MollyWhip1

*© 2025 CapitalFlow. All rights reserved.*
