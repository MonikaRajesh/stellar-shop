-- Stellar Shop Supabase schema
-- Run this file in Supabase SQL Editor.
-- After the first admin account is created, replace the email below and run the final UPDATE.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  mobile text,
  username text unique,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  items jsonb not null default '[]'::jsonb,
  total numeric(12,2) not null default 0,
  status text not null default 'Processing'
    check (status in ('Processing','Shipped','Out for Delivery','Delivered','Returned','Cancelled')),
  placed_at timestamptz not null default now(),
  estimated_delivery timestamptz,
  address text not null,
  payment_method text not null,
  cancellation_reason text,
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_placed_at_idx on public.orders(placed_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
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

alter table public.profiles enable row level security;
alter table public.orders enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
on public.orders for select
to authenticated
using (
  user_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "orders_insert_own_or_admin" on public.orders;
create policy "orders_insert_own_or_admin"
on public.orders for insert
to authenticated
with check (
  user_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin"
on public.orders for update
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "orders_cancel_own" on public.orders;
create policy "orders_cancel_own"
on public.orders for update
to authenticated
using (user_id = auth.uid() and status in ('Processing','Shipped'))
with check (user_id = auth.uid() and status = 'Cancelled');

-- IMPORTANT: replace this email with the real administrator's Supabase Auth email.
-- Run only after that user has registered:
-- update public.profiles set role = 'admin' where email = 'admin@example.com';


-- Marketing / CRM foundation
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz not null default now(),
  source text default 'website',
  is_active boolean not null default true
);
alter table public.newsletter_subscribers enable row level security;
drop policy if exists "newsletter_public_insert" on public.newsletter_subscribers;
create policy "newsletter_public_insert" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
drop policy if exists "newsletter_admin_select" on public.newsletter_subscribers;
create policy "newsletter_admin_select" on public.newsletter_subscribers for select to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create table if not exists public.campaign_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists campaign_events_name_idx on public.campaign_events(event_name, created_at desc);
alter table public.campaign_events enable row level security;
drop policy if exists "campaign_events_insert" on public.campaign_events;
create policy "campaign_events_insert" on public.campaign_events for insert to anon, authenticated with check (true);
drop policy if exists "campaign_events_admin_select" on public.campaign_events;
create policy "campaign_events_admin_select" on public.campaign_events for select to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
