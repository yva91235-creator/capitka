# Changelog — CapitalFlow v9.0

## [9.0.0] - 2025-05-24
### Added
- Full bilingual support (RU/EN) for Profile, Academy, and all buttons
- Device cookies with fingerprint validation
- Telegram bot for password recovery
- Admin can view/reject/approve KYC with document preview
- Modal project viewer in admin panel
- Dual-language project creation (RU/EN)
- Seed phrase recovery for each account
- 7 new enterprise features:
  1. Multi-Region Nodes
  2. Quantum Guard
  3. Behavioral Auth
  4. Webhooks API
  5. Cold Storage Status
  6. Audit 2.0
  7. Zero-Knowledge Proofs

### Fixed
- Profile translations: all labels, buttons, modals now use useLangStore
- Academy translations: all 15 cards, titles, descriptions bilingual
- Navigation: replaced window.location with React Router navigate()
- KYC redirect from Wallet works correctly
- Dashboard redirect after verification fixed
- Avatar persistence in Turso database
- Project visibility in investor view

### Security
- AES-256 encryption for documents
- SHA-256 password hashing
- Rate limiting on API
- XSS protection via helmet
- Device fingerprint cookies
- Session token rotation
