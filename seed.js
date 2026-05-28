-- CapitalFlow Database Migration v1.0
-- Turso/LibSQL Schema

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'investor',
    status TEXT DEFAULT 'active',
    balance REAL DEFAULT 0,
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    two_fa_enabled INTEGER DEFAULT 0,
    two_fa_secret TEXT,
    telegram_id TEXT,
    company_name TEXT,
    inn TEXT,
    kyc_status TEXT DEFAULT 'none',
    avatar_url TEXT,
    loyalty_tier TEXT DEFAULT 'Bronze',
    total_invested REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
);

CREATE TABLE IF NOT EXISTS investments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

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
);

CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ticket_messages (
    id TEXT PRIMARY KEY,
    ticket_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    message TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ticket_id) REFERENCES tickets(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Insert Admin Account
INSERT OR IGNORE INTO users (id, email, password, full_name, role, status, referral_code, balance)
VALUES ('admin_root', 'admin@capitalflow.io', 'CapitalFlowAdmin2025!', 'Super Admin', 'admin', 'active', 'ADMIN100', 0);

-- Insert Seed Projects
INSERT OR IGNORE INTO projects (id, title, title_en, description, description_en, category, min_investment, target_amount, collected_amount, roi_annual, duration_months, status, image_url) VALUES
('p1', 'Модернизация текстильного комбината "Север"', 'Textile Mill "Sever" Modernization', 'Обновление парка ткацких станков и внедрение автоматизированной системы контроля качества.', 'Renewal of weaving equipment fleet and implementation of automated quality control.', 'Промышленность', 1000, 5000000, 1200000, 16.5, 24, 'active', 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800'),
('p2', 'Завод экологичной упаковки "Эко-Пак"', 'Eco-Pack Biodegradable Packaging Plant', 'Строительство линии по производству биоразлагаемой упаковки из переработанного сырья.', 'Construction of a biodegradable packaging line from recycled materials.', 'Экология', 500, 3000000, 850000, 14.2, 18, 'active', 'https://images.unsplash.com/photo-1530646176562-d8a3655dfaff?w=800'),
('p3', 'Линия сборки промышленных контроллеров', 'Industrial Controller Assembly Line', 'Запуск производства отечественных контроллеров для систем автоматизации.', 'Launch of domestic controller production for automation systems.', 'Технологии', 2500, 8000000, 4200000, 21.0, 36, 'active', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'),
('p4', 'Цех высокоточной металлообработки', 'High-Precision Metalworking Workshop', 'Оснащение цеха 5-осевыми станками ЧПУ для аэрокосмической отрасли.', 'Equipping the workshop with 5-axis CNC machines for aerospace.', 'Промышленность', 5000, 15000000, 3100000, 18.5, 48, 'active', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800'),
('p5', 'Производство строительных смесей "Монолит"', 'Monolit Construction Mixes Production', 'Расширение мощностей по производству инновационных быстросохнущих смесей.', 'Capacity expansion for innovative quick-drying construction mixes.', 'Строительство', 1500, 4500000, 2100000, 15.8, 30, 'active', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_user ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_project ON investments(project_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_user ON kyc_submissions(user_id);
