import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Menu, X, Download, Share, Globe2, LogIn, UserPlus, Wrench, BriefcaseBusiness } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type InstallPromptEvent = Event & {
 prompt: () => Promise<void>;
 userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function Header() {
 const {t}=useTranslation();
 const [mobileOpen,setMobileOpen]=useState(false);
 const menuButtonRef=useRef<HTMLButtonElement>(null);
 const menuRef=useRef<HTMLElement>(null);
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
 useEffect(()=>{
  if(!mobileOpen)return;
  const handlePointerDown=(event:PointerEvent)=>{
   const target=event.target as Node;
   if(!menuRef.current?.contains(target)&&!menuButtonRef.current?.contains(target))closeMenu();
  };
  const handleKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')closeMenu();};
  document.addEventListener('pointerdown',handlePointerDown);
  document.addEventListener('keydown',handleKeyDown);
  return ()=>{document.removeEventListener('pointerdown',handlePointerDown);document.removeEventListener('keydown',handleKeyDown)};
 },[mobileOpen]);

 return <header className="sticky top-0 z-50 border-b border-[#e7ece8] bg-white/95 backdrop-blur-xl">
  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
   <div className="flex min-h-[4.5rem] items-center justify-start gap-3">
    <button ref={menuButtonRef} type="button" aria-label={mobileOpen?'Close Mela menu':'Open Mela menu'} aria-expanded={mobileOpen} aria-controls="mela-main-menu" onClick={()=>setMobileOpen(v=>!v)} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#dfe8e1] bg-[#f7faf7] text-[#173b35] shadow-sm transition hover:border-[#b8cbbd] hover:bg-[#edf4ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#477b65] focus-visible:ring-offset-2">{mobileOpen?<X className="h-6 w-6"/>:<Menu className="h-6 w-6"/>}</button>
    <Link to="/" aria-label="Mela home" onClick={closeMenu} className="flex min-w-0 items-center gap-2.5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173b35] shadow-sm"><img src="/favicon.svg" alt="" className="h-full w-full rounded-lg"/></span><span className="text-2xl font-bold tracking-tight text-gray-900">Mela</span></Link>
   </div>
  </div>
  {mobileOpen&&<><button type="button" aria-label="Close menu" onClick={closeMenu} className="fixed inset-0 z-40 cursor-default bg-slate-950/20 backdrop-blur-[2px]"/><nav ref={menuRef} id="mela-main-menu" aria-label="Mela main menu" className="absolute left-3 top-[calc(100%+0.65rem)] z-50 w-[min(21rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[#e1e9e2] bg-white p-3 shadow-[0_22px_70px_-24px_rgba(20,50,39,0.38)] sm:left-6">
   <div className="rounded-xl bg-gradient-to-br from-[#173b35] to-[#285b48] px-4 py-4 text-white"><div className="flex items-center gap-3"><img src="/favicon.svg" alt="" className="h-10 w-10 rounded-xl bg-white/10 p-1"/><div><p className="text-base font-bold">Welcome to Mela</p><p className="mt-0.5 text-xs text-white/75">Your local services, all in one place</p></div></div></div>
   <div className="mt-3 rounded-xl border border-[#edf0ed] p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500"><Globe2 className="h-4 w-4"/>Language</div><LanguageSwitcher/></div>
   <div className="mt-3 space-y-1">
    <Link to="/register?type=customer" onClick={closeMenu} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 transition hover:bg-[#f3f7f3] hover:text-[#173b35]"><Wrench className="h-5 w-5 text-[#477b65]"/>{t('nav.services')}</Link>
    <Link to="/register?type=professional" onClick={closeMenu} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 transition hover:bg-[#f3f7f3] hover:text-[#173b35]"><BriefcaseBusiness className="h-5 w-5 text-[#477b65]"/>{t('nav.findProfessionals')}</Link>
    <Link to="/login" onClick={closeMenu} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 transition hover:bg-[#f3f7f3] hover:text-[#173b35]"><LogIn className="h-5 w-5 text-[#477b65]"/>{t('auth.login')}</Link>
    <Link to="/register" onClick={closeMenu} className="flex items-center gap-3 rounded-xl bg-[#245141] px-3 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173b35]"><UserPlus className="h-5 w-5"/>{t('auth.register')}</Link>
    <button type="button" onClick={handleInstall} className="flex w-full items-center gap-3 rounded-xl border border-[#dfe8e1] px-3 py-3 text-left text-sm font-semibold text-[#245141] transition hover:bg-[#f3f7f3]"><Download className="h-5 w-5"/><span>Install Mela</span></button>
   </div>
  </nav></>}
  {installHelp&&<div id="mela-install-help" role="region" aria-label="Install Mela instructions" className="absolute left-3 top-[calc(100%+0.65rem)] z-[60] w-[min(21rem,calc(100vw-1.5rem))] rounded-2xl border border-[#dce7df] bg-[#f5f8f5] p-4 text-sm text-[#315448] shadow-xl sm:left-6"><div className="flex items-center justify-between gap-3"><p className="font-semibold text-[#173b35]">Add Mela to your device</p><button type="button" onClick={()=>setInstallHelp(false)} aria-label="Close installation instructions" className="rounded-full p-1 hover:bg-[#e5eee8]"><X className="h-4 w-4"/></button></div>
   {installInstructions==='apple-mobile'&&<div className="mt-2 space-y-1"><p>On iPhone or iPad:</p><ol className="list-decimal space-y-1 pl-5"><li>Open Mela in Safari.</li><li>Tap the Share icon <Share className="inline h-4 w-4"/>.</li><li>Choose <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.</li></ol></div>}
   {installInstructions==='android'&&<div className="mt-2 space-y-1"><p>On Android:</p><ol className="list-decimal space-y-1 pl-5"><li>Open Mela in Chrome.</li><li>Tap the browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li></ol></div>}
   {installInstructions!=='apple-mobile'&&installInstructions!=='android'&&<div className="mt-2 space-y-1"><p>Open Mela in Chrome or Edge and choose <strong>Install Mela</strong> from the browser menu or address bar.</p></div>}
   <p className="mt-3 text-xs text-[#587267]">Installation requires the published Mela website to use HTTPS.</p></div>}
 </header>;
}
