import { Link, useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { getAuth, logout } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { LayoutDashboard, Calendar, Briefcase, Wallet, Settings, LogOut, Menu, Wrench, Flame, ClipboardList, Search, HeadphonesIcon, Map, Radio, Home, Sparkles, MessageSquare, X, Building2, Trash2, ShieldCheck, Clock3, CloudSun, GraduationCap, MessagesSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type PortalType='customer'|'professional';
interface NavItem {to:string;labelKey:string;icon:React.ComponentType<{className?:string}>;label?:string}
const customerNav:NavItem[]=[
 {to:'/customer',labelKey:'nav.overview',label:'Overview',icon:LayoutDashboard},
 {to:'/customer/find-service',labelKey:'nav.findService',label:'Find a Service',icon:Search},
 {to:'/customer/smart-match',labelKey:'nav.findProfessionals',label:'Find Professionals',icon:Sparkles},
 {to:'/customer/bookings',labelKey:'nav.myBookings',label:'My Bookings',icon:ClipboardList},
 {to:'/customer/create-booking',labelKey:'nav.createBooking',label:'Create Booking',icon:Calendar},
 {to:'/customer/track',labelKey:'nav.liveMap',label:'Live Map',icon:Map},
 {to:'/customer/payments',labelKey:'nav.payments',label:'Payments',icon:Wallet},
 {to:'/customer/reviews',labelKey:'nav.reviews',label:'Reviews',icon:Wrench},
 {to:'/customer/support',labelKey:'nav.support',label:'Support',icon:HeadphonesIcon},
 {to:'/customer/connect',labelKey:'Mela Connect',label:'Mela Connect',icon:MessagesSquare},
 {to:'/customer/safety',labelKey:'nav.safety',label:'Safety Center',icon:ShieldCheck},
 {to:'/customer/learning',labelKey:'nav.learning',label:'Learning',icon:GraduationCap},
 {to:'/customer/home-passport',labelKey:'nav.home',label:'Home Passport',icon:Home},
 {to:'/customer/recycle-bin',labelKey:'Recycle Bin',label:'Recycle Bin',icon:Trash2},
 {to:'/customer/projects',labelKey:'My Projects',label:'My Projects',icon:Building2}
];
const professionalNav:NavItem[]=[
 {to:'/professional',labelKey:'nav.overview',label:'Overview',icon:LayoutDashboard},
 {to:'/professional/jobs',labelKey:'nav.availableJobs',label:'Available Jobs',icon:Briefcase},
 {to:'/professional/hot-jobs',labelKey:'nav.hotJobs',label:'Hot Jobs',icon:Flame},
 {to:'/professional/my-jobs',labelKey:'nav.myJobs',label:'My Jobs',icon:Wrench},
 {to:'/professional/map',labelKey:'nav.liveMap',label:'Live Map',icon:Map},
 {to:'/professional/dispatch',labelKey:'nav.dispatch',label:'Dispatch',icon:Radio},
 {to:'/professional/earnings',labelKey:'nav.earnings',label:'Earnings',icon:Wallet},
 {to:'/professional/business-center',labelKey:'nav.businessCenter',label:'Transaction Hub',icon:Building2},
 {to:'/professional/calendar',labelKey:'nav.calendar',label:'Calendar',icon:Calendar},
 {to:'/professional/connect',labelKey:'Mela Connect',label:'Mela Connect',icon:MessagesSquare},
 {to:'/professional/verification',labelKey:'nav.verification',label:'Verification',icon:ClipboardList},
 {to:'/professional/safety',labelKey:'nav.safety',label:'Safety Center',icon:ShieldCheck},
 {to:'/professional/learning',labelKey:'nav.learning',label:'Learning',icon:GraduationCap},
 {to:'/professional/reviews',labelKey:'nav.reviews',label:'Reviews',icon:Sparkles},
 {to:'/professional/recycle-bin',labelKey:'Recycle Bin',label:'Recycle Bin',icon:Trash2}
];

function LocalContext(){
 const [now,setNow]=useState(()=>new Date());
 const [weather,setWeather]=useState('Weather loading');
 useEffect(()=>{const timer=window.setInterval(()=>setNow(new Date()),1000);return()=>window.clearInterval(timer)},[]);
 useEffect(()=>{
  let active=true;
  const load=async()=>{try{const response=await fetch('https://api.open-meteo.com/v1/forecast?latitude=39.0997&longitude=-94.5786&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago');if(!response.ok)throw new Error('Weather unavailable');const data=await response.json();const current=data.current;const labels:Record<number,string>={0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Cloudy',45:'Fog',48:'Fog',51:'Drizzle',61:'Rain',63:'Rain',65:'Heavy rain',71:'Snow',80:'Showers',95:'Storms'};if(active)setWeather(`${Math.round(current.temperature_2m)}°F · ${labels[current.weather_code]||'Current conditions'}`)}catch{if(active)setWeather('Weather unavailable')}}
  void load();const timer=window.setInterval(()=>void load(),15*60*1000);return()=>{active=false;window.clearInterval(timer)}
 },[]);
 return <div className="hidden items-center gap-2 sm:flex"><div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600"><Clock3 className="h-3.5 w-3.5 text-emerald-700"/><time>{new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',hour:'numeric',minute:'2-digit'}).format(now)} <span className="text-slate-400">KC</span></time></div><div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600"><CloudSun className="h-3.5 w-3.5 text-amber-600"/><span>{weather}</span></div></div>
}

export function PortalLayout({type}:{type:PortalType}) {
 const {t}=useTranslation();const navigate=useNavigate();const location=useLocation();const[sidebarOpen,setSidebarOpen]=useState(false);const auth=getAuth();
 if(!auth)return <Navigate to="/login" replace/>;
 const expected=type==='customer'?'Customer':'Professional';
 if(auth.role!==expected&&auth.role!=='Admin')return <Navigate to={auth.role==='Organization'?'/organization':auth.role==='Professional'?'/professional':'/customer'} replace/>;
 const nav=type==='customer'?customerNav:professionalNav;const title=type==='customer'?'Customer space':'Technician workspace';
 return <div className="flex min-h-screen bg-[#f6f8f6] text-slate-800">
  <aside id="portal-sidebar" className={cn('fixed inset-y-0 start-0 z-30 w-64 border-e border-emerald-950/5 bg-white/95 shadow-[8px_0_35px_rgba(15,45,30,0.04)] backdrop-blur transition-transform duration-200 lg:static lg:translate-x-0',sidebarOpen?'translate-x-0':'-translate-x-full rtl:translate-x-full')}><div className="flex h-full flex-col">
   <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5"><img src="/favicon.svg" alt="" className="h-8 w-8 rounded-xl"/><div><span className="block text-lg font-bold tracking-tight text-slate-900">{t('common.appName')}</span><span className="block text-[10px] font-semibold uppercase tracking-[.18em] text-emerald-700">{type==='customer'?'Customer care':'Pro workspace'}</span></div><button type="button" aria-label="Close navigation" onClick={()=>setSidebarOpen(false)} className="ms-auto rounded-xl p-2 hover:bg-slate-100 lg:hidden"><X className="h-4 w-4"/></button></div>
   <nav aria-label="Portal navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">{nav.map(item=>{const active=location.pathname===item.to||(item.to!==('/'+type)&&location.pathname.startsWith(item.to));return <Link key={item.to} to={item.to} aria-current={active?'page':undefined} onClick={()=>setSidebarOpen(false)} className={cn('group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',active?'bg-emerald-50 text-emerald-800 shadow-sm ring-1 ring-emerald-100':'text-slate-600 hover:bg-slate-50 hover:text-slate-950')}><item.icon className={cn('h-[18px] w-[18px] shrink-0 transition-colors',active?'text-emerald-700':'text-slate-400 group-hover:text-emerald-700')} aria-hidden="true"/>{item.label || t(item.labelKey)}</Link>})}</nav>
   <div className="space-y-1 border-t border-slate-100 p-3"><Link to={'/'+type+'/settings'} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"><Settings className="h-5 w-5 text-slate-400"/>{t('common.settings')}</Link><button type="button" onClick={()=>{logout();navigate('/login',{replace:true})}} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700"><LogOut className="h-5 w-5"/>{t('common.logout')}</button></div>
  </div></aside>
  {sidebarOpen&&<button type="button" aria-label="Close navigation overlay" onClick={()=>setSidebarOpen(false)} className="fixed inset-0 z-20 cursor-default bg-slate-950/35 backdrop-blur-[2px] lg:hidden"/>}
  <div className="flex min-w-0 flex-1 flex-col"><header className="sticky top-0 z-10 flex min-h-16 flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 bg-white/90 px-4 py-2 backdrop-blur-xl sm:px-6"><div className="flex min-w-0 items-center gap-3"><button type="button" aria-label="Open navigation" aria-expanded={sidebarOpen} aria-controls="portal-sidebar" className="rounded-xl p-2 hover:bg-slate-100 lg:hidden" onClick={()=>setSidebarOpen(true)}><Menu className="h-5 w-5"/></button><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{title}</p><p className="hidden text-[11px] text-slate-500 sm:block">A calmer way to manage home services</p></div></div><div className="flex items-center gap-2 sm:gap-3"><LocalContext/><Link to={type==='customer'?'/customer/support':'/professional/dispatch'} aria-label={type==='customer'?'Open support center':'Open dispatch center'} className="rounded-xl p-2 hover:bg-slate-100"><MessageSquare className="h-5 w-5 text-slate-500"/></Link><LanguageSwitcher/></div></header><main id="main-content" className="mela-page-backdrop flex-1 overflow-auto bg-gradient-to-br from-[#f7f9f6] via-[#f6f8f7] to-[#f4f7f4] p-4 sm:p-6 lg:p-7"><div className="mx-auto w-full max-w-[1500px]"><Outlet/></div></main></div>
 </div>;
}