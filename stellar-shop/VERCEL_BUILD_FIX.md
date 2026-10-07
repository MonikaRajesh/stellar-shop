# Vercel build notes

The previous browser-side admin credential fallback has been removed. Administrator access is now authenticated by Supabase Auth and authorized by `profiles.role`.

If TypeScript reports missing `process` types in an API function, do not add secrets to `VITE_*` variables. The current Supabase proxy uses the project's public publishable configuration and does not require Node environment variables.

For Razorpay, configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Vercel Project Settings. Never expose the key secret to browser code.
