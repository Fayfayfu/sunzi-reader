'use strict';

// Registration is paused; all reading progress stays in this browser.
const accountsEnabled = false;
let signedReader = null;
let accountUnavailable = false;
let pendingProgress = Promise.resolve();
let failedUpdates = new Map();

function authPath(action, returnTo) {
  return '/' + action + '-with-chatgpt?return_to=' + encodeURIComponent('/' + returnTo);
}

function accountView() {
  const header = section('READER ACCOUNT','读者账户');
  if (accountUnavailable) return header + '<p>暂时无法连接账户服务。</p><a class="button primary" href="" onclick="location.reload();return false">重新连接</a>';
  const signout = signedReader?.provider === 'email'
    ? '<button type="button" class="text-link" data-email-action="logout">退出登录</button>'
    : `<a class="text-link" target="_top" href="${authPath('signout','#home')}">退出登录</a>`;
  if (signedReader) return header + `<div class="account-panel"><h3>已登录</h3><p>${esc(signedReader.label)}</p><p>已读篇目和续读位置保存在这个账户中。</p><div class="actions"><a class="button primary" href="#journal">我的研读</a>${signout}</div></div>`;
  return header + emailPanel() + '<div class="account-panel"><h3>原站读者</h3><p>之前通过 ChatGPT 登录的读者，可以回到原站继续阅读原有进度。</p><a class="text-link" href="https://sunzi-shisanzhang-yandu.fufayfay.chatgpt.site/#account">前往原站账户 →</a></div>';

}

function journalAccount() {
  if (!accountsEnabled) return '<p class="account-caption">阅读进度保存在当前浏览器中。</p>';
  if (accountUnavailable) return '<p class="account-caption"><a href="#account">账户服务暂不可用 · 重新连接</a></p>';
  if (signedReader) return '<p class="account-caption">已登录 · '+esc(signedReader.label)+'　<a href="#account">账户设置</a></p>';
  return '<p class="account-caption">当前进度保存在此浏览器。<a href="#account">注册或登录</a>，可在不同设备间续读。</p>';
}

async function beginReading() {
  if (!accountsEnabled) { render(); return; }
  try {
    try { await configureEmail(); } catch { /* The hosted sign-in remains available during provider setup. */ }
    const res = await fetch('/api/account',{headers:await emailHeaders(),cache:'no-store',signal:AbortSignal.timeout(8000)});
    if (res.status===401 && emailAuth) {
      const {error}=await emailAuth.signOut({scope:'local'});
      if (error) throw error;
      location.reload();return;
    }
    if (!res.ok) throw new Error();
    const {reader} = await res.json();
    signedReader = reader;
    emailAuth?.onAuthStateChange((event,session)=>{
      if (emailBusy) return;
      if (event==='SIGNED_OUT' && signedReader?.provider==='email') location.reload();
      if (event==='SIGNED_IN' && session && !(signedReader?.provider==='email' && signedReader.id.endsWith('/'+session.user.id))) location.reload();
    });
    if (reader) {
      done = new Set(reader.done);
      last = reader.position?.chapter ?? null;
      memoryPosition = reader.position;
      notes = [];
    }
  } catch { accountUnavailable = true; }
  const accountLink = document.querySelector('[data-page="account"]');
  if (accountLink) accountLink.textContent = signedReader ? '我的账户' : '注册 / 登录';
  render();
}

function sendProgress(change) {
  if (!signedReader) return;
  const body = JSON.stringify({...change,reader:signedReader.id});
  const key = change.kind === 'position' ? 'position' : 'done-'+change.chapter;
  // Keep the latest unsent change per field. An older failure cannot replace a newer choice.
  failedUpdates.set(key,body);
  pendingProgress = pendingProgress.then(async()=>{
    if (failedUpdates.get(key) !== body) return;
    try {
      const headers = await emailHeaders();
      if (signedReader.provider==='email' && !headers['X-Reader-Token']) throw new Error('session expired');
      const response = await fetch('/api/progress',{method:'POST',headers:{...headers,'content-type':'application/json'},body,keepalive:true});
      if (!response.ok) throw new Error();
      if (failedUpdates.get(key) === body) failedUpdates.delete(key);
    } catch { notify('进度尚未同步，请保持此页打开并检查网络。'); }
  });
}
window.addEventListener('online',()=>{
  for (const body of [...failedUpdates.values()]) sendProgress(JSON.parse(body));
});

// Re-check identity when the browser restores a page from its back-forward cache.
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
