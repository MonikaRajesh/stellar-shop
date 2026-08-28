# Password signup without email verification

Stellar Shop creates password accounts through `/api/auth/register` using Supabase's server-side Admin API. New users are created with `email_confirm=true`, so signup does not wait for an email verification link and the browser signs the user in immediately.

## Required Vercel environment variable

Add this variable to the Vercel project for the environments you deploy:

`SUPABASE_SERVICE_ROLE_KEY` = Supabase Dashboard -> Project Settings -> API -> service_role key

**Security:** keep this key server-only. Do not prefix it with `VITE_` and never put it in frontend code.

Keep the existing public variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`)

After adding the variable, redeploy Vercel.

## Fixes included

- No email verification or OTP is required for password signup.
- Avoids Supabase Auth email sending during normal signup, eliminating the screenshot's email-rate-limit failure path.
- Duplicate email shows an account-exists message.
- Duplicate username shows a clear username conflict.
- New account is immediately authenticated after creation.
