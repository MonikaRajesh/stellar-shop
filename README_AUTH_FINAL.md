# Stellar Shop authentication — Vercel deployment

This build uses the supplied Supabase project. The browser connects directly to Supabase over HTTPS by default; the optional Vercel proxy is retained for compatibility but is not required for normal production auth.

Supabase project: `https://lykoxkuxwhbwgvyyraqy.supabase.co`
Production site: `https://stellar-shop-sigma.vercel.app`

## Vercel environment variables

- `VITE_SUPABASE_URL=https://lykoxkuxwhbwgvyyraqy.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY=<your Supabase publishable key>`
- `VITE_SITE_URL=https://stellar-shop-sigma.vercel.app`
- `VITE_ENABLE_GOOGLE_OAUTH=false`
- `VITE_ENABLE_TURNSTILE=false`
- `VITE_USE_SUPABASE_PROXY=false`

Redeploy after changing environment variables.

## Supabase

Enable Email authentication. If immediate signup/login is required, disable email confirmation in the Supabase Auth Email provider settings.

Set the Supabase Site URL to `https://stellar-shop-sigma.vercel.app` and add the deployed URL to Redirect URLs if OAuth is enabled.

Run `supabase/schema.sql` in the Supabase SQL Editor. Create the administrator through Supabase Auth and then set that account's profile role to `admin`.
