import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_TECHNICIANS } from '@/data/mock';
import { Sparkles, MapPin, Star, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const SERVICES = ['Plumbing', 'Electrical', 'Cleaning', 'Painting', 'HVAC'];

export function SmartMatch() {
  const { t } = useTranslation();
  const [service, setService] = useState('Plumbing');
  const [area, setArea] = useState('Kansas City, MO');
  const [matched, setMatched] = useState(false);

  const results = matched
    ? MOCK_TECHNICIANS.filter(
        (tech) =>
          tech.status === 'available' || tech.status === 'onTheWay'
      ).slice(0, 3)
    : [];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 text-primary-600 text-sm font-medium mb-1">
          <Sparkles className="w-4 h-4" />
          AI Smart Matching
        </div>
        <h2 className="text-xl font-bold text-gray-900">Find the right professional</h2>
        <p className="text-sm text-gray-500 mt-1">
          We match skills, availability, rating, and distance for you.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Service</label>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setService(s);
                  setMatched(false);
                }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium',
                  service === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Area / location</label>
          <input
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              setMatched(false);
            }}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g. Brookside, Overland Park, Lee’s Summit"
          />
        </div>
        <button
          onClick={() => setMatched(true)}
          className="w-full py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Match professionals
        </button>
      </div>

      {matched && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">
            Demo matches for {service} near {area}
          </h3>
          {results.map((tech, i) => (
            <div
              key={tech.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  {tech.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    {tech.name}
                    {i === 0 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary-100 text-primary-700">
                        Best match
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {tech.rating}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {tech.distanceMiles} mi
                    </span>
                    <span className="capitalize">{tech.status}</span>
                  </div>
                </div>
              </div>
              <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Select
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
