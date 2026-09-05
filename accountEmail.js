import fs from 'node:fs/promises';

export function createAccountMailer({env=process.env, fetchImpl=fetch}={}) {
  const production=env.NODE_ENV==='production'||env.RENDER==='true';
  const outbox=!production&&env.NODE_ENV==='test'?env.TEST_EMAIL_OUTBOX:'';
  const apiKey=env.RESEND_API_KEY||'';
  const from=env.ACCOUNT_EMAIL_FROM||'Unpaused <accounts@unpaused.online>';
  const origin=env.ACCOUNT_SITE_URL||'https://unpaused.online';
  const url=new URL(origin);
  if (url.protocol!=='https:' && (production||!['localhost','127.0.0.1'].includes(url.hostname))) throw new Error('ACCOUNT_SITE_URL must use HTTPS.');
  return {
    configured:Boolean(outbox||apiKey),
    async sendVerification(email, token) {
      const link=new URL('/?account=verify',url);
      // Fragments never reach HTTP access logs or referrer headers.
      link.hash=new URLSearchParams({verify:token}).toString();
      const text=`Verify your Unpaused email\n\nOpen this link and choose your account password to activate your account:\n${link.href}\n\nThis link expires in 30 minutes and can be used once. If you did not request this, ignore this email.\n\nUnpaused`;
      const escaped=link.href.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
      const payload={from,to:[email],subject:'Verify your Unpaused email',text,html:`<div style="background:#090909;color:#f4f6ed;padding:36px;font:16px Arial,sans-serif;max-width:520px"><img src="https://unpaused.online/hub/unpaused-email-mark.png" width="64" height="64" alt="Unpaused" style="display:block;margin-bottom:28px;border:0"><h2>Make it official.</h2><p>Verify your email to activate your account and get your permanent friend code.</p><p style="margin:30px 0"><a href="${escaped}" style="background:#e95128;color:#140802;padding:16px 22px;text-decoration:none;font-weight:bold">VERIFY EMAIL</a></p><p>Choose your account password when the page opens.</p><p style="font-size:13px;color:#b9aaa1">This link expires in 30 minutes and works once. Didn’t request this? You can safely ignore it.</p></div>`};
      if (outbox) {await fs.appendFile(outbox,JSON.stringify({to:email,link:link.href})+'\n','utf8');return;}
      if (!apiKey) throw Object.assign(new Error('Email delivery is not configured.'),{code:'EMAIL_UNAVAILABLE'});
      const response=await fetchImpl('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
      if (!response.ok) throw Object.assign(new Error('Verification email could not be sent. Please try again later.'),{code:'EMAIL_DELIVERY_FAILED',status:response.status});
    }
  };
}
