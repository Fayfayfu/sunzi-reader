'use strict';

let emailAuth = null;
let sentTo = '';
let resendAt = 0;
let emailBusy = false;

async function configureEmail() {
  const response = await fetch('/api/auth-options',{cache:'no-store',signal:AbortSignal.timeout(8000)});
  if (!response.ok) throw new Error('configuration unavailable');
  const {email} = await response.json();
  if (email) {
    const {connect} = await import('/email-auth.js');
    emailAuth = connect(email);
  }
}

async function emailHeaders() {
  if (!emailAuth) return {};
  const {data,error} = await emailAuth.getSession();
  if (error) throw error;
  return data.session ? {'X-Reader-Token':data.session.access_token} : {};
}

function emailPanel() {
  if (!emailAuth) return '<section class="account-panel"><h3>邮箱注册 / 登录</h3><p>邮箱登录尚未开放。你可以直接读全书，当前浏览器会记住阅读进度。</p><a class="text-link" href="#catalog">去读十三篇 →</a></section>';
  const field = sentTo
    ? '<label for="email-field">邮箱验证码</label><input id="email-field" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,10}" maxlength="10" required>'
    : '<label for="email-field">邮箱地址</label><input id="email-field" type="email" autocomplete="email" maxlength="254" placeholder="name@example.com" required>';
  return `<section class="account-panel"><h3>邮箱注册 / 登录</h3>
    <p>${sentTo?'请输入发往 '+esc(sentTo)+' 的验证码。':'只想读书，可以直接进入十三篇。希望换设备续读时，用邮箱验证码登录；首次验证会自动注册。'}</p>
    <form id="email-login">${field}<div class="actions">
      <button class="button primary" type="submit">${sentTo?'验证并登录':'发送邮箱验证码'}</button>
      ${sentTo?'<button type="button" class="text-link" data-email-action="resend">重新发送</button><button type="button" class="text-link" data-email-action="change">更换邮箱</button>':''}
    </div><p id="email-message" role="status" aria-live="polite"></p></form></section>`;
}

function emailStatus(message) {
  const status = document.getElementById('email-message');
  if (status) status.textContent=message;
  else notify(message);
}

async function emailAction(action) {
  if (!emailAuth || emailBusy) return;
  const field = document.getElementById('email-field');
  emailBusy=true;
  try {
    if (action==='logout') {
      await pendingProgress;
      const {error}=await emailAuth.signOut({scope:'local'});
      if (error) throw error;
      location.replace('/#home');location.reload();
    } else if (action==='change') {
      sentTo='';render();document.getElementById('email-field')?.focus();
    } else if (!sentTo || action==='resend') {
      if (Date.now()<resendAt) return emailStatus('请在 '+Math.ceil((resendAt-Date.now())/1000)+' 秒后再发送。');
      const email=sentTo || field.value.trim();
      emailStatus('正在发送…');
      const {error}=await emailAuth.signInWithOtp({email,options:{shouldCreateUser:true}});
      if (error) throw error;
      sentTo=email;resendAt=Date.now()+60000;render();
      document.getElementById('email-field')?.focus();
      emailStatus('验证码已发送。');
    } else {
      emailStatus('正在验证…');
      const {error}=await emailAuth.verifyOtp({email:sentTo,token:field.value.trim(),type:'email'});
      if (error) throw error;
      location.replace('/#journal');location.reload();
    }
  } catch(error) {
    if (error.status===429) emailStatus('尝试太频繁，请稍后再试。');
    else if (action==='logout') emailStatus('暂时无法退出，请重试。');
    else if (sentTo && action!=='resend') emailStatus('验证失败，请检查验证码或重新获取。');
    else emailStatus('邮件未能发送，请检查邮箱地址或稍后重试。');
  } finally {emailBusy=false;}
}

document.addEventListener('submit',event=>{
  if (event.target.id==='email-login') {event.preventDefault();emailAction('submit');}
});
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-email-action]');
  if (button) emailAction(button.dataset.emailAction);
});
