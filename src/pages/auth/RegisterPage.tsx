import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { User, Wrench, Building2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type AccountType = 'customer' | 'professional' | 'organization';

export function RegisterPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [accountType, setAccountType] = useState<AccountType | null>(
    (searchParams.get('type') as AccountType) || null
  );

  const types = [
    {
      id: 'customer' as const,
      icon: User,
      title: t('auth.customer'),
      desc: 'Book services, track jobs, manage properties',
    },
    {
      id: 'professional' as const,
      icon: Wrench,
      title: t('auth.professional'),
      desc: 'Find jobs, manage earnings, build reputation',
    },
    {
      id: 'organization' as const,
      icon: Building2,
      title: t('auth.organization'),
      desc: 'Manage teams, projects, and business operations',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex justify-end p-4">
        <LanguageSwitcher />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <span className="font-bold text-2xl">{t('common.appName')}</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t('auth.register')}</h1>
          </div>

          {!accountType ? (
            <div className="space-y-3">
              <p className="text-center text-gray-600 mb-4">{t('auth.selectAccountType')}</p>
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setAccountType(type.id)}
                  className="w-full flex items-start gap-4 p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-primary-400 hover:bg-primary-50/50 transition-all text-start"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <type.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{type.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{type.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                  {types.find((t) => t.id === accountType)?.title}
                </span>
                <button
                  type="button"
                  onClick={() => setAccountType(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {t('common.back')}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('auth.phone')}
                </label>
                <input
                  type="tel"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+251..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('auth.password')}
                </label>
                <input
                  type="password"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  type="password"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
              >
                {t('auth.register')}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
