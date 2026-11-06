import { useTranslation } from 'react-i18next';
import { MOCK_JOBS } from '@/data/mock';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Flame, MapPin } from 'lucide-react';

export function ProfessionalJobs({ hotOnly = false }: { hotOnly?: boolean }) {
  const { t } = useTranslation();
  const jobs = hotOnly ? MOCK_JOBS.filter((j) => j.isHot) : MOCK_JOBS.filter((j) => j.status === 'requested');

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">
        {hotOnly ? t('professional.hotJobs') : t('professional.availableJobs')}
      </h2>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          {t('professional.noJobs')}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{j.service}</span>
                  {j.isHot && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                      <Flame className="w-3 h-3" />
                      Hot
                    </span>
                  )}
                  <StatusBadge status={j.status} />
                </div>
                <div className="text-sm text-gray-500 mt-1">{j.customer}</div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {j.address}
                  {j.distanceKm != null && ` · ${j.distanceKm} km`}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(j.scheduledAt).toLocaleString()} · {j.id}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-lg font-bold text-gray-900">ETB {j.price.toLocaleString()}</div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                    {t('professional.accept')}
                  </button>
                  <button className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                    {t('professional.decline')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
