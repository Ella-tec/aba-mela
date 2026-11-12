import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  FolderKanban, HardHat, Clock3, DollarSign, Plus, ArrowUpRight,
  Building2, Users, UserCog, FileText, CalendarDays, Package,
  Receipt, ClipboardCheck, Truck, CheckCircle2, Circle, Search,
  Upload, Wallet, ChartNoAxesCombined
} from 'lucide-react';
import { getAuth } from '@/lib/auth';
import { MOCK_PROJECTS, MOCK_WORKERS, MOCK_TIMESHEETS } from '@/data/mock';

type HubSection =
  | 'overview' | 'projects' | 'workforce' | 'finance' | 'equipment'
  | 'documents' | 'safety' | 'scheduling' | 'analytics' | 'ai' | 'settings';

type BusinessCommandCenterProps = { initialSection?: HubSection };

type IconType = typeof FolderKanban;

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}>{children}</section>;
}

function SectionHeading({ title, description, action }: {
  title: string; description: string; action?: React.ReactNode;
}) {
  return <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
    <div><h2 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div>
    {action}
  </div>;
}

function MetricCard({ label, value, detail, icon: Icon, href, muted = false }: {
  label: string; value: string | number; detail: string; icon: IconType; href?: string; muted?: boolean;
}) {
  const body = <div className={`flex h-full min-w-0 items-start gap-3 rounded-xl border p-3.5 transition sm:p-4 ${muted ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-white hover:border-orange-300 hover:shadow-sm'}`}>
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${muted ? 'bg-slate-200 text-slate-500' : 'bg-orange-50 text-orange-700'}`}><Icon className="h-5 w-5"/></span>
    <span className="min-w-0 flex-1"><span className="block text-xs font-medium text-slate-500">{label}</span><strong className="mt-1 block text-xl font-bold text-slate-900 sm:text-2xl">{value}</strong><span className="mt-0.5 block text-xs leading-5 text-slate-500">{detail}</span></span>
    {href && <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-400"/>}
  </div>;
  return href ? <Link to={href} className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">{body}</Link> : body;
}

function WorkspaceLink({ title, detail, href, icon: Icon, action }: {
  title: string; detail: string; href: string; icon: IconType; action: string;
}) {
  return <Link to={href} className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-orange-300 hover:bg-orange-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:p-4">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-orange-100 group-hover:text-orange-800"><Icon className="h-5 w-5"/></span>
    <span className="min-w-0 flex-1"><strong className="block text-sm text-slate-900">{title}</strong><span className="mt-0.5 block text-xs leading-5 text-slate-500">{detail}</span><span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-700">{action}<ArrowUpRight className="h-3.5 w-3.5"/></span></span>
  </Link>;
}

function WorkspaceFrame({ title, subtitle, children, base }: {
  title: string; subtitle: string; children: React.ReactNode; base: string;
}) {
  return <main className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-orange-700">Mela construction workspace</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p></div>
      <Link to={base + '/business-center'} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Building2 className="h-4 w-4"/> Dashboard</Link>
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
    <Panel><SectionHeading title="Connected finance workflows" description="Open the related construction records."/><div className="grid gap-3 sm:grid-cols-2"><WorkspaceLink title="Project budgets" detail="Review project-level budget and cost information." href={base+'/analytics'} icon={ChartNoAxesCombined} action="Open analytics"/><WorkspaceLink title="Timesheets" detail="Review submitted work hours before payroll." href="/organization/timesheets" icon={Clock3} action="Review timesheets"/></div></Panel>
  </WorkspaceFrame>;
}

function EquipmentWorkspace({ base }: { base: string }) {
  const [items,setItems] = useState([
    {id:'EQ-01',name:'Concrete mixer',category:'Heavy tools',status:'In use',project:'Brookside renovation'},
    {id:'EQ-02',name:'Mobile scaffolding',category:'Access equipment',status:'In use',project:'Office fit-out'},
    {id:'EQ-03',name:'Plate compactor',category:'Groundwork',status:'Available',project:'—'},
    {id:'EQ-04',name:'Portable generator',category:'Power',status:'Available',project:'—'},
  ]);
  const [query,setQuery] = useState('');
  const visible = items.filter(x=>(x.name+' '+x.category+' '+x.project).toLowerCase().includes(query.toLowerCase()));
  return <WorkspaceFrame base={base} title="Equipment" subtitle="See what is available, check equipment in or out, and keep a simple maintenance watchlist.">
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="Equipment records" value={items.length} detail="Sample equipment register" icon={Package}/><MetricCard label="Currently in use" value={items.filter(x=>x.status==='In use').length} detail="Assigned to a project" icon={HardHat}/><MetricCard label="Available" value={items.filter(x=>x.status==='Available').length} detail="Ready for assignment" icon={CheckCircle2}/></div>
    <Panel><SectionHeading title="Equipment register" description="Use the action to check an item out or mark it returned."/><label className="relative mb-3 block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search equipment…" className="min-h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-orange-500 sm:max-w-sm"/></label><div className="space-y-2">{visible.map(item=><div key={item.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-700"><Package className="h-5 w-5"/></span><span className="min-w-0 flex-1"><b className="block text-sm text-slate-900">{item.name}</b><small className="text-xs text-slate-500">{item.id} · {item.category} · {item.project}</small></span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status==='In use'?'bg-blue-50 text-blue-700':'bg-emerald-50 text-emerald-700'}`}>{item.status}</span><button type="button" onClick={()=>setItems(rows=>rows.map(row=>row.id===item.id?{...row,status:row.status==='In use'?'Available':'In use',project:row.status==='In use'?'—':'Demo project'}:row))} className="min-h-9 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">{item.status==='In use'?'Mark returned':'Check out'}</button></div>)}{visible.length===0&&<p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No equipment matches your search.</p>}</div></Panel>
    <Panel><SectionHeading title="Maintenance checklist" description="Use these reminders during your next equipment inspection."/>{['Check guards, cables and safety controls','Review service dates and operating hours','Confirm operator training and authorization'].map(x=><div key={x} className="flex items-center gap-2 border-b border-slate-100 py-2 last:border-0"><Circle className="h-4 w-4 text-slate-400"/><span className="text-sm text-slate-700">{x}</span></div>)}</Panel>
  </WorkspaceFrame>;
}

