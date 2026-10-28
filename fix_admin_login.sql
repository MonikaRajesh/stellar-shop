-- Stellar Shop: FINAL administrator repair
-- Run this entire file ONCE in Supabase SQL Editor.
-- It is safe to run repeatedly.
-- It creates the required authorization functions/policies, then immediately
-- promotes the configured Auth account to administrator. The web app can also
-- call bootstrap_admin_account() after authentication to repair a missing profile.

create extension if not exists pgcrypto;

-- Create the core tables if this Supabase project has not run schema.sql yet.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  mobile text,
  username text unique,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  items jsonb not null default '[]'::jsonb,
  total numeric(12,2) not null default 0,
  status text not null default 'Processing',
  placed_at timestamptz not null default now(),
  estimated_delivery timestamptz,
  address text not null default '',
  payment_method text not null default 'Online'
);

create table if not exists public.products (
  id text primary key, name text not null, slug text unique not null, brand text not null, brand_id text not null,
  category text not null, category_id text not null, price numeric(12,2) not null default 0, mrp numeric(12,2) not null default 0,
  rating numeric(3,2) not null default 0, review_count integer not null default 0, stock integer not null default 0,
  images jsonb not null default '[]'::jsonb, colors jsonb not null default '[]'::jsonb, highlights jsonb not null default '[]'::jsonb,
  specs jsonb not null default '[]'::jsonb, description text not null default '', warranty text not null default '', return_policy text not null default '',
  delivery text not null default '', tags jsonb not null default '[]'::jsonb, badge text, created_at timestamptz not null default now(),
  reviews jsonb not null default '[]'::jsonb, frequently_bought_together jsonb
);

create table if not exists public.saved_addresses (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home', full_address text not null, phone text, is_default boolean not null default false, created_at timestamptz not null default now()
);

-- Refresh PostgREST's schema cache after ensuring saved_addresses exists.
NOTIFY pgrst, 'reload schema';

alter table public.profiles enable row level security;
alter table public.orders enable row level security;

alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists mobile text;
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists role text not null default 'customer';
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists last_login_at timestamptz;
alter table public.profiles add column if not exists last_seen_at timestamptz;
alter table public.orders add column if not exists razorpay_payment_id text;
alter table public.orders add column if not exists razorpay_order_id text;
alter table public.orders add column if not exists cancellation_reason text;
alter table public.orders add column if not exists cancelled_at timestamptz;
alter table public.orders add column if not exists created_at timestamptz not null default now();

alter table public.products add column if not exists name text not null default 'Product';
alter table public.products add column if not exists slug text;
alter table public.products add column if not exists brand text not null default 'Brand';
alter table public.products add column if not exists brand_id text not null default 'b1';
alter table public.products add column if not exists category text not null default 'Accessories';
alter table public.products add column if not exists category_id text not null default 'c17';
alter table public.products add column if not exists price numeric(12,2) not null default 0;
alter table public.products add column if not exists mrp numeric(12,2) not null default 0;
alter table public.products add column if not exists rating numeric(3,2) not null default 0;
alter table public.products add column if not exists review_count integer not null default 0;
alter table public.products add column if not exists stock integer not null default 0;
alter table public.products add column if not exists images jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists colors jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists highlights jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists specs jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists description text not null default '';
alter table public.products add column if not exists warranty text not null default '';
alter table public.products add column if not exists return_policy text not null default '';
alter table public.products add column if not exists delivery text not null default '';
alter table public.products add column if not exists tags jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists badge text;
alter table public.products add column if not exists created_at timestamptz not null default now();
alter table public.products add column if not exists reviews jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists frequently_bought_together jsonb;

-- Older projects may have a products table without a unique slug.
update public.products set slug = coalesce(nullif(slug, ''), id) where slug is null or slug = '';

-- Only the configured Auth email can bootstrap itself as the administrator.
create or replace function public.bootstrap_admin_account()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text;
begin
  if current_user_id is null then
    return false;
  end if;

  select lower(email) into current_email
  from auth.users
  where id = current_user_id;

  if current_email <> lower('punichinmayms12@gmail.com') then
    return false;
  end if;

  insert into public.profiles (id, name, email, username, role)
  values (
    current_user_id,
    coalesce((select raw_user_meta_data->>'name' from auth.users where id = current_user_id), split_part(current_email, '@', 1)),
    current_email,
    'chinmayms12',
    'admin'
  )
  on conflict (id) do update set
    email = excluded.email,
    username = 'chinmayms12',
    role = 'admin';

  return true;
end;
$$;

revoke all on function public.bootstrap_admin_account() from public;
grant execute on function public.bootstrap_admin_account() to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- The configured Auth account is promoted immediately when this script runs.
insert into public.profiles (id, name, email, username, role)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'name', split_part(lower(u.email), '@', 1)),
  lower(u.email),
  'chinmayms12',
  'admin'
from auth.users u
where lower(u.email) = lower('punichinmayms12@gmail.com')
on conflict (id) do update set
  email = excluded.email,
  username = excluded.username,
  role = 'admin';

-- Keep the profile trigger compatible with normal customer registration.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, mobile, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email, ''), '@', 1)),
    new.email,
    new.raw_user_meta_data->>'mobile',
    new.raw_user_meta_data->>'username'
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    mobile = excluded.mobile,
    username = excluded.username;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Profiles: users can read/update themselves; administrators can manage all profiles.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid() and (role = 'customer' or public.is_admin()));

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Orders: customers see their own; administrators see/manage all.
drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
on public.orders for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_insert_own_or_admin" on public.orders;
create policy "orders_insert_own_or_admin"
on public.orders for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin"
on public.orders for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "orders_cancel_own" on public.orders;
create policy "orders_cancel_own"
on public.orders for update
to authenticated
using (user_id = auth.uid() and status in ('Processing','Shipped'))
with check (user_id = auth.uid() and status = 'Cancelled');

drop policy if exists "orders_address_update_own" on public.orders;
create policy "orders_address_update_own"
on public.orders for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "orders_return_own" on public.orders;
create policy "orders_return_own"
on public.orders for update
to authenticated
using (user_id = auth.uid() and status = 'Delivered')
with check (user_id = auth.uid() and status = 'Returned');

-- Products: public read, administrator write.
alter table public.products enable row level security;
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products for select to anon, authenticated using (true);
drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Saved addresses.
alter table public.saved_addresses enable row level security;
drop policy if exists "saved_addresses_own_all" on public.saved_addresses;
create policy "saved_addresses_own_all" on public.saved_addresses for all to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

-- Optional verification query: it should return the administrator row.
select id, email, username, role
from public.profiles
where lower(email) = lower('punichinmayms12@gmail.com');
