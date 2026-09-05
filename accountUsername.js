export function normalizeUsername(value) {
  const username=typeof value==='string'?value.trim():'';
  if(!/^[A-Za-z0-9_]{3,15}$/.test(username)) {
    const error=new Error('Use 3–15 letters, numbers or underscores for your username.');
    error.code='INVALID_USERNAME';
    throw error;
  }
  return username;
}

export function usernameTakenError() {
  return Object.assign(new Error('That username is taken. Try another.'),{code:'USERNAME_TAKEN'});
}

// Never publish the email-derived display names stored by older accounts.
export function accountPlayerName(user) {
  return user?.emailVerifiedAt && user?.username ? user.username : 'Guest';
}
