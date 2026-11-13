import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, CalendarDays, ClipboardList, Search, CircleAlert, ArrowUpRight, Phone, HardHat, Clock3, Eye, X, MapPin, Wallet, TrendingUp, ChartNoAxesCombined } from 'lucide-react';
import { MOCK_WORKERS, MOCK_PROJECTS, MOCK_MILESTONES, MOCK_TIMESHEETS } from '@/data/mock';
import { cn } from '@/lib/utils';

const teamIds = ['W1', 'W2', 'W3', 'W7', 'W11'];
const crewIds = ['W1', 'W2', 'W3', 'W7', 'W11'];
const crewInitialStatus: Record<string, 'Present' | 'On Leave'> = {
  W1: 'Present', W2: 'Present', W3: 'Present', W7: 'On Leave', W11: 'Present',
};
const workerStatus: Record<string, string> = { active: 'Active', onLeave: 'On Leave', inactive: 'Inactive' };

function Card({ children, id }: { children: ReactNode; id: string }) {
  return <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">{children}</section>;
}

function Heading({ icon: Icon, title, detail, action }: { icon: typeof Users; title: string; detail: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700"><Icon className="h-5 w-5" /></span>
        <div><h2 className="text-base font-bold text-slate-900">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div>
      </div>
      {action}
    </div>
  );
}

function Pill({ value }: { value: string }) {
  const tone = ['Active', 'Present', 'Approved', 'Completed'].includes(value)
    ? 'bg-emerald-50 text-emerald-700'
    : ['On Leave', 'Pending', 'In Progress'].includes(value)
      ? 'bg-amber-50 text-amber-800'
      : 'bg-slate-100 text-slate-600';
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', tone)}>{value}</span>;
}

