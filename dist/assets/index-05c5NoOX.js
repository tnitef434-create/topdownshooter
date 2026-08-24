(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();const ki=Object.create(null);ki.open="0";ki.close="1";ki.ping="2";ki.pong="3";ki.message="4";ki.upgrade="5";ki.noop="6";const Ra=Object.create(null);Object.keys(ki).forEach(s=>{Ra[ki[s]]=s});const no={type:"error",data:"parser error"},Sh=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Mh=typeof ArrayBuffer=="function",bh=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s&&s.buffer instanceof ArrayBuffer,hl=({type:s,data:e},t,i)=>Sh&&e instanceof Blob?t?i(e):ac(e,i):Mh&&(e instanceof ArrayBuffer||bh(e))?t?i(e):ac(new Blob([e]),i):i(ki[s]+(e||"")),ac=(s,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(s)};function rc(s){return s instanceof Uint8Array?s:s instanceof ArrayBuffer?new Uint8Array(s):new Uint8Array(s.buffer,s.byteOffset,s.byteLength)}let dr;function kd(s,e){if(Sh&&s.data instanceof Blob)return s.data.arrayBuffer().then(rc).then(e);if(Mh&&(s.data instanceof ArrayBuffer||bh(s.data)))return e(rc(s.data));hl(s,!1,t=>{dr||(dr=new TextEncoder),e(dr.encode(t))})}const oc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ds=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let s=0;s<oc.length;s++)Ds[oc.charCodeAt(s)]=s;const Ud=s=>{let e=s.length*.75,t=s.length,i,n=0,a,r,o,l;s[s.length-1]==="="&&(e--,s[s.length-2]==="="&&e--);const c=new ArrayBuffer(e),h=new Uint8Array(c);for(i=0;i<t;i+=4)a=Ds[s.charCodeAt(i)],r=Ds[s.charCodeAt(i+1)],o=Ds[s.charCodeAt(i+2)],l=Ds[s.charCodeAt(i+3)],h[n++]=a<<2|r>>4,h[n++]=(r&15)<<4|o>>2,h[n++]=(o&3)<<6|l&63;return c},Bd=typeof ArrayBuffer=="function",dl=(s,e)=>{if(typeof s!="string")return{type:"message",data:Eh(s,e)};const t=s.charAt(0);return t==="b"?{type:"message",data:Fd(s.substring(1),e)}:Ra[t]?s.length>1?{type:Ra[t],data:s.substring(1)}:{type:Ra[t]}:no},Fd=(s,e)=>{if(Bd){const t=Ud(s);return Eh(t,e)}else return{base64:!0,data:s}},Eh=(s,e)=>{switch(e){case"blob":return s instanceof Blob?s:new Blob([s]);case"arraybuffer":default:return s instanceof ArrayBuffer?s:s.buffer}},Th="",Od=(s,e)=>{const t=s.length,i=new Array(t);let n=0;s.forEach((a,r)=>{hl(a,!1,o=>{i[r]=o,++n===t&&e(i.join(Th))})})},zd=(s,e)=>{const t=s.split(Th),i=[];for(let n=0;n<t.length;n++){const a=dl(t[n],e);if(i.push(a),a.type==="error")break}return i};function Vd(){return new TransformStream({transform(s,e){kd(s,t=>{const i=t.length;let n;if(i<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,i);else if(i<65536){n=new Uint8Array(3);const a=new DataView(n.buffer);a.setUint8(0,126),a.setUint16(1,i)}else{n=new Uint8Array(9);const a=new DataView(n.buffer);a.setUint8(0,127),a.setBigUint64(1,BigInt(i))}s.data&&typeof s.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(t)})}})}let fr;function Ks(s){return s.reduce((e,t)=>e+t.length,0)}function js(s,e){if(s[0].length===e)return s.shift();const t=new Uint8Array(e);let i=0;for(let n=0;n<e;n++)t[n]=s[0][i++],i===s[0].length&&(s.shift(),i=0);return s.length&&i<s[0].length&&(s[0]=s[0].slice(i)),t}function Hd(s,e){fr||(fr=new TextDecoder);const t=[];let i=0,n=-1,a=!1;return new TransformStream({transform(r,o){for(t.push(r);;){if(i===0){if(Ks(t)<1)break;const l=js(t,1);a=(l[0]&128)===128,n=l[0]&127,n<126?i=3:n===126?i=1:i=2}else if(i===1){if(Ks(t)<2)break;const l=js(t,2);n=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),i=3}else if(i===2){if(Ks(t)<8)break;const l=js(t,8),c=new DataView(l.buffer,l.byteOffset,l.length),h=c.getUint32(0);if(h>Math.pow(2,21)-1){o.enqueue(no);break}n=h*Math.pow(2,32)+c.getUint32(4),i=3}else{if(Ks(t)<n)break;const l=js(t,n);o.enqueue(dl(a?l:fr.decode(l),e)),i=0}if(n===0||n>s){o.enqueue(no);break}}}})}const wh=4;function Ct(s){if(s)return Wd(s)}function Wd(s){for(var e in Ct.prototype)s[e]=Ct.prototype[e];return s}Ct.prototype.on=Ct.prototype.addEventListener=function(s,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+s]=this._callbacks["$"+s]||[]).push(e),this};Ct.prototype.once=function(s,e){function t(){this.off(s,t),e.apply(this,arguments)}return t.fn=e,this.on(s,t),this};Ct.prototype.off=Ct.prototype.removeListener=Ct.prototype.removeAllListeners=Ct.prototype.removeEventListener=function(s,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+s];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+s],this;for(var i,n=0;n<t.length;n++)if(i=t[n],i===e||i.fn===e){t.splice(n,1);break}return t.length===0&&delete this._callbacks["$"+s],this};Ct.prototype.emit=function(s){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+s],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,n=t.length;i<n;++i)t[i].apply(this,e)}return this};Ct.prototype.emitReserved=Ct.prototype.emit;Ct.prototype.listeners=function(s){return this._callbacks=this._callbacks||{},this._callbacks["$"+s]||[]};Ct.prototype.hasListeners=function(s){return!!this.listeners(s).length};const Qa=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),hi=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Gd="arraybuffer";function Ah(s,...e){return e.reduce((t,i)=>(s.hasOwnProperty(i)&&(t[i]=s[i]),t),{})}const Xd=hi.setTimeout,qd=hi.clearTimeout;function er(s,e){e.useNativeTimers?(s.setTimeoutFn=Xd.bind(hi),s.clearTimeoutFn=qd.bind(hi)):(s.setTimeoutFn=hi.setTimeout.bind(hi),s.clearTimeoutFn=hi.clearTimeout.bind(hi))}const Yd=1.33;function $d(s){return typeof s=="string"?Kd(s):Math.ceil((s.byteLength||s.size)*Yd)}function Kd(s){let e=0,t=0;for(let i=0,n=s.length;i<n;i++)e=s.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function Rh(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function jd(s){let e="";for(let t in s)s.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(s[t]));return e}function Zd(s){let e={},t=s.split("&");for(let i=0,n=t.length;i<n;i++){let a=t[i].split("=");e[decodeURIComponent(a[0])]=decodeURIComponent(a[1])}return e}class Jd extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class fl extends Ct{constructor(e){super(),this.writable=!1,er(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new Jd(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=dl(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=jd(e);return t.length?"?"+t:""}}class Qd extends fl{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};zd(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Od(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=Rh()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let Ch=!1;try{Ch=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const ef=Ch;function tf(){}class nf extends Qd{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(n,a)=>{this.onError("xhr post error",n,a)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class Ii extends Ct{constructor(e,t,i){super(),this.createRequest=e,er(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=Ah(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&i.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var n;i.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=Ii.requestsCount++,Ii.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=tf,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ii.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Ii.requestsCount=0;Ii.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",lc);else if(typeof addEventListener=="function"){const s="onpagehide"in hi?"pagehide":"unload";addEventListener(s,lc,!1)}}function lc(){for(let s in Ii.requests)Ii.requests.hasOwnProperty(s)&&Ii.requests[s].abort()}const sf=function(){const s=Ph({xdomain:!1});return s&&s.responseType!==null}();class af extends nf{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=sf&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Ii(Ph,this.uri(),e)}}function Ph(s){const e=s.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||ef))return new XMLHttpRequest}catch{}if(!e)try{return new hi[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Ih=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class rf extends fl{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=Ih?{}:Ah(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],n=t===e.length-1;hl(i,this.supportsBinary,a=>{try{this.doWrite(i,a)}catch{}n&&Qa(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=Rh()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const ur=hi.WebSocket||hi.MozWebSocket;class of extends rf{createSocket(e,t,i){return Ih?new ur(e,t,i):t?new ur(e,t):new ur(e)}doWrite(e,t){this.ws.send(t)}}class lf extends fl{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Hd(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),n=Vd();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const a=()=>{i.read().then(({done:o,value:l})=>{o||(this.onPacket(l),a())}).catch(o=>{})};a();const r={type:"open"};this.query.sid&&(r.data=`{"sid":"${this.query.sid}"}`),this._writer.write(r).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],n=t===e.length-1;this._writer.write(i).then(()=>{n&&Qa(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const cf={websocket:of,webtransport:lf,polling:af},hf=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,df=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function so(s){if(s.length>8e3)throw"URI too long";const e=s,t=s.indexOf("["),i=s.indexOf("]");t!=-1&&i!=-1&&(s=s.substring(0,t)+s.substring(t,i).replace(/:/g,";")+s.substring(i,s.length));let n=hf.exec(s||""),a={},r=14;for(;r--;)a[df[r]]=n[r]||"";return t!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a.pathNames=ff(a,a.path),a.queryKey=uf(a,a.query),a}function ff(s,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function uf(s,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,n,a){n&&(t[n]=a)}),t}const ao=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ca=[];ao&&addEventListener("offline",()=>{Ca.forEach(s=>s())},!1);class xn extends Ct{constructor(e,t){if(super(),this.binaryType=Gd,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=so(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=so(t.host).host);er(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const n=i.prototype.name;this.transports.push(n),this._transportsByName[n]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Zd(this.opts.query)),ao&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ca.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=wh,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&xn.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",xn.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const n=this.writeBuffer[i].data;if(n&&(t+=$d(n)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,Qa(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,n){if(typeof t=="function"&&(n=t,t=void 0),typeof i=="function"&&(n=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const a={type:e,data:t,options:i};this.emitReserved("packetCreate",a),this.writeBuffer.push(a),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(xn.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),ao&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=Ca.indexOf(this._offlineEventListener);i!==-1&&Ca.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}xn.protocol=wh;class pf extends xn{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;xn.priorWebsocketSuccess=!1;const n=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",f=>{if(!i)if(f.type==="pong"&&f.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;xn.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(h(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const d=new Error("probe error");d.transport=t.name,this.emitReserved("upgradeError",d)}}))};function a(){i||(i=!0,h(),t.close(),t=null)}const r=f=>{const d=new Error("probe error: "+f);d.transport=t.name,a(),this.emitReserved("upgradeError",d)};function o(){r("transport closed")}function l(){r("socket closed")}function c(f){t&&f.name!==t.name&&a()}const h=()=>{t.removeListener("open",n),t.removeListener("error",r),t.removeListener("close",o),this.off("close",l),this.off("upgrading",c)};t.once("open",n),t.once("error",r),t.once("close",o),this.once("close",l),this.once("upgrading",c),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let mf=class extends pf{constructor(e,t={}){const i=typeof e=="object",n=i?{...e}:{...t};(!n.transports||n.transports&&typeof n.transports[0]=="string")&&(n.transports=(n.transports||["polling","websocket","webtransport"]).map(a=>cf[a]).filter(a=>!!a)),super(i?n:e,n)}};function gf(s,e="",t){let i=s;t=t||typeof location<"u"&&location,s==null&&(s=t.protocol+"//"+t.host),typeof s=="string"&&(s.charAt(0)==="/"&&(s.charAt(1)==="/"?s=t.protocol+s:s=t.host+s),/^(https?|wss?):\/\//.test(s)||(typeof t<"u"?s=t.protocol+"//"+s:s="https://"+s),i=so(s)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const a=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+a+":"+i.port+e,i.href=i.protocol+"://"+a+(t&&t.port===i.port?"":":"+i.port),i}const yf=typeof ArrayBuffer=="function",xf=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s.buffer instanceof ArrayBuffer,Lh=Object.prototype.toString,_f=typeof Blob=="function"||typeof Blob<"u"&&Lh.call(Blob)==="[object BlobConstructor]",vf=typeof File=="function"||typeof File<"u"&&Lh.call(File)==="[object FileConstructor]";function ul(s){return yf&&(s instanceof ArrayBuffer||xf(s))||_f&&s instanceof Blob||vf&&s instanceof File}function Pa(s,e){if(!s||typeof s!="object")return!1;if(Array.isArray(s)){for(let t=0,i=s.length;t<i;t++)if(Pa(s[t]))return!0;return!1}if(ul(s))return!0;if(s.toJSON&&typeof s.toJSON=="function"&&arguments.length===1)return Pa(s.toJSON(),!0);for(const t in s)if(Object.prototype.hasOwnProperty.call(s,t)&&Pa(s[t]))return!0;return!1}function Sf(s){const e=[],t=s.data,i=s;return i.data=Ia(t,e),i.attachments=e.length,{packet:i,buffers:e}}function Ia(s,e,t){if(!s)return s;if(ul(s)){const i={_placeholder:!0,num:e.length};return e.push(s),i}else if(Array.isArray(s)){const i=new Array(s.length);for(let n=0;n<s.length;n++)i[n]=Ia(s[n],e);return i}else if(typeof s=="object"&&!(s instanceof Date)){if(s.toJSON&&typeof s.toJSON=="function"&&!t)return Ia(s.toJSON(),e,!0);const i={};for(const n in s)Object.prototype.hasOwnProperty.call(s,n)&&(i[n]=Ia(s[n],e));return i}return s}function Mf(s,e){return s.data=ro(s.data,e),delete s.attachments,s}function ro(s,e){if(!s)return s;if(s&&s._placeholder===!0){if(typeof s.num=="number"&&s.num>=0&&s.num<e.length)return e[s.num];throw new Error("illegal attachments")}else if(Array.isArray(s))for(let t=0;t<s.length;t++)s[t]=ro(s[t],e);else if(typeof s=="object")for(const t in s)Object.prototype.hasOwnProperty.call(s,t)&&(s[t]=ro(s[t],e));return s}const bf=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var Ye;(function(s){s[s.CONNECT=0]="CONNECT",s[s.DISCONNECT=1]="DISCONNECT",s[s.EVENT=2]="EVENT",s[s.ACK=3]="ACK",s[s.CONNECT_ERROR=4]="CONNECT_ERROR",s[s.BINARY_EVENT=5]="BINARY_EVENT",s[s.BINARY_ACK=6]="BINARY_ACK"})(Ye||(Ye={}));class Ef{constructor(e){this.replacer=e}encode(e){return(e.type===Ye.EVENT||e.type===Ye.ACK)&&Pa(e)?this.encodeAsBinary({type:e.type===Ye.EVENT?Ye.BINARY_EVENT:Ye.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===Ye.BINARY_EVENT||e.type===Ye.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=Sf(e),i=this.encodeAsString(t.packet),n=t.buffers;return n.unshift(i),n}}class pl extends Ct{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===Ye.BINARY_EVENT;i||t.type===Ye.BINARY_ACK?(t.type=i?Ye.EVENT:Ye.ACK,this.reconstructor=new Tf(t)):super.emitReserved("decoded",t)}else if(ul(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if(Ye[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===Ye.BINARY_EVENT||i.type===Ye.BINARY_ACK){const a=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const r=e.substring(a,t);if(r!=Number(r)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const o=Number(r);if(!wf(o)||o<1)throw new Error("Illegal attachments");if(o>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=o}if(e.charAt(t+1)==="/"){const a=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(a,t)}else i.nsp="/";const n=e.charAt(t+1);if(n!==""&&Number(n)==n){const a=t+1;for(;++t;){const r=e.charAt(t);if(r==null||Number(r)!=r){--t;break}if(t===e.length)break}i.id=Number(e.substring(a,t+1))}if(e.charAt(++t)){const a=this.tryParse(e.substr(t));if(pl.isPayloadValid(i.type,a))i.data=a;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case Ye.CONNECT:return cc(t);case Ye.DISCONNECT:return t===void 0;case Ye.CONNECT_ERROR:return typeof t=="string"||cc(t);case Ye.EVENT:case Ye.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&bf.indexOf(t[0])===-1);case Ye.ACK:case Ye.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Tf{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=Mf(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const wf=Number.isInteger||function(s){return typeof s=="number"&&isFinite(s)&&Math.floor(s)===s};function cc(s){return Object.prototype.toString.call(s)==="[object Object]"}const Af=Object.freeze(Object.defineProperty({__proto__:null,Decoder:pl,Encoder:Ef,get PacketType(){return Ye}},Symbol.toStringTag,{value:"Module"}));function mi(s,e,t){return s.on(e,t),function(){s.off(e,t)}}const Rf=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Dh extends Ct{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[mi(e,"open",this.onopen.bind(this)),mi(e,"packet",this.onpacket.bind(this)),mi(e,"error",this.onerror.bind(this)),mi(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,n,a;if(Rf.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const r={type:Ye.EVENT,data:t};if(r.options={},r.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const h=this.ids++,f=t.pop();this._registerAckCallback(h,f),r.id=h}const o=(n=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||n===void 0?void 0:n.writable,l=this.connected&&!(!((a=this.io.engine)===null||a===void 0)&&a._hasPingExpired());return this.flags.volatile&&!o||(l?(this.notifyOutgoingListeners(r),this.packet(r)):this.sendBuffer.push(r)),this.flags={},this}_registerAckCallback(e,t){var i;const n=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(n===void 0){this.acks[e]=t;return}const a=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let o=0;o<this.sendBuffer.length;o++)this.sendBuffer[o].id===e&&this.sendBuffer.splice(o,1);t.call(this,new Error("operation has timed out"))},n),r=(...o)=>{this.io.clearTimeoutFn(a),t.apply(this,o)};r.withError=!0,this.acks[e]=r}emitWithAck(e,...t){return new Promise((i,n)=>{const a=(r,o)=>r?n(r):i(o);a.withError=!0,t.push(a),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...a)=>(this._queue[0],n!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(n)):(this._queue.shift(),t&&t(null,...a)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:Ye.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case Ye.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case Ye.EVENT:case Ye.BINARY_EVENT:this.onevent(e);break;case Ye.ACK:case Ye.BINARY_ACK:this.onack(e);break;case Ye.DISCONNECT:this.ondisconnect();break;case Ye.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...n){i||(i=!0,t.packet({type:Ye.ACK,id:e,data:n}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:Ye.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function Ss(s){s=s||{},this.ms=s.min||100,this.max=s.max||1e4,this.factor=s.factor||2,this.jitter=s.jitter>0&&s.jitter<=1?s.jitter:0,this.attempts=0}Ss.prototype.duration=function(){var s=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*s);s=Math.floor(e*10)&1?s+t:s-t}return Math.min(s,this.max)|0};Ss.prototype.reset=function(){this.attempts=0};Ss.prototype.setMin=function(s){this.ms=s};Ss.prototype.setMax=function(s){this.max=s};Ss.prototype.setJitter=function(s){this.jitter=s};class oo extends Ct{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,er(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new Ss({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const n=t.parser||Af;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new mf(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const n=mi(t,"open",function(){i.onopen(),e&&e()}),a=o=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",o),e?e(o):this.maybeReconnectOnOpen()},r=mi(t,"error",a);if(this._timeout!==!1){const o=this._timeout,l=this.setTimeoutFn(()=>{n(),a(new Error("timeout")),t.close()},o);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(n),this.subs.push(r),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(mi(e,"ping",this.onping.bind(this)),mi(e,"data",this.ondata.bind(this)),mi(e,"error",this.onerror.bind(this)),mi(e,"close",this.onclose.bind(this)),mi(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){Qa(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new Dh(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Ts={};function La(s,e){typeof s=="object"&&(e=s,s=void 0),e=e||{};const t=gf(s,e.path||"/socket.io"),i=t.source,n=t.id,a=t.path,r=Ts[n]&&a in Ts[n].nsps,o=e.forceNew||e["force new connection"]||e.multiplex===!1||r;let l;return o?l=new oo(i,e):(Ts[n]||(Ts[n]=new oo(i,e)),l=Ts[n]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(La,{Manager:oo,Socket:Dh,io:La,connect:La});/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ml="184",Cf=0,hc=1,Pf=2,Da=1,If=2,Ns=3,vn=0,Qt=1,$i=2,Zi=0,hs=1,lo=2,dc=3,fc=4,Lf=5,In=100,Df=101,Nf=102,kf=103,Uf=104,Bf=200,Ff=201,Of=202,zf=203,co=204,ho=205,Vf=206,Hf=207,Wf=208,Gf=209,Xf=210,qf=211,Yf=212,$f=213,Kf=214,fo=0,uo=1,po=2,us=3,mo=4,go=5,yo=6,xo=7,Nh=0,jf=1,Zf=2,Li=0,kh=1,Uh=2,Bh=3,Fh=4,Oh=5,zh=6,Vh=7,Hh=300,zn=301,ps=302,pr=303,mr=304,tr=306,_o=1e3,Ki=1001,vo=1002,Vt=1003,Jf=1004,Zs=1005,Xt=1006,gr=1007,Dn=1008,ri=1009,Wh=1010,Gh=1011,zs=1012,gl=1013,Ui=1014,Ci=1015,Qi=1016,yl=1017,xl=1018,Vs=1020,Xh=35902,qh=35899,Yh=1021,$h=1022,vi=1023,en=1026,Nn=1027,Kh=1028,_l=1029,Vn=1030,vl=1031,Sl=1033,Na=33776,ka=33777,Ua=33778,Ba=33779,So=35840,Mo=35841,bo=35842,Eo=35843,To=36196,wo=37492,Ao=37496,Ro=37488,Co=37489,Ga=37490,Po=37491,Io=37808,Lo=37809,Do=37810,No=37811,ko=37812,Uo=37813,Bo=37814,Fo=37815,Oo=37816,zo=37817,Vo=37818,Ho=37819,Wo=37820,Go=37821,Xo=36492,qo=36494,Yo=36495,$o=36283,Ko=36284,Xa=36285,jo=36286,Qf=3200,Zo=0,eu=1,fn="",ci="srgb",qa="srgb-linear",Ya="linear",rt="srgb",qn=7680,uc=519,tu=512,iu=513,nu=514,Ml=515,su=516,au=517,bl=518,ru=519,pc=35044,mc="300 es",Pi=2e3,Hs=2001;function ou(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function $a(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function lu(){const s=$a("canvas");return s.style.display="block",s}const gc={};function yc(...s){const e="THREE."+s.shift();console.log(e,...s)}function jh(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function De(...s){s=jh(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function Qe(...s){s=jh(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function Jo(...s){const e=s.join(" ");e in gc||(gc[e]=!0,De(...s))}function cu(s,e,t){return new Promise(function(i,n){function a(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:n();break;case s.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}const hu={[fo]:uo,[po]:yo,[mo]:xo,[us]:go,[uo]:fo,[yo]:po,[xo]:mo,[go]:us};class Wn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const n=i[e];if(n!==void 0){const a=n.indexOf(t);a!==-1&&n.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const n=i.slice(0);for(let a=0,r=n.length;a<r;a++)n[a].call(this,e);e.target=null}}}const Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],yr=Math.PI/180,Qo=180/Math.PI;function Xs(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Wt[s&255]+Wt[s>>8&255]+Wt[s>>16&255]+Wt[s>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[t&63|128]+Wt[t>>8&255]+"-"+Wt[t>>16&255]+Wt[t>>24&255]+Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]).toLowerCase()}function Ke(s,e,t){return Math.max(e,Math.min(t,s))}function du(s,e){return(s%e+e)%e}function xr(s,e,t){return(1-t)*s+t*e}function ws(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Jt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const ql=class ql{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),n=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*n+e.x,this.y=a*n+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};ql.prototype.isVector2=!0;let it=ql;class Ms{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,a,r,o){let l=i[n+0],c=i[n+1],h=i[n+2],f=i[n+3],d=a[r+0],u=a[r+1],p=a[r+2],_=a[r+3];if(f!==_||l!==d||c!==u||h!==p){let g=l*d+c*u+h*p+f*_;g<0&&(d=-d,u=-u,p=-p,_=-_,g=-g);let m=1-o;if(g<.9995){const M=Math.acos(g),v=Math.sin(M);m=Math.sin(m*M)/v,o=Math.sin(o*M)/v,l=l*m+d*o,c=c*m+u*o,h=h*m+p*o,f=f*m+_*o}else{l=l*m+d*o,c=c*m+u*o,h=h*m+p*o,f=f*m+_*o;const M=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=M,c*=M,h*=M,f*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,n,a,r){const o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],f=a[r],d=a[r+1],u=a[r+2],p=a[r+3];return e[t]=o*p+h*f+l*u-c*d,e[t+1]=l*p+h*d+c*f-o*u,e[t+2]=c*p+h*u+o*d-l*f,e[t+3]=h*p-o*f-l*d-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,n=e._y,a=e._z,r=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),f=o(a/2),d=l(i/2),u=l(n/2),p=l(a/2);switch(r){case"XYZ":this._x=d*h*f+c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f-d*u*p;break;case"YXZ":this._x=d*h*f+c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f+d*u*p;break;case"ZXY":this._x=d*h*f-c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f-d*u*p;break;case"ZYX":this._x=d*h*f-c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f+d*u*p;break;case"YZX":this._x=d*h*f+c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f-d*u*p;break;case"XZY":this._x=d*h*f-c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f+d*u*p;break;default:De("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],n=t[4],a=t[8],r=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],d=i+o+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(a-c)*u,this._z=(r-n)*u}else if(i>o&&i>f){const u=2*Math.sqrt(1+i-o-f);this._w=(h-l)/u,this._x=.25*u,this._y=(n+r)/u,this._z=(a+c)/u}else if(o>f){const u=2*Math.sqrt(1+o-i-f);this._w=(a-c)/u,this._x=(n+r)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-o);this._w=(r-n)/u,this._x=(a+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,n=e._y,a=e._z,r=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+r*o+n*c-a*l,this._y=n*h+r*l+a*o-i*c,this._z=a*h+r*c+i*l-n*o,this._w=r*h-i*o-n*l-a*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,n=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(i=-i,n=-n,a=-a,r=-r,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+n*t,this._z=this._z*l+a*t,this._w=this._w*l+r*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+n*t,this._z=this._z*l+a*t,this._w=this._w*l+r*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(n*Math.sin(e),n*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Yl=class Yl{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(xc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(xc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,n=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*n,this.y=a[1]*t+a[4]*i+a[7]*n,this.z=a[2]*t+a[5]*i+a[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*n+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*n+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*n+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*n+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,n=this.z,a=e.x,r=e.y,o=e.z,l=e.w,c=2*(r*n-o*i),h=2*(o*t-a*n),f=2*(a*i-r*t);return this.x=t+l*c+r*f-o*h,this.y=i+l*h+o*c-a*f,this.z=n+l*f+a*h-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,n=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n,this.y=a[1]*t+a[5]*i+a[9]*n,this.z=a[2]*t+a[6]*i+a[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,n=e.y,a=e.z,r=t.x,o=t.y,l=t.z;return this.x=n*l-a*o,this.y=a*r-i*l,this.z=i*o-n*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return _r.copy(this).projectOnVector(e),this.sub(_r)}reflect(e){return this.sub(_r.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Yl.prototype.isVector3=!0;let V=Yl;const _r=new V,xc=new Ms,$l=class $l{constructor(e,t,i,n,a,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,a,r,o,l,c)}set(e,t,i,n,a,r,o,l,c){const h=this.elements;return h[0]=e,h[1]=n,h[2]=o,h[3]=t,h[4]=a,h[5]=l,h[6]=i,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],p=i[8],_=n[0],g=n[3],m=n[6],M=n[1],v=n[4],x=n[7],y=n[2],E=n[5],A=n[8];return a[0]=r*_+o*M+l*y,a[3]=r*g+o*v+l*E,a[6]=r*m+o*x+l*A,a[1]=c*_+h*M+f*y,a[4]=c*g+h*v+f*E,a[7]=c*m+h*x+f*A,a[2]=d*_+u*M+p*y,a[5]=d*g+u*v+p*E,a[8]=d*m+u*x+p*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],n=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*r*h-t*o*c-i*a*h+i*o*l+n*a*c-n*r*l}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*r-o*c,d=o*l-h*a,u=c*a-r*l,p=t*f+i*d+n*u;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=f*_,e[1]=(n*c-h*i)*_,e[2]=(o*i-n*r)*_,e[3]=d*_,e[4]=(h*t-n*l)*_,e[5]=(n*a-o*t)*_,e[6]=u*_,e[7]=(i*l-c*t)*_,e[8]=(r*t-i*a)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,a,r,o){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+e,-n*c,n*l,-n*(-c*r+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(vr.makeScale(e,t)),this}rotate(e){return this.premultiply(vr.makeRotation(-e)),this}translate(e,t){return this.premultiply(vr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};$l.prototype.isMatrix3=!0;let Ue=$l;const vr=new Ue,_c=new Ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),vc=new Ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function fu(){const s={enabled:!0,workingColorSpace:qa,spaces:{},convert:function(n,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===rt&&(n.r=Ji(n.r),n.g=Ji(n.g),n.b=Ji(n.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(n.applyMatrix3(this.spaces[a].toXYZ),n.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===rt&&(n.r=ds(n.r),n.g=ds(n.g),n.b=ds(n.b))),n},workingToColorSpace:function(n,a){return this.convert(n,this.workingColorSpace,a)},colorSpaceToWorking:function(n,a){return this.convert(n,a,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===fn?Ya:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,a=this.workingColorSpace){return n.fromArray(this.spaces[a].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,a,r){return n.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,a){return Jo("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(n,a)},toWorkingColorSpace:function(n,a){return Jo("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(n,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[qa]:{primaries:e,whitePoint:i,transfer:Ya,toXYZ:_c,fromXYZ:vc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ci},outputColorSpaceConfig:{drawingBufferColorSpace:ci}},[ci]:{primaries:e,whitePoint:i,transfer:rt,toXYZ:_c,fromXYZ:vc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ci}}}),s}const $e=fu();function Ji(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ds(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Yn;class uu{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Yn===void 0&&(Yn=$a("canvas")),Yn.width=e.width,Yn.height=e.height;const n=Yn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),i=Yn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=$a("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const n=i.getImageData(0,0,e.width,e.height),a=n.data;for(let r=0;r<a.length;r++)a[r]=Ji(a[r]/255)*255;return i.putImageData(n,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ji(t[i]/255)*255):t[i]=Ji(t[i]);return{data:t,width:e.width,height:e.height}}else return De("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let pu=0;class El{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:pu++}),this.uuid=Xs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let a;if(Array.isArray(n)){a=[];for(let r=0,o=n.length;r<o;r++)n[r].isDataTexture?a.push(Sr(n[r].image)):a.push(Sr(n[r]))}else a=Sr(n);i.url=a}return t||(e.images[this.uuid]=i),i}}function Sr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?uu.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(De("Texture: Unable to serialize Texture."),{})}let mu=0;const Mr=new V;class jt extends Wn{constructor(e=jt.DEFAULT_IMAGE,t=jt.DEFAULT_MAPPING,i=Ki,n=Ki,a=Xt,r=Dn,o=vi,l=ri,c=jt.DEFAULT_ANISOTROPY,h=fn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:mu++}),this.uuid=Xs(),this.name="",this.source=new El(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Mr).x}get height(){return this.source.getSize(Mr).y}get depth(){return this.source.getSize(Mr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){De(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){De(`Texture.setValues(): property '${t}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Hh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _o:e.x=e.x-Math.floor(e.x);break;case Ki:e.x=e.x<0?0:1;break;case vo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _o:e.y=e.y-Math.floor(e.y);break;case Ki:e.y=e.y<0?0:1;break;case vo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}jt.DEFAULT_IMAGE=null;jt.DEFAULT_MAPPING=Hh;jt.DEFAULT_ANISOTROPY=1;const Kl=class Kl{constructor(e=0,t=0,i=0,n=1){this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*n+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*n+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*n+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*n+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,a;const l=e.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],p=l[9],_=l[2],g=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-_)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+_)<.1&&Math.abs(p+g)<.1&&Math.abs(c+u+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,x=(u+1)/2,y=(m+1)/2,E=(h+d)/4,A=(f+_)/4,S=(p+g)/4;return v>x&&v>y?v<.01?(i=0,n=.707106781,a=.707106781):(i=Math.sqrt(v),n=E/i,a=A/i):x>y?x<.01?(i=.707106781,n=0,a=.707106781):(n=Math.sqrt(x),i=E/n,a=S/n):y<.01?(i=.707106781,n=.707106781,a=0):(a=Math.sqrt(y),i=A/a,n=S/a),this.set(i,n,a,t),this}let M=Math.sqrt((g-p)*(g-p)+(f-_)*(f-_)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(g-p)/M,this.y=(f-_)/M,this.z=(d-h)/M,this.w=Math.acos((c+u+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Kl.prototype.isVector4=!0;let Mt=Kl;class gu extends Wn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Mt(0,0,e,t),this.scissorTest=!1,this.viewport=new Mt(0,0,e,t),this.textures=[];const n={width:e,height:t,depth:i.depth},a=new jt(n),r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Xt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,a=this.textures.length;n<a;n++)this.textures[n].image.width=e,this.textures[n].image.height=t,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const n=Object.assign({},e.textures[t].image);this.textures[t].source=new El(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Di extends gu{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Zh extends jt{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=Ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class yu extends jt{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=Ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ja=class Ja{constructor(e,t,i,n,a,r,o,l,c,h,f,d,u,p,_,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,a,r,o,l,c,h,f,d,u,p,_,g)}set(e,t,i,n,a,r,o,l,c,h,f,d,u,p,_,g){const m=this.elements;return m[0]=e,m[4]=t,m[8]=i,m[12]=n,m[1]=a,m[5]=r,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=f,m[14]=d,m[3]=u,m[7]=p,m[11]=_,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ja().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,n=1/$n.setFromMatrixColumn(e,0).length(),a=1/$n.setFromMatrixColumn(e,1).length(),r=1/$n.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,n=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(a),f=Math.sin(a);if(e.order==="XYZ"){const d=r*h,u=r*f,p=o*h,_=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=u+p*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=p+u*c,t[10]=r*l}else if(e.order==="YXZ"){const d=l*h,u=l*f,p=c*h,_=c*f;t[0]=d+_*o,t[4]=p*o-u,t[8]=r*c,t[1]=r*f,t[5]=r*h,t[9]=-o,t[2]=u*o-p,t[6]=_+d*o,t[10]=r*l}else if(e.order==="ZXY"){const d=l*h,u=l*f,p=c*h,_=c*f;t[0]=d-_*o,t[4]=-r*f,t[8]=p+u*o,t[1]=u+p*o,t[5]=r*h,t[9]=_-d*o,t[2]=-r*c,t[6]=o,t[10]=r*l}else if(e.order==="ZYX"){const d=r*h,u=r*f,p=o*h,_=o*f;t[0]=l*h,t[4]=p*c-u,t[8]=d*c+_,t[1]=l*f,t[5]=_*c+d,t[9]=u*c-p,t[2]=-c,t[6]=o*l,t[10]=r*l}else if(e.order==="YZX"){const d=r*l,u=r*c,p=o*l,_=o*c;t[0]=l*h,t[4]=_-d*f,t[8]=p*f+u,t[1]=f,t[5]=r*h,t[9]=-o*h,t[2]=-c*h,t[6]=u*f+p,t[10]=d-_*f}else if(e.order==="XZY"){const d=r*l,u=r*c,p=o*l,_=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=d*f+_,t[5]=r*h,t[9]=u*f-p,t[2]=p*f-u,t[6]=o*h,t[10]=_*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(xu,e,_u)}lookAt(e,t,i){const n=this.elements;return ii.subVectors(e,t),ii.lengthSq()===0&&(ii.z=1),ii.normalize(),an.crossVectors(i,ii),an.lengthSq()===0&&(Math.abs(i.z)===1?ii.x+=1e-4:ii.z+=1e-4,ii.normalize(),an.crossVectors(i,ii)),an.normalize(),Js.crossVectors(ii,an),n[0]=an.x,n[4]=Js.x,n[8]=ii.x,n[1]=an.y,n[5]=Js.y,n[9]=ii.y,n[2]=an.z,n[6]=Js.z,n[10]=ii.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],p=i[2],_=i[6],g=i[10],m=i[14],M=i[3],v=i[7],x=i[11],y=i[15],E=n[0],A=n[4],S=n[8],w=n[12],P=n[1],C=n[5],L=n[9],z=n[13],B=n[2],I=n[6],U=n[10],N=n[14],$=n[3],te=n[7],se=n[11],G=n[15];return a[0]=r*E+o*P+l*B+c*$,a[4]=r*A+o*C+l*I+c*te,a[8]=r*S+o*L+l*U+c*se,a[12]=r*w+o*z+l*N+c*G,a[1]=h*E+f*P+d*B+u*$,a[5]=h*A+f*C+d*I+u*te,a[9]=h*S+f*L+d*U+u*se,a[13]=h*w+f*z+d*N+u*G,a[2]=p*E+_*P+g*B+m*$,a[6]=p*A+_*C+g*I+m*te,a[10]=p*S+_*L+g*U+m*se,a[14]=p*w+_*z+g*N+m*G,a[3]=M*E+v*P+x*B+y*$,a[7]=M*A+v*C+x*I+y*te,a[11]=M*S+v*L+x*U+y*se,a[15]=M*w+v*z+x*N+y*G,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],n=e[8],a=e[12],r=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],d=e[10],u=e[14],p=e[3],_=e[7],g=e[11],m=e[15],M=l*u-c*d,v=o*u-c*f,x=o*d-l*f,y=r*u-c*h,E=r*d-l*h,A=r*f-o*h;return t*(_*M-g*v+m*x)-i*(p*M-g*y+m*E)+n*(p*v-_*y+m*A)-a*(p*x-_*E+g*A)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],d=e[10],u=e[11],p=e[12],_=e[13],g=e[14],m=e[15],M=t*o-i*r,v=t*l-n*r,x=t*c-a*r,y=i*l-n*o,E=i*c-a*o,A=n*c-a*l,S=h*_-f*p,w=h*g-d*p,P=h*m-u*p,C=f*g-d*_,L=f*m-u*_,z=d*m-u*g,B=M*z-v*L+x*C+y*P-E*w+A*S;if(B===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/B;return e[0]=(o*z-l*L+c*C)*I,e[1]=(n*L-i*z-a*C)*I,e[2]=(_*A-g*E+m*y)*I,e[3]=(d*E-f*A-u*y)*I,e[4]=(l*P-r*z-c*w)*I,e[5]=(t*z-n*P+a*w)*I,e[6]=(g*x-p*A-m*v)*I,e[7]=(h*A-d*x+u*v)*I,e[8]=(r*L-o*P+c*S)*I,e[9]=(i*P-t*L-a*S)*I,e[10]=(p*E-_*x+m*M)*I,e[11]=(f*x-h*E-u*M)*I,e[12]=(o*w-r*C-l*S)*I,e[13]=(t*C-i*w+n*S)*I,e[14]=(_*v-p*y-g*M)*I,e[15]=(h*y-f*v+d*M)*I,this}scale(e){const t=this.elements,i=e.x,n=e.y,a=e.z;return t[0]*=i,t[4]*=n,t[8]*=a,t[1]*=i,t[5]*=n,t[9]*=a,t[2]*=i,t[6]*=n,t[10]*=a,t[3]*=i,t[7]*=n,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),n=Math.sin(t),a=1-i,r=e.x,o=e.y,l=e.z,c=a*r,h=a*o;return this.set(c*r+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*r,0,c*l-n*o,h*l+n*r,a*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,a,r){return this.set(1,i,a,0,e,1,r,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){const n=this.elements,a=t._x,r=t._y,o=t._z,l=t._w,c=a+a,h=r+r,f=o+o,d=a*c,u=a*h,p=a*f,_=r*h,g=r*f,m=o*f,M=l*c,v=l*h,x=l*f,y=i.x,E=i.y,A=i.z;return n[0]=(1-(_+m))*y,n[1]=(u+x)*y,n[2]=(p-v)*y,n[3]=0,n[4]=(u-x)*E,n[5]=(1-(d+m))*E,n[6]=(g+M)*E,n[7]=0,n[8]=(p+v)*A,n[9]=(g-M)*A,n[10]=(1-(d+_))*A,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){const n=this.elements;e.x=n[12],e.y=n[13],e.z=n[14];const a=this.determinant();if(a===0)return i.set(1,1,1),t.identity(),this;let r=$n.set(n[0],n[1],n[2]).length();const o=$n.set(n[4],n[5],n[6]).length(),l=$n.set(n[8],n[9],n[10]).length();a<0&&(r=-r),di.copy(this);const c=1/r,h=1/o,f=1/l;return di.elements[0]*=c,di.elements[1]*=c,di.elements[2]*=c,di.elements[4]*=h,di.elements[5]*=h,di.elements[6]*=h,di.elements[8]*=f,di.elements[9]*=f,di.elements[10]*=f,t.setFromRotationMatrix(di),i.x=r,i.y=o,i.z=l,this}makePerspective(e,t,i,n,a,r,o=Pi,l=!1){const c=this.elements,h=2*a/(t-e),f=2*a/(i-n),d=(t+e)/(t-e),u=(i+n)/(i-n);let p,_;if(l)p=a/(r-a),_=r*a/(r-a);else if(o===Pi)p=-(r+a)/(r-a),_=-2*r*a/(r-a);else if(o===Hs)p=-r/(r-a),_=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=f,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,n,a,r,o=Pi,l=!1){const c=this.elements,h=2/(t-e),f=2/(i-n),d=-(t+e)/(t-e),u=-(i+n)/(i-n);let p,_;if(l)p=1/(r-a),_=r/(r-a);else if(o===Pi)p=-2/(r-a),_=-(r+a)/(r-a);else if(o===Hs)p=-1/(r-a),_=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=f,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Ja.prototype.isMatrix4=!0;let At=Ja;const $n=new V,di=new At,xu=new V(0,0,0),_u=new V(1,1,1),an=new V,Js=new V,ii=new V,Sc=new At,Mc=new Ms;class Sn{constructor(e=0,t=0,i=0,n=Sn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const n=e.elements,a=n[0],r=n[4],o=n[8],l=n[1],c=n[5],h=n[9],f=n[2],d=n[6],u=n[10];switch(t){case"XYZ":this._y=Math.asin(Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-Ke(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(Ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Ke(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,u),this._y=0);break;default:De("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Sc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Sc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Mc.setFromEuler(this),this.setFromQuaternion(Mc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Sn.DEFAULT_ORDER="XYZ";class Jh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let vu=0;const bc=new V,Kn=new Ms,Oi=new At,Qs=new V,As=new V,Su=new V,Mu=new Ms,Ec=new V(1,0,0),Tc=new V(0,1,0),wc=new V(0,0,1),Ac={type:"added"},bu={type:"removed"},jn={type:"childadded",child:null},br={type:"childremoved",child:null};class qt extends Wn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:vu++}),this.uuid=Xs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=qt.DEFAULT_UP.clone();const e=new V,t=new Sn,i=new Ms,n=new V(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new At},normalMatrix:{value:new Ue}}),this.matrix=new At,this.matrixWorld=new At,this.matrixAutoUpdate=qt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Jh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Kn.setFromAxisAngle(e,t),this.quaternion.multiply(Kn),this}rotateOnWorldAxis(e,t){return Kn.setFromAxisAngle(e,t),this.quaternion.premultiply(Kn),this}rotateX(e){return this.rotateOnAxis(Ec,e)}rotateY(e){return this.rotateOnAxis(Tc,e)}rotateZ(e){return this.rotateOnAxis(wc,e)}translateOnAxis(e,t){return bc.copy(e).applyQuaternion(this.quaternion),this.position.add(bc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ec,e)}translateY(e){return this.translateOnAxis(Tc,e)}translateZ(e){return this.translateOnAxis(wc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Oi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Qs.copy(e):Qs.set(e,t,i);const n=this.parent;this.updateWorldMatrix(!0,!1),As.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Oi.lookAt(As,Qs,this.up):Oi.lookAt(Qs,As,this.up),this.quaternion.setFromRotationMatrix(Oi),n&&(Oi.extractRotation(n.matrixWorld),Kn.setFromRotationMatrix(Oi),this.quaternion.premultiply(Kn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Qe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ac),jn.child=e,this.dispatchEvent(jn),jn.child=null):Qe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bu),br.child=e,this.dispatchEvent(br),br.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Oi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Oi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Oi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ac),jn.child=e,this.dispatchEvent(jn),jn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const n=this.children;for(let a=0,r=n.length;a<r;a++)n[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,e,Su),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,Mu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,n=e.z,a=this.matrix.elements;a[12]+=t-a[0]*t-a[4]*i-a[8]*n,a[13]+=i-a[1]*t-a[5]*i-a[9]*n,a[14]+=n-a[2]*t-a[6]*i-a[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const n=this.children;for(let a=0,r=n.length;a<r;a++)n[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),this.static!==!1&&(n.static=this.static),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(e),n.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];a(e.shapes,f)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));n.material=o}else n.material=a(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(a(e.animations,l))}}if(t){const o=r(e.geometries),l=r(e.materials),c=r(e.textures),h=r(e.images),f=r(e.shapes),d=r(e.skeletons),u=r(e.animations),p=r(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),p.length>0&&(i.nodes=p)}return i.object=n,i;function r(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const n=e.children[i];this.add(n.clone())}return this}}qt.DEFAULT_UP=new V(0,1,0);qt.DEFAULT_MATRIX_AUTO_UPDATE=!0;qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class kn extends qt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Eu={type:"move"};class Er{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new kn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new kn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new kn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,a=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){r=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,i),m=this._getHandJoint(c,_);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,p=.005;c.inputState.pinching&&d>u+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=u-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&a!==null&&(n=a),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Eu)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new kn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Qh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},rn={h:0,s:0,l:0},ea={h:0,s:0,l:0};function Tr(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class st{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ci){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,t),this}setRGB(e,t,i,n=$e.workingColorSpace){return this.r=e,this.g=t,this.b=i,$e.colorSpaceToWorking(this,n),this}setHSL(e,t,i,n=$e.workingColorSpace){if(e=du(e,1),t=Ke(t,0,1),i=Ke(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=Tr(r,a,e+1/3),this.g=Tr(r,a,e),this.b=Tr(r,a,e-1/3)}return $e.colorSpaceToWorking(this,n),this}setStyle(e,t=ci){function i(a){a!==void 0&&parseFloat(a)<1&&De("Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=n[1],o=n[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:De("Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=n[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);De("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ci){const i=Qh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):De("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ji(e.r),this.g=Ji(e.g),this.b=Ji(e.b),this}copyLinearToSRGB(e){return this.r=ds(e.r),this.g=ds(e.g),this.b=ds(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ci){return $e.workingToColorSpace(Gt.copy(this),e),Math.round(Ke(Gt.r*255,0,255))*65536+Math.round(Ke(Gt.g*255,0,255))*256+Math.round(Ke(Gt.b*255,0,255))}getHexString(e=ci){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.workingToColorSpace(Gt.copy(this),t);const i=Gt.r,n=Gt.g,a=Gt.b,r=Math.max(i,n,a),o=Math.min(i,n,a);let l,c;const h=(o+r)/2;if(o===r)l=0,c=0;else{const f=r-o;switch(c=h<=.5?f/(r+o):f/(2-r-o),r){case i:l=(n-a)/f+(n<a?6:0);break;case n:l=(a-i)/f+2;break;case a:l=(i-n)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=$e.workingColorSpace){return $e.workingToColorSpace(Gt.copy(this),t),e.r=Gt.r,e.g=Gt.g,e.b=Gt.b,e}getStyle(e=ci){$e.workingToColorSpace(Gt.copy(this),e);const t=Gt.r,i=Gt.g,n=Gt.b;return e!==ci?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(e,t,i){return this.getHSL(rn),this.setHSL(rn.h+e,rn.s+t,rn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(rn),e.getHSL(ea);const i=xr(rn.h,ea.h,t),n=xr(rn.s,ea.s,t),a=xr(rn.l,ea.l,t);return this.setHSL(i,n,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,n=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*n,this.g=a[1]*t+a[4]*i+a[7]*n,this.b=a[2]*t+a[5]*i+a[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Gt=new st;st.NAMES=Qh;class Tu extends qt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sn,this.environmentIntensity=1,this.environmentRotation=new Sn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const fi=new V,zi=new V,wr=new V,Vi=new V,Zn=new V,Jn=new V,Rc=new V,Ar=new V,Rr=new V,Cr=new V,Pr=new Mt,Ir=new Mt,Lr=new Mt;class yi{constructor(e=new V,t=new V,i=new V){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),fi.subVectors(e,t),n.cross(fi);const a=n.lengthSq();return a>0?n.multiplyScalar(1/Math.sqrt(a)):n.set(0,0,0)}static getBarycoord(e,t,i,n,a){fi.subVectors(n,t),zi.subVectors(i,t),wr.subVectors(e,t);const r=fi.dot(fi),o=fi.dot(zi),l=fi.dot(wr),c=zi.dot(zi),h=zi.dot(wr),f=r*c-o*o;if(f===0)return a.set(0,0,0),null;const d=1/f,u=(c*l-o*h)*d,p=(r*h-o*l)*d;return a.set(1-u-p,p,u)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,Vi)===null?!1:Vi.x>=0&&Vi.y>=0&&Vi.x+Vi.y<=1}static getInterpolation(e,t,i,n,a,r,o,l){return this.getBarycoord(e,t,i,n,Vi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Vi.x),l.addScaledVector(r,Vi.y),l.addScaledVector(o,Vi.z),l)}static getInterpolatedAttribute(e,t,i,n,a,r){return Pr.setScalar(0),Ir.setScalar(0),Lr.setScalar(0),Pr.fromBufferAttribute(e,t),Ir.fromBufferAttribute(e,i),Lr.fromBufferAttribute(e,n),r.setScalar(0),r.addScaledVector(Pr,a.x),r.addScaledVector(Ir,a.y),r.addScaledVector(Lr,a.z),r}static isFrontFacing(e,t,i,n){return fi.subVectors(i,t),zi.subVectors(e,t),fi.cross(zi).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return fi.subVectors(this.c,this.b),zi.subVectors(this.a,this.b),fi.cross(zi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return yi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return yi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,n,a){return yi.getInterpolation(e,this.a,this.b,this.c,t,i,n,a)}containsPoint(e){return yi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return yi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,n=this.b,a=this.c;let r,o;Zn.subVectors(n,i),Jn.subVectors(a,i),Ar.subVectors(e,i);const l=Zn.dot(Ar),c=Jn.dot(Ar);if(l<=0&&c<=0)return t.copy(i);Rr.subVectors(e,n);const h=Zn.dot(Rr),f=Jn.dot(Rr);if(h>=0&&f<=h)return t.copy(n);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return r=l/(l-h),t.copy(i).addScaledVector(Zn,r);Cr.subVectors(e,a);const u=Zn.dot(Cr),p=Jn.dot(Cr);if(p>=0&&u<=p)return t.copy(a);const _=u*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(i).addScaledVector(Jn,o);const g=h*p-u*f;if(g<=0&&f-h>=0&&u-p>=0)return Rc.subVectors(a,n),o=(f-h)/(f-h+(u-p)),t.copy(n).addScaledVector(Rc,o);const m=1/(g+_+d);return r=_*m,o=d*m,t.copy(i).addScaledVector(Zn,r).addScaledVector(Jn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Hn{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ui.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ui.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ui.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,ui):ui.fromBufferAttribute(a,r),ui.applyMatrix4(e.matrixWorld),this.expandByPoint(ui);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ta.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ta.copy(i.boundingBox)),ta.applyMatrix4(e.matrixWorld),this.union(ta)}const n=e.children;for(let a=0,r=n.length;a<r;a++)this.expandByObject(n[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ui),ui.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Rs),ia.subVectors(this.max,Rs),Qn.subVectors(e.a,Rs),es.subVectors(e.b,Rs),ts.subVectors(e.c,Rs),on.subVectors(es,Qn),ln.subVectors(ts,es),En.subVectors(Qn,ts);let t=[0,-on.z,on.y,0,-ln.z,ln.y,0,-En.z,En.y,on.z,0,-on.x,ln.z,0,-ln.x,En.z,0,-En.x,-on.y,on.x,0,-ln.y,ln.x,0,-En.y,En.x,0];return!Dr(t,Qn,es,ts,ia)||(t=[1,0,0,0,1,0,0,0,1],!Dr(t,Qn,es,ts,ia))?!1:(na.crossVectors(on,ln),t=[na.x,na.y,na.z],Dr(t,Qn,es,ts,ia))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ui).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ui).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Hi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Hi=[new V,new V,new V,new V,new V,new V,new V,new V],ui=new V,ta=new Hn,Qn=new V,es=new V,ts=new V,on=new V,ln=new V,En=new V,Rs=new V,ia=new V,na=new V,Tn=new V;function Dr(s,e,t,i,n){for(let a=0,r=s.length-3;a<=r;a+=3){Tn.fromArray(s,a);const o=n.x*Math.abs(Tn.x)+n.y*Math.abs(Tn.y)+n.z*Math.abs(Tn.z),l=e.dot(Tn),c=t.dot(Tn),h=i.dot(Tn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Rt=new V,sa=new it;let wu=0;class Ni extends Wn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:wu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=pc,this.updateRanges=[],this.gpuType=Ci,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,a=this.itemSize;n<a;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)sa.fromBufferAttribute(this,t),sa.applyMatrix3(e),this.setXY(t,sa.x,sa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ws(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Jt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ws(t,this.array)),t}setX(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ws(t,this.array)),t}setY(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ws(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ws(t,this.array)),t}setW(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Jt(t,this.array),i=Jt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=Jt(t,this.array),i=Jt(i,this.array),n=Jt(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,a){return e*=this.itemSize,this.normalized&&(t=Jt(t,this.array),i=Jt(i,this.array),n=Jt(n,this.array),a=Jt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==pc&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class ed extends Ni{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class td extends Ni{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Zt extends Ni{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Au=new Hn,Cs=new V,Nr=new V;class Tl{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Au.setFromPoints(e).getCenter(i);let n=0;for(let a=0,r=e.length;a<r;a++)n=Math.max(n,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Cs.subVectors(e,this.center);const t=Cs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),n=(i-this.radius)*.5;this.center.addScaledVector(Cs,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Nr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Cs.copy(e.center).add(Nr)),this.expandByPoint(Cs.copy(e.center).sub(Nr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Ru=0;const li=new At,kr=new qt,is=new V,ni=new Hn,Ps=new Hn,Ot=new V;class bi extends Wn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ru++}),this.uuid=Xs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ou(e)?td:ed)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Ue().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return li.makeRotationFromQuaternion(e),this.applyMatrix4(li),this}rotateX(e){return li.makeRotationX(e),this.applyMatrix4(li),this}rotateY(e){return li.makeRotationY(e),this.applyMatrix4(li),this}rotateZ(e){return li.makeRotationZ(e),this.applyMatrix4(li),this}translate(e,t,i){return li.makeTranslation(e,t,i),this.applyMatrix4(li),this}scale(e,t,i){return li.makeScale(e,t,i),this.applyMatrix4(li),this}lookAt(e){return kr.lookAt(e),kr.updateMatrix(),this.applyMatrix4(kr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(is).negate(),this.translate(is.x,is.y,is.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let n=0,a=e.length;n<a;n++){const r=e[n];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new Zt(i,3))}else{const i=Math.min(e.length,t.count);for(let n=0;n<i;n++){const a=e[n];t.setXYZ(n,a.x,a.y,a.z||0)}e.length>t.count&&De("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Hn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){const a=t[i];ni.setFromBufferAttribute(a),this.morphTargetsRelative?(Ot.addVectors(this.boundingBox.min,ni.min),this.boundingBox.expandByPoint(Ot),Ot.addVectors(this.boundingBox.max,ni.max),this.boundingBox.expandByPoint(Ot)):(this.boundingBox.expandByPoint(ni.min),this.boundingBox.expandByPoint(ni.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Tl);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){const i=this.boundingSphere.center;if(ni.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];Ps.setFromBufferAttribute(o),this.morphTargetsRelative?(Ot.addVectors(ni.min,Ps.min),ni.expandByPoint(Ot),Ot.addVectors(ni.max,Ps.max),ni.expandByPoint(Ot)):(ni.expandByPoint(Ps.min),ni.expandByPoint(Ps.max))}ni.getCenter(i);let n=0;for(let a=0,r=e.count;a<r;a++)Ot.fromBufferAttribute(e,a),n=Math.max(n,i.distanceToSquared(Ot));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ot.fromBufferAttribute(o,c),l&&(is.fromBufferAttribute(e,c),Ot.add(is)),n=Math.max(n,i.distanceToSquared(Ot))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&Qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,n=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ni(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],l=[];for(let S=0;S<i.count;S++)o[S]=new V,l[S]=new V;const c=new V,h=new V,f=new V,d=new it,u=new it,p=new it,_=new V,g=new V;function m(S,w,P){c.fromBufferAttribute(i,S),h.fromBufferAttribute(i,w),f.fromBufferAttribute(i,P),d.fromBufferAttribute(a,S),u.fromBufferAttribute(a,w),p.fromBufferAttribute(a,P),h.sub(c),f.sub(c),u.sub(d),p.sub(d);const C=1/(u.x*p.y-p.x*u.y);isFinite(C)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(f,-u.y).multiplyScalar(C),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-p.x).multiplyScalar(C),o[S].add(_),o[w].add(_),o[P].add(_),l[S].add(g),l[w].add(g),l[P].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let S=0,w=M.length;S<w;++S){const P=M[S],C=P.start,L=P.count;for(let z=C,B=C+L;z<B;z+=3)m(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const v=new V,x=new V,y=new V,E=new V;function A(S){y.fromBufferAttribute(n,S),E.copy(y);const w=o[S];v.copy(w),v.sub(y.multiplyScalar(y.dot(w))).normalize(),x.crossVectors(E,w);const C=x.dot(l[S])<0?-1:1;r.setXYZW(S,v.x,v.y,v.z,C)}for(let S=0,w=M.length;S<w;++S){const P=M[S],C=P.start,L=P.count;for(let z=C,B=C+L;z<B;z+=3)A(e.getX(z+0)),A(e.getX(z+1)),A(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ni(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const n=new V,a=new V,r=new V,o=new V,l=new V,c=new V,h=new V,f=new V;if(e)for(let d=0,u=e.count;d<u;d+=3){const p=e.getX(d+0),_=e.getX(d+1),g=e.getX(d+2);n.fromBufferAttribute(t,p),a.fromBufferAttribute(t,_),r.fromBufferAttribute(t,g),h.subVectors(r,a),f.subVectors(n,a),h.cross(f),o.fromBufferAttribute(i,p),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),o.add(h),l.add(h),c.add(h),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,u=t.count;d<u;d+=3)n.fromBufferAttribute(t,d+0),a.fromBufferAttribute(t,d+1),r.fromBufferAttribute(t,d+2),h.subVectors(r,a),f.subVectors(n,a),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ot.fromBufferAttribute(e,t),Ot.normalize(),e.setXYZ(t,Ot.x,Ot.y,Ot.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,d=new c.constructor(l.length*h);let u=0,p=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?u=l[_]*o.data.stride+o.offset:u=l[_]*h;for(let m=0;m<h;m++)d[p++]=c[u++]}return new Ni(d,h,f)}if(this.index===null)return De("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new bi,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=e(l,i);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=e(d,i);l.push(u)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const n={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(e.data))}h.length>0&&(n[l]=h,a=!0)}a&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const n=e.attributes;for(const c in n){const h=n[c];this.setAttribute(c,h.clone(t))}const a=e.morphAttributes;for(const c in a){const h=[],f=a[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let c=0,h=r.length;c<h;c++){const f=r[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let Cu=0;class qs extends Wn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Cu++}),this.uuid=Xs(),this.name="",this.type="Material",this.blending=hs,this.side=vn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=co,this.blendDst=ho,this.blendEquation=In,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new st(0,0,0),this.blendAlpha=0,this.depthFunc=us,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=uc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qn,this.stencilZFail=qn,this.stencilZPass=qn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){De(`Material: parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){De(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==hs&&(i.blending=this.blending),this.side!==vn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==co&&(i.blendSrc=this.blendSrc),this.blendDst!==ho&&(i.blendDst=this.blendDst),this.blendEquation!==In&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==us&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==uc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==qn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==qn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==qn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(t){const a=n(e.textures),r=n(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const n=t.length;i=new Array(n);for(let a=0;a!==n;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Wi=new V,Ur=new V,aa=new V,cn=new V,Br=new V,ra=new V,Fr=new V;class Pu{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Wi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Wi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Wi.copy(this.origin).addScaledVector(this.direction,t),Wi.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){Ur.copy(e).add(t).multiplyScalar(.5),aa.copy(t).sub(e).normalize(),cn.copy(this.origin).sub(Ur);const a=e.distanceTo(t)*.5,r=-this.direction.dot(aa),o=cn.dot(this.direction),l=-cn.dot(aa),c=cn.lengthSq(),h=Math.abs(1-r*r);let f,d,u,p;if(h>0)if(f=r*l-o,d=r*o-l,p=a*h,f>=0)if(d>=-p)if(d<=p){const _=1/h;f*=_,d*=_,u=f*(f+r*d+2*o)+d*(r*f+d+2*l)+c}else d=a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*l)+c;else d=-a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*l)+c;else d<=-p?(f=Math.max(0,-(-r*a+o)),d=f>0?-a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c):d<=p?(f=0,d=Math.min(Math.max(-a,-l),a),u=d*(d+2*l)+c):(f=Math.max(0,-(r*a+o)),d=f>0?a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c);else d=r>0?-a:a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),n&&n.copy(Ur).addScaledVector(aa,d),u}intersectSphere(e,t){Wi.subVectors(e.center,this.origin);const i=Wi.dot(this.direction),n=Wi.dot(Wi)-i*i,a=e.radius*e.radius;if(n>a)return null;const r=Math.sqrt(a-n),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,a,r,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,n=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,n=(e.min.x-d.x)*c),h>=0?(a=(e.min.y-d.y)*h,r=(e.max.y-d.y)*h):(a=(e.max.y-d.y)*h,r=(e.min.y-d.y)*h),i>r||a>n||((a>i||isNaN(i))&&(i=a),(r<n||isNaN(n))&&(n=r),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,t)}intersectsBox(e){return this.intersectBox(e,Wi)!==null}intersectTriangle(e,t,i,n,a){Br.subVectors(t,e),ra.subVectors(i,e),Fr.crossVectors(Br,ra);let r=this.direction.dot(Fr),o;if(r>0){if(n)return null;o=1}else if(r<0)o=-1,r=-r;else return null;cn.subVectors(this.origin,e);const l=o*this.direction.dot(ra.crossVectors(cn,ra));if(l<0)return null;const c=o*this.direction.dot(Br.cross(cn));if(c<0||l+c>r)return null;const h=-o*cn.dot(Fr);return h<0?null:this.at(h/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Us extends qs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new st(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=Nh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Cc=new At,wn=new Pu,oa=new Tl,Pc=new V,la=new V,ca=new V,ha=new V,Or=new V,da=new V,Ic=new V,fa=new V;class ft extends qt{constructor(e=new bi,t=new Us){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=n.length;a<r;a++){const o=n[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,n=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(n,e);const o=this.morphTargetInfluences;if(a&&o){da.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=o[l],f=a[l];h!==0&&(Or.fromBufferAttribute(f,e),r?da.addScaledVector(Or,h):da.addScaledVector(Or.sub(t),h))}t.add(da)}return t}raycast(e,t){const i=this.geometry,n=this.material,a=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),oa.copy(i.boundingSphere),oa.applyMatrix4(a),wn.copy(e.ray).recast(e.near),!(oa.containsPoint(wn.origin)===!1&&(wn.intersectSphere(oa,Pc)===null||wn.origin.distanceToSquared(Pc)>(e.far-e.near)**2))&&(Cc.copy(a).invert(),wn.copy(e.ray).applyMatrix4(Cc),!(i.boundingBox!==null&&wn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,wn)))}_computeIntersections(e,t,i){let n;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,d=a.groups,u=a.drawRange;if(o!==null)if(Array.isArray(r))for(let p=0,_=d.length;p<_;p++){const g=d[p],m=r[g.materialIndex],M=Math.max(g.start,u.start),v=Math.min(o.count,Math.min(g.start+g.count,u.start+u.count));for(let x=M,y=v;x<y;x+=3){const E=o.getX(x),A=o.getX(x+1),S=o.getX(x+2);n=ua(this,m,e,i,c,h,f,E,A,S),n&&(n.faceIndex=Math.floor(x/3),n.face.materialIndex=g.materialIndex,t.push(n))}}else{const p=Math.max(0,u.start),_=Math.min(o.count,u.start+u.count);for(let g=p,m=_;g<m;g+=3){const M=o.getX(g),v=o.getX(g+1),x=o.getX(g+2);n=ua(this,r,e,i,c,h,f,M,v,x),n&&(n.faceIndex=Math.floor(g/3),t.push(n))}}else if(l!==void 0)if(Array.isArray(r))for(let p=0,_=d.length;p<_;p++){const g=d[p],m=r[g.materialIndex],M=Math.max(g.start,u.start),v=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let x=M,y=v;x<y;x+=3){const E=x,A=x+1,S=x+2;n=ua(this,m,e,i,c,h,f,E,A,S),n&&(n.faceIndex=Math.floor(x/3),n.face.materialIndex=g.materialIndex,t.push(n))}}else{const p=Math.max(0,u.start),_=Math.min(l.count,u.start+u.count);for(let g=p,m=_;g<m;g+=3){const M=g,v=g+1,x=g+2;n=ua(this,r,e,i,c,h,f,M,v,x),n&&(n.faceIndex=Math.floor(g/3),t.push(n))}}}}function Iu(s,e,t,i,n,a,r,o){let l;if(e.side===Qt?l=i.intersectTriangle(r,a,n,!0,o):l=i.intersectTriangle(n,a,r,e.side===vn,o),l===null)return null;fa.copy(o),fa.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(fa);return c<t.near||c>t.far?null:{distance:c,point:fa.clone(),object:s}}function ua(s,e,t,i,n,a,r,o,l,c){s.getVertexPosition(o,la),s.getVertexPosition(l,ca),s.getVertexPosition(c,ha);const h=Iu(s,e,t,i,la,ca,ha,Ic);if(h){const f=new V;yi.getBarycoord(Ic,la,ca,ha,f),n&&(h.uv=yi.getInterpolatedAttribute(n,o,l,c,f,new it)),a&&(h.uv1=yi.getInterpolatedAttribute(a,o,l,c,f,new it)),r&&(h.normal=yi.getInterpolatedAttribute(r,o,l,c,f,new V),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new V,materialIndex:0};yi.getNormal(la,ca,ha,d.normal),h.face=d,h.barycoord=f}return h}class Lu extends jt{constructor(e=null,t=1,i=1,n,a,r,o,l,c=Vt,h=Vt,f,d){super(null,r,o,l,c,h,n,a,f,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const zr=new V,Du=new V,Nu=new Ue;class Rn{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const n=zr.subVectors(i,t).cross(Du.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const n=e.delta(zr),a=this.normal.dot(n);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/a;return i===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Nu.getNormalMatrix(e),n=this.coplanarPoint(zr).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const An=new Tl,ku=new it(.5,.5),pa=new V;class wl{constructor(e=new Rn,t=new Rn,i=new Rn,n=new Rn,a=new Rn,r=new Rn){this.planes=[e,t,i,n,a,r]}set(e,t,i,n,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Pi,i=!1){const n=this.planes,a=e.elements,r=a[0],o=a[1],l=a[2],c=a[3],h=a[4],f=a[5],d=a[6],u=a[7],p=a[8],_=a[9],g=a[10],m=a[11],M=a[12],v=a[13],x=a[14],y=a[15];if(n[0].setComponents(c-r,u-h,m-p,y-M).normalize(),n[1].setComponents(c+r,u+h,m+p,y+M).normalize(),n[2].setComponents(c+o,u+f,m+_,y+v).normalize(),n[3].setComponents(c-o,u-f,m-_,y-v).normalize(),i)n[4].setComponents(l,d,g,x).normalize(),n[5].setComponents(c-l,u-d,m-g,y-x).normalize();else if(n[4].setComponents(c-l,u-d,m-g,y-x).normalize(),t===Pi)n[5].setComponents(c+l,u+d,m+g,y+x).normalize();else if(t===Hs)n[5].setComponents(l,d,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),An.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),An.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(An)}intersectsSprite(e){An.center.set(0,0,0);const t=ku.distanceTo(e.center);return An.radius=.7071067811865476+t,An.applyMatrix4(e.matrixWorld),this.intersectsSphere(An)}intersectsSphere(e){const t=this.planes,i=e.center,n=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const n=t[i];if(pa.x=n.normal.x>0?e.max.x:e.min.x,pa.y=n.normal.y>0?e.max.y:e.min.y,pa.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(pa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class id extends jt{constructor(e=[],t=zn,i,n,a,r,o,l,c,h){super(e,t,i,n,a,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ms extends jt{constructor(e,t,i=Ui,n,a,r,o=Vt,l=Vt,c,h=en,f=1){if(h!==en&&h!==Nn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:f};super(d,n,a,r,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new El(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Uu extends ms{constructor(e,t=Ui,i=zn,n,a,r=Vt,o=Vt,l,c=en){const h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,i,n,a,r,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class nd extends jt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class _n extends bi{constructor(e=1,t=1,i=1,n=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:a,depthSegments:r};const o=this;n=Math.floor(n),a=Math.floor(a),r=Math.floor(r);const l=[],c=[],h=[],f=[];let d=0,u=0;p("z","y","x",-1,-1,i,t,e,r,a,0),p("z","y","x",1,-1,i,t,-e,r,a,1),p("x","z","y",1,1,e,i,t,n,r,2),p("x","z","y",1,-1,e,i,-t,n,r,3),p("x","y","z",1,-1,e,t,i,n,a,4),p("x","y","z",-1,-1,e,t,-i,n,a,5),this.setIndex(l),this.setAttribute("position",new Zt(c,3)),this.setAttribute("normal",new Zt(h,3)),this.setAttribute("uv",new Zt(f,2));function p(_,g,m,M,v,x,y,E,A,S,w){const P=x/A,C=y/S,L=x/2,z=y/2,B=E/2,I=A+1,U=S+1;let N=0,$=0;const te=new V;for(let se=0;se<U;se++){const G=se*C-z;for(let ee=0;ee<I;ee++){const ae=ee*P-L;te[_]=ae*M,te[g]=G*v,te[m]=B,c.push(te.x,te.y,te.z),te[_]=0,te[g]=0,te[m]=E>0?1:-1,h.push(te.x,te.y,te.z),f.push(ee/A),f.push(1-se/S),N+=1}}for(let se=0;se<S;se++)for(let G=0;G<A;G++){const ee=d+G+I*se,ae=d+G+I*(se+1),Te=d+(G+1)+I*(se+1),be=d+(G+1)+I*se;l.push(ee,ae,be),l.push(ae,Te,be),$+=6}o.addGroup(u,$,w),u+=$,d+=N}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class dn extends bi{constructor(e=1,t=1,i=1,n=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};const c=this;n=Math.floor(n),a=Math.floor(a);const h=[],f=[],d=[],u=[];let p=0;const _=[],g=i/2;let m=0;M(),r===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Zt(f,3)),this.setAttribute("normal",new Zt(d,3)),this.setAttribute("uv",new Zt(u,2));function M(){const x=new V,y=new V;let E=0;const A=(t-e)/i;for(let S=0;S<=a;S++){const w=[],P=S/a,C=P*(t-e)+e;for(let L=0;L<=n;L++){const z=L/n,B=z*l+o,I=Math.sin(B),U=Math.cos(B);y.x=C*I,y.y=-P*i+g,y.z=C*U,f.push(y.x,y.y,y.z),x.set(I,A,U).normalize(),d.push(x.x,x.y,x.z),u.push(z,1-P),w.push(p++)}_.push(w)}for(let S=0;S<n;S++)for(let w=0;w<a;w++){const P=_[w][S],C=_[w+1][S],L=_[w+1][S+1],z=_[w][S+1];(e>0||w!==0)&&(h.push(P,C,z),E+=3),(t>0||w!==a-1)&&(h.push(C,L,z),E+=3)}c.addGroup(m,E,0),m+=E}function v(x){const y=p,E=new it,A=new V;let S=0;const w=x===!0?e:t,P=x===!0?1:-1;for(let L=1;L<=n;L++)f.push(0,g*P,0),d.push(0,P,0),u.push(.5,.5),p++;const C=p;for(let L=0;L<=n;L++){const B=L/n*l+o,I=Math.cos(B),U=Math.sin(B);A.x=w*U,A.y=g*P,A.z=w*I,f.push(A.x,A.y,A.z),d.push(0,P,0),E.x=I*.5+.5,E.y=U*.5*P+.5,u.push(E.x,E.y),p++}for(let L=0;L<n;L++){const z=y+L,B=C+L;x===!0?h.push(B,B+1,z):h.push(B+1,B,z),S+=3}c.addGroup(m,S,x===!0?1:2),m+=S}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ir extends bi{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};const a=e/2,r=t/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,f=e/o,d=t/l,u=[],p=[],_=[],g=[];for(let m=0;m<h;m++){const M=m*d-r;for(let v=0;v<c;v++){const x=v*f-a;p.push(x,-M,0),_.push(0,0,1),g.push(v/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let M=0;M<o;M++){const v=M+c*m,x=M+c*(m+1),y=M+1+c*(m+1),E=M+1+c*m;u.push(v,x,E),u.push(x,y,E)}this.setIndex(u),this.setAttribute("position",new Zt(p,3)),this.setAttribute("normal",new Zt(_,3)),this.setAttribute("uv",new Zt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ir(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ka extends bi{constructor(e=1,t=32,i=16,n=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(r+o,Math.PI);let c=0;const h=[],f=new V,d=new V,u=[],p=[],_=[],g=[];for(let m=0;m<=i;m++){const M=[],v=m/i;let x=0;m===0&&r===0?x=.5/t:m===i&&l===Math.PI&&(x=-.5/t);for(let y=0;y<=t;y++){const E=y/t;f.x=-e*Math.cos(n+E*a)*Math.sin(r+v*o),f.y=e*Math.cos(r+v*o),f.z=e*Math.sin(n+E*a)*Math.sin(r+v*o),p.push(f.x,f.y,f.z),d.copy(f).normalize(),_.push(d.x,d.y,d.z),g.push(E+x,1-v),M.push(c++)}h.push(M)}for(let m=0;m<i;m++)for(let M=0;M<t;M++){const v=h[m][M+1],x=h[m][M],y=h[m+1][M],E=h[m+1][M+1];(m!==0||r>0)&&u.push(v,x,E),(m!==i-1||l<Math.PI)&&u.push(x,y,E)}this.setIndex(u),this.setAttribute("position",new Zt(p,3)),this.setAttribute("normal",new Zt(_,3)),this.setAttribute("uv",new Zt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ka(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function gs(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const n=s[t][i];if(Lc(n))n.isRenderTargetTexture?(De("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone();else if(Array.isArray(n))if(Lc(n[0])){const a=[];for(let r=0,o=n.length;r<o;r++)a[r]=n[r].clone();e[t][i]=a}else e[t][i]=n.slice();else e[t][i]=n}}return e}function Yt(s){const e={};for(let t=0;t<s.length;t++){const i=gs(s[t]);for(const n in i)e[n]=i[n]}return e}function Lc(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Bu(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function sd(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const Fu={clone:gs,merge:Yt};var Ou=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Bi extends qs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ou,this.fragmentShader=zu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=gs(e.uniforms),this.uniformsGroups=Bu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const n in this.uniforms){const r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:"m4",value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Vu extends Bi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Vr extends qs{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new st(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new st(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zo,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Hu extends qs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Qf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Wu extends qs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class ad extends qt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new st(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const Hr=new At,Dc=new V,Nc=new V;class Gu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new it(512,512),this.mapType=ri,this.map=null,this.mapPass=null,this.matrix=new At,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new wl,this._frameExtents=new it(1,1),this._viewportCount=1,this._viewports=[new Mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Dc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Dc),Nc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Nc),t.updateMatrixWorld(),Hr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Hr,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Hs||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Hr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ma=new V,ga=new Ms,wi=new V;class rd extends qt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new At,this.projectionMatrix=new At,this.projectionMatrixInverse=new At,this.coordinateSystem=Pi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ma,ga,wi),wi.x===1&&wi.y===1&&wi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ma,ga,wi.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(ma,ga,wi),wi.x===1&&wi.y===1&&wi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ma,ga,wi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const hn=new V,kc=new it,Uc=new it;class gi extends rd{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Qo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(yr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Qo*2*Math.atan(Math.tan(yr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){hn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(hn.x,hn.y).multiplyScalar(-e/hn.z),hn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(hn.x,hn.y).multiplyScalar(-e/hn.z)}getViewSize(e,t){return this.getViewBounds(e,kc,Uc),t.subVectors(Uc,kc)}setViewOffset(e,t,i,n,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(yr*.5*this.fov)/this.zoom,i=2*t,n=this.aspect*i,a=-.5*n;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*n/l,t-=r.offsetY*i/c,n*=r.width/l,i*=r.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+n,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class nr extends rd{constructor(e=-1,t=1,i=1,n=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=n+t,l=n-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Xu extends Gu{constructor(){super(new nr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Bc extends ad{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(qt.DEFAULT_UP),this.updateMatrix(),this.target=new qt,this.shadow=new Xu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class qu extends ad{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const ns=-90,ss=1;class Yu extends qt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new gi(ns,ss,e,t);n.layers=this.layers,this.add(n);const a=new gi(ns,ss,e,t);a.layers=this.layers,this.add(a);const r=new gi(ns,ss,e,t);r.layers=this.layers,this.add(r);const o=new gi(ns,ss,e,t);o.layers=this.layers,this.add(o);const l=new gi(ns,ss,e,t);l.layers=this.layers,this.add(l);const c=new gi(ns,ss,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,n,a,r,o,l]=t;for(const c of t)this.remove(c);if(e===Pi)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Hs)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,c,h]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,n),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,1,n),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,2,n),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,n),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,n),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,n),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,d,u),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class $u extends gi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const jl=class jl{constructor(e,t,i,n){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,n)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,n){const a=this.elements;return a[0]=e,a[2]=t,a[1]=i,a[3]=n,this}};jl.prototype.isMatrix2=!0;let Fc=jl;function Oc(s,e,t,i){const n=Ku(i);switch(t){case Yh:return s*e;case Kh:return s*e/n.components*n.byteLength;case _l:return s*e/n.components*n.byteLength;case Vn:return s*e*2/n.components*n.byteLength;case vl:return s*e*2/n.components*n.byteLength;case $h:return s*e*3/n.components*n.byteLength;case vi:return s*e*4/n.components*n.byteLength;case Sl:return s*e*4/n.components*n.byteLength;case Na:case ka:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Ua:case Ba:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Mo:case Eo:return Math.max(s,16)*Math.max(e,8)/4;case So:case bo:return Math.max(s,8)*Math.max(e,8)/2;case To:case wo:case Ro:case Co:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Ao:case Ga:case Po:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Io:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Lo:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Do:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case No:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case ko:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Uo:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Bo:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Fo:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Oo:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case zo:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Vo:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Ho:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Wo:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Go:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Xo:case qo:case Yo:return Math.ceil(s/4)*Math.ceil(e/4)*16;case $o:case Ko:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Xa:case jo:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ku(s){switch(s){case ri:case Wh:return{byteLength:1,components:1};case zs:case Gh:case Qi:return{byteLength:2,components:1};case yl:case xl:return{byteLength:2,components:4};case Ui:case gl:case Ci:return{byteLength:4,components:1};case Xh:case qh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ml}}));typeof window<"u"&&(window.__THREE__?De("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ml);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function od(){let s=null,e=!1,t=null,i=null;function n(a,r){t(a,r),i=s.requestAnimationFrame(n)}return{start:function(){e!==!0&&t!==null&&s!==null&&(i=s.requestAnimationFrame(n),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){s=a}}}function ju(s){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,f=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=s.HALF_FLOAT:u=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=s.SHORT;else if(c instanceof Uint32Array)u=s.UNSIGNED_INT;else if(c instanceof Int32Array)u=s.INT;else if(c instanceof Int8Array)u=s.BYTE;else if(c instanceof Uint8Array)u=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const h=l.array,f=l.updateRanges;if(s.bindBuffer(c,o),f.length===0)s.bufferSubData(c,0,h);else{f.sort((u,p)=>u.start-p.start);let d=0;for(let u=1;u<f.length;u++){const p=f[d],_=f[u];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++d,f[d]=_)}f.length=d+1;for(let u=0,p=f.length;u<p;u++){const _=f[u];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:a,update:r}}var Zu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ju=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Qu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ep=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ip=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,np=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,sp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ap=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,rp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,op=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,lp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,cp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,hp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,dp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,fp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,up=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,pp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,mp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,gp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,yp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,xp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,_p=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,vp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Sp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Mp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,bp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ep=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,wp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ap="gl_FragColor = linearToOutputTexel( gl_FragColor );",Rp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Cp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Pp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Ip=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Lp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Dp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Np=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,kp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Up=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Bp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Fp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Op=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,zp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Vp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Hp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Wp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Gp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Xp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Yp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$p=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Kp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,jp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Zp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Jp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Qp=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,em=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,tm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,im=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,sm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,am=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,rm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,om=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,cm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,hm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,dm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,fm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,um=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,pm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,gm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ym=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_m=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,vm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Sm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Mm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,bm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Em=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Tm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,wm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Am=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Rm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Cm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Im=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Lm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Dm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Nm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,km=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Um=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Bm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Fm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Om=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Vm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Hm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Wm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Gm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Xm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,qm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ym=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$m=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Km=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,jm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Zm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Jm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,e0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,t0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,i0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,s0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,a0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,r0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,o0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,l0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,c0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,h0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,d0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,f0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,p0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,m0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,g0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,y0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,x0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,_0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,v0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,M0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,b0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,E0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,T0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,w0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,A0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,R0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,C0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,P0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ve={alphahash_fragment:Zu,alphahash_pars_fragment:Ju,alphamap_fragment:Qu,alphamap_pars_fragment:ep,alphatest_fragment:tp,alphatest_pars_fragment:ip,aomap_fragment:np,aomap_pars_fragment:sp,batching_pars_vertex:ap,batching_vertex:rp,begin_vertex:op,beginnormal_vertex:lp,bsdfs:cp,iridescence_fragment:hp,bumpmap_pars_fragment:dp,clipping_planes_fragment:fp,clipping_planes_pars_fragment:up,clipping_planes_pars_vertex:pp,clipping_planes_vertex:mp,color_fragment:gp,color_pars_fragment:yp,color_pars_vertex:xp,color_vertex:_p,common:vp,cube_uv_reflection_fragment:Sp,defaultnormal_vertex:Mp,displacementmap_pars_vertex:bp,displacementmap_vertex:Ep,emissivemap_fragment:Tp,emissivemap_pars_fragment:wp,colorspace_fragment:Ap,colorspace_pars_fragment:Rp,envmap_fragment:Cp,envmap_common_pars_fragment:Pp,envmap_pars_fragment:Ip,envmap_pars_vertex:Lp,envmap_physical_pars_fragment:Wp,envmap_vertex:Dp,fog_vertex:Np,fog_pars_vertex:kp,fog_fragment:Up,fog_pars_fragment:Bp,gradientmap_pars_fragment:Fp,lightmap_pars_fragment:Op,lights_lambert_fragment:zp,lights_lambert_pars_fragment:Vp,lights_pars_begin:Hp,lights_toon_fragment:Gp,lights_toon_pars_fragment:Xp,lights_phong_fragment:qp,lights_phong_pars_fragment:Yp,lights_physical_fragment:$p,lights_physical_pars_fragment:Kp,lights_fragment_begin:jp,lights_fragment_maps:Zp,lights_fragment_end:Jp,lightprobes_pars_fragment:Qp,logdepthbuf_fragment:em,logdepthbuf_pars_fragment:tm,logdepthbuf_pars_vertex:im,logdepthbuf_vertex:nm,map_fragment:sm,map_pars_fragment:am,map_particle_fragment:rm,map_particle_pars_fragment:om,metalnessmap_fragment:lm,metalnessmap_pars_fragment:cm,morphinstance_vertex:hm,morphcolor_vertex:dm,morphnormal_vertex:fm,morphtarget_pars_vertex:um,morphtarget_vertex:pm,normal_fragment_begin:mm,normal_fragment_maps:gm,normal_pars_fragment:ym,normal_pars_vertex:xm,normal_vertex:_m,normalmap_pars_fragment:vm,clearcoat_normal_fragment_begin:Sm,clearcoat_normal_fragment_maps:Mm,clearcoat_pars_fragment:bm,iridescence_pars_fragment:Em,opaque_fragment:Tm,packing:wm,premultiplied_alpha_fragment:Am,project_vertex:Rm,dithering_fragment:Cm,dithering_pars_fragment:Pm,roughnessmap_fragment:Im,roughnessmap_pars_fragment:Lm,shadowmap_pars_fragment:Dm,shadowmap_pars_vertex:Nm,shadowmap_vertex:km,shadowmask_pars_fragment:Um,skinbase_vertex:Bm,skinning_pars_vertex:Fm,skinning_vertex:Om,skinnormal_vertex:zm,specularmap_fragment:Vm,specularmap_pars_fragment:Hm,tonemapping_fragment:Wm,tonemapping_pars_fragment:Gm,transmission_fragment:Xm,transmission_pars_fragment:qm,uv_pars_fragment:Ym,uv_pars_vertex:$m,uv_vertex:Km,worldpos_vertex:jm,background_vert:Zm,background_frag:Jm,backgroundCube_vert:Qm,backgroundCube_frag:e0,cube_vert:t0,cube_frag:i0,depth_vert:n0,depth_frag:s0,distance_vert:a0,distance_frag:r0,equirect_vert:o0,equirect_frag:l0,linedashed_vert:c0,linedashed_frag:h0,meshbasic_vert:d0,meshbasic_frag:f0,meshlambert_vert:u0,meshlambert_frag:p0,meshmatcap_vert:m0,meshmatcap_frag:g0,meshnormal_vert:y0,meshnormal_frag:x0,meshphong_vert:_0,meshphong_frag:v0,meshphysical_vert:S0,meshphysical_frag:M0,meshtoon_vert:b0,meshtoon_frag:E0,points_vert:T0,points_frag:w0,shadow_vert:A0,shadow_frag:R0,sprite_vert:C0,sprite_frag:P0},pe={common:{diffuse:{value:new st(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new st(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new st(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new st(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},Ri={basic:{uniforms:Yt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:Yt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new st(0)},envMapIntensity:{value:1}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:Yt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new st(0)},specular:{value:new st(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:Yt([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new st(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:Yt([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new st(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:Yt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:Yt([pe.points,pe.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:Yt([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:Yt([pe.common,pe.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:Yt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:Yt([pe.sprite,pe.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distance:{uniforms:Yt([pe.common,pe.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distance_vert,fragmentShader:Ve.distance_frag},shadow:{uniforms:Yt([pe.lights,pe.fog,{color:{value:new st(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};Ri.physical={uniforms:Yt([Ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new st(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new st(0)},specularColor:{value:new st(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new it},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};const ya={r:0,b:0,g:0},I0=new At,ld=new Ue;ld.set(-1,0,0,0,1,0,0,0,1);function L0(s,e,t,i,n,a){const r=new st(0);let o=n===!0?0:1,l,c,h=null,f=0,d=null;function u(M){let v=M.isScene===!0?M.background:null;if(v&&v.isTexture){const x=M.backgroundBlurriness>0;v=e.get(v,x)}return v}function p(M){let v=!1;const x=u(M);x===null?g(r,o):x&&x.isColor&&(g(x,1),v=!0);const y=s.xr.getEnvironmentBlendMode();y==="additive"?t.buffers.color.setClear(0,0,0,1,a):y==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,a),(s.autoClear||v)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function _(M,v){const x=u(v);x&&(x.isCubeTexture||x.mapping===tr)?(c===void 0&&(c=new ft(new _n(1,1,1),new Bi({name:"BackgroundCubeMaterial",uniforms:gs(Ri.backgroundCube.uniforms),vertexShader:Ri.backgroundCube.vertexShader,fragmentShader:Ri.backgroundCube.fragmentShader,side:Qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(y,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(I0.makeRotationFromEuler(v.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(ld),c.material.toneMapped=$e.getTransfer(x.colorSpace)!==rt,(h!==x||f!==x.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=x,f=x.version,d=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new ft(new ir(2,2),new Bi({name:"BackgroundMaterial",uniforms:gs(Ri.background.uniforms),vertexShader:Ri.background.vertexShader,fragmentShader:Ri.background.fragmentShader,side:vn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=$e.getTransfer(x.colorSpace)!==rt,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||f!==x.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=x,f=x.version,d=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function g(M,v){M.getRGB(ya,sd(s)),t.buffers.color.setClear(ya.r,ya.g,ya.b,v,a)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(M,v=1){r.set(M),o=v,g(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,g(r,o)},render:p,addToRenderList:_,dispose:m}}function D0(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},n=d(null);let a=n,r=!1;function o(C,L,z,B,I){let U=!1;const N=f(C,B,z,L);a!==N&&(a=N,c(a.object)),U=u(C,B,z,I),U&&p(C,B,z,I),I!==null&&e.update(I,s.ELEMENT_ARRAY_BUFFER),(U||r)&&(r=!1,x(C,L,z,B),I!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(I).buffer))}function l(){return s.createVertexArray()}function c(C){return s.bindVertexArray(C)}function h(C){return s.deleteVertexArray(C)}function f(C,L,z,B){const I=B.wireframe===!0;let U=i[L.id];U===void 0&&(U={},i[L.id]=U);const N=C.isInstancedMesh===!0?C.id:0;let $=U[N];$===void 0&&($={},U[N]=$);let te=$[z.id];te===void 0&&(te={},$[z.id]=te);let se=te[I];return se===void 0&&(se=d(l()),te[I]=se),se}function d(C){const L=[],z=[],B=[];for(let I=0;I<t;I++)L[I]=0,z[I]=0,B[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:z,attributeDivisors:B,object:C,attributes:{},index:null}}function u(C,L,z,B){const I=a.attributes,U=L.attributes;let N=0;const $=z.getAttributes();for(const te in $)if($[te].location>=0){const G=I[te];let ee=U[te];if(ee===void 0&&(te==="instanceMatrix"&&C.instanceMatrix&&(ee=C.instanceMatrix),te==="instanceColor"&&C.instanceColor&&(ee=C.instanceColor)),G===void 0||G.attribute!==ee||ee&&G.data!==ee.data)return!0;N++}return a.attributesNum!==N||a.index!==B}function p(C,L,z,B){const I={},U=L.attributes;let N=0;const $=z.getAttributes();for(const te in $)if($[te].location>=0){let G=U[te];G===void 0&&(te==="instanceMatrix"&&C.instanceMatrix&&(G=C.instanceMatrix),te==="instanceColor"&&C.instanceColor&&(G=C.instanceColor));const ee={};ee.attribute=G,G&&G.data&&(ee.data=G.data),I[te]=ee,N++}a.attributes=I,a.attributesNum=N,a.index=B}function _(){const C=a.newAttributes;for(let L=0,z=C.length;L<z;L++)C[L]=0}function g(C){m(C,0)}function m(C,L){const z=a.newAttributes,B=a.enabledAttributes,I=a.attributeDivisors;z[C]=1,B[C]===0&&(s.enableVertexAttribArray(C),B[C]=1),I[C]!==L&&(s.vertexAttribDivisor(C,L),I[C]=L)}function M(){const C=a.newAttributes,L=a.enabledAttributes;for(let z=0,B=L.length;z<B;z++)L[z]!==C[z]&&(s.disableVertexAttribArray(z),L[z]=0)}function v(C,L,z,B,I,U,N){N===!0?s.vertexAttribIPointer(C,L,z,I,U):s.vertexAttribPointer(C,L,z,B,I,U)}function x(C,L,z,B){_();const I=B.attributes,U=z.getAttributes(),N=L.defaultAttributeValues;for(const $ in U){const te=U[$];if(te.location>=0){let se=I[$];if(se===void 0&&($==="instanceMatrix"&&C.instanceMatrix&&(se=C.instanceMatrix),$==="instanceColor"&&C.instanceColor&&(se=C.instanceColor)),se!==void 0){const G=se.normalized,ee=se.itemSize,ae=e.get(se);if(ae===void 0)continue;const Te=ae.buffer,be=ae.type,q=ae.bytesPerElement,J=be===s.INT||be===s.UNSIGNED_INT||se.gpuType===gl;if(se.isInterleavedBufferAttribute){const j=se.data,Ee=j.stride,Re=se.offset;if(j.isInstancedInterleavedBuffer){for(let Pe=0;Pe<te.locationSize;Pe++)m(te.location+Pe,j.meshPerAttribute);C.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Pe=0;Pe<te.locationSize;Pe++)g(te.location+Pe);s.bindBuffer(s.ARRAY_BUFFER,Te);for(let Pe=0;Pe<te.locationSize;Pe++)v(te.location+Pe,ee/te.locationSize,be,G,Ee*q,(Re+ee/te.locationSize*Pe)*q,J)}else{if(se.isInstancedBufferAttribute){for(let j=0;j<te.locationSize;j++)m(te.location+j,se.meshPerAttribute);C.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let j=0;j<te.locationSize;j++)g(te.location+j);s.bindBuffer(s.ARRAY_BUFFER,Te);for(let j=0;j<te.locationSize;j++)v(te.location+j,ee/te.locationSize,be,G,ee*q,ee/te.locationSize*j*q,J)}}else if(N!==void 0){const G=N[$];if(G!==void 0)switch(G.length){case 2:s.vertexAttrib2fv(te.location,G);break;case 3:s.vertexAttrib3fv(te.location,G);break;case 4:s.vertexAttrib4fv(te.location,G);break;default:s.vertexAttrib1fv(te.location,G)}}}}M()}function y(){w();for(const C in i){const L=i[C];for(const z in L){const B=L[z];for(const I in B){const U=B[I];for(const N in U)h(U[N].object),delete U[N];delete B[I]}}delete i[C]}}function E(C){if(i[C.id]===void 0)return;const L=i[C.id];for(const z in L){const B=L[z];for(const I in B){const U=B[I];for(const N in U)h(U[N].object),delete U[N];delete B[I]}}delete i[C.id]}function A(C){for(const L in i){const z=i[L];for(const B in z){const I=z[B];if(I[C.id]===void 0)continue;const U=I[C.id];for(const N in U)h(U[N].object),delete U[N];delete I[C.id]}}}function S(C){for(const L in i){const z=i[L],B=C.isInstancedMesh===!0?C.id:0,I=z[B];if(I!==void 0){for(const U in I){const N=I[U];for(const $ in N)h(N[$].object),delete N[$];delete I[U]}delete z[B],Object.keys(z).length===0&&delete i[L]}}}function w(){P(),r=!0,a!==n&&(a=n,c(a.object))}function P(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:w,resetDefaultState:P,dispose:y,releaseStatesOfGeometry:E,releaseStatesOfObject:S,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:g,disableUnusedAttributes:M}}function N0(s,e,t){let i;function n(l){i=l}function a(l,c){s.drawArrays(i,l,c),t.update(c,i,1)}function r(l,c,h){h!==0&&(s.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let u=0;u<h;u++)d+=c[u];t.update(d,i,1)}this.setMode=n,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function k0(s,e,t,i){let n;function a(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){return!(A!==vi&&i.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const S=A===Qi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==ri&&i.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Ci&&!S)}function l(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(De("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&De("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),v=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),y=s.getParameter(s.MAX_SAMPLES),E=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:u,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:M,maxVaryings:v,maxFragmentUniforms:x,maxSamples:y,samples:E}}function U0(s){const e=this;let t=null,i=0,n=!1,a=!1;const r=new Rn,o=new Ue,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||n;return n=d,i=f.length,u},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,d){t=h(f,d,0)},this.setState=function(f,d,u){const p=f.clippingPlanes,_=f.clipIntersection,g=f.clipShadows,m=s.get(f);if(!n||p===null||p.length===0||a&&!g)a?h(null):c();else{const M=a?0:i,v=M*4;let x=m.clippingState||null;l.value=x,x=h(p,d,v,u);for(let y=0;y!==v;++y)x[y]=t[y];m.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(f,d,u,p){const _=f!==null?f.length:0;let g=null;if(_!==0){if(g=l.value,p!==!0||g===null){const m=u+_*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(g===null||g.length<m)&&(g=new Float32Array(m));for(let v=0,x=u;v!==_;++v,x+=4)r.copy(f[v]).applyMatrix4(M,o),r.normal.toArray(g,x),g[x+3]=r.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}const pn=4,zc=[.125,.215,.35,.446,.526,.582],Ln=20,B0=256,Is=new nr,Vc=new st;let Wr=null,Gr=0,Xr=0,qr=!1;const F0=new V;class Hc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,n=100,a={}){const{size:r=256,position:o=F0}=a;Wr=this._renderer.getRenderTarget(),Gr=this._renderer.getActiveCubeFace(),Xr=this._renderer.getActiveMipmapLevel(),qr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,n,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Gc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Wr,Gr,Xr),this._renderer.xr.enabled=qr,e.scissorTest=!1,as(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===zn||e.mapping===ps?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Wr=this._renderer.getRenderTarget(),Gr=this._renderer.getActiveCubeFace(),Xr=this._renderer.getActiveMipmapLevel(),qr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Xt,minFilter:Xt,generateMipmaps:!1,type:Qi,format:vi,colorSpace:qa,depthBuffer:!1},n=Wc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Wc(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=O0(a)),this._blurMaterial=V0(a,e,t),this._ggxMaterial=z0(a,e,t)}return n}_compileMaterial(e){const t=new ft(new bi,e);this._renderer.compile(t,Is)}_sceneToCubeUV(e,t,i,n,a){const l=new gi(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,d=f.autoClear,u=f.toneMapping;f.getClearColor(Vc),f.toneMapping=Li,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(n),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ft(new _n,new Us({name:"PMREM.Background",side:Qt,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,g=_.material;let m=!1;const M=e.background;M?M.isColor&&(g.color.copy(M),e.background=null,m=!0):(g.color.copy(Vc),m=!0);for(let v=0;v<6;v++){const x=v%3;x===0?(l.up.set(0,c[v],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+h[v],a.y,a.z)):x===1?(l.up.set(0,0,c[v]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+h[v],a.z)):(l.up.set(0,c[v],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+h[v]));const y=this._cubeSize;as(n,x*y,v>2?y:0,y,y),f.setRenderTarget(n),m&&f.render(_,l),f.render(e,l)}f.toneMapping=u,f.autoClear=d,e.background=M}_textureToCubeUV(e,t){const i=this._renderer,n=e.mapping===zn||e.mapping===ps;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Gc());const a=n?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;as(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(r,Is)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const n=this._lodMeshes.length;for(let a=1;a<n;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const n=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;const l=r.uniforms,c=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),d=0+c*1.25,u=f*d,{_lodMax:p}=this,_=this._sizeLods[i],g=3*_*(i>p-pn?i-p+pn:0),m=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=u,l.mipInt.value=p-t,as(a,g,m,3*_,2*_),n.setRenderTarget(a),n.render(o,Is),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=p-i,as(e,g,m,3*_,2*_),n.setRenderTarget(e),n.render(o,Is)}_blur(e,t,i,n,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,n,"latitudinal",a),this._halfBlur(r,e,i,i,n,"longitudinal",a)}_halfBlur(e,t,i,n,a,r,o){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&Qe("blur direction must be either latitudinal or longitudinal!");const h=3,f=this._lodMeshes[n];f.material=c;const d=c.uniforms,u=this._sizeLods[i]-1,p=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*Ln-1),_=a/p,g=isFinite(a)?1+Math.floor(h*_):Ln;g>Ln&&De(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ln}`);const m=[];let M=0;for(let A=0;A<Ln;++A){const S=A/_,w=Math.exp(-S*S/2);m.push(w),A===0?M+=w:A<g&&(M+=2*w)}for(let A=0;A<m.length;A++)m[A]=m[A]/M;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=r==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:v}=this;d.dTheta.value=p,d.mipInt.value=v-i;const x=this._sizeLods[n],y=3*x*(n>v-pn?n-v+pn:0),E=4*(this._cubeSize-x);as(t,y,E,3*x,2*x),l.setRenderTarget(t),l.render(f,Is)}}function O0(s){const e=[],t=[],i=[];let n=s;const a=s-pn+1+zc.length;for(let r=0;r<a;r++){const o=Math.pow(2,n);e.push(o);let l=1/o;r>s-pn?l=zc[r-s+pn-1]:r===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,p=6,_=3,g=2,m=1,M=new Float32Array(_*p*u),v=new Float32Array(g*p*u),x=new Float32Array(m*p*u);for(let E=0;E<u;E++){const A=E%3*2/3-1,S=E>2?0:-1,w=[A,S,0,A+2/3,S,0,A+2/3,S+1,0,A,S,0,A+2/3,S+1,0,A,S+1,0];M.set(w,_*p*E),v.set(d,g*p*E);const P=[E,E,E,E,E,E];x.set(P,m*p*E)}const y=new bi;y.setAttribute("position",new Ni(M,_)),y.setAttribute("uv",new Ni(v,g)),y.setAttribute("faceIndex",new Ni(x,m)),i.push(new ft(y,null)),n>pn&&n--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function Wc(s,e,t){const i=new Di(s,e,t);return i.texture.mapping=tr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function as(s,e,t,i,n){s.viewport.set(e,t,i,n),s.scissor.set(e,t,i,n)}function z0(s,e,t){return new Bi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:B0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:sr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function V0(s,e,t){const i=new Float32Array(Ln),n=new V(0,1,0);return new Bi({name:"SphericalGaussianBlur",defines:{n:Ln,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:n}},vertexShader:sr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function Gc(){return new Bi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:sr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function Xc(){return new Bi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:sr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function sr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class cd extends Di{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];this.texture=new id(n),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new _n(5,5,5),a=new Bi({name:"CubemapFromEquirect",uniforms:gs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Qt,blending:Zi});a.uniforms.tEquirect.value=t;const r=new ft(n,a),o=t.minFilter;return t.minFilter===Dn&&(t.minFilter=Xt),new Yu(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,n=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,n);e.setRenderTarget(a)}}function H0(s){let e=new WeakMap,t=new WeakMap,i=null;function n(d,u=!1){return d==null?null:u?r(d):a(d)}function a(d){if(d&&d.isTexture){const u=d.mapping;if(u===pr||u===mr)if(e.has(d)){const p=e.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const _=new cd(p.height);return _.fromEquirectangularTexture(s,d),e.set(d,_),d.addEventListener("dispose",c),o(_.texture,d.mapping)}else return null}}return d}function r(d){if(d&&d.isTexture){const u=d.mapping,p=u===pr||u===mr,_=u===zn||u===ps;if(p||_){let g=t.get(d);const m=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return i===null&&(i=new Hc(s)),g=p?i.fromEquirectangular(d,g):i.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{const M=d.image;return p&&M&&M.height>0||_&&M&&l(M)?(i===null&&(i=new Hc(s)),g=p?i.fromEquirectangular(d):i.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function o(d,u){return u===pr?d.mapping=zn:u===mr&&(d.mapping=ps),d}function l(d){let u=0;const p=6;for(let _=0;_<p;_++)d[_]!==void 0&&u++;return u===p}function c(d){const u=d.target;u.removeEventListener("dispose",c);const p=e.get(u);p!==void 0&&(e.delete(u),p.dispose())}function h(d){const u=d.target;u.removeEventListener("dispose",h);const p=t.get(u);p!==void 0&&(t.delete(u),p.dispose())}function f(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:f}}function W0(s){const e={};function t(i){if(e[i]!==void 0)return e[i];const n=s.getExtension(i);return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const n=t(i);return n===null&&Jo("WebGLRenderer: "+i+" extension not supported."),n}}}function G0(s,e,t,i){const n={},a=new WeakMap;function r(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",r),delete n[d.id];const u=a.get(d);u&&(e.remove(u),a.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(f,d){return n[d.id]===!0||(d.addEventListener("dispose",r),n[d.id]=!0,t.memory.geometries++),d}function l(f){const d=f.attributes;for(const u in d)e.update(d[u],s.ARRAY_BUFFER)}function c(f){const d=[],u=f.index,p=f.attributes.position;let _=0;if(p===void 0)return;if(u!==null){const M=u.array;_=u.version;for(let v=0,x=M.length;v<x;v+=3){const y=M[v+0],E=M[v+1],A=M[v+2];d.push(y,E,E,A,A,y)}}else{const M=p.array;_=p.version;for(let v=0,x=M.length/3-1;v<x;v+=3){const y=v+0,E=v+1,A=v+2;d.push(y,E,E,A,A,y)}}const g=new(p.count>=65535?td:ed)(d,1);g.version=_;const m=a.get(f);m&&e.remove(m),a.set(f,g)}function h(f){const d=a.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return a.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function X0(s,e,t){let i;function n(f){i=f}let a,r;function o(f){a=f.type,r=f.bytesPerElement}function l(f,d){s.drawElements(i,d,a,f*r),t.update(d,i,1)}function c(f,d,u){u!==0&&(s.drawElementsInstanced(i,d,a,f*r,u),t.update(d,i,u))}function h(f,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,a,f,0,u);let _=0;for(let g=0;g<u;g++)_+=d[g];t.update(_,i,1)}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function q0(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case s.TRIANGLES:t.triangles+=o*(a/3);break;case s.LINES:t.lines+=o*(a/2);break;case s.LINE_STRIP:t.lines+=o*(a-1);break;case s.LINE_LOOP:t.lines+=o*a;break;case s.POINTS:t.points+=o*a;break;default:Qe("WebGLInfo: Unknown draw mode:",r);break}}function n(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:n,update:i}}function Y0(s,e,t){const i=new WeakMap,n=new Mt;function a(r,o,l){const c=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==f){let P=function(){S.dispose(),i.delete(o),o.removeEventListener("dispose",P)};var u=P;d!==void 0&&d.texture.dispose();const p=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let x=0;p===!0&&(x=1),_===!0&&(x=2),g===!0&&(x=3);let y=o.attributes.position.count*x,E=1;y>e.maxTextureSize&&(E=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const A=new Float32Array(y*E*4*f),S=new Zh(A,y,E,f);S.type=Ci,S.needsUpdate=!0;const w=x*4;for(let C=0;C<f;C++){const L=m[C],z=M[C],B=v[C],I=y*E*4*C;for(let U=0;U<L.count;U++){const N=U*w;p===!0&&(n.fromBufferAttribute(L,U),A[I+N+0]=n.x,A[I+N+1]=n.y,A[I+N+2]=n.z,A[I+N+3]=0),_===!0&&(n.fromBufferAttribute(z,U),A[I+N+4]=n.x,A[I+N+5]=n.y,A[I+N+6]=n.z,A[I+N+7]=0),g===!0&&(n.fromBufferAttribute(B,U),A[I+N+8]=n.x,A[I+N+9]=n.y,A[I+N+10]=n.z,A[I+N+11]=B.itemSize===4?n.w:1)}}d={count:f,texture:S,size:new it(y,E)},i.set(o,d),o.addEventListener("dispose",P)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",r.morphTexture,t);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];const _=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(s,"morphTargetBaseInfluence",_),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:a}}function $0(s,e,t,i,n){let a=new WeakMap;function r(c){const h=n.render.frame,f=c.geometry,d=e.get(c,f);if(a.get(d)!==h&&(e.update(d),a.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==h&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),a.set(c,h))),c.isSkinnedMesh){const u=c.skeleton;a.get(u)!==h&&(u.update(),a.set(u,h))}return d}function o(){a=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}const K0={[kh]:"LINEAR_TONE_MAPPING",[Uh]:"REINHARD_TONE_MAPPING",[Bh]:"CINEON_TONE_MAPPING",[Fh]:"ACES_FILMIC_TONE_MAPPING",[zh]:"AGX_TONE_MAPPING",[Vh]:"NEUTRAL_TONE_MAPPING",[Oh]:"CUSTOM_TONE_MAPPING"};function j0(s,e,t,i,n){const a=new Di(e,t,{type:s,depthBuffer:i,stencilBuffer:n,depthTexture:i?new ms(e,t):void 0}),r=new Di(e,t,{type:Qi,depthBuffer:!1,stencilBuffer:!1}),o=new bi;o.setAttribute("position",new Zt([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new Zt([0,2,0,0,2,0],2));const l=new Vu({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new ft(o,l),h=new nr(-1,1,1,-1,0,1);let f=null,d=null,u=!1,p,_=null,g=[],m=!1;this.setSize=function(M,v){a.setSize(M,v),r.setSize(M,v);for(let x=0;x<g.length;x++){const y=g[x];y.setSize&&y.setSize(M,v)}},this.setEffects=function(M){g=M,m=g.length>0&&g[0].isRenderPass===!0;const v=a.width,x=a.height;for(let y=0;y<g.length;y++){const E=g[y];E.setSize&&E.setSize(v,x)}},this.begin=function(M,v){if(u||M.toneMapping===Li&&g.length===0)return!1;if(_=v,v!==null){const x=v.width,y=v.height;(a.width!==x||a.height!==y)&&this.setSize(x,y)}return m===!1&&M.setRenderTarget(a),p=M.toneMapping,M.toneMapping=Li,!0},this.hasRenderPass=function(){return m},this.end=function(M,v){M.toneMapping=p,u=!0;let x=a,y=r;for(let E=0;E<g.length;E++){const A=g[E];if(A.enabled!==!1&&(A.render(M,y,x,v),A.needsSwap!==!1)){const S=x;x=y,y=S}}if(f!==M.outputColorSpace||d!==M.toneMapping){f=M.outputColorSpace,d=M.toneMapping,l.defines={},$e.getTransfer(f)===rt&&(l.defines.SRGB_TRANSFER="");const E=K0[d];E&&(l.defines[E]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=x.texture,M.setRenderTarget(_),M.render(c,h),_=null,u=!1},this.isCompositing=function(){return u},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),r.dispose(),o.dispose(),l.dispose()}}const hd=new jt,el=new ms(1,1),dd=new Zh,fd=new yu,ud=new id,qc=[],Yc=[],$c=new Float32Array(16),Kc=new Float32Array(9),jc=new Float32Array(4);function bs(s,e,t){const i=s[0];if(i<=0||i>0)return s;const n=e*t;let a=qc[n];if(a===void 0&&(a=new Float32Array(n),qc[n]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,s[r].toArray(a,o)}return a}function Bt(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function Ft(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function ar(s,e){let t=Yc[e];t===void 0&&(t=new Int32Array(e),Yc[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function Z0(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function J0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Bt(t,e))return;s.uniform2fv(this.addr,e),Ft(t,e)}}function Q0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Bt(t,e))return;s.uniform3fv(this.addr,e),Ft(t,e)}}function eg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Bt(t,e))return;s.uniform4fv(this.addr,e),Ft(t,e)}}function tg(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Bt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Ft(t,e)}else{if(Bt(t,i))return;jc.set(i),s.uniformMatrix2fv(this.addr,!1,jc),Ft(t,i)}}function ig(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Bt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Ft(t,e)}else{if(Bt(t,i))return;Kc.set(i),s.uniformMatrix3fv(this.addr,!1,Kc),Ft(t,i)}}function ng(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Bt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Ft(t,e)}else{if(Bt(t,i))return;$c.set(i),s.uniformMatrix4fv(this.addr,!1,$c),Ft(t,i)}}function sg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function ag(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Bt(t,e))return;s.uniform2iv(this.addr,e),Ft(t,e)}}function rg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Bt(t,e))return;s.uniform3iv(this.addr,e),Ft(t,e)}}function og(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Bt(t,e))return;s.uniform4iv(this.addr,e),Ft(t,e)}}function lg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function cg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Bt(t,e))return;s.uniform2uiv(this.addr,e),Ft(t,e)}}function hg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Bt(t,e))return;s.uniform3uiv(this.addr,e),Ft(t,e)}}function dg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Bt(t,e))return;s.uniform4uiv(this.addr,e),Ft(t,e)}}function fg(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let a;this.type===s.SAMPLER_2D_SHADOW?(el.compareFunction=t.isReversedDepthBuffer()?bl:Ml,a=el):a=hd,t.setTexture2D(e||a,n)}function ug(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||fd,n)}function pg(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||ud,n)}function mg(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||dd,n)}function gg(s){switch(s){case 5126:return Z0;case 35664:return J0;case 35665:return Q0;case 35666:return eg;case 35674:return tg;case 35675:return ig;case 35676:return ng;case 5124:case 35670:return sg;case 35667:case 35671:return ag;case 35668:case 35672:return rg;case 35669:case 35673:return og;case 5125:return lg;case 36294:return cg;case 36295:return hg;case 36296:return dg;case 35678:case 36198:case 36298:case 36306:case 35682:return fg;case 35679:case 36299:case 36307:return ug;case 35680:case 36300:case 36308:case 36293:return pg;case 36289:case 36303:case 36311:case 36292:return mg}}function yg(s,e){s.uniform1fv(this.addr,e)}function xg(s,e){const t=bs(e,this.size,2);s.uniform2fv(this.addr,t)}function _g(s,e){const t=bs(e,this.size,3);s.uniform3fv(this.addr,t)}function vg(s,e){const t=bs(e,this.size,4);s.uniform4fv(this.addr,t)}function Sg(s,e){const t=bs(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Mg(s,e){const t=bs(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function bg(s,e){const t=bs(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Eg(s,e){s.uniform1iv(this.addr,e)}function Tg(s,e){s.uniform2iv(this.addr,e)}function wg(s,e){s.uniform3iv(this.addr,e)}function Ag(s,e){s.uniform4iv(this.addr,e)}function Rg(s,e){s.uniform1uiv(this.addr,e)}function Cg(s,e){s.uniform2uiv(this.addr,e)}function Pg(s,e){s.uniform3uiv(this.addr,e)}function Ig(s,e){s.uniform4uiv(this.addr,e)}function Lg(s,e,t){const i=this.cache,n=e.length,a=ar(t,n);Bt(i,a)||(s.uniform1iv(this.addr,a),Ft(i,a));let r;this.type===s.SAMPLER_2D_SHADOW?r=el:r=hd;for(let o=0;o!==n;++o)t.setTexture2D(e[o]||r,a[o])}function Dg(s,e,t){const i=this.cache,n=e.length,a=ar(t,n);Bt(i,a)||(s.uniform1iv(this.addr,a),Ft(i,a));for(let r=0;r!==n;++r)t.setTexture3D(e[r]||fd,a[r])}function Ng(s,e,t){const i=this.cache,n=e.length,a=ar(t,n);Bt(i,a)||(s.uniform1iv(this.addr,a),Ft(i,a));for(let r=0;r!==n;++r)t.setTextureCube(e[r]||ud,a[r])}function kg(s,e,t){const i=this.cache,n=e.length,a=ar(t,n);Bt(i,a)||(s.uniform1iv(this.addr,a),Ft(i,a));for(let r=0;r!==n;++r)t.setTexture2DArray(e[r]||dd,a[r])}function Ug(s){switch(s){case 5126:return yg;case 35664:return xg;case 35665:return _g;case 35666:return vg;case 35674:return Sg;case 35675:return Mg;case 35676:return bg;case 5124:case 35670:return Eg;case 35667:case 35671:return Tg;case 35668:case 35672:return wg;case 35669:case 35673:return Ag;case 5125:return Rg;case 36294:return Cg;case 36295:return Pg;case 36296:return Ig;case 35678:case 36198:case 36298:case 36306:case 35682:return Lg;case 35679:case 36299:case 36307:return Dg;case 35680:case 36300:case 36308:case 36293:return Ng;case 36289:case 36303:case 36311:case 36292:return kg}}class Bg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=gg(t.type)}}class Fg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ug(t.type)}}class Og{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const n=this.seq;for(let a=0,r=n.length;a!==r;++a){const o=n[a];o.setValue(e,t[o.id],i)}}}const Yr=/(\w+)(\])?(\[|\.)?/g;function Zc(s,e){s.seq.push(e),s.map[e.id]=e}function zg(s,e,t){const i=s.name,n=i.length;for(Yr.lastIndex=0;;){const a=Yr.exec(i),r=Yr.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===n){Zc(t,c===void 0?new Bg(o,s,e):new Fg(o,s,e));break}else{let f=t.map[o];f===void 0&&(f=new Og(o),Zc(t,f)),t=f}}}class Fa{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const o=e.getActiveUniform(t,r),l=e.getUniformLocation(t,o.name);zg(o,l,this)}const n=[],a=[];for(const r of this.seq)r.type===e.SAMPLER_2D_SHADOW||r.type===e.SAMPLER_CUBE_SHADOW||r.type===e.SAMPLER_2D_ARRAY_SHADOW?n.push(r):a.push(r);n.length>0&&(this.seq=n.concat(a))}setValue(e,t,i,n){const a=this.map[t];a!==void 0&&a.setValue(e,i,n)}setOptional(e,t,i){const n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let a=0,r=t.length;a!==r;++a){const o=t[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,n)}}static seqWithValue(e,t){const i=[];for(let n=0,a=e.length;n!==a;++n){const r=e[n];r.id in t&&i.push(r)}return i}}function Jc(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const Vg=37297;let Hg=0;function Wg(s,e){const t=s.split(`
`),i=[],n=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=n;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const Qc=new Ue;function Gg(s){$e._getMatrix(Qc,$e.workingColorSpace,s);const e=`mat3( ${Qc.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(s)){case Ya:return[e,"LinearTransferOETF"];case rt:return[e,"sRGBTransferOETF"];default:return De("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function eh(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),a=(s.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+Wg(s.getShaderSource(e),o)}else return a}function Xg(s,e){const t=Gg(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const qg={[kh]:"Linear",[Uh]:"Reinhard",[Bh]:"Cineon",[Fh]:"ACESFilmic",[zh]:"AgX",[Vh]:"Neutral",[Oh]:"Custom"};function Yg(s,e){const t=qg[e];return t===void 0?(De("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const xa=new V;function $g(){$e.getLuminanceCoefficients(xa);const s=xa.x.toFixed(4),e=xa.y.toFixed(4),t=xa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Kg(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ks).join(`
`)}function jg(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Zg(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const a=s.getActiveAttrib(e,n),r=a.name;let o=1;a.type===s.FLOAT_MAT2&&(o=2),a.type===s.FLOAT_MAT3&&(o=3),a.type===s.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:s.getAttribLocation(e,r),locationSize:o}}return t}function ks(s){return s!==""}function th(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ih(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Jg=/^[ \t]*#include +<([\w\d./]+)>/gm;function tl(s){return s.replace(Jg,ey)}const Qg=new Map;function ey(s,e){let t=Ve[e];if(t===void 0){const i=Qg.get(e);if(i!==void 0)t=Ve[i],De('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return tl(t)}const ty=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nh(s){return s.replace(ty,iy)}function iy(s,e,t,i){let n="";for(let a=parseInt(e);a<parseInt(t);a++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return n}function sh(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const ny={[Da]:"SHADOWMAP_TYPE_PCF",[Ns]:"SHADOWMAP_TYPE_VSM"};function sy(s){return ny[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const ay={[zn]:"ENVMAP_TYPE_CUBE",[ps]:"ENVMAP_TYPE_CUBE",[tr]:"ENVMAP_TYPE_CUBE_UV"};function ry(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":ay[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const oy={[ps]:"ENVMAP_MODE_REFRACTION"};function ly(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":oy[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const cy={[Nh]:"ENVMAP_BLENDING_MULTIPLY",[jf]:"ENVMAP_BLENDING_MIX",[Zf]:"ENVMAP_BLENDING_ADD"};function hy(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":cy[s.combine]||"ENVMAP_BLENDING_NONE"}function dy(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function fy(s,e,t,i){const n=s.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const l=sy(t),c=ry(t),h=ly(t),f=hy(t),d=dy(t),u=Kg(t),p=jg(a),_=n.createProgram();let g,m,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(ks).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(ks).join(`
`),m.length>0&&(m+=`
`)):(g=[sh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ks).join(`
`),m=[sh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Li?"#define TONE_MAPPING":"",t.toneMapping!==Li?Ve.tonemapping_pars_fragment:"",t.toneMapping!==Li?Yg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,Xg("linearToOutputTexel",t.outputColorSpace),$g(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ks).join(`
`)),r=tl(r),r=th(r,t),r=ih(r,t),o=tl(o),o=th(o,t),o=ih(o,t),r=nh(r),o=nh(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===mc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===mc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const v=M+g+r,x=M+m+o,y=Jc(n,n.VERTEX_SHADER,v),E=Jc(n,n.FRAGMENT_SHADER,x);n.attachShader(_,y),n.attachShader(_,E),t.index0AttributeName!==void 0?n.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&n.bindAttribLocation(_,0,"position"),n.linkProgram(_);function A(C){if(s.debug.checkShaderErrors){const L=n.getProgramInfoLog(_)||"",z=n.getShaderInfoLog(y)||"",B=n.getShaderInfoLog(E)||"",I=L.trim(),U=z.trim(),N=B.trim();let $=!0,te=!0;if(n.getProgramParameter(_,n.LINK_STATUS)===!1)if($=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,_,y,E);else{const se=eh(n,y,"vertex"),G=eh(n,E,"fragment");Qe("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(_,n.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+I+`
`+se+`
`+G)}else I!==""?De("WebGLProgram: Program Info Log:",I):(U===""||N==="")&&(te=!1);te&&(C.diagnostics={runnable:$,programLog:I,vertexShader:{log:U,prefix:g},fragmentShader:{log:N,prefix:m}})}n.deleteShader(y),n.deleteShader(E),S=new Fa(n,_),w=Zg(n,_)}let S;this.getUniforms=function(){return S===void 0&&A(this),S};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=n.getProgramParameter(_,Vg)),P},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Hg++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=y,this.fragmentShader=E,this}let uy=0;class py{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,n=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(n)===!1&&(r.add(n),n.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new my(e),t.set(e,i)),i}}class my{constructor(e){this.id=uy++,this.code=e,this.usedTimes=0}}function gy(s){return s===Vn||s===Ga||s===Xa}function yy(s,e,t,i,n,a){const r=new Jh,o=new py,l=new Set,c=[],h=new Map,f=i.logarithmicDepthBuffer;let d=i.precision;const u={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(S){return l.add(S),S===0?"uv":`uv${S}`}function _(S,w,P,C,L,z){const B=C.fog,I=L.geometry,U=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?C.environment:null,N=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap,$=e.get(S.envMap||U,N),te=$&&$.mapping===tr?$.image.height:null,se=u[S.type];S.precision!==null&&(d=i.getMaxPrecision(S.precision),d!==S.precision&&De("WebGLProgram.getParameters:",S.precision,"not supported, using",d,"instead."));const G=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,ee=G!==void 0?G.length:0;let ae=0;I.morphAttributes.position!==void 0&&(ae=1),I.morphAttributes.normal!==void 0&&(ae=2),I.morphAttributes.color!==void 0&&(ae=3);let Te,be,q,J;if(se){const Be=Ri[se];Te=Be.vertexShader,be=Be.fragmentShader}else Te=S.vertexShader,be=S.fragmentShader,o.update(S),q=o.getVertexShaderID(S),J=o.getFragmentShaderID(S);const j=s.getRenderTarget(),Ee=s.state.buffers.depth.getReversed(),Re=L.isInstancedMesh===!0,Pe=L.isBatchedMesh===!0,nt=!!S.map,ke=!!S.matcap,Ze=!!$,at=!!S.aoMap,Ge=!!S.lightMap,It=!!S.bumpMap,xt=!!S.normalMap,ei=!!S.displacementMap,k=!!S.emissiveMap,Lt=!!S.metalnessMap,Xe=!!S.roughnessMap,ut=S.anisotropy>0,ue=S.clearcoat>0,vt=S.dispersion>0,R=S.iridescence>0,b=S.sheen>0,O=S.transmission>0,Z=ut&&!!S.anisotropyMap,ne=ue&&!!S.clearcoatMap,re=ue&&!!S.clearcoatNormalMap,de=ue&&!!S.clearcoatRoughnessMap,Y=R&&!!S.iridescenceMap,Q=R&&!!S.iridescenceThicknessMap,ye=b&&!!S.sheenColorMap,Se=b&&!!S.sheenRoughnessMap,ce=!!S.specularMap,oe=!!S.specularColorMap,Ne=!!S.specularIntensityMap,ze=O&&!!S.transmissionMap,et=O&&!!S.thicknessMap,D=!!S.gradientMap,le=!!S.alphaMap,K=S.alphaTest>0,xe=!!S.alphaHash,he=!!S.extensions;let ie=Li;S.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(ie=s.toneMapping);const Ce={shaderID:se,shaderType:S.type,shaderName:S.name,vertexShader:Te,fragmentShader:be,defines:S.defines,customVertexShaderID:q,customFragmentShaderID:J,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:d,batching:Pe,batchingColor:Pe&&L._colorsTexture!==null,instancing:Re,instancingColor:Re&&L.instanceColor!==null,instancingMorph:Re&&L.morphTexture!==null,outputColorSpace:j===null?s.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:$e.workingColorSpace,alphaToCoverage:!!S.alphaToCoverage,map:nt,matcap:ke,envMap:Ze,envMapMode:Ze&&$.mapping,envMapCubeUVHeight:te,aoMap:at,lightMap:Ge,bumpMap:It,normalMap:xt,displacementMap:ei,emissiveMap:k,normalMapObjectSpace:xt&&S.normalMapType===eu,normalMapTangentSpace:xt&&S.normalMapType===Zo,packedNormalMap:xt&&S.normalMapType===Zo&&gy(S.normalMap.format),metalnessMap:Lt,roughnessMap:Xe,anisotropy:ut,anisotropyMap:Z,clearcoat:ue,clearcoatMap:ne,clearcoatNormalMap:re,clearcoatRoughnessMap:de,dispersion:vt,iridescence:R,iridescenceMap:Y,iridescenceThicknessMap:Q,sheen:b,sheenColorMap:ye,sheenRoughnessMap:Se,specularMap:ce,specularColorMap:oe,specularIntensityMap:Ne,transmission:O,transmissionMap:ze,thicknessMap:et,gradientMap:D,opaque:S.transparent===!1&&S.blending===hs&&S.alphaToCoverage===!1,alphaMap:le,alphaTest:K,alphaHash:xe,combine:S.combine,mapUv:nt&&p(S.map.channel),aoMapUv:at&&p(S.aoMap.channel),lightMapUv:Ge&&p(S.lightMap.channel),bumpMapUv:It&&p(S.bumpMap.channel),normalMapUv:xt&&p(S.normalMap.channel),displacementMapUv:ei&&p(S.displacementMap.channel),emissiveMapUv:k&&p(S.emissiveMap.channel),metalnessMapUv:Lt&&p(S.metalnessMap.channel),roughnessMapUv:Xe&&p(S.roughnessMap.channel),anisotropyMapUv:Z&&p(S.anisotropyMap.channel),clearcoatMapUv:ne&&p(S.clearcoatMap.channel),clearcoatNormalMapUv:re&&p(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&p(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Y&&p(S.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&p(S.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&p(S.sheenColorMap.channel),sheenRoughnessMapUv:Se&&p(S.sheenRoughnessMap.channel),specularMapUv:ce&&p(S.specularMap.channel),specularColorMapUv:oe&&p(S.specularColorMap.channel),specularIntensityMapUv:Ne&&p(S.specularIntensityMap.channel),transmissionMapUv:ze&&p(S.transmissionMap.channel),thicknessMapUv:et&&p(S.thicknessMap.channel),alphaMapUv:le&&p(S.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(xt||ut),vertexNormals:!!I.attributes.normal,vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!I.attributes.uv&&(nt||le),fog:!!B,useFog:S.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:S.wireframe===!1&&(S.flatShading===!0||I.attributes.normal===void 0&&xt===!1&&(S.isMeshLambertMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isMeshPhysicalMaterial)),sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Ee,skinning:L.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:ee,morphTextureStride:ae,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:ie,decodeVideoTexture:nt&&S.map.isVideoTexture===!0&&$e.getTransfer(S.map.colorSpace)===rt,decodeVideoTextureEmissive:k&&S.emissiveMap.isVideoTexture===!0&&$e.getTransfer(S.emissiveMap.colorSpace)===rt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===$i,flipSided:S.side===Qt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:he&&S.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(he&&S.extensions.multiDraw===!0||Pe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Ce.vertexUv1s=l.has(1),Ce.vertexUv2s=l.has(2),Ce.vertexUv3s=l.has(3),l.clear(),Ce}function g(S){const w=[];if(S.shaderID?w.push(S.shaderID):(w.push(S.customVertexShaderID),w.push(S.customFragmentShaderID)),S.defines!==void 0)for(const P in S.defines)w.push(P),w.push(S.defines[P]);return S.isRawShaderMaterial===!1&&(m(w,S),M(w,S),w.push(s.outputColorSpace)),w.push(S.customProgramCacheKey),w.join()}function m(S,w){S.push(w.precision),S.push(w.outputColorSpace),S.push(w.envMapMode),S.push(w.envMapCubeUVHeight),S.push(w.mapUv),S.push(w.alphaMapUv),S.push(w.lightMapUv),S.push(w.aoMapUv),S.push(w.bumpMapUv),S.push(w.normalMapUv),S.push(w.displacementMapUv),S.push(w.emissiveMapUv),S.push(w.metalnessMapUv),S.push(w.roughnessMapUv),S.push(w.anisotropyMapUv),S.push(w.clearcoatMapUv),S.push(w.clearcoatNormalMapUv),S.push(w.clearcoatRoughnessMapUv),S.push(w.iridescenceMapUv),S.push(w.iridescenceThicknessMapUv),S.push(w.sheenColorMapUv),S.push(w.sheenRoughnessMapUv),S.push(w.specularMapUv),S.push(w.specularColorMapUv),S.push(w.specularIntensityMapUv),S.push(w.transmissionMapUv),S.push(w.thicknessMapUv),S.push(w.combine),S.push(w.fogExp2),S.push(w.sizeAttenuation),S.push(w.morphTargetsCount),S.push(w.morphAttributeCount),S.push(w.numDirLights),S.push(w.numPointLights),S.push(w.numSpotLights),S.push(w.numSpotLightMaps),S.push(w.numHemiLights),S.push(w.numRectAreaLights),S.push(w.numDirLightShadows),S.push(w.numPointLightShadows),S.push(w.numSpotLightShadows),S.push(w.numSpotLightShadowsWithMaps),S.push(w.numLightProbes),S.push(w.shadowMapType),S.push(w.toneMapping),S.push(w.numClippingPlanes),S.push(w.numClipIntersection),S.push(w.depthPacking)}function M(S,w){r.disableAll(),w.instancing&&r.enable(0),w.instancingColor&&r.enable(1),w.instancingMorph&&r.enable(2),w.matcap&&r.enable(3),w.envMap&&r.enable(4),w.normalMapObjectSpace&&r.enable(5),w.normalMapTangentSpace&&r.enable(6),w.clearcoat&&r.enable(7),w.iridescence&&r.enable(8),w.alphaTest&&r.enable(9),w.vertexColors&&r.enable(10),w.vertexAlphas&&r.enable(11),w.vertexUv1s&&r.enable(12),w.vertexUv2s&&r.enable(13),w.vertexUv3s&&r.enable(14),w.vertexTangents&&r.enable(15),w.anisotropy&&r.enable(16),w.alphaHash&&r.enable(17),w.batching&&r.enable(18),w.dispersion&&r.enable(19),w.batchingColor&&r.enable(20),w.gradientMap&&r.enable(21),w.packedNormalMap&&r.enable(22),w.vertexNormals&&r.enable(23),S.push(r.mask),r.disableAll(),w.fog&&r.enable(0),w.useFog&&r.enable(1),w.flatShading&&r.enable(2),w.logarithmicDepthBuffer&&r.enable(3),w.reversedDepthBuffer&&r.enable(4),w.skinning&&r.enable(5),w.morphTargets&&r.enable(6),w.morphNormals&&r.enable(7),w.morphColors&&r.enable(8),w.premultipliedAlpha&&r.enable(9),w.shadowMapEnabled&&r.enable(10),w.doubleSided&&r.enable(11),w.flipSided&&r.enable(12),w.useDepthPacking&&r.enable(13),w.dithering&&r.enable(14),w.transmission&&r.enable(15),w.sheen&&r.enable(16),w.opaque&&r.enable(17),w.pointsUvs&&r.enable(18),w.decodeVideoTexture&&r.enable(19),w.decodeVideoTextureEmissive&&r.enable(20),w.alphaToCoverage&&r.enable(21),w.numLightProbeGrids>0&&r.enable(22),S.push(r.mask)}function v(S){const w=u[S.type];let P;if(w){const C=Ri[w];P=Fu.clone(C.uniforms)}else P=S.uniforms;return P}function x(S,w){let P=h.get(w);return P!==void 0?++P.usedTimes:(P=new fy(s,w,S,n),c.push(P),h.set(w,P)),P}function y(S){if(--S.usedTimes===0){const w=c.indexOf(S);c[w]=c[c.length-1],c.pop(),h.delete(S.cacheKey),S.destroy()}}function E(S){o.remove(S)}function A(){o.dispose()}return{getParameters:_,getProgramCacheKey:g,getUniforms:v,acquireProgram:x,releaseProgram:y,releaseShaderCache:E,programs:c,dispose:A}}function xy(){let s=new WeakMap;function e(r){return s.has(r)}function t(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function i(r){s.delete(r)}function n(r,o,l){s.get(r)[o]=l}function a(){s=new WeakMap}return{has:e,get:t,remove:i,update:n,dispose:a}}function _y(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function ah(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function rh(){const s=[];let e=0;const t=[],i=[],n=[];function a(){e=0,t.length=0,i.length=0,n.length=0}function r(d){let u=0;return d.isInstancedMesh&&(u+=2),d.isSkinnedMesh&&(u+=1),u}function o(d,u,p,_,g,m){let M=s[e];return M===void 0?(M={id:d.id,object:d,geometry:u,material:p,materialVariant:r(d),groupOrder:_,renderOrder:d.renderOrder,z:g,group:m},s[e]=M):(M.id=d.id,M.object=d,M.geometry=u,M.material=p,M.materialVariant=r(d),M.groupOrder=_,M.renderOrder=d.renderOrder,M.z=g,M.group=m),e++,M}function l(d,u,p,_,g,m){const M=o(d,u,p,_,g,m);p.transmission>0?i.push(M):p.transparent===!0?n.push(M):t.push(M)}function c(d,u,p,_,g,m){const M=o(d,u,p,_,g,m);p.transmission>0?i.unshift(M):p.transparent===!0?n.unshift(M):t.unshift(M)}function h(d,u){t.length>1&&t.sort(d||_y),i.length>1&&i.sort(u||ah),n.length>1&&n.sort(u||ah)}function f(){for(let d=e,u=s.length;d<u;d++){const p=s[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:n,init:a,push:l,unshift:c,finish:f,sort:h}}function vy(){let s=new WeakMap;function e(i,n){const a=s.get(i);let r;return a===void 0?(r=new rh,s.set(i,[r])):n>=a.length?(r=new rh,a.push(r)):r=a[n],r}function t(){s=new WeakMap}return{get:e,dispose:t}}function Sy(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new V,color:new st};break;case"SpotLight":t={position:new V,direction:new V,color:new st,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new V,color:new st,distance:0,decay:0};break;case"HemisphereLight":t={direction:new V,skyColor:new st,groundColor:new st};break;case"RectAreaLight":t={color:new st,position:new V,halfWidth:new V,halfHeight:new V};break}return s[e.id]=t,t}}}function My(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let by=0;function Ey(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Ty(s){const e=new Sy,t=My(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);const n=new V,a=new At,r=new At;function o(c){let h=0,f=0,d=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let u=0,p=0,_=0,g=0,m=0,M=0,v=0,x=0,y=0,E=0,A=0;c.sort(Ey);for(let w=0,P=c.length;w<P;w++){const C=c[w],L=C.color,z=C.intensity,B=C.distance;let I=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===Vn?I=C.shadow.map.texture:I=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=L.r*z,f+=L.g*z,d+=L.b*z;else if(C.isLightProbe){for(let U=0;U<9;U++)i.probe[U].addScaledVector(C.sh.coefficients[U],z);A++}else if(C.isDirectionalLight){const U=e.get(C);if(U.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const N=C.shadow,$=t.get(C);$.shadowIntensity=N.intensity,$.shadowBias=N.bias,$.shadowNormalBias=N.normalBias,$.shadowRadius=N.radius,$.shadowMapSize=N.mapSize,i.directionalShadow[u]=$,i.directionalShadowMap[u]=I,i.directionalShadowMatrix[u]=C.shadow.matrix,M++}i.directional[u]=U,u++}else if(C.isSpotLight){const U=e.get(C);U.position.setFromMatrixPosition(C.matrixWorld),U.color.copy(L).multiplyScalar(z),U.distance=B,U.coneCos=Math.cos(C.angle),U.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),U.decay=C.decay,i.spot[_]=U;const N=C.shadow;if(C.map&&(i.spotLightMap[y]=C.map,y++,N.updateMatrices(C),C.castShadow&&E++),i.spotLightMatrix[_]=N.matrix,C.castShadow){const $=t.get(C);$.shadowIntensity=N.intensity,$.shadowBias=N.bias,$.shadowNormalBias=N.normalBias,$.shadowRadius=N.radius,$.shadowMapSize=N.mapSize,i.spotShadow[_]=$,i.spotShadowMap[_]=I,x++}_++}else if(C.isRectAreaLight){const U=e.get(C);U.color.copy(L).multiplyScalar(z),U.halfWidth.set(C.width*.5,0,0),U.halfHeight.set(0,C.height*.5,0),i.rectArea[g]=U,g++}else if(C.isPointLight){const U=e.get(C);if(U.color.copy(C.color).multiplyScalar(C.intensity),U.distance=C.distance,U.decay=C.decay,C.castShadow){const N=C.shadow,$=t.get(C);$.shadowIntensity=N.intensity,$.shadowBias=N.bias,$.shadowNormalBias=N.normalBias,$.shadowRadius=N.radius,$.shadowMapSize=N.mapSize,$.shadowCameraNear=N.camera.near,$.shadowCameraFar=N.camera.far,i.pointShadow[p]=$,i.pointShadowMap[p]=I,i.pointShadowMatrix[p]=C.shadow.matrix,v++}i.point[p]=U,p++}else if(C.isHemisphereLight){const U=e.get(C);U.skyColor.copy(C.color).multiplyScalar(z),U.groundColor.copy(C.groundColor).multiplyScalar(z),i.hemi[m]=U,m++}}g>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=pe.LTC_FLOAT_1,i.rectAreaLTC2=pe.LTC_FLOAT_2):(i.rectAreaLTC1=pe.LTC_HALF_1,i.rectAreaLTC2=pe.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const S=i.hash;(S.directionalLength!==u||S.pointLength!==p||S.spotLength!==_||S.rectAreaLength!==g||S.hemiLength!==m||S.numDirectionalShadows!==M||S.numPointShadows!==v||S.numSpotShadows!==x||S.numSpotMaps!==y||S.numLightProbes!==A)&&(i.directional.length=u,i.spot.length=_,i.rectArea.length=g,i.point.length=p,i.hemi.length=m,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=x+y-E,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,S.directionalLength=u,S.pointLength=p,S.spotLength=_,S.rectAreaLength=g,S.hemiLength=m,S.numDirectionalShadows=M,S.numPointShadows=v,S.numSpotShadows=x,S.numSpotMaps=y,S.numLightProbes=A,i.version=by++)}function l(c,h){let f=0,d=0,u=0,p=0,_=0;const g=h.matrixWorldInverse;for(let m=0,M=c.length;m<M;m++){const v=c[m];if(v.isDirectionalLight){const x=i.directional[f];x.direction.setFromMatrixPosition(v.matrixWorld),n.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(n),x.direction.transformDirection(g),f++}else if(v.isSpotLight){const x=i.spot[u];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(v.matrixWorld),n.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(n),x.direction.transformDirection(g),u++}else if(v.isRectAreaLight){const x=i.rectArea[p];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(g),r.identity(),a.copy(v.matrixWorld),a.premultiply(g),r.extractRotation(a),x.halfWidth.set(v.width*.5,0,0),x.halfHeight.set(0,v.height*.5,0),x.halfWidth.applyMatrix4(r),x.halfHeight.applyMatrix4(r),p++}else if(v.isPointLight){const x=i.point[d];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(g),d++}else if(v.isHemisphereLight){const x=i.hemi[_];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(g),_++}}}return{setup:o,setupView:l,state:i}}function oh(s){const e=new Ty(s),t=[],i=[],n=[];function a(d){f.camera=d,t.length=0,i.length=0,n.length=0}function r(d){t.push(d)}function o(d){i.push(d)}function l(d){n.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const f={lightsArray:t,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:f,setupLights:c,setupLightsView:h,pushLight:r,pushShadow:o,pushLightProbeGrid:l}}function wy(s){let e=new WeakMap;function t(n,a=0){const r=e.get(n);let o;return r===void 0?(o=new oh(s),e.set(n,[o])):a>=r.length?(o=new oh(s),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Ay=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ry=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Cy=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],Py=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],lh=new At,Ls=new V,$r=new V;function Iy(s,e,t){let i=new wl;const n=new it,a=new it,r=new Mt,o=new Hu,l=new Wu,c={},h=t.maxTextureSize,f={[vn]:Qt,[Qt]:vn,[$i]:$i},d=new Bi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:Ay,fragmentShader:Ry}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const p=new bi;p.setAttribute("position",new Ni(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ft(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Da;let m=this.type;this.render=function(E,A,S){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;this.type===If&&(De("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Da);const w=s.getRenderTarget(),P=s.getActiveCubeFace(),C=s.getActiveMipmapLevel(),L=s.state;L.setBlending(Zi),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const z=m!==this.type;z&&A.traverse(function(B){B.material&&(Array.isArray(B.material)?B.material.forEach(I=>I.needsUpdate=!0):B.material.needsUpdate=!0)});for(let B=0,I=E.length;B<I;B++){const U=E[B],N=U.shadow;if(N===void 0){De("WebGLShadowMap:",U,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;n.copy(N.mapSize);const $=N.getFrameExtents();n.multiply($),a.copy(N.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(a.x=Math.floor(h/$.x),n.x=a.x*$.x,N.mapSize.x=a.x),n.y>h&&(a.y=Math.floor(h/$.y),n.y=a.y*$.y,N.mapSize.y=a.y));const te=s.state.buffers.depth.getReversed();if(N.camera._reversedDepth=te,N.map===null||z===!0){if(N.map!==null&&(N.map.depthTexture!==null&&(N.map.depthTexture.dispose(),N.map.depthTexture=null),N.map.dispose()),this.type===Ns){if(U.isPointLight){De("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}N.map=new Di(n.x,n.y,{format:Vn,type:Qi,minFilter:Xt,magFilter:Xt,generateMipmaps:!1}),N.map.texture.name=U.name+".shadowMap",N.map.depthTexture=new ms(n.x,n.y,Ci),N.map.depthTexture.name=U.name+".shadowMapDepth",N.map.depthTexture.format=en,N.map.depthTexture.compareFunction=null,N.map.depthTexture.minFilter=Vt,N.map.depthTexture.magFilter=Vt}else U.isPointLight?(N.map=new cd(n.x),N.map.depthTexture=new Uu(n.x,Ui)):(N.map=new Di(n.x,n.y),N.map.depthTexture=new ms(n.x,n.y,Ui)),N.map.depthTexture.name=U.name+".shadowMap",N.map.depthTexture.format=en,this.type===Da?(N.map.depthTexture.compareFunction=te?bl:Ml,N.map.depthTexture.minFilter=Xt,N.map.depthTexture.magFilter=Xt):(N.map.depthTexture.compareFunction=null,N.map.depthTexture.minFilter=Vt,N.map.depthTexture.magFilter=Vt);N.camera.updateProjectionMatrix()}const se=N.map.isWebGLCubeRenderTarget?6:1;for(let G=0;G<se;G++){if(N.map.isWebGLCubeRenderTarget)s.setRenderTarget(N.map,G),s.clear();else{G===0&&(s.setRenderTarget(N.map),s.clear());const ee=N.getViewport(G);r.set(a.x*ee.x,a.y*ee.y,a.x*ee.z,a.y*ee.w),L.viewport(r)}if(U.isPointLight){const ee=N.camera,ae=N.matrix,Te=U.distance||ee.far;Te!==ee.far&&(ee.far=Te,ee.updateProjectionMatrix()),Ls.setFromMatrixPosition(U.matrixWorld),ee.position.copy(Ls),$r.copy(ee.position),$r.add(Cy[G]),ee.up.copy(Py[G]),ee.lookAt($r),ee.updateMatrixWorld(),ae.makeTranslation(-Ls.x,-Ls.y,-Ls.z),lh.multiplyMatrices(ee.projectionMatrix,ee.matrixWorldInverse),N._frustum.setFromProjectionMatrix(lh,ee.coordinateSystem,ee.reversedDepth)}else N.updateMatrices(U);i=N.getFrustum(),x(A,S,N.camera,U,this.type)}N.isPointLightShadow!==!0&&this.type===Ns&&M(N,S),N.needsUpdate=!1}m=this.type,g.needsUpdate=!1,s.setRenderTarget(w,P,C)};function M(E,A){const S=e.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,u.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Di(n.x,n.y,{format:Vn,type:Qi})),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(A,null,S,d,_,null),u.uniforms.shadow_pass.value=E.mapPass.texture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(A,null,S,u,_,null)}function v(E,A,S,w){let P=null;const C=S.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(C!==void 0)P=C;else if(P=S.isPointLight===!0?l:o,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const L=P.uuid,z=A.uuid;let B=c[L];B===void 0&&(B={},c[L]=B);let I=B[z];I===void 0&&(I=P.clone(),B[z]=I,A.addEventListener("dispose",y)),P=I}if(P.visible=A.visible,P.wireframe=A.wireframe,w===Ns?P.side=A.shadowSide!==null?A.shadowSide:A.side:P.side=A.shadowSide!==null?A.shadowSide:f[A.side],P.alphaMap=A.alphaMap,P.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,P.map=A.map,P.clipShadows=A.clipShadows,P.clippingPlanes=A.clippingPlanes,P.clipIntersection=A.clipIntersection,P.displacementMap=A.displacementMap,P.displacementScale=A.displacementScale,P.displacementBias=A.displacementBias,P.wireframeLinewidth=A.wireframeLinewidth,P.linewidth=A.linewidth,S.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const L=s.properties.get(P);L.light=S}return P}function x(E,A,S,w,P){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&P===Ns)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,E.matrixWorld);const z=e.update(E),B=E.material;if(Array.isArray(B)){const I=z.groups;for(let U=0,N=I.length;U<N;U++){const $=I[U],te=B[$.materialIndex];if(te&&te.visible){const se=v(E,te,w,P);E.onBeforeShadow(s,E,A,S,z,se,$),s.renderBufferDirect(S,null,z,se,E,$),E.onAfterShadow(s,E,A,S,z,se,$)}}}else if(B.visible){const I=v(E,B,w,P);E.onBeforeShadow(s,E,A,S,z,I,null),s.renderBufferDirect(S,null,z,I,E,null),E.onAfterShadow(s,E,A,S,z,I,null)}}const L=E.children;for(let z=0,B=L.length;z<B;z++)x(L[z],A,S,w,P)}function y(E){E.target.removeEventListener("dispose",y);for(const S in c){const w=c[S],P=E.target.uuid;P in w&&(w[P].dispose(),delete w[P])}}}function Ly(s,e){function t(){let D=!1;const le=new Mt;let K=null;const xe=new Mt(0,0,0,0);return{setMask:function(he){K!==he&&!D&&(s.colorMask(he,he,he,he),K=he)},setLocked:function(he){D=he},setClear:function(he,ie,Ce,Be,bt){bt===!0&&(he*=Be,ie*=Be,Ce*=Be),le.set(he,ie,Ce,Be),xe.equals(le)===!1&&(s.clearColor(he,ie,Ce,Be),xe.copy(le))},reset:function(){D=!1,K=null,xe.set(-1,0,0,0)}}}function i(){let D=!1,le=!1,K=null,xe=null,he=null;return{setReversed:function(ie){if(le!==ie){const Ce=e.get("EXT_clip_control");ie?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),le=ie;const Be=he;he=null,this.setClear(Be)}},getReversed:function(){return le},setTest:function(ie){ie?j(s.DEPTH_TEST):Ee(s.DEPTH_TEST)},setMask:function(ie){K!==ie&&!D&&(s.depthMask(ie),K=ie)},setFunc:function(ie){if(le&&(ie=hu[ie]),xe!==ie){switch(ie){case fo:s.depthFunc(s.NEVER);break;case uo:s.depthFunc(s.ALWAYS);break;case po:s.depthFunc(s.LESS);break;case us:s.depthFunc(s.LEQUAL);break;case mo:s.depthFunc(s.EQUAL);break;case go:s.depthFunc(s.GEQUAL);break;case yo:s.depthFunc(s.GREATER);break;case xo:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}xe=ie}},setLocked:function(ie){D=ie},setClear:function(ie){he!==ie&&(he=ie,le&&(ie=1-ie),s.clearDepth(ie))},reset:function(){D=!1,K=null,xe=null,he=null,le=!1}}}function n(){let D=!1,le=null,K=null,xe=null,he=null,ie=null,Ce=null,Be=null,bt=null;return{setTest:function(lt){D||(lt?j(s.STENCIL_TEST):Ee(s.STENCIL_TEST))},setMask:function(lt){le!==lt&&!D&&(s.stencilMask(lt),le=lt)},setFunc:function(lt,Fi,Ei){(K!==lt||xe!==Fi||he!==Ei)&&(s.stencilFunc(lt,Fi,Ei),K=lt,xe=Fi,he=Ei)},setOp:function(lt,Fi,Ei){(ie!==lt||Ce!==Fi||Be!==Ei)&&(s.stencilOp(lt,Fi,Ei),ie=lt,Ce=Fi,Be=Ei)},setLocked:function(lt){D=lt},setClear:function(lt){bt!==lt&&(s.clearStencil(lt),bt=lt)},reset:function(){D=!1,le=null,K=null,xe=null,he=null,ie=null,Ce=null,Be=null,bt=null}}}const a=new t,r=new i,o=new n,l=new WeakMap,c=new WeakMap;let h={},f={},d={},u=new WeakMap,p=[],_=null,g=!1,m=null,M=null,v=null,x=null,y=null,E=null,A=null,S=new st(0,0,0),w=0,P=!1,C=null,L=null,z=null,B=null,I=null;const U=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,$=0;const te=s.getParameter(s.VERSION);te.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(te)[1]),N=$>=1):te.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),N=$>=2);let se=null,G={};const ee=s.getParameter(s.SCISSOR_BOX),ae=s.getParameter(s.VIEWPORT),Te=new Mt().fromArray(ee),be=new Mt().fromArray(ae);function q(D,le,K,xe){const he=new Uint8Array(4),ie=s.createTexture();s.bindTexture(D,ie),s.texParameteri(D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(D,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ce=0;Ce<K;Ce++)D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY?s.texImage3D(le,0,s.RGBA,1,1,xe,0,s.RGBA,s.UNSIGNED_BYTE,he):s.texImage2D(le+Ce,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,he);return ie}const J={};J[s.TEXTURE_2D]=q(s.TEXTURE_2D,s.TEXTURE_2D,1),J[s.TEXTURE_CUBE_MAP]=q(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[s.TEXTURE_2D_ARRAY]=q(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),J[s.TEXTURE_3D]=q(s.TEXTURE_3D,s.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),j(s.DEPTH_TEST),r.setFunc(us),It(!1),xt(hc),j(s.CULL_FACE),at(Zi);function j(D){h[D]!==!0&&(s.enable(D),h[D]=!0)}function Ee(D){h[D]!==!1&&(s.disable(D),h[D]=!1)}function Re(D,le){return d[D]!==le?(s.bindFramebuffer(D,le),d[D]=le,D===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=le),D===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=le),!0):!1}function Pe(D,le){let K=p,xe=!1;if(D){K=u.get(le),K===void 0&&(K=[],u.set(le,K));const he=D.textures;if(K.length!==he.length||K[0]!==s.COLOR_ATTACHMENT0){for(let ie=0,Ce=he.length;ie<Ce;ie++)K[ie]=s.COLOR_ATTACHMENT0+ie;K.length=he.length,xe=!0}}else K[0]!==s.BACK&&(K[0]=s.BACK,xe=!0);xe&&s.drawBuffers(K)}function nt(D){return _!==D?(s.useProgram(D),_=D,!0):!1}const ke={[In]:s.FUNC_ADD,[Df]:s.FUNC_SUBTRACT,[Nf]:s.FUNC_REVERSE_SUBTRACT};ke[kf]=s.MIN,ke[Uf]=s.MAX;const Ze={[Bf]:s.ZERO,[Ff]:s.ONE,[Of]:s.SRC_COLOR,[co]:s.SRC_ALPHA,[Xf]:s.SRC_ALPHA_SATURATE,[Wf]:s.DST_COLOR,[Vf]:s.DST_ALPHA,[zf]:s.ONE_MINUS_SRC_COLOR,[ho]:s.ONE_MINUS_SRC_ALPHA,[Gf]:s.ONE_MINUS_DST_COLOR,[Hf]:s.ONE_MINUS_DST_ALPHA,[qf]:s.CONSTANT_COLOR,[Yf]:s.ONE_MINUS_CONSTANT_COLOR,[$f]:s.CONSTANT_ALPHA,[Kf]:s.ONE_MINUS_CONSTANT_ALPHA};function at(D,le,K,xe,he,ie,Ce,Be,bt,lt){if(D===Zi){g===!0&&(Ee(s.BLEND),g=!1);return}if(g===!1&&(j(s.BLEND),g=!0),D!==Lf){if(D!==m||lt!==P){if((M!==In||y!==In)&&(s.blendEquation(s.FUNC_ADD),M=In,y=In),lt)switch(D){case hs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case lo:s.blendFunc(s.ONE,s.ONE);break;case dc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case fc:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Qe("WebGLState: Invalid blending: ",D);break}else switch(D){case hs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case lo:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case dc:Qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case fc:Qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Qe("WebGLState: Invalid blending: ",D);break}v=null,x=null,E=null,A=null,S.set(0,0,0),w=0,m=D,P=lt}return}he=he||le,ie=ie||K,Ce=Ce||xe,(le!==M||he!==y)&&(s.blendEquationSeparate(ke[le],ke[he]),M=le,y=he),(K!==v||xe!==x||ie!==E||Ce!==A)&&(s.blendFuncSeparate(Ze[K],Ze[xe],Ze[ie],Ze[Ce]),v=K,x=xe,E=ie,A=Ce),(Be.equals(S)===!1||bt!==w)&&(s.blendColor(Be.r,Be.g,Be.b,bt),S.copy(Be),w=bt),m=D,P=!1}function Ge(D,le){D.side===$i?Ee(s.CULL_FACE):j(s.CULL_FACE);let K=D.side===Qt;le&&(K=!K),It(K),D.blending===hs&&D.transparent===!1?at(Zi):at(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),a.setMask(D.colorWrite);const xe=D.stencilWrite;o.setTest(xe),xe&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),k(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?j(s.SAMPLE_ALPHA_TO_COVERAGE):Ee(s.SAMPLE_ALPHA_TO_COVERAGE)}function It(D){C!==D&&(D?s.frontFace(s.CW):s.frontFace(s.CCW),C=D)}function xt(D){D!==Cf?(j(s.CULL_FACE),D!==L&&(D===hc?s.cullFace(s.BACK):D===Pf?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ee(s.CULL_FACE),L=D}function ei(D){D!==z&&(N&&s.lineWidth(D),z=D)}function k(D,le,K){D?(j(s.POLYGON_OFFSET_FILL),(B!==le||I!==K)&&(B=le,I=K,r.getReversed()&&(le=-le),s.polygonOffset(le,K))):Ee(s.POLYGON_OFFSET_FILL)}function Lt(D){D?j(s.SCISSOR_TEST):Ee(s.SCISSOR_TEST)}function Xe(D){D===void 0&&(D=s.TEXTURE0+U-1),se!==D&&(s.activeTexture(D),se=D)}function ut(D,le,K){K===void 0&&(se===null?K=s.TEXTURE0+U-1:K=se);let xe=G[K];xe===void 0&&(xe={type:void 0,texture:void 0},G[K]=xe),(xe.type!==D||xe.texture!==le)&&(se!==K&&(s.activeTexture(K),se=K),s.bindTexture(D,le||J[D]),xe.type=D,xe.texture=le)}function ue(){const D=G[se];D!==void 0&&D.type!==void 0&&(s.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function vt(){try{s.compressedTexImage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function R(){try{s.compressedTexImage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function b(){try{s.texSubImage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function O(){try{s.texSubImage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function Z(){try{s.compressedTexSubImage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function ne(){try{s.compressedTexSubImage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function re(){try{s.texStorage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function de(){try{s.texStorage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function Y(){try{s.texImage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function Q(){try{s.texImage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function ye(D){return f[D]!==void 0?f[D]:s.getParameter(D)}function Se(D,le){f[D]!==le&&(s.pixelStorei(D,le),f[D]=le)}function ce(D){Te.equals(D)===!1&&(s.scissor(D.x,D.y,D.z,D.w),Te.copy(D))}function oe(D){be.equals(D)===!1&&(s.viewport(D.x,D.y,D.z,D.w),be.copy(D))}function Ne(D,le){let K=c.get(le);K===void 0&&(K=new WeakMap,c.set(le,K));let xe=K.get(D);xe===void 0&&(xe=s.getUniformBlockIndex(le,D.name),K.set(D,xe))}function ze(D,le){const xe=c.get(le).get(D);l.get(le)!==xe&&(s.uniformBlockBinding(le,xe,D.__bindingPointIndex),l.set(le,xe))}function et(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),r.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},f={},se=null,G={},d={},u=new WeakMap,p=[],_=null,g=!1,m=null,M=null,v=null,x=null,y=null,E=null,A=null,S=new st(0,0,0),w=0,P=!1,C=null,L=null,z=null,B=null,I=null,Te.set(0,0,s.canvas.width,s.canvas.height),be.set(0,0,s.canvas.width,s.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:j,disable:Ee,bindFramebuffer:Re,drawBuffers:Pe,useProgram:nt,setBlending:at,setMaterial:Ge,setFlipSided:It,setCullFace:xt,setLineWidth:ei,setPolygonOffset:k,setScissorTest:Lt,activeTexture:Xe,bindTexture:ut,unbindTexture:ue,compressedTexImage2D:vt,compressedTexImage3D:R,texImage2D:Y,texImage3D:Q,pixelStorei:Se,getParameter:ye,updateUBOMapping:Ne,uniformBlockBinding:ze,texStorage2D:re,texStorage3D:de,texSubImage2D:b,texSubImage3D:O,compressedTexSubImage2D:Z,compressedTexSubImage3D:ne,scissor:ce,viewport:oe,reset:et}}function Dy(s,e,t,i,n,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new it,h=new WeakMap,f=new Set;let d;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,b){return p?new OffscreenCanvas(R,b):$a("canvas")}function g(R,b,O){let Z=1;const ne=vt(R);if((ne.width>O||ne.height>O)&&(Z=O/Math.max(ne.width,ne.height)),Z<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const re=Math.floor(Z*ne.width),de=Math.floor(Z*ne.height);d===void 0&&(d=_(re,de));const Y=b?_(re,de):d;return Y.width=re,Y.height=de,Y.getContext("2d").drawImage(R,0,0,re,de),De("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+re+"x"+de+")."),Y}else return"data"in R&&De("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),R;return R}function m(R){return R.generateMipmaps}function M(R){s.generateMipmap(R)}function v(R){return R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?s.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function x(R,b,O,Z,ne,re=!1){if(R!==null){if(s[R]!==void 0)return s[R];De("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let de;Z&&(de=e.get("EXT_texture_norm16"),de||De("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Y=b;if(b===s.RED&&(O===s.FLOAT&&(Y=s.R32F),O===s.HALF_FLOAT&&(Y=s.R16F),O===s.UNSIGNED_BYTE&&(Y=s.R8),O===s.UNSIGNED_SHORT&&de&&(Y=de.R16_EXT),O===s.SHORT&&de&&(Y=de.R16_SNORM_EXT)),b===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(Y=s.R8UI),O===s.UNSIGNED_SHORT&&(Y=s.R16UI),O===s.UNSIGNED_INT&&(Y=s.R32UI),O===s.BYTE&&(Y=s.R8I),O===s.SHORT&&(Y=s.R16I),O===s.INT&&(Y=s.R32I)),b===s.RG&&(O===s.FLOAT&&(Y=s.RG32F),O===s.HALF_FLOAT&&(Y=s.RG16F),O===s.UNSIGNED_BYTE&&(Y=s.RG8),O===s.UNSIGNED_SHORT&&de&&(Y=de.RG16_EXT),O===s.SHORT&&de&&(Y=de.RG16_SNORM_EXT)),b===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(Y=s.RG8UI),O===s.UNSIGNED_SHORT&&(Y=s.RG16UI),O===s.UNSIGNED_INT&&(Y=s.RG32UI),O===s.BYTE&&(Y=s.RG8I),O===s.SHORT&&(Y=s.RG16I),O===s.INT&&(Y=s.RG32I)),b===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(Y=s.RGB8UI),O===s.UNSIGNED_SHORT&&(Y=s.RGB16UI),O===s.UNSIGNED_INT&&(Y=s.RGB32UI),O===s.BYTE&&(Y=s.RGB8I),O===s.SHORT&&(Y=s.RGB16I),O===s.INT&&(Y=s.RGB32I)),b===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(Y=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(Y=s.RGBA16UI),O===s.UNSIGNED_INT&&(Y=s.RGBA32UI),O===s.BYTE&&(Y=s.RGBA8I),O===s.SHORT&&(Y=s.RGBA16I),O===s.INT&&(Y=s.RGBA32I)),b===s.RGB&&(O===s.UNSIGNED_SHORT&&de&&(Y=de.RGB16_EXT),O===s.SHORT&&de&&(Y=de.RGB16_SNORM_EXT),O===s.UNSIGNED_INT_5_9_9_9_REV&&(Y=s.RGB9_E5),O===s.UNSIGNED_INT_10F_11F_11F_REV&&(Y=s.R11F_G11F_B10F)),b===s.RGBA){const Q=re?Ya:$e.getTransfer(ne);O===s.FLOAT&&(Y=s.RGBA32F),O===s.HALF_FLOAT&&(Y=s.RGBA16F),O===s.UNSIGNED_BYTE&&(Y=Q===rt?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT&&de&&(Y=de.RGBA16_EXT),O===s.SHORT&&de&&(Y=de.RGBA16_SNORM_EXT),O===s.UNSIGNED_SHORT_4_4_4_4&&(Y=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(Y=s.RGB5_A1)}return(Y===s.R16F||Y===s.R32F||Y===s.RG16F||Y===s.RG32F||Y===s.RGBA16F||Y===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function y(R,b){let O;return R?b===null||b===Ui||b===Vs?O=s.DEPTH24_STENCIL8:b===Ci?O=s.DEPTH32F_STENCIL8:b===zs&&(O=s.DEPTH24_STENCIL8,De("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Ui||b===Vs?O=s.DEPTH_COMPONENT24:b===Ci?O=s.DEPTH_COMPONENT32F:b===zs&&(O=s.DEPTH_COMPONENT16),O}function E(R,b){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Vt&&R.minFilter!==Xt?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}function A(R){const b=R.target;b.removeEventListener("dispose",A),w(b),b.isVideoTexture&&h.delete(b),b.isHTMLTexture&&f.delete(b)}function S(R){const b=R.target;b.removeEventListener("dispose",S),C(b)}function w(R){const b=i.get(R);if(b.__webglInit===void 0)return;const O=R.source,Z=u.get(O);if(Z){const ne=Z[b.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&P(R),Object.keys(Z).length===0&&u.delete(O)}i.remove(R)}function P(R){const b=i.get(R);s.deleteTexture(b.__webglTexture);const O=R.source,Z=u.get(O);delete Z[b.__cacheKey],r.memory.textures--}function C(R){const b=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(b.__webglFramebuffer[Z]))for(let ne=0;ne<b.__webglFramebuffer[Z].length;ne++)s.deleteFramebuffer(b.__webglFramebuffer[Z][ne]);else s.deleteFramebuffer(b.__webglFramebuffer[Z]);b.__webglDepthbuffer&&s.deleteRenderbuffer(b.__webglDepthbuffer[Z])}else{if(Array.isArray(b.__webglFramebuffer))for(let Z=0;Z<b.__webglFramebuffer.length;Z++)s.deleteFramebuffer(b.__webglFramebuffer[Z]);else s.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&s.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&s.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let Z=0;Z<b.__webglColorRenderbuffer.length;Z++)b.__webglColorRenderbuffer[Z]&&s.deleteRenderbuffer(b.__webglColorRenderbuffer[Z]);b.__webglDepthRenderbuffer&&s.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const O=R.textures;for(let Z=0,ne=O.length;Z<ne;Z++){const re=i.get(O[Z]);re.__webglTexture&&(s.deleteTexture(re.__webglTexture),r.memory.textures--),i.remove(O[Z])}i.remove(R)}let L=0;function z(){L=0}function B(){return L}function I(R){L=R}function U(){const R=L;return R>=n.maxTextures&&De("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+n.maxTextures),L+=1,R}function N(R){const b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}function $(R,b){const O=i.get(R);if(R.isVideoTexture&&ut(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){const Z=R.image;if(Z===null)De("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)De("WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(O,R,b);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+b)}function te(R,b){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Ee(O,R,b);return}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+b)}function se(R,b){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Ee(O,R,b);return}t.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+b)}function G(R,b){const O=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&O.__version!==R.version){Re(O,R,b);return}t.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+b)}const ee={[_o]:s.REPEAT,[Ki]:s.CLAMP_TO_EDGE,[vo]:s.MIRRORED_REPEAT},ae={[Vt]:s.NEAREST,[Jf]:s.NEAREST_MIPMAP_NEAREST,[Zs]:s.NEAREST_MIPMAP_LINEAR,[Xt]:s.LINEAR,[gr]:s.LINEAR_MIPMAP_NEAREST,[Dn]:s.LINEAR_MIPMAP_LINEAR},Te={[tu]:s.NEVER,[ru]:s.ALWAYS,[iu]:s.LESS,[Ml]:s.LEQUAL,[nu]:s.EQUAL,[bl]:s.GEQUAL,[su]:s.GREATER,[au]:s.NOTEQUAL};function be(R,b){if(b.type===Ci&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Xt||b.magFilter===gr||b.magFilter===Zs||b.magFilter===Dn||b.minFilter===Xt||b.minFilter===gr||b.minFilter===Zs||b.minFilter===Dn)&&De("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,ee[b.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,ee[b.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,ee[b.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,ae[b.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,ae[b.minFilter]),b.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,Te[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Vt||b.minFilter!==Zs&&b.minFilter!==Dn||b.type===Ci&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");s.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,n.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function q(R,b){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",A));const Z=b.source;let ne=u.get(Z);ne===void 0&&(ne={},u.set(Z,ne));const re=N(b);if(re!==R.__cacheKey){ne[re]===void 0&&(ne[re]={texture:s.createTexture(),usedTimes:0},r.memory.textures++,O=!0),ne[re].usedTimes++;const de=ne[R.__cacheKey];de!==void 0&&(ne[R.__cacheKey].usedTimes--,de.usedTimes===0&&P(b)),R.__cacheKey=re,R.__webglTexture=ne[re].texture}return O}function J(R,b,O){return Math.floor(Math.floor(R/O)/b)}function j(R,b,O,Z){const re=R.updateRanges;if(re.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,b.width,b.height,O,Z,b.data);else{re.sort((Se,ce)=>Se.start-ce.start);let de=0;for(let Se=1;Se<re.length;Se++){const ce=re[de],oe=re[Se],Ne=ce.start+ce.count,ze=J(oe.start,b.width,4),et=J(ce.start,b.width,4);oe.start<=Ne+1&&ze===et&&J(oe.start+oe.count-1,b.width,4)===ze?ce.count=Math.max(ce.count,oe.start+oe.count-ce.start):(++de,re[de]=oe)}re.length=de+1;const Y=t.getParameter(s.UNPACK_ROW_LENGTH),Q=t.getParameter(s.UNPACK_SKIP_PIXELS),ye=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,b.width);for(let Se=0,ce=re.length;Se<ce;Se++){const oe=re[Se],Ne=Math.floor(oe.start/4),ze=Math.ceil(oe.count/4),et=Ne%b.width,D=Math.floor(Ne/b.width),le=ze,K=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,et),t.pixelStorei(s.UNPACK_SKIP_ROWS,D),t.texSubImage2D(s.TEXTURE_2D,0,et,D,le,K,O,Z,b.data)}R.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,Y),t.pixelStorei(s.UNPACK_SKIP_PIXELS,Q),t.pixelStorei(s.UNPACK_SKIP_ROWS,ye)}}function Ee(R,b,O){let Z=s.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(Z=s.TEXTURE_2D_ARRAY),b.isData3DTexture&&(Z=s.TEXTURE_3D);const ne=q(R,b),re=b.source;t.bindTexture(Z,R.__webglTexture,s.TEXTURE0+O);const de=i.get(re);if(re.version!==de.__version||ne===!0){if(t.activeTexture(s.TEXTURE0+O),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){const K=$e.getPrimaries($e.workingColorSpace),xe=b.colorSpace===fn?null:$e.getPrimaries(b.colorSpace),he=b.colorSpace===fn||K===xe?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,he)}t.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment);let Q=g(b.image,!1,n.maxTextureSize);Q=ue(b,Q);const ye=a.convert(b.format,b.colorSpace),Se=a.convert(b.type);let ce=x(b.internalFormat,ye,Se,b.normalized,b.colorSpace,b.isVideoTexture);be(Z,b);let oe;const Ne=b.mipmaps,ze=b.isVideoTexture!==!0,et=de.__version===void 0||ne===!0,D=re.dataReady,le=E(b,Q);if(b.isDepthTexture)ce=y(b.format===Nn,b.type),et&&(ze?t.texStorage2D(s.TEXTURE_2D,1,ce,Q.width,Q.height):t.texImage2D(s.TEXTURE_2D,0,ce,Q.width,Q.height,0,ye,Se,null));else if(b.isDataTexture)if(Ne.length>0){ze&&et&&t.texStorage2D(s.TEXTURE_2D,le,ce,Ne[0].width,Ne[0].height);for(let K=0,xe=Ne.length;K<xe;K++)oe=Ne[K],ze?D&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,oe.width,oe.height,ye,Se,oe.data):t.texImage2D(s.TEXTURE_2D,K,ce,oe.width,oe.height,0,ye,Se,oe.data);b.generateMipmaps=!1}else ze?(et&&t.texStorage2D(s.TEXTURE_2D,le,ce,Q.width,Q.height),D&&j(b,Q,ye,Se)):t.texImage2D(s.TEXTURE_2D,0,ce,Q.width,Q.height,0,ye,Se,Q.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){ze&&et&&t.texStorage3D(s.TEXTURE_2D_ARRAY,le,ce,Ne[0].width,Ne[0].height,Q.depth);for(let K=0,xe=Ne.length;K<xe;K++)if(oe=Ne[K],b.format!==vi)if(ye!==null)if(ze){if(D)if(b.layerUpdates.size>0){const he=Oc(oe.width,oe.height,b.format,b.type);for(const ie of b.layerUpdates){const Ce=oe.data.subarray(ie*he/oe.data.BYTES_PER_ELEMENT,(ie+1)*he/oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,ie,oe.width,oe.height,1,ye,Ce)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,oe.width,oe.height,Q.depth,ye,oe.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,K,ce,oe.width,oe.height,Q.depth,0,oe.data,0,0);else De("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ze?D&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,oe.width,oe.height,Q.depth,ye,Se,oe.data):t.texImage3D(s.TEXTURE_2D_ARRAY,K,ce,oe.width,oe.height,Q.depth,0,ye,Se,oe.data)}else{ze&&et&&t.texStorage2D(s.TEXTURE_2D,le,ce,Ne[0].width,Ne[0].height);for(let K=0,xe=Ne.length;K<xe;K++)oe=Ne[K],b.format!==vi?ye!==null?ze?D&&t.compressedTexSubImage2D(s.TEXTURE_2D,K,0,0,oe.width,oe.height,ye,oe.data):t.compressedTexImage2D(s.TEXTURE_2D,K,ce,oe.width,oe.height,0,oe.data):De("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ze?D&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,oe.width,oe.height,ye,Se,oe.data):t.texImage2D(s.TEXTURE_2D,K,ce,oe.width,oe.height,0,ye,Se,oe.data)}else if(b.isDataArrayTexture)if(ze){if(et&&t.texStorage3D(s.TEXTURE_2D_ARRAY,le,ce,Q.width,Q.height,Q.depth),D)if(b.layerUpdates.size>0){const K=Oc(Q.width,Q.height,b.format,b.type);for(const xe of b.layerUpdates){const he=Q.data.subarray(xe*K/Q.data.BYTES_PER_ELEMENT,(xe+1)*K/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,xe,Q.width,Q.height,1,ye,Se,he)}b.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ye,Se,Q.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,ce,Q.width,Q.height,Q.depth,0,ye,Se,Q.data);else if(b.isData3DTexture)ze?(et&&t.texStorage3D(s.TEXTURE_3D,le,ce,Q.width,Q.height,Q.depth),D&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ye,Se,Q.data)):t.texImage3D(s.TEXTURE_3D,0,ce,Q.width,Q.height,Q.depth,0,ye,Se,Q.data);else if(b.isFramebufferTexture){if(et)if(ze)t.texStorage2D(s.TEXTURE_2D,le,ce,Q.width,Q.height);else{let K=Q.width,xe=Q.height;for(let he=0;he<le;he++)t.texImage2D(s.TEXTURE_2D,he,ce,K,xe,0,ye,Se,null),K>>=1,xe>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in s){const K=s.canvas;if(K.hasAttribute("layoutsubtree")||K.setAttribute("layoutsubtree","true"),Q.parentNode!==K){K.appendChild(Q),f.add(b),K.onpaint=Be=>{const bt=Be.changedElements;for(const lt of f)bt.includes(lt.image)&&(lt.needsUpdate=!0)},K.requestPaint();return}const xe=0,he=s.RGBA,ie=s.RGBA,Ce=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,xe,he,ie,Ce,Q),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ne.length>0){if(ze&&et){const K=vt(Ne[0]);t.texStorage2D(s.TEXTURE_2D,le,ce,K.width,K.height)}for(let K=0,xe=Ne.length;K<xe;K++)oe=Ne[K],ze?D&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,ye,Se,oe):t.texImage2D(s.TEXTURE_2D,K,ce,ye,Se,oe);b.generateMipmaps=!1}else if(ze){if(et){const K=vt(Q);t.texStorage2D(s.TEXTURE_2D,le,ce,K.width,K.height)}D&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ye,Se,Q)}else t.texImage2D(s.TEXTURE_2D,0,ce,ye,Se,Q);m(b)&&M(Z),de.__version=re.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function Re(R,b,O){if(b.image.length!==6)return;const Z=q(R,b),ne=b.source;t.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+O);const re=i.get(ne);if(ne.version!==re.__version||Z===!0){t.activeTexture(s.TEXTURE0+O);const de=$e.getPrimaries($e.workingColorSpace),Y=b.colorSpace===fn?null:$e.getPrimaries(b.colorSpace),Q=b.colorSpace===fn||de===Y?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);const ye=b.isCompressedTexture||b.image[0].isCompressedTexture,Se=b.image[0]&&b.image[0].isDataTexture,ce=[];for(let ie=0;ie<6;ie++)!ye&&!Se?ce[ie]=g(b.image[ie],!0,n.maxCubemapSize):ce[ie]=Se?b.image[ie].image:b.image[ie],ce[ie]=ue(b,ce[ie]);const oe=ce[0],Ne=a.convert(b.format,b.colorSpace),ze=a.convert(b.type),et=x(b.internalFormat,Ne,ze,b.normalized,b.colorSpace),D=b.isVideoTexture!==!0,le=re.__version===void 0||Z===!0,K=ne.dataReady;let xe=E(b,oe);be(s.TEXTURE_CUBE_MAP,b);let he;if(ye){D&&le&&t.texStorage2D(s.TEXTURE_CUBE_MAP,xe,et,oe.width,oe.height);for(let ie=0;ie<6;ie++){he=ce[ie].mipmaps;for(let Ce=0;Ce<he.length;Ce++){const Be=he[Ce];b.format!==vi?Ne!==null?D?K&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce,0,0,Be.width,Be.height,Ne,Be.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce,et,Be.width,Be.height,0,Be.data):De("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?K&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce,0,0,Be.width,Be.height,Ne,ze,Be.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce,et,Be.width,Be.height,0,Ne,ze,Be.data)}}}else{if(he=b.mipmaps,D&&le){he.length>0&&xe++;const ie=vt(ce[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,xe,et,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(Se){D?K&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,ce[ie].width,ce[ie].height,Ne,ze,ce[ie].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,et,ce[ie].width,ce[ie].height,0,Ne,ze,ce[ie].data);for(let Ce=0;Ce<he.length;Ce++){const bt=he[Ce].image[ie].image;D?K&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce+1,0,0,bt.width,bt.height,Ne,ze,bt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce+1,et,bt.width,bt.height,0,Ne,ze,bt.data)}}else{D?K&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Ne,ze,ce[ie]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,et,Ne,ze,ce[ie]);for(let Ce=0;Ce<he.length;Ce++){const Be=he[Ce];D?K&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce+1,0,0,Ne,ze,Be.image[ie]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce+1,et,Ne,ze,Be.image[ie])}}}m(b)&&M(s.TEXTURE_CUBE_MAP),re.__version=ne.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function Pe(R,b,O,Z,ne,re){const de=a.convert(O.format,O.colorSpace),Y=a.convert(O.type),Q=x(O.internalFormat,de,Y,O.normalized,O.colorSpace),ye=i.get(b),Se=i.get(O);if(Se.__renderTarget=b,!ye.__hasExternalTextures){const ce=Math.max(1,b.width>>re),oe=Math.max(1,b.height>>re);ne===s.TEXTURE_3D||ne===s.TEXTURE_2D_ARRAY?t.texImage3D(ne,re,Q,ce,oe,b.depth,0,de,Y,null):t.texImage2D(ne,re,Q,ce,oe,0,de,Y,null)}t.bindFramebuffer(s.FRAMEBUFFER,R),Xe(b)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Z,ne,Se.__webglTexture,0,Lt(b)):(ne===s.TEXTURE_2D||ne>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Z,ne,Se.__webglTexture,re),t.bindFramebuffer(s.FRAMEBUFFER,null)}function nt(R,b,O){if(s.bindRenderbuffer(s.RENDERBUFFER,R),b.depthBuffer){const Z=b.depthTexture,ne=Z&&Z.isDepthTexture?Z.type:null,re=y(b.stencilBuffer,ne),de=b.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Xe(b)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Lt(b),re,b.width,b.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,Lt(b),re,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,re,b.width,b.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,de,s.RENDERBUFFER,R)}else{const Z=b.textures;for(let ne=0;ne<Z.length;ne++){const re=Z[ne],de=a.convert(re.format,re.colorSpace),Y=a.convert(re.type),Q=x(re.internalFormat,de,Y,re.normalized,re.colorSpace);Xe(b)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Lt(b),Q,b.width,b.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,Lt(b),Q,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,Q,b.width,b.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ke(R,b,O){const Z=b.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ne=i.get(b.depthTexture);if(ne.__renderTarget=b,(!ne.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),Z){if(ne.__webglInit===void 0&&(ne.__webglInit=!0,b.depthTexture.addEventListener("dispose",A)),ne.__webglTexture===void 0){ne.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,ne.__webglTexture),be(s.TEXTURE_CUBE_MAP,b.depthTexture);const ye=a.convert(b.depthTexture.format),Se=a.convert(b.depthTexture.type);let ce;b.depthTexture.format===en?ce=s.DEPTH_COMPONENT24:b.depthTexture.format===Nn&&(ce=s.DEPTH24_STENCIL8);for(let oe=0;oe<6;oe++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,ce,b.width,b.height,0,ye,Se,null)}}else $(b.depthTexture,0);const re=ne.__webglTexture,de=Lt(b),Y=Z?s.TEXTURE_CUBE_MAP_POSITIVE_X+O:s.TEXTURE_2D,Q=b.depthTexture.format===Nn?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(b.depthTexture.format===en)Xe(b)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Q,Y,re,0,de):s.framebufferTexture2D(s.FRAMEBUFFER,Q,Y,re,0);else if(b.depthTexture.format===Nn)Xe(b)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Q,Y,re,0,de):s.framebufferTexture2D(s.FRAMEBUFFER,Q,Y,re,0);else throw new Error("Unknown depthTexture format")}function Ze(R){const b=i.get(R),O=R.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==R.depthTexture){const Z=R.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),Z){const ne=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,Z.removeEventListener("dispose",ne)};Z.addEventListener("dispose",ne),b.__depthDisposeCallback=ne}b.__boundDepthTexture=Z}if(R.depthTexture&&!b.__autoAllocateDepthBuffer)if(O)for(let Z=0;Z<6;Z++)ke(b.__webglFramebuffer[Z],R,Z);else{const Z=R.texture.mipmaps;Z&&Z.length>0?ke(b.__webglFramebuffer[0],R,0):ke(b.__webglFramebuffer,R,0)}else if(O){b.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer[Z]),b.__webglDepthbuffer[Z]===void 0)b.__webglDepthbuffer[Z]=s.createRenderbuffer(),nt(b.__webglDepthbuffer[Z],R,!1);else{const ne=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,re=b.__webglDepthbuffer[Z];s.bindRenderbuffer(s.RENDERBUFFER,re),s.framebufferRenderbuffer(s.FRAMEBUFFER,ne,s.RENDERBUFFER,re)}}else{const Z=R.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=s.createRenderbuffer(),nt(b.__webglDepthbuffer,R,!1);else{const ne=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,re=b.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,re),s.framebufferRenderbuffer(s.FRAMEBUFFER,ne,s.RENDERBUFFER,re)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function at(R,b,O){const Z=i.get(R);b!==void 0&&Pe(Z.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&Ze(R)}function Ge(R){const b=R.texture,O=i.get(R),Z=i.get(b);R.addEventListener("dispose",S);const ne=R.textures,re=R.isWebGLCubeRenderTarget===!0,de=ne.length>1;if(de||(Z.__webglTexture===void 0&&(Z.__webglTexture=s.createTexture()),Z.__version=b.version,r.memory.textures++),re){O.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer[Y]=[];for(let Q=0;Q<b.mipmaps.length;Q++)O.__webglFramebuffer[Y][Q]=s.createFramebuffer()}else O.__webglFramebuffer[Y]=s.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer=[];for(let Y=0;Y<b.mipmaps.length;Y++)O.__webglFramebuffer[Y]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(de)for(let Y=0,Q=ne.length;Y<Q;Y++){const ye=i.get(ne[Y]);ye.__webglTexture===void 0&&(ye.__webglTexture=s.createTexture(),r.memory.textures++)}if(R.samples>0&&Xe(R)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let Y=0;Y<ne.length;Y++){const Q=ne[Y];O.__webglColorRenderbuffer[Y]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[Y]);const ye=a.convert(Q.format,Q.colorSpace),Se=a.convert(Q.type),ce=x(Q.internalFormat,ye,Se,Q.normalized,Q.colorSpace,R.isXRRenderTarget===!0),oe=Lt(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,oe,ce,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Y,s.RENDERBUFFER,O.__webglColorRenderbuffer[Y])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),nt(O.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(re){t.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture),be(s.TEXTURE_CUBE_MAP,b);for(let Y=0;Y<6;Y++)if(b.mipmaps&&b.mipmaps.length>0)for(let Q=0;Q<b.mipmaps.length;Q++)Pe(O.__webglFramebuffer[Y][Q],R,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Q);else Pe(O.__webglFramebuffer[Y],R,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);m(b)&&M(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(de){for(let Y=0,Q=ne.length;Y<Q;Y++){const ye=ne[Y],Se=i.get(ye);let ce=s.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ce=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ce,Se.__webglTexture),be(ce,ye),Pe(O.__webglFramebuffer,R,ye,s.COLOR_ATTACHMENT0+Y,ce,0),m(ye)&&M(ce)}t.unbindTexture()}else{let Y=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Y=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Y,Z.__webglTexture),be(Y,b),b.mipmaps&&b.mipmaps.length>0)for(let Q=0;Q<b.mipmaps.length;Q++)Pe(O.__webglFramebuffer[Q],R,b,s.COLOR_ATTACHMENT0,Y,Q);else Pe(O.__webglFramebuffer,R,b,s.COLOR_ATTACHMENT0,Y,0);m(b)&&M(Y),t.unbindTexture()}R.depthBuffer&&Ze(R)}function It(R){const b=R.textures;for(let O=0,Z=b.length;O<Z;O++){const ne=b[O];if(m(ne)){const re=v(R),de=i.get(ne).__webglTexture;t.bindTexture(re,de),M(re),t.unbindTexture()}}}const xt=[],ei=[];function k(R){if(R.samples>0){if(Xe(R)===!1){const b=R.textures,O=R.width,Z=R.height;let ne=s.COLOR_BUFFER_BIT;const re=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,de=i.get(R),Y=b.length>1;if(Y)for(let ye=0;ye<b.length;ye++)t.bindFramebuffer(s.FRAMEBUFFER,de.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,de.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);const Q=R.texture.mipmaps;Q&&Q.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let ye=0;ye<b.length;ye++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ne|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ne|=s.STENCIL_BUFFER_BIT)),Y){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,de.__webglColorRenderbuffer[ye]);const Se=i.get(b[ye]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Se,0)}s.blitFramebuffer(0,0,O,Z,0,0,O,Z,ne,s.NEAREST),l===!0&&(xt.length=0,ei.length=0,xt.push(s.COLOR_ATTACHMENT0+ye),R.depthBuffer&&R.resolveDepthBuffer===!1&&(xt.push(re),ei.push(re),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,ei)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,xt))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Y)for(let ye=0;ye<b.length;ye++){t.bindFramebuffer(s.FRAMEBUFFER,de.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.RENDERBUFFER,de.__webglColorRenderbuffer[ye]);const Se=i.get(b[ye]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,de.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.TEXTURE_2D,Se,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const b=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[b])}}}function Lt(R){return Math.min(n.maxSamples,R.samples)}function Xe(R){const b=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function ut(R){const b=r.render.frame;h.get(R)!==b&&(h.set(R,b),R.update())}function ue(R,b){const O=R.colorSpace,Z=R.format,ne=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==qa&&O!==fn&&($e.getTransfer(O)===rt?(Z!==vi||ne!==ri)&&De("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Qe("WebGLTextures: Unsupported texture color space:",O)),b}function vt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=z,this.getTextureUnits=B,this.setTextureUnits=I,this.setTexture2D=$,this.setTexture2DArray=te,this.setTexture3D=se,this.setTextureCube=G,this.rebindTextures=at,this.setupRenderTarget=Ge,this.updateRenderTargetMipmap=It,this.updateMultisampleRenderTarget=k,this.setupDepthRenderbuffer=Ze,this.setupFrameBufferTexture=Pe,this.useMultisampledRTT=Xe,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Ny(s,e){function t(i,n=fn){let a;const r=$e.getTransfer(n);if(i===ri)return s.UNSIGNED_BYTE;if(i===yl)return s.UNSIGNED_SHORT_4_4_4_4;if(i===xl)return s.UNSIGNED_SHORT_5_5_5_1;if(i===Xh)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===qh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===Wh)return s.BYTE;if(i===Gh)return s.SHORT;if(i===zs)return s.UNSIGNED_SHORT;if(i===gl)return s.INT;if(i===Ui)return s.UNSIGNED_INT;if(i===Ci)return s.FLOAT;if(i===Qi)return s.HALF_FLOAT;if(i===Yh)return s.ALPHA;if(i===$h)return s.RGB;if(i===vi)return s.RGBA;if(i===en)return s.DEPTH_COMPONENT;if(i===Nn)return s.DEPTH_STENCIL;if(i===Kh)return s.RED;if(i===_l)return s.RED_INTEGER;if(i===Vn)return s.RG;if(i===vl)return s.RG_INTEGER;if(i===Sl)return s.RGBA_INTEGER;if(i===Na||i===ka||i===Ua||i===Ba)if(r===rt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Na)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ka)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ua)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ba)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Na)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ka)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ua)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ba)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===So||i===Mo||i===bo||i===Eo)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===So)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Mo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===bo)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Eo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===To||i===wo||i===Ao||i===Ro||i===Co||i===Ga||i===Po)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===To||i===wo)return r===rt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===Ao)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===Ro)return a.COMPRESSED_R11_EAC;if(i===Co)return a.COMPRESSED_SIGNED_R11_EAC;if(i===Ga)return a.COMPRESSED_RG11_EAC;if(i===Po)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Io||i===Lo||i===Do||i===No||i===ko||i===Uo||i===Bo||i===Fo||i===Oo||i===zo||i===Vo||i===Ho||i===Wo||i===Go)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Io)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Lo)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Do)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===No)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ko)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Uo)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Bo)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Fo)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Oo)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===zo)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Vo)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ho)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Wo)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Go)return r===rt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Xo||i===qo||i===Yo)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===Xo)return r===rt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===qo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Yo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===$o||i===Ko||i===Xa||i===jo)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===$o)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Ko)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Xa)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===jo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Vs?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:t}}const ky=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Uy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class By{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new nd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Bi({vertexShader:ky,fragmentShader:Uy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ft(new ir(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Fy extends Wn{constructor(e,t){super();const i=this;let n=null,a=1,r=null,o="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,p=null;const _=typeof XRWebGLBinding<"u",g=new By,m={},M=t.getContextAttributes();let v=null,x=null;const y=[],E=[],A=new it;let S=null;const w=new gi;w.viewport=new Mt;const P=new gi;P.viewport=new Mt;const C=[w,P],L=new $u;let z=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let J=y[q];return J===void 0&&(J=new Er,y[q]=J),J.getTargetRaySpace()},this.getControllerGrip=function(q){let J=y[q];return J===void 0&&(J=new Er,y[q]=J),J.getGripSpace()},this.getHand=function(q){let J=y[q];return J===void 0&&(J=new Er,y[q]=J),J.getHandSpace()};function I(q){const J=E.indexOf(q.inputSource);if(J===-1)return;const j=y[J];j!==void 0&&(j.update(q.inputSource,q.frame,c||r),j.dispatchEvent({type:q.type,data:q.inputSource}))}function U(){n.removeEventListener("select",I),n.removeEventListener("selectstart",I),n.removeEventListener("selectend",I),n.removeEventListener("squeeze",I),n.removeEventListener("squeezestart",I),n.removeEventListener("squeezeend",I),n.removeEventListener("end",U),n.removeEventListener("inputsourceschange",N);for(let q=0;q<y.length;q++){const J=E[q];J!==null&&(E[q]=null,y[q].disconnect(J))}z=null,B=null,g.reset();for(const q in m)delete m[q];e.setRenderTarget(v),u=null,d=null,f=null,n=null,x=null,be.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){a=q,i.isPresenting===!0&&De("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,i.isPresenting===!0&&De("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(n,t)),f},this.getFrame=function(){return p},this.getSession=function(){return n},this.setSession=async function(q){if(n=q,n!==null){if(v=e.getRenderTarget(),n.addEventListener("select",I),n.addEventListener("selectstart",I),n.addEventListener("selectend",I),n.addEventListener("squeeze",I),n.addEventListener("squeezestart",I),n.addEventListener("squeezeend",I),n.addEventListener("end",U),n.addEventListener("inputsourceschange",N),M.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let j=null,Ee=null,Re=null;M.depth&&(Re=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,j=M.stencil?Nn:en,Ee=M.stencil?Vs:Ui);const Pe={colorFormat:t.RGBA8,depthFormat:Re,scaleFactor:a};f=this.getBinding(),d=f.createProjectionLayer(Pe),n.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Di(d.textureWidth,d.textureHeight,{format:vi,type:ri,depthTexture:new ms(d.textureWidth,d.textureHeight,Ee,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const j={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(n,t,j),n.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new Di(u.framebufferWidth,u.framebufferHeight,{format:vi,type:ri,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await n.requestReferenceSpace(o),be.setContext(n),be.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function N(q){for(let J=0;J<q.removed.length;J++){const j=q.removed[J],Ee=E.indexOf(j);Ee>=0&&(E[Ee]=null,y[Ee].disconnect(j))}for(let J=0;J<q.added.length;J++){const j=q.added[J];let Ee=E.indexOf(j);if(Ee===-1){for(let Pe=0;Pe<y.length;Pe++)if(Pe>=E.length){E.push(j),Ee=Pe;break}else if(E[Pe]===null){E[Pe]=j,Ee=Pe;break}if(Ee===-1)break}const Re=y[Ee];Re&&Re.connect(j)}}const $=new V,te=new V;function se(q,J,j){$.setFromMatrixPosition(J.matrixWorld),te.setFromMatrixPosition(j.matrixWorld);const Ee=$.distanceTo(te),Re=J.projectionMatrix.elements,Pe=j.projectionMatrix.elements,nt=Re[14]/(Re[10]-1),ke=Re[14]/(Re[10]+1),Ze=(Re[9]+1)/Re[5],at=(Re[9]-1)/Re[5],Ge=(Re[8]-1)/Re[0],It=(Pe[8]+1)/Pe[0],xt=nt*Ge,ei=nt*It,k=Ee/(-Ge+It),Lt=k*-Ge;if(J.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Lt),q.translateZ(k),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Re[10]===-1)q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const Xe=nt+k,ut=ke+k,ue=xt-Lt,vt=ei+(Ee-Lt),R=Ze*ke/ut*Xe,b=at*ke/ut*Xe;q.projectionMatrix.makePerspective(ue,vt,R,b,Xe,ut),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function G(q,J){J===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(J.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(n===null)return;let J=q.near,j=q.far;g.texture!==null&&(g.depthNear>0&&(J=g.depthNear),g.depthFar>0&&(j=g.depthFar)),L.near=P.near=w.near=J,L.far=P.far=w.far=j,(z!==L.near||B!==L.far)&&(n.updateRenderState({depthNear:L.near,depthFar:L.far}),z=L.near,B=L.far),L.layers.mask=q.layers.mask|6,w.layers.mask=L.layers.mask&-5,P.layers.mask=L.layers.mask&-3;const Ee=q.parent,Re=L.cameras;G(L,Ee);for(let Pe=0;Pe<Re.length;Pe++)G(Re[Pe],Ee);Re.length===2?se(L,w,P):L.projectionMatrix.copy(w.projectionMatrix),ee(q,L,Ee)};function ee(q,J,j){j===null?q.matrix.copy(J.matrixWorld):(q.matrix.copy(j.matrixWorld),q.matrix.invert(),q.matrix.multiply(J.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Qo*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(L)},this.getCameraTexture=function(q){return m[q]};let ae=null;function Te(q,J){if(h=J.getViewerPose(c||r),p=J,h!==null){const j=h.views;u!==null&&(e.setRenderTargetFramebuffer(x,u.framebuffer),e.setRenderTarget(x));let Ee=!1;j.length!==L.cameras.length&&(L.cameras.length=0,Ee=!0);for(let ke=0;ke<j.length;ke++){const Ze=j[ke];let at=null;if(u!==null)at=u.getViewport(Ze);else{const It=f.getViewSubImage(d,Ze);at=It.viewport,ke===0&&(e.setRenderTargetTextures(x,It.colorTexture,It.depthStencilTexture),e.setRenderTarget(x))}let Ge=C[ke];Ge===void 0&&(Ge=new gi,Ge.layers.enable(ke),Ge.viewport=new Mt,C[ke]=Ge),Ge.matrix.fromArray(Ze.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(Ze.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(at.x,at.y,at.width,at.height),ke===0&&(L.matrix.copy(Ge.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Ee===!0&&L.cameras.push(Ge)}const Re=n.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&_){f=i.getBinding();const ke=f.getDepthInformation(j[0]);ke&&ke.isValid&&ke.texture&&g.init(ke,n.renderState)}if(Re&&Re.includes("camera-access")&&_){e.state.unbindTexture(),f=i.getBinding();for(let ke=0;ke<j.length;ke++){const Ze=j[ke].camera;if(Ze){let at=m[Ze];at||(at=new nd,m[Ze]=at);const Ge=f.getCameraImage(Ze);at.sourceTexture=Ge}}}}for(let j=0;j<y.length;j++){const Ee=E[j],Re=y[j];Ee!==null&&Re!==void 0&&Re.update(Ee,J,c||r)}ae&&ae(q,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),p=null}const be=new od;be.setAnimationLoop(Te),this.setAnimationLoop=function(q){ae=q},this.dispose=function(){}}}const Oy=new At,pd=new Ue;pd.set(-1,0,0,0,1,0,0,0,1);function zy(s,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function i(g,m){m.color.getRGB(g.fogColor.value,sd(s)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function n(g,m,M,v,x){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?a(g,m):m.isMeshLambertMaterial?(a(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(a(g,m),f(g,m)):m.isMeshPhongMaterial?(a(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(a(g,m),d(g,m),m.isMeshPhysicalMaterial&&u(g,m,x)):m.isMeshMatcapMaterial?(a(g,m),p(g,m)):m.isMeshDepthMaterial?a(g,m):m.isMeshDistanceMaterial?(a(g,m),_(g,m)):m.isMeshNormalMaterial?a(g,m):m.isLineBasicMaterial?(r(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,M,v):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function a(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Qt&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Qt&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const M=e.get(m),v=M.envMap,x=M.envMapRotation;v&&(g.envMap.value=v,g.envMapRotation.value.setFromMatrix4(Oy.makeRotationFromEuler(x)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(pd),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function r(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,M,v){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*M,g.scale.value=v*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function f(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function u(g,m,M){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Qt&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function _(g,m){const M=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function Vy(s,e,t,i){let n={},a={},r=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,v){const x=v.program;i.uniformBlockBinding(M,x)}function c(M,v){let x=n[M.id];x===void 0&&(p(M),x=h(M),n[M.id]=x,M.addEventListener("dispose",g));const y=v.program;i.updateUBOMapping(M,y);const E=e.render.frame;a[M.id]!==E&&(d(M),a[M.id]=E)}function h(M){const v=f();M.__bindingPointIndex=v;const x=s.createBuffer(),y=M.__size,E=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,x),s.bufferData(s.UNIFORM_BUFFER,y,E),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,x),x}function f(){for(let M=0;M<o;M++)if(r.indexOf(M)===-1)return r.push(M),M;return Qe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const v=n[M.id],x=M.uniforms,y=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let E=0,A=x.length;E<A;E++){const S=Array.isArray(x[E])?x[E]:[x[E]];for(let w=0,P=S.length;w<P;w++){const C=S[w];if(u(C,E,w,y)===!0){const L=C.__offset,z=Array.isArray(C.value)?C.value:[C.value];let B=0;for(let I=0;I<z.length;I++){const U=z[I],N=_(U);typeof U=="number"||typeof U=="boolean"?(C.__data[0]=U,s.bufferSubData(s.UNIFORM_BUFFER,L+B,C.__data)):U.isMatrix3?(C.__data[0]=U.elements[0],C.__data[1]=U.elements[1],C.__data[2]=U.elements[2],C.__data[3]=0,C.__data[4]=U.elements[3],C.__data[5]=U.elements[4],C.__data[6]=U.elements[5],C.__data[7]=0,C.__data[8]=U.elements[6],C.__data[9]=U.elements[7],C.__data[10]=U.elements[8],C.__data[11]=0):ArrayBuffer.isView(U)?C.__data.set(new U.constructor(U.buffer,U.byteOffset,C.__data.length)):(U.toArray(C.__data,B),B+=N.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,L,C.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function u(M,v,x,y){const E=M.value,A=v+"_"+x;if(y[A]===void 0)return typeof E=="number"||typeof E=="boolean"?y[A]=E:ArrayBuffer.isView(E)?y[A]=E.slice():y[A]=E.clone(),!0;{const S=y[A];if(typeof E=="number"||typeof E=="boolean"){if(S!==E)return y[A]=E,!0}else{if(ArrayBuffer.isView(E))return!0;if(S.equals(E)===!1)return S.copy(E),!0}}return!1}function p(M){const v=M.uniforms;let x=0;const y=16;for(let A=0,S=v.length;A<S;A++){const w=Array.isArray(v[A])?v[A]:[v[A]];for(let P=0,C=w.length;P<C;P++){const L=w[P],z=Array.isArray(L.value)?L.value:[L.value];for(let B=0,I=z.length;B<I;B++){const U=z[B],N=_(U),$=x%y,te=$%N.boundary,se=$+te;x+=te,se!==0&&y-se<N.storage&&(x+=y-se),L.__data=new Float32Array(N.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=x,x+=N.storage}}}const E=x%y;return E>0&&(x+=y-E),M.__size=x,M.__cache={},this}function _(M){const v={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(v.boundary=4,v.storage=4):M.isVector2?(v.boundary=8,v.storage=8):M.isVector3||M.isColor?(v.boundary=16,v.storage=12):M.isVector4?(v.boundary=16,v.storage=16):M.isMatrix3?(v.boundary=48,v.storage=48):M.isMatrix4?(v.boundary=64,v.storage=64):M.isTexture?De("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(v.boundary=16,v.storage=M.byteLength):De("WebGLRenderer: Unsupported uniform value type.",M),v}function g(M){const v=M.target;v.removeEventListener("dispose",g);const x=r.indexOf(v.__bindingPointIndex);r.splice(x,1),s.deleteBuffer(n[v.id]),delete n[v.id],delete a[v.id]}function m(){for(const M in n)s.deleteBuffer(n[M]);r=[],n={},a={}}return{bind:l,update:c,dispose:m}}const Hy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ai=null;function Wy(){return Ai===null&&(Ai=new Lu(Hy,16,16,Vn,Qi),Ai.name="DFG_LUT",Ai.minFilter=Xt,Ai.magFilter=Xt,Ai.wrapS=Ki,Ai.wrapT=Ki,Ai.generateMipmaps=!1,Ai.needsUpdate=!0),Ai}class Gy{constructor(e={}){const{canvas:t=lu(),context:i=null,depth:n=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1,outputBufferType:u=ri}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=r;const _=u,g=new Set([Sl,vl,_l]),m=new Set([ri,Ui,zs,Vs,yl,xl]),M=new Uint32Array(4),v=new Int32Array(4),x=new V;let y=null,E=null;const A=[],S=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Li,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let C=!1,L=null;this._outputColorSpace=ci;let z=0,B=0,I=null,U=-1,N=null;const $=new Mt,te=new Mt;let se=null;const G=new st(0);let ee=0,ae=t.width,Te=t.height,be=1,q=null,J=null;const j=new Mt(0,0,ae,Te),Ee=new Mt(0,0,ae,Te);let Re=!1;const Pe=new wl;let nt=!1,ke=!1;const Ze=new At,at=new V,Ge=new Mt,It={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let xt=!1;function ei(){return I===null?be:1}let k=i;function Lt(T,F){return t.getContext(T,F)}try{const T={alpha:!0,depth:n,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ml}`),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",Ce,!1),t.addEventListener("webglcontextcreationerror",Be,!1),k===null){const F="webgl2";if(k=Lt(F,T),k===null)throw Lt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw Qe("WebGLRenderer: "+T.message),T}let Xe,ut,ue,vt,R,b,O,Z,ne,re,de,Y,Q,ye,Se,ce,oe,Ne,ze,et,D,le,K;function xe(){Xe=new W0(k),Xe.init(),D=new Ny(k,Xe),ut=new k0(k,Xe,e,D),ue=new Ly(k,Xe),ut.reversedDepthBuffer&&d&&ue.buffers.depth.setReversed(!0),vt=new q0(k),R=new xy,b=new Dy(k,Xe,ue,R,ut,D,vt),O=new H0(P),Z=new ju(k),le=new D0(k,Z),ne=new G0(k,Z,vt,le),re=new $0(k,ne,Z,le,vt),Ne=new Y0(k,ut,b),Se=new U0(R),de=new yy(P,O,Xe,ut,le,Se),Y=new zy(P,R),Q=new vy,ye=new wy(Xe),oe=new L0(P,O,ue,re,p,l),ce=new Iy(P,re,ut),K=new Vy(k,vt,ut,ue),ze=new N0(k,Xe,vt),et=new X0(k,Xe,vt),vt.programs=de.programs,P.capabilities=ut,P.extensions=Xe,P.properties=R,P.renderLists=Q,P.shadowMap=ce,P.state=ue,P.info=vt}xe(),_!==ri&&(w=new j0(_,t.width,t.height,n,a));const he=new Fy(P,k);this.xr=he,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const T=Xe.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Xe.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return be},this.setPixelRatio=function(T){T!==void 0&&(be=T,this.setSize(ae,Te,!1))},this.getSize=function(T){return T.set(ae,Te)},this.setSize=function(T,F,X=!0){if(he.isPresenting){De("WebGLRenderer: Can't change size while VR device is presenting.");return}ae=T,Te=F,t.width=Math.floor(T*be),t.height=Math.floor(F*be),X===!0&&(t.style.width=T+"px",t.style.height=F+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,T,F)},this.getDrawingBufferSize=function(T){return T.set(ae*be,Te*be).floor()},this.setDrawingBufferSize=function(T,F,X){ae=T,Te=F,be=X,t.width=Math.floor(T*X),t.height=Math.floor(F*X),this.setViewport(0,0,T,F)},this.setEffects=function(T){if(_===ri){Qe("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let F=0;F<T.length;F++)if(T[F].isOutputPass===!0){De("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy($)},this.getViewport=function(T){return T.copy(j)},this.setViewport=function(T,F,X,H){T.isVector4?j.set(T.x,T.y,T.z,T.w):j.set(T,F,X,H),ue.viewport($.copy(j).multiplyScalar(be).round())},this.getScissor=function(T){return T.copy(Ee)},this.setScissor=function(T,F,X,H){T.isVector4?Ee.set(T.x,T.y,T.z,T.w):Ee.set(T,F,X,H),ue.scissor(te.copy(Ee).multiplyScalar(be).round())},this.getScissorTest=function(){return Re},this.setScissorTest=function(T){ue.setScissorTest(Re=T)},this.setOpaqueSort=function(T){q=T},this.setTransparentSort=function(T){J=T},this.getClearColor=function(T){return T.copy(oe.getClearColor())},this.setClearColor=function(){oe.setClearColor(...arguments)},this.getClearAlpha=function(){return oe.getClearAlpha()},this.setClearAlpha=function(){oe.setClearAlpha(...arguments)},this.clear=function(T=!0,F=!0,X=!0){let H=0;if(T){let W=!1;if(I!==null){const ge=I.texture.format;W=g.has(ge)}if(W){const ge=I.texture.type,Me=m.has(ge),me=oe.getClearColor(),we=oe.getClearAlpha(),Ie=me.r,Fe=me.g,He=me.b;Me?(M[0]=Ie,M[1]=Fe,M[2]=He,M[3]=we,k.clearBufferuiv(k.COLOR,0,M)):(v[0]=Ie,v[1]=Fe,v[2]=He,v[3]=we,k.clearBufferiv(k.COLOR,0,v))}else H|=k.COLOR_BUFFER_BIT}F&&(H|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(H|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&k.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),L=T},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",Ce,!1),t.removeEventListener("webglcontextcreationerror",Be,!1),oe.dispose(),Q.dispose(),ye.dispose(),R.dispose(),O.dispose(),re.dispose(),le.dispose(),K.dispose(),de.dispose(),he.dispose(),he.removeEventListener("sessionstart",Zl),he.removeEventListener("sessionend",Jl),bn.stop()};function ie(T){T.preventDefault(),yc("WebGLRenderer: Context Lost."),C=!0}function Ce(){yc("WebGLRenderer: Context Restored."),C=!1;const T=vt.autoReset,F=ce.enabled,X=ce.autoUpdate,H=ce.needsUpdate,W=ce.type;xe(),vt.autoReset=T,ce.enabled=F,ce.autoUpdate=X,ce.needsUpdate=H,ce.type=W}function Be(T){Qe("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function bt(T){const F=T.target;F.removeEventListener("dispose",bt),lt(F)}function lt(T){Fi(T),R.remove(T)}function Fi(T){const F=R.get(T).programs;F!==void 0&&(F.forEach(function(X){de.releaseProgram(X)}),T.isShaderMaterial&&de.releaseShaderCache(T))}this.renderBufferDirect=function(T,F,X,H,W,ge){F===null&&(F=It);const Me=W.isMesh&&W.matrixWorld.determinant()<0,me=Cd(T,F,X,H,W);ue.setMaterial(H,Me);let we=X.index,Ie=1;if(H.wireframe===!0){if(we=ne.getWireframeAttribute(X),we===void 0)return;Ie=2}const Fe=X.drawRange,He=X.attributes.position;let Le=Fe.start*Ie,ct=(Fe.start+Fe.count)*Ie;ge!==null&&(Le=Math.max(Le,ge.start*Ie),ct=Math.min(ct,(ge.start+ge.count)*Ie)),we!==null?(Le=Math.max(Le,0),ct=Math.min(ct,we.count)):He!=null&&(Le=Math.max(Le,0),ct=Math.min(ct,He.count));const Et=ct-Le;if(Et<0||Et===1/0)return;le.setup(W,H,me,X,we);let St,ht=ze;if(we!==null&&(St=Z.get(we),ht=et,ht.setIndex(St)),W.isMesh)H.wireframe===!0?(ue.setLineWidth(H.wireframeLinewidth*ei()),ht.setMode(k.LINES)):ht.setMode(k.TRIANGLES);else if(W.isLine){let Ht=H.linewidth;Ht===void 0&&(Ht=1),ue.setLineWidth(Ht*ei()),W.isLineSegments?ht.setMode(k.LINES):W.isLineLoop?ht.setMode(k.LINE_LOOP):ht.setMode(k.LINE_STRIP)}else W.isPoints?ht.setMode(k.POINTS):W.isSprite&&ht.setMode(k.TRIANGLES);if(W.isBatchedMesh)if(Xe.get("WEBGL_multi_draw"))ht.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Ht=W._multiDrawStarts,_e=W._multiDrawCounts,ti=W._multiDrawCount,Je=we?Z.get(we).bytesPerElement:1,oi=R.get(H).currentProgram.getUniforms();for(let Ti=0;Ti<ti;Ti++)oi.setValue(k,"_gl_DrawID",Ti),ht.render(Ht[Ti]/Je,_e[Ti])}else if(W.isInstancedMesh)ht.renderInstances(Le,Et,W.count);else if(X.isInstancedBufferGeometry){const Ht=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,_e=Math.min(X.instanceCount,Ht);ht.renderInstances(Le,Et,_e)}else ht.render(Le,Et)};function Ei(T,F,X){T.transparent===!0&&T.side===$i&&T.forceSinglePass===!1?(T.side=Qt,T.needsUpdate=!0,$s(T,F,X),T.side=vn,T.needsUpdate=!0,$s(T,F,X),T.side=$i):$s(T,F,X)}this.compile=function(T,F,X=null){X===null&&(X=T),E=ye.get(X),E.init(F),S.push(E),X.traverseVisible(function(W){W.isLight&&W.layers.test(F.layers)&&(E.pushLight(W),W.castShadow&&E.pushShadow(W))}),T!==X&&T.traverseVisible(function(W){W.isLight&&W.layers.test(F.layers)&&(E.pushLight(W),W.castShadow&&E.pushShadow(W))}),E.setupLights();const H=new Set;return T.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const ge=W.material;if(ge)if(Array.isArray(ge))for(let Me=0;Me<ge.length;Me++){const me=ge[Me];Ei(me,X,W),H.add(me)}else Ei(ge,X,W),H.add(ge)}),E=S.pop(),H},this.compileAsync=function(T,F,X=null){const H=this.compile(T,F,X);return new Promise(W=>{function ge(){if(H.forEach(function(Me){R.get(Me).currentProgram.isReady()&&H.delete(Me)}),H.size===0){W(T);return}setTimeout(ge,10)}Xe.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let cr=null;function Ad(T){cr&&cr(T)}function Zl(){bn.stop()}function Jl(){bn.start()}const bn=new od;bn.setAnimationLoop(Ad),typeof self<"u"&&bn.setContext(self),this.setAnimationLoop=function(T){cr=T,he.setAnimationLoop(T),T===null?bn.stop():bn.start()},he.addEventListener("sessionstart",Zl),he.addEventListener("sessionend",Jl),this.render=function(T,F){if(F!==void 0&&F.isCamera!==!0){Qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;L!==null&&L.renderStart(T,F);const X=he.enabled===!0&&he.isPresenting===!0,H=w!==null&&(I===null||X)&&w.begin(P,I);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),he.enabled===!0&&he.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(he.cameraAutoUpdate===!0&&he.updateCamera(F),F=he.getCamera()),T.isScene===!0&&T.onBeforeRender(P,T,F,I),E=ye.get(T,S.length),E.init(F),E.state.textureUnits=b.getTextureUnits(),S.push(E),Ze.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Pe.setFromProjectionMatrix(Ze,Pi,F.reversedDepth),ke=this.localClippingEnabled,nt=Se.init(this.clippingPlanes,ke),y=Q.get(T,A.length),y.init(),A.push(y),he.enabled===!0&&he.isPresenting===!0){const Me=P.xr.getDepthSensingMesh();Me!==null&&hr(Me,F,-1/0,P.sortObjects)}hr(T,F,0,P.sortObjects),y.finish(),P.sortObjects===!0&&y.sort(q,J),xt=he.enabled===!1||he.isPresenting===!1||he.hasDepthSensing()===!1,xt&&oe.addToRenderList(y,T),this.info.render.frame++,nt===!0&&Se.beginShadows();const W=E.state.shadowsArray;if(ce.render(W,T,F),nt===!0&&Se.endShadows(),this.info.autoReset===!0&&this.info.reset(),(H&&w.hasRenderPass())===!1){const Me=y.opaque,me=y.transmissive;if(E.setupLights(),F.isArrayCamera){const we=F.cameras;if(me.length>0)for(let Ie=0,Fe=we.length;Ie<Fe;Ie++){const He=we[Ie];ec(Me,me,T,He)}xt&&oe.render(T);for(let Ie=0,Fe=we.length;Ie<Fe;Ie++){const He=we[Ie];Ql(y,T,He,He.viewport)}}else me.length>0&&ec(Me,me,T,F),xt&&oe.render(T),Ql(y,T,F)}I!==null&&B===0&&(b.updateMultisampleRenderTarget(I),b.updateRenderTargetMipmap(I)),H&&w.end(P),T.isScene===!0&&T.onAfterRender(P,T,F),le.resetDefaultState(),U=-1,N=null,S.pop(),S.length>0?(E=S[S.length-1],b.setTextureUnits(E.state.textureUnits),nt===!0&&Se.setGlobalState(P.clippingPlanes,E.state.camera)):E=null,A.pop(),A.length>0?y=A[A.length-1]:y=null,L!==null&&L.renderEnd()};function hr(T,F,X,H){if(T.visible===!1)return;if(T.layers.test(F.layers)){if(T.isGroup)X=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(F);else if(T.isLightProbeGrid)E.pushLightProbeGrid(T);else if(T.isLight)E.pushLight(T),T.castShadow&&E.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Pe.intersectsSprite(T)){H&&Ge.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Ze);const Me=re.update(T),me=T.material;me.visible&&y.push(T,Me,me,X,Ge.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Pe.intersectsObject(T))){const Me=re.update(T),me=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ge.copy(T.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),Ge.copy(Me.boundingSphere.center)),Ge.applyMatrix4(T.matrixWorld).applyMatrix4(Ze)),Array.isArray(me)){const we=Me.groups;for(let Ie=0,Fe=we.length;Ie<Fe;Ie++){const He=we[Ie],Le=me[He.materialIndex];Le&&Le.visible&&y.push(T,Me,Le,X,Ge.z,He)}}else me.visible&&y.push(T,Me,me,X,Ge.z,null)}}const ge=T.children;for(let Me=0,me=ge.length;Me<me;Me++)hr(ge[Me],F,X,H)}function Ql(T,F,X,H){const{opaque:W,transmissive:ge,transparent:Me}=T;E.setupLightsView(X),nt===!0&&Se.setGlobalState(P.clippingPlanes,X),H&&ue.viewport($.copy(H)),W.length>0&&Ys(W,F,X),ge.length>0&&Ys(ge,F,X),Me.length>0&&Ys(Me,F,X),ue.buffers.depth.setTest(!0),ue.buffers.depth.setMask(!0),ue.buffers.color.setMask(!0),ue.setPolygonOffset(!1)}function ec(T,F,X,H){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[H.id]===void 0){const Le=Xe.has("EXT_color_buffer_half_float")||Xe.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[H.id]=new Di(1,1,{generateMipmaps:!0,type:Le?Qi:ri,minFilter:Dn,samples:Math.max(4,ut.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace})}const ge=E.state.transmissionRenderTarget[H.id],Me=H.viewport||$;ge.setSize(Me.z*P.transmissionResolutionScale,Me.w*P.transmissionResolutionScale);const me=P.getRenderTarget(),we=P.getActiveCubeFace(),Ie=P.getActiveMipmapLevel();P.setRenderTarget(ge),P.getClearColor(G),ee=P.getClearAlpha(),ee<1&&P.setClearColor(16777215,.5),P.clear(),xt&&oe.render(X);const Fe=P.toneMapping;P.toneMapping=Li;const He=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),E.setupLightsView(H),nt===!0&&Se.setGlobalState(P.clippingPlanes,H),Ys(T,X,H),b.updateMultisampleRenderTarget(ge),b.updateRenderTargetMipmap(ge),Xe.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let ct=0,Et=F.length;ct<Et;ct++){const St=F[ct],{object:ht,geometry:Ht,material:_e,group:ti}=St;if(_e.side===$i&&ht.layers.test(H.layers)){const Je=_e.side;_e.side=Qt,_e.needsUpdate=!0,tc(ht,X,H,Ht,_e,ti),_e.side=Je,_e.needsUpdate=!0,Le=!0}}Le===!0&&(b.updateMultisampleRenderTarget(ge),b.updateRenderTargetMipmap(ge))}P.setRenderTarget(me,we,Ie),P.setClearColor(G,ee),He!==void 0&&(H.viewport=He),P.toneMapping=Fe}function Ys(T,F,X){const H=F.isScene===!0?F.overrideMaterial:null;for(let W=0,ge=T.length;W<ge;W++){const Me=T[W],{object:me,geometry:we,group:Ie}=Me;let Fe=Me.material;Fe.allowOverride===!0&&H!==null&&(Fe=H),me.layers.test(X.layers)&&tc(me,F,X,we,Fe,Ie)}}function tc(T,F,X,H,W,ge){T.onBeforeRender(P,F,X,H,W,ge),T.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),W.onBeforeRender(P,F,X,H,T,ge),W.transparent===!0&&W.side===$i&&W.forceSinglePass===!1?(W.side=Qt,W.needsUpdate=!0,P.renderBufferDirect(X,F,H,W,T,ge),W.side=vn,W.needsUpdate=!0,P.renderBufferDirect(X,F,H,W,T,ge),W.side=$i):P.renderBufferDirect(X,F,H,W,T,ge),T.onAfterRender(P,F,X,H,W,ge)}function $s(T,F,X){F.isScene!==!0&&(F=It);const H=R.get(T),W=E.state.lights,ge=E.state.shadowsArray,Me=W.state.version,me=de.getParameters(T,W.state,ge,F,X,E.state.lightProbeGridArray),we=de.getProgramCacheKey(me);let Ie=H.programs;H.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?F.environment:null,H.fog=F.fog;const Fe=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;H.envMap=O.get(T.envMap||H.environment,Fe),H.envMapRotation=H.environment!==null&&T.envMap===null?F.environmentRotation:T.envMapRotation,Ie===void 0&&(T.addEventListener("dispose",bt),Ie=new Map,H.programs=Ie);let He=Ie.get(we);if(He!==void 0){if(H.currentProgram===He&&H.lightsStateVersion===Me)return nc(T,me),He}else me.uniforms=de.getUniforms(T),L!==null&&T.isNodeMaterial&&L.build(T,X,me),T.onBeforeCompile(me,P),He=de.acquireProgram(me,we),Ie.set(we,He),H.uniforms=me.uniforms;const Le=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Le.clippingPlanes=Se.uniform),nc(T,me),H.needsLights=Id(T),H.lightsStateVersion=Me,H.needsLights&&(Le.ambientLightColor.value=W.state.ambient,Le.lightProbe.value=W.state.probe,Le.directionalLights.value=W.state.directional,Le.directionalLightShadows.value=W.state.directionalShadow,Le.spotLights.value=W.state.spot,Le.spotLightShadows.value=W.state.spotShadow,Le.rectAreaLights.value=W.state.rectArea,Le.ltc_1.value=W.state.rectAreaLTC1,Le.ltc_2.value=W.state.rectAreaLTC2,Le.pointLights.value=W.state.point,Le.pointLightShadows.value=W.state.pointShadow,Le.hemisphereLights.value=W.state.hemi,Le.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Le.spotLightMatrix.value=W.state.spotLightMatrix,Le.spotLightMap.value=W.state.spotLightMap,Le.pointShadowMatrix.value=W.state.pointShadowMatrix),H.lightProbeGrid=E.state.lightProbeGridArray.length>0,H.currentProgram=He,H.uniformsList=null,He}function ic(T){if(T.uniformsList===null){const F=T.currentProgram.getUniforms();T.uniformsList=Fa.seqWithValue(F.seq,T.uniforms)}return T.uniformsList}function nc(T,F){const X=R.get(T);X.outputColorSpace=F.outputColorSpace,X.batching=F.batching,X.batchingColor=F.batchingColor,X.instancing=F.instancing,X.instancingColor=F.instancingColor,X.instancingMorph=F.instancingMorph,X.skinning=F.skinning,X.morphTargets=F.morphTargets,X.morphNormals=F.morphNormals,X.morphColors=F.morphColors,X.morphTargetsCount=F.morphTargetsCount,X.numClippingPlanes=F.numClippingPlanes,X.numIntersection=F.numClipIntersection,X.vertexAlphas=F.vertexAlphas,X.vertexTangents=F.vertexTangents,X.toneMapping=F.toneMapping}function Rd(T,F){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;x.setFromMatrixPosition(F.matrixWorld);for(let X=0,H=T.length;X<H;X++){const W=T[X];if(W.texture!==null&&W.boundingBox.containsPoint(x))return W}return null}function Cd(T,F,X,H,W){F.isScene!==!0&&(F=It),b.resetTextureUnits();const ge=F.fog,Me=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?F.environment:null,me=I===null?P.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:$e.workingColorSpace,we=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ie=O.get(H.envMap||Me,we),Fe=H.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,He=!!X.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Le=!!X.morphAttributes.position,ct=!!X.morphAttributes.normal,Et=!!X.morphAttributes.color;let St=Li;H.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(St=P.toneMapping);const ht=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Ht=ht!==void 0?ht.length:0,_e=R.get(H),ti=E.state.lights;if(nt===!0&&(ke===!0||T!==N)){const pt=T===N&&H.id===U;Se.setState(H,T,pt)}let Je=!1;H.version===_e.__version?(_e.needsLights&&_e.lightsStateVersion!==ti.state.version||_e.outputColorSpace!==me||W.isBatchedMesh&&_e.batching===!1||!W.isBatchedMesh&&_e.batching===!0||W.isBatchedMesh&&_e.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&_e.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&_e.instancing===!1||!W.isInstancedMesh&&_e.instancing===!0||W.isSkinnedMesh&&_e.skinning===!1||!W.isSkinnedMesh&&_e.skinning===!0||W.isInstancedMesh&&_e.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&_e.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&_e.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&_e.instancingMorph===!1&&W.morphTexture!==null||_e.envMap!==Ie||H.fog===!0&&_e.fog!==ge||_e.numClippingPlanes!==void 0&&(_e.numClippingPlanes!==Se.numPlanes||_e.numIntersection!==Se.numIntersection)||_e.vertexAlphas!==Fe||_e.vertexTangents!==He||_e.morphTargets!==Le||_e.morphNormals!==ct||_e.morphColors!==Et||_e.toneMapping!==St||_e.morphTargetsCount!==Ht||!!_e.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(Je=!0):(Je=!0,_e.__version=H.version);let oi=_e.currentProgram;Je===!0&&(oi=$s(H,F,W),L&&H.isNodeMaterial&&L.onUpdateProgram(H,oi,_e));let Ti=!1,tn=!1,Gn=!1;const dt=oi.getUniforms(),Tt=_e.uniforms;if(ue.useProgram(oi.program)&&(Ti=!0,tn=!0,Gn=!0),H.id!==U&&(U=H.id,tn=!0),_e.needsLights){const pt=Rd(E.state.lightProbeGridArray,W);_e.lightProbeGrid!==pt&&(_e.lightProbeGrid=pt,tn=!0)}if(Ti||N!==T){ue.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),dt.setValue(k,"projectionMatrix",T.projectionMatrix),dt.setValue(k,"viewMatrix",T.matrixWorldInverse);const sn=dt.map.cameraPosition;sn!==void 0&&sn.setValue(k,at.setFromMatrixPosition(T.matrixWorld)),ut.logarithmicDepthBuffer&&dt.setValue(k,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&dt.setValue(k,"isOrthographic",T.isOrthographicCamera===!0),N!==T&&(N=T,tn=!0,Gn=!0)}if(_e.needsLights&&(ti.state.directionalShadowMap.length>0&&dt.setValue(k,"directionalShadowMap",ti.state.directionalShadowMap,b),ti.state.spotShadowMap.length>0&&dt.setValue(k,"spotShadowMap",ti.state.spotShadowMap,b),ti.state.pointShadowMap.length>0&&dt.setValue(k,"pointShadowMap",ti.state.pointShadowMap,b)),W.isSkinnedMesh){dt.setOptional(k,W,"bindMatrix"),dt.setOptional(k,W,"bindMatrixInverse");const pt=W.skeleton;pt&&(pt.boneTexture===null&&pt.computeBoneTexture(),dt.setValue(k,"boneTexture",pt.boneTexture,b))}W.isBatchedMesh&&(dt.setOptional(k,W,"batchingTexture"),dt.setValue(k,"batchingTexture",W._matricesTexture,b),dt.setOptional(k,W,"batchingIdTexture"),dt.setValue(k,"batchingIdTexture",W._indirectTexture,b),dt.setOptional(k,W,"batchingColorTexture"),W._colorsTexture!==null&&dt.setValue(k,"batchingColorTexture",W._colorsTexture,b));const nn=X.morphAttributes;if((nn.position!==void 0||nn.normal!==void 0||nn.color!==void 0)&&Ne.update(W,X,oi),(tn||_e.receiveShadow!==W.receiveShadow)&&(_e.receiveShadow=W.receiveShadow,dt.setValue(k,"receiveShadow",W.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&F.environment!==null&&(Tt.envMapIntensity.value=F.environmentIntensity),Tt.dfgLUT!==void 0&&(Tt.dfgLUT.value=Wy()),tn){if(dt.setValue(k,"toneMappingExposure",P.toneMappingExposure),_e.needsLights&&Pd(Tt,Gn),ge&&H.fog===!0&&Y.refreshFogUniforms(Tt,ge),Y.refreshMaterialUniforms(Tt,H,be,Te,E.state.transmissionRenderTarget[T.id]),_e.needsLights&&_e.lightProbeGrid){const pt=_e.lightProbeGrid;Tt.probesSH.value=pt.texture,Tt.probesMin.value.copy(pt.boundingBox.min),Tt.probesMax.value.copy(pt.boundingBox.max),Tt.probesResolution.value.copy(pt.resolution)}Fa.upload(k,ic(_e),Tt,b)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Fa.upload(k,ic(_e),Tt,b),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&dt.setValue(k,"center",W.center),dt.setValue(k,"modelViewMatrix",W.modelViewMatrix),dt.setValue(k,"normalMatrix",W.normalMatrix),dt.setValue(k,"modelMatrix",W.matrixWorld),H.uniformsGroups!==void 0){const pt=H.uniformsGroups;for(let sn=0,Xn=pt.length;sn<Xn;sn++){const sc=pt[sn];K.update(sc,oi),K.bind(sc,oi)}}return oi}function Pd(T,F){T.ambientLightColor.needsUpdate=F,T.lightProbe.needsUpdate=F,T.directionalLights.needsUpdate=F,T.directionalLightShadows.needsUpdate=F,T.pointLights.needsUpdate=F,T.pointLightShadows.needsUpdate=F,T.spotLights.needsUpdate=F,T.spotLightShadows.needsUpdate=F,T.rectAreaLights.needsUpdate=F,T.hemisphereLights.needsUpdate=F}function Id(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return z},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(T,F,X){const H=R.get(T);H.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),R.get(T.texture).__webglTexture=F,R.get(T.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:X,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,F){const X=R.get(T);X.__webglFramebuffer=F,X.__useDefaultFramebuffer=F===void 0};const Ld=k.createFramebuffer();this.setRenderTarget=function(T,F=0,X=0){I=T,z=F,B=X;let H=null,W=!1,ge=!1;if(T){const me=R.get(T);if(me.__useDefaultFramebuffer!==void 0){ue.bindFramebuffer(k.FRAMEBUFFER,me.__webglFramebuffer),$.copy(T.viewport),te.copy(T.scissor),se=T.scissorTest,ue.viewport($),ue.scissor(te),ue.setScissorTest(se),U=-1;return}else if(me.__webglFramebuffer===void 0)b.setupRenderTarget(T);else if(me.__hasExternalTextures)b.rebindTextures(T,R.get(T.texture).__webglTexture,R.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Fe=T.depthTexture;if(me.__boundDepthTexture!==Fe){if(Fe!==null&&R.has(Fe)&&(T.width!==Fe.image.width||T.height!==Fe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(T)}}const we=T.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(ge=!0);const Ie=R.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ie[F])?H=Ie[F][X]:H=Ie[F],W=!0):T.samples>0&&b.useMultisampledRTT(T)===!1?H=R.get(T).__webglMultisampledFramebuffer:Array.isArray(Ie)?H=Ie[X]:H=Ie,$.copy(T.viewport),te.copy(T.scissor),se=T.scissorTest}else $.copy(j).multiplyScalar(be).floor(),te.copy(Ee).multiplyScalar(be).floor(),se=Re;if(X!==0&&(H=Ld),ue.bindFramebuffer(k.FRAMEBUFFER,H)&&ue.drawBuffers(T,H),ue.viewport($),ue.scissor(te),ue.setScissorTest(se),W){const me=R.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+F,me.__webglTexture,X)}else if(ge){const me=F;for(let we=0;we<T.textures.length;we++){const Ie=R.get(T.textures[we]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+we,Ie.__webglTexture,X,me)}}else if(T!==null&&X!==0){const me=R.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,me.__webglTexture,X)}U=-1},this.readRenderTargetPixels=function(T,F,X,H,W,ge,Me,me=0){if(!(T&&T.isWebGLRenderTarget)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=R.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Me!==void 0&&(we=we[Me]),we){ue.bindFramebuffer(k.FRAMEBUFFER,we);try{const Ie=T.textures[me],Fe=Ie.format,He=Ie.type;if(T.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+me),!ut.textureFormatReadable(Fe)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ut.textureTypeReadable(He)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=T.width-H&&X>=0&&X<=T.height-W&&k.readPixels(F,X,H,W,D.convert(Fe),D.convert(He),ge)}finally{const Ie=I!==null?R.get(I).__webglFramebuffer:null;ue.bindFramebuffer(k.FRAMEBUFFER,Ie)}}},this.readRenderTargetPixelsAsync=async function(T,F,X,H,W,ge,Me,me=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=R.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Me!==void 0&&(we=we[Me]),we)if(F>=0&&F<=T.width-H&&X>=0&&X<=T.height-W){ue.bindFramebuffer(k.FRAMEBUFFER,we);const Ie=T.textures[me],Fe=Ie.format,He=Ie.type;if(T.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+me),!ut.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ut.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Le=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Le),k.bufferData(k.PIXEL_PACK_BUFFER,ge.byteLength,k.STREAM_READ),k.readPixels(F,X,H,W,D.convert(Fe),D.convert(He),0);const ct=I!==null?R.get(I).__webglFramebuffer:null;ue.bindFramebuffer(k.FRAMEBUFFER,ct);const Et=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await cu(k,Et,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Le),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,ge),k.deleteBuffer(Le),k.deleteSync(Et),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,F=null,X=0){const H=Math.pow(2,-X),W=Math.floor(T.image.width*H),ge=Math.floor(T.image.height*H),Me=F!==null?F.x:0,me=F!==null?F.y:0;b.setTexture2D(T,0),k.copyTexSubImage2D(k.TEXTURE_2D,X,0,0,Me,me,W,ge),ue.unbindTexture()};const Dd=k.createFramebuffer(),Nd=k.createFramebuffer();this.copyTextureToTexture=function(T,F,X=null,H=null,W=0,ge=0){let Me,me,we,Ie,Fe,He,Le,ct,Et;const St=T.isCompressedTexture?T.mipmaps[ge]:T.image;if(X!==null)Me=X.max.x-X.min.x,me=X.max.y-X.min.y,we=X.isBox3?X.max.z-X.min.z:1,Ie=X.min.x,Fe=X.min.y,He=X.isBox3?X.min.z:0;else{const Tt=Math.pow(2,-W);Me=Math.floor(St.width*Tt),me=Math.floor(St.height*Tt),T.isDataArrayTexture?we=St.depth:T.isData3DTexture?we=Math.floor(St.depth*Tt):we=1,Ie=0,Fe=0,He=0}H!==null?(Le=H.x,ct=H.y,Et=H.z):(Le=0,ct=0,Et=0);const ht=D.convert(F.format),Ht=D.convert(F.type);let _e;F.isData3DTexture?(b.setTexture3D(F,0),_e=k.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(b.setTexture2DArray(F,0),_e=k.TEXTURE_2D_ARRAY):(b.setTexture2D(F,0),_e=k.TEXTURE_2D),ue.activeTexture(k.TEXTURE0),ue.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,F.flipY),ue.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),ue.pixelStorei(k.UNPACK_ALIGNMENT,F.unpackAlignment);const ti=ue.getParameter(k.UNPACK_ROW_LENGTH),Je=ue.getParameter(k.UNPACK_IMAGE_HEIGHT),oi=ue.getParameter(k.UNPACK_SKIP_PIXELS),Ti=ue.getParameter(k.UNPACK_SKIP_ROWS),tn=ue.getParameter(k.UNPACK_SKIP_IMAGES);ue.pixelStorei(k.UNPACK_ROW_LENGTH,St.width),ue.pixelStorei(k.UNPACK_IMAGE_HEIGHT,St.height),ue.pixelStorei(k.UNPACK_SKIP_PIXELS,Ie),ue.pixelStorei(k.UNPACK_SKIP_ROWS,Fe),ue.pixelStorei(k.UNPACK_SKIP_IMAGES,He);const Gn=T.isDataArrayTexture||T.isData3DTexture,dt=F.isDataArrayTexture||F.isData3DTexture;if(T.isDepthTexture){const Tt=R.get(T),nn=R.get(F),pt=R.get(Tt.__renderTarget),sn=R.get(nn.__renderTarget);ue.bindFramebuffer(k.READ_FRAMEBUFFER,pt.__webglFramebuffer),ue.bindFramebuffer(k.DRAW_FRAMEBUFFER,sn.__webglFramebuffer);for(let Xn=0;Xn<we;Xn++)Gn&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,R.get(T).__webglTexture,W,He+Xn),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,R.get(F).__webglTexture,ge,Et+Xn)),k.blitFramebuffer(Ie,Fe,Me,me,Le,ct,Me,me,k.DEPTH_BUFFER_BIT,k.NEAREST);ue.bindFramebuffer(k.READ_FRAMEBUFFER,null),ue.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(W!==0||T.isRenderTargetTexture||R.has(T)){const Tt=R.get(T),nn=R.get(F);ue.bindFramebuffer(k.READ_FRAMEBUFFER,Dd),ue.bindFramebuffer(k.DRAW_FRAMEBUFFER,Nd);for(let pt=0;pt<we;pt++)Gn?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Tt.__webglTexture,W,He+pt):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Tt.__webglTexture,W),dt?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,nn.__webglTexture,ge,Et+pt):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,nn.__webglTexture,ge),W!==0?k.blitFramebuffer(Ie,Fe,Me,me,Le,ct,Me,me,k.COLOR_BUFFER_BIT,k.NEAREST):dt?k.copyTexSubImage3D(_e,ge,Le,ct,Et+pt,Ie,Fe,Me,me):k.copyTexSubImage2D(_e,ge,Le,ct,Ie,Fe,Me,me);ue.bindFramebuffer(k.READ_FRAMEBUFFER,null),ue.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else dt?T.isDataTexture||T.isData3DTexture?k.texSubImage3D(_e,ge,Le,ct,Et,Me,me,we,ht,Ht,St.data):F.isCompressedArrayTexture?k.compressedTexSubImage3D(_e,ge,Le,ct,Et,Me,me,we,ht,St.data):k.texSubImage3D(_e,ge,Le,ct,Et,Me,me,we,ht,Ht,St):T.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,ge,Le,ct,Me,me,ht,Ht,St.data):T.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,ge,Le,ct,St.width,St.height,ht,St.data):k.texSubImage2D(k.TEXTURE_2D,ge,Le,ct,Me,me,ht,Ht,St);ue.pixelStorei(k.UNPACK_ROW_LENGTH,ti),ue.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Je),ue.pixelStorei(k.UNPACK_SKIP_PIXELS,oi),ue.pixelStorei(k.UNPACK_SKIP_ROWS,Ti),ue.pixelStorei(k.UNPACK_SKIP_IMAGES,tn),ge===0&&F.generateMipmaps&&k.generateMipmap(_e),ue.unbindTexture()},this.initRenderTarget=function(T){R.get(T).__webglFramebuffer===void 0&&b.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?b.setTextureCube(T,0):T.isData3DTexture?b.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?b.setTexture2DArray(T,0):b.setTexture2D(T,0),ue.unbindTexture()},this.resetState=function(){z=0,B=0,I=null,ue.reset(),le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}}const rs=80;class Xy{constructor(){this.ready=!1,this.loadPromise=null,this._renderer=null,this._scene=null,this._camera=null,this._model=null,this._tmpCanvas=null,this._phases={}}init(){return this.loadPromise?this.loadPromise:(this.loadPromise=this._setup().catch(e=>{console.error("[CharacterRenderer] Failed to load model:",e)}),this.loadPromise)}draw(e,t,i,n,a,r,o){if(!this.ready)return!1;this._phases[t]||(this._phases[t]=0);const l=r>.3;l?this._phases[t]=(this._phases[t]+r*.09)%(Math.PI*2):this._phases[t]*=.88;const c=this._phases[t],h=this._model;h.rotation.y=-a+Math.PI/2,l?(h.position.y=Math.abs(Math.sin(c))*.04,h.rotation.z=Math.sin(c)*.08):o?(h.position.y=0,h.rotation.z=0,h.rotation.x=-.12):(h.position.y*=.85,h.rotation.z*=.85,h.rotation.x*=.85),this._renderer.render(this._scene,this._camera);const f=this._tmpCanvas.getContext("2d");return f.clearRect(0,0,rs,rs),f.drawImage(this._renderer.domElement,0,0),e.save(),e.translate(i,n),e.drawImage(this._tmpCanvas,-40,-44),e.restore(),!0}async _setup(){this._renderer=new Gy({antialias:!0,alpha:!0,preserveDrawingBuffer:!0}),this._renderer.setSize(rs,rs),this._renderer.setPixelRatio(1),this._renderer.setClearColor(0,0),this._renderer.shadowMap.enabled=!1,this._tmpCanvas=document.createElement("canvas"),this._tmpCanvas.width=rs,this._tmpCanvas.height=rs,this._scene=new Tu;const e=.65;this._camera=new nr(-e,e,e,-e,.01,30),this._camera.position.set(0,9,0),this._camera.lookAt(0,0,0);const t=new qu(16777215,1.1);this._scene.add(t);const i=new Bc(16777215,.9);i.position.set(1,8,2),this._scene.add(i);const n=new Bc(11193599,.4);n.position.set(-2,5,-3),this._scene.add(n),this._model=await this._loadModel(),this._fitModel(this._model),this._scene.add(this._model),this.ready=!0,console.log("[CharacterRenderer] elf girl model loaded ✓")}createCustomRobotModel(){const e=new kn,t=new dn(8,5,20,8),i=new Vr({color:2040877,metalness:.95,roughness:.15,name:"robot-armor"}),n=new ft(t,i);n.position.y=20,e.add(n);const a=new dn(2,2,2,8),r=new Us({color:6749425}),o=new ft(a,r);o.rotation.x=Math.PI/2,o.position.set(0,23,7.5),e.add(o);const l=new kn;l.position.set(0,33,0);const c=new Ka(4.5,12,12),h=new ft(c,i);l.add(h);const f=new _n(7,1.2,4),d=new Us({color:16727100}),u=new ft(f,d);u.position.set(0,1,3.2),l.add(u);const p=new dn(.2,.2,6,4),_=new ft(p,i);_.position.set(-3.5,4,-1),_.rotation.z=-.25,l.add(_);const g=new ft(p,i);g.position.set(3.5,4,-1),g.rotation.z=.25,l.add(g),e.add(l);const m=new Ka(4,8,8),M=new ft(m,i);M.position.set(-10,26,0),M.scale.set(1.2,1,1),e.add(M);const v=new ft(m,i);v.position.set(10,26,0),v.scale.set(1.2,1,1),e.add(v);const x=new Vr({color:1118481,metalness:.8,roughness:.4}),y=new dn(1.5,1.2,10,6),E=new ft(y,x);E.position.set(-11,19,2),E.rotation.x=.4,e.add(E);const A=new ft(y,x);A.position.set(11,19,-2),A.rotation.x=-.4,e.add(A);const S=new _n(8,14,5),w=new ft(S,i);w.position.set(0,20,-6);const P=new dn(1,1.8,4,8),C=new ft(P,x);C.position.set(-3,-8,0),w.add(C);const L=new ft(P,x);L.position.set(3,-8,0),w.add(L);const z=new dn(1.2,.1,5,8),B=new Us({color:16755200,transparent:!0,opacity:.8,blending:lo}),I=new ft(z,B);I.position.set(-3,-11,0),w.add(I);const U=new ft(z,B);U.position.set(3,-11,0),w.add(U),e.add(w);const N=new ft(y,x);N.position.set(-4,6,0),e.add(N);const $=new ft(y,x);$.position.set(4,6,0),e.add($);const te=new _n(2,2.5,18),se=new Vr({color:330776,metalness:.9,roughness:.2}),G=new ft(te,se);G.position.set(7,16,-10),G.rotation.y=.1,e.add(G);const ee=new kn;return ee.add(e),ee}_loadModel(){return Promise.resolve(this.createCustomRobotModel())}_fitModel(e){const t=new Hn().setFromObject(e),i=new V;t.getSize(i);const n=new V;t.getCenter(n);const r=1.1/Math.max(i.x,i.y,i.z);e.scale.setScalar(r);const o=new Hn().setFromObject(e),l=new V;o.getCenter(l),e.position.set(-l.x,-l.y,-l.z)}}const mn=new Xy,il=4200,qy=900,Nt=s=>String((s==null?void 0:s.id)??s??""),ch=(s,e)=>{const t=((s==null?void 0:s.x)||0)-((e==null?void 0:e.x)||0),i=((s==null?void 0:s.y)||0)-((e==null?void 0:e.y)||0);return t*t+i*i};function hh(s=[],e=0){const t=new Map;for(const i of s)t.has(i.team)||t.set(i.team,{team:i.team,sightings:new Map,assignments:new Map,coverClaims:new Map,updatedAt:e});return t}function dh(s,e){var t;return((t=s==null?void 0:s.get)==null?void 0:t.call(s,e))||null}function Yy(s,e,t,i){if(!s||!t||t.health<=0)return null;const n=Nt(t),a=s.sightings.get(n),r=new Set((a==null?void 0:a.seenBy)||[]);r.add(Nt(e));const o={targetId:n,x:t.x,y:t.y,vx:Number.isFinite(t.vx)?t.vx:0,vy:Number.isFinite(t.vy)?t.vy:0,seenAt:i,seenBy:r};return s.sightings.set(n,o),s.updatedAt=i,o}function nl(s,e,t,i=il){var a,r;const n=(r=(a=s==null?void 0:s.sightings)==null?void 0:a.get)==null?void 0:r.call(a,Nt(e));return n&&t-n.seenAt<=i?n:null}function md(s,e,t=null){if(!s)return;const i=t?new Set([...t].map(Nt)):null;for(const[n,a]of s.sightings)(e-a.seenAt>il||i&&!i.has(n))&&s.sightings.delete(n);for(const[n,a]of s.assignments)(i&&!i.has(a.targetId)||e>a.expiresAt+il)&&s.assignments.delete(n);for(const[n,a]of s.coverClaims)e>a.expiresAt&&s.coverClaims.delete(n)}function $y(s=[],e=[],t,i=0){const n=s.filter(c=>(c==null?void 0:c.health)>0).sort((c,h)=>Nt(c).localeCompare(Nt(h))),a=e.filter(c=>(c==null?void 0:c.health)>0).sort((c,h)=>Nt(c).localeCompare(Nt(h))),r=new Map;if(!t||n.length===0||a.length===0)return r;const o=new Map(a.map(c=>[Nt(c),c]));md(t,i,o.keys());const l=new Set;for(const c of n){const h=Nt(c),f=t.assignments.get(h),d=f&&o.get(f.targetId);d&&f.expiresAt>=i&&!l.has(f.targetId)&&(r.set(h,d),l.add(f.targetId))}for(const c of n){const h=Nt(c);if(r.has(h))continue;let f=a.filter(p=>!l.has(Nt(p)));f.length===0&&(f=a),f.sort((p,_)=>{const g=nl(t,p.id,i)||p,m=nl(t,_.id,i)||_;return ch(c,g)-ch(c,m)||Nt(p).localeCompare(Nt(_))});const d=f[0],u=Nt(d);r.set(h,d),l.add(u),t.assignments.set(h,{targetId:u,assignedAt:i,expiresAt:i+qy})}return t.updatedAt=i,r}function Ky(s,e,t=null){if(!s)return[];md(s,e);const i=Nt(t);return[...s.coverClaims.entries()].filter(([n])=>n!==i).map(([,n])=>({x:n.x,y:n.y}))}function jy(s,e,t,i,n=1600){if(!s||!t)return null;const a={x:t.x,y:t.y,expiresAt:i+n};return s.coverClaims.set(Nt(e),a),a}function Zy(s,e){var t,i;(i=(t=s==null?void 0:s.coverClaims)==null?void 0:t.delete)==null||i.call(t,Nt(e))}function Jy(s=[],e,t={}){const i=new Map,n=new Map;for(const a of s){const r=e instanceof Map?e.get(a.team):e==null?void 0:e[a.team];if(!(r!=null&&r.length))continue;const o=i.get(a.team)||0,c=((t instanceof Map?t.get(a.team)||0:(t==null?void 0:t[a.team])||0)+o)%r.length,h=r[c];n.set(Nt(a),{x:h.x,y:h.y,slot:c}),i.set(a.team,o+1)}return n}function Qy(s,e,t=[],i=18){var r;const n=i*2+14,a=[[0,0],[n,0],[-n,0],[0,n],[0,-n],[n,n],[-n,n],[n,-n],[-n,-n],[n*2,0],[-n*2,0],[0,n*2],[0,-n*2]];for(const[o,l]of a){const c=((r=s==null?void 0:s.projectPoint)==null?void 0:r.call(s,e.x+o,e.y+l,i))||null;if(c&&!(s!=null&&s.isPointClear&&!s.isPointClear(c.x,c.y,i))&&t.every(h=>Math.hypot(h.x-c.x,h.y-c.y)>=n))return{x:c.x,y:c.y}}return null}function fh(){return{waypoints:[],index:0,target:null,plannedAt:-1/0,navRevision:null,purpose:"idle",complete:!1,partialEndpoint:null,partialSince:null,dirty:!0}}function Kr(s){s&&(s.dirty=!0)}function ex(s,e,t,i,n,a="move",r=!0){const o=s.partialEndpoint,l=s.partialSince;s.waypoints=(e||[]).filter(f=>Number.isFinite(f==null?void 0:f.x)&&Number.isFinite(f==null?void 0:f.y)),s.index=0,s.target=t?{x:t.x,y:t.y}:null,s.plannedAt=i,s.navRevision=n,s.purpose=a,s.complete=r;const c=s.waypoints.at(-1)||null,h=!r&&c&&o&&Math.hypot(c.x-o.x,c.y-o.y)<12;return s.partialEndpoint=r||!c?null:{x:c.x,y:c.y},s.partialSince=h?l:null,s.dirty=!1,s}function tx(s,e,t,i,n=24){return!s||s.complete||!s.partialEndpoint?{incomplete:!1,atEndpoint:!1,blockedFor:0}:Math.hypot(e-s.partialEndpoint.x,t-s.partialEndpoint.y)<=n?(Number.isFinite(s.partialSince)||(s.partialSince=i),{incomplete:!0,atEndpoint:!0,blockedFor:Math.max(0,i-s.partialSince)}):(s.partialSince=null,{incomplete:!0,atEndpoint:!1,blockedFor:0})}function ix(s,e,t,i={}){if(!s||s.dirty||!s.target||!s.waypoints.length||!e)return!0;const n=i.targetTolerance??42;return!!(Math.hypot(s.target.x-e.x,s.target.y-e.y)>n||t-s.plannedAt>(i.maxAge??1100)||i.stuck||i.navRevision!=null&&s.navRevision!==i.navRevision)}function nx(s,e,t,i=24){var n;if(!((n=s==null?void 0:s.waypoints)!=null&&n.length))return(s==null?void 0:s.target)||null;for(;s.index<s.waypoints.length-1;){const a=s.waypoints[s.index];if(Math.hypot(e-a.x,t-a.y)>i)break;s.index++}return s.waypoints[Math.min(s.index,s.waypoints.length-1)]||s.target}function sx(s,e,t,i=36){const n=Math.max(1,Number(t)||1),a=e.x-s.x,r=e.y-s.y,o=Math.min(i,Math.max(0,Math.hypot(a,r)-22)/n);return{x:e.x+(Number(e.vx)||0)*o,y:e.y+(Number(e.vy)||0)*o}}function uh(s,e,t){let i=e-s;for(;i<-Math.PI;)i+=Math.PI*2;for(;i>Math.PI;)i-=Math.PI*2;return s+Math.max(-t,Math.min(t,i))}function ax(s,e=[],t=72){let i=0,n=0;for(const a of e){if(!a||a===s||a.health<=0)continue;const r=s.x-a.x,o=s.y-a.y,l=Math.hypot(r,o);if(l>0&&l<t){const c=(t-l)/t;i+=r/l*c,n+=o/l*c}}return{x:i,y:n}}const _a=[{id:"recruit",label:"RECRUIT",minRP:0,maxRP:999,color:"#8a9bb5",icon:"▪"},{id:"veteran",label:"VETERAN",minRP:1e3,maxRP:3999,color:"#e8c84a",icon:"◆"},{id:"elite",label:"ELITE",minRP:4e3,maxRP:1/0,color:"#ff6ef7",icon:"★"}],va=80,Sa=-40,ph={pistol:{name:"Tactical 9mm",damage:22,fireRate:300,accuracy:.95,magSize:12,range:400,reloadTime:1200,speedMultiplier:1,type:"Semi-Auto",recoil:3,bulletSpeed:14},rifle:{name:"Assault Rifle (M4A1)",damage:26,fireRate:110,accuracy:.88,magSize:30,range:600,reloadTime:2200,speedMultiplier:1,type:"Automatic",recoil:4.5,bulletSpeed:16},shotgun:{name:"Shotgun (Remington 870)",damage:14,fireRate:850,accuracy:.65,magSize:6,range:250,reloadTime:2800,speedMultiplier:1,type:"Pump-Action",pellets:7,recoil:12,bulletSpeed:12},sniper:{name:"Sniper Rifle (AWM)",damage:95,fireRate:1500,accuracy:.99,magSize:5,range:1200,reloadTime:2800,speedMultiplier:1,type:"Bolt-Action",recoil:18,bulletSpeed:24},smg:{name:"SMG (MP5)",damage:18,fireRate:75,accuracy:.82,magSize:30,range:350,reloadTime:1500,speedMultiplier:1,type:"Automatic",recoil:2.2,bulletSpeed:13},lmg:{name:"LMG (M249)",damage:25,fireRate:85,accuracy:.75,magSize:100,range:550,reloadTime:4500,speedMultiplier:1,type:"Automatic",recoil:6,bulletSpeed:15},dmr:{name:"DMR (M14 EBR)",damage:45,fireRate:400,accuracy:.94,magSize:20,range:800,reloadTime:2400,speedMultiplier:1,type:"Semi-Auto",recoil:8.5,bulletSpeed:20},knife:{name:"Tactical Knife",damage:55,fireRate:350,accuracy:1,magSize:1,range:60,reloadTime:0,speedMultiplier:1.15,type:"Melee",recoil:0,bulletSpeed:20},vector:{name:"Vector SMG",damage:14,fireRate:48,accuracy:.87,magSize:33,range:320,reloadTime:1100,speedMultiplier:1.02,type:"Automatic",recoil:1.8,bulletSpeed:14},famas:{name:"FAMAS Burst Carbine",damage:20,fireRate:450,accuracy:.93,magSize:25,range:550,reloadTime:1800,speedMultiplier:1,type:"Automatic",pellets:3,recoil:3.5,bulletSpeed:17},plasma:{name:"Plasma Rifle PL-45",damage:32,fireRate:150,accuracy:.92,magSize:20,range:600,reloadTime:2e3,speedMultiplier:1,type:"Automatic",recoil:2,bulletSpeed:10},railgun:{name:"Railgun RG-X",damage:85,fireRate:1400,accuracy:.99,magSize:5,range:1200,reloadTime:3500,speedMultiplier:.95,type:"Automatic",recoil:22,bulletSpeed:32}},os={cyan:{body:"#3ba39f",armor:"#16202c",helmet:"#66fcf1"},green:{body:"#39db14",armor:"#133d07",helmet:"#5eff39"},purple:{body:"#9d3bff",armor:"#20083c",helmet:"#c47aff"},orange:{body:"#ff7f3b",armor:"#3f1b07",helmet:"#ff9d7a"},yellow:{body:"#ffd700",armor:"#3a3000",helmet:"#ffea70"},red:{body:"#ff3c3c",armor:"#3a0707",helmet:"#ff7a7a"}};class rx{constructor(e,t,i,n,a,r,o=!1,l=!1){this.id=e,this.x=t,this.y=i,this.vx=0,this.vy=0,this.radius=18,this.angle=0,this.name=n,this.isLocal=o,this.isBot=l,this.colorTheme=r||(o?"cyan":"red"),this.isTeammate=!1,this.health=100,this.maxHealth=100,this.score=0,this.rp=o?parseInt(localStorage.getItem("tacticstrike_rp")||"0"):0,this.rank=this._calcRank(this.rp),this.weaponKey=a,this.weapon={...ph[a]},this.primaryWeaponKey=a,this.activeSlot=1,this.primaryAmmoInMag=this.weapon.magSize,this.primaryReserveAmmo=this.weapon.magSize*3,this.ammoInMag=this.weapon.magSize,this.reserveAmmo=this.weapon.magSize*3,this.maxReserveAmmo=this.weapon.magSize*5,this.isReloading=!1,this.reloadStartTime=0,this.lastFiredTime=0,this.accel=.3,this.maxSpeed=3.4,this.friction=.84,this.muzzleFlash=0,this.footstepTimer=0,this.currentSpeed=0,this.flashGrenades=1,this.flashAlpha=0,this.throwFlashbangRequest=!1,this.botTargetX=t,this.botTargetY=i,this.botState="patrol",this.lastKnownPlayerPos=null,this.botReactTime=0,this.botLastDecisionTime=0,this.botShootDelay=0,this.botRoute=fh(),this.botTargetPurpose="patrol",this.botAimReadyAt=0,this.botAimTargetId=null,this.botHadLOS=!1,this.botLastSeenAt=-1/0,this.botCoverUntil=0,this.botLaneSign=1,this.flashlightActive=!0,this.botStrafeDir=Math.random()>.5?1:-1,this.botLastStrafeToggle=0,this.dashTrails=[],this.networkJustDashed=!1,this.weaponXP=0,this.weaponLevel=1,this.weaponLevelUpAlert=0,this.healthPacks=0,this.ammoPacks=0}_calcRank(e){for(let t=_a.length-1;t>=0;t--)if(e>=_a[t].minRP)return _a[t];return _a[0]}applyRankDelta(e){this.rp=Math.max(0,this.rp+e);const t=this._calcRank(this.rp),i=t.id!==this.rank.id;if(this.rank=t,this.isLocal)try{localStorage.setItem("tacticstrike_rp",String(this.rp))}catch{}return i}addWeaponXP(e){if(this.health<=0)return;this.weaponXP+=e;let t=!1;for(;this.weaponXP>=this.weaponLevel*100;)this.weaponXP-=this.weaponLevel*100,this.weaponLevel++,t=!0;t&&(this.weaponLevelUpAlert=4,this.isLocal&&!this.isBot&&this.updateHUD())}changeWeapon(e){this.weaponKey=e,this.weapon={...ph[e]},this.ammoInMag=this.weapon.magSize,this.reserveAmmo=this.weapon.magSize*3,this.isReloading=!1,e!=="knife"&&(this.primaryWeaponKey=e,this.primaryAmmoInMag=this.ammoInMag,this.primaryReserveAmmo=this.reserveAmmo)}switchSlot(e){e!==this.activeSlot&&(this.activeSlot===1&&(this.primaryAmmoInMag=this.ammoInMag,this.primaryReserveAmmo=this.reserveAmmo),this.activeSlot=e,e===1?(this.changeWeapon(this.primaryWeaponKey),this.ammoInMag=this.primaryAmmoInMag,this.reserveAmmo=this.primaryReserveAmmo):e===2&&(this.changeWeapon("knife"),this.ammoInMag=1,this.reserveAmmo=1/0),this.isLocal&&!this.isBot&&(this.updateHUD(),window.AppSocket&&window.AppSocket.emit("select-weapon",{weapon:this.weaponKey})))}update(e,t,i,n,a,r=null,o=null,l=null){if(this.health<=0)return;const c=window.gameEngine&&window.gameEngine.matchMode==="sabotage",h=Math.max(1,Math.min(150,a-(this.lastUpdateTime||a)));if(c)if(this.team===1){if(this.flashlightActive=!1,this.weaponKey="none",this.isLocal&&this.inVent){this.vx=0,this.vy=0,this.lastUpdateTime=a,this.health=Math.min(this.health,this.maxHealth),this.flashAlpha=Math.max(0,this.flashAlpha-h*5e-4);return}}else this.flashlightActive=!0;this.lastUpdateTime||(this.lastUpdateTime=a);const f=a-this.lastUpdateTime;this.lastUpdateTime=a;const d=Date.now();this.adrenalineActive=!!(this.adrenalineEndTime&&d<this.adrenalineEndTime),this.overdriveActive=!!(this.overdriveEndTime&&d<this.overdriveEndTime),this.updateBuffsHUD(d);const u=Math.max(1,Math.min(150,f)),p=u/16.67,g=window.gameEngine&&window.gameEngine.isRanked?1.25:1;if(this.isLocal&&!this.isBot){this.handleLocalInput(e,t,n,a,p),this.updateDashHUD(a);const C=window.gameEngine&&window.gameEngine.devCheatActive;if(this.maxHealth=C?200:100,this.aimbotHasLOS=!1,C){this.health>200&&(this.health=200);const L=this.team===1?2:1,z=window.gameEngine.players.filter(B=>B!==this&&B.health>0&&B.team===L);if(z.length>0){const B=window.gameEngine.map;z.sort((U,N)=>Math.hypot(this.x-U.x,this.y-U.y)-Math.hypot(this.x-N.x,this.y-N.y));let I=null;if(B&&(I=z.find(U=>this.checkLineOfSight(B,this.x,this.y,U.x,U.y))),I){const U=Math.hypot(this.x-I.x,this.y-I.y),N=this.weapon.range||400;if(U<=N){this.aimbotHasLOS=!0;const $=I.x-this.x,te=I.y-this.y,se=U>0?Math.max(0,U-22)/U:0,G=$*se,ee=te*se,ae=this.weapon.bulletSpeed||15,Te=I.vx||0,be=I.vy||0,q=Te*Te+be*be,J=ae*ae-q,j=-2*(G*Te+ee*be),Ee=-(G*G+ee*ee);let Re=0;if(Math.abs(J)>.001){const ke=j*j-4*J*Ee;if(ke>=0){const Ze=(-j+Math.sqrt(ke))/(2*J),at=(-j-Math.sqrt(ke))/(2*J);Ze>0&&at>0?Re=Math.min(Ze,at):Ze>0?Re=Ze:at>0&&(Re=at)}}else if(Math.abs(j)>.001){const ke=-Ee/j;ke>0&&(Re=ke)}const Pe=I.x+Te*Re,nt=I.y+be*Re;this.angle=Math.atan2(nt-this.y,Pe-this.x)}}}}else this.health>100&&(this.health=100)}else this.isBot&&this.handleBotAI(i,n,a,r,o,p,l||{});const m=this.isLocal&&e&&e.shift,M=this.adrenalineActive?1.35:1,v=this.weapon.speedMultiplier*(m?1.75:1)*g*M;let x=this.maxSpeed*v;this.lastDashTime&&a-this.lastDashTime<200&&(x=22,(!this.lastTrailSpawnTime||a-this.lastTrailSpawnTime>25)&&(this.dashTrails||(this.dashTrails=[]),this.dashTrails.push({x:this.x,y:this.y,angle:this.angle,time:a}),this.lastTrailSpawnTime=a)),this.dashTrails&&this.dashTrails.length>0&&(this.dashTrails=this.dashTrails.filter(C=>a-C.time<180)),this.vx*=Math.pow(this.friction,p),this.vy*=Math.pow(this.friction,p);const A=Math.sqrt(this.vx*this.vx+this.vy*this.vy);A>x&&(this.vx=this.vx/A*x,this.vy=this.vy/A*x),this.currentSpeed=A;const S=this.x+this.vx*p,w=this.y+this.vy*p,P=i.moveCircle?i.moveCircle(this.x,this.y,this.vx*p,this.vy*p,this.radius):i.checkCircleCollision(S,w,this.radius);if(this.x=P.x,this.y=P.y,P.collided){const C=this.vx*P.normalX+this.vy*P.normalY;C<0&&(this.vx-=C*P.normalX,this.vy-=C*P.normalY)}if((Math.abs(this.vx)>.5||Math.abs(this.vy)>.5)&&(this.footstepTimer+=A,this.footstepTimer>120&&(this.footstepTimer=0,n))){const C=o?Math.hypot(this.x-o.x,this.y-o.y):0;(this.isLocal||C<450)&&n.playFootstep()}if(this.isReloading&&a-this.reloadStartTime>=this.weapon.reloadTime){const L=this.weapon.magSize-this.ammoInMag,z=Math.min(L,this.reserveAmmo);this.ammoInMag+=z,this.reserveAmmo-=z,this.isReloading=!1,this.isLocal&&!this.isBot&&this.updateHUD()}this.muzzleFlash>0&&(this.muzzleFlash=Math.max(0,this.muzzleFlash-.15*p)),this.flashAlpha>0&&(this.flashAlpha=Math.max(0,this.flashAlpha-.008*p)),this.weaponLevelUpAlert>0&&(this.weaponLevelUpAlert=Math.max(0,this.weaponLevelUpAlert-u/1e3))}handleLocalInput(e,t,i,n,a){if(window.gameEngine&&window.gameEngine.activeMinigame){this.vx=0,this.vy=0;return}const o=e&&e.shift?1.75:1;let c=window.gameEngine&&window.gameEngine.isRanked?1.25:1;this.adrenalineActive&&(c*=1.35);const h=this.accel*c;let f=0,d=0;if((e.w||e.arrowup)&&(d-=h*o),(e.s||e.arrowdown)&&(d+=h*o),(e.a||e.arrowleft)&&(f-=h*o),(e.d||e.arrowright)&&(f+=h*o),f!==0&&d!==0&&(f*=.7071,d*=.7071),this.vx+=f*a,this.vy+=d*a,this.angle=t.angle,e&&e[" "]&&(!this.lastDashTime||n-this.lastDashTime>1e4)){this.lastDashTime=n,this.justDashed=!0,this.networkJustDashed=!0;const p=22;if(this.vx=Math.cos(this.angle)*p,this.vy=Math.sin(this.angle)*p,i)try{i.playDashSound(0)}catch{}}(e.r||e.R)&&!this.isReloading&&this.ammoInMag<this.weapon.magSize&&this.reserveAmmo>0&&this.startReload(i,n)}startReload(e,t){if(this.isReloading=!0,this.reloadStartTime=t,e&&e.playReload(this.weaponKey),this.isLocal&&!this.isBot){const i=document.getElementById("reload-indicator");i&&(i.style.display="flex",setTimeout(()=>{i&&(i.style.display="none")},this.weapon.reloadTime))}}shoot(e,t,i=0){if(this.health<=0||this.isReloading||window.gameEngine&&window.gameEngine.matchMode==="sabotage"&&this.team===1)return null;window.gameEngine&&window.gameEngine.devCheatActive&&this.isLocal;const a=this.overdriveEndTime&&e<this.overdriveEndTime||this.overdriveActive?.5:1;if(e-this.lastFiredTime<this.weapon.fireRate*a)return null;if(this.weaponKey!=="knife"&&this.ammoInMag<=0)return t&&t.playDryFire(),this.lastFiredTime=e,this.reserveAmmo>0&&this.startReload(t,e),null;this.weaponKey!=="knife"&&this.ammoInMag--,this.lastFiredTime=e,this.muzzleFlash=this.weaponKey==="knife"?0:1;const r=this.weapon.recoil;return this.vx-=Math.cos(this.angle)*r*.15,this.vy-=Math.sin(this.angle)*r*.15,t&&t.playGunshot(this.weaponKey,i),this.isLocal&&!this.isBot&&this.updateHUD(),{playerId:this.id,x:this.x+Math.cos(this.angle)*22,y:this.y+Math.sin(this.angle)*22,angle:this.angle,weaponKey:this.weaponKey,damage:this.weapon.damage,bulletSpeed:this.weapon.bulletSpeed,range:this.weapon.range,recoil:r,pellets:this.weapon.pellets||1,accuracy:this.weapon.accuracy}}updateHUD(){const e=document.getElementById("hud-self-hp");e&&(e.style.width=`${Math.max(0,this.health)}%`);const t=document.getElementById("hud-self-hp-text");t&&(t.innerText=Math.round(Math.max(0,this.health)));const i=document.getElementById("hud-weapon-name");if(i&&this.weapon&&this.weapon.name){const l=this.weaponKey!=="knife"&&this.weaponKey!=="none"?` [LVL ${this.weaponLevel}]`:"";i.innerText=(this.weapon.name+l).toUpperCase()}const n=document.getElementById("hud-ammo-val");n&&(n.innerText=`${this.ammoInMag} / ${this.reserveAmmo}`);const a=document.getElementById("hud-flash-val");a&&(a.innerText=`FLASH [${this.flashGrenades!==void 0?this.flashGrenades:1}]`,this.flashGrenades<=0?(a.style.color="#ff3c3c",a.style.borderColor="rgba(255, 60, 60, 0.3)"):(a.style.color="#ffd700",a.style.borderColor="rgba(255, 215, 0, 0.3)"));const r=document.getElementById("hud-stashed-packs");r&&(r.innerHTML=`MEDKITS [${this.healthPacks||0}] &nbsp; AMMO PACKS [${this.ammoPacks||0}]`);const o=document.getElementById("hud-weapon-xp-wrapper");if(o)if(this.weaponKey!=="knife"&&this.weaponKey!=="none"){o.style.display="flex";const l=this.weaponLevel*100,c=this.weaponXP/l*100,h=document.getElementById("hud-weapon-xp");h&&(h.style.width=`${c}%`);const f=document.getElementById("hud-weapon-xp-text");f&&(f.innerText=`${this.weaponXP}/${l}`)}else o.style.display="none";for(let l=1;l<=3;l++){const c=document.getElementById(`inv-slot-${l}`);if(c){if(l===3)c.innerText=`[3] FLASH (${this.flashGrenades!==void 0?this.flashGrenades:1})`;else if(l===1){const h=this.primaryWeaponKey?this.primaryWeaponKey.toUpperCase():"PRIMARY";c.innerText=`[1] ${h}`}this.activeSlot===l?(c.style.background="rgba(102, 252, 241, 0.12)",c.style.borderColor="var(--neon-cyan)",c.style.color="#fff",c.style.boxShadow="0 0 8px rgba(102,252,241,0.2)"):(c.style.background="rgba(0, 0, 0, 0.4)",c.style.borderColor="rgba(255,255,255,0.08)",c.style.color="rgba(255,255,255,0.5)",c.style.boxShadow="none")}}}updateDashHUD(e){const i=document.getElementById("hud-dash-status"),n=document.getElementById("hud-dash-icon");if(i)if(!this.lastDashTime||e-this.lastDashTime>=1e4)i.innerText="DASH READY (SPACE)",i.style.color="var(--neon-cyan)",n&&(n.innerText="⚡",n.style.color="var(--neon-cyan)");else{const a=Math.ceil((1e4-(e-this.lastDashTime))/1e3);i.innerText=`DASH COOLDOWN: ${a}s`,i.style.color="#ff3c3c",n&&(n.innerText="⏳",n.style.color="#ff3c3c")}}takeDamage(e,t){if(!(this.health<=0)){if(this.health=Math.max(0,this.health-e),t&&t.playFleshHit(),this.isLocal&&!this.isBot){this.updateHUD();const i=document.getElementById("game-canvas");i&&(i.style.filter="drop-shadow(0 0 10px rgba(255, 0, 0, 0.4))",setTimeout(()=>i.style.filter="none",150))}if(this.isBot&&this.health>0){const i=Date.now();if((!this.lastDashTime||i-this.lastDashTime>3e3)&&Math.random()<.6){this.lastDashTime=i,this.networkJustDashed=!0;const a=this.angle+Math.PI/2*(Math.random()>.5?1:-1);if(this.vx=Math.cos(a)*20,this.vy=Math.sin(a)*20,t&&t.playFrictionalScrape)try{t.playFrictionalScrape(0,.4,.5)}catch{}}}}}checkPickups(e,t){this.health<=0||e.items.forEach(i=>{if(!i.active)return;if(Math.hypot(this.x-i.x,this.y-i.y)<this.radius+12){if(i.active=!1,i.type==="health"){if(this.health>=this.maxHealth)if(this.healthPacks<2)this.healthPacks++,t&&t.playPickup(),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+1 STASHED MEDKIT","#ff6ef7"));else{i.active=!0;return}else if(t&&t.playPickup(),this.health=Math.min(this.maxHealth,this.health+35),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+35 HEALTH"),window.AppSocket)){const r=window.gameEngine&&window.gameEngine.devCheatActive?Math.round(this.health/2):this.health;window.AppSocket.emit("sync-health",{playerId:this.id,health:r})}}else if(i.type==="ammo")if(this.reserveAmmo>=this.maxReserveAmmo)if(this.ammoPacks<2)this.ammoPacks++,t&&t.playPickup(),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+1 STASHED AMMO PACK","#ff6ef7"));else{i.active=!0;return}else{t&&t.playPickup();const a=this.weapon.magSize*2;this.reserveAmmo=Math.min(this.maxReserveAmmo,this.reserveAmmo+a),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+AMMO"))}else i.type==="adrenaline"?(t&&t.playPickup(),this.adrenalineEndTime=Date.now()+8e3,this.adrenalineActive=!0,this.isLocal&&!this.isBot&&this.showTextNotification("⚡ SPEED BOOST ACTIVE")):i.type==="overdrive"&&(this.overdriveEndTime=Date.now()+6e3,this.overdriveActive=!0,this.isLocal&&!this.isBot&&this.showTextNotification("🔥 OVERDRIVE CHARGED"));this.isLocal&&!this.isBot&&window.AppSocket&&window.AppSocket.emit("pickup-item",{itemId:i.id})}})}showTextNotification(e,t="#ffd700"){this.floatingText={text:e,timer:45,yOffset:-30,color:t}}handleBotAI(e,t,i,n,a,r,o={}){const l=o.navigation||null,c=o.blackboard||null,h=o.teammates||[],f=o.combatEnabled!==!1,d=!!(n&&n.health>0),u=d?Math.hypot(this.x-n.x,this.y-n.y):1/0,p=d&&!n.inVent&&u<760&&(l!=null&&l.hasClearPath?l.hasClearPath(this.x,this.y,n.x,n.y,1):this.checkLineOfSight(e,this.x,this.y,n.x,n.y));let g=(d?Math.atan2(n.y-this.y,n.x-this.x):this.angle)-this.angle;for(;g<-Math.PI;)g+=Math.PI*2;for(;g>Math.PI;)g-=Math.PI*2;const m=Math.abs(g)<=38*Math.PI/180,M=p&&(u<145||n.flashlightActive||this.flashlightActive&&m);M?(Yy(c,this,n,i),this.lastKnownPlayerPos={x:n.x,y:n.y},this.botLastSeenAt=i,(!this.botHadLOS||this.botAimTargetId!==String(n.id))&&(this.botAimTargetId=String(n.id),this.botAimReadyAt=i+105+Math.random()*120),this.botHadLOS=!0):i-this.botLastSeenAt>420&&(this.botHadLOS=!1);const v=d?nl(c,n.id,i):null;d&&i-n.lastFiredTime<520&&u<900&&!M&&(this.lastKnownPlayerPos={x:n.x,y:n.y},this.botState="search",this.setBotTarget(e,l,n.x,n.y,"gunshot",i));let y=!1;const E=typeof window<"u"?window.gameEngine:null;if((E==null?void 0:E.matchMode)==="sabotage"){const ae=(E.tasks||[]).filter(Te=>Te.alarmActive);if(ae.length&&!(M&&u<120)){const Te=ae.reduce((be,q)=>!be||Math.hypot(this.x-q.x,this.y-q.y)<Math.hypot(this.x-be.x,this.y-be.y)?q:be,null);Te&&this.setBotTarget(e,l,Te.x,Te.y,"alarm",i)&&(this.botState="search",y=!0)}}const A=i-this.botLastDecisionTime>230;if(!y&&A){this.botLastDecisionTime=i,i-this.botLastStrafeToggle>1100&&(this.botStrafeDir*=-1,this.botLastStrafeToggle=i),this.ammoInMag===0&&!this.isReloading&&this.reserveAmmo>0&&this.startReload(t,i);let ae=!1;const Te=M?n:v;if(Te&&(this.health<46||this.isReloading)&&(l!=null&&l.findCoverPoint)){const q=Ky(c,i,this.id),J=l.findCoverPoint(this.x,this.y,Te.x,Te.y,{radius:this.radius,claimed:q});J&&this.setBotTarget(e,l,J.x,J.y,"cover",i)&&(jy(c,this.id,J,i),this.botState="cover",this.botCoverUntil=i+1250,ae=!0)}if(!ae&&this.health<38&&!M){const J=(e.items||[]).filter(j=>j.active&&j.type==="health").sort((j,Ee)=>Math.hypot(this.x-j.x,this.y-j.y)-Math.hypot(this.x-Ee.x,this.y-Ee.y)).find(j=>!l||l.projectPoint(j.x,j.y,this.radius));J&&this.setBotTarget(e,l,J.x,J.y,"health",i)&&(this.botState="health",ae=!0)}if(!ae&&M){Zy(c,this.id),this.botState="chase",f&&this.flashGrenades>0&&u>240&&u<500&&Math.random()<.035&&(this.throwFlashbangRequest=!0);const q=n.x-this.x,J=n.y-this.y,j=u>1?1/u:0;let Ee,Re;if(this.weaponKey==="sniper"&&u<430)Ee=this.x-q*j*210,Re=this.y-J*j*210;else if(this.weaponKey==="shotgun")Ee=n.x-q*j*62,Re=n.y-J*j*62;else{const Pe=this.botLaneSign||this.botStrafeDir||1,nt=145+(o.laneIndex||0)%2*40;Ee=n.x+-J*j*nt*Pe,Re=n.y+q*j*nt*Pe}this.setBotTarget(e,l,Ee,Re,"chase",i)}else if(!ae&&!M){const q=v||this.lastKnownPlayerPos;let J=Math.hypot(this.x-this.botTargetX,this.y-this.botTargetY);(this.botState==="cover"&&(i>=this.botCoverUntil||!this.isReloading&&this.health>=46)||this.botState==="health"&&(this.health>=55||J<42))&&(this.botState=q?"search":"patrol"),q&&(this.botState==="chase"||this.botState==="search"||v)&&(this.botState="search",this.setBotTarget(e,l,q.x,q.y,v?"shared-sighting":"search",i)),J=Math.hypot(this.x-this.botTargetX,this.y-this.botTargetY),(this.botState==="search"&&J<42||this.botState==="patrol"&&J<42||!Number.isFinite(this.botTargetX)||!Number.isFinite(this.botTargetY))&&(this.botState="patrol",this.choosePatrolPoint(e,l))}}let S=1/0;if(M){const ae=sx(this,n,this.weapon.bulletSpeed||15,30),Te=Math.max(0,Math.min(1,(i-(this.botAimReadyAt-160))/420)),be=i*.006+String(this.id).length*1.7,q=Math.sin(be)*(.045-Te*.026),J=Math.atan2(ae.y-this.y,ae.x-this.x)+q;this.angle=uh(this.angle,J,.095*Math.max(.55,r));let j=J-this.angle;for(;j<-Math.PI;)j+=Math.PI*2;for(;j>Math.PI;)j-=Math.PI*2;S=Math.abs(j)}const w=this.validateBotTarget(e,l,this.botTargetX,this.botTargetY);w?(this.botTargetX=w.x,this.botTargetY=w.y):this.choosePatrolPoint(e,l);const P={x:this.botTargetX,y:this.botTargetY},C=(l==null?void 0:l.obstacleRevision)??null,L=this.botState==="chase"?620:1250,z=h.filter(ae=>ae&&ae!==this&&ae.health>0).map(ae=>({x:ae.x,y:ae.y,radius:ae.radius||18}));if(l&&ix(this.botRoute,P,i,{maxAge:L,targetTolerance:this.botState==="chase"?34:18,navRevision:C,stuck:(this.stuckDuration||0)>430})){const ae=l.findPath(this.x,this.y,P.x,P.y,{radius:this.radius,avoidPoints:z}),Te=ae!=null&&ae.length?ae:[{x:this.x,y:this.y}],be=Te.at(-1),q=!!be&&Math.hypot(be.x-P.x,be.y-P.y)<=this.radius+4;ex(this.botRoute,Te,P,i,C,this.botTargetPurpose,q)}const B=l?nx(this.botRoute,this.x,this.y,this.radius+7):P,I=(B==null?void 0:B.x)??P.x,U=(B==null?void 0:B.y)??P.y,N=Math.hypot(this.x-I,this.y-U),$=tx(this.botRoute,this.x,this.y,i,this.radius+8);if(N>28){if(!this.lastStuckCheckTime)this.lastStuckCheckTime=i,this.lastStuckPosX=this.x,this.lastStuckPosY=this.y,this.stuckDuration=0;else if(i-this.lastStuckCheckTime>300){const ae=Math.hypot(this.x-this.lastStuckPosX,this.y-this.lastStuckPosY);this.stuckDuration=ae<10?(this.stuckDuration||0)+i-this.lastStuckCheckTime:0,this.lastStuckCheckTime=i,this.lastStuckPosX=this.x,this.lastStuckPosY=this.y,this.stuckDuration>430&&Kr(this.botRoute)}}else this.stuckDuration=0;$.atEndpoint&&$.blockedFor>350&&Kr(this.botRoute);const te=Math.max(this.stuckDuration||0,$.blockedFor);if(te>650){const ae=$.incomplete?Math.atan2(P.y-this.y,P.x-this.x):Math.atan2(U-this.y,I-this.x),Te=this.x+Math.cos(ae)*45,be=this.y+Math.sin(ae)*45,q=(e.walls||[]).find(J=>J.type==="crate"&&Te>=J.x&&Te<=J.x+J.w&&be>=J.y&&be<=J.y+J.h);if(f&&q){if(this.angle=Math.atan2(q.y+q.h/2-this.y,q.x+q.w/2-this.x),this.ammoInMag===0&&!this.isReloading&&this.reserveAmmo>0)this.startReload(t,i);else if(!this.isReloading&&this.ammoInMag>0&&i-this.lastFiredTime>=(this.weapon.fireRate||300)){const J=this.shoot(i,t,50);J&&typeof window<"u"&&window.OnBotShootCallback&&window.OnBotShootCallback(J)}}else te>1800&&this.botTargetPurpose!=="alarm"&&(this.botState="patrol",this.choosePatrolPoint(e,l),this.stuckDuration=0)}const se=E==null?void 0:E.isRanked,G=this.accel*(se?1.25:1)*(this.adrenalineActive?1.35:1);if(N>10){const ae=Math.atan2(U-this.y,I-this.x);M||(this.angle=uh(this.angle,ae,.14*Math.max(.7,r))),this.vx+=Math.cos(ae)*G*r,this.vy+=Math.sin(ae)*G*r}const ee=ax(this,h);if(this.vx+=ee.x*G*1.15*r,this.vy+=ee.y*G*1.15*r,f&&M&&i>=this.botAimReadyAt&&S<.105&&!this.isReloading&&this.ammoInMag>0&&u<=(this.weapon.range||400)*1.08){const ae=this.weapon.fireRate||300;if(i-this.lastFiredTime>=ae){const Te=this.shoot(i,t,u);Te&&typeof window<"u"&&window.OnBotShootCallback&&window.OnBotShootCallback(Te)}}}checkLineOfSight(e,t,i,n,a){return!e.getLineIntersection({x:t,y:i},{x:n,y:a})}validateBotTarget(e,t,i,n){var o,l;if(!Number.isFinite(i)||!Number.isFinite(n))return null;if((o=t==null?void 0:t.isPointClear)!=null&&o.call(t,i,n,this.radius))return{x:i,y:n};const a=(l=t==null?void 0:t.projectPoint)==null?void 0:l.call(t,i,n,this.radius);if(a&&Number.isFinite(a.x)&&Number.isFinite(a.y))return a;if(!(e!=null&&e.checkCircleCollision))return null;const r=e.checkCircleCollision(i,n,this.radius);return Number.isFinite(r==null?void 0:r.x)&&Number.isFinite(r==null?void 0:r.y)?r:null}setBotTarget(e,t,i,n,a="move",r=0,o=!1){const l=this.validateBotTarget(e,t,i,n);if(!l)return!1;const c=Math.hypot(l.x-this.botTargetX,l.y-this.botTargetY)>12||this.botTargetPurpose!==a;return this.botTargetX=l.x,this.botTargetY=l.y,this.botTargetPurpose=a,(c||o)&&Kr(this.botRoute),!0}resetBotRound(e,t){return this.botRoute=fh(),this.botState="patrol",this.botTargetPurpose="patrol",this.botAimReadyAt=0,this.botAimTargetId=null,this.botHadLOS=!1,this.botLastSeenAt=-1/0,this.botCoverUntil=0,this.lastKnownPlayerPos=null,this.lastStuckCheckTime=0,this.stuckDuration=0,this.choosePatrolPoint(e,t)}choosePatrolPoint(e,t=null,i=Math.random){var r;const n=(r=t==null?void 0:t.choosePatrolPoint)==null?void 0:r.call(t,this.x,this.y,i);if(n&&this.setBotTarget(e,t,n.x,n.y,"patrol",0,!0))return n;const a=(e==null?void 0:e.rooms)||[];for(let o=0;o<30;o++){const l=a.length?a[Math.floor(i()*a.length)]:{x:60,y:60,w:Math.max(1,((e==null?void 0:e.width)||200)-120),h:Math.max(1,((e==null?void 0:e.height)||200)-120)},c=42,h=l.x+c+i()*Math.max(1,l.w-c*2),f=l.y+c+i()*Math.max(1,l.h-c*2),d=this.validateBotTarget(e,t,h,f);if(d&&this.setBotTarget(e,t,d.x,d.y,"patrol",0,!0))return d}return this.setBotTarget(e,t,this.x,this.y,"patrol",0,!0)?{x:this.botTargetX,y:this.botTargetY}:null}draw(e,t={laser:!0},i=null){var u,p;if(this.inVent)return;if(this.health<=0){e.save(),e.fillStyle="rgba(180, 0, 0, 0.35)",e.beginPath(),e.ellipse(this.x,this.y,this.radius+8,this.radius+4,0,0,Math.PI*2),e.fill(),mn.ready&&(e.save(),e.translate(this.x,this.y),e.rotate(this.angle+Math.PI/2),e.globalAlpha=.55,mn.draw(e,this.id+"_dead",0,0,0,0,!1,this.isLocal?"blue":"red"),e.restore()),e.restore();return}if(e.save(),this.health>0&&this.muzzleFlash>.15){e.save();const _=130*this.muzzleFlash,g=e.createRadialGradient(this.x,this.y,10,this.x,this.y,_);g.addColorStop(0,"rgba(255, 160, 40, 0.28)"),g.addColorStop(.5,"rgba(255, 100, 20, 0.10)"),g.addColorStop(1,"rgba(255, 50, 0, 0.0)"),e.fillStyle=g,e.beginPath(),e.arc(this.x,this.y,_,0,Math.PI*2),e.fill(),e.restore()}const n=window.gameEngine&&window.gameEngine.matchMode==="sabotage";if(t.laser&&this.isLocal&&!this.isReloading&&!n){const _=this.weapon&&this.weapon.range?this.weapon.range:1200;let g=this.x+Math.cos(this.angle)*_,m=this.y+Math.sin(this.angle)*_;if(i){const x=i.getLineIntersection({x:this.x,y:this.y},{x:g,y:m});x&&(g=x.x,m=x.y)}e.save(),e.strokeStyle=this.isLocal?"rgba(102, 252, 241, 0.5)":"rgba(255, 60, 60, 0.5)",e.lineWidth=1.2,e.beginPath(),e.moveTo(this.x,this.y),e.lineTo(g,m),e.stroke();const M=this.isLocal?"#66fcf1":"#ff3c3c",v=e.createRadialGradient(g,m,1,g,m,6);v.addColorStop(0,"#ffffff"),v.addColorStop(.3,M),v.addColorStop(1,"rgba(0, 0, 0, 0)"),e.fillStyle=v,e.beginPath(),e.arc(g,m,6,0,Math.PI*2),e.fill(),e.restore()}e.restore();const a=performance.now();this.dashTrails&&this.dashTrails.length>0&&this.dashTrails.forEach(_=>{const g=a-_.time,m=Math.max(0,.35*(1-g/180));if(m<=0)return;if(e.save(),e.globalAlpha=m,!mn.draw(e,this.id+"_trail",_.x,_.y,_.angle,0,!1)){e.save(),e.translate(_.x,_.y),e.rotate(_.angle);const v=os[this.colorTheme]||os[this.isLocal?"cyan":"red"];e.fillStyle=v.helmet||"#66fcf1",e.beginPath(),e.arc(0,0,this.radius,0,Math.PI*2),e.fill(),e.restore()}e.restore()});const r=Date.now(),o=this.adrenalineEndTime&&r<this.adrenalineEndTime||this.adrenalineActive,l=this.overdriveEndTime&&r<this.overdriveEndTime||this.overdriveActive;if(o||l){e.save(),e.shadowBlur=15,e.lineWidth=3,e.shadowColor=l?"#ffd700":"#39db14",e.strokeStyle=l?"rgba(255, 215, 0, 0.4)":"rgba(57, 219, 20, 0.4)";const _=this.radius+2+Math.sin(r/150)*2;e.beginPath(),e.arc(this.x,this.y,_,0,Math.PI*2),e.stroke(),e.restore()}const c=this.muzzleFlash>.1;if(!mn.draw(e,this.id,this.x,this.y,this.angle,this.currentSpeed||0,c,this.isLocal?"blue":"red")){e.save(),e.translate(this.x,this.y),e.rotate(this.angle);const _=os[this.colorTheme]||os[this.isLocal?"cyan":"red"],g=_.body,m=_.armor,M=_.helmet;let v=18,x=4;this.weaponKey==="rifle"&&(v=24,x=5),this.weaponKey==="shotgun"&&(v=22,x=6),this.weaponKey==="sniper"&&(v=32,x=4,e.fillStyle="#444",e.fillRect(8,-5,6,3)),this.weaponKey==="smg"&&(v=16,x=4),this.weaponKey==="lmg"&&(v=26,x=7,e.fillStyle="#222",e.fillRect(6,-8,6,16)),this.weaponKey==="dmr"&&(v=28,x=5,e.fillRect(10,-4,5,2)),this.weaponKey==="vector"&&(v=14,x=4,e.fillStyle="#333",e.fillRect(4,-6,5,12)),this.weaponKey==="famas"&&(v=20,x=5,e.fillStyle="#555",e.fillRect(6,-3,8,6)),this.weaponKey==="plasma"&&(e.fillStyle="#9b1fe8",v=20,x=5),this.weaponKey==="railgun"&&(e.fillStyle="#0d8a8a",v=30,x=6,e.fillStyle="#066",e.fillRect(6,-7,8,14)),e.fillStyle="#444",e.strokeStyle="#000",e.lineWidth=1,e.fillRect(10,-x/2,v,x),e.strokeRect(10,-x/2,v,x),e.fillStyle=m,e.strokeStyle="#000",e.lineWidth=1.5,e.beginPath(),e.arc(8,-10,5,0,Math.PI*2),e.fill(),e.stroke(),e.beginPath(),e.arc(14,6,5,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle=g,e.beginPath(),e.ellipse(0,0,this.radius,this.radius+3,0,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle=m,e.beginPath(),e.ellipse(-3,0,this.radius-4,this.radius-2,0,0,Math.PI*2),e.fill(),e.fillStyle=M,e.beginPath(),e.arc(-2,0,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#111",e.fillRect(1,-5,3,10),e.restore()}if(this.weaponKey!=="none"){e.save(),e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle=this.weaponKey==="knife"?"#b0b8c0":"#333",e.strokeStyle="rgba(0,0,0,0.7)",e.lineWidth=1;let _=18,g=3;if(this.weaponKey==="rifle"&&(_=26,g=4),this.weaponKey==="shotgun"&&(_=22,g=5),this.weaponKey==="sniper"&&(_=36,g=3),this.weaponKey==="smg"&&(_=16,g=3),this.weaponKey==="lmg"&&(_=28,g=5),this.weaponKey==="dmr"&&(_=30,g=4),this.weaponKey==="knife"&&(_=10,g=2),this.weaponKey==="vector"&&(_=14,g=3,e.fillStyle="#2a2a2a",e.fillRect(4,-5,4,10)),this.weaponKey==="famas"&&(_=20,g=4,e.fillStyle="#444",e.fillRect(5,-4,7,8)),this.weaponKey==="plasma"&&(e.fillStyle="#9b1fe8",_=20,g=5,e.fillStyle="#c455ff",e.fillRect(6,-4,6,8)),this.weaponKey==="railgun"&&(e.fillStyle="#0d8a8a",_=30,g=6,e.fillStyle="#0af",e.fillRect(4,-6,8,12)),e.fillRect(12,-g/2,_,g),e.strokeRect(12,-g/2,_,g),this.muzzleFlash>0){e.save(),e.translate(12+_,0);const m=e.createRadialGradient(0,0,2,0,0,16);m.addColorStop(0,"rgba(255, 255, 255, 1.0)"),m.addColorStop(.3,"rgba(255, 220, 0, 0.9)"),m.addColorStop(.7,"rgba(255, 80, 0, 0.5)"),m.addColorStop(1,"rgba(255, 0, 0, 0.0)"),e.fillStyle=m,e.beginPath(),e.arc(0,0,16,0,Math.PI*2),e.fill(),e.restore()}e.restore()}e.save(),e.textAlign="center";const f=this.isLocal?((u=os[this.colorTheme])==null?void 0:u.helmet)||"#66fcf1":this.isTeammate?"#39db14":"#ff3c3c";if(this.rank){const _=this.y-this.radius-28,g=`${this.rank.icon} ${this.rank.label}`;e.font="bold 8px Orbitron";const M=e.measureText(g).width+10,v=12;e.fillStyle="rgba(0,0,0,0.65)",e.beginPath(),e.roundRect(this.x-M/2,_-v/2,M,v,3),e.fill(),e.strokeStyle=this.rank.color,e.lineWidth=1,e.stroke(),e.fillStyle=this.rank.color,e.fillText(g,this.x,_+4)}e.fillStyle=f,e.font="10px Orbitron",e.fillText(this.name.toUpperCase(),this.x,this.y-this.radius-12);const d=window.gameEngine&&window.gameEngine.matchMode==="sabotage";if(this.health>0&&!d){e.fillStyle="rgba(0,0,0,0.5)",e.fillRect(this.x-20,this.y-this.radius-8,40,4);const _=this.isLocal?((p=os[this.colorTheme])==null?void 0:p.helmet)||"#66fcf1":this.isTeammate?"#39db14":"#ff3c3c";e.fillStyle=_,e.fillRect(this.x-20,this.y-this.radius-8,40*(this.health/this.maxHealth),4)}this.floatingText&&this.floatingText.timer>0&&(e.font="bold 9px Orbitron",e.fillStyle=this.floatingText.color||"#ffd700",e.shadowColor="#000000",e.shadowBlur=4,e.fillText(this.floatingText.text,this.x,this.y+this.floatingText.yOffset),this.floatingText.yOffset-=.4,this.floatingText.timer--),e.restore()}updateBuffsHUD(e){if(!this.isLocal||this.isBot)return;const t=document.getElementById("hud-active-buffs");if(!t)return;let i="";if(this.adrenalineActive){const n=Math.max(0,(this.adrenalineEndTime-e)/1e3).toFixed(1);i+=`<div style="font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; background: rgba(57, 219, 20, 0.15); border: 1px solid rgba(57, 219, 20, 0.4); color: #39db14; padding: 4px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 8px rgba(57, 219, 20, 0.2);">⚡ SPEED: ${n}s</div>`}if(this.overdriveActive){const n=Math.max(0,(this.overdriveEndTime-e)/1e3).toFixed(1);i+=`<div style="font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; background: rgba(255, 215, 0, 0.15); border: 1px solid rgba(255, 215, 0, 0.4); color: #ffd700; padding: 4px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);">🔥 OVERDRIVE: ${n}s</div>`}t.innerHTML=i}}class Ma{constructor(e){this.id=`${e.playerId}_bullet_${Date.now()}_${Math.floor(Math.random()*1e3)}`,this.playerId=e.playerId,this.x=e.x,this.y=e.y,this.prevX=e.x,this.prevY=e.y,this.angle=e.angle,this.speed=e.bulletSpeed,this.damage=e.damage,this.rangeRemaining=e.range,this.weaponKey=e.weaponKey;const n=(1-(window.gameEngine&&window.gameEngine.devCheatActive&&e.playerId===window.LocalPlayerId?1:e.accuracy))*(Math.random()-.5)*.5,a=this.angle+n;this.vx=Math.cos(a)*this.speed,this.vy=Math.sin(a)*this.speed,this.active=!0}update(e,t,i,n,a=1){if(!this.active)return;if(this.prevX=this.x,this.prevY=this.y,this.x+=this.vx*a,this.y+=this.vy*a,this.rangeRemaining-=this.speed*a,this.rangeRemaining<=0){this.active=!1;return}const r={x:this.prevX,y:this.prevY},o={x:this.x,y:this.y},l=e.getLineIntersection(r,o);if(l){if(this.x=l.x,this.y=l.y,this.active=!1,l.wall&&l.wall.type==="crate"){const c=l.wall.id,h=e.damageCrate(c,this.damage);h&&(h.broken?(n&&n.playCrateBreak(),i.spawnCrateSplinters(h.crateX,h.crateY),this.playerId===window.LocalPlayerId&&window.AppSocket&&window.AppSocket.emit("break-crate",{crateId:c,spawnedItem:h.item})):n&&n.playFleshHit())}i.spawnWallImpact(this.x,this.y,this.angle);return}for(const c of t){if(c.id===this.playerId||c.health<=0)continue;const h=t.find(d=>d.id===this.playerId);if(h&&h.team===c.team)continue;const f=this.getSegmentCircleIntersection(r,o,c);if(f){this.x=f.x,this.y=f.y,this.active=!1,i.spawnBloodSplatter(this.x,this.y,this.angle);const d=this.x-c.x,u=this.y-c.y,_=d*d+u*u<=36,g=_?1.5:1;if(window.IsOfflineMode){const m=e.checkZone?e.checkZone(this.x,this.y):null,M=m&&m.type==="damage"?m.multiplier:1,v=Math.round(this.damage*M*g),x=c.health>0;c.takeDamage(v,n);const y=x&&c.health<=0;if(this.playerId===window.LocalPlayerId){const E=t.find(A=>A.id===this.playerId);E&&E.addWeaponXP&&(y?(E.addWeaponXP(50),E.showTextNotification("+50 XP","#ffd700"),window.gameEngine&&window.gameEngine.registerLocalPlayerKill&&window.gameEngine.registerLocalPlayerKill(performance.now())):(E.addWeaponXP(10),E.showTextNotification("+10 XP","#ff6ef7"))),n&&(_?n.playCriticalHitMarker():n.playHitMarker()),_&&c.showTextNotification?c.showTextNotification("CRITICAL HEADSHOT!"):M>1&&c.showTextNotification&&c.showTextNotification(`×${M} ZONE!`),window.gameEngine&&window.gameEngine.triggerHitmarker(this.x,this.y,v,_),window.MatchStats&&(window.MatchStats.damageDealt+=v)}}else if(this.playerId===window.LocalPlayerId){const m=e.checkZone?e.checkZone(this.x,this.y):null,M=m&&m.type==="damage"?m.multiplier:1,v=Math.round(this.damage*M*g),x=c.health-v<=0,y=t.find(E=>E.id===this.playerId);y&&y.addWeaponXP&&(x?(y.addWeaponXP(50),y.showTextNotification("+50 XP","#ffd700"),window.gameEngine&&window.gameEngine.registerLocalPlayerKill&&window.gameEngine.registerLocalPlayerKill(performance.now())):(y.addWeaponXP(10),y.showTextNotification("+10 XP","#ff6ef7"))),n&&(_?n.playCriticalHitMarker():n.playHitMarker()),_&&c.showTextNotification?c.showTextNotification("CRITICAL HEADSHOT!"):M>1&&c.showTextNotification&&c.showTextNotification(`×${M} ZONE!`),window.gameEngine&&window.gameEngine.triggerHitmarker(this.x,this.y,v,_),window.MatchStats&&(window.MatchStats.damageDealt+=v),window.AppSocket&&window.AppSocket.emit("hit",{damage:v,shooterId:this.playerId,targetId:c.id,x:this.x,y:this.y,isHeadshot:_})}return}}}getSegmentCircleIntersection(e,t,i){const n=t.x-e.x,a=t.y-e.y,r=i.x-e.x,o=i.y-e.y,l=n*n+a*a;if(l===0)return null;let c=(r*n+o*a)/l;c=Math.max(0,Math.min(1,c));const h=e.x+c*n,f=e.y+c*a,d=i.x-h,u=i.y-f;return d*d+u*u<=i.radius*i.radius?{x:h,y:f}:null}draw(e){if(!this.active)return;const t=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode;if(this.weaponKey==="knife"){e.save(),e.lineWidth=3.5,e.lineCap="round",e.strokeStyle="rgba(230, 235, 255, 0.85)",t||(e.shadowColor="#66fcf1",e.shadowBlur=6),e.beginPath(),e.arc(this.x,this.y,18,this.angle-.6,this.angle+.6),e.stroke(),e.restore();return}if(this.weaponKey==="plasma"){e.save(),t||(e.shadowColor="#ff6ef7",e.shadowBlur=18);const a=e.createRadialGradient(this.x,this.y,1,this.x,this.y,7);a.addColorStop(0,"rgba(255, 200, 255, 1.0)"),a.addColorStop(.4,"rgba(230, 80, 255, 0.9)"),a.addColorStop(1,"rgba(120, 0, 180, 0.0)"),e.fillStyle=a,e.beginPath(),e.arc(this.x,this.y,7,0,Math.PI*2),e.fill(),e.restore();return}if(this.weaponKey==="railgun"){e.save(),t||(e.shadowColor="#66fcf1",e.shadowBlur=20),e.lineWidth=5,e.lineCap="round";const a=e.createLinearGradient(this.prevX,this.prevY,this.x,this.y);a.addColorStop(0,"rgba(102, 252, 241, 0.0)"),a.addColorStop(.3,"rgba(102, 252, 241, 0.7)"),a.addColorStop(1,"rgba(255, 255, 255, 1.0)"),e.strokeStyle=a,e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.lineWidth=2,e.strokeStyle="rgba(255,255,255,0.9)",e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.restore();return}e.save(),e.lineWidth=2.5,e.lineCap="round";const i=this.playerId===window.LocalPlayerId,n=e.createLinearGradient(this.prevX,this.prevY,this.x,this.y);i?(n.addColorStop(0,"rgba(102, 252, 241, 0.0)"),n.addColorStop(1,"rgba(102, 252, 241, 1.0)"),e.strokeStyle=n,t||(e.shadowColor="#66fcf1")):(n.addColorStop(0,"rgba(255, 60, 60, 0.0)"),n.addColorStop(1,"rgba(255, 60, 60, 1.0)"),e.strokeStyle=n,t||(e.shadowColor="#ff3c3c")),t||(e.shadowBlur=4),e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.restore()}}class jr{constructor(e){this.seed=e}next(){const e=Math.sin(this.seed++)*1e4;return e-Math.floor(e)}range(e,t){return e+this.next()*(t-e)}}function mh(s,e){let t=2166136261;const i=`${String(s)}:${e}`;for(let n=0;n<i.length;n++)t^=i.charCodeAt(n),t=Math.imul(t,16777619);return t>>>0||1}let ox=class{constructor(e,t,i,n="manor"){this.width=e,this.height=t,this.seed=i,this.roundIndex=-1,this.navigationRevision=0,this.gameplayRng=new jr(mh(i,"gameplay")),this.rng=this.gameplayRng,this.mapId=n,this.walls=[],this.items=[],this.zones=[],this.rooms=[],this.decorations=[],this.segments=[],this.ambientLights={},this.generateMap()}generateMap(e=null){const t=Number.isInteger(e)&&e>=0?e:this.roundIndex+1;this.roundIndex=t;const i=t===0?this.seed:mh(this.seed,`layout:${t}`);this.rng=new jr(i);try{this.walls=[],this.items=[],this.zones=[],this.rooms=[],this.decorations=[],this.mapId==="cyberlab"?this.generateCyberLabMap():this.mapId==="arena"?this.generateArenaMap():this.generateManorMap(),this.initTerminals(),this.rebuildSegments()}finally{this.rng=this.gameplayRng}}generateManorMap(){const r=this.width-40,o=this.height-40,l=480,c=960,h=460,f=920,d=l-40,u=c-l-22,p=r-c-22,_=h-40,g=f-h-22,m=o-f-22,M=[{x:40,y:40,w:d,h:_,name:"Kitchen",floor:"tiles"},{x:l+22,y:40,w:u,h:_,name:"Living Room",floor:"carpet"},{x:c+22,y:40,w:p,h:_,name:"Office",floor:"wood"},{x:40,y:h+22,w:d,h:g,name:"Bathroom",floor:"tiles"},{x:l+22,y:h+22,w:u,h:g,name:"Hallway",floor:"concrete"},{x:c+22,y:h+22,w:p,h:g,name:"Bedroom 1",floor:"carpet"},{x:40,y:f+22,w:d,h:m,name:"Garage",floor:"concrete"},{x:l+22,y:f+22,w:u,h:m,name:"Master Bedroom",floor:"carpet"},{x:c+22,y:f+22,w:p,h:m,name:"Bedroom 2",floor:"wood"}];this.rooms=M,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(l,40,22,_,"v",Math.round(_*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l,h+22,22,g,"v",Math.round(g*.35-88/2),88,"wall","interior"),this._addWallWithDoorway(l,f+22,22,m,"v",Math.round(m*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,40,22,_,"v",Math.round(_*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,h+22,22,g,"v",Math.round(g*.65-88/2),88,"wall","interior"),this._addWallWithDoorway(c,f+22,22,m,"v",Math.round(m*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,h,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,h,u,22,"h",Math.round(u*.35-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,h,p,22,"h",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,f,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,f,u,22,"h",Math.round(u*.65-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,f,p,22,"h",Math.round(p*.5-88/2),88,"wall","interior"),this._addFurniture(M),this._addDecorations(M);{const x=M[3];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.06,label:"MEDIC STATION"})}{const x=M[5];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.025,label:"REST ZONE"})}{const x=M[7];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.04,label:"RECOVERY ZONE"})}{const x=M[6];this.zones.push({x:x.x+60,y:x.y+60,w:x.w-120,h:x.h-120,type:"damage",multiplier:1.75,label:"EXPLOSIVE ZONE"})}{const x=M[1];this.zones.push({x:x.x+x.w/4,y:x.y+x.h/4,w:x.w/2,h:x.h/2,type:"damage",multiplier:1.4,label:"EXPOSED AREA"})}const v=["health","ammo","adrenaline","ammo","overdrive"];this._spawnRandomConsumables(v,"pickup"),this._spawnCrates(),this.ambientLights={brokenCeiling:{x:731,y:701,radius:240,on:!0,innerRadius:20,color:"rgba(200, 230, 255, 0.25)",colorMid:"rgba(200, 230, 255, 0.08)",pulseType:"none",fixtureType:"brokenCeiling"},lantern:{x:1171,y:250,radius:180,on:!0,innerRadius:5,color:"rgba(255, 140, 40, 0.22)",colorMid:"rgba(255, 140, 40, 0.10)",pulseType:"lantern",fixtureType:"lantern"},kitchen:{x:260,y:250,radius:200,on:!0,innerRadius:10,color:"rgba(102, 252, 241, 0.20)",colorMid:"rgba(102, 252, 241, 0.08)",pulseType:"none",fixtureType:"kitchen"},garage:{x:260,y:1150,radius:220,on:!0,innerRadius:10,color:"rgba(255, 60, 60, 0.22)",colorMid:"rgba(255, 60, 60, 0.09)",pulseType:"garage",fixtureType:"garage"},bedroom2:{x:1171,y:1150,radius:190,on:!0,innerRadius:10,color:"rgba(255, 110, 247, 0.20)",colorMid:"rgba(255, 110, 247, 0.08)",pulseType:"none",fixtureType:"bedroom2"}}}generateCyberLabMap(){const r=this.width-40,o=this.height-40,l=450,c=950,h=450,f=950,d=l-40,u=c-l-22,p=r-c-22,_=h-40,g=f-h-22,m=o-f-22,M=[{x:40,y:40,w:d,h:_,name:"Cyber Lounge",floor:"cybercarpet"},{x:l+22,y:40,w:u,h:_,name:"Quantum Lab",floor:"cybergrid"},{x:c+22,y:40,w:p,h:_,name:"Security Hub",floor:"nanogrid"},{x:40,y:h+22,w:d,h:g,name:"Server Room",floor:"cybergrid"},{x:l+22,y:h+22,w:u,h:g,name:"AI Core",floor:"cybergrid"},{x:c+22,y:h+22,w:p,h:g,name:"Cryo Chambers",floor:"nanogrid"},{x:40,y:f+22,w:d,h:m,name:"Weaponry Depot",floor:"concrete"},{x:l+22,y:f+22,w:u,h:m,name:"Reactor Matrix",floor:"reactor"},{x:c+22,y:f+22,w:p,h:m,name:"Matrix Hall",floor:"cybercarpet"}];this.rooms=M,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(l,40,22,_,"v",Math.round(_*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l,h+22,22,g,"v",Math.round(g*.45-88/2),88,"wall","interior"),this._addWallWithDoorway(l,f+22,22,m,"v",Math.round(m*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,40,22,_,"v",Math.round(_*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,h+22,22,g,"v",Math.round(g*.55-88/2),88,"wall","interior"),this._addWallWithDoorway(c,f+22,22,m,"v",Math.round(m*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,h,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,h,u,22,"h",Math.round(u*.45-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,h,p,22,"h",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,f,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,f,u,22,"h",Math.round(u*.55-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,f,p,22,"h",Math.round(p*.5-88/2),88,"wall","interior"),this._addCyberLabFurniture(M);{const x=M[1];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.05,label:"QUANTUM STABILIZER"})}{const x=M[5];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.035,label:"CRYO RECOVERY"})}{const x=M[7];this.zones.push({x:x.x+50,y:x.y+50,w:x.w-100,h:x.h-100,type:"damage",multiplier:2,label:"REACTOR ENERGY CORE"})}const v=["health","ammo","health","adrenaline","health","ammo","overdrive"];this._spawnRandomConsumables(v,"pickup_cyber"),this._spawnCrates(),this.ambientLights={aiCore:{x:700,y:700,radius:260,on:!0,innerRadius:20,color:"rgba(102, 252, 241, 0.28)",colorMid:"rgba(102, 252, 241, 0.12)",pulseType:"quantum",fixtureType:"reactor_light"},quantumLab:{x:700,y:250,radius:220,on:!0,innerRadius:10,color:"rgba(157, 59, 255, 0.26)",colorMid:"rgba(157, 59, 255, 0.10)",pulseType:"none",fixtureType:"quantum"},reactor:{x:700,y:1150,radius:240,on:!0,innerRadius:15,color:"rgba(255, 127, 59, 0.28)",colorMid:"rgba(255, 127, 59, 0.12)",pulseType:"garage",fixtureType:"reactor_light"},serverRoom:{x:250,y:700,radius:220,on:!0,innerRadius:10,color:"rgba(57, 219, 20, 0.24)",colorMid:"rgba(57, 219, 20, 0.09)",pulseType:"none",fixtureType:"server_rack_light"},cryo:{x:1150,y:700,radius:220,on:!0,innerRadius:10,color:"rgba(102, 252, 241, 0.24)",colorMid:"rgba(102, 252, 241, 0.09)",pulseType:"none",fixtureType:"cryo_light"}}}generateArenaMap(){const r=this.width-40,o=this.height-40,l=240,c=300,h=240,f=240,d=300,u=240,p=40+l,_=p+20+c,g=40+f,m=g+20+d,M=[{x:40,y:40,w:l,h:f,name:"Alpha Spawn",floor:"concrete"},{x:p+20,y:40,w:c,h:f,name:"North Gallery",floor:"wood"},{x:_+20,y:40,w:h,h:f,name:"Omega Spawn",floor:"concrete"},{x:40,y:g+20,w:l,h:d,name:"West Corridor",floor:"tiles"},{x:p+20,y:g+20,w:c,h:d,name:"Central Core",floor:"tiles"},{x:_+20,y:g+20,w:h,h:d,name:"East Corridor",floor:"tiles"},{x:40,y:m+20,w:l,h:u,name:"Supply Vault",floor:"carpet"},{x:p+20,y:m+20,w:c,h:u,name:"South Gallery",floor:"wood"},{x:_+20,y:m+20,w:h,h:u,name:"Server Annex",floor:"carpet"}];this.rooms=M,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(p,40,20,f,"v",Math.round(f*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(p,g+20,20,d,"v",Math.round(d*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(p,m+20,20,u,"v",Math.round(u*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(_,40,20,f,"v",Math.round(f*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(_,g+20,20,d,"v",Math.round(d*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(_,m+20,20,u,"v",Math.round(u*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(40,g,l,20,"h",Math.round(l*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(p+20,g,c,20,"h",Math.round(c*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(_+20,g,h,20,"h",Math.round(h*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(40,m,l,20,"h",Math.round(l*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(p+20,m,c,20,"h",Math.round(c*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(_+20,m,h,20,"h",Math.round(h*.5-80/2),80,"wall","interior");const v=M[4],x=E=>this._push({...E,type:"wall",material:"furniture"});x({x:v.x+40,y:v.y+40,w:40,h:40,label:"column"}),x({x:v.x+v.w-80,y:v.y+40,w:40,h:40,label:"column"}),x({x:v.x+40,y:v.y+v.h-80,w:40,h:40,label:"column"}),x({x:v.x+v.w-80,y:v.y+v.h-80,w:40,h:40,label:"column"}),this.zones.push({x:v.x+90,y:v.y+90,w:v.w-180,h:v.h-180,type:"healing",healRate:.05,label:"NANO MEDIC STATION"});const y=["health","ammo","adrenaline","overdrive"];this._spawnRandomConsumables(y,"pickup_arena"),this._spawnCrates(),this.ambientLights={centerSiren:{x:450,y:450,radius:180,on:!0,innerRadius:15,color:"rgba(102, 252, 241, 0.25)",colorMid:"rgba(102, 252, 241, 0.09)",pulseType:"quantum",fixtureType:"reactor_light"},alphaLight:{x:150,y:150,radius:150,on:!0,innerRadius:10,color:"rgba(255, 110, 247, 0.20)",colorMid:"rgba(255, 110, 247, 0.08)",pulseType:"none",fixtureType:"quantum"},omegaLight:{x:750,y:750,radius:150,on:!0,innerRadius:10,color:"rgba(255, 127, 59, 0.20)",colorMid:"rgba(255, 127, 59, 0.08)",pulseType:"none",fixtureType:"quantum"}}}_addCyberLabFurniture(e){const t=d=>this._push({...d,type:"wall",material:"furniture"}),i=e[0];t({x:i.x+50,y:i.y+50,w:90,h:32,label:"cyber_couch"}),t({x:i.x+50,y:i.y+120,w:90,h:32,label:"cyber_couch"}),t({x:i.x+i.w-82,y:i.y+50,w:32,h:100,label:"cyber_couch"}),t({x:i.x+i.w-150,y:i.y+80,w:45,h:45,label:"table"}),t({x:i.x+20,y:i.y+i.h-60,w:24,h:24,label:"plant"}),t({x:i.x+i.w-50,y:i.y+i.h-60,w:24,h:24,label:"plant"});const n=e[1];t({x:n.x+30,y:n.y+30,w:35,h:35,label:"containment_pod"}),t({x:n.x+n.w-65,y:n.y+30,w:35,h:35,label:"containment_pod"}),t({x:n.x+n.w/2-40,y:n.y+n.h-40,w:80,h:28,label:"cyber_console"}),t({x:n.x+30,y:n.y+n.h-100,w:35,h:35,label:"nano_charger"});const a=e[2];t({x:a.x+20,y:a.y+20,w:25,h:180,label:"shelf"}),t({x:a.x+70,y:a.y+60,w:100,h:40,label:"desk"}),t({x:a.x+105,y:a.y+110,w:30,h:30,label:"chair"});const r=e[3];t({x:r.x+40,y:r.y+30,w:24,h:100,label:"server_rack"}),t({x:r.x+110,y:r.y+30,w:24,h:100,label:"server_rack"}),t({x:r.x+40,y:r.y+190,w:24,h:100,label:"server_rack"}),t({x:r.x+110,y:r.y+190,w:24,h:100,label:"server_rack"}),t({x:r.x+r.w-50,y:r.y+r.h/2-30,w:32,h:60,label:"cyber_console"});const o=e[4];t({x:o.x+o.w/2-40,y:o.y+o.h/2-40,w:80,h:80,label:"reactor_core"}),t({x:o.x+40,y:o.y+o.h/2-15,w:45,h:30,label:"cyber_console"}),t({x:o.x+o.w-85,y:o.y+o.h/2-15,w:45,h:30,label:"cyber_console"}),t({x:o.x+o.w/2-22,y:o.y+40,w:44,h:28,label:"cyber_console"}),t({x:o.x+o.w/2-22,y:o.y+o.h-68,w:44,h:28,label:"cyber_console"});const l=e[5];t({x:l.x+30,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+85,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+140,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+l.w-50,y:l.y+l.h-100,w:32,h:65,label:"cyber_console"});const c=e[6];t({x:c.x+30,y:c.y+30,w:120,h:45,label:"desk"}),t({x:c.x+30,y:c.y+110,w:35,h:80,label:"cabinet"}),t({x:c.x+c.w-60,y:c.y+30,w:40,h:100,label:"shelf"});const h=e[7];t({x:h.x+h.w/2-30,y:h.y+h.h/2-30,w:60,h:60,label:"reactor_core"}),t({x:h.x+30,y:h.y+30,w:24,h:24,label:"plant"}),t({x:h.x+h.w-54,y:h.y+30,w:24,h:24,label:"plant"});const f=e[8];t({x:f.x+f.w/2-25,y:f.y+40,w:50,h:50,label:"table"}),t({x:f.x+50,y:f.y+f.h-70,w:80,h:32,label:"cyber_couch"}),t({x:f.x+f.w-130,y:f.y+f.h-70,w:80,h:32,label:"cyber_couch"})}_push(e){this.walls.push(e)}_addWallWithDoorway(e,t,i,n,a,r,o,l,c){if(a==="v"){const h=n,f=Math.max(12,Math.min(h-o-12,r)),d=f+o;f>0&&this._push({x:e,y:t,w:i,h:f,type:l,material:c}),d<h&&this._push({x:e,y:t+d,w:i,h:h-d,type:l,material:c})}else{const h=i,f=Math.max(12,Math.min(h-o-12,r)),d=f+o;f>0&&this._push({x:e,y:t,w:f,h:n,type:l,material:c}),d<h&&this._push({x:e+d,y:t,w:h-d,h:n,type:l,material:c})}}_addFurniture(e){const t=u=>this._push({...u,type:"wall",material:"furniture"}),i=u=>this._push({...u,type:"crate",health:40,maxHealth:40,material:"barrel"}),n=e[0];t({x:n.x+12,y:n.y+12,w:n.w-24,h:28,label:"counter"}),t({x:n.x+12,y:n.y+40,w:28,h:n.h/2-10,label:"counter"}),t({x:n.x+80,y:n.y+n.h-110,w:110,h:60,label:"table"}),t({x:n.x+80+42,y:n.y+n.h-138,w:26,h:26,label:"chair"}),t({x:n.x+80+42,y:n.y+n.h-48,w:26,h:26,label:"chair"}),t({x:n.x+18,y:n.y+n.h-50,w:24,h:24,label:"plant"}),t({x:n.x+n.w-60,y:n.y+12,w:40,h:80,label:"fridge"});const a=e[1];t({x:a.x+55,y:a.y+55,w:190,h:42,label:"sofa"}),t({x:a.x+55,y:a.y+97,w:42,h:90,label:"sofa"}),t({x:a.x+18,y:a.y+110,w:38,h:42,label:"sofa"}),t({x:a.x+a.w/2-55,y:a.y+130,w:110,h:55,label:"table"}),t({x:a.x+a.w-55,y:a.y+65,w:30,h:120,label:"tv"}),t({x:a.x+a.w-55,y:a.y+a.h-100,w:30,h:80,label:"shelf"}),t({x:a.x+a.w-50,y:a.y+18,w:24,h:24,label:"plant"});const r=e[2];t({x:r.x+18,y:r.y+18,w:140,h:52,label:"desk"}),t({x:r.x+18+55,y:r.y+18+56,w:30,h:30,label:"chair"}),t({x:r.x+r.w-38,y:r.y+12,w:22,h:210,label:"shelf"}),t({x:r.x+18,y:r.y+r.h-60,w:80,h:40,label:"cabinet"}),t({x:r.x+r.w-50,y:r.y+r.h-50,w:24,h:24,label:"plant"});const o=e[3];t({x:o.x+12,y:o.y+12,w:90,h:130,label:"tub"}),t({x:o.x+12,y:o.y+o.h-58,w:65,h:38,label:"sink"}),t({x:o.x+o.w-50,y:o.y+12,w:35,h:55,label:"cabinet"}),t({x:o.x+o.w-45,y:o.y+o.h-60,w:28,h:38,label:"toilet"});const l=e[4];t({x:l.x+l.w/2-80,y:l.y+l.h/2-45,w:160,h:90,label:"table"}),t({x:l.x+l.w/2-60,y:l.y+l.h/2-80,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2+30,y:l.y+l.h/2-80,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2-60,y:l.y+l.h/2+90,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2+30,y:l.y+l.h/2+90,w:26,h:26,label:"chair"});const c=e[5];t({x:c.x+12,y:c.y+20,w:115,h:80,label:"bed"}),t({x:c.x+12+120,y:c.y+20,w:32,h:32,label:"dresser"}),t({x:c.x+c.w-52,y:c.y+12,w:36,h:55,label:"dresser"}),t({x:c.x+c.w-52,y:c.y+80,w:36,h:55,label:"cabinet"}),t({x:c.x+12,y:c.y+c.h-90,w:80,h:40,label:"desk"}),t({x:c.x+12+27,y:c.y+c.h-46,w:26,h:26,label:"chair"});const h=e[6];t({x:h.x+40,y:h.y+75,w:210,h:130,label:"car"}),t({x:h.x+12,y:h.y+h.h-48,w:160,h:30,label:"bench"}),i({x:h.x+h.w-65,y:h.y+45,w:38,h:38,id:"barrel_0"}),i({x:h.x+h.w-65,y:h.y+93,w:38,h:38,id:"barrel_1"}),i({x:h.x+h.w-65,y:h.y+141,w:38,h:38,id:"barrel_2"});const f=e[7];t({x:f.x+f.w/2-90,y:f.y+18,w:180,h:110,label:"bed"}),t({x:f.x+f.w/2-130,y:f.y+18,w:32,h:32,label:"dresser"}),t({x:f.x+f.w/2+100,y:f.y+18,w:32,h:32,label:"dresser"}),t({x:f.x+12,y:f.y+12,w:45,h:65,label:"dresser"}),t({x:f.x+f.w-60,y:f.y+12,w:45,h:65,label:"dresser"}),t({x:f.x+18,y:f.y+f.h-50,w:24,h:24,label:"plant"});const d=e[8];t({x:d.x+12,y:d.y+20,w:130,h:90,label:"bed"}),t({x:d.x+12+135,y:d.y+20,w:32,h:32,label:"dresser"}),t({x:d.x+d.w-55,y:d.y+12,w:38,h:110,label:"shelf"}),t({x:d.x+d.w-110,y:d.y+d.h-60,w:90,h:40,label:"desk"}),t({x:d.x+d.w-78,y:d.y+d.h-95,w:26,h:26,label:"chair"}),t({x:d.x+12,y:d.y+d.h-55,w:80,h:38,label:"cabinet"})}_spawnCrates(){let i=0,n=0;for(;i<14&&n<400;){n++;const a=this.rng.range(60,this.width-100),r=this.rng.range(60,this.height-100);if(a<250&&r<250||a>this.width-250&&r>this.height-250||a<250&&r>this.height-250||a>this.width-250&&r<250)continue;let o=!1;const l=14;for(const c of this.walls)if(a+44+l>c.x&&a-l<c.x+c.w&&r+44+l>c.y&&r-l<c.y+c.h){o=!0;break}o||(this._push({x:a,y:r,w:44,h:44,type:"crate",health:50,maxHealth:50,id:`crate_${i}`,material:"crate"}),i++)}}_spawnRandomConsumables(e,t){e.forEach((n,a)=>{let r=!1,o=0;for(;!r&&o<150;){o++;const l=Math.floor(this.rng.next()*this.rooms.length),c=this.rooms[l],h=40,f=this.rng.range(c.x+h,c.x+c.w-h),d=this.rng.range(c.y+h,c.y+c.h-h);let u=!1;for(const p of this.walls)if(f+30>p.x&&f-30<p.x+p.w&&d+30>p.y&&d-30<p.y+p.h){u=!0;break}f<250&&d<250&&(u=!0),f>this.width-250&&d>this.height-250&&(u=!0),f<250&&d>this.height-250&&(u=!0),f>this.width-250&&d<250&&(u=!0),u||(this.items.push({id:`${t}_${a}`,x:f,y:d,type:n,active:!0}),r=!0)}if(!r){const l=Math.floor(this.rng.next()*this.rooms.length),c=this.rooms[l];this.items.push({id:`${t}_${a}`,x:c.x+c.w/2,y:c.y+c.h/2,type:n,active:!0})}})}checkZone(e,t){for(const i of this.zones)if(e>=i.x&&e<=i.x+i.w&&t>=i.y&&t<=i.y+i.h)return i;return null}rebuildSegments(){this.segments=[],this.walls.forEach(e=>{this.segments.push({p1:{x:e.x,y:e.y},p2:{x:e.x+e.w,y:e.y},wall:e}),this.segments.push({p1:{x:e.x+e.w,y:e.y},p2:{x:e.x+e.w,y:e.y+e.h},wall:e}),this.segments.push({p1:{x:e.x+e.w,y:e.y+e.h},p2:{x:e.x,y:e.y+e.h},wall:e}),this.segments.push({p1:{x:e.x,y:e.y+e.h},p2:{x:e.x,y:e.y},wall:e})}),this.navigationRevision=(Number(this.navigationRevision)||0)+1}checkCircleCollision(e,t,i){const n=this._depenetrateCircle(e,t,i);return{x:n.x,y:n.y}}moveCircle(e,t,i,n,a){const r=Math.max(.01,Number(a)||.01),o=this._depenetrateCircle(e,t,r);let l=o.x,c=o.y,h=o.collided,f=o.normalX,d=o.normalY;const u=Number.isFinite(Number(i))?Number(i):0,p=Number.isFinite(Number(n))?Number(n):0,_=Math.hypot(u,p),g=Math.max(2,Math.min(8,r*.45)),m=Math.max(1,Math.ceil(_/g)),M=u/m,v=p/m;for(let y=0;y<m;y++){if(M!==0){const E=l+M,A=this._depenetrateCircle(E,c,r);(Math.abs(A.x-E)>1e-6||Math.abs(A.y-c)>1e-6)&&(h=!0,f+=A.normalX,d+=A.normalY),l=A.x,c=A.y}if(v!==0){const E=c+v,A=this._depenetrateCircle(l,E,r);(Math.abs(A.x-l)>1e-6||Math.abs(A.y-E)>1e-6)&&(h=!0,f+=A.normalX,d+=A.normalY),l=A.x,c=A.y}}const x=Math.hypot(f,d);return{x:l,y:c,collided:h,normalX:x>1e-6?f/x:0,normalY:x>1e-6?d/x:0}}_depenetrateCircle(e,t,i){const n=Math.max(.01,Number(i)||.01);let a=Number.isFinite(Number(e))?Number(e):n,r=Number.isFinite(Number(t))?Number(t):n,o=!1,l=0,c=0;a=Math.max(n,Math.min(this.width-n,a)),r=Math.max(n,Math.min(this.height-n,r));const h=a,f=r;for(let d=0;d<16;d++){let u=!1;for(const p of this.walls){const _=Math.max(p.x,Math.min(a,p.x+p.w)),g=Math.max(p.y,Math.min(r,p.y+p.h)),m=a-_,M=r-g,v=m*m+M*M;if(!(v>=n*n-1e-9)){if(o=!0,u=!0,v>1e-12){const x=Math.sqrt(v),y=n-x+1e-6,E=m/x,A=M/x;a+=E*y,r+=A*y,l+=E,c+=A}else{const x=[{amount:p.x-n-a,nx:-1,ny:0,targetX:p.x-n,targetY:r},{amount:p.x+p.w+n-a,nx:1,ny:0,targetX:p.x+p.w+n,targetY:r},{amount:p.y-n-r,nx:0,ny:-1,targetX:a,targetY:p.y-n},{amount:p.y+p.h+n-r,nx:0,ny:1,targetX:a,targetY:p.y+p.h+n}],y=x.filter(S=>S.targetX>=n-1e-6&&S.targetX<=this.width-n+1e-6&&S.targetY>=n-1e-6&&S.targetY<=this.height-n+1e-6),E=y.length>0?y:x;E.sort((S,w)=>Math.abs(S.amount)-Math.abs(w.amount));const A=E[0];A.nx!==0?a=A.targetX+A.nx*1e-6:r=A.targetY+A.ny*1e-6,l+=A.nx,c+=A.ny}a=Math.max(n,Math.min(this.width-n,a)),r=Math.max(n,Math.min(this.height-n,r))}}if(!u)break}if(!this._circlePositionClear(a,r,n)){const d=this._nearestClearCirclePosition(h,f,n);if(d){const u=d.x-h,p=d.y-f,_=Math.hypot(u,p);a=d.x,r=d.y,o=!0,_>1e-6&&(l+=u/_,c+=p/_)}}return{x:a,y:r,collided:o,normalX:l,normalY:c}}_circlePositionClear(e,t,i){if(e<i||t<i||e>this.width-i||t>this.height-i)return!1;for(const n of this.walls){const a=Math.max(n.x,Math.min(e,n.x+n.w)),r=Math.max(n.y,Math.min(t,n.y+n.h)),o=e-a,l=t-r;if(o*o+l*l<i*i-1e-9)return!1}return!0}_nearestClearCirclePosition(e,t,i){if(this._circlePositionClear(e,t,i))return{x:e,y:t};const n=Math.max(4,Math.min(8,i*.35)),a=Math.max(192,i*12);for(let r=n;r<=a;r+=n){const o=Math.max(16,Math.ceil(Math.PI*2*r/n));for(let l=0;l<o;l++){const c=l/o*Math.PI*2,h=Math.max(i,Math.min(this.width-i,e+Math.cos(c)*r)),f=Math.max(i,Math.min(this.height-i,t+Math.sin(c)*r));if(this._circlePositionClear(h,f,i))return{x:h,y:f}}}return null}getLineIntersection(e,t){let i=null;for(const n of this.segments){const a=this.getLineSegmentIntersection(e,t,n.p1,n.p2);if(a){const r=a.x-e.x,o=a.y-e.y,l=Math.sqrt(r*r+o*o);(!i||l<i.dist)&&(i={x:a.x,y:a.y,dist:l,wall:n.wall})}}return i}getLineSegmentIntersection(e,t,i,n){const a=t.x-e.x,r=t.y-e.y,o=n.x-i.x,l=n.y-i.y,c=-o*r+a*l;if(Math.abs(c)<1e-9)return null;const h=(-r*(e.x-i.x)+a*(e.y-i.y))/c,f=(o*(e.y-i.y)-l*(e.x-i.x))/c;return h>=0&&h<=1&&f>=0&&f<=1?{x:e.x+f*a,y:e.y+f*r}:null}damageCrate(e,t){const i=this.walls.findIndex(a=>a.id===e);if(i===-1)return null;const n=this.walls[i];if(n.health-=t,n.health<=0){this.walls.splice(i,1),this.rebuildSegments();let a=null;if(this.rng.next()<.5){const r=this.rng.next();let o="health";r<.4?o="health":r<.7?o="ammo":r<.85?o="adrenaline":o="overdrive",a={id:`item_${e}_${Date.now()}`,x:n.x+n.w/2,y:n.y+n.h/2,type:o,active:!0},this.items.push(a)}return{broken:!0,item:a,crateX:n.x+n.w/2,crateY:n.y+n.h/2}}return{broken:!1,health:n.health}}syncBreakCrate(e,t){const i=this.walls.findIndex(n=>n.id===e);i!==-1&&(this.walls.splice(i,1),this.rebuildSegments()),t&&!this.items.some(n=>n.id===t.id)&&this.items.push(t)}computeVisibilityPolygon(e,t,i,n=null,a=null){const r=new Set,o=f=>{let d=f;for(;d<-Math.PI;)d+=Math.PI*2;for(;d>Math.PI;)d-=Math.PI*2;return d},l=f=>{if(n===null||a===null)return!0;let d=f-n;for(;d<-Math.PI;)d+=Math.PI*2;for(;d>Math.PI;)d-=Math.PI*2;return Math.abs(d)<=a/2};if(this.walls.forEach(f=>{[{x:f.x,y:f.y},{x:f.x+f.w,y:f.y},{x:f.x+f.w,y:f.y+f.h},{x:f.x,y:f.y+f.h}].forEach(d=>{const u=Math.atan2(d.y-t,d.x-e);l(u)&&(r.add(o(u-1e-4)),r.add(u),r.add(o(u+1e-4)))})}),n!==null&&a!==null){const f=n-a/2,d=n+a/2;r.add(o(f)),r.add(o(d));for(let u=f;u<d;u+=Math.PI/18)r.add(o(u))}else for(let f=-Math.PI;f<Math.PI;f+=Math.PI/10)r.add(f);const c=[];r.forEach(f=>{const d={x:e+Math.cos(f)*i,y:t+Math.sin(f)*i},u=this.getLineIntersection({x:e,y:t},d);c.push(u&&u.dist<i?{x:u.x,y:u.y,angle:f}:{...d,angle:f})});const h=n!==null?n:0;return c.sort((f,d)=>{let u=f.angle-h;for(;u<-Math.PI;)u+=Math.PI*2;for(;u>Math.PI;)u-=Math.PI*2;let p=d.angle-h;for(;p<-Math.PI;)p+=Math.PI*2;for(;p>Math.PI;)p-=Math.PI*2;return u-p}),n!==null&&a!==null&&(c.unshift({x:e,y:t,angle:-999}),c.push({x:e,y:t,angle:999})),c}draw(e,t={shadows:!0},i=[],n=null,a=[]){this.rooms.forEach(l=>this._drawFloor(e,l)),this.decorations.forEach(l=>this._drawDecoration(e,l)),this.zones.forEach(l=>this._drawZone(e,l)),this.items.forEach(l=>{l.active&&this._drawItem(e,l)}),e.save();let r=this.width/2,o=this.height/2;if(n&&(r=n.x,o=n.y),this.walls.forEach(l=>this._drawWall(e,l,r,o)),e.restore(),this.terminals&&this.terminals.forEach(l=>{l.active&&this._drawTerminal(e,l)}),t.shadows&&i&&i.length>0){this.maskCanvas||(this.maskCanvas=document.createElement("canvas"),this.maskCtx=this.maskCanvas.getContext("2d"));const l=e.canvas.width,c=e.canvas.height;(this.maskCanvas.width!==l||this.maskCanvas.height!==c)&&(this.maskCanvas.width=l,this.maskCanvas.height=c),this.maskCtx.fillStyle="rgba(3, 4, 6, 0.995)",this.maskCtx.fillRect(0,0,l,c),this.maskCtx.save(),this.maskCtx.setTransform(e.getTransform());const h=Date.now(),d=Math.sin(h*.04)*Math.cos(h*.007)+Math.sin(h*.1)*.5>-.45;this.ambientLights.brokenCeiling&&(this.ambientLights.brokenCeiling.on=d),this.maskCtx.globalCompositeOperation="destination-out",this.maskCtx.fillStyle="white";for(const[u,p]of Object.entries(this.ambientLights)){if(!p.on)continue;const _=p.pulseType==="garage"?1+Math.sin(h/300)*.05:p.pulseType==="lantern"?1+Math.sin(h/200)*.04:p.pulseType==="quantum"?1+Math.sin(h/150)*.03:1,g=p.radius*_,m=this.maskCtx.createRadialGradient(p.x,p.y,p.innerRadius||10,p.x,p.y,g);m.addColorStop(0,"rgba(255, 255, 255, 1.0)"),m.addColorStop(.5,"rgba(255, 255, 255, 0.45)"),m.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=m,this.maskCtx.beginPath(),this.maskCtx.arc(p.x,p.y,g,0,Math.PI*2),this.maskCtx.fill()}i.forEach(u=>{if(!(u.health<=0)){if(u.flashlightActive&&u.lightPoly&&u.lightPoly.length>0){this.maskCtx.beginPath(),this.maskCtx.moveTo(u.lightPoly[0].x,u.lightPoly[0].y);for(let p=1;p<u.lightPoly.length;p++)this.maskCtx.lineTo(u.lightPoly[p].x,u.lightPoly[p].y);this.maskCtx.closePath(),this.maskCtx.fillStyle="white",this.maskCtx.fill()}if(window.gameEngine&&window.gameEngine.matchMode==="sabotage"&&u.isLocal){const p=this.maskCtx.createRadialGradient(u.x,u.y,10,u.x,u.y,150);p.addColorStop(0,"rgba(255, 255, 255, 1.0)"),p.addColorStop(.7,"rgba(255, 255, 255, 0.45)"),p.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=p,this.maskCtx.beginPath(),this.maskCtx.arc(u.x,u.y,150,0,Math.PI*2),this.maskCtx.fill()}}}),a&&a.length>0&&a.forEach(u=>{if(!u.active)return;const p=this.maskCtx.createRadialGradient(u.x,u.y,5,u.x,u.y,60);p.addColorStop(0,"rgba(255, 255, 255, 1.0)"),p.addColorStop(.5,"rgba(255, 255, 255, 0.45)"),p.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=p,this.maskCtx.beginPath(),this.maskCtx.arc(u.x,u.y,60,0,Math.PI*2),this.maskCtx.fill()}),i.forEach(u=>{if(u.health>0&&u.muzzleFlash>.15){const p=u.x+Math.cos(u.angle)*28,_=u.y+Math.sin(u.angle)*28,g=this.maskCtx.createRadialGradient(p,_,10,p,_,180*u.muzzleFlash);g.addColorStop(0,"rgba(255, 255, 255, 1.0)"),g.addColorStop(.4,"rgba(255, 255, 255, 0.5)"),g.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=g,this.maskCtx.beginPath(),this.maskCtx.arc(p,_,180*u.muzzleFlash,0,Math.PI*2),this.maskCtx.fill()}}),this.maskCtx.restore(),e.save(),e.setTransform(1,0,0,1,0,0),e.drawImage(this.maskCanvas,0,0),e.restore(),i.forEach(u=>{if(u.health>0&&u.flashlightActive&&u.lightPoly&&u.lightPoly.length>0){e.save(),e.beginPath(),e.moveTo(u.lightPoly[0].x,u.lightPoly[0].y);for(let y=1;y<u.lightPoly.length;y++)e.lineTo(u.lightPoly[y].x,u.lightPoly[y].y);e.closePath(),e.clip();const p=u.x,_=u.y,g=700,m=p+Math.cos(u.angle)*g,M=_+Math.sin(u.angle)*g,v=e.createLinearGradient(p,_,m,M);v.addColorStop(0,"rgba(255, 255, 230, 0.18)"),v.addColorStop(.35,"rgba(255, 255, 245, 0.10)"),v.addColorStop(1,"rgba(255, 255, 255, 0.0)"),e.fillStyle=v,e.fill();const x=e.createRadialGradient(p,_,10,p,_,100);x.addColorStop(0,"rgba(255, 255, 220, 0.08)"),x.addColorStop(1,"rgba(255, 255, 220, 0.0)"),e.fillStyle=x,e.fill(),e.restore()}}),e.save();for(const[u,p]of Object.entries(this.ambientLights)){if(!p.on)continue;const _=p.pulseType==="garage"?1+Math.sin(h/300)*.05:p.pulseType==="lantern"?1+Math.sin(h/200)*.04:p.pulseType==="quantum"?1+Math.sin(h/150)*.03:1,g=p.radius*_,m=e.createRadialGradient(p.x,p.y,p.innerRadius||5,p.x,p.y,g);m.addColorStop(0,p.color),m.addColorStop(.5,p.colorMid),m.addColorStop(1,"rgba(0, 0, 0, 0.0)"),e.fillStyle=m,e.beginPath(),e.arc(p.x,p.y,g,0,Math.PI*2),e.fill(),this._drawLightFixture(e,p,h)}e.restore()}}_drawLightFixture(e,t,i){const n=t.fixtureType;if(e.save(),n==="lantern")e.fillStyle="#222",e.strokeStyle="#d4af37",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="rgba(255, 180, 50, 0.9)",e.beginPath(),e.arc(t.x,t.y,3,0,Math.PI*2),e.fill();else if(n==="brokenCeiling")e.fillStyle="#333",e.strokeStyle="#555",e.lineWidth=1,e.fillRect(t.x-16,t.y-4,32,8),e.strokeRect(t.x-16,t.y-4,32,8),e.fillStyle=t.on?"#fff":"#111",e.shadowColor=t.on?"#6cf":"transparent",e.shadowBlur=t.on?10:0,e.fillRect(t.x-12,t.y-2,24,4),e.shadowBlur=0;else if(n==="kitchen")e.fillStyle="#333",e.strokeStyle="#555",e.lineWidth=1,e.fillRect(t.x-12,t.y-12,24,24),e.strokeRect(t.x-12,t.y-12,24,24),e.fillStyle="#66fcf1",e.beginPath(),e.arc(t.x,t.y,5,0,Math.PI*2),e.fill();else if(n==="garage")e.fillStyle="#222",e.strokeStyle="#ff3c3c",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ff3c3c",e.beginPath(),e.arc(t.x,t.y,3.5,0,Math.PI*2),e.fill();else if(n==="bedroom2")e.fillStyle="#2d1822",e.strokeStyle="#ff6ef7",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,9,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ff6ef7",e.beginPath(),e.arc(t.x,t.y,4,0,Math.PI*2),e.fill();else if(n==="quantum"){e.fillStyle="#100c1e",e.strokeStyle="#9d3bff",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,10,0,Math.PI*2),e.fill(),e.stroke();const a=i/100%(Math.PI*2);e.strokeStyle="#d473ff",e.lineWidth=1,e.beginPath(),e.moveTo(t.x-Math.cos(a)*8,t.y-Math.sin(a)*8),e.lineTo(t.x+Math.cos(a)*8,t.y+Math.sin(a)*8),e.stroke()}else n==="reactor_light"?(e.fillStyle="#201005",e.strokeStyle="#ff7f3b",e.lineWidth=2,e.beginPath(),e.arc(t.x,t.y,12,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x,t.y,6+Math.sin(i/200)*1.5,0,Math.PI*2),e.fill()):(n==="server_rack_light"||n==="cryo_light")&&(e.fillStyle="#111",e.strokeStyle=n==="cryo_light"?"#66fcf1":"#39db14",e.lineWidth=1.5,e.fillRect(t.x-6,t.y-6,12,12),e.strokeRect(t.x-6,t.y-6,12,12),e.fillStyle=n==="cryo_light"?"#66fcf1":"#39db14",e.beginPath(),e.arc(t.x,t.y,3,0,Math.PI*2),e.fill());e.restore()}isPointInAmbientLight(e,t,i=0){for(const[n,a]of Object.entries(this.ambientLights)){if(!a.on)continue;if(Math.hypot(e-a.x,t-a.y)<a.radius+i&&!this.getLineIntersection({x:a.x,y:a.y},{x:e,y:t}))return!0}return!1}_addDecorations(e){this.decorations=[];const t=e[0];this.decorations.push({x:t.x+50,y:t.y+55,w:120,h:40,type:"rug",style:"kitchen"});const i=e[1];this.decorations.push({x:i.x+i.w/2-120,y:i.y+110,w:240,h:160,type:"rug",style:"living"});const n=e[2];this.decorations.push({x:n.x+40,y:n.y+80,w:160,h:120,type:"rug",style:"office"});const a=e[3];this.decorations.push({x:a.x+110,y:a.y+40,w:60,h:90,type:"rug",style:"bath"});const r=e[4];this.decorations.push({x:r.x+r.w/2-180,y:r.y+40,w:360,h:60,type:"rug",style:"runner"});const o=e[5];this.decorations.push({x:o.x+30,y:o.y+110,w:140,h:160,type:"rug",style:"bedroom"});const l=e[7];this.decorations.push({x:l.x+l.w/2-120,y:l.y+80,w:240,h:220,type:"rug",style:"master"});const c=e[8];this.decorations.push({x:c.x+c.w/2-70,y:c.y+c.h/2-70,w:140,h:140,type:"rug",style:"circular"})}_drawDecoration(e,t){if(e.save(),t.type==="rug"){e.fillStyle="rgba(0,0,0,0.15)",e.fillRect(t.x+2,t.y+2,t.w,t.h);const n={kitchen:{bg:"#3a2d1f",border:"#aa8c66",text:"#55422d"},living:{bg:"#3b1c1c",border:"#d4af37",text:"#802020"},office:{bg:"#1c2d3b",border:"#66fcf1",text:"#204060"},bath:{bg:"#1f3c3a",border:"#39db14",text:"#152b2a"},runner:{bg:"#2b203c",border:"#9d3bff",text:"#4c2e73"},bedroom:{bg:"#3c3020",border:"#ffe6a3",text:"#5c4930"},master:{bg:"#222d32",border:"#66fcf1",text:"#435e6a"},circular:{bg:"#2d1822",border:"#ff6ef7",text:"#5e2540"}}[t.style]||{bg:"#222",border:"#444",text:"#333"};if(e.fillStyle=n.bg,e.strokeStyle=n.border,e.lineWidth=2,t.style==="circular")e.beginPath(),e.arc(t.x+t.w/2,t.y+t.h/2,t.w/2,0,Math.PI*2),e.fill(),e.stroke(),e.strokeStyle=n.text,e.lineWidth=1.5,e.beginPath(),e.arc(t.x+t.w/2,t.y+t.h/2,t.w/3,0,Math.PI*2),e.stroke();else{if(e.beginPath(),e.roundRect?e.roundRect(t.x,t.y,t.w,t.h,6):e.rect(t.x,t.y,t.w,t.h),e.fill(),e.stroke(),e.strokeStyle=n.border,e.lineWidth=1,e.beginPath(),t.w>t.h)for(let a=t.y+4;a<t.y+t.h;a+=6)e.moveTo(t.x,a),e.lineTo(t.x-4,a),e.moveTo(t.x+t.w,a),e.lineTo(t.x+t.w+4,a);else for(let a=t.x+4;a<t.x+t.w;a+=6)e.moveTo(a,t.y),e.lineTo(a,t.y-4),e.moveTo(a,t.y+t.h),e.lineTo(a,t.y+t.h+4);e.stroke()}}e.restore()}_drawFloor(e,t){if(e.save(),e.beginPath(),e.rect(t.x,t.y,t.w,t.h),e.clip(),t.floor==="tiles"){e.fillStyle="#121a28",e.fillRect(t.x,t.y,t.w,t.h);const i=44;for(let n=t.x;n<t.x+t.w;n+=i)for(let a=t.y;a<t.y+t.h;a+=i){const r=(Math.floor((n-t.x)/i)+Math.floor((a-t.y)/i))%2===0;e.fillStyle=r?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.04)",e.fillRect(n,a,i,i)}e.strokeStyle="rgba(40,80,120,0.25)",e.lineWidth=1;for(let n=t.x;n<=t.x+t.w;n+=i)e.beginPath(),e.moveTo(n,t.y),e.lineTo(n,t.y+t.h),e.stroke();for(let n=t.y;n<=t.y+t.h;n+=i)e.beginPath(),e.moveTo(t.x,n),e.lineTo(t.x+t.w,n),e.stroke()}else if(t.floor==="carpet"){e.fillStyle="#16102a",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(80,50,140,0.12)",e.lineWidth=1;for(let i=t.x;i<=t.x+t.w;i+=9)e.beginPath(),e.moveTo(i,t.y),e.lineTo(i,t.y+t.h),e.stroke();for(let i=t.y;i<=t.y+t.h;i+=9)e.beginPath(),e.moveTo(t.x,i),e.lineTo(t.x+t.w,i),e.stroke();e.strokeStyle="rgba(120,80,200,0.15)",e.lineWidth=3,e.strokeRect(t.x+15,t.y+15,t.w-30,t.h-30)}else if(t.floor==="wood"){e.fillStyle="#1a1208",e.fillRect(t.x,t.y,t.w,t.h);const i=32;for(let n=t.y;n<t.y+t.h;n+=i){const a=Math.floor((n-t.y)/i);e.fillStyle=a%2===0?"rgba(180,110,50,0.055)":"rgba(130,75,30,0.055)",e.fillRect(t.x,n,t.w,i-1),e.strokeStyle="rgba(70,45,18,0.35)",e.lineWidth=1,e.beginPath(),e.moveTo(t.x,n+i-1),e.lineTo(t.x+t.w,n+i-1),e.stroke(),e.strokeStyle="rgba(140,90,40,0.07)";for(let r=t.x+10;r<t.x+t.w-10;r+=t.w/5)e.beginPath(),e.moveTo(r,n),e.lineTo(r+12,n+i-1),e.stroke()}}else if(t.floor==="concrete"){e.fillStyle="#10101a",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(55,55,80,0.25)",e.lineWidth=1;const i=64;for(let n=t.x;n<=t.x+t.w;n+=i)e.beginPath(),e.moveTo(n,t.y),e.lineTo(n,t.y+t.h),e.stroke();for(let n=t.y;n<=t.y+t.h;n+=i)e.beginPath(),e.moveTo(t.x,n),e.lineTo(t.x+t.w,n),e.stroke();if(t.name==="Garage")e.fillStyle="rgba(30,25,10,0.4)",e.beginPath(),e.ellipse(t.x+150,t.y+230,60,30,.3,0,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(t.x+80,t.y+150,40,20,-.2,0,Math.PI*2),e.fill();else if(t.name==="Weaponry Depot"){e.strokeStyle="rgba(212, 175, 55, 0.15)",e.lineWidth=12,e.beginPath();for(let n=t.x;n<t.x+t.w;n+=60)e.moveTo(n,t.y),e.lineTo(n+40,t.y+40),e.moveTo(n,t.y+t.h-40),e.lineTo(n+40,t.y+t.h);e.stroke()}}else if(t.floor==="cybergrid"){e.fillStyle="#060a12",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(102, 252, 241, 0.08)",e.lineWidth=1;const i=50;for(let r=t.x;r<=t.x+t.w;r+=i)e.beginPath(),e.moveTo(r,t.y),e.lineTo(r,t.y+t.h),e.stroke();for(let r=t.y;r<=t.y+t.h;r+=i)e.beginPath(),e.moveTo(t.x,r),e.lineTo(t.x+t.w,r),e.stroke();const n=Date.now(),a=2+Math.sin(n/400)*.8;e.fillStyle="rgba(102, 252, 241, 0.45)";for(let r=t.x+i;r<t.x+t.w;r+=i)for(let o=t.y+i;o<t.y+t.h;o+=i)e.beginPath(),e.arc(r,o,a,0,Math.PI*2),e.fill()}else if(t.floor==="reactor"){e.fillStyle="#0f0a07",e.fillRect(t.x,t.y,t.w,t.h);const i=Date.now(),n=t.x+t.w/2,a=t.y+t.h/2;e.strokeStyle="rgba(255, 127, 59, 0.15)",e.lineWidth=4,e.strokeRect(t.x+8,t.y+8,t.w-16,t.h-16),e.lineWidth=2.5;const r=5;for(let l=1;l<=r;l++){const c=l*28,h=Math.sin(i/250-l*.5)*.15+.85;e.strokeStyle=`rgba(255, 127, 59, ${.08+(1-l/r)*.22})`,e.beginPath(),e.arc(n,a,c*h,0,Math.PI*2),e.stroke()}e.strokeStyle="rgba(255, 150, 80, 0.4)",e.lineWidth=1.5;const o=i/800%(Math.PI*2);e.beginPath(),e.arc(n,a,70,o,o+Math.PI*.4),e.stroke(),e.beginPath(),e.arc(n,a,110,o+Math.PI,o+Math.PI*1.4),e.stroke()}else if(t.floor==="nanogrid"){e.fillStyle="#050c08",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(57, 219, 20, 0.08)",e.lineWidth=1;const i=60;for(let r=t.x+30;r<t.x+t.w;r+=i)e.beginPath(),e.moveTo(r,t.y),e.lineTo(r,t.y+t.h),e.stroke();e.strokeStyle="rgba(57, 219, 20, 0.05)";for(let r=t.y+40;r<t.y+t.h;r+=80)e.beginPath(),e.moveTo(t.x,r),e.lineTo(t.x+t.w*.35,r),e.lineTo(t.x+t.w*.45,r-25),e.lineTo(t.x+t.w,r-25),e.stroke();const n=Date.now();e.fillStyle="rgba(57, 219, 20, 0.6)";const a=Math.floor(t.x*.7+t.y*1.3);for(let r=0;r<6;r++){const o=t.x+30+(a+r*39)%(t.w-60),l=t.y+30+(a*11+r*87)%(t.h-60);Math.floor(n/200+r)%3===0&&e.fillRect(o-2,l-2,4,4)}}else if(t.floor==="cybercarpet"){e.fillStyle="#0f081d",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(157, 59, 255, 0.04)",e.lineWidth=1.5;const i=30,n=i*Math.sqrt(3),a=i*2;for(let r=t.x-n;r<t.x+t.w+n;r+=n)for(let o=t.y-a;o<t.y+t.h+a;o+=a*.75){const l=Math.floor(o/(a*.75))%2*(n/2),c=r+l,h=o;e.beginPath();for(let f=0;f<6;f++){const d=f*Math.PI/3,u=c+i*Math.cos(d),p=h+i*Math.sin(d);f===0?e.moveTo(u,p):e.lineTo(u,p)}e.closePath(),e.stroke()}e.strokeStyle="rgba(157, 59, 255, 0.12)",e.lineWidth=3,e.strokeRect(t.x+20,t.y+20,t.w-40,t.h-40)}e.textAlign="center",e.font="bold 12px Orbitron",e.fillStyle="rgba(120,200,240,0.15)",e.fillText(t.name.toUpperCase(),t.x+t.w/2,t.y+22),e.restore()}_drawZone(e,t){e.save();const i=Math.sin(Date.now()/600)*.12+.12,n=t.type==="healing";e.fillStyle=n?`rgba(30,255,100,${i})`:`rgba(255,60,20,${i})`,e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle=n?`rgba(60,255,130,${i*2})`:`rgba(255,90,40,${i*2})`,e.lineWidth=2,e.setLineDash([8,8]),e.lineDashOffset=-(Date.now()/60%16),e.strokeRect(t.x,t.y,t.w,t.h),e.setLineDash([]);const a=14;e.lineWidth=2.5,[[t.x,t.y,1,1],[t.x+t.w,t.y,-1,1],[t.x,t.y+t.h,1,-1],[t.x+t.w,t.y+t.h,-1,-1]].forEach(([o,l,c,h])=>{e.beginPath(),e.moveTo(o,l+h*a),e.lineTo(o,l),e.lineTo(o+c*a,l),e.stroke()}),e.textAlign="center",e.font="bold 11px Orbitron",e.fillStyle=n?"rgba(80,255,140,0.55)":"rgba(255,110,60,0.55)",e.fillText(t.label,t.x+t.w/2,t.y+t.h/2-6);const r=n?`+${(t.healRate*60).toFixed(0)} HP/s`:`×${t.multiplier} DMG`;e.font="9px Orbitron",e.fillStyle=n?"rgba(80,255,140,0.4)":"rgba(255,110,60,0.4)",e.fillText(r,t.x+t.w/2,t.y+t.h/2+10),e.restore()}_drawItem(e,t){e.save();const i=1+Math.sin(Date.now()/180)*.14;t.type==="health"?(e.shadowColor="#ff2e2e",e.shadowBlur=14,e.fillStyle="#cc2020",e.beginPath(),e.arc(t.x,t.y,11*i,0,Math.PI*2),e.fill(),e.shadowBlur=0,e.fillStyle="#ffffff",e.fillRect(t.x-2.5,t.y-6.5*i,5,13*i),e.fillRect(t.x-6.5*i,t.y-2.5,13*i,5)):t.type==="ammo"?(e.shadowColor="#ffcc00",e.shadowBlur=10,e.fillStyle="#cc9900",e.fillRect(t.x-7,t.y-7,14,14),e.fillStyle="#ffe060",e.fillRect(t.x-2,t.y-5,4,8),e.beginPath(),e.arc(t.x,t.y-5,2,Math.PI,0),e.fill()):t.type==="adrenaline"?(e.shadowColor="#39db14",e.shadowBlur=15,e.fillStyle="#1b7d05",e.beginPath(),e.arc(t.x,t.y,11*i,0,Math.PI*2),e.fill(),e.fillStyle="#39db14",e.beginPath(),e.moveTo(t.x-1,t.y-6*i),e.lineTo(t.x-4,t.y+1),e.lineTo(t.x-1,t.y+1),e.lineTo(t.x-2.5,t.y+7*i),e.lineTo(t.x+3.5,t.y-1),e.lineTo(t.x+.5,t.y-1),e.closePath(),e.fill()):t.type==="overdrive"&&(e.shadowColor="#ffd700",e.shadowBlur=15,e.fillStyle="#aa7c11",e.beginPath(),e.moveTo(t.x,t.y-12*i),e.lineTo(t.x+10*i,t.y),e.lineTo(t.x,t.y+12*i),e.lineTo(t.x-10*i,t.y),e.closePath(),e.fill(),e.strokeStyle="#ffd700",e.lineWidth=2.5,e.lineCap="round",e.lineJoin="round",e.beginPath(),e.moveTo(t.x-4,t.y-4),e.lineTo(t.x-1,t.y),e.lineTo(t.x-4,t.y+4),e.stroke(),e.beginPath(),e.moveTo(t.x+1,t.y-4),e.lineTo(t.x+4,t.y),e.lineTo(t.x+1,t.y+4),e.stroke()),e.restore()}initTerminals(){this.terminals=[{id:"term_1",x:this.mapId==="cyberlab"?700:720,y:620,radius:24,hacked:!1,progress:0,active:!0,label:"REACTOR DATA CORE"},{id:"term_2",x:1220,y:1120,radius:24,hacked:!1,progress:0,active:!0,label:"SECURE CACHE SUPPLY"}]}_drawTerminal(e,t){e.save();const i=1+Math.sin(Date.now()/200)*.08,n=e.createRadialGradient(t.x,t.y,5,t.x,t.y,t.radius*1.5*i);n.addColorStop(0,t.hacked?"rgba(57, 255, 20, 0.25)":"rgba(102, 252, 241, 0.25)"),n.addColorStop(1,"rgba(0, 0, 0, 0.0)"),e.fillStyle=n,e.beginPath(),e.arc(t.x,t.y,t.radius*1.8*i,0,Math.PI*2),e.fill(),e.fillStyle="#1c1e24",e.strokeStyle="#2b2e38",e.lineWidth=2,e.beginPath(),e.arc(t.x,t.y,14,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#0b0c10",e.strokeStyle=t.hacked?"rgba(57, 255, 20, 0.8)":"rgba(102, 252, 241, 0.8)",e.lineWidth=1.5,e.beginPath(),e.roundRect?e.roundRect(t.x-12,t.y-12,24,16,3):e.rect(t.x-12,t.y-12,24,16),e.fill(),e.stroke(),e.fillStyle=t.hacked?"#39ff14":"#66fcf1",e.font="bold 5px monospace",e.textAlign="center",e.textBaseline="middle",e.fillText(t.hacked?"SECURE":"ACCESS",t.x,t.y-4),e.fillStyle=t.hacked?"#39ff14":"#ffd700",e.beginPath(),e.arc(t.x-6,t.y+7,2,0,Math.PI*2),e.arc(t.x+6,t.y+7,2,0,Math.PI*2),e.fill(),e.restore()}_drawExtrudedObject(e,t,i,n,a,r){const o={x:t.x,y:t.y},l={x:t.x+t.w,y:t.y},c={x:t.x+t.w,y:t.y+t.h},h={x:t.x,y:t.y+t.h},f={x:o.x+(o.x-i)*a,y:o.y+(o.y-n)*a},d={x:l.x+(l.x-i)*a,y:l.y+(l.y-n)*a},u={x:c.x+(c.x-i)*a,y:c.y+(c.y-n)*a},p={x:h.x+(h.x-i)*a,y:h.y+(h.y-n)*a};e.save(),e.fillStyle="rgba(2, 3, 5, 0.45)",e.beginPath(),e.moveTo(o.x,o.y),e.lineTo(l.x,l.y),e.lineTo(c.x,c.y),e.lineTo(h.x,h.y),e.closePath(),e.fill(),e.restore();const _=(M,v,x,y,E)=>{e.save(),e.fillStyle=E,e.beginPath(),e.moveTo(M.x,M.y),e.lineTo(v.x,v.y),e.lineTo(y.x,y.y),e.lineTo(x.x,x.y),e.closePath(),e.fill(),e.strokeStyle="rgba(0,0,0,0.25)",e.lineWidth=1,e.stroke(),e.restore()};_(o,l,f,d,n>t.y?"#090a0d":"#17181c"),_(l,c,d,u,i<t.x+t.w?"#0d0e12":"#1b1c21"),_(c,h,u,p,n<t.y+t.h?"#090a0d":"#17181c"),_(h,o,p,f,i>t.x?"#0d0e12":"#1b1c21"),e.save(),e.beginPath(),e.moveTo(f.x,f.y),e.lineTo(d.x,d.y),e.lineTo(u.x,u.y),e.lineTo(p.x,p.y),e.closePath(),e.clip();const g=f.x-t.x,m=f.y-t.y;e.translate(g,m),r(e,t),e.restore(),e.save(),e.beginPath(),e.moveTo(f.x,f.y),e.lineTo(d.x,d.y),e.lineTo(u.x,u.y),e.lineTo(p.x,p.y),e.closePath(),e.strokeStyle="rgba(255,255,255,0.12)",e.lineWidth=1.5,e.stroke(),e.restore()}_drawExtrudedBarrel(e,t,i,n){const r=t.x+t.w/2,o=t.y+t.h/2,l=t.w/2,c=r+(r-i)*.04,h=o+(o-n)*.04;e.save(),e.fillStyle="rgba(2, 3, 5, 0.45)",e.beginPath(),e.arc(r,o,l,0,Math.PI*2),e.fill(),e.restore();const f=Math.atan2(h-o,c-r)+Math.PI/2,d=Math.cos(f)*l,u=Math.sin(f)*l;e.save(),e.fillStyle="#1c1000",e.beginPath(),e.moveTo(r-d,o-u),e.lineTo(r+d,o-u),e.lineTo(c+d,h-u),e.lineTo(c-d,h-u),e.closePath(),e.fill(),e.strokeStyle="#3a2000",e.stroke(),e.restore(),e.save(),e.translate(c-r,h-o),this._drawBarrel(e,t),e.restore()}_drawWall(e,t,i,n){e.save();const a=.08,r=.04;switch(t.material){case"exterior":this._drawExtrudedObject(e,t,i,n,a,(o,l)=>this._drawExteriorWall(o,l));break;case"interior":this._drawExtrudedObject(e,t,i,n,a,(o,l)=>this._drawInteriorWall(o,l));break;case"furniture":this._drawExtrudedObject(e,t,i,n,r,(o,l)=>this._drawFurniturePiece(o,l));break;case"barrel":this._drawExtrudedBarrel(e,t,i,n);break;case"crate":this._drawExtrudedObject(e,t,i,n,r,(o,l)=>this._drawCratePiece(o,l));break;default:this._drawExtrudedObject(e,t,i,n,a,(o,l)=>this._drawInteriorWall(o,l))}e.restore()}_drawExteriorWall(e,t){e.fillStyle="#0b0b12",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(60,50,90,0.4)",e.lineWidth=1;const i=32,n=13;for(let a=t.x;a<t.x+t.w;a+=i)for(let r=t.y;r<t.y+t.h;r+=n){const o=Math.floor((r-t.y)/n)%2*(i/2);e.strokeRect(a+o,r,i,n)}e.strokeStyle="rgba(102,252,241,0.28)",e.lineWidth=2,e.strokeRect(t.x,t.y,t.w,t.h)}_drawInteriorWall(e,t){e.fillStyle="#1b1c22",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(90,130,170,0.45)",e.lineWidth=1.5,e.strokeRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(170,130,70,0.25)",e.lineWidth=1,t.w>t.h?(e.beginPath(),e.moveTo(t.x,t.y+3),e.lineTo(t.x+t.w,t.y+3),e.stroke(),e.beginPath(),e.moveTo(t.x,t.y+t.h-3),e.lineTo(t.x+t.w,t.y+t.h-3),e.stroke()):(e.beginPath(),e.moveTo(t.x+3,t.y),e.lineTo(t.x+3,t.y+t.h),e.stroke(),e.beginPath(),e.moveTo(t.x+t.w-3,t.y),e.lineTo(t.x+t.w-3,t.y+t.h),e.stroke())}_drawFurniturePiece(e,t){const i=t.label||"",a={sofa:{fill:"#261637",stroke:"#4a2a70"},table:{fill:"#241510",stroke:"#7a4a22"},bed:{fill:"#152030",stroke:"#2a5080"},counter:{fill:"#182215",stroke:"#3a7050"},desk:{fill:"#1e1408",stroke:"#5a3a18"},tub:{fill:"#0a1a2c",stroke:"#1a5a8a"},sink:{fill:"#0a1828",stroke:"#2a6090"},tv:{fill:"#0a0a14",stroke:"#4a4a70"},shelf:{fill:"#1e1006",stroke:"#5a3010"},car:{fill:"#1a1a28",stroke:"#3a3a5c"},bench:{fill:"#1c1408",stroke:"#5c4018"},fridge:{fill:"#141c24",stroke:"#3a5a78"},cabinet:{fill:"#18100a",stroke:"#5a3a1a"},dresser:{fill:"#1e1408",stroke:"#6a4020"},toilet:{fill:"#eee",stroke:"#555"},chair:{fill:"#2b1e16",stroke:"#5c402d"},plant:{fill:"#152d18",stroke:"#345a3a"},cyber_couch:{fill:"#110a24",stroke:"#9d3bff"},containment_pod:{fill:"#08181a",stroke:"#66fcf1"},server_rack:{fill:"#080c10",stroke:"#39db14"},cyber_console:{fill:"#050c18",stroke:"#1a7cd8"},reactor_core:{fill:"#150c05",stroke:"#ff7f3b"},nano_charger:{fill:"#051a0c",stroke:"#39db14"}}[i]||{fill:"#1a1a2a",stroke:"#4a4a80"};if(e.fillStyle=a.fill,e.strokeStyle=a.stroke,e.lineWidth=1.5,e.beginPath(),e.roundRect?e.roundRect(t.x,t.y,t.w,t.h,4):e.rect(t.x,t.y,t.w,t.h),e.fill(),e.stroke(),i==="bed"){e.fillStyle="rgba(255,255,255,0.05)",e.fillRect(t.x,t.y,t.w,10),e.strokeStyle=a.stroke,e.strokeRect(t.x,t.y,t.w,10),e.fillStyle="#223040",e.strokeStyle="rgba(255,255,255,0.1)",e.lineWidth=1;const r=Math.min(32,(t.w-16)/2),o=Math.min(18,t.h*.18),l=t.y+16;t.w>80?(e.fillRect(t.x+8,l,r,o),e.strokeRect(t.x+8,l,r,o),e.fillRect(t.x+t.w-8-r,l,r,o),e.strokeRect(t.x+t.w-8-r,l,r,o)):(e.fillRect(t.x+t.w/2-r/2,l,r,o),e.strokeRect(t.x+t.w/2-r/2,l,r,o)),e.strokeStyle="rgba(255, 255, 255, 0.08)",e.lineWidth=1.5,e.beginPath(),e.moveTo(t.x+4,t.y+t.h*.45),e.lineTo(t.x+t.w-4,t.y+t.h*.45),e.stroke(),e.beginPath(),e.moveTo(t.x+4,t.y+t.h*.45),e.lineTo(t.x+t.w/3,t.y+t.h*.65),e.moveTo(t.x+t.w-4,t.y+t.h*.45),e.lineTo(t.x+t.w*.66,t.y+t.h*.65),e.stroke()}else if(i==="sofa"){e.fillStyle="rgba(0,0,0,0.18)";const r=10;if(e.strokeStyle="rgba(255, 255, 255, 0.06)",t.w>t.h){e.fillRect(t.x,t.y,r,t.h),e.strokeRect(t.x,t.y,r,t.h),e.fillRect(t.x+t.w-r,t.y,r,t.h),e.strokeRect(t.x+t.w-r,t.y,r,t.h),e.fillRect(t.x+r,t.y,t.w-r*2,r),e.strokeRect(t.x+r,t.y,t.w-r*2,r);const o=(t.w-r*2)/3;for(let l=1;l<3;l++)e.beginPath(),e.moveTo(t.x+r+o*l,t.y+r),e.lineTo(t.x+r+o*l,t.y+t.h),e.stroke()}else{e.fillRect(t.x,t.y,t.w,r),e.strokeRect(t.x,t.y,t.w,r),e.fillRect(t.x,t.y+t.h-r,t.w,r),e.strokeRect(t.x,t.y+t.h-r,t.w,r),e.fillRect(t.x,t.y+r,r,t.h-r*2),e.strokeRect(t.x,t.y+r,r,t.h-r*2);const o=(t.h-r*2)/2;for(let l=1;l<2;l++)e.beginPath(),e.moveTo(t.x+r,t.y+r+o*l),e.lineTo(t.x+t.w,t.y+r+o*l),e.stroke()}}else if(i==="counter")if(e.strokeStyle="rgba(255,255,255,0.08)",e.lineWidth=1,t.w>t.h){e.fillStyle="#111b22",e.fillRect(t.x+t.w*.2,t.y+4,30,t.h-8),e.strokeRect(t.x+t.w*.2,t.y+4,30,t.h-8),e.strokeStyle="#8fa4b3",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+t.w*.2+15,t.y+2),e.lineTo(t.x+t.w*.2+15,t.y+8),e.stroke(),e.strokeStyle="#ff5c28",e.lineWidth=1;const r=t.x+t.w*.7,o=t.y+t.h/2;e.beginPath(),e.arc(r-12,o-6,4,0,Math.PI*2),e.arc(r+12,o-6,5,0,Math.PI*2),e.arc(r-12,o+6,5,0,Math.PI*2),e.arc(r+12,o+6,4,0,Math.PI*2),e.stroke()}else e.fillStyle="#111b22",e.fillRect(t.x+4,t.y+t.h*.3,t.w-8,30),e.strokeRect(t.x+4,t.y+t.h*.3,t.w-8,30),e.strokeStyle="#8fa4b3",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+2,t.y+t.h*.3+15),e.lineTo(t.x+8,t.y+t.h*.3+15),e.stroke();else if(i==="desk")e.fillStyle="rgba(0,0,0,0.15)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.fillStyle="#05050a",e.strokeStyle="#66fcf1",e.lineWidth=1.5,t.w>t.h?(e.fillRect(t.x+t.w/2-25,t.y+6,50,4),e.strokeRect(t.x+t.w/2-25,t.y+6,50,4),e.fillStyle="#222",e.fillRect(t.x+t.w/2-20,t.y+15,40,10)):(e.fillRect(t.x+6,t.y+t.h/2-25,4,50),e.strokeRect(t.x+6,t.y+t.h/2-25,4,50),e.fillStyle="#222",e.fillRect(t.x+15,t.y+t.h/2-20,10,40));else if(i==="shelf"){e.fillStyle="#3c2415",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4);const r=["#9e2a2b","#3e5c76","#ffe066","#a3b18a","#9b5de5","#ff9f1c"];e.lineWidth=1;const o=Math.round(t.x*13+t.y*37),l=new jr(o);if(t.w>t.h){let c=t.x+4;for(;c<t.x+t.w-6;){const h=Math.floor(l.next()*4)+3,f=Math.floor(l.next()*8)+12;e.fillStyle=r[Math.floor(l.next()*r.length)],e.fillRect(c,t.y+t.h-2-f,h,f),e.strokeRect(c,t.y+t.h-2-f,h,f),c+=h+1}}else{let c=t.y+4;for(;c<t.y+t.h-6;){const h=Math.floor(l.next()*4)+3,f=Math.floor(l.next()*8)+12;e.fillStyle=r[Math.floor(l.next()*r.length)],e.fillRect(t.x+2,c,f,h),e.strokeRect(t.x+2,c,f,h),c+=h+1}}}else if(i==="dresser"||i==="cabinet")if(e.strokeStyle="rgba(255,255,255,0.06)",e.lineWidth=1,t.w>t.h){const o=t.w/2;for(let l=0;l<2;l++)e.strokeRect(t.x+o*l+2,t.y+2,o-4,t.h-4),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x+o*l+o/2,t.y+t.h-5,2,0,Math.PI*2),e.fill()}else{const o=t.h/3;for(let l=0;l<3;l++)e.strokeRect(t.x+2,t.y+o*l+2,t.w-4,o-4),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x+t.w-5,t.y+o*l+o/2,2,0,Math.PI*2),e.fill()}else if(i==="toilet")e.fillStyle="#eee",e.strokeStyle="#555",e.lineWidth=1.5,e.fillRect(t.x+4,t.y,t.w-8,12),e.strokeRect(t.x+4,t.y,t.w-8,12),e.beginPath(),e.arc(t.x+t.w/2,t.y+24,9,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#66c0f4",e.beginPath(),e.arc(t.x+t.w/2,t.y+24,5,0,Math.PI*2),e.fill();else if(i==="chair")e.fillStyle="rgba(0,0,0,0.1)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.strokeStyle=a.stroke,e.lineWidth=2.5,e.beginPath(),e.moveTo(t.x+2,t.y+2),e.lineTo(t.x+t.w-2,t.y+2),e.stroke();else if(i==="plant"){const r=t.x+t.w/2,o=t.y+t.h/2;e.fillStyle="#8c5a3c",e.strokeStyle="#5c3a26",e.beginPath(),e.arc(r,o,10,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#2a7c36",e.beginPath(),e.arc(r-6,o-4,7,0,Math.PI*2),e.arc(r+6,o-4,6,0,Math.PI*2),e.arc(r,o+6,8,0,Math.PI*2),e.arc(r-3,o+5,6,0,Math.PI*2),e.fill(),e.fillStyle="#4ea35b",e.beginPath(),e.arc(r-4,o-2,4,0,Math.PI*2),e.arc(r+4,o-2,3,0,Math.PI*2),e.arc(r,o+3,4,0,Math.PI*2),e.fill()}else if(i==="tub")e.fillStyle="#0d2535",e.fillRect(t.x+7,t.y+7,t.w-14,t.h-14),e.strokeStyle="rgba(50,170,255,0.25)",e.strokeRect(t.x+7,t.y+7,t.w-14,t.h-14);else if(i==="car")e.fillStyle="#0a1828",e.fillRect(t.x+28,t.y+18,65,38),e.fillRect(t.x+t.w-95,t.y+18,65,38),e.strokeStyle="rgba(80,120,200,0.3)",e.strokeRect(t.x+28,t.y+18,65,38),e.strokeRect(t.x+t.w-95,t.y+18,65,38),e.strokeStyle="rgba(100,100,180,0.4)",e.lineWidth=2,e.strokeRect(t.x+10,t.y+10,t.w-20,t.h-20);else if(i==="cyber_couch")e.fillStyle="rgba(0,0,0,0.2)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.strokeStyle="rgba(157, 59, 255, 0.25)",e.lineWidth=1,t.w>t.h?(e.strokeRect(t.x+6,t.y+4,t.w-12,6),e.beginPath(),e.moveTo(t.x+4,t.y+t.h-4),e.lineTo(t.x+t.w-4,t.y+t.h-4),e.strokeStyle="#9d3bff",e.stroke()):(e.strokeRect(t.x+4,t.y+6,6,t.h-12),e.beginPath(),e.moveTo(t.x+t.w-4,t.y+4),e.lineTo(t.x+t.w-4,t.y+t.h-4),e.strokeStyle="#9d3bff",e.stroke());else if(i==="containment_pod"){e.fillStyle="rgba(102, 252, 241, 0.05)",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.fillStyle="#222",e.strokeStyle="#66fcf1",e.lineWidth=1.5,t.w>t.h?(e.fillRect(t.x,t.y,8,t.h),e.strokeRect(t.x,t.y,8,t.h),e.fillRect(t.x+t.w-8,t.y,8,t.h),e.strokeRect(t.x+t.w-8,t.y,8,t.h)):(e.fillRect(t.x,t.y,t.w,8),e.strokeRect(t.x,t.y,t.w,8),e.fillRect(t.x,t.y+t.h-8,t.w,8),e.strokeRect(t.x,t.y+t.h-8,t.w,8));const r=Date.now();e.fillStyle="rgba(102, 252, 241, 0.4)";const o=Math.floor(t.x*2.3+t.y*1.7);for(let l=0;l<4;l++){const c=t.x+10+(o+l*29)%(t.w-20),h=t.y+10+((o*7+l*41-r*.04)%(t.h-20)+(t.h-20))%(t.h-20);e.beginPath(),e.arc(c,h,1.5+l%2,0,Math.PI*2),e.fill()}}else if(i==="server_rack"){e.fillStyle="#0a0d14",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.strokeStyle="rgba(255, 255, 255, 0.04)",e.lineWidth=1;const r=Date.now(),o=Math.floor(t.h/14);if(t.h>t.w)for(let l=0;l<o;l++){const c=t.y+4+l*14;e.strokeRect(t.x+3,c,t.w-6,10);const h=Math.floor(r/200+l)%4!==0,f=Math.floor(r/450+l*2)%6===0,d=Math.floor(r/300-l)%5===0;e.fillStyle=h?"#39db14":"#053005",e.fillRect(t.x+6,c+4,3,3),e.fillStyle=f?"#ff3c3c":"#400505",e.fillRect(t.x+12,c+4,3,3),e.fillStyle=d?"#66fcf1":"#052028",e.fillRect(t.x+18,c+4,3,3)}else{const l=Math.floor(t.w/14);for(let c=0;c<l;c++){const h=t.x+4+c*14;e.strokeRect(h,t.y+3,10,t.h-6);const f=Math.floor(r/200+c)%4!==0,d=Math.floor(r/450+c*2)%6===0;e.fillStyle=f?"#39db14":"#053005",e.fillRect(h+4,t.y+6,3,3),e.fillStyle=d?"#ff3c3c":"#400505",e.fillRect(h+4,t.y+12,3,3)}}}else if(i==="cyber_console")if(e.fillStyle="rgba(0,0,0,0.35)",e.fillRect(t.x+3,t.y+3,t.w-6,t.h-6),e.fillStyle="#09152b",e.strokeStyle="#1a7cd8",e.lineWidth=1.5,t.w>t.h){e.fillRect(t.x+5,t.y+t.h-12,t.w-10,8),e.strokeRect(t.x+5,t.y+t.h-12,t.w-10,8),e.fillStyle="rgba(26, 124, 216, 0.15)",e.fillRect(t.x+10,t.y+4,t.w-20,t.h-18),e.strokeRect(t.x+10,t.y+4,t.w-20,t.h-18),e.strokeStyle="#66fcf1",e.lineWidth=1,e.beginPath();const r=Date.now();for(let o=t.x+14;o<t.x+t.w-14;o+=4){const l=t.y+10+Math.sin(r*.005+o*.1)*3;o===t.x+14?e.moveTo(o,l):e.lineTo(o,l)}e.stroke()}else e.fillRect(t.x+4,t.y+5,8,t.h-10),e.strokeRect(t.x+4,t.y+5,8,t.h-10),e.fillStyle="rgba(26, 124, 216, 0.15)",e.fillRect(t.x+14,t.y+10,t.w-18,t.h-20),e.strokeRect(t.x+14,t.y+10,t.w-18,t.h-20);else if(i==="reactor_core"){const r=t.x+t.w/2,o=t.y+t.h/2,l=Math.min(t.w,t.h)/2,c=Date.now();e.fillStyle="#100a05",e.strokeStyle="#ff7f3b",e.lineWidth=2.5,e.beginPath(),e.arc(r,o,l-4,0,Math.PI*2),e.fill(),e.stroke();const h=3,f=c/400%(Math.PI*2);e.fillStyle="#ff7f3b";for(let d=0;d<h;d++){const u=f+d*Math.PI*2/h,p=r+Math.cos(u)*(l-12),_=o+Math.sin(u)*(l-12);e.beginPath(),e.arc(p,_,4,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(255, 215, 0, 0.25)",e.lineWidth=1.5,e.beginPath(),e.moveTo(r,o),e.lineTo(p,_),e.stroke()}e.fillStyle="#ffd700",e.shadowColor="#ff7f3b",e.shadowBlur=12,e.beginPath(),e.arc(r,o,6+Math.sin(c/150)*1.5,0,Math.PI*2),e.fill(),e.shadowBlur=0}else if(i==="nano_charger"){e.fillStyle="#06100a",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.fillStyle="rgba(57, 219, 20, 0.1)",e.strokeStyle="#39db14",e.lineWidth=1.5,e.strokeRect(t.x+4,t.y+4,t.w-8,t.h-8);const r=Date.now(),o=(t.h-12)*(.5+Math.sin(r/250)*.35);e.fillStyle="#39db14",e.fillRect(t.x+6,t.y+t.h-6-o,t.w-12,o)}else i==="fridge"?(e.strokeStyle="rgba(160,200,255,0.4)",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+t.w/2-10,t.y+12),e.lineTo(t.x+t.w/2+10,t.y+12),e.stroke()):(e.strokeStyle="rgba(255,255,255,0.06)",e.strokeRect(t.x+3,t.y+3,t.w-6,t.h-6))}_drawBarrel(e,t){const i=t.x+t.w/2,n=t.y+t.h/2,a=t.w/2;if(e.fillStyle="#2a1800",e.strokeStyle="#9a4800",e.lineWidth=2,e.beginPath(),e.arc(i,n,a,0,Math.PI*2),e.fill(),e.stroke(),e.strokeStyle="rgba(255,120,0,0.65)",e.lineWidth=2,e.beginPath(),e.arc(i,n,a-5,0,Math.PI*2),e.stroke(),e.strokeStyle="rgba(255,160,0,0.4)",e.lineWidth=1.5,e.beginPath(),e.moveTo(i-a*.4,n-a*.4),e.lineTo(i+a*.4,n+a*.4),e.moveTo(i+a*.4,n-a*.4),e.lineTo(i-a*.4,n+a*.4),e.stroke(),t.health<t.maxHealth){const r=t.health/t.maxHealth;e.fillStyle="rgba(0,0,0,0.6)",e.fillRect(t.x,t.y+2,t.w,4),e.fillStyle=r>.5?"#39ff14":"#ff3c3c",e.fillRect(t.x,t.y+2,t.w*r,4)}}_drawCratePiece(e,t){e.fillStyle="#3a2b1e",e.strokeStyle="#b8865c",e.lineWidth=1.5,e.fillRect(t.x,t.y,t.w,t.h),e.strokeRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(170,110,60,0.4)",e.lineWidth=1,e.beginPath(),e.moveTo(t.x+3,t.y+3),e.lineTo(t.x+t.w-3,t.y+t.h-3),e.moveTo(t.x+t.w-3,t.y+3),e.lineTo(t.x+3,t.y+t.h-3),e.stroke(),e.strokeStyle="rgba(210,150,80,0.7)",e.lineWidth=1.5;const i=8;if([[t.x,t.y,1,1],[t.x+t.w,t.y,-1,1],[t.x,t.y+t.h,1,-1],[t.x+t.w,t.y+t.h,-1,-1]].forEach(([n,a,r,o])=>{e.beginPath(),e.moveTo(n,a+o*i),e.lineTo(n,a),e.lineTo(n+r*i,a),e.stroke()}),t.health<t.maxHealth){const n=t.health/t.maxHealth;e.fillStyle="rgba(0,0,0,0.6)",e.fillRect(t.x+4,t.y+4,t.w-8,5),e.fillStyle=n>.5?"#39ff14":"#ff3c3c",e.fillRect(t.x+4,t.y+4,(t.w-8)*n,5)}}};class pi{constructor(e,t,i,n,a,r,o,l,c="normal"){this.x=e,this.y=t,this.vx=i,this.vy=n,this.color=a,this.size=r,this.life=o,this.decay=l,this.type=c,this.angle=Math.random()*Math.PI*2,this.spin=(Math.random()-.5)*.3,this.bounceCount=0}update(e){if(this.life-=this.decay,this.type==="casing"||this.type==="splinter"){this.vx*=.95,this.vy*=.95,this.angle+=this.spin;const t=this.x+this.vx,i=this.y+this.vy,n=e.checkCircleCollision(t,i,this.size);(n.x!==t||n.y!==i)&&this.bounceCount<2?(this.bounceCount++,this.x=n.x,this.y=n.y,this.vx=-this.vx*.4,this.vy=-this.vy*.4):(this.x=n.x,this.y=n.y)}else this.x+=this.vx,this.y+=this.vy,this.vx*=.92,this.vy*=.92}draw(e){e.save(),e.globalAlpha=Math.max(0,this.life),this.type==="casing"?(e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle="#d4af37",e.strokeStyle="#996515",e.lineWidth=.5,e.fillRect(-this.size,-this.size/2,this.size*2,this.size),e.strokeRect(-this.size,-this.size/2,this.size*2,this.size)):this.type==="splinter"?(e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle="#8b5a2b",e.beginPath(),e.moveTo(-this.size,0),e.lineTo(this.size,-this.size/2),e.lineTo(this.size/2,this.size/2),e.closePath(),e.fill()):this.type==="blood"?(e.fillStyle=this.color,e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fill()):(e.fillStyle=this.color,!(window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode)&&(this.color.startsWith("#66fc")||this.color.startsWith("#ff3c"))&&(e.shadowColor=this.color,e.shadowBlur=4),e.beginPath(),e.arc(this.x,this.y,this.size*this.life,0,Math.PI*2),e.fill()),e.restore()}}class Zr{constructor(e,t,i,n,a="blood"){this.x=e,this.y=t,this.size=i,this.color=n,this.type=a,this.angle=Math.random()*Math.PI*2,this.scaleX=1+(Math.random()-.5)*.4,this.scaleY=1+(Math.random()-.5)*.4}draw(e){e.save(),e.translate(this.x,this.y),e.rotate(this.angle),e.globalAlpha=this.type==="blood"?.75:.9,this.type==="blood"?(e.fillStyle=this.color,e.beginPath(),e.ellipse(0,0,this.size*this.scaleX,this.size*this.scaleY,0,0,Math.PI*2),e.fill()):this.type==="casing"?(e.fillStyle="#b5921c",e.fillRect(-this.size,-this.size/2,this.size*2,this.size)):this.type==="splinter"&&(e.fillStyle="#6e441c",e.fillRect(-this.size,-this.size/3,this.size*1.5,this.size*.7)),e.restore()}}class lx{constructor(){this.particles=[],this.decals=[],this.bloodEnabled=!0}clear(){this.particles=[],this.decals=[]}setBloodEnabled(e){this.bloodEnabled=e}update(e){for(let t=this.particles.length-1;t>=0;t--){const i=this.particles[t];i.update(e),i.life<=0&&(i.type==="blood"&&this.bloodEnabled&&Math.random()<.6?this.decals.push(new Zr(i.x,i.y,i.size*1.2,i.color,"blood")):i.type==="casing"?this.decals.push(new Zr(i.x,i.y,i.size,"#996515","casing")):i.type==="splinter"&&Math.random()<.4&&this.decals.push(new Zr(i.x,i.y,i.size,"#5c3917","splinter")),this.particles.splice(t,1))}this.decals.length>250&&this.decals.shift()}drawDecals(e){this.decals.forEach(t=>t.draw(e))}drawParticles(e){this.particles.forEach(t=>t.draw(e))}spawnWallImpact(e,t,i){const n=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,a=i+Math.PI,r=n?1:Math.floor(Math.random()*4)+3;for(let o=0;o<r;o++){const l=a+(Math.random()-.5)*1.2,c=Math.random()*3+2,h=Math.cos(l)*c,f=Math.sin(l)*c,d=Math.random()*2.2+1.2,u=Math.random()*.04+.04;this.particles.push(new pi(e,t,h,f,Math.random()>.5?"#66fcf1":"#ffffff",d,1,u,"spark"))}n||this.particles.push(new pi(e,t,(Math.random()-.5)*.3,(Math.random()-.5)*.3,"rgba(197, 198, 199, 0.25)",Math.random()*6+4,1,.03,"smoke"))}spawnBloodSplatter(e,t,i){if(!this.bloodEnabled)return;const a=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode?2:Math.floor(Math.random()*6)+6;for(let r=0;r<a;r++){const o=i+(Math.random()-.5)*1.1,l=Math.random()*4.5+2.5,c=Math.cos(o)*l,h=Math.sin(o)*l,f=Math.random()*3+1.5,d=Math.random()*.05+.04,p=`rgb(${Math.floor(Math.random()*60)+120}, 10, 10)`;this.particles.push(new pi(e,t,c,h,p,f,1,d,"blood"))}}spawnGunCasing(e,t,i,n){if(window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode)return;const r=i+Math.PI/2+(Math.random()-.5)*.5,o=Math.random()*2+1.8,l=Math.cos(r)*o,c=Math.sin(r)*o,h=n==="sniper"?3.5:n==="pistol"?2:2.6,f=.02;this.particles.push(new pi(e,t,l,c,"#d4af37",h,1,f,"casing"));const d=i+(Math.random()-.5)*.3,u=Math.random()*.6+.3;this.particles.push(new pi(e+Math.cos(i)*6,t+Math.sin(i)*6,Math.cos(d)*u,Math.sin(d)*u,"rgba(200, 200, 200, 0.15)",Math.random()*5+3,1,.04,"smoke"))}spawnCrateSplinters(e,t){const i=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,n=i?3:Math.floor(Math.random()*12)+10;for(let a=0;a<n;a++){const r=Math.random()*Math.PI*2,o=Math.random()*4+1.5,l=Math.cos(r)*o,c=Math.sin(r)*o,h=Math.random()*4+2,f=Math.random()*.03+.02;this.particles.push(new pi(e,t,l,c,"#8b5a2b",h,1,f,"splinter"))}if(!i)for(let a=0;a<4;a++)this.particles.push(new pi(e+(Math.random()-.5)*10,t+(Math.random()-.5)*10,(Math.random()-.5)*.8,(Math.random()-.5)*.8,"rgba(140, 130, 120, 0.2)",Math.random()*12+8,1,.02,"smoke"))}spawnFlashbangBurst(e,t){const i=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,n=i?8:30;for(let a=0;a<n;a++){const r=Math.random()*Math.PI*2,o=Math.random()*7+3,l=Math.cos(r)*o,c=Math.sin(r)*o,h=Math.random()*4+2,f=Math.random()*.03+.02;this.particles.push(new pi(e,t,l,c,Math.random()>.3?"#ffffff":"#66fcf1",h,1,f,"spark"))}if(!i)for(let a=0;a<10;a++){const r=Math.random()*Math.PI*2,o=Math.random()*2.5,l=Math.cos(r)*o,c=Math.sin(r)*o;this.particles.push(new pi(e,t,l,c,"rgba(255, 255, 255, 0.4)",Math.random()*20+10,1,.015,"smoke"))}}spawnDashParticles(e,t,i,n="cyan"){const a=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,o={cyan:"#66fcf1",green:"#5eff39",purple:"#c47aff",orange:"#ff9d7a",yellow:"#ffea70",red:"#ff7a7a"}[n]||"#66fcf1",l=i+Math.PI,c=a?2:12;for(let f=0;f<c;f++){const d=l+(Math.random()-.5)*.6,u=Math.random()*2.5+1.2,p=Math.cos(d)*u,_=Math.sin(d)*u,g=Math.random()*7+4,m=Math.random()*.05+.03;this.particles.push(new pi(e,t,p,_,"rgba(200, 200, 200, 0.18)",g,1,m,"smoke"))}const h=a?3:18;for(let f=0;f<h;f++){const d=i+(Math.random()-.5)*.7,u=Math.random()*8+4,p=Math.cos(d)*u,_=Math.sin(d)*u,g=Math.random()*2.5+1,m=Math.random()*.06+.04;this.particles.push(new pi(e,t,p,_,o,g,1,m,"spark"))}}}class cx{constructor(){this.ctx=null,this.masterVolume=null,this.volume=.5,this.noiseBuffer=null,this.shotgunBuffer=null,this.taskAlarms=new Map,this.bearMusic=null}init(){if(this.ctx)return;const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.masterVolume=this.ctx.createGain(),this.masterVolume.gain.value=this.volume,this.masterVolume.connect(this.ctx.destination);const t=this.ctx.sampleRate*2,i=this.ctx.createBuffer(1,t,this.ctx.sampleRate),n=i.getChannelData(0);for(let a=0;a<t;a++)n[a]=Math.random()*2-1;this.noiseBuffer=i,fetch("/dennish18-shotgun.mp3").then(a=>a.arrayBuffer()).then(a=>this.ctx.decodeAudioData(a)).then(a=>{this.shotgunBuffer=a}).catch(a=>console.error("Error loading shotgun sound:",a)),this._buildReverb()}_buildReverb(){if(!this.ctx||this.reverbNode)return;const e=Math.floor(this.ctx.sampleRate*.9),t=this.ctx.createBuffer(2,e,this.ctx.sampleRate);for(let i=0;i<2;i++){const n=t.getChannelData(i);for(let a=0;a<e;a++)n[a]=(Math.random()*2-1)*Math.pow(1-a/e,2.2)}this.reverbNode=this.ctx.createConvolver(),this.reverbNode.buffer=t,this.reverbGain=this.ctx.createGain(),this.reverbGain.gain.value=.28,this.reverbNode.connect(this.reverbGain),this.reverbGain.connect(this.masterVolume)}setVolume(e){this.volume=e,this.masterVolume&&(this.masterVolume.gain.value=e),this.bearMusic&&(this.bearMusic.volume=e*.3)}playGunshot(e,t=0){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const i=this.ctx.currentTime;let n=this.masterVolume;if(t>0){const m=this.ctx.createBiquadFilter();m.type="lowpass";const M=Math.max(220,4500*Math.pow(1-Math.min(1,t/1300),1.5));m.frequency.setValueAtTime(M,i);const v=Math.max(.01,Math.pow(1-Math.min(1,t/1400),1.2)),x=this.ctx.createGain();x.gain.setValueAtTime(v,i),m.connect(x),x.connect(this.masterVolume),n=m}const a=this.ctx.createBufferSource();a.buffer=this.noiseBuffer;const r=this.ctx.createBiquadFilter(),o=this.ctx.createGain();a.connect(r),r.connect(o),o.connect(n);const l=this.ctx.createOscillator(),c=this.ctx.createGain();l.connect(c),c.connect(n);let h=1e3,f=.1,d=.6,u=150,p=40,_=.08,g=.5;switch(e){case"pistol":h=1200,f=.12,d=.5,u=180,p=50,_=.06,g=.3;break;case"rifle":h=800,f=.18,d=.6,u=140,p=40,_=.1,g=.5;break;case"shotgun":if(this.shotgunBuffer)try{const m=this.ctx.createBufferSource();m.buffer=this.shotgunBuffer;const M=this.ctx.createGain();M.gain.setValueAtTime(.9,i),m.connect(M),M.connect(n),m.start(i);return}catch(m){console.error("Error playing custom shotgun audio:",m)}h=500,f=.35,d=.9,u=120,p=30,_=.25,g=.9,this.playMetallicClick(i+.05,800,.08,.3,t),this.playMetallicClick(i+.1,600,.05,.3,t);break;case"sniper":h=1500,f=.6,d=1,u=220,p=30,_=.4,g=1;break;case"knife":h=2e3,f=.12,d=.45,u=100,p=100,_=.01,g=0;break;case"vector":h=1600,f=.08,d=.42,u=200,p=80,_=.05,g=.25;break;case"famas":h=1e3,f=.14,d=.55,u=160,p=50,_=.09,g=.42;break;case"plasma":{h=3e3,f=.18,d=.3,u=600,p=120,_=.18,g=.55;try{const m=this.ctx.createOscillator(),M=this.ctx.createGain();m.type="sawtooth",m.frequency.setValueAtTime(800,i),m.frequency.exponentialRampToValueAtTime(200,i+.15),M.gain.setValueAtTime(.08,i),M.gain.exponentialRampToValueAtTime(.001,i+.15),m.connect(M),M.connect(n),m.start(i),m.stop(i+.17)}catch{}break}case"railgun":{h=600,f=.55,d=1,u=320,p=18,_=.45,g=1;try{const m=this.ctx.createOscillator(),M=this.ctx.createGain();m.type="square",m.frequency.setValueAtTime(180,i),m.frequency.exponentialRampToValueAtTime(40,i+.3),M.gain.setValueAtTime(.15,i),M.gain.exponentialRampToValueAtTime(.001,i+.3),m.connect(M),M.connect(n),m.start(i),m.stop(i+.32)}catch{}break}}r.type="bandpass",r.frequency.setValueAtTime(h,i),o.gain.setValueAtTime(d,i),o.gain.exponentialRampToValueAtTime(.001,i+f),l.type="sine",l.frequency.setValueAtTime(u,i),l.frequency.exponentialRampToValueAtTime(p,i+_),c.gain.setValueAtTime(g,i),c.gain.exponentialRampToValueAtTime(.001,i+_),a.start(i),a.stop(i+f+.05),l.start(i),l.stop(i+_+.05)}playReload(e){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime;e==="pistol"?(this.playMetallicClick(t,2e3,.05,.3),this.playMetallicClick(t+.4,1500,.08,.4),this.playMetallicClick(t+.5,2200,.04,.3)):e==="rifle"?(this.playMetallicClick(t,1800,.06,.3),this.playFrictionalScrape(t+.3,.2,.2),this.playMetallicClick(t+1.2,1200,.1,.5),this.playMetallicClick(t+1.35,2e3,.05,.4),this.playMetallicClick(t+1.8,1400,.08,.5),this.playMetallicClick(t+1.9,1e3,.08,.4)):e==="shotgun"?(this.playMetallicClick(t,1200,.06,.4),this.playFrictionalScrape(t+.05,.15,.3),this.playMetallicClick(t+.2,1800,.04,.4)):e==="sniper"&&(this.playMetallicClick(t,1400,.08,.4),this.playMetallicClick(t+.1,1e3,.06,.3),this.playMetallicClick(t+.5,900,.1,.4),this.playMetallicClick(t+.65,1200,.05,.3),this.playMetallicClick(t+1.2,1500,.1,.4),this.playMetallicClick(t+1.35,1800,.05,.3),this.playMetallicClick(t+1.9,1100,.08,.4),this.playMetallicClick(t+2.05,1600,.06,.4))}playDryFire(){this.init(),this.ctx&&this.playMetallicClick(this.ctx.currentTime,3e3,.03,.25)}playFootstep(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.setValueAtTime(220,e);const n=this.ctx.createGain();n.gain.setValueAtTime(.08,e),n.gain.exponentialRampToValueAtTime(.001,e+.1),t.connect(i),i.connect(n),n.connect(this.masterVolume),t.start(e),t.stop(e+.12)}playHitMarker(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(1600,e),i.gain.setValueAtTime(.15,e),i.gain.exponentialRampToValueAtTime(.001,e+.08),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.1)}playCriticalHitMarker(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(2300,e),i.gain.setValueAtTime(.25,e),i.gain.exponentialRampToValueAtTime(.001,e+.14),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.16)}playFleshHit(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.setValueAtTime(350,e);const n=this.ctx.createGain();n.gain.setValueAtTime(.35,e),n.gain.exponentialRampToValueAtTime(.001,e+.1),t.connect(i),i.connect(n),n.connect(this.masterVolume),t.start(e),t.stop(e+.12)}playCrateBreak(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.setValueAtTime(300,e);const n=this.ctx.createGain();n.gain.setValueAtTime(.7,e),n.gain.exponentialRampToValueAtTime(.001,e+.3),t.connect(i),i.connect(n),n.connect(this.masterVolume);const a=this.ctx.createBufferSource();a.buffer=this.noiseBuffer;const r=this.ctx.createBiquadFilter();r.type="highpass",r.frequency.setValueAtTime(2e3,e);const o=this.ctx.createGain();o.gain.setValueAtTime(.2,e),o.gain.exponentialRampToValueAtTime(.001,e+.15),a.connect(r),r.connect(o),o.connect(this.masterVolume),t.start(e),t.stop(e+.35),a.start(e),a.stop(e+.2)}playPickup(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(587.33,e),t.frequency.setValueAtTime(880,e+.08),i.gain.setValueAtTime(.12,e),i.gain.setValueAtTime(.12,e+.08),i.gain.exponentialRampToValueAtTime(.001,e+.25),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.28)}playMatchWin(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=(i,n,a,r)=>{const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="triangle",o.frequency.setValueAtTime(i,n),l.gain.setValueAtTime(r,n),l.gain.exponentialRampToValueAtTime(.001,n+a),o.connect(l),l.connect(this.masterVolume),o.start(n),o.stop(n+a+.05)};t(523.25,e,.4,.2),t(659.25,e+.15,.4,.2),t(783.99,e+.3,.4,.2),t(1046.5,e+.45,.6,.25)}playMatchLose(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=(i,n,a,r)=>{const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sawtooth",o.frequency.setValueAtTime(i,n);const c=this.ctx.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(500,n),l.gain.setValueAtTime(r,n),l.gain.exponentialRampToValueAtTime(.001,n+a),o.connect(c),c.connect(l),l.connect(this.masterVolume),o.start(n),o.stop(n+a+.05)};t(220,e,.5,.2),t(207.65,e+.2,.5,.2),t(196,e+.4,.5,.2),t(146.83,e+.6,.8,.25)}playMetallicClick(e,t,i,n=.3,a=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const r=typeof e=="number"&&e<10?Math.max(0,e):0,o=this.ctx.currentTime+r,l=this.ctx.createOscillator(),c=this.ctx.createGain();let h=this.masterVolume;if(a>0){const f=this.ctx.createBiquadFilter();f.type="lowpass";const d=Math.max(220,3e3*(1-Math.min(1,a/1200)));f.frequency.setValueAtTime(d,o);const u=this.ctx.createGain(),p=Math.max(.01,1-a/1300);u.gain.setValueAtTime(p,o),f.connect(u),u.connect(this.masterVolume),h=f}l.connect(c),c.connect(h),l.type="square",l.frequency.setValueAtTime(t,o),l.frequency.exponentialRampToValueAtTime(t*.5,o+i),c.gain.setValueAtTime(n,o),c.gain.exponentialRampToValueAtTime(.001,o+i),l.start(o),l.stop(o+i+.01)}catch{}}playFrictionalScrape(e,t,i=.2){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const n=typeof e=="number"&&e<10?Math.max(0,e):0,a=this.ctx.currentTime+n,r=this.ctx.createBufferSource();r.buffer=this.noiseBuffer;const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(800,a),o.frequency.exponentialRampToValueAtTime(1400,a+t);const l=this.ctx.createGain();l.gain.setValueAtTime(i,a),l.gain.linearRampToValueAtTime(i*.5,a+t*.5),l.gain.exponentialRampToValueAtTime(.001,a+t),r.connect(o),o.connect(l),l.connect(this.masterVolume),r.start(a),r.stop(a+t+.02)}catch{}}playFlashbangExplosion(e=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime,i=this.ctx.createOscillator(),n=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(160,t),i.frequency.exponentialRampToValueAtTime(10,t+.3);const a=Math.max(.1,1-e/1100);n.gain.setValueAtTime(.85*a,t),n.gain.exponentialRampToValueAtTime(.001,t+.35),i.connect(n),n.connect(this.masterVolume),i.start(t),i.stop(t+.4);const r=this.ctx.createOscillator(),o=this.ctx.createGain();r.type="sine",r.frequency.setValueAtTime(4500,t);const l=.35*Math.max(.01,1-e/700);o.gain.setValueAtTime(l,t),o.gain.linearRampToValueAtTime(l*.5,t+1),o.gain.exponentialRampToValueAtTime(.001,t+2.5),r.connect(o),o.connect(this.masterVolume),r.start(t),r.stop(t+2.6)}catch{}}playDashSound(e=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime,i=this.ctx.createOscillator(),n=this.ctx.createGain();let a=this.masterVolume;if(e>0){const r=this.ctx.createBiquadFilter();r.type="lowpass";const o=Math.max(220,3e3*(1-Math.min(1,e/1200)));r.frequency.setValueAtTime(o,t);const l=this.ctx.createGain(),c=Math.max(.01,1-e/1300);l.gain.setValueAtTime(c,t),r.connect(l),l.connect(this.masterVolume),a=r}i.connect(n),n.connect(a),i.type="sine",i.frequency.setValueAtTime(800,t),i.frequency.exponentialRampToValueAtTime(150,t+.2),n.gain.setValueAtTime(.35,t),n.gain.exponentialRampToValueAtTime(.001,t+.22),i.start(t),i.stop(t+.25)}catch{}}playAlarmForTask(e,t=0){if(this.init(),!this.ctx)return;if(this.ctx.state==="suspended"&&this.ctx.resume(),this.taskAlarms.has(e)){this.taskAlarms.get(e).distance=t;return}const i={intervalId:null,nodes:[],active:!0,distance:t};this.taskAlarms.set(e,i);const n=()=>{if(!i.active||!this.ctx)return;const a=i.distance,r=700,o=Math.max(0,Math.pow(1-Math.min(1,a/r),2.8)),l=Math.max(150,4e3*Math.pow(1-Math.min(1,a/r),2.5)),c=this.ctx.currentTime,h=this.ctx.createGain();h.gain.setValueAtTime(0,c),h.gain.linearRampToValueAtTime(o*.55,c+.04),h.gain.setValueAtTime(o*.55,c+.32),h.gain.linearRampToValueAtTime(0,c+.42);const f=this.ctx.createBiquadFilter();f.type="lowpass",f.frequency.setValueAtTime(l,c),f.Q.value=.9;const d=this.ctx.createOscillator();d.type="sawtooth",d.frequency.setValueAtTime(880,c),d.frequency.linearRampToValueAtTime(660,c+.2),d.frequency.linearRampToValueAtTime(880,c+.4);const u=this.ctx.createOscillator();u.type="square",u.frequency.setValueAtTime(1100,c),u.frequency.linearRampToValueAtTime(880,c+.2),u.frequency.linearRampToValueAtTime(1100,c+.4);const p=this.ctx.createGain();p.gain.value=.35;const _=this.ctx.createWaveShaper(),g=new Float32Array(256);for(let m=0;m<256;m++){const M=m*2/256-1;g[m]=(Math.PI+180)*M/(Math.PI+180*Math.abs(M))}if(_.curve=g,_.oversample="2x",d.connect(_),u.connect(p),p.connect(_),_.connect(f),f.connect(h),h.connect(this.masterVolume),this.reverbNode&&t<900){const m=this.ctx.createGain();m.gain.value=Math.max(0,.4*(1-t/900)),h.connect(m),m.connect(this.reverbNode)}d.start(c),u.start(c),d.stop(c+.45),u.stop(c+.45),i.nodes.push(d,u,h,f)};n(),i.intervalId=setInterval(n,600)}stopAlarmForTask(e){const t=this.taskAlarms.get(e);t&&(t.active=!1,t.intervalId!==null&&clearInterval(t.intervalId),t.nodes.forEach(i=>{try{i.stop&&i.stop()}catch{}}),this.taskAlarms.delete(e))}stopAllAlarms(){this.taskAlarms.forEach((e,t)=>this.stopAlarmForTask(t)),this.taskAlarms.clear()}playBearMusic(){this.bearMusic||(this.bearMusic=new Audio("/bear.mp3"),this.bearMusic.loop=!0),this.bearMusic.volume=this.volume*.3,this.bearMusic.paused&&(this.bearMusic.currentTime=0,this.bearMusic.play().catch(e=>console.warn("Error playing bear music:",e)))}stopBearMusic(){this.bearMusic&&(this.bearMusic.pause(),this.bearMusic.currentTime=0)}playHighBeep(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(2e3,e),t.frequency.exponentialRampToValueAtTime(3e3,e+.15),i.gain.setValueAtTime(.2,e),i.gain.exponentialRampToValueAtTime(.001,e+.2),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.22)}}class hx{constructor(e,t,i,n,a,r,o){this.socket=e,this.localPlayer=t,this.opponent=i,this.map=n,this.particles=a,this.sound=r,this.engine=o,this.opponentStateBuffers=new Map,this.interpolationDelay=100,this.lastSentTime=0,this.sendInterval=1e3/60,window.AppSocket=this.socket,this.socket&&this.setupListeners()}setupListeners(){this.socket.on("opponent-state",e=>{if(!e.id)return;const t=this.engine.remotePlayers.get(e.id);if(!t)return;e.justDashed&&(t.justDashed=!0),e.droppedItem&&this.engine.spawnItemAt(e.droppedItem.x,e.droppedItem.y,e.droppedItem.type,e.droppedItem.id),e.health!==void 0&&(t.health=e.health);let i=this.opponentStateBuffers.get(e.id);i||(i=[],this.opponentStateBuffers.set(e.id,i)),i.push({time:Date.now(),x:e.x,y:e.y,angle:e.angle,vx:e.vx,vy:e.vy,health:e.health,weaponKey:e.weaponKey,isReloading:e.isReloading,muzzleFlash:e.muzzleFlash,flashlightActive:e.flashlightActive,inVent:e.inVent||!1}),i.length>30&&i.shift()}),this.socket.on("opponent-shoot",e=>{const t=this.engine.remotePlayers.get(e.playerId);if(t){if(t.muzzleFlash=1,t.angle=e.angle,this.particles.spawnGunCasing(t.x,t.y,t.angle,e.weaponKey),this.sound){const i=Math.hypot(t.x-this.localPlayer.x,t.y-this.localPlayer.y);this.sound.playGunshot(e.weaponKey,i)}this.engine.spawnBulletFromNetwork(e)}}),this.socket.on("damage-taken",e=>{if(this.engine.gameState==="playing"&&e.targetId===this.localPlayer.id){this.localPlayer.takeDamage(e.damage,this.sound);const i=this.engine.devCheatActive?Math.round(this.localPlayer.health/2):this.localPlayer.health;this.socket.emit("sync-health",{playerId:this.localPlayer.id,health:i}),this.engine.shakeCamera(e.damage*.45),this.engine.players.some(a=>a.health>0&&a.team===this.localPlayer.team)||this.socket.emit("player-died",{winnerId:e.shooterId,winnerName:"Opponents",loserId:this.localPlayer.id,roundNumber:this.engine.roundNumber})}}),this.socket.on("opponent-health-sync",e=>{const t=this.engine.remotePlayers.get(e.playerId);t&&(t.health=e.health)}),this.socket.on("opponent-break-crate",e=>{this.map.syncBreakCrate(e.crateId,e.spawnedItem),this.sound&&this.sound.playCrateBreak(),this.particles.spawnCrateSplinters(e.crateX||0,e.crateY||0)}),this.socket.on("opponent-pickup-item",e=>{const t=this.map.items.find(i=>i.id===e.itemId);t&&(t.active=!1,this.sound&&this.sound.playPickup())}),this.socket.on("opponent-sabotage-alarm",e=>{if(this.engine&&this.engine.tasks){const t=this.engine.tasks[e.idx];if(t&&(t.status="completed",t.alarmActive=!0,t.alarmTimer=15,this.sound)){const i=Math.hypot(this.localPlayer.x-t.x,this.localPlayer.y-t.y);try{this.sound.playAlarmForTask(t.id,i)}catch{}}}}),this.socket.on("opponent-chat",e=>{let t=e.name;const i=this.engine.remotePlayers.get(e.id);i&&(t=i.name);const n=new CustomEvent("opponent-chat-msg",{detail:{name:t,msg:e.msg}});window.dispatchEvent(n)}),this.socket.on("round-over",e=>{this.engine.handleServerRoundOver(e)}),this.socket.on("match-over",e=>{this.engine.handleServerMatchOver(e)})}sendState(e){if(this.socket&&e-this.lastSentTime>=this.sendInterval){this.lastSentTime=e;const i=this.engine.devCheatActive?Math.round(this.localPlayer.health/2):this.localPlayer.health,n={x:this.localPlayer.x,y:this.localPlayer.y,angle:this.localPlayer.angle,vx:this.localPlayer.vx,vy:this.localPlayer.vy,health:i,weaponKey:this.localPlayer.weaponKey,isReloading:this.localPlayer.isReloading,muzzleFlash:this.localPlayer.muzzleFlash,flashlightActive:this.localPlayer.flashlightActive,inVent:this.localPlayer.inVent||!1,justDashed:this.localPlayer.networkJustDashed||!1,droppedItem:this.localPlayer.networkDroppedItem||null};this.localPlayer.networkJustDashed=!1,this.localPlayer.networkDroppedItem=null,this.socket.emit("player-state",n)}}sendShoot(e){this.socket&&this.socket.emit("shoot",e)}interpolateOpponents(){const e=Date.now();this.lastInterpolateTime||(this.lastInterpolateTime=e);const t=e-this.lastInterpolateTime;this.lastInterpolateTime=e;const n=Math.max(1,Math.min(100,t))/16.67;this.engine.remotePlayers.forEach((a,r)=>{const o=this.opponentStateBuffers.get(r);if(!a||!o||o.length===0)return;const c=Date.now()-this.interpolationDelay;let h=null,f=null;for(let d=0;d<o.length;d++){const u=o[d];if(u.time<=c)h=u;else{f=u;break}}if(h&&f){const d=f.time-h.time,u=d>0?(c-h.time)/d:0;a.x=h.x+(f.x-h.x)*u,a.y=h.y+(f.y-h.y)*u,a.angle=this.lerpAngle(h.angle,f.angle,u),a.vx=h.vx+(f.vx-h.vx)*u,a.vy=h.vy+(f.vy-h.vy)*u,a.weaponKey=h.weaponKey,a.isReloading=h.isReloading,a.muzzleFlash=h.muzzleFlash,a.flashlightActive=h.flashlightActive,a.inVent=h.inVent||!1}else{const d=o[o.length-1],p=1-Math.pow(1-.25,n);a.x+=(d.x-a.x)*p,a.y+=(d.y-a.y)*p,a.angle=this.lerpAngle(a.angle,d.angle,p),a.vx=d.vx,a.vy=d.vy,a.weaponKey=d.weaponKey,a.isReloading=d.isReloading,a.muzzleFlash=d.muzzleFlash,a.flashlightActive=d.flashlightActive,a.inVent=d.inVent||!1}})}lerpAngle(e,t,i){let n=t-e;for(;n<-Math.PI;)n+=Math.PI*2;for(;n>Math.PI;)n-=Math.PI*2;return e+n*i}destroy(){this.socket&&(this.socket.off("opponent-state"),this.socket.off("opponent-shoot"),this.socket.off("damage-taken"),this.socket.off("opponent-health-sync"),this.socket.off("opponent-break-crate"),this.socket.off("opponent-pickup-item"),this.socket.off("opponent-sabotage-alarm"),this.socket.off("opponent-chat"),this.socket.off("round-over"),this.socket.off("match-over"))}}const dx=26,fx=18,$t=1e-6,gh=new WeakMap,sl=Object.freeze([{dx:1,dy:0,cost:1,bit:1},{dx:-1,dy:0,cost:1,bit:2},{dx:0,dy:1,cost:1,bit:4},{dx:0,dy:-1,cost:1,bit:8}]),gd=Object.freeze([{dx:1,dy:1,cost:Math.SQRT2,bit:16},{dx:-1,dy:1,cost:Math.SQRT2,bit:32},{dx:1,dy:-1,cost:Math.SQRT2,bit:64},{dx:-1,dy:-1,cost:Math.SQRT2,bit:128}]),ux=Object.freeze([...sl,...gd]);function Yi(s,e,t){return Math.max(e,Math.min(t,Number(s)||0))}function qe(s,e=0){const t=Number(s);return Number.isFinite(t)?t:e}function Jr(s){let e=0,t=s&255;for(;t;)t&=t-1,e++;return e}function al(s,e,t,i){const n=Yi(s,i.x,i.x+i.w),a=Yi(e,i.y,i.y+i.h),r=s-n,o=e-a;return r*r+o*o<t*t-$t}function px(s,e,t,i,n,a){const r=n.x-a,o=n.x+n.w+a,l=n.y-a,c=n.y+n.h+a,h=t-s,f=i-e;let d=0,u=1;const p=(_,g)=>{if(Math.abs(g)<$t)return _<=0;const m=_/g;if(g>0){if(m>u)return!1;m>d&&(d=m)}else{if(m<d)return!1;m<u&&(u=m)}return!0};return p(r-s,h)&&p(s-o,-h)&&p(l-e,f)&&p(e-c,-f)&&d<=u}function mx(s){if(s.length===0)return[];const e=s.map(([i,n])=>[Math.min(i,n),Math.max(i,n)]).sort((i,n)=>i[0]-n[0]||i[1]-n[1]),t=[e[0].slice()];for(let i=1;i<e.length;i++){const n=e[i],a=t[t.length-1];n[0]<=a[1]+$t?a[1]=Math.max(a[1],n[1]):t.push(n.slice())}return t}function gx(s,e,t){let i=2166136261;for(const n of[Math.round(s*10),Math.round(e*10),t|0])i^=n,i=Math.imul(i,16777619);return(i>>>0)/4294967296}function yd(s,e,t,i,n,a){const r=n-t,o=a-i,l=r*r+o*o;if(l<$t)return Math.hypot(s-t,e-i);const c=Yi(((s-t)*r+(e-i)*o)/l,0,1);return Math.hypot(s-(t+r*c),e-(i+o*c))}function yx(s,e,t,i,n,a){return px(s,e,t,i,a,0)||al(s,e,n,a)||al(t,i,n,a)?!0:[[a.x,a.y],[a.x+a.w,a.y],[a.x+a.w,a.y+a.h],[a.x,a.y+a.h]].some(([o,l])=>yd(o,l,s,e,t,i)<n-$t)}class Bs{constructor(){this.values=[]}get size(){return this.values.length}push(e){const t=this.values;t.push(e);let i=t.length-1;for(;i>0;){const n=i-1>>1;if(!Bs.before(t[i],t[n]))break;[t[i],t[n]]=[t[n],t[i]],i=n}}pop(){const e=this.values;if(e.length===0)return null;const t=e[0],i=e.pop();if(e.length>0){e[0]=i;let n=0;for(;;){const a=n*2+1,r=a+1;let o=n;if(a<e.length&&Bs.before(e[a],e[o])&&(o=a),r<e.length&&Bs.before(e[r],e[o])&&(o=r),o===n)break;[e[n],e[o]]=[e[o],e[n]],n=o}}return t}static before(e,t){return e.f<t.f||e.f===t.f&&(e.h<t.h||e.h===t.h&&e.index<t.index)}}class xx{constructor(e,t=[],i={}){if(!e)throw new TypeError("BotNavigation requires a map");this.map=e,this.cellSize=Yi(i.cellSize||dx,24,28),this.agentRadius=Math.max(1,qe(i.agentRadius,fx)),this.obstacleRevision=-1,this.cols=0,this.rows=0,this.walkable=new Uint8Array(0),this.components=new Int32Array(0),this.neighborMask=new Uint8Array(0),this.componentCount=0,this.rooms=[],this.connections=[],this.doorways=[],this.deadEnds=[],this.deadEndRooms=[],this.spawns=[],this.safePatrolPoints=[],this.coverCandidates=[],this._spawnInputs=[],this.sync(t)}sync(e=this._spawnInputs){Array.isArray(e)&&(this._spawnInputs=e.map(i=>({...i})));const t=Number.isFinite(this.map.navigationRevision)?this.map.navigationRevision:0;return(t!==this.obstacleRevision||this.cols!==Math.ceil(this.map.width/this.cellSize)||this.rows!==Math.ceil(this.map.height/this.cellSize))&&(this.obstacleRevision=t,this._rebuild()),this._syncSpawns(),this}isPointClear(e,t,i=this.agentRadius){return this._ensureCurrent(),this._pointClear(qe(e),qe(t),Math.max(0,qe(i,this.agentRadius)))}hasClearPath(e,t,i,n,a=this.agentRadius){return this._ensureCurrent(),this._segmentClear(qe(e),qe(t),qe(i),qe(n),Math.max(0,qe(a,this.agentRadius)))}projectPoint(e,t,i=this.agentRadius){return this._ensureCurrent(),this._projectPointInternal(qe(e),qe(t),Math.max(0,qe(i,this.agentRadius)))}findPath(e,t,i,n,a={}){this._ensureCurrent();const r=Math.max(0,qe(a.radius,this.agentRadius)),o=this._normalizeAvoidPoints(a.avoidPoints,a.avoidRadius,a.avoidWeight),l=this._projectPointInternal(qe(e),qe(t),r);if(!l)return[];const c=this._projectPointInternal(qe(i),qe(n),r,l.component);if(!c||l.component!==c.component)return[];if(this._segmentClear(l.x,l.y,c.x,c.y,r)&&!this._segmentTouchesAvoidance(l.x,l.y,c.x,c.y,o))return this._dedupePath([l,c]);const h=this.walkable.length,f=new Float64Array(h);f.fill(Number.POSITIVE_INFINITY);const d=new Int32Array(h);d.fill(-1);const u=new Uint8Array(h),p=new Bs;f[l.index]=0;const _=this._heuristic(l.index,c.index);p.push({index:l.index,f:_,h:_});const g=Math.max(1,Math.floor(qe(a.maxIterations,h*4)));let m=0,M=!1;const v=r<=this.agentRadius+$t;for(;p.size>0&&m++<g;){const P=p.pop();if(!P||u[P.index])continue;if(P.index===c.index){M=!0;break}u[P.index]=1;const C=P.index%this.cols,L=Math.floor(P.index/this.cols),z=v?this.neighborMask[P.index]:0;for(const B of ux){if(v&&!(z&B.bit))continue;const I=C+B.dx,U=L+B.dy;if(!v&&!this._cellInBounds(I,U))continue;const N=this._index(I,U);if(u[N])continue;if(!v){if(!this._cellWalkable(N,r))continue;if(B.dx!==0&&B.dy!==0){const ae=this._index(C+B.dx,L),Te=this._index(C,L+B.dy);if(!this._cellWalkable(ae,r)||!this._cellWalkable(Te,r))continue}const G=this._pointForIndex(P.index),ee=this._pointForIndex(N);if(!this._segmentClear(G.x,G.y,ee.x,ee.y,r))continue}const $=this._avoidanceCost(N,o);if(!Number.isFinite($))continue;const te=f[P.index]+B.cost+$;if(te+$t>=f[N])continue;f[N]=te,d[N]=P.index;const se=this._heuristic(N,c.index);p.push({index:N,f:te+se,h:se})}}if(!M)return[];const x=[];let y=c.index;for(;y!==-1&&(x.push(y),y!==l.index);)y=d[y];if(x[x.length-1]!==l.index)return[];x.reverse();const E=[l];for(let P=1;P<x.length-1;P++)E.push(this._pointForIndex(x[P]));E.push(c);const A=a.smooth===!1?E:this._smoothPath(E,r,o),S=this._dedupePath(A);if(this._pathClear(S,r))return S;const w=this._dedupePath(E);return this._pathClear(w,r)?w:[]}choosePatrolPoint(e,t,i){this._ensureCurrent();const n=this._projectPointInternal(qe(e),qe(t),this.agentRadius);if(!n)return null;let a=this.safePatrolPoints.filter(c=>c.component===n.component);const r=a.filter(c=>Math.hypot(c.x-n.x,c.y-n.y)>=this.cellSize*2);if(r.length>0&&(a=r),a.length===0)return{...n};const o=typeof i=="function"?qe(i(),0):Number.isFinite(Number(i))?Number(i):gx(n.x,n.y,this.obstacleRevision),l=Math.min(a.length-1,Math.floor(Yi(o,0,.999999999)*a.length));return{...a[l]}}findCoverPoint(e,t,i,n,a={}){this._ensureCurrent();const r=Math.max(0,qe(a.radius,this.agentRadius)),o=this._projectPointInternal(qe(e),qe(t),r);if(!o)return null;const l=Math.max(this.cellSize,qe(a.maxDistance,650)),c=Math.max(0,qe(a.minThreatDistance,60)),h=Math.max(0,qe(a.preferredDistance,180)),f=a.claimed||[],d=Math.max(0,qe(a.claimRadius,this.cellSize*1.5)),u=[];for(const p of this.coverCandidates){if(p.component!==o.component||!this._pointClear(p.x,p.y,r)||this._coverClaimed(p,f,d))continue;const _=Math.hypot(p.x-o.x,p.y-o.y);if(_>l)continue;const g=Math.hypot(p.x-i,p.y-n);if(g<c)continue;const m=this.map.getLineIntersection({x:qe(i),y:qe(n)},{x:p.x,y:p.y});if(!m||m.dist>=g-Math.max(2,r*.35))continue;const M=_+Math.abs(g-h)*.18;u.push({candidate:p,score:M})}u.sort((p,_)=>p.score-_.score||p.candidate.index-_.candidate.index);for(const p of u.slice(0,16)){const _=this.findPath(o.x,o.y,p.candidate.x,p.candidate.y,{radius:r,smooth:a.smooth!==!1,avoidPoints:a.avoidPoints,avoidRadius:a.avoidRadius,avoidWeight:a.avoidWeight});if(_.length>0)return{...p.candidate,path:_}}return null}snapshot(){return this._ensureCurrent(),{cellSize:this.cellSize,agentRadius:this.agentRadius,cols:this.cols,rows:this.rows,obstacleRevision:this.obstacleRevision,componentCount:this.componentCount,memory:{walkable:this.walkable.slice(),components:this.components.slice(),neighborMask:this.neighborMask.slice()},rooms:this.rooms.map(e=>({...e})),connections:this.connections.map(e=>({...e,rooms:[...e.rooms]})),doorways:this.doorways.map(e=>({...e,rooms:[...e.rooms]})),deadEnds:this.deadEnds.map(e=>({...e})),deadEndRooms:[...this.deadEndRooms],spawns:this.spawns.map(e=>({...e})),safePatrolPoints:this.safePatrolPoints.map(e=>({...e})),coverCandidates:this.coverCandidates.map(e=>({...e}))}}_ensureCurrent(){(Number.isFinite(this.map.navigationRevision)?this.map.navigationRevision:0)!==this.obstacleRevision&&this.sync(this._spawnInputs)}_rebuild(){this.cols=Math.ceil(this.map.width/this.cellSize),this.rows=Math.ceil(this.map.height/this.cellSize);const e=this.cols*this.rows;this.walkable=new Uint8Array(e),this.components=new Int32Array(e),this.components.fill(-1),this.neighborMask=new Uint8Array(e),this.rooms=(this.map.rooms||[]).map((t,i)=>({index:i,x:t.x,y:t.y,w:t.w,h:t.h,name:t.name||`Room ${i+1}`,floor:t.floor||""}));for(let t=0;t<this.rows;t++)for(let i=0;i<this.cols;i++){const n=this._index(i,t),a=this._pointForCell(i,t);this._pointClear(a.x,a.y,this.agentRadius)&&(this.walkable[n]=1)}this._buildComponentsAndNeighbors(),this._inferConnections(),this._buildDeadEnds(),this._buildPatrolPoints(),this._buildCoverCandidates()}_pointClear(e,t,i){if(e<i||t<i||e>this.map.width-i||t>this.map.height-i)return!1;for(const n of this.map.walls||[])if(al(e,t,i,n))return!1;return!0}_segmentClear(e,t,i,n,a){if(!this._pointClear(e,t,a)||!this._pointClear(i,n,a))return!1;for(const r of this.map.walls||[])if(yx(e,t,i,n,a,r))return!1;return!0}_index(e,t){return t*this.cols+e}_cellInBounds(e,t){return e>=0&&t>=0&&e<this.cols&&t<this.rows}_pointForCell(e,t){return{x:Math.min(this.map.width-this.agentRadius,(e+.5)*this.cellSize),y:Math.min(this.map.height-this.agentRadius,(t+.5)*this.cellSize)}}_pointForIndex(e){const t=e%this.cols,i=Math.floor(e/this.cols);return{...this._pointForCell(t,i),index:e,column:t,row:i,component:this.components[e],projected:!0}}_cellWalkable(e,t=this.agentRadius){if(e<0||e>=this.walkable.length||!this.walkable[e])return!1;if(t<=this.agentRadius+$t)return!0;const i=this._pointForIndex(e);return this._pointClear(i.x,i.y,t)}_locateWalkableCell(e,t,i,n=null){const a=Yi(Math.floor(e/this.cellSize),0,this.cols-1),r=Yi(Math.floor(t/this.cellSize),0,this.rows-1),o=this._index(a,r);if(this._cellWalkable(o,i)&&(n==null||this.components[o]===n))return o;let l=-1,c=Number.POSITIVE_INFINITY;for(let h=0;h<this.walkable.length;h++){if(!this._cellWalkable(h,i)||n!=null&&this.components[h]!==n)continue;const f=this._pointForIndex(h),d=(f.x-e)**2+(f.y-t)**2;(d<c-$t||Math.abs(d-c)<=$t&&h<l)&&(c=d,l=h)}return l}_projectPointInternal(e,t,i,n=null){const a=this._pointClear(e,t,i),r=this._locateWalkableCell(e,t,i,n);if(r===-1)return null;const o=this._pointForIndex(r),l=Yi(Math.floor(e/this.cellSize),0,this.cols-1),c=Yi(Math.floor(t/this.cellSize),0,this.rows-1),h=this._index(l,c);return a&&r===h&&(n==null||o.component===n)&&this._segmentClear(o.x,o.y,e,t,i)?{...o,x:e,y:t,projected:!1}:{...o,projected:!0}}_buildComponentsAndNeighbors(){let e=0;const t=new Int32Array(this.walkable.length);for(let i=0;i<this.walkable.length;i++){if(!this.walkable[i]||this.components[i]!==-1)continue;let n=0,a=0;for(t[a++]=i,this.components[i]=e;n<a;){const r=t[n++],o=r%this.cols,l=Math.floor(r/this.cols),c=this._pointForIndex(r);for(const h of sl){const f=o+h.dx,d=l+h.dy;if(!this._cellInBounds(f,d))continue;const u=this._index(f,d);if(!this.walkable[u]||this.components[u]!==-1)continue;const p=this._pointForIndex(u);this._segmentClear(c.x,c.y,p.x,p.y,this.agentRadius)&&(this.components[u]=e,t[a++]=u)}}e++}this.componentCount=e;for(let i=0;i<this.walkable.length;i++){if(!this.walkable[i])continue;const n=i%this.cols,a=Math.floor(i/this.cols);let r=0;for(const o of sl){const l=n+o.dx,c=a+o.dy;if(!this._cellInBounds(l,c))continue;const h=this._index(l,c);if(this.walkable[h]){const f=this._pointForIndex(i),d=this._pointForIndex(h);this._segmentClear(f.x,f.y,d.x,d.y,this.agentRadius)&&(r|=o.bit)}}for(const o of gd){const l=n+o.dx,c=a+o.dy;if(!this._cellInBounds(l,c))continue;const h=this._index(l,c),f=this._index(n+o.dx,a),d=this._index(n,a+o.dy);if(this.walkable[h]&&this.walkable[f]&&this.walkable[d]){const u=this._pointForIndex(i),p=this._pointForIndex(h);this._segmentClear(u.x,u.y,p.x,p.y,this.agentRadius)&&(r|=o.bit)}}this.neighborMask[i]=r}}_inferConnections(){this.connections=[],this.doorways=[];const e=this.cellSize*1.5;for(let t=0;t<this.rooms.length;t++)for(let i=t+1;i<this.rooms.length;i++){const n=this.rooms[t],a=this.rooms[i];let r="",o=0,l=0,c=0,h=0,f=n,d=a;const u=n.x+n.w,p=a.x+a.w,_=n.y+n.h,g=a.y+a.h,m=Math.max(n.y,a.y),M=Math.min(_,g),v=Math.max(n.x,a.x),x=Math.min(u,p);if(M>m&&(u<=a.x&&a.x-u<=e?(r="vertical",o=u,l=a.x,c=m,h=M):p<=n.x&&n.x-p<=e&&(r="vertical",o=p,l=n.x,c=m,h=M,f=a,d=n)),!r&&x>v&&(_<=a.y&&a.y-_<=e?(r="horizontal",o=_,l=a.y,c=v,h=x):g<=n.y&&n.y-g<=e&&(r="horizontal",o=g,l=n.y,c=v,h=x,f=a,d=n)),!r)continue;const y=(o+l)*.5,E=[];for(const P of this.map.walls||[])if(P.material==="interior")if(r==="vertical"){if(y<P.x-$t||y>P.x+P.w+$t)continue;const C=Math.max(c,P.y),L=Math.min(h,P.y+P.h);L>C&&E.push([C,L])}else{if(y<P.y-$t||y>P.y+P.h+$t)continue;const C=Math.max(c,P.x),L=Math.min(h,P.x+P.w);L>C&&E.push([C,L])}const A=mx(E),S=[];let w=c;for(const[P,C]of A)P-w>=this.agentRadius*2+2&&S.push([w,P]),w=Math.max(w,C);h-w>=this.agentRadius*2+2&&S.push([w,h]);for(const[P,C]of S){const L=r==="vertical"?{x:y,y:(P+C)*.5}:{x:(P+C)*.5,y},z=this.agentRadius+3,B=r==="vertical"?{x:f.x+f.w-z,y:L.y}:{x:L.x,y:f.y+f.h-z},I=r==="vertical"?{x:d.x+z,y:L.y}:{x:L.x,y:d.y+z},U=this._pointClear(L.x,L.y,this.agentRadius)&&this._segmentClear(B.x,B.y,I.x,I.y,this.agentRadius),N={id:`door-${t}-${i}-${this.doorways.length}`,rooms:[t,i],orientation:r,x:L.x,y:L.y,width:C-P,thickness:l-o,gapStart:P,gapEnd:C,traversable:U,blocked:!U};this.doorways.push(N),this.connections.push({...N})}}}_buildDeadEnds(){this.deadEnds=[];for(let t=0;t<this.walkable.length;t++){if(!this.walkable[t])continue;const i=this.neighborMask[t]&15;Jr(i)<=1&&this.deadEnds.push(this._pointForIndex(t))}const e=new Uint8Array(this.rooms.length);for(const t of this.connections)t.traversable&&(e[t.rooms[0]]++,e[t.rooms[1]]++);this.deadEndRooms=[...e].map((t,i)=>({degree:t,index:i})).filter(({degree:t})=>t<=1).map(({index:t})=>t)}_buildPatrolPoints(){this.safePatrolPoints=[];for(const e of this.rooms){const t=[];for(let n=0;n<this.walkable.length;n++){if(!this.walkable[n]||Jr(this.neighborMask[n])<5)continue;const a=this._pointForIndex(n);if(a.x<e.x+this.agentRadius||a.x>e.x+e.w-this.agentRadius||a.y<e.y+this.agentRadius||a.y>e.y+e.h-this.agentRadius)continue;const r=Math.hypot(a.x-(e.x+e.w*.5),a.y-(e.y+e.h*.5));t.push({...a,roomIndex:e.index,centerDistance:r})}t.sort((n,a)=>n.centerDistance-a.centerDistance||n.index-a.index);const i=[];for(const n of t){if(i.every(a=>Math.hypot(a.x-n.x,a.y-n.y)>=this.cellSize*2.5)){const{centerDistance:a,...r}=n;i.push(r)}if(i.length>=6)break}if(i.length===0){const n=this._projectPointInternal(e.x+e.w*.5,e.y+e.h*.5,this.agentRadius);n&&i.push({...n,roomIndex:e.index})}this.safePatrolPoints.push(...i)}}_buildCoverCandidates(){const e=new Set,t=[],i=this.agentRadius+7;for(let n=0;n<(this.map.walls||[]).length;n++){const a=this.map.walls[n];for(const r of[.25,.5,.75]){const o=a.x+a.w*r,l=a.y+a.h*r,c=[{x:o,y:a.y-i,side:"north"},{x:o,y:a.y+a.h+i,side:"south"},{x:a.x-i,y:l,side:"west"},{x:a.x+a.w+i,y:l,side:"east"}];for(const h of c){if(!this._pointClear(h.x,h.y,this.agentRadius))continue;const f=this._locateWalkableCell(h.x,h.y,this.agentRadius);if(f===-1||e.has(f)||Jr(this.neighborMask[f])<3)continue;e.add(f);const d=this._pointForIndex(f);if(t.push({...d,wallIndex:n,wallType:a.type||"wall",material:a.material||"",side:h.side}),t.length>=640)break}if(t.length>=640)break}if(t.length>=640)break}this.coverCandidates=t}_syncSpawns(){this.spawns=[];for(let e=0;e<this._spawnInputs.length;e++){const t=this._spawnInputs[e]||{},i=this._projectPointInternal(qe(t.x),qe(t.y),this.agentRadius);i&&this.spawns.push({...t,index:t.index??e,x:i.x,y:i.y,cellIndex:i.index,component:i.component,projected:i.projected})}}_heuristic(e,t){const i=e%this.cols,n=Math.floor(e/this.cols),a=t%this.cols,r=Math.floor(t/this.cols),o=Math.abs(i-a),l=Math.abs(n-r);return Math.max(o,l)+(Math.SQRT2-1)*Math.min(o,l)}_smoothPath(e,t,i=[]){if(e.length<=2)return e;const n=[e[0]];let a=0;for(;a<e.length-1;){let r=a+1;for(let o=e.length-1;o>a+1;o--)if(this._segmentClear(e[a].x,e[a].y,e[o].x,e[o].y,t)&&!this._segmentTouchesAvoidance(e[a].x,e[a].y,e[o].x,e[o].y,i)){r=o;break}n.push(e[r]),a=r}return n}_dedupePath(e){const t=[];for(const i of e){const n=t[t.length-1];n&&Math.hypot(n.x-i.x,n.y-i.y)<$t||t.push({...i})}return t}_pathClear(e,t){for(let i=1;i<e.length;i++)if(!this._segmentClear(e[i-1].x,e[i-1].y,e[i].x,e[i].y,t))return!1;return!0}_normalizeAvoidPoints(e,t,i){if(!Array.isArray(e))return[];const n=Math.max(1,qe(t,this.cellSize*1.35)),a=Math.max(0,qe(i,12));return e.filter(r=>r&&Number.isFinite(Number(r.x))&&Number.isFinite(Number(r.y))).map(r=>({x:Number(r.x),y:Number(r.y),radius:Math.max(1,qe(r.radius,n)),weight:Math.max(0,qe(r.weight,a)),hard:r.hard===!0}))}_avoidanceCost(e,t){if(t.length===0)return 0;const i=this._pointForIndex(e);let n=0;for(const a of t){const r=Math.hypot(i.x-a.x,i.y-a.y);if(!(r>=a.radius)){if(a.hard)return Number.POSITIVE_INFINITY;n+=(1-r/a.radius)*a.weight}}return n}_segmentTouchesAvoidance(e,t,i,n,a){return a.some(r=>yd(r.x,r.y,e,t,i,n)<r.radius)}_coverClaimed(e,t,i){if(t instanceof Set){if(t.has(e.index)||t.has(String(e.index))||t.has(`${e.x},${e.y}`))return!0;for(const n of t)if(n&&typeof n=="object"&&Number.isFinite(Number(n.x))&&Number.isFinite(Number(n.y))&&Math.hypot(e.x-Number(n.x),e.y-Number(n.y))<i)return!0;return!1}return Array.isArray(t)?t.some(n=>Number(n)===e.index?!0:n&&Number.isFinite(Number(n.x))&&Number.isFinite(Number(n.y))&&Math.hypot(e.x-Number(n.x),e.y-Number(n.y))<i):!1}}function _x(s,e){if(!s||typeof s!="object"&&typeof s!="function")throw new TypeError("getBotNavigation requires a map object");let t=gh.get(s);return t?t.sync(e):(t=new xx(s,e),gh.set(s,t)),t}class yh{constructor(e,t,i,n,a){this.x=e,this.y=t,this.vx=i,this.vy=n,this.throwerId=a,this.radius=6,this.friction=.98,this.bounceFriction=.6,this.timer=1200,this.creationTime=performance.now(),this.active=!0}update(e,t){if(t-this.creationTime>=this.timer){this.active=!1;return}this.vx*=this.friction,this.vy*=this.friction;const n=this.x+this.vx,a=this.y+this.vy,r=e.checkCircleCollision(n,a,this.radius);if(r.x!==n||r.y!==a){const o=e.checkCircleCollision(n,this.y,this.radius),l=e.checkCircleCollision(this.x,a,this.radius);o.x!==n&&(this.vx=-this.vx*this.bounceFriction),l.y!==a&&(this.vy=-this.vy*this.bounceFriction),this.x=r.x,this.y=r.y}else this.x=n,this.y=a}draw(e){e.save(),e.beginPath(),e.arc(this.x,this.y,this.radius,0,Math.PI*2),e.fillStyle="#2d332f",e.strokeStyle="#66fcf1",e.lineWidth=1.5,e.fill(),e.stroke(),Math.floor(performance.now()/150)%2===0&&(e.beginPath(),e.arc(this.x,this.y,2,0,Math.PI*2),e.fillStyle="#ff3c3c",e.fill()),e.restore()}}class Al{constructor(e,t){try{this.canvas=document.getElementById(e),this.ctx=this.canvas.getContext("2d"),this.mode=t.mode,this.socket=t.socket,this.isRanked=!!t.isRanked,this.mapWidth=t.mapId==="arena"?900:1400,this.mapHeight=t.mapId==="arena"?900:1400,this.map=new ox(this.mapWidth,this.mapHeight,t.seed,t.mapId),this.sound=new cx,this.sound.setVolume(t.settings.volume!==void 0?t.settings.volume:.5),this.particles=new lx,this.particles.setBloodEnabled(t.settings.blood);let i=!1;const n=t.matchMode||t.mode||"";if(this.matchMode=n,this.qpRenderStyle=t.qpRenderStyle,this.isRanked?n.includes("competitive")&&(i=!0):t.qpRenderStyle==="competitive"&&(i=!0),this.settings={...t.settings},this.matchMode==="sabotage"?(this.settings.performanceMode=!1,this.settings.shadows=!0):i?(this.settings.performanceMode=!0,this.settings.shadows=!1):(this.settings.performanceMode=!1,this.settings.shadows=!0),mn.init().catch(r=>console.warn("[Engine] CharacterRenderer init failed:",r)),window.LocalPlayerId=t.localPlayerId,window.IsOfflineMode=this.mode==="offline",this.spawns=[{x:150,y:150},{x:this.mapWidth-150,y:this.mapHeight-150},{x:150,y:this.mapHeight-150},{x:this.mapWidth-150,y:150}],this.botNavigation=null,this.players=[],this.localPlayer=null,this.remotePlayers=new Map,(t.players||[{id:t.localPlayerId,name:t.localPlayerName,weapon:t.localWeapon,color:t.localColor}]).forEach((r,o)=>{const l=this.spawns[o%this.spawns.length],c=r.id===t.localPlayerId,h=o%2===0?1:2,f=this.mode==="offline"&&!c,d=new rx(r.id,l.x,l.y,r.name,r.weapon||"pistol",r.color||"cyan",c,f);if(d.team=h,c)this.localPlayer=d,this.localPlayerIndex=o;else{const u=t.localPlayerIndex!==void 0?t.localPlayerIndex:0;d.isTeammate=o%2===u%2,this.remotePlayers.set(r.id,d)}this.players.push(d)}),this.botBlackboards=hh(this.players,performance.now()),this.bullets=[],this.grenades=[],this.activeHitmarkers=[],this.floatingNumbers=[],this.replayFrames=[],this.lastSnapshotTime=0,this.devCheatActive=!1,this.vents=[],this.tasks=[],this.activeTask=null,this.ventCooldown=0,this.currentVent=null,this.sweepAngle=0,this.sweepProgress=0,this.network=null,this.mode==="online"&&(this.network=new hx(this.socket,this.localPlayer,null,this.map,this.particles,this.sound,this),this.socket.on("opponent-throw-grenade",r=>{const o=new yh(r.x,r.y,r.vx,r.vy,r.playerId);this.grenades.push(o);const l=Math.hypot(this.localPlayer.x-r.x,this.localPlayer.y-r.y);this.sound.playMetallicClick(0,1500,.08,.2,l)})),window.MatchStats={roundsWon:0,damageDealt:0,shotsFired:0,accuracy:0,hitsRegistered:0},this.onMatchEnd=t.onMatchEnd,this.onKillFeed=t.onKillFeed,this.lastKillTime=0,this.multiKillCount=0,this.combatBanner=null,this.camera={x:this.localPlayer.x,y:this.localPlayer.y,shakeX:0,shakeY:0},this.cameraShake=0,this.zoom=1,this.gameState="warmup",this.roundNumber=1,this.scoreSelf=0,this.scoreOpponent=0,this.countdownTimer=3,this.matchTime=120,this.lastTime=performance.now(),this.roundStartTime=0,this.countdownStart=0,this.matchTimerInterval=null,window.gameEngine=this,this.fpsFrameCount=0,this.fpsLastTick=performance.now(),this.currentFPS=0,this.keys={},this.mouse={x:0,y:0,gameX:0,gameY:0,angle:0,clicked:!1,buttons:{}},this.lastSprintTime=performance.now(),this.sprintTipVisible=!1,this.zone={active:!1,currentRadius:0,targetRadius:0,centerX:this.mapWidth/2,centerY:this.mapHeight/2,shrinkSpeed:0,damage:20,lastDamageTick:0,warnShown:!1},this.zoneTimer=null,this.resizeCanvas(),this.setupControls(),this.startRoundCycle(),this.active=!0,this.loop(),this.localPlayer.updateHUD(),this.updateScoreboardHUD(),this.matchMode==="sabotage"){const r=document.querySelector(".score-display");r&&(r.style.display="none");const o=document.querySelector(".timer-display");o&&(o.style.display="none");const l=document.querySelector(".bars-container.right-aligned");l&&(l.style.display="none");const c=document.querySelector(".opponent-weapon-display");c&&(c.style.display="none");const h=document.querySelector(".ammo-display");h&&(h.style.display="none");const f=document.querySelector(".inventory-display");f&&(f.style.display="none")}this.mode==="offline"&&(window.OnBotShootCallback=r=>{const o=this.players.find(l=>l.id===r.playerId);o&&this.particles.spawnGunCasing(o.x,o.y,o.angle,r.weaponKey),this.spawnBulletFromNetwork(r)})}catch(i){console.error("Engine Constructor Error:",i);try{const n=document.getElementById(e),a=n.getContext("2d");a.fillStyle="rgba(10, 10, 15, 0.95)",a.fillRect(0,0,n.width,n.height),a.fillStyle="#ff3c3c",a.font="bold 20px monospace",a.fillText("TACTICSTRIKE CONSTRUCTOR ERROR DETECTED",20,50),a.fillStyle="#ffffff",a.font="12px monospace";const r=(i.stack||i.toString()).split(`
`);let o=90;r.forEach(l=>{a.fillText(l,20,o),o+=18})}catch{}throw i}}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}setupControls(){this.resizeHandler=()=>this.resizeCanvas(),window.addEventListener("resize",this.resizeHandler),this.keydownHandler=n=>{const a=document.getElementById("chat-input");if(a&&document.activeElement===a)return;if(this.activeMinigame){n.preventDefault(),n.key==="Escape"?this.cancelHackingMinigame():this.handleMinigameKeyPress(n.key.toLowerCase());return}const r=n.key.toLowerCase()==="i",o=n.key==="9";if(r&&this.keys[9]||o&&this.keys.i){this.devCheatActive=!this.devCheatActive,this.devCheatActive&&this.localPlayer?(this.localPlayer.maxHealth=200,this.localPlayer.health=200):this.localPlayer&&(this.localPlayer.maxHealth=100,this.localPlayer.health>100&&(this.localPlayer.health=100));return}if(this.matchMode==="sabotage"&&this.localPlayer&&this.localPlayer.health>0){if(this.localPlayer.inVent&&this.currentVent){if(n.key>="1"&&n.key<="5"){n.preventDefault();const l=parseInt(n.key)-1,c=this.vents[l];if(c&&c.id!==this.currentVent.id){this.localPlayer.x=c.x,this.localPlayer.y=c.y,this.currentVent=c;try{this.sound.playFrictionalScrape(0,.3,.4)}catch{}}}else if(n.key===" "||n.key==="Spacebar"){n.preventDefault(),this.localPlayer.inVent=!1,this.currentVent=null;try{this.sound.playFrictionalScrape(0,.2,.3)}catch{}}return}if(this.activeTask){if(n.key===" "||n.key==="Spacebar"){n.preventDefault();const l=Math.abs(Math.sin(this.sweepAngle));if(l>=.4&&l<=.6){this.sweepProgress=Math.min(100,this.sweepProgress+20);try{this.sound.playMetallicClick(0,2e3,.08,.35)}catch{}if(this.sweepProgress>=100){const c=this.activeTask;c.status="completed",c.alarmActive=!0,c.alarmTimer=15,this.activeTask=null,this.localPlayer.showTextNotification("TASK COMPLETE! 🚨 ALARM TRIGGERED");const h=Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y);try{this.sound.playAlarmForTask(c.id,h)}catch{}if(this.matchMode==="sabotage"&&this.tasks.every(d=>d.status==="completed")){if(this.mode==="offline")this.endRound(1,"tasks completed");else if(this.localPlayer.team===1&&this.socket){const d=this.players.find(u=>u.team===2);d&&this.socket.emit("player-died",{winnerId:this.localPlayer.id,winnerName:this.localPlayer.name,loserId:d.id,roundNumber:this.roundNumber})}}}}else{this.sweepProgress=Math.max(0,this.sweepProgress-10);try{this.sound.playMetallicClick(0,500,.15,.25)}catch{}}}else(n.key==="Escape"||n.key.toLowerCase()==="f")&&this.activeTask&&(this.activeTask.status="pending",this.activeTask=null);return}if(n.key.toLowerCase()==="e"){const l=this.vents.find(c=>Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y)<50);if(l){if(this.ventCooldown>0)this.localPlayer.showTextNotification(`VENT COOLDOWN: ${this.ventCooldown.toFixed(1)}s`);else{this.localPlayer.inVent=!0,this.currentVent=l,this.ventCooldown=10;try{this.sound.playFrictionalScrape(0,.2,.35)}catch{}}return}}if(n.key.toLowerCase()==="f"){const l=this.tasks.find(c=>c.status==="pending"&&Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y)<40);if(l){this.activeTask=l,l.status="doing",this.sweepProgress=0,this.sweepAngle=0;return}}}if(n.key===" "&&n.preventDefault(),this.keys[n.key.toLowerCase()]=!0,n.key.toLowerCase()==="f"&&this.localPlayer&&this.localPlayer.health>0){this.localPlayer.flashlightActive=!this.localPlayer.flashlightActive;try{this.sound.playMetallicClick(0,1800,.05,.15)}catch{}}if(this.localPlayer&&this.localPlayer.health>0){if(n.key.toLowerCase()==="h"&&this.localPlayer.healthPacks>0){this.localPlayer.healthPacks--;const l=this.spawnItemAt(this.localPlayer.x,this.localPlayer.y,"health");this.localPlayer.showTextNotification("DROPPED HEALTH PACK","#ff6ef7"),this.localPlayer.updateHUD(),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:l,x:this.localPlayer.x,y:this.localPlayer.y,type:"health"})}if(n.key.toLowerCase()==="j"&&this.localPlayer.ammoPacks>0){this.localPlayer.ammoPacks--;const l=this.spawnItemAt(this.localPlayer.x,this.localPlayer.y,"ammo");this.localPlayer.showTextNotification("DROPPED AMMO PACK","#ff6ef7"),this.localPlayer.updateHUD(),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:l,x:this.localPlayer.x,y:this.localPlayer.y,type:"ammo"})}}n.key==="1"&&this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(1),n.key==="2"&&this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(2),n.key==="3"&&this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)},this.keyupHandler=n=>{this.keys[n.key.toLowerCase()]=!1},window.addEventListener("keydown",this.keydownHandler),window.addEventListener("keyup",this.keyupHandler),this.mousemoveHandler=n=>{if(this.mouse.x=n.clientX,this.mouse.y=n.clientY,this.firstPersonMode)this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.angle+=n.movementX*.0025);else{const a=this.mouse.x-this.canvas.width/2,r=this.mouse.y-this.canvas.height/2;this.mouse.angle=Math.atan2(r,a)}},this.mousedownHandler=n=>{if(this.mouse.buttons[n.button]=!0,n.button===0){const o=document.getElementById("chat-input");if(o&&document.activeElement===o||n.target.closest("#btn-game-menu")||n.target.closest(".inv-slot")||n.target.closest("button")||n.target.closest("input")||n.target.closest(".inventory-display"))return;this.mouse.clicked=!0,this.firstPersonMode&&(document.pointerLockElement===document.getElementById("game-container")||this.requestPointerLock())}const a=n.button===1,r=n.button===2;(a&&this.mouse.buttons[2]||r&&this.mouse.buttons[1])&&(this.devCheatActive=!this.devCheatActive,this.devCheatActive&&this.localPlayer?(this.localPlayer.maxHealth=200,this.localPlayer.health=200):this.localPlayer&&(this.localPlayer.maxHealth=100,this.localPlayer.health>100&&(this.localPlayer.health=100)))},this.mouseupHandler=n=>{this.mouse.buttons[n.button]=!1,n.button===0&&(this.mouse.clicked=!1)},this.wheelHandler=n=>{const a=document.getElementById("chat-input");a&&document.activeElement===a||this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)},window.addEventListener("mousemove",this.mousemoveHandler),window.addEventListener("mousedown",this.mousedownHandler),window.addEventListener("mouseup",this.mouseupHandler),window.addEventListener("wheel",this.wheelHandler,{passive:!0}),this.contextmenuHandler=n=>{n.preventDefault()},window.addEventListener("contextmenu",this.contextmenuHandler),this.invSlot1Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(1)},this.invSlot2Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(2)},this.invSlot3Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)};const e=document.getElementById("inv-slot-1"),t=document.getElementById("inv-slot-2"),i=document.getElementById("inv-slot-3");e&&e.addEventListener("click",this.invSlot1Handler),t&&t.addEventListener("click",this.invSlot2Handler),i&&i.addEventListener("click",this.invSlot3Handler),this.setupGamepad(),this.pointerLockChangeHandler=()=>{const n=document.pointerLockElement===document.getElementById("game-container"),a=this.matchMode&&this.matchMode.startsWith("firstperson");!n&&this.firstPersonMode&&!a&&this.toggleFirstPersonMode()},document.addEventListener("pointerlockchange",this.pointerLockChangeHandler)}setupGamepad(){this._gpState={prevButtons:[],deadzone:.18,aimAngle:0,aimActive:!1,frameCount:0,cachedGP:null}}pollGamepad(){if(!navigator.getGamepads)return;const e=this._gpState;if(e.frameCount++,e.frameCount%2===0){const d=navigator.getGamepads();e.cachedGP=null;for(let u=0;u<d.length;u++)if(d[u]){e.cachedGP=d[u];break}}const t=e.cachedGP;if(!t||!this.localPlayer||this.localPlayer.health<=0)return;const i=e.deadzone,n=d=>t.buttons[d],a=d=>!!(n(d)&&n(d).pressed),r=d=>n(d)?n(d).value:0,o=d=>!!e.prevButtons[d],l=Math.abs(t.axes[0])>i?t.axes[0]:0,c=Math.abs(t.axes[1])>i?t.axes[1]:0;this.keys.w=c<-i,this.keys.s=c>i,this.keys.a=l<-i,this.keys.d=l>i,this.keys.shift=a(10);const h=Math.abs(t.axes[2])>i?t.axes[2]:0,f=Math.abs(t.axes[3])>i?t.axes[3]:0;if(Math.hypot(h,f)>i?(e.aimAngle=Math.atan2(f,h),e.aimActive=!0):e.aimActive=!1,e.aimActive&&(this.mouse.angle=e.aimAngle,this.localPlayer.angle=e.aimAngle),this.mouse.clicked=r(7)>.3,a(4)&&!o(4)&&this.localPlayer.switchSlot(1),a(5)&&!o(5)&&this.localPlayer.switchSlot(2),a(1)&&!o(1)&&(this.keys.r=!0,setTimeout(()=>{this.keys.r=!1},80)),this.keys[" "]=a(0),a(3)&&!o(3)){this.localPlayer.flashlightActive=!this.localPlayer.flashlightActive;try{this.sound.playMetallicClick(0,1800,.05,.15)}catch{}}a(2)&&!o(2)&&this.localPlayer.flashGrenades>0&&(this.localPlayer.throwFlashbangRequest=!0),e.prevButtons=Array.from(t.buttons).map(d=>!!(d&&d.pressed))}toggleFirstPersonMode(){if(this.matchMode&&this.matchMode.startsWith("firstperson")&&this.firstPersonMode){const n=document.getElementById("btn-toggle-fpm");n&&(n.style.display="none");const a=document.getElementById("game-canvas-3d");a&&(a.style.display="block",this.firstPersonController&&this.firstPersonController.onResize()),this.firstPersonController.active=!0,this.requestPointerLock();return}this.firstPersonMode=!this.firstPersonMode;const t=document.getElementById("btn-toggle-fpm"),i=document.getElementById("game-canvas-3d");this.firstPersonMode?(t&&t.classList.add("active"),i&&(i.style.display="block"),this.firstPersonController.active=!0,this.firstPersonController&&this.firstPersonController.onResize(),this.requestPointerLock()):(t&&t.classList.remove("active"),i&&(i.style.display="none"),this.firstPersonController.active=!1,this.exitPointerLock())}requestPointerLock(){const e=document.getElementById("game-container");e&&e.requestPointerLock&&e.requestPointerLock()}exitPointerLock(){document.exitPointerLock&&document.exitPointerLock()}destroy(){this.active=!1,window.removeEventListener("resize",this.resizeHandler),window.removeEventListener("keydown",this.keydownHandler),window.removeEventListener("keyup",this.keyupHandler),window.removeEventListener("mousemove",this.mousemoveHandler),window.removeEventListener("mousedown",this.mousedownHandler),window.removeEventListener("mouseup",this.mouseupHandler),window.removeEventListener("wheel",this.wheelHandler),window.removeEventListener("contextmenu",this.contextmenuHandler);const e=document.getElementById("inv-slot-1"),t=document.getElementById("inv-slot-2"),i=document.getElementById("inv-slot-3");if(e&&this.invSlot1Handler&&e.removeEventListener("click",this.invSlot1Handler),t&&this.invSlot2Handler&&t.removeEventListener("click",this.invSlot2Handler),i&&this.invSlot3Handler&&i.removeEventListener("click",this.invSlot3Handler),this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.zoneTimer&&(clearTimeout(this.zoneTimer),this.zoneTimer=null),this.sound){try{this.sound.stopAllAlarms()}catch{}try{this.sound.stopBearMusic()}catch{}}this.network&&this.network.destroy();const n=document.querySelector(".score-display");n&&(n.style.display="");const a=document.querySelector(".timer-display");a&&(a.style.display="");const r=document.querySelector(".bars-container.right-aligned");r&&(r.style.display="");const o=document.querySelector(".opponent-weapon-display");o&&(o.style.display="");const l=document.querySelector(".ammo-display");l&&(l.style.display="");const c=document.querySelector(".inventory-display");c&&(c.style.display=""),this.socket&&this.socket.off("opponent-throw-grenade"),this.particles.clear(),window.OnBotShootCallback=null,window.AppSocket=null}updateSettings(e){this.sound&&this.sound.setVolume(e.volume),this.particles&&this.particles.setBloodEnabled(e.blood);let t=!1;const i=this.matchMode||this.mode||"";this.isRanked?i.includes("competitive")&&(t=!0):this.qpRenderStyle==="competitive"&&(t=!0),this.settings={...e},this.matchMode==="sabotage"?(this.settings.performanceMode=!1,this.settings.shadows=!0):t?(this.settings.performanceMode=!0,this.settings.shadows=!1):(this.settings.performanceMode=!1,this.settings.shadows=!0)}shakeCamera(e){this.cameraShake=Math.max(this.cameraShake,e)}spawnBulletFromNetwork(e){if(e.pellets&&e.pellets>1)for(let t=0;t<e.pellets;t++)this.bullets.push(new Ma(e));else this.bullets.push(new Ma(e))}startRoundCycle(){if(this.gameState="countdown",this.countdownTimer=3,this.countdownStart=performance.now(),this.map.generateMap(),this.mode==="offline"&&(this.botNavigation=_x(this.map,this.spawns)),this.botBlackboards=hh(this.players,this.countdownStart),this.matchMode==="sabotage"){this.vents=[{id:"vent_a",x:180,y:180,name:"North-West Vent"},{id:"vent_b",x:this.mapWidth-180,y:180,name:"North-East Vent"},{id:"vent_c",x:180,y:this.mapHeight-180,name:"South-West Vent"},{id:"vent_d",x:this.mapWidth-180,y:this.mapHeight-180,name:"South-East Vent"},{id:"vent_e",x:700,y:700,name:"Central Vent"}],this.ventCooldown=0,this.currentVent=null,this.activeTask=null,this.localPlayer&&(this.localPlayer.inVent=!1,this.localPlayer.weaponKey="none");const u=[];for(let m=0;m<9;m++){const M=this.map.rooms[m];M&&u.push({name:M.name||`Section ${m+1}`,x:Math.round(M.x+M.w/2),y:Math.round(M.y+M.h/2)})}u.push({name:"Central Corridors",x:700,y:700});const _=[...u].sort(()=>Math.random()-.5).slice(0,5),g=["Fix Wiring","Calibrate Core","Download Files","Clear Vent Filters","Stabilize Energy Grid","Align Antenna","Unlock Console","Refuel Engine","Inspect Sample","Reset Breakways"];this.tasks=_.map((m,M)=>({id:`task_r${this.roundNumber}_${M}`,x:m.x,y:m.y,name:g[M%g.length]+` in ${m.name}`,rawName:g[M%g.length],progress:0,targetProgress:100,status:"pending",alarmActive:!1,alarmTimer:0}))}this.lastSprintTime=performance.now(),this.sprintTipVisible=!1;const e=document.getElementById("sprint-tip-popup");e&&(e.style.display="none");const t=(this.map.seed||"default_seed")+"_"+this.roundNumber;let i=0;for(let u=0;u<t.length;u++)i=(i<<5)-i+t.charCodeAt(u),i|=0;const n=()=>(i=i*1664525+1013904223|0,(i>>>0)/4294967296),a={1:[this.spawns[0],this.spawns[2]],2:[this.spawns[1],this.spawns[3]]},r=n()<.5?0:1,o=n()<.5?0:1,l=Jy(this.players,a,{1:r,2:o}),c=[],h=new Map;this.players.forEach(u=>{const p=l.get(String(u.id))||this.spawns[0];let _=p;if(this.botNavigation&&(_=Qy(this.botNavigation,p,c,u.radius||18)||this.botNavigation.choosePatrolPoint(p.x,p.y,n)||this.botNavigation.projectPoint(p.x,p.y,u.radius||18)||p),c.push({x:_.x,y:_.y}),u.x=_.x,u.y=_.y,u.vx=0,u.vy=0,u.health=u.isLocal&&this.devCheatActive?200:100,u.ammoInMag=u.weapon.magSize,u.reserveAmmo=u.weapon.magSize*3,u.isReloading=!1,u.floatingText=null,u.isDeadLogged=!1,u.flashGrenades=1,u.flashAlpha=0,u.isBot){const g=h.get(u.team)||0;h.set(u.team,g+1),u.botLaneIndex=g,u.botLaneSign=g%2===0?-1:1,u.resetBotRound(this.map,this.botNavigation)}}),this.bullets=[],this.grenades=[],this.particles.clear(),this.localPlayer.updateHUD(),this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchTime=120;const f=document.getElementById("hud-status");f&&(f.innerText=`ROUND ${this.roundNumber} - COOLDOWN`),this.zoneTimer&&(clearTimeout(this.zoneTimer),this.zoneTimer=null);const d=Math.max(this.mapWidth,this.mapHeight)/2;this.zone.active=!1,this.zone.currentRadius=d*1.05,this.zone.targetRadius=d*1.05,this.zone.centerX=this.mapWidth/2,this.zone.centerY=this.mapHeight/2,this.zone.shrinkSpeed=0,this.zone.lastDamageTick=0,this.zone.warnShown=!1;try{this.sound.playFrictionalScrape(0,.5,.1)}catch{}}startRoundAction(){if(this.gameState="playing",this.roundStartTime=performance.now(),this.matchMode==="sabotage")try{this.sound.playBearMusic()}catch{}const e=document.getElementById("hud-status");e&&(e.innerText="ENGAGE TARGET"),this.matchMode!=="sabotage"&&(this.matchTimerInterval=setInterval(()=>{if(this.gameState==="playing"){this.matchTime--,this.matchTime<=0&&(this.matchTime=0,this.endRound(null,"TIME EXPIRED"));const t=Math.floor(this.matchTime/60).toString().padStart(2,"0"),i=(this.matchTime%60).toString().padStart(2,"0"),n=document.getElementById("game-timer");n&&(n.innerText=`${t}:${i}`)}},1e3)),this.matchMode!=="sabotage"&&(this.zoneTimer&&clearTimeout(this.zoneTimer),this.zoneTimer=setTimeout(()=>{if(this.gameState!=="playing")return;const t=Math.max(this.mapWidth,this.mapHeight)/2;this.zone.active=!0,this.zone.currentRadius=t*1.05,this.zone.targetRadius=t*.12,this.zone.shrinkSpeed=(this.zone.currentRadius-this.zone.targetRadius)/(60*60),this.zone.lastDamageTick=performance.now(),this.zone.centerX=this.mapWidth/2,this.zone.centerY=this.mapHeight/2;const i=document.getElementById("hud-status");i&&(i.innerText="⚠ ZONE CLOSING IN!",i.style.color="#ff3c3c",setTimeout(()=>{this.gameState==="playing"&&i&&(i.innerText="ENGAGE TARGET",i.style.color="")},2500))},4e4))}endRound(e,t=""){if(this.gameState!=="playing")return;if(this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchMode==="sabotage")try{this.sound.stopBearMusic()}catch{}let i=document.getElementById("hud-status");const n=this.localPlayer.team;e===n?(this.scoreSelf++,this.matchMode==="sabotage"&&(this.scoreSelf=3),i&&(i.innerText="ROUND WON",i.style.color="#39ff14")):e!==null?(this.scoreOpponent++,this.matchMode==="sabotage"&&(this.scoreOpponent=3),i&&(i.innerText="ROUND LOST",i.style.color="#ff3c3c")):i&&(i.innerText="ROUND DRAW",i.style.color="#ffd700"),this.updateScoreboardHUD();const a=()=>{this.scoreSelf>=3||this.scoreOpponent>=3?this.endMatch():(this.roundNumber++,this.startRoundCycle())};setTimeout(()=>{this.active&&this.startReplay(a)},0)}endMatch(){this.gameState="match-over",this.active=!1;const e=window.MatchStats.shotsFired||1,t=window.MatchStats.hitsRegistered/e*100;window.MatchStats.accuracy=t,window.MatchStats.roundsWon=this.scoreSelf;const i=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent?this.localPlayer.team:this.localPlayer.team===1?2:1:this.scoreSelf>=3?this.localPlayer.team:this.localPlayer.team===1?2:1,n=this.players.find(c=>c.team===i);window.MatchStats.winnerId=n?n.id:"unknown";const a=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent:this.scoreSelf>=3,r=this.localPlayer.rank?this.localPlayer.rank.label:"";let o=!1,l=0;this.isRanked&&(o=this.localPlayer.applyRankDelta(a?va:Sa),l=a?va:Sa),window.MatchStats.isWin=a,window.MatchStats.newRP=this.localPlayer.rp,window.MatchStats.newRank=this.localPlayer.rank,window.MatchStats.rpDelta=l,window.MatchStats.rankChanged=o,window.MatchStats.oldRankLabel=r,this.scoreSelf>=3?this.sound.playMatchWin():this.sound.playMatchLose(),this.onMatchEnd&&this.onMatchEnd(window.MatchStats)}endGameDueToDisconnect(e){this.gameState="match-over",this.active=!1,alert(e);const t=document.getElementById("btn-return-lobby");t&&t.click()}updateScoreboardHUD(){const e=document.getElementById("score-self");e&&(e.innerText=this.scoreSelf);const t=document.getElementById("score-opponent");t&&(t.innerText=this.scoreOpponent);const i=document.getElementById("hud-self-name");i&&(i.innerText=this.mode==="online"&&this.players.length>2?"YOUR TEAM":this.localPlayer.name.toUpperCase());const n=document.getElementById("hud-opponent-name");n&&(n.innerText=this.players.length>2?"OPPONENTS":"OPPONENT");const a=document.getElementById("hud-opponent-weapon");if(a)if(this.players.length>2)a.innerText="SQUAD LOADOUT";else{const o=this.players.find(l=>l.id!==this.localPlayer.id);a.innerText=o?o.weapon.name.toUpperCase():"UNKNOWN"}const r=document.getElementById("opponent-indicator");r&&(r.className="op-indicator online")}drawErrorOverlay(e){try{this.ctx.restore()}catch{}this.ctx.fillStyle="rgba(10, 10, 15, 0.95)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="#ff3c3c",this.ctx.font="bold 20px monospace",this.ctx.fillText("TACTICSTRIKE RUNTIME ERROR DETECTED",20,50),this.ctx.fillStyle="#ffffff",this.ctx.font="12px monospace";const t=(e.stack||e.toString()).split(`
`);let i=90;t.forEach(n=>{const a=Math.floor((this.canvas.width-40)/7);for(let r=0;r<n.length;r+=a)this.ctx.fillText(n.substring(r,r+a),20,i),i+=18})}loop(){if(!this.active)return;const e=performance.now();if(this.lastTime=e,this.fpsFrameCount++,e-this.fpsLastTick>=1e3){this.currentFPS=Math.round(this.fpsFrameCount*1e3/(e-this.fpsLastTick)),this.fpsFrameCount=0,this.fpsLastTick=e;const t=document.getElementById("fps-counter");t&&this.settings&&this.settings.showFps&&(t.innerText=`FPS: ${this.currentFPS}`)}try{this.update(e),this.render()}catch(t){console.error("Game Loop Crash:",t),this.drawErrorOverlay(t),this.active=!1;return}requestAnimationFrame(()=>this.loop())}triggerHitmarker(e,t,i,n){this.activeHitmarkers.push({x:e,y:t,age:0,duration:200,isHeadshot:!!n}),this.floatingNumbers.push({x:e,y:t-10,damage:i,age:0,duration:800,isHeadshot:!!n})}registerLocalPlayerKill(e){if(e-this.lastKillTime<4e3?this.multiKillCount++:this.multiKillCount=1,this.lastKillTime=e,this.multiKillCount>=2){let t="DOUBLE KILL!";if(this.multiKillCount===3?t="TRIPLE KILL!":this.multiKillCount>3&&(t="RAMPAGE!"),this.combatBanner={text:t,timer:3,scale:2},this.sound)try{this.sound.playHighBeep()}catch(i){console.warn(i)}}}update(e){this.lastUpdateTime||(this.lastUpdateTime=e);const t=e-this.lastUpdateTime;this.lastUpdateTime=e;const i=Math.max(1,Math.min(150,t));if(this.dtFactor=i/16.67,this.combatBanner&&(this.combatBanner.timer-=i/1e3,this.combatBanner.timer<=0&&(this.combatBanner=null)),this.activeMinigame){this.activeMinigame.timer-=i/1e3;const v=document.getElementById("minigame-timer-bar");v&&(v.style.width=`${Math.max(0,this.activeMinigame.timer/4*100)}%`),this.activeMinigame.timer<=0&&this.failHackingMinigame()}let n=null;this.map&&this.map.terminals&&this.localPlayer&&this.localPlayer.health>0&&(n=this.map.terminals.find(v=>!v.hacked&&Math.hypot(this.localPlayer.x-v.x,this.localPlayer.y-v.y)<55));const a=document.getElementById("hud-interaction-prompt");if(n&&this.gameState==="playing"?(a&&(a.style.display="block",a.innerText=this.keys.e?`HACKING... ${Math.round(this.hackingProgress)}%`:"HOLD [E] TO HACK TERMINAL"),this.keys.e&&!this.activeMinigame?(this.localPlayer.vx=0,this.localPlayer.vy=0,this.hackingProgress||(this.hackingProgress=0),this.hackingProgress+=i*.08,this.hackingProgress>=100&&(this.hackingProgress=0,this.startHackingMinigame(n))):this.activeMinigame||(this.hackingProgress=Math.max(0,(this.hackingProgress||0)-i*.1))):(a&&!this.activeMinigame&&(a.style.display="none"),this.hackingProgress=0),this.matchMode==="sabotage"&&(this.ventCooldown>0&&(this.ventCooldown=Math.max(0,this.ventCooldown-i/1e3)),this.activeTask&&(this.sweepAngle+=.06*this.dtFactor),this.tasks.forEach(v=>{if(v.alarmActive){v.alarmTimer-=i/1e3;const x=Math.hypot(this.localPlayer.x-v.x,this.localPlayer.y-v.y);try{this.sound.playAlarmForTask(v.id,x)}catch{}if(v.alarmTimer<=0){v.alarmActive=!1,v.lastBeepTime=0;try{this.sound.stopAlarmForTask(v.id)}catch{}}}else try{this.sound.stopAlarmForTask(v.id)}catch{}})),this.gameState==="replay"){if(this.replayIndex+=this.dtFactor,Math.floor(this.replayIndex)>=this.replayFrames.length&&this.postReplayCallback){const v=this.postReplayCallback;this.postReplayCallback=null,v()}return}if(this.pollGamepad(),this.gameState==="countdown"){const v=(e-this.countdownStart)/1e3,x=3-Math.floor(v);if(x!==this.countdownTimer&&x>=0){this.countdownTimer=x;try{this.sound.playMetallicClick(0,1e3,.05,.2)}catch{}}if(x>0){const y=document.getElementById("hud-status");y&&(y.innerText=`DEPLOYING IN ${x}...`)}else{try{this.sound.playMetallicClick(0,2e3,.15,.35)}catch{}this.startRoundAction()}}if(this.gameState==="playing"||this.gameState==="countdown"){if(this.localPlayer.update(this.keys,this.mouse,this.map,this.sound,e,null,this.localPlayer),this.localPlayer.justDashed&&(this.localPlayer.justDashed=!1,this.particles.spawnDashParticles(this.localPlayer.x,this.localPlayer.y,this.localPlayer.angle,this.localPlayer.colorTheme)),this.mode==="offline"){this.botNavigation&&this.map.navigationRevision!==this.botNavigation.obstacleRevision&&this.botNavigation.sync(this.spawns);const v=new Map,x=new Set(this.players.filter(y=>y.isBot&&y.health>0).map(y=>y.team));for(const y of x){const E=this.players.filter(w=>w.isBot&&w.health>0&&w.team===y),A=this.players.filter(w=>w.health>0&&w.team!==y),S=dh(this.botBlackboards,y);for(const[w,P]of $y(E,A,S,e))v.set(w,P)}this.players.forEach(y=>{if(y.isBot){const E=v.get(String(y.id))||null,A=this.players.filter(S=>S!==y&&S.health>0&&S.team===y.team);y.update(null,null,this.map,this.sound,e,E,this.localPlayer,{navigation:this.botNavigation,blackboard:dh(this.botBlackboards,y.team),teammates:A,laneIndex:y.botLaneIndex||0,combatEnabled:this.gameState==="playing"})}})}else this.network.interpolateOpponents();this.players.forEach(v=>{if(v!==this.localPlayer&&v.justDashed&&(v.justDashed=!1,this.particles.spawnDashParticles(v.x,v.y,v.angle,v.colorTheme),this.sound)){const x=Math.hypot(v.x-this.localPlayer.x,v.y-this.localPlayer.y);this.sound.playDashSound(x)}}),this.localPlayer.checkPickups(this.map,this.sound),this.mode==="offline"&&this.players.forEach(v=>{v.isBot&&v.checkPickups(this.map,this.sound)}),this.players.forEach(v=>{if(this.gameState==="playing"&&v.throwFlashbangRequest&&v.flashGrenades>0){v.throwFlashbangRequest=!1,v.flashGrenades--,v.isLocal&&!v.isBot&&v.updateHUD();const x=11,y=Math.cos(v.angle)*x,E=Math.sin(v.angle)*x,A=new yh(v.x,v.y,y,E,v.id);this.grenades.push(A);try{this.sound.playMetallicClick(0,1500,.08,.2)}catch{}this.mode==="online"&&v.isLocal&&this.socket.emit("throw-grenade",{x:v.x,y:v.y,vx:y,vy:E})}else v.throwFlashbangRequest=!1})}const r=this.devCheatActive&&this.localPlayer.aimbotHasLOS;if(this.gameState==="playing"&&(this.mouse.clicked||r)&&!this.localPlayer.isReloading){const v=this.localPlayer.weapon.type==="Automatic"||r,x=e-this.localPlayer.lastFiredTime;if(v||x>this.localPlayer.weapon.fireRate){const y=this.localPlayer.shoot(e,this.sound);if(y){if(window.MatchStats.shotsFired+=y.pellets||1,this.shakeCamera(y.recoil*.7),this.particles.spawnGunCasing(this.localPlayer.x,this.localPlayer.y,this.localPlayer.angle,this.localPlayer.weaponKey),y.pellets&&y.pellets>1)for(let E=0;E<y.pellets;E++)this.bullets.push(new Ma(y));else this.bullets.push(new Ma(y));this.mode==="online"&&this.network.sendShoot(y),v||(this.mouse.clicked=!1)}}}for(let v=this.bullets.length-1;v>=0;v--){const x=this.bullets[v];x.update(this.map,this.players,this.particles,this.sound,this.dtFactor),x.active||(x.playerId===this.localPlayer.id&&window.MatchStats.hitsRegistered++,this.bullets.splice(v,1))}for(let v=this.grenades.length-1;v>=0;v--){const x=this.grenades[v];if(x.update(this.map,e),!x.active){this.particles.spawnFlashbangBurst(x.x,x.y);const y=Math.hypot(this.localPlayer.x-x.x,this.localPlayer.y-x.y);this.sound.playFlashbangExplosion(y),y<800&&this.shakeCamera(Math.max(1,15*(1-y/800))),this.players.forEach(E=>{if(E.health<=0)return;Math.hypot(E.x-x.x,E.y-x.y)<380&&E.checkLineOfSight(this.map,x.x,x.y,E.x,E.y)&&(E.flashAlpha=1,E.isLocal&&E.updateHUD())}),this.grenades.splice(v,1)}}this.particles.update(this.map);for(let v=this.activeHitmarkers.length-1;v>=0;v--){const x=this.activeHitmarkers[v];x.age+=i,x.age>=x.duration&&this.activeHitmarkers.splice(v,1)}for(let v=this.floatingNumbers.length-1;v>=0;v--){const x=this.floatingNumbers[v];x.age+=i,x.y-=1*this.dtFactor,x.age>=x.duration&&this.floatingNumbers.splice(v,1)}this.players.forEach(v=>{v.health<=0&&!v.isDeadLogged&&(v.isDeadLogged=!0,this.onKillFeed&&this.onKillFeed("Eliminated",v.name,v.weaponKey))});const o=this.players.filter(v=>v.team===this.localPlayer.team),l=o.reduce((v,x)=>{let y=x.health;return x.isLocal&&this.devCheatActive&&(y=Math.round(y/2)),v+y},0)/o.length,c=document.getElementById("hud-self-hp");c&&(c.style.width=`${Math.max(0,l)}%`);const h=document.getElementById("hud-self-hp-text");h&&(h.innerText=Math.round(Math.max(0,l)));const f=this.localPlayer.team===1?2:1,d=this.players.filter(v=>v.team===f),u=d.reduce((v,x)=>v+x.health,0)/d.length,p=document.getElementById("hud-opponent-hp");if(p&&(p.style.width=`${Math.max(0,u)}%`),this.zone.active&&this.gameState==="playing"){this.zone.currentRadius>this.zone.targetRadius&&(this.zone.currentRadius=Math.max(this.zone.targetRadius,this.zone.currentRadius-this.zone.shrinkSpeed*this.dtFactor));const v=e;v-this.zone.lastDamageTick>=1e3&&(this.zone.lastDamageTick=v,this.players.forEach(x=>{if(x.health<=0||this.mode==="online"&&!x.isLocal)return;const y=x.x-this.zone.centerX,E=x.y-this.zone.centerY;if(Math.sqrt(y*y+E*E)>this.zone.currentRadius&&(x.takeDamage(this.zone.damage,this.sound),x.isLocal&&!x.isBot&&(x.showTextNotification&&x.showTextNotification("-20 ZONE DAMAGE"),this.mode==="online"&&this.socket))){const w=this.devCheatActive?Math.round(x.health/2):x.health;this.socket.emit("sync-health",{playerId:x.id,health:w})}}))}if(this.gameState==="playing"){const v=this.players.some(y=>y.health>0&&y.team===1),x=this.players.some(y=>y.health>0&&y.team===2);v&&!x?this.mode==="offline"&&this.endRound(1,"eliminated"):!v&&x?this.mode==="offline"&&this.endRound(2,"eliminated"):!v&&!x&&this.mode==="offline"&&this.endRound(null,"both dead")}this.gameState==="playing"&&this.players.forEach(v=>{if(v.health<=0||v.health>=v.maxHealth)return;const x=this.map.checkZone(v.x,v.y);x&&x.type==="healing"&&(v.health=Math.min(v.maxHealth,v.health+x.healRate),v.isLocal&&!v.isBot&&v.updateHUD())});const _=.25,g=this.localPlayer.x+(this.mouse.x-this.canvas.width/2)*_,m=this.localPlayer.y+(this.mouse.y-this.canvas.height/2)*_,M=1-Math.pow(1-.085,this.dtFactor);if(this.camera.x+=(g-this.camera.x)*M,this.camera.y+=(m-this.camera.y)*M,this.cameraShake>.1?(this.camera.shakeX=(Math.random()-.5)*this.cameraShake,this.camera.shakeY=(Math.random()-.5)*this.cameraShake,this.cameraShake*=Math.pow(.88,this.dtFactor)):(this.camera.shakeX=0,this.camera.shakeY=0,this.cameraShake=0),this.gameState==="playing"){const v=this.keys.shift,x=document.getElementById("sprint-tip-popup");v?(this.lastSprintTime=e,this.sprintTipVisible&&(this.sprintTipVisible=!1,x&&(x.style.display="none"))):this.localPlayer&&(Math.abs(this.localPlayer.vx)>.2||Math.abs(this.localPlayer.vy)>.2)?e-this.lastSprintTime>9e3&&(this.sprintTipVisible||(this.sprintTipVisible=!0,x&&(x.style.display="flex"))):this.lastSprintTime=e}if(this.mode==="online"&&(this.gameState==="playing"||this.gameState==="countdown")&&this.network.sendState(e),this.gameState==="playing"&&e-this.lastSnapshotTime>=1e3/60){this.lastSnapshotTime=e;const v={players:this.players.map(x=>({id:x.id,x:x.x,y:x.y,angle:x.angle,health:x.health,maxHealth:x.maxHealth,weaponKey:x.weaponKey,muzzleFlash:x.muzzleFlash,isLocal:x.isLocal,isBot:x.isBot,isTeammate:x.isTeammate,color:x.colorTheme,name:x.name,flashlightActive:x.flashlightActive,flashAlpha:x.flashAlpha,radius:x.radius})),bullets:this.bullets.map(x=>({x:x.x,y:x.y,prevX:x.prevX,prevY:x.prevY,angle:x.angle,playerId:x.playerId,active:x.active,weaponKey:x.weaponKey})),grenades:this.grenades.map(x=>({x:x.x,y:x.y})),particles:this.particles.particles.map(x=>({x:x.x,y:x.y,type:x.type,angle:x.angle,size:x.size,color:x.color,life:x.life})),decals:this.particles.decals.map(x=>({x:x.x,y:x.y,type:x.type,size:x.size,color:x.color,angle:x.angle,scaleX:x.scaleX,scaleY:x.scaleY})),camera:{x:this.camera.x,y:this.camera.y},brokenLightOn:this.map.ambientLights.brokenCeiling?this.map.ambientLights.brokenCeiling.on:!0};this.replayFrames.push(v),this.replayFrames.length>300&&this.replayFrames.shift()}}startReplay(e){const t=this.players.some(i=>i.health<=0);if(this.replayFrames&&this.replayFrames.length>0&&t){this.gameState="replay",this.replayIndex=0,this.postReplayCallback=e;const i=document.getElementById("hud-status");i&&(i.innerText="● REPLAY / KILLCAM",i.style.color="#ff3c3c")}else e()}drawSnapshotPlayer(e,t){if(this.ctx.save(),t){this.ctx.fillStyle="rgba(180, 0, 0, 0.35)",this.ctx.beginPath(),this.ctx.ellipse(e.x,e.y,26,22,0,0,Math.PI*2),this.ctx.fill(),mn.ready&&(this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle+Math.PI/2),this.ctx.globalAlpha=.55,mn.draw(this.ctx,e.id+"_dead",0,0,0,0,!1,e.isLocal?"blue":"red"),this.ctx.restore()),this.ctx.restore();return}if(this.settings.laser&&e.isLocal&&this.matchMode!=="sabotage"){let c=e.x+Math.cos(e.angle)*1200,h=e.y+Math.sin(e.angle)*1200;const f=this.map.getLineIntersection({x:e.x,y:e.y},{x:c,y:h});f&&(c=f.x,h=f.y),this.ctx.save(),this.ctx.strokeStyle=e.isLocal?"rgba(102, 252, 241, 0.5)":"rgba(255, 60, 60, 0.5)",this.ctx.lineWidth=1.2,this.ctx.beginPath(),this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(c,h),this.ctx.stroke();const d=e.isLocal?"#66fcf1":"#ff3c3c",u=this.ctx.createRadialGradient(c,h,1,c,h,6);u.addColorStop(0,"#ffffff"),u.addColorStop(.3,d),u.addColorStop(1,"rgba(0, 0, 0, 0)"),this.ctx.fillStyle=u,this.ctx.beginPath(),this.ctx.arc(c,h,6,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}const i=e.muzzleFlash>.1;if(!mn.draw(this.ctx,e.id,e.x,e.y,e.angle,0,i,e.isLocal?"blue":"red")){this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle);const l={cyan:{body:"#3ba39f",armor:"#16202c",helmet:"#66fcf1"},green:{body:"#39db14",armor:"#133d07",helmet:"#5eff39"},purple:{body:"#9d3bff",armor:"#20083c",helmet:"#c47aff"},orange:{body:"#ff7f3b",armor:"#3f1b07",helmet:"#ff9d7a"},yellow:{body:"#ffd700",armor:"#3a3000",helmet:"#ffea70"},red:{body:"#ff3c3c",armor:"#3a0707",helmet:"#ff7a7a"}},c=l[e.color]||l[e.isLocal?"cyan":"red"],h=c.body,f=c.armor,d=c.helmet;let u=18,p=4;e.weaponKey==="rifle"&&(u=24,p=5),e.weaponKey==="shotgun"&&(u=22,p=6),e.weaponKey==="sniper"&&(u=32,p=4),e.weaponKey==="smg"&&(u=16,p=4),e.weaponKey==="lmg"&&(u=26,p=7),e.weaponKey==="dmr"&&(u=28,p=5),e.weaponKey==="knife"&&(u=10,p=2),this.ctx.fillStyle="#444",this.ctx.strokeStyle="#000",this.ctx.lineWidth=1,this.ctx.fillRect(10,-p/2,u,p),this.ctx.strokeRect(10,-p/2,u,p),this.ctx.fillStyle=f,this.ctx.strokeStyle="#000",this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.arc(8,-10,5,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.arc(14,6,5,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle=h,this.ctx.beginPath(),this.ctx.ellipse(0,0,18,21,0,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle=f,this.ctx.beginPath(),this.ctx.ellipse(-3,0,14,16,0,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle=d,this.ctx.beginPath(),this.ctx.arc(-2,0,8,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle="#111",this.ctx.fillRect(1,-5,3,10),this.ctx.restore()}this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle),this.ctx.fillStyle=e.weaponKey==="knife"?"#b0b8c0":"#333",this.ctx.strokeStyle="rgba(0,0,0,0.7)",this.ctx.lineWidth=1;let a=18,r=3;if(e.weaponKey==="rifle"&&(a=26,r=4),e.weaponKey==="shotgun"&&(a=22,r=5),e.weaponKey==="sniper"&&(a=36,r=3),e.weaponKey==="smg"&&(a=16,r=3),e.weaponKey==="lmg"&&(a=28,r=5),e.weaponKey==="dmr"&&(a=30,r=4),e.weaponKey==="knife"&&(a=10,r=2),this.ctx.fillRect(12,-r/2,a,r),this.ctx.strokeRect(12,-r/2,a,r),e.muzzleFlash>0){this.ctx.save(),this.ctx.translate(12+a,0);const l=this.ctx.createRadialGradient(0,0,2,0,0,16);l.addColorStop(0,"rgba(255, 255, 255, 1.0)"),l.addColorStop(.3,"rgba(255, 220, 0, 0.9)"),l.addColorStop(.7,"rgba(255, 80, 0, 0.5)"),l.addColorStop(1,"rgba(255, 0, 0, 0.0)"),this.ctx.fillStyle=l,this.ctx.beginPath(),this.ctx.arc(0,0,16,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}this.ctx.restore(),this.ctx.save(),this.ctx.textAlign="center";const o=e.isLocal?"#66fcf1":e.isTeammate?"#39db14":"#ff3c3c";if(this.ctx.fillStyle=o,this.ctx.font="10px Orbitron",this.ctx.fillText(e.name.toUpperCase(),e.x,e.y-30),!e.isLocal&&e.health>0){this.ctx.fillStyle="rgba(0,0,0,0.5)",this.ctx.fillRect(e.x-20,e.y-26,40,4);const l=e.isTeammate?"#39db14":"#ff3c3c";this.ctx.fillStyle=l,this.ctx.fillRect(e.x-20,e.y-26,40*(e.health/e.maxHealth),4)}this.ctx.restore(),this.ctx.restore()}render(){let e=null;if(this.gameState==="replay"){const y=Math.min(this.replayFrames.length-1,Math.floor(this.replayIndex));e=this.replayFrames[y]}if(this.gameState==="replay"&&!e)return;this.ctx.fillStyle="#06070a",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const t=1920,i=1080,n=this.canvas.width/t,a=this.canvas.height/i,r=Math.min(n,a);this.zoom=Math.max(.5,Math.min(1.35,r)),this.ctx.save(),this.ctx.translate(this.canvas.width/2,this.canvas.height/2),this.ctx.scale(this.zoom,this.zoom);const o=e?e.camera.x:this.camera.x,l=e?e.camera.y:this.camera.y,c=e?0:this.camera.shakeX,h=e?0:this.camera.shakeY,f=-o+c,d=-l+h;this.ctx.translate(f,d);const u=e?e.players:this.players,p=e?e.bullets:this.bullets,_=e?e.brokenLightOn:this.map.ambientLights.brokenCeiling?this.map.ambientLights.brokenCeiling.on:!0;this.map.ambientLights.brokenCeiling&&(this.map.ambientLights.brokenCeiling.on=_),u.forEach(y=>{y.health>0&&y.flashlightActive?y.lightPoly=this.map.computeVisibilityPolygon(y.x,y.y,700,y.angle,65*Math.PI/180):y.lightPoly=null}),e?e.decals.forEach(y=>{this.ctx.save(),this.ctx.translate(y.x,y.y),this.ctx.rotate(y.angle),this.ctx.globalAlpha=y.type==="blood"?.75:.9,y.type==="blood"?(this.ctx.fillStyle=y.color,this.ctx.beginPath(),this.ctx.ellipse(0,0,y.size*y.scaleX,y.size*y.scaleY,0,0,Math.PI*2),this.ctx.fill()):y.type==="casing"?(this.ctx.fillStyle="#b5921c",this.ctx.fillRect(-y.size,-y.size/2,y.size*2,y.size)):y.type==="splinter"&&(this.ctx.fillStyle="#6e441c",this.ctx.fillRect(-y.size,-y.size/3,y.size*1.5,y.size*.7)),this.ctx.restore()}):this.particles.drawDecals(this.ctx);const g=e?e.players.find(y=>y.isLocal):this.localPlayer;if(this.map.draw(this.ctx,this.settings,u,g,p),u.forEach(y=>{y.health<=0&&(e?this.drawSnapshotPlayer(y,!0):y.draw(this.ctx))}),u.forEach(y=>{if(y.health<=0)return;let E=!0;if(this.settings.shadows&&g&&g.health>0&&!y.isLocal){const A=g.flashlightActive&&g.lightPoly&&this.isPointInPolygon({x:y.x,y:y.y},g.lightPoly),S=!this.map.getLineIntersection({x:g.x,y:g.y},{x:y.x,y:y.y}),w=this.map.isPointInAmbientLight(y.x,y.y,y.radius||18);E=A||y.isTeammate||y.flashlightActive&&S||w&&S}E&&(e?this.drawSnapshotPlayer(y,!1):y.draw(this.ctx,this.settings,this.map))}),g&&g.health>0&&(this.ctx.save(),this.ctx.translate(g.x,g.y),this.ctx.strokeStyle="rgba(102, 252, 241, 0.15)",this.ctx.lineWidth=1,this.ctx.setLineDash([4,8]),this.ctx.beginPath(),this.ctx.arc(0,0,32,Date.now()/1500,Date.now()/1500+Math.PI*2),this.ctx.stroke(),this.ctx.restore()),this.ctx.save(),this.ctx.globalCompositeOperation="lighter",e?(e.bullets.forEach(y=>{if(y.active){if(this.ctx.save(),y.weaponKey==="knife")this.ctx.lineWidth=3.5,this.ctx.lineCap="round",this.ctx.strokeStyle="rgba(230, 235, 255, 0.85)",this.ctx.shadowColor="#66fcf1",this.ctx.shadowBlur=6,this.ctx.beginPath(),this.ctx.arc(y.x,y.y,18,y.angle-.6,y.angle+.6),this.ctx.stroke();else{this.ctx.lineWidth=2.5,this.ctx.lineCap="round";const E=y.playerId===(g==null?void 0:g.id),A=this.ctx.createLinearGradient(y.prevX,y.prevY,y.x,y.y);E?(A.addColorStop(0,"rgba(102, 252, 241, 0.0)"),A.addColorStop(1,"rgba(102, 252, 241, 1.0)"),this.ctx.strokeStyle=A,this.ctx.shadowColor="#66fcf1"):(A.addColorStop(0,"rgba(255, 60, 60, 0.0)"),A.addColorStop(1,"rgba(255, 60, 60, 1.0)"),this.ctx.strokeStyle=A,this.ctx.shadowColor="#ff3c3c"),this.ctx.shadowBlur=4,this.ctx.beginPath(),this.ctx.moveTo(y.prevX,y.prevY),this.ctx.lineTo(y.x,y.y),this.ctx.stroke()}this.ctx.restore()}}),e.particles.forEach(y=>{this.ctx.save(),this.ctx.globalAlpha=Math.max(0,y.life),y.type==="casing"?(this.ctx.translate(y.x,y.y),this.ctx.rotate(y.angle),this.ctx.fillStyle="#d4af37",this.ctx.strokeStyle="#996515",this.ctx.lineWidth=.5,this.ctx.fillRect(-y.size,-y.size/2,y.size*2,y.size),this.ctx.strokeRect(-y.size,-y.size/2,y.size*2,y.size)):y.type==="splinter"?(this.ctx.translate(y.x,y.y),this.ctx.rotate(y.angle),this.ctx.fillStyle="#8b5a2b",this.ctx.beginPath(),this.ctx.moveTo(-y.size,0),this.ctx.lineTo(y.size,-y.size/2),this.ctx.lineTo(y.size/2,y.size/2),this.ctx.closePath(),this.ctx.fill()):y.type==="blood"?(this.ctx.fillStyle=y.color,this.ctx.beginPath(),this.ctx.arc(y.x,y.y,y.size,0,Math.PI*2),this.ctx.fill()):(this.ctx.fillStyle=y.color,(y.color.startsWith("#66fc")||y.color.startsWith("#ff3c"))&&(this.ctx.shadowColor=y.color,this.ctx.shadowBlur=4),this.ctx.beginPath(),this.ctx.arc(y.x,y.y,y.size*y.life,0,Math.PI*2),this.ctx.fill()),this.ctx.restore()})):(this.bullets.forEach(y=>y.draw(this.ctx)),this.particles.drawParticles(this.ctx)),this.ctx.restore(),e&&e.grenades?e.grenades.forEach(y=>{this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(y.x,y.y,6,0,Math.PI*2),this.ctx.fillStyle="#2d332f",this.ctx.strokeStyle="#66fcf1",this.ctx.lineWidth=1.5,this.ctx.fill(),this.ctx.stroke(),this.ctx.restore()}):this.grenades&&this.grenades.forEach(y=>y.draw(this.ctx)),!e&&this.zone&&this.zone.active){const y=this.zone,E=Date.now(),A=Math.sin(E/300)*.15+.85;this.ctx.save(),this.ctx.beginPath(),this.ctx.rect(-100,-100,this.mapWidth+200,this.mapHeight+200),this.ctx.arc(y.centerX,y.centerY,y.currentRadius,0,Math.PI*2,!0),this.ctx.fillStyle=`rgba(255, 30, 30, ${.12*A})`,this.ctx.fill("evenodd"),this.ctx.beginPath(),this.ctx.arc(y.centerX,y.centerY,y.currentRadius,0,Math.PI*2),this.ctx.strokeStyle=`rgba(255, 50, 50, ${.85*A})`,this.ctx.lineWidth=4,this.ctx.shadowColor="#ff2222",this.ctx.shadowBlur=18,this.ctx.stroke(),this.ctx.shadowBlur=0,this.ctx.beginPath(),this.ctx.arc(y.centerX,y.centerY,y.currentRadius,0,Math.PI*2),this.ctx.strokeStyle=`rgba(255, 150, 150, ${.3*A})`,this.ctx.lineWidth=12,this.ctx.stroke(),this.ctx.restore()}this.matchMode==="sabotage"&&(this.vents.forEach(y=>{this.ctx.save(),this.ctx.translate(y.x,y.y),this.ctx.fillStyle="#1e2124",this.ctx.fillRect(-20,-15,40,30),this.ctx.strokeStyle="#535960",this.ctx.lineWidth=2.5,this.ctx.strokeRect(-20,-15,40,30),this.ctx.strokeStyle="#0f1112",this.ctx.lineWidth=2;for(let A=-12;A<=12;A+=6)this.ctx.beginPath(),this.ctx.moveTo(A,-10),this.ctx.lineTo(A,10),this.ctx.stroke();Math.hypot(this.localPlayer.x-y.x,this.localPlayer.y-y.y)<50&&this.localPlayer.health>0&&!this.localPlayer.inVent&&(this.ctx.fillStyle="#66fcf1",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("[E] VENT",0,-22)),this.ctx.restore()}),this.tasks.forEach(y=>{const E=Date.now();this.ctx.save(),this.ctx.translate(y.x,y.y);const S=E%1200/1200*Math.PI*2;if(y.alarmActive){const B=.7+.3*Math.abs(Math.sin(E/60+y.x)),I=90+20*Math.abs(Math.sin(E/200)),U=Math.PI/6;this.ctx.save(),this.ctx.createConicalGradient;for(let $=0;$<2;$++){const te=S+$*Math.PI;this.ctx.beginPath(),this.ctx.moveTo(0,-26),this.ctx.arc(0,-26,I,te-U,te+U),this.ctx.closePath();const se=this.ctx.createRadialGradient(0,-26,0,0,-26,I);se.addColorStop(0,`rgba(255, 60, 40, ${.55*B})`),se.addColorStop(.45,`rgba(255, 80, 40, ${.18*B})`),se.addColorStop(1,"rgba(255, 40, 0, 0)"),this.ctx.fillStyle=se,this.ctx.fill()}const N=this.ctx.createRadialGradient(0,0,0,0,0,75);N.addColorStop(0,`rgba(255, 30, 10, ${.22*B})`),N.addColorStop(1,"rgba(255,0,0,0)"),this.ctx.fillStyle=N,this.ctx.beginPath(),this.ctx.ellipse(0,5,75,35,0,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}else if(y.status==="doing"){const B=.12+.1*Math.abs(Math.sin(E/350)),I=this.ctx.createRadialGradient(0,0,0,0,0,40);I.addColorStop(0,`rgba(255,220,50,${B})`),I.addColorStop(1,"rgba(255,200,0,0)"),this.ctx.fillStyle=I,this.ctx.beginPath(),this.ctx.ellipse(0,5,40,22,0,0,Math.PI*2),this.ctx.fill()}y.status,y.alarmActive||y.status,this.ctx.fillStyle="rgba(0,0,0,0.45)",this.ctx.beginPath(),this.ctx.ellipse(0,17,22,7,0,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle="#1a1f26",this.ctx.beginPath(),this.ctx.roundRect(-18,-18,36,32,3),this.ctx.fill(),this.ctx.strokeStyle="#3a4555",this.ctx.lineWidth=1.5,this.ctx.stroke(),this.ctx.fillStyle="#0d1117",this.ctx.fillRect(-13,-14,26,16),this.ctx.strokeStyle="#2a3340",this.ctx.lineWidth=1,this.ctx.strokeRect(-13,-14,26,16);const w=y.alarmActive?"#1a0000":"#001a0a";this.ctx.fillStyle=w,this.ctx.fillRect(-11,-12,22,12),this.ctx.strokeStyle=y.alarmActive?"rgba(255,20,20,0.06)":"rgba(0,255,100,0.07)",this.ctx.lineWidth=.8;for(let B=-11;B<0;B+=2)this.ctx.beginPath(),this.ctx.moveTo(-11,B),this.ctx.lineTo(11,B),this.ctx.stroke();y.alarmActive?(this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=6,this.ctx.fillStyle="#ff3c3c"):y.status==="completed"?(this.ctx.shadowColor="#66fcf1",this.ctx.shadowBlur=6,this.ctx.fillStyle="#66fcf1"):y.status==="doing"?(this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=5,this.ctx.fillStyle="#ffd700"):(this.ctx.shadowColor="#1aff8a",this.ctx.shadowBlur=4,this.ctx.fillStyle="#1aff8a"),this.ctx.font="bold 5px monospace",this.ctx.textAlign="center";const P=y.alarmActive?"ALARM":y.status==="completed"?"DONE":y.status==="doing"?"ACTIVE":"READY";this.ctx.fillText(P,0,-5),this.ctx.shadowBlur=0,this.ctx.fillStyle="#141a22",this.ctx.fillRect(-13,4,26,8);const C=y.alarmActive?`rgba(255,40,40,${.6+.4*Math.abs(Math.sin(E/90))})`:y.status==="completed"?"#66fcf1":y.status==="doing"?"#ffd700":"#1aff8a";this.ctx.fillStyle=C,y.alarmActive&&(this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=8),this.ctx.beginPath(),this.ctx.arc(-8,8,2.5,0,Math.PI*2),this.ctx.fill(),this.ctx.shadowBlur=0;for(let B=-1;B<=5;B+=3)this.ctx.fillStyle="#2a3545",this.ctx.fillRect(B,6,2.5,4);if(y.alarmActive){const B=.6+.4*Math.abs(Math.sin(E/45));this.ctx.fillStyle="#1a0a0a",this.ctx.beginPath(),this.ctx.arc(0,-26,6,Math.PI,0),this.ctx.fill(),this.ctx.save(),this.ctx.translate(0,-26),this.ctx.rotate(S),this.ctx.fillStyle=`rgba(255, 60, 10, ${B})`,this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=14,this.ctx.beginPath(),this.ctx.arc(0,0,4.5,0,Math.PI*2),this.ctx.fill(),this.ctx.shadowBlur=0,this.ctx.fillStyle=`rgba(255, 220, 180, ${.8*B})`,this.ctx.beginPath(),this.ctx.arc(0,0,2,0,Math.PI*2),this.ctx.fill(),this.ctx.restore(),this.ctx.strokeStyle="#2a1a1a",this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.moveTo(0,-20),this.ctx.lineTo(0,-22),this.ctx.stroke()}else this.ctx.fillStyle="#1a2030",this.ctx.beginPath(),this.ctx.arc(0,-22,4,Math.PI,0),this.ctx.fill(),this.ctx.fillStyle="#2a3040",this.ctx.beginPath(),this.ctx.arc(0,-22,2,0,Math.PI*2),this.ctx.fill();this.ctx.strokeStyle="#0a0f14",this.ctx.lineWidth=1.2,this.ctx.beginPath(),this.ctx.moveTo(-18,5),this.ctx.quadraticCurveTo(-26,10,-24,16),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(18,3),this.ctx.quadraticCurveTo(25,8,22,16),this.ctx.stroke(),[[-16,-16],[16,-16],[-16,12],[16,12]].forEach(([B,I])=>{this.ctx.fillStyle="#2c3545",this.ctx.beginPath(),this.ctx.arc(B,I,1.5,0,Math.PI*2),this.ctx.fill()}),Math.hypot(this.localPlayer.x-y.x,this.localPlayer.y-y.y)<40&&this.localPlayer.health>0&&y.status==="pending"&&(this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=8,this.ctx.fillStyle="#ffd700",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("[F] INTERACT",0,-36),this.ctx.shadowBlur=0),this.ctx.restore()})),this.activeHitmarkers.forEach(y=>{const E=y.age/y.duration;this.ctx.save(),this.ctx.translate(y.x,y.y);const A=1-E;this.ctx.strokeStyle=y.isHeadshot?`rgba(255, 215, 0, ${A})`:`rgba(255, 255, 255, ${A})`,this.ctx.lineWidth=y.isHeadshot?2.5:1.5;const S=5+E*5,w=2;this.ctx.beginPath(),this.ctx.moveTo(-w,-w),this.ctx.lineTo(-S,-S),this.ctx.moveTo(w,-w),this.ctx.lineTo(S,-S),this.ctx.moveTo(-w,w),this.ctx.lineTo(-S,S),this.ctx.moveTo(w,w),this.ctx.lineTo(S,S),this.ctx.stroke(),this.ctx.restore()}),this.floatingNumbers.forEach(y=>{const E=y.age/y.duration;this.ctx.save(),this.ctx.translate(y.x,y.y);const A=1-E;let S=1;E<.25?S=1+E/.25*.4:S=1.4-(E-.25)/.75*.4,this.ctx.scale(S,S),this.ctx.font=y.isHeadshot?"bold 14px 'Orbitron', sans-serif":"bold 11px 'Orbitron', sans-serif",this.ctx.textAlign="center",this.ctx.strokeStyle=`rgba(0, 0, 0, ${A})`,this.ctx.lineWidth=3,this.ctx.strokeText(y.damage,0,0),this.ctx.fillStyle=y.isHeadshot?`rgba(255, 215, 0, ${A})`:`rgba(255, 255, 255, ${A})`,this.ctx.fillText(y.damage,0,0),this.ctx.restore()}),this.ctx.restore(),this.ctx.save();const M=this.ctx.createRadialGradient(this.canvas.width/2,this.canvas.height/2,this.canvas.width/3,this.canvas.width/2,this.canvas.height/2,this.canvas.width/1.1);M.addColorStop(0,"rgba(0, 0, 0, 0)");let v="rgba(0, 0, 0, 0.82)";if(this.localPlayer){const y=Date.now(),E=this.localPlayer.adrenalineEndTime&&y<this.localPlayer.adrenalineEndTime||this.localPlayer.adrenalineActive,A=this.localPlayer.overdriveEndTime&&y<this.localPlayer.overdriveEndTime||this.localPlayer.overdriveActive;this.matchMode==="sabotage"&&this.tasks&&this.tasks.some(w=>w.alarmActive)?v=`rgba(255, 30, 30, ${Math.sin(y/100)*.15+.55})`:A?v=`rgba(255, 180, 0, ${Math.sin(y/150)*.12+.48})`:E&&(v=`rgba(57, 219, 20, ${Math.sin(y/150)*.12+.48})`)}M.addColorStop(1,v),this.ctx.fillStyle=M,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(255, 255, 255, 0.015)";for(let y=0;y<this.canvas.height;y+=4)this.ctx.fillRect(0,y,this.canvas.width,1);if(this.ctx.restore(),this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.health<35&&!e){this.ctx.save();const y=Math.sin(Date.now()/150)*.2+.3,E=this.ctx.createRadialGradient(this.canvas.width/2,this.canvas.height/2,this.canvas.width/3,this.canvas.width/2,this.canvas.height/2,this.canvas.width/1.1);E.addColorStop(0,"rgba(255, 0, 0, 0)"),E.addColorStop(1,`rgba(255, 0, 0, ${y})`),this.ctx.fillStyle=E,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.restore()}let x=0;if(e){const y=e.players.find(E=>E.isLocal);y&&(x=y.flashAlpha||0)}else this.localPlayer&&(x=this.localPlayer.flashAlpha||0);if(x>0&&(this.ctx.save(),this.ctx.fillStyle=`rgba(255, 255, 255, ${x})`,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.restore()),!e){const y=this.localPlayer&&this.localPlayer.health>0?this.map.checkZone(this.localPlayer.x,this.localPlayer.y):null;if(y)try{this.ctx.save();const E=y.type==="healing",A=Math.sin(Date.now()/400)*.25+.75,S=E?`rgba(80,255,130,${A})`:`rgba(255,100,60,${A})`,w=E?`rgba(40,255,110,${A*.18})`:`rgba(255,60,20,${A*.18})`,P=E?`rgba(80,255,130,${A*.8})`:`rgba(255,100,60,${A*.8})`,C=260,L=38,z=this.canvas.width/2-C/2,B=this.canvas.height-130;this.ctx.fillStyle=w,this.ctx.fillRect(z,B,C,L),this.ctx.strokeStyle=P,this.ctx.lineWidth=1.5,this.ctx.strokeRect(z,B,C,L),this.ctx.textAlign="center",this.ctx.font="bold 12px Orbitron",this.ctx.fillStyle=S;const I=E?"+":"!";this.ctx.fillText(`${I} ${y.label}`,this.canvas.width/2,B+15),this.ctx.font="9px Orbitron",this.ctx.fillStyle=E?"rgba(60,255,110,0.7)":"rgba(255,80,40,0.7)";const U=E?`+${(y.healRate*60).toFixed(0)} HP/s REGENERATION`:`DAMAGE x${y.multiplier} -- DANGER`;this.ctx.fillText(U,this.canvas.width/2,B+29),this.ctx.restore()}catch{}}if(this.matchMode==="sabotage"&&this.gameState==="playing"){this.ctx.save(),this.ctx.font="bold 11px 'Orbitron', sans-serif",this.ctx.textAlign="left";const y=20,E=120;this.ctx.fillStyle="#ff3c3c",this.ctx.fillText("MISSION TASKS:",y,E),this.tasks.forEach((A,S)=>{const w=E+20+S*18,P=A.status==="completed";this.ctx.fillStyle=P?"#39db14":"#fff",this.ctx.font=P?"10px 'Orbitron', sans-serif":"bold 10px 'Orbitron', sans-serif",this.ctx.strokeStyle=P?"#39db14":"#888",this.ctx.lineWidth=1,this.ctx.strokeRect(y,w-8,8,8),P&&(this.ctx.fillStyle="#39db14",this.ctx.fillRect(y+2,w-6,4,4)),this.ctx.fillText(A.name,y+15,w)}),this.ctx.restore()}if(this.matchMode==="sabotage"&&this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.inVent&&this.currentVent&&(this.ctx.save(),this.ctx.fillStyle="rgba(2, 4, 8, 0.85)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(102, 252, 241, 0.08)",this.ctx.strokeStyle="#66fcf1",this.ctx.lineWidth=2,this.ctx.fillRect(this.canvas.width/2-200,this.canvas.height/2-150,400,300),this.ctx.strokeRect(this.canvas.width/2-200,this.canvas.height/2-150,400,300),this.ctx.font="bold 16px 'Orbitron', sans-serif",this.ctx.fillStyle="#66fcf1",this.ctx.textAlign="center",this.ctx.fillText("VENT NETWORK SYSTEM",this.canvas.width/2,this.canvas.height/2-110),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#8892b0",this.ctx.fillText("Select destination vent code to travel:",this.canvas.width/2,this.canvas.height/2-80),this.vents.forEach((y,E)=>{const A=E+1,S=y.id===this.currentVent.id;this.ctx.fillStyle=S?"#ffd700":"#fff",this.ctx.fillText(`[${A}] ${y.name} ${S?"(CURRENT LOCATION)":""}`,this.canvas.width/2,this.canvas.height/2-40+E*30)}),this.ctx.font="bold 11px 'Orbitron', sans-serif",this.ctx.fillStyle="#ff3c3c",this.ctx.fillText("PRESS [SPACEBAR] TO EXIT VENT",this.canvas.width/2,this.canvas.height/2+120),this.ctx.restore()),this.activeTask)){this.ctx.save(),this.ctx.fillStyle="rgba(2, 4, 8, 0.85)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const y=this.canvas.width/2-200,E=this.canvas.height/2-140,A=400,S=280;this.ctx.fillStyle="#11151c",this.ctx.strokeStyle="#ffd700",this.ctx.lineWidth=3,this.ctx.fillRect(y,E,A,S),this.ctx.strokeRect(y,E,A,S),this.ctx.font="bold 15px 'Orbitron', sans-serif",this.ctx.fillStyle="#ffd700",this.ctx.textAlign="center",this.ctx.fillText(this.activeTask.name.toUpperCase(),this.canvas.width/2,E+35),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#888",this.ctx.fillText("TASK TYPE: GRID CALIBRATION",this.canvas.width/2,E+60);const w=this.canvas.width/2-120,P=E+100,C=240,L=40;this.ctx.fillStyle="#1a1d24",this.ctx.fillRect(w,P,C,L),this.ctx.strokeStyle="#333",this.ctx.strokeRect(w,P,C,L),this.ctx.fillStyle="rgba(57, 219, 20, 0.35)",this.ctx.fillRect(this.canvas.width/2-24,P,48,L),this.ctx.strokeStyle="#39db14",this.ctx.strokeRect(this.canvas.width/2-24,P,48,L);const z=Math.abs(Math.sin(this.sweepAngle)),B=w+z*C;this.ctx.strokeStyle="#fff",this.ctx.lineWidth=3,this.ctx.beginPath(),this.ctx.moveTo(B,P-5),this.ctx.lineTo(B,P+L+5),this.ctx.stroke();const I=this.canvas.width/2-120,U=E+175,N=240,$=20;this.ctx.fillStyle="#1a1d24",this.ctx.fillRect(I,U,N,$),this.ctx.fillStyle="#ffd700",this.ctx.fillRect(I,U,this.sweepProgress/100*N,$),this.ctx.strokeStyle="#ffd700",this.ctx.strokeRect(I,U,N,$),this.ctx.font="bold 10px 'Orbitron', sans-serif",this.ctx.fillStyle="#fff",this.ctx.fillText(`CALIBRATION PROGRESS: ${this.sweepProgress}%`,this.canvas.width/2,U+14),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#ffaa00",this.ctx.fillText("PRESS [SPACEBAR] WHEN LINE IS IN GREEN ZONE",this.canvas.width/2,E+230),this.ctx.fillStyle="#888",this.ctx.fillText("PRESS [ESC] OR [F] TO ABANDON TASK",this.canvas.width/2,E+255),this.ctx.restore()}if(!e&&this.gameState==="playing"&&(this.matchMode==="sabotage"||performance.now()-this.roundStartTime>2e4)){this.ctx.save();const y=150,A=this.canvas.width-y-20,S=100;this.ctx.fillStyle="rgba(6, 7, 10, 0.85)",this.ctx.fillRect(A,S,y,y),this.ctx.strokeStyle="hsla(43, 74%, 49%, 0.6)",this.ctx.lineWidth=2,this.ctx.strokeRect(A,S,y,y),this.ctx.fillStyle="hsla(43, 74%, 49%, 0.9)",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("TACTICAL MINIMAP",A+y/2,S-6);const w=y/this.map.width;if(this.ctx.fillStyle="rgba(255, 255, 255, 0.12)",this.map.walls.forEach(C=>{this.ctx.fillRect(A+C.x*w,S+C.y*w,C.w*w,C.h*w)}),this.localPlayer&&this.localPlayer.health>0){const C=A+this.localPlayer.x*w,L=S+this.localPlayer.y*w;this.ctx.fillStyle="#00ffff",this.ctx.beginPath(),this.ctx.arc(C,L,3.5,0,Math.PI*2),this.ctx.fill(),this.ctx.strokeStyle="rgba(0, 255, 255, 0.8)",this.ctx.lineWidth=1,this.ctx.beginPath(),this.ctx.moveTo(C,L),this.ctx.lineTo(C+Math.cos(this.localPlayer.angle)*7,L+Math.sin(this.localPlayer.angle)*7),this.ctx.stroke()}this.matchMode==="sabotage"&&this.tasks.forEach(C=>{if(C.status==="completed")return;const L=A+C.x*w,z=S+C.y*w,B=Math.abs(Math.sin(performance.now()/250));this.ctx.fillStyle=`rgba(255, 215, 0, ${.4+.6*B})`,this.ctx.beginPath(),this.ctx.arc(L,z,3.5+B*2,0,Math.PI*2),this.ctx.fill()});const P=Math.abs(Math.sin(performance.now()/200));this.players.forEach(C=>{if(C.health>0&&!C.isLocal){const L=A+C.x*w,z=S+C.y*w;if(C.isTeammate)this.ctx.fillStyle="#39ff14",this.ctx.beginPath(),this.ctx.arc(L,z,3,0,Math.PI*2),this.ctx.fill();else{if(this.matchMode==="sabotage")return;this.ctx.fillStyle=`rgba(255, 60, 60, ${.4+.6*P})`,this.ctx.beginPath(),this.ctx.arc(L,z,4+P*2.5,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle="#ff3c3c",this.ctx.beginPath(),this.ctx.arc(L,z,2,0,Math.PI*2),this.ctx.fill()}}}),this.ctx.restore()}if(e){this.ctx.save(),this.ctx.strokeStyle="rgba(255, 60, 60, 0.6)",this.ctx.lineWidth=12,this.ctx.strokeRect(0,0,this.canvas.width,this.canvas.height);const y=Math.floor(Date.now()/500)%2===0;this.ctx.fillStyle=y?"#ff3c3c":"rgba(255, 60, 60, 0.2)",this.ctx.beginPath(),this.ctx.arc(40,40,8,0,Math.PI*2),this.ctx.fill(),this.ctx.font="900 16px Orbitron",this.ctx.fillStyle="#ffffff",this.ctx.textAlign="left",this.ctx.fillText("KILLCAM REPLAY",60,46);const E=this.replayIndex/this.replayFrames.length,A=this.canvas.width-80;this.ctx.fillStyle="rgba(255, 255, 255, 0.15)",this.ctx.fillRect(40,this.canvas.height-40,A,6),this.ctx.fillStyle="#ff3c3c",this.ctx.fillRect(40,this.canvas.height-40,A*E,6),this.ctx.restore()}if(!e&&this.combatBanner){this.ctx.save(),this.ctx.textAlign="center",this.ctx.textBaseline="middle";const y=this.combatBanner.timer,E=this.combatBanner.text;let A=1;y<.5&&(A=y/.5);const S=1.5+Math.max(0,y-2.5)*2+.05*Math.sin(Date.now()/100);this.ctx.translate(this.canvas.width/2,this.canvas.height/2-180),this.ctx.scale(S,S),this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=20,this.ctx.font="italic 900 24px 'Orbitron', sans-serif";const w=this.ctx.createLinearGradient(-150,0,150,0);w.addColorStop(0,`rgba(255, 60, 60, ${A})`),w.addColorStop(.5,`rgba(255, 220, 0, ${A})`),w.addColorStop(1,`rgba(255, 60, 60, ${A})`),this.ctx.fillStyle=w,this.ctx.fillText(E,0,0),this.ctx.shadowBlur=0,this.ctx.strokeStyle=`rgba(255, 215, 0, ${A*.4})`,this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.moveTo(-100,18),this.ctx.lineTo(100,18),this.ctx.moveTo(-100,-18),this.ctx.lineTo(100,-18),this.ctx.stroke(),this.ctx.restore()}if(this.localPlayer&&this.localPlayer.weaponLevelUpAlert>0&&!e){this.ctx.save(),this.ctx.textAlign="center",this.ctx.textBaseline="middle";const y=this.localPlayer.weaponLevelUpAlert,E=Math.min(1,y),A=1+.15*Math.sin(Date.now()/150);this.ctx.translate(this.canvas.width/2,this.canvas.height/2-80),this.ctx.scale(A,A),this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=15,this.ctx.font="bold 28px 'Orbitron', sans-serif",this.ctx.fillStyle=`rgba(255, 215, 0, ${E})`,this.ctx.fillText("WEAPON UPGRADED",0,0),this.ctx.shadowBlur=0,this.ctx.font="bold 16px 'Orbitron', sans-serif",this.ctx.fillStyle=`rgba(255, 255, 255, ${E})`,this.ctx.fillText(`LVL ${this.localPlayer.weaponLevel}`,0,35),this.ctx.restore()}}isPointInPolygon(e,t){let i=!1;for(let n=0,a=t.length-1;n<t.length;a=n++){const r=t[n].x,o=t[n].y,l=t[a].x,c=t[a].y;o>e.y!=c>e.y&&e.x<(l-r)*(e.y-o)/(c-o)+r&&(i=!i)}return i}handleServerRoundOver(e){if(this.gameState!=="playing")return;if(this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchMode==="sabotage")try{this.sound.stopBearMusic()}catch{}let t=document.getElementById("hud-status");const i=this.localPlayer.team;e.winningTeam===i?t&&(t.innerText="ROUND WON",t.style.color="#39ff14"):t&&(t.innerText="ROUND LOST",t.style.color="#ff3c3c"),i===1?(this.scoreSelf=e.score1,this.scoreOpponent=e.score2):(this.scoreSelf=e.score2,this.scoreOpponent=e.score1),this.updateScoreboardHUD();const n=e.winningTeam===1?2:1;this.players.forEach(a=>{a.team===n&&(a.health=0)}),this.roundNumber=e.roundNumber,this.startReplay(()=>this.startRoundCycle())}handleServerMatchOver(e){if(this.gameState!=="playing"&&this.gameState!=="round-over")return;this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.localPlayer.team===1?(this.scoreSelf=e.score1,this.scoreOpponent=e.score2):(this.scoreSelf=e.score2,this.scoreOpponent=e.score1),this.updateScoreboardHUD();const i=window.MatchStats.shotsFired||1,n=window.MatchStats.hitsRegistered/i*100;window.MatchStats.accuracy=n,window.MatchStats.roundsWon=this.scoreSelf,window.MatchStats.winnerId=e.winnerId;const a=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent:this.scoreSelf>=3,r=this.localPlayer.rank?this.localPlayer.rank.label:"";let o=!1,l=0;this.isRanked&&(o=this.localPlayer.applyRankDelta(a?va:Sa),l=a?va:Sa),window.MatchStats.isWin=a,window.MatchStats.newRP=this.localPlayer.rp,window.MatchStats.newRank=this.localPlayer.rank,window.MatchStats.rpDelta=l,window.MatchStats.rankChanged=o,window.MatchStats.oldRankLabel=r;const h=(this.matchMode==="sabotage"?e.score1>e.score2?1:2:e.score1>=3?1:2)===1?2:1;this.players.forEach(d=>{d.team===h&&(d.health=0)});const f=()=>{this.gameState="match-over",this.active=!1,a?this.sound.playMatchWin():this.sound.playMatchLose(),this.onMatchEnd&&this.onMatchEnd(window.MatchStats)};this.startReplay(f)}spawnItemAt(e,t,i,n=null){const a=n||`item_${i}_${Date.now()}_${Math.round(Math.random()*1e3)}`;return this.map.items.some(r=>r.id===a)||this.map.items.push({id:a,x:e,y:t,type:i,active:!0}),a}generateRandomCode(){const e=["w","a","s","d","q","e","r","f"];let t="";for(let i=0;i<4;i++)t+=e[Math.floor(Math.random()*e.length)];return t}startHackingMinigame(e){const t=this.generateRandomCode();this.activeMinigame={terminal:e,code:t,input:"",timer:4},this.keys.e=!1;const i=document.getElementById("hacking-minigame-overlay");i&&(i.style.display="flex");const n=document.getElementById("hud-interaction-prompt");n&&(n.style.display="none"),this.renderMinigameKeys()}renderMinigameKeys(){const e=document.getElementById("minigame-keys-container");if(!e||!this.activeMinigame)return;e.innerHTML="";const t=this.activeMinigame.code,i=this.activeMinigame.input;for(let n=0;n<t.length;n++){const a=t[n],r=n<i.length,o=document.createElement("div");o.style.width="35px",o.style.height="35px",o.style.lineHeight="35px",o.style.borderRadius="4px",o.style.fontFamily="var(--font-title)",o.style.fontWeight="bold",o.style.fontSize="14px",o.style.textTransform="uppercase",o.style.border=r?"1px solid #39ff14":"1px solid rgba(255,255,255,0.15)",o.style.background=r?"rgba(57, 255, 20, 0.12)":"rgba(0,0,0,0.4)",o.style.color=r?"#39ff14":"rgba(255,255,255,0.7)",o.style.boxShadow=r?"0 0 6px rgba(57, 255, 20, 0.25)":"none",o.innerText=a,e.appendChild(o)}}handleMinigameKeyPress(e){if(!this.activeMinigame)return;const t=this.activeMinigame.code,i=this.activeMinigame.input,n=t[i.length];if(e===n){this.activeMinigame.input+=e,this.renderMinigameKeys();try{this.sound.playMetallicClick(0,2500,.04,.2)}catch{}this.activeMinigame.input===t&&this.successHackingMinigame()}else{this.activeMinigame.input="",this.renderMinigameKeys();try{this.sound.playMetallicClick(0,300,.15,.3)}catch{}}}cancelHackingMinigame(){this.activeMinigame=null;const e=document.getElementById("hacking-minigame-overlay");e&&(e.style.display="none")}successHackingMinigame(){if(!this.activeMinigame)return;const e=this.activeMinigame.terminal;e.hacked=!0;const t=this.spawnItemAt(e.x-22,e.y,"health"),i=this.spawnItemAt(e.x+22,e.y,"adrenaline");this.localPlayer.showTextNotification("HACK SUCCESSFUL! LOOT SPAWNED","#39ff14"),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:t,x:e.x-22,y:e.y,type:"health"}),this.localPlayer.networkDroppedItems.push({id:i,x:e.x+22,y:e.y,type:"adrenaline"});try{this.sound.playMetallicClick(0,3500,.25,.45)}catch{}this.cancelHackingMinigame()}failHackingMinigame(){this.localPlayer.showTextNotification("HACK FAILED!","#ff3c3c");try{this.sound.playMetallicClick(0,200,.3,.45)}catch{}this.cancelHackingMinigame()}}const ve={getItem(s){try{return localStorage.getItem(s)}catch(e){return console.warn("localStorage.getItem failed:",e),null}},setItem(s,e){try{localStorage.setItem(s,e)}catch(t){console.warn("localStorage.setItem failed:",t)}},removeItem(s){try{localStorage.removeItem(s)}catch(e){console.warn("localStorage.removeItem failed:",e)}}},Rl="tacticstrike_account_session",ys="tacticstrike_account_user",Cl="tacticstrike_admin_session",vx=performance.now();function Sx(){try{const s=JSON.parse(ve.getItem(ys)||"null");return s&&typeof s.email=="string"?s:null}catch{return ve.removeItem(ys),null}}let Pt={token:ve.getItem(Rl),user:Sx()};Pt.token||(Pt.user=null);let Bn=!!Pt.token,fs=ve.getItem(Cl),Pl=null;function Qr(s){return new Promise(e=>setTimeout(e,s))}function Il({immediate:s=!1}={}){const e=document.getElementById("startup-overlay");if(document.body.classList.remove("is-starting"),!!e){if(e.setAttribute("aria-hidden","true"),s){e.remove();return}e.classList.add("is-exiting"),setTimeout(()=>e.remove(),650)}}setTimeout(()=>{document.body.classList.contains("is-starting")&&Il()},6500);async function Mx(s){const e=Math.max(0,1350-(performance.now()-vx)),t=Pt.token&&!Pt.user?Promise.race([Promise.resolve(s),Qr(3600)]):Promise.resolve();await Promise.all([Qr(e),t]);const i=document.getElementById("startup-status");i&&(i.textContent=Pt.user?"OPERATIVE SESSION READY":"SYSTEMS ONLINE"),await Qr(140),Il()}function Ll(){return window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?window.location.port==="3000"?window.location.origin:"http://localhost:3000":window.location.hostname.endsWith("onrender.com")?window.location.origin:"https://topdownshooter.onrender.com"}async function ji(s,e={}){const t={"Content-Type":"application/json",...e.headers||{}};Pt.token&&(t.Authorization=`Bearer ${Pt.token}`);const i=await fetch(`${Ll()}${s}`,{...e,headers:t}),n=i.status===204?null:await i.json().catch(()=>null);if(!i.ok){const a=new Error((n==null?void 0:n.message)||"The account server could not complete this request.");throw a.code=n==null?void 0:n.error,a.status=i.status,a}return n}async function xs(s,e={}){const t={"Content-Type":"application/json",...e.headers||{}};fs&&(t.Authorization=`Bearer ${fs}`);const i=await fetch(`${Ll()}${s}`,{...e,headers:t}),n=i.status===204?null:await i.json().catch(()=>null);if(!i.ok){const a=new Error((n==null?void 0:n.message)||"The admin server could not complete this request.");throw a.code=n==null?void 0:n.error,a.status=i.status,a}return n}const xi={menu:document.getElementById("menu-screen"),lobby:document.getElementById("lobby-screen"),game:document.getElementById("game-screen"),matchmaking:document.getElementById("matchmaking-screen")},tt={rankedRealistic:document.getElementById("btn-ranked-realistic"),rankedCompetitive:document.getElementById("btn-ranked-competitive"),createRoom:document.getElementById("btn-create-room"),joinRoom:document.getElementById("btn-join-room"),practiceBot:document.getElementById("btn-practice-bot"),openMatchSettings:document.getElementById("btn-open-match-settings"),closeSettings:document.getElementById("btn-close-settings"),leaveLobby:document.getElementById("btn-leave-lobby"),readyToggle:document.getElementById("btn-ready-toggle"),copyCode:document.getElementById("btn-copy-code"),returnLobby:document.getElementById("btn-return-lobby"),btnAmongUs:document.getElementById("btn-among-us-mode")},Oe={name:document.getElementById("player-name-input"),roomCode:document.getElementById("room-code-input"),chat:document.getElementById("chat-input"),qpMapSelect:document.getElementById("qp-map-select"),lobbyMapSelect:document.getElementById("lobby-map-select"),lobbyModeSelect:document.getElementById("lobby-mode-select"),lobbyStyleSelect:document.getElementById("lobby-style-select")},ot={roomCode:document.getElementById("room-code-display"),weaponStats:document.getElementById("weapon-stats-display"),playersList:document.getElementById("lobby-players-list"),chatMessages:document.getElementById("chat-messages"),chatDrawer:document.getElementById("chat-drawer")},yt={modal:document.getElementById("settings-modal"),volume:document.getElementById("setting-volume"),volumeVal:document.getElementById("volume-val"),blood:document.getElementById("setting-blood"),shadows:document.getElementById("setting-shadows"),laser:document.getElementById("setting-laser")},gn=document.getElementById("game-over-modal"),rr={pistol:{name:"Tactical 9mm",damage:22,fireRate:35,accuracy:90,magSize:12,range:400,reloadTime:1200,speedMultiplier:1,type:"Semi-Auto",damagePct:33,fireRatePct:45},rifle:{name:"Assault Rifle (M4A1)",damage:28,fireRate:75,accuracy:70,magSize:30,range:600,reloadTime:2200,speedMultiplier:1,type:"Automatic",damagePct:65,fireRatePct:85},shotgun:{name:"Shotgun (Remington 870)",damage:15,fireRate:20,accuracy:40,magSize:6,range:250,reloadTime:3e3,speedMultiplier:1,type:"Pump-Action",damagePct:80,fireRatePct:20,pellets:8},sniper:{name:"Sniper Rifle (AWM)",damage:95,fireRate:10,accuracy:98,magSize:5,range:1e3,reloadTime:2800,speedMultiplier:1,type:"Bolt-Action",damagePct:100,fireRatePct:10},smg:{name:"SMG (MP5)",damage:18,fireRate:85,accuracy:82,magSize:30,range:350,reloadTime:1500,speedMultiplier:1,type:"Automatic",damagePct:30,fireRatePct:95},lmg:{name:"LMG (M249)",damage:25,fireRate:80,accuracy:75,magSize:100,range:550,reloadTime:4500,speedMultiplier:1,type:"Automatic",damagePct:55,fireRatePct:90},dmr:{name:"DMR (M14 EBR)",damage:45,fireRate:30,accuracy:94,magSize:20,range:800,reloadTime:2400,speedMultiplier:1,type:"Semi-Auto",damagePct:75,fireRatePct:35},vector:{name:"Vector SMG",damage:14,fireRate:95,accuracy:85,magSize:33,range:320,reloadTime:1100,speedMultiplier:1,type:"Automatic",damagePct:25,fireRatePct:98},famas:{name:"FAMAS Burst Carbine",damage:20,fireRate:55,accuracy:91,magSize:25,range:550,reloadTime:1800,speedMultiplier:1,type:"Burst-Fire",damagePct:45,fireRatePct:60},plasma:{name:"Plasma Rifle PL-45",damage:32,fireRate:65,accuracy:90,magSize:20,range:600,reloadTime:2e3,speedMultiplier:1,type:"Automatic",damagePct:60,fireRatePct:70},railgun:{name:"Railgun RG-X",damage:85,fireRate:8,accuracy:99,magSize:5,range:1200,reloadTime:3500,speedMultiplier:.95,type:"Single-Shot",damagePct:95,fireRatePct:8}},Fn={dmr:{rp:1e3,rank:"VETERAN",price:2200},sniper:{rp:1e3,rank:"VETERAN",price:2500},lmg:{rp:4e3,rank:"ELITE",price:4500},vector:{rp:1e3,rank:"VETERAN",price:2100},famas:{rp:1e3,rank:"VETERAN",price:2300},plasma:{rp:4e3,rank:"ELITE",price:4e3},railgun:{rp:4e3,rank:"ELITE",price:5e3}},bx={dmr:{code:"M14",role:"PRECISION",tier:"ADVANCED",description:"A controlled semi-auto platform built for disciplined mid-to-long range fire."},sniper:{code:"AWM",role:"LONGSHOT",tier:"ADVANCED",description:"A high-impact bolt-action system engineered to end an engagement in one shot."},lmg:{code:"M249",role:"SUPPORT",tier:"ELITE",description:"Sustained suppressive fire with a deep belt and uncompromising lane control."},vector:{code:"VEC",role:"BREACH",tier:"ADVANCED",description:"Extreme close-range fire rate for operatives who fight inside the objective."},famas:{code:"FAM",role:"BURST",tier:"ADVANCED",description:"A precise burst carbine tuned for fast target acquisition and controlled recoil."},plasma:{code:"PL45",role:"PROTOTYPE",tier:"ELITE",description:"Experimental energy rifle with exceptional accuracy and balanced stopping power."},railgun:{code:"RG-X",role:"EXOTIC",tier:"ELITE",description:"Blacksite electromagnetic technology delivering devastating single-shot force."}},Ws={pistol:"Pistol",rifle:"Rifle",shotgun:"Shotgun",sniper:"Sniper",smg:"SMG",lmg:"LMG",dmr:"DMR",vector:"Vector",famas:"FAMAS",plasma:"Plasma",railgun:"Railgun"};function Ex(s){const t=`; ${document.cookie}`.split(`; ${s}=`);return t.length===2?t.pop().split(";").shift():null}function Tx(s,e,t=365){const i=new Date;i.setTime(i.getTime()+t*24*60*60*1e3),document.cookie=`${s}=${e};expires=${i.toUTCString()};path=/;SameSite=Strict`}function Dl(){let s=ve.getItem("tacticstrike_uuid");return s||(s=Ex("tacticstrike_uuid")),s||(s="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){const t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})),ve.setItem("tacticstrike_uuid",s),Tx("tacticstrike_uuid",s,365),s}function Es(){try{const s=window.AudioContext||window.webkitAudioContext;if(!s)return;const e=new s,t=e.createOscillator(),i=e.createGain();t.type="sawtooth",t.frequency.setValueAtTime(120,e.currentTime),i.gain.setValueAtTime(.12,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.15),t.connect(i),i.connect(e.destination),t.start(),t.stop(e.currentTime+.15)}catch{}}function Nl(){const s=parseInt(ve.getItem("tacticstrike_rp")||"0"),e=document.querySelectorAll("#menu-weapon-selector .weapon-btn");e.forEach(n=>{const a=n.dataset.weapon,r=Fn[a],o=eo(a);if(r&&!o)n.classList.add("locked"),n.innerHTML=`🔒 ${Ws[a]} <span style="font-size:7px; display:block; color:#ff3c3c; margin-top:2.5px; font-family:var(--font-title); font-weight:bold;">${r.rank}</span>`;else{n.classList.remove("locked");let l=Ws[a]||a;try{JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]").includes(a)&&s<r.rp&&(l=`🛍️ ${l}`)}catch{}n.innerHTML=l}});const t=document.querySelectorAll(".weapon-option");t.forEach(n=>{const a=n.dataset.weapon,r=Fn[a],o=eo(a);let l=n.querySelector(".lock-badge");r&&!o?(n.classList.add("locked"),l||(l=document.createElement("span"),l.className="lock-badge",n.appendChild(l)),l.innerHTML=`🔒 <span style="font-size:8px; font-weight:bold; color:#ff3c3c; margin-left:2px;">${r.rank}</span>`,l.style.display="inline-flex"):(n.classList.remove("locked"),l&&(l.style.display="none"))}),Fn[mt]&&!eo(mt)&&(mt="pistol",ve.setItem("tacticstrike_player_weapon","pistol"),e.forEach(n=>{n.dataset.weapon==="pistol"?n.classList.add("active"):n.classList.remove("active")}),t.forEach(n=>{n.dataset.weapon==="pistol"?n.classList.add("active"):n.classList.remove("active")}),vs("pistol"))}let fe=null,Ae=null,Dt=null,je="Operative",mt="pistol",ai="cyan",Kt="1v1",Fs=!1,Oa=[],Si="menu",_i=ve.getItem("tacticstrike_qp_style")||"realistic",ls=ve.getItem("tacticstrike_selected_map")||"manor";function _s(){try{return JSON.parse(localStorage.getItem("tacticstrike_career")||'{"wins":0,"losses":0}')}catch{return{wins:0,losses:0}}}function xd(s){try{localStorage.setItem("tacticstrike_career",JSON.stringify(s))}catch{}}function kl(){const s=_s(),e=s.wins+s.losses,t=e>0?Math.round(s.wins/e*100):null,i=document.getElementById("stat-wins"),n=document.getElementById("stat-losses"),a=document.getElementById("stat-winpct");i&&(i.innerText=s.wins),n&&(n.innerText=s.losses),a&&(a.innerText=t!==null?`${t}%`:"—")}function or(s){const e=_s();s?e.wins++:e.losses++,xd(e),kl()}function wx(s,e){if(s)try{const t=localStorage.getItem("tacticstrike_h2h")||"{}",i=JSON.parse(t);i[s]||(i[s]={wins:0,losses:0}),e?i[s].wins++:i[s].losses++,localStorage.setItem("tacticstrike_h2h",JSON.stringify(i))}catch(t){console.warn("Failed to record H2H result:",t)}}function Ax(){const s=document.getElementById("h2h-history-container");if(!s)return;let e={};try{e=JSON.parse(localStorage.getItem("tacticstrike_h2h")||"{}")}catch{e={}}const t=Object.entries(e);if(t.length===0){s.innerHTML='<div style="color: var(--text-muted); font-size: 10px; text-align: center; padding: 10px 0; letter-spacing: 0.5px;">No head-to-head records found. Play a match to start tracking!</div>';return}t.sort((n,a)=>a[1].wins+a[1].losses-(n[1].wins+n[1].losses));let i="";t.forEach(([n,a])=>{const r=a.wins+a.losses,o=r>0?Math.round(a.wins/r*100):0;i+=`
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 4px; font-family: var(--font-title);">
        <span style="color: #fff; font-size: 11px; font-weight: bold; letter-spacing: 0.5px;">${On(n).toUpperCase()}</span>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 10px; color: var(--text-muted); letter-spacing: 0.5px;">RECORD: <strong style="color: #39db14;">${a.wins}W</strong> - <strong style="color: #ff3c3c;">${a.losses}L</strong></span>
          <span style="font-size: 9px; background: rgba(102, 252, 241, 0.1); border: 1px solid rgba(102, 252, 241, 0.3); color: #66fcf1; padding: 2px 5px; border-radius: 3px; font-weight: bold; letter-spacing: 0.5px;">${o}% WR</span>
        </div>
      </div>
    `}),s.innerHTML=i}const _t=new Audio("/Midnight_Deployment.mp3");_t.loop=!0;const wt=new Audio("/Before_The_Starting_Bell.mp3");wt.loop=!0;const gt=new Audio("/Into_Darkness.mp3");gt.loop=!0;let ba=!1,Ut=!1;const zt=new Audio("/Deployment_Sequence.mp3");zt.loop=!0;zt.volume=.15;function _d(){if(!Ut)try{_t.pause(),_t.currentTime=0,wt.pause(),wt.currentTime=0,gt.pause(),gt.currentTime=0,zt.volume=.15,zt.loop=!0,zt.play().catch(()=>{})}catch{}}function kt(){try{const s=window.AudioContext||window.webkitAudioContext;if(!s)return;const e=new s,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.setValueAtTime(1200,e.currentTime),t.frequency.exponentialRampToValueAtTime(600,e.currentTime+.08),i.gain.setValueAtTime(.1,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.08),t.connect(i),i.connect(e.destination),t.start(),t.stop(e.currentTime+.08)}catch{}}let Gi=null;function Mi(s="tap"){if(!We.sfxMuted)try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;Gi||(Gi=new e),Gi.state==="suspended"&&Gi.resume().catch(()=>{});const t={open:{from:390,to:520,duration:.14},close:{from:510,to:370,duration:.12},confirm:{from:560,to:760,duration:.16},tap:{from:440,to:500,duration:.1}},i=t[s]||t.tap,n=Gi.currentTime,a=Gi.createOscillator(),r=Gi.createBiquadFilter(),o=Gi.createGain(),l=.035*Math.max(0,Math.min(1,We.volume));a.type="sine",a.frequency.setValueAtTime(i.from,n),a.frequency.exponentialRampToValueAtTime(i.to,n+i.duration),r.type="lowpass",r.frequency.setValueAtTime(1800,n),r.Q.setValueAtTime(.45,n),o.gain.setValueAtTime(1e-4,n),o.gain.exponentialRampToValueAtTime(Math.max(1e-4,l),n+.012),o.gain.exponentialRampToValueAtTime(1e-4,n+i.duration),a.connect(r),r.connect(o),o.connect(Gi.destination),a.start(n),a.stop(n+i.duration+.02)}catch{}}let ja=null;const Rx=[{key:"knife",text:"Equip your Melee Knife (Press 2) to move 15% faster."},{key:"flashbang",text:"Throw a Flash Grenade (Press 3) to blind enemies in line-of-sight."},{key:"dash",text:"Press Space to dash forward in the direction you are facing (10s CD)."},{key:"flashlight",text:"Toggle your Flashlight (Press F) to spot enemies in dark rooms."}];function rl(){const s=document.getElementById("gameplay-tips-panel");if(!s)return;const e=Rx.filter(n=>localStorage.getItem(`tacticstrike_hide_tip_${n.key}`)!=="true");if(e.length===0){s.style.display="none",ja=null;return}const t=e[Math.floor(Math.random()*e.length)];ja=t.key;const i=document.getElementById("tip-text");i&&(i.innerText=t.text),s.style.display="flex"}function Cx(){const s=document.getElementById("btn-dismiss-tip");s&&s.addEventListener("click",()=>{if(ja){localStorage.setItem(`tacticstrike_hide_tip_${ja}`,"true");const e=document.getElementById("gameplay-tips-panel");e&&(e.style.display="none"),setTimeout(rl,1e3)}})}window.stopAllMusic=function(){try{_t.pause(),_t.currentTime=0,wt.pause(),wt.currentTime=0,zt.pause(),zt.currentTime=0,gt.pause(),gt.currentTime=0,Ae&&Ae.sound&&Ae.sound.stopBearMusic()}catch{}};function vd(){if(!Ut)try{_t.pause(),_t.currentTime=0,zt.pause(),zt.currentTime=0,gt.pause(),gt.currentTime=0,wt.currentTime=0,wt.play().catch(()=>{})}catch{}}function Ul(){if(!Ut)try{wt.pause(),wt.currentTime=0,zt.pause(),zt.currentTime=0,gt.pause(),gt.currentTime=0,_t.currentTime=0,_t.play().catch(()=>{})}catch{}}function Sd(){try{if(Ut)return;if(gt.pause(),gt.currentTime=0,Ae&&Ae.matchMode==="sabotage"||Si==="practice"&&Kt==="sabotage"){_t.pause(),_t.currentTime=0,wt.pause(),wt.currentTime=0,zt.pause(),zt.currentTime=0,Ae&&Ae.gameState==="playing"&&Ae.sound&&Ae.sound.playBearMusic();return}Si==="casual"?(_t.pause(),_t.currentTime=0,wt.pause(),wt.currentTime=0,zt.volume=.04,zt.loop=!0,zt.play().catch(()=>{})):(zt.pause(),zt.currentTime=0,wt.pause(),wt.currentTime=0,_t.volume=.04,_t.play().catch(()=>{}))}catch{}}function Bl(s){const e=document.getElementById("ranked-video-overlay"),t=document.getElementById("ranked-video");if(!e||!t){s();return}t.muted=!!We.sfxMuted,t.volume=typeof We.volume=="number"?We.volume:.5,t.currentTime=0,e.style.display="flex",e.offsetHeight,e.style.opacity="1",window.stopAllMusic(),t.play().then(()=>{const i=setTimeout(()=>{e.style.opacity="0"},4400),n=setTimeout(()=>{t.pause(),e.style.display="none",s()},5e3),a=()=>{clearTimeout(i),clearTimeout(n),e.style.opacity="0",setTimeout(()=>{e.style.display="none",s()},500),t.removeEventListener("ended",a)};t.addEventListener("ended",a)}).catch(i=>{console.warn("Ranked video playback failed or blocked by browser:",i),e.style.opacity="0",e.style.display="none",s()})}const Ea=[{id:"recruit",label:"RECRUIT",minRP:0,maxRP:999,color:"#8a9bb5",icon:"▪"},{id:"veteran",label:"VETERAN",minRP:1e3,maxRP:3999,color:"#e8c84a",icon:"◆"},{id:"elite",label:"ELITE",minRP:4e3,maxRP:1/0,color:"#ff6ef7",icon:"★"}];function Fl(s){for(let e=Ea.length-1;e>=0;e--)if(s>=Ea[e].minRP)return Ea[e];return Ea[0]}function Ol(){const s=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),e=Fl(s),t=document.getElementById("menu-rank-icon"),i=document.getElementById("menu-rank-label"),n=document.getElementById("menu-rank-rp");t&&(t.innerText=e.icon,t.style.color=e.color),i&&(i.innerText=e.label,i.style.color=e.color),n&&(n.innerText=`(${s} RP)`)}let za=!1,un=null;_t.addEventListener("ended",()=>{Ut||(_t.currentTime=0,_t.play().catch(()=>{}))});wt.addEventListener("ended",()=>{Ut||(wt.currentTime=0,wt.play().catch(()=>{}))});function Md(){if(ba||Ut){Ta();return}const s=document.querySelector(".screen.active");if(s&&s.id==="game"||xi.game&&xi.game.classList.contains("active"))return;const t=document.getElementById("deploy-modal");if(t&&t.classList.contains("active")){gt.volume=.15,gt.play().then(()=>{ba=!0,Ta()}).catch(()=>{});return}s&&(s.id==="lobby-screen"||s.id==="matchmaking-screen")?wt.play().then(()=>{ba=!0,Ta()}).catch(()=>{}):_t.play().then(()=>{ba=!0,Ta()}).catch(()=>{})}function Ta(){["click","keydown","touchstart"].forEach(s=>{window.removeEventListener(s,Md)})}["click","keydown","touchstart"].forEach(s=>{window.addEventListener(s,Md)});function bd(){if(Ut)_t.volume=0,wt.volume=0,gt.volume=0;else{const s=xi.game&&xi.game.classList.contains("active");_t.volume=s?.04:.15,wt.volume=.15,gt.volume=.15}}function ol(){const s=document.getElementById("setting-music-toggle"),e=document.getElementById("settings-music-action"),t=document.getElementById("settings-music-status");s&&(s.classList.toggle("is-muted",Ut),s.setAttribute("aria-pressed",String(Ut)),e&&(e.innerText=Ut?"UNMUTE MUSIC":"MUTE MUSIC"),t&&(t.innerText=Ut?"MUSIC IS OFF":"MUSIC IS PLAYING"))}function Px(s){if(We.musicMuted=s,Ut=s,Ut)window.stopAllMusic();else{const e=document.querySelector(".screen.active"),t=document.getElementById("deploy-modal");t&&t.classList.contains("active")?(gt.currentTime=0,gt.play().catch(()=>{})):e&&(e.id==="lobby-screen"||e.id==="matchmaking-screen")?vd():e&&e.id==="game-screen"?Sd():Ul()}bd(),ol(),Cn()}const We={volume:.5,blood:!0,shadows:!0,laser:!0,musicMuted:!1,sfxMuted:!1,performanceMode:!1,showFps:!1};function Ix(){const s=ve.getItem("tacticstrike_settings"),e=document.getElementById("setting-show-fps");if(s)try{const n=JSON.parse(s);delete n.serverUrl,Object.assign(We,n),yt.volume&&(yt.volume.value=We.volume*100),yt.volumeVal&&(yt.volumeVal.innerText=`${Math.round(We.volume*100)}%`),yt.blood&&(yt.blood.checked=We.blood),yt.shadows&&(yt.shadows.checked=We.shadows),yt.laser&&(yt.laser.checked=We.laser),e&&(e.checked=!!We.showFps);const a=document.getElementById("fps-counter");a&&(a.style.display=We.showFps?"block":"none"),Ut=!!We.musicMuted;const r=document.getElementById("setting-mute-sfx");r&&(r.checked=!!We.sfxMuted)}catch(n){console.error(n)}ol(),e&&e.addEventListener("change",n=>{We.showFps=n.target.checked;const a=document.getElementById("fps-counter");a&&(a.style.display=We.showFps?"block":"none"),Cn()}),yt.volume&&yt.volume.addEventListener("input",n=>{const a=parseInt(n.target.value);We.volume=a/100,yt.volumeVal&&(yt.volumeVal.innerText=`${a}%`),Cn()}),yt.blood&&yt.blood.addEventListener("change",n=>{We.blood=n.target.checked,Cn()}),yt.shadows&&yt.shadows.addEventListener("change",n=>{We.shadows=n.target.checked,Cn()}),yt.laser&&yt.laser.addEventListener("change",n=>{We.laser=n.target.checked,Cn()});const t=document.getElementById("setting-music-toggle");t&&t.addEventListener("click",()=>{We.sfxMuted||kt(),Px(!Ut)});const i=document.getElementById("setting-mute-sfx");i&&i.addEventListener("change",n=>{We.sfxMuted=n.target.checked,Cn()}),tt.openMatchSettings&&tt.openMatchSettings.addEventListener("click",()=>{We.sfxMuted||kt(),Ax(),ol(),yt.modal&&yt.modal.classList.add("active")}),tt.closeSettings&&tt.closeSettings.addEventListener("click",()=>{yt.modal&&yt.modal.classList.remove("active")})}function Cn(){if(ve.setItem("tacticstrike_settings",JSON.stringify(We)),Ae){const s=We.sfxMuted?0:We.volume;Ae.updateSettings({...We,volume:s})}}function si(s){const e=document.getElementById("deploy-modal");if(e&&e.classList.remove("active"),Object.keys(xi).forEach(t=>{t===s?(xi[t].classList.add("active"),(t==="matchmaking"||t==="lobby")&&(xi[t].style.display="flex")):(xi[t].classList.remove("active"),t==="matchmaking"&&(xi[t].style.display="none"))}),s!=="matchmaking"&&window.mmDotsInterval&&(clearInterval(window.mmDotsInterval),window.mmDotsInterval=null),s==="menu")Ul();else if(s==="lobby")_d();else if(s==="matchmaking")vd();else if(s==="game")Sd(),window.tipInterval&&clearInterval(window.tipInterval),rl(),window.tipInterval=setInterval(rl,18e3);else{window.tipInterval&&(clearInterval(window.tipInterval),window.tipInterval=null);const t=document.getElementById("gameplay-tips-panel");t&&(t.style.display="none")}s==="menu"&&ot&&ot.chatMessages&&(ot.chatMessages.innerHTML=""),bd()}function Lx(){const s=document.querySelectorAll(".weapon-option");s.forEach(e=>{e.addEventListener("click",t=>{if(e.classList.contains("locked")){t.preventDefault(),t.stopPropagation(),Es();return}s.forEach(i=>i.classList.remove("active")),e.classList.add("active"),mt=e.dataset.weapon,ve.setItem("tacticstrike_player_weapon",mt),vs(mt),kt(),fe&&Dt&&fe.emit("select-weapon",{weapon:mt})})}),vs("pistol")}function vs(s){const e=rr[s];if(!e||!ot.weaponStats)return;const t=e.damagePct??Math.min(100,Math.round(e.damage/95*100)),i=e.fireRatePct??Math.min(100,Math.round(e.fireRate)),n=e.accuracy??75,r=s==="plasma"||s==="railgun"?"#ff6ef7":"",o=r?`background: ${r};`:"";ot.weaponStats.innerHTML=`
    <div class="stat-row">
      <span>DAMAGE:</span>
      <div class="stat-bar"><div class="bar-fill" style="width: ${t}%; ${o}"></div></div>
    </div>
    <div class="stat-row">
      <span>FIRE RATE:</span>
      <div class="stat-bar"><div class="bar-fill" style="width: ${i}%; ${o}"></div></div>
    </div>
    <div class="stat-row">
      <span>ACCURACY:</span>
      <div class="stat-bar"><div class="bar-fill" style="width: ${n}%; ${o}"></div></div>
    </div>
    <div class="stat-row">
      <span>MAG CAPACITY:</span>
      <span class="stat-val">${e.magSize} rounds</span>
    </div>
  `}function Pn(s){var c;if(Oa=s,!ot.playersList)return;ot.playersList.innerHTML="";const e=Kt==="2v2"?4:2;for(let h=0;h<e;h++){const f=s[h],d=document.createElement("div");if(f){d.className=`player-slot active ${f.ready?"ready":""}`;const u=((c=rr[f.weapon])==null?void 0:c.name)||f.weapon,_={cyan:"#66fcf1",green:"#39db14",purple:"#9d3bff",orange:"#ff7f3b",yellow:"#ffd700",red:"#ff3c3c"}[f.color]||"#66fcf1",g=Kt==="2v2"?`TEAM ${h%2===0?"1":"2"}`:h===0?"HOST":"GUEST",m=f.rp||0,M=Fl(m);d.innerHTML=`
        <div class="player-info">
          <span class="player-name" style="color: ${_};">
            <span style="color: ${M.color}; margin-right: 4px;">${M.icon}</span>${On(f.name)} ${f.id===fe.id?"(YOU)":""}
          </span>
          <span class="player-weapon-desc">RANK: <span style="color:${M.color}">${M.label}</span> | WEAPON: ${u}</span>
        </div>
        <div class="player-badge ${h%2===0?"host":"guest"}">
          ${g}
        </div>
        <div class="status-badge ${f.ready?"ready-status":"waiting"}">
          ${f.ready?"READY":"CHOOSING..."}
        </div>
      `}else{d.className="player-slot empty";const u=h+1,p=Kt==="2v2"?` (TEAM ${h%2===0?"1":"2"})`:"";d.innerHTML=`<div class="slot-status">WAITING FOR OPERATIVE ${u}${p}...</div>`}if(ot.playersList.appendChild(d),Kt==="1v1"&&h===0){const u=document.createElement("div");u.className="vs-divider",u.innerText="VS",ot.playersList.appendChild(u)}}const t=s.find(h=>h.id===fe.id);t&&tt.readyToggle&&(Fs=t.ready,tt.readyToggle.className=Fs?"btn secondary":"btn primary",tt.readyToggle.innerText=Fs?"CANCEL READY":"READY TO DEPLOY");const i=document.getElementById("lobby-map-selector-container"),n=document.getElementById("lobby-map-select");if(i&&n)if(Si==="ranked")i.style.display="none";else{i.style.display="block";const h=s[0]&&s[0].id===fe.id;n.disabled=!h}const a=document.getElementById("lobby-mode-selector-container"),r=document.getElementById("lobby-mode-select");if(a&&r)if(Si==="ranked")a.style.display="none";else{a.style.display="block";const h=s[0]&&s[0].id===fe.id;r.disabled=!h}const o=document.getElementById("lobby-style-selector-container"),l=document.getElementById("lobby-style-select");if(o&&l)if(Si==="ranked")o.style.display="none";else{o.style.display="block";const h=s[0]&&s[0].id===fe.id;l.disabled=!h}}function Va(){if(fe)return;const s=Ll();fe=La(s),window.AppSocket=fe,fe.on("connect_error",()=>{console.warn("Failed to connect to multiplayer server."),io({total:1,quickplay:0,ranked_realistic:0,ranked_competitive:0})}),fe.on("disconnect",()=>{io({total:1,quickplay:0,ranked_realistic:0,ranked_competitive:0})}),fe.on("player-counts",e=>{io(e)}),fe.on("connect",()=>{console.log("Socket connected.");const e=Dl(),t=parseInt(ve.getItem("tacticstrike_rp")||"0"),i=_s(),n=parseInt(ve.getItem("tacticstrike_credits")||"0");let a=[];try{a=JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}fe.emit("sync-device",{uuid:e,rp:t,wins:i.wins,losses:i.losses,name:je,credits:n,purchasedWeapons:a})}),fe.on("device-synced",e=>{console.log("Device synced with database:",e);const t=parseInt(ve.getItem("tacticstrike_rp")||"0"),i=Math.max(t,e.rp||0);ve.setItem("tacticstrike_rp",String(i));const n=_s(),a=Math.max(n.wins,e.wins||0),r=Math.max(n.losses,e.losses||0);xd({wins:a,losses:r});const o=parseInt(ve.getItem("tacticstrike_credits")||"0"),l=Math.max(o,e.credits||0);ve.setItem("tacticstrike_credits",String(l));let c=[];try{c=JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}const h=Array.from(new Set([...c,...e.purchasedWeapons||[]]));ve.setItem("tacticstrike_purchased_weapons",JSON.stringify(h)),e.name&&e.name!=="Operative"&&(je=e.name,ve.setItem("tacticstrike_player_name",je),Oe.name&&(Oe.name.value=je)),Ol(),kl(),Nl()}),fe.on("register-response",e=>{e.success||console.warn("Register failed:",e.error)}),fe.on("login-response",e=>{e.success||console.warn("Login failed:",e.error)}),fe.on("room-created",({roomId:e,players:t,autoMatch:i,mode:n,mapId:a,renderStyle:r,isRanked:o})=>{Dt=e,n&&(Kt=n),Si=o?"ranked":"casual",ot.roomCode.innerText=e;const l=document.getElementById("lobby-map-select");l&&a&&(l.value=a);const c=document.getElementById("lobby-mode-select");c&&n&&(c.value=n);const h=document.getElementById("lobby-style-select");h&&r&&(h.value=r,_i=r),i?(Pn(t),Xi("Created matchmaking room. Waiting for opponent...")):(si("lobby"),Pn(t),Xi(`Lobby created. Share code [${e}] with a friend.`))}),fe.on("room-joined",({roomId:e,players:t,mode:i,mapId:n,renderStyle:a,isRanked:r})=>{Dt=e,i&&(Kt=i),Si=r?"ranked":"casual",ot.roomCode.innerText=e,si("lobby"),Pn(t);const o=document.getElementById("lobby-map-select");o&&n&&(o.value=n);const l=document.getElementById("lobby-mode-select");l&&i&&(l.value=i);const c=document.getElementById("lobby-style-select");c&&a&&(c.value=a,_i=a),Xi(`Joined lobby: ${e}`),un&&(clearTimeout(un),un=null),za=!1}),fe.on("room-error",e=>{alert(e)}),fe.on("player-joined",({players:e})=>{Pn(e);const t=e.find(n=>n.id!==fe.id);t&&Xi(`${t.name} entered the lobby.`);const i=document.querySelector(".screen.active");i&&i.id==="matchmaking-screen"&&si("lobby")}),fe.on("players-update",({players:e})=>{Pn(e)}),fe.on("lobby-map-update",({mapId:e})=>{const t=document.getElementById("lobby-map-select");t&&(t.value=e),Xi(`Host updated mission area to: ${e==="cyberlab"?"Neon Cyber-Lab":e==="arena"?"Neon Arena":"Residential Manor"}`)}),fe.on("lobby-mode-update",({mode:e})=>{const t=document.getElementById("lobby-mode-select");t&&(t.value=e),Kt=e;let i="Duel 1v1";e==="sabotage"&&(i="Sabotage (Task Survival)"),Xi(`Host updated game mode to: ${i}`)}),fe.on("lobby-style-update",({renderStyle:e})=>{const t=document.getElementById("lobby-style-select");t&&(t.value=e),_i=e,Xi(`Host updated render style to: ${e==="competitive"?"Competitive":"Realistic"}`)}),fe.on("player-left",({players:e,message:t})=>{Pn(e),Xi(t);const i=document.querySelector(".screen.active"),n=i&&i.id==="game-screen";if(Ae&&n)if(Ae.active&&Ae.mode==="online"&&(Ae.gameState==="playing"||Ae.gameState==="countdown"||Ae.gameState==="replay")){if(or(!0),Ae.isRanked){const r=parseInt(localStorage.getItem("tacticstrike_rp")||"0")+80;localStorage.setItem("tacticstrike_rp",String(r)),Ae.localPlayer&&(Ae.localPlayer.rp=r,Ae.localPlayer.rank=Ae.localPlayer._calcRank(r))}localStorage.removeItem("tacticstrike_active_match"),Ae.endGameDueToDisconnect(t)}else if(Ae.gameState==="match-over"){const a=document.getElementById("rematch-status");a&&(a.innerText="Opponent left the room.");const r=document.getElementById("btn-rematch");r&&(r.disabled=!0,r.innerText="OPPONENT LEFT")}else localStorage.removeItem("tacticstrike_active_match"),Ae.endGameDueToDisconnect(t)}),fe.on("match-start",({players:e,seed:t,isRanked:i,mode:n,mapId:a,renderStyle:r})=>{Si=i?"ranked":"casual",r&&(_i=r),gn&&gn.classList.remove("active"),Bl(()=>{const l=e.findIndex(c=>c.id===fe.id);ot.chatMessages.innerHTML="",localStorage.setItem("tacticstrike_active_match",i?"ranked":"casual"),Ae&&Ae.destroy(),Ae=new Al("game-canvas",{mode:"online",socket:fe,localPlayerId:fe.id,localPlayerName:je,localWeapon:mt,localColor:ai,localPlayerIndex:l,players:e,seed:t,mapId:a||"manor",settings:{...We,volume:We.sfxMuted?0:We.volume},matchMode:n||Kt,isRanked:!!i,qpRenderStyle:_i,onMatchEnd:zl,onKillFeed:Hl}),si("game")})}),fe.on("opponent-requested-rematch",e=>{const t=document.getElementById("rematch-status");let i="Opponent";if(Ae&&e&&e.playerId){const n=Ae.players.find(a=>a.id===e.playerId);n&&(i=n.name)}t&&(t.innerText=`${i} requested a rematch! Click REMATCH to accept.`)})}function wa(){fe&&(fe.disconnect(),fe=null,Dt=null,window.AppSocket=null),ot&&ot.roomCode&&(ot.roomCode.innerText="-----")}function xh(){const s=document.getElementById("deploy-modal");s&&s.classList.remove("active"),Si="practice",Bl(()=>{ot.chatMessages.innerHTML="",Ae&&Ae.destroy();const t=[{id:"player",name:je,weapon:mt,color:ai}];Kt==="2v2"?(t.push({id:"bot_enemy_1",name:"Bot Miller (Enemy)",weapon:Aa(),color:"red"}),t.push({id:"bot_teammate",name:"Bot Ramirez (Teammate)",weapon:Aa(),color:"green"}),t.push({id:"bot_enemy_2",name:"Bot Cooper (Enemy)",weapon:Aa(),color:"orange"})):t.push({id:"bot_enemy_1",name:"Bot Miller (Enemy)",weapon:Aa(),color:"red"}),Ae=new Al("game-canvas",{mode:"offline",socket:null,localPlayerId:"player",localPlayerName:je,localWeapon:mt,localColor:ai,localPlayerIndex:0,players:t,seed:Math.random(),mapId:ls,settings:{...We,volume:We.sfxMuted?0:We.volume},matchMode:Kt,isRanked:!1,qpRenderStyle:_i,onMatchEnd:zl,onKillFeed:Hl}),si("game")})}function Aa(){return["pistol","rifle","shotgun","sniper","smg","lmg","dmr","vector","famas"][Math.floor(Math.random()*9)]}function zl(s){localStorage.removeItem("tacticstrike_active_match"),gn&&gn.classList.add("active");const e=!!s.isWin;let t="";if(Ae&&Ae.mode==="online"){or(e);const p=Ae.players.find(m=>m.id!==fe.id);p&&wx(p.name,e);const _=parseInt(ve.getItem("tacticstrike_credits")||"0");let g=_;if(Ae.isRanked&&e&&(g=_+50,ve.setItem("tacticstrike_credits",String(g)),t=' <span style="color:#ffd700; font-size:10px;">(+50 Credits Ranked Win Bonus!)</span>'),fe){const m=Dl(),M=parseInt(ve.getItem("tacticstrike_rp")||"0"),v=_s();let x=[];try{x=JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}fe.emit("sync-device",{uuid:m,rp:M,wins:v.wins,losses:v.losses,name:je,credits:g,purchasedWeapons:x})}}const i=document.getElementById("match-result-title"),n=document.getElementById("match-result-subtitle");i&&(e?(i.innerText="MISSION ACCOMPLISHED",i.className="result-title win"):(i.innerText="MISSION FAILED",i.className="result-title lose")),n&&(e?n.innerText="You successfully eliminated the target operative.":n.innerText="You were eliminated by the target operative.");let a="Unknown Operative";if(Ae){const p=Ae.players.find(_=>_.id===s.winnerId);p&&(a=p.name)}const r=document.getElementById("match-winner-name");r&&(r.innerText=`WINNER: ${a}`,r.style.color=e?"#39db14":"#ff3c3c");const o=document.getElementById("stat-rounds-won");o&&(o.innerText=s.roundsWon||0);const l=document.getElementById("stat-damage-dealt");l&&(l.innerText=Math.round(s.damageDealt||0));const c=document.getElementById("stat-accuracy");c&&(c.innerText=`${Math.round(s.accuracy||0)}%`);const h=document.getElementById("stat-shots-fired");h&&(h.innerText=s.shotsFired||0);const f=document.getElementById("rematch-status");f&&(f.innerText="");const d=document.getElementById("btn-rematch");d&&(d.disabled=!1,d.innerText="REMATCH"),tt.returnLobby&&(Ae&&Ae.isRanked?tt.returnLobby.innerText="RETURN TO MENU":tt.returnLobby.innerText="RETURN TO LOBBY");const u=document.getElementById("rank-result-panel");if(u){if(Ae&&Ae.isRanked&&s.newRank){const p=s.newRank,_=s.rpDelta||0,g=_>=0?`+${_} RP`:`${_} RP`,m=_>=0?"#39ff14":"#ff3c3c";u.innerHTML=`
          <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:22px;color:${p.color};">${p.icon}</span>
              <div>
                <div style="font-family:var(--font-title);font-size:11px;color:var(--text-muted);letter-spacing:1px;">CURRENT RANK</div>
                <div style="font-family:var(--font-title);font-size:18px;color:${p.color};font-weight:700;letter-spacing:2px;">${p.label}</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-family:var(--font-title);font-size:11px;color:var(--text-muted);">RANK POINTS</div>
              <div style="font-family:var(--font-title);font-size:16px;color:#fff;font-weight:700;">${s.newRP} RP</div>
              <div style="font-size:12px;color:${m};font-family:var(--font-title);margin-top:2px;">${g}</div>
            </div>
          </div>
          ${s.rankChanged?`<div style="margin-top:10px;padding:6px 12px;background:rgba(${_>=0?"57,255,20":"255,60,60"},0.12);border:1px solid ${_>=0?"#39ff14":"#ff3c3c"};border-radius:6px;font-family:var(--font-title);font-size:10px;color:${_>=0?"#39ff14":"#ff3c3c"};text-align:center;letter-spacing:1px;">${_>=0?"▲ RANK UP!":"▼ RANK DOWN"} ${s.oldRankLabel} → ${p.label}</div>`:""}
        `,u.style.display="block"}else u.innerHTML='<div style="font-family:var(--font-title); font-size:10px; color:var(--text-muted); text-align:center; letter-spacing:1.5px;">CASUAL MATCH - NO RANK EFFECT</div>',u.style.display="block";if(t){const p=document.createElement("div");p.style.cssText="font-family:var(--font-title); font-size:10px; text-align:center; margin-top:8px;",p.innerHTML=t,u.appendChild(p)}}}function Dx(){var se;const s=document.getElementById("btn-deploy-main"),e=document.getElementById("btn-close-deploy"),t=document.getElementById("deploy-modal"),i=document.getElementById("btn-play-worldloom"),n=document.getElementById("btn-close-worldloom"),a=document.getElementById("btn-leave-worldloom-unsaved"),r=document.getElementById("btn-retry-worldloom"),o=document.getElementById("btn-return-worldloom"),l=document.getElementById("worldloom-site-screen"),c=document.getElementById("worldloom-frame"),h=document.getElementById("worldloom-frame-loading"),f=h==null?void 0:h.querySelector(".worldloom-frame-actions"),d=document.getElementById("worldloom-portal-status"),u=((se=h==null?void 0:h.querySelector("small"))==null?void 0:se.textContent)||"";let p=!1,_=!1,g=null,m=0,M=!1;const v=2500,x=new Map,y=l!=null&&l.parentElement?[...l.parentElement.children].filter(G=>G!==l):[],E=new Map,A=G=>{y.forEach(ee=>{G?(E.set(ee,ee.hasAttribute("inert")),ee.setAttribute("inert","")):E.get(ee)?ee.setAttribute("inert",""):ee.removeAttribute("inert")}),G||E.clear()},S=()=>{d&&(d.hidden=!0,d.textContent=""),a&&(a.hidden=!0),f&&(f.hidden=!0),h==null||h.classList.remove("has-error")},w=(G,ee=!0)=>{_=ee,clearTimeout(g),g=null,h==null||h.classList.remove("is-hidden"),h==null||h.classList.toggle("has-error",ee),h==null||h.setAttribute("aria-busy","false");const ae=h==null?void 0:h.querySelector("small");ae&&(ae.textContent=G),f&&(f.hidden=!1)},P=(G=!1)=>{p=!1,_=!1,S(),h==null||h.classList.remove("is-hidden"),h==null||h.setAttribute("aria-busy","true");const ee=h==null?void 0:h.querySelector("small");if(ee&&(ee.textContent=u),clearTimeout(g),g=setTimeout(()=>{!p&&!_&&w("Worldloom is taking longer than expected. You can keep waiting, retry, or return.",!1)},9e3),!c)return;const ae=(i==null?void 0:i.dataset.worldloomPath)||"./worldloom/index.html";G&&c.removeAttribute("src"),c.getAttribute("src")||c.setAttribute("src",ae)},C=()=>{if(!p||!(c!=null&&c.contentWindow))return Promise.resolve(null);const G=`worldloom-save-${Date.now()}-${++m}`;return new Promise(ee=>{const ae=setTimeout(()=>{x.delete(G),ee(!1)},v);x.set(G,Te=>{clearTimeout(ae),x.delete(G),ee(!!Te)}),c.contentWindow.postMessage({source:"tacticstrike",type:"request-save",requestId:G},window.location.origin)})};window.addEventListener("message",G=>{var ae;if(G.origin!==window.location.origin||G.source!==(c==null?void 0:c.contentWindow))return;const ee=G.data;(ee==null?void 0:ee.source)==="worldloom"&&(ee.type==="ready"?(p=!0,_=!1,clearTimeout(g),g=null,S(),h==null||h.setAttribute("aria-busy","false"),h==null||h.classList.add("is-hidden")):ee.type==="save-ack"?(ae=x.get(ee.requestId))==null||ae(ee.saved):ee.type==="error"&&h&&w(ee.message||"Worldloom could not start safely. Retry or return to TacticStrike."))}),s&&t&&s.addEventListener("click",()=>{t.classList.add("active");const G=t.querySelector(".deploy-card");G&&(G.scrollTop=0),kt(),_t.pause(),_t.currentTime=0,Ut||(gt.volume=.15,gt.currentTime=0,gt.play().catch(()=>{}))}),e&&t&&e.addEventListener("click",()=>{t.classList.remove("active"),kt(),gt.pause(),gt.currentTime=0,Ut||Ul()}),i&&i.addEventListener("click",()=>{kt(),window.stopAllMusic(),t&&t.classList.remove("active"),l&&(l.classList.add("active"),l.setAttribute("aria-hidden","false")),document.body.classList.add("is-worldloom-open"),A(!0),P(!1),n==null||n.focus()}),c&&c.addEventListener("load",()=>{c.getAttribute("src")&&!p&&!_&&(h==null||h.setAttribute("aria-busy","true"))});const L=()=>{clearTimeout(g),g=null,p=!1,_=!1,c&&c.removeAttribute("src"),l&&(l.classList.remove("active"),l.setAttribute("aria-hidden","true")),document.body.classList.remove("is-worldloom-open"),A(!1),S(),h==null||h.classList.remove("is-hidden"),h==null||h.setAttribute("aria-busy","false"),t&&t.classList.add("active"),Ut||(gt.volume=.15,gt.currentTime=0,gt.play().catch(()=>{})),i==null||i.focus(),n&&(n.disabled=!1),M=!1};n&&n.addEventListener("click",async()=>{if(M)return;M=!0,n.disabled=!0,kt(),document.pointerLockElement&&document.exitPointerLock();const G=await C();if(p&&G===!1){d&&(d.textContent="SAVE FAILED — WORLD KEPT OPEN",d.hidden=!1),a&&(a.hidden=!1),n.disabled=!1,M=!1;return}L()}),a==null||a.addEventListener("click",()=>{l!=null&&l.classList.contains("active")&&L()}),r==null||r.addEventListener("click",()=>P(!0)),o==null||o.addEventListener("click",()=>n==null?void 0:n.click()),Oe.name&&Oe.name.addEventListener("change",()=>{je=Oe.name.value.trim()||"Operative",ve.setItem("tacticstrike_player_name",je),fe&&fe.connected&&fe.emit("change-name",{name:je})}),tt.practiceBot&&tt.practiceBot.addEventListener("click",()=>{Oe.name&&(je=Oe.name.value.trim()||"Operative"),ve.setItem("tacticstrike_player_name",je),xh()}),tt.btnAmongUs&&tt.btnAmongUs.addEventListener("click",()=>{Oe.name&&(je=Oe.name.value.trim()||"Operative"),ve.setItem("tacticstrike_player_name",je);const G=document.getElementById("deploy-modal");G&&G.classList.remove("active"),Si="practice",Bl(()=>{ot.chatMessages.innerHTML="",Ae&&Ae.destroy();const ae=[{id:"player",name:je,weapon:"none",color:ai},{id:"bot_enemy_1",name:"Impostor Killer",weapon:"pistol",color:"red"}];Ae=new Al("game-canvas",{mode:"offline",socket:null,localPlayerId:"player",localPlayerName:je,localWeapon:"none",localColor:ai,localPlayerIndex:0,players:ae,seed:Math.random(),mapId:ls,settings:{...We,volume:We.sfxMuted?0:We.volume},matchMode:"sabotage",isRanked:!1,qpRenderStyle:_i,onMatchEnd:zl,onKillFeed:Hl}),si("game")})}),tt.createRoom&&tt.createRoom.addEventListener("click",()=>{const G=document.getElementById("deploy-modal");G&&G.classList.remove("active"),Oe.name&&(je=Oe.name.value.trim()||"Operative"),ve.setItem("tacticstrike_player_name",je),Va(),fe&&fe.emit("create-room",{playerName:je,mode:Kt,color:ai,mapId:ls,weapon:mt,renderStyle:_i})}),tt.joinRoom&&tt.joinRoom.addEventListener("click",()=>{const G=document.getElementById("deploy-modal");G&&G.classList.remove("active");const ee=Oe.roomCode?Oe.roomCode.value.toUpperCase().trim():"";if(!ee||ee.length!==5){alert("Please enter a valid 5-character room code.");return}Oe.name&&(je=Oe.name.value.trim()||"Operative"),ve.setItem("tacticstrike_player_name",je),Va(),fe&&fe.emit("join-room",{roomId:ee,playerName:je,color:ai,weapon:mt})});function z(G){const ee=document.getElementById("deploy-modal");if(ee&&ee.classList.remove("active"),Oe.name&&(je=Oe.name.value.trim()||"Operative"),ve.setItem("tacticstrike_player_name",je),Va(),fe){const ae=parseInt(localStorage.getItem("tacticstrike_rp")||"0");za=!1;const Te=Kt+"_"+G;fe.emit("auto-match",{playerName:je,mode:Te,color:ai,rp:ae,rankStrict:!0,weapon:mt}),si("matchmaking");const be=document.getElementById("mm-rank-display"),q=document.getElementById("mm-rank-icon"),J=document.getElementById("mm-timer"),j=document.getElementById("mm-expand-notice"),Ee=Fl(ae);be&&(be.innerText=Ee.label),q&&(q.innerText=Ee.icon,q.style.color=Ee.color),J&&(J.innerText="0s"),j&&(j.innerText="Searching within your skill bracket...");let Re=0;window.mmInterval&&clearInterval(window.mmInterval),window.mmInterval=setInterval(()=>{Re++,J&&(J.innerText=`${Re}s`)},1e3);let Pe=0;const nt=document.getElementById("mm-dots");window.mmDotsInterval&&clearInterval(window.mmDotsInterval),window.mmDotsInterval=setInterval(()=>{Pe=(Pe+1)%4,nt&&(nt.innerText=".".repeat(Pe))},500),un&&clearTimeout(un),un=setTimeout(()=>{!za&&fe&&fe.connected&&(!Dt||Oa&&Oa.length===1)&&(za=!0,Xi("⚡ Rank filter removed — expanding search to all ranks..."),j&&(j.innerText="⚡ Search expanded to all skill ranks!"),Dt&&(fe.emit("leave-room"),Dt=null),fe.emit("auto-match",{playerName:je,mode:Te,color:ai,rp:ae,rankStrict:!1,weapon:mt}))},2e3)}}tt.rankedRealistic&&tt.rankedRealistic.addEventListener("click",()=>z("realistic")),tt.rankedCompetitive&&tt.rankedCompetitive.addEventListener("click",()=>z("competitive"));const B=document.getElementById("btn-cancel-matchmaking");B&&B.addEventListener("click",()=>{window.mmInterval&&clearInterval(window.mmInterval),un&&clearTimeout(un),fe&&fe.emit("leave-room"),wa(),window.stopAllMusic(),si("menu")}),tt.leaveLobby&&tt.leaveLobby.addEventListener("click",()=>{fe&&Dt&&fe.emit("leave-room"),wa(),si("menu")}),tt.readyToggle&&tt.readyToggle.addEventListener("click",()=>{if(fe&&Dt){const G=!Fs;fe.emit("player-ready",{ready:G}),_d()}}),tt.copyCode&&tt.copyCode.addEventListener("click",()=>{Dt&&navigator.clipboard.writeText(Dt).then(()=>{tt.copyCode.innerText="✅",setTimeout(()=>tt.copyCode.innerText="📋",1500)})}),tt.returnLobby&&tt.returnLobby.addEventListener("click",()=>{gn&&gn.classList.remove("active");const G=document.getElementById("rank-result-panel");G&&(G.style.display="none",G.innerHTML=""),Ae&&(Ae.destroy(),Ae=null),Ol(),fe&&Dt&&Si!=="ranked"?(si("lobby"),Fs=!1,Pn(Oa),vs(mt)):(fe&&fe.emit("leave-room"),wa(),si("menu"))});const I=document.getElementById("btn-game-menu"),U=document.getElementById("game-menu-overlay"),N=document.getElementById("btn-game-resume"),$=document.getElementById("btn-game-leave");I&&U&&I.addEventListener("click",()=>{U.classList.add("active")}),N&&U&&N.addEventListener("click",()=>{U.classList.remove("active")}),$&&U&&$.addEventListener("click",()=>{console.log("LEAVE MATCH clicked. Cleaning up game session...");try{if(U.classList.remove("active"),Ae){try{if(Ae.active&&Ae.mode==="online"&&(or(!1),Ae.isRanked)){const G=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),ee=Math.max(0,G-40);localStorage.setItem("tacticstrike_rp",String(ee))}}catch(G){console.error("Error recording match result during leave:",G)}localStorage.removeItem("tacticstrike_active_match");try{Ae.destroy()}catch(G){console.error("Error destroying gameEngine:",G)}Ae=null}}catch(G){console.error("Error in leave match handler pre-disconnect:",G)}try{fe&&Dt&&fe.emit("leave-room")}catch(G){console.error("Error emitting leave-room:",G)}try{wa()}catch(G){console.error("Error disconnecting socket:",G)}try{si("menu")}catch(G){console.error("Error showing menu screen:",G)}});const te=document.getElementById("btn-rematch");te&&te.addEventListener("click",()=>{if(Ae&&Ae.mode==="offline")gn&&gn.classList.remove("active"),Ae&&(Ae.destroy(),Ae=null),xh();else{te.disabled=!0,te.innerText="WAITING...";const G=document.getElementById("rematch-status");G&&(G.innerText="Rematch requested. Waiting for opponent..."),fe&&fe.emit("request-rematch")}}),window.addEventListener("keydown",G=>{G.key==="Enter"&&(G.preventDefault(),Oe.chat&&document.activeElement===Oe.chat?Nx():xi.game&&xi.game.classList.contains("active")&&ot.chatDrawer&&Oe.chat&&(ot.chatDrawer.classList.add("active"),Oe.chat.focus()))}),Oe.chat&&Oe.chat.addEventListener("blur",()=>{setTimeout(()=>{Oe.chat&&document.activeElement!==Oe.chat&&ot.chatDrawer&&ot.chatDrawer.classList.remove("active")},100)}),Oe.qpMapSelect&&(Oe.qpMapSelect.value=ls,Oe.qpMapSelect.addEventListener("change",G=>{ls=G.target.value,ve.setItem("tacticstrike_selected_map",ls),kt()})),Oe.lobbyMapSelect&&Oe.lobbyMapSelect.addEventListener("change",G=>{const ee=G.target.value;fe&&Dt&&fe.emit("select-map",{mapId:ee}),kt()}),Oe.lobbyModeSelect&&Oe.lobbyModeSelect.addEventListener("change",G=>{const ee=G.target.value;fe&&Dt&&fe.emit("select-game-mode",{mode:ee}),kt()}),Oe.lobbyStyleSelect&&Oe.lobbyStyleSelect.addEventListener("change",G=>{const ee=G.target.value;fe&&Dt&&fe.emit("select-render-style",{renderStyle:ee}),kt()})}function Nx(){if(!Oe.chat)return;const s=Oe.chat.value.trim();s&&(Vl(je,s,"self"),fe&&Dt&&fe.emit("chat-message",{name:je,msg:s}),Oe.chat.value=""),Oe.chat.blur()}function Vl(s,e,t){const i=document.createElement("div");i.className=`chat-msg ${t}`,t==="system"?i.innerHTML=`<span class="message">${On(e)}</span>`:i.innerHTML=`
      <span class="author">${On(s)}:</span>
      <span class="message">${On(e)}</span>
    `,ot.chatMessages&&(ot.chatMessages.appendChild(i),ot.chatMessages.scrollTop=ot.chatMessages.scrollHeight),ot.chatDrawer&&ot.chatDrawer.classList.add("active"),window.chatTimeout&&clearTimeout(window.chatTimeout),window.chatTimeout=setTimeout(()=>{Oe.chat&&document.activeElement!==Oe.chat&&ot.chatDrawer&&ot.chatDrawer.classList.remove("active")},4e3)}function Xi(s){Vl("",s,"system")}function Hl(s,e,t){var r;const i=document.getElementById("kill-feed");if(!i)return;const n=document.createElement("div");n.className="kill-msg";const a=((r=rr[t])==null?void 0:r.name)||t;n.innerHTML=`
    <span class="killer">${On(s)}</span> 
    🔫 [<span class="weapon">${a}</span>] ➔ 
    <span class="victim">${On(e)}</span>
  `,i.appendChild(n),setTimeout(()=>n.remove(),5e3)}function On(s){return s.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]||e)}function kx(){const s=document.querySelectorAll("#lobby-color-selector .color-option");s.forEach(t=>{t.addEventListener("click",()=>{s.forEach(n=>{n.classList.remove("active"),n.style.borderColor="transparent"}),t.classList.add("active"),ai=t.dataset.color;const i={cyan:"#66fcf1",green:"#39db14",purple:"#9d3bff",orange:"#ff7f3b",yellow:"#ffd700",red:"#ff3c3c"};t.style.borderColor=i[ai],ve.setItem("tacticstrike_player_color",ai),fe&&Dt&&fe.emit("select-color",{color:ai})})});const e=ve.getItem("tacticstrike_player_color");if(e){const t=document.querySelector(`#lobby-color-selector .color-option[data-color="${e}"]`);t&&t.click()}}function Ux(){document.querySelectorAll('input[name="match-mode"]').forEach(e=>{e.addEventListener("change",()=>{Kt=e.value,Wl()})})}function Wl(){const s=Kt==="2v2"?"2V2 SQUAD":"1V1 DUEL",e=(Ws[mt]||mt||"Pistol").toUpperCase(),t=document.getElementById("match-config-summary"),i=document.getElementById("match-loadout-value");t&&(t.textContent=`${s} / ${e}`),i&&(i.textContent=e)}function Bx(){const s=document.getElementById("btn-qp-style-realistic"),e=document.getElementById("btn-qp-style-competitive");if(!s||!e)return;function t(){_i==="competitive"?(e.classList.add("active"),s.classList.remove("active")):(s.classList.add("active"),e.classList.remove("active"))}s.addEventListener("click",()=>{_i="realistic",ve.setItem("tacticstrike_qp_style","realistic"),t(),kt()}),e.addEventListener("click",()=>{_i="competitive",ve.setItem("tacticstrike_qp_style","competitive"),t(),kt()}),t()}function Fx(){const s=document.querySelectorAll("#menu-weapon-selector .weapon-btn");s.forEach(e=>{e.addEventListener("click",t=>{if(e.classList.contains("locked")){t.preventDefault(),t.stopPropagation(),Es();return}s.forEach(n=>n.classList.remove("active")),e.classList.add("active"),mt=e.dataset.weapon,ve.setItem("tacticstrike_player_weapon",mt),Wl(),kt(),document.querySelectorAll(".weapon-option").forEach(n=>{n.dataset.weapon===mt?n.classList.add("active"):n.classList.remove("active")}),vs(mt),fe&&Dt&&fe.emit("select-weapon",{weapon:mt})})})}function Mn(s,e=8e3){const t=document.getElementById("notification-container");if(!t)return;const i=document.createElement("div");i.className="custom-toast",i.style.cssText=`
    background: rgba(10, 15, 25, 0.95);
    border: 1px solid #66fcf1;
    box-shadow: 0 0 15px rgba(102, 252, 241, 0.25);
    border-radius: 6px;
    padding: 14px 20px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    letter-spacing: 0.5px;
    line-height: 1.5;
    min-width: 280px;
    max-width: 360px;
    pointer-events: auto;
    cursor: pointer;
    opacity: 0;
    transform: translateX(50px);
    transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
  `;const n=document.createElement("div");n.style.cssText=`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #66fcf1;
  `,i.appendChild(n);const a=document.createElement("div");a.style.paddingLeft="6px",a.innerText=s,i.appendChild(a),i.addEventListener("click",()=>{i.style.opacity="0",i.style.transform="translateX(50px)",setTimeout(()=>i.remove(),350)}),t.appendChild(i),requestAnimationFrame(()=>{i.style.opacity="1",i.style.transform="translateX(0)"}),setTimeout(()=>{i.parentNode&&(i.style.opacity="0",i.style.transform="translateX(50px)",setTimeout(()=>i.remove(),350))},e)}document.addEventListener("DOMContentLoaded",()=>{if(/Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS/i.test(navigator.userAgent)||window.innerWidth<800){Il({immediate:!0});const l=document.getElementById("mobile-warning-screen");l&&(l.style.display="flex");return}const e=document.getElementById("startup-status");e&&Pt.token&&(e.textContent="RESTORING OPERATIVE SESSION");const t=localStorage.getItem("tacticstrike_active_match");if(t){if(or(!1),t==="ranked"){const l=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),c=Math.max(0,l-40);localStorage.setItem("tacticstrike_rp",String(c))}localStorage.removeItem("tacticstrike_active_match"),alert("Forfeit detected: You disconnected from an active match. Recorded as a loss.")}Ix();const i=Kx();Ox(),zx(),Vx(),qx(),$x(),jx(),Lx(),Fx(),kx(),Ux(),Bx(),Dx(),Cx();const n=ve.getItem("tacticstrike_player_name");if(n)je=n;else{const l=["Viper","Ghost","Specter","Rex","Apex","Phantom","Onyx","Nova"];je=`${l[Math.floor(Math.random()*l.length)]}_${Math.floor(Math.random()*900+100)}`,ve.setItem("tacticstrike_player_name",je)}Oe.name&&(Oe.name.value=je),Va(),si("menu"),kl(),Ol(),mt=ve.getItem("tacticstrike_player_weapon")||"pistol",Nl(),document.querySelectorAll("#menu-weapon-selector .weapon-btn").forEach(l=>{l.dataset.weapon===mt?l.classList.add("active"):l.classList.remove("active")}),document.querySelectorAll(".weapon-option").forEach(l=>{l.dataset.weapon===mt?l.classList.add("active"):l.classList.remove("active")}),vs(mt),Wl(),Mx(i)});function eo(s){const e=Fn[s];if(!e)return!0;try{if(JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]").includes(s))return!0}catch{}return parseInt(ve.getItem("tacticstrike_rp")||"0")>=e.rp}function Ox(){const s=document.getElementById("news-modal"),e=document.getElementById("btn-close-news");if(!s||!e)return;sessionStorage.getItem("tacticstrike_news_seen")||s.classList.add("active"),e.addEventListener("click",()=>{s.classList.remove("active"),sessionStorage.setItem("tacticstrike_news_seen","true"),kt()})}function zx(){const s=document.getElementById("whats-new-modal"),e=document.getElementById("btn-open-whats-new"),t=document.getElementById("btn-close-whats-new");!s||!e||!t||(e.addEventListener("click",()=>{s.classList.add("active"),kt()}),t.addEventListener("click",()=>{s.classList.remove("active"),kt()}))}function Vx(){const s=document.getElementById("credit-shop-modal"),e=document.getElementById("btn-open-credit-shop"),t=document.getElementById("btn-close-credit-shop"),i=document.querySelectorAll("#credit-shop-modal [data-buy-credit-pack]");!s||!t||(e==null||e.addEventListener("click",()=>ll("menu")),document.addEventListener("click",n=>{var r;const a=n.target.closest("[data-open-credit-shop]");a&&(a.closest("#account-modal")&&((r=document.getElementById("account-modal"))==null||r.classList.remove("active")),ll(a.closest("#shop-modal")?"item-shop":"menu"))}),document.addEventListener("click",n=>{const a=n.target.closest("[data-buy-credit-pack]");a&&(n.preventDefault(),Hx(a.dataset.buyCreditPack))}),t.addEventListener("click",()=>{s.classList.remove("active"),Mi("close")}),i.forEach(n=>n.addEventListener("click",()=>Mi("confirm"))))}function ll(s="menu"){const e=document.getElementById("credit-shop-modal");e&&(e.dataset.source=s,e.classList.add("active"),Mi("open"))}async function Hx(s){if(!Pt.user||!Pt.token){Gs("login","Sign in or create an account before purchasing credits.");return}const e=document.querySelector(`[data-buy-credit-pack="${s}"]`),t=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.textContent="OPENING SECURE CHECKOUT…");try{const i=await ji("/api/credits/checkout",{method:"POST",body:JSON.stringify({packageId:s})});Mi("confirm"),window.location.assign(i.checkoutUrl)}catch(i){if(e&&(e.disabled=!1,e.innerHTML=t),i.status===401){Za(),Gs("login","Your session expired. Sign in again to continue.");return}Mn(i.message,6e3),Es()}}function Un(s="",e=""){const t=document.getElementById("purchase-support-message");t&&(t.textContent=s,t.className=`support-notice${e?` ${e}`:""}`)}function lr(s){const e=new Date(s);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{dateStyle:"medium",timeStyle:"short"})}function Gl(s){return s.closed?"CLOSED":s.status==="approved"?`${s.creditsGranted.toLocaleString()} CREDITS ADDED`:s.status==="denied"?"DENIED":"AWAITING REVIEW"}function Ed(s){return s.closed?"closed":s.status||"open"}function Wx(s){return new Promise((e,t)=>{if(!s){t(new Error("Attach a receipt screenshot as proof of purchase."));return}if(!["image/png","image/jpeg","image/webp"].includes(s.type)){t(new Error("Upload a PNG, JPG, or WebP receipt image."));return}if(s.size>15e5){t(new Error("Receipt images must be smaller than 1.5 MB."));return}const i=new FileReader;i.onload=()=>e({name:s.name,data:i.result}),i.onerror=()=>t(new Error("The receipt image could not be read.")),i.readAsDataURL(s)})}function Td(s){const e=document.createElement("div");e.className=`support-message-bubble ${s.senderRole}`;const t=document.createElement("div");t.className="support-message-meta";const i=document.createElement("span");i.textContent=s.senderRole==="admin"?"TACTICSTRIKE SUPPORT":"YOU";const n=document.createElement("span");if(n.textContent=lr(s.createdAt),t.append(i,n),e.appendChild(t),s.body){const a=document.createElement("div");a.textContent=s.body,e.appendChild(a)}if(s.proofData){const a=document.createElement("img");a.className="support-proof-image",a.src=s.proofData,a.alt=s.proofName?`Purchase proof: ${s.proofName}`:"Purchase proof",e.appendChild(a)}return e}function Gx(s){if(!(s!=null&&s.id))return;const e=`tacticstrike_server_credits_seen_${s.id}`,t=Math.max(0,parseInt(ve.getItem(e)||"0")),i=Math.max(0,Number(s.credits||0));if(i>t){const n=Math.max(0,parseInt(ve.getItem("tacticstrike_credits")||"0"));ve.setItem("tacticstrike_credits",String(n+(i-t)))}ve.setItem(e,String(i))}async function Ha(){var e;const s=document.getElementById("purchase-support-cases");if(s){s.innerHTML='<div class="support-empty-state">Loading secure conversations…</div>';try{const t=await ji("/api/purchase-support/cases");if(t.user&&(Pt.user=t.user,yn()),!t.cases.length){s.innerHTML='<div class="support-empty-state">No purchase-verification chats yet.</div>';return}const i=await Promise.all(t.cases.map(n=>ji(`/api/purchase-support/cases/${n.id}`)));s.innerHTML="",i.forEach(n=>Xx(n.purchaseCase,s))}catch(t){if(t.status===401){Za(),(e=document.getElementById("purchase-support-modal"))==null||e.classList.remove("active"),Gs("login","Your session expired. Sign in again to view purchase support.");return}s.innerHTML='<div class="support-empty-state">Purchase chats could not be loaded. Try refreshing.</div>',Un(t.message,"error")}}}function Xx(s,e){const t=document.createElement("article");t.className="support-case-card";const i=document.createElement("div");i.className="support-case-summary";const n=document.createElement("div"),a=document.createElement("strong");a.textContent=`ORDER ${s.orderNumber}`;const r=document.createElement("small");r.textContent=`${s.requestedCredits.toLocaleString()}-credit verification · opened ${lr(s.createdAt)}`,n.append(a,r);const o=document.createElement("span");o.className=`case-status ${Ed(s)}`,o.textContent=Gl(s),i.append(n,o),t.appendChild(i);const l=document.createElement("div");if(l.className="support-message-list",s.messages.forEach(c=>l.appendChild(Td(c))),t.appendChild(l),!s.closed){const c=document.createElement("form");c.className="support-reply-form";const h=document.createElement("input");h.type="text",h.maxLength=1500,h.required=!0,h.placeholder="Reply to support…";const f=document.createElement("button");f.type="submit",f.textContent="SEND",c.append(h,f),c.addEventListener("submit",async d=>{d.preventDefault(),f.disabled=!0;try{await ji(`/api/purchase-support/cases/${s.id}/messages`,{method:"POST",body:JSON.stringify({message:h.value})}),Un("Reply sent securely.","success"),await Ha()}catch(u){Un(u.message,"error")}finally{f.disabled=!1}}),t.appendChild(c)}e.appendChild(t),requestAnimationFrame(()=>{l.scrollTop=l.scrollHeight})}function qx(){const s=document.getElementById("purchase-support-modal"),e=document.getElementById("btn-open-purchase-support"),t=document.getElementById("btn-close-purchase-support"),i=document.getElementById("btn-refresh-purchase-support"),n=document.getElementById("purchase-support-form");!s||!e||!t||!n||(e.addEventListener("click",()=>{if(!Pt.user||!Pt.token){Gs("login","Sign in before submitting purchase proof.");return}s.classList.add("active"),Un(),Mi("open"),Ha()}),t.addEventListener("click",()=>{s.classList.remove("active"),Mi("close")}),i==null||i.addEventListener("click",Ha),n.addEventListener("submit",async a=>{a.preventDefault();const r=n.querySelector('button[type="submit"]');r.disabled=!0,Un("Encrypting and submitting your purchase proof…","info");try{const o=document.getElementById("purchase-proof-file").files[0],l=await Wx(o);await ji("/api/purchase-support/cases",{method:"POST",body:JSON.stringify({orderNumber:document.getElementById("purchase-order-number").value,packageId:document.getElementById("purchase-package").value,message:document.getElementById("purchase-support-text").value,proof:l})}),n.reset(),Un("Purchase proof submitted. Support will reply within 1–12 hours.","success"),Mi("confirm"),await Ha()}catch(o){Un(o.message,"error"),Es()}finally{r.disabled=!1}}))}function cs(s="",e=""){const t=document.getElementById("admin-login-message");t&&(t.textContent=s,t.className=`support-notice${e?` ${e}`:""}`)}function cl(s){const e=document.getElementById("admin-login-view"),t=document.getElementById("admin-dashboard-view");e&&(e.hidden=s),t&&(t.hidden=!s)}function Xl(){fs=null,Pl=null,ve.removeItem(Cl),cl(!1)}async function Os(s=Pl){const e=document.getElementById("admin-case-list"),t=document.getElementById("admin-case-detail");if(!(!e||!t)){e.innerHTML='<div class="support-empty-state">Loading purchase queue…</div>';try{const i=await xs("/api/admin/purchase-cases");if(!i.cases.length){e.innerHTML='<div class="support-empty-state">No messages submitted.</div>',t.innerHTML='<div class="support-empty-state">The verification queue is empty.</div>';return}e.innerHTML="",i.cases.forEach(a=>{const r=document.createElement("button");r.type="button",r.dataset.caseId=a.id,r.className=`admin-case-list-item${a.id===s?" active":""}`;const o=document.createElement("strong");o.textContent=a.userEmail||"Unknown account";const l=document.createElement("span");l.textContent=`Order ${a.orderNumber}`;const c=document.createElement("small");c.textContent=`${Gl(a)} · ${lr(a.updatedAt)}`,r.append(o,l,c),r.addEventListener("click",()=>_h(a.id)),e.appendChild(r)});const n=i.cases.some(a=>a.id===s)?s:i.cases[0].id;await _h(n,!1)}catch(i){if(i.status===401){Xl(),cs("Admin session expired. Sign in again.","error");return}e.innerHTML='<div class="support-empty-state">The verification queue could not be loaded.</div>',t.innerHTML=""}}}async function _h(s,e=!0){var i;const t=document.getElementById("admin-case-detail");if(t){Pl=s,e&&(document.querySelectorAll(".admin-case-list-item").forEach(n=>n.classList.remove("active")),(i=document.querySelector(`.admin-case-list-item[data-case-id="${s}"]`))==null||i.classList.add("active")),t.innerHTML='<div class="support-empty-state">Loading secure chat…</div>';try{const n=await xs(`/api/admin/purchase-cases/${s}`);Yx(n.purchaseCase)}catch(n){if(n.status===401){Xl(),cs("Admin session expired. Sign in again.","error");return}t.innerHTML='<div class="support-empty-state">This purchase chat could not be loaded.</div>'}}}function Yx(s){const e=document.getElementById("admin-case-detail");if(!e)return;e.innerHTML="";const t=document.createElement("div");t.className="admin-case-detail-head";const i=document.createElement("div"),n=document.createElement("span");n.className="section-kicker",n.textContent=s.userEmail||"OPERATIVE ACCOUNT";const a=document.createElement("h3");a.textContent=`ORDER ${s.orderNumber}`;const r=document.createElement("p");r.textContent=`Requested package: ${s.requestedCredits.toLocaleString()} credits · opened ${lr(s.createdAt)}`,i.append(n,a,r);const o=document.createElement("span");o.className=`case-status ${Ed(s)}`,o.textContent=Gl(s),t.append(i,o),e.appendChild(t);const l=document.createElement("div");if(l.className="support-message-list admin-message-list",s.messages.forEach(d=>l.appendChild(Td(d))),e.appendChild(l),!s.closed){const d=document.createElement("form");d.className="support-reply-form admin-reply-form";const u=document.createElement("input");u.type="text",u.maxLength=1500,u.required=!0,u.placeholder="Reply to this user…";const p=document.createElement("button");p.type="submit",p.textContent="SEND REPLY",d.append(u,p),d.addEventListener("submit",async _=>{_.preventDefault(),p.disabled=!0;try{await xs(`/api/admin/purchase-cases/${s.id}/messages`,{method:"POST",body:JSON.stringify({message:u.value})}),await Os(s.id)}catch(g){Mn(g.message,5e3)}finally{p.disabled=!1}}),e.appendChild(d)}const c=document.createElement("div");c.className="admin-actions",[50,500,2e3].forEach(d=>{const u=document.createElement("button");u.type="button",u.textContent=`ADD ${d.toLocaleString()} CREDITS`,u.disabled=s.closed||s.status==="approved",u.addEventListener("click",()=>to(s,"grant",d)),c.appendChild(u)});const h=document.createElement("button");h.type="button",h.className="danger",h.textContent="DENY PROOF",h.disabled=s.closed||s.status==="approved",h.addEventListener("click",()=>to(s,"deny"));const f=document.createElement("button");f.type="button",f.className="close-chat",f.textContent="CLOSE CHAT",f.disabled=s.closed,f.addEventListener("click",()=>to(s,"close")),c.append(h,f),e.appendChild(c),requestAnimationFrame(()=>{l.scrollTop=l.scrollHeight})}async function to(s,e,t=0){const i=e==="grant"?`Add ${t.toLocaleString()} credits to ${s.userEmail}? This cannot be granted twice.`:e==="deny"?`Deny the proof submitted for order ${s.orderNumber}?`:"Close this chat? The user will no longer be able to reply.";if(window.confirm(i))try{await xs(`/api/admin/purchase-cases/${s.id}/decision`,{method:"POST",body:JSON.stringify({action:e,credits:t})}),Mn(e==="grant"?`${t.toLocaleString()} credits added.`:e==="deny"?"Proof denied.":"Chat closed.",4500),await Os(s.id)}catch(n){Mn(n.message,5500),Es()}}function $x(){var o,l;const s=document.getElementById("admin-modal"),e=document.getElementById("version-admin-trigger"),t=document.getElementById("btn-close-admin"),i=document.getElementById("admin-login-form");if(!s||!t||!i)return;const n=()=>{s.classList.add("active"),cs(),cl(!!fs),Mi("open"),fs&&Os()};let a=0,r=null;e==null||e.addEventListener("click",()=>{if(a+=1,clearTimeout(r),a>=5){a=0,n();return}r=setTimeout(()=>{a=0},2200)}),t.addEventListener("click",()=>{s.classList.remove("active"),Mi("close")}),i.addEventListener("submit",async c=>{c.preventDefault();const h=i.querySelector('button[type="submit"]');h.disabled=!0,cs("Authenticating with the secure server…","info");try{const f=await xs("/api/admin/login",{method:"POST",body:JSON.stringify({username:document.getElementById("admin-username").value,password:document.getElementById("admin-password").value})});fs=f.token,ve.setItem(Cl,f.token),i.reset(),cl(!0),await Os()}catch(f){cs(f.message,"error")}finally{h.disabled=!1}}),(o=document.getElementById("btn-refresh-admin-cases"))==null||o.addEventListener("click",()=>Os()),(l=document.getElementById("btn-admin-logout"))==null||l.addEventListener("click",async()=>{try{await xs("/api/admin/logout",{method:"POST"})}catch{}Xl(),cs("Signed out of the admin dashboard.","success")})}function qi(s="",e=""){const t=document.getElementById("account-message");t&&(t.textContent=s,t.className=`account-message${e?` ${e}`:""}`)}function Wa(s="login"){const e=document.getElementById("account-tab-login"),t=document.getElementById("account-tab-register"),i=document.getElementById("account-login-form"),n=document.getElementById("account-register-form"),a=s==="login";e==null||e.classList.toggle("active",a),t==null||t.classList.toggle("active",!a),e==null||e.setAttribute("aria-selected",String(a)),t==null||t.setAttribute("aria-selected",String(!a)),i&&(i.hidden=!a),n&&(n.hidden=a)}function yn(){const s=Pt.user;s&&(Gx(s),Pt.token&&ve.setItem(ys,JSON.stringify(s)));const e=document.getElementById("btn-open-account"),t=document.getElementById("credit-shop-account-status"),i=document.getElementById("account-profile-email"),n=document.getElementById("account-profile-credits"),a=document.getElementById("account-auth-view"),r=document.getElementById("account-profile-view"),o=document.querySelectorAll("#credit-shop-modal [data-buy-credit-pack]");if(e&&(e.textContent=s?`ACCOUNT · ${s.displayName||s.email.split("@")[0]}`:Bn?"ACCOUNT":"SIGN IN",e.classList.toggle("signed-in",!!s)),t){t.classList.toggle("signed-in",!!s);const l=t.querySelector("span:last-child");l&&(l.textContent=s?`SIGNED IN · ${s.email}`:Bn?"RESTORING ACCOUNT…":"SIGN IN TO PURCHASE")}i&&(i.textContent=(s==null?void 0:s.email)||""),n&&(n.textContent=String((s==null?void 0:s.credits)||0)),a&&(a.hidden=!!s),r&&(r.hidden=!s),o.forEach(l=>{l.firstChild&&(l.firstChild.textContent=s?"CONTINUE TO CHECKOUT ":Bn?"RESTORING ACCOUNT… ":"SIGN IN TO BUY ")})}function vh(s){Pt={token:s.token,user:s.user},Bn=!1,ve.setItem(Rl,s.token),ve.setItem(ys,JSON.stringify(s.user)),yn()}function Za(){Pt={token:null,user:null},Bn=!1,ve.removeItem(Rl),ve.removeItem(ys),yn()}function Gs(s="login",e=""){var t;Wa(s),qi(e,e?"info":""),yn(),(t=document.getElementById("account-modal"))==null||t.classList.add("active"),Mi("open")}function Kx(){var n,a,r;const s=document.getElementById("account-modal"),e=document.getElementById("btn-close-account"),t=document.getElementById("account-login-form"),i=document.getElementById("account-register-form");return!s||!e||!t||!i?Promise.resolve():(document.addEventListener("click",o=>{o.target.closest("[data-open-account], #btn-open-account")&&Gs("login")}),e.addEventListener("click",()=>{s.classList.remove("active"),Mi("close")}),(n=document.getElementById("account-tab-login"))==null||n.addEventListener("click",()=>{Wa("login"),qi()}),(a=document.getElementById("account-tab-register"))==null||a.addEventListener("click",()=>{Wa("register"),qi()}),t.addEventListener("submit",async o=>{o.preventDefault();const l=t.querySelector('button[type="submit"]');l.disabled=!0,qi("Authenticating…","info");try{const c=await ji("/api/auth/login",{method:"POST",body:JSON.stringify({email:document.getElementById("account-login-email").value,password:document.getElementById("account-login-password").value})});vh(c),Mn("Welcome back, operative.",4e3)}catch(c){qi(c.message,"error")}finally{l.disabled=!1}}),i.addEventListener("submit",async o=>{o.preventDefault();const l=document.getElementById("account-register-password").value,c=document.getElementById("account-register-confirm").value;if(l!==c){qi("Passcodes do not match.","error");return}const h=i.querySelector('button[type="submit"]');h.disabled=!0,qi("Creating secure operative profile…","info");try{const f=await ji("/api/auth/register",{method:"POST",body:JSON.stringify({email:document.getElementById("account-register-email").value,password:l})});vh(f),Mn("Operative account created.",4500)}catch(f){qi(f.message,"error")}finally{h.disabled=!1}}),(r=document.getElementById("btn-account-logout"))==null||r.addEventListener("click",async()=>{try{await ji("/api/auth/logout",{method:"POST"})}catch{}Za(),Wa("login"),qi("Signed out successfully.","success")}),yn(),Pt.token?ji("/api/auth/me").then(l=>{Pt.user=l.user,ve.setItem(ys,JSON.stringify(l.user)),yn()}).catch(l=>{if(l.status===401){Za();return}console.warn("Account session validation was delayed:",l)}).finally(()=>{Bn=!1,yn()}):(Bn=!1,yn(),Promise.resolve()))}function jx(){const s=document.getElementById("shop-modal"),e=document.getElementById("btn-open-shop"),t=document.getElementById("btn-close-shop");!s||!e||!t||(ve.getItem("tacticstrike_credits")===null&&ve.setItem("tacticstrike_credits","0"),e.addEventListener("click",()=>{wd(),s.classList.add("active"),kt()}),t.addEventListener("click",()=>{s.classList.remove("active"),kt()}))}function wd(){const s=document.getElementById("shop-items-container"),e=document.getElementById("shop-credits-display"),t=document.getElementById("shop-owned-count"),i=document.getElementById("shop-available-count");if(!s||!e)return;const n=parseInt(ve.getItem("tacticstrike_credits")||"0");e.innerText=n;let a=[];try{a=JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}const r=parseInt(ve.getItem("tacticstrike_rp")||"0");s.innerHTML="";let o=0,l=0;Object.keys(Fn).forEach(c=>{const h=Fn[c],f=bx[c],d=a.includes(c),u=r>=h.rp,p=n>=h.price,_=d||u;_?o+=1:p&&(l+=1);const g=document.createElement("article");g.className=`shop-item-card tier-${f.tier.toLowerCase()}${_?" is-owned":""}${!p&&!_?" needs-credits":""}`;let m="",M="";d?(m='<span class="shop-item-status owned"><i></i>ACQUIRED</span>',M='<button class="shop-buy-action owned" disabled>IN YOUR ARMORY</button>'):u?(m='<span class="shop-item-status rank"><i></i>RANK UNLOCKED</span>',M='<button class="shop-buy-action owned" disabled>AVAILABLE IN LOADOUT</button>'):(m=`<span class="shop-item-status locked"><i></i>${h.rank} CLEARANCE</span>`,p?M=`<button class="shop-buy-action buy-btn" data-weapon="${c}">UNLOCK EARLY <span>→</span></button>`:M=`<button class="shop-buy-action top-up" type="button" data-open-credit-shop>GET CREDITS <span>+${(h.price-n).toLocaleString()}</span></button>`);const v=rr[c]||{name:c};g.innerHTML=`
      <div class="shop-item-topline">
        <span>${f.tier} ISSUE</span>
        ${m}
      </div>
      <div class="shop-item-visual" aria-hidden="true">
        <span class="shop-item-code">${f.code}</span>
        <span class="shop-item-crosshair"></span>
        <small>${f.role}</small>
      </div>
      <div class="shop-item-copy">
        <h4>${v.name}</h4>
        <p>${f.description}</p>
      </div>
      <div class="shop-item-stats">
        <span><small>DAMAGE</small><strong>${v.damagePct}</strong></span>
        <span><small>ACCURACY</small><strong>${v.accuracy}</strong></span>
        <span><small>CAPACITY</small><strong>${v.magSize}</strong></span>
      </div>
      <div class="shop-item-unlock">
        <span>STANDARD UNLOCK</span><strong>${h.rank} · ${h.rp.toLocaleString()} RP</strong>
      </div>
      <div class="shop-item-purchase">
        <div class="shop-item-price"><img class="mini-credit-mark" src="/tacticstrike-credit-stack.webp" alt="" aria-hidden="true"><strong>${h.price.toLocaleString()}</strong><small>CREDITS</small></div>
        ${M}
      </div>
    `,s.appendChild(g)}),t&&(t.textContent=o),i&&(i.textContent=l),s.querySelectorAll(".buy-btn").forEach(c=>{c.addEventListener("click",()=>{const h=c.dataset.weapon;Zx(h)})})}function Zx(s){const e=Fn[s];if(!e)return;const t=parseInt(ve.getItem("tacticstrike_credits")||"0");if(t<e.price){Es(),Mn(`You need ${(e.price-t).toLocaleString()} more credits for ${Ws[s]}.`,4500),ll("item-shop");return}const i=t-e.price;ve.setItem("tacticstrike_credits",String(i));let n=[];try{n=JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}n.includes(s)||(n.push(s),ve.setItem("tacticstrike_purchased_weapons",JSON.stringify(n)));try{const a=window.AudioContext||window.webkitAudioContext;if(a){const r=new a,o=r.createOscillator(),l=r.createGain();o.type="sine",o.frequency.setValueAtTime(587.33,r.currentTime),o.frequency.setValueAtTime(880,r.currentTime+.1),l.gain.setValueAtTime(.15,r.currentTime),l.gain.exponentialRampToValueAtTime(.001,r.currentTime+.35),o.connect(l),l.connect(r.destination),o.start(),o.stop(r.currentTime+.38)}}catch{}if(Mn(`Successfully unlocked ${Ws[s]} early!`,6e3),fe){const a=Dl(),r=parseInt(ve.getItem("tacticstrike_rp")||"0"),o=_s();fe.emit("sync-device",{uuid:a,rp:r,wins:o.wins,losses:o.losses,name:je,credits:i,purchasedWeapons:n})}wd(),Nl()}function io(s){const e=document.getElementById("total-player-count-value"),t=document.getElementById("qp-player-count"),i=document.getElementById("ranked-real-player-count"),n=document.getElementById("ranked-comp-player-count");e&&s&&s.total!==void 0&&(e.innerText=s.total),t&&s&&s.quickplay!==void 0&&(t.innerText=s.quickplay),i&&s&&s.ranked_realistic!==void 0&&(i.innerText=s.ranked_realistic),n&&s&&s.ranked_competitive!==void 0&&(n.innerText=s.ranked_competitive)}window.addEventListener("opponent-chat-msg",s=>{const{name:e,msg:t}=s.detail;Vl(e,t,"opponent")});
