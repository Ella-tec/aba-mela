import { useTranslation } from 'react-i18next';
import { MOCK_PROJECTS, MOCK_WORKERS, MOCK_TIMESHEETS, MOCK_MILESTONES } from '@/data/mock';
import { HardHat, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function ForemanDashboard() {
  const { t } = useTranslation();
  // Simulate foreman view for PRJ-001
  const project = MOCK_PROJECTS.find((p) => p.id === 'PRJ-001')!;
  const workers = MOCK_WORKERS.filter((w) => w.projectId === 'PRJ-001');
  const todayTS = MOCK_TIMESHEETS.filter(
    (ts) => ts.projectId === 'PRJ-001' && ts.date === '2026-11-02'
  );
  const milestones = MOCK_MILESTONES.filter((m) => m.projectId === 'PRJ-001');
  const activeMilestone = milestones.find((m) => m.status === 'inProgress');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-orange-600 text-sm font-medium mb-1">
          <HardHat className="w-4 h-4" />
          {t('construction.foreman')}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
        <p className="text-sm text-gray-500">{project.location}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Progress</div>
          <div className="text-2xl font-bold text-gray-900">{project.progress}%</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
            <Users className="w-3.5 h-3.5" />
            On site today
          </div>
          <div className="text-2xl font-bold text-gray-900">{workers.filter((w) => w.status === 'active').length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Timesheets today</div>
          <div className="text-2xl font-bold text-gray-900">{todayTS.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Current milestone</div>
          <div className="text-sm font-semibold text-gray-900 truncate">
            {activeMilestone?.title || '—'}
          </div>
        </div>
      </div>

      {/* Current milestone */}
      {activeMilestone && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="text-sm text-orange-700 font-medium mb-1">In progress</div>
          <div className="font-semibold text-gray-900">{activeMilestone.title}</div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-2 bg-orange-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${activeMilestone.progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">{activeMilestone.progress}%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Due {activeMilestone.dueDate}</div>
        </div>
      )}

      {/* Today's crew */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 font-semibold text-gray-900">
          Today's crew
        </div>
        <div className="divide-y divide-gray-100">
          {workers.map((w) => (
            <div key={w.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{w.name}</div>
                <div className="text-sm text-gray-500">{w.role}</div>
              </div>
              {w.status === 'active' ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Present
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  {w.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
