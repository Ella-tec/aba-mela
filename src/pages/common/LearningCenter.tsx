import { useMemo, useState } from 'react';
import { BookOpen, GraduationCap, Search, ExternalLink, PlayCircle, FileText, Zap, Wind, Droplets, Hammer, Home, Paintbrush, Trees } from 'lucide-react';
const tracks=[
 {id:'construction',name:'Construction',icon:Home,description:'Job-site fundamentals, planning, tools and construction safety',resources:[
  {title:'OSHA construction training',detail:'Official construction safety topics, standards and training resources.',url:'https://www.osha.gov/construction',kind:'guide',source:'OSHA'},
  {title:'Construction skills video lessons',detail:'Free video search for construction fundamentals and practical demonstrations.',url:'https://www.youtube.com/results?search_query=construction+basics+training+for+beginners',kind:'video',source:'YouTube'},
  {title:'Free engineering and construction textbooks',detail:'Open-access textbooks covering engineering, materials and technical foundations.',url:'https://open.umn.edu/opentextbooks/subjects/engineering',kind:'book',source:'Open Textbook Library'}
 ]},
 {id:'electrical',name:'Electrical',icon:Zap,description:'Electrical fundamentals, safe work practices and code awareness',resources:[
  {title:'OSHA electrical safety',detail:'Official electrical hazards and safe-work guidance.',url:'https://www.osha.gov/electrical',kind:'guide',source:'OSHA'},
  {title:'Electrical training videos',detail:'Free demonstrations on circuits, tools and electrical fundamentals.',url:'https://www.youtube.com/results?search_query=electrical+training+basics+for+beginners',kind:'video',source:'YouTube'},
  {title:'Electrical engineering open textbooks',detail:'Free foundational books for electricity, circuits and engineering.',url:'https://open.umn.edu/opentextbooks/subjects/electrical-engineering',kind:'book',source:'Open Textbook Library'}
 ]},
 {id:'hvac',name:'HVAC',icon:Wind,description:'Heating, cooling, ventilation, maintenance and energy efficiency',resources:[
  {title:'DOE heating and cooling resources',detail:'Free home heating, cooling and energy-efficiency guidance.',url:'https://www.energy.gov/energysaver/heating-and-cooling',kind:'guide',source:'U.S. Department of Energy'},
  {title:'HVAC training videos',detail:'Free HVAC fundamentals, troubleshooting and maintenance video search.',url:'https://www.youtube.com/results?search_query=HVAC+training+basics+troubleshooting',kind:'video',source:'YouTube'},
  {title:'EPA refrigerant safety and Section 608',detail:'Official information for technicians who work with refrigerants.',url:'https://www.epa.gov/section608',kind:'guide',source:'EPA'}
 ]},
 {id:'plumbing',name:'Plumbing',icon:Droplets,description:'Water systems, fixtures, drainage and efficient water use',resources:[
  {title:'EPA WaterSense for plumbing professionals',detail:'Free water-efficiency information and resources for plumbing work.',url:'https://www.epa.gov/watersense',kind:'guide',source:'EPA'},
  {title:'Plumbing training videos',detail:'Free plumbing fundamentals, fixtures and repair demonstrations.',url:'https://www.youtube.com/results?search_query=plumbing+training+basics+for+beginners',kind:'video',source:'YouTube'},
  {title:'Open-access technical textbooks',detail:'Browse free technical and engineering books for foundational study.',url:'https://open.umn.edu/opentextbooks/subjects/engineering',kind:'book',source:'Open Textbook Library'}
 ]},
 {id:'carpentry',name:'Carpentry',icon:Hammer,description:'Measuring, framing, finish work and tool skills',resources:[
  {title:'Carpentry skill videos',detail:'Free demonstrations for measuring, framing and finish carpentry.',url:'https://www.youtube.com/results?search_query=carpentry+training+basics+framing+finish',kind:'video',source:'YouTube'},
  {title:'OSHA hand and power tools',detail:'Official safe-use guidance for common tools.',url:'https://www.osha.gov/hand-power-tools',kind:'guide',source:'OSHA'}
 ]},
 {id:'roofing',name:'Roofing',icon:Home,description:'Roof systems, inspections, fall protection and weather readiness',resources:[
  {title:'OSHA fall protection',detail:'Official fall-protection requirements and hazard guidance.',url:'https://www.osha.gov/fall-protection',kind:'guide',source:'OSHA'},
  {title:'Roofing skills videos',detail:'Free roofing installation, inspection and repair video search.',url:'https://www.youtube.com/results?search_query=roofing+training+installation+basics',kind:'video',source:'YouTube'}
 ]},
 {id:'painting',name:'Painting',icon:Paintbrush,description:'Surface preparation, coatings, ventilation and safe handling',resources:[
  {title:'OSHA paint and coating safety',detail:'Workplace chemical, ventilation and PPE guidance.',url:'https://www.osha.gov/chemical-hazards',kind:'guide',source:'OSHA'},
  {title:'Painting trade videos',detail:'Free surface preparation, painting and finishing demonstrations.',url:'https://www.youtube.com/results?search_query=professional+painting+training+surface+preparation',kind:'video',source:'YouTube'}
 ]},
 {id:'landscaping',name:'Landscaping',icon:Trees,description:'Outdoor work, equipment, plants, heat and pesticide awareness',resources:[
  {title:'OSHA landscaping safety',detail:'Worker safety information for landscaping and groundskeeping.',url:'https://www.osha.gov/landscaping',kind:'guide',source:'OSHA'},
  {title:'Landscaping training videos',detail:'Free planting, equipment and landscape maintenance video search.',url:'https://www.youtube.com/results?search_query=landscaping+training+basics',kind:'video',source:'YouTube'}
 ]}
] as const;

