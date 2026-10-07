const SUPABASE_URL = 'https://lykoxkuxwhbwgvyyraqy.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_RaQIld0mkSTzNGFg2FLrEQ_UkQmoeOH';

function sendJson(res: any, status: number, body: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').send(JSON.stringify(body));
}

function getPath(req: any): string {
  const raw = req.query?.path;
  const parts = Array.isArray(raw) ? raw : (raw ? [raw] : []);
  return parts.map((part: string) => encodeURIComponent(String(part))).join('/');
}

export default async function handler(req: any, res: any) {
  const method = String(req.method || 'GET').toUpperCase();
  if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(method)) {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  if (method === 'OPTIONS') {
    res.status(204).setHeader('Access-Control-Allow-Origin', '*').setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS').send('');
    return;
  }

  try {
    const path = getPath(req);
    const originalUrl = new URL(req.url || '/', 'https://stellar-shop-sigma.vercel.app');
    const target = `${SUPABASE_URL}/${path}${originalUrl.search}`;

    const incoming = req.headers || {};
    const headers: Record<string, string> = {
      apikey: String(incoming.apikey || SUPABASE_PUBLISHABLE_KEY),
      'Content-Type': String(incoming['content-type'] || 'application/json'),
    };

    // Preserve the user's Supabase access token for authenticated REST calls.
    if (incoming.authorization) headers.Authorization = String(incoming.authorization);
    if (incoming['x-client-info']) headers['X-Client-Info'] = String(incoming['x-client-info']);
    if (incoming['x-supabase-api-version']) headers['X-Supabase-API-Version'] = String(incoming['x-supabase-api-version']);
    if (incoming.prefer) headers.Prefer = String(incoming.prefer);
    if (incoming.range) headers.Range = String(incoming.range);
    if (incoming['content-range']) headers['Content-Range'] = String(incoming['content-range']);

    let body: string | undefined;
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && req.body !== undefined) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const upstream = await fetch(target, { method, headers, body });
    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.status(upstream.status);
    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    const contentRange = upstream.headers.get('content-range');
    if (contentRange) res.setHeader('Content-Range', contentRange);
    const location = upstream.headers.get('location');
    if (location) res.setHeader('Location', location);

    // Do not call res.json() here. Supabase sometimes legitimately returns an
    // empty body (for example 204 responses), and parsing that as JSON was the
    // source of the previous "Unexpected end of JSON input" error.
    return res.send(buffer);
  } catch (error) {
    return sendJson(res, 502, {
      error: 'SUPABASE_PROXY_ERROR',
      message: error instanceof Error ? error.message : 'Unable to reach Supabase from Vercel.',
    });
  }
}
