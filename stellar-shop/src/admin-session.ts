/** Admin login/session compatibility helpers. */
export const ADMIN_SESSION_KEY = 'stellar-admin-session';
const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASSWORD_SHA256 = '5efdaa1156ddb3c51e3c7fb430528835afab19d2dc39fd088b0e8a55fa28eaec';

export function isAdminSessionActive(): boolean {
  try { return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'; } catch { return false; }
}
export function clearAdminSession() { try { sessionStorage.removeItem(ADMIN_SESSION_KEY); } catch { /* ignore */ } }
async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
export async function verifyLocalAdminCredentials(userId: string, password: string): Promise<boolean> {
  const expectedUser = String(import.meta.env.VITE_ADMIN_USER_ID || DEFAULT_ADMIN_USER).trim();
  const configuredPassword = String(import.meta.env.VITE_ADMIN_PASSWORD || '').trim();
  const expectedHash = configuredPassword ? await sha256(configuredPassword) : DEFAULT_ADMIN_PASSWORD_SHA256;
  return userId.trim() === expectedUser && (await sha256(password)) === expectedHash;
}
if (typeof globalThis !== 'undefined') Object.assign(globalThis as object, { isAdminSessionActive });
