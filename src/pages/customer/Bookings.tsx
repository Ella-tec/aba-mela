import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_CUSTOMER_BOOKINGS } from '@/data/mock';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const filters = ['all', 'active', 'completed', 'cancelled'] as const;

export function CustomerBookings() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<(typeof filters)[number]>('all');

  const filtered = MOCK_CUSTOMER_BOOKINGS.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'active')
      return !['completed', 'cancelled'].includes(b.status);
    if (filter === 'completed') return b.status === 'completed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">{t('customer.myBookings')}</h2>
        <Link
          to="/customer/create-booking"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700"
        >
          {t('customer.createBooking')}
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            )}
          >
            {f === 'all' ? 'All' : t(`customer.${f}`)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">{t('customer.noBookings')}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((b) => (
              <Link
                key={b.id}
                to={`/customer/bookings/${b.id}`}
                className="block px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-gray-900">{b.service}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {b.address}
                      {b.professional && ` · ${b.professional}`}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(b.scheduledAt).toLocaleString()} · {b.id}
                    </div>
                  </div>
                  <div className="text-end shrink-0">
                    <StatusBadge status={b.status} />
                    {b.price != null && (
                      <div className="text-sm font-medium text-gray-900 mt-2">
                        ETB {b.price.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
