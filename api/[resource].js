// Vercel serves the reader. The original Sites Worker remains the single owner of progress.
const sitesOrigin = 'https://sunzi-shisanzhang-yandu.fufayfay.chatgpt.site';
const routes = new Map([['/api/auth-options','GET'], ['/api/account','GET'], ['/api/progress','POST']]);

export default async function handler(request, response) {
  response.setHeader('Cache-Control','private, no-store');
  const path = new URL(request.url,'https://local.invalid').pathname;
  if (!routes.has(path)) return response.status(404).json({error:'not_found'});
  if (request.method !== routes.get(path)) return response.status(405).json({error:'method'});

  const token = request.headers['x-reader-token'];
  if (path === '/api/account' && !token) return response.json({reader:null});
  const headers = new Headers();
  // Never forward visitor cookies or Sites identity headers supplied by a browser.
  if (token && path !== '/api/auth-options') headers.set('X-Reader-Token',token);
  let body;
  if (path === '/api/progress') {
    if (!token) return response.status(401).json({error:'sign_in_required'});
    if (request.headers.origin !== 'https://'+request.headers.host ||
        !request.headers['content-type']?.startsWith('application/json')) {
      return response.status(403).json({error:'origin'});
    }
    body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body ?? null);
    if (body.length > 4096) return response.status(413).json({error:'too_large'});
    headers.set('Origin',sitesOrigin);
    headers.set('Content-Type','application/json');
  }
  try {
    const upstream = await fetch(sitesOrigin+path,{
      method:request.method,headers,body,redirect:'error',signal:AbortSignal.timeout(7000)
    });
    const data = await upstream.json();
    return response.status(upstream.status).json(data);
  } catch {
    return response.status(503).json({error:'account_service_unavailable'});
  }
}
