import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_CUSTOMER_BOOKINGS } from '@/data/mock';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CalendarPlus, Search, Wallet, ClipboardList } from 'lucide-react';

export function CustomerDashboard() {
  const { t } = useTranslation();
  const active = MOCK_CUSTOMER_BOOKINGS.filter((b) =>
    ['requested', 'quoted', 'accepted', 'assigned', 'onTheWay', 'arrived', 'working'].includes(b.status)
  );
  const recent = MOCK_CUSTOMER_BOOKINGS.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('customer.welcome')}</h2>
        <p className="text-gray-500 mt-1">Here's what's happening with your services</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          to="/customer/create-booking"
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
        >
          <CalendarPlus className="w-6 h-6" />
          <span className="text-sm font-medium">{t('customer.createBooking')}</span>
        </Link>
        <Link
          to="/customer/find-service"
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-200 hover:border-primary-300 transition-colors"
        >
          <Search className="w-6 h-6 text-primary-600" />
          <span className="text-sm font-medium text-gray-800">{t('customer.findService')}</span>
        </Link>
        <Link
          to="/customer/bookings"
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-200 hover:border-primary-300 transition-colors"
        >
          <ClipboardList className="w-6 h-6 text-primary-600" />
          <span className="text-sm font-medium text-gray-800">{t('customer.myBookings')}</span>
        </Link>
        <Link
          to="/customer/payments"
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-200 hover:border-primary-300 transition-colors"
        >
          <Wallet className="w-6 h-6 text-primary-600" />
          <span className="text-sm font-medium text-gray-800">{t('customer.payments')}</span>
        </Link>
      </div>

      {/* Active bookings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{t('customer.active')}</h3>
          <Link to="/customer/bookings" className="text-sm text-primary-600 hover:underline">
            {t('common.viewAll')}
          </Link>
        </div>
        {active.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t('customer.noBookings')}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {active.map((b) => (
              <Link
                key={b.id}
                to={`/customer/bookings/${b.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-900">{b.service}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {b.professional || 'Awaiting professional'} · {b.address}
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent activity</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {recent.map((b) => (
            <div key={b.id} className="flex items-center justify-between px-5 py-3">
              <div className="text-sm">
                <span className="font-medium text-gray-900">{b.service}</span>
                <span className="text-gray-400 mx-2">·</span>
                <span className="text-gray-500">{b.id}</span>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
