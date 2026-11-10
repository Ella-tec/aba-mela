import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_JOBS } from '@/data/mock';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MetricCard } from '@/components/ui/MetricCard';
import { Flame, Briefcase, Wallet, Star } from 'lucide-react';

export function ProfessionalDashboard() {
  const { t } = useTranslation();
  const hotJobs = MOCK_JOBS.filter((j) => j.isHot);
  const assigned = MOCK_JOBS.filter((j) => j.status === 'assigned' || j.status === 'working');
  const completed = MOCK_JOBS.filter((j) => j.status === 'completed').length;
  return <div className="space-y-6">
    <div><h2 className="text-2xl font-bold text-gray-900">{t('professional.welcome')}</h2><p className="mt-1 text-gray-500">Manage jobs and track your earnings</p></div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard to="/professional/earnings" label={t('professional.todayEarnings')} value="$2,200" icon={Wallet} detail="Open earnings" />
      <MetricCard to="/professional/my-jobs" label={t('professional.completedJobs')} value={completed} icon={Briefcase} detail="Review job history" />
      <MetricCard to="/professional/reviews" label={t('professional.rating')} value="4.8 ★" icon={Star} detail="Read customer reviews" />
      <MetricCard to="/professional/hot-jobs" label={t('professional.hotJobs')} value={hotJobs.length} icon={Flame} tone="text-orange-600" detail="Browse urgent jobs" />
    </div>
    {hotJobs.length > 0 && <section className="overflow-hidden rounded-xl border border-orange-200 bg-white">
      <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50 px-5 py-3"><div className="flex items-center gap-2 font-semibold text-orange-800"><Flame className="h-5 w-5" />{t('professional.hotJobs')}</div><Link to="/professional/hot-jobs" className="text-sm text-orange-700 hover:underline">{t('common.viewAll')}</Link></div>
      <div className="divide-y divide-gray-100">{hotJobs.map((j) => <div key={j.id} className="flex items-center justify-between gap-3 px-5 py-4"><div><div className="font-medium text-gray-900">{j.service}</div><div className="mt-0.5 text-sm text-gray-500">{j.address} · {j.distanceMiles ?? '—'} mi</div></div><div className="text-end"><div className="font-semibold text-gray-900">$ {j.price.toLocaleString()}</div><Link to="/professional/hot-jobs" className="mt-2 inline-flex rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700">Review job</Link></div></div>)}</div>
    </section>}
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="flex items-center justify-between border-b border-gray-100 px-5 py-4"><h3 className="font-semibold text-gray-900">{t('professional.myJobs')}</h3><Link to="/professional/my-jobs" className="text-sm text-primary-600 hover:underline">{t('common.viewAll')}</Link></div>
      {assigned.length === 0 ? <div className="p-8 text-center text-gray-500">{t('professional.noJobs')}</div> : <div className="divide-y divide-gray-100">{assigned.map((j) => <Link key={j.id} to="/professional/my-jobs" className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50"><div><div className="font-medium text-gray-900">{j.service}</div><div className="text-sm text-gray-500">{j.customer} · {j.address}</div></div><StatusBadge status={j.status} /></Link>)}</div>}
    </section>
  </div>;
}
