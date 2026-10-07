import { supabase, supabaseEnabled } from '@/lib/supabase';
import type { Order } from '@/redux/slices/ordersSlice';
import type { Product } from '@/types';

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

const CONFIGURED_ADMIN_USERNAME = 'chinmayms12';
const CONFIGURED_ADMIN_EMAIL = 'punichinmayms12@gmail.com';

export async function bootstrapConfiguredAdmin() {
  if (!supabaseEnabled || !supabase) return { ok: false, error: new Error('Supabase authentication is not configured.') };
  const user = await getCurrentSupabaseUser();
  if (!user) return { ok: false, error: new Error('No authenticated administrator session exists.') };
  const configuredEmail = String(import.meta.env.VITE_ADMIN_EMAIL || CONFIGURED_ADMIN_EMAIL).trim().toLowerCase();
  if (String(user.email || '').trim().toLowerCase() !== configuredEmail) {
    return { ok: false, error: new Error('The authenticated account is not the configured administrator account.') };
  }
  // Intentionally do nothing here. The login path must not depend on a
  // profiles table, RPC, trigger, or any other optional database object.
  // Supabase Auth has already verified the password; the configured admin
  // email is the authorization boundary for this single-admin deployment.
  return { ok: true, error: null };
}

export async function isCurrentUserAdmin() {
  const user = await getCurrentSupabaseUser();
  if (!user || !supabase) return false;
  const configuredEmail = String(import.meta.env.VITE_ADMIN_EMAIL || CONFIGURED_ADMIN_EMAIL).trim().toLowerCase();
  // Do not query public.profiles here. A fresh Supabase project may not have
  // that optional table yet, and admin login must still work.
  return String(user.email || '').trim().toLowerCase() === configuredEmail;
}

export async function resolveAdminIdentifier(identifier: string) {
  if (!supabaseEnabled || !supabase) return { email: null as string | null, error: new Error('Supabase authentication is not configured.') };
  const value = identifier.trim().toLowerCase();
  if (value.includes('@')) return { email: value, error: null };

  // The configured administrator can log in by username without depending on
  // the optional RPC. This is important for existing Supabase projects where
  // the frontend has been deployed before the SQL migration was run.
  const fallbackUsername = String(import.meta.env.VITE_ADMIN_USERNAME || CONFIGURED_ADMIN_USERNAME).trim().toLowerCase();
  const fallbackEmail = String(import.meta.env.VITE_ADMIN_EMAIL || CONFIGURED_ADMIN_EMAIL).trim().toLowerCase();
  if (value === fallbackUsername) return { email: fallbackEmail, error: null };

  // Never use the database username lookup before authentication. A missing
  // RPC must not be able to break the login form.
  const knownAdminUsername = fallbackUsername;
  const knownAdminEmail = fallbackEmail;
  if (value === knownAdminUsername) {
    return { email: knownAdminEmail, error: null };
  }

  return {
    email: null,
    error: new Error('Unknown administrator User ID. Use the configured administrator User ID or email address.'),
  };
}

export async function signInWithSupabase(email: string, password: string, captchaToken?: string) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.'), skipped: true };
  try {
    const result = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password, ...(captchaToken ? { options: { captchaToken } } : {}) });
    return { ...result, skipped: false };
  } catch (error) {
    return { data: { user: null, session: null }, error: normalizeAuthError(error), skipped: false };
  }
}

export async function signInWithOAuthProvider(provider: 'google' | 'linkedin_oidc' | 'github' | 'azure') {
  if (String(import.meta.env.VITE_ENABLE_GOOGLE_OAUTH || '').toLowerCase() !== 'true') return { data: null, error: new Error('Social sign-in is not enabled for this deployment.'), skipped: true };
  if (provider !== 'google') return { data: null, error: new Error('Only Google sign-in is enabled in this deployment.'), skipped: true };
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.'), skipped: true };
  try {
    const configured = String(import.meta.env.VITE_SITE_URL || '').trim().replace(/\/$/, '');
    const redirectTo = configured || window.location.origin;
    const result = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    return { ...result, skipped: false };
  } catch (error) {
    return { data: null, error: normalizeAuthError(error), skipped: false };
  }
}

