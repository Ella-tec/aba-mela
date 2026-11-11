import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Menu, X, Download, Check } from 'lucide-react';
import { useEffect, useState } from 'react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function Header() {
 const {t}=useTranslation();
 const [mobileOpen,setMobileOpen]=useState(false);
 const [installPrompt,setInstallPrompt]=useState<InstallPromptEvent|null>(null);
 const [installed,setInstalled]=useState(false);
 const [installHelp,setInstallHelp]=useState(false);

 useEffect(()=>{
  const standalone = window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as Navigator & {standalone?:boolean}).standalone);
  setInstalled(standalone);
  const onBeforeInstall=(event:Event)=>{
   event.preventDefault();
   setInstallPrompt(event as InstallPromptEvent);
  };
  const onInstalled=()=>{setInstalled(true);setInstallPrompt(null);setInstallHelp(false);};
  window.addEventListener('beforeinstallprompt',onBeforeInstall);
  window.addEventListener('appinstalled',onInstalled);
  return ()=>{
   window.removeEventListener('beforeinstallprompt',onBeforeInstall);
   window.removeEventListener('appinstalled',onInstalled);
  };
 },[]);

 const handleInstall=async()=>{
  setInstallHelp(false);
  if(!installPrompt){setInstallHelp(true);return;}
  await installPrompt.prompt();
  const choice=await installPrompt.userChoice;
  if(choice.outcome==='accepted')setInstalled(true);
  setInstallPrompt(null);
 };

 return <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex h-16 items-center justify-between gap-3">
   <Link to="/" aria-label="Mela home" className="flex shrink-0 items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173b35] shadow-sm"><img src="/favicon.svg" alt="" className="h-full w-full rounded-lg"/></span><span className="text-xl font-bold text-gray-900">{t('common.appName')}</span></Link>
   <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex"><Link to="/#services" className="text-sm font-medium text-gray-600 hover:text-primary-600">{t('nav.services')}</Link><Link to="/register?type=professional" className="text-sm font-medium text-gray-600 hover:text-primary-600">{t('nav.findProfessionals')}</Link><Link to="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary-600">{t('home.howItWorks')}</Link></nav>
   <div className="flex shrink-0 items-center gap-2 sm:gap-3">
    {!installed&&<button type="button" onClick={handleInstall} className="inline-flex items-center gap-1.5 rounded-full border border-[#cbd9d2] bg-[#f3f7f4] px-3 py-2 text-xs font-semibold text-[#173b35] shadow-sm transition hover:border-[#173b35] hover:bg-[#e8f0eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173b35] sm:px-3.5 sm:text-sm"><Download className="h-4 w-4"/><span>Install Mela</span></button>}
    {installed&&<span className="inline-flex items-center gap-1 text-xs font-medium text-[#24734f]"><Check className="h-4 w-4"/>Installed</span>}
    <LanguageSwitcher/><Link to="/login" className="hidden px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 sm:inline-flex">{t('auth.login')}</Link><Link to="/register" className="inline-flex items-center rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 sm:px-4">{t('auth.register')}</Link><button type="button" aria-label={mobileOpen?'Close navigation':'Open navigation'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="rounded-lg p-2 focus-visible:ring-2 focus-visible:ring-primary-600 md:hidden" onClick={()=>setMobileOpen(v=>!v)}>{mobileOpen?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button>
   </div>
  </div></div>
  {installHelp&&!installed&&<div role="status" className="border-t border-[#dce7df] bg-[#f5f8f5] px-4 py-2 text-center text-xs text-[#315448] sm:text-sm">To install Mela, open your browser menu and choose <strong>Install Mela</strong> or <strong>Install page as app</strong>. If that option is missing, check that you are using Chrome or Edge and open Mela over localhost or HTTPS.</div>}
  {mobileOpen&&<nav id="mobile-navigation" aria-label="Mobile navigation" className="space-y-2 border-t border-gray-200 bg-white px-4 py-3 md:hidden"><Link to="/#services" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('nav.services')}</Link><Link to="/register?type=professional" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('nav.findProfessionals')}</Link><Link to="/#how-it-works" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('home.howItWorks')}</Link><Link to="/login" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('auth.login')}</Link></nav>}
 </header>;
}
