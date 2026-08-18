import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Order } from '@/redux/slices/ordersSlice';

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function fetchMyOrders(): Promise<Order[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('orders')
    .select('id,items,total,status,placed_at,estimated_delivery,address,payment_method,cancelled_at,cancellation_reason')
    .order('placed_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    id: row.id,
    items: row.items ?? [],
    total: Number(row.total),
    status: row.status,
    placedAt: row.placed_at,
    estimatedDelivery: row.estimated_delivery,
    address: row.address,
    paymentMethod: row.payment_method,
    cancelledAt: row.cancelled_at ?? undefined,
    cancellationReason: row.cancellation_reason ?? undefined,
  }));
}

export async function createRemoteOrder(order: Order) {
  if (!supabase || !isSupabaseConfigured) return;
  const user = await getCurrentUser();
  if (!user) throw new Error('Please sign in before placing an online order.');
  const { error } = await supabase.from('orders').insert({
    id: order.id,
    user_id: user.id,
    items: order.items,
    total: order.total,
    status: order.status,
    placed_at: order.placedAt,
    estimated_delivery: order.estimatedDelivery,
    address: order.address,
    payment_method: order.paymentMethod,
  });
  if (error) throw error;
}

export async function cancelRemoteOrder(id: string, reason: string) {
  if (!supabase) return;
  const { data, error } = await supabase.rpc('cancel_order', {
    p_order_id: id,
    p_reason: reason,
  });
  if (error) throw error;
  if (!data) throw new Error('This order can no longer be cancelled.');
}

export async function updateRemoteOrderStatus(id: string, status: Order['status']) {
  if (!supabase) return;
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function fetchAdminOrders(): Promise<Order[]> {
  return fetchMyOrders();
}

export async function fetchAdminStats() {
  if (!supabase) return { orders: 0, revenue: 0, pending: 0, cancelled: 0 };
  const { data, error } = await supabase
    .from('orders')
    .select('total,status');
  if (error) throw error;
  const rows = data ?? [];
  return {
    orders: rows.length,
    revenue: rows.filter((r: any) => r.status !== 'Cancelled').reduce((sum, r: any) => sum + Number(r.total), 0),
    pending: rows.filter((r: any) => ['Processing', 'Shipped', 'Out for Delivery'].includes(r.status)).length,
    cancelled: rows.filter((r: any) => r.status === 'Cancelled').length,
  };
}
