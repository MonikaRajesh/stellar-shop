# Saved Addresses Fix

## What was broken
The deployed app was calling the Supabase table `public.saved_addresses`, but the Supabase project's PostgREST schema cache reported:

`Could not find the table 'public.saved_addresses' in the schema cache`

That is why clicking **Save address** failed.

## What this build changes
1. The normal `saved_addresses` table flow is preserved.
2. If an existing deployment does not have that table yet, the app automatically falls back to the existing `profiles.address` column instead of showing a database error.
3. The fallback supports multiple saved addresses by storing a small JSON payload in `profiles.address`.
4. Checkout uses the same address service, so saved addresses remain selectable for orders.
5. `supabase/fix_admin_login.sql` now refreshes PostgREST's schema cache after creating `saved_addresses`.

## Recommended Supabase setup
Run `supabase/fix_admin_login.sql` once in the Supabase SQL Editor. After it completes, reload the application. When the table is available, the app automatically uses the proper `saved_addresses` table.

## Vercel
Keep the existing Vercel environment variables. Redeploy after uploading this project. No service-role key is required in the browser.
