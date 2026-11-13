import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_PROJECTS, MOCK_WORKERS, MOCK_TIMESHEETS, MOCK_MILESTONES } from '@/data/mock';
import { HardHat, Users, ClipboardList, Flag, CheckCircle2, AlertTriangle, MapPin, ArrowUpRight, Eye, X, CalendarDays } from 'lucide-react';

type Detail = { title: string; body: React.ReactNode };

const crewIds = ['W1', 'W2', 'W3', 'W7', 'W11'];
const crewStatus: Record<string, 'Present' | 'On Leave'> = {
  W1: 'Present',
  W2: 'Present',
  W3: 'Present',
  W7: 'On Leave',
  W11: 'Present',
};

export function ForemanDashboard() {
  const { t } = useTranslation();
  const [detail, setDetail] = useState<Detail | null>(null);
  const project = MOCK_PROJECTS.find(item => item.id === 'PRJ-001');
  const workers = crewIds
    .map(id => MOCK_WORKERS.find(worker => worker.id === id))
    .filter((worker): worker is (typeof MOCK_WORKERS)[number] => Boolean(worker));
  const todayTS = MOCK_TIMESHEETS.filter(ts => ts.projectId === 'PRJ-001' && ts.date === '2026-11-02');
  const milestones = MOCK_MILESTONES.filter(item => item.projectId === 'PRJ-001');
  const activeMilestone = milestones.find(item => item.id === 'MS-3');
  const presentCount = workers.filter(worker => crewStatus[worker.id] === 'Present').length;

  if (!project) {
    return <div role="status" className="rounded-xl border bg-white p-8 text-center text-gray-600">No foreman project is assigned yet. <Link to="/organization/projects" className="text-primary-700 underline">View projects</Link></div>;
  }

  const openCrewDetails = () => setDetail({
    title: "Today's crew",
    body: <div className="space-y-3">{workers.map(worker => <div key={worker.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"><div><p className="font-semibold text-slate-900">{worker.name}</p><p className="text-sm text-slate-500">{worker.role}</p></div><span className={crewStatus[worker.id] === 'Present' ? 'rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700' : 'rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800'}>{crewStatus[worker.id]}</span></div>)}</div>,
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      <header className="relative isolate overflow-hidden rounded-3xl bg-slate-950 text-white shadow-sm">
        <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=85" alt="Apartment renovation construction site" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/35" />
        <div className="flex flex-wrap items-end justify-between gap-5 p-5 sm:p-8">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200"><HardHat className="h-4 w-4" />Foreman Dashboard · Active project</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{project.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/85"><MapPin className="h-4 w-4" />Brookside, Kansas City, MO</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">A live-style overview of project progress, today’s attendance, submitted time records and the current construction milestone.</p>
          </div>
          <Link to={'/organization/projects/' + project.id} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300">Open project details <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </header>

      <section aria-label="Brookside project key metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Project progress', value: project.progress + '%', detail: 'Brookside renovation', href: '/organization/projects/' + project.id, image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80', alt: 'Building renovation progress', icon: Flag },
          { label: 'On site today', value: String(presentCount), detail: 'Crew members present', href: '/organization/workforce', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80', alt: 'Construction workers on site', icon: Users },
          { label: 'Timesheets today', value: String(todayTS.length), detail: 'Brookside records submitted', href: '/organization/timesheets', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80', alt: 'Work records on a desk', icon: ClipboardList },
          { label: 'Current milestone', value: 'MEP', detail: 'Installation · 55% in progress', href: '/organization/projects/' + project.id, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80', alt: 'Electrical installation work', icon: CalendarDays },
        ].map(item => {
          const Icon = item.icon;
          return <Link key={item.label} to={item.href} className="group relative isolate min-h-40 overflow-hidden rounded-2xl bg-slate-900 p-4 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300">
            <img src={item.image} alt={item.alt} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45 transition duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/90 via-slate-950/65 to-slate-900/35" />
            <span className="flex min-h-32 flex-col justify-between">
              <span className="flex items-center justify-between gap-2 text-xs font-semibold text-white/90">{item.label}<Icon className="h-4 w-4 text-emerald-200" /></span>
              <span><b className="block text-3xl font-bold tracking-tight">{item.value}</b><span className="mt-1 block text-xs text-white/80">{item.detail}</span></span>
              <span className="inline-flex items-center gap-1 text-xs font-bold">Open details <ArrowUpRight className="h-3.5 w-3.5" /></span>
            </span>
          </Link>;
        })}
      </section>

      {activeMilestone && <section aria-labelledby="foreman-milestone-heading" className="overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-800">Current milestone · Brookside</p>
            <h3 id="foreman-milestone-heading" className="mt-1 text-xl font-bold text-slate-900">{activeMilestone.title}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">In progress</span><span className="text-xs text-slate-600">Due November 10, 2026</span></div>
          </div>
          <button type="button" onClick={() => setDetail({ title: 'MEP Installation · Milestone details', body: <div className="space-y-3 text-sm text-slate-700"><p><b>Project:</b> {project.name}</p><p><b>Location:</b> Brookside, Kansas City, MO</p><p><b>Status:</b> In progress</p><p><b>Completion:</b> 55% complete · 45% remaining</p><p><b>Due date:</b> November 10, 2026</p><p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Sample project information. Progress is illustrative and is not synced to a live construction system.</p></div> })} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-800 hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"><Eye className="h-4 w-4" />View milestone details</button>
        </div>
        <div className="mt-5 grid items-center gap-6 md:grid-cols-[minmax(220px,auto)_1fr]">
          <div className="flex flex-wrap items-center gap-4">
            <div role="img" aria-label="MEP Installation progress pie chart: 55 percent complete and 45 percent remaining" className="relative h-32 w-32 shrink-0 rounded-full" style={{ background: 'conic-gradient(#ea580c 0% 55%, #e2e8f0 55% 100%)' }}>
              <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white"><b className="text-3xl font-bold tabular-nums text-slate-900">55%</b><span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Complete</span></div>
            </div>
            <div className="space-y-2 text-xs text-slate-700"><p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-orange-600" />Completed <b>55%</b></p><p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slate-300" />Remaining <b>45%</b></p></div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-700">Milestone completion</span><b className="text-sm tabular-nums text-slate-900">55 / 100</b></div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label="MEP Installation milestone completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={55} aria-valuetext="55 percent complete, 45 percent remaining"><div className="h-full rounded-full bg-orange-600" style={{ width: '55%' }} /></div>
            <p className="mt-2 text-xs leading-5 text-slate-600">MEP Installation is a little over halfway complete. Review the details or open the full project milestone plan.</p>
            <div className="mt-3 flex flex-wrap gap-2"><Link to={'/organization/projects/' + project.id} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300">View project milestones <ArrowUpRight className="h-4 w-4" /></Link><button type="button" onClick={() => setDetail({ title: 'Brookside project milestones', body: <div className="space-y-3">{milestones.map(milestone => <div key={milestone.id} className="rounded-xl border border-slate-200 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><b className="text-sm text-slate-900">{milestone.title}</b><span className="text-xs font-semibold text-slate-600">{milestone.progress}% · {milestone.status === 'inProgress' ? 'In progress' : milestone.status}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={milestone.title + ' progress'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={milestone.progress}><div className="h-full rounded-full bg-orange-500" style={{ width: milestone.progress + '%' }} /></div><p className="mt-1 text-xs text-slate-500">Due {milestone.dueDate}</p></div>)}</div> })} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300">All milestones</button></div>
          </div>
        </div>
      </section>}

      <section aria-labelledby="foreman-crew-heading" className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
          <div><h3 id="foreman-crew-heading" className="text-base font-bold text-slate-900">Today's crew</h3><p className="mt-1 text-xs text-slate-500">Brookside project attendance · {presentCount} present, {workers.length - presentCount} on leave</p></div>
          <button type="button" onClick={openCrewDetails} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"><Users className="h-4 w-4" />Crew details</button>
        </div>
        <ul className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
          {workers.map(worker => {
            const status = crewStatus[worker.id];
            return <li key={worker.id} className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Users className="h-5 w-5" /></span><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{worker.name}</p><p className="mt-0.5 text-xs text-slate-500">{worker.role}</p></div></div>
              <span className={status === 'Present' ? 'inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700' : 'inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800'}>{status === 'Present' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}{status}</span>
            </li>;
          })}
        </ul>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div><p className="text-sm font-bold text-slate-900">Need the full workforce or time records?</p><p className="mt-1 text-xs text-slate-500">Open the dedicated workspaces to review workers and submitted timesheets.</p></div>
        <div className="flex flex-wrap gap-2"><Link to="/organization/workforce" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Open workforce <ArrowUpRight className="h-4 w-4" /></Link><Link to="/organization/timesheets" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Review timesheets <ArrowUpRight className="h-4 w-4" /></Link></div>
      </div>

      {detail && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" onMouseDown={event => { if (event.target === event.currentTarget) setDetail(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="foreman-detail-title" className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-3"><h3 id="foreman-detail-title" className="text-lg font-bold text-slate-900">{detail.title}</h3><button type="button" autoFocus onClick={() => setDetail(null)} aria-label="Close details" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"><X className="h-5 w-5" /></button></div>
          {detail.body}
          <div className="mt-5 flex justify-end"><button type="button" onClick={() => setDetail(null)} className="min-h-10 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300">Close</button></div>
        </section>
      </div>}
      <p className="text-center text-xs text-slate-500">Sample project and crew data for demonstration. Operational records are not connected to a live construction database.</p>
    </div>
  );
}
