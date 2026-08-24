# Admin authentication

The admin dashboard no longer uses `VITE_ADMIN_USER_ID` or `VITE_ADMIN_PASSWORD`.

## Setup
1. Create an administrator user in Supabase Authentication.
2. Run the supplied `supabase/schema.sql`.
3. In Supabase SQL Editor run:
   `update public.profiles set role = 'admin' where email = 'YOUR_ADMIN_EMAIL';`
4. Open `/admin-login` and sign in with that Supabase email/password.

The website never renders default admin credentials, and no admin password is stored in Vite environment variables.
