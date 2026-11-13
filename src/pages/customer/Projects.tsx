import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Building2, CalendarDays, CheckCircle2, Clock3, MapPin, RefreshCw } from 'lucide-react';
import { getCustomerProject, listCustomerProjects } from '@/lib/auth';
import type { ProjectRecord } from '@/lib/auth';

const statusLabel = (status: string) => {
  const value = status.toLowerCase();
  if (value === 'completed') return 'Completed';
  if (value === 'active' || value === 'inprogress' || value === 'in_progress') return 'In progress';
  if (value === 'onhold' || value === 'on_hold') return 'On hold';
  if (value === 'cancelled') return 'Cancelled';
  return 'Planning';
};
const statusClass = (status: string) => {
  const value = status.toLowerCase();
  if (value === 'completed') return 'bg-emerald-50 text-emerald-700';
  if (value === 'active' || value === 'inprogress' || value === 'in_progress') return 'bg-blue-50 text-blue-700';
  if (value === 'onhold' || value === 'on_hold') return 'bg-amber-50 text-amber-700';
  if (value === 'cancelled') return 'bg-rose-50 text-rose-700';
  return 'bg-slate-100 text-slate-600';
};
const dateLabel = (value?: string | null) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'To be confirmed';

export function CustomerProjects() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'unfinished' | 'completed'>('all');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setProjects(await listCustomerProjects()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load your projects.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const visible = projects.filter(project => filter === 'all'
    || (filter === 'completed' ? project.status.toLowerCase() === 'completed' : project.status.toLowerCase() !== 'completed' && project.status.toLowerCase() !== 'cancelled'));
  const activeCount = projects.filter(project => !['completed', 'cancelled'].includes(project.status.toLowerCase())).length;
  const completedCount = projects.filter(project => project.status.toLowerCase() === 'completed').length;

  return <main className="mx-auto w-full max-w-6xl space-y-6">
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#123d32] via-[#17604a] to-[#2b8060] p-6 text-white shadow-[0_18px_45px_rgba(16,75,53,.16)] sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border border-white/10"/>
      <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50"><Building2 className="h-3.5 w-3.5"/> Your construction workspace</span><h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">See your projects</h1><p className="mt-2 text-sm leading-6 text-emerald-50/90">Follow your construction work from the first stage to handover. Open any project to see its progress, location and schedule.</p></div>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}/> Refresh projects</button>
      </div>
    </section>
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-medium text-slate-500">All your projects</p><p className="mt-2 text-2xl font-bold text-slate-900">{loading ? '—' : projects.length}</p><p className="mt-1 text-xs text-slate-500">Assigned to your account</p></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-medium text-slate-500">In progress / planned</p><p className="mt-2 text-2xl font-bold text-slate-900">{loading ? '—' : activeCount}</p><p className="mt-1 text-xs text-slate-500">Work not yet completed</p></div>
      <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-1"><p className="text-xs font-medium text-slate-500">Completed</p><p className="mt-2 text-2xl font-bold text-slate-900">{loading ? '—' : completedCount}</p><p className="mt-1 text-xs text-slate-500">Finished projects</p></div>
    </section>
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-900">Your project list</h2><p className="mt-1 text-sm text-slate-500">Only projects assigned to your Mela customer account appear here.</p></div><div className="flex flex-wrap gap-2">{([{id:'all',label:'All projects'},{id:'unfinished',label:'Unfinished'},{id:'completed',label:'Completed'}] as const).map(item=><button key={item.id} type="button" aria-pressed={filter===item.id} onClick={()=>setFilter(item.id)} className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${filter===item.id?'bg-emerald-800 text-white':'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{item.label}</button>)}</div></div>
      {loading ? <div role="status" className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading your projects…</div>
      : error ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">{error}<button type="button" onClick={() => void load()} className="ms-3 font-semibold underline">Try again</button></div>
      : visible.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Building2 className="mx-auto h-9 w-9 text-slate-300"/><h3 className="mt-3 font-semibold text-slate-800">{projects.length === 0 ? 'No projects assigned yet' : 'No projects in this view'}</h3><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">{projects.length === 0 ? 'When your construction company creates a project and assigns it to your Mela account, it will appear here automatically.' : 'Choose another filter to see your other projects.'}</p></div>
      : <div className="grid gap-3 md:grid-cols-2">{visible.map(project=><Link key={project.id} to={`/customer/projects/${project.id}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
        <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><Building2 className="h-5 w-5"/></span><div className="min-w-0"><h3 className="font-bold text-slate-900 group-hover:text-emerald-800">{project.name}</h3><p className="mt-1 truncate text-xs text-slate-500">{project.client || 'Your construction provider'}</p></div></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(project.status)}`}>{statusLabel(project.status)}</span></div>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5"/><span className="truncate">{project.location || 'Location to be confirmed'}</span></div>
        <div className="mt-4"><div className="mb-2 flex items-center justify-between text-xs"><span className="font-medium text-slate-600">Project progress</span><strong className="text-slate-900">{project.progress}%</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600 transition-all" style={{width: `${Math.max(0,Math.min(100,project.progress))}%`}}/></div></div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5"/> {dateLabel(project.startDate)} – {dateLabel(project.endDate)}</span><span className="inline-flex items-center gap-1 font-semibold text-emerald-800">View details <ArrowUpRight className="h-3.5 w-3.5"/></span></div>
      </Link>)}</div>}
    </section>
    <div className="flex flex-wrap gap-3"><Link to="/customer" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-800"><ArrowLeft className="h-4 w-4"/> Back to customer home</Link><Link to="/customer/support" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline">Need help? Contact Mela support <ArrowUpRight className="h-4 w-4"/></Link></div>
  </main>;
}

