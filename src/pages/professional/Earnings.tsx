import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_PAYOUTS, MOCK_EARNINGS_SUMMARY } from '@/data/mock';
import { PayoutStatusBadge } from '@/components/ui/PaymentStatusBadge';
import { Wallet, TrendingUp, Clock, Banknote } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';

export function ProfessionalEarnings(){
 const {t}=useTranslation();const s=MOCK_EARNINGS_SUMMARY;
 return <div className="space-y-6">
  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><h2 className="text-xl font-bold text-gray-900">{t('earnings.title')}</h2><Link to="/professional/settings" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">Manage payout preferences</Link></div>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
   <MetricCard to="/professional/earnings" label={t('earnings.today')} value={'$'+s.today.toLocaleString()} icon={Wallet} detail="Current period"/>
   <MetricCard to="/professional/earnings" label={t('earnings.thisWeek')} value={'$'+s.thisWeek.toLocaleString()} icon={TrendingUp} detail="Current period"/>
   <MetricCard to="/professional/earnings" label={t('earnings.thisMonth')} value={'$'+s.thisMonth.toLocaleString()} icon={Banknote} detail="Current period"/>
   <MetricCard to="/professional/earnings" label={t('earnings.available')} value={'$'+s.availableBalance.toLocaleString()} icon={Clock} tone="text-primary-700" detail="Balance summary"/>
  </div>
  <section className="flex flex-col justify-between gap-2 rounded-xl border border-primary-200 bg-primary-50 p-4 sm:flex-row sm:items-center"><div><div className="text-sm text-primary-700">{t('earnings.pendingPayout')}</div><div className="text-xl font-bold text-primary-900">{'$'+s.pendingPayout.toLocaleString()}</div></div><p className="text-sm text-primary-700">Payout processing is not connected in this demo. No funds can be transferred from this screen.</p></section>
  <section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="border-b border-gray-100 px-5 py-4 font-semibold text-gray-900">{t('earnings.payoutHistory')}</div>{MOCK_PAYOUTS.length===0?<div className="p-8 text-center text-gray-500">{t('earnings.noPayouts')}</div>:<div className="divide-y divide-gray-100">{MOCK_PAYOUTS.map(po=><div key={po.id} className="flex items-center justify-between gap-3 px-5 py-4"><div><div className="font-medium text-gray-900">{po.period}</div><div className="text-sm text-gray-500">{po.method} · {po.id}{po.paidAt?' · Paid '+new Date(po.paidAt).toLocaleDateString():''}</div></div><div className="text-end"><div className="font-semibold text-gray-900">{'$'+po.amount.toLocaleString()}</div><div className="mt-1"><PayoutStatusBadge status={po.status}/></div></div></div>)}</div>}</section>
 </div>;
}