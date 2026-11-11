import { Link, useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { getAuth, logout } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { LayoutDashboard, FolderKanban, Users, ClipboardList, HardHat, Settings, LogOut, Menu, BarChart3, MessageSquare, X, Trash2, Building2, DollarSign, Truck, FileText, ShieldCheck, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const nav=[
 {to:'/organization',labelKey:'nav.overview',icon:LayoutDashboard},
 {to:'/organization/projects',labelKey:'nav.projects',icon:FolderKanban},
 {to:'/organization/foreman',labelKey:'nav.foreman',icon:HardHat},
 {to:'/organization/workforce',labelKey:'nav.workforce',icon:Users},
 {to:'/organization/timesheets',labelKey:'nav.timesheets',icon:ClipboardList},
 {to:'/organization/analytics',labelKey:'nav.analytics',icon:BarChart3},
 {to:'/organization/recycle-bin',labelKey:'Recycle Bin',icon:Trash2}
];
export function OrganizationLayout(){
 const {t}=useTranslation();const navigate=useNavigate();const location=useLocation();const[sidebarOpen,setSidebarOpen]=useState(false);const auth=getAuth();
 if(!auth)return <Navigate to="/login" replace/>;
 if(auth.role!=='Organization'&&auth.role!=='Admin')return <Navigate to={auth.role==='Professional'?'/professional':'/customer'} replace/>;
 return <div className="flex min-h-screen bg-gray-50">
  <aside id="organization-sidebar" className={cn('fixed inset-y-0 start-0 z-30 w-64 border-e border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',sidebarOpen?'translate-x-0':'-translate-x-full rtl:translate-x-full')}><div className="flex h-full flex-col">
   <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5"><img src="/favicon.svg" alt="" className="h-8 w-8 rounded-lg"/><div><div className="text-lg font-bold leading-tight">{t('common.appName')}</div><div className="text-[10px] uppercase tracking-wide text-gray-500">Mela Projects</div></div><button type="button" aria-label="Close navigation" onClick={()=>setSidebarOpen(false)} className="ms-auto rounded-lg p-2 lg:hidden"><X className="h-4 w-4"/></button></div>
   <nav aria-label="Organization navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">{nav.map(item=>{const active=location.pathname===item.to||(item.to!=='/organization'&&location.pathname.startsWith(item.to));return <Link key={item.to} to={item.to} aria-current={active?'page':undefined} onClick={()=>setSidebarOpen(false)} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',active?'bg-orange-50 text-orange-700':'text-gray-600 hover:bg-gray-100 hover:text-gray-900')}><item.icon className="h-5 w-5 shrink-0"/>{t(item.labelKey)}</Link>})}</nav>
   <div className="space-y-1 border-t border-gray-100 p-3"><Link to="/organization/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"><Settings className="h-5 w-5"/>{t('common.settings')}</Link><button type="button" onClick={()=>{logout();navigate('/login',{replace:true})}} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"><LogOut className="h-5 w-5"/>{t('common.logout')}</button></div>
  </div></aside>
  {sidebarOpen&&<button type="button" aria-label="Close navigation overlay" onClick={()=>setSidebarOpen(false)} className="fixed inset-0 z-20 cursor-default bg-black/40 lg:hidden"/>}
  <div className="flex min-w-0 flex-1 flex-col"><header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6"><div className="flex items-center gap-3"><button type="button" aria-label="Open navigation" aria-expanded={sidebarOpen} aria-controls="organization-sidebar" className="rounded-lg p-2 hover:bg-gray-100 lg:hidden" onClick={()=>setSidebarOpen(true)}><Menu className="h-5 w-5"/></button><h1 className="truncate text-lg font-semibold text-gray-900">{t('construction.dashboard')}</h1></div><div className="flex items-center gap-3"><Link to="/organization/analytics" aria-label="Open organization analytics" className="rounded-lg p-2 hover:bg-gray-100"><MessageSquare className="h-5 w-5 text-gray-600"/></Link><LanguageSwitcher/></div></header><main id="main-content" className="flex-1 overflow-auto p-4 sm:p-6 mela-page-backdrop"><Outlet/></main></div>
 </div>;
}
