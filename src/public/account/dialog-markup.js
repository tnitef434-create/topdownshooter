// One account panel shared by the hub and Worldloom. Only static markup enters
// this template; account and world values are assigned with textContent.
export function mountAccountDialog() {
  const existing = document.getElementById('hub-account');
  if (existing) return existing;
  const template = document.createElement('template');
  template.innerHTML = `  <dialog id="hub-account" class="account-dialog" aria-labelledby="account-title" aria-describedby="account-intro">
    <button id="account-close" class="account-close" type="button" aria-label="Close account">×</button>
    <p class="account-brand"><img src="/hub/u-mark.svg" width="46" height="46" alt="Unpaused"></p>
    <h2 id="account-title">WELCOME BACK</h2>
    <p id="account-intro">Your games. Your friends. Your worlds.</p>
    <div class="account-body">
    <p id="account-message" class="account-message" role="status" aria-live="polite"></p>
    <div id="account-context" hidden></div>
    <div id="account-google-option" hidden>
      <div id="account-google" class="account-google"></div>
      <p class="account-auth-divider">or use your email</p>
    </div>
    <form class="hub-account-form">
      <label>Email<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com"></label>
      <label>Password<input name="password" type="password" autocomplete="current-password" required minlength="8" maxlength="128" placeholder="At least 8 characters"></label>
      <label hidden>Confirm password<input name="confirm" type="password" autocomplete="new-password" minlength="8" maxlength="128" disabled></label>
      <button class="account-primary" type="submit">SIGN IN</button>
    </form>
    <button id="account-forgot" class="account-text-button account-forgot" type="button">Forgot your password?</button>
    <button id="account-edit-email" class="account-text-button" type="button" hidden>Use a different email</button>
    <button id="account-switch" class="account-text-button" type="button">New here? Create an account</button>
    <div id="account-profile" hidden>
      <div class="account-tabs" role="tablist" aria-label="Account sections">
        <button id="tab-profile" role="tab" type="button" data-account-tab="profile" aria-controls="account-details" aria-selected="true">Account</button>
        <button id="tab-worlds" role="tab" type="button" data-account-tab="worlds" aria-controls="world-library" aria-selected="false">Worlds</button>
        <button id="tab-invites" role="tab" type="button" data-account-tab="invites" aria-controls="invitation-panel" aria-selected="false">Invites <span id="invite-tab-count"></span></button>
      </div>
      <div class="account-panels">
      <div id="account-details" role="tabpanel" aria-labelledby="tab-profile">
      <form id="account-username-form" class="hub-account-form account-username-form">
        <label>Your username<input name="username" id="account-username" autocomplete="username" required minlength="3" maxlength="15" pattern="[A-Za-z0-9_]{3,15}" placeholder="Choose your player name" aria-describedby="account-username-hint"></label>
        <p id="account-username-hint" class="account-hint">Your public name in both games. 3–15 letters, numbers or underscores.</p>
        <button class="account-primary" type="submit">SAVE USERNAME</button>
      </form>
      <p class="account-detail-label">EMAIL</p><p id="account-email" class="account-email"></p>
      <p id="account-verification-status" class="account-verification-status"></p>
      <button id="account-resend" class="account-primary" type="button" hidden>SEND VERIFICATION EMAIL</button>
      <div id="account-friend" class="account-friend" hidden>
        <p class="account-detail-label">YOUR FRIEND CODE</p>
        <strong id="account-friend-code" class="friend-code" hidden></strong>
        <button id="account-generate-code" class="account-primary" type="button">GENERATE MY CODE</button>
        <button id="account-copy-code" class="account-text-button" type="button" hidden>Copy code</button>
        <p class="account-hint">Four digits. Yours permanently. Generate once, share with friends.</p>
      </div>
      <div class="account-balance"><span>TacticStrike credits</span><strong id="account-credits">0</strong></div>
      <a id="account-return" class="account-primary" href="/tacticstrike/?shop=credits">TACTICSTRIKE CREDIT SHOP</a>
      </div>
      <section id="account-worlds" class="account-worlds" hidden aria-label="Worldloom worlds and invitations">
        <div id="world-library" role="tabpanel" aria-labelledby="tab-worlds" hidden>
        <div class="world-section-heading"><h3>Your worlds <span id="world-count">0 / 10</span></h3><button id="refresh-worlds" type="button" class="world-delete">Refresh</button></div>
        <div id="world-list" aria-live="polite"></div>
        <a class="account-primary" href="/worldloom/">CREATE A WORLD</a>
        <button id="import-local-world" class="account-text-button" type="button" hidden>Copy this browser’s saved world to my account</button>
        </div>
        <div id="invitation-panel" role="tabpanel" aria-labelledby="tab-invites" hidden>
        <div class="world-section-heading"><h3>Received invites <span id="invite-count">0</span></h3></div>
        <div id="received-invites" aria-live="polite"></div>
        </div>
      </section>
      </div>
      <button id="account-logout" class="account-text-button" type="button">Sign out</button>
    </div>
    </div>
  </dialog>`;
  const dialog = template.content.firstElementChild;
  document.body.append(dialog);
  return dialog;
}
