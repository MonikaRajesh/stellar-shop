import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function send(res, status, body) {
  res.status(status).setHeader('Cache-Control', 'no-store').json(body);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'METHOD_NOT_ALLOWED' });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return send(res, 500, { error: 'SERVER_AUTH_NOT_CONFIGURED' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return send(res, 400, { error: 'INVALID_REQUEST' });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const name = String(body.name || '').trim();
  const mobile = String(body.mobile || '').trim();
  const username = String(body.username || '').trim();

  if (!/^\S+@\S+\.\S+$/.test(email)) return send(res, 400, { error: 'INVALID_EMAIL' });
  if (password.length < 8) return send(res, 400, { error: 'WEAK_PASSWORD' });
  if (!name) return send(res, 400, { error: 'NAME_REQUIRED' });
  if (!username) return send(res, 400, { error: 'USERNAME_REQUIRED' });

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Repair accounts created by an older build: if the email already exists, make sure
  // it is confirmed so the old account does not get trapped behind email verification.
  const { data: emailMatch, error: emailLookupError } = await admin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (emailLookupError) {
    console.error('email lookup failed', emailLookupError);
    return send(res, 500, { error: 'PROFILE_LOOKUP_FAILED' });
  }
  if (emailMatch?.id) {
    await admin.auth.admin.updateUserById(emailMatch.id, { email_confirm: true });
    return send(res, 409, { error: 'ACCOUNT_EXISTS' });
  }

  const { data: usernameMatch, error: usernameLookupError } = await admin
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (usernameLookupError) {
    console.error('username lookup failed', usernameLookupError);
    return send(res, 500, { error: 'PROFILE_LOOKUP_FAILED' });
  }
  if (usernameMatch) return send(res, 409, { error: 'USERNAME_EXISTS' });

  // email_confirm=true is the key fix: Supabase does not require a verification link.
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, mobile: mobile || null, username },
  });

  if (error) {
    const message = String(error.message || '').toLowerCase();
    if (/already|exists|registered|duplicate/.test(message)) {
      return send(res, 409, { error: 'ACCOUNT_EXISTS' });
    }
    console.error('admin auth create failed', error);
    return send(res, 400, { error: 'ACCOUNT_CREATE_FAILED', detail: error.message });
  }

  return send(res, 201, { user: { id: data.user.id, email: data.user.email } });
}
