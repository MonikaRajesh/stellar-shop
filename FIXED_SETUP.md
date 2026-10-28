# Stellar Shop setup

## Vercel

Use `npm run build`; Vite outputs to `dist`. Add the Supabase and Razorpay variables from `VERCEL_DEPLOYMENT.md` to Vercel Project Settings → Environment Variables.

## Supabase

Run `supabase/schema.sql` in the Supabase SQL Editor. Create the administrator with Supabase Auth, then set `profiles.role = 'admin'` for that account.

Do not configure administrator passwords with `VITE_*` variables. Browser-exposed environment variables are not secrets.
