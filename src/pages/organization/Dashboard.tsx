import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_PROJECTS, MOCK_WORKERS, MOCK_TIMESHEETS } from '@/data/mock';
import { FolderKanban, Users, ClipboardList, TrendingUp } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
export function OrganizationDashboard() {
 const { t }=useTranslation(); const active=MOCK_PROJECTS.filter(p=>p.status==='active');
 const onSite=MOCK_WORKERS.filter(w=>w.status==='active').length;
 const pendingTS=MOCK_TIMESHEETS.filter(ts=>ts.status==='pending').length;
 const budget=active.reduce((s,p)=>s+p.budget,0); const spent=active.reduce((s,p)=>s+p.spent,0);
 return <div className="space-y-6">
  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><h2 className="text-2xl font-bold text-gray-900">{t('construction.dashboard')}</h2><Link to="/organization/projects" className="inline-flex rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">{t('construction.createProject')}</Link></div>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
   <MetricCard to="/organization/projects" label={t('construction.activeProjects')} value={active.length} icon={FolderKanban} tone="text-orange-600" detail="Open project list"/>
   <MetricCard to="/organization/workforce" label={t('construction.workersOnSite')} value={onSite} icon={Users} detail="View workforce"/>
   <MetricCard to="/organization/timesheets" label={t('construction.pendingTimesheets')} value={pendingTS} icon={ClipboardList} tone="text-amber-600" detail="Review timesheets"/>
   <MetricCard to="/organization/analytics" label={t('construction.budgetUsed')} value={(budget?Math.round(spent/budget*100):0)+'%'} icon={TrendingUp} detail="Open analytics"/>
  </div>
  <section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="flex items-center justify-between border-b border-gray-100 px-5 py-4"><h3 className="font-semibold text-gray-900">{t('construction.activeProjects')}</h3><Link to="/organization/projects" className="text-sm text-orange-600 hover:underline">{t('common.viewAll')}</Link></div>
   <div className="divide-y divide-gray-100">{active.map(p=><Link key={p.id} to={'/organization/projects/'+p.id} className="block px-5 py-4 hover:bg-gray-50"><div className="flex items-start justify-between gap-3"><div><div className="font-medium text-gray-900">{p.name}</div><div className="mt-0.5 text-sm text-gray-500">{p.client} · {p.location}</div><div className="mt-1 text-xs text-gray-400">{p.foreman?'Foreman: '+p.foreman+' · ':''}{p.workers} workers</div></div><div className="shrink-0 text-end"><div className="text-sm font-semibold text-gray-900">{p.progress}%</div><div className="mt-1.5 h-1.5 w-24 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-orange-500" style={{width:p.progress+'%'}}/></div></div></div></Link>)}</div>
  </section>
 </div>;
}