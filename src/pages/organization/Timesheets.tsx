import { useTranslation } from 'react-i18next';
import { MOCK_TIMESHEETS } from '@/data/mock';
import { cn } from '@/lib/utils';

export function TimesheetsPage() {
  const { t } = useTranslation();
  const pending = MOCK_TIMESHEETS.filter((ts) => ts.status === 'pending');
  const approved = MOCK_TIMESHEETS.filter((ts) => ts.status === 'approved');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">{t('construction.timesheets')}</h2>

      {pending.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 font-semibold text-amber-800">
            Pending approval ({pending.length})
          </div>
          <div className="divide-y divide-gray-100">
            {pending.map((ts) => (
              <div
                key={ts.id}
                className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="font-medium text-gray-900">{ts.workerName}</div>
                  <div className="text-sm text-gray-500">
                    {ts.projectName} · {ts.date}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-semibold text-gray-900">{ts.hours}h</div>
                  <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700">
                    {t('construction.approve')}
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-600">
                    {t('construction.reject')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 font-semibold text-gray-900">
          Recent timesheets
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-2.5 font-medium">Worker</th>
                <th className="px-5 py-2.5 font-medium">Project</th>
                <th className="px-5 py-2.5 font-medium">Date</th>
                <th className="px-5 py-2.5 font-medium">{t('construction.hours')}</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_TIMESHEETS.map((ts) => (
                <tr key={ts.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{ts.workerName}</td>
                  <td className="px-5 py-3 text-gray-600">{ts.projectName}</td>
                  <td className="px-5 py-3 text-gray-600">{ts.date}</td>
                  <td className="px-5 py-3 text-gray-900 font-medium">{ts.hours}h</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full',
                        ts.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : ts.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {t(`construction.status.${ts.status}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
