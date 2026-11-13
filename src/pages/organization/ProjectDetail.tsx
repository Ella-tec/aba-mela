import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { getOrganizationProject, updateOrganizationProject } from '@/lib/auth';
import type { ProjectRecord } from '@/lib/auth';

const dateLabel = (value?: string | null) => value ? new Date(value).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}) : 'Not scheduled';
const money = (value?: number) => (value ?? 0).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});

export function ProjectDetail() {
  const { id = '' } = useParams();
  const [project,setProject] = useState<ProjectRecord|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const [saving,setSaving] = useState(false);
  const [status,setStatus] = useState('planning');
  const [progress,setProgress] = useState(0);
  const [endDate,setEndDate] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const loaded = await getOrganizationProject(id); setProject(loaded); setStatus(loaded.status); setProgress(loaded.progress); setEndDate(loaded.endDate ? loaded.endDate.slice(0,10) : ''); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load this project.'); }
    finally { setLoading(false); }
  },[id]);
  useEffect(() => { void load(); },[load]);

  if (loading) return <div role="status" className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading project details…</div>;
  if (error || !project) return <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">{error || 'Project not found.'}<div className="mt-3"><Link to="/organization/projects" className="font-semibold underline">Back to projects</Link></div></div>;

  async function saveProgress() {
    setSaving(true); setError(''); setNotice('');
    try {
      const updated = await updateOrganizationProject(id, { status, progress: Number(progress), endDate: endDate || null });
      setProject(updated); setStatus(updated.status); setProgress(updated.progress);
      setNotice('Project progress has been saved and is now visible to the assigned customer.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not update project progress.'); }
    finally { setSaving(false); }
  }

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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-bold text-slate-900">Publish a customer update</h2>
      <p className="mt-1 text-sm text-slate-500">Update the project status and progress. The assigned customer will see the changes in My Projects.</p>
      {notice && <p role="status" className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      {error && <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-xs font-semibold text-slate-600">Project status<select value={status} onChange={e=>setStatus(e.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal"><option value="planning">Planning</option><option value="active">In progress</option><option value="onHold">On hold</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label>
        <label className="text-xs font-semibold text-slate-600">Progress (%)<input type="number" min="0" max="100" value={progress} onChange={e=>setProgress(Number(e.target.value))} disabled={status==='completed'} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal disabled:bg-slate-100"/></label>
        <label className="text-xs font-semibold text-slate-600">Target completion<input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal"/></label>
      </div>
      <button type="button" onClick={()=>void saveProgress()} disabled={saving} className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800 disabled:opacity-60">{saving?'Saving…':'Save and publish update'}</button>
    </section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold text-slate-900">Customer visibility</h2><p className="mt-2 text-sm leading-6 text-slate-600">This project is assigned to the customer account entered when it was created. The customer can see the project status, progress, location and schedule in their My Projects workspace. Internal budget and spending figures remain organization-only.</p></section>
    <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-700"><RefreshCw className="h-4 w-4"/> Refresh details</button>
  </div>;
}