export function CustomerProjectDetail() {
  const { id = '' } = useParams();
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setProject(await getCustomerProject(id)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load this project.'); }
    finally { setLoading(false); }
  }, [id]);
  useEffect(() => { void load(); }, [load]);
  if (loading) return <div role="status" className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading project details…</div>;
  if (error || !project) return <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">{error || 'Project not found or you do not have access.'}<div className="mt-4"><Link to="/customer/projects" className="font-semibold underline">Back to your projects</Link></div></div>;
  return <main className="mx-auto w-full max-w-5xl space-y-5">
    <Link to="/customer/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-800"><ArrowLeft className="h-4 w-4"/> Your projects</Link>
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Construction project</p><h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">{project.name}</h1><p className="mt-2 text-sm text-slate-500">{project.client} · {project.location}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass(project.status)}`}>{statusLabel(project.status)}</span></div>
      <div className="mt-8"><div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-700">Overall progress</h2><strong className="text-2xl text-slate-950">{project.progress}%</strong></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{width:`${Math.max(0,Math.min(100,project.progress))}%`}}/></div></div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-slate-500"><CalendarDays className="h-4 w-4"/><span className="text-xs font-medium">Start date</span></div><p className="mt-2 font-semibold text-slate-900">{dateLabel(project.startDate)}</p></div><div className="rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-slate-500"><Clock3 className="h-4 w-4"/><span className="text-xs font-medium">Target completion</span></div><p className="mt-2 font-semibold text-slate-900">{dateLabel(project.endDate)}</p></div></div>
    </section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-700"/><h2 className="font-bold text-slate-900">Project updates</h2></div><p className="mt-2 text-sm leading-6 text-slate-600">Your project information is shown above. Progress updates, milestone history, documents and messages will appear here as your construction team publishes them in Mela.</p><p className="mt-3 text-xs text-slate-400">For a question about this project, contact the Mela support team.</p><Link to="/customer/support" className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900">Contact support <ArrowUpRight className="h-4 w-4"/></Link></section>
    <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-800"><RefreshCw className="h-4 w-4"/> Refresh project details</button>
  </main>;
}
