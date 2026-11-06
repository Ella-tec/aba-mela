import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { User, Wrench, Building2 } from 'lucide-react';
import { register } from '@/lib/auth';

type AccountType = 'customer' | 'professional' | 'organization';
const roleMap = { customer: 'Customer', professional: 'Professional', organization: 'Organization' } as const;

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type');
  const [accountType, setAccountType] = useState<AccountType | null>(
    initialType === 'customer' || initialType === 'professional' || initialType === 'organization' ? initialType : null
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const types = [
    { id: 'customer' as const, icon: User, title: t('auth.customer'), desc: 'Book services, track jobs, manage properties' },
    { id: 'professional' as const, icon: Wrench, title: t('auth.professional'), desc: 'Find jobs, manage earnings, build reputation' },
    { id: 'organization' as const, icon: Building2, title: t('auth.organization'), desc: 'Manage teams, projects, and business operations' },
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 12) { setError('Use a password with at least 12 characters.'); return; }
    if (!accountType) return;
    setBusy(true);
    try {
      await register({ email, password, fullName, role: roleMap[accountType], phone: phone || undefined });
      navigate(accountType === 'organization' ? '/organization' : accountType === 'professional' ? '/professional' : '/customer', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create your account.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex justify-end p-4"><LanguageSwitcher /></div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xl">A</div>
              <span className="font-bold text-2xl">{t('common.appName')}</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t('auth.register')}</h1>
          </div>
          {!accountType ? (
            <div className="space-y-3">
              <p className="text-center text-gray-600 mb-4">{t('auth.selectAccountType')}</p>
              {types.map(type => (
                <button key={type.id} type="button" onClick={() => setAccountType(type.id)}
                  className="w-full flex items-start gap-4 p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-primary-400 hover:bg-primary-50/50 transition-all text-start">
                  <div className="w-11 h-11 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0"><type.icon className="w-5 h-5" /></div>
                  <div><div className="font-semibold text-gray-900">{type.title}</div><div className="text-sm text-gray-500 mt-0.5">{type.desc}</div></div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary-700 bg-primary-50 px-3 py-1 rounded-full">{types.find(type => type.id === accountType)?.title}</span>
                <button type="button" onClick={() => setAccountType(null)} className="text-sm text-gray-500 hover:text-gray-700">{t('common.back')}</button>
              </div>
              <div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <input id="fullName" required maxLength={120} autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
              <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.email')}</label>
                <input id="email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
              <div><label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.phone')}</label>
                <input id="phone" type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+251..." className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
              <div><label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.password')} (12+ characters)</label>
                <input id="password" type="password" required minLength={12} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
              <div><label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.confirmPassword')}</label>
                <input id="confirmPassword" type="password" required autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
              {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-lg p-3">{error}</p>}
              <button type="submit" disabled={busy} className="w-full py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60">{busy ? 'Creating account…' : t('auth.register')}</button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-gray-600">{t('auth.hasAccount')} <Link to="/login" className="text-primary-600 font-medium hover:underline">{t('auth.login')}</Link></p>
        </div>
      </div>
    </div>
  );
}
