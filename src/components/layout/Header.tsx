import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#173b35] flex items-center justify-center text-[#f4c66a] font-extrabold text-xl shadow-sm">M</div>
            <span className="font-bold text-xl text-gray-900">{t('common.appName')}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/services" className="text-sm font-medium text-gray-600 hover:text-primary-600">
              {t('nav.services')}
            </Link>
            <Link to="/professionals" className="text-sm font-medium text-gray-600 hover:text-primary-600">
              {t('nav.findProfessionals')}
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary-600">
              {t('home.howItWorks')}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="hidden sm:inline-flex text-sm font-medium text-gray-700 hover:text-primary-600 px-3 py-2"
            >
              {t('auth.login')}
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              {t('auth.register')}
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          <Link to="/services" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
            {t('nav.services')}
          </Link>
          <Link to="/professionals" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
            {t('nav.findProfessionals')}
          </Link>
          <Link to="/login" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
            {t('auth.login')}
          </Link>
        </div>
      )}
    </header>
  );
}
