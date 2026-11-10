import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_PROJECTS, MOCK_MILESTONES, MOCK_WORKERS } from '@/data/mock';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

function findProject(id?: string) {
  const sample = MOCK_PROJECTS.find((item) => item.id === id);
  if (sample) return sample;
  try {
    const local = JSON.parse(localStorage.getItem('mela-demo-projects') || '[]') as typeof MOCK_PROJECTS;
    return local.find((item) => item.id === id);
  } catch {
    return undefined;
  }
}

export function ProjectDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const project = findProject(id);
  const milestones = MOCK_MILESTONES.filter((m) => m.projectId === id);
  const workers = MOCK_WORKERS.filter((w) => w.projectId === id);

  if (!project) {
    return (
      <div className="py-12 text-center text-gray-500">
        Project not found.{' '}
        <Link to="/organization/projects" className="text-orange-600 hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/organization/projects" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft className="h-4 w-4" />
        {t('construction.projects')}
      </Link>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
            <div className="mt-1 text-sm text-gray-500">{project.client} · {project.location}</div>
            <div className="mt-1 text-sm text-gray-400">{project.startDate} → {project.endDate || 'Not scheduled'}{project.foreman ? ' · Foreman: ' + project.foreman : ''}</div>
          </div>
          <div className="text-end">
            <div className="text-3xl font-bold text-gray-900">{project.progress}%</div>
            <div className="ms-auto mt-2 h-2 w-32 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-orange-500" style={{ width: project.progress + '%' }} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-4">
          <Link to="/organization/analytics" aria-label="View project budget analytics" className="rounded-lg p-2 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600">
            <div className="text-xs text-gray-500">{t('construction.budget')}</div>
            <div className="font-semibold text-gray-900">{'$' + project.budget.toLocaleString()}</div>
            <span className="text-[11px] text-primary-700">View analytics</span>
          </Link>
          <Link to="/organization/analytics" aria-label="View project spending analytics" className="rounded-lg p-2 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600">
            <div className="text-xs text-gray-500">{t('construction.spent')}</div>
            <div className="font-semibold text-gray-900">{'$' + project.spent.toLocaleString()}</div>
            <span className="text-[11px] text-primary-700">View analytics</span>
          </Link>
          <Link to="/organization/workforce" aria-label="View project workforce" className="rounded-lg p-2 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600">
            <div className="text-xs text-gray-500">{t('construction.workforce')}</div>
            <div className="font-semibold text-gray-900">{project.workers} workers</div>
            <span className="text-[11px] text-primary-700">View workforce</span>
          </Link>
          <Link to="/organization/analytics" aria-label="View remaining project budget" className="rounded-lg p-2 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600">
            <div className="text-xs text-gray-500">Remaining</div>
            <div className="font-semibold text-gray-900">{'$' + (project.budget - project.spent).toLocaleString()}</div>
            <span className="text-[11px] text-primary-700">View analytics</span>
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4 font-semibold text-gray-900">{t('construction.milestones')}</div>
        {milestones.length === 0 ? <p className="p-6 text-sm text-gray-500">No milestones are attached to this demo project yet.</p> : (
          <div className="divide-y divide-gray-100">
            {milestones.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div><div className="font-medium text-gray-900">{m.title}</div><div className="mt-0.5 text-xs text-gray-400">Due {m.dueDate}</div></div>
                <div className="flex items-center gap-3"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100"><div className={cn('h-full rounded-full',m.status==='completed'?'bg-green-500':'bg-orange-500')} style={{width:m.progress+'%'}}/></div><span className={cn('rounded-full px-2 py-0.5 text-xs font-medium',m.status==='completed'?'bg-green-100 text-green-700':m.status==='inProgress'?'bg-amber-100 text-amber-700':m.status==='delayed'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-600')}>{t('construction.status.'+m.status)}</span></div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4 font-semibold text-gray-900">Team ({workers.length})</div>
        {workers.length === 0 ? <p className="p-6 text-sm text-gray-500">No workers are assigned to this demo project yet.</p> : (
          <div className="divide-y divide-gray-100">{workers.map((w) => <div key={w.id} className="flex items-center justify-between px-5 py-3"><div><div className="font-medium text-gray-900">{w.name}</div><div className="text-sm text-gray-500">{w.role}</div></div><div className="text-sm text-gray-600">{'$' + w.dailyRate + '/day'}</div></div>)}</div>
        )}
      </section>
    </div>
  );
}
