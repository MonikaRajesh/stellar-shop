import { supabase, supabaseEnabled } from '@/lib/supabase';
import type { Order } from '@/redux/slices/ordersSlice';

export interface DbOrder {
  id: string;
  user_id: string | null;
  items: Order['items'];
  total: number;
  status: Order['status'];
  placed_at: string;
  estimated_delivery: string;
  address: string;
  payment_method: string;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
}

export async function saveOrderToSupabase(order: Order, userId?: string | null) {
  if (!supabaseEnabled || !supabase) return { ok: false, skipped: true };
  const { error } = await supabase.from('orders').upsert({
    id: order.id,
    user_id: userId ?? null,
    items: order.items,
    total: order.total,
    status: order.status,
    placed_at: order.placedAt,
    estimated_delivery: order.estimatedDelivery,
    address: order.address,
    payment_method: order.paymentMethod,
    cancellation_reason: order.cancellationReason ?? null,
    cancelled_at: order.cancelledAt ?? null,
  });
  return { ok: !error, error };
}

export async function updateOrderInSupabase(order: Order) {
  if (!supabaseEnabled || !supabase) return { ok: false, skipped: true };
  const { error } = await supabase.from('orders').update({
    status: order.status,
    cancellation_reason: order.cancellationReason ?? null,
    cancelled_at: order.cancelledAt ?? null,
  }).eq('id', order.id);
  return { ok: !error, error };
}


export async function fetchMyOrders() {
  if (!supabaseEnabled || !supabase) return { data: [] as DbOrder[], error: null, skipped: true };
  const user = await getCurrentSupabaseUser();
  if (!user) return { data: [] as DbOrder[], error: null, skipped: false };
  const { data, error } = await supabase.from('orders').select('*').eq('user_id', user.id).order('placed_at', { ascending: false });
  return { data: (data ?? []) as DbOrder[], error, skipped: false };
}

export async function fetchAdminOrders() {
  if (!supabaseEnabled || !supabase) return { data: [] as DbOrder[], error: null, skipped: true };
  const { data, error } = await supabase.from('orders').select('*').order('placed_at', { ascending: false });
  return { data: (data ?? []) as DbOrder[], error, skipped: false };
}

export async function updateAdminOrderStatus(id: string, status: Order['status']) {
  if (!supabaseEnabled || !supabase) return { ok: false, skipped: true };
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  return { ok: !error, error };
}

export async function getCurrentSupabaseUser() {
  if (!supabaseEnabled || !supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function isCurrentUserAdmin() {
  const user = await getCurrentSupabaseUser();
  if (!user) return false;
  if (!supabase) return false;
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (data?.role === 'admin') return true;
  const allowList = String(import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((x: string) => x.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(user.email && allowList.includes(user.email.toLowerCase()));
}

export async function signInWithSupabase(email: string, password: string, captchaToken?: string) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.'), skipped: true };
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
    ...(captchaToken ? { options: { captchaToken } } : {}),
  });
  return { ...result, skipped: false };
}

const PRODUCTION_SITE_URL = 'https://stellar-shop-five.vercel.app';

function getAuthRedirectUrl() {
  const configured = String(import.meta.env.VITE_SITE_URL || '').trim().replace(/\/$/, '');
  if (configured && !/localhost|127\.0\.0\.1/i.test(configured)) return `${configured}/verify-email`;
  return `${PRODUCTION_SITE_URL}/verify-email`;
}

export async function signUpWithSupabase(
  email: string,
  password: string,
  metadata: { name: string; mobile?: string; username?: string },
  captchaToken?: string
) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.'), skipped: true };
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      ...(captchaToken ? { captchaToken } : {}),
    },
  });
  return { ...result, skipped: false };
}

export async function verifySignupOtp(email: string, token: string) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.'), skipped: true };
  const result = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  return { ...result, skipped: false };
}

export async function resendSignupOtp(email: string) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.'), skipped: true };
  const result = await supabase.auth.resend({ type: 'signup', email });
  return { ...result, skipped: false };
}

export async function fetchCurrentProfile(userId: string) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.') };
  return await supabase.from('profiles').select('id,name,email,mobile,username,role').eq('id', userId).maybeSingle();
}

export async function signOutSupabase() {
  if (!supabaseEnabled || !supabase) return;
  await supabase.auth.signOut();
}
