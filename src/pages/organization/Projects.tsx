import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FormEvent } from 'react';
import { ArrowUpRight, Building2, Plus, RefreshCw } from 'lucide-react';
import { createOrganizationProject, listOrganizationProjects } from '@/lib/auth';
import type { CreateProjectInput, ProjectRecord } from '@/lib/auth';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'planning' | 'active' | 'completed' | 'onHold';
const statusStyle: Record<string,string> = {
  planning: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  onHold: 'bg-amber-100 text-amber-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};
const labelStatus = (status: string) => status === 'onHold' ? 'On hold' : status.charAt(0).toUpperCase() + status.slice(1);

export function ProjectsPage() {
  const [projects,setProjects] = useState<ProjectRecord[]>([]);
  const [filter,setFilter] = useState<Filter>('all');
  const [showForm,setShowForm] = useState(false);
  const [name,setName] = useState('');
  const [clientEmail,setClientEmail] = useState('');
  const [location,setLocation] = useState('');
  const [budget,setBudget] = useState('');
  const [startDate,setStartDate] = useState(new Date().toISOString().slice(0,10));
  const [endDate,setEndDate] = useState('');
  const [notice,setNotice] = useState('');
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setProjects(await listOrganizationProjects()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load organization projects.'); }
    finally { setLoading(false); }
  },[]);
  useEffect(() => { void load(); },[load]);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setNotice('');
    const amount = Number(budget);
    if (!name.trim() || !clientEmail.trim() || !location.trim() || !Number.isFinite(amount) || amount < 0) {
      setError('Complete the project name, customer email, location and a valid budget.'); return;
    }
    setSaving(true);
    try {
      const input: CreateProjectInput = {
        name: name.trim(), client: '', customerEmail: clientEmail.trim(),
        location: location.trim(), status: 'planning', progress: 0,
        budget: amount, spent: 0, startDate, endDate: endDate || null,
      };
      const created = await createOrganizationProject(input);
      setProjects(current => [created,...current]);
      setFilter('all'); setShowForm(false); setName(''); setClientEmail(''); setLocation(''); setBudget(''); setEndDate('');
      setNotice('Project created and assigned to the Mela customer account.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Project could not be created.');
    } finally { setSaving(false); }
  }

  return <div className="space-y-5">
    <section className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-orange-700">Construction workspace</p><h1 className="mt-1 text-2xl font-bold text-slate-950">Project register</h1><p className="mt-1 text-sm text-slate-500">Create and manage projects, then assign each project to the correct Mela customer.</p></div>
      <div className="flex flex-wrap gap-2"><button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading?'animate-spin':''}`}/> Refresh</button><button type="button" aria-expanded={showForm} onClick={() => setShowForm(v=>!v)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"><Plus className="h-4 w-4"/>{showForm?'Close':'Create project'}</button></div>
    </section>
    {notice && <p role="status" aria-live="polite" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
    {showForm && <form onSubmit={create} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
      <div><label htmlFor="project-name" className="mb-1 block text-sm font-medium text-slate-700">Project name</label><input id="project-name" required maxLength={160} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Kitchen renovation" className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"/></div>
      <div><label htmlFor="project-customer-email" className="mb-1 block text-sm font-medium text-slate-700">Customer Mela account email</label><input id="project-customer-email" required type="email" value={clientEmail} onChange={e=>setClientEmail(e.target.value)} placeholder="customer@example.com" className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"/><p className="mt-1 text-xs text-slate-500">The customer must already have a Mela customer account.</p></div>
      <div><label htmlFor="project-location" className="mb-1 block text-sm font-medium text-slate-700">Project location</label><input id="project-location" required value={location} onChange={e=>setLocation(e.target.value)} placeholder="City or site address" className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"/></div>
      <div><label htmlFor="project-budget" className="mb-1 block text-sm font-medium text-slate-700">Internal project budget ($)</label><input id="project-budget" type="number" min="0" step="0.01" required value={budget} onChange={e=>setBudget(e.target.value)} placeholder="0.00" className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"/></div>
      <div><label htmlFor="project-start" className="mb-1 block text-sm font-medium text-slate-700">Start date</label><input id="project-start" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"/></div>
      <div><label htmlFor="project-end" className="mb-1 block text-sm font-medium text-slate-700">Target completion</label><input id="project-end" type="date" min={startDate} value={endDate} onChange={e=>setEndDate(e.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"/></div>
      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2"><p className="text-xs text-slate-500">The customer will see the project name, location, status, progress and dates — not internal budget figures.</p><button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-700 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-60">{saving?'Creating…':'Create and assign project'}</button></div>
    </form>}
    <div className="flex flex-wrap gap-2">{(['all','planning','active','completed','onHold'] as const).map(f=><button key={f} type="button" aria-pressed={filter===f} onClick={()=>setFilter(f)} className={cn('whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium',filter===f?'bg-orange-700 text-white':'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50')}>{f==='all'?'All projects':labelStatus(f)}</button>)}</div>
    {loading ? <div role="status" className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading project register…</div>
    : filtered.length===0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><Building2 className="mx-auto h-9 w-9 text-slate-300"/><p className="mt-3 font-semibold text-slate-800">No projects found</p><p className="mt-1 text-sm text-slate-500">Create a project and assign it to a registered Mela customer.</p></div>
    : <div className="grid gap-3">{filtered.map(p=><Link key={p.id} to={'/organization/projects/'+p.id} className="block rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-orange-300"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><span className="font-semibold text-slate-900">{p.name}</span><span className={cn('rounded-full px-2 py-0.5 text-xs font-medium',statusStyle[p.status]||statusStyle.planning)}>{labelStatus(p.status)}</span></div><div className="mt-1 text-sm text-slate-500">{p.client || 'Customer'} · {p.location}</div><div className="mt-1 text-xs text-slate-400">{p.startDate?.slice(0,10)||'Start date not set'} → {p.endDate?.slice(0,10)||'Not scheduled'}</div></div><div className="text-end"><div className="text-sm text-slate-500">Progress</div><div className="text-lg font-bold text-slate-900">{p.progress}%</div><div className="ms-auto mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-orange-500" style={{width:p.progress+'%'}}/></div><span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-700">Open details <ArrowUpRight className="h-3.5 w-3.5"/></span></div></div></Link>)}</div>}
  </div>;
}
