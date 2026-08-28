# Supabase setup for Stellar Shop

## Required Vercel variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`)
- `VITE_SITE_URL`

Do not put a Supabase service-role key in the Vite frontend.

## First-time setup
1. Run `supabase/schema.sql` in the Supabase SQL Editor.
2. In Supabase Dashboard → Authentication → Providers → Email, turn **Confirm email OFF** if you want customers to sign in immediately after signup. This is a Supabase project setting; it cannot be safely disabled from browser code.
3. Create the administrator in Supabase Auth.
4. Run `update public.profiles set role = 'admin' where email = 'YOUR_ADMIN_EMAIL';`.
5. Use `/admin-login` with that administrator email/password.

The storefront rejects duplicate signup attempts with a clear “Your account already exists” message.