export function WorkforcePage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [attendance, setAttendance] = useState(crewInitialStatus);
  const [timesheets, setTimesheets] = useState(MOCK_TIMESHEETS);
  const [preview, setPreview] = useState<{ title: string; content: ReactNode } | null>(null);
  const [projectTab, setProjectTab] = useState<'overview' | 'progress' | 'budget'>('overview');

  const projects = MOCK_PROJECTS;
  const crew = crewIds.map(id => MOCK_WORKERS.find(worker => worker.id === id)).filter((worker): worker is (typeof MOCK_WORKERS)[number] => Boolean(worker));
  const team = teamIds.map(id => MOCK_WORKERS.find(worker => worker.id === id)).filter((worker): worker is (typeof MOCK_WORKERS)[number] => Boolean(worker));
  const milestones = MOCK_MILESTONES.filter(item => item.projectId === 'PRJ-001');
  const pending = timesheets.filter(item => item.status === 'pending').length;
  const onSiteToday = Object.values(attendance).filter(value => value === 'Present').length;
  const timesheetsToday = timesheets.filter(item => item.date === '2026-11-02' && item.projectId === 'PRJ-001');

  const filtered = useMemo(() => MOCK_WORKERS.filter(worker => {
    const project = projects.find(item => item.id === worker.projectId);
    const searchable = [worker.name, worker.role, worker.phone, project?.name ?? ''].join(' ').toLowerCase();
    return searchable.includes(query.toLowerCase()) && (filter === 'All' || workerStatus[worker.status] === filter);
  }), [query, filter, projects]);

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const showWorkerPreview = (worker: (typeof MOCK_WORKERS)[number]) => {
    const project = projects.find(item => item.id === worker.projectId);
    setPreview({
      title: worker.name,
      content: (
        <div className="space-y-3 text-sm text-slate-700">
          <p>{worker.role} · {workerStatus[worker.status]}</p>
          <p><b>Phone:</b> {worker.phone}</p>
          <p><b>Project:</b> {project?.name ?? 'Unassigned'}</p>
          <p><b>Daily rate:</b> ${worker.dailyRate.toLocaleString()}</p>
          <a href={`tel:${worker.phone}`} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 font-semibold text-white"><Phone className="h-4 w-4" /> Call worker</a>
        </div>
      ),
    });
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      <header className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-5 text-white shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Mela construction workspace</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Construction Dashboard</h1>
            <p className="mt-2 text-sm leading-6 text-slate-200">Manage worker details, today’s crew, project milestones and submitted timesheets from one organized workspace.</p>
            <p className="mt-2 text-xs text-slate-300">Brookside Apartment Renovation · Sample project workspace</p>
          </div>
          <Link to="/organization/business-center" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20">Command Center <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button type="button" onClick={() => jump('all-workers')} className="rounded-xl border border-white/15 bg-white/10 p-3 text-left hover:bg-white/20"><Users className="mb-2 h-4 w-4 text-emerald-200" /><b className="block text-xl">{MOCK_WORKERS.length}</b><span className="text-xs text-slate-200">All workers</span></button>
          <button type="button" onClick={() => jump('todays-crew')} className="rounded-xl border border-white/15 bg-white/10 p-3 text-left hover:bg-white/20"><UserCheck className="mb-2 h-4 w-4 text-emerald-200" /><b className="block text-xl">{crew.length}</b><span className="text-xs text-slate-200">Today’s crew</span></button>
          <button type="button" onClick={() => jump('milestones')} className="rounded-xl border border-white/15 bg-white/10 p-3 text-left hover:bg-white/20"><CalendarDays className="mb-2 h-4 w-4 text-emerald-200" /><b className="block text-xl">{milestones.length}</b><span className="text-xs text-slate-200">Milestones</span></button>
          <button type="button" onClick={() => jump('timesheets')} className="rounded-xl border border-white/15 bg-white/10 p-3 text-left hover:bg-white/20"><Clock3 className="mb-2 h-4 w-4 text-emerald-200" /><b className="block text-xl">{pending}</b><span className="text-xs text-slate-200">Pending timesheets</span></button>
        </div>
      </header>


      <section aria-labelledby="foreman-dashboard-title" className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative min-h-[230px] overflow-hidden bg-slate-950">
          <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=85" alt="Apartment renovation construction site" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-900/20" />
          <div className="relative z-10 flex min-h-[230px] flex-col justify-between gap-5 p-5 text-white sm:p-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Foreman Dashboard · Active project</p>
              <h2 id="foreman-dashboard-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Brookside Apartment Renovation</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/85"><MapPin className="h-4 w-4" /> Brookside, Kansas City, MO</p>
            </div>
            <Link to="/organization/projects/PRJ-001" className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300">Open project details <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4 sm:p-5">
          {[
            { label: 'Project progress', value: '62%', detail: 'Brookside renovation', href: '/organization/projects/PRJ-001', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80', alt: 'Construction project progress' },
            { label: 'On site today', value: String(onSiteToday), detail: 'Crew members present', href: '/organization/workforce#todays-crew', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80', alt: 'Construction crew at work' },
            { label: 'Timesheets today', value: String(timesheetsToday.length), detail: 'Brookside records submitted', href: '/organization/timesheets', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80', alt: 'Timesheet and work records' },
            { label: 'Current milestone', value: 'MEP', detail: 'Installation · 55% in progress', href: '/organization/projects/PRJ-001', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80', alt: 'Mechanical electrical and plumbing installation' },
          ].map(kpi => (
            <Link key={kpi.label} to={kpi.href} className="group relative min-h-[150px] overflow-hidden rounded-2xl bg-slate-900 p-4 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300">
              <img src={kpi.image} alt={kpi.alt} className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/60 to-slate-900/25" />
              <span className="relative z-10 flex min-h-[118px] flex-col justify-between">
                <span className="text-xs font-semibold text-white/85">{kpi.label}</span>
                <span><b className="block text-3xl font-bold tracking-tight">{kpi.value}</b><span className="mt-1 block text-xs text-white/80">{kpi.detail}</span></span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white">Open details <ArrowUpRight className="h-3.5 w-3.5" /></span>
              </span>
            </Link>
          ))}
        </div>

        <div className="border-t border-slate-100 px-4 pb-4 sm:px-5 sm:pb-5">
          <div role="tablist" aria-label="Project information views" className="mb-4 flex flex-wrap gap-2 pt-4">
            {([
              ['overview', 'Project overview'],
              ['progress', 'Progress chart'],
              ['budget', 'Budget & payments'],
            ] as const).map(([id, label]) => (
              <button key={id} id={`project-tab-${id}`} type="button" role="tab" aria-selected={projectTab === id} aria-controls="project-tab-panel" onClick={() => setProjectTab(id)} className={cn('min-h-10 rounded-full border px-4 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500', projectTab === id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:bg-orange-50')}>{label}</button>
            ))}
          </div>
          <div id="project-tab-panel" role="tabpanel" aria-labelledby={`project-tab-${projectTab}`} className="rounded-2xl bg-slate-50 p-4 sm:p-5">
            {projectTab === 'overview' && <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
              <div><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Overall project progress</p><p className="mt-1 text-3xl font-bold text-slate-900">62%</p></div><Pill value="In Progress" /></div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label="Brookside project completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={62}><div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: '62%' }} /></div>
                <p className="mt-2 text-xs text-slate-500">62 percent complete · Target handover December 15, 2026</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current milestone</p><div className="mt-1 flex flex-wrap items-center justify-between gap-2"><b className="text-base text-slate-900">MEP Installation</b><Pill value="In Progress" /></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="MEP Installation completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={55}><div className="h-full rounded-full bg-orange-500" style={{ width: '55%' }} /></div><div className="mt-2 flex justify-between text-xs text-slate-500"><span>55% complete</span><span>Due Nov 10, 2026</span></div></div>
            </div>}
            {projectTab === 'progress' && <div><div className="mb-4 flex items-center gap-2"><ChartNoAxesCombined className="h-5 w-5 text-emerald-700" /><div><h3 className="text-sm font-bold text-slate-900">Milestone progress chart</h3><p className="text-xs text-slate-500">Completion by construction phase</p></div></div><div className="space-y-4">
              {milestones.map(item => <div key={item.id}><div className="mb-1 flex flex-wrap justify-between gap-2 text-xs"><span className="font-semibold text-slate-700">{item.title}</span><span className="tabular-nums text-slate-500">{item.progress}%</span></div><div className="h-3 overflow-hidden rounded-full bg-white" role="progressbar" aria-label={item.title + ' progress'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.progress}><div className={cn('h-full rounded-full transition-all', item.progress === 100 ? 'bg-emerald-600' : 'bg-orange-500')} style={{ width: item.progress + '%' }} /></div></div>)}
            </div></div>}
            {projectTab === 'budget' && <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4"><Wallet className="h-5 w-5 text-emerald-700" /><p className="mt-2 text-xs text-slate-500">Approved project budget</p><b className="mt-1 block text-2xl text-slate-900">$85,000</b></div>
              <div className="rounded-xl border border-slate-200 bg-white p-4"><TrendingUp className="h-5 w-5 text-orange-600" /><p className="mt-2 text-xs text-slate-500">Recorded project spend</p><b className="mt-1 block text-2xl text-slate-900">$52,000</b></div>
              <div className="rounded-xl border border-slate-200 bg-white p-4"><Wallet className="h-5 w-5 text-blue-700" /><p className="mt-2 text-xs text-slate-500">Budget remaining</p><b className="mt-1 block text-2xl text-slate-900">$33,000</b></div>
              <div className="md:col-span-3"><div className="mb-2 flex justify-between text-xs font-semibold text-slate-600"><span>Budget utilization</span><span>61.2%</span></div><div className="h-3 overflow-hidden rounded-full bg-white" role="progressbar" aria-label="Project budget used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={61.2}><div className="h-full rounded-full bg-emerald-600" style={{ width: '61.2%' }} /></div><p className="mt-2 text-xs text-slate-500">Illustrative demo figures. No payment is initiated or recorded from this dashboard.</p><Link to="/organization/analytics" className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">View financial analytics <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
            </div>}
          </div>
        </div>
      </section>

      <nav aria-label="Workforce sections" className="flex flex-wrap gap-2">
        {([['all-workers', 'All Workforce'], ['todays-crew', 'Today’s Crew'], ['team', 'Project Team'], ['milestones', 'Milestones'], ['timesheets', 'Recent Timesheets']] as const).map(([id, label]) => (
          <button key={id} type="button" onClick={() => jump(id)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-orange-300 hover:bg-orange-50"><ArrowUpRight className="h-4 w-4 text-orange-700" />{label}</button>
        ))}
      </nav>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Active workforce', value: MOCK_WORKERS.filter(worker => worker.status === 'active').length, detail: `Of ${MOCK_WORKERS.length} registered workers`, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80', target: 'all-workers' },
          { label: 'Crew present today', value: `${Object.values(attendance).filter(value => value === 'Present').length} / ${crew.length}`, detail: 'Attendance in this demo view', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80', target: 'todays-crew' },
          { label: 'Timesheets awaiting review', value: pending, detail: 'Approve or reject below', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80', target: 'timesheets' },
        ].map(kpi => (
          <button key={kpi.label} type="button" onClick={() => jump(kpi.target)} className="group relative min-h-36 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 p-4 text-left text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <img src={kpi.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-45 transition group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-900/25" />
            <span className="relative z-10 flex h-full flex-col justify-between"><span className="text-xs font-semibold text-white/85">{kpi.label}</span><span><b className="block text-3xl font-bold tracking-tight">{kpi.value}</b><span className="mt-1 block text-xs text-white/75">{kpi.detail}</span></span><span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white/90">Preview <Eye className="h-3.5 w-3.5" /></span></span>
          </button>
        ))}
      </div>

      <Card id="all-workers">
        <Heading icon={Users} title="Workforce register" detail="Worker contact details, trade, project assignment, daily rate and employment status." />
        <div className="mb-3 flex flex-col gap-2 sm:flex-row">
          <label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, role, phone or project…" className="min-h-10 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-orange-500" /></label>
          <select value={filter} onChange={event => setFilter(event.target.value)} aria-label="Filter workers by status" className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm"><option>All</option><option>Active</option><option>On Leave</option><option>Inactive</option></select>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Name &amp; contact</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Project</th><th className="px-4 py-3">Daily rate</th><th className="px-4 py-3">Status / preview</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(worker => {
                const project = projects.find(item => item.id === worker.projectId);
                return <tr key={worker.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3"><b className="block text-slate-900">{worker.name}</b><a href={`tel:${worker.phone}`} className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-orange-700"><Phone className="h-3 w-3" />{worker.phone}</a></td>
                  <td className="px-4 py-3 text-slate-700">{worker.role}</td><td className="px-4 py-3 text-slate-600">{project?.name ?? '—'}</td><td className="px-4 py-3 font-semibold tabular-nums text-slate-800">${worker.dailyRate.toLocaleString()}/day</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Pill value={workerStatus[worker.status]} /><button type="button" onClick={() => showWorkerPreview(worker)} className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 hover:border-orange-300 hover:bg-orange-50"><Eye className="h-3.5 w-3.5" /> Preview</button></div></td>
                </tr>;
              })}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No workers match your search.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-400">Showing {filtered.length} of {MOCK_WORKERS.length} workers · Phone links open your device’s calling app.</p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card id="todays-crew">
          <Heading icon={UserCheck} title="Today’s crew" detail="Five-person Brookside site team. Attendance changes are kept in this demo view." />
          <div className="space-y-2">
            {crew.map(worker => {
              const present = attendance[worker.id] === 'Present';
              return <div key={worker.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><HardHat className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1"><b className="block text-sm text-slate-900">{worker.name}</b><small className="text-xs text-slate-500">{worker.role}</small></span>
                <Pill value={attendance[worker.id] ?? 'Not set'} />
                <button type="button" onClick={() => setPreview({ title: worker.name, content: <div className="space-y-2 text-sm text-slate-700"><p><b>Trade:</b> {worker.role}</p><p><b>Today’s attendance:</b> {attendance[worker.id]}</p><p><b>Phone:</b> {worker.phone}</p><p><b>Daily rate:</b> ${worker.dailyRate.toLocaleString()}</p></div> })} className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Eye className="h-3.5 w-3.5" /> Preview</button>
                <button type="button" onClick={() => setAttendance(rows => ({ ...rows, [worker.id]: present ? 'On Leave' : 'Present' }))} className="min-h-9 rounded-lg border border-slate-300 px-3 text-xs font-semibold hover:border-orange-300 hover:bg-orange-50">{present ? 'Mark on leave' : 'Mark present'}</button>
              </div>;
            })}
          </div>
        </Card>

        <Card id="team">
          <Heading icon={HardHat} title="Project team (5)" detail="Assigned crew and agreed daily rates for Brookside Apartment Renovation." />
          <div className="space-y-2">
            {team.map(worker => {
              const project = projects.find(item => item.id === worker.projectId);
              return <div key={worker.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-800">{worker.name.split(' ').slice(-1)[0].charAt(0)}</span>
                <span className="min-w-0 flex-1"><b className="block text-sm text-slate-900">{worker.name}</b><small className="text-xs text-slate-500">{worker.role}</small></span>
                <div className="flex items-center gap-2"><b className="text-sm tabular-nums text-slate-800">${worker.dailyRate.toLocaleString()}/day</b><button type="button" onClick={() => showWorkerPreview(worker)} className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Eye className="h-3.5 w-3.5" /> Preview</button></div>
                <p className="w-full pl-12 text-xs text-slate-500">{project?.name ?? 'Unassigned'}</p>
              </div>;
            })}
          </div>
        </Card>
      </div>

      <Card id="milestones">
        <Heading icon={CalendarDays} title="Project milestones" detail="Brookside Apartment Renovation · Progress and due dates from the sample project milestone register." action={<Link to="/organization/projects/PRJ-001" className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:underline">Project details <ArrowUpRight className="h-3.5 w-3.5" /></Link>} />
        <div className="grid gap-3 sm:grid-cols-2">
          {milestones.map(milestone => {
            const label = milestone.status === 'completed' ? 'Completed' : milestone.status === 'inProgress' ? 'In Progress' : milestone.status === 'delayed' ? 'Delayed' : 'Pending';
            return <div key={milestone.id} className="rounded-xl border border-slate-100 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2"><div><b className="text-sm text-slate-900">{milestone.title}</b><p className="mt-1 text-xs text-slate-500">Due {milestone.dueDate}</p></div><Pill value={label} /></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${milestone.progress}%` }} /></div>
              <div className="mt-2 flex items-center justify-between gap-2"><p className="text-xs font-semibold text-slate-500">{milestone.progress}% complete</p><button type="button" onClick={() => setPreview({ title: milestone.title, content: <div className="space-y-2 text-sm text-slate-700"><p><b>Project:</b> Brookside Apartment Renovation</p><p><b>Due date:</b> {milestone.dueDate}</p><p><b>Status:</b> {label}</p><p><b>Progress:</b> {milestone.progress}%</p></div> })} className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Eye className="h-3.5 w-3.5" /> Preview</button></div>
            </div>;
          })}
        </div>
      </Card>

      <Card id="timesheets">
        <Heading icon={ClipboardList} title="Recent timesheets" detail="Review submitted hours, project, date and approval status. Decisions update this demo session only." action={<Link to="/organization/timesheets" className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:underline">Full timesheet workspace <ArrowUpRight className="h-3.5 w-3.5" /></Link>} />
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Worker</th><th className="px-4 py-3">Project</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Hours</th><th className="px-4 py-3">Status / action</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {timesheets.map(entry => <tr key={entry.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">{entry.workerName}</td><td className="px-4 py-3 text-slate-600">{entry.projectName}</td><td className="px-4 py-3 tabular-nums text-slate-600">{entry.date}</td><td className="px-4 py-3 font-semibold">{entry.hours}h</td>
                <td className="px-4 py-3"><div className="flex flex-wrap items-center gap-2"><Pill value={entry.status === 'approved' ? 'Approved' : entry.status === 'rejected' ? 'Rejected' : 'Pending'} />
                  <button type="button" onClick={() => setPreview({ title: `Timesheet · ${entry.workerName}`, content: <div className="space-y-2 text-sm text-slate-700"><p><b>Record:</b> {entry.id}</p><p><b>Worker:</b> {entry.workerName}</p><p><b>Project:</b> {entry.projectName}</p><p><b>Date:</b> {entry.date}</p><p><b>Hours submitted:</b> {entry.hours}h</p><p><b>Approval status:</b> {entry.status}</p><p className="text-xs text-amber-700">Sample record. Updates are stored in this browser session only.</p></div> })} className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Eye className="h-3.5 w-3.5" /> Preview</button>
                  {entry.status === 'pending' && <><button type="button" onClick={() => setTimesheets(rows => rows.map(row => row.id === entry.id ? { ...row, status: 'approved' } : row))} className="min-h-8 rounded-lg bg-emerald-700 px-2.5 text-xs font-semibold text-white hover:bg-emerald-800">Approve</button><button type="button" onClick={() => setTimesheets(rows => rows.map(row => row.id === entry.id ? { ...row, status: 'rejected' } : row))} className="min-h-8 rounded-lg border border-slate-300 px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Reject</button></>}
                </div></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </Card>

      {preview && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" role="presentation" onClick={() => setPreview(null)}>
        <section role="dialog" aria-modal="true" aria-labelledby="workforce-preview-title" onClick={event => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3"><h2 id="workforce-preview-title" className="text-lg font-bold text-slate-900">{preview.title}</h2><button type="button" onClick={() => setPreview(null)} aria-label="Close preview" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
          {preview.content}
          <button type="button" onClick={() => setPreview(null)} className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close preview</button>
        </section>
      </div>}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"><span className="inline-flex items-center gap-2"><CircleAlert className="h-4 w-4 shrink-0" /> Demo data: attendance and timesheet decisions update in this browser session only. Live payroll, HR and database synchronization are not connected.</span><Link to="/organization/business-center" className="shrink-0 font-semibold underline underline-offset-2">Back to command center</Link></div>
    </main>
  );
}
