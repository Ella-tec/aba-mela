import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_JOBS } from '@/data/mock';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Flame, Briefcase, Wallet, Star, CloudSun, MapPin, Clock3,
  ArrowUpRight, CalendarDays, CheckCircle2, Wind, Droplets, RefreshCw,
} from 'lucide-react';

type WeatherSnapshot = {
  temperature: number;
  apparent: number;
  code: number;
  wind: number;
  humidity: number;
};

function weatherDescription(code: number) {
  if (code === 0) return 'Clear sky';
  if ([1, 2].includes(code)) return 'Mostly clear';
  if (code === 3) return 'Cloudy';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Light drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain showers';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
  if ([95, 96, 99].includes(code)) return 'Thunderstorms';
  return 'Current conditions';
}

export function ProfessionalDashboard() {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);
  const hotJobs = MOCK_JOBS.filter((j) => j.isHot);
  const assigned = MOCK_JOBS.filter((j) => j.status === 'assigned' || j.status === 'working');
  const completed = MOCK_JOBS.filter((j) => j.status === 'completed').length;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const loadWeather = async () => {
      try {
        setWeatherLoading(true);
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=39.0997&longitude=-94.5786&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago');
        if (!response.ok) throw new Error('Weather request failed');
        const data = await response.json();
        if (!active) return;
        setWeather({
          temperature: data.current.temperature_2m,
          apparent: data.current.apparent_temperature,
          code: data.current.weather_code,
          wind: data.current.wind_speed_10m,
          humidity: data.current.relative_humidity_2m,
        });
        setWeatherError(false);
      } catch {
        if (active) setWeatherError(true);
      } finally {
        if (active) setWeatherLoading(false);
      }
    };
    void loadWeather();
    const refresh = window.setInterval(loadWeather, 15 * 60 * 1000);
    return () => { active = false; window.clearInterval(refresh); };
  }, []);

  const metrics = [
    { label: t('professional.todayEarnings'), value: '$2,200', detail: 'Open earnings', icon: Wallet, to: '/professional/earnings', tone: 'from-emerald-50 to-white', accent: 'text-emerald-700', number: 'text-slate-950' },
    { label: t('professional.completedJobs'), value: String(completed), detail: 'Review job history', icon: Briefcase, to: '/professional/my-jobs', tone: 'from-sky-50 to-white', accent: 'text-sky-700', number: 'text-slate-950' },
    { label: t('professional.rating'), value: '4.8 ★', detail: 'Read customer reviews', icon: Star, to: '/professional/reviews', tone: 'from-amber-50 to-white', accent: 'text-amber-700', number: 'text-slate-950' },
    { label: t('professional.hotJobs'), value: String(hotJobs.length), detail: 'Browse urgent jobs', icon: Flame, to: '/professional/hot-jobs', tone: 'from-orange-50 to-white', accent: 'text-orange-700', number: 'text-slate-950' },
  ];

  return <div className="mx-auto max-w-7xl space-y-6">
    <style>{`
      @keyframes melaMetricEnter { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      .mela-metric-enter { animation: melaMetricEnter .65s cubic-bezier(.2,.75,.25,1) both; }
      @media (prefers-reduced-motion: reduce) { .mela-metric-enter { animation: none; } }
    `}</style>
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-5 text-white shadow-lg sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"/>
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-200">Mela professional workspace</p><h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{t('professional.welcome')}</h2><p className="mt-2 max-w-xl text-sm text-slate-300">Your workday, jobs and earnings — organized in one calm place.</p></div>
        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"><div className="flex items-center gap-2 text-xs text-emerald-100"><Clock3 className="h-4 w-4"/>Kansas City local time</div><p className="mt-1 text-2xl font-semibold tabular-nums">{now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',second:'2-digit',timeZone:'America/Chicago'})}</p><p className="text-xs text-slate-300">{now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',timeZone:'America/Chicago'})}</p></div>
      </div>
      <div className="relative mt-5 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
          <div className="min-w-0"><div className="flex items-center gap-2 text-xs font-semibold text-emerald-100"><MapPin className="h-3.5 w-3.5"/>Kansas City, Missouri</div>
            {weatherLoading?<p className="mt-2 text-sm text-slate-200">Checking current conditions…</p>:weather?<><p className="mt-1 text-3xl font-bold">{Math.round(weather.temperature)}°F</p><p className="text-sm text-slate-200">{weatherDescription(weather.code)} · Feels like {Math.round(weather.apparent)}°F</p></>:<p className="mt-2 text-sm text-slate-200">Weather is temporarily unavailable.</p>}
          </div>
          <CloudSun className="h-12 w-12 shrink-0 text-amber-200"/>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm"><div className="flex items-center gap-2 text-xs text-slate-300"><Wind className="h-4 w-4"/>Wind</div><p className="mt-2 text-xl font-semibold">{weather?Math.round(weather.wind)+' mph':'—'}</p></div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm"><div className="flex items-center gap-2 text-xs text-slate-300"><Droplets className="h-4 w-4"/>Humidity</div><p className="mt-2 text-xl font-semibold">{weather?weather.humidity+'%':'—'}</p></div>
        </div>
      </div>
      {weatherError&&<p className="relative mt-2 flex items-center gap-1 text-xs text-slate-300"><RefreshCw className="h-3 w-3"/>Live weather could not be loaded. The clock still updates automatically.</p>}
    </section>

    <section aria-label="Professional performance" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric,index)=><Link key={metric.label} to={metric.to} style={{animationDelay:(index*90)+'ms'}} className={`mela-metric-enter group rounded-2xl border border-slate-200 bg-gradient-to-br ${metric.tone} p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600`}>
        <div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-slate-500">{metric.label}</p><span className={`rounded-xl bg-white p-2.5 shadow-sm ${metric.accent}`}><metric.icon className="h-5 w-5"/></span></div>
        <p className={`mt-4 text-3xl font-bold tracking-tight tabular-nums ${metric.number}`}>{metric.value}</p>
        <div className="mt-3 flex items-center justify-between"><span className="text-xs text-slate-500">{metric.detail}</span><ArrowUpRight className={`h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${metric.accent}`}/></div>
      </Link>)}
    </section>

    <div className="grid gap-5 xl:grid-cols-2">
      {hotJobs.length > 0 && <section className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-5 py-4"><div className="flex items-center gap-2 font-semibold text-orange-900"><Flame className="h-5 w-5"/>{t('professional.hotJobs')}</div><Link to="/professional/hot-jobs" className="text-sm font-semibold text-orange-800 hover:underline">View all</Link></div>
        <div className="divide-y divide-gray-100">{hotJobs.slice(0,3).map(j=><div key={j.id} className="flex items-center justify-between gap-3 px-5 py-4"><div><div className="font-medium text-gray-900">{j.service}</div><div className="mt-0.5 text-sm text-gray-500">{j.address} · {j.distanceMiles ?? '—'} mi</div></div><div className="text-right"><div className="font-semibold text-gray-900">{'$'+j.price.toLocaleString()}</div><Link to="/professional/hot-jobs" className="mt-2 inline-flex rounded-full bg-orange-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-800">Review job</Link></div></div>)}</div>
      </section>}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h3 className="font-semibold text-slate-900">My active jobs</h3><Link to="/professional/my-jobs" className="text-sm font-semibold text-primary-700 hover:underline">View all</Link></div>
        {assigned.length===0?<div className="p-8 text-center text-slate-500">No assigned jobs yet.</div>:<div className="divide-y divide-slate-100">{assigned.slice(0,4).map(j=><Link key={j.id} to="/professional/my-jobs" className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-slate-50"><div><div className="font-medium text-slate-900">{j.service}</div><div className="text-sm text-slate-500">{j.customer} · {j.address}</div></div><StatusBadge status={j.status}/></Link>)}</div>}
      </section>
    </div>
    <div className="flex flex-wrap gap-2">
      <Link to="/professional/jobs" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary-300 hover:bg-primary-50"><Briefcase className="h-4 w-4"/>Browse available jobs</Link>
      <Link to="/professional/calendar" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary-300 hover:bg-primary-50"><CalendarDays className="h-4 w-4"/>Open calendar</Link>
      <Link to="/professional/business-center" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary-300 hover:bg-primary-50"><Wallet className="h-4 w-4"/>Open Transaction Hub</Link>
    </div>
  </div>;
}
