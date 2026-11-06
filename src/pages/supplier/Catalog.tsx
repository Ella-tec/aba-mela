import { useState } from 'react';
import { MOCK_PRODUCTS } from '@/data/mock';
import { cn } from '@/lib/utils';
import { Search, Plus } from 'lucide-react';

const categories = ['All', 'Materials', 'Finishing', 'Equipment', 'Rental'];

export function SupplierCatalog() {
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const filtered = MOCK_PRODUCTS.filter((p) => {
    if (cat !== 'All' && p.category !== cat) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">Product Catalog</h2>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">
          <Plus className="w-4 h-4" />
          Add product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full ps-10 pe-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap',
                cat === c ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-300 transition-colors">
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="font-semibold text-gray-900">{p.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{p.category} · {p.supplier}</div>
              </div>
              {p.stock < 20 && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Low</span>
              )}
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <div className="text-lg font-bold text-gray-900">${p.price.toLocaleString()}</div>
                <div className="text-xs text-gray-500">per {p.unit}</div>
              </div>
              <div className="text-sm text-gray-600">Stock: {p.stock}</div>
            </div>
            <button className="mt-3 w-full py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50">
              Order / Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
