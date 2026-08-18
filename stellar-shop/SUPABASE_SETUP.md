# Supabase + Admin Dashboard Setup

## 1. Create Supabase project
Create a project in Supabase, then open **SQL Editor**.

## 2. Create database
Run `supabase/schema.sql`.

The SQL creates:
- `profiles` with customer/admin roles
- `orders` with RLS
- secure customer cancellation RPC
- automatic profile creation for new Auth users
- admin-only order updates

## 3. Configure environment
Copy `.env.example` to `.env.local` and set:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Restart Vite after changing environment variables.

## 4. Create an admin account
Register normally from `/register`.

Then in Supabase SQL Editor run:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
);
```

The admin can then open `/admin`.

## 5. What is now connected

### Customer
- Supabase email/password authentication
- Orders saved in Supabase
- Customer sees only their own orders
- Order cancellation is performed through a secure RPC
- WhatsApp order sharing remains available
- LocalStorage is still used as a UI fallback when Supabase is not configured

### Admin
- `/admin`
- Total orders
- Revenue excluding cancelled orders
- Pending orders
- Cancelled orders
- Full order list
- Status updates: Processing, Shipped, Out for Delivery, Delivered, Returned, Cancelled
- Changes are written to Supabase and visible to customers

## 6. Vercel
Add the same two `VITE_SUPABASE_*` variables under Vercel Project Settings -> Environment Variables, then redeploy.

Do not put the Supabase service-role key in this frontend project. Only the anon/publishable key belongs in Vite environment variables.