function DocumentsWorkspace({ base }: { base: string }) {
  const [title,setTitle] = useState('');
  const [category,setCategory] = useState('Project document');
  const [documents,setDocuments] = useState([
    {id:'DOC-101',title:'Brookside project scope',category:'Project document',date:'2026-11-04'},
    {id:'DOC-102',title:'Site safety plan',category:'Safety',date:'2026-11-06'},
    {id:'DOC-103',title:'Supplier delivery receipt',category:'Invoice / receipt',date:'2026-11-08'},
  ]);
  const [fileName,setFileName] = useState('');
  const addDocument = () => {
    if(!title.trim()) return;
    setDocuments(rows=>[{id:'DOC-'+Date.now(),title:title.trim(),category,date:new Date().toISOString().slice(0,10)},...rows]);
    setTitle(''); setFileName('');
  };
  return <WorkspaceFrame base={base} title="Documents" subtitle="Organize project documents, safety records, permits and receipts in one easy-to-find register.">
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="Document records" value={documents.length} detail="Temporary register" icon={FileText}/><MetricCard label="Categories" value={new Set(documents.map(x=>x.category)).size} detail="Types in this register" icon={FolderKanban}/><MetricCard label="Storage" value="Demo only" detail="Secure cloud storage not connected" icon={Upload} muted/></div>
    <Panel><SectionHeading title="Add a document record" description="Choose a local file and add a searchable record. This demo does not upload file contents to a server."/><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-600">Document title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter a document name" className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-orange-500"/></label><label className="text-xs font-semibold text-slate-600">Category<select value={category} onChange={e=>setCategory(e.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal"><option>Project document</option><option>Safety</option><option>Permit</option><option>Contract</option><option>Invoice / receipt</option><option>Inspection</option></select></label></div><label className="mt-3 block text-xs font-semibold text-slate-600">Choose a file (optional)<input type="file" onChange={e=>setFileName(e.target.files?.[0]?.name||'')} className="mt-1.5 block w-full rounded-lg border border-dashed border-slate-300 p-3 text-sm font-normal text-slate-600 file:me-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold"/></label>{fileName&&<p className="mt-2 text-xs text-slate-500">Selected file: {fileName} · File contents are not uploaded in this demo.</p>}<button type="button" onClick={addDocument} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"><Plus className="h-4 w-4"/> Add document record</button></Panel>
    <Panel><SectionHeading title="Document register" description="Your current demo records, newest first."/><div className="space-y-2">{documents.map(doc=><div key={doc.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><FileText className="h-5 w-5"/></span><span className="min-w-0 flex-1"><b className="block text-sm text-slate-900">{doc.title}</b><small className="text-xs text-slate-500">{doc.id} · {doc.category} · {doc.date}</small></span><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">Demo record</span></div>)}</div></Panel>
  </WorkspaceFrame>;
}

function SchedulingWorkspace({ base }: { base: string }) {
  const [task,setTask] = useState('');
  const [date,setDate] = useState(new Date().toISOString().slice(0,10));
  const [tasks,setTasks] = useState([
    {id:'SCH-01',task:'Brookside site walk-through',date:'2026-11-13',done:false},
    {id:'SCH-02',task:'Office fit-out material delivery',date:'2026-11-14',done:false},
    {id:'SCH-03',task:'Weekly crew safety briefing',date:'2026-11-12',done:true},
  ]);
  const addTask = () => { if(!task.trim()||!date)return; setTasks(rows=>[{id:'SCH-'+Date.now(),task:task.trim(),date,done:false},...rows]);setTask(''); };
  const pending = tasks.filter(x=>!x.done).length;
  return <WorkspaceFrame base={base} title="Scheduling" subtitle="Plan site activities, track upcoming work and mark completed tasks for your team.">
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="Scheduled activities" value={tasks.length} detail="Local schedule items" icon={CalendarDays}/><MetricCard label="Upcoming / open" value={pending} detail="Still to be completed" icon={Clock3}/><MetricCard label="Completed" value={tasks.length-pending} detail="Marked complete" icon={CheckCircle2}/></div>
    <Panel><SectionHeading title="Schedule an activity" description="Add a task and due date to the temporary site schedule."/><div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_auto]"><label className="text-xs font-semibold text-slate-600">Activity<input value={task} onChange={e=>setTask(e.target.value)} placeholder="e.g. Concrete inspection" className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-orange-500"/></label><label className="text-xs font-semibold text-slate-600">Date<input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal"/></label><button type="button" onClick={addTask} className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-orange-700 px-4 text-sm font-semibold text-white hover:bg-orange-800"><Plus className="h-4 w-4"/> Add activity</button></div></Panel>
    <Panel><SectionHeading title="Site activity plan" description="Select an item to mark it complete or reopen it."/><div className="space-y-2">{tasks.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(item=><button key={item.id} type="button" onClick={()=>setTasks(rows=>rows.map(row=>row.id===item.id?{...row,done:!row.done}:row))} className="flex w-full flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50"><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.done?'bg-emerald-50 text-emerald-700':'bg-orange-50 text-orange-700'}`}>{item.done?<CheckCircle2 className="h-5 w-5"/>:<CalendarDays className="h-5 w-5"/>}</span><span className="min-w-0 flex-1"><b className={`block text-sm ${item.done?'text-slate-400 line-through':'text-slate-900'}`}>{item.task}</b><small className="text-xs text-slate-500">{item.date}</small></span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.done?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-800'}`}>{item.done?'Completed':'Open'}</span></button>)}</div></Panel>
    <Panel><SectionHeading title="Related planning tools" description="Jump to the workforce and time records."/><div className="grid gap-3 sm:grid-cols-2"><WorkspaceLink title="Workforce" detail="Review active workers and crew assignments." href="/organization/workforce" icon={Users} action="Open workforce"/><WorkspaceLink title="Timesheets" detail="Review hours submitted by workers." href="/organization/timesheets" icon={ClipboardCheck} action="Open timesheets"/></div></Panel>
  </WorkspaceFrame>;
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
    {title:'Analytics',detail:'Project performance and budget insights',href:base+'/analytics',icon:ChartNoAxesCombined,action:'Open analytics'},
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
    </section>

    <Panel><SectionHeading title="Quick actions" description="Jump directly to common construction workflows." action={<span className="text-xs text-slate-400">Choose an action to open its workspace</span>}/><div className="grid gap-2 sm:grid-cols-3">
      <Link to={base+'/projects'} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-800"><Plus className="h-4 w-4"/> Create project</Link>
      <Link to={base+'/workforce'} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"><Users className="h-4 w-4"/> Open workforce</Link>
      <Link to="/organization/foreman" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"><UserCog className="h-4 w-4"/> Assign foreman</Link>
    </div></Panel>

    <section aria-label="Construction activity indicators"><div className="mb-3"><h2 className="text-base font-bold text-slate-900">Project activity</h2><p className="text-xs text-slate-500">Additional sample indicators for day-to-day coordination.</p></div><div className="grid gap-3 sm:grid-cols-3">
      <MetricCard label="Open Change Orders" value="7" detail="Awaiting approval · demo data" icon={ClipboardCheck} href={base+'/projects'}/>
      <MetricCard label="Pending Material Deliveries" value="5" detail="Expected this week · demo data" icon={Truck} href={base+'/equipment'}/>
      <MetricCard label="Daily Site Reports" value="2" detail="Not yet submitted today · demo data" icon={FileText} href={base+'/documents'}/>
    </div></section>

    {showWorkspaces&&<Panel><SectionHeading title="All construction workspaces" description="Open a workspace to use its tools and records."/><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{workspaces.map(item=><WorkspaceLink key={item.title} {...item}/>)}</div></Panel>}

    <Panel><SectionHeading title="Today's focus" description="Shortcuts to the work items teams commonly review."/><div className="grid gap-3 sm:grid-cols-2"><WorkspaceLink title="Timesheet review" detail={pendingTimesheets.length+' pending entries in the current demo data.'} href="/organization/timesheets" icon={Clock3} action="Review timesheets"/><WorkspaceLink title="Foreman and crew assignments" detail="Open the foreman workspace to review site leadership." href="/organization/foreman" icon={UserCog} action="Open foreman workspace"/></div></Panel>
    <p className="text-center text-xs text-slate-400">Mela Construction Workspace · Some operational indicators are sample demo values; unavailable integrations are identified above.</p>
  </main>;
}
