import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_PROJECTS, MOCK_MILESTONES, MOCK_WORKERS } from '@/data/mock';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

function findProject(id?: string) {\n  const sample = MOCK_PROJECTS.find((item) => item.id === id);\n  if (sample) return sample;\n  try {\n    const local = JSON.parse(localStorage.getItem('mela-demo-projects') || '[]') as typeof MOCK_PROJECTS;\n    return local.find((item) => item.id === id);\n  } catch { return undefined; }\n}\n\nexport function ProjectDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const project = findProject(id);
  const milestones = MOCK_MILESTONES.filter((m) => m.projectId === id);
  const workers = MOCK_WORKERS.filter((w) => w.projectId === id);

  if (!project) {
    return (
      <div className="text-center py-12 text-gray-500">
        Project not found.{' '}
        <Link to="/organization/projects" className="text-orange-600 hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/organization/projects"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('construction.projects')}
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
            <div className="text-sm text-gray-500 mt-1">
              {project.client} · {project.location}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {project.startDate} → {project.endDate}
              {project.foreman && ` · Foreman: ${project.foreman}`}
            </div>
          </div>
          <div className="text-end">
            <div className="text-3xl font-bold text-gray-900">{project.progress}%</div>
            <div className="w-32 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden ms-auto">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-4">
          <Link to="/organization/analytics" aria-label="View project budget analytics" className="rounded-lg p-2 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600"><div className="text-xs text-gray-500">{t('construction.budget')}</div><div className="font-semibold text-gray-900">{'
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          {t('construction.milestones')}
        </div>
        <div className="divide-y divide-gray-100">
          {milestones.map((m) => (
            <div key={m.id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-gray-900">{m.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">Due {m.dueDate}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      m.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                    )}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    m.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : m.status === 'inProgress'
                        ? 'bg-amber-100 text-amber-700'
                        : m.status === 'delayed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {t(`construction.status.${m.status}`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workers on project */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          Team ({workers.length})
        </div>
        <div className="divide-y divide-gray-100">
          {workers.map((w) => (
            <div key={w.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{w.name}</div>
                <div className="text-sm text-gray-500">{w.role}</div>
              </div>
              <div className="text-sm text-gray-600">${w.dailyRate}/day</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
+project.budget.toLocaleString()}</div><span className="text-[11px] text-primary-700">View analytics</span></Link>
          <Link to="/organization/analytics" aria-label="View project spending analytics" className="rounded-lg p-2 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600"><div className="text-xs text-gray-500">{t('construction.spent')}</div><div className="font-semibold text-gray-900">{'
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          {t('construction.milestones')}
        </div>
        <div className="divide-y divide-gray-100">
          {milestones.map((m) => (
            <div key={m.id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-gray-900">{m.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">Due {m.dueDate}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      m.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                    )}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    m.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : m.status === 'inProgress'
                        ? 'bg-amber-100 text-amber-700'
                        : m.status === 'delayed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {t(`construction.status.${m.status}`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workers on project */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          Team ({workers.length})
        </div>
        <div className="divide-y divide-gray-100">
          {workers.map((w) => (
            <div key={w.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{w.name}</div>
                <div className="text-sm text-gray-500">{w.role}</div>
              </div>
              <div className="text-sm text-gray-600">${w.dailyRate}/day</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
+project.spent.toLocaleString()}</div><span className="text-[11px] text-primary-700">View analytics</span></Link>
          <Link to="/organization/workforce" aria-label="View project workforce" className="rounded-lg p-2 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600"><div className="text-xs text-gray-500">{t('construction.workforce')}</div><div className="font-semibold text-gray-900">{project.workers} workers</div><span className="text-[11px] text-primary-700">View workforce</span></Link>
          <Link to="/organization/analytics" aria-label="View remaining project budget" className="rounded-lg p-2 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600"><div className="text-xs text-gray-500">Remaining</div><div className="font-semibold text-gray-900">{'
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          {t('construction.milestones')}
        </div>
        <div className="divide-y divide-gray-100">
          {milestones.map((m) => (
            <div key={m.id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-gray-900">{m.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">Due {m.dueDate}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      m.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                    )}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    m.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : m.status === 'inProgress'
                        ? 'bg-amber-100 text-amber-700'
                        : m.status === 'delayed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {t(`construction.status.${m.status}`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workers on project */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          Team ({workers.length})
        </div>
        <div className="divide-y divide-gray-100">
          {workers.map((w) => (
            <div key={w.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{w.name}</div>
                <div className="text-sm text-gray-500">{w.role}</div>
              </div>
              <div className="text-sm text-gray-600">${w.dailyRate}/day</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
+(project.budget-project.spent).toLocaleString()}</div><span className="text-[11px] text-primary-700">View analytics</span></Link>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          {t('construction.milestones')}
        </div>
        <div className="divide-y divide-gray-100">
          {milestones.map((m) => (
            <div key={m.id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-gray-900">{m.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">Due {m.dueDate}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      m.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                    )}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    m.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : m.status === 'inProgress'
                        ? 'bg-amber-100 text-amber-700'
                        : m.status === 'delayed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {t(`construction.status.${m.status}`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workers on project */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          Team ({workers.length})
        </div>
        <div className="divide-y divide-gray-100">
          {workers.map((w) => (
            <div key={w.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{w.name}</div>
                <div className="text-sm text-gray-500">{w.role}</div>
              </div>
              <div className="text-sm text-gray-600">${w.dailyRate}/day</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
