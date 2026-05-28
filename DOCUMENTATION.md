# CapitalFlow Platform Documentation

## Section 1: Functions (API & Logic)

| ID | Function Name | Inputs | Outputs | Potential Errors |
|----|---------------|--------|---------|------------------|
| F-01 | Registration | email, password, fullName | JWT Token, User Object | Email exists, Weak password, invalid email |
| F-02 | Login | email, password, 2FA (optional) | JWT Token, Session | Invalid credentials, Account locked, 2FA mismatch |
| F-03 | Password Reset | email, newPassword, token | Success status | Invalid token, expired link |
| F-04 | 2FA Management | userId, secret, code | Backup codes, status | Invalid code, already enabled |
| F-05 | Telegram Link | userId, botToken | Connected status | Invalid token, already linked |
| F-06 | Project Browser | filters (cat, roi, min) | List of Projects | Database timeout |
| F-07 | Investment Logic | projectId, amount | Investment Record | Insufficient balance, limit reached |
| F-08 | Crypto Deposit | network (TRC20) | Wallet Address, QR | API unreachable |
| F-09 | Manual Deposit | receiptImage | Ticket ID | Invalid file format |
| F-10 | Withdrawal | amount, walletAddress | Transaction Hash | Insufficient funds, limit exceeded |
| F-11 | Referral System | referralCode | Bonus calculation | Recursive referral, invalid code |
| F-12 | KYC Verification | ID photos, Selfie | Status (pending/approved) | Poor image quality, mismatch |
| F-13 | Support Tickets | subject, category, msg | Ticket ID | - |
| F-14 | Admin Panel | adminId, action | Global metrics, user mgmt | Unauthorized access |

## Section 2: UI/UX Pixel-Perfect Specifications

### 1. Registration Page
- **Background**: `radial-gradient(circle at 20% 30%, #1E293B, #0A0C15)`
- **Container**: Glassmorphism card, `backdrop-filter: blur(16px)`, `border: 1px solid rgba(56, 189, 248, 0.25)`
- **Typography**: Inter Sans, Titles: `700 weight`, `30px size`, `gradient text`
- **Inputs**: Height `48px`, BG `rgba(30,41,59,0.6)`, Border `#334155`
- **Animations**: `fadeInUp` on entry, `shimmer` on buttons

### 2. Dashboard
- **Sidebar**: Width `260px`, BG `#0F111A`, Border-right `#1E293B`
- **Stat Cards**: Padding `24px`, Border-radius `24px`, icon background variations
- **Charts**: Recharts AreaChart, stroke `#38BDF8`, gradient fill
- **Project Cards**: Image height `192px`, hover scale `1.1x`

### 3. Wallet
- **Colors**: USDT-Green `#10B981`, Error-Red `#EF4444`, Accent-Blue `#38BDF8`
- **Tabs**: Smooth transitions between Deposit/Withdraw/History

## Section 3: Project Structure

- `src/lib/db.ts`: Turso Database Client
- `src/store/authStore.ts`: Zustand session management
- `src/components/ui/index.tsx`: Core UI Primitives (Button, Input, Card)
- `src/pages/*`: All functional modules (Dashboard, Admin, etc.)