function normalizeAuthError(error: unknown): Error {
  const candidate = error as any;
  const raw = error instanceof Error
    ? error.message
    : String(candidate?.message || candidate?.error_description || candidate?.details || candidate?.hint || candidate?.code || error || '');
  const lower = raw.toLowerCase();
  if (lower.includes('unexpected end of json') || lower.includes("failed to execute 'json'")) {
    return new Error('Supabase returned an empty or invalid response. Check the Supabase project URL/key and try again.');
  }
  if (lower.includes('failed to fetch') || lower.includes('networkerror') || lower.includes('load failed')) {
    return new Error('Cannot reach the authentication server. Please check the deployment and try again.');
  }
  return new Error(raw || 'Authentication request failed.');
}

export async function signUpWithSupabase(email: string, password: string, metadata: { name: string; mobile?: string; username?: string }, captchaToken?: string) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.'), skipped: true };
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const result = await supabase.auth.signUp({ email: normalizedEmail, password, options: { data: metadata, ...(captchaToken ? { captchaToken } : {}) } });
    const duplicate = !result.error && !!result.data.user && Array.isArray(result.data.user.identities) && result.data.user.identities.length === 0;
    const errorText = String(result.error?.message || '').toLowerCase();
    const explicitDuplicate = /already registered|already exists|user already|email.*registered|duplicate/.test(errorText);
    if (duplicate || explicitDuplicate) return { ...result, error: new Error('ACCOUNT_EXISTS'), skipped: false };
    if (result.error) return { ...result, error: normalizeAuthError(result.error), skipped: false };
    if (!result.data.session && result.data.user) {
      const login = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      if (!login.error && login.data.session) return { data: login.data, error: null, skipped: false };
      if (String(login.error?.message || '').toLowerCase().includes('confirm')) return { ...result, error: new Error('EMAIL_CONFIRMATION_REQUIRED'), skipped: false };
    }
    return { ...result, skipped: false };
  } catch (error) {
    return { data: null, error: normalizeAuthError(error), skipped: false };
  }
}

function isMissingTable(error: unknown, table: string) {
  const message = String((error as { message?: string } | null)?.message || error || '');
  const escaped = table.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`relation .*${escaped}.*does not exist|could not find the table .*${escaped}.*schema cache|schema cache.*${escaped}`, 'i').test(message);
}

export async function fetchCurrentProfile(userId: string) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.') };
  try {
    const result = await supabase.from('profiles').select('id,name,email,mobile,username,role,address').eq('id', userId).maybeSingle();
    if (!result.error) return result;
    // A fresh Supabase project may not have the optional profiles table yet.
    // Auth metadata remains a durable fallback so the UI does not break.
    if (isMissingTable(result.error, 'profiles')) {
      const authUser = await getCurrentSupabaseUser();
      if (authUser?.id === userId) {
        return {
          data: {
            id: userId,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Stellar User',
            email: authUser.email || '',
            mobile: authUser.user_metadata?.mobile || '',
            username: authUser.user_metadata?.username || '',
            role: 'customer',
            address: authUser.user_metadata?.address || '',
          },
          error: null,
        };
      }
      return { data: null, error: null };
    }
    return result;
  } catch {
    return { data: null, error: null };
  }
}

