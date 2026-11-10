import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LiveMap } from '@/components/maps/LiveMap';
import { MOCK_TECHNICIANS, MOCK_MAP_JOBS } from '@/data/mock';
import { StatusBadge } from '@/components/ui/StatusBadge';

const statuses = ['available','onTheWay','working','busy','offline'] as const;
type FilterStatus = typeof statuses[number] | 'all';

export function DispatchCenter() {
 const { t }=useTranslation(); const [filter,setFilter]=useState<FilterStatus>('all');
 const visibleTechs=filter==='all'?MOCK_TECHNICIANS:MOCK_TECHNICIANS.filter(person=>person.status===filter);
 const visibleJobs=filter==='all'?MOCK_MAP_JOBS:MOCK_MAP_JOBS.filter(job=>job.status===filter || (filter==='available'&&job.status==='requested'));
 return <div className="space-y-6">
  <h2 className="text-xl font-bold text-gray-900">{t('maps.dispatch')}</h2>
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
   {statuses.map(key=>{const count=MOCK_TECHNICIANS.filter(person=>person.status===key).length;return <button key={key} type="button" aria-pressed={filter===key} onClick={()=>setFilter(filter===key?'all':key)} className={'rounded-lg border p-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 '+(filter===key?'border-primary-500 bg-primary-50':'border-gray-200 bg-white hover:border-primary-300')}><span className="block text-2xl font-bold text-gray-900">{count}</span><span className="mt-0.5 block text-xs capitalize text-gray-500">{key.replace(/([A-Z])/g,' $1')}</span><span className="mt-1 block text-[10px] text-primary-700">{filter===key?'Selected · click to clear':'Filter dispatch'}</span></button>})}
  </div>
  <div className="flex items-center justify-between"><p className="text-sm text-gray-600" aria-live="polite">{filter==='all'?'Showing all dispatch activity':'Showing '+filter.replace(/([A-Z])/g,' $1')+' activity'}</p>{filter!=='all'&&<button type="button" onClick={()=>setFilter('all')} className="text-sm font-medium text-primary-700 underline">Clear filter</button>}</div>
  <LiveMap technicians={visibleTechs} jobs={visibleJobs} height="480px"/>
  <section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="border-b border-gray-100 px-5 py-3 font-semibold text-gray-900">Active & Open Jobs</div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-left text-gray-500"><tr><th scope="col" className="px-5 py-2.5 font-medium">Job</th><th scope="col" className="px-5 py-2.5 font-medium">Customer</th><th scope="col" className="px-5 py-2.5 font-medium">Location</th><th scope="col" className="px-5 py-2.5 font-medium">Status</th><th scope="col" className="px-5 py-2.5 font-medium">Assigned</th></tr></thead><tbody className="divide-y divide-gray-100">{visibleJobs.map(job=>{const tech=MOCK_TECHNICIANS.find(person=>person.id===job.techId);return <tr key={job.id}><td className="px-5 py-3 font-medium text-gray-900">{job.service} {job.isHot?'🔥':''}</td><td className="px-5 py-3 text-gray-600">{job.customer}</td><td className="px-5 py-3 text-gray-600">{job.address}</td><td className="px-5 py-3"><StatusBadge status={job.status}/></td><td className="px-5 py-3 text-gray-600">{tech?.name||'—'}</td></tr>})}</tbody></table>{visibleJobs.length===0&&<p className="p-6 text-center text-sm text-gray-500">No jobs match this status.</p>}</div></section>
 </div>;
}