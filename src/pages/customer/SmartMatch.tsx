import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_TECHNICIANS } from '@/data/mock';
import { Sparkles, MapPin, Star, ShieldCheck, ArrowUpRight, Users, CheckCircle2, Droplets, Paintbrush, Trees, Network, Zap, Wind, Hammer, Home, Cable, Camera, Wifi, Monitor, Shield, Cog, Bell, RadioTower } from 'lucide-react';
import { cn } from '@/lib/utils';

const groups = [
 { id:'home-systems', title:'Home systems', description:'Essential repairs and equipment', icon:Home, services:['Plumbing','Electrical','HVAC'] },
 { id:'interior-exterior', title:'Interior & exterior', description:'Improvements, finishes and structure', icon:Paintbrush, services:['Painting','Roofing','Carpentry'] },
 { id:'home-outdoor-care', title:'Home & outdoor care', description:'Cleaning and outdoor maintenance', icon:Trees, services:['Cleaning','Landscaping'] },
 { id:'technology', title:'Technology & low voltage', description:'Connected homes, security and networking', icon:Network, services:['Fiber Installation','Fiber optic repair','CCTV camera installation','Security camera systems','Access control systems','Alarm system installation','Structured cabling','Network & data cabling','Intercom systems','Audio/video installation','Smart-home installation','Low-voltage troubleshooting','Gate automation'] }
] as const;

const serviceIcons: Record<string, typeof Droplets> = {
 'Plumbing':Droplets,'Electrical':Zap,'HVAC':Wind,'Painting':Paintbrush,'Roofing':Home,'Carpentry':Hammer,'Cleaning':Sparkles,'Landscaping':Trees,
 'Fiber Installation':RadioTower,'Fiber optic repair':Cable,'CCTV camera installation':Camera,'Security camera systems':Shield,
 'Access control systems':ShieldCheck,'Alarm system installation':Bell,'Structured cabling':Cable,'Network & data cabling':Wifi,
 'Intercom systems':Monitor,'Audio/video installation':Monitor,'Smart-home installation':Wifi,'Low-voltage troubleshooting':Zap,'Gate automation':Cog
};