export function LearningCenter(){
 const [active,setActive]=useState<string>('construction');const [query,setQuery]=useState('');
 const track=tracks.find(item=>item.id===active)||tracks[0];
 const resources=useMemo(()=>track.resources.filter(item=>(item.title+' '+item.detail+' '+item.source).toLowerCase().includes(query.toLowerCase())),[track,query]);
 return <div className="mx-auto max-w-6xl space-y-6">
  <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-lg sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div className="max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100"><GraduationCap className="h-4 w-4"/> MELA LEARNING</span><h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Build skills. Work with confidence.</h1><p className="mt-3 text-sm leading-6 text-slate-300">A free learning hub for construction and home-service trades, with videos, official guides and open-access books.</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"><BookOpen className="mb-2 h-5 w-5 text-emerald-300"/>Free external resources<br/><span className="text-xs text-slate-400">Opens trusted third-party websites</span></div></div></header>
  <nav aria-label="Learning tracks" className="flex gap-2 overflow-x-auto pb-2">{tracks.map(item=>{const Icon=item.icon;return <button key={item.id} type="button" aria-pressed={active===item.id} onClick={()=>setActive(item.id)} className={'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition '+(active===item.id?'bg-emerald-700 text-white shadow-sm':'border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-800')}><Icon className="h-4 w-4"/>{item.name}</button>})}</nav>
  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Learning track</p><h2 className="mt-1 text-2xl font-bold text-slate-950">{track.name}</h2><p className="mt-1 text-sm text-slate-500">{track.description}</p></div><label className="relative block sm:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><span className="sr-only">Search learning resources</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search this learning track" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"/></label></div>
   <div className="mt-6 grid gap-3 md:grid-cols-2">{resources.map(item=>{const Icon=item.kind==='video'?PlayCircle:item.kind==='book'?BookOpen:FileText;return <a key={item.title} href={item.url} target="_blank" rel="noreferrer" className="group flex min-h-36 items-start gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/40"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5"/></span><span className="min-w-0 flex-1"><span className="flex items-center gap-2 text-sm font-bold text-slate-900">{item.title}<ExternalLink className="h-3.5 w-3.5 text-slate-400"/></span><span className="mt-1 block text-sm leading-5 text-slate-500">{item.detail}</span><span className="mt-3 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{item.source} · {item.kind==='video'?'Free video search':item.kind==='book'?'Open-access books':'Free guide'}</span></span></a>})}{resources.length===0&&<p className="col-span-full rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">No resources match that search.</p>}</div>
  </section>
  <p className="text-xs leading-5 text-slate-400">Mela links to third-party learning materials. Availability, pricing, licensing and course completion rules are controlled by each provider. External videos and books are not Mela certifications.</p>
 </div>;
}
