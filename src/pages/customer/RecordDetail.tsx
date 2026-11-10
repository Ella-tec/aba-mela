import { Link, useParams } from 'react-router-dom';
import { MOCK_CUSTOMER_BOOKINGS, MOCK_TICKETS, KB_ARTICLES } from '@/data/mock';
import { ArrowLeft, CalendarDays, MapPin, FileText } from 'lucide-react';
type DetailKind='booking'|'ticket'|'article';
export function RecordDetailPage({kind}:{kind:DetailKind}) {
 const {id}=useParams(); const booking=kind==='booking'?MOCK_CUSTOMER_BOOKINGS.find(item=>item.id===id):undefined;
 const ticket=kind==='ticket'?MOCK_TICKETS.find(item=>item.id===id):undefined;
 const article=kind==='article'?KB_ARTICLES.find(item=>item.id===id):undefined;
 const item=booking||ticket||article;
 const back=kind==='booking'?'/customer/bookings':'/customer/support';
 const title=kind==='booking'?'Booking details':kind==='ticket'?'Support request':'Help article';
 return <div className="mx-auto max-w-3xl space-y-5"><Link to={back} className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 hover:underline"><ArrowLeft className="h-4 w-4"/>Back</Link>
  {!item?<div role="status" className="rounded-xl border border-gray-200 bg-white p-8 text-center"><h2 className="font-semibold text-gray-900">Record not found</h2><p className="mt-1 text-sm text-gray-500">This item may have been removed or is not part of the current demo dataset.</p></div>:<section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="border-b border-gray-100 px-5 py-4"><p className="text-xs font-medium uppercase tracking-wide text-primary-700">{title}</p><h2 className="mt-1 text-xl font-bold text-gray-900">{'service' in item?item.service:'subject' in item?item.subject:item.title}</h2><p className="mt-1 font-mono text-xs text-gray-400">{item.id}</p></div><div className="space-y-4 p-5">{booking&&<><div className="flex items-start gap-2 text-sm text-gray-700"><MapPin className="h-4 w-4 text-gray-400"/>{booking.address}</div><div className="flex items-start gap-2 text-sm text-gray-700"><CalendarDays className="h-4 w-4 text-gray-400"/>{new Date(booking.scheduledAt).toLocaleString()}</div><p className="text-sm text-gray-600">Professional: {booking.professional||'Awaiting professional'}</p><p className="text-sm text-gray-600">Status: <span className="font-medium capitalize">{booking.status}</span></p></>}
   {ticket&&<><p className="text-sm text-gray-600">{ticket.category} · {ticket.status}</p><p className="text-sm text-gray-700">{ticket.lastMessage||'No message details are available.'}</p></>}
   {article&&<><div className="flex items-center gap-2 text-sm text-gray-500"><FileText className="h-4 w-4"/>{article.category}</div><p className="text-sm text-gray-700">This help topic is part of the Mela demo knowledge base. Contact support if you need help with this topic.</p></>}
   <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Demo record: this information is illustrative and is not a live account record.</p>
  </div></section>}
 </div>;
}