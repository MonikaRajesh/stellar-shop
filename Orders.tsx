import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronDown, RotateCcw, Eye, XCircle, Pencil } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { formatINR, formatDate } from '@/utils/format';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cancelOrder, updateOrderStatus, updateOrderAddress } from '@/redux/slices/ordersSlice';
import { fetchMyOrders, updateOrderInSupabase, updateOrderAddressInSupabase } from '@/services/supabase';
import { supabaseEnabled } from '@/lib/supabase';
import { getWhatsAppOrderUrl } from '@/utils/whatsapp';
import { classNames } from '@/utils/format';
import { addToast } from '@/redux/slices/uiSlice';
import { OrderDetailsModal } from '@/pages/OrderDetailsModal';
import { OrderTrackingModal } from '@/pages/OrderTrackingModal';
import { EditAddressModal } from '@/pages/EditAddressModal';
import type { Order } from '@/redux/slices/ordersSlice';

const statusMeta: Record<Order['status'], { icon: typeof Package; color: string; step: number }> = {
  Processing: { icon: Clock, color: 'text-warning-500', step: 1 },
  Shipped: { icon: Truck, color: 'text-stellar-500', step: 2 },
  'Out for Delivery': { icon: Truck, color: 'text-accent-500', step: 3 },
  Delivered: { icon: CheckCircle2, color: 'text-success-500', step: 4 },
  Returned: { icon: RotateCcw, color: 'text-error-500', step: 0 },
  Cancelled: { icon: XCircle, color: 'text-error-500', step: 0 },
};

export function Orders() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((s) => s.orders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [editingAddressOrder, setEditingAddressOrder] = useState<Order | null>(null);
  const [remoteOrders, setRemoteOrders] = useState<Order[] | null>(null);
  useEffect(() => {
    if (!supabaseEnabled) return;
    void fetchMyOrders().then((result) => {
      if (!result.error && !result.skipped) {
        setRemoteOrders(result.data.map((o) => ({
          id: o.id,
          items: o.items,
          total: o.total,
          status: o.status,
          placedAt: o.placed_at,
          estimatedDelivery: o.estimated_delivery,
          address: o.address,
          paymentMethod: o.payment_method,
          cancellationReason: o.cancellation_reason || undefined,
          cancelledAt: o.cancelled_at || undefined,
        })));
      }
    });
  }, []);

  const [filter, setFilter] = useState<'all' | Order['status']>('all');

  const visibleOrders = remoteOrders ?? orders;
  const filtered = filter === 'all' ? visibleOrders : visibleOrders.filter((o) => o.status === filter);

  if (visibleOrders.length === 0) {
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
                  <img src={o.items[0].image} onError={fallbackProductImage} alt="" className="h-16 w-16 rounded-lg object-cover" />
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
                  {!['Returned', 'Cancelled'].includes(o.status) && (
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
                        <img src={it.image} onError={fallbackProductImage} alt={it.name} className="h-14 w-14 rounded-lg object-cover" />
                        <div className="flex-1">
                          <Link to={`/product/${it.productId}`} className="text-sm font-semibold hover:text-stellar-600">{it.name}</Link>
                          <p className="text-xs text-muted">Qty {it.quantity} · {formatINR(it.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg bg-soft p-3 text-sm">
                      <div className="flex items-center justify-between gap-2"><p className="flex items-center gap-1.5 font-semibold"><MapPin className="h-4 w-4 text-muted" /> Address</p><button type="button" onClick={(e) => { e.stopPropagation(); setEditingAddressOrder(o); }} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-stellar-600 hover:bg-stellar-500/10 dark:text-stellar-300"><Pencil className="h-3.5 w-3.5" /> Edit</button></div>
                      <p className="mt-1 text-muted">{o.address}</p>
                    </div>
                    <div className="rounded-lg bg-soft p-3 text-sm">
                      <p className="font-semibold">Payment</p>
                      <p className="mt-1 text-muted">{o.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setDetailsOrder(o); }}><Eye className="h-4 w-4" /> View details</Button>
                    <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setTrackingOrder(o); }}><Truck className="h-4 w-4" /> Track order</Button>
                    {['Processing', 'Shipped'].includes(o.status) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const reason = window.prompt('Reason for cancellation (optional):') || 'Cancelled by customer';
                          if (!window.confirm(`Cancel order ${o.id}?`)) return;
                          const next = { ...o, status: 'Cancelled' as const, cancellationReason: reason, cancelledAt: new Date().toISOString() };
                          dispatch(cancelOrder({ id: o.id, reason }));
                          const result = await updateOrderInSupabase(next);
                          if (result.error) { dispatch(addToast({ message: result.error.message || 'Unable to cancel the order online.', type: 'error' })); return; }
                          setRemoteOrders((current) => current ? current.map((x) => x.id === o.id ? next : x) : current);
                          dispatch(addToast({ message: `Order ${o.id} cancelled.`, type: 'success' }));
                        }}
                      >
                        <XCircle className="h-4 w-4" /> Cancel order
                      </Button>
                    )}
                    {['Returned', 'Cancelled'].includes(o.status) && (
                      <p className="w-full text-xs text-error-500">Cancellation status: {o.cancellationReason || 'Customer requested cancellation'}</p>
                    )}
                    {o.status === 'Delivered' && <Button size="sm" variant="outline" onClick={async (e) => {
                      e.stopPropagation();
                      const reason = window.prompt('Reason for return/refund (optional):') || 'Customer requested return/refund';
                      if (!window.confirm(`Request return/refund for order ${o.id}?`)) return;
                      const next = { ...o, status: 'Returned' as const, cancellationReason: reason, cancelledAt: new Date().toISOString() };
                      dispatch(updateOrderStatus({ id: o.id, status: 'Returned' }));
                      const result = await updateOrderInSupabase(next);
                      if (result.error) { dispatch(addToast({ message: result.error.message || 'Unable to submit the return request online.', type: 'error' })); return; }
                      setRemoteOrders((current) => current ? current.map((x) => x.id === o.id ? next : x) : current);
                      dispatch(addToast({ message: `Return/refund request submitted for ${o.id}.`, type: 'success' }));
                    }}><RotateCcw className="h-4 w-4" /> Return / Refund</Button>}
                    <a
                      href={getWhatsAppOrderUrl(o.items.map((item) => ({ product: { id: item.productId, name: item.name, price: item.price } as any, quantity: item.quantity })))}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-green-500/40 bg-green-500/10 px-3 text-xs font-semibold text-green-600 dark:text-green-400"
                    >
                      WhatsApp support
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {detailsOrder && <OrderDetailsModal order={detailsOrder} onClose={() => setDetailsOrder(null)} />}
      {trackingOrder && <OrderTrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />}
      {editingAddressOrder && <EditAddressModal order={editingAddressOrder} onClose={() => setEditingAddressOrder(null)} onSave={async (address) => {
        const result = await updateOrderAddressInSupabase(editingAddressOrder.id, address);
        if (result.error) throw result.error;
        dispatch(updateOrderAddress({ id: editingAddressOrder.id, address }));
        setRemoteOrders((current) => current ? current.map((x) => x.id === editingAddressOrder.id ? { ...x, address } : x) : current);
        dispatch(addToast({ message: 'Delivery address updated successfully.', type: 'success' }));
      }} />}
    </div>
  );
}


function fallbackProductImage(e: React.SyntheticEvent<HTMLImageElement>) { e.currentTarget.onerror = null; e.currentTarget.src = "/branding/product-placeholder.svg"; }
