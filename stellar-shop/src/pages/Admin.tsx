import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { BarChart3, Package, IndianRupee, XCircle, RefreshCw, ShieldCheck, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatINR, formatDate } from '@/utils/format';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { fetchAdminOrders, fetchAdminStats, updateRemoteOrderStatus } from '@/services/supabase';
import { signOutSupabase } from '@/services/auth';
import type { Order } from '@/redux/slices/ordersSlice';

const statuses: Order['status'][] = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Returned', 'Cancelled'];

export function Admin() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ orders: 0, revenue: 0, pending: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      if (!supabase) {
        setAllowed(false);
        setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAllowed(false); return; }
      const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profileError) throw profileError;
      if (profile?.role !== 'admin') { setAllowed(false); return; }
      setAllowed(true);
      const [nextOrders, nextStats] = await Promise.all([fetchAdminOrders(), fetchAdminStats()]);
      setOrders(nextOrders);
      setStats(nextStats);
    } catch (e: any) {
      setError(e?.message || 'Could not load admin data.');
      setAllowed(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const changeStatus = async (order: Order, status: Order['status']) => {
    setBusy(order.id);
    try {
      await updateRemoteOrderStatus(order.id, status);
      setOrders((current) => current.map((o) => o.id === order.id ? { ...o, status } : o));
      setStats(await fetchAdminStats());
    } catch (e: any) {
      setError(e?.message || 'Could not update order status.');
    } finally {
      setBusy(null);
    }
  };

  const logout = async () => {
    await signOutSupabase();
    window.location.href = '/login';
  };

  if (!isSupabaseConfigured) {
    return <div className="mx-auto max-w-xl px-4 py-20 text-center"><ShieldCheck className="mx-auto h-14 w-14 text-stellar-500" /><h1 className="mt-5 text-2xl font-bold">Admin dashboard requires Supabase</h1><p className="mt-2 text-sm text-muted">{error}</p></div>;
  }

  if (loading || allowed === null) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center"><RefreshCw className="mx-auto h-8 w-8 animate-spin text-stellar-500" /><p className="mt-3 text-sm text-muted">Checking admin access…</p></div>;
  }

  if (!allowed) {
    if (error) return <div className="mx-auto max-w-xl px-4 py-20 text-center"><XCircle className="mx-auto h-14 w-14 text-error-500" /><h1 className="mt-5 text-2xl font-bold">Admin access unavailable</h1><p className="mt-2 text-sm text-muted">{error}</p><Link to="/"><Button className="mt-5">Back to shop</Button></Link></div>;
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm font-semibold text-stellar-500">Stellar Shop</p><h1 className="text-2xl font-extrabold">Admin Dashboard</h1><p className="mt-1 text-sm text-muted">Manage orders and update fulfilment status.</p></div>
        <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => void load()}><RefreshCw className="h-4 w-4" /> Refresh</Button><Button size="sm" variant="outline" onClick={() => void logout()}><LogOut className="h-4 w-4" /> Sign out</Button></div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total orders', value: stats.orders, icon: Package },
          { label: 'Revenue', value: formatINR(stats.revenue), icon: IndianRupee },
          { label: 'Pending', value: stats.pending, icon: BarChart3 },
          { label: 'Cancelled', value: stats.cancelled, icon: XCircle },
        ].map((card) => (
          <div key={card.label} className="rounded-card border border-base bg-elevated p-5">
            <div className="flex items-center justify-between"><span className="text-sm text-muted">{card.label}</span><card.icon className="h-5 w-5 text-stellar-500" /></div>
            <p className="mt-3 text-2xl font-extrabold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-card border border-base bg-elevated">
        <div className="border-b border-base p-5"><h2 className="text-lg font-bold">Order management</h2><p className="mt-1 text-sm text-muted">Status changes are stored in Supabase and immediately visible to customers.</p></div>
        {orders.length === 0 ? <p className="p-8 text-center text-sm text-muted">No orders found.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-soft text-xs uppercase text-muted"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Placed</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Update</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-base">
                    <td className="px-4 py-4"><p className="font-bold">{o.id}</p><p className="mt-1 max-w-xs truncate text-xs text-muted">{o.address}</p></td>
                    <td className="px-4 py-4">{o.items.length}</td>
                    <td className="px-4 py-4 font-semibold">{formatINR(o.total)}</td>
                    <td className="px-4 py-4 text-muted">{formatDate(o.placedAt)}</td>
                    <td className="px-4 py-4"><Badge variant={o.status === 'Delivered' ? 'success' : o.status === 'Cancelled' ? 'error' : 'stellar'}>{o.status}</Badge></td>
                    <td className="px-4 py-4">
                      <select disabled={busy === o.id} value={o.status} onChange={(e) => void changeStatus(o, e.target.value as Order['status'])} className="rounded-lg border border-base bg-elevated px-3 py-2 text-sm outline-none">
                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
