import { useTranslation } from 'react-i18next';
import { MOCK_WORKERS, MOCK_PROJECTS } from '@/data/mock';
import { cn } from '@/lib/utils';

export function WorkforcePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">{t('construction.workforce')}</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Name</th>
                <th scope="col" className="px-5 py-3 font-medium">{t('construction.role')}</th>
                <th scope="col" className="px-5 py-3 font-medium">Project</th>
                <th scope="col" className="px-5 py-3 font-medium">{t('construction.dailyRate')}</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_WORKERS.map((w) => {
                const project = MOCK_PROJECTS.find((p) => p.id === w.projectId);
                return (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3"><div className="font-medium text-gray-900">{w.name}</div><div className="text-xs text-gray-400">{w.phone}</div></td>
                    <td className="px-5 py-3 text-gray-600">{w.role}</td>
                    <td className="px-5 py-3 text-gray-600">{project?.name || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{'$' + w.dailyRate.toLocaleString()}</td>
                    <td className="px-5 py-3"><span className={cn('rounded-full px-2 py-0.5 text-xs font-medium',w.status==='active'?'bg-green-100 text-green-700':w.status==='onLeave'?'bg-amber-100 text-amber-700':'bg-gray-100 text-gray-600')}>{t('construction.status.'+w.status)}</span></td>
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
