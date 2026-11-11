import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { login } from '@/lib/auth';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(email, password);
      const destination = user.role === 'Organization' ? '/organization'
        : user.role === 'Professional' ? '/professional'
        : user.role === 'Admin' ? '/admin' : '/customer';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-screen min-h-screen flex flex-col">
      <div className="flex justify-end p-4"><LanguageSwitcher /></div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 text-white">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xl"><img src="/favicon.svg" alt="" className="w-full h-full rounded-lg" /></div>
              <span className="font-bold text-2xl">{t('common.appName')}</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">{t('auth.login')}</h1>
          </div>
          <p className="text-center text-sm text-white/90 mb-5">One simple place to find home services, manage bookings, and keep every project moving.</p>
          <div className="grid grid-cols-3 gap-2 mb-5 text-center text-xs text-white/95">
            <div className="rounded-xl border border-white/25 bg-white/10 px-2 py-3 backdrop-blur-sm"><span className="block text-lg mb-1">⌂</span>Home care</div>
            <div className="rounded-xl border border-white/25 bg-white/10 px-2 py-3 backdrop-blur-sm"><span className="block text-lg mb-1">✓</span>Pro profiles</div>
            <div className="rounded-xl border border-white/25 bg-white/10 px-2 py-3 backdrop-blur-sm"><span className="block text-lg mb-1">↗</span>Job updates</div>
          </div>
          <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/70 p-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.email')}</label>
              <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.password')}</label>
              <input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-lg p-3">{error}</p>}
            <button type="submit" disabled={busy} className="w-full py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60">
              {busy ? 'Signing in…' : t('auth.login')}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            {t('auth.noAccount')} <Link to="/register" className="text-primary-600 font-medium hover:underline">{t('auth.register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
