import { useTranslation } from 'react-i18next';
import { MOCK_PAYOUTS, MOCK_EARNINGS_SUMMARY } from '@/data/mock';
import { PayoutStatusBadge } from '@/components/ui/PaymentStatusBadge';
import { Wallet, TrendingUp, Clock, Banknote } from 'lucide-react';

export function ProfessionalEarnings() {
  const { t } = useTranslation();
  const s = MOCK_EARNINGS_SUMMARY;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">{t('earnings.title')}</h2>
        <button className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
          {t('earnings.requestPayout')}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Wallet className="w-4 h-4" />
            {t('earnings.today')}
          </div>
          <div className="text-2xl font-bold text-gray-900">${s.today.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            {t('earnings.thisWeek')}
          </div>
          <div className="text-2xl font-bold text-gray-900">${s.thisWeek.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Banknote className="w-4 h-4" />
            {t('earnings.thisMonth')}
          </div>
          <div className="text-2xl font-bold text-gray-900">${s.thisMonth.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Clock className="w-4 h-4" />
            {t('earnings.available')}
          </div>
          <div className="text-2xl font-bold text-primary-600">${s.availableBalance.toLocaleString()}</div>
        </div>
      </div>

      {/* Pending payout highlight */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-primary-700">{t('earnings.pendingPayout')}</div>
          <div className="text-xl font-bold text-primary-900">${s.pendingPayout.toLocaleString()}</div>
        </div>
        <div className="text-sm text-primary-600">Usually paid within 2–3 business days</div>
      </div>

      {/* Payout history */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          {t('earnings.payoutHistory')}
        </div>
        {MOCK_PAYOUTS.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t('earnings.noPayouts')}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {MOCK_PAYOUTS.map((po) => (
              <div key={po.id} className="px-5 py-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-gray-900">{po.period}</div>
                  <div className="text-sm text-gray-500">
                    {po.method} · {po.id}
                    {po.paidAt && ` · Paid ${new Date(po.paidAt).toLocaleDateString()}`}
                  </div>
                </div>
                <div className="text-end">
                  <div className="font-semibold text-gray-900">${po.amount.toLocaleString()}</div>
                  <div className="mt-1">
                    <PayoutStatusBadge status={po.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
