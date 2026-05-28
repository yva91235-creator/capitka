import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, cn } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { useLangStore } from '../store/langStore';
import { 
  ShieldCheck, 
  User, 
  FileText, 
  Camera, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/db';

export const KYC = () => {
  const { user, updateUser } = useAuthStore();
  const { lang } = useLangStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', birthDate: '', documentId: '',
    passportPhoto: null as File | null, selfiePhoto: null as File | null
  });

  const t = (ru: string, en: string) => lang === 'ru' ? ru : en;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const submissionId = Math.random().toString(36).substring(2, 15);
      await db.execute({
        sql: 'INSERT INTO kyc_submissions (id, user_id, document_type, document_url, selfie_url, status) VALUES (?, ?, ?, ?, ?, ?)',
        args: [submissionId, user.id, 'passport', 'mock_url', 'mock_url', 'pending']
      });
      await db.execute({ sql: 'UPDATE users SET kyc_status = ? WHERE id = ?', args: ['pending', user.id] });
      updateUser({ kyc_status: 'pending' });
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  if (user?.kyc_status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto">
            <Clock size={40} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white">{t('Верификация в процессе', 'Verification in Progress')}</h2>
          <p className="text-[#94A3B8] leading-relaxed">
            {t('Ваши документы проверяются. Обычно это занимает 12-24 часа.', 'Your documents are being reviewed. Usually takes 12-24 hours.')}
          </p>
          <div className="pt-6">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              {t('На главную', 'Go to Dashboard')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (user?.kyc_status === 'approved') {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="p-12 text-center space-y-6 border-emerald-500/30">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white">{t('Аккаунт подтвержден', 'Account Verified')}</h2>
          <p className="text-[#94A3B8] leading-relaxed">
            {t('Ваша личность подтверждена. Доступны все функции, включая вывод.', 'Identity confirmed. All features including withdrawals are unlocked.')}
          </p>
          <div className="pt-6">
            <Button onClick={() => navigate('/dashboard')}>{t('В дашборд', 'Go to Dashboard')}</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('Верификация личности', 'Identity Verification')}</h1>
        <p className="text-[#94A3B8]">{t('Пройдите KYC, чтобы разблокировать вывод средств', 'Complete KYC to unlock withdrawals')}</p>
      </div>
      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 h-2 rounded-full overflow-hidden bg-[#1E293B]">
            <motion.div initial={{ width: 0 }} animate={{ width: step >= s ? '100%' : '0%' }} className="h-full bg-[#38BDF8]" />
          </div>
        ))}
      </div>
      <Card className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center"><User size={24} /></div>
                <div><h3 className="text-lg font-bold text-white">{t('Личные данные', 'Personal Info')}</h3><p className="text-sm text-[#64748B]">{t('Как в паспорте', 'As shown on ID')}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label={t('Имя', 'First Name')} placeholder="John" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                <Input label={t('Фамилия', 'Last Name')} placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <Input label={t('Дата рождения', 'Date of Birth')} type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
              <Input label={t('Номер документа', 'Document ID')} placeholder="AB1234567" value={formData.documentId} onChange={(e) => setFormData({...formData, documentId: e.target.value})} />
              <div className="pt-6"><Button className="w-full h-12" onClick={handleNext} disabled={!formData.firstName || !formData.lastName}>{t('Далее', 'Next')} <ArrowRight className="ml-2 w-5 h-5" /></Button></div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center"><FileText size={24} /></div>
                <div><h3 className="text-lg font-bold text-white">{t('Фото документа', 'ID Photo')}</h3><p className="text-sm text-[#64748B]">{t('Загрузите фото паспорта', 'Upload passport photo')}</p></div>
              </div>
              <div className="border-2 border-dashed border-[#334155] rounded-3xl p-12 text-center space-y-4 hover:border-[#38BDF8]/50 transition-colors cursor-pointer relative">
                <div className="w-16 h-16 bg-[#1E293B] rounded-2xl flex items-center justify-center mx-auto text-[#64748B]"><Camera size={32} /></div>
                <p className="text-[#F1F5F9] font-bold">{t('Нажмите для загрузки', 'Click to upload')}</p>
                <input type="file" className="hidden" id="passport-upload" onChange={(e) => setFormData({...formData, passportPhoto: e.target.files?.[0] || null})} />
                <label htmlFor="passport-upload" className="absolute inset-0 cursor-pointer" />
              </div>
              {formData.passportPhoto && <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3 text-emerald-500 text-sm"><CheckCircle2 size={18} /> {formData.passportPhoto.name}</div>}
              <div className="flex gap-3 pt-6">
                <Button variant="outline" className="w-1/3" onClick={handleBack}><ArrowLeft className="mr-2 w-5 h-5" /> {t('Назад', 'Back')}</Button>
                <Button className="flex-1 h-12" onClick={handleNext} disabled={!formData.passportPhoto}>{t('Далее', 'Next')} <ArrowRight className="ml-2 w-5 h-5" /></Button>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center"><Camera size={24} /></div>
                <div><h3 className="text-lg font-bold text-white">{t('Селфи с документом', 'Selfie with ID')}</h3><p className="text-sm text-[#64748B]">{t('Фото лица с паспортом', 'Photo holding your ID')}</p></div>
              </div>
              <div className="border-2 border-dashed border-[#334155] rounded-3xl p-12 text-center space-y-4 hover:border-[#38BDF8]/50 transition-colors cursor-pointer relative">
                <div className="w-16 h-16 bg-[#1E293B] rounded-2xl flex items-center justify-center mx-auto text-[#64748B]"><Camera size={32} /></div>
                <p className="text-[#F1F5F9] font-bold">{t('Нажмите для загрузки', 'Click to upload')}</p>
                <input type="file" className="hidden" id="selfie-upload" onChange={(e) => setFormData({...formData, selfiePhoto: e.target.files?.[0] || null})} />
                <label htmlFor="selfie-upload" className="absolute inset-0 cursor-pointer" />
              </div>
              {formData.selfiePhoto && <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3 text-emerald-500 text-sm"><CheckCircle2 size={18} /> {formData.selfiePhoto.name}</div>}
              <div className="flex gap-3 pt-6">
                <Button variant="outline" className="w-1/3" onClick={handleBack}><ArrowLeft className="mr-2 w-5 h-5" /> {t('Назад', 'Back')}</Button>
                <Button className="flex-1 h-12" onClick={handleSubmit} isLoading={isLoading} disabled={!formData.selfiePhoto}>{t('Отправить на проверку', 'Submit for Review')}</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};
