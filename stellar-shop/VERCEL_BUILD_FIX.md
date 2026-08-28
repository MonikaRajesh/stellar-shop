# Vercel build fix

The recurring error was:

`TS2304: Cannot find name 'isAdminSessionActive'`

This package includes a backward-compatible global implementation in `src/admin-session.ts` and its TypeScript declaration in `src/admin-session.d.ts`. `src/main.tsx` loads the implementation before the application starts.

This is intentionally defensive: if an older `AdminDashboard.tsx` still calls `isAdminSessionActive()` without importing it, TypeScript can resolve the declaration and the browser has a real implementation at runtime.

The current AdminDashboard does not depend on this helper for authorization; it uses the Supabase admin-role check.

IMPORTANT: Vercel builds the Git commit connected to the Vercel project. Replace the files in the GitHub branch connected to Vercel with this package before redeploying. Clicking Redeploy on an old commit will reproduce the old source error.
