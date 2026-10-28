# Stellar Shop Administrator Setup

Requested administrator identity:

- Email: `punichinmayms12@gmail.com`
- Admin User ID / username: `chinmayms12`
- Password: set this exact password in the Supabase Auth user account during setup.

## 1. Create the Auth user

In Supabase Dashboard → Authentication → Users, create a user with:

- Email: `punichinmayms12@gmail.com`
- Password: the administrator password supplied by the project owner
- Confirm the user if email confirmation is enabled.

## 2. Run the SQL

Run the complete `supabase/fix_admin_login.sql` in Supabase SQL Editor. It will configure the profile as:

- `username = chinmayms12`
- `role = admin`

## 3. Login

Use:

- User ID: `chinmayms12`
- Password: the password assigned to that Supabase Auth account

The password is deliberately not placed in Vite environment variables or browser JavaScript.
