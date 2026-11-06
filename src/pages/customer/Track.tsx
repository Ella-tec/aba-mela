import { useTranslation } from 'react-i18next';
import { LiveMap } from '@/components/maps/LiveMap';
import { MOCK_TECHNICIANS, MOCK_MAP_JOBS } from '@/data/mock';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MapPin, Clock, Navigation } from 'lucide-react';

const TIMELINE = [
  { key: 'requested', label: 'Requested' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'onTheWay', label: 'On the Way' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'working', label: 'Working' },
  { key: 'completed', label: 'Completed' },
] as const;

export function CustomerTrack() {
  const { t } = useTranslation();

  // Illustrative demo tracking: BK-1001 with sample provider T1
  const activeJob = MOCK_MAP_JOBS.find((j) => j.id === 'BK-1001');
  const tech = MOCK_TECHNICIANS.find((t) => t.id === 'T1');
  const nearby = MOCK_TECHNICIANS.filter((t) => t.status === 'available' || t.status === 'onTheWay');

  const currentStep = activeJob?.status === 'onTheWay' ? 2 : 1;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">{t('maps.trackTechnician')}</h2>

      {activeJob && tech ? (
        <>
          {/* Active job card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="font-semibold text-gray-900">{activeJob.service}</div>
                <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {activeJob.address}
                </div>
              </div>
              <StatusBadge status={activeJob.status} />
            </div>

            <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                {tech.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{tech.name}</div>
                <div className="text-sm text-gray-500">{tech.service} · ★ {tech.rating}</div>
              </div>
              <div className="text-end text-sm">
                <div className="flex items-center gap-1 text-primary-700 font-medium">
                  <Navigation className="w-4 h-4" />
                  On the way
                </div>
                <div className="text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  ETA ~12 min
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
              {TIMELINE.map((step, i) => (
                <div key={step.key} className="flex flex-col items-center min-w-[60px]">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      i <= currentStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                  <div
                    className={`text-[10px] mt-1 text-center ${
                      i <= currentStep ? 'text-primary-700 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <LiveMap
            technicians={[tech]}
            jobs={[activeJob]}
            height="360px"
          />
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          {t('maps.noActiveTracking')}
        </div>
      )}

      {/* Nearby professionals */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t('maps.nearby')}</h3>
        <LiveMap technicians={nearby} jobs={[]} height="280px" showLegend={false} />
        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          {nearby.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3"
            >
              <div>
                <div className="font-medium text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-500">{t.service} · {t.distanceMiles} mi</div>
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  t.status === 'available'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {t.status === 'available' ? 'Available' : 'On the Way'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