export async function updateMyProfile(patch: { name?: string; mobile?: string; username?: string; address?: string }) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.') };
  const user = await getCurrentSupabaseUser();
  if (!user) return { data: null, error: new Error('Please sign in first.') };

  try {
    const result = await supabase.from('profiles').update(patch).eq('id', user.id).select('id,name,email,mobile,username,role,address').single();
    if (!result.error) return result;
    if (!isMissingTable(result.error, 'profiles')) return result;
  } catch (error) {
    if (!isMissingTable(error, 'profiles')) return { data: null, error: error as Error };
  }

  // No profiles table: persist editable profile fields in Supabase Auth metadata.
  // This keeps the account fully usable on a project before the optional SQL
  // migration has been run.
  try {
    const metadata = { ...(user.user_metadata || {}), ...patch };
    const { data, error } = await supabase.auth.updateUser({ data: metadata });
    if (error) return { data: null, error };
    return {
      data: {
        id: user.id,
        name: data.user?.user_metadata?.name || user.email?.split('@')[0] || 'Stellar User',
        email: data.user?.email || user.email || '',
        mobile: data.user?.user_metadata?.mobile || '',
        username: data.user?.user_metadata?.username || '',
        role: 'customer',
        address: data.user?.user_metadata?.address || '',
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function touchUserActivity(userId: string, isLogin = false) {
  if (!supabaseEnabled || !supabase) return;
  try {
    const result = await supabase.from('profiles').update({ last_seen_at: new Date().toISOString(), ...(isLogin ? { last_login_at: new Date().toISOString() } : {}) }).eq('id', userId);
    if (result.error && !isMissingTable(result.error, 'profiles')) return;
  } catch { /* optional profile table */ }
}

export async function fetchAdminUsers() {
  if (!supabaseEnabled || !supabase) return { data: [] as AdminUser[], error: null };
  const { data, error } = await supabase.from('profiles').select('id,name,email,mobile,username,role,created_at,last_login_at,last_seen_at,address').order('last_seen_at', { ascending: false, nullsFirst: false });
  return { data: (data ?? []) as AdminUser[], error };
}

const SAVED_ADDRESS_FALLBACK_PREFIX = '__STELLAR_SAVED_ADDRESSES__:';
const savedAddressStorageKey = (userId: string) => `${SAVED_ADDRESS_FALLBACK_PREFIX}${userId}`;

function isMissingSavedAddressesTable(error: unknown) {
  return isMissingTable(error, 'saved_addresses');
}

function parseFallbackAddresses(raw: string | null | undefined, userId: string, mobile?: string | null): SavedAddress[] {
  if (!raw) return [];
  if (raw.startsWith(SAVED_ADDRESS_FALLBACK_PREFIX)) {
    try {
      const parsed = JSON.parse(raw.slice(SAVED_ADDRESS_FALLBACK_PREFIX.length));
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(Boolean).map((a: any) => ({
        id: String(a.id), user_id: userId, label: String(a.label || 'Home'),
        full_address: String(a.full_address || ''), phone: a.phone ?? mobile ?? null,
        is_default: Boolean(a.is_default), created_at: String(a.created_at || new Date().toISOString()),
      }));
    } catch { return []; }
  }
  return [{ id: 'profile-address', user_id: userId, label: 'Default', full_address: raw, phone: mobile ?? null, is_default: true, created_at: new Date().toISOString() }];
}

function readLocalSavedAddresses(user: { id: string; user_metadata?: Record<string, any> | null }) {
  try {
    return parseFallbackAddresses(localStorage.getItem(savedAddressStorageKey(user.id)), user.id, user.user_metadata?.mobile);
  } catch { return []; }
}

function writeLocalSavedAddresses(userId: string, items: SavedAddress[]) {
  try {
    localStorage.setItem(savedAddressStorageKey(userId), SAVED_ADDRESS_FALLBACK_PREFIX + JSON.stringify(items));
    return null;
  } catch (error) { return error as Error; }
}

async function fetchProfileAddressFallback(user: { id: string; user_metadata?: Record<string, any> | null }) {
  try {
    const { data, error } = await supabase!.from('profiles').select('address,mobile').eq('id', user.id).maybeSingle();
    if (!error) {
      const profileItems = parseFallbackAddresses(data?.address, user.id, data?.mobile ?? user.user_metadata?.mobile);
      return { data: profileItems.length ? profileItems : readLocalSavedAddresses(user), error: null };
    }
    if (!isMissingTable(error, 'profiles')) return { data: [] as SavedAddress[], error };
  } catch (error) {
    if (!isMissingTable(error, 'profiles')) return { data: [] as SavedAddress[], error: error as Error };
  }
  return { data: readLocalSavedAddresses(user), error: null };
}

export async function fetchSavedAddresses() {
  if (!supabaseEnabled || !supabase) return { data: [] as SavedAddress[], error: null };
  const user = await getCurrentSupabaseUser();
  if (!user) return { data: [] as SavedAddress[], error: new Error('Please sign in first.') };
  try {
    const result = await supabase.from('saved_addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }).order('created_at', { ascending: false });
    if (!result.error) return { data: (result.data ?? []) as SavedAddress[], error: null };
    if (!isMissingSavedAddressesTable(result.error)) return { data: [] as SavedAddress[], error: result.error };
  } catch (error) {
    if (!isMissingSavedAddressesTable(error)) return { data: [] as SavedAddress[], error: error as Error };
  }
  return fetchProfileAddressFallback(user);
}

export async function saveAddress(address: { label: string; full_address: string; phone?: string; is_default?: boolean }, id?: string) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.') };
  const user = await getCurrentSupabaseUser();
  if (!user) return { data: null, error: new Error('Please sign in first.') };

  try {
    if (address.is_default) {
      const clearDefault = await supabase.from('saved_addresses').update({ is_default: false }).eq('user_id', user.id);
      if (clearDefault.error && !isMissingSavedAddressesTable(clearDefault.error)) return { data: null, error: clearDefault.error };
    }
    const payload = { ...address, user_id: user.id, is_default: Boolean(address.is_default) };
    const result = id ? await supabase.from('saved_addresses').update(payload).eq('id', id).select('*').single() : await supabase.from('saved_addresses').insert(payload).select('*').single();
    if (!result.error) return result;
    if (!isMissingSavedAddressesTable(result.error)) return result;
  } catch (error) {
    if (!isMissingSavedAddressesTable(error)) return { data: null, error: error as Error };
  }

  // Fully functional fallback when neither saved_addresses nor profiles exists.
  const current = await fetchProfileAddressFallback(user);
  if (current.error) return { data: null, error: current.error };
  const items = [...current.data];
  const now = new Date().toISOString();
  const next: SavedAddress = {
    id: id || crypto.randomUUID(), user_id: user.id, label: address.label, full_address: address.full_address,
    phone: address.phone || user.user_metadata?.mobile || null, is_default: Boolean(address.is_default), created_at: now,
  };
  const index = id ? items.findIndex((a) => a.id === id) : -1;
  if (index >= 0) items[index] = { ...items[index], ...next, created_at: items[index].created_at };
  else items.push(next);
  if (items.length === 1) items[0].is_default = true;
  else if (address.is_default) items.forEach((a) => { a.is_default = a.id === next.id; });
  else if (!items.some((a) => a.is_default)) items[0].is_default = true;

  const localError = writeLocalSavedAddresses(user.id, items);
  if (localError) return { data: null, error: localError };

  // If profiles exists but saved_addresses doesn't, also keep the default address there.
  try {
    const encoded = SAVED_ADDRESS_FALLBACK_PREFIX + JSON.stringify(items);
    const profileUpdate = await supabase.from('profiles').update({ address: encoded }).eq('id', user.id);
    if (profileUpdate.error && !isMissingTable(profileUpdate.error, 'profiles')) return { data: null, error: profileUpdate.error };
  } catch { /* localStorage remains the guaranteed fallback */ }
  return { data: next, error: null };
}

export async function deleteSavedAddress(id: string) {
  if (!supabaseEnabled || !supabase) return { error: new Error('Supabase authentication is not configured.') };
  try {
    const result = await supabase.from('saved_addresses').delete().eq('id', id);
    if (!result.error) return result;
    if (!isMissingSavedAddressesTable(result.error)) return result;
  } catch (error) {
    if (!isMissingSavedAddressesTable(error)) return { error: error as Error };
  }

  const user = await getCurrentSupabaseUser();
  if (!user) return { error: new Error('Please sign in first.') };
  const current = await fetchProfileAddressFallback(user);
  if (current.error) return { error: current.error };
  const remaining = current.data.filter((a) => a.id !== id);
  if (remaining.length && !remaining.some((a) => a.is_default)) remaining[0].is_default = true;
  const localError = writeLocalSavedAddresses(user.id, remaining);
  if (localError) return { error: localError };
  try {
    const encoded = remaining.length ? SAVED_ADDRESS_FALLBACK_PREFIX + JSON.stringify(remaining) : '';
    const update = await supabase.from('profiles').update({ address: encoded }).eq('id', user.id);
    if (update.error && !isMissingTable(update.error, 'profiles')) return { error: update.error };
  } catch { /* localStorage remains the guaranteed fallback */ }
  return { error: null };
}

export async function fetchPublicProducts() {
  if (!supabaseEnabled || !supabase) return { data: [] as Product[], error: null };
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  const mapped = (data ?? []).map((p: any) => ({
    id: p.id, name: p.name, slug: p.slug, brand: p.brand, brandId: p.brand_id, category: p.category, categoryId: p.category_id,
    price: Number(p.price), mrp: Number(p.mrp), rating: Number(p.rating), reviewCount: Number(p.review_count), stock: Number(p.stock),
    images: p.images ?? [], colors: p.colors ?? [], highlights: p.highlights ?? [], specs: p.specs ?? [], description: p.description ?? '',
    warranty: p.warranty ?? '', returnPolicy: p.return_policy ?? '', delivery: p.delivery ?? '', tags: p.tags ?? [], badge: p.badge ?? undefined,
    createdAt: p.created_at, reviews: p.reviews ?? [], frequentlyBoughtTogether: p.frequently_bought_together ?? undefined,
  })) as Product[];
  return { data: mapped, error };
}

export async function fetchAdminProducts() {
  if (!supabaseEnabled || !supabase) return { data: [] as Product[], error: null };
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  const mapped = (data ?? []).map((p: any) => ({
    id: p.id, name: p.name, slug: p.slug, brand: p.brand, brandId: p.brand_id, category: p.category, categoryId: p.category_id,
    price: Number(p.price), mrp: Number(p.mrp), rating: Number(p.rating), reviewCount: Number(p.review_count), stock: Number(p.stock),
    images: p.images ?? [], colors: p.colors ?? [], highlights: p.highlights ?? [], specs: p.specs ?? [], description: p.description ?? '',
    warranty: p.warranty ?? '', returnPolicy: p.return_policy ?? '', delivery: p.delivery ?? '', tags: p.tags ?? [], badge: p.badge ?? undefined,
    createdAt: p.created_at, reviews: p.reviews ?? [], frequentlyBoughtTogether: p.frequently_bought_together ?? undefined,
  })) as Product[];
  return { data: mapped, error };
}

export async function upsertAdminProduct(product: Product) {
  if (!supabaseEnabled || !supabase) return { data: null, error: new Error('Supabase authentication is not configured.') };
  const { data, error } = await supabase.from('products').upsert({
    id: product.id, name: product.name, slug: product.slug, brand: product.brand, brand_id: product.brandId,
    category: product.category, category_id: product.categoryId, price: product.price, mrp: product.mrp, rating: product.rating,
    review_count: product.reviewCount, stock: product.stock, images: product.images, colors: product.colors, highlights: product.highlights,
    specs: product.specs, description: product.description, warranty: product.warranty, return_policy: product.returnPolicy,
    delivery: product.delivery, tags: product.tags, badge: product.badge ?? null, created_at: product.createdAt, reviews: product.reviews,
    frequently_bought_together: product.frequentlyBoughtTogether ?? null,
  }).select('*').single();
  return { data: data as Product | null, error };
}

export async function deleteAdminProduct(id: string) {
  if (!supabaseEnabled || !supabase) return { error: new Error('Supabase authentication is not configured.') };
  return await supabase.from('products').delete().eq('id', id);
}

export async function signOutSupabase() { if (!supabaseEnabled || !supabase) return; await supabase.auth.signOut(); }
