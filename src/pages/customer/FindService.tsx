import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listServices } from '@/lib/auth';
import type { ServiceCategory } from '@/lib/auth';
import { Search, Wrench, Zap, Paintbrush, Sparkles, Hammer, Wind, Home, Bug, Trees, ArrowUpRight, RefreshCw } from 'lucide-react';

const tradeMeta: Record<string,{label:string;description:string;icon:typeof Wrench;group:string}> = {
  plumbing:{label:'Plumbing',description:'Leaks, drains, fixtures and water systems',icon:Wrench,group:'Home systems'},
  electrical:{label:'Electrical',description:'Wiring, lighting, outlets and inspections',icon:Zap,group:'Home systems'},
  cleaning:{label:'Cleaning',description:'Home, deep, move-in and move-out cleaning',icon:Sparkles,group:'Home care'},
  painting:{label:'Painting',description:'Interior, exterior and surface finishing',icon:Paintbrush,group:'Home improvement'},
  hvac:{label:'Heating & cooling',description:'Heating, air conditioning and ventilation',icon:Wind,group:'Home systems'},
  roofing:{label:'Roofing',description:'Roof repairs, inspections and replacement',icon:Home,group:'Exterior'},
  carpentry:{label:'Carpentry',description:'Repairs, trim, doors and custom woodwork',icon:Hammer,group:'Home improvement'},
  landscaping:{label:'Landscaping',description:'Yard care, planting and outdoor spaces',icon:Trees,group:'Exterior'},
  masonry:{label:'Masonry',description:'Brick, stone, concrete and mortar work',icon:Home,group:'Exterior'},
  tiling:{label:'Tile installation',description:'Tile floors, walls, backsplashes and repairs',icon:Home,group:'Home improvement'},
  appliance:{label:'Appliance repair',description:'Troubleshooting and appliance maintenance',icon:Wrench,group:'Home systems'},
  pest:{label:'Pest control',description:'Inspection and pest prevention services',icon:Bug,group:'Home care'}
};

export function FindService(){
 const [services,setServices]=useState<ServiceCategory[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [query,setQuery]=useState('');
 const [activeGroup,setActiveGroup]=useState('All trades');
 const load=useCallback(async()=>{setLoading(true);setError('');try{setServices(await listServices())}catch(e){setError(e instanceof Error?e.message:'Unable to load services.')}finally{setLoading(false)}},[]);
 useEffect(()=>{void load()},[load]);
 const groups=useMemo(()=>['All trades',...Array.from(new Set(services.map(s=>tradeMeta[s.key]?.group||'More services'))).sort()], [services]);
 const filtered=services.filter(s=>{
  const meta=tradeMeta[s.key]||{label:s.key,description:'Explore this service and request a professional',group:'More services'};
  return (activeGroup==='All trades'||meta.group===activeGroup) && (meta.label+' '+meta.description+' '+s.key).toLowerCase().includes(query.toLowerCase());
 });
 return <div className="mx-auto max-w-6xl space-y-7">
  <header className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/80 to-teal-50 p-6 shadow-sm sm:p-8">
   <div className="max-w-2xl"><span className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700">Mela services</span><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">What can we help you with?</h1><p className="mt-3 text-sm leading-6 text-slate-600">Explore trusted home-service categories, compare the work you need, and choose a service to start your request.</p></div>
   <label className="relative mt-6 block max-w-xl"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><span className="sr-only">Search services</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search plumbing, roofing, cleaning…" className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"/></label>
  </header>
  <div className="flex flex-wrap gap-2" aria-label="Service groups">{groups.map(group=><button key={group} type="button" aria-pressed={activeGroup===group} onClick={()=>setActiveGroup(group)} className={'rounded-full px-4 py-2 text-sm font-semibold transition '+(activeGroup===group?'bg-slate-900 text-white shadow-sm':'border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-800')}>{group}</button>)}</div>
  {loading?<div role="status" className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading available services…</div>:error?<div role="alert" className="rounded-2xl border border-rose-200 bg-white p-6"><p className="text-sm text-rose-700">{error}</p><button type="button" onClick={()=>void load()} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"><RefreshCw className="h-4 w-4"/>Try again</button></div>:filtered.length===0?<div className="rounded-2xl border border-slate-200 bg-white p-10 text-center"><p className="font-semibold text-slate-900">No matching services</p><p className="mt-1 text-sm text-slate-500">Try another search or select All trades.</p></div>:<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map(service=>{const meta=tradeMeta[service.key]||{label:service.key.replace(/\b\w/g,c=>c.toUpperCase()),description:'Explore this service and request a professional',group:'More services',icon:Wrench};const Icon=meta.icon;return <article key={service.id} className="group flex min-h-52 flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100"><Icon className="h-6 w-6"/></span><span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">{meta.group}</span></div><h2 className="mt-4 text-lg font-bold text-slate-900">{meta.label}</h2><p className="mt-1 flex-1 text-sm leading-6 text-slate-500">{meta.description}</p><Link to={'/customer/create-booking?service='+encodeURIComponent(service.key)} className="mt-4 inline-flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">Choose this service <ArrowUpRight className="h-4 w-4"/></Link></article>})}</section>}
  <p className="text-xs leading-5 text-slate-500">Available categories are loaded from the Mela API. Choosing a category opens the separate booking form with your selection prefilled.</p>
 </div>;
}
