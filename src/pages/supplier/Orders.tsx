import { MOCK_ORDERS } from '@/data/mock';
import type { OrderStatus } from '@/data/mock';
import { cn } from '@/lib/utils';

const styles: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function SupplierOrders() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Orders</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Qty</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{o.id}</div>
                    <div className="text-xs text-gray-400">{o.createdAt}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{o.productName}</td>
                  <td className="px-5 py-3">
                    <div className="text-gray-700">{o.customer}</div>
                    <div className="text-xs text-gray-400">{o.deliveryAddress}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{o.quantity}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">ETB {o.total.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full capitalize', styles[o.status])}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
