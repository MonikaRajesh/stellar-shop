-- Stellar Shop Supabase backend
-- Run this whole file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  mobile text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  total numeric(12,2) not null check (total >= 0),
  status text not null default 'Processing'
    check (status in ('Processing','Shipped','Out for Delivery','Delivered','Returned','Cancelled')),
  placed_at timestamptz not null default now(),
  estimated_delivery timestamptz,
  address text not null,
  payment_method text not null,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_placed_at_idx on public.orders(placed_at desc);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, mobile)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email, ''), '@', 1)),
    nullif(new.raw_user_meta_data->>'mobile', '')
  )
  on conflict (id) do update
    set name = excluded.name,
        mobile = excluded.mobile;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.orders enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
on public.orders for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own"
on public.orders for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin"
on public.orders for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Customers cannot directly change status. They can cancel only their own
-- Processing orders through this RPC.
create or replace function public.cancel_order(p_order_id text, p_reason text default 'Customer requested cancellation')
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  update public.orders
  set status = 'Cancelled',
      cancelled_at = now(),
      cancellation_reason = coalesce(nullif(trim(p_reason), ''), 'Customer requested cancellation')
  where id = p_order_id
    and user_id = auth.uid()
    and status = 'Processing';

  get diagnostics updated_count = row_count;
  return updated_count = 1;
end;
$$;

grant execute on function public.cancel_order(text, text) to authenticated;

-- IMPORTANT: after creating your account, make it an administrator.
-- Replace the email below with your real admin email.
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'admin@example.com');
