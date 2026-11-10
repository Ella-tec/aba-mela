import { Link } from 'react-router-dom';
import { MOCK_JOBS } from '@/data/mock';
import { CalendarDays, Clock } from 'lucide-react';

export function CalendarPage() {
 const upcoming=MOCK_JOBS.filter(job=>job.status==='assigned'||job.status==='working'||job.status==='requested').slice().sort((a,b)=>new Date(a.scheduledAt).getTime()-new Date(b.scheduledAt).getTime());
 return <div className="space-y-5"><div><h2 className="text-xl font-bold text-gray-900">Work calendar</h2><p className="mt-1 text-sm text-gray-500">Upcoming assignments from the illustrative demo schedule.</p></div>
  {upcoming.length===0?<div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">No upcoming jobs are listed.</div>:<div className="space-y-3">{upcoming.map(job=><Link key={job.id} to="/professional/jobs" className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:border-primary-300 hover:shadow-sm"><div className="flex items-start gap-3"><span className="rounded-lg bg-primary-50 p-2 text-primary-700"><CalendarDays className="h-5 w-5"/></span><div><div className="font-semibold text-gray-900">{job.service}</div><div className="mt-1 text-sm text-gray-500">{job.address}</div><div className="mt-1 text-xs text-gray-400">{job.id}</div></div></div><div className="text-end"><div className="flex items-center justify-end gap-1 text-sm text-gray-600"><Clock className="h-3.5 w-3.5"/>{new Date(job.scheduledAt).toLocaleString()}</div><div className="mt-1 text-xs capitalize text-primary-700">{job.status}</div></div></Link>)}</div>}
 </div>;
}