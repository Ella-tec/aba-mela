import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, Wrench, HardHat } from 'lucide-react';

export function HomePage() {
 const navigate = useNavigate();
 const [service, setService] = useState('');
 const [zip, setZip] = useState('');
 function handleSearch(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const params = new URLSearchParams({ type: 'customer' });
  if (service.trim()) params.set('service', service.trim());
  if (zip.trim()) params.set('zip', zip.trim());
  navigate('/register?' + params.toString());
 }
 return <div className="mela-homepage">
  <section className="mela-home-hero relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden text-white">
   <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 md:py-20">
    <div className="max-w-3xl">
     <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-[#f8dfaa] backdrop-blur-sm"><span className="h-2 w-2 rounded-full bg-[#f4c66a]"/> KANSAS CITY · MISSOURI & KANSAS</div>
     <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">Your place, <span className="text-[#f4c66a]">in good hands.</span></h1>
     <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">Find trusted local help for home repairs, property care, and projects — all in one place.</p>
     <form onSubmit={handleSearch} className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/20 bg-white p-2 shadow-2xl sm:flex-row">
      <label className="sr-only" htmlFor="home-service-search">What service do you need?</label>
      <div className="relative min-w-0 flex-1"><Search className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"/><input id="home-service-search" value={service} onChange={e=>setService(e.target.value)} placeholder="What do you need help with?" className="w-full rounded-xl border-0 bg-transparent py-3.5 ps-11 pe-3 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#477b65]"/></div>
      <label className="sr-only" htmlFor="home-zip">ZIP code</label><input id="home-zip" inputMode="numeric" maxLength={5} pattern="[0-9]{5}" value={zip} onChange={e=>setZip(e.target.value.replace(/\\D/g,'').slice(0,5))} placeholder="ZIP code" className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#477b65] sm:w-28"/>
      <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#245141] px-6 py-3 font-semibold text-white transition hover:bg-[#173b35]">Find a pro <ArrowRight className="h-4 w-4"/></button>
     </form>
     <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/75 sm:text-sm"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#f4c66a]"/> One simple place to start</span><span className="inline-flex items-center gap-2"><Wrench className="h-4 w-4 text-[#f4c66a]"/> Home & repair services</span><span className="inline-flex items-center gap-2"><HardHat className="h-4 w-4 text-[#f4c66a]"/> Project support</span></div>
     <div className="mt-8 flex flex-wrap gap-3"><a href="/register?type=customer" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#f4c66a] px-5 py-3 text-sm font-semibold text-[#173b35] transition hover:bg-[#e9b94f]">Get started</a><a href="/register?type=professional" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/35 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">Join as a professional</a></div>
    </div>
   </div>
  </section>
 </div>;
}
