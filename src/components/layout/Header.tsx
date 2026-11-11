import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Menu, X, Download, Check, Share } from 'lucide-react';
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
 const [installInstructions,setInstallInstructions]=useState('desktop');

 useEffect(()=>{
  const standalone = window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as Navigator & {standalone?:boolean}).standalone);
  setInstalled(standalone);

  const userAgent = navigator.userAgent;
  const isAppleMobile = /iPhone|iPad|iPod/i.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(userAgent);
  const isMac = /Macintosh|Mac OS X/i.test(userAgent);
  setInstallInstructions(isAppleMobile ? 'apple-mobile' : isAndroid ? 'android' : isMac ? 'mac' : 'desktop');

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
  if(installPrompt){
   setInstallHelp(false);
   await installPrompt.prompt();
   const choice=await installPrompt.userChoice;
   if(choice.outcome==='accepted')setInstalled(true);
   setInstallPrompt(null);
   return;
  }
  setInstallHelp((open)=>!open);
 };

 return <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex h-16 items-center justify-between gap-3">
   <Link to="/" aria-label="Mela home" className="flex shrink-0 items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173b35] shadow-sm"><img src="/favicon.svg" alt="" className="h-full w-full rounded-lg"/></span><span className="text-xl font-bold text-gray-900">{t('common.appName')}</span></Link>
   <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex"><Link to="/#services" className="text-sm font-medium text-gray-600 hover:text-primary-600">{t('nav.services')}</Link><Link to="/register?type=professional" className="text-sm font-medium text-gray-600 hover:text-primary-600">{t('nav.findProfessionals')}</Link><Link to="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary-600">{t('home.howItWorks')}</Link></nav>
   <div className="flex shrink-0 items-center gap-2 sm:gap-3">
    {!installed&&<button type="button" onClick={handleInstall} aria-expanded={installHelp} aria-controls="mela-install-help" className="inline-flex items-center gap-1.5 rounded-full border border-[#cbd9d2] bg-[#f3f7f4] px-3 py-2 text-xs font-semibold text-[#173b35] shadow-sm transition hover:border-[#173b35] hover:bg-[#e8f0eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173b35] sm:px-3.5 sm:text-sm"><Download className="h-4 w-4"/><span>Install Mela</span></button>}
    {installed&&<span className="inline-flex items-center gap-1 text-xs font-medium text-[#24734f]"><Check className="h-4 w-4"/>Installed</span>}
    <LanguageSwitcher/><Link to="/login" className="hidden px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 sm:inline-flex">{t('auth.login')}</Link><Link to="/register" className="inline-flex items-center rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 sm:px-4">{t('auth.register')}</Link><button type="button" aria-label={mobileOpen?'Close navigation':'Open navigation'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="rounded-lg p-2 focus-visible:ring-2 focus-visible:ring-primary-600 md:hidden" onClick={()=>setMobileOpen(v=>!v)}>{mobileOpen?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button>
   </div>
  </div></div>
  {installHelp&&!installed&&<div id="mela-install-help" role="region" aria-label="Install Mela instructions" className="border-t border-[#dce7df] bg-[#f5f8f5] px-4 py-4 text-sm text-[#315448]">
   <div className="mx-auto max-w-3xl">
    <div className="flex items-center justify-between gap-3"><p className="font-semibold text-[#173b35]">Add Mela to your device</p><button type="button" onClick={()=>setInstallHelp(false)} aria-label="Close installation instructions" className="rounded-full p-1 hover:bg-[#e5eee8]"><X className="h-4 w-4"/></button></div>
    {installInstructions==='apple-mobile'&&<div className="mt-2 space-y-1"><p>On iPhone or iPad:</p><ol className="list-decimal space-y-1 pl-5"><li>Open Mela in Safari (or a supported browser on iOS 16.4 or later).</li><li>Tap the <strong>Share</strong> icon <Share className="inline h-4 w-4"/>.</li><li>Choose <strong>Add to Home Screen</strong>.</li><li>Turn on <strong>Open as Web App</strong> if shown, then tap <strong>Add</strong>.</li></ol></div>}
    {installInstructions==='android'&&<div className="mt-2 space-y-1"><p>On Android:</p><ol className="list-decimal space-y-1 pl-5"><li>Open Mela in Chrome.</li><li>Tap the browser menu (three dots).</li><li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>, then confirm.</li></ol></div>}
    {installInstructions==='mac'&&<div className="mt-2 space-y-1"><p>On a Mac:</p><ol className="list-decimal space-y-1 pl-5"><li>In Chrome or Edge, select the install icon in the address bar or choose <strong>Install Mela</strong> from the browser menu.</li><li>In Safari 17 or later on macOS Sonoma or later, choose <strong>File → Add to Dock</strong>.</li></ol></div>}
    {installInstructions==='desktop'&&<div className="mt-2 space-y-1"><p>On Windows, ChromeOS or Linux:</p><ol className="list-decimal space-y-1 pl-5"><li>Open Mela in Chrome or Microsoft Edge.</li><li>Select the install icon in the address bar, or open the browser menu.</li><li>Choose <strong>Install Mela</strong> or <strong>Apps → Install this site as an app</strong>, then confirm.</li></ol><p className="pt-1 text-xs">If your browser does not offer installation, Mela remains available as a responsive website in that browser.</p></div>}
    <p className="mt-3 text-xs text-[#587267]">Installation requires the published Mela website to use HTTPS. Your local development address works for testing on the same computer only.</p>
   </div>
  </div>}
  {mobileOpen&&<nav id="mobile-navigation" aria-label="Mobile navigation" className="space-y-2 border-t border-gray-200 bg-white px-4 py-3 md:hidden"><Link to="/#services" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('nav.services')}</Link><Link to="/register?type=professional" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('nav.findProfessionals')}</Link><Link to="/#how-it-works" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('home.howItWorks')}</Link><Link to="/login" onClick={()=>setMobileOpen(false)} className="block py-2 text-sm font-medium">{t('auth.login')}</Link></nav>}
 </header>;
}
