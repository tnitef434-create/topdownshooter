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
      <div class="player-card">
        <span id="player-avatar" class="player-avatar" aria-hidden="true"></span>
        <div class="player-meta"><strong id="player-name" class="player-name"></strong><p id="account-email" class="account-email"></p></div>
        <span id="account-verification-status" class="account-verification-status"></span>
      </div>
      <ol id="account-setup" class="setup-steps" aria-label="Finish setting up your account">
        <li data-step="verify"><span class="step-dot"></span><div><b>Verify your email</b><small>Unlocks online play, saved worlds and credits.</small></div><button id="account-resend" class="step-action" type="button">Resend email</button></li>
        <li data-step="username"><span class="step-dot"></span><div><b>Choose a username</b><small>Your name in every Unpaused game.</small></div><button class="step-action" type="button" data-goto="username">Choose</button></li>
        <li data-step="friend"><span class="step-dot"></span><div><b>Get your friend code</b><small>Friends use it to invite you into their Worldloom world.</small></div><button class="step-action" type="button" data-goto="friend">Get code</button></li>
      </ol>
      <div class="account-tabs" role="tablist" aria-label="Account sections">
        <button id="tab-profile" role="tab" type="button" data-account-tab="profile" aria-controls="account-details" aria-selected="true">Profile</button>
        <button id="tab-worlds" role="tab" type="button" data-account-tab="worlds" aria-controls="world-library" aria-selected="false">Worldloom <span id="invite-tab-count"></span></button>
        <button id="tab-tacticstrike" role="tab" type="button" data-account-tab="tacticstrike" aria-controls="tacticstrike-panel" aria-selected="false">TacticStrike</button>
        <button id="tab-aurora" role="tab" type="button" data-account-tab="aurora" aria-controls="aurora-panel" aria-selected="false">Aurora</button>
      </div>
      <p id="account-tab-lock" class="account-tab-lock" hidden></p>
      <div class="account-panels">
      <div id="account-details" role="tabpanel" aria-labelledby="tab-profile">
      <form id="account-username-form" class="hub-account-form account-username-form">
        <label>Username<input name="username" id="account-username" autocomplete="username" required minlength="3" maxlength="15" pattern="[A-Za-z0-9_]{3,15}" placeholder="Choose your player name" aria-describedby="account-username-hint"></label>
        <p id="account-username-hint" class="account-hint">Shown in Worldloom and as your TacticStrike operative. 3–15 letters, numbers or underscores.</p>
        <button class="account-primary" type="submit">SAVE USERNAME</button>
      </form>
      <div id="account-friend" class="account-friend" hidden>
        <p class="account-detail-label">YOUR FRIEND CODE</p>
        <strong id="account-friend-code" class="friend-code" hidden></strong>
        <button id="account-generate-code" class="account-primary" type="button">GENERATE MY CODE</button>
        <button id="account-copy-code" class="account-text-button" type="button" hidden>Copy code</button>
        <p class="account-hint">Four digits, yours for good. Share it and a friend can invite you into one of their Worldloom worlds.</p>
      </div>
      </div>
      <section id="account-worlds" class="account-worlds" hidden aria-label="Worldloom worlds and invitations">
        <div id="world-library" role="tabpanel" aria-labelledby="tab-worlds" hidden>
        <div id="invitation-panel" class="invite-block" hidden>
          <div class="world-section-heading"><h3>Invites for you <span id="invite-count">0</span></h3></div>
          <div id="received-invites" aria-live="polite"></div>
        </div>
        <div class="world-section-heading"><h3>Your worlds <span id="world-count">0 / 10</span></h3><button id="refresh-worlds" type="button" class="world-delete">Refresh</button></div>
        <div id="world-list" aria-live="polite"></div>
        <a class="account-primary" href="/worldloom/">CREATE A WORLD</a>
        <button id="import-local-world" class="account-text-button" type="button" hidden>Copy this browser’s saved world to my account</button>
        <p class="account-hint">Account worlds hold up to 10 saves and can be shared with one friend. Your friend code is on the Profile tab.</p>
        </div>
      </section>
      <div id="tacticstrike-panel" class="game-panel" role="tabpanel" aria-labelledby="tab-tacticstrike" hidden>
        <div class="game-stat"><span>Operative name</span><strong id="ts-operative"></strong></div>
        <div class="account-balance"><span>Credits</span><strong id="account-credits">0</strong></div>
        <a id="account-return" class="account-primary" href="/tacticstrike/?shop=credits">OPEN THE CREDIT SHOP</a>
        <a class="account-text-button game-play-link" href="/tacticstrike/">Play TacticStrike →</a>
        <p class="account-hint">Credits and purchases belong to this account. Matches are live sessions, so there is nothing to save between them.</p>
      </div>
      <div id="aurora-panel" class="game-panel" role="tabpanel" aria-labelledby="tab-aurora" hidden>
        <div class="aurora-stats">
          <div class="game-stat"><span>Levels cleared</span><strong id="aurora-cleared">0</strong></div>
          <div class="game-stat"><span>Gold medals</span><strong id="aurora-gold">0</strong></div>
          <div class="game-stat"><span>Relics found</span><strong id="aurora-relics">0</strong></div>
        </div>
        <a class="account-primary" href="/aurora/">PLAY AURORA</a>
        <p class="account-hint">Aurora progress is saved in this browser, so it works without an account and stays on this device.</p>
      </div>
      </div>
      <button id="account-logout" class="account-text-button" type="button">Sign out</button>
    </div>
    <a class="account-privacy" href="/privacy/" target="_blank" rel="noopener">Privacy</a>
    </div>
  </dialog>`;
  const dialog = template.content.firstElementChild;
  document.body.append(dialog);
  return dialog;
}
