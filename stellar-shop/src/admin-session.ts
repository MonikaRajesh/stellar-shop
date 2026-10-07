/** Compatibility helpers for the admin route.
 *
 * Real authorization is performed by Supabase Auth + the configured administrator email.
 * No administrator password is stored in browser code.
 */
export const ADMIN_SESSION_KEY = 'stellar-admin-session';

export function isAdminSessionActive(): boolean {
  // This flag is only a UI hint. It is never used as authorization.
  try { return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'; } catch { return false; }
}

export function setAdminSessionHint(active = true) {
  try {
    if (active) sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    else sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch { /* ignore */ }
}

export function clearAdminSession() { setAdminSessionHint(false); }

