/**
 * CapitalFlow Database Backup Script
 * Run: node scripts/backup.js
 */
const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

const db = createClient({
  url: process.env.TURSO_URL || 'libsql://apv-capitalflow21.aws-ap-northeast-1.turso.io',
  authToken: process.env.TURSO_TOKEN
});

async function backup() {
  const date = new Date().toISOString().replace(/[:.]/g, '-');
  const dir = path.join(__dirname, '..', 'backups');
  
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const tables = ['users', 'projects', 'investments', 'transactions', 'kyc_submissions', 'tickets', 'ticket_messages'];
  
  for (const table of tables) {
    try {
      const res = await db.execute(`SELECT * FROM ${table}`);
      const filePath = path.join(dir, `${table}_${date}.json`);
      fs.writeFileSync(filePath, JSON.stringify(res.rows, null, 2));
      console.log(`✅ Backed up ${table}: ${res.rows.length} records`);
    } catch (e) {
      console.log(`⚠️  Skipping ${table}: ${e.message}`);
    }
  }
  
  console.log(`🎉 Backup complete → backups/`);
  process.exit(0);
}

backup().catch(err => { console.error(err); process.exit(1); });
