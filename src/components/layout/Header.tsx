import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
 const {t}=useTranslation(); const [mobileOpen,setMobileOpen]=useState(false);
 return <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex h-16 items-center justify-between">
   <Link to="/" aria-label="Mela home" className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173b35] shadow-sm"><img src="/favicon.svg" alt="" className="h-full w-full rounded-lg"/></span><span className="text-xl font-bold text-gray-900">{t('common.appName')}</span></Link>
   <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex"><Link to="/#services" className="text-sm font-medium text-gray-600 hover:text-primary-600">{t('nav.services')}</Link><Link to="/register?type=professional" className="text-sm font-medium text-gray-600 hover:text-primary-600">{t('nav.findProfessionals')}</Link><Link to="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary-600">{t('home.howItWorks')}</Link></nav>
   <div className="flex items-center gap-3"><LanguageSwitcher/><Link to="/login" className="hidden px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 sm:inline-flex">{t('auth.login')}</Link><Link to="/register" className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">{t('auth.register')}</Link><button type="button" aria-label={mobileOpen?'Close navigation':'Open navigation'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="rounded-lg p-2 focus-visible:ring-2 focus-visible:ring-primary-600 md:hidden" onClick={()=>setMobileOpen(v=>!v)}>{mobileOpen?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button></div>
  </div></div>
  {mobileOpen&&<nav id="mobile-navigation" aria-label="Mobile navigation" className="space-y-2 border-t border-gray-200 bg-white px-4 py-3 md:hidden"><Link to="/#services" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('nav.services')}</Link><Link to="/register?type=professional" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('nav.findProfessionals')}</Link><Link to="/#how-it-works" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('home.howItWorks')}</Link><Link to="/login" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('auth.login')}</Link></nav>}
 </header>;
}