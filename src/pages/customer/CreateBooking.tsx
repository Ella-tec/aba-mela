import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SERVICES } from '@/data/mock';
import { cn } from '@/lib/utils';
import { Wrench, Zap, Paintbrush, Sparkles, Hammer, Wind, Home, Bug, Trees } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  plumbing: Wrench,
  electrical: Zap,
  painting: Paintbrush,
  cleaning: Sparkles,
  carpentry: Hammer,
  hvac: Wind,
  masonry: Home,
  roofing: Home,
  tiling: Home,
  appliance: Home,
  pest: Bug,
  landscaping: Trees,
};

export function CreateBooking() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-gray-900">{t('booking.createTitle')}</h2>

      {/* Steps */}
      <div className="flex items-center gap-2 text-sm">
        <span className={cn('font-medium', step >= 1 ? 'text-primary-600' : 'text-gray-400')}>
          1. {t('booking.selectService')}
        </span>
        <span className="text-gray-300">→</span>
        <span className={cn('font-medium', step >= 2 ? 'text-primary-600' : 'text-gray-400')}>
          2. {t('booking.selectDate')}
        </span>
        <span className="text-gray-300">→</span>
        <span className={cn('font-medium', step >= 3 ? 'text-primary-600' : 'text-gray-400')}>
          3. {t('booking.describeIssue')}
        </span>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SERVICES.map((s) => {
            const Icon = iconMap[s.key] || Wrench;
            return (
              <button
                key={s.key}
                onClick={() => setSelected(s.key)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  selected === s.key
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                <Icon className="w-6 h-6 text-primary-600" />
                <span className="text-sm font-medium text-gray-800">
                  {t(`services.${s.key}`)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Preferred date
            </label>
            <input
              type="date"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Preferred time
            </label>
            <select className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Morning (8:00 – 12:00)</option>
              <option>Afternoon (12:00 – 17:00)</option>
              <option>Evening (17:00 – 20:00)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('booking.address')}
            </label>
            <input
              type="text"
              placeholder="Street address, city, state, ZIP"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('booking.describeIssue')}
            </label>
            <textarea
              rows={4}
              placeholder="Describe the problem or work needed..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Photos (optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500">
              Click or drag photos here
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40"
        >
          {t('common.back')}
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 1 && !selected}
            className="px-5 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-40"
          >
            {t('common.continue')}
          </button>
        ) : (
          <button className="px-5 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
            {t('booking.submit')}
          </button>
        )}
      </div>
    </div>
  );
}