export function SmartMatch(){
 const[service,setService]=useState('All trades');const[area,setArea]=useState('Kansas City, MO');const[selected,setSelected]=useState<string|null>(null);
 const available=MOCK_TECHNICIANS.filter(tech=>tech.status==='available');
 const results=useMemo(()=>available.filter(tech=>service==='All trades'||tech.service.toLowerCase()===service.toLowerCase()).sort((a,b)=>b.rating-a.rating||(a.distanceMiles??Number.MAX_SAFE_INTEGER)-(b.distanceMiles??Number.MAX_SAFE_INTEGER)),[service,available]);
 const chooseService=(value:string)=>{setService(value);setSelected(null)};
 const groupCount=(items:readonly string[])=>available.filter(tech=>items.some(item=>tech.service.toLowerCase()===item.toLowerCase())).length;
 return <div className="mx-auto max-w-6xl space-y-7 pb-8">
  <header className="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/80 to-teal-50 px-6 py-7 shadow-sm sm:px-8 sm:py-8">
   <div className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl"/>
   <div className="relative max-w-2xl">
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-emerald-800"><Sparkles className="h-3.5 w-3.5"/> Mela professional finder</span>
    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Find the right professional</h1>
    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Explore available sample professionals by trade, then create a service request when you’re ready.</p>
   </div>
  </header>

  <section aria-label="Professional service categories" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
   {groups.map((group,index)=>{const Icon=group.icon;const count=groupCount(group.services);return <button key={group.id} type="button" onClick={()=>document.getElementById('group-'+group.id)?.scrollIntoView({behavior:'smooth',block:'center'})} className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-100">
    <div className="flex items-start justify-between gap-2"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100"><Icon className="h-5 w-5"/></span><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">0{index+1}</span></div>
    <p className="mt-4 text-sm font-bold text-slate-900">{group.title}</p><p className="mt-1 min-h-8 text-xs leading-4 text-slate-500">{group.description}</p>
    <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3"><span><strong className="text-2xl font-bold tracking-tight text-slate-900">{group.services.length}</strong><span className="ml-1.5 text-[11px] text-slate-500">services</span></span><span className="text-right"><strong className="block text-sm font-bold text-emerald-700">{count}</strong><span className="text-[10px] text-slate-400">sample pros</span></span></div>
   </button>})}
  </section>

  <section className="space-y-4">
   <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-[.15em] text-emerald-700">Browse by category</p><h2 className="mt-1 text-xl font-bold text-slate-950">Choose a service</h2><p className="mt-1 text-xs text-slate-500">Services are grouped by the type of work.</p></div><button type="button" onClick={()=>chooseService('All trades')} aria-pressed={service==='All trades'} className={cn('rounded-full px-4 py-2 text-xs font-semibold transition',service==='All trades'?'bg-emerald-800 text-white':'border border-slate-200 bg-white text-slate-600 hover:border-emerald-300')}>All trades</button></div>
   <div className="grid gap-4 lg:grid-cols-2">
    {groups.map(group=>{const Icon=group.icon;return <section id={'group-'+group.id} key={group.id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
     <div className="mb-4 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-emerald-700"><Icon className="h-4.5 w-4.5"/></span><div><h3 className="text-sm font-bold text-slate-900">{group.title}</h3><p className="text-[11px] text-slate-500">{group.services.length} services</p></div></div>
     <div className="flex flex-wrap gap-2">{group.services.map(item=>{const ServiceIcon=serviceIcons[item]||Wrench;return <button key={item} type="button" aria-pressed={service===item} onClick={()=>chooseService(item)} className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition',service===item?'border-emerald-800 bg-emerald-800 text-white shadow-sm':'border-slate-200 bg-slate-50/70 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900')}><ServiceIcon className="h-3.5 w-3.5"/>{item}</button>})}</div>
    </section>})}
   </div>
  </section>

  <section className="space-y-4">
   <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"><div><label htmlFor="match-area" className="mb-1.5 block text-xs font-semibold text-slate-600">Your area</label><input id="match-area" value={area} onChange={e=>{setArea(e.target.value);setSelected(null)}} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:max-w-sm" placeholder="e.g. Brookside, Overland Park"/></div><button type="button" onClick={()=>setSelected(null)} disabled={!area.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"><Sparkles className="h-4 w-4"/>Show available</button></div>
   </div>
   <div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="font-bold text-slate-900">{service==='All trades'?'All available professionals':`Available ${service.toLowerCase()} professionals`}</h2><p className="mt-1 text-xs text-slate-500">Sample directory results, sorted by rating and distance.</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><Users className="h-3.5 w-3.5"/>{results.length} available sample {results.length===1?'professional':'professionals'}</span></div>
   {results.length===0?<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><Users className="mx-auto h-8 w-8 text-slate-300"/><h3 className="mt-2 font-semibold text-slate-800">No sample professional is currently marked available</h3><p className="mt-1 text-sm text-slate-500">Choose another service or continue with a booking request.</p><Link to="/customer/create-booking" className="mt-4 inline-flex rounded-full bg-emerald-800 px-4 py-2 text-sm font-semibold text-white">Create a service request</Link></div>:<div className="grid gap-3 md:grid-cols-2">{results.map((tech,i)=><article key={tech.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-800">{tech.name.split(' ').map(part=>part[0]).slice(0,2).join('')}</div><div><h3 className="font-bold text-slate-900">{tech.name}</h3><p className="text-xs text-slate-500">{tech.service} · Sample profile</p></div></div>{i===0&&<span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800">Top sample match</span>}</div><div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600"><span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400"/>{tech.rating.toFixed(1)} sample rating</span><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/>{tech.distanceMiles} mi sample distance</span><span className="inline-flex items-center gap-1 text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5"/>Demo available</span></div><div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3"><Link to={'/customer/create-booking?service='+encodeURIComponent(tech.service)} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline">Request this service <ArrowUpRight className="h-3.5 w-3.5"/></Link></div></article>)}</div>}
   <p className="rounded-xl border border-amber-100 bg-amber-50/70 p-3 text-xs leading-5 text-amber-900"><ShieldCheck className="mr-1 inline h-3.5 w-3.5"/>Sample profiles only. Availability, identity, credentials, ratings and distances are illustrative and are not live or independently verified.</p>
  </section>
 </div>;
}
