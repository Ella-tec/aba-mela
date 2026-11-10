import { useTranslation } from 'react-i18next';
import { ANALYTICS_KPIS, BOOKING_TREND, SERVICE_BREAKDOWN, TECH_PERFORMANCE, PROJECT_ANALYTICS, SUPPORT_METRICS } from '@/data/mock';
import { Calendar, DollarSign, Users, FolderKanban, HeadphonesIcon, ShieldCheck, Flame, Star, Download } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';

export function AnalyticsOverview() {
 const { t }=useTranslation(); const k=ANALYTICS_KPIS;
 const maxBookings=Math.max(1,...BOOKING_TREND.map(d=>d.bookings));
 const maxService=Math.max(1,...SERVICE_BREAKDOWN.map(s=>s.count));
 function exportReport() {
  const rows=[['Metric','Value'],['Today bookings',String(k.todayBookings)],['Today revenue',String(k.todayRevenue)],['Active technicians',String(k.activeTechnicians)],['Active projects',String(k.activeProjects)],['Open tickets',String(k.openTickets)],['Pending verifications',String(k.pendingVerifications)],['Hot jobs',String(k.hotJobs)],['Average rating',String(k.avgRating)]];
  const csv=rows.map(row=>row.map(cell=>'"'+cell.replace(/"/g,'""')+'"').join(',')).join('\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})); const a=document.createElement('a'); a.href=url; a.download='mela-analytics.csv'; a.click(); URL.revokeObjectURL(url);
 }
 const cards=[
  {label:t('analytics.todayBookings'),value:k.todayBookings,icon:Calendar,to:'/organization/projects'},
  {label:t('analytics.todayRevenue'),value:'$'+(k.todayRevenue/1000).toFixed(1)+'k',icon:DollarSign,to:'/professional/earnings'},
  {label:t('analytics.activeTechnicians'),value:k.activeTechnicians,icon:Users,to:'/organization/workforce'},
  {label:t('analytics.activeProjects'),value:k.activeProjects,icon:FolderKanban,to:'/organization/projects'},
  {label:t('analytics.openTickets'),value:k.openTickets,icon:HeadphonesIcon,to:'/customer/support'},
  {label:t('analytics.pendingVerifications'),value:k.pendingVerifications,icon:ShieldCheck,to:'/professional/verification'},
  {label:t('analytics.hotJobs'),value:k.hotJobs,icon:Flame,to:'/professional/hot-jobs'},
  {label:t('analytics.avgRating'),value:k.avgRating,icon:Star,to:'/professional/reviews'}
 ];
 return <div className="space-y-6">
  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-xl font-bold text-gray-900">{t('analytics.title')}</h2><p className="text-sm text-gray-500">{t('analytics.last7Days')}</p></div><button type="button" onClick={exportReport} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"><Download className="h-4 w-4"/>{t('analytics.export')}</button></div>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{cards.map(item=><MetricCard key={item.label} to={item.to} label={item.label} value={item.value} icon={item.icon} detail="Open related records"/>)}</div>
  <section className="rounded-xl border border-gray-200 bg-white p-5"><h3 className="mb-4 font-semibold text-gray-900">{t('analytics.bookingTrend')}</h3><div className="flex h-40 items-end gap-2">{BOOKING_TREND.map(d=><div key={d.date} className="flex h-full flex-1 flex-col items-center justify-end gap-1"><span className="text-xs font-medium text-gray-700">{d.bookings}</span><div className="min-h-1 w-full rounded-t-md bg-primary-500" style={{height:(d.bookings/maxBookings*75)+'%'}}/><span className="mt-1 text-[10px] text-gray-400">{d.date.replace('2026-','').slice(0,6)}</span></div>)}</div></section>
  <div className="grid gap-4 lg:grid-cols-2">
   <section className="rounded-xl border border-gray-200 bg-white p-5"><h3 className="mb-4 font-semibold text-gray-900">{t('analytics.serviceBreakdown')}</h3><div className="space-y-3">{SERVICE_BREAKDOWN.map(s=><div key={s.service}><div className="mb-1 flex justify-between text-sm"><span>{s.service}</span><span className="text-gray-500">{s.count} · {'$'+Math.round(s.revenue/1000)+'k'}</span></div><div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-primary-500" style={{width:(s.count/maxService*100)+'%'}}/></div></div>)}</div></section>
   <section className="rounded-xl border border-gray-200 bg-white p-5"><h3 className="mb-4 font-semibold text-gray-900">{t('analytics.supportMetrics')}</h3><div className="grid grid-cols-2 gap-4">{[['Open',SUPPORT_METRICS.open],['Escalated',SUPPORT_METRICS.escalated],['Avg first response',SUPPORT_METRICS.avgFirstResponseHrs+'h'],['Avg resolution',SUPPORT_METRICS.avgResolutionHrs+'h'],[t('analytics.csat'),SUPPORT_METRICS.csat]].map(([label,value])=><div key={String(label)}><div className="text-sm text-gray-500">{label}</div><div className="text-xl font-bold text-gray-900">{value}</div></div>)}</div></section>
  </div>
  <section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="border-b border-gray-100 px-5 py-4 font-semibold text-gray-900">{t('analytics.topTechnicians')}</div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-left text-gray-500"><tr>{['Name',t('analytics.jobs'),'Rating','Revenue',t('analytics.acceptance')].map(h=><th key={h} scope="col" className="px-5 py-2.5 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{TECH_PERFORMANCE.map(tech=><tr key={tech.name}><td className="px-5 py-3 font-medium text-gray-900">{tech.name}</td><td className="px-5 py-3">{tech.jobs}</td><td className="px-5 py-3">★ {tech.rating}</td><td className="px-5 py-3">{'$'+tech.revenue.toLocaleString()}</td><td className="px-5 py-3">{tech.acceptance}%</td></tr>)}</tbody></table></div></section>
  <section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="border-b border-gray-100 px-5 py-4 font-semibold text-gray-900">{t('analytics.projectPerformance')}</div><div className="divide-y divide-gray-100">{PROJECT_ANALYTICS.map(p=><div key={p.name} className="flex items-center justify-between gap-3 px-5 py-3"><div className="min-w-0 flex-1"><div className="truncate font-medium text-gray-900">{p.name}</div><div className="mt-0.5 text-xs text-gray-500">{'$'+Math.round(p.spent/1000)+'k / $'+Math.round(p.budget/1000)+'k'}</div></div><div className="flex shrink-0 items-center gap-3"><div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100"><div className={'h-full rounded-full '+(p.status==='completed'?'bg-green-500':'bg-orange-500')} style={{width:p.progress+'%'}}/></div><span className="w-10 text-end text-sm font-medium">{p.progress}%</span></div></div>)}</div></section>
 </div>;
}