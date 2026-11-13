import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Menu, X, Download, Share } from 'lucide-react';
import { useEffect, useState } from 'react';

type InstallPromptEvent = Event & {
 prompt: () => Promise<void>;
 userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function Header() {
 const {t}=useTranslation();
 const [mobileOpen,setMobileOpen]=useState(false);
 const [installPrompt,setInstallPrompt]=useState<InstallPromptEvent|null>(null);
 const [installHelp,setInstallHelp]=useState(false);
 const [installInstructions,setInstallInstructions]=useState('desktop');

 useEffect(()=>{
  const userAgent=navigator.userAgent;
  const isAppleMobile=/iPhone|iPad|iPod/i.test(userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const isAndroid=/Android/i.test(userAgent);
  const isMac=/Macintosh|Mac OS X/i.test(userAgent);
  setInstallInstructions(isAppleMobile?'apple-mobile':isAndroid?'android':isMac?'mac':'desktop');
  const onBeforeInstall=(event:Event)=>{event.preventDefault();setInstallPrompt(event as InstallPromptEvent);};
  window.addEventListener('beforeinstallprompt',onBeforeInstall);
  return ()=>window.removeEventListener('beforeinstallprompt',onBeforeInstall);
 },[]);

 const handleInstall=async()=>{
  if(installPrompt){setInstallHelp(false);await installPrompt.prompt();setInstallPrompt(null);return;}
  setInstallHelp(open=>!open);
 };
 const closeMenu=()=>setMobileOpen(false);

 return <header className="sticky top-0 z-40 border-b border-gray-200/90 bg-white/95 backdrop-blur">
  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
   <div className="flex min-h-[4.5rem] items-center justify-between gap-3">
    <Link to="/" aria-label="Mela home" className="flex min-w-0 shrink-0 items-center gap-2.5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173b35] shadow-sm"><img src="/favicon.svg" alt="" className="h-full w-full rounded-lg"/></span><span className="text-2xl font-bold tracking-tight text-gray-900">Mela</span></Link>
    <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex"><Link to="/register?type=customer" className="text-sm font-medium text-gray-600 hover:text-primary-600">{t('nav.services')}</Link><Link to="/register?type=professional" className="text-sm font-medium text-gray-600 hover:text-primary-600">{t('nav.findProfessionals')}</Link></nav>
    <div className="flex min-w-0 shrink-0 items-center gap-2">
     <div className="hidden sm:block"><LanguageSwitcher/></div>
     <Link to="/login" className="hidden px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 sm:inline-flex">{t('auth.login')}</Link>
     <Link to="/register" className="hidden min-h-10 items-center justify-center whitespace-nowrap rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 sm:inline-flex">{t('auth.register')}</Link>
     <button type="button" aria-label={mobileOpen?'Close navigation':'Open navigation'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#173b35] shadow-sm transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600 md:hidden" onClick={()=>setMobileOpen(v=>!v)}>{mobileOpen?<X className="h-6 w-6"/>:<Menu className="h-6 w-6"/>}</button>
    </div>
   </div>
  </div>
  {installHelp&&<div id="mela-install-help" role="region" aria-label="Install Mela instructions" className="border-t border-[#dce7df] bg-[#f5f8f5] px-4 py-4 text-sm text-[#315448]"><div className="mx-auto max-w-3xl"><div className="flex items-center justify-between gap-3"><p className="font-semibold text-[#173b35]">Add Mela to your device</p><button type="button" onClick={()=>setInstallHelp(false)} aria-label="Close installation instructions" className="rounded-full p-1 hover:bg-[#e5eee8]"><X className="h-4 w-4"/></button></div>
   {installInstructions==='apple-mobile'&&<div className="mt-2 space-y-1"><p>On iPhone or iPad:</p><ol className="list-decimal space-y-1 pl-5"><li>Open Mela in Safari.</li><li>Tap the Share icon <Share className="inline h-4 w-4"/>.</li><li>Choose <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.</li></ol></div>}
   {installInstructions==='android'&&<div className="mt-2 space-y-1"><p>On Android:</p><ol className="list-decimal space-y-1 pl-5"><li>Open Mela in Chrome.</li><li>Tap the browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li></ol></div>}
   {installInstructions!=='apple-mobile'&&installInstructions!=='android'&&<div className="mt-2 space-y-1"><p>Open Mela in Chrome or Edge and choose <strong>Install Mela</strong> from the browser menu or address bar.</p></div>}
   <p className="mt-3 text-xs text-[#587267]">Installation requires the published Mela website to use HTTPS.</p></div></div>}
  {mobileOpen&&<nav id="mobile-navigation" aria-label="Mobile navigation" className="space-y-1 border-t border-gray-200 bg-white px-4 py-4 shadow-lg md:hidden">
   <div className="mb-3 flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Menu</span><LanguageSwitcher/></div>
   <Link to="/register?type=customer" onClick={closeMenu} className="block rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">{t('nav.services')}</Link>
   <Link to="/register?type=professional" onClick={closeMenu} className="block rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">{t('nav.findProfessionals')}</Link>
   <Link to="/login" onClick={closeMenu} className="block rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">{t('auth.login')}</Link>
   <Link to="/register" onClick={closeMenu} className="mt-2 block rounded-xl bg-primary-700 px-4 py-3 text-center text-sm font-semibold text-white">{t('auth.register')}</Link>
   <button type="button" onClick={()=>{handleInstall();closeMenu();}} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"><Download className="h-4 w-4"/>Install Mela</button>
  </nav>}
 </header>;
}
