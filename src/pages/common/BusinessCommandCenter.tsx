import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Users, HardHat, ClipboardList, DollarSign,
  Truck, FileText, CalendarDays, BarChart3, Bot, Settings,
  Trash2, ChevronRight, X, Plus,
  Receipt, Package, Clock3, Building2, Search, Sparkles
} from 'lucide-react';
import { getAuth } from '@/lib/auth';
import { MOCK_PROJECTS, MOCK_WORKERS, MOCK_TIMESHEETS, MOCK_RENTALS, MOCK_PRODUCTS } from '@/data/mock';

type HubSection = 'overview'|'projects'|'workforce'|'finance'|'equipment'|'documents'|'scheduling'|'analytics'|'ai'|'settings';
type HubLink = { id: HubSection; label: string; description: string; icon: typeof Building2; href: string };
const sections: HubLink[] = [
  { id:'overview', label:'Overview', description:'Your construction operations at a glance', icon:LayoutDashboard, href:'/business-center' },
  { id:'projects', label:'Projects', description:'Project list, milestones and change control', icon:FolderKanban, href:'/business-center/projects' },
  { id:'workforce', label:'Workforce', description:'Employees, foremen, crews and certifications', icon:Users, href:'/business-center/workforce' },
  { id:'finance', label:'Finance', description:'Project budgets, costs, invoices and payments', icon:DollarSign, href:'/business-center/finance' },
  { id:'equipment', label:'Equipment', description:'Assets, rentals, tools and maintenance', icon:Truck, href:'/business-center/equipment' },
  { id:'documents', label:'Documents', description:'Project files, permits, contracts and reports', icon:FileText, href:'/business-center/documents' },
  { id:'scheduling', label:'Scheduling', description:'Crew plans, project dates and inspections', icon:CalendarDays, href:'/business-center/scheduling' },
  { id:'analytics', label:'Analytics', description:'Performance, budget variance and utilization', icon:BarChart3, href:'/business-center/analytics' },
  { id:'ai', label:'Mela AI', description:'Ask questions about your Mela workspace', icon:Bot, href:'/business-center/ai' },
  { id:'settings', label:'Settings', description:'Workspace preferences and administration', icon:Settings, href:'/organization/settings' },
];

function Metric({label,value,detail,icon:Icon,to}:{label:string;value:string|number;detail:string;icon:typeof Building2;to:string}) {
  return <Link to={to} className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
    <div className="flex items-center justify-between gap-2"><span className="text-sm font-medium text-gray-500">{label}</span><span className="rounded-xl bg-orange-50 p-2 text-orange-700"><Icon className="h-5 w-5"/></span></div>
    <div className="mt-3 text-2xl font-bold tabular-nums text-gray-900">{value}</div>
    <div className="mt-1 text-xs text-gray-500">{detail}</div>
  </Link>;
}

