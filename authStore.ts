import { Card } from '../components/ui';
import { useLangStore } from '../store/langStore';
import { Zap, Shield, BarChart4, Network, Fingerprint, Database, Smartphone, ArrowRight } from 'lucide-react';

export const Academy = () => {
  const { lang } = useLangStore();

  const FEATURES = [
    { 
      icon: Shield,
      title: { ru: "Расширенная аналитика", en: "Advanced Analytics" }, 
      desc: { ru: "Система глубокого анализа данных для прогнозирования доходности.", en: "Deep data analysis system for ROI forecasting." } 
    },
    { 
      icon: Zap,
      title: { ru: "Тепловая карта рисков", en: "Portfolio Risk Heatmap" }, 
      desc: { ru: "Визуализация рисков вашего портфеля на основе рыночных показателей.", en: "Visualize portfolio risks based on market indicators." } 
    },
    { 
      icon: BarChart4,
      title: { ru: "Синхронизация блокчейна", en: "Real-time Blockchain Sync" }, 
      desc: { ru: "Мгновенная синхронизация транзакций с сетями TON и Ethereum.", en: "Instant transaction sync with TON and Ethereum networks." } 
    },
    { 
      icon: Shield,
      title: { ru: "Авто-ребалансировка", en: "Auto-rebalancing Portfolio" }, 
      desc: { ru: "Автоматическое перераспределение активов для минимизации убытков.", en: "Automatic asset redistribution to minimize losses." } 
    },
    { 
      icon: Zap,
      title: { ru: "Аудит смарт-контрактов", en: "Smart Contract Auditing" }, 
      desc: { ru: "Автоматический аудит безопасности всех контрактов платформы.", en: "Automated security audit of all platform contracts." } 
    },
    { 
      icon: BarChart4,
      title: { ru: "ESG-рейтинг", en: "ESG Impact Scoring" }, 
      desc: { ru: "Оценка проектов по экологическим и социальным критериям.", en: "Project evaluation by environmental and social criteria." } 
    },
    { 
      icon: Shield,
      title: { ru: "AI-прогнозирование ROI", en: "AI ROI Forecasting" }, 
      desc: { ru: "Использование нейросетей для предсказания прибыли на 12 месяцев.", en: "Neural networks for 12-month profit prediction." } 
    },
    { 
      icon: Zap,
      title: { ru: "Anti-DDoS защита", en: "Anti-DDoS WAF Integration" }, 
      desc: { ru: "Защита от распределенных атак и фильтрация вредоносного трафика.", en: "Protection from distributed attacks and malicious traffic filtering." } 
    },
    { 
      icon: BarChart4,
      title: { ru: "Биометрическая сессия", en: "Biometric Session Lock" }, 
      desc: { ru: "Дополнительная защита сессии через биометрические данные.", en: "Additional session protection via biometric data." } 
    },
    { 
      icon: Shield,
      title: { ru: "Система голосования", en: "Voter Governance System" }, 
      desc: { ru: "Участие инвесторов в принятии ключевых решений.", en: "Investor participation in key decision making." } 
    },
    { 
      icon: Zap,
      title: { ru: "Налоговая отчетность", en: "Automated Tax Reporting" }, 
      desc: { ru: "Генерация отчетов для налоговых органов в один клик.", en: "One-click tax authority report generation." } 
    },
    { 
      icon: BarChart4,
      title: { ru: "3-уровневая рефералка", en: "3-Tier Referral System" }, 
      desc: { ru: "Многоуровневая партнерская программа с авто-начислениями.", en: "Multi-level referral program with auto-payouts." } 
    },
    { 
      icon: Shield,
      title: { ru: "Сквозное шифрование", en: "End-to-End Encryption" }, 
      desc: { ru: "Полное шифрование данных от клиента до сервера.", en: "Complete data encryption from client to server." } 
    },
    { 
      icon: Zap,
      title: { ru: "Институциональное хранение", en: "Institutional Grade Custody" }, 
      desc: { ru: "Хранение активов по стандартам институциональных фондов.", en: "Asset storage by institutional fund standards." } 
    },
    { 
      icon: BarChart4,
      title: { ru: "Академия CapitalFlow", en: "Educational Academy Modules" }, 
      desc: { ru: "Образовательные материалы для повышения финансовой грамотности.", en: "Educational materials for financial literacy." } 
    }
  ];

  const getIcon = (index: number) => {
    const icons = [Shield, Zap, BarChart4];
    const Icon = icons[index % 3];
    return <Icon size={20}/>;
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-8 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1.5 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-full text-[#38BDF8] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          {lang === 'ru' ? 'Ядро экосистемы' : 'Core Ecosystem'}
        </div>
        <h1 className="text-5xl font-black text-white italic tracking-tighter leading-none">
          CAPITALFLOW <span className="text-[#38BDF8]">{lang === 'ru' ? 'АКАДЕМИЯ' : 'ACADEMY'}</span>
        </h1>
        <p className="text-[#64748B] max-w-2xl mx-auto text-sm font-medium">
          {lang === 'ru' 
            ? 'Исследуйте технологии, которые стоят за самым мощным инвестиционным движком в индустрии.' 
            : 'Explore the technologies behind the most powerful investment engine in the industry.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => (
          <Card key={i} className="p-6 border-white/5 bg-[#111827]/40 backdrop-blur-xl flex flex-col gap-4 hover:border-[#38BDF8]/40 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#38BDF8]/5 rounded-bl-[100px] -mr-12 -mt-12 transition-transform group-hover:scale-150" />
            <div className="w-12 h-12 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#38BDF8] group-hover:bg-[#38BDF8] group-hover:text-white transition-all shadow-lg">
              {getIcon(i)}
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">
                {lang === 'ru' ? feature.title.ru : feature.title.en}
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {lang === 'ru' ? feature.desc.ru : feature.desc.en}
              </p>
            </div>
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 
                {lang === 'ru' ? 'СИСТЕМА АКТИВНА' : 'SYSTEM ACTIVE'}
              </span>
              <div className="text-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={14} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-12 border-[#38BDF8]/20 bg-gradient-to-r from-[#1E293B] to-[#0A0C15] relative overflow-hidden">
        <div className="absolute right-0 top-0 p-12 opacity-5"><Network size={200} /></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 italic">
            {lang === 'ru' ? 'Технологический суверенитет' : 'Technological Sovereignty'}
          </h2>
          <p className="text-[#94A3B8] leading-relaxed mb-8">
            {lang === 'ru'
              ? 'Платформа CapitalFlow построена на базе модульной микросервисной архитектуры. Мы используем собственные алгоритмы проверки ликвидности и распределения реферальных бонусов в реальном времени, обеспечивая защиту транзакций на уровне банковских стандартов.'
              : 'CapitalFlow platform is built on modular microservices architecture. We use proprietary algorithms for liquidity verification and real-time referral bonus distribution, ensuring transaction protection at banking standards.'}
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[#38BDF8] font-bold text-xs"><Fingerprint size={16}/> Biometric Core</div>
            <div className="flex items-center gap-2 text-[#818CF8] font-bold text-xs"><Database size={16}/> Sharded DB</div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs"><Smartphone size={16}/> Edge Ready</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
