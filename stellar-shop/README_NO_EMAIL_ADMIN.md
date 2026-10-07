# Admin authentication

The admin dashboard uses Supabase Auth. There is no browser-side admin password fallback.

1. Create/register the intended administrator through Supabase Auth.
2. Run `supabase/fix_admin_login.sql` in Supabase SQL Editor for an existing deployment.
3. Promote the account and optionally give it the User ID `admin`:

```sql
update public.profiles
set role = 'admin', username = 'admin'
where email = 'YOUR_ADMIN_EMAIL';
```

4. Open `/admin-login` and sign in with either the Supabase Auth email or the profile username, plus the Supabase Auth password.

Authorization is enforced by Supabase Auth and `profiles.role`; the sessionStorage value is only a UI hint and cannot grant access.
