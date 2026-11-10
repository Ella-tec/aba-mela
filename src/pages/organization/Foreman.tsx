import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_PROJECTS, MOCK_WORKERS, MOCK_TIMESHEETS, MOCK_MILESTONES } from '@/data/mock';
import { HardHat, Users, ClipboardList, Flag, CheckCircle2, AlertTriangle } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';

export function ForemanDashboard() {
 const {t}=useTranslation(); const project=MOCK_PROJECTS.find(p=>p.id==='PRJ-001');
 const workers=MOCK_WORKERS.filter(w=>w.projectId==='PRJ-001');
 const todayTS=MOCK_TIMESHEETS.filter(ts=>ts.projectId==='PRJ-001'&&ts.date==='2026-11-02');
 const milestones=MOCK_MILESTONES.filter(m=>m.projectId==='PRJ-001');
 const activeMilestone=milestones.find(m=>m.status==='inProgress');
 if(!project) return <div role="status" className="rounded-xl border bg-white p-8 text-center text-gray-600">No foreman project is assigned yet. <Link to="/organization/projects" className="text-primary-700 underline">View projects</Link></div>;
 return <div className="space-y-6">
  <div><div className="mb-1 flex items-center gap-2 text-sm font-medium text-orange-600"><HardHat className="h-4 w-4"/>{t('construction.foreman')}</div><h2 className="text-xl font-bold text-gray-900">{project.name}</h2><p className="text-sm text-gray-500">{project.location}</p></div>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
   <MetricCard to={'/organization/projects/'+project.id} label="Project progress" value={project.progress+'%'} icon={Flag} tone="text-orange-600" detail="Open project details"/>
   <MetricCard to="/organization/workforce" label="On site today" value={workers.filter(w=>w.status==='active').length} icon={Users} detail="View crew"/>
   <MetricCard to="/organization/timesheets" label="Timesheets today" value={todayTS.length} icon={ClipboardList} detail="Review time records"/>
   <MetricCard to={'/organization/projects/'+project.id} label="Current milestone" value={activeMilestone?.title||'—'} icon={Flag} detail="View project milestones"/>
  </div>
  {activeMilestone&&<section className="rounded-xl border border-orange-200 bg-orange-50 p-4"><div className="mb-1 text-sm font-medium text-orange-700">In progress</div><div className="font-semibold text-gray-900">{activeMilestone.title}</div><div className="mt-2 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-orange-100"><div className="h-full rounded-full bg-orange-500" style={{width:activeMilestone.progress+'%'}}/></div><span className="text-sm font-medium text-gray-700">{activeMilestone.progress}%</span></div><div className="mt-1 text-xs text-gray-500">Due {activeMilestone.dueDate}</div></section>}
  <section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="border-b border-gray-100 px-5 py-3 font-semibold text-gray-900">Today's crew</div><div className="divide-y divide-gray-100">{workers.map(w=><div key={w.id} className="flex items-center justify-between px-5 py-3"><div><div className="font-medium text-gray-900">{w.name}</div><div className="text-sm text-gray-500">{w.role}</div></div>{w.status==='active'?<span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"><CheckCircle2 className="h-3 w-3"/>Present</span>:<span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"><AlertTriangle className="h-3 w-3"/>{w.status}</span>}</div>)}</div></section>
 </div>;
}