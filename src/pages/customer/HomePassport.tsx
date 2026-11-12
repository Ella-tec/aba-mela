import { useState } from 'react';
import type { FormEvent } from 'react';
import { MOCK_PROPERTIES } from '@/data/mock';
import { Home, Wrench, Calendar, FileText, Plus, MapPin, ChevronRight, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

const HISTORY:Record<string,{date:string;service:string;provider:string;amount:number;details:string}[]>={
 'HP-1':[
  {date:'2026-10-28',service:'Electrical',provider:'Demo Provider One',amount:120,details:'Sample record: lighting and outlet inspection with a minor repair.'},
  {date:'2026-09-15',service:'Plumbing',provider:'Demo Provider Two',amount:85,details:'Sample record: kitchen faucet inspection and drain maintenance.'},
  {date:'2026-08-02',service:'Cleaning',provider:'Demo Provider Three',amount:60,details:'Sample record: scheduled apartment cleaning.'}
 ],
 'HP-2':[{date:'2026-09-15',service:'HVAC',provider:'Demo Provider Four',amount:220,details:'Sample record: seasonal HVAC inspection and filter replacement.'}],
 'HP-3':[
  {date:'2026-10-05',service:'Painting',provider:'Demo Provider Five',amount:450,details:'Sample record: interior wall preparation and painting.'},
  {date:'2026-08-20',service:'Plumbing',provider:'Demo Provider Two',amount:90,details:'Sample record: plumbing fixture inspection.'}
 ]
};
type Property=typeof MOCK_PROPERTIES[number];
export function HomePassport(){
 const[properties,setProperties]=useState<Property[]>(MOCK_PROPERTIES);
 const[selected,setSelected]=useState(MOCK_PROPERTIES[0]?.id);
 const[showForm,setShowForm]=useState(false);
 const[name,setName]=useState('');
 const[address,setAddress]=useState('');
 const[notice,setNotice]=useState('');
 const[selectedHistory,setSelectedHistory]=useState<number|null>(null);
 const property=properties.find(p=>p.id===selected);
 const history=selected?HISTORY[selected]||[]:[];
 function chooseProperty(id:string){setSelected(id);setSelectedHistory(null);}
 function addProperty(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(!name.trim()||!address.trim())return;
  const newProperty={id:'LOCAL-'+(properties.length+1),name:name.trim(),address:address.trim(),type:'Residential',size:'—',yearBuilt:0,servicesCount:0,lastService:'',nextMaintenance:'Not scheduled'};
  setProperties(current=>[newProperty,...current]);setSelected(newProperty.id);setSelectedHistory(null);
  setName('');setAddress('');setShowForm(false);setNotice('Property added to this browser session only.');
 }
 return <div className="space-y-6">
  <header className="flex flex-col justify-between gap-3 rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/70 to-teal-50 p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
   <div><span className="text-xs font-bold uppercase tracking-[.15em] text-emerald-700">Property workspace</span><h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Home Passport</h2><p className="mt-1 text-sm text-slate-600">Property records, maintenance & service history</p></div>
   <button type="button" aria-expanded={showForm} onClick={()=>setShowForm(v=>!v)} className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"><Plus className="h-4 w-4"/>{showForm?'Close form':'Add property'}</button>
  </header>
  <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">Demo workspace: property updates and service history are stored in this page session only. They are not connected to a server API.</p>
  {notice&&<p role="status" aria-live="polite" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
  {showForm&&<form onSubmit={addProperty} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
   <div><label htmlFor="property-name" className="mb-1.5 block text-sm font-semibold text-slate-700">Property name</label><input id="property-name" required value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Family Home" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"/></div>
   <div><label htmlFor="property-address" className="mb-1.5 block text-sm font-semibold text-slate-700">Property address</label><input id="property-address" required value={address} onChange={e=>setAddress(e.target.value)} placeholder="Street, city, state" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"/></div>
   <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={()=>setShowForm(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Save demo property</button></div>
  </form>}
  <section aria-label="Your properties" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
   {properties.map(p=><button key={p.id} type="button" aria-pressed={selected===p.id} onClick={()=>chooseProperty(p.id)} className={cn('group rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600',selected===p.id?'border-emerald-400 bg-emerald-50/50 ring-2 ring-emerald-100':'border-slate-200 hover:border-emerald-200')}>
    <div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Home className="h-5 w-5"/></span><ChevronRight className={cn('h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600',selected===p.id&&'text-emerald-700')}/></div>
    <span className="mt-3 block text-sm font-bold text-slate-900">{p.name}</span><span className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3"/>{p.address}</span><span className="mt-2 block text-xs text-slate-400">{p.type} · {p.servicesCount} recorded services</span>
   </button>)}
  </section>
  {property&&<section className="space-y-4">
   <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start"><div><span className="text-xs font-bold uppercase tracking-[.14em] text-emerald-700">Selected property</span><h3 className="mt-1 text-xl font-bold text-slate-950">{property.name}</h3><p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-4 w-4"/>{property.address}</p></div><span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">{property.type}</span></div>
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
     {[{label:'Property type',value:property.type},{label:'Size',value:property.size||'—'},{label:'Year built',value:property.yearBuilt||'—'},{label:'Recorded services',value:property.servicesCount}].map(item=><div key={item.label} className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{item.label}</p><p className="mt-1 text-sm font-bold text-slate-900">{item.value}</p></div>)}
    </div>
    <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2"><div className="flex items-center gap-2 text-sm text-slate-600"><Wrench className="h-4 w-4 text-emerald-700"/>Last service: <b className="text-slate-900">{property.lastService||'—'}</b></div><div className="flex items-center gap-2 text-sm text-slate-600"><Calendar className="h-4 w-4 text-emerald-700"/>Next maintenance: <b className="text-slate-900">{property.nextMaintenance||'—'}</b></div></div>
   </div>
   <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"><div><h3 className="flex items-center gap-2 font-bold text-slate-900"><FileText className="h-4 w-4 text-emerald-700"/>Service history</h3><p className="mt-1 text-xs text-slate-500">Select any record to view its details.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{history.length} records</span></div>
    {history.length===0?<div className="p-8 text-center text-sm text-slate-500">No services logged for this property yet.</div>:<div className="divide-y divide-slate-100">{history.map((h,i)=><div key={i}>
     <button type="button" aria-expanded={selectedHistory===i} onClick={()=>setSelectedHistory(current=>current===i?null:i)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-emerald-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600"><span className="min-w-0"><span className="block text-sm font-semibold text-slate-900">{h.service}</span><span className="mt-1 block text-xs text-slate-500">{h.provider} · {h.date}</span></span><span className="flex shrink-0 items-center gap-3"><b className="text-sm text-slate-900">{'$'+h.amount.toLocaleString()}</b><ChevronRight className={cn('h-4 w-4 text-slate-400 transition',selectedHistory===i&&'rotate-90 text-emerald-700')}/></span></button>
     {selectedHistory===i&&<div className="mx-4 mb-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-800"><ClipboardList className="h-4 w-4"/>Service record details</div><p className="mt-2 text-sm leading-6 text-slate-700">{h.details}</p><div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3"><span>Service: <b className="text-slate-900">{h.service}</b></span><span>Provider: <b className="text-slate-900">{h.provider}</b></span><span>Demo amount: <b className="text-slate-900">{'$'+h.amount.toLocaleString()}</b></span></div><p className="mt-2 text-[11px] text-slate-500">Sample record only; not an invoice or confirmed provider transaction.</p></div>}
    </div>)}</div>}
   </div>
  </section>}
 </div>;
}
