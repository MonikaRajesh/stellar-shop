import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart3, Package, Users, IndianRupee, RefreshCw, ShieldCheck, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { updateOrderStatus, type Order } from '@/redux/slices/ordersSlice';
import { addToast } from '@/redux/slices/uiSlice';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { fetchAdminOrders, isCurrentUserAdmin, updateAdminOrderStatus } from '@/services/supabase';
import { supabaseEnabled } from '@/lib/supabase';
import { formatINR, formatDate } from '@/utils/format';
import { clearAdminSession, isAdminSessionActive } from '@/pages/AdminLogin';

const statuses: Order['status'][] = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Returned', 'Cancelled'];

export function AdminDashboard() {
  const dispatch = useAppDispatch();
  const localOrders = useAppSelector((s) => s.orders);
  const [orders, setOrders] = useState<Order[]>(localOrders);
  const [allowed, setAllowed] = useState(isAdminSessionActive());
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    if (isAdminSessionActive()) {
      setAllowed(true);
      setOrders(localOrders);
    } else if (supabaseEnabled) {
      const admin = await isCurrentUserAdmin();
      setAllowed(admin);
      if (admin) {
        const result = await fetchAdminOrders();
        if (!result.error && result.data.length) {
          setOrders(result.data.map((o) => ({
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
        } else {
          setOrders(localOrders);
        }
      }
    } else { setOrders(localOrders); }
    setChecking(false);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const stats = useMemo(() => ({
    orders: orders.length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
    pending: orders.filter((o) => ['Processing', 'Shipped', 'Out for Delivery'].includes(o.status)).length,
    cancelled: orders.filter((o) => o.status === 'Cancelled').length,
  }), [orders]);

  const changeStatus = async (order: Order, status: Order['status']) => {
    dispatch(updateOrderStatus({ id: order.id, status }));
    setOrders((current) => current.map((o) => o.id === order.id ? { ...o, status } : o));
    if (supabaseEnabled && !isAdminSessionActive()) {
      const result = await updateAdminOrderStatus(order.id, status);
      if (!result.ok) dispatch(addToast({ message: 'Local status changed, but Supabase update failed.', type: 'error' }));
    }
  };

  if (checking) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted">Checking admin access…</div>;
  }

  if (!allowed) return <Navigate to="/admin-login" replace />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stellar-500"><ShieldCheck className="h-4 w-4" /> Admin</p>
          <h1 className="mt-1 text-2xl font-bold">Stellar Shop Dashboard</h1>
          <p className="mt-1 text-sm text-muted">{supabaseEnabled ? 'Live Supabase order data' : 'Demo/local order data — configure Supabase for multi-device persistence'}</p>
        </div>
        <div className="flex items-center gap-2"><Button variant="outline" onClick={() => void load()} loading={loading}><RefreshCw className="h-4 w-4" /> Refresh</Button><Button variant="outline" onClick={() => { clearAdminSession(); window.location.href = "/admin-login"; }}>Admin logout</Button></div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Package} label="Total orders" value={String(stats.orders)} />
        <Stat icon={IndianRupee} label="Order value" value={formatINR(stats.revenue)} />
        <Stat icon={Truck} label="Active orders" value={String(stats.pending)} />
        <Stat icon={XCircle} label="Cancelled" value={String(stats.cancelled)} />
      </div>

      <section className="mt-6 overflow-hidden rounded-card border border-base bg-elevated">
        <div className="border-b border-base p-4">
          <h2 className="flex items-center gap-2 font-bold"><BarChart3 className="h-5 w-5 text-stellar-500" /> Order management</h2>
        </div>
        <div className="divide-y divide-base">
          {orders.map((order) => (
            <div key={order.id} className="p-4">
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex min-w-0 flex-1 gap-3">
                  <img src={order.items[0]?.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{order.id}</p>
                      <Badge variant={order.status === 'Delivered' ? 'success' : ['Cancelled', 'Returned'].includes(order.status) ? 'error' : 'stellar'}>{order.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">{order.items.length} item(s) · {formatINR(order.total)} · {formatDate(order.placedAt)}</p>
                    <p className="mt-1 text-xs text-muted">{order.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => void changeStatus(order, e.target.value as Order['status'])}
                    className="h-9 rounded-lg border border-base bg-base px-2 text-sm outline-none"
                    aria-label={`Status for ${order.id}`}
                  >
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </div>
              </div>
              {order.cancellationReason && <p className="mt-3 rounded-lg bg-error-500/10 p-2 text-xs text-error-500">Cancellation reason: {order.cancellationReason}</p>}
            </div>
          ))}
          {orders.length === 0 && <div className="p-10 text-center text-sm text-muted">No orders found.</div>}
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-card border border-base bg-elevated p-5">
          <h2 className="font-bold">Backend status</h2>
          <div className="mt-3 flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success-500" /> {supabaseEnabled ? 'Supabase configured' : 'Supabase not configured'}</div>
          <p className="mt-2 text-xs text-muted">Set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY and VITE_ADMIN_EMAILS in Vercel environment variables.</p>
        </div>
        <div className="rounded-card border border-base bg-elevated p-5">
          <h2 className="flex items-center gap-2 font-bold"><Users className="h-5 w-5 text-stellar-500" /> Admin access</h2>
          <p className="mt-2 text-sm text-muted">For production, use the supplied Supabase SQL and set the profile role to <strong>admin</strong>. Do not put a Supabase service-role key in Vite.</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="rounded-card border border-base bg-elevated p-4">
      <div className="flex items-center justify-between"><span className="text-sm text-muted">{label}</span><Icon className="h-5 w-5 text-stellar-500" /></div>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
    </div>
  );
}
