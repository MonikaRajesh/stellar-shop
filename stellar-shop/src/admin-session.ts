/**
 * Backward-compatible admin session helper.
 *
 * Older AdminDashboard builds called isAdminSessionActive() without importing it.
 * Keep a global implementation so those builds compile and run safely while the
 * current dashboard continues to use Supabase's isCurrentUserAdmin() check.
 */
export function isAdminSessionActive(): boolean {
  try {
    return sessionStorage.getItem('stellar-admin-session') === '1';
  } catch {
    return false;
  }
}

// Make the helper available to legacy code that calls it as a global function.
if (typeof globalThis !== 'undefined') {
  (globalThis as typeof globalThis & { isAdminSessionActive?: () => boolean }).isAdminSessionActive = isAdminSessionActive;
}
