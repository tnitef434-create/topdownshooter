import { randomUUID } from 'node:crypto';
import { isAccountSessionActive } from './accountStore.js';
import { accountPlayerName } from './accountUsername.js';
import { isWorldMember, worldError } from './worldStore.js';
import { validVector, validCell, cellKey, personalSave, unpackEdits, worldSave } from './src/public/worldloom/src/shared-world.js';
import { WORLD_GENERATOR_VERSION, isSupportedWorldGeneratorVersion } from './src/public/worldloom/src/generator-version.js';

const uuid = value => typeof value==='string' && /^[0-9a-f-]{36}$/i.test(value);
const brief = (w,id) => ({id:w.id,name:w.name,mode:w.mode,owner:w.ownerId===id,ownerName:w.ownerName,guestName:w.guestName||null,accepted:w.accepted,createdAt:w.createdAt,updatedAt:w.updatedAt});
const publicPlayer = user => ({id:user.id,name:accountPlayerName(user)});
const replyError = error => ({error:true,status:error.status||503,message:error.status?error.message:'The world service could not save this change. Reconnecting…'});

export function installWorldServer({app,io,store,accounts,authenticate,verified,hashToken,rateLimit}) {
  const namespace=io.of('/worldloom'), rooms=new Map();
  app.get('/api/worldloom/status',(req,res)=>{res.setHeader('Cache-Control','no-store');res.json({available:store.isReady,persistent:store.isPersistent,protocol:1,maxPlayers:2,maxOwnedWorlds:10});});
  const route=handler=>async(req,res)=>{try{if(!store.isReady)throw worldError('World storage is starting.',503);await handler(req,res);}catch(error){res.status(error.status||500).json(replyError(error));}};
  app.use('/api/worlds',authenticate,verified,(req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});
  app.get('/api/worlds',route(async(req,res)=>{
    const worlds=(await store.list(req.account.id)).filter(w=>!w.deleted);
    res.json({worlds:worlds.filter(w=>isWorldMember(w,req.account.id)).map(w=>brief(w,req.account.id)),invites:worlds.filter(w=>w.guestId===req.account.id&&!w.accepted).map(w=>brief(w,req.account.id)),limit:10});
  }));
  app.post('/api/worlds',rateLimit,route(async(req,res)=>{
    const body=req.body||{}, name=String(body.name||'My Worldloom').trim().slice(0,40);
    if(!name||!Number.isInteger(body.seed)||!['builder','survival'].includes(body.mode))throw worldError('Choose a world name, seed and journey.');
    let guest=null;
    if(body.friendCode){if(!/^\d{4}$/.test(body.friendCode))throw worldError('Enter the four-digit friend code.');guest=await accounts.findUserByFriendCode(body.friendCode);if(!guest?.emailVerifiedAt||guest.id===req.account.id)throw worldError('Use a verified friend’s code, different from your own.');}
    const imported=body.importSave;
    if(imported&&(!isSupportedWorldGeneratorVersion(imported.generatorVersion??1)||imported.seed!==body.seed))throw worldError('This local save cannot be imported.');
    const edits=imported?unpackEdits(imported.world):{blocks:{},fluids:{}};
    if(Object.keys(edits.blocks).length>100_000)throw worldError('This save has too many edits to import.');
    const players={};if(imported)players[req.account.id]=personalSave(imported);
    const drops={};
    for(const drop of imported?.droppedItems||[]){
      if(Object.keys(drops).length>=256||!validVector(drop.position)||!Number.isInteger(drop.id)||drop.id<1||drop.id>4096||!Number.isInteger(drop.count)||drop.count<1||drop.count>99)throw worldError('The local save contains an invalid loose item.');
      const key=randomUUID();drops[key]={key,id:drop.id,count:drop.count,position:drop.position,velocity:validVector(drop.velocity,40)?drop.velocity:[0,0,0]};
    }
    const w=await store.create(req.account.id,{name,seed:body.seed,mode:body.mode,generatorVersion:imported?(imported.generatorVersion??1):WORLD_GENERATOR_VERSION,ownerName:publicPlayer(req.account).name,guestId:guest?.id||null,guestName:guest?publicPlayer(guest).name:null,accepted:false,...edits,players,drops,ecosystem:null,receipts:[],timeOfDay:imported?.timeOfDay??.31});
    res.status(201).json({world:brief(w,req.account.id)});
  }));
  app.post('/api/worlds/:id/join',route(async(req,res)=>{
    if(!uuid(req.params.id))throw worldError('World not found.',404);
    const w=await store.get(req.params.id);
    if(!w||w.deleted||!(isWorldMember(w,req.account.id)||w.guestId===req.account.id))throw worldError('This invite is not available.',404);
    if(w.guestId===req.account.id&&!w.accepted)await store.mutate(w.id,req.account.id,next=>{next.accepted=true;},{invited:true});
    res.json({url:`/worldloom/?world=${w.id}`});
  }));
  app.post('/api/worlds/:id/delete',route(async(req,res)=>{
    if(!uuid(req.params.id))throw worldError('World not found.',404);
    await store.remove(req.params.id,req.account.id);
    namespace.to(req.params.id).emit('closed',{message:'The owner deleted this world.'});
    namespace.in(req.params.id).disconnectSockets(true);rooms.delete(req.params.id);
    res.json({deleted:true});
  }));

  namespace.use(async(socket,next)=>{
    try {
      if(!store.isReady||!accounts.isReady)throw new Error('The world service is restarting. Reconnecting…');
      const token=socket.handshake.auth?.token,worldId=socket.handshake.auth?.worldId;
      if(typeof token!=='string'||token.length>128||!uuid(worldId))throw Object.assign(new Error('Sign in to open this world.'),{permanent:true});
      const session=await accounts.findSession(hashToken(token));
      const user=isAccountSessionActive(session)?await accounts.findUserById(session.userId):null;
      if(!user?.emailVerifiedAt)throw Object.assign(new Error('Your account session ended. Sign in to reopen this world.'),{permanent:true});
      const world=await store.get(worldId);
      if(!world||world.deleted||!isWorldMember(world,user.id))throw Object.assign(new Error('This world is no longer available to your account.'),{permanent:true});
      socket.data={user,worldId,sessionKey:hashToken(token),expiresAt:session.expiresAt};next();
    }catch(error){const response=new Error(error.permanent?error.message:'The world service is temporarily unavailable. Reconnecting…');response.data={permanent:Boolean(error.permanent)};next(response);}
  });
  function leader(room){return room.sockets.keys().next().value||null;}
  function announce(room){namespace.to(room.id).emit('members',{leader:leader(room),players:[...room.sockets.values()].map(s=>({...publicPlayer(s.data.user),pose:s.data.pose||null}))});}
  namespace.on('connection',socket=>{
    const {worldId,user}=socket.data;
    let room=rooms.get(worldId);
    if(!room){room={id:worldId,sockets:new Map()};rooms.set(worldId,room);}
    // One live connection per account avoids fighting inventories in two tabs.
    const old=room.sockets.get(user.id);
    if(old){old.emit('closed',{message:'This world was opened in another tab.'});old.disconnect(true);}
    room.sockets.set(user.id,socket);socket.join(worldId);announce(room);
    socket.on('snapshot',async(_,ack)=>{
      if(typeof ack!=='function')return;
      try{const w=await store.get(worldId);if(!w||w.deleted)throw worldError('World unavailable.',404);ack({world:w.id,revision:w.revision,save:worldSave(w,user.id),blocks:w.blocks,fluids:w.fluids,drops:w.drops,ecosystem:w.ecosystem,leader:leader(room),you:publicPlayer(user),players:[...room.sockets.values()].map(s=>({...publicPlayer(s.data.user),pose:s.data.pose||null}))});}catch(e){ack(replyError(e));}
    });
    socket.on('pose',pose=>{
      const now=Date.now();
      if(now-(socket.data.lastPoseAt||0)<40||!validVector(pose?.position)||!validVector(pose.velocity,100)||!Number.isFinite(pose.yaw)||!Number.isFinite(pose.pitch))return;
      socket.data.lastPoseAt=now;
      const clean={position:pose.position,velocity:pose.velocity,yaw:pose.yaw,pitch:Math.max(-1.6,Math.min(1.6,pose.pitch)),grounded:Boolean(pose.grounded),swimming:Boolean(pose.swimming),crouching:Boolean(pose.crouching),action:Boolean(pose.action),headlamp:pose.headlamp!==false,held:Number.isInteger(pose.held)?pose.held:0};
      socket.data.pose=clean;socket.to(worldId).volatile.emit('pose',{id:user.id,pose:clean});
    });
    socket.on('commit',async(message,ack)=>{
      if(typeof ack!=='function')return;
      try{
        if(socket.data.pending)throw worldError('Wait for the previous save.',429);
        if(!message||!uuid(message.id)||!Array.isArray(message.edits)||message.edits.length>512||!Array.isArray(message.dropAdds)||message.dropAdds.length>32)throw worldError('Invalid world change.');
        if(message.edits.some(e=>!validCell(e)||!Number.isInteger(e.before)||e.before<0||e.before>255))throw worldError('Invalid block change.');
        const state=message.personal?personalSave(message.personal):null;
        const simulation=user.id===leader(room);
        const decoration=e=>e.decoration&&(e.id===33||(e.before===33&&e.id===0));
        if(message.edits.some(e=>e.simulation&&!simulation&&!decoration(e)))throw worldError('World simulation moved to the other player.',409);
        socket.data.pending=true;
        const {world:w,result}=await store.mutate(worldId,user.id,w=>{
          if(w.deleted)throw worldError('World deleted.',404);
          const receipt=w.receipts.find(r=>r.id===message.id&&r.user===user.id);if(receipt)return {...receipt,duplicate:true};
          for(const e of message.edits){const key=cellKey(e.x,e.y,e.z);if(Object.hasOwn(w.blocks,key)&&w.blocks[key]!==e.before&&!(decoration(e)&&w.blocks[key]===e.id))throw worldError('A block changed before this action arrived. Reconnecting to the saved world.',409);w.blocks[key]=e.id;if(Number.isInteger(e.level)&&e.level>=0&&e.level<=7)w.fluids[key]=e.level;else delete w.fluids[key];}
          if(Object.keys(w.blocks).length>100_000)throw worldError('World edit capacity reached.',409);
          if(state)w.players[user.id]=state;
          for(const drop of message.dropAdds){if(!uuid(drop.key)||!validVector(drop.position)||!Number.isInteger(drop.id)||drop.id<1||drop.id>4096||!Number.isInteger(drop.count)||drop.count<1||drop.count>99)throw worldError('Invalid dropped item.');if(Object.keys(w.drops).length>=256)throw worldError('Pick up some loose items first.',409);w.drops[drop.key]={key:drop.key,id:drop.id,count:drop.count,position:drop.position,velocity:validVector(drop.velocity,40)?drop.velocity:[0,0,0]};}
          if(simulation&&Number.isFinite(message.timeOfDay))w.timeOfDay=((message.timeOfDay%1)+1)%1;
          if(simulation&&room.ecosystem){
            w.ecosystem=room.ecosystem;
            for(const drop of room.ecosystem.drops||[])if(w.drops[drop.key]&&validVector(drop.position)&&validVector(drop.velocity,40)){w.drops[drop.key].position=drop.position;w.drops[drop.key].velocity=drop.velocity;}
          }
          const receiptResult={id:message.id,user:user.id};w.receipts.push(receiptResult);w.receipts=w.receipts.slice(-256);return receiptResult;
        });
        if(!result.duplicate)namespace.to(worldId).emit('changes',{revision:w.revision,id:message.id,actor:user.id,edits:message.edits,dropAdds:message.dropAdds});
        ack({ok:true,revision:w.revision});
      }catch(e){ack(replyError(e));}finally{socket.data.pending=false;}
    });
    socket.on('pickup',async(message,ack)=>{
      if(typeof ack!=='function')return;
      try{
        const {world:w,result}=await store.mutate(worldId,user.id,w=>{
          const drop=w.drops[message?.key],personal=w.players[user.id];
          const liveDrop=room.ecosystem?.drops?.find(d=>d.key===message?.key),position=liveDrop&&validVector(liveDrop.position)?liveDrop.position:drop?.position;
          if(!drop||!personal?.inventory||!socket.data.pose||Math.hypot(...position.map((n,i)=>n-socket.data.pose.position[i]))>4)throw worldError('That item is no longer available.',409);
          let remaining=drop.count;const slots=personal.inventory.slots;
          for(const slot of slots)if(slot.id===drop.id&&slot.count<99){const n=Math.min(remaining,99-slot.count);slot.count+=n;remaining-=n;}
          for(const slot of slots)if(!slot.id&&!slot.count&&remaining){slot.id=drop.id;slot.count=remaining;remaining=0;}
          if(remaining===drop.count)throw worldError('Your inventory is full.',409);
          if(remaining)drop.count=remaining;else delete w.drops[message.key];
          return {inventory:personal.inventory,remaining};
        });
        namespace.to(worldId).emit('drop-removed',{key:message.key,remaining:result.remaining,revision:w.revision});ack({ok:true,...result});
      }catch(e){ack(replyError(e));}
    });
    socket.on('ecology',data=>{
      if(user.id!==leader(room)||!data||!Array.isArray(data.pigs)||data.pigs.length>12||!Array.isArray(data.drops)||data.drops.length>256||JSON.stringify(data).length>75_000)return;
      const now=Date.now();if(now-(socket.data.ecologyAt||0)<90)return;socket.data.ecologyAt=now;
      room.ecosystem=data;socket.to(worldId).volatile.emit('ecology',data);
    });
    socket.on('pig-attack',data=>{
      if(!validVector(data?.origin)||!validVector(data.direction,1)||!Number.isFinite(data.damage))return;
      if(!socket.data.pose||Math.hypot(...data.origin.map((v,i)=>v-socket.data.pose.position[i]))>3)return;
      if(Date.now()-(socket.data.attackAt||0)<380)return;socket.data.attackAt=Date.now();
      data={origin:data.origin,direction:data.direction,damage:Math.max(.5,Math.min(8,data.damage)),reach:Math.min(4.75,Math.max(0,Number(data.reach)||4)),recovery:Math.max(.38,Math.min(1.2,Number(data.recovery)||.6))};
      const primary=room.sockets.get(leader(room));if(primary)primary.emit('pig-attack',{...data,from:user.id});
    });
    socket.on('disconnect',()=>{
      if(room.sockets.get(user.id)!==socket)return;
      room.sockets.delete(user.id);announce(room);
      if(room.ecosystem){const ecology=room.ecosystem;store.mutate(worldId,user.id,w=>{w.ecosystem=ecology;}).catch(()=>{});namespace.to(worldId).emit('ecology',ecology);}
      if(!room.sockets.size)rooms.delete(worldId);
    });
  });
  const sessionCheck=setInterval(async()=>{
    for(const room of rooms.values())for(const socket of room.sockets.values()){
      try{const session=await accounts.findSession(socket.data.sessionKey);if(!isAccountSessionActive(session))socket.disconnect(true);}catch{socket.disconnect(true);}
    }
  },60_000);sessionCheck.unref();
  return {close(){clearInterval(sessionCheck);namespace.disconnectSockets(true);},rooms};
}
