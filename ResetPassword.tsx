import { createClient } from '@libsql/client';

const url = 'libsql://apv-capitalflow21.aws-ap-northeast-1.turso.io';
const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk5MDA5ODQsImlkIjoiMDE5ZTZhNWQtNzYwMS03ZjI4LWE4NmUtMTcyYWU2OGUyMDVhIiwicmlkIjoiYjdhODI3MTEtOWY2ZS00YmEwLThmNGMtNmYyYTFhNjljMmEzIn0.-kobSF3bFTGkiv7EmnJCO9w0pWvQHFf-FyiPBiNviSEqxHm3D9IC7ryBpLrSTEHCTo0oI9GXxMgXF5C8ppMdCg';

export const db = createClient({
  url,
  authToken,
});

export const initDb = async () => {
  try {
    // Users table
      await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'investor', -- investor, founder, admin
        status TEXT DEFAULT 'active',
        balance REAL DEFAULT 1000, 
        referral_code TEXT UNIQUE,
        referred_by TEXT,
        two_fa_enabled INTEGER DEFAULT 0,
        two_fa_secret TEXT,
        telegram_id TEXT,
        company_name TEXT,
        inn TEXT,
        kyc_status TEXT DEFAULT 'none',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migration: Add missing columns if table already existed
    const columnsToAdd = ['telegram_id', 'company_name', 'inn', 'referred_by', 'avatar_url'];
    for (const col of columnsToAdd) {
      try {
        await db.execute(`ALTER TABLE users ADD COLUMN ${col} TEXT`);
      } catch (e) {
        // Column probably exists, ignore
      }
    }

    // Projects table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        title_en TEXT,
        description TEXT NOT NULL,
        description_en TEXT,
        category TEXT,
        min_investment REAL NOT NULL,
        target_amount REAL NOT NULL,
        collected_amount REAL DEFAULT 0,
        roi_annual REAL NOT NULL,
        duration_months INTEGER NOT NULL,
        status TEXT DEFAULT 'active',
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migration: Add language columns if not exist
    try {
      await db.execute(`ALTER TABLE projects ADD COLUMN title_en TEXT`);
    } catch(e) {}
    try {
      await db.execute(`ALTER TABLE projects ADD COLUMN description_en TEXT`);
    } catch(e) {}

    // Investments table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS investments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        project_id TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(project_id) REFERENCES projects(id)
      )
    `);

    // Transactions table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL, -- deposit, withdrawal, investment, referral_bonus
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // KYC table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS kyc_submissions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        document_type TEXT NOT NULL,
        document_url TEXT NOT NULL,
        selfie_url TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        admin_feedback TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Tickets table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Ticket Messages table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ticket_messages (
        id TEXT PRIMARY KEY,
        ticket_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        message TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(ticket_id) REFERENCES tickets(id)
      )
    `);

    // Seed Admin if not exists
    const adminExists = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: ['admin@capitalflow.io']
    });

    if (adminExists.rows.length === 0) {
      await db.execute({
        sql: 'INSERT INTO users (id, email, password, full_name, role, status, referral_code, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        args: ['admin_root', 'admin@capitalflow.io', 'CapitalFlowAdmin2025!', 'Super Admin', 'admin', 'active', 'ADMIN100', 0]
      });
    }

    // Seed Projects (Hard Reset if empty or outdated)
      const initialProjects = [
        {
          id: 'p1',
          title: 'Модернизация текстильного комбината "Север"',
          category: 'Промышленность',
          min_investment: 1000,
          target_amount: 5000000,
          collected_amount: 1200000,
          roi_annual: 16.5,
          duration_months: 24,
          description: 'Обновление парка ткацких станков и внедрение автоматизированной системы контроля качества. Проект обеспечит рост производства на 40% и выход на международные рынки.',
          image_url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'p6',
          title: 'Пищевой кластер "АгроТех"',
          category: 'Производство',
          min_investment: 200,
          target_amount: 2000000,
          collected_amount: 500000,
          roi_annual: 12.0,
          duration_months: 12,
          description: 'Строительство современных складов для хранения и первичной переработки овощей. Прямые поставки в федеральные сети.',
          image_url: 'https://images.unsplash.com/photo-1560221328-12fe60f83ab8?auto=format&fit=crop&q=80&w=800'
        },
      {
        id: 'p2',
        title: 'Завод экологичной упаковки "Эко-Пак"',
        category: 'Экология',
        min_investment: 500,
        target_amount: 3000000,
        collected_amount: 850000,
        roi_annual: 14.2,
        duration_months: 18,
        description: 'Строительство высокотехнологичной линии по производству биоразлагаемой упаковки из переработработанного сырья. Высокий спрос в ритейле гарантирует стабильный доход.',
        image_url: 'https://images.unsplash.com/photo-1530646176562-d8a3655dfaff?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p3',
        title: 'Линия сборки промышленных контроллеров',
        category: 'Технологии',
        min_investment: 2500,
        target_amount: 8000000,
        collected_amount: 4200000,
        roi_annual: 21.0,
        duration_months: 36,
        description: 'Запуск производства отечественных контроллеров для систем автоматизации зданий и заводов. Проект направлен на импортозамещение в критически важной отрасли.',
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p4',
        title: 'Цех высокоточной металлообработки',
        category: 'Промышленность',
        min_investment: 5000,
        target_amount: 15000000,
        collected_amount: 3100000,
        roi_annual: 18.5,
        duration_months: 48,
        description: 'Оснащение цеха 5-осевыми станками ЧПУ для выполнения заказов аэрокосмической и медицинской отраслей. Высокая маржинальность и долгосрочные контракты.',
        image_url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'p5',
        title: 'Производство строительных смесей "Монолит"',
        category: 'Строительство',
        min_investment: 1500,
        target_amount: 4500000,
        collected_amount: 2100000,
        roi_annual: 15.8,
        duration_months: 30,
        description: 'Расширение мощностей по производству инновационных быстросохнущих смесей для жилого строительства. Региональное лидерство и доступ к дешевому сырью.',
        image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800'
      }
    ];

    for (const p of initialProjects) {
      await db.execute({
        sql: `INSERT OR REPLACE INTO projects (id, title, category, min_investment, target_amount, collected_amount, roi_annual, duration_months, description, image_url, status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        args: [p.id, p.title, p.category, p.min_investment, p.target_amount, p.collected_amount, p.roi_annual, p.duration_months, p.description, p.image_url]
      });
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
