const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dialog-controller-B4LIXejs.js","assets/account-client-D3X58vZL.js"])))=>i.map(i=>d[i]);
import{r as Dh,a as mo,c as Zd,A as Jd,b as Nh,g as kh}from"./account-client-D3X58vZL.js";const Qd="modulepreload",ef=function(n){return"/"+n},dc={},tf=function(e,t,i){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),o=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));s=Promise.allSettled(t.map(l=>{if(l=ef(l),l in dc)return;dc[l]=!0;const c=l.endsWith(".css"),h=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${h}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":Qd,c||(f.as="script"),f.crossOrigin="",f.href=l,o&&f.setAttribute("nonce",o),document.head.appendChild(f),c)return new Promise((d,u)=>{f.addEventListener("load",d),f.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(r){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=r,window.dispatchEvent(o),!o.defaultPrevented)throw r}return s.then(r=>{for(const o of r||[])o.status==="rejected"&&a(o.reason);return e().catch(a)})},Bi=Object.create(null);Bi.open="0";Bi.close="1";Bi.ping="2";Bi.pong="3";Bi.message="4";Bi.upgrade="5";Bi.noop="6";const Na=Object.create(null);Object.keys(Bi).forEach(n=>{Na[Bi[n]]=n});const go={type:"error",data:"parser error"},Uh=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Fh=typeof ArrayBuffer=="function",Bh=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,Sl=({type:n,data:e},t,i)=>Uh&&e instanceof Blob?t?i(e):fc(e,i):Fh&&(e instanceof ArrayBuffer||Bh(e))?t?i(e):fc(new Blob([e]),i):i(Bi[n]+(e||"")),fc=(n,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(n)};function uc(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let vr;function nf(n,e){if(Uh&&n.data instanceof Blob)return n.data.arrayBuffer().then(uc).then(e);if(Fh&&(n.data instanceof ArrayBuffer||Bh(n.data)))return e(uc(n.data));Sl(n,!1,t=>{vr||(vr=new TextEncoder),e(vr.encode(t))})}const pc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Bs=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<pc.length;n++)Bs[pc.charCodeAt(n)]=n;const sf=n=>{let e=n.length*.75,t=n.length,i,s=0,a,r,o,l;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const c=new ArrayBuffer(e),h=new Uint8Array(c);for(i=0;i<t;i+=4)a=Bs[n.charCodeAt(i)],r=Bs[n.charCodeAt(i+1)],o=Bs[n.charCodeAt(i+2)],l=Bs[n.charCodeAt(i+3)],h[s++]=a<<2|r>>4,h[s++]=(r&15)<<4|o>>2,h[s++]=(o&3)<<6|l&63;return c},af=typeof ArrayBuffer=="function",Ml=(n,e)=>{if(typeof n!="string")return{type:"message",data:Oh(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:rf(n.substring(1),e)}:Na[t]?n.length>1?{type:Na[t],data:n.substring(1)}:{type:Na[t]}:go},rf=(n,e)=>{if(af){const t=sf(n);return Oh(t,e)}else return{base64:!0,data:n}},Oh=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},zh="",of=(n,e)=>{const t=n.length,i=new Array(t);let s=0;n.forEach((a,r)=>{Sl(a,!1,o=>{i[r]=o,++s===t&&e(i.join(zh))})})},lf=(n,e)=>{const t=n.split(zh),i=[];for(let s=0;s<t.length;s++){const a=Ml(t[s],e);if(i.push(a),a.type==="error")break}return i};function cf(){return new TransformStream({transform(n,e){nf(n,t=>{const i=t.length;let s;if(i<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,i);else if(i<65536){s=new Uint8Array(3);const a=new DataView(s.buffer);a.setUint8(0,126),a.setUint16(1,i)}else{s=new Uint8Array(9);const a=new DataView(s.buffer);a.setUint8(0,127),a.setBigUint64(1,BigInt(i))}n.data&&typeof n.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(t)})}})}let _r;function sa(n){return n.reduce((e,t)=>e+t.length,0)}function aa(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let i=0;for(let s=0;s<e;s++)t[s]=n[0][i++],i===n[0].length&&(n.shift(),i=0);return n.length&&i<n[0].length&&(n[0]=n[0].slice(i)),t}function hf(n,e){_r||(_r=new TextDecoder);const t=[];let i=0,s=-1,a=!1;return new TransformStream({transform(r,o){for(t.push(r);;){if(i===0){if(sa(t)<1)break;const l=aa(t,1);a=(l[0]&128)===128,s=l[0]&127,s<126?i=3:s===126?i=1:i=2}else if(i===1){if(sa(t)<2)break;const l=aa(t,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),i=3}else if(i===2){if(sa(t)<8)break;const l=aa(t,8),c=new DataView(l.buffer,l.byteOffset,l.length),h=c.getUint32(0);if(h>Math.pow(2,21)-1){o.enqueue(go);break}s=h*Math.pow(2,32)+c.getUint32(4),i=3}else{if(sa(t)<s)break;const l=aa(t,s);o.enqueue(Ml(a?l:_r.decode(l),e)),i=0}if(s===0||s>n){o.enqueue(go);break}}}})}const Vh=4;function It(n){if(n)return df(n)}function df(n){for(var e in It.prototype)n[e]=It.prototype[e];return n}It.prototype.on=It.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};It.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};It.prototype.off=It.prototype.removeListener=It.prototype.removeAllListeners=It.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var i,s=0;s<t.length;s++)if(i=t[s],i===e||i.fn===e){t.splice(s,1);break}return t.length===0&&delete this._callbacks["$"+n],this};It.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,s=t.length;i<s;++i)t[i].apply(this,e)}return this};It.prototype.emitReserved=It.prototype.emit;It.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};It.prototype.hasListeners=function(n){return!!this.listeners(n).length};const or=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),di=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),ff="arraybuffer";function Hh(n,...e){return e.reduce((t,i)=>(n.hasOwnProperty(i)&&(t[i]=n[i]),t),{})}const uf=di.setTimeout,pf=di.clearTimeout;function lr(n,e){e.useNativeTimers?(n.setTimeoutFn=uf.bind(di),n.clearTimeoutFn=pf.bind(di)):(n.setTimeoutFn=di.setTimeout.bind(di),n.clearTimeoutFn=di.clearTimeout.bind(di))}const mf=1.33;function gf(n){return typeof n=="string"?yf(n):Math.ceil((n.byteLength||n.size)*mf)}function yf(n){let e=0,t=0;for(let i=0,s=n.length;i<s;i++)e=n.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function Gh(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function xf(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function vf(n){let e={},t=n.split("&");for(let i=0,s=t.length;i<s;i++){let a=t[i].split("=");e[decodeURIComponent(a[0])]=decodeURIComponent(a[1])}return e}class _f extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class bl extends It{constructor(e){super(),this.writable=!1,lr(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new _f(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=Ml(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=xf(e);return t.length?"?"+t:""}}class Sf extends bl{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};lf(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,of(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=Gh()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let Wh=!1;try{Wh=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Mf=Wh;function bf(){}class Ef extends Sf{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(s,a)=>{this.onError("xhr post error",s,a)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class Ni extends It{constructor(e,t,i){super(),this.createRequest=e,lr(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=Hh(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&i.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var s;i.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=Ni.requestsCount++,Ni.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=bf,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ni.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Ni.requestsCount=0;Ni.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",mc);else if(typeof addEventListener=="function"){const n="onpagehide"in di?"pagehide":"unload";addEventListener(n,mc,!1)}}function mc(){for(let n in Ni.requests)Ni.requests.hasOwnProperty(n)&&Ni.requests[n].abort()}const Tf=function(){const n=Xh({xdomain:!1});return n&&n.responseType!==null}();class wf extends Ef{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Tf&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Ni(Xh,this.uri(),e)}}function Xh(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Mf))return new XMLHttpRequest}catch{}if(!e)try{return new di[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const qh=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Af extends bl{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=qh?{}:Hh(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;Sl(i,this.supportsBinary,a=>{try{this.doWrite(i,a)}catch{}s&&or(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=Gh()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const Sr=di.WebSocket||di.MozWebSocket;class Rf extends Af{createSocket(e,t,i){return qh?new Sr(e,t,i):t?new Sr(e,t):new Sr(e)}doWrite(e,t){this.ws.send(t)}}class Cf extends bl{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=hf(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),s=cf();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const a=()=>{i.read().then(({done:o,value:l})=>{o||(this.onPacket(l),a())}).catch(o=>{})};a();const r={type:"open"};this.query.sid&&(r.data=`{"sid":"${this.query.sid}"}`),this._writer.write(r).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;this._writer.write(i).then(()=>{s&&or(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Pf={websocket:Rf,webtransport:Cf,polling:wf},If=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Lf=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function yo(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),i=n.indexOf("]");t!=-1&&i!=-1&&(n=n.substring(0,t)+n.substring(t,i).replace(/:/g,";")+n.substring(i,n.length));let s=If.exec(n||""),a={},r=14;for(;r--;)a[Lf[r]]=s[r]||"";return t!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a.pathNames=Df(a,a.path),a.queryKey=Nf(a,a.query),a}function Df(n,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function Nf(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,s,a){s&&(t[s]=a)}),t}const xo=typeof addEventListener=="function"&&typeof removeEventListener=="function",ka=[];xo&&addEventListener("offline",()=>{ka.forEach(n=>n())},!1);class Mn extends It{constructor(e,t){if(super(),this.binaryType=ff,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=yo(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=yo(t.host).host);lr(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const s=i.prototype.name;this.transports.push(s),this._transportsByName[s]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=vf(this.opts.query)),xo&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},ka.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=Vh,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&Mn.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",Mn.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const s=this.writeBuffer[i].data;if(s&&(t+=gf(s)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,or(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,s){if(typeof t=="function"&&(s=t,t=void 0),typeof i=="function"&&(s=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const a={type:e,data:t,options:i};this.emitReserved("packetCreate",a),this.writeBuffer.push(a),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(Mn.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),xo&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=ka.indexOf(this._offlineEventListener);i!==-1&&ka.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}Mn.protocol=Vh;class kf extends Mn{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;Mn.priorWebsocketSuccess=!1;const s=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",f=>{if(!i)if(f.type==="pong"&&f.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;Mn.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(h(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const d=new Error("probe error");d.transport=t.name,this.emitReserved("upgradeError",d)}}))};function a(){i||(i=!0,h(),t.close(),t=null)}const r=f=>{const d=new Error("probe error: "+f);d.transport=t.name,a(),this.emitReserved("upgradeError",d)};function o(){r("transport closed")}function l(){r("socket closed")}function c(f){t&&f.name!==t.name&&a()}const h=()=>{t.removeListener("open",s),t.removeListener("error",r),t.removeListener("close",o),this.off("close",l),this.off("upgrading",c)};t.once("open",s),t.once("error",r),t.once("close",o),this.once("close",l),this.once("upgrading",c),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let Uf=class extends kf{constructor(e,t={}){const i=typeof e=="object",s=i?{...e}:{...t};(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(a=>Pf[a]).filter(a=>!!a)),super(i?s:e,s)}};function Ff(n,e="",t){let i=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),i=yo(n)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const a=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+a+":"+i.port+e,i.href=i.protocol+"://"+a+(t&&t.port===i.port?"":":"+i.port),i}const Bf=typeof ArrayBuffer=="function",Of=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,$h=Object.prototype.toString,zf=typeof Blob=="function"||typeof Blob<"u"&&$h.call(Blob)==="[object BlobConstructor]",Vf=typeof File=="function"||typeof File<"u"&&$h.call(File)==="[object FileConstructor]";function El(n){return Bf&&(n instanceof ArrayBuffer||Of(n))||zf&&n instanceof Blob||Vf&&n instanceof File}function Ua(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,i=n.length;t<i;t++)if(Ua(n[t]))return!0;return!1}if(El(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return Ua(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&Ua(n[t]))return!0;return!1}function Hf(n){const e=[],t=n.data,i=n;return i.data=Fa(t,e),i.attachments=e.length,{packet:i,buffers:e}}function Fa(n,e,t){if(!n)return n;if(El(n)){const i={_placeholder:!0,num:e.length};return e.push(n),i}else if(Array.isArray(n)){const i=new Array(n.length);for(let s=0;s<n.length;s++)i[s]=Fa(n[s],e);return i}else if(typeof n=="object"&&!(n instanceof Date)){if(n.toJSON&&typeof n.toJSON=="function"&&!t)return Fa(n.toJSON(),e,!0);const i={};for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&(i[s]=Fa(n[s],e));return i}return n}function Gf(n,e){return n.data=vo(n.data,e),delete n.attachments,n}function vo(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=vo(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=vo(n[t],e));return n}const Wf=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var qe;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(qe||(qe={}));class Xf{constructor(e){this.replacer=e}encode(e){return(e.type===qe.EVENT||e.type===qe.ACK)&&Ua(e)?this.encodeAsBinary({type:e.type===qe.EVENT?qe.BINARY_EVENT:qe.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===qe.BINARY_EVENT||e.type===qe.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=Hf(e),i=this.encodeAsString(t.packet),s=t.buffers;return s.unshift(i),s}}class Tl extends It{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===qe.BINARY_EVENT;i||t.type===qe.BINARY_ACK?(t.type=i?qe.EVENT:qe.ACK,this.reconstructor=new qf(t)):super.emitReserved("decoded",t)}else if(El(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if(qe[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===qe.BINARY_EVENT||i.type===qe.BINARY_ACK){const a=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const r=e.substring(a,t);if(r!=Number(r)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const o=Number(r);if(!$f(o)||o<1)throw new Error("Illegal attachments");if(o>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=o}if(e.charAt(t+1)==="/"){const a=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(a,t)}else i.nsp="/";const s=e.charAt(t+1);if(s!==""&&Number(s)==s){const a=t+1;for(;++t;){const r=e.charAt(t);if(r==null||Number(r)!=r){--t;break}if(t===e.length)break}i.id=Number(e.substring(a,t+1))}if(e.charAt(++t)){const a=this.tryParse(e.substr(t));if(Tl.isPayloadValid(i.type,a))i.data=a;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case qe.CONNECT:return gc(t);case qe.DISCONNECT:return t===void 0;case qe.CONNECT_ERROR:return typeof t=="string"||gc(t);case qe.EVENT:case qe.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&Wf.indexOf(t[0])===-1);case qe.ACK:case qe.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class qf{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=Gf(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const $f=Number.isInteger||function(n){return typeof n=="number"&&isFinite(n)&&Math.floor(n)===n};function gc(n){return Object.prototype.toString.call(n)==="[object Object]"}const Yf=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Tl,Encoder:Xf,get PacketType(){return qe}},Symbol.toStringTag,{value:"Module"}));function _i(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const Kf=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Yh extends It{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[_i(e,"open",this.onopen.bind(this)),_i(e,"packet",this.onpacket.bind(this)),_i(e,"error",this.onerror.bind(this)),_i(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,s,a;if(Kf.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const r={type:qe.EVENT,data:t};if(r.options={},r.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const h=this.ids++,f=t.pop();this._registerAckCallback(h,f),r.id=h}const o=(s=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||s===void 0?void 0:s.writable,l=this.connected&&!(!((a=this.io.engine)===null||a===void 0)&&a._hasPingExpired());return this.flags.volatile&&!o||(l?(this.notifyOutgoingListeners(r),this.packet(r)):this.sendBuffer.push(r)),this.flags={},this}_registerAckCallback(e,t){var i;const s=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(s===void 0){this.acks[e]=t;return}const a=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let o=0;o<this.sendBuffer.length;o++)this.sendBuffer[o].id===e&&this.sendBuffer.splice(o,1);t.call(this,new Error("operation has timed out"))},s),r=(...o)=>{this.io.clearTimeoutFn(a),t.apply(this,o)};r.withError=!0,this.acks[e]=r}emitWithAck(e,...t){return new Promise((i,s)=>{const a=(r,o)=>r?s(r):i(o);a.withError=!0,t.push(a),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...a)=>(this._queue[0],s!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(s)):(this._queue.shift(),t&&t(null,...a)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:qe.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case qe.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case qe.EVENT:case qe.BINARY_EVENT:this.onevent(e);break;case qe.ACK:case qe.BINARY_ACK:this.onack(e);break;case qe.DISCONNECT:this.ondisconnect();break;case qe.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...s){i||(i=!0,t.packet({type:qe.ACK,id:e,data:s}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:qe.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function ws(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}ws.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};ws.prototype.reset=function(){this.attempts=0};ws.prototype.setMin=function(n){this.ms=n};ws.prototype.setMax=function(n){this.max=n};ws.prototype.setJitter=function(n){this.jitter=n};class _o extends It{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,lr(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new ws({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const s=t.parser||Yf;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Uf(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const s=_i(t,"open",function(){i.onopen(),e&&e()}),a=o=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",o),e?e(o):this.maybeReconnectOnOpen()},r=_i(t,"error",a);if(this._timeout!==!1){const o=this._timeout,l=this.setTimeoutFn(()=>{s(),a(new Error("timeout")),t.close()},o);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(s),this.subs.push(r),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(_i(e,"ping",this.onping.bind(this)),_i(e,"data",this.ondata.bind(this)),_i(e,"error",this.onerror.bind(this)),_i(e,"close",this.onclose.bind(this)),_i(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){or(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new Yh(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Ps={};function Ba(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=Ff(n,e.path||"/socket.io"),i=t.source,s=t.id,a=t.path,r=Ps[s]&&a in Ps[s].nsps,o=e.forceNew||e["force new connection"]||e.multiplex===!1||r;let l;return o?l=new _o(i,e):(Ps[s]||(Ps[s]=new _o(i,e)),l=Ps[s]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(Ba,{Manager:_o,Socket:Yh,io:Ba,connect:Ba});/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const wl="184",jf=0,yc=1,Zf=2,Oa=1,Jf=2,Os=3,En=0,ii=1,Ki=2,Zi=0,us=1,So=2,xc=3,vc=4,Qf=5,Dn=100,eu=101,tu=102,iu=103,nu=104,su=200,au=201,ru=202,ou=203,Mo=204,bo=205,lu=206,cu=207,hu=208,du=209,fu=210,uu=211,pu=212,mu=213,gu=214,Eo=0,To=1,wo=2,ys=3,Ao=4,Ro=5,Co=6,Po=7,Kh=0,yu=1,xu=2,ki=0,jh=1,Zh=2,Jh=3,Qh=4,ed=5,td=6,id=7,nd=300,Hn=301,xs=302,Mr=303,br=304,cr=306,Io=1e3,ji=1001,Lo=1002,Vt=1003,vu=1004,ra=1005,$t=1006,Er=1007,kn=1008,oi=1009,sd=1010,ad=1011,qs=1012,Al=1013,Oi=1014,Li=1015,en=1016,Rl=1017,Cl=1018,$s=1020,rd=35902,od=35899,ld=1021,cd=1022,Ti=1023,tn=1026,Un=1027,hd=1028,Pl=1029,Gn=1030,Il=1031,Ll=1033,za=33776,Va=33777,Ha=33778,Ga=33779,Do=35840,No=35841,ko=35842,Uo=35843,Fo=36196,Bo=37492,Oo=37496,zo=37488,Vo=37489,$a=37490,Ho=37491,Go=37808,Wo=37809,Xo=37810,qo=37811,$o=37812,Yo=37813,Ko=37814,jo=37815,Zo=37816,Jo=37817,Qo=37818,el=37819,tl=37820,il=37821,nl=36492,sl=36494,al=36495,rl=36283,ol=36284,Ya=36285,ll=36286,_u=3200,cl=0,Su=1,mn="",hi="srgb",Ka="srgb-linear",ja="linear",st="srgb",Yn=7680,_c=519,Mu=512,bu=513,Eu=514,Dl=515,Tu=516,wu=517,Nl=518,Au=519,Sc=35044,Mc="300 es",Di=2e3,Ys=2001;function Ru(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Za(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Cu(){const n=Za("canvas");return n.style.display="block",n}const bc={};function Ec(...n){const e="THREE."+n.shift();console.log(e,...n)}function dd(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function De(...n){n=dd(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Ze(...n){n=dd(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function hl(...n){const e=n.join(" ");e in bc||(bc[e]=!0,De(...n))}function Pu(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}const Iu={[Eo]:To,[wo]:Co,[Ao]:Po,[ys]:Ro,[To]:Eo,[Co]:wo,[Po]:Ao,[Ro]:ys};class Xn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Tr=Math.PI/180,dl=180/Math.PI;function ea(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Wt[n&255]+Wt[n>>8&255]+Wt[n>>16&255]+Wt[n>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[t&63|128]+Wt[t>>8&255]+"-"+Wt[t>>16&255]+Wt[t>>24&255]+Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]).toLowerCase()}function Ye(n,e,t){return Math.max(e,Math.min(t,n))}function Lu(n,e){return(n%e+e)%e}function wr(n,e,t){return(1-t)*n+t*e}function Is(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ti(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Jl=class Jl{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ye(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Jl.prototype.isVector2=!0;let et=Jl;class As{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,o){let l=i[s+0],c=i[s+1],h=i[s+2],f=i[s+3],d=a[r+0],u=a[r+1],p=a[r+2],v=a[r+3];if(f!==v||l!==d||c!==u||h!==p){let g=l*d+c*u+h*p+f*v;g<0&&(d=-d,u=-u,p=-p,v=-v,g=-g);let m=1-o;if(g<.9995){const M=Math.acos(g),_=Math.sin(M);m=Math.sin(m*M)/_,o=Math.sin(o*M)/_,l=l*m+d*o,c=c*m+u*o,h=h*m+p*o,f=f*m+v*o}else{l=l*m+d*o,c=c*m+u*o,h=h*m+p*o,f=f*m+v*o;const M=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=M,c*=M,h*=M,f*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,a,r){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],f=a[r],d=a[r+1],u=a[r+2],p=a[r+3];return e[t]=o*p+h*f+l*u-c*d,e[t+1]=l*p+h*d+c*f-o*u,e[t+2]=c*p+h*u+o*d-l*f,e[t+3]=h*p-o*f-l*d-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),f=o(a/2),d=l(i/2),u=l(s/2),p=l(a/2);switch(r){case"XYZ":this._x=d*h*f+c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f-d*u*p;break;case"YXZ":this._x=d*h*f+c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f+d*u*p;break;case"ZXY":this._x=d*h*f-c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f-d*u*p;break;case"ZYX":this._x=d*h*f-c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f+d*u*p;break;case"YZX":this._x=d*h*f+c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f-d*u*p;break;case"XZY":this._x=d*h*f-c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f+d*u*p;break;default:De("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],d=i+o+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(a-c)*u,this._z=(r-s)*u}else if(i>o&&i>f){const u=2*Math.sqrt(1+i-o-f);this._w=(h-l)/u,this._x=.25*u,this._y=(s+r)/u,this._z=(a+c)/u}else if(o>f){const u=2*Math.sqrt(1+o-i-f);this._w=(a-c)/u,this._x=(s+r)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-o);this._w=(r-s)/u,this._x=(a+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ye(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+r*o+s*c-a*l,this._y=s*h+r*l+a*o-i*c,this._z=a*h+r*c+i*l-s*o,this._w=r*h-i*o-s*l-a*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+a*t,this._w=this._w*l+r*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+a*t,this._w=this._w*l+r*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Ql=class Ql{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Tc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Tc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,o=e.z,l=e.w,c=2*(r*s-o*i),h=2*(o*t-a*s),f=2*(a*i-r*t);return this.x=t+l*c+r*f-o*h,this.y=i+l*h+o*c-a*f,this.z=s+l*f+a*h-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,o=t.y,l=t.z;return this.x=s*l-a*o,this.y=a*r-i*l,this.z=i*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ar.copy(this).projectOnVector(e),this.sub(Ar)}reflect(e){return this.sub(Ar.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ye(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Ql.prototype.isVector3=!0;let V=Ql;const Ar=new V,Tc=new As,ec=class ec{constructor(e,t,i,s,a,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c)}set(e,t,i,s,a,r,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=a,h[5]=l,h[6]=i,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],p=i[8],v=s[0],g=s[3],m=s[6],M=s[1],_=s[4],x=s[7],y=s[2],E=s[5],A=s[8];return a[0]=r*v+o*M+l*y,a[3]=r*g+o*_+l*E,a[6]=r*m+o*x+l*A,a[1]=c*v+h*M+f*y,a[4]=c*g+h*_+f*E,a[7]=c*m+h*x+f*A,a[2]=d*v+u*M+p*y,a[5]=d*g+u*_+p*E,a[8]=d*m+u*x+p*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*r*h-t*o*c-i*a*h+i*o*l+s*a*c-s*r*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*r-o*c,d=o*l-h*a,u=c*a-r*l,p=t*f+i*d+s*u;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return e[0]=f*v,e[1]=(s*c-h*i)*v,e[2]=(o*i-s*r)*v,e[3]=d*v,e[4]=(h*t-s*l)*v,e[5]=(s*a-o*t)*v,e[6]=u*v,e[7]=(i*l-c*t)*v,e[8]=(r*t-i*a)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,o){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+e,-s*c,s*l,-s*(-c*r+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Rr.makeScale(e,t)),this}rotate(e){return this.premultiply(Rr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Rr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ec.prototype.isMatrix3=!0;let Ue=ec;const Rr=new Ue,wc=new Ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ac=new Ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Du(){const n={enabled:!0,workingColorSpace:Ka,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===st&&(s.r=Ji(s.r),s.g=Ji(s.g),s.b=Ji(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===st&&(s.r=ps(s.r),s.g=ps(s.g),s.b=ps(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===mn?ja:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return hl("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return hl("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ka]:{primaries:e,whitePoint:i,transfer:ja,toXYZ:wc,fromXYZ:Ac,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:hi},outputColorSpaceConfig:{drawingBufferColorSpace:hi}},[hi]:{primaries:e,whitePoint:i,transfer:st,toXYZ:wc,fromXYZ:Ac,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:hi}}}),n}const $e=Du();function Ji(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ps(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Kn;class Nu{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Kn===void 0&&(Kn=Za("canvas")),Kn.width=e.width,Kn.height=e.height;const s=Kn.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Kn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Za("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Ji(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ji(t[i]/255)*255):t[i]=Ji(t[i]);return{data:t,width:e.width,height:e.height}}else return De("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ku=0;class kl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ku++}),this.uuid=ea(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Cr(s[r].image)):a.push(Cr(s[r]))}else a=Cr(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function Cr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Nu.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(De("Texture: Unable to serialize Texture."),{})}let Uu=0;const Pr=new V;class Qt extends Xn{constructor(e=Qt.DEFAULT_IMAGE,t=Qt.DEFAULT_MAPPING,i=ji,s=ji,a=$t,r=kn,o=Ti,l=oi,c=Qt.DEFAULT_ANISOTROPY,h=mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Uu++}),this.uuid=ea(),this.name="",this.source=new kl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new et(0,0),this.repeat=new et(1,1),this.center=new et(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Pr).x}get height(){return this.source.getSize(Pr).y}get depth(){return this.source.getSize(Pr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){De(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){De(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==nd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Io:e.x=e.x-Math.floor(e.x);break;case ji:e.x=e.x<0?0:1;break;case Lo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Io:e.y=e.y-Math.floor(e.y);break;case ji:e.y=e.y<0?0:1;break;case Lo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Qt.DEFAULT_IMAGE=null;Qt.DEFAULT_MAPPING=nd;Qt.DEFAULT_ANISOTROPY=1;const tc=class tc{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const l=e.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],p=l[9],v=l[2],g=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-v)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+v)<.1&&Math.abs(p+g)<.1&&Math.abs(c+u+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(c+1)/2,x=(u+1)/2,y=(m+1)/2,E=(h+d)/4,A=(f+v)/4,S=(p+g)/4;return _>x&&_>y?_<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(_),s=E/i,a=A/i):x>y?x<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(x),i=E/s,a=S/s):y<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(y),i=A/a,s=S/a),this.set(i,s,a,t),this}let M=Math.sqrt((g-p)*(g-p)+(f-v)*(f-v)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(g-p)/M,this.y=(f-v)/M,this.z=(d-h)/M,this.w=Math.acos((c+u+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this.w=Ye(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this.w=Ye(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};tc.prototype.isVector4=!0;let Mt=tc;class Fu extends Xn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$t,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Mt(0,0,e,t),this.scissorTest=!1,this.viewport=new Mt(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},a=new Qt(s),r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:$t,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new kl(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ui extends Fu{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class fd extends Qt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Bu extends Qt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const rr=class rr{constructor(e,t,i,s,a,r,o,l,c,h,f,d,u,p,v,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c,h,f,d,u,p,v,g)}set(e,t,i,s,a,r,o,l,c,h,f,d,u,p,v,g){const m=this.elements;return m[0]=e,m[4]=t,m[8]=i,m[12]=s,m[1]=a,m[5]=r,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=f,m[14]=d,m[3]=u,m[7]=p,m[11]=v,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new rr().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,s=1/jn.setFromMatrixColumn(e,0).length(),a=1/jn.setFromMatrixColumn(e,1).length(),r=1/jn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(e.order==="XYZ"){const d=r*h,u=r*f,p=o*h,v=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=u+p*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=p+u*c,t[10]=r*l}else if(e.order==="YXZ"){const d=l*h,u=l*f,p=c*h,v=c*f;t[0]=d+v*o,t[4]=p*o-u,t[8]=r*c,t[1]=r*f,t[5]=r*h,t[9]=-o,t[2]=u*o-p,t[6]=v+d*o,t[10]=r*l}else if(e.order==="ZXY"){const d=l*h,u=l*f,p=c*h,v=c*f;t[0]=d-v*o,t[4]=-r*f,t[8]=p+u*o,t[1]=u+p*o,t[5]=r*h,t[9]=v-d*o,t[2]=-r*c,t[6]=o,t[10]=r*l}else if(e.order==="ZYX"){const d=r*h,u=r*f,p=o*h,v=o*f;t[0]=l*h,t[4]=p*c-u,t[8]=d*c+v,t[1]=l*f,t[5]=v*c+d,t[9]=u*c-p,t[2]=-c,t[6]=o*l,t[10]=r*l}else if(e.order==="YZX"){const d=r*l,u=r*c,p=o*l,v=o*c;t[0]=l*h,t[4]=v-d*f,t[8]=p*f+u,t[1]=f,t[5]=r*h,t[9]=-o*h,t[2]=-c*h,t[6]=u*f+p,t[10]=d-v*f}else if(e.order==="XZY"){const d=r*l,u=r*c,p=o*l,v=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=d*f+v,t[5]=r*h,t[9]=u*f-p,t[2]=p*f-u,t[6]=o*h,t[10]=v*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ou,e,zu)}lookAt(e,t,i){const s=this.elements;return ai.subVectors(e,t),ai.lengthSq()===0&&(ai.z=1),ai.normalize(),rn.crossVectors(i,ai),rn.lengthSq()===0&&(Math.abs(i.z)===1?ai.x+=1e-4:ai.z+=1e-4,ai.normalize(),rn.crossVectors(i,ai)),rn.normalize(),oa.crossVectors(ai,rn),s[0]=rn.x,s[4]=oa.x,s[8]=ai.x,s[1]=rn.y,s[5]=oa.y,s[9]=ai.y,s[2]=rn.z,s[6]=oa.z,s[10]=ai.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],p=i[2],v=i[6],g=i[10],m=i[14],M=i[3],_=i[7],x=i[11],y=i[15],E=s[0],A=s[4],S=s[8],w=s[12],P=s[1],C=s[5],I=s[9],z=s[13],N=s[2],L=s[6],U=s[10],B=s[14],Y=s[3],Q=s[7],ne=s[11],de=s[15];return a[0]=r*E+o*P+l*N+c*Y,a[4]=r*A+o*C+l*L+c*Q,a[8]=r*S+o*I+l*U+c*ne,a[12]=r*w+o*z+l*B+c*de,a[1]=h*E+f*P+d*N+u*Y,a[5]=h*A+f*C+d*L+u*Q,a[9]=h*S+f*I+d*U+u*ne,a[13]=h*w+f*z+d*B+u*de,a[2]=p*E+v*P+g*N+m*Y,a[6]=p*A+v*C+g*L+m*Q,a[10]=p*S+v*I+g*U+m*ne,a[14]=p*w+v*z+g*B+m*de,a[3]=M*E+_*P+x*N+y*Y,a[7]=M*A+_*C+x*L+y*Q,a[11]=M*S+_*I+x*U+y*ne,a[15]=M*w+_*z+x*B+y*de,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],d=e[10],u=e[14],p=e[3],v=e[7],g=e[11],m=e[15],M=l*u-c*d,_=o*u-c*f,x=o*d-l*f,y=r*u-c*h,E=r*d-l*h,A=r*f-o*h;return t*(v*M-g*_+m*x)-i*(p*M-g*y+m*E)+s*(p*_-v*y+m*A)-a*(p*x-v*E+g*A)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],d=e[10],u=e[11],p=e[12],v=e[13],g=e[14],m=e[15],M=t*o-i*r,_=t*l-s*r,x=t*c-a*r,y=i*l-s*o,E=i*c-a*o,A=s*c-a*l,S=h*v-f*p,w=h*g-d*p,P=h*m-u*p,C=f*g-d*v,I=f*m-u*v,z=d*m-u*g,N=M*z-_*I+x*C+y*P-E*w+A*S;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/N;return e[0]=(o*z-l*I+c*C)*L,e[1]=(s*I-i*z-a*C)*L,e[2]=(v*A-g*E+m*y)*L,e[3]=(d*E-f*A-u*y)*L,e[4]=(l*P-r*z-c*w)*L,e[5]=(t*z-s*P+a*w)*L,e[6]=(g*x-p*A-m*_)*L,e[7]=(h*A-d*x+u*_)*L,e[8]=(r*I-o*P+c*S)*L,e[9]=(i*P-t*I-a*S)*L,e[10]=(p*E-v*x+m*M)*L,e[11]=(f*x-h*E-u*M)*L,e[12]=(o*w-r*C-l*S)*L,e[13]=(t*C-i*w+s*S)*L,e[14]=(v*_-p*y-g*M)*L,e[15]=(h*y-f*_+d*M)*L,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,o=e.y,l=e.z,c=a*r,h=a*o;return this.set(c*r+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*r,0,c*l-s*o,h*l+s*r,a*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,o=t._z,l=t._w,c=a+a,h=r+r,f=o+o,d=a*c,u=a*h,p=a*f,v=r*h,g=r*f,m=o*f,M=l*c,_=l*h,x=l*f,y=i.x,E=i.y,A=i.z;return s[0]=(1-(v+m))*y,s[1]=(u+x)*y,s[2]=(p-_)*y,s[3]=0,s[4]=(u-x)*E,s[5]=(1-(d+m))*E,s[6]=(g+M)*E,s[7]=0,s[8]=(p+_)*A,s[9]=(g-M)*A,s[10]=(1-(d+v))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const a=this.determinant();if(a===0)return i.set(1,1,1),t.identity(),this;let r=jn.set(s[0],s[1],s[2]).length();const o=jn.set(s[4],s[5],s[6]).length(),l=jn.set(s[8],s[9],s[10]).length();a<0&&(r=-r),ui.copy(this);const c=1/r,h=1/o,f=1/l;return ui.elements[0]*=c,ui.elements[1]*=c,ui.elements[2]*=c,ui.elements[4]*=h,ui.elements[5]*=h,ui.elements[6]*=h,ui.elements[8]*=f,ui.elements[9]*=f,ui.elements[10]*=f,t.setFromRotationMatrix(ui),i.x=r,i.y=o,i.z=l,this}makePerspective(e,t,i,s,a,r,o=Di,l=!1){const c=this.elements,h=2*a/(t-e),f=2*a/(i-s),d=(t+e)/(t-e),u=(i+s)/(i-s);let p,v;if(l)p=a/(r-a),v=r*a/(r-a);else if(o===Di)p=-(r+a)/(r-a),v=-2*r*a/(r-a);else if(o===Ys)p=-r/(r-a),v=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=f,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,a,r,o=Di,l=!1){const c=this.elements,h=2/(t-e),f=2/(i-s),d=-(t+e)/(t-e),u=-(i+s)/(i-s);let p,v;if(l)p=1/(r-a),v=r/(r-a);else if(o===Di)p=-2/(r-a),v=-(r+a)/(r-a);else if(o===Ys)p=-1/(r-a),v=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=f,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};rr.prototype.isMatrix4=!0;let Ct=rr;const jn=new V,ui=new Ct,Ou=new V(0,0,0),zu=new V(1,1,1),rn=new V,oa=new V,ai=new V,Rc=new Ct,Cc=new As;class Tn{constructor(e=0,t=0,i=0,s=Tn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],d=s[6],u=s[10];switch(t){case"XYZ":this._y=Math.asin(Ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ye(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-Ye(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(Ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Ye(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,u),this._y=0);break;default:De("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Rc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Rc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Cc.setFromEuler(this),this.setFromQuaternion(Cc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tn.DEFAULT_ORDER="XYZ";class ud{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Vu=0;const Pc=new V,Zn=new As,Hi=new Ct,la=new V,Ls=new V,Hu=new V,Gu=new As,Ic=new V(1,0,0),Lc=new V(0,1,0),Dc=new V(0,0,1),Nc={type:"added"},Wu={type:"removed"},Jn={type:"childadded",child:null},Ir={type:"childremoved",child:null};class Yt extends Xn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vu++}),this.uuid=ea(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Yt.DEFAULT_UP.clone();const e=new V,t=new Tn,i=new As,s=new V(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ct},normalMatrix:{value:new Ue}}),this.matrix=new Ct,this.matrixWorld=new Ct,this.matrixAutoUpdate=Yt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ud,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Zn.setFromAxisAngle(e,t),this.quaternion.multiply(Zn),this}rotateOnWorldAxis(e,t){return Zn.setFromAxisAngle(e,t),this.quaternion.premultiply(Zn),this}rotateX(e){return this.rotateOnAxis(Ic,e)}rotateY(e){return this.rotateOnAxis(Lc,e)}rotateZ(e){return this.rotateOnAxis(Dc,e)}translateOnAxis(e,t){return Pc.copy(e).applyQuaternion(this.quaternion),this.position.add(Pc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ic,e)}translateY(e){return this.translateOnAxis(Lc,e)}translateZ(e){return this.translateOnAxis(Dc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Hi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?la.copy(e):la.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Ls.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hi.lookAt(Ls,la,this.up):Hi.lookAt(la,Ls,this.up),this.quaternion.setFromRotationMatrix(Hi),s&&(Hi.extractRotation(s.matrixWorld),Zn.setFromRotationMatrix(Hi),this.quaternion.premultiply(Zn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ze("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Nc),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null):Ze("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Wu),Ir.child=e,this.dispatchEvent(Ir),Ir.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Hi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Hi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Hi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Nc),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ls,e,Hu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ls,Gu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,a=this.matrix.elements;a[12]+=t-a[0]*t-a[4]*i-a[8]*s,a[13]+=i-a[1]*t-a[5]*i-a[9]*s,a[14]+=s-a[2]*t-a[6]*i-a[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];a(e.shapes,f)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(a(e.animations,l))}}if(t){const o=r(e.geometries),l=r(e.materials),c=r(e.textures),h=r(e.images),f=r(e.shapes),d=r(e.skeletons),u=r(e.animations),p=r(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),p.length>0&&(i.nodes=p)}return i.object=s,i;function r(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Yt.DEFAULT_UP=new V(0,1,0);Yt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Fn extends Yt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Xu={type:"move"};class Lr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Fn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Fn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Fn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){r=!0;for(const v of e.hand.values()){const g=t.getJointPose(v,i),m=this._getHandJoint(c,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,p=.005;c.inputState.pinching&&d>u+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=u-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Xu)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Fn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const pd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},on={h:0,s:0,l:0},ca={h:0,s:0,l:0};function Dr(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class tt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=hi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=$e.workingColorSpace){return this.r=e,this.g=t,this.b=i,$e.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=$e.workingColorSpace){if(e=Lu(e,1),t=Ye(t,0,1),i=Ye(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=Dr(r,a,e+1/3),this.g=Dr(r,a,e),this.b=Dr(r,a,e-1/3)}return $e.colorSpaceToWorking(this,s),this}setStyle(e,t=hi){function i(a){a!==void 0&&parseFloat(a)<1&&De("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:De("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);De("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=hi){const i=pd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):De("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ji(e.r),this.g=Ji(e.g),this.b=Ji(e.b),this}copyLinearToSRGB(e){return this.r=ps(e.r),this.g=ps(e.g),this.b=ps(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=hi){return $e.workingToColorSpace(Xt.copy(this),e),Math.round(Ye(Xt.r*255,0,255))*65536+Math.round(Ye(Xt.g*255,0,255))*256+Math.round(Ye(Xt.b*255,0,255))}getHexString(e=hi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.workingToColorSpace(Xt.copy(this),t);const i=Xt.r,s=Xt.g,a=Xt.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let l,c;const h=(o+r)/2;if(o===r)l=0,c=0;else{const f=r-o;switch(c=h<=.5?f/(r+o):f/(2-r-o),r){case i:l=(s-a)/f+(s<a?6:0);break;case s:l=(a-i)/f+2;break;case a:l=(i-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=$e.workingColorSpace){return $e.workingToColorSpace(Xt.copy(this),t),e.r=Xt.r,e.g=Xt.g,e.b=Xt.b,e}getStyle(e=hi){$e.workingToColorSpace(Xt.copy(this),e);const t=Xt.r,i=Xt.g,s=Xt.b;return e!==hi?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(on),this.setHSL(on.h+e,on.s+t,on.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(on),e.getHSL(ca);const i=wr(on.h,ca.h,t),s=wr(on.s,ca.s,t),a=wr(on.l,ca.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xt=new tt;tt.NAMES=pd;class qu extends Yt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const pi=new V,Gi=new V,Nr=new V,Wi=new V,Qn=new V,es=new V,kc=new V,kr=new V,Ur=new V,Fr=new V,Br=new Mt,Or=new Mt,zr=new Mt;class Mi{constructor(e=new V,t=new V,i=new V){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),pi.subVectors(e,t),s.cross(pi);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){pi.subVectors(s,t),Gi.subVectors(i,t),Nr.subVectors(e,t);const r=pi.dot(pi),o=pi.dot(Gi),l=pi.dot(Nr),c=Gi.dot(Gi),h=Gi.dot(Nr),f=r*c-o*o;if(f===0)return a.set(0,0,0),null;const d=1/f,u=(c*l-o*h)*d,p=(r*h-o*l)*d;return a.set(1-u-p,p,u)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Wi)===null?!1:Wi.x>=0&&Wi.y>=0&&Wi.x+Wi.y<=1}static getInterpolation(e,t,i,s,a,r,o,l){return this.getBarycoord(e,t,i,s,Wi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Wi.x),l.addScaledVector(r,Wi.y),l.addScaledVector(o,Wi.z),l)}static getInterpolatedAttribute(e,t,i,s,a,r){return Br.setScalar(0),Or.setScalar(0),zr.setScalar(0),Br.fromBufferAttribute(e,t),Or.fromBufferAttribute(e,i),zr.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(Br,a.x),r.addScaledVector(Or,a.y),r.addScaledVector(zr,a.z),r}static isFrontFacing(e,t,i,s){return pi.subVectors(i,t),Gi.subVectors(e,t),pi.cross(Gi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return pi.subVectors(this.c,this.b),Gi.subVectors(this.a,this.b),pi.cross(Gi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Mi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Mi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return Mi.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return Mi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Mi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,o;Qn.subVectors(s,i),es.subVectors(a,i),kr.subVectors(e,i);const l=Qn.dot(kr),c=es.dot(kr);if(l<=0&&c<=0)return t.copy(i);Ur.subVectors(e,s);const h=Qn.dot(Ur),f=es.dot(Ur);if(h>=0&&f<=h)return t.copy(s);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return r=l/(l-h),t.copy(i).addScaledVector(Qn,r);Fr.subVectors(e,a);const u=Qn.dot(Fr),p=es.dot(Fr);if(p>=0&&u<=p)return t.copy(a);const v=u*c-l*p;if(v<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(i).addScaledVector(es,o);const g=h*p-u*f;if(g<=0&&f-h>=0&&u-p>=0)return kc.subVectors(a,s),o=(f-h)/(f-h+(u-p)),t.copy(s).addScaledVector(kc,o);const m=1/(g+v+d);return r=v*m,o=d*m,t.copy(i).addScaledVector(Qn,r).addScaledVector(es,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Wn{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(mi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(mi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=mi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,mi):mi.fromBufferAttribute(a,r),mi.applyMatrix4(e.matrixWorld),this.expandByPoint(mi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ha.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ha.copy(i.boundingBox)),ha.applyMatrix4(e.matrixWorld),this.union(ha)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,mi),mi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ds),da.subVectors(this.max,Ds),ts.subVectors(e.a,Ds),is.subVectors(e.b,Ds),ns.subVectors(e.c,Ds),ln.subVectors(is,ts),cn.subVectors(ns,is),An.subVectors(ts,ns);let t=[0,-ln.z,ln.y,0,-cn.z,cn.y,0,-An.z,An.y,ln.z,0,-ln.x,cn.z,0,-cn.x,An.z,0,-An.x,-ln.y,ln.x,0,-cn.y,cn.x,0,-An.y,An.x,0];return!Vr(t,ts,is,ns,da)||(t=[1,0,0,0,1,0,0,0,1],!Vr(t,ts,is,ns,da))?!1:(fa.crossVectors(ln,cn),t=[fa.x,fa.y,fa.z],Vr(t,ts,is,ns,da))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,mi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(mi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Xi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Xi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Xi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Xi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Xi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Xi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Xi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Xi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Xi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Xi=[new V,new V,new V,new V,new V,new V,new V,new V],mi=new V,ha=new Wn,ts=new V,is=new V,ns=new V,ln=new V,cn=new V,An=new V,Ds=new V,da=new V,fa=new V,Rn=new V;function Vr(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){Rn.fromArray(n,a);const o=s.x*Math.abs(Rn.x)+s.y*Math.abs(Rn.y)+s.z*Math.abs(Rn.z),l=e.dot(Rn),c=t.dot(Rn),h=i.dot(Rn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Pt=new V,ua=new et;let $u=0;class Fi extends Xn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:$u++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Sc,this.updateRanges=[],this.gpuType=Li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)ua.fromBufferAttribute(this,t),ua.applyMatrix3(e),this.setXY(t,ua.x,ua.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix3(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Is(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ti(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Is(t,this.array)),t}setX(e,t){return this.normalized&&(t=ti(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Is(t,this.array)),t}setY(e,t){return this.normalized&&(t=ti(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Is(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ti(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Is(t,this.array)),t}setW(e,t){return this.normalized&&(t=ti(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ti(t,this.array),i=ti(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=ti(t,this.array),i=ti(i,this.array),s=ti(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=ti(t,this.array),i=ti(i,this.array),s=ti(s,this.array),a=ti(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Sc&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class md extends Fi{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class gd extends Fi{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ei extends Fi{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Yu=new Wn,Ns=new V,Hr=new V;class Ul{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Yu.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ns.subVectors(e,this.center);const t=Ns.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Ns,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Hr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ns.copy(e.center).add(Hr)),this.expandByPoint(Ns.copy(e.center).sub(Hr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Ku=0;const ci=new Ct,Gr=new Yt,ss=new V,ri=new Wn,ks=new Wn,Ft=new V;class wi extends Xn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ku++}),this.uuid=ea(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ru(e)?gd:md)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Ue().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ci.makeRotationFromQuaternion(e),this.applyMatrix4(ci),this}rotateX(e){return ci.makeRotationX(e),this.applyMatrix4(ci),this}rotateY(e){return ci.makeRotationY(e),this.applyMatrix4(ci),this}rotateZ(e){return ci.makeRotationZ(e),this.applyMatrix4(ci),this}translate(e,t,i){return ci.makeTranslation(e,t,i),this.applyMatrix4(ci),this}scale(e,t,i){return ci.makeScale(e,t,i),this.applyMatrix4(ci),this}lookAt(e){return Gr.lookAt(e),Gr.updateMatrix(),this.applyMatrix4(Gr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ss).negate(),this.translate(ss.x,ss.y,ss.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ei(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&De("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ze("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];ri.setFromBufferAttribute(a),this.morphTargetsRelative?(Ft.addVectors(this.boundingBox.min,ri.min),this.boundingBox.expandByPoint(Ft),Ft.addVectors(this.boundingBox.max,ri.max),this.boundingBox.expandByPoint(Ft)):(this.boundingBox.expandByPoint(ri.min),this.boundingBox.expandByPoint(ri.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ze('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ul);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ze("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){const i=this.boundingSphere.center;if(ri.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];ks.setFromBufferAttribute(o),this.morphTargetsRelative?(Ft.addVectors(ri.min,ks.min),ri.expandByPoint(Ft),Ft.addVectors(ri.max,ks.max),ri.expandByPoint(Ft)):(ri.expandByPoint(ks.min),ri.expandByPoint(ks.max))}ri.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)Ft.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(Ft));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ft.fromBufferAttribute(o,c),l&&(ss.fromBufferAttribute(e,c),Ft.add(ss)),s=Math.max(s,i.distanceToSquared(Ft))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ze('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ze("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Fi(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],l=[];for(let S=0;S<i.count;S++)o[S]=new V,l[S]=new V;const c=new V,h=new V,f=new V,d=new et,u=new et,p=new et,v=new V,g=new V;function m(S,w,P){c.fromBufferAttribute(i,S),h.fromBufferAttribute(i,w),f.fromBufferAttribute(i,P),d.fromBufferAttribute(a,S),u.fromBufferAttribute(a,w),p.fromBufferAttribute(a,P),h.sub(c),f.sub(c),u.sub(d),p.sub(d);const C=1/(u.x*p.y-p.x*u.y);isFinite(C)&&(v.copy(h).multiplyScalar(p.y).addScaledVector(f,-u.y).multiplyScalar(C),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-p.x).multiplyScalar(C),o[S].add(v),o[w].add(v),o[P].add(v),l[S].add(g),l[w].add(g),l[P].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let S=0,w=M.length;S<w;++S){const P=M[S],C=P.start,I=P.count;for(let z=C,N=C+I;z<N;z+=3)m(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const _=new V,x=new V,y=new V,E=new V;function A(S){y.fromBufferAttribute(s,S),E.copy(y);const w=o[S];_.copy(w),_.sub(y.multiplyScalar(y.dot(w))).normalize(),x.crossVectors(E,w);const C=x.dot(l[S])<0?-1:1;r.setXYZW(S,_.x,_.y,_.z,C)}for(let S=0,w=M.length;S<w;++S){const P=M[S],C=P.start,I=P.count;for(let z=C,N=C+I;z<N;z+=3)A(e.getX(z+0)),A(e.getX(z+1)),A(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Fi(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const s=new V,a=new V,r=new V,o=new V,l=new V,c=new V,h=new V,f=new V;if(e)for(let d=0,u=e.count;d<u;d+=3){const p=e.getX(d+0),v=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,p),a.fromBufferAttribute(t,v),r.fromBufferAttribute(t,g),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),o.fromBufferAttribute(i,p),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,g),o.add(h),l.add(h),c.add(h),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,u=t.count;d<u;d+=3)s.fromBufferAttribute(t,d+0),a.fromBufferAttribute(t,d+1),r.fromBufferAttribute(t,d+2),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ft.fromBufferAttribute(e,t),Ft.normalize(),e.setXYZ(t,Ft.x,Ft.y,Ft.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,d=new c.constructor(l.length*h);let u=0,p=0;for(let v=0,g=l.length;v<g;v++){o.isInterleavedBufferAttribute?u=l[v]*o.data.stride+o.offset:u=l[v]*h;for(let m=0;m<h;m++)d[p++]=c[u++]}return new Fi(d,h,f)}if(this.index===null)return De("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new wi,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=e(d,i);l.push(u)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(e.data))}h.length>0&&(s[l]=h,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const a=e.morphAttributes;for(const c in a){const h=[],f=a[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let c=0,h=r.length;c<h;c++){const f=r[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let ju=0;class ta extends Xn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=ea(),this.name="",this.type="Material",this.blending=us,this.side=En,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mo,this.blendDst=bo,this.blendEquation=Dn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new tt(0,0,0),this.blendAlpha=0,this.depthFunc=ys,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_c,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yn,this.stencilZFail=Yn,this.stencilZPass=Yn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){De(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){De(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==us&&(i.blending=this.blending),this.side!==En&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Mo&&(i.blendSrc=this.blendSrc),this.blendDst!==bo&&(i.blendDst=this.blendDst),this.blendEquation!==Dn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ys&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==_c&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Yn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Yn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Yn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const qi=new V,Wr=new V,pa=new V,hn=new V,Xr=new V,ma=new V,qr=new V;class Zu{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=qi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qi.copy(this.origin).addScaledVector(this.direction,t),qi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Wr.copy(e).add(t).multiplyScalar(.5),pa.copy(t).sub(e).normalize(),hn.copy(this.origin).sub(Wr);const a=e.distanceTo(t)*.5,r=-this.direction.dot(pa),o=hn.dot(this.direction),l=-hn.dot(pa),c=hn.lengthSq(),h=Math.abs(1-r*r);let f,d,u,p;if(h>0)if(f=r*l-o,d=r*o-l,p=a*h,f>=0)if(d>=-p)if(d<=p){const v=1/h;f*=v,d*=v,u=f*(f+r*d+2*o)+d*(r*f+d+2*l)+c}else d=a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*l)+c;else d=-a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*l)+c;else d<=-p?(f=Math.max(0,-(-r*a+o)),d=f>0?-a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c):d<=p?(f=0,d=Math.min(Math.max(-a,-l),a),u=d*(d+2*l)+c):(f=Math.max(0,-(r*a+o)),d=f>0?a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c);else d=r>0?-a:a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Wr).addScaledVector(pa,d),u}intersectSphere(e,t){qi.subVectors(e.center,this.origin);const i=qi.dot(this.direction),s=qi.dot(qi)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(a=(e.min.y-d.y)*h,r=(e.max.y-d.y)*h):(a=(e.max.y-d.y)*h,r=(e.min.y-d.y)*h),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,qi)!==null}intersectTriangle(e,t,i,s,a){Xr.subVectors(t,e),ma.subVectors(i,e),qr.crossVectors(Xr,ma);let r=this.direction.dot(qr),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;hn.subVectors(this.origin,e);const l=o*this.direction.dot(ma.crossVectors(hn,ma));if(l<0)return null;const c=o*this.direction.dot(Xr.cross(hn));if(c<0||l+c>r)return null;const h=-o*hn.dot(qr);return h<0?null:this.at(h/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Hs extends ta{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=Kh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Uc=new Ct,Cn=new Zu,ga=new Ul,Fc=new V,ya=new V,xa=new V,va=new V,$r=new V,_a=new V,Bc=new V,Sa=new V;class ut extends Yt{constructor(e=new wi,t=new Hs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){_a.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=o[l],f=a[l];h!==0&&($r.fromBufferAttribute(f,e),r?_a.addScaledVector($r,h):_a.addScaledVector($r.sub(t),h))}t.add(_a)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ga.copy(i.boundingSphere),ga.applyMatrix4(a),Cn.copy(e.ray).recast(e.near),!(ga.containsPoint(Cn.origin)===!1&&(Cn.intersectSphere(ga,Fc)===null||Cn.origin.distanceToSquared(Fc)>(e.far-e.near)**2))&&(Uc.copy(a).invert(),Cn.copy(e.ray).applyMatrix4(Uc),!(i.boundingBox!==null&&Cn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Cn)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,d=a.groups,u=a.drawRange;if(o!==null)if(Array.isArray(r))for(let p=0,v=d.length;p<v;p++){const g=d[p],m=r[g.materialIndex],M=Math.max(g.start,u.start),_=Math.min(o.count,Math.min(g.start+g.count,u.start+u.count));for(let x=M,y=_;x<y;x+=3){const E=o.getX(x),A=o.getX(x+1),S=o.getX(x+2);s=Ma(this,m,e,i,c,h,f,E,A,S),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const p=Math.max(0,u.start),v=Math.min(o.count,u.start+u.count);for(let g=p,m=v;g<m;g+=3){const M=o.getX(g),_=o.getX(g+1),x=o.getX(g+2);s=Ma(this,r,e,i,c,h,f,M,_,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let p=0,v=d.length;p<v;p++){const g=d[p],m=r[g.materialIndex],M=Math.max(g.start,u.start),_=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let x=M,y=_;x<y;x+=3){const E=x,A=x+1,S=x+2;s=Ma(this,m,e,i,c,h,f,E,A,S),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const p=Math.max(0,u.start),v=Math.min(l.count,u.start+u.count);for(let g=p,m=v;g<m;g+=3){const M=g,_=g+1,x=g+2;s=Ma(this,r,e,i,c,h,f,M,_,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function Ju(n,e,t,i,s,a,r,o){let l;if(e.side===ii?l=i.intersectTriangle(r,a,s,!0,o):l=i.intersectTriangle(s,a,r,e.side===En,o),l===null)return null;Sa.copy(o),Sa.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Sa);return c<t.near||c>t.far?null:{distance:c,point:Sa.clone(),object:n}}function Ma(n,e,t,i,s,a,r,o,l,c){n.getVertexPosition(o,ya),n.getVertexPosition(l,xa),n.getVertexPosition(c,va);const h=Ju(n,e,t,i,ya,xa,va,Bc);if(h){const f=new V;Mi.getBarycoord(Bc,ya,xa,va,f),s&&(h.uv=Mi.getInterpolatedAttribute(s,o,l,c,f,new et)),a&&(h.uv1=Mi.getInterpolatedAttribute(a,o,l,c,f,new et)),r&&(h.normal=Mi.getInterpolatedAttribute(r,o,l,c,f,new V),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new V,materialIndex:0};Mi.getNormal(ya,xa,va,d.normal),h.face=d,h.barycoord=f}return h}class Qu extends Qt{constructor(e=null,t=1,i=1,s,a,r,o,l,c=Vt,h=Vt,f,d){super(null,r,o,l,c,h,s,a,f,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Yr=new V,ep=new V,tp=new Ue;class In{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Yr.subVectors(i,t).cross(ep.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(Yr),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/a;return i===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(s,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||tp.getNormalMatrix(e),s=this.coplanarPoint(Yr).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Pn=new Ul,ip=new et(.5,.5),ba=new V;class Fl{constructor(e=new In,t=new In,i=new In,s=new In,a=new In,r=new In){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Di,i=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],l=a[2],c=a[3],h=a[4],f=a[5],d=a[6],u=a[7],p=a[8],v=a[9],g=a[10],m=a[11],M=a[12],_=a[13],x=a[14],y=a[15];if(s[0].setComponents(c-r,u-h,m-p,y-M).normalize(),s[1].setComponents(c+r,u+h,m+p,y+M).normalize(),s[2].setComponents(c+o,u+f,m+v,y+_).normalize(),s[3].setComponents(c-o,u-f,m-v,y-_).normalize(),i)s[4].setComponents(l,d,g,x).normalize(),s[5].setComponents(c-l,u-d,m-g,y-x).normalize();else if(s[4].setComponents(c-l,u-d,m-g,y-x).normalize(),t===Di)s[5].setComponents(c+l,u+d,m+g,y+x).normalize();else if(t===Ys)s[5].setComponents(l,d,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Pn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Pn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Pn)}intersectsSprite(e){Pn.center.set(0,0,0);const t=ip.distanceTo(e.center);return Pn.radius=.7071067811865476+t,Pn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Pn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(ba.x=s.normal.x>0?e.max.x:e.min.x,ba.y=s.normal.y>0?e.max.y:e.min.y,ba.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ba)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class yd extends Qt{constructor(e=[],t=Hn,i,s,a,r,o,l,c,h){super(e,t,i,s,a,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class vs extends Qt{constructor(e,t,i=Oi,s,a,r,o=Vt,l=Vt,c,h=tn,f=1){if(h!==tn&&h!==Un)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:f};super(d,s,a,r,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new kl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class np extends vs{constructor(e,t=Oi,i=Hn,s,a,r=Vt,o=Vt,l,c=tn){const h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,i,s,a,r,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class xd extends Qt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class bn extends wi{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const l=[],c=[],h=[],f=[];let d=0,u=0;p("z","y","x",-1,-1,i,t,e,r,a,0),p("z","y","x",1,-1,i,t,-e,r,a,1),p("x","z","y",1,1,e,i,t,s,r,2),p("x","z","y",1,-1,e,i,-t,s,r,3),p("x","y","z",1,-1,e,t,i,s,a,4),p("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new ei(c,3)),this.setAttribute("normal",new ei(h,3)),this.setAttribute("uv",new ei(f,2));function p(v,g,m,M,_,x,y,E,A,S,w){const P=x/A,C=y/S,I=x/2,z=y/2,N=E/2,L=A+1,U=S+1;let B=0,Y=0;const Q=new V;for(let ne=0;ne<U;ne++){const de=ne*C-z;for(let xe=0;xe<L;xe++){const pe=xe*P-I;Q[v]=pe*M,Q[g]=de*_,Q[m]=N,c.push(Q.x,Q.y,Q.z),Q[v]=0,Q[g]=0,Q[m]=E>0?1:-1,h.push(Q.x,Q.y,Q.z),f.push(xe/A),f.push(1-ne/S),B+=1}}for(let ne=0;ne<S;ne++)for(let de=0;de<A;de++){const xe=d+de+L*ne,pe=d+de+L*(ne+1),Re=d+(de+1)+L*(ne+1),be=d+(de+1)+L*ne;l.push(xe,pe,be),l.push(pe,Re,be),Y+=6}o.addGroup(u,Y,w),u+=Y,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class pn extends wi{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const h=[],f=[],d=[],u=[];let p=0;const v=[],g=i/2;let m=0;M(),r===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new ei(f,3)),this.setAttribute("normal",new ei(d,3)),this.setAttribute("uv",new ei(u,2));function M(){const x=new V,y=new V;let E=0;const A=(t-e)/i;for(let S=0;S<=a;S++){const w=[],P=S/a,C=P*(t-e)+e;for(let I=0;I<=s;I++){const z=I/s,N=z*l+o,L=Math.sin(N),U=Math.cos(N);y.x=C*L,y.y=-P*i+g,y.z=C*U,f.push(y.x,y.y,y.z),x.set(L,A,U).normalize(),d.push(x.x,x.y,x.z),u.push(z,1-P),w.push(p++)}v.push(w)}for(let S=0;S<s;S++)for(let w=0;w<a;w++){const P=v[w][S],C=v[w+1][S],I=v[w+1][S+1],z=v[w][S+1];(e>0||w!==0)&&(h.push(P,C,z),E+=3),(t>0||w!==a-1)&&(h.push(C,I,z),E+=3)}c.addGroup(m,E,0),m+=E}function _(x){const y=p,E=new et,A=new V;let S=0;const w=x===!0?e:t,P=x===!0?1:-1;for(let I=1;I<=s;I++)f.push(0,g*P,0),d.push(0,P,0),u.push(.5,.5),p++;const C=p;for(let I=0;I<=s;I++){const N=I/s*l+o,L=Math.cos(N),U=Math.sin(N);A.x=w*U,A.y=g*P,A.z=w*L,f.push(A.x,A.y,A.z),d.push(0,P,0),E.x=L*.5+.5,E.y=U*.5*P+.5,u.push(E.x,E.y),p++}for(let I=0;I<s;I++){const z=y+I,N=C+I;x===!0?h.push(N,N+1,z):h.push(N+1,N,z),S+=3}c.addGroup(m,S,x===!0?1:2),m+=S}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class hr extends wi{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,f=e/o,d=t/l,u=[],p=[],v=[],g=[];for(let m=0;m<h;m++){const M=m*d-r;for(let _=0;_<c;_++){const x=_*f-a;p.push(x,-M,0),v.push(0,0,1),g.push(_/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let M=0;M<o;M++){const _=M+c*m,x=M+c*(m+1),y=M+1+c*(m+1),E=M+1+c*m;u.push(_,x,E),u.push(x,y,E)}this.setIndex(u),this.setAttribute("position",new ei(p,3)),this.setAttribute("normal",new ei(v,3)),this.setAttribute("uv",new ei(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hr(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ja extends wi{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(r+o,Math.PI);let c=0;const h=[],f=new V,d=new V,u=[],p=[],v=[],g=[];for(let m=0;m<=i;m++){const M=[],_=m/i;let x=0;m===0&&r===0?x=.5/t:m===i&&l===Math.PI&&(x=-.5/t);for(let y=0;y<=t;y++){const E=y/t;f.x=-e*Math.cos(s+E*a)*Math.sin(r+_*o),f.y=e*Math.cos(r+_*o),f.z=e*Math.sin(s+E*a)*Math.sin(r+_*o),p.push(f.x,f.y,f.z),d.copy(f).normalize(),v.push(d.x,d.y,d.z),g.push(E+x,1-_),M.push(c++)}h.push(M)}for(let m=0;m<i;m++)for(let M=0;M<t;M++){const _=h[m][M+1],x=h[m][M],y=h[m+1][M],E=h[m+1][M+1];(m!==0||r>0)&&u.push(_,x,E),(m!==i-1||l<Math.PI)&&u.push(x,y,E)}this.setIndex(u),this.setAttribute("position",new ei(p,3)),this.setAttribute("normal",new ei(v,3)),this.setAttribute("uv",new ei(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ja(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function _s(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(Oc(s))s.isRenderTargetTexture?(De("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(Oc(s[0])){const a=[];for(let r=0,o=s.length;r<o;r++)a[r]=s[r].clone();e[t][i]=a}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Kt(n){const e={};for(let t=0;t<n.length;t++){const i=_s(n[t]);for(const s in i)e[s]=i[s]}return e}function Oc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function sp(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function vd(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const ap={clone:_s,merge:Kt};var rp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,op=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class zi extends ta{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=rp,this.fragmentShader=op,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=_s(e.uniforms),this.uniformsGroups=sp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class lp extends zi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Kr extends ta{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new tt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=cl,this.normalScale=new et(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class cp extends ta{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_u,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class hp extends ta{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class _d extends Yt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new tt(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const jr=new Ct,zc=new V,Vc=new V;class dp{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new et(512,512),this.mapType=oi,this.map=null,this.mapPass=null,this.matrix=new Ct,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Fl,this._frameExtents=new et(1,1),this._viewportCount=1,this._viewports=[new Mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;zc.setFromMatrixPosition(e.matrixWorld),t.position.copy(zc),Vc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Vc),t.updateMatrixWorld(),jr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(jr,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Ys||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(jr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Ea=new V,Ta=new As,Ci=new V;class Sd extends Yt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ct,this.projectionMatrix=new Ct,this.projectionMatrixInverse=new Ct,this.coordinateSystem=Di,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ea,Ta,Ci),Ci.x===1&&Ci.y===1&&Ci.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ea,Ta,Ci.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Ea,Ta,Ci),Ci.x===1&&Ci.y===1&&Ci.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ea,Ta,Ci.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const dn=new V,Hc=new et,Gc=new et;class Si extends Sd{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=dl*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Tr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return dl*2*Math.atan(Math.tan(Tr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){dn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(dn.x,dn.y).multiplyScalar(-e/dn.z),dn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(dn.x,dn.y).multiplyScalar(-e/dn.z)}getViewSize(e,t){return this.getViewBounds(e,Hc,Gc),t.subVectors(Gc,Hc)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Tr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,t-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class dr extends Sd{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class fp extends dp{constructor(){super(new dr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Wc extends _d{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Yt.DEFAULT_UP),this.updateMatrix(),this.target=new Yt,this.shadow=new fp}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class up extends _d{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const as=-90,rs=1;class pp extends Yt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Si(as,rs,e,t);s.layers=this.layers,this.add(s);const a=new Si(as,rs,e,t);a.layers=this.layers,this.add(a);const r=new Si(as,rs,e,t);r.layers=this.layers,this.add(r);const o=new Si(as,rs,e,t);o.layers=this.layers,this.add(o);const l=new Si(as,rs,e,t);l.layers=this.layers,this.add(l);const c=new Si(as,rs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,o,l]=t;for(const c of t)this.remove(c);if(e===Di)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ys)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,c,h]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,d,u),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class mp extends Si{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const ic=class ic{constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){const a=this.elements;return a[0]=e,a[2]=t,a[1]=i,a[3]=s,this}};ic.prototype.isMatrix2=!0;let Xc=ic;function qc(n,e,t,i){const s=gp(i);switch(t){case ld:return n*e;case hd:return n*e/s.components*s.byteLength;case Pl:return n*e/s.components*s.byteLength;case Gn:return n*e*2/s.components*s.byteLength;case Il:return n*e*2/s.components*s.byteLength;case cd:return n*e*3/s.components*s.byteLength;case Ti:return n*e*4/s.components*s.byteLength;case Ll:return n*e*4/s.components*s.byteLength;case za:case Va:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ha:case Ga:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case No:case Uo:return Math.max(n,16)*Math.max(e,8)/4;case Do:case ko:return Math.max(n,8)*Math.max(e,8)/2;case Fo:case Bo:case zo:case Vo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Oo:case $a:case Ho:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Go:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Wo:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Xo:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case qo:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case $o:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Yo:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ko:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case jo:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Zo:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Jo:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Qo:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case el:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case tl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case il:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case nl:case sl:case al:return Math.ceil(n/4)*Math.ceil(e/4)*16;case rl:case ol:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Ya:case ll:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function gp(n){switch(n){case oi:case sd:return{byteLength:1,components:1};case qs:case ad:case en:return{byteLength:2,components:1};case Rl:case Cl:return{byteLength:2,components:4};case Oi:case Al:case Li:return{byteLength:4,components:1};case rd:case od:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:wl}}));typeof window<"u"&&(window.__THREE__?De("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=wl);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Md(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function yp(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,o),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,p)=>u.start-p.start);let d=0;for(let u=1;u<f.length;u++){const p=f[d],v=f[u];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++d,f[d]=v)}f.length=d+1;for(let u=0,p=f.length;u<p;u++){const v=f[u];n.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var xp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vp=`#ifdef USE_ALPHAHASH
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
#endif`,_p=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Sp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ep=`#ifdef USE_AOMAP
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
#endif`,Tp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wp=`#ifdef USE_BATCHING
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
#endif`,Ap=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Rp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Cp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Pp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ip=`#ifdef USE_IRIDESCENCE
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
#endif`,Lp=`#ifdef USE_BUMPMAP
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
#endif`,Dp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Np=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,kp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Up=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Fp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Bp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Op=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,zp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Vp=`#define PI 3.141592653589793
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
} // validated`,Hp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Gp=`vec3 transformedNormal = objectNormal;
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
#endif`,Wp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Xp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$p=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Yp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jp=`#ifdef USE_ENVMAP
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
#endif`,Zp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Jp=`#ifdef USE_ENVMAP
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
#endif`,Qp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,em=`#ifdef USE_ENVMAP
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
#endif`,tm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,im=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,nm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,sm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,am=`#ifdef USE_GRADIENTMAP
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
}`,rm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,om=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,cm=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,hm=`#ifdef USE_ENVMAP
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
#endif`,dm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,um=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,pm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,mm=`PhysicalMaterial material;
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
#endif`,gm=`uniform sampler2D dfgLUT;
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
}`,ym=`
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
#endif`,xm=`#if defined( RE_IndirectDiffuse )
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
#endif`,vm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,_m=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Sm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Mm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Em=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Tm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Am=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Rm=`#if defined( USE_POINTS_UV )
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
#endif`,Cm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Pm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Im=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Lm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Dm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Nm=`#ifdef USE_MORPHTARGETS
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
#endif`,km=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Um=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Fm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Bm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Om=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Vm=`#ifdef USE_NORMALMAP
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
#endif`,Hm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Gm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Wm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Xm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$m=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ym=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Km=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Zm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Jm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Qm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,e0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,t0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,i0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,n0=`float getShadowMask() {
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
}`,s0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,a0=`#ifdef USE_SKINNING
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
#endif`,r0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,o0=`#ifdef USE_SKINNING
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
#endif`,l0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,c0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,h0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,d0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,f0=`#ifdef USE_TRANSMISSION
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
#endif`,u0=`#ifdef USE_TRANSMISSION
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
#endif`,p0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,m0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,g0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,y0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const x0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,v0=`uniform sampler2D t2D;
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
}`,_0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,S0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,M0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,b0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,E0=`#include <common>
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
}`,T0=`#if DEPTH_PACKING == 3200
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
}`,w0=`#define DISTANCE
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
}`,A0=`#define DISTANCE
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
}`,R0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,C0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,P0=`uniform float scale;
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
}`,I0=`uniform vec3 diffuse;
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
}`,L0=`#include <common>
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
}`,D0=`uniform vec3 diffuse;
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
}`,N0=`#define LAMBERT
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
}`,k0=`#define LAMBERT
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
}`,U0=`#define MATCAP
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
}`,F0=`#define MATCAP
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
}`,B0=`#define NORMAL
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
}`,O0=`#define NORMAL
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
}`,z0=`#define PHONG
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
}`,V0=`#define PHONG
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
}`,H0=`#define STANDARD
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
}`,G0=`#define STANDARD
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
}`,W0=`#define TOON
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
}`,X0=`#define TOON
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
}`,q0=`uniform float size;
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
}`,$0=`uniform vec3 diffuse;
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
}`,Y0=`#include <common>
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
}`,K0=`uniform vec3 color;
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
}`,j0=`uniform float rotation;
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
}`,Z0=`uniform vec3 diffuse;
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
}`,Ve={alphahash_fragment:xp,alphahash_pars_fragment:vp,alphamap_fragment:_p,alphamap_pars_fragment:Sp,alphatest_fragment:Mp,alphatest_pars_fragment:bp,aomap_fragment:Ep,aomap_pars_fragment:Tp,batching_pars_vertex:wp,batching_vertex:Ap,begin_vertex:Rp,beginnormal_vertex:Cp,bsdfs:Pp,iridescence_fragment:Ip,bumpmap_pars_fragment:Lp,clipping_planes_fragment:Dp,clipping_planes_pars_fragment:Np,clipping_planes_pars_vertex:kp,clipping_planes_vertex:Up,color_fragment:Fp,color_pars_fragment:Bp,color_pars_vertex:Op,color_vertex:zp,common:Vp,cube_uv_reflection_fragment:Hp,defaultnormal_vertex:Gp,displacementmap_pars_vertex:Wp,displacementmap_vertex:Xp,emissivemap_fragment:qp,emissivemap_pars_fragment:$p,colorspace_fragment:Yp,colorspace_pars_fragment:Kp,envmap_fragment:jp,envmap_common_pars_fragment:Zp,envmap_pars_fragment:Jp,envmap_pars_vertex:Qp,envmap_physical_pars_fragment:hm,envmap_vertex:em,fog_vertex:tm,fog_pars_vertex:im,fog_fragment:nm,fog_pars_fragment:sm,gradientmap_pars_fragment:am,lightmap_pars_fragment:rm,lights_lambert_fragment:om,lights_lambert_pars_fragment:lm,lights_pars_begin:cm,lights_toon_fragment:dm,lights_toon_pars_fragment:fm,lights_phong_fragment:um,lights_phong_pars_fragment:pm,lights_physical_fragment:mm,lights_physical_pars_fragment:gm,lights_fragment_begin:ym,lights_fragment_maps:xm,lights_fragment_end:vm,lightprobes_pars_fragment:_m,logdepthbuf_fragment:Sm,logdepthbuf_pars_fragment:Mm,logdepthbuf_pars_vertex:bm,logdepthbuf_vertex:Em,map_fragment:Tm,map_pars_fragment:wm,map_particle_fragment:Am,map_particle_pars_fragment:Rm,metalnessmap_fragment:Cm,metalnessmap_pars_fragment:Pm,morphinstance_vertex:Im,morphcolor_vertex:Lm,morphnormal_vertex:Dm,morphtarget_pars_vertex:Nm,morphtarget_vertex:km,normal_fragment_begin:Um,normal_fragment_maps:Fm,normal_pars_fragment:Bm,normal_pars_vertex:Om,normal_vertex:zm,normalmap_pars_fragment:Vm,clearcoat_normal_fragment_begin:Hm,clearcoat_normal_fragment_maps:Gm,clearcoat_pars_fragment:Wm,iridescence_pars_fragment:Xm,opaque_fragment:qm,packing:$m,premultiplied_alpha_fragment:Ym,project_vertex:Km,dithering_fragment:jm,dithering_pars_fragment:Zm,roughnessmap_fragment:Jm,roughnessmap_pars_fragment:Qm,shadowmap_pars_fragment:e0,shadowmap_pars_vertex:t0,shadowmap_vertex:i0,shadowmask_pars_fragment:n0,skinbase_vertex:s0,skinning_pars_vertex:a0,skinning_vertex:r0,skinnormal_vertex:o0,specularmap_fragment:l0,specularmap_pars_fragment:c0,tonemapping_fragment:h0,tonemapping_pars_fragment:d0,transmission_fragment:f0,transmission_pars_fragment:u0,uv_pars_fragment:p0,uv_pars_vertex:m0,uv_vertex:g0,worldpos_vertex:y0,background_vert:x0,background_frag:v0,backgroundCube_vert:_0,backgroundCube_frag:S0,cube_vert:M0,cube_frag:b0,depth_vert:E0,depth_frag:T0,distance_vert:w0,distance_frag:A0,equirect_vert:R0,equirect_frag:C0,linedashed_vert:P0,linedashed_frag:I0,meshbasic_vert:L0,meshbasic_frag:D0,meshlambert_vert:N0,meshlambert_frag:k0,meshmatcap_vert:U0,meshmatcap_frag:F0,meshnormal_vert:B0,meshnormal_frag:O0,meshphong_vert:z0,meshphong_frag:V0,meshphysical_vert:H0,meshphysical_frag:G0,meshtoon_vert:W0,meshtoon_frag:X0,points_vert:q0,points_frag:$0,shadow_vert:Y0,shadow_frag:K0,sprite_vert:j0,sprite_frag:Z0},ue={common:{diffuse:{value:new tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new et(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new tt(16777215)},opacity:{value:1},center:{value:new et(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},Ii={basic:{uniforms:Kt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:Kt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new tt(0)},envMapIntensity:{value:1}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:Kt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new tt(0)},specular:{value:new tt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:Kt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:Kt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new tt(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:Kt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:Kt([ue.points,ue.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:Kt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:Kt([ue.common,ue.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:Kt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:Kt([ue.sprite,ue.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distance:{uniforms:Kt([ue.common,ue.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distance_vert,fragmentShader:Ve.distance_frag},shadow:{uniforms:Kt([ue.lights,ue.fog,{color:{value:new tt(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};Ii.physical={uniforms:Kt([Ii.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new et(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new et},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new tt(0)},specularColor:{value:new tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new et},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};const wa={r:0,b:0,g:0},J0=new Ct,bd=new Ue;bd.set(-1,0,0,0,1,0,0,0,1);function Q0(n,e,t,i,s,a){const r=new tt(0);let o=s===!0?0:1,l,c,h=null,f=0,d=null;function u(M){let _=M.isScene===!0?M.background:null;if(_&&_.isTexture){const x=M.backgroundBlurriness>0;_=e.get(_,x)}return _}function p(M){let _=!1;const x=u(M);x===null?g(r,o):x&&x.isColor&&(g(x,1),_=!0);const y=n.xr.getEnvironmentBlendMode();y==="additive"?t.buffers.color.setClear(0,0,0,1,a):y==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,a),(n.autoClear||_)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function v(M,_){const x=u(_);x&&(x.isCubeTexture||x.mapping===cr)?(c===void 0&&(c=new ut(new bn(1,1,1),new zi({name:"BackgroundCubeMaterial",uniforms:_s(Ii.backgroundCube.uniforms),vertexShader:Ii.backgroundCube.vertexShader,fragmentShader:Ii.backgroundCube.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(y,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(J0.makeRotationFromEuler(_.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(bd),c.material.toneMapped=$e.getTransfer(x.colorSpace)!==st,(h!==x||f!==x.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,h=x,f=x.version,d=n.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new ut(new hr(2,2),new zi({name:"BackgroundMaterial",uniforms:_s(Ii.background.uniforms),vertexShader:Ii.background.vertexShader,fragmentShader:Ii.background.fragmentShader,side:En,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=$e.getTransfer(x.colorSpace)!==st,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||f!==x.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=x,f=x.version,d=n.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function g(M,_){M.getRGB(wa,vd(n)),t.buffers.color.setClear(wa.r,wa.g,wa.b,_,a)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(M,_=1){r.set(M),o=_,g(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,g(r,o)},render:p,addToRenderList:v,dispose:m}}function eg(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let a=s,r=!1;function o(C,I,z,N,L){let U=!1;const B=f(C,N,z,I);a!==B&&(a=B,c(a.object)),U=u(C,N,z,L),U&&p(C,N,z,L),L!==null&&e.update(L,n.ELEMENT_ARRAY_BUFFER),(U||r)&&(r=!1,x(C,I,z,N),L!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(L).buffer))}function l(){return n.createVertexArray()}function c(C){return n.bindVertexArray(C)}function h(C){return n.deleteVertexArray(C)}function f(C,I,z,N){const L=N.wireframe===!0;let U=i[I.id];U===void 0&&(U={},i[I.id]=U);const B=C.isInstancedMesh===!0?C.id:0;let Y=U[B];Y===void 0&&(Y={},U[B]=Y);let Q=Y[z.id];Q===void 0&&(Q={},Y[z.id]=Q);let ne=Q[L];return ne===void 0&&(ne=d(l()),Q[L]=ne),ne}function d(C){const I=[],z=[],N=[];for(let L=0;L<t;L++)I[L]=0,z[L]=0,N[L]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:z,attributeDivisors:N,object:C,attributes:{},index:null}}function u(C,I,z,N){const L=a.attributes,U=I.attributes;let B=0;const Y=z.getAttributes();for(const Q in Y)if(Y[Q].location>=0){const de=L[Q];let xe=U[Q];if(xe===void 0&&(Q==="instanceMatrix"&&C.instanceMatrix&&(xe=C.instanceMatrix),Q==="instanceColor"&&C.instanceColor&&(xe=C.instanceColor)),de===void 0||de.attribute!==xe||xe&&de.data!==xe.data)return!0;B++}return a.attributesNum!==B||a.index!==N}function p(C,I,z,N){const L={},U=I.attributes;let B=0;const Y=z.getAttributes();for(const Q in Y)if(Y[Q].location>=0){let de=U[Q];de===void 0&&(Q==="instanceMatrix"&&C.instanceMatrix&&(de=C.instanceMatrix),Q==="instanceColor"&&C.instanceColor&&(de=C.instanceColor));const xe={};xe.attribute=de,de&&de.data&&(xe.data=de.data),L[Q]=xe,B++}a.attributes=L,a.attributesNum=B,a.index=N}function v(){const C=a.newAttributes;for(let I=0,z=C.length;I<z;I++)C[I]=0}function g(C){m(C,0)}function m(C,I){const z=a.newAttributes,N=a.enabledAttributes,L=a.attributeDivisors;z[C]=1,N[C]===0&&(n.enableVertexAttribArray(C),N[C]=1),L[C]!==I&&(n.vertexAttribDivisor(C,I),L[C]=I)}function M(){const C=a.newAttributes,I=a.enabledAttributes;for(let z=0,N=I.length;z<N;z++)I[z]!==C[z]&&(n.disableVertexAttribArray(z),I[z]=0)}function _(C,I,z,N,L,U,B){B===!0?n.vertexAttribIPointer(C,I,z,L,U):n.vertexAttribPointer(C,I,z,N,L,U)}function x(C,I,z,N){v();const L=N.attributes,U=z.getAttributes(),B=I.defaultAttributeValues;for(const Y in U){const Q=U[Y];if(Q.location>=0){let ne=L[Y];if(ne===void 0&&(Y==="instanceMatrix"&&C.instanceMatrix&&(ne=C.instanceMatrix),Y==="instanceColor"&&C.instanceColor&&(ne=C.instanceColor)),ne!==void 0){const de=ne.normalized,xe=ne.itemSize,pe=e.get(ne);if(pe===void 0)continue;const Re=pe.buffer,be=pe.type,X=pe.bytesPerElement,J=be===n.INT||be===n.UNSIGNED_INT||ne.gpuType===Al;if(ne.isInterleavedBufferAttribute){const Z=ne.data,Ee=Z.stride,Pe=ne.offset;if(Z.isInstancedInterleavedBuffer){for(let Ie=0;Ie<Q.locationSize;Ie++)m(Q.location+Ie,Z.meshPerAttribute);C.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let Ie=0;Ie<Q.locationSize;Ie++)g(Q.location+Ie);n.bindBuffer(n.ARRAY_BUFFER,Re);for(let Ie=0;Ie<Q.locationSize;Ie++)_(Q.location+Ie,xe/Q.locationSize,be,de,Ee*X,(Pe+xe/Q.locationSize*Ie)*X,J)}else{if(ne.isInstancedBufferAttribute){for(let Z=0;Z<Q.locationSize;Z++)m(Q.location+Z,ne.meshPerAttribute);C.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Z=0;Z<Q.locationSize;Z++)g(Q.location+Z);n.bindBuffer(n.ARRAY_BUFFER,Re);for(let Z=0;Z<Q.locationSize;Z++)_(Q.location+Z,xe/Q.locationSize,be,de,xe*X,xe/Q.locationSize*Z*X,J)}}else if(B!==void 0){const de=B[Y];if(de!==void 0)switch(de.length){case 2:n.vertexAttrib2fv(Q.location,de);break;case 3:n.vertexAttrib3fv(Q.location,de);break;case 4:n.vertexAttrib4fv(Q.location,de);break;default:n.vertexAttrib1fv(Q.location,de)}}}}M()}function y(){w();for(const C in i){const I=i[C];for(const z in I){const N=I[z];for(const L in N){const U=N[L];for(const B in U)h(U[B].object),delete U[B];delete N[L]}}delete i[C]}}function E(C){if(i[C.id]===void 0)return;const I=i[C.id];for(const z in I){const N=I[z];for(const L in N){const U=N[L];for(const B in U)h(U[B].object),delete U[B];delete N[L]}}delete i[C.id]}function A(C){for(const I in i){const z=i[I];for(const N in z){const L=z[N];if(L[C.id]===void 0)continue;const U=L[C.id];for(const B in U)h(U[B].object),delete U[B];delete L[C.id]}}}function S(C){for(const I in i){const z=i[I],N=C.isInstancedMesh===!0?C.id:0,L=z[N];if(L!==void 0){for(const U in L){const B=L[U];for(const Y in B)h(B[Y].object),delete B[Y];delete L[U]}delete z[N],Object.keys(z).length===0&&delete i[I]}}}function w(){P(),r=!0,a!==s&&(a=s,c(a.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:P,dispose:y,releaseStatesOfGeometry:E,releaseStatesOfObject:S,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:g,disableUnusedAttributes:M}}function tg(n,e,t){let i;function s(l){i=l}function a(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function r(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let u=0;u<h;u++)d+=c[u];t.update(d,i,1)}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function ig(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(A){return!(A!==Ti&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const S=A===en&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==oi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Li&&!S)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(De("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&De("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),y=n.getParameter(n.MAX_SAMPLES),E=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:u,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:M,maxVaryings:_,maxFragmentUniforms:x,maxSamples:y,samples:E}}function ng(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new In,o=new Ue,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||s;return s=d,i=f.length,u},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,d){t=h(f,d,0)},this.setState=function(f,d,u){const p=f.clippingPlanes,v=f.clipIntersection,g=f.clipShadows,m=n.get(f);if(!s||p===null||p.length===0||a&&!g)a?h(null):c();else{const M=a?0:i,_=M*4;let x=m.clippingState||null;l.value=x,x=h(p,d,_,u);for(let y=0;y!==_;++y)x[y]=t[y];m.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(f,d,u,p){const v=f!==null?f.length:0;let g=null;if(v!==0){if(g=l.value,p!==!0||g===null){const m=u+v*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(g===null||g.length<m)&&(g=new Float32Array(m));for(let _=0,x=u;_!==v;++_,x+=4)r.copy(f[_]).applyMatrix4(M,o),r.normal.toArray(g,x),g[x+3]=r.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}const gn=4,$c=[.125,.215,.35,.446,.526,.582],Nn=20,sg=256,Us=new dr,Yc=new tt;let Zr=null,Jr=0,Qr=0,eo=!1;const ag=new V;class Kc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:o=ag}=a;Zr=this._renderer.getRenderTarget(),Jr=this._renderer.getActiveCubeFace(),Qr=this._renderer.getActiveMipmapLevel(),eo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Jc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Zr,Jr,Qr),this._renderer.xr.enabled=eo,e.scissorTest=!1,os(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Hn||e.mapping===xs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Zr=this._renderer.getRenderTarget(),Jr=this._renderer.getActiveCubeFace(),Qr=this._renderer.getActiveMipmapLevel(),eo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:$t,minFilter:$t,generateMipmaps:!1,type:en,format:Ti,colorSpace:Ka,depthBuffer:!1},s=jc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=jc(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=rg(a)),this._blurMaterial=lg(a,e,t),this._ggxMaterial=og(a,e,t)}return s}_compileMaterial(e){const t=new ut(new wi,e);this._renderer.compile(t,Us)}_sceneToCubeUV(e,t,i,s,a){const l=new Si(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,d=f.autoClear,u=f.toneMapping;f.getClearColor(Yc),f.toneMapping=ki,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ut(new bn,new Hs({name:"PMREM.Background",side:ii,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,g=v.material;let m=!1;const M=e.background;M?M.isColor&&(g.color.copy(M),e.background=null,m=!0):(g.color.copy(Yc),m=!0);for(let _=0;_<6;_++){const x=_%3;x===0?(l.up.set(0,c[_],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+h[_],a.y,a.z)):x===1?(l.up.set(0,0,c[_]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+h[_],a.z)):(l.up.set(0,c[_],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+h[_]));const y=this._cubeSize;os(s,x*y,_>2?y:0,y,y),f.setRenderTarget(s),m&&f.render(v,l),f.render(e,l)}f.toneMapping=u,f.autoClear=d,e.background=M}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Hn||e.mapping===xs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Jc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zc());const a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;os(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(r,Us)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;const l=r.uniforms,c=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),d=0+c*1.25,u=f*d,{_lodMax:p}=this,v=this._sizeLods[i],g=3*v*(i>p-gn?i-p+gn:0),m=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=u,l.mipInt.value=p-t,os(a,g,m,3*v,2*v),s.setRenderTarget(a),s.render(o,Us),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=p-i,os(e,g,m,3*v,2*v),s.setRenderTarget(e),s.render(o,Us)}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,o){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&Ze("blur direction must be either latitudinal or longitudinal!");const h=3,f=this._lodMeshes[s];f.material=c;const d=c.uniforms,u=this._sizeLods[i]-1,p=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*Nn-1),v=a/p,g=isFinite(a)?1+Math.floor(h*v):Nn;g>Nn&&De(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Nn}`);const m=[];let M=0;for(let A=0;A<Nn;++A){const S=A/v,w=Math.exp(-S*S/2);m.push(w),A===0?M+=w:A<g&&(M+=2*w)}for(let A=0;A<m.length;A++)m[A]=m[A]/M;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=r==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:_}=this;d.dTheta.value=p,d.mipInt.value=_-i;const x=this._sizeLods[s],y=3*x*(s>_-gn?s-_+gn:0),E=4*(this._cubeSize-x);os(t,y,E,3*x,2*x),l.setRenderTarget(t),l.render(f,Us)}}function rg(n){const e=[],t=[],i=[];let s=n;const a=n-gn+1+$c.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let l=1/o;r>n-gn?l=$c[r-n+gn-1]:r===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,p=6,v=3,g=2,m=1,M=new Float32Array(v*p*u),_=new Float32Array(g*p*u),x=new Float32Array(m*p*u);for(let E=0;E<u;E++){const A=E%3*2/3-1,S=E>2?0:-1,w=[A,S,0,A+2/3,S,0,A+2/3,S+1,0,A,S,0,A+2/3,S+1,0,A,S+1,0];M.set(w,v*p*E),_.set(d,g*p*E);const P=[E,E,E,E,E,E];x.set(P,m*p*E)}const y=new wi;y.setAttribute("position",new Fi(M,v)),y.setAttribute("uv",new Fi(_,g)),y.setAttribute("faceIndex",new Fi(x,m)),i.push(new ut(y,null)),s>gn&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function jc(n,e,t){const i=new Ui(n,e,t);return i.texture.mapping=cr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function os(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function og(n,e,t){return new zi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:sg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:fr(),fragmentShader:`

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
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function lg(n,e,t){const i=new Float32Array(Nn),s=new V(0,1,0);return new zi({name:"SphericalGaussianBlur",defines:{n:Nn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:fr(),fragmentShader:`

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
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function Zc(){return new zi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:fr(),fragmentShader:`

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
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function Jc(){return new zi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function fr(){return`

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
	`}class Ed extends Ui{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new yd(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new bn(5,5,5),a=new zi({name:"CubemapFromEquirect",uniforms:_s(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ii,blending:Zi});a.uniforms.tEquirect.value=t;const r=new ut(s,a),o=t.minFilter;return t.minFilter===kn&&(t.minFilter=$t),new pp(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}function cg(n){let e=new WeakMap,t=new WeakMap,i=null;function s(d,u=!1){return d==null?null:u?r(d):a(d)}function a(d){if(d&&d.isTexture){const u=d.mapping;if(u===Mr||u===br)if(e.has(d)){const p=e.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const v=new Ed(p.height);return v.fromEquirectangularTexture(n,d),e.set(d,v),d.addEventListener("dispose",c),o(v.texture,d.mapping)}else return null}}return d}function r(d){if(d&&d.isTexture){const u=d.mapping,p=u===Mr||u===br,v=u===Hn||u===xs;if(p||v){let g=t.get(d);const m=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return i===null&&(i=new Kc(n)),g=p?i.fromEquirectangular(d,g):i.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{const M=d.image;return p&&M&&M.height>0||v&&M&&l(M)?(i===null&&(i=new Kc(n)),g=p?i.fromEquirectangular(d):i.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function o(d,u){return u===Mr?d.mapping=Hn:u===br&&(d.mapping=xs),d}function l(d){let u=0;const p=6;for(let v=0;v<p;v++)d[v]!==void 0&&u++;return u===p}function c(d){const u=d.target;u.removeEventListener("dispose",c);const p=e.get(u);p!==void 0&&(e.delete(u),p.dispose())}function h(d){const u=d.target;u.removeEventListener("dispose",h);const p=t.get(u);p!==void 0&&(t.delete(u),p.dispose())}function f(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function hg(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&hl("WebGLRenderer: "+i+" extension not supported."),s}}}function dg(n,e,t,i){const s={},a=new WeakMap;function r(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",r),delete s[d.id];const u=a.get(d);u&&(e.remove(u),a.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(f,d){return s[d.id]===!0||(d.addEventListener("dispose",r),s[d.id]=!0,t.memory.geometries++),d}function l(f){const d=f.attributes;for(const u in d)e.update(d[u],n.ARRAY_BUFFER)}function c(f){const d=[],u=f.index,p=f.attributes.position;let v=0;if(p===void 0)return;if(u!==null){const M=u.array;v=u.version;for(let _=0,x=M.length;_<x;_+=3){const y=M[_+0],E=M[_+1],A=M[_+2];d.push(y,E,E,A,A,y)}}else{const M=p.array;v=p.version;for(let _=0,x=M.length/3-1;_<x;_+=3){const y=_+0,E=_+1,A=_+2;d.push(y,E,E,A,A,y)}}const g=new(p.count>=65535?gd:md)(d,1);g.version=v;const m=a.get(f);m&&e.remove(m),a.set(f,g)}function h(f){const d=a.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return a.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function fg(n,e,t){let i;function s(f){i=f}let a,r;function o(f){a=f.type,r=f.bytesPerElement}function l(f,d){n.drawElements(i,d,a,f*r),t.update(d,i,1)}function c(f,d,u){u!==0&&(n.drawElementsInstanced(i,d,a,f*r,u),t.update(d,i,u))}function h(f,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,a,f,0,u);let v=0;for(let g=0;g<u;g++)v+=d[g];t.update(v,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function ug(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:Ze("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function pg(n,e,t){const i=new WeakMap,s=new Mt;function a(r,o,l){const c=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==f){let w=function(){A.dispose(),i.delete(o),o.removeEventListener("dispose",w)};d!==void 0&&d.texture.dispose();const u=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let _=0;u===!0&&(_=1),p===!0&&(_=2),v===!0&&(_=3);let x=o.attributes.position.count*_,y=1;x>e.maxTextureSize&&(y=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const E=new Float32Array(x*y*4*f),A=new fd(E,x,y,f);A.type=Li,A.needsUpdate=!0;const S=_*4;for(let P=0;P<f;P++){const C=g[P],I=m[P],z=M[P],N=x*y*4*P;for(let L=0;L<C.count;L++){const U=L*S;u===!0&&(s.fromBufferAttribute(C,L),E[N+U+0]=s.x,E[N+U+1]=s.y,E[N+U+2]=s.z,E[N+U+3]=0),p===!0&&(s.fromBufferAttribute(I,L),E[N+U+4]=s.x,E[N+U+5]=s.y,E[N+U+6]=s.z,E[N+U+7]=0),v===!0&&(s.fromBufferAttribute(z,L),E[N+U+8]=s.x,E[N+U+9]=s.y,E[N+U+10]=s.z,E[N+U+11]=z.itemSize===4?s.w:1)}}d={count:f,texture:A,size:new et(x,y)},i.set(o,d),o.addEventListener("dispose",w)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let u=0;for(let v=0;v<c.length;v++)u+=c[v];const p=o.morphTargetsRelative?1:1-u;l.getUniforms().setValue(n,"morphTargetBaseInfluence",p),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:a}}function mg(n,e,t,i,s){let a=new WeakMap;function r(c){const h=s.render.frame,f=c.geometry,d=e.get(c,f);if(a.get(d)!==h&&(e.update(d),a.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,h))),c.isSkinnedMesh){const u=c.skeleton;a.get(u)!==h&&(u.update(),a.set(u,h))}return d}function o(){a=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}const gg={[jh]:"LINEAR_TONE_MAPPING",[Zh]:"REINHARD_TONE_MAPPING",[Jh]:"CINEON_TONE_MAPPING",[Qh]:"ACES_FILMIC_TONE_MAPPING",[td]:"AGX_TONE_MAPPING",[id]:"NEUTRAL_TONE_MAPPING",[ed]:"CUSTOM_TONE_MAPPING"};function yg(n,e,t,i,s){const a=new Ui(e,t,{type:n,depthBuffer:i,stencilBuffer:s,depthTexture:i?new vs(e,t):void 0}),r=new Ui(e,t,{type:en,depthBuffer:!1,stencilBuffer:!1}),o=new wi;o.setAttribute("position",new ei([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new ei([0,2,0,0,2,0],2));const l=new lp({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),c=new ut(o,l),h=new dr(-1,1,1,-1,0,1);let f=null,d=null,u=!1,p,v=null,g=[],m=!1;this.setSize=function(M,_){a.setSize(M,_),r.setSize(M,_);for(let x=0;x<g.length;x++){const y=g[x];y.setSize&&y.setSize(M,_)}},this.setEffects=function(M){g=M,m=g.length>0&&g[0].isRenderPass===!0;const _=a.width,x=a.height;for(let y=0;y<g.length;y++){const E=g[y];E.setSize&&E.setSize(_,x)}},this.begin=function(M,_){if(u||M.toneMapping===ki&&g.length===0)return!1;if(v=_,_!==null){const x=_.width,y=_.height;(a.width!==x||a.height!==y)&&this.setSize(x,y)}return m===!1&&M.setRenderTarget(a),p=M.toneMapping,M.toneMapping=ki,!0},this.hasRenderPass=function(){return m},this.end=function(M,_){M.toneMapping=p,u=!0;let x=a,y=r;for(let E=0;E<g.length;E++){const A=g[E];if(A.enabled!==!1&&(A.render(M,y,x,_),A.needsSwap!==!1)){const S=x;x=y,y=S}}if(f!==M.outputColorSpace||d!==M.toneMapping){f=M.outputColorSpace,d=M.toneMapping,l.defines={},$e.getTransfer(f)===st&&(l.defines.SRGB_TRANSFER="");const E=gg[d];E&&(l.defines[E]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=x.texture,M.setRenderTarget(v),M.render(c,h),v=null,u=!1},this.isCompositing=function(){return u},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),r.dispose(),o.dispose(),l.dispose()}}const Td=new Qt,fl=new vs(1,1),wd=new fd,Ad=new Bu,Rd=new yd,Qc=[],eh=[],th=new Float32Array(16),ih=new Float32Array(9),nh=new Float32Array(4);function Rs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=Qc[s];if(a===void 0&&(a=new Float32Array(s),Qc[s]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,n[r].toArray(a,o)}return a}function kt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ut(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ur(n,e){let t=eh[e];t===void 0&&(t=new Int32Array(e),eh[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function xg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function vg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;n.uniform2fv(this.addr,e),Ut(t,e)}}function _g(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(kt(t,e))return;n.uniform3fv(this.addr,e),Ut(t,e)}}function Sg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;n.uniform4fv(this.addr,e),Ut(t,e)}}function Mg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(kt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(kt(t,i))return;nh.set(i),n.uniformMatrix2fv(this.addr,!1,nh),Ut(t,i)}}function bg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(kt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(kt(t,i))return;ih.set(i),n.uniformMatrix3fv(this.addr,!1,ih),Ut(t,i)}}function Eg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(kt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(kt(t,i))return;th.set(i),n.uniformMatrix4fv(this.addr,!1,th),Ut(t,i)}}function Tg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function wg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;n.uniform2iv(this.addr,e),Ut(t,e)}}function Ag(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(kt(t,e))return;n.uniform3iv(this.addr,e),Ut(t,e)}}function Rg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;n.uniform4iv(this.addr,e),Ut(t,e)}}function Cg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Pg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;n.uniform2uiv(this.addr,e),Ut(t,e)}}function Ig(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(kt(t,e))return;n.uniform3uiv(this.addr,e),Ut(t,e)}}function Lg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;n.uniform4uiv(this.addr,e),Ut(t,e)}}function Dg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(fl.compareFunction=t.isReversedDepthBuffer()?Nl:Dl,a=fl):a=Td,t.setTexture2D(e||a,s)}function Ng(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Ad,s)}function kg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Rd,s)}function Ug(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||wd,s)}function Fg(n){switch(n){case 5126:return xg;case 35664:return vg;case 35665:return _g;case 35666:return Sg;case 35674:return Mg;case 35675:return bg;case 35676:return Eg;case 5124:case 35670:return Tg;case 35667:case 35671:return wg;case 35668:case 35672:return Ag;case 35669:case 35673:return Rg;case 5125:return Cg;case 36294:return Pg;case 36295:return Ig;case 36296:return Lg;case 35678:case 36198:case 36298:case 36306:case 35682:return Dg;case 35679:case 36299:case 36307:return Ng;case 35680:case 36300:case 36308:case 36293:return kg;case 36289:case 36303:case 36311:case 36292:return Ug}}function Bg(n,e){n.uniform1fv(this.addr,e)}function Og(n,e){const t=Rs(e,this.size,2);n.uniform2fv(this.addr,t)}function zg(n,e){const t=Rs(e,this.size,3);n.uniform3fv(this.addr,t)}function Vg(n,e){const t=Rs(e,this.size,4);n.uniform4fv(this.addr,t)}function Hg(n,e){const t=Rs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Gg(n,e){const t=Rs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Wg(n,e){const t=Rs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Xg(n,e){n.uniform1iv(this.addr,e)}function qg(n,e){n.uniform2iv(this.addr,e)}function $g(n,e){n.uniform3iv(this.addr,e)}function Yg(n,e){n.uniform4iv(this.addr,e)}function Kg(n,e){n.uniform1uiv(this.addr,e)}function jg(n,e){n.uniform2uiv(this.addr,e)}function Zg(n,e){n.uniform3uiv(this.addr,e)}function Jg(n,e){n.uniform4uiv(this.addr,e)}function Qg(n,e,t){const i=this.cache,s=e.length,a=ur(t,s);kt(i,a)||(n.uniform1iv(this.addr,a),Ut(i,a));let r;this.type===n.SAMPLER_2D_SHADOW?r=fl:r=Td;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||r,a[o])}function ey(n,e,t){const i=this.cache,s=e.length,a=ur(t,s);kt(i,a)||(n.uniform1iv(this.addr,a),Ut(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||Ad,a[r])}function ty(n,e,t){const i=this.cache,s=e.length,a=ur(t,s);kt(i,a)||(n.uniform1iv(this.addr,a),Ut(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||Rd,a[r])}function iy(n,e,t){const i=this.cache,s=e.length,a=ur(t,s);kt(i,a)||(n.uniform1iv(this.addr,a),Ut(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||wd,a[r])}function ny(n){switch(n){case 5126:return Bg;case 35664:return Og;case 35665:return zg;case 35666:return Vg;case 35674:return Hg;case 35675:return Gg;case 35676:return Wg;case 5124:case 35670:return Xg;case 35667:case 35671:return qg;case 35668:case 35672:return $g;case 35669:case 35673:return Yg;case 5125:return Kg;case 36294:return jg;case 36295:return Zg;case 36296:return Jg;case 35678:case 36198:case 36298:case 36306:case 35682:return Qg;case 35679:case 36299:case 36307:return ey;case 35680:case 36300:case 36308:case 36293:return ty;case 36289:case 36303:case 36311:case 36292:return iy}}class sy{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Fg(t.type)}}class ay{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ny(t.type)}}class ry{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],i)}}}const to=/(\w+)(\])?(\[|\.)?/g;function sh(n,e){n.seq.push(e),n.map[e.id]=e}function oy(n,e,t){const i=n.name,s=i.length;for(to.lastIndex=0;;){const a=to.exec(i),r=to.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){sh(t,c===void 0?new sy(o,n,e):new ay(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new ry(o),sh(t,f)),t=f}}}class Wa{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const o=e.getActiveUniform(t,r),l=e.getUniformLocation(t,o.name);oy(o,l,this)}const s=[],a=[];for(const r of this.seq)r.type===e.SAMPLER_2D_SHADOW||r.type===e.SAMPLER_CUBE_SHADOW||r.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(r):a.push(r);s.length>0&&(this.seq=s.concat(a))}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function ah(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const ly=37297;let cy=0;function hy(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const rh=new Ue;function dy(n){$e._getMatrix(rh,$e.workingColorSpace,n);const e=`mat3( ${rh.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(n)){case ja:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return De("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function oh(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+hy(n.getShaderSource(e),o)}else return a}function fy(n,e){const t=dy(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const uy={[jh]:"Linear",[Zh]:"Reinhard",[Jh]:"Cineon",[Qh]:"ACESFilmic",[td]:"AgX",[id]:"Neutral",[ed]:"Custom"};function py(n,e){const t=uy[e];return t===void 0?(De("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Aa=new V;function my(){$e.getLuminanceCoefficients(Aa);const n=Aa.x.toFixed(4),e=Aa.y.toFixed(4),t=Aa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function gy(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(zs).join(`
`)}function yy(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function xy(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:o}}return t}function zs(n){return n!==""}function lh(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ch(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const vy=/^[ \t]*#include +<([\w\d./]+)>/gm;function ul(n){return n.replace(vy,Sy)}const _y=new Map;function Sy(n,e){let t=Ve[e];if(t===void 0){const i=_y.get(e);if(i!==void 0)t=Ve[i],De('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ul(t)}const My=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function hh(n){return n.replace(My,by)}function by(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function dh(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Ey={[Oa]:"SHADOWMAP_TYPE_PCF",[Os]:"SHADOWMAP_TYPE_VSM"};function Ty(n){return Ey[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const wy={[Hn]:"ENVMAP_TYPE_CUBE",[xs]:"ENVMAP_TYPE_CUBE",[cr]:"ENVMAP_TYPE_CUBE_UV"};function Ay(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":wy[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const Ry={[xs]:"ENVMAP_MODE_REFRACTION"};function Cy(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Ry[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Py={[Kh]:"ENVMAP_BLENDING_MULTIPLY",[yu]:"ENVMAP_BLENDING_MIX",[xu]:"ENVMAP_BLENDING_ADD"};function Iy(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Py[n.combine]||"ENVMAP_BLENDING_NONE"}function Ly(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Dy(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const l=Ty(t),c=Ay(t),h=Cy(t),f=Iy(t),d=Ly(t),u=gy(t),p=yy(a),v=s.createProgram();let g,m,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(zs).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(zs).join(`
`),m.length>0&&(m+=`
`)):(g=[dh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(zs).join(`
`),m=[dh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ki?"#define TONE_MAPPING":"",t.toneMapping!==ki?Ve.tonemapping_pars_fragment:"",t.toneMapping!==ki?py("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,fy("linearToOutputTexel",t.outputColorSpace),my(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(zs).join(`
`)),r=ul(r),r=lh(r,t),r=ch(r,t),o=ul(o),o=lh(o,t),o=ch(o,t),r=hh(r),o=hh(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===Mc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Mc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const _=M+g+r,x=M+m+o,y=ah(s,s.VERTEX_SHADER,_),E=ah(s,s.FRAGMENT_SHADER,x);s.attachShader(v,y),s.attachShader(v,E),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(C){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(v)||"",z=s.getShaderInfoLog(y)||"",N=s.getShaderInfoLog(E)||"",L=I.trim(),U=z.trim(),B=N.trim();let Y=!0,Q=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(Y=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,y,E);else{const ne=oh(s,y,"vertex"),de=oh(s,E,"fragment");Ze("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+L+`
`+ne+`
`+de)}else L!==""?De("WebGLProgram: Program Info Log:",L):(U===""||B==="")&&(Q=!1);Q&&(C.diagnostics={runnable:Y,programLog:L,vertexShader:{log:U,prefix:g},fragmentShader:{log:B,prefix:m}})}s.deleteShader(y),s.deleteShader(E),S=new Wa(s,v),w=xy(s,v)}let S;this.getUniforms=function(){return S===void 0&&A(this),S};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(v,ly)),P},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=cy++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=y,this.fragmentShader=E,this}let Ny=0;class ky{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Uy(e),t.set(e,i)),i}}class Uy{constructor(e){this.id=Ny++,this.code=e,this.usedTimes=0}}function Fy(n){return n===Gn||n===$a||n===Ya}function By(n,e,t,i,s,a){const r=new ud,o=new ky,l=new Set,c=[],h=new Map,f=i.logarithmicDepthBuffer;let d=i.precision;const u={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(S){return l.add(S),S===0?"uv":`uv${S}`}function v(S,w,P,C,I,z){const N=C.fog,L=I.geometry,U=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?C.environment:null,B=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap,Y=e.get(S.envMap||U,B),Q=Y&&Y.mapping===cr?Y.image.height:null,ne=u[S.type];S.precision!==null&&(d=i.getMaxPrecision(S.precision),d!==S.precision&&De("WebGLProgram.getParameters:",S.precision,"not supported, using",d,"instead."));const de=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,xe=de!==void 0?de.length:0;let pe=0;L.morphAttributes.position!==void 0&&(pe=1),L.morphAttributes.normal!==void 0&&(pe=2),L.morphAttributes.color!==void 0&&(pe=3);let Re,be,X,J;if(ne){const Fe=Ii[ne];Re=Fe.vertexShader,be=Fe.fragmentShader}else Re=S.vertexShader,be=S.fragmentShader,o.update(S),X=o.getVertexShaderID(S),J=o.getFragmentShaderID(S);const Z=n.getRenderTarget(),Ee=n.state.buffers.depth.getReversed(),Pe=I.isInstancedMesh===!0,Ie=I.isBatchedMesh===!0,rt=!!S.map,ke=!!S.matcap,Ke=!!Y,it=!!S.aoMap,Ge=!!S.lightMap,Lt=!!S.bumpMap,xt=!!S.normalMap,ni=!!S.displacementMap,k=!!S.emissiveMap,Dt=!!S.metalnessMap,We=!!S.roughnessMap,pt=S.anisotropy>0,fe=S.clearcoat>0,_t=S.dispersion>0,R=S.iridescence>0,b=S.sheen>0,O=S.transmission>0,K=pt&&!!S.anisotropyMap,te=fe&&!!S.clearcoatMap,ae=fe&&!!S.clearcoatNormalMap,he=fe&&!!S.clearcoatRoughnessMap,q=R&&!!S.iridescenceMap,j=R&&!!S.iridescenceThicknessMap,ye=b&&!!S.sheenColorMap,Se=b&&!!S.sheenRoughnessMap,le=!!S.specularMap,re=!!S.specularColorMap,Ne=!!S.specularIntensityMap,Oe=O&&!!S.transmissionMap,Je=O&&!!S.thicknessMap,D=!!S.gradientMap,oe=!!S.alphaMap,$=S.alphaTest>0,ve=!!S.alphaHash,ce=!!S.extensions;let ee=ki;S.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(ee=n.toneMapping);const we={shaderID:ne,shaderType:S.type,shaderName:S.name,vertexShader:Re,fragmentShader:be,defines:S.defines,customVertexShaderID:X,customFragmentShaderID:J,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:d,batching:Ie,batchingColor:Ie&&I._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&I.instanceColor!==null,instancingMorph:Pe&&I.morphTexture!==null,outputColorSpace:Z===null?n.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:$e.workingColorSpace,alphaToCoverage:!!S.alphaToCoverage,map:rt,matcap:ke,envMap:Ke,envMapMode:Ke&&Y.mapping,envMapCubeUVHeight:Q,aoMap:it,lightMap:Ge,bumpMap:Lt,normalMap:xt,displacementMap:ni,emissiveMap:k,normalMapObjectSpace:xt&&S.normalMapType===Su,normalMapTangentSpace:xt&&S.normalMapType===cl,packedNormalMap:xt&&S.normalMapType===cl&&Fy(S.normalMap.format),metalnessMap:Dt,roughnessMap:We,anisotropy:pt,anisotropyMap:K,clearcoat:fe,clearcoatMap:te,clearcoatNormalMap:ae,clearcoatRoughnessMap:he,dispersion:_t,iridescence:R,iridescenceMap:q,iridescenceThicknessMap:j,sheen:b,sheenColorMap:ye,sheenRoughnessMap:Se,specularMap:le,specularColorMap:re,specularIntensityMap:Ne,transmission:O,transmissionMap:Oe,thicknessMap:Je,gradientMap:D,opaque:S.transparent===!1&&S.blending===us&&S.alphaToCoverage===!1,alphaMap:oe,alphaTest:$,alphaHash:ve,combine:S.combine,mapUv:rt&&p(S.map.channel),aoMapUv:it&&p(S.aoMap.channel),lightMapUv:Ge&&p(S.lightMap.channel),bumpMapUv:Lt&&p(S.bumpMap.channel),normalMapUv:xt&&p(S.normalMap.channel),displacementMapUv:ni&&p(S.displacementMap.channel),emissiveMapUv:k&&p(S.emissiveMap.channel),metalnessMapUv:Dt&&p(S.metalnessMap.channel),roughnessMapUv:We&&p(S.roughnessMap.channel),anisotropyMapUv:K&&p(S.anisotropyMap.channel),clearcoatMapUv:te&&p(S.clearcoatMap.channel),clearcoatNormalMapUv:ae&&p(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&p(S.clearcoatRoughnessMap.channel),iridescenceMapUv:q&&p(S.iridescenceMap.channel),iridescenceThicknessMapUv:j&&p(S.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&p(S.sheenColorMap.channel),sheenRoughnessMapUv:Se&&p(S.sheenRoughnessMap.channel),specularMapUv:le&&p(S.specularMap.channel),specularColorMapUv:re&&p(S.specularColorMap.channel),specularIntensityMapUv:Ne&&p(S.specularIntensityMap.channel),transmissionMapUv:Oe&&p(S.transmissionMap.channel),thicknessMapUv:Je&&p(S.thicknessMap.channel),alphaMapUv:oe&&p(S.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(xt||pt),vertexNormals:!!L.attributes.normal,vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!L.attributes.uv&&(rt||oe),fog:!!N,useFog:S.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:S.wireframe===!1&&(S.flatShading===!0||L.attributes.normal===void 0&&xt===!1&&(S.isMeshLambertMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isMeshPhysicalMaterial)),sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Ee,skinning:I.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:pe,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:ee,decodeVideoTexture:rt&&S.map.isVideoTexture===!0&&$e.getTransfer(S.map.colorSpace)===st,decodeVideoTextureEmissive:k&&S.emissiveMap.isVideoTexture===!0&&$e.getTransfer(S.emissiveMap.colorSpace)===st,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Ki,flipSided:S.side===ii,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:ce&&S.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ce&&S.extensions.multiDraw===!0||Ie)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return we.vertexUv1s=l.has(1),we.vertexUv2s=l.has(2),we.vertexUv3s=l.has(3),l.clear(),we}function g(S){const w=[];if(S.shaderID?w.push(S.shaderID):(w.push(S.customVertexShaderID),w.push(S.customFragmentShaderID)),S.defines!==void 0)for(const P in S.defines)w.push(P),w.push(S.defines[P]);return S.isRawShaderMaterial===!1&&(m(w,S),M(w,S),w.push(n.outputColorSpace)),w.push(S.customProgramCacheKey),w.join()}function m(S,w){S.push(w.precision),S.push(w.outputColorSpace),S.push(w.envMapMode),S.push(w.envMapCubeUVHeight),S.push(w.mapUv),S.push(w.alphaMapUv),S.push(w.lightMapUv),S.push(w.aoMapUv),S.push(w.bumpMapUv),S.push(w.normalMapUv),S.push(w.displacementMapUv),S.push(w.emissiveMapUv),S.push(w.metalnessMapUv),S.push(w.roughnessMapUv),S.push(w.anisotropyMapUv),S.push(w.clearcoatMapUv),S.push(w.clearcoatNormalMapUv),S.push(w.clearcoatRoughnessMapUv),S.push(w.iridescenceMapUv),S.push(w.iridescenceThicknessMapUv),S.push(w.sheenColorMapUv),S.push(w.sheenRoughnessMapUv),S.push(w.specularMapUv),S.push(w.specularColorMapUv),S.push(w.specularIntensityMapUv),S.push(w.transmissionMapUv),S.push(w.thicknessMapUv),S.push(w.combine),S.push(w.fogExp2),S.push(w.sizeAttenuation),S.push(w.morphTargetsCount),S.push(w.morphAttributeCount),S.push(w.numDirLights),S.push(w.numPointLights),S.push(w.numSpotLights),S.push(w.numSpotLightMaps),S.push(w.numHemiLights),S.push(w.numRectAreaLights),S.push(w.numDirLightShadows),S.push(w.numPointLightShadows),S.push(w.numSpotLightShadows),S.push(w.numSpotLightShadowsWithMaps),S.push(w.numLightProbes),S.push(w.shadowMapType),S.push(w.toneMapping),S.push(w.numClippingPlanes),S.push(w.numClipIntersection),S.push(w.depthPacking)}function M(S,w){r.disableAll(),w.instancing&&r.enable(0),w.instancingColor&&r.enable(1),w.instancingMorph&&r.enable(2),w.matcap&&r.enable(3),w.envMap&&r.enable(4),w.normalMapObjectSpace&&r.enable(5),w.normalMapTangentSpace&&r.enable(6),w.clearcoat&&r.enable(7),w.iridescence&&r.enable(8),w.alphaTest&&r.enable(9),w.vertexColors&&r.enable(10),w.vertexAlphas&&r.enable(11),w.vertexUv1s&&r.enable(12),w.vertexUv2s&&r.enable(13),w.vertexUv3s&&r.enable(14),w.vertexTangents&&r.enable(15),w.anisotropy&&r.enable(16),w.alphaHash&&r.enable(17),w.batching&&r.enable(18),w.dispersion&&r.enable(19),w.batchingColor&&r.enable(20),w.gradientMap&&r.enable(21),w.packedNormalMap&&r.enable(22),w.vertexNormals&&r.enable(23),S.push(r.mask),r.disableAll(),w.fog&&r.enable(0),w.useFog&&r.enable(1),w.flatShading&&r.enable(2),w.logarithmicDepthBuffer&&r.enable(3),w.reversedDepthBuffer&&r.enable(4),w.skinning&&r.enable(5),w.morphTargets&&r.enable(6),w.morphNormals&&r.enable(7),w.morphColors&&r.enable(8),w.premultipliedAlpha&&r.enable(9),w.shadowMapEnabled&&r.enable(10),w.doubleSided&&r.enable(11),w.flipSided&&r.enable(12),w.useDepthPacking&&r.enable(13),w.dithering&&r.enable(14),w.transmission&&r.enable(15),w.sheen&&r.enable(16),w.opaque&&r.enable(17),w.pointsUvs&&r.enable(18),w.decodeVideoTexture&&r.enable(19),w.decodeVideoTextureEmissive&&r.enable(20),w.alphaToCoverage&&r.enable(21),w.numLightProbeGrids>0&&r.enable(22),S.push(r.mask)}function _(S){const w=u[S.type];let P;if(w){const C=Ii[w];P=ap.clone(C.uniforms)}else P=S.uniforms;return P}function x(S,w){let P=h.get(w);return P!==void 0?++P.usedTimes:(P=new Dy(n,w,S,s),c.push(P),h.set(w,P)),P}function y(S){if(--S.usedTimes===0){const w=c.indexOf(S);c[w]=c[c.length-1],c.pop(),h.delete(S.cacheKey),S.destroy()}}function E(S){o.remove(S)}function A(){o.dispose()}return{getParameters:v,getProgramCacheKey:g,getUniforms:_,acquireProgram:x,releaseProgram:y,releaseShaderCache:E,programs:c,dispose:A}}function Oy(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,l){n.get(r)[o]=l}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function zy(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function fh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function uh(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(d){let u=0;return d.isInstancedMesh&&(u+=2),d.isSkinnedMesh&&(u+=1),u}function o(d,u,p,v,g,m){let M=n[e];return M===void 0?(M={id:d.id,object:d,geometry:u,material:p,materialVariant:r(d),groupOrder:v,renderOrder:d.renderOrder,z:g,group:m},n[e]=M):(M.id=d.id,M.object=d,M.geometry=u,M.material=p,M.materialVariant=r(d),M.groupOrder=v,M.renderOrder=d.renderOrder,M.z=g,M.group=m),e++,M}function l(d,u,p,v,g,m){const M=o(d,u,p,v,g,m);p.transmission>0?i.push(M):p.transparent===!0?s.push(M):t.push(M)}function c(d,u,p,v,g,m){const M=o(d,u,p,v,g,m);p.transmission>0?i.unshift(M):p.transparent===!0?s.unshift(M):t.unshift(M)}function h(d,u){t.length>1&&t.sort(d||zy),i.length>1&&i.sort(u||fh),s.length>1&&s.sort(u||fh)}function f(){for(let d=e,u=n.length;d<u;d++){const p=n[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:l,unshift:c,finish:f,sort:h}}function Vy(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new uh,n.set(i,[r])):s>=a.length?(r=new uh,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function Hy(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new V,color:new tt};break;case"SpotLight":t={position:new V,direction:new V,color:new tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new V,color:new tt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new V,skyColor:new tt,groundColor:new tt};break;case"RectAreaLight":t={color:new tt,position:new V,halfWidth:new V,halfHeight:new V};break}return n[e.id]=t,t}}}function Gy(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Wy=0;function Xy(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function qy(n){const e=new Hy,t=Gy(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);const s=new V,a=new Ct,r=new Ct;function o(c){let h=0,f=0,d=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let u=0,p=0,v=0,g=0,m=0,M=0,_=0,x=0,y=0,E=0,A=0;c.sort(Xy);for(let w=0,P=c.length;w<P;w++){const C=c[w],I=C.color,z=C.intensity,N=C.distance;let L=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===Gn?L=C.shadow.map.texture:L=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=I.r*z,f+=I.g*z,d+=I.b*z;else if(C.isLightProbe){for(let U=0;U<9;U++)i.probe[U].addScaledVector(C.sh.coefficients[U],z);A++}else if(C.isDirectionalLight){const U=e.get(C);if(U.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const B=C.shadow,Y=t.get(C);Y.shadowIntensity=B.intensity,Y.shadowBias=B.bias,Y.shadowNormalBias=B.normalBias,Y.shadowRadius=B.radius,Y.shadowMapSize=B.mapSize,i.directionalShadow[u]=Y,i.directionalShadowMap[u]=L,i.directionalShadowMatrix[u]=C.shadow.matrix,M++}i.directional[u]=U,u++}else if(C.isSpotLight){const U=e.get(C);U.position.setFromMatrixPosition(C.matrixWorld),U.color.copy(I).multiplyScalar(z),U.distance=N,U.coneCos=Math.cos(C.angle),U.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),U.decay=C.decay,i.spot[v]=U;const B=C.shadow;if(C.map&&(i.spotLightMap[y]=C.map,y++,B.updateMatrices(C),C.castShadow&&E++),i.spotLightMatrix[v]=B.matrix,C.castShadow){const Y=t.get(C);Y.shadowIntensity=B.intensity,Y.shadowBias=B.bias,Y.shadowNormalBias=B.normalBias,Y.shadowRadius=B.radius,Y.shadowMapSize=B.mapSize,i.spotShadow[v]=Y,i.spotShadowMap[v]=L,x++}v++}else if(C.isRectAreaLight){const U=e.get(C);U.color.copy(I).multiplyScalar(z),U.halfWidth.set(C.width*.5,0,0),U.halfHeight.set(0,C.height*.5,0),i.rectArea[g]=U,g++}else if(C.isPointLight){const U=e.get(C);if(U.color.copy(C.color).multiplyScalar(C.intensity),U.distance=C.distance,U.decay=C.decay,C.castShadow){const B=C.shadow,Y=t.get(C);Y.shadowIntensity=B.intensity,Y.shadowBias=B.bias,Y.shadowNormalBias=B.normalBias,Y.shadowRadius=B.radius,Y.shadowMapSize=B.mapSize,Y.shadowCameraNear=B.camera.near,Y.shadowCameraFar=B.camera.far,i.pointShadow[p]=Y,i.pointShadowMap[p]=L,i.pointShadowMatrix[p]=C.shadow.matrix,_++}i.point[p]=U,p++}else if(C.isHemisphereLight){const U=e.get(C);U.skyColor.copy(C.color).multiplyScalar(z),U.groundColor.copy(C.groundColor).multiplyScalar(z),i.hemi[m]=U,m++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const S=i.hash;(S.directionalLength!==u||S.pointLength!==p||S.spotLength!==v||S.rectAreaLength!==g||S.hemiLength!==m||S.numDirectionalShadows!==M||S.numPointShadows!==_||S.numSpotShadows!==x||S.numSpotMaps!==y||S.numLightProbes!==A)&&(i.directional.length=u,i.spot.length=v,i.rectArea.length=g,i.point.length=p,i.hemi.length=m,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=x+y-E,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,S.directionalLength=u,S.pointLength=p,S.spotLength=v,S.rectAreaLength=g,S.hemiLength=m,S.numDirectionalShadows=M,S.numPointShadows=_,S.numSpotShadows=x,S.numSpotMaps=y,S.numLightProbes=A,i.version=Wy++)}function l(c,h){let f=0,d=0,u=0,p=0,v=0;const g=h.matrixWorldInverse;for(let m=0,M=c.length;m<M;m++){const _=c[m];if(_.isDirectionalLight){const x=i.directional[f];x.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),f++}else if(_.isSpotLight){const x=i.spot[u];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),u++}else if(_.isRectAreaLight){const x=i.rectArea[p];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(g),r.identity(),a.copy(_.matrixWorld),a.premultiply(g),r.extractRotation(a),x.halfWidth.set(_.width*.5,0,0),x.halfHeight.set(0,_.height*.5,0),x.halfWidth.applyMatrix4(r),x.halfHeight.applyMatrix4(r),p++}else if(_.isPointLight){const x=i.point[d];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(g),d++}else if(_.isHemisphereLight){const x=i.hemi[v];x.direction.setFromMatrixPosition(_.matrixWorld),x.direction.transformDirection(g),v++}}}return{setup:o,setupView:l,state:i}}function ph(n){const e=new qy(n),t=[],i=[],s=[];function a(d){f.camera=d,t.length=0,i.length=0,s.length=0}function r(d){t.push(d)}function o(d){i.push(d)}function l(d){s.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const f={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:f,setupLights:c,setupLightsView:h,pushLight:r,pushShadow:o,pushLightProbeGrid:l}}function $y(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new ph(n),e.set(s,[o])):a>=r.length?(o=new ph(n),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Yy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ky=`uniform sampler2D shadow_pass;
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
}`,jy=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],Zy=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],mh=new Ct,Fs=new V,io=new V;function Jy(n,e,t){let i=new Fl;const s=new et,a=new et,r=new Mt,o=new cp,l=new hp,c={},h=t.maxTextureSize,f={[En]:ii,[ii]:En,[Ki]:Ki},d=new zi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new et},radius:{value:4}},vertexShader:Yy,fragmentShader:Ky}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const p=new wi;p.setAttribute("position",new Fi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ut(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Oa;let m=this.type;this.render=function(E,A,S){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;this.type===Jf&&(De("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Oa);const w=n.getRenderTarget(),P=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Zi),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const z=m!==this.type;z&&A.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(L=>L.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,L=E.length;N<L;N++){const U=E[N],B=U.shadow;if(B===void 0){De("WebGLShadowMap:",U,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const Y=B.getFrameExtents();s.multiply(Y),a.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/Y.x),s.x=a.x*Y.x,B.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/Y.y),s.y=a.y*Y.y,B.mapSize.y=a.y));const Q=n.state.buffers.depth.getReversed();if(B.camera._reversedDepth=Q,B.map===null||z===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Os){if(U.isPointLight){De("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new Ui(s.x,s.y,{format:Gn,type:en,minFilter:$t,magFilter:$t,generateMipmaps:!1}),B.map.texture.name=U.name+".shadowMap",B.map.depthTexture=new vs(s.x,s.y,Li),B.map.depthTexture.name=U.name+".shadowMapDepth",B.map.depthTexture.format=tn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Vt,B.map.depthTexture.magFilter=Vt}else U.isPointLight?(B.map=new Ed(s.x),B.map.depthTexture=new np(s.x,Oi)):(B.map=new Ui(s.x,s.y),B.map.depthTexture=new vs(s.x,s.y,Oi)),B.map.depthTexture.name=U.name+".shadowMap",B.map.depthTexture.format=tn,this.type===Oa?(B.map.depthTexture.compareFunction=Q?Nl:Dl,B.map.depthTexture.minFilter=$t,B.map.depthTexture.magFilter=$t):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Vt,B.map.depthTexture.magFilter=Vt);B.camera.updateProjectionMatrix()}const ne=B.map.isWebGLCubeRenderTarget?6:1;for(let de=0;de<ne;de++){if(B.map.isWebGLCubeRenderTarget)n.setRenderTarget(B.map,de),n.clear();else{de===0&&(n.setRenderTarget(B.map),n.clear());const xe=B.getViewport(de);r.set(a.x*xe.x,a.y*xe.y,a.x*xe.z,a.y*xe.w),I.viewport(r)}if(U.isPointLight){const xe=B.camera,pe=B.matrix,Re=U.distance||xe.far;Re!==xe.far&&(xe.far=Re,xe.updateProjectionMatrix()),Fs.setFromMatrixPosition(U.matrixWorld),xe.position.copy(Fs),io.copy(xe.position),io.add(jy[de]),xe.up.copy(Zy[de]),xe.lookAt(io),xe.updateMatrixWorld(),pe.makeTranslation(-Fs.x,-Fs.y,-Fs.z),mh.multiplyMatrices(xe.projectionMatrix,xe.matrixWorldInverse),B._frustum.setFromProjectionMatrix(mh,xe.coordinateSystem,xe.reversedDepth)}else B.updateMatrices(U);i=B.getFrustum(),x(A,S,B.camera,U,this.type)}B.isPointLightShadow!==!0&&this.type===Os&&M(B,S),B.needsUpdate=!1}m=this.type,g.needsUpdate=!1,n.setRenderTarget(w,P,C)};function M(E,A){const S=e.update(v);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,u.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Ui(s.x,s.y,{format:Gn,type:en})),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(A,null,S,d,v,null),u.uniforms.shadow_pass.value=E.mapPass.texture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(A,null,S,u,v,null)}function _(E,A,S,w){let P=null;const C=S.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(C!==void 0)P=C;else if(P=S.isPointLight===!0?l:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const I=P.uuid,z=A.uuid;let N=c[I];N===void 0&&(N={},c[I]=N);let L=N[z];L===void 0&&(L=P.clone(),N[z]=L,A.addEventListener("dispose",y)),P=L}if(P.visible=A.visible,P.wireframe=A.wireframe,w===Os?P.side=A.shadowSide!==null?A.shadowSide:A.side:P.side=A.shadowSide!==null?A.shadowSide:f[A.side],P.alphaMap=A.alphaMap,P.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,P.map=A.map,P.clipShadows=A.clipShadows,P.clippingPlanes=A.clippingPlanes,P.clipIntersection=A.clipIntersection,P.displacementMap=A.displacementMap,P.displacementScale=A.displacementScale,P.displacementBias=A.displacementBias,P.wireframeLinewidth=A.wireframeLinewidth,P.linewidth=A.linewidth,S.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const I=n.properties.get(P);I.light=S}return P}function x(E,A,S,w,P){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&P===Os)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,E.matrixWorld);const z=e.update(E),N=E.material;if(Array.isArray(N)){const L=z.groups;for(let U=0,B=L.length;U<B;U++){const Y=L[U],Q=N[Y.materialIndex];if(Q&&Q.visible){const ne=_(E,Q,w,P);E.onBeforeShadow(n,E,A,S,z,ne,Y),n.renderBufferDirect(S,null,z,ne,E,Y),E.onAfterShadow(n,E,A,S,z,ne,Y)}}}else if(N.visible){const L=_(E,N,w,P);E.onBeforeShadow(n,E,A,S,z,L,null),n.renderBufferDirect(S,null,z,L,E,null),E.onAfterShadow(n,E,A,S,z,L,null)}}const I=E.children;for(let z=0,N=I.length;z<N;z++)x(I[z],A,S,w,P)}function y(E){E.target.removeEventListener("dispose",y);for(const S in c){const w=c[S],P=E.target.uuid;P in w&&(w[P].dispose(),delete w[P])}}}function Qy(n,e){function t(){let D=!1;const oe=new Mt;let $=null;const ve=new Mt(0,0,0,0);return{setMask:function(ce){$!==ce&&!D&&(n.colorMask(ce,ce,ce,ce),$=ce)},setLocked:function(ce){D=ce},setClear:function(ce,ee,we,Fe,Et){Et===!0&&(ce*=Fe,ee*=Fe,we*=Fe),oe.set(ce,ee,we,Fe),ve.equals(oe)===!1&&(n.clearColor(ce,ee,we,Fe),ve.copy(oe))},reset:function(){D=!1,$=null,ve.set(-1,0,0,0)}}}function i(){let D=!1,oe=!1,$=null,ve=null,ce=null;return{setReversed:function(ee){if(oe!==ee){const we=e.get("EXT_clip_control");ee?we.clipControlEXT(we.LOWER_LEFT_EXT,we.ZERO_TO_ONE_EXT):we.clipControlEXT(we.LOWER_LEFT_EXT,we.NEGATIVE_ONE_TO_ONE_EXT),oe=ee;const Fe=ce;ce=null,this.setClear(Fe)}},getReversed:function(){return oe},setTest:function(ee){ee?Z(n.DEPTH_TEST):Ee(n.DEPTH_TEST)},setMask:function(ee){$!==ee&&!D&&(n.depthMask(ee),$=ee)},setFunc:function(ee){if(oe&&(ee=Iu[ee]),ve!==ee){switch(ee){case Eo:n.depthFunc(n.NEVER);break;case To:n.depthFunc(n.ALWAYS);break;case wo:n.depthFunc(n.LESS);break;case ys:n.depthFunc(n.LEQUAL);break;case Ao:n.depthFunc(n.EQUAL);break;case Ro:n.depthFunc(n.GEQUAL);break;case Co:n.depthFunc(n.GREATER);break;case Po:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ve=ee}},setLocked:function(ee){D=ee},setClear:function(ee){ce!==ee&&(ce=ee,oe&&(ee=1-ee),n.clearDepth(ee))},reset:function(){D=!1,$=null,ve=null,ce=null,oe=!1}}}function s(){let D=!1,oe=null,$=null,ve=null,ce=null,ee=null,we=null,Fe=null,Et=null;return{setTest:function(ot){D||(ot?Z(n.STENCIL_TEST):Ee(n.STENCIL_TEST))},setMask:function(ot){oe!==ot&&!D&&(n.stencilMask(ot),oe=ot)},setFunc:function(ot,Vi,Ai){($!==ot||ve!==Vi||ce!==Ai)&&(n.stencilFunc(ot,Vi,Ai),$=ot,ve=Vi,ce=Ai)},setOp:function(ot,Vi,Ai){(ee!==ot||we!==Vi||Fe!==Ai)&&(n.stencilOp(ot,Vi,Ai),ee=ot,we=Vi,Fe=Ai)},setLocked:function(ot){D=ot},setClear:function(ot){Et!==ot&&(n.clearStencil(ot),Et=ot)},reset:function(){D=!1,oe=null,$=null,ve=null,ce=null,ee=null,we=null,Fe=null,Et=null}}}const a=new t,r=new i,o=new s,l=new WeakMap,c=new WeakMap;let h={},f={},d={},u=new WeakMap,p=[],v=null,g=!1,m=null,M=null,_=null,x=null,y=null,E=null,A=null,S=new tt(0,0,0),w=0,P=!1,C=null,I=null,z=null,N=null,L=null;const U=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,Y=0;const Q=n.getParameter(n.VERSION);Q.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(Q)[1]),B=Y>=1):Q.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),B=Y>=2);let ne=null,de={};const xe=n.getParameter(n.SCISSOR_BOX),pe=n.getParameter(n.VIEWPORT),Re=new Mt().fromArray(xe),be=new Mt().fromArray(pe);function X(D,oe,$,ve){const ce=new Uint8Array(4),ee=n.createTexture();n.bindTexture(D,ee),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let we=0;we<$;we++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(oe,0,n.RGBA,1,1,ve,0,n.RGBA,n.UNSIGNED_BYTE,ce):n.texImage2D(oe+we,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ce);return ee}const J={};J[n.TEXTURE_2D]=X(n.TEXTURE_2D,n.TEXTURE_2D,1),J[n.TEXTURE_CUBE_MAP]=X(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[n.TEXTURE_2D_ARRAY]=X(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),J[n.TEXTURE_3D]=X(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),Z(n.DEPTH_TEST),r.setFunc(ys),Lt(!1),xt(yc),Z(n.CULL_FACE),it(Zi);function Z(D){h[D]!==!0&&(n.enable(D),h[D]=!0)}function Ee(D){h[D]!==!1&&(n.disable(D),h[D]=!1)}function Pe(D,oe){return d[D]!==oe?(n.bindFramebuffer(D,oe),d[D]=oe,D===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=oe),D===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=oe),!0):!1}function Ie(D,oe){let $=p,ve=!1;if(D){$=u.get(oe),$===void 0&&($=[],u.set(oe,$));const ce=D.textures;if($.length!==ce.length||$[0]!==n.COLOR_ATTACHMENT0){for(let ee=0,we=ce.length;ee<we;ee++)$[ee]=n.COLOR_ATTACHMENT0+ee;$.length=ce.length,ve=!0}}else $[0]!==n.BACK&&($[0]=n.BACK,ve=!0);ve&&n.drawBuffers($)}function rt(D){return v!==D?(n.useProgram(D),v=D,!0):!1}const ke={[Dn]:n.FUNC_ADD,[eu]:n.FUNC_SUBTRACT,[tu]:n.FUNC_REVERSE_SUBTRACT};ke[iu]=n.MIN,ke[nu]=n.MAX;const Ke={[su]:n.ZERO,[au]:n.ONE,[ru]:n.SRC_COLOR,[Mo]:n.SRC_ALPHA,[fu]:n.SRC_ALPHA_SATURATE,[hu]:n.DST_COLOR,[lu]:n.DST_ALPHA,[ou]:n.ONE_MINUS_SRC_COLOR,[bo]:n.ONE_MINUS_SRC_ALPHA,[du]:n.ONE_MINUS_DST_COLOR,[cu]:n.ONE_MINUS_DST_ALPHA,[uu]:n.CONSTANT_COLOR,[pu]:n.ONE_MINUS_CONSTANT_COLOR,[mu]:n.CONSTANT_ALPHA,[gu]:n.ONE_MINUS_CONSTANT_ALPHA};function it(D,oe,$,ve,ce,ee,we,Fe,Et,ot){if(D===Zi){g===!0&&(Ee(n.BLEND),g=!1);return}if(g===!1&&(Z(n.BLEND),g=!0),D!==Qf){if(D!==m||ot!==P){if((M!==Dn||y!==Dn)&&(n.blendEquation(n.FUNC_ADD),M=Dn,y=Dn),ot)switch(D){case us:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case So:n.blendFunc(n.ONE,n.ONE);break;case xc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case vc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Ze("WebGLState: Invalid blending: ",D);break}else switch(D){case us:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case So:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case xc:Ze("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case vc:Ze("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ze("WebGLState: Invalid blending: ",D);break}_=null,x=null,E=null,A=null,S.set(0,0,0),w=0,m=D,P=ot}return}ce=ce||oe,ee=ee||$,we=we||ve,(oe!==M||ce!==y)&&(n.blendEquationSeparate(ke[oe],ke[ce]),M=oe,y=ce),($!==_||ve!==x||ee!==E||we!==A)&&(n.blendFuncSeparate(Ke[$],Ke[ve],Ke[ee],Ke[we]),_=$,x=ve,E=ee,A=we),(Fe.equals(S)===!1||Et!==w)&&(n.blendColor(Fe.r,Fe.g,Fe.b,Et),S.copy(Fe),w=Et),m=D,P=!1}function Ge(D,oe){D.side===Ki?Ee(n.CULL_FACE):Z(n.CULL_FACE);let $=D.side===ii;oe&&($=!$),Lt($),D.blending===us&&D.transparent===!1?it(Zi):it(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),a.setMask(D.colorWrite);const ve=D.stencilWrite;o.setTest(ve),ve&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),k(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Z(n.SAMPLE_ALPHA_TO_COVERAGE):Ee(n.SAMPLE_ALPHA_TO_COVERAGE)}function Lt(D){C!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),C=D)}function xt(D){D!==jf?(Z(n.CULL_FACE),D!==I&&(D===yc?n.cullFace(n.BACK):D===Zf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ee(n.CULL_FACE),I=D}function ni(D){D!==z&&(B&&n.lineWidth(D),z=D)}function k(D,oe,$){D?(Z(n.POLYGON_OFFSET_FILL),(N!==oe||L!==$)&&(N=oe,L=$,r.getReversed()&&(oe=-oe),n.polygonOffset(oe,$))):Ee(n.POLYGON_OFFSET_FILL)}function Dt(D){D?Z(n.SCISSOR_TEST):Ee(n.SCISSOR_TEST)}function We(D){D===void 0&&(D=n.TEXTURE0+U-1),ne!==D&&(n.activeTexture(D),ne=D)}function pt(D,oe,$){$===void 0&&(ne===null?$=n.TEXTURE0+U-1:$=ne);let ve=de[$];ve===void 0&&(ve={type:void 0,texture:void 0},de[$]=ve),(ve.type!==D||ve.texture!==oe)&&(ne!==$&&(n.activeTexture($),ne=$),n.bindTexture(D,oe||J[D]),ve.type=D,ve.texture=oe)}function fe(){const D=de[ne];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function _t(){try{n.compressedTexImage2D(...arguments)}catch(D){Ze("WebGLState:",D)}}function R(){try{n.compressedTexImage3D(...arguments)}catch(D){Ze("WebGLState:",D)}}function b(){try{n.texSubImage2D(...arguments)}catch(D){Ze("WebGLState:",D)}}function O(){try{n.texSubImage3D(...arguments)}catch(D){Ze("WebGLState:",D)}}function K(){try{n.compressedTexSubImage2D(...arguments)}catch(D){Ze("WebGLState:",D)}}function te(){try{n.compressedTexSubImage3D(...arguments)}catch(D){Ze("WebGLState:",D)}}function ae(){try{n.texStorage2D(...arguments)}catch(D){Ze("WebGLState:",D)}}function he(){try{n.texStorage3D(...arguments)}catch(D){Ze("WebGLState:",D)}}function q(){try{n.texImage2D(...arguments)}catch(D){Ze("WebGLState:",D)}}function j(){try{n.texImage3D(...arguments)}catch(D){Ze("WebGLState:",D)}}function ye(D){return f[D]!==void 0?f[D]:n.getParameter(D)}function Se(D,oe){f[D]!==oe&&(n.pixelStorei(D,oe),f[D]=oe)}function le(D){Re.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),Re.copy(D))}function re(D){be.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),be.copy(D))}function Ne(D,oe){let $=c.get(oe);$===void 0&&($=new WeakMap,c.set(oe,$));let ve=$.get(D);ve===void 0&&(ve=n.getUniformBlockIndex(oe,D.name),$.set(D,ve))}function Oe(D,oe){const ve=c.get(oe).get(D);l.get(oe)!==ve&&(n.uniformBlockBinding(oe,ve,D.__bindingPointIndex),l.set(oe,ve))}function Je(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},f={},ne=null,de={},d={},u=new WeakMap,p=[],v=null,g=!1,m=null,M=null,_=null,x=null,y=null,E=null,A=null,S=new tt(0,0,0),w=0,P=!1,C=null,I=null,z=null,N=null,L=null,Re.set(0,0,n.canvas.width,n.canvas.height),be.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:Z,disable:Ee,bindFramebuffer:Pe,drawBuffers:Ie,useProgram:rt,setBlending:it,setMaterial:Ge,setFlipSided:Lt,setCullFace:xt,setLineWidth:ni,setPolygonOffset:k,setScissorTest:Dt,activeTexture:We,bindTexture:pt,unbindTexture:fe,compressedTexImage2D:_t,compressedTexImage3D:R,texImage2D:q,texImage3D:j,pixelStorei:Se,getParameter:ye,updateUBOMapping:Ne,uniformBlockBinding:Oe,texStorage2D:ae,texStorage3D:he,texSubImage2D:b,texSubImage3D:O,compressedTexSubImage2D:K,compressedTexSubImage3D:te,scissor:le,viewport:re,reset:Je}}function ex(n,e,t,i,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new et,h=new WeakMap,f=new Set;let d;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(R,b){return p?new OffscreenCanvas(R,b):Za("canvas")}function g(R,b,O){let K=1;const te=_t(R);if((te.width>O||te.height>O)&&(K=O/Math.max(te.width,te.height)),K<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const ae=Math.floor(K*te.width),he=Math.floor(K*te.height);d===void 0&&(d=v(ae,he));const q=b?v(ae,he):d;return q.width=ae,q.height=he,q.getContext("2d").drawImage(R,0,0,ae,he),De("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+ae+"x"+he+")."),q}else return"data"in R&&De("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),R;return R}function m(R){return R.generateMipmaps}function M(R){n.generateMipmap(R)}function _(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(R,b,O,K,te,ae=!1){if(R!==null){if(n[R]!==void 0)return n[R];De("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let he;K&&(he=e.get("EXT_texture_norm16"),he||De("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let q=b;if(b===n.RED&&(O===n.FLOAT&&(q=n.R32F),O===n.HALF_FLOAT&&(q=n.R16F),O===n.UNSIGNED_BYTE&&(q=n.R8),O===n.UNSIGNED_SHORT&&he&&(q=he.R16_EXT),O===n.SHORT&&he&&(q=he.R16_SNORM_EXT)),b===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(q=n.R8UI),O===n.UNSIGNED_SHORT&&(q=n.R16UI),O===n.UNSIGNED_INT&&(q=n.R32UI),O===n.BYTE&&(q=n.R8I),O===n.SHORT&&(q=n.R16I),O===n.INT&&(q=n.R32I)),b===n.RG&&(O===n.FLOAT&&(q=n.RG32F),O===n.HALF_FLOAT&&(q=n.RG16F),O===n.UNSIGNED_BYTE&&(q=n.RG8),O===n.UNSIGNED_SHORT&&he&&(q=he.RG16_EXT),O===n.SHORT&&he&&(q=he.RG16_SNORM_EXT)),b===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(q=n.RG8UI),O===n.UNSIGNED_SHORT&&(q=n.RG16UI),O===n.UNSIGNED_INT&&(q=n.RG32UI),O===n.BYTE&&(q=n.RG8I),O===n.SHORT&&(q=n.RG16I),O===n.INT&&(q=n.RG32I)),b===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(q=n.RGB8UI),O===n.UNSIGNED_SHORT&&(q=n.RGB16UI),O===n.UNSIGNED_INT&&(q=n.RGB32UI),O===n.BYTE&&(q=n.RGB8I),O===n.SHORT&&(q=n.RGB16I),O===n.INT&&(q=n.RGB32I)),b===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(q=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(q=n.RGBA16UI),O===n.UNSIGNED_INT&&(q=n.RGBA32UI),O===n.BYTE&&(q=n.RGBA8I),O===n.SHORT&&(q=n.RGBA16I),O===n.INT&&(q=n.RGBA32I)),b===n.RGB&&(O===n.UNSIGNED_SHORT&&he&&(q=he.RGB16_EXT),O===n.SHORT&&he&&(q=he.RGB16_SNORM_EXT),O===n.UNSIGNED_INT_5_9_9_9_REV&&(q=n.RGB9_E5),O===n.UNSIGNED_INT_10F_11F_11F_REV&&(q=n.R11F_G11F_B10F)),b===n.RGBA){const j=ae?ja:$e.getTransfer(te);O===n.FLOAT&&(q=n.RGBA32F),O===n.HALF_FLOAT&&(q=n.RGBA16F),O===n.UNSIGNED_BYTE&&(q=j===st?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT&&he&&(q=he.RGBA16_EXT),O===n.SHORT&&he&&(q=he.RGBA16_SNORM_EXT),O===n.UNSIGNED_SHORT_4_4_4_4&&(q=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(q=n.RGB5_A1)}return(q===n.R16F||q===n.R32F||q===n.RG16F||q===n.RG32F||q===n.RGBA16F||q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function y(R,b){let O;return R?b===null||b===Oi||b===$s?O=n.DEPTH24_STENCIL8:b===Li?O=n.DEPTH32F_STENCIL8:b===qs&&(O=n.DEPTH24_STENCIL8,De("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Oi||b===$s?O=n.DEPTH_COMPONENT24:b===Li?O=n.DEPTH_COMPONENT32F:b===qs&&(O=n.DEPTH_COMPONENT16),O}function E(R,b){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Vt&&R.minFilter!==$t?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}function A(R){const b=R.target;b.removeEventListener("dispose",A),w(b),b.isVideoTexture&&h.delete(b),b.isHTMLTexture&&f.delete(b)}function S(R){const b=R.target;b.removeEventListener("dispose",S),C(b)}function w(R){const b=i.get(R);if(b.__webglInit===void 0)return;const O=R.source,K=u.get(O);if(K){const te=K[b.__cacheKey];te.usedTimes--,te.usedTimes===0&&P(R),Object.keys(K).length===0&&u.delete(O)}i.remove(R)}function P(R){const b=i.get(R);n.deleteTexture(b.__webglTexture);const O=R.source,K=u.get(O);delete K[b.__cacheKey],r.memory.textures--}function C(R){const b=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(b.__webglFramebuffer[K]))for(let te=0;te<b.__webglFramebuffer[K].length;te++)n.deleteFramebuffer(b.__webglFramebuffer[K][te]);else n.deleteFramebuffer(b.__webglFramebuffer[K]);b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer[K])}else{if(Array.isArray(b.__webglFramebuffer))for(let K=0;K<b.__webglFramebuffer.length;K++)n.deleteFramebuffer(b.__webglFramebuffer[K]);else n.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&n.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let K=0;K<b.__webglColorRenderbuffer.length;K++)b.__webglColorRenderbuffer[K]&&n.deleteRenderbuffer(b.__webglColorRenderbuffer[K]);b.__webglDepthRenderbuffer&&n.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const O=R.textures;for(let K=0,te=O.length;K<te;K++){const ae=i.get(O[K]);ae.__webglTexture&&(n.deleteTexture(ae.__webglTexture),r.memory.textures--),i.remove(O[K])}i.remove(R)}let I=0;function z(){I=0}function N(){return I}function L(R){I=R}function U(){const R=I;return R>=s.maxTextures&&De("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),I+=1,R}function B(R){const b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}function Y(R,b){const O=i.get(R);if(R.isVideoTexture&&pt(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){const K=R.image;if(K===null)De("WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)De("WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(O,R,b);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+b)}function Q(R,b){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Ee(O,R,b);return}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+b)}function ne(R,b){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Ee(O,R,b);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+b)}function de(R,b){const O=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&O.__version!==R.version){Pe(O,R,b);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+b)}const xe={[Io]:n.REPEAT,[ji]:n.CLAMP_TO_EDGE,[Lo]:n.MIRRORED_REPEAT},pe={[Vt]:n.NEAREST,[vu]:n.NEAREST_MIPMAP_NEAREST,[ra]:n.NEAREST_MIPMAP_LINEAR,[$t]:n.LINEAR,[Er]:n.LINEAR_MIPMAP_NEAREST,[kn]:n.LINEAR_MIPMAP_LINEAR},Re={[Mu]:n.NEVER,[Au]:n.ALWAYS,[bu]:n.LESS,[Dl]:n.LEQUAL,[Eu]:n.EQUAL,[Nl]:n.GEQUAL,[Tu]:n.GREATER,[wu]:n.NOTEQUAL};function be(R,b){if(b.type===Li&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===$t||b.magFilter===Er||b.magFilter===ra||b.magFilter===kn||b.minFilter===$t||b.minFilter===Er||b.minFilter===ra||b.minFilter===kn)&&De("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,xe[b.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,xe[b.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,xe[b.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,pe[b.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,pe[b.minFilter]),b.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,Re[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Vt||b.minFilter!==ra&&b.minFilter!==kn||b.type===Li&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function X(R,b){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",A));const K=b.source;let te=u.get(K);te===void 0&&(te={},u.set(K,te));const ae=B(b);if(ae!==R.__cacheKey){te[ae]===void 0&&(te[ae]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,O=!0),te[ae].usedTimes++;const he=te[R.__cacheKey];he!==void 0&&(te[R.__cacheKey].usedTimes--,he.usedTimes===0&&P(b)),R.__cacheKey=ae,R.__webglTexture=te[ae].texture}return O}function J(R,b,O){return Math.floor(Math.floor(R/O)/b)}function Z(R,b,O,K){const ae=R.updateRanges;if(ae.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,b.width,b.height,O,K,b.data);else{ae.sort((Se,le)=>Se.start-le.start);let he=0;for(let Se=1;Se<ae.length;Se++){const le=ae[he],re=ae[Se],Ne=le.start+le.count,Oe=J(re.start,b.width,4),Je=J(le.start,b.width,4);re.start<=Ne+1&&Oe===Je&&J(re.start+re.count-1,b.width,4)===Oe?le.count=Math.max(le.count,re.start+re.count-le.start):(++he,ae[he]=re)}ae.length=he+1;const q=t.getParameter(n.UNPACK_ROW_LENGTH),j=t.getParameter(n.UNPACK_SKIP_PIXELS),ye=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,b.width);for(let Se=0,le=ae.length;Se<le;Se++){const re=ae[Se],Ne=Math.floor(re.start/4),Oe=Math.ceil(re.count/4),Je=Ne%b.width,D=Math.floor(Ne/b.width),oe=Oe,$=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Je),t.pixelStorei(n.UNPACK_SKIP_ROWS,D),t.texSubImage2D(n.TEXTURE_2D,0,Je,D,oe,$,O,K,b.data)}R.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,q),t.pixelStorei(n.UNPACK_SKIP_PIXELS,j),t.pixelStorei(n.UNPACK_SKIP_ROWS,ye)}}function Ee(R,b,O){let K=n.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(K=n.TEXTURE_2D_ARRAY),b.isData3DTexture&&(K=n.TEXTURE_3D);const te=X(R,b),ae=b.source;t.bindTexture(K,R.__webglTexture,n.TEXTURE0+O);const he=i.get(ae);if(ae.version!==he.__version||te===!0){if(t.activeTexture(n.TEXTURE0+O),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){const $=$e.getPrimaries($e.workingColorSpace),ve=b.colorSpace===mn?null:$e.getPrimaries(b.colorSpace),ce=b.colorSpace===mn||$===ve?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce)}t.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment);let j=g(b.image,!1,s.maxTextureSize);j=fe(b,j);const ye=a.convert(b.format,b.colorSpace),Se=a.convert(b.type);let le=x(b.internalFormat,ye,Se,b.normalized,b.colorSpace,b.isVideoTexture);be(K,b);let re;const Ne=b.mipmaps,Oe=b.isVideoTexture!==!0,Je=he.__version===void 0||te===!0,D=ae.dataReady,oe=E(b,j);if(b.isDepthTexture)le=y(b.format===Un,b.type),Je&&(Oe?t.texStorage2D(n.TEXTURE_2D,1,le,j.width,j.height):t.texImage2D(n.TEXTURE_2D,0,le,j.width,j.height,0,ye,Se,null));else if(b.isDataTexture)if(Ne.length>0){Oe&&Je&&t.texStorage2D(n.TEXTURE_2D,oe,le,Ne[0].width,Ne[0].height);for(let $=0,ve=Ne.length;$<ve;$++)re=Ne[$],Oe?D&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,re.width,re.height,ye,Se,re.data):t.texImage2D(n.TEXTURE_2D,$,le,re.width,re.height,0,ye,Se,re.data);b.generateMipmaps=!1}else Oe?(Je&&t.texStorage2D(n.TEXTURE_2D,oe,le,j.width,j.height),D&&Z(b,j,ye,Se)):t.texImage2D(n.TEXTURE_2D,0,le,j.width,j.height,0,ye,Se,j.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Oe&&Je&&t.texStorage3D(n.TEXTURE_2D_ARRAY,oe,le,Ne[0].width,Ne[0].height,j.depth);for(let $=0,ve=Ne.length;$<ve;$++)if(re=Ne[$],b.format!==Ti)if(ye!==null)if(Oe){if(D)if(b.layerUpdates.size>0){const ce=qc(re.width,re.height,b.format,b.type);for(const ee of b.layerUpdates){const we=re.data.subarray(ee*ce/re.data.BYTES_PER_ELEMENT,(ee+1)*ce/re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,ee,re.width,re.height,1,ye,we)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,re.width,re.height,j.depth,ye,re.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,$,le,re.width,re.height,j.depth,0,re.data,0,0);else De("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Oe?D&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,re.width,re.height,j.depth,ye,Se,re.data):t.texImage3D(n.TEXTURE_2D_ARRAY,$,le,re.width,re.height,j.depth,0,ye,Se,re.data)}else{Oe&&Je&&t.texStorage2D(n.TEXTURE_2D,oe,le,Ne[0].width,Ne[0].height);for(let $=0,ve=Ne.length;$<ve;$++)re=Ne[$],b.format!==Ti?ye!==null?Oe?D&&t.compressedTexSubImage2D(n.TEXTURE_2D,$,0,0,re.width,re.height,ye,re.data):t.compressedTexImage2D(n.TEXTURE_2D,$,le,re.width,re.height,0,re.data):De("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Oe?D&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,re.width,re.height,ye,Se,re.data):t.texImage2D(n.TEXTURE_2D,$,le,re.width,re.height,0,ye,Se,re.data)}else if(b.isDataArrayTexture)if(Oe){if(Je&&t.texStorage3D(n.TEXTURE_2D_ARRAY,oe,le,j.width,j.height,j.depth),D)if(b.layerUpdates.size>0){const $=qc(j.width,j.height,b.format,b.type);for(const ve of b.layerUpdates){const ce=j.data.subarray(ve*$/j.data.BYTES_PER_ELEMENT,(ve+1)*$/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ve,j.width,j.height,1,ye,Se,ce)}b.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ye,Se,j.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,le,j.width,j.height,j.depth,0,ye,Se,j.data);else if(b.isData3DTexture)Oe?(Je&&t.texStorage3D(n.TEXTURE_3D,oe,le,j.width,j.height,j.depth),D&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ye,Se,j.data)):t.texImage3D(n.TEXTURE_3D,0,le,j.width,j.height,j.depth,0,ye,Se,j.data);else if(b.isFramebufferTexture){if(Je)if(Oe)t.texStorage2D(n.TEXTURE_2D,oe,le,j.width,j.height);else{let $=j.width,ve=j.height;for(let ce=0;ce<oe;ce++)t.texImage2D(n.TEXTURE_2D,ce,le,$,ve,0,ye,Se,null),$>>=1,ve>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in n){const $=n.canvas;if($.hasAttribute("layoutsubtree")||$.setAttribute("layoutsubtree","true"),j.parentNode!==$){$.appendChild(j),f.add(b),$.onpaint=Fe=>{const Et=Fe.changedElements;for(const ot of f)Et.includes(ot.image)&&(ot.needsUpdate=!0)},$.requestPaint();return}const ve=0,ce=n.RGBA,ee=n.RGBA,we=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,ve,ce,ee,we,j),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Ne.length>0){if(Oe&&Je){const $=_t(Ne[0]);t.texStorage2D(n.TEXTURE_2D,oe,le,$.width,$.height)}for(let $=0,ve=Ne.length;$<ve;$++)re=Ne[$],Oe?D&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,ye,Se,re):t.texImage2D(n.TEXTURE_2D,$,le,ye,Se,re);b.generateMipmaps=!1}else if(Oe){if(Je){const $=_t(j);t.texStorage2D(n.TEXTURE_2D,oe,le,$.width,$.height)}D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ye,Se,j)}else t.texImage2D(n.TEXTURE_2D,0,le,ye,Se,j);m(b)&&M(K),he.__version=ae.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function Pe(R,b,O){if(b.image.length!==6)return;const K=X(R,b),te=b.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+O);const ae=i.get(te);if(te.version!==ae.__version||K===!0){t.activeTexture(n.TEXTURE0+O);const he=$e.getPrimaries($e.workingColorSpace),q=b.colorSpace===mn?null:$e.getPrimaries(b.colorSpace),j=b.colorSpace===mn||he===q?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const ye=b.isCompressedTexture||b.image[0].isCompressedTexture,Se=b.image[0]&&b.image[0].isDataTexture,le=[];for(let ee=0;ee<6;ee++)!ye&&!Se?le[ee]=g(b.image[ee],!0,s.maxCubemapSize):le[ee]=Se?b.image[ee].image:b.image[ee],le[ee]=fe(b,le[ee]);const re=le[0],Ne=a.convert(b.format,b.colorSpace),Oe=a.convert(b.type),Je=x(b.internalFormat,Ne,Oe,b.normalized,b.colorSpace),D=b.isVideoTexture!==!0,oe=ae.__version===void 0||K===!0,$=te.dataReady;let ve=E(b,re);be(n.TEXTURE_CUBE_MAP,b);let ce;if(ye){D&&oe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ve,Je,re.width,re.height);for(let ee=0;ee<6;ee++){ce=le[ee].mipmaps;for(let we=0;we<ce.length;we++){const Fe=ce[we];b.format!==Ti?Ne!==null?D?$&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,we,0,0,Fe.width,Fe.height,Ne,Fe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,we,Je,Fe.width,Fe.height,0,Fe.data):De("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,we,0,0,Fe.width,Fe.height,Ne,Oe,Fe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,we,Je,Fe.width,Fe.height,0,Ne,Oe,Fe.data)}}}else{if(ce=b.mipmaps,D&&oe){ce.length>0&&ve++;const ee=_t(le[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ve,Je,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(Se){D?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,le[ee].width,le[ee].height,Ne,Oe,le[ee].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Je,le[ee].width,le[ee].height,0,Ne,Oe,le[ee].data);for(let we=0;we<ce.length;we++){const Et=ce[we].image[ee].image;D?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,we+1,0,0,Et.width,Et.height,Ne,Oe,Et.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,we+1,Je,Et.width,Et.height,0,Ne,Oe,Et.data)}}else{D?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Ne,Oe,le[ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Je,Ne,Oe,le[ee]);for(let we=0;we<ce.length;we++){const Fe=ce[we];D?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,we+1,0,0,Ne,Oe,Fe.image[ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,we+1,Je,Ne,Oe,Fe.image[ee])}}}m(b)&&M(n.TEXTURE_CUBE_MAP),ae.__version=te.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function Ie(R,b,O,K,te,ae){const he=a.convert(O.format,O.colorSpace),q=a.convert(O.type),j=x(O.internalFormat,he,q,O.normalized,O.colorSpace),ye=i.get(b),Se=i.get(O);if(Se.__renderTarget=b,!ye.__hasExternalTextures){const le=Math.max(1,b.width>>ae),re=Math.max(1,b.height>>ae);te===n.TEXTURE_3D||te===n.TEXTURE_2D_ARRAY?t.texImage3D(te,ae,j,le,re,b.depth,0,he,q,null):t.texImage2D(te,ae,j,le,re,0,he,q,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),We(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,K,te,Se.__webglTexture,0,Dt(b)):(te===n.TEXTURE_2D||te>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,K,te,Se.__webglTexture,ae),t.bindFramebuffer(n.FRAMEBUFFER,null)}function rt(R,b,O){if(n.bindRenderbuffer(n.RENDERBUFFER,R),b.depthBuffer){const K=b.depthTexture,te=K&&K.isDepthTexture?K.type:null,ae=y(b.stencilBuffer,te),he=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;We(b)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Dt(b),ae,b.width,b.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,Dt(b),ae,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,ae,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,he,n.RENDERBUFFER,R)}else{const K=b.textures;for(let te=0;te<K.length;te++){const ae=K[te],he=a.convert(ae.format,ae.colorSpace),q=a.convert(ae.type),j=x(ae.internalFormat,he,q,ae.normalized,ae.colorSpace);We(b)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Dt(b),j,b.width,b.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,Dt(b),j,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,j,b.width,b.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ke(R,b,O){const K=b.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const te=i.get(b.depthTexture);if(te.__renderTarget=b,(!te.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),K){if(te.__webglInit===void 0&&(te.__webglInit=!0,b.depthTexture.addEventListener("dispose",A)),te.__webglTexture===void 0){te.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,te.__webglTexture),be(n.TEXTURE_CUBE_MAP,b.depthTexture);const ye=a.convert(b.depthTexture.format),Se=a.convert(b.depthTexture.type);let le;b.depthTexture.format===tn?le=n.DEPTH_COMPONENT24:b.depthTexture.format===Un&&(le=n.DEPTH24_STENCIL8);for(let re=0;re<6;re++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,le,b.width,b.height,0,ye,Se,null)}}else Y(b.depthTexture,0);const ae=te.__webglTexture,he=Dt(b),q=K?n.TEXTURE_CUBE_MAP_POSITIVE_X+O:n.TEXTURE_2D,j=b.depthTexture.format===Un?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(b.depthTexture.format===tn)We(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,q,ae,0,he):n.framebufferTexture2D(n.FRAMEBUFFER,j,q,ae,0);else if(b.depthTexture.format===Un)We(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,q,ae,0,he):n.framebufferTexture2D(n.FRAMEBUFFER,j,q,ae,0);else throw new Error("Unknown depthTexture format")}function Ke(R){const b=i.get(R),O=R.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==R.depthTexture){const K=R.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),K){const te=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,K.removeEventListener("dispose",te)};K.addEventListener("dispose",te),b.__depthDisposeCallback=te}b.__boundDepthTexture=K}if(R.depthTexture&&!b.__autoAllocateDepthBuffer)if(O)for(let K=0;K<6;K++)ke(b.__webglFramebuffer[K],R,K);else{const K=R.texture.mipmaps;K&&K.length>0?ke(b.__webglFramebuffer[0],R,0):ke(b.__webglFramebuffer,R,0)}else if(O){b.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[K]),b.__webglDepthbuffer[K]===void 0)b.__webglDepthbuffer[K]=n.createRenderbuffer(),rt(b.__webglDepthbuffer[K],R,!1);else{const te=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=b.__webglDepthbuffer[K];n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,ae)}}else{const K=R.texture.mipmaps;if(K&&K.length>0?t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=n.createRenderbuffer(),rt(b.__webglDepthbuffer,R,!1);else{const te=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=b.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,ae)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function it(R,b,O){const K=i.get(R);b!==void 0&&Ie(K.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Ke(R)}function Ge(R){const b=R.texture,O=i.get(R),K=i.get(b);R.addEventListener("dispose",S);const te=R.textures,ae=R.isWebGLCubeRenderTarget===!0,he=te.length>1;if(he||(K.__webglTexture===void 0&&(K.__webglTexture=n.createTexture()),K.__version=b.version,r.memory.textures++),ae){O.__webglFramebuffer=[];for(let q=0;q<6;q++)if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer[q]=[];for(let j=0;j<b.mipmaps.length;j++)O.__webglFramebuffer[q][j]=n.createFramebuffer()}else O.__webglFramebuffer[q]=n.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer=[];for(let q=0;q<b.mipmaps.length;q++)O.__webglFramebuffer[q]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(he)for(let q=0,j=te.length;q<j;q++){const ye=i.get(te[q]);ye.__webglTexture===void 0&&(ye.__webglTexture=n.createTexture(),r.memory.textures++)}if(R.samples>0&&We(R)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let q=0;q<te.length;q++){const j=te[q];O.__webglColorRenderbuffer[q]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[q]);const ye=a.convert(j.format,j.colorSpace),Se=a.convert(j.type),le=x(j.internalFormat,ye,Se,j.normalized,j.colorSpace,R.isXRRenderTarget===!0),re=Dt(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,re,le,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+q,n.RENDERBUFFER,O.__webglColorRenderbuffer[q])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),rt(O.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ae){t.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture),be(n.TEXTURE_CUBE_MAP,b);for(let q=0;q<6;q++)if(b.mipmaps&&b.mipmaps.length>0)for(let j=0;j<b.mipmaps.length;j++)Ie(O.__webglFramebuffer[q][j],R,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+q,j);else Ie(O.__webglFramebuffer[q],R,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+q,0);m(b)&&M(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(he){for(let q=0,j=te.length;q<j;q++){const ye=te[q],Se=i.get(ye);let le=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(le=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(le,Se.__webglTexture),be(le,ye),Ie(O.__webglFramebuffer,R,ye,n.COLOR_ATTACHMENT0+q,le,0),m(ye)&&M(le)}t.unbindTexture()}else{let q=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(q=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(q,K.__webglTexture),be(q,b),b.mipmaps&&b.mipmaps.length>0)for(let j=0;j<b.mipmaps.length;j++)Ie(O.__webglFramebuffer[j],R,b,n.COLOR_ATTACHMENT0,q,j);else Ie(O.__webglFramebuffer,R,b,n.COLOR_ATTACHMENT0,q,0);m(b)&&M(q),t.unbindTexture()}R.depthBuffer&&Ke(R)}function Lt(R){const b=R.textures;for(let O=0,K=b.length;O<K;O++){const te=b[O];if(m(te)){const ae=_(R),he=i.get(te).__webglTexture;t.bindTexture(ae,he),M(ae),t.unbindTexture()}}}const xt=[],ni=[];function k(R){if(R.samples>0){if(We(R)===!1){const b=R.textures,O=R.width,K=R.height;let te=n.COLOR_BUFFER_BIT;const ae=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,he=i.get(R),q=b.length>1;if(q)for(let ye=0;ye<b.length;ye++)t.bindFramebuffer(n.FRAMEBUFFER,he.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,he.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer);const j=R.texture.mipmaps;j&&j.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,he.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let ye=0;ye<b.length;ye++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(te|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(te|=n.STENCIL_BUFFER_BIT)),q){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,he.__webglColorRenderbuffer[ye]);const Se=i.get(b[ye]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Se,0)}n.blitFramebuffer(0,0,O,K,0,0,O,K,te,n.NEAREST),l===!0&&(xt.length=0,ni.length=0,xt.push(n.COLOR_ATTACHMENT0+ye),R.depthBuffer&&R.resolveDepthBuffer===!1&&(xt.push(ae),ni.push(ae),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ni)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,xt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),q)for(let ye=0;ye<b.length;ye++){t.bindFramebuffer(n.FRAMEBUFFER,he.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.RENDERBUFFER,he.__webglColorRenderbuffer[ye]);const Se=i.get(b[ye]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,he.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.TEXTURE_2D,Se,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const b=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[b])}}}function Dt(R){return Math.min(s.maxSamples,R.samples)}function We(R){const b=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function pt(R){const b=r.render.frame;h.get(R)!==b&&(h.set(R,b),R.update())}function fe(R,b){const O=R.colorSpace,K=R.format,te=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==Ka&&O!==mn&&($e.getTransfer(O)===st?(K!==Ti||te!==oi)&&De("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ze("WebGLTextures: Unsupported texture color space:",O)),b}function _t(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=z,this.getTextureUnits=N,this.setTextureUnits=L,this.setTexture2D=Y,this.setTexture2DArray=Q,this.setTexture3D=ne,this.setTextureCube=de,this.rebindTextures=it,this.setupRenderTarget=Ge,this.updateRenderTargetMipmap=Lt,this.updateMultisampleRenderTarget=k,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=Ie,this.useMultisampledRTT=We,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function tx(n,e){function t(i,s=mn){let a;const r=$e.getTransfer(s);if(i===oi)return n.UNSIGNED_BYTE;if(i===Rl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Cl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===rd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===od)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===sd)return n.BYTE;if(i===ad)return n.SHORT;if(i===qs)return n.UNSIGNED_SHORT;if(i===Al)return n.INT;if(i===Oi)return n.UNSIGNED_INT;if(i===Li)return n.FLOAT;if(i===en)return n.HALF_FLOAT;if(i===ld)return n.ALPHA;if(i===cd)return n.RGB;if(i===Ti)return n.RGBA;if(i===tn)return n.DEPTH_COMPONENT;if(i===Un)return n.DEPTH_STENCIL;if(i===hd)return n.RED;if(i===Pl)return n.RED_INTEGER;if(i===Gn)return n.RG;if(i===Il)return n.RG_INTEGER;if(i===Ll)return n.RGBA_INTEGER;if(i===za||i===Va||i===Ha||i===Ga)if(r===st)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===za)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Va)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ha)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ga)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===za)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Va)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ha)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ga)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Do||i===No||i===ko||i===Uo)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Do)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===No)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ko)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Uo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Fo||i===Bo||i===Oo||i===zo||i===Vo||i===$a||i===Ho)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===Fo||i===Bo)return r===st?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===Oo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===zo)return a.COMPRESSED_R11_EAC;if(i===Vo)return a.COMPRESSED_SIGNED_R11_EAC;if(i===$a)return a.COMPRESSED_RG11_EAC;if(i===Ho)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Go||i===Wo||i===Xo||i===qo||i===$o||i===Yo||i===Ko||i===jo||i===Zo||i===Jo||i===Qo||i===el||i===tl||i===il)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Go)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Wo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Xo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===qo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===$o)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Yo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ko)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===jo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Zo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Jo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Qo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===el)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===tl)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===il)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===nl||i===sl||i===al)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===nl)return r===st?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===sl)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===al)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===rl||i===ol||i===Ya||i===ll)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===rl)return a.COMPRESSED_RED_RGTC1_EXT;if(i===ol)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ya)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ll)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===$s?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const ix=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,nx=`
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

}`;class sx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new xd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new zi({vertexShader:ix,fragmentShader:nx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ut(new hr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ax extends Xn{constructor(e,t){super();const i=this;let s=null,a=1,r=null,o="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,p=null;const v=typeof XRWebGLBinding<"u",g=new sx,m={},M=t.getContextAttributes();let _=null,x=null;const y=[],E=[],A=new et;let S=null;const w=new Si;w.viewport=new Mt;const P=new Si;P.viewport=new Mt;const C=[w,P],I=new mp;let z=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let J=y[X];return J===void 0&&(J=new Lr,y[X]=J),J.getTargetRaySpace()},this.getControllerGrip=function(X){let J=y[X];return J===void 0&&(J=new Lr,y[X]=J),J.getGripSpace()},this.getHand=function(X){let J=y[X];return J===void 0&&(J=new Lr,y[X]=J),J.getHandSpace()};function L(X){const J=E.indexOf(X.inputSource);if(J===-1)return;const Z=y[J];Z!==void 0&&(Z.update(X.inputSource,X.frame,c||r),Z.dispatchEvent({type:X.type,data:X.inputSource}))}function U(){s.removeEventListener("select",L),s.removeEventListener("selectstart",L),s.removeEventListener("selectend",L),s.removeEventListener("squeeze",L),s.removeEventListener("squeezestart",L),s.removeEventListener("squeezeend",L),s.removeEventListener("end",U),s.removeEventListener("inputsourceschange",B);for(let X=0;X<y.length;X++){const J=E[X];J!==null&&(E[X]=null,y[X].disconnect(J))}z=null,N=null,g.reset();for(const X in m)delete m[X];e.setRenderTarget(_),u=null,d=null,f=null,s=null,x=null,be.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){a=X,i.isPresenting===!0&&De("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,i.isPresenting===!0&&De("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f===null&&v&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(_=e.getRenderTarget(),s.addEventListener("select",L),s.addEventListener("selectstart",L),s.addEventListener("selectend",L),s.addEventListener("squeeze",L),s.addEventListener("squeezestart",L),s.addEventListener("squeezeend",L),s.addEventListener("end",U),s.addEventListener("inputsourceschange",B),M.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let Z=null,Ee=null,Pe=null;M.depth&&(Pe=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=M.stencil?Un:tn,Ee=M.stencil?$s:Oi);const Ie={colorFormat:t.RGBA8,depthFormat:Pe,scaleFactor:a};f=this.getBinding(),d=f.createProjectionLayer(Ie),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Ui(d.textureWidth,d.textureHeight,{format:Ti,type:oi,depthTexture:new vs(d.textureWidth,d.textureHeight,Ee,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Z={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,t,Z),s.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new Ui(u.framebufferWidth,u.framebufferHeight,{format:Ti,type:oi,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),be.setContext(s),be.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function B(X){for(let J=0;J<X.removed.length;J++){const Z=X.removed[J],Ee=E.indexOf(Z);Ee>=0&&(E[Ee]=null,y[Ee].disconnect(Z))}for(let J=0;J<X.added.length;J++){const Z=X.added[J];let Ee=E.indexOf(Z);if(Ee===-1){for(let Ie=0;Ie<y.length;Ie++)if(Ie>=E.length){E.push(Z),Ee=Ie;break}else if(E[Ie]===null){E[Ie]=Z,Ee=Ie;break}if(Ee===-1)break}const Pe=y[Ee];Pe&&Pe.connect(Z)}}const Y=new V,Q=new V;function ne(X,J,Z){Y.setFromMatrixPosition(J.matrixWorld),Q.setFromMatrixPosition(Z.matrixWorld);const Ee=Y.distanceTo(Q),Pe=J.projectionMatrix.elements,Ie=Z.projectionMatrix.elements,rt=Pe[14]/(Pe[10]-1),ke=Pe[14]/(Pe[10]+1),Ke=(Pe[9]+1)/Pe[5],it=(Pe[9]-1)/Pe[5],Ge=(Pe[8]-1)/Pe[0],Lt=(Ie[8]+1)/Ie[0],xt=rt*Ge,ni=rt*Lt,k=Ee/(-Ge+Lt),Dt=k*-Ge;if(J.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Dt),X.translateZ(k),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Pe[10]===-1)X.projectionMatrix.copy(J.projectionMatrix),X.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const We=rt+k,pt=ke+k,fe=xt-Dt,_t=ni+(Ee-Dt),R=Ke*ke/pt*We,b=it*ke/pt*We;X.projectionMatrix.makePerspective(fe,_t,R,b,We,pt),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function de(X,J){J===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(J.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let J=X.near,Z=X.far;g.texture!==null&&(g.depthNear>0&&(J=g.depthNear),g.depthFar>0&&(Z=g.depthFar)),I.near=P.near=w.near=J,I.far=P.far=w.far=Z,(z!==I.near||N!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),z=I.near,N=I.far),I.layers.mask=X.layers.mask|6,w.layers.mask=I.layers.mask&-5,P.layers.mask=I.layers.mask&-3;const Ee=X.parent,Pe=I.cameras;de(I,Ee);for(let Ie=0;Ie<Pe.length;Ie++)de(Pe[Ie],Ee);Pe.length===2?ne(I,w,P):I.projectionMatrix.copy(w.projectionMatrix),xe(X,I,Ee)};function xe(X,J,Z){Z===null?X.matrix.copy(J.matrixWorld):(X.matrix.copy(Z.matrixWorld),X.matrix.invert(),X.matrix.multiply(J.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(J.projectionMatrix),X.projectionMatrixInverse.copy(J.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=dl*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(X){l=X,d!==null&&(d.fixedFoveation=X),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=X)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(I)},this.getCameraTexture=function(X){return m[X]};let pe=null;function Re(X,J){if(h=J.getViewerPose(c||r),p=J,h!==null){const Z=h.views;u!==null&&(e.setRenderTargetFramebuffer(x,u.framebuffer),e.setRenderTarget(x));let Ee=!1;Z.length!==I.cameras.length&&(I.cameras.length=0,Ee=!0);for(let ke=0;ke<Z.length;ke++){const Ke=Z[ke];let it=null;if(u!==null)it=u.getViewport(Ke);else{const Lt=f.getViewSubImage(d,Ke);it=Lt.viewport,ke===0&&(e.setRenderTargetTextures(x,Lt.colorTexture,Lt.depthStencilTexture),e.setRenderTarget(x))}let Ge=C[ke];Ge===void 0&&(Ge=new Si,Ge.layers.enable(ke),Ge.viewport=new Mt,C[ke]=Ge),Ge.matrix.fromArray(Ke.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(Ke.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(it.x,it.y,it.width,it.height),ke===0&&(I.matrix.copy(Ge.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Ee===!0&&I.cameras.push(Ge)}const Pe=s.enabledFeatures;if(Pe&&Pe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){f=i.getBinding();const ke=f.getDepthInformation(Z[0]);ke&&ke.isValid&&ke.texture&&g.init(ke,s.renderState)}if(Pe&&Pe.includes("camera-access")&&v){e.state.unbindTexture(),f=i.getBinding();for(let ke=0;ke<Z.length;ke++){const Ke=Z[ke].camera;if(Ke){let it=m[Ke];it||(it=new xd,m[Ke]=it);const Ge=f.getCameraImage(Ke);it.sourceTexture=Ge}}}}for(let Z=0;Z<y.length;Z++){const Ee=E[Z],Pe=y[Z];Ee!==null&&Pe!==void 0&&Pe.update(Ee,J,c||r)}pe&&pe(X,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),p=null}const be=new Md;be.setAnimationLoop(Re),this.setAnimationLoop=function(X){pe=X},this.dispose=function(){}}}const rx=new Ct,Cd=new Ue;Cd.set(-1,0,0,0,1,0,0,0,1);function ox(n,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function i(g,m){m.color.getRGB(g.fogColor.value,vd(n)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,M,_,x){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?a(g,m):m.isMeshLambertMaterial?(a(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(a(g,m),f(g,m)):m.isMeshPhongMaterial?(a(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(a(g,m),d(g,m),m.isMeshPhysicalMaterial&&u(g,m,x)):m.isMeshMatcapMaterial?(a(g,m),p(g,m)):m.isMeshDepthMaterial?a(g,m):m.isMeshDistanceMaterial?(a(g,m),v(g,m)):m.isMeshNormalMaterial?a(g,m):m.isLineBasicMaterial?(r(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,M,_):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function a(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===ii&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===ii&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const M=e.get(m),_=M.envMap,x=M.envMapRotation;_&&(g.envMap.value=_,g.envMapRotation.value.setFromMatrix4(rx.makeRotationFromEuler(x)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Cd),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function r(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,M,_){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*M,g.scale.value=_*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function f(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function u(g,m,M){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===ii&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function v(g,m){const M=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function lx(n,e,t,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,_){const x=_.program;i.uniformBlockBinding(M,x)}function c(M,_){let x=s[M.id];x===void 0&&(p(M),x=h(M),s[M.id]=x,M.addEventListener("dispose",g));const y=_.program;i.updateUBOMapping(M,y);const E=e.render.frame;a[M.id]!==E&&(d(M),a[M.id]=E)}function h(M){const _=f();M.__bindingPointIndex=_;const x=n.createBuffer(),y=M.__size,E=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,y,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,x),x}function f(){for(let M=0;M<o;M++)if(r.indexOf(M)===-1)return r.push(M),M;return Ze("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const _=s[M.id],x=M.uniforms,y=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let E=0,A=x.length;E<A;E++){const S=Array.isArray(x[E])?x[E]:[x[E]];for(let w=0,P=S.length;w<P;w++){const C=S[w];if(u(C,E,w,y)===!0){const I=C.__offset,z=Array.isArray(C.value)?C.value:[C.value];let N=0;for(let L=0;L<z.length;L++){const U=z[L],B=v(U);typeof U=="number"||typeof U=="boolean"?(C.__data[0]=U,n.bufferSubData(n.UNIFORM_BUFFER,I+N,C.__data)):U.isMatrix3?(C.__data[0]=U.elements[0],C.__data[1]=U.elements[1],C.__data[2]=U.elements[2],C.__data[3]=0,C.__data[4]=U.elements[3],C.__data[5]=U.elements[4],C.__data[6]=U.elements[5],C.__data[7]=0,C.__data[8]=U.elements[6],C.__data[9]=U.elements[7],C.__data[10]=U.elements[8],C.__data[11]=0):ArrayBuffer.isView(U)?C.__data.set(new U.constructor(U.buffer,U.byteOffset,C.__data.length)):(U.toArray(C.__data,N),N+=B.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(M,_,x,y){const E=M.value,A=_+"_"+x;if(y[A]===void 0)return typeof E=="number"||typeof E=="boolean"?y[A]=E:ArrayBuffer.isView(E)?y[A]=E.slice():y[A]=E.clone(),!0;{const S=y[A];if(typeof E=="number"||typeof E=="boolean"){if(S!==E)return y[A]=E,!0}else{if(ArrayBuffer.isView(E))return!0;if(S.equals(E)===!1)return S.copy(E),!0}}return!1}function p(M){const _=M.uniforms;let x=0;const y=16;for(let A=0,S=_.length;A<S;A++){const w=Array.isArray(_[A])?_[A]:[_[A]];for(let P=0,C=w.length;P<C;P++){const I=w[P],z=Array.isArray(I.value)?I.value:[I.value];for(let N=0,L=z.length;N<L;N++){const U=z[N],B=v(U),Y=x%y,Q=Y%B.boundary,ne=Y+Q;x+=Q,ne!==0&&y-ne<B.storage&&(x+=y-ne),I.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=x,x+=B.storage}}}const E=x%y;return E>0&&(x+=y-E),M.__size=x,M.__cache={},this}function v(M){const _={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(_.boundary=4,_.storage=4):M.isVector2?(_.boundary=8,_.storage=8):M.isVector3||M.isColor?(_.boundary=16,_.storage=12):M.isVector4?(_.boundary=16,_.storage=16):M.isMatrix3?(_.boundary=48,_.storage=48):M.isMatrix4?(_.boundary=64,_.storage=64):M.isTexture?De("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(_.boundary=16,_.storage=M.byteLength):De("WebGLRenderer: Unsupported uniform value type.",M),_}function g(M){const _=M.target;_.removeEventListener("dispose",g);const x=r.indexOf(_.__bindingPointIndex);r.splice(x,1),n.deleteBuffer(s[_.id]),delete s[_.id],delete a[_.id]}function m(){for(const M in s)n.deleteBuffer(s[M]);r=[],s={},a={}}return{bind:l,update:c,dispose:m}}const cx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Pi=null;function hx(){return Pi===null&&(Pi=new Qu(cx,16,16,Gn,en),Pi.name="DFG_LUT",Pi.minFilter=$t,Pi.magFilter=$t,Pi.wrapS=ji,Pi.wrapT=ji,Pi.generateMipmaps=!1,Pi.needsUpdate=!0),Pi}class dx{constructor(e={}){const{canvas:t=Cu(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1,outputBufferType:u=oi}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=r;const v=u,g=new Set([Ll,Il,Pl]),m=new Set([oi,Oi,qs,$s,Rl,Cl]),M=new Uint32Array(4),_=new Int32Array(4),x=new V;let y=null,E=null;const A=[],S=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ki,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let C=!1,I=null;this._outputColorSpace=hi;let z=0,N=0,L=null,U=-1,B=null;const Y=new Mt,Q=new Mt;let ne=null;const de=new tt(0);let xe=0,pe=t.width,Re=t.height,be=1,X=null,J=null;const Z=new Mt(0,0,pe,Re),Ee=new Mt(0,0,pe,Re);let Pe=!1;const Ie=new Fl;let rt=!1,ke=!1;const Ke=new Ct,it=new V,Ge=new Mt,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let xt=!1;function ni(){return L===null?be:1}let k=i;function Dt(T,F){return t.getContext(T,F)}try{const T={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${wl}`),t.addEventListener("webglcontextlost",ee,!1),t.addEventListener("webglcontextrestored",we,!1),t.addEventListener("webglcontextcreationerror",Fe,!1),k===null){const F="webgl2";if(k=Dt(F,T),k===null)throw Dt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw Ze("WebGLRenderer: "+T.message),T}let We,pt,fe,_t,R,b,O,K,te,ae,he,q,j,ye,Se,le,re,Ne,Oe,Je,D,oe,$;function ve(){We=new hg(k),We.init(),D=new tx(k,We),pt=new ig(k,We,e,D),fe=new Qy(k,We),pt.reversedDepthBuffer&&d&&fe.buffers.depth.setReversed(!0),_t=new ug(k),R=new Oy,b=new ex(k,We,fe,R,pt,D,_t),O=new cg(P),K=new yp(k),oe=new eg(k,K),te=new dg(k,K,_t,oe),ae=new mg(k,te,K,oe,_t),Ne=new pg(k,pt,b),Se=new ng(R),he=new By(P,O,We,pt,oe,Se),q=new ox(P,R),j=new Vy,ye=new $y(We),re=new Q0(P,O,fe,ae,p,l),le=new Jy(P,ae,pt),$=new lx(k,_t,pt,fe),Oe=new tg(k,We,_t),Je=new fg(k,We,_t),_t.programs=he.programs,P.capabilities=pt,P.extensions=We,P.properties=R,P.renderLists=j,P.shadowMap=le,P.state=fe,P.info=_t}ve(),v!==oi&&(w=new yg(v,t.width,t.height,s,a));const ce=new ax(P,k);this.xr=ce,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const T=We.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=We.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return be},this.setPixelRatio=function(T){T!==void 0&&(be=T,this.setSize(pe,Re,!1))},this.getSize=function(T){return T.set(pe,Re)},this.setSize=function(T,F,W=!0){if(ce.isPresenting){De("WebGLRenderer: Can't change size while VR device is presenting.");return}pe=T,Re=F,t.width=Math.floor(T*be),t.height=Math.floor(F*be),W===!0&&(t.style.width=T+"px",t.style.height=F+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,T,F)},this.getDrawingBufferSize=function(T){return T.set(pe*be,Re*be).floor()},this.setDrawingBufferSize=function(T,F,W){pe=T,Re=F,be=W,t.width=Math.floor(T*W),t.height=Math.floor(F*W),this.setViewport(0,0,T,F)},this.setEffects=function(T){if(v===oi){Ze("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let F=0;F<T.length;F++)if(T[F].isOutputPass===!0){De("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(Y)},this.getViewport=function(T){return T.copy(Z)},this.setViewport=function(T,F,W,H){T.isVector4?Z.set(T.x,T.y,T.z,T.w):Z.set(T,F,W,H),fe.viewport(Y.copy(Z).multiplyScalar(be).round())},this.getScissor=function(T){return T.copy(Ee)},this.setScissor=function(T,F,W,H){T.isVector4?Ee.set(T.x,T.y,T.z,T.w):Ee.set(T,F,W,H),fe.scissor(Q.copy(Ee).multiplyScalar(be).round())},this.getScissorTest=function(){return Pe},this.setScissorTest=function(T){fe.setScissorTest(Pe=T)},this.setOpaqueSort=function(T){X=T},this.setTransparentSort=function(T){J=T},this.getClearColor=function(T){return T.copy(re.getClearColor())},this.setClearColor=function(){re.setClearColor(...arguments)},this.getClearAlpha=function(){return re.getClearAlpha()},this.setClearAlpha=function(){re.setClearAlpha(...arguments)},this.clear=function(T=!0,F=!0,W=!0){let H=0;if(T){let G=!1;if(L!==null){const ge=L.texture.format;G=g.has(ge)}if(G){const ge=L.texture.type,Me=m.has(ge),me=re.getClearColor(),Te=re.getClearAlpha(),Ae=me.r,Be=me.g,He=me.b;Me?(M[0]=Ae,M[1]=Be,M[2]=He,M[3]=Te,k.clearBufferuiv(k.COLOR,0,M)):(_[0]=Ae,_[1]=Be,_[2]=He,_[3]=Te,k.clearBufferiv(k.COLOR,0,_))}else H|=k.COLOR_BUFFER_BIT}F&&(H|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(H|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&k.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),I=T},this.dispose=function(){t.removeEventListener("webglcontextlost",ee,!1),t.removeEventListener("webglcontextrestored",we,!1),t.removeEventListener("webglcontextcreationerror",Fe,!1),re.dispose(),j.dispose(),ye.dispose(),R.dispose(),O.dispose(),ae.dispose(),oe.dispose(),$.dispose(),he.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",nc),ce.removeEventListener("sessionend",sc),wn.stop()};function ee(T){T.preventDefault(),Ec("WebGLRenderer: Context Lost."),C=!0}function we(){Ec("WebGLRenderer: Context Restored."),C=!1;const T=_t.autoReset,F=le.enabled,W=le.autoUpdate,H=le.needsUpdate,G=le.type;ve(),_t.autoReset=T,le.enabled=F,le.autoUpdate=W,le.needsUpdate=H,le.type=G}function Fe(T){Ze("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Et(T){const F=T.target;F.removeEventListener("dispose",Et),ot(F)}function ot(T){Vi(T),R.remove(T)}function Vi(T){const F=R.get(T).programs;F!==void 0&&(F.forEach(function(W){he.releaseProgram(W)}),T.isShaderMaterial&&he.releaseShaderCache(T))}this.renderBufferDirect=function(T,F,W,H,G,ge){F===null&&(F=Lt);const Me=G.isMesh&&G.matrixWorld.determinant()<0,me=Xd(T,F,W,H,G);fe.setMaterial(H,Me);let Te=W.index,Ae=1;if(H.wireframe===!0){if(Te=te.getWireframeAttribute(W),Te===void 0)return;Ae=2}const Be=W.drawRange,He=W.attributes.position;let Ce=Be.start*Ae,lt=(Be.start+Be.count)*Ae;ge!==null&&(Ce=Math.max(Ce,ge.start*Ae),lt=Math.min(lt,(ge.start+ge.count)*Ae)),Te!==null?(Ce=Math.max(Ce,0),lt=Math.min(lt,Te.count)):He!=null&&(Ce=Math.max(Ce,0),lt=Math.min(lt,He.count));const Tt=lt-Ce;if(Tt<0||Tt===1/0)return;oe.setup(G,H,me,W,Te);let St,ht=Oe;if(Te!==null&&(St=K.get(Te),ht=Je,ht.setIndex(St)),G.isMesh)H.wireframe===!0?(fe.setLineWidth(H.wireframeLinewidth*ni()),ht.setMode(k.LINES)):ht.setMode(k.TRIANGLES);else if(G.isLine){let Gt=H.linewidth;Gt===void 0&&(Gt=1),fe.setLineWidth(Gt*ni()),G.isLineSegments?ht.setMode(k.LINES):G.isLineLoop?ht.setMode(k.LINE_LOOP):ht.setMode(k.LINE_STRIP)}else G.isPoints?ht.setMode(k.POINTS):G.isSprite&&ht.setMode(k.TRIANGLES);if(G.isBatchedMesh)if(We.get("WEBGL_multi_draw"))ht.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Gt=G._multiDrawStarts,_e=G._multiDrawCounts,si=G._multiDrawCount,je=Te?K.get(Te).bytesPerElement:1,li=R.get(H).currentProgram.getUniforms();for(let Ri=0;Ri<si;Ri++)li.setValue(k,"_gl_DrawID",Ri),ht.render(Gt[Ri]/je,_e[Ri])}else if(G.isInstancedMesh)ht.renderInstances(Ce,Tt,G.count);else if(W.isInstancedBufferGeometry){const Gt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,_e=Math.min(W.instanceCount,Gt);ht.renderInstances(Ce,Tt,_e)}else ht.render(Ce,Tt)};function Ai(T,F,W){T.transparent===!0&&T.side===Ki&&T.forceSinglePass===!1?(T.side=ii,T.needsUpdate=!0,na(T,F,W),T.side=En,T.needsUpdate=!0,na(T,F,W),T.side=Ki):na(T,F,W)}this.compile=function(T,F,W=null){W===null&&(W=T),E=ye.get(W),E.init(F),S.push(E),W.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),T!==W&&T.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),E.setupLights();const H=new Set;return T.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const ge=G.material;if(ge)if(Array.isArray(ge))for(let Me=0;Me<ge.length;Me++){const me=ge[Me];Ai(me,W,G),H.add(me)}else Ai(ge,W,G),H.add(ge)}),E=S.pop(),H},this.compileAsync=function(T,F,W=null){const H=this.compile(T,F,W);return new Promise(G=>{function ge(){if(H.forEach(function(Me){R.get(Me).currentProgram.isReady()&&H.delete(Me)}),H.size===0){G(T);return}setTimeout(ge,10)}We.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let yr=null;function Gd(T){yr&&yr(T)}function nc(){wn.stop()}function sc(){wn.start()}const wn=new Md;wn.setAnimationLoop(Gd),typeof self<"u"&&wn.setContext(self),this.setAnimationLoop=function(T){yr=T,ce.setAnimationLoop(T),T===null?wn.stop():wn.start()},ce.addEventListener("sessionstart",nc),ce.addEventListener("sessionend",sc),this.render=function(T,F){if(F!==void 0&&F.isCamera!==!0){Ze("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;I!==null&&I.renderStart(T,F);const W=ce.enabled===!0&&ce.isPresenting===!0,H=w!==null&&(L===null||W)&&w.begin(P,L);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(ce.cameraAutoUpdate===!0&&ce.updateCamera(F),F=ce.getCamera()),T.isScene===!0&&T.onBeforeRender(P,T,F,L),E=ye.get(T,S.length),E.init(F),E.state.textureUnits=b.getTextureUnits(),S.push(E),Ke.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Ie.setFromProjectionMatrix(Ke,Di,F.reversedDepth),ke=this.localClippingEnabled,rt=Se.init(this.clippingPlanes,ke),y=j.get(T,A.length),y.init(),A.push(y),ce.enabled===!0&&ce.isPresenting===!0){const Me=P.xr.getDepthSensingMesh();Me!==null&&xr(Me,F,-1/0,P.sortObjects)}xr(T,F,0,P.sortObjects),y.finish(),P.sortObjects===!0&&y.sort(X,J),xt=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,xt&&re.addToRenderList(y,T),this.info.render.frame++,rt===!0&&Se.beginShadows();const G=E.state.shadowsArray;if(le.render(G,T,F),rt===!0&&Se.endShadows(),this.info.autoReset===!0&&this.info.reset(),(H&&w.hasRenderPass())===!1){const Me=y.opaque,me=y.transmissive;if(E.setupLights(),F.isArrayCamera){const Te=F.cameras;if(me.length>0)for(let Ae=0,Be=Te.length;Ae<Be;Ae++){const He=Te[Ae];rc(Me,me,T,He)}xt&&re.render(T);for(let Ae=0,Be=Te.length;Ae<Be;Ae++){const He=Te[Ae];ac(y,T,He,He.viewport)}}else me.length>0&&rc(Me,me,T,F),xt&&re.render(T),ac(y,T,F)}L!==null&&N===0&&(b.updateMultisampleRenderTarget(L),b.updateRenderTargetMipmap(L)),H&&w.end(P),T.isScene===!0&&T.onAfterRender(P,T,F),oe.resetDefaultState(),U=-1,B=null,S.pop(),S.length>0?(E=S[S.length-1],b.setTextureUnits(E.state.textureUnits),rt===!0&&Se.setGlobalState(P.clippingPlanes,E.state.camera)):E=null,A.pop(),A.length>0?y=A[A.length-1]:y=null,I!==null&&I.renderEnd()};function xr(T,F,W,H){if(T.visible===!1)return;if(T.layers.test(F.layers)){if(T.isGroup)W=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(F);else if(T.isLightProbeGrid)E.pushLightProbeGrid(T);else if(T.isLight)E.pushLight(T),T.castShadow&&E.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Ie.intersectsSprite(T)){H&&Ge.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Ke);const Me=ae.update(T),me=T.material;me.visible&&y.push(T,Me,me,W,Ge.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Ie.intersectsObject(T))){const Me=ae.update(T),me=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ge.copy(T.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),Ge.copy(Me.boundingSphere.center)),Ge.applyMatrix4(T.matrixWorld).applyMatrix4(Ke)),Array.isArray(me)){const Te=Me.groups;for(let Ae=0,Be=Te.length;Ae<Be;Ae++){const He=Te[Ae],Ce=me[He.materialIndex];Ce&&Ce.visible&&y.push(T,Me,Ce,W,Ge.z,He)}}else me.visible&&y.push(T,Me,me,W,Ge.z,null)}}const ge=T.children;for(let Me=0,me=ge.length;Me<me;Me++)xr(ge[Me],F,W,H)}function ac(T,F,W,H){const{opaque:G,transmissive:ge,transparent:Me}=T;E.setupLightsView(W),rt===!0&&Se.setGlobalState(P.clippingPlanes,W),H&&fe.viewport(Y.copy(H)),G.length>0&&ia(G,F,W),ge.length>0&&ia(ge,F,W),Me.length>0&&ia(Me,F,W),fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1)}function rc(T,F,W,H){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[H.id]===void 0){const Ce=We.has("EXT_color_buffer_half_float")||We.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[H.id]=new Ui(1,1,{generateMipmaps:!0,type:Ce?en:oi,minFilter:kn,samples:Math.max(4,pt.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace})}const ge=E.state.transmissionRenderTarget[H.id],Me=H.viewport||Y;ge.setSize(Me.z*P.transmissionResolutionScale,Me.w*P.transmissionResolutionScale);const me=P.getRenderTarget(),Te=P.getActiveCubeFace(),Ae=P.getActiveMipmapLevel();P.setRenderTarget(ge),P.getClearColor(de),xe=P.getClearAlpha(),xe<1&&P.setClearColor(16777215,.5),P.clear(),xt&&re.render(W);const Be=P.toneMapping;P.toneMapping=ki;const He=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),E.setupLightsView(H),rt===!0&&Se.setGlobalState(P.clippingPlanes,H),ia(T,W,H),b.updateMultisampleRenderTarget(ge),b.updateRenderTargetMipmap(ge),We.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let lt=0,Tt=F.length;lt<Tt;lt++){const St=F[lt],{object:ht,geometry:Gt,material:_e,group:si}=St;if(_e.side===Ki&&ht.layers.test(H.layers)){const je=_e.side;_e.side=ii,_e.needsUpdate=!0,oc(ht,W,H,Gt,_e,si),_e.side=je,_e.needsUpdate=!0,Ce=!0}}Ce===!0&&(b.updateMultisampleRenderTarget(ge),b.updateRenderTargetMipmap(ge))}P.setRenderTarget(me,Te,Ae),P.setClearColor(de,xe),He!==void 0&&(H.viewport=He),P.toneMapping=Be}function ia(T,F,W){const H=F.isScene===!0?F.overrideMaterial:null;for(let G=0,ge=T.length;G<ge;G++){const Me=T[G],{object:me,geometry:Te,group:Ae}=Me;let Be=Me.material;Be.allowOverride===!0&&H!==null&&(Be=H),me.layers.test(W.layers)&&oc(me,F,W,Te,Be,Ae)}}function oc(T,F,W,H,G,ge){T.onBeforeRender(P,F,W,H,G,ge),T.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),G.onBeforeRender(P,F,W,H,T,ge),G.transparent===!0&&G.side===Ki&&G.forceSinglePass===!1?(G.side=ii,G.needsUpdate=!0,P.renderBufferDirect(W,F,H,G,T,ge),G.side=En,G.needsUpdate=!0,P.renderBufferDirect(W,F,H,G,T,ge),G.side=Ki):P.renderBufferDirect(W,F,H,G,T,ge),T.onAfterRender(P,F,W,H,G,ge)}function na(T,F,W){F.isScene!==!0&&(F=Lt);const H=R.get(T),G=E.state.lights,ge=E.state.shadowsArray,Me=G.state.version,me=he.getParameters(T,G.state,ge,F,W,E.state.lightProbeGridArray),Te=he.getProgramCacheKey(me);let Ae=H.programs;H.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?F.environment:null,H.fog=F.fog;const Be=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;H.envMap=O.get(T.envMap||H.environment,Be),H.envMapRotation=H.environment!==null&&T.envMap===null?F.environmentRotation:T.envMapRotation,Ae===void 0&&(T.addEventListener("dispose",Et),Ae=new Map,H.programs=Ae);let He=Ae.get(Te);if(He!==void 0){if(H.currentProgram===He&&H.lightsStateVersion===Me)return cc(T,me),He}else me.uniforms=he.getUniforms(T),I!==null&&T.isNodeMaterial&&I.build(T,W,me),T.onBeforeCompile(me,P),He=he.acquireProgram(me,Te),Ae.set(Te,He),H.uniforms=me.uniforms;const Ce=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ce.clippingPlanes=Se.uniform),cc(T,me),H.needsLights=$d(T),H.lightsStateVersion=Me,H.needsLights&&(Ce.ambientLightColor.value=G.state.ambient,Ce.lightProbe.value=G.state.probe,Ce.directionalLights.value=G.state.directional,Ce.directionalLightShadows.value=G.state.directionalShadow,Ce.spotLights.value=G.state.spot,Ce.spotLightShadows.value=G.state.spotShadow,Ce.rectAreaLights.value=G.state.rectArea,Ce.ltc_1.value=G.state.rectAreaLTC1,Ce.ltc_2.value=G.state.rectAreaLTC2,Ce.pointLights.value=G.state.point,Ce.pointLightShadows.value=G.state.pointShadow,Ce.hemisphereLights.value=G.state.hemi,Ce.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ce.spotLightMatrix.value=G.state.spotLightMatrix,Ce.spotLightMap.value=G.state.spotLightMap,Ce.pointShadowMatrix.value=G.state.pointShadowMatrix),H.lightProbeGrid=E.state.lightProbeGridArray.length>0,H.currentProgram=He,H.uniformsList=null,He}function lc(T){if(T.uniformsList===null){const F=T.currentProgram.getUniforms();T.uniformsList=Wa.seqWithValue(F.seq,T.uniforms)}return T.uniformsList}function cc(T,F){const W=R.get(T);W.outputColorSpace=F.outputColorSpace,W.batching=F.batching,W.batchingColor=F.batchingColor,W.instancing=F.instancing,W.instancingColor=F.instancingColor,W.instancingMorph=F.instancingMorph,W.skinning=F.skinning,W.morphTargets=F.morphTargets,W.morphNormals=F.morphNormals,W.morphColors=F.morphColors,W.morphTargetsCount=F.morphTargetsCount,W.numClippingPlanes=F.numClippingPlanes,W.numIntersection=F.numClipIntersection,W.vertexAlphas=F.vertexAlphas,W.vertexTangents=F.vertexTangents,W.toneMapping=F.toneMapping}function Wd(T,F){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;x.setFromMatrixPosition(F.matrixWorld);for(let W=0,H=T.length;W<H;W++){const G=T[W];if(G.texture!==null&&G.boundingBox.containsPoint(x))return G}return null}function Xd(T,F,W,H,G){F.isScene!==!0&&(F=Lt),b.resetTextureUnits();const ge=F.fog,Me=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?F.environment:null,me=L===null?P.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:$e.workingColorSpace,Te=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ae=O.get(H.envMap||Me,Te),Be=H.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,He=!!W.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ce=!!W.morphAttributes.position,lt=!!W.morphAttributes.normal,Tt=!!W.morphAttributes.color;let St=ki;H.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(St=P.toneMapping);const ht=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Gt=ht!==void 0?ht.length:0,_e=R.get(H),si=E.state.lights;if(rt===!0&&(ke===!0||T!==B)){const mt=T===B&&H.id===U;Se.setState(H,T,mt)}let je=!1;H.version===_e.__version?(_e.needsLights&&_e.lightsStateVersion!==si.state.version||_e.outputColorSpace!==me||G.isBatchedMesh&&_e.batching===!1||!G.isBatchedMesh&&_e.batching===!0||G.isBatchedMesh&&_e.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&_e.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&_e.instancing===!1||!G.isInstancedMesh&&_e.instancing===!0||G.isSkinnedMesh&&_e.skinning===!1||!G.isSkinnedMesh&&_e.skinning===!0||G.isInstancedMesh&&_e.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&_e.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&_e.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&_e.instancingMorph===!1&&G.morphTexture!==null||_e.envMap!==Ae||H.fog===!0&&_e.fog!==ge||_e.numClippingPlanes!==void 0&&(_e.numClippingPlanes!==Se.numPlanes||_e.numIntersection!==Se.numIntersection)||_e.vertexAlphas!==Be||_e.vertexTangents!==He||_e.morphTargets!==Ce||_e.morphNormals!==lt||_e.morphColors!==Tt||_e.toneMapping!==St||_e.morphTargetsCount!==Gt||!!_e.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(je=!0):(je=!0,_e.__version=H.version);let li=_e.currentProgram;je===!0&&(li=na(H,F,G),I&&H.isNodeMaterial&&I.onUpdateProgram(H,li,_e));let Ri=!1,nn=!1,qn=!1;const dt=li.getUniforms(),wt=_e.uniforms;if(fe.useProgram(li.program)&&(Ri=!0,nn=!0,qn=!0),H.id!==U&&(U=H.id,nn=!0),_e.needsLights){const mt=Wd(E.state.lightProbeGridArray,G);_e.lightProbeGrid!==mt&&(_e.lightProbeGrid=mt,nn=!0)}if(Ri||B!==T){fe.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),dt.setValue(k,"projectionMatrix",T.projectionMatrix),dt.setValue(k,"viewMatrix",T.matrixWorldInverse);const an=dt.map.cameraPosition;an!==void 0&&an.setValue(k,it.setFromMatrixPosition(T.matrixWorld)),pt.logarithmicDepthBuffer&&dt.setValue(k,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&dt.setValue(k,"isOrthographic",T.isOrthographicCamera===!0),B!==T&&(B=T,nn=!0,qn=!0)}if(_e.needsLights&&(si.state.directionalShadowMap.length>0&&dt.setValue(k,"directionalShadowMap",si.state.directionalShadowMap,b),si.state.spotShadowMap.length>0&&dt.setValue(k,"spotShadowMap",si.state.spotShadowMap,b),si.state.pointShadowMap.length>0&&dt.setValue(k,"pointShadowMap",si.state.pointShadowMap,b)),G.isSkinnedMesh){dt.setOptional(k,G,"bindMatrix"),dt.setOptional(k,G,"bindMatrixInverse");const mt=G.skeleton;mt&&(mt.boneTexture===null&&mt.computeBoneTexture(),dt.setValue(k,"boneTexture",mt.boneTexture,b))}G.isBatchedMesh&&(dt.setOptional(k,G,"batchingTexture"),dt.setValue(k,"batchingTexture",G._matricesTexture,b),dt.setOptional(k,G,"batchingIdTexture"),dt.setValue(k,"batchingIdTexture",G._indirectTexture,b),dt.setOptional(k,G,"batchingColorTexture"),G._colorsTexture!==null&&dt.setValue(k,"batchingColorTexture",G._colorsTexture,b));const sn=W.morphAttributes;if((sn.position!==void 0||sn.normal!==void 0||sn.color!==void 0)&&Ne.update(G,W,li),(nn||_e.receiveShadow!==G.receiveShadow)&&(_e.receiveShadow=G.receiveShadow,dt.setValue(k,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&F.environment!==null&&(wt.envMapIntensity.value=F.environmentIntensity),wt.dfgLUT!==void 0&&(wt.dfgLUT.value=hx()),nn){if(dt.setValue(k,"toneMappingExposure",P.toneMappingExposure),_e.needsLights&&qd(wt,qn),ge&&H.fog===!0&&q.refreshFogUniforms(wt,ge),q.refreshMaterialUniforms(wt,H,be,Re,E.state.transmissionRenderTarget[T.id]),_e.needsLights&&_e.lightProbeGrid){const mt=_e.lightProbeGrid;wt.probesSH.value=mt.texture,wt.probesMin.value.copy(mt.boundingBox.min),wt.probesMax.value.copy(mt.boundingBox.max),wt.probesResolution.value.copy(mt.resolution)}Wa.upload(k,lc(_e),wt,b)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Wa.upload(k,lc(_e),wt,b),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&dt.setValue(k,"center",G.center),dt.setValue(k,"modelViewMatrix",G.modelViewMatrix),dt.setValue(k,"normalMatrix",G.normalMatrix),dt.setValue(k,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){const mt=H.uniformsGroups;for(let an=0,$n=mt.length;an<$n;an++){const hc=mt[an];$.update(hc,li),$.bind(hc,li)}}return li}function qd(T,F){T.ambientLightColor.needsUpdate=F,T.lightProbe.needsUpdate=F,T.directionalLights.needsUpdate=F,T.directionalLightShadows.needsUpdate=F,T.pointLights.needsUpdate=F,T.pointLightShadows.needsUpdate=F,T.spotLights.needsUpdate=F,T.spotLightShadows.needsUpdate=F,T.rectAreaLights.needsUpdate=F,T.hemisphereLights.needsUpdate=F}function $d(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return z},this.getActiveMipmapLevel=function(){return N},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(T,F,W){const H=R.get(T);H.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),R.get(T.texture).__webglTexture=F,R.get(T.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:W,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,F){const W=R.get(T);W.__webglFramebuffer=F,W.__useDefaultFramebuffer=F===void 0};const Yd=k.createFramebuffer();this.setRenderTarget=function(T,F=0,W=0){L=T,z=F,N=W;let H=null,G=!1,ge=!1;if(T){const me=R.get(T);if(me.__useDefaultFramebuffer!==void 0){fe.bindFramebuffer(k.FRAMEBUFFER,me.__webglFramebuffer),Y.copy(T.viewport),Q.copy(T.scissor),ne=T.scissorTest,fe.viewport(Y),fe.scissor(Q),fe.setScissorTest(ne),U=-1;return}else if(me.__webglFramebuffer===void 0)b.setupRenderTarget(T);else if(me.__hasExternalTextures)b.rebindTextures(T,R.get(T.texture).__webglTexture,R.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Be=T.depthTexture;if(me.__boundDepthTexture!==Be){if(Be!==null&&R.has(Be)&&(T.width!==Be.image.width||T.height!==Be.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(T)}}const Te=T.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(ge=!0);const Ae=R.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ae[F])?H=Ae[F][W]:H=Ae[F],G=!0):T.samples>0&&b.useMultisampledRTT(T)===!1?H=R.get(T).__webglMultisampledFramebuffer:Array.isArray(Ae)?H=Ae[W]:H=Ae,Y.copy(T.viewport),Q.copy(T.scissor),ne=T.scissorTest}else Y.copy(Z).multiplyScalar(be).floor(),Q.copy(Ee).multiplyScalar(be).floor(),ne=Pe;if(W!==0&&(H=Yd),fe.bindFramebuffer(k.FRAMEBUFFER,H)&&fe.drawBuffers(T,H),fe.viewport(Y),fe.scissor(Q),fe.setScissorTest(ne),G){const me=R.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+F,me.__webglTexture,W)}else if(ge){const me=F;for(let Te=0;Te<T.textures.length;Te++){const Ae=R.get(T.textures[Te]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+Te,Ae.__webglTexture,W,me)}}else if(T!==null&&W!==0){const me=R.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,me.__webglTexture,W)}U=-1},this.readRenderTargetPixels=function(T,F,W,H,G,ge,Me,me=0){if(!(T&&T.isWebGLRenderTarget)){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=R.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Me!==void 0&&(Te=Te[Me]),Te){fe.bindFramebuffer(k.FRAMEBUFFER,Te);try{const Ae=T.textures[me],Be=Ae.format,He=Ae.type;if(T.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+me),!pt.textureFormatReadable(Be)){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!pt.textureTypeReadable(He)){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=T.width-H&&W>=0&&W<=T.height-G&&k.readPixels(F,W,H,G,D.convert(Be),D.convert(He),ge)}finally{const Ae=L!==null?R.get(L).__webglFramebuffer:null;fe.bindFramebuffer(k.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(T,F,W,H,G,ge,Me,me=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=R.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Me!==void 0&&(Te=Te[Me]),Te)if(F>=0&&F<=T.width-H&&W>=0&&W<=T.height-G){fe.bindFramebuffer(k.FRAMEBUFFER,Te);const Ae=T.textures[me],Be=Ae.format,He=Ae.type;if(T.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+me),!pt.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!pt.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ce=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Ce),k.bufferData(k.PIXEL_PACK_BUFFER,ge.byteLength,k.STREAM_READ),k.readPixels(F,W,H,G,D.convert(Be),D.convert(He),0);const lt=L!==null?R.get(L).__webglFramebuffer:null;fe.bindFramebuffer(k.FRAMEBUFFER,lt);const Tt=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await Pu(k,Tt,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Ce),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,ge),k.deleteBuffer(Ce),k.deleteSync(Tt),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,F=null,W=0){const H=Math.pow(2,-W),G=Math.floor(T.image.width*H),ge=Math.floor(T.image.height*H),Me=F!==null?F.x:0,me=F!==null?F.y:0;b.setTexture2D(T,0),k.copyTexSubImage2D(k.TEXTURE_2D,W,0,0,Me,me,G,ge),fe.unbindTexture()};const Kd=k.createFramebuffer(),jd=k.createFramebuffer();this.copyTextureToTexture=function(T,F,W=null,H=null,G=0,ge=0){let Me,me,Te,Ae,Be,He,Ce,lt,Tt;const St=T.isCompressedTexture?T.mipmaps[ge]:T.image;if(W!==null)Me=W.max.x-W.min.x,me=W.max.y-W.min.y,Te=W.isBox3?W.max.z-W.min.z:1,Ae=W.min.x,Be=W.min.y,He=W.isBox3?W.min.z:0;else{const wt=Math.pow(2,-G);Me=Math.floor(St.width*wt),me=Math.floor(St.height*wt),T.isDataArrayTexture?Te=St.depth:T.isData3DTexture?Te=Math.floor(St.depth*wt):Te=1,Ae=0,Be=0,He=0}H!==null?(Ce=H.x,lt=H.y,Tt=H.z):(Ce=0,lt=0,Tt=0);const ht=D.convert(F.format),Gt=D.convert(F.type);let _e;F.isData3DTexture?(b.setTexture3D(F,0),_e=k.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(b.setTexture2DArray(F,0),_e=k.TEXTURE_2D_ARRAY):(b.setTexture2D(F,0),_e=k.TEXTURE_2D),fe.activeTexture(k.TEXTURE0),fe.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,F.flipY),fe.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),fe.pixelStorei(k.UNPACK_ALIGNMENT,F.unpackAlignment);const si=fe.getParameter(k.UNPACK_ROW_LENGTH),je=fe.getParameter(k.UNPACK_IMAGE_HEIGHT),li=fe.getParameter(k.UNPACK_SKIP_PIXELS),Ri=fe.getParameter(k.UNPACK_SKIP_ROWS),nn=fe.getParameter(k.UNPACK_SKIP_IMAGES);fe.pixelStorei(k.UNPACK_ROW_LENGTH,St.width),fe.pixelStorei(k.UNPACK_IMAGE_HEIGHT,St.height),fe.pixelStorei(k.UNPACK_SKIP_PIXELS,Ae),fe.pixelStorei(k.UNPACK_SKIP_ROWS,Be),fe.pixelStorei(k.UNPACK_SKIP_IMAGES,He);const qn=T.isDataArrayTexture||T.isData3DTexture,dt=F.isDataArrayTexture||F.isData3DTexture;if(T.isDepthTexture){const wt=R.get(T),sn=R.get(F),mt=R.get(wt.__renderTarget),an=R.get(sn.__renderTarget);fe.bindFramebuffer(k.READ_FRAMEBUFFER,mt.__webglFramebuffer),fe.bindFramebuffer(k.DRAW_FRAMEBUFFER,an.__webglFramebuffer);for(let $n=0;$n<Te;$n++)qn&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,R.get(T).__webglTexture,G,He+$n),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,R.get(F).__webglTexture,ge,Tt+$n)),k.blitFramebuffer(Ae,Be,Me,me,Ce,lt,Me,me,k.DEPTH_BUFFER_BIT,k.NEAREST);fe.bindFramebuffer(k.READ_FRAMEBUFFER,null),fe.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(G!==0||T.isRenderTargetTexture||R.has(T)){const wt=R.get(T),sn=R.get(F);fe.bindFramebuffer(k.READ_FRAMEBUFFER,Kd),fe.bindFramebuffer(k.DRAW_FRAMEBUFFER,jd);for(let mt=0;mt<Te;mt++)qn?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,wt.__webglTexture,G,He+mt):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,wt.__webglTexture,G),dt?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,sn.__webglTexture,ge,Tt+mt):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,sn.__webglTexture,ge),G!==0?k.blitFramebuffer(Ae,Be,Me,me,Ce,lt,Me,me,k.COLOR_BUFFER_BIT,k.NEAREST):dt?k.copyTexSubImage3D(_e,ge,Ce,lt,Tt+mt,Ae,Be,Me,me):k.copyTexSubImage2D(_e,ge,Ce,lt,Ae,Be,Me,me);fe.bindFramebuffer(k.READ_FRAMEBUFFER,null),fe.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else dt?T.isDataTexture||T.isData3DTexture?k.texSubImage3D(_e,ge,Ce,lt,Tt,Me,me,Te,ht,Gt,St.data):F.isCompressedArrayTexture?k.compressedTexSubImage3D(_e,ge,Ce,lt,Tt,Me,me,Te,ht,St.data):k.texSubImage3D(_e,ge,Ce,lt,Tt,Me,me,Te,ht,Gt,St):T.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,ge,Ce,lt,Me,me,ht,Gt,St.data):T.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,ge,Ce,lt,St.width,St.height,ht,St.data):k.texSubImage2D(k.TEXTURE_2D,ge,Ce,lt,Me,me,ht,Gt,St);fe.pixelStorei(k.UNPACK_ROW_LENGTH,si),fe.pixelStorei(k.UNPACK_IMAGE_HEIGHT,je),fe.pixelStorei(k.UNPACK_SKIP_PIXELS,li),fe.pixelStorei(k.UNPACK_SKIP_ROWS,Ri),fe.pixelStorei(k.UNPACK_SKIP_IMAGES,nn),ge===0&&F.generateMipmaps&&k.generateMipmap(_e),fe.unbindTexture()},this.initRenderTarget=function(T){R.get(T).__webglFramebuffer===void 0&&b.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?b.setTextureCube(T,0):T.isData3DTexture?b.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?b.setTexture2DArray(T,0):b.setTexture2D(T,0),fe.unbindTexture()},this.resetState=function(){z=0,N=0,L=null,fe.reset(),oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}}const ls=80;class fx{constructor(){this.ready=!1,this.loadPromise=null,this._renderer=null,this._scene=null,this._camera=null,this._model=null,this._tmpCanvas=null,this._phases={}}init(){return this.loadPromise?this.loadPromise:(this.loadPromise=this._setup().catch(e=>{console.error("[CharacterRenderer] Failed to load model:",e)}),this.loadPromise)}draw(e,t,i,s,a,r,o){if(!this.ready)return!1;this._phases[t]||(this._phases[t]=0);const l=r>.3;l?this._phases[t]=(this._phases[t]+r*.09)%(Math.PI*2):this._phases[t]*=.88;const c=this._phases[t],h=this._model;h.rotation.y=-a+Math.PI/2,l?(h.position.y=Math.abs(Math.sin(c))*.04,h.rotation.z=Math.sin(c)*.08):o?(h.position.y=0,h.rotation.z=0,h.rotation.x=-.12):(h.position.y*=.85,h.rotation.z*=.85,h.rotation.x*=.85),this._renderer.render(this._scene,this._camera);const f=this._tmpCanvas.getContext("2d");return f.clearRect(0,0,ls,ls),f.drawImage(this._renderer.domElement,0,0),e.save(),e.translate(i,s),e.drawImage(this._tmpCanvas,-40,-44),e.restore(),!0}async _setup(){this._renderer=new dx({antialias:!0,alpha:!0,preserveDrawingBuffer:!0}),this._renderer.setSize(ls,ls),this._renderer.setPixelRatio(1),this._renderer.setClearColor(0,0),this._renderer.shadowMap.enabled=!1,this._tmpCanvas=document.createElement("canvas"),this._tmpCanvas.width=ls,this._tmpCanvas.height=ls,this._scene=new qu;const e=.65;this._camera=new dr(-e,e,e,-e,.01,30),this._camera.position.set(0,9,0),this._camera.lookAt(0,0,0);const t=new up(16777215,1.1);this._scene.add(t);const i=new Wc(16777215,.9);i.position.set(1,8,2),this._scene.add(i);const s=new Wc(11193599,.4);s.position.set(-2,5,-3),this._scene.add(s),this._model=await this._loadModel(),this._fitModel(this._model),this._scene.add(this._model),this.ready=!0,console.log("[CharacterRenderer] elf girl model loaded ✓")}createCustomRobotModel(){const e=new Fn,t=new pn(8,5,20,8),i=new Kr({color:2040877,metalness:.95,roughness:.15,name:"robot-armor"}),s=new ut(t,i);s.position.y=20,e.add(s);const a=new pn(2,2,2,8),r=new Hs({color:6749425}),o=new ut(a,r);o.rotation.x=Math.PI/2,o.position.set(0,23,7.5),e.add(o);const l=new Fn;l.position.set(0,33,0);const c=new Ja(4.5,12,12),h=new ut(c,i);l.add(h);const f=new bn(7,1.2,4),d=new Hs({color:16727100}),u=new ut(f,d);u.position.set(0,1,3.2),l.add(u);const p=new pn(.2,.2,6,4),v=new ut(p,i);v.position.set(-3.5,4,-1),v.rotation.z=-.25,l.add(v);const g=new ut(p,i);g.position.set(3.5,4,-1),g.rotation.z=.25,l.add(g),e.add(l);const m=new Ja(4,8,8),M=new ut(m,i);M.position.set(-10,26,0),M.scale.set(1.2,1,1),e.add(M);const _=new ut(m,i);_.position.set(10,26,0),_.scale.set(1.2,1,1),e.add(_);const x=new Kr({color:1118481,metalness:.8,roughness:.4}),y=new pn(1.5,1.2,10,6),E=new ut(y,x);E.position.set(-11,19,2),E.rotation.x=.4,e.add(E);const A=new ut(y,x);A.position.set(11,19,-2),A.rotation.x=-.4,e.add(A);const S=new bn(8,14,5),w=new ut(S,i);w.position.set(0,20,-6);const P=new pn(1,1.8,4,8),C=new ut(P,x);C.position.set(-3,-8,0),w.add(C);const I=new ut(P,x);I.position.set(3,-8,0),w.add(I);const z=new pn(1.2,.1,5,8),N=new Hs({color:16755200,transparent:!0,opacity:.8,blending:So}),L=new ut(z,N);L.position.set(-3,-11,0),w.add(L);const U=new ut(z,N);U.position.set(3,-11,0),w.add(U),e.add(w);const B=new ut(y,x);B.position.set(-4,6,0),e.add(B);const Y=new ut(y,x);Y.position.set(4,6,0),e.add(Y);const Q=new bn(2,2.5,18),ne=new Kr({color:330776,metalness:.9,roughness:.2}),de=new ut(Q,ne);de.position.set(7,16,-10),de.rotation.y=.1,e.add(de);const xe=new Fn;return xe.add(e),xe}_loadModel(){return Promise.resolve(this.createCustomRobotModel())}_fitModel(e){const t=new Wn().setFromObject(e),i=new V;t.getSize(i);const s=new V;t.getCenter(s);const r=1.1/Math.max(i.x,i.y,i.z);e.scale.setScalar(r);const o=new Wn().setFromObject(e),l=new V;o.getCenter(l),e.position.set(-l.x,-l.y,-l.z)}}const yn=new fx,pl=4200,ux=900,Nt=n=>String((n==null?void 0:n.id)??n??""),gh=(n,e)=>{const t=((n==null?void 0:n.x)||0)-((e==null?void 0:e.x)||0),i=((n==null?void 0:n.y)||0)-((e==null?void 0:e.y)||0);return t*t+i*i};function yh(n=[],e=0){const t=new Map;for(const i of n)t.has(i.team)||t.set(i.team,{team:i.team,sightings:new Map,assignments:new Map,coverClaims:new Map,updatedAt:e});return t}function xh(n,e){var t;return((t=n==null?void 0:n.get)==null?void 0:t.call(n,e))||null}function px(n,e,t,i){if(!n||!t||t.health<=0)return null;const s=Nt(t),a=n.sightings.get(s),r=new Set((a==null?void 0:a.seenBy)||[]);r.add(Nt(e));const o={targetId:s,x:t.x,y:t.y,vx:Number.isFinite(t.vx)?t.vx:0,vy:Number.isFinite(t.vy)?t.vy:0,seenAt:i,seenBy:r};return n.sightings.set(s,o),n.updatedAt=i,o}function ml(n,e,t,i=pl){var a,r;const s=(r=(a=n==null?void 0:n.sightings)==null?void 0:a.get)==null?void 0:r.call(a,Nt(e));return s&&t-s.seenAt<=i?s:null}function Pd(n,e,t=null){if(!n)return;const i=t?new Set([...t].map(Nt)):null;for(const[s,a]of n.sightings)(e-a.seenAt>pl||i&&!i.has(s))&&n.sightings.delete(s);for(const[s,a]of n.assignments)(i&&!i.has(a.targetId)||e>a.expiresAt+pl)&&n.assignments.delete(s);for(const[s,a]of n.coverClaims)e>a.expiresAt&&n.coverClaims.delete(s)}function mx(n=[],e=[],t,i=0){const s=n.filter(c=>(c==null?void 0:c.health)>0).sort((c,h)=>Nt(c).localeCompare(Nt(h))),a=e.filter(c=>(c==null?void 0:c.health)>0).sort((c,h)=>Nt(c).localeCompare(Nt(h))),r=new Map;if(!t||s.length===0||a.length===0)return r;const o=new Map(a.map(c=>[Nt(c),c]));Pd(t,i,o.keys());const l=new Set;for(const c of s){const h=Nt(c),f=t.assignments.get(h),d=f&&o.get(f.targetId);d&&f.expiresAt>=i&&!l.has(f.targetId)&&(r.set(h,d),l.add(f.targetId))}for(const c of s){const h=Nt(c);if(r.has(h))continue;let f=a.filter(p=>!l.has(Nt(p)));f.length===0&&(f=a),f.sort((p,v)=>{const g=ml(t,p.id,i)||p,m=ml(t,v.id,i)||v;return gh(c,g)-gh(c,m)||Nt(p).localeCompare(Nt(v))});const d=f[0],u=Nt(d);r.set(h,d),l.add(u),t.assignments.set(h,{targetId:u,assignedAt:i,expiresAt:i+ux})}return t.updatedAt=i,r}function gx(n,e,t=null){if(!n)return[];Pd(n,e);const i=Nt(t);return[...n.coverClaims.entries()].filter(([s])=>s!==i).map(([,s])=>({x:s.x,y:s.y}))}function yx(n,e,t,i,s=1600){if(!n||!t)return null;const a={x:t.x,y:t.y,expiresAt:i+s};return n.coverClaims.set(Nt(e),a),a}function xx(n,e){var t,i;(i=(t=n==null?void 0:n.coverClaims)==null?void 0:t.delete)==null||i.call(t,Nt(e))}function vx(n=[],e,t={}){const i=new Map,s=new Map;for(const a of n){const r=e instanceof Map?e.get(a.team):e==null?void 0:e[a.team];if(!(r!=null&&r.length))continue;const o=i.get(a.team)||0,c=((t instanceof Map?t.get(a.team)||0:(t==null?void 0:t[a.team])||0)+o)%r.length,h=r[c];s.set(Nt(a),{x:h.x,y:h.y,slot:c}),i.set(a.team,o+1)}return s}function _x(n,e,t=[],i=18){var r;const s=i*2+14,a=[[0,0],[s,0],[-s,0],[0,s],[0,-s],[s,s],[-s,s],[s,-s],[-s,-s],[s*2,0],[-s*2,0],[0,s*2],[0,-s*2]];for(const[o,l]of a){const c=((r=n==null?void 0:n.projectPoint)==null?void 0:r.call(n,e.x+o,e.y+l,i))||null;if(c&&!(n!=null&&n.isPointClear&&!n.isPointClear(c.x,c.y,i))&&t.every(h=>Math.hypot(h.x-c.x,h.y-c.y)>=s))return{x:c.x,y:c.y}}return null}function vh(){return{waypoints:[],index:0,target:null,plannedAt:-1/0,navRevision:null,purpose:"idle",complete:!1,partialEndpoint:null,partialSince:null,dirty:!0}}function no(n){n&&(n.dirty=!0)}function Sx(n,e,t,i,s,a="move",r=!0){const o=n.partialEndpoint,l=n.partialSince;n.waypoints=(e||[]).filter(f=>Number.isFinite(f==null?void 0:f.x)&&Number.isFinite(f==null?void 0:f.y)),n.index=0,n.target=t?{x:t.x,y:t.y}:null,n.plannedAt=i,n.navRevision=s,n.purpose=a,n.complete=r;const c=n.waypoints.at(-1)||null,h=!r&&c&&o&&Math.hypot(c.x-o.x,c.y-o.y)<12;return n.partialEndpoint=r||!c?null:{x:c.x,y:c.y},n.partialSince=h?l:null,n.dirty=!1,n}function Mx(n,e,t,i,s=24){return!n||n.complete||!n.partialEndpoint?{incomplete:!1,atEndpoint:!1,blockedFor:0}:Math.hypot(e-n.partialEndpoint.x,t-n.partialEndpoint.y)<=s?(Number.isFinite(n.partialSince)||(n.partialSince=i),{incomplete:!0,atEndpoint:!0,blockedFor:Math.max(0,i-n.partialSince)}):(n.partialSince=null,{incomplete:!0,atEndpoint:!1,blockedFor:0})}function bx(n,e,t,i={}){if(!n||n.dirty||!n.target||!n.waypoints.length||!e)return!0;const s=i.targetTolerance??42;return!!(Math.hypot(n.target.x-e.x,n.target.y-e.y)>s||t-n.plannedAt>(i.maxAge??1100)||i.stuck||i.navRevision!=null&&n.navRevision!==i.navRevision)}function Ex(n,e,t,i=24){var s;if(!((s=n==null?void 0:n.waypoints)!=null&&s.length))return(n==null?void 0:n.target)||null;for(;n.index<n.waypoints.length-1;){const a=n.waypoints[n.index];if(Math.hypot(e-a.x,t-a.y)>i)break;n.index++}return n.waypoints[Math.min(n.index,n.waypoints.length-1)]||n.target}function Tx(n,e,t,i=36){const s=Math.max(1,Number(t)||1),a=e.x-n.x,r=e.y-n.y,o=Math.min(i,Math.max(0,Math.hypot(a,r)-22)/s);return{x:e.x+(Number(e.vx)||0)*o,y:e.y+(Number(e.vy)||0)*o}}function _h(n,e,t){let i=e-n;for(;i<-Math.PI;)i+=Math.PI*2;for(;i>Math.PI;)i-=Math.PI*2;return n+Math.max(-t,Math.min(t,i))}function wx(n,e=[],t=72){let i=0,s=0;for(const a of e){if(!a||a===n||a.health<=0)continue;const r=n.x-a.x,o=n.y-a.y,l=Math.hypot(r,o);if(l>0&&l<t){const c=(t-l)/t;i+=r/l*c,s+=o/l*c}}return{x:i,y:s}}const Ra=[{id:"recruit",label:"RECRUIT",minRP:0,maxRP:999,color:"#8a9bb5",icon:"▪"},{id:"veteran",label:"VETERAN",minRP:1e3,maxRP:3999,color:"#e8c84a",icon:"◆"},{id:"elite",label:"ELITE",minRP:4e3,maxRP:1/0,color:"#ff6ef7",icon:"★"}],Ca=80,Pa=-40;function Sh(){try{return(localStorage.getItem("tacticstrike_player_name")||"").trim().toLowerCase()==="sara"}catch{return!1}}const Mh={pistol:{name:"Tactical 9mm",damage:22,fireRate:300,accuracy:.95,magSize:12,range:400,reloadTime:1200,speedMultiplier:1,type:"Semi-Auto",recoil:3,bulletSpeed:14},rifle:{name:"Assault Rifle (M4A1)",damage:26,fireRate:110,accuracy:.88,magSize:30,range:600,reloadTime:2200,speedMultiplier:1,type:"Automatic",recoil:4.5,bulletSpeed:16},shotgun:{name:"Shotgun (Remington 870)",damage:14,fireRate:850,accuracy:.65,magSize:6,range:250,reloadTime:2800,speedMultiplier:1,type:"Pump-Action",pellets:7,recoil:12,bulletSpeed:12},sniper:{name:"Sniper Rifle (AWM)",damage:95,fireRate:1500,accuracy:.99,magSize:5,range:1200,reloadTime:2800,speedMultiplier:1,type:"Bolt-Action",recoil:18,bulletSpeed:24},smg:{name:"SMG (MP5)",damage:18,fireRate:75,accuracy:.82,magSize:30,range:350,reloadTime:1500,speedMultiplier:1,type:"Automatic",recoil:2.2,bulletSpeed:13},lmg:{name:"LMG (M249)",damage:25,fireRate:85,accuracy:.75,magSize:100,range:550,reloadTime:4500,speedMultiplier:1,type:"Automatic",recoil:6,bulletSpeed:15},dmr:{name:"DMR (M14 EBR)",damage:45,fireRate:400,accuracy:.94,magSize:20,range:800,reloadTime:2400,speedMultiplier:1,type:"Semi-Auto",recoil:8.5,bulletSpeed:20},knife:{name:"Tactical Knife",damage:55,fireRate:350,accuracy:1,magSize:1,range:60,reloadTime:0,speedMultiplier:1.15,type:"Melee",recoil:0,bulletSpeed:20},vector:{name:"Vector SMG",damage:14,fireRate:48,accuracy:.87,magSize:33,range:320,reloadTime:1100,speedMultiplier:1.02,type:"Automatic",recoil:1.8,bulletSpeed:14},famas:{name:"FAMAS Burst Carbine",damage:20,fireRate:450,accuracy:.93,magSize:25,range:550,reloadTime:1800,speedMultiplier:1,type:"Automatic",pellets:3,recoil:3.5,bulletSpeed:17},plasma:{name:"Plasma Rifle PL-45",damage:32,fireRate:150,accuracy:.92,magSize:20,range:600,reloadTime:2e3,speedMultiplier:1,type:"Automatic",recoil:2,bulletSpeed:10},railgun:{name:"Railgun RG-X",damage:85,fireRate:1400,accuracy:.99,magSize:5,range:1200,reloadTime:3500,speedMultiplier:.95,type:"Automatic",recoil:22,bulletSpeed:32}},cs={cyan:{body:"#3ba39f",armor:"#16202c",helmet:"#66fcf1"},green:{body:"#39db14",armor:"#133d07",helmet:"#5eff39"},purple:{body:"#9d3bff",armor:"#20083c",helmet:"#c47aff"},orange:{body:"#ff7f3b",armor:"#3f1b07",helmet:"#ff9d7a"},yellow:{body:"#ffd700",armor:"#3a3000",helmet:"#ffea70"},red:{body:"#ff3c3c",armor:"#3a0707",helmet:"#ff7a7a"}};class Ax{constructor(e,t,i,s,a,r,o=!1,l=!1){this.id=e,this.x=t,this.y=i,this.vx=0,this.vy=0,this.radius=18,this.angle=0,this.name=s,this.isLocal=o,this.isBot=l,this.colorTheme=r||(o?"cyan":"red"),this.isTeammate=!1,this.health=100,this.maxHealth=100,this.score=0,this.rp=o?parseInt(localStorage.getItem("tacticstrike_rp")||"0"):0,this.rank=this._calcRank(this.rp),this.weaponKey=a,this.weapon={...Mh[a]},this.primaryWeaponKey=a,this.activeSlot=1,this.primaryAmmoInMag=this.weapon.magSize,this.primaryReserveAmmo=this.weapon.magSize*3,this.ammoInMag=this.weapon.magSize,this.reserveAmmo=this.weapon.magSize*3,this.maxReserveAmmo=this.weapon.magSize*5,this.isReloading=!1,this.reloadStartTime=0,this.lastFiredTime=0,this.accel=.3,this.maxSpeed=3.4,this.friction=.84,this.muzzleFlash=0,this.footstepTimer=0,this.currentSpeed=0,this.flashGrenades=1,this.flashAlpha=0,this.throwFlashbangRequest=!1,this.botTargetX=t,this.botTargetY=i,this.botState="patrol",this.lastKnownPlayerPos=null,this.botReactTime=0,this.botLastDecisionTime=0,this.botShootDelay=0,this.botRoute=vh(),this.botTargetPurpose="patrol",this.botAimReadyAt=0,this.botAimTargetId=null,this.botHadLOS=!1,this.botLastSeenAt=-1/0,this.botCoverUntil=0,this.botLaneSign=1,this.flashlightActive=!0,this.botStrafeDir=Math.random()>.5?1:-1,this.botLastStrafeToggle=0,this.dashTrails=[],this.networkJustDashed=!1,this.weaponXP=0,this.weaponLevel=1,this.weaponLevelUpAlert=0,this.healthPacks=0,this.ammoPacks=0}_calcRank(e){for(let t=Ra.length-1;t>=0;t--)if(e>=Ra[t].minRP)return Ra[t];return Ra[0]}applyRankDelta(e){this.isLocal&&e>0&&Sh()&&(e*=2),this.rp=Math.max(0,this.rp+e);const t=this._calcRank(this.rp),i=t.id!==this.rank.id;if(this.rank=t,this.isLocal)try{localStorage.setItem("tacticstrike_rp",String(this.rp))}catch{}return i}addWeaponXP(e){if(this.health<=0)return;this.isLocal&&Sh()&&(e*=2),this.weaponXP+=e;let t=!1;for(;this.weaponXP>=this.weaponLevel*100;)this.weaponXP-=this.weaponLevel*100,this.weaponLevel++,t=!0;t&&(this.weaponLevelUpAlert=4,this.isLocal&&!this.isBot&&this.updateHUD())}changeWeapon(e){this.weaponKey=e,this.weapon={...Mh[e]},this.ammoInMag=this.weapon.magSize,this.reserveAmmo=this.weapon.magSize*3,this.isReloading=!1,e!=="knife"&&(this.primaryWeaponKey=e,this.primaryAmmoInMag=this.ammoInMag,this.primaryReserveAmmo=this.reserveAmmo)}switchSlot(e){e!==this.activeSlot&&(this.activeSlot===1&&(this.primaryAmmoInMag=this.ammoInMag,this.primaryReserveAmmo=this.reserveAmmo),this.activeSlot=e,e===1?(this.changeWeapon(this.primaryWeaponKey),this.ammoInMag=this.primaryAmmoInMag,this.reserveAmmo=this.primaryReserveAmmo):e===2&&(this.changeWeapon("knife"),this.ammoInMag=1,this.reserveAmmo=1/0),this.isLocal&&!this.isBot&&(this.updateHUD(),window.AppSocket&&window.AppSocket.emit("select-weapon",{weapon:this.weaponKey})))}update(e,t,i,s,a,r=null,o=null,l=null){if(this.health<=0)return;const c=window.gameEngine&&window.gameEngine.matchMode==="sabotage",h=Math.max(1,Math.min(150,a-(this.lastUpdateTime||a)));if(c)if(this.team===1){if(this.flashlightActive=!1,this.weaponKey="none",this.isLocal&&this.inVent){this.vx=0,this.vy=0,this.lastUpdateTime=a,this.health=Math.min(this.health,this.maxHealth),this.flashAlpha=Math.max(0,this.flashAlpha-h*5e-4);return}}else this.flashlightActive=!0;this.lastUpdateTime||(this.lastUpdateTime=a);const f=a-this.lastUpdateTime;this.lastUpdateTime=a;const d=Date.now();this.adrenalineActive=!!(this.adrenalineEndTime&&d<this.adrenalineEndTime),this.overdriveActive=!!(this.overdriveEndTime&&d<this.overdriveEndTime),this.updateBuffsHUD(d);const u=Math.max(1,Math.min(150,f)),p=u/16.67,g=window.gameEngine&&window.gameEngine.isRanked?1.25:1;if(this.isLocal&&!this.isBot){this.handleLocalInput(e,t,s,a,p),this.updateDashHUD(a);const C=window.gameEngine&&window.gameEngine.devCheatActive;if(this.maxHealth=C?200:100,this.aimbotHasLOS=!1,C){this.health>200&&(this.health=200);const I=this.team===1?2:1,z=window.gameEngine.players.filter(N=>N!==this&&N.health>0&&N.team===I);if(z.length>0){const N=window.gameEngine.map;z.sort((U,B)=>Math.hypot(this.x-U.x,this.y-U.y)-Math.hypot(this.x-B.x,this.y-B.y));let L=null;if(N&&(L=z.find(U=>this.checkLineOfSight(N,this.x,this.y,U.x,U.y))),L){const U=Math.hypot(this.x-L.x,this.y-L.y),B=this.weapon.range||400;if(U<=B){this.aimbotHasLOS=!0;const Y=L.x-this.x,Q=L.y-this.y,ne=U>0?Math.max(0,U-22)/U:0,de=Y*ne,xe=Q*ne,pe=this.weapon.bulletSpeed||15,Re=L.vx||0,be=L.vy||0,X=Re*Re+be*be,J=pe*pe-X,Z=-2*(de*Re+xe*be),Ee=-(de*de+xe*xe);let Pe=0;if(Math.abs(J)>.001){const ke=Z*Z-4*J*Ee;if(ke>=0){const Ke=(-Z+Math.sqrt(ke))/(2*J),it=(-Z-Math.sqrt(ke))/(2*J);Ke>0&&it>0?Pe=Math.min(Ke,it):Ke>0?Pe=Ke:it>0&&(Pe=it)}}else if(Math.abs(Z)>.001){const ke=-Ee/Z;ke>0&&(Pe=ke)}const Ie=L.x+Re*Pe,rt=L.y+be*Pe;this.angle=Math.atan2(rt-this.y,Ie-this.x)}}}}else this.health>100&&(this.health=100)}else this.isBot&&this.handleBotAI(i,s,a,r,o,p,l||{});const m=this.isLocal&&e&&e.shift,M=this.adrenalineActive?1.35:1,_=this.weapon.speedMultiplier*(m?1.75:1)*g*M;let x=this.maxSpeed*_;this.lastDashTime&&a-this.lastDashTime<200&&(x=22,(!this.lastTrailSpawnTime||a-this.lastTrailSpawnTime>25)&&(this.dashTrails||(this.dashTrails=[]),this.dashTrails.push({x:this.x,y:this.y,angle:this.angle,time:a}),this.lastTrailSpawnTime=a)),this.dashTrails&&this.dashTrails.length>0&&(this.dashTrails=this.dashTrails.filter(C=>a-C.time<180)),this.vx*=Math.pow(this.friction,p),this.vy*=Math.pow(this.friction,p);const A=Math.sqrt(this.vx*this.vx+this.vy*this.vy);A>x&&(this.vx=this.vx/A*x,this.vy=this.vy/A*x),this.currentSpeed=A;const S=this.x+this.vx*p,w=this.y+this.vy*p,P=i.moveCircle?i.moveCircle(this.x,this.y,this.vx*p,this.vy*p,this.radius):i.checkCircleCollision(S,w,this.radius);if(this.x=P.x,this.y=P.y,P.collided){const C=this.vx*P.normalX+this.vy*P.normalY;C<0&&(this.vx-=C*P.normalX,this.vy-=C*P.normalY)}if((Math.abs(this.vx)>.5||Math.abs(this.vy)>.5)&&(this.footstepTimer+=A,this.footstepTimer>120&&(this.footstepTimer=0,s))){const C=o?Math.hypot(this.x-o.x,this.y-o.y):0;(this.isLocal||C<450)&&s.playFootstep()}if(this.isReloading&&a-this.reloadStartTime>=this.weapon.reloadTime){const I=this.weapon.magSize-this.ammoInMag,z=Math.min(I,this.reserveAmmo);this.ammoInMag+=z,this.reserveAmmo-=z,this.isReloading=!1,this.isLocal&&!this.isBot&&this.updateHUD()}this.muzzleFlash>0&&(this.muzzleFlash=Math.max(0,this.muzzleFlash-.15*p)),this.flashAlpha>0&&(this.flashAlpha=Math.max(0,this.flashAlpha-.008*p)),this.weaponLevelUpAlert>0&&(this.weaponLevelUpAlert=Math.max(0,this.weaponLevelUpAlert-u/1e3))}handleLocalInput(e,t,i,s,a){if(window.gameEngine&&window.gameEngine.activeMinigame){this.vx=0,this.vy=0;return}const o=e&&e.shift?1.75:1;let c=window.gameEngine&&window.gameEngine.isRanked?1.25:1;this.adrenalineActive&&(c*=1.35);const h=this.accel*c;let f=0,d=0;if((e.w||e.arrowup)&&(d-=h*o),(e.s||e.arrowdown)&&(d+=h*o),(e.a||e.arrowleft)&&(f-=h*o),(e.d||e.arrowright)&&(f+=h*o),f!==0&&d!==0&&(f*=.7071,d*=.7071),this.vx+=f*a,this.vy+=d*a,this.angle=t.angle,e&&e[" "]&&(!this.lastDashTime||s-this.lastDashTime>1e4)){this.lastDashTime=s,this.justDashed=!0,this.networkJustDashed=!0;const p=22;if(this.vx=Math.cos(this.angle)*p,this.vy=Math.sin(this.angle)*p,i)try{i.playDashSound(0)}catch{}}(e.r||e.R)&&!this.isReloading&&this.ammoInMag<this.weapon.magSize&&this.reserveAmmo>0&&this.startReload(i,s)}startReload(e,t){if(this.isReloading=!0,this.reloadStartTime=t,e&&e.playReload(this.weaponKey),this.isLocal&&!this.isBot){const i=document.getElementById("reload-indicator");i&&(i.style.display="flex",setTimeout(()=>{i&&(i.style.display="none")},this.weapon.reloadTime))}}shoot(e,t,i=0){if(this.health<=0||this.isReloading||window.gameEngine&&window.gameEngine.matchMode==="sabotage"&&this.team===1)return null;window.gameEngine&&window.gameEngine.devCheatActive&&this.isLocal;const a=this.overdriveEndTime&&e<this.overdriveEndTime||this.overdriveActive?.5:1;if(e-this.lastFiredTime<this.weapon.fireRate*a)return null;if(this.weaponKey!=="knife"&&this.ammoInMag<=0)return t&&t.playDryFire(),this.lastFiredTime=e,this.reserveAmmo>0&&this.startReload(t,e),null;this.weaponKey!=="knife"&&this.ammoInMag--,this.lastFiredTime=e,this.muzzleFlash=this.weaponKey==="knife"?0:1;const r=this.weapon.recoil;return this.vx-=Math.cos(this.angle)*r*.15,this.vy-=Math.sin(this.angle)*r*.15,t&&t.playGunshot(this.weaponKey,i),this.isLocal&&!this.isBot&&this.updateHUD(),{playerId:this.id,x:this.x+Math.cos(this.angle)*22,y:this.y+Math.sin(this.angle)*22,angle:this.angle,weaponKey:this.weaponKey,damage:this.weapon.damage,bulletSpeed:this.weapon.bulletSpeed,range:this.weapon.range,recoil:r,pellets:this.weapon.pellets||1,accuracy:this.weapon.accuracy}}updateHUD(){const e=document.getElementById("hud-self-hp");e&&(e.style.width=`${Math.max(0,this.health)}%`);const t=document.getElementById("hud-self-hp-text");t&&(t.innerText=Math.round(Math.max(0,this.health)));const i=document.getElementById("hud-weapon-name");if(i&&this.weapon&&this.weapon.name){const l=this.weaponKey!=="knife"&&this.weaponKey!=="none"?` [LVL ${this.weaponLevel}]`:"";i.innerText=(this.weapon.name+l).toUpperCase()}const s=document.getElementById("hud-ammo-val");s&&(s.innerText=`${this.ammoInMag} / ${this.reserveAmmo}`);const a=document.getElementById("hud-flash-val");a&&(a.innerText=`FLASH [${this.flashGrenades!==void 0?this.flashGrenades:1}]`,this.flashGrenades<=0?(a.style.color="#ff3c3c",a.style.borderColor="rgba(255, 60, 60, 0.3)"):(a.style.color="#ffd700",a.style.borderColor="rgba(255, 215, 0, 0.3)"));const r=document.getElementById("hud-stashed-packs");r&&(r.innerHTML=`MEDKITS [${this.healthPacks||0}] &nbsp; AMMO PACKS [${this.ammoPacks||0}]`);const o=document.getElementById("hud-weapon-xp-wrapper");if(o)if(this.weaponKey!=="knife"&&this.weaponKey!=="none"){o.style.display="flex";const l=this.weaponLevel*100,c=this.weaponXP/l*100,h=document.getElementById("hud-weapon-xp");h&&(h.style.width=`${c}%`);const f=document.getElementById("hud-weapon-xp-text");f&&(f.innerText=`${this.weaponXP}/${l}`)}else o.style.display="none";for(let l=1;l<=3;l++){const c=document.getElementById(`inv-slot-${l}`);if(c){if(l===3)c.innerText=`[3] FLASH (${this.flashGrenades!==void 0?this.flashGrenades:1})`;else if(l===1){const h=this.primaryWeaponKey?this.primaryWeaponKey.toUpperCase():"PRIMARY";c.innerText=`[1] ${h}`}this.activeSlot===l?(c.style.background="rgba(102, 252, 241, 0.12)",c.style.borderColor="var(--neon-cyan)",c.style.color="#fff",c.style.boxShadow="0 0 8px rgba(102,252,241,0.2)"):(c.style.background="rgba(0, 0, 0, 0.4)",c.style.borderColor="rgba(255,255,255,0.08)",c.style.color="rgba(255,255,255,0.5)",c.style.boxShadow="none")}}}updateDashHUD(e){const i=document.getElementById("hud-dash-status"),s=document.getElementById("hud-dash-icon");if(i)if(!this.lastDashTime||e-this.lastDashTime>=1e4)i.innerText="DASH READY (SPACE)",i.style.color="var(--neon-cyan)",s&&(s.innerText="⚡",s.style.color="var(--neon-cyan)");else{const a=Math.ceil((1e4-(e-this.lastDashTime))/1e3);i.innerText=`DASH COOLDOWN: ${a}s`,i.style.color="#ff3c3c",s&&(s.innerText="⏳",s.style.color="#ff3c3c")}}takeDamage(e,t){if(!(this.health<=0)){if(this.health=Math.max(0,this.health-e),t&&t.playFleshHit(),this.isLocal&&!this.isBot){this.updateHUD();const i=document.getElementById("game-canvas");i&&(i.style.filter="drop-shadow(0 0 10px rgba(255, 0, 0, 0.4))",setTimeout(()=>i.style.filter="none",150))}if(this.isBot&&this.health>0){const i=Date.now();if((!this.lastDashTime||i-this.lastDashTime>3e3)&&Math.random()<.6){this.lastDashTime=i,this.networkJustDashed=!0;const a=this.angle+Math.PI/2*(Math.random()>.5?1:-1);if(this.vx=Math.cos(a)*20,this.vy=Math.sin(a)*20,t&&t.playFrictionalScrape)try{t.playFrictionalScrape(0,.4,.5)}catch{}}}}}checkPickups(e,t){this.health<=0||e.items.forEach(i=>{if(!i.active)return;if(Math.hypot(this.x-i.x,this.y-i.y)<this.radius+12){if(i.active=!1,i.type==="health"){if(this.health>=this.maxHealth)if(this.healthPacks<2)this.healthPacks++,t&&t.playPickup(),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+1 STASHED MEDKIT","#ff6ef7"));else{i.active=!0;return}else if(t&&t.playPickup(),this.health=Math.min(this.maxHealth,this.health+35),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+35 HEALTH"),window.AppSocket)){const r=window.gameEngine&&window.gameEngine.devCheatActive?Math.round(this.health/2):this.health;window.AppSocket.emit("sync-health",{playerId:this.id,health:r})}}else if(i.type==="ammo")if(this.reserveAmmo>=this.maxReserveAmmo)if(this.ammoPacks<2)this.ammoPacks++,t&&t.playPickup(),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+1 STASHED AMMO PACK","#ff6ef7"));else{i.active=!0;return}else{t&&t.playPickup();const a=this.weapon.magSize*2;this.reserveAmmo=Math.min(this.maxReserveAmmo,this.reserveAmmo+a),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+AMMO"))}else i.type==="adrenaline"?(t&&t.playPickup(),this.adrenalineEndTime=Date.now()+8e3,this.adrenalineActive=!0,this.isLocal&&!this.isBot&&this.showTextNotification("⚡ SPEED BOOST ACTIVE")):i.type==="overdrive"&&(this.overdriveEndTime=Date.now()+6e3,this.overdriveActive=!0,this.isLocal&&!this.isBot&&this.showTextNotification("🔥 OVERDRIVE CHARGED"));this.isLocal&&!this.isBot&&window.AppSocket&&window.AppSocket.emit("pickup-item",{itemId:i.id})}})}showTextNotification(e,t="#ffd700"){this.floatingText={text:e,timer:45,yOffset:-30,color:t}}handleBotAI(e,t,i,s,a,r,o={}){const l=o.navigation||null,c=o.blackboard||null,h=o.teammates||[],f=o.combatEnabled!==!1,d=!!(s&&s.health>0),u=d?Math.hypot(this.x-s.x,this.y-s.y):1/0,p=d&&!s.inVent&&u<760&&(l!=null&&l.hasClearPath?l.hasClearPath(this.x,this.y,s.x,s.y,1):this.checkLineOfSight(e,this.x,this.y,s.x,s.y));let g=(d?Math.atan2(s.y-this.y,s.x-this.x):this.angle)-this.angle;for(;g<-Math.PI;)g+=Math.PI*2;for(;g>Math.PI;)g-=Math.PI*2;const m=Math.abs(g)<=38*Math.PI/180,M=p&&(u<145||s.flashlightActive||this.flashlightActive&&m);M?(px(c,this,s,i),this.lastKnownPlayerPos={x:s.x,y:s.y},this.botLastSeenAt=i,(!this.botHadLOS||this.botAimTargetId!==String(s.id))&&(this.botAimTargetId=String(s.id),this.botAimReadyAt=i+105+Math.random()*120),this.botHadLOS=!0):i-this.botLastSeenAt>420&&(this.botHadLOS=!1);const _=d?ml(c,s.id,i):null;d&&i-s.lastFiredTime<520&&u<900&&!M&&(this.lastKnownPlayerPos={x:s.x,y:s.y},this.botState="search",this.setBotTarget(e,l,s.x,s.y,"gunshot",i));let y=!1;const E=typeof window<"u"?window.gameEngine:null;if((E==null?void 0:E.matchMode)==="sabotage"){const pe=(E.tasks||[]).filter(Re=>Re.alarmActive);if(pe.length&&!(M&&u<120)){const Re=pe.reduce((be,X)=>!be||Math.hypot(this.x-X.x,this.y-X.y)<Math.hypot(this.x-be.x,this.y-be.y)?X:be,null);Re&&this.setBotTarget(e,l,Re.x,Re.y,"alarm",i)&&(this.botState="search",y=!0)}}const A=i-this.botLastDecisionTime>230;if(!y&&A){this.botLastDecisionTime=i,i-this.botLastStrafeToggle>1100&&(this.botStrafeDir*=-1,this.botLastStrafeToggle=i),this.ammoInMag===0&&!this.isReloading&&this.reserveAmmo>0&&this.startReload(t,i);let pe=!1;const Re=M?s:_;if(Re&&(this.health<46||this.isReloading)&&(l!=null&&l.findCoverPoint)){const X=gx(c,i,this.id),J=l.findCoverPoint(this.x,this.y,Re.x,Re.y,{radius:this.radius,claimed:X});J&&this.setBotTarget(e,l,J.x,J.y,"cover",i)&&(yx(c,this.id,J,i),this.botState="cover",this.botCoverUntil=i+1250,pe=!0)}if(!pe&&this.health<38&&!M){const J=(e.items||[]).filter(Z=>Z.active&&Z.type==="health").sort((Z,Ee)=>Math.hypot(this.x-Z.x,this.y-Z.y)-Math.hypot(this.x-Ee.x,this.y-Ee.y)).find(Z=>!l||l.projectPoint(Z.x,Z.y,this.radius));J&&this.setBotTarget(e,l,J.x,J.y,"health",i)&&(this.botState="health",pe=!0)}if(!pe&&M){xx(c,this.id),this.botState="chase",f&&this.flashGrenades>0&&u>240&&u<500&&Math.random()<.035&&(this.throwFlashbangRequest=!0);const X=s.x-this.x,J=s.y-this.y,Z=u>1?1/u:0;let Ee,Pe;if(this.weaponKey==="sniper"&&u<430)Ee=this.x-X*Z*210,Pe=this.y-J*Z*210;else if(this.weaponKey==="shotgun")Ee=s.x-X*Z*62,Pe=s.y-J*Z*62;else{const Ie=this.botLaneSign||this.botStrafeDir||1,rt=145+(o.laneIndex||0)%2*40;Ee=s.x+-J*Z*rt*Ie,Pe=s.y+X*Z*rt*Ie}this.setBotTarget(e,l,Ee,Pe,"chase",i)}else if(!pe&&!M){const X=_||this.lastKnownPlayerPos;let J=Math.hypot(this.x-this.botTargetX,this.y-this.botTargetY);(this.botState==="cover"&&(i>=this.botCoverUntil||!this.isReloading&&this.health>=46)||this.botState==="health"&&(this.health>=55||J<42))&&(this.botState=X?"search":"patrol"),X&&(this.botState==="chase"||this.botState==="search"||_)&&(this.botState="search",this.setBotTarget(e,l,X.x,X.y,_?"shared-sighting":"search",i)),J=Math.hypot(this.x-this.botTargetX,this.y-this.botTargetY),(this.botState==="search"&&J<42||this.botState==="patrol"&&J<42||!Number.isFinite(this.botTargetX)||!Number.isFinite(this.botTargetY))&&(this.botState="patrol",this.choosePatrolPoint(e,l))}}let S=1/0;if(M){const pe=Tx(this,s,this.weapon.bulletSpeed||15,30),Re=Math.max(0,Math.min(1,(i-(this.botAimReadyAt-160))/420)),be=i*.006+String(this.id).length*1.7,X=Math.sin(be)*(.045-Re*.026),J=Math.atan2(pe.y-this.y,pe.x-this.x)+X;this.angle=_h(this.angle,J,.095*Math.max(.55,r));let Z=J-this.angle;for(;Z<-Math.PI;)Z+=Math.PI*2;for(;Z>Math.PI;)Z-=Math.PI*2;S=Math.abs(Z)}const w=this.validateBotTarget(e,l,this.botTargetX,this.botTargetY);w?(this.botTargetX=w.x,this.botTargetY=w.y):this.choosePatrolPoint(e,l);const P={x:this.botTargetX,y:this.botTargetY},C=(l==null?void 0:l.obstacleRevision)??null,I=this.botState==="chase"?620:1250,z=h.filter(pe=>pe&&pe!==this&&pe.health>0).map(pe=>({x:pe.x,y:pe.y,radius:pe.radius||18}));if(l&&bx(this.botRoute,P,i,{maxAge:I,targetTolerance:this.botState==="chase"?34:18,navRevision:C,stuck:(this.stuckDuration||0)>430})){const pe=l.findPath(this.x,this.y,P.x,P.y,{radius:this.radius,avoidPoints:z}),Re=pe!=null&&pe.length?pe:[{x:this.x,y:this.y}],be=Re.at(-1),X=!!be&&Math.hypot(be.x-P.x,be.y-P.y)<=this.radius+4;Sx(this.botRoute,Re,P,i,C,this.botTargetPurpose,X)}const N=l?Ex(this.botRoute,this.x,this.y,this.radius+7):P,L=(N==null?void 0:N.x)??P.x,U=(N==null?void 0:N.y)??P.y,B=Math.hypot(this.x-L,this.y-U),Y=Mx(this.botRoute,this.x,this.y,i,this.radius+8);if(B>28){if(!this.lastStuckCheckTime)this.lastStuckCheckTime=i,this.lastStuckPosX=this.x,this.lastStuckPosY=this.y,this.stuckDuration=0;else if(i-this.lastStuckCheckTime>300){const pe=Math.hypot(this.x-this.lastStuckPosX,this.y-this.lastStuckPosY);this.stuckDuration=pe<10?(this.stuckDuration||0)+i-this.lastStuckCheckTime:0,this.lastStuckCheckTime=i,this.lastStuckPosX=this.x,this.lastStuckPosY=this.y,this.stuckDuration>430&&no(this.botRoute)}}else this.stuckDuration=0;Y.atEndpoint&&Y.blockedFor>350&&no(this.botRoute);const Q=Math.max(this.stuckDuration||0,Y.blockedFor);if(Q>650){const pe=Y.incomplete?Math.atan2(P.y-this.y,P.x-this.x):Math.atan2(U-this.y,L-this.x),Re=this.x+Math.cos(pe)*45,be=this.y+Math.sin(pe)*45,X=(e.walls||[]).find(J=>J.type==="crate"&&Re>=J.x&&Re<=J.x+J.w&&be>=J.y&&be<=J.y+J.h);if(f&&X){if(this.angle=Math.atan2(X.y+X.h/2-this.y,X.x+X.w/2-this.x),this.ammoInMag===0&&!this.isReloading&&this.reserveAmmo>0)this.startReload(t,i);else if(!this.isReloading&&this.ammoInMag>0&&i-this.lastFiredTime>=(this.weapon.fireRate||300)){const J=this.shoot(i,t,50);J&&typeof window<"u"&&window.OnBotShootCallback&&window.OnBotShootCallback(J)}}else Q>1800&&this.botTargetPurpose!=="alarm"&&(this.botState="patrol",this.choosePatrolPoint(e,l),this.stuckDuration=0)}const ne=E==null?void 0:E.isRanked,de=this.accel*(ne?1.25:1)*(this.adrenalineActive?1.35:1);if(B>10){const pe=Math.atan2(U-this.y,L-this.x);M||(this.angle=_h(this.angle,pe,.14*Math.max(.7,r))),this.vx+=Math.cos(pe)*de*r,this.vy+=Math.sin(pe)*de*r}const xe=wx(this,h);if(this.vx+=xe.x*de*1.15*r,this.vy+=xe.y*de*1.15*r,f&&M&&i>=this.botAimReadyAt&&S<.105&&!this.isReloading&&this.ammoInMag>0&&u<=(this.weapon.range||400)*1.08){const pe=this.weapon.fireRate||300;if(i-this.lastFiredTime>=pe){const Re=this.shoot(i,t,u);Re&&typeof window<"u"&&window.OnBotShootCallback&&window.OnBotShootCallback(Re)}}}checkLineOfSight(e,t,i,s,a){return!e.getLineIntersection({x:t,y:i},{x:s,y:a})}validateBotTarget(e,t,i,s){var o,l;if(!Number.isFinite(i)||!Number.isFinite(s))return null;if((o=t==null?void 0:t.isPointClear)!=null&&o.call(t,i,s,this.radius))return{x:i,y:s};const a=(l=t==null?void 0:t.projectPoint)==null?void 0:l.call(t,i,s,this.radius);if(a&&Number.isFinite(a.x)&&Number.isFinite(a.y))return a;if(!(e!=null&&e.checkCircleCollision))return null;const r=e.checkCircleCollision(i,s,this.radius);return Number.isFinite(r==null?void 0:r.x)&&Number.isFinite(r==null?void 0:r.y)?r:null}setBotTarget(e,t,i,s,a="move",r=0,o=!1){const l=this.validateBotTarget(e,t,i,s);if(!l)return!1;const c=Math.hypot(l.x-this.botTargetX,l.y-this.botTargetY)>12||this.botTargetPurpose!==a;return this.botTargetX=l.x,this.botTargetY=l.y,this.botTargetPurpose=a,(c||o)&&no(this.botRoute),!0}resetBotRound(e,t){return this.botRoute=vh(),this.botState="patrol",this.botTargetPurpose="patrol",this.botAimReadyAt=0,this.botAimTargetId=null,this.botHadLOS=!1,this.botLastSeenAt=-1/0,this.botCoverUntil=0,this.lastKnownPlayerPos=null,this.lastStuckCheckTime=0,this.stuckDuration=0,this.choosePatrolPoint(e,t)}choosePatrolPoint(e,t=null,i=Math.random){var r;const s=(r=t==null?void 0:t.choosePatrolPoint)==null?void 0:r.call(t,this.x,this.y,i);if(s&&this.setBotTarget(e,t,s.x,s.y,"patrol",0,!0))return s;const a=(e==null?void 0:e.rooms)||[];for(let o=0;o<30;o++){const l=a.length?a[Math.floor(i()*a.length)]:{x:60,y:60,w:Math.max(1,((e==null?void 0:e.width)||200)-120),h:Math.max(1,((e==null?void 0:e.height)||200)-120)},c=42,h=l.x+c+i()*Math.max(1,l.w-c*2),f=l.y+c+i()*Math.max(1,l.h-c*2),d=this.validateBotTarget(e,t,h,f);if(d&&this.setBotTarget(e,t,d.x,d.y,"patrol",0,!0))return d}return this.setBotTarget(e,t,this.x,this.y,"patrol",0,!0)?{x:this.botTargetX,y:this.botTargetY}:null}draw(e,t={laser:!0},i=null){var u,p;if(this.inVent)return;if(this.health<=0){e.save(),e.fillStyle="rgba(180, 0, 0, 0.35)",e.beginPath(),e.ellipse(this.x,this.y,this.radius+8,this.radius+4,0,0,Math.PI*2),e.fill(),yn.ready&&(e.save(),e.translate(this.x,this.y),e.rotate(this.angle+Math.PI/2),e.globalAlpha=.55,yn.draw(e,this.id+"_dead",0,0,0,0,!1,this.isLocal?"blue":"red"),e.restore()),e.restore();return}if(e.save(),this.health>0&&this.muzzleFlash>.15){e.save();const v=130*this.muzzleFlash,g=e.createRadialGradient(this.x,this.y,10,this.x,this.y,v);g.addColorStop(0,"rgba(255, 160, 40, 0.28)"),g.addColorStop(.5,"rgba(255, 100, 20, 0.10)"),g.addColorStop(1,"rgba(255, 50, 0, 0.0)"),e.fillStyle=g,e.beginPath(),e.arc(this.x,this.y,v,0,Math.PI*2),e.fill(),e.restore()}const s=window.gameEngine&&window.gameEngine.matchMode==="sabotage";if(t.laser&&this.isLocal&&!this.isReloading&&!s){const v=this.weapon&&this.weapon.range?this.weapon.range:1200;let g=this.x+Math.cos(this.angle)*v,m=this.y+Math.sin(this.angle)*v;if(i){const x=i.getLineIntersection({x:this.x,y:this.y},{x:g,y:m});x&&(g=x.x,m=x.y)}e.save(),e.strokeStyle=this.isLocal?"rgba(102, 252, 241, 0.5)":"rgba(255, 60, 60, 0.5)",e.lineWidth=1.2,e.beginPath(),e.moveTo(this.x,this.y),e.lineTo(g,m),e.stroke();const M=this.isLocal?"#66fcf1":"#ff3c3c",_=e.createRadialGradient(g,m,1,g,m,6);_.addColorStop(0,"#ffffff"),_.addColorStop(.3,M),_.addColorStop(1,"rgba(0, 0, 0, 0)"),e.fillStyle=_,e.beginPath(),e.arc(g,m,6,0,Math.PI*2),e.fill(),e.restore()}e.restore();const a=performance.now();this.dashTrails&&this.dashTrails.length>0&&this.dashTrails.forEach(v=>{const g=a-v.time,m=Math.max(0,.35*(1-g/180));if(m<=0)return;if(e.save(),e.globalAlpha=m,!yn.draw(e,this.id+"_trail",v.x,v.y,v.angle,0,!1)){e.save(),e.translate(v.x,v.y),e.rotate(v.angle);const _=cs[this.colorTheme]||cs[this.isLocal?"cyan":"red"];e.fillStyle=_.helmet||"#66fcf1",e.beginPath(),e.arc(0,0,this.radius,0,Math.PI*2),e.fill(),e.restore()}e.restore()});const r=Date.now(),o=this.adrenalineEndTime&&r<this.adrenalineEndTime||this.adrenalineActive,l=this.overdriveEndTime&&r<this.overdriveEndTime||this.overdriveActive;if(o||l){e.save(),e.shadowBlur=15,e.lineWidth=3,e.shadowColor=l?"#ffd700":"#39db14",e.strokeStyle=l?"rgba(255, 215, 0, 0.4)":"rgba(57, 219, 20, 0.4)";const v=this.radius+2+Math.sin(r/150)*2;e.beginPath(),e.arc(this.x,this.y,v,0,Math.PI*2),e.stroke(),e.restore()}const c=this.muzzleFlash>.1;if(!yn.draw(e,this.id,this.x,this.y,this.angle,this.currentSpeed||0,c,this.isLocal?"blue":"red")){e.save(),e.translate(this.x,this.y),e.rotate(this.angle);const v=cs[this.colorTheme]||cs[this.isLocal?"cyan":"red"],g=v.body,m=v.armor,M=v.helmet;let _=18,x=4;this.weaponKey==="rifle"&&(_=24,x=5),this.weaponKey==="shotgun"&&(_=22,x=6),this.weaponKey==="sniper"&&(_=32,x=4,e.fillStyle="#444",e.fillRect(8,-5,6,3)),this.weaponKey==="smg"&&(_=16,x=4),this.weaponKey==="lmg"&&(_=26,x=7,e.fillStyle="#222",e.fillRect(6,-8,6,16)),this.weaponKey==="dmr"&&(_=28,x=5,e.fillRect(10,-4,5,2)),this.weaponKey==="vector"&&(_=14,x=4,e.fillStyle="#333",e.fillRect(4,-6,5,12)),this.weaponKey==="famas"&&(_=20,x=5,e.fillStyle="#555",e.fillRect(6,-3,8,6)),this.weaponKey==="plasma"&&(e.fillStyle="#9b1fe8",_=20,x=5),this.weaponKey==="railgun"&&(e.fillStyle="#0d8a8a",_=30,x=6,e.fillStyle="#066",e.fillRect(6,-7,8,14)),e.fillStyle="#444",e.strokeStyle="#000",e.lineWidth=1,e.fillRect(10,-x/2,_,x),e.strokeRect(10,-x/2,_,x),e.fillStyle=m,e.strokeStyle="#000",e.lineWidth=1.5,e.beginPath(),e.arc(8,-10,5,0,Math.PI*2),e.fill(),e.stroke(),e.beginPath(),e.arc(14,6,5,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle=g,e.beginPath(),e.ellipse(0,0,this.radius,this.radius+3,0,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle=m,e.beginPath(),e.ellipse(-3,0,this.radius-4,this.radius-2,0,0,Math.PI*2),e.fill(),e.fillStyle=M,e.beginPath(),e.arc(-2,0,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#111",e.fillRect(1,-5,3,10),e.restore()}if(this.weaponKey!=="none"){e.save(),e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle=this.weaponKey==="knife"?"#b0b8c0":"#333",e.strokeStyle="rgba(0,0,0,0.7)",e.lineWidth=1;let v=18,g=3;if(this.weaponKey==="rifle"&&(v=26,g=4),this.weaponKey==="shotgun"&&(v=22,g=5),this.weaponKey==="sniper"&&(v=36,g=3),this.weaponKey==="smg"&&(v=16,g=3),this.weaponKey==="lmg"&&(v=28,g=5),this.weaponKey==="dmr"&&(v=30,g=4),this.weaponKey==="knife"&&(v=10,g=2),this.weaponKey==="vector"&&(v=14,g=3,e.fillStyle="#2a2a2a",e.fillRect(4,-5,4,10)),this.weaponKey==="famas"&&(v=20,g=4,e.fillStyle="#444",e.fillRect(5,-4,7,8)),this.weaponKey==="plasma"&&(e.fillStyle="#9b1fe8",v=20,g=5,e.fillStyle="#c455ff",e.fillRect(6,-4,6,8)),this.weaponKey==="railgun"&&(e.fillStyle="#0d8a8a",v=30,g=6,e.fillStyle="#0af",e.fillRect(4,-6,8,12)),e.fillRect(12,-g/2,v,g),e.strokeRect(12,-g/2,v,g),this.muzzleFlash>0){e.save(),e.translate(12+v,0);const m=e.createRadialGradient(0,0,2,0,0,16);m.addColorStop(0,"rgba(255, 255, 255, 1.0)"),m.addColorStop(.3,"rgba(255, 220, 0, 0.9)"),m.addColorStop(.7,"rgba(255, 80, 0, 0.5)"),m.addColorStop(1,"rgba(255, 0, 0, 0.0)"),e.fillStyle=m,e.beginPath(),e.arc(0,0,16,0,Math.PI*2),e.fill(),e.restore()}e.restore()}e.save(),e.textAlign="center";const f=this.isLocal?((u=cs[this.colorTheme])==null?void 0:u.helmet)||"#66fcf1":this.isTeammate?"#39db14":"#ff3c3c";if(this.rank){const v=this.y-this.radius-28,g=`${this.rank.icon} ${this.rank.label}`;e.font="bold 8px Orbitron";const M=e.measureText(g).width+10,_=12;e.fillStyle="rgba(0,0,0,0.65)",e.beginPath(),e.roundRect(this.x-M/2,v-_/2,M,_,3),e.fill(),e.strokeStyle=this.rank.color,e.lineWidth=1,e.stroke(),e.fillStyle=this.rank.color,e.fillText(g,this.x,v+4)}e.fillStyle=f,e.font="10px Orbitron",e.fillText(this.name.toUpperCase(),this.x,this.y-this.radius-12);const d=window.gameEngine&&window.gameEngine.matchMode==="sabotage";if(this.health>0&&!d){e.fillStyle="rgba(0,0,0,0.5)",e.fillRect(this.x-20,this.y-this.radius-8,40,4);const v=this.isLocal?((p=cs[this.colorTheme])==null?void 0:p.helmet)||"#66fcf1":this.isTeammate?"#39db14":"#ff3c3c";e.fillStyle=v,e.fillRect(this.x-20,this.y-this.radius-8,40*(this.health/this.maxHealth),4)}this.floatingText&&this.floatingText.timer>0&&(e.font="bold 9px Orbitron",e.fillStyle=this.floatingText.color||"#ffd700",e.shadowColor="#000000",e.shadowBlur=4,e.fillText(this.floatingText.text,this.x,this.y+this.floatingText.yOffset),this.floatingText.yOffset-=.4,this.floatingText.timer--),e.restore()}updateBuffsHUD(e){if(!this.isLocal||this.isBot)return;const t=document.getElementById("hud-active-buffs");if(!t)return;let i="";if(this.adrenalineActive){const s=Math.max(0,(this.adrenalineEndTime-e)/1e3).toFixed(1);i+=`<div style="font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; background: rgba(57, 219, 20, 0.15); border: 1px solid rgba(57, 219, 20, 0.4); color: #39db14; padding: 4px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 8px rgba(57, 219, 20, 0.2);">⚡ SPEED: ${s}s</div>`}if(this.overdriveActive){const s=Math.max(0,(this.overdriveEndTime-e)/1e3).toFixed(1);i+=`<div style="font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; background: rgba(255, 215, 0, 0.15); border: 1px solid rgba(255, 215, 0, 0.4); color: #ffd700; padding: 4px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);">🔥 OVERDRIVE: ${s}s</div>`}t.innerHTML=i}}class Ia{constructor(e){this.id=`${e.playerId}_bullet_${Date.now()}_${Math.floor(Math.random()*1e3)}`,this.playerId=e.playerId,this.x=e.x,this.y=e.y,this.prevX=e.x,this.prevY=e.y,this.angle=e.angle,this.speed=e.bulletSpeed,this.damage=e.damage,this.rangeRemaining=e.range,this.weaponKey=e.weaponKey;const s=(1-(window.gameEngine&&window.gameEngine.devCheatActive&&e.playerId===window.LocalPlayerId?1:e.accuracy))*(Math.random()-.5)*.5,a=this.angle+s;this.vx=Math.cos(a)*this.speed,this.vy=Math.sin(a)*this.speed,this.active=!0}update(e,t,i,s,a=1){if(!this.active)return;if(this.prevX=this.x,this.prevY=this.y,this.x+=this.vx*a,this.y+=this.vy*a,this.rangeRemaining-=this.speed*a,this.rangeRemaining<=0){this.active=!1;return}const r={x:this.prevX,y:this.prevY},o={x:this.x,y:this.y},l=e.getLineIntersection(r,o);if(l){if(this.x=l.x,this.y=l.y,this.active=!1,l.wall&&l.wall.type==="crate"){const c=l.wall.id,h=e.damageCrate(c,this.damage);h&&(h.broken?(s&&s.playCrateBreak(),i.spawnCrateSplinters(h.crateX,h.crateY),this.playerId===window.LocalPlayerId&&window.AppSocket&&window.AppSocket.emit("break-crate",{crateId:c,spawnedItem:h.item})):s&&s.playFleshHit())}i.spawnWallImpact(this.x,this.y,this.angle);return}for(const c of t){if(c.id===this.playerId||c.health<=0)continue;const h=t.find(d=>d.id===this.playerId);if(h&&h.team===c.team)continue;const f=this.getSegmentCircleIntersection(r,o,c);if(f){this.x=f.x,this.y=f.y,this.active=!1,i.spawnBloodSplatter(this.x,this.y,this.angle);const d=this.x-c.x,u=this.y-c.y,v=d*d+u*u<=36,g=v?1.5:1;if(window.IsOfflineMode){const m=e.checkZone?e.checkZone(this.x,this.y):null,M=m&&m.type==="damage"?m.multiplier:1,_=Math.round(this.damage*M*g),x=c.health>0;c.takeDamage(_,s);const y=x&&c.health<=0;if(this.playerId===window.LocalPlayerId){const E=t.find(A=>A.id===this.playerId);E&&E.addWeaponXP&&(y?(E.addWeaponXP(50),E.showTextNotification("+50 XP","#ffd700"),window.gameEngine&&window.gameEngine.registerLocalPlayerKill&&window.gameEngine.registerLocalPlayerKill(performance.now())):(E.addWeaponXP(10),E.showTextNotification("+10 XP","#ff6ef7"))),s&&(v?s.playCriticalHitMarker():s.playHitMarker()),v&&c.showTextNotification?c.showTextNotification("CRITICAL HEADSHOT!"):M>1&&c.showTextNotification&&c.showTextNotification(`×${M} ZONE!`),window.gameEngine&&window.gameEngine.triggerHitmarker(this.x,this.y,_,v),window.MatchStats&&(window.MatchStats.damageDealt+=_)}}else if(this.playerId===window.LocalPlayerId){const m=e.checkZone?e.checkZone(this.x,this.y):null,M=m&&m.type==="damage"?m.multiplier:1,_=Math.round(this.damage*M*g),x=c.health-_<=0,y=t.find(E=>E.id===this.playerId);y&&y.addWeaponXP&&(x?(y.addWeaponXP(50),y.showTextNotification("+50 XP","#ffd700"),window.gameEngine&&window.gameEngine.registerLocalPlayerKill&&window.gameEngine.registerLocalPlayerKill(performance.now())):(y.addWeaponXP(10),y.showTextNotification("+10 XP","#ff6ef7"))),s&&(v?s.playCriticalHitMarker():s.playHitMarker()),v&&c.showTextNotification?c.showTextNotification("CRITICAL HEADSHOT!"):M>1&&c.showTextNotification&&c.showTextNotification(`×${M} ZONE!`),window.gameEngine&&window.gameEngine.triggerHitmarker(this.x,this.y,_,v),window.MatchStats&&(window.MatchStats.damageDealt+=_),window.AppSocket&&window.AppSocket.emit("hit",{damage:_,shooterId:this.playerId,targetId:c.id,x:this.x,y:this.y,isHeadshot:v})}return}}}getSegmentCircleIntersection(e,t,i){const s=t.x-e.x,a=t.y-e.y,r=i.x-e.x,o=i.y-e.y,l=s*s+a*a;if(l===0)return null;let c=(r*s+o*a)/l;c=Math.max(0,Math.min(1,c));const h=e.x+c*s,f=e.y+c*a,d=i.x-h,u=i.y-f;return d*d+u*u<=i.radius*i.radius?{x:h,y:f}:null}draw(e){if(!this.active)return;const t=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode;if(this.weaponKey==="knife"){e.save(),e.lineWidth=3.5,e.lineCap="round",e.strokeStyle="rgba(230, 235, 255, 0.85)",t||(e.shadowColor="#66fcf1",e.shadowBlur=6),e.beginPath(),e.arc(this.x,this.y,18,this.angle-.6,this.angle+.6),e.stroke(),e.restore();return}if(this.weaponKey==="plasma"){e.save(),t||(e.shadowColor="#ff6ef7",e.shadowBlur=18);const a=e.createRadialGradient(this.x,this.y,1,this.x,this.y,7);a.addColorStop(0,"rgba(255, 200, 255, 1.0)"),a.addColorStop(.4,"rgba(230, 80, 255, 0.9)"),a.addColorStop(1,"rgba(120, 0, 180, 0.0)"),e.fillStyle=a,e.beginPath(),e.arc(this.x,this.y,7,0,Math.PI*2),e.fill(),e.restore();return}if(this.weaponKey==="railgun"){e.save(),t||(e.shadowColor="#66fcf1",e.shadowBlur=20),e.lineWidth=5,e.lineCap="round";const a=e.createLinearGradient(this.prevX,this.prevY,this.x,this.y);a.addColorStop(0,"rgba(102, 252, 241, 0.0)"),a.addColorStop(.3,"rgba(102, 252, 241, 0.7)"),a.addColorStop(1,"rgba(255, 255, 255, 1.0)"),e.strokeStyle=a,e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.lineWidth=2,e.strokeStyle="rgba(255,255,255,0.9)",e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.restore();return}e.save(),e.lineWidth=2.5,e.lineCap="round";const i=this.playerId===window.LocalPlayerId,s=e.createLinearGradient(this.prevX,this.prevY,this.x,this.y);i?(s.addColorStop(0,"rgba(102, 252, 241, 0.0)"),s.addColorStop(1,"rgba(102, 252, 241, 1.0)"),e.strokeStyle=s,t||(e.shadowColor="#66fcf1")):(s.addColorStop(0,"rgba(255, 60, 60, 0.0)"),s.addColorStop(1,"rgba(255, 60, 60, 1.0)"),e.strokeStyle=s,t||(e.shadowColor="#ff3c3c")),t||(e.shadowBlur=4),e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.restore()}}class so{constructor(e){this.seed=e}next(){const e=Math.sin(this.seed++)*1e4;return e-Math.floor(e)}range(e,t){return e+this.next()*(t-e)}}function bh(n,e){let t=2166136261;const i=`${String(n)}:${e}`;for(let s=0;s<i.length;s++)t^=i.charCodeAt(s),t=Math.imul(t,16777619);return t>>>0||1}let Rx=class{constructor(e,t,i,s="manor"){this.width=e,this.height=t,this.seed=i,this.roundIndex=-1,this.navigationRevision=0,this.gameplayRng=new so(bh(i,"gameplay")),this.rng=this.gameplayRng,this.mapId=s,this.walls=[],this.items=[],this.zones=[],this.rooms=[],this.decorations=[],this.segments=[],this.ambientLights={},this.generateMap()}generateMap(e=null){const t=Number.isInteger(e)&&e>=0?e:this.roundIndex+1;this.roundIndex=t;const i=t===0?this.seed:bh(this.seed,`layout:${t}`);this.rng=new so(i);try{this.walls=[],this.items=[],this.zones=[],this.rooms=[],this.decorations=[],this.mapId==="cyberlab"?this.generateCyberLabMap():this.mapId==="arena"?this.generateArenaMap():this.generateManorMap(),this.initTerminals(),this.rebuildSegments()}finally{this.rng=this.gameplayRng}}generateManorMap(){const r=this.width-40,o=this.height-40,l=480,c=960,h=460,f=920,d=l-40,u=c-l-22,p=r-c-22,v=h-40,g=f-h-22,m=o-f-22,M=[{x:40,y:40,w:d,h:v,name:"Kitchen",floor:"tiles"},{x:l+22,y:40,w:u,h:v,name:"Living Room",floor:"carpet"},{x:c+22,y:40,w:p,h:v,name:"Office",floor:"wood"},{x:40,y:h+22,w:d,h:g,name:"Bathroom",floor:"tiles"},{x:l+22,y:h+22,w:u,h:g,name:"Hallway",floor:"concrete"},{x:c+22,y:h+22,w:p,h:g,name:"Bedroom 1",floor:"carpet"},{x:40,y:f+22,w:d,h:m,name:"Garage",floor:"concrete"},{x:l+22,y:f+22,w:u,h:m,name:"Master Bedroom",floor:"carpet"},{x:c+22,y:f+22,w:p,h:m,name:"Bedroom 2",floor:"wood"}];this.rooms=M,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(l,40,22,v,"v",Math.round(v*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l,h+22,22,g,"v",Math.round(g*.35-88/2),88,"wall","interior"),this._addWallWithDoorway(l,f+22,22,m,"v",Math.round(m*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,40,22,v,"v",Math.round(v*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,h+22,22,g,"v",Math.round(g*.65-88/2),88,"wall","interior"),this._addWallWithDoorway(c,f+22,22,m,"v",Math.round(m*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,h,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,h,u,22,"h",Math.round(u*.35-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,h,p,22,"h",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,f,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,f,u,22,"h",Math.round(u*.65-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,f,p,22,"h",Math.round(p*.5-88/2),88,"wall","interior"),this._addFurniture(M),this._addDecorations(M);{const x=M[3];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.06,label:"MEDIC STATION"})}{const x=M[5];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.025,label:"REST ZONE"})}{const x=M[7];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.04,label:"RECOVERY ZONE"})}{const x=M[6];this.zones.push({x:x.x+60,y:x.y+60,w:x.w-120,h:x.h-120,type:"damage",multiplier:1.75,label:"EXPLOSIVE ZONE"})}{const x=M[1];this.zones.push({x:x.x+x.w/4,y:x.y+x.h/4,w:x.w/2,h:x.h/2,type:"damage",multiplier:1.4,label:"EXPOSED AREA"})}const _=["health","ammo","adrenaline","ammo","overdrive"];this._spawnRandomConsumables(_,"pickup"),this._spawnCrates(),this.ambientLights={brokenCeiling:{x:731,y:701,radius:240,on:!0,innerRadius:20,color:"rgba(200, 230, 255, 0.25)",colorMid:"rgba(200, 230, 255, 0.08)",pulseType:"none",fixtureType:"brokenCeiling"},lantern:{x:1171,y:250,radius:180,on:!0,innerRadius:5,color:"rgba(255, 140, 40, 0.22)",colorMid:"rgba(255, 140, 40, 0.10)",pulseType:"lantern",fixtureType:"lantern"},kitchen:{x:260,y:250,radius:200,on:!0,innerRadius:10,color:"rgba(102, 252, 241, 0.20)",colorMid:"rgba(102, 252, 241, 0.08)",pulseType:"none",fixtureType:"kitchen"},garage:{x:260,y:1150,radius:220,on:!0,innerRadius:10,color:"rgba(255, 60, 60, 0.22)",colorMid:"rgba(255, 60, 60, 0.09)",pulseType:"garage",fixtureType:"garage"},bedroom2:{x:1171,y:1150,radius:190,on:!0,innerRadius:10,color:"rgba(255, 110, 247, 0.20)",colorMid:"rgba(255, 110, 247, 0.08)",pulseType:"none",fixtureType:"bedroom2"}}}generateCyberLabMap(){const r=this.width-40,o=this.height-40,l=450,c=950,h=450,f=950,d=l-40,u=c-l-22,p=r-c-22,v=h-40,g=f-h-22,m=o-f-22,M=[{x:40,y:40,w:d,h:v,name:"Cyber Lounge",floor:"cybercarpet"},{x:l+22,y:40,w:u,h:v,name:"Quantum Lab",floor:"cybergrid"},{x:c+22,y:40,w:p,h:v,name:"Security Hub",floor:"nanogrid"},{x:40,y:h+22,w:d,h:g,name:"Server Room",floor:"cybergrid"},{x:l+22,y:h+22,w:u,h:g,name:"AI Core",floor:"cybergrid"},{x:c+22,y:h+22,w:p,h:g,name:"Cryo Chambers",floor:"nanogrid"},{x:40,y:f+22,w:d,h:m,name:"Weaponry Depot",floor:"concrete"},{x:l+22,y:f+22,w:u,h:m,name:"Reactor Matrix",floor:"reactor"},{x:c+22,y:f+22,w:p,h:m,name:"Matrix Hall",floor:"cybercarpet"}];this.rooms=M,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(l,40,22,v,"v",Math.round(v*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l,h+22,22,g,"v",Math.round(g*.45-88/2),88,"wall","interior"),this._addWallWithDoorway(l,f+22,22,m,"v",Math.round(m*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,40,22,v,"v",Math.round(v*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,h+22,22,g,"v",Math.round(g*.55-88/2),88,"wall","interior"),this._addWallWithDoorway(c,f+22,22,m,"v",Math.round(m*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,h,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,h,u,22,"h",Math.round(u*.45-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,h,p,22,"h",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,f,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,f,u,22,"h",Math.round(u*.55-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,f,p,22,"h",Math.round(p*.5-88/2),88,"wall","interior"),this._addCyberLabFurniture(M);{const x=M[1];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.05,label:"QUANTUM STABILIZER"})}{const x=M[5];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.035,label:"CRYO RECOVERY"})}{const x=M[7];this.zones.push({x:x.x+50,y:x.y+50,w:x.w-100,h:x.h-100,type:"damage",multiplier:2,label:"REACTOR ENERGY CORE"})}const _=["health","ammo","health","adrenaline","health","ammo","overdrive"];this._spawnRandomConsumables(_,"pickup_cyber"),this._spawnCrates(),this.ambientLights={aiCore:{x:700,y:700,radius:260,on:!0,innerRadius:20,color:"rgba(102, 252, 241, 0.28)",colorMid:"rgba(102, 252, 241, 0.12)",pulseType:"quantum",fixtureType:"reactor_light"},quantumLab:{x:700,y:250,radius:220,on:!0,innerRadius:10,color:"rgba(157, 59, 255, 0.26)",colorMid:"rgba(157, 59, 255, 0.10)",pulseType:"none",fixtureType:"quantum"},reactor:{x:700,y:1150,radius:240,on:!0,innerRadius:15,color:"rgba(255, 127, 59, 0.28)",colorMid:"rgba(255, 127, 59, 0.12)",pulseType:"garage",fixtureType:"reactor_light"},serverRoom:{x:250,y:700,radius:220,on:!0,innerRadius:10,color:"rgba(57, 219, 20, 0.24)",colorMid:"rgba(57, 219, 20, 0.09)",pulseType:"none",fixtureType:"server_rack_light"},cryo:{x:1150,y:700,radius:220,on:!0,innerRadius:10,color:"rgba(102, 252, 241, 0.24)",colorMid:"rgba(102, 252, 241, 0.09)",pulseType:"none",fixtureType:"cryo_light"}}}generateArenaMap(){const r=this.width-40,o=this.height-40,l=240,c=300,h=240,f=240,d=300,u=240,p=40+l,v=p+20+c,g=40+f,m=g+20+d,M=[{x:40,y:40,w:l,h:f,name:"Alpha Spawn",floor:"concrete"},{x:p+20,y:40,w:c,h:f,name:"North Gallery",floor:"wood"},{x:v+20,y:40,w:h,h:f,name:"Omega Spawn",floor:"concrete"},{x:40,y:g+20,w:l,h:d,name:"West Corridor",floor:"tiles"},{x:p+20,y:g+20,w:c,h:d,name:"Central Core",floor:"tiles"},{x:v+20,y:g+20,w:h,h:d,name:"East Corridor",floor:"tiles"},{x:40,y:m+20,w:l,h:u,name:"Supply Vault",floor:"carpet"},{x:p+20,y:m+20,w:c,h:u,name:"South Gallery",floor:"wood"},{x:v+20,y:m+20,w:h,h:u,name:"Server Annex",floor:"carpet"}];this.rooms=M,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(p,40,20,f,"v",Math.round(f*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(p,g+20,20,d,"v",Math.round(d*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(p,m+20,20,u,"v",Math.round(u*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v,40,20,f,"v",Math.round(f*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v,g+20,20,d,"v",Math.round(d*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v,m+20,20,u,"v",Math.round(u*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(40,g,l,20,"h",Math.round(l*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(p+20,g,c,20,"h",Math.round(c*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v+20,g,h,20,"h",Math.round(h*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(40,m,l,20,"h",Math.round(l*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(p+20,m,c,20,"h",Math.round(c*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v+20,m,h,20,"h",Math.round(h*.5-80/2),80,"wall","interior");const _=M[4],x=E=>this._push({...E,type:"wall",material:"furniture"});x({x:_.x+40,y:_.y+40,w:40,h:40,label:"column"}),x({x:_.x+_.w-80,y:_.y+40,w:40,h:40,label:"column"}),x({x:_.x+40,y:_.y+_.h-80,w:40,h:40,label:"column"}),x({x:_.x+_.w-80,y:_.y+_.h-80,w:40,h:40,label:"column"}),this.zones.push({x:_.x+90,y:_.y+90,w:_.w-180,h:_.h-180,type:"healing",healRate:.05,label:"NANO MEDIC STATION"});const y=["health","ammo","adrenaline","overdrive"];this._spawnRandomConsumables(y,"pickup_arena"),this._spawnCrates(),this.ambientLights={centerSiren:{x:450,y:450,radius:180,on:!0,innerRadius:15,color:"rgba(102, 252, 241, 0.25)",colorMid:"rgba(102, 252, 241, 0.09)",pulseType:"quantum",fixtureType:"reactor_light"},alphaLight:{x:150,y:150,radius:150,on:!0,innerRadius:10,color:"rgba(255, 110, 247, 0.20)",colorMid:"rgba(255, 110, 247, 0.08)",pulseType:"none",fixtureType:"quantum"},omegaLight:{x:750,y:750,radius:150,on:!0,innerRadius:10,color:"rgba(255, 127, 59, 0.20)",colorMid:"rgba(255, 127, 59, 0.08)",pulseType:"none",fixtureType:"quantum"}}}_addCyberLabFurniture(e){const t=d=>this._push({...d,type:"wall",material:"furniture"}),i=e[0];t({x:i.x+50,y:i.y+50,w:90,h:32,label:"cyber_couch"}),t({x:i.x+50,y:i.y+120,w:90,h:32,label:"cyber_couch"}),t({x:i.x+i.w-82,y:i.y+50,w:32,h:100,label:"cyber_couch"}),t({x:i.x+i.w-150,y:i.y+80,w:45,h:45,label:"table"}),t({x:i.x+20,y:i.y+i.h-60,w:24,h:24,label:"plant"}),t({x:i.x+i.w-50,y:i.y+i.h-60,w:24,h:24,label:"plant"});const s=e[1];t({x:s.x+30,y:s.y+30,w:35,h:35,label:"containment_pod"}),t({x:s.x+s.w-65,y:s.y+30,w:35,h:35,label:"containment_pod"}),t({x:s.x+s.w/2-40,y:s.y+s.h-40,w:80,h:28,label:"cyber_console"}),t({x:s.x+30,y:s.y+s.h-100,w:35,h:35,label:"nano_charger"});const a=e[2];t({x:a.x+20,y:a.y+20,w:25,h:180,label:"shelf"}),t({x:a.x+70,y:a.y+60,w:100,h:40,label:"desk"}),t({x:a.x+105,y:a.y+110,w:30,h:30,label:"chair"});const r=e[3];t({x:r.x+40,y:r.y+30,w:24,h:100,label:"server_rack"}),t({x:r.x+110,y:r.y+30,w:24,h:100,label:"server_rack"}),t({x:r.x+40,y:r.y+190,w:24,h:100,label:"server_rack"}),t({x:r.x+110,y:r.y+190,w:24,h:100,label:"server_rack"}),t({x:r.x+r.w-50,y:r.y+r.h/2-30,w:32,h:60,label:"cyber_console"});const o=e[4];t({x:o.x+o.w/2-40,y:o.y+o.h/2-40,w:80,h:80,label:"reactor_core"}),t({x:o.x+40,y:o.y+o.h/2-15,w:45,h:30,label:"cyber_console"}),t({x:o.x+o.w-85,y:o.y+o.h/2-15,w:45,h:30,label:"cyber_console"}),t({x:o.x+o.w/2-22,y:o.y+40,w:44,h:28,label:"cyber_console"}),t({x:o.x+o.w/2-22,y:o.y+o.h-68,w:44,h:28,label:"cyber_console"});const l=e[5];t({x:l.x+30,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+85,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+140,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+l.w-50,y:l.y+l.h-100,w:32,h:65,label:"cyber_console"});const c=e[6];t({x:c.x+30,y:c.y+30,w:120,h:45,label:"desk"}),t({x:c.x+30,y:c.y+110,w:35,h:80,label:"cabinet"}),t({x:c.x+c.w-60,y:c.y+30,w:40,h:100,label:"shelf"});const h=e[7];t({x:h.x+h.w/2-30,y:h.y+h.h/2-30,w:60,h:60,label:"reactor_core"}),t({x:h.x+30,y:h.y+30,w:24,h:24,label:"plant"}),t({x:h.x+h.w-54,y:h.y+30,w:24,h:24,label:"plant"});const f=e[8];t({x:f.x+f.w/2-25,y:f.y+40,w:50,h:50,label:"table"}),t({x:f.x+50,y:f.y+f.h-70,w:80,h:32,label:"cyber_couch"}),t({x:f.x+f.w-130,y:f.y+f.h-70,w:80,h:32,label:"cyber_couch"})}_push(e){this.walls.push(e)}_addWallWithDoorway(e,t,i,s,a,r,o,l,c){if(a==="v"){const h=s,f=Math.max(12,Math.min(h-o-12,r)),d=f+o;f>0&&this._push({x:e,y:t,w:i,h:f,type:l,material:c}),d<h&&this._push({x:e,y:t+d,w:i,h:h-d,type:l,material:c})}else{const h=i,f=Math.max(12,Math.min(h-o-12,r)),d=f+o;f>0&&this._push({x:e,y:t,w:f,h:s,type:l,material:c}),d<h&&this._push({x:e+d,y:t,w:h-d,h:s,type:l,material:c})}}_addFurniture(e){const t=u=>this._push({...u,type:"wall",material:"furniture"}),i=u=>this._push({...u,type:"crate",health:40,maxHealth:40,material:"barrel"}),s=e[0];t({x:s.x+12,y:s.y+12,w:s.w-24,h:28,label:"counter"}),t({x:s.x+12,y:s.y+40,w:28,h:s.h/2-10,label:"counter"}),t({x:s.x+80,y:s.y+s.h-110,w:110,h:60,label:"table"}),t({x:s.x+80+42,y:s.y+s.h-138,w:26,h:26,label:"chair"}),t({x:s.x+80+42,y:s.y+s.h-48,w:26,h:26,label:"chair"}),t({x:s.x+18,y:s.y+s.h-50,w:24,h:24,label:"plant"}),t({x:s.x+s.w-60,y:s.y+12,w:40,h:80,label:"fridge"});const a=e[1];t({x:a.x+55,y:a.y+55,w:190,h:42,label:"sofa"}),t({x:a.x+55,y:a.y+97,w:42,h:90,label:"sofa"}),t({x:a.x+18,y:a.y+110,w:38,h:42,label:"sofa"}),t({x:a.x+a.w/2-55,y:a.y+130,w:110,h:55,label:"table"}),t({x:a.x+a.w-55,y:a.y+65,w:30,h:120,label:"tv"}),t({x:a.x+a.w-55,y:a.y+a.h-100,w:30,h:80,label:"shelf"}),t({x:a.x+a.w-50,y:a.y+18,w:24,h:24,label:"plant"});const r=e[2];t({x:r.x+18,y:r.y+18,w:140,h:52,label:"desk"}),t({x:r.x+18+55,y:r.y+18+56,w:30,h:30,label:"chair"}),t({x:r.x+r.w-38,y:r.y+12,w:22,h:210,label:"shelf"}),t({x:r.x+18,y:r.y+r.h-60,w:80,h:40,label:"cabinet"}),t({x:r.x+r.w-50,y:r.y+r.h-50,w:24,h:24,label:"plant"});const o=e[3];t({x:o.x+12,y:o.y+12,w:90,h:130,label:"tub"}),t({x:o.x+12,y:o.y+o.h-58,w:65,h:38,label:"sink"}),t({x:o.x+o.w-50,y:o.y+12,w:35,h:55,label:"cabinet"}),t({x:o.x+o.w-45,y:o.y+o.h-60,w:28,h:38,label:"toilet"});const l=e[4];t({x:l.x+l.w/2-80,y:l.y+l.h/2-45,w:160,h:90,label:"table"}),t({x:l.x+l.w/2-60,y:l.y+l.h/2-80,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2+30,y:l.y+l.h/2-80,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2-60,y:l.y+l.h/2+90,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2+30,y:l.y+l.h/2+90,w:26,h:26,label:"chair"});const c=e[5];t({x:c.x+12,y:c.y+20,w:115,h:80,label:"bed"}),t({x:c.x+12+120,y:c.y+20,w:32,h:32,label:"dresser"}),t({x:c.x+c.w-52,y:c.y+12,w:36,h:55,label:"dresser"}),t({x:c.x+c.w-52,y:c.y+80,w:36,h:55,label:"cabinet"}),t({x:c.x+12,y:c.y+c.h-90,w:80,h:40,label:"desk"}),t({x:c.x+12+27,y:c.y+c.h-46,w:26,h:26,label:"chair"});const h=e[6];t({x:h.x+40,y:h.y+75,w:210,h:130,label:"car"}),t({x:h.x+12,y:h.y+h.h-48,w:160,h:30,label:"bench"}),i({x:h.x+h.w-65,y:h.y+45,w:38,h:38,id:"barrel_0"}),i({x:h.x+h.w-65,y:h.y+93,w:38,h:38,id:"barrel_1"}),i({x:h.x+h.w-65,y:h.y+141,w:38,h:38,id:"barrel_2"});const f=e[7];t({x:f.x+f.w/2-90,y:f.y+18,w:180,h:110,label:"bed"}),t({x:f.x+f.w/2-130,y:f.y+18,w:32,h:32,label:"dresser"}),t({x:f.x+f.w/2+100,y:f.y+18,w:32,h:32,label:"dresser"}),t({x:f.x+12,y:f.y+12,w:45,h:65,label:"dresser"}),t({x:f.x+f.w-60,y:f.y+12,w:45,h:65,label:"dresser"}),t({x:f.x+18,y:f.y+f.h-50,w:24,h:24,label:"plant"});const d=e[8];t({x:d.x+12,y:d.y+20,w:130,h:90,label:"bed"}),t({x:d.x+12+135,y:d.y+20,w:32,h:32,label:"dresser"}),t({x:d.x+d.w-55,y:d.y+12,w:38,h:110,label:"shelf"}),t({x:d.x+d.w-110,y:d.y+d.h-60,w:90,h:40,label:"desk"}),t({x:d.x+d.w-78,y:d.y+d.h-95,w:26,h:26,label:"chair"}),t({x:d.x+12,y:d.y+d.h-55,w:80,h:38,label:"cabinet"})}_spawnCrates(){let i=0,s=0;for(;i<14&&s<400;){s++;const a=this.rng.range(60,this.width-100),r=this.rng.range(60,this.height-100);if(a<250&&r<250||a>this.width-250&&r>this.height-250||a<250&&r>this.height-250||a>this.width-250&&r<250)continue;let o=!1;const l=14;for(const c of this.walls)if(a+44+l>c.x&&a-l<c.x+c.w&&r+44+l>c.y&&r-l<c.y+c.h){o=!0;break}o||(this._push({x:a,y:r,w:44,h:44,type:"crate",health:50,maxHealth:50,id:`crate_${i}`,material:"crate"}),i++)}}_spawnRandomConsumables(e,t){e.forEach((s,a)=>{let r=!1,o=0;for(;!r&&o<150;){o++;const l=Math.floor(this.rng.next()*this.rooms.length),c=this.rooms[l],h=40,f=this.rng.range(c.x+h,c.x+c.w-h),d=this.rng.range(c.y+h,c.y+c.h-h);let u=!1;for(const p of this.walls)if(f+30>p.x&&f-30<p.x+p.w&&d+30>p.y&&d-30<p.y+p.h){u=!0;break}f<250&&d<250&&(u=!0),f>this.width-250&&d>this.height-250&&(u=!0),f<250&&d>this.height-250&&(u=!0),f>this.width-250&&d<250&&(u=!0),u||(this.items.push({id:`${t}_${a}`,x:f,y:d,type:s,active:!0}),r=!0)}if(!r){const l=Math.floor(this.rng.next()*this.rooms.length),c=this.rooms[l];this.items.push({id:`${t}_${a}`,x:c.x+c.w/2,y:c.y+c.h/2,type:s,active:!0})}})}checkZone(e,t){for(const i of this.zones)if(e>=i.x&&e<=i.x+i.w&&t>=i.y&&t<=i.y+i.h)return i;return null}rebuildSegments(){this.segments=[],this.walls.forEach(e=>{this.segments.push({p1:{x:e.x,y:e.y},p2:{x:e.x+e.w,y:e.y},wall:e}),this.segments.push({p1:{x:e.x+e.w,y:e.y},p2:{x:e.x+e.w,y:e.y+e.h},wall:e}),this.segments.push({p1:{x:e.x+e.w,y:e.y+e.h},p2:{x:e.x,y:e.y+e.h},wall:e}),this.segments.push({p1:{x:e.x,y:e.y+e.h},p2:{x:e.x,y:e.y},wall:e})}),this.navigationRevision=(Number(this.navigationRevision)||0)+1}checkCircleCollision(e,t,i){const s=this._depenetrateCircle(e,t,i);return{x:s.x,y:s.y}}moveCircle(e,t,i,s,a){const r=Math.max(.01,Number(a)||.01),o=this._depenetrateCircle(e,t,r);let l=o.x,c=o.y,h=o.collided,f=o.normalX,d=o.normalY;const u=Number.isFinite(Number(i))?Number(i):0,p=Number.isFinite(Number(s))?Number(s):0,v=Math.hypot(u,p),g=Math.max(2,Math.min(8,r*.45)),m=Math.max(1,Math.ceil(v/g)),M=u/m,_=p/m;for(let y=0;y<m;y++){if(M!==0){const E=l+M,A=this._depenetrateCircle(E,c,r);(Math.abs(A.x-E)>1e-6||Math.abs(A.y-c)>1e-6)&&(h=!0,f+=A.normalX,d+=A.normalY),l=A.x,c=A.y}if(_!==0){const E=c+_,A=this._depenetrateCircle(l,E,r);(Math.abs(A.x-l)>1e-6||Math.abs(A.y-E)>1e-6)&&(h=!0,f+=A.normalX,d+=A.normalY),l=A.x,c=A.y}}const x=Math.hypot(f,d);return{x:l,y:c,collided:h,normalX:x>1e-6?f/x:0,normalY:x>1e-6?d/x:0}}_depenetrateCircle(e,t,i){const s=Math.max(.01,Number(i)||.01);let a=Number.isFinite(Number(e))?Number(e):s,r=Number.isFinite(Number(t))?Number(t):s,o=!1,l=0,c=0;a=Math.max(s,Math.min(this.width-s,a)),r=Math.max(s,Math.min(this.height-s,r));const h=a,f=r;for(let d=0;d<16;d++){let u=!1;for(const p of this.walls){const v=Math.max(p.x,Math.min(a,p.x+p.w)),g=Math.max(p.y,Math.min(r,p.y+p.h)),m=a-v,M=r-g,_=m*m+M*M;if(!(_>=s*s-1e-9)){if(o=!0,u=!0,_>1e-12){const x=Math.sqrt(_),y=s-x+1e-6,E=m/x,A=M/x;a+=E*y,r+=A*y,l+=E,c+=A}else{const x=[{amount:p.x-s-a,nx:-1,ny:0,targetX:p.x-s,targetY:r},{amount:p.x+p.w+s-a,nx:1,ny:0,targetX:p.x+p.w+s,targetY:r},{amount:p.y-s-r,nx:0,ny:-1,targetX:a,targetY:p.y-s},{amount:p.y+p.h+s-r,nx:0,ny:1,targetX:a,targetY:p.y+p.h+s}],y=x.filter(S=>S.targetX>=s-1e-6&&S.targetX<=this.width-s+1e-6&&S.targetY>=s-1e-6&&S.targetY<=this.height-s+1e-6),E=y.length>0?y:x;E.sort((S,w)=>Math.abs(S.amount)-Math.abs(w.amount));const A=E[0];A.nx!==0?a=A.targetX+A.nx*1e-6:r=A.targetY+A.ny*1e-6,l+=A.nx,c+=A.ny}a=Math.max(s,Math.min(this.width-s,a)),r=Math.max(s,Math.min(this.height-s,r))}}if(!u)break}if(!this._circlePositionClear(a,r,s)){const d=this._nearestClearCirclePosition(h,f,s);if(d){const u=d.x-h,p=d.y-f,v=Math.hypot(u,p);a=d.x,r=d.y,o=!0,v>1e-6&&(l+=u/v,c+=p/v)}}return{x:a,y:r,collided:o,normalX:l,normalY:c}}_circlePositionClear(e,t,i){if(e<i||t<i||e>this.width-i||t>this.height-i)return!1;for(const s of this.walls){const a=Math.max(s.x,Math.min(e,s.x+s.w)),r=Math.max(s.y,Math.min(t,s.y+s.h)),o=e-a,l=t-r;if(o*o+l*l<i*i-1e-9)return!1}return!0}_nearestClearCirclePosition(e,t,i){if(this._circlePositionClear(e,t,i))return{x:e,y:t};const s=Math.max(4,Math.min(8,i*.35)),a=Math.max(192,i*12);for(let r=s;r<=a;r+=s){const o=Math.max(16,Math.ceil(Math.PI*2*r/s));for(let l=0;l<o;l++){const c=l/o*Math.PI*2,h=Math.max(i,Math.min(this.width-i,e+Math.cos(c)*r)),f=Math.max(i,Math.min(this.height-i,t+Math.sin(c)*r));if(this._circlePositionClear(h,f,i))return{x:h,y:f}}}return null}getLineIntersection(e,t){let i=null;for(const s of this.segments){const a=this.getLineSegmentIntersection(e,t,s.p1,s.p2);if(a){const r=a.x-e.x,o=a.y-e.y,l=Math.sqrt(r*r+o*o);(!i||l<i.dist)&&(i={x:a.x,y:a.y,dist:l,wall:s.wall})}}return i}getLineSegmentIntersection(e,t,i,s){const a=t.x-e.x,r=t.y-e.y,o=s.x-i.x,l=s.y-i.y,c=-o*r+a*l;if(Math.abs(c)<1e-9)return null;const h=(-r*(e.x-i.x)+a*(e.y-i.y))/c,f=(o*(e.y-i.y)-l*(e.x-i.x))/c;return h>=0&&h<=1&&f>=0&&f<=1?{x:e.x+f*a,y:e.y+f*r}:null}damageCrate(e,t){const i=this.walls.findIndex(a=>a.id===e);if(i===-1)return null;const s=this.walls[i];if(s.health-=t,s.health<=0){this.walls.splice(i,1),this.rebuildSegments();let a=null;if(this.rng.next()<.5){const r=this.rng.next();let o="health";r<.4?o="health":r<.7?o="ammo":r<.85?o="adrenaline":o="overdrive",a={id:`item_${e}_${Date.now()}`,x:s.x+s.w/2,y:s.y+s.h/2,type:o,active:!0},this.items.push(a)}return{broken:!0,item:a,crateX:s.x+s.w/2,crateY:s.y+s.h/2}}return{broken:!1,health:s.health}}syncBreakCrate(e,t){const i=this.walls.findIndex(s=>s.id===e);i!==-1&&(this.walls.splice(i,1),this.rebuildSegments()),t&&!this.items.some(s=>s.id===t.id)&&this.items.push(t)}computeVisibilityPolygon(e,t,i,s=null,a=null){const r=new Set,o=f=>{let d=f;for(;d<-Math.PI;)d+=Math.PI*2;for(;d>Math.PI;)d-=Math.PI*2;return d},l=f=>{if(s===null||a===null)return!0;let d=f-s;for(;d<-Math.PI;)d+=Math.PI*2;for(;d>Math.PI;)d-=Math.PI*2;return Math.abs(d)<=a/2};if(this.walls.forEach(f=>{[{x:f.x,y:f.y},{x:f.x+f.w,y:f.y},{x:f.x+f.w,y:f.y+f.h},{x:f.x,y:f.y+f.h}].forEach(d=>{const u=Math.atan2(d.y-t,d.x-e);l(u)&&(r.add(o(u-1e-4)),r.add(u),r.add(o(u+1e-4)))})}),s!==null&&a!==null){const f=s-a/2,d=s+a/2;r.add(o(f)),r.add(o(d));for(let u=f;u<d;u+=Math.PI/18)r.add(o(u))}else for(let f=-Math.PI;f<Math.PI;f+=Math.PI/10)r.add(f);const c=[];r.forEach(f=>{const d={x:e+Math.cos(f)*i,y:t+Math.sin(f)*i},u=this.getLineIntersection({x:e,y:t},d);c.push(u&&u.dist<i?{x:u.x,y:u.y,angle:f}:{...d,angle:f})});const h=s!==null?s:0;return c.sort((f,d)=>{let u=f.angle-h;for(;u<-Math.PI;)u+=Math.PI*2;for(;u>Math.PI;)u-=Math.PI*2;let p=d.angle-h;for(;p<-Math.PI;)p+=Math.PI*2;for(;p>Math.PI;)p-=Math.PI*2;return u-p}),s!==null&&a!==null&&(c.unshift({x:e,y:t,angle:-999}),c.push({x:e,y:t,angle:999})),c}draw(e,t={shadows:!0},i=[],s=null,a=[]){this.rooms.forEach(l=>this._drawFloor(e,l)),this.decorations.forEach(l=>this._drawDecoration(e,l)),this.zones.forEach(l=>this._drawZone(e,l)),this.items.forEach(l=>{l.active&&this._drawItem(e,l)}),e.save();let r=this.width/2,o=this.height/2;if(s&&(r=s.x,o=s.y),this.walls.forEach(l=>this._drawWall(e,l,r,o)),e.restore(),this.terminals&&this.terminals.forEach(l=>{l.active&&this._drawTerminal(e,l)}),t.shadows&&i&&i.length>0){this.maskCanvas||(this.maskCanvas=document.createElement("canvas"),this.maskCtx=this.maskCanvas.getContext("2d"));const l=e.canvas.width,c=e.canvas.height;(this.maskCanvas.width!==l||this.maskCanvas.height!==c)&&(this.maskCanvas.width=l,this.maskCanvas.height=c),this.maskCtx.fillStyle="rgba(3, 4, 6, 0.995)",this.maskCtx.fillRect(0,0,l,c),this.maskCtx.save(),this.maskCtx.setTransform(e.getTransform());const h=Date.now(),d=Math.sin(h*.04)*Math.cos(h*.007)+Math.sin(h*.1)*.5>-.45;this.ambientLights.brokenCeiling&&(this.ambientLights.brokenCeiling.on=d),this.maskCtx.globalCompositeOperation="destination-out",this.maskCtx.fillStyle="white";for(const[u,p]of Object.entries(this.ambientLights)){if(!p.on)continue;const v=p.pulseType==="garage"?1+Math.sin(h/300)*.05:p.pulseType==="lantern"?1+Math.sin(h/200)*.04:p.pulseType==="quantum"?1+Math.sin(h/150)*.03:1,g=p.radius*v,m=this.maskCtx.createRadialGradient(p.x,p.y,p.innerRadius||10,p.x,p.y,g);m.addColorStop(0,"rgba(255, 255, 255, 1.0)"),m.addColorStop(.5,"rgba(255, 255, 255, 0.45)"),m.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=m,this.maskCtx.beginPath(),this.maskCtx.arc(p.x,p.y,g,0,Math.PI*2),this.maskCtx.fill()}i.forEach(u=>{if(!(u.health<=0)){if(u.flashlightActive&&u.lightPoly&&u.lightPoly.length>0){this.maskCtx.beginPath(),this.maskCtx.moveTo(u.lightPoly[0].x,u.lightPoly[0].y);for(let p=1;p<u.lightPoly.length;p++)this.maskCtx.lineTo(u.lightPoly[p].x,u.lightPoly[p].y);this.maskCtx.closePath(),this.maskCtx.fillStyle="white",this.maskCtx.fill()}if(window.gameEngine&&window.gameEngine.matchMode==="sabotage"&&u.isLocal){const p=this.maskCtx.createRadialGradient(u.x,u.y,10,u.x,u.y,150);p.addColorStop(0,"rgba(255, 255, 255, 1.0)"),p.addColorStop(.7,"rgba(255, 255, 255, 0.45)"),p.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=p,this.maskCtx.beginPath(),this.maskCtx.arc(u.x,u.y,150,0,Math.PI*2),this.maskCtx.fill()}}}),a&&a.length>0&&a.forEach(u=>{if(!u.active)return;const p=this.maskCtx.createRadialGradient(u.x,u.y,5,u.x,u.y,60);p.addColorStop(0,"rgba(255, 255, 255, 1.0)"),p.addColorStop(.5,"rgba(255, 255, 255, 0.45)"),p.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=p,this.maskCtx.beginPath(),this.maskCtx.arc(u.x,u.y,60,0,Math.PI*2),this.maskCtx.fill()}),i.forEach(u=>{if(u.health>0&&u.muzzleFlash>.15){const p=u.x+Math.cos(u.angle)*28,v=u.y+Math.sin(u.angle)*28,g=this.maskCtx.createRadialGradient(p,v,10,p,v,180*u.muzzleFlash);g.addColorStop(0,"rgba(255, 255, 255, 1.0)"),g.addColorStop(.4,"rgba(255, 255, 255, 0.5)"),g.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=g,this.maskCtx.beginPath(),this.maskCtx.arc(p,v,180*u.muzzleFlash,0,Math.PI*2),this.maskCtx.fill()}}),this.maskCtx.restore(),e.save(),e.setTransform(1,0,0,1,0,0),e.drawImage(this.maskCanvas,0,0),e.restore(),i.forEach(u=>{if(u.health>0&&u.flashlightActive&&u.lightPoly&&u.lightPoly.length>0){e.save(),e.beginPath(),e.moveTo(u.lightPoly[0].x,u.lightPoly[0].y);for(let y=1;y<u.lightPoly.length;y++)e.lineTo(u.lightPoly[y].x,u.lightPoly[y].y);e.closePath(),e.clip();const p=u.x,v=u.y,g=700,m=p+Math.cos(u.angle)*g,M=v+Math.sin(u.angle)*g,_=e.createLinearGradient(p,v,m,M);_.addColorStop(0,"rgba(255, 255, 230, 0.18)"),_.addColorStop(.35,"rgba(255, 255, 245, 0.10)"),_.addColorStop(1,"rgba(255, 255, 255, 0.0)"),e.fillStyle=_,e.fill();const x=e.createRadialGradient(p,v,10,p,v,100);x.addColorStop(0,"rgba(255, 255, 220, 0.08)"),x.addColorStop(1,"rgba(255, 255, 220, 0.0)"),e.fillStyle=x,e.fill(),e.restore()}}),e.save();for(const[u,p]of Object.entries(this.ambientLights)){if(!p.on)continue;const v=p.pulseType==="garage"?1+Math.sin(h/300)*.05:p.pulseType==="lantern"?1+Math.sin(h/200)*.04:p.pulseType==="quantum"?1+Math.sin(h/150)*.03:1,g=p.radius*v,m=e.createRadialGradient(p.x,p.y,p.innerRadius||5,p.x,p.y,g);m.addColorStop(0,p.color),m.addColorStop(.5,p.colorMid),m.addColorStop(1,"rgba(0, 0, 0, 0.0)"),e.fillStyle=m,e.beginPath(),e.arc(p.x,p.y,g,0,Math.PI*2),e.fill(),this._drawLightFixture(e,p,h)}e.restore()}}_drawLightFixture(e,t,i){const s=t.fixtureType;if(e.save(),s==="lantern")e.fillStyle="#222",e.strokeStyle="#d4af37",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="rgba(255, 180, 50, 0.9)",e.beginPath(),e.arc(t.x,t.y,3,0,Math.PI*2),e.fill();else if(s==="brokenCeiling")e.fillStyle="#333",e.strokeStyle="#555",e.lineWidth=1,e.fillRect(t.x-16,t.y-4,32,8),e.strokeRect(t.x-16,t.y-4,32,8),e.fillStyle=t.on?"#fff":"#111",e.shadowColor=t.on?"#6cf":"transparent",e.shadowBlur=t.on?10:0,e.fillRect(t.x-12,t.y-2,24,4),e.shadowBlur=0;else if(s==="kitchen")e.fillStyle="#333",e.strokeStyle="#555",e.lineWidth=1,e.fillRect(t.x-12,t.y-12,24,24),e.strokeRect(t.x-12,t.y-12,24,24),e.fillStyle="#66fcf1",e.beginPath(),e.arc(t.x,t.y,5,0,Math.PI*2),e.fill();else if(s==="garage")e.fillStyle="#222",e.strokeStyle="#ff3c3c",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ff3c3c",e.beginPath(),e.arc(t.x,t.y,3.5,0,Math.PI*2),e.fill();else if(s==="bedroom2")e.fillStyle="#2d1822",e.strokeStyle="#ff6ef7",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,9,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ff6ef7",e.beginPath(),e.arc(t.x,t.y,4,0,Math.PI*2),e.fill();else if(s==="quantum"){e.fillStyle="#100c1e",e.strokeStyle="#9d3bff",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,10,0,Math.PI*2),e.fill(),e.stroke();const a=i/100%(Math.PI*2);e.strokeStyle="#d473ff",e.lineWidth=1,e.beginPath(),e.moveTo(t.x-Math.cos(a)*8,t.y-Math.sin(a)*8),e.lineTo(t.x+Math.cos(a)*8,t.y+Math.sin(a)*8),e.stroke()}else s==="reactor_light"?(e.fillStyle="#201005",e.strokeStyle="#ff7f3b",e.lineWidth=2,e.beginPath(),e.arc(t.x,t.y,12,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x,t.y,6+Math.sin(i/200)*1.5,0,Math.PI*2),e.fill()):(s==="server_rack_light"||s==="cryo_light")&&(e.fillStyle="#111",e.strokeStyle=s==="cryo_light"?"#66fcf1":"#39db14",e.lineWidth=1.5,e.fillRect(t.x-6,t.y-6,12,12),e.strokeRect(t.x-6,t.y-6,12,12),e.fillStyle=s==="cryo_light"?"#66fcf1":"#39db14",e.beginPath(),e.arc(t.x,t.y,3,0,Math.PI*2),e.fill());e.restore()}isPointInAmbientLight(e,t,i=0){for(const[s,a]of Object.entries(this.ambientLights)){if(!a.on)continue;if(Math.hypot(e-a.x,t-a.y)<a.radius+i&&!this.getLineIntersection({x:a.x,y:a.y},{x:e,y:t}))return!0}return!1}_addDecorations(e){this.decorations=[];const t=e[0];this.decorations.push({x:t.x+50,y:t.y+55,w:120,h:40,type:"rug",style:"kitchen"});const i=e[1];this.decorations.push({x:i.x+i.w/2-120,y:i.y+110,w:240,h:160,type:"rug",style:"living"});const s=e[2];this.decorations.push({x:s.x+40,y:s.y+80,w:160,h:120,type:"rug",style:"office"});const a=e[3];this.decorations.push({x:a.x+110,y:a.y+40,w:60,h:90,type:"rug",style:"bath"});const r=e[4];this.decorations.push({x:r.x+r.w/2-180,y:r.y+40,w:360,h:60,type:"rug",style:"runner"});const o=e[5];this.decorations.push({x:o.x+30,y:o.y+110,w:140,h:160,type:"rug",style:"bedroom"});const l=e[7];this.decorations.push({x:l.x+l.w/2-120,y:l.y+80,w:240,h:220,type:"rug",style:"master"});const c=e[8];this.decorations.push({x:c.x+c.w/2-70,y:c.y+c.h/2-70,w:140,h:140,type:"rug",style:"circular"})}_drawDecoration(e,t){if(e.save(),t.type==="rug"){e.fillStyle="rgba(0,0,0,0.15)",e.fillRect(t.x+2,t.y+2,t.w,t.h);const s={kitchen:{bg:"#3a2d1f",border:"#aa8c66",text:"#55422d"},living:{bg:"#3b1c1c",border:"#d4af37",text:"#802020"},office:{bg:"#1c2d3b",border:"#66fcf1",text:"#204060"},bath:{bg:"#1f3c3a",border:"#39db14",text:"#152b2a"},runner:{bg:"#2b203c",border:"#9d3bff",text:"#4c2e73"},bedroom:{bg:"#3c3020",border:"#ffe6a3",text:"#5c4930"},master:{bg:"#222d32",border:"#66fcf1",text:"#435e6a"},circular:{bg:"#2d1822",border:"#ff6ef7",text:"#5e2540"}}[t.style]||{bg:"#222",border:"#444",text:"#333"};if(e.fillStyle=s.bg,e.strokeStyle=s.border,e.lineWidth=2,t.style==="circular")e.beginPath(),e.arc(t.x+t.w/2,t.y+t.h/2,t.w/2,0,Math.PI*2),e.fill(),e.stroke(),e.strokeStyle=s.text,e.lineWidth=1.5,e.beginPath(),e.arc(t.x+t.w/2,t.y+t.h/2,t.w/3,0,Math.PI*2),e.stroke();else{if(e.beginPath(),e.roundRect?e.roundRect(t.x,t.y,t.w,t.h,6):e.rect(t.x,t.y,t.w,t.h),e.fill(),e.stroke(),e.strokeStyle=s.border,e.lineWidth=1,e.beginPath(),t.w>t.h)for(let a=t.y+4;a<t.y+t.h;a+=6)e.moveTo(t.x,a),e.lineTo(t.x-4,a),e.moveTo(t.x+t.w,a),e.lineTo(t.x+t.w+4,a);else for(let a=t.x+4;a<t.x+t.w;a+=6)e.moveTo(a,t.y),e.lineTo(a,t.y-4),e.moveTo(a,t.y+t.h),e.lineTo(a,t.y+t.h+4);e.stroke()}}e.restore()}_drawFloor(e,t){if(e.save(),e.beginPath(),e.rect(t.x,t.y,t.w,t.h),e.clip(),t.floor==="tiles"){e.fillStyle="#121a28",e.fillRect(t.x,t.y,t.w,t.h);const i=44;for(let s=t.x;s<t.x+t.w;s+=i)for(let a=t.y;a<t.y+t.h;a+=i){const r=(Math.floor((s-t.x)/i)+Math.floor((a-t.y)/i))%2===0;e.fillStyle=r?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.04)",e.fillRect(s,a,i,i)}e.strokeStyle="rgba(40,80,120,0.25)",e.lineWidth=1;for(let s=t.x;s<=t.x+t.w;s+=i)e.beginPath(),e.moveTo(s,t.y),e.lineTo(s,t.y+t.h),e.stroke();for(let s=t.y;s<=t.y+t.h;s+=i)e.beginPath(),e.moveTo(t.x,s),e.lineTo(t.x+t.w,s),e.stroke()}else if(t.floor==="carpet"){e.fillStyle="#16102a",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(80,50,140,0.12)",e.lineWidth=1;for(let i=t.x;i<=t.x+t.w;i+=9)e.beginPath(),e.moveTo(i,t.y),e.lineTo(i,t.y+t.h),e.stroke();for(let i=t.y;i<=t.y+t.h;i+=9)e.beginPath(),e.moveTo(t.x,i),e.lineTo(t.x+t.w,i),e.stroke();e.strokeStyle="rgba(120,80,200,0.15)",e.lineWidth=3,e.strokeRect(t.x+15,t.y+15,t.w-30,t.h-30)}else if(t.floor==="wood"){e.fillStyle="#1a1208",e.fillRect(t.x,t.y,t.w,t.h);const i=32;for(let s=t.y;s<t.y+t.h;s+=i){const a=Math.floor((s-t.y)/i);e.fillStyle=a%2===0?"rgba(180,110,50,0.055)":"rgba(130,75,30,0.055)",e.fillRect(t.x,s,t.w,i-1),e.strokeStyle="rgba(70,45,18,0.35)",e.lineWidth=1,e.beginPath(),e.moveTo(t.x,s+i-1),e.lineTo(t.x+t.w,s+i-1),e.stroke(),e.strokeStyle="rgba(140,90,40,0.07)";for(let r=t.x+10;r<t.x+t.w-10;r+=t.w/5)e.beginPath(),e.moveTo(r,s),e.lineTo(r+12,s+i-1),e.stroke()}}else if(t.floor==="concrete"){e.fillStyle="#10101a",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(55,55,80,0.25)",e.lineWidth=1;const i=64;for(let s=t.x;s<=t.x+t.w;s+=i)e.beginPath(),e.moveTo(s,t.y),e.lineTo(s,t.y+t.h),e.stroke();for(let s=t.y;s<=t.y+t.h;s+=i)e.beginPath(),e.moveTo(t.x,s),e.lineTo(t.x+t.w,s),e.stroke();if(t.name==="Garage")e.fillStyle="rgba(30,25,10,0.4)",e.beginPath(),e.ellipse(t.x+150,t.y+230,60,30,.3,0,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(t.x+80,t.y+150,40,20,-.2,0,Math.PI*2),e.fill();else if(t.name==="Weaponry Depot"){e.strokeStyle="rgba(212, 175, 55, 0.15)",e.lineWidth=12,e.beginPath();for(let s=t.x;s<t.x+t.w;s+=60)e.moveTo(s,t.y),e.lineTo(s+40,t.y+40),e.moveTo(s,t.y+t.h-40),e.lineTo(s+40,t.y+t.h);e.stroke()}}else if(t.floor==="cybergrid"){e.fillStyle="#060a12",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(102, 252, 241, 0.08)",e.lineWidth=1;const i=50;for(let r=t.x;r<=t.x+t.w;r+=i)e.beginPath(),e.moveTo(r,t.y),e.lineTo(r,t.y+t.h),e.stroke();for(let r=t.y;r<=t.y+t.h;r+=i)e.beginPath(),e.moveTo(t.x,r),e.lineTo(t.x+t.w,r),e.stroke();const s=Date.now(),a=2+Math.sin(s/400)*.8;e.fillStyle="rgba(102, 252, 241, 0.45)";for(let r=t.x+i;r<t.x+t.w;r+=i)for(let o=t.y+i;o<t.y+t.h;o+=i)e.beginPath(),e.arc(r,o,a,0,Math.PI*2),e.fill()}else if(t.floor==="reactor"){e.fillStyle="#0f0a07",e.fillRect(t.x,t.y,t.w,t.h);const i=Date.now(),s=t.x+t.w/2,a=t.y+t.h/2;e.strokeStyle="rgba(255, 127, 59, 0.15)",e.lineWidth=4,e.strokeRect(t.x+8,t.y+8,t.w-16,t.h-16),e.lineWidth=2.5;const r=5;for(let l=1;l<=r;l++){const c=l*28,h=Math.sin(i/250-l*.5)*.15+.85;e.strokeStyle=`rgba(255, 127, 59, ${.08+(1-l/r)*.22})`,e.beginPath(),e.arc(s,a,c*h,0,Math.PI*2),e.stroke()}e.strokeStyle="rgba(255, 150, 80, 0.4)",e.lineWidth=1.5;const o=i/800%(Math.PI*2);e.beginPath(),e.arc(s,a,70,o,o+Math.PI*.4),e.stroke(),e.beginPath(),e.arc(s,a,110,o+Math.PI,o+Math.PI*1.4),e.stroke()}else if(t.floor==="nanogrid"){e.fillStyle="#050c08",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(57, 219, 20, 0.08)",e.lineWidth=1;const i=60;for(let r=t.x+30;r<t.x+t.w;r+=i)e.beginPath(),e.moveTo(r,t.y),e.lineTo(r,t.y+t.h),e.stroke();e.strokeStyle="rgba(57, 219, 20, 0.05)";for(let r=t.y+40;r<t.y+t.h;r+=80)e.beginPath(),e.moveTo(t.x,r),e.lineTo(t.x+t.w*.35,r),e.lineTo(t.x+t.w*.45,r-25),e.lineTo(t.x+t.w,r-25),e.stroke();const s=Date.now();e.fillStyle="rgba(57, 219, 20, 0.6)";const a=Math.floor(t.x*.7+t.y*1.3);for(let r=0;r<6;r++){const o=t.x+30+(a+r*39)%(t.w-60),l=t.y+30+(a*11+r*87)%(t.h-60);Math.floor(s/200+r)%3===0&&e.fillRect(o-2,l-2,4,4)}}else if(t.floor==="cybercarpet"){e.fillStyle="#0f081d",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(157, 59, 255, 0.04)",e.lineWidth=1.5;const i=30,s=i*Math.sqrt(3),a=i*2;for(let r=t.x-s;r<t.x+t.w+s;r+=s)for(let o=t.y-a;o<t.y+t.h+a;o+=a*.75){const l=Math.floor(o/(a*.75))%2*(s/2),c=r+l,h=o;e.beginPath();for(let f=0;f<6;f++){const d=f*Math.PI/3,u=c+i*Math.cos(d),p=h+i*Math.sin(d);f===0?e.moveTo(u,p):e.lineTo(u,p)}e.closePath(),e.stroke()}e.strokeStyle="rgba(157, 59, 255, 0.12)",e.lineWidth=3,e.strokeRect(t.x+20,t.y+20,t.w-40,t.h-40)}e.textAlign="center",e.font="bold 12px Orbitron",e.fillStyle="rgba(120,200,240,0.15)",e.fillText(t.name.toUpperCase(),t.x+t.w/2,t.y+22),e.restore()}_drawZone(e,t){e.save();const i=Math.sin(Date.now()/600)*.12+.12,s=t.type==="healing";e.fillStyle=s?`rgba(30,255,100,${i})`:`rgba(255,60,20,${i})`,e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle=s?`rgba(60,255,130,${i*2})`:`rgba(255,90,40,${i*2})`,e.lineWidth=2,e.setLineDash([8,8]),e.lineDashOffset=-(Date.now()/60%16),e.strokeRect(t.x,t.y,t.w,t.h),e.setLineDash([]);const a=14;e.lineWidth=2.5,[[t.x,t.y,1,1],[t.x+t.w,t.y,-1,1],[t.x,t.y+t.h,1,-1],[t.x+t.w,t.y+t.h,-1,-1]].forEach(([o,l,c,h])=>{e.beginPath(),e.moveTo(o,l+h*a),e.lineTo(o,l),e.lineTo(o+c*a,l),e.stroke()}),e.textAlign="center",e.font="bold 11px Orbitron",e.fillStyle=s?"rgba(80,255,140,0.55)":"rgba(255,110,60,0.55)",e.fillText(t.label,t.x+t.w/2,t.y+t.h/2-6);const r=s?`+${(t.healRate*60).toFixed(0)} HP/s`:`×${t.multiplier} DMG`;e.font="9px Orbitron",e.fillStyle=s?"rgba(80,255,140,0.4)":"rgba(255,110,60,0.4)",e.fillText(r,t.x+t.w/2,t.y+t.h/2+10),e.restore()}_drawItem(e,t){e.save();const i=1+Math.sin(Date.now()/180)*.14;t.type==="health"?(e.shadowColor="#ff2e2e",e.shadowBlur=14,e.fillStyle="#cc2020",e.beginPath(),e.arc(t.x,t.y,11*i,0,Math.PI*2),e.fill(),e.shadowBlur=0,e.fillStyle="#ffffff",e.fillRect(t.x-2.5,t.y-6.5*i,5,13*i),e.fillRect(t.x-6.5*i,t.y-2.5,13*i,5)):t.type==="ammo"?(e.shadowColor="#ffcc00",e.shadowBlur=10,e.fillStyle="#cc9900",e.fillRect(t.x-7,t.y-7,14,14),e.fillStyle="#ffe060",e.fillRect(t.x-2,t.y-5,4,8),e.beginPath(),e.arc(t.x,t.y-5,2,Math.PI,0),e.fill()):t.type==="adrenaline"?(e.shadowColor="#39db14",e.shadowBlur=15,e.fillStyle="#1b7d05",e.beginPath(),e.arc(t.x,t.y,11*i,0,Math.PI*2),e.fill(),e.fillStyle="#39db14",e.beginPath(),e.moveTo(t.x-1,t.y-6*i),e.lineTo(t.x-4,t.y+1),e.lineTo(t.x-1,t.y+1),e.lineTo(t.x-2.5,t.y+7*i),e.lineTo(t.x+3.5,t.y-1),e.lineTo(t.x+.5,t.y-1),e.closePath(),e.fill()):t.type==="overdrive"&&(e.shadowColor="#ffd700",e.shadowBlur=15,e.fillStyle="#aa7c11",e.beginPath(),e.moveTo(t.x,t.y-12*i),e.lineTo(t.x+10*i,t.y),e.lineTo(t.x,t.y+12*i),e.lineTo(t.x-10*i,t.y),e.closePath(),e.fill(),e.strokeStyle="#ffd700",e.lineWidth=2.5,e.lineCap="round",e.lineJoin="round",e.beginPath(),e.moveTo(t.x-4,t.y-4),e.lineTo(t.x-1,t.y),e.lineTo(t.x-4,t.y+4),e.stroke(),e.beginPath(),e.moveTo(t.x+1,t.y-4),e.lineTo(t.x+4,t.y),e.lineTo(t.x+1,t.y+4),e.stroke()),e.restore()}initTerminals(){this.terminals=[{id:"term_1",x:this.mapId==="cyberlab"?700:720,y:620,radius:24,hacked:!1,progress:0,active:!0,label:"REACTOR DATA CORE"},{id:"term_2",x:1220,y:1120,radius:24,hacked:!1,progress:0,active:!0,label:"SECURE CACHE SUPPLY"}]}_drawTerminal(e,t){e.save();const i=1+Math.sin(Date.now()/200)*.08,s=e.createRadialGradient(t.x,t.y,5,t.x,t.y,t.radius*1.5*i);s.addColorStop(0,t.hacked?"rgba(57, 255, 20, 0.25)":"rgba(102, 252, 241, 0.25)"),s.addColorStop(1,"rgba(0, 0, 0, 0.0)"),e.fillStyle=s,e.beginPath(),e.arc(t.x,t.y,t.radius*1.8*i,0,Math.PI*2),e.fill(),e.fillStyle="#1c1e24",e.strokeStyle="#2b2e38",e.lineWidth=2,e.beginPath(),e.arc(t.x,t.y,14,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#0b0c10",e.strokeStyle=t.hacked?"rgba(57, 255, 20, 0.8)":"rgba(102, 252, 241, 0.8)",e.lineWidth=1.5,e.beginPath(),e.roundRect?e.roundRect(t.x-12,t.y-12,24,16,3):e.rect(t.x-12,t.y-12,24,16),e.fill(),e.stroke(),e.fillStyle=t.hacked?"#39ff14":"#66fcf1",e.font="bold 5px monospace",e.textAlign="center",e.textBaseline="middle",e.fillText(t.hacked?"SECURE":"ACCESS",t.x,t.y-4),e.fillStyle=t.hacked?"#39ff14":"#ffd700",e.beginPath(),e.arc(t.x-6,t.y+7,2,0,Math.PI*2),e.arc(t.x+6,t.y+7,2,0,Math.PI*2),e.fill(),e.restore()}_drawExtrudedObject(e,t,i,s,a,r){const o={x:t.x,y:t.y},l={x:t.x+t.w,y:t.y},c={x:t.x+t.w,y:t.y+t.h},h={x:t.x,y:t.y+t.h},f={x:o.x+(o.x-i)*a,y:o.y+(o.y-s)*a},d={x:l.x+(l.x-i)*a,y:l.y+(l.y-s)*a},u={x:c.x+(c.x-i)*a,y:c.y+(c.y-s)*a},p={x:h.x+(h.x-i)*a,y:h.y+(h.y-s)*a};e.save(),e.fillStyle="rgba(2, 3, 5, 0.45)",e.beginPath(),e.moveTo(o.x,o.y),e.lineTo(l.x,l.y),e.lineTo(c.x,c.y),e.lineTo(h.x,h.y),e.closePath(),e.fill(),e.restore();const v=(M,_,x,y,E)=>{e.save(),e.fillStyle=E,e.beginPath(),e.moveTo(M.x,M.y),e.lineTo(_.x,_.y),e.lineTo(y.x,y.y),e.lineTo(x.x,x.y),e.closePath(),e.fill(),e.strokeStyle="rgba(0,0,0,0.25)",e.lineWidth=1,e.stroke(),e.restore()};v(o,l,f,d,s>t.y?"#090a0d":"#17181c"),v(l,c,d,u,i<t.x+t.w?"#0d0e12":"#1b1c21"),v(c,h,u,p,s<t.y+t.h?"#090a0d":"#17181c"),v(h,o,p,f,i>t.x?"#0d0e12":"#1b1c21"),e.save(),e.beginPath(),e.moveTo(f.x,f.y),e.lineTo(d.x,d.y),e.lineTo(u.x,u.y),e.lineTo(p.x,p.y),e.closePath(),e.clip();const g=f.x-t.x,m=f.y-t.y;e.translate(g,m),r(e,t),e.restore(),e.save(),e.beginPath(),e.moveTo(f.x,f.y),e.lineTo(d.x,d.y),e.lineTo(u.x,u.y),e.lineTo(p.x,p.y),e.closePath(),e.strokeStyle="rgba(255,255,255,0.12)",e.lineWidth=1.5,e.stroke(),e.restore()}_drawExtrudedBarrel(e,t,i,s){const r=t.x+t.w/2,o=t.y+t.h/2,l=t.w/2,c=r+(r-i)*.04,h=o+(o-s)*.04;e.save(),e.fillStyle="rgba(2, 3, 5, 0.45)",e.beginPath(),e.arc(r,o,l,0,Math.PI*2),e.fill(),e.restore();const f=Math.atan2(h-o,c-r)+Math.PI/2,d=Math.cos(f)*l,u=Math.sin(f)*l;e.save(),e.fillStyle="#1c1000",e.beginPath(),e.moveTo(r-d,o-u),e.lineTo(r+d,o-u),e.lineTo(c+d,h-u),e.lineTo(c-d,h-u),e.closePath(),e.fill(),e.strokeStyle="#3a2000",e.stroke(),e.restore(),e.save(),e.translate(c-r,h-o),this._drawBarrel(e,t),e.restore()}_drawWall(e,t,i,s){e.save();const a=.08,r=.04;switch(t.material){case"exterior":this._drawExtrudedObject(e,t,i,s,a,(o,l)=>this._drawExteriorWall(o,l));break;case"interior":this._drawExtrudedObject(e,t,i,s,a,(o,l)=>this._drawInteriorWall(o,l));break;case"furniture":this._drawExtrudedObject(e,t,i,s,r,(o,l)=>this._drawFurniturePiece(o,l));break;case"barrel":this._drawExtrudedBarrel(e,t,i,s);break;case"crate":this._drawExtrudedObject(e,t,i,s,r,(o,l)=>this._drawCratePiece(o,l));break;default:this._drawExtrudedObject(e,t,i,s,a,(o,l)=>this._drawInteriorWall(o,l))}e.restore()}_drawExteriorWall(e,t){e.fillStyle="#0b0b12",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(60,50,90,0.4)",e.lineWidth=1;const i=32,s=13;for(let a=t.x;a<t.x+t.w;a+=i)for(let r=t.y;r<t.y+t.h;r+=s){const o=Math.floor((r-t.y)/s)%2*(i/2);e.strokeRect(a+o,r,i,s)}e.strokeStyle="rgba(102,252,241,0.28)",e.lineWidth=2,e.strokeRect(t.x,t.y,t.w,t.h)}_drawInteriorWall(e,t){e.fillStyle="#1b1c22",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(90,130,170,0.45)",e.lineWidth=1.5,e.strokeRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(170,130,70,0.25)",e.lineWidth=1,t.w>t.h?(e.beginPath(),e.moveTo(t.x,t.y+3),e.lineTo(t.x+t.w,t.y+3),e.stroke(),e.beginPath(),e.moveTo(t.x,t.y+t.h-3),e.lineTo(t.x+t.w,t.y+t.h-3),e.stroke()):(e.beginPath(),e.moveTo(t.x+3,t.y),e.lineTo(t.x+3,t.y+t.h),e.stroke(),e.beginPath(),e.moveTo(t.x+t.w-3,t.y),e.lineTo(t.x+t.w-3,t.y+t.h),e.stroke())}_drawFurniturePiece(e,t){const i=t.label||"",a={sofa:{fill:"#261637",stroke:"#4a2a70"},table:{fill:"#241510",stroke:"#7a4a22"},bed:{fill:"#152030",stroke:"#2a5080"},counter:{fill:"#182215",stroke:"#3a7050"},desk:{fill:"#1e1408",stroke:"#5a3a18"},tub:{fill:"#0a1a2c",stroke:"#1a5a8a"},sink:{fill:"#0a1828",stroke:"#2a6090"},tv:{fill:"#0a0a14",stroke:"#4a4a70"},shelf:{fill:"#1e1006",stroke:"#5a3010"},car:{fill:"#1a1a28",stroke:"#3a3a5c"},bench:{fill:"#1c1408",stroke:"#5c4018"},fridge:{fill:"#141c24",stroke:"#3a5a78"},cabinet:{fill:"#18100a",stroke:"#5a3a1a"},dresser:{fill:"#1e1408",stroke:"#6a4020"},toilet:{fill:"#eee",stroke:"#555"},chair:{fill:"#2b1e16",stroke:"#5c402d"},plant:{fill:"#152d18",stroke:"#345a3a"},cyber_couch:{fill:"#110a24",stroke:"#9d3bff"},containment_pod:{fill:"#08181a",stroke:"#66fcf1"},server_rack:{fill:"#080c10",stroke:"#39db14"},cyber_console:{fill:"#050c18",stroke:"#1a7cd8"},reactor_core:{fill:"#150c05",stroke:"#ff7f3b"},nano_charger:{fill:"#051a0c",stroke:"#39db14"}}[i]||{fill:"#1a1a2a",stroke:"#4a4a80"};if(e.fillStyle=a.fill,e.strokeStyle=a.stroke,e.lineWidth=1.5,e.beginPath(),e.roundRect?e.roundRect(t.x,t.y,t.w,t.h,4):e.rect(t.x,t.y,t.w,t.h),e.fill(),e.stroke(),i==="bed"){e.fillStyle="rgba(255,255,255,0.05)",e.fillRect(t.x,t.y,t.w,10),e.strokeStyle=a.stroke,e.strokeRect(t.x,t.y,t.w,10),e.fillStyle="#223040",e.strokeStyle="rgba(255,255,255,0.1)",e.lineWidth=1;const r=Math.min(32,(t.w-16)/2),o=Math.min(18,t.h*.18),l=t.y+16;t.w>80?(e.fillRect(t.x+8,l,r,o),e.strokeRect(t.x+8,l,r,o),e.fillRect(t.x+t.w-8-r,l,r,o),e.strokeRect(t.x+t.w-8-r,l,r,o)):(e.fillRect(t.x+t.w/2-r/2,l,r,o),e.strokeRect(t.x+t.w/2-r/2,l,r,o)),e.strokeStyle="rgba(255, 255, 255, 0.08)",e.lineWidth=1.5,e.beginPath(),e.moveTo(t.x+4,t.y+t.h*.45),e.lineTo(t.x+t.w-4,t.y+t.h*.45),e.stroke(),e.beginPath(),e.moveTo(t.x+4,t.y+t.h*.45),e.lineTo(t.x+t.w/3,t.y+t.h*.65),e.moveTo(t.x+t.w-4,t.y+t.h*.45),e.lineTo(t.x+t.w*.66,t.y+t.h*.65),e.stroke()}else if(i==="sofa"){e.fillStyle="rgba(0,0,0,0.18)";const r=10;if(e.strokeStyle="rgba(255, 255, 255, 0.06)",t.w>t.h){e.fillRect(t.x,t.y,r,t.h),e.strokeRect(t.x,t.y,r,t.h),e.fillRect(t.x+t.w-r,t.y,r,t.h),e.strokeRect(t.x+t.w-r,t.y,r,t.h),e.fillRect(t.x+r,t.y,t.w-r*2,r),e.strokeRect(t.x+r,t.y,t.w-r*2,r);const o=(t.w-r*2)/3;for(let l=1;l<3;l++)e.beginPath(),e.moveTo(t.x+r+o*l,t.y+r),e.lineTo(t.x+r+o*l,t.y+t.h),e.stroke()}else{e.fillRect(t.x,t.y,t.w,r),e.strokeRect(t.x,t.y,t.w,r),e.fillRect(t.x,t.y+t.h-r,t.w,r),e.strokeRect(t.x,t.y+t.h-r,t.w,r),e.fillRect(t.x,t.y+r,r,t.h-r*2),e.strokeRect(t.x,t.y+r,r,t.h-r*2);const o=(t.h-r*2)/2;for(let l=1;l<2;l++)e.beginPath(),e.moveTo(t.x+r,t.y+r+o*l),e.lineTo(t.x+t.w,t.y+r+o*l),e.stroke()}}else if(i==="counter")if(e.strokeStyle="rgba(255,255,255,0.08)",e.lineWidth=1,t.w>t.h){e.fillStyle="#111b22",e.fillRect(t.x+t.w*.2,t.y+4,30,t.h-8),e.strokeRect(t.x+t.w*.2,t.y+4,30,t.h-8),e.strokeStyle="#8fa4b3",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+t.w*.2+15,t.y+2),e.lineTo(t.x+t.w*.2+15,t.y+8),e.stroke(),e.strokeStyle="#ff5c28",e.lineWidth=1;const r=t.x+t.w*.7,o=t.y+t.h/2;e.beginPath(),e.arc(r-12,o-6,4,0,Math.PI*2),e.arc(r+12,o-6,5,0,Math.PI*2),e.arc(r-12,o+6,5,0,Math.PI*2),e.arc(r+12,o+6,4,0,Math.PI*2),e.stroke()}else e.fillStyle="#111b22",e.fillRect(t.x+4,t.y+t.h*.3,t.w-8,30),e.strokeRect(t.x+4,t.y+t.h*.3,t.w-8,30),e.strokeStyle="#8fa4b3",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+2,t.y+t.h*.3+15),e.lineTo(t.x+8,t.y+t.h*.3+15),e.stroke();else if(i==="desk")e.fillStyle="rgba(0,0,0,0.15)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.fillStyle="#05050a",e.strokeStyle="#66fcf1",e.lineWidth=1.5,t.w>t.h?(e.fillRect(t.x+t.w/2-25,t.y+6,50,4),e.strokeRect(t.x+t.w/2-25,t.y+6,50,4),e.fillStyle="#222",e.fillRect(t.x+t.w/2-20,t.y+15,40,10)):(e.fillRect(t.x+6,t.y+t.h/2-25,4,50),e.strokeRect(t.x+6,t.y+t.h/2-25,4,50),e.fillStyle="#222",e.fillRect(t.x+15,t.y+t.h/2-20,10,40));else if(i==="shelf"){e.fillStyle="#3c2415",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4);const r=["#9e2a2b","#3e5c76","#ffe066","#a3b18a","#9b5de5","#ff9f1c"];e.lineWidth=1;const o=Math.round(t.x*13+t.y*37),l=new so(o);if(t.w>t.h){let c=t.x+4;for(;c<t.x+t.w-6;){const h=Math.floor(l.next()*4)+3,f=Math.floor(l.next()*8)+12;e.fillStyle=r[Math.floor(l.next()*r.length)],e.fillRect(c,t.y+t.h-2-f,h,f),e.strokeRect(c,t.y+t.h-2-f,h,f),c+=h+1}}else{let c=t.y+4;for(;c<t.y+t.h-6;){const h=Math.floor(l.next()*4)+3,f=Math.floor(l.next()*8)+12;e.fillStyle=r[Math.floor(l.next()*r.length)],e.fillRect(t.x+2,c,f,h),e.strokeRect(t.x+2,c,f,h),c+=h+1}}}else if(i==="dresser"||i==="cabinet")if(e.strokeStyle="rgba(255,255,255,0.06)",e.lineWidth=1,t.w>t.h){const o=t.w/2;for(let l=0;l<2;l++)e.strokeRect(t.x+o*l+2,t.y+2,o-4,t.h-4),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x+o*l+o/2,t.y+t.h-5,2,0,Math.PI*2),e.fill()}else{const o=t.h/3;for(let l=0;l<3;l++)e.strokeRect(t.x+2,t.y+o*l+2,t.w-4,o-4),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x+t.w-5,t.y+o*l+o/2,2,0,Math.PI*2),e.fill()}else if(i==="toilet")e.fillStyle="#eee",e.strokeStyle="#555",e.lineWidth=1.5,e.fillRect(t.x+4,t.y,t.w-8,12),e.strokeRect(t.x+4,t.y,t.w-8,12),e.beginPath(),e.arc(t.x+t.w/2,t.y+24,9,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#66c0f4",e.beginPath(),e.arc(t.x+t.w/2,t.y+24,5,0,Math.PI*2),e.fill();else if(i==="chair")e.fillStyle="rgba(0,0,0,0.1)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.strokeStyle=a.stroke,e.lineWidth=2.5,e.beginPath(),e.moveTo(t.x+2,t.y+2),e.lineTo(t.x+t.w-2,t.y+2),e.stroke();else if(i==="plant"){const r=t.x+t.w/2,o=t.y+t.h/2;e.fillStyle="#8c5a3c",e.strokeStyle="#5c3a26",e.beginPath(),e.arc(r,o,10,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#2a7c36",e.beginPath(),e.arc(r-6,o-4,7,0,Math.PI*2),e.arc(r+6,o-4,6,0,Math.PI*2),e.arc(r,o+6,8,0,Math.PI*2),e.arc(r-3,o+5,6,0,Math.PI*2),e.fill(),e.fillStyle="#4ea35b",e.beginPath(),e.arc(r-4,o-2,4,0,Math.PI*2),e.arc(r+4,o-2,3,0,Math.PI*2),e.arc(r,o+3,4,0,Math.PI*2),e.fill()}else if(i==="tub")e.fillStyle="#0d2535",e.fillRect(t.x+7,t.y+7,t.w-14,t.h-14),e.strokeStyle="rgba(50,170,255,0.25)",e.strokeRect(t.x+7,t.y+7,t.w-14,t.h-14);else if(i==="car")e.fillStyle="#0a1828",e.fillRect(t.x+28,t.y+18,65,38),e.fillRect(t.x+t.w-95,t.y+18,65,38),e.strokeStyle="rgba(80,120,200,0.3)",e.strokeRect(t.x+28,t.y+18,65,38),e.strokeRect(t.x+t.w-95,t.y+18,65,38),e.strokeStyle="rgba(100,100,180,0.4)",e.lineWidth=2,e.strokeRect(t.x+10,t.y+10,t.w-20,t.h-20);else if(i==="cyber_couch")e.fillStyle="rgba(0,0,0,0.2)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.strokeStyle="rgba(157, 59, 255, 0.25)",e.lineWidth=1,t.w>t.h?(e.strokeRect(t.x+6,t.y+4,t.w-12,6),e.beginPath(),e.moveTo(t.x+4,t.y+t.h-4),e.lineTo(t.x+t.w-4,t.y+t.h-4),e.strokeStyle="#9d3bff",e.stroke()):(e.strokeRect(t.x+4,t.y+6,6,t.h-12),e.beginPath(),e.moveTo(t.x+t.w-4,t.y+4),e.lineTo(t.x+t.w-4,t.y+t.h-4),e.strokeStyle="#9d3bff",e.stroke());else if(i==="containment_pod"){e.fillStyle="rgba(102, 252, 241, 0.05)",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.fillStyle="#222",e.strokeStyle="#66fcf1",e.lineWidth=1.5,t.w>t.h?(e.fillRect(t.x,t.y,8,t.h),e.strokeRect(t.x,t.y,8,t.h),e.fillRect(t.x+t.w-8,t.y,8,t.h),e.strokeRect(t.x+t.w-8,t.y,8,t.h)):(e.fillRect(t.x,t.y,t.w,8),e.strokeRect(t.x,t.y,t.w,8),e.fillRect(t.x,t.y+t.h-8,t.w,8),e.strokeRect(t.x,t.y+t.h-8,t.w,8));const r=Date.now();e.fillStyle="rgba(102, 252, 241, 0.4)";const o=Math.floor(t.x*2.3+t.y*1.7);for(let l=0;l<4;l++){const c=t.x+10+(o+l*29)%(t.w-20),h=t.y+10+((o*7+l*41-r*.04)%(t.h-20)+(t.h-20))%(t.h-20);e.beginPath(),e.arc(c,h,1.5+l%2,0,Math.PI*2),e.fill()}}else if(i==="server_rack"){e.fillStyle="#0a0d14",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.strokeStyle="rgba(255, 255, 255, 0.04)",e.lineWidth=1;const r=Date.now(),o=Math.floor(t.h/14);if(t.h>t.w)for(let l=0;l<o;l++){const c=t.y+4+l*14;e.strokeRect(t.x+3,c,t.w-6,10);const h=Math.floor(r/200+l)%4!==0,f=Math.floor(r/450+l*2)%6===0,d=Math.floor(r/300-l)%5===0;e.fillStyle=h?"#39db14":"#053005",e.fillRect(t.x+6,c+4,3,3),e.fillStyle=f?"#ff3c3c":"#400505",e.fillRect(t.x+12,c+4,3,3),e.fillStyle=d?"#66fcf1":"#052028",e.fillRect(t.x+18,c+4,3,3)}else{const l=Math.floor(t.w/14);for(let c=0;c<l;c++){const h=t.x+4+c*14;e.strokeRect(h,t.y+3,10,t.h-6);const f=Math.floor(r/200+c)%4!==0,d=Math.floor(r/450+c*2)%6===0;e.fillStyle=f?"#39db14":"#053005",e.fillRect(h+4,t.y+6,3,3),e.fillStyle=d?"#ff3c3c":"#400505",e.fillRect(h+4,t.y+12,3,3)}}}else if(i==="cyber_console")if(e.fillStyle="rgba(0,0,0,0.35)",e.fillRect(t.x+3,t.y+3,t.w-6,t.h-6),e.fillStyle="#09152b",e.strokeStyle="#1a7cd8",e.lineWidth=1.5,t.w>t.h){e.fillRect(t.x+5,t.y+t.h-12,t.w-10,8),e.strokeRect(t.x+5,t.y+t.h-12,t.w-10,8),e.fillStyle="rgba(26, 124, 216, 0.15)",e.fillRect(t.x+10,t.y+4,t.w-20,t.h-18),e.strokeRect(t.x+10,t.y+4,t.w-20,t.h-18),e.strokeStyle="#66fcf1",e.lineWidth=1,e.beginPath();const r=Date.now();for(let o=t.x+14;o<t.x+t.w-14;o+=4){const l=t.y+10+Math.sin(r*.005+o*.1)*3;o===t.x+14?e.moveTo(o,l):e.lineTo(o,l)}e.stroke()}else e.fillRect(t.x+4,t.y+5,8,t.h-10),e.strokeRect(t.x+4,t.y+5,8,t.h-10),e.fillStyle="rgba(26, 124, 216, 0.15)",e.fillRect(t.x+14,t.y+10,t.w-18,t.h-20),e.strokeRect(t.x+14,t.y+10,t.w-18,t.h-20);else if(i==="reactor_core"){const r=t.x+t.w/2,o=t.y+t.h/2,l=Math.min(t.w,t.h)/2,c=Date.now();e.fillStyle="#100a05",e.strokeStyle="#ff7f3b",e.lineWidth=2.5,e.beginPath(),e.arc(r,o,l-4,0,Math.PI*2),e.fill(),e.stroke();const h=3,f=c/400%(Math.PI*2);e.fillStyle="#ff7f3b";for(let d=0;d<h;d++){const u=f+d*Math.PI*2/h,p=r+Math.cos(u)*(l-12),v=o+Math.sin(u)*(l-12);e.beginPath(),e.arc(p,v,4,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(255, 215, 0, 0.25)",e.lineWidth=1.5,e.beginPath(),e.moveTo(r,o),e.lineTo(p,v),e.stroke()}e.fillStyle="#ffd700",e.shadowColor="#ff7f3b",e.shadowBlur=12,e.beginPath(),e.arc(r,o,6+Math.sin(c/150)*1.5,0,Math.PI*2),e.fill(),e.shadowBlur=0}else if(i==="nano_charger"){e.fillStyle="#06100a",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.fillStyle="rgba(57, 219, 20, 0.1)",e.strokeStyle="#39db14",e.lineWidth=1.5,e.strokeRect(t.x+4,t.y+4,t.w-8,t.h-8);const r=Date.now(),o=(t.h-12)*(.5+Math.sin(r/250)*.35);e.fillStyle="#39db14",e.fillRect(t.x+6,t.y+t.h-6-o,t.w-12,o)}else i==="fridge"?(e.strokeStyle="rgba(160,200,255,0.4)",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+t.w/2-10,t.y+12),e.lineTo(t.x+t.w/2+10,t.y+12),e.stroke()):(e.strokeStyle="rgba(255,255,255,0.06)",e.strokeRect(t.x+3,t.y+3,t.w-6,t.h-6))}_drawBarrel(e,t){const i=t.x+t.w/2,s=t.y+t.h/2,a=t.w/2;if(e.fillStyle="#2a1800",e.strokeStyle="#9a4800",e.lineWidth=2,e.beginPath(),e.arc(i,s,a,0,Math.PI*2),e.fill(),e.stroke(),e.strokeStyle="rgba(255,120,0,0.65)",e.lineWidth=2,e.beginPath(),e.arc(i,s,a-5,0,Math.PI*2),e.stroke(),e.strokeStyle="rgba(255,160,0,0.4)",e.lineWidth=1.5,e.beginPath(),e.moveTo(i-a*.4,s-a*.4),e.lineTo(i+a*.4,s+a*.4),e.moveTo(i+a*.4,s-a*.4),e.lineTo(i-a*.4,s+a*.4),e.stroke(),t.health<t.maxHealth){const r=t.health/t.maxHealth;e.fillStyle="rgba(0,0,0,0.6)",e.fillRect(t.x,t.y+2,t.w,4),e.fillStyle=r>.5?"#39ff14":"#ff3c3c",e.fillRect(t.x,t.y+2,t.w*r,4)}}_drawCratePiece(e,t){e.fillStyle="#3a2b1e",e.strokeStyle="#b8865c",e.lineWidth=1.5,e.fillRect(t.x,t.y,t.w,t.h),e.strokeRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(170,110,60,0.4)",e.lineWidth=1,e.beginPath(),e.moveTo(t.x+3,t.y+3),e.lineTo(t.x+t.w-3,t.y+t.h-3),e.moveTo(t.x+t.w-3,t.y+3),e.lineTo(t.x+3,t.y+t.h-3),e.stroke(),e.strokeStyle="rgba(210,150,80,0.7)",e.lineWidth=1.5;const i=8;if([[t.x,t.y,1,1],[t.x+t.w,t.y,-1,1],[t.x,t.y+t.h,1,-1],[t.x+t.w,t.y+t.h,-1,-1]].forEach(([s,a,r,o])=>{e.beginPath(),e.moveTo(s,a+o*i),e.lineTo(s,a),e.lineTo(s+r*i,a),e.stroke()}),t.health<t.maxHealth){const s=t.health/t.maxHealth;e.fillStyle="rgba(0,0,0,0.6)",e.fillRect(t.x+4,t.y+4,t.w-8,5),e.fillStyle=s>.5?"#39ff14":"#ff3c3c",e.fillRect(t.x+4,t.y+4,(t.w-8)*s,5)}}};class gi{constructor(e,t,i,s,a,r,o,l,c="normal"){this.x=e,this.y=t,this.vx=i,this.vy=s,this.color=a,this.size=r,this.life=o,this.decay=l,this.type=c,this.angle=Math.random()*Math.PI*2,this.spin=(Math.random()-.5)*.3,this.bounceCount=0}update(e){if(this.life-=this.decay,this.type==="casing"||this.type==="splinter"){this.vx*=.95,this.vy*=.95,this.angle+=this.spin;const t=this.x+this.vx,i=this.y+this.vy,s=e.checkCircleCollision(t,i,this.size);(s.x!==t||s.y!==i)&&this.bounceCount<2?(this.bounceCount++,this.x=s.x,this.y=s.y,this.vx=-this.vx*.4,this.vy=-this.vy*.4):(this.x=s.x,this.y=s.y)}else this.x+=this.vx,this.y+=this.vy,this.vx*=.92,this.vy*=.92}draw(e){e.save(),e.globalAlpha=Math.max(0,this.life),this.type==="casing"?(e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle="#d4af37",e.strokeStyle="#996515",e.lineWidth=.5,e.fillRect(-this.size,-this.size/2,this.size*2,this.size),e.strokeRect(-this.size,-this.size/2,this.size*2,this.size)):this.type==="splinter"?(e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle="#8b5a2b",e.beginPath(),e.moveTo(-this.size,0),e.lineTo(this.size,-this.size/2),e.lineTo(this.size/2,this.size/2),e.closePath(),e.fill()):this.type==="blood"?(e.fillStyle=this.color,e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fill()):(e.fillStyle=this.color,!(window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode)&&(this.color.startsWith("#66fc")||this.color.startsWith("#ff3c"))&&(e.shadowColor=this.color,e.shadowBlur=4),e.beginPath(),e.arc(this.x,this.y,this.size*this.life,0,Math.PI*2),e.fill()),e.restore()}}class ao{constructor(e,t,i,s,a="blood"){this.x=e,this.y=t,this.size=i,this.color=s,this.type=a,this.angle=Math.random()*Math.PI*2,this.scaleX=1+(Math.random()-.5)*.4,this.scaleY=1+(Math.random()-.5)*.4}draw(e){e.save(),e.translate(this.x,this.y),e.rotate(this.angle),e.globalAlpha=this.type==="blood"?.75:.9,this.type==="blood"?(e.fillStyle=this.color,e.beginPath(),e.ellipse(0,0,this.size*this.scaleX,this.size*this.scaleY,0,0,Math.PI*2),e.fill()):this.type==="casing"?(e.fillStyle="#b5921c",e.fillRect(-this.size,-this.size/2,this.size*2,this.size)):this.type==="splinter"&&(e.fillStyle="#6e441c",e.fillRect(-this.size,-this.size/3,this.size*1.5,this.size*.7)),e.restore()}}class Cx{constructor(){this.particles=[],this.decals=[],this.bloodEnabled=!0}clear(){this.particles=[],this.decals=[]}setBloodEnabled(e){this.bloodEnabled=e}update(e){for(let t=this.particles.length-1;t>=0;t--){const i=this.particles[t];i.update(e),i.life<=0&&(i.type==="blood"&&this.bloodEnabled&&Math.random()<.6?this.decals.push(new ao(i.x,i.y,i.size*1.2,i.color,"blood")):i.type==="casing"?this.decals.push(new ao(i.x,i.y,i.size,"#996515","casing")):i.type==="splinter"&&Math.random()<.4&&this.decals.push(new ao(i.x,i.y,i.size,"#5c3917","splinter")),this.particles.splice(t,1))}this.decals.length>250&&this.decals.shift()}drawDecals(e){this.decals.forEach(t=>t.draw(e))}drawParticles(e){this.particles.forEach(t=>t.draw(e))}spawnWallImpact(e,t,i){const s=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,a=i+Math.PI,r=s?1:Math.floor(Math.random()*4)+3;for(let o=0;o<r;o++){const l=a+(Math.random()-.5)*1.2,c=Math.random()*3+2,h=Math.cos(l)*c,f=Math.sin(l)*c,d=Math.random()*2.2+1.2,u=Math.random()*.04+.04;this.particles.push(new gi(e,t,h,f,Math.random()>.5?"#66fcf1":"#ffffff",d,1,u,"spark"))}s||this.particles.push(new gi(e,t,(Math.random()-.5)*.3,(Math.random()-.5)*.3,"rgba(197, 198, 199, 0.25)",Math.random()*6+4,1,.03,"smoke"))}spawnBloodSplatter(e,t,i){if(!this.bloodEnabled)return;const a=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode?2:Math.floor(Math.random()*6)+6;for(let r=0;r<a;r++){const o=i+(Math.random()-.5)*1.1,l=Math.random()*4.5+2.5,c=Math.cos(o)*l,h=Math.sin(o)*l,f=Math.random()*3+1.5,d=Math.random()*.05+.04,p=`rgb(${Math.floor(Math.random()*60)+120}, 10, 10)`;this.particles.push(new gi(e,t,c,h,p,f,1,d,"blood"))}}spawnGunCasing(e,t,i,s){if(window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode)return;const r=i+Math.PI/2+(Math.random()-.5)*.5,o=Math.random()*2+1.8,l=Math.cos(r)*o,c=Math.sin(r)*o,h=s==="sniper"?3.5:s==="pistol"?2:2.6,f=.02;this.particles.push(new gi(e,t,l,c,"#d4af37",h,1,f,"casing"));const d=i+(Math.random()-.5)*.3,u=Math.random()*.6+.3;this.particles.push(new gi(e+Math.cos(i)*6,t+Math.sin(i)*6,Math.cos(d)*u,Math.sin(d)*u,"rgba(200, 200, 200, 0.15)",Math.random()*5+3,1,.04,"smoke"))}spawnCrateSplinters(e,t){const i=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,s=i?3:Math.floor(Math.random()*12)+10;for(let a=0;a<s;a++){const r=Math.random()*Math.PI*2,o=Math.random()*4+1.5,l=Math.cos(r)*o,c=Math.sin(r)*o,h=Math.random()*4+2,f=Math.random()*.03+.02;this.particles.push(new gi(e,t,l,c,"#8b5a2b",h,1,f,"splinter"))}if(!i)for(let a=0;a<4;a++)this.particles.push(new gi(e+(Math.random()-.5)*10,t+(Math.random()-.5)*10,(Math.random()-.5)*.8,(Math.random()-.5)*.8,"rgba(140, 130, 120, 0.2)",Math.random()*12+8,1,.02,"smoke"))}spawnFlashbangBurst(e,t){const i=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,s=i?8:30;for(let a=0;a<s;a++){const r=Math.random()*Math.PI*2,o=Math.random()*7+3,l=Math.cos(r)*o,c=Math.sin(r)*o,h=Math.random()*4+2,f=Math.random()*.03+.02;this.particles.push(new gi(e,t,l,c,Math.random()>.3?"#ffffff":"#66fcf1",h,1,f,"spark"))}if(!i)for(let a=0;a<10;a++){const r=Math.random()*Math.PI*2,o=Math.random()*2.5,l=Math.cos(r)*o,c=Math.sin(r)*o;this.particles.push(new gi(e,t,l,c,"rgba(255, 255, 255, 0.4)",Math.random()*20+10,1,.015,"smoke"))}}spawnDashParticles(e,t,i,s="cyan"){const a=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,o={cyan:"#66fcf1",green:"#5eff39",purple:"#c47aff",orange:"#ff9d7a",yellow:"#ffea70",red:"#ff7a7a"}[s]||"#66fcf1",l=i+Math.PI,c=a?2:12;for(let f=0;f<c;f++){const d=l+(Math.random()-.5)*.6,u=Math.random()*2.5+1.2,p=Math.cos(d)*u,v=Math.sin(d)*u,g=Math.random()*7+4,m=Math.random()*.05+.03;this.particles.push(new gi(e,t,p,v,"rgba(200, 200, 200, 0.18)",g,1,m,"smoke"))}const h=a?3:18;for(let f=0;f<h;f++){const d=i+(Math.random()-.5)*.7,u=Math.random()*8+4,p=Math.cos(d)*u,v=Math.sin(d)*u,g=Math.random()*2.5+1,m=Math.random()*.06+.04;this.particles.push(new gi(e,t,p,v,o,g,1,m,"spark"))}}}class Px{constructor(){this.ctx=null,this.masterVolume=null,this.volume=.5,this.noiseBuffer=null,this.shotgunBuffer=null,this.taskAlarms=new Map,this.bearMusic=null}init(){if(this.ctx)return;const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.masterVolume=this.ctx.createGain(),this.masterVolume.gain.value=this.volume,this.masterVolume.connect(this.ctx.destination);const t=this.ctx.sampleRate*2,i=this.ctx.createBuffer(1,t,this.ctx.sampleRate),s=i.getChannelData(0);for(let a=0;a<t;a++)s[a]=Math.random()*2-1;this.noiseBuffer=i,fetch("/dennish18-shotgun.mp3").then(a=>a.arrayBuffer()).then(a=>this.ctx.decodeAudioData(a)).then(a=>{this.shotgunBuffer=a}).catch(a=>console.error("Error loading shotgun sound:",a)),this._buildReverb()}_buildReverb(){if(!this.ctx||this.reverbNode)return;const e=Math.floor(this.ctx.sampleRate*.9),t=this.ctx.createBuffer(2,e,this.ctx.sampleRate);for(let i=0;i<2;i++){const s=t.getChannelData(i);for(let a=0;a<e;a++)s[a]=(Math.random()*2-1)*Math.pow(1-a/e,2.2)}this.reverbNode=this.ctx.createConvolver(),this.reverbNode.buffer=t,this.reverbGain=this.ctx.createGain(),this.reverbGain.gain.value=.28,this.reverbNode.connect(this.reverbGain),this.reverbGain.connect(this.masterVolume)}setVolume(e){this.volume=e,this.masterVolume&&(this.masterVolume.gain.value=e),this.bearMusic&&(this.bearMusic.volume=e*.3)}playGunshot(e,t=0){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const i=this.ctx.currentTime;let s=this.masterVolume;if(t>0){const m=this.ctx.createBiquadFilter();m.type="lowpass";const M=Math.max(220,4500*Math.pow(1-Math.min(1,t/1300),1.5));m.frequency.setValueAtTime(M,i);const _=Math.max(.01,Math.pow(1-Math.min(1,t/1400),1.2)),x=this.ctx.createGain();x.gain.setValueAtTime(_,i),m.connect(x),x.connect(this.masterVolume),s=m}const a=this.ctx.createBufferSource();a.buffer=this.noiseBuffer;const r=this.ctx.createBiquadFilter(),o=this.ctx.createGain();a.connect(r),r.connect(o),o.connect(s);const l=this.ctx.createOscillator(),c=this.ctx.createGain();l.connect(c),c.connect(s);let h=1e3,f=.1,d=.6,u=150,p=40,v=.08,g=.5;switch(e){case"pistol":h=1200,f=.12,d=.5,u=180,p=50,v=.06,g=.3;break;case"rifle":h=800,f=.18,d=.6,u=140,p=40,v=.1,g=.5;break;case"shotgun":if(this.shotgunBuffer)try{const m=this.ctx.createBufferSource();m.buffer=this.shotgunBuffer;const M=this.ctx.createGain();M.gain.setValueAtTime(.9,i),m.connect(M),M.connect(s),m.start(i);return}catch(m){console.error("Error playing custom shotgun audio:",m)}h=500,f=.35,d=.9,u=120,p=30,v=.25,g=.9,this.playMetallicClick(i+.05,800,.08,.3,t),this.playMetallicClick(i+.1,600,.05,.3,t);break;case"sniper":h=1500,f=.6,d=1,u=220,p=30,v=.4,g=1;break;case"knife":h=2e3,f=.12,d=.45,u=100,p=100,v=.01,g=0;break;case"vector":h=1600,f=.08,d=.42,u=200,p=80,v=.05,g=.25;break;case"famas":h=1e3,f=.14,d=.55,u=160,p=50,v=.09,g=.42;break;case"plasma":{h=3e3,f=.18,d=.3,u=600,p=120,v=.18,g=.55;try{const m=this.ctx.createOscillator(),M=this.ctx.createGain();m.type="sawtooth",m.frequency.setValueAtTime(800,i),m.frequency.exponentialRampToValueAtTime(200,i+.15),M.gain.setValueAtTime(.08,i),M.gain.exponentialRampToValueAtTime(.001,i+.15),m.connect(M),M.connect(s),m.start(i),m.stop(i+.17)}catch{}break}case"railgun":{h=600,f=.55,d=1,u=320,p=18,v=.45,g=1;try{const m=this.ctx.createOscillator(),M=this.ctx.createGain();m.type="square",m.frequency.setValueAtTime(180,i),m.frequency.exponentialRampToValueAtTime(40,i+.3),M.gain.setValueAtTime(.15,i),M.gain.exponentialRampToValueAtTime(.001,i+.3),m.connect(M),M.connect(s),m.start(i),m.stop(i+.32)}catch{}break}}r.type="bandpass",r.frequency.setValueAtTime(h,i),o.gain.setValueAtTime(d,i),o.gain.exponentialRampToValueAtTime(.001,i+f),l.type="sine",l.frequency.setValueAtTime(u,i),l.frequency.exponentialRampToValueAtTime(p,i+v),c.gain.setValueAtTime(g,i),c.gain.exponentialRampToValueAtTime(.001,i+v),a.start(i),a.stop(i+f+.05),l.start(i),l.stop(i+v+.05)}playReload(e){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime;e==="pistol"?(this.playMetallicClick(t,2e3,.05,.3),this.playMetallicClick(t+.4,1500,.08,.4),this.playMetallicClick(t+.5,2200,.04,.3)):e==="rifle"?(this.playMetallicClick(t,1800,.06,.3),this.playFrictionalScrape(t+.3,.2,.2),this.playMetallicClick(t+1.2,1200,.1,.5),this.playMetallicClick(t+1.35,2e3,.05,.4),this.playMetallicClick(t+1.8,1400,.08,.5),this.playMetallicClick(t+1.9,1e3,.08,.4)):e==="shotgun"?(this.playMetallicClick(t,1200,.06,.4),this.playFrictionalScrape(t+.05,.15,.3),this.playMetallicClick(t+.2,1800,.04,.4)):e==="sniper"&&(this.playMetallicClick(t,1400,.08,.4),this.playMetallicClick(t+.1,1e3,.06,.3),this.playMetallicClick(t+.5,900,.1,.4),this.playMetallicClick(t+.65,1200,.05,.3),this.playMetallicClick(t+1.2,1500,.1,.4),this.playMetallicClick(t+1.35,1800,.05,.3),this.playMetallicClick(t+1.9,1100,.08,.4),this.playMetallicClick(t+2.05,1600,.06,.4))}playDryFire(){this.init(),this.ctx&&this.playMetallicClick(this.ctx.currentTime,3e3,.03,.25)}playFootstep(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.setValueAtTime(220,e);const s=this.ctx.createGain();s.gain.setValueAtTime(.08,e),s.gain.exponentialRampToValueAtTime(.001,e+.1),t.connect(i),i.connect(s),s.connect(this.masterVolume),t.start(e),t.stop(e+.12)}playHitMarker(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(1600,e),i.gain.setValueAtTime(.15,e),i.gain.exponentialRampToValueAtTime(.001,e+.08),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.1)}playCriticalHitMarker(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(2300,e),i.gain.setValueAtTime(.25,e),i.gain.exponentialRampToValueAtTime(.001,e+.14),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.16)}playFleshHit(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.setValueAtTime(350,e);const s=this.ctx.createGain();s.gain.setValueAtTime(.35,e),s.gain.exponentialRampToValueAtTime(.001,e+.1),t.connect(i),i.connect(s),s.connect(this.masterVolume),t.start(e),t.stop(e+.12)}playCrateBreak(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.setValueAtTime(300,e);const s=this.ctx.createGain();s.gain.setValueAtTime(.7,e),s.gain.exponentialRampToValueAtTime(.001,e+.3),t.connect(i),i.connect(s),s.connect(this.masterVolume);const a=this.ctx.createBufferSource();a.buffer=this.noiseBuffer;const r=this.ctx.createBiquadFilter();r.type="highpass",r.frequency.setValueAtTime(2e3,e);const o=this.ctx.createGain();o.gain.setValueAtTime(.2,e),o.gain.exponentialRampToValueAtTime(.001,e+.15),a.connect(r),r.connect(o),o.connect(this.masterVolume),t.start(e),t.stop(e+.35),a.start(e),a.stop(e+.2)}playPickup(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(587.33,e),t.frequency.setValueAtTime(880,e+.08),i.gain.setValueAtTime(.12,e),i.gain.setValueAtTime(.12,e+.08),i.gain.exponentialRampToValueAtTime(.001,e+.25),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.28)}playMatchWin(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=(i,s,a,r)=>{const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="triangle",o.frequency.setValueAtTime(i,s),l.gain.setValueAtTime(r,s),l.gain.exponentialRampToValueAtTime(.001,s+a),o.connect(l),l.connect(this.masterVolume),o.start(s),o.stop(s+a+.05)};t(523.25,e,.4,.2),t(659.25,e+.15,.4,.2),t(783.99,e+.3,.4,.2),t(1046.5,e+.45,.6,.25)}playMatchLose(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=(i,s,a,r)=>{const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sawtooth",o.frequency.setValueAtTime(i,s);const c=this.ctx.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(500,s),l.gain.setValueAtTime(r,s),l.gain.exponentialRampToValueAtTime(.001,s+a),o.connect(c),c.connect(l),l.connect(this.masterVolume),o.start(s),o.stop(s+a+.05)};t(220,e,.5,.2),t(207.65,e+.2,.5,.2),t(196,e+.4,.5,.2),t(146.83,e+.6,.8,.25)}playMetallicClick(e,t,i,s=.3,a=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const r=typeof e=="number"&&e<10?Math.max(0,e):0,o=this.ctx.currentTime+r,l=this.ctx.createOscillator(),c=this.ctx.createGain();let h=this.masterVolume;if(a>0){const f=this.ctx.createBiquadFilter();f.type="lowpass";const d=Math.max(220,3e3*(1-Math.min(1,a/1200)));f.frequency.setValueAtTime(d,o);const u=this.ctx.createGain(),p=Math.max(.01,1-a/1300);u.gain.setValueAtTime(p,o),f.connect(u),u.connect(this.masterVolume),h=f}l.connect(c),c.connect(h),l.type="square",l.frequency.setValueAtTime(t,o),l.frequency.exponentialRampToValueAtTime(t*.5,o+i),c.gain.setValueAtTime(s,o),c.gain.exponentialRampToValueAtTime(.001,o+i),l.start(o),l.stop(o+i+.01)}catch{}}playFrictionalScrape(e,t,i=.2){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const s=typeof e=="number"&&e<10?Math.max(0,e):0,a=this.ctx.currentTime+s,r=this.ctx.createBufferSource();r.buffer=this.noiseBuffer;const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(800,a),o.frequency.exponentialRampToValueAtTime(1400,a+t);const l=this.ctx.createGain();l.gain.setValueAtTime(i,a),l.gain.linearRampToValueAtTime(i*.5,a+t*.5),l.gain.exponentialRampToValueAtTime(.001,a+t),r.connect(o),o.connect(l),l.connect(this.masterVolume),r.start(a),r.stop(a+t+.02)}catch{}}playFlashbangExplosion(e=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime,i=this.ctx.createOscillator(),s=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(160,t),i.frequency.exponentialRampToValueAtTime(10,t+.3);const a=Math.max(.1,1-e/1100);s.gain.setValueAtTime(.85*a,t),s.gain.exponentialRampToValueAtTime(.001,t+.35),i.connect(s),s.connect(this.masterVolume),i.start(t),i.stop(t+.4);const r=this.ctx.createOscillator(),o=this.ctx.createGain();r.type="sine",r.frequency.setValueAtTime(4500,t);const l=.35*Math.max(.01,1-e/700);o.gain.setValueAtTime(l,t),o.gain.linearRampToValueAtTime(l*.5,t+1),o.gain.exponentialRampToValueAtTime(.001,t+2.5),r.connect(o),o.connect(this.masterVolume),r.start(t),r.stop(t+2.6)}catch{}}playDashSound(e=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime,i=this.ctx.createOscillator(),s=this.ctx.createGain();let a=this.masterVolume;if(e>0){const r=this.ctx.createBiquadFilter();r.type="lowpass";const o=Math.max(220,3e3*(1-Math.min(1,e/1200)));r.frequency.setValueAtTime(o,t);const l=this.ctx.createGain(),c=Math.max(.01,1-e/1300);l.gain.setValueAtTime(c,t),r.connect(l),l.connect(this.masterVolume),a=r}i.connect(s),s.connect(a),i.type="sine",i.frequency.setValueAtTime(800,t),i.frequency.exponentialRampToValueAtTime(150,t+.2),s.gain.setValueAtTime(.35,t),s.gain.exponentialRampToValueAtTime(.001,t+.22),i.start(t),i.stop(t+.25)}catch{}}playAlarmForTask(e,t=0){if(this.init(),!this.ctx)return;if(this.ctx.state==="suspended"&&this.ctx.resume(),this.taskAlarms.has(e)){this.taskAlarms.get(e).distance=t;return}const i={intervalId:null,nodes:[],active:!0,distance:t};this.taskAlarms.set(e,i);const s=()=>{if(!i.active||!this.ctx)return;const a=i.distance,r=700,o=Math.max(0,Math.pow(1-Math.min(1,a/r),2.8)),l=Math.max(150,4e3*Math.pow(1-Math.min(1,a/r),2.5)),c=this.ctx.currentTime,h=this.ctx.createGain();h.gain.setValueAtTime(0,c),h.gain.linearRampToValueAtTime(o*.55,c+.04),h.gain.setValueAtTime(o*.55,c+.32),h.gain.linearRampToValueAtTime(0,c+.42);const f=this.ctx.createBiquadFilter();f.type="lowpass",f.frequency.setValueAtTime(l,c),f.Q.value=.9;const d=this.ctx.createOscillator();d.type="sawtooth",d.frequency.setValueAtTime(880,c),d.frequency.linearRampToValueAtTime(660,c+.2),d.frequency.linearRampToValueAtTime(880,c+.4);const u=this.ctx.createOscillator();u.type="square",u.frequency.setValueAtTime(1100,c),u.frequency.linearRampToValueAtTime(880,c+.2),u.frequency.linearRampToValueAtTime(1100,c+.4);const p=this.ctx.createGain();p.gain.value=.35;const v=this.ctx.createWaveShaper(),g=new Float32Array(256);for(let m=0;m<256;m++){const M=m*2/256-1;g[m]=(Math.PI+180)*M/(Math.PI+180*Math.abs(M))}if(v.curve=g,v.oversample="2x",d.connect(v),u.connect(p),p.connect(v),v.connect(f),f.connect(h),h.connect(this.masterVolume),this.reverbNode&&t<900){const m=this.ctx.createGain();m.gain.value=Math.max(0,.4*(1-t/900)),h.connect(m),m.connect(this.reverbNode)}d.start(c),u.start(c),d.stop(c+.45),u.stop(c+.45),i.nodes.push(d,u,h,f)};s(),i.intervalId=setInterval(s,600)}stopAlarmForTask(e){const t=this.taskAlarms.get(e);t&&(t.active=!1,t.intervalId!==null&&clearInterval(t.intervalId),t.nodes.forEach(i=>{try{i.stop&&i.stop()}catch{}}),this.taskAlarms.delete(e))}stopAllAlarms(){this.taskAlarms.forEach((e,t)=>this.stopAlarmForTask(t)),this.taskAlarms.clear()}playBearMusic(){this.bearMusic||(this.bearMusic=new Audio("/bear.mp3"),this.bearMusic.loop=!0),this.bearMusic.volume=this.volume*.3,this.bearMusic.paused&&(this.bearMusic.currentTime=0,this.bearMusic.play().catch(e=>console.warn("Error playing bear music:",e)))}stopBearMusic(){this.bearMusic&&(this.bearMusic.pause(),this.bearMusic.currentTime=0)}playHighBeep(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(2e3,e),t.frequency.exponentialRampToValueAtTime(3e3,e+.15),i.gain.setValueAtTime(.2,e),i.gain.exponentialRampToValueAtTime(.001,e+.2),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.22)}}class Ix{constructor(e,t,i,s,a,r,o){this.socket=e,this.localPlayer=t,this.opponent=i,this.map=s,this.particles=a,this.sound=r,this.engine=o,this.opponentStateBuffers=new Map,this.interpolationDelay=100,this.lastSentTime=0,this.sendInterval=1e3/60,window.AppSocket=this.socket,this.socket&&this.setupListeners()}setupListeners(){this.socket.on("opponent-state",e=>{if(!e.id)return;const t=this.engine.remotePlayers.get(e.id);if(!t)return;e.justDashed&&(t.justDashed=!0),e.droppedItem&&this.engine.spawnItemAt(e.droppedItem.x,e.droppedItem.y,e.droppedItem.type,e.droppedItem.id),e.health!==void 0&&(t.health=e.health);let i=this.opponentStateBuffers.get(e.id);i||(i=[],this.opponentStateBuffers.set(e.id,i)),i.push({time:Date.now(),x:e.x,y:e.y,angle:e.angle,vx:e.vx,vy:e.vy,health:e.health,weaponKey:e.weaponKey,isReloading:e.isReloading,muzzleFlash:e.muzzleFlash,flashlightActive:e.flashlightActive,inVent:e.inVent||!1}),i.length>30&&i.shift()}),this.socket.on("opponent-shoot",e=>{const t=this.engine.remotePlayers.get(e.playerId);if(t){if(t.muzzleFlash=1,t.angle=e.angle,this.particles.spawnGunCasing(t.x,t.y,t.angle,e.weaponKey),this.sound){const i=Math.hypot(t.x-this.localPlayer.x,t.y-this.localPlayer.y);this.sound.playGunshot(e.weaponKey,i)}this.engine.spawnBulletFromNetwork(e)}}),this.socket.on("damage-taken",e=>{if(this.engine.gameState==="playing"&&e.targetId===this.localPlayer.id){this.localPlayer.takeDamage(e.damage,this.sound);const i=this.engine.devCheatActive?Math.round(this.localPlayer.health/2):this.localPlayer.health;this.socket.emit("sync-health",{playerId:this.localPlayer.id,health:i}),this.engine.shakeCamera(e.damage*.45),this.engine.players.some(a=>a.health>0&&a.team===this.localPlayer.team)||this.socket.emit("player-died",{winnerId:e.shooterId,winnerName:"Opponents",loserId:this.localPlayer.id,roundNumber:this.engine.roundNumber})}}),this.socket.on("opponent-health-sync",e=>{const t=this.engine.remotePlayers.get(e.playerId);t&&(t.health=e.health)}),this.socket.on("opponent-break-crate",e=>{this.map.syncBreakCrate(e.crateId,e.spawnedItem),this.sound&&this.sound.playCrateBreak(),this.particles.spawnCrateSplinters(e.crateX||0,e.crateY||0)}),this.socket.on("opponent-pickup-item",e=>{const t=this.map.items.find(i=>i.id===e.itemId);t&&(t.active=!1,this.sound&&this.sound.playPickup())}),this.socket.on("opponent-sabotage-alarm",e=>{if(this.engine&&this.engine.tasks){const t=this.engine.tasks[e.idx];if(t&&(t.status="completed",t.alarmActive=!0,t.alarmTimer=15,this.sound)){const i=Math.hypot(this.localPlayer.x-t.x,this.localPlayer.y-t.y);try{this.sound.playAlarmForTask(t.id,i)}catch{}}}}),this.socket.on("opponent-chat",e=>{let t=e.name;const i=this.engine.remotePlayers.get(e.id);i&&(t=i.name);const s=new CustomEvent("opponent-chat-msg",{detail:{name:t,msg:e.msg}});window.dispatchEvent(s)}),this.socket.on("round-over",e=>{this.engine.handleServerRoundOver(e)}),this.socket.on("match-over",e=>{this.engine.handleServerMatchOver(e)})}sendState(e){var t;if(!(!((t=this.socket)!=null&&t.connected)||this.engine.networkPaused)&&e-this.lastSentTime>=this.sendInterval){this.lastSentTime=e;const s=this.engine.devCheatActive?Math.round(this.localPlayer.health/2):this.localPlayer.health,a={x:this.localPlayer.x,y:this.localPlayer.y,angle:this.localPlayer.angle,vx:this.localPlayer.vx,vy:this.localPlayer.vy,health:s,weaponKey:this.localPlayer.weaponKey,isReloading:this.localPlayer.isReloading,muzzleFlash:this.localPlayer.muzzleFlash,flashlightActive:this.localPlayer.flashlightActive,inVent:this.localPlayer.inVent||!1,justDashed:this.localPlayer.networkJustDashed||!1,droppedItem:this.localPlayer.networkDroppedItem||null};this.localPlayer.networkJustDashed=!1,this.localPlayer.networkDroppedItem=null,(a.justDashed||a.droppedItem?this.socket:this.socket.volatile).emit("player-state",a)}}sendShoot(e){var t;(t=this.socket)!=null&&t.connected&&!this.engine.networkPaused&&this.socket.emit("shoot",e)}resetInterpolation(){this.opponentStateBuffers.clear(),this.lastInterpolateTime=0,this.lastSentTime=0}interpolateOpponents(){const e=Date.now();this.lastInterpolateTime||(this.lastInterpolateTime=e);const t=e-this.lastInterpolateTime;this.lastInterpolateTime=e;const s=Math.max(1,Math.min(100,t))/16.67;this.engine.remotePlayers.forEach((a,r)=>{const o=this.opponentStateBuffers.get(r);if(!a||!o||o.length===0)return;const c=Date.now()-this.interpolationDelay;let h=null,f=null;for(let d=0;d<o.length;d++){const u=o[d];if(u.time<=c)h=u;else{f=u;break}}if(h&&f){const d=f.time-h.time,u=d>0?(c-h.time)/d:0;a.x=h.x+(f.x-h.x)*u,a.y=h.y+(f.y-h.y)*u,a.angle=this.lerpAngle(h.angle,f.angle,u),a.vx=h.vx+(f.vx-h.vx)*u,a.vy=h.vy+(f.vy-h.vy)*u,a.weaponKey=h.weaponKey,a.isReloading=h.isReloading,a.muzzleFlash=h.muzzleFlash,a.flashlightActive=h.flashlightActive,a.inVent=h.inVent||!1}else{const d=o[o.length-1],p=1-Math.pow(1-.25,s);a.x+=(d.x-a.x)*p,a.y+=(d.y-a.y)*p,a.angle=this.lerpAngle(a.angle,d.angle,p),a.vx=d.vx,a.vy=d.vy,a.weaponKey=d.weaponKey,a.isReloading=d.isReloading,a.muzzleFlash=d.muzzleFlash,a.flashlightActive=d.flashlightActive,a.inVent=d.inVent||!1}})}lerpAngle(e,t,i){let s=t-e;for(;s<-Math.PI;)s+=Math.PI*2;for(;s>Math.PI;)s-=Math.PI*2;return e+s*i}destroy(){this.socket&&(this.socket.off("opponent-state"),this.socket.off("opponent-shoot"),this.socket.off("damage-taken"),this.socket.off("opponent-health-sync"),this.socket.off("opponent-break-crate"),this.socket.off("opponent-pickup-item"),this.socket.off("opponent-sabotage-alarm"),this.socket.off("opponent-chat"),this.socket.off("round-over"),this.socket.off("match-over"))}}const Lx=26,Dx=18,jt=1e-6,Eh=new WeakMap,gl=Object.freeze([{dx:1,dy:0,cost:1,bit:1},{dx:-1,dy:0,cost:1,bit:2},{dx:0,dy:1,cost:1,bit:4},{dx:0,dy:-1,cost:1,bit:8}]),Id=Object.freeze([{dx:1,dy:1,cost:Math.SQRT2,bit:16},{dx:-1,dy:1,cost:Math.SQRT2,bit:32},{dx:1,dy:-1,cost:Math.SQRT2,bit:64},{dx:-1,dy:-1,cost:Math.SQRT2,bit:128}]),Nx=Object.freeze([...gl,...Id]);function Yi(n,e,t){return Math.max(e,Math.min(t,Number(n)||0))}function Xe(n,e=0){const t=Number(n);return Number.isFinite(t)?t:e}function ro(n){let e=0,t=n&255;for(;t;)t&=t-1,e++;return e}function yl(n,e,t,i){const s=Yi(n,i.x,i.x+i.w),a=Yi(e,i.y,i.y+i.h),r=n-s,o=e-a;return r*r+o*o<t*t-jt}function kx(n,e,t,i,s,a){const r=s.x-a,o=s.x+s.w+a,l=s.y-a,c=s.y+s.h+a,h=t-n,f=i-e;let d=0,u=1;const p=(v,g)=>{if(Math.abs(g)<jt)return v<=0;const m=v/g;if(g>0){if(m>u)return!1;m>d&&(d=m)}else{if(m<d)return!1;m<u&&(u=m)}return!0};return p(r-n,h)&&p(n-o,-h)&&p(l-e,f)&&p(e-c,-f)&&d<=u}function Ux(n){if(n.length===0)return[];const e=n.map(([i,s])=>[Math.min(i,s),Math.max(i,s)]).sort((i,s)=>i[0]-s[0]||i[1]-s[1]),t=[e[0].slice()];for(let i=1;i<e.length;i++){const s=e[i],a=t[t.length-1];s[0]<=a[1]+jt?a[1]=Math.max(a[1],s[1]):t.push(s.slice())}return t}function Fx(n,e,t){let i=2166136261;for(const s of[Math.round(n*10),Math.round(e*10),t|0])i^=s,i=Math.imul(i,16777619);return(i>>>0)/4294967296}function Ld(n,e,t,i,s,a){const r=s-t,o=a-i,l=r*r+o*o;if(l<jt)return Math.hypot(n-t,e-i);const c=Yi(((n-t)*r+(e-i)*o)/l,0,1);return Math.hypot(n-(t+r*c),e-(i+o*c))}function Bx(n,e,t,i,s,a){return kx(n,e,t,i,a,0)||yl(n,e,s,a)||yl(t,i,s,a)?!0:[[a.x,a.y],[a.x+a.w,a.y],[a.x+a.w,a.y+a.h],[a.x,a.y+a.h]].some(([o,l])=>Ld(o,l,n,e,t,i)<s-jt)}class Gs{constructor(){this.values=[]}get size(){return this.values.length}push(e){const t=this.values;t.push(e);let i=t.length-1;for(;i>0;){const s=i-1>>1;if(!Gs.before(t[i],t[s]))break;[t[i],t[s]]=[t[s],t[i]],i=s}}pop(){const e=this.values;if(e.length===0)return null;const t=e[0],i=e.pop();if(e.length>0){e[0]=i;let s=0;for(;;){const a=s*2+1,r=a+1;let o=s;if(a<e.length&&Gs.before(e[a],e[o])&&(o=a),r<e.length&&Gs.before(e[r],e[o])&&(o=r),o===s)break;[e[s],e[o]]=[e[o],e[s]],s=o}}return t}static before(e,t){return e.f<t.f||e.f===t.f&&(e.h<t.h||e.h===t.h&&e.index<t.index)}}class Ox{constructor(e,t=[],i={}){if(!e)throw new TypeError("BotNavigation requires a map");this.map=e,this.cellSize=Yi(i.cellSize||Lx,24,28),this.agentRadius=Math.max(1,Xe(i.agentRadius,Dx)),this.obstacleRevision=-1,this.cols=0,this.rows=0,this.walkable=new Uint8Array(0),this.components=new Int32Array(0),this.neighborMask=new Uint8Array(0),this.componentCount=0,this.rooms=[],this.connections=[],this.doorways=[],this.deadEnds=[],this.deadEndRooms=[],this.spawns=[],this.safePatrolPoints=[],this.coverCandidates=[],this._spawnInputs=[],this.sync(t)}sync(e=this._spawnInputs){Array.isArray(e)&&(this._spawnInputs=e.map(i=>({...i})));const t=Number.isFinite(this.map.navigationRevision)?this.map.navigationRevision:0;return(t!==this.obstacleRevision||this.cols!==Math.ceil(this.map.width/this.cellSize)||this.rows!==Math.ceil(this.map.height/this.cellSize))&&(this.obstacleRevision=t,this._rebuild()),this._syncSpawns(),this}isPointClear(e,t,i=this.agentRadius){return this._ensureCurrent(),this._pointClear(Xe(e),Xe(t),Math.max(0,Xe(i,this.agentRadius)))}hasClearPath(e,t,i,s,a=this.agentRadius){return this._ensureCurrent(),this._segmentClear(Xe(e),Xe(t),Xe(i),Xe(s),Math.max(0,Xe(a,this.agentRadius)))}projectPoint(e,t,i=this.agentRadius){return this._ensureCurrent(),this._projectPointInternal(Xe(e),Xe(t),Math.max(0,Xe(i,this.agentRadius)))}findPath(e,t,i,s,a={}){this._ensureCurrent();const r=Math.max(0,Xe(a.radius,this.agentRadius)),o=this._normalizeAvoidPoints(a.avoidPoints,a.avoidRadius,a.avoidWeight),l=this._projectPointInternal(Xe(e),Xe(t),r);if(!l)return[];const c=this._projectPointInternal(Xe(i),Xe(s),r,l.component);if(!c||l.component!==c.component)return[];if(this._segmentClear(l.x,l.y,c.x,c.y,r)&&!this._segmentTouchesAvoidance(l.x,l.y,c.x,c.y,o))return this._dedupePath([l,c]);const h=this.walkable.length,f=new Float64Array(h);f.fill(Number.POSITIVE_INFINITY);const d=new Int32Array(h);d.fill(-1);const u=new Uint8Array(h),p=new Gs;f[l.index]=0;const v=this._heuristic(l.index,c.index);p.push({index:l.index,f:v,h:v});const g=Math.max(1,Math.floor(Xe(a.maxIterations,h*4)));let m=0,M=!1;const _=r<=this.agentRadius+jt;for(;p.size>0&&m++<g;){const P=p.pop();if(!P||u[P.index])continue;if(P.index===c.index){M=!0;break}u[P.index]=1;const C=P.index%this.cols,I=Math.floor(P.index/this.cols),z=_?this.neighborMask[P.index]:0;for(const N of Nx){if(_&&!(z&N.bit))continue;const L=C+N.dx,U=I+N.dy;if(!_&&!this._cellInBounds(L,U))continue;const B=this._index(L,U);if(u[B])continue;if(!_){if(!this._cellWalkable(B,r))continue;if(N.dx!==0&&N.dy!==0){const pe=this._index(C+N.dx,I),Re=this._index(C,I+N.dy);if(!this._cellWalkable(pe,r)||!this._cellWalkable(Re,r))continue}const de=this._pointForIndex(P.index),xe=this._pointForIndex(B);if(!this._segmentClear(de.x,de.y,xe.x,xe.y,r))continue}const Y=this._avoidanceCost(B,o);if(!Number.isFinite(Y))continue;const Q=f[P.index]+N.cost+Y;if(Q+jt>=f[B])continue;f[B]=Q,d[B]=P.index;const ne=this._heuristic(B,c.index);p.push({index:B,f:Q+ne,h:ne})}}if(!M)return[];const x=[];let y=c.index;for(;y!==-1&&(x.push(y),y!==l.index);)y=d[y];if(x[x.length-1]!==l.index)return[];x.reverse();const E=[l];for(let P=1;P<x.length-1;P++)E.push(this._pointForIndex(x[P]));E.push(c);const A=a.smooth===!1?E:this._smoothPath(E,r,o),S=this._dedupePath(A);if(this._pathClear(S,r))return S;const w=this._dedupePath(E);return this._pathClear(w,r)?w:[]}choosePatrolPoint(e,t,i){this._ensureCurrent();const s=this._projectPointInternal(Xe(e),Xe(t),this.agentRadius);if(!s)return null;let a=this.safePatrolPoints.filter(c=>c.component===s.component);const r=a.filter(c=>Math.hypot(c.x-s.x,c.y-s.y)>=this.cellSize*2);if(r.length>0&&(a=r),a.length===0)return{...s};const o=typeof i=="function"?Xe(i(),0):Number.isFinite(Number(i))?Number(i):Fx(s.x,s.y,this.obstacleRevision),l=Math.min(a.length-1,Math.floor(Yi(o,0,.999999999)*a.length));return{...a[l]}}findCoverPoint(e,t,i,s,a={}){this._ensureCurrent();const r=Math.max(0,Xe(a.radius,this.agentRadius)),o=this._projectPointInternal(Xe(e),Xe(t),r);if(!o)return null;const l=Math.max(this.cellSize,Xe(a.maxDistance,650)),c=Math.max(0,Xe(a.minThreatDistance,60)),h=Math.max(0,Xe(a.preferredDistance,180)),f=a.claimed||[],d=Math.max(0,Xe(a.claimRadius,this.cellSize*1.5)),u=[];for(const p of this.coverCandidates){if(p.component!==o.component||!this._pointClear(p.x,p.y,r)||this._coverClaimed(p,f,d))continue;const v=Math.hypot(p.x-o.x,p.y-o.y);if(v>l)continue;const g=Math.hypot(p.x-i,p.y-s);if(g<c)continue;const m=this.map.getLineIntersection({x:Xe(i),y:Xe(s)},{x:p.x,y:p.y});if(!m||m.dist>=g-Math.max(2,r*.35))continue;const M=v+Math.abs(g-h)*.18;u.push({candidate:p,score:M})}u.sort((p,v)=>p.score-v.score||p.candidate.index-v.candidate.index);for(const p of u.slice(0,16)){const v=this.findPath(o.x,o.y,p.candidate.x,p.candidate.y,{radius:r,smooth:a.smooth!==!1,avoidPoints:a.avoidPoints,avoidRadius:a.avoidRadius,avoidWeight:a.avoidWeight});if(v.length>0)return{...p.candidate,path:v}}return null}snapshot(){return this._ensureCurrent(),{cellSize:this.cellSize,agentRadius:this.agentRadius,cols:this.cols,rows:this.rows,obstacleRevision:this.obstacleRevision,componentCount:this.componentCount,memory:{walkable:this.walkable.slice(),components:this.components.slice(),neighborMask:this.neighborMask.slice()},rooms:this.rooms.map(e=>({...e})),connections:this.connections.map(e=>({...e,rooms:[...e.rooms]})),doorways:this.doorways.map(e=>({...e,rooms:[...e.rooms]})),deadEnds:this.deadEnds.map(e=>({...e})),deadEndRooms:[...this.deadEndRooms],spawns:this.spawns.map(e=>({...e})),safePatrolPoints:this.safePatrolPoints.map(e=>({...e})),coverCandidates:this.coverCandidates.map(e=>({...e}))}}_ensureCurrent(){(Number.isFinite(this.map.navigationRevision)?this.map.navigationRevision:0)!==this.obstacleRevision&&this.sync(this._spawnInputs)}_rebuild(){this.cols=Math.ceil(this.map.width/this.cellSize),this.rows=Math.ceil(this.map.height/this.cellSize);const e=this.cols*this.rows;this.walkable=new Uint8Array(e),this.components=new Int32Array(e),this.components.fill(-1),this.neighborMask=new Uint8Array(e),this.rooms=(this.map.rooms||[]).map((t,i)=>({index:i,x:t.x,y:t.y,w:t.w,h:t.h,name:t.name||`Room ${i+1}`,floor:t.floor||""}));for(let t=0;t<this.rows;t++)for(let i=0;i<this.cols;i++){const s=this._index(i,t),a=this._pointForCell(i,t);this._pointClear(a.x,a.y,this.agentRadius)&&(this.walkable[s]=1)}this._buildComponentsAndNeighbors(),this._inferConnections(),this._buildDeadEnds(),this._buildPatrolPoints(),this._buildCoverCandidates()}_pointClear(e,t,i){if(e<i||t<i||e>this.map.width-i||t>this.map.height-i)return!1;for(const s of this.map.walls||[])if(yl(e,t,i,s))return!1;return!0}_segmentClear(e,t,i,s,a){if(!this._pointClear(e,t,a)||!this._pointClear(i,s,a))return!1;for(const r of this.map.walls||[])if(Bx(e,t,i,s,a,r))return!1;return!0}_index(e,t){return t*this.cols+e}_cellInBounds(e,t){return e>=0&&t>=0&&e<this.cols&&t<this.rows}_pointForCell(e,t){return{x:Math.min(this.map.width-this.agentRadius,(e+.5)*this.cellSize),y:Math.min(this.map.height-this.agentRadius,(t+.5)*this.cellSize)}}_pointForIndex(e){const t=e%this.cols,i=Math.floor(e/this.cols);return{...this._pointForCell(t,i),index:e,column:t,row:i,component:this.components[e],projected:!0}}_cellWalkable(e,t=this.agentRadius){if(e<0||e>=this.walkable.length||!this.walkable[e])return!1;if(t<=this.agentRadius+jt)return!0;const i=this._pointForIndex(e);return this._pointClear(i.x,i.y,t)}_locateWalkableCell(e,t,i,s=null){const a=Yi(Math.floor(e/this.cellSize),0,this.cols-1),r=Yi(Math.floor(t/this.cellSize),0,this.rows-1),o=this._index(a,r);if(this._cellWalkable(o,i)&&(s==null||this.components[o]===s))return o;let l=-1,c=Number.POSITIVE_INFINITY;for(let h=0;h<this.walkable.length;h++){if(!this._cellWalkable(h,i)||s!=null&&this.components[h]!==s)continue;const f=this._pointForIndex(h),d=(f.x-e)**2+(f.y-t)**2;(d<c-jt||Math.abs(d-c)<=jt&&h<l)&&(c=d,l=h)}return l}_projectPointInternal(e,t,i,s=null){const a=this._pointClear(e,t,i),r=this._locateWalkableCell(e,t,i,s);if(r===-1)return null;const o=this._pointForIndex(r),l=Yi(Math.floor(e/this.cellSize),0,this.cols-1),c=Yi(Math.floor(t/this.cellSize),0,this.rows-1),h=this._index(l,c);return a&&r===h&&(s==null||o.component===s)&&this._segmentClear(o.x,o.y,e,t,i)?{...o,x:e,y:t,projected:!1}:{...o,projected:!0}}_buildComponentsAndNeighbors(){let e=0;const t=new Int32Array(this.walkable.length);for(let i=0;i<this.walkable.length;i++){if(!this.walkable[i]||this.components[i]!==-1)continue;let s=0,a=0;for(t[a++]=i,this.components[i]=e;s<a;){const r=t[s++],o=r%this.cols,l=Math.floor(r/this.cols),c=this._pointForIndex(r);for(const h of gl){const f=o+h.dx,d=l+h.dy;if(!this._cellInBounds(f,d))continue;const u=this._index(f,d);if(!this.walkable[u]||this.components[u]!==-1)continue;const p=this._pointForIndex(u);this._segmentClear(c.x,c.y,p.x,p.y,this.agentRadius)&&(this.components[u]=e,t[a++]=u)}}e++}this.componentCount=e;for(let i=0;i<this.walkable.length;i++){if(!this.walkable[i])continue;const s=i%this.cols,a=Math.floor(i/this.cols);let r=0;for(const o of gl){const l=s+o.dx,c=a+o.dy;if(!this._cellInBounds(l,c))continue;const h=this._index(l,c);if(this.walkable[h]){const f=this._pointForIndex(i),d=this._pointForIndex(h);this._segmentClear(f.x,f.y,d.x,d.y,this.agentRadius)&&(r|=o.bit)}}for(const o of Id){const l=s+o.dx,c=a+o.dy;if(!this._cellInBounds(l,c))continue;const h=this._index(l,c),f=this._index(s+o.dx,a),d=this._index(s,a+o.dy);if(this.walkable[h]&&this.walkable[f]&&this.walkable[d]){const u=this._pointForIndex(i),p=this._pointForIndex(h);this._segmentClear(u.x,u.y,p.x,p.y,this.agentRadius)&&(r|=o.bit)}}this.neighborMask[i]=r}}_inferConnections(){this.connections=[],this.doorways=[];const e=this.cellSize*1.5;for(let t=0;t<this.rooms.length;t++)for(let i=t+1;i<this.rooms.length;i++){const s=this.rooms[t],a=this.rooms[i];let r="",o=0,l=0,c=0,h=0,f=s,d=a;const u=s.x+s.w,p=a.x+a.w,v=s.y+s.h,g=a.y+a.h,m=Math.max(s.y,a.y),M=Math.min(v,g),_=Math.max(s.x,a.x),x=Math.min(u,p);if(M>m&&(u<=a.x&&a.x-u<=e?(r="vertical",o=u,l=a.x,c=m,h=M):p<=s.x&&s.x-p<=e&&(r="vertical",o=p,l=s.x,c=m,h=M,f=a,d=s)),!r&&x>_&&(v<=a.y&&a.y-v<=e?(r="horizontal",o=v,l=a.y,c=_,h=x):g<=s.y&&s.y-g<=e&&(r="horizontal",o=g,l=s.y,c=_,h=x,f=a,d=s)),!r)continue;const y=(o+l)*.5,E=[];for(const P of this.map.walls||[])if(P.material==="interior")if(r==="vertical"){if(y<P.x-jt||y>P.x+P.w+jt)continue;const C=Math.max(c,P.y),I=Math.min(h,P.y+P.h);I>C&&E.push([C,I])}else{if(y<P.y-jt||y>P.y+P.h+jt)continue;const C=Math.max(c,P.x),I=Math.min(h,P.x+P.w);I>C&&E.push([C,I])}const A=Ux(E),S=[];let w=c;for(const[P,C]of A)P-w>=this.agentRadius*2+2&&S.push([w,P]),w=Math.max(w,C);h-w>=this.agentRadius*2+2&&S.push([w,h]);for(const[P,C]of S){const I=r==="vertical"?{x:y,y:(P+C)*.5}:{x:(P+C)*.5,y},z=this.agentRadius+3,N=r==="vertical"?{x:f.x+f.w-z,y:I.y}:{x:I.x,y:f.y+f.h-z},L=r==="vertical"?{x:d.x+z,y:I.y}:{x:I.x,y:d.y+z},U=this._pointClear(I.x,I.y,this.agentRadius)&&this._segmentClear(N.x,N.y,L.x,L.y,this.agentRadius),B={id:`door-${t}-${i}-${this.doorways.length}`,rooms:[t,i],orientation:r,x:I.x,y:I.y,width:C-P,thickness:l-o,gapStart:P,gapEnd:C,traversable:U,blocked:!U};this.doorways.push(B),this.connections.push({...B})}}}_buildDeadEnds(){this.deadEnds=[];for(let t=0;t<this.walkable.length;t++){if(!this.walkable[t])continue;const i=this.neighborMask[t]&15;ro(i)<=1&&this.deadEnds.push(this._pointForIndex(t))}const e=new Uint8Array(this.rooms.length);for(const t of this.connections)t.traversable&&(e[t.rooms[0]]++,e[t.rooms[1]]++);this.deadEndRooms=[...e].map((t,i)=>({degree:t,index:i})).filter(({degree:t})=>t<=1).map(({index:t})=>t)}_buildPatrolPoints(){this.safePatrolPoints=[];for(const e of this.rooms){const t=[];for(let s=0;s<this.walkable.length;s++){if(!this.walkable[s]||ro(this.neighborMask[s])<5)continue;const a=this._pointForIndex(s);if(a.x<e.x+this.agentRadius||a.x>e.x+e.w-this.agentRadius||a.y<e.y+this.agentRadius||a.y>e.y+e.h-this.agentRadius)continue;const r=Math.hypot(a.x-(e.x+e.w*.5),a.y-(e.y+e.h*.5));t.push({...a,roomIndex:e.index,centerDistance:r})}t.sort((s,a)=>s.centerDistance-a.centerDistance||s.index-a.index);const i=[];for(const s of t){if(i.every(a=>Math.hypot(a.x-s.x,a.y-s.y)>=this.cellSize*2.5)){const{centerDistance:a,...r}=s;i.push(r)}if(i.length>=6)break}if(i.length===0){const s=this._projectPointInternal(e.x+e.w*.5,e.y+e.h*.5,this.agentRadius);s&&i.push({...s,roomIndex:e.index})}this.safePatrolPoints.push(...i)}}_buildCoverCandidates(){const e=new Set,t=[],i=this.agentRadius+7;for(let s=0;s<(this.map.walls||[]).length;s++){const a=this.map.walls[s];for(const r of[.25,.5,.75]){const o=a.x+a.w*r,l=a.y+a.h*r,c=[{x:o,y:a.y-i,side:"north"},{x:o,y:a.y+a.h+i,side:"south"},{x:a.x-i,y:l,side:"west"},{x:a.x+a.w+i,y:l,side:"east"}];for(const h of c){if(!this._pointClear(h.x,h.y,this.agentRadius))continue;const f=this._locateWalkableCell(h.x,h.y,this.agentRadius);if(f===-1||e.has(f)||ro(this.neighborMask[f])<3)continue;e.add(f);const d=this._pointForIndex(f);if(t.push({...d,wallIndex:s,wallType:a.type||"wall",material:a.material||"",side:h.side}),t.length>=640)break}if(t.length>=640)break}if(t.length>=640)break}this.coverCandidates=t}_syncSpawns(){this.spawns=[];for(let e=0;e<this._spawnInputs.length;e++){const t=this._spawnInputs[e]||{},i=this._projectPointInternal(Xe(t.x),Xe(t.y),this.agentRadius);i&&this.spawns.push({...t,index:t.index??e,x:i.x,y:i.y,cellIndex:i.index,component:i.component,projected:i.projected})}}_heuristic(e,t){const i=e%this.cols,s=Math.floor(e/this.cols),a=t%this.cols,r=Math.floor(t/this.cols),o=Math.abs(i-a),l=Math.abs(s-r);return Math.max(o,l)+(Math.SQRT2-1)*Math.min(o,l)}_smoothPath(e,t,i=[]){if(e.length<=2)return e;const s=[e[0]];let a=0;for(;a<e.length-1;){let r=a+1;for(let o=e.length-1;o>a+1;o--)if(this._segmentClear(e[a].x,e[a].y,e[o].x,e[o].y,t)&&!this._segmentTouchesAvoidance(e[a].x,e[a].y,e[o].x,e[o].y,i)){r=o;break}s.push(e[r]),a=r}return s}_dedupePath(e){const t=[];for(const i of e){const s=t[t.length-1];s&&Math.hypot(s.x-i.x,s.y-i.y)<jt||t.push({...i})}return t}_pathClear(e,t){for(let i=1;i<e.length;i++)if(!this._segmentClear(e[i-1].x,e[i-1].y,e[i].x,e[i].y,t))return!1;return!0}_normalizeAvoidPoints(e,t,i){if(!Array.isArray(e))return[];const s=Math.max(1,Xe(t,this.cellSize*1.35)),a=Math.max(0,Xe(i,12));return e.filter(r=>r&&Number.isFinite(Number(r.x))&&Number.isFinite(Number(r.y))).map(r=>({x:Number(r.x),y:Number(r.y),radius:Math.max(1,Xe(r.radius,s)),weight:Math.max(0,Xe(r.weight,a)),hard:r.hard===!0}))}_avoidanceCost(e,t){if(t.length===0)return 0;const i=this._pointForIndex(e);let s=0;for(const a of t){const r=Math.hypot(i.x-a.x,i.y-a.y);if(!(r>=a.radius)){if(a.hard)return Number.POSITIVE_INFINITY;s+=(1-r/a.radius)*a.weight}}return s}_segmentTouchesAvoidance(e,t,i,s,a){return a.some(r=>Ld(r.x,r.y,e,t,i,s)<r.radius)}_coverClaimed(e,t,i){if(t instanceof Set){if(t.has(e.index)||t.has(String(e.index))||t.has(`${e.x},${e.y}`))return!0;for(const s of t)if(s&&typeof s=="object"&&Number.isFinite(Number(s.x))&&Number.isFinite(Number(s.y))&&Math.hypot(e.x-Number(s.x),e.y-Number(s.y))<i)return!0;return!1}return Array.isArray(t)?t.some(s=>Number(s)===e.index?!0:s&&Number.isFinite(Number(s.x))&&Number.isFinite(Number(s.y))&&Math.hypot(e.x-Number(s.x),e.y-Number(s.y))<i):!1}}function zx(n,e){if(!n||typeof n!="object"&&typeof n!="function")throw new TypeError("getBotNavigation requires a map object");let t=Eh.get(n);return t?t.sync(e):(t=new Ox(n,e),Eh.set(n,t)),t}class Th{constructor(e,t,i,s,a){this.x=e,this.y=t,this.vx=i,this.vy=s,this.throwerId=a,this.radius=6,this.friction=.98,this.bounceFriction=.6,this.timer=1200,this.creationTime=performance.now(),this.active=!0}update(e,t){if(t-this.creationTime>=this.timer){this.active=!1;return}this.vx*=this.friction,this.vy*=this.friction;const s=this.x+this.vx,a=this.y+this.vy,r=e.checkCircleCollision(s,a,this.radius);if(r.x!==s||r.y!==a){const o=e.checkCircleCollision(s,this.y,this.radius),l=e.checkCircleCollision(this.x,a,this.radius);o.x!==s&&(this.vx=-this.vx*this.bounceFriction),l.y!==a&&(this.vy=-this.vy*this.bounceFriction),this.x=r.x,this.y=r.y}else this.x=s,this.y=a}draw(e){e.save(),e.beginPath(),e.arc(this.x,this.y,this.radius,0,Math.PI*2),e.fillStyle="#2d332f",e.strokeStyle="#66fcf1",e.lineWidth=1.5,e.fill(),e.stroke(),Math.floor(performance.now()/150)%2===0&&(e.beginPath(),e.arc(this.x,this.y,2,0,Math.PI*2),e.fillStyle="#ff3c3c",e.fill()),e.restore()}}class Qa{constructor(e,t){try{this.canvas=document.getElementById(e),this.ctx=this.canvas.getContext("2d"),this.mode=t.mode,this.socket=t.socket,this.networkPaused=!1,this.networkPausedAt=0,this.isRanked=!!t.isRanked,this.mapWidth=t.mapId==="arena"?900:1400,this.mapHeight=t.mapId==="arena"?900:1400,this.map=new Rx(this.mapWidth,this.mapHeight,t.seed,t.mapId),this.sound=new Px,this.sound.setVolume(t.settings.volume!==void 0?t.settings.volume:.5),this.particles=new Cx,this.particles.setBloodEnabled(t.settings.blood);let i=!1;const s=t.matchMode||t.mode||"";if(this.matchMode=s,this.qpRenderStyle=t.qpRenderStyle,this.isRanked?s.includes("competitive")&&(i=!0):t.qpRenderStyle==="competitive"&&(i=!0),this.settings={...t.settings},this.matchMode==="sabotage"?(this.settings.performanceMode=!1,this.settings.shadows=!0):i?(this.settings.performanceMode=!0,this.settings.shadows=!1):(this.settings.performanceMode=!1,this.settings.shadows=!0),yn.init().catch(r=>console.warn("[Engine] CharacterRenderer init failed:",r)),window.LocalPlayerId=t.localPlayerId,window.IsOfflineMode=this.mode==="offline",this.spawns=[{x:150,y:150},{x:this.mapWidth-150,y:this.mapHeight-150},{x:150,y:this.mapHeight-150},{x:this.mapWidth-150,y:150}],this.botNavigation=null,this.players=[],this.localPlayer=null,this.remotePlayers=new Map,(t.players||[{id:t.localPlayerId,name:t.localPlayerName,weapon:t.localWeapon,color:t.localColor}]).forEach((r,o)=>{const l=this.spawns[o%this.spawns.length],c=r.id===t.localPlayerId,h=o%2===0?1:2,f=this.mode==="offline"&&!c,d=new Ax(r.id,l.x,l.y,r.name,r.weapon||"pistol",r.color||"cyan",c,f);if(d.team=h,c)this.localPlayer=d,this.localPlayerIndex=o;else{const u=t.localPlayerIndex!==void 0?t.localPlayerIndex:0;d.isTeammate=o%2===u%2,this.remotePlayers.set(r.id,d)}this.players.push(d)}),this.botBlackboards=yh(this.players,performance.now()),this.bullets=[],this.grenades=[],this.activeHitmarkers=[],this.floatingNumbers=[],this.replayFrames=[],this.lastSnapshotTime=0,this.devCheatActive=!1,this.vents=[],this.tasks=[],this.activeTask=null,this.ventCooldown=0,this.currentVent=null,this.sweepAngle=0,this.sweepProgress=0,this.network=null,this.mode==="online"&&(this.network=new Ix(this.socket,this.localPlayer,null,this.map,this.particles,this.sound,this),this.socket.on("opponent-throw-grenade",r=>{const o=new Th(r.x,r.y,r.vx,r.vy,r.playerId);this.grenades.push(o);const l=Math.hypot(this.localPlayer.x-r.x,this.localPlayer.y-r.y);this.sound.playMetallicClick(0,1500,.08,.2,l)})),window.MatchStats={roundsWon:0,damageDealt:0,shotsFired:0,accuracy:0,hitsRegistered:0},this.onMatchEnd=t.onMatchEnd,this.onKillFeed=t.onKillFeed,this.lastKillTime=0,this.multiKillCount=0,this.combatBanner=null,this.camera={x:this.localPlayer.x,y:this.localPlayer.y,shakeX:0,shakeY:0},this.cameraShake=0,this.zoom=1,this.gameState="warmup",this.roundNumber=1,this.scoreSelf=0,this.scoreOpponent=0,this.countdownTimer=3,this.matchTime=120,this.lastTime=performance.now(),this.roundStartTime=0,this.countdownStart=0,this.matchTimerInterval=null,window.gameEngine=this,this.fpsFrameCount=0,this.fpsLastTick=performance.now(),this.currentFPS=0,this.keys={},this.mouse={x:0,y:0,gameX:0,gameY:0,angle:0,clicked:!1,buttons:{}},this.lastSprintTime=performance.now(),this.sprintTipVisible=!1,this.zone={active:!1,currentRadius:0,targetRadius:0,centerX:this.mapWidth/2,centerY:this.mapHeight/2,shrinkSpeed:0,damage:20,lastDamageTick:0,warnShown:!1},this.zoneTimer=null,this.resizeCanvas(),this.setupControls(),this.startRoundCycle(),this.active=!0,document.hidden&&this.setNetworkPaused(!0),this.loop(),this.localPlayer.updateHUD(),this.updateScoreboardHUD(),this.matchMode==="sabotage"){const r=document.querySelector(".score-display");r&&(r.style.display="none");const o=document.querySelector(".timer-display");o&&(o.style.display="none");const l=document.querySelector(".bars-container.right-aligned");l&&(l.style.display="none");const c=document.querySelector(".opponent-weapon-display");c&&(c.style.display="none");const h=document.querySelector(".ammo-display");h&&(h.style.display="none");const f=document.querySelector(".inventory-display");f&&(f.style.display="none")}this.mode==="offline"&&(window.OnBotShootCallback=r=>{const o=this.players.find(l=>l.id===r.playerId);o&&this.particles.spawnGunCasing(o.x,o.y,o.angle,r.weaponKey),this.spawnBulletFromNetwork(r)})}catch(i){console.error("Engine Constructor Error:",i);try{const s=document.getElementById(e),a=s.getContext("2d");a.fillStyle="rgba(10, 10, 15, 0.95)",a.fillRect(0,0,s.width,s.height),a.fillStyle="#ff3c3c",a.font="bold 20px monospace",a.fillText("TACTICSTRIKE CONSTRUCTOR ERROR DETECTED",20,50),a.fillStyle="#ffffff",a.font="12px monospace";const r=(i.stack||i.toString()).split(`
`);let o=90;r.forEach(l=>{a.fillText(l,20,o),o+=18})}catch{}throw i}}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}setupControls(){this.resizeHandler=()=>this.resizeCanvas(),window.addEventListener("resize",this.resizeHandler),this.keydownHandler=s=>{if(this.networkPaused)return;const a=document.getElementById("chat-input");if(a&&document.activeElement===a)return;if(this.activeMinigame){s.preventDefault(),s.key==="Escape"?this.cancelHackingMinigame():this.handleMinigameKeyPress(s.key.toLowerCase());return}const r=s.key.toLowerCase()==="i",o=s.key==="9";if(r&&this.keys[9]||o&&this.keys.i){this.devCheatActive=!this.devCheatActive,this.devCheatActive&&this.localPlayer?(this.localPlayer.maxHealth=200,this.localPlayer.health=200):this.localPlayer&&(this.localPlayer.maxHealth=100,this.localPlayer.health>100&&(this.localPlayer.health=100));return}if(this.matchMode==="sabotage"&&this.localPlayer&&this.localPlayer.health>0){if(this.localPlayer.inVent&&this.currentVent){if(s.key>="1"&&s.key<="5"){s.preventDefault();const l=parseInt(s.key)-1,c=this.vents[l];if(c&&c.id!==this.currentVent.id){this.localPlayer.x=c.x,this.localPlayer.y=c.y,this.currentVent=c;try{this.sound.playFrictionalScrape(0,.3,.4)}catch{}}}else if(s.key===" "||s.key==="Spacebar"){s.preventDefault(),this.localPlayer.inVent=!1,this.currentVent=null;try{this.sound.playFrictionalScrape(0,.2,.3)}catch{}}return}if(this.activeTask){if(s.key===" "||s.key==="Spacebar"){s.preventDefault();const l=Math.abs(Math.sin(this.sweepAngle));if(l>=.4&&l<=.6){this.sweepProgress=Math.min(100,this.sweepProgress+20);try{this.sound.playMetallicClick(0,2e3,.08,.35)}catch{}if(this.sweepProgress>=100){const c=this.activeTask;c.status="completed",c.alarmActive=!0,c.alarmTimer=15,this.activeTask=null,this.localPlayer.showTextNotification("TASK COMPLETE! 🚨 ALARM TRIGGERED");const h=Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y);try{this.sound.playAlarmForTask(c.id,h)}catch{}if(this.matchMode==="sabotage"&&this.tasks.every(d=>d.status==="completed")){if(this.mode==="offline")this.endRound(1,"tasks completed");else if(this.localPlayer.team===1&&this.socket){const d=this.players.find(u=>u.team===2);d&&this.socket.emit("player-died",{winnerId:this.localPlayer.id,winnerName:this.localPlayer.name,loserId:d.id,roundNumber:this.roundNumber})}}}}else{this.sweepProgress=Math.max(0,this.sweepProgress-10);try{this.sound.playMetallicClick(0,500,.15,.25)}catch{}}}else(s.key==="Escape"||s.key.toLowerCase()==="f")&&this.activeTask&&(this.activeTask.status="pending",this.activeTask=null);return}if(s.key.toLowerCase()==="e"){const l=this.vents.find(c=>Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y)<50);if(l){if(this.ventCooldown>0)this.localPlayer.showTextNotification(`VENT COOLDOWN: ${this.ventCooldown.toFixed(1)}s`);else{this.localPlayer.inVent=!0,this.currentVent=l,this.ventCooldown=10;try{this.sound.playFrictionalScrape(0,.2,.35)}catch{}}return}}if(s.key.toLowerCase()==="f"){const l=this.tasks.find(c=>c.status==="pending"&&Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y)<40);if(l){this.activeTask=l,l.status="doing",this.sweepProgress=0,this.sweepAngle=0;return}}}if(s.key===" "&&s.preventDefault(),this.keys[s.key.toLowerCase()]=!0,s.key.toLowerCase()==="f"&&this.localPlayer&&this.localPlayer.health>0){this.localPlayer.flashlightActive=!this.localPlayer.flashlightActive;try{this.sound.playMetallicClick(0,1800,.05,.15)}catch{}}if(this.localPlayer&&this.localPlayer.health>0){if(s.key.toLowerCase()==="h"&&this.localPlayer.healthPacks>0){this.localPlayer.healthPacks--;const l=this.spawnItemAt(this.localPlayer.x,this.localPlayer.y,"health");this.localPlayer.showTextNotification("DROPPED HEALTH PACK","#ff6ef7"),this.localPlayer.updateHUD(),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:l,x:this.localPlayer.x,y:this.localPlayer.y,type:"health"})}if(s.key.toLowerCase()==="j"&&this.localPlayer.ammoPacks>0){this.localPlayer.ammoPacks--;const l=this.spawnItemAt(this.localPlayer.x,this.localPlayer.y,"ammo");this.localPlayer.showTextNotification("DROPPED AMMO PACK","#ff6ef7"),this.localPlayer.updateHUD(),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:l,x:this.localPlayer.x,y:this.localPlayer.y,type:"ammo"})}}s.key==="1"&&this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(1),s.key==="2"&&this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(2),s.key==="3"&&this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)},this.keyupHandler=s=>{this.keys[s.key.toLowerCase()]=!1},window.addEventListener("keydown",this.keydownHandler),window.addEventListener("keyup",this.keyupHandler),this.mousemoveHandler=s=>{if(this.mouse.x=s.clientX,this.mouse.y=s.clientY,this.firstPersonMode)this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.angle+=s.movementX*.0025);else{const a=this.mouse.x-this.canvas.width/2,r=this.mouse.y-this.canvas.height/2;this.mouse.angle=Math.atan2(r,a)}},this.mousedownHandler=s=>{if(this.networkPaused)return;if(this.mouse.buttons[s.button]=!0,s.button===0){const o=document.getElementById("chat-input");if(o&&document.activeElement===o||s.target.closest("#btn-game-menu")||s.target.closest(".inv-slot")||s.target.closest("button")||s.target.closest("input")||s.target.closest(".inventory-display"))return;this.mouse.clicked=!0,this.firstPersonMode&&(document.pointerLockElement===document.getElementById("game-container")||this.requestPointerLock())}const a=s.button===1,r=s.button===2;(a&&this.mouse.buttons[2]||r&&this.mouse.buttons[1])&&(this.devCheatActive=!this.devCheatActive,this.devCheatActive&&this.localPlayer?(this.localPlayer.maxHealth=200,this.localPlayer.health=200):this.localPlayer&&(this.localPlayer.maxHealth=100,this.localPlayer.health>100&&(this.localPlayer.health=100)))},this.mouseupHandler=s=>{this.mouse.buttons[s.button]=!1,s.button===0&&(this.mouse.clicked=!1)},this.wheelHandler=s=>{const a=document.getElementById("chat-input");a&&document.activeElement===a||this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)},window.addEventListener("mousemove",this.mousemoveHandler),window.addEventListener("mousedown",this.mousedownHandler),window.addEventListener("mouseup",this.mouseupHandler),window.addEventListener("wheel",this.wheelHandler,{passive:!0}),this.contextmenuHandler=s=>{s.preventDefault()},window.addEventListener("contextmenu",this.contextmenuHandler),this.invSlot1Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(1)},this.invSlot2Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(2)},this.invSlot3Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)};const e=document.getElementById("inv-slot-1"),t=document.getElementById("inv-slot-2"),i=document.getElementById("inv-slot-3");e&&e.addEventListener("click",this.invSlot1Handler),t&&t.addEventListener("click",this.invSlot2Handler),i&&i.addEventListener("click",this.invSlot3Handler),this.setupGamepad(),this.pointerLockChangeHandler=()=>{const s=document.pointerLockElement===document.getElementById("game-container"),a=this.matchMode&&this.matchMode.startsWith("firstperson");!s&&this.firstPersonMode&&!a&&this.toggleFirstPersonMode()},document.addEventListener("pointerlockchange",this.pointerLockChangeHandler)}setupGamepad(){this._gpState={prevButtons:[],deadzone:.18,aimAngle:0,aimActive:!1,frameCount:0,cachedGP:null}}pollGamepad(){if(!navigator.getGamepads)return;const e=this._gpState;if(e.frameCount++,e.frameCount%2===0){const d=navigator.getGamepads();e.cachedGP=null;for(let u=0;u<d.length;u++)if(d[u]){e.cachedGP=d[u];break}}const t=e.cachedGP;if(!t||!this.localPlayer||this.localPlayer.health<=0)return;const i=e.deadzone,s=d=>t.buttons[d],a=d=>!!(s(d)&&s(d).pressed),r=d=>s(d)?s(d).value:0,o=d=>!!e.prevButtons[d],l=Math.abs(t.axes[0])>i?t.axes[0]:0,c=Math.abs(t.axes[1])>i?t.axes[1]:0;this.keys.w=c<-i,this.keys.s=c>i,this.keys.a=l<-i,this.keys.d=l>i,this.keys.shift=a(10);const h=Math.abs(t.axes[2])>i?t.axes[2]:0,f=Math.abs(t.axes[3])>i?t.axes[3]:0;if(Math.hypot(h,f)>i?(e.aimAngle=Math.atan2(f,h),e.aimActive=!0):e.aimActive=!1,e.aimActive&&(this.mouse.angle=e.aimAngle,this.localPlayer.angle=e.aimAngle),this.mouse.clicked=r(7)>.3,a(4)&&!o(4)&&this.localPlayer.switchSlot(1),a(5)&&!o(5)&&this.localPlayer.switchSlot(2),a(1)&&!o(1)&&(this.keys.r=!0,setTimeout(()=>{this.keys.r=!1},80)),this.keys[" "]=a(0),a(3)&&!o(3)){this.localPlayer.flashlightActive=!this.localPlayer.flashlightActive;try{this.sound.playMetallicClick(0,1800,.05,.15)}catch{}}a(2)&&!o(2)&&this.localPlayer.flashGrenades>0&&(this.localPlayer.throwFlashbangRequest=!0),e.prevButtons=Array.from(t.buttons).map(d=>!!(d&&d.pressed))}toggleFirstPersonMode(){if(this.matchMode&&this.matchMode.startsWith("firstperson")&&this.firstPersonMode){const s=document.getElementById("btn-toggle-fpm");s&&(s.style.display="none");const a=document.getElementById("game-canvas-3d");a&&(a.style.display="block",this.firstPersonController&&this.firstPersonController.onResize()),this.firstPersonController.active=!0,this.requestPointerLock();return}this.firstPersonMode=!this.firstPersonMode;const t=document.getElementById("btn-toggle-fpm"),i=document.getElementById("game-canvas-3d");this.firstPersonMode?(t&&t.classList.add("active"),i&&(i.style.display="block"),this.firstPersonController.active=!0,this.firstPersonController&&this.firstPersonController.onResize(),this.requestPointerLock()):(t&&t.classList.remove("active"),i&&(i.style.display="none"),this.firstPersonController.active=!1,this.exitPointerLock())}requestPointerLock(){const e=document.getElementById("game-container");e&&e.requestPointerLock&&e.requestPointerLock()}exitPointerLock(){document.exitPointerLock&&document.exitPointerLock()}destroy(){this.active=!1,window.removeEventListener("resize",this.resizeHandler),window.removeEventListener("keydown",this.keydownHandler),window.removeEventListener("keyup",this.keyupHandler),window.removeEventListener("mousemove",this.mousemoveHandler),window.removeEventListener("mousedown",this.mousedownHandler),window.removeEventListener("mouseup",this.mouseupHandler),window.removeEventListener("wheel",this.wheelHandler),window.removeEventListener("contextmenu",this.contextmenuHandler);const e=document.getElementById("inv-slot-1"),t=document.getElementById("inv-slot-2"),i=document.getElementById("inv-slot-3");if(e&&this.invSlot1Handler&&e.removeEventListener("click",this.invSlot1Handler),t&&this.invSlot2Handler&&t.removeEventListener("click",this.invSlot2Handler),i&&this.invSlot3Handler&&i.removeEventListener("click",this.invSlot3Handler),this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.zoneTimer&&(clearTimeout(this.zoneTimer),this.zoneTimer=null),this.sound){try{this.sound.stopAllAlarms()}catch{}try{this.sound.stopBearMusic()}catch{}}this.network&&this.network.destroy();const s=document.querySelector(".score-display");s&&(s.style.display="");const a=document.querySelector(".timer-display");a&&(a.style.display="");const r=document.querySelector(".bars-container.right-aligned");r&&(r.style.display="");const o=document.querySelector(".opponent-weapon-display");o&&(o.style.display="");const l=document.querySelector(".ammo-display");l&&(l.style.display="");const c=document.querySelector(".inventory-display");c&&(c.style.display=""),this.socket&&this.socket.off("opponent-throw-grenade"),this.particles.clear(),window.OnBotShootCallback=null,window.AppSocket=null}updateSettings(e){this.sound&&this.sound.setVolume(e.volume),this.particles&&this.particles.setBloodEnabled(e.blood);let t=!1;const i=this.matchMode||this.mode||"";this.isRanked?i.includes("competitive")&&(t=!0):this.qpRenderStyle==="competitive"&&(t=!0),this.settings={...e},this.matchMode==="sabotage"?(this.settings.performanceMode=!1,this.settings.shadows=!0):t?(this.settings.performanceMode=!0,this.settings.shadows=!1):(this.settings.performanceMode=!1,this.settings.shadows=!0)}shakeCamera(e){this.cameraShake=Math.max(this.cameraShake,e)}spawnBulletFromNetwork(e){if(e.pellets&&e.pellets>1)for(let t=0;t<e.pellets;t++)this.bullets.push(new Ia(e));else this.bullets.push(new Ia(e))}setNetworkPaused(e,t="Reconnecting… Match paused"){var r,o,l,c;if(e=!!e,this.networkPauseMessage=t,this.networkPaused===e)return;const i=performance.now();if(this.networkPaused=e,this.keys={},this.mouse&&(this.mouse.clicked=!1,this.mouse.buttons={}),e){this.networkPausedAt=i,(o=(r=this.sound)==null?void 0:r.stopAllAlarms)==null||o.call(r);return}const s=Math.max(0,i-this.networkPausedAt),a=(h,f)=>{for(const d of f)Number.isFinite(h==null?void 0:h[d])&&h[d]>0&&(h[d]+=s)};a(this,["roundStartTime","countdownStart","lastSprintTime","lastSnapshotTime"]),a(this.zone,["lastDamageTick"]);for(const h of this.players||[]){a(h,["reloadStartTime","lastFiredTime","lastDashTime","lastTrailSpawnTime","adrenalineEndTime","overdriveEndTime"]);for(const f of h.dashTrails||[])a(f,["time"]);h.lastUpdateTime=i}for(const h of this.grenades||[])a(h,["creationTime"]);this.lastUpdateTime=i,(c=(l=this.network)==null?void 0:l.resetInterpolation)==null||c.call(l)}startRoundCycle(){if(this.gameState="countdown",this.countdownTimer=3,this.countdownStart=performance.now(),this.map.generateMap(),this.mode==="offline"&&(this.botNavigation=zx(this.map,this.spawns)),this.botBlackboards=yh(this.players,this.countdownStart),this.matchMode==="sabotage"){this.vents=[{id:"vent_a",x:180,y:180,name:"North-West Vent"},{id:"vent_b",x:this.mapWidth-180,y:180,name:"North-East Vent"},{id:"vent_c",x:180,y:this.mapHeight-180,name:"South-West Vent"},{id:"vent_d",x:this.mapWidth-180,y:this.mapHeight-180,name:"South-East Vent"},{id:"vent_e",x:700,y:700,name:"Central Vent"}],this.ventCooldown=0,this.currentVent=null,this.activeTask=null,this.localPlayer&&(this.localPlayer.inVent=!1,this.localPlayer.weaponKey="none");const u=[];for(let m=0;m<9;m++){const M=this.map.rooms[m];M&&u.push({name:M.name||`Section ${m+1}`,x:Math.round(M.x+M.w/2),y:Math.round(M.y+M.h/2)})}u.push({name:"Central Corridors",x:700,y:700});const v=[...u].sort(()=>Math.random()-.5).slice(0,5),g=["Fix Wiring","Calibrate Core","Download Files","Clear Vent Filters","Stabilize Energy Grid","Align Antenna","Unlock Console","Refuel Engine","Inspect Sample","Reset Breakways"];this.tasks=v.map((m,M)=>({id:`task_r${this.roundNumber}_${M}`,x:m.x,y:m.y,name:g[M%g.length]+` in ${m.name}`,rawName:g[M%g.length],progress:0,targetProgress:100,status:"pending",alarmActive:!1,alarmTimer:0}))}this.lastSprintTime=performance.now(),this.sprintTipVisible=!1;const e=document.getElementById("sprint-tip-popup");e&&(e.style.display="none");const t=(this.map.seed||"default_seed")+"_"+this.roundNumber;let i=0;for(let u=0;u<t.length;u++)i=(i<<5)-i+t.charCodeAt(u),i|=0;const s=()=>(i=i*1664525+1013904223|0,(i>>>0)/4294967296),a={1:[this.spawns[0],this.spawns[2]],2:[this.spawns[1],this.spawns[3]]},r=s()<.5?0:1,o=s()<.5?0:1,l=vx(this.players,a,{1:r,2:o}),c=[],h=new Map;this.players.forEach(u=>{const p=l.get(String(u.id))||this.spawns[0];let v=p;if(this.botNavigation&&(v=_x(this.botNavigation,p,c,u.radius||18)||this.botNavigation.choosePatrolPoint(p.x,p.y,s)||this.botNavigation.projectPoint(p.x,p.y,u.radius||18)||p),c.push({x:v.x,y:v.y}),u.x=v.x,u.y=v.y,u.vx=0,u.vy=0,u.health=u.isLocal&&this.devCheatActive?200:100,u.ammoInMag=u.weapon.magSize,u.reserveAmmo=u.weapon.magSize*3,u.isReloading=!1,u.floatingText=null,u.isDeadLogged=!1,u.flashGrenades=1,u.flashAlpha=0,u.isBot){const g=h.get(u.team)||0;h.set(u.team,g+1),u.botLaneIndex=g,u.botLaneSign=g%2===0?-1:1,u.resetBotRound(this.map,this.botNavigation)}}),this.bullets=[],this.grenades=[],this.particles.clear(),this.localPlayer.updateHUD(),this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchTime=120;const f=document.getElementById("hud-status");f&&(f.innerText=`ROUND ${this.roundNumber} - COOLDOWN`),this.zoneTimer&&(clearTimeout(this.zoneTimer),this.zoneTimer=null);const d=Math.max(this.mapWidth,this.mapHeight)/2;this.zone.active=!1,this.zone.currentRadius=d*1.05,this.zone.targetRadius=d*1.05,this.zone.centerX=this.mapWidth/2,this.zone.centerY=this.mapHeight/2,this.zone.shrinkSpeed=0,this.zone.lastDamageTick=0,this.zone.warnShown=!1;try{this.sound.playFrictionalScrape(0,.5,.1)}catch{}}startRoundAction(){if(this.gameState="playing",this.roundStartTime=performance.now(),this.matchMode==="sabotage")try{this.sound.playBearMusic()}catch{}const e=document.getElementById("hud-status");e&&(e.innerText="ENGAGE TARGET"),this.updateRoundClock(this.roundStartTime)}updateRoundClock(e){if(this.networkPaused||this.gameState!=="playing"||this.matchMode==="sabotage")return;const t=Math.max(0,e-this.roundStartTime);this.matchTime=Math.max(0,Math.ceil(120-t/1e3));const i=document.getElementById("game-timer");if(i&&(i.innerText=`${Math.floor(this.matchTime/60).toString().padStart(2,"0")}:${(this.matchTime%60).toString().padStart(2,"0")}`),this.matchTime<=0){this.endRound(null,"TIME EXPIRED");return}if(t>=4e4&&!this.zone.active){const a=Math.max(this.mapWidth,this.mapHeight)/2;this.zone.active=!0,this.zone.currentRadius=a*1.05,this.zone.targetRadius=a*.12,this.zone.shrinkSpeed=(this.zone.currentRadius-this.zone.targetRadius)/(60*60),this.zone.lastDamageTick=e,this.zone.centerX=this.mapWidth/2,this.zone.centerY=this.mapHeight/2}const s=document.getElementById("hud-status");s&&t>=4e4&&t<42500?(s.innerText="⚠ ZONE CLOSING IN!",s.style.color="#ff3c3c"):s&&t>=42500&&s.innerText==="⚠ ZONE CLOSING IN!"&&(s.innerText="ENGAGE TARGET",s.style.color="")}endRound(e,t=""){if(this.gameState!=="playing")return;if(this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchMode==="sabotage")try{this.sound.stopBearMusic()}catch{}let i=document.getElementById("hud-status");const s=this.localPlayer.team;e===s?(this.scoreSelf++,this.matchMode==="sabotage"&&(this.scoreSelf=3),i&&(i.innerText="ROUND WON",i.style.color="#39ff14")):e!==null?(this.scoreOpponent++,this.matchMode==="sabotage"&&(this.scoreOpponent=3),i&&(i.innerText="ROUND LOST",i.style.color="#ff3c3c")):i&&(i.innerText="ROUND DRAW",i.style.color="#ffd700"),this.updateScoreboardHUD();const a=()=>{this.scoreSelf>=3||this.scoreOpponent>=3?this.endMatch():(this.roundNumber++,this.startRoundCycle())};setTimeout(()=>{this.active&&this.startReplay(a)},0)}endMatch(){this.gameState="match-over",this.active=!1;const e=window.MatchStats.shotsFired||1,t=window.MatchStats.hitsRegistered/e*100;window.MatchStats.accuracy=t,window.MatchStats.roundsWon=this.scoreSelf;const i=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent?this.localPlayer.team:this.localPlayer.team===1?2:1:this.scoreSelf>=3?this.localPlayer.team:this.localPlayer.team===1?2:1,s=this.players.find(c=>c.team===i);window.MatchStats.winnerId=s?s.id:"unknown";const a=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent:this.scoreSelf>=3,r=this.localPlayer.rank?this.localPlayer.rank.label:"";let o=!1,l=0;this.isRanked&&(o=this.localPlayer.applyRankDelta(a?Ca:Pa),l=a?Ca:Pa),window.MatchStats.isWin=a,window.MatchStats.newRP=this.localPlayer.rp,window.MatchStats.newRank=this.localPlayer.rank,window.MatchStats.rpDelta=l,window.MatchStats.rankChanged=o,window.MatchStats.oldRankLabel=r,this.scoreSelf>=3?this.sound.playMatchWin():this.sound.playMatchLose(),this.onMatchEnd&&this.onMatchEnd(window.MatchStats)}endGameDueToDisconnect(e){this.gameState="match-over",this.active=!1,alert(e);const t=document.getElementById("btn-return-lobby");t&&t.click()}updateScoreboardHUD(){const e=document.getElementById("score-self");e&&(e.innerText=this.scoreSelf);const t=document.getElementById("score-opponent");t&&(t.innerText=this.scoreOpponent);const i=document.getElementById("hud-self-name");i&&(i.innerText=this.mode==="online"&&this.players.length>2?"YOUR TEAM":this.localPlayer.name.toUpperCase());const s=document.getElementById("hud-opponent-name");s&&(s.innerText=this.players.length>2?"OPPONENTS":"OPPONENT");const a=document.getElementById("hud-opponent-weapon");if(a)if(this.players.length>2)a.innerText="SQUAD LOADOUT";else{const o=this.players.find(l=>l.id!==this.localPlayer.id);a.innerText=o?o.weapon.name.toUpperCase():"UNKNOWN"}const r=document.getElementById("opponent-indicator");r&&(r.className="op-indicator online")}drawErrorOverlay(e){try{this.ctx.restore()}catch{}this.ctx.fillStyle="rgba(10, 10, 15, 0.95)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="#ff3c3c",this.ctx.font="bold 20px monospace",this.ctx.fillText("TACTICSTRIKE RUNTIME ERROR DETECTED",20,50),this.ctx.fillStyle="#ffffff",this.ctx.font="12px monospace";const t=(e.stack||e.toString()).split(`
`);let i=90;t.forEach(s=>{const a=Math.floor((this.canvas.width-40)/7);for(let r=0;r<s.length;r+=a)this.ctx.fillText(s.substring(r,r+a),20,i),i+=18})}loop(){if(!this.active)return;const e=performance.now();if(this.lastTime=e,this.fpsFrameCount++,e-this.fpsLastTick>=1e3){this.currentFPS=Math.round(this.fpsFrameCount*1e3/(e-this.fpsLastTick)),this.fpsFrameCount=0,this.fpsLastTick=e;const t=document.getElementById("fps-counter");t&&this.settings&&this.settings.showFps&&(t.innerText=`FPS: ${this.currentFPS}`)}try{this.update(e),this.render()}catch(t){console.error("Game Loop Crash:",t),this.drawErrorOverlay(t),this.active=!1;return}requestAnimationFrame(()=>this.loop())}triggerHitmarker(e,t,i,s){this.activeHitmarkers.push({x:e,y:t,age:0,duration:200,isHeadshot:!!s}),this.floatingNumbers.push({x:e,y:t-10,damage:i,age:0,duration:800,isHeadshot:!!s})}registerLocalPlayerKill(e){if(e-this.lastKillTime<4e3?this.multiKillCount++:this.multiKillCount=1,this.lastKillTime=e,this.multiKillCount>=2){let t="DOUBLE KILL!";if(this.multiKillCount===3?t="TRIPLE KILL!":this.multiKillCount>3&&(t="RAMPAGE!"),this.combatBanner={text:t,timer:3,scale:2},this.sound)try{this.sound.playHighBeep()}catch(i){console.warn(i)}}}update(e){if(this.networkPaused){this.lastUpdateTime=e;return}this.updateRoundClock(e),this.lastUpdateTime||(this.lastUpdateTime=e);const t=e-this.lastUpdateTime;this.lastUpdateTime=e;const i=Math.max(1,Math.min(150,t));if(this.dtFactor=i/16.67,this.combatBanner&&(this.combatBanner.timer-=i/1e3,this.combatBanner.timer<=0&&(this.combatBanner=null)),this.activeMinigame){this.activeMinigame.timer-=i/1e3;const _=document.getElementById("minigame-timer-bar");_&&(_.style.width=`${Math.max(0,this.activeMinigame.timer/4*100)}%`),this.activeMinigame.timer<=0&&this.failHackingMinigame()}let s=null;this.map&&this.map.terminals&&this.localPlayer&&this.localPlayer.health>0&&(s=this.map.terminals.find(_=>!_.hacked&&Math.hypot(this.localPlayer.x-_.x,this.localPlayer.y-_.y)<55));const a=document.getElementById("hud-interaction-prompt");if(s&&this.gameState==="playing"?(a&&(a.style.display="block",a.innerText=this.keys.e?`HACKING... ${Math.round(this.hackingProgress)}%`:"HOLD [E] TO HACK TERMINAL"),this.keys.e&&!this.activeMinigame?(this.localPlayer.vx=0,this.localPlayer.vy=0,this.hackingProgress||(this.hackingProgress=0),this.hackingProgress+=i*.08,this.hackingProgress>=100&&(this.hackingProgress=0,this.startHackingMinigame(s))):this.activeMinigame||(this.hackingProgress=Math.max(0,(this.hackingProgress||0)-i*.1))):(a&&!this.activeMinigame&&(a.style.display="none"),this.hackingProgress=0),this.matchMode==="sabotage"&&(this.ventCooldown>0&&(this.ventCooldown=Math.max(0,this.ventCooldown-i/1e3)),this.activeTask&&(this.sweepAngle+=.06*this.dtFactor),this.tasks.forEach(_=>{if(_.alarmActive){_.alarmTimer-=i/1e3;const x=Math.hypot(this.localPlayer.x-_.x,this.localPlayer.y-_.y);try{this.sound.playAlarmForTask(_.id,x)}catch{}if(_.alarmTimer<=0){_.alarmActive=!1,_.lastBeepTime=0;try{this.sound.stopAlarmForTask(_.id)}catch{}}}else try{this.sound.stopAlarmForTask(_.id)}catch{}})),this.gameState==="replay"){if(this.replayIndex+=this.dtFactor,Math.floor(this.replayIndex)>=this.replayFrames.length&&this.postReplayCallback){const _=this.postReplayCallback;this.postReplayCallback=null,_()}return}if(this.pollGamepad(),this.gameState==="countdown"){const _=(e-this.countdownStart)/1e3,x=3-Math.floor(_);if(x!==this.countdownTimer&&x>=0){this.countdownTimer=x;try{this.sound.playMetallicClick(0,1e3,.05,.2)}catch{}}if(x>0){const y=document.getElementById("hud-status");y&&(y.innerText=`DEPLOYING IN ${x}...`)}else{try{this.sound.playMetallicClick(0,2e3,.15,.35)}catch{}this.startRoundAction()}}if(this.gameState==="playing"||this.gameState==="countdown"){if(this.localPlayer.update(this.keys,this.mouse,this.map,this.sound,e,null,this.localPlayer),this.localPlayer.justDashed&&(this.localPlayer.justDashed=!1,this.particles.spawnDashParticles(this.localPlayer.x,this.localPlayer.y,this.localPlayer.angle,this.localPlayer.colorTheme)),this.mode==="offline"){this.botNavigation&&this.map.navigationRevision!==this.botNavigation.obstacleRevision&&this.botNavigation.sync(this.spawns);const _=new Map,x=new Set(this.players.filter(y=>y.isBot&&y.health>0).map(y=>y.team));for(const y of x){const E=this.players.filter(w=>w.isBot&&w.health>0&&w.team===y),A=this.players.filter(w=>w.health>0&&w.team!==y),S=xh(this.botBlackboards,y);for(const[w,P]of mx(E,A,S,e))_.set(w,P)}this.players.forEach(y=>{if(y.isBot){const E=_.get(String(y.id))||null,A=this.players.filter(S=>S!==y&&S.health>0&&S.team===y.team);y.update(null,null,this.map,this.sound,e,E,this.localPlayer,{navigation:this.botNavigation,blackboard:xh(this.botBlackboards,y.team),teammates:A,laneIndex:y.botLaneIndex||0,combatEnabled:this.gameState==="playing"})}})}else this.network.interpolateOpponents();this.players.forEach(_=>{if(_!==this.localPlayer&&_.justDashed&&(_.justDashed=!1,this.particles.spawnDashParticles(_.x,_.y,_.angle,_.colorTheme),this.sound)){const x=Math.hypot(_.x-this.localPlayer.x,_.y-this.localPlayer.y);this.sound.playDashSound(x)}}),this.localPlayer.checkPickups(this.map,this.sound),this.mode==="offline"&&this.players.forEach(_=>{_.isBot&&_.checkPickups(this.map,this.sound)}),this.players.forEach(_=>{if(this.gameState==="playing"&&_.throwFlashbangRequest&&_.flashGrenades>0){_.throwFlashbangRequest=!1,_.flashGrenades--,_.isLocal&&!_.isBot&&_.updateHUD();const x=11,y=Math.cos(_.angle)*x,E=Math.sin(_.angle)*x,A=new Th(_.x,_.y,y,E,_.id);this.grenades.push(A);try{this.sound.playMetallicClick(0,1500,.08,.2)}catch{}this.mode==="online"&&_.isLocal&&this.socket.emit("throw-grenade",{x:_.x,y:_.y,vx:y,vy:E})}else _.throwFlashbangRequest=!1})}const r=this.devCheatActive&&this.localPlayer.aimbotHasLOS;if(this.gameState==="playing"&&(this.mouse.clicked||r)&&!this.localPlayer.isReloading){const _=this.localPlayer.weapon.type==="Automatic"||r,x=e-this.localPlayer.lastFiredTime;if(_||x>this.localPlayer.weapon.fireRate){const y=this.localPlayer.shoot(e,this.sound);if(y){if(window.MatchStats.shotsFired+=y.pellets||1,this.shakeCamera(y.recoil*.7),this.particles.spawnGunCasing(this.localPlayer.x,this.localPlayer.y,this.localPlayer.angle,this.localPlayer.weaponKey),y.pellets&&y.pellets>1)for(let E=0;E<y.pellets;E++)this.bullets.push(new Ia(y));else this.bullets.push(new Ia(y));this.mode==="online"&&this.network.sendShoot(y),_||(this.mouse.clicked=!1)}}}for(let _=this.bullets.length-1;_>=0;_--){const x=this.bullets[_];x.update(this.map,this.players,this.particles,this.sound,this.dtFactor),x.active||(x.playerId===this.localPlayer.id&&window.MatchStats.hitsRegistered++,this.bullets.splice(_,1))}for(let _=this.grenades.length-1;_>=0;_--){const x=this.grenades[_];if(x.update(this.map,e),!x.active){this.particles.spawnFlashbangBurst(x.x,x.y);const y=Math.hypot(this.localPlayer.x-x.x,this.localPlayer.y-x.y);this.sound.playFlashbangExplosion(y),y<800&&this.shakeCamera(Math.max(1,15*(1-y/800))),this.players.forEach(E=>{if(E.health<=0)return;Math.hypot(E.x-x.x,E.y-x.y)<380&&E.checkLineOfSight(this.map,x.x,x.y,E.x,E.y)&&(E.flashAlpha=1,E.isLocal&&E.updateHUD())}),this.grenades.splice(_,1)}}this.particles.update(this.map);for(let _=this.activeHitmarkers.length-1;_>=0;_--){const x=this.activeHitmarkers[_];x.age+=i,x.age>=x.duration&&this.activeHitmarkers.splice(_,1)}for(let _=this.floatingNumbers.length-1;_>=0;_--){const x=this.floatingNumbers[_];x.age+=i,x.y-=1*this.dtFactor,x.age>=x.duration&&this.floatingNumbers.splice(_,1)}this.players.forEach(_=>{_.health<=0&&!_.isDeadLogged&&(_.isDeadLogged=!0,this.onKillFeed&&this.onKillFeed("Eliminated",_.name,_.weaponKey))});const o=this.players.filter(_=>_.team===this.localPlayer.team),l=o.reduce((_,x)=>{let y=x.health;return x.isLocal&&this.devCheatActive&&(y=Math.round(y/2)),_+y},0)/o.length,c=document.getElementById("hud-self-hp");c&&(c.style.width=`${Math.max(0,l)}%`);const h=document.getElementById("hud-self-hp-text");h&&(h.innerText=Math.round(Math.max(0,l)));const f=this.localPlayer.team===1?2:1,d=this.players.filter(_=>_.team===f),u=d.reduce((_,x)=>_+x.health,0)/d.length,p=document.getElementById("hud-opponent-hp");if(p&&(p.style.width=`${Math.max(0,u)}%`),this.zone.active&&this.gameState==="playing"){this.zone.currentRadius>this.zone.targetRadius&&(this.zone.currentRadius=Math.max(this.zone.targetRadius,this.zone.currentRadius-this.zone.shrinkSpeed*this.dtFactor));const _=e;_-this.zone.lastDamageTick>=1e3&&(this.zone.lastDamageTick=_,this.players.forEach(x=>{if(x.health<=0||this.mode==="online"&&!x.isLocal)return;const y=x.x-this.zone.centerX,E=x.y-this.zone.centerY;if(Math.sqrt(y*y+E*E)>this.zone.currentRadius&&(x.takeDamage(this.zone.damage,this.sound),x.isLocal&&!x.isBot&&(x.showTextNotification&&x.showTextNotification("-20 ZONE DAMAGE"),this.mode==="online"&&this.socket))){const w=this.devCheatActive?Math.round(x.health/2):x.health;this.socket.emit("sync-health",{playerId:x.id,health:w})}}))}if(this.gameState==="playing"){const _=this.players.some(y=>y.health>0&&y.team===1),x=this.players.some(y=>y.health>0&&y.team===2);_&&!x?this.mode==="offline"&&this.endRound(1,"eliminated"):!_&&x?this.mode==="offline"&&this.endRound(2,"eliminated"):!_&&!x&&this.mode==="offline"&&this.endRound(null,"both dead")}this.gameState==="playing"&&this.players.forEach(_=>{if(_.health<=0||_.health>=_.maxHealth)return;const x=this.map.checkZone(_.x,_.y);x&&x.type==="healing"&&(_.health=Math.min(_.maxHealth,_.health+x.healRate),_.isLocal&&!_.isBot&&_.updateHUD())});const v=.25,g=this.localPlayer.x+(this.mouse.x-this.canvas.width/2)*v,m=this.localPlayer.y+(this.mouse.y-this.canvas.height/2)*v,M=1-Math.pow(1-.085,this.dtFactor);if(this.camera.x+=(g-this.camera.x)*M,this.camera.y+=(m-this.camera.y)*M,this.cameraShake>.1?(this.camera.shakeX=(Math.random()-.5)*this.cameraShake,this.camera.shakeY=(Math.random()-.5)*this.cameraShake,this.cameraShake*=Math.pow(.88,this.dtFactor)):(this.camera.shakeX=0,this.camera.shakeY=0,this.cameraShake=0),this.gameState==="playing"){const _=this.keys.shift,x=document.getElementById("sprint-tip-popup");_?(this.lastSprintTime=e,this.sprintTipVisible&&(this.sprintTipVisible=!1,x&&(x.style.display="none"))):this.localPlayer&&(Math.abs(this.localPlayer.vx)>.2||Math.abs(this.localPlayer.vy)>.2)?e-this.lastSprintTime>9e3&&(this.sprintTipVisible||(this.sprintTipVisible=!0,x&&(x.style.display="flex"))):this.lastSprintTime=e}if(this.mode==="online"&&(this.gameState==="playing"||this.gameState==="countdown")&&this.network.sendState(e),this.gameState==="playing"&&e-this.lastSnapshotTime>=1e3/60){this.lastSnapshotTime=e;const _={players:this.players.map(x=>({id:x.id,x:x.x,y:x.y,angle:x.angle,health:x.health,maxHealth:x.maxHealth,weaponKey:x.weaponKey,muzzleFlash:x.muzzleFlash,isLocal:x.isLocal,isBot:x.isBot,isTeammate:x.isTeammate,color:x.colorTheme,name:x.name,flashlightActive:x.flashlightActive,flashAlpha:x.flashAlpha,radius:x.radius})),bullets:this.bullets.map(x=>({x:x.x,y:x.y,prevX:x.prevX,prevY:x.prevY,angle:x.angle,playerId:x.playerId,active:x.active,weaponKey:x.weaponKey})),grenades:this.grenades.map(x=>({x:x.x,y:x.y})),particles:this.particles.particles.map(x=>({x:x.x,y:x.y,type:x.type,angle:x.angle,size:x.size,color:x.color,life:x.life})),decals:this.particles.decals.map(x=>({x:x.x,y:x.y,type:x.type,size:x.size,color:x.color,angle:x.angle,scaleX:x.scaleX,scaleY:x.scaleY})),camera:{x:this.camera.x,y:this.camera.y},brokenLightOn:this.map.ambientLights.brokenCeiling?this.map.ambientLights.brokenCeiling.on:!0};this.replayFrames.push(_),this.replayFrames.length>300&&this.replayFrames.shift()}}startReplay(e){const t=this.players.some(i=>i.health<=0);if(this.replayFrames&&this.replayFrames.length>0&&t){this.gameState="replay",this.replayIndex=0,this.postReplayCallback=e;const i=document.getElementById("hud-status");i&&(i.innerText="● REPLAY / KILLCAM",i.style.color="#ff3c3c")}else e()}drawSnapshotPlayer(e,t){if(this.ctx.save(),t){this.ctx.fillStyle="rgba(180, 0, 0, 0.35)",this.ctx.beginPath(),this.ctx.ellipse(e.x,e.y,26,22,0,0,Math.PI*2),this.ctx.fill(),yn.ready&&(this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle+Math.PI/2),this.ctx.globalAlpha=.55,yn.draw(this.ctx,e.id+"_dead",0,0,0,0,!1,e.isLocal?"blue":"red"),this.ctx.restore()),this.ctx.restore();return}if(this.settings.laser&&e.isLocal&&this.matchMode!=="sabotage"){let c=e.x+Math.cos(e.angle)*1200,h=e.y+Math.sin(e.angle)*1200;const f=this.map.getLineIntersection({x:e.x,y:e.y},{x:c,y:h});f&&(c=f.x,h=f.y),this.ctx.save(),this.ctx.strokeStyle=e.isLocal?"rgba(102, 252, 241, 0.5)":"rgba(255, 60, 60, 0.5)",this.ctx.lineWidth=1.2,this.ctx.beginPath(),this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(c,h),this.ctx.stroke();const d=e.isLocal?"#66fcf1":"#ff3c3c",u=this.ctx.createRadialGradient(c,h,1,c,h,6);u.addColorStop(0,"#ffffff"),u.addColorStop(.3,d),u.addColorStop(1,"rgba(0, 0, 0, 0)"),this.ctx.fillStyle=u,this.ctx.beginPath(),this.ctx.arc(c,h,6,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}const i=e.muzzleFlash>.1;if(!yn.draw(this.ctx,e.id,e.x,e.y,e.angle,0,i,e.isLocal?"blue":"red")){this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle);const l={cyan:{body:"#3ba39f",armor:"#16202c",helmet:"#66fcf1"},green:{body:"#39db14",armor:"#133d07",helmet:"#5eff39"},purple:{body:"#9d3bff",armor:"#20083c",helmet:"#c47aff"},orange:{body:"#ff7f3b",armor:"#3f1b07",helmet:"#ff9d7a"},yellow:{body:"#ffd700",armor:"#3a3000",helmet:"#ffea70"},red:{body:"#ff3c3c",armor:"#3a0707",helmet:"#ff7a7a"}},c=l[e.color]||l[e.isLocal?"cyan":"red"],h=c.body,f=c.armor,d=c.helmet;let u=18,p=4;e.weaponKey==="rifle"&&(u=24,p=5),e.weaponKey==="shotgun"&&(u=22,p=6),e.weaponKey==="sniper"&&(u=32,p=4),e.weaponKey==="smg"&&(u=16,p=4),e.weaponKey==="lmg"&&(u=26,p=7),e.weaponKey==="dmr"&&(u=28,p=5),e.weaponKey==="knife"&&(u=10,p=2),this.ctx.fillStyle="#444",this.ctx.strokeStyle="#000",this.ctx.lineWidth=1,this.ctx.fillRect(10,-p/2,u,p),this.ctx.strokeRect(10,-p/2,u,p),this.ctx.fillStyle=f,this.ctx.strokeStyle="#000",this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.arc(8,-10,5,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.arc(14,6,5,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle=h,this.ctx.beginPath(),this.ctx.ellipse(0,0,18,21,0,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle=f,this.ctx.beginPath(),this.ctx.ellipse(-3,0,14,16,0,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle=d,this.ctx.beginPath(),this.ctx.arc(-2,0,8,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle="#111",this.ctx.fillRect(1,-5,3,10),this.ctx.restore()}this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle),this.ctx.fillStyle=e.weaponKey==="knife"?"#b0b8c0":"#333",this.ctx.strokeStyle="rgba(0,0,0,0.7)",this.ctx.lineWidth=1;let a=18,r=3;if(e.weaponKey==="rifle"&&(a=26,r=4),e.weaponKey==="shotgun"&&(a=22,r=5),e.weaponKey==="sniper"&&(a=36,r=3),e.weaponKey==="smg"&&(a=16,r=3),e.weaponKey==="lmg"&&(a=28,r=5),e.weaponKey==="dmr"&&(a=30,r=4),e.weaponKey==="knife"&&(a=10,r=2),this.ctx.fillRect(12,-r/2,a,r),this.ctx.strokeRect(12,-r/2,a,r),e.muzzleFlash>0){this.ctx.save(),this.ctx.translate(12+a,0);const l=this.ctx.createRadialGradient(0,0,2,0,0,16);l.addColorStop(0,"rgba(255, 255, 255, 1.0)"),l.addColorStop(.3,"rgba(255, 220, 0, 0.9)"),l.addColorStop(.7,"rgba(255, 80, 0, 0.5)"),l.addColorStop(1,"rgba(255, 0, 0, 0.0)"),this.ctx.fillStyle=l,this.ctx.beginPath(),this.ctx.arc(0,0,16,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}this.ctx.restore(),this.ctx.save(),this.ctx.textAlign="center";const o=e.isLocal?"#66fcf1":e.isTeammate?"#39db14":"#ff3c3c";if(this.ctx.fillStyle=o,this.ctx.font="10px Orbitron",this.ctx.fillText(e.name.toUpperCase(),e.x,e.y-30),!e.isLocal&&e.health>0){this.ctx.fillStyle="rgba(0,0,0,0.5)",this.ctx.fillRect(e.x-20,e.y-26,40,4);const l=e.isTeammate?"#39db14":"#ff3c3c";this.ctx.fillStyle=l,this.ctx.fillRect(e.x-20,e.y-26,40*(e.health/e.maxHealth),4)}this.ctx.restore(),this.ctx.restore()}render(){let e=null;if(this.gameState==="replay"){const y=Math.min(this.replayFrames.length-1,Math.floor(this.replayIndex));e=this.replayFrames[y]}if(this.gameState==="replay"&&!e)return;this.ctx.fillStyle="#06070a",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const t=1920,i=1080,s=this.canvas.width/t,a=this.canvas.height/i,r=Math.min(s,a);this.zoom=Math.max(.5,Math.min(1.35,r)),this.ctx.save(),this.ctx.translate(this.canvas.width/2,this.canvas.height/2),this.ctx.scale(this.zoom,this.zoom);const o=e?e.camera.x:this.camera.x,l=e?e.camera.y:this.camera.y,c=e?0:this.camera.shakeX,h=e?0:this.camera.shakeY,f=-o+c,d=-l+h;this.ctx.translate(f,d);const u=e?e.players:this.players,p=e?e.bullets:this.bullets,v=e?e.brokenLightOn:this.map.ambientLights.brokenCeiling?this.map.ambientLights.brokenCeiling.on:!0;this.map.ambientLights.brokenCeiling&&(this.map.ambientLights.brokenCeiling.on=v),u.forEach(y=>{y.health>0&&y.flashlightActive?y.lightPoly=this.map.computeVisibilityPolygon(y.x,y.y,700,y.angle,65*Math.PI/180):y.lightPoly=null}),e?e.decals.forEach(y=>{this.ctx.save(),this.ctx.translate(y.x,y.y),this.ctx.rotate(y.angle),this.ctx.globalAlpha=y.type==="blood"?.75:.9,y.type==="blood"?(this.ctx.fillStyle=y.color,this.ctx.beginPath(),this.ctx.ellipse(0,0,y.size*y.scaleX,y.size*y.scaleY,0,0,Math.PI*2),this.ctx.fill()):y.type==="casing"?(this.ctx.fillStyle="#b5921c",this.ctx.fillRect(-y.size,-y.size/2,y.size*2,y.size)):y.type==="splinter"&&(this.ctx.fillStyle="#6e441c",this.ctx.fillRect(-y.size,-y.size/3,y.size*1.5,y.size*.7)),this.ctx.restore()}):this.particles.drawDecals(this.ctx);const g=e?e.players.find(y=>y.isLocal):this.localPlayer;if(this.map.draw(this.ctx,this.settings,u,g,p),u.forEach(y=>{y.health<=0&&(e?this.drawSnapshotPlayer(y,!0):y.draw(this.ctx))}),u.forEach(y=>{if(y.health<=0)return;let E=!0;if(this.settings.shadows&&g&&g.health>0&&!y.isLocal){const A=g.flashlightActive&&g.lightPoly&&this.isPointInPolygon({x:y.x,y:y.y},g.lightPoly),S=!this.map.getLineIntersection({x:g.x,y:g.y},{x:y.x,y:y.y}),w=this.map.isPointInAmbientLight(y.x,y.y,y.radius||18);E=A||y.isTeammate||y.flashlightActive&&S||w&&S}E&&(e?this.drawSnapshotPlayer(y,!1):y.draw(this.ctx,this.settings,this.map))}),g&&g.health>0&&(this.ctx.save(),this.ctx.translate(g.x,g.y),this.ctx.strokeStyle="rgba(102, 252, 241, 0.15)",this.ctx.lineWidth=1,this.ctx.setLineDash([4,8]),this.ctx.beginPath(),this.ctx.arc(0,0,32,Date.now()/1500,Date.now()/1500+Math.PI*2),this.ctx.stroke(),this.ctx.restore()),this.ctx.save(),this.ctx.globalCompositeOperation="lighter",e?(e.bullets.forEach(y=>{if(y.active){if(this.ctx.save(),y.weaponKey==="knife")this.ctx.lineWidth=3.5,this.ctx.lineCap="round",this.ctx.strokeStyle="rgba(230, 235, 255, 0.85)",this.ctx.shadowColor="#66fcf1",this.ctx.shadowBlur=6,this.ctx.beginPath(),this.ctx.arc(y.x,y.y,18,y.angle-.6,y.angle+.6),this.ctx.stroke();else{this.ctx.lineWidth=2.5,this.ctx.lineCap="round";const E=y.playerId===(g==null?void 0:g.id),A=this.ctx.createLinearGradient(y.prevX,y.prevY,y.x,y.y);E?(A.addColorStop(0,"rgba(102, 252, 241, 0.0)"),A.addColorStop(1,"rgba(102, 252, 241, 1.0)"),this.ctx.strokeStyle=A,this.ctx.shadowColor="#66fcf1"):(A.addColorStop(0,"rgba(255, 60, 60, 0.0)"),A.addColorStop(1,"rgba(255, 60, 60, 1.0)"),this.ctx.strokeStyle=A,this.ctx.shadowColor="#ff3c3c"),this.ctx.shadowBlur=4,this.ctx.beginPath(),this.ctx.moveTo(y.prevX,y.prevY),this.ctx.lineTo(y.x,y.y),this.ctx.stroke()}this.ctx.restore()}}),e.particles.forEach(y=>{this.ctx.save(),this.ctx.globalAlpha=Math.max(0,y.life),y.type==="casing"?(this.ctx.translate(y.x,y.y),this.ctx.rotate(y.angle),this.ctx.fillStyle="#d4af37",this.ctx.strokeStyle="#996515",this.ctx.lineWidth=.5,this.ctx.fillRect(-y.size,-y.size/2,y.size*2,y.size),this.ctx.strokeRect(-y.size,-y.size/2,y.size*2,y.size)):y.type==="splinter"?(this.ctx.translate(y.x,y.y),this.ctx.rotate(y.angle),this.ctx.fillStyle="#8b5a2b",this.ctx.beginPath(),this.ctx.moveTo(-y.size,0),this.ctx.lineTo(y.size,-y.size/2),this.ctx.lineTo(y.size/2,y.size/2),this.ctx.closePath(),this.ctx.fill()):y.type==="blood"?(this.ctx.fillStyle=y.color,this.ctx.beginPath(),this.ctx.arc(y.x,y.y,y.size,0,Math.PI*2),this.ctx.fill()):(this.ctx.fillStyle=y.color,(y.color.startsWith("#66fc")||y.color.startsWith("#ff3c"))&&(this.ctx.shadowColor=y.color,this.ctx.shadowBlur=4),this.ctx.beginPath(),this.ctx.arc(y.x,y.y,y.size*y.life,0,Math.PI*2),this.ctx.fill()),this.ctx.restore()})):(this.bullets.forEach(y=>y.draw(this.ctx)),this.particles.drawParticles(this.ctx)),this.ctx.restore(),e&&e.grenades?e.grenades.forEach(y=>{this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(y.x,y.y,6,0,Math.PI*2),this.ctx.fillStyle="#2d332f",this.ctx.strokeStyle="#66fcf1",this.ctx.lineWidth=1.5,this.ctx.fill(),this.ctx.stroke(),this.ctx.restore()}):this.grenades&&this.grenades.forEach(y=>y.draw(this.ctx)),!e&&this.zone&&this.zone.active){const y=this.zone,E=Date.now(),A=Math.sin(E/300)*.15+.85;this.ctx.save(),this.ctx.beginPath(),this.ctx.rect(-100,-100,this.mapWidth+200,this.mapHeight+200),this.ctx.arc(y.centerX,y.centerY,y.currentRadius,0,Math.PI*2,!0),this.ctx.fillStyle=`rgba(255, 30, 30, ${.12*A})`,this.ctx.fill("evenodd"),this.ctx.beginPath(),this.ctx.arc(y.centerX,y.centerY,y.currentRadius,0,Math.PI*2),this.ctx.strokeStyle=`rgba(255, 50, 50, ${.85*A})`,this.ctx.lineWidth=4,this.ctx.shadowColor="#ff2222",this.ctx.shadowBlur=18,this.ctx.stroke(),this.ctx.shadowBlur=0,this.ctx.beginPath(),this.ctx.arc(y.centerX,y.centerY,y.currentRadius,0,Math.PI*2),this.ctx.strokeStyle=`rgba(255, 150, 150, ${.3*A})`,this.ctx.lineWidth=12,this.ctx.stroke(),this.ctx.restore()}this.matchMode==="sabotage"&&(this.vents.forEach(y=>{this.ctx.save(),this.ctx.translate(y.x,y.y),this.ctx.fillStyle="#1e2124",this.ctx.fillRect(-20,-15,40,30),this.ctx.strokeStyle="#535960",this.ctx.lineWidth=2.5,this.ctx.strokeRect(-20,-15,40,30),this.ctx.strokeStyle="#0f1112",this.ctx.lineWidth=2;for(let A=-12;A<=12;A+=6)this.ctx.beginPath(),this.ctx.moveTo(A,-10),this.ctx.lineTo(A,10),this.ctx.stroke();Math.hypot(this.localPlayer.x-y.x,this.localPlayer.y-y.y)<50&&this.localPlayer.health>0&&!this.localPlayer.inVent&&(this.ctx.fillStyle="#66fcf1",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("[E] VENT",0,-22)),this.ctx.restore()}),this.tasks.forEach(y=>{const E=Date.now();this.ctx.save(),this.ctx.translate(y.x,y.y);const S=E%1200/1200*Math.PI*2;if(y.alarmActive){const N=.7+.3*Math.abs(Math.sin(E/60+y.x)),L=90+20*Math.abs(Math.sin(E/200)),U=Math.PI/6;this.ctx.save(),this.ctx.createConicalGradient;for(let Y=0;Y<2;Y++){const Q=S+Y*Math.PI;this.ctx.beginPath(),this.ctx.moveTo(0,-26),this.ctx.arc(0,-26,L,Q-U,Q+U),this.ctx.closePath();const ne=this.ctx.createRadialGradient(0,-26,0,0,-26,L);ne.addColorStop(0,`rgba(255, 60, 40, ${.55*N})`),ne.addColorStop(.45,`rgba(255, 80, 40, ${.18*N})`),ne.addColorStop(1,"rgba(255, 40, 0, 0)"),this.ctx.fillStyle=ne,this.ctx.fill()}const B=this.ctx.createRadialGradient(0,0,0,0,0,75);B.addColorStop(0,`rgba(255, 30, 10, ${.22*N})`),B.addColorStop(1,"rgba(255,0,0,0)"),this.ctx.fillStyle=B,this.ctx.beginPath(),this.ctx.ellipse(0,5,75,35,0,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}else if(y.status==="doing"){const N=.12+.1*Math.abs(Math.sin(E/350)),L=this.ctx.createRadialGradient(0,0,0,0,0,40);L.addColorStop(0,`rgba(255,220,50,${N})`),L.addColorStop(1,"rgba(255,200,0,0)"),this.ctx.fillStyle=L,this.ctx.beginPath(),this.ctx.ellipse(0,5,40,22,0,0,Math.PI*2),this.ctx.fill()}y.status,y.alarmActive||y.status,this.ctx.fillStyle="rgba(0,0,0,0.45)",this.ctx.beginPath(),this.ctx.ellipse(0,17,22,7,0,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle="#1a1f26",this.ctx.beginPath(),this.ctx.roundRect(-18,-18,36,32,3),this.ctx.fill(),this.ctx.strokeStyle="#3a4555",this.ctx.lineWidth=1.5,this.ctx.stroke(),this.ctx.fillStyle="#0d1117",this.ctx.fillRect(-13,-14,26,16),this.ctx.strokeStyle="#2a3340",this.ctx.lineWidth=1,this.ctx.strokeRect(-13,-14,26,16);const w=y.alarmActive?"#1a0000":"#001a0a";this.ctx.fillStyle=w,this.ctx.fillRect(-11,-12,22,12),this.ctx.strokeStyle=y.alarmActive?"rgba(255,20,20,0.06)":"rgba(0,255,100,0.07)",this.ctx.lineWidth=.8;for(let N=-11;N<0;N+=2)this.ctx.beginPath(),this.ctx.moveTo(-11,N),this.ctx.lineTo(11,N),this.ctx.stroke();y.alarmActive?(this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=6,this.ctx.fillStyle="#ff3c3c"):y.status==="completed"?(this.ctx.shadowColor="#66fcf1",this.ctx.shadowBlur=6,this.ctx.fillStyle="#66fcf1"):y.status==="doing"?(this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=5,this.ctx.fillStyle="#ffd700"):(this.ctx.shadowColor="#1aff8a",this.ctx.shadowBlur=4,this.ctx.fillStyle="#1aff8a"),this.ctx.font="bold 5px monospace",this.ctx.textAlign="center";const P=y.alarmActive?"ALARM":y.status==="completed"?"DONE":y.status==="doing"?"ACTIVE":"READY";this.ctx.fillText(P,0,-5),this.ctx.shadowBlur=0,this.ctx.fillStyle="#141a22",this.ctx.fillRect(-13,4,26,8);const C=y.alarmActive?`rgba(255,40,40,${.6+.4*Math.abs(Math.sin(E/90))})`:y.status==="completed"?"#66fcf1":y.status==="doing"?"#ffd700":"#1aff8a";this.ctx.fillStyle=C,y.alarmActive&&(this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=8),this.ctx.beginPath(),this.ctx.arc(-8,8,2.5,0,Math.PI*2),this.ctx.fill(),this.ctx.shadowBlur=0;for(let N=-1;N<=5;N+=3)this.ctx.fillStyle="#2a3545",this.ctx.fillRect(N,6,2.5,4);if(y.alarmActive){const N=.6+.4*Math.abs(Math.sin(E/45));this.ctx.fillStyle="#1a0a0a",this.ctx.beginPath(),this.ctx.arc(0,-26,6,Math.PI,0),this.ctx.fill(),this.ctx.save(),this.ctx.translate(0,-26),this.ctx.rotate(S),this.ctx.fillStyle=`rgba(255, 60, 10, ${N})`,this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=14,this.ctx.beginPath(),this.ctx.arc(0,0,4.5,0,Math.PI*2),this.ctx.fill(),this.ctx.shadowBlur=0,this.ctx.fillStyle=`rgba(255, 220, 180, ${.8*N})`,this.ctx.beginPath(),this.ctx.arc(0,0,2,0,Math.PI*2),this.ctx.fill(),this.ctx.restore(),this.ctx.strokeStyle="#2a1a1a",this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.moveTo(0,-20),this.ctx.lineTo(0,-22),this.ctx.stroke()}else this.ctx.fillStyle="#1a2030",this.ctx.beginPath(),this.ctx.arc(0,-22,4,Math.PI,0),this.ctx.fill(),this.ctx.fillStyle="#2a3040",this.ctx.beginPath(),this.ctx.arc(0,-22,2,0,Math.PI*2),this.ctx.fill();this.ctx.strokeStyle="#0a0f14",this.ctx.lineWidth=1.2,this.ctx.beginPath(),this.ctx.moveTo(-18,5),this.ctx.quadraticCurveTo(-26,10,-24,16),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(18,3),this.ctx.quadraticCurveTo(25,8,22,16),this.ctx.stroke(),[[-16,-16],[16,-16],[-16,12],[16,12]].forEach(([N,L])=>{this.ctx.fillStyle="#2c3545",this.ctx.beginPath(),this.ctx.arc(N,L,1.5,0,Math.PI*2),this.ctx.fill()}),Math.hypot(this.localPlayer.x-y.x,this.localPlayer.y-y.y)<40&&this.localPlayer.health>0&&y.status==="pending"&&(this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=8,this.ctx.fillStyle="#ffd700",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("[F] INTERACT",0,-36),this.ctx.shadowBlur=0),this.ctx.restore()})),this.activeHitmarkers.forEach(y=>{const E=y.age/y.duration;this.ctx.save(),this.ctx.translate(y.x,y.y);const A=1-E;this.ctx.strokeStyle=y.isHeadshot?`rgba(255, 215, 0, ${A})`:`rgba(255, 255, 255, ${A})`,this.ctx.lineWidth=y.isHeadshot?2.5:1.5;const S=5+E*5,w=2;this.ctx.beginPath(),this.ctx.moveTo(-w,-w),this.ctx.lineTo(-S,-S),this.ctx.moveTo(w,-w),this.ctx.lineTo(S,-S),this.ctx.moveTo(-w,w),this.ctx.lineTo(-S,S),this.ctx.moveTo(w,w),this.ctx.lineTo(S,S),this.ctx.stroke(),this.ctx.restore()}),this.floatingNumbers.forEach(y=>{const E=y.age/y.duration;this.ctx.save(),this.ctx.translate(y.x,y.y);const A=1-E;let S=1;E<.25?S=1+E/.25*.4:S=1.4-(E-.25)/.75*.4,this.ctx.scale(S,S),this.ctx.font=y.isHeadshot?"bold 14px 'Orbitron', sans-serif":"bold 11px 'Orbitron', sans-serif",this.ctx.textAlign="center",this.ctx.strokeStyle=`rgba(0, 0, 0, ${A})`,this.ctx.lineWidth=3,this.ctx.strokeText(y.damage,0,0),this.ctx.fillStyle=y.isHeadshot?`rgba(255, 215, 0, ${A})`:`rgba(255, 255, 255, ${A})`,this.ctx.fillText(y.damage,0,0),this.ctx.restore()}),this.ctx.restore(),this.ctx.save();const M=this.ctx.createRadialGradient(this.canvas.width/2,this.canvas.height/2,this.canvas.width/3,this.canvas.width/2,this.canvas.height/2,this.canvas.width/1.1);M.addColorStop(0,"rgba(0, 0, 0, 0)");let _="rgba(0, 0, 0, 0.82)";if(this.localPlayer){const y=Date.now(),E=this.localPlayer.adrenalineEndTime&&y<this.localPlayer.adrenalineEndTime||this.localPlayer.adrenalineActive,A=this.localPlayer.overdriveEndTime&&y<this.localPlayer.overdriveEndTime||this.localPlayer.overdriveActive;this.matchMode==="sabotage"&&this.tasks&&this.tasks.some(w=>w.alarmActive)?_=`rgba(255, 30, 30, ${Math.sin(y/100)*.15+.55})`:A?_=`rgba(255, 180, 0, ${Math.sin(y/150)*.12+.48})`:E&&(_=`rgba(57, 219, 20, ${Math.sin(y/150)*.12+.48})`)}M.addColorStop(1,_),this.ctx.fillStyle=M,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(255, 255, 255, 0.015)";for(let y=0;y<this.canvas.height;y+=4)this.ctx.fillRect(0,y,this.canvas.width,1);if(this.ctx.restore(),this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.health<35&&!e){this.ctx.save();const y=Math.sin(Date.now()/150)*.2+.3,E=this.ctx.createRadialGradient(this.canvas.width/2,this.canvas.height/2,this.canvas.width/3,this.canvas.width/2,this.canvas.height/2,this.canvas.width/1.1);E.addColorStop(0,"rgba(255, 0, 0, 0)"),E.addColorStop(1,`rgba(255, 0, 0, ${y})`),this.ctx.fillStyle=E,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.restore()}let x=0;if(e){const y=e.players.find(E=>E.isLocal);y&&(x=y.flashAlpha||0)}else this.localPlayer&&(x=this.localPlayer.flashAlpha||0);if(x>0&&(this.ctx.save(),this.ctx.fillStyle=`rgba(255, 255, 255, ${x})`,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.restore()),!e){const y=this.localPlayer&&this.localPlayer.health>0?this.map.checkZone(this.localPlayer.x,this.localPlayer.y):null;if(y)try{this.ctx.save();const E=y.type==="healing",A=Math.sin(Date.now()/400)*.25+.75,S=E?`rgba(80,255,130,${A})`:`rgba(255,100,60,${A})`,w=E?`rgba(40,255,110,${A*.18})`:`rgba(255,60,20,${A*.18})`,P=E?`rgba(80,255,130,${A*.8})`:`rgba(255,100,60,${A*.8})`,C=260,I=38,z=this.canvas.width/2-C/2,N=this.canvas.height-130;this.ctx.fillStyle=w,this.ctx.fillRect(z,N,C,I),this.ctx.strokeStyle=P,this.ctx.lineWidth=1.5,this.ctx.strokeRect(z,N,C,I),this.ctx.textAlign="center",this.ctx.font="bold 12px Orbitron",this.ctx.fillStyle=S;const L=E?"+":"!";this.ctx.fillText(`${L} ${y.label}`,this.canvas.width/2,N+15),this.ctx.font="9px Orbitron",this.ctx.fillStyle=E?"rgba(60,255,110,0.7)":"rgba(255,80,40,0.7)";const U=E?`+${(y.healRate*60).toFixed(0)} HP/s REGENERATION`:`DAMAGE x${y.multiplier} -- DANGER`;this.ctx.fillText(U,this.canvas.width/2,N+29),this.ctx.restore()}catch{}}if(this.matchMode==="sabotage"&&this.gameState==="playing"){this.ctx.save(),this.ctx.font="bold 11px 'Orbitron', sans-serif",this.ctx.textAlign="left";const y=20,E=120;this.ctx.fillStyle="#ff3c3c",this.ctx.fillText("MISSION TASKS:",y,E),this.tasks.forEach((A,S)=>{const w=E+20+S*18,P=A.status==="completed";this.ctx.fillStyle=P?"#39db14":"#fff",this.ctx.font=P?"10px 'Orbitron', sans-serif":"bold 10px 'Orbitron', sans-serif",this.ctx.strokeStyle=P?"#39db14":"#888",this.ctx.lineWidth=1,this.ctx.strokeRect(y,w-8,8,8),P&&(this.ctx.fillStyle="#39db14",this.ctx.fillRect(y+2,w-6,4,4)),this.ctx.fillText(A.name,y+15,w)}),this.ctx.restore()}if(this.matchMode==="sabotage"&&this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.inVent&&this.currentVent&&(this.ctx.save(),this.ctx.fillStyle="rgba(2, 4, 8, 0.85)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(102, 252, 241, 0.08)",this.ctx.strokeStyle="#66fcf1",this.ctx.lineWidth=2,this.ctx.fillRect(this.canvas.width/2-200,this.canvas.height/2-150,400,300),this.ctx.strokeRect(this.canvas.width/2-200,this.canvas.height/2-150,400,300),this.ctx.font="bold 16px 'Orbitron', sans-serif",this.ctx.fillStyle="#66fcf1",this.ctx.textAlign="center",this.ctx.fillText("VENT NETWORK SYSTEM",this.canvas.width/2,this.canvas.height/2-110),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#8892b0",this.ctx.fillText("Select destination vent code to travel:",this.canvas.width/2,this.canvas.height/2-80),this.vents.forEach((y,E)=>{const A=E+1,S=y.id===this.currentVent.id;this.ctx.fillStyle=S?"#ffd700":"#fff",this.ctx.fillText(`[${A}] ${y.name} ${S?"(CURRENT LOCATION)":""}`,this.canvas.width/2,this.canvas.height/2-40+E*30)}),this.ctx.font="bold 11px 'Orbitron', sans-serif",this.ctx.fillStyle="#ff3c3c",this.ctx.fillText("PRESS [SPACEBAR] TO EXIT VENT",this.canvas.width/2,this.canvas.height/2+120),this.ctx.restore()),this.activeTask)){this.ctx.save(),this.ctx.fillStyle="rgba(2, 4, 8, 0.85)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const y=this.canvas.width/2-200,E=this.canvas.height/2-140,A=400,S=280;this.ctx.fillStyle="#11151c",this.ctx.strokeStyle="#ffd700",this.ctx.lineWidth=3,this.ctx.fillRect(y,E,A,S),this.ctx.strokeRect(y,E,A,S),this.ctx.font="bold 15px 'Orbitron', sans-serif",this.ctx.fillStyle="#ffd700",this.ctx.textAlign="center",this.ctx.fillText(this.activeTask.name.toUpperCase(),this.canvas.width/2,E+35),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#888",this.ctx.fillText("TASK TYPE: GRID CALIBRATION",this.canvas.width/2,E+60);const w=this.canvas.width/2-120,P=E+100,C=240,I=40;this.ctx.fillStyle="#1a1d24",this.ctx.fillRect(w,P,C,I),this.ctx.strokeStyle="#333",this.ctx.strokeRect(w,P,C,I),this.ctx.fillStyle="rgba(57, 219, 20, 0.35)",this.ctx.fillRect(this.canvas.width/2-24,P,48,I),this.ctx.strokeStyle="#39db14",this.ctx.strokeRect(this.canvas.width/2-24,P,48,I);const z=Math.abs(Math.sin(this.sweepAngle)),N=w+z*C;this.ctx.strokeStyle="#fff",this.ctx.lineWidth=3,this.ctx.beginPath(),this.ctx.moveTo(N,P-5),this.ctx.lineTo(N,P+I+5),this.ctx.stroke();const L=this.canvas.width/2-120,U=E+175,B=240,Y=20;this.ctx.fillStyle="#1a1d24",this.ctx.fillRect(L,U,B,Y),this.ctx.fillStyle="#ffd700",this.ctx.fillRect(L,U,this.sweepProgress/100*B,Y),this.ctx.strokeStyle="#ffd700",this.ctx.strokeRect(L,U,B,Y),this.ctx.font="bold 10px 'Orbitron', sans-serif",this.ctx.fillStyle="#fff",this.ctx.fillText(`CALIBRATION PROGRESS: ${this.sweepProgress}%`,this.canvas.width/2,U+14),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#ffaa00",this.ctx.fillText("PRESS [SPACEBAR] WHEN LINE IS IN GREEN ZONE",this.canvas.width/2,E+230),this.ctx.fillStyle="#888",this.ctx.fillText("PRESS [ESC] OR [F] TO ABANDON TASK",this.canvas.width/2,E+255),this.ctx.restore()}if(!e&&this.gameState==="playing"&&(this.matchMode==="sabotage"||performance.now()-this.roundStartTime>2e4)){this.ctx.save();const y=150,A=this.canvas.width-y-20,S=100;this.ctx.fillStyle="rgba(6, 7, 10, 0.85)",this.ctx.fillRect(A,S,y,y),this.ctx.strokeStyle="hsla(43, 74%, 49%, 0.6)",this.ctx.lineWidth=2,this.ctx.strokeRect(A,S,y,y),this.ctx.fillStyle="hsla(43, 74%, 49%, 0.9)",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("TACTICAL MINIMAP",A+y/2,S-6);const w=y/this.map.width;if(this.ctx.fillStyle="rgba(255, 255, 255, 0.12)",this.map.walls.forEach(C=>{this.ctx.fillRect(A+C.x*w,S+C.y*w,C.w*w,C.h*w)}),this.localPlayer&&this.localPlayer.health>0){const C=A+this.localPlayer.x*w,I=S+this.localPlayer.y*w;this.ctx.fillStyle="#00ffff",this.ctx.beginPath(),this.ctx.arc(C,I,3.5,0,Math.PI*2),this.ctx.fill(),this.ctx.strokeStyle="rgba(0, 255, 255, 0.8)",this.ctx.lineWidth=1,this.ctx.beginPath(),this.ctx.moveTo(C,I),this.ctx.lineTo(C+Math.cos(this.localPlayer.angle)*7,I+Math.sin(this.localPlayer.angle)*7),this.ctx.stroke()}this.matchMode==="sabotage"&&this.tasks.forEach(C=>{if(C.status==="completed")return;const I=A+C.x*w,z=S+C.y*w,N=Math.abs(Math.sin(performance.now()/250));this.ctx.fillStyle=`rgba(255, 215, 0, ${.4+.6*N})`,this.ctx.beginPath(),this.ctx.arc(I,z,3.5+N*2,0,Math.PI*2),this.ctx.fill()});const P=Math.abs(Math.sin(performance.now()/200));this.players.forEach(C=>{if(C.health>0&&!C.isLocal){const I=A+C.x*w,z=S+C.y*w;if(C.isTeammate)this.ctx.fillStyle="#39ff14",this.ctx.beginPath(),this.ctx.arc(I,z,3,0,Math.PI*2),this.ctx.fill();else{if(this.matchMode==="sabotage")return;this.ctx.fillStyle=`rgba(255, 60, 60, ${.4+.6*P})`,this.ctx.beginPath(),this.ctx.arc(I,z,4+P*2.5,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle="#ff3c3c",this.ctx.beginPath(),this.ctx.arc(I,z,2,0,Math.PI*2),this.ctx.fill()}}}),this.ctx.restore()}if(e){this.ctx.save(),this.ctx.strokeStyle="rgba(255, 60, 60, 0.6)",this.ctx.lineWidth=12,this.ctx.strokeRect(0,0,this.canvas.width,this.canvas.height);const y=Math.floor(Date.now()/500)%2===0;this.ctx.fillStyle=y?"#ff3c3c":"rgba(255, 60, 60, 0.2)",this.ctx.beginPath(),this.ctx.arc(40,40,8,0,Math.PI*2),this.ctx.fill(),this.ctx.font="900 16px Orbitron",this.ctx.fillStyle="#ffffff",this.ctx.textAlign="left",this.ctx.fillText("KILLCAM REPLAY",60,46);const E=this.replayIndex/this.replayFrames.length,A=this.canvas.width-80;this.ctx.fillStyle="rgba(255, 255, 255, 0.15)",this.ctx.fillRect(40,this.canvas.height-40,A,6),this.ctx.fillStyle="#ff3c3c",this.ctx.fillRect(40,this.canvas.height-40,A*E,6),this.ctx.restore()}if(!e&&this.combatBanner){this.ctx.save(),this.ctx.textAlign="center",this.ctx.textBaseline="middle";const y=this.combatBanner.timer,E=this.combatBanner.text;let A=1;y<.5&&(A=y/.5);const S=1.5+Math.max(0,y-2.5)*2+.05*Math.sin(Date.now()/100);this.ctx.translate(this.canvas.width/2,this.canvas.height/2-180),this.ctx.scale(S,S),this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=20,this.ctx.font="italic 900 24px 'Orbitron', sans-serif";const w=this.ctx.createLinearGradient(-150,0,150,0);w.addColorStop(0,`rgba(255, 60, 60, ${A})`),w.addColorStop(.5,`rgba(255, 220, 0, ${A})`),w.addColorStop(1,`rgba(255, 60, 60, ${A})`),this.ctx.fillStyle=w,this.ctx.fillText(E,0,0),this.ctx.shadowBlur=0,this.ctx.strokeStyle=`rgba(255, 215, 0, ${A*.4})`,this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.moveTo(-100,18),this.ctx.lineTo(100,18),this.ctx.moveTo(-100,-18),this.ctx.lineTo(100,-18),this.ctx.stroke(),this.ctx.restore()}if(this.localPlayer&&this.localPlayer.weaponLevelUpAlert>0&&!e){this.ctx.save(),this.ctx.textAlign="center",this.ctx.textBaseline="middle";const y=this.localPlayer.weaponLevelUpAlert,E=Math.min(1,y),A=1+.15*Math.sin(Date.now()/150);this.ctx.translate(this.canvas.width/2,this.canvas.height/2-80),this.ctx.scale(A,A),this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=15,this.ctx.font="bold 28px 'Orbitron', sans-serif",this.ctx.fillStyle=`rgba(255, 215, 0, ${E})`,this.ctx.fillText("WEAPON UPGRADED",0,0),this.ctx.shadowBlur=0,this.ctx.font="bold 16px 'Orbitron', sans-serif",this.ctx.fillStyle=`rgba(255, 255, 255, ${E})`,this.ctx.fillText(`LVL ${this.localPlayer.weaponLevel}`,0,35),this.ctx.restore()}}isPointInPolygon(e,t){let i=!1;for(let s=0,a=t.length-1;s<t.length;a=s++){const r=t[s].x,o=t[s].y,l=t[a].x,c=t[a].y;o>e.y!=c>e.y&&e.x<(l-r)*(e.y-o)/(c-o)+r&&(i=!i)}return i}handleServerRoundOver(e){if(this.gameState!=="playing")return;if(this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchMode==="sabotage")try{this.sound.stopBearMusic()}catch{}let t=document.getElementById("hud-status");const i=this.localPlayer.team;e.winningTeam===i?t&&(t.innerText="ROUND WON",t.style.color="#39ff14"):t&&(t.innerText="ROUND LOST",t.style.color="#ff3c3c"),i===1?(this.scoreSelf=e.score1,this.scoreOpponent=e.score2):(this.scoreSelf=e.score2,this.scoreOpponent=e.score1),this.updateScoreboardHUD();const s=e.winningTeam===1?2:1;this.players.forEach(a=>{a.team===s&&(a.health=0)}),this.roundNumber=e.roundNumber,this.startReplay(()=>this.startRoundCycle())}handleServerMatchOver(e){if(this.gameState!=="playing"&&this.gameState!=="round-over")return;this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.localPlayer.team===1?(this.scoreSelf=e.score1,this.scoreOpponent=e.score2):(this.scoreSelf=e.score2,this.scoreOpponent=e.score1),this.updateScoreboardHUD();const i=window.MatchStats.shotsFired||1,s=window.MatchStats.hitsRegistered/i*100;window.MatchStats.accuracy=s,window.MatchStats.roundsWon=this.scoreSelf,window.MatchStats.winnerId=e.winnerId;const a=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent:this.scoreSelf>=3,r=this.localPlayer.rank?this.localPlayer.rank.label:"";let o=!1,l=0;this.isRanked&&(o=this.localPlayer.applyRankDelta(a?Ca:Pa),l=a?Ca:Pa),window.MatchStats.isWin=a,window.MatchStats.newRP=this.localPlayer.rp,window.MatchStats.newRank=this.localPlayer.rank,window.MatchStats.rpDelta=l,window.MatchStats.rankChanged=o,window.MatchStats.oldRankLabel=r;const h=(this.matchMode==="sabotage"?e.score1>e.score2?1:2:e.score1>=3?1:2)===1?2:1;this.players.forEach(d=>{d.team===h&&(d.health=0)});const f=()=>{this.gameState="match-over",this.active=!1,a?this.sound.playMatchWin():this.sound.playMatchLose(),this.onMatchEnd&&this.onMatchEnd(window.MatchStats)};this.startReplay(f)}spawnItemAt(e,t,i,s=null){const a=s||`item_${i}_${Date.now()}_${Math.round(Math.random()*1e3)}`;return this.map.items.some(r=>r.id===a)||this.map.items.push({id:a,x:e,y:t,type:i,active:!0}),a}generateRandomCode(){const e=["w","a","s","d","q","e","r","f"];let t="";for(let i=0;i<4;i++)t+=e[Math.floor(Math.random()*e.length)];return t}startHackingMinigame(e){const t=this.generateRandomCode();this.activeMinigame={terminal:e,code:t,input:"",timer:4},this.keys.e=!1;const i=document.getElementById("hacking-minigame-overlay");i&&(i.style.display="flex");const s=document.getElementById("hud-interaction-prompt");s&&(s.style.display="none"),this.renderMinigameKeys()}renderMinigameKeys(){const e=document.getElementById("minigame-keys-container");if(!e||!this.activeMinigame)return;e.innerHTML="";const t=this.activeMinigame.code,i=this.activeMinigame.input;for(let s=0;s<t.length;s++){const a=t[s],r=s<i.length,o=document.createElement("div");o.style.width="35px",o.style.height="35px",o.style.lineHeight="35px",o.style.borderRadius="4px",o.style.fontFamily="var(--font-title)",o.style.fontWeight="bold",o.style.fontSize="14px",o.style.textTransform="uppercase",o.style.border=r?"1px solid #39ff14":"1px solid rgba(255,255,255,0.15)",o.style.background=r?"rgba(57, 255, 20, 0.12)":"rgba(0,0,0,0.4)",o.style.color=r?"#39ff14":"rgba(255,255,255,0.7)",o.style.boxShadow=r?"0 0 6px rgba(57, 255, 20, 0.25)":"none",o.innerText=a,e.appendChild(o)}}handleMinigameKeyPress(e){if(!this.activeMinigame)return;const t=this.activeMinigame.code,i=this.activeMinigame.input,s=t[i.length];if(e===s){this.activeMinigame.input+=e,this.renderMinigameKeys();try{this.sound.playMetallicClick(0,2500,.04,.2)}catch{}this.activeMinigame.input===t&&this.successHackingMinigame()}else{this.activeMinigame.input="",this.renderMinigameKeys();try{this.sound.playMetallicClick(0,300,.15,.3)}catch{}}}cancelHackingMinigame(){this.activeMinigame=null;const e=document.getElementById("hacking-minigame-overlay");e&&(e.style.display="none")}successHackingMinigame(){if(!this.activeMinigame)return;const e=this.activeMinigame.terminal;e.hacked=!0;const t=this.spawnItemAt(e.x-22,e.y,"health"),i=this.spawnItemAt(e.x+22,e.y,"adrenaline");this.localPlayer.showTextNotification("HACK SUCCESSFUL! LOOT SPAWNED","#39ff14"),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:t,x:e.x-22,y:e.y,type:"health"}),this.localPlayer.networkDroppedItems.push({id:i,x:e.x+22,y:e.y,type:"adrenaline"});try{this.sound.playMetallicClick(0,3500,.25,.45)}catch{}this.cancelHackingMinigame()}failHackingMinigame(){this.localPlayer.showTextNotification("HACK FAILED!","#ff3c3c");try{this.sound.playMetallicClick(0,200,.3,.45)}catch{}this.cancelHackingMinigame()}}async function Vx(n){if(!n)return;const e=n.querySelector(".u-loading__runner"),t=e==null?void 0:e.getAnimations()[0],i=Number(t==null?void 0:t.currentTime)||0;await new Promise(s=>setTimeout(s,Math.max(0,4600-i)))}function Hx(){const n=document.getElementById("operative-account"),e=document.getElementById("operative-account-hint");if(!n||!e)return;const t=()=>e.matches(":popover-open");function i(){if(!t())return;const a=n.getBoundingClientRect(),r=e.getBoundingClientRect(),o=a.right+r.width+24<=innerWidth,l=o?a.right+12:a.right-r.width,c=o?a.top-6:a.bottom+10;e.style.left=`${Math.max(12,Math.min(l,innerWidth-r.width-12))}px`,e.style.top=`${Math.max(12,Math.min(c,innerHeight-r.height-12))}px`}function s({restoreFocus:a=!1}={}){t()&&e.hidePopover(),a&&n.focus({preventScroll:!0})}e.addEventListener("beforetoggle",a=>{n.setAttribute("aria-expanded",String(a.newState==="open")),a.newState==="open"&&requestAnimationFrame(()=>{t()&&(i(),e.querySelector(".operative-account-link").focus({preventScroll:!0}))})}),e.querySelector(".operative-account-close").addEventListener("click",()=>s({restoreFocus:!0})),e.querySelector("[data-open-account]").addEventListener("click",()=>s({restoreFocus:!0})),document.addEventListener("keydown",a=>{a.key!=="Escape"||!t()||(a.preventDefault(),a.stopPropagation(),s({restoreFocus:!0}))},!0),document.addEventListener("scroll",i,!0),window.addEventListener("resize",i),window.addEventListener("pagehide",()=>s())}const Le={getItem(n){try{return localStorage.getItem(n)}catch(e){return console.warn("localStorage.getItem failed:",e),null}},setItem(n,e){try{localStorage.setItem(n,e)}catch(t){console.warn("localStorage.setItem failed:",t)}},removeItem(n){try{localStorage.removeItem(n)}catch(e){console.warn("localStorage.removeItem failed:",e)}}},Bl="tacticstrike_admin_session";let gt=Dh(),Ss=!!gt.token,ms=Le.getItem(Bl),Ol=null;function wh(n){return new Promise(e=>setTimeout(e,n))}function zl({immediate:n=!1}={}){const e=document.getElementById("startup-overlay");if(document.body.classList.remove("is-starting"),!!e){if(e.setAttribute("aria-hidden","true"),n){e.remove();return}e.classList.add("fade-out"),setTimeout(()=>e.remove(),450)}}setTimeout(()=>{document.body.classList.contains("is-starting")&&zl()},6500);async function Gx(n){const e=gt.token&&!gt.user?Promise.race([Promise.resolve(n),wh(3600)]):Promise.resolve();await Promise.all([Vx(document.getElementById("startup-overlay")),e]);const t=document.getElementById("startup-status");t&&(t.textContent="Ready when you are."),await wh(140),zl()}function Ks(n,e={}){return Nh(n,{...e,token:gt.token})}async function Ms(n,e={}){const t={"Content-Type":"application/json",...e.headers||{}};ms&&(t.Authorization=`Bearer ${ms}`);const i=await fetch(`${kh()}${n}`,{...e,headers:t}),s=i.status===204?null:await i.json().catch(()=>null);if(!i.ok){const a=new Error((s==null?void 0:s.message)||"The admin server could not complete this request.");throw a.code=s==null?void 0:s.error,a.status=i.status,a}return s}const bi={menu:document.getElementById("menu-screen"),lobby:document.getElementById("lobby-screen"),game:document.getElementById("game-screen"),matchmaking:document.getElementById("matchmaking-screen")},Qe={rankedRealistic:document.getElementById("btn-ranked-realistic"),rankedCompetitive:document.getElementById("btn-ranked-competitive"),createRoom:document.getElementById("btn-create-room"),joinRoom:document.getElementById("btn-join-room"),practiceBot:document.getElementById("btn-practice-bot"),openMatchSettings:document.getElementById("btn-open-match-settings"),closeSettings:document.getElementById("btn-close-settings"),leaveLobby:document.getElementById("btn-leave-lobby"),readyToggle:document.getElementById("btn-ready-toggle"),copyCode:document.getElementById("btn-copy-code"),returnLobby:document.getElementById("btn-return-lobby"),btnAmongUs:document.getElementById("btn-among-us-mode")},ft={roomCode:document.getElementById("room-code-input"),chat:document.getElementById("chat-input"),qpMapSelect:document.getElementById("qp-map-select"),lobbyMapSelect:document.getElementById("lobby-map-select"),lobbyModeSelect:document.getElementById("lobby-mode-select"),lobbyStyleSelect:document.getElementById("lobby-style-select")},nt={roomCode:document.getElementById("room-code-display"),weaponStats:document.getElementById("weapon-stats-display"),playersList:document.getElementById("lobby-players-list"),chatMessages:document.getElementById("chat-messages"),chatDrawer:document.getElementById("chat-drawer")},yt={modal:document.getElementById("settings-modal"),volume:document.getElementById("setting-volume"),volumeVal:document.getElementById("volume-val"),blood:document.getElementById("setting-blood"),shadows:document.getElementById("setting-shadows"),laser:document.getElementById("setting-laser")},xn=document.getElementById("game-over-modal"),pr={pistol:{name:"Tactical 9mm",damage:22,fireRate:35,accuracy:90,magSize:12,range:400,reloadTime:1200,speedMultiplier:1,type:"Semi-Auto",damagePct:33,fireRatePct:45},rifle:{name:"Assault Rifle (M4A1)",damage:28,fireRate:75,accuracy:70,magSize:30,range:600,reloadTime:2200,speedMultiplier:1,type:"Automatic",damagePct:65,fireRatePct:85},shotgun:{name:"Shotgun (Remington 870)",damage:15,fireRate:20,accuracy:40,magSize:6,range:250,reloadTime:3e3,speedMultiplier:1,type:"Pump-Action",damagePct:80,fireRatePct:20,pellets:8},sniper:{name:"Sniper Rifle (AWM)",damage:95,fireRate:10,accuracy:98,magSize:5,range:1e3,reloadTime:2800,speedMultiplier:1,type:"Bolt-Action",damagePct:100,fireRatePct:10},smg:{name:"SMG (MP5)",damage:18,fireRate:85,accuracy:82,magSize:30,range:350,reloadTime:1500,speedMultiplier:1,type:"Automatic",damagePct:30,fireRatePct:95},lmg:{name:"LMG (M249)",damage:25,fireRate:80,accuracy:75,magSize:100,range:550,reloadTime:4500,speedMultiplier:1,type:"Automatic",damagePct:55,fireRatePct:90},dmr:{name:"DMR (M14 EBR)",damage:45,fireRate:30,accuracy:94,magSize:20,range:800,reloadTime:2400,speedMultiplier:1,type:"Semi-Auto",damagePct:75,fireRatePct:35},vector:{name:"Vector SMG",damage:14,fireRate:95,accuracy:85,magSize:33,range:320,reloadTime:1100,speedMultiplier:1,type:"Automatic",damagePct:25,fireRatePct:98},famas:{name:"FAMAS Burst Carbine",damage:20,fireRate:55,accuracy:91,magSize:25,range:550,reloadTime:1800,speedMultiplier:1,type:"Burst-Fire",damagePct:45,fireRatePct:60},plasma:{name:"Plasma Rifle PL-45",damage:32,fireRate:65,accuracy:90,magSize:20,range:600,reloadTime:2e3,speedMultiplier:1,type:"Automatic",damagePct:60,fireRatePct:70},railgun:{name:"Railgun RG-X",damage:85,fireRate:8,accuracy:99,magSize:5,range:1200,reloadTime:3500,speedMultiplier:.95,type:"Single-Shot",damagePct:95,fireRatePct:8}},On={dmr:{rp:1e3,rank:"VETERAN",price:2200},sniper:{rp:1e3,rank:"VETERAN",price:2500},lmg:{rp:4e3,rank:"ELITE",price:4500},vector:{rp:1e3,rank:"VETERAN",price:2100},famas:{rp:1e3,rank:"VETERAN",price:2300},plasma:{rp:4e3,rank:"ELITE",price:4e3},railgun:{rp:4e3,rank:"ELITE",price:5e3}},Wx={dmr:{code:"M14",role:"PRECISION",tier:"ADVANCED",description:"A controlled semi-auto platform built for disciplined mid-to-long range fire."},sniper:{code:"AWM",role:"LONGSHOT",tier:"ADVANCED",description:"A high-impact bolt-action system engineered to end an engagement in one shot."},lmg:{code:"M249",role:"SUPPORT",tier:"ELITE",description:"Sustained suppressive fire with a deep belt and uncompromising lane control."},vector:{code:"VEC",role:"BREACH",tier:"ADVANCED",description:"Extreme close-range fire rate for operatives who fight inside the objective."},famas:{code:"FAM",role:"BURST",tier:"ADVANCED",description:"A precise burst carbine tuned for fast target acquisition and controlled recoil."},plasma:{code:"PL45",role:"PROTOTYPE",tier:"ELITE",description:"Experimental energy rifle with exceptional accuracy and balanced stopping power."},railgun:{code:"RG-X",role:"EXOTIC",tier:"ELITE",description:"Blacksite electromagnetic technology delivering devastating single-shot force."}},js={pistol:"Pistol",rifle:"Rifle",shotgun:"Shotgun",sniper:"Sniper",smg:"SMG",lmg:"LMG",dmr:"DMR",vector:"Vector",famas:"FAMAS",plasma:"Plasma",railgun:"Railgun"};function Xx(n){const t=`; ${document.cookie}`.split(`; ${n}=`);return t.length===2?t.pop().split(";").shift():null}function qx(n,e,t=365){const i=new Date;i.setTime(i.getTime()+t*24*60*60*1e3),document.cookie=`${n}=${e};expires=${i.toUTCString()};path=/;SameSite=Strict`}function Vl(){let n=Le.getItem("tacticstrike_uuid");return n||(n=Xx("tacticstrike_uuid")),n||(n="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){const t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})),Le.setItem("tacticstrike_uuid",n),qx("tacticstrike_uuid",n,365),n}function Cs(){try{const n=window.AudioContext||window.webkitAudioContext;if(!n)return;const e=new n,t=e.createOscillator(),i=e.createGain();t.type="sawtooth",t.frequency.setValueAtTime(120,e.currentTime),i.gain.setValueAtTime(.12,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.15),t.connect(i),i.connect(e.destination),t.start(),t.stop(e.currentTime+.15)}catch{}}function Hl(){parseInt(Le.getItem("tacticstrike_rp")||"0");const n=document.querySelectorAll("#menu-weapon-selector .weapon-btn");n.forEach(i=>{const s=i.dataset.weapon,a=On[s],r=co(s);let o=!1;try{o=JSON.parse(Le.getItem("tacticstrike_purchased_weapons")||"[]").includes(s)}catch{}if(i.classList.toggle("owned",o),a&&!r)i.classList.add("locked"),i.innerHTML=`🔒 ${js[s]} <span style="font-size:7px; display:block; color:#ff3c3c; margin-top:2.5px; font-family:var(--font-title); font-weight:bold;">${a.rank}</span>`;else{i.classList.remove("locked");const l=js[s]||s;i.innerHTML=l}});const e=document.querySelectorAll(".weapon-option");e.forEach(i=>{const s=i.dataset.weapon,a=On[s],r=co(s);let o=!1;try{o=JSON.parse(Le.getItem("tacticstrike_purchased_weapons")||"[]").includes(s)}catch{}i.classList.toggle("owned",o);let l=i.querySelector(".lock-badge");a&&!r?(i.classList.add("locked"),l||(l=document.createElement("span"),l.className="lock-badge",i.appendChild(l)),l.innerHTML=`🔒 <span style="font-size:8px; font-weight:bold; color:#ff3c3c; margin-left:2px;">${a.rank}</span>`,l.style.display="inline-flex"):(i.classList.remove("locked"),l&&(l.style.display="none"))}),On[ct]&&!co(ct)&&(ct="pistol",Le.setItem("tacticstrike_player_weapon","pistol"),n.forEach(i=>{i.dataset.weapon==="pistol"?i.classList.add("active"):i.classList.remove("active")}),e.forEach(i=>{i.dataset.weapon==="pistol"?i.classList.add("active"):i.classList.remove("active")}),Es("pistol"))}let ie=null,se=null,at=null,Zs=!1,er="",vn=null,At="Operative",ct="pistol",Zt="cyan",Ht="1v1",Ws=!1,hs=[],fi="menu",Ei=Le.getItem("tacticstrike_qp_style")||"realistic",fn=Le.getItem("tacticstrike_selected_map")||"manor";function bs(){try{return JSON.parse(localStorage.getItem("tacticstrike_career")||'{"wins":0,"losses":0}')}catch{return{wins:0,losses:0}}}function Dd(n){try{localStorage.setItem("tacticstrike_career",JSON.stringify(n))}catch{}}function Gl(){const n=bs(),e=n.wins+n.losses,t=e>0?Math.round(n.wins/e*100):null,i=document.getElementById("stat-wins"),s=document.getElementById("stat-losses"),a=document.getElementById("stat-winpct");i&&(i.innerText=n.wins),s&&(s.innerText=n.losses),a&&(a.innerText=t!==null?`${t}%`:"—")}function mr(n){const e=bs();n?e.wins++:e.losses++,Dd(e),Gl()}function $x(n,e){if(n)try{const t=localStorage.getItem("tacticstrike_h2h")||"{}",i=JSON.parse(t);i[n]||(i[n]={wins:0,losses:0}),e?i[n].wins++:i[n].losses++,localStorage.setItem("tacticstrike_h2h",JSON.stringify(i))}catch(t){console.warn("Failed to record H2H result:",t)}}function Yx(){const n=document.getElementById("h2h-history-container");if(!n)return;let e={};try{e=JSON.parse(localStorage.getItem("tacticstrike_h2h")||"{}")}catch{e={}}const t=Object.entries(e);if(t.length===0){n.innerHTML='<div style="color: var(--text-muted); font-size: 10px; text-align: center; padding: 10px 0; letter-spacing: 0.5px;">No head-to-head records found. Play a match to start tracking!</div>';return}t.sort((s,a)=>a[1].wins+a[1].losses-(s[1].wins+s[1].losses));let i="";t.forEach(([s,a])=>{const r=a.wins+a.losses,o=r>0?Math.round(a.wins/r*100):0;i+=`
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 4px; font-family: var(--font-title);">
        <span style="color: #fff; font-size: 11px; font-weight: bold; letter-spacing: 0.5px;">${zn(s).toUpperCase()}</span>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 10px; color: var(--text-muted); letter-spacing: 0.5px;">RECORD: <strong style="color: #39db14;">${a.wins}W</strong> - <strong style="color: #ff3c3c;">${a.losses}L</strong></span>
          <span style="font-size: 9px; background: rgba(102, 252, 241, 0.1); border: 1px solid rgba(102, 252, 241, 0.3); color: #66fcf1; padding: 2px 5px; border-radius: 3px; font-weight: bold; letter-spacing: 0.5px;">${o}% WR</span>
        </div>
      </div>
    `}),n.innerHTML=i}const vt=new Audio("/Midnight_Deployment.mp3");vt.loop=!0;const Rt=new Audio("/Before_The_Starting_Bell.mp3");Rt.loop=!0;const bt=new Audio("/Into_Darkness.mp3");bt.loop=!0;let La=!1,Ot=!1;const Bt=new Audio("/Deployment_Sequence.mp3");Bt.loop=!0;Bt.volume=.15;function Nd(){if(!Ot)try{vt.pause(),vt.currentTime=0,Rt.pause(),Rt.currentTime=0,bt.pause(),bt.currentTime=0,Bt.volume=.15,Bt.loop=!0,Bt.play().catch(()=>{})}catch{}}function zt(){try{const n=window.AudioContext||window.webkitAudioContext;if(!n)return;const e=new n,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.setValueAtTime(1200,e.currentTime),t.frequency.exponentialRampToValueAtTime(600,e.currentTime+.08),i.gain.setValueAtTime(.1,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.08),t.connect(i),i.connect(e.destination),t.start(),t.stop(e.currentTime+.08)}catch{}}let $i=null;function Qi(n="tap"){if(!ze.sfxMuted)try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;$i||($i=new e),$i.state==="suspended"&&$i.resume().catch(()=>{});const t={open:{from:390,to:520,duration:.14},close:{from:510,to:370,duration:.12},confirm:{from:560,to:760,duration:.16},tap:{from:440,to:500,duration:.1}},i=t[n]||t.tap,s=$i.currentTime,a=$i.createOscillator(),r=$i.createBiquadFilter(),o=$i.createGain(),l=.035*Math.max(0,Math.min(1,ze.volume));a.type="sine",a.frequency.setValueAtTime(i.from,s),a.frequency.exponentialRampToValueAtTime(i.to,s+i.duration),r.type="lowpass",r.frequency.setValueAtTime(1800,s),r.Q.setValueAtTime(.45,s),o.gain.setValueAtTime(1e-4,s),o.gain.exponentialRampToValueAtTime(Math.max(1e-4,l),s+.012),o.gain.exponentialRampToValueAtTime(1e-4,s+i.duration),a.connect(r),r.connect(o),o.connect($i.destination),a.start(s),a.stop(s+i.duration+.02)}catch{}}let tr=null;const Kx=[{key:"knife",text:"Equip your Melee Knife (Press 2) to move 15% faster."},{key:"flashbang",text:"Throw a Flash Grenade (Press 3) to blind enemies in line-of-sight."},{key:"dash",text:"Press Space to dash forward in the direction you are facing (10s CD)."},{key:"flashlight",text:"Toggle your Flashlight (Press F) to spot enemies in dark rooms."}];function xl(){const n=document.getElementById("gameplay-tips-panel");if(!n)return;const e=Kx.filter(s=>localStorage.getItem(`tacticstrike_hide_tip_${s.key}`)!=="true");if(e.length===0){n.style.display="none",tr=null;return}const t=e[Math.floor(Math.random()*e.length)];tr=t.key;const i=document.getElementById("tip-text");i&&(i.innerText=t.text),n.style.display="flex"}function jx(){const n=document.getElementById("btn-dismiss-tip");n&&n.addEventListener("click",()=>{if(tr){localStorage.setItem(`tacticstrike_hide_tip_${tr}`,"true");const e=document.getElementById("gameplay-tips-panel");e&&(e.style.display="none"),setTimeout(xl,1e3)}})}window.stopAllMusic=function(){try{vt.pause(),vt.currentTime=0,Rt.pause(),Rt.currentTime=0,Bt.pause(),Bt.currentTime=0,bt.pause(),bt.currentTime=0,se&&se.sound&&se.sound.stopBearMusic()}catch{}};function kd(){if(!Ot)try{vt.pause(),vt.currentTime=0,Bt.pause(),Bt.currentTime=0,bt.pause(),bt.currentTime=0,Rt.currentTime=0,Rt.play().catch(()=>{})}catch{}}function Wl(){if(!Ot)try{Rt.pause(),Rt.currentTime=0,Bt.pause(),Bt.currentTime=0,bt.pause(),bt.currentTime=0,vt.currentTime=0,vt.play().catch(()=>{})}catch{}}function Ud(){try{if(Ot)return;if(bt.pause(),bt.currentTime=0,se&&se.matchMode==="sabotage"||fi==="practice"&&Ht==="sabotage"){vt.pause(),vt.currentTime=0,Rt.pause(),Rt.currentTime=0,Bt.pause(),Bt.currentTime=0,se&&se.gameState==="playing"&&se.sound&&se.sound.playBearMusic();return}fi==="casual"?(vt.pause(),vt.currentTime=0,Rt.pause(),Rt.currentTime=0,Bt.volume=.04,Bt.loop=!0,Bt.play().catch(()=>{})):(Bt.pause(),Bt.currentTime=0,Rt.pause(),Rt.currentTime=0,vt.volume=.04,vt.play().catch(()=>{}))}catch{}}function ir(n){const e=document.getElementById("ranked-video-overlay"),t=document.getElementById("ranked-video");if(!e||!t){n();return}t.muted=!!ze.sfxMuted,t.volume=typeof ze.volume=="number"?ze.volume:.5,t.currentTime=0,e.style.display="flex",e.offsetHeight,e.style.opacity="1",window.stopAllMusic(),t.play().then(()=>{const i=setTimeout(()=>{e.style.opacity="0"},4400),s=setTimeout(()=>{t.pause(),e.style.display="none",n()},5e3),a=()=>{clearTimeout(i),clearTimeout(s),e.style.opacity="0",setTimeout(()=>{e.style.display="none",n()},500),t.removeEventListener("ended",a)};t.addEventListener("ended",a)}).catch(i=>{console.warn("Ranked video playback failed or blocked by browser:",i),e.style.opacity="0",e.style.display="none",n()})}const _n=[{id:"recruit",label:"RECRUIT",minRP:0,maxRP:999,color:"#8a9bb5",icon:"▪"},{id:"veteran",label:"VETERAN",minRP:1e3,maxRP:3999,color:"#e8c84a",icon:"◆"},{id:"elite",label:"ELITE",minRP:4e3,maxRP:1/0,color:"#ff6ef7",icon:"★"}];function Fd(n){for(let e=_n.length-1;e>=0;e--)if(n>=_n[e].minRP)return _n[e];return _n[0]}function Zx(n){for(let e=_n.length-1;e>=0;e--)if(n>=_n[e].minRP)return e;return 0}function Xl(){const n=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),e=Zx(n),t=_n[e],i=_n[e+1],s=document.getElementById("menu-rank-icon"),a=document.getElementById("menu-rank-label"),r=document.getElementById("menu-rank-rp"),o=document.getElementById("menu-rank-progress"),l=document.getElementById("menu-rank-progress-text");if(s&&(s.innerText=t.icon,s.style.color=t.color,s.style.textShadow=`0 0 14px ${t.color}80`),a&&(a.innerText=t.label,a.style.color=t.color,a.style.textShadow=`0 0 16px ${t.color}66`),r&&(r.innerText=`${n} RP`),o&&l)if(i){const c=i.minRP-t.minRP,h=Math.min(100,Math.max(0,(n-t.minRP)/c*100));o.style.width=`${h}%`,o.style.background=`linear-gradient(90deg, ${t.color}, ${i.color})`,o.style.boxShadow=`0 0 8px ${i.color}66`,l.innerText=`${n} / ${i.minRP} RP TO ${i.label}`}else o.style.width="100%",o.style.background=`linear-gradient(90deg, ${t.color}, ${t.color})`,o.style.boxShadow=`0 0 10px ${t.color}80`,l.innerText="MAX RANK ACHIEVED"}let Vs=!1,yi=null,qt=null;vt.addEventListener("ended",()=>{Ot||(vt.currentTime=0,vt.play().catch(()=>{}))});Rt.addEventListener("ended",()=>{Ot||(Rt.currentTime=0,Rt.play().catch(()=>{}))});function Bd(){if(La||Ot){Da();return}const n=document.querySelector(".screen.active");if(n&&n.id==="game"||bi.game&&bi.game.classList.contains("active"))return;const t=document.getElementById("deploy-modal");if(t&&t.classList.contains("active")){bt.volume=.15,bt.play().then(()=>{La=!0,Da()}).catch(()=>{});return}n&&(n.id==="lobby-screen"||n.id==="matchmaking-screen")?Rt.play().then(()=>{La=!0,Da()}).catch(()=>{}):vt.play().then(()=>{La=!0,Da()}).catch(()=>{})}function Da(){["click","keydown","touchstart"].forEach(n=>{window.removeEventListener(n,Bd)})}["click","keydown","touchstart"].forEach(n=>{window.addEventListener(n,Bd)});function Od(){if(Ot)vt.volume=0,Rt.volume=0,bt.volume=0;else{const n=bi.game&&bi.game.classList.contains("active");vt.volume=n?.04:.15,Rt.volume=.15,bt.volume=.15}}function vl(){const n=document.getElementById("setting-music-toggle"),e=document.getElementById("settings-music-action"),t=document.getElementById("settings-music-status");n&&(n.classList.toggle("is-muted",Ot),n.setAttribute("aria-pressed",String(Ot)),e&&(e.innerText=Ot?"UNMUTE MUSIC":"MUTE MUSIC"),t&&(t.innerText=Ot?"MUSIC IS OFF":"MUSIC IS PLAYING"))}function Jx(n){if(ze.musicMuted=n,Ot=n,Ot)window.stopAllMusic();else{const e=document.querySelector(".screen.active"),t=document.getElementById("deploy-modal");t&&t.classList.contains("active")?(bt.currentTime=0,bt.play().catch(()=>{})):e&&(e.id==="lobby-screen"||e.id==="matchmaking-screen")?kd():e&&e.id==="game-screen"?Ud():Wl()}Od(),vl(),Ln()}const ze={volume:.5,blood:!0,shadows:!0,laser:!0,musicMuted:!1,sfxMuted:!1,performanceMode:!1,showFps:!1};function Qx(){const n=Le.getItem("tacticstrike_settings"),e=document.getElementById("setting-show-fps");if(n)try{const s=JSON.parse(n);delete s.serverUrl,Object.assign(ze,s),yt.volume&&(yt.volume.value=ze.volume*100),yt.volumeVal&&(yt.volumeVal.innerText=`${Math.round(ze.volume*100)}%`),yt.blood&&(yt.blood.checked=ze.blood),yt.shadows&&(yt.shadows.checked=ze.shadows),yt.laser&&(yt.laser.checked=ze.laser),e&&(e.checked=!!ze.showFps);const a=document.getElementById("fps-counter");a&&(a.style.display=ze.showFps?"block":"none"),Ot=!!ze.musicMuted;const r=document.getElementById("setting-mute-sfx");r&&(r.checked=!!ze.sfxMuted)}catch(s){console.error(s)}vl(),e&&e.addEventListener("change",s=>{ze.showFps=s.target.checked;const a=document.getElementById("fps-counter");a&&(a.style.display=ze.showFps?"block":"none"),Ln()}),yt.volume&&yt.volume.addEventListener("input",s=>{const a=parseInt(s.target.value);ze.volume=a/100,yt.volumeVal&&(yt.volumeVal.innerText=`${a}%`),Ln()}),yt.blood&&yt.blood.addEventListener("change",s=>{ze.blood=s.target.checked,Ln()}),yt.shadows&&yt.shadows.addEventListener("change",s=>{ze.shadows=s.target.checked,Ln()}),yt.laser&&yt.laser.addEventListener("change",s=>{ze.laser=s.target.checked,Ln()});const t=document.getElementById("setting-music-toggle");t&&t.addEventListener("click",()=>{ze.sfxMuted||zt(),Jx(!Ot)});const i=document.getElementById("setting-mute-sfx");i&&i.addEventListener("change",s=>{ze.sfxMuted=s.target.checked,Ln()}),Qe.openMatchSettings&&Qe.openMatchSettings.addEventListener("click",()=>{ze.sfxMuted||zt(),Yx(),vl(),yt.modal&&yt.modal.classList.add("active")}),Qe.closeSettings&&Qe.closeSettings.addEventListener("click",()=>{yt.modal&&yt.modal.classList.remove("active")})}function Ln(){if(Le.setItem("tacticstrike_settings",JSON.stringify(ze)),se){const n=ze.sfxMuted?0:ze.volume;se.updateSettings({...ze,volume:n})}}function Jt(n){const e=document.getElementById("deploy-modal");if(e&&e.classList.remove("active"),Object.keys(bi).forEach(t=>{t===n?(bi[t].classList.add("active"),(t==="matchmaking"||t==="lobby")&&(bi[t].style.display="flex")):(bi[t].classList.remove("active"),t==="matchmaking"&&(bi[t].style.display="none"))}),n!=="matchmaking"&&window.mmDotsInterval&&(clearInterval(window.mmDotsInterval),window.mmDotsInterval=null),n==="menu")Wl();else if(n==="lobby")Nd();else if(n==="matchmaking")kd();else if(n==="game")Ud(),Zl(!1),window.tipInterval&&clearInterval(window.tipInterval),xl(),window.tipInterval=setInterval(xl,18e3);else{window.tipInterval&&(clearInterval(window.tipInterval),window.tipInterval=null);const t=document.getElementById("gameplay-tips-panel");t&&(t.style.display="none")}n==="menu"&&nt&&nt.chatMessages&&(nt.chatMessages.innerHTML=""),Od()}function ev(){const n=document.querySelectorAll(".weapon-option");n.forEach(e=>{e.addEventListener("click",t=>{if(e.classList.contains("locked")){t.preventDefault(),t.stopPropagation(),Cs();return}n.forEach(i=>i.classList.remove("active")),e.classList.add("active"),ct=e.dataset.weapon,Le.setItem("tacticstrike_player_weapon",ct),Es(ct),zt(),ie&&at&&ie.emit("select-weapon",{weapon:ct})})}),Es("pistol")}function Es(n){const e=pr[n];if(!e||!nt.weaponStats)return;const t=e.damagePct??Math.min(100,Math.round(e.damage/95*100)),i=e.fireRatePct??Math.min(100,Math.round(e.fireRate)),s=e.accuracy??75,r=n==="plasma"||n==="railgun"?"#ff6ef7":"",o=r?`background: ${r};`:"";nt.weaponStats.innerHTML=`
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
      <div class="stat-bar"><div class="bar-fill" style="width: ${s}%; ${o}"></div></div>
    </div>
    <div class="stat-row">
      <span>MAG CAPACITY:</span>
      <span class="stat-val">${e.magSize} rounds</span>
    </div>
  `}function un(n){var c;if(hs=n,!nt.playersList)return;nt.playersList.innerHTML="";const e=Ht==="2v2"?4:2;for(let h=0;h<e;h++){const f=n[h],d=document.createElement("div");if(f){d.className=`player-slot active ${f.ready?"ready":""}`;const u=((c=pr[f.weapon])==null?void 0:c.name)||f.weapon,v={cyan:"#66fcf1",green:"#39db14",purple:"#9d3bff",orange:"#ff7f3b",yellow:"#ffd700",red:"#ff3c3c"}[f.color]||"#66fcf1",g=Ht==="2v2"?`TEAM ${h%2===0?"1":"2"}`:h===0?"HOST":"GUEST",m=f.rp||0,M=Fd(m);d.innerHTML=`
        <div class="player-info">
          <span class="player-name" style="color: ${v};">
            <span style="color: ${M.color}; margin-right: 4px;">${M.icon}</span>${zn(f.name)} ${f.id===ie.id?"(YOU)":""}
          </span>
          <span class="player-weapon-desc">RANK: <span style="color:${M.color}">${M.label}</span> | WEAPON: ${u}</span>
        </div>
        <div class="player-badge ${h%2===0?"host":"guest"}">
          ${g}
        </div>
        <div class="status-badge ${f.ready?"ready-status":"waiting"}">
          ${f.ready?"READY":"CHOOSING..."}
        </div>
      `}else{d.className="player-slot empty";const u=h+1,p=Ht==="2v2"?` (TEAM ${h%2===0?"1":"2"})`:"";d.innerHTML=`<div class="slot-status">WAITING FOR OPERATIVE ${u}${p}...</div>`}if(nt.playersList.appendChild(d),Ht==="1v1"&&h===0){const u=document.createElement("div");u.className="vs-divider",u.innerText="VS",nt.playersList.appendChild(u)}}const t=n.find(h=>h.id===ie.id);t&&Qe.readyToggle&&(Ws=t.ready,Qe.readyToggle.className=Ws?"btn secondary":"btn primary",Qe.readyToggle.innerText=Ws?"CANCEL READY":"READY TO DEPLOY");const i=document.getElementById("lobby-map-selector-container"),s=document.getElementById("lobby-map-select");if(i&&s)if(fi==="ranked")i.style.display="none";else{i.style.display="block";const h=n[0]&&n[0].id===ie.id;s.disabled=!h}const a=document.getElementById("lobby-mode-selector-container"),r=document.getElementById("lobby-mode-select");if(a&&r)if(fi==="ranked")a.style.display="none";else{a.style.display="block";const h=n[0]&&n[0].id===ie.id;r.disabled=!h}const o=document.getElementById("lobby-style-selector-container"),l=document.getElementById("lobby-style-select");if(o&&l)if(fi==="ranked")o.style.display="none";else{o.style.display="block";const h=n[0]&&n[0].id===ie.id;l.disabled=!h}}function xi(){const n=(se==null?void 0:se.mode)==="online"&&se.active,e=!!(at&&(!(ie!=null&&ie.connected)||Zs||document.hidden)),t=ie!=null&&ie.connected?document.hidden?"Match paused while this tab is in the background":er:"Connection interrupted · reconnecting. Match paused.";n&&se.setNetworkPaused(e,t);let i=document.getElementById("match-connection-status");!i&&e&&(i=document.createElement("div"),i.id="match-connection-status",i.setAttribute("role","status"),i.style.cssText="position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:10000;max-width:calc(100vw - 40px);padding:12px 20px;border:1px solid #d8a952;border-radius:8px;background:#172126;color:#fff0c8;font:600 14px/1.5 system-ui;text-align:center;pointer-events:none;",document.body.appendChild(i)),i&&(i.hidden=!e,i.textContent=t)}function oo(){clearTimeout(vn),vn=null,at=null,Zs=!1,Le.removeItem("tacticstrike_active_match"),xi(),(se==null?void 0:se.mode)==="online"?se.endGameDueToDisconnect("The match connection could not be restored. Please join a new match."):(ds(),Jt("menu"),vi("The room connection expired. Please join again."))}document.addEventListener("visibilitychange",()=>{ie!=null&&ie.connected&&ie.emit("match-visibility",{hidden:document.hidden}),(se==null?void 0:se.mode)==="offline"&&se.active&&se.setNetworkPaused(document.hidden),xi()});function Xa(){if(ie)return;const n=kh();ie=Ba(n,{auth:e=>e({accountToken:gt.token})}),ie.on("account-name",({name:e})=>{At=e;const t=document.getElementById("operative-name");t&&(t.textContent=e),Zl(!1)}),window.AppSocket=ie,ie.on("connect_error",()=>{console.warn("Failed to connect to multiplayer server."),xi()}),ie.on("disconnect",e=>{e!=="io client disconnect"&&(Zs=!0,er="Restoring the match connection…",at&&!vn&&(vn=setTimeout(oo,12e4)),xi())}),ie.on("room-connection-state",e=>{at&&e.roomId!==at||(Zs=!!e.paused,er=e.reason||"",xi())}),ie.on("room-recovered",e=>{if(at&&e.roomId!==at){oo();return}e.roomId&&un(e.players),xi()}),ie.on("connect",()=>{if(console.log("Socket connected."),clearTimeout(vn),vn=null,at&&!ie.recovered){oo();return}ie.emit("match-visibility",{hidden:document.hidden}),xi();const e=Vl(),t=parseInt(Le.getItem("tacticstrike_rp")||"0"),i=bs(),s=parseInt(Le.getItem("tacticstrike_credits")||"0");let a=[];try{a=JSON.parse(Le.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}ie.emit("sync-device",{uuid:e,rp:t,wins:i.wins,losses:i.losses,name:At,credits:s,purchasedWeapons:a})}),ie.on("device-synced",e=>{console.log("Device synced with database:",e);const t=parseInt(Le.getItem("tacticstrike_rp")||"0"),i=Math.max(t,e.rp||0);Le.setItem("tacticstrike_rp",String(i));const s=bs(),a=Math.max(s.wins,e.wins||0),r=Math.max(s.losses,e.losses||0);Dd({wins:a,losses:r});const o=parseInt(Le.getItem("tacticstrike_credits")||"0"),l=Math.max(o,e.credits||0);Le.setItem("tacticstrike_credits",String(l));let c=[];try{c=JSON.parse(Le.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}const h=Array.from(new Set([...c,...e.purchasedWeapons||[]]));Le.setItem("tacticstrike_purchased_weapons",JSON.stringify(h)),Xl(),Gl(),Hl()}),ie.on("register-response",e=>{e.success||console.warn("Register failed:",e.error)}),ie.on("login-response",e=>{e.success||console.warn("Login failed:",e.error)}),ie.on("room-created",({roomId:e,players:t,autoMatch:i,mode:s,mapId:a,renderStyle:r,isRanked:o})=>{at=e,xi(),s&&(Ht=s),fi=o?"ranked":"casual",nt.roomCode.innerText=e;const l=document.getElementById("lobby-map-select");l&&a&&(l.value=a);const c=document.getElementById("lobby-mode-select");c&&s&&(c.value=s);const h=document.getElementById("lobby-style-select");h&&r&&(h.value=r,Ei=r),i?(un(t),vi("Created matchmaking room. Waiting for opponent...")):(Jt("lobby"),un(t),vi(`Lobby created. Share code [${e}] with a friend.`))}),ie.on("room-joined",({roomId:e,players:t,mode:i,mapId:s,renderStyle:a,isRanked:r})=>{at=e,xi(),i&&(Ht=i),fi=r?"ranked":"casual",nt.roomCode.innerText=e,Jt("lobby"),un(t);const o=document.getElementById("lobby-map-select");o&&s&&(o.value=s);const l=document.getElementById("lobby-mode-select");l&&i&&(l.value=i);const c=document.getElementById("lobby-style-select");c&&a&&(c.value=a,Ei=a),vi(`Joined lobby: ${e}`),yi&&(clearTimeout(yi),yi=null),qt&&(clearTimeout(qt),qt=null),Vs=!1}),ie.on("room-error",e=>{alert(e)}),ie.on("player-joined",({players:e})=>{un(e);const t=e.find(s=>s.id!==ie.id);t&&vi(`${t.name} entered the lobby.`);const i=document.querySelector(".screen.active");i&&i.id==="matchmaking-screen"&&(qt&&(clearTimeout(qt),qt=null),Jt("lobby"))}),ie.on("players-update",({players:e})=>{un(e)}),ie.on("lobby-map-update",({mapId:e})=>{const t=document.getElementById("lobby-map-select");t&&(t.value=e),vi(`Host updated mission area to: ${e==="cyberlab"?"Neon Cyber-Lab":e==="arena"?"Neon Arena":"Residential Manor"}`)}),ie.on("lobby-mode-update",({mode:e})=>{const t=document.getElementById("lobby-mode-select");t&&(t.value=e),Ht=e;let i="Duel 1v1";e==="sabotage"&&(i="Sabotage (Task Survival)"),vi(`Host updated game mode to: ${i}`)}),ie.on("lobby-style-update",({renderStyle:e})=>{const t=document.getElementById("lobby-style-select");t&&(t.value=e),Ei=e,vi(`Host updated render style to: ${e==="competitive"?"Competitive":"Realistic"}`)}),ie.on("player-left",({players:e,message:t})=>{un(e),vi(t);const i=document.querySelector(".screen.active"),s=i&&i.id==="game-screen";if(se&&s)if(se.active&&se.mode==="online"&&(se.gameState==="playing"||se.gameState==="countdown"||se.gameState==="replay")){if(mr(!0),se.isRanked){const r=parseInt(localStorage.getItem("tacticstrike_rp")||"0")+80;localStorage.setItem("tacticstrike_rp",String(r)),se.localPlayer&&(se.localPlayer.rp=r,se.localPlayer.rank=se.localPlayer._calcRank(r))}localStorage.removeItem("tacticstrike_active_match"),se.endGameDueToDisconnect(t)}else if(se.gameState==="match-over"){const a=document.getElementById("rematch-status");a&&(a.innerText="Opponent left the room.");const r=document.getElementById("btn-rematch");r&&(r.disabled=!0,r.innerText="OPPONENT LEFT")}else localStorage.removeItem("tacticstrike_active_match"),se.endGameDueToDisconnect(t)}),ie.on("match-start",({players:e,seed:t,isRanked:i,mode:s,mapId:a,renderStyle:r})=>{fi=i?"ranked":"casual",r&&(Ei=r),xn&&xn.classList.remove("active"),ir(()=>{const l=e.findIndex(c=>c.id===ie.id);nt.chatMessages.innerHTML="",localStorage.setItem("tacticstrike_active_match",i?"ranked":"casual"),se&&se.destroy(),se=new Qa("game-canvas",{mode:"online",socket:ie,localPlayerId:ie.id,localPlayerName:At,localWeapon:ct,localColor:Zt,localPlayerIndex:l,players:e,seed:t,mapId:a||"manor",settings:{...ze,volume:ze.sfxMuted?0:ze.volume},matchMode:s||Ht,isRanked:!!i,qpRenderStyle:Ei,onMatchEnd:nr,onKillFeed:sr}),Jt("game"),xi()})}),ie.on("opponent-requested-rematch",e=>{const t=document.getElementById("rematch-status");let i="Opponent";if(se&&e&&e.playerId){const s=se.players.find(a=>a.id===e.playerId);s&&(i=s.name)}t&&(t.innerText=`${i} requested a rematch! Click REMATCH to accept.`)})}function ds(){clearTimeout(vn),vn=null,Zs=!1,er="",ie&&(ie.disconnect(),ie=null,at=null,window.AppSocket=null),xi(),nt&&nt.roomCode&&(nt.roomCode.innerText="-----")}function Ah(){const n=document.getElementById("deploy-modal");n&&n.classList.remove("active"),fi="practice",ir(()=>{nt.chatMessages.innerHTML="",se&&se.destroy();const t=[{id:"player",name:At,weapon:ct,color:Zt}];Ht==="2v2"?(t.push({id:"bot_enemy_1",name:"Bot Miller (Enemy)",weapon:Sn(),color:"red"}),t.push({id:"bot_teammate",name:"Bot Ramirez (Teammate)",weapon:Sn(),color:"green"}),t.push({id:"bot_enemy_2",name:"Bot Cooper (Enemy)",weapon:Sn(),color:"orange"})):t.push({id:"bot_enemy_1",name:"Bot Miller (Enemy)",weapon:Sn(),color:"red"}),se=new Qa("game-canvas",{mode:"offline",socket:null,localPlayerId:"player",localPlayerName:At,localWeapon:ct,localColor:Zt,localPlayerIndex:0,players:t,seed:Math.random(),mapId:fn,settings:{...ze,volume:ze.sfxMuted?0:ze.volume},matchMode:Ht,isRanked:!1,qpRenderStyle:Ei,onMatchEnd:nr,onKillFeed:sr}),Jt("game")})}function Sn(){return["pistol","rifle","shotgun","sniper","smg","lmg","dmr","vector","famas"][Math.floor(Math.random()*9)]}function nr(n){localStorage.removeItem("tacticstrike_active_match"),xn&&xn.classList.add("active");const e=!!n.isWin;let t="";if(se&&se.mode==="online"){mr(e);const p=se.players.find(m=>m.id!==ie.id);p&&$x(p.name,e);const v=parseInt(Le.getItem("tacticstrike_credits")||"0");let g=v;if(se.isRanked&&e&&(g=v+50,Le.setItem("tacticstrike_credits",String(g)),t=' <span style="color:#ffd700; font-size:10px;">(+50 Credits Ranked Win Bonus!)</span>'),ie){const m=Vl(),M=parseInt(Le.getItem("tacticstrike_rp")||"0"),_=bs();let x=[];try{x=JSON.parse(Le.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}ie.emit("sync-device",{uuid:m,rp:M,wins:_.wins,losses:_.losses,name:At,credits:g,purchasedWeapons:x})}}const i=document.getElementById("match-result-title"),s=document.getElementById("match-result-subtitle");i&&(e?(i.innerText="MISSION ACCOMPLISHED",i.className="result-title win"):(i.innerText="MISSION FAILED",i.className="result-title lose")),s&&(e?s.innerText="You successfully eliminated the target operative.":s.innerText="You were eliminated by the target operative.");let a="Unknown Operative";if(se){const p=se.players.find(v=>v.id===n.winnerId);p&&(a=p.name)}const r=document.getElementById("match-winner-name");r&&(r.innerText=`WINNER: ${a}`,r.style.color=e?"#39db14":"#ff3c3c");const o=document.getElementById("stat-rounds-won");o&&(o.innerText=n.roundsWon||0);const l=document.getElementById("stat-damage-dealt");l&&(l.innerText=Math.round(n.damageDealt||0));const c=document.getElementById("stat-accuracy");c&&(c.innerText=`${Math.round(n.accuracy||0)}%`);const h=document.getElementById("stat-shots-fired");h&&(h.innerText=n.shotsFired||0);const f=document.getElementById("rematch-status");f&&(f.innerText="");const d=document.getElementById("btn-rematch");d&&(d.disabled=!1,d.innerText="REMATCH"),Qe.returnLobby&&(se&&se.isRanked?Qe.returnLobby.innerText="RETURN TO MENU":Qe.returnLobby.innerText="RETURN TO LOBBY");const u=document.getElementById("rank-result-panel");if(u){if(se&&se.isRanked&&n.newRank){const p=n.newRank,v=n.rpDelta||0,g=v>=0?`+${v} RP`:`${v} RP`,m=v>=0?"#39ff14":"#ff3c3c";u.innerHTML=`
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
              <div style="font-family:var(--font-title);font-size:16px;color:#fff;font-weight:700;">${n.newRP} RP</div>
              <div style="font-size:12px;color:${m};font-family:var(--font-title);margin-top:2px;">${g}</div>
            </div>
          </div>
          ${n.rankChanged?`<div style="margin-top:10px;padding:6px 12px;background:rgba(${v>=0?"57,255,20":"255,60,60"},0.12);border:1px solid ${v>=0?"#39ff14":"#ff3c3c"};border-radius:6px;font-family:var(--font-title);font-size:10px;color:${v>=0?"#39ff14":"#ff3c3c"};text-align:center;letter-spacing:1px;">${v>=0?"▲ RANK UP!":"▼ RANK DOWN"} ${n.oldRankLabel} → ${p.label}</div>`:""}
        `,u.style.display="block"}else u.innerHTML='<div style="font-family:var(--font-title); font-size:10px; color:var(--text-muted); text-align:center; letter-spacing:1.5px;">CASUAL MATCH - NO RANK EFFECT</div>',u.style.display="block";if(t){const p=document.createElement("div");p.style.cssText="font-family:var(--font-title); font-size:10px; text-align:center; margin-top:8px;",p.innerHTML=t,u.appendChild(p)}}}function tv(){Hx();const n=document.getElementById("btn-deploy-main"),e=document.getElementById("btn-close-deploy"),t=document.getElementById("deploy-modal");n&&t&&n.addEventListener("click",()=>{t.classList.add("active");const f=t.querySelector(".deploy-card");f&&(f.scrollTop=0),zt(),vt.pause(),vt.currentTime=0,Ot||(bt.volume=.15,bt.currentTime=0,bt.play().catch(()=>{}))}),e&&t&&e.addEventListener("click",()=>{t.classList.remove("active"),zt(),bt.pause(),bt.currentTime=0,Ot||Wl()}),Qe.practiceBot&&Qe.practiceBot.addEventListener("click",()=>{Ah()}),Qe.btnAmongUs&&Qe.btnAmongUs.addEventListener("click",()=>{const f=document.getElementById("deploy-modal");f&&f.classList.remove("active"),fi="practice",ir(()=>{nt.chatMessages.innerHTML="",se&&se.destroy();const u=[{id:"player",name:At,weapon:"none",color:Zt},{id:"bot_enemy_1",name:"Impostor Killer",weapon:"pistol",color:"red"}];se=new Qa("game-canvas",{mode:"offline",socket:null,localPlayerId:"player",localPlayerName:At,localWeapon:"none",localColor:Zt,localPlayerIndex:0,players:u,seed:Math.random(),mapId:fn,settings:{...ze,volume:ze.sfxMuted?0:ze.volume},matchMode:"sabotage",isRanked:!1,qpRenderStyle:Ei,onMatchEnd:nr,onKillFeed:sr}),Jt("game")})}),Qe.createRoom&&Qe.createRoom.addEventListener("click",()=>{const f=document.getElementById("deploy-modal");f&&f.classList.remove("active"),Xa(),ie&&ie.emit("create-room",{playerName:At,mode:Ht,color:Zt,mapId:fn,weapon:ct,renderStyle:Ei})}),Qe.joinRoom&&Qe.joinRoom.addEventListener("click",()=>{const f=document.getElementById("deploy-modal");f&&f.classList.remove("active");const d=ft.roomCode?ft.roomCode.value.toUpperCase().trim():"";if(!d||d.length!==5){alert("Please enter a valid 5-character room code.");return}Xa(),ie&&ie.emit("join-room",{roomId:d,playerName:At,color:Zt,weapon:ct})});function i(f){const d=parseInt(localStorage.getItem("tacticstrike_mm_ban_until")||"0");if(Date.now()<d){const p=d-Date.now(),v=Math.floor(p/6e4),g=Math.floor(p%6e4/1e3);ar({title:"MATCHMAKING BAN ACTIVE",message:`${v}:${String(g).padStart(2,"0")} remaining.

Leaving ranked matches results in a temporary ban.`,confirmText:"UNDERSTOOD",tone:"ban"});return}const u=document.getElementById("deploy-modal");if(u&&u.classList.remove("active"),Xa(),ie){const p=parseInt(localStorage.getItem("tacticstrike_rp")||"0");Vs=!1;const v=Ht+"_"+f;ie.emit("auto-match",{playerName:At,mode:v,color:Zt,rp:p,rankStrict:!0,weapon:ct}),Jt("matchmaking");const g=document.getElementById("mm-rank-display"),m=document.getElementById("mm-rank-icon"),M=document.getElementById("mm-timer"),_=document.getElementById("mm-expand-notice"),x=Fd(p);g&&(g.innerText=x.label),m&&(m.innerText=x.icon,m.style.color=x.color),M&&(M.innerText="0s"),_&&(_.innerText="Searching within your skill bracket...");let y=0;window.mmInterval&&clearInterval(window.mmInterval),window.mmInterval=setInterval(()=>{y++,M&&(M.innerText=`${y}s`)},1e3);let E=0;const A=document.getElementById("mm-dots");window.mmDotsInterval&&clearInterval(window.mmDotsInterval),window.mmDotsInterval=setInterval(()=>{E=(E+1)%4,A&&(A.innerText=".".repeat(E))},500),yi&&clearTimeout(yi),yi=setTimeout(()=>{!Vs&&ie&&ie.connected&&(!at||hs&&hs.length===1)&&(Vs=!0,vi("⚡ Rank filter removed — expanding search to all ranks..."),_&&(_.innerText="⚡ Search expanded to all skill ranks!"),at&&(ie.emit("leave-room"),at=null),ie.emit("auto-match",{playerName:At,mode:v,color:Zt,rp:p,rankStrict:!1,weapon:ct}))},2e3);const S=15e3+Math.floor(Math.random()*46e3);qt&&clearTimeout(qt),qt=setTimeout(()=>{qt=null;const w=document.querySelector(".screen.active");!w||w.id!=="matchmaking-screen"||at&&hs&&hs.length>1||s(f)},S)}}function s(f){window.mmInterval&&clearInterval(window.mmInterval),window.mmDotsInterval&&clearInterval(window.mmDotsInterval),yi&&(clearTimeout(yi),yi=null),qt&&(clearTimeout(qt),qt=null),Vs=!0;const d=document.getElementById("mm-expand-notice"),u=document.getElementById("mm-dots"),p=document.getElementById("mm-timer");d&&(d.innerText="GAME FOUND — DEPLOYING..."),u&&(u.innerText=""),p&&(p.innerText=""),ie&&ie.emit("leave-room"),ds(),at=null;const v=uo();fi="ranked";const g=()=>{nt.chatMessages.innerHTML="",se&&se.destroy(),localStorage.setItem("tacticstrike_active_match","ranked");const m=[{id:"player",name:At,weapon:ct,color:Zt}];Ht==="2v2"?(m.push({id:"bot_enemy_1",name:v,weapon:Sn(),color:"red"}),m.push({id:"bot_teammate",name:uo(),weapon:Sn(),color:"green"}),m.push({id:"bot_enemy_2",name:uo(),weapon:Sn(),color:"orange"})):m.push({id:"bot_enemy_1",name:v,weapon:Sn(),color:"red"}),se=new Qa("game-canvas",{mode:"offline",socket:null,localPlayerId:"player",localPlayerName:At,localWeapon:ct,localColor:Zt,localPlayerIndex:0,players:m,seed:Math.random(),mapId:fn,settings:{...ze,volume:ze.sfxMuted?0:ze.volume},matchMode:Ht,isRanked:!0,qpRenderStyle:f,onMatchEnd:nr,onKillFeed:sr}),vi(`Game found! Playing against ${v}.`),Jt("game")};setTimeout(()=>ir(g),1200)}Qe.rankedRealistic&&Qe.rankedRealistic.addEventListener("click",()=>i("realistic")),Qe.rankedCompetitive&&Qe.rankedCompetitive.addEventListener("click",()=>i("competitive"));const a=document.getElementById("btn-cancel-matchmaking");a&&a.addEventListener("click",()=>{window.mmInterval&&clearInterval(window.mmInterval),yi&&clearTimeout(yi),qt&&(clearTimeout(qt),qt=null),ie&&ie.emit("leave-room"),ds(),window.stopAllMusic(),Jt("menu")}),Qe.leaveLobby&&Qe.leaveLobby.addEventListener("click",()=>{ie&&at&&ie.emit("leave-room"),ds(),Jt("menu")}),Qe.readyToggle&&Qe.readyToggle.addEventListener("click",()=>{if(ie&&at){const f=!Ws;ie.emit("player-ready",{ready:f}),Nd()}}),Qe.copyCode&&Qe.copyCode.addEventListener("click",()=>{at&&navigator.clipboard.writeText(at).then(()=>{Qe.copyCode.innerText="✅",setTimeout(()=>Qe.copyCode.innerText="📋",1500)})}),Qe.returnLobby&&Qe.returnLobby.addEventListener("click",()=>{xn&&xn.classList.remove("active");const f=document.getElementById("rank-result-panel");f&&(f.style.display="none",f.innerHTML=""),se&&(se.destroy(),se=null),Xl(),ie&&at&&fi!=="ranked"?(Jt("lobby"),Ws=!1,un(hs),Es(ct)):(ie&&ie.emit("leave-room"),ds(),Jt("menu"))});const r=document.getElementById("btn-game-menu"),o=document.getElementById("game-menu-overlay"),l=document.getElementById("btn-game-resume"),c=document.getElementById("btn-game-leave");r&&o&&r.addEventListener("click",()=>{o.classList.add("active")}),l&&o&&l.addEventListener("click",()=>{o.classList.remove("active")}),c&&o&&c.addEventListener("click",async()=>{if(se&&se.active&&se.gameState!=="match-over"){let d;if(se.isRanked?d={title:"MATCHMAKING BAN WARNING",message:"Leaving this ranked match will count it as a LOSS (-40 RP) and give you a 5-minute MATCHMAKING BAN.",confirmText:"LEAVE MATCH",cancelText:"STAY IN MATCH",tone:"danger"}:se.mode==="online"?d={title:"LEAVE MATCH",message:"Leaving this online match will count it as a LOSS.",confirmText:"LEAVE MATCH",cancelText:"STAY IN MATCH",tone:"info"}:d={title:"LEAVE MATCH",message:"Your current match progress will be lost.",confirmText:"LEAVE",cancelText:"STAY",tone:"info"},!await ar(d)){o.classList.remove("active");return}}console.log("LEAVE MATCH clicked. Cleaning up game session...");try{if(o.classList.remove("active"),se){try{if(se.active&&(se.mode==="online"||se.isRanked)&&se.gameState!=="match-over"&&(mr(!1),se.isRanked)){const d=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),u=Math.max(0,d-40);localStorage.setItem("tacticstrike_rp",String(u)),localStorage.setItem("tacticstrike_mm_ban_until",String(Date.now()+5*60*1e3))}}catch(d){console.error("Error recording match result during leave:",d)}localStorage.removeItem("tacticstrike_active_match");try{se.destroy()}catch(d){console.error("Error destroying gameEngine:",d)}se=null}}catch(d){console.error("Error in leave match handler pre-disconnect:",d)}try{ie&&at&&ie.emit("leave-room")}catch(d){console.error("Error emitting leave-room:",d)}try{ds()}catch(d){console.error("Error disconnecting socket:",d)}try{Jt("menu")}catch(d){console.error("Error showing menu screen:",d)}}),window.addEventListener("beforeunload",f=>{if(se&&se.active&&se.gameState!=="match-over")return f.preventDefault(),f.returnValue="",""});const h=document.getElementById("btn-rematch");if(h&&h.addEventListener("click",()=>{if(se&&se.mode==="offline")xn&&xn.classList.remove("active"),se&&(se.destroy(),se=null),Ah();else{h.disabled=!0,h.innerText="WAITING...";const f=document.getElementById("rematch-status");f&&(f.innerText="Rematch requested. Waiting for opponent..."),ie&&ie.emit("request-rematch")}}),window.addEventListener("keydown",f=>{f.key==="Enter"&&(ft.chat&&document.activeElement===ft.chat?(f.preventDefault(),iv()):bi.game&&bi.game.classList.contains("active")&&(f.preventDefault(),nt.chatDrawer&&ft.chat&&(nt.chatDrawer.classList.add("active"),ft.chat.focus())))}),ft.chat&&ft.chat.addEventListener("blur",()=>{setTimeout(()=>{ft.chat&&document.activeElement!==ft.chat&&nt.chatDrawer&&nt.chatDrawer.classList.remove("active")},100)}),ft.qpMapSelect){const f=ft.qpMapSelect.querySelectorAll(".qp-map-option"),d=()=>{f.forEach(u=>{const p=u.dataset.map===fn;u.classList.toggle("active",p),u.setAttribute("aria-selected",p?"true":"false")})};d(),f.forEach(u=>{u.addEventListener("click",()=>{fn!==u.dataset.map&&(fn=u.dataset.map,Le.setItem("tacticstrike_selected_map",fn),d(),zt())})})}ft.lobbyMapSelect&&ft.lobbyMapSelect.addEventListener("change",f=>{const d=f.target.value;ie&&at&&ie.emit("select-map",{mapId:d}),zt()}),ft.lobbyModeSelect&&ft.lobbyModeSelect.addEventListener("change",f=>{const d=f.target.value;ie&&at&&ie.emit("select-game-mode",{mode:d}),zt()}),ft.lobbyStyleSelect&&ft.lobbyStyleSelect.addEventListener("change",f=>{const d=f.target.value;ie&&at&&ie.emit("select-render-style",{renderStyle:d}),zt()}),lo(ft.lobbyModeSelect),lo(ft.lobbyMapSelect),lo(ft.lobbyStyleSelect)}function Rh(n=null){document.querySelectorAll(".custom-dropdown.open").forEach(e=>{e!==n&&e.classList.remove("open")})}function lo(n){if(!n||n.dataset.customDropdown==="1")return;n.dataset.customDropdown="1";const e=document.createElement("div");e.className="custom-dropdown",n.parentNode.insertBefore(e,n),e.appendChild(n),n.classList.add("custom-dropdown-source");const t=document.createElement("button");t.type="button",t.className="custom-dropdown-toggle",t.innerHTML='<span class="custom-dropdown-label"></span><span class="custom-dropdown-arrow">▾</span>',e.appendChild(t);const i=document.createElement("div");i.className="custom-dropdown-menu",e.appendChild(i),Array.from(n.options).forEach(c=>{const h=document.createElement("div");h.className="custom-dropdown-option",h.dataset.value=c.value,h.textContent=c.textContent,h.addEventListener("click",()=>{n.disabled||(Rh(),a()!==c.value&&(n.value=c.value,n.dispatchEvent(new Event("change",{bubbles:!0}))))}),i.appendChild(h)});const s=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value"),a=()=>s.get.call(n),r=c=>s.set.call(n,c),o=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"disabled");function l(){const c=a(),h=n.options[n.selectedIndex];t.querySelector(".custom-dropdown-label").textContent=h?h.textContent:"",i.querySelectorAll(".custom-dropdown-option").forEach(f=>f.classList.toggle("active",f.dataset.value===c)),e.classList.toggle("disabled",n.disabled),t.setAttribute("aria-expanded",e.classList.contains("open")?"true":"false")}Object.defineProperty(n,"value",{get:a,set(c){r(c),l()},configurable:!0}),Object.defineProperty(n,"disabled",{get:()=>o.get.call(n),set(c){o.set.call(n,c),l()},configurable:!0}),t.addEventListener("click",c=>{if(c.stopPropagation(),n.disabled)return;const h=e.classList.contains("open");if(Rh(),!h){const f=t.getBoundingClientRect();window.innerHeight-f.bottom<150?e.classList.add("drop-up"):e.classList.remove("drop-up"),e.classList.add("open")}l()}),document.addEventListener("click",c=>{e.contains(c.target)||e.classList.remove("open")}),l()}function iv(){if(!ft.chat)return;const n=ft.chat.value.trim();n&&(ql(At,n,"self"),ie&&at&&ie.emit("chat-message",{name:At,msg:n}),ft.chat.value=""),ft.chat.blur()}function ql(n,e,t){const i=document.createElement("div");i.className=`chat-msg ${t}`,t==="system"?i.innerHTML=`<span class="message">${zn(e)}</span>`:i.innerHTML=`
      <span class="author">${zn(n)}:</span>
      <span class="message">${zn(e)}</span>
    `,nt.chatMessages&&(nt.chatMessages.appendChild(i),nt.chatMessages.scrollTop=nt.chatMessages.scrollHeight),nt.chatDrawer&&nt.chatDrawer.classList.add("active"),window.chatTimeout&&clearTimeout(window.chatTimeout),window.chatTimeout=setTimeout(()=>{ft.chat&&document.activeElement!==ft.chat&&nt.chatDrawer&&nt.chatDrawer.classList.remove("active")},4e3)}function vi(n){ql("",n,"system")}function sr(n,e,t){var r;const i=document.getElementById("kill-feed");if(!i)return;const s=document.createElement("div");s.className="kill-msg";const a=((r=pr[t])==null?void 0:r.name)||t;s.innerHTML=`
    <span class="killer">${zn(n)}</span>
    🔫 [<span class="weapon">${a}</span>] ➔
    <span class="victim">${zn(e)}</span>
  `,i.appendChild(s),setTimeout(()=>s.remove(),5e3)}function zn(n){return n.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]||e)}function nv(){const n=document.querySelectorAll("#lobby-color-selector .color-option");n.forEach(t=>{t.addEventListener("click",()=>{n.forEach(s=>{s.classList.remove("active"),s.style.borderColor="transparent"}),t.classList.add("active"),Zt=t.dataset.color;const i={cyan:"#66fcf1",green:"#39db14",purple:"#9d3bff",orange:"#ff7f3b",yellow:"#ffd700",red:"#ff3c3c"};t.style.borderColor=i[Zt],Le.setItem("tacticstrike_player_color",Zt),ie&&at&&ie.emit("select-color",{color:Zt})})});const e=Le.getItem("tacticstrike_player_color");if(e){const t=document.querySelector(`#lobby-color-selector .color-option[data-color="${e}"]`);t&&t.click()}}function sv(){document.querySelectorAll('input[name="match-mode"]').forEach(e=>{e.addEventListener("change",()=>{Ht=e.value,$l()})})}function $l(){const n=Ht==="2v2"?"2V2 SQUAD":"1V1 DUEL",e=(js[ct]||ct||"Pistol").toUpperCase(),t=document.getElementById("match-config-summary"),i=document.getElementById("match-loadout-value");t&&(t.textContent=`${n} / ${e}`),i&&(i.textContent=e)}function av(){const n=document.getElementById("btn-qp-style-realistic"),e=document.getElementById("btn-qp-style-competitive");if(!n||!e)return;function t(){Ei==="competitive"?(e.classList.add("active"),n.classList.remove("active")):(n.classList.add("active"),e.classList.remove("active"))}n.addEventListener("click",()=>{Ei="realistic",Le.setItem("tacticstrike_qp_style","realistic"),t(),zt()}),e.addEventListener("click",()=>{Ei="competitive",Le.setItem("tacticstrike_qp_style","competitive"),t(),zt()}),t()}function rv(){const n=document.querySelectorAll("#menu-weapon-selector .weapon-btn");n.forEach(e=>{e.addEventListener("click",t=>{if(e.classList.contains("locked")){t.preventDefault(),t.stopPropagation(),Cs();return}n.forEach(s=>s.classList.remove("active")),e.classList.add("active"),ct=e.dataset.weapon,Le.setItem("tacticstrike_player_weapon",ct),$l(),zt(),document.querySelectorAll(".weapon-option").forEach(s=>{s.dataset.weapon===ct?s.classList.add("active"):s.classList.remove("active")}),Es(ct),ie&&at&&ie.emit("select-weapon",{weapon:ct})})})}function Ts(n,e=8e3){const t=document.getElementById("notification-container");if(!t)return;const i=document.createElement("div");i.className="custom-toast",i.style.cssText=`
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
  `;const s=document.createElement("div");s.style.cssText=`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #66fcf1;
  `,i.appendChild(s);const a=document.createElement("div");a.style.paddingLeft="6px",a.innerText=n,i.appendChild(a),i.addEventListener("click",()=>{i.style.opacity="0",i.style.transform="translateX(50px)",setTimeout(()=>i.remove(),350)}),t.appendChild(i),requestAnimationFrame(()=>{i.style.opacity="1",i.style.transform="translateX(0)"}),setTimeout(()=>{i.parentNode&&(i.style.opacity="0",i.style.transform="translateX(50px)",setTimeout(()=>i.remove(),350))},e)}document.addEventListener("DOMContentLoaded",()=>{if(/Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS/i.test(navigator.userAgent)||window.innerWidth<800){zl({immediate:!0});const o=document.getElementById("mobile-warning-screen");o&&(o.style.display="flex");return}const e=document.getElementById("startup-status");e&&gt.token&&(e.textContent="RESTORING OPERATIVE SESSION");const t=localStorage.getItem("tacticstrike_active_match");if(t){if(mr(!1),t==="ranked"){const o=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),l=Math.max(0,o-40);localStorage.setItem("tacticstrike_rp",String(l)),localStorage.setItem("tacticstrike_mm_ban_until",String(Date.now()+5*60*1e3)),ar({title:"GAME LOST",message:`You left a ranked match. The result was recorded as a loss (-40 RP).

MATCHMAKING BAN: 5 minutes.`,confirmText:"UNDERSTOOD",tone:"danger"})}else ar({title:"GAME LOST",message:"You disconnected from an active match. Recorded as a loss.",confirmText:"UNDERSTOOD",tone:"danger"});localStorage.removeItem("tacticstrike_active_match")}Qx();const i=yv();ov(),lv(),cv(),pv(),gv(),xv(),ev(),rv(),nv(),sv(),av(),tv(),jx(),Vn(),Zl(!1),Xa(),Jt("menu"),Gl(),Xl(),ct=Le.getItem("tacticstrike_player_weapon")||"pistol",Hl(),document.querySelectorAll("#menu-weapon-selector .weapon-btn").forEach(o=>{o.dataset.weapon===ct?o.classList.add("active"):o.classList.remove("active")}),document.querySelectorAll(".weapon-option").forEach(o=>{o.dataset.weapon===ct?o.classList.add("active"):o.classList.remove("active")}),Es(ct),$l(),Gx(i).then(()=>{var c;const o=new URL(location.href),l=o.searchParams.get("shop");l==="credits"&&Qs("menu"),l==="support"&&((c=document.getElementById("btn-open-purchase-support"))==null||c.click()),(l==="credits"||l==="support")&&(o.searchParams.delete("shop"),history.replaceState(null,"",o))})});function co(n){const e=On[n];if(!e)return!0;try{if(JSON.parse(Le.getItem("tacticstrike_purchased_weapons")||"[]").includes(n))return!0}catch{}return parseInt(Le.getItem("tacticstrike_rp")||"0")>=e.rp}function ov(){const n=document.getElementById("news-modal"),e=document.getElementById("btn-close-news");if(!n||!e)return;sessionStorage.getItem("tacticstrike_news_seen")||n.classList.add("active"),e.addEventListener("click",()=>{n.classList.remove("active"),sessionStorage.setItem("tacticstrike_news_seen","true"),zt()})}function lv(){const n=document.getElementById("whats-new-modal"),e=document.getElementById("btn-open-whats-new"),t=document.getElementById("btn-close-whats-new");!n||!e||!t||(e.addEventListener("click",()=>{n.classList.add("active"),zt()}),t.addEventListener("click",()=>{n.classList.remove("active"),zt()}))}function cv(){const n=document.getElementById("credit-shop-modal"),e=document.getElementById("btn-open-credit-shop"),t=document.getElementById("btn-close-credit-shop"),i=document.querySelectorAll("#credit-shop-modal [data-buy-credit-pack]");!n||!t||(e==null||e.addEventListener("click",()=>Qs("menu")),document.addEventListener("click",s=>{const a=s.target.closest("[data-open-credit-shop]");a&&Qs(a.closest("#shop-modal")?"item-shop":"menu")}),document.addEventListener("click",s=>{const a=s.target.closest("[data-buy-credit-pack]");a&&(s.preventDefault(),hv(a.dataset.buyCreditPack))}),t.addEventListener("click",()=>{n.classList.remove("active"),Qi("close")}),i.forEach(s=>s.addEventListener("click",()=>Qi("confirm"))),window.addEventListener("pageshow",s=>{s.persisted&&Js()}),document.addEventListener("visibilitychange",()=>{document.hidden||Js()}))}function Js(){document.querySelectorAll("#credit-shop-modal [data-buy-credit-pack]").forEach(n=>{n.disabled=!1,n.dataset.checkoutLabel&&(n.innerHTML=n.dataset.checkoutLabel,delete n.dataset.checkoutLabel)})}window.resetCreditCheckoutButtons=Js;function Qs(n="menu"){const e=document.getElementById("credit-shop-modal");e&&(e.dataset.source=n,e.classList.add("active"),Qi("open"))}async function hv(n){var t;if(!((t=gt.user)!=null&&t.emailVerified)||!gt.token){gs();return}const e=document.querySelector(`[data-buy-credit-pack="${n}"]`);e&&(e.dataset.checkoutLabel=e.innerHTML,e.disabled=!0,e.textContent="OPENING SECURE CHECKOUT…");try{const i=await Ks("/api/credits/checkout",{method:"POST",body:JSON.stringify({packageId:n})});Qi("confirm"),Js(),window.location.assign(i.checkoutUrl)}catch(i){if(Js(),i.code==="EMAIL_VERIFICATION_REQUIRED"){gs();return}if(i.status===401){jl(),gs();return}Ts(i.message,6e3),Cs()}}function Bn(n="",e=""){const t=document.getElementById("purchase-support-message");t&&(t.textContent=n,t.className=`support-notice${e?` ${e}`:""}`)}function gr(n){const e=new Date(n);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{dateStyle:"medium",timeStyle:"short"})}function Yl(n){return n.closed?"CLOSED":n.status==="approved"?`${n.creditsGranted.toLocaleString()} CREDITS ADDED`:n.status==="denied"?"DENIED":"AWAITING REVIEW"}function zd(n){return n.closed?"closed":n.status||"open"}function dv(n){return new Promise((e,t)=>{if(!n){t(new Error("Attach a receipt screenshot as proof of purchase."));return}if(!["image/png","image/jpeg","image/webp"].includes(n.type)){t(new Error("Upload a PNG, JPG, or WebP receipt image."));return}if(n.size>15e5){t(new Error("Receipt images must be smaller than 1.5 MB."));return}const i=new FileReader;i.onload=()=>e({name:n.name,data:i.result}),i.onerror=()=>t(new Error("The receipt image could not be read.")),i.readAsDataURL(n)})}function Vd(n){const e=document.createElement("div");e.className=`support-message-bubble ${n.senderRole}`;const t=document.createElement("div");t.className="support-message-meta";const i=document.createElement("span");i.textContent=n.senderRole==="admin"?"TACTICSTRIKE SUPPORT":"YOU";const s=document.createElement("span");if(s.textContent=gr(n.createdAt),t.append(i,s),e.appendChild(t),n.body){const a=document.createElement("div");a.textContent=n.body,e.appendChild(a)}if(n.proofData){const a=document.createElement("img");a.className="support-proof-image",a.src=n.proofData,a.alt=n.proofName?`Purchase proof: ${n.proofName}`:"Purchase proof",e.appendChild(a)}return e}function fv(n){if(!(n!=null&&n.id))return;const e=`tacticstrike_server_credits_seen_${n.id}`,t=Math.max(0,parseInt(Le.getItem(e)||"0")),i=Math.max(0,Number(n.credits||0));if(i>t){const s=Math.max(0,parseInt(Le.getItem("tacticstrike_credits")||"0"));Le.setItem("tacticstrike_credits",String(s+(i-t)))}Le.setItem(e,String(i))}async function qa(){var e;const n=document.getElementById("purchase-support-cases");if(n){n.innerHTML='<div class="support-empty-state">Loading secure conversations…</div>';try{const t=await Ks("/api/purchase-support/cases");if(t.user&&(gt.user=t.user,Vn()),!t.cases.length){n.innerHTML='<div class="support-empty-state">No purchase-verification chats yet.</div>';return}const i=await Promise.all(t.cases.map(s=>Ks(`/api/purchase-support/cases/${s.id}`)));n.innerHTML="",i.forEach(s=>uv(s.purchaseCase,n))}catch(t){if(t.status===401){jl(),(e=document.getElementById("purchase-support-modal"))==null||e.classList.remove("active"),gs("login","support");return}n.innerHTML='<div class="support-empty-state">Purchase chats could not be loaded. Try refreshing.</div>',Bn(t.message,"error")}}}function uv(n,e){const t=document.createElement("article");t.className="support-case-card";const i=document.createElement("div");i.className="support-case-summary";const s=document.createElement("div"),a=document.createElement("strong");a.textContent=`ORDER ${n.orderNumber}`;const r=document.createElement("small");r.textContent=`${n.requestedCredits.toLocaleString()}-credit verification · opened ${gr(n.createdAt)}`,s.append(a,r);const o=document.createElement("span");o.className=`case-status ${zd(n)}`,o.textContent=Yl(n),i.append(s,o),t.appendChild(i);const l=document.createElement("div");if(l.className="support-message-list",n.messages.forEach(c=>l.appendChild(Vd(c))),t.appendChild(l),!n.closed){const c=document.createElement("form");c.className="support-reply-form";const h=document.createElement("input");h.type="text",h.maxLength=1500,h.required=!0,h.placeholder="Reply to support…";const f=document.createElement("button");f.type="submit",f.textContent="SEND",c.append(h,f),c.addEventListener("submit",async d=>{d.preventDefault(),f.disabled=!0;try{await Ks(`/api/purchase-support/cases/${n.id}/messages`,{method:"POST",body:JSON.stringify({message:h.value})}),Bn("Reply sent securely.","success"),await qa()}catch(u){Bn(u.message,"error")}finally{f.disabled=!1}}),t.appendChild(c)}e.appendChild(t),requestAnimationFrame(()=>{l.scrollTop=l.scrollHeight})}function pv(){const n=document.getElementById("purchase-support-modal"),e=document.getElementById("btn-open-purchase-support"),t=document.getElementById("btn-close-purchase-support"),i=document.getElementById("btn-refresh-purchase-support"),s=document.getElementById("purchase-support-form");!n||!e||!t||!s||(e.addEventListener("click",()=>{if(!gt.user||!gt.token){gs("login","support");return}n.classList.add("active"),Bn(),Qi("open"),qa()}),t.addEventListener("click",()=>{n.classList.remove("active"),Qi("close")}),i==null||i.addEventListener("click",qa),s.addEventListener("submit",async a=>{a.preventDefault();const r=s.querySelector('button[type="submit"]');r.disabled=!0,Bn("Encrypting and submitting your purchase proof…","info");try{const o=document.getElementById("purchase-proof-file").files[0],l=await dv(o);await Ks("/api/purchase-support/cases",{method:"POST",body:JSON.stringify({orderNumber:document.getElementById("purchase-order-number").value,packageId:document.getElementById("purchase-package").value,message:document.getElementById("purchase-support-text").value,proof:l})}),s.reset(),Bn("Purchase proof submitted. Support will reply within 1–12 hours.","success"),Qi("confirm"),await qa()}catch(o){Bn(o.message,"error"),Cs()}finally{r.disabled=!1}}))}function fs(n="",e=""){const t=document.getElementById("admin-login-message");t&&(t.textContent=n,t.className=`support-notice${e?` ${e}`:""}`)}function _l(n){const e=document.getElementById("admin-login-view"),t=document.getElementById("admin-dashboard-view");e&&(e.hidden=n),t&&(t.hidden=!n)}function Kl(){ms=null,Ol=null,Le.removeItem(Bl),_l(!1)}async function Xs(n=Ol){const e=document.getElementById("admin-case-list"),t=document.getElementById("admin-case-detail");if(!(!e||!t)){e.innerHTML='<div class="support-empty-state">Loading purchase queue…</div>';try{const i=await Ms("/api/admin/purchase-cases");if(!i.cases.length){e.innerHTML='<div class="support-empty-state">No messages submitted.</div>',t.innerHTML='<div class="support-empty-state">The verification queue is empty.</div>';return}e.innerHTML="",i.cases.forEach(a=>{const r=document.createElement("button");r.type="button",r.dataset.caseId=a.id,r.className=`admin-case-list-item${a.id===n?" active":""}`;const o=document.createElement("strong");o.textContent=a.userEmail||"Unknown account";const l=document.createElement("span");l.textContent=`Order ${a.orderNumber}`;const c=document.createElement("small");c.textContent=`${Yl(a)} · ${gr(a.updatedAt)}`,r.append(o,l,c),r.addEventListener("click",()=>Ch(a.id)),e.appendChild(r)});const s=i.cases.some(a=>a.id===n)?n:i.cases[0].id;await Ch(s,!1)}catch(i){if(i.status===401){Kl(),fs("Admin session expired. Sign in again.","error");return}e.innerHTML='<div class="support-empty-state">The verification queue could not be loaded.</div>',t.innerHTML=""}}}async function Ch(n,e=!0){var i;const t=document.getElementById("admin-case-detail");if(t){Ol=n,e&&(document.querySelectorAll(".admin-case-list-item").forEach(s=>s.classList.remove("active")),(i=document.querySelector(`.admin-case-list-item[data-case-id="${n}"]`))==null||i.classList.add("active")),t.innerHTML='<div class="support-empty-state">Loading secure chat…</div>';try{const s=await Ms(`/api/admin/purchase-cases/${n}`);mv(s.purchaseCase)}catch(s){if(s.status===401){Kl(),fs("Admin session expired. Sign in again.","error");return}t.innerHTML='<div class="support-empty-state">This purchase chat could not be loaded.</div>'}}}function mv(n){const e=document.getElementById("admin-case-detail");if(!e)return;e.innerHTML="";const t=document.createElement("div");t.className="admin-case-detail-head";const i=document.createElement("div"),s=document.createElement("span");s.className="section-kicker",s.textContent=n.userEmail||"OPERATIVE ACCOUNT";const a=document.createElement("h3");a.textContent=`ORDER ${n.orderNumber}`;const r=document.createElement("p");r.textContent=`Requested package: ${n.requestedCredits.toLocaleString()} credits · opened ${gr(n.createdAt)}`,i.append(s,a,r);const o=document.createElement("span");o.className=`case-status ${zd(n)}`,o.textContent=Yl(n),t.append(i,o),e.appendChild(t);const l=document.createElement("div");if(l.className="support-message-list admin-message-list",n.messages.forEach(d=>l.appendChild(Vd(d))),e.appendChild(l),!n.closed){const d=document.createElement("form");d.className="support-reply-form admin-reply-form";const u=document.createElement("input");u.type="text",u.maxLength=1500,u.required=!0,u.placeholder="Reply to this user…";const p=document.createElement("button");p.type="submit",p.textContent="SEND REPLY",d.append(u,p),d.addEventListener("submit",async v=>{v.preventDefault(),p.disabled=!0;try{await Ms(`/api/admin/purchase-cases/${n.id}/messages`,{method:"POST",body:JSON.stringify({message:u.value})}),await Xs(n.id)}catch(g){Ts(g.message,5e3)}finally{p.disabled=!1}}),e.appendChild(d)}const c=document.createElement("div");c.className="admin-actions",[50,500,2e3].forEach(d=>{const u=document.createElement("button");u.type="button",u.textContent=`ADD ${d.toLocaleString()} CREDITS`,u.disabled=n.closed||n.status==="approved",u.addEventListener("click",()=>ho(n,"grant",d)),c.appendChild(u)});const h=document.createElement("button");h.type="button",h.className="danger",h.textContent="DENY PROOF",h.disabled=n.closed||n.status==="approved",h.addEventListener("click",()=>ho(n,"deny"));const f=document.createElement("button");f.type="button",f.className="close-chat",f.textContent="CLOSE CHAT",f.disabled=n.closed,f.addEventListener("click",()=>ho(n,"close")),c.append(h,f),e.appendChild(c),requestAnimationFrame(()=>{l.scrollTop=l.scrollHeight})}async function ho(n,e,t=0){const i=e==="grant"?`Add ${t.toLocaleString()} credits to ${n.userEmail}? This cannot be granted twice.`:e==="deny"?`Deny the proof submitted for order ${n.orderNumber}?`:"Close this chat? The user will no longer be able to reply.";if(window.confirm(i))try{await Ms(`/api/admin/purchase-cases/${n.id}/decision`,{method:"POST",body:JSON.stringify({action:e,credits:t})}),Ts(e==="grant"?`${t.toLocaleString()} credits added.`:e==="deny"?"Proof denied.":"Chat closed.",4500),await Xs(n.id)}catch(s){Ts(s.message,5500),Cs()}}function gv(){var o,l;const n=document.getElementById("admin-modal"),e=document.getElementById("version-admin-trigger"),t=document.getElementById("btn-close-admin"),i=document.getElementById("admin-login-form");if(!n||!t||!i)return;const s=()=>{n.classList.add("active"),fs(),_l(!!ms),Qi("open"),ms&&Xs()};let a=0,r=null;e==null||e.addEventListener("click",()=>{if(a+=1,clearTimeout(r),a>=5){a=0,s();return}r=setTimeout(()=>{a=0},2200)}),t.addEventListener("click",()=>{n.classList.remove("active"),Qi("close")}),i.addEventListener("submit",async c=>{c.preventDefault();const h=i.querySelector('button[type="submit"]');h.disabled=!0,fs("Authenticating with the secure server…","info");try{const f=await Ms("/api/admin/login",{method:"POST",body:JSON.stringify({username:document.getElementById("admin-username").value,password:document.getElementById("admin-password").value})});ms=f.token,Le.setItem(Bl,f.token),i.reset(),_l(!0),await Xs()}catch(f){fs(f.message,"error")}finally{h.disabled=!1}}),(o=document.getElementById("btn-refresh-admin-cases"))==null||o.addEventListener("click",()=>Xs()),(l=document.getElementById("btn-admin-logout"))==null||l.addEventListener("click",async()=>{try{await Ms("/api/admin/logout",{method:"POST"})}catch{}Kl(),fs("Signed out of the admin dashboard.","success")})}function Vn(){const n=gt.user,e=n!=null&&n.emailVerified&&(n!=null&&n.username)?n.username:"Guest",t=At!==e;At=e;const i=document.getElementById("operative-name");i&&(i.textContent=At);const s=document.getElementById("operative-account-message");if(s&&(s.textContent=n!=null&&n.username?"Change your name in Account.":"Pick a name in Account."),ie!=null&&ie.connected&&(t||ie.accountToken!==gt.token)&&(ie.accountToken=gt.token,ie.emit("account-session",{token:gt.token})),n){fv(n);const o=JSON.stringify(n);gt.token&&Le.getItem(mo)!==o&&Le.setItem(mo,o)}const a=document.getElementById("credit-shop-account-status");a==null||a.classList.toggle("signed-in",!!n);const r=a==null?void 0:a.querySelector("span:last-child");r&&(r.textContent=n?n.emailVerified?"ACCOUNT CONNECTED":"VERIFY YOUR EMAIL":Ss?"CONNECTING…":"SIGN IN"),document.querySelectorAll("#credit-shop-modal [data-buy-credit-pack]").forEach(o=>{o.firstChild&&(o.firstChild.textContent=n?n.emailVerified?"CONTINUE TO CHECKOUT ":"VERIFY EMAIL TO CONTINUE ":Ss?"CONNECTING… ":"SIGN IN TO BUY ")})}function jl(){gt={token:null,user:null},Ss=!1,Zd(),Vn()}let fo,Ph="credits";async function gs(n="login",e="credits"){Ph=e;try{fo||(fo=tf(async()=>{const{initHubAccount:i}=await import("./dialog-controller-B4LIXejs.js");return{initHubAccount:i}},__vite__mapDeps([0,1])).then(({initHubAccount:i})=>{const s=i({autoOpen:!1,onSessionChange:a=>{gt=a,Ss=!1,Vn()}});return s.dialog.querySelector("#account-return").addEventListener("click",a=>{var r;a.preventDefault(),s.close(),Ph==="support"?(r=document.getElementById("btn-open-purchase-support"))==null||r.click():Qs()}),s}).catch(i=>{throw fo=null,i})),(await fo).open({tab:"profile",mode:n})}catch{const t=document.querySelector("#credit-shop-account-status span:last-child");t&&(t.textContent="RETRY ACCOUNT")}}function yv(){document.addEventListener("click",e=>{e.target.closest("[data-open-account]")&&(e.preventDefault(),gs())});async function n(){const e=gt.token;if(Ss=!!e,Vn(),!!e)try{const t=await Nh("/api/auth/me",{token:e});if(gt.token!==e)return;gt.user=t.user}catch(t){if(gt.token!==e)return;t.status===401&&jl()}finally{gt.token===e&&(Ss=!1,Vn())}}return window.addEventListener("storage",e=>{if(e.key===null||[Jd,mo].includes(e.key)){const t=gt.token;gt=Dh(),t!==gt.token?n():Vn()}}),n()}function xv(){const n=document.getElementById("shop-modal"),e=document.getElementById("btn-open-shop"),t=document.getElementById("btn-close-shop");!n||!e||!t||(Le.getItem("tacticstrike_credits")===null&&Le.setItem("tacticstrike_credits","0"),e.addEventListener("click",()=>{Hd(),n.classList.add("active"),zt()}),t.addEventListener("click",()=>{n.classList.remove("active"),zt()}))}function Hd(){const n=document.getElementById("shop-items-container"),e=document.getElementById("shop-credits-display"),t=document.getElementById("shop-owned-count"),i=document.getElementById("shop-available-count");if(!n||!e)return;const s=parseInt(Le.getItem("tacticstrike_credits")||"0");e.innerText=s;let a=[];try{a=JSON.parse(Le.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}const r=parseInt(Le.getItem("tacticstrike_rp")||"0");n.innerHTML="";let o=0,l=0;Object.keys(On).forEach(c=>{const h=On[c],f=Wx[c],d=a.includes(c),u=r>=h.rp,p=s>=h.price,v=d||u;v?o+=1:p&&(l+=1);const g=document.createElement("article");g.className=`shop-item-card tier-${f.tier.toLowerCase()}${v?" is-owned":""}${!p&&!v?" needs-credits":""}`;let m="",M="";d?(m='<span class="shop-item-status owned"><i></i>ACQUIRED</span>',M='<button class="shop-buy-action owned" disabled>IN YOUR ARMORY</button>'):u?(m='<span class="shop-item-status rank"><i></i>RANK UNLOCKED</span>',M='<button class="shop-buy-action owned" disabled>AVAILABLE IN LOADOUT</button>'):(m=`<span class="shop-item-status locked"><i></i>${h.rank} CLEARANCE</span>`,p?M=`<button class="shop-buy-action buy-btn" data-weapon="${c}">UNLOCK EARLY <span>→</span></button>`:M=`<button class="shop-buy-action top-up" type="button" data-open-credit-shop>GET CREDITS <span>+${(h.price-s).toLocaleString()}</span></button>`);const _=pr[c]||{name:c};g.innerHTML=`
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
        <h4>${_.name}</h4>
        <p>${f.description}</p>
      </div>
      <div class="shop-item-stats">
        <span><small>DAMAGE</small><strong>${_.damagePct}</strong></span>
        <span><small>ACCURACY</small><strong>${_.accuracy}</strong></span>
        <span><small>CAPACITY</small><strong>${_.magSize}</strong></span>
      </div>
      <div class="shop-item-unlock">
        <span>STANDARD UNLOCK</span><strong>${h.rank} · ${h.rp.toLocaleString()} RP</strong>
      </div>
      <div class="shop-item-purchase">
        <div class="shop-item-price"><img class="mini-credit-mark" src="/tacticstrike-credit-stack.webp" alt="" aria-hidden="true"><strong>${h.price.toLocaleString()}</strong><small>CREDITS</small></div>
        ${M}
      </div>
    `,n.appendChild(g)}),t&&(t.textContent=o),i&&(i.textContent=l),n.querySelectorAll(".buy-btn").forEach(c=>{c.addEventListener("click",()=>{const h=c.dataset.weapon;vv(h)})})}function vv(n){const e=On[n];if(!e)return;const t=parseInt(Le.getItem("tacticstrike_credits")||"0");if(t<e.price){Cs(),Ts(`You need ${(e.price-t).toLocaleString()} more credits for ${js[n]}.`,4500),Qs("item-shop");return}const i=t-e.price;Le.setItem("tacticstrike_credits",String(i));let s=[];try{s=JSON.parse(Le.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}s.includes(n)||(s.push(n),Le.setItem("tacticstrike_purchased_weapons",JSON.stringify(s)));try{const a=window.AudioContext||window.webkitAudioContext;if(a){const r=new a,o=r.createOscillator(),l=r.createGain();o.type="sine",o.frequency.setValueAtTime(587.33,r.currentTime),o.frequency.setValueAtTime(880,r.currentTime+.1),l.gain.setValueAtTime(.15,r.currentTime),l.gain.exponentialRampToValueAtTime(.001,r.currentTime+.35),o.connect(l),l.connect(r.destination),o.start(),o.stop(r.currentTime+.38)}}catch{}if(Ts(`Successfully unlocked ${js[n]} early!`,6e3),ie){const a=Vl(),r=parseInt(Le.getItem("tacticstrike_rp")||"0"),o=bs();ie.emit("sync-device",{uuid:a,rp:r,wins:o.wins,losses:o.losses,name:At,credits:i,purchasedWeapons:s})}Hd(),Hl()}function ar({title:n,message:e,confirmText:t="CONFIRM",cancelText:i=null,tone:s="info"}){return new Promise(a=>{const r=s==="danger"?"#ff3c3c":s==="ban"?"#ff6ef7":"#d4af37",o=document.createElement("div");o.className="modal-overlay insite-dialog-overlay",o.style.cssText="position: fixed; inset: 0; z-index: 130000;";const l=s==="danger"||s==="ban"?"background: linear-gradient(135deg, #a11c1c, #520f0f); border: 1px solid #7a1515; color: #ffbcbc;":"";o.innerHTML=`
      <div class="modal-card" style="width: 400px; max-width: 92vw; padding: 30px 26px; gap: 14px; border-color: ${r}55; box-shadow: 0 0 45px ${r}22;">
        <div style="font-family: var(--font-title); font-size: 11px; letter-spacing: 2.5px; color: ${r}; font-weight: 700; text-shadow: 0 0 10px ${r}55;">${n}</div>
        <div style="font-size: 12.5px; line-height: 1.65; color: #e8ecf2; white-space: pre-line;">${e}</div>
        <div style="display: flex; gap: 10px; width: 100%; margin-top: 8px;">
          ${i?`<button data-dialog-cancel class="btn secondary btn-3d" style="flex: 1; font-size: 11px; padding: 12px;">${i}</button>`:""}
          <button data-dialog-confirm class="btn primary btn-3d" style="flex: 1; font-size: 11px; padding: 12px; ${l}">${t}</button>
        </div>
      </div>
    `;let c=!1;const h=u=>{c||(c=!0,o.classList.remove("active"),setTimeout(()=>o.remove(),300),a(u))};o.querySelector("[data-dialog-confirm]").addEventListener("click",()=>h(!0));const f=o.querySelector("[data-dialog-cancel]");f&&f.addEventListener("click",()=>h(!1)),(document.getElementById("app")||document.body).appendChild(o),requestAnimationFrame(()=>o.classList.add("active"))})}const Ih=["ShadowViper","NovaStrike","GhostPulse","IronTactic","DarkHavoc","StormRider","PhantomUnit","RogueAgent","BlitzKing","NightOwl","ToxicViper","CrimsonGhost","AlphaWolf","ReaperSix","Frostbite","VenomStrike","LoneWolf","SilentHawk","RapidFire","SteelRaven","VoidWalker","SnapAim","HeadshotHero","TacticalTurtle","QuickScope","MidnightFox","SavageOtter","WraithOne","BulletMagnet","ClutchMaster","DriftKing","ZeroFear","HavocWolf","PixelSniper","RushHourZ","CamperKing","NoScopeNate","EchoSquad","VexArcher","GrimReaperz","SmokeCheck","FragMovie","LagSwitch","SpawnCamper","OneTapWonder","SilentStep","HeadhunterPro","Warlord77","TacticalTed","ClutchGod"];function uo(){const n=Ih[Math.floor(Math.random()*Ih.length)],e=Math.random();return e<.4?n+(Math.floor(Math.random()*90)+10):e<.55?n+"X":e<.65?"xX"+n+"Xx":e<.75?n+"_"+(Math.floor(Math.random()*90)+10):n}let po=!1;function _v(n){return(n||"").trim().toLowerCase()==="sara"}function Lh(n){const e=document.getElementById("notification-container");if(!e)return;const t=document.createElement("div");t.className="custom-toast sara-toast",t.style.cssText=`
    background: rgba(30, 10, 22, 0.95);
    border: 1px solid #ff9ecf;
    box-shadow: 0 0 18px rgba(255, 158, 207, 0.35);
    border-radius: 6px;
    padding: 14px 20px;
    color: #ffd3e8;
    font-family: var(--font-title);
    font-size: 11px;
    letter-spacing: 1.5px;
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
    text-shadow: 0 0 8px rgba(255, 158, 207, 0.5);
  `;const i=document.createElement("div");i.innerText=n,t.appendChild(i);const s=()=>{t.style.opacity="0",t.style.transform="translateX(50px)",setTimeout(()=>t.remove(),350)};t.addEventListener("click",s),e.appendChild(t),requestAnimationFrame(()=>{t.style.opacity="1",t.style.transform="translateX(0)"}),setTimeout(()=>{t.parentNode&&s()},4200)}function Zl(n=!0){var s;const t=_v(At);(s=document.getElementById("operative-name"))==null||s.classList.toggle("name-sara-effect",t);const i=document.getElementById("hud-self-name");i&&i.classList.toggle("name-sara-effect",t),t&&!po&&n?Lh("💗 x2 XP enabled, Sara xx"):!t&&po&&n&&Lh("💔 x2 XP gone, Sara xx"),po=t}window.addEventListener("opponent-chat-msg",n=>{const{name:e,msg:t}=n.detail;ql(e,t,"opponent")});
