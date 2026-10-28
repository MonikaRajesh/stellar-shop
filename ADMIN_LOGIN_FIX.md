# Admin login fix

This build fixes the admin-login failure that was showing `[object Object]` after clicking **Open dashboard**.

## What was fixed

1. The configured administrator username (`chinmayms12`) is resolved directly to the configured administrator email before calling the optional username RPC. This prevents an older/missing Supabase RPC from blocking the login.
2. Supabase errors are normalized instead of being rendered as JavaScript `[object Object]`.
3. The login submit handler now has a final error boundary and always clears the loading state.
4. Authentication is still performed by Supabase Auth. The frontend does **not** contain the administrator password.
5. After authentication, the app checks `public.profiles.role = 'admin'` before opening `/admin`.

## Required Supabase setup

The Auth account must exist in Supabase Authentication → Users using:

- Email: `punichinmayms12@gmail.com`
- Password: the administrator password you configured in Supabase Auth

Then run the complete file `supabase/fix_admin_login.sql` in Supabase SQL Editor. It creates/fixes the admin helper functions, RLS policies, and sets the profile to:

- username: `chinmayms12`
- role: `admin`

If the Auth user already exists but the profile row is missing, rerun the main `supabase/schema.sql` trigger setup or create the matching profile before login.

## Vercel settings

The project is configured to use direct Supabase access in production:

```text
VITE_SUPABASE_URL=https://lykoxkuxwhbwgvyyraqy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_RaQIld0mkSTzNGFg2FLrEQ_UkQmoeOH
VITE_SITE_URL=https://stellar-shop-sigma.vercel.app
VITE_ENABLE_GOOGLE_OAUTH=false
VITE_ENABLE_TURNSTILE=false
VITE_USE_SUPABASE_PROXY=false
VITE_ADMIN_USERNAME=chinmayms12
VITE_ADMIN_EMAIL=punichinmayms12@gmail.com
```

After uploading/deploying this build, redeploy Vercel. Then open the site in an incognito window or hard-refresh the page so an older cached JavaScript bundle is not used.

Do **not** add a Supabase service-role key or Razorpay secret to any `VITE_*` variable.
