const apiHeaders = {'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','vary':'Cookie, X-Reader-Token'};
const json = (value, status = 200) => Response.json(value, {status, headers: apiHeaders});

function emailConfig(env) {
  const url = env.SUPABASE_URL?.trim().replace(/\/$/,'');
  const key = env.SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url || '') || !key?.startsWith('sb_publishable_')) return null;
  return {url,key};
}

async function identify(request, config) {
  const token = request.headers.get('x-reader-token');
  if (token === null) {
    return {id:request.headers.get('oai-authenticated-user-id'),
      label:request.headers.get('oai-authenticated-user-email'),provider:'chatgpt'};
  }
  if (!config || !token) return {error:401};
  const response = await fetch(config.url+'/auth/v1/user',{
    headers:{apikey:config.key,Authorization:'Bearer '+token},signal:AbortSignal.timeout(7000)
  });
  if (!response.ok) return {error:[401,403].includes(response.status)?401:503};
  const user = await response.json();
  if (!user.id || !user.email_confirmed_at || !user.email) return {error:401};
  return {id:'email/'+new URL(config.url).hostname+'/'+user.id,
    label:user.email,provider:'email'};
}

async function account(request, env, path) {
  const config = emailConfig(env);
  if (path === '/api/auth-options' && request.method === 'GET') return json({email:config});
  const {id,label,provider,error} = await identify(request,config);
  if (error) return json({error:'identity_unavailable'},error);
  if (path === '/api/account' && request.method === 'GET') {
    if (!id || !label) return json({reader:null});
    await env.DB.prepare('INSERT INTO readers (user_id) VALUES (?) ON CONFLICT(user_id) DO NOTHING').bind(id).run();
    const row = await env.DB.prepare('SELECT read_mask,chapter,part FROM readers WHERE user_id=?').bind(id).first();
    return json({reader:{id,label,email:label,provider,done:Array.from({length:13},(_,i)=>i).filter(i=>row.read_mask & (1<<i)),
      position:row.chapter === null ? null : {chapter:row.chapter,part:row.part}}});
  }
  if (path !== '/api/progress') return json({error:'not_found'},404);
  if (!id || !label) return json({error:'sign_in_required'},401);
  if (request.method !== 'POST') return json({error:'method'},405);
  if (request.headers.get('origin') !== new URL(request.url).origin ||
      !request.headers.get('content-type')?.startsWith('application/json')) return json({error:'origin'},403);
  const body = await request.json().catch(()=>null);
  if (!body || body.reader !== id) return json({error:'account_changed'},403);
  if (!Number.isInteger(body.chapter) || body.chapter<0 || body.chapter>=13) return json({error:'invalid_chapter'},400);
  let update;
  if (body.kind === 'done' && typeof body.value === 'boolean') {
    const bit = 1 << body.chapter;
    update = env.DB.prepare(body.value ? 'UPDATE readers SET read_mask=read_mask | ? WHERE user_id=?' :
      'UPDATE readers SET read_mask=read_mask & ? WHERE user_id=?').bind(body.value ? bit : ~bit,id);
  } else if (body.kind === 'position' && Number.isInteger(body.part) && body.part>=0 && body.part<=partCounts[body.chapter]) {
    update = env.DB.prepare('UPDATE readers SET chapter=?,part=? WHERE user_id=?').bind(body.chapter,body.part,id);
  } else return json({error:'invalid_progress'},400);
  await update.run();
  return json({ok:true});
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path.startsWith('/api/')) {
      try { return await account(request,env,path); }
      catch { return json({error:'unavailable'},503); }
    }
    if (!['GET','HEAD'].includes(request.method)) return new Response(null,{status:405});
    const entry = assets[path === '/' ? '/index.html' : path];
    if (!Array.isArray(entry)) return new Response(null,{status:404});
    const headers={'content-type':entry[0], 'cache-control':'public, max-age=0, must-revalidate','x-content-type-options':'nosniff'};
    return new Response(request.method === 'HEAD' ? null : Uint8Array.from(atob(entry[1]), c=>c.charCodeAt(0)),{headers});
  }
};
