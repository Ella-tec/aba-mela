import { Link, useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { getAuth, logout } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { LayoutDashboard, Calendar, Briefcase, Wallet, Settings, LogOut, Menu, Wrench, Flame, ClipboardList, Search, HeadphonesIcon, Map, Radio, Home, Sparkles, MessageSquare, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type PortalType='customer'|'professional';
interface NavItem {to:string;labelKey:string;icon:React.ComponentType<{className?:string}>}
const customerNav:NavItem[]=[
 {to:'/customer',labelKey:'nav.overview',icon:LayoutDashboard},{to:'/customer/find-service',labelKey:'nav.findService',icon:Search},{to:'/customer/smart-match',labelKey:'nav.findProfessionals',icon:Sparkles},{to:'/customer/bookings',labelKey:'nav.myBookings',icon:ClipboardList},{to:'/customer/create-booking',labelKey:'nav.createBooking',icon:Calendar},{to:'/customer/track',labelKey:'nav.liveMap',icon:Map},{to:'/customer/payments',labelKey:'nav.payments',icon:Wallet},{to:'/customer/reviews',labelKey:'nav.reviews',icon:Wrench},{to:'/customer/support',labelKey:'nav.support',icon:HeadphonesIcon},{to:'/customer/home-passport',labelKey:'nav.home',icon:Home}
];
const professionalNav:NavItem[]=[
 {to:'/professional',labelKey:'nav.overview',icon:LayoutDashboard},{to:'/professional/jobs',labelKey:'nav.availableJobs',icon:Briefcase},{to:'/professional/hot-jobs',labelKey:'nav.hotJobs',icon:Flame},{to:'/professional/my-jobs',labelKey:'nav.myJobs',icon:Wrench},{to:'/professional/map',labelKey:'nav.liveMap',icon:Map},{to:'/professional/dispatch',labelKey:'nav.dispatch',icon:Radio},{to:'/professional/earnings',labelKey:'nav.earnings',icon:Wallet},{to:'/professional/calendar',labelKey:'nav.calendar',icon:Calendar},{to:'/professional/verification',labelKey:'nav.verification',icon:ClipboardList},{to:'/professional/reviews',labelKey:'nav.reviews',icon:Sparkles}
];

export function PortalLayout({type}:{type:PortalType}) {
 const {t}=useTranslation();const navigate=useNavigate();const location=useLocation();const[sidebarOpen,setSidebarOpen]=useState(false);const auth=getAuth();
 if(!auth)return <Navigate to="/login" replace/>;
 const expected=type==='customer'?'Customer':'Professional';
 if(auth.role!==expected&&auth.role!=='Admin')return <Navigate to={auth.role==='Organization'?'/organization':auth.role==='Professional'?'/professional':'/customer'} replace/>;
 const nav=type==='customer'?customerNav:professionalNav;const title=type==='customer'?t('customer.dashboard'):t('professional.dashboard');
 return <div className="flex min-h-screen bg-gray-50">
  <aside id="portal-sidebar" className={cn('fixed inset-y-0 start-0 z-30 w-64 border-e border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',sidebarOpen?'translate-x-0':'-translate-x-full rtl:translate-x-full')}><div className="flex h-full flex-col">
   <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5"><img src="/favicon.svg" alt="" className="h-8 w-8 rounded-lg"/><span className="text-lg font-bold">{t('common.appName')}</span><button type="button" aria-label="Close navigation" onClick={()=>setSidebarOpen(false)} className="ms-auto rounded-lg p-2 lg:hidden"><X className="h-4 w-4"/></button></div>
   <nav aria-label="Portal navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">{nav.map(item=>{const active=location.pathname===item.to||(item.to!==('/'+type)&&location.pathname.startsWith(item.to));return <Link key={item.to} to={item.to} aria-current={active?'page':undefined} onClick={()=>setSidebarOpen(false)} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',active?'bg-primary-50 text-primary-700':'text-gray-600 hover:bg-gray-100 hover:text-gray-900')}><item.icon className="h-5 w-5 shrink-0" aria-hidden="true"/>{t(item.labelKey)}</Link>})}</nav>
   <div className="space-y-1 border-t border-gray-100 p-3"><Link to={'/'+type+'/settings'} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"><Settings className="h-5 w-5"/>{t('common.settings')}</Link><button type="button" onClick={()=>{logout();navigate('/login',{replace:true})}} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"><LogOut className="h-5 w-5"/>{t('common.logout')}</button></div>
  </div></aside>
  {sidebarOpen&&<button type="button" aria-label="Close navigation overlay" onClick={()=>setSidebarOpen(false)} className="fixed inset-0 z-20 cursor-default bg-black/40 lg:hidden"/>}
  <div className="flex min-w-0 flex-1 flex-col"><header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6"><div className="flex items-center gap-3"><button type="button" aria-label="Open navigation" aria-expanded={sidebarOpen} aria-controls="portal-sidebar" className="rounded-lg p-2 hover:bg-gray-100 lg:hidden" onClick={()=>setSidebarOpen(true)}><Menu className="h-5 w-5"/></button><h1 className="truncate text-lg font-semibold text-gray-900">{title}</h1></div><div className="flex items-center gap-3"><Link to={type==='customer'?'/customer/support':'/professional/dispatch'} aria-label={type==='customer'?'Open support center':'Open dispatch center'} className="rounded-lg p-2 hover:bg-gray-100"><MessageSquare className="h-5 w-5 text-gray-600"/></Link><LanguageSwitcher/></div></header><main id="main-content" className="flex-1 overflow-auto p-4 sm:p-6"><Outlet/></main></div>
 </div>;
}
