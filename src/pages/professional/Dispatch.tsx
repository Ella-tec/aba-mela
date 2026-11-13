import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity, ArrowUpRight, Clock3, MapPin, Navigation, Search, Users, Zap,
} from 'lucide-react';
import { LiveMap } from '@/components/maps/LiveMap';
import { MOCK_TECHNICIANS, MOCK_MAP_JOBS } from '@/data/mock';
import { StatusBadge } from '@/components/ui/StatusBadge';

const statuses = ['available', 'onTheWay', 'working', 'busy', 'offline'] as const;
type FilterStatus = typeof statuses[number] | 'all';

const statusLabels: Record<FilterStatus, string> = {
  all: 'All activity',
  available: 'Available',
  onTheWay: 'On the way',
  working: 'Working',
  busy: 'Busy',
  offline: 'Offline',
};

function googleDirections(job: (typeof MOCK_MAP_JOBS)[number]) {
  const tech = MOCK_TECHNICIANS.find((person) => person.id === job.techId);
  const destination = job.lat + ',' + job.lng;
  if (!tech) return 'https://www.google.com/maps/search/?api=1&query=' + destination;
  return 'https://www.google.com/maps/dir/?api=1&origin=' + tech.lat + ',' + tech.lng + '&destination=' + destination + '&travelmode=driving';
}

function appleDirections(job: (typeof MOCK_MAP_JOBS)[number]) {
  const tech = MOCK_TECHNICIANS.find((person) => person.id === job.techId);
  if (!tech) return 'https://maps.apple.com/?ll=' + job.lat + ',' + job.lng + '&q=' + encodeURIComponent(job.service);
  return 'https://maps.apple.com/?saddr=' + tech.lat + ',' + tech.lng + '&daddr=' + job.lat + ',' + job.lng + '&dirflg=d';
}

