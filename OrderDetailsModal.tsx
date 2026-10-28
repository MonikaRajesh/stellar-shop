import { X, MapPin, CreditCard, Package, CalendarDays } from 'lucide-react';
import type { Order } from '@/redux/slices/ordersSlice';
import { formatINR, formatDate } from '@/utils/format';
import { Button } from '@/components/ui/Button';

export function OrderDetailsModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-base bg-elevated shadow-float">
        <div className="sticky top-0 flex items-center justify-between border-b border-base bg-elevated px-5 py-4">
          <div><h2 className="text-lg font-bold">Order details</h2><p className="text-xs text-muted">{order.id}</p></div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-soft" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-5 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-soft p-3"><p className="flex items-center gap-2 text-sm font-semibold"><Package className="h-4 w-4"/>Status</p><p className="mt-1 text-sm text-muted">{order.status}</p></div>
            <div className="rounded-xl bg-soft p-3"><p className="flex items-center gap-2 text-sm font-semibold"><CalendarDays className="h-4 w-4"/>Placed</p><p className="mt-1 text-sm text-muted">{formatDate(order.placedAt)}</p></div>
            <div className="rounded-xl bg-soft p-3"><p className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4"/>Delivery address</p><p className="mt-1 text-sm text-muted">{order.address}</p></div>
            <div className="rounded-xl bg-soft p-3"><p className="flex items-center gap-2 text-sm font-semibold"><CreditCard className="h-4 w-4"/>Payment</p><p className="mt-1 text-sm text-muted">{order.paymentMethod}</p></div>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => <div key={item.productId} className="flex items-center gap-3 rounded-xl border border-base p-3"><img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.name}</p><p className="text-xs text-muted">Qty {item.quantity} × {formatINR(item.price)}</p></div><p className="text-sm font-bold">{formatINR(item.price * item.quantity)}</p></div>)}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-base pt-4"><span className="font-semibold">Order total</span><span className="text-lg font-bold">{formatINR(order.total)}</span></div>
          <div className="flex justify-end"><Button type="button" variant="outline" onClick={onClose}>Close</Button></div>
        </div>
      </div>
    </div>
  );
}
