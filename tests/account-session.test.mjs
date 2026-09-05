import test from 'node:test';
import assert from 'node:assert/strict';
import {ACCOUNT_SESSION_KEY as tokenKey,ACCOUNT_USER_CACHE_KEY as userKey,readAccountSession,storeAccountSession} from '../src/account-session.js';

function storage(entries=[]) {
  const data=new Map(entries);let writes=0;
  globalThis.localStorage={getItem:key=>data.get(key)??null,setItem:(key,value)=>{writes++;data.set(key,value);},removeItem:key=>data.delete(key)};
  return {data,writes:()=>writes};
}
test('old account keys restore existing users and a damaged cache retains the token for server validation',()=>{
  storage([[tokenKey,'existing-token'],[userKey,JSON.stringify({email:'qa@example.invalid'})]]);
  assert.equal(readAccountSession().user.email,'qa@example.invalid');
  localStorage.setItem(userKey,'{invalid');
  assert.deepEqual(readAccountSession(),{token:'existing-token',user:null});
});
test('a cached profile without a token is never treated as signed in',()=>{
  storage([[userKey,JSON.stringify({email:'qa@example.invalid'})]]);
  assert.deepEqual(readAccountSession(),{token:null,user:null});
});
test('re-saving an unchanged session does not start cross-tab storage feedback',()=>{
  const session={token:'existing-token',user:{email:'qa@example.invalid'}};
  const mock=storage([[tokenKey,session.token],[userKey,JSON.stringify(session.user)]]);
  storeAccountSession(session);assert.equal(mock.writes(),0);
});
test('a partial storage failure restores the previous token and profile together',()=>{
  const previous={token:'old-token',user:{email:'old@example.invalid'}};
  storage([[tokenKey,previous.token],[userKey,JSON.stringify(previous.user)]]);
  const set=localStorage.setItem;
  localStorage.setItem=(key,value)=>{
    if(key===userKey&&value.includes('new@example.invalid'))throw new DOMException('full','QuotaExceededError');
    set(key,value);
  };
  assert.throws(()=>storeAccountSession({token:'new-token',user:{email:'new@example.invalid'}}));
  assert.deepEqual(readAccountSession(),previous);
});
