# Stellar Shop — final admin login setup

## What was fixed

- Removed the frontend dependency on the obsolete `lookup_admin_email_by_username()` RPC.
- Added a secure `bootstrap_admin_account()` RPC that can promote only the configured administrator Auth account after password authentication.
- Added idempotent admin/profile/RLS repair SQL.
- Fixed the admin login loading/error handling.
- Fixed the Razorpay service wrapper paths (`/api/api/...` → `/api/...`).
- Fixed the Vercel SPA rewrite so `/api/*` is not rewritten to `index.html`.
- Checked local source imports and referenced public assets; no missing local imports/assets were found.

## One required Supabase step

The browser cannot change a Supabase user's role by itself. Run this entire file once in **Supabase → SQL Editor**:

`supabase/fix_admin_login.sql`

At the end, the verification query should return the administrator with `role = admin`.

## Deploy

1. Extract this ZIP.
2. Deploy the `stellar-shop` folder to Vercel.
3. Use Node 20+ (the project declares `>=20.19.0`).
4. If Vercel already has the project, create a **new deployment/redeploy** from this corrected source.
5. Open `/admin-login`.
6. Sign in using the configured administrator User ID and the existing Supabase Auth password.

Do not create the old `lookup_admin_email_by_username()` function. The application no longer calls it.
