/**
 * CapitalFlow Migration Runner
 * Run: node scripts/migrate.js
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_URL || 'libsql://apv-capitalflow21.aws-ap-northeast-1.turso.io',
  authToken: process.env.TURSO_TOKEN
});

async function runMigrations() {
  console.log('📦 Running CapitalFlow migrations...');
  
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  
  for (const file of files) {
    console.log(`  → Running ${file}...`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const stmt of statements) {
      try {
        await db.execute(stmt.trim());
      } catch (e) {
        console.log(`    ⚠️  ${e.message}`);
      }
    }
    console.log(`  ✅ ${file} complete`);
  }
  
  console.log('🎉 All migrations complete!');
  process.exit(0);
}

runMigrations().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
