-- One-time migration for an existing StellarShop Supabase project.
-- Fixes the auth profile trigger and preserves username during signup.

alter table public.profiles add column if not exists username text;

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


-- Allow customers to update a delivery address only while an order is still Processing.
drop policy if exists "orders_address_update_own" on public.orders;
create policy "orders_address_update_own"
on public.orders for update
to authenticated
using (user_id = auth.uid() and status = 'Processing')
with check (user_id = auth.uid() and status = 'Processing');

-- Allow customers to request a return only for Delivered orders.
drop policy if exists "orders_return_own" on public.orders;
create policy "orders_return_own"
on public.orders for update
to authenticated
using (user_id = auth.uid() and status = 'Delivered')
with check (user_id = auth.uid() and status = 'Returned');
