import { io } from '../vendor/socket.io.esm.min.js';
import * as THREE from '../vendor/three.module.min.js';
import { readAccountSession, getBackendUrl, accountRequest } from '../../account-client.js';
import { PlayerAvatar } from './player-avatar.js';
import { createDroppedItemModel, disposeItemModel } from './viewmodel.js';
import { characterMesh,characterMaterial } from './character-rig.js';
import { getItem } from './data.js';

const angleLerp=(a,b,t)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*t;

class RemotePlayer {
  constructor(scene,account,atlas) {
    this.id=account.id;this.avatar=new PlayerAvatar(scene);this.frames=[];this.atlas=atlas;this.heldId=-1;
    this.armGeometry=this.avatar.rightArm.geometry;this.armMaterial=this.avatar.rightArm.material;
    this.avatar.root.traverse(o=>o.layers.set(0));
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;
    const ctx=canvas.getContext('2d');ctx.font='bold 36px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
    const width=Math.min(496,ctx.measureText(account.name).width+38);
    ctx.fillStyle='rgba(7,7,7,.75)';ctx.fillRect((512-width)/2,14,width,68);ctx.fillStyle='#fff';ctx.fillText(account.name,256,48,468);
    this.texture=new THREE.CanvasTexture(canvas);this.texture.colorSpace=THREE.SRGBColorSpace;
    this.label=new THREE.Sprite(new THREE.SpriteMaterial({map:this.texture,transparent:true,depthTest:true,depthWrite:false}));
    this.label.scale.set(2.65,.50,1);this.label.position.y=2.18;this.avatar.root.add(this.label);
    this.actor={position:new THREE.Vector3(),velocity:new THREE.Vector3(),yaw:0,grounded:true};
    if(account.pose)this.receive(account.pose);
  }
  receive(pose){this.frames.push({...pose,at:performance.now()});if(this.frames.length>30)this.frames.shift();}
  update(dt){
    const time=performance.now()-110;
    while(this.frames.length>2&&this.frames[1].at<time)this.frames.shift();
    const a=this.frames[0],b=this.frames[1]||a;if(!a)return;
    const t=b.at>a.at?THREE.MathUtils.clamp((time-a.at)/(b.at-a.at),0,1):1;
    this.actor.position.fromArray(a.position).lerp(new THREE.Vector3().fromArray(b.position),t);
    this.actor.velocity.fromArray(b.velocity);this.actor.yaw=angleLerp(a.yaw,b.yaw,t);this.actor.grounded=b.grounded;
    this.avatar.update(dt,this.actor,{crouching:b.crouching},{action:b.action});
    this.avatar.head.rotation.x=b.pitch;
    this.avatar.headlamp.visible=b.headlamp;
    if(b.swimming){this.avatar.leftLeg.rotation.x=Math.sin(performance.now()*.006)*.24;this.avatar.rightLeg.rotation.x=-this.avatar.leftLeg.rotation.x;this.avatar.leftArm.rotation.x=.8;this.avatar.rightArm.rotation.x=.8;}
    if(b.held!==this.heldId){
      if(this.held){this.avatar.rightArm.remove(this.held);disposeItemModel(this.held);}
      if(this.assembly){this.assembly.geometry.dispose();this.assembly.material.dispose();this.assembly=null;this.avatar.rightArm.geometry=this.armGeometry;this.avatar.rightArm.material=this.armMaterial;}
      this.held=null;this.heldId=b.held;
      if(b.held){try{
        const item=getItem(b.held);
        if(item.tool==='pickaxe'){
          const tier=/copper/i.test(item.name)?'copper':/stone/i.test(item.name)?'stone':'crude';
          this.assembly=characterMesh(`held_${tier}_pick`,characterMaterial());this.avatar.rightArm.geometry=this.assembly.geometry;this.avatar.rightArm.material=this.assembly.material;
        }else{this.held=createDroppedItemModel(b.held,this.atlas);this.held.scale.setScalar(.7);this.held.position.set(0,-.68,-.12);this.held.rotation.set(.3,0,.15);this.avatar.rightArm.add(this.held);}
      }catch{/* Invalid or obsolete item: show an empty hand. */}}
    }
    if(b.held&&!b.action)this.avatar.rightArm.rotation.x+=.24;
    this.label.visible=true;
  }
  dispose(){if(this.held){this.avatar.rightArm.remove(this.held);disposeItemModel(this.held);}if(this.assembly){this.assembly.geometry.dispose();this.assembly.material.dispose();this.avatar.rightArm.geometry=this.armGeometry;this.avatar.rightArm.material=this.armMaterial;}this.avatar.root.remove(this.label);this.texture.dispose();this.label.material.dispose();this.avatar.dispose();}
}

