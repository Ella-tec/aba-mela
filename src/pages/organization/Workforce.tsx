import { useTranslation } from 'react-i18next';
import { MOCK_WORKERS, MOCK_PROJECTS } from '@/data/mock';
import { cn } from '@/lib/utils';

export function WorkforcePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">{t('construction.workforce')}</h2>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">{t('construction.role')}</th>
                <th className="px-5 py-3 font-medium">Project</th>
                <th className="px-5 py-3 font-medium">{t('construction.dailyRate')}</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_WORKERS.map((w) => {
                const project = MOCK_PROJECTS.find((p) => p.id === w.projectId);
                return (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{w.name}</div>
                      <div className="text-xs text-gray-400">{w.phone}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{w.role}</td>
                    <td className="px-5 py-3 text-gray-600">{project?.name || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{'</td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded-full',
                          w.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : w.status === 'onLeave'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {t(`construction.status.${w.status}`)}
                      </span>
                    </td>
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
 + w.dailyRate.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded-full',
                          w.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : w.status === 'onLeave'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {t(`construction.status.${w.status}`)}
                      </span>
                    </td>
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
