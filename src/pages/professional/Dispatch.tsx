import { useTranslation } from 'react-i18next';
import { LiveMap } from '@/components/maps/LiveMap';
import { MOCK_TECHNICIANS, MOCK_MAP_JOBS } from '@/data/mock';
import { StatusBadge } from '@/components/ui/StatusBadge';

const statusCounts = {
  available: MOCK_TECHNICIANS.filter((t) => t.status === 'available').length,
  onTheWay: MOCK_TECHNICIANS.filter((t) => t.status === 'onTheWay').length,
  working: MOCK_TECHNICIANS.filter((t) => t.status === 'working').length,
  busy: MOCK_TECHNICIANS.filter((t) => t.status === 'busy').length,
  offline: MOCK_TECHNICIANS.filter((t) => t.status === 'offline').length,
};

export function DispatchCenter() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">{t('maps.dispatch')}</h2>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {Object.entries(statusCounts).map(([key, count]) => (
          <div key={key} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">{count}</div>
            <div className="text-xs text-gray-500 capitalize mt-0.5">
              {key.replace(/([A-Z])/g, ' $1')}
            </div>
          </div>
        ))}
      </div>

      <LiveMap
        technicians={MOCK_TECHNICIANS}
        jobs={MOCK_MAP_JOBS}
        height="480px"
      />

      {/* Open jobs table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 font-semibold text-gray-900">
          Active & Open Jobs
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-2.5 font-medium">Job</th>
                <th className="px-5 py-2.5 font-medium">Customer</th>
                <th className="px-5 py-2.5 font-medium">Location</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Assigned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_MAP_JOBS.map((j) => {
                const tech = MOCK_TECHNICIANS.find((t) => t.id === j.techId);
                return (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {j.service} {j.isHot && '🔥'}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{j.customer}</td>
                    <td className="px-5 py-3 text-gray-600">{j.address}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={j.status} />
                    </td>
                    <td className="px-5 py-3 text-gray-600">{tech?.name || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