export function DispatchCenter() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [query, setQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(MOCK_MAP_JOBS[0]?.id ?? null);

  const visibleTechs = useMemo(
    () => filter === 'all' ? MOCK_TECHNICIANS : MOCK_TECHNICIANS.filter((person) => person.status === filter),
    [filter],
  );

  const visibleJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return MOCK_MAP_JOBS.filter((job) => {
      const matchesStatus = filter === 'all' ||
        job.status === filter ||
        (filter === 'available' && job.status === 'requested');
      const matchesSearch = !normalizedQuery ||
        [job.service, job.customer, job.address, job.id].some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesStatus && matchesSearch;
    });
  }, [filter, query]);

  const selectedJob = visibleJobs.find((job) => job.id === selectedJobId) ?? visibleJobs[0] ?? null;
  const availableCount = MOCK_TECHNICIANS.filter((person) => person.status === 'available').length;
  const onRouteCount = MOCK_TECHNICIANS.filter((person) => person.status === 'onTheWay').length;
  const workingCount = MOCK_TECHNICIANS.filter((person) => person.status === 'working').length;
  const hotJobCount = MOCK_MAP_JOBS.filter((job) => job.isHot).length;

  const statCards = [
    { label: 'Available pros', value: availableCount, icon: Users, tone: 'emerald' },
    { label: 'On the road', value: onRouteCount, icon: Navigation, tone: 'blue' },
    { label: 'On active jobs', value: workingCount, icon: Activity, tone: 'amber' },
    { label: 'Priority jobs', value: hotJobCount, icon: Zap, tone: 'rose' },
  ] as const;

  return (
    <div className="space-y-6 pb-8">
      <header className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#173b35] via-[#245747] to-[#2f755b] px-5 py-6 text-white shadow-[0_18px_45px_rgba(23,59,53,.18)] sm:px-7 sm:py-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border-[34px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-24 right-28 h-52 w-52 rounded-full bg-emerald-300/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.16em] text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,.15)]" />
              Mela operations
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('maps.dispatch')}</h1>
            <p className="mt-1 max-w-xl text-sm leading-6 text-emerald-50/80">
              Coordinate field teams, review job locations, and open turn-by-turn directions from one map.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs text-emerald-50 sm:self-auto">
            <MapPin className="h-4 w-4" />
            Kansas City metro
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Dispatch summary">
        {statCards.map(({ label, value, icon: Icon, tone }) => {
          const tones = {
            emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
            blue: 'bg-blue-50 text-blue-700 ring-blue-100',
            amber: 'bg-amber-50 text-amber-700 ring-amber-100',
            rose: 'bg-rose-50 text-rose-700 ring-rose-100',
          };
          return (
            <article key={label} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[.03] sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500 sm:text-sm">{label}</span>
                <span className={'flex h-9 w-9 items-center justify-center rounded-xl ring-1 ' + tones[tone]}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
            </article>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm shadow-slate-900/[.04]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-bold text-slate-900">Live operations map</h2>
            <p className="mt-0.5 text-xs text-slate-500">Select a job pin or a dispatch card to focus the map.</p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jobs, customers, address…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              aria-label="Search dispatch jobs"
            />
          </label>
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
            className={'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ' + (filter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
          >
            All activity
          </button>
          {statuses.map((status) => {
            const count = MOCK_TECHNICIANS.filter((person) => person.status === status).length;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(filter === status ? 'all' : status)}
                aria-pressed={filter === status}
                className={'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold capitalize transition ' + (filter === status ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
              >
                {statusLabels[status]}
                <span className={'rounded-full px-1.5 py-0.5 text-[10px] ' + (filter === status ? 'bg-white/20 text-white' : 'bg-white text-slate-500')}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="px-3 pb-3 sm:px-4 sm:pb-4">
          <LiveMap
            technicians={visibleTechs}
            jobs={visibleJobs}
            height="540px"
            selectedJobId={selectedJob?.id ?? null}
            onJobSelect={(job) => setSelectedJobId(job.id)}
          />
        </div>
        <div className="flex flex-col gap-1 border-t border-slate-100 bg-slate-50/80 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span aria-live="polite">Showing {visibleTechs.length} team members and {visibleJobs.length} matching jobs.</span>
          <span>Map markers are sample records, not live GPS locations.</span>
        </div>
      </section>

      {selectedJob && (
        <section className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/80 to-white p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-5">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[.16em] text-emerald-700">Selected dispatch</div>
            <h3 className="mt-1 font-bold text-slate-900">{selectedJob.service}{selectedJob.isHot ? ' · Priority' : ''}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{selectedJob.address}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {selectedJob.customer} · {MOCK_TECHNICIANS.find((person) => person.id === selectedJob.techId)?.name ?? 'Awaiting assignment'}
            </p>
          </div>
          <div className="mt-3 flex shrink-0 flex-wrap gap-2 sm:mt-0">
            <a href={googleDirections(selectedJob)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#173b35] px-3.5 text-xs font-semibold text-white transition hover:bg-[#245747]">
              Google directions <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a href={appleDirections(selectedJob)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800">
              Apple Maps <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900">Dispatch queue</h2>
            <p className="mt-0.5 text-xs text-slate-500">Choose a job to center it on the map.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">{visibleJobs.length} jobs</span>
        </div>
        {visibleJobs.length > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {visibleJobs.map((job) => {
              const assignedTech = MOCK_TECHNICIANS.find((person) => person.id === job.techId);
              const isSelected = selectedJob?.id === job.id;
              return (
                <article key={job.id} className={'rounded-2xl border bg-white p-4 transition ' + (isSelected ? 'border-emerald-400 shadow-md shadow-emerald-900/[.06]' : 'border-slate-200 shadow-sm hover:border-slate-300')}>
                  <button
                    type="button"
                    onClick={() => setSelectedJobId(job.id)}
                    aria-pressed={isSelected}
                    className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900">{job.service}</h3>
                          {job.isHot && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700">Priority</span>}
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{job.customer}</p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
                      {job.address}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Users className="h-3.5 w-3.5" />
                        {assignedTech?.name ?? 'Awaiting assignment'}
                      </span>
                      <span className="font-semibold text-emerald-700">{isSelected ? 'On map' : 'Show on map'}</span>
                    </div>
                  </button>
                  <div className="mt-3 flex gap-4 border-t border-slate-100 pt-2.5 text-[11px] font-semibold">
                    <a href={googleDirections(job)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-700">Google Maps <ArrowUpRight className="h-3 w-3" /></a>
                    <a href={appleDirections(job)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-700">Apple Maps <ArrowUpRight className="h-3 w-3" /></a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <Clock3 className="mx-auto h-7 w-7 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-700">No matching dispatch jobs</p>
            <p className="mt-1 text-sm text-slate-500">Try another status filter or search term.</p>
            <button type="button" onClick={() => { setFilter('all'); setQuery(''); }} className="mt-4 rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800">Clear filters</button>
          </div>
        )}
      </section>

      <p className="text-[11px] leading-5 text-slate-400">
        Demo environment: technician positions and job records are illustrative. Road lines are route previews from the public OSRM demo service when a route is available; they are not live traffic or guaranteed ETAs.
      </p>
    </div>
  );
}
