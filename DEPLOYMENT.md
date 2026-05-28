# CapitalFlow API Reference

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### Health Check
```http
GET /api/health
→ { status: "online", version: "1.0.0", uptime: 1234 }
```

### Users
```http
GET /api/users/:id
→ { id, email, full_name, role, status, balance, ... }

PUT /api/users/:id
Body: { full_name, telegram_id, company_name, inn, avatar_url }
→ { success: true }
```

### Projects
```http
GET /api/projects
→ [{ id, title, description, min_investment, target_amount, roi_annual, ... }]

POST /api/projects
Body: { title, title_en, description, description_en, category, min_investment, target_amount, roi_annual, duration_months, image_url, user_id }
→ { id, success: true }
```

### Deposits
```http
POST /api/deposits
Body: { user_id, amount }
→ { id: "DEP-ABC123", success: true }

POST /api/deposits/:id/approve
→ { success: true }
```

### Transactions
```http
GET /api/transactions/:userId
→ [{ id, user_id, type, amount, status, details, created_at }]
```

## Telegram Bot Commands
```
/start <user_id>     - Link account to Telegram
/reset <new_password> - Reset account password
```
