import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_PROJECTS, MOCK_WORKERS, MOCK_TIMESHEETS } from '@/data/mock';
import { FolderKanban, Users, ClipboardList, TrendingUp } from 'lucide-react';

export function OrganizationDashboard() {
  const { t } = useTranslation();
  const active = MOCK_PROJECTS.filter((p) => p.status === 'active');
  const onSite = MOCK_WORKERS.filter((w) => w.status === 'active').length;
  const pendingTS = MOCK_TIMESHEETS.filter((ts) => ts.status === 'pending').length;
  const totalBudget = active.reduce((s, p) => s + p.budget, 0);
  const totalSpent = active.reduce((s, p) => s + p.spent, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">{t('construction.dashboard')}</h2>
        <Link
          to="/organization/projects"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700"
        >
          {t('construction.createProject')}
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <FolderKanban className="w-4 h-4" />
            {t('construction.activeProjects')}
          </div>
          <div className="text-2xl font-bold text-gray-900">{active.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Users className="w-4 h-4" />
            {t('construction.workersOnSite')}
          </div>
          <div className="text-2xl font-bold text-gray-900">{onSite}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <ClipboardList className="w-4 h-4" />
            {t('construction.pendingTimesheets')}
          </div>
          <div className="text-2xl font-bold text-amber-600">{pendingTS}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            {t('construction.budgetUsed')}
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{t('construction.activeProjects')}</h3>
          <Link to="/organization/projects" className="text-sm text-orange-600 hover:underline">
            {t('common.viewAll')}
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {active.map((p) => (
            <Link
              key={p.id}
              to={`/organization/projects/${p.id}`}
              className="block px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-gray-900">{p.name}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {p.client} · {p.location}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {p.foreman && `Foreman: ${p.foreman} · `}
                    {p.workers} workers
                  </div>
                </div>
                <div className="text-end shrink-0">
                  <div className="text-sm font-semibold text-gray-900">{p.progress}%</div>
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
