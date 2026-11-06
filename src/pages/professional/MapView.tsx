import { useTranslation } from 'react-i18next';
import { LiveMap } from '@/components/maps/LiveMap';
import { MOCK_TECHNICIANS, MOCK_MAP_JOBS } from '@/data/mock';
import { Flame, MapPin } from 'lucide-react';

export function ProfessionalMapView() {
  const { t } = useTranslation();
  const myJobs = MOCK_MAP_JOBS.filter((j) => j.techId === 'T1' || j.status === 'requested');
  const hotJobs = MOCK_MAP_JOBS.filter((j) => j.isHot);
  // Show self + nearby
  const techs = MOCK_TECHNICIANS.filter((t) => t.id === 'T1' || t.status === 'available');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">{t('maps.title')}</h2>

      <LiveMap technicians={techs} jobs={myJobs} height="420px" />

      {/* Hot jobs list under map */}
      {hotJobs.length > 0 && (
        <div className="bg-white rounded-xl border border-orange-200 overflow-hidden">
          <div className="px-5 py-3 bg-orange-50 border-b border-orange-100 flex items-center gap-2 font-semibold text-orange-800">
            <Flame className="w-5 h-5" />
            {t('professional.hotJobs')} on map
          </div>
          <div className="divide-y divide-gray-100">
            {hotJobs.map((j) => (
              <div key={j.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{j.service}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {j.address}
                  </div>
                </div>
                <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                  {t('professional.accept')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
