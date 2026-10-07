# Stellar Shop — Vercel deployment checklist

## 1. Vercel project

Deploy this folder as the Vercel project root (the folder containing `package.json`).

Build command: `npm run build`
Output directory: `dist`
Install command: `npm install`

The included `vercel.json` keeps React Router routes working on refresh.

## 2. Required Vercel environment variables

Add these in **Vercel → Project → Settings → Environment Variables** for Production (and Preview if required):

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — your Supabase publishable key
- `VITE_SITE_URL` — the exact deployed site URL, without a trailing slash
- `VITE_USE_SUPABASE_PROXY` — `false` (recommended; the browser connects directly to Supabase over HTTPS)
- `VITE_ENABLE_GOOGLE_OAUTH` — `false` unless Google OAuth is configured
- `VITE_ENABLE_TURNSTILE` — `false` unless Cloudflare Turnstile is configured

For Razorpay payments, also add **server-only** variables (never prefix the secret with `VITE_`):

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

The Razorpay secret must never be exposed to browser code.

## 3. Supabase

Run `supabase/schema.sql` in the Supabase SQL Editor.

Create the administrator as a normal Supabase Auth user, then promote that user's profile:

`update public.profiles set role = 'admin' where email = 'YOUR_ADMIN_EMAIL';`

Do not use a browser-side admin password. Admin authorization is checked against the authenticated Supabase user and `profiles.role`.

For email/password signup without email verification, configure the Email provider in Supabase Auth according to the client's requirements.

## 4. Supabase Auth URL

In Supabase Auth URL Configuration, set the Site URL to the deployed Vercel URL and add the Vercel URL to Redirect URLs if OAuth is enabled.

## 5. Important

The Supabase publishable key is intended for client-side use. Never put a Supabase `service_role` key or Razorpay secret in any `VITE_*` variable.

After changing Vercel environment variables, redeploy because Vite variables are embedded during the build.
