import { useState } from 'react';
import { MOCK_PROPERTIES } from '@/data/mock';
import { Home, Wrench, Calendar, FileText, Plus, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const HISTORY: Record<string, { date: string; service: string; provider: string; amount: number }[]> = {
  'HP-1': [
    { date: '2026-10-28', service: 'Electrical', provider: 'Sara Haile', amount: 1200 },
    { date: '2026-09-15', service: 'Plumbing', provider: 'Abebe Kebede', amount: 850 },
    { date: '2026-08-02', service: 'Cleaning', provider: 'Hanna Molla', amount: 600 },
  ],
  'HP-2': [
    { date: '2026-09-15', service: 'HVAC', provider: 'Daniel Girma', amount: 2200 },
  ],
  'HP-3': [
    { date: '2026-10-05', service: 'Painting', provider: 'Yonas Tadesse', amount: 4500 },
    { date: '2026-08-20', service: 'Plumbing', provider: 'Abebe Kebede', amount: 900 },
  ],
};

export function HomePassport() {
  const [selected, setSelected] = useState(MOCK_PROPERTIES[0]?.id);

  const property = MOCK_PROPERTIES.find((p) => p.id === selected);
  const history = selected ? HISTORY[selected] || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Home Passport</h2>
          <p className="text-sm text-gray-500">Property records, maintenance & service history</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
          <Plus className="w-4 h-4" />
          Add property
        </button>
      </div>

      {/* Property cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        {MOCK_PROPERTIES.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={cn(
              'text-start bg-white rounded-xl border-2 p-4 transition-colors',
              selected === p.id ? 'border-primary-500 bg-primary-50/50' : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-gray-900 text-sm">{p.name}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {p.address}
            </div>
            <div className="text-xs text-gray-400 mt-1">{p.type} · {p.servicesCount} services</div>
          </button>
        ))}
      </div>

      {property && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">{property.name}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Type</div>
                <div className="font-medium">{property.type}</div>
              </div>
              <div>
                <div className="text-gray-500">Size</div>
                <div className="font-medium">{property.size || '—'}</div>
              </div>
              <div>
                <div className="text-gray-500">Year built</div>
                <div className="font-medium">{property.yearBuilt || '—'}</div>
              </div>
              <div>
                <div className="text-gray-500">Address</div>
                <div className="font-medium">{property.address}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Wrench className="w-4 h-4 text-gray-400" />
                Last service: {property.lastService || '—'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                Next maintenance: {property.nextMaintenance || '—'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Service history
            </div>
            {history.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No services logged yet</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {history.map((h, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{h.service}</div>
                      <div className="text-sm text-gray-500">{h.provider} · {h.date}</div>
                    </div>
                    <div className="font-semibold text-gray-900">ETB {h.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
