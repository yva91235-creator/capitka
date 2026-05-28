/**
 * CapitalFlow Database Seed Script
 * Run: node scripts/seed.js
 */
const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_URL || 'libsql://apv-capitalflow21.aws-ap-northeast-1.turso.io',
  authToken: process.env.TURSO_TOKEN
});

async function seed() {
  console.log('🌱 Seeding CapitalFlow database...');

  // Create admin
  await db.execute({
    sql: `INSERT OR IGNORE INTO users (id, email, password, full_name, role, status, referral_code, balance) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ['admin_root', 'admin@capitalflow.io', 'CapitalFlowAdmin2025!', 'Super Admin', 'admin', 'active', 'ADMIN100', 0]
  });
  console.log('✅ Admin account created');

  // Seed projects
  const projects = [
    { id: 'p1', title: 'Модернизация текстильного комбината "Север"', title_en: 'Textile Mill "Sever" Modernization', cat: 'Промышленность', min: 1000, target: 5000000, collected: 1200000, roi: 16.5, months: 24, desc: 'Обновление парка ткацких станков...', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800' },
    { id: 'p2', title: 'Завод экологичной упаковки "Эко-Пак"', title_en: 'Eco-Pack Biodegradable Plant', cat: 'Экология', min: 500, target: 3000000, collected: 850000, roi: 14.2, months: 18, desc: 'Строительство линии биоразлагаемой упаковки...', img: 'https://images.unsplash.com/photo-1530646176562-d8a3655dfaff?w=800' },
  ];

  for (const p of projects) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO projects (id, title, title_en, description, category, min_investment, target_amount, collected_amount, roi_annual, duration_months, image_url, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      args: [p.id, p.title, p.title_en, p.desc, p.cat, p.min, p.target, p.collected, p.roi, p.months, p.img]
    });
  }
  console.log(`✅ ${projects.length} projects seeded`);

  console.log('🎉 Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