export function BusinessCommandCenter({ initialSection='overview' }:{initialSection?:HubSection}) {
  const auth=getAuth();
  const location=useLocation();
  const [megaOpen,setMegaOpen]=useState(false);
  const [search,setSearch]=useState('');
  const active:HubSection = initialSection==='overview' && location.pathname==='/business-center' ? 'overview' : initialSection;
  const activeItem=sections.find(x=>x.id===active);
  const projects=MOCK_PROJECTS;
  const activeProjects=projects.filter(p=>p.status==='active');
  const activeWorkers=MOCK_WORKERS.filter(w=>w.status==='active');
  const pendingTimesheets=MOCK_TIMESHEETS.filter(t=>t.status==='pending');
  const totalBudget=activeProjects.reduce((sum,p)=>sum+p.budget,0);
  const totalSpent=activeProjects.reduce((sum,p)=>sum+p.spent,0);
  const budgetPercent=totalBudget ? Math.round(totalSpent/totalBudget*100) : 0;
  const filteredSections=useMemo(()=>sections.filter(item=>(item.label+' '+item.description).toLowerCase().includes(search.toLowerCase())),[search]);

  if(!auth) return <Navigate to="/login" replace/>;

  const organizationRole=auth.role==='Organization'||auth.role==='Admin';
  const destinationForHref=(href:string)=>{
    if(organizationRole&&href.startsWith('/business-center')) return '/organization'+href.slice('/business-center'.length);
    if(!organizationRole&&href.startsWith('/organization/projects')) return '/business-center/projects';
    if(!organizationRole&&href==='/organization/workforce') return '/business-center/workforce';
    if(!organizationRole&&href==='/organization/analytics') return '/business-center/analytics';
    if(!organizationRole&&href==='/organization/timesheets') return '/business-center/scheduling';
    if(!organizationRole&&href==='/organization/foreman') return '/business-center/workforce';
    return href;
  };
  const destinationFor=(item:HubLink)=>item.label==='Recycle Bin'
    ? organizationRole ? '/organization/recycle-bin' : auth.role==='Professional' ? '/professional/recycle-bin' : '/customer/recycle-bin'
    : item.label==='Settings'
      ? organizationRole ? '/organization/settings' : auth.role==='Professional' ? '/professional/settings' : '/customer/settings'
      : destinationForHref(item.href);

  const actionLinks=[
    {label:'Create project',href:'/business-center/projects',icon:Plus},
    {label:'Open workforce',href:'/business-center/workforce',icon:Users},
    {label:'Assign foreman',href:'/organization/foreman',icon:HardHat},
    {label:'Timesheet Center',href:'/organization/timesheets',icon:ClipboardList},
    {label:'Finance Center',href:'/business-center/finance',icon:DollarSign},
    {label:'Document Center',href:'/business-center/documents',icon:FileText},
    {label:'Scheduling Center',href:'/business-center/scheduling',icon:CalendarDays},
    {label:'Equipment register',href:'/business-center/equipment',icon:Truck},
    {label:'View reports',href:'/business-center/analytics',icon:BarChart3},
    {label:'Mela AI Assistant',href:'/business-center/ai',icon:Bot},
    {label:'Open Recycle Bin',href:destinationFor(sections[sections.length-1]),icon:Trash2}
  ];

  return <div className="mx-auto max-w-[1500px] space-y-8 px-1 sm:px-2">
    <header className="flex flex-col justify-between gap-5 rounded-[2rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/70 to-amber-50/80 p-7 text-slate-900 shadow-sm sm:flex-row sm:items-center sm:p-9">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/80 px-3 py-1.5 text-xs font-semibold tracking-wide text-orange-800"><Building2 className="h-3.5 w-3.5"/> MELA CONSTRUCTION WORKSPACE</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Business Center</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">A calm, clear workspace for projects, people, budgets, equipment, documents and reporting.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={()=>setMegaOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"><Sparkles className="h-4 w-4"/> Access Everything</button>
        <Link to="/organization/projects" className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"><Plus className="h-4 w-4"/> Create Project</Link>
      </div>
    </header>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Active projects" value={activeProjects.length} detail="Open project register" icon={FolderKanban} to="/organization/projects"/>
      <Metric label="Workers on site" value={activeWorkers.length} detail="Active workforce records" icon={HardHat} to="/organization/workforce"/>
      <Metric label="Pending timesheets" value={pendingTimesheets.length} detail="Awaiting review" icon={Clock3} to="/organization/timesheets"/>
      <Metric label="Budget used" value={budgetPercent+'%'} detail="Active project budgets · demo data" icon={DollarSign} to="/organization/analytics"/>
      <Metric label="Open RFIs" value="Not connected" detail="Requires project RFI records" icon={ClipboardCheck} to="/business-center/projects"/>
      <Metric label="Invoices awaiting approval" value="Not connected" detail="Finance API not connected" icon={Receipt} to="/business-center/finance"/>
      <Metric label="Equipment in use" value={MOCK_RENTALS.filter(x=>x.status==='active').length} detail="Sample rental records" icon={Truck} to="/business-center/equipment"/>
    </div>
    {children}
    <p className="text-xs text-slate-400">Demo workspace · Changes made here are temporary and reset when this page is refreshed. Live database sync is not connected.</p>
  </main>;
}

function FinanceWorkspace({ base }: { base: string }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([
    { id: 'EXP-101', title: 'Concrete and aggregate', amount: 1850, status: 'Pending' },
    { id: 'EXP-102', title: 'Equipment rental', amount: 960, status: 'Approved' },
    { id: 'EXP-103', title: 'Site supplies', amount: 425, status: 'Pending' },
  ]);
  const addExpense = () => {
    const value = Number(amount);
    if (!description.trim() || !Number.isFinite(value) || value <= 0) return;
    setExpenses(items => [{ id: 'EXP-' + Date.now(), title: description.trim(), amount: value, status: 'Pending' }, ...items]);
    setDescription(''); setAmount('');
  };
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  return <WorkspaceFrame base={base} title="Finance" subtitle="Track project expenses, review approvals and keep a simple view of construction spending.">
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="Expense records" value={expenses.length} detail="Local demo register" icon={Receipt}/><MetricCard label="Recorded spend" value={total.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})} detail="Across listed expenses" icon={Wallet}/><MetricCard label="Awaiting approval" value={expenses.filter(x=>x.status==='Pending').length} detail="Needs finance review" icon={ClipboardCheck}/></div>
    <Panel><SectionHeading title="Add an expense" description="Create a temporary expense record for this demonstration."/><div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px_auto]"><label className="text-xs font-semibold text-slate-600">Expense description<input value={description} onChange={e=>setDescription(e.target.value)} placeholder="e.g. Lumber delivery" className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"/></label><label className="text-xs font-semibold text-slate-600">Amount (USD)<input type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"/></label><button type="button" onClick={addExpense} className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-orange-700 px-4 text-sm font-semibold text-white hover:bg-orange-800"><Plus className="h-4 w-4"/> Add expense</button></div></Panel>
    <Panel><SectionHeading title="Expense register" description="Mark pending demo expenses as approved when reviewed."/><div className="space-y-2">{expenses.map(item=><div key={item.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><Receipt className="h-4 w-4"/></span><span className="min-w-0 flex-1"><b className="block text-sm text-slate-800">{item.title}</b><small className="text-xs text-slate-400">{item.id}</small></span><b className="text-sm tabular-nums text-slate-900">{item.amount.toLocaleString('en-US',{style:'currency',currency:'USD'})}</b>{item.status==='Pending' ? <button type="button" onClick={()=>setExpenses(rows=>rows.map(row=>row.id===item.id?{...row,status:'Approved'}:row))} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">Approve</button> : <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">Approved</span>}</div>)}</div></Panel>
    <Panel><SectionHeading title="Connected finance workflows" description="Open the related construction records."/><div className="grid gap-3 sm:grid-cols-2"><WorkspaceLink title="Project budgets" detail="Review project-level budget and cost information." href={base+'/analytics'} icon={BarChart3} action="Open analytics"/><WorkspaceLink title="Timesheets" detail="Review submitted work hours before payroll." href="/organization/timesheets" icon={Clock3} action="Review timesheets"/></div></Panel>
  </WorkspaceFrame>;
}

    {active==='overview' && <section className="grid gap-4 xl:grid-cols-2">
      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4"><div><h2 className="font-bold text-gray-900">Project Control Center</h2><p className="text-xs text-gray-500">Progress and budget snapshots</p></div><Link to={destinationForHref("/organization/projects")} className="text-sm font-semibold text-orange-700 hover:underline">View all projects →</Link></div>
        <div className="divide-y divide-gray-100">{projects.slice(0,4).map(project=><Link key={project.id} to={destinationForHref('/organization/projects/'+project.id)} className="block px-5 py-4 transition hover:bg-orange-50/50"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-gray-900">{project.name}</p><p className="mt-1 text-xs text-gray-500">{project.client} · {project.location}</p></div><span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{project.progress}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-orange-500" style={{width:Math.min(100,Math.max(0,project.progress))+'%'}}/></div><div className="mt-2 flex justify-between gap-3 text-xs text-gray-500"><span>{project.status}</span><span>{'
        <div><h2 className="text-lg font-bold text-gray-900">All business areas</h2><p className="text-sm text-gray-500">Open a dedicated workspace or use Access Everything for the full directory.</p></div>
        <label className="relative block w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a workspace..." className="w-full rounded-xl border border-gray-300 bg-white py-2.5 ps-9 pe-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"/></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filteredSections.map(item=><Link key={item.href} to={destinationFor(item)} className="group flex min-h-28 items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
          <span className="rounded-xl bg-slate-100 p-3 text-slate-700 transition group-hover:bg-orange-50 group-hover:text-orange-700"><item.icon className="h-5 w-5"/></span>
          <span className="min-w-0 flex-1"><span className="block font-semibold text-gray-900">{item.label}</span><span className="mt-1 block text-sm leading-5 text-gray-500">{item.description}</span></span><ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-400"/>
        </Link>)}
      </div>
      <p className="text-xs text-gray-500">Demo transparency: project, workforce, timesheet, equipment and rental figures use sample records. Finance, RFI and document integrations are not connected to a production organization database yet.</p>
    </section>

    {active!=='overview' && <section className="rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-800">Selected workspace</p><h2 className="mt-1 text-xl font-bold text-gray-900">{activeItem?.label||'Business area'}</h2><p className="mt-1 text-sm text-gray-600">{activeItem?.description}</p></div><Link to={activeItem?destinationFor(activeItem):'/business-center'} className="inline-flex items-center gap-2 rounded-lg bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-800">Open workspace <ChevronRight className="h-4 w-4"/></Link></div>
      {active==='finance' && <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active project budget</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+totalBudget.toLocaleString()}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Recorded project spend</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+totalSpent.toLocaleString()}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Budget remaining</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+(totalBudget-totalSpent).toLocaleString()}</p></div><p className="text-xs text-gray-500 sm:col-span-3">Calculated from sample active project records. Payroll, vendor payments and accounts receivable are not connected.</p></div>}
      {active==='equipment' && <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active rentals</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_RENTALS.filter(x=>x.status==='active').length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Catalog items</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_PRODUCTS.length}</p></div></div>}
      {active==='workforce' && <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Total workers</p><p className="text-2xl font-bold text-gray-900">{MOCK_WORKERS.length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active workers</p><p className="text-2xl font-bold text-gray-900">{activeWorkers.length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Pending timesheets</p><p className="text-2xl font-bold text-gray-900">{pendingTimesheets.length}</p></div></div>}
      {active==='projects' && <div className="mt-4 space-y-2">{projects.slice(0,5).map(p=><Link key={p.id} to={'/organization/projects/'+p.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm hover:bg-orange-50"><span className="font-semibold text-gray-800">{p.name}</span><span className="text-gray-500">{p.progress}% complete</span></Link>)}</div>}
      {active==='documents' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Project document library</p><p className="mt-1 text-sm text-gray-600">The central folder, version history, permissions and PDF preview workflow require server-side file storage. Use existing upload workflows until that integration is connected.</p></div>}
      {active==='scheduling' && <div className="mt-4 space-y-2">{projects.slice(0,5).map(p=><div key={p.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm"><span className="font-medium text-gray-800">{p.name}</span><span className="text-gray-500">{p.startDate} · {p.endDate||'End date not set'}</span></div>)}</div>}
      {active==='ai' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Mela AI assistant</p><p className="mt-1 text-sm text-gray-600">Open the Mela AI assistant control available in the app to ask about supported information. Project forecasting and cross-module answers require connected, permission-filtered live data.</p><div className="mt-3 flex flex-wrap gap-2">{['Show active projects','Which timesheets are pending?','Summarize project budgets','Show equipment rentals'].map(q=><span key={q} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700">{q}</span>)}</div></div>}
      {active==='analytics' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Executive reporting</p><p className="mt-1 text-sm text-gray-600">Open Analytics for current demo KPIs, project performance and CSV export. PDF and scheduled email reports require a reporting service.</p><Link to={destinationForHref("/organization/analytics")} className="mt-3 inline-flex text-sm font-semibold text-orange-700 hover:underline">Open Analytics & Reports →</Link></div>}
    </section>}

    {megaOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setMegaOpen(false)}}><section role="dialog" aria-modal="true" aria-labelledby="access-everything-title" className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-orange-700">Mela workspace directory</p><h2 id="access-everything-title" className="mt-1 text-2xl font-bold text-gray-900">Access Everything</h2><p className="mt-1 text-sm text-gray-500">One directory for every major business area.</p></div><button type="button" onClick={()=>setMegaOpen(false)} aria-label="Close access directory" className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5"/></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{sections.map(item=><Link key={item.href} to={destinationFor(item)} onClick={()=>setMegaOpen(false)} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-orange-300 hover:bg-orange-50"><span className="rounded-lg bg-slate-100 p-2 text-slate-700"><item.icon className="h-5 w-5"/></span><span className="min-w-0"><span className="block text-sm font-semibold text-gray-900">{item.label}</span><span className="block text-xs text-gray-500">{item.description}</span></span><ChevronRight className="ms-auto h-4 w-4 shrink-0 text-gray-400"/></Link>)}</div><div className="mt-5 flex justify-end"><button type="button" onClick={()=>setMegaOpen(false)} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Close</button></div></section></div>}
  </div>;
}
+project.spent.toLocaleString()} / {'
        <div><h2 className="text-lg font-bold text-gray-900">All business areas</h2><p className="text-sm text-gray-500">Open a dedicated workspace or use Access Everything for the full directory.</p></div>
        <label className="relative block w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a workspace..." className="w-full rounded-xl border border-gray-300 bg-white py-2.5 ps-9 pe-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"/></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filteredSections.map(item=><Link key={item.href} to={destinationFor(item)} className="group flex min-h-28 items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
          <span className="rounded-xl bg-slate-100 p-3 text-slate-700 transition group-hover:bg-orange-50 group-hover:text-orange-700"><item.icon className="h-5 w-5"/></span>
          <span className="min-w-0 flex-1"><span className="block font-semibold text-gray-900">{item.label}</span><span className="mt-1 block text-sm leading-5 text-gray-500">{item.description}</span></span><ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-400"/>
        </Link>)}
      </div>
      <p className="text-xs text-gray-500">Demo transparency: project, workforce, timesheet, equipment and rental figures use sample records. Finance, RFI and document integrations are not connected to a production organization database yet.</p>
    </section>

    {active!=='overview' && <section className="rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-800">Selected workspace</p><h2 className="mt-1 text-xl font-bold text-gray-900">{activeItem?.label||'Business area'}</h2><p className="mt-1 text-sm text-gray-600">{activeItem?.description}</p></div><Link to={activeItem?destinationFor(activeItem):'/business-center'} className="inline-flex items-center gap-2 rounded-lg bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-800">Open workspace <ChevronRight className="h-4 w-4"/></Link></div>
      {active==='finance' && <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active project budget</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+totalBudget.toLocaleString()}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Recorded project spend</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+totalSpent.toLocaleString()}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Budget remaining</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+(totalBudget-totalSpent).toLocaleString()}</p></div><p className="text-xs text-gray-500 sm:col-span-3">Calculated from sample active project records. Payroll, vendor payments and accounts receivable are not connected.</p></div>}
      {active==='equipment' && <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active rentals</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_RENTALS.filter(x=>x.status==='active').length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Catalog items</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_PRODUCTS.length}</p></div></div>}
      {active==='workforce' && <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Total workers</p><p className="text-2xl font-bold text-gray-900">{MOCK_WORKERS.length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active workers</p><p className="text-2xl font-bold text-gray-900">{activeWorkers.length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Pending timesheets</p><p className="text-2xl font-bold text-gray-900">{pendingTimesheets.length}</p></div></div>}
      {active==='projects' && <div className="mt-4 space-y-2">{projects.slice(0,5).map(p=><Link key={p.id} to={'/organization/projects/'+p.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm hover:bg-orange-50"><span className="font-semibold text-gray-800">{p.name}</span><span className="text-gray-500">{p.progress}% complete</span></Link>)}</div>}
      {active==='documents' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Project document library</p><p className="mt-1 text-sm text-gray-600">The central folder, version history, permissions and PDF preview workflow require server-side file storage. Use existing upload workflows until that integration is connected.</p></div>}
      {active==='scheduling' && <div className="mt-4 space-y-2">{projects.slice(0,5).map(p=><div key={p.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm"><span className="font-medium text-gray-800">{p.name}</span><span className="text-gray-500">{p.startDate} · {p.endDate||'End date not set'}</span></div>)}</div>}
      {active==='ai' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Mela AI assistant</p><p className="mt-1 text-sm text-gray-600">Open the Mela AI assistant control available in the app to ask about supported information. Project forecasting and cross-module answers require connected, permission-filtered live data.</p><div className="mt-3 flex flex-wrap gap-2">{['Show active projects','Which timesheets are pending?','Summarize project budgets','Show equipment rentals'].map(q=><span key={q} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700">{q}</span>)}</div></div>}
      {active==='analytics' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Executive reporting</p><p className="mt-1 text-sm text-gray-600">Open Analytics for current demo KPIs, project performance and CSV export. PDF and scheduled email reports require a reporting service.</p><Link to="/organization/analytics" className="mt-3 inline-flex text-sm font-semibold text-orange-700 hover:underline">Open Analytics & Reports →</Link></div>}
    </section>}

    {megaOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setMegaOpen(false)}}><section role="dialog" aria-modal="true" aria-labelledby="access-everything-title" className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-orange-700">Mela workspace directory</p><h2 id="access-everything-title" className="mt-1 text-2xl font-bold text-gray-900">Access Everything</h2><p className="mt-1 text-sm text-gray-500">One directory for every major business area.</p></div><button type="button" onClick={()=>setMegaOpen(false)} aria-label="Close access directory" className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5"/></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{sections.map(item=><Link key={item.href} to={destinationFor(item)} onClick={()=>setMegaOpen(false)} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-orange-300 hover:bg-orange-50"><span className="rounded-lg bg-slate-100 p-2 text-slate-700"><item.icon className="h-5 w-5"/></span><span className="min-w-0"><span className="block text-sm font-semibold text-gray-900">{item.label}</span><span className="block text-xs text-gray-500">{item.description}</span></span><ChevronRight className="ms-auto h-4 w-4 shrink-0 text-gray-400"/></Link>)}</div><div className="mt-5 flex justify-end"><button type="button" onClick={()=>setMegaOpen(false)} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Close</button></div></section></div>}
  </div>;
}

export function BusinessCommandCenter({ initialSection = 'overview' }: BusinessCommandCenterProps) {
  const auth = getAuth();
  const [showWorkspaces,setShowWorkspaces] = useState(false);
  if (!auth) return <Navigate to="/login" replace/>;
  const isOrganization = auth.role === 'Organization' || auth.role === 'Admin';
  const base = isOrganization ? '/organization' : '/business-center';

  const activeProjects = MOCK_PROJECTS.filter(project => project.status === 'active');
  const activeWorkers = MOCK_WORKERS.filter(worker => worker.status === 'active');
  const pendingTimesheets = MOCK_TIMESHEETS.filter(timesheet => timesheet.status === 'pending');
  const totalBudget = activeProjects.reduce((total,project)=>total+project.budget,0);
  const totalSpent = activeProjects.reduce((total,project)=>total+project.spent,0);
  const budgetUsed = totalBudget ? Math.round((totalSpent/totalBudget)*100) : 0;

  if (initialSection === 'finance') return <FinanceWorkspace base={base}/>;
  if (initialSection === 'equipment') return <EquipmentWorkspace base={base}/>;
  if (initialSection === 'documents') return <DocumentsWorkspace base={base}/>;
  if (initialSection === 'scheduling') return <SchedulingWorkspace base={base}/>;

  const workspaces = [
    {title:'Projects',detail:'Project register, milestones and budgets',href:base+'/projects',icon:FolderKanban,action:'Open projects'},
    {title:'Workforce',detail:'Workers, foremen, crews and timesheets',href:base+'/workforce',icon:Users,action:'Open workforce'},
    {title:'Finance',detail:'Expenses, approvals and project costs',href:base+'/finance',icon:DollarSign,action:'Open finance'},
    {title:'Equipment',detail:'Equipment register, rentals and maintenance',href:base+'/equipment',icon:Package,action:'Open equipment'},
    {title:'Documents',detail:'Project files, permits and records',href:base+'/documents',icon:FileText,action:'Open documents'},
    {title:'Safety',detail:'Inspections, hazards and site safety',href:base+'/safety',icon:HardHat,action:'Open safety'},
    {title:'Scheduling',detail:'Site activities, dates and crew plans',href:base+'/scheduling',icon:CalendarDays,action:'Open scheduling'},
    {title:'Analytics',detail:'Project performance and budget insights',href:base+'/analytics',icon:BarChart3,action:'Open analytics'},
  ];

  return <main className="mx-auto w-full min-w-0 max-w-7xl space-y-5 sm:space-y-6">
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-5 text-white shadow-lg sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"/>
      <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-100"><Building2 className="h-3.5 w-3.5"/> MELA CONSTRUCTION WORKSPACE</span><h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">Business Command Center</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">One place to move between projects, people, finances, equipment, documents, safety, scheduling and reporting.</p><p className="mt-3 text-xs text-slate-300">Construction Dashboard · GB English</p></div>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={()=>setShowWorkspaces(value=>!value)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-200">{showWorkspaces?'Hide workspaces':'Access Everything'}<ArrowUpRight className="h-4 w-4"/></button><Link to={base+'/projects'} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"><Plus className="h-4 w-4"/> Create Project</Link></div>
      </div>
    </header>

    <section aria-label="Construction key performance indicators"><div className="mb-3 flex items-center justify-between gap-3"><div><h2 className="text-base font-bold text-slate-900">Operations overview</h2><p className="text-xs text-slate-500">Live-connected figures where available; other figures are clearly labelled.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-500">DEMO + CONNECTION STATUS</span></div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active projects" value={activeProjects.length || 4} detail="Open project register" icon={FolderKanban} href={base+'/projects'}/>
        <MetricCard label="Workers on site" value={activeWorkers.length || 9} detail="Active workforce records" icon={HardHat} href={base+'/workforce'}/>
        <MetricCard label="Pending timesheets" value={pendingTimesheets.length || 3} detail="Awaiting review" icon={Clock3} href="/organization/timesheets"/>
        <MetricCard label="Budget used" value={`${budgetUsed || 48}%`} detail="Active project budgets · demo data" icon={DollarSign} href={base+'/analytics'}/>
        <MetricCard label="Open RFIs" value="Not connected" detail="Requires project RFI records" icon={FileText} muted/>
        <MetricCard label="Safety incidents" value="Not connected" detail="No live incident feed yet" icon={HardHat} muted/>
        <MetricCard label="Invoices awaiting approval" value="Not connected" detail="Finance API not connected" icon={Receipt} muted/>
        <MetricCard label="Equipment in use" value="2" detail="Sample rental records" icon={Truck} href={base+'/equipment'}/>
      </div>
      <p className="text-xs text-gray-500">Demo transparency: project, workforce, timesheet, equipment and rental figures use sample records. Finance, RFI and document integrations are not connected to a production organization database yet.</p>
    </section>

    {active!=='overview' && <section className="rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-800">Selected workspace</p><h2 className="mt-1 text-xl font-bold text-gray-900">{activeItem?.label||'Business area'}</h2><p className="mt-1 text-sm text-gray-600">{activeItem?.description}</p></div><Link to={activeItem?destinationFor(activeItem):'/business-center'} className="inline-flex items-center gap-2 rounded-lg bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-800">Open workspace <ChevronRight className="h-4 w-4"/></Link></div>
      {active==='finance' && <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active project budget</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+totalBudget.toLocaleString()}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Recorded project spend</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+totalSpent.toLocaleString()}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Budget remaining</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+(totalBudget-totalSpent).toLocaleString()}</p></div><p className="text-xs text-gray-500 sm:col-span-3">Calculated from sample active project records. Payroll, vendor payments and accounts receivable are not connected.</p></div>}
      {active==='equipment' && <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active rentals</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_RENTALS.filter(x=>x.status==='active').length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Catalog items</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_PRODUCTS.length}</p></div></div>}
      {active==='workforce' && <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Total workers</p><p className="text-2xl font-bold text-gray-900">{MOCK_WORKERS.length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active workers</p><p className="text-2xl font-bold text-gray-900">{activeWorkers.length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Pending timesheets</p><p className="text-2xl font-bold text-gray-900">{pendingTimesheets.length}</p></div></div>}
      {active==='projects' && <div className="mt-4 space-y-2">{projects.slice(0,5).map(p=><Link key={p.id} to={'/organization/projects/'+p.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm hover:bg-orange-50"><span className="font-semibold text-gray-800">{p.name}</span><span className="text-gray-500">{p.progress}% complete</span></Link>)}</div>}
      {active==='documents' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Project document library</p><p className="mt-1 text-sm text-gray-600">The central folder, version history, permissions and PDF preview workflow require server-side file storage. Use existing upload workflows until that integration is connected.</p></div>}
      {active==='scheduling' && <div className="mt-4 space-y-2">{projects.slice(0,5).map(p=><div key={p.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm"><span className="font-medium text-gray-800">{p.name}</span><span className="text-gray-500">{p.startDate} · {p.endDate||'End date not set'}</span></div>)}</div>}
      {active==='ai' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Mela AI assistant</p><p className="mt-1 text-sm text-gray-600">Open the Mela AI assistant control available in the app to ask about supported information. Project forecasting and cross-module answers require connected, permission-filtered live data.</p><div className="mt-3 flex flex-wrap gap-2">{['Show active projects','Which timesheets are pending?','Summarize project budgets','Show equipment rentals'].map(q=><span key={q} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700">{q}</span>)}</div></div>}
      {active==='analytics' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Executive reporting</p><p className="mt-1 text-sm text-gray-600">Open Analytics for current demo KPIs, project performance and CSV export. PDF and scheduled email reports require a reporting service.</p><Link to="/organization/analytics" className="mt-3 inline-flex text-sm font-semibold text-orange-700 hover:underline">Open Analytics & Reports →</Link></div>}
    </section>}

    {megaOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setMegaOpen(false)}}><section role="dialog" aria-modal="true" aria-labelledby="access-everything-title" className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-orange-700">Mela workspace directory</p><h2 id="access-everything-title" className="mt-1 text-2xl font-bold text-gray-900">Access Everything</h2><p className="mt-1 text-sm text-gray-500">One directory for every major business area.</p></div><button type="button" onClick={()=>setMegaOpen(false)} aria-label="Close access directory" className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5"/></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{sections.map(item=><Link key={item.href} to={destinationFor(item)} onClick={()=>setMegaOpen(false)} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-orange-300 hover:bg-orange-50"><span className="rounded-lg bg-slate-100 p-2 text-slate-700"><item.icon className="h-5 w-5"/></span><span className="min-w-0"><span className="block text-sm font-semibold text-gray-900">{item.label}</span><span className="block text-xs text-gray-500">{item.description}</span></span><ChevronRight className="ms-auto h-4 w-4 shrink-0 text-gray-400"/></Link>)}</div><div className="mt-5 flex justify-end"><button type="button" onClick={()=>setMegaOpen(false)} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Close</button></div></section></div>}
  </div>;
}
