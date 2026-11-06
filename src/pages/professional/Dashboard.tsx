import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_JOBS } from '@/data/mock';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Flame, Briefcase, Wallet, Star } from 'lucide-react';

export function ProfessionalDashboard() {
  const { t } = useTranslation();
  const hotJobs = MOCK_JOBS.filter((j) => j.isHot);
  const assigned = MOCK_JOBS.filter((j) => j.status === 'assigned' || j.status === 'working');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('professional.welcome')}</h2>
        <p className="text-gray-500 mt-1">Manage jobs and track your earnings</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Wallet className="w-4 h-4" />
            {t('professional.todayEarnings')}
          </div>
          <div className="text-2xl font-bold text-gray-900">ETB 2,200</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Briefcase className="w-4 h-4" />
            {t('professional.completedJobs')}
          </div>
          <div className="text-2xl font-bold text-gray-900">47</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Star className="w-4 h-4" />
            {t('professional.rating')}
          </div>
          <div className="text-2xl font-bold text-gray-900">4.8</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Flame className="w-4 h-4" />
            {t('professional.hotJobs')}
          </div>
          <div className="text-2xl font-bold text-orange-600">{hotJobs.length}</div>
        </div>
      </div>

      {/* Hot Jobs */}
      {hotJobs.length > 0 && (
        <div className="bg-white rounded-xl border border-orange-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-orange-50 border-b border-orange-100">
            <div className="flex items-center gap-2 font-semibold text-orange-800">
              <Flame className="w-5 h-5" />
              {t('professional.hotJobs')}
            </div>
            <Link to="/professional/hot-jobs" className="text-sm text-orange-700 hover:underline">
              {t('common.viewAll')}
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {hotJobs.map((j) => (
              <div key={j.id} className="px-5 py-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-gray-900">{j.service}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {j.address} · {j.distanceKm} km
                  </div>
                </div>
                <div className="text-end">
                  <div className="font-semibold text-gray-900">ETB {j.price}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="px-3 py-1 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                      {t('professional.accept')}
                    </button>
                    <button className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-300 text-gray-600">
                      {t('professional.decline')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assigned jobs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{t('professional.myJobs')}</h3>
          <Link to="/professional/my-jobs" className="text-sm text-primary-600 hover:underline">
            {t('common.viewAll')}
          </Link>
        </div>
        {assigned.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t('professional.noJobs')}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {assigned.map((j) => (
              <div key={j.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{j.service}</div>
                  <div className="text-sm text-gray-500">{j.customer} · {j.address}</div>
                </div>
                <StatusBadge status={j.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
