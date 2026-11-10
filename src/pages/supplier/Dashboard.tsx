import { Link } from 'react-router-dom';
import { Package, Truck, Warehouse, ShoppingCart, AlertTriangle } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_RENTALS } from '@/data/mock';
import { MetricCard } from '@/components/ui/MetricCard';
export function SupplierDashboard() {
 const lowStock=MOCK_PRODUCTS.filter(p=>p.stock<20).length;
 const pending=MOCK_ORDERS.filter(o=>o.status==='pending'||o.status==='confirmed').length;
 const rentals=MOCK_RENTALS.filter(r=>r.status==='active'||r.status==='overdue').length;
 return <div className="space-y-6">
  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-xl font-bold text-gray-900">Supplier Marketplace</h2><p className="text-sm text-gray-500">Materials, equipment & rentals</p></div><div className="flex flex-wrap gap-2"><Link to="/suppliers/orders" className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50">Orders</Link><Link to="/suppliers/rentals" className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50">Rentals</Link><Link to="/suppliers/catalog" className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">Catalog</Link></div></div>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
   <MetricCard to="/suppliers/catalog" label="Products" value={MOCK_PRODUCTS.length} icon={Package} tone="text-emerald-600" detail="Browse catalog"/>
   <MetricCard to="/suppliers/orders" label="Open orders" value={pending} icon={ShoppingCart} tone="text-blue-600" detail="Review orders"/>
   <MetricCard to="/suppliers/rentals" label="Active rentals" value={rentals} icon={Truck} tone="text-indigo-600" detail="Manage rentals"/>
   <MetricCard to="/suppliers/catalog?stock=low" label="Low stock" value={lowStock} icon={lowStock?AlertTriangle:Warehouse} tone="text-amber-600" detail="Review stock levels"/>
  </div>
  <div className="grid gap-4 lg:grid-cols-2">
   <section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="flex justify-between border-b border-gray-100 px-5 py-3 font-semibold"><span>Recent orders</span><Link to="/suppliers/orders" className="text-sm text-emerald-600 hover:underline">View all</Link></div><div className="divide-y divide-gray-100">{MOCK_ORDERS.slice(0,4).map(o=><Link key={o.id} to="/suppliers/orders" className="flex justify-between gap-2 px-5 py-3 hover:bg-gray-50"><div><div className="text-sm font-medium text-gray-900">{o.productName}</div><div className="text-xs text-gray-500">{o.customer} · {o.id}</div></div><div className="text-end"><div className="text-sm font-semibold">{'$'+o.total.toLocaleString()}</div><div className="text-xs capitalize text-gray-500">{o.status}</div></div></Link>)}</div></section>
   <section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="flex justify-between border-b border-gray-100 px-5 py-3 font-semibold"><span>Active rentals</span><Link to="/suppliers/rentals" className="text-sm text-emerald-600 hover:underline">View all</Link></div><div className="divide-y divide-gray-100">{MOCK_RENTALS.filter(r=>r.status==='active'||r.status==='overdue').map(r=><Link key={r.id} to="/suppliers/rentals" className="flex justify-between gap-2 px-5 py-3 hover:bg-gray-50"><div><div className="text-sm font-medium text-gray-900">{r.equipment}</div><div className="text-xs text-gray-500">{r.customer}</div></div><div className="text-end"><div className={'text-xs font-medium capitalize '+(r.status==='overdue'?'text-red-600':'text-green-600')}>{r.status}</div><div className="text-xs text-gray-500">until {r.endDate}</div></div></Link>)}</div></section>
  </div>
 </div>;
}