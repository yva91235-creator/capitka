import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  PieChart, 
  Clock,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Activity,
  Newspaper,
  Globe,
  Cpu,
  Coins,
  Bell,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useAuthStore } from '../store/authStore';
import { useLangStore } from '../store/langStore';
import { Card, Button, cn } from '../components/ui';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const StatCard = ({ label, value, subtext, icon: Icon, color }: any) => (
  <Card className="flex flex-col gap-4 p-6">
    <div className="flex items-center justify-between">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg", color)}>
        <Icon className="text-white w-6 h-6" />
      </div>
      <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
        <ArrowUpRight className="w-4 h-4" />
        +12.5%
      </div>
    </div>
    <div>
      <p className="text-[#94A3B8] text-sm font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-black text-[#F1F5F9]">{value}</h3>
      <p className="text-[10px] text-[#64748B] mt-1 font-bold uppercase tracking-wider">{subtext}</p>
    </div>
  </Card>
);

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { t, lang } = useLangStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#F1F5F9] tracking-tighter italic uppercase">{t('dashboard')}</h1>
          <p className="text-[#94A3B8]">{t('welcomeBack')}, {user?.full_name || 'Investor'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/wallet', { state: { tab: 'history' } })}
            className="flex-1 lg:flex-none border-white/5 hover:border-[#38BDF8]/50"
          >
            <Clock className="w-4 h-4 mr-2" /> {t('history')}
          </Button>
          <Button 
            size="sm" 
            onClick={() => navigate('/wallet', { state: { tab: 'deposit' } })}
            className="flex-1 lg:flex-none shadow-blue-500/20"
          >
            <Wallet className="w-4 h-4 mr-2" /> {t('deposit')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label={t('balance')} 
          value={`€${user?.balance?.toLocaleString() || '0.00'}`}
          subtext="≈ 0.0000 BTC"
          icon={Wallet}
          color="bg-gradient-to-br from-[#38BDF8] to-[#2563EB]"
        />
        <StatCard 
          label={t('totalInvested')} 
          value="€12,450.00"
          subtext="8 активных"
          icon={TrendingUp}
          color="bg-gradient-to-br from-[#818CF8] to-[#4F46E5]"
        />
        <StatCard 
          label={t('totalProfit')} 
          value="€2,140.25"
          subtext="ROI: +18.4%"
          icon={PieChart}
          color="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard 
          label={t('pendingRewards')} 
          value="€45.10"
          subtext="через 2 дня"
          icon={Clock}
          color="bg-gradient-to-br from-orange-500 to-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-[#F1F5F9]">Эффективность инвестиций</h3>
              <p className="text-sm text-[#94A3B8]">Обзор ежемесячной доходности</p>
            </div>
            <select className="bg-[#1E293B] border border-[#334155] rounded-lg text-sm px-3 py-1 text-[#94A3B8] outline-none focus:border-[#38BDF8]">
              <option>Последние 6 месяцев</option>
              <option>За год</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#F1F5F9'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#38BDF8" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#F1F5F9]">Последние действия</h3>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">Все</Button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  i % 2 === 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                )}>
                  {i % 2 === 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F1F5F9] truncate">
                    {i % 2 === 0 ? 'Получены дивиденды' : 'Инвестиция: Тех Фонд'}
                  </p>
                  <p className="text-xs text-[#94A3B8]">2 часа назад</p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-bold",
                    i % 2 === 0 ? "text-emerald-500" : "text-[#F1F5F9]"
                  )}>
                    {i % 2 === 0 ? '+' : '-'}${ (Math.random() * 1000).toFixed(2) }
                  </p>
                  <p className="text-[10px] text-[#64748B]">Завершено</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <div className="bg-[#1E293B]/50 rounded-2xl p-4 border border-[#334155]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#94A3B8]">Безопасность</span>
                <span className="text-xs font-medium text-emerald-500">Высокая</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="h-1 flex-1 bg-emerald-500 rounded-full" />
                ))}
              </div>
              <p className="text-[10px] text-[#64748B] mt-3">
                Ваш аккаунт защищен 2FA и верификацией личности.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Featured Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { title: 'Текстильный комбинат "Север"', target: '€5,000,000', roi: '16.5%', progress: '24%', color: '#38BDF8', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d' },
          { title: 'Завод "Эко-Пак"', target: '€3,000,000', roi: '14.2%', progress: '45%', color: '#10B981', img: 'https://images.unsplash.com/photo-1530646176562-d8a3655dfaff' },
          { title: 'АгроТех Кластер', target: '€2,000,000', roi: '12.0%', progress: '65%', color: '#818CF8', img: 'https://images.unsplash.com/photo-1560221328-12fe60f83ab8' }
        ].map((project, i) => (
          <motion.div key={i} whileHover={{ y: -5 }}>
            <Card className="p-0 overflow-hidden group border-white/5 hover:border-[#38BDF8]/30 transition-all">
              <div className="h-48 bg-[#1E293B] relative overflow-hidden">
                <img 
                  src={`${project.img}?auto=format&fit=crop&q=80&w=800`} 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                  alt={project.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C15] to-transparent" />
                
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-xl overflow-hidden bg-[#1E293B]">
                    <img src={`https://i.pravatar.cc/100?u=${project.title}`} className="w-full h-full object-cover" alt="Avatar" />
                  </div>
                  <div className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
                    <p className="text-[10px] text-white font-bold uppercase tracking-wider">Top Founder</p>
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                  <div className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 uppercase">{project.roi} ROI</div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-bold text-[#F1F5F9] mb-4 truncate">{project.title}</h4>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#94A3B8]">Цель: {project.target}</span>
                  <span className="text-[#38BDF8] font-bold">{project.progress}</span>
                </div>
                <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8] transition-all duration-1000" style={{ width: project.progress }} />
                </div>
                <Button variant="outline" size="sm" className="w-full h-10 text-xs" onClick={() => navigate('/projects')}>Подробнее <ExternalLink className="w-3.5 h-3.5 ml-2" /></Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 border-[#38BDF8]/20 bg-gradient-to-br from-[#111827] to-[#1E293B]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="text-[#38BDF8]" /> AI Прогноз прибыли</h3>
              <p className="text-sm text-[#94A3B8]">Прогноз доходности вашего портфеля на 12 месяцев</p>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="aiColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} />
                <YAxis stroke="#475569" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0F111A', border: '1px solid #334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fill="url(#aiColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 border-[#818CF8]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><ShieldCheck size={160} /></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#38BDF8] text-black text-[10px] font-black rounded-full uppercase">VIP CLUB</span>
              <span className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest">Уровень: {user?.loyalty_tier || 'Bronze'}</span>
            </div>
            <h3 className="text-3xl font-black text-white mb-6">Программа лояльности</h3>
            <div className="space-y-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#94A3B8]">Прогресс до Silver</span>
                <span className="text-white font-bold">€1,250 / €5,000</span>
              </div>
              <div className="w-full h-3 bg-[#0F111A] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#C084FC] w-[25%]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-[#64748B] uppercase font-bold mb-1">Комиссия на вывод</p>
                  <p className="text-lg font-bold text-[#38BDF8]">-50%</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-[#64748B] uppercase font-bold mb-1">Реф. бонус</p>
                  <p className="text-lg font-bold text-emerald-400">+2%</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Enterprise Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { icon: Terminal, label: 'API Access', desc: 'Интеграция сторонних систем' },
          { icon: Activity, label: 'Risk Heatmap', desc: 'Карта рисков портфеля' },
          { icon: Newspaper, label: 'Market News', desc: 'Лента отраслевых новостей' },
          { icon: Globe, label: 'Regional Stats', desc: 'Статистика по регионам' },
          { icon: Cpu, label: 'Compute Pool', desc: 'Участие в пуле вычислений' },
          { icon: Coins, label: 'Auto-Staking', desc: 'Авто-стейкинг CapitalFlow' },
          { icon: Bell, label: 'Smart Alerts', desc: 'Умные уведомления о ROI' },
          { icon: FileText, label: 'Tax Reports', desc: 'Автоматическая налоговая отчетность' },
        ].map((feat, i) => (
          <Card key={i} className="p-4 border-white/5 hover:border-white/20 transition-all flex flex-col gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#38BDF8]">
              <feat.icon size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{feat.label}</p>
              <p className="text-[9px] text-[#64748B] mt-0.5">{feat.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
