import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  CreditCard, 
  ShieldCheck, 
  MessageSquare,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';
import { Card, Button, Input, cn } from '../components/ui';
import { db } from '../lib/db';
import { motion, AnimatePresence } from 'framer-motion';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'finances' | 'kyc' | 'tickets'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const [editingUser, setEditingUser] = useState<any>(null);
  const [newBalance, setNewBalance] = useState('');
  
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await db.execute('SELECT * FROM users ORDER BY created_at DESC');
      setUsers(res.rows);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await db.execute({
        sql: 'UPDATE users SET balance = ?, role = ?, status = ? WHERE id = ?',
        args: [parseFloat(newBalance) || editingUser.balance, editingUser.role, editingUser.status, editingUser.id]
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const [kycSubmissions, setKycSubmissions] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);

  const [depositRequests, setDepositRequests] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'kyc') fetchKYC();
    if (activeTab === 'tickets') fetchTickets();
    if (activeTab === 'projects') fetchAllProjects();
    if (activeTab === 'finances') fetchDeposits();
  }, [activeTab]);

  const fetchDeposits = async () => {
    try {
      const res = await db.execute(`
        SELECT t.*, u.full_name, u.email, u.telegram_id 
        FROM transactions t 
        JOIN users u ON t.user_id = u.id 
        WHERE t.type = 'deposit' AND t.status = 'pending'
      `);
      setDepositRequests(res.rows);
    } catch (err) { console.error(err); }
  };

  const handleApproveDeposit = async (txId: string, userId: string, amount: number) => {
    try {
      await db.execute({ sql: "UPDATE transactions SET status = 'completed' WHERE id = ?", args: [txId] });
      await db.execute({ sql: "UPDATE users SET balance = balance + ? WHERE id = ?", args: [amount, userId] });
      fetchDeposits();
    } catch (err) { console.error(err); }
  };

  const handleRejectDeposit = async (txId: string) => {
    try {
      if (confirm('Отклонить эту заявку?')) {
        await db.execute({ sql: "UPDATE transactions SET status = 'rejected' WHERE id = ?", args: [txId] });
        fetchDeposits();
      }
    } catch (err) { console.error(err); }
  };

  const fetchAllProjects = async () => {
    try {
      const res = await db.execute('SELECT * FROM projects');
      setAllProjects(res.rows);
    } catch (err) { console.error(err); }
  };

  const handleSaveProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const p = {
      title: formData.get('title_ru') as string,
      title_en: formData.get('title_en') as string,
      category: formData.get('category') as string,
      min_investment: parseFloat(formData.get('min_investment') as string),
      target_amount: parseFloat(formData.get('target_amount') as string),
      roi_annual: parseFloat(formData.get('roi_annual') as string),
      duration_months: parseInt(formData.get('duration_months') as string),
      description: formData.get('description_ru') as string,
      description_en: formData.get('description_en') as string,
      image_url: formData.get('image_url') as string,
      status: formData.get('status') as string,
    };

    try {
      if (editingProject) {
        await db.execute({
          sql: `UPDATE projects SET title=?, title_en=?, category=?, min_investment=?, target_amount=?, roi_annual=?, duration_months=?, description=?, description_en=?, image_url=?, status=? WHERE id=?`,
          args: [p.title, p.title_en, p.category, p.min_investment, p.target_amount, p.roi_annual, p.duration_months, p.description, p.description_en, p.image_url, p.status, editingProject.id]
        });
      } else {
        const id = Math.random().toString(36).substring(2, 15);
        await db.execute({
          sql: `INSERT INTO projects (id, title, title_en, category, min_investment, target_amount, roi_annual, duration_months, description, description_en, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [id, p.title, p.title_en, p.category, p.min_investment, p.target_amount, p.roi_annual, p.duration_months, p.description, p.description_en, p.image_url, p.status]
        });
      }
      setShowProjectModal(false);
      setEditingProject(null);
      fetchAllProjects();
    } catch (err) { console.error(err); }
  };

  const fetchKYC = async () => {
    try {
      const res = await db.execute(`
        SELECT k.*, u.full_name, u.email 
        FROM kyc_submissions k 
        JOIN users u ON k.user_id = u.id 
        WHERE k.status = 'pending'
      `);
      setKycSubmissions(res.rows);
    } catch (err) { console.error(err); }
  };

  const fetchTickets = async () => {
    try {
      const res = await db.execute(`
        SELECT t.*, u.full_name 
        FROM tickets t 
        JOIN users u ON t.user_id = u.id 
        WHERE t.status = 'open'
      `);
      setSupportTickets(res.rows);
    } catch (err) { console.error(err); }
  };

  const handleApproveKYC = async (subId: string, userId: string) => {
    try {
      await db.execute({ sql: "UPDATE kyc_submissions SET status = 'approved' WHERE id = ?", args: [subId] });
      await db.execute({ sql: "UPDATE users SET kyc_status = 'approved' WHERE id = ?", args: [userId] });
      fetchKYC();
    } catch (err) { console.error(err); }
  };

  const handleRejectKYC = async (subId: string, userId: string) => {
    try {
      await db.execute({ sql: "UPDATE kyc_submissions SET status = 'rejected' WHERE id = ?", args: [subId] });
      await db.execute({ sql: "UPDATE users SET kyc_status = 'none' WHERE id = ?", args: [userId] });
      fetchKYC();
    } catch (err) { console.error(err); }
  };

  const [viewingKYC, setViewingKYC] = useState<any>(null);
  const [viewingProject, setViewingProject] = useState<any>(null);

  const tabs = [
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'projects', label: 'Проекты', icon: Briefcase },
    { id: 'finances', label: 'Заявки', icon: CreditCard },
    { id: 'kyc', label: 'Верификация', icon: ShieldCheck },
    { id: 'tickets', label: 'Поддержка', icon: MessageSquare },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#F1F5F9]">Панель управления</h1>
          <p className="text-[#94A3B8]">Управление платформой и пользователями</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">Скачать отчет</Button>
          <Button size="sm">Статус системы</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[#111827]/50 border border-[#1E293B] rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200",
              activeTab === tab.id 
                ? "bg-[#1E293B] text-[#38BDF8] shadow-lg" 
                : "text-[#64748B] hover:text-[#94A3B8] hover:bg-[#1E293B]/30"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="p-0 border-[#1E293B] bg-[#0F111A]/80">
        <div className="p-6 border-b border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[#F1F5F9]">
            Управление: {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4" />
            <input 
              placeholder="Поиск..." 
              className="w-full h-10 bg-[#1E293B] border border-[#334155] rounded-xl pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'users' && (
            <table className="w-full text-left">
              <thead className="text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#1E293B]">
                <tr>
                  <th className="px-6 py-4">Пользователь</th>
                  <th className="px-6 py-4">Статус</th>
                  <th className="px-6 py-4">Баланс</th>
                  <th className="px-6 py-4">Роль</th>
                  <th className="px-6 py-4">Дата</th>
                  <th className="px-6 py-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#38BDF8]/30 border-t-[#38BDF8] rounded-full animate-spin" />
                        <p className="text-[#94A3B8]">Loading platform data...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#1E293B]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#1E293B] rounded-full flex items-center justify-center font-bold text-[#38BDF8]">
                            {user.full_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#F1F5F9]">{user.full_name}</p>
                            <p className="text-xs text-[#64748B]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                          user.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
                        )}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#F1F5F9]">
                        ${user.balance?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                          user.role === 'admin' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#94A3B8]">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            setEditingUser(user);
                            setNewBalance(user.balance.toString());
                          }}
                          className="text-[#64748B] hover:text-[#38BDF8] transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'kyc' && (
            <div className="p-6">
              {kycSubmissions.length === 0 ? (
                <div className="p-12 text-center text-[#64748B]">Нет заявок на верификацию</div>
              ) : (
                <div className="space-y-4">
                  {kycSubmissions.map(k => (
                    <div key={k.id} className="p-4 bg-[#1E293B]/50 border border-[#334155] rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{k.full_name}</p>
                        <p className="text-xs text-[#94A3B8]">{k.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-9" onClick={() => setViewingKYC(k)}>Просмотр</Button>
                        <Button size="sm" className="h-9 bg-emerald-500 hover:bg-emerald-600" onClick={() => handleApproveKYC(k.id, k.user_id)}>Одобрить</Button>
                        <Button size="sm" variant="danger" className="h-9" onClick={() => handleRejectKYC(k.id, k.user_id)}>Отклонить</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'finances' && (
            <div className="p-6">
              {depositRequests.length === 0 ? (
                <div className="p-12 text-center text-[#64748B]">Нет активных заявок на пополнение.</div>
              ) : (
                <div className="space-y-4">
                  {depositRequests.map(r => (
                    <div key={r.id} className="p-4 bg-[#1E293B]/50 border border-[#334155] rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{r.full_name} (€{r.amount})</p>
                        <p className="text-[10px] text-orange-400 font-mono">ID: {r.user_id} | TG: {r.telegram_id}</p>
                        <p className="text-xs text-[#94A3B8] mt-1">{r.details}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-9" onClick={() => window.open(`https://t.me/${r.telegram_id?.replace('@','')}`, '_blank')}>Личка</Button>
                        <Button size="sm" variant="danger" className="h-9 bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white" onClick={() => handleRejectDeposit(r.id)}>Отклонить</Button>
                        <Button size="sm" className="h-9 bg-emerald-500 hover:bg-emerald-600 border-none" onClick={() => handleApproveDeposit(r.id, r.user_id, r.amount)}>Одобрить</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="p-6">
              {supportTickets.length === 0 ? (
                <div className="p-12 text-center text-[#64748B]">Нет открытых тикетов.</div>
              ) : (
                <div className="space-y-4">
                  {supportTickets.map(t => (
                    <div key={t.id} className="p-4 bg-[#1E293B]/50 border border-[#334155] rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{t.subject}</p>
                        <p className="text-xs text-[#94A3B8]">От: {t.full_name} ({t.category})</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-9">Ответить</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white">Проекты ({allProjects.length})</h4>
                <Button size="sm" onClick={() => { setEditingProject(null); setShowProjectModal(true); }}>Создать проект</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allProjects.map(p => (
                  <div key={p.id} className="p-4 bg-[#1E293B]/50 border border-[#334155] rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={p.image_url} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-sm text-white">{p.title}</p>
                        <p className="text-[10px] text-[#94A3B8]">{p.category} • {p.status}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8" onClick={() => setViewingProject(p)}>Просмотр</Button>
                      <Button size="sm" variant="outline" className="h-8" onClick={() => { setEditingProject(p); setShowProjectModal(true); }}>Изменить</Button>
                      <Button size="sm" variant="danger" className="h-8" onClick={async () => {
                        if (confirm('Вы уверены, что хотите удалить этот проект?')) {
                          await db.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [p.id] });
                          fetchAllProjects();
                        }
                      }}>Удалить</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-[#0A0C15]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md"
            >
              <Card className="p-8 border-[#38BDF8]/30">
                <h2 className="text-2xl font-bold text-white mb-6">Управление пользователем</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-[#64748B] uppercase mb-2 block">Баланс</label>
                    <input 
                      type="number"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      className="w-full h-12 bg-[#0F111A] border border-[#334155] rounded-xl px-4 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#64748B] uppercase mb-2 block">Роль</label>
                    <select 
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                      className="w-full h-12 bg-[#0F111A] border border-[#334155] rounded-xl px-4 text-white outline-none"
                    >
                      <option value="investor">Инвестор</option>
                      <option value="founder">Основатель</option>
                      <option value="admin">Админ</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#64748B] uppercase mb-2 block">Статус</label>
                    <select 
                      value={editingUser.status}
                      onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                      className="w-full h-12 bg-[#0F111A] border border-[#334155] rounded-xl px-4 text-white outline-none"
                    >
                      <option value="active">Активен</option>
                      <option value="pending">Ожидание</option>
                      <option value="banned">Забанен</option>
                    </select>
                  </div>
                  <Button className="w-full" onClick={handleUpdateUser}>Сохранить изменения</Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {showProjectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowProjectModal(false); setEditingProject(null); }}
              className="absolute inset-0 bg-[#0A0C15]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="p-8 border-[#38BDF8]/30">
                <h2 className="text-2xl font-bold text-white mb-6">{editingProject ? 'Редактировать проект' : 'Создать проект (RU/EN)'}</h2>
                <form onSubmit={handleSaveProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Название (RU)" name="title_ru" defaultValue={editingProject?.title} required />
                    <Input label="Title (EN)" name="title_en" defaultValue={editingProject?.title_en || editingProject?.title} required />
                    <Input label="Категория" name="category" defaultValue={editingProject?.category} required />
                    <Input label="Мин. инвестиция (€)" name="min_investment" type="number" defaultValue={editingProject?.min_investment} required />
                    <Input label="Цель сбора (€)" name="target_amount" type="number" defaultValue={editingProject?.target_amount} required />
                    <Input label="ROI (%)" name="roi_annual" type="number" step="0.1" defaultValue={editingProject?.roi_annual} required />
                    <Input label="Срок (мес.)" name="duration_months" type="number" defaultValue={editingProject?.duration_months} required />
                    <Input label="URL изображения" name="image_url" defaultValue={editingProject?.image_url} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#64748B] uppercase block">Описание (RU)</label>
                      <textarea name="description_ru" defaultValue={editingProject?.description} className="w-full h-24 bg-[#0F111A] border border-[#334155] rounded-xl p-4 text-white text-sm focus:border-[#38BDF8] outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#64748B] uppercase block">Description (EN)</label>
                      <textarea name="description_en" defaultValue={editingProject?.description_en || editingProject?.description} className="w-full h-24 bg-[#0F111A] border border-[#334155] rounded-xl p-4 text-white text-sm focus:border-[#38BDF8] outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#64748B] uppercase mb-2 block">Статус</label>
                    <select name="status" defaultValue={editingProject?.status || 'active'} className="w-full h-12 bg-[#0F111A] border border-[#334155] rounded-xl px-4 text-white outline-none">
                      <option value="active">Активен</option>
                      <option value="paused">Пауза</option>
                      <option value="completed">Завершен</option>
                    </select>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1" type="button" onClick={() => { setShowProjectModal(false); setEditingProject(null); }}>Отмена</Button>
                    <Button className="flex-1" type="submit">Сохранить проект</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}

        {viewingKYC && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingKYC(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg">
              <Card className="p-8">
                <h3 className="text-xl font-bold text-white mb-6">Документы пользователя</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#0F111A] rounded-xl border border-[#334155]">
                    <p className="text-xs text-[#64748B] uppercase mb-2">Паспорт / ID</p>
                    <div className="h-48 bg-[#1E293B] rounded-lg flex items-center justify-center text-[#64748B]">
                      <img src={viewingKYC.document_url || 'https://via.placeholder.com/400x300?text=Passport+Photo'} alt="Document" className="w-full h-full object-cover rounded-lg" />
                    </div>
                  </div>
                  <div className="p-4 bg-[#0F111A] rounded-xl border border-[#334155]">
                    <p className="text-xs text-[#64748B] uppercase mb-2">Селфи с документом</p>
                    <div className="h-48 bg-[#1E293B] rounded-lg flex items-center justify-center text-[#64748B]">
                      <img src={viewingKYC.selfie_url || 'https://via.placeholder.com/400x300?text=Selfie+Photo'} alt="Selfie" className="w-full h-full object-cover rounded-lg" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setViewingKYC(null)}>Закрыть</Button>
                    <Button className="flex-1 bg-emerald-500" onClick={() => { handleApproveKYC(viewingKYC.id, viewingKYC.user_id); setViewingKYC(null); }}>Одобрить</Button>
                    <Button variant="danger" className="flex-1" onClick={() => { handleRejectKYC(viewingKYC.id, viewingKYC.user_id); setViewingKYC(null); }}>Отклонить</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {viewingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingProject(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <Card className="p-0 overflow-hidden">
                <div className="h-64 relative">
                  <img src={viewingProject.image_url} alt={viewingProject.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C15] to-transparent" />
                  <button onClick={() => setViewingProject(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70">✕</button>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{viewingProject.title}</h3>
                  <p className="text-[#38BDF8] text-sm font-bold uppercase mb-4">{viewingProject.category} • Статус: {viewingProject.status}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-[#0F111A] rounded-xl border border-[#334155]">
                      <p className="text-[10px] text-[#64748B] uppercase mb-1">Мин. инвестиция</p>
                      <p className="text-lg font-bold text-white">€{viewingProject.min_investment?.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-[#0F111A] rounded-xl border border-[#334155]">
                      <p className="text-[10px] text-[#64748B] uppercase mb-1">Цель сбора</p>
                      <p className="text-lg font-bold text-white">€{viewingProject.target_amount?.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-[#0F111A] rounded-xl border border-[#334155]">
                      <p className="text-[10px] text-[#64748B] uppercase mb-1">ROI (год)</p>
                      <p className="text-lg font-bold text-emerald-400">{viewingProject.roi_annual}%</p>
                    </div>
                    <div className="p-4 bg-[#0F111A] rounded-xl border border-[#334155]">
                      <p className="text-[10px] text-[#64748B] uppercase mb-1">Срок</p>
                      <p className="text-lg font-bold text-white">{viewingProject.duration_months} мес.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#0F111A] rounded-xl border border-[#334155] mb-6">
                    <p className="text-[10px] text-[#64748B] uppercase mb-2">Описание проекта</p>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">{viewingProject.description}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setViewingProject(null)}>Закрыть</Button>
                    <Button className="flex-1" onClick={() => { setEditingProject(viewingProject); setShowProjectModal(true); setViewingProject(null); }}>Редактировать</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-[#111827]/50 border-[#1E293B]">
          <p className="text-[#64748B] text-xs font-bold uppercase mb-4">Пополнения вручную</p>
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-bold text-white">12 Ожидают</h4>
            <div className="flex gap-2">
              <Button size="sm" className="h-8 px-3 text-[10px] bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white border-0">Одобрить все</Button>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-[#111827]/50 border-[#1E293B]">
          <p className="text-[#64748B] text-xs font-bold uppercase mb-4">Тикеты поддержки</p>
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-bold text-white">4 Открыто</h4>
            <Button variant="outline" size="sm" className="h-8 px-3 text-[10px]">Входящие</Button>
          </div>
        </Card>
        <Card className="p-6 bg-[#111827]/50 border-[#1E293B]">
          <p className="text-[#64748B] text-xs font-bold uppercase mb-4">Активы платформы (AUM)</p>
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-bold text-[#38BDF8]">$1,240,500</h4>
            <div className="text-emerald-500 flex items-center gap-1 text-xs font-bold">
              <ArrowUpRight className="w-3 h-3" /> 4.2%
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
