const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createClient } = require('@libsql/client');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));

// Turso DB
const db = createClient({
  url: process.env.TURSO_URL || 'libsql://apv-capitalflow21.aws-ap-northeast-1.turso.io',
  authToken: process.env.TURSO_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk5MDA5ODQsImlkIjoiMDE5ZTZhNWQtNzYwMS03ZjI4LWE4NmUtMTcyYWU2OGUyMDVhIiwicmlkIjoiYjdhODI3MTEtOWY2ZS00YmEwLThmNGMtNmYyYTFhNjljMmEzIn0.-kobSF3bFTGkiv7EmnJCO9w0pWvQHFf-FyiPBiNviSEqxHm3D9IC7ryBpLrSTEHCTo0oI9GXxMgXF5C8ppMdCg'
});

// Telegram Bot
const botToken = process.env.TELEGRAM_BOT_TOKEN || '8993462767:AAEF4Ymqmwm1HLeo0Q0nDG95lbJ5GOijUcU';
let bot;
try {
  bot = new TelegramBot(botToken, { polling: true });
  console.log('🤖 Telegram Bot initialized');
} catch (e) {
  console.log('⚠️ Telegram Bot disabled (no token)');
}

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'online', version: '1.0.0', uptime: process.uptime() }));

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const result = await db.execute({ sql: 'SELECT id, email, full_name, role, status, balance, referral_code, kyc_status, telegram_id, company_name, inn, avatar_url, loyalty_tier, total_invested FROM users WHERE id = ?', args: [req.params.id] });
    res.json(result.rows[0] || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { full_name, telegram_id, company_name, inn, avatar_url } = req.body;
    await db.execute({
      sql: 'UPDATE users SET full_name=?, telegram_id=?, company_name=?, inn=?, avatar_url=COALESCE(?, avatar_url) WHERE id=?',
      args: [full_name, telegram_id, company_name, inn, avatar_url || null, req.params.id]
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get projects
app.get('/api/projects', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM projects WHERE status IN ("active","paused") ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Create project
app.post('/api/projects', async (req, res) => {
  try {
    const { title, title_en, description, description_en, category, min_investment, target_amount, roi_annual, duration_months, image_url, user_id } = req.body;
    const id = 'p_' + Math.random().toString(36).substring(2, 9);
    await db.execute({
      sql: 'INSERT INTO projects (id, title, title_en, description, description_en, category, min_investment, target_amount, roi_annual, duration_months, image_url, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      args: [id, title, title_en, description, description_en, category, min_investment, target_amount, roi_annual, duration_months, image_url, 'active']
    });
    res.json({ id, success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Create deposit request
app.post('/api/deposits', async (req, res) => {
  try {
    const { user_id, amount } = req.body;
    const txId = 'DEP-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    await db.execute({
      sql: 'INSERT INTO transactions (id, user_id, type, amount, status, details) VALUES (?,?,?,?,?,?)',
      args: [txId, user_id, 'deposit', amount, 'pending', `Manual deposit request. Code: ${txId}`]
    });
    res.json({ id: txId, success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Approve deposit
app.post('/api/deposits/:id/approve', async (req, res) => {
  try {
    const tx = await db.execute({ sql: 'SELECT * FROM transactions WHERE id = ?', args: [req.params.id] });
    if (!tx.rows[0]) return res.status(404).json({ error: 'Not found' });
    await db.execute({ sql: "UPDATE transactions SET status='completed' WHERE id=?", args: [req.params.id] });
    await db.execute({ sql: 'UPDATE users SET balance=balance+? WHERE id=?', args: [tx.rows[0].amount, tx.rows[0].user_id] });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get transactions
app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const result = await db.execute({ sql: 'SELECT * FROM transactions WHERE user_id=? ORDER BY created_at DESC', args: [req.params.userId] });
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Bot: password reset
if (bot) {
  bot.onText(/\/start (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const code = match[1];
    try {
      const user = await db.execute({ sql: "SELECT id FROM users WHERE id = ?", args: [code] });
      if (user.rows[0]) {
        await bot.sendMessage(chatId, `✅ Ваш ID подтвержден: ${code}\n\nДля сброса пароля отправьте /reset <новый_пароль>\nПример: /reset NewPass123!`);
      } else {
        await bot.sendMessage(chatId, `❌ Пользователь с ID ${code} не найден`);
      }
    } catch (err) {
      await bot.sendMessage(chatId, `❌ Ошибка: ${err.message}`);
    }
  });

  bot.onText(/\/reset (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const newPass = match[1];
    if (newPass.length < 8) {
      return bot.sendMessage(chatId, '❌ Пароль должен быть не менее 8 символов');
    }
    await bot.sendMessage(chatId, `✅ Пароль успешно изменен на: ${newPass}`);
  });

  bot.on('message', (msg) => {
    if (!msg.text?.startsWith('/')) {
      bot.sendMessage(msg.chat.id, `👋 Добро пожаловать в CapitalFlow Bot!\n\nОтправьте /start <ваш_ID> для привязки\nОтправьте /reset <новый_пароль> для смены пароля`);
    }
  });
}

// Rate limiting
const rateLimit = {};
app.use((req, res, next) => {
  const ip = req.ip;
  rateLimit[ip] = (rateLimit[ip] || 0) + 1;
  if (rateLimit[ip] > 100) return res.status(429).json({ error: 'Too many requests' });
  setTimeout(() => { rateLimit[ip]--; }, 60000);
  next();
});

app.listen(PORT, () => console.log(`🚀 CapitalFlow API running on port ${PORT}`));
