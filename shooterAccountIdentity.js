import {isAccountSessionActive} from './accountStore.js';
import {accountPlayerName} from './accountUsername.js';

export function installShooterAccountIdentity(io,{accounts,hashToken}) {
  async function nameForToken(token) {
    if(!token)return 'Guest';
    if(typeof token!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(token))return 'Guest';
    const session=await accounts.findSession(hashToken(token));
    if(!isAccountSessionActive(session))return 'Guest';
    return accountPlayerName(await accounts.findUserById(session.userId));
  }
  io.use(async(socket,next)=>{
    try {
      socket.data.accountToken=socket.handshake.auth?.accountToken||null;
      socket.data.accountName=await nameForToken(socket.data.accountToken);
      next();
    } catch {next(new Error('Account connection is temporarily unavailable.'));}
  });
  const names=new Set(['create-room','join-room','auto-match','change-name','sync-device','chat-message']);
  io.on('connection',socket=>{
    socket.emit('account-name',{name:socket.data.accountName});
    let queue=Promise.resolve();
    socket.use((packet,next)=>{
      if(!names.has(packet[0])&&packet[0]!=='account-session')return next();
      queue=queue.then(async()=>{
        const payload=packet[1];
        if(!payload||typeof payload!=='object'||Array.isArray(payload))throw new Error('Invalid player details.');
        const token=packet[0]==='account-session'?payload.token:socket.data.accountToken;
        const name=await nameForToken(token);
        socket.data.accountToken=token;socket.data.accountName=name;
        payload.name=name;payload.playerName=name;
        next();
      }).catch(()=>{socket.emit('account-name-error',{message:'Account connection is unavailable. Please retry.'});});
    });
  });
}
