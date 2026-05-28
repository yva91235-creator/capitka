import { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Wallet, Users, ShieldCheck, 
  MessageSquare, LogOut, TrendingUp, ShieldAlert, Menu, X, User, GraduationCap
} from 'lucide-react';
import { cn } from './ui';
import { useAuthStore } from '../store/authStore';
import { useLangStore } from '../store/langStore';

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { lang, setLang, t } = useLangStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' },
    { icon: Briefcase, label: t('projects'), path: '/projects' },
    { icon: Wallet, label: t('wallet'), path: '/wallet' },
    { icon: Users, label: t('referrals'), path: '/referrals' },
    { icon: ShieldCheck, label: t('kyc'), path: '/kyc' },
    { icon: GraduationCap, label: t('academyTitle'), path: '/academy' },
    { icon: MessageSquare, label: t('support'), path: '/support' },
    { icon: User, label: t('profile'), path: '/profile' },
  ];

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const closeSidebar = useCallback(() => setIsOpen(false), []);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#38BDF8] to-[#818CF8] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-[#94A3B8] bg-clip-text text-transparent">
            CapitalFlow
          </span>
        </div>
        <button className="lg:hidden text-[#94A3B8] p-1 hover:text-white" onClick={closeSidebar}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive ? 'bg-[#1E293B] text-[#38BDF8] shadow-lg' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9]'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink to="/admin" onClick={closeSidebar}
            className={({ isActive }) =>
              cn('flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group mt-6',
                isActive ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-red-400/70 hover:bg-red-500/10 hover:text-red-400')
            }
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="font-medium text-sm">{t('adminPanel')}</span>
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-[#1E293B] space-y-3 bg-[#0F111A]">
        <div className="flex items-center gap-1 p-1 bg-[#1E293B]/50 rounded-xl border border-[#334155]">
          <button onClick={() => setLang('ru')}
            className={cn("flex-1 text-xs font-bold py-2 rounded-lg transition-all", lang === 'ru' ? "bg-[#38BDF8] text-white shadow-sm" : "text-[#64748B] hover:text-white")}
          >РУС</button>
          <button onClick={() => setLang('en')}
            className={cn("flex-1 text-xs font-bold py-2 rounded-lg transition-all", lang === 'en' ? "bg-[#38BDF8] text-white shadow-sm" : "text-[#64748B] hover:text-white")}
          >ENG</button>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#94A3B8] hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">{t('logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0F111A]/95 backdrop-blur-md border-b border-[#1E293B] flex items-center justify-between px-6 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#38BDF8] to-[#818CF8] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-white tracking-tight">CapitalFlow</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="text-[#94A3B8] p-2 hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[70] animate-in fade-in duration-300" onClick={closeSidebar} />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-[280px] bg-[#0F111A] border-r border-[#1E293B] z-[80] transition-transform duration-300 ease-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full shadow-none"
      )}>
        <SidebarContent />
      </aside>
    </>
  );
};
