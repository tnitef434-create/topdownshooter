(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const Li=Object.create(null);Li.open="0";Li.close="1";Li.ping="2";Li.pong="3";Li.message="4";Li.upgrade="5";Li.noop="6";const ba=Object.create(null);Object.keys(Li).forEach(n=>{ba[Li[n]]=n});const Kr={type:"error",data:"parser error"},nh=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",sh=typeof ArrayBuffer=="function",ah=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,Jo=({type:n,data:e},t,i)=>nh&&e instanceof Blob?t?i(e):Yl(e,i):sh&&(e instanceof ArrayBuffer||ah(e))?t?i(e):Yl(new Blob([e]),i):i(Li[n]+(e||"")),Yl=(n,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(n)};function $l(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let rr;function pd(n,e){if(nh&&n.data instanceof Blob)return n.data.arrayBuffer().then($l).then(e);if(sh&&(n.data instanceof ArrayBuffer||ah(n.data)))return e($l(n.data));Jo(n,!1,t=>{rr||(rr=new TextEncoder),e(rr.encode(t))})}const Kl="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Cs=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<Kl.length;n++)Cs[Kl.charCodeAt(n)]=n;const md=n=>{let e=n.length*.75,t=n.length,i,s=0,a,r,o,l;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const c=new ArrayBuffer(e),d=new Uint8Array(c);for(i=0;i<t;i+=4)a=Cs[n.charCodeAt(i)],r=Cs[n.charCodeAt(i+1)],o=Cs[n.charCodeAt(i+2)],l=Cs[n.charCodeAt(i+3)],d[s++]=a<<2|r>>4,d[s++]=(r&15)<<4|o>>2,d[s++]=(o&3)<<6|l&63;return c},gd=typeof ArrayBuffer=="function",Qo=(n,e)=>{if(typeof n!="string")return{type:"message",data:rh(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:yd(n.substring(1),e)}:ba[t]?n.length>1?{type:ba[t],data:n.substring(1)}:{type:ba[t]}:Kr},yd=(n,e)=>{if(gd){const t=md(n);return rh(t,e)}else return{base64:!0,data:n}},rh=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},oh="",xd=(n,e)=>{const t=n.length,i=new Array(t);let s=0;n.forEach((a,r)=>{Jo(a,!1,o=>{i[r]=o,++s===t&&e(i.join(oh))})})},vd=(n,e)=>{const t=n.split(oh),i=[];for(let s=0;s<t.length;s++){const a=Qo(t[s],e);if(i.push(a),a.type==="error")break}return i};function _d(){return new TransformStream({transform(n,e){pd(n,t=>{const i=t.length;let s;if(i<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,i);else if(i<65536){s=new Uint8Array(3);const a=new DataView(s.buffer);a.setUint8(0,126),a.setUint16(1,i)}else{s=new Uint8Array(9);const a=new DataView(s.buffer);a.setUint8(0,127),a.setBigUint64(1,BigInt(i))}n.data&&typeof n.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(t)})}})}let or;function Gs(n){return n.reduce((e,t)=>e+t.length,0)}function Xs(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let i=0;for(let s=0;s<e;s++)t[s]=n[0][i++],i===n[0].length&&(n.shift(),i=0);return n.length&&i<n[0].length&&(n[0]=n[0].slice(i)),t}function Sd(n,e){or||(or=new TextDecoder);const t=[];let i=0,s=-1,a=!1;return new TransformStream({transform(r,o){for(t.push(r);;){if(i===0){if(Gs(t)<1)break;const l=Xs(t,1);a=(l[0]&128)===128,s=l[0]&127,s<126?i=3:s===126?i=1:i=2}else if(i===1){if(Gs(t)<2)break;const l=Xs(t,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),i=3}else if(i===2){if(Gs(t)<8)break;const l=Xs(t,8),c=new DataView(l.buffer,l.byteOffset,l.length),d=c.getUint32(0);if(d>Math.pow(2,21)-1){o.enqueue(Kr);break}s=d*Math.pow(2,32)+c.getUint32(4),i=3}else{if(Gs(t)<s)break;const l=Xs(t,s);o.enqueue(Qo(a?l:or.decode(l),e)),i=0}if(s===0||s>n){o.enqueue(Kr);break}}}})}const lh=4;function Rt(n){if(n)return Md(n)}function Md(n){for(var e in Rt.prototype)n[e]=Rt.prototype[e];return n}Rt.prototype.on=Rt.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};Rt.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};Rt.prototype.off=Rt.prototype.removeListener=Rt.prototype.removeAllListeners=Rt.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var i,s=0;s<t.length;s++)if(i=t[s],i===e||i.fn===e){t.splice(s,1);break}return t.length===0&&delete this._callbacks["$"+n],this};Rt.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,s=t.length;i<s;++i)t[i].apply(this,e)}return this};Rt.prototype.emitReserved=Rt.prototype.emit;Rt.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};Rt.prototype.hasListeners=function(n){return!!this.listeners(n).length};const $a=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),oi=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),bd="arraybuffer";function ch(n,...e){return e.reduce((t,i)=>(n.hasOwnProperty(i)&&(t[i]=n[i]),t),{})}const Ed=oi.setTimeout,Td=oi.clearTimeout;function Ka(n,e){e.useNativeTimers?(n.setTimeoutFn=Ed.bind(oi),n.clearTimeoutFn=Td.bind(oi)):(n.setTimeoutFn=oi.setTimeout.bind(oi),n.clearTimeoutFn=oi.clearTimeout.bind(oi))}const wd=1.33;function Ad(n){return typeof n=="string"?Rd(n):Math.ceil((n.byteLength||n.size)*wd)}function Rd(n){let e=0,t=0;for(let i=0,s=n.length;i<s;i++)e=n.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function hh(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Cd(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function Pd(n){let e={},t=n.split("&");for(let i=0,s=t.length;i<s;i++){let a=t[i].split("=");e[decodeURIComponent(a[0])]=decodeURIComponent(a[1])}return e}class Id extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class el extends Rt{constructor(e){super(),this.writable=!1,Ka(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new Id(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=Qo(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Cd(e);return t.length?"?"+t:""}}class Ld extends el{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};vd(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,xd(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=hh()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let dh=!1;try{dh=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Dd=dh;function Nd(){}class kd extends Ld{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(s,a)=>{this.onError("xhr post error",s,a)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class Ri extends Rt{constructor(e,t,i){super(),this.createRequest=e,Ka(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=ch(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&i.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var s;i.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=Ri.requestsCount++,Ri.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Nd,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ri.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Ri.requestsCount=0;Ri.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Zl);else if(typeof addEventListener=="function"){const n="onpagehide"in oi?"pagehide":"unload";addEventListener(n,Zl,!1)}}function Zl(){for(let n in Ri.requests)Ri.requests.hasOwnProperty(n)&&Ri.requests[n].abort()}const Ud=function(){const n=fh({xdomain:!1});return n&&n.responseType!==null}();class Fd extends kd{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Ud&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Ri(fh,this.uri(),e)}}function fh(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Dd))return new XMLHttpRequest}catch{}if(!e)try{return new oi[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const uh=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Od extends el{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=uh?{}:ch(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;Jo(i,this.supportsBinary,a=>{try{this.doWrite(i,a)}catch{}s&&$a(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=hh()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const lr=oi.WebSocket||oi.MozWebSocket;class Bd extends Od{createSocket(e,t,i){return uh?new lr(e,t,i):t?new lr(e,t):new lr(e)}doWrite(e,t){this.ws.send(t)}}class zd extends el{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Sd(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),s=_d();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const a=()=>{i.read().then(({done:o,value:l})=>{o||(this.onPacket(l),a())}).catch(o=>{})};a();const r={type:"open"};this.query.sid&&(r.data=`{"sid":"${this.query.sid}"}`),this._writer.write(r).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;this._writer.write(i).then(()=>{s&&$a(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Vd={websocket:Bd,webtransport:zd,polling:Fd},Hd=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Wd=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Zr(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),i=n.indexOf("]");t!=-1&&i!=-1&&(n=n.substring(0,t)+n.substring(t,i).replace(/:/g,";")+n.substring(i,n.length));let s=Hd.exec(n||""),a={},r=14;for(;r--;)a[Wd[r]]=s[r]||"";return t!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a.pathNames=Gd(a,a.path),a.queryKey=Xd(a,a.query),a}function Gd(n,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function Xd(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,s,a){s&&(t[s]=a)}),t}const jr=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ea=[];jr&&addEventListener("offline",()=>{Ea.forEach(n=>n())},!1);class pn extends Rt{constructor(e,t){if(super(),this.binaryType=bd,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=Zr(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=Zr(t.host).host);Ka(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const s=i.prototype.name;this.transports.push(s),this._transportsByName[s]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Pd(this.opts.query)),jr&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ea.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=lh,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&pn.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",pn.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const s=this.writeBuffer[i].data;if(s&&(t+=Ad(s)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,$a(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,s){if(typeof t=="function"&&(s=t,t=void 0),typeof i=="function"&&(s=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const a={type:e,data:t,options:i};this.emitReserved("packetCreate",a),this.writeBuffer.push(a),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(pn.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),jr&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=Ea.indexOf(this._offlineEventListener);i!==-1&&Ea.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}pn.protocol=lh;class qd extends pn{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;pn.priorWebsocketSuccess=!1;const s=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",f=>{if(!i)if(f.type==="pong"&&f.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;pn.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(d(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const h=new Error("probe error");h.transport=t.name,this.emitReserved("upgradeError",h)}}))};function a(){i||(i=!0,d(),t.close(),t=null)}const r=f=>{const h=new Error("probe error: "+f);h.transport=t.name,a(),this.emitReserved("upgradeError",h)};function o(){r("transport closed")}function l(){r("socket closed")}function c(f){t&&f.name!==t.name&&a()}const d=()=>{t.removeListener("open",s),t.removeListener("error",r),t.removeListener("close",o),this.off("close",l),this.off("upgrading",c)};t.once("open",s),t.once("error",r),t.once("close",o),this.once("close",l),this.once("upgrading",c),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let Yd=class extends qd{constructor(e,t={}){const i=typeof e=="object",s=i?{...e}:{...t};(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(a=>Vd[a]).filter(a=>!!a)),super(i?s:e,s)}};function $d(n,e="",t){let i=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),i=Zr(n)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const a=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+a+":"+i.port+e,i.href=i.protocol+"://"+a+(t&&t.port===i.port?"":":"+i.port),i}const Kd=typeof ArrayBuffer=="function",Zd=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,ph=Object.prototype.toString,jd=typeof Blob=="function"||typeof Blob<"u"&&ph.call(Blob)==="[object BlobConstructor]",Jd=typeof File=="function"||typeof File<"u"&&ph.call(File)==="[object FileConstructor]";function tl(n){return Kd&&(n instanceof ArrayBuffer||Zd(n))||jd&&n instanceof Blob||Jd&&n instanceof File}function Ta(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,i=n.length;t<i;t++)if(Ta(n[t]))return!0;return!1}if(tl(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return Ta(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&Ta(n[t]))return!0;return!1}function Qd(n){const e=[],t=n.data,i=n;return i.data=wa(t,e),i.attachments=e.length,{packet:i,buffers:e}}function wa(n,e,t){if(!n)return n;if(tl(n)){const i={_placeholder:!0,num:e.length};return e.push(n),i}else if(Array.isArray(n)){const i=new Array(n.length);for(let s=0;s<n.length;s++)i[s]=wa(n[s],e);return i}else if(typeof n=="object"&&!(n instanceof Date)){if(n.toJSON&&typeof n.toJSON=="function"&&!t)return wa(n.toJSON(),e,!0);const i={};for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&(i[s]=wa(n[s],e));return i}return n}function ef(n,e){return n.data=Jr(n.data,e),delete n.attachments,n}function Jr(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=Jr(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=Jr(n[t],e));return n}const tf=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var qe;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(qe||(qe={}));class nf{constructor(e){this.replacer=e}encode(e){return(e.type===qe.EVENT||e.type===qe.ACK)&&Ta(e)?this.encodeAsBinary({type:e.type===qe.EVENT?qe.BINARY_EVENT:qe.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===qe.BINARY_EVENT||e.type===qe.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=Qd(e),i=this.encodeAsString(t.packet),s=t.buffers;return s.unshift(i),s}}class il extends Rt{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===qe.BINARY_EVENT;i||t.type===qe.BINARY_ACK?(t.type=i?qe.EVENT:qe.ACK,this.reconstructor=new sf(t)):super.emitReserved("decoded",t)}else if(tl(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if(qe[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===qe.BINARY_EVENT||i.type===qe.BINARY_ACK){const a=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const r=e.substring(a,t);if(r!=Number(r)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const o=Number(r);if(!af(o)||o<1)throw new Error("Illegal attachments");if(o>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=o}if(e.charAt(t+1)==="/"){const a=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(a,t)}else i.nsp="/";const s=e.charAt(t+1);if(s!==""&&Number(s)==s){const a=t+1;for(;++t;){const r=e.charAt(t);if(r==null||Number(r)!=r){--t;break}if(t===e.length)break}i.id=Number(e.substring(a,t+1))}if(e.charAt(++t)){const a=this.tryParse(e.substr(t));if(il.isPayloadValid(i.type,a))i.data=a;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case qe.CONNECT:return jl(t);case qe.DISCONNECT:return t===void 0;case qe.CONNECT_ERROR:return typeof t=="string"||jl(t);case qe.EVENT:case qe.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&tf.indexOf(t[0])===-1);case qe.ACK:case qe.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class sf{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=ef(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const af=Number.isInteger||function(n){return typeof n=="number"&&isFinite(n)&&Math.floor(n)===n};function jl(n){return Object.prototype.toString.call(n)==="[object Object]"}const rf=Object.freeze(Object.defineProperty({__proto__:null,Decoder:il,Encoder:nf,get PacketType(){return qe}},Symbol.toStringTag,{value:"Module"}));function fi(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const of=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class mh extends Rt{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[fi(e,"open",this.onopen.bind(this)),fi(e,"packet",this.onpacket.bind(this)),fi(e,"error",this.onerror.bind(this)),fi(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,s,a;if(of.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const r={type:qe.EVENT,data:t};if(r.options={},r.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const d=this.ids++,f=t.pop();this._registerAckCallback(d,f),r.id=d}const o=(s=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||s===void 0?void 0:s.writable,l=this.connected&&!(!((a=this.io.engine)===null||a===void 0)&&a._hasPingExpired());return this.flags.volatile&&!o||(l?(this.notifyOutgoingListeners(r),this.packet(r)):this.sendBuffer.push(r)),this.flags={},this}_registerAckCallback(e,t){var i;const s=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(s===void 0){this.acks[e]=t;return}const a=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let o=0;o<this.sendBuffer.length;o++)this.sendBuffer[o].id===e&&this.sendBuffer.splice(o,1);t.call(this,new Error("operation has timed out"))},s),r=(...o)=>{this.io.clearTimeoutFn(a),t.apply(this,o)};r.withError=!0,this.acks[e]=r}emitWithAck(e,...t){return new Promise((i,s)=>{const a=(r,o)=>r?s(r):i(o);a.withError=!0,t.push(a),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...a)=>(this._queue[0],s!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(s)):(this._queue.shift(),t&&t(null,...a)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:qe.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case qe.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case qe.EVENT:case qe.BINARY_EVENT:this.onevent(e);break;case qe.ACK:case qe.BINARY_ACK:this.onack(e);break;case qe.DISCONNECT:this.ondisconnect();break;case qe.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...s){i||(i=!0,t.packet({type:qe.ACK,id:e,data:s}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:qe.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function ys(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}ys.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};ys.prototype.reset=function(){this.attempts=0};ys.prototype.setMin=function(n){this.ms=n};ys.prototype.setMax=function(n){this.max=n};ys.prototype.setJitter=function(n){this.jitter=n};class Qr extends Rt{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,Ka(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new ys({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const s=t.parser||rf;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Yd(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const s=fi(t,"open",function(){i.onopen(),e&&e()}),a=o=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",o),e?e(o):this.maybeReconnectOnOpen()},r=fi(t,"error",a);if(this._timeout!==!1){const o=this._timeout,l=this.setTimeoutFn(()=>{s(),a(new Error("timeout")),t.close()},o);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(s),this.subs.push(r),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(fi(e,"ping",this.onping.bind(this)),fi(e,"data",this.ondata.bind(this)),fi(e,"error",this.onerror.bind(this)),fi(e,"close",this.onclose.bind(this)),fi(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){$a(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new mh(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Ss={};function Aa(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=$d(n,e.path||"/socket.io"),i=t.source,s=t.id,a=t.path,r=Ss[s]&&a in Ss[s].nsps,o=e.forceNew||e["force new connection"]||e.multiplex===!1||r;let l;return o?l=new Qr(i,e):(Ss[s]||(Ss[s]=new Qr(i,e)),l=Ss[s]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(Aa,{Manager:Qr,Socket:mh,io:Aa,connect:Aa});/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const nl="184",lf=0,Jl=1,cf=2,Ra=1,hf=2,Ps=3,gn=0,Zt=1,Gi=2,Yi=0,rs=1,eo=2,Ql=3,ec=4,df=5,An=100,ff=101,uf=102,pf=103,mf=104,gf=200,yf=201,xf=202,vf=203,to=204,io=205,_f=206,Sf=207,Mf=208,bf=209,Ef=210,Tf=211,wf=212,Af=213,Rf=214,no=0,so=1,ao=2,cs=3,ro=4,oo=5,lo=6,co=7,gh=0,Cf=1,Pf=2,Ci=0,yh=1,xh=2,vh=3,_h=4,Sh=5,Mh=6,bh=7,Eh=300,Un=301,hs=302,cr=303,hr=304,Za=306,ho=1e3,Xi=1001,fo=1002,Bt=1003,If=1004,qs=1005,Wt=1006,dr=1007,Cn=1008,ni=1009,Th=1010,wh=1011,ks=1012,sl=1013,Di=1014,wi=1015,Ki=1016,al=1017,rl=1018,Us=1020,Ah=35902,Rh=35899,Ch=1021,Ph=1022,yi=1023,Zi=1026,Pn=1027,Ih=1028,ol=1029,Fn=1030,ll=1031,cl=1033,Ca=33776,Pa=33777,Ia=33778,La=33779,uo=35840,po=35841,mo=35842,go=35843,yo=36196,xo=37492,vo=37496,_o=37488,So=37489,Ba=37490,Mo=37491,bo=37808,Eo=37809,To=37810,wo=37811,Ao=37812,Ro=37813,Co=37814,Po=37815,Io=37816,Lo=37817,Do=37818,No=37819,ko=37820,Uo=37821,Fo=36492,Oo=36494,Bo=36495,zo=36283,Vo=36284,za=36285,Ho=36286,Lf=3200,Wo=0,Df=1,ln="",ri="srgb",Va="srgb-linear",Ha="linear",st="srgb",Hn=7680,tc=519,Nf=512,kf=513,Uf=514,hl=515,Ff=516,Of=517,dl=518,Bf=519,ic=35044,nc="300 es",Ai=2e3,Fs=2001;function zf(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Wa(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Vf(){const n=Wa("canvas");return n.style.display="block",n}const sc={};function ac(...n){const e="THREE."+n.shift();console.log(e,...n)}function Lh(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Pe(...n){n=Lh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Je(...n){n=Lh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Go(...n){const e=n.join(" ");e in sc||(sc[e]=!0,Pe(...n))}function Hf(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}const Wf={[no]:so,[ao]:lo,[ro]:co,[cs]:oo,[so]:no,[lo]:ao,[co]:ro,[oo]:cs};class Bn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const Vt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fr=Math.PI/180,Xo=180/Math.PI;function zs(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Vt[n&255]+Vt[n>>8&255]+Vt[n>>16&255]+Vt[n>>24&255]+"-"+Vt[e&255]+Vt[e>>8&255]+"-"+Vt[e>>16&15|64]+Vt[e>>24&255]+"-"+Vt[t&63|128]+Vt[t>>8&255]+"-"+Vt[t>>16&255]+Vt[t>>24&255]+Vt[i&255]+Vt[i>>8&255]+Vt[i>>16&255]+Vt[i>>24&255]).toLowerCase()}function $e(n,e,t){return Math.max(e,Math.min(t,n))}function Gf(n,e){return(n%e+e)%e}function ur(n,e,t){return(1-t)*n+t*e}function Ms(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Kt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Nl=class Nl{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Nl.prototype.isVector2=!0;let tt=Nl;class xs{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,o){let l=i[s+0],c=i[s+1],d=i[s+2],f=i[s+3],h=a[r+0],u=a[r+1],g=a[r+2],y=a[r+3];if(f!==y||l!==h||c!==u||d!==g){let m=l*h+c*u+d*g+f*y;m<0&&(h=-h,u=-u,g=-g,y=-y,m=-m);let p=1-o;if(m<.9995){const b=Math.acos(m),_=Math.sin(b);p=Math.sin(p*b)/_,o=Math.sin(o*b)/_,l=l*p+h*o,c=c*p+u*o,d=d*p+g*o,f=f*p+y*o}else{l=l*p+h*o,c=c*p+u*o,d=d*p+g*o,f=f*p+y*o;const b=1/Math.sqrt(l*l+c*c+d*d+f*f);l*=b,c*=b,d*=b,f*=b}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,a,r){const o=i[s],l=i[s+1],c=i[s+2],d=i[s+3],f=a[r],h=a[r+1],u=a[r+2],g=a[r+3];return e[t]=o*g+d*f+l*u-c*h,e[t+1]=l*g+d*h+c*f-o*u,e[t+2]=c*g+d*u+o*h-l*f,e[t+3]=d*g-o*f-l*h-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(s/2),f=o(a/2),h=l(i/2),u=l(s/2),g=l(a/2);switch(r){case"XYZ":this._x=h*d*f+c*u*g,this._y=c*u*f-h*d*g,this._z=c*d*g+h*u*f,this._w=c*d*f-h*u*g;break;case"YXZ":this._x=h*d*f+c*u*g,this._y=c*u*f-h*d*g,this._z=c*d*g-h*u*f,this._w=c*d*f+h*u*g;break;case"ZXY":this._x=h*d*f-c*u*g,this._y=c*u*f+h*d*g,this._z=c*d*g+h*u*f,this._w=c*d*f-h*u*g;break;case"ZYX":this._x=h*d*f-c*u*g,this._y=c*u*f+h*d*g,this._z=c*d*g-h*u*f,this._w=c*d*f+h*u*g;break;case"YZX":this._x=h*d*f+c*u*g,this._y=c*u*f+h*d*g,this._z=c*d*g-h*u*f,this._w=c*d*f-h*u*g;break;case"XZY":this._x=h*d*f-c*u*g,this._y=c*u*f-h*d*g,this._z=c*d*g+h*u*f,this._w=c*d*f+h*u*g;break;default:Pe("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],o=t[5],l=t[9],c=t[2],d=t[6],f=t[10],h=i+o+f;if(h>0){const u=.5/Math.sqrt(h+1);this._w=.25/u,this._x=(d-l)*u,this._y=(a-c)*u,this._z=(r-s)*u}else if(i>o&&i>f){const u=2*Math.sqrt(1+i-o-f);this._w=(d-l)/u,this._x=.25*u,this._y=(s+r)/u,this._z=(a+c)/u}else if(o>f){const u=2*Math.sqrt(1+o-i-f);this._w=(a-c)/u,this._x=(s+r)/u,this._y=.25*u,this._z=(l+d)/u}else{const u=2*Math.sqrt(1+f-i-o);this._w=(r-s)/u,this._x=(a+c)/u,this._y=(l+d)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+r*o+s*c-a*l,this._y=s*d+r*l+a*o-i*c,this._z=a*d+r*c+i*l-s*o,this._w=r*d-i*o-s*l-a*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),d=Math.sin(c);l=Math.sin(l*c)/d,t=Math.sin(t*c)/d,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+a*t,this._w=this._w*l+r*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+a*t,this._w=this._w*l+r*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const kl=class kl{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(rc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(rc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,o=e.z,l=e.w,c=2*(r*s-o*i),d=2*(o*t-a*s),f=2*(a*i-r*t);return this.x=t+l*c+r*f-o*d,this.y=i+l*d+o*c-a*f,this.z=s+l*f+a*d-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,o=t.y,l=t.z;return this.x=s*l-a*o,this.y=a*r-i*l,this.z=i*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return pr.copy(this).projectOnVector(e),this.sub(pr)}reflect(e){return this.sub(pr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};kl.prototype.isVector3=!0;let V=kl;const pr=new V,rc=new xs,Ul=class Ul{constructor(e,t,i,s,a,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c)}set(e,t,i,s,a,r,o,l,c){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=a,d[5]=l,d[6]=i,d[7]=r,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],d=i[4],f=i[7],h=i[2],u=i[5],g=i[8],y=s[0],m=s[3],p=s[6],b=s[1],_=s[4],v=s[7],x=s[2],E=s[5],C=s[8];return a[0]=r*y+o*b+l*x,a[3]=r*m+o*_+l*E,a[6]=r*p+o*v+l*C,a[1]=c*y+d*b+f*x,a[4]=c*m+d*_+f*E,a[7]=c*p+d*v+f*C,a[2]=h*y+u*b+g*x,a[5]=h*m+u*_+g*E,a[8]=h*p+u*v+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*r*d-t*o*c-i*a*d+i*o*l+s*a*c-s*r*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],d=e[8],f=d*r-o*c,h=o*l-d*a,u=c*a-r*l,g=t*f+i*h+s*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return e[0]=f*y,e[1]=(s*c-d*i)*y,e[2]=(o*i-s*r)*y,e[3]=h*y,e[4]=(d*t-s*l)*y,e[5]=(s*a-o*t)*y,e[6]=u*y,e[7]=(i*l-c*t)*y,e[8]=(r*t-i*a)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,o){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+e,-s*c,s*l,-s*(-c*r+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(mr.makeScale(e,t)),this}rotate(e){return this.premultiply(mr.makeRotation(-e)),this}translate(e,t){return this.premultiply(mr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Ul.prototype.isMatrix3=!0;let Ne=Ul;const mr=new Ne,oc=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),lc=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Xf(){const n={enabled:!0,workingColorSpace:Va,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===st&&(s.r=$i(s.r),s.g=$i(s.g),s.b=$i(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===st&&(s.r=os(s.r),s.g=os(s.g),s.b=os(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ln?Ha:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Go("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Go("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Va]:{primaries:e,whitePoint:i,transfer:Ha,toXYZ:oc,fromXYZ:lc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ri},outputColorSpaceConfig:{drawingBufferColorSpace:ri}},[ri]:{primaries:e,whitePoint:i,transfer:st,toXYZ:oc,fromXYZ:lc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ri}}}),n}const Ye=Xf();function $i(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function os(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Wn;class qf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Wn===void 0&&(Wn=Wa("canvas")),Wn.width=e.width,Wn.height=e.height;const s=Wn.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Wn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Wa("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=$i(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor($i(t[i]/255)*255):t[i]=$i(t[i]);return{data:t,width:e.width,height:e.height}}else return Pe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Yf=0;class fl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Yf++}),this.uuid=zs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(gr(s[r].image)):a.push(gr(s[r]))}else a=gr(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function gr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?qf.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Pe("Texture: Unable to serialize Texture."),{})}let $f=0;const yr=new V;class Yt extends Bn{constructor(e=Yt.DEFAULT_IMAGE,t=Yt.DEFAULT_MAPPING,i=Xi,s=Xi,a=Wt,r=Cn,o=yi,l=ni,c=Yt.DEFAULT_ANISOTROPY,d=ln){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$f++}),this.uuid=zs(),this.name="",this.source=new fl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(yr).x}get height(){return this.source.getSize(yr).y}get depth(){return this.source.getSize(yr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Pe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Pe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Eh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ho:e.x=e.x-Math.floor(e.x);break;case Xi:e.x=e.x<0?0:1;break;case fo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ho:e.y=e.y-Math.floor(e.y);break;case Xi:e.y=e.y<0?0:1;break;case fo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Yt.DEFAULT_IMAGE=null;Yt.DEFAULT_MAPPING=Eh;Yt.DEFAULT_ANISOTROPY=1;const Fl=class Fl{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const l=e.elements,c=l[0],d=l[4],f=l[8],h=l[1],u=l[5],g=l[9],y=l[2],m=l[6],p=l[10];if(Math.abs(d-h)<.01&&Math.abs(f-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+h)<.1&&Math.abs(f+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(c+1)/2,v=(u+1)/2,x=(p+1)/2,E=(d+h)/4,C=(f+y)/4,S=(g+m)/4;return _>v&&_>x?_<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(_),s=E/i,a=C/i):v>x?v<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(v),i=E/s,a=S/s):x<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(x),i=C/a,s=S/a),this.set(i,s,a,t),this}let b=Math.sqrt((m-g)*(m-g)+(f-y)*(f-y)+(h-d)*(h-d));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(f-y)/b,this.z=(h-d)/b,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Fl.prototype.isVector4=!0;let St=Fl;class Kf extends Bn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Wt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new St(0,0,e,t),this.scissorTest=!1,this.viewport=new St(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},a=new Yt(s),r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Wt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new fl(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Pi extends Kf{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Dh extends Yt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=Xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Zf extends Yt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=Xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ya=class Ya{constructor(e,t,i,s,a,r,o,l,c,d,f,h,u,g,y,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c,d,f,h,u,g,y,m)}set(e,t,i,s,a,r,o,l,c,d,f,h,u,g,y,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=l,p[2]=c,p[6]=d,p[10]=f,p[14]=h,p[3]=u,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ya().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Gn.setFromMatrixColumn(e,0).length(),a=1/Gn.setFromMatrixColumn(e,1).length(),r=1/Gn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),d=Math.cos(a),f=Math.sin(a);if(e.order==="XYZ"){const h=r*d,u=r*f,g=o*d,y=o*f;t[0]=l*d,t[4]=-l*f,t[8]=c,t[1]=u+g*c,t[5]=h-y*c,t[9]=-o*l,t[2]=y-h*c,t[6]=g+u*c,t[10]=r*l}else if(e.order==="YXZ"){const h=l*d,u=l*f,g=c*d,y=c*f;t[0]=h+y*o,t[4]=g*o-u,t[8]=r*c,t[1]=r*f,t[5]=r*d,t[9]=-o,t[2]=u*o-g,t[6]=y+h*o,t[10]=r*l}else if(e.order==="ZXY"){const h=l*d,u=l*f,g=c*d,y=c*f;t[0]=h-y*o,t[4]=-r*f,t[8]=g+u*o,t[1]=u+g*o,t[5]=r*d,t[9]=y-h*o,t[2]=-r*c,t[6]=o,t[10]=r*l}else if(e.order==="ZYX"){const h=r*d,u=r*f,g=o*d,y=o*f;t[0]=l*d,t[4]=g*c-u,t[8]=h*c+y,t[1]=l*f,t[5]=y*c+h,t[9]=u*c-g,t[2]=-c,t[6]=o*l,t[10]=r*l}else if(e.order==="YZX"){const h=r*l,u=r*c,g=o*l,y=o*c;t[0]=l*d,t[4]=y-h*f,t[8]=g*f+u,t[1]=f,t[5]=r*d,t[9]=-o*d,t[2]=-c*d,t[6]=u*f+g,t[10]=h-y*f}else if(e.order==="XZY"){const h=r*l,u=r*c,g=o*l,y=o*c;t[0]=l*d,t[4]=-f,t[8]=c*d,t[1]=h*f+y,t[5]=r*d,t[9]=u*f-g,t[2]=g*f-u,t[6]=o*d,t[10]=y*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(jf,e,Jf)}lookAt(e,t,i){const s=this.elements;return Qt.subVectors(e,t),Qt.lengthSq()===0&&(Qt.z=1),Qt.normalize(),en.crossVectors(i,Qt),en.lengthSq()===0&&(Math.abs(i.z)===1?Qt.x+=1e-4:Qt.z+=1e-4,Qt.normalize(),en.crossVectors(i,Qt)),en.normalize(),Ys.crossVectors(Qt,en),s[0]=en.x,s[4]=Ys.x,s[8]=Qt.x,s[1]=en.y,s[5]=Ys.y,s[9]=Qt.y,s[2]=en.z,s[6]=Ys.z,s[10]=Qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],d=i[1],f=i[5],h=i[9],u=i[13],g=i[2],y=i[6],m=i[10],p=i[14],b=i[3],_=i[7],v=i[11],x=i[15],E=s[0],C=s[4],S=s[8],w=s[12],L=s[1],R=s[5],P=s[9],F=s[13],N=s[2],I=s[6],B=s[10],O=s[14],K=s[3],j=s[7],ee=s[11],ue=s[15];return a[0]=r*E+o*L+l*N+c*K,a[4]=r*C+o*R+l*I+c*j,a[8]=r*S+o*P+l*B+c*ee,a[12]=r*w+o*F+l*O+c*ue,a[1]=d*E+f*L+h*N+u*K,a[5]=d*C+f*R+h*I+u*j,a[9]=d*S+f*P+h*B+u*ee,a[13]=d*w+f*F+h*O+u*ue,a[2]=g*E+y*L+m*N+p*K,a[6]=g*C+y*R+m*I+p*j,a[10]=g*S+y*P+m*B+p*ee,a[14]=g*w+y*F+m*O+p*ue,a[3]=b*E+_*L+v*N+x*K,a[7]=b*C+_*R+v*I+x*j,a[11]=b*S+_*P+v*B+x*ee,a[15]=b*w+_*F+v*O+x*ue,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],o=e[5],l=e[9],c=e[13],d=e[2],f=e[6],h=e[10],u=e[14],g=e[3],y=e[7],m=e[11],p=e[15],b=l*u-c*h,_=o*u-c*f,v=o*h-l*f,x=r*u-c*d,E=r*h-l*d,C=r*f-o*d;return t*(y*b-m*_+p*v)-i*(g*b-m*x+p*E)+s*(g*_-y*x+p*C)-a*(g*v-y*E+m*C)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],d=e[8],f=e[9],h=e[10],u=e[11],g=e[12],y=e[13],m=e[14],p=e[15],b=t*o-i*r,_=t*l-s*r,v=t*c-a*r,x=i*l-s*o,E=i*c-a*o,C=s*c-a*l,S=d*y-f*g,w=d*m-h*g,L=d*p-u*g,R=f*m-h*y,P=f*p-u*y,F=h*p-u*m,N=b*F-_*P+v*R+x*L-E*w+C*S;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/N;return e[0]=(o*F-l*P+c*R)*I,e[1]=(s*P-i*F-a*R)*I,e[2]=(y*C-m*E+p*x)*I,e[3]=(h*E-f*C-u*x)*I,e[4]=(l*L-r*F-c*w)*I,e[5]=(t*F-s*L+a*w)*I,e[6]=(m*v-g*C-p*_)*I,e[7]=(d*C-h*v+u*_)*I,e[8]=(r*P-o*L+c*S)*I,e[9]=(i*L-t*P-a*S)*I,e[10]=(g*E-y*v+p*b)*I,e[11]=(f*v-d*E-u*b)*I,e[12]=(o*w-r*R-l*S)*I,e[13]=(t*R-i*w+s*S)*I,e[14]=(y*_-g*x-m*b)*I,e[15]=(d*x-f*_+h*b)*I,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,o=e.y,l=e.z,c=a*r,d=a*o;return this.set(c*r+i,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+i,d*l-s*r,0,c*l-s*o,d*l+s*r,a*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,o=t._z,l=t._w,c=a+a,d=r+r,f=o+o,h=a*c,u=a*d,g=a*f,y=r*d,m=r*f,p=o*f,b=l*c,_=l*d,v=l*f,x=i.x,E=i.y,C=i.z;return s[0]=(1-(y+p))*x,s[1]=(u+v)*x,s[2]=(g-_)*x,s[3]=0,s[4]=(u-v)*E,s[5]=(1-(h+p))*E,s[6]=(m+b)*E,s[7]=0,s[8]=(g+_)*C,s[9]=(m-b)*C,s[10]=(1-(h+y))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const a=this.determinant();if(a===0)return i.set(1,1,1),t.identity(),this;let r=Gn.set(s[0],s[1],s[2]).length();const o=Gn.set(s[4],s[5],s[6]).length(),l=Gn.set(s[8],s[9],s[10]).length();a<0&&(r=-r),li.copy(this);const c=1/r,d=1/o,f=1/l;return li.elements[0]*=c,li.elements[1]*=c,li.elements[2]*=c,li.elements[4]*=d,li.elements[5]*=d,li.elements[6]*=d,li.elements[8]*=f,li.elements[9]*=f,li.elements[10]*=f,t.setFromRotationMatrix(li),i.x=r,i.y=o,i.z=l,this}makePerspective(e,t,i,s,a,r,o=Ai,l=!1){const c=this.elements,d=2*a/(t-e),f=2*a/(i-s),h=(t+e)/(t-e),u=(i+s)/(i-s);let g,y;if(l)g=a/(r-a),y=r*a/(r-a);else if(o===Ai)g=-(r+a)/(r-a),y=-2*r*a/(r-a);else if(o===Fs)g=-r/(r-a),y=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,a,r,o=Ai,l=!1){const c=this.elements,d=2/(t-e),f=2/(i-s),h=-(t+e)/(t-e),u=-(i+s)/(i-s);let g,y;if(l)g=1/(r-a),y=r/(r-a);else if(o===Ai)g=-2/(r-a),y=-(r+a)/(r-a);else if(o===Fs)g=-1/(r-a),y=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Ya.prototype.isMatrix4=!0;let wt=Ya;const Gn=new V,li=new wt,jf=new V(0,0,0),Jf=new V(1,1,1),en=new V,Ys=new V,Qt=new V,cc=new wt,hc=new xs;class yn{constructor(e=0,t=0,i=0,s=yn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],d=s[9],f=s[2],h=s[6],u=s[10];switch(t){case"XYZ":this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,u),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin($e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-$e(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,u),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-$e(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,u),this._y=0);break;default:Pe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return cc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(cc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return hc.setFromEuler(this),this.setFromQuaternion(hc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yn.DEFAULT_ORDER="XYZ";class Nh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Qf=0;const dc=new V,Xn=new xs,Ui=new wt,$s=new V,bs=new V,eu=new V,tu=new xs,fc=new V(1,0,0),uc=new V(0,1,0),pc=new V(0,0,1),mc={type:"added"},iu={type:"removed"},qn={type:"childadded",child:null},xr={type:"childremoved",child:null};class Gt extends Bn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Qf++}),this.uuid=zs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Gt.DEFAULT_UP.clone();const e=new V,t=new yn,i=new xs,s=new V(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new wt},normalMatrix:{value:new Ne}}),this.matrix=new wt,this.matrixWorld=new wt,this.matrixAutoUpdate=Gt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xn.setFromAxisAngle(e,t),this.quaternion.multiply(Xn),this}rotateOnWorldAxis(e,t){return Xn.setFromAxisAngle(e,t),this.quaternion.premultiply(Xn),this}rotateX(e){return this.rotateOnAxis(fc,e)}rotateY(e){return this.rotateOnAxis(uc,e)}rotateZ(e){return this.rotateOnAxis(pc,e)}translateOnAxis(e,t){return dc.copy(e).applyQuaternion(this.quaternion),this.position.add(dc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(fc,e)}translateY(e){return this.translateOnAxis(uc,e)}translateZ(e){return this.translateOnAxis(pc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ui.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?$s.copy(e):$s.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),bs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ui.lookAt(bs,$s,this.up):Ui.lookAt($s,bs,this.up),this.quaternion.setFromRotationMatrix(Ui),s&&(Ui.extractRotation(s.matrixWorld),Xn.setFromRotationMatrix(Ui),this.quaternion.premultiply(Xn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(mc),qn.child=e,this.dispatchEvent(qn),qn.child=null):Je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(iu),xr.child=e,this.dispatchEvent(xr),xr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ui.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ui.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ui),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(mc),qn.child=e,this.dispatchEvent(qn),qn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bs,e,eu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bs,tu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,a=this.matrix.elements;a[12]+=t-a[0]*t-a[4]*i-a[8]*s,a[13]+=i-a[1]*t-a[5]*i-a[9]*s,a[14]+=s-a[2]*t-a[6]*i-a[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const f=l[c];a(e.shapes,f)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(a(e.animations,l))}}if(t){const o=r(e.geometries),l=r(e.materials),c=r(e.textures),d=r(e.images),f=r(e.shapes),h=r(e.skeletons),u=r(e.animations),g=r(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=s,i;function r(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Gt.DEFAULT_UP=new V(0,1,0);Gt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class In extends Gt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const nu={type:"move"};class vr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new In,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new In,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new In,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){r=!0;for(const y of e.hand.values()){const m=t.getJointPose(y,i),p=this._getHandJoint(c,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const d=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=d.position.distanceTo(f.position),u=.02,g=.005;c.inputState.pinching&&h>u+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=u-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(nu)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new In;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const kh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},tn={h:0,s:0,l:0},Ks={h:0,s:0,l:0};function _r(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class it{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ri){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ye.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ye.workingColorSpace){if(e=Gf(e,1),t=$e(t,0,1),i=$e(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=_r(r,a,e+1/3),this.g=_r(r,a,e),this.b=_r(r,a,e-1/3)}return Ye.colorSpaceToWorking(this,s),this}setStyle(e,t=ri){function i(a){a!==void 0&&parseFloat(a)<1&&Pe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:Pe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);Pe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ri){const i=kh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Pe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=$i(e.r),this.g=$i(e.g),this.b=$i(e.b),this}copyLinearToSRGB(e){return this.r=os(e.r),this.g=os(e.g),this.b=os(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ri){return Ye.workingToColorSpace(Ht.copy(this),e),Math.round($e(Ht.r*255,0,255))*65536+Math.round($e(Ht.g*255,0,255))*256+Math.round($e(Ht.b*255,0,255))}getHexString(e=ri){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(Ht.copy(this),t);const i=Ht.r,s=Ht.g,a=Ht.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let l,c;const d=(o+r)/2;if(o===r)l=0,c=0;else{const f=r-o;switch(c=d<=.5?f/(r+o):f/(2-r-o),r){case i:l=(s-a)/f+(s<a?6:0);break;case s:l=(a-i)/f+2;break;case a:l=(i-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(Ht.copy(this),t),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=ri){Ye.workingToColorSpace(Ht.copy(this),e);const t=Ht.r,i=Ht.g,s=Ht.b;return e!==ri?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(tn),this.setHSL(tn.h+e,tn.s+t,tn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(tn),e.getHSL(Ks);const i=ur(tn.h,Ks.h,t),s=ur(tn.s,Ks.s,t),a=ur(tn.l,Ks.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ht=new it;it.NAMES=kh;class su extends Gt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yn,this.environmentIntensity=1,this.environmentRotation=new yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const ci=new V,Fi=new V,Sr=new V,Oi=new V,Yn=new V,$n=new V,gc=new V,Mr=new V,br=new V,Er=new V,Tr=new St,wr=new St,Ar=new St;class pi{constructor(e=new V,t=new V,i=new V){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),ci.subVectors(e,t),s.cross(ci);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){ci.subVectors(s,t),Fi.subVectors(i,t),Sr.subVectors(e,t);const r=ci.dot(ci),o=ci.dot(Fi),l=ci.dot(Sr),c=Fi.dot(Fi),d=Fi.dot(Sr),f=r*c-o*o;if(f===0)return a.set(0,0,0),null;const h=1/f,u=(c*l-o*d)*h,g=(r*d-o*l)*h;return a.set(1-u-g,g,u)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Oi)===null?!1:Oi.x>=0&&Oi.y>=0&&Oi.x+Oi.y<=1}static getInterpolation(e,t,i,s,a,r,o,l){return this.getBarycoord(e,t,i,s,Oi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Oi.x),l.addScaledVector(r,Oi.y),l.addScaledVector(o,Oi.z),l)}static getInterpolatedAttribute(e,t,i,s,a,r){return Tr.setScalar(0),wr.setScalar(0),Ar.setScalar(0),Tr.fromBufferAttribute(e,t),wr.fromBufferAttribute(e,i),Ar.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(Tr,a.x),r.addScaledVector(wr,a.y),r.addScaledVector(Ar,a.z),r}static isFrontFacing(e,t,i,s){return ci.subVectors(i,t),Fi.subVectors(e,t),ci.cross(Fi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ci.subVectors(this.c,this.b),Fi.subVectors(this.a,this.b),ci.cross(Fi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return pi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return pi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return pi.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return pi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return pi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,o;Yn.subVectors(s,i),$n.subVectors(a,i),Mr.subVectors(e,i);const l=Yn.dot(Mr),c=$n.dot(Mr);if(l<=0&&c<=0)return t.copy(i);br.subVectors(e,s);const d=Yn.dot(br),f=$n.dot(br);if(d>=0&&f<=d)return t.copy(s);const h=l*f-d*c;if(h<=0&&l>=0&&d<=0)return r=l/(l-d),t.copy(i).addScaledVector(Yn,r);Er.subVectors(e,a);const u=Yn.dot(Er),g=$n.dot(Er);if(g>=0&&u<=g)return t.copy(a);const y=u*c-l*g;if(y<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector($n,o);const m=d*g-u*f;if(m<=0&&f-d>=0&&u-g>=0)return gc.subVectors(a,s),o=(f-d)/(f-d+(u-g)),t.copy(s).addScaledVector(gc,o);const p=1/(m+y+h);return r=y*p,o=h*p,t.copy(i).addScaledVector(Yn,r).addScaledVector($n,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class On{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(hi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(hi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=hi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,hi):hi.fromBufferAttribute(a,r),hi.applyMatrix4(e.matrixWorld),this.expandByPoint(hi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Zs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Zs.copy(i.boundingBox)),Zs.applyMatrix4(e.matrixWorld),this.union(Zs)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,hi),hi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Es),js.subVectors(this.max,Es),Kn.subVectors(e.a,Es),Zn.subVectors(e.b,Es),jn.subVectors(e.c,Es),nn.subVectors(Zn,Kn),sn.subVectors(jn,Zn),_n.subVectors(Kn,jn);let t=[0,-nn.z,nn.y,0,-sn.z,sn.y,0,-_n.z,_n.y,nn.z,0,-nn.x,sn.z,0,-sn.x,_n.z,0,-_n.x,-nn.y,nn.x,0,-sn.y,sn.x,0,-_n.y,_n.x,0];return!Rr(t,Kn,Zn,jn,js)||(t=[1,0,0,0,1,0,0,0,1],!Rr(t,Kn,Zn,jn,js))?!1:(Js.crossVectors(nn,sn),t=[Js.x,Js.y,Js.z],Rr(t,Kn,Zn,jn,js))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,hi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(hi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Bi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Bi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Bi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Bi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Bi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Bi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Bi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Bi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Bi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Bi=[new V,new V,new V,new V,new V,new V,new V,new V],hi=new V,Zs=new On,Kn=new V,Zn=new V,jn=new V,nn=new V,sn=new V,_n=new V,Es=new V,js=new V,Js=new V,Sn=new V;function Rr(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){Sn.fromArray(n,a);const o=s.x*Math.abs(Sn.x)+s.y*Math.abs(Sn.y)+s.z*Math.abs(Sn.z),l=e.dot(Sn),c=t.dot(Sn),d=i.dot(Sn);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const At=new V,Qs=new tt;let au=0;class Ii extends Bn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:au++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=ic,this.updateRanges=[],this.gpuType=wi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Qs.fromBufferAttribute(this,t),Qs.applyMatrix3(e),this.setXY(t,Qs.x,Qs.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)At.fromBufferAttribute(this,t),At.applyMatrix3(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)At.fromBufferAttribute(this,t),At.applyMatrix4(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)At.fromBufferAttribute(this,t),At.applyNormalMatrix(e),this.setXYZ(t,At.x,At.y,At.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)At.fromBufferAttribute(this,t),At.transformDirection(e),this.setXYZ(t,At.x,At.y,At.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ms(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Kt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ms(t,this.array)),t}setX(e,t){return this.normalized&&(t=Kt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ms(t,this.array)),t}setY(e,t){return this.normalized&&(t=Kt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ms(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Kt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ms(t,this.array)),t}setW(e,t){return this.normalized&&(t=Kt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Kt(t,this.array),i=Kt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Kt(t,this.array),i=Kt(i,this.array),s=Kt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=Kt(t,this.array),i=Kt(i,this.array),s=Kt(s,this.array),a=Kt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ic&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Uh extends Ii{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Fh extends Ii{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class $t extends Ii{constructor(e,t,i){super(new Float32Array(e),t,i)}}const ru=new On,Ts=new V,Cr=new V;class ul{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):ru.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ts.subVectors(e,this.center);const t=Ts.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Ts,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Cr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ts.copy(e.center).add(Cr)),this.expandByPoint(Ts.copy(e.center).sub(Cr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let ou=0;const ai=new wt,Pr=new Gt,Jn=new V,ei=new On,ws=new On,Ft=new V;class _i extends Bn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ou++}),this.uuid=zs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(zf(e)?Fh:Uh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Ne().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ai.makeRotationFromQuaternion(e),this.applyMatrix4(ai),this}rotateX(e){return ai.makeRotationX(e),this.applyMatrix4(ai),this}rotateY(e){return ai.makeRotationY(e),this.applyMatrix4(ai),this}rotateZ(e){return ai.makeRotationZ(e),this.applyMatrix4(ai),this}translate(e,t,i){return ai.makeTranslation(e,t,i),this.applyMatrix4(ai),this}scale(e,t,i){return ai.makeScale(e,t,i),this.applyMatrix4(ai),this}lookAt(e){return Pr.lookAt(e),Pr.updateMatrix(),this.applyMatrix4(Pr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Jn).negate(),this.translate(Jn.x,Jn.y,Jn.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new $t(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&Pe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new On);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];ei.setFromBufferAttribute(a),this.morphTargetsRelative?(Ft.addVectors(this.boundingBox.min,ei.min),this.boundingBox.expandByPoint(Ft),Ft.addVectors(this.boundingBox.max,ei.max),this.boundingBox.expandByPoint(Ft)):(this.boundingBox.expandByPoint(ei.min),this.boundingBox.expandByPoint(ei.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ul);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){const i=this.boundingSphere.center;if(ei.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];ws.setFromBufferAttribute(o),this.morphTargetsRelative?(Ft.addVectors(ei.min,ws.min),ei.expandByPoint(Ft),Ft.addVectors(ei.max,ws.max),ei.expandByPoint(Ft)):(ei.expandByPoint(ws.min),ei.expandByPoint(ws.max))}ei.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)Ft.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(Ft));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)Ft.fromBufferAttribute(o,c),l&&(Jn.fromBufferAttribute(e,c),Ft.add(Jn)),s=Math.max(s,i.distanceToSquared(Ft))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ii(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],l=[];for(let S=0;S<i.count;S++)o[S]=new V,l[S]=new V;const c=new V,d=new V,f=new V,h=new tt,u=new tt,g=new tt,y=new V,m=new V;function p(S,w,L){c.fromBufferAttribute(i,S),d.fromBufferAttribute(i,w),f.fromBufferAttribute(i,L),h.fromBufferAttribute(a,S),u.fromBufferAttribute(a,w),g.fromBufferAttribute(a,L),d.sub(c),f.sub(c),u.sub(h),g.sub(h);const R=1/(u.x*g.y-g.x*u.y);isFinite(R)&&(y.copy(d).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(R),m.copy(f).multiplyScalar(u.x).addScaledVector(d,-g.x).multiplyScalar(R),o[S].add(y),o[w].add(y),o[L].add(y),l[S].add(m),l[w].add(m),l[L].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let S=0,w=b.length;S<w;++S){const L=b[S],R=L.start,P=L.count;for(let F=R,N=R+P;F<N;F+=3)p(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const _=new V,v=new V,x=new V,E=new V;function C(S){x.fromBufferAttribute(s,S),E.copy(x);const w=o[S];_.copy(w),_.sub(x.multiplyScalar(x.dot(w))).normalize(),v.crossVectors(E,w);const R=v.dot(l[S])<0?-1:1;r.setXYZW(S,_.x,_.y,_.z,R)}for(let S=0,w=b.length;S<w;++S){const L=b[S],R=L.start,P=L.count;for(let F=R,N=R+P;F<N;F+=3)C(e.getX(F+0)),C(e.getX(F+1)),C(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ii(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,u=i.count;h<u;h++)i.setXYZ(h,0,0,0);const s=new V,a=new V,r=new V,o=new V,l=new V,c=new V,d=new V,f=new V;if(e)for(let h=0,u=e.count;h<u;h+=3){const g=e.getX(h+0),y=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,y),r.fromBufferAttribute(t,m),d.subVectors(r,a),f.subVectors(s,a),d.cross(f),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,m),o.add(d),l.add(d),c.add(d),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,u=t.count;h<u;h+=3)s.fromBufferAttribute(t,h+0),a.fromBufferAttribute(t,h+1),r.fromBufferAttribute(t,h+2),d.subVectors(r,a),f.subVectors(s,a),d.cross(f),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ft.fromBufferAttribute(e,t),Ft.normalize(),e.setXYZ(t,Ft.x,Ft.y,Ft.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,f=o.normalized,h=new c.constructor(l.length*d);let u=0,g=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?u=l[y]*o.data.stride+o.offset:u=l[y]*d;for(let p=0;p<d;p++)h[g++]=c[u++]}return new Ii(h,d,f)}if(this.index===null)return Pe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new _i,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let d=0,f=c.length;d<f;d++){const h=c[d],u=e(h,i);l.push(u)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let f=0,h=c.length;f<h;f++){const u=c[f];d.push(u.toJSON(e.data))}d.length>0&&(s[l]=d,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const d=s[c];this.setAttribute(c,d.clone(t))}const a=e.morphAttributes;for(const c in a){const d=[],f=a[c];for(let h=0,u=f.length;h<u;h++)d.push(f[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let c=0,d=r.length;c<d;c++){const f=r[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let lu=0;class Vs extends Bn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:lu++}),this.uuid=zs(),this.name="",this.type="Material",this.blending=rs,this.side=gn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=to,this.blendDst=io,this.blendEquation=An,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new it(0,0,0),this.blendAlpha=0,this.depthFunc=cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Hn,this.stencilZFail=Hn,this.stencilZPass=Hn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Pe(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Pe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==rs&&(i.blending=this.blending),this.side!==gn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==to&&(i.blendSrc=this.blendSrc),this.blendDst!==io&&(i.blendDst=this.blendDst),this.blendEquation!==An&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==cs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==tc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Hn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Hn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Hn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const zi=new V,Ir=new V,ea=new V,an=new V,Lr=new V,ta=new V,Dr=new V;class cu{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=zi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zi.copy(this.origin).addScaledVector(this.direction,t),zi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Ir.copy(e).add(t).multiplyScalar(.5),ea.copy(t).sub(e).normalize(),an.copy(this.origin).sub(Ir);const a=e.distanceTo(t)*.5,r=-this.direction.dot(ea),o=an.dot(this.direction),l=-an.dot(ea),c=an.lengthSq(),d=Math.abs(1-r*r);let f,h,u,g;if(d>0)if(f=r*l-o,h=r*o-l,g=a*d,f>=0)if(h>=-g)if(h<=g){const y=1/d;f*=y,h*=y,u=f*(f+r*h+2*o)+h*(r*f+h+2*l)+c}else h=a,f=Math.max(0,-(r*h+o)),u=-f*f+h*(h+2*l)+c;else h=-a,f=Math.max(0,-(r*h+o)),u=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-r*a+o)),h=f>0?-a:Math.min(Math.max(-a,-l),a),u=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-a,-l),a),u=h*(h+2*l)+c):(f=Math.max(0,-(r*a+o)),h=f>0?a:Math.min(Math.max(-a,-l),a),u=-f*f+h*(h+2*l)+c);else h=r>0?-a:a,f=Math.max(0,-(r*h+o)),u=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Ir).addScaledVector(ea,h),u}intersectSphere(e,t){zi.subVectors(e.center,this.origin);const i=zi.dot(this.direction),s=zi.dot(zi)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,o,l;const c=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),d>=0?(a=(e.min.y-h.y)*d,r=(e.max.y-h.y)*d):(a=(e.max.y-h.y)*d,r=(e.min.y-h.y)*d),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(o=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,zi)!==null}intersectTriangle(e,t,i,s,a){Lr.subVectors(t,e),ta.subVectors(i,e),Dr.crossVectors(Lr,ta);let r=this.direction.dot(Dr),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;an.subVectors(this.origin,e);const l=o*this.direction.dot(ta.crossVectors(an,ta));if(l<0)return null;const c=o*this.direction.dot(Lr.cross(an));if(c<0||l+c>r)return null;const d=-o*an.dot(Dr);return d<0?null:this.at(d/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ls extends Vs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new it(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.combine=gh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const yc=new wt,Mn=new cu,ia=new ul,xc=new V,na=new V,sa=new V,aa=new V,Nr=new V,ra=new V,vc=new V,oa=new V;class ht extends Gt{constructor(e=new _i,t=new Ls){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){ra.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const d=o[l],f=a[l];d!==0&&(Nr.fromBufferAttribute(f,e),r?ra.addScaledVector(Nr,d):ra.addScaledVector(Nr.sub(t),d))}t.add(ra)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ia.copy(i.boundingSphere),ia.applyMatrix4(a),Mn.copy(e.ray).recast(e.near),!(ia.containsPoint(Mn.origin)===!1&&(Mn.intersectSphere(ia,xc)===null||Mn.origin.distanceToSquared(xc)>(e.far-e.near)**2))&&(yc.copy(a).invert(),Mn.copy(e.ray).applyMatrix4(yc),!(i.boundingBox!==null&&Mn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Mn)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,d=a.attributes.uv1,f=a.attributes.normal,h=a.groups,u=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,y=h.length;g<y;g++){const m=h[g],p=r[m.materialIndex],b=Math.max(m.start,u.start),_=Math.min(o.count,Math.min(m.start+m.count,u.start+u.count));for(let v=b,x=_;v<x;v+=3){const E=o.getX(v),C=o.getX(v+1),S=o.getX(v+2);s=la(this,p,e,i,c,d,f,E,C,S),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,u.start),y=Math.min(o.count,u.start+u.count);for(let m=g,p=y;m<p;m+=3){const b=o.getX(m),_=o.getX(m+1),v=o.getX(m+2);s=la(this,r,e,i,c,d,f,b,_,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let g=0,y=h.length;g<y;g++){const m=h[g],p=r[m.materialIndex],b=Math.max(m.start,u.start),_=Math.min(l.count,Math.min(m.start+m.count,u.start+u.count));for(let v=b,x=_;v<x;v+=3){const E=v,C=v+1,S=v+2;s=la(this,p,e,i,c,d,f,E,C,S),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,u.start),y=Math.min(l.count,u.start+u.count);for(let m=g,p=y;m<p;m+=3){const b=m,_=m+1,v=m+2;s=la(this,r,e,i,c,d,f,b,_,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function hu(n,e,t,i,s,a,r,o){let l;if(e.side===Zt?l=i.intersectTriangle(r,a,s,!0,o):l=i.intersectTriangle(s,a,r,e.side===gn,o),l===null)return null;oa.copy(o),oa.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(oa);return c<t.near||c>t.far?null:{distance:c,point:oa.clone(),object:n}}function la(n,e,t,i,s,a,r,o,l,c){n.getVertexPosition(o,na),n.getVertexPosition(l,sa),n.getVertexPosition(c,aa);const d=hu(n,e,t,i,na,sa,aa,vc);if(d){const f=new V;pi.getBarycoord(vc,na,sa,aa,f),s&&(d.uv=pi.getInterpolatedAttribute(s,o,l,c,f,new tt)),a&&(d.uv1=pi.getInterpolatedAttribute(a,o,l,c,f,new tt)),r&&(d.normal=pi.getInterpolatedAttribute(r,o,l,c,f,new V),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new V,materialIndex:0};pi.getNormal(na,sa,aa,h.normal),d.face=h,d.barycoord=f}return d}class du extends Yt{constructor(e=null,t=1,i=1,s,a,r,o,l,c=Bt,d=Bt,f,h){super(null,r,o,l,c,d,s,a,f,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const kr=new V,fu=new V,uu=new Ne;class En{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=kr.subVectors(i,t).cross(fu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(kr),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/a;return i===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(s,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||uu.getNormalMatrix(e),s=this.coplanarPoint(kr).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const bn=new ul,pu=new tt(.5,.5),ca=new V;class pl{constructor(e=new En,t=new En,i=new En,s=new En,a=new En,r=new En){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ai,i=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],l=a[2],c=a[3],d=a[4],f=a[5],h=a[6],u=a[7],g=a[8],y=a[9],m=a[10],p=a[11],b=a[12],_=a[13],v=a[14],x=a[15];if(s[0].setComponents(c-r,u-d,p-g,x-b).normalize(),s[1].setComponents(c+r,u+d,p+g,x+b).normalize(),s[2].setComponents(c+o,u+f,p+y,x+_).normalize(),s[3].setComponents(c-o,u-f,p-y,x-_).normalize(),i)s[4].setComponents(l,h,m,v).normalize(),s[5].setComponents(c-l,u-h,p-m,x-v).normalize();else if(s[4].setComponents(c-l,u-h,p-m,x-v).normalize(),t===Ai)s[5].setComponents(c+l,u+h,p+m,x+v).normalize();else if(t===Fs)s[5].setComponents(l,h,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),bn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),bn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(bn)}intersectsSprite(e){bn.center.set(0,0,0);const t=pu.distanceTo(e.center);return bn.radius=.7071067811865476+t,bn.applyMatrix4(e.matrixWorld),this.intersectsSphere(bn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(ca.x=s.normal.x>0?e.max.x:e.min.x,ca.y=s.normal.y>0?e.max.y:e.min.y,ca.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ca)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Oh extends Yt{constructor(e=[],t=Un,i,s,a,r,o,l,c,d){super(e,t,i,s,a,r,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ds extends Yt{constructor(e,t,i=Di,s,a,r,o=Bt,l=Bt,c,d=Zi,f=1){if(d!==Zi&&d!==Pn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:f};super(h,s,a,r,o,l,d,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new fl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class mu extends ds{constructor(e,t=Di,i=Un,s,a,r=Bt,o=Bt,l,c=Zi){const d={width:e,height:e,depth:1},f=[d,d,d,d,d,d];super(e,e,t,i,s,a,r,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Bh extends Yt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class mn extends _i{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const l=[],c=[],d=[],f=[];let h=0,u=0;g("z","y","x",-1,-1,i,t,e,r,a,0),g("z","y","x",1,-1,i,t,-e,r,a,1),g("x","z","y",1,1,e,i,t,s,r,2),g("x","z","y",1,-1,e,i,-t,s,r,3),g("x","y","z",1,-1,e,t,i,s,a,4),g("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new $t(c,3)),this.setAttribute("normal",new $t(d,3)),this.setAttribute("uv",new $t(f,2));function g(y,m,p,b,_,v,x,E,C,S,w){const L=v/C,R=x/S,P=v/2,F=x/2,N=E/2,I=C+1,B=S+1;let O=0,K=0;const j=new V;for(let ee=0;ee<B;ee++){const ue=ee*R-F;for(let ge=0;ge<I;ge++){const De=ge*L-P;j[y]=De*b,j[m]=ue*_,j[p]=N,c.push(j.x,j.y,j.z),j[y]=0,j[m]=0,j[p]=E>0?1:-1,d.push(j.x,j.y,j.z),f.push(ge/C),f.push(1-ee/S),O+=1}}for(let ee=0;ee<S;ee++)for(let ue=0;ue<C;ue++){const ge=h+ue+I*ee,De=h+ue+I*(ee+1),Xe=h+(ue+1)+I*(ee+1),Ce=h+(ue+1)+I*ee;l.push(ge,De,Ce),l.push(De,Xe,Ce),K+=6}o.addGroup(u,K,w),u+=K,h+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class on extends _i{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const d=[],f=[],h=[],u=[];let g=0;const y=[],m=i/2;let p=0;b(),r===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(d),this.setAttribute("position",new $t(f,3)),this.setAttribute("normal",new $t(h,3)),this.setAttribute("uv",new $t(u,2));function b(){const v=new V,x=new V;let E=0;const C=(t-e)/i;for(let S=0;S<=a;S++){const w=[],L=S/a,R=L*(t-e)+e;for(let P=0;P<=s;P++){const F=P/s,N=F*l+o,I=Math.sin(N),B=Math.cos(N);x.x=R*I,x.y=-L*i+m,x.z=R*B,f.push(x.x,x.y,x.z),v.set(I,C,B).normalize(),h.push(v.x,v.y,v.z),u.push(F,1-L),w.push(g++)}y.push(w)}for(let S=0;S<s;S++)for(let w=0;w<a;w++){const L=y[w][S],R=y[w+1][S],P=y[w+1][S+1],F=y[w][S+1];(e>0||w!==0)&&(d.push(L,R,F),E+=3),(t>0||w!==a-1)&&(d.push(R,P,F),E+=3)}c.addGroup(p,E,0),p+=E}function _(v){const x=g,E=new tt,C=new V;let S=0;const w=v===!0?e:t,L=v===!0?1:-1;for(let P=1;P<=s;P++)f.push(0,m*L,0),h.push(0,L,0),u.push(.5,.5),g++;const R=g;for(let P=0;P<=s;P++){const N=P/s*l+o,I=Math.cos(N),B=Math.sin(N);C.x=w*B,C.y=m*L,C.z=w*I,f.push(C.x,C.y,C.z),h.push(0,L,0),E.x=I*.5+.5,E.y=B*.5*L+.5,u.push(E.x,E.y),g++}for(let P=0;P<s;P++){const F=x+P,N=R+P;v===!0?d.push(N,N+1,F):d.push(N+1,N,F),S+=3}c.addGroup(p,S,v===!0?1:2),p+=S}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new on(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ja extends _i{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,d=l+1,f=e/o,h=t/l,u=[],g=[],y=[],m=[];for(let p=0;p<d;p++){const b=p*h-r;for(let _=0;_<c;_++){const v=_*f-a;g.push(v,-b,0),y.push(0,0,1),m.push(_/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){const _=b+c*p,v=b+c*(p+1),x=b+1+c*(p+1),E=b+1+c*p;u.push(_,v,E),u.push(v,x,E)}this.setIndex(u),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(y,3)),this.setAttribute("uv",new $t(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ja(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ga extends _i{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(r+o,Math.PI);let c=0;const d=[],f=new V,h=new V,u=[],g=[],y=[],m=[];for(let p=0;p<=i;p++){const b=[],_=p/i;let v=0;p===0&&r===0?v=.5/t:p===i&&l===Math.PI&&(v=-.5/t);for(let x=0;x<=t;x++){const E=x/t;f.x=-e*Math.cos(s+E*a)*Math.sin(r+_*o),f.y=e*Math.cos(r+_*o),f.z=e*Math.sin(s+E*a)*Math.sin(r+_*o),g.push(f.x,f.y,f.z),h.copy(f).normalize(),y.push(h.x,h.y,h.z),m.push(E+v,1-_),b.push(c++)}d.push(b)}for(let p=0;p<i;p++)for(let b=0;b<t;b++){const _=d[p][b+1],v=d[p][b],x=d[p+1][b],E=d[p+1][b+1];(p!==0||r>0)&&u.push(_,v,E),(p!==i-1||l<Math.PI)&&u.push(v,x,E)}this.setIndex(u),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(y,3)),this.setAttribute("uv",new $t(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ga(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function fs(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(_c(s))s.isRenderTargetTexture?(Pe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(_c(s[0])){const a=[];for(let r=0,o=s.length;r<o;r++)a[r]=s[r].clone();e[t][i]=a}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Xt(n){const e={};for(let t=0;t<n.length;t++){const i=fs(n[t]);for(const s in i)e[s]=i[s]}return e}function _c(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function gu(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function zh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}const yu={clone:fs,merge:Xt};var xu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ni extends Vs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=xu,this.fragmentShader=vu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=fs(e.uniforms),this.uniformsGroups=gu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class _u extends Ni{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ur extends Vs{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new it(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new it(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Wo,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Su extends Vs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Lf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Mu extends Vs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Vh extends Gt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new it(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const Fr=new wt,Sc=new V,Mc=new V;class bu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tt(512,512),this.mapType=ni,this.map=null,this.mapPass=null,this.matrix=new wt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new pl,this._frameExtents=new tt(1,1),this._viewportCount=1,this._viewports=[new St(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Sc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Sc),Mc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Mc),t.updateMatrixWorld(),Fr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Fr,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Fs||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Fr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ha=new V,da=new xs,bi=new V;class Hh extends Gt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new wt,this.projectionMatrix=new wt,this.projectionMatrixInverse=new wt,this.coordinateSystem=Ai,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ha,da,bi),bi.x===1&&bi.y===1&&bi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ha,da,bi.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(ha,da,bi),bi.x===1&&bi.y===1&&bi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ha,da,bi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const rn=new V,bc=new tt,Ec=new tt;class ui extends Hh{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Xo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(fr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Xo*2*Math.atan(Math.tan(fr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){rn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(rn.x,rn.y).multiplyScalar(-e/rn.z),rn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(rn.x,rn.y).multiplyScalar(-e/rn.z)}getViewSize(e,t){return this.getViewBounds(e,bc,Ec),t.subVectors(Ec,bc)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(fr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,t-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Ja extends Hh{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Eu extends bu{constructor(){super(new Ja(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Tc extends Vh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Gt.DEFAULT_UP),this.updateMatrix(),this.target=new Gt,this.shadow=new Eu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Tu extends Vh{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const Qn=-90,es=1;class wu extends Gt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ui(Qn,es,e,t);s.layers=this.layers,this.add(s);const a=new ui(Qn,es,e,t);a.layers=this.layers,this.add(a);const r=new ui(Qn,es,e,t);r.layers=this.layers,this.add(r);const o=new ui(Qn,es,e,t);o.layers=this.layers,this.add(o);const l=new ui(Qn,es,e,t);l.layers=this.layers,this.add(l);const c=new ui(Qn,es,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,o,l]=t;for(const c of t)this.remove(c);if(e===Ai)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Fs)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,c,d]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(f,h,u),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Au extends ui{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Ol=class Ol{constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){const a=this.elements;return a[0]=e,a[2]=t,a[1]=i,a[3]=s,this}};Ol.prototype.isMatrix2=!0;let wc=Ol;function Ac(n,e,t,i){const s=Ru(i);switch(t){case Ch:return n*e;case Ih:return n*e/s.components*s.byteLength;case ol:return n*e/s.components*s.byteLength;case Fn:return n*e*2/s.components*s.byteLength;case ll:return n*e*2/s.components*s.byteLength;case Ph:return n*e*3/s.components*s.byteLength;case yi:return n*e*4/s.components*s.byteLength;case cl:return n*e*4/s.components*s.byteLength;case Ca:case Pa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ia:case La:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case po:case go:return Math.max(n,16)*Math.max(e,8)/4;case uo:case mo:return Math.max(n,8)*Math.max(e,8)/2;case yo:case xo:case _o:case So:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case vo:case Ba:case Mo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case bo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Eo:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case To:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case wo:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ao:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Ro:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Co:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Po:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Io:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Lo:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Do:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case No:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case ko:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Uo:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Fo:case Oo:case Bo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case zo:case Vo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case za:case Ho:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ru(n){switch(n){case ni:case Th:return{byteLength:1,components:1};case ks:case wh:case Ki:return{byteLength:2,components:1};case al:case rl:return{byteLength:2,components:4};case Di:case sl:case wi:return{byteLength:4,components:1};case Ah:case Rh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:nl}}));typeof window<"u"&&(window.__THREE__?Pe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=nl);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Wh(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function Cu(n){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,f=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,d),o.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const d=l.array,f=l.updateRanges;if(n.bindBuffer(c,o),f.length===0)n.bufferSubData(c,0,d);else{f.sort((u,g)=>u.start-g.start);let h=0;for(let u=1;u<f.length;u++){const g=f[h],y=f[u];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++h,f[h]=y)}f.length=h+1;for(let u=0,g=f.length;u<g;u++){const y=f[u];n.bufferSubData(c,y.start*d.BYTES_PER_ELEMENT,d,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var Pu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Iu=`#ifdef USE_ALPHAHASH
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
#endif`,Lu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Du=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ku=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Uu=`#ifdef USE_AOMAP
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
#endif`,Fu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ou=`#ifdef USE_BATCHING
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
#endif`,Bu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,zu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Vu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Wu=`#ifdef USE_IRIDESCENCE
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
#endif`,Gu=`#ifdef USE_BUMPMAP
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
#endif`,Xu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,qu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Yu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,$u=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ku=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Zu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ju=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Ju=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Qu=`#define PI 3.141592653589793
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
} // validated`,ep=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,tp=`vec3 transformedNormal = objectNormal;
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
#endif`,ip=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,np=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ap=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,rp="gl_FragColor = linearToOutputTexel( gl_FragColor );",op=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,lp=`#ifdef USE_ENVMAP
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
#endif`,cp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,hp=`#ifdef USE_ENVMAP
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
#endif`,dp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,fp=`#ifdef USE_ENVMAP
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
#endif`,up=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,mp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,yp=`#ifdef USE_GRADIENTMAP
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
}`,xp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_p=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Sp=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Mp=`#ifdef USE_ENVMAP
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
#endif`,bp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ep=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Tp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,wp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ap=`PhysicalMaterial material;
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
#endif`,Rp=`uniform sampler2D dfgLUT;
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
}`,Cp=`
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
#endif`,Pp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ip=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Lp=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Dp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Np=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Up=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Fp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Op=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Bp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,zp=`#if defined( USE_POINTS_UV )
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
#endif`,Vp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Wp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Gp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Xp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qp=`#ifdef USE_MORPHTARGETS
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
#endif`,Yp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$p=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Kp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Zp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Qp=`#ifdef USE_NORMALMAP
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
#endif`,em=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,im=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,am=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,rm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,om=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,dm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,fm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,um=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,pm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,mm=`float getShadowMask() {
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
}`,gm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ym=`#ifdef USE_SKINNING
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
#endif`,xm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vm=`#ifdef USE_SKINNING
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
#endif`,_m=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Sm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Mm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,bm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Em=`#ifdef USE_TRANSMISSION
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
#endif`,Tm=`#ifdef USE_TRANSMISSION
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
#endif`,wm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Am=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Pm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Im=`uniform sampler2D t2D;
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
}`,Lm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Nm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,km=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Um=`#include <common>
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
}`,Fm=`#if DEPTH_PACKING == 3200
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
}`,Om=`#define DISTANCE
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
}`,Bm=`#define DISTANCE
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
}`,zm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Vm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hm=`uniform float scale;
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
}`,Wm=`uniform vec3 diffuse;
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
}`,Gm=`#include <common>
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
}`,Xm=`uniform vec3 diffuse;
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
}`,qm=`#define LAMBERT
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
}`,Ym=`#define LAMBERT
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
}`,$m=`#define MATCAP
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
}`,Km=`#define MATCAP
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
}`,Zm=`#define NORMAL
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
}`,jm=`#define NORMAL
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
}`,Jm=`#define PHONG
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
}`,Qm=`#define PHONG
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
}`,e0=`#define STANDARD
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
}`,t0=`#define STANDARD
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
}`,i0=`#define TOON
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
}`,n0=`#define TOON
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
}`,s0=`uniform float size;
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
}`,a0=`uniform vec3 diffuse;
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
}`,r0=`#include <common>
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
}`,o0=`uniform vec3 color;
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
}`,l0=`uniform float rotation;
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
}`,c0=`uniform vec3 diffuse;
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
}`,ze={alphahash_fragment:Pu,alphahash_pars_fragment:Iu,alphamap_fragment:Lu,alphamap_pars_fragment:Du,alphatest_fragment:Nu,alphatest_pars_fragment:ku,aomap_fragment:Uu,aomap_pars_fragment:Fu,batching_pars_vertex:Ou,batching_vertex:Bu,begin_vertex:zu,beginnormal_vertex:Vu,bsdfs:Hu,iridescence_fragment:Wu,bumpmap_pars_fragment:Gu,clipping_planes_fragment:Xu,clipping_planes_pars_fragment:qu,clipping_planes_pars_vertex:Yu,clipping_planes_vertex:$u,color_fragment:Ku,color_pars_fragment:Zu,color_pars_vertex:ju,color_vertex:Ju,common:Qu,cube_uv_reflection_fragment:ep,defaultnormal_vertex:tp,displacementmap_pars_vertex:ip,displacementmap_vertex:np,emissivemap_fragment:sp,emissivemap_pars_fragment:ap,colorspace_fragment:rp,colorspace_pars_fragment:op,envmap_fragment:lp,envmap_common_pars_fragment:cp,envmap_pars_fragment:hp,envmap_pars_vertex:dp,envmap_physical_pars_fragment:Mp,envmap_vertex:fp,fog_vertex:up,fog_pars_vertex:pp,fog_fragment:mp,fog_pars_fragment:gp,gradientmap_pars_fragment:yp,lightmap_pars_fragment:xp,lights_lambert_fragment:vp,lights_lambert_pars_fragment:_p,lights_pars_begin:Sp,lights_toon_fragment:bp,lights_toon_pars_fragment:Ep,lights_phong_fragment:Tp,lights_phong_pars_fragment:wp,lights_physical_fragment:Ap,lights_physical_pars_fragment:Rp,lights_fragment_begin:Cp,lights_fragment_maps:Pp,lights_fragment_end:Ip,lightprobes_pars_fragment:Lp,logdepthbuf_fragment:Dp,logdepthbuf_pars_fragment:Np,logdepthbuf_pars_vertex:kp,logdepthbuf_vertex:Up,map_fragment:Fp,map_pars_fragment:Op,map_particle_fragment:Bp,map_particle_pars_fragment:zp,metalnessmap_fragment:Vp,metalnessmap_pars_fragment:Hp,morphinstance_vertex:Wp,morphcolor_vertex:Gp,morphnormal_vertex:Xp,morphtarget_pars_vertex:qp,morphtarget_vertex:Yp,normal_fragment_begin:$p,normal_fragment_maps:Kp,normal_pars_fragment:Zp,normal_pars_vertex:jp,normal_vertex:Jp,normalmap_pars_fragment:Qp,clearcoat_normal_fragment_begin:em,clearcoat_normal_fragment_maps:tm,clearcoat_pars_fragment:im,iridescence_pars_fragment:nm,opaque_fragment:sm,packing:am,premultiplied_alpha_fragment:rm,project_vertex:om,dithering_fragment:lm,dithering_pars_fragment:cm,roughnessmap_fragment:hm,roughnessmap_pars_fragment:dm,shadowmap_pars_fragment:fm,shadowmap_pars_vertex:um,shadowmap_vertex:pm,shadowmask_pars_fragment:mm,skinbase_vertex:gm,skinning_pars_vertex:ym,skinning_vertex:xm,skinnormal_vertex:vm,specularmap_fragment:_m,specularmap_pars_fragment:Sm,tonemapping_fragment:Mm,tonemapping_pars_fragment:bm,transmission_fragment:Em,transmission_pars_fragment:Tm,uv_pars_fragment:wm,uv_pars_vertex:Am,uv_vertex:Rm,worldpos_vertex:Cm,background_vert:Pm,background_frag:Im,backgroundCube_vert:Lm,backgroundCube_frag:Dm,cube_vert:Nm,cube_frag:km,depth_vert:Um,depth_frag:Fm,distance_vert:Om,distance_frag:Bm,equirect_vert:zm,equirect_frag:Vm,linedashed_vert:Hm,linedashed_frag:Wm,meshbasic_vert:Gm,meshbasic_frag:Xm,meshlambert_vert:qm,meshlambert_frag:Ym,meshmatcap_vert:$m,meshmatcap_frag:Km,meshnormal_vert:Zm,meshnormal_frag:jm,meshphong_vert:Jm,meshphong_frag:Qm,meshphysical_vert:e0,meshphysical_frag:t0,meshtoon_vert:i0,meshtoon_frag:n0,points_vert:s0,points_frag:a0,shadow_vert:r0,shadow_frag:o0,sprite_vert:l0,sprite_frag:c0},de={common:{diffuse:{value:new it(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new it(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new it(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new it(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},Ti={basic:{uniforms:Xt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:Xt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new it(0)},envMapIntensity:{value:1}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:Xt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new it(0)},specular:{value:new it(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:Xt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new it(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:Xt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new it(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:Xt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:Xt([de.points,de.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:Xt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:Xt([de.common,de.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:Xt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:Xt([de.sprite,de.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distance:{uniforms:Xt([de.common,de.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distance_vert,fragmentShader:ze.distance_frag},shadow:{uniforms:Xt([de.lights,de.fog,{color:{value:new it(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};Ti.physical={uniforms:Xt([Ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new it(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new it(0)},specularColor:{value:new it(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const fa={r:0,b:0,g:0},h0=new wt,Gh=new Ne;Gh.set(-1,0,0,0,1,0,0,0,1);function d0(n,e,t,i,s,a){const r=new it(0);let o=s===!0?0:1,l,c,d=null,f=0,h=null;function u(b){let _=b.isScene===!0?b.background:null;if(_&&_.isTexture){const v=b.backgroundBlurriness>0;_=e.get(_,v)}return _}function g(b){let _=!1;const v=u(b);v===null?m(r,o):v&&v.isColor&&(m(v,1),_=!0);const x=n.xr.getEnvironmentBlendMode();x==="additive"?t.buffers.color.setClear(0,0,0,1,a):x==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,a),(n.autoClear||_)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function y(b,_){const v=u(_);v&&(v.isCubeTexture||v.mapping===Za)?(c===void 0&&(c=new ht(new mn(1,1,1),new Ni({name:"BackgroundCubeMaterial",uniforms:fs(Ti.backgroundCube.uniforms),vertexShader:Ti.backgroundCube.vertexShader,fragmentShader:Ti.backgroundCube.fragmentShader,side:Zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(x,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(h0.makeRotationFromEuler(_.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Gh),c.material.toneMapped=Ye.getTransfer(v.colorSpace)!==st,(d!==v||f!==v.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,d=v,f=v.version,h=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ht(new ja(2,2),new Ni({name:"BackgroundMaterial",uniforms:fs(Ti.background.uniforms),vertexShader:Ti.background.vertexShader,fragmentShader:Ti.background.fragmentShader,side:gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=Ye.getTransfer(v.colorSpace)!==st,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(d!==v||f!==v.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,d=v,f=v.version,h=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function m(b,_){b.getRGB(fa,zh(n)),t.buffers.color.setClear(fa.r,fa.g,fa.b,_,a)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(b,_=1){r.set(b),o=_,m(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,m(r,o)},render:g,addToRenderList:y,dispose:p}}function f0(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let a=s,r=!1;function o(R,P,F,N,I){let B=!1;const O=f(R,N,F,P);a!==O&&(a=O,c(a.object)),B=u(R,N,F,I),B&&g(R,N,F,I),I!==null&&e.update(I,n.ELEMENT_ARRAY_BUFFER),(B||r)&&(r=!1,v(R,P,F,N),I!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(I).buffer))}function l(){return n.createVertexArray()}function c(R){return n.bindVertexArray(R)}function d(R){return n.deleteVertexArray(R)}function f(R,P,F,N){const I=N.wireframe===!0;let B=i[P.id];B===void 0&&(B={},i[P.id]=B);const O=R.isInstancedMesh===!0?R.id:0;let K=B[O];K===void 0&&(K={},B[O]=K);let j=K[F.id];j===void 0&&(j={},K[F.id]=j);let ee=j[I];return ee===void 0&&(ee=h(l()),j[I]=ee),ee}function h(R){const P=[],F=[],N=[];for(let I=0;I<t;I++)P[I]=0,F[I]=0,N[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:N,object:R,attributes:{},index:null}}function u(R,P,F,N){const I=a.attributes,B=P.attributes;let O=0;const K=F.getAttributes();for(const j in K)if(K[j].location>=0){const ue=I[j];let ge=B[j];if(ge===void 0&&(j==="instanceMatrix"&&R.instanceMatrix&&(ge=R.instanceMatrix),j==="instanceColor"&&R.instanceColor&&(ge=R.instanceColor)),ue===void 0||ue.attribute!==ge||ge&&ue.data!==ge.data)return!0;O++}return a.attributesNum!==O||a.index!==N}function g(R,P,F,N){const I={},B=P.attributes;let O=0;const K=F.getAttributes();for(const j in K)if(K[j].location>=0){let ue=B[j];ue===void 0&&(j==="instanceMatrix"&&R.instanceMatrix&&(ue=R.instanceMatrix),j==="instanceColor"&&R.instanceColor&&(ue=R.instanceColor));const ge={};ge.attribute=ue,ue&&ue.data&&(ge.data=ue.data),I[j]=ge,O++}a.attributes=I,a.attributesNum=O,a.index=N}function y(){const R=a.newAttributes;for(let P=0,F=R.length;P<F;P++)R[P]=0}function m(R){p(R,0)}function p(R,P){const F=a.newAttributes,N=a.enabledAttributes,I=a.attributeDivisors;F[R]=1,N[R]===0&&(n.enableVertexAttribArray(R),N[R]=1),I[R]!==P&&(n.vertexAttribDivisor(R,P),I[R]=P)}function b(){const R=a.newAttributes,P=a.enabledAttributes;for(let F=0,N=P.length;F<N;F++)P[F]!==R[F]&&(n.disableVertexAttribArray(F),P[F]=0)}function _(R,P,F,N,I,B,O){O===!0?n.vertexAttribIPointer(R,P,F,I,B):n.vertexAttribPointer(R,P,F,N,I,B)}function v(R,P,F,N){y();const I=N.attributes,B=F.getAttributes(),O=P.defaultAttributeValues;for(const K in B){const j=B[K];if(j.location>=0){let ee=I[K];if(ee===void 0&&(K==="instanceMatrix"&&R.instanceMatrix&&(ee=R.instanceMatrix),K==="instanceColor"&&R.instanceColor&&(ee=R.instanceColor)),ee!==void 0){const ue=ee.normalized,ge=ee.itemSize,De=e.get(ee);if(De===void 0)continue;const Xe=De.buffer,Ce=De.type,Y=De.bytesPerElement,ae=Ce===n.INT||Ce===n.UNSIGNED_INT||ee.gpuType===sl;if(ee.isInterleavedBufferAttribute){const te=ee.data,we=te.stride,Ie=ee.offset;if(te.isInstancedInterleavedBuffer){for(let Re=0;Re<j.locationSize;Re++)p(j.location+Re,te.meshPerAttribute);R.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Re=0;Re<j.locationSize;Re++)m(j.location+Re);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let Re=0;Re<j.locationSize;Re++)_(j.location+Re,ge/j.locationSize,Ce,ue,we*Y,(Ie+ge/j.locationSize*Re)*Y,ae)}else{if(ee.isInstancedBufferAttribute){for(let te=0;te<j.locationSize;te++)p(j.location+te,ee.meshPerAttribute);R.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let te=0;te<j.locationSize;te++)m(j.location+te);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let te=0;te<j.locationSize;te++)_(j.location+te,ge/j.locationSize,Ce,ue,ge*Y,ge/j.locationSize*te*Y,ae)}}else if(O!==void 0){const ue=O[K];if(ue!==void 0)switch(ue.length){case 2:n.vertexAttrib2fv(j.location,ue);break;case 3:n.vertexAttrib3fv(j.location,ue);break;case 4:n.vertexAttrib4fv(j.location,ue);break;default:n.vertexAttrib1fv(j.location,ue)}}}}b()}function x(){w();for(const R in i){const P=i[R];for(const F in P){const N=P[F];for(const I in N){const B=N[I];for(const O in B)d(B[O].object),delete B[O];delete N[I]}}delete i[R]}}function E(R){if(i[R.id]===void 0)return;const P=i[R.id];for(const F in P){const N=P[F];for(const I in N){const B=N[I];for(const O in B)d(B[O].object),delete B[O];delete N[I]}}delete i[R.id]}function C(R){for(const P in i){const F=i[P];for(const N in F){const I=F[N];if(I[R.id]===void 0)continue;const B=I[R.id];for(const O in B)d(B[O].object),delete B[O];delete I[R.id]}}}function S(R){for(const P in i){const F=i[P],N=R.isInstancedMesh===!0?R.id:0,I=F[N];if(I!==void 0){for(const B in I){const O=I[B];for(const K in O)d(O[K].object),delete O[K];delete I[B]}delete F[N],Object.keys(F).length===0&&delete i[P]}}}function w(){L(),r=!0,a!==s&&(a=s,c(a.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:L,dispose:x,releaseStatesOfGeometry:E,releaseStatesOfObject:S,releaseStatesOfProgram:C,initAttributes:y,enableAttribute:m,disableUnusedAttributes:b}}function u0(n,e,t){let i;function s(l){i=l}function a(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function r(l,c,d){d!==0&&(n.drawArraysInstanced(i,l,c,d),t.update(c,i,d))}function o(l,c,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,d);let h=0;for(let u=0;u<d;u++)h+=c[u];t.update(h,i,1)}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function p0(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(C){return!(C!==yi&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const S=C===Ki&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==ni&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==wi&&!S)}function l(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(Pe("WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const f=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Pe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),x=n.getParameter(n.MAX_SAMPLES),E=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:u,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:_,maxFragmentUniforms:v,maxSamples:x,samples:E}}function m0(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new En,o=new Ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const u=f.length!==0||h||i!==0||s;return s=h,i=f.length,u},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,h){t=d(f,h,0)},this.setState=function(f,h,u){const g=f.clippingPlanes,y=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!s||g===null||g.length===0||a&&!m)a?d(null):c();else{const b=a?0:i,_=b*4;let v=p.clippingState||null;l.value=v,v=d(g,h,_,u);for(let x=0;x!==_;++x)v[x]=t[x];p.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(f,h,u,g){const y=f!==null?f.length:0;let m=null;if(y!==0){if(m=l.value,g!==!0||m===null){const p=u+y*4,b=h.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let _=0,v=u;_!==y;++_,v+=4)r.copy(f[_]).applyMatrix4(b,o),r.normal.toArray(m,v),m[v+3]=r.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}const hn=4,Rc=[.125,.215,.35,.446,.526,.582],Rn=20,g0=256,As=new Ja,Cc=new it;let Or=null,Br=0,zr=0,Vr=!1;const y0=new V;class Pc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:o=y0}=a;Or=this._renderer.getRenderTarget(),Br=this._renderer.getActiveCubeFace(),zr=this._renderer.getActiveMipmapLevel(),Vr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Dc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Lc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Or,Br,zr),this._renderer.xr.enabled=Vr,e.scissorTest=!1,ts(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Un||e.mapping===hs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Or=this._renderer.getRenderTarget(),Br=this._renderer.getActiveCubeFace(),zr=this._renderer.getActiveMipmapLevel(),Vr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Wt,minFilter:Wt,generateMipmaps:!1,type:Ki,format:yi,colorSpace:Va,depthBuffer:!1},s=Ic(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ic(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=x0(a)),this._blurMaterial=_0(a,e,t),this._ggxMaterial=v0(a,e,t)}return s}_compileMaterial(e){const t=new ht(new _i,e);this._renderer.compile(t,As)}_sceneToCubeUV(e,t,i,s,a){const l=new ui(90,1,t,i),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,u=f.toneMapping;f.getClearColor(Cc),f.toneMapping=Ci,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ht(new mn,new Ls({name:"PMREM.Background",side:Zt,depthWrite:!1,depthTest:!1})));const y=this._backgroundBox,m=y.material;let p=!1;const b=e.background;b?b.isColor&&(m.color.copy(b),e.background=null,p=!0):(m.color.copy(Cc),p=!0);for(let _=0;_<6;_++){const v=_%3;v===0?(l.up.set(0,c[_],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+d[_],a.y,a.z)):v===1?(l.up.set(0,0,c[_]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+d[_],a.z)):(l.up.set(0,c[_],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+d[_]));const x=this._cubeSize;ts(s,v*x,_>2?x:0,x,x),f.setRenderTarget(s),p&&f.render(y,l),f.render(e,l)}f.toneMapping=u,f.autoClear=h,e.background=b}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Un||e.mapping===hs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Dc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Lc());const a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;ts(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(r,As)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;const l=r.uniforms,c=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-d*d),h=0+c*1.25,u=f*h,{_lodMax:g}=this,y=this._sizeLods[i],m=3*y*(i>g-hn?i-g+hn:0),p=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=u,l.mipInt.value=g-t,ts(a,m,p,3*y,2*y),s.setRenderTarget(a),s.render(o,As),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=g-i,ts(e,m,p,3*y,2*y),s.setRenderTarget(e),s.render(o,As)}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,o){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&Je("blur direction must be either latitudinal or longitudinal!");const d=3,f=this._lodMeshes[s];f.material=c;const h=c.uniforms,u=this._sizeLods[i]-1,g=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*Rn-1),y=a/g,m=isFinite(a)?1+Math.floor(d*y):Rn;m>Rn&&Pe(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Rn}`);const p=[];let b=0;for(let C=0;C<Rn;++C){const S=C/y,w=Math.exp(-S*S/2);p.push(w),C===0?b+=w:C<m&&(b+=2*w)}for(let C=0;C<p.length;C++)p[C]=p[C]/b;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=r==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:_}=this;h.dTheta.value=g,h.mipInt.value=_-i;const v=this._sizeLods[s],x=3*v*(s>_-hn?s-_+hn:0),E=4*(this._cubeSize-v);ts(t,x,E,3*v,2*v),l.setRenderTarget(t),l.render(f,As)}}function x0(n){const e=[],t=[],i=[];let s=n;const a=n-hn+1+Rc.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let l=1/o;r>n-hn?l=Rc[r-n+hn-1]:r===0&&(l=0),t.push(l);const c=1/(o-2),d=-c,f=1+c,h=[d,d,f,d,f,f,d,d,f,f,d,f],u=6,g=6,y=3,m=2,p=1,b=new Float32Array(y*g*u),_=new Float32Array(m*g*u),v=new Float32Array(p*g*u);for(let E=0;E<u;E++){const C=E%3*2/3-1,S=E>2?0:-1,w=[C,S,0,C+2/3,S,0,C+2/3,S+1,0,C,S,0,C+2/3,S+1,0,C,S+1,0];b.set(w,y*g*E),_.set(h,m*g*E);const L=[E,E,E,E,E,E];v.set(L,p*g*E)}const x=new _i;x.setAttribute("position",new Ii(b,y)),x.setAttribute("uv",new Ii(_,m)),x.setAttribute("faceIndex",new Ii(v,p)),i.push(new ht(x,null)),s>hn&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function Ic(n,e,t){const i=new Pi(n,e,t);return i.texture.mapping=Za,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ts(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function v0(n,e,t){return new Ni({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:g0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Qa(),fragmentShader:`

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
		`,blending:Yi,depthTest:!1,depthWrite:!1})}function _0(n,e,t){const i=new Float32Array(Rn),s=new V(0,1,0);return new Ni({name:"SphericalGaussianBlur",defines:{n:Rn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Qa(),fragmentShader:`

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
		`,blending:Yi,depthTest:!1,depthWrite:!1})}function Lc(){return new Ni({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qa(),fragmentShader:`

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
		`,blending:Yi,depthTest:!1,depthWrite:!1})}function Dc(){return new Ni({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Yi,depthTest:!1,depthWrite:!1})}function Qa(){return`

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
	`}class Xh extends Pi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Oh(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new mn(5,5,5),a=new Ni({name:"CubemapFromEquirect",uniforms:fs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Zt,blending:Yi});a.uniforms.tEquirect.value=t;const r=new ht(s,a),o=t.minFilter;return t.minFilter===Cn&&(t.minFilter=Wt),new wu(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}function S0(n){let e=new WeakMap,t=new WeakMap,i=null;function s(h,u=!1){return h==null?null:u?r(h):a(h)}function a(h){if(h&&h.isTexture){const u=h.mapping;if(u===cr||u===hr)if(e.has(h)){const g=e.get(h).texture;return o(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const y=new Xh(g.height);return y.fromEquirectangularTexture(n,h),e.set(h,y),h.addEventListener("dispose",c),o(y.texture,h.mapping)}else return null}}return h}function r(h){if(h&&h.isTexture){const u=h.mapping,g=u===cr||u===hr,y=u===Un||u===hs;if(g||y){let m=t.get(h);const p=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return i===null&&(i=new Pc(n)),m=g?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{const b=h.image;return g&&b&&b.height>0||y&&b&&l(b)?(i===null&&(i=new Pc(n)),m=g?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",d),m.texture):null}}}return h}function o(h,u){return u===cr?h.mapping=Un:u===hr&&(h.mapping=hs),h}function l(h){let u=0;const g=6;for(let y=0;y<g;y++)h[y]!==void 0&&u++;return u===g}function c(h){const u=h.target;u.removeEventListener("dispose",c);const g=e.get(u);g!==void 0&&(e.delete(u),g.dispose())}function d(h){const u=h.target;u.removeEventListener("dispose",d);const g=t.get(u);g!==void 0&&(t.delete(u),g.dispose())}function f(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function M0(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Go("WebGLRenderer: "+i+" extension not supported."),s}}}function b0(n,e,t,i){const s={},a=new WeakMap;function r(f){const h=f.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",r),delete s[h.id];const u=a.get(h);u&&(e.remove(u),a.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(f,h){return s[h.id]===!0||(h.addEventListener("dispose",r),s[h.id]=!0,t.memory.geometries++),h}function l(f){const h=f.attributes;for(const u in h)e.update(h[u],n.ARRAY_BUFFER)}function c(f){const h=[],u=f.index,g=f.attributes.position;let y=0;if(g===void 0)return;if(u!==null){const b=u.array;y=u.version;for(let _=0,v=b.length;_<v;_+=3){const x=b[_+0],E=b[_+1],C=b[_+2];h.push(x,E,E,C,C,x)}}else{const b=g.array;y=g.version;for(let _=0,v=b.length/3-1;_<v;_+=3){const x=_+0,E=_+1,C=_+2;h.push(x,E,E,C,C,x)}}const m=new(g.count>=65535?Fh:Uh)(h,1);m.version=y;const p=a.get(f);p&&e.remove(p),a.set(f,m)}function d(f){const h=a.get(f);if(h){const u=f.index;u!==null&&h.version<u.version&&c(f)}else c(f);return a.get(f)}return{get:o,update:l,getWireframeAttribute:d}}function E0(n,e,t){let i;function s(f){i=f}let a,r;function o(f){a=f.type,r=f.bytesPerElement}function l(f,h){n.drawElements(i,h,a,f*r),t.update(h,i,1)}function c(f,h,u){u!==0&&(n.drawElementsInstanced(i,h,a,f*r,u),t.update(h,i,u))}function d(f,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,a,f,0,u);let y=0;for(let m=0;m<u;m++)y+=h[m];t.update(y,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d}function T0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:Je("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function w0(n,e,t){const i=new WeakMap,s=new St;function a(r,o,l){const c=r.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=d!==void 0?d.length:0;let h=i.get(o);if(h===void 0||h.count!==f){let L=function(){S.dispose(),i.delete(o),o.removeEventListener("dispose",L)};var u=L;h!==void 0&&h.texture.dispose();const g=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let v=0;g===!0&&(v=1),y===!0&&(v=2),m===!0&&(v=3);let x=o.attributes.position.count*v,E=1;x>e.maxTextureSize&&(E=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const C=new Float32Array(x*E*4*f),S=new Dh(C,x,E,f);S.type=wi,S.needsUpdate=!0;const w=v*4;for(let R=0;R<f;R++){const P=p[R],F=b[R],N=_[R],I=x*E*4*R;for(let B=0;B<P.count;B++){const O=B*w;g===!0&&(s.fromBufferAttribute(P,B),C[I+O+0]=s.x,C[I+O+1]=s.y,C[I+O+2]=s.z,C[I+O+3]=0),y===!0&&(s.fromBufferAttribute(F,B),C[I+O+4]=s.x,C[I+O+5]=s.y,C[I+O+6]=s.z,C[I+O+7]=0),m===!0&&(s.fromBufferAttribute(N,B),C[I+O+8]=s.x,C[I+O+9]=s.y,C[I+O+10]=s.z,C[I+O+11]=N.itemSize===4?s.w:1)}}h={count:f,texture:S,size:new tt(x,E)},i.set(o,h),o.addEventListener("dispose",L)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const y=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",y),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:a}}function A0(n,e,t,i,s){let a=new WeakMap;function r(c){const d=s.render.frame,f=c.geometry,h=e.get(c,f);if(a.get(h)!==d&&(e.update(h),a.set(h,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==d&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,d))),c.isSkinnedMesh){const u=c.skeleton;a.get(u)!==d&&(u.update(),a.set(u,d))}return h}function o(){a=new WeakMap}function l(c){const d=c.target;d.removeEventListener("dispose",l),i.releaseStatesOfObject(d),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:r,dispose:o}}const R0={[yh]:"LINEAR_TONE_MAPPING",[xh]:"REINHARD_TONE_MAPPING",[vh]:"CINEON_TONE_MAPPING",[_h]:"ACES_FILMIC_TONE_MAPPING",[Mh]:"AGX_TONE_MAPPING",[bh]:"NEUTRAL_TONE_MAPPING",[Sh]:"CUSTOM_TONE_MAPPING"};function C0(n,e,t,i,s){const a=new Pi(e,t,{type:n,depthBuffer:i,stencilBuffer:s,depthTexture:i?new ds(e,t):void 0}),r=new Pi(e,t,{type:Ki,depthBuffer:!1,stencilBuffer:!1}),o=new _i;o.setAttribute("position",new $t([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new $t([0,2,0,0,2,0],2));const l=new _u({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),c=new ht(o,l),d=new Ja(-1,1,1,-1,0,1);let f=null,h=null,u=!1,g,y=null,m=[],p=!1;this.setSize=function(b,_){a.setSize(b,_),r.setSize(b,_);for(let v=0;v<m.length;v++){const x=m[v];x.setSize&&x.setSize(b,_)}},this.setEffects=function(b){m=b,p=m.length>0&&m[0].isRenderPass===!0;const _=a.width,v=a.height;for(let x=0;x<m.length;x++){const E=m[x];E.setSize&&E.setSize(_,v)}},this.begin=function(b,_){if(u||b.toneMapping===Ci&&m.length===0)return!1;if(y=_,_!==null){const v=_.width,x=_.height;(a.width!==v||a.height!==x)&&this.setSize(v,x)}return p===!1&&b.setRenderTarget(a),g=b.toneMapping,b.toneMapping=Ci,!0},this.hasRenderPass=function(){return p},this.end=function(b,_){b.toneMapping=g,u=!0;let v=a,x=r;for(let E=0;E<m.length;E++){const C=m[E];if(C.enabled!==!1&&(C.render(b,x,v,_),C.needsSwap!==!1)){const S=v;v=x,x=S}}if(f!==b.outputColorSpace||h!==b.toneMapping){f=b.outputColorSpace,h=b.toneMapping,l.defines={},Ye.getTransfer(f)===st&&(l.defines.SRGB_TRANSFER="");const E=R0[h];E&&(l.defines[E]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=v.texture,b.setRenderTarget(y),b.render(c,d),y=null,u=!1},this.isCompositing=function(){return u},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),r.dispose(),o.dispose(),l.dispose()}}const qh=new Yt,qo=new ds(1,1),Yh=new Dh,$h=new Zf,Kh=new Oh,Nc=[],kc=[],Uc=new Float32Array(16),Fc=new Float32Array(9),Oc=new Float32Array(4);function vs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=Nc[s];if(a===void 0&&(a=new Float32Array(s),Nc[s]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,n[r].toArray(a,o)}return a}function kt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ut(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function er(n,e){let t=kc[e];t===void 0&&(t=new Int32Array(e),kc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function P0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function I0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;n.uniform2fv(this.addr,e),Ut(t,e)}}function L0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(kt(t,e))return;n.uniform3fv(this.addr,e),Ut(t,e)}}function D0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;n.uniform4fv(this.addr,e),Ut(t,e)}}function N0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(kt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(kt(t,i))return;Oc.set(i),n.uniformMatrix2fv(this.addr,!1,Oc),Ut(t,i)}}function k0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(kt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(kt(t,i))return;Fc.set(i),n.uniformMatrix3fv(this.addr,!1,Fc),Ut(t,i)}}function U0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(kt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(kt(t,i))return;Uc.set(i),n.uniformMatrix4fv(this.addr,!1,Uc),Ut(t,i)}}function F0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function O0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;n.uniform2iv(this.addr,e),Ut(t,e)}}function B0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(kt(t,e))return;n.uniform3iv(this.addr,e),Ut(t,e)}}function z0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;n.uniform4iv(this.addr,e),Ut(t,e)}}function V0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function H0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;n.uniform2uiv(this.addr,e),Ut(t,e)}}function W0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(kt(t,e))return;n.uniform3uiv(this.addr,e),Ut(t,e)}}function G0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;n.uniform4uiv(this.addr,e),Ut(t,e)}}function X0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(qo.compareFunction=t.isReversedDepthBuffer()?dl:hl,a=qo):a=qh,t.setTexture2D(e||a,s)}function q0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||$h,s)}function Y0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Kh,s)}function $0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Yh,s)}function K0(n){switch(n){case 5126:return P0;case 35664:return I0;case 35665:return L0;case 35666:return D0;case 35674:return N0;case 35675:return k0;case 35676:return U0;case 5124:case 35670:return F0;case 35667:case 35671:return O0;case 35668:case 35672:return B0;case 35669:case 35673:return z0;case 5125:return V0;case 36294:return H0;case 36295:return W0;case 36296:return G0;case 35678:case 36198:case 36298:case 36306:case 35682:return X0;case 35679:case 36299:case 36307:return q0;case 35680:case 36300:case 36308:case 36293:return Y0;case 36289:case 36303:case 36311:case 36292:return $0}}function Z0(n,e){n.uniform1fv(this.addr,e)}function j0(n,e){const t=vs(e,this.size,2);n.uniform2fv(this.addr,t)}function J0(n,e){const t=vs(e,this.size,3);n.uniform3fv(this.addr,t)}function Q0(n,e){const t=vs(e,this.size,4);n.uniform4fv(this.addr,t)}function eg(n,e){const t=vs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function tg(n,e){const t=vs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function ig(n,e){const t=vs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function ng(n,e){n.uniform1iv(this.addr,e)}function sg(n,e){n.uniform2iv(this.addr,e)}function ag(n,e){n.uniform3iv(this.addr,e)}function rg(n,e){n.uniform4iv(this.addr,e)}function og(n,e){n.uniform1uiv(this.addr,e)}function lg(n,e){n.uniform2uiv(this.addr,e)}function cg(n,e){n.uniform3uiv(this.addr,e)}function hg(n,e){n.uniform4uiv(this.addr,e)}function dg(n,e,t){const i=this.cache,s=e.length,a=er(t,s);kt(i,a)||(n.uniform1iv(this.addr,a),Ut(i,a));let r;this.type===n.SAMPLER_2D_SHADOW?r=qo:r=qh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||r,a[o])}function fg(n,e,t){const i=this.cache,s=e.length,a=er(t,s);kt(i,a)||(n.uniform1iv(this.addr,a),Ut(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||$h,a[r])}function ug(n,e,t){const i=this.cache,s=e.length,a=er(t,s);kt(i,a)||(n.uniform1iv(this.addr,a),Ut(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||Kh,a[r])}function pg(n,e,t){const i=this.cache,s=e.length,a=er(t,s);kt(i,a)||(n.uniform1iv(this.addr,a),Ut(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||Yh,a[r])}function mg(n){switch(n){case 5126:return Z0;case 35664:return j0;case 35665:return J0;case 35666:return Q0;case 35674:return eg;case 35675:return tg;case 35676:return ig;case 5124:case 35670:return ng;case 35667:case 35671:return sg;case 35668:case 35672:return ag;case 35669:case 35673:return rg;case 5125:return og;case 36294:return lg;case 36295:return cg;case 36296:return hg;case 35678:case 36198:case 36298:case 36306:case 35682:return dg;case 35679:case 36299:case 36307:return fg;case 35680:case 36300:case 36308:case 36293:return ug;case 36289:case 36303:case 36311:case 36292:return pg}}class gg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=K0(t.type)}}class yg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=mg(t.type)}}class xg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],i)}}}const Hr=/(\w+)(\])?(\[|\.)?/g;function Bc(n,e){n.seq.push(e),n.map[e.id]=e}function vg(n,e,t){const i=n.name,s=i.length;for(Hr.lastIndex=0;;){const a=Hr.exec(i),r=Hr.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){Bc(t,c===void 0?new gg(o,n,e):new yg(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new xg(o),Bc(t,f)),t=f}}}class Da{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const o=e.getActiveUniform(t,r),l=e.getUniformLocation(t,o.name);vg(o,l,this)}const s=[],a=[];for(const r of this.seq)r.type===e.SAMPLER_2D_SHADOW||r.type===e.SAMPLER_CUBE_SHADOW||r.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(r):a.push(r);s.length>0&&(this.seq=s.concat(a))}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function zc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const _g=37297;let Sg=0;function Mg(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const Vc=new Ne;function bg(n){Ye._getMatrix(Vc,Ye.workingColorSpace,n);const e=`mat3( ${Vc.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(n)){case Ha:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return Pe("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Hc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+Mg(n.getShaderSource(e),o)}else return a}function Eg(n,e){const t=bg(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Tg={[yh]:"Linear",[xh]:"Reinhard",[vh]:"Cineon",[_h]:"ACESFilmic",[Mh]:"AgX",[bh]:"Neutral",[Sh]:"Custom"};function wg(n,e){const t=Tg[e];return t===void 0?(Pe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ua=new V;function Ag(){Ye.getLuminanceCoefficients(ua);const n=ua.x.toFixed(4),e=ua.y.toFixed(4),t=ua.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Rg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Is).join(`
`)}function Cg(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Pg(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:o}}return t}function Is(n){return n!==""}function Wc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Gc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Ig=/^[ \t]*#include +<([\w\d./]+)>/gm;function Yo(n){return n.replace(Ig,Dg)}const Lg=new Map;function Dg(n,e){let t=ze[e];if(t===void 0){const i=Lg.get(e);if(i!==void 0)t=ze[i],Pe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Yo(t)}const Ng=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Xc(n){return n.replace(Ng,kg)}function kg(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function qc(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const Ug={[Ra]:"SHADOWMAP_TYPE_PCF",[Ps]:"SHADOWMAP_TYPE_VSM"};function Fg(n){return Ug[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Og={[Un]:"ENVMAP_TYPE_CUBE",[hs]:"ENVMAP_TYPE_CUBE",[Za]:"ENVMAP_TYPE_CUBE_UV"};function Bg(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":Og[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const zg={[hs]:"ENVMAP_MODE_REFRACTION"};function Vg(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":zg[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Hg={[gh]:"ENVMAP_BLENDING_MULTIPLY",[Cf]:"ENVMAP_BLENDING_MIX",[Pf]:"ENVMAP_BLENDING_ADD"};function Wg(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Hg[n.combine]||"ENVMAP_BLENDING_NONE"}function Gg(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Xg(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const l=Fg(t),c=Bg(t),d=Vg(t),f=Wg(t),h=Gg(t),u=Rg(t),g=Cg(a),y=s.createProgram();let m,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Is).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Is).join(`
`),p.length>0&&(p+=`
`)):(m=[qc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Is).join(`
`),p=[qc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ci?"#define TONE_MAPPING":"",t.toneMapping!==Ci?ze.tonemapping_pars_fragment:"",t.toneMapping!==Ci?wg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,Eg("linearToOutputTexel",t.outputColorSpace),Ag(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Is).join(`
`)),r=Yo(r),r=Wc(r,t),r=Gc(r,t),o=Yo(o),o=Wc(o,t),o=Gc(o,t),r=Xc(r),o=Xc(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===nc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===nc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const _=b+m+r,v=b+p+o,x=zc(s,s.VERTEX_SHADER,_),E=zc(s,s.FRAGMENT_SHADER,v);s.attachShader(y,x),s.attachShader(y,E),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function C(R){if(n.debug.checkShaderErrors){const P=s.getProgramInfoLog(y)||"",F=s.getShaderInfoLog(x)||"",N=s.getShaderInfoLog(E)||"",I=P.trim(),B=F.trim(),O=N.trim();let K=!0,j=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(K=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,y,x,E);else{const ee=Hc(s,x,"vertex"),ue=Hc(s,E,"fragment");Je("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+I+`
`+ee+`
`+ue)}else I!==""?Pe("WebGLProgram: Program Info Log:",I):(B===""||O==="")&&(j=!1);j&&(R.diagnostics={runnable:K,programLog:I,vertexShader:{log:B,prefix:m},fragmentShader:{log:O,prefix:p}})}s.deleteShader(x),s.deleteShader(E),S=new Da(s,y),w=Pg(s,y)}let S;this.getUniforms=function(){return S===void 0&&C(this),S};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(y,_g)),L},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Sg++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=x,this.fragmentShader=E,this}let qg=0;class Yg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new $g(e),t.set(e,i)),i}}class $g{constructor(e){this.id=qg++,this.code=e,this.usedTimes=0}}function Kg(n){return n===Fn||n===Ba||n===za}function Zg(n,e,t,i,s,a){const r=new Nh,o=new Yg,l=new Set,c=[],d=new Map,f=i.logarithmicDepthBuffer;let h=i.precision;const u={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return l.add(S),S===0?"uv":`uv${S}`}function y(S,w,L,R,P,F){const N=R.fog,I=P.geometry,B=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?R.environment:null,O=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap,K=e.get(S.envMap||B,O),j=K&&K.mapping===Za?K.image.height:null,ee=u[S.type];S.precision!==null&&(h=i.getMaxPrecision(S.precision),h!==S.precision&&Pe("WebGLProgram.getParameters:",S.precision,"not supported, using",h,"instead."));const ue=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,ge=ue!==void 0?ue.length:0;let De=0;I.morphAttributes.position!==void 0&&(De=1),I.morphAttributes.normal!==void 0&&(De=2),I.morphAttributes.color!==void 0&&(De=3);let Xe,Ce,Y,ae;if(ee){const ke=Ti[ee];Xe=ke.vertexShader,Ce=ke.fragmentShader}else Xe=S.vertexShader,Ce=S.fragmentShader,o.update(S),Y=o.getVertexShaderID(S),ae=o.getFragmentShaderID(S);const te=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),Ie=P.isInstancedMesh===!0,Re=P.isBatchedMesh===!0,nt=!!S.map,Oe=!!S.matcap,Ze=!!K,pt=!!S.aoMap,We=!!S.lightMap,Pt=!!S.bumpMap,yt=!!S.normalMap,jt=!!S.displacementMap,k=!!S.emissiveMap,It=!!S.metalnessMap,Ge=!!S.roughnessMap,dt=S.anisotropy>0,he=S.clearcoat>0,vt=S.dispersion>0,A=S.iridescence>0,M=S.sheen>0,z=S.transmission>0,$=dt&&!!S.anisotropyMap,Q=he&&!!S.clearcoatMap,ie=he&&!!S.clearcoatNormalMap,le=he&&!!S.clearcoatRoughnessMap,X=A&&!!S.iridescenceMap,Z=A&&!!S.iridescenceThicknessMap,me=M&&!!S.sheenColorMap,_e=M&&!!S.sheenRoughnessMap,re=!!S.specularMap,ne=!!S.specularColorMap,Le=!!S.specularIntensityMap,Be=z&&!!S.transmissionMap,Qe=z&&!!S.thicknessMap,D=!!S.gradientMap,se=!!S.alphaMap,q=S.alphaTest>0,ye=!!S.alphaHash,oe=!!S.extensions;let J=Ci;S.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(J=n.toneMapping);const Ee={shaderID:ee,shaderType:S.type,shaderName:S.name,vertexShader:Xe,fragmentShader:Ce,defines:S.defines,customVertexShaderID:Y,customFragmentShaderID:ae,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:h,batching:Re,batchingColor:Re&&P._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&P.instanceColor!==null,instancingMorph:Ie&&P.morphTexture!==null,outputColorSpace:te===null?n.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Ye.workingColorSpace,alphaToCoverage:!!S.alphaToCoverage,map:nt,matcap:Oe,envMap:Ze,envMapMode:Ze&&K.mapping,envMapCubeUVHeight:j,aoMap:pt,lightMap:We,bumpMap:Pt,normalMap:yt,displacementMap:jt,emissiveMap:k,normalMapObjectSpace:yt&&S.normalMapType===Df,normalMapTangentSpace:yt&&S.normalMapType===Wo,packedNormalMap:yt&&S.normalMapType===Wo&&Kg(S.normalMap.format),metalnessMap:It,roughnessMap:Ge,anisotropy:dt,anisotropyMap:$,clearcoat:he,clearcoatMap:Q,clearcoatNormalMap:ie,clearcoatRoughnessMap:le,dispersion:vt,iridescence:A,iridescenceMap:X,iridescenceThicknessMap:Z,sheen:M,sheenColorMap:me,sheenRoughnessMap:_e,specularMap:re,specularColorMap:ne,specularIntensityMap:Le,transmission:z,transmissionMap:Be,thicknessMap:Qe,gradientMap:D,opaque:S.transparent===!1&&S.blending===rs&&S.alphaToCoverage===!1,alphaMap:se,alphaTest:q,alphaHash:ye,combine:S.combine,mapUv:nt&&g(S.map.channel),aoMapUv:pt&&g(S.aoMap.channel),lightMapUv:We&&g(S.lightMap.channel),bumpMapUv:Pt&&g(S.bumpMap.channel),normalMapUv:yt&&g(S.normalMap.channel),displacementMapUv:jt&&g(S.displacementMap.channel),emissiveMapUv:k&&g(S.emissiveMap.channel),metalnessMapUv:It&&g(S.metalnessMap.channel),roughnessMapUv:Ge&&g(S.roughnessMap.channel),anisotropyMapUv:$&&g(S.anisotropyMap.channel),clearcoatMapUv:Q&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:ie&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:le&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:X&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:me&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:_e&&g(S.sheenRoughnessMap.channel),specularMapUv:re&&g(S.specularMap.channel),specularColorMapUv:ne&&g(S.specularColorMap.channel),specularIntensityMapUv:Le&&g(S.specularIntensityMap.channel),transmissionMapUv:Be&&g(S.transmissionMap.channel),thicknessMapUv:Qe&&g(S.thicknessMap.channel),alphaMapUv:se&&g(S.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(yt||dt),vertexNormals:!!I.attributes.normal,vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!I.attributes.uv&&(nt||se),fog:!!N,useFog:S.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:S.wireframe===!1&&(S.flatShading===!0||I.attributes.normal===void 0&&yt===!1&&(S.isMeshLambertMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isMeshPhysicalMaterial)),sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:we,skinning:P.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:ge,morphTextureStride:De,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:F.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:J,decodeVideoTexture:nt&&S.map.isVideoTexture===!0&&Ye.getTransfer(S.map.colorSpace)===st,decodeVideoTextureEmissive:k&&S.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(S.emissiveMap.colorSpace)===st,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Gi,flipSided:S.side===Zt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:oe&&S.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(oe&&S.extensions.multiDraw===!0||Re)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Ee.vertexUv1s=l.has(1),Ee.vertexUv2s=l.has(2),Ee.vertexUv3s=l.has(3),l.clear(),Ee}function m(S){const w=[];if(S.shaderID?w.push(S.shaderID):(w.push(S.customVertexShaderID),w.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)w.push(L),w.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(p(w,S),b(w,S),w.push(n.outputColorSpace)),w.push(S.customProgramCacheKey),w.join()}function p(S,w){S.push(w.precision),S.push(w.outputColorSpace),S.push(w.envMapMode),S.push(w.envMapCubeUVHeight),S.push(w.mapUv),S.push(w.alphaMapUv),S.push(w.lightMapUv),S.push(w.aoMapUv),S.push(w.bumpMapUv),S.push(w.normalMapUv),S.push(w.displacementMapUv),S.push(w.emissiveMapUv),S.push(w.metalnessMapUv),S.push(w.roughnessMapUv),S.push(w.anisotropyMapUv),S.push(w.clearcoatMapUv),S.push(w.clearcoatNormalMapUv),S.push(w.clearcoatRoughnessMapUv),S.push(w.iridescenceMapUv),S.push(w.iridescenceThicknessMapUv),S.push(w.sheenColorMapUv),S.push(w.sheenRoughnessMapUv),S.push(w.specularMapUv),S.push(w.specularColorMapUv),S.push(w.specularIntensityMapUv),S.push(w.transmissionMapUv),S.push(w.thicknessMapUv),S.push(w.combine),S.push(w.fogExp2),S.push(w.sizeAttenuation),S.push(w.morphTargetsCount),S.push(w.morphAttributeCount),S.push(w.numDirLights),S.push(w.numPointLights),S.push(w.numSpotLights),S.push(w.numSpotLightMaps),S.push(w.numHemiLights),S.push(w.numRectAreaLights),S.push(w.numDirLightShadows),S.push(w.numPointLightShadows),S.push(w.numSpotLightShadows),S.push(w.numSpotLightShadowsWithMaps),S.push(w.numLightProbes),S.push(w.shadowMapType),S.push(w.toneMapping),S.push(w.numClippingPlanes),S.push(w.numClipIntersection),S.push(w.depthPacking)}function b(S,w){r.disableAll(),w.instancing&&r.enable(0),w.instancingColor&&r.enable(1),w.instancingMorph&&r.enable(2),w.matcap&&r.enable(3),w.envMap&&r.enable(4),w.normalMapObjectSpace&&r.enable(5),w.normalMapTangentSpace&&r.enable(6),w.clearcoat&&r.enable(7),w.iridescence&&r.enable(8),w.alphaTest&&r.enable(9),w.vertexColors&&r.enable(10),w.vertexAlphas&&r.enable(11),w.vertexUv1s&&r.enable(12),w.vertexUv2s&&r.enable(13),w.vertexUv3s&&r.enable(14),w.vertexTangents&&r.enable(15),w.anisotropy&&r.enable(16),w.alphaHash&&r.enable(17),w.batching&&r.enable(18),w.dispersion&&r.enable(19),w.batchingColor&&r.enable(20),w.gradientMap&&r.enable(21),w.packedNormalMap&&r.enable(22),w.vertexNormals&&r.enable(23),S.push(r.mask),r.disableAll(),w.fog&&r.enable(0),w.useFog&&r.enable(1),w.flatShading&&r.enable(2),w.logarithmicDepthBuffer&&r.enable(3),w.reversedDepthBuffer&&r.enable(4),w.skinning&&r.enable(5),w.morphTargets&&r.enable(6),w.morphNormals&&r.enable(7),w.morphColors&&r.enable(8),w.premultipliedAlpha&&r.enable(9),w.shadowMapEnabled&&r.enable(10),w.doubleSided&&r.enable(11),w.flipSided&&r.enable(12),w.useDepthPacking&&r.enable(13),w.dithering&&r.enable(14),w.transmission&&r.enable(15),w.sheen&&r.enable(16),w.opaque&&r.enable(17),w.pointsUvs&&r.enable(18),w.decodeVideoTexture&&r.enable(19),w.decodeVideoTextureEmissive&&r.enable(20),w.alphaToCoverage&&r.enable(21),w.numLightProbeGrids>0&&r.enable(22),S.push(r.mask)}function _(S){const w=u[S.type];let L;if(w){const R=Ti[w];L=yu.clone(R.uniforms)}else L=S.uniforms;return L}function v(S,w){let L=d.get(w);return L!==void 0?++L.usedTimes:(L=new Xg(n,w,S,s),c.push(L),d.set(w,L)),L}function x(S){if(--S.usedTimes===0){const w=c.indexOf(S);c[w]=c[c.length-1],c.pop(),d.delete(S.cacheKey),S.destroy()}}function E(S){o.remove(S)}function C(){o.dispose()}return{getParameters:y,getProgramCacheKey:m,getUniforms:_,acquireProgram:v,releaseProgram:x,releaseShaderCache:E,programs:c,dispose:C}}function jg(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,l){n.get(r)[o]=l}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function Jg(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Yc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function $c(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(h){let u=0;return h.isInstancedMesh&&(u+=2),h.isSkinnedMesh&&(u+=1),u}function o(h,u,g,y,m,p){let b=n[e];return b===void 0?(b={id:h.id,object:h,geometry:u,material:g,materialVariant:r(h),groupOrder:y,renderOrder:h.renderOrder,z:m,group:p},n[e]=b):(b.id=h.id,b.object=h,b.geometry=u,b.material=g,b.materialVariant=r(h),b.groupOrder=y,b.renderOrder=h.renderOrder,b.z=m,b.group=p),e++,b}function l(h,u,g,y,m,p){const b=o(h,u,g,y,m,p);g.transmission>0?i.push(b):g.transparent===!0?s.push(b):t.push(b)}function c(h,u,g,y,m,p){const b=o(h,u,g,y,m,p);g.transmission>0?i.unshift(b):g.transparent===!0?s.unshift(b):t.unshift(b)}function d(h,u){t.length>1&&t.sort(h||Jg),i.length>1&&i.sort(u||Yc),s.length>1&&s.sort(u||Yc)}function f(){for(let h=e,u=n.length;h<u;h++){const g=n[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:l,unshift:c,finish:f,sort:d}}function Qg(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new $c,n.set(i,[r])):s>=a.length?(r=new $c,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function ey(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new V,color:new it};break;case"SpotLight":t={position:new V,direction:new V,color:new it,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new V,color:new it,distance:0,decay:0};break;case"HemisphereLight":t={direction:new V,skyColor:new it,groundColor:new it};break;case"RectAreaLight":t={color:new it,position:new V,halfWidth:new V,halfHeight:new V};break}return n[e.id]=t,t}}}function ty(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let iy=0;function ny(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function sy(n){const e=new ey,t=ty(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);const s=new V,a=new wt,r=new wt;function o(c){let d=0,f=0,h=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let u=0,g=0,y=0,m=0,p=0,b=0,_=0,v=0,x=0,E=0,C=0;c.sort(ny);for(let w=0,L=c.length;w<L;w++){const R=c[w],P=R.color,F=R.intensity,N=R.distance;let I=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Fn?I=R.shadow.map.texture:I=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)d+=P.r*F,f+=P.g*F,h+=P.b*F;else if(R.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(R.sh.coefficients[B],F);C++}else if(R.isDirectionalLight){const B=e.get(R);if(B.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const O=R.shadow,K=t.get(R);K.shadowIntensity=O.intensity,K.shadowBias=O.bias,K.shadowNormalBias=O.normalBias,K.shadowRadius=O.radius,K.shadowMapSize=O.mapSize,i.directionalShadow[u]=K,i.directionalShadowMap[u]=I,i.directionalShadowMatrix[u]=R.shadow.matrix,b++}i.directional[u]=B,u++}else if(R.isSpotLight){const B=e.get(R);B.position.setFromMatrixPosition(R.matrixWorld),B.color.copy(P).multiplyScalar(F),B.distance=N,B.coneCos=Math.cos(R.angle),B.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),B.decay=R.decay,i.spot[y]=B;const O=R.shadow;if(R.map&&(i.spotLightMap[x]=R.map,x++,O.updateMatrices(R),R.castShadow&&E++),i.spotLightMatrix[y]=O.matrix,R.castShadow){const K=t.get(R);K.shadowIntensity=O.intensity,K.shadowBias=O.bias,K.shadowNormalBias=O.normalBias,K.shadowRadius=O.radius,K.shadowMapSize=O.mapSize,i.spotShadow[y]=K,i.spotShadowMap[y]=I,v++}y++}else if(R.isRectAreaLight){const B=e.get(R);B.color.copy(P).multiplyScalar(F),B.halfWidth.set(R.width*.5,0,0),B.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=B,m++}else if(R.isPointLight){const B=e.get(R);if(B.color.copy(R.color).multiplyScalar(R.intensity),B.distance=R.distance,B.decay=R.decay,R.castShadow){const O=R.shadow,K=t.get(R);K.shadowIntensity=O.intensity,K.shadowBias=O.bias,K.shadowNormalBias=O.normalBias,K.shadowRadius=O.radius,K.shadowMapSize=O.mapSize,K.shadowCameraNear=O.camera.near,K.shadowCameraFar=O.camera.far,i.pointShadow[g]=K,i.pointShadowMap[g]=I,i.pointShadowMatrix[g]=R.shadow.matrix,_++}i.point[g]=B,g++}else if(R.isHemisphereLight){const B=e.get(R);B.skyColor.copy(R.color).multiplyScalar(F),B.groundColor.copy(R.groundColor).multiplyScalar(F),i.hemi[p]=B,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=de.LTC_FLOAT_1,i.rectAreaLTC2=de.LTC_FLOAT_2):(i.rectAreaLTC1=de.LTC_HALF_1,i.rectAreaLTC2=de.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=h;const S=i.hash;(S.directionalLength!==u||S.pointLength!==g||S.spotLength!==y||S.rectAreaLength!==m||S.hemiLength!==p||S.numDirectionalShadows!==b||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==x||S.numLightProbes!==C)&&(i.directional.length=u,i.spot.length=y,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=v+x-E,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=C,S.directionalLength=u,S.pointLength=g,S.spotLength=y,S.rectAreaLength=m,S.hemiLength=p,S.numDirectionalShadows=b,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=x,S.numLightProbes=C,i.version=iy++)}function l(c,d){let f=0,h=0,u=0,g=0,y=0;const m=d.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){const _=c[p];if(_.isDirectionalLight){const v=i.directional[f];v.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(_.isSpotLight){const v=i.spot[u];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),u++}else if(_.isRectAreaLight){const v=i.rectArea[g];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),r.identity(),a.copy(_.matrixWorld),a.premultiply(m),r.extractRotation(a),v.halfWidth.set(_.width*.5,0,0),v.halfHeight.set(0,_.height*.5,0),v.halfWidth.applyMatrix4(r),v.halfHeight.applyMatrix4(r),g++}else if(_.isPointLight){const v=i.point[h];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),h++}else if(_.isHemisphereLight){const v=i.hemi[y];v.direction.setFromMatrixPosition(_.matrixWorld),v.direction.transformDirection(m),y++}}}return{setup:o,setupView:l,state:i}}function Kc(n){const e=new sy(n),t=[],i=[],s=[];function a(h){f.camera=h,t.length=0,i.length=0,s.length=0}function r(h){t.push(h)}function o(h){i.push(h)}function l(h){s.push(h)}function c(){e.setup(t)}function d(h){e.setupView(t,h)}const f={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:f,setupLights:c,setupLightsView:d,pushLight:r,pushShadow:o,pushLightProbeGrid:l}}function ay(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new Kc(n),e.set(s,[o])):a>=r.length?(o=new Kc(n),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const ry=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,oy=`uniform sampler2D shadow_pass;
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
}`,ly=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],cy=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],Zc=new wt,Rs=new V,Wr=new V;function hy(n,e,t){let i=new pl;const s=new tt,a=new tt,r=new St,o=new Su,l=new Mu,c={},d=t.maxTextureSize,f={[gn]:Zt,[Zt]:gn,[Gi]:Gi},h=new Ni({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:ry,fragmentShader:oy}),u=h.clone();u.defines.HORIZONTAL_PASS=1;const g=new _i;g.setAttribute("position",new Ii(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new ht(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ra;let p=this.type;this.render=function(E,C,S){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;this.type===hf&&(Pe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Ra);const w=n.getRenderTarget(),L=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),P=n.state;P.setBlending(Yi),P.buffers.depth.getReversed()===!0?P.buffers.color.setClear(0,0,0,0):P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const F=p!==this.type;F&&C.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(I=>I.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,I=E.length;N<I;N++){const B=E[N],O=B.shadow;if(O===void 0){Pe("WebGLShadowMap:",B,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;s.copy(O.mapSize);const K=O.getFrameExtents();s.multiply(K),a.copy(O.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/K.x),s.x=a.x*K.x,O.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/K.y),s.y=a.y*K.y,O.mapSize.y=a.y));const j=n.state.buffers.depth.getReversed();if(O.camera._reversedDepth=j,O.map===null||F===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===Ps){if(B.isPointLight){Pe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new Pi(s.x,s.y,{format:Fn,type:Ki,minFilter:Wt,magFilter:Wt,generateMipmaps:!1}),O.map.texture.name=B.name+".shadowMap",O.map.depthTexture=new ds(s.x,s.y,wi),O.map.depthTexture.name=B.name+".shadowMapDepth",O.map.depthTexture.format=Zi,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=Bt,O.map.depthTexture.magFilter=Bt}else B.isPointLight?(O.map=new Xh(s.x),O.map.depthTexture=new mu(s.x,Di)):(O.map=new Pi(s.x,s.y),O.map.depthTexture=new ds(s.x,s.y,Di)),O.map.depthTexture.name=B.name+".shadowMap",O.map.depthTexture.format=Zi,this.type===Ra?(O.map.depthTexture.compareFunction=j?dl:hl,O.map.depthTexture.minFilter=Wt,O.map.depthTexture.magFilter=Wt):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=Bt,O.map.depthTexture.magFilter=Bt);O.camera.updateProjectionMatrix()}const ee=O.map.isWebGLCubeRenderTarget?6:1;for(let ue=0;ue<ee;ue++){if(O.map.isWebGLCubeRenderTarget)n.setRenderTarget(O.map,ue),n.clear();else{ue===0&&(n.setRenderTarget(O.map),n.clear());const ge=O.getViewport(ue);r.set(a.x*ge.x,a.y*ge.y,a.x*ge.z,a.y*ge.w),P.viewport(r)}if(B.isPointLight){const ge=O.camera,De=O.matrix,Xe=B.distance||ge.far;Xe!==ge.far&&(ge.far=Xe,ge.updateProjectionMatrix()),Rs.setFromMatrixPosition(B.matrixWorld),ge.position.copy(Rs),Wr.copy(ge.position),Wr.add(ly[ue]),ge.up.copy(cy[ue]),ge.lookAt(Wr),ge.updateMatrixWorld(),De.makeTranslation(-Rs.x,-Rs.y,-Rs.z),Zc.multiplyMatrices(ge.projectionMatrix,ge.matrixWorldInverse),O._frustum.setFromProjectionMatrix(Zc,ge.coordinateSystem,ge.reversedDepth)}else O.updateMatrices(B);i=O.getFrustum(),v(C,S,O.camera,B,this.type)}O.isPointLightShadow!==!0&&this.type===Ps&&b(O,S),O.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(w,L,R)};function b(E,C){const S=e.update(y);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,u.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,u.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Pi(s.x,s.y,{format:Fn,type:Ki})),h.uniforms.shadow_pass.value=E.map.depthTexture,h.uniforms.resolution.value=E.mapSize,h.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(C,null,S,h,y,null),u.uniforms.shadow_pass.value=E.mapPass.texture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(C,null,S,u,y,null)}function _(E,C,S,w){let L=null;const R=S.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(R!==void 0)L=R;else if(L=S.isPointLight===!0?l:o,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const P=L.uuid,F=C.uuid;let N=c[P];N===void 0&&(N={},c[P]=N);let I=N[F];I===void 0&&(I=L.clone(),N[F]=I,C.addEventListener("dispose",x)),L=I}if(L.visible=C.visible,L.wireframe=C.wireframe,w===Ps?L.side=C.shadowSide!==null?C.shadowSide:C.side:L.side=C.shadowSide!==null?C.shadowSide:f[C.side],L.alphaMap=C.alphaMap,L.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,L.map=C.map,L.clipShadows=C.clipShadows,L.clippingPlanes=C.clippingPlanes,L.clipIntersection=C.clipIntersection,L.displacementMap=C.displacementMap,L.displacementScale=C.displacementScale,L.displacementBias=C.displacementBias,L.wireframeLinewidth=C.wireframeLinewidth,L.linewidth=C.linewidth,S.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const P=n.properties.get(L);P.light=S}return L}function v(E,C,S,w,L){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&L===Ps)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,E.matrixWorld);const F=e.update(E),N=E.material;if(Array.isArray(N)){const I=F.groups;for(let B=0,O=I.length;B<O;B++){const K=I[B],j=N[K.materialIndex];if(j&&j.visible){const ee=_(E,j,w,L);E.onBeforeShadow(n,E,C,S,F,ee,K),n.renderBufferDirect(S,null,F,ee,E,K),E.onAfterShadow(n,E,C,S,F,ee,K)}}}else if(N.visible){const I=_(E,N,w,L);E.onBeforeShadow(n,E,C,S,F,I,null),n.renderBufferDirect(S,null,F,I,E,null),E.onAfterShadow(n,E,C,S,F,I,null)}}const P=E.children;for(let F=0,N=P.length;F<N;F++)v(P[F],C,S,w,L)}function x(E){E.target.removeEventListener("dispose",x);for(const S in c){const w=c[S],L=E.target.uuid;L in w&&(w[L].dispose(),delete w[L])}}}function dy(n,e){function t(){let D=!1;const se=new St;let q=null;const ye=new St(0,0,0,0);return{setMask:function(oe){q!==oe&&!D&&(n.colorMask(oe,oe,oe,oe),q=oe)},setLocked:function(oe){D=oe},setClear:function(oe,J,Ee,ke,Mt){Mt===!0&&(oe*=ke,J*=ke,Ee*=ke),se.set(oe,J,Ee,ke),ye.equals(se)===!1&&(n.clearColor(oe,J,Ee,ke),ye.copy(se))},reset:function(){D=!1,q=null,ye.set(-1,0,0,0)}}}function i(){let D=!1,se=!1,q=null,ye=null,oe=null;return{setReversed:function(J){if(se!==J){const Ee=e.get("EXT_clip_control");J?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),se=J;const ke=oe;oe=null,this.setClear(ke)}},getReversed:function(){return se},setTest:function(J){J?te(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(J){q!==J&&!D&&(n.depthMask(J),q=J)},setFunc:function(J){if(se&&(J=Wf[J]),ye!==J){switch(J){case no:n.depthFunc(n.NEVER);break;case so:n.depthFunc(n.ALWAYS);break;case ao:n.depthFunc(n.LESS);break;case cs:n.depthFunc(n.LEQUAL);break;case ro:n.depthFunc(n.EQUAL);break;case oo:n.depthFunc(n.GEQUAL);break;case lo:n.depthFunc(n.GREATER);break;case co:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ye=J}},setLocked:function(J){D=J},setClear:function(J){oe!==J&&(oe=J,se&&(J=1-J),n.clearDepth(J))},reset:function(){D=!1,q=null,ye=null,oe=null,se=!1}}}function s(){let D=!1,se=null,q=null,ye=null,oe=null,J=null,Ee=null,ke=null,Mt=null;return{setTest:function(rt){D||(rt?te(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(rt){se!==rt&&!D&&(n.stencilMask(rt),se=rt)},setFunc:function(rt,ki,Si){(q!==rt||ye!==ki||oe!==Si)&&(n.stencilFunc(rt,ki,Si),q=rt,ye=ki,oe=Si)},setOp:function(rt,ki,Si){(J!==rt||Ee!==ki||ke!==Si)&&(n.stencilOp(rt,ki,Si),J=rt,Ee=ki,ke=Si)},setLocked:function(rt){D=rt},setClear:function(rt){Mt!==rt&&(n.clearStencil(rt),Mt=rt)},reset:function(){D=!1,se=null,q=null,ye=null,oe=null,J=null,Ee=null,ke=null,Mt=null}}}const a=new t,r=new i,o=new s,l=new WeakMap,c=new WeakMap;let d={},f={},h={},u=new WeakMap,g=[],y=null,m=!1,p=null,b=null,_=null,v=null,x=null,E=null,C=null,S=new it(0,0,0),w=0,L=!1,R=null,P=null,F=null,N=null,I=null;const B=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,K=0;const j=n.getParameter(n.VERSION);j.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(j)[1]),O=K>=1):j.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),O=K>=2);let ee=null,ue={};const ge=n.getParameter(n.SCISSOR_BOX),De=n.getParameter(n.VIEWPORT),Xe=new St().fromArray(ge),Ce=new St().fromArray(De);function Y(D,se,q,ye){const oe=new Uint8Array(4),J=n.createTexture();n.bindTexture(D,J),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ee=0;Ee<q;Ee++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(se,0,n.RGBA,1,1,ye,0,n.RGBA,n.UNSIGNED_BYTE,oe):n.texImage2D(se+Ee,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,oe);return J}const ae={};ae[n.TEXTURE_2D]=Y(n.TEXTURE_2D,n.TEXTURE_2D,1),ae[n.TEXTURE_CUBE_MAP]=Y(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ae[n.TEXTURE_2D_ARRAY]=Y(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ae[n.TEXTURE_3D]=Y(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),te(n.DEPTH_TEST),r.setFunc(cs),Pt(!1),yt(Jl),te(n.CULL_FACE),pt(Yi);function te(D){d[D]!==!0&&(n.enable(D),d[D]=!0)}function we(D){d[D]!==!1&&(n.disable(D),d[D]=!1)}function Ie(D,se){return h[D]!==se?(n.bindFramebuffer(D,se),h[D]=se,D===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=se),D===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=se),!0):!1}function Re(D,se){let q=g,ye=!1;if(D){q=u.get(se),q===void 0&&(q=[],u.set(se,q));const oe=D.textures;if(q.length!==oe.length||q[0]!==n.COLOR_ATTACHMENT0){for(let J=0,Ee=oe.length;J<Ee;J++)q[J]=n.COLOR_ATTACHMENT0+J;q.length=oe.length,ye=!0}}else q[0]!==n.BACK&&(q[0]=n.BACK,ye=!0);ye&&n.drawBuffers(q)}function nt(D){return y!==D?(n.useProgram(D),y=D,!0):!1}const Oe={[An]:n.FUNC_ADD,[ff]:n.FUNC_SUBTRACT,[uf]:n.FUNC_REVERSE_SUBTRACT};Oe[pf]=n.MIN,Oe[mf]=n.MAX;const Ze={[gf]:n.ZERO,[yf]:n.ONE,[xf]:n.SRC_COLOR,[to]:n.SRC_ALPHA,[Ef]:n.SRC_ALPHA_SATURATE,[Mf]:n.DST_COLOR,[_f]:n.DST_ALPHA,[vf]:n.ONE_MINUS_SRC_COLOR,[io]:n.ONE_MINUS_SRC_ALPHA,[bf]:n.ONE_MINUS_DST_COLOR,[Sf]:n.ONE_MINUS_DST_ALPHA,[Tf]:n.CONSTANT_COLOR,[wf]:n.ONE_MINUS_CONSTANT_COLOR,[Af]:n.CONSTANT_ALPHA,[Rf]:n.ONE_MINUS_CONSTANT_ALPHA};function pt(D,se,q,ye,oe,J,Ee,ke,Mt,rt){if(D===Yi){m===!0&&(we(n.BLEND),m=!1);return}if(m===!1&&(te(n.BLEND),m=!0),D!==df){if(D!==p||rt!==L){if((b!==An||x!==An)&&(n.blendEquation(n.FUNC_ADD),b=An,x=An),rt)switch(D){case rs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case eo:n.blendFunc(n.ONE,n.ONE);break;case Ql:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ec:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Je("WebGLState: Invalid blending: ",D);break}else switch(D){case rs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case eo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Ql:Je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ec:Je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Je("WebGLState: Invalid blending: ",D);break}_=null,v=null,E=null,C=null,S.set(0,0,0),w=0,p=D,L=rt}return}oe=oe||se,J=J||q,Ee=Ee||ye,(se!==b||oe!==x)&&(n.blendEquationSeparate(Oe[se],Oe[oe]),b=se,x=oe),(q!==_||ye!==v||J!==E||Ee!==C)&&(n.blendFuncSeparate(Ze[q],Ze[ye],Ze[J],Ze[Ee]),_=q,v=ye,E=J,C=Ee),(ke.equals(S)===!1||Mt!==w)&&(n.blendColor(ke.r,ke.g,ke.b,Mt),S.copy(ke),w=Mt),p=D,L=!1}function We(D,se){D.side===Gi?we(n.CULL_FACE):te(n.CULL_FACE);let q=D.side===Zt;se&&(q=!q),Pt(q),D.blending===rs&&D.transparent===!1?pt(Yi):pt(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),a.setMask(D.colorWrite);const ye=D.stencilWrite;o.setTest(ye),ye&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),k(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?te(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function Pt(D){R!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),R=D)}function yt(D){D!==lf?(te(n.CULL_FACE),D!==P&&(D===Jl?n.cullFace(n.BACK):D===cf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),P=D}function jt(D){D!==F&&(O&&n.lineWidth(D),F=D)}function k(D,se,q){D?(te(n.POLYGON_OFFSET_FILL),(N!==se||I!==q)&&(N=se,I=q,r.getReversed()&&(se=-se),n.polygonOffset(se,q))):we(n.POLYGON_OFFSET_FILL)}function It(D){D?te(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function Ge(D){D===void 0&&(D=n.TEXTURE0+B-1),ee!==D&&(n.activeTexture(D),ee=D)}function dt(D,se,q){q===void 0&&(ee===null?q=n.TEXTURE0+B-1:q=ee);let ye=ue[q];ye===void 0&&(ye={type:void 0,texture:void 0},ue[q]=ye),(ye.type!==D||ye.texture!==se)&&(ee!==q&&(n.activeTexture(q),ee=q),n.bindTexture(D,se||ae[D]),ye.type=D,ye.texture=se)}function he(){const D=ue[ee];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function vt(){try{n.compressedTexImage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function A(){try{n.compressedTexImage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function M(){try{n.texSubImage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function z(){try{n.texSubImage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function $(){try{n.compressedTexSubImage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function Q(){try{n.compressedTexSubImage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function ie(){try{n.texStorage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function le(){try{n.texStorage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function X(){try{n.texImage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function Z(){try{n.texImage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function me(D){return f[D]!==void 0?f[D]:n.getParameter(D)}function _e(D,se){f[D]!==se&&(n.pixelStorei(D,se),f[D]=se)}function re(D){Xe.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),Xe.copy(D))}function ne(D){Ce.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),Ce.copy(D))}function Le(D,se){let q=c.get(se);q===void 0&&(q=new WeakMap,c.set(se,q));let ye=q.get(D);ye===void 0&&(ye=n.getUniformBlockIndex(se,D.name),q.set(D,ye))}function Be(D,se){const ye=c.get(se).get(D);l.get(se)!==ye&&(n.uniformBlockBinding(se,ye,D.__bindingPointIndex),l.set(se,ye))}function Qe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),d={},f={},ee=null,ue={},h={},u=new WeakMap,g=[],y=null,m=!1,p=null,b=null,_=null,v=null,x=null,E=null,C=null,S=new it(0,0,0),w=0,L=!1,R=null,P=null,F=null,N=null,I=null,Xe.set(0,0,n.canvas.width,n.canvas.height),Ce.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:te,disable:we,bindFramebuffer:Ie,drawBuffers:Re,useProgram:nt,setBlending:pt,setMaterial:We,setFlipSided:Pt,setCullFace:yt,setLineWidth:jt,setPolygonOffset:k,setScissorTest:It,activeTexture:Ge,bindTexture:dt,unbindTexture:he,compressedTexImage2D:vt,compressedTexImage3D:A,texImage2D:X,texImage3D:Z,pixelStorei:_e,getParameter:me,updateUBOMapping:Le,uniformBlockBinding:Be,texStorage2D:ie,texStorage3D:le,texSubImage2D:M,texSubImage3D:z,compressedTexSubImage2D:$,compressedTexSubImage3D:Q,scissor:re,viewport:ne,reset:Qe}}function fy(n,e,t,i,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new tt,d=new WeakMap,f=new Set;let h;const u=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(A,M){return g?new OffscreenCanvas(A,M):Wa("canvas")}function m(A,M,z){let $=1;const Q=vt(A);if((Q.width>z||Q.height>z)&&($=z/Math.max(Q.width,Q.height)),$<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const ie=Math.floor($*Q.width),le=Math.floor($*Q.height);h===void 0&&(h=y(ie,le));const X=M?y(ie,le):h;return X.width=ie,X.height=le,X.getContext("2d").drawImage(A,0,0,ie,le),Pe("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+ie+"x"+le+")."),X}else return"data"in A&&Pe("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),A;return A}function p(A){return A.generateMipmaps}function b(A){n.generateMipmap(A)}function _(A){return A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?n.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(A,M,z,$,Q,ie=!1){if(A!==null){if(n[A]!==void 0)return n[A];Pe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let le;$&&(le=e.get("EXT_texture_norm16"),le||Pe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let X=M;if(M===n.RED&&(z===n.FLOAT&&(X=n.R32F),z===n.HALF_FLOAT&&(X=n.R16F),z===n.UNSIGNED_BYTE&&(X=n.R8),z===n.UNSIGNED_SHORT&&le&&(X=le.R16_EXT),z===n.SHORT&&le&&(X=le.R16_SNORM_EXT)),M===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&(X=n.R8UI),z===n.UNSIGNED_SHORT&&(X=n.R16UI),z===n.UNSIGNED_INT&&(X=n.R32UI),z===n.BYTE&&(X=n.R8I),z===n.SHORT&&(X=n.R16I),z===n.INT&&(X=n.R32I)),M===n.RG&&(z===n.FLOAT&&(X=n.RG32F),z===n.HALF_FLOAT&&(X=n.RG16F),z===n.UNSIGNED_BYTE&&(X=n.RG8),z===n.UNSIGNED_SHORT&&le&&(X=le.RG16_EXT),z===n.SHORT&&le&&(X=le.RG16_SNORM_EXT)),M===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&(X=n.RG8UI),z===n.UNSIGNED_SHORT&&(X=n.RG16UI),z===n.UNSIGNED_INT&&(X=n.RG32UI),z===n.BYTE&&(X=n.RG8I),z===n.SHORT&&(X=n.RG16I),z===n.INT&&(X=n.RG32I)),M===n.RGB_INTEGER&&(z===n.UNSIGNED_BYTE&&(X=n.RGB8UI),z===n.UNSIGNED_SHORT&&(X=n.RGB16UI),z===n.UNSIGNED_INT&&(X=n.RGB32UI),z===n.BYTE&&(X=n.RGB8I),z===n.SHORT&&(X=n.RGB16I),z===n.INT&&(X=n.RGB32I)),M===n.RGBA_INTEGER&&(z===n.UNSIGNED_BYTE&&(X=n.RGBA8UI),z===n.UNSIGNED_SHORT&&(X=n.RGBA16UI),z===n.UNSIGNED_INT&&(X=n.RGBA32UI),z===n.BYTE&&(X=n.RGBA8I),z===n.SHORT&&(X=n.RGBA16I),z===n.INT&&(X=n.RGBA32I)),M===n.RGB&&(z===n.UNSIGNED_SHORT&&le&&(X=le.RGB16_EXT),z===n.SHORT&&le&&(X=le.RGB16_SNORM_EXT),z===n.UNSIGNED_INT_5_9_9_9_REV&&(X=n.RGB9_E5),z===n.UNSIGNED_INT_10F_11F_11F_REV&&(X=n.R11F_G11F_B10F)),M===n.RGBA){const Z=ie?Ha:Ye.getTransfer(Q);z===n.FLOAT&&(X=n.RGBA32F),z===n.HALF_FLOAT&&(X=n.RGBA16F),z===n.UNSIGNED_BYTE&&(X=Z===st?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT&&le&&(X=le.RGBA16_EXT),z===n.SHORT&&le&&(X=le.RGBA16_SNORM_EXT),z===n.UNSIGNED_SHORT_4_4_4_4&&(X=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&(X=n.RGB5_A1)}return(X===n.R16F||X===n.R32F||X===n.RG16F||X===n.RG32F||X===n.RGBA16F||X===n.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function x(A,M){let z;return A?M===null||M===Di||M===Us?z=n.DEPTH24_STENCIL8:M===wi?z=n.DEPTH32F_STENCIL8:M===ks&&(z=n.DEPTH24_STENCIL8,Pe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Di||M===Us?z=n.DEPTH_COMPONENT24:M===wi?z=n.DEPTH_COMPONENT32F:M===ks&&(z=n.DEPTH_COMPONENT16),z}function E(A,M){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==Bt&&A.minFilter!==Wt?Math.log2(Math.max(M.width,M.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?M.mipmaps.length:1}function C(A){const M=A.target;M.removeEventListener("dispose",C),w(M),M.isVideoTexture&&d.delete(M),M.isHTMLTexture&&f.delete(M)}function S(A){const M=A.target;M.removeEventListener("dispose",S),R(M)}function w(A){const M=i.get(A);if(M.__webglInit===void 0)return;const z=A.source,$=u.get(z);if($){const Q=$[M.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&L(A),Object.keys($).length===0&&u.delete(z)}i.remove(A)}function L(A){const M=i.get(A);n.deleteTexture(M.__webglTexture);const z=A.source,$=u.get(z);delete $[M.__cacheKey],r.memory.textures--}function R(A){const M=i.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),i.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(M.__webglFramebuffer[$]))for(let Q=0;Q<M.__webglFramebuffer[$].length;Q++)n.deleteFramebuffer(M.__webglFramebuffer[$][Q]);else n.deleteFramebuffer(M.__webglFramebuffer[$]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[$])}else{if(Array.isArray(M.__webglFramebuffer))for(let $=0;$<M.__webglFramebuffer.length;$++)n.deleteFramebuffer(M.__webglFramebuffer[$]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let $=0;$<M.__webglColorRenderbuffer.length;$++)M.__webglColorRenderbuffer[$]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[$]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const z=A.textures;for(let $=0,Q=z.length;$<Q;$++){const ie=i.get(z[$]);ie.__webglTexture&&(n.deleteTexture(ie.__webglTexture),r.memory.textures--),i.remove(z[$])}i.remove(A)}let P=0;function F(){P=0}function N(){return P}function I(A){P=A}function B(){const A=P;return A>=s.maxTextures&&Pe("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),P+=1,A}function O(A){const M=[];return M.push(A.wrapS),M.push(A.wrapT),M.push(A.wrapR||0),M.push(A.magFilter),M.push(A.minFilter),M.push(A.anisotropy),M.push(A.internalFormat),M.push(A.format),M.push(A.type),M.push(A.generateMipmaps),M.push(A.premultiplyAlpha),M.push(A.flipY),M.push(A.unpackAlignment),M.push(A.colorSpace),M.join()}function K(A,M){const z=i.get(A);if(A.isVideoTexture&&dt(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&z.__version!==A.version){const $=A.image;if($===null)Pe("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)Pe("WebGLRenderer: Texture marked for update but image is incomplete");else{we(z,A,M);return}}else A.isExternalTexture&&(z.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+M)}function j(A,M){const z=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&z.__version!==A.version){we(z,A,M);return}else A.isExternalTexture&&(z.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+M)}function ee(A,M){const z=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&z.__version!==A.version){we(z,A,M);return}t.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+M)}function ue(A,M){const z=i.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&z.__version!==A.version){Ie(z,A,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+M)}const ge={[ho]:n.REPEAT,[Xi]:n.CLAMP_TO_EDGE,[fo]:n.MIRRORED_REPEAT},De={[Bt]:n.NEAREST,[If]:n.NEAREST_MIPMAP_NEAREST,[qs]:n.NEAREST_MIPMAP_LINEAR,[Wt]:n.LINEAR,[dr]:n.LINEAR_MIPMAP_NEAREST,[Cn]:n.LINEAR_MIPMAP_LINEAR},Xe={[Nf]:n.NEVER,[Bf]:n.ALWAYS,[kf]:n.LESS,[hl]:n.LEQUAL,[Uf]:n.EQUAL,[dl]:n.GEQUAL,[Ff]:n.GREATER,[Of]:n.NOTEQUAL};function Ce(A,M){if(M.type===wi&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Wt||M.magFilter===dr||M.magFilter===qs||M.magFilter===Cn||M.minFilter===Wt||M.minFilter===dr||M.minFilter===qs||M.minFilter===Cn)&&Pe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(A,n.TEXTURE_WRAP_S,ge[M.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,ge[M.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,ge[M.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,De[M.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,De[M.minFilter]),M.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,Xe[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Bt||M.minFilter!==qs&&M.minFilter!==Cn||M.type===wi&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(A,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Y(A,M){let z=!1;A.__webglInit===void 0&&(A.__webglInit=!0,M.addEventListener("dispose",C));const $=M.source;let Q=u.get($);Q===void 0&&(Q={},u.set($,Q));const ie=O(M);if(ie!==A.__cacheKey){Q[ie]===void 0&&(Q[ie]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,z=!0),Q[ie].usedTimes++;const le=Q[A.__cacheKey];le!==void 0&&(Q[A.__cacheKey].usedTimes--,le.usedTimes===0&&L(M)),A.__cacheKey=ie,A.__webglTexture=Q[ie].texture}return z}function ae(A,M,z){return Math.floor(Math.floor(A/z)/M)}function te(A,M,z,$){const ie=A.updateRanges;if(ie.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,M.width,M.height,z,$,M.data);else{ie.sort((_e,re)=>_e.start-re.start);let le=0;for(let _e=1;_e<ie.length;_e++){const re=ie[le],ne=ie[_e],Le=re.start+re.count,Be=ae(ne.start,M.width,4),Qe=ae(re.start,M.width,4);ne.start<=Le+1&&Be===Qe&&ae(ne.start+ne.count-1,M.width,4)===Be?re.count=Math.max(re.count,ne.start+ne.count-re.start):(++le,ie[le]=ne)}ie.length=le+1;const X=t.getParameter(n.UNPACK_ROW_LENGTH),Z=t.getParameter(n.UNPACK_SKIP_PIXELS),me=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,M.width);for(let _e=0,re=ie.length;_e<re;_e++){const ne=ie[_e],Le=Math.floor(ne.start/4),Be=Math.ceil(ne.count/4),Qe=Le%M.width,D=Math.floor(Le/M.width),se=Be,q=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Qe),t.pixelStorei(n.UNPACK_SKIP_ROWS,D),t.texSubImage2D(n.TEXTURE_2D,0,Qe,D,se,q,z,$,M.data)}A.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,X),t.pixelStorei(n.UNPACK_SKIP_PIXELS,Z),t.pixelStorei(n.UNPACK_SKIP_ROWS,me)}}function we(A,M,z){let $=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&($=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&($=n.TEXTURE_3D);const Q=Y(A,M),ie=M.source;t.bindTexture($,A.__webglTexture,n.TEXTURE0+z);const le=i.get(ie);if(ie.version!==le.__version||Q===!0){if(t.activeTexture(n.TEXTURE0+z),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const q=Ye.getPrimaries(Ye.workingColorSpace),ye=M.colorSpace===ln?null:Ye.getPrimaries(M.colorSpace),oe=M.colorSpace===ln||q===ye?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,oe)}t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment);let Z=m(M.image,!1,s.maxTextureSize);Z=he(M,Z);const me=a.convert(M.format,M.colorSpace),_e=a.convert(M.type);let re=v(M.internalFormat,me,_e,M.normalized,M.colorSpace,M.isVideoTexture);Ce($,M);let ne;const Le=M.mipmaps,Be=M.isVideoTexture!==!0,Qe=le.__version===void 0||Q===!0,D=ie.dataReady,se=E(M,Z);if(M.isDepthTexture)re=x(M.format===Pn,M.type),Qe&&(Be?t.texStorage2D(n.TEXTURE_2D,1,re,Z.width,Z.height):t.texImage2D(n.TEXTURE_2D,0,re,Z.width,Z.height,0,me,_e,null));else if(M.isDataTexture)if(Le.length>0){Be&&Qe&&t.texStorage2D(n.TEXTURE_2D,se,re,Le[0].width,Le[0].height);for(let q=0,ye=Le.length;q<ye;q++)ne=Le[q],Be?D&&t.texSubImage2D(n.TEXTURE_2D,q,0,0,ne.width,ne.height,me,_e,ne.data):t.texImage2D(n.TEXTURE_2D,q,re,ne.width,ne.height,0,me,_e,ne.data);M.generateMipmaps=!1}else Be?(Qe&&t.texStorage2D(n.TEXTURE_2D,se,re,Z.width,Z.height),D&&te(M,Z,me,_e)):t.texImage2D(n.TEXTURE_2D,0,re,Z.width,Z.height,0,me,_e,Z.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Be&&Qe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,se,re,Le[0].width,Le[0].height,Z.depth);for(let q=0,ye=Le.length;q<ye;q++)if(ne=Le[q],M.format!==yi)if(me!==null)if(Be){if(D)if(M.layerUpdates.size>0){const oe=Ac(ne.width,ne.height,M.format,M.type);for(const J of M.layerUpdates){const Ee=ne.data.subarray(J*oe/ne.data.BYTES_PER_ELEMENT,(J+1)*oe/ne.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,J,ne.width,ne.height,1,me,Ee)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,ne.width,ne.height,Z.depth,me,ne.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,q,re,ne.width,ne.height,Z.depth,0,ne.data,0,0);else Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?D&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,ne.width,ne.height,Z.depth,me,_e,ne.data):t.texImage3D(n.TEXTURE_2D_ARRAY,q,re,ne.width,ne.height,Z.depth,0,me,_e,ne.data)}else{Be&&Qe&&t.texStorage2D(n.TEXTURE_2D,se,re,Le[0].width,Le[0].height);for(let q=0,ye=Le.length;q<ye;q++)ne=Le[q],M.format!==yi?me!==null?Be?D&&t.compressedTexSubImage2D(n.TEXTURE_2D,q,0,0,ne.width,ne.height,me,ne.data):t.compressedTexImage2D(n.TEXTURE_2D,q,re,ne.width,ne.height,0,ne.data):Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?D&&t.texSubImage2D(n.TEXTURE_2D,q,0,0,ne.width,ne.height,me,_e,ne.data):t.texImage2D(n.TEXTURE_2D,q,re,ne.width,ne.height,0,me,_e,ne.data)}else if(M.isDataArrayTexture)if(Be){if(Qe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,se,re,Z.width,Z.height,Z.depth),D)if(M.layerUpdates.size>0){const q=Ac(Z.width,Z.height,M.format,M.type);for(const ye of M.layerUpdates){const oe=Z.data.subarray(ye*q/Z.data.BYTES_PER_ELEMENT,(ye+1)*q/Z.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ye,Z.width,Z.height,1,me,_e,oe)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,me,_e,Z.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,re,Z.width,Z.height,Z.depth,0,me,_e,Z.data);else if(M.isData3DTexture)Be?(Qe&&t.texStorage3D(n.TEXTURE_3D,se,re,Z.width,Z.height,Z.depth),D&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,me,_e,Z.data)):t.texImage3D(n.TEXTURE_3D,0,re,Z.width,Z.height,Z.depth,0,me,_e,Z.data);else if(M.isFramebufferTexture){if(Qe)if(Be)t.texStorage2D(n.TEXTURE_2D,se,re,Z.width,Z.height);else{let q=Z.width,ye=Z.height;for(let oe=0;oe<se;oe++)t.texImage2D(n.TEXTURE_2D,oe,re,q,ye,0,me,_e,null),q>>=1,ye>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in n){const q=n.canvas;if(q.hasAttribute("layoutsubtree")||q.setAttribute("layoutsubtree","true"),Z.parentNode!==q){q.appendChild(Z),f.add(M),q.onpaint=ke=>{const Mt=ke.changedElements;for(const rt of f)Mt.includes(rt.image)&&(rt.needsUpdate=!0)},q.requestPaint();return}const ye=0,oe=n.RGBA,J=n.RGBA,Ee=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,ye,oe,J,Ee,Z),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Le.length>0){if(Be&&Qe){const q=vt(Le[0]);t.texStorage2D(n.TEXTURE_2D,se,re,q.width,q.height)}for(let q=0,ye=Le.length;q<ye;q++)ne=Le[q],Be?D&&t.texSubImage2D(n.TEXTURE_2D,q,0,0,me,_e,ne):t.texImage2D(n.TEXTURE_2D,q,re,me,_e,ne);M.generateMipmaps=!1}else if(Be){if(Qe){const q=vt(Z);t.texStorage2D(n.TEXTURE_2D,se,re,q.width,q.height)}D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,me,_e,Z)}else t.texImage2D(n.TEXTURE_2D,0,re,me,_e,Z);p(M)&&b($),le.__version=ie.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function Ie(A,M,z){if(M.image.length!==6)return;const $=Y(A,M),Q=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+z);const ie=i.get(Q);if(Q.version!==ie.__version||$===!0){t.activeTexture(n.TEXTURE0+z);const le=Ye.getPrimaries(Ye.workingColorSpace),X=M.colorSpace===ln?null:Ye.getPrimaries(M.colorSpace),Z=M.colorSpace===ln||le===X?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Z);const me=M.isCompressedTexture||M.image[0].isCompressedTexture,_e=M.image[0]&&M.image[0].isDataTexture,re=[];for(let J=0;J<6;J++)!me&&!_e?re[J]=m(M.image[J],!0,s.maxCubemapSize):re[J]=_e?M.image[J].image:M.image[J],re[J]=he(M,re[J]);const ne=re[0],Le=a.convert(M.format,M.colorSpace),Be=a.convert(M.type),Qe=v(M.internalFormat,Le,Be,M.normalized,M.colorSpace),D=M.isVideoTexture!==!0,se=ie.__version===void 0||$===!0,q=Q.dataReady;let ye=E(M,ne);Ce(n.TEXTURE_CUBE_MAP,M);let oe;if(me){D&&se&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,Qe,ne.width,ne.height);for(let J=0;J<6;J++){oe=re[J].mipmaps;for(let Ee=0;Ee<oe.length;Ee++){const ke=oe[Ee];M.format!==yi?Le!==null?D?q&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee,0,0,ke.width,ke.height,Le,ke.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee,Qe,ke.width,ke.height,0,ke.data):Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee,0,0,ke.width,ke.height,Le,Be,ke.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee,Qe,ke.width,ke.height,0,Le,Be,ke.data)}}}else{if(oe=M.mipmaps,D&&se){oe.length>0&&ye++;const J=vt(re[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,Qe,J.width,J.height)}for(let J=0;J<6;J++)if(_e){D?q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,re[J].width,re[J].height,Le,Be,re[J].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Qe,re[J].width,re[J].height,0,Le,Be,re[J].data);for(let Ee=0;Ee<oe.length;Ee++){const Mt=oe[Ee].image[J].image;D?q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee+1,0,0,Mt.width,Mt.height,Le,Be,Mt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee+1,Qe,Mt.width,Mt.height,0,Le,Be,Mt.data)}}else{D?q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Le,Be,re[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Qe,Le,Be,re[J]);for(let Ee=0;Ee<oe.length;Ee++){const ke=oe[Ee];D?q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee+1,0,0,Le,Be,ke.image[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee+1,Qe,Le,Be,ke.image[J])}}}p(M)&&b(n.TEXTURE_CUBE_MAP),ie.__version=Q.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function Re(A,M,z,$,Q,ie){const le=a.convert(z.format,z.colorSpace),X=a.convert(z.type),Z=v(z.internalFormat,le,X,z.normalized,z.colorSpace),me=i.get(M),_e=i.get(z);if(_e.__renderTarget=M,!me.__hasExternalTextures){const re=Math.max(1,M.width>>ie),ne=Math.max(1,M.height>>ie);Q===n.TEXTURE_3D||Q===n.TEXTURE_2D_ARRAY?t.texImage3D(Q,ie,Z,re,ne,M.depth,0,le,X,null):t.texImage2D(Q,ie,Z,re,ne,0,le,X,null)}t.bindFramebuffer(n.FRAMEBUFFER,A),Ge(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,$,Q,_e.__webglTexture,0,It(M)):(Q===n.TEXTURE_2D||Q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,$,Q,_e.__webglTexture,ie),t.bindFramebuffer(n.FRAMEBUFFER,null)}function nt(A,M,z){if(n.bindRenderbuffer(n.RENDERBUFFER,A),M.depthBuffer){const $=M.depthTexture,Q=$&&$.isDepthTexture?$.type:null,ie=x(M.stencilBuffer,Q),le=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Ge(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,It(M),ie,M.width,M.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,It(M),ie,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,ie,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,le,n.RENDERBUFFER,A)}else{const $=M.textures;for(let Q=0;Q<$.length;Q++){const ie=$[Q],le=a.convert(ie.format,ie.colorSpace),X=a.convert(ie.type),Z=v(ie.internalFormat,le,X,ie.normalized,ie.colorSpace);Ge(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,It(M),Z,M.width,M.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,It(M),Z,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,Z,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Oe(A,M,z){const $=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,A),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=i.get(M.depthTexture);if(Q.__renderTarget=M,(!Q.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),$){if(Q.__webglInit===void 0&&(Q.__webglInit=!0,M.depthTexture.addEventListener("dispose",C)),Q.__webglTexture===void 0){Q.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),Ce(n.TEXTURE_CUBE_MAP,M.depthTexture);const me=a.convert(M.depthTexture.format),_e=a.convert(M.depthTexture.type);let re;M.depthTexture.format===Zi?re=n.DEPTH_COMPONENT24:M.depthTexture.format===Pn&&(re=n.DEPTH24_STENCIL8);for(let ne=0;ne<6;ne++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,re,M.width,M.height,0,me,_e,null)}}else K(M.depthTexture,0);const ie=Q.__webglTexture,le=It(M),X=$?n.TEXTURE_CUBE_MAP_POSITIVE_X+z:n.TEXTURE_2D,Z=M.depthTexture.format===Pn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(M.depthTexture.format===Zi)Ge(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,X,ie,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,Z,X,ie,0);else if(M.depthTexture.format===Pn)Ge(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,X,ie,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,Z,X,ie,0);else throw new Error("Unknown depthTexture format")}function Ze(A){const M=i.get(A),z=A.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==A.depthTexture){const $=A.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),$){const Q=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,$.removeEventListener("dispose",Q)};$.addEventListener("dispose",Q),M.__depthDisposeCallback=Q}M.__boundDepthTexture=$}if(A.depthTexture&&!M.__autoAllocateDepthBuffer)if(z)for(let $=0;$<6;$++)Oe(M.__webglFramebuffer[$],A,$);else{const $=A.texture.mipmaps;$&&$.length>0?Oe(M.__webglFramebuffer[0],A,0):Oe(M.__webglFramebuffer,A,0)}else if(z){M.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[$]),M.__webglDepthbuffer[$]===void 0)M.__webglDepthbuffer[$]=n.createRenderbuffer(),nt(M.__webglDepthbuffer[$],A,!1);else{const Q=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ie=M.__webglDepthbuffer[$];n.bindRenderbuffer(n.RENDERBUFFER,ie),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,ie)}}else{const $=A.texture.mipmaps;if($&&$.length>0?t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),nt(M.__webglDepthbuffer,A,!1);else{const Q=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ie=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ie),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,ie)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function pt(A,M,z){const $=i.get(A);M!==void 0&&Re($.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&Ze(A)}function We(A){const M=A.texture,z=i.get(A),$=i.get(M);A.addEventListener("dispose",S);const Q=A.textures,ie=A.isWebGLCubeRenderTarget===!0,le=Q.length>1;if(le||($.__webglTexture===void 0&&($.__webglTexture=n.createTexture()),$.__version=M.version,r.memory.textures++),ie){z.__webglFramebuffer=[];for(let X=0;X<6;X++)if(M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer[X]=[];for(let Z=0;Z<M.mipmaps.length;Z++)z.__webglFramebuffer[X][Z]=n.createFramebuffer()}else z.__webglFramebuffer[X]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer=[];for(let X=0;X<M.mipmaps.length;X++)z.__webglFramebuffer[X]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(le)for(let X=0,Z=Q.length;X<Z;X++){const me=i.get(Q[X]);me.__webglTexture===void 0&&(me.__webglTexture=n.createTexture(),r.memory.textures++)}if(A.samples>0&&Ge(A)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let X=0;X<Q.length;X++){const Z=Q[X];z.__webglColorRenderbuffer[X]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[X]);const me=a.convert(Z.format,Z.colorSpace),_e=a.convert(Z.type),re=v(Z.internalFormat,me,_e,Z.normalized,Z.colorSpace,A.isXRRenderTarget===!0),ne=It(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,ne,re,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+X,n.RENDERBUFFER,z.__webglColorRenderbuffer[X])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),nt(z.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ie){t.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture),Ce(n.TEXTURE_CUBE_MAP,M);for(let X=0;X<6;X++)if(M.mipmaps&&M.mipmaps.length>0)for(let Z=0;Z<M.mipmaps.length;Z++)Re(z.__webglFramebuffer[X][Z],A,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+X,Z);else Re(z.__webglFramebuffer[X],A,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0);p(M)&&b(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(le){for(let X=0,Z=Q.length;X<Z;X++){const me=Q[X],_e=i.get(me);let re=n.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(re=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(re,_e.__webglTexture),Ce(re,me),Re(z.__webglFramebuffer,A,me,n.COLOR_ATTACHMENT0+X,re,0),p(me)&&b(re)}t.unbindTexture()}else{let X=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(X=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(X,$.__webglTexture),Ce(X,M),M.mipmaps&&M.mipmaps.length>0)for(let Z=0;Z<M.mipmaps.length;Z++)Re(z.__webglFramebuffer[Z],A,M,n.COLOR_ATTACHMENT0,X,Z);else Re(z.__webglFramebuffer,A,M,n.COLOR_ATTACHMENT0,X,0);p(M)&&b(X),t.unbindTexture()}A.depthBuffer&&Ze(A)}function Pt(A){const M=A.textures;for(let z=0,$=M.length;z<$;z++){const Q=M[z];if(p(Q)){const ie=_(A),le=i.get(Q).__webglTexture;t.bindTexture(ie,le),b(ie),t.unbindTexture()}}}const yt=[],jt=[];function k(A){if(A.samples>0){if(Ge(A)===!1){const M=A.textures,z=A.width,$=A.height;let Q=n.COLOR_BUFFER_BIT;const ie=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,le=i.get(A),X=M.length>1;if(X)for(let me=0;me<M.length;me++)t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,le.__webglMultisampledFramebuffer);const Z=A.texture.mipmaps;Z&&Z.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer);for(let me=0;me<M.length;me++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(Q|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(Q|=n.STENCIL_BUFFER_BIT)),X){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,le.__webglColorRenderbuffer[me]);const _e=i.get(M[me]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,_e,0)}n.blitFramebuffer(0,0,z,$,0,0,z,$,Q,n.NEAREST),l===!0&&(yt.length=0,jt.length=0,yt.push(n.COLOR_ATTACHMENT0+me),A.depthBuffer&&A.resolveDepthBuffer===!1&&(yt.push(ie),jt.push(ie),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,jt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,yt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),X)for(let me=0;me<M.length;me++){t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,le.__webglColorRenderbuffer[me]);const _e=i.get(M[me]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,_e,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const M=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function It(A){return Math.min(s.maxSamples,A.samples)}function Ge(A){const M=i.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function dt(A){const M=r.render.frame;d.get(A)!==M&&(d.set(A,M),A.update())}function he(A,M){const z=A.colorSpace,$=A.format,Q=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||z!==Va&&z!==ln&&(Ye.getTransfer(z)===st?($!==yi||Q!==ni)&&Pe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Je("WebGLTextures: Unsupported texture color space:",z)),M}function vt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=F,this.getTextureUnits=N,this.setTextureUnits=I,this.setTexture2D=K,this.setTexture2DArray=j,this.setTexture3D=ee,this.setTextureCube=ue,this.rebindTextures=pt,this.setupRenderTarget=We,this.updateRenderTargetMipmap=Pt,this.updateMultisampleRenderTarget=k,this.setupDepthRenderbuffer=Ze,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=Ge,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function uy(n,e){function t(i,s=ln){let a;const r=Ye.getTransfer(s);if(i===ni)return n.UNSIGNED_BYTE;if(i===al)return n.UNSIGNED_SHORT_4_4_4_4;if(i===rl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ah)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Rh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Th)return n.BYTE;if(i===wh)return n.SHORT;if(i===ks)return n.UNSIGNED_SHORT;if(i===sl)return n.INT;if(i===Di)return n.UNSIGNED_INT;if(i===wi)return n.FLOAT;if(i===Ki)return n.HALF_FLOAT;if(i===Ch)return n.ALPHA;if(i===Ph)return n.RGB;if(i===yi)return n.RGBA;if(i===Zi)return n.DEPTH_COMPONENT;if(i===Pn)return n.DEPTH_STENCIL;if(i===Ih)return n.RED;if(i===ol)return n.RED_INTEGER;if(i===Fn)return n.RG;if(i===ll)return n.RG_INTEGER;if(i===cl)return n.RGBA_INTEGER;if(i===Ca||i===Pa||i===Ia||i===La)if(r===st)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Ca)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Pa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ia)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===La)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Ca)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Pa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ia)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===La)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===uo||i===po||i===mo||i===go)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===uo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===po)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===mo)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===go)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===yo||i===xo||i===vo||i===_o||i===So||i===Ba||i===Mo)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===yo||i===xo)return r===st?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===vo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===_o)return a.COMPRESSED_R11_EAC;if(i===So)return a.COMPRESSED_SIGNED_R11_EAC;if(i===Ba)return a.COMPRESSED_RG11_EAC;if(i===Mo)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===bo||i===Eo||i===To||i===wo||i===Ao||i===Ro||i===Co||i===Po||i===Io||i===Lo||i===Do||i===No||i===ko||i===Uo)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===bo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Eo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===To)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===wo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ao)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ro)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Co)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Po)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Io)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Lo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Do)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===No)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ko)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Uo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Fo||i===Oo||i===Bo)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===Fo)return r===st?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Oo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Bo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===zo||i===Vo||i===za||i===Ho)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===zo)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Vo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===za)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ho)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Us?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const py=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,my=`
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

}`;class gy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Bh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Ni({vertexShader:py,fragmentShader:my,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ht(new ja(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class yy extends Bn{constructor(e,t){super();const i=this;let s=null,a=1,r=null,o="local-floor",l=1,c=null,d=null,f=null,h=null,u=null,g=null;const y=typeof XRWebGLBinding<"u",m=new gy,p={},b=t.getContextAttributes();let _=null,v=null;const x=[],E=[],C=new tt;let S=null;const w=new ui;w.viewport=new St;const L=new ui;L.viewport=new St;const R=[w,L],P=new Au;let F=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ae=x[Y];return ae===void 0&&(ae=new vr,x[Y]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(Y){let ae=x[Y];return ae===void 0&&(ae=new vr,x[Y]=ae),ae.getGripSpace()},this.getHand=function(Y){let ae=x[Y];return ae===void 0&&(ae=new vr,x[Y]=ae),ae.getHandSpace()};function I(Y){const ae=E.indexOf(Y.inputSource);if(ae===-1)return;const te=x[ae];te!==void 0&&(te.update(Y.inputSource,Y.frame,c||r),te.dispatchEvent({type:Y.type,data:Y.inputSource}))}function B(){s.removeEventListener("select",I),s.removeEventListener("selectstart",I),s.removeEventListener("selectend",I),s.removeEventListener("squeeze",I),s.removeEventListener("squeezestart",I),s.removeEventListener("squeezeend",I),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",O);for(let Y=0;Y<x.length;Y++){const ae=E[Y];ae!==null&&(E[Y]=null,x[Y].disconnect(ae))}F=null,N=null,m.reset();for(const Y in p)delete p[Y];e.setRenderTarget(_),u=null,h=null,f=null,s=null,v=null,Ce.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){a=Y,i.isPresenting===!0&&Pe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&Pe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:u},this.getBinding=function(){return f===null&&y&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(_=e.getRenderTarget(),s.addEventListener("select",I),s.addEventListener("selectstart",I),s.addEventListener("selectend",I),s.addEventListener("squeeze",I),s.addEventListener("squeezestart",I),s.addEventListener("squeezeend",I),s.addEventListener("end",B),s.addEventListener("inputsourceschange",O),b.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(C),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,we=null,Ie=null;b.depth&&(Ie=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=b.stencil?Pn:Zi,we=b.stencil?Us:Di);const Re={colorFormat:t.RGBA8,depthFormat:Ie,scaleFactor:a};f=this.getBinding(),h=f.createProjectionLayer(Re),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new Pi(h.textureWidth,h.textureHeight,{format:yi,type:ni,depthTexture:new ds(h.textureWidth,h.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const te={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,t,te),s.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),v=new Pi(u.framebufferWidth,u.framebufferHeight,{format:yi,type:ni,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),Ce.setContext(s),Ce.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function O(Y){for(let ae=0;ae<Y.removed.length;ae++){const te=Y.removed[ae],we=E.indexOf(te);we>=0&&(E[we]=null,x[we].disconnect(te))}for(let ae=0;ae<Y.added.length;ae++){const te=Y.added[ae];let we=E.indexOf(te);if(we===-1){for(let Re=0;Re<x.length;Re++)if(Re>=E.length){E.push(te),we=Re;break}else if(E[Re]===null){E[Re]=te,we=Re;break}if(we===-1)break}const Ie=x[we];Ie&&Ie.connect(te)}}const K=new V,j=new V;function ee(Y,ae,te){K.setFromMatrixPosition(ae.matrixWorld),j.setFromMatrixPosition(te.matrixWorld);const we=K.distanceTo(j),Ie=ae.projectionMatrix.elements,Re=te.projectionMatrix.elements,nt=Ie[14]/(Ie[10]-1),Oe=Ie[14]/(Ie[10]+1),Ze=(Ie[9]+1)/Ie[5],pt=(Ie[9]-1)/Ie[5],We=(Ie[8]-1)/Ie[0],Pt=(Re[8]+1)/Re[0],yt=nt*We,jt=nt*Pt,k=we/(-We+Pt),It=k*-We;if(ae.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(It),Y.translateZ(k),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Ie[10]===-1)Y.projectionMatrix.copy(ae.projectionMatrix),Y.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{const Ge=nt+k,dt=Oe+k,he=yt-It,vt=jt+(we-It),A=Ze*Oe/dt*Ge,M=pt*Oe/dt*Ge;Y.projectionMatrix.makePerspective(he,vt,A,M,Ge,dt),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ue(Y,ae){ae===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ae.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let ae=Y.near,te=Y.far;m.texture!==null&&(m.depthNear>0&&(ae=m.depthNear),m.depthFar>0&&(te=m.depthFar)),P.near=L.near=w.near=ae,P.far=L.far=w.far=te,(F!==P.near||N!==P.far)&&(s.updateRenderState({depthNear:P.near,depthFar:P.far}),F=P.near,N=P.far),P.layers.mask=Y.layers.mask|6,w.layers.mask=P.layers.mask&-5,L.layers.mask=P.layers.mask&-3;const we=Y.parent,Ie=P.cameras;ue(P,we);for(let Re=0;Re<Ie.length;Re++)ue(Ie[Re],we);Ie.length===2?ee(P,w,L):P.projectionMatrix.copy(w.projectionMatrix),ge(Y,P,we)};function ge(Y,ae,te){te===null?Y.matrix.copy(ae.matrixWorld):(Y.matrix.copy(te.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ae.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ae.projectionMatrix),Y.projectionMatrixInverse.copy(ae.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Xo*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(!(h===null&&u===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(P)},this.getCameraTexture=function(Y){return p[Y]};let De=null;function Xe(Y,ae){if(d=ae.getViewerPose(c||r),g=ae,d!==null){const te=d.views;u!==null&&(e.setRenderTargetFramebuffer(v,u.framebuffer),e.setRenderTarget(v));let we=!1;te.length!==P.cameras.length&&(P.cameras.length=0,we=!0);for(let Oe=0;Oe<te.length;Oe++){const Ze=te[Oe];let pt=null;if(u!==null)pt=u.getViewport(Ze);else{const Pt=f.getViewSubImage(h,Ze);pt=Pt.viewport,Oe===0&&(e.setRenderTargetTextures(v,Pt.colorTexture,Pt.depthStencilTexture),e.setRenderTarget(v))}let We=R[Oe];We===void 0&&(We=new ui,We.layers.enable(Oe),We.viewport=new St,R[Oe]=We),We.matrix.fromArray(Ze.transform.matrix),We.matrix.decompose(We.position,We.quaternion,We.scale),We.projectionMatrix.fromArray(Ze.projectionMatrix),We.projectionMatrixInverse.copy(We.projectionMatrix).invert(),We.viewport.set(pt.x,pt.y,pt.width,pt.height),Oe===0&&(P.matrix.copy(We.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),we===!0&&P.cameras.push(We)}const Ie=s.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){f=i.getBinding();const Oe=f.getDepthInformation(te[0]);Oe&&Oe.isValid&&Oe.texture&&m.init(Oe,s.renderState)}if(Ie&&Ie.includes("camera-access")&&y){e.state.unbindTexture(),f=i.getBinding();for(let Oe=0;Oe<te.length;Oe++){const Ze=te[Oe].camera;if(Ze){let pt=p[Ze];pt||(pt=new Bh,p[Ze]=pt);const We=f.getCameraImage(Ze);pt.sourceTexture=We}}}}for(let te=0;te<x.length;te++){const we=E[te],Ie=x[te];we!==null&&Ie!==void 0&&Ie.update(we,ae,c||r)}De&&De(Y,ae),ae.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ae}),g=null}const Ce=new Wh;Ce.setAnimationLoop(Xe),this.setAnimationLoop=function(Y){De=Y},this.dispose=function(){}}}const xy=new wt,Zh=new Ne;Zh.set(-1,0,0,0,1,0,0,0,1);function vy(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,zh(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,b,_,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?a(m,p):p.isMeshLambertMaterial?(a(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(a(m,p),f(m,p)):p.isMeshPhongMaterial?(a(m,p),d(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(a(m,p),h(m,p),p.isMeshPhysicalMaterial&&u(m,p,v)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),y(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,b,_):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Zt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Zt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const b=e.get(p),_=b.envMap,v=b.envMapRotation;_&&(m.envMap.value=_,m.envMapRotation.value.setFromMatrix4(xy.makeRotationFromEuler(v)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Zh),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,_){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=_*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Zt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){const b=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function _y(n,e,t,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,_){const v=_.program;i.uniformBlockBinding(b,v)}function c(b,_){let v=s[b.id];v===void 0&&(g(b),v=d(b),s[b.id]=v,b.addEventListener("dispose",m));const x=_.program;i.updateUBOMapping(b,x);const E=e.render.frame;a[b.id]!==E&&(h(b),a[b.id]=E)}function d(b){const _=f();b.__bindingPointIndex=_;const v=n.createBuffer(),x=b.__size,E=b.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,x,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,v),v}function f(){for(let b=0;b<o;b++)if(r.indexOf(b)===-1)return r.push(b),b;return Je("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(b){const _=s[b.id],v=b.uniforms,x=b.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let E=0,C=v.length;E<C;E++){const S=Array.isArray(v[E])?v[E]:[v[E]];for(let w=0,L=S.length;w<L;w++){const R=S[w];if(u(R,E,w,x)===!0){const P=R.__offset,F=Array.isArray(R.value)?R.value:[R.value];let N=0;for(let I=0;I<F.length;I++){const B=F[I],O=y(B);typeof B=="number"||typeof B=="boolean"?(R.__data[0]=B,n.bufferSubData(n.UNIFORM_BUFFER,P+N,R.__data)):B.isMatrix3?(R.__data[0]=B.elements[0],R.__data[1]=B.elements[1],R.__data[2]=B.elements[2],R.__data[3]=0,R.__data[4]=B.elements[3],R.__data[5]=B.elements[4],R.__data[6]=B.elements[5],R.__data[7]=0,R.__data[8]=B.elements[6],R.__data[9]=B.elements[7],R.__data[10]=B.elements[8],R.__data[11]=0):ArrayBuffer.isView(B)?R.__data.set(new B.constructor(B.buffer,B.byteOffset,R.__data.length)):(B.toArray(R.__data,N),N+=O.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,P,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(b,_,v,x){const E=b.value,C=_+"_"+v;if(x[C]===void 0)return typeof E=="number"||typeof E=="boolean"?x[C]=E:ArrayBuffer.isView(E)?x[C]=E.slice():x[C]=E.clone(),!0;{const S=x[C];if(typeof E=="number"||typeof E=="boolean"){if(S!==E)return x[C]=E,!0}else{if(ArrayBuffer.isView(E))return!0;if(S.equals(E)===!1)return S.copy(E),!0}}return!1}function g(b){const _=b.uniforms;let v=0;const x=16;for(let C=0,S=_.length;C<S;C++){const w=Array.isArray(_[C])?_[C]:[_[C]];for(let L=0,R=w.length;L<R;L++){const P=w[L],F=Array.isArray(P.value)?P.value:[P.value];for(let N=0,I=F.length;N<I;N++){const B=F[N],O=y(B),K=v%x,j=K%O.boundary,ee=K+j;v+=j,ee!==0&&x-ee<O.storage&&(v+=x-ee),P.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=v,v+=O.storage}}}const E=v%x;return E>0&&(v+=x-E),b.__size=v,b.__cache={},this}function y(b){const _={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(_.boundary=4,_.storage=4):b.isVector2?(_.boundary=8,_.storage=8):b.isVector3||b.isColor?(_.boundary=16,_.storage=12):b.isVector4?(_.boundary=16,_.storage=16):b.isMatrix3?(_.boundary=48,_.storage=48):b.isMatrix4?(_.boundary=64,_.storage=64):b.isTexture?Pe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(b)?(_.boundary=16,_.storage=b.byteLength):Pe("WebGLRenderer: Unsupported uniform value type.",b),_}function m(b){const _=b.target;_.removeEventListener("dispose",m);const v=r.indexOf(_.__bindingPointIndex);r.splice(v,1),n.deleteBuffer(s[_.id]),delete s[_.id],delete a[_.id]}function p(){for(const b in s)n.deleteBuffer(s[b]);r=[],s={},a={}}return{bind:l,update:c,dispose:p}}const Sy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ei=null;function My(){return Ei===null&&(Ei=new du(Sy,16,16,Fn,Ki),Ei.name="DFG_LUT",Ei.minFilter=Wt,Ei.magFilter=Wt,Ei.wrapS=Xi,Ei.wrapT=Xi,Ei.generateMipmaps=!1,Ei.needsUpdate=!0),Ei}class by{constructor(e={}){const{canvas:t=Vf(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:u=ni}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=r;const y=u,m=new Set([cl,ll,ol]),p=new Set([ni,Di,ks,Us,al,rl]),b=new Uint32Array(4),_=new Int32Array(4),v=new V;let x=null,E=null;const C=[],S=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ci,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let R=!1,P=null;this._outputColorSpace=ri;let F=0,N=0,I=null,B=-1,O=null;const K=new St,j=new St;let ee=null;const ue=new it(0);let ge=0,De=t.width,Xe=t.height,Ce=1,Y=null,ae=null;const te=new St(0,0,De,Xe),we=new St(0,0,De,Xe);let Ie=!1;const Re=new pl;let nt=!1,Oe=!1;const Ze=new wt,pt=new V,We=new St,Pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let yt=!1;function jt(){return I===null?Ce:1}let k=i;function It(T,U){return t.getContext(T,U)}try{const T={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${nl}`),t.addEventListener("webglcontextlost",J,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",ke,!1),k===null){const U="webgl2";if(k=It(U,T),k===null)throw It(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw Je("WebGLRenderer: "+T.message),T}let Ge,dt,he,vt,A,M,z,$,Q,ie,le,X,Z,me,_e,re,ne,Le,Be,Qe,D,se,q;function ye(){Ge=new M0(k),Ge.init(),D=new uy(k,Ge),dt=new p0(k,Ge,e,D),he=new dy(k,Ge),dt.reversedDepthBuffer&&h&&he.buffers.depth.setReversed(!0),vt=new T0(k),A=new jg,M=new fy(k,Ge,he,A,dt,D,vt),z=new S0(L),$=new Cu(k),se=new f0(k,$),Q=new b0(k,$,vt,se),ie=new A0(k,Q,$,se,vt),Le=new w0(k,dt,M),_e=new m0(A),le=new Zg(L,z,Ge,dt,se,_e),X=new vy(L,A),Z=new Qg,me=new ay(Ge),ne=new d0(L,z,he,ie,g,l),re=new hy(L,ie,dt),q=new _y(k,vt,dt,he),Be=new u0(k,Ge,vt),Qe=new E0(k,Ge,vt),vt.programs=le.programs,L.capabilities=dt,L.extensions=Ge,L.properties=A,L.renderLists=Z,L.shadowMap=re,L.state=he,L.info=vt}ye(),y!==ni&&(w=new C0(y,t.width,t.height,s,a));const oe=new yy(L,k);this.xr=oe,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const T=Ge.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Ge.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Ce},this.setPixelRatio=function(T){T!==void 0&&(Ce=T,this.setSize(De,Xe,!1))},this.getSize=function(T){return T.set(De,Xe)},this.setSize=function(T,U,G=!0){if(oe.isPresenting){Pe("WebGLRenderer: Can't change size while VR device is presenting.");return}De=T,Xe=U,t.width=Math.floor(T*Ce),t.height=Math.floor(U*Ce),G===!0&&(t.style.width=T+"px",t.style.height=U+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,T,U)},this.getDrawingBufferSize=function(T){return T.set(De*Ce,Xe*Ce).floor()},this.setDrawingBufferSize=function(T,U,G){De=T,Xe=U,Ce=G,t.width=Math.floor(T*G),t.height=Math.floor(U*G),this.setViewport(0,0,T,U)},this.setEffects=function(T){if(y===ni){Je("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let U=0;U<T.length;U++)if(T[U].isOutputPass===!0){Pe("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(K)},this.getViewport=function(T){return T.copy(te)},this.setViewport=function(T,U,G,H){T.isVector4?te.set(T.x,T.y,T.z,T.w):te.set(T,U,G,H),he.viewport(K.copy(te).multiplyScalar(Ce).round())},this.getScissor=function(T){return T.copy(we)},this.setScissor=function(T,U,G,H){T.isVector4?we.set(T.x,T.y,T.z,T.w):we.set(T,U,G,H),he.scissor(j.copy(we).multiplyScalar(Ce).round())},this.getScissorTest=function(){return Ie},this.setScissorTest=function(T){he.setScissorTest(Ie=T)},this.setOpaqueSort=function(T){Y=T},this.setTransparentSort=function(T){ae=T},this.getClearColor=function(T){return T.copy(ne.getClearColor())},this.setClearColor=function(){ne.setClearColor(...arguments)},this.getClearAlpha=function(){return ne.getClearAlpha()},this.setClearAlpha=function(){ne.setClearAlpha(...arguments)},this.clear=function(T=!0,U=!0,G=!0){let H=0;if(T){let W=!1;if(I!==null){const pe=I.texture.format;W=m.has(pe)}if(W){const pe=I.texture.type,Se=p.has(pe),fe=ne.getClearColor(),Me=ne.getClearAlpha(),Te=fe.r,Ue=fe.g,Ve=fe.b;Se?(b[0]=Te,b[1]=Ue,b[2]=Ve,b[3]=Me,k.clearBufferuiv(k.COLOR,0,b)):(_[0]=Te,_[1]=Ue,_[2]=Ve,_[3]=Me,k.clearBufferiv(k.COLOR,0,_))}else H|=k.COLOR_BUFFER_BIT}U&&(H|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),G&&(H|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&k.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),P=T},this.dispose=function(){t.removeEventListener("webglcontextlost",J,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",ke,!1),ne.dispose(),Z.dispose(),me.dispose(),A.dispose(),z.dispose(),ie.dispose(),se.dispose(),q.dispose(),le.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",Bl),oe.removeEventListener("sessionend",zl),vn.stop()};function J(T){T.preventDefault(),ac("WebGLRenderer: Context Lost."),R=!0}function Ee(){ac("WebGLRenderer: Context Restored."),R=!1;const T=vt.autoReset,U=re.enabled,G=re.autoUpdate,H=re.needsUpdate,W=re.type;ye(),vt.autoReset=T,re.enabled=U,re.autoUpdate=G,re.needsUpdate=H,re.type=W}function ke(T){Je("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Mt(T){const U=T.target;U.removeEventListener("dispose",Mt),rt(U)}function rt(T){ki(T),A.remove(T)}function ki(T){const U=A.get(T).programs;U!==void 0&&(U.forEach(function(G){le.releaseProgram(G)}),T.isShaderMaterial&&le.releaseShaderCache(T))}this.renderBufferDirect=function(T,U,G,H,W,pe){U===null&&(U=Pt);const Se=W.isMesh&&W.matrixWorld.determinant()<0,fe=ld(T,U,G,H,W);he.setMaterial(H,Se);let Me=G.index,Te=1;if(H.wireframe===!0){if(Me=Q.getWireframeAttribute(G),Me===void 0)return;Te=2}const Ue=G.drawRange,Ve=G.attributes.position;let Ae=Ue.start*Te,ot=(Ue.start+Ue.count)*Te;pe!==null&&(Ae=Math.max(Ae,pe.start*Te),ot=Math.min(ot,(pe.start+pe.count)*Te)),Me!==null?(Ae=Math.max(Ae,0),ot=Math.min(ot,Me.count)):Ve!=null&&(Ae=Math.max(Ae,0),ot=Math.min(ot,Ve.count));const bt=ot-Ae;if(bt<0||bt===1/0)return;se.setup(W,H,fe,G,Me);let _t,lt=Be;if(Me!==null&&(_t=$.get(Me),lt=Qe,lt.setIndex(_t)),W.isMesh)H.wireframe===!0?(he.setLineWidth(H.wireframeLinewidth*jt()),lt.setMode(k.LINES)):lt.setMode(k.TRIANGLES);else if(W.isLine){let zt=H.linewidth;zt===void 0&&(zt=1),he.setLineWidth(zt*jt()),W.isLineSegments?lt.setMode(k.LINES):W.isLineLoop?lt.setMode(k.LINE_LOOP):lt.setMode(k.LINE_STRIP)}else W.isPoints?lt.setMode(k.POINTS):W.isSprite&&lt.setMode(k.TRIANGLES);if(W.isBatchedMesh)if(Ge.get("WEBGL_multi_draw"))lt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const zt=W._multiDrawStarts,xe=W._multiDrawCounts,Jt=W._multiDrawCount,je=Me?$.get(Me).bytesPerElement:1,si=A.get(H).currentProgram.getUniforms();for(let Mi=0;Mi<Jt;Mi++)si.setValue(k,"_gl_DrawID",Mi),lt.render(zt[Mi]/je,xe[Mi])}else if(W.isInstancedMesh)lt.renderInstances(Ae,bt,W.count);else if(G.isInstancedBufferGeometry){const zt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,xe=Math.min(G.instanceCount,zt);lt.renderInstances(Ae,bt,xe)}else lt.render(Ae,bt)};function Si(T,U,G){T.transparent===!0&&T.side===Gi&&T.forceSinglePass===!1?(T.side=Zt,T.needsUpdate=!0,Ws(T,U,G),T.side=gn,T.needsUpdate=!0,Ws(T,U,G),T.side=Gi):Ws(T,U,G)}this.compile=function(T,U,G=null){G===null&&(G=T),E=me.get(G),E.init(U),S.push(E),G.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(E.pushLight(W),W.castShadow&&E.pushShadow(W))}),T!==G&&T.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(E.pushLight(W),W.castShadow&&E.pushShadow(W))}),E.setupLights();const H=new Set;return T.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const pe=W.material;if(pe)if(Array.isArray(pe))for(let Se=0;Se<pe.length;Se++){const fe=pe[Se];Si(fe,G,W),H.add(fe)}else Si(pe,G,W),H.add(pe)}),E=S.pop(),H},this.compileAsync=function(T,U,G=null){const H=this.compile(T,U,G);return new Promise(W=>{function pe(){if(H.forEach(function(Se){A.get(Se).currentProgram.isReady()&&H.delete(Se)}),H.size===0){W(T);return}setTimeout(pe,10)}Ge.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let sr=null;function rd(T){sr&&sr(T)}function Bl(){vn.stop()}function zl(){vn.start()}const vn=new Wh;vn.setAnimationLoop(rd),typeof self<"u"&&vn.setContext(self),this.setAnimationLoop=function(T){sr=T,oe.setAnimationLoop(T),T===null?vn.stop():vn.start()},oe.addEventListener("sessionstart",Bl),oe.addEventListener("sessionend",zl),this.render=function(T,U){if(U!==void 0&&U.isCamera!==!0){Je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;P!==null&&P.renderStart(T,U);const G=oe.enabled===!0&&oe.isPresenting===!0,H=w!==null&&(I===null||G)&&w.begin(L,I);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(U),U=oe.getCamera()),T.isScene===!0&&T.onBeforeRender(L,T,U,I),E=me.get(T,S.length),E.init(U),E.state.textureUnits=M.getTextureUnits(),S.push(E),Ze.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Re.setFromProjectionMatrix(Ze,Ai,U.reversedDepth),Oe=this.localClippingEnabled,nt=_e.init(this.clippingPlanes,Oe),x=Z.get(T,C.length),x.init(),C.push(x),oe.enabled===!0&&oe.isPresenting===!0){const Se=L.xr.getDepthSensingMesh();Se!==null&&ar(Se,U,-1/0,L.sortObjects)}ar(T,U,0,L.sortObjects),x.finish(),L.sortObjects===!0&&x.sort(Y,ae),yt=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,yt&&ne.addToRenderList(x,T),this.info.render.frame++,nt===!0&&_e.beginShadows();const W=E.state.shadowsArray;if(re.render(W,T,U),nt===!0&&_e.endShadows(),this.info.autoReset===!0&&this.info.reset(),(H&&w.hasRenderPass())===!1){const Se=x.opaque,fe=x.transmissive;if(E.setupLights(),U.isArrayCamera){const Me=U.cameras;if(fe.length>0)for(let Te=0,Ue=Me.length;Te<Ue;Te++){const Ve=Me[Te];Hl(Se,fe,T,Ve)}yt&&ne.render(T);for(let Te=0,Ue=Me.length;Te<Ue;Te++){const Ve=Me[Te];Vl(x,T,Ve,Ve.viewport)}}else fe.length>0&&Hl(Se,fe,T,U),yt&&ne.render(T),Vl(x,T,U)}I!==null&&N===0&&(M.updateMultisampleRenderTarget(I),M.updateRenderTargetMipmap(I)),H&&w.end(L),T.isScene===!0&&T.onAfterRender(L,T,U),se.resetDefaultState(),B=-1,O=null,S.pop(),S.length>0?(E=S[S.length-1],M.setTextureUnits(E.state.textureUnits),nt===!0&&_e.setGlobalState(L.clippingPlanes,E.state.camera)):E=null,C.pop(),C.length>0?x=C[C.length-1]:x=null,P!==null&&P.renderEnd()};function ar(T,U,G,H){if(T.visible===!1)return;if(T.layers.test(U.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(U);else if(T.isLightProbeGrid)E.pushLightProbeGrid(T);else if(T.isLight)E.pushLight(T),T.castShadow&&E.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Re.intersectsSprite(T)){H&&We.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Ze);const Se=ie.update(T),fe=T.material;fe.visible&&x.push(T,Se,fe,G,We.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Re.intersectsObject(T))){const Se=ie.update(T),fe=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),We.copy(T.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),We.copy(Se.boundingSphere.center)),We.applyMatrix4(T.matrixWorld).applyMatrix4(Ze)),Array.isArray(fe)){const Me=Se.groups;for(let Te=0,Ue=Me.length;Te<Ue;Te++){const Ve=Me[Te],Ae=fe[Ve.materialIndex];Ae&&Ae.visible&&x.push(T,Se,Ae,G,We.z,Ve)}}else fe.visible&&x.push(T,Se,fe,G,We.z,null)}}const pe=T.children;for(let Se=0,fe=pe.length;Se<fe;Se++)ar(pe[Se],U,G,H)}function Vl(T,U,G,H){const{opaque:W,transmissive:pe,transparent:Se}=T;E.setupLightsView(G),nt===!0&&_e.setGlobalState(L.clippingPlanes,G),H&&he.viewport(K.copy(H)),W.length>0&&Hs(W,U,G),pe.length>0&&Hs(pe,U,G),Se.length>0&&Hs(Se,U,G),he.buffers.depth.setTest(!0),he.buffers.depth.setMask(!0),he.buffers.color.setMask(!0),he.setPolygonOffset(!1)}function Hl(T,U,G,H){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[H.id]===void 0){const Ae=Ge.has("EXT_color_buffer_half_float")||Ge.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[H.id]=new Pi(1,1,{generateMipmaps:!0,type:Ae?Ki:ni,minFilter:Cn,samples:Math.max(4,dt.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ye.workingColorSpace})}const pe=E.state.transmissionRenderTarget[H.id],Se=H.viewport||K;pe.setSize(Se.z*L.transmissionResolutionScale,Se.w*L.transmissionResolutionScale);const fe=L.getRenderTarget(),Me=L.getActiveCubeFace(),Te=L.getActiveMipmapLevel();L.setRenderTarget(pe),L.getClearColor(ue),ge=L.getClearAlpha(),ge<1&&L.setClearColor(16777215,.5),L.clear(),yt&&ne.render(G);const Ue=L.toneMapping;L.toneMapping=Ci;const Ve=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),E.setupLightsView(H),nt===!0&&_e.setGlobalState(L.clippingPlanes,H),Hs(T,G,H),M.updateMultisampleRenderTarget(pe),M.updateRenderTargetMipmap(pe),Ge.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let ot=0,bt=U.length;ot<bt;ot++){const _t=U[ot],{object:lt,geometry:zt,material:xe,group:Jt}=_t;if(xe.side===Gi&&lt.layers.test(H.layers)){const je=xe.side;xe.side=Zt,xe.needsUpdate=!0,Wl(lt,G,H,zt,xe,Jt),xe.side=je,xe.needsUpdate=!0,Ae=!0}}Ae===!0&&(M.updateMultisampleRenderTarget(pe),M.updateRenderTargetMipmap(pe))}L.setRenderTarget(fe,Me,Te),L.setClearColor(ue,ge),Ve!==void 0&&(H.viewport=Ve),L.toneMapping=Ue}function Hs(T,U,G){const H=U.isScene===!0?U.overrideMaterial:null;for(let W=0,pe=T.length;W<pe;W++){const Se=T[W],{object:fe,geometry:Me,group:Te}=Se;let Ue=Se.material;Ue.allowOverride===!0&&H!==null&&(Ue=H),fe.layers.test(G.layers)&&Wl(fe,U,G,Me,Ue,Te)}}function Wl(T,U,G,H,W,pe){T.onBeforeRender(L,U,G,H,W,pe),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),W.onBeforeRender(L,U,G,H,T,pe),W.transparent===!0&&W.side===Gi&&W.forceSinglePass===!1?(W.side=Zt,W.needsUpdate=!0,L.renderBufferDirect(G,U,H,W,T,pe),W.side=gn,W.needsUpdate=!0,L.renderBufferDirect(G,U,H,W,T,pe),W.side=Gi):L.renderBufferDirect(G,U,H,W,T,pe),T.onAfterRender(L,U,G,H,W,pe)}function Ws(T,U,G){U.isScene!==!0&&(U=Pt);const H=A.get(T),W=E.state.lights,pe=E.state.shadowsArray,Se=W.state.version,fe=le.getParameters(T,W.state,pe,U,G,E.state.lightProbeGridArray),Me=le.getProgramCacheKey(fe);let Te=H.programs;H.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?U.environment:null,H.fog=U.fog;const Ue=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;H.envMap=z.get(T.envMap||H.environment,Ue),H.envMapRotation=H.environment!==null&&T.envMap===null?U.environmentRotation:T.envMapRotation,Te===void 0&&(T.addEventListener("dispose",Mt),Te=new Map,H.programs=Te);let Ve=Te.get(Me);if(Ve!==void 0){if(H.currentProgram===Ve&&H.lightsStateVersion===Se)return Xl(T,fe),Ve}else fe.uniforms=le.getUniforms(T),P!==null&&T.isNodeMaterial&&P.build(T,G,fe),T.onBeforeCompile(fe,L),Ve=le.acquireProgram(fe,Me),Te.set(Me,Ve),H.uniforms=fe.uniforms;const Ae=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ae.clippingPlanes=_e.uniform),Xl(T,fe),H.needsLights=hd(T),H.lightsStateVersion=Se,H.needsLights&&(Ae.ambientLightColor.value=W.state.ambient,Ae.lightProbe.value=W.state.probe,Ae.directionalLights.value=W.state.directional,Ae.directionalLightShadows.value=W.state.directionalShadow,Ae.spotLights.value=W.state.spot,Ae.spotLightShadows.value=W.state.spotShadow,Ae.rectAreaLights.value=W.state.rectArea,Ae.ltc_1.value=W.state.rectAreaLTC1,Ae.ltc_2.value=W.state.rectAreaLTC2,Ae.pointLights.value=W.state.point,Ae.pointLightShadows.value=W.state.pointShadow,Ae.hemisphereLights.value=W.state.hemi,Ae.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Ae.spotLightMatrix.value=W.state.spotLightMatrix,Ae.spotLightMap.value=W.state.spotLightMap,Ae.pointShadowMatrix.value=W.state.pointShadowMatrix),H.lightProbeGrid=E.state.lightProbeGridArray.length>0,H.currentProgram=Ve,H.uniformsList=null,Ve}function Gl(T){if(T.uniformsList===null){const U=T.currentProgram.getUniforms();T.uniformsList=Da.seqWithValue(U.seq,T.uniforms)}return T.uniformsList}function Xl(T,U){const G=A.get(T);G.outputColorSpace=U.outputColorSpace,G.batching=U.batching,G.batchingColor=U.batchingColor,G.instancing=U.instancing,G.instancingColor=U.instancingColor,G.instancingMorph=U.instancingMorph,G.skinning=U.skinning,G.morphTargets=U.morphTargets,G.morphNormals=U.morphNormals,G.morphColors=U.morphColors,G.morphTargetsCount=U.morphTargetsCount,G.numClippingPlanes=U.numClippingPlanes,G.numIntersection=U.numClipIntersection,G.vertexAlphas=U.vertexAlphas,G.vertexTangents=U.vertexTangents,G.toneMapping=U.toneMapping}function od(T,U){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;v.setFromMatrixPosition(U.matrixWorld);for(let G=0,H=T.length;G<H;G++){const W=T[G];if(W.texture!==null&&W.boundingBox.containsPoint(v))return W}return null}function ld(T,U,G,H,W){U.isScene!==!0&&(U=Pt),M.resetTextureUnits();const pe=U.fog,Se=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?U.environment:null,fe=I===null?L.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Ye.workingColorSpace,Me=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Te=z.get(H.envMap||Se,Me),Ue=H.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ve=!!G.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ae=!!G.morphAttributes.position,ot=!!G.morphAttributes.normal,bt=!!G.morphAttributes.color;let _t=Ci;H.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(_t=L.toneMapping);const lt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,zt=lt!==void 0?lt.length:0,xe=A.get(H),Jt=E.state.lights;if(nt===!0&&(Oe===!0||T!==O)){const ft=T===O&&H.id===B;_e.setState(H,T,ft)}let je=!1;H.version===xe.__version?(xe.needsLights&&xe.lightsStateVersion!==Jt.state.version||xe.outputColorSpace!==fe||W.isBatchedMesh&&xe.batching===!1||!W.isBatchedMesh&&xe.batching===!0||W.isBatchedMesh&&xe.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&xe.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&xe.instancing===!1||!W.isInstancedMesh&&xe.instancing===!0||W.isSkinnedMesh&&xe.skinning===!1||!W.isSkinnedMesh&&xe.skinning===!0||W.isInstancedMesh&&xe.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&xe.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&xe.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&xe.instancingMorph===!1&&W.morphTexture!==null||xe.envMap!==Te||H.fog===!0&&xe.fog!==pe||xe.numClippingPlanes!==void 0&&(xe.numClippingPlanes!==_e.numPlanes||xe.numIntersection!==_e.numIntersection)||xe.vertexAlphas!==Ue||xe.vertexTangents!==Ve||xe.morphTargets!==Ae||xe.morphNormals!==ot||xe.morphColors!==bt||xe.toneMapping!==_t||xe.morphTargetsCount!==zt||!!xe.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(je=!0):(je=!0,xe.__version=H.version);let si=xe.currentProgram;je===!0&&(si=Ws(H,U,W),P&&H.isNodeMaterial&&P.onUpdateProgram(H,si,xe));let Mi=!1,ji=!1,zn=!1;const ct=si.getUniforms(),Et=xe.uniforms;if(he.useProgram(si.program)&&(Mi=!0,ji=!0,zn=!0),H.id!==B&&(B=H.id,ji=!0),xe.needsLights){const ft=od(E.state.lightProbeGridArray,W);xe.lightProbeGrid!==ft&&(xe.lightProbeGrid=ft,ji=!0)}if(Mi||O!==T){he.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),ct.setValue(k,"projectionMatrix",T.projectionMatrix),ct.setValue(k,"viewMatrix",T.matrixWorldInverse);const Qi=ct.map.cameraPosition;Qi!==void 0&&Qi.setValue(k,pt.setFromMatrixPosition(T.matrixWorld)),dt.logarithmicDepthBuffer&&ct.setValue(k,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ct.setValue(k,"isOrthographic",T.isOrthographicCamera===!0),O!==T&&(O=T,ji=!0,zn=!0)}if(xe.needsLights&&(Jt.state.directionalShadowMap.length>0&&ct.setValue(k,"directionalShadowMap",Jt.state.directionalShadowMap,M),Jt.state.spotShadowMap.length>0&&ct.setValue(k,"spotShadowMap",Jt.state.spotShadowMap,M),Jt.state.pointShadowMap.length>0&&ct.setValue(k,"pointShadowMap",Jt.state.pointShadowMap,M)),W.isSkinnedMesh){ct.setOptional(k,W,"bindMatrix"),ct.setOptional(k,W,"bindMatrixInverse");const ft=W.skeleton;ft&&(ft.boneTexture===null&&ft.computeBoneTexture(),ct.setValue(k,"boneTexture",ft.boneTexture,M))}W.isBatchedMesh&&(ct.setOptional(k,W,"batchingTexture"),ct.setValue(k,"batchingTexture",W._matricesTexture,M),ct.setOptional(k,W,"batchingIdTexture"),ct.setValue(k,"batchingIdTexture",W._indirectTexture,M),ct.setOptional(k,W,"batchingColorTexture"),W._colorsTexture!==null&&ct.setValue(k,"batchingColorTexture",W._colorsTexture,M));const Ji=G.morphAttributes;if((Ji.position!==void 0||Ji.normal!==void 0||Ji.color!==void 0)&&Le.update(W,G,si),(ji||xe.receiveShadow!==W.receiveShadow)&&(xe.receiveShadow=W.receiveShadow,ct.setValue(k,"receiveShadow",W.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&U.environment!==null&&(Et.envMapIntensity.value=U.environmentIntensity),Et.dfgLUT!==void 0&&(Et.dfgLUT.value=My()),ji){if(ct.setValue(k,"toneMappingExposure",L.toneMappingExposure),xe.needsLights&&cd(Et,zn),pe&&H.fog===!0&&X.refreshFogUniforms(Et,pe),X.refreshMaterialUniforms(Et,H,Ce,Xe,E.state.transmissionRenderTarget[T.id]),xe.needsLights&&xe.lightProbeGrid){const ft=xe.lightProbeGrid;Et.probesSH.value=ft.texture,Et.probesMin.value.copy(ft.boundingBox.min),Et.probesMax.value.copy(ft.boundingBox.max),Et.probesResolution.value.copy(ft.resolution)}Da.upload(k,Gl(xe),Et,M)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Da.upload(k,Gl(xe),Et,M),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ct.setValue(k,"center",W.center),ct.setValue(k,"modelViewMatrix",W.modelViewMatrix),ct.setValue(k,"normalMatrix",W.normalMatrix),ct.setValue(k,"modelMatrix",W.matrixWorld),H.uniformsGroups!==void 0){const ft=H.uniformsGroups;for(let Qi=0,Vn=ft.length;Qi<Vn;Qi++){const ql=ft[Qi];q.update(ql,si),q.bind(ql,si)}}return si}function cd(T,U){T.ambientLightColor.needsUpdate=U,T.lightProbe.needsUpdate=U,T.directionalLights.needsUpdate=U,T.directionalLightShadows.needsUpdate=U,T.pointLights.needsUpdate=U,T.pointLightShadows.needsUpdate=U,T.spotLights.needsUpdate=U,T.spotLightShadows.needsUpdate=U,T.rectAreaLights.needsUpdate=U,T.hemisphereLights.needsUpdate=U}function hd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return N},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(T,U,G){const H=A.get(T);H.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),A.get(T.texture).__webglTexture=U,A.get(T.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:G,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,U){const G=A.get(T);G.__webglFramebuffer=U,G.__useDefaultFramebuffer=U===void 0};const dd=k.createFramebuffer();this.setRenderTarget=function(T,U=0,G=0){I=T,F=U,N=G;let H=null,W=!1,pe=!1;if(T){const fe=A.get(T);if(fe.__useDefaultFramebuffer!==void 0){he.bindFramebuffer(k.FRAMEBUFFER,fe.__webglFramebuffer),K.copy(T.viewport),j.copy(T.scissor),ee=T.scissorTest,he.viewport(K),he.scissor(j),he.setScissorTest(ee),B=-1;return}else if(fe.__webglFramebuffer===void 0)M.setupRenderTarget(T);else if(fe.__hasExternalTextures)M.rebindTextures(T,A.get(T.texture).__webglTexture,A.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ue=T.depthTexture;if(fe.__boundDepthTexture!==Ue){if(Ue!==null&&A.has(Ue)&&(T.width!==Ue.image.width||T.height!==Ue.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");M.setupDepthRenderbuffer(T)}}const Me=T.texture;(Me.isData3DTexture||Me.isDataArrayTexture||Me.isCompressedArrayTexture)&&(pe=!0);const Te=A.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Te[U])?H=Te[U][G]:H=Te[U],W=!0):T.samples>0&&M.useMultisampledRTT(T)===!1?H=A.get(T).__webglMultisampledFramebuffer:Array.isArray(Te)?H=Te[G]:H=Te,K.copy(T.viewport),j.copy(T.scissor),ee=T.scissorTest}else K.copy(te).multiplyScalar(Ce).floor(),j.copy(we).multiplyScalar(Ce).floor(),ee=Ie;if(G!==0&&(H=dd),he.bindFramebuffer(k.FRAMEBUFFER,H)&&he.drawBuffers(T,H),he.viewport(K),he.scissor(j),he.setScissorTest(ee),W){const fe=A.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+U,fe.__webglTexture,G)}else if(pe){const fe=U;for(let Me=0;Me<T.textures.length;Me++){const Te=A.get(T.textures[Me]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+Me,Te.__webglTexture,G,fe)}}else if(T!==null&&G!==0){const fe=A.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,fe.__webglTexture,G)}B=-1},this.readRenderTargetPixels=function(T,U,G,H,W,pe,Se,fe=0){if(!(T&&T.isWebGLRenderTarget)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=A.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Se!==void 0&&(Me=Me[Se]),Me){he.bindFramebuffer(k.FRAMEBUFFER,Me);try{const Te=T.textures[fe],Ue=Te.format,Ve=Te.type;if(T.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+fe),!dt.textureFormatReadable(Ue)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!dt.textureTypeReadable(Ve)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=T.width-H&&G>=0&&G<=T.height-W&&k.readPixels(U,G,H,W,D.convert(Ue),D.convert(Ve),pe)}finally{const Te=I!==null?A.get(I).__webglFramebuffer:null;he.bindFramebuffer(k.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(T,U,G,H,W,pe,Se,fe=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=A.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Se!==void 0&&(Me=Me[Se]),Me)if(U>=0&&U<=T.width-H&&G>=0&&G<=T.height-W){he.bindFramebuffer(k.FRAMEBUFFER,Me);const Te=T.textures[fe],Ue=Te.format,Ve=Te.type;if(T.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+fe),!dt.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!dt.textureTypeReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ae=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Ae),k.bufferData(k.PIXEL_PACK_BUFFER,pe.byteLength,k.STREAM_READ),k.readPixels(U,G,H,W,D.convert(Ue),D.convert(Ve),0);const ot=I!==null?A.get(I).__webglFramebuffer:null;he.bindFramebuffer(k.FRAMEBUFFER,ot);const bt=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await Hf(k,bt,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Ae),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,pe),k.deleteBuffer(Ae),k.deleteSync(bt),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,U=null,G=0){const H=Math.pow(2,-G),W=Math.floor(T.image.width*H),pe=Math.floor(T.image.height*H),Se=U!==null?U.x:0,fe=U!==null?U.y:0;M.setTexture2D(T,0),k.copyTexSubImage2D(k.TEXTURE_2D,G,0,0,Se,fe,W,pe),he.unbindTexture()};const fd=k.createFramebuffer(),ud=k.createFramebuffer();this.copyTextureToTexture=function(T,U,G=null,H=null,W=0,pe=0){let Se,fe,Me,Te,Ue,Ve,Ae,ot,bt;const _t=T.isCompressedTexture?T.mipmaps[pe]:T.image;if(G!==null)Se=G.max.x-G.min.x,fe=G.max.y-G.min.y,Me=G.isBox3?G.max.z-G.min.z:1,Te=G.min.x,Ue=G.min.y,Ve=G.isBox3?G.min.z:0;else{const Et=Math.pow(2,-W);Se=Math.floor(_t.width*Et),fe=Math.floor(_t.height*Et),T.isDataArrayTexture?Me=_t.depth:T.isData3DTexture?Me=Math.floor(_t.depth*Et):Me=1,Te=0,Ue=0,Ve=0}H!==null?(Ae=H.x,ot=H.y,bt=H.z):(Ae=0,ot=0,bt=0);const lt=D.convert(U.format),zt=D.convert(U.type);let xe;U.isData3DTexture?(M.setTexture3D(U,0),xe=k.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(M.setTexture2DArray(U,0),xe=k.TEXTURE_2D_ARRAY):(M.setTexture2D(U,0),xe=k.TEXTURE_2D),he.activeTexture(k.TEXTURE0),he.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,U.flipY),he.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),he.pixelStorei(k.UNPACK_ALIGNMENT,U.unpackAlignment);const Jt=he.getParameter(k.UNPACK_ROW_LENGTH),je=he.getParameter(k.UNPACK_IMAGE_HEIGHT),si=he.getParameter(k.UNPACK_SKIP_PIXELS),Mi=he.getParameter(k.UNPACK_SKIP_ROWS),ji=he.getParameter(k.UNPACK_SKIP_IMAGES);he.pixelStorei(k.UNPACK_ROW_LENGTH,_t.width),he.pixelStorei(k.UNPACK_IMAGE_HEIGHT,_t.height),he.pixelStorei(k.UNPACK_SKIP_PIXELS,Te),he.pixelStorei(k.UNPACK_SKIP_ROWS,Ue),he.pixelStorei(k.UNPACK_SKIP_IMAGES,Ve);const zn=T.isDataArrayTexture||T.isData3DTexture,ct=U.isDataArrayTexture||U.isData3DTexture;if(T.isDepthTexture){const Et=A.get(T),Ji=A.get(U),ft=A.get(Et.__renderTarget),Qi=A.get(Ji.__renderTarget);he.bindFramebuffer(k.READ_FRAMEBUFFER,ft.__webglFramebuffer),he.bindFramebuffer(k.DRAW_FRAMEBUFFER,Qi.__webglFramebuffer);for(let Vn=0;Vn<Me;Vn++)zn&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,A.get(T).__webglTexture,W,Ve+Vn),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,A.get(U).__webglTexture,pe,bt+Vn)),k.blitFramebuffer(Te,Ue,Se,fe,Ae,ot,Se,fe,k.DEPTH_BUFFER_BIT,k.NEAREST);he.bindFramebuffer(k.READ_FRAMEBUFFER,null),he.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(W!==0||T.isRenderTargetTexture||A.has(T)){const Et=A.get(T),Ji=A.get(U);he.bindFramebuffer(k.READ_FRAMEBUFFER,fd),he.bindFramebuffer(k.DRAW_FRAMEBUFFER,ud);for(let ft=0;ft<Me;ft++)zn?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Et.__webglTexture,W,Ve+ft):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Et.__webglTexture,W),ct?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ji.__webglTexture,pe,bt+ft):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Ji.__webglTexture,pe),W!==0?k.blitFramebuffer(Te,Ue,Se,fe,Ae,ot,Se,fe,k.COLOR_BUFFER_BIT,k.NEAREST):ct?k.copyTexSubImage3D(xe,pe,Ae,ot,bt+ft,Te,Ue,Se,fe):k.copyTexSubImage2D(xe,pe,Ae,ot,Te,Ue,Se,fe);he.bindFramebuffer(k.READ_FRAMEBUFFER,null),he.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ct?T.isDataTexture||T.isData3DTexture?k.texSubImage3D(xe,pe,Ae,ot,bt,Se,fe,Me,lt,zt,_t.data):U.isCompressedArrayTexture?k.compressedTexSubImage3D(xe,pe,Ae,ot,bt,Se,fe,Me,lt,_t.data):k.texSubImage3D(xe,pe,Ae,ot,bt,Se,fe,Me,lt,zt,_t):T.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,pe,Ae,ot,Se,fe,lt,zt,_t.data):T.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,pe,Ae,ot,_t.width,_t.height,lt,_t.data):k.texSubImage2D(k.TEXTURE_2D,pe,Ae,ot,Se,fe,lt,zt,_t);he.pixelStorei(k.UNPACK_ROW_LENGTH,Jt),he.pixelStorei(k.UNPACK_IMAGE_HEIGHT,je),he.pixelStorei(k.UNPACK_SKIP_PIXELS,si),he.pixelStorei(k.UNPACK_SKIP_ROWS,Mi),he.pixelStorei(k.UNPACK_SKIP_IMAGES,ji),pe===0&&U.generateMipmaps&&k.generateMipmap(xe),he.unbindTexture()},this.initRenderTarget=function(T){A.get(T).__webglFramebuffer===void 0&&M.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?M.setTextureCube(T,0):T.isData3DTexture?M.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?M.setTexture2DArray(T,0):M.setTexture2D(T,0),he.unbindTexture()},this.resetState=function(){F=0,N=0,I=null,he.reset(),se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ai}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}}const is=80;class Ey{constructor(){this.ready=!1,this.loadPromise=null,this._renderer=null,this._scene=null,this._camera=null,this._model=null,this._tmpCanvas=null,this._phases={}}init(){return this.loadPromise?this.loadPromise:(this.loadPromise=this._setup().catch(e=>{console.error("[CharacterRenderer] Failed to load model:",e)}),this.loadPromise)}draw(e,t,i,s,a,r,o){if(!this.ready)return!1;this._phases[t]||(this._phases[t]=0);const l=r>.3;l?this._phases[t]=(this._phases[t]+r*.09)%(Math.PI*2):this._phases[t]*=.88;const c=this._phases[t],d=this._model;d.rotation.y=-a+Math.PI/2,l?(d.position.y=Math.abs(Math.sin(c))*.04,d.rotation.z=Math.sin(c)*.08):o?(d.position.y=0,d.rotation.z=0,d.rotation.x=-.12):(d.position.y*=.85,d.rotation.z*=.85,d.rotation.x*=.85),this._renderer.render(this._scene,this._camera);const f=this._tmpCanvas.getContext("2d");return f.clearRect(0,0,is,is),f.drawImage(this._renderer.domElement,0,0),e.save(),e.translate(i,s),e.drawImage(this._tmpCanvas,-40,-44),e.restore(),!0}async _setup(){this._renderer=new by({antialias:!0,alpha:!0,preserveDrawingBuffer:!0}),this._renderer.setSize(is,is),this._renderer.setPixelRatio(1),this._renderer.setClearColor(0,0),this._renderer.shadowMap.enabled=!1,this._tmpCanvas=document.createElement("canvas"),this._tmpCanvas.width=is,this._tmpCanvas.height=is,this._scene=new su;const e=.65;this._camera=new Ja(-e,e,e,-e,.01,30),this._camera.position.set(0,9,0),this._camera.lookAt(0,0,0);const t=new Tu(16777215,1.1);this._scene.add(t);const i=new Tc(16777215,.9);i.position.set(1,8,2),this._scene.add(i);const s=new Tc(11193599,.4);s.position.set(-2,5,-3),this._scene.add(s),this._model=await this._loadModel(),this._fitModel(this._model),this._scene.add(this._model),this.ready=!0,console.log("[CharacterRenderer] elf girl model loaded ✓")}createCustomRobotModel(){const e=new In,t=new on(8,5,20,8),i=new Ur({color:2040877,metalness:.95,roughness:.15,name:"robot-armor"}),s=new ht(t,i);s.position.y=20,e.add(s);const a=new on(2,2,2,8),r=new Ls({color:6749425}),o=new ht(a,r);o.rotation.x=Math.PI/2,o.position.set(0,23,7.5),e.add(o);const l=new In;l.position.set(0,33,0);const c=new Ga(4.5,12,12),d=new ht(c,i);l.add(d);const f=new mn(7,1.2,4),h=new Ls({color:16727100}),u=new ht(f,h);u.position.set(0,1,3.2),l.add(u);const g=new on(.2,.2,6,4),y=new ht(g,i);y.position.set(-3.5,4,-1),y.rotation.z=-.25,l.add(y);const m=new ht(g,i);m.position.set(3.5,4,-1),m.rotation.z=.25,l.add(m),e.add(l);const p=new Ga(4,8,8),b=new ht(p,i);b.position.set(-10,26,0),b.scale.set(1.2,1,1),e.add(b);const _=new ht(p,i);_.position.set(10,26,0),_.scale.set(1.2,1,1),e.add(_);const v=new Ur({color:1118481,metalness:.8,roughness:.4}),x=new on(1.5,1.2,10,6),E=new ht(x,v);E.position.set(-11,19,2),E.rotation.x=.4,e.add(E);const C=new ht(x,v);C.position.set(11,19,-2),C.rotation.x=-.4,e.add(C);const S=new mn(8,14,5),w=new ht(S,i);w.position.set(0,20,-6);const L=new on(1,1.8,4,8),R=new ht(L,v);R.position.set(-3,-8,0),w.add(R);const P=new ht(L,v);P.position.set(3,-8,0),w.add(P);const F=new on(1.2,.1,5,8),N=new Ls({color:16755200,transparent:!0,opacity:.8,blending:eo}),I=new ht(F,N);I.position.set(-3,-11,0),w.add(I);const B=new ht(F,N);B.position.set(3,-11,0),w.add(B),e.add(w);const O=new ht(x,v);O.position.set(-4,6,0),e.add(O);const K=new ht(x,v);K.position.set(4,6,0),e.add(K);const j=new mn(2,2.5,18),ee=new Ur({color:330776,metalness:.9,roughness:.2}),ue=new ht(j,ee);ue.position.set(7,16,-10),ue.rotation.y=.1,e.add(ue);const ge=new In;return ge.add(e),ge}_loadModel(){return Promise.resolve(this.createCustomRobotModel())}_fitModel(e){const t=new On().setFromObject(e),i=new V;t.getSize(i);const s=new V;t.getCenter(s);const r=1.1/Math.max(i.x,i.y,i.z);e.scale.setScalar(r);const o=new On().setFromObject(e),l=new V;o.getCenter(l),e.position.set(-l.x,-l.y,-l.z)}}const dn=new Ey,pa=[{id:"recruit",label:"RECRUIT",minRP:0,maxRP:999,color:"#8a9bb5",icon:"▪"},{id:"veteran",label:"VETERAN",minRP:1e3,maxRP:3999,color:"#e8c84a",icon:"◆"},{id:"elite",label:"ELITE",minRP:4e3,maxRP:1/0,color:"#ff6ef7",icon:"★"}],ma=80,ga=-40,jc={pistol:{name:"Tactical 9mm",damage:22,fireRate:300,accuracy:.95,magSize:12,range:400,reloadTime:1200,speedMultiplier:1,type:"Semi-Auto",recoil:3,bulletSpeed:14},rifle:{name:"Assault Rifle (M4A1)",damage:26,fireRate:110,accuracy:.88,magSize:30,range:600,reloadTime:2200,speedMultiplier:1,type:"Automatic",recoil:4.5,bulletSpeed:16},shotgun:{name:"Shotgun (Remington 870)",damage:14,fireRate:850,accuracy:.65,magSize:6,range:250,reloadTime:2800,speedMultiplier:1,type:"Pump-Action",pellets:7,recoil:12,bulletSpeed:12},sniper:{name:"Sniper Rifle (AWM)",damage:95,fireRate:1500,accuracy:.99,magSize:5,range:1200,reloadTime:2800,speedMultiplier:1,type:"Bolt-Action",recoil:18,bulletSpeed:24},smg:{name:"SMG (MP5)",damage:18,fireRate:75,accuracy:.82,magSize:30,range:350,reloadTime:1500,speedMultiplier:1,type:"Automatic",recoil:2.2,bulletSpeed:13},lmg:{name:"LMG (M249)",damage:25,fireRate:85,accuracy:.75,magSize:100,range:550,reloadTime:4500,speedMultiplier:1,type:"Automatic",recoil:6,bulletSpeed:15},dmr:{name:"DMR (M14 EBR)",damage:45,fireRate:400,accuracy:.94,magSize:20,range:800,reloadTime:2400,speedMultiplier:1,type:"Semi-Auto",recoil:8.5,bulletSpeed:20},knife:{name:"Tactical Knife",damage:55,fireRate:350,accuracy:1,magSize:1,range:60,reloadTime:0,speedMultiplier:1.15,type:"Melee",recoil:0,bulletSpeed:20},vector:{name:"Vector SMG",damage:14,fireRate:48,accuracy:.87,magSize:33,range:320,reloadTime:1100,speedMultiplier:1.02,type:"Automatic",recoil:1.8,bulletSpeed:14},famas:{name:"FAMAS Burst Carbine",damage:20,fireRate:450,accuracy:.93,magSize:25,range:550,reloadTime:1800,speedMultiplier:1,type:"Automatic",pellets:3,recoil:3.5,bulletSpeed:17},plasma:{name:"Plasma Rifle PL-45",damage:32,fireRate:150,accuracy:.92,magSize:20,range:600,reloadTime:2e3,speedMultiplier:1,type:"Automatic",recoil:2,bulletSpeed:10},railgun:{name:"Railgun RG-X",damage:85,fireRate:1400,accuracy:.99,magSize:5,range:1200,reloadTime:3500,speedMultiplier:.95,type:"Automatic",recoil:22,bulletSpeed:32}},ns={cyan:{body:"#3ba39f",armor:"#16202c",helmet:"#66fcf1"},green:{body:"#39db14",armor:"#133d07",helmet:"#5eff39"},purple:{body:"#9d3bff",armor:"#20083c",helmet:"#c47aff"},orange:{body:"#ff7f3b",armor:"#3f1b07",helmet:"#ff9d7a"},yellow:{body:"#ffd700",armor:"#3a3000",helmet:"#ffea70"},red:{body:"#ff3c3c",armor:"#3a0707",helmet:"#ff7a7a"}};class Ty{constructor(e,t,i,s,a,r,o=!1,l=!1){this.id=e,this.x=t,this.y=i,this.vx=0,this.vy=0,this.radius=18,this.angle=0,this.name=s,this.isLocal=o,this.isBot=l,this.colorTheme=r||(o?"cyan":"red"),this.isTeammate=!1,this.health=100,this.maxHealth=100,this.score=0,this.rp=o?parseInt(localStorage.getItem("tacticstrike_rp")||"0"):0,this.rank=this._calcRank(this.rp),this.weaponKey=a,this.weapon={...jc[a]},this.primaryWeaponKey=a,this.activeSlot=1,this.primaryAmmoInMag=this.weapon.magSize,this.primaryReserveAmmo=this.weapon.magSize*3,this.ammoInMag=this.weapon.magSize,this.reserveAmmo=this.weapon.magSize*3,this.maxReserveAmmo=this.weapon.magSize*5,this.isReloading=!1,this.reloadStartTime=0,this.lastFiredTime=0,this.accel=.3,this.maxSpeed=3.4,this.friction=.84,this.muzzleFlash=0,this.footstepTimer=0,this.currentSpeed=0,this.flashGrenades=1,this.flashAlpha=0,this.throwFlashbangRequest=!1,this.botTargetX=t,this.botTargetY=i,this.botState="patrol",this.lastKnownPlayerPos=null,this.botReactTime=0,this.botLastDecisionTime=0,this.botShootDelay=0,this.flashlightActive=!0,this.botStrafeDir=Math.random()>.5?1:-1,this.botLastStrafeToggle=0,this.dashTrails=[],this.networkJustDashed=!1,this.weaponXP=0,this.weaponLevel=1,this.weaponLevelUpAlert=0,this.healthPacks=0,this.ammoPacks=0}_calcRank(e){for(let t=pa.length-1;t>=0;t--)if(e>=pa[t].minRP)return pa[t];return pa[0]}applyRankDelta(e){this.rp=Math.max(0,this.rp+e);const t=this._calcRank(this.rp),i=t.id!==this.rank.id;if(this.rank=t,this.isLocal)try{localStorage.setItem("tacticstrike_rp",String(this.rp))}catch{}return i}addWeaponXP(e){if(this.health<=0)return;this.weaponXP+=e;let t=!1;for(;this.weaponXP>=this.weaponLevel*100;)this.weaponXP-=this.weaponLevel*100,this.weaponLevel++,t=!0;t&&(this.weaponLevelUpAlert=4,this.isLocal&&!this.isBot&&this.updateHUD())}changeWeapon(e){this.weaponKey=e,this.weapon={...jc[e]},this.ammoInMag=this.weapon.magSize,this.reserveAmmo=this.weapon.magSize*3,this.isReloading=!1,e!=="knife"&&(this.primaryWeaponKey=e,this.primaryAmmoInMag=this.ammoInMag,this.primaryReserveAmmo=this.reserveAmmo)}switchSlot(e){e!==this.activeSlot&&(this.activeSlot===1&&(this.primaryAmmoInMag=this.ammoInMag,this.primaryReserveAmmo=this.reserveAmmo),this.activeSlot=e,e===1?(this.changeWeapon(this.primaryWeaponKey),this.ammoInMag=this.primaryAmmoInMag,this.reserveAmmo=this.primaryReserveAmmo):e===2&&(this.changeWeapon("knife"),this.ammoInMag=1,this.reserveAmmo=1/0),this.isLocal&&!this.isBot&&(this.updateHUD(),window.AppSocket&&window.AppSocket.emit("select-weapon",{weapon:this.weaponKey})))}update(e,t,i,s,a,r=null,o=null){if(this.health<=0)return;const l=window.gameEngine&&window.gameEngine.matchMode==="sabotage",c=Math.max(1,Math.min(150,a-(this.lastUpdateTime||a)));if(l)if(this.team===1){if(this.flashlightActive=!1,this.weaponKey="none",this.isLocal&&this.inVent){this.vx=0,this.vy=0,this.lastUpdateTime=a,this.health=Math.min(this.health,this.maxHealth),this.flashAlpha=Math.max(0,this.flashAlpha-c*5e-4);return}}else this.flashlightActive=!0;this.lastUpdateTime||(this.lastUpdateTime=a);const d=a-this.lastUpdateTime;this.lastUpdateTime=a;const f=Date.now();this.adrenalineActive=!!(this.adrenalineEndTime&&f<this.adrenalineEndTime),this.overdriveActive=!!(this.overdriveEndTime&&f<this.overdriveEndTime),this.updateBuffsHUD(f);const h=Math.max(1,Math.min(150,d)),u=h/16.67,y=window.gameEngine&&window.gameEngine.isRanked?1.25:1;if(this.isLocal&&!this.isBot){this.handleLocalInput(e,t,s,a,u),this.updateDashHUD(a);const L=window.gameEngine&&window.gameEngine.devCheatActive;if(this.maxHealth=L?200:100,this.aimbotHasLOS=!1,L){this.health>200&&(this.health=200);const R=this.team===1?2:1,P=window.gameEngine.players.filter(F=>F!==this&&F.health>0&&F.team===R);if(P.length>0){const F=window.gameEngine.map;P.sort((I,B)=>Math.hypot(this.x-I.x,this.y-I.y)-Math.hypot(this.x-B.x,this.y-B.y));let N=null;if(F&&(N=P.find(I=>this.checkLineOfSight(F,this.x,this.y,I.x,I.y))),N){const I=Math.hypot(this.x-N.x,this.y-N.y),B=this.weapon.range||400;if(I<=B){this.aimbotHasLOS=!0;const O=N.x-this.x,K=N.y-this.y,j=I>0?Math.max(0,I-22)/I:0,ee=O*j,ue=K*j,ge=this.weapon.bulletSpeed||15,De=N.vx||0,Xe=N.vy||0,Ce=De*De+Xe*Xe,Y=ge*ge-Ce,ae=-2*(ee*De+ue*Xe),te=-(ee*ee+ue*ue);let we=0;if(Math.abs(Y)>.001){const nt=ae*ae-4*Y*te;if(nt>=0){const Oe=(-ae+Math.sqrt(nt))/(2*Y),Ze=(-ae-Math.sqrt(nt))/(2*Y);Oe>0&&Ze>0?we=Math.min(Oe,Ze):Oe>0?we=Oe:Ze>0&&(we=Ze)}}else if(Math.abs(ae)>.001){const nt=-te/ae;nt>0&&(we=nt)}const Ie=N.x+De*we,Re=N.y+Xe*we;this.angle=Math.atan2(Re-this.y,Ie-this.x)}}}}else this.health>100&&(this.health=100)}else this.isBot&&r&&this.handleBotAI(i,s,a,r,o,u);const m=this.isLocal&&e&&e.shift,p=this.adrenalineActive?1.35:1,b=this.weapon.speedMultiplier*(m?1.75:1)*y*p;let _=this.maxSpeed*b;this.lastDashTime&&a-this.lastDashTime<200&&(_=22,(!this.lastTrailSpawnTime||a-this.lastTrailSpawnTime>25)&&(this.dashTrails||(this.dashTrails=[]),this.dashTrails.push({x:this.x,y:this.y,angle:this.angle,time:a}),this.lastTrailSpawnTime=a)),this.dashTrails&&this.dashTrails.length>0&&(this.dashTrails=this.dashTrails.filter(L=>a-L.time<180)),this.vx*=Math.pow(this.friction,u),this.vy*=Math.pow(this.friction,u);const E=Math.sqrt(this.vx*this.vx+this.vy*this.vy);E>_&&(this.vx=this.vx/E*_,this.vy=this.vy/E*_),this.currentSpeed=E;const C=this.x+this.vx*u,S=this.y+this.vy*u,w=i.checkCircleCollision(C,S,this.radius);if(this.x=w.x,this.y=w.y,(Math.abs(this.vx)>.5||Math.abs(this.vy)>.5)&&(this.footstepTimer+=E,this.footstepTimer>120&&(this.footstepTimer=0,s))){const L=o?Math.hypot(this.x-o.x,this.y-o.y):0;(this.isLocal||L<450)&&s.playFootstep()}if(this.isReloading&&a-this.reloadStartTime>=this.weapon.reloadTime){const R=this.weapon.magSize-this.ammoInMag,P=Math.min(R,this.reserveAmmo);this.ammoInMag+=P,this.reserveAmmo-=P,this.isReloading=!1,this.isLocal&&!this.isBot&&this.updateHUD()}this.muzzleFlash>0&&(this.muzzleFlash=Math.max(0,this.muzzleFlash-.15*u)),this.flashAlpha>0&&(this.flashAlpha=Math.max(0,this.flashAlpha-.008*u)),this.weaponLevelUpAlert>0&&(this.weaponLevelUpAlert=Math.max(0,this.weaponLevelUpAlert-h/1e3))}handleLocalInput(e,t,i,s,a){if(window.gameEngine&&window.gameEngine.activeMinigame){this.vx=0,this.vy=0;return}const o=e&&e.shift?1.75:1;let c=window.gameEngine&&window.gameEngine.isRanked?1.25:1;this.adrenalineActive&&(c*=1.35);const d=this.accel*c;let f=0,h=0;if((e.w||e.arrowup)&&(h-=d*o),(e.s||e.arrowdown)&&(h+=d*o),(e.a||e.arrowleft)&&(f-=d*o),(e.d||e.arrowright)&&(f+=d*o),f!==0&&h!==0&&(f*=.7071,h*=.7071),this.vx+=f*a,this.vy+=h*a,this.angle=t.angle,e&&e[" "]&&(!this.lastDashTime||s-this.lastDashTime>1e4)){this.lastDashTime=s,this.justDashed=!0,this.networkJustDashed=!0;const g=22;if(this.vx=Math.cos(this.angle)*g,this.vy=Math.sin(this.angle)*g,i)try{i.playDashSound(0)}catch{}}(e.r||e.R)&&!this.isReloading&&this.ammoInMag<this.weapon.magSize&&this.reserveAmmo>0&&this.startReload(i,s)}startReload(e,t){if(this.isReloading=!0,this.reloadStartTime=t,e&&e.playReload(this.weaponKey),this.isLocal&&!this.isBot){const i=document.getElementById("reload-indicator");i&&(i.style.display="flex",setTimeout(()=>{i&&(i.style.display="none")},this.weapon.reloadTime))}}shoot(e,t,i=0){if(this.health<=0||this.isReloading||window.gameEngine&&window.gameEngine.matchMode==="sabotage"&&this.team===1)return null;window.gameEngine&&window.gameEngine.devCheatActive&&this.isLocal;const a=this.overdriveEndTime&&e<this.overdriveEndTime||this.overdriveActive?.5:1;if(e-this.lastFiredTime<this.weapon.fireRate*a)return null;if(this.weaponKey!=="knife"&&this.ammoInMag<=0)return t&&t.playDryFire(),this.lastFiredTime=e,this.reserveAmmo>0&&this.startReload(t,e),null;this.weaponKey!=="knife"&&this.ammoInMag--,this.lastFiredTime=e,this.muzzleFlash=this.weaponKey==="knife"?0:1;const r=this.weapon.recoil;return this.vx-=Math.cos(this.angle)*r*.15,this.vy-=Math.sin(this.angle)*r*.15,t&&t.playGunshot(this.weaponKey,i),this.isLocal&&!this.isBot&&this.updateHUD(),{playerId:this.id,x:this.x+Math.cos(this.angle)*22,y:this.y+Math.sin(this.angle)*22,angle:this.angle,weaponKey:this.weaponKey,damage:this.weapon.damage,bulletSpeed:this.weapon.bulletSpeed,range:this.weapon.range,recoil:r,pellets:this.weapon.pellets||1,accuracy:this.weapon.accuracy}}updateHUD(){const e=document.getElementById("hud-self-hp");e&&(e.style.width=`${Math.max(0,this.health)}%`);const t=document.getElementById("hud-self-hp-text");t&&(t.innerText=Math.round(Math.max(0,this.health)));const i=document.getElementById("hud-weapon-name");if(i&&this.weapon&&this.weapon.name){const l=this.weaponKey!=="knife"&&this.weaponKey!=="none"?` [LVL ${this.weaponLevel}]`:"";i.innerText=(this.weapon.name+l).toUpperCase()}const s=document.getElementById("hud-ammo-val");s&&(s.innerText=`${this.ammoInMag} / ${this.reserveAmmo}`);const a=document.getElementById("hud-flash-val");a&&(a.innerText=`FLASH [${this.flashGrenades!==void 0?this.flashGrenades:1}]`,this.flashGrenades<=0?(a.style.color="#ff3c3c",a.style.borderColor="rgba(255, 60, 60, 0.3)"):(a.style.color="#ffd700",a.style.borderColor="rgba(255, 215, 0, 0.3)"));const r=document.getElementById("hud-stashed-packs");r&&(r.innerHTML=`MEDKITS [${this.healthPacks||0}] &nbsp; AMMO PACKS [${this.ammoPacks||0}]`);const o=document.getElementById("hud-weapon-xp-wrapper");if(o)if(this.weaponKey!=="knife"&&this.weaponKey!=="none"){o.style.display="flex";const l=this.weaponLevel*100,c=this.weaponXP/l*100,d=document.getElementById("hud-weapon-xp");d&&(d.style.width=`${c}%`);const f=document.getElementById("hud-weapon-xp-text");f&&(f.innerText=`${this.weaponXP}/${l}`)}else o.style.display="none";for(let l=1;l<=3;l++){const c=document.getElementById(`inv-slot-${l}`);if(c){if(l===3)c.innerText=`[3] FLASH (${this.flashGrenades!==void 0?this.flashGrenades:1})`;else if(l===1){const d=this.primaryWeaponKey?this.primaryWeaponKey.toUpperCase():"PRIMARY";c.innerText=`[1] ${d}`}this.activeSlot===l?(c.style.background="rgba(102, 252, 241, 0.12)",c.style.borderColor="var(--neon-cyan)",c.style.color="#fff",c.style.boxShadow="0 0 8px rgba(102,252,241,0.2)"):(c.style.background="rgba(0, 0, 0, 0.4)",c.style.borderColor="rgba(255,255,255,0.08)",c.style.color="rgba(255,255,255,0.5)",c.style.boxShadow="none")}}}updateDashHUD(e){const i=document.getElementById("hud-dash-status"),s=document.getElementById("hud-dash-icon");if(i)if(!this.lastDashTime||e-this.lastDashTime>=1e4)i.innerText="DASH READY (SPACE)",i.style.color="var(--neon-cyan)",s&&(s.innerText="⚡",s.style.color="var(--neon-cyan)");else{const a=Math.ceil((1e4-(e-this.lastDashTime))/1e3);i.innerText=`DASH COOLDOWN: ${a}s`,i.style.color="#ff3c3c",s&&(s.innerText="⏳",s.style.color="#ff3c3c")}}takeDamage(e,t){if(!(this.health<=0)){if(this.health=Math.max(0,this.health-e),t&&t.playFleshHit(),this.isLocal&&!this.isBot){this.updateHUD();const i=document.getElementById("game-canvas");i&&(i.style.filter="drop-shadow(0 0 10px rgba(255, 0, 0, 0.4))",setTimeout(()=>i.style.filter="none",150))}if(this.isBot&&this.health>0){const i=Date.now();if((!this.lastDashTime||i-this.lastDashTime>3e3)&&Math.random()<.6){this.lastDashTime=i,this.networkJustDashed=!0;const a=this.angle+Math.PI/2*(Math.random()>.5?1:-1);if(this.vx=Math.cos(a)*20,this.vy=Math.sin(a)*20,t&&t.playFrictionalScrape)try{t.playFrictionalScrape(0,.4,.5)}catch{}}}}}checkPickups(e,t){this.health<=0||e.items.forEach(i=>{if(!i.active)return;if(Math.hypot(this.x-i.x,this.y-i.y)<this.radius+12){if(i.active=!1,i.type==="health"){if(this.health>=this.maxHealth)if(this.healthPacks<2)this.healthPacks++,t&&t.playPickup(),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+1 STASHED MEDKIT","#ff6ef7"));else{i.active=!0;return}else if(t&&t.playPickup(),this.health=Math.min(this.maxHealth,this.health+35),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+35 HEALTH"),window.AppSocket)){const r=window.gameEngine&&window.gameEngine.devCheatActive?Math.round(this.health/2):this.health;window.AppSocket.emit("sync-health",{playerId:this.id,health:r})}}else if(i.type==="ammo")if(this.reserveAmmo>=this.maxReserveAmmo)if(this.ammoPacks<2)this.ammoPacks++,t&&t.playPickup(),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+1 STASHED AMMO PACK","#ff6ef7"));else{i.active=!0;return}else{t&&t.playPickup();const a=this.weapon.magSize*2;this.reserveAmmo=Math.min(this.maxReserveAmmo,this.reserveAmmo+a),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+AMMO"))}else i.type==="adrenaline"?(t&&t.playPickup(),this.adrenalineEndTime=Date.now()+8e3,this.adrenalineActive=!0,this.isLocal&&!this.isBot&&this.showTextNotification("⚡ SPEED BOOST ACTIVE")):i.type==="overdrive"&&(this.overdriveEndTime=Date.now()+6e3,this.overdriveActive=!0,this.isLocal&&!this.isBot&&this.showTextNotification("🔥 OVERDRIVE CHARGED"));this.isLocal&&!this.isBot&&window.AppSocket&&window.AppSocket.emit("pickup-item",{itemId:i.id})}})}showTextNotification(e,t="#ffd700"){this.floatingText={text:e,timer:45,yOffset:-30,color:t}}handleBotAI(e,t,i,s,a,r){const o=Math.hypot(this.x-s.x,this.y-s.y),c=!s.inVent&&o<700&&this.checkLineOfSight(e,this.x,this.y,s.x,s.y);let f=Math.atan2(s.y-this.y,s.x-this.x)-this.angle;for(;f<-Math.PI;)f+=Math.PI*2;for(;f>Math.PI;)f-=Math.PI*2;const h=Math.abs(f)<=32.5*Math.PI/180,u=c&&(o<140||s.flashlightActive||this.flashlightActive&&h);i-s.lastFiredTime<60&&o<900&&!u&&this.botState!=="chase"&&(this.botState="search",this.lastKnownPlayerPos={x:s.x,y:s.y},this.botTargetX=s.x,this.botTargetY=s.y,this.angle=Math.atan2(s.y-this.y,s.x-this.x));let y=!1;if(window.gameEngine&&window.gameEngine.matchMode==="sabotage"){const R=window.gameEngine.tasks?window.gameEngine.tasks.filter(P=>P.alarmActive):[];if(R.length>0){R.sort((N,I)=>Math.hypot(this.x-N.x,this.y-N.y)-Math.hypot(this.x-I.x,this.y-I.y));const P=R[0];u&&o<120||(this.botState="search",this.botTargetX=P.x,this.botTargetY=P.y,this.angle=Math.atan2(P.y-this.y,P.x-this.x),this.botLastDecisionTime=i,y=!0)}}const m=i-this.botLastDecisionTime;if(!y&&m>250){if(this.botLastDecisionTime=i,i-this.botLastStrafeToggle>1e3&&(this.botStrafeDir=Math.random()>.5?1:-1,this.botLastStrafeToggle=i),this.health<35&&Math.random()<.3){const R=e.items.filter(P=>P.active&&P.type==="health");R.length>0&&(R.sort((P,F)=>Math.hypot(this.x-P.x,this.y-P.y)-Math.hypot(this.x-F.x,this.y-F.y)),this.botTargetX=R[0].x,this.botTargetY=R[0].y,this.botState="patrol")}if(u){if(this.botState="chase",this.lastKnownPlayerPos={x:s.x,y:s.y},this.angle=Math.atan2(s.y-this.y,s.x-this.x),this.flashGrenades>0&&o>220&&o<500&&Math.random()<.05&&(this.throwFlashbangRequest=!0),(!this.lastDashTime||i-this.lastDashTime>3e3)&&Math.random()<.04){this.lastDashTime=i,this.networkJustDashed=!0;const P=this.angle+(Math.random()<.3?0:Math.PI/2*(Math.random()>.5?1:-1));if(this.vx=Math.cos(P)*20,this.vy=Math.sin(P)*20,t)try{this.sound.playFrictionalScrape(0,.4,.5)}catch{}}if(this.isReloading)this.botTargetX=this.x-Math.cos(this.angle)*220,this.botTargetY=this.y-Math.sin(this.angle)*220;else if(this.weaponKey==="sniper")o<400?(this.botTargetX=this.x-Math.cos(this.angle)*200,this.botTargetY=this.y-Math.sin(this.angle)*200):(this.botTargetX=this.x,this.botTargetY=this.y);else if(this.weaponKey==="shotgun")this.botTargetX=s.x,this.botTargetY=s.y;else{const P=this.angle+Math.PI/2*this.botStrafeDir;this.botTargetX=s.x+Math.cos(P)*180+(Math.random()-.5)*60,this.botTargetY=s.y+Math.sin(P)*180+(Math.random()-.5)*60}this.ammoInMag===0&&!this.isReloading&&this.reserveAmmo>0&&this.startReload(t,i)}else this.botState==="chase"&&this.lastKnownPlayerPos?(this.botState="search",this.botTargetX=this.lastKnownPlayerPos.x,this.botTargetY=this.lastKnownPlayerPos.y):this.botState==="search"?Math.hypot(this.x-this.botTargetX,this.y-this.botTargetY)<50&&(this.botState="patrol",this.choosePatrolPoint(e)):(Math.hypot(this.x-this.botTargetX,this.y-this.botTargetY)<50||Math.random()<.02)&&this.choosePatrolPoint(e)}let p=this.botTargetX,b=this.botTargetY;if(!this.checkLineOfSight(e,this.x,this.y,this.botTargetX,this.botTargetY)){const R=this.getClosestRoomIndex(e,this.x,this.y),P=this.getClosestRoomIndex(e,this.botTargetX,this.botTargetY);if(R!==-1&&P!==-1&&R!==P){const F=this.findRoomPath(R,P);if(F.length>1){const N=F[1],I=this.getDoorway(e,R,N);if(Math.hypot(this.x-I.x,this.y-I.y)<35)if(F.length>2){const O=F[2],K=this.getDoorway(e,N,O);p=K.x,b=K.y}else p=this.botTargetX,b=this.botTargetY;else p=I.x,b=I.y}}}if(Math.hypot(this.x-p,this.y-b)>30?this.lastStuckCheckTime?i-this.lastStuckCheckTime>300&&(Math.hypot(this.x-this.lastStuckPosX,this.y-this.lastStuckPosY)<12?this.stuckDuration+=i-this.lastStuckCheckTime:this.stuckDuration=0,this.lastStuckCheckTime=i,this.lastStuckPosX=this.x,this.lastStuckPosY=this.y):(this.lastStuckCheckTime=i,this.lastStuckPosX=this.x,this.lastStuckPosY=this.y,this.stuckDuration=0):this.stuckDuration=0,this.stuckDuration>800&&(this.botState==="patrol"||this.botState==="search")&&(this.choosePatrolPoint(e),this.stuckDuration=0),this.stuckDuration>300){const R=this.x+Math.cos(this.angle)*45,P=this.y+Math.sin(this.angle)*45,F=e.walls.find(N=>N.type==="crate"&&R>=N.x&&R<=N.x+N.w&&P>=N.y&&P<=N.y+N.h);if(F&&(this.angle=Math.atan2(F.y+F.h/2-this.y,F.x+F.w/2-this.x),!this.isReloading&&this.ammoInMag>0&&i-this.lastFiredTime>=(this.weapon.fireRate||300))){const I=this.shoot(i,t,50);I&&window.OnBotShootCallback&&window.OnBotShootCallback(I)}}let E=window.gameEngine&&window.gameEngine.isRanked?1.25:1;this.adrenalineActive&&(E*=1.35);const C=this.accel*E;if(Math.hypot(this.x-p,this.y-b)>10){const R=Math.atan2(b-this.y,p-this.x);let P=R;if(this.stuckDuration>350)this.stuckSteerDir||(this.stuckSteerDir=Math.random()<.5?1:-1),P+=Math.PI/2*this.stuckSteerDir;else{this.stuckSteerDir=0;const F=85,N=60,I=.45,B={x:this.x+Math.cos(R)*F,y:this.y+Math.sin(R)*F},O={x:this.x+Math.cos(R-I)*N,y:this.y+Math.sin(R-I)*N},K={x:this.x+Math.cos(R+I)*N,y:this.y+Math.sin(R+I)*N},j=e.getLineIntersection({x:this.x,y:this.y},B),ee=e.getLineIntersection({x:this.x,y:this.y},O),ue=e.getLineIntersection({x:this.x,y:this.y},K);let ge=0,De=!1;const Xe=j?j.dist:F,Ce=ee?ee.dist:N,Y=ue?ue.dist:N;if(j){De=!0;const ae=1-Xe/F;Ce>Y?ge-=ae*1:Y>Ce?ge+=ae*1:ge-=ae*1}ee&&(De=!0,ge+=(1-Ce/N)*.8),ue&&(De=!0,ge-=(1-Y/N)*.8),De&&(ge=Math.max(-1,Math.min(1,ge)),P=R+ge*1.4)}this.botState!=="chase"&&(this.angle=R),this.vx+=Math.cos(P)*C*r,this.vy+=Math.sin(P)*C*r}let w=0,L=0;for(const R of e.walls){const P=Math.max(R.x,Math.min(this.x,R.x+R.w)),F=Math.max(R.y,Math.min(this.y,R.y+R.h)),N=this.x-P,I=this.y-F,B=Math.hypot(N,I);if(B<this.radius+20&&B>0){const O=(this.radius+20-B)/20;w+=N/B*O*.45,L+=I/B*O*.45}}if(this.vx+=w*r,this.vy+=L*r,u&&!this.isReloading&&this.ammoInMag>0){const R=i-this.lastFiredTime,P=this.weapon.fireRate||300;if(R>=P){const F=a?Math.hypot(this.x-a.x,this.y-a.y):0,N=this.shoot(i,t,F);N&&window.OnBotShootCallback&&window.OnBotShootCallback(N)}}}checkLineOfSight(e,t,i,s,a){return!e.getLineIntersection({x:t,y:i},{x:s,y:a})}choosePatrolPoint(e){if(!e||!e.rooms||e.rooms.length===0){this.botTargetX=Math.random()*(e.width-160)+80,this.botTargetY=Math.random()*(e.height-160)+80;return}const t=e.rooms.findIndex(r=>this.x>=r.x&&this.x<=r.x+r.w&&this.y>=r.y&&this.y<=r.y+r.h);let i=null;if(t!==-1&&Math.random()<.75){const r=t%3,o=Math.floor(t/3),l=[];for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++){const h=o+d,u=r+f;h>=0&&h<3&&u>=0&&u<3&&l.push(h*3+u)}const c=l[Math.floor(Math.random()*l.length)];i=e.rooms[c]}else i=e.rooms[Math.floor(Math.random()*e.rooms.length)];i||(i=e.rooms[0]);let s=0;const a=38;for(;s<100;){s++;const r=i.x+a+Math.random()*(i.w-a*2),o=i.y+a+Math.random()*(i.h-a*2);let l=!1;for(const c of e.walls)if(r+25>c.x&&r-25<c.x+c.w&&o+25>c.y&&o-25<c.y+c.h){l=!0;break}if(!l){this.botTargetX=r,this.botTargetY=o;return}}this.botTargetX=i.x+i.w/2,this.botTargetY=i.y+i.h/2}draw(e,t={laser:!0},i=null){var u,g;if(this.inVent)return;if(this.health<=0){e.save(),e.fillStyle="rgba(180, 0, 0, 0.35)",e.beginPath(),e.ellipse(this.x,this.y,this.radius+8,this.radius+4,0,0,Math.PI*2),e.fill(),dn.ready&&(e.save(),e.translate(this.x,this.y),e.rotate(this.angle+Math.PI/2),e.globalAlpha=.55,dn.draw(e,this.id+"_dead",0,0,0,0,!1,this.isLocal?"blue":"red"),e.restore()),e.restore();return}if(e.save(),this.health>0&&this.muzzleFlash>.15){e.save();const y=130*this.muzzleFlash,m=e.createRadialGradient(this.x,this.y,10,this.x,this.y,y);m.addColorStop(0,"rgba(255, 160, 40, 0.28)"),m.addColorStop(.5,"rgba(255, 100, 20, 0.10)"),m.addColorStop(1,"rgba(255, 50, 0, 0.0)"),e.fillStyle=m,e.beginPath(),e.arc(this.x,this.y,y,0,Math.PI*2),e.fill(),e.restore()}const s=window.gameEngine&&window.gameEngine.matchMode==="sabotage";if(t.laser&&this.isLocal&&!this.isReloading&&!s){const y=this.weapon&&this.weapon.range?this.weapon.range:1200;let m=this.x+Math.cos(this.angle)*y,p=this.y+Math.sin(this.angle)*y;if(i){const v=i.getLineIntersection({x:this.x,y:this.y},{x:m,y:p});v&&(m=v.x,p=v.y)}e.save(),e.strokeStyle=this.isLocal?"rgba(102, 252, 241, 0.5)":"rgba(255, 60, 60, 0.5)",e.lineWidth=1.2,e.beginPath(),e.moveTo(this.x,this.y),e.lineTo(m,p),e.stroke();const b=this.isLocal?"#66fcf1":"#ff3c3c",_=e.createRadialGradient(m,p,1,m,p,6);_.addColorStop(0,"#ffffff"),_.addColorStop(.3,b),_.addColorStop(1,"rgba(0, 0, 0, 0)"),e.fillStyle=_,e.beginPath(),e.arc(m,p,6,0,Math.PI*2),e.fill(),e.restore()}e.restore();const a=performance.now();this.dashTrails&&this.dashTrails.length>0&&this.dashTrails.forEach(y=>{const m=a-y.time,p=Math.max(0,.35*(1-m/180));if(p<=0)return;if(e.save(),e.globalAlpha=p,!dn.draw(e,this.id+"_trail",y.x,y.y,y.angle,0,!1)){e.save(),e.translate(y.x,y.y),e.rotate(y.angle);const _=ns[this.colorTheme]||ns[this.isLocal?"cyan":"red"];e.fillStyle=_.helmet||"#66fcf1",e.beginPath(),e.arc(0,0,this.radius,0,Math.PI*2),e.fill(),e.restore()}e.restore()});const r=Date.now(),o=this.adrenalineEndTime&&r<this.adrenalineEndTime||this.adrenalineActive,l=this.overdriveEndTime&&r<this.overdriveEndTime||this.overdriveActive;if(o||l){e.save(),e.shadowBlur=15,e.lineWidth=3,e.shadowColor=l?"#ffd700":"#39db14",e.strokeStyle=l?"rgba(255, 215, 0, 0.4)":"rgba(57, 219, 20, 0.4)";const y=this.radius+2+Math.sin(r/150)*2;e.beginPath(),e.arc(this.x,this.y,y,0,Math.PI*2),e.stroke(),e.restore()}const c=this.muzzleFlash>.1;if(!dn.draw(e,this.id,this.x,this.y,this.angle,this.currentSpeed||0,c,this.isLocal?"blue":"red")){e.save(),e.translate(this.x,this.y),e.rotate(this.angle);const y=ns[this.colorTheme]||ns[this.isLocal?"cyan":"red"],m=y.body,p=y.armor,b=y.helmet;let _=18,v=4;this.weaponKey==="rifle"&&(_=24,v=5),this.weaponKey==="shotgun"&&(_=22,v=6),this.weaponKey==="sniper"&&(_=32,v=4,e.fillStyle="#444",e.fillRect(8,-5,6,3)),this.weaponKey==="smg"&&(_=16,v=4),this.weaponKey==="lmg"&&(_=26,v=7,e.fillStyle="#222",e.fillRect(6,-8,6,16)),this.weaponKey==="dmr"&&(_=28,v=5,e.fillRect(10,-4,5,2)),this.weaponKey==="vector"&&(_=14,v=4,e.fillStyle="#333",e.fillRect(4,-6,5,12)),this.weaponKey==="famas"&&(_=20,v=5,e.fillStyle="#555",e.fillRect(6,-3,8,6)),this.weaponKey==="plasma"&&(e.fillStyle="#9b1fe8",_=20,v=5),this.weaponKey==="railgun"&&(e.fillStyle="#0d8a8a",_=30,v=6,e.fillStyle="#066",e.fillRect(6,-7,8,14)),e.fillStyle="#444",e.strokeStyle="#000",e.lineWidth=1,e.fillRect(10,-v/2,_,v),e.strokeRect(10,-v/2,_,v),e.fillStyle=p,e.strokeStyle="#000",e.lineWidth=1.5,e.beginPath(),e.arc(8,-10,5,0,Math.PI*2),e.fill(),e.stroke(),e.beginPath(),e.arc(14,6,5,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle=m,e.beginPath(),e.ellipse(0,0,this.radius,this.radius+3,0,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle=p,e.beginPath(),e.ellipse(-3,0,this.radius-4,this.radius-2,0,0,Math.PI*2),e.fill(),e.fillStyle=b,e.beginPath(),e.arc(-2,0,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#111",e.fillRect(1,-5,3,10),e.restore()}if(this.weaponKey!=="none"){e.save(),e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle=this.weaponKey==="knife"?"#b0b8c0":"#333",e.strokeStyle="rgba(0,0,0,0.7)",e.lineWidth=1;let y=18,m=3;if(this.weaponKey==="rifle"&&(y=26,m=4),this.weaponKey==="shotgun"&&(y=22,m=5),this.weaponKey==="sniper"&&(y=36,m=3),this.weaponKey==="smg"&&(y=16,m=3),this.weaponKey==="lmg"&&(y=28,m=5),this.weaponKey==="dmr"&&(y=30,m=4),this.weaponKey==="knife"&&(y=10,m=2),this.weaponKey==="vector"&&(y=14,m=3,e.fillStyle="#2a2a2a",e.fillRect(4,-5,4,10)),this.weaponKey==="famas"&&(y=20,m=4,e.fillStyle="#444",e.fillRect(5,-4,7,8)),this.weaponKey==="plasma"&&(e.fillStyle="#9b1fe8",y=20,m=5,e.fillStyle="#c455ff",e.fillRect(6,-4,6,8)),this.weaponKey==="railgun"&&(e.fillStyle="#0d8a8a",y=30,m=6,e.fillStyle="#0af",e.fillRect(4,-6,8,12)),e.fillRect(12,-m/2,y,m),e.strokeRect(12,-m/2,y,m),this.muzzleFlash>0){e.save(),e.translate(12+y,0);const p=e.createRadialGradient(0,0,2,0,0,16);p.addColorStop(0,"rgba(255, 255, 255, 1.0)"),p.addColorStop(.3,"rgba(255, 220, 0, 0.9)"),p.addColorStop(.7,"rgba(255, 80, 0, 0.5)"),p.addColorStop(1,"rgba(255, 0, 0, 0.0)"),e.fillStyle=p,e.beginPath(),e.arc(0,0,16,0,Math.PI*2),e.fill(),e.restore()}e.restore()}e.save(),e.textAlign="center";const f=this.isLocal?((u=ns[this.colorTheme])==null?void 0:u.helmet)||"#66fcf1":this.isTeammate?"#39db14":"#ff3c3c";if(this.rank){const y=this.y-this.radius-28,m=`${this.rank.icon} ${this.rank.label}`;e.font="bold 8px Orbitron";const b=e.measureText(m).width+10,_=12;e.fillStyle="rgba(0,0,0,0.65)",e.beginPath(),e.roundRect(this.x-b/2,y-_/2,b,_,3),e.fill(),e.strokeStyle=this.rank.color,e.lineWidth=1,e.stroke(),e.fillStyle=this.rank.color,e.fillText(m,this.x,y+4)}e.fillStyle=f,e.font="10px Orbitron",e.fillText(this.name.toUpperCase(),this.x,this.y-this.radius-12);const h=window.gameEngine&&window.gameEngine.matchMode==="sabotage";if(this.health>0&&!h){e.fillStyle="rgba(0,0,0,0.5)",e.fillRect(this.x-20,this.y-this.radius-8,40,4);const y=this.isLocal?((g=ns[this.colorTheme])==null?void 0:g.helmet)||"#66fcf1":this.isTeammate?"#39db14":"#ff3c3c";e.fillStyle=y,e.fillRect(this.x-20,this.y-this.radius-8,40*(this.health/this.maxHealth),4)}this.floatingText&&this.floatingText.timer>0&&(e.font="bold 9px Orbitron",e.fillStyle=this.floatingText.color||"#ffd700",e.shadowColor="#000000",e.shadowBlur=4,e.fillText(this.floatingText.text,this.x,this.y+this.floatingText.yOffset),this.floatingText.yOffset-=.4,this.floatingText.timer--),e.restore()}updateBuffsHUD(e){if(!this.isLocal||this.isBot)return;const t=document.getElementById("hud-active-buffs");if(!t)return;let i="";if(this.adrenalineActive){const s=Math.max(0,(this.adrenalineEndTime-e)/1e3).toFixed(1);i+=`<div style="font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; background: rgba(57, 219, 20, 0.15); border: 1px solid rgba(57, 219, 20, 0.4); color: #39db14; padding: 4px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 8px rgba(57, 219, 20, 0.2);">⚡ SPEED: ${s}s</div>`}if(this.overdriveActive){const s=Math.max(0,(this.overdriveEndTime-e)/1e3).toFixed(1);i+=`<div style="font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; background: rgba(255, 215, 0, 0.15); border: 1px solid rgba(255, 215, 0, 0.4); color: #ffd700; padding: 4px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);">🔥 OVERDRIVE: ${s}s</div>`}t.innerHTML=i}getRoomIndexAt(e,t,i){return!e||!e.rooms?-1:e.rooms.findIndex(s=>t>=s.x&&t<=s.x+s.w&&i>=s.y&&i<=s.y+s.h)}getClosestRoomIndex(e,t,i){const s=this.getRoomIndexAt(e,t,i);if(s!==-1)return s;if(!e||!e.rooms||e.rooms.length===0)return-1;let a=1/0,r=0;return e.rooms.forEach((o,l)=>{const c=o.x+o.w/2,d=o.y+o.h/2,f=Math.hypot(t-c,i-d);f<a&&(a=f,r=l)}),r}findRoomPath(e,t){if(e===t)return[e];const i=[[e]],s=new Set([e]);for(;i.length>0;){const a=i.shift(),r=a[a.length-1];if(r===t)return a;const o=Math.floor(r/3),l=r%3,c=[];o>0&&c.push(r-3),o<2&&c.push(r+3),l>0&&c.push(r-1),l<2&&c.push(r+1);for(const d of c)s.has(d)||(s.add(d),i.push([...a,d]))}return[e]}getDoorway(e,t,i){const s=e.rooms[t],a=e.rooms[i],r=Math.floor(t/3),o=t%3,l=Math.floor(i/3),c=i%3,d=s.x<a.x?a.x-(s.x+s.w):s.x-(a.x+a.w);if(r===l){const f=o<c?t:i,h=e.rooms[f],u=h.x+h.w,g=e.walls.filter(y=>Math.abs(y.x-u)<2&&y.y>=h.y-5&&y.y+y.h<=h.y+h.h+5);if(g.length>=2){g.sort((m,p)=>m.y-p.y);const y=(g[0].y+g[0].h+g[1].y)/2;return{x:u+d/2,y}}return{x:u+d/2,y:h.y+h.h/2}}else{const f=r<l?t:i,h=e.rooms[f],u=h.y+h.h,g=e.walls.filter(y=>Math.abs(y.y-u)<2&&y.x>=h.x-5&&y.x+y.w<=h.x+h.w+5);return g.length>=2?(g.sort((m,p)=>m.x-p.x),{x:(g[0].x+g[0].w+g[1].x)/2,y:u+d/2}):{x:h.x+h.w/2,y:u+d/2}}}}class ya{constructor(e){this.id=`${e.playerId}_bullet_${Date.now()}_${Math.floor(Math.random()*1e3)}`,this.playerId=e.playerId,this.x=e.x,this.y=e.y,this.prevX=e.x,this.prevY=e.y,this.angle=e.angle,this.speed=e.bulletSpeed,this.damage=e.damage,this.rangeRemaining=e.range,this.weaponKey=e.weaponKey;const s=(1-(window.gameEngine&&window.gameEngine.devCheatActive&&e.playerId===window.LocalPlayerId?1:e.accuracy))*(Math.random()-.5)*.5,a=this.angle+s;this.vx=Math.cos(a)*this.speed,this.vy=Math.sin(a)*this.speed,this.active=!0}update(e,t,i,s,a=1){if(!this.active)return;if(this.prevX=this.x,this.prevY=this.y,this.x+=this.vx*a,this.y+=this.vy*a,this.rangeRemaining-=this.speed*a,this.rangeRemaining<=0){this.active=!1;return}const r={x:this.prevX,y:this.prevY},o={x:this.x,y:this.y},l=e.getLineIntersection(r,o);if(l){if(this.x=l.x,this.y=l.y,this.active=!1,l.wall&&l.wall.type==="crate"){const c=l.wall.id,d=e.damageCrate(c,this.damage);d&&(d.broken?(s&&s.playCrateBreak(),i.spawnCrateSplinters(d.crateX,d.crateY),this.playerId===window.LocalPlayerId&&window.AppSocket&&window.AppSocket.emit("break-crate",{crateId:c,spawnedItem:d.item})):s&&s.playFleshHit())}i.spawnWallImpact(this.x,this.y,this.angle);return}for(const c of t){if(c.id===this.playerId||c.health<=0)continue;const d=t.find(h=>h.id===this.playerId);if(d&&d.team===c.team)continue;const f=this.getSegmentCircleIntersection(r,o,c);if(f){this.x=f.x,this.y=f.y,this.active=!1,i.spawnBloodSplatter(this.x,this.y,this.angle);const h=this.x-c.x,u=this.y-c.y,y=h*h+u*u<=36,m=y?1.5:1;if(window.IsOfflineMode){const p=e.checkZone?e.checkZone(this.x,this.y):null,b=p&&p.type==="damage"?p.multiplier:1,_=Math.round(this.damage*b*m),v=c.health>0;c.takeDamage(_,s);const x=v&&c.health<=0;if(this.playerId===window.LocalPlayerId){const E=t.find(C=>C.id===this.playerId);E&&E.addWeaponXP&&(x?(E.addWeaponXP(50),E.showTextNotification("+50 XP","#ffd700"),window.gameEngine&&window.gameEngine.registerLocalPlayerKill&&window.gameEngine.registerLocalPlayerKill(performance.now())):(E.addWeaponXP(10),E.showTextNotification("+10 XP","#ff6ef7"))),s&&(y?s.playCriticalHitMarker():s.playHitMarker()),y&&c.showTextNotification?c.showTextNotification("CRITICAL HEADSHOT!"):b>1&&c.showTextNotification&&c.showTextNotification(`×${b} ZONE!`),window.gameEngine&&window.gameEngine.triggerHitmarker(this.x,this.y,_,y),window.MatchStats&&(window.MatchStats.damageDealt+=_)}}else if(this.playerId===window.LocalPlayerId){const p=e.checkZone?e.checkZone(this.x,this.y):null,b=p&&p.type==="damage"?p.multiplier:1,_=Math.round(this.damage*b*m),v=c.health-_<=0,x=t.find(E=>E.id===this.playerId);x&&x.addWeaponXP&&(v?(x.addWeaponXP(50),x.showTextNotification("+50 XP","#ffd700"),window.gameEngine&&window.gameEngine.registerLocalPlayerKill&&window.gameEngine.registerLocalPlayerKill(performance.now())):(x.addWeaponXP(10),x.showTextNotification("+10 XP","#ff6ef7"))),s&&(y?s.playCriticalHitMarker():s.playHitMarker()),y&&c.showTextNotification?c.showTextNotification("CRITICAL HEADSHOT!"):b>1&&c.showTextNotification&&c.showTextNotification(`×${b} ZONE!`),window.gameEngine&&window.gameEngine.triggerHitmarker(this.x,this.y,_,y),window.MatchStats&&(window.MatchStats.damageDealt+=_),window.AppSocket&&window.AppSocket.emit("hit",{damage:_,shooterId:this.playerId,targetId:c.id,x:this.x,y:this.y,isHeadshot:y})}return}}}getSegmentCircleIntersection(e,t,i){const s=t.x-e.x,a=t.y-e.y,r=i.x-e.x,o=i.y-e.y,l=s*s+a*a;if(l===0)return null;let c=(r*s+o*a)/l;c=Math.max(0,Math.min(1,c));const d=e.x+c*s,f=e.y+c*a,h=i.x-d,u=i.y-f;return h*h+u*u<=i.radius*i.radius?{x:d,y:f}:null}draw(e){if(!this.active)return;const t=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode;if(this.weaponKey==="knife"){e.save(),e.lineWidth=3.5,e.lineCap="round",e.strokeStyle="rgba(230, 235, 255, 0.85)",t||(e.shadowColor="#66fcf1",e.shadowBlur=6),e.beginPath(),e.arc(this.x,this.y,18,this.angle-.6,this.angle+.6),e.stroke(),e.restore();return}if(this.weaponKey==="plasma"){e.save(),t||(e.shadowColor="#ff6ef7",e.shadowBlur=18);const a=e.createRadialGradient(this.x,this.y,1,this.x,this.y,7);a.addColorStop(0,"rgba(255, 200, 255, 1.0)"),a.addColorStop(.4,"rgba(230, 80, 255, 0.9)"),a.addColorStop(1,"rgba(120, 0, 180, 0.0)"),e.fillStyle=a,e.beginPath(),e.arc(this.x,this.y,7,0,Math.PI*2),e.fill(),e.restore();return}if(this.weaponKey==="railgun"){e.save(),t||(e.shadowColor="#66fcf1",e.shadowBlur=20),e.lineWidth=5,e.lineCap="round";const a=e.createLinearGradient(this.prevX,this.prevY,this.x,this.y);a.addColorStop(0,"rgba(102, 252, 241, 0.0)"),a.addColorStop(.3,"rgba(102, 252, 241, 0.7)"),a.addColorStop(1,"rgba(255, 255, 255, 1.0)"),e.strokeStyle=a,e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.lineWidth=2,e.strokeStyle="rgba(255,255,255,0.9)",e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.restore();return}e.save(),e.lineWidth=2.5,e.lineCap="round";const i=this.playerId===window.LocalPlayerId,s=e.createLinearGradient(this.prevX,this.prevY,this.x,this.y);i?(s.addColorStop(0,"rgba(102, 252, 241, 0.0)"),s.addColorStop(1,"rgba(102, 252, 241, 1.0)"),e.strokeStyle=s,t||(e.shadowColor="#66fcf1")):(s.addColorStop(0,"rgba(255, 60, 60, 0.0)"),s.addColorStop(1,"rgba(255, 60, 60, 1.0)"),e.strokeStyle=s,t||(e.shadowColor="#ff3c3c")),t||(e.shadowBlur=4),e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.restore()}}class Jc{constructor(e){this.seed=e}next(){const e=Math.sin(this.seed++)*1e4;return e-Math.floor(e)}range(e,t){return e+this.next()*(t-e)}}let wy=class{constructor(e,t,i,s="manor"){this.width=e,this.height=t,this.seed=i,this.rng=new Jc(i),this.mapId=s,this.walls=[],this.items=[],this.zones=[],this.rooms=[],this.decorations=[],this.segments=[],this.ambientLights={},this.generateMap()}generateMap(){this.walls=[],this.items=[],this.zones=[],this.rooms=[],this.decorations=[],this.mapId==="cyberlab"?this.generateCyberLabMap():this.mapId==="arena"?this.generateArenaMap():this.generateManorMap(),this.initTerminals(),this.rebuildSegments()}generateManorMap(){const r=this.width-40,o=this.height-40,l=480,c=960,d=460,f=920,h=l-40,u=c-l-22,g=r-c-22,y=d-40,m=f-d-22,p=o-f-22,b=[{x:40,y:40,w:h,h:y,name:"Kitchen",floor:"tiles"},{x:l+22,y:40,w:u,h:y,name:"Living Room",floor:"carpet"},{x:c+22,y:40,w:g,h:y,name:"Office",floor:"wood"},{x:40,y:d+22,w:h,h:m,name:"Bathroom",floor:"tiles"},{x:l+22,y:d+22,w:u,h:m,name:"Hallway",floor:"concrete"},{x:c+22,y:d+22,w:g,h:m,name:"Bedroom 1",floor:"carpet"},{x:40,y:f+22,w:h,h:p,name:"Garage",floor:"concrete"},{x:l+22,y:f+22,w:u,h:p,name:"Master Bedroom",floor:"carpet"},{x:c+22,y:f+22,w:g,h:p,name:"Bedroom 2",floor:"wood"}];this.rooms=b,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(l,40,22,y,"v",Math.round(y*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l,d+22,22,m,"v",Math.round(m*.35-88/2),88,"wall","interior"),this._addWallWithDoorway(l,f+22,22,p,"v",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,40,22,y,"v",Math.round(y*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,d+22,22,m,"v",Math.round(m*.65-88/2),88,"wall","interior"),this._addWallWithDoorway(c,f+22,22,p,"v",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,d,h,22,"h",Math.round(h*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,d,u,22,"h",Math.round(u*.35-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,d,g,22,"h",Math.round(g*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,f,h,22,"h",Math.round(h*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,f,u,22,"h",Math.round(u*.65-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,f,g,22,"h",Math.round(g*.5-88/2),88,"wall","interior"),this._addFurniture(b),this._addDecorations(b);{const v=b[3];this.zones.push({x:v.x+30,y:v.y+30,w:v.w-60,h:v.h-60,type:"healing",healRate:.06,label:"MEDIC STATION"})}{const v=b[5];this.zones.push({x:v.x+30,y:v.y+30,w:v.w-60,h:v.h-60,type:"healing",healRate:.025,label:"REST ZONE"})}{const v=b[7];this.zones.push({x:v.x+30,y:v.y+30,w:v.w-60,h:v.h-60,type:"healing",healRate:.04,label:"RECOVERY ZONE"})}{const v=b[6];this.zones.push({x:v.x+60,y:v.y+60,w:v.w-120,h:v.h-120,type:"damage",multiplier:1.75,label:"EXPLOSIVE ZONE"})}{const v=b[1];this.zones.push({x:v.x+v.w/4,y:v.y+v.h/4,w:v.w/2,h:v.h/2,type:"damage",multiplier:1.4,label:"EXPOSED AREA"})}const _=["health","ammo","adrenaline","ammo","overdrive"];this._spawnRandomConsumables(_,"pickup"),this._spawnCrates(),this.ambientLights={brokenCeiling:{x:731,y:701,radius:240,on:!0,innerRadius:20,color:"rgba(200, 230, 255, 0.25)",colorMid:"rgba(200, 230, 255, 0.08)",pulseType:"none",fixtureType:"brokenCeiling"},lantern:{x:1171,y:250,radius:180,on:!0,innerRadius:5,color:"rgba(255, 140, 40, 0.22)",colorMid:"rgba(255, 140, 40, 0.10)",pulseType:"lantern",fixtureType:"lantern"},kitchen:{x:260,y:250,radius:200,on:!0,innerRadius:10,color:"rgba(102, 252, 241, 0.20)",colorMid:"rgba(102, 252, 241, 0.08)",pulseType:"none",fixtureType:"kitchen"},garage:{x:260,y:1150,radius:220,on:!0,innerRadius:10,color:"rgba(255, 60, 60, 0.22)",colorMid:"rgba(255, 60, 60, 0.09)",pulseType:"garage",fixtureType:"garage"},bedroom2:{x:1171,y:1150,radius:190,on:!0,innerRadius:10,color:"rgba(255, 110, 247, 0.20)",colorMid:"rgba(255, 110, 247, 0.08)",pulseType:"none",fixtureType:"bedroom2"}}}generateCyberLabMap(){const r=this.width-40,o=this.height-40,l=450,c=950,d=450,f=950,h=l-40,u=c-l-22,g=r-c-22,y=d-40,m=f-d-22,p=o-f-22,b=[{x:40,y:40,w:h,h:y,name:"Cyber Lounge",floor:"cybercarpet"},{x:l+22,y:40,w:u,h:y,name:"Quantum Lab",floor:"cybergrid"},{x:c+22,y:40,w:g,h:y,name:"Security Hub",floor:"nanogrid"},{x:40,y:d+22,w:h,h:m,name:"Server Room",floor:"cybergrid"},{x:l+22,y:d+22,w:u,h:m,name:"AI Core",floor:"cybergrid"},{x:c+22,y:d+22,w:g,h:m,name:"Cryo Chambers",floor:"nanogrid"},{x:40,y:f+22,w:h,h:p,name:"Weaponry Depot",floor:"concrete"},{x:l+22,y:f+22,w:u,h:p,name:"Reactor Matrix",floor:"reactor"},{x:c+22,y:f+22,w:g,h:p,name:"Matrix Hall",floor:"cybercarpet"}];this.rooms=b,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(l,40,22,y,"v",Math.round(y*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l,d+22,22,m,"v",Math.round(m*.45-88/2),88,"wall","interior"),this._addWallWithDoorway(l,f+22,22,p,"v",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,40,22,y,"v",Math.round(y*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,d+22,22,m,"v",Math.round(m*.55-88/2),88,"wall","interior"),this._addWallWithDoorway(c,f+22,22,p,"v",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,d,h,22,"h",Math.round(h*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,d,u,22,"h",Math.round(u*.45-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,d,g,22,"h",Math.round(g*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,f,h,22,"h",Math.round(h*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,f,u,22,"h",Math.round(u*.55-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,f,g,22,"h",Math.round(g*.5-88/2),88,"wall","interior"),this._addCyberLabFurniture(b);{const v=b[1];this.zones.push({x:v.x+30,y:v.y+30,w:v.w-60,h:v.h-60,type:"healing",healRate:.05,label:"QUANTUM STABILIZER"})}{const v=b[5];this.zones.push({x:v.x+30,y:v.y+30,w:v.w-60,h:v.h-60,type:"healing",healRate:.035,label:"CRYO RECOVERY"})}{const v=b[7];this.zones.push({x:v.x+50,y:v.y+50,w:v.w-100,h:v.h-100,type:"damage",multiplier:2,label:"REACTOR ENERGY CORE"})}const _=["health","ammo","health","adrenaline","health","ammo","overdrive"];this._spawnRandomConsumables(_,"pickup_cyber"),this._spawnCrates(),this.ambientLights={aiCore:{x:700,y:700,radius:260,on:!0,innerRadius:20,color:"rgba(102, 252, 241, 0.28)",colorMid:"rgba(102, 252, 241, 0.12)",pulseType:"quantum",fixtureType:"reactor_light"},quantumLab:{x:700,y:250,radius:220,on:!0,innerRadius:10,color:"rgba(157, 59, 255, 0.26)",colorMid:"rgba(157, 59, 255, 0.10)",pulseType:"none",fixtureType:"quantum"},reactor:{x:700,y:1150,radius:240,on:!0,innerRadius:15,color:"rgba(255, 127, 59, 0.28)",colorMid:"rgba(255, 127, 59, 0.12)",pulseType:"garage",fixtureType:"reactor_light"},serverRoom:{x:250,y:700,radius:220,on:!0,innerRadius:10,color:"rgba(57, 219, 20, 0.24)",colorMid:"rgba(57, 219, 20, 0.09)",pulseType:"none",fixtureType:"server_rack_light"},cryo:{x:1150,y:700,radius:220,on:!0,innerRadius:10,color:"rgba(102, 252, 241, 0.24)",colorMid:"rgba(102, 252, 241, 0.09)",pulseType:"none",fixtureType:"cryo_light"}}}generateArenaMap(){const r=this.width-40,o=this.height-40,l=240,c=300,d=240,f=240,h=300,u=240,g=40+l,y=g+20+c,m=40+f,p=m+20+h,b=[{x:40,y:40,w:l,h:f,name:"Alpha Spawn",floor:"concrete"},{x:g+20,y:40,w:c,h:f,name:"North Gallery",floor:"wood"},{x:y+20,y:40,w:d,h:f,name:"Omega Spawn",floor:"concrete"},{x:40,y:m+20,w:l,h,name:"West Corridor",floor:"tiles"},{x:g+20,y:m+20,w:c,h,name:"Central Core",floor:"tiles"},{x:y+20,y:m+20,w:d,h,name:"East Corridor",floor:"tiles"},{x:40,y:p+20,w:l,h:u,name:"Supply Vault",floor:"carpet"},{x:g+20,y:p+20,w:c,h:u,name:"South Gallery",floor:"wood"},{x:y+20,y:p+20,w:d,h:u,name:"Server Annex",floor:"carpet"}];this.rooms=b,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(g,40,20,f,"v",Math.round(f*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(g,m+20,20,h,"v",Math.round(h*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(g,p+20,20,u,"v",Math.round(u*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(y,40,20,f,"v",Math.round(f*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(y,m+20,20,h,"v",Math.round(h*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(y,p+20,20,u,"v",Math.round(u*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(40,m,l,20,"h",Math.round(l*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(g+20,m,c,20,"h",Math.round(c*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(y+20,m,d,20,"h",Math.round(d*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(40,p,l,20,"h",Math.round(l*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(g+20,p,c,20,"h",Math.round(c*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(y+20,p,d,20,"h",Math.round(d*.5-80/2),80,"wall","interior");const _=b[4],v=E=>this._push({...E,type:"wall",material:"furniture"});v({x:_.x+40,y:_.y+40,w:40,h:40,label:"column"}),v({x:_.x+_.w-80,y:_.y+40,w:40,h:40,label:"column"}),v({x:_.x+40,y:_.y+_.h-80,w:40,h:40,label:"column"}),v({x:_.x+_.w-80,y:_.y+_.h-80,w:40,h:40,label:"column"}),this.zones.push({x:_.x+90,y:_.y+90,w:_.w-180,h:_.h-180,type:"healing",healRate:.05,label:"NANO MEDIC STATION"});const x=["health","ammo","adrenaline","overdrive"];this._spawnRandomConsumables(x,"pickup_arena"),this._spawnCrates(),this.ambientLights={centerSiren:{x:450,y:450,radius:180,on:!0,innerRadius:15,color:"rgba(102, 252, 241, 0.25)",colorMid:"rgba(102, 252, 241, 0.09)",pulseType:"quantum",fixtureType:"reactor_light"},alphaLight:{x:150,y:150,radius:150,on:!0,innerRadius:10,color:"rgba(255, 110, 247, 0.20)",colorMid:"rgba(255, 110, 247, 0.08)",pulseType:"none",fixtureType:"quantum"},omegaLight:{x:750,y:750,radius:150,on:!0,innerRadius:10,color:"rgba(255, 127, 59, 0.20)",colorMid:"rgba(255, 127, 59, 0.08)",pulseType:"none",fixtureType:"quantum"}}}_addCyberLabFurniture(e){const t=h=>this._push({...h,type:"wall",material:"furniture"}),i=e[0];t({x:i.x+50,y:i.y+50,w:90,h:32,label:"cyber_couch"}),t({x:i.x+50,y:i.y+120,w:90,h:32,label:"cyber_couch"}),t({x:i.x+i.w-82,y:i.y+50,w:32,h:100,label:"cyber_couch"}),t({x:i.x+i.w-150,y:i.y+80,w:45,h:45,label:"table"}),t({x:i.x+20,y:i.y+i.h-60,w:24,h:24,label:"plant"}),t({x:i.x+i.w-50,y:i.y+i.h-60,w:24,h:24,label:"plant"});const s=e[1];t({x:s.x+30,y:s.y+30,w:35,h:35,label:"containment_pod"}),t({x:s.x+s.w-65,y:s.y+30,w:35,h:35,label:"containment_pod"}),t({x:s.x+s.w/2-40,y:s.y+s.h-40,w:80,h:28,label:"cyber_console"}),t({x:s.x+30,y:s.y+s.h-100,w:35,h:35,label:"nano_charger"});const a=e[2];t({x:a.x+20,y:a.y+20,w:25,h:180,label:"shelf"}),t({x:a.x+70,y:a.y+60,w:100,h:40,label:"desk"}),t({x:a.x+105,y:a.y+110,w:30,h:30,label:"chair"});const r=e[3];t({x:r.x+40,y:r.y+30,w:24,h:100,label:"server_rack"}),t({x:r.x+110,y:r.y+30,w:24,h:100,label:"server_rack"}),t({x:r.x+40,y:r.y+190,w:24,h:100,label:"server_rack"}),t({x:r.x+110,y:r.y+190,w:24,h:100,label:"server_rack"}),t({x:r.x+r.w-50,y:r.y+r.h/2-30,w:32,h:60,label:"cyber_console"});const o=e[4];t({x:o.x+o.w/2-40,y:o.y+o.h/2-40,w:80,h:80,label:"reactor_core"}),t({x:o.x+40,y:o.y+o.h/2-15,w:45,h:30,label:"cyber_console"}),t({x:o.x+o.w-85,y:o.y+o.h/2-15,w:45,h:30,label:"cyber_console"}),t({x:o.x+o.w/2-22,y:o.y+40,w:44,h:28,label:"cyber_console"}),t({x:o.x+o.w/2-22,y:o.y+o.h-68,w:44,h:28,label:"cyber_console"});const l=e[5];t({x:l.x+30,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+85,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+140,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+l.w-50,y:l.y+l.h-100,w:32,h:65,label:"cyber_console"});const c=e[6];t({x:c.x+30,y:c.y+30,w:120,h:45,label:"desk"}),t({x:c.x+30,y:c.y+110,w:35,h:80,label:"cabinet"}),t({x:c.x+c.w-60,y:c.y+30,w:40,h:100,label:"shelf"});const d=e[7];t({x:d.x+d.w/2-30,y:d.y+d.h/2-30,w:60,h:60,label:"reactor_core"}),t({x:d.x+30,y:d.y+30,w:24,h:24,label:"plant"}),t({x:d.x+d.w-54,y:d.y+30,w:24,h:24,label:"plant"});const f=e[8];t({x:f.x+f.w/2-25,y:f.y+40,w:50,h:50,label:"table"}),t({x:f.x+50,y:f.y+f.h-70,w:80,h:32,label:"cyber_couch"}),t({x:f.x+f.w-130,y:f.y+f.h-70,w:80,h:32,label:"cyber_couch"})}_push(e){this.walls.push(e)}_addWallWithDoorway(e,t,i,s,a,r,o,l,c){if(a==="v"){const d=s,f=Math.max(12,Math.min(d-o-12,r)),h=f+o;f>0&&this._push({x:e,y:t,w:i,h:f,type:l,material:c}),h<d&&this._push({x:e,y:t+h,w:i,h:d-h,type:l,material:c})}else{const d=i,f=Math.max(12,Math.min(d-o-12,r)),h=f+o;f>0&&this._push({x:e,y:t,w:f,h:s,type:l,material:c}),h<d&&this._push({x:e+h,y:t,w:d-h,h:s,type:l,material:c})}}_addFurniture(e){const t=u=>this._push({...u,type:"wall",material:"furniture"}),i=u=>this._push({...u,type:"crate",health:40,maxHealth:40,material:"barrel"}),s=e[0];t({x:s.x+12,y:s.y+12,w:s.w-24,h:28,label:"counter"}),t({x:s.x+12,y:s.y+40,w:28,h:s.h/2-10,label:"counter"}),t({x:s.x+80,y:s.y+s.h-110,w:110,h:60,label:"table"}),t({x:s.x+80+42,y:s.y+s.h-138,w:26,h:26,label:"chair"}),t({x:s.x+80+42,y:s.y+s.h-48,w:26,h:26,label:"chair"}),t({x:s.x+18,y:s.y+s.h-50,w:24,h:24,label:"plant"}),t({x:s.x+s.w-60,y:s.y+12,w:40,h:80,label:"fridge"});const a=e[1];t({x:a.x+55,y:a.y+55,w:190,h:42,label:"sofa"}),t({x:a.x+55,y:a.y+97,w:42,h:90,label:"sofa"}),t({x:a.x+18,y:a.y+110,w:38,h:42,label:"sofa"}),t({x:a.x+a.w/2-55,y:a.y+130,w:110,h:55,label:"table"}),t({x:a.x+a.w-55,y:a.y+65,w:30,h:120,label:"tv"}),t({x:a.x+a.w-55,y:a.y+a.h-100,w:30,h:80,label:"shelf"}),t({x:a.x+a.w-50,y:a.y+18,w:24,h:24,label:"plant"});const r=e[2];t({x:r.x+18,y:r.y+18,w:140,h:52,label:"desk"}),t({x:r.x+18+55,y:r.y+18+56,w:30,h:30,label:"chair"}),t({x:r.x+r.w-38,y:r.y+12,w:22,h:210,label:"shelf"}),t({x:r.x+18,y:r.y+r.h-60,w:80,h:40,label:"cabinet"}),t({x:r.x+r.w-50,y:r.y+r.h-50,w:24,h:24,label:"plant"});const o=e[3];t({x:o.x+12,y:o.y+12,w:90,h:130,label:"tub"}),t({x:o.x+12,y:o.y+o.h-58,w:65,h:38,label:"sink"}),t({x:o.x+o.w-50,y:o.y+12,w:35,h:55,label:"cabinet"}),t({x:o.x+o.w-45,y:o.y+o.h-60,w:28,h:38,label:"toilet"});const l=e[4];t({x:l.x+l.w/2-80,y:l.y+l.h/2-45,w:160,h:90,label:"table"}),t({x:l.x+l.w/2-60,y:l.y+l.h/2-80,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2+30,y:l.y+l.h/2-80,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2-60,y:l.y+l.h/2+90,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2+30,y:l.y+l.h/2+90,w:26,h:26,label:"chair"});const c=e[5];t({x:c.x+12,y:c.y+20,w:115,h:80,label:"bed"}),t({x:c.x+12+120,y:c.y+20,w:32,h:32,label:"dresser"}),t({x:c.x+c.w-52,y:c.y+12,w:36,h:55,label:"dresser"}),t({x:c.x+c.w-52,y:c.y+80,w:36,h:55,label:"cabinet"}),t({x:c.x+12,y:c.y+c.h-90,w:80,h:40,label:"desk"}),t({x:c.x+12+27,y:c.y+c.h-46,w:26,h:26,label:"chair"});const d=e[6];t({x:d.x+40,y:d.y+75,w:210,h:130,label:"car"}),t({x:d.x+12,y:d.y+d.h-48,w:160,h:30,label:"bench"}),i({x:d.x+d.w-65,y:d.y+45,w:38,h:38,id:"barrel_0"}),i({x:d.x+d.w-65,y:d.y+93,w:38,h:38,id:"barrel_1"}),i({x:d.x+d.w-65,y:d.y+141,w:38,h:38,id:"barrel_2"});const f=e[7];t({x:f.x+f.w/2-90,y:f.y+18,w:180,h:110,label:"bed"}),t({x:f.x+f.w/2-130,y:f.y+18,w:32,h:32,label:"dresser"}),t({x:f.x+f.w/2+100,y:f.y+18,w:32,h:32,label:"dresser"}),t({x:f.x+12,y:f.y+12,w:45,h:65,label:"dresser"}),t({x:f.x+f.w-60,y:f.y+12,w:45,h:65,label:"dresser"}),t({x:f.x+18,y:f.y+f.h-50,w:24,h:24,label:"plant"});const h=e[8];t({x:h.x+12,y:h.y+20,w:130,h:90,label:"bed"}),t({x:h.x+12+135,y:h.y+20,w:32,h:32,label:"dresser"}),t({x:h.x+h.w-55,y:h.y+12,w:38,h:110,label:"shelf"}),t({x:h.x+h.w-110,y:h.y+h.h-60,w:90,h:40,label:"desk"}),t({x:h.x+h.w-78,y:h.y+h.h-95,w:26,h:26,label:"chair"}),t({x:h.x+12,y:h.y+h.h-55,w:80,h:38,label:"cabinet"})}_spawnCrates(){let i=0,s=0;for(;i<14&&s<400;){s++;const a=this.rng.range(60,this.width-100),r=this.rng.range(60,this.height-100);if(a<250&&r<250||a>this.width-250&&r>this.height-250||a<250&&r>this.height-250||a>this.width-250&&r<250)continue;let o=!1;const l=14;for(const c of this.walls)if(a+44+l>c.x&&a-l<c.x+c.w&&r+44+l>c.y&&r-l<c.y+c.h){o=!0;break}o||(this._push({x:a,y:r,w:44,h:44,type:"crate",health:50,maxHealth:50,id:`crate_${i}`,material:"crate"}),i++)}}_spawnRandomConsumables(e,t){e.forEach((s,a)=>{let r=!1,o=0;for(;!r&&o<150;){o++;const l=Math.floor(this.rng.next()*this.rooms.length),c=this.rooms[l],d=40,f=this.rng.range(c.x+d,c.x+c.w-d),h=this.rng.range(c.y+d,c.y+c.h-d);let u=!1;for(const g of this.walls)if(f+30>g.x&&f-30<g.x+g.w&&h+30>g.y&&h-30<g.y+g.h){u=!0;break}f<250&&h<250&&(u=!0),f>this.width-250&&h>this.height-250&&(u=!0),f<250&&h>this.height-250&&(u=!0),f>this.width-250&&h<250&&(u=!0),u||(this.items.push({id:`${t}_${a}`,x:f,y:h,type:s,active:!0}),r=!0)}if(!r){const l=Math.floor(this.rng.next()*this.rooms.length),c=this.rooms[l];this.items.push({id:`${t}_${a}`,x:c.x+c.w/2,y:c.y+c.h/2,type:s,active:!0})}})}checkZone(e,t){for(const i of this.zones)if(e>=i.x&&e<=i.x+i.w&&t>=i.y&&t<=i.y+i.h)return i;return null}rebuildSegments(){this.segments=[],this.walls.forEach(e=>{this.segments.push({p1:{x:e.x,y:e.y},p2:{x:e.x+e.w,y:e.y}}),this.segments.push({p1:{x:e.x+e.w,y:e.y},p2:{x:e.x+e.w,y:e.y+e.h}}),this.segments.push({p1:{x:e.x+e.w,y:e.y+e.h},p2:{x:e.x,y:e.y+e.h}}),this.segments.push({p1:{x:e.x,y:e.y+e.h},p2:{x:e.x,y:e.y}})})}checkCircleCollision(e,t,i){let s=e,a=t;for(const r of this.walls){const o=Math.max(r.x,Math.min(s,r.x+r.w)),l=Math.max(r.y,Math.min(a,r.y+r.h)),c=s-o,d=a-l,f=c*c+d*d;if(f<i*i){const h=Math.sqrt(f);if(h===0)continue;const u=i-h;s+=c/h*u,a+=d/h*u}}return{x:s,y:a}}getLineIntersection(e,t){let i=null;for(const s of this.walls){const a=[{p1:{x:s.x,y:s.y},p2:{x:s.x+s.w,y:s.y}},{p1:{x:s.x+s.w,y:s.y},p2:{x:s.x+s.w,y:s.y+s.h}},{p1:{x:s.x+s.w,y:s.y+s.h},p2:{x:s.x,y:s.y+s.h}},{p1:{x:s.x,y:s.y+s.h},p2:{x:s.x,y:s.y}}];for(const r of a){const o=this.getLineSegmentIntersection(e,t,r.p1,r.p2);if(o){const l=o.x-e.x,c=o.y-e.y,d=Math.sqrt(l*l+c*c);(!i||d<i.dist)&&(i={x:o.x,y:o.y,dist:d,wall:s})}}}return i}getLineSegmentIntersection(e,t,i,s){const a=t.x-e.x,r=t.y-e.y,o=s.x-i.x,l=s.y-i.y,c=-o*r+a*l;if(Math.abs(c)<1e-9)return null;const d=(-r*(e.x-i.x)+a*(e.y-i.y))/c,f=(o*(e.y-i.y)-l*(e.x-i.x))/c;return d>=0&&d<=1&&f>=0&&f<=1?{x:e.x+f*a,y:e.y+f*r}:null}damageCrate(e,t){const i=this.walls.findIndex(a=>a.id===e);if(i===-1)return null;const s=this.walls[i];if(s.health-=t,s.health<=0){this.walls.splice(i,1),this.rebuildSegments();let a=null;if(this.rng.next()<.5){const r=this.rng.next();let o="health";r<.4?o="health":r<.7?o="ammo":r<.85?o="adrenaline":o="overdrive",a={id:`item_${e}_${Date.now()}`,x:s.x+s.w/2,y:s.y+s.h/2,type:o,active:!0},this.items.push(a)}return{broken:!0,item:a,crateX:s.x+s.w/2,crateY:s.y+s.h/2}}return{broken:!1,health:s.health}}syncBreakCrate(e,t){const i=this.walls.findIndex(s=>s.id===e);i!==-1&&(this.walls.splice(i,1),this.rebuildSegments()),t&&!this.items.some(s=>s.id===t.id)&&this.items.push(t)}computeVisibilityPolygon(e,t,i,s=null,a=null){const r=new Set,o=f=>{let h=f;for(;h<-Math.PI;)h+=Math.PI*2;for(;h>Math.PI;)h-=Math.PI*2;return h},l=f=>{if(s===null||a===null)return!0;let h=f-s;for(;h<-Math.PI;)h+=Math.PI*2;for(;h>Math.PI;)h-=Math.PI*2;return Math.abs(h)<=a/2};if(this.walls.forEach(f=>{[{x:f.x,y:f.y},{x:f.x+f.w,y:f.y},{x:f.x+f.w,y:f.y+f.h},{x:f.x,y:f.y+f.h}].forEach(h=>{const u=Math.atan2(h.y-t,h.x-e);l(u)&&(r.add(o(u-1e-4)),r.add(u),r.add(o(u+1e-4)))})}),s!==null&&a!==null){const f=s-a/2,h=s+a/2;r.add(o(f)),r.add(o(h));for(let u=f;u<h;u+=Math.PI/18)r.add(o(u))}else for(let f=-Math.PI;f<Math.PI;f+=Math.PI/10)r.add(f);const c=[];r.forEach(f=>{const h={x:e+Math.cos(f)*i,y:t+Math.sin(f)*i},u=this.getLineIntersection({x:e,y:t},h);c.push(u&&u.dist<i?{x:u.x,y:u.y,angle:f}:{...h,angle:f})});const d=s!==null?s:0;return c.sort((f,h)=>{let u=f.angle-d;for(;u<-Math.PI;)u+=Math.PI*2;for(;u>Math.PI;)u-=Math.PI*2;let g=h.angle-d;for(;g<-Math.PI;)g+=Math.PI*2;for(;g>Math.PI;)g-=Math.PI*2;return u-g}),s!==null&&a!==null&&(c.unshift({x:e,y:t,angle:-999}),c.push({x:e,y:t,angle:999})),c}draw(e,t={shadows:!0},i=[],s=null,a=[]){this.rooms.forEach(l=>this._drawFloor(e,l)),this.decorations.forEach(l=>this._drawDecoration(e,l)),this.zones.forEach(l=>this._drawZone(e,l)),this.items.forEach(l=>{l.active&&this._drawItem(e,l)}),e.save();let r=this.width/2,o=this.height/2;if(s&&(r=s.x,o=s.y),this.walls.forEach(l=>this._drawWall(e,l,r,o)),e.restore(),this.terminals&&this.terminals.forEach(l=>{l.active&&this._drawTerminal(e,l)}),t.shadows&&i&&i.length>0){this.maskCanvas||(this.maskCanvas=document.createElement("canvas"),this.maskCtx=this.maskCanvas.getContext("2d"));const l=e.canvas.width,c=e.canvas.height;(this.maskCanvas.width!==l||this.maskCanvas.height!==c)&&(this.maskCanvas.width=l,this.maskCanvas.height=c),this.maskCtx.fillStyle="rgba(3, 4, 6, 0.995)",this.maskCtx.fillRect(0,0,l,c),this.maskCtx.save(),this.maskCtx.setTransform(e.getTransform());const d=Date.now(),h=Math.sin(d*.04)*Math.cos(d*.007)+Math.sin(d*.1)*.5>-.45;this.ambientLights.brokenCeiling&&(this.ambientLights.brokenCeiling.on=h),this.maskCtx.globalCompositeOperation="destination-out",this.maskCtx.fillStyle="white";for(const[u,g]of Object.entries(this.ambientLights)){if(!g.on)continue;const y=g.pulseType==="garage"?1+Math.sin(d/300)*.05:g.pulseType==="lantern"?1+Math.sin(d/200)*.04:g.pulseType==="quantum"?1+Math.sin(d/150)*.03:1,m=g.radius*y,p=this.maskCtx.createRadialGradient(g.x,g.y,g.innerRadius||10,g.x,g.y,m);p.addColorStop(0,"rgba(255, 255, 255, 1.0)"),p.addColorStop(.5,"rgba(255, 255, 255, 0.45)"),p.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=p,this.maskCtx.beginPath(),this.maskCtx.arc(g.x,g.y,m,0,Math.PI*2),this.maskCtx.fill()}i.forEach(u=>{if(!(u.health<=0)){if(u.flashlightActive&&u.lightPoly&&u.lightPoly.length>0){this.maskCtx.beginPath(),this.maskCtx.moveTo(u.lightPoly[0].x,u.lightPoly[0].y);for(let g=1;g<u.lightPoly.length;g++)this.maskCtx.lineTo(u.lightPoly[g].x,u.lightPoly[g].y);this.maskCtx.closePath(),this.maskCtx.fillStyle="white",this.maskCtx.fill()}if(window.gameEngine&&window.gameEngine.matchMode==="sabotage"&&u.isLocal){const g=this.maskCtx.createRadialGradient(u.x,u.y,10,u.x,u.y,150);g.addColorStop(0,"rgba(255, 255, 255, 1.0)"),g.addColorStop(.7,"rgba(255, 255, 255, 0.45)"),g.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=g,this.maskCtx.beginPath(),this.maskCtx.arc(u.x,u.y,150,0,Math.PI*2),this.maskCtx.fill()}}}),a&&a.length>0&&a.forEach(u=>{if(!u.active)return;const g=this.maskCtx.createRadialGradient(u.x,u.y,5,u.x,u.y,60);g.addColorStop(0,"rgba(255, 255, 255, 1.0)"),g.addColorStop(.5,"rgba(255, 255, 255, 0.45)"),g.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=g,this.maskCtx.beginPath(),this.maskCtx.arc(u.x,u.y,60,0,Math.PI*2),this.maskCtx.fill()}),i.forEach(u=>{if(u.health>0&&u.muzzleFlash>.15){const g=u.x+Math.cos(u.angle)*28,y=u.y+Math.sin(u.angle)*28,m=this.maskCtx.createRadialGradient(g,y,10,g,y,180*u.muzzleFlash);m.addColorStop(0,"rgba(255, 255, 255, 1.0)"),m.addColorStop(.4,"rgba(255, 255, 255, 0.5)"),m.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=m,this.maskCtx.beginPath(),this.maskCtx.arc(g,y,180*u.muzzleFlash,0,Math.PI*2),this.maskCtx.fill()}}),this.maskCtx.restore(),e.save(),e.setTransform(1,0,0,1,0,0),e.drawImage(this.maskCanvas,0,0),e.restore(),i.forEach(u=>{if(u.health>0&&u.flashlightActive&&u.lightPoly&&u.lightPoly.length>0){e.save(),e.beginPath(),e.moveTo(u.lightPoly[0].x,u.lightPoly[0].y);for(let x=1;x<u.lightPoly.length;x++)e.lineTo(u.lightPoly[x].x,u.lightPoly[x].y);e.closePath(),e.clip();const g=u.x,y=u.y,m=700,p=g+Math.cos(u.angle)*m,b=y+Math.sin(u.angle)*m,_=e.createLinearGradient(g,y,p,b);_.addColorStop(0,"rgba(255, 255, 230, 0.18)"),_.addColorStop(.35,"rgba(255, 255, 245, 0.10)"),_.addColorStop(1,"rgba(255, 255, 255, 0.0)"),e.fillStyle=_,e.fill();const v=e.createRadialGradient(g,y,10,g,y,100);v.addColorStop(0,"rgba(255, 255, 220, 0.08)"),v.addColorStop(1,"rgba(255, 255, 220, 0.0)"),e.fillStyle=v,e.fill(),e.restore()}}),e.save();for(const[u,g]of Object.entries(this.ambientLights)){if(!g.on)continue;const y=g.pulseType==="garage"?1+Math.sin(d/300)*.05:g.pulseType==="lantern"?1+Math.sin(d/200)*.04:g.pulseType==="quantum"?1+Math.sin(d/150)*.03:1,m=g.radius*y,p=e.createRadialGradient(g.x,g.y,g.innerRadius||5,g.x,g.y,m);p.addColorStop(0,g.color),p.addColorStop(.5,g.colorMid),p.addColorStop(1,"rgba(0, 0, 0, 0.0)"),e.fillStyle=p,e.beginPath(),e.arc(g.x,g.y,m,0,Math.PI*2),e.fill(),this._drawLightFixture(e,g,d)}e.restore()}}_drawLightFixture(e,t,i){const s=t.fixtureType;if(e.save(),s==="lantern")e.fillStyle="#222",e.strokeStyle="#d4af37",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="rgba(255, 180, 50, 0.9)",e.beginPath(),e.arc(t.x,t.y,3,0,Math.PI*2),e.fill();else if(s==="brokenCeiling")e.fillStyle="#333",e.strokeStyle="#555",e.lineWidth=1,e.fillRect(t.x-16,t.y-4,32,8),e.strokeRect(t.x-16,t.y-4,32,8),e.fillStyle=t.on?"#fff":"#111",e.shadowColor=t.on?"#6cf":"transparent",e.shadowBlur=t.on?10:0,e.fillRect(t.x-12,t.y-2,24,4),e.shadowBlur=0;else if(s==="kitchen")e.fillStyle="#333",e.strokeStyle="#555",e.lineWidth=1,e.fillRect(t.x-12,t.y-12,24,24),e.strokeRect(t.x-12,t.y-12,24,24),e.fillStyle="#66fcf1",e.beginPath(),e.arc(t.x,t.y,5,0,Math.PI*2),e.fill();else if(s==="garage")e.fillStyle="#222",e.strokeStyle="#ff3c3c",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ff3c3c",e.beginPath(),e.arc(t.x,t.y,3.5,0,Math.PI*2),e.fill();else if(s==="bedroom2")e.fillStyle="#2d1822",e.strokeStyle="#ff6ef7",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,9,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ff6ef7",e.beginPath(),e.arc(t.x,t.y,4,0,Math.PI*2),e.fill();else if(s==="quantum"){e.fillStyle="#100c1e",e.strokeStyle="#9d3bff",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,10,0,Math.PI*2),e.fill(),e.stroke();const a=i/100%(Math.PI*2);e.strokeStyle="#d473ff",e.lineWidth=1,e.beginPath(),e.moveTo(t.x-Math.cos(a)*8,t.y-Math.sin(a)*8),e.lineTo(t.x+Math.cos(a)*8,t.y+Math.sin(a)*8),e.stroke()}else s==="reactor_light"?(e.fillStyle="#201005",e.strokeStyle="#ff7f3b",e.lineWidth=2,e.beginPath(),e.arc(t.x,t.y,12,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x,t.y,6+Math.sin(i/200)*1.5,0,Math.PI*2),e.fill()):(s==="server_rack_light"||s==="cryo_light")&&(e.fillStyle="#111",e.strokeStyle=s==="cryo_light"?"#66fcf1":"#39db14",e.lineWidth=1.5,e.fillRect(t.x-6,t.y-6,12,12),e.strokeRect(t.x-6,t.y-6,12,12),e.fillStyle=s==="cryo_light"?"#66fcf1":"#39db14",e.beginPath(),e.arc(t.x,t.y,3,0,Math.PI*2),e.fill());e.restore()}isPointInAmbientLight(e,t,i=0){for(const[s,a]of Object.entries(this.ambientLights)){if(!a.on)continue;if(Math.hypot(e-a.x,t-a.y)<a.radius+i&&!this.getLineIntersection({x:a.x,y:a.y},{x:e,y:t}))return!0}return!1}_addDecorations(e){this.decorations=[];const t=e[0];this.decorations.push({x:t.x+50,y:t.y+55,w:120,h:40,type:"rug",style:"kitchen"});const i=e[1];this.decorations.push({x:i.x+i.w/2-120,y:i.y+110,w:240,h:160,type:"rug",style:"living"});const s=e[2];this.decorations.push({x:s.x+40,y:s.y+80,w:160,h:120,type:"rug",style:"office"});const a=e[3];this.decorations.push({x:a.x+110,y:a.y+40,w:60,h:90,type:"rug",style:"bath"});const r=e[4];this.decorations.push({x:r.x+r.w/2-180,y:r.y+40,w:360,h:60,type:"rug",style:"runner"});const o=e[5];this.decorations.push({x:o.x+30,y:o.y+110,w:140,h:160,type:"rug",style:"bedroom"});const l=e[7];this.decorations.push({x:l.x+l.w/2-120,y:l.y+80,w:240,h:220,type:"rug",style:"master"});const c=e[8];this.decorations.push({x:c.x+c.w/2-70,y:c.y+c.h/2-70,w:140,h:140,type:"rug",style:"circular"})}_drawDecoration(e,t){if(e.save(),t.type==="rug"){e.fillStyle="rgba(0,0,0,0.15)",e.fillRect(t.x+2,t.y+2,t.w,t.h);const s={kitchen:{bg:"#3a2d1f",border:"#aa8c66",text:"#55422d"},living:{bg:"#3b1c1c",border:"#d4af37",text:"#802020"},office:{bg:"#1c2d3b",border:"#66fcf1",text:"#204060"},bath:{bg:"#1f3c3a",border:"#39db14",text:"#152b2a"},runner:{bg:"#2b203c",border:"#9d3bff",text:"#4c2e73"},bedroom:{bg:"#3c3020",border:"#ffe6a3",text:"#5c4930"},master:{bg:"#222d32",border:"#66fcf1",text:"#435e6a"},circular:{bg:"#2d1822",border:"#ff6ef7",text:"#5e2540"}}[t.style]||{bg:"#222",border:"#444",text:"#333"};if(e.fillStyle=s.bg,e.strokeStyle=s.border,e.lineWidth=2,t.style==="circular")e.beginPath(),e.arc(t.x+t.w/2,t.y+t.h/2,t.w/2,0,Math.PI*2),e.fill(),e.stroke(),e.strokeStyle=s.text,e.lineWidth=1.5,e.beginPath(),e.arc(t.x+t.w/2,t.y+t.h/2,t.w/3,0,Math.PI*2),e.stroke();else{if(e.beginPath(),e.roundRect?e.roundRect(t.x,t.y,t.w,t.h,6):e.rect(t.x,t.y,t.w,t.h),e.fill(),e.stroke(),e.strokeStyle=s.border,e.lineWidth=1,e.beginPath(),t.w>t.h)for(let a=t.y+4;a<t.y+t.h;a+=6)e.moveTo(t.x,a),e.lineTo(t.x-4,a),e.moveTo(t.x+t.w,a),e.lineTo(t.x+t.w+4,a);else for(let a=t.x+4;a<t.x+t.w;a+=6)e.moveTo(a,t.y),e.lineTo(a,t.y-4),e.moveTo(a,t.y+t.h),e.lineTo(a,t.y+t.h+4);e.stroke()}}e.restore()}_drawFloor(e,t){if(e.save(),e.beginPath(),e.rect(t.x,t.y,t.w,t.h),e.clip(),t.floor==="tiles"){e.fillStyle="#121a28",e.fillRect(t.x,t.y,t.w,t.h);const i=44;for(let s=t.x;s<t.x+t.w;s+=i)for(let a=t.y;a<t.y+t.h;a+=i){const r=(Math.floor((s-t.x)/i)+Math.floor((a-t.y)/i))%2===0;e.fillStyle=r?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.04)",e.fillRect(s,a,i,i)}e.strokeStyle="rgba(40,80,120,0.25)",e.lineWidth=1;for(let s=t.x;s<=t.x+t.w;s+=i)e.beginPath(),e.moveTo(s,t.y),e.lineTo(s,t.y+t.h),e.stroke();for(let s=t.y;s<=t.y+t.h;s+=i)e.beginPath(),e.moveTo(t.x,s),e.lineTo(t.x+t.w,s),e.stroke()}else if(t.floor==="carpet"){e.fillStyle="#16102a",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(80,50,140,0.12)",e.lineWidth=1;for(let i=t.x;i<=t.x+t.w;i+=9)e.beginPath(),e.moveTo(i,t.y),e.lineTo(i,t.y+t.h),e.stroke();for(let i=t.y;i<=t.y+t.h;i+=9)e.beginPath(),e.moveTo(t.x,i),e.lineTo(t.x+t.w,i),e.stroke();e.strokeStyle="rgba(120,80,200,0.15)",e.lineWidth=3,e.strokeRect(t.x+15,t.y+15,t.w-30,t.h-30)}else if(t.floor==="wood"){e.fillStyle="#1a1208",e.fillRect(t.x,t.y,t.w,t.h);const i=32;for(let s=t.y;s<t.y+t.h;s+=i){const a=Math.floor((s-t.y)/i);e.fillStyle=a%2===0?"rgba(180,110,50,0.055)":"rgba(130,75,30,0.055)",e.fillRect(t.x,s,t.w,i-1),e.strokeStyle="rgba(70,45,18,0.35)",e.lineWidth=1,e.beginPath(),e.moveTo(t.x,s+i-1),e.lineTo(t.x+t.w,s+i-1),e.stroke(),e.strokeStyle="rgba(140,90,40,0.07)";for(let r=t.x+10;r<t.x+t.w-10;r+=t.w/5)e.beginPath(),e.moveTo(r,s),e.lineTo(r+12,s+i-1),e.stroke()}}else if(t.floor==="concrete"){e.fillStyle="#10101a",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(55,55,80,0.25)",e.lineWidth=1;const i=64;for(let s=t.x;s<=t.x+t.w;s+=i)e.beginPath(),e.moveTo(s,t.y),e.lineTo(s,t.y+t.h),e.stroke();for(let s=t.y;s<=t.y+t.h;s+=i)e.beginPath(),e.moveTo(t.x,s),e.lineTo(t.x+t.w,s),e.stroke();if(t.name==="Garage")e.fillStyle="rgba(30,25,10,0.4)",e.beginPath(),e.ellipse(t.x+150,t.y+230,60,30,.3,0,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(t.x+80,t.y+150,40,20,-.2,0,Math.PI*2),e.fill();else if(t.name==="Weaponry Depot"){e.strokeStyle="rgba(212, 175, 55, 0.15)",e.lineWidth=12,e.beginPath();for(let s=t.x;s<t.x+t.w;s+=60)e.moveTo(s,t.y),e.lineTo(s+40,t.y+40),e.moveTo(s,t.y+t.h-40),e.lineTo(s+40,t.y+t.h);e.stroke()}}else if(t.floor==="cybergrid"){e.fillStyle="#060a12",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(102, 252, 241, 0.08)",e.lineWidth=1;const i=50;for(let r=t.x;r<=t.x+t.w;r+=i)e.beginPath(),e.moveTo(r,t.y),e.lineTo(r,t.y+t.h),e.stroke();for(let r=t.y;r<=t.y+t.h;r+=i)e.beginPath(),e.moveTo(t.x,r),e.lineTo(t.x+t.w,r),e.stroke();const s=Date.now(),a=2+Math.sin(s/400)*.8;e.fillStyle="rgba(102, 252, 241, 0.45)";for(let r=t.x+i;r<t.x+t.w;r+=i)for(let o=t.y+i;o<t.y+t.h;o+=i)e.beginPath(),e.arc(r,o,a,0,Math.PI*2),e.fill()}else if(t.floor==="reactor"){e.fillStyle="#0f0a07",e.fillRect(t.x,t.y,t.w,t.h);const i=Date.now(),s=t.x+t.w/2,a=t.y+t.h/2;e.strokeStyle="rgba(255, 127, 59, 0.15)",e.lineWidth=4,e.strokeRect(t.x+8,t.y+8,t.w-16,t.h-16),e.lineWidth=2.5;const r=5;for(let l=1;l<=r;l++){const c=l*28,d=Math.sin(i/250-l*.5)*.15+.85;e.strokeStyle=`rgba(255, 127, 59, ${.08+(1-l/r)*.22})`,e.beginPath(),e.arc(s,a,c*d,0,Math.PI*2),e.stroke()}e.strokeStyle="rgba(255, 150, 80, 0.4)",e.lineWidth=1.5;const o=i/800%(Math.PI*2);e.beginPath(),e.arc(s,a,70,o,o+Math.PI*.4),e.stroke(),e.beginPath(),e.arc(s,a,110,o+Math.PI,o+Math.PI*1.4),e.stroke()}else if(t.floor==="nanogrid"){e.fillStyle="#050c08",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(57, 219, 20, 0.08)",e.lineWidth=1;const i=60;for(let r=t.x+30;r<t.x+t.w;r+=i)e.beginPath(),e.moveTo(r,t.y),e.lineTo(r,t.y+t.h),e.stroke();e.strokeStyle="rgba(57, 219, 20, 0.05)";for(let r=t.y+40;r<t.y+t.h;r+=80)e.beginPath(),e.moveTo(t.x,r),e.lineTo(t.x+t.w*.35,r),e.lineTo(t.x+t.w*.45,r-25),e.lineTo(t.x+t.w,r-25),e.stroke();const s=Date.now();e.fillStyle="rgba(57, 219, 20, 0.6)";const a=Math.floor(t.x*.7+t.y*1.3);for(let r=0;r<6;r++){const o=t.x+30+(a+r*39)%(t.w-60),l=t.y+30+(a*11+r*87)%(t.h-60);Math.floor(s/200+r)%3===0&&e.fillRect(o-2,l-2,4,4)}}else if(t.floor==="cybercarpet"){e.fillStyle="#0f081d",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(157, 59, 255, 0.04)",e.lineWidth=1.5;const i=30,s=i*Math.sqrt(3),a=i*2;for(let r=t.x-s;r<t.x+t.w+s;r+=s)for(let o=t.y-a;o<t.y+t.h+a;o+=a*.75){const l=Math.floor(o/(a*.75))%2*(s/2),c=r+l,d=o;e.beginPath();for(let f=0;f<6;f++){const h=f*Math.PI/3,u=c+i*Math.cos(h),g=d+i*Math.sin(h);f===0?e.moveTo(u,g):e.lineTo(u,g)}e.closePath(),e.stroke()}e.strokeStyle="rgba(157, 59, 255, 0.12)",e.lineWidth=3,e.strokeRect(t.x+20,t.y+20,t.w-40,t.h-40)}e.textAlign="center",e.font="bold 12px Orbitron",e.fillStyle="rgba(120,200,240,0.15)",e.fillText(t.name.toUpperCase(),t.x+t.w/2,t.y+22),e.restore()}_drawZone(e,t){e.save();const i=Math.sin(Date.now()/600)*.12+.12,s=t.type==="healing";e.fillStyle=s?`rgba(30,255,100,${i})`:`rgba(255,60,20,${i})`,e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle=s?`rgba(60,255,130,${i*2})`:`rgba(255,90,40,${i*2})`,e.lineWidth=2,e.setLineDash([8,8]),e.lineDashOffset=-(Date.now()/60%16),e.strokeRect(t.x,t.y,t.w,t.h),e.setLineDash([]);const a=14;e.lineWidth=2.5,[[t.x,t.y,1,1],[t.x+t.w,t.y,-1,1],[t.x,t.y+t.h,1,-1],[t.x+t.w,t.y+t.h,-1,-1]].forEach(([o,l,c,d])=>{e.beginPath(),e.moveTo(o,l+d*a),e.lineTo(o,l),e.lineTo(o+c*a,l),e.stroke()}),e.textAlign="center",e.font="bold 11px Orbitron",e.fillStyle=s?"rgba(80,255,140,0.55)":"rgba(255,110,60,0.55)",e.fillText(t.label,t.x+t.w/2,t.y+t.h/2-6);const r=s?`+${(t.healRate*60).toFixed(0)} HP/s`:`×${t.multiplier} DMG`;e.font="9px Orbitron",e.fillStyle=s?"rgba(80,255,140,0.4)":"rgba(255,110,60,0.4)",e.fillText(r,t.x+t.w/2,t.y+t.h/2+10),e.restore()}_drawItem(e,t){e.save();const i=1+Math.sin(Date.now()/180)*.14;t.type==="health"?(e.shadowColor="#ff2e2e",e.shadowBlur=14,e.fillStyle="#cc2020",e.beginPath(),e.arc(t.x,t.y,11*i,0,Math.PI*2),e.fill(),e.shadowBlur=0,e.fillStyle="#ffffff",e.fillRect(t.x-2.5,t.y-6.5*i,5,13*i),e.fillRect(t.x-6.5*i,t.y-2.5,13*i,5)):t.type==="ammo"?(e.shadowColor="#ffcc00",e.shadowBlur=10,e.fillStyle="#cc9900",e.fillRect(t.x-7,t.y-7,14,14),e.fillStyle="#ffe060",e.fillRect(t.x-2,t.y-5,4,8),e.beginPath(),e.arc(t.x,t.y-5,2,Math.PI,0),e.fill()):t.type==="adrenaline"?(e.shadowColor="#39db14",e.shadowBlur=15,e.fillStyle="#1b7d05",e.beginPath(),e.arc(t.x,t.y,11*i,0,Math.PI*2),e.fill(),e.fillStyle="#39db14",e.beginPath(),e.moveTo(t.x-1,t.y-6*i),e.lineTo(t.x-4,t.y+1),e.lineTo(t.x-1,t.y+1),e.lineTo(t.x-2.5,t.y+7*i),e.lineTo(t.x+3.5,t.y-1),e.lineTo(t.x+.5,t.y-1),e.closePath(),e.fill()):t.type==="overdrive"&&(e.shadowColor="#ffd700",e.shadowBlur=15,e.fillStyle="#aa7c11",e.beginPath(),e.moveTo(t.x,t.y-12*i),e.lineTo(t.x+10*i,t.y),e.lineTo(t.x,t.y+12*i),e.lineTo(t.x-10*i,t.y),e.closePath(),e.fill(),e.strokeStyle="#ffd700",e.lineWidth=2.5,e.lineCap="round",e.lineJoin="round",e.beginPath(),e.moveTo(t.x-4,t.y-4),e.lineTo(t.x-1,t.y),e.lineTo(t.x-4,t.y+4),e.stroke(),e.beginPath(),e.moveTo(t.x+1,t.y-4),e.lineTo(t.x+4,t.y),e.lineTo(t.x+1,t.y+4),e.stroke()),e.restore()}initTerminals(){this.terminals=[{id:"term_1",x:this.mapId==="cyberlab"?700:720,y:620,radius:24,hacked:!1,progress:0,active:!0,label:"REACTOR DATA CORE"},{id:"term_2",x:1220,y:1120,radius:24,hacked:!1,progress:0,active:!0,label:"SECURE CACHE SUPPLY"}]}_drawTerminal(e,t){e.save();const i=1+Math.sin(Date.now()/200)*.08,s=e.createRadialGradient(t.x,t.y,5,t.x,t.y,t.radius*1.5*i);s.addColorStop(0,t.hacked?"rgba(57, 255, 20, 0.25)":"rgba(102, 252, 241, 0.25)"),s.addColorStop(1,"rgba(0, 0, 0, 0.0)"),e.fillStyle=s,e.beginPath(),e.arc(t.x,t.y,t.radius*1.8*i,0,Math.PI*2),e.fill(),e.fillStyle="#1c1e24",e.strokeStyle="#2b2e38",e.lineWidth=2,e.beginPath(),e.arc(t.x,t.y,14,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#0b0c10",e.strokeStyle=t.hacked?"rgba(57, 255, 20, 0.8)":"rgba(102, 252, 241, 0.8)",e.lineWidth=1.5,e.beginPath(),e.roundRect?e.roundRect(t.x-12,t.y-12,24,16,3):e.rect(t.x-12,t.y-12,24,16),e.fill(),e.stroke(),e.fillStyle=t.hacked?"#39ff14":"#66fcf1",e.font="bold 5px monospace",e.textAlign="center",e.textBaseline="middle",e.fillText(t.hacked?"SECURE":"ACCESS",t.x,t.y-4),e.fillStyle=t.hacked?"#39ff14":"#ffd700",e.beginPath(),e.arc(t.x-6,t.y+7,2,0,Math.PI*2),e.arc(t.x+6,t.y+7,2,0,Math.PI*2),e.fill(),e.restore()}_drawExtrudedObject(e,t,i,s,a,r){const o={x:t.x,y:t.y},l={x:t.x+t.w,y:t.y},c={x:t.x+t.w,y:t.y+t.h},d={x:t.x,y:t.y+t.h},f={x:o.x+(o.x-i)*a,y:o.y+(o.y-s)*a},h={x:l.x+(l.x-i)*a,y:l.y+(l.y-s)*a},u={x:c.x+(c.x-i)*a,y:c.y+(c.y-s)*a},g={x:d.x+(d.x-i)*a,y:d.y+(d.y-s)*a};e.save(),e.fillStyle="rgba(2, 3, 5, 0.45)",e.beginPath(),e.moveTo(o.x,o.y),e.lineTo(l.x,l.y),e.lineTo(c.x,c.y),e.lineTo(d.x,d.y),e.closePath(),e.fill(),e.restore();const y=(b,_,v,x,E)=>{e.save(),e.fillStyle=E,e.beginPath(),e.moveTo(b.x,b.y),e.lineTo(_.x,_.y),e.lineTo(x.x,x.y),e.lineTo(v.x,v.y),e.closePath(),e.fill(),e.strokeStyle="rgba(0,0,0,0.25)",e.lineWidth=1,e.stroke(),e.restore()};y(o,l,f,h,s>t.y?"#090a0d":"#17181c"),y(l,c,h,u,i<t.x+t.w?"#0d0e12":"#1b1c21"),y(c,d,u,g,s<t.y+t.h?"#090a0d":"#17181c"),y(d,o,g,f,i>t.x?"#0d0e12":"#1b1c21"),e.save(),e.beginPath(),e.moveTo(f.x,f.y),e.lineTo(h.x,h.y),e.lineTo(u.x,u.y),e.lineTo(g.x,g.y),e.closePath(),e.clip();const m=f.x-t.x,p=f.y-t.y;e.translate(m,p),r(e,t),e.restore(),e.save(),e.beginPath(),e.moveTo(f.x,f.y),e.lineTo(h.x,h.y),e.lineTo(u.x,u.y),e.lineTo(g.x,g.y),e.closePath(),e.strokeStyle="rgba(255,255,255,0.12)",e.lineWidth=1.5,e.stroke(),e.restore()}_drawExtrudedBarrel(e,t,i,s){const r=t.x+t.w/2,o=t.y+t.h/2,l=t.w/2,c=r+(r-i)*.04,d=o+(o-s)*.04;e.save(),e.fillStyle="rgba(2, 3, 5, 0.45)",e.beginPath(),e.arc(r,o,l,0,Math.PI*2),e.fill(),e.restore();const f=Math.atan2(d-o,c-r)+Math.PI/2,h=Math.cos(f)*l,u=Math.sin(f)*l;e.save(),e.fillStyle="#1c1000",e.beginPath(),e.moveTo(r-h,o-u),e.lineTo(r+h,o-u),e.lineTo(c+h,d-u),e.lineTo(c-h,d-u),e.closePath(),e.fill(),e.strokeStyle="#3a2000",e.stroke(),e.restore(),e.save(),e.translate(c-r,d-o),this._drawBarrel(e,t),e.restore()}_drawWall(e,t,i,s){e.save();const a=.08,r=.04;switch(t.material){case"exterior":this._drawExtrudedObject(e,t,i,s,a,(o,l)=>this._drawExteriorWall(o,l));break;case"interior":this._drawExtrudedObject(e,t,i,s,a,(o,l)=>this._drawInteriorWall(o,l));break;case"furniture":this._drawExtrudedObject(e,t,i,s,r,(o,l)=>this._drawFurniturePiece(o,l));break;case"barrel":this._drawExtrudedBarrel(e,t,i,s);break;case"crate":this._drawExtrudedObject(e,t,i,s,r,(o,l)=>this._drawCratePiece(o,l));break;default:this._drawExtrudedObject(e,t,i,s,a,(o,l)=>this._drawInteriorWall(o,l))}e.restore()}_drawExteriorWall(e,t){e.fillStyle="#0b0b12",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(60,50,90,0.4)",e.lineWidth=1;const i=32,s=13;for(let a=t.x;a<t.x+t.w;a+=i)for(let r=t.y;r<t.y+t.h;r+=s){const o=Math.floor((r-t.y)/s)%2*(i/2);e.strokeRect(a+o,r,i,s)}e.strokeStyle="rgba(102,252,241,0.28)",e.lineWidth=2,e.strokeRect(t.x,t.y,t.w,t.h)}_drawInteriorWall(e,t){e.fillStyle="#1b1c22",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(90,130,170,0.45)",e.lineWidth=1.5,e.strokeRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(170,130,70,0.25)",e.lineWidth=1,t.w>t.h?(e.beginPath(),e.moveTo(t.x,t.y+3),e.lineTo(t.x+t.w,t.y+3),e.stroke(),e.beginPath(),e.moveTo(t.x,t.y+t.h-3),e.lineTo(t.x+t.w,t.y+t.h-3),e.stroke()):(e.beginPath(),e.moveTo(t.x+3,t.y),e.lineTo(t.x+3,t.y+t.h),e.stroke(),e.beginPath(),e.moveTo(t.x+t.w-3,t.y),e.lineTo(t.x+t.w-3,t.y+t.h),e.stroke())}_drawFurniturePiece(e,t){const i=t.label||"",a={sofa:{fill:"#261637",stroke:"#4a2a70"},table:{fill:"#241510",stroke:"#7a4a22"},bed:{fill:"#152030",stroke:"#2a5080"},counter:{fill:"#182215",stroke:"#3a7050"},desk:{fill:"#1e1408",stroke:"#5a3a18"},tub:{fill:"#0a1a2c",stroke:"#1a5a8a"},sink:{fill:"#0a1828",stroke:"#2a6090"},tv:{fill:"#0a0a14",stroke:"#4a4a70"},shelf:{fill:"#1e1006",stroke:"#5a3010"},car:{fill:"#1a1a28",stroke:"#3a3a5c"},bench:{fill:"#1c1408",stroke:"#5c4018"},fridge:{fill:"#141c24",stroke:"#3a5a78"},cabinet:{fill:"#18100a",stroke:"#5a3a1a"},dresser:{fill:"#1e1408",stroke:"#6a4020"},toilet:{fill:"#eee",stroke:"#555"},chair:{fill:"#2b1e16",stroke:"#5c402d"},plant:{fill:"#152d18",stroke:"#345a3a"},cyber_couch:{fill:"#110a24",stroke:"#9d3bff"},containment_pod:{fill:"#08181a",stroke:"#66fcf1"},server_rack:{fill:"#080c10",stroke:"#39db14"},cyber_console:{fill:"#050c18",stroke:"#1a7cd8"},reactor_core:{fill:"#150c05",stroke:"#ff7f3b"},nano_charger:{fill:"#051a0c",stroke:"#39db14"}}[i]||{fill:"#1a1a2a",stroke:"#4a4a80"};if(e.fillStyle=a.fill,e.strokeStyle=a.stroke,e.lineWidth=1.5,e.beginPath(),e.roundRect?e.roundRect(t.x,t.y,t.w,t.h,4):e.rect(t.x,t.y,t.w,t.h),e.fill(),e.stroke(),i==="bed"){e.fillStyle="rgba(255,255,255,0.05)",e.fillRect(t.x,t.y,t.w,10),e.strokeStyle=a.stroke,e.strokeRect(t.x,t.y,t.w,10),e.fillStyle="#223040",e.strokeStyle="rgba(255,255,255,0.1)",e.lineWidth=1;const r=Math.min(32,(t.w-16)/2),o=Math.min(18,t.h*.18),l=t.y+16;t.w>80?(e.fillRect(t.x+8,l,r,o),e.strokeRect(t.x+8,l,r,o),e.fillRect(t.x+t.w-8-r,l,r,o),e.strokeRect(t.x+t.w-8-r,l,r,o)):(e.fillRect(t.x+t.w/2-r/2,l,r,o),e.strokeRect(t.x+t.w/2-r/2,l,r,o)),e.strokeStyle="rgba(255, 255, 255, 0.08)",e.lineWidth=1.5,e.beginPath(),e.moveTo(t.x+4,t.y+t.h*.45),e.lineTo(t.x+t.w-4,t.y+t.h*.45),e.stroke(),e.beginPath(),e.moveTo(t.x+4,t.y+t.h*.45),e.lineTo(t.x+t.w/3,t.y+t.h*.65),e.moveTo(t.x+t.w-4,t.y+t.h*.45),e.lineTo(t.x+t.w*.66,t.y+t.h*.65),e.stroke()}else if(i==="sofa"){e.fillStyle="rgba(0,0,0,0.18)";const r=10;if(e.strokeStyle="rgba(255, 255, 255, 0.06)",t.w>t.h){e.fillRect(t.x,t.y,r,t.h),e.strokeRect(t.x,t.y,r,t.h),e.fillRect(t.x+t.w-r,t.y,r,t.h),e.strokeRect(t.x+t.w-r,t.y,r,t.h),e.fillRect(t.x+r,t.y,t.w-r*2,r),e.strokeRect(t.x+r,t.y,t.w-r*2,r);const o=(t.w-r*2)/3;for(let l=1;l<3;l++)e.beginPath(),e.moveTo(t.x+r+o*l,t.y+r),e.lineTo(t.x+r+o*l,t.y+t.h),e.stroke()}else{e.fillRect(t.x,t.y,t.w,r),e.strokeRect(t.x,t.y,t.w,r),e.fillRect(t.x,t.y+t.h-r,t.w,r),e.strokeRect(t.x,t.y+t.h-r,t.w,r),e.fillRect(t.x,t.y+r,r,t.h-r*2),e.strokeRect(t.x,t.y+r,r,t.h-r*2);const o=(t.h-r*2)/2;for(let l=1;l<2;l++)e.beginPath(),e.moveTo(t.x+r,t.y+r+o*l),e.lineTo(t.x+t.w,t.y+r+o*l),e.stroke()}}else if(i==="counter")if(e.strokeStyle="rgba(255,255,255,0.08)",e.lineWidth=1,t.w>t.h){e.fillStyle="#111b22",e.fillRect(t.x+t.w*.2,t.y+4,30,t.h-8),e.strokeRect(t.x+t.w*.2,t.y+4,30,t.h-8),e.strokeStyle="#8fa4b3",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+t.w*.2+15,t.y+2),e.lineTo(t.x+t.w*.2+15,t.y+8),e.stroke(),e.strokeStyle="#ff5c28",e.lineWidth=1;const r=t.x+t.w*.7,o=t.y+t.h/2;e.beginPath(),e.arc(r-12,o-6,4,0,Math.PI*2),e.arc(r+12,o-6,5,0,Math.PI*2),e.arc(r-12,o+6,5,0,Math.PI*2),e.arc(r+12,o+6,4,0,Math.PI*2),e.stroke()}else e.fillStyle="#111b22",e.fillRect(t.x+4,t.y+t.h*.3,t.w-8,30),e.strokeRect(t.x+4,t.y+t.h*.3,t.w-8,30),e.strokeStyle="#8fa4b3",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+2,t.y+t.h*.3+15),e.lineTo(t.x+8,t.y+t.h*.3+15),e.stroke();else if(i==="desk")e.fillStyle="rgba(0,0,0,0.15)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.fillStyle="#05050a",e.strokeStyle="#66fcf1",e.lineWidth=1.5,t.w>t.h?(e.fillRect(t.x+t.w/2-25,t.y+6,50,4),e.strokeRect(t.x+t.w/2-25,t.y+6,50,4),e.fillStyle="#222",e.fillRect(t.x+t.w/2-20,t.y+15,40,10)):(e.fillRect(t.x+6,t.y+t.h/2-25,4,50),e.strokeRect(t.x+6,t.y+t.h/2-25,4,50),e.fillStyle="#222",e.fillRect(t.x+15,t.y+t.h/2-20,10,40));else if(i==="shelf"){e.fillStyle="#3c2415",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4);const r=["#9e2a2b","#3e5c76","#ffe066","#a3b18a","#9b5de5","#ff9f1c"];e.lineWidth=1;const o=Math.round(t.x*13+t.y*37),l=new Jc(o);if(t.w>t.h){let c=t.x+4;for(;c<t.x+t.w-6;){const d=Math.floor(l.next()*4)+3,f=Math.floor(l.next()*8)+12;e.fillStyle=r[Math.floor(l.next()*r.length)],e.fillRect(c,t.y+t.h-2-f,d,f),e.strokeRect(c,t.y+t.h-2-f,d,f),c+=d+1}}else{let c=t.y+4;for(;c<t.y+t.h-6;){const d=Math.floor(l.next()*4)+3,f=Math.floor(l.next()*8)+12;e.fillStyle=r[Math.floor(l.next()*r.length)],e.fillRect(t.x+2,c,f,d),e.strokeRect(t.x+2,c,f,d),c+=d+1}}}else if(i==="dresser"||i==="cabinet")if(e.strokeStyle="rgba(255,255,255,0.06)",e.lineWidth=1,t.w>t.h){const o=t.w/2;for(let l=0;l<2;l++)e.strokeRect(t.x+o*l+2,t.y+2,o-4,t.h-4),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x+o*l+o/2,t.y+t.h-5,2,0,Math.PI*2),e.fill()}else{const o=t.h/3;for(let l=0;l<3;l++)e.strokeRect(t.x+2,t.y+o*l+2,t.w-4,o-4),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x+t.w-5,t.y+o*l+o/2,2,0,Math.PI*2),e.fill()}else if(i==="toilet")e.fillStyle="#eee",e.strokeStyle="#555",e.lineWidth=1.5,e.fillRect(t.x+4,t.y,t.w-8,12),e.strokeRect(t.x+4,t.y,t.w-8,12),e.beginPath(),e.arc(t.x+t.w/2,t.y+24,9,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#66c0f4",e.beginPath(),e.arc(t.x+t.w/2,t.y+24,5,0,Math.PI*2),e.fill();else if(i==="chair")e.fillStyle="rgba(0,0,0,0.1)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.strokeStyle=a.stroke,e.lineWidth=2.5,e.beginPath(),e.moveTo(t.x+2,t.y+2),e.lineTo(t.x+t.w-2,t.y+2),e.stroke();else if(i==="plant"){const r=t.x+t.w/2,o=t.y+t.h/2;e.fillStyle="#8c5a3c",e.strokeStyle="#5c3a26",e.beginPath(),e.arc(r,o,10,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#2a7c36",e.beginPath(),e.arc(r-6,o-4,7,0,Math.PI*2),e.arc(r+6,o-4,6,0,Math.PI*2),e.arc(r,o+6,8,0,Math.PI*2),e.arc(r-3,o+5,6,0,Math.PI*2),e.fill(),e.fillStyle="#4ea35b",e.beginPath(),e.arc(r-4,o-2,4,0,Math.PI*2),e.arc(r+4,o-2,3,0,Math.PI*2),e.arc(r,o+3,4,0,Math.PI*2),e.fill()}else if(i==="tub")e.fillStyle="#0d2535",e.fillRect(t.x+7,t.y+7,t.w-14,t.h-14),e.strokeStyle="rgba(50,170,255,0.25)",e.strokeRect(t.x+7,t.y+7,t.w-14,t.h-14);else if(i==="car")e.fillStyle="#0a1828",e.fillRect(t.x+28,t.y+18,65,38),e.fillRect(t.x+t.w-95,t.y+18,65,38),e.strokeStyle="rgba(80,120,200,0.3)",e.strokeRect(t.x+28,t.y+18,65,38),e.strokeRect(t.x+t.w-95,t.y+18,65,38),e.strokeStyle="rgba(100,100,180,0.4)",e.lineWidth=2,e.strokeRect(t.x+10,t.y+10,t.w-20,t.h-20);else if(i==="cyber_couch")e.fillStyle="rgba(0,0,0,0.2)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.strokeStyle="rgba(157, 59, 255, 0.25)",e.lineWidth=1,t.w>t.h?(e.strokeRect(t.x+6,t.y+4,t.w-12,6),e.beginPath(),e.moveTo(t.x+4,t.y+t.h-4),e.lineTo(t.x+t.w-4,t.y+t.h-4),e.strokeStyle="#9d3bff",e.stroke()):(e.strokeRect(t.x+4,t.y+6,6,t.h-12),e.beginPath(),e.moveTo(t.x+t.w-4,t.y+4),e.lineTo(t.x+t.w-4,t.y+t.h-4),e.strokeStyle="#9d3bff",e.stroke());else if(i==="containment_pod"){e.fillStyle="rgba(102, 252, 241, 0.05)",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.fillStyle="#222",e.strokeStyle="#66fcf1",e.lineWidth=1.5,t.w>t.h?(e.fillRect(t.x,t.y,8,t.h),e.strokeRect(t.x,t.y,8,t.h),e.fillRect(t.x+t.w-8,t.y,8,t.h),e.strokeRect(t.x+t.w-8,t.y,8,t.h)):(e.fillRect(t.x,t.y,t.w,8),e.strokeRect(t.x,t.y,t.w,8),e.fillRect(t.x,t.y+t.h-8,t.w,8),e.strokeRect(t.x,t.y+t.h-8,t.w,8));const r=Date.now();e.fillStyle="rgba(102, 252, 241, 0.4)";const o=Math.floor(t.x*2.3+t.y*1.7);for(let l=0;l<4;l++){const c=t.x+10+(o+l*29)%(t.w-20),d=t.y+10+((o*7+l*41-r*.04)%(t.h-20)+(t.h-20))%(t.h-20);e.beginPath(),e.arc(c,d,1.5+l%2,0,Math.PI*2),e.fill()}}else if(i==="server_rack"){e.fillStyle="#0a0d14",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.strokeStyle="rgba(255, 255, 255, 0.04)",e.lineWidth=1;const r=Date.now(),o=Math.floor(t.h/14);if(t.h>t.w)for(let l=0;l<o;l++){const c=t.y+4+l*14;e.strokeRect(t.x+3,c,t.w-6,10);const d=Math.floor(r/200+l)%4!==0,f=Math.floor(r/450+l*2)%6===0,h=Math.floor(r/300-l)%5===0;e.fillStyle=d?"#39db14":"#053005",e.fillRect(t.x+6,c+4,3,3),e.fillStyle=f?"#ff3c3c":"#400505",e.fillRect(t.x+12,c+4,3,3),e.fillStyle=h?"#66fcf1":"#052028",e.fillRect(t.x+18,c+4,3,3)}else{const l=Math.floor(t.w/14);for(let c=0;c<l;c++){const d=t.x+4+c*14;e.strokeRect(d,t.y+3,10,t.h-6);const f=Math.floor(r/200+c)%4!==0,h=Math.floor(r/450+c*2)%6===0;e.fillStyle=f?"#39db14":"#053005",e.fillRect(d+4,t.y+6,3,3),e.fillStyle=h?"#ff3c3c":"#400505",e.fillRect(d+4,t.y+12,3,3)}}}else if(i==="cyber_console")if(e.fillStyle="rgba(0,0,0,0.35)",e.fillRect(t.x+3,t.y+3,t.w-6,t.h-6),e.fillStyle="#09152b",e.strokeStyle="#1a7cd8",e.lineWidth=1.5,t.w>t.h){e.fillRect(t.x+5,t.y+t.h-12,t.w-10,8),e.strokeRect(t.x+5,t.y+t.h-12,t.w-10,8),e.fillStyle="rgba(26, 124, 216, 0.15)",e.fillRect(t.x+10,t.y+4,t.w-20,t.h-18),e.strokeRect(t.x+10,t.y+4,t.w-20,t.h-18),e.strokeStyle="#66fcf1",e.lineWidth=1,e.beginPath();const r=Date.now();for(let o=t.x+14;o<t.x+t.w-14;o+=4){const l=t.y+10+Math.sin(r*.005+o*.1)*3;o===t.x+14?e.moveTo(o,l):e.lineTo(o,l)}e.stroke()}else e.fillRect(t.x+4,t.y+5,8,t.h-10),e.strokeRect(t.x+4,t.y+5,8,t.h-10),e.fillStyle="rgba(26, 124, 216, 0.15)",e.fillRect(t.x+14,t.y+10,t.w-18,t.h-20),e.strokeRect(t.x+14,t.y+10,t.w-18,t.h-20);else if(i==="reactor_core"){const r=t.x+t.w/2,o=t.y+t.h/2,l=Math.min(t.w,t.h)/2,c=Date.now();e.fillStyle="#100a05",e.strokeStyle="#ff7f3b",e.lineWidth=2.5,e.beginPath(),e.arc(r,o,l-4,0,Math.PI*2),e.fill(),e.stroke();const d=3,f=c/400%(Math.PI*2);e.fillStyle="#ff7f3b";for(let h=0;h<d;h++){const u=f+h*Math.PI*2/d,g=r+Math.cos(u)*(l-12),y=o+Math.sin(u)*(l-12);e.beginPath(),e.arc(g,y,4,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(255, 215, 0, 0.25)",e.lineWidth=1.5,e.beginPath(),e.moveTo(r,o),e.lineTo(g,y),e.stroke()}e.fillStyle="#ffd700",e.shadowColor="#ff7f3b",e.shadowBlur=12,e.beginPath(),e.arc(r,o,6+Math.sin(c/150)*1.5,0,Math.PI*2),e.fill(),e.shadowBlur=0}else if(i==="nano_charger"){e.fillStyle="#06100a",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.fillStyle="rgba(57, 219, 20, 0.1)",e.strokeStyle="#39db14",e.lineWidth=1.5,e.strokeRect(t.x+4,t.y+4,t.w-8,t.h-8);const r=Date.now(),o=(t.h-12)*(.5+Math.sin(r/250)*.35);e.fillStyle="#39db14",e.fillRect(t.x+6,t.y+t.h-6-o,t.w-12,o)}else i==="fridge"?(e.strokeStyle="rgba(160,200,255,0.4)",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+t.w/2-10,t.y+12),e.lineTo(t.x+t.w/2+10,t.y+12),e.stroke()):(e.strokeStyle="rgba(255,255,255,0.06)",e.strokeRect(t.x+3,t.y+3,t.w-6,t.h-6))}_drawBarrel(e,t){const i=t.x+t.w/2,s=t.y+t.h/2,a=t.w/2;if(e.fillStyle="#2a1800",e.strokeStyle="#9a4800",e.lineWidth=2,e.beginPath(),e.arc(i,s,a,0,Math.PI*2),e.fill(),e.stroke(),e.strokeStyle="rgba(255,120,0,0.65)",e.lineWidth=2,e.beginPath(),e.arc(i,s,a-5,0,Math.PI*2),e.stroke(),e.strokeStyle="rgba(255,160,0,0.4)",e.lineWidth=1.5,e.beginPath(),e.moveTo(i-a*.4,s-a*.4),e.lineTo(i+a*.4,s+a*.4),e.moveTo(i+a*.4,s-a*.4),e.lineTo(i-a*.4,s+a*.4),e.stroke(),t.health<t.maxHealth){const r=t.health/t.maxHealth;e.fillStyle="rgba(0,0,0,0.6)",e.fillRect(t.x,t.y+2,t.w,4),e.fillStyle=r>.5?"#39ff14":"#ff3c3c",e.fillRect(t.x,t.y+2,t.w*r,4)}}_drawCratePiece(e,t){e.fillStyle="#3a2b1e",e.strokeStyle="#b8865c",e.lineWidth=1.5,e.fillRect(t.x,t.y,t.w,t.h),e.strokeRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(170,110,60,0.4)",e.lineWidth=1,e.beginPath(),e.moveTo(t.x+3,t.y+3),e.lineTo(t.x+t.w-3,t.y+t.h-3),e.moveTo(t.x+t.w-3,t.y+3),e.lineTo(t.x+3,t.y+t.h-3),e.stroke(),e.strokeStyle="rgba(210,150,80,0.7)",e.lineWidth=1.5;const i=8;if([[t.x,t.y,1,1],[t.x+t.w,t.y,-1,1],[t.x,t.y+t.h,1,-1],[t.x+t.w,t.y+t.h,-1,-1]].forEach(([s,a,r,o])=>{e.beginPath(),e.moveTo(s,a+o*i),e.lineTo(s,a),e.lineTo(s+r*i,a),e.stroke()}),t.health<t.maxHealth){const s=t.health/t.maxHealth;e.fillStyle="rgba(0,0,0,0.6)",e.fillRect(t.x+4,t.y+4,t.w-8,5),e.fillStyle=s>.5?"#39ff14":"#ff3c3c",e.fillRect(t.x+4,t.y+4,(t.w-8)*s,5)}}};class di{constructor(e,t,i,s,a,r,o,l,c="normal"){this.x=e,this.y=t,this.vx=i,this.vy=s,this.color=a,this.size=r,this.life=o,this.decay=l,this.type=c,this.angle=Math.random()*Math.PI*2,this.spin=(Math.random()-.5)*.3,this.bounceCount=0}update(e){if(this.life-=this.decay,this.type==="casing"||this.type==="splinter"){this.vx*=.95,this.vy*=.95,this.angle+=this.spin;const t=this.x+this.vx,i=this.y+this.vy,s=e.checkCircleCollision(t,i,this.size);(s.x!==t||s.y!==i)&&this.bounceCount<2?(this.bounceCount++,this.x=s.x,this.y=s.y,this.vx=-this.vx*.4,this.vy=-this.vy*.4):(this.x=s.x,this.y=s.y)}else this.x+=this.vx,this.y+=this.vy,this.vx*=.92,this.vy*=.92}draw(e){e.save(),e.globalAlpha=Math.max(0,this.life),this.type==="casing"?(e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle="#d4af37",e.strokeStyle="#996515",e.lineWidth=.5,e.fillRect(-this.size,-this.size/2,this.size*2,this.size),e.strokeRect(-this.size,-this.size/2,this.size*2,this.size)):this.type==="splinter"?(e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle="#8b5a2b",e.beginPath(),e.moveTo(-this.size,0),e.lineTo(this.size,-this.size/2),e.lineTo(this.size/2,this.size/2),e.closePath(),e.fill()):this.type==="blood"?(e.fillStyle=this.color,e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fill()):(e.fillStyle=this.color,!(window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode)&&(this.color.startsWith("#66fc")||this.color.startsWith("#ff3c"))&&(e.shadowColor=this.color,e.shadowBlur=4),e.beginPath(),e.arc(this.x,this.y,this.size*this.life,0,Math.PI*2),e.fill()),e.restore()}}class Gr{constructor(e,t,i,s,a="blood"){this.x=e,this.y=t,this.size=i,this.color=s,this.type=a,this.angle=Math.random()*Math.PI*2,this.scaleX=1+(Math.random()-.5)*.4,this.scaleY=1+(Math.random()-.5)*.4}draw(e){e.save(),e.translate(this.x,this.y),e.rotate(this.angle),e.globalAlpha=this.type==="blood"?.75:.9,this.type==="blood"?(e.fillStyle=this.color,e.beginPath(),e.ellipse(0,0,this.size*this.scaleX,this.size*this.scaleY,0,0,Math.PI*2),e.fill()):this.type==="casing"?(e.fillStyle="#b5921c",e.fillRect(-this.size,-this.size/2,this.size*2,this.size)):this.type==="splinter"&&(e.fillStyle="#6e441c",e.fillRect(-this.size,-this.size/3,this.size*1.5,this.size*.7)),e.restore()}}class Ay{constructor(){this.particles=[],this.decals=[],this.bloodEnabled=!0}clear(){this.particles=[],this.decals=[]}setBloodEnabled(e){this.bloodEnabled=e}update(e){for(let t=this.particles.length-1;t>=0;t--){const i=this.particles[t];i.update(e),i.life<=0&&(i.type==="blood"&&this.bloodEnabled&&Math.random()<.6?this.decals.push(new Gr(i.x,i.y,i.size*1.2,i.color,"blood")):i.type==="casing"?this.decals.push(new Gr(i.x,i.y,i.size,"#996515","casing")):i.type==="splinter"&&Math.random()<.4&&this.decals.push(new Gr(i.x,i.y,i.size,"#5c3917","splinter")),this.particles.splice(t,1))}this.decals.length>250&&this.decals.shift()}drawDecals(e){this.decals.forEach(t=>t.draw(e))}drawParticles(e){this.particles.forEach(t=>t.draw(e))}spawnWallImpact(e,t,i){const s=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,a=i+Math.PI,r=s?1:Math.floor(Math.random()*4)+3;for(let o=0;o<r;o++){const l=a+(Math.random()-.5)*1.2,c=Math.random()*3+2,d=Math.cos(l)*c,f=Math.sin(l)*c,h=Math.random()*2.2+1.2,u=Math.random()*.04+.04;this.particles.push(new di(e,t,d,f,Math.random()>.5?"#66fcf1":"#ffffff",h,1,u,"spark"))}s||this.particles.push(new di(e,t,(Math.random()-.5)*.3,(Math.random()-.5)*.3,"rgba(197, 198, 199, 0.25)",Math.random()*6+4,1,.03,"smoke"))}spawnBloodSplatter(e,t,i){if(!this.bloodEnabled)return;const a=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode?2:Math.floor(Math.random()*6)+6;for(let r=0;r<a;r++){const o=i+(Math.random()-.5)*1.1,l=Math.random()*4.5+2.5,c=Math.cos(o)*l,d=Math.sin(o)*l,f=Math.random()*3+1.5,h=Math.random()*.05+.04,g=`rgb(${Math.floor(Math.random()*60)+120}, 10, 10)`;this.particles.push(new di(e,t,c,d,g,f,1,h,"blood"))}}spawnGunCasing(e,t,i,s){if(window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode)return;const r=i+Math.PI/2+(Math.random()-.5)*.5,o=Math.random()*2+1.8,l=Math.cos(r)*o,c=Math.sin(r)*o,d=s==="sniper"?3.5:s==="pistol"?2:2.6,f=.02;this.particles.push(new di(e,t,l,c,"#d4af37",d,1,f,"casing"));const h=i+(Math.random()-.5)*.3,u=Math.random()*.6+.3;this.particles.push(new di(e+Math.cos(i)*6,t+Math.sin(i)*6,Math.cos(h)*u,Math.sin(h)*u,"rgba(200, 200, 200, 0.15)",Math.random()*5+3,1,.04,"smoke"))}spawnCrateSplinters(e,t){const i=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,s=i?3:Math.floor(Math.random()*12)+10;for(let a=0;a<s;a++){const r=Math.random()*Math.PI*2,o=Math.random()*4+1.5,l=Math.cos(r)*o,c=Math.sin(r)*o,d=Math.random()*4+2,f=Math.random()*.03+.02;this.particles.push(new di(e,t,l,c,"#8b5a2b",d,1,f,"splinter"))}if(!i)for(let a=0;a<4;a++)this.particles.push(new di(e+(Math.random()-.5)*10,t+(Math.random()-.5)*10,(Math.random()-.5)*.8,(Math.random()-.5)*.8,"rgba(140, 130, 120, 0.2)",Math.random()*12+8,1,.02,"smoke"))}spawnFlashbangBurst(e,t){const i=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,s=i?8:30;for(let a=0;a<s;a++){const r=Math.random()*Math.PI*2,o=Math.random()*7+3,l=Math.cos(r)*o,c=Math.sin(r)*o,d=Math.random()*4+2,f=Math.random()*.03+.02;this.particles.push(new di(e,t,l,c,Math.random()>.3?"#ffffff":"#66fcf1",d,1,f,"spark"))}if(!i)for(let a=0;a<10;a++){const r=Math.random()*Math.PI*2,o=Math.random()*2.5,l=Math.cos(r)*o,c=Math.sin(r)*o;this.particles.push(new di(e,t,l,c,"rgba(255, 255, 255, 0.4)",Math.random()*20+10,1,.015,"smoke"))}}spawnDashParticles(e,t,i,s="cyan"){const a=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,o={cyan:"#66fcf1",green:"#5eff39",purple:"#c47aff",orange:"#ff9d7a",yellow:"#ffea70",red:"#ff7a7a"}[s]||"#66fcf1",l=i+Math.PI,c=a?2:12;for(let f=0;f<c;f++){const h=l+(Math.random()-.5)*.6,u=Math.random()*2.5+1.2,g=Math.cos(h)*u,y=Math.sin(h)*u,m=Math.random()*7+4,p=Math.random()*.05+.03;this.particles.push(new di(e,t,g,y,"rgba(200, 200, 200, 0.18)",m,1,p,"smoke"))}const d=a?3:18;for(let f=0;f<d;f++){const h=i+(Math.random()-.5)*.7,u=Math.random()*8+4,g=Math.cos(h)*u,y=Math.sin(h)*u,m=Math.random()*2.5+1,p=Math.random()*.06+.04;this.particles.push(new di(e,t,g,y,o,m,1,p,"spark"))}}}class Ry{constructor(){this.ctx=null,this.masterVolume=null,this.volume=.5,this.noiseBuffer=null,this.shotgunBuffer=null,this.taskAlarms=new Map,this.bearMusic=null}init(){if(this.ctx)return;const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.masterVolume=this.ctx.createGain(),this.masterVolume.gain.value=this.volume,this.masterVolume.connect(this.ctx.destination);const t=this.ctx.sampleRate*2,i=this.ctx.createBuffer(1,t,this.ctx.sampleRate),s=i.getChannelData(0);for(let a=0;a<t;a++)s[a]=Math.random()*2-1;this.noiseBuffer=i,fetch("/dennish18-shotgun.mp3").then(a=>a.arrayBuffer()).then(a=>this.ctx.decodeAudioData(a)).then(a=>{this.shotgunBuffer=a}).catch(a=>console.error("Error loading shotgun sound:",a)),this._buildReverb()}_buildReverb(){if(!this.ctx||this.reverbNode)return;const e=Math.floor(this.ctx.sampleRate*.9),t=this.ctx.createBuffer(2,e,this.ctx.sampleRate);for(let i=0;i<2;i++){const s=t.getChannelData(i);for(let a=0;a<e;a++)s[a]=(Math.random()*2-1)*Math.pow(1-a/e,2.2)}this.reverbNode=this.ctx.createConvolver(),this.reverbNode.buffer=t,this.reverbGain=this.ctx.createGain(),this.reverbGain.gain.value=.28,this.reverbNode.connect(this.reverbGain),this.reverbGain.connect(this.masterVolume)}setVolume(e){this.volume=e,this.masterVolume&&(this.masterVolume.gain.value=e),this.bearMusic&&(this.bearMusic.volume=e*.3)}playGunshot(e,t=0){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const i=this.ctx.currentTime;let s=this.masterVolume;if(t>0){const p=this.ctx.createBiquadFilter();p.type="lowpass";const b=Math.max(220,4500*Math.pow(1-Math.min(1,t/1300),1.5));p.frequency.setValueAtTime(b,i);const _=Math.max(.01,Math.pow(1-Math.min(1,t/1400),1.2)),v=this.ctx.createGain();v.gain.setValueAtTime(_,i),p.connect(v),v.connect(this.masterVolume),s=p}const a=this.ctx.createBufferSource();a.buffer=this.noiseBuffer;const r=this.ctx.createBiquadFilter(),o=this.ctx.createGain();a.connect(r),r.connect(o),o.connect(s);const l=this.ctx.createOscillator(),c=this.ctx.createGain();l.connect(c),c.connect(s);let d=1e3,f=.1,h=.6,u=150,g=40,y=.08,m=.5;switch(e){case"pistol":d=1200,f=.12,h=.5,u=180,g=50,y=.06,m=.3;break;case"rifle":d=800,f=.18,h=.6,u=140,g=40,y=.1,m=.5;break;case"shotgun":if(this.shotgunBuffer)try{const p=this.ctx.createBufferSource();p.buffer=this.shotgunBuffer;const b=this.ctx.createGain();b.gain.setValueAtTime(.9,i),p.connect(b),b.connect(s),p.start(i);return}catch(p){console.error("Error playing custom shotgun audio:",p)}d=500,f=.35,h=.9,u=120,g=30,y=.25,m=.9,this.playMetallicClick(i+.05,800,.08,.3,t),this.playMetallicClick(i+.1,600,.05,.3,t);break;case"sniper":d=1500,f=.6,h=1,u=220,g=30,y=.4,m=1;break;case"knife":d=2e3,f=.12,h=.45,u=100,g=100,y=.01,m=0;break;case"vector":d=1600,f=.08,h=.42,u=200,g=80,y=.05,m=.25;break;case"famas":d=1e3,f=.14,h=.55,u=160,g=50,y=.09,m=.42;break;case"plasma":{d=3e3,f=.18,h=.3,u=600,g=120,y=.18,m=.55;try{const p=this.ctx.createOscillator(),b=this.ctx.createGain();p.type="sawtooth",p.frequency.setValueAtTime(800,i),p.frequency.exponentialRampToValueAtTime(200,i+.15),b.gain.setValueAtTime(.08,i),b.gain.exponentialRampToValueAtTime(.001,i+.15),p.connect(b),b.connect(s),p.start(i),p.stop(i+.17)}catch{}break}case"railgun":{d=600,f=.55,h=1,u=320,g=18,y=.45,m=1;try{const p=this.ctx.createOscillator(),b=this.ctx.createGain();p.type="square",p.frequency.setValueAtTime(180,i),p.frequency.exponentialRampToValueAtTime(40,i+.3),b.gain.setValueAtTime(.15,i),b.gain.exponentialRampToValueAtTime(.001,i+.3),p.connect(b),b.connect(s),p.start(i),p.stop(i+.32)}catch{}break}}r.type="bandpass",r.frequency.setValueAtTime(d,i),o.gain.setValueAtTime(h,i),o.gain.exponentialRampToValueAtTime(.001,i+f),l.type="sine",l.frequency.setValueAtTime(u,i),l.frequency.exponentialRampToValueAtTime(g,i+y),c.gain.setValueAtTime(m,i),c.gain.exponentialRampToValueAtTime(.001,i+y),a.start(i),a.stop(i+f+.05),l.start(i),l.stop(i+y+.05)}playReload(e){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime;e==="pistol"?(this.playMetallicClick(t,2e3,.05,.3),this.playMetallicClick(t+.4,1500,.08,.4),this.playMetallicClick(t+.5,2200,.04,.3)):e==="rifle"?(this.playMetallicClick(t,1800,.06,.3),this.playFrictionalScrape(t+.3,.2,.2),this.playMetallicClick(t+1.2,1200,.1,.5),this.playMetallicClick(t+1.35,2e3,.05,.4),this.playMetallicClick(t+1.8,1400,.08,.5),this.playMetallicClick(t+1.9,1e3,.08,.4)):e==="shotgun"?(this.playMetallicClick(t,1200,.06,.4),this.playFrictionalScrape(t+.05,.15,.3),this.playMetallicClick(t+.2,1800,.04,.4)):e==="sniper"&&(this.playMetallicClick(t,1400,.08,.4),this.playMetallicClick(t+.1,1e3,.06,.3),this.playMetallicClick(t+.5,900,.1,.4),this.playMetallicClick(t+.65,1200,.05,.3),this.playMetallicClick(t+1.2,1500,.1,.4),this.playMetallicClick(t+1.35,1800,.05,.3),this.playMetallicClick(t+1.9,1100,.08,.4),this.playMetallicClick(t+2.05,1600,.06,.4))}playDryFire(){this.init(),this.ctx&&this.playMetallicClick(this.ctx.currentTime,3e3,.03,.25)}playFootstep(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.setValueAtTime(220,e);const s=this.ctx.createGain();s.gain.setValueAtTime(.08,e),s.gain.exponentialRampToValueAtTime(.001,e+.1),t.connect(i),i.connect(s),s.connect(this.masterVolume),t.start(e),t.stop(e+.12)}playHitMarker(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(1600,e),i.gain.setValueAtTime(.15,e),i.gain.exponentialRampToValueAtTime(.001,e+.08),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.1)}playCriticalHitMarker(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(2300,e),i.gain.setValueAtTime(.25,e),i.gain.exponentialRampToValueAtTime(.001,e+.14),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.16)}playFleshHit(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.setValueAtTime(350,e);const s=this.ctx.createGain();s.gain.setValueAtTime(.35,e),s.gain.exponentialRampToValueAtTime(.001,e+.1),t.connect(i),i.connect(s),s.connect(this.masterVolume),t.start(e),t.stop(e+.12)}playCrateBreak(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.setValueAtTime(300,e);const s=this.ctx.createGain();s.gain.setValueAtTime(.7,e),s.gain.exponentialRampToValueAtTime(.001,e+.3),t.connect(i),i.connect(s),s.connect(this.masterVolume);const a=this.ctx.createBufferSource();a.buffer=this.noiseBuffer;const r=this.ctx.createBiquadFilter();r.type="highpass",r.frequency.setValueAtTime(2e3,e);const o=this.ctx.createGain();o.gain.setValueAtTime(.2,e),o.gain.exponentialRampToValueAtTime(.001,e+.15),a.connect(r),r.connect(o),o.connect(this.masterVolume),t.start(e),t.stop(e+.35),a.start(e),a.stop(e+.2)}playPickup(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(587.33,e),t.frequency.setValueAtTime(880,e+.08),i.gain.setValueAtTime(.12,e),i.gain.setValueAtTime(.12,e+.08),i.gain.exponentialRampToValueAtTime(.001,e+.25),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.28)}playMatchWin(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=(i,s,a,r)=>{const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="triangle",o.frequency.setValueAtTime(i,s),l.gain.setValueAtTime(r,s),l.gain.exponentialRampToValueAtTime(.001,s+a),o.connect(l),l.connect(this.masterVolume),o.start(s),o.stop(s+a+.05)};t(523.25,e,.4,.2),t(659.25,e+.15,.4,.2),t(783.99,e+.3,.4,.2),t(1046.5,e+.45,.6,.25)}playMatchLose(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=(i,s,a,r)=>{const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sawtooth",o.frequency.setValueAtTime(i,s);const c=this.ctx.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(500,s),l.gain.setValueAtTime(r,s),l.gain.exponentialRampToValueAtTime(.001,s+a),o.connect(c),c.connect(l),l.connect(this.masterVolume),o.start(s),o.stop(s+a+.05)};t(220,e,.5,.2),t(207.65,e+.2,.5,.2),t(196,e+.4,.5,.2),t(146.83,e+.6,.8,.25)}playMetallicClick(e,t,i,s=.3,a=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const r=typeof e=="number"&&e<10?Math.max(0,e):0,o=this.ctx.currentTime+r,l=this.ctx.createOscillator(),c=this.ctx.createGain();let d=this.masterVolume;if(a>0){const f=this.ctx.createBiquadFilter();f.type="lowpass";const h=Math.max(220,3e3*(1-Math.min(1,a/1200)));f.frequency.setValueAtTime(h,o);const u=this.ctx.createGain(),g=Math.max(.01,1-a/1300);u.gain.setValueAtTime(g,o),f.connect(u),u.connect(this.masterVolume),d=f}l.connect(c),c.connect(d),l.type="square",l.frequency.setValueAtTime(t,o),l.frequency.exponentialRampToValueAtTime(t*.5,o+i),c.gain.setValueAtTime(s,o),c.gain.exponentialRampToValueAtTime(.001,o+i),l.start(o),l.stop(o+i+.01)}catch{}}playFrictionalScrape(e,t,i=.2){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const s=typeof e=="number"&&e<10?Math.max(0,e):0,a=this.ctx.currentTime+s,r=this.ctx.createBufferSource();r.buffer=this.noiseBuffer;const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(800,a),o.frequency.exponentialRampToValueAtTime(1400,a+t);const l=this.ctx.createGain();l.gain.setValueAtTime(i,a),l.gain.linearRampToValueAtTime(i*.5,a+t*.5),l.gain.exponentialRampToValueAtTime(.001,a+t),r.connect(o),o.connect(l),l.connect(this.masterVolume),r.start(a),r.stop(a+t+.02)}catch{}}playFlashbangExplosion(e=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime,i=this.ctx.createOscillator(),s=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(160,t),i.frequency.exponentialRampToValueAtTime(10,t+.3);const a=Math.max(.1,1-e/1100);s.gain.setValueAtTime(.85*a,t),s.gain.exponentialRampToValueAtTime(.001,t+.35),i.connect(s),s.connect(this.masterVolume),i.start(t),i.stop(t+.4);const r=this.ctx.createOscillator(),o=this.ctx.createGain();r.type="sine",r.frequency.setValueAtTime(4500,t);const l=.35*Math.max(.01,1-e/700);o.gain.setValueAtTime(l,t),o.gain.linearRampToValueAtTime(l*.5,t+1),o.gain.exponentialRampToValueAtTime(.001,t+2.5),r.connect(o),o.connect(this.masterVolume),r.start(t),r.stop(t+2.6)}catch{}}playDashSound(e=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime,i=this.ctx.createOscillator(),s=this.ctx.createGain();let a=this.masterVolume;if(e>0){const r=this.ctx.createBiquadFilter();r.type="lowpass";const o=Math.max(220,3e3*(1-Math.min(1,e/1200)));r.frequency.setValueAtTime(o,t);const l=this.ctx.createGain(),c=Math.max(.01,1-e/1300);l.gain.setValueAtTime(c,t),r.connect(l),l.connect(this.masterVolume),a=r}i.connect(s),s.connect(a),i.type="sine",i.frequency.setValueAtTime(800,t),i.frequency.exponentialRampToValueAtTime(150,t+.2),s.gain.setValueAtTime(.35,t),s.gain.exponentialRampToValueAtTime(.001,t+.22),i.start(t),i.stop(t+.25)}catch{}}playAlarmForTask(e,t=0){if(this.init(),!this.ctx)return;if(this.ctx.state==="suspended"&&this.ctx.resume(),this.taskAlarms.has(e)){this.taskAlarms.get(e).distance=t;return}const i={intervalId:null,nodes:[],active:!0,distance:t};this.taskAlarms.set(e,i);const s=()=>{if(!i.active||!this.ctx)return;const a=i.distance,r=700,o=Math.max(0,Math.pow(1-Math.min(1,a/r),2.8)),l=Math.max(150,4e3*Math.pow(1-Math.min(1,a/r),2.5)),c=this.ctx.currentTime,d=this.ctx.createGain();d.gain.setValueAtTime(0,c),d.gain.linearRampToValueAtTime(o*.55,c+.04),d.gain.setValueAtTime(o*.55,c+.32),d.gain.linearRampToValueAtTime(0,c+.42);const f=this.ctx.createBiquadFilter();f.type="lowpass",f.frequency.setValueAtTime(l,c),f.Q.value=.9;const h=this.ctx.createOscillator();h.type="sawtooth",h.frequency.setValueAtTime(880,c),h.frequency.linearRampToValueAtTime(660,c+.2),h.frequency.linearRampToValueAtTime(880,c+.4);const u=this.ctx.createOscillator();u.type="square",u.frequency.setValueAtTime(1100,c),u.frequency.linearRampToValueAtTime(880,c+.2),u.frequency.linearRampToValueAtTime(1100,c+.4);const g=this.ctx.createGain();g.gain.value=.35;const y=this.ctx.createWaveShaper(),m=new Float32Array(256);for(let p=0;p<256;p++){const b=p*2/256-1;m[p]=(Math.PI+180)*b/(Math.PI+180*Math.abs(b))}if(y.curve=m,y.oversample="2x",h.connect(y),u.connect(g),g.connect(y),y.connect(f),f.connect(d),d.connect(this.masterVolume),this.reverbNode&&t<900){const p=this.ctx.createGain();p.gain.value=Math.max(0,.4*(1-t/900)),d.connect(p),p.connect(this.reverbNode)}h.start(c),u.start(c),h.stop(c+.45),u.stop(c+.45),i.nodes.push(h,u,d,f)};s(),i.intervalId=setInterval(s,600)}stopAlarmForTask(e){const t=this.taskAlarms.get(e);t&&(t.active=!1,t.intervalId!==null&&clearInterval(t.intervalId),t.nodes.forEach(i=>{try{i.stop&&i.stop()}catch{}}),this.taskAlarms.delete(e))}stopAllAlarms(){this.taskAlarms.forEach((e,t)=>this.stopAlarmForTask(t)),this.taskAlarms.clear()}playBearMusic(){this.bearMusic||(this.bearMusic=new Audio("/bear.mp3"),this.bearMusic.loop=!0),this.bearMusic.volume=this.volume*.3,this.bearMusic.paused&&(this.bearMusic.currentTime=0,this.bearMusic.play().catch(e=>console.warn("Error playing bear music:",e)))}stopBearMusic(){this.bearMusic&&(this.bearMusic.pause(),this.bearMusic.currentTime=0)}playHighBeep(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(2e3,e),t.frequency.exponentialRampToValueAtTime(3e3,e+.15),i.gain.setValueAtTime(.2,e),i.gain.exponentialRampToValueAtTime(.001,e+.2),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.22)}}class Cy{constructor(e,t,i,s,a,r,o){this.socket=e,this.localPlayer=t,this.opponent=i,this.map=s,this.particles=a,this.sound=r,this.engine=o,this.opponentStateBuffers=new Map,this.interpolationDelay=100,this.lastSentTime=0,this.sendInterval=1e3/60,window.AppSocket=this.socket,this.socket&&this.setupListeners()}setupListeners(){this.socket.on("opponent-state",e=>{if(!e.id)return;const t=this.engine.remotePlayers.get(e.id);if(!t)return;e.justDashed&&(t.justDashed=!0),e.droppedItem&&this.engine.spawnItemAt(e.droppedItem.x,e.droppedItem.y,e.droppedItem.type,e.droppedItem.id),e.health!==void 0&&(t.health=e.health);let i=this.opponentStateBuffers.get(e.id);i||(i=[],this.opponentStateBuffers.set(e.id,i)),i.push({time:Date.now(),x:e.x,y:e.y,angle:e.angle,vx:e.vx,vy:e.vy,health:e.health,weaponKey:e.weaponKey,isReloading:e.isReloading,muzzleFlash:e.muzzleFlash,flashlightActive:e.flashlightActive,inVent:e.inVent||!1}),i.length>30&&i.shift()}),this.socket.on("opponent-shoot",e=>{const t=this.engine.remotePlayers.get(e.playerId);if(t){if(t.muzzleFlash=1,t.angle=e.angle,this.particles.spawnGunCasing(t.x,t.y,t.angle,e.weaponKey),this.sound){const i=Math.hypot(t.x-this.localPlayer.x,t.y-this.localPlayer.y);this.sound.playGunshot(e.weaponKey,i)}this.engine.spawnBulletFromNetwork(e)}}),this.socket.on("damage-taken",e=>{if(this.engine.gameState==="playing"&&e.targetId===this.localPlayer.id){this.localPlayer.takeDamage(e.damage,this.sound);const i=this.engine.devCheatActive?Math.round(this.localPlayer.health/2):this.localPlayer.health;this.socket.emit("sync-health",{playerId:this.localPlayer.id,health:i}),this.engine.shakeCamera(e.damage*.45),this.engine.players.some(a=>a.health>0&&a.team===this.localPlayer.team)||this.socket.emit("player-died",{winnerId:e.shooterId,winnerName:"Opponents",loserId:this.localPlayer.id,roundNumber:this.engine.roundNumber})}}),this.socket.on("opponent-health-sync",e=>{const t=this.engine.remotePlayers.get(e.playerId);t&&(t.health=e.health)}),this.socket.on("opponent-break-crate",e=>{this.map.syncBreakCrate(e.crateId,e.spawnedItem),this.sound&&this.sound.playCrateBreak(),this.particles.spawnCrateSplinters(e.crateX||0,e.crateY||0)}),this.socket.on("opponent-pickup-item",e=>{const t=this.map.items.find(i=>i.id===e.itemId);t&&(t.active=!1,this.sound&&this.sound.playPickup())}),this.socket.on("opponent-sabotage-alarm",e=>{if(this.engine&&this.engine.tasks){const t=this.engine.tasks[e.idx];if(t&&(t.status="completed",t.alarmActive=!0,t.alarmTimer=15,this.sound)){const i=Math.hypot(this.localPlayer.x-t.x,this.localPlayer.y-t.y);try{this.sound.playAlarmForTask(t.id,i)}catch{}}}}),this.socket.on("opponent-chat",e=>{let t=e.name;const i=this.engine.remotePlayers.get(e.id);i&&(t=i.name);const s=new CustomEvent("opponent-chat-msg",{detail:{name:t,msg:e.msg}});window.dispatchEvent(s)}),this.socket.on("round-over",e=>{this.engine.handleServerRoundOver(e)}),this.socket.on("match-over",e=>{this.engine.handleServerMatchOver(e)})}sendState(e){if(this.socket&&e-this.lastSentTime>=this.sendInterval){this.lastSentTime=e;const i=this.engine.devCheatActive?Math.round(this.localPlayer.health/2):this.localPlayer.health,s={x:this.localPlayer.x,y:this.localPlayer.y,angle:this.localPlayer.angle,vx:this.localPlayer.vx,vy:this.localPlayer.vy,health:i,weaponKey:this.localPlayer.weaponKey,isReloading:this.localPlayer.isReloading,muzzleFlash:this.localPlayer.muzzleFlash,flashlightActive:this.localPlayer.flashlightActive,inVent:this.localPlayer.inVent||!1,justDashed:this.localPlayer.networkJustDashed||!1,droppedItem:this.localPlayer.networkDroppedItem||null};this.localPlayer.networkJustDashed=!1,this.localPlayer.networkDroppedItem=null,this.socket.emit("player-state",s)}}sendShoot(e){this.socket&&this.socket.emit("shoot",e)}interpolateOpponents(){const e=Date.now();this.lastInterpolateTime||(this.lastInterpolateTime=e);const t=e-this.lastInterpolateTime;this.lastInterpolateTime=e;const s=Math.max(1,Math.min(100,t))/16.67;this.engine.remotePlayers.forEach((a,r)=>{const o=this.opponentStateBuffers.get(r);if(!a||!o||o.length===0)return;const c=Date.now()-this.interpolationDelay;let d=null,f=null;for(let h=0;h<o.length;h++){const u=o[h];if(u.time<=c)d=u;else{f=u;break}}if(d&&f){const h=f.time-d.time,u=h>0?(c-d.time)/h:0;a.x=d.x+(f.x-d.x)*u,a.y=d.y+(f.y-d.y)*u,a.angle=this.lerpAngle(d.angle,f.angle,u),a.vx=d.vx+(f.vx-d.vx)*u,a.vy=d.vy+(f.vy-d.vy)*u,a.weaponKey=d.weaponKey,a.isReloading=d.isReloading,a.muzzleFlash=d.muzzleFlash,a.flashlightActive=d.flashlightActive,a.inVent=d.inVent||!1}else{const h=o[o.length-1],g=1-Math.pow(1-.25,s);a.x+=(h.x-a.x)*g,a.y+=(h.y-a.y)*g,a.angle=this.lerpAngle(a.angle,h.angle,g),a.vx=h.vx,a.vy=h.vy,a.weaponKey=h.weaponKey,a.isReloading=h.isReloading,a.muzzleFlash=h.muzzleFlash,a.flashlightActive=h.flashlightActive,a.inVent=h.inVent||!1}})}lerpAngle(e,t,i){let s=t-e;for(;s<-Math.PI;)s+=Math.PI*2;for(;s>Math.PI;)s-=Math.PI*2;return e+s*i}destroy(){this.socket&&(this.socket.off("opponent-state"),this.socket.off("opponent-shoot"),this.socket.off("damage-taken"),this.socket.off("opponent-health-sync"),this.socket.off("opponent-break-crate"),this.socket.off("opponent-pickup-item"),this.socket.off("opponent-sabotage-alarm"),this.socket.off("opponent-chat"),this.socket.off("round-over"),this.socket.off("match-over"))}}class Qc{constructor(e,t,i,s,a){this.x=e,this.y=t,this.vx=i,this.vy=s,this.throwerId=a,this.radius=6,this.friction=.98,this.bounceFriction=.6,this.timer=1200,this.creationTime=performance.now(),this.active=!0}update(e,t){if(t-this.creationTime>=this.timer){this.active=!1;return}this.vx*=this.friction,this.vy*=this.friction;const s=this.x+this.vx,a=this.y+this.vy,r=e.checkCircleCollision(s,a,this.radius);if(r.x!==s||r.y!==a){const o=e.checkCircleCollision(s,this.y,this.radius),l=e.checkCircleCollision(this.x,a,this.radius);o.x!==s&&(this.vx=-this.vx*this.bounceFriction),l.y!==a&&(this.vy=-this.vy*this.bounceFriction),this.x=r.x,this.y=r.y}else this.x=s,this.y=a}draw(e){e.save(),e.beginPath(),e.arc(this.x,this.y,this.radius,0,Math.PI*2),e.fillStyle="#2d332f",e.strokeStyle="#66fcf1",e.lineWidth=1.5,e.fill(),e.stroke(),Math.floor(performance.now()/150)%2===0&&(e.beginPath(),e.arc(this.x,this.y,2,0,Math.PI*2),e.fillStyle="#ff3c3c",e.fill()),e.restore()}}class ml{constructor(e,t){try{this.canvas=document.getElementById(e),this.ctx=this.canvas.getContext("2d"),this.mode=t.mode,this.socket=t.socket,this.isRanked=!!t.isRanked,this.mapWidth=t.mapId==="arena"?900:1400,this.mapHeight=t.mapId==="arena"?900:1400,this.map=new wy(this.mapWidth,this.mapHeight,t.seed,t.mapId),this.sound=new Ry,this.sound.setVolume(t.settings.volume!==void 0?t.settings.volume:.5),this.particles=new Ay,this.particles.setBloodEnabled(t.settings.blood);let i=!1;const s=t.matchMode||t.mode||"";if(this.matchMode=s,this.qpRenderStyle=t.qpRenderStyle,this.isRanked?s.includes("competitive")&&(i=!0):t.qpRenderStyle==="competitive"&&(i=!0),this.settings={...t.settings},this.matchMode==="sabotage"?(this.settings.performanceMode=!1,this.settings.shadows=!0):i?(this.settings.performanceMode=!0,this.settings.shadows=!1):(this.settings.performanceMode=!1,this.settings.shadows=!0),dn.init().catch(r=>console.warn("[Engine] CharacterRenderer init failed:",r)),window.LocalPlayerId=t.localPlayerId,window.IsOfflineMode=this.mode==="offline",this.spawns=[{x:150,y:150},{x:this.mapWidth-150,y:this.mapHeight-150},{x:150,y:this.mapHeight-150},{x:this.mapWidth-150,y:150}],this.players=[],this.localPlayer=null,this.remotePlayers=new Map,(t.players||[{id:t.localPlayerId,name:t.localPlayerName,weapon:t.localWeapon,color:t.localColor}]).forEach((r,o)=>{const l=this.spawns[o%this.spawns.length],c=r.id===t.localPlayerId,d=o%2===0?1:2,f=this.mode==="offline"&&!c,h=new Ty(r.id,l.x,l.y,r.name,r.weapon||"pistol",r.color||"cyan",c,f);if(h.team=d,c)this.localPlayer=h,this.localPlayerIndex=o;else{const u=t.localPlayerIndex!==void 0?t.localPlayerIndex:0;h.isTeammate=o%2===u%2,this.remotePlayers.set(r.id,h)}this.players.push(h)}),this.bullets=[],this.grenades=[],this.activeHitmarkers=[],this.floatingNumbers=[],this.replayFrames=[],this.lastSnapshotTime=0,this.devCheatActive=!1,this.vents=[],this.tasks=[],this.activeTask=null,this.ventCooldown=0,this.currentVent=null,this.sweepAngle=0,this.sweepProgress=0,this.network=null,this.mode==="online"&&(this.network=new Cy(this.socket,this.localPlayer,null,this.map,this.particles,this.sound,this),this.socket.on("opponent-throw-grenade",r=>{const o=new Qc(r.x,r.y,r.vx,r.vy,r.playerId);this.grenades.push(o);const l=Math.hypot(this.localPlayer.x-r.x,this.localPlayer.y-r.y);this.sound.playMetallicClick(0,1500,.08,.2,l)})),window.MatchStats={roundsWon:0,damageDealt:0,shotsFired:0,accuracy:0,hitsRegistered:0},this.onMatchEnd=t.onMatchEnd,this.onKillFeed=t.onKillFeed,this.lastKillTime=0,this.multiKillCount=0,this.combatBanner=null,this.camera={x:this.localPlayer.x,y:this.localPlayer.y,shakeX:0,shakeY:0},this.cameraShake=0,this.zoom=1,this.gameState="warmup",this.roundNumber=1,this.scoreSelf=0,this.scoreOpponent=0,this.countdownTimer=3,this.matchTime=120,this.lastTime=performance.now(),this.roundStartTime=0,this.countdownStart=0,this.matchTimerInterval=null,window.gameEngine=this,this.fpsFrameCount=0,this.fpsLastTick=performance.now(),this.currentFPS=0,this.keys={},this.mouse={x:0,y:0,gameX:0,gameY:0,angle:0,clicked:!1,buttons:{}},this.lastSprintTime=performance.now(),this.sprintTipVisible=!1,this.zone={active:!1,currentRadius:0,targetRadius:0,centerX:this.mapWidth/2,centerY:this.mapHeight/2,shrinkSpeed:0,damage:20,lastDamageTick:0,warnShown:!1},this.zoneTimer=null,this.resizeCanvas(),this.setupControls(),this.startRoundCycle(),this.active=!0,this.loop(),this.localPlayer.updateHUD(),this.updateScoreboardHUD(),this.matchMode==="sabotage"){const r=document.querySelector(".score-display");r&&(r.style.display="none");const o=document.querySelector(".timer-display");o&&(o.style.display="none");const l=document.querySelector(".bars-container.right-aligned");l&&(l.style.display="none");const c=document.querySelector(".opponent-weapon-display");c&&(c.style.display="none");const d=document.querySelector(".ammo-display");d&&(d.style.display="none");const f=document.querySelector(".inventory-display");f&&(f.style.display="none")}this.mode==="offline"&&(window.OnBotShootCallback=r=>{const o=this.players.find(l=>l.id===r.playerId);o&&this.particles.spawnGunCasing(o.x,o.y,o.angle,r.weaponKey),this.spawnBulletFromNetwork(r)})}catch(i){console.error("Engine Constructor Error:",i);try{const s=document.getElementById(e),a=s.getContext("2d");a.fillStyle="rgba(10, 10, 15, 0.95)",a.fillRect(0,0,s.width,s.height),a.fillStyle="#ff3c3c",a.font="bold 20px monospace",a.fillText("TACTICSTRIKE CONSTRUCTOR ERROR DETECTED",20,50),a.fillStyle="#ffffff",a.font="12px monospace";const r=(i.stack||i.toString()).split(`
`);let o=90;r.forEach(l=>{a.fillText(l,20,o),o+=18})}catch{}throw i}}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}setupControls(){this.resizeHandler=()=>this.resizeCanvas(),window.addEventListener("resize",this.resizeHandler),this.keydownHandler=s=>{const a=document.getElementById("chat-input");if(a&&document.activeElement===a)return;if(this.activeMinigame){s.preventDefault(),s.key==="Escape"?this.cancelHackingMinigame():this.handleMinigameKeyPress(s.key.toLowerCase());return}const r=s.key.toLowerCase()==="i",o=s.key==="9";if(r&&this.keys[9]||o&&this.keys.i){this.devCheatActive=!this.devCheatActive,this.devCheatActive&&this.localPlayer?(this.localPlayer.maxHealth=200,this.localPlayer.health=200):this.localPlayer&&(this.localPlayer.maxHealth=100,this.localPlayer.health>100&&(this.localPlayer.health=100));return}if(this.matchMode==="sabotage"&&this.localPlayer&&this.localPlayer.health>0){if(this.localPlayer.inVent&&this.currentVent){if(s.key>="1"&&s.key<="5"){s.preventDefault();const l=parseInt(s.key)-1,c=this.vents[l];if(c&&c.id!==this.currentVent.id){this.localPlayer.x=c.x,this.localPlayer.y=c.y,this.currentVent=c;try{this.sound.playFrictionalScrape(0,.3,.4)}catch{}}}else if(s.key===" "||s.key==="Spacebar"){s.preventDefault(),this.localPlayer.inVent=!1,this.currentVent=null;try{this.sound.playFrictionalScrape(0,.2,.3)}catch{}}return}if(this.activeTask){if(s.key===" "||s.key==="Spacebar"){s.preventDefault();const l=Math.abs(Math.sin(this.sweepAngle));if(l>=.4&&l<=.6){this.sweepProgress=Math.min(100,this.sweepProgress+20);try{this.sound.playMetallicClick(0,2e3,.08,.35)}catch{}if(this.sweepProgress>=100){const c=this.activeTask;c.status="completed",c.alarmActive=!0,c.alarmTimer=15,this.activeTask=null,this.localPlayer.showTextNotification("TASK COMPLETE! 🚨 ALARM TRIGGERED");const d=Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y);try{this.sound.playAlarmForTask(c.id,d)}catch{}if(this.matchMode==="sabotage"&&this.tasks.every(h=>h.status==="completed")){if(this.mode==="offline")this.endRound(1,"tasks completed");else if(this.localPlayer.team===1&&this.socket){const h=this.players.find(u=>u.team===2);h&&this.socket.emit("player-died",{winnerId:this.localPlayer.id,winnerName:this.localPlayer.name,loserId:h.id,roundNumber:this.roundNumber})}}}}else{this.sweepProgress=Math.max(0,this.sweepProgress-10);try{this.sound.playMetallicClick(0,500,.15,.25)}catch{}}}else(s.key==="Escape"||s.key.toLowerCase()==="f")&&this.activeTask&&(this.activeTask.status="pending",this.activeTask=null);return}if(s.key.toLowerCase()==="e"){const l=this.vents.find(c=>Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y)<50);if(l){if(this.ventCooldown>0)this.localPlayer.showTextNotification(`VENT COOLDOWN: ${this.ventCooldown.toFixed(1)}s`);else{this.localPlayer.inVent=!0,this.currentVent=l,this.ventCooldown=10;try{this.sound.playFrictionalScrape(0,.2,.35)}catch{}}return}}if(s.key.toLowerCase()==="f"){const l=this.tasks.find(c=>c.status==="pending"&&Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y)<40);if(l){this.activeTask=l,l.status="doing",this.sweepProgress=0,this.sweepAngle=0;return}}}if(s.key===" "&&s.preventDefault(),this.keys[s.key.toLowerCase()]=!0,s.key.toLowerCase()==="f"&&this.localPlayer&&this.localPlayer.health>0){this.localPlayer.flashlightActive=!this.localPlayer.flashlightActive;try{this.sound.playMetallicClick(0,1800,.05,.15)}catch{}}if(this.localPlayer&&this.localPlayer.health>0){if(s.key.toLowerCase()==="h"&&this.localPlayer.healthPacks>0){this.localPlayer.healthPacks--;const l=this.spawnItemAt(this.localPlayer.x,this.localPlayer.y,"health");this.localPlayer.showTextNotification("DROPPED HEALTH PACK","#ff6ef7"),this.localPlayer.updateHUD(),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:l,x:this.localPlayer.x,y:this.localPlayer.y,type:"health"})}if(s.key.toLowerCase()==="j"&&this.localPlayer.ammoPacks>0){this.localPlayer.ammoPacks--;const l=this.spawnItemAt(this.localPlayer.x,this.localPlayer.y,"ammo");this.localPlayer.showTextNotification("DROPPED AMMO PACK","#ff6ef7"),this.localPlayer.updateHUD(),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:l,x:this.localPlayer.x,y:this.localPlayer.y,type:"ammo"})}}s.key==="1"&&this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(1),s.key==="2"&&this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(2),s.key==="3"&&this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)},this.keyupHandler=s=>{this.keys[s.key.toLowerCase()]=!1},window.addEventListener("keydown",this.keydownHandler),window.addEventListener("keyup",this.keyupHandler),this.mousemoveHandler=s=>{if(this.mouse.x=s.clientX,this.mouse.y=s.clientY,this.firstPersonMode)this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.angle+=s.movementX*.0025);else{const a=this.mouse.x-this.canvas.width/2,r=this.mouse.y-this.canvas.height/2;this.mouse.angle=Math.atan2(r,a)}},this.mousedownHandler=s=>{if(this.mouse.buttons[s.button]=!0,s.button===0){const o=document.getElementById("chat-input");if(o&&document.activeElement===o||s.target.closest("#btn-game-menu")||s.target.closest(".inv-slot")||s.target.closest("button")||s.target.closest("input")||s.target.closest(".inventory-display"))return;this.mouse.clicked=!0,this.firstPersonMode&&(document.pointerLockElement===document.getElementById("game-container")||this.requestPointerLock())}const a=s.button===1,r=s.button===2;(a&&this.mouse.buttons[2]||r&&this.mouse.buttons[1])&&(this.devCheatActive=!this.devCheatActive,this.devCheatActive&&this.localPlayer?(this.localPlayer.maxHealth=200,this.localPlayer.health=200):this.localPlayer&&(this.localPlayer.maxHealth=100,this.localPlayer.health>100&&(this.localPlayer.health=100)))},this.mouseupHandler=s=>{this.mouse.buttons[s.button]=!1,s.button===0&&(this.mouse.clicked=!1)},this.wheelHandler=s=>{const a=document.getElementById("chat-input");a&&document.activeElement===a||this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)},window.addEventListener("mousemove",this.mousemoveHandler),window.addEventListener("mousedown",this.mousedownHandler),window.addEventListener("mouseup",this.mouseupHandler),window.addEventListener("wheel",this.wheelHandler,{passive:!0}),this.contextmenuHandler=s=>{s.preventDefault()},window.addEventListener("contextmenu",this.contextmenuHandler),this.invSlot1Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(1)},this.invSlot2Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(2)},this.invSlot3Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)};const e=document.getElementById("inv-slot-1"),t=document.getElementById("inv-slot-2"),i=document.getElementById("inv-slot-3");e&&e.addEventListener("click",this.invSlot1Handler),t&&t.addEventListener("click",this.invSlot2Handler),i&&i.addEventListener("click",this.invSlot3Handler),this.setupGamepad(),this.pointerLockChangeHandler=()=>{const s=document.pointerLockElement===document.getElementById("game-container"),a=this.matchMode&&this.matchMode.startsWith("firstperson");!s&&this.firstPersonMode&&!a&&this.toggleFirstPersonMode()},document.addEventListener("pointerlockchange",this.pointerLockChangeHandler)}setupGamepad(){this._gpState={prevButtons:[],deadzone:.18,aimAngle:0,aimActive:!1,frameCount:0,cachedGP:null}}pollGamepad(){if(!navigator.getGamepads)return;const e=this._gpState;if(e.frameCount++,e.frameCount%2===0){const h=navigator.getGamepads();e.cachedGP=null;for(let u=0;u<h.length;u++)if(h[u]){e.cachedGP=h[u];break}}const t=e.cachedGP;if(!t||!this.localPlayer||this.localPlayer.health<=0)return;const i=e.deadzone,s=h=>t.buttons[h],a=h=>!!(s(h)&&s(h).pressed),r=h=>s(h)?s(h).value:0,o=h=>!!e.prevButtons[h],l=Math.abs(t.axes[0])>i?t.axes[0]:0,c=Math.abs(t.axes[1])>i?t.axes[1]:0;this.keys.w=c<-i,this.keys.s=c>i,this.keys.a=l<-i,this.keys.d=l>i,this.keys.shift=a(10);const d=Math.abs(t.axes[2])>i?t.axes[2]:0,f=Math.abs(t.axes[3])>i?t.axes[3]:0;if(Math.hypot(d,f)>i?(e.aimAngle=Math.atan2(f,d),e.aimActive=!0):e.aimActive=!1,e.aimActive&&(this.mouse.angle=e.aimAngle,this.localPlayer.angle=e.aimAngle),this.mouse.clicked=r(7)>.3,a(4)&&!o(4)&&this.localPlayer.switchSlot(1),a(5)&&!o(5)&&this.localPlayer.switchSlot(2),a(1)&&!o(1)&&(this.keys.r=!0,setTimeout(()=>{this.keys.r=!1},80)),this.keys[" "]=a(0),a(3)&&!o(3)){this.localPlayer.flashlightActive=!this.localPlayer.flashlightActive;try{this.sound.playMetallicClick(0,1800,.05,.15)}catch{}}a(2)&&!o(2)&&this.localPlayer.flashGrenades>0&&(this.localPlayer.throwFlashbangRequest=!0),e.prevButtons=Array.from(t.buttons).map(h=>!!(h&&h.pressed))}toggleFirstPersonMode(){if(this.matchMode&&this.matchMode.startsWith("firstperson")&&this.firstPersonMode){const s=document.getElementById("btn-toggle-fpm");s&&(s.style.display="none");const a=document.getElementById("game-canvas-3d");a&&(a.style.display="block",this.firstPersonController&&this.firstPersonController.onResize()),this.firstPersonController.active=!0,this.requestPointerLock();return}this.firstPersonMode=!this.firstPersonMode;const t=document.getElementById("btn-toggle-fpm"),i=document.getElementById("game-canvas-3d");this.firstPersonMode?(t&&t.classList.add("active"),i&&(i.style.display="block"),this.firstPersonController.active=!0,this.firstPersonController&&this.firstPersonController.onResize(),this.requestPointerLock()):(t&&t.classList.remove("active"),i&&(i.style.display="none"),this.firstPersonController.active=!1,this.exitPointerLock())}requestPointerLock(){const e=document.getElementById("game-container");e&&e.requestPointerLock&&e.requestPointerLock()}exitPointerLock(){document.exitPointerLock&&document.exitPointerLock()}destroy(){this.active=!1,window.removeEventListener("resize",this.resizeHandler),window.removeEventListener("keydown",this.keydownHandler),window.removeEventListener("keyup",this.keyupHandler),window.removeEventListener("mousemove",this.mousemoveHandler),window.removeEventListener("mousedown",this.mousedownHandler),window.removeEventListener("mouseup",this.mouseupHandler),window.removeEventListener("wheel",this.wheelHandler),window.removeEventListener("contextmenu",this.contextmenuHandler);const e=document.getElementById("inv-slot-1"),t=document.getElementById("inv-slot-2"),i=document.getElementById("inv-slot-3");if(e&&this.invSlot1Handler&&e.removeEventListener("click",this.invSlot1Handler),t&&this.invSlot2Handler&&t.removeEventListener("click",this.invSlot2Handler),i&&this.invSlot3Handler&&i.removeEventListener("click",this.invSlot3Handler),this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.zoneTimer&&(clearTimeout(this.zoneTimer),this.zoneTimer=null),this.sound){try{this.sound.stopAllAlarms()}catch{}try{this.sound.stopBearMusic()}catch{}}this.network&&this.network.destroy();const s=document.querySelector(".score-display");s&&(s.style.display="");const a=document.querySelector(".timer-display");a&&(a.style.display="");const r=document.querySelector(".bars-container.right-aligned");r&&(r.style.display="");const o=document.querySelector(".opponent-weapon-display");o&&(o.style.display="");const l=document.querySelector(".ammo-display");l&&(l.style.display="");const c=document.querySelector(".inventory-display");c&&(c.style.display=""),this.socket&&this.socket.off("opponent-throw-grenade"),this.particles.clear(),window.OnBotShootCallback=null,window.AppSocket=null}updateSettings(e){this.sound&&this.sound.setVolume(e.volume),this.particles&&this.particles.setBloodEnabled(e.blood);let t=!1;const i=this.matchMode||this.mode||"";this.isRanked?i.includes("competitive")&&(t=!0):this.qpRenderStyle==="competitive"&&(t=!0),this.settings={...e},this.matchMode==="sabotage"?(this.settings.performanceMode=!1,this.settings.shadows=!0):t?(this.settings.performanceMode=!0,this.settings.shadows=!1):(this.settings.performanceMode=!1,this.settings.shadows=!0)}shakeCamera(e){this.cameraShake=Math.max(this.cameraShake,e)}spawnBulletFromNetwork(e){if(e.pellets&&e.pellets>1)for(let t=0;t<e.pellets;t++)this.bullets.push(new ya(e));else this.bullets.push(new ya(e))}startRoundCycle(){if(this.gameState="countdown",this.countdownTimer=3,this.countdownStart=performance.now(),this.matchMode==="sabotage"){this.vents=[{id:"vent_a",x:180,y:180,name:"North-West Vent"},{id:"vent_b",x:this.mapWidth-180,y:180,name:"North-East Vent"},{id:"vent_c",x:180,y:this.mapHeight-180,name:"South-West Vent"},{id:"vent_d",x:this.mapWidth-180,y:this.mapHeight-180,name:"South-East Vent"},{id:"vent_e",x:700,y:700,name:"Central Vent"}],this.ventCooldown=0,this.currentVent=null,this.activeTask=null,this.localPlayer&&(this.localPlayer.inVent=!1,this.localPlayer.weaponKey="none");const f=[];for(let y=0;y<9;y++){const m=this.map.rooms[y];m&&f.push({name:m.name||`Section ${y+1}`,x:Math.round(m.x+m.w/2),y:Math.round(m.y+m.h/2)})}f.push({name:"Central Corridors",x:700,y:700});const u=[...f].sort(()=>Math.random()-.5).slice(0,5),g=["Fix Wiring","Calibrate Core","Download Files","Clear Vent Filters","Stabilize Energy Grid","Align Antenna","Unlock Console","Refuel Engine","Inspect Sample","Reset Breakways"];this.tasks=u.map((y,m)=>({id:`task_r${this.roundNumber}_${m}`,x:y.x,y:y.y,name:g[m%g.length]+` in ${y.name}`,rawName:g[m%g.length],progress:0,targetProgress:100,status:"pending",alarmActive:!1,alarmTimer:0}))}this.lastSprintTime=performance.now(),this.sprintTipVisible=!1;const e=document.getElementById("sprint-tip-popup");e&&(e.style.display="none");const t=(this.map.seed||"default_seed")+"_"+this.roundNumber;let i=0;for(let f=0;f<t.length;f++)i=(i<<5)-i+t.charCodeAt(f),i|=0;const s=()=>(i=i*1664525+1013904223|0,(i>>>0)/4294967296),a=[this.spawns[0],this.spawns[2]],r=[this.spawns[1],this.spawns[3]],o=s()<.5?0:1,l=s()<.5?0:1;this.players.forEach((f,h)=>{let u;f.team===1?u=a[(o+h)%a.length]:u=r[(l+h)%r.length],f.x=u.x,f.y=u.y,f.vx=0,f.vy=0,f.health=f.isLocal&&this.devCheatActive?200:100,f.ammoInMag=f.weapon.magSize,f.reserveAmmo=f.weapon.magSize*3,f.isReloading=!1,f.floatingText=null,f.isDeadLogged=!1,f.flashGrenades=1,f.flashAlpha=0,f.isBot&&(f.botState="patrol",f.choosePatrolPoint(this.map))}),this.bullets=[],this.grenades=[],this.particles.clear(),this.map.generateMap(),this.localPlayer.updateHUD(),this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchTime=120;const c=document.getElementById("hud-status");c&&(c.innerText=`ROUND ${this.roundNumber} - COOLDOWN`),this.zoneTimer&&(clearTimeout(this.zoneTimer),this.zoneTimer=null);const d=Math.max(this.mapWidth,this.mapHeight)/2;this.zone.active=!1,this.zone.currentRadius=d*1.05,this.zone.targetRadius=d*1.05,this.zone.centerX=this.mapWidth/2,this.zone.centerY=this.mapHeight/2,this.zone.shrinkSpeed=0,this.zone.lastDamageTick=0,this.zone.warnShown=!1;try{this.sound.playFrictionalScrape(0,.5,.1)}catch{}}startRoundAction(){if(this.gameState="playing",this.roundStartTime=performance.now(),this.matchMode==="sabotage")try{this.sound.playBearMusic()}catch{}const e=document.getElementById("hud-status");e&&(e.innerText="ENGAGE TARGET"),this.matchMode!=="sabotage"&&(this.matchTimerInterval=setInterval(()=>{if(this.gameState==="playing"){this.matchTime--,this.matchTime<=0&&(this.matchTime=0,this.endRound(null,"TIME EXPIRED"));const t=Math.floor(this.matchTime/60).toString().padStart(2,"0"),i=(this.matchTime%60).toString().padStart(2,"0"),s=document.getElementById("game-timer");s&&(s.innerText=`${t}:${i}`)}},1e3)),this.matchMode!=="sabotage"&&(this.zoneTimer&&clearTimeout(this.zoneTimer),this.zoneTimer=setTimeout(()=>{if(this.gameState!=="playing")return;const t=Math.max(this.mapWidth,this.mapHeight)/2;this.zone.active=!0,this.zone.currentRadius=t*1.05,this.zone.targetRadius=t*.12,this.zone.shrinkSpeed=(this.zone.currentRadius-this.zone.targetRadius)/(60*60),this.zone.lastDamageTick=performance.now(),this.zone.centerX=this.mapWidth/2,this.zone.centerY=this.mapHeight/2;const i=document.getElementById("hud-status");i&&(i.innerText="⚠ ZONE CLOSING IN!",i.style.color="#ff3c3c",setTimeout(()=>{this.gameState==="playing"&&i&&(i.innerText="ENGAGE TARGET",i.style.color="")},2500))},4e4))}endRound(e,t=""){if(this.gameState!=="playing")return;if(this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchMode==="sabotage")try{this.sound.stopBearMusic()}catch{}let i=document.getElementById("hud-status");const s=this.localPlayer.team;e===s?(this.scoreSelf++,this.matchMode==="sabotage"&&(this.scoreSelf=3),i&&(i.innerText="ROUND WON",i.style.color="#39ff14")):e!==null?(this.scoreOpponent++,this.matchMode==="sabotage"&&(this.scoreOpponent=3),i&&(i.innerText="ROUND LOST",i.style.color="#ff3c3c")):i&&(i.innerText="ROUND DRAW",i.style.color="#ffd700"),this.updateScoreboardHUD();const a=()=>{this.scoreSelf>=3||this.scoreOpponent>=3?this.endMatch():(this.roundNumber++,this.startRoundCycle())};setTimeout(()=>{this.active&&this.startReplay(a)},0)}endMatch(){this.gameState="match-over",this.active=!1;const e=window.MatchStats.shotsFired||1,t=window.MatchStats.hitsRegistered/e*100;window.MatchStats.accuracy=t,window.MatchStats.roundsWon=this.scoreSelf;const i=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent?this.localPlayer.team:this.localPlayer.team===1?2:1:this.scoreSelf>=3?this.localPlayer.team:this.localPlayer.team===1?2:1,s=this.players.find(c=>c.team===i);window.MatchStats.winnerId=s?s.id:"unknown";const a=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent:this.scoreSelf>=3,r=this.localPlayer.rank?this.localPlayer.rank.label:"";let o=!1,l=0;this.isRanked&&(o=this.localPlayer.applyRankDelta(a?ma:ga),l=a?ma:ga),window.MatchStats.isWin=a,window.MatchStats.newRP=this.localPlayer.rp,window.MatchStats.newRank=this.localPlayer.rank,window.MatchStats.rpDelta=l,window.MatchStats.rankChanged=o,window.MatchStats.oldRankLabel=r,this.scoreSelf>=3?this.sound.playMatchWin():this.sound.playMatchLose(),this.onMatchEnd&&this.onMatchEnd(window.MatchStats)}endGameDueToDisconnect(e){this.gameState="match-over",this.active=!1,alert(e);const t=document.getElementById("btn-return-lobby");t&&t.click()}updateScoreboardHUD(){const e=document.getElementById("score-self");e&&(e.innerText=this.scoreSelf);const t=document.getElementById("score-opponent");t&&(t.innerText=this.scoreOpponent);const i=document.getElementById("hud-self-name");i&&(i.innerText=this.mode==="online"&&this.players.length>2?"YOUR TEAM":this.localPlayer.name.toUpperCase());const s=document.getElementById("hud-opponent-name");s&&(s.innerText=this.players.length>2?"OPPONENTS":"OPPONENT");const a=document.getElementById("hud-opponent-weapon");if(a)if(this.players.length>2)a.innerText="SQUAD LOADOUT";else{const o=this.players.find(l=>l.id!==this.localPlayer.id);a.innerText=o?o.weapon.name.toUpperCase():"UNKNOWN"}const r=document.getElementById("opponent-indicator");r&&(r.className="op-indicator online")}drawErrorOverlay(e){try{this.ctx.restore()}catch{}this.ctx.fillStyle="rgba(10, 10, 15, 0.95)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="#ff3c3c",this.ctx.font="bold 20px monospace",this.ctx.fillText("TACTICSTRIKE RUNTIME ERROR DETECTED",20,50),this.ctx.fillStyle="#ffffff",this.ctx.font="12px monospace";const t=(e.stack||e.toString()).split(`
`);let i=90;t.forEach(s=>{const a=Math.floor((this.canvas.width-40)/7);for(let r=0;r<s.length;r+=a)this.ctx.fillText(s.substring(r,r+a),20,i),i+=18})}loop(){if(!this.active)return;const e=performance.now();if(this.lastTime=e,this.fpsFrameCount++,e-this.fpsLastTick>=1e3){this.currentFPS=Math.round(this.fpsFrameCount*1e3/(e-this.fpsLastTick)),this.fpsFrameCount=0,this.fpsLastTick=e;const t=document.getElementById("fps-counter");t&&this.settings&&this.settings.showFps&&(t.innerText=`FPS: ${this.currentFPS}`)}try{this.update(e),this.render()}catch(t){console.error("Game Loop Crash:",t),this.drawErrorOverlay(t),this.active=!1;return}requestAnimationFrame(()=>this.loop())}triggerHitmarker(e,t,i,s){this.activeHitmarkers.push({x:e,y:t,age:0,duration:200,isHeadshot:!!s}),this.floatingNumbers.push({x:e,y:t-10,damage:i,age:0,duration:800,isHeadshot:!!s})}registerLocalPlayerKill(e){if(e-this.lastKillTime<4e3?this.multiKillCount++:this.multiKillCount=1,this.lastKillTime=e,this.multiKillCount>=2){let t="DOUBLE KILL!";if(this.multiKillCount===3?t="TRIPLE KILL!":this.multiKillCount>3&&(t="RAMPAGE!"),this.combatBanner={text:t,timer:3,scale:2},this.sound)try{this.sound.playHighBeep()}catch(i){console.warn(i)}}}update(e){this.lastUpdateTime||(this.lastUpdateTime=e);const t=e-this.lastUpdateTime;this.lastUpdateTime=e;const i=Math.max(1,Math.min(150,t));if(this.dtFactor=i/16.67,this.combatBanner&&(this.combatBanner.timer-=i/1e3,this.combatBanner.timer<=0&&(this.combatBanner=null)),this.activeMinigame){this.activeMinigame.timer-=i/1e3;const _=document.getElementById("minigame-timer-bar");_&&(_.style.width=`${Math.max(0,this.activeMinigame.timer/4*100)}%`),this.activeMinigame.timer<=0&&this.failHackingMinigame()}let s=null;this.map&&this.map.terminals&&this.localPlayer&&this.localPlayer.health>0&&(s=this.map.terminals.find(_=>!_.hacked&&Math.hypot(this.localPlayer.x-_.x,this.localPlayer.y-_.y)<55));const a=document.getElementById("hud-interaction-prompt");if(s&&this.gameState==="playing"?(a&&(a.style.display="block",a.innerText=this.keys.e?`HACKING... ${Math.round(this.hackingProgress)}%`:"HOLD [E] TO HACK TERMINAL"),this.keys.e&&!this.activeMinigame?(this.localPlayer.vx=0,this.localPlayer.vy=0,this.hackingProgress||(this.hackingProgress=0),this.hackingProgress+=i*.08,this.hackingProgress>=100&&(this.hackingProgress=0,this.startHackingMinigame(s))):this.activeMinigame||(this.hackingProgress=Math.max(0,(this.hackingProgress||0)-i*.1))):(a&&!this.activeMinigame&&(a.style.display="none"),this.hackingProgress=0),this.matchMode==="sabotage"&&(this.ventCooldown>0&&(this.ventCooldown=Math.max(0,this.ventCooldown-i/1e3)),this.activeTask&&(this.sweepAngle+=.06*this.dtFactor),this.tasks.forEach(_=>{if(_.alarmActive){_.alarmTimer-=i/1e3;const v=Math.hypot(this.localPlayer.x-_.x,this.localPlayer.y-_.y);try{this.sound.playAlarmForTask(_.id,v)}catch{}if(_.alarmTimer<=0){_.alarmActive=!1,_.lastBeepTime=0;try{this.sound.stopAlarmForTask(_.id)}catch{}}}else try{this.sound.stopAlarmForTask(_.id)}catch{}})),this.gameState==="replay"){if(this.replayIndex+=this.dtFactor,Math.floor(this.replayIndex)>=this.replayFrames.length&&this.postReplayCallback){const _=this.postReplayCallback;this.postReplayCallback=null,_()}return}if(this.pollGamepad(),this.gameState==="countdown"){const _=(e-this.countdownStart)/1e3,v=3-Math.floor(_);if(v!==this.countdownTimer&&v>=0){this.countdownTimer=v;try{this.sound.playMetallicClick(0,1e3,.05,.2)}catch{}}if(v>0){const x=document.getElementById("hud-status");x&&(x.innerText=`DEPLOYING IN ${v}...`)}else{try{this.sound.playMetallicClick(0,2e3,.15,.35)}catch{}this.startRoundAction()}}(this.gameState==="playing"||this.gameState==="countdown")&&(this.localPlayer.update(this.keys,this.mouse,this.map,this.sound,e,null,this.localPlayer),this.localPlayer.justDashed&&(this.localPlayer.justDashed=!1,this.particles.spawnDashParticles(this.localPlayer.x,this.localPlayer.y,this.localPlayer.angle,this.localPlayer.colorTheme)),this.mode==="offline"?this.players.forEach(_=>{if(_.isBot){const v=_.team===1?2:1,x=this.players.filter(E=>E.health>0&&E.team===v);x.length>0?(x.sort((E,C)=>Math.hypot(_.x-E.x,_.y-E.y)-Math.hypot(_.x-C.x,_.y-C.y)),_.update(null,null,this.map,this.sound,e,x[0],this.localPlayer)):_.update(null,null,this.map,this.sound,e,null,this.localPlayer)}}):this.network.interpolateOpponents(),this.players.forEach(_=>{if(_!==this.localPlayer&&_.justDashed&&(_.justDashed=!1,this.particles.spawnDashParticles(_.x,_.y,_.angle,_.colorTheme),this.sound)){const v=Math.hypot(_.x-this.localPlayer.x,_.y-this.localPlayer.y);this.sound.playDashSound(v)}}),this.localPlayer.checkPickups(this.map,this.sound),this.mode==="offline"&&this.players.forEach(_=>{_.isBot&&_.checkPickups(this.map,this.sound)}),this.players.forEach(_=>{if(this.gameState==="playing"&&_.throwFlashbangRequest&&_.flashGrenades>0){_.throwFlashbangRequest=!1,_.flashGrenades--,_.isLocal&&!_.isBot&&_.updateHUD();const v=11,x=Math.cos(_.angle)*v,E=Math.sin(_.angle)*v,C=new Qc(_.x,_.y,x,E,_.id);this.grenades.push(C);try{this.sound.playMetallicClick(0,1500,.08,.2)}catch{}this.mode==="online"&&_.isLocal&&this.socket.emit("throw-grenade",{x:_.x,y:_.y,vx:x,vy:E})}else _.throwFlashbangRequest=!1}));const r=this.devCheatActive&&this.localPlayer.aimbotHasLOS;if(this.gameState==="playing"&&(this.mouse.clicked||r)&&!this.localPlayer.isReloading){const _=this.localPlayer.weapon.type==="Automatic"||r,v=e-this.localPlayer.lastFiredTime;if(_||v>this.localPlayer.weapon.fireRate){const x=this.localPlayer.shoot(e,this.sound);if(x){if(window.MatchStats.shotsFired+=x.pellets||1,this.shakeCamera(x.recoil*.7),this.particles.spawnGunCasing(this.localPlayer.x,this.localPlayer.y,this.localPlayer.angle,this.localPlayer.weaponKey),x.pellets&&x.pellets>1)for(let E=0;E<x.pellets;E++)this.bullets.push(new ya(x));else this.bullets.push(new ya(x));this.mode==="online"&&this.network.sendShoot(x),_||(this.mouse.clicked=!1)}}}for(let _=this.bullets.length-1;_>=0;_--){const v=this.bullets[_];v.update(this.map,this.players,this.particles,this.sound,this.dtFactor),v.active||(v.playerId===this.localPlayer.id&&window.MatchStats.hitsRegistered++,this.bullets.splice(_,1))}for(let _=this.grenades.length-1;_>=0;_--){const v=this.grenades[_];if(v.update(this.map,e),!v.active){this.particles.spawnFlashbangBurst(v.x,v.y);const x=Math.hypot(this.localPlayer.x-v.x,this.localPlayer.y-v.y);this.sound.playFlashbangExplosion(x),x<800&&this.shakeCamera(Math.max(1,15*(1-x/800))),this.players.forEach(E=>{if(E.health<=0)return;Math.hypot(E.x-v.x,E.y-v.y)<380&&E.checkLineOfSight(this.map,v.x,v.y,E.x,E.y)&&(E.flashAlpha=1,E.isLocal&&E.updateHUD())}),this.grenades.splice(_,1)}}this.particles.update(this.map);for(let _=this.activeHitmarkers.length-1;_>=0;_--){const v=this.activeHitmarkers[_];v.age+=i,v.age>=v.duration&&this.activeHitmarkers.splice(_,1)}for(let _=this.floatingNumbers.length-1;_>=0;_--){const v=this.floatingNumbers[_];v.age+=i,v.y-=1*this.dtFactor,v.age>=v.duration&&this.floatingNumbers.splice(_,1)}this.players.forEach(_=>{_.health<=0&&!_.isDeadLogged&&(_.isDeadLogged=!0,this.onKillFeed&&this.onKillFeed("Eliminated",_.name,_.weaponKey))});const o=this.players.filter(_=>_.team===this.localPlayer.team),l=o.reduce((_,v)=>{let x=v.health;return v.isLocal&&this.devCheatActive&&(x=Math.round(x/2)),_+x},0)/o.length,c=document.getElementById("hud-self-hp");c&&(c.style.width=`${Math.max(0,l)}%`);const d=document.getElementById("hud-self-hp-text");d&&(d.innerText=Math.round(Math.max(0,l)));const f=this.localPlayer.team===1?2:1,h=this.players.filter(_=>_.team===f),u=h.reduce((_,v)=>_+v.health,0)/h.length,g=document.getElementById("hud-opponent-hp");if(g&&(g.style.width=`${Math.max(0,u)}%`),this.zone.active&&this.gameState==="playing"){this.zone.currentRadius>this.zone.targetRadius&&(this.zone.currentRadius=Math.max(this.zone.targetRadius,this.zone.currentRadius-this.zone.shrinkSpeed*this.dtFactor));const _=e;_-this.zone.lastDamageTick>=1e3&&(this.zone.lastDamageTick=_,this.players.forEach(v=>{if(v.health<=0||this.mode==="online"&&!v.isLocal)return;const x=v.x-this.zone.centerX,E=v.y-this.zone.centerY;if(Math.sqrt(x*x+E*E)>this.zone.currentRadius&&(v.takeDamage(this.zone.damage,this.sound),v.isLocal&&!v.isBot&&(v.showTextNotification&&v.showTextNotification("-20 ZONE DAMAGE"),this.mode==="online"&&this.socket))){const w=this.devCheatActive?Math.round(v.health/2):v.health;this.socket.emit("sync-health",{playerId:v.id,health:w})}}))}if(this.gameState==="playing"){const _=this.players.some(x=>x.health>0&&x.team===1),v=this.players.some(x=>x.health>0&&x.team===2);_&&!v?this.mode==="offline"&&this.endRound(1,"eliminated"):!_&&v?this.mode==="offline"&&this.endRound(2,"eliminated"):!_&&!v&&this.mode==="offline"&&this.endRound(null,"both dead")}this.gameState==="playing"&&this.players.forEach(_=>{if(_.health<=0||_.health>=_.maxHealth)return;const v=this.map.checkZone(_.x,_.y);v&&v.type==="healing"&&(_.health=Math.min(_.maxHealth,_.health+v.healRate),_.isLocal&&!_.isBot&&_.updateHUD())});const y=.25,m=this.localPlayer.x+(this.mouse.x-this.canvas.width/2)*y,p=this.localPlayer.y+(this.mouse.y-this.canvas.height/2)*y,b=1-Math.pow(1-.085,this.dtFactor);if(this.camera.x+=(m-this.camera.x)*b,this.camera.y+=(p-this.camera.y)*b,this.cameraShake>.1?(this.camera.shakeX=(Math.random()-.5)*this.cameraShake,this.camera.shakeY=(Math.random()-.5)*this.cameraShake,this.cameraShake*=Math.pow(.88,this.dtFactor)):(this.camera.shakeX=0,this.camera.shakeY=0,this.cameraShake=0),this.gameState==="playing"){const _=this.keys.shift,v=document.getElementById("sprint-tip-popup");_?(this.lastSprintTime=e,this.sprintTipVisible&&(this.sprintTipVisible=!1,v&&(v.style.display="none"))):this.localPlayer&&(Math.abs(this.localPlayer.vx)>.2||Math.abs(this.localPlayer.vy)>.2)?e-this.lastSprintTime>9e3&&(this.sprintTipVisible||(this.sprintTipVisible=!0,v&&(v.style.display="flex"))):this.lastSprintTime=e}if(this.mode==="online"&&(this.gameState==="playing"||this.gameState==="countdown")&&this.network.sendState(e),this.gameState==="playing"&&e-this.lastSnapshotTime>=1e3/60){this.lastSnapshotTime=e;const _={players:this.players.map(v=>({id:v.id,x:v.x,y:v.y,angle:v.angle,health:v.health,maxHealth:v.maxHealth,weaponKey:v.weaponKey,muzzleFlash:v.muzzleFlash,isLocal:v.isLocal,isBot:v.isBot,isTeammate:v.isTeammate,color:v.colorTheme,name:v.name,flashlightActive:v.flashlightActive,flashAlpha:v.flashAlpha,radius:v.radius})),bullets:this.bullets.map(v=>({x:v.x,y:v.y,prevX:v.prevX,prevY:v.prevY,angle:v.angle,playerId:v.playerId,active:v.active,weaponKey:v.weaponKey})),grenades:this.grenades.map(v=>({x:v.x,y:v.y})),particles:this.particles.particles.map(v=>({x:v.x,y:v.y,type:v.type,angle:v.angle,size:v.size,color:v.color,life:v.life})),decals:this.particles.decals.map(v=>({x:v.x,y:v.y,type:v.type,size:v.size,color:v.color,angle:v.angle,scaleX:v.scaleX,scaleY:v.scaleY})),camera:{x:this.camera.x,y:this.camera.y},brokenLightOn:this.map.ambientLights.brokenCeiling?this.map.ambientLights.brokenCeiling.on:!0};this.replayFrames.push(_),this.replayFrames.length>300&&this.replayFrames.shift()}}startReplay(e){const t=this.players.some(i=>i.health<=0);if(this.replayFrames&&this.replayFrames.length>0&&t){this.gameState="replay",this.replayIndex=0,this.postReplayCallback=e;const i=document.getElementById("hud-status");i&&(i.innerText="● REPLAY / KILLCAM",i.style.color="#ff3c3c")}else e()}drawSnapshotPlayer(e,t){if(this.ctx.save(),t){this.ctx.fillStyle="rgba(180, 0, 0, 0.35)",this.ctx.beginPath(),this.ctx.ellipse(e.x,e.y,26,22,0,0,Math.PI*2),this.ctx.fill(),dn.ready&&(this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle+Math.PI/2),this.ctx.globalAlpha=.55,dn.draw(this.ctx,e.id+"_dead",0,0,0,0,!1,e.isLocal?"blue":"red"),this.ctx.restore()),this.ctx.restore();return}if(this.settings.laser&&e.isLocal&&this.matchMode!=="sabotage"){let c=e.x+Math.cos(e.angle)*1200,d=e.y+Math.sin(e.angle)*1200;const f=this.map.getLineIntersection({x:e.x,y:e.y},{x:c,y:d});f&&(c=f.x,d=f.y),this.ctx.save(),this.ctx.strokeStyle=e.isLocal?"rgba(102, 252, 241, 0.5)":"rgba(255, 60, 60, 0.5)",this.ctx.lineWidth=1.2,this.ctx.beginPath(),this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(c,d),this.ctx.stroke();const h=e.isLocal?"#66fcf1":"#ff3c3c",u=this.ctx.createRadialGradient(c,d,1,c,d,6);u.addColorStop(0,"#ffffff"),u.addColorStop(.3,h),u.addColorStop(1,"rgba(0, 0, 0, 0)"),this.ctx.fillStyle=u,this.ctx.beginPath(),this.ctx.arc(c,d,6,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}const i=e.muzzleFlash>.1;if(!dn.draw(this.ctx,e.id,e.x,e.y,e.angle,0,i,e.isLocal?"blue":"red")){this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle);const l={cyan:{body:"#3ba39f",armor:"#16202c",helmet:"#66fcf1"},green:{body:"#39db14",armor:"#133d07",helmet:"#5eff39"},purple:{body:"#9d3bff",armor:"#20083c",helmet:"#c47aff"},orange:{body:"#ff7f3b",armor:"#3f1b07",helmet:"#ff9d7a"},yellow:{body:"#ffd700",armor:"#3a3000",helmet:"#ffea70"},red:{body:"#ff3c3c",armor:"#3a0707",helmet:"#ff7a7a"}},c=l[e.color]||l[e.isLocal?"cyan":"red"],d=c.body,f=c.armor,h=c.helmet;let u=18,g=4;e.weaponKey==="rifle"&&(u=24,g=5),e.weaponKey==="shotgun"&&(u=22,g=6),e.weaponKey==="sniper"&&(u=32,g=4),e.weaponKey==="smg"&&(u=16,g=4),e.weaponKey==="lmg"&&(u=26,g=7),e.weaponKey==="dmr"&&(u=28,g=5),e.weaponKey==="knife"&&(u=10,g=2),this.ctx.fillStyle="#444",this.ctx.strokeStyle="#000",this.ctx.lineWidth=1,this.ctx.fillRect(10,-g/2,u,g),this.ctx.strokeRect(10,-g/2,u,g),this.ctx.fillStyle=f,this.ctx.strokeStyle="#000",this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.arc(8,-10,5,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.arc(14,6,5,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle=d,this.ctx.beginPath(),this.ctx.ellipse(0,0,18,21,0,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle=f,this.ctx.beginPath(),this.ctx.ellipse(-3,0,14,16,0,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle=h,this.ctx.beginPath(),this.ctx.arc(-2,0,8,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle="#111",this.ctx.fillRect(1,-5,3,10),this.ctx.restore()}this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle),this.ctx.fillStyle=e.weaponKey==="knife"?"#b0b8c0":"#333",this.ctx.strokeStyle="rgba(0,0,0,0.7)",this.ctx.lineWidth=1;let a=18,r=3;if(e.weaponKey==="rifle"&&(a=26,r=4),e.weaponKey==="shotgun"&&(a=22,r=5),e.weaponKey==="sniper"&&(a=36,r=3),e.weaponKey==="smg"&&(a=16,r=3),e.weaponKey==="lmg"&&(a=28,r=5),e.weaponKey==="dmr"&&(a=30,r=4),e.weaponKey==="knife"&&(a=10,r=2),this.ctx.fillRect(12,-r/2,a,r),this.ctx.strokeRect(12,-r/2,a,r),e.muzzleFlash>0){this.ctx.save(),this.ctx.translate(12+a,0);const l=this.ctx.createRadialGradient(0,0,2,0,0,16);l.addColorStop(0,"rgba(255, 255, 255, 1.0)"),l.addColorStop(.3,"rgba(255, 220, 0, 0.9)"),l.addColorStop(.7,"rgba(255, 80, 0, 0.5)"),l.addColorStop(1,"rgba(255, 0, 0, 0.0)"),this.ctx.fillStyle=l,this.ctx.beginPath(),this.ctx.arc(0,0,16,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}this.ctx.restore(),this.ctx.save(),this.ctx.textAlign="center";const o=e.isLocal?"#66fcf1":e.isTeammate?"#39db14":"#ff3c3c";if(this.ctx.fillStyle=o,this.ctx.font="10px Orbitron",this.ctx.fillText(e.name.toUpperCase(),e.x,e.y-30),!e.isLocal&&e.health>0){this.ctx.fillStyle="rgba(0,0,0,0.5)",this.ctx.fillRect(e.x-20,e.y-26,40,4);const l=e.isTeammate?"#39db14":"#ff3c3c";this.ctx.fillStyle=l,this.ctx.fillRect(e.x-20,e.y-26,40*(e.health/e.maxHealth),4)}this.ctx.restore(),this.ctx.restore()}render(){let e=null;if(this.gameState==="replay"){const x=Math.min(this.replayFrames.length-1,Math.floor(this.replayIndex));e=this.replayFrames[x]}if(this.gameState==="replay"&&!e)return;this.ctx.fillStyle="#06070a",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const t=1920,i=1080,s=this.canvas.width/t,a=this.canvas.height/i,r=Math.min(s,a);this.zoom=Math.max(.5,Math.min(1.35,r)),this.ctx.save(),this.ctx.translate(this.canvas.width/2,this.canvas.height/2),this.ctx.scale(this.zoom,this.zoom);const o=e?e.camera.x:this.camera.x,l=e?e.camera.y:this.camera.y,c=e?0:this.camera.shakeX,d=e?0:this.camera.shakeY,f=-o+c,h=-l+d;this.ctx.translate(f,h);const u=e?e.players:this.players,g=e?e.bullets:this.bullets,y=e?e.brokenLightOn:this.map.ambientLights.brokenCeiling?this.map.ambientLights.brokenCeiling.on:!0;this.map.ambientLights.brokenCeiling&&(this.map.ambientLights.brokenCeiling.on=y),u.forEach(x=>{x.health>0&&x.flashlightActive?x.lightPoly=this.map.computeVisibilityPolygon(x.x,x.y,700,x.angle,65*Math.PI/180):x.lightPoly=null}),e?e.decals.forEach(x=>{this.ctx.save(),this.ctx.translate(x.x,x.y),this.ctx.rotate(x.angle),this.ctx.globalAlpha=x.type==="blood"?.75:.9,x.type==="blood"?(this.ctx.fillStyle=x.color,this.ctx.beginPath(),this.ctx.ellipse(0,0,x.size*x.scaleX,x.size*x.scaleY,0,0,Math.PI*2),this.ctx.fill()):x.type==="casing"?(this.ctx.fillStyle="#b5921c",this.ctx.fillRect(-x.size,-x.size/2,x.size*2,x.size)):x.type==="splinter"&&(this.ctx.fillStyle="#6e441c",this.ctx.fillRect(-x.size,-x.size/3,x.size*1.5,x.size*.7)),this.ctx.restore()}):this.particles.drawDecals(this.ctx);const m=e?e.players.find(x=>x.isLocal):this.localPlayer;if(this.map.draw(this.ctx,this.settings,u,m,g),u.forEach(x=>{x.health<=0&&(e?this.drawSnapshotPlayer(x,!0):x.draw(this.ctx))}),u.forEach(x=>{if(x.health<=0)return;let E=!0;if(this.settings.shadows&&m&&m.health>0&&!x.isLocal){const C=m.flashlightActive&&m.lightPoly&&this.isPointInPolygon({x:x.x,y:x.y},m.lightPoly),S=!this.map.getLineIntersection({x:m.x,y:m.y},{x:x.x,y:x.y}),w=this.map.isPointInAmbientLight(x.x,x.y,x.radius||18);E=C||x.isTeammate||x.flashlightActive&&S||w&&S}E&&(e?this.drawSnapshotPlayer(x,!1):x.draw(this.ctx,this.settings,this.map))}),m&&m.health>0&&(this.ctx.save(),this.ctx.translate(m.x,m.y),this.ctx.strokeStyle="rgba(102, 252, 241, 0.15)",this.ctx.lineWidth=1,this.ctx.setLineDash([4,8]),this.ctx.beginPath(),this.ctx.arc(0,0,32,Date.now()/1500,Date.now()/1500+Math.PI*2),this.ctx.stroke(),this.ctx.restore()),this.ctx.save(),this.ctx.globalCompositeOperation="lighter",e?(e.bullets.forEach(x=>{if(x.active){if(this.ctx.save(),x.weaponKey==="knife")this.ctx.lineWidth=3.5,this.ctx.lineCap="round",this.ctx.strokeStyle="rgba(230, 235, 255, 0.85)",this.ctx.shadowColor="#66fcf1",this.ctx.shadowBlur=6,this.ctx.beginPath(),this.ctx.arc(x.x,x.y,18,x.angle-.6,x.angle+.6),this.ctx.stroke();else{this.ctx.lineWidth=2.5,this.ctx.lineCap="round";const E=x.playerId===(m==null?void 0:m.id),C=this.ctx.createLinearGradient(x.prevX,x.prevY,x.x,x.y);E?(C.addColorStop(0,"rgba(102, 252, 241, 0.0)"),C.addColorStop(1,"rgba(102, 252, 241, 1.0)"),this.ctx.strokeStyle=C,this.ctx.shadowColor="#66fcf1"):(C.addColorStop(0,"rgba(255, 60, 60, 0.0)"),C.addColorStop(1,"rgba(255, 60, 60, 1.0)"),this.ctx.strokeStyle=C,this.ctx.shadowColor="#ff3c3c"),this.ctx.shadowBlur=4,this.ctx.beginPath(),this.ctx.moveTo(x.prevX,x.prevY),this.ctx.lineTo(x.x,x.y),this.ctx.stroke()}this.ctx.restore()}}),e.particles.forEach(x=>{this.ctx.save(),this.ctx.globalAlpha=Math.max(0,x.life),x.type==="casing"?(this.ctx.translate(x.x,x.y),this.ctx.rotate(x.angle),this.ctx.fillStyle="#d4af37",this.ctx.strokeStyle="#996515",this.ctx.lineWidth=.5,this.ctx.fillRect(-x.size,-x.size/2,x.size*2,x.size),this.ctx.strokeRect(-x.size,-x.size/2,x.size*2,x.size)):x.type==="splinter"?(this.ctx.translate(x.x,x.y),this.ctx.rotate(x.angle),this.ctx.fillStyle="#8b5a2b",this.ctx.beginPath(),this.ctx.moveTo(-x.size,0),this.ctx.lineTo(x.size,-x.size/2),this.ctx.lineTo(x.size/2,x.size/2),this.ctx.closePath(),this.ctx.fill()):x.type==="blood"?(this.ctx.fillStyle=x.color,this.ctx.beginPath(),this.ctx.arc(x.x,x.y,x.size,0,Math.PI*2),this.ctx.fill()):(this.ctx.fillStyle=x.color,(x.color.startsWith("#66fc")||x.color.startsWith("#ff3c"))&&(this.ctx.shadowColor=x.color,this.ctx.shadowBlur=4),this.ctx.beginPath(),this.ctx.arc(x.x,x.y,x.size*x.life,0,Math.PI*2),this.ctx.fill()),this.ctx.restore()})):(this.bullets.forEach(x=>x.draw(this.ctx)),this.particles.drawParticles(this.ctx)),this.ctx.restore(),e&&e.grenades?e.grenades.forEach(x=>{this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(x.x,x.y,6,0,Math.PI*2),this.ctx.fillStyle="#2d332f",this.ctx.strokeStyle="#66fcf1",this.ctx.lineWidth=1.5,this.ctx.fill(),this.ctx.stroke(),this.ctx.restore()}):this.grenades&&this.grenades.forEach(x=>x.draw(this.ctx)),!e&&this.zone&&this.zone.active){const x=this.zone,E=Date.now(),C=Math.sin(E/300)*.15+.85;this.ctx.save(),this.ctx.beginPath(),this.ctx.rect(-100,-100,this.mapWidth+200,this.mapHeight+200),this.ctx.arc(x.centerX,x.centerY,x.currentRadius,0,Math.PI*2,!0),this.ctx.fillStyle=`rgba(255, 30, 30, ${.12*C})`,this.ctx.fill("evenodd"),this.ctx.beginPath(),this.ctx.arc(x.centerX,x.centerY,x.currentRadius,0,Math.PI*2),this.ctx.strokeStyle=`rgba(255, 50, 50, ${.85*C})`,this.ctx.lineWidth=4,this.ctx.shadowColor="#ff2222",this.ctx.shadowBlur=18,this.ctx.stroke(),this.ctx.shadowBlur=0,this.ctx.beginPath(),this.ctx.arc(x.centerX,x.centerY,x.currentRadius,0,Math.PI*2),this.ctx.strokeStyle=`rgba(255, 150, 150, ${.3*C})`,this.ctx.lineWidth=12,this.ctx.stroke(),this.ctx.restore()}this.matchMode==="sabotage"&&(this.vents.forEach(x=>{this.ctx.save(),this.ctx.translate(x.x,x.y),this.ctx.fillStyle="#1e2124",this.ctx.fillRect(-20,-15,40,30),this.ctx.strokeStyle="#535960",this.ctx.lineWidth=2.5,this.ctx.strokeRect(-20,-15,40,30),this.ctx.strokeStyle="#0f1112",this.ctx.lineWidth=2;for(let C=-12;C<=12;C+=6)this.ctx.beginPath(),this.ctx.moveTo(C,-10),this.ctx.lineTo(C,10),this.ctx.stroke();Math.hypot(this.localPlayer.x-x.x,this.localPlayer.y-x.y)<50&&this.localPlayer.health>0&&!this.localPlayer.inVent&&(this.ctx.fillStyle="#66fcf1",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("[E] VENT",0,-22)),this.ctx.restore()}),this.tasks.forEach(x=>{const E=Date.now();this.ctx.save(),this.ctx.translate(x.x,x.y);const S=E%1200/1200*Math.PI*2;if(x.alarmActive){const N=.7+.3*Math.abs(Math.sin(E/60+x.x)),I=90+20*Math.abs(Math.sin(E/200)),B=Math.PI/6;this.ctx.save(),this.ctx.createConicalGradient;for(let K=0;K<2;K++){const j=S+K*Math.PI;this.ctx.beginPath(),this.ctx.moveTo(0,-26),this.ctx.arc(0,-26,I,j-B,j+B),this.ctx.closePath();const ee=this.ctx.createRadialGradient(0,-26,0,0,-26,I);ee.addColorStop(0,`rgba(255, 60, 40, ${.55*N})`),ee.addColorStop(.45,`rgba(255, 80, 40, ${.18*N})`),ee.addColorStop(1,"rgba(255, 40, 0, 0)"),this.ctx.fillStyle=ee,this.ctx.fill()}const O=this.ctx.createRadialGradient(0,0,0,0,0,75);O.addColorStop(0,`rgba(255, 30, 10, ${.22*N})`),O.addColorStop(1,"rgba(255,0,0,0)"),this.ctx.fillStyle=O,this.ctx.beginPath(),this.ctx.ellipse(0,5,75,35,0,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}else if(x.status==="doing"){const N=.12+.1*Math.abs(Math.sin(E/350)),I=this.ctx.createRadialGradient(0,0,0,0,0,40);I.addColorStop(0,`rgba(255,220,50,${N})`),I.addColorStop(1,"rgba(255,200,0,0)"),this.ctx.fillStyle=I,this.ctx.beginPath(),this.ctx.ellipse(0,5,40,22,0,0,Math.PI*2),this.ctx.fill()}x.status,x.alarmActive||x.status,this.ctx.fillStyle="rgba(0,0,0,0.45)",this.ctx.beginPath(),this.ctx.ellipse(0,17,22,7,0,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle="#1a1f26",this.ctx.beginPath(),this.ctx.roundRect(-18,-18,36,32,3),this.ctx.fill(),this.ctx.strokeStyle="#3a4555",this.ctx.lineWidth=1.5,this.ctx.stroke(),this.ctx.fillStyle="#0d1117",this.ctx.fillRect(-13,-14,26,16),this.ctx.strokeStyle="#2a3340",this.ctx.lineWidth=1,this.ctx.strokeRect(-13,-14,26,16);const w=x.alarmActive?"#1a0000":"#001a0a";this.ctx.fillStyle=w,this.ctx.fillRect(-11,-12,22,12),this.ctx.strokeStyle=x.alarmActive?"rgba(255,20,20,0.06)":"rgba(0,255,100,0.07)",this.ctx.lineWidth=.8;for(let N=-11;N<0;N+=2)this.ctx.beginPath(),this.ctx.moveTo(-11,N),this.ctx.lineTo(11,N),this.ctx.stroke();x.alarmActive?(this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=6,this.ctx.fillStyle="#ff3c3c"):x.status==="completed"?(this.ctx.shadowColor="#66fcf1",this.ctx.shadowBlur=6,this.ctx.fillStyle="#66fcf1"):x.status==="doing"?(this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=5,this.ctx.fillStyle="#ffd700"):(this.ctx.shadowColor="#1aff8a",this.ctx.shadowBlur=4,this.ctx.fillStyle="#1aff8a"),this.ctx.font="bold 5px monospace",this.ctx.textAlign="center";const L=x.alarmActive?"ALARM":x.status==="completed"?"DONE":x.status==="doing"?"ACTIVE":"READY";this.ctx.fillText(L,0,-5),this.ctx.shadowBlur=0,this.ctx.fillStyle="#141a22",this.ctx.fillRect(-13,4,26,8);const R=x.alarmActive?`rgba(255,40,40,${.6+.4*Math.abs(Math.sin(E/90))})`:x.status==="completed"?"#66fcf1":x.status==="doing"?"#ffd700":"#1aff8a";this.ctx.fillStyle=R,x.alarmActive&&(this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=8),this.ctx.beginPath(),this.ctx.arc(-8,8,2.5,0,Math.PI*2),this.ctx.fill(),this.ctx.shadowBlur=0;for(let N=-1;N<=5;N+=3)this.ctx.fillStyle="#2a3545",this.ctx.fillRect(N,6,2.5,4);if(x.alarmActive){const N=.6+.4*Math.abs(Math.sin(E/45));this.ctx.fillStyle="#1a0a0a",this.ctx.beginPath(),this.ctx.arc(0,-26,6,Math.PI,0),this.ctx.fill(),this.ctx.save(),this.ctx.translate(0,-26),this.ctx.rotate(S),this.ctx.fillStyle=`rgba(255, 60, 10, ${N})`,this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=14,this.ctx.beginPath(),this.ctx.arc(0,0,4.5,0,Math.PI*2),this.ctx.fill(),this.ctx.shadowBlur=0,this.ctx.fillStyle=`rgba(255, 220, 180, ${.8*N})`,this.ctx.beginPath(),this.ctx.arc(0,0,2,0,Math.PI*2),this.ctx.fill(),this.ctx.restore(),this.ctx.strokeStyle="#2a1a1a",this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.moveTo(0,-20),this.ctx.lineTo(0,-22),this.ctx.stroke()}else this.ctx.fillStyle="#1a2030",this.ctx.beginPath(),this.ctx.arc(0,-22,4,Math.PI,0),this.ctx.fill(),this.ctx.fillStyle="#2a3040",this.ctx.beginPath(),this.ctx.arc(0,-22,2,0,Math.PI*2),this.ctx.fill();this.ctx.strokeStyle="#0a0f14",this.ctx.lineWidth=1.2,this.ctx.beginPath(),this.ctx.moveTo(-18,5),this.ctx.quadraticCurveTo(-26,10,-24,16),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(18,3),this.ctx.quadraticCurveTo(25,8,22,16),this.ctx.stroke(),[[-16,-16],[16,-16],[-16,12],[16,12]].forEach(([N,I])=>{this.ctx.fillStyle="#2c3545",this.ctx.beginPath(),this.ctx.arc(N,I,1.5,0,Math.PI*2),this.ctx.fill()}),Math.hypot(this.localPlayer.x-x.x,this.localPlayer.y-x.y)<40&&this.localPlayer.health>0&&x.status==="pending"&&(this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=8,this.ctx.fillStyle="#ffd700",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("[F] INTERACT",0,-36),this.ctx.shadowBlur=0),this.ctx.restore()})),this.activeHitmarkers.forEach(x=>{const E=x.age/x.duration;this.ctx.save(),this.ctx.translate(x.x,x.y);const C=1-E;this.ctx.strokeStyle=x.isHeadshot?`rgba(255, 215, 0, ${C})`:`rgba(255, 255, 255, ${C})`,this.ctx.lineWidth=x.isHeadshot?2.5:1.5;const S=5+E*5,w=2;this.ctx.beginPath(),this.ctx.moveTo(-w,-w),this.ctx.lineTo(-S,-S),this.ctx.moveTo(w,-w),this.ctx.lineTo(S,-S),this.ctx.moveTo(-w,w),this.ctx.lineTo(-S,S),this.ctx.moveTo(w,w),this.ctx.lineTo(S,S),this.ctx.stroke(),this.ctx.restore()}),this.floatingNumbers.forEach(x=>{const E=x.age/x.duration;this.ctx.save(),this.ctx.translate(x.x,x.y);const C=1-E;let S=1;E<.25?S=1+E/.25*.4:S=1.4-(E-.25)/.75*.4,this.ctx.scale(S,S),this.ctx.font=x.isHeadshot?"bold 14px 'Orbitron', sans-serif":"bold 11px 'Orbitron', sans-serif",this.ctx.textAlign="center",this.ctx.strokeStyle=`rgba(0, 0, 0, ${C})`,this.ctx.lineWidth=3,this.ctx.strokeText(x.damage,0,0),this.ctx.fillStyle=x.isHeadshot?`rgba(255, 215, 0, ${C})`:`rgba(255, 255, 255, ${C})`,this.ctx.fillText(x.damage,0,0),this.ctx.restore()}),this.ctx.restore(),this.ctx.save();const b=this.ctx.createRadialGradient(this.canvas.width/2,this.canvas.height/2,this.canvas.width/3,this.canvas.width/2,this.canvas.height/2,this.canvas.width/1.1);b.addColorStop(0,"rgba(0, 0, 0, 0)");let _="rgba(0, 0, 0, 0.82)";if(this.localPlayer){const x=Date.now(),E=this.localPlayer.adrenalineEndTime&&x<this.localPlayer.adrenalineEndTime||this.localPlayer.adrenalineActive,C=this.localPlayer.overdriveEndTime&&x<this.localPlayer.overdriveEndTime||this.localPlayer.overdriveActive;this.matchMode==="sabotage"&&this.tasks&&this.tasks.some(w=>w.alarmActive)?_=`rgba(255, 30, 30, ${Math.sin(x/100)*.15+.55})`:C?_=`rgba(255, 180, 0, ${Math.sin(x/150)*.12+.48})`:E&&(_=`rgba(57, 219, 20, ${Math.sin(x/150)*.12+.48})`)}b.addColorStop(1,_),this.ctx.fillStyle=b,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(255, 255, 255, 0.015)";for(let x=0;x<this.canvas.height;x+=4)this.ctx.fillRect(0,x,this.canvas.width,1);if(this.ctx.restore(),this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.health<35&&!e){this.ctx.save();const x=Math.sin(Date.now()/150)*.2+.3,E=this.ctx.createRadialGradient(this.canvas.width/2,this.canvas.height/2,this.canvas.width/3,this.canvas.width/2,this.canvas.height/2,this.canvas.width/1.1);E.addColorStop(0,"rgba(255, 0, 0, 0)"),E.addColorStop(1,`rgba(255, 0, 0, ${x})`),this.ctx.fillStyle=E,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.restore()}let v=0;if(e){const x=e.players.find(E=>E.isLocal);x&&(v=x.flashAlpha||0)}else this.localPlayer&&(v=this.localPlayer.flashAlpha||0);if(v>0&&(this.ctx.save(),this.ctx.fillStyle=`rgba(255, 255, 255, ${v})`,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.restore()),!e){const x=this.localPlayer&&this.localPlayer.health>0?this.map.checkZone(this.localPlayer.x,this.localPlayer.y):null;if(x)try{this.ctx.save();const E=x.type==="healing",C=Math.sin(Date.now()/400)*.25+.75,S=E?`rgba(80,255,130,${C})`:`rgba(255,100,60,${C})`,w=E?`rgba(40,255,110,${C*.18})`:`rgba(255,60,20,${C*.18})`,L=E?`rgba(80,255,130,${C*.8})`:`rgba(255,100,60,${C*.8})`,R=260,P=38,F=this.canvas.width/2-R/2,N=this.canvas.height-130;this.ctx.fillStyle=w,this.ctx.fillRect(F,N,R,P),this.ctx.strokeStyle=L,this.ctx.lineWidth=1.5,this.ctx.strokeRect(F,N,R,P),this.ctx.textAlign="center",this.ctx.font="bold 12px Orbitron",this.ctx.fillStyle=S;const I=E?"+":"!";this.ctx.fillText(`${I} ${x.label}`,this.canvas.width/2,N+15),this.ctx.font="9px Orbitron",this.ctx.fillStyle=E?"rgba(60,255,110,0.7)":"rgba(255,80,40,0.7)";const B=E?`+${(x.healRate*60).toFixed(0)} HP/s REGENERATION`:`DAMAGE x${x.multiplier} -- DANGER`;this.ctx.fillText(B,this.canvas.width/2,N+29),this.ctx.restore()}catch{}}if(this.matchMode==="sabotage"&&this.gameState==="playing"){this.ctx.save(),this.ctx.font="bold 11px 'Orbitron', sans-serif",this.ctx.textAlign="left";const x=20,E=120;this.ctx.fillStyle="#ff3c3c",this.ctx.fillText("MISSION TASKS:",x,E),this.tasks.forEach((C,S)=>{const w=E+20+S*18,L=C.status==="completed";this.ctx.fillStyle=L?"#39db14":"#fff",this.ctx.font=L?"10px 'Orbitron', sans-serif":"bold 10px 'Orbitron', sans-serif",this.ctx.strokeStyle=L?"#39db14":"#888",this.ctx.lineWidth=1,this.ctx.strokeRect(x,w-8,8,8),L&&(this.ctx.fillStyle="#39db14",this.ctx.fillRect(x+2,w-6,4,4)),this.ctx.fillText(C.name,x+15,w)}),this.ctx.restore()}if(this.matchMode==="sabotage"&&this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.inVent&&this.currentVent&&(this.ctx.save(),this.ctx.fillStyle="rgba(2, 4, 8, 0.85)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(102, 252, 241, 0.08)",this.ctx.strokeStyle="#66fcf1",this.ctx.lineWidth=2,this.ctx.fillRect(this.canvas.width/2-200,this.canvas.height/2-150,400,300),this.ctx.strokeRect(this.canvas.width/2-200,this.canvas.height/2-150,400,300),this.ctx.font="bold 16px 'Orbitron', sans-serif",this.ctx.fillStyle="#66fcf1",this.ctx.textAlign="center",this.ctx.fillText("VENT NETWORK SYSTEM",this.canvas.width/2,this.canvas.height/2-110),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#8892b0",this.ctx.fillText("Select destination vent code to travel:",this.canvas.width/2,this.canvas.height/2-80),this.vents.forEach((x,E)=>{const C=E+1,S=x.id===this.currentVent.id;this.ctx.fillStyle=S?"#ffd700":"#fff",this.ctx.fillText(`[${C}] ${x.name} ${S?"(CURRENT LOCATION)":""}`,this.canvas.width/2,this.canvas.height/2-40+E*30)}),this.ctx.font="bold 11px 'Orbitron', sans-serif",this.ctx.fillStyle="#ff3c3c",this.ctx.fillText("PRESS [SPACEBAR] TO EXIT VENT",this.canvas.width/2,this.canvas.height/2+120),this.ctx.restore()),this.activeTask)){this.ctx.save(),this.ctx.fillStyle="rgba(2, 4, 8, 0.85)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const x=this.canvas.width/2-200,E=this.canvas.height/2-140,C=400,S=280;this.ctx.fillStyle="#11151c",this.ctx.strokeStyle="#ffd700",this.ctx.lineWidth=3,this.ctx.fillRect(x,E,C,S),this.ctx.strokeRect(x,E,C,S),this.ctx.font="bold 15px 'Orbitron', sans-serif",this.ctx.fillStyle="#ffd700",this.ctx.textAlign="center",this.ctx.fillText(this.activeTask.name.toUpperCase(),this.canvas.width/2,E+35),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#888",this.ctx.fillText("TASK TYPE: GRID CALIBRATION",this.canvas.width/2,E+60);const w=this.canvas.width/2-120,L=E+100,R=240,P=40;this.ctx.fillStyle="#1a1d24",this.ctx.fillRect(w,L,R,P),this.ctx.strokeStyle="#333",this.ctx.strokeRect(w,L,R,P),this.ctx.fillStyle="rgba(57, 219, 20, 0.35)",this.ctx.fillRect(this.canvas.width/2-24,L,48,P),this.ctx.strokeStyle="#39db14",this.ctx.strokeRect(this.canvas.width/2-24,L,48,P);const F=Math.abs(Math.sin(this.sweepAngle)),N=w+F*R;this.ctx.strokeStyle="#fff",this.ctx.lineWidth=3,this.ctx.beginPath(),this.ctx.moveTo(N,L-5),this.ctx.lineTo(N,L+P+5),this.ctx.stroke();const I=this.canvas.width/2-120,B=E+175,O=240,K=20;this.ctx.fillStyle="#1a1d24",this.ctx.fillRect(I,B,O,K),this.ctx.fillStyle="#ffd700",this.ctx.fillRect(I,B,this.sweepProgress/100*O,K),this.ctx.strokeStyle="#ffd700",this.ctx.strokeRect(I,B,O,K),this.ctx.font="bold 10px 'Orbitron', sans-serif",this.ctx.fillStyle="#fff",this.ctx.fillText(`CALIBRATION PROGRESS: ${this.sweepProgress}%`,this.canvas.width/2,B+14),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#ffaa00",this.ctx.fillText("PRESS [SPACEBAR] WHEN LINE IS IN GREEN ZONE",this.canvas.width/2,E+230),this.ctx.fillStyle="#888",this.ctx.fillText("PRESS [ESC] OR [F] TO ABANDON TASK",this.canvas.width/2,E+255),this.ctx.restore()}if(!e&&this.gameState==="playing"&&(this.matchMode==="sabotage"||performance.now()-this.roundStartTime>2e4)){this.ctx.save();const x=150,C=this.canvas.width-x-20,S=100;this.ctx.fillStyle="rgba(6, 7, 10, 0.85)",this.ctx.fillRect(C,S,x,x),this.ctx.strokeStyle="hsla(43, 74%, 49%, 0.6)",this.ctx.lineWidth=2,this.ctx.strokeRect(C,S,x,x),this.ctx.fillStyle="hsla(43, 74%, 49%, 0.9)",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("TACTICAL MINIMAP",C+x/2,S-6);const w=x/this.map.width;if(this.ctx.fillStyle="rgba(255, 255, 255, 0.12)",this.map.walls.forEach(R=>{this.ctx.fillRect(C+R.x*w,S+R.y*w,R.w*w,R.h*w)}),this.localPlayer&&this.localPlayer.health>0){const R=C+this.localPlayer.x*w,P=S+this.localPlayer.y*w;this.ctx.fillStyle="#00ffff",this.ctx.beginPath(),this.ctx.arc(R,P,3.5,0,Math.PI*2),this.ctx.fill(),this.ctx.strokeStyle="rgba(0, 255, 255, 0.8)",this.ctx.lineWidth=1,this.ctx.beginPath(),this.ctx.moveTo(R,P),this.ctx.lineTo(R+Math.cos(this.localPlayer.angle)*7,P+Math.sin(this.localPlayer.angle)*7),this.ctx.stroke()}this.matchMode==="sabotage"&&this.tasks.forEach(R=>{if(R.status==="completed")return;const P=C+R.x*w,F=S+R.y*w,N=Math.abs(Math.sin(performance.now()/250));this.ctx.fillStyle=`rgba(255, 215, 0, ${.4+.6*N})`,this.ctx.beginPath(),this.ctx.arc(P,F,3.5+N*2,0,Math.PI*2),this.ctx.fill()});const L=Math.abs(Math.sin(performance.now()/200));this.players.forEach(R=>{if(R.health>0&&!R.isLocal){const P=C+R.x*w,F=S+R.y*w;if(R.isTeammate)this.ctx.fillStyle="#39ff14",this.ctx.beginPath(),this.ctx.arc(P,F,3,0,Math.PI*2),this.ctx.fill();else{if(this.matchMode==="sabotage")return;this.ctx.fillStyle=`rgba(255, 60, 60, ${.4+.6*L})`,this.ctx.beginPath(),this.ctx.arc(P,F,4+L*2.5,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle="#ff3c3c",this.ctx.beginPath(),this.ctx.arc(P,F,2,0,Math.PI*2),this.ctx.fill()}}}),this.ctx.restore()}if(e){this.ctx.save(),this.ctx.strokeStyle="rgba(255, 60, 60, 0.6)",this.ctx.lineWidth=12,this.ctx.strokeRect(0,0,this.canvas.width,this.canvas.height);const x=Math.floor(Date.now()/500)%2===0;this.ctx.fillStyle=x?"#ff3c3c":"rgba(255, 60, 60, 0.2)",this.ctx.beginPath(),this.ctx.arc(40,40,8,0,Math.PI*2),this.ctx.fill(),this.ctx.font="900 16px Orbitron",this.ctx.fillStyle="#ffffff",this.ctx.textAlign="left",this.ctx.fillText("KILLCAM REPLAY",60,46);const E=this.replayIndex/this.replayFrames.length,C=this.canvas.width-80;this.ctx.fillStyle="rgba(255, 255, 255, 0.15)",this.ctx.fillRect(40,this.canvas.height-40,C,6),this.ctx.fillStyle="#ff3c3c",this.ctx.fillRect(40,this.canvas.height-40,C*E,6),this.ctx.restore()}if(!e&&this.combatBanner){this.ctx.save(),this.ctx.textAlign="center",this.ctx.textBaseline="middle";const x=this.combatBanner.timer,E=this.combatBanner.text;let C=1;x<.5&&(C=x/.5);const S=1.5+Math.max(0,x-2.5)*2+.05*Math.sin(Date.now()/100);this.ctx.translate(this.canvas.width/2,this.canvas.height/2-180),this.ctx.scale(S,S),this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=20,this.ctx.font="italic 900 24px 'Orbitron', sans-serif";const w=this.ctx.createLinearGradient(-150,0,150,0);w.addColorStop(0,`rgba(255, 60, 60, ${C})`),w.addColorStop(.5,`rgba(255, 220, 0, ${C})`),w.addColorStop(1,`rgba(255, 60, 60, ${C})`),this.ctx.fillStyle=w,this.ctx.fillText(E,0,0),this.ctx.shadowBlur=0,this.ctx.strokeStyle=`rgba(255, 215, 0, ${C*.4})`,this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.moveTo(-100,18),this.ctx.lineTo(100,18),this.ctx.moveTo(-100,-18),this.ctx.lineTo(100,-18),this.ctx.stroke(),this.ctx.restore()}if(this.localPlayer&&this.localPlayer.weaponLevelUpAlert>0&&!e){this.ctx.save(),this.ctx.textAlign="center",this.ctx.textBaseline="middle";const x=this.localPlayer.weaponLevelUpAlert,E=Math.min(1,x),C=1+.15*Math.sin(Date.now()/150);this.ctx.translate(this.canvas.width/2,this.canvas.height/2-80),this.ctx.scale(C,C),this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=15,this.ctx.font="bold 28px 'Orbitron', sans-serif",this.ctx.fillStyle=`rgba(255, 215, 0, ${E})`,this.ctx.fillText("WEAPON UPGRADED",0,0),this.ctx.shadowBlur=0,this.ctx.font="bold 16px 'Orbitron', sans-serif",this.ctx.fillStyle=`rgba(255, 255, 255, ${E})`,this.ctx.fillText(`LVL ${this.localPlayer.weaponLevel}`,0,35),this.ctx.restore()}}isPointInPolygon(e,t){let i=!1;for(let s=0,a=t.length-1;s<t.length;a=s++){const r=t[s].x,o=t[s].y,l=t[a].x,c=t[a].y;o>e.y!=c>e.y&&e.x<(l-r)*(e.y-o)/(c-o)+r&&(i=!i)}return i}handleServerRoundOver(e){if(this.gameState!=="playing")return;if(this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchMode==="sabotage")try{this.sound.stopBearMusic()}catch{}let t=document.getElementById("hud-status");const i=this.localPlayer.team;e.winningTeam===i?t&&(t.innerText="ROUND WON",t.style.color="#39ff14"):t&&(t.innerText="ROUND LOST",t.style.color="#ff3c3c"),i===1?(this.scoreSelf=e.score1,this.scoreOpponent=e.score2):(this.scoreSelf=e.score2,this.scoreOpponent=e.score1),this.updateScoreboardHUD();const s=e.winningTeam===1?2:1;this.players.forEach(a=>{a.team===s&&(a.health=0)}),this.roundNumber=e.roundNumber,this.startReplay(()=>this.startRoundCycle())}handleServerMatchOver(e){if(this.gameState!=="playing"&&this.gameState!=="round-over")return;this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.localPlayer.team===1?(this.scoreSelf=e.score1,this.scoreOpponent=e.score2):(this.scoreSelf=e.score2,this.scoreOpponent=e.score1),this.updateScoreboardHUD();const i=window.MatchStats.shotsFired||1,s=window.MatchStats.hitsRegistered/i*100;window.MatchStats.accuracy=s,window.MatchStats.roundsWon=this.scoreSelf,window.MatchStats.winnerId=e.winnerId;const a=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent:this.scoreSelf>=3,r=this.localPlayer.rank?this.localPlayer.rank.label:"";let o=!1,l=0;this.isRanked&&(o=this.localPlayer.applyRankDelta(a?ma:ga),l=a?ma:ga),window.MatchStats.isWin=a,window.MatchStats.newRP=this.localPlayer.rp,window.MatchStats.newRank=this.localPlayer.rank,window.MatchStats.rpDelta=l,window.MatchStats.rankChanged=o,window.MatchStats.oldRankLabel=r;const d=(this.matchMode==="sabotage"?e.score1>e.score2?1:2:e.score1>=3?1:2)===1?2:1;this.players.forEach(h=>{h.team===d&&(h.health=0)});const f=()=>{this.gameState="match-over",this.active=!1,a?this.sound.playMatchWin():this.sound.playMatchLose(),this.onMatchEnd&&this.onMatchEnd(window.MatchStats)};this.startReplay(f)}spawnItemAt(e,t,i,s=null){const a=s||`item_${i}_${Date.now()}_${Math.round(Math.random()*1e3)}`;return this.map.items.some(r=>r.id===a)||this.map.items.push({id:a,x:e,y:t,type:i,active:!0}),a}generateRandomCode(){const e=["w","a","s","d","q","e","r","f"];let t="";for(let i=0;i<4;i++)t+=e[Math.floor(Math.random()*e.length)];return t}startHackingMinigame(e){const t=this.generateRandomCode();this.activeMinigame={terminal:e,code:t,input:"",timer:4},this.keys.e=!1;const i=document.getElementById("hacking-minigame-overlay");i&&(i.style.display="flex");const s=document.getElementById("hud-interaction-prompt");s&&(s.style.display="none"),this.renderMinigameKeys()}renderMinigameKeys(){const e=document.getElementById("minigame-keys-container");if(!e||!this.activeMinigame)return;e.innerHTML="";const t=this.activeMinigame.code,i=this.activeMinigame.input;for(let s=0;s<t.length;s++){const a=t[s],r=s<i.length,o=document.createElement("div");o.style.width="35px",o.style.height="35px",o.style.lineHeight="35px",o.style.borderRadius="4px",o.style.fontFamily="var(--font-title)",o.style.fontWeight="bold",o.style.fontSize="14px",o.style.textTransform="uppercase",o.style.border=r?"1px solid #39ff14":"1px solid rgba(255,255,255,0.15)",o.style.background=r?"rgba(57, 255, 20, 0.12)":"rgba(0,0,0,0.4)",o.style.color=r?"#39ff14":"rgba(255,255,255,0.7)",o.style.boxShadow=r?"0 0 6px rgba(57, 255, 20, 0.25)":"none",o.innerText=a,e.appendChild(o)}}handleMinigameKeyPress(e){if(!this.activeMinigame)return;const t=this.activeMinigame.code,i=this.activeMinigame.input,s=t[i.length];if(e===s){this.activeMinigame.input+=e,this.renderMinigameKeys();try{this.sound.playMetallicClick(0,2500,.04,.2)}catch{}this.activeMinigame.input===t&&this.successHackingMinigame()}else{this.activeMinigame.input="",this.renderMinigameKeys();try{this.sound.playMetallicClick(0,300,.15,.3)}catch{}}}cancelHackingMinigame(){this.activeMinigame=null;const e=document.getElementById("hacking-minigame-overlay");e&&(e.style.display="none")}successHackingMinigame(){if(!this.activeMinigame)return;const e=this.activeMinigame.terminal;e.hacked=!0;const t=this.spawnItemAt(e.x-22,e.y,"health"),i=this.spawnItemAt(e.x+22,e.y,"adrenaline");this.localPlayer.showTextNotification("HACK SUCCESSFUL! LOOT SPAWNED","#39ff14"),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:t,x:e.x-22,y:e.y,type:"health"}),this.localPlayer.networkDroppedItems.push({id:i,x:e.x+22,y:e.y,type:"adrenaline"});try{this.sound.playMetallicClick(0,3500,.25,.45)}catch{}this.cancelHackingMinigame()}failHackingMinigame(){this.localPlayer.showTextNotification("HACK FAILED!","#ff3c3c");try{this.sound.playMetallicClick(0,200,.3,.45)}catch{}this.cancelHackingMinigame()}}const ve={getItem(n){try{return localStorage.getItem(n)}catch(e){return console.warn("localStorage.getItem failed:",e),null}},setItem(n,e){try{localStorage.setItem(n,e)}catch(t){console.warn("localStorage.setItem failed:",t)}},removeItem(n){try{localStorage.removeItem(n)}catch(e){console.warn("localStorage.removeItem failed:",e)}}},gl="tacticstrike_account_session",us="tacticstrike_account_user",yl="tacticstrike_admin_session",Py=performance.now();function Iy(){try{const n=JSON.parse(ve.getItem(us)||"null");return n&&typeof n.email=="string"?n:null}catch{return ve.removeItem(us),null}}let Ct={token:ve.getItem(gl),user:Iy()};Ct.token||(Ct.user=null);let Dn=!!Ct.token,ls=ve.getItem(yl),xl=null;function Xr(n){return new Promise(e=>setTimeout(e,n))}function vl({immediate:n=!1}={}){const e=document.getElementById("startup-overlay");if(document.body.classList.remove("is-starting"),!!e){if(e.setAttribute("aria-hidden","true"),n){e.remove();return}e.classList.add("is-exiting"),setTimeout(()=>e.remove(),650)}}setTimeout(()=>{document.body.classList.contains("is-starting")&&vl()},6500);async function Ly(n){const e=Math.max(0,1350-(performance.now()-Py)),t=Ct.token&&!Ct.user?Promise.race([Promise.resolve(n),Xr(3600)]):Promise.resolve();await Promise.all([Xr(e),t]);const i=document.getElementById("startup-status");i&&(i.textContent=Ct.user?"OPERATIVE SESSION READY":"SYSTEMS ONLINE"),await Xr(140),vl()}function _l(){return window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?window.location.port==="3000"?window.location.origin:"http://localhost:3000":window.location.hostname.endsWith("onrender.com")?window.location.origin:"https://topdownshooter.onrender.com"}async function qi(n,e={}){const t={"Content-Type":"application/json",...e.headers||{}};Ct.token&&(t.Authorization=`Bearer ${Ct.token}`);const i=await fetch(`${_l()}${n}`,{...e,headers:t}),s=i.status===204?null:await i.json().catch(()=>null);if(!i.ok){const a=new Error((s==null?void 0:s.message)||"The account server could not complete this request.");throw a.code=s==null?void 0:s.error,a.status=i.status,a}return s}async function ps(n,e={}){const t={"Content-Type":"application/json",...e.headers||{}};ls&&(t.Authorization=`Bearer ${ls}`);const i=await fetch(`${_l()}${n}`,{...e,headers:t}),s=i.status===204?null:await i.json().catch(()=>null);if(!i.ok){const a=new Error((s==null?void 0:s.message)||"The admin server could not complete this request.");throw a.code=s==null?void 0:s.error,a.status=i.status,a}return s}const mi={menu:document.getElementById("menu-screen"),lobby:document.getElementById("lobby-screen"),game:document.getElementById("game-screen"),matchmaking:document.getElementById("matchmaking-screen")},et={rankedRealistic:document.getElementById("btn-ranked-realistic"),rankedCompetitive:document.getElementById("btn-ranked-competitive"),createRoom:document.getElementById("btn-create-room"),joinRoom:document.getElementById("btn-join-room"),practiceBot:document.getElementById("btn-practice-bot"),openMatchSettings:document.getElementById("btn-open-match-settings"),closeSettings:document.getElementById("btn-close-settings"),leaveLobby:document.getElementById("btn-leave-lobby"),readyToggle:document.getElementById("btn-ready-toggle"),copyCode:document.getElementById("btn-copy-code"),returnLobby:document.getElementById("btn-return-lobby"),btnAmongUs:document.getElementById("btn-among-us-mode")},Fe={name:document.getElementById("player-name-input"),roomCode:document.getElementById("room-code-input"),chat:document.getElementById("chat-input"),qpMapSelect:document.getElementById("qp-map-select"),lobbyMapSelect:document.getElementById("lobby-map-select"),lobbyModeSelect:document.getElementById("lobby-mode-select"),lobbyStyleSelect:document.getElementById("lobby-style-select")},at={roomCode:document.getElementById("room-code-display"),weaponStats:document.getElementById("weapon-stats-display"),playersList:document.getElementById("lobby-players-list"),chatMessages:document.getElementById("chat-messages"),chatDrawer:document.getElementById("chat-drawer")},gt={modal:document.getElementById("settings-modal"),volume:document.getElementById("setting-volume"),volumeVal:document.getElementById("volume-val"),blood:document.getElementById("setting-blood"),shadows:document.getElementById("setting-shadows"),laser:document.getElementById("setting-laser")},fn=document.getElementById("game-over-modal"),tr={pistol:{name:"Tactical 9mm",damage:22,fireRate:35,accuracy:90,magSize:12,range:400,reloadTime:1200,speedMultiplier:1,type:"Semi-Auto",damagePct:33,fireRatePct:45},rifle:{name:"Assault Rifle (M4A1)",damage:28,fireRate:75,accuracy:70,magSize:30,range:600,reloadTime:2200,speedMultiplier:1,type:"Automatic",damagePct:65,fireRatePct:85},shotgun:{name:"Shotgun (Remington 870)",damage:15,fireRate:20,accuracy:40,magSize:6,range:250,reloadTime:3e3,speedMultiplier:1,type:"Pump-Action",damagePct:80,fireRatePct:20,pellets:8},sniper:{name:"Sniper Rifle (AWM)",damage:95,fireRate:10,accuracy:98,magSize:5,range:1e3,reloadTime:2800,speedMultiplier:1,type:"Bolt-Action",damagePct:100,fireRatePct:10},smg:{name:"SMG (MP5)",damage:18,fireRate:85,accuracy:82,magSize:30,range:350,reloadTime:1500,speedMultiplier:1,type:"Automatic",damagePct:30,fireRatePct:95},lmg:{name:"LMG (M249)",damage:25,fireRate:80,accuracy:75,magSize:100,range:550,reloadTime:4500,speedMultiplier:1,type:"Automatic",damagePct:55,fireRatePct:90},dmr:{name:"DMR (M14 EBR)",damage:45,fireRate:30,accuracy:94,magSize:20,range:800,reloadTime:2400,speedMultiplier:1,type:"Semi-Auto",damagePct:75,fireRatePct:35},vector:{name:"Vector SMG",damage:14,fireRate:95,accuracy:85,magSize:33,range:320,reloadTime:1100,speedMultiplier:1,type:"Automatic",damagePct:25,fireRatePct:98},famas:{name:"FAMAS Burst Carbine",damage:20,fireRate:55,accuracy:91,magSize:25,range:550,reloadTime:1800,speedMultiplier:1,type:"Burst-Fire",damagePct:45,fireRatePct:60},plasma:{name:"Plasma Rifle PL-45",damage:32,fireRate:65,accuracy:90,magSize:20,range:600,reloadTime:2e3,speedMultiplier:1,type:"Automatic",damagePct:60,fireRatePct:70},railgun:{name:"Railgun RG-X",damage:85,fireRate:8,accuracy:99,magSize:5,range:1200,reloadTime:3500,speedMultiplier:.95,type:"Single-Shot",damagePct:95,fireRatePct:8}},Nn={dmr:{rp:1e3,rank:"VETERAN",price:2200},sniper:{rp:1e3,rank:"VETERAN",price:2500},lmg:{rp:4e3,rank:"ELITE",price:4500},vector:{rp:1e3,rank:"VETERAN",price:2100},famas:{rp:1e3,rank:"VETERAN",price:2300},plasma:{rp:4e3,rank:"ELITE",price:4e3},railgun:{rp:4e3,rank:"ELITE",price:5e3}},Dy={dmr:{code:"M14",role:"PRECISION",tier:"ADVANCED",description:"A controlled semi-auto platform built for disciplined mid-to-long range fire."},sniper:{code:"AWM",role:"LONGSHOT",tier:"ADVANCED",description:"A high-impact bolt-action system engineered to end an engagement in one shot."},lmg:{code:"M249",role:"SUPPORT",tier:"ELITE",description:"Sustained suppressive fire with a deep belt and uncompromising lane control."},vector:{code:"VEC",role:"BREACH",tier:"ADVANCED",description:"Extreme close-range fire rate for operatives who fight inside the objective."},famas:{code:"FAM",role:"BURST",tier:"ADVANCED",description:"A precise burst carbine tuned for fast target acquisition and controlled recoil."},plasma:{code:"PL45",role:"PROTOTYPE",tier:"ELITE",description:"Experimental energy rifle with exceptional accuracy and balanced stopping power."},railgun:{code:"RG-X",role:"EXOTIC",tier:"ELITE",description:"Blacksite electromagnetic technology delivering devastating single-shot force."}},Os={pistol:"Pistol",rifle:"Rifle",shotgun:"Shotgun",sniper:"Sniper",smg:"SMG",lmg:"LMG",dmr:"DMR",vector:"Vector",famas:"FAMAS",plasma:"Plasma",railgun:"Railgun"};function Ny(n){const t=`; ${document.cookie}`.split(`; ${n}=`);return t.length===2?t.pop().split(";").shift():null}function ky(n,e,t=365){const i=new Date;i.setTime(i.getTime()+t*24*60*60*1e3),document.cookie=`${n}=${e};expires=${i.toUTCString()};path=/;SameSite=Strict`}function Sl(){let n=ve.getItem("tacticstrike_uuid");return n||(n=Ny("tacticstrike_uuid")),n||(n="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){const t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})),ve.setItem("tacticstrike_uuid",n),ky("tacticstrike_uuid",n,365),n}function _s(){try{const n=window.AudioContext||window.webkitAudioContext;if(!n)return;const e=new n,t=e.createOscillator(),i=e.createGain();t.type="sawtooth",t.frequency.setValueAtTime(120,e.currentTime),i.gain.setValueAtTime(.12,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.15),t.connect(i),i.connect(e.destination),t.start(),t.stop(e.currentTime+.15)}catch{}}function Ml(){const n=parseInt(ve.getItem("tacticstrike_rp")||"0"),e=document.querySelectorAll("#menu-weapon-selector .weapon-btn");e.forEach(s=>{const a=s.dataset.weapon,r=Nn[a],o=qr(a);if(r&&!o)s.classList.add("locked"),s.innerHTML=`🔒 ${Os[a]} <span style="font-size:7px; display:block; color:#ff3c3c; margin-top:2.5px; font-family:var(--font-title); font-weight:bold;">${r.rank}</span>`;else{s.classList.remove("locked");let l=Os[a]||a;try{JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]").includes(a)&&n<r.rp&&(l=`🛍️ ${l}`)}catch{}s.innerHTML=l}});const t=document.querySelectorAll(".weapon-option");t.forEach(s=>{const a=s.dataset.weapon,r=Nn[a],o=qr(a);let l=s.querySelector(".lock-badge");r&&!o?(s.classList.add("locked"),l||(l=document.createElement("span"),l.className="lock-badge",s.appendChild(l)),l.innerHTML=`🔒 <span style="font-size:8px; font-weight:bold; color:#ff3c3c; margin-left:2px;">${r.rank}</span>`,l.style.display="inline-flex"):(s.classList.remove("locked"),l&&(l.style.display="none"))}),Nn[ut]&&!qr(ut)&&(ut="pistol",ve.setItem("tacticstrike_player_weapon","pistol"),e.forEach(s=>{s.dataset.weapon==="pistol"?s.classList.add("active"):s.classList.remove("active")}),t.forEach(s=>{s.dataset.weapon==="pistol"?s.classList.add("active"):s.classList.remove("active")}),gs("pistol"))}let ce=null,be=null,Lt=null,Ke="Operative",ut="pistol",ii="cyan",qt="1v1",Ds=!1,Na=[],xi="menu",gi=ve.getItem("tacticstrike_qp_style")||"realistic",ss=ve.getItem("tacticstrike_selected_map")||"manor";function ms(){try{return JSON.parse(localStorage.getItem("tacticstrike_career")||'{"wins":0,"losses":0}')}catch{return{wins:0,losses:0}}}function jh(n){try{localStorage.setItem("tacticstrike_career",JSON.stringify(n))}catch{}}function bl(){const n=ms(),e=n.wins+n.losses,t=e>0?Math.round(n.wins/e*100):null,i=document.getElementById("stat-wins"),s=document.getElementById("stat-losses"),a=document.getElementById("stat-winpct");i&&(i.innerText=n.wins),s&&(s.innerText=n.losses),a&&(a.innerText=t!==null?`${t}%`:"—")}function ir(n){const e=ms();n?e.wins++:e.losses++,jh(e),bl()}function Uy(n,e){if(n)try{const t=localStorage.getItem("tacticstrike_h2h")||"{}",i=JSON.parse(t);i[n]||(i[n]={wins:0,losses:0}),e?i[n].wins++:i[n].losses++,localStorage.setItem("tacticstrike_h2h",JSON.stringify(i))}catch(t){console.warn("Failed to record H2H result:",t)}}function Fy(){const n=document.getElementById("h2h-history-container");if(!n)return;let e={};try{e=JSON.parse(localStorage.getItem("tacticstrike_h2h")||"{}")}catch{e={}}const t=Object.entries(e);if(t.length===0){n.innerHTML='<div style="color: var(--text-muted); font-size: 10px; text-align: center; padding: 10px 0; letter-spacing: 0.5px;">No head-to-head records found. Play a match to start tracking!</div>';return}t.sort((s,a)=>a[1].wins+a[1].losses-(s[1].wins+s[1].losses));let i="";t.forEach(([s,a])=>{const r=a.wins+a.losses,o=r>0?Math.round(a.wins/r*100):0;i+=`
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 4px; font-family: var(--font-title);">
        <span style="color: #fff; font-size: 11px; font-weight: bold; letter-spacing: 0.5px;">${kn(s).toUpperCase()}</span>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 10px; color: var(--text-muted); letter-spacing: 0.5px;">RECORD: <strong style="color: #39db14;">${a.wins}W</strong> - <strong style="color: #ff3c3c;">${a.losses}L</strong></span>
          <span style="font-size: 9px; background: rgba(102, 252, 241, 0.1); border: 1px solid rgba(102, 252, 241, 0.3); color: #66fcf1; padding: 2px 5px; border-radius: 3px; font-weight: bold; letter-spacing: 0.5px;">${o}% WR</span>
        </div>
      </div>
    `}),n.innerHTML=i}const xt=new Audio("/Midnight_Deployment.mp3");xt.loop=!0;const Tt=new Audio("/Before_The_Starting_Bell.mp3");Tt.loop=!0;const mt=new Audio("/Into_Darkness.mp3");mt.loop=!0;let xa=!1,Nt=!1;const Ot=new Audio("/Deployment_Sequence.mp3");Ot.loop=!0;Ot.volume=.15;function Jh(){if(!Nt)try{xt.pause(),xt.currentTime=0,Tt.pause(),Tt.currentTime=0,mt.pause(),mt.currentTime=0,Ot.volume=.15,Ot.loop=!0,Ot.play().catch(()=>{})}catch{}}function Dt(){try{const n=window.AudioContext||window.webkitAudioContext;if(!n)return;const e=new n,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.setValueAtTime(1200,e.currentTime),t.frequency.exponentialRampToValueAtTime(600,e.currentTime+.08),i.gain.setValueAtTime(.1,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.08),t.connect(i),i.connect(e.destination),t.start(),t.stop(e.currentTime+.08)}catch{}}let Vi=null;function vi(n="tap"){if(!He.sfxMuted)try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;Vi||(Vi=new e),Vi.state==="suspended"&&Vi.resume().catch(()=>{});const t={open:{from:390,to:520,duration:.14},close:{from:510,to:370,duration:.12},confirm:{from:560,to:760,duration:.16},tap:{from:440,to:500,duration:.1}},i=t[n]||t.tap,s=Vi.currentTime,a=Vi.createOscillator(),r=Vi.createBiquadFilter(),o=Vi.createGain(),l=.035*Math.max(0,Math.min(1,He.volume));a.type="sine",a.frequency.setValueAtTime(i.from,s),a.frequency.exponentialRampToValueAtTime(i.to,s+i.duration),r.type="lowpass",r.frequency.setValueAtTime(1800,s),r.Q.setValueAtTime(.45,s),o.gain.setValueAtTime(1e-4,s),o.gain.exponentialRampToValueAtTime(Math.max(1e-4,l),s+.012),o.gain.exponentialRampToValueAtTime(1e-4,s+i.duration),a.connect(r),r.connect(o),o.connect(Vi.destination),a.start(s),a.stop(s+i.duration+.02)}catch{}}let Xa=null;const Oy=[{key:"knife",text:"Equip your Melee Knife (Press 2) to move 15% faster."},{key:"flashbang",text:"Throw a Flash Grenade (Press 3) to blind enemies in line-of-sight."},{key:"dash",text:"Press Space to dash forward in the direction you are facing (10s CD)."},{key:"flashlight",text:"Toggle your Flashlight (Press F) to spot enemies in dark rooms."}];function $o(){const n=document.getElementById("gameplay-tips-panel");if(!n)return;const e=Oy.filter(s=>localStorage.getItem(`tacticstrike_hide_tip_${s.key}`)!=="true");if(e.length===0){n.style.display="none",Xa=null;return}const t=e[Math.floor(Math.random()*e.length)];Xa=t.key;const i=document.getElementById("tip-text");i&&(i.innerText=t.text),n.style.display="flex"}function By(){const n=document.getElementById("btn-dismiss-tip");n&&n.addEventListener("click",()=>{if(Xa){localStorage.setItem(`tacticstrike_hide_tip_${Xa}`,"true");const e=document.getElementById("gameplay-tips-panel");e&&(e.style.display="none"),setTimeout($o,1e3)}})}window.stopAllMusic=function(){try{xt.pause(),xt.currentTime=0,Tt.pause(),Tt.currentTime=0,Ot.pause(),Ot.currentTime=0,mt.pause(),mt.currentTime=0,be&&be.sound&&be.sound.stopBearMusic()}catch{}};function Qh(){if(!Nt)try{xt.pause(),xt.currentTime=0,Ot.pause(),Ot.currentTime=0,mt.pause(),mt.currentTime=0,Tt.currentTime=0,Tt.play().catch(()=>{})}catch{}}function El(){if(!Nt)try{Tt.pause(),Tt.currentTime=0,Ot.pause(),Ot.currentTime=0,mt.pause(),mt.currentTime=0,xt.currentTime=0,xt.play().catch(()=>{})}catch{}}function ed(){try{if(Nt)return;if(mt.pause(),mt.currentTime=0,be&&be.matchMode==="sabotage"||xi==="practice"&&qt==="sabotage"){xt.pause(),xt.currentTime=0,Tt.pause(),Tt.currentTime=0,Ot.pause(),Ot.currentTime=0,be&&be.gameState==="playing"&&be.sound&&be.sound.playBearMusic();return}xi==="casual"?(xt.pause(),xt.currentTime=0,Tt.pause(),Tt.currentTime=0,Ot.volume=.04,Ot.loop=!0,Ot.play().catch(()=>{})):(Ot.pause(),Ot.currentTime=0,Tt.pause(),Tt.currentTime=0,xt.volume=.04,xt.play().catch(()=>{}))}catch{}}function Tl(n){const e=document.getElementById("ranked-video-overlay"),t=document.getElementById("ranked-video");if(!e||!t){n();return}t.muted=!!He.sfxMuted,t.volume=typeof He.volume=="number"?He.volume:.5,t.currentTime=0,e.style.display="flex",e.offsetHeight,e.style.opacity="1",window.stopAllMusic(),t.play().then(()=>{const i=setTimeout(()=>{e.style.opacity="0"},4400),s=setTimeout(()=>{t.pause(),e.style.display="none",n()},5e3),a=()=>{clearTimeout(i),clearTimeout(s),e.style.opacity="0",setTimeout(()=>{e.style.display="none",n()},500),t.removeEventListener("ended",a)};t.addEventListener("ended",a)}).catch(i=>{console.warn("Ranked video playback failed or blocked by browser:",i),e.style.opacity="0",e.style.display="none",n()})}const va=[{id:"recruit",label:"RECRUIT",minRP:0,maxRP:999,color:"#8a9bb5",icon:"▪"},{id:"veteran",label:"VETERAN",minRP:1e3,maxRP:3999,color:"#e8c84a",icon:"◆"},{id:"elite",label:"ELITE",minRP:4e3,maxRP:1/0,color:"#ff6ef7",icon:"★"}];function wl(n){for(let e=va.length-1;e>=0;e--)if(n>=va[e].minRP)return va[e];return va[0]}function Al(){const n=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),e=wl(n),t=document.getElementById("menu-rank-icon"),i=document.getElementById("menu-rank-label"),s=document.getElementById("menu-rank-rp");t&&(t.innerText=e.icon,t.style.color=e.color),i&&(i.innerText=e.label,i.style.color=e.color),s&&(s.innerText=`(${n} RP)`)}let ka=!1,cn=null;xt.addEventListener("ended",()=>{Nt||(xt.currentTime=0,xt.play().catch(()=>{}))});Tt.addEventListener("ended",()=>{Nt||(Tt.currentTime=0,Tt.play().catch(()=>{}))});function td(){if(xa||Nt){_a();return}const n=document.querySelector(".screen.active");if(n&&n.id==="game"||mi.game&&mi.game.classList.contains("active"))return;const t=document.getElementById("deploy-modal");if(t&&t.classList.contains("active")){mt.volume=.15,mt.play().then(()=>{xa=!0,_a()}).catch(()=>{});return}n&&(n.id==="lobby-screen"||n.id==="matchmaking-screen")?Tt.play().then(()=>{xa=!0,_a()}).catch(()=>{}):xt.play().then(()=>{xa=!0,_a()}).catch(()=>{})}function _a(){["click","keydown","touchstart"].forEach(n=>{window.removeEventListener(n,td)})}["click","keydown","touchstart"].forEach(n=>{window.addEventListener(n,td)});function id(){if(Nt)xt.volume=0,Tt.volume=0,mt.volume=0;else{const n=mi.game&&mi.game.classList.contains("active");xt.volume=n?.04:.15,Tt.volume=.15,mt.volume=.15}}function Ko(){const n=document.getElementById("setting-music-toggle"),e=document.getElementById("settings-music-action"),t=document.getElementById("settings-music-status");n&&(n.classList.toggle("is-muted",Nt),n.setAttribute("aria-pressed",String(Nt)),e&&(e.innerText=Nt?"UNMUTE MUSIC":"MUTE MUSIC"),t&&(t.innerText=Nt?"MUSIC IS OFF":"MUSIC IS PLAYING"))}function zy(n){if(He.musicMuted=n,Nt=n,Nt)window.stopAllMusic();else{const e=document.querySelector(".screen.active"),t=document.getElementById("deploy-modal");t&&t.classList.contains("active")?(mt.currentTime=0,mt.play().catch(()=>{})):e&&(e.id==="lobby-screen"||e.id==="matchmaking-screen")?Qh():e&&e.id==="game-screen"?ed():El()}id(),Ko(),Tn()}const He={volume:.5,blood:!0,shadows:!0,laser:!0,musicMuted:!1,sfxMuted:!1,performanceMode:!1,showFps:!1};function Vy(){const n=ve.getItem("tacticstrike_settings"),e=document.getElementById("setting-show-fps");if(n)try{const s=JSON.parse(n);delete s.serverUrl,Object.assign(He,s),gt.volume&&(gt.volume.value=He.volume*100),gt.volumeVal&&(gt.volumeVal.innerText=`${Math.round(He.volume*100)}%`),gt.blood&&(gt.blood.checked=He.blood),gt.shadows&&(gt.shadows.checked=He.shadows),gt.laser&&(gt.laser.checked=He.laser),e&&(e.checked=!!He.showFps);const a=document.getElementById("fps-counter");a&&(a.style.display=He.showFps?"block":"none"),Nt=!!He.musicMuted;const r=document.getElementById("setting-mute-sfx");r&&(r.checked=!!He.sfxMuted)}catch(s){console.error(s)}Ko(),e&&e.addEventListener("change",s=>{He.showFps=s.target.checked;const a=document.getElementById("fps-counter");a&&(a.style.display=He.showFps?"block":"none"),Tn()}),gt.volume&&gt.volume.addEventListener("input",s=>{const a=parseInt(s.target.value);He.volume=a/100,gt.volumeVal&&(gt.volumeVal.innerText=`${a}%`),Tn()}),gt.blood&&gt.blood.addEventListener("change",s=>{He.blood=s.target.checked,Tn()}),gt.shadows&&gt.shadows.addEventListener("change",s=>{He.shadows=s.target.checked,Tn()}),gt.laser&&gt.laser.addEventListener("change",s=>{He.laser=s.target.checked,Tn()});const t=document.getElementById("setting-music-toggle");t&&t.addEventListener("click",()=>{He.sfxMuted||Dt(),zy(!Nt)});const i=document.getElementById("setting-mute-sfx");i&&i.addEventListener("change",s=>{He.sfxMuted=s.target.checked,Tn()}),et.openMatchSettings&&et.openMatchSettings.addEventListener("click",()=>{He.sfxMuted||Dt(),Fy(),Ko(),gt.modal&&gt.modal.classList.add("active")}),et.closeSettings&&et.closeSettings.addEventListener("click",()=>{gt.modal&&gt.modal.classList.remove("active")})}function Tn(){if(ve.setItem("tacticstrike_settings",JSON.stringify(He)),be){const n=He.sfxMuted?0:He.volume;be.updateSettings({...He,volume:n})}}function ti(n){const e=document.getElementById("deploy-modal");if(e&&e.classList.remove("active"),Object.keys(mi).forEach(t=>{t===n?(mi[t].classList.add("active"),(t==="matchmaking"||t==="lobby")&&(mi[t].style.display="flex")):(mi[t].classList.remove("active"),t==="matchmaking"&&(mi[t].style.display="none"))}),n!=="matchmaking"&&window.mmDotsInterval&&(clearInterval(window.mmDotsInterval),window.mmDotsInterval=null),n==="menu")El();else if(n==="lobby")Jh();else if(n==="matchmaking")Qh();else if(n==="game")ed(),window.tipInterval&&clearInterval(window.tipInterval),$o(),window.tipInterval=setInterval($o,18e3);else{window.tipInterval&&(clearInterval(window.tipInterval),window.tipInterval=null);const t=document.getElementById("gameplay-tips-panel");t&&(t.style.display="none")}n==="menu"&&at&&at.chatMessages&&(at.chatMessages.innerHTML=""),id()}function Hy(){const n=document.querySelectorAll(".weapon-option");n.forEach(e=>{e.addEventListener("click",t=>{if(e.classList.contains("locked")){t.preventDefault(),t.stopPropagation(),_s();return}n.forEach(i=>i.classList.remove("active")),e.classList.add("active"),ut=e.dataset.weapon,ve.setItem("tacticstrike_player_weapon",ut),gs(ut),Dt(),ce&&Lt&&ce.emit("select-weapon",{weapon:ut})})}),gs("pistol")}function gs(n){const e=tr[n];if(!e||!at.weaponStats)return;const t=e.damagePct??Math.min(100,Math.round(e.damage/95*100)),i=e.fireRatePct??Math.min(100,Math.round(e.fireRate)),s=e.accuracy??75,r=n==="plasma"||n==="railgun"?"#ff6ef7":"",o=r?`background: ${r};`:"";at.weaponStats.innerHTML=`
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
  `}function wn(n){var c;if(Na=n,!at.playersList)return;at.playersList.innerHTML="";const e=qt==="2v2"?4:2;for(let d=0;d<e;d++){const f=n[d],h=document.createElement("div");if(f){h.className=`player-slot active ${f.ready?"ready":""}`;const u=((c=tr[f.weapon])==null?void 0:c.name)||f.weapon,y={cyan:"#66fcf1",green:"#39db14",purple:"#9d3bff",orange:"#ff7f3b",yellow:"#ffd700",red:"#ff3c3c"}[f.color]||"#66fcf1",m=qt==="2v2"?`TEAM ${d%2===0?"1":"2"}`:d===0?"HOST":"GUEST",p=f.rp||0,b=wl(p);h.innerHTML=`
        <div class="player-info">
          <span class="player-name" style="color: ${y};">
            <span style="color: ${b.color}; margin-right: 4px;">${b.icon}</span>${kn(f.name)} ${f.id===ce.id?"(YOU)":""}
          </span>
          <span class="player-weapon-desc">RANK: <span style="color:${b.color}">${b.label}</span> | WEAPON: ${u}</span>
        </div>
        <div class="player-badge ${d%2===0?"host":"guest"}">
          ${m}
        </div>
        <div class="status-badge ${f.ready?"ready-status":"waiting"}">
          ${f.ready?"READY":"CHOOSING..."}
        </div>
      `}else{h.className="player-slot empty";const u=d+1,g=qt==="2v2"?` (TEAM ${d%2===0?"1":"2"})`:"";h.innerHTML=`<div class="slot-status">WAITING FOR OPERATIVE ${u}${g}...</div>`}if(at.playersList.appendChild(h),qt==="1v1"&&d===0){const u=document.createElement("div");u.className="vs-divider",u.innerText="VS",at.playersList.appendChild(u)}}const t=n.find(d=>d.id===ce.id);t&&et.readyToggle&&(Ds=t.ready,et.readyToggle.className=Ds?"btn secondary":"btn primary",et.readyToggle.innerText=Ds?"CANCEL READY":"READY TO DEPLOY");const i=document.getElementById("lobby-map-selector-container"),s=document.getElementById("lobby-map-select");if(i&&s)if(xi==="ranked")i.style.display="none";else{i.style.display="block";const d=n[0]&&n[0].id===ce.id;s.disabled=!d}const a=document.getElementById("lobby-mode-selector-container"),r=document.getElementById("lobby-mode-select");if(a&&r)if(xi==="ranked")a.style.display="none";else{a.style.display="block";const d=n[0]&&n[0].id===ce.id;r.disabled=!d}const o=document.getElementById("lobby-style-selector-container"),l=document.getElementById("lobby-style-select");if(o&&l)if(xi==="ranked")o.style.display="none";else{o.style.display="block";const d=n[0]&&n[0].id===ce.id;l.disabled=!d}}function Ua(){if(ce)return;const n=_l();ce=Aa(n),window.AppSocket=ce,ce.on("connect_error",()=>{console.warn("Failed to connect to multiplayer server."),$r({total:1,quickplay:0,ranked_realistic:0,ranked_competitive:0})}),ce.on("disconnect",()=>{$r({total:1,quickplay:0,ranked_realistic:0,ranked_competitive:0})}),ce.on("player-counts",e=>{$r(e)}),ce.on("connect",()=>{console.log("Socket connected.");const e=Sl(),t=parseInt(ve.getItem("tacticstrike_rp")||"0"),i=ms(),s=parseInt(ve.getItem("tacticstrike_credits")||"0");let a=[];try{a=JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}ce.emit("sync-device",{uuid:e,rp:t,wins:i.wins,losses:i.losses,name:Ke,credits:s,purchasedWeapons:a})}),ce.on("device-synced",e=>{console.log("Device synced with database:",e);const t=parseInt(ve.getItem("tacticstrike_rp")||"0"),i=Math.max(t,e.rp||0);ve.setItem("tacticstrike_rp",String(i));const s=ms(),a=Math.max(s.wins,e.wins||0),r=Math.max(s.losses,e.losses||0);jh({wins:a,losses:r});const o=parseInt(ve.getItem("tacticstrike_credits")||"0"),l=Math.max(o,e.credits||0);ve.setItem("tacticstrike_credits",String(l));let c=[];try{c=JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}const d=Array.from(new Set([...c,...e.purchasedWeapons||[]]));ve.setItem("tacticstrike_purchased_weapons",JSON.stringify(d)),e.name&&e.name!=="Operative"&&(Ke=e.name,ve.setItem("tacticstrike_player_name",Ke),Fe.name&&(Fe.name.value=Ke)),Al(),bl(),Ml()}),ce.on("register-response",e=>{e.success||console.warn("Register failed:",e.error)}),ce.on("login-response",e=>{e.success||console.warn("Login failed:",e.error)}),ce.on("room-created",({roomId:e,players:t,autoMatch:i,mode:s,mapId:a,renderStyle:r,isRanked:o})=>{Lt=e,s&&(qt=s),xi=o?"ranked":"casual",at.roomCode.innerText=e;const l=document.getElementById("lobby-map-select");l&&a&&(l.value=a);const c=document.getElementById("lobby-mode-select");c&&s&&(c.value=s);const d=document.getElementById("lobby-style-select");d&&r&&(d.value=r,gi=r),i?(wn(t),Hi("Created matchmaking room. Waiting for opponent...")):(ti("lobby"),wn(t),Hi(`Lobby created. Share code [${e}] with a friend.`))}),ce.on("room-joined",({roomId:e,players:t,mode:i,mapId:s,renderStyle:a,isRanked:r})=>{Lt=e,i&&(qt=i),xi=r?"ranked":"casual",at.roomCode.innerText=e,ti("lobby"),wn(t);const o=document.getElementById("lobby-map-select");o&&s&&(o.value=s);const l=document.getElementById("lobby-mode-select");l&&i&&(l.value=i);const c=document.getElementById("lobby-style-select");c&&a&&(c.value=a,gi=a),Hi(`Joined lobby: ${e}`),cn&&(clearTimeout(cn),cn=null),ka=!1}),ce.on("room-error",e=>{alert(e)}),ce.on("player-joined",({players:e})=>{wn(e);const t=e.find(s=>s.id!==ce.id);t&&Hi(`${t.name} entered the lobby.`);const i=document.querySelector(".screen.active");i&&i.id==="matchmaking-screen"&&ti("lobby")}),ce.on("players-update",({players:e})=>{wn(e)}),ce.on("lobby-map-update",({mapId:e})=>{const t=document.getElementById("lobby-map-select");t&&(t.value=e),Hi(`Host updated mission area to: ${e==="cyberlab"?"Neon Cyber-Lab":e==="arena"?"Neon Arena":"Residential Manor"}`)}),ce.on("lobby-mode-update",({mode:e})=>{const t=document.getElementById("lobby-mode-select");t&&(t.value=e),qt=e;let i="Duel 1v1";e==="sabotage"&&(i="Sabotage (Task Survival)"),Hi(`Host updated game mode to: ${i}`)}),ce.on("lobby-style-update",({renderStyle:e})=>{const t=document.getElementById("lobby-style-select");t&&(t.value=e),gi=e,Hi(`Host updated render style to: ${e==="competitive"?"Competitive":"Realistic"}`)}),ce.on("player-left",({players:e,message:t})=>{wn(e),Hi(t);const i=document.querySelector(".screen.active"),s=i&&i.id==="game-screen";if(be&&s)if(be.active&&be.mode==="online"&&(be.gameState==="playing"||be.gameState==="countdown"||be.gameState==="replay")){if(ir(!0),be.isRanked){const r=parseInt(localStorage.getItem("tacticstrike_rp")||"0")+80;localStorage.setItem("tacticstrike_rp",String(r)),be.localPlayer&&(be.localPlayer.rp=r,be.localPlayer.rank=be.localPlayer._calcRank(r))}localStorage.removeItem("tacticstrike_active_match"),be.endGameDueToDisconnect(t)}else if(be.gameState==="match-over"){const a=document.getElementById("rematch-status");a&&(a.innerText="Opponent left the room.");const r=document.getElementById("btn-rematch");r&&(r.disabled=!0,r.innerText="OPPONENT LEFT")}else localStorage.removeItem("tacticstrike_active_match"),be.endGameDueToDisconnect(t)}),ce.on("match-start",({players:e,seed:t,isRanked:i,mode:s,mapId:a,renderStyle:r})=>{xi=i?"ranked":"casual",r&&(gi=r),fn&&fn.classList.remove("active"),Tl(()=>{const l=e.findIndex(c=>c.id===ce.id);at.chatMessages.innerHTML="",localStorage.setItem("tacticstrike_active_match",i?"ranked":"casual"),be&&be.destroy(),be=new ml("game-canvas",{mode:"online",socket:ce,localPlayerId:ce.id,localPlayerName:Ke,localWeapon:ut,localColor:ii,localPlayerIndex:l,players:e,seed:t,mapId:a||"manor",settings:{...He,volume:He.sfxMuted?0:He.volume},matchMode:s||qt,isRanked:!!i,qpRenderStyle:gi,onMatchEnd:Rl,onKillFeed:Pl}),ti("game")})}),ce.on("opponent-requested-rematch",e=>{const t=document.getElementById("rematch-status");let i="Opponent";if(be&&e&&e.playerId){const s=be.players.find(a=>a.id===e.playerId);s&&(i=s.name)}t&&(t.innerText=`${i} requested a rematch! Click REMATCH to accept.`)})}function Sa(){ce&&(ce.disconnect(),ce=null,Lt=null,window.AppSocket=null),at&&at.roomCode&&(at.roomCode.innerText="-----")}function eh(){const n=document.getElementById("deploy-modal");n&&n.classList.remove("active"),xi="practice",Tl(()=>{at.chatMessages.innerHTML="",be&&be.destroy();const t=[{id:"player",name:Ke,weapon:ut,color:ii}];qt==="2v2"?(t.push({id:"bot_enemy_1",name:"Bot Miller (Enemy)",weapon:Ma(),color:"red"}),t.push({id:"bot_teammate",name:"Bot Ramirez (Teammate)",weapon:Ma(),color:"green"}),t.push({id:"bot_enemy_2",name:"Bot Cooper (Enemy)",weapon:Ma(),color:"orange"})):t.push({id:"bot_enemy_1",name:"Bot Miller (Enemy)",weapon:Ma(),color:"red"}),be=new ml("game-canvas",{mode:"offline",socket:null,localPlayerId:"player",localPlayerName:Ke,localWeapon:ut,localColor:ii,localPlayerIndex:0,players:t,seed:Math.random(),mapId:ss,settings:{...He,volume:He.sfxMuted?0:He.volume},matchMode:qt,isRanked:!1,qpRenderStyle:gi,onMatchEnd:Rl,onKillFeed:Pl}),ti("game")})}function Ma(){return["pistol","rifle","shotgun","sniper","smg","lmg","dmr","vector","famas"][Math.floor(Math.random()*9)]}function Rl(n){localStorage.removeItem("tacticstrike_active_match"),fn&&fn.classList.add("active");const e=!!n.isWin;let t="";if(be&&be.mode==="online"){ir(e);const g=be.players.find(p=>p.id!==ce.id);g&&Uy(g.name,e);const y=parseInt(ve.getItem("tacticstrike_credits")||"0");let m=y;if(be.isRanked&&e&&(m=y+50,ve.setItem("tacticstrike_credits",String(m)),t=' <span style="color:#ffd700; font-size:10px;">(+50 Credits Ranked Win Bonus!)</span>'),ce){const p=Sl(),b=parseInt(ve.getItem("tacticstrike_rp")||"0"),_=ms();let v=[];try{v=JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}ce.emit("sync-device",{uuid:p,rp:b,wins:_.wins,losses:_.losses,name:Ke,credits:m,purchasedWeapons:v})}}const i=document.getElementById("match-result-title"),s=document.getElementById("match-result-subtitle");i&&(e?(i.innerText="MISSION ACCOMPLISHED",i.className="result-title win"):(i.innerText="MISSION FAILED",i.className="result-title lose")),s&&(e?s.innerText="You successfully eliminated the target operative.":s.innerText="You were eliminated by the target operative.");let a="Unknown Operative";if(be){const g=be.players.find(y=>y.id===n.winnerId);g&&(a=g.name)}const r=document.getElementById("match-winner-name");r&&(r.innerText=`WINNER: ${a}`,r.style.color=e?"#39db14":"#ff3c3c");const o=document.getElementById("stat-rounds-won");o&&(o.innerText=n.roundsWon||0);const l=document.getElementById("stat-damage-dealt");l&&(l.innerText=Math.round(n.damageDealt||0));const c=document.getElementById("stat-accuracy");c&&(c.innerText=`${Math.round(n.accuracy||0)}%`);const d=document.getElementById("stat-shots-fired");d&&(d.innerText=n.shotsFired||0);const f=document.getElementById("rematch-status");f&&(f.innerText="");const h=document.getElementById("btn-rematch");h&&(h.disabled=!1,h.innerText="REMATCH"),et.returnLobby&&(be&&be.isRanked?et.returnLobby.innerText="RETURN TO MENU":et.returnLobby.innerText="RETURN TO LOBBY");const u=document.getElementById("rank-result-panel");if(u){if(be&&be.isRanked&&n.newRank){const g=n.newRank,y=n.rpDelta||0,m=y>=0?`+${y} RP`:`${y} RP`,p=y>=0?"#39ff14":"#ff3c3c";u.innerHTML=`
          <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:22px;color:${g.color};">${g.icon}</span>
              <div>
                <div style="font-family:var(--font-title);font-size:11px;color:var(--text-muted);letter-spacing:1px;">CURRENT RANK</div>
                <div style="font-family:var(--font-title);font-size:18px;color:${g.color};font-weight:700;letter-spacing:2px;">${g.label}</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-family:var(--font-title);font-size:11px;color:var(--text-muted);">RANK POINTS</div>
              <div style="font-family:var(--font-title);font-size:16px;color:#fff;font-weight:700;">${n.newRP} RP</div>
              <div style="font-size:12px;color:${p};font-family:var(--font-title);margin-top:2px;">${m}</div>
            </div>
          </div>
          ${n.rankChanged?`<div style="margin-top:10px;padding:6px 12px;background:rgba(${y>=0?"57,255,20":"255,60,60"},0.12);border:1px solid ${y>=0?"#39ff14":"#ff3c3c"};border-radius:6px;font-family:var(--font-title);font-size:10px;color:${y>=0?"#39ff14":"#ff3c3c"};text-align:center;letter-spacing:1px;">${y>=0?"▲ RANK UP!":"▼ RANK DOWN"} ${n.oldRankLabel} → ${g.label}</div>`:""}
        `,u.style.display="block"}else u.innerHTML='<div style="font-family:var(--font-title); font-size:10px; color:var(--text-muted); text-align:center; letter-spacing:1.5px;">CASUAL MATCH - NO RANK EFFECT</div>',u.style.display="block";if(t){const g=document.createElement("div");g.style.cssText="font-family:var(--font-title); font-size:10px; text-align:center; margin-top:8px;",g.innerHTML=t,u.appendChild(g)}}}function Wy(){const n=document.getElementById("btn-deploy-main"),e=document.getElementById("btn-close-deploy"),t=document.getElementById("deploy-modal"),i=document.getElementById("btn-play-worldloom"),s=document.getElementById("btn-close-worldloom"),a=document.getElementById("worldloom-site-screen"),r=document.getElementById("worldloom-frame"),o=document.getElementById("worldloom-frame-loading");n&&t&&n.addEventListener("click",()=>{t.classList.add("active");const y=t.querySelector(".deploy-card");y&&(y.scrollTop=0),Dt(),xt.pause(),xt.currentTime=0,Nt||(mt.volume=.15,mt.currentTime=0,mt.play().catch(()=>{}))}),e&&t&&e.addEventListener("click",()=>{t.classList.remove("active"),Dt(),mt.pause(),mt.currentTime=0,Nt||El()}),i&&i.addEventListener("click",()=>{Dt(),window.stopAllMusic(),t&&t.classList.remove("active"),a&&(a.classList.add("active"),a.setAttribute("aria-hidden","false")),document.body.classList.add("is-worldloom-open"),o&&o.classList.remove("is-hidden"),r&&!r.getAttribute("src")&&r.setAttribute("src",i.dataset.worldloomPath||"./worldloom/index.html")}),r&&r.addEventListener("load",()=>{r.getAttribute("src")&&o&&o.classList.add("is-hidden")}),s&&s.addEventListener("click",()=>{Dt(),document.pointerLockElement&&document.exitPointerLock(),r&&r.removeAttribute("src"),a&&(a.classList.remove("active"),a.setAttribute("aria-hidden","true")),document.body.classList.remove("is-worldloom-open"),o&&o.classList.remove("is-hidden"),t&&t.classList.add("active"),Nt||(mt.volume=.15,mt.currentTime=0,mt.play().catch(()=>{}))}),Fe.name&&Fe.name.addEventListener("change",()=>{Ke=Fe.name.value.trim()||"Operative",ve.setItem("tacticstrike_player_name",Ke),ce&&ce.connected&&ce.emit("change-name",{name:Ke})}),et.practiceBot&&et.practiceBot.addEventListener("click",()=>{Fe.name&&(Ke=Fe.name.value.trim()||"Operative"),ve.setItem("tacticstrike_player_name",Ke),eh()}),et.btnAmongUs&&et.btnAmongUs.addEventListener("click",()=>{Fe.name&&(Ke=Fe.name.value.trim()||"Operative"),ve.setItem("tacticstrike_player_name",Ke);const y=document.getElementById("deploy-modal");y&&y.classList.remove("active"),xi="practice",Tl(()=>{at.chatMessages.innerHTML="",be&&be.destroy();const p=[{id:"player",name:Ke,weapon:"none",color:ii},{id:"bot_enemy_1",name:"Impostor Killer",weapon:"pistol",color:"red"}];be=new ml("game-canvas",{mode:"offline",socket:null,localPlayerId:"player",localPlayerName:Ke,localWeapon:"none",localColor:ii,localPlayerIndex:0,players:p,seed:Math.random(),mapId:ss,settings:{...He,volume:He.sfxMuted?0:He.volume},matchMode:"sabotage",isRanked:!1,qpRenderStyle:gi,onMatchEnd:Rl,onKillFeed:Pl}),ti("game")})}),et.createRoom&&et.createRoom.addEventListener("click",()=>{const y=document.getElementById("deploy-modal");y&&y.classList.remove("active"),Fe.name&&(Ke=Fe.name.value.trim()||"Operative"),ve.setItem("tacticstrike_player_name",Ke),Ua(),ce&&ce.emit("create-room",{playerName:Ke,mode:qt,color:ii,mapId:ss,weapon:ut,renderStyle:gi})}),et.joinRoom&&et.joinRoom.addEventListener("click",()=>{const y=document.getElementById("deploy-modal");y&&y.classList.remove("active");const m=Fe.roomCode?Fe.roomCode.value.toUpperCase().trim():"";if(!m||m.length!==5){alert("Please enter a valid 5-character room code.");return}Fe.name&&(Ke=Fe.name.value.trim()||"Operative"),ve.setItem("tacticstrike_player_name",Ke),Ua(),ce&&ce.emit("join-room",{roomId:m,playerName:Ke,color:ii,weapon:ut})});function l(y){const m=document.getElementById("deploy-modal");if(m&&m.classList.remove("active"),Fe.name&&(Ke=Fe.name.value.trim()||"Operative"),ve.setItem("tacticstrike_player_name",Ke),Ua(),ce){const p=parseInt(localStorage.getItem("tacticstrike_rp")||"0");ka=!1;const b=qt+"_"+y;ce.emit("auto-match",{playerName:Ke,mode:b,color:ii,rp:p,rankStrict:!0,weapon:ut}),ti("matchmaking");const _=document.getElementById("mm-rank-display"),v=document.getElementById("mm-rank-icon"),x=document.getElementById("mm-timer"),E=document.getElementById("mm-expand-notice"),C=wl(p);_&&(_.innerText=C.label),v&&(v.innerText=C.icon,v.style.color=C.color),x&&(x.innerText="0s"),E&&(E.innerText="Searching within your skill bracket...");let S=0;window.mmInterval&&clearInterval(window.mmInterval),window.mmInterval=setInterval(()=>{S++,x&&(x.innerText=`${S}s`)},1e3);let w=0;const L=document.getElementById("mm-dots");window.mmDotsInterval&&clearInterval(window.mmDotsInterval),window.mmDotsInterval=setInterval(()=>{w=(w+1)%4,L&&(L.innerText=".".repeat(w))},500),cn&&clearTimeout(cn),cn=setTimeout(()=>{!ka&&ce&&ce.connected&&(!Lt||Na&&Na.length===1)&&(ka=!0,Hi("⚡ Rank filter removed — expanding search to all ranks..."),E&&(E.innerText="⚡ Search expanded to all skill ranks!"),Lt&&(ce.emit("leave-room"),Lt=null),ce.emit("auto-match",{playerName:Ke,mode:b,color:ii,rp:p,rankStrict:!1,weapon:ut}))},2e3)}}et.rankedRealistic&&et.rankedRealistic.addEventListener("click",()=>l("realistic")),et.rankedCompetitive&&et.rankedCompetitive.addEventListener("click",()=>l("competitive"));const c=document.getElementById("btn-cancel-matchmaking");c&&c.addEventListener("click",()=>{window.mmInterval&&clearInterval(window.mmInterval),cn&&clearTimeout(cn),ce&&ce.emit("leave-room"),Sa(),window.stopAllMusic(),ti("menu")}),et.leaveLobby&&et.leaveLobby.addEventListener("click",()=>{ce&&Lt&&ce.emit("leave-room"),Sa(),ti("menu")}),et.readyToggle&&et.readyToggle.addEventListener("click",()=>{if(ce&&Lt){const y=!Ds;ce.emit("player-ready",{ready:y}),Jh()}}),et.copyCode&&et.copyCode.addEventListener("click",()=>{Lt&&navigator.clipboard.writeText(Lt).then(()=>{et.copyCode.innerText="✅",setTimeout(()=>et.copyCode.innerText="📋",1500)})}),et.returnLobby&&et.returnLobby.addEventListener("click",()=>{fn&&fn.classList.remove("active");const y=document.getElementById("rank-result-panel");y&&(y.style.display="none",y.innerHTML=""),be&&(be.destroy(),be=null),Al(),ce&&Lt&&xi!=="ranked"?(ti("lobby"),Ds=!1,wn(Na),gs(ut)):(ce&&ce.emit("leave-room"),Sa(),ti("menu"))});const d=document.getElementById("btn-game-menu"),f=document.getElementById("game-menu-overlay"),h=document.getElementById("btn-game-resume"),u=document.getElementById("btn-game-leave");d&&f&&d.addEventListener("click",()=>{f.classList.add("active")}),h&&f&&h.addEventListener("click",()=>{f.classList.remove("active")}),u&&f&&u.addEventListener("click",()=>{console.log("LEAVE MATCH clicked. Cleaning up game session...");try{if(f.classList.remove("active"),be){try{if(be.active&&be.mode==="online"&&(ir(!1),be.isRanked)){const y=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),m=Math.max(0,y-40);localStorage.setItem("tacticstrike_rp",String(m))}}catch(y){console.error("Error recording match result during leave:",y)}localStorage.removeItem("tacticstrike_active_match");try{be.destroy()}catch(y){console.error("Error destroying gameEngine:",y)}be=null}}catch(y){console.error("Error in leave match handler pre-disconnect:",y)}try{ce&&Lt&&ce.emit("leave-room")}catch(y){console.error("Error emitting leave-room:",y)}try{Sa()}catch(y){console.error("Error disconnecting socket:",y)}try{ti("menu")}catch(y){console.error("Error showing menu screen:",y)}});const g=document.getElementById("btn-rematch");g&&g.addEventListener("click",()=>{if(be&&be.mode==="offline")fn&&fn.classList.remove("active"),be&&(be.destroy(),be=null),eh();else{g.disabled=!0,g.innerText="WAITING...";const y=document.getElementById("rematch-status");y&&(y.innerText="Rematch requested. Waiting for opponent..."),ce&&ce.emit("request-rematch")}}),window.addEventListener("keydown",y=>{y.key==="Enter"&&(y.preventDefault(),Fe.chat&&document.activeElement===Fe.chat?Gy():mi.game&&mi.game.classList.contains("active")&&at.chatDrawer&&Fe.chat&&(at.chatDrawer.classList.add("active"),Fe.chat.focus()))}),Fe.chat&&Fe.chat.addEventListener("blur",()=>{setTimeout(()=>{Fe.chat&&document.activeElement!==Fe.chat&&at.chatDrawer&&at.chatDrawer.classList.remove("active")},100)}),Fe.qpMapSelect&&(Fe.qpMapSelect.value=ss,Fe.qpMapSelect.addEventListener("change",y=>{ss=y.target.value,ve.setItem("tacticstrike_selected_map",ss),Dt()})),Fe.lobbyMapSelect&&Fe.lobbyMapSelect.addEventListener("change",y=>{const m=y.target.value;ce&&Lt&&ce.emit("select-map",{mapId:m}),Dt()}),Fe.lobbyModeSelect&&Fe.lobbyModeSelect.addEventListener("change",y=>{const m=y.target.value;ce&&Lt&&ce.emit("select-game-mode",{mode:m}),Dt()}),Fe.lobbyStyleSelect&&Fe.lobbyStyleSelect.addEventListener("change",y=>{const m=y.target.value;ce&&Lt&&ce.emit("select-render-style",{renderStyle:m}),Dt()})}function Gy(){if(!Fe.chat)return;const n=Fe.chat.value.trim();n&&(Cl(Ke,n,"self"),ce&&Lt&&ce.emit("chat-message",{name:Ke,msg:n}),Fe.chat.value=""),Fe.chat.blur()}function Cl(n,e,t){const i=document.createElement("div");i.className=`chat-msg ${t}`,t==="system"?i.innerHTML=`<span class="message">${kn(e)}</span>`:i.innerHTML=`
      <span class="author">${kn(n)}:</span>
      <span class="message">${kn(e)}</span>
    `,at.chatMessages&&(at.chatMessages.appendChild(i),at.chatMessages.scrollTop=at.chatMessages.scrollHeight),at.chatDrawer&&at.chatDrawer.classList.add("active"),window.chatTimeout&&clearTimeout(window.chatTimeout),window.chatTimeout=setTimeout(()=>{Fe.chat&&document.activeElement!==Fe.chat&&at.chatDrawer&&at.chatDrawer.classList.remove("active")},4e3)}function Hi(n){Cl("",n,"system")}function Pl(n,e,t){var r;const i=document.getElementById("kill-feed");if(!i)return;const s=document.createElement("div");s.className="kill-msg";const a=((r=tr[t])==null?void 0:r.name)||t;s.innerHTML=`
    <span class="killer">${kn(n)}</span> 
    🔫 [<span class="weapon">${a}</span>] ➔ 
    <span class="victim">${kn(e)}</span>
  `,i.appendChild(s),setTimeout(()=>s.remove(),5e3)}function kn(n){return n.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]||e)}function Xy(){const n=document.querySelectorAll("#lobby-color-selector .color-option");n.forEach(t=>{t.addEventListener("click",()=>{n.forEach(s=>{s.classList.remove("active"),s.style.borderColor="transparent"}),t.classList.add("active"),ii=t.dataset.color;const i={cyan:"#66fcf1",green:"#39db14",purple:"#9d3bff",orange:"#ff7f3b",yellow:"#ffd700",red:"#ff3c3c"};t.style.borderColor=i[ii],ve.setItem("tacticstrike_player_color",ii),ce&&Lt&&ce.emit("select-color",{color:ii})})});const e=ve.getItem("tacticstrike_player_color");if(e){const t=document.querySelector(`#lobby-color-selector .color-option[data-color="${e}"]`);t&&t.click()}}function qy(){document.querySelectorAll('input[name="match-mode"]').forEach(e=>{e.addEventListener("change",()=>{qt=e.value,Il()})})}function Il(){const n=qt==="2v2"?"2V2 SQUAD":"1V1 DUEL",e=(Os[ut]||ut||"Pistol").toUpperCase(),t=document.getElementById("match-config-summary"),i=document.getElementById("match-loadout-value");t&&(t.textContent=`${n} / ${e}`),i&&(i.textContent=e)}function Yy(){const n=document.getElementById("btn-qp-style-realistic"),e=document.getElementById("btn-qp-style-competitive");if(!n||!e)return;function t(){gi==="competitive"?(e.classList.add("active"),n.classList.remove("active")):(n.classList.add("active"),e.classList.remove("active"))}n.addEventListener("click",()=>{gi="realistic",ve.setItem("tacticstrike_qp_style","realistic"),t(),Dt()}),e.addEventListener("click",()=>{gi="competitive",ve.setItem("tacticstrike_qp_style","competitive"),t(),Dt()}),t()}function $y(){const n=document.querySelectorAll("#menu-weapon-selector .weapon-btn");n.forEach(e=>{e.addEventListener("click",t=>{if(e.classList.contains("locked")){t.preventDefault(),t.stopPropagation(),_s();return}n.forEach(s=>s.classList.remove("active")),e.classList.add("active"),ut=e.dataset.weapon,ve.setItem("tacticstrike_player_weapon",ut),Il(),Dt(),document.querySelectorAll(".weapon-option").forEach(s=>{s.dataset.weapon===ut?s.classList.add("active"):s.classList.remove("active")}),gs(ut),ce&&Lt&&ce.emit("select-weapon",{weapon:ut})})})}function xn(n,e=8e3){const t=document.getElementById("notification-container");if(!t)return;const i=document.createElement("div");i.className="custom-toast",i.style.cssText=`
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
  `,i.appendChild(s);const a=document.createElement("div");a.style.paddingLeft="6px",a.innerText=n,i.appendChild(a),i.addEventListener("click",()=>{i.style.opacity="0",i.style.transform="translateX(50px)",setTimeout(()=>i.remove(),350)}),t.appendChild(i),requestAnimationFrame(()=>{i.style.opacity="1",i.style.transform="translateX(0)"}),setTimeout(()=>{i.parentNode&&(i.style.opacity="0",i.style.transform="translateX(50px)",setTimeout(()=>i.remove(),350))},e)}document.addEventListener("DOMContentLoaded",()=>{if(/Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS/i.test(navigator.userAgent)||window.innerWidth<800){vl({immediate:!0});const l=document.getElementById("mobile-warning-screen");l&&(l.style.display="flex");return}const e=document.getElementById("startup-status");e&&Ct.token&&(e.textContent="RESTORING OPERATIVE SESSION");const t=localStorage.getItem("tacticstrike_active_match");if(t){if(ir(!1),t==="ranked"){const l=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),c=Math.max(0,l-40);localStorage.setItem("tacticstrike_rp",String(c))}localStorage.removeItem("tacticstrike_active_match"),alert("Forfeit detected: You disconnected from an active match. Recorded as a loss.")}Vy();const i=ax();Ky(),Zy(),jy(),ix(),sx(),rx(),Hy(),$y(),Xy(),qy(),Yy(),Wy(),By();const s=ve.getItem("tacticstrike_player_name");if(s)Ke=s;else{const l=["Viper","Ghost","Specter","Rex","Apex","Phantom","Onyx","Nova"];Ke=`${l[Math.floor(Math.random()*l.length)]}_${Math.floor(Math.random()*900+100)}`,ve.setItem("tacticstrike_player_name",Ke)}Fe.name&&(Fe.name.value=Ke),Ua(),ti("menu"),bl(),Al(),ut=ve.getItem("tacticstrike_player_weapon")||"pistol",Ml(),document.querySelectorAll("#menu-weapon-selector .weapon-btn").forEach(l=>{l.dataset.weapon===ut?l.classList.add("active"):l.classList.remove("active")}),document.querySelectorAll(".weapon-option").forEach(l=>{l.dataset.weapon===ut?l.classList.add("active"):l.classList.remove("active")}),gs(ut),Il(),Ly(i)});function qr(n){const e=Nn[n];if(!e)return!0;try{if(JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]").includes(n))return!0}catch{}return parseInt(ve.getItem("tacticstrike_rp")||"0")>=e.rp}function Ky(){const n=document.getElementById("news-modal"),e=document.getElementById("btn-close-news");if(!n||!e)return;sessionStorage.getItem("tacticstrike_news_seen")||n.classList.add("active"),e.addEventListener("click",()=>{n.classList.remove("active"),sessionStorage.setItem("tacticstrike_news_seen","true"),Dt()})}function Zy(){const n=document.getElementById("whats-new-modal"),e=document.getElementById("btn-open-whats-new"),t=document.getElementById("btn-close-whats-new");!n||!e||!t||(e.addEventListener("click",()=>{n.classList.add("active"),Dt()}),t.addEventListener("click",()=>{n.classList.remove("active"),Dt()}))}function jy(){const n=document.getElementById("credit-shop-modal"),e=document.getElementById("btn-open-credit-shop"),t=document.getElementById("btn-close-credit-shop"),i=document.querySelectorAll("#credit-shop-modal [data-buy-credit-pack]");!n||!t||(e==null||e.addEventListener("click",()=>Zo("menu")),document.addEventListener("click",s=>{var r;const a=s.target.closest("[data-open-credit-shop]");a&&(a.closest("#account-modal")&&((r=document.getElementById("account-modal"))==null||r.classList.remove("active")),Zo(a.closest("#shop-modal")?"item-shop":"menu"))}),document.addEventListener("click",s=>{const a=s.target.closest("[data-buy-credit-pack]");a&&(s.preventDefault(),Jy(a.dataset.buyCreditPack))}),t.addEventListener("click",()=>{n.classList.remove("active"),vi("close")}),i.forEach(s=>s.addEventListener("click",()=>vi("confirm"))))}function Zo(n="menu"){const e=document.getElementById("credit-shop-modal");e&&(e.dataset.source=n,e.classList.add("active"),vi("open"))}async function Jy(n){if(!Ct.user||!Ct.token){Bs("login","Sign in or create an account before purchasing credits.");return}const e=document.querySelector(`[data-buy-credit-pack="${n}"]`),t=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.textContent="OPENING SECURE CHECKOUT…");try{const i=await qi("/api/credits/checkout",{method:"POST",body:JSON.stringify({packageId:n})});vi("confirm"),window.location.assign(i.checkoutUrl)}catch(i){if(e&&(e.disabled=!1,e.innerHTML=t),i.status===401){qa(),Bs("login","Your session expired. Sign in again to continue.");return}xn(i.message,6e3),_s()}}function Ln(n="",e=""){const t=document.getElementById("purchase-support-message");t&&(t.textContent=n,t.className=`support-notice${e?` ${e}`:""}`)}function nr(n){const e=new Date(n);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{dateStyle:"medium",timeStyle:"short"})}function Ll(n){return n.closed?"CLOSED":n.status==="approved"?`${n.creditsGranted.toLocaleString()} CREDITS ADDED`:n.status==="denied"?"DENIED":"AWAITING REVIEW"}function nd(n){return n.closed?"closed":n.status||"open"}function Qy(n){return new Promise((e,t)=>{if(!n){t(new Error("Attach a receipt screenshot as proof of purchase."));return}if(!["image/png","image/jpeg","image/webp"].includes(n.type)){t(new Error("Upload a PNG, JPG, or WebP receipt image."));return}if(n.size>15e5){t(new Error("Receipt images must be smaller than 1.5 MB."));return}const i=new FileReader;i.onload=()=>e({name:n.name,data:i.result}),i.onerror=()=>t(new Error("The receipt image could not be read.")),i.readAsDataURL(n)})}function sd(n){const e=document.createElement("div");e.className=`support-message-bubble ${n.senderRole}`;const t=document.createElement("div");t.className="support-message-meta";const i=document.createElement("span");i.textContent=n.senderRole==="admin"?"TACTICSTRIKE SUPPORT":"YOU";const s=document.createElement("span");if(s.textContent=nr(n.createdAt),t.append(i,s),e.appendChild(t),n.body){const a=document.createElement("div");a.textContent=n.body,e.appendChild(a)}if(n.proofData){const a=document.createElement("img");a.className="support-proof-image",a.src=n.proofData,a.alt=n.proofName?`Purchase proof: ${n.proofName}`:"Purchase proof",e.appendChild(a)}return e}function ex(n){if(!(n!=null&&n.id))return;const e=`tacticstrike_server_credits_seen_${n.id}`,t=Math.max(0,parseInt(ve.getItem(e)||"0")),i=Math.max(0,Number(n.credits||0));if(i>t){const s=Math.max(0,parseInt(ve.getItem("tacticstrike_credits")||"0"));ve.setItem("tacticstrike_credits",String(s+(i-t)))}ve.setItem(e,String(i))}async function Fa(){var e;const n=document.getElementById("purchase-support-cases");if(n){n.innerHTML='<div class="support-empty-state">Loading secure conversations…</div>';try{const t=await qi("/api/purchase-support/cases");if(t.user&&(Ct.user=t.user,un()),!t.cases.length){n.innerHTML='<div class="support-empty-state">No purchase-verification chats yet.</div>';return}const i=await Promise.all(t.cases.map(s=>qi(`/api/purchase-support/cases/${s.id}`)));n.innerHTML="",i.forEach(s=>tx(s.purchaseCase,n))}catch(t){if(t.status===401){qa(),(e=document.getElementById("purchase-support-modal"))==null||e.classList.remove("active"),Bs("login","Your session expired. Sign in again to view purchase support.");return}n.innerHTML='<div class="support-empty-state">Purchase chats could not be loaded. Try refreshing.</div>',Ln(t.message,"error")}}}function tx(n,e){const t=document.createElement("article");t.className="support-case-card";const i=document.createElement("div");i.className="support-case-summary";const s=document.createElement("div"),a=document.createElement("strong");a.textContent=`ORDER ${n.orderNumber}`;const r=document.createElement("small");r.textContent=`${n.requestedCredits.toLocaleString()}-credit verification · opened ${nr(n.createdAt)}`,s.append(a,r);const o=document.createElement("span");o.className=`case-status ${nd(n)}`,o.textContent=Ll(n),i.append(s,o),t.appendChild(i);const l=document.createElement("div");if(l.className="support-message-list",n.messages.forEach(c=>l.appendChild(sd(c))),t.appendChild(l),!n.closed){const c=document.createElement("form");c.className="support-reply-form";const d=document.createElement("input");d.type="text",d.maxLength=1500,d.required=!0,d.placeholder="Reply to support…";const f=document.createElement("button");f.type="submit",f.textContent="SEND",c.append(d,f),c.addEventListener("submit",async h=>{h.preventDefault(),f.disabled=!0;try{await qi(`/api/purchase-support/cases/${n.id}/messages`,{method:"POST",body:JSON.stringify({message:d.value})}),Ln("Reply sent securely.","success"),await Fa()}catch(u){Ln(u.message,"error")}finally{f.disabled=!1}}),t.appendChild(c)}e.appendChild(t),requestAnimationFrame(()=>{l.scrollTop=l.scrollHeight})}function ix(){const n=document.getElementById("purchase-support-modal"),e=document.getElementById("btn-open-purchase-support"),t=document.getElementById("btn-close-purchase-support"),i=document.getElementById("btn-refresh-purchase-support"),s=document.getElementById("purchase-support-form");!n||!e||!t||!s||(e.addEventListener("click",()=>{if(!Ct.user||!Ct.token){Bs("login","Sign in before submitting purchase proof.");return}n.classList.add("active"),Ln(),vi("open"),Fa()}),t.addEventListener("click",()=>{n.classList.remove("active"),vi("close")}),i==null||i.addEventListener("click",Fa),s.addEventListener("submit",async a=>{a.preventDefault();const r=s.querySelector('button[type="submit"]');r.disabled=!0,Ln("Encrypting and submitting your purchase proof…","info");try{const o=document.getElementById("purchase-proof-file").files[0],l=await Qy(o);await qi("/api/purchase-support/cases",{method:"POST",body:JSON.stringify({orderNumber:document.getElementById("purchase-order-number").value,packageId:document.getElementById("purchase-package").value,message:document.getElementById("purchase-support-text").value,proof:l})}),s.reset(),Ln("Purchase proof submitted. Support will reply within 1–12 hours.","success"),vi("confirm"),await Fa()}catch(o){Ln(o.message,"error"),_s()}finally{r.disabled=!1}}))}function as(n="",e=""){const t=document.getElementById("admin-login-message");t&&(t.textContent=n,t.className=`support-notice${e?` ${e}`:""}`)}function jo(n){const e=document.getElementById("admin-login-view"),t=document.getElementById("admin-dashboard-view");e&&(e.hidden=n),t&&(t.hidden=!n)}function Dl(){ls=null,xl=null,ve.removeItem(yl),jo(!1)}async function Ns(n=xl){const e=document.getElementById("admin-case-list"),t=document.getElementById("admin-case-detail");if(!(!e||!t)){e.innerHTML='<div class="support-empty-state">Loading purchase queue…</div>';try{const i=await ps("/api/admin/purchase-cases");if(!i.cases.length){e.innerHTML='<div class="support-empty-state">No messages submitted.</div>',t.innerHTML='<div class="support-empty-state">The verification queue is empty.</div>';return}e.innerHTML="",i.cases.forEach(a=>{const r=document.createElement("button");r.type="button",r.dataset.caseId=a.id,r.className=`admin-case-list-item${a.id===n?" active":""}`;const o=document.createElement("strong");o.textContent=a.userEmail||"Unknown account";const l=document.createElement("span");l.textContent=`Order ${a.orderNumber}`;const c=document.createElement("small");c.textContent=`${Ll(a)} · ${nr(a.updatedAt)}`,r.append(o,l,c),r.addEventListener("click",()=>th(a.id)),e.appendChild(r)});const s=i.cases.some(a=>a.id===n)?n:i.cases[0].id;await th(s,!1)}catch(i){if(i.status===401){Dl(),as("Admin session expired. Sign in again.","error");return}e.innerHTML='<div class="support-empty-state">The verification queue could not be loaded.</div>',t.innerHTML=""}}}async function th(n,e=!0){var i;const t=document.getElementById("admin-case-detail");if(t){xl=n,e&&(document.querySelectorAll(".admin-case-list-item").forEach(s=>s.classList.remove("active")),(i=document.querySelector(`.admin-case-list-item[data-case-id="${n}"]`))==null||i.classList.add("active")),t.innerHTML='<div class="support-empty-state">Loading secure chat…</div>';try{const s=await ps(`/api/admin/purchase-cases/${n}`);nx(s.purchaseCase)}catch(s){if(s.status===401){Dl(),as("Admin session expired. Sign in again.","error");return}t.innerHTML='<div class="support-empty-state">This purchase chat could not be loaded.</div>'}}}function nx(n){const e=document.getElementById("admin-case-detail");if(!e)return;e.innerHTML="";const t=document.createElement("div");t.className="admin-case-detail-head";const i=document.createElement("div"),s=document.createElement("span");s.className="section-kicker",s.textContent=n.userEmail||"OPERATIVE ACCOUNT";const a=document.createElement("h3");a.textContent=`ORDER ${n.orderNumber}`;const r=document.createElement("p");r.textContent=`Requested package: ${n.requestedCredits.toLocaleString()} credits · opened ${nr(n.createdAt)}`,i.append(s,a,r);const o=document.createElement("span");o.className=`case-status ${nd(n)}`,o.textContent=Ll(n),t.append(i,o),e.appendChild(t);const l=document.createElement("div");if(l.className="support-message-list admin-message-list",n.messages.forEach(h=>l.appendChild(sd(h))),e.appendChild(l),!n.closed){const h=document.createElement("form");h.className="support-reply-form admin-reply-form";const u=document.createElement("input");u.type="text",u.maxLength=1500,u.required=!0,u.placeholder="Reply to this user…";const g=document.createElement("button");g.type="submit",g.textContent="SEND REPLY",h.append(u,g),h.addEventListener("submit",async y=>{y.preventDefault(),g.disabled=!0;try{await ps(`/api/admin/purchase-cases/${n.id}/messages`,{method:"POST",body:JSON.stringify({message:u.value})}),await Ns(n.id)}catch(m){xn(m.message,5e3)}finally{g.disabled=!1}}),e.appendChild(h)}const c=document.createElement("div");c.className="admin-actions",[50,500,2e3].forEach(h=>{const u=document.createElement("button");u.type="button",u.textContent=`ADD ${h.toLocaleString()} CREDITS`,u.disabled=n.closed||n.status==="approved",u.addEventListener("click",()=>Yr(n,"grant",h)),c.appendChild(u)});const d=document.createElement("button");d.type="button",d.className="danger",d.textContent="DENY PROOF",d.disabled=n.closed||n.status==="approved",d.addEventListener("click",()=>Yr(n,"deny"));const f=document.createElement("button");f.type="button",f.className="close-chat",f.textContent="CLOSE CHAT",f.disabled=n.closed,f.addEventListener("click",()=>Yr(n,"close")),c.append(d,f),e.appendChild(c),requestAnimationFrame(()=>{l.scrollTop=l.scrollHeight})}async function Yr(n,e,t=0){const i=e==="grant"?`Add ${t.toLocaleString()} credits to ${n.userEmail}? This cannot be granted twice.`:e==="deny"?`Deny the proof submitted for order ${n.orderNumber}?`:"Close this chat? The user will no longer be able to reply.";if(window.confirm(i))try{await ps(`/api/admin/purchase-cases/${n.id}/decision`,{method:"POST",body:JSON.stringify({action:e,credits:t})}),xn(e==="grant"?`${t.toLocaleString()} credits added.`:e==="deny"?"Proof denied.":"Chat closed.",4500),await Ns(n.id)}catch(s){xn(s.message,5500),_s()}}function sx(){var o,l;const n=document.getElementById("admin-modal"),e=document.getElementById("version-admin-trigger"),t=document.getElementById("btn-close-admin"),i=document.getElementById("admin-login-form");if(!n||!t||!i)return;const s=()=>{n.classList.add("active"),as(),jo(!!ls),vi("open"),ls&&Ns()};let a=0,r=null;e==null||e.addEventListener("click",()=>{if(a+=1,clearTimeout(r),a>=5){a=0,s();return}r=setTimeout(()=>{a=0},2200)}),t.addEventListener("click",()=>{n.classList.remove("active"),vi("close")}),i.addEventListener("submit",async c=>{c.preventDefault();const d=i.querySelector('button[type="submit"]');d.disabled=!0,as("Authenticating with the secure server…","info");try{const f=await ps("/api/admin/login",{method:"POST",body:JSON.stringify({username:document.getElementById("admin-username").value,password:document.getElementById("admin-password").value})});ls=f.token,ve.setItem(yl,f.token),i.reset(),jo(!0),await Ns()}catch(f){as(f.message,"error")}finally{d.disabled=!1}}),(o=document.getElementById("btn-refresh-admin-cases"))==null||o.addEventListener("click",()=>Ns()),(l=document.getElementById("btn-admin-logout"))==null||l.addEventListener("click",async()=>{try{await ps("/api/admin/logout",{method:"POST"})}catch{}Dl(),as("Signed out of the admin dashboard.","success")})}function Wi(n="",e=""){const t=document.getElementById("account-message");t&&(t.textContent=n,t.className=`account-message${e?` ${e}`:""}`)}function Oa(n="login"){const e=document.getElementById("account-tab-login"),t=document.getElementById("account-tab-register"),i=document.getElementById("account-login-form"),s=document.getElementById("account-register-form"),a=n==="login";e==null||e.classList.toggle("active",a),t==null||t.classList.toggle("active",!a),e==null||e.setAttribute("aria-selected",String(a)),t==null||t.setAttribute("aria-selected",String(!a)),i&&(i.hidden=!a),s&&(s.hidden=a)}function un(){const n=Ct.user;n&&(ex(n),Ct.token&&ve.setItem(us,JSON.stringify(n)));const e=document.getElementById("btn-open-account"),t=document.getElementById("credit-shop-account-status"),i=document.getElementById("account-profile-email"),s=document.getElementById("account-profile-credits"),a=document.getElementById("account-auth-view"),r=document.getElementById("account-profile-view"),o=document.querySelectorAll("#credit-shop-modal [data-buy-credit-pack]");if(e&&(e.textContent=n?`ACCOUNT · ${n.displayName||n.email.split("@")[0]}`:Dn?"ACCOUNT":"SIGN IN",e.classList.toggle("signed-in",!!n)),t){t.classList.toggle("signed-in",!!n);const l=t.querySelector("span:last-child");l&&(l.textContent=n?`SIGNED IN · ${n.email}`:Dn?"RESTORING ACCOUNT…":"SIGN IN TO PURCHASE")}i&&(i.textContent=(n==null?void 0:n.email)||""),s&&(s.textContent=String((n==null?void 0:n.credits)||0)),a&&(a.hidden=!!n),r&&(r.hidden=!n),o.forEach(l=>{l.firstChild&&(l.firstChild.textContent=n?"CONTINUE TO CHECKOUT ":Dn?"RESTORING ACCOUNT… ":"SIGN IN TO BUY ")})}function ih(n){Ct={token:n.token,user:n.user},Dn=!1,ve.setItem(gl,n.token),ve.setItem(us,JSON.stringify(n.user)),un()}function qa(){Ct={token:null,user:null},Dn=!1,ve.removeItem(gl),ve.removeItem(us),un()}function Bs(n="login",e=""){var t;Oa(n),Wi(e,e?"info":""),un(),(t=document.getElementById("account-modal"))==null||t.classList.add("active"),vi("open")}function ax(){var s,a,r;const n=document.getElementById("account-modal"),e=document.getElementById("btn-close-account"),t=document.getElementById("account-login-form"),i=document.getElementById("account-register-form");return!n||!e||!t||!i?Promise.resolve():(document.addEventListener("click",o=>{o.target.closest("[data-open-account], #btn-open-account")&&Bs("login")}),e.addEventListener("click",()=>{n.classList.remove("active"),vi("close")}),(s=document.getElementById("account-tab-login"))==null||s.addEventListener("click",()=>{Oa("login"),Wi()}),(a=document.getElementById("account-tab-register"))==null||a.addEventListener("click",()=>{Oa("register"),Wi()}),t.addEventListener("submit",async o=>{o.preventDefault();const l=t.querySelector('button[type="submit"]');l.disabled=!0,Wi("Authenticating…","info");try{const c=await qi("/api/auth/login",{method:"POST",body:JSON.stringify({email:document.getElementById("account-login-email").value,password:document.getElementById("account-login-password").value})});ih(c),xn("Welcome back, operative.",4e3)}catch(c){Wi(c.message,"error")}finally{l.disabled=!1}}),i.addEventListener("submit",async o=>{o.preventDefault();const l=document.getElementById("account-register-password").value,c=document.getElementById("account-register-confirm").value;if(l!==c){Wi("Passcodes do not match.","error");return}const d=i.querySelector('button[type="submit"]');d.disabled=!0,Wi("Creating secure operative profile…","info");try{const f=await qi("/api/auth/register",{method:"POST",body:JSON.stringify({email:document.getElementById("account-register-email").value,password:l})});ih(f),xn("Operative account created.",4500)}catch(f){Wi(f.message,"error")}finally{d.disabled=!1}}),(r=document.getElementById("btn-account-logout"))==null||r.addEventListener("click",async()=>{try{await qi("/api/auth/logout",{method:"POST"})}catch{}qa(),Oa("login"),Wi("Signed out successfully.","success")}),un(),Ct.token?qi("/api/auth/me").then(l=>{Ct.user=l.user,ve.setItem(us,JSON.stringify(l.user)),un()}).catch(l=>{if(l.status===401){qa();return}console.warn("Account session validation was delayed:",l)}).finally(()=>{Dn=!1,un()}):(Dn=!1,un(),Promise.resolve()))}function rx(){const n=document.getElementById("shop-modal"),e=document.getElementById("btn-open-shop"),t=document.getElementById("btn-close-shop");!n||!e||!t||(ve.getItem("tacticstrike_credits")===null&&ve.setItem("tacticstrike_credits","0"),e.addEventListener("click",()=>{ad(),n.classList.add("active"),Dt()}),t.addEventListener("click",()=>{n.classList.remove("active"),Dt()}))}function ad(){const n=document.getElementById("shop-items-container"),e=document.getElementById("shop-credits-display"),t=document.getElementById("shop-owned-count"),i=document.getElementById("shop-available-count");if(!n||!e)return;const s=parseInt(ve.getItem("tacticstrike_credits")||"0");e.innerText=s;let a=[];try{a=JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}const r=parseInt(ve.getItem("tacticstrike_rp")||"0");n.innerHTML="";let o=0,l=0;Object.keys(Nn).forEach(c=>{const d=Nn[c],f=Dy[c],h=a.includes(c),u=r>=d.rp,g=s>=d.price,y=h||u;y?o+=1:g&&(l+=1);const m=document.createElement("article");m.className=`shop-item-card tier-${f.tier.toLowerCase()}${y?" is-owned":""}${!g&&!y?" needs-credits":""}`;let p="",b="";h?(p='<span class="shop-item-status owned"><i></i>ACQUIRED</span>',b='<button class="shop-buy-action owned" disabled>IN YOUR ARMORY</button>'):u?(p='<span class="shop-item-status rank"><i></i>RANK UNLOCKED</span>',b='<button class="shop-buy-action owned" disabled>AVAILABLE IN LOADOUT</button>'):(p=`<span class="shop-item-status locked"><i></i>${d.rank} CLEARANCE</span>`,g?b=`<button class="shop-buy-action buy-btn" data-weapon="${c}">UNLOCK EARLY <span>→</span></button>`:b=`<button class="shop-buy-action top-up" type="button" data-open-credit-shop>GET CREDITS <span>+${(d.price-s).toLocaleString()}</span></button>`);const _=tr[c]||{name:c};m.innerHTML=`
      <div class="shop-item-topline">
        <span>${f.tier} ISSUE</span>
        ${p}
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
        <span>STANDARD UNLOCK</span><strong>${d.rank} · ${d.rp.toLocaleString()} RP</strong>
      </div>
      <div class="shop-item-purchase">
        <div class="shop-item-price"><img class="mini-credit-mark" src="/tacticstrike-credit-stack.webp" alt="" aria-hidden="true"><strong>${d.price.toLocaleString()}</strong><small>CREDITS</small></div>
        ${b}
      </div>
    `,n.appendChild(m)}),t&&(t.textContent=o),i&&(i.textContent=l),n.querySelectorAll(".buy-btn").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.weapon;ox(d)})})}function ox(n){const e=Nn[n];if(!e)return;const t=parseInt(ve.getItem("tacticstrike_credits")||"0");if(t<e.price){_s(),xn(`You need ${(e.price-t).toLocaleString()} more credits for ${Os[n]}.`,4500),Zo("item-shop");return}const i=t-e.price;ve.setItem("tacticstrike_credits",String(i));let s=[];try{s=JSON.parse(ve.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}s.includes(n)||(s.push(n),ve.setItem("tacticstrike_purchased_weapons",JSON.stringify(s)));try{const a=window.AudioContext||window.webkitAudioContext;if(a){const r=new a,o=r.createOscillator(),l=r.createGain();o.type="sine",o.frequency.setValueAtTime(587.33,r.currentTime),o.frequency.setValueAtTime(880,r.currentTime+.1),l.gain.setValueAtTime(.15,r.currentTime),l.gain.exponentialRampToValueAtTime(.001,r.currentTime+.35),o.connect(l),l.connect(r.destination),o.start(),o.stop(r.currentTime+.38)}}catch{}if(xn(`Successfully unlocked ${Os[n]} early!`,6e3),ce){const a=Sl(),r=parseInt(ve.getItem("tacticstrike_rp")||"0"),o=ms();ce.emit("sync-device",{uuid:a,rp:r,wins:o.wins,losses:o.losses,name:Ke,credits:i,purchasedWeapons:s})}ad(),Ml()}function $r(n){const e=document.getElementById("total-player-count-value"),t=document.getElementById("qp-player-count"),i=document.getElementById("ranked-real-player-count"),s=document.getElementById("ranked-comp-player-count");e&&n&&n.total!==void 0&&(e.innerText=n.total),t&&n&&n.quickplay!==void 0&&(t.innerText=n.quickplay),i&&n&&n.ranked_realistic!==void 0&&(i.innerText=n.ranked_realistic),s&&n&&n.ranked_competitive!==void 0&&(s.innerText=n.ranked_competitive)}window.addEventListener("opponent-chat-msg",n=>{const{name:e,msg:t}=n.detail;Cl(e,t,"opponent")});
