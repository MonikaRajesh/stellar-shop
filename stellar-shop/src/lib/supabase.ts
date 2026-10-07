import { createClient } from '@supabase/supabase-js';

// These are safe-to-expose Supabase browser credentials. They are also supplied
// through Vercel env vars in production, but the exact project values are kept
// here as a fallback so a missing Vercel build variable cannot silently point
// the app at an old Supabase project.
const SUPABASE_URL = 'https://lykoxkuxwhbwgvyyraqy.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_RaQIld0mkSTzNGFg2FLrEQ_UkQmoeOH';

const configuredUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
const configuredKey = String(
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
).trim();

const directUrl = configuredUrl || SUPABASE_URL;
const publishableKey = configuredKey || SUPABASE_PUBLISHABLE_KEY;

// Production requests use a same-origin Vercel proxy. This removes browser
// CORS/DNS failures from the authentication/data path while keeping the
// publishable key as the only client credential.
const useProxy = String(import.meta.env.VITE_USE_SUPABASE_PROXY ?? 'false').toLowerCase() !== 'false';
const isLocalDev = typeof window !== 'undefined' && /^(localhost|127\.0\.1)$/.test(window.location.hostname);
const clientUrl = useProxy && typeof window !== 'undefined' && !isLocalDev
  ? `${window.location.origin}/api/supabase`
  : directUrl;

export const supabaseEnabled = Boolean(clientUrl && publishableKey);

export const supabase = supabaseEnabled
  ? createClient(clientUrl, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'X-Client-Info': 'stellar-shop-web',
        },
      },
    })
  : null;

export { directUrl as supabaseDirectUrl };
