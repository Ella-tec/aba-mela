import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, RefreshCw } from 'lucide-react';
import { getOrganizationProject } from '@/lib/auth';
import type { ProjectRecord } from '@/lib/auth';

const dateLabel = (value?: string | null) => value ? new Date(value).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}) : 'Not scheduled';
const money = (value?: number) => (value ?? 0).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});

export function ProjectDetail() {
  const { id = '' } = useParams();
  const [project,setProject] = useState<ProjectRecord|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setProject(await getOrganizationProject(id)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load this project.'); }
    finally { setLoading(false); }
  },[id]);
  useEffect(() => { void load(); },[load]);

  if (loading) return <div role="status" className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading project details…</div>;
  if (error || !project) return <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">{error || 'Project not found.'}<div className="mt-3"><Link to="/organization/projects" className="font-semibold underline">Back to projects</Link></div></div>;

  return <div className="space-y-5">
    <Link to="/organization/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-700"><ArrowLeft className="h-4 w-4"/> Project register</Link>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-700">Organization project</p><h1 className="mt-2 text-2xl font-bold text-slate-950">{project.name}</h1><p className="mt-2 text-sm text-slate-500">{project.client || 'Customer not assigned'} · {project.location}</p></div><span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold capitalize text-orange-800">{project.status}</span></div>
      <div className="mt-7"><div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold text-slate-700">Project progress</span><strong className="text-xl text-slate-950">{project.progress}%</strong></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-orange-600" style={{width:`${Math.max(0,Math.min(100,project.progress))}%`}}/></div></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Project budget</p><p className="mt-1 font-semibold text-slate-900">{money(project.budget)}</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Spent to date</p><p className="mt-1 font-semibold text-slate-900">{money(project.spent)}</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Start date</p><p className="mt-1 font-semibold text-slate-900">{dateLabel(project.startDate)}</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Target completion</p><p className="mt-1 font-semibold text-slate-900">{dateLabel(project.endDate)}</p></div>
      </div>
    </section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold text-slate-900">Customer visibility</h2><p className="mt-2 text-sm leading-6 text-slate-600">This project is assigned to the customer account entered when it was created. The customer can see the project status, progress, location and schedule in their My Projects workspace. Internal budget and spending figures remain organization-only.</p></section>
    <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-700"><RefreshCw className="h-4 w-4"/> Refresh details</button>
  </div>;
}
