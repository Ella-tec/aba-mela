import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, FileText, Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { getAuth } from '@/lib/auth';

type KnowledgeItem = { id: string; title: string; category: string; audience: string; isApproved: boolean; characterCount: number; updatedAt: string };
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5018').replace(/\/$/, '');

export function AiKnowledgePage() {
  const auth = getAuth();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Company information');
  const [audience, setAudience] = useState('All');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const headers = () => ({ Authorization: 'Bearer ' + (auth?.token || ''), Accept: 'application/json', 'Content-Type': 'application/json' });
  const load = useCallback(async () => {
    if (!auth?.token) return;
    setLoading(true); setError('');
    try {
      const response = await fetch(API_BASE + '/api/assistant/knowledge', { headers: headers() });
      const data = await response.json().catch(() => []);
      if (!response.ok) throw new Error(data?.message || 'Could not load knowledge documents.');
      setItems(data);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not load knowledge documents.'); }
    finally { setLoading(false); }
  }, [auth?.token]);

  useEffect(() => { void load(); }, [load]);

  if (!auth) return <Navigate to="/login" replace />;
  if (auth.role !== 'Admin') return <Navigate to={auth.role === 'Organization' ? '/organization' : auth.role === 'Professional' ? '/professional' : '/customer'} replace />;

  const add = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch(API_BASE + '/api/assistant/knowledge', { method: 'POST', headers: headers(), body: JSON.stringify({ title, category, audience, content }) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || 'Could not save this document.');
      setTitle(''); setContent(''); setNotice('Saved as a draft. Review and approve it before Mela Assistant can use it.');
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save this document.'); }
    finally { setBusy(false); }
  };

  const approve = async (id: string) => {
    setError(''); setNotice('');
    try {
      const response = await fetch(API_BASE + '/api/assistant/knowledge/' + id + '/approve', { method: 'PATCH', headers: headers() });
      if (!response.ok) throw new Error('Could not approve this document.');
      setNotice('Knowledge document approved and available to matching Mela users.');
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not approve this document.'); }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this knowledge document? This cannot be undone.')) return;
    try {
      const response = await fetch(API_BASE + '/api/assistant/knowledge/' + id, { method: 'DELETE', headers: headers() });
      if (!response.ok) throw new Error('Could not delete this document.');
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not delete this document.'); }
  };

  return <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><div className="flex items-center gap-2 text-emerald-800"><BookOpen className="h-5 w-5"/><span className="text-sm font-semibold">Mela AI Knowledge Center</span></div><h1 className="mt-2 text-2xl font-bold text-slate-950">Teach Mela with approved information</h1><p className="mt-1 max-w-2xl text-sm text-slate-600">Add trusted company information, service guidance, policies and FAQs. New entries stay in draft until an administrator approves them.</p></div>
      <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4"/> Refresh</button>
    </div>
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</div>}
    {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</div>}
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <form onSubmit={add} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2"><Plus className="h-4 w-4 text-emerald-700"/><h2 className="font-bold text-slate-900">Add knowledge</h2></div>
        <label className="block text-sm font-medium text-slate-700">Document title<input required maxLength={160} value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Mela booking and cancellation policy" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"/></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">Category<select value={category} onChange={e=>setCategory(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"><option>Company information</option><option>Services and pricing</option><option>Policies and procedures</option><option>Construction guidance</option><option>Customer FAQs</option><option>Professional guides</option><option>Safety guidance</option></select></label>
          <label className="block text-sm font-medium text-slate-700">Who can use it<select value={audience} onChange={e=>setAudience(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"><option value="All">All Mela users</option><option value="Customer">Customers</option><option value="Professional">Professionals</option><option value="Organization">Organizations</option></select></label>
        </div>
        <label className="block text-sm font-medium text-slate-700">Knowledge content<textarea required maxLength={50000} rows={12} value={content} onChange={e=>setContent(e.target.value)} placeholder="Paste verified Mela information here. Include clear headings, steps, conditions and effective dates." className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"/></label>
        <p className="text-xs text-slate-500">{content.length.toLocaleString()} / 50,000 characters. Use text or paste text extracted from a PDF or Word document.</p>
        <button disabled={busy || !title.trim() || !content.trim()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50">{busy?<Loader2 className="h-4 w-4 animate-spin"/>:<Plus className="h-4 w-4"/>} Save draft for review</button>
      </form>
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Knowledge library</h2><p className="mt-1 text-xs text-slate-500">{items.length} saved entries</p></div><FileText className="h-5 w-5 text-slate-400"/></div>
        {loading ? <div className="flex items-center gap-2 py-10 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin"/> Loading knowledge…</div> : items.length===0 ? <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">No knowledge documents yet. Add your first trusted Mela guide.</div> : <div className="max-h-[650px] space-y-3 overflow-y-auto">{items.map(item=><article key={item.id} className="rounded-xl border border-slate-200 p-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="font-semibold text-slate-900">{item.title}</h3><p className="mt-1 text-xs text-slate-500">{item.category} · {item.audience} · {item.characterCount.toLocaleString()} characters</p></div><span className={item.isApproved?'rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800':'rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800'}>{item.isApproved?'Approved':'Draft'}</span></div><div className="mt-3 flex flex-wrap gap-2">{!item.isApproved&&<button type="button" onClick={()=>void approve(item.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800"><CheckCircle2 className="h-3.5 w-3.5"/> Approve</button>}<button type="button" onClick={()=>void remove(item.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5"/> Delete</button></div></article>)}</div>}
      </section>
    </div>
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900"><strong>Privacy and accuracy:</strong> Do not paste passwords, payment details, private customer records or confidential project files into shared knowledge. Add only approved information. Mela Assistant uses only approved entries that match the signed-in user's audience.</div>
  </main>;
}
