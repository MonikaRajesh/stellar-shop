import { X, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import type { Order } from '@/redux/slices/ordersSlice';
import { formatDate } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { classNames } from '@/utils/format';

const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'] as const;
const stepMap: Record<Order['status'], number> = { Processing: 0, Shipped: 1, 'Out for Delivery': 2, Delivered: 3, Returned: -1, Cancelled: -1 };
const icons = [Clock, Truck, Truck, CheckCircle2];

export function OrderTrackingModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const current = stepMap[order.status];
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-xl rounded-2xl border border-base bg-elevated shadow-float">
        <div className="flex items-center justify-between border-b border-base px-5 py-4"><div><h2 className="text-lg font-bold">Track order</h2><p className="text-xs text-muted">{order.id}</p></div><button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-soft" aria-label="Close"><X className="h-5 w-5"/></button></div>
        <div className="p-5">
          {current >= 0 ? <div className="space-y-4">{steps.map((step, index) => { const Icon = icons[index]; const done = index <= current; return <div key={step} className="flex items-center gap-3"><div className={classNames('grid h-10 w-10 place-items-center rounded-full border-2', done ? 'border-stellar-500 bg-stellar-500/10 text-stellar-500' : 'border-base text-muted')}><Icon className="h-5 w-5"/></div><div><p className={classNames('text-sm font-semibold', done && 'text-stellar-600 dark:text-stellar-300')}>{step}</p>{index === 3 && <p className="text-xs text-muted">Estimated delivery: {formatDate(order.estimatedDelivery)}</p>}{index === current && <p className="text-xs text-muted">Current status</p>}</div></div>})}</div> : <div className="rounded-xl bg-soft p-4 text-sm"><p className="font-semibold">Order status: {order.status}</p><p className="mt-1 text-muted">This order is no longer in the active delivery flow.</p></div>}
          <div className="mt-5 flex justify-end"><Button type="button" variant="outline" onClick={onClose}>Close</Button></div>
        </div>
      </div>
    </div>
  );
}
