import { Link } from 'react-router-dom';
import { Package, Truck, Warehouse, ShoppingCart, AlertTriangle } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_RENTALS } from '@/data/mock';

export function SupplierDashboard() {
  const lowStock = MOCK_PRODUCTS.filter((p) => p.stock < 20).length;
  const pendingOrders = MOCK_ORDERS.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const activeRentals = MOCK_RENTALS.filter((r) => r.status === 'active' || r.status === 'overdue').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Supplier Marketplace</h2>
          <p className="text-sm text-gray-500">Materials, equipment & rentals</p>
        </div>
        <div className="flex gap-2">
          <Link to="/suppliers/orders" className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
            Orders
          </Link>
          <Link to="/suppliers/rentals" className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
            Rentals
          </Link>
          <Link to="/suppliers/catalog" className="px-3 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
            Catalog
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Products', value: MOCK_PRODUCTS.length, icon: Package, color: 'text-emerald-600' },
          { label: 'Open orders', value: pendingOrders, icon: ShoppingCart, color: 'text-blue-600' },
          { label: 'Active rentals', value: activeRentals, icon: Truck, color: 'text-indigo-600' },
          { label: 'Low stock', value: lowStock, icon: lowStock ? AlertTriangle : Warehouse, color: lowStock ? 'text-amber-600' : 'text-gray-600' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <k.icon className={`w-4 h-4 ${k.color}`} />
              {k.label}
            </div>
            <div className="text-2xl font-bold text-gray-900">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 font-semibold flex justify-between">
            <span>Recent orders</span>
            <Link to="/suppliers/orders" className="text-sm text-emerald-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_ORDERS.slice(0, 4).map((o) => (
              <div key={o.id} className="px-5 py-3 flex justify-between gap-2">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{o.productName}</div>
                  <div className="text-xs text-gray-500">{o.customer} · {o.id}</div>
                </div>
                <div className="text-end">
                  <div className="text-sm font-semibold">ETB {o.total.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 capitalize">{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 font-semibold flex justify-between">
            <span>Active rentals</span>
            <Link to="/suppliers/rentals" className="text-sm text-emerald-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_RENTALS.filter((r) => r.status === 'active' || r.status === 'overdue').map((r) => (
              <div key={r.id} className="px-5 py-3 flex justify-between gap-2">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{r.equipment}</div>
                  <div className="text-xs text-gray-500">{r.customer}</div>
                </div>
                <div className="text-end">
                  <div className={`text-xs font-medium capitalize ${r.status === 'overdue' ? 'text-red-600' : 'text-green-600'}`}>
                    {r.status}
                  </div>
                  <div className="text-xs text-gray-500">until {r.endDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
