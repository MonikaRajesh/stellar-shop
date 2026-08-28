# Stellar Shop - Fixed Authentication & Admin Setup

## Included fixes

1. Duplicate signup with the same email is detected and shows: `Your account already exists. Please sign in instead.`
2. Signup attempts an immediate first login. For this to work without email verification, Supabase Email Provider must have **Confirm email OFF**.
3. Product image IDs that were unreliable were mapped to stable Pexels image IDs, and the app already has a local branded image fallback so broken remote images do not remain blank.
4. Admin login accepts the requested administrator ID/password without showing credentials on the login page.

## Admin login

- User ID: `admin`
- Password: the supplied administrator password

The bundled password is stored as a SHA-256 hash. For a real production deployment, override it in Vercel Environment Variables:

- `VITE_ADMIN_USER_ID`
- `VITE_ADMIN_PASSWORD`

Important: because these are Vite `VITE_*` variables, they are available to browser code. This login mode is therefore suitable for the requested project/demo but is **not equivalent to a secure server-side admin authentication system**. For a production store, use Supabase Auth with an admin profile or a server-side admin API.

## Disable first-time email verification

In Supabase:

`Authentication -> Providers -> Email -> Confirm email -> OFF`

This cannot be changed safely from React code or by ordinary SQL in a hosted Supabase project.

## Vercel

Push the extracted project contents to the Git branch connected to Vercel. Do not redeploy an old commit. Vercel must build the new commit.

Build command:

`npm run build`
