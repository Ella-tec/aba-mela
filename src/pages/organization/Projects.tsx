import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_PROJECTS } from '@/data/mock';
import type { ProjectStatus } from '@/data/mock';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

const statusStyle: Record<ProjectStatus, string> = {
  planning: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  onHold: 'bg-amber-100 text-amber-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

export function ProjectsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | ProjectStatus>('all');

  const filtered =
    filter === 'all' ? MOCK_PROJECTS : MOCK_PROJECTS.filter((p) => p.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">{t('construction.projects')}</h2>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700">
          <Plus className="w-4 h-4" />
          {t('construction.createProject')}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'active', 'planning', 'completed', 'onHold'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap',
              filter === f
                ? 'bg-orange-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            )}
          >
            {f === 'all' ? 'All' : t(`construction.status.${f}`)}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            {t('construction.noProjects')}
          </div>
        ) : (
          filtered.map((p) => (
            <Link
              key={p.id}
              to={`/organization/projects/${p.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-orange-300 transition-colors block"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{p.name}</span>
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full',
                        statusStyle[p.status]
                      )}
                    >
                      {t(`construction.status.${p.status}`)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {p.client} · {p.location}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {p.startDate} → {p.endDate}
                    {p.foreman && ` · ${p.foreman}`}
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-sm text-gray-500">{t('construction.progress')}</div>
                  <div className="text-lg font-bold text-gray-900">{p.progress}%</div>
                  <div className="w-28 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden ms-auto">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    ETB {(p.spent / 1000).toFixed(0)}k / {(p.budget / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
