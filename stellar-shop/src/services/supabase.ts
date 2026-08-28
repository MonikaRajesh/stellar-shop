import { supabase, supabaseEnabled } from '@/lib/supabase';
import type { Order } from '@/redux/slices/ordersSlice';
import type { Product } from '@/types';
import { normalizeProduct } from '@/utils/productCatalog';

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
  razorpay_payment_id?: string | null;
  razorpay_order_id?: string | null;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
}

export interface AdminUser {
  id: string; name: string; email: string; mobile?: string | null; username?: string | null;
  role: string; created_at: string; last_login_at?: string | null; last_seen_at?: string | null; address?: string | null;
}

export interface SavedAddress { id: string; user_id: string; label: string; full_address: string; phone?: string | null; is_default: boolean; created_at: string; }

export async function saveOrderToSupabase(order: Order, userId?: string | null) {
  if (!supabaseEnabled || !supabase) return { ok: false, skipped: true };
  const { error } = await supabase.from('orders').upsert({
    id: order.id, user_id: userId ?? null, items: order.items, total: order.total, status: order.status,
    placed_at: order.placedAt, estimated_delivery: order.estimatedDelivery, address: order.address,
    payment_method: order.paymentMethod, razorpay_payment_id: order.razorpayPaymentId ?? null,
    razorpay_order_id: order.razorpayOrderId ?? null, cancellation_reason: order.cancellationReason ?? null,
    cancelled_at: order.cancelledAt ?? null,
  });
  return { ok: !error, error };
}

export async function updateOrderAddressInSupabase(id: string, address: string) {
  if (!supabaseEnabled || !supabase) return { ok: false, skipped: true };
  const { error } = await supabase.from('orders').update({ address }).eq('id', id);
  return { ok: !error, error };
}

export async function updateOrderInSupabase(order: Order) {
  if (!supabaseEnabled || !supabase) return { ok: false, skipped: true };
  const { error } = await supabase.from('orders').update({ status: order.status, cancellation_reason: order.cancellationReason ?? null, cancelled_at: order.cancelledAt ?? null }).eq('id', order.id);
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
  if (!user || !supabase) return false;
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  return data?.role === 'admin';
}

export async function signInWithSupabase(email: string, password: string, captchaToken?: string) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.'), skipped: true };
  const result = await supabase.auth.signInWithPassword({ email, password, ...(captchaToken ? { options: { captchaToken } } : {}) });
  return { ...result, skipped: false };
}

export async function signInWithOAuthProvider(provider: 'google' | 'linkedin_oidc' | 'github' | 'azure') {
  if (String(import.meta.env.VITE_ENABLE_GOOGLE_OAUTH || '').toLowerCase() !== 'true') return { data: null, error: new Error('Social sign-in is not enabled for this deployment.'), skipped: true };
  if (provider !== 'google') return { data: null, error: new Error('Only Google sign-in is enabled in this deployment.'), skipped: true };
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.'), skipped: true };
  const configured = String(import.meta.env.VITE_SITE_URL || '').trim().replace(/\/$/, '');
  const redirectTo = configured && !/localhost|127\.0\.0\.1/i.test(configured) ? configured : (window.location.origin.includes('localhost') ? window.location.origin : window.location.origin);
  const result = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
  return { ...result, skipped: false };
}

export async function signUpWithSupabase(email: string, password: string, metadata: { name: string; mobile?: string; username?: string }, captchaToken?: string) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.'), skipped: true };

  const normalizedEmail = email.trim().toLowerCase();
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...metadata, email: normalizedEmail, password, captchaToken: captchaToken || undefined }),
  });

  let payload: { error?: string; detail?: string } = {};
  try { payload = await response.json(); } catch { /* handled below */ }

  if (!response.ok) {
    const code = payload.error || 'ACCOUNT_CREATE_FAILED';
    return { data: null, error: new Error(code === 'ACCOUNT_CREATE_FAILED' ? (payload.detail || code) : code), skipped: false };
  }

  // The server creates the user as email-confirmed, so this login never waits for a verification link.
  const login = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
    ...(captchaToken ? { options: { captchaToken } } : {}),
  });

  if (login.error || !login.data.session) {
    return { data: login.data, error: login.error || new Error('SIGN_IN_AFTER_SIGNUP_FAILED'), skipped: false };
  }

  return { data: login.data, error: null, skipped: false };
}
export async function fetchCurrentProfile(userId: string) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.') };
  return await supabase.from('profiles').select('id,name,email,mobile,username,role,address').eq('id', userId).maybeSingle();
}

