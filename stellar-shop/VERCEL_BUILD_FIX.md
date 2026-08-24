# Vercel build fix

The AdminDashboard no longer references `isAdminSessionActive`.
Admin access is determined only by `isCurrentUserAdmin()` against Supabase, while
the local session helper remains available only to AdminLogin/logout.

This prevents the TypeScript error:
TS2304: Cannot find name 'isAdminSessionActive'.

IMPORTANT: Vercel must deploy this exact source. If Vercel is connected to GitHub,
replace the repository contents with this ZIP's contents (especially
`src/pages/AdminDashboard.tsx`) and push a new commit before redeploying.
