# StellarShop - final no-email-verification build

## Customer signup/login
The website no longer shows or sends an email OTP/verification flow. Signup goes directly to the store/login and login uses email + password.

### One required Supabase setting
In the existing Supabase project, turn OFF:

Supabase Dashboard -> Authentication -> Providers -> Email -> Confirm email

Supabase's hosted Auth service controls this setting; it is not a normal database-table setting. With Confirm email disabled, Supabase implicitly confirms new email/password users and returns a session after signup.

Do not create a custom trigger on `auth.users` just to bypass email confirmation; custom Auth triggers can break user creation.

## Admin dashboard
Open:
`/admin-login`

Default credentials:
- User ID: `admin`
- Password: `Stellar@Admin2026`

Optional Vercel variables:
- `VITE_ADMIN_USER_ID`
- `VITE_ADMIN_PASSWORD`

The built-in admin gate is browser-side because this is a Vite static frontend. It is NOT suitable as a high-security production admin boundary. For production-grade admin security, use Supabase Auth + RLS or a server-side API.
