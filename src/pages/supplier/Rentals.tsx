import { MOCK_RENTALS } from '@/data/mock';
import type { RentalStatus } from '@/data/mock';
import { cn } from '@/lib/utils';

const styles: Record<RentalStatus, string> = {
  requested: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  returned: 'bg-gray-100 text-gray-600',
  overdue: 'bg-red-100 text-red-700',
};

export function SupplierRentals() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Equipment Rentals</h2>
        <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">
          New rental
        </button>
      </div>
      <div className="grid gap-3">
        {MOCK_RENTALS.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{r.equipment}</span>
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full capitalize', styles[r.status])}>
                  {r.status}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{r.customer}{r.project ? ` · ${r.project}` : ''}</div>
              <div className="text-xs text-gray-400 mt-0.5">{r.startDate} → {r.endDate} · {r.id}</div>
            </div>
            <div className="text-end">
              <div className="font-bold text-gray-900">${r.dailyRate.toLocaleString()}/day</div>
              {r.status === 'overdue' && (
                <button className="mt-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white">
                  Mark returned
                </button>
              )}
              {r.status === 'active' && (
                <button className="mt-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300">
                  Extend
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
