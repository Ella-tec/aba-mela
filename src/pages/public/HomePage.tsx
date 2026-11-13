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
  <section className="mela-home-hero relative flex min-h-0 items-center overflow-hidden sm:min-h-[calc(100svh-4rem)] text-white">
   <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-14 md:py-20">
    <div className="max-w-3xl">
     <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] sm:mb-5 sm:px-3.5 sm:py-2 sm:text-xs font-semibold tracking-wide text-[#f8dfaa] backdrop-blur-sm"><span className="h-2 w-2 rounded-full bg-[#f4c66a]"/> KANSAS CITY · MISSOURI & KANSAS</div>
     <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">Your place, <span className="text-[#f4c66a]">in good hands.</span></h1>
     <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:mt-5 sm:text-lg sm:leading-7">Find trusted local help for home repairs, property care, and projects — all in one place.</p>
     <form onSubmit={handleSearch} className="mt-5 flex max-w-2xl flex-row items-center gap-1 rounded-xl border border-white/20 bg-white p-1.5 shadow-xl sm:mt-8 sm:gap-2 sm:rounded-2xl sm:p-2">
      <label className="sr-only" htmlFor="home-service-search">What service do you need?</label>
      <div className="relative min-w-0 flex-1"><Search className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"/><input id="home-service-search" value={service} onChange={e=>setService(e.target.value)} placeholder="What do you need help with?" className="w-full rounded-xl border-0 bg-transparent py-3 ps-10 pe-2 text-sm sm:py-3.5 sm:ps-11 sm:pe-3 sm:text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#477b65]"/></div>
      <label className="sr-only" htmlFor="home-zip">ZIP code</label><input id="home-zip" inputMode="numeric" maxLength={5} pattern="[0-9]{5}" value={zip} onChange={e=>setZip(e.target.value.replace(/\D/g,'').slice(0,5))} placeholder="ZIP code" className="w-[4.5rem] shrink-0 rounded-lg border-0 bg-gray-50 px-1.5 py-3 text-center text-xs text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#477b65] sm:w-28 sm:rounded-xl sm:px-4 sm:py-3.5 sm:text-base"/>
      <button type="submit" className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#245141] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#173b35] sm:min-h-12 sm:gap-2 sm:rounded-xl sm:px-6 sm:py-3 sm:text-sm"><span className="sm:hidden">Find</span><span className="hidden sm:inline">Find a pro</span><ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4"/></button>
     </form>
     <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] sm:mt-6 sm:gap-x-5 sm:gap-y-2 sm:text-xs font-medium text-white/75 sm:text-sm"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#f4c66a]"/> One simple place to start</span><span className="inline-flex items-center gap-2"><Wrench className="h-4 w-4 text-[#f4c66a]"/> Home & repair services</span><span className="inline-flex items-center gap-2"><HardHat className="h-4 w-4 text-[#f4c66a]"/> Project support</span></div>
     <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3"><a href="/register?type=customer" className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#f4c66a] px-4 py-2.5 text-xs sm:min-h-11 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm font-semibold text-[#173b35] transition hover:bg-[#e9b94f]">Get started</a><a href="/register?type=professional" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/35 bg-white/5 px-4 py-2.5 text-xs sm:min-h-11 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm font-semibold text-white transition hover:bg-white/15">Join as a professional</a></div>
    </div>
   </div>
  </section>
 </div>;
}
