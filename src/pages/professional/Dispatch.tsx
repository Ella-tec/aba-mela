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

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {Object.entries(statusCounts).map(([key, count]) => (
          <div key={key} className="rounded-lg border border-gray-200 bg-white p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">{count}</div>
            <div className="mt-0.5 text-xs capitalize text-gray-500">
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

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-3 font-semibold text-gray-900">
          Active &amp; Open Jobs
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-5 py-2.5 font-medium">Job</th>
                <th className="px-5 py-2.5 font-medium">Customer</th>
                <th className="px-5 py-2.5 font-medium">Location</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Assigned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_MAP_JOBS.map((job) => {
                const tech = MOCK_TECHNICIANS.find((person) => person.id === job.techId);
                return (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {job.service} {job.isHot && '🔥'}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{job.customer}</td>
                    <td className="px-5 py-3 text-gray-600">{job.address}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={job.status} />
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
