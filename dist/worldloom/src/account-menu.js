import { readAccountSession } from '../../account-client.js';

const invite = document.querySelector('.world-invite');
const summary = invite.querySelector('summary');
const fields = document.querySelector('#world-invite-fields');
const code = document.querySelector('#invite-code');
const worldsButton = document.querySelector('#world-account-button');
const localChoice = document.querySelector('#world-local-save-choice');
const localSave = document.querySelector('#world-local-save');
const home = document.createComment('Invite fields return here when the account closes.');
fields.before(home);
let accountPromise;
let opening = false;
let opener;

function updateHint() {
  const signedIn = Boolean(readAccountSession().token);
  if (navigator.onLine === false && localSave) localSave.checked = true;
  if (localChoice) localChoice.hidden = !signedIn;
  const local = !signedIn || Boolean(localSave?.checked);
  const hint = document.querySelector('#world-save-hint');
  if (hint) hint.textContent = local
    ? 'Local world · one save in this browser. Account worlds stay separate; invites are not sent.'
    : 'Saved to your account · up to 10 worlds · 2 players · internet required';
  const create = document.querySelector('#new-world-button');
  if (create) create.textContent = local ? 'Weave a local world' : 'Weave a new world';
  summary.setAttribute('aria-disabled', `${signedIn && Boolean(localSave?.checked)}`);
  if (local) invite.removeAttribute('open');
}

async function account() {
  if (!accountPromise) {
    accountPromise = import('../../account/dialog-controller.js').then(({initHubAccount}) => {
      const panel = initHubAccount({autoOpen:false,onSessionChange:updateHint});
      panel.dialog.addEventListener('close', () => {
        home.after(fields);
        panel.dialog.querySelector('#account-context').replaceChildren();
        panel.dialog.querySelector('#account-context').hidden = true;
        summary.querySelector('span').textContent = /^\d{4}$/.test(code.value.trim())
          ? `code ${code.value.trim()} · max 1` : 'optional · max 1';
        updateHint();
        opener?.focus();
      });
      // Already in the world-creation menu: this action should close the panel,
      // preserving the user's draft instead of reloading Worldloom.
      panel.dialog.querySelector('a[href="/worldloom/"]').addEventListener('click', event => {
        event.preventDefault();
        opener = document.querySelector('#world-name');
        panel.close();
        opener.focus();
      });
      return panel;
    }).catch(error => { accountPromise = null; throw error; });
  }
  return accountPromise;
}

async function openAccount(trigger, inviteDraft) {
  if (opening) return;
  opening = true;
  opener = trigger;
  trigger.setAttribute('aria-busy', 'true');
  document.querySelector('#world-account-error')?.remove();
  try {
    const panel = await account();
    const context = panel.dialog.querySelector('#account-context');
    if (inviteDraft) {
      const heading = document.createElement('h3');
      heading.textContent = 'Invite a player';
      const apply = document.createElement('button');
      apply.type = 'button';
      apply.className = 'account-primary';
      apply.textContent = 'USE FRIEND CODE';
      apply.addEventListener('click', () => {
        code.value = code.value.trim();
        code.setCustomValidity(code.value && !/^\d{4}$/.test(code.value) ? 'Enter a four-digit friend code, or leave it empty to play alone.' : '');
        if (code.reportValidity()) panel.close();
      });
      context.replaceChildren(heading, fields, apply);
      context.hidden = false;
    }
    panel.open({tab:inviteDraft?'invites':'worlds'});
    if (inviteDraft) code.focus();
  } catch {
    const error = document.createElement('p');
    error.id = 'world-account-error';
    error.className = 'world-save-hint';
    error.setAttribute('role','alert');
    error.textContent = 'Your account could not open. Check your connection and try again; your world details are still here.';
    worldsButton.after(error);
  } finally {
    opening = false;
    trigger.removeAttribute('aria-busy');
  }
}

code.addEventListener('input', () => code.setCustomValidity(''));
summary.addEventListener('click', event => {
  event.preventDefault();
  if (readAccountSession().token && localSave?.checked) {
    document.querySelector('#world-save-hint').textContent = 'Invites need an account world and an internet connection. Local worlds are solo.';
    return;
  }
  openAccount(summary, true);
});
worldsButton.addEventListener('click', () => openAccount(worldsButton, false));
window.addEventListener('storage', updateHint);
window.addEventListener('offline', updateHint);
window.addEventListener('online', updateHint);
localSave?.addEventListener('change', updateHint);
updateHint();