export async function updateMyProfile(patch: { name?: string; mobile?: string; username?: string; address?: string }) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.') };
  const user = await getCurrentSupabaseUser();
  if (!user) return { data: null, error: new Error('Please sign in first.') };
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', user.id).select('id,name,email,mobile,username,role,address').single();
  return { data, error };
}

export async function touchUserActivity(userId: string, isLogin = false) {
  if (!supabaseEnabled || !supabase) return;
  await supabase.from('profiles').update({ last_seen_at: new Date().toISOString(), ...(isLogin ? { last_login_at: new Date().toISOString() } : {}) }).eq('id', userId);
}

export async function fetchAdminUsers() {
  if (!supabaseEnabled || !supabase) return { data: [] as AdminUser[], error: null };
  const { data, error } = await supabase.from('profiles').select('id,name,email,mobile,username,role,created_at,last_login_at,last_seen_at,address').order('last_seen_at', { ascending: false, nullsFirst: false });
  return { data: (data ?? []) as AdminUser[], error };
}

export async function fetchSavedAddresses() {
  if (!supabaseEnabled || !supabase) return { data: [] as SavedAddress[], error: null };
  const user = await getCurrentSupabaseUser();
  if (!user) return { data: [] as SavedAddress[], error: new Error('Please sign in first.') };
  const { data, error } = await supabase.from('saved_addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }).order('created_at', { ascending: false });
  return { data: (data ?? []) as SavedAddress[], error };
}

export async function saveAddress(address: { label: string; full_address: string; phone?: string; is_default?: boolean }, id?: string) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.') };
  const user = await getCurrentSupabaseUser();
  if (!user) return { data: null, error: new Error('Please sign in first.') };
  if (address.is_default) await supabase.from('saved_addresses').update({ is_default: false }).eq('user_id', user.id);
  const payload = { ...address, user_id: user.id, is_default: Boolean(address.is_default) };
  const result = id ? await supabase.from('saved_addresses').update(payload).eq('id', id).select('*').single() : await supabase.from('saved_addresses').insert(payload).select('*').single();
  return result;
}

export async function deleteSavedAddress(id: string) {
  if (!supabaseEnabled || !supabase) return { error: new Error('Supabase authentication is not configured.') };
  return await supabase.from('saved_addresses').delete().eq('id', id);
}

export async function fetchPublicProducts() {
  if (!supabaseEnabled || !supabase) return { data: [] as Product[], error: null };
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  const mapped = (data ?? []).map((p: any) => normalizeProduct(p));
  return { data: mapped, error };
}

export async function fetchAdminProducts() {
  if (!supabaseEnabled || !supabase) return { data: [] as Product[], error: null };
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  const mapped = (data ?? []).map((p: any) => normalizeProduct(p));
  return { data: mapped, error };
}

export async function upsertAdminProduct(product: Product) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.') };
  const clean = normalizeProduct(product);
  const { data, error } = await supabase.from('products').upsert({
    id: clean.id, name: clean.name, slug: clean.slug, brand: clean.brand, brand_id: clean.brandId,
    category: clean.category, category_id: clean.categoryId, price: clean.price, mrp: clean.mrp, rating: clean.rating,
    review_count: clean.reviewCount, stock: clean.stock, images: clean.images, colors: clean.colors, highlights: clean.highlights,
    specs: clean.specs, description: clean.description, warranty: clean.warranty, return_policy: clean.returnPolicy,
    delivery: clean.delivery, tags: clean.tags, badge: clean.badge ?? null, created_at: clean.createdAt, reviews: clean.reviews,
    frequently_bought_together: clean.frequentlyBoughtTogether ?? null,
  }).select('*').single();
  return { data: data ? normalizeProduct(data) : null, error };
}

export async function deleteAdminProduct(id: string) {
  if (!supabaseEnabled || !supabase) return { error: new Error('Supabase authentication is not configured.') };
  return await supabase.from('products').delete().eq('id', id);
}

export async function signOutSupabase() { if (!supabaseEnabled || !supabase) return; await supabase.auth.signOut(); }
