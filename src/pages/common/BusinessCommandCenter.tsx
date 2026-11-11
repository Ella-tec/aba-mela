import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Users, HardHat, ClipboardList, DollarSign,
  Truck, FileText, ShieldCheck, CalendarDays, BarChart3, Bot, Settings,
  Trash2, ChevronRight, X, Plus, AlertTriangle,
  Receipt, Package, Clock3, Building2, Search, Sparkles, ClipboardCheck
} from 'lucide-react';
import { getAuth } from '@/lib/auth';
import { MOCK_PROJECTS, MOCK_WORKERS, MOCK_TIMESHEETS, MOCK_RENTALS, MOCK_PRODUCTS } from '@/data/mock';

type HubSection = 'overview'|'projects'|'workforce'|'finance'|'equipment'|'documents'|'safety'|'scheduling'|'analytics'|'ai'|'settings';
type HubLink = { id: HubSection; label: string; description: string; icon: typeof Building2; href: string };
const sections: HubLink[] = [
  { id:'overview', label:'Overview', description:'Your construction operations at a glance', icon:LayoutDashboard, href:'/business-center' },
  { id:'projects', label:'Projects', description:'Project list, milestones and change control', icon:FolderKanban, href:'/business-center/projects' },
  { id:'workforce', label:'Workforce', description:'Employees, foremen, crews and certifications', icon:Users, href:'/business-center/workforce' },
  { id:'finance', label:'Finance', description:'Project budgets, costs, invoices and payments', icon:DollarSign, href:'/business-center/finance' },
  { id:'equipment', label:'Equipment', description:'Assets, rentals, tools and maintenance', icon:Truck, href:'/business-center/equipment' },
  { id:'documents', label:'Documents', description:'Project files, permits, contracts and reports', icon:FileText, href:'/business-center/documents' },
  { id:'safety', label:'Safety', description:'Incidents, toolbox talks, PPE and inspections', icon:ShieldCheck, href:'/business-center/safety' },
  { id:'scheduling', label:'Scheduling', description:'Crew plans, project dates and inspections', icon:CalendarDays, href:'/business-center/scheduling' },
  { id:'analytics', label:'Analytics', description:'Performance, budget variance and utilization', icon:BarChart3, href:'/business-center/analytics' },
  { id:'ai', label:'Mela AI', description:'Ask questions about your Mela workspace', icon:Bot, href:'/business-center/ai' },
  { id:'settings', label:'Settings', description:'Workspace preferences and administration', icon:Settings, href:'/organization/settings' },
  { id:'overview', label:'Recycle Bin', description:'Restore supported deleted records', icon:Trash2, href:'/organization/recycle-bin' }
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
  const destinationForHref=(href:string)=>organizationRole&&href.startsWith('/business-center')
    ? '/organization'+href.slice('/business-center'.length)
    : href;
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
    {label:'Safety Center',href:'/business-center/safety',icon:ShieldCheck},
    {label:'Scheduling Center',href:'/business-center/scheduling',icon:CalendarDays},
    {label:'Equipment register',href:'/business-center/equipment',icon:Truck},
    {label:'View reports',href:'/business-center/analytics',icon:BarChart3},
    {label:'Mela AI Assistant',href:'/business-center/ai',icon:Bot},
    {label:'Open Recycle Bin',href:destinationFor(sections[sections.length-1]),icon:Trash2}
  ];

  return <div className="mx-auto max-w-[1500px] space-y-6">
    <header className="flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:p-8">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-orange-100"><Building2 className="h-3.5 w-3.5"/> MELA CONSTRUCTION WORKSPACE</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Business Command Center</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200">One place to move between projects, people, finances, equipment, documents, safety, scheduling and reporting.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={()=>setMegaOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 shadow transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Sparkles className="h-4 w-4"/> Access Everything</button>
        <Link to="/organization/projects" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"><Plus className="h-4 w-4"/> Create Project</Link>
      </div>
    </header>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Active projects" value={activeProjects.length} detail="Open project register" icon={FolderKanban} to="/organization/projects"/>
      <Metric label="Workers on site" value={activeWorkers.length} detail="Active workforce records" icon={HardHat} to="/organization/workforce"/>
      <Metric label="Pending timesheets" value={pendingTimesheets.length} detail="Awaiting review" icon={Clock3} to="/organization/timesheets"/>
      <Metric label="Budget used" value={budgetPercent+'%'} detail="Active project budgets · demo data" icon={DollarSign} to="/organization/analytics"/>
      <Metric label="Open RFIs" value="Not connected" detail="Requires project RFI records" icon={ClipboardCheck} to="/business-center/projects"/>
      <Metric label="Safety incidents" value="Not connected" detail="No live incident feed yet" icon={AlertTriangle} to="/business-center/safety"/>
      <Metric label="Invoices awaiting approval" value="Not connected" detail="Finance API not connected" icon={Receipt} to="/business-center/finance"/>
      <Metric label="Equipment in use" value={MOCK_RENTALS.filter(x=>x.status==='active').length} detail="Sample rental records" icon={Truck} to="/business-center/equipment"/>
    </div>

    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div><h2 className="text-lg font-bold text-gray-900">Quick actions</h2><p className="text-sm text-gray-500">Jump directly to common construction workflows.</p></div>
        <span className="text-xs text-gray-400">Choose an action to open its workspace</span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {actionLinks.map(item=><Link key={item.label} to={destinationForHref(item.href)} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"><span className="rounded-lg bg-orange-50 p-2 text-orange-700"><item.icon className="h-4 w-4"/></span>{item.label}<ChevronRight className="ms-auto h-4 w-4 text-gray-400"/></Link>)}
      </div>
    </section>

    {active==='overview' && <section className="grid gap-4 xl:grid-cols-2">
      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4"><div><h2 className="font-bold text-gray-900">Project Control Center</h2><p className="text-xs text-gray-500">Progress and budget snapshots</p></div><Link to="/organization/projects" className="text-sm font-semibold text-orange-700 hover:underline">View all projects →</Link></div>
        <div className="divide-y divide-gray-100">{projects.slice(0,4).map(project=><Link key={project.id} to={'/organization/projects/'+project.id} className="block px-5 py-4 transition hover:bg-orange-50/50"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-gray-900">{project.name}</p><p className="mt-1 text-xs text-gray-500">{project.client} · {project.location}</p></div><span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{project.progress}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-orange-500" style={{width:Math.min(100,Math.max(0,project.progress))+'%'}}/></div><div className="mt-2 flex justify-between gap-3 text-xs text-gray-500"><span>{project.status}</span><span>{'
        <div><h2 className="text-lg font-bold text-gray-900">All business areas</h2><p className="text-sm text-gray-500">Open a dedicated workspace or use Access Everything for the full directory.</p></div>
        <label className="relative block w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a workspace..." className="w-full rounded-xl border border-gray-300 bg-white py-2.5 ps-9 pe-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"/></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filteredSections.map(item=><Link key={item.href} to={destinationFor(item)} className="group flex min-h-28 items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
          <span className="rounded-xl bg-slate-100 p-3 text-slate-700 transition group-hover:bg-orange-50 group-hover:text-orange-700"><item.icon className="h-5 w-5"/></span>
          <span className="min-w-0 flex-1"><span className="block font-semibold text-gray-900">{item.label}</span><span className="mt-1 block text-sm leading-5 text-gray-500">{item.description}</span></span><ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-400"/>
        </Link>)}
      </div>
      <p className="text-xs text-gray-500">Demo transparency: project, workforce, timesheet, equipment and rental figures use sample records. Finance, RFI, safety and document integrations are not connected to a production organization database yet.</p>
    </section>

    {active!=='overview' && <section className="rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-800">Selected workspace</p><h2 className="mt-1 text-xl font-bold text-gray-900">{activeItem?.label||'Business area'}</h2><p className="mt-1 text-sm text-gray-600">{activeItem?.description}</p></div><Link to={activeItem?destinationFor(activeItem):'/business-center'} className="inline-flex items-center gap-2 rounded-lg bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-800">Open workspace <ChevronRight className="h-4 w-4"/></Link></div>
      {active==='finance' && <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active project budget</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+totalBudget.toLocaleString()}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Recorded project spend</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+totalSpent.toLocaleString()}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Budget remaining</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+(totalBudget-totalSpent).toLocaleString()}</p></div><p className="text-xs text-gray-500 sm:col-span-3">Calculated from sample active project records. Payroll, vendor payments and accounts receivable are not connected.</p></div>}
      {active==='equipment' && <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active rentals</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_RENTALS.filter(x=>x.status==='active').length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Catalog items</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_PRODUCTS.length}</p></div></div>}
      {active==='workforce' && <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Total workers</p><p className="text-2xl font-bold text-gray-900">{MOCK_WORKERS.length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active workers</p><p className="text-2xl font-bold text-gray-900">{activeWorkers.length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Pending timesheets</p><p className="text-2xl font-bold text-gray-900">{pendingTimesheets.length}</p></div></div>}
      {active==='projects' && <div className="mt-4 space-y-2">{projects.slice(0,5).map(p=><Link key={p.id} to={'/organization/projects/'+p.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm hover:bg-orange-50"><span className="font-semibold text-gray-800">{p.name}</span><span className="text-gray-500">{p.progress}% complete</span></Link>)}</div>}
      {active==='safety' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Safety register is ready for connection</p><p className="mt-1 text-sm text-gray-600">Incident reporting, OSHA records, PPE checks, toolbox talks and site audits need a secured organization API and permission model before they can be treated as official records.</p></div>}
      {active==='documents' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Project document library</p><p className="mt-1 text-sm text-gray-600">The central folder, version history, permissions and PDF preview workflow require server-side file storage. Use existing upload workflows until that integration is connected.</p></div>}
      {active==='scheduling' && <div className="mt-4 space-y-2">{projects.slice(0,5).map(p=><div key={p.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm"><span className="font-medium text-gray-800">{p.name}</span><span className="text-gray-500">{p.startDate} · {p.endDate||'End date not set'}</span></div>)}</div>}
      {active==='ai' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Mela AI assistant</p><p className="mt-1 text-sm text-gray-600">Open the Mela AI assistant control available in the app to ask about supported information. Project forecasting and cross-module answers require connected, permission-filtered live data.</p><div className="mt-3 flex flex-wrap gap-2">{['Show active projects','Which timesheets are pending?','Summarize project budgets','Show equipment rentals'].map(q=><span key={q} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700">{q}</span>)}</div></div>}
      {active==='analytics' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Executive reporting</p><p className="mt-1 text-sm text-gray-600">Open Analytics for current demo KPIs, project performance and CSV export. PDF and scheduled email reports require a reporting service.</p><Link to="/organization/analytics" className="mt-3 inline-flex text-sm font-semibold text-orange-700 hover:underline">Open Analytics & Reports →</Link></div>}
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
      <p className="text-xs text-gray-500">Demo transparency: project, workforce, timesheet, equipment and rental figures use sample records. Finance, RFI, safety and document integrations are not connected to a production organization database yet.</p>
    </section>

    {active!=='overview' && <section className="rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-800">Selected workspace</p><h2 className="mt-1 text-xl font-bold text-gray-900">{activeItem?.label||'Business area'}</h2><p className="mt-1 text-sm text-gray-600">{activeItem?.description}</p></div><Link to={activeItem?destinationFor(activeItem):'/business-center'} className="inline-flex items-center gap-2 rounded-lg bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-800">Open workspace <ChevronRight className="h-4 w-4"/></Link></div>
      {active==='finance' && <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active project budget</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+totalBudget.toLocaleString()}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Recorded project spend</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+totalSpent.toLocaleString()}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Budget remaining</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+(totalBudget-totalSpent).toLocaleString()}</p></div><p className="text-xs text-gray-500 sm:col-span-3">Calculated from sample active project records. Payroll, vendor payments and accounts receivable are not connected.</p></div>}
      {active==='equipment' && <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active rentals</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_RENTALS.filter(x=>x.status==='active').length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Catalog items</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_PRODUCTS.length}</p></div></div>}
      {active==='workforce' && <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Total workers</p><p className="text-2xl font-bold text-gray-900">{MOCK_WORKERS.length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active workers</p><p className="text-2xl font-bold text-gray-900">{activeWorkers.length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Pending timesheets</p><p className="text-2xl font-bold text-gray-900">{pendingTimesheets.length}</p></div></div>}
      {active==='projects' && <div className="mt-4 space-y-2">{projects.slice(0,5).map(p=><Link key={p.id} to={'/organization/projects/'+p.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm hover:bg-orange-50"><span className="font-semibold text-gray-800">{p.name}</span><span className="text-gray-500">{p.progress}% complete</span></Link>)}</div>}
      {active==='safety' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Safety register is ready for connection</p><p className="mt-1 text-sm text-gray-600">Incident reporting, OSHA records, PPE checks, toolbox talks and site audits need a secured organization API and permission model before they can be treated as official records.</p></div>}
      {active==='documents' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Project document library</p><p className="mt-1 text-sm text-gray-600">The central folder, version history, permissions and PDF preview workflow require server-side file storage. Use existing upload workflows until that integration is connected.</p></div>}
      {active==='scheduling' && <div className="mt-4 space-y-2">{projects.slice(0,5).map(p=><div key={p.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm"><span className="font-medium text-gray-800">{p.name}</span><span className="text-gray-500">{p.startDate} · {p.endDate||'End date not set'}</span></div>)}</div>}
      {active==='ai' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Mela AI assistant</p><p className="mt-1 text-sm text-gray-600">Open the Mela AI assistant control available in the app to ask about supported information. Project forecasting and cross-module answers require connected, permission-filtered live data.</p><div className="mt-3 flex flex-wrap gap-2">{['Show active projects','Which timesheets are pending?','Summarize project budgets','Show equipment rentals'].map(q=><span key={q} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700">{q}</span>)}</div></div>}
      {active==='analytics' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Executive reporting</p><p className="mt-1 text-sm text-gray-600">Open Analytics for current demo KPIs, project performance and CSV export. PDF and scheduled email reports require a reporting service.</p><Link to="/organization/analytics" className="mt-3 inline-flex text-sm font-semibold text-orange-700 hover:underline">Open Analytics & Reports →</Link></div>}
    </section>}

    {megaOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setMegaOpen(false)}}><section role="dialog" aria-modal="true" aria-labelledby="access-everything-title" className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-orange-700">Mela workspace directory</p><h2 id="access-everything-title" className="mt-1 text-2xl font-bold text-gray-900">Access Everything</h2><p className="mt-1 text-sm text-gray-500">One directory for every major business area.</p></div><button type="button" onClick={()=>setMegaOpen(false)} aria-label="Close access directory" className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5"/></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{sections.map(item=><Link key={item.href} to={destinationFor(item)} onClick={()=>setMegaOpen(false)} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-orange-300 hover:bg-orange-50"><span className="rounded-lg bg-slate-100 p-2 text-slate-700"><item.icon className="h-5 w-5"/></span><span className="min-w-0"><span className="block text-sm font-semibold text-gray-900">{item.label}</span><span className="block text-xs text-gray-500">{item.description}</span></span><ChevronRight className="ms-auto h-4 w-4 shrink-0 text-gray-400"/></Link>)}</div><div className="mt-5 flex justify-end"><button type="button" onClick={()=>setMegaOpen(false)} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Close</button></div></section></div>}
  </div>;
}
+project.budget.toLocaleString()}</span></div></Link>)}</div>
      </article>
      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4"><div><h2 className="font-bold text-gray-900">Workforce Center</h2><p className="text-xs text-gray-500">Team and timesheet overview</p></div><Link to="/organization/workforce" className="text-sm font-semibold text-orange-700 hover:underline">Manage workforce →</Link></div>
        <div className="grid grid-cols-2 gap-3 p-5"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-gray-500">Total workers</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_WORKERS.length}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-gray-500">Active workers</p><p className="mt-1 text-2xl font-bold text-gray-900">{activeWorkers.length}</p></div><div className="rounded-xl bg-amber-50 p-3"><p className="text-xs text-amber-800">Pending timesheets</p><p className="mt-1 text-2xl font-bold text-gray-900">{pendingTimesheets.length}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-gray-500">Foremen</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_WORKERS.filter(worker=>worker.role.toLowerCase().includes('foreman')).length}</p></div></div>
        <div className="border-t border-gray-100 px-5 py-3"><Link to="/organization/timesheets" className="text-sm font-semibold text-orange-700 hover:underline">Review pending timesheets →</Link></div>
      </article>
    </section>}

    <section className="space-y-3">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div><h2 className="text-lg font-bold text-gray-900">All business areas</h2><p className="text-sm text-gray-500">Open a dedicated workspace or use Access Everything for the full directory.</p></div>
        <label className="relative block w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a workspace..." className="w-full rounded-xl border border-gray-300 bg-white py-2.5 ps-9 pe-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"/></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filteredSections.map(item=><Link key={item.href} to={destinationFor(item)} className="group flex min-h-28 items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
          <span className="rounded-xl bg-slate-100 p-3 text-slate-700 transition group-hover:bg-orange-50 group-hover:text-orange-700"><item.icon className="h-5 w-5"/></span>
          <span className="min-w-0 flex-1"><span className="block font-semibold text-gray-900">{item.label}</span><span className="mt-1 block text-sm leading-5 text-gray-500">{item.description}</span></span><ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-400"/>
        </Link>)}
      </div>
      <p className="text-xs text-gray-500">Demo transparency: project, workforce, timesheet, equipment and rental figures use sample records. Finance, RFI, safety and document integrations are not connected to a production organization database yet.</p>
    </section>

    {active!=='overview' && <section className="rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-800">Selected workspace</p><h2 className="mt-1 text-xl font-bold text-gray-900">{activeItem?.label||'Business area'}</h2><p className="mt-1 text-sm text-gray-600">{activeItem?.description}</p></div><Link to={activeItem?destinationFor(activeItem):'/business-center'} className="inline-flex items-center gap-2 rounded-lg bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-800">Open workspace <ChevronRight className="h-4 w-4"/></Link></div>
      {active==='finance' && <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active project budget</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+totalBudget.toLocaleString()}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Recorded project spend</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+totalSpent.toLocaleString()}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Budget remaining</p><p className="mt-1 text-xl font-bold text-gray-900">{'$'+(totalBudget-totalSpent).toLocaleString()}</p></div><p className="text-xs text-gray-500 sm:col-span-3">Calculated from sample active project records. Payroll, vendor payments and accounts receivable are not connected.</p></div>}
      {active==='equipment' && <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active rentals</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_RENTALS.filter(x=>x.status==='active').length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Catalog items</p><p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_PRODUCTS.length}</p></div></div>}
      {active==='workforce' && <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Total workers</p><p className="text-2xl font-bold text-gray-900">{MOCK_WORKERS.length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Active workers</p><p className="text-2xl font-bold text-gray-900">{activeWorkers.length}</p></div><div className="rounded-xl bg-white p-4"><p className="text-sm text-gray-500">Pending timesheets</p><p className="text-2xl font-bold text-gray-900">{pendingTimesheets.length}</p></div></div>}
      {active==='projects' && <div className="mt-4 space-y-2">{projects.slice(0,5).map(p=><Link key={p.id} to={'/organization/projects/'+p.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm hover:bg-orange-50"><span className="font-semibold text-gray-800">{p.name}</span><span className="text-gray-500">{p.progress}% complete</span></Link>)}</div>}
      {active==='safety' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Safety register is ready for connection</p><p className="mt-1 text-sm text-gray-600">Incident reporting, OSHA records, PPE checks, toolbox talks and site audits need a secured organization API and permission model before they can be treated as official records.</p></div>}
      {active==='documents' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Project document library</p><p className="mt-1 text-sm text-gray-600">The central folder, version history, permissions and PDF preview workflow require server-side file storage. Use existing upload workflows until that integration is connected.</p></div>}
      {active==='scheduling' && <div className="mt-4 space-y-2">{projects.slice(0,5).map(p=><div key={p.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm"><span className="font-medium text-gray-800">{p.name}</span><span className="text-gray-500">{p.startDate} · {p.endDate||'End date not set'}</span></div>)}</div>}
      {active==='ai' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Mela AI assistant</p><p className="mt-1 text-sm text-gray-600">Open the Mela AI assistant control available in the app to ask about supported information. Project forecasting and cross-module answers require connected, permission-filtered live data.</p><div className="mt-3 flex flex-wrap gap-2">{['Show active projects','Which timesheets are pending?','Summarize project budgets','Show equipment rentals'].map(q=><span key={q} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700">{q}</span>)}</div></div>}
      {active==='analytics' && <div className="mt-4 rounded-xl bg-white p-4"><p className="font-semibold text-gray-900">Executive reporting</p><p className="mt-1 text-sm text-gray-600">Open Analytics for current demo KPIs, project performance and CSV export. PDF and scheduled email reports require a reporting service.</p><Link to="/organization/analytics" className="mt-3 inline-flex text-sm font-semibold text-orange-700 hover:underline">Open Analytics & Reports →</Link></div>}
    </section>}

    {megaOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setMegaOpen(false)}}><section role="dialog" aria-modal="true" aria-labelledby="access-everything-title" className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-orange-700">Mela workspace directory</p><h2 id="access-everything-title" className="mt-1 text-2xl font-bold text-gray-900">Access Everything</h2><p className="mt-1 text-sm text-gray-500">One directory for every major business area.</p></div><button type="button" onClick={()=>setMegaOpen(false)} aria-label="Close access directory" className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5"/></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{sections.map(item=><Link key={item.href} to={destinationFor(item)} onClick={()=>setMegaOpen(false)} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-orange-300 hover:bg-orange-50"><span className="rounded-lg bg-slate-100 p-2 text-slate-700"><item.icon className="h-5 w-5"/></span><span className="min-w-0"><span className="block text-sm font-semibold text-gray-900">{item.label}</span><span className="block text-xs text-gray-500">{item.description}</span></span><ChevronRight className="ms-auto h-4 w-4 shrink-0 text-gray-400"/></Link>)}</div><div className="mt-5 flex justify-end"><button type="button" onClick={()=>setMegaOpen(false)} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Close</button></div></section></div>}
  </div>;
}
