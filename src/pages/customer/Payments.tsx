import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_PAYMENTS, MOCK_QUOTES } from '@/data/mock';
import { PaymentStatusBadge } from '@/components/ui/PaymentStatusBadge';
import { CreditCard, Smartphone, Building2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CustomerPayments() {
  const { t } = useTranslation();
  const [payingId, setPayingId] = useState<string | null>(null);
  const [method, setMethod] = useState<'telebirr' | 'chapa' | 'bank'>('telebirr');

  const pending = MOCK_PAYMENTS.filter((p) => p.status === 'pending');
  const history = MOCK_PAYMENTS.filter((p) => p.status !== 'pending');
  const openQuotes = MOCK_QUOTES.filter((q) => q.status === 'pending');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">{t('payments.title')}</h2>

      {/* Pending payments */}
      {pending.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 font-semibold text-amber-800">
            Awaiting Payment
          </div>
          <div className="divide-y divide-gray-100">
            {pending.map((p) => (
              <div key={p.id} className="px-5 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-gray-900">{p.service}</div>
                    <div className="text-sm text-gray-500">{p.bookingId} · {p.id}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-gray-900">${p.amount.toLocaleString()}</div>
                    <button
                      onClick={() => setPayingId(payingId === p.id ? null : p.id)}
                      className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700"
                    >
                      {t('payments.payNow')}
                    </button>
                  </div>
                </div>

                {payingId === p.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="text-sm font-medium text-gray-700">{t('payments.selectMethod')}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'telebirr' as const, label: t('payments.telebirr'), icon: Smartphone },
                        { id: 'chapa' as const, label: t('payments.chapa'), icon: CreditCard },
                        { id: 'bank' as const, label: t('payments.bank'), icon: Building2 },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMethod(m.id)}
                          className={cn(
                            'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all',
                            method === m.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          )}
                        >
                          <m.icon className="w-5 h-5 text-primary-600" />
                          <span className="text-xs font-medium">{m.label}</span>
                        </button>
                      ))}
                    </div>
                    <button className="w-full py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      {t('payments.confirmPayment')} — ${p.amount.toLocaleString()}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open Quotes */}
      {openQuotes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
            {t('quotes.compare')}
          </div>
          <div className="divide-y divide-gray-100">
            {openQuotes.map((q) => (
              <div key={q.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-gray-900">{q.professional}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {q.bookingId} · {t('quotes.validUntil')} {new Date(q.validUntil).toLocaleDateString()}
                  </div>
                  {q.notes && <div className="text-sm text-gray-400 mt-1">{q.notes}</div>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-gray-900">${q.amount.toLocaleString()}</div>
                  <button className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
                    {t('quotes.accept')}
                  </button>
                  <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600">
                    {t('quotes.reject')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          {t('payments.history')}
        </div>
        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t('payments.noPayments')}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {history.map((p) => (
              <div key={p.id} className="px-5 py-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-gray-900">{p.service}</div>
                  <div className="text-sm text-gray-500">
                    {p.bookingId} · {p.method || '—'} · {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-end">
                  <div className="font-semibold text-gray-900">${p.amount.toLocaleString()}</div>
                  <div className="mt-1">
                    <PaymentStatusBadge status={p.status} />
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
