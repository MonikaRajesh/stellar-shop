import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronDown, RotateCcw, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { formatINR, formatDate } from '@/utils/format';
import { cancelOrder, hydrateOrders } from '@/redux/slices/ordersSlice';
import { addToast } from '@/redux/slices/uiSlice';
import { orderOnWhatsApp } from '@/utils/whatsapp';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { classNames } from '@/utils/format';
import type { Order } from '@/redux/slices/ordersSlice';
import { isSupabaseConfigured } from '@/lib/supabase';
import { cancelRemoteOrder, fetchMyOrders } from '@/services/supabase';

const statusMeta: Record<Order['status'], { icon: typeof Package; color: string; step: number }> = {
  Processing: { icon: Clock, color: 'text-warning-500', step: 1 },
  Shipped: { icon: Truck, color: 'text-stellar-500', step: 2 },
  'Out for Delivery': { icon: Truck, color: 'text-accent-500', step: 3 },
  Delivered: { icon: CheckCircle2, color: 'text-success-500', step: 4 },
  Returned: { icon: RotateCcw, color: 'text-error-500', step: 0 },
  Cancelled: { icon: RotateCcw, color: 'text-error-500', step: 0 },
};

export function Orders() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((s) => s.orders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | Order['status']>('all');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchMyOrders()
      .then((remoteOrders) => dispatch(hydrateOrders(remoteOrders)))
      .catch((error) => dispatch(addToast({ message: error?.message || 'Could not load cloud orders.', type: 'error' })));
  }, [dispatch]);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Package className="mx-auto h-16 w-16 text-muted" />
        <h1 className="mt-4 text-2xl font-bold">No orders yet</h1>
        <p className="mt-2 text-muted">When you place an order it will appear here.</p>
        <Link to="/"><Button className="mt-5">Start shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {/* Filter tabs */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(['all', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Returned', 'Cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={classNames(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition',
              filter === f ? 'gradient-stellar text-white' : 'border border-base hover:bg-soft',
            )}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map((o) => {
          const meta = statusMeta[o.status];
          const isOpen = expanded === o.id;
          return (
            <div key={o.id} className="overflow-hidden rounded-card border border-base bg-elevated">
              <button onClick={() => setExpanded(isOpen ? null : o.id)} className="flex w-full items-center gap-4 p-4 text-left">
                <div className="hidden sm:block">
                  <img src={o.items[0].image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold">{o.id}</p>
                    <Badge variant={o.status === 'Delivered' ? 'success' : ['Returned', 'Cancelled'].includes(o.status) ? 'error' : 'stellar'}>{o.status}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted">{o.items.length} item(s) · {formatINR(o.total)}</p>
                  <p className="text-xs text-muted">Placed {formatDate(o.placedAt)}</p>
                </div>
                <div className="hidden text-right md:block">
                  <p className="text-xs text-muted">Est. delivery</p>
                  <p className="text-sm font-semibold">{formatDate(o.estimatedDelivery)}</p>
                </div>
                <ChevronDown className={classNames('h-5 w-5 text-muted transition-transform', isOpen && 'rotate-180')} />
              </button>

              {isOpen && (
                <div className="border-t border-base p-4">
                  {/* Tracker */}
                  {o.status !== 'Returned' && o.status !== 'Cancelled' && (
                    <div className="mb-4 flex items-center">
                      {['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((s, i) => {
                        const StatusIcon = statusMeta[s as Order['status']].icon;
                        const done = meta.step >= i + 1;
                        return (
                          <div key={s} className="flex flex-1 items-center last:flex-none">
                            <div className={classNames('grid h-9 w-9 place-items-center rounded-full border-2', done ? 'border-stellar-500 bg-stellar-500/10 text-stellar-500' : 'border-base text-muted')}>
                              <StatusIcon className="h-4 w-4" />
                            </div>
                            {i < 3 && <div className={classNames('h-0.5 flex-1', done && meta.step > i + 1 ? 'bg-stellar-500' : 'bg-base')} />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="space-y-3">
                    {o.items.map((it) => (
                      <div key={it.productId} className="flex items-center gap-3">
                        <img src={it.image} alt={it.name} className="h-14 w-14 rounded-lg object-cover" />
                        <div className="flex-1">
                          <Link to={`/product/${it.productId}`} className="text-sm font-semibold hover:text-stellar-600">{it.name}</Link>
                          <p className="text-xs text-muted">Qty {it.quantity} · {formatINR(it.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg bg-soft p-3 text-sm">
                      <p className="flex items-center gap-1.5 font-semibold"><MapPin className="h-4 w-4 text-muted" /> Address</p>
                      <p className="mt-1 text-muted">{o.address}</p>
                    </div>
                    <div className="rounded-lg bg-soft p-3 text-sm">
                      <p className="font-semibold">Payment</p>
                      <p className="mt-1 text-muted">{o.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline"><Eye className="h-4 w-4" /> View details</Button>
                    {['Processing', 'Shipped', 'Out for Delivery'].includes(o.status) && (
                      <Button size="sm" variant="outline"><Truck className="h-4 w-4" /> Track order</Button>
                    )}
                    {o.status === 'Processing' && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          const reason = window.prompt('Reason for cancellation (optional):') || 'Customer requested cancellation';
                          if (window.confirm(`Cancel order ${o.id}?`)) {
                            void (async () => {
                              try {
                                if (isSupabaseConfigured) await cancelRemoteOrder(o.id, reason);
                                dispatch(cancelOrder({ id: o.id, reason }));
                                dispatch(addToast({ message: `Order ${o.id} cancelled`, type: 'success' }));
                              } catch (error: any) {
                                dispatch(addToast({ message: error?.message || 'Cancellation failed.', type: 'error' }));
                              }
                            })();
                          }
                        }}
                      >
                        <RotateCcw className="h-4 w-4" /> Cancel order
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => orderOnWhatsApp(o)}>
                      <span className="font-bold">WA</span> WhatsApp
                    </Button>
                    {o.status === 'Delivered' && <Button size="sm" variant="outline"><RotateCcw className="h-4 w-4" /> Return / Refund</Button>}
                  </div>
                  {(o.status === 'Cancelled' || o.status === 'Returned') && o.cancellationReason && (
                    <p className="mt-3 rounded-lg bg-error-500/10 p-3 text-sm text-error-500">
                      Cancellation reason: {o.cancellationReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