export class SharedWorldClient {
  constructor(worldId,{scene,atlas,onLoad,onResume,onStatus,onClosed,getSnapshot,onInventory,onDrop,onDropRemoved,onEcology,onAttack}) {
    Object.assign(this,{worldId,scene,atlas,onLoad,onResume,onStatus,onClosed,getSnapshot,onInventory,onDrop,onDropRemoved,onEcology,onAttack});
    this.ready=false;this.applying=false;this.edits=[];this.dropAdds=[];this.remotes=new Map();this.events=[];this.you=null;this.busy=null;this.pending=null;this.stopped=false;this.revision=0;
    const {token}=readAccountSession();
    this.sessionChanged=()=>{if(readAccountSession().token!==token){this.dispose();this.onClosed('Your account changed. Sign in again to reopen this world.');}};
    window.addEventListener('storage',this.sessionChanged);
    this.socket=io(`${getBackendUrl()}/worldloom`,{auth:{token,worldId},autoConnect:false,reconnection:true,reconnectionDelay:1000,reconnectionDelayMax:6000,timeout:60_000});
    this.socket.on('connect',()=>this.load());
    this.socket.on('disconnect',()=>{if(!this.stopped){this.freeze('Connection interrupted · game paused. Reconnecting…');this.retry();}});
    this.socket.on('connect_error',error=>{
      if(error.data?.permanent){this.dispose();this.onClosed(error.message);return;}
      this.freeze('Connection interrupted · game paused. Reconnecting…');this.retry();
    });
    this.socket.on('closed',data=>{this.dispose();this.onClosed(data.message);});
    this.socket.on('members',data=>{this.leader=data.leader;this.members=data.players;this.setMembers(data.players);});
    this.socket.on('pose',({id,pose})=>{if(this.ready)this.remotes.get(id)?.receive(pose);});
    this.socket.on('changes',change=>{if(!this.ready)this.events.push(change);else this.applyChanges(change);});
    this.socket.on('drop-removed',data=>{if(this.ready)this.onDropRemoved(data);});
    this.discoveryEvents=[];
    this.socket.on('discovery-looted',data=>{
      if(this.ready&&this.world)this.world.discoveryLoot[data.key]=data.remaining;
      else this.discoveryEvents.push(data);
    });
    this.socket.on('ecology',data=>{this.ecology=data;if(this.ready&&!this.isLeader)this.onEcology(data);});
    this.socket.on('pig-attack',data=>{if(this.ready&&this.isLeader)this.onAttack(data);});
    this.online=()=>{if(!this.stopped&&!this.ready){clearTimeout(this.retryTimer);this.socket.connected?this.load():this.socket.connect();}};
    this.offline=()=>{if(!this.stopped){this.freeze('Connection interrupted · game paused. Reconnecting…');this.socket.disconnect();this.retry();}};
    window.addEventListener('online',this.online);
    window.addEventListener('offline',this.offline);
    this.socket.connect();
    this.timer=setInterval(()=>{if(this.ready&&!this.exiting&&!this.busy&&!this.picking)this.flush(false).catch(()=>{});},160);
    this.heartbeat=setInterval(()=>{if(this.ready&&!this.exiting&&!this.picking){this.dirtyPersonal=true;this.flush(false).catch(()=>{});}},4000);
    this.visibility=()=>{
      if(this.stopped)return;
      if(this.socket.connected)this.socket.emit('presence',{active:!document.hidden});
      if(!document.hidden){
        if(!this.ready)this.online();
        else this.onStatus('');
      }
    };
    document.addEventListener('visibilitychange',this.visibility);
    this.socket.on('connect',this.visibility);
  }
  get isLeader(){return this.you?.id===this.leader;}
  freeze(message){
    if(this.stopped)return;
    // A lost pickup/loot acknowledgement may already have changed inventory on
    // the server. Never replay the old client inventory over that transaction.
    if(this.authoritativeInventoryPending)this.frozenSave=null;
    else if(this.ready&&!this.frozenSave)this.frozenSave=structuredClone(this.getSnapshot());
    this.ready=false;this.onStatus(message);
  }
  retry(){
    clearTimeout(this.retryTimer);
    if(this.stopped||navigator.onLine===false)return;
    this.retryTimer=setTimeout(()=>{if(this.stopped||this.ready)return;if(this.socket.connected)this.load();else this.socket.connect();},2500);
  }
  request(event,payload){
    return new Promise((resolve,reject)=>{
      if(!this.socket.connected){reject(Object.assign(new Error('Connection interrupted.'),{retryable:true}));return;}
      let done=false;
      const finish=(error,response)=>{if(done)return;done=true;this.socket.off('disconnect',disconnected);error?reject(error):resolve(response);};
      const disconnected=()=>finish(Object.assign(new Error('Connection interrupted.'),{retryable:true}));
      this.socket.once('disconnect',disconnected);
      this.socket.timeout(20000).emit(event,payload,(error,response)=>{
        if(error)finish(Object.assign(new Error('Connection timed out.'),{retryable:true}));
        else if(response?.error)finish(Object.assign(new Error(response.message),{status:response.status,retryable:!response.status||response.status>=500}));
        else finish(null,response);
      });
    });
  }
  async load(){
    if(this.loading||this.stopped)return;this.loading=true;this.ready=false;this.onStatus(this.world?'Connection restored · syncing your world…':'Opening your saved world…');
    try{
      if(this.busy)await this.busy.catch(()=>{});
      let conflict=false;
      if(this.pending){
        try{await this.request('commit',this.pending);}
        catch(error){if(error.retryable)throw error;conflict=true;}
        this.pending=null;
      }
      if(conflict){this.edits=[];this.dropAdds=[];this.frozenSave=null;}
      if(this.frozenSave){
        do {
          this.pending=this.makePacket(this.frozenSave);
          try{await this.request('commit',this.pending);}
          catch(error){if(error.retryable)throw error;this.edits=[];this.dropAdds=[];}
          this.pending=null;
        }while(this.edits.length||this.dropAdds.length);
        this.frozenSave=null;
      }
      this.events=[];this.discoveryEvents=[];
      const snapshot=await this.request('snapshot',{});if(this.stopped)return;
      this.you=snapshot.you;this.leader=snapshot.leader;this.revision=snapshot.revision;
      this.edits=[];this.dropAdds=[];
      if(this.world&&this.onResume)await this.onResume(snapshot);
      else await this.onLoad(snapshot);
      if(this.stopped||!this.socket.connected)return;
      this.setMembers(this.members||snapshot.players);this.ecology=snapshot.ecosystem;
      for(const p of snapshot.players){const remote=this.remotes.get(p.id);if(remote){remote.frames=[];if(p.pose)remote.receive(p.pose);}}
      if(this.ecology)this.onEcology(this.ecology);
      for(const drop of Object.values(snapshot.drops||{}))this.onDrop(drop);
      for(const event of this.events)if(event.revision>snapshot.revision)this.applyChanges(event);
      for(const event of this.discoveryEvents)if(event.revision>snapshot.revision&&this.world)this.world.discoveryLoot[event.key]=event.remaining;
      this.discoveryEvents=[];
      this.events=[];this.authoritativeInventoryPending=false;this.ready=true;this.onStatus('');this.dirtyPersonal=true;clearTimeout(this.retryTimer);
    }catch(error){if(!this.stopped)this.freeze('Game paused · waiting for the connection to recover…');}
    finally{this.loading=false;if(!this.ready&&!this.stopped)this.retry();}
  }
  attach(world){
    this.world=world;const set=world.setBlock.bind(world);
    world.onFluidLevelChanged=(x,y,z,level)=>{if(this.ready&&!this.applying&&this.edits.length<480)this.edits.push({x,y,z,id:world.getBlock(x,y,z),before:world.getBlock(x,y,z),level,simulation:true,levelOnly:true});};
    world.setBlock=(x,y,z,id,options=null)=>{
      if(this.applying)return set(x,y,z,id,options);
      if(!this.ready||this.picking||this.edits.length>=480)return false;
      x=Math.floor(x);y=Math.floor(y);z=Math.floor(z);id=Math.floor(id);
      const before=world.getBlock(x,y,z),decoration=Boolean(options?.skipStats&&(id===33||(before===33&&id===0)));
      if(options?.skipStats&&!this.isLeader&&!decoration)return false;
      const changed=set(x,y,z,id,options);
      if(changed)this.edits.push({x,y,z,id,before,level:options?.fluidLevel??null,simulation:Boolean(options?.skipStats),decoration});
      return changed;
    };
  }
  setMembers(members){
    const ids=new Set();
    for(const p of members){if(p.id===this.you?.id)continue;ids.add(p.id);if(!this.remotes.has(p.id))this.remotes.set(p.id,new RemotePlayer(this.scene,p,this.atlas));}
    for(const [id,p] of this.remotes)if(!ids.has(id)){p.dispose();this.remotes.delete(id);}
  }
  applyChanges(change){
    if(change.revision<=this.revision)return;this.revision=change.revision;
    if(change.actor===this.you?.id)return;
    this.applying=true;
    try{for(const e of change.edits){if(e.levelOnly)this.world?._flowInto(e.x,e.y,e.z,e.level);else this.world?.setBlock(e.x,e.y,e.z,e.id,{skipStats:e.simulation,fluidLevel:e.level});}for(const drop of change.dropAdds)this.onDrop(drop);}
    finally{this.applying=false;}
  }
  addDrop(drop){this.dropAdds.push(drop);}
  makePacket(save){
    const {player,inventory,survival,flags,objectiveIndex,objectiveId,respawnPoint}=save;
    return {id:crypto.randomUUID(),edits:this.edits.splice(0,512),dropAdds:this.dropAdds.splice(0,32),personal:{player,inventory,survival,flags,objectiveIndex,objectiveId,respawnPoint},timeOfDay:save.timeOfDay};
  }
  async flush(force=true){
    if(!this.ready)throw new Error('Wait for the world to reconnect before leaving.');
    // Visibility, pause, autosave and leave can also request a save while a
    // pickup is in flight. Its old inventory must never race the server claim.
    if(this.authoritativeInventoryPending)throw new Error('Wait for your inventory to finish syncing.');
    if(this.busy){await this.busy;if(force)return this.flush(true);return;}
    if(!force&&!this.edits.length&&!this.dropAdds.length&&!this.dirtyPersonal)return;
    const save=this.getSnapshot();if(!save)return;
    const packet=this.makePacket(save);
    this.dirtyPersonal=false;this.pending=packet;
    this.busy=this.request('commit',packet).then(result=>{this.pending=null;return result;}).catch(error=>{
      this.freeze('Connection interrupted · game paused. Reconnecting…');this.retry();
      throw error;
    });
    try{await this.busy;}finally{this.busy=null;}
    if(force&&(this.edits.length||this.dropAdds.length))return this.flush(true);
  }
  async pickup(drop){
    if(!this.ready||this.picking)return;this.picking=true;
    try{await this.flush(true);this.authoritativeInventoryPending=true;const result=await this.request('pickup',{key:drop.networkId});this.onInventory(result.inventory);this.authoritativeInventoryPending=false;}
    catch(error){if(error.retryable){this.freeze('Syncing your inventory after the connection interruption…');this.retry();}else this.authoritativeInventoryPending=false;}
    finally{this.picking=false;}
  }
  async claimLoot(cell){
    if(!this.ready||this.picking)throw new Error('Wait for your world to finish syncing.');
    this.picking=true;
    try{
      await this.flush(true);
      this.authoritativeInventoryPending=true;
      const result=await this.request('claim-loot',{x:cell.x,y:cell.y,z:cell.z});
      if(result.ok)this.onInventory(result.inventory);
      if(result.key&&this.world)this.world.discoveryLoot[result.key]=result.remaining;
      this.authoritativeInventoryPending=false;
      return result;
    }catch(error){
      if(error.retryable){this.freeze('Syncing your cache after the connection interruption…');this.retry();}
      else this.authoritativeInventoryPending=false;
      throw error;
    }finally{this.picking=false;}
  }
  update(dt,player,motion={}){
    if(!this.ready||!player)return;
    for(const remote of this.remotes.values())remote.update(dt);
    this.poseTime=(this.poseTime||0)+dt;
    if(this.poseTime<.05)return;this.poseTime=0;
    this.socket.volatile.emit('pose',{position:player.position.toArray(),velocity:player.velocity.toArray(),yaw:player.yaw,pitch:player.pitch,grounded:player.grounded,swimming:player.inWater,headlamp:player.headlampOn,...motion});
  }
  sendEcology(data){if(this.ready&&this.isLeader)this.socket.volatile.emit('ecology',data);}
  dispose(){this.stopped=true;this.ready=false;clearTimeout(this.retryTimer);clearInterval(this.timer);clearInterval(this.heartbeat);document.removeEventListener('visibilitychange',this.visibility);window.removeEventListener('storage',this.sessionChanged);window.removeEventListener('online',this.online);window.removeEventListener('offline',this.offline);this.socket.disconnect();for(const p of this.remotes.values())p.dispose();this.remotes.clear();}
}

export async function createSavedWorld({name,seed,mode,friendCode,importSave}){
  const {token}=readAccountSession();
  if(!token)throw new Error('Sign in through your account to save worlds and invite a friend.');
  return accountRequest('/api/worlds',{token,method:'POST',body:JSON.stringify({name,seed,mode,friendCode,importSave})});
}
