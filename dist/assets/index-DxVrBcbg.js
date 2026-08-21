(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const Li=Object.create(null);Li.open="0";Li.close="1";Li.ping="2";Li.pong="3";Li.message="4";Li.upgrade="5";Li.noop="6";const va=Object.create(null);Object.keys(Li).forEach(n=>{va[Li[n]]=n});const qr={type:"error",data:"parser error"},Jc=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Qc=typeof ArrayBuffer=="function",eh=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,Ko=({type:n,data:e},t,i)=>Jc&&e instanceof Blob?t?i(e):Hl(e,i):Qc&&(e instanceof ArrayBuffer||eh(e))?t?i(e):Hl(new Blob([e]),i):i(Li[n]+(e||"")),Hl=(n,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(n)};function Wl(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let sr;function cd(n,e){if(Jc&&n.data instanceof Blob)return n.data.arrayBuffer().then(Wl).then(e);if(Qc&&(n.data instanceof ArrayBuffer||eh(n.data)))return e(Wl(n.data));Ko(n,!1,t=>{sr||(sr=new TextEncoder),e(sr.encode(t))})}const Gl="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",As=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<Gl.length;n++)As[Gl.charCodeAt(n)]=n;const hd=n=>{let e=n.length*.75,t=n.length,i,s=0,a,r,o,l;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const c=new ArrayBuffer(e),h=new Uint8Array(c);for(i=0;i<t;i+=4)a=As[n.charCodeAt(i)],r=As[n.charCodeAt(i+1)],o=As[n.charCodeAt(i+2)],l=As[n.charCodeAt(i+3)],h[s++]=a<<2|r>>4,h[s++]=(r&15)<<4|o>>2,h[s++]=(o&3)<<6|l&63;return c},dd=typeof ArrayBuffer=="function",Zo=(n,e)=>{if(typeof n!="string")return{type:"message",data:th(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:fd(n.substring(1),e)}:va[t]?n.length>1?{type:va[t],data:n.substring(1)}:{type:va[t]}:qr},fd=(n,e)=>{if(dd){const t=hd(n);return th(t,e)}else return{base64:!0,data:n}},th=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},ih="",ud=(n,e)=>{const t=n.length,i=new Array(t);let s=0;n.forEach((a,r)=>{Ko(a,!1,o=>{i[r]=o,++s===t&&e(i.join(ih))})})},pd=(n,e)=>{const t=n.split(ih),i=[];for(let s=0;s<t.length;s++){const a=Zo(t[s],e);if(i.push(a),a.type==="error")break}return i};function md(){return new TransformStream({transform(n,e){cd(n,t=>{const i=t.length;let s;if(i<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,i);else if(i<65536){s=new Uint8Array(3);const a=new DataView(s.buffer);a.setUint8(0,126),a.setUint16(1,i)}else{s=new Uint8Array(9);const a=new DataView(s.buffer);a.setUint8(0,127),a.setBigUint64(1,BigInt(i))}n.data&&typeof n.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(t)})}})}let ar;function Vs(n){return n.reduce((e,t)=>e+t.length,0)}function Hs(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let i=0;for(let s=0;s<e;s++)t[s]=n[0][i++],i===n[0].length&&(n.shift(),i=0);return n.length&&i<n[0].length&&(n[0]=n[0].slice(i)),t}function gd(n,e){ar||(ar=new TextDecoder);const t=[];let i=0,s=-1,a=!1;return new TransformStream({transform(r,o){for(t.push(r);;){if(i===0){if(Vs(t)<1)break;const l=Hs(t,1);a=(l[0]&128)===128,s=l[0]&127,s<126?i=3:s===126?i=1:i=2}else if(i===1){if(Vs(t)<2)break;const l=Hs(t,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),i=3}else if(i===2){if(Vs(t)<8)break;const l=Hs(t,8),c=new DataView(l.buffer,l.byteOffset,l.length),h=c.getUint32(0);if(h>Math.pow(2,21)-1){o.enqueue(qr);break}s=h*Math.pow(2,32)+c.getUint32(4),i=3}else{if(Vs(t)<s)break;const l=Hs(t,s);o.enqueue(Zo(a?l:ar.decode(l),e)),i=0}if(s===0||s>n){o.enqueue(qr);break}}}})}const nh=4;function Rt(n){if(n)return yd(n)}function yd(n){for(var e in Rt.prototype)n[e]=Rt.prototype[e];return n}Rt.prototype.on=Rt.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};Rt.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};Rt.prototype.off=Rt.prototype.removeListener=Rt.prototype.removeAllListeners=Rt.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var i,s=0;s<t.length;s++)if(i=t[s],i===e||i.fn===e){t.splice(s,1);break}return t.length===0&&delete this._callbacks["$"+n],this};Rt.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,s=t.length;i<s;++i)t[i].apply(this,e)}return this};Rt.prototype.emitReserved=Rt.prototype.emit;Rt.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};Rt.prototype.hasListeners=function(n){return!!this.listeners(n).length};const qa=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),ri=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),xd="arraybuffer";function sh(n,...e){return e.reduce((t,i)=>(n.hasOwnProperty(i)&&(t[i]=n[i]),t),{})}const _d=ri.setTimeout,vd=ri.clearTimeout;function Ya(n,e){e.useNativeTimers?(n.setTimeoutFn=_d.bind(ri),n.clearTimeoutFn=vd.bind(ri)):(n.setTimeoutFn=ri.setTimeout.bind(ri),n.clearTimeoutFn=ri.clearTimeout.bind(ri))}const Sd=1.33;function Md(n){return typeof n=="string"?bd(n):Math.ceil((n.byteLength||n.size)*Sd)}function bd(n){let e=0,t=0;for(let i=0,s=n.length;i<s;i++)e=n.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function ah(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Ed(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function Td(n){let e={},t=n.split("&");for(let i=0,s=t.length;i<s;i++){let a=t[i].split("=");e[decodeURIComponent(a[0])]=decodeURIComponent(a[1])}return e}class wd extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class jo extends Rt{constructor(e){super(),this.writable=!1,Ya(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new wd(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=Zo(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Ed(e);return t.length?"?"+t:""}}class Ad extends jo{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};pd(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,ud(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=ah()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let rh=!1;try{rh=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Rd=rh;function Pd(){}class Cd extends Ad{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(s,a)=>{this.onError("xhr post error",s,a)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class Ri extends Rt{constructor(e,t,i){super(),this.createRequest=e,Ya(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=sh(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&i.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var s;i.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=Ri.requestsCount++,Ri.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Pd,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ri.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Ri.requestsCount=0;Ri.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Xl);else if(typeof addEventListener=="function"){const n="onpagehide"in ri?"pagehide":"unload";addEventListener(n,Xl,!1)}}function Xl(){for(let n in Ri.requests)Ri.requests.hasOwnProperty(n)&&Ri.requests[n].abort()}const Id=function(){const n=oh({xdomain:!1});return n&&n.responseType!==null}();class Ld extends Cd{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Id&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Ri(oh,this.uri(),e)}}function oh(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Rd))return new XMLHttpRequest}catch{}if(!e)try{return new ri[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const lh=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Dd extends jo{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=lh?{}:sh(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;Ko(i,this.supportsBinary,a=>{try{this.doWrite(i,a)}catch{}s&&qa(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=ah()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const rr=ri.WebSocket||ri.MozWebSocket;class Nd extends Dd{createSocket(e,t,i){return lh?new rr(e,t,i):t?new rr(e,t):new rr(e)}doWrite(e,t){this.ws.send(t)}}class kd extends jo{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=gd(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),s=md();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const a=()=>{i.read().then(({done:o,value:l})=>{o||(this.onPacket(l),a())}).catch(o=>{})};a();const r={type:"open"};this.query.sid&&(r.data=`{"sid":"${this.query.sid}"}`),this._writer.write(r).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;this._writer.write(i).then(()=>{s&&qa(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Ud={websocket:Nd,webtransport:kd,polling:Ld},Fd=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Bd=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Yr(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),i=n.indexOf("]");t!=-1&&i!=-1&&(n=n.substring(0,t)+n.substring(t,i).replace(/:/g,";")+n.substring(i,n.length));let s=Fd.exec(n||""),a={},r=14;for(;r--;)a[Bd[r]]=s[r]||"";return t!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a.pathNames=Od(a,a.path),a.queryKey=zd(a,a.query),a}function Od(n,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function zd(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,s,a){s&&(t[s]=a)}),t}const $r=typeof addEventListener=="function"&&typeof removeEventListener=="function",Sa=[];$r&&addEventListener("offline",()=>{Sa.forEach(n=>n())},!1);class un extends Rt{constructor(e,t){if(super(),this.binaryType=xd,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=Yr(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=Yr(t.host).host);Ya(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const s=i.prototype.name;this.transports.push(s),this._transportsByName[s]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Td(this.opts.query)),$r&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Sa.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=nh,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&un.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",un.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const s=this.writeBuffer[i].data;if(s&&(t+=Md(s)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,qa(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,s){if(typeof t=="function"&&(s=t,t=void 0),typeof i=="function"&&(s=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const a={type:e,data:t,options:i};this.emitReserved("packetCreate",a),this.writeBuffer.push(a),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(un.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),$r&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=Sa.indexOf(this._offlineEventListener);i!==-1&&Sa.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}un.protocol=nh;class Vd extends un{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;un.priorWebsocketSuccess=!1;const s=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",f=>{if(!i)if(f.type==="pong"&&f.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;un.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(h(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const d=new Error("probe error");d.transport=t.name,this.emitReserved("upgradeError",d)}}))};function a(){i||(i=!0,h(),t.close(),t=null)}const r=f=>{const d=new Error("probe error: "+f);d.transport=t.name,a(),this.emitReserved("upgradeError",d)};function o(){r("transport closed")}function l(){r("socket closed")}function c(f){t&&f.name!==t.name&&a()}const h=()=>{t.removeListener("open",s),t.removeListener("error",r),t.removeListener("close",o),this.off("close",l),this.off("upgrading",c)};t.once("open",s),t.once("error",r),t.once("close",o),this.once("close",l),this.once("upgrading",c),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let Hd=class extends Vd{constructor(e,t={}){const i=typeof e=="object",s=i?{...e}:{...t};(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(a=>Ud[a]).filter(a=>!!a)),super(i?s:e,s)}};function Wd(n,e="",t){let i=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),i=Yr(n)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const a=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+a+":"+i.port+e,i.href=i.protocol+"://"+a+(t&&t.port===i.port?"":":"+i.port),i}const Gd=typeof ArrayBuffer=="function",Xd=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,ch=Object.prototype.toString,qd=typeof Blob=="function"||typeof Blob<"u"&&ch.call(Blob)==="[object BlobConstructor]",Yd=typeof File=="function"||typeof File<"u"&&ch.call(File)==="[object FileConstructor]";function Jo(n){return Gd&&(n instanceof ArrayBuffer||Xd(n))||qd&&n instanceof Blob||Yd&&n instanceof File}function Ma(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,i=n.length;t<i;t++)if(Ma(n[t]))return!0;return!1}if(Jo(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return Ma(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&Ma(n[t]))return!0;return!1}function $d(n){const e=[],t=n.data,i=n;return i.data=ba(t,e),i.attachments=e.length,{packet:i,buffers:e}}function ba(n,e,t){if(!n)return n;if(Jo(n)){const i={_placeholder:!0,num:e.length};return e.push(n),i}else if(Array.isArray(n)){const i=new Array(n.length);for(let s=0;s<n.length;s++)i[s]=ba(n[s],e);return i}else if(typeof n=="object"&&!(n instanceof Date)){if(n.toJSON&&typeof n.toJSON=="function"&&!t)return ba(n.toJSON(),e,!0);const i={};for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&(i[s]=ba(n[s],e));return i}return n}function Kd(n,e){return n.data=Kr(n.data,e),delete n.attachments,n}function Kr(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=Kr(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=Kr(n[t],e));return n}const Zd=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var qe;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(qe||(qe={}));class jd{constructor(e){this.replacer=e}encode(e){return(e.type===qe.EVENT||e.type===qe.ACK)&&Ma(e)?this.encodeAsBinary({type:e.type===qe.EVENT?qe.BINARY_EVENT:qe.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===qe.BINARY_EVENT||e.type===qe.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=$d(e),i=this.encodeAsString(t.packet),s=t.buffers;return s.unshift(i),s}}class Qo extends Rt{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===qe.BINARY_EVENT;i||t.type===qe.BINARY_ACK?(t.type=i?qe.EVENT:qe.ACK,this.reconstructor=new Jd(t)):super.emitReserved("decoded",t)}else if(Jo(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if(qe[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===qe.BINARY_EVENT||i.type===qe.BINARY_ACK){const a=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const r=e.substring(a,t);if(r!=Number(r)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const o=Number(r);if(!Qd(o)||o<1)throw new Error("Illegal attachments");if(o>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=o}if(e.charAt(t+1)==="/"){const a=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(a,t)}else i.nsp="/";const s=e.charAt(t+1);if(s!==""&&Number(s)==s){const a=t+1;for(;++t;){const r=e.charAt(t);if(r==null||Number(r)!=r){--t;break}if(t===e.length)break}i.id=Number(e.substring(a,t+1))}if(e.charAt(++t)){const a=this.tryParse(e.substr(t));if(Qo.isPayloadValid(i.type,a))i.data=a;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case qe.CONNECT:return ql(t);case qe.DISCONNECT:return t===void 0;case qe.CONNECT_ERROR:return typeof t=="string"||ql(t);case qe.EVENT:case qe.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&Zd.indexOf(t[0])===-1);case qe.ACK:case qe.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Jd{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=Kd(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const Qd=Number.isInteger||function(n){return typeof n=="number"&&isFinite(n)&&Math.floor(n)===n};function ql(n){return Object.prototype.toString.call(n)==="[object Object]"}const ef=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Qo,Encoder:jd,get PacketType(){return qe}},Symbol.toStringTag,{value:"Module"}));function fi(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const tf=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class hh extends Rt{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[fi(e,"open",this.onopen.bind(this)),fi(e,"packet",this.onpacket.bind(this)),fi(e,"error",this.onerror.bind(this)),fi(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,s,a;if(tf.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const r={type:qe.EVENT,data:t};if(r.options={},r.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const h=this.ids++,f=t.pop();this._registerAckCallback(h,f),r.id=h}const o=(s=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||s===void 0?void 0:s.writable,l=this.connected&&!(!((a=this.io.engine)===null||a===void 0)&&a._hasPingExpired());return this.flags.volatile&&!o||(l?(this.notifyOutgoingListeners(r),this.packet(r)):this.sendBuffer.push(r)),this.flags={},this}_registerAckCallback(e,t){var i;const s=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(s===void 0){this.acks[e]=t;return}const a=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let o=0;o<this.sendBuffer.length;o++)this.sendBuffer[o].id===e&&this.sendBuffer.splice(o,1);t.call(this,new Error("operation has timed out"))},s),r=(...o)=>{this.io.clearTimeoutFn(a),t.apply(this,o)};r.withError=!0,this.acks[e]=r}emitWithAck(e,...t){return new Promise((i,s)=>{const a=(r,o)=>r?s(r):i(o);a.withError=!0,t.push(a),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...a)=>(this._queue[0],s!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(s)):(this._queue.shift(),t&&t(null,...a)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:qe.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case qe.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case qe.EVENT:case qe.BINARY_EVENT:this.onevent(e);break;case qe.ACK:case qe.BINARY_ACK:this.onack(e);break;case qe.DISCONNECT:this.ondisconnect();break;case qe.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...s){i||(i=!0,t.packet({type:qe.ACK,id:e,data:s}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:qe.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function ms(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}ms.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};ms.prototype.reset=function(){this.attempts=0};ms.prototype.setMin=function(n){this.ms=n};ms.prototype.setMax=function(n){this.max=n};ms.prototype.setJitter=function(n){this.jitter=n};class Zr extends Rt{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,Ya(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new ms({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const s=t.parser||ef;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Hd(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const s=fi(t,"open",function(){i.onopen(),e&&e()}),a=o=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",o),e?e(o):this.maybeReconnectOnOpen()},r=fi(t,"error",a);if(this._timeout!==!1){const o=this._timeout,l=this.setTimeoutFn(()=>{s(),a(new Error("timeout")),t.close()},o);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(s),this.subs.push(r),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(fi(e,"ping",this.onping.bind(this)),fi(e,"data",this.ondata.bind(this)),fi(e,"error",this.onerror.bind(this)),fi(e,"close",this.onclose.bind(this)),fi(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){qa(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new hh(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const _s={};function Ea(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=Wd(n,e.path||"/socket.io"),i=t.source,s=t.id,a=t.path,r=_s[s]&&a in _s[s].nsps,o=e.forceNew||e["force new connection"]||e.multiplex===!1||r;let l;return o?l=new Zr(i,e):(_s[s]||(_s[s]=new Zr(i,e)),l=_s[s]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(Ea,{Manager:Zr,Socket:hh,io:Ea,connect:Ea});/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const el="184",nf=0,Yl=1,sf=2,Ta=1,af=2,Rs=3,mn=0,Kt=1,Gi=2,Yi=0,ss=1,jr=2,$l=3,Kl=4,rf=5,wn=100,of=101,lf=102,cf=103,hf=104,df=200,ff=201,uf=202,pf=203,Jr=204,Qr=205,mf=206,gf=207,yf=208,xf=209,_f=210,vf=211,Sf=212,Mf=213,bf=214,eo=0,to=1,io=2,os=3,no=4,so=5,ao=6,ro=7,dh=0,Ef=1,Tf=2,Pi=0,fh=1,uh=2,ph=3,mh=4,gh=5,yh=6,xh=7,_h=300,Nn=301,ls=302,or=303,lr=304,$a=306,oo=1e3,Xi=1001,lo=1002,Ft=1003,wf=1004,Ws=1005,Ht=1006,cr=1007,Rn=1008,ii=1009,vh=1010,Sh=1011,Ds=1012,tl=1013,Di=1014,wi=1015,Ki=1016,il=1017,nl=1018,Ns=1020,Mh=35902,bh=35899,Eh=1021,Th=1022,yi=1023,Zi=1026,Pn=1027,wh=1028,sl=1029,kn=1030,al=1031,rl=1033,wa=33776,Aa=33777,Ra=33778,Pa=33779,co=35840,ho=35841,fo=35842,uo=35843,po=36196,mo=37492,go=37496,yo=37488,xo=37489,Ua=37490,_o=37491,vo=37808,So=37809,Mo=37810,bo=37811,Eo=37812,To=37813,wo=37814,Ao=37815,Ro=37816,Po=37817,Co=37818,Io=37819,Lo=37820,Do=37821,No=36492,ko=36494,Uo=36495,Fo=36283,Bo=36284,Fa=36285,Oo=36286,Af=3200,zo=0,Rf=1,ln="",ai="srgb",Ba="srgb-linear",Oa="linear",st="srgb",zn=7680,Zl=519,Pf=512,Cf=513,If=514,ol=515,Lf=516,Df=517,ll=518,Nf=519,jl=35044,Jl="300 es",Ai=2e3,ks=2001;function kf(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function za(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Uf(){const n=za("canvas");return n.style.display="block",n}const Ql={};function ec(...n){const e="THREE."+n.shift();console.log(e,...n)}function Ah(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ce(...n){n=Ah(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Je(...n){n=Ah(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Vo(...n){const e=n.join(" ");e in Ql||(Ql[e]=!0,Ce(...n))}function Ff(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}const Bf={[eo]:to,[io]:ao,[no]:ro,[os]:so,[to]:eo,[ao]:io,[ro]:no,[so]:os};class Fn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const Ot=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],hr=Math.PI/180,Ho=180/Math.PI;function Fs(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ot[n&255]+Ot[n>>8&255]+Ot[n>>16&255]+Ot[n>>24&255]+"-"+Ot[e&255]+Ot[e>>8&255]+"-"+Ot[e>>16&15|64]+Ot[e>>24&255]+"-"+Ot[t&63|128]+Ot[t>>8&255]+"-"+Ot[t>>16&255]+Ot[t>>24&255]+Ot[i&255]+Ot[i>>8&255]+Ot[i>>16&255]+Ot[i>>24&255]).toLowerCase()}function $e(n,e,t){return Math.max(e,Math.min(t,n))}function Of(n,e){return(n%e+e)%e}function dr(n,e,t){return(1-t)*n+t*e}function vs(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Yt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Pl=class Pl{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Pl.prototype.isVector2=!0;let tt=Pl;class gs{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,o){let l=i[s+0],c=i[s+1],h=i[s+2],f=i[s+3],d=a[r+0],u=a[r+1],g=a[r+2],v=a[r+3];if(f!==v||l!==d||c!==u||h!==g){let m=l*d+c*u+h*g+f*v;m<0&&(d=-d,u=-u,g=-g,v=-v,m=-m);let p=1-o;if(m<.9995){const b=Math.acos(m),_=Math.sin(b);p=Math.sin(p*b)/_,o=Math.sin(o*b)/_,l=l*p+d*o,c=c*p+u*o,h=h*p+g*o,f=f*p+v*o}else{l=l*p+d*o,c=c*p+u*o,h=h*p+g*o,f=f*p+v*o;const b=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=b,c*=b,h*=b,f*=b}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,a,r){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],f=a[r],d=a[r+1],u=a[r+2],g=a[r+3];return e[t]=o*g+h*f+l*u-c*d,e[t+1]=l*g+h*d+c*f-o*u,e[t+2]=c*g+h*u+o*d-l*f,e[t+3]=h*g-o*f-l*d-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),f=o(a/2),d=l(i/2),u=l(s/2),g=l(a/2);switch(r){case"XYZ":this._x=d*h*f+c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f-d*u*g;break;case"YXZ":this._x=d*h*f+c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f+d*u*g;break;case"ZXY":this._x=d*h*f-c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f-d*u*g;break;case"ZYX":this._x=d*h*f-c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f+d*u*g;break;case"YZX":this._x=d*h*f+c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f-d*u*g;break;case"XZY":this._x=d*h*f-c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f+d*u*g;break;default:Ce("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],d=i+o+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(a-c)*u,this._z=(r-s)*u}else if(i>o&&i>f){const u=2*Math.sqrt(1+i-o-f);this._w=(h-l)/u,this._x=.25*u,this._y=(s+r)/u,this._z=(a+c)/u}else if(o>f){const u=2*Math.sqrt(1+o-i-f);this._w=(a-c)/u,this._x=(s+r)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-o);this._w=(r-s)/u,this._x=(a+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+r*o+s*c-a*l,this._y=s*h+r*l+a*o-i*c,this._z=a*h+r*c+i*l-s*o,this._w=r*h-i*o-s*l-a*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+a*t,this._w=this._w*l+r*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+a*t,this._w=this._w*l+r*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Cl=class Cl{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(tc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(tc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,o=e.z,l=e.w,c=2*(r*s-o*i),h=2*(o*t-a*s),f=2*(a*i-r*t);return this.x=t+l*c+r*f-o*h,this.y=i+l*h+o*c-a*f,this.z=s+l*f+a*h-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,o=t.y,l=t.z;return this.x=s*l-a*o,this.y=a*r-i*l,this.z=i*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return fr.copy(this).projectOnVector(e),this.sub(fr)}reflect(e){return this.sub(fr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Cl.prototype.isVector3=!0;let V=Cl;const fr=new V,tc=new gs,Il=class Il{constructor(e,t,i,s,a,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c)}set(e,t,i,s,a,r,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=a,h[5]=l,h[6]=i,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],g=i[8],v=s[0],m=s[3],p=s[6],b=s[1],_=s[4],x=s[7],y=s[2],E=s[5],P=s[8];return a[0]=r*v+o*b+l*y,a[3]=r*m+o*_+l*E,a[6]=r*p+o*x+l*P,a[1]=c*v+h*b+f*y,a[4]=c*m+h*_+f*E,a[7]=c*p+h*x+f*P,a[2]=d*v+u*b+g*y,a[5]=d*m+u*_+g*E,a[8]=d*p+u*x+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*r*h-t*o*c-i*a*h+i*o*l+s*a*c-s*r*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*r-o*c,d=o*l-h*a,u=c*a-r*l,g=t*f+i*d+s*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=f*v,e[1]=(s*c-h*i)*v,e[2]=(o*i-s*r)*v,e[3]=d*v,e[4]=(h*t-s*l)*v,e[5]=(s*a-o*t)*v,e[6]=u*v,e[7]=(i*l-c*t)*v,e[8]=(r*t-i*a)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,o){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+e,-s*c,s*l,-s*(-c*r+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(ur.makeScale(e,t)),this}rotate(e){return this.premultiply(ur.makeRotation(-e)),this}translate(e,t){return this.premultiply(ur.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Il.prototype.isMatrix3=!0;let Ne=Il;const ur=new Ne,ic=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),nc=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function zf(){const n={enabled:!0,workingColorSpace:Ba,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===st&&(s.r=$i(s.r),s.g=$i(s.g),s.b=$i(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===st&&(s.r=as(s.r),s.g=as(s.g),s.b=as(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ln?Oa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Vo("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Vo("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ba]:{primaries:e,whitePoint:i,transfer:Oa,toXYZ:ic,fromXYZ:nc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ai},outputColorSpaceConfig:{drawingBufferColorSpace:ai}},[ai]:{primaries:e,whitePoint:i,transfer:st,toXYZ:ic,fromXYZ:nc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ai}}}),n}const Ye=zf();function $i(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function as(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Vn;class Vf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Vn===void 0&&(Vn=za("canvas")),Vn.width=e.width,Vn.height=e.height;const s=Vn.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Vn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=za("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=$i(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor($i(t[i]/255)*255):t[i]=$i(t[i]);return{data:t,width:e.width,height:e.height}}else return Ce("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Hf=0;class cl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Hf++}),this.uuid=Fs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(pr(s[r].image)):a.push(pr(s[r]))}else a=pr(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function pr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Vf.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ce("Texture: Unable to serialize Texture."),{})}let Wf=0;const mr=new V;class Xt extends Fn{constructor(e=Xt.DEFAULT_IMAGE,t=Xt.DEFAULT_MAPPING,i=Xi,s=Xi,a=Ht,r=Rn,o=yi,l=ii,c=Xt.DEFAULT_ANISOTROPY,h=ln){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=Fs(),this.name="",this.source=new cl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(mr).x}get height(){return this.source.getSize(mr).y}get depth(){return this.source.getSize(mr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ce(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ce(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==_h)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case oo:e.x=e.x-Math.floor(e.x);break;case Xi:e.x=e.x<0?0:1;break;case lo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case oo:e.y=e.y-Math.floor(e.y);break;case Xi:e.y=e.y<0?0:1;break;case lo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Xt.DEFAULT_IMAGE=null;Xt.DEFAULT_MAPPING=_h;Xt.DEFAULT_ANISOTROPY=1;const Ll=class Ll{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const l=e.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(c+1)/2,x=(u+1)/2,y=(p+1)/2,E=(h+d)/4,P=(f+v)/4,S=(g+m)/4;return _>x&&_>y?_<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(_),s=E/i,a=P/i):x>y?x<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(x),i=E/s,a=S/s):y<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(y),i=P/a,s=S/a),this.set(i,s,a,t),this}let b=Math.sqrt((m-g)*(m-g)+(f-v)*(f-v)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(f-v)/b,this.z=(d-h)/b,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Ll.prototype.isVector4=!0;let vt=Ll;class Gf extends Fn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ht,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new vt(0,0,e,t),this.scissorTest=!1,this.viewport=new vt(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},a=new Xt(s),r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Ht,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new cl(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ci extends Gf{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Rh extends Xt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Ft,this.minFilter=Ft,this.wrapR=Xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Xf extends Xt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Ft,this.minFilter=Ft,this.wrapR=Xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Xa=class Xa{constructor(e,t,i,s,a,r,o,l,c,h,f,d,u,g,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c,h,f,d,u,g,v,m)}set(e,t,i,s,a,r,o,l,c,h,f,d,u,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Xa().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Hn.setFromMatrixColumn(e,0).length(),a=1/Hn.setFromMatrixColumn(e,1).length(),r=1/Hn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(e.order==="XYZ"){const d=r*h,u=r*f,g=o*h,v=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=u+g*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=g+u*c,t[10]=r*l}else if(e.order==="YXZ"){const d=l*h,u=l*f,g=c*h,v=c*f;t[0]=d+v*o,t[4]=g*o-u,t[8]=r*c,t[1]=r*f,t[5]=r*h,t[9]=-o,t[2]=u*o-g,t[6]=v+d*o,t[10]=r*l}else if(e.order==="ZXY"){const d=l*h,u=l*f,g=c*h,v=c*f;t[0]=d-v*o,t[4]=-r*f,t[8]=g+u*o,t[1]=u+g*o,t[5]=r*h,t[9]=v-d*o,t[2]=-r*c,t[6]=o,t[10]=r*l}else if(e.order==="ZYX"){const d=r*h,u=r*f,g=o*h,v=o*f;t[0]=l*h,t[4]=g*c-u,t[8]=d*c+v,t[1]=l*f,t[5]=v*c+d,t[9]=u*c-g,t[2]=-c,t[6]=o*l,t[10]=r*l}else if(e.order==="YZX"){const d=r*l,u=r*c,g=o*l,v=o*c;t[0]=l*h,t[4]=v-d*f,t[8]=g*f+u,t[1]=f,t[5]=r*h,t[9]=-o*h,t[2]=-c*h,t[6]=u*f+g,t[10]=d-v*f}else if(e.order==="XZY"){const d=r*l,u=r*c,g=o*l,v=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=d*f+v,t[5]=r*h,t[9]=u*f-g,t[2]=g*f-u,t[6]=o*h,t[10]=v*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qf,e,Yf)}lookAt(e,t,i){const s=this.elements;return Jt.subVectors(e,t),Jt.lengthSq()===0&&(Jt.z=1),Jt.normalize(),en.crossVectors(i,Jt),en.lengthSq()===0&&(Math.abs(i.z)===1?Jt.x+=1e-4:Jt.z+=1e-4,Jt.normalize(),en.crossVectors(i,Jt)),en.normalize(),Gs.crossVectors(Jt,en),s[0]=en.x,s[4]=Gs.x,s[8]=Jt.x,s[1]=en.y,s[5]=Gs.y,s[9]=Jt.y,s[2]=en.z,s[6]=Gs.z,s[10]=Jt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],g=i[2],v=i[6],m=i[10],p=i[14],b=i[3],_=i[7],x=i[11],y=i[15],E=s[0],P=s[4],S=s[8],w=s[12],L=s[1],R=s[5],C=s[9],F=s[13],N=s[2],I=s[6],O=s[10],B=s[14],K=s[3],j=s[7],ee=s[11],ue=s[15];return a[0]=r*E+o*L+l*N+c*K,a[4]=r*P+o*R+l*I+c*j,a[8]=r*S+o*C+l*O+c*ee,a[12]=r*w+o*F+l*B+c*ue,a[1]=h*E+f*L+d*N+u*K,a[5]=h*P+f*R+d*I+u*j,a[9]=h*S+f*C+d*O+u*ee,a[13]=h*w+f*F+d*B+u*ue,a[2]=g*E+v*L+m*N+p*K,a[6]=g*P+v*R+m*I+p*j,a[10]=g*S+v*C+m*O+p*ee,a[14]=g*w+v*F+m*B+p*ue,a[3]=b*E+_*L+x*N+y*K,a[7]=b*P+_*R+x*I+y*j,a[11]=b*S+_*C+x*O+y*ee,a[15]=b*w+_*F+x*B+y*ue,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],d=e[10],u=e[14],g=e[3],v=e[7],m=e[11],p=e[15],b=l*u-c*d,_=o*u-c*f,x=o*d-l*f,y=r*u-c*h,E=r*d-l*h,P=r*f-o*h;return t*(v*b-m*_+p*x)-i*(g*b-m*y+p*E)+s*(g*_-v*y+p*P)-a*(g*x-v*E+m*P)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],d=e[10],u=e[11],g=e[12],v=e[13],m=e[14],p=e[15],b=t*o-i*r,_=t*l-s*r,x=t*c-a*r,y=i*l-s*o,E=i*c-a*o,P=s*c-a*l,S=h*v-f*g,w=h*m-d*g,L=h*p-u*g,R=f*m-d*v,C=f*p-u*v,F=d*p-u*m,N=b*F-_*C+x*R+y*L-E*w+P*S;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/N;return e[0]=(o*F-l*C+c*R)*I,e[1]=(s*C-i*F-a*R)*I,e[2]=(v*P-m*E+p*y)*I,e[3]=(d*E-f*P-u*y)*I,e[4]=(l*L-r*F-c*w)*I,e[5]=(t*F-s*L+a*w)*I,e[6]=(m*x-g*P-p*_)*I,e[7]=(h*P-d*x+u*_)*I,e[8]=(r*C-o*L+c*S)*I,e[9]=(i*L-t*C-a*S)*I,e[10]=(g*E-v*x+p*b)*I,e[11]=(f*x-h*E-u*b)*I,e[12]=(o*w-r*R-l*S)*I,e[13]=(t*R-i*w+s*S)*I,e[14]=(v*_-g*y-m*b)*I,e[15]=(h*y-f*_+d*b)*I,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,o=e.y,l=e.z,c=a*r,h=a*o;return this.set(c*r+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*r,0,c*l-s*o,h*l+s*r,a*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,o=t._z,l=t._w,c=a+a,h=r+r,f=o+o,d=a*c,u=a*h,g=a*f,v=r*h,m=r*f,p=o*f,b=l*c,_=l*h,x=l*f,y=i.x,E=i.y,P=i.z;return s[0]=(1-(v+p))*y,s[1]=(u+x)*y,s[2]=(g-_)*y,s[3]=0,s[4]=(u-x)*E,s[5]=(1-(d+p))*E,s[6]=(m+b)*E,s[7]=0,s[8]=(g+_)*P,s[9]=(m-b)*P,s[10]=(1-(d+v))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const a=this.determinant();if(a===0)return i.set(1,1,1),t.identity(),this;let r=Hn.set(s[0],s[1],s[2]).length();const o=Hn.set(s[4],s[5],s[6]).length(),l=Hn.set(s[8],s[9],s[10]).length();a<0&&(r=-r),li.copy(this);const c=1/r,h=1/o,f=1/l;return li.elements[0]*=c,li.elements[1]*=c,li.elements[2]*=c,li.elements[4]*=h,li.elements[5]*=h,li.elements[6]*=h,li.elements[8]*=f,li.elements[9]*=f,li.elements[10]*=f,t.setFromRotationMatrix(li),i.x=r,i.y=o,i.z=l,this}makePerspective(e,t,i,s,a,r,o=Ai,l=!1){const c=this.elements,h=2*a/(t-e),f=2*a/(i-s),d=(t+e)/(t-e),u=(i+s)/(i-s);let g,v;if(l)g=a/(r-a),v=r*a/(r-a);else if(o===Ai)g=-(r+a)/(r-a),v=-2*r*a/(r-a);else if(o===ks)g=-r/(r-a),v=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=f,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,a,r,o=Ai,l=!1){const c=this.elements,h=2/(t-e),f=2/(i-s),d=-(t+e)/(t-e),u=-(i+s)/(i-s);let g,v;if(l)g=1/(r-a),v=r/(r-a);else if(o===Ai)g=-2/(r-a),v=-(r+a)/(r-a);else if(o===ks)g=-1/(r-a),v=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=f,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Xa.prototype.isMatrix4=!0;let wt=Xa;const Hn=new V,li=new wt,qf=new V(0,0,0),Yf=new V(1,1,1),en=new V,Gs=new V,Jt=new V,sc=new wt,ac=new gs;class gn{constructor(e=0,t=0,i=0,s=gn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],d=s[6],u=s[10];switch(t){case"XYZ":this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin($e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-$e(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-$e(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,u),this._y=0);break;default:Ce("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return sc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(sc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ac.setFromEuler(this),this.setFromQuaternion(ac,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gn.DEFAULT_ORDER="XYZ";class Ph{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let $f=0;const rc=new V,Wn=new gs,Ui=new wt,Xs=new V,Ss=new V,Kf=new V,Zf=new gs,oc=new V(1,0,0),lc=new V(0,1,0),cc=new V(0,0,1),hc={type:"added"},jf={type:"removed"},Gn={type:"childadded",child:null},gr={type:"childremoved",child:null};class Wt extends Fn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$f++}),this.uuid=Fs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Wt.DEFAULT_UP.clone();const e=new V,t=new gn,i=new gs,s=new V(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new wt},normalMatrix:{value:new Ne}}),this.matrix=new wt,this.matrixWorld=new wt,this.matrixAutoUpdate=Wt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ph,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Wn.setFromAxisAngle(e,t),this.quaternion.multiply(Wn),this}rotateOnWorldAxis(e,t){return Wn.setFromAxisAngle(e,t),this.quaternion.premultiply(Wn),this}rotateX(e){return this.rotateOnAxis(oc,e)}rotateY(e){return this.rotateOnAxis(lc,e)}rotateZ(e){return this.rotateOnAxis(cc,e)}translateOnAxis(e,t){return rc.copy(e).applyQuaternion(this.quaternion),this.position.add(rc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(oc,e)}translateY(e){return this.translateOnAxis(lc,e)}translateZ(e){return this.translateOnAxis(cc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ui.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Xs.copy(e):Xs.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ui.lookAt(Ss,Xs,this.up):Ui.lookAt(Xs,Ss,this.up),this.quaternion.setFromRotationMatrix(Ui),s&&(Ui.extractRotation(s.matrixWorld),Wn.setFromRotationMatrix(Ui),this.quaternion.premultiply(Wn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(hc),Gn.child=e,this.dispatchEvent(Gn),Gn.child=null):Je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(jf),gr.child=e,this.dispatchEvent(gr),gr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ui.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ui.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ui),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(hc),Gn.child=e,this.dispatchEvent(Gn),Gn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ss,e,Kf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ss,Zf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,a=this.matrix.elements;a[12]+=t-a[0]*t-a[4]*i-a[8]*s,a[13]+=i-a[1]*t-a[5]*i-a[9]*s,a[14]+=s-a[2]*t-a[6]*i-a[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];a(e.shapes,f)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(a(e.animations,l))}}if(t){const o=r(e.geometries),l=r(e.materials),c=r(e.textures),h=r(e.images),f=r(e.shapes),d=r(e.skeletons),u=r(e.animations),g=r(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=s,i;function r(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Wt.DEFAULT_UP=new V(0,1,0);Wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Cn extends Wt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Jf={type:"move"};class yr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Cn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Cn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Cn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){r=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,g=.005;c.inputState.pinching&&d>u+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=u-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Jf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Cn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Ch={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},tn={h:0,s:0,l:0},qs={h:0,s:0,l:0};function xr(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class it{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ai){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ye.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ye.workingColorSpace){if(e=Of(e,1),t=$e(t,0,1),i=$e(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=xr(r,a,e+1/3),this.g=xr(r,a,e),this.b=xr(r,a,e-1/3)}return Ye.colorSpaceToWorking(this,s),this}setStyle(e,t=ai){function i(a){a!==void 0&&parseFloat(a)<1&&Ce("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:Ce("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);Ce("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ai){const i=Ch[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ce("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=$i(e.r),this.g=$i(e.g),this.b=$i(e.b),this}copyLinearToSRGB(e){return this.r=as(e.r),this.g=as(e.g),this.b=as(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ai){return Ye.workingToColorSpace(zt.copy(this),e),Math.round($e(zt.r*255,0,255))*65536+Math.round($e(zt.g*255,0,255))*256+Math.round($e(zt.b*255,0,255))}getHexString(e=ai){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(zt.copy(this),t);const i=zt.r,s=zt.g,a=zt.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let l,c;const h=(o+r)/2;if(o===r)l=0,c=0;else{const f=r-o;switch(c=h<=.5?f/(r+o):f/(2-r-o),r){case i:l=(s-a)/f+(s<a?6:0);break;case s:l=(a-i)/f+2;break;case a:l=(i-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(zt.copy(this),t),e.r=zt.r,e.g=zt.g,e.b=zt.b,e}getStyle(e=ai){Ye.workingToColorSpace(zt.copy(this),e);const t=zt.r,i=zt.g,s=zt.b;return e!==ai?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(tn),this.setHSL(tn.h+e,tn.s+t,tn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(tn),e.getHSL(qs);const i=dr(tn.h,qs.h,t),s=dr(tn.s,qs.s,t),a=dr(tn.l,qs.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const zt=new it;it.NAMES=Ch;class Qf extends Wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gn,this.environmentIntensity=1,this.environmentRotation=new gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const ci=new V,Fi=new V,_r=new V,Bi=new V,Xn=new V,qn=new V,dc=new V,vr=new V,Sr=new V,Mr=new V,br=new vt,Er=new vt,Tr=new vt;class pi{constructor(e=new V,t=new V,i=new V){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),ci.subVectors(e,t),s.cross(ci);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){ci.subVectors(s,t),Fi.subVectors(i,t),_r.subVectors(e,t);const r=ci.dot(ci),o=ci.dot(Fi),l=ci.dot(_r),c=Fi.dot(Fi),h=Fi.dot(_r),f=r*c-o*o;if(f===0)return a.set(0,0,0),null;const d=1/f,u=(c*l-o*h)*d,g=(r*h-o*l)*d;return a.set(1-u-g,g,u)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Bi)===null?!1:Bi.x>=0&&Bi.y>=0&&Bi.x+Bi.y<=1}static getInterpolation(e,t,i,s,a,r,o,l){return this.getBarycoord(e,t,i,s,Bi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Bi.x),l.addScaledVector(r,Bi.y),l.addScaledVector(o,Bi.z),l)}static getInterpolatedAttribute(e,t,i,s,a,r){return br.setScalar(0),Er.setScalar(0),Tr.setScalar(0),br.fromBufferAttribute(e,t),Er.fromBufferAttribute(e,i),Tr.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(br,a.x),r.addScaledVector(Er,a.y),r.addScaledVector(Tr,a.z),r}static isFrontFacing(e,t,i,s){return ci.subVectors(i,t),Fi.subVectors(e,t),ci.cross(Fi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ci.subVectors(this.c,this.b),Fi.subVectors(this.a,this.b),ci.cross(Fi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return pi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return pi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return pi.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return pi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return pi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,o;Xn.subVectors(s,i),qn.subVectors(a,i),vr.subVectors(e,i);const l=Xn.dot(vr),c=qn.dot(vr);if(l<=0&&c<=0)return t.copy(i);Sr.subVectors(e,s);const h=Xn.dot(Sr),f=qn.dot(Sr);if(h>=0&&f<=h)return t.copy(s);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return r=l/(l-h),t.copy(i).addScaledVector(Xn,r);Mr.subVectors(e,a);const u=Xn.dot(Mr),g=qn.dot(Mr);if(g>=0&&u<=g)return t.copy(a);const v=u*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(qn,o);const m=h*g-u*f;if(m<=0&&f-h>=0&&u-g>=0)return dc.subVectors(a,s),o=(f-h)/(f-h+(u-g)),t.copy(s).addScaledVector(dc,o);const p=1/(m+v+d);return r=v*p,o=d*p,t.copy(i).addScaledVector(Xn,r).addScaledVector(qn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Un{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(hi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(hi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=hi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,hi):hi.fromBufferAttribute(a,r),hi.applyMatrix4(e.matrixWorld),this.expandByPoint(hi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ys.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ys.copy(i.boundingBox)),Ys.applyMatrix4(e.matrixWorld),this.union(Ys)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,hi),hi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ms),$s.subVectors(this.max,Ms),Yn.subVectors(e.a,Ms),$n.subVectors(e.b,Ms),Kn.subVectors(e.c,Ms),nn.subVectors($n,Yn),sn.subVectors(Kn,$n),_n.subVectors(Yn,Kn);let t=[0,-nn.z,nn.y,0,-sn.z,sn.y,0,-_n.z,_n.y,nn.z,0,-nn.x,sn.z,0,-sn.x,_n.z,0,-_n.x,-nn.y,nn.x,0,-sn.y,sn.x,0,-_n.y,_n.x,0];return!wr(t,Yn,$n,Kn,$s)||(t=[1,0,0,0,1,0,0,0,1],!wr(t,Yn,$n,Kn,$s))?!1:(Ks.crossVectors(nn,sn),t=[Ks.x,Ks.y,Ks.z],wr(t,Yn,$n,Kn,$s))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,hi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(hi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Oi=[new V,new V,new V,new V,new V,new V,new V,new V],hi=new V,Ys=new Un,Yn=new V,$n=new V,Kn=new V,nn=new V,sn=new V,_n=new V,Ms=new V,$s=new V,Ks=new V,vn=new V;function wr(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){vn.fromArray(n,a);const o=s.x*Math.abs(vn.x)+s.y*Math.abs(vn.y)+s.z*Math.abs(vn.z),l=e.dot(vn),c=t.dot(vn),h=i.dot(vn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const At=new V,Zs=new tt;let eu=0;class Ii extends Fn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:eu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=jl,this.updateRanges=[],this.gpuType=wi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Zs.fromBufferAttribute(this,t),Zs.applyMatrix3(e),this.setXY(t,Zs.x,Zs.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)At.fromBufferAttribute(this,t),At.applyMatrix3(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)At.fromBufferAttribute(this,t),At.applyMatrix4(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)At.fromBufferAttribute(this,t),At.applyNormalMatrix(e),this.setXYZ(t,At.x,At.y,At.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)At.fromBufferAttribute(this,t),At.transformDirection(e),this.setXYZ(t,At.x,At.y,At.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=vs(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Yt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=vs(t,this.array)),t}setX(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=vs(t,this.array)),t}setY(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=vs(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=vs(t,this.array)),t}setW(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),i=Yt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),i=Yt(i,this.array),s=Yt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),i=Yt(i,this.array),s=Yt(s,this.array),a=Yt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==jl&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Ih extends Ii{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Lh extends Ii{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class qt extends Ii{constructor(e,t,i){super(new Float32Array(e),t,i)}}const tu=new Un,bs=new V,Ar=new V;class hl{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):tu.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;bs.subVectors(e,this.center);const t=bs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(bs,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ar.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(bs.copy(e.center).add(Ar)),this.expandByPoint(bs.copy(e.center).sub(Ar))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let iu=0;const si=new wt,Rr=new Wt,Zn=new V,Qt=new Un,Es=new Un,Nt=new V;class vi extends Fn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:iu++}),this.uuid=Fs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(kf(e)?Lh:Ih)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Ne().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return si.makeRotationFromQuaternion(e),this.applyMatrix4(si),this}rotateX(e){return si.makeRotationX(e),this.applyMatrix4(si),this}rotateY(e){return si.makeRotationY(e),this.applyMatrix4(si),this}rotateZ(e){return si.makeRotationZ(e),this.applyMatrix4(si),this}translate(e,t,i){return si.makeTranslation(e,t,i),this.applyMatrix4(si),this}scale(e,t,i){return si.makeScale(e,t,i),this.applyMatrix4(si),this}lookAt(e){return Rr.lookAt(e),Rr.updateMatrix(),this.applyMatrix4(Rr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Zn).negate(),this.translate(Zn.x,Zn.y,Zn.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new qt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&Ce("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Un);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];Qt.setFromBufferAttribute(a),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,Qt.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,Qt.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(Qt.min),this.boundingBox.expandByPoint(Qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new hl);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){const i=this.boundingSphere.center;if(Qt.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];Es.setFromBufferAttribute(o),this.morphTargetsRelative?(Nt.addVectors(Qt.min,Es.min),Qt.expandByPoint(Nt),Nt.addVectors(Qt.max,Es.max),Qt.expandByPoint(Nt)):(Qt.expandByPoint(Es.min),Qt.expandByPoint(Es.max))}Qt.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)Nt.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(Nt));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Nt.fromBufferAttribute(o,c),l&&(Zn.fromBufferAttribute(e,c),Nt.add(Zn)),s=Math.max(s,i.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ii(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],l=[];for(let S=0;S<i.count;S++)o[S]=new V,l[S]=new V;const c=new V,h=new V,f=new V,d=new tt,u=new tt,g=new tt,v=new V,m=new V;function p(S,w,L){c.fromBufferAttribute(i,S),h.fromBufferAttribute(i,w),f.fromBufferAttribute(i,L),d.fromBufferAttribute(a,S),u.fromBufferAttribute(a,w),g.fromBufferAttribute(a,L),h.sub(c),f.sub(c),u.sub(d),g.sub(d);const R=1/(u.x*g.y-g.x*u.y);isFinite(R)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(R),m.copy(f).multiplyScalar(u.x).addScaledVector(h,-g.x).multiplyScalar(R),o[S].add(v),o[w].add(v),o[L].add(v),l[S].add(m),l[w].add(m),l[L].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let S=0,w=b.length;S<w;++S){const L=b[S],R=L.start,C=L.count;for(let F=R,N=R+C;F<N;F+=3)p(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const _=new V,x=new V,y=new V,E=new V;function P(S){y.fromBufferAttribute(s,S),E.copy(y);const w=o[S];_.copy(w),_.sub(y.multiplyScalar(y.dot(w))).normalize(),x.crossVectors(E,w);const R=x.dot(l[S])<0?-1:1;r.setXYZW(S,_.x,_.y,_.z,R)}for(let S=0,w=b.length;S<w;++S){const L=b[S],R=L.start,C=L.count;for(let F=R,N=R+C;F<N;F+=3)P(e.getX(F+0)),P(e.getX(F+1)),P(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ii(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const s=new V,a=new V,r=new V,o=new V,l=new V,c=new V,h=new V,f=new V;if(e)for(let d=0,u=e.count;d<u;d+=3){const g=e.getX(d+0),v=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,v),r.fromBufferAttribute(t,m),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,u=t.count;d<u;d+=3)s.fromBufferAttribute(t,d+0),a.fromBufferAttribute(t,d+1),r.fromBufferAttribute(t,d+2),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Nt.fromBufferAttribute(e,t),Nt.normalize(),e.setXYZ(t,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,d=new c.constructor(l.length*h);let u=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?u=l[v]*o.data.stride+o.offset:u=l[v]*h;for(let p=0;p<h;p++)d[g++]=c[u++]}return new Ii(d,h,f)}if(this.index===null)return Ce("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new vi,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=e(d,i);l.push(u)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(e.data))}h.length>0&&(s[l]=h,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const a=e.morphAttributes;for(const c in a){const h=[],f=a[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let c=0,h=r.length;c<h;c++){const f=r[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let nu=0;class Bs extends Fn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:nu++}),this.uuid=Fs(),this.name="",this.type="Material",this.blending=ss,this.side=mn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Jr,this.blendDst=Qr,this.blendEquation=wn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new it(0,0,0),this.blendAlpha=0,this.depthFunc=os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=zn,this.stencilZFail=zn,this.stencilZPass=zn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ce(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ce(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ss&&(i.blending=this.blending),this.side!==mn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Jr&&(i.blendSrc=this.blendSrc),this.blendDst!==Qr&&(i.blendDst=this.blendDst),this.blendEquation!==wn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==os&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==zn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==zn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==zn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const zi=new V,Pr=new V,js=new V,an=new V,Cr=new V,Js=new V,Ir=new V;class su{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=zi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zi.copy(this.origin).addScaledVector(this.direction,t),zi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Pr.copy(e).add(t).multiplyScalar(.5),js.copy(t).sub(e).normalize(),an.copy(this.origin).sub(Pr);const a=e.distanceTo(t)*.5,r=-this.direction.dot(js),o=an.dot(this.direction),l=-an.dot(js),c=an.lengthSq(),h=Math.abs(1-r*r);let f,d,u,g;if(h>0)if(f=r*l-o,d=r*o-l,g=a*h,f>=0)if(d>=-g)if(d<=g){const v=1/h;f*=v,d*=v,u=f*(f+r*d+2*o)+d*(r*f+d+2*l)+c}else d=a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*l)+c;else d=-a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*l)+c;else d<=-g?(f=Math.max(0,-(-r*a+o)),d=f>0?-a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c):d<=g?(f=0,d=Math.min(Math.max(-a,-l),a),u=d*(d+2*l)+c):(f=Math.max(0,-(r*a+o)),d=f>0?a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c);else d=r>0?-a:a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Pr).addScaledVector(js,d),u}intersectSphere(e,t){zi.subVectors(e.center,this.origin);const i=zi.dot(this.direction),s=zi.dot(zi)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(a=(e.min.y-d.y)*h,r=(e.max.y-d.y)*h):(a=(e.max.y-d.y)*h,r=(e.min.y-d.y)*h),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,zi)!==null}intersectTriangle(e,t,i,s,a){Cr.subVectors(t,e),Js.subVectors(i,e),Ir.crossVectors(Cr,Js);let r=this.direction.dot(Ir),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;an.subVectors(this.origin,e);const l=o*this.direction.dot(Js.crossVectors(an,Js));if(l<0)return null;const c=o*this.direction.dot(Cr.cross(an));if(c<0||l+c>r)return null;const h=-o*an.dot(Ir);return h<0?null:this.at(h/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Cs extends Bs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new it(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.combine=dh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const fc=new wt,Sn=new su,Qs=new hl,uc=new V,ea=new V,ta=new V,ia=new V,Lr=new V,na=new V,pc=new V,sa=new V;class ht extends Wt{constructor(e=new vi,t=new Cs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){na.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=o[l],f=a[l];h!==0&&(Lr.fromBufferAttribute(f,e),r?na.addScaledVector(Lr,h):na.addScaledVector(Lr.sub(t),h))}t.add(na)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Qs.copy(i.boundingSphere),Qs.applyMatrix4(a),Sn.copy(e.ray).recast(e.near),!(Qs.containsPoint(Sn.origin)===!1&&(Sn.intersectSphere(Qs,uc)===null||Sn.origin.distanceToSquared(uc)>(e.far-e.near)**2))&&(fc.copy(a).invert(),Sn.copy(e.ray).applyMatrix4(fc),!(i.boundingBox!==null&&Sn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Sn)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,d=a.groups,u=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=r[m.materialIndex],b=Math.max(m.start,u.start),_=Math.min(o.count,Math.min(m.start+m.count,u.start+u.count));for(let x=b,y=_;x<y;x+=3){const E=o.getX(x),P=o.getX(x+1),S=o.getX(x+2);s=aa(this,p,e,i,c,h,f,E,P,S),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,u.start),v=Math.min(o.count,u.start+u.count);for(let m=g,p=v;m<p;m+=3){const b=o.getX(m),_=o.getX(m+1),x=o.getX(m+2);s=aa(this,r,e,i,c,h,f,b,_,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=r[m.materialIndex],b=Math.max(m.start,u.start),_=Math.min(l.count,Math.min(m.start+m.count,u.start+u.count));for(let x=b,y=_;x<y;x+=3){const E=x,P=x+1,S=x+2;s=aa(this,p,e,i,c,h,f,E,P,S),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,u.start),v=Math.min(l.count,u.start+u.count);for(let m=g,p=v;m<p;m+=3){const b=m,_=m+1,x=m+2;s=aa(this,r,e,i,c,h,f,b,_,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function au(n,e,t,i,s,a,r,o){let l;if(e.side===Kt?l=i.intersectTriangle(r,a,s,!0,o):l=i.intersectTriangle(s,a,r,e.side===mn,o),l===null)return null;sa.copy(o),sa.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(sa);return c<t.near||c>t.far?null:{distance:c,point:sa.clone(),object:n}}function aa(n,e,t,i,s,a,r,o,l,c){n.getVertexPosition(o,ea),n.getVertexPosition(l,ta),n.getVertexPosition(c,ia);const h=au(n,e,t,i,ea,ta,ia,pc);if(h){const f=new V;pi.getBarycoord(pc,ea,ta,ia,f),s&&(h.uv=pi.getInterpolatedAttribute(s,o,l,c,f,new tt)),a&&(h.uv1=pi.getInterpolatedAttribute(a,o,l,c,f,new tt)),r&&(h.normal=pi.getInterpolatedAttribute(r,o,l,c,f,new V),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new V,materialIndex:0};pi.getNormal(ea,ta,ia,d.normal),h.face=d,h.barycoord=f}return h}class ru extends Xt{constructor(e=null,t=1,i=1,s,a,r,o,l,c=Ft,h=Ft,f,d){super(null,r,o,l,c,h,s,a,f,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Dr=new V,ou=new V,lu=new Ne;class bn{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Dr.subVectors(i,t).cross(ou.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(Dr),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/a;return i===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(s,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||lu.getNormalMatrix(e),s=this.coplanarPoint(Dr).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Mn=new hl,cu=new tt(.5,.5),ra=new V;class dl{constructor(e=new bn,t=new bn,i=new bn,s=new bn,a=new bn,r=new bn){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ai,i=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],l=a[2],c=a[3],h=a[4],f=a[5],d=a[6],u=a[7],g=a[8],v=a[9],m=a[10],p=a[11],b=a[12],_=a[13],x=a[14],y=a[15];if(s[0].setComponents(c-r,u-h,p-g,y-b).normalize(),s[1].setComponents(c+r,u+h,p+g,y+b).normalize(),s[2].setComponents(c+o,u+f,p+v,y+_).normalize(),s[3].setComponents(c-o,u-f,p-v,y-_).normalize(),i)s[4].setComponents(l,d,m,x).normalize(),s[5].setComponents(c-l,u-d,p-m,y-x).normalize();else if(s[4].setComponents(c-l,u-d,p-m,y-x).normalize(),t===Ai)s[5].setComponents(c+l,u+d,p+m,y+x).normalize();else if(t===ks)s[5].setComponents(l,d,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Mn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Mn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Mn)}intersectsSprite(e){Mn.center.set(0,0,0);const t=cu.distanceTo(e.center);return Mn.radius=.7071067811865476+t,Mn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Mn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(ra.x=s.normal.x>0?e.max.x:e.min.x,ra.y=s.normal.y>0?e.max.y:e.min.y,ra.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ra)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Dh extends Xt{constructor(e=[],t=Nn,i,s,a,r,o,l,c,h){super(e,t,i,s,a,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class cs extends Xt{constructor(e,t,i=Di,s,a,r,o=Ft,l=Ft,c,h=Zi,f=1){if(h!==Zi&&h!==Pn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:f};super(d,s,a,r,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new cl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class hu extends cs{constructor(e,t=Di,i=Nn,s,a,r=Ft,o=Ft,l,c=Zi){const h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,i,s,a,r,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Nh extends Xt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class pn extends vi{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const l=[],c=[],h=[],f=[];let d=0,u=0;g("z","y","x",-1,-1,i,t,e,r,a,0),g("z","y","x",1,-1,i,t,-e,r,a,1),g("x","z","y",1,1,e,i,t,s,r,2),g("x","z","y",1,-1,e,i,-t,s,r,3),g("x","y","z",1,-1,e,t,i,s,a,4),g("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new qt(c,3)),this.setAttribute("normal",new qt(h,3)),this.setAttribute("uv",new qt(f,2));function g(v,m,p,b,_,x,y,E,P,S,w){const L=x/P,R=y/S,C=x/2,F=y/2,N=E/2,I=P+1,O=S+1;let B=0,K=0;const j=new V;for(let ee=0;ee<O;ee++){const ue=ee*R-F;for(let ge=0;ge<I;ge++){const De=ge*L-C;j[v]=De*b,j[m]=ue*_,j[p]=N,c.push(j.x,j.y,j.z),j[v]=0,j[m]=0,j[p]=E>0?1:-1,h.push(j.x,j.y,j.z),f.push(ge/P),f.push(1-ee/S),B+=1}}for(let ee=0;ee<S;ee++)for(let ue=0;ue<P;ue++){const ge=d+ue+I*ee,De=d+ue+I*(ee+1),Xe=d+(ue+1)+I*(ee+1),Pe=d+(ue+1)+I*ee;l.push(ge,De,Pe),l.push(De,Xe,Pe),K+=6}o.addGroup(u,K,w),u+=K,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class on extends vi{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const h=[],f=[],d=[],u=[];let g=0;const v=[],m=i/2;let p=0;b(),r===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new qt(f,3)),this.setAttribute("normal",new qt(d,3)),this.setAttribute("uv",new qt(u,2));function b(){const x=new V,y=new V;let E=0;const P=(t-e)/i;for(let S=0;S<=a;S++){const w=[],L=S/a,R=L*(t-e)+e;for(let C=0;C<=s;C++){const F=C/s,N=F*l+o,I=Math.sin(N),O=Math.cos(N);y.x=R*I,y.y=-L*i+m,y.z=R*O,f.push(y.x,y.y,y.z),x.set(I,P,O).normalize(),d.push(x.x,x.y,x.z),u.push(F,1-L),w.push(g++)}v.push(w)}for(let S=0;S<s;S++)for(let w=0;w<a;w++){const L=v[w][S],R=v[w+1][S],C=v[w+1][S+1],F=v[w][S+1];(e>0||w!==0)&&(h.push(L,R,F),E+=3),(t>0||w!==a-1)&&(h.push(R,C,F),E+=3)}c.addGroup(p,E,0),p+=E}function _(x){const y=g,E=new tt,P=new V;let S=0;const w=x===!0?e:t,L=x===!0?1:-1;for(let C=1;C<=s;C++)f.push(0,m*L,0),d.push(0,L,0),u.push(.5,.5),g++;const R=g;for(let C=0;C<=s;C++){const N=C/s*l+o,I=Math.cos(N),O=Math.sin(N);P.x=w*O,P.y=m*L,P.z=w*I,f.push(P.x,P.y,P.z),d.push(0,L,0),E.x=I*.5+.5,E.y=O*.5*L+.5,u.push(E.x,E.y),g++}for(let C=0;C<s;C++){const F=y+C,N=R+C;x===!0?h.push(N,N+1,F):h.push(N+1,N,F),S+=3}c.addGroup(p,S,x===!0?1:2),p+=S}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new on(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ka extends vi{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,f=e/o,d=t/l,u=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const b=p*d-r;for(let _=0;_<c;_++){const x=_*f-a;g.push(x,-b,0),v.push(0,0,1),m.push(_/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){const _=b+c*p,x=b+c*(p+1),y=b+1+c*(p+1),E=b+1+c*p;u.push(_,x,E),u.push(x,y,E)}this.setIndex(u),this.setAttribute("position",new qt(g,3)),this.setAttribute("normal",new qt(v,3)),this.setAttribute("uv",new qt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ka(e.width,e.height,e.widthSegments,e.heightSegments)}}class Va extends vi{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(r+o,Math.PI);let c=0;const h=[],f=new V,d=new V,u=[],g=[],v=[],m=[];for(let p=0;p<=i;p++){const b=[],_=p/i;let x=0;p===0&&r===0?x=.5/t:p===i&&l===Math.PI&&(x=-.5/t);for(let y=0;y<=t;y++){const E=y/t;f.x=-e*Math.cos(s+E*a)*Math.sin(r+_*o),f.y=e*Math.cos(r+_*o),f.z=e*Math.sin(s+E*a)*Math.sin(r+_*o),g.push(f.x,f.y,f.z),d.copy(f).normalize(),v.push(d.x,d.y,d.z),m.push(E+x,1-_),b.push(c++)}h.push(b)}for(let p=0;p<i;p++)for(let b=0;b<t;b++){const _=h[p][b+1],x=h[p][b],y=h[p+1][b],E=h[p+1][b+1];(p!==0||r>0)&&u.push(_,x,E),(p!==i-1||l<Math.PI)&&u.push(x,y,E)}this.setIndex(u),this.setAttribute("position",new qt(g,3)),this.setAttribute("normal",new qt(v,3)),this.setAttribute("uv",new qt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Va(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function hs(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(mc(s))s.isRenderTargetTexture?(Ce("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(mc(s[0])){const a=[];for(let r=0,o=s.length;r<o;r++)a[r]=s[r].clone();e[t][i]=a}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Gt(n){const e={};for(let t=0;t<n.length;t++){const i=hs(n[t]);for(const s in i)e[s]=i[s]}return e}function mc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function du(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function kh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}const fu={clone:hs,merge:Gt};var uu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ni extends Bs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=uu,this.fragmentShader=pu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=hs(e.uniforms),this.uniformsGroups=du(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class mu extends Ni{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Nr extends Bs{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new it(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new it(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zo,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class gu extends Bs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Af,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class yu extends Bs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Uh extends Wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new it(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const kr=new wt,gc=new V,yc=new V;class xu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tt(512,512),this.mapType=ii,this.map=null,this.mapPass=null,this.matrix=new wt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new dl,this._frameExtents=new tt(1,1),this._viewportCount=1,this._viewports=[new vt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;gc.setFromMatrixPosition(e.matrixWorld),t.position.copy(gc),yc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(yc),t.updateMatrixWorld(),kr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(kr,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===ks||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(kr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const oa=new V,la=new gs,bi=new V;class Fh extends Wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new wt,this.projectionMatrix=new wt,this.projectionMatrixInverse=new wt,this.coordinateSystem=Ai,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(oa,la,bi),bi.x===1&&bi.y===1&&bi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(oa,la,bi.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(oa,la,bi),bi.x===1&&bi.y===1&&bi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(oa,la,bi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const rn=new V,xc=new tt,_c=new tt;class ui extends Fh{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ho*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(hr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ho*2*Math.atan(Math.tan(hr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){rn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(rn.x,rn.y).multiplyScalar(-e/rn.z),rn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(rn.x,rn.y).multiplyScalar(-e/rn.z)}getViewSize(e,t){return this.getViewBounds(e,xc,_c),t.subVectors(_c,xc)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(hr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,t-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Za extends Fh{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class _u extends xu{constructor(){super(new Za(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class vc extends Uh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Wt.DEFAULT_UP),this.updateMatrix(),this.target=new Wt,this.shadow=new _u}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class vu extends Uh{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const jn=-90,Jn=1;class Su extends Wt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ui(jn,Jn,e,t);s.layers=this.layers,this.add(s);const a=new ui(jn,Jn,e,t);a.layers=this.layers,this.add(a);const r=new ui(jn,Jn,e,t);r.layers=this.layers,this.add(r);const o=new ui(jn,Jn,e,t);o.layers=this.layers,this.add(o);const l=new ui(jn,Jn,e,t);l.layers=this.layers,this.add(l);const c=new ui(jn,Jn,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,o,l]=t;for(const c of t)this.remove(c);if(e===Ai)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ks)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,c,h]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,d,u),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Mu extends ui{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Dl=class Dl{constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){const a=this.elements;return a[0]=e,a[2]=t,a[1]=i,a[3]=s,this}};Dl.prototype.isMatrix2=!0;let Sc=Dl;function Mc(n,e,t,i){const s=bu(i);switch(t){case Eh:return n*e;case wh:return n*e/s.components*s.byteLength;case sl:return n*e/s.components*s.byteLength;case kn:return n*e*2/s.components*s.byteLength;case al:return n*e*2/s.components*s.byteLength;case Th:return n*e*3/s.components*s.byteLength;case yi:return n*e*4/s.components*s.byteLength;case rl:return n*e*4/s.components*s.byteLength;case wa:case Aa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ra:case Pa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ho:case uo:return Math.max(n,16)*Math.max(e,8)/4;case co:case fo:return Math.max(n,8)*Math.max(e,8)/2;case po:case mo:case yo:case xo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case go:case Ua:case _o:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case vo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case So:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Mo:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case bo:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Eo:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case To:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case wo:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Ao:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ro:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Po:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Co:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Io:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Lo:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Do:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case No:case ko:case Uo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Fo:case Bo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Fa:case Oo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function bu(n){switch(n){case ii:case vh:return{byteLength:1,components:1};case Ds:case Sh:case Ki:return{byteLength:2,components:1};case il:case nl:return{byteLength:2,components:4};case Di:case tl:case wi:return{byteLength:4,components:1};case Mh:case bh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:el}}));typeof window<"u"&&(window.__THREE__?Ce("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=el);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Bh(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function Eu(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,o),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,g)=>u.start-g.start);let d=0;for(let u=1;u<f.length;u++){const g=f[d],v=f[u];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,f[d]=v)}f.length=d+1;for(let u=0,g=f.length;u<g;u++){const v=f[u];n.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var Tu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,wu=`#ifdef USE_ALPHAHASH
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
#endif`,Au=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ru=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Cu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Iu=`#ifdef USE_AOMAP
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
#endif`,Lu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Du=`#ifdef USE_BATCHING
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
#endif`,Nu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ku=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Uu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Fu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Bu=`#ifdef USE_IRIDESCENCE
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
#endif`,Ou=`#ifdef USE_BUMPMAP
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
#endif`,zu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Vu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Hu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Wu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Xu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,qu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Yu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,$u=`#define PI 3.141592653589793
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
} // validated`,Ku=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Zu=`vec3 transformedNormal = objectNormal;
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
#endif`,ju=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ju=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Qu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ep=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,tp="gl_FragColor = linearToOutputTexel( gl_FragColor );",ip=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,np=`#ifdef USE_ENVMAP
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
#endif`,sp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,ap=`#ifdef USE_ENVMAP
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
#endif`,rp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,op=`#ifdef USE_ENVMAP
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
#endif`,lp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,cp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,hp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,dp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,fp=`#ifdef USE_GRADIENTMAP
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
}`,up=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,pp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,mp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,gp=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,yp=`#ifdef USE_ENVMAP
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
#endif`,xp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_p=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,vp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Sp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Mp=`PhysicalMaterial material;
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
#endif`,bp=`uniform sampler2D dfgLUT;
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
}`,Ep=`
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
#endif`,Tp=`#if defined( RE_IndirectDiffuse )
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
#endif`,wp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ap=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Rp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ip=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Lp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Dp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Np=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,kp=`#if defined( USE_POINTS_UV )
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
#endif`,Up=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Fp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Bp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Op=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,zp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vp=`#ifdef USE_MORPHTARGETS
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
#endif`,Hp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Gp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Xp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,$p=`#ifdef USE_NORMALMAP
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
#endif`,Kp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,jp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Jp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Qp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,em=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,tm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,im=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,nm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,sm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,am=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,rm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,om=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,lm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,cm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,hm=`float getShadowMask() {
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
}`,dm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fm=`#ifdef USE_SKINNING
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
#endif`,um=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,pm=`#ifdef USE_SKINNING
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
#endif`,mm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ym=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,_m=`#ifdef USE_TRANSMISSION
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
#endif`,vm=`#ifdef USE_TRANSMISSION
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
#endif`,Sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Em=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Tm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,wm=`uniform sampler2D t2D;
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
}`,Am=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Pm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Im=`#include <common>
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
}`,Lm=`#if DEPTH_PACKING == 3200
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
}`,Dm=`#define DISTANCE
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
}`,Nm=`#define DISTANCE
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
}`,km=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Um=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fm=`uniform float scale;
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
}`,Bm=`uniform vec3 diffuse;
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
}`,Om=`#include <common>
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
}`,zm=`uniform vec3 diffuse;
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
}`,Vm=`#define LAMBERT
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
}`,Hm=`#define LAMBERT
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
}`,Wm=`#define MATCAP
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
}`,Gm=`#define MATCAP
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
}`,Xm=`#define NORMAL
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
}`,qm=`#define NORMAL
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
}`,Ym=`#define PHONG
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
}`,$m=`#define PHONG
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
}`,Km=`#define STANDARD
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
}`,Zm=`#define STANDARD
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
}`,jm=`#define TOON
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
}`,Jm=`#define TOON
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
}`,Qm=`uniform float size;
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
}`,e0=`uniform vec3 diffuse;
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
}`,t0=`#include <common>
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
}`,i0=`uniform vec3 color;
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
}`,n0=`uniform float rotation;
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
}`,s0=`uniform vec3 diffuse;
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
}`,ze={alphahash_fragment:Tu,alphahash_pars_fragment:wu,alphamap_fragment:Au,alphamap_pars_fragment:Ru,alphatest_fragment:Pu,alphatest_pars_fragment:Cu,aomap_fragment:Iu,aomap_pars_fragment:Lu,batching_pars_vertex:Du,batching_vertex:Nu,begin_vertex:ku,beginnormal_vertex:Uu,bsdfs:Fu,iridescence_fragment:Bu,bumpmap_pars_fragment:Ou,clipping_planes_fragment:zu,clipping_planes_pars_fragment:Vu,clipping_planes_pars_vertex:Hu,clipping_planes_vertex:Wu,color_fragment:Gu,color_pars_fragment:Xu,color_pars_vertex:qu,color_vertex:Yu,common:$u,cube_uv_reflection_fragment:Ku,defaultnormal_vertex:Zu,displacementmap_pars_vertex:ju,displacementmap_vertex:Ju,emissivemap_fragment:Qu,emissivemap_pars_fragment:ep,colorspace_fragment:tp,colorspace_pars_fragment:ip,envmap_fragment:np,envmap_common_pars_fragment:sp,envmap_pars_fragment:ap,envmap_pars_vertex:rp,envmap_physical_pars_fragment:yp,envmap_vertex:op,fog_vertex:lp,fog_pars_vertex:cp,fog_fragment:hp,fog_pars_fragment:dp,gradientmap_pars_fragment:fp,lightmap_pars_fragment:up,lights_lambert_fragment:pp,lights_lambert_pars_fragment:mp,lights_pars_begin:gp,lights_toon_fragment:xp,lights_toon_pars_fragment:_p,lights_phong_fragment:vp,lights_phong_pars_fragment:Sp,lights_physical_fragment:Mp,lights_physical_pars_fragment:bp,lights_fragment_begin:Ep,lights_fragment_maps:Tp,lights_fragment_end:wp,lightprobes_pars_fragment:Ap,logdepthbuf_fragment:Rp,logdepthbuf_pars_fragment:Pp,logdepthbuf_pars_vertex:Cp,logdepthbuf_vertex:Ip,map_fragment:Lp,map_pars_fragment:Dp,map_particle_fragment:Np,map_particle_pars_fragment:kp,metalnessmap_fragment:Up,metalnessmap_pars_fragment:Fp,morphinstance_vertex:Bp,morphcolor_vertex:Op,morphnormal_vertex:zp,morphtarget_pars_vertex:Vp,morphtarget_vertex:Hp,normal_fragment_begin:Wp,normal_fragment_maps:Gp,normal_pars_fragment:Xp,normal_pars_vertex:qp,normal_vertex:Yp,normalmap_pars_fragment:$p,clearcoat_normal_fragment_begin:Kp,clearcoat_normal_fragment_maps:Zp,clearcoat_pars_fragment:jp,iridescence_pars_fragment:Jp,opaque_fragment:Qp,packing:em,premultiplied_alpha_fragment:tm,project_vertex:im,dithering_fragment:nm,dithering_pars_fragment:sm,roughnessmap_fragment:am,roughnessmap_pars_fragment:rm,shadowmap_pars_fragment:om,shadowmap_pars_vertex:lm,shadowmap_vertex:cm,shadowmask_pars_fragment:hm,skinbase_vertex:dm,skinning_pars_vertex:fm,skinning_vertex:um,skinnormal_vertex:pm,specularmap_fragment:mm,specularmap_pars_fragment:gm,tonemapping_fragment:ym,tonemapping_pars_fragment:xm,transmission_fragment:_m,transmission_pars_fragment:vm,uv_pars_fragment:Sm,uv_pars_vertex:Mm,uv_vertex:bm,worldpos_vertex:Em,background_vert:Tm,background_frag:wm,backgroundCube_vert:Am,backgroundCube_frag:Rm,cube_vert:Pm,cube_frag:Cm,depth_vert:Im,depth_frag:Lm,distance_vert:Dm,distance_frag:Nm,equirect_vert:km,equirect_frag:Um,linedashed_vert:Fm,linedashed_frag:Bm,meshbasic_vert:Om,meshbasic_frag:zm,meshlambert_vert:Vm,meshlambert_frag:Hm,meshmatcap_vert:Wm,meshmatcap_frag:Gm,meshnormal_vert:Xm,meshnormal_frag:qm,meshphong_vert:Ym,meshphong_frag:$m,meshphysical_vert:Km,meshphysical_frag:Zm,meshtoon_vert:jm,meshtoon_frag:Jm,points_vert:Qm,points_frag:e0,shadow_vert:t0,shadow_frag:i0,sprite_vert:n0,sprite_frag:s0},de={common:{diffuse:{value:new it(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new it(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new it(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new it(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},Ti={basic:{uniforms:Gt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:Gt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new it(0)},envMapIntensity:{value:1}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:Gt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new it(0)},specular:{value:new it(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:Gt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new it(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:Gt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new it(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:Gt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:Gt([de.points,de.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:Gt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:Gt([de.common,de.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:Gt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:Gt([de.sprite,de.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distance:{uniforms:Gt([de.common,de.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distance_vert,fragmentShader:ze.distance_frag},shadow:{uniforms:Gt([de.lights,de.fog,{color:{value:new it(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};Ti.physical={uniforms:Gt([Ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new it(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new it(0)},specularColor:{value:new it(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const ca={r:0,b:0,g:0},a0=new wt,Oh=new Ne;Oh.set(-1,0,0,0,1,0,0,0,1);function r0(n,e,t,i,s,a){const r=new it(0);let o=s===!0?0:1,l,c,h=null,f=0,d=null;function u(b){let _=b.isScene===!0?b.background:null;if(_&&_.isTexture){const x=b.backgroundBlurriness>0;_=e.get(_,x)}return _}function g(b){let _=!1;const x=u(b);x===null?m(r,o):x&&x.isColor&&(m(x,1),_=!0);const y=n.xr.getEnvironmentBlendMode();y==="additive"?t.buffers.color.setClear(0,0,0,1,a):y==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,a),(n.autoClear||_)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function v(b,_){const x=u(_);x&&(x.isCubeTexture||x.mapping===$a)?(c===void 0&&(c=new ht(new pn(1,1,1),new Ni({name:"BackgroundCubeMaterial",uniforms:hs(Ti.backgroundCube.uniforms),vertexShader:Ti.backgroundCube.vertexShader,fragmentShader:Ti.backgroundCube.fragmentShader,side:Kt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(y,E,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(a0.makeRotationFromEuler(_.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Oh),c.material.toneMapped=Ye.getTransfer(x.colorSpace)!==st,(h!==x||f!==x.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,h=x,f=x.version,d=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new ht(new Ka(2,2),new Ni({name:"BackgroundMaterial",uniforms:hs(Ti.background.uniforms),vertexShader:Ti.background.vertexShader,fragmentShader:Ti.background.fragmentShader,side:mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=Ye.getTransfer(x.colorSpace)!==st,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||f!==x.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=x,f=x.version,d=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function m(b,_){b.getRGB(ca,kh(n)),t.buffers.color.setClear(ca.r,ca.g,ca.b,_,a)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(b,_=1){r.set(b),o=_,m(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,m(r,o)},render:g,addToRenderList:v,dispose:p}}function o0(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let a=s,r=!1;function o(R,C,F,N,I){let O=!1;const B=f(R,N,F,C);a!==B&&(a=B,c(a.object)),O=u(R,N,F,I),O&&g(R,N,F,I),I!==null&&e.update(I,n.ELEMENT_ARRAY_BUFFER),(O||r)&&(r=!1,x(R,C,F,N),I!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(I).buffer))}function l(){return n.createVertexArray()}function c(R){return n.bindVertexArray(R)}function h(R){return n.deleteVertexArray(R)}function f(R,C,F,N){const I=N.wireframe===!0;let O=i[C.id];O===void 0&&(O={},i[C.id]=O);const B=R.isInstancedMesh===!0?R.id:0;let K=O[B];K===void 0&&(K={},O[B]=K);let j=K[F.id];j===void 0&&(j={},K[F.id]=j);let ee=j[I];return ee===void 0&&(ee=d(l()),j[I]=ee),ee}function d(R){const C=[],F=[],N=[];for(let I=0;I<t;I++)C[I]=0,F[I]=0,N[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:F,attributeDivisors:N,object:R,attributes:{},index:null}}function u(R,C,F,N){const I=a.attributes,O=C.attributes;let B=0;const K=F.getAttributes();for(const j in K)if(K[j].location>=0){const ue=I[j];let ge=O[j];if(ge===void 0&&(j==="instanceMatrix"&&R.instanceMatrix&&(ge=R.instanceMatrix),j==="instanceColor"&&R.instanceColor&&(ge=R.instanceColor)),ue===void 0||ue.attribute!==ge||ge&&ue.data!==ge.data)return!0;B++}return a.attributesNum!==B||a.index!==N}function g(R,C,F,N){const I={},O=C.attributes;let B=0;const K=F.getAttributes();for(const j in K)if(K[j].location>=0){let ue=O[j];ue===void 0&&(j==="instanceMatrix"&&R.instanceMatrix&&(ue=R.instanceMatrix),j==="instanceColor"&&R.instanceColor&&(ue=R.instanceColor));const ge={};ge.attribute=ue,ue&&ue.data&&(ge.data=ue.data),I[j]=ge,B++}a.attributes=I,a.attributesNum=B,a.index=N}function v(){const R=a.newAttributes;for(let C=0,F=R.length;C<F;C++)R[C]=0}function m(R){p(R,0)}function p(R,C){const F=a.newAttributes,N=a.enabledAttributes,I=a.attributeDivisors;F[R]=1,N[R]===0&&(n.enableVertexAttribArray(R),N[R]=1),I[R]!==C&&(n.vertexAttribDivisor(R,C),I[R]=C)}function b(){const R=a.newAttributes,C=a.enabledAttributes;for(let F=0,N=C.length;F<N;F++)C[F]!==R[F]&&(n.disableVertexAttribArray(F),C[F]=0)}function _(R,C,F,N,I,O,B){B===!0?n.vertexAttribIPointer(R,C,F,I,O):n.vertexAttribPointer(R,C,F,N,I,O)}function x(R,C,F,N){v();const I=N.attributes,O=F.getAttributes(),B=C.defaultAttributeValues;for(const K in O){const j=O[K];if(j.location>=0){let ee=I[K];if(ee===void 0&&(K==="instanceMatrix"&&R.instanceMatrix&&(ee=R.instanceMatrix),K==="instanceColor"&&R.instanceColor&&(ee=R.instanceColor)),ee!==void 0){const ue=ee.normalized,ge=ee.itemSize,De=e.get(ee);if(De===void 0)continue;const Xe=De.buffer,Pe=De.type,Y=De.bytesPerElement,ae=Pe===n.INT||Pe===n.UNSIGNED_INT||ee.gpuType===tl;if(ee.isInterleavedBufferAttribute){const te=ee.data,we=te.stride,Ie=ee.offset;if(te.isInstancedInterleavedBuffer){for(let Re=0;Re<j.locationSize;Re++)p(j.location+Re,te.meshPerAttribute);R.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Re=0;Re<j.locationSize;Re++)m(j.location+Re);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let Re=0;Re<j.locationSize;Re++)_(j.location+Re,ge/j.locationSize,Pe,ue,we*Y,(Ie+ge/j.locationSize*Re)*Y,ae)}else{if(ee.isInstancedBufferAttribute){for(let te=0;te<j.locationSize;te++)p(j.location+te,ee.meshPerAttribute);R.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let te=0;te<j.locationSize;te++)m(j.location+te);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let te=0;te<j.locationSize;te++)_(j.location+te,ge/j.locationSize,Pe,ue,ge*Y,ge/j.locationSize*te*Y,ae)}}else if(B!==void 0){const ue=B[K];if(ue!==void 0)switch(ue.length){case 2:n.vertexAttrib2fv(j.location,ue);break;case 3:n.vertexAttrib3fv(j.location,ue);break;case 4:n.vertexAttrib4fv(j.location,ue);break;default:n.vertexAttrib1fv(j.location,ue)}}}}b()}function y(){w();for(const R in i){const C=i[R];for(const F in C){const N=C[F];for(const I in N){const O=N[I];for(const B in O)h(O[B].object),delete O[B];delete N[I]}}delete i[R]}}function E(R){if(i[R.id]===void 0)return;const C=i[R.id];for(const F in C){const N=C[F];for(const I in N){const O=N[I];for(const B in O)h(O[B].object),delete O[B];delete N[I]}}delete i[R.id]}function P(R){for(const C in i){const F=i[C];for(const N in F){const I=F[N];if(I[R.id]===void 0)continue;const O=I[R.id];for(const B in O)h(O[B].object),delete O[B];delete I[R.id]}}}function S(R){for(const C in i){const F=i[C],N=R.isInstancedMesh===!0?R.id:0,I=F[N];if(I!==void 0){for(const O in I){const B=I[O];for(const K in B)h(B[K].object),delete B[K];delete I[O]}delete F[N],Object.keys(F).length===0&&delete i[C]}}}function w(){L(),r=!0,a!==s&&(a=s,c(a.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:L,dispose:y,releaseStatesOfGeometry:E,releaseStatesOfObject:S,releaseStatesOfProgram:P,initAttributes:v,enableAttribute:m,disableUnusedAttributes:b}}function l0(n,e,t){let i;function s(l){i=l}function a(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function r(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let u=0;u<h;u++)d+=c[u];t.update(d,i,1)}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function c0(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(P){return!(P!==yi&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const S=P===Ki&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==ii&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==wi&&!S)}function l(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Ce("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Ce("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),y=n.getParameter(n.MAX_SAMPLES),E=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:u,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:_,maxFragmentUniforms:x,maxSamples:y,samples:E}}function h0(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new bn,o=new Ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||s;return s=d,i=f.length,u},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,d){t=h(f,d,0)},this.setState=function(f,d,u){const g=f.clippingPlanes,v=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!s||g===null||g.length===0||a&&!m)a?h(null):c();else{const b=a?0:i,_=b*4;let x=p.clippingState||null;l.value=x,x=h(g,d,_,u);for(let y=0;y!==_;++y)x[y]=t[y];p.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(f,d,u,g){const v=f!==null?f.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=u+v*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let _=0,x=u;_!==v;++_,x+=4)r.copy(f[_]).applyMatrix4(b,o),r.normal.toArray(m,x),m[x+3]=r.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}const hn=4,bc=[.125,.215,.35,.446,.526,.582],An=20,d0=256,Ts=new Za,Ec=new it;let Ur=null,Fr=0,Br=0,Or=!1;const f0=new V;class Tc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:o=f0}=a;Ur=this._renderer.getRenderTarget(),Fr=this._renderer.getActiveCubeFace(),Br=this._renderer.getActiveMipmapLevel(),Or=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Rc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ac(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Ur,Fr,Br),this._renderer.xr.enabled=Or,e.scissorTest=!1,Qn(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Nn||e.mapping===ls?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ur=this._renderer.getRenderTarget(),Fr=this._renderer.getActiveCubeFace(),Br=this._renderer.getActiveMipmapLevel(),Or=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Ht,minFilter:Ht,generateMipmaps:!1,type:Ki,format:yi,colorSpace:Ba,depthBuffer:!1},s=wc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wc(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=u0(a)),this._blurMaterial=m0(a,e,t),this._ggxMaterial=p0(a,e,t)}return s}_compileMaterial(e){const t=new ht(new vi,e);this._renderer.compile(t,Ts)}_sceneToCubeUV(e,t,i,s,a){const l=new ui(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,d=f.autoClear,u=f.toneMapping;f.getClearColor(Ec),f.toneMapping=Pi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ht(new pn,new Cs({name:"PMREM.Background",side:Kt,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let p=!1;const b=e.background;b?b.isColor&&(m.color.copy(b),e.background=null,p=!0):(m.color.copy(Ec),p=!0);for(let _=0;_<6;_++){const x=_%3;x===0?(l.up.set(0,c[_],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+h[_],a.y,a.z)):x===1?(l.up.set(0,0,c[_]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+h[_],a.z)):(l.up.set(0,c[_],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+h[_]));const y=this._cubeSize;Qn(s,x*y,_>2?y:0,y,y),f.setRenderTarget(s),p&&f.render(v,l),f.render(e,l)}f.toneMapping=u,f.autoClear=d,e.background=b}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Nn||e.mapping===ls;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Rc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ac());const a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;Qn(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(r,Ts)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;const l=r.uniforms,c=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),d=0+c*1.25,u=f*d,{_lodMax:g}=this,v=this._sizeLods[i],m=3*v*(i>g-hn?i-g+hn:0),p=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=u,l.mipInt.value=g-t,Qn(a,m,p,3*v,2*v),s.setRenderTarget(a),s.render(o,Ts),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=g-i,Qn(e,m,p,3*v,2*v),s.setRenderTarget(e),s.render(o,Ts)}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,o){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&Je("blur direction must be either latitudinal or longitudinal!");const h=3,f=this._lodMeshes[s];f.material=c;const d=c.uniforms,u=this._sizeLods[i]-1,g=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*An-1),v=a/g,m=isFinite(a)?1+Math.floor(h*v):An;m>An&&Ce(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${An}`);const p=[];let b=0;for(let P=0;P<An;++P){const S=P/v,w=Math.exp(-S*S/2);p.push(w),P===0?b+=w:P<m&&(b+=2*w)}for(let P=0;P<p.length;P++)p[P]=p[P]/b;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=r==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:_}=this;d.dTheta.value=g,d.mipInt.value=_-i;const x=this._sizeLods[s],y=3*x*(s>_-hn?s-_+hn:0),E=4*(this._cubeSize-x);Qn(t,y,E,3*x,2*x),l.setRenderTarget(t),l.render(f,Ts)}}function u0(n){const e=[],t=[],i=[];let s=n;const a=n-hn+1+bc.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let l=1/o;r>n-hn?l=bc[r-n+hn-1]:r===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,g=6,v=3,m=2,p=1,b=new Float32Array(v*g*u),_=new Float32Array(m*g*u),x=new Float32Array(p*g*u);for(let E=0;E<u;E++){const P=E%3*2/3-1,S=E>2?0:-1,w=[P,S,0,P+2/3,S,0,P+2/3,S+1,0,P,S,0,P+2/3,S+1,0,P,S+1,0];b.set(w,v*g*E),_.set(d,m*g*E);const L=[E,E,E,E,E,E];x.set(L,p*g*E)}const y=new vi;y.setAttribute("position",new Ii(b,v)),y.setAttribute("uv",new Ii(_,m)),y.setAttribute("faceIndex",new Ii(x,p)),i.push(new ht(y,null)),s>hn&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function wc(n,e,t){const i=new Ci(n,e,t);return i.texture.mapping=$a,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Qn(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function p0(n,e,t){return new Ni({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:d0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ja(),fragmentShader:`

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
		`,blending:Yi,depthTest:!1,depthWrite:!1})}function m0(n,e,t){const i=new Float32Array(An),s=new V(0,1,0);return new Ni({name:"SphericalGaussianBlur",defines:{n:An,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ja(),fragmentShader:`

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
		`,blending:Yi,depthTest:!1,depthWrite:!1})}function Ac(){return new Ni({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ja(),fragmentShader:`

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
		`,blending:Yi,depthTest:!1,depthWrite:!1})}function Rc(){return new Ni({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ja(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Yi,depthTest:!1,depthWrite:!1})}function ja(){return`

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
	`}class zh extends Ci{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Dh(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new pn(5,5,5),a=new Ni({name:"CubemapFromEquirect",uniforms:hs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Kt,blending:Yi});a.uniforms.tEquirect.value=t;const r=new ht(s,a),o=t.minFilter;return t.minFilter===Rn&&(t.minFilter=Ht),new Su(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}function g0(n){let e=new WeakMap,t=new WeakMap,i=null;function s(d,u=!1){return d==null?null:u?r(d):a(d)}function a(d){if(d&&d.isTexture){const u=d.mapping;if(u===or||u===lr)if(e.has(d)){const g=e.get(d).texture;return o(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const v=new zh(g.height);return v.fromEquirectangularTexture(n,d),e.set(d,v),d.addEventListener("dispose",c),o(v.texture,d.mapping)}else return null}}return d}function r(d){if(d&&d.isTexture){const u=d.mapping,g=u===or||u===lr,v=u===Nn||u===ls;if(g||v){let m=t.get(d);const p=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return i===null&&(i=new Tc(n)),m=g?i.fromEquirectangular(d,m):i.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{const b=d.image;return g&&b&&b.height>0||v&&b&&l(b)?(i===null&&(i=new Tc(n)),m=g?i.fromEquirectangular(d):i.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,u){return u===or?d.mapping=Nn:u===lr&&(d.mapping=ls),d}function l(d){let u=0;const g=6;for(let v=0;v<g;v++)d[v]!==void 0&&u++;return u===g}function c(d){const u=d.target;u.removeEventListener("dispose",c);const g=e.get(u);g!==void 0&&(e.delete(u),g.dispose())}function h(d){const u=d.target;u.removeEventListener("dispose",h);const g=t.get(u);g!==void 0&&(t.delete(u),g.dispose())}function f(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function y0(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Vo("WebGLRenderer: "+i+" extension not supported."),s}}}function x0(n,e,t,i){const s={},a=new WeakMap;function r(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",r),delete s[d.id];const u=a.get(d);u&&(e.remove(u),a.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(f,d){return s[d.id]===!0||(d.addEventListener("dispose",r),s[d.id]=!0,t.memory.geometries++),d}function l(f){const d=f.attributes;for(const u in d)e.update(d[u],n.ARRAY_BUFFER)}function c(f){const d=[],u=f.index,g=f.attributes.position;let v=0;if(g===void 0)return;if(u!==null){const b=u.array;v=u.version;for(let _=0,x=b.length;_<x;_+=3){const y=b[_+0],E=b[_+1],P=b[_+2];d.push(y,E,E,P,P,y)}}else{const b=g.array;v=g.version;for(let _=0,x=b.length/3-1;_<x;_+=3){const y=_+0,E=_+1,P=_+2;d.push(y,E,E,P,P,y)}}const m=new(g.count>=65535?Lh:Ih)(d,1);m.version=v;const p=a.get(f);p&&e.remove(p),a.set(f,m)}function h(f){const d=a.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return a.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function _0(n,e,t){let i;function s(f){i=f}let a,r;function o(f){a=f.type,r=f.bytesPerElement}function l(f,d){n.drawElements(i,d,a,f*r),t.update(d,i,1)}function c(f,d,u){u!==0&&(n.drawElementsInstanced(i,d,a,f*r,u),t.update(d,i,u))}function h(f,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,a,f,0,u);let v=0;for(let m=0;m<u;m++)v+=d[m];t.update(v,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function v0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:Je("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function S0(n,e,t){const i=new WeakMap,s=new vt;function a(r,o,l){const c=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==f){let L=function(){S.dispose(),i.delete(o),o.removeEventListener("dispose",L)};var u=L;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let x=0;g===!0&&(x=1),v===!0&&(x=2),m===!0&&(x=3);let y=o.attributes.position.count*x,E=1;y>e.maxTextureSize&&(E=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const P=new Float32Array(y*E*4*f),S=new Rh(P,y,E,f);S.type=wi,S.needsUpdate=!0;const w=x*4;for(let R=0;R<f;R++){const C=p[R],F=b[R],N=_[R],I=y*E*4*R;for(let O=0;O<C.count;O++){const B=O*w;g===!0&&(s.fromBufferAttribute(C,O),P[I+B+0]=s.x,P[I+B+1]=s.y,P[I+B+2]=s.z,P[I+B+3]=0),v===!0&&(s.fromBufferAttribute(F,O),P[I+B+4]=s.x,P[I+B+5]=s.y,P[I+B+6]=s.z,P[I+B+7]=0),m===!0&&(s.fromBufferAttribute(N,O),P[I+B+8]=s.x,P[I+B+9]=s.y,P[I+B+10]=s.z,P[I+B+11]=N.itemSize===4?s.w:1)}}d={count:f,texture:S,size:new tt(y,E)},i.set(o,d),o.addEventListener("dispose",L)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const v=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",v),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:a}}function M0(n,e,t,i,s){let a=new WeakMap;function r(c){const h=s.render.frame,f=c.geometry,d=e.get(c,f);if(a.get(d)!==h&&(e.update(d),a.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,h))),c.isSkinnedMesh){const u=c.skeleton;a.get(u)!==h&&(u.update(),a.set(u,h))}return d}function o(){a=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}const b0={[fh]:"LINEAR_TONE_MAPPING",[uh]:"REINHARD_TONE_MAPPING",[ph]:"CINEON_TONE_MAPPING",[mh]:"ACES_FILMIC_TONE_MAPPING",[yh]:"AGX_TONE_MAPPING",[xh]:"NEUTRAL_TONE_MAPPING",[gh]:"CUSTOM_TONE_MAPPING"};function E0(n,e,t,i,s){const a=new Ci(e,t,{type:n,depthBuffer:i,stencilBuffer:s,depthTexture:i?new cs(e,t):void 0}),r=new Ci(e,t,{type:Ki,depthBuffer:!1,stencilBuffer:!1}),o=new vi;o.setAttribute("position",new qt([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new qt([0,2,0,0,2,0],2));const l=new mu({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),c=new ht(o,l),h=new Za(-1,1,1,-1,0,1);let f=null,d=null,u=!1,g,v=null,m=[],p=!1;this.setSize=function(b,_){a.setSize(b,_),r.setSize(b,_);for(let x=0;x<m.length;x++){const y=m[x];y.setSize&&y.setSize(b,_)}},this.setEffects=function(b){m=b,p=m.length>0&&m[0].isRenderPass===!0;const _=a.width,x=a.height;for(let y=0;y<m.length;y++){const E=m[y];E.setSize&&E.setSize(_,x)}},this.begin=function(b,_){if(u||b.toneMapping===Pi&&m.length===0)return!1;if(v=_,_!==null){const x=_.width,y=_.height;(a.width!==x||a.height!==y)&&this.setSize(x,y)}return p===!1&&b.setRenderTarget(a),g=b.toneMapping,b.toneMapping=Pi,!0},this.hasRenderPass=function(){return p},this.end=function(b,_){b.toneMapping=g,u=!0;let x=a,y=r;for(let E=0;E<m.length;E++){const P=m[E];if(P.enabled!==!1&&(P.render(b,y,x,_),P.needsSwap!==!1)){const S=x;x=y,y=S}}if(f!==b.outputColorSpace||d!==b.toneMapping){f=b.outputColorSpace,d=b.toneMapping,l.defines={},Ye.getTransfer(f)===st&&(l.defines.SRGB_TRANSFER="");const E=b0[d];E&&(l.defines[E]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=x.texture,b.setRenderTarget(v),b.render(c,h),v=null,u=!1},this.isCompositing=function(){return u},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),r.dispose(),o.dispose(),l.dispose()}}const Vh=new Xt,Wo=new cs(1,1),Hh=new Rh,Wh=new Xf,Gh=new Dh,Pc=[],Cc=[],Ic=new Float32Array(16),Lc=new Float32Array(9),Dc=new Float32Array(4);function ys(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=Pc[s];if(a===void 0&&(a=new Float32Array(s),Pc[s]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,n[r].toArray(a,o)}return a}function Lt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Dt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ja(n,e){let t=Cc[e];t===void 0&&(t=new Int32Array(e),Cc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function T0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function w0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2fv(this.addr,e),Dt(t,e)}}function A0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;n.uniform3fv(this.addr,e),Dt(t,e)}}function R0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4fv(this.addr,e),Dt(t,e)}}function P0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;Dc.set(i),n.uniformMatrix2fv(this.addr,!1,Dc),Dt(t,i)}}function C0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;Lc.set(i),n.uniformMatrix3fv(this.addr,!1,Lc),Dt(t,i)}}function I0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;Ic.set(i),n.uniformMatrix4fv(this.addr,!1,Ic),Dt(t,i)}}function L0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function D0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2iv(this.addr,e),Dt(t,e)}}function N0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3iv(this.addr,e),Dt(t,e)}}function k0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4iv(this.addr,e),Dt(t,e)}}function U0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function F0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2uiv(this.addr,e),Dt(t,e)}}function B0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3uiv(this.addr,e),Dt(t,e)}}function O0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4uiv(this.addr,e),Dt(t,e)}}function z0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Wo.compareFunction=t.isReversedDepthBuffer()?ll:ol,a=Wo):a=Vh,t.setTexture2D(e||a,s)}function V0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Wh,s)}function H0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Gh,s)}function W0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Hh,s)}function G0(n){switch(n){case 5126:return T0;case 35664:return w0;case 35665:return A0;case 35666:return R0;case 35674:return P0;case 35675:return C0;case 35676:return I0;case 5124:case 35670:return L0;case 35667:case 35671:return D0;case 35668:case 35672:return N0;case 35669:case 35673:return k0;case 5125:return U0;case 36294:return F0;case 36295:return B0;case 36296:return O0;case 35678:case 36198:case 36298:case 36306:case 35682:return z0;case 35679:case 36299:case 36307:return V0;case 35680:case 36300:case 36308:case 36293:return H0;case 36289:case 36303:case 36311:case 36292:return W0}}function X0(n,e){n.uniform1fv(this.addr,e)}function q0(n,e){const t=ys(e,this.size,2);n.uniform2fv(this.addr,t)}function Y0(n,e){const t=ys(e,this.size,3);n.uniform3fv(this.addr,t)}function $0(n,e){const t=ys(e,this.size,4);n.uniform4fv(this.addr,t)}function K0(n,e){const t=ys(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Z0(n,e){const t=ys(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function j0(n,e){const t=ys(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function J0(n,e){n.uniform1iv(this.addr,e)}function Q0(n,e){n.uniform2iv(this.addr,e)}function eg(n,e){n.uniform3iv(this.addr,e)}function tg(n,e){n.uniform4iv(this.addr,e)}function ig(n,e){n.uniform1uiv(this.addr,e)}function ng(n,e){n.uniform2uiv(this.addr,e)}function sg(n,e){n.uniform3uiv(this.addr,e)}function ag(n,e){n.uniform4uiv(this.addr,e)}function rg(n,e,t){const i=this.cache,s=e.length,a=Ja(t,s);Lt(i,a)||(n.uniform1iv(this.addr,a),Dt(i,a));let r;this.type===n.SAMPLER_2D_SHADOW?r=Wo:r=Vh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||r,a[o])}function og(n,e,t){const i=this.cache,s=e.length,a=Ja(t,s);Lt(i,a)||(n.uniform1iv(this.addr,a),Dt(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||Wh,a[r])}function lg(n,e,t){const i=this.cache,s=e.length,a=Ja(t,s);Lt(i,a)||(n.uniform1iv(this.addr,a),Dt(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||Gh,a[r])}function cg(n,e,t){const i=this.cache,s=e.length,a=Ja(t,s);Lt(i,a)||(n.uniform1iv(this.addr,a),Dt(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||Hh,a[r])}function hg(n){switch(n){case 5126:return X0;case 35664:return q0;case 35665:return Y0;case 35666:return $0;case 35674:return K0;case 35675:return Z0;case 35676:return j0;case 5124:case 35670:return J0;case 35667:case 35671:return Q0;case 35668:case 35672:return eg;case 35669:case 35673:return tg;case 5125:return ig;case 36294:return ng;case 36295:return sg;case 36296:return ag;case 35678:case 36198:case 36298:case 36306:case 35682:return rg;case 35679:case 36299:case 36307:return og;case 35680:case 36300:case 36308:case 36293:return lg;case 36289:case 36303:case 36311:case 36292:return cg}}class dg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=G0(t.type)}}class fg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=hg(t.type)}}class ug{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],i)}}}const zr=/(\w+)(\])?(\[|\.)?/g;function Nc(n,e){n.seq.push(e),n.map[e.id]=e}function pg(n,e,t){const i=n.name,s=i.length;for(zr.lastIndex=0;;){const a=zr.exec(i),r=zr.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){Nc(t,c===void 0?new dg(o,n,e):new fg(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new ug(o),Nc(t,f)),t=f}}}class Ca{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const o=e.getActiveUniform(t,r),l=e.getUniformLocation(t,o.name);pg(o,l,this)}const s=[],a=[];for(const r of this.seq)r.type===e.SAMPLER_2D_SHADOW||r.type===e.SAMPLER_CUBE_SHADOW||r.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(r):a.push(r);s.length>0&&(this.seq=s.concat(a))}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function kc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const mg=37297;let gg=0;function yg(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const Uc=new Ne;function xg(n){Ye._getMatrix(Uc,Ye.workingColorSpace,n);const e=`mat3( ${Uc.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(n)){case Oa:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return Ce("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Fc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+yg(n.getShaderSource(e),o)}else return a}function _g(n,e){const t=xg(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const vg={[fh]:"Linear",[uh]:"Reinhard",[ph]:"Cineon",[mh]:"ACESFilmic",[yh]:"AgX",[xh]:"Neutral",[gh]:"Custom"};function Sg(n,e){const t=vg[e];return t===void 0?(Ce("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ha=new V;function Mg(){Ye.getLuminanceCoefficients(ha);const n=ha.x.toFixed(4),e=ha.y.toFixed(4),t=ha.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function bg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ps).join(`
`)}function Eg(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Tg(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:o}}return t}function Ps(n){return n!==""}function Bc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Oc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const wg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Go(n){return n.replace(wg,Rg)}const Ag=new Map;function Rg(n,e){let t=ze[e];if(t===void 0){const i=Ag.get(e);if(i!==void 0)t=ze[i],Ce('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Go(t)}const Pg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zc(n){return n.replace(Pg,Cg)}function Cg(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Vc(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const Ig={[Ta]:"SHADOWMAP_TYPE_PCF",[Rs]:"SHADOWMAP_TYPE_VSM"};function Lg(n){return Ig[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Dg={[Nn]:"ENVMAP_TYPE_CUBE",[ls]:"ENVMAP_TYPE_CUBE",[$a]:"ENVMAP_TYPE_CUBE_UV"};function Ng(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":Dg[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const kg={[ls]:"ENVMAP_MODE_REFRACTION"};function Ug(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":kg[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Fg={[dh]:"ENVMAP_BLENDING_MULTIPLY",[Ef]:"ENVMAP_BLENDING_MIX",[Tf]:"ENVMAP_BLENDING_ADD"};function Bg(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Fg[n.combine]||"ENVMAP_BLENDING_NONE"}function Og(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function zg(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const l=Lg(t),c=Ng(t),h=Ug(t),f=Bg(t),d=Og(t),u=bg(t),g=Eg(a),v=s.createProgram();let m,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ps).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ps).join(`
`),p.length>0&&(p+=`
`)):(m=[Vc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ps).join(`
`),p=[Vc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Pi?"#define TONE_MAPPING":"",t.toneMapping!==Pi?ze.tonemapping_pars_fragment:"",t.toneMapping!==Pi?Sg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,_g("linearToOutputTexel",t.outputColorSpace),Mg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ps).join(`
`)),r=Go(r),r=Bc(r,t),r=Oc(r,t),o=Go(o),o=Bc(o,t),o=Oc(o,t),r=zc(r),o=zc(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Jl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Jl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const _=b+m+r,x=b+p+o,y=kc(s,s.VERTEX_SHADER,_),E=kc(s,s.FRAGMENT_SHADER,x);s.attachShader(v,y),s.attachShader(v,E),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function P(R){if(n.debug.checkShaderErrors){const C=s.getProgramInfoLog(v)||"",F=s.getShaderInfoLog(y)||"",N=s.getShaderInfoLog(E)||"",I=C.trim(),O=F.trim(),B=N.trim();let K=!0,j=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(K=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,y,E);else{const ee=Fc(s,y,"vertex"),ue=Fc(s,E,"fragment");Je("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+I+`
`+ee+`
`+ue)}else I!==""?Ce("WebGLProgram: Program Info Log:",I):(O===""||B==="")&&(j=!1);j&&(R.diagnostics={runnable:K,programLog:I,vertexShader:{log:O,prefix:m},fragmentShader:{log:B,prefix:p}})}s.deleteShader(y),s.deleteShader(E),S=new Ca(s,v),w=Tg(s,v)}let S;this.getUniforms=function(){return S===void 0&&P(this),S};let w;this.getAttributes=function(){return w===void 0&&P(this),w};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(v,mg)),L},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=gg++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=y,this.fragmentShader=E,this}let Vg=0;class Hg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Wg(e),t.set(e,i)),i}}class Wg{constructor(e){this.id=Vg++,this.code=e,this.usedTimes=0}}function Gg(n){return n===kn||n===Ua||n===Fa}function Xg(n,e,t,i,s,a){const r=new Ph,o=new Hg,l=new Set,c=[],h=new Map,f=i.logarithmicDepthBuffer;let d=i.precision;const u={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return l.add(S),S===0?"uv":`uv${S}`}function v(S,w,L,R,C,F){const N=R.fog,I=C.geometry,O=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?R.environment:null,B=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap,K=e.get(S.envMap||O,B),j=K&&K.mapping===$a?K.image.height:null,ee=u[S.type];S.precision!==null&&(d=i.getMaxPrecision(S.precision),d!==S.precision&&Ce("WebGLProgram.getParameters:",S.precision,"not supported, using",d,"instead."));const ue=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,ge=ue!==void 0?ue.length:0;let De=0;I.morphAttributes.position!==void 0&&(De=1),I.morphAttributes.normal!==void 0&&(De=2),I.morphAttributes.color!==void 0&&(De=3);let Xe,Pe,Y,ae;if(ee){const ke=Ti[ee];Xe=ke.vertexShader,Pe=ke.fragmentShader}else Xe=S.vertexShader,Pe=S.fragmentShader,o.update(S),Y=o.getVertexShaderID(S),ae=o.getFragmentShaderID(S);const te=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),Ie=C.isInstancedMesh===!0,Re=C.isBatchedMesh===!0,nt=!!S.map,Be=!!S.matcap,Ze=!!K,ut=!!S.aoMap,He=!!S.lightMap,Pt=!!S.bumpMap,gt=!!S.normalMap,Zt=!!S.displacementMap,k=!!S.emissiveMap,Ct=!!S.metalnessMap,Ge=!!S.roughnessMap,dt=S.anisotropy>0,he=S.clearcoat>0,xt=S.dispersion>0,A=S.iridescence>0,M=S.sheen>0,z=S.transmission>0,$=dt&&!!S.anisotropyMap,Q=he&&!!S.clearcoatMap,ie=he&&!!S.clearcoatNormalMap,le=he&&!!S.clearcoatRoughnessMap,X=A&&!!S.iridescenceMap,Z=A&&!!S.iridescenceThicknessMap,me=M&&!!S.sheenColorMap,_e=M&&!!S.sheenRoughnessMap,re=!!S.specularMap,ne=!!S.specularColorMap,Le=!!S.specularIntensityMap,Oe=z&&!!S.transmissionMap,Qe=z&&!!S.thicknessMap,D=!!S.gradientMap,se=!!S.alphaMap,q=S.alphaTest>0,ye=!!S.alphaHash,oe=!!S.extensions;let J=Pi;S.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(J=n.toneMapping);const Ee={shaderID:ee,shaderType:S.type,shaderName:S.name,vertexShader:Xe,fragmentShader:Pe,defines:S.defines,customVertexShaderID:Y,customFragmentShaderID:ae,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:d,batching:Re,batchingColor:Re&&C._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&C.instanceColor!==null,instancingMorph:Ie&&C.morphTexture!==null,outputColorSpace:te===null?n.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Ye.workingColorSpace,alphaToCoverage:!!S.alphaToCoverage,map:nt,matcap:Be,envMap:Ze,envMapMode:Ze&&K.mapping,envMapCubeUVHeight:j,aoMap:ut,lightMap:He,bumpMap:Pt,normalMap:gt,displacementMap:Zt,emissiveMap:k,normalMapObjectSpace:gt&&S.normalMapType===Rf,normalMapTangentSpace:gt&&S.normalMapType===zo,packedNormalMap:gt&&S.normalMapType===zo&&Gg(S.normalMap.format),metalnessMap:Ct,roughnessMap:Ge,anisotropy:dt,anisotropyMap:$,clearcoat:he,clearcoatMap:Q,clearcoatNormalMap:ie,clearcoatRoughnessMap:le,dispersion:xt,iridescence:A,iridescenceMap:X,iridescenceThicknessMap:Z,sheen:M,sheenColorMap:me,sheenRoughnessMap:_e,specularMap:re,specularColorMap:ne,specularIntensityMap:Le,transmission:z,transmissionMap:Oe,thicknessMap:Qe,gradientMap:D,opaque:S.transparent===!1&&S.blending===ss&&S.alphaToCoverage===!1,alphaMap:se,alphaTest:q,alphaHash:ye,combine:S.combine,mapUv:nt&&g(S.map.channel),aoMapUv:ut&&g(S.aoMap.channel),lightMapUv:He&&g(S.lightMap.channel),bumpMapUv:Pt&&g(S.bumpMap.channel),normalMapUv:gt&&g(S.normalMap.channel),displacementMapUv:Zt&&g(S.displacementMap.channel),emissiveMapUv:k&&g(S.emissiveMap.channel),metalnessMapUv:Ct&&g(S.metalnessMap.channel),roughnessMapUv:Ge&&g(S.roughnessMap.channel),anisotropyMapUv:$&&g(S.anisotropyMap.channel),clearcoatMapUv:Q&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:ie&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:le&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:X&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:me&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:_e&&g(S.sheenRoughnessMap.channel),specularMapUv:re&&g(S.specularMap.channel),specularColorMapUv:ne&&g(S.specularColorMap.channel),specularIntensityMapUv:Le&&g(S.specularIntensityMap.channel),transmissionMapUv:Oe&&g(S.transmissionMap.channel),thicknessMapUv:Qe&&g(S.thicknessMap.channel),alphaMapUv:se&&g(S.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(gt||dt),vertexNormals:!!I.attributes.normal,vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!I.attributes.uv&&(nt||se),fog:!!N,useFog:S.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:S.wireframe===!1&&(S.flatShading===!0||I.attributes.normal===void 0&&gt===!1&&(S.isMeshLambertMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isMeshPhysicalMaterial)),sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:we,skinning:C.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:ge,morphTextureStride:De,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:F.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:J,decodeVideoTexture:nt&&S.map.isVideoTexture===!0&&Ye.getTransfer(S.map.colorSpace)===st,decodeVideoTextureEmissive:k&&S.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(S.emissiveMap.colorSpace)===st,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Gi,flipSided:S.side===Kt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:oe&&S.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(oe&&S.extensions.multiDraw===!0||Re)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Ee.vertexUv1s=l.has(1),Ee.vertexUv2s=l.has(2),Ee.vertexUv3s=l.has(3),l.clear(),Ee}function m(S){const w=[];if(S.shaderID?w.push(S.shaderID):(w.push(S.customVertexShaderID),w.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)w.push(L),w.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(p(w,S),b(w,S),w.push(n.outputColorSpace)),w.push(S.customProgramCacheKey),w.join()}function p(S,w){S.push(w.precision),S.push(w.outputColorSpace),S.push(w.envMapMode),S.push(w.envMapCubeUVHeight),S.push(w.mapUv),S.push(w.alphaMapUv),S.push(w.lightMapUv),S.push(w.aoMapUv),S.push(w.bumpMapUv),S.push(w.normalMapUv),S.push(w.displacementMapUv),S.push(w.emissiveMapUv),S.push(w.metalnessMapUv),S.push(w.roughnessMapUv),S.push(w.anisotropyMapUv),S.push(w.clearcoatMapUv),S.push(w.clearcoatNormalMapUv),S.push(w.clearcoatRoughnessMapUv),S.push(w.iridescenceMapUv),S.push(w.iridescenceThicknessMapUv),S.push(w.sheenColorMapUv),S.push(w.sheenRoughnessMapUv),S.push(w.specularMapUv),S.push(w.specularColorMapUv),S.push(w.specularIntensityMapUv),S.push(w.transmissionMapUv),S.push(w.thicknessMapUv),S.push(w.combine),S.push(w.fogExp2),S.push(w.sizeAttenuation),S.push(w.morphTargetsCount),S.push(w.morphAttributeCount),S.push(w.numDirLights),S.push(w.numPointLights),S.push(w.numSpotLights),S.push(w.numSpotLightMaps),S.push(w.numHemiLights),S.push(w.numRectAreaLights),S.push(w.numDirLightShadows),S.push(w.numPointLightShadows),S.push(w.numSpotLightShadows),S.push(w.numSpotLightShadowsWithMaps),S.push(w.numLightProbes),S.push(w.shadowMapType),S.push(w.toneMapping),S.push(w.numClippingPlanes),S.push(w.numClipIntersection),S.push(w.depthPacking)}function b(S,w){r.disableAll(),w.instancing&&r.enable(0),w.instancingColor&&r.enable(1),w.instancingMorph&&r.enable(2),w.matcap&&r.enable(3),w.envMap&&r.enable(4),w.normalMapObjectSpace&&r.enable(5),w.normalMapTangentSpace&&r.enable(6),w.clearcoat&&r.enable(7),w.iridescence&&r.enable(8),w.alphaTest&&r.enable(9),w.vertexColors&&r.enable(10),w.vertexAlphas&&r.enable(11),w.vertexUv1s&&r.enable(12),w.vertexUv2s&&r.enable(13),w.vertexUv3s&&r.enable(14),w.vertexTangents&&r.enable(15),w.anisotropy&&r.enable(16),w.alphaHash&&r.enable(17),w.batching&&r.enable(18),w.dispersion&&r.enable(19),w.batchingColor&&r.enable(20),w.gradientMap&&r.enable(21),w.packedNormalMap&&r.enable(22),w.vertexNormals&&r.enable(23),S.push(r.mask),r.disableAll(),w.fog&&r.enable(0),w.useFog&&r.enable(1),w.flatShading&&r.enable(2),w.logarithmicDepthBuffer&&r.enable(3),w.reversedDepthBuffer&&r.enable(4),w.skinning&&r.enable(5),w.morphTargets&&r.enable(6),w.morphNormals&&r.enable(7),w.morphColors&&r.enable(8),w.premultipliedAlpha&&r.enable(9),w.shadowMapEnabled&&r.enable(10),w.doubleSided&&r.enable(11),w.flipSided&&r.enable(12),w.useDepthPacking&&r.enable(13),w.dithering&&r.enable(14),w.transmission&&r.enable(15),w.sheen&&r.enable(16),w.opaque&&r.enable(17),w.pointsUvs&&r.enable(18),w.decodeVideoTexture&&r.enable(19),w.decodeVideoTextureEmissive&&r.enable(20),w.alphaToCoverage&&r.enable(21),w.numLightProbeGrids>0&&r.enable(22),S.push(r.mask)}function _(S){const w=u[S.type];let L;if(w){const R=Ti[w];L=fu.clone(R.uniforms)}else L=S.uniforms;return L}function x(S,w){let L=h.get(w);return L!==void 0?++L.usedTimes:(L=new zg(n,w,S,s),c.push(L),h.set(w,L)),L}function y(S){if(--S.usedTimes===0){const w=c.indexOf(S);c[w]=c[c.length-1],c.pop(),h.delete(S.cacheKey),S.destroy()}}function E(S){o.remove(S)}function P(){o.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:_,acquireProgram:x,releaseProgram:y,releaseShaderCache:E,programs:c,dispose:P}}function qg(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,l){n.get(r)[o]=l}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function Yg(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Hc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Wc(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(d){let u=0;return d.isInstancedMesh&&(u+=2),d.isSkinnedMesh&&(u+=1),u}function o(d,u,g,v,m,p){let b=n[e];return b===void 0?(b={id:d.id,object:d,geometry:u,material:g,materialVariant:r(d),groupOrder:v,renderOrder:d.renderOrder,z:m,group:p},n[e]=b):(b.id=d.id,b.object=d,b.geometry=u,b.material=g,b.materialVariant=r(d),b.groupOrder=v,b.renderOrder=d.renderOrder,b.z=m,b.group=p),e++,b}function l(d,u,g,v,m,p){const b=o(d,u,g,v,m,p);g.transmission>0?i.push(b):g.transparent===!0?s.push(b):t.push(b)}function c(d,u,g,v,m,p){const b=o(d,u,g,v,m,p);g.transmission>0?i.unshift(b):g.transparent===!0?s.unshift(b):t.unshift(b)}function h(d,u){t.length>1&&t.sort(d||Yg),i.length>1&&i.sort(u||Hc),s.length>1&&s.sort(u||Hc)}function f(){for(let d=e,u=n.length;d<u;d++){const g=n[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:l,unshift:c,finish:f,sort:h}}function $g(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new Wc,n.set(i,[r])):s>=a.length?(r=new Wc,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function Kg(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new V,color:new it};break;case"SpotLight":t={position:new V,direction:new V,color:new it,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new V,color:new it,distance:0,decay:0};break;case"HemisphereLight":t={direction:new V,skyColor:new it,groundColor:new it};break;case"RectAreaLight":t={color:new it,position:new V,halfWidth:new V,halfHeight:new V};break}return n[e.id]=t,t}}}function Zg(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let jg=0;function Jg(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Qg(n){const e=new Kg,t=Zg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);const s=new V,a=new wt,r=new wt;function o(c){let h=0,f=0,d=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let u=0,g=0,v=0,m=0,p=0,b=0,_=0,x=0,y=0,E=0,P=0;c.sort(Jg);for(let w=0,L=c.length;w<L;w++){const R=c[w],C=R.color,F=R.intensity,N=R.distance;let I=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===kn?I=R.shadow.map.texture:I=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=C.r*F,f+=C.g*F,d+=C.b*F;else if(R.isLightProbe){for(let O=0;O<9;O++)i.probe[O].addScaledVector(R.sh.coefficients[O],F);P++}else if(R.isDirectionalLight){const O=e.get(R);if(O.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const B=R.shadow,K=t.get(R);K.shadowIntensity=B.intensity,K.shadowBias=B.bias,K.shadowNormalBias=B.normalBias,K.shadowRadius=B.radius,K.shadowMapSize=B.mapSize,i.directionalShadow[u]=K,i.directionalShadowMap[u]=I,i.directionalShadowMatrix[u]=R.shadow.matrix,b++}i.directional[u]=O,u++}else if(R.isSpotLight){const O=e.get(R);O.position.setFromMatrixPosition(R.matrixWorld),O.color.copy(C).multiplyScalar(F),O.distance=N,O.coneCos=Math.cos(R.angle),O.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),O.decay=R.decay,i.spot[v]=O;const B=R.shadow;if(R.map&&(i.spotLightMap[y]=R.map,y++,B.updateMatrices(R),R.castShadow&&E++),i.spotLightMatrix[v]=B.matrix,R.castShadow){const K=t.get(R);K.shadowIntensity=B.intensity,K.shadowBias=B.bias,K.shadowNormalBias=B.normalBias,K.shadowRadius=B.radius,K.shadowMapSize=B.mapSize,i.spotShadow[v]=K,i.spotShadowMap[v]=I,x++}v++}else if(R.isRectAreaLight){const O=e.get(R);O.color.copy(C).multiplyScalar(F),O.halfWidth.set(R.width*.5,0,0),O.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=O,m++}else if(R.isPointLight){const O=e.get(R);if(O.color.copy(R.color).multiplyScalar(R.intensity),O.distance=R.distance,O.decay=R.decay,R.castShadow){const B=R.shadow,K=t.get(R);K.shadowIntensity=B.intensity,K.shadowBias=B.bias,K.shadowNormalBias=B.normalBias,K.shadowRadius=B.radius,K.shadowMapSize=B.mapSize,K.shadowCameraNear=B.camera.near,K.shadowCameraFar=B.camera.far,i.pointShadow[g]=K,i.pointShadowMap[g]=I,i.pointShadowMatrix[g]=R.shadow.matrix,_++}i.point[g]=O,g++}else if(R.isHemisphereLight){const O=e.get(R);O.skyColor.copy(R.color).multiplyScalar(F),O.groundColor.copy(R.groundColor).multiplyScalar(F),i.hemi[p]=O,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=de.LTC_FLOAT_1,i.rectAreaLTC2=de.LTC_FLOAT_2):(i.rectAreaLTC1=de.LTC_HALF_1,i.rectAreaLTC2=de.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const S=i.hash;(S.directionalLength!==u||S.pointLength!==g||S.spotLength!==v||S.rectAreaLength!==m||S.hemiLength!==p||S.numDirectionalShadows!==b||S.numPointShadows!==_||S.numSpotShadows!==x||S.numSpotMaps!==y||S.numLightProbes!==P)&&(i.directional.length=u,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=x+y-E,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=P,S.directionalLength=u,S.pointLength=g,S.spotLength=v,S.rectAreaLength=m,S.hemiLength=p,S.numDirectionalShadows=b,S.numPointShadows=_,S.numSpotShadows=x,S.numSpotMaps=y,S.numLightProbes=P,i.version=jg++)}function l(c,h){let f=0,d=0,u=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){const _=c[p];if(_.isDirectionalLight){const x=i.directional[f];x.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),f++}else if(_.isSpotLight){const x=i.spot[u];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),u++}else if(_.isRectAreaLight){const x=i.rectArea[g];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),r.identity(),a.copy(_.matrixWorld),a.premultiply(m),r.extractRotation(a),x.halfWidth.set(_.width*.5,0,0),x.halfHeight.set(0,_.height*.5,0),x.halfWidth.applyMatrix4(r),x.halfHeight.applyMatrix4(r),g++}else if(_.isPointLight){const x=i.point[d];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),d++}else if(_.isHemisphereLight){const x=i.hemi[v];x.direction.setFromMatrixPosition(_.matrixWorld),x.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:i}}function Gc(n){const e=new Qg(n),t=[],i=[],s=[];function a(d){f.camera=d,t.length=0,i.length=0,s.length=0}function r(d){t.push(d)}function o(d){i.push(d)}function l(d){s.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const f={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:f,setupLights:c,setupLightsView:h,pushLight:r,pushShadow:o,pushLightProbeGrid:l}}function ey(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new Gc(n),e.set(s,[o])):a>=r.length?(o=new Gc(n),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const ty=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,iy=`uniform sampler2D shadow_pass;
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
}`,ny=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],sy=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],Xc=new wt,ws=new V,Vr=new V;function ay(n,e,t){let i=new dl;const s=new tt,a=new tt,r=new vt,o=new gu,l=new yu,c={},h=t.maxTextureSize,f={[mn]:Kt,[Kt]:mn,[Gi]:Gi},d=new Ni({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:ty,fragmentShader:iy}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const g=new vi;g.setAttribute("position",new Ii(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ht(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ta;let p=this.type;this.render=function(E,P,S){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;this.type===af&&(Ce("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Ta);const w=n.getRenderTarget(),L=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),C=n.state;C.setBlending(Yi),C.buffers.depth.getReversed()===!0?C.buffers.color.setClear(0,0,0,0):C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);const F=p!==this.type;F&&P.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(I=>I.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,I=E.length;N<I;N++){const O=E[N],B=O.shadow;if(B===void 0){Ce("WebGLShadowMap:",O,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const K=B.getFrameExtents();s.multiply(K),a.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/K.x),s.x=a.x*K.x,B.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/K.y),s.y=a.y*K.y,B.mapSize.y=a.y));const j=n.state.buffers.depth.getReversed();if(B.camera._reversedDepth=j,B.map===null||F===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Rs){if(O.isPointLight){Ce("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new Ci(s.x,s.y,{format:kn,type:Ki,minFilter:Ht,magFilter:Ht,generateMipmaps:!1}),B.map.texture.name=O.name+".shadowMap",B.map.depthTexture=new cs(s.x,s.y,wi),B.map.depthTexture.name=O.name+".shadowMapDepth",B.map.depthTexture.format=Zi,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Ft,B.map.depthTexture.magFilter=Ft}else O.isPointLight?(B.map=new zh(s.x),B.map.depthTexture=new hu(s.x,Di)):(B.map=new Ci(s.x,s.y),B.map.depthTexture=new cs(s.x,s.y,Di)),B.map.depthTexture.name=O.name+".shadowMap",B.map.depthTexture.format=Zi,this.type===Ta?(B.map.depthTexture.compareFunction=j?ll:ol,B.map.depthTexture.minFilter=Ht,B.map.depthTexture.magFilter=Ht):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Ft,B.map.depthTexture.magFilter=Ft);B.camera.updateProjectionMatrix()}const ee=B.map.isWebGLCubeRenderTarget?6:1;for(let ue=0;ue<ee;ue++){if(B.map.isWebGLCubeRenderTarget)n.setRenderTarget(B.map,ue),n.clear();else{ue===0&&(n.setRenderTarget(B.map),n.clear());const ge=B.getViewport(ue);r.set(a.x*ge.x,a.y*ge.y,a.x*ge.z,a.y*ge.w),C.viewport(r)}if(O.isPointLight){const ge=B.camera,De=B.matrix,Xe=O.distance||ge.far;Xe!==ge.far&&(ge.far=Xe,ge.updateProjectionMatrix()),ws.setFromMatrixPosition(O.matrixWorld),ge.position.copy(ws),Vr.copy(ge.position),Vr.add(ny[ue]),ge.up.copy(sy[ue]),ge.lookAt(Vr),ge.updateMatrixWorld(),De.makeTranslation(-ws.x,-ws.y,-ws.z),Xc.multiplyMatrices(ge.projectionMatrix,ge.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Xc,ge.coordinateSystem,ge.reversedDepth)}else B.updateMatrices(O);i=B.getFrustum(),x(P,S,B.camera,O,this.type)}B.isPointLightShadow!==!0&&this.type===Rs&&b(B,S),B.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(w,L,R)};function b(E,P){const S=e.update(v);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,u.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Ci(s.x,s.y,{format:kn,type:Ki})),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(P,null,S,d,v,null),u.uniforms.shadow_pass.value=E.mapPass.texture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(P,null,S,u,v,null)}function _(E,P,S,w){let L=null;const R=S.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(R!==void 0)L=R;else if(L=S.isPointLight===!0?l:o,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const C=L.uuid,F=P.uuid;let N=c[C];N===void 0&&(N={},c[C]=N);let I=N[F];I===void 0&&(I=L.clone(),N[F]=I,P.addEventListener("dispose",y)),L=I}if(L.visible=P.visible,L.wireframe=P.wireframe,w===Rs?L.side=P.shadowSide!==null?P.shadowSide:P.side:L.side=P.shadowSide!==null?P.shadowSide:f[P.side],L.alphaMap=P.alphaMap,L.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,L.map=P.map,L.clipShadows=P.clipShadows,L.clippingPlanes=P.clippingPlanes,L.clipIntersection=P.clipIntersection,L.displacementMap=P.displacementMap,L.displacementScale=P.displacementScale,L.displacementBias=P.displacementBias,L.wireframeLinewidth=P.wireframeLinewidth,L.linewidth=P.linewidth,S.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const C=n.properties.get(L);C.light=S}return L}function x(E,P,S,w,L){if(E.visible===!1)return;if(E.layers.test(P.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&L===Rs)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,E.matrixWorld);const F=e.update(E),N=E.material;if(Array.isArray(N)){const I=F.groups;for(let O=0,B=I.length;O<B;O++){const K=I[O],j=N[K.materialIndex];if(j&&j.visible){const ee=_(E,j,w,L);E.onBeforeShadow(n,E,P,S,F,ee,K),n.renderBufferDirect(S,null,F,ee,E,K),E.onAfterShadow(n,E,P,S,F,ee,K)}}}else if(N.visible){const I=_(E,N,w,L);E.onBeforeShadow(n,E,P,S,F,I,null),n.renderBufferDirect(S,null,F,I,E,null),E.onAfterShadow(n,E,P,S,F,I,null)}}const C=E.children;for(let F=0,N=C.length;F<N;F++)x(C[F],P,S,w,L)}function y(E){E.target.removeEventListener("dispose",y);for(const S in c){const w=c[S],L=E.target.uuid;L in w&&(w[L].dispose(),delete w[L])}}}function ry(n,e){function t(){let D=!1;const se=new vt;let q=null;const ye=new vt(0,0,0,0);return{setMask:function(oe){q!==oe&&!D&&(n.colorMask(oe,oe,oe,oe),q=oe)},setLocked:function(oe){D=oe},setClear:function(oe,J,Ee,ke,Mt){Mt===!0&&(oe*=ke,J*=ke,Ee*=ke),se.set(oe,J,Ee,ke),ye.equals(se)===!1&&(n.clearColor(oe,J,Ee,ke),ye.copy(se))},reset:function(){D=!1,q=null,ye.set(-1,0,0,0)}}}function i(){let D=!1,se=!1,q=null,ye=null,oe=null;return{setReversed:function(J){if(se!==J){const Ee=e.get("EXT_clip_control");J?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),se=J;const ke=oe;oe=null,this.setClear(ke)}},getReversed:function(){return se},setTest:function(J){J?te(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(J){q!==J&&!D&&(n.depthMask(J),q=J)},setFunc:function(J){if(se&&(J=Bf[J]),ye!==J){switch(J){case eo:n.depthFunc(n.NEVER);break;case to:n.depthFunc(n.ALWAYS);break;case io:n.depthFunc(n.LESS);break;case os:n.depthFunc(n.LEQUAL);break;case no:n.depthFunc(n.EQUAL);break;case so:n.depthFunc(n.GEQUAL);break;case ao:n.depthFunc(n.GREATER);break;case ro:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ye=J}},setLocked:function(J){D=J},setClear:function(J){oe!==J&&(oe=J,se&&(J=1-J),n.clearDepth(J))},reset:function(){D=!1,q=null,ye=null,oe=null,se=!1}}}function s(){let D=!1,se=null,q=null,ye=null,oe=null,J=null,Ee=null,ke=null,Mt=null;return{setTest:function(rt){D||(rt?te(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(rt){se!==rt&&!D&&(n.stencilMask(rt),se=rt)},setFunc:function(rt,ki,Si){(q!==rt||ye!==ki||oe!==Si)&&(n.stencilFunc(rt,ki,Si),q=rt,ye=ki,oe=Si)},setOp:function(rt,ki,Si){(J!==rt||Ee!==ki||ke!==Si)&&(n.stencilOp(rt,ki,Si),J=rt,Ee=ki,ke=Si)},setLocked:function(rt){D=rt},setClear:function(rt){Mt!==rt&&(n.clearStencil(rt),Mt=rt)},reset:function(){D=!1,se=null,q=null,ye=null,oe=null,J=null,Ee=null,ke=null,Mt=null}}}const a=new t,r=new i,o=new s,l=new WeakMap,c=new WeakMap;let h={},f={},d={},u=new WeakMap,g=[],v=null,m=!1,p=null,b=null,_=null,x=null,y=null,E=null,P=null,S=new it(0,0,0),w=0,L=!1,R=null,C=null,F=null,N=null,I=null;const O=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,K=0;const j=n.getParameter(n.VERSION);j.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(j)[1]),B=K>=1):j.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),B=K>=2);let ee=null,ue={};const ge=n.getParameter(n.SCISSOR_BOX),De=n.getParameter(n.VIEWPORT),Xe=new vt().fromArray(ge),Pe=new vt().fromArray(De);function Y(D,se,q,ye){const oe=new Uint8Array(4),J=n.createTexture();n.bindTexture(D,J),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ee=0;Ee<q;Ee++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(se,0,n.RGBA,1,1,ye,0,n.RGBA,n.UNSIGNED_BYTE,oe):n.texImage2D(se+Ee,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,oe);return J}const ae={};ae[n.TEXTURE_2D]=Y(n.TEXTURE_2D,n.TEXTURE_2D,1),ae[n.TEXTURE_CUBE_MAP]=Y(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ae[n.TEXTURE_2D_ARRAY]=Y(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ae[n.TEXTURE_3D]=Y(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),te(n.DEPTH_TEST),r.setFunc(os),Pt(!1),gt(Yl),te(n.CULL_FACE),ut(Yi);function te(D){h[D]!==!0&&(n.enable(D),h[D]=!0)}function we(D){h[D]!==!1&&(n.disable(D),h[D]=!1)}function Ie(D,se){return d[D]!==se?(n.bindFramebuffer(D,se),d[D]=se,D===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=se),D===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=se),!0):!1}function Re(D,se){let q=g,ye=!1;if(D){q=u.get(se),q===void 0&&(q=[],u.set(se,q));const oe=D.textures;if(q.length!==oe.length||q[0]!==n.COLOR_ATTACHMENT0){for(let J=0,Ee=oe.length;J<Ee;J++)q[J]=n.COLOR_ATTACHMENT0+J;q.length=oe.length,ye=!0}}else q[0]!==n.BACK&&(q[0]=n.BACK,ye=!0);ye&&n.drawBuffers(q)}function nt(D){return v!==D?(n.useProgram(D),v=D,!0):!1}const Be={[wn]:n.FUNC_ADD,[of]:n.FUNC_SUBTRACT,[lf]:n.FUNC_REVERSE_SUBTRACT};Be[cf]=n.MIN,Be[hf]=n.MAX;const Ze={[df]:n.ZERO,[ff]:n.ONE,[uf]:n.SRC_COLOR,[Jr]:n.SRC_ALPHA,[_f]:n.SRC_ALPHA_SATURATE,[yf]:n.DST_COLOR,[mf]:n.DST_ALPHA,[pf]:n.ONE_MINUS_SRC_COLOR,[Qr]:n.ONE_MINUS_SRC_ALPHA,[xf]:n.ONE_MINUS_DST_COLOR,[gf]:n.ONE_MINUS_DST_ALPHA,[vf]:n.CONSTANT_COLOR,[Sf]:n.ONE_MINUS_CONSTANT_COLOR,[Mf]:n.CONSTANT_ALPHA,[bf]:n.ONE_MINUS_CONSTANT_ALPHA};function ut(D,se,q,ye,oe,J,Ee,ke,Mt,rt){if(D===Yi){m===!0&&(we(n.BLEND),m=!1);return}if(m===!1&&(te(n.BLEND),m=!0),D!==rf){if(D!==p||rt!==L){if((b!==wn||y!==wn)&&(n.blendEquation(n.FUNC_ADD),b=wn,y=wn),rt)switch(D){case ss:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case jr:n.blendFunc(n.ONE,n.ONE);break;case $l:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Kl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Je("WebGLState: Invalid blending: ",D);break}else switch(D){case ss:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case jr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case $l:Je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Kl:Je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Je("WebGLState: Invalid blending: ",D);break}_=null,x=null,E=null,P=null,S.set(0,0,0),w=0,p=D,L=rt}return}oe=oe||se,J=J||q,Ee=Ee||ye,(se!==b||oe!==y)&&(n.blendEquationSeparate(Be[se],Be[oe]),b=se,y=oe),(q!==_||ye!==x||J!==E||Ee!==P)&&(n.blendFuncSeparate(Ze[q],Ze[ye],Ze[J],Ze[Ee]),_=q,x=ye,E=J,P=Ee),(ke.equals(S)===!1||Mt!==w)&&(n.blendColor(ke.r,ke.g,ke.b,Mt),S.copy(ke),w=Mt),p=D,L=!1}function He(D,se){D.side===Gi?we(n.CULL_FACE):te(n.CULL_FACE);let q=D.side===Kt;se&&(q=!q),Pt(q),D.blending===ss&&D.transparent===!1?ut(Yi):ut(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),a.setMask(D.colorWrite);const ye=D.stencilWrite;o.setTest(ye),ye&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),k(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?te(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function Pt(D){R!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),R=D)}function gt(D){D!==nf?(te(n.CULL_FACE),D!==C&&(D===Yl?n.cullFace(n.BACK):D===sf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),C=D}function Zt(D){D!==F&&(B&&n.lineWidth(D),F=D)}function k(D,se,q){D?(te(n.POLYGON_OFFSET_FILL),(N!==se||I!==q)&&(N=se,I=q,r.getReversed()&&(se=-se),n.polygonOffset(se,q))):we(n.POLYGON_OFFSET_FILL)}function Ct(D){D?te(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function Ge(D){D===void 0&&(D=n.TEXTURE0+O-1),ee!==D&&(n.activeTexture(D),ee=D)}function dt(D,se,q){q===void 0&&(ee===null?q=n.TEXTURE0+O-1:q=ee);let ye=ue[q];ye===void 0&&(ye={type:void 0,texture:void 0},ue[q]=ye),(ye.type!==D||ye.texture!==se)&&(ee!==q&&(n.activeTexture(q),ee=q),n.bindTexture(D,se||ae[D]),ye.type=D,ye.texture=se)}function he(){const D=ue[ee];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function xt(){try{n.compressedTexImage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function A(){try{n.compressedTexImage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function M(){try{n.texSubImage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function z(){try{n.texSubImage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function $(){try{n.compressedTexSubImage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function Q(){try{n.compressedTexSubImage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function ie(){try{n.texStorage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function le(){try{n.texStorage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function X(){try{n.texImage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function Z(){try{n.texImage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function me(D){return f[D]!==void 0?f[D]:n.getParameter(D)}function _e(D,se){f[D]!==se&&(n.pixelStorei(D,se),f[D]=se)}function re(D){Xe.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),Xe.copy(D))}function ne(D){Pe.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),Pe.copy(D))}function Le(D,se){let q=c.get(se);q===void 0&&(q=new WeakMap,c.set(se,q));let ye=q.get(D);ye===void 0&&(ye=n.getUniformBlockIndex(se,D.name),q.set(D,ye))}function Oe(D,se){const ye=c.get(se).get(D);l.get(se)!==ye&&(n.uniformBlockBinding(se,ye,D.__bindingPointIndex),l.set(se,ye))}function Qe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},f={},ee=null,ue={},d={},u=new WeakMap,g=[],v=null,m=!1,p=null,b=null,_=null,x=null,y=null,E=null,P=null,S=new it(0,0,0),w=0,L=!1,R=null,C=null,F=null,N=null,I=null,Xe.set(0,0,n.canvas.width,n.canvas.height),Pe.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:te,disable:we,bindFramebuffer:Ie,drawBuffers:Re,useProgram:nt,setBlending:ut,setMaterial:He,setFlipSided:Pt,setCullFace:gt,setLineWidth:Zt,setPolygonOffset:k,setScissorTest:Ct,activeTexture:Ge,bindTexture:dt,unbindTexture:he,compressedTexImage2D:xt,compressedTexImage3D:A,texImage2D:X,texImage3D:Z,pixelStorei:_e,getParameter:me,updateUBOMapping:Le,uniformBlockBinding:Oe,texStorage2D:ie,texStorage3D:le,texSubImage2D:M,texSubImage3D:z,compressedTexSubImage2D:$,compressedTexSubImage3D:Q,scissor:re,viewport:ne,reset:Qe}}function oy(n,e,t,i,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new tt,h=new WeakMap,f=new Set;let d;const u=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(A,M){return g?new OffscreenCanvas(A,M):za("canvas")}function m(A,M,z){let $=1;const Q=xt(A);if((Q.width>z||Q.height>z)&&($=z/Math.max(Q.width,Q.height)),$<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const ie=Math.floor($*Q.width),le=Math.floor($*Q.height);d===void 0&&(d=v(ie,le));const X=M?v(ie,le):d;return X.width=ie,X.height=le,X.getContext("2d").drawImage(A,0,0,ie,le),Ce("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+ie+"x"+le+")."),X}else return"data"in A&&Ce("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),A;return A}function p(A){return A.generateMipmaps}function b(A){n.generateMipmap(A)}function _(A){return A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?n.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(A,M,z,$,Q,ie=!1){if(A!==null){if(n[A]!==void 0)return n[A];Ce("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let le;$&&(le=e.get("EXT_texture_norm16"),le||Ce("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let X=M;if(M===n.RED&&(z===n.FLOAT&&(X=n.R32F),z===n.HALF_FLOAT&&(X=n.R16F),z===n.UNSIGNED_BYTE&&(X=n.R8),z===n.UNSIGNED_SHORT&&le&&(X=le.R16_EXT),z===n.SHORT&&le&&(X=le.R16_SNORM_EXT)),M===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&(X=n.R8UI),z===n.UNSIGNED_SHORT&&(X=n.R16UI),z===n.UNSIGNED_INT&&(X=n.R32UI),z===n.BYTE&&(X=n.R8I),z===n.SHORT&&(X=n.R16I),z===n.INT&&(X=n.R32I)),M===n.RG&&(z===n.FLOAT&&(X=n.RG32F),z===n.HALF_FLOAT&&(X=n.RG16F),z===n.UNSIGNED_BYTE&&(X=n.RG8),z===n.UNSIGNED_SHORT&&le&&(X=le.RG16_EXT),z===n.SHORT&&le&&(X=le.RG16_SNORM_EXT)),M===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&(X=n.RG8UI),z===n.UNSIGNED_SHORT&&(X=n.RG16UI),z===n.UNSIGNED_INT&&(X=n.RG32UI),z===n.BYTE&&(X=n.RG8I),z===n.SHORT&&(X=n.RG16I),z===n.INT&&(X=n.RG32I)),M===n.RGB_INTEGER&&(z===n.UNSIGNED_BYTE&&(X=n.RGB8UI),z===n.UNSIGNED_SHORT&&(X=n.RGB16UI),z===n.UNSIGNED_INT&&(X=n.RGB32UI),z===n.BYTE&&(X=n.RGB8I),z===n.SHORT&&(X=n.RGB16I),z===n.INT&&(X=n.RGB32I)),M===n.RGBA_INTEGER&&(z===n.UNSIGNED_BYTE&&(X=n.RGBA8UI),z===n.UNSIGNED_SHORT&&(X=n.RGBA16UI),z===n.UNSIGNED_INT&&(X=n.RGBA32UI),z===n.BYTE&&(X=n.RGBA8I),z===n.SHORT&&(X=n.RGBA16I),z===n.INT&&(X=n.RGBA32I)),M===n.RGB&&(z===n.UNSIGNED_SHORT&&le&&(X=le.RGB16_EXT),z===n.SHORT&&le&&(X=le.RGB16_SNORM_EXT),z===n.UNSIGNED_INT_5_9_9_9_REV&&(X=n.RGB9_E5),z===n.UNSIGNED_INT_10F_11F_11F_REV&&(X=n.R11F_G11F_B10F)),M===n.RGBA){const Z=ie?Oa:Ye.getTransfer(Q);z===n.FLOAT&&(X=n.RGBA32F),z===n.HALF_FLOAT&&(X=n.RGBA16F),z===n.UNSIGNED_BYTE&&(X=Z===st?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT&&le&&(X=le.RGBA16_EXT),z===n.SHORT&&le&&(X=le.RGBA16_SNORM_EXT),z===n.UNSIGNED_SHORT_4_4_4_4&&(X=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&(X=n.RGB5_A1)}return(X===n.R16F||X===n.R32F||X===n.RG16F||X===n.RG32F||X===n.RGBA16F||X===n.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function y(A,M){let z;return A?M===null||M===Di||M===Ns?z=n.DEPTH24_STENCIL8:M===wi?z=n.DEPTH32F_STENCIL8:M===Ds&&(z=n.DEPTH24_STENCIL8,Ce("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Di||M===Ns?z=n.DEPTH_COMPONENT24:M===wi?z=n.DEPTH_COMPONENT32F:M===Ds&&(z=n.DEPTH_COMPONENT16),z}function E(A,M){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ft&&A.minFilter!==Ht?Math.log2(Math.max(M.width,M.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?M.mipmaps.length:1}function P(A){const M=A.target;M.removeEventListener("dispose",P),w(M),M.isVideoTexture&&h.delete(M),M.isHTMLTexture&&f.delete(M)}function S(A){const M=A.target;M.removeEventListener("dispose",S),R(M)}function w(A){const M=i.get(A);if(M.__webglInit===void 0)return;const z=A.source,$=u.get(z);if($){const Q=$[M.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&L(A),Object.keys($).length===0&&u.delete(z)}i.remove(A)}function L(A){const M=i.get(A);n.deleteTexture(M.__webglTexture);const z=A.source,$=u.get(z);delete $[M.__cacheKey],r.memory.textures--}function R(A){const M=i.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),i.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(M.__webglFramebuffer[$]))for(let Q=0;Q<M.__webglFramebuffer[$].length;Q++)n.deleteFramebuffer(M.__webglFramebuffer[$][Q]);else n.deleteFramebuffer(M.__webglFramebuffer[$]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[$])}else{if(Array.isArray(M.__webglFramebuffer))for(let $=0;$<M.__webglFramebuffer.length;$++)n.deleteFramebuffer(M.__webglFramebuffer[$]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let $=0;$<M.__webglColorRenderbuffer.length;$++)M.__webglColorRenderbuffer[$]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[$]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const z=A.textures;for(let $=0,Q=z.length;$<Q;$++){const ie=i.get(z[$]);ie.__webglTexture&&(n.deleteTexture(ie.__webglTexture),r.memory.textures--),i.remove(z[$])}i.remove(A)}let C=0;function F(){C=0}function N(){return C}function I(A){C=A}function O(){const A=C;return A>=s.maxTextures&&Ce("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),C+=1,A}function B(A){const M=[];return M.push(A.wrapS),M.push(A.wrapT),M.push(A.wrapR||0),M.push(A.magFilter),M.push(A.minFilter),M.push(A.anisotropy),M.push(A.internalFormat),M.push(A.format),M.push(A.type),M.push(A.generateMipmaps),M.push(A.premultiplyAlpha),M.push(A.flipY),M.push(A.unpackAlignment),M.push(A.colorSpace),M.join()}function K(A,M){const z=i.get(A);if(A.isVideoTexture&&dt(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&z.__version!==A.version){const $=A.image;if($===null)Ce("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)Ce("WebGLRenderer: Texture marked for update but image is incomplete");else{we(z,A,M);return}}else A.isExternalTexture&&(z.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+M)}function j(A,M){const z=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&z.__version!==A.version){we(z,A,M);return}else A.isExternalTexture&&(z.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+M)}function ee(A,M){const z=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&z.__version!==A.version){we(z,A,M);return}t.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+M)}function ue(A,M){const z=i.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&z.__version!==A.version){Ie(z,A,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+M)}const ge={[oo]:n.REPEAT,[Xi]:n.CLAMP_TO_EDGE,[lo]:n.MIRRORED_REPEAT},De={[Ft]:n.NEAREST,[wf]:n.NEAREST_MIPMAP_NEAREST,[Ws]:n.NEAREST_MIPMAP_LINEAR,[Ht]:n.LINEAR,[cr]:n.LINEAR_MIPMAP_NEAREST,[Rn]:n.LINEAR_MIPMAP_LINEAR},Xe={[Pf]:n.NEVER,[Nf]:n.ALWAYS,[Cf]:n.LESS,[ol]:n.LEQUAL,[If]:n.EQUAL,[ll]:n.GEQUAL,[Lf]:n.GREATER,[Df]:n.NOTEQUAL};function Pe(A,M){if(M.type===wi&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Ht||M.magFilter===cr||M.magFilter===Ws||M.magFilter===Rn||M.minFilter===Ht||M.minFilter===cr||M.minFilter===Ws||M.minFilter===Rn)&&Ce("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(A,n.TEXTURE_WRAP_S,ge[M.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,ge[M.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,ge[M.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,De[M.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,De[M.minFilter]),M.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,Xe[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Ft||M.minFilter!==Ws&&M.minFilter!==Rn||M.type===wi&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(A,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Y(A,M){let z=!1;A.__webglInit===void 0&&(A.__webglInit=!0,M.addEventListener("dispose",P));const $=M.source;let Q=u.get($);Q===void 0&&(Q={},u.set($,Q));const ie=B(M);if(ie!==A.__cacheKey){Q[ie]===void 0&&(Q[ie]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,z=!0),Q[ie].usedTimes++;const le=Q[A.__cacheKey];le!==void 0&&(Q[A.__cacheKey].usedTimes--,le.usedTimes===0&&L(M)),A.__cacheKey=ie,A.__webglTexture=Q[ie].texture}return z}function ae(A,M,z){return Math.floor(Math.floor(A/z)/M)}function te(A,M,z,$){const ie=A.updateRanges;if(ie.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,M.width,M.height,z,$,M.data);else{ie.sort((_e,re)=>_e.start-re.start);let le=0;for(let _e=1;_e<ie.length;_e++){const re=ie[le],ne=ie[_e],Le=re.start+re.count,Oe=ae(ne.start,M.width,4),Qe=ae(re.start,M.width,4);ne.start<=Le+1&&Oe===Qe&&ae(ne.start+ne.count-1,M.width,4)===Oe?re.count=Math.max(re.count,ne.start+ne.count-re.start):(++le,ie[le]=ne)}ie.length=le+1;const X=t.getParameter(n.UNPACK_ROW_LENGTH),Z=t.getParameter(n.UNPACK_SKIP_PIXELS),me=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,M.width);for(let _e=0,re=ie.length;_e<re;_e++){const ne=ie[_e],Le=Math.floor(ne.start/4),Oe=Math.ceil(ne.count/4),Qe=Le%M.width,D=Math.floor(Le/M.width),se=Oe,q=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Qe),t.pixelStorei(n.UNPACK_SKIP_ROWS,D),t.texSubImage2D(n.TEXTURE_2D,0,Qe,D,se,q,z,$,M.data)}A.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,X),t.pixelStorei(n.UNPACK_SKIP_PIXELS,Z),t.pixelStorei(n.UNPACK_SKIP_ROWS,me)}}function we(A,M,z){let $=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&($=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&($=n.TEXTURE_3D);const Q=Y(A,M),ie=M.source;t.bindTexture($,A.__webglTexture,n.TEXTURE0+z);const le=i.get(ie);if(ie.version!==le.__version||Q===!0){if(t.activeTexture(n.TEXTURE0+z),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const q=Ye.getPrimaries(Ye.workingColorSpace),ye=M.colorSpace===ln?null:Ye.getPrimaries(M.colorSpace),oe=M.colorSpace===ln||q===ye?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,oe)}t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment);let Z=m(M.image,!1,s.maxTextureSize);Z=he(M,Z);const me=a.convert(M.format,M.colorSpace),_e=a.convert(M.type);let re=x(M.internalFormat,me,_e,M.normalized,M.colorSpace,M.isVideoTexture);Pe($,M);let ne;const Le=M.mipmaps,Oe=M.isVideoTexture!==!0,Qe=le.__version===void 0||Q===!0,D=ie.dataReady,se=E(M,Z);if(M.isDepthTexture)re=y(M.format===Pn,M.type),Qe&&(Oe?t.texStorage2D(n.TEXTURE_2D,1,re,Z.width,Z.height):t.texImage2D(n.TEXTURE_2D,0,re,Z.width,Z.height,0,me,_e,null));else if(M.isDataTexture)if(Le.length>0){Oe&&Qe&&t.texStorage2D(n.TEXTURE_2D,se,re,Le[0].width,Le[0].height);for(let q=0,ye=Le.length;q<ye;q++)ne=Le[q],Oe?D&&t.texSubImage2D(n.TEXTURE_2D,q,0,0,ne.width,ne.height,me,_e,ne.data):t.texImage2D(n.TEXTURE_2D,q,re,ne.width,ne.height,0,me,_e,ne.data);M.generateMipmaps=!1}else Oe?(Qe&&t.texStorage2D(n.TEXTURE_2D,se,re,Z.width,Z.height),D&&te(M,Z,me,_e)):t.texImage2D(n.TEXTURE_2D,0,re,Z.width,Z.height,0,me,_e,Z.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Oe&&Qe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,se,re,Le[0].width,Le[0].height,Z.depth);for(let q=0,ye=Le.length;q<ye;q++)if(ne=Le[q],M.format!==yi)if(me!==null)if(Oe){if(D)if(M.layerUpdates.size>0){const oe=Mc(ne.width,ne.height,M.format,M.type);for(const J of M.layerUpdates){const Ee=ne.data.subarray(J*oe/ne.data.BYTES_PER_ELEMENT,(J+1)*oe/ne.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,J,ne.width,ne.height,1,me,Ee)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,ne.width,ne.height,Z.depth,me,ne.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,q,re,ne.width,ne.height,Z.depth,0,ne.data,0,0);else Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Oe?D&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,ne.width,ne.height,Z.depth,me,_e,ne.data):t.texImage3D(n.TEXTURE_2D_ARRAY,q,re,ne.width,ne.height,Z.depth,0,me,_e,ne.data)}else{Oe&&Qe&&t.texStorage2D(n.TEXTURE_2D,se,re,Le[0].width,Le[0].height);for(let q=0,ye=Le.length;q<ye;q++)ne=Le[q],M.format!==yi?me!==null?Oe?D&&t.compressedTexSubImage2D(n.TEXTURE_2D,q,0,0,ne.width,ne.height,me,ne.data):t.compressedTexImage2D(n.TEXTURE_2D,q,re,ne.width,ne.height,0,ne.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Oe?D&&t.texSubImage2D(n.TEXTURE_2D,q,0,0,ne.width,ne.height,me,_e,ne.data):t.texImage2D(n.TEXTURE_2D,q,re,ne.width,ne.height,0,me,_e,ne.data)}else if(M.isDataArrayTexture)if(Oe){if(Qe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,se,re,Z.width,Z.height,Z.depth),D)if(M.layerUpdates.size>0){const q=Mc(Z.width,Z.height,M.format,M.type);for(const ye of M.layerUpdates){const oe=Z.data.subarray(ye*q/Z.data.BYTES_PER_ELEMENT,(ye+1)*q/Z.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ye,Z.width,Z.height,1,me,_e,oe)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,me,_e,Z.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,re,Z.width,Z.height,Z.depth,0,me,_e,Z.data);else if(M.isData3DTexture)Oe?(Qe&&t.texStorage3D(n.TEXTURE_3D,se,re,Z.width,Z.height,Z.depth),D&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,me,_e,Z.data)):t.texImage3D(n.TEXTURE_3D,0,re,Z.width,Z.height,Z.depth,0,me,_e,Z.data);else if(M.isFramebufferTexture){if(Qe)if(Oe)t.texStorage2D(n.TEXTURE_2D,se,re,Z.width,Z.height);else{let q=Z.width,ye=Z.height;for(let oe=0;oe<se;oe++)t.texImage2D(n.TEXTURE_2D,oe,re,q,ye,0,me,_e,null),q>>=1,ye>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in n){const q=n.canvas;if(q.hasAttribute("layoutsubtree")||q.setAttribute("layoutsubtree","true"),Z.parentNode!==q){q.appendChild(Z),f.add(M),q.onpaint=ke=>{const Mt=ke.changedElements;for(const rt of f)Mt.includes(rt.image)&&(rt.needsUpdate=!0)},q.requestPaint();return}const ye=0,oe=n.RGBA,J=n.RGBA,Ee=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,ye,oe,J,Ee,Z),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Le.length>0){if(Oe&&Qe){const q=xt(Le[0]);t.texStorage2D(n.TEXTURE_2D,se,re,q.width,q.height)}for(let q=0,ye=Le.length;q<ye;q++)ne=Le[q],Oe?D&&t.texSubImage2D(n.TEXTURE_2D,q,0,0,me,_e,ne):t.texImage2D(n.TEXTURE_2D,q,re,me,_e,ne);M.generateMipmaps=!1}else if(Oe){if(Qe){const q=xt(Z);t.texStorage2D(n.TEXTURE_2D,se,re,q.width,q.height)}D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,me,_e,Z)}else t.texImage2D(n.TEXTURE_2D,0,re,me,_e,Z);p(M)&&b($),le.__version=ie.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function Ie(A,M,z){if(M.image.length!==6)return;const $=Y(A,M),Q=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+z);const ie=i.get(Q);if(Q.version!==ie.__version||$===!0){t.activeTexture(n.TEXTURE0+z);const le=Ye.getPrimaries(Ye.workingColorSpace),X=M.colorSpace===ln?null:Ye.getPrimaries(M.colorSpace),Z=M.colorSpace===ln||le===X?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Z);const me=M.isCompressedTexture||M.image[0].isCompressedTexture,_e=M.image[0]&&M.image[0].isDataTexture,re=[];for(let J=0;J<6;J++)!me&&!_e?re[J]=m(M.image[J],!0,s.maxCubemapSize):re[J]=_e?M.image[J].image:M.image[J],re[J]=he(M,re[J]);const ne=re[0],Le=a.convert(M.format,M.colorSpace),Oe=a.convert(M.type),Qe=x(M.internalFormat,Le,Oe,M.normalized,M.colorSpace),D=M.isVideoTexture!==!0,se=ie.__version===void 0||$===!0,q=Q.dataReady;let ye=E(M,ne);Pe(n.TEXTURE_CUBE_MAP,M);let oe;if(me){D&&se&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,Qe,ne.width,ne.height);for(let J=0;J<6;J++){oe=re[J].mipmaps;for(let Ee=0;Ee<oe.length;Ee++){const ke=oe[Ee];M.format!==yi?Le!==null?D?q&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee,0,0,ke.width,ke.height,Le,ke.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee,Qe,ke.width,ke.height,0,ke.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee,0,0,ke.width,ke.height,Le,Oe,ke.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee,Qe,ke.width,ke.height,0,Le,Oe,ke.data)}}}else{if(oe=M.mipmaps,D&&se){oe.length>0&&ye++;const J=xt(re[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,Qe,J.width,J.height)}for(let J=0;J<6;J++)if(_e){D?q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,re[J].width,re[J].height,Le,Oe,re[J].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Qe,re[J].width,re[J].height,0,Le,Oe,re[J].data);for(let Ee=0;Ee<oe.length;Ee++){const Mt=oe[Ee].image[J].image;D?q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee+1,0,0,Mt.width,Mt.height,Le,Oe,Mt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee+1,Qe,Mt.width,Mt.height,0,Le,Oe,Mt.data)}}else{D?q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Le,Oe,re[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Qe,Le,Oe,re[J]);for(let Ee=0;Ee<oe.length;Ee++){const ke=oe[Ee];D?q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee+1,0,0,Le,Oe,ke.image[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ee+1,Qe,Le,Oe,ke.image[J])}}}p(M)&&b(n.TEXTURE_CUBE_MAP),ie.__version=Q.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function Re(A,M,z,$,Q,ie){const le=a.convert(z.format,z.colorSpace),X=a.convert(z.type),Z=x(z.internalFormat,le,X,z.normalized,z.colorSpace),me=i.get(M),_e=i.get(z);if(_e.__renderTarget=M,!me.__hasExternalTextures){const re=Math.max(1,M.width>>ie),ne=Math.max(1,M.height>>ie);Q===n.TEXTURE_3D||Q===n.TEXTURE_2D_ARRAY?t.texImage3D(Q,ie,Z,re,ne,M.depth,0,le,X,null):t.texImage2D(Q,ie,Z,re,ne,0,le,X,null)}t.bindFramebuffer(n.FRAMEBUFFER,A),Ge(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,$,Q,_e.__webglTexture,0,Ct(M)):(Q===n.TEXTURE_2D||Q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,$,Q,_e.__webglTexture,ie),t.bindFramebuffer(n.FRAMEBUFFER,null)}function nt(A,M,z){if(n.bindRenderbuffer(n.RENDERBUFFER,A),M.depthBuffer){const $=M.depthTexture,Q=$&&$.isDepthTexture?$.type:null,ie=y(M.stencilBuffer,Q),le=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Ge(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ct(M),ie,M.width,M.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ct(M),ie,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,ie,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,le,n.RENDERBUFFER,A)}else{const $=M.textures;for(let Q=0;Q<$.length;Q++){const ie=$[Q],le=a.convert(ie.format,ie.colorSpace),X=a.convert(ie.type),Z=x(ie.internalFormat,le,X,ie.normalized,ie.colorSpace);Ge(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ct(M),Z,M.width,M.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ct(M),Z,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,Z,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Be(A,M,z){const $=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,A),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=i.get(M.depthTexture);if(Q.__renderTarget=M,(!Q.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),$){if(Q.__webglInit===void 0&&(Q.__webglInit=!0,M.depthTexture.addEventListener("dispose",P)),Q.__webglTexture===void 0){Q.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),Pe(n.TEXTURE_CUBE_MAP,M.depthTexture);const me=a.convert(M.depthTexture.format),_e=a.convert(M.depthTexture.type);let re;M.depthTexture.format===Zi?re=n.DEPTH_COMPONENT24:M.depthTexture.format===Pn&&(re=n.DEPTH24_STENCIL8);for(let ne=0;ne<6;ne++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,re,M.width,M.height,0,me,_e,null)}}else K(M.depthTexture,0);const ie=Q.__webglTexture,le=Ct(M),X=$?n.TEXTURE_CUBE_MAP_POSITIVE_X+z:n.TEXTURE_2D,Z=M.depthTexture.format===Pn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(M.depthTexture.format===Zi)Ge(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,X,ie,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,Z,X,ie,0);else if(M.depthTexture.format===Pn)Ge(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,X,ie,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,Z,X,ie,0);else throw new Error("Unknown depthTexture format")}function Ze(A){const M=i.get(A),z=A.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==A.depthTexture){const $=A.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),$){const Q=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,$.removeEventListener("dispose",Q)};$.addEventListener("dispose",Q),M.__depthDisposeCallback=Q}M.__boundDepthTexture=$}if(A.depthTexture&&!M.__autoAllocateDepthBuffer)if(z)for(let $=0;$<6;$++)Be(M.__webglFramebuffer[$],A,$);else{const $=A.texture.mipmaps;$&&$.length>0?Be(M.__webglFramebuffer[0],A,0):Be(M.__webglFramebuffer,A,0)}else if(z){M.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[$]),M.__webglDepthbuffer[$]===void 0)M.__webglDepthbuffer[$]=n.createRenderbuffer(),nt(M.__webglDepthbuffer[$],A,!1);else{const Q=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ie=M.__webglDepthbuffer[$];n.bindRenderbuffer(n.RENDERBUFFER,ie),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,ie)}}else{const $=A.texture.mipmaps;if($&&$.length>0?t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),nt(M.__webglDepthbuffer,A,!1);else{const Q=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ie=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ie),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,ie)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ut(A,M,z){const $=i.get(A);M!==void 0&&Re($.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&Ze(A)}function He(A){const M=A.texture,z=i.get(A),$=i.get(M);A.addEventListener("dispose",S);const Q=A.textures,ie=A.isWebGLCubeRenderTarget===!0,le=Q.length>1;if(le||($.__webglTexture===void 0&&($.__webglTexture=n.createTexture()),$.__version=M.version,r.memory.textures++),ie){z.__webglFramebuffer=[];for(let X=0;X<6;X++)if(M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer[X]=[];for(let Z=0;Z<M.mipmaps.length;Z++)z.__webglFramebuffer[X][Z]=n.createFramebuffer()}else z.__webglFramebuffer[X]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer=[];for(let X=0;X<M.mipmaps.length;X++)z.__webglFramebuffer[X]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(le)for(let X=0,Z=Q.length;X<Z;X++){const me=i.get(Q[X]);me.__webglTexture===void 0&&(me.__webglTexture=n.createTexture(),r.memory.textures++)}if(A.samples>0&&Ge(A)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let X=0;X<Q.length;X++){const Z=Q[X];z.__webglColorRenderbuffer[X]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[X]);const me=a.convert(Z.format,Z.colorSpace),_e=a.convert(Z.type),re=x(Z.internalFormat,me,_e,Z.normalized,Z.colorSpace,A.isXRRenderTarget===!0),ne=Ct(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,ne,re,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+X,n.RENDERBUFFER,z.__webglColorRenderbuffer[X])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),nt(z.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ie){t.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture),Pe(n.TEXTURE_CUBE_MAP,M);for(let X=0;X<6;X++)if(M.mipmaps&&M.mipmaps.length>0)for(let Z=0;Z<M.mipmaps.length;Z++)Re(z.__webglFramebuffer[X][Z],A,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+X,Z);else Re(z.__webglFramebuffer[X],A,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0);p(M)&&b(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(le){for(let X=0,Z=Q.length;X<Z;X++){const me=Q[X],_e=i.get(me);let re=n.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(re=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(re,_e.__webglTexture),Pe(re,me),Re(z.__webglFramebuffer,A,me,n.COLOR_ATTACHMENT0+X,re,0),p(me)&&b(re)}t.unbindTexture()}else{let X=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(X=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(X,$.__webglTexture),Pe(X,M),M.mipmaps&&M.mipmaps.length>0)for(let Z=0;Z<M.mipmaps.length;Z++)Re(z.__webglFramebuffer[Z],A,M,n.COLOR_ATTACHMENT0,X,Z);else Re(z.__webglFramebuffer,A,M,n.COLOR_ATTACHMENT0,X,0);p(M)&&b(X),t.unbindTexture()}A.depthBuffer&&Ze(A)}function Pt(A){const M=A.textures;for(let z=0,$=M.length;z<$;z++){const Q=M[z];if(p(Q)){const ie=_(A),le=i.get(Q).__webglTexture;t.bindTexture(ie,le),b(ie),t.unbindTexture()}}}const gt=[],Zt=[];function k(A){if(A.samples>0){if(Ge(A)===!1){const M=A.textures,z=A.width,$=A.height;let Q=n.COLOR_BUFFER_BIT;const ie=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,le=i.get(A),X=M.length>1;if(X)for(let me=0;me<M.length;me++)t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,le.__webglMultisampledFramebuffer);const Z=A.texture.mipmaps;Z&&Z.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer);for(let me=0;me<M.length;me++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(Q|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(Q|=n.STENCIL_BUFFER_BIT)),X){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,le.__webglColorRenderbuffer[me]);const _e=i.get(M[me]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,_e,0)}n.blitFramebuffer(0,0,z,$,0,0,z,$,Q,n.NEAREST),l===!0&&(gt.length=0,Zt.length=0,gt.push(n.COLOR_ATTACHMENT0+me),A.depthBuffer&&A.resolveDepthBuffer===!1&&(gt.push(ie),Zt.push(ie),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Zt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,gt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),X)for(let me=0;me<M.length;me++){t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,le.__webglColorRenderbuffer[me]);const _e=i.get(M[me]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,_e,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const M=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function Ct(A){return Math.min(s.maxSamples,A.samples)}function Ge(A){const M=i.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function dt(A){const M=r.render.frame;h.get(A)!==M&&(h.set(A,M),A.update())}function he(A,M){const z=A.colorSpace,$=A.format,Q=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||z!==Ba&&z!==ln&&(Ye.getTransfer(z)===st?($!==yi||Q!==ii)&&Ce("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Je("WebGLTextures: Unsupported texture color space:",z)),M}function xt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=F,this.getTextureUnits=N,this.setTextureUnits=I,this.setTexture2D=K,this.setTexture2DArray=j,this.setTexture3D=ee,this.setTextureCube=ue,this.rebindTextures=ut,this.setupRenderTarget=He,this.updateRenderTargetMipmap=Pt,this.updateMultisampleRenderTarget=k,this.setupDepthRenderbuffer=Ze,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=Ge,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function ly(n,e){function t(i,s=ln){let a;const r=Ye.getTransfer(s);if(i===ii)return n.UNSIGNED_BYTE;if(i===il)return n.UNSIGNED_SHORT_4_4_4_4;if(i===nl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Mh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===bh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===vh)return n.BYTE;if(i===Sh)return n.SHORT;if(i===Ds)return n.UNSIGNED_SHORT;if(i===tl)return n.INT;if(i===Di)return n.UNSIGNED_INT;if(i===wi)return n.FLOAT;if(i===Ki)return n.HALF_FLOAT;if(i===Eh)return n.ALPHA;if(i===Th)return n.RGB;if(i===yi)return n.RGBA;if(i===Zi)return n.DEPTH_COMPONENT;if(i===Pn)return n.DEPTH_STENCIL;if(i===wh)return n.RED;if(i===sl)return n.RED_INTEGER;if(i===kn)return n.RG;if(i===al)return n.RG_INTEGER;if(i===rl)return n.RGBA_INTEGER;if(i===wa||i===Aa||i===Ra||i===Pa)if(r===st)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===wa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Aa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ra)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Pa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===wa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Aa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ra)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Pa)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===co||i===ho||i===fo||i===uo)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===co)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ho)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===fo)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===uo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===po||i===mo||i===go||i===yo||i===xo||i===Ua||i===_o)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===po||i===mo)return r===st?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===go)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===yo)return a.COMPRESSED_R11_EAC;if(i===xo)return a.COMPRESSED_SIGNED_R11_EAC;if(i===Ua)return a.COMPRESSED_RG11_EAC;if(i===_o)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===vo||i===So||i===Mo||i===bo||i===Eo||i===To||i===wo||i===Ao||i===Ro||i===Po||i===Co||i===Io||i===Lo||i===Do)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===vo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===So)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Mo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===bo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Eo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===To)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===wo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ao)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ro)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Po)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Co)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Io)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Lo)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Do)return r===st?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===No||i===ko||i===Uo)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===No)return r===st?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ko)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Uo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Fo||i===Bo||i===Fa||i===Oo)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===Fo)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Bo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Fa)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Oo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ns?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const cy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,hy=`
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

}`;class dy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Nh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Ni({vertexShader:cy,fragmentShader:hy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ht(new Ka(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class fy extends Fn{constructor(e,t){super();const i=this;let s=null,a=1,r=null,o="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,g=null;const v=typeof XRWebGLBinding<"u",m=new dy,p={},b=t.getContextAttributes();let _=null,x=null;const y=[],E=[],P=new tt;let S=null;const w=new ui;w.viewport=new vt;const L=new ui;L.viewport=new vt;const R=[w,L],C=new Mu;let F=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ae=y[Y];return ae===void 0&&(ae=new yr,y[Y]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(Y){let ae=y[Y];return ae===void 0&&(ae=new yr,y[Y]=ae),ae.getGripSpace()},this.getHand=function(Y){let ae=y[Y];return ae===void 0&&(ae=new yr,y[Y]=ae),ae.getHandSpace()};function I(Y){const ae=E.indexOf(Y.inputSource);if(ae===-1)return;const te=y[ae];te!==void 0&&(te.update(Y.inputSource,Y.frame,c||r),te.dispatchEvent({type:Y.type,data:Y.inputSource}))}function O(){s.removeEventListener("select",I),s.removeEventListener("selectstart",I),s.removeEventListener("selectend",I),s.removeEventListener("squeeze",I),s.removeEventListener("squeezestart",I),s.removeEventListener("squeezeend",I),s.removeEventListener("end",O),s.removeEventListener("inputsourceschange",B);for(let Y=0;Y<y.length;Y++){const ae=E[Y];ae!==null&&(E[Y]=null,y[Y].disconnect(ae))}F=null,N=null,m.reset();for(const Y in p)delete p[Y];e.setRenderTarget(_),u=null,d=null,f=null,s=null,x=null,Pe.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){a=Y,i.isPresenting===!0&&Ce("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&Ce("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f===null&&v&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(_=e.getRenderTarget(),s.addEventListener("select",I),s.addEventListener("selectstart",I),s.addEventListener("selectend",I),s.addEventListener("squeeze",I),s.addEventListener("squeezestart",I),s.addEventListener("squeezeend",I),s.addEventListener("end",O),s.addEventListener("inputsourceschange",B),b.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(P),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,we=null,Ie=null;b.depth&&(Ie=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=b.stencil?Pn:Zi,we=b.stencil?Ns:Di);const Re={colorFormat:t.RGBA8,depthFormat:Ie,scaleFactor:a};f=this.getBinding(),d=f.createProjectionLayer(Re),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Ci(d.textureWidth,d.textureHeight,{format:yi,type:ii,depthTexture:new cs(d.textureWidth,d.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const te={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,t,te),s.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new Ci(u.framebufferWidth,u.framebufferHeight,{format:yi,type:ii,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),Pe.setContext(s),Pe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function B(Y){for(let ae=0;ae<Y.removed.length;ae++){const te=Y.removed[ae],we=E.indexOf(te);we>=0&&(E[we]=null,y[we].disconnect(te))}for(let ae=0;ae<Y.added.length;ae++){const te=Y.added[ae];let we=E.indexOf(te);if(we===-1){for(let Re=0;Re<y.length;Re++)if(Re>=E.length){E.push(te),we=Re;break}else if(E[Re]===null){E[Re]=te,we=Re;break}if(we===-1)break}const Ie=y[we];Ie&&Ie.connect(te)}}const K=new V,j=new V;function ee(Y,ae,te){K.setFromMatrixPosition(ae.matrixWorld),j.setFromMatrixPosition(te.matrixWorld);const we=K.distanceTo(j),Ie=ae.projectionMatrix.elements,Re=te.projectionMatrix.elements,nt=Ie[14]/(Ie[10]-1),Be=Ie[14]/(Ie[10]+1),Ze=(Ie[9]+1)/Ie[5],ut=(Ie[9]-1)/Ie[5],He=(Ie[8]-1)/Ie[0],Pt=(Re[8]+1)/Re[0],gt=nt*He,Zt=nt*Pt,k=we/(-He+Pt),Ct=k*-He;if(ae.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Ct),Y.translateZ(k),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Ie[10]===-1)Y.projectionMatrix.copy(ae.projectionMatrix),Y.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{const Ge=nt+k,dt=Be+k,he=gt-Ct,xt=Zt+(we-Ct),A=Ze*Be/dt*Ge,M=ut*Be/dt*Ge;Y.projectionMatrix.makePerspective(he,xt,A,M,Ge,dt),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ue(Y,ae){ae===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ae.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let ae=Y.near,te=Y.far;m.texture!==null&&(m.depthNear>0&&(ae=m.depthNear),m.depthFar>0&&(te=m.depthFar)),C.near=L.near=w.near=ae,C.far=L.far=w.far=te,(F!==C.near||N!==C.far)&&(s.updateRenderState({depthNear:C.near,depthFar:C.far}),F=C.near,N=C.far),C.layers.mask=Y.layers.mask|6,w.layers.mask=C.layers.mask&-5,L.layers.mask=C.layers.mask&-3;const we=Y.parent,Ie=C.cameras;ue(C,we);for(let Re=0;Re<Ie.length;Re++)ue(Ie[Re],we);Ie.length===2?ee(C,w,L):C.projectionMatrix.copy(w.projectionMatrix),ge(Y,C,we)};function ge(Y,ae,te){te===null?Y.matrix.copy(ae.matrixWorld):(Y.matrix.copy(te.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ae.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ae.projectionMatrix),Y.projectionMatrixInverse.copy(ae.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Ho*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(C)},this.getCameraTexture=function(Y){return p[Y]};let De=null;function Xe(Y,ae){if(h=ae.getViewerPose(c||r),g=ae,h!==null){const te=h.views;u!==null&&(e.setRenderTargetFramebuffer(x,u.framebuffer),e.setRenderTarget(x));let we=!1;te.length!==C.cameras.length&&(C.cameras.length=0,we=!0);for(let Be=0;Be<te.length;Be++){const Ze=te[Be];let ut=null;if(u!==null)ut=u.getViewport(Ze);else{const Pt=f.getViewSubImage(d,Ze);ut=Pt.viewport,Be===0&&(e.setRenderTargetTextures(x,Pt.colorTexture,Pt.depthStencilTexture),e.setRenderTarget(x))}let He=R[Be];He===void 0&&(He=new ui,He.layers.enable(Be),He.viewport=new vt,R[Be]=He),He.matrix.fromArray(Ze.transform.matrix),He.matrix.decompose(He.position,He.quaternion,He.scale),He.projectionMatrix.fromArray(Ze.projectionMatrix),He.projectionMatrixInverse.copy(He.projectionMatrix).invert(),He.viewport.set(ut.x,ut.y,ut.width,ut.height),Be===0&&(C.matrix.copy(He.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),we===!0&&C.cameras.push(He)}const Ie=s.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){f=i.getBinding();const Be=f.getDepthInformation(te[0]);Be&&Be.isValid&&Be.texture&&m.init(Be,s.renderState)}if(Ie&&Ie.includes("camera-access")&&v){e.state.unbindTexture(),f=i.getBinding();for(let Be=0;Be<te.length;Be++){const Ze=te[Be].camera;if(Ze){let ut=p[Ze];ut||(ut=new Nh,p[Ze]=ut);const He=f.getCameraImage(Ze);ut.sourceTexture=He}}}}for(let te=0;te<y.length;te++){const we=E[te],Ie=y[te];we!==null&&Ie!==void 0&&Ie.update(we,ae,c||r)}De&&De(Y,ae),ae.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ae}),g=null}const Pe=new Bh;Pe.setAnimationLoop(Xe),this.setAnimationLoop=function(Y){De=Y},this.dispose=function(){}}}const uy=new wt,Xh=new Ne;Xh.set(-1,0,0,0,1,0,0,0,1);function py(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,kh(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,b,_,x){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?a(m,p):p.isMeshLambertMaterial?(a(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(a(m,p),f(m,p)):p.isMeshPhongMaterial?(a(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(a(m,p),d(m,p),p.isMeshPhysicalMaterial&&u(m,p,x)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),v(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,b,_):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Kt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Kt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const b=e.get(p),_=b.envMap,x=b.envMapRotation;_&&(m.envMap.value=_,m.envMapRotation.value.setFromMatrix4(uy.makeRotationFromEuler(x)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Xh),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,_){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=_*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Kt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const b=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function my(n,e,t,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,_){const x=_.program;i.uniformBlockBinding(b,x)}function c(b,_){let x=s[b.id];x===void 0&&(g(b),x=h(b),s[b.id]=x,b.addEventListener("dispose",m));const y=_.program;i.updateUBOMapping(b,y);const E=e.render.frame;a[b.id]!==E&&(d(b),a[b.id]=E)}function h(b){const _=f();b.__bindingPointIndex=_;const x=n.createBuffer(),y=b.__size,E=b.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,y,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,x),x}function f(){for(let b=0;b<o;b++)if(r.indexOf(b)===-1)return r.push(b),b;return Je("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){const _=s[b.id],x=b.uniforms,y=b.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let E=0,P=x.length;E<P;E++){const S=Array.isArray(x[E])?x[E]:[x[E]];for(let w=0,L=S.length;w<L;w++){const R=S[w];if(u(R,E,w,y)===!0){const C=R.__offset,F=Array.isArray(R.value)?R.value:[R.value];let N=0;for(let I=0;I<F.length;I++){const O=F[I],B=v(O);typeof O=="number"||typeof O=="boolean"?(R.__data[0]=O,n.bufferSubData(n.UNIFORM_BUFFER,C+N,R.__data)):O.isMatrix3?(R.__data[0]=O.elements[0],R.__data[1]=O.elements[1],R.__data[2]=O.elements[2],R.__data[3]=0,R.__data[4]=O.elements[3],R.__data[5]=O.elements[4],R.__data[6]=O.elements[5],R.__data[7]=0,R.__data[8]=O.elements[6],R.__data[9]=O.elements[7],R.__data[10]=O.elements[8],R.__data[11]=0):ArrayBuffer.isView(O)?R.__data.set(new O.constructor(O.buffer,O.byteOffset,R.__data.length)):(O.toArray(R.__data,N),N+=B.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,C,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(b,_,x,y){const E=b.value,P=_+"_"+x;if(y[P]===void 0)return typeof E=="number"||typeof E=="boolean"?y[P]=E:ArrayBuffer.isView(E)?y[P]=E.slice():y[P]=E.clone(),!0;{const S=y[P];if(typeof E=="number"||typeof E=="boolean"){if(S!==E)return y[P]=E,!0}else{if(ArrayBuffer.isView(E))return!0;if(S.equals(E)===!1)return S.copy(E),!0}}return!1}function g(b){const _=b.uniforms;let x=0;const y=16;for(let P=0,S=_.length;P<S;P++){const w=Array.isArray(_[P])?_[P]:[_[P]];for(let L=0,R=w.length;L<R;L++){const C=w[L],F=Array.isArray(C.value)?C.value:[C.value];for(let N=0,I=F.length;N<I;N++){const O=F[N],B=v(O),K=x%y,j=K%B.boundary,ee=K+j;x+=j,ee!==0&&y-ee<B.storage&&(x+=y-ee),C.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=x,x+=B.storage}}}const E=x%y;return E>0&&(x+=y-E),b.__size=x,b.__cache={},this}function v(b){const _={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(_.boundary=4,_.storage=4):b.isVector2?(_.boundary=8,_.storage=8):b.isVector3||b.isColor?(_.boundary=16,_.storage=12):b.isVector4?(_.boundary=16,_.storage=16):b.isMatrix3?(_.boundary=48,_.storage=48):b.isMatrix4?(_.boundary=64,_.storage=64):b.isTexture?Ce("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(b)?(_.boundary=16,_.storage=b.byteLength):Ce("WebGLRenderer: Unsupported uniform value type.",b),_}function m(b){const _=b.target;_.removeEventListener("dispose",m);const x=r.indexOf(_.__bindingPointIndex);r.splice(x,1),n.deleteBuffer(s[_.id]),delete s[_.id],delete a[_.id]}function p(){for(const b in s)n.deleteBuffer(s[b]);r=[],s={},a={}}return{bind:l,update:c,dispose:p}}const gy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ei=null;function yy(){return Ei===null&&(Ei=new ru(gy,16,16,kn,Ki),Ei.name="DFG_LUT",Ei.minFilter=Ht,Ei.magFilter=Ht,Ei.wrapS=Xi,Ei.wrapT=Xi,Ei.generateMipmaps=!1,Ei.needsUpdate=!0),Ei}class xy{constructor(e={}){const{canvas:t=Uf(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1,outputBufferType:u=ii}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=r;const v=u,m=new Set([rl,al,sl]),p=new Set([ii,Di,Ds,Ns,il,nl]),b=new Uint32Array(4),_=new Int32Array(4),x=new V;let y=null,E=null;const P=[],S=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Pi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let R=!1,C=null;this._outputColorSpace=ai;let F=0,N=0,I=null,O=-1,B=null;const K=new vt,j=new vt;let ee=null;const ue=new it(0);let ge=0,De=t.width,Xe=t.height,Pe=1,Y=null,ae=null;const te=new vt(0,0,De,Xe),we=new vt(0,0,De,Xe);let Ie=!1;const Re=new dl;let nt=!1,Be=!1;const Ze=new wt,ut=new V,He=new vt,Pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let gt=!1;function Zt(){return I===null?Pe:1}let k=i;function Ct(T,U){return t.getContext(T,U)}try{const T={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${el}`),t.addEventListener("webglcontextlost",J,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",ke,!1),k===null){const U="webgl2";if(k=Ct(U,T),k===null)throw Ct(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw Je("WebGLRenderer: "+T.message),T}let Ge,dt,he,xt,A,M,z,$,Q,ie,le,X,Z,me,_e,re,ne,Le,Oe,Qe,D,se,q;function ye(){Ge=new y0(k),Ge.init(),D=new ly(k,Ge),dt=new c0(k,Ge,e,D),he=new ry(k,Ge),dt.reversedDepthBuffer&&d&&he.buffers.depth.setReversed(!0),xt=new v0(k),A=new qg,M=new oy(k,Ge,he,A,dt,D,xt),z=new g0(L),$=new Eu(k),se=new o0(k,$),Q=new x0(k,$,xt,se),ie=new M0(k,Q,$,se,xt),Le=new S0(k,dt,M),_e=new h0(A),le=new Xg(L,z,Ge,dt,se,_e),X=new py(L,A),Z=new $g,me=new ey(Ge),ne=new r0(L,z,he,ie,g,l),re=new ay(L,ie,dt),q=new my(k,xt,dt,he),Oe=new l0(k,Ge,xt),Qe=new _0(k,Ge,xt),xt.programs=le.programs,L.capabilities=dt,L.extensions=Ge,L.properties=A,L.renderLists=Z,L.shadowMap=re,L.state=he,L.info=xt}ye(),v!==ii&&(w=new E0(v,t.width,t.height,s,a));const oe=new fy(L,k);this.xr=oe,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const T=Ge.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Ge.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Pe},this.setPixelRatio=function(T){T!==void 0&&(Pe=T,this.setSize(De,Xe,!1))},this.getSize=function(T){return T.set(De,Xe)},this.setSize=function(T,U,G=!0){if(oe.isPresenting){Ce("WebGLRenderer: Can't change size while VR device is presenting.");return}De=T,Xe=U,t.width=Math.floor(T*Pe),t.height=Math.floor(U*Pe),G===!0&&(t.style.width=T+"px",t.style.height=U+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,T,U)},this.getDrawingBufferSize=function(T){return T.set(De*Pe,Xe*Pe).floor()},this.setDrawingBufferSize=function(T,U,G){De=T,Xe=U,Pe=G,t.width=Math.floor(T*G),t.height=Math.floor(U*G),this.setViewport(0,0,T,U)},this.setEffects=function(T){if(v===ii){Je("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let U=0;U<T.length;U++)if(T[U].isOutputPass===!0){Ce("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(K)},this.getViewport=function(T){return T.copy(te)},this.setViewport=function(T,U,G,H){T.isVector4?te.set(T.x,T.y,T.z,T.w):te.set(T,U,G,H),he.viewport(K.copy(te).multiplyScalar(Pe).round())},this.getScissor=function(T){return T.copy(we)},this.setScissor=function(T,U,G,H){T.isVector4?we.set(T.x,T.y,T.z,T.w):we.set(T,U,G,H),he.scissor(j.copy(we).multiplyScalar(Pe).round())},this.getScissorTest=function(){return Ie},this.setScissorTest=function(T){he.setScissorTest(Ie=T)},this.setOpaqueSort=function(T){Y=T},this.setTransparentSort=function(T){ae=T},this.getClearColor=function(T){return T.copy(ne.getClearColor())},this.setClearColor=function(){ne.setClearColor(...arguments)},this.getClearAlpha=function(){return ne.getClearAlpha()},this.setClearAlpha=function(){ne.setClearAlpha(...arguments)},this.clear=function(T=!0,U=!0,G=!0){let H=0;if(T){let W=!1;if(I!==null){const pe=I.texture.format;W=m.has(pe)}if(W){const pe=I.texture.type,ve=p.has(pe),fe=ne.getClearColor(),Me=ne.getClearAlpha(),Te=fe.r,Ue=fe.g,Ve=fe.b;ve?(b[0]=Te,b[1]=Ue,b[2]=Ve,b[3]=Me,k.clearBufferuiv(k.COLOR,0,b)):(_[0]=Te,_[1]=Ue,_[2]=Ve,_[3]=Me,k.clearBufferiv(k.COLOR,0,_))}else H|=k.COLOR_BUFFER_BIT}U&&(H|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),G&&(H|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&k.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),C=T},this.dispose=function(){t.removeEventListener("webglcontextlost",J,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",ke,!1),ne.dispose(),Z.dispose(),me.dispose(),A.dispose(),z.dispose(),ie.dispose(),se.dispose(),q.dispose(),le.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",Nl),oe.removeEventListener("sessionend",kl),xn.stop()};function J(T){T.preventDefault(),ec("WebGLRenderer: Context Lost."),R=!0}function Ee(){ec("WebGLRenderer: Context Restored."),R=!1;const T=xt.autoReset,U=re.enabled,G=re.autoUpdate,H=re.needsUpdate,W=re.type;ye(),xt.autoReset=T,re.enabled=U,re.autoUpdate=G,re.needsUpdate=H,re.type=W}function ke(T){Je("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Mt(T){const U=T.target;U.removeEventListener("dispose",Mt),rt(U)}function rt(T){ki(T),A.remove(T)}function ki(T){const U=A.get(T).programs;U!==void 0&&(U.forEach(function(G){le.releaseProgram(G)}),T.isShaderMaterial&&le.releaseShaderCache(T))}this.renderBufferDirect=function(T,U,G,H,W,pe){U===null&&(U=Pt);const ve=W.isMesh&&W.matrixWorld.determinant()<0,fe=nd(T,U,G,H,W);he.setMaterial(H,ve);let Me=G.index,Te=1;if(H.wireframe===!0){if(Me=Q.getWireframeAttribute(G),Me===void 0)return;Te=2}const Ue=G.drawRange,Ve=G.attributes.position;let Ae=Ue.start*Te,ot=(Ue.start+Ue.count)*Te;pe!==null&&(Ae=Math.max(Ae,pe.start*Te),ot=Math.min(ot,(pe.start+pe.count)*Te)),Me!==null?(Ae=Math.max(Ae,0),ot=Math.min(ot,Me.count)):Ve!=null&&(Ae=Math.max(Ae,0),ot=Math.min(ot,Ve.count));const bt=ot-Ae;if(bt<0||bt===1/0)return;se.setup(W,H,fe,G,Me);let _t,lt=Oe;if(Me!==null&&(_t=$.get(Me),lt=Qe,lt.setIndex(_t)),W.isMesh)H.wireframe===!0?(he.setLineWidth(H.wireframeLinewidth*Zt()),lt.setMode(k.LINES)):lt.setMode(k.TRIANGLES);else if(W.isLine){let Bt=H.linewidth;Bt===void 0&&(Bt=1),he.setLineWidth(Bt*Zt()),W.isLineSegments?lt.setMode(k.LINES):W.isLineLoop?lt.setMode(k.LINE_LOOP):lt.setMode(k.LINE_STRIP)}else W.isPoints?lt.setMode(k.POINTS):W.isSprite&&lt.setMode(k.TRIANGLES);if(W.isBatchedMesh)if(Ge.get("WEBGL_multi_draw"))lt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Bt=W._multiDrawStarts,xe=W._multiDrawCounts,jt=W._multiDrawCount,je=Me?$.get(Me).bytesPerElement:1,ni=A.get(H).currentProgram.getUniforms();for(let Mi=0;Mi<jt;Mi++)ni.setValue(k,"_gl_DrawID",Mi),lt.render(Bt[Mi]/je,xe[Mi])}else if(W.isInstancedMesh)lt.renderInstances(Ae,bt,W.count);else if(G.isInstancedBufferGeometry){const Bt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,xe=Math.min(G.instanceCount,Bt);lt.renderInstances(Ae,bt,xe)}else lt.render(Ae,bt)};function Si(T,U,G){T.transparent===!0&&T.side===Gi&&T.forceSinglePass===!1?(T.side=Kt,T.needsUpdate=!0,zs(T,U,G),T.side=mn,T.needsUpdate=!0,zs(T,U,G),T.side=Gi):zs(T,U,G)}this.compile=function(T,U,G=null){G===null&&(G=T),E=me.get(G),E.init(U),S.push(E),G.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(E.pushLight(W),W.castShadow&&E.pushShadow(W))}),T!==G&&T.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(E.pushLight(W),W.castShadow&&E.pushShadow(W))}),E.setupLights();const H=new Set;return T.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const pe=W.material;if(pe)if(Array.isArray(pe))for(let ve=0;ve<pe.length;ve++){const fe=pe[ve];Si(fe,G,W),H.add(fe)}else Si(pe,G,W),H.add(pe)}),E=S.pop(),H},this.compileAsync=function(T,U,G=null){const H=this.compile(T,U,G);return new Promise(W=>{function pe(){if(H.forEach(function(ve){A.get(ve).currentProgram.isReady()&&H.delete(ve)}),H.size===0){W(T);return}setTimeout(pe,10)}Ge.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let ir=null;function td(T){ir&&ir(T)}function Nl(){xn.stop()}function kl(){xn.start()}const xn=new Bh;xn.setAnimationLoop(td),typeof self<"u"&&xn.setContext(self),this.setAnimationLoop=function(T){ir=T,oe.setAnimationLoop(T),T===null?xn.stop():xn.start()},oe.addEventListener("sessionstart",Nl),oe.addEventListener("sessionend",kl),this.render=function(T,U){if(U!==void 0&&U.isCamera!==!0){Je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;C!==null&&C.renderStart(T,U);const G=oe.enabled===!0&&oe.isPresenting===!0,H=w!==null&&(I===null||G)&&w.begin(L,I);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(U),U=oe.getCamera()),T.isScene===!0&&T.onBeforeRender(L,T,U,I),E=me.get(T,S.length),E.init(U),E.state.textureUnits=M.getTextureUnits(),S.push(E),Ze.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Re.setFromProjectionMatrix(Ze,Ai,U.reversedDepth),Be=this.localClippingEnabled,nt=_e.init(this.clippingPlanes,Be),y=Z.get(T,P.length),y.init(),P.push(y),oe.enabled===!0&&oe.isPresenting===!0){const ve=L.xr.getDepthSensingMesh();ve!==null&&nr(ve,U,-1/0,L.sortObjects)}nr(T,U,0,L.sortObjects),y.finish(),L.sortObjects===!0&&y.sort(Y,ae),gt=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,gt&&ne.addToRenderList(y,T),this.info.render.frame++,nt===!0&&_e.beginShadows();const W=E.state.shadowsArray;if(re.render(W,T,U),nt===!0&&_e.endShadows(),this.info.autoReset===!0&&this.info.reset(),(H&&w.hasRenderPass())===!1){const ve=y.opaque,fe=y.transmissive;if(E.setupLights(),U.isArrayCamera){const Me=U.cameras;if(fe.length>0)for(let Te=0,Ue=Me.length;Te<Ue;Te++){const Ve=Me[Te];Fl(ve,fe,T,Ve)}gt&&ne.render(T);for(let Te=0,Ue=Me.length;Te<Ue;Te++){const Ve=Me[Te];Ul(y,T,Ve,Ve.viewport)}}else fe.length>0&&Fl(ve,fe,T,U),gt&&ne.render(T),Ul(y,T,U)}I!==null&&N===0&&(M.updateMultisampleRenderTarget(I),M.updateRenderTargetMipmap(I)),H&&w.end(L),T.isScene===!0&&T.onAfterRender(L,T,U),se.resetDefaultState(),O=-1,B=null,S.pop(),S.length>0?(E=S[S.length-1],M.setTextureUnits(E.state.textureUnits),nt===!0&&_e.setGlobalState(L.clippingPlanes,E.state.camera)):E=null,P.pop(),P.length>0?y=P[P.length-1]:y=null,C!==null&&C.renderEnd()};function nr(T,U,G,H){if(T.visible===!1)return;if(T.layers.test(U.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(U);else if(T.isLightProbeGrid)E.pushLightProbeGrid(T);else if(T.isLight)E.pushLight(T),T.castShadow&&E.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Re.intersectsSprite(T)){H&&He.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Ze);const ve=ie.update(T),fe=T.material;fe.visible&&y.push(T,ve,fe,G,He.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Re.intersectsObject(T))){const ve=ie.update(T),fe=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),He.copy(T.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),He.copy(ve.boundingSphere.center)),He.applyMatrix4(T.matrixWorld).applyMatrix4(Ze)),Array.isArray(fe)){const Me=ve.groups;for(let Te=0,Ue=Me.length;Te<Ue;Te++){const Ve=Me[Te],Ae=fe[Ve.materialIndex];Ae&&Ae.visible&&y.push(T,ve,Ae,G,He.z,Ve)}}else fe.visible&&y.push(T,ve,fe,G,He.z,null)}}const pe=T.children;for(let ve=0,fe=pe.length;ve<fe;ve++)nr(pe[ve],U,G,H)}function Ul(T,U,G,H){const{opaque:W,transmissive:pe,transparent:ve}=T;E.setupLightsView(G),nt===!0&&_e.setGlobalState(L.clippingPlanes,G),H&&he.viewport(K.copy(H)),W.length>0&&Os(W,U,G),pe.length>0&&Os(pe,U,G),ve.length>0&&Os(ve,U,G),he.buffers.depth.setTest(!0),he.buffers.depth.setMask(!0),he.buffers.color.setMask(!0),he.setPolygonOffset(!1)}function Fl(T,U,G,H){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[H.id]===void 0){const Ae=Ge.has("EXT_color_buffer_half_float")||Ge.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[H.id]=new Ci(1,1,{generateMipmaps:!0,type:Ae?Ki:ii,minFilter:Rn,samples:Math.max(4,dt.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ye.workingColorSpace})}const pe=E.state.transmissionRenderTarget[H.id],ve=H.viewport||K;pe.setSize(ve.z*L.transmissionResolutionScale,ve.w*L.transmissionResolutionScale);const fe=L.getRenderTarget(),Me=L.getActiveCubeFace(),Te=L.getActiveMipmapLevel();L.setRenderTarget(pe),L.getClearColor(ue),ge=L.getClearAlpha(),ge<1&&L.setClearColor(16777215,.5),L.clear(),gt&&ne.render(G);const Ue=L.toneMapping;L.toneMapping=Pi;const Ve=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),E.setupLightsView(H),nt===!0&&_e.setGlobalState(L.clippingPlanes,H),Os(T,G,H),M.updateMultisampleRenderTarget(pe),M.updateRenderTargetMipmap(pe),Ge.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let ot=0,bt=U.length;ot<bt;ot++){const _t=U[ot],{object:lt,geometry:Bt,material:xe,group:jt}=_t;if(xe.side===Gi&&lt.layers.test(H.layers)){const je=xe.side;xe.side=Kt,xe.needsUpdate=!0,Bl(lt,G,H,Bt,xe,jt),xe.side=je,xe.needsUpdate=!0,Ae=!0}}Ae===!0&&(M.updateMultisampleRenderTarget(pe),M.updateRenderTargetMipmap(pe))}L.setRenderTarget(fe,Me,Te),L.setClearColor(ue,ge),Ve!==void 0&&(H.viewport=Ve),L.toneMapping=Ue}function Os(T,U,G){const H=U.isScene===!0?U.overrideMaterial:null;for(let W=0,pe=T.length;W<pe;W++){const ve=T[W],{object:fe,geometry:Me,group:Te}=ve;let Ue=ve.material;Ue.allowOverride===!0&&H!==null&&(Ue=H),fe.layers.test(G.layers)&&Bl(fe,U,G,Me,Ue,Te)}}function Bl(T,U,G,H,W,pe){T.onBeforeRender(L,U,G,H,W,pe),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),W.onBeforeRender(L,U,G,H,T,pe),W.transparent===!0&&W.side===Gi&&W.forceSinglePass===!1?(W.side=Kt,W.needsUpdate=!0,L.renderBufferDirect(G,U,H,W,T,pe),W.side=mn,W.needsUpdate=!0,L.renderBufferDirect(G,U,H,W,T,pe),W.side=Gi):L.renderBufferDirect(G,U,H,W,T,pe),T.onAfterRender(L,U,G,H,W,pe)}function zs(T,U,G){U.isScene!==!0&&(U=Pt);const H=A.get(T),W=E.state.lights,pe=E.state.shadowsArray,ve=W.state.version,fe=le.getParameters(T,W.state,pe,U,G,E.state.lightProbeGridArray),Me=le.getProgramCacheKey(fe);let Te=H.programs;H.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?U.environment:null,H.fog=U.fog;const Ue=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;H.envMap=z.get(T.envMap||H.environment,Ue),H.envMapRotation=H.environment!==null&&T.envMap===null?U.environmentRotation:T.envMapRotation,Te===void 0&&(T.addEventListener("dispose",Mt),Te=new Map,H.programs=Te);let Ve=Te.get(Me);if(Ve!==void 0){if(H.currentProgram===Ve&&H.lightsStateVersion===ve)return zl(T,fe),Ve}else fe.uniforms=le.getUniforms(T),C!==null&&T.isNodeMaterial&&C.build(T,G,fe),T.onBeforeCompile(fe,L),Ve=le.acquireProgram(fe,Me),Te.set(Me,Ve),H.uniforms=fe.uniforms;const Ae=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ae.clippingPlanes=_e.uniform),zl(T,fe),H.needsLights=ad(T),H.lightsStateVersion=ve,H.needsLights&&(Ae.ambientLightColor.value=W.state.ambient,Ae.lightProbe.value=W.state.probe,Ae.directionalLights.value=W.state.directional,Ae.directionalLightShadows.value=W.state.directionalShadow,Ae.spotLights.value=W.state.spot,Ae.spotLightShadows.value=W.state.spotShadow,Ae.rectAreaLights.value=W.state.rectArea,Ae.ltc_1.value=W.state.rectAreaLTC1,Ae.ltc_2.value=W.state.rectAreaLTC2,Ae.pointLights.value=W.state.point,Ae.pointLightShadows.value=W.state.pointShadow,Ae.hemisphereLights.value=W.state.hemi,Ae.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Ae.spotLightMatrix.value=W.state.spotLightMatrix,Ae.spotLightMap.value=W.state.spotLightMap,Ae.pointShadowMatrix.value=W.state.pointShadowMatrix),H.lightProbeGrid=E.state.lightProbeGridArray.length>0,H.currentProgram=Ve,H.uniformsList=null,Ve}function Ol(T){if(T.uniformsList===null){const U=T.currentProgram.getUniforms();T.uniformsList=Ca.seqWithValue(U.seq,T.uniforms)}return T.uniformsList}function zl(T,U){const G=A.get(T);G.outputColorSpace=U.outputColorSpace,G.batching=U.batching,G.batchingColor=U.batchingColor,G.instancing=U.instancing,G.instancingColor=U.instancingColor,G.instancingMorph=U.instancingMorph,G.skinning=U.skinning,G.morphTargets=U.morphTargets,G.morphNormals=U.morphNormals,G.morphColors=U.morphColors,G.morphTargetsCount=U.morphTargetsCount,G.numClippingPlanes=U.numClippingPlanes,G.numIntersection=U.numClipIntersection,G.vertexAlphas=U.vertexAlphas,G.vertexTangents=U.vertexTangents,G.toneMapping=U.toneMapping}function id(T,U){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;x.setFromMatrixPosition(U.matrixWorld);for(let G=0,H=T.length;G<H;G++){const W=T[G];if(W.texture!==null&&W.boundingBox.containsPoint(x))return W}return null}function nd(T,U,G,H,W){U.isScene!==!0&&(U=Pt),M.resetTextureUnits();const pe=U.fog,ve=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?U.environment:null,fe=I===null?L.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Ye.workingColorSpace,Me=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Te=z.get(H.envMap||ve,Me),Ue=H.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ve=!!G.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ae=!!G.morphAttributes.position,ot=!!G.morphAttributes.normal,bt=!!G.morphAttributes.color;let _t=Pi;H.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(_t=L.toneMapping);const lt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Bt=lt!==void 0?lt.length:0,xe=A.get(H),jt=E.state.lights;if(nt===!0&&(Be===!0||T!==B)){const ft=T===B&&H.id===O;_e.setState(H,T,ft)}let je=!1;H.version===xe.__version?(xe.needsLights&&xe.lightsStateVersion!==jt.state.version||xe.outputColorSpace!==fe||W.isBatchedMesh&&xe.batching===!1||!W.isBatchedMesh&&xe.batching===!0||W.isBatchedMesh&&xe.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&xe.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&xe.instancing===!1||!W.isInstancedMesh&&xe.instancing===!0||W.isSkinnedMesh&&xe.skinning===!1||!W.isSkinnedMesh&&xe.skinning===!0||W.isInstancedMesh&&xe.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&xe.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&xe.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&xe.instancingMorph===!1&&W.morphTexture!==null||xe.envMap!==Te||H.fog===!0&&xe.fog!==pe||xe.numClippingPlanes!==void 0&&(xe.numClippingPlanes!==_e.numPlanes||xe.numIntersection!==_e.numIntersection)||xe.vertexAlphas!==Ue||xe.vertexTangents!==Ve||xe.morphTargets!==Ae||xe.morphNormals!==ot||xe.morphColors!==bt||xe.toneMapping!==_t||xe.morphTargetsCount!==Bt||!!xe.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(je=!0):(je=!0,xe.__version=H.version);let ni=xe.currentProgram;je===!0&&(ni=zs(H,U,W),C&&H.isNodeMaterial&&C.onUpdateProgram(H,ni,xe));let Mi=!1,ji=!1,Bn=!1;const ct=ni.getUniforms(),Et=xe.uniforms;if(he.useProgram(ni.program)&&(Mi=!0,ji=!0,Bn=!0),H.id!==O&&(O=H.id,ji=!0),xe.needsLights){const ft=id(E.state.lightProbeGridArray,W);xe.lightProbeGrid!==ft&&(xe.lightProbeGrid=ft,ji=!0)}if(Mi||B!==T){he.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),ct.setValue(k,"projectionMatrix",T.projectionMatrix),ct.setValue(k,"viewMatrix",T.matrixWorldInverse);const Qi=ct.map.cameraPosition;Qi!==void 0&&Qi.setValue(k,ut.setFromMatrixPosition(T.matrixWorld)),dt.logarithmicDepthBuffer&&ct.setValue(k,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ct.setValue(k,"isOrthographic",T.isOrthographicCamera===!0),B!==T&&(B=T,ji=!0,Bn=!0)}if(xe.needsLights&&(jt.state.directionalShadowMap.length>0&&ct.setValue(k,"directionalShadowMap",jt.state.directionalShadowMap,M),jt.state.spotShadowMap.length>0&&ct.setValue(k,"spotShadowMap",jt.state.spotShadowMap,M),jt.state.pointShadowMap.length>0&&ct.setValue(k,"pointShadowMap",jt.state.pointShadowMap,M)),W.isSkinnedMesh){ct.setOptional(k,W,"bindMatrix"),ct.setOptional(k,W,"bindMatrixInverse");const ft=W.skeleton;ft&&(ft.boneTexture===null&&ft.computeBoneTexture(),ct.setValue(k,"boneTexture",ft.boneTexture,M))}W.isBatchedMesh&&(ct.setOptional(k,W,"batchingTexture"),ct.setValue(k,"batchingTexture",W._matricesTexture,M),ct.setOptional(k,W,"batchingIdTexture"),ct.setValue(k,"batchingIdTexture",W._indirectTexture,M),ct.setOptional(k,W,"batchingColorTexture"),W._colorsTexture!==null&&ct.setValue(k,"batchingColorTexture",W._colorsTexture,M));const Ji=G.morphAttributes;if((Ji.position!==void 0||Ji.normal!==void 0||Ji.color!==void 0)&&Le.update(W,G,ni),(ji||xe.receiveShadow!==W.receiveShadow)&&(xe.receiveShadow=W.receiveShadow,ct.setValue(k,"receiveShadow",W.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&U.environment!==null&&(Et.envMapIntensity.value=U.environmentIntensity),Et.dfgLUT!==void 0&&(Et.dfgLUT.value=yy()),ji){if(ct.setValue(k,"toneMappingExposure",L.toneMappingExposure),xe.needsLights&&sd(Et,Bn),pe&&H.fog===!0&&X.refreshFogUniforms(Et,pe),X.refreshMaterialUniforms(Et,H,Pe,Xe,E.state.transmissionRenderTarget[T.id]),xe.needsLights&&xe.lightProbeGrid){const ft=xe.lightProbeGrid;Et.probesSH.value=ft.texture,Et.probesMin.value.copy(ft.boundingBox.min),Et.probesMax.value.copy(ft.boundingBox.max),Et.probesResolution.value.copy(ft.resolution)}Ca.upload(k,Ol(xe),Et,M)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Ca.upload(k,Ol(xe),Et,M),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ct.setValue(k,"center",W.center),ct.setValue(k,"modelViewMatrix",W.modelViewMatrix),ct.setValue(k,"normalMatrix",W.normalMatrix),ct.setValue(k,"modelMatrix",W.matrixWorld),H.uniformsGroups!==void 0){const ft=H.uniformsGroups;for(let Qi=0,On=ft.length;Qi<On;Qi++){const Vl=ft[Qi];q.update(Vl,ni),q.bind(Vl,ni)}}return ni}function sd(T,U){T.ambientLightColor.needsUpdate=U,T.lightProbe.needsUpdate=U,T.directionalLights.needsUpdate=U,T.directionalLightShadows.needsUpdate=U,T.pointLights.needsUpdate=U,T.pointLightShadows.needsUpdate=U,T.spotLights.needsUpdate=U,T.spotLightShadows.needsUpdate=U,T.rectAreaLights.needsUpdate=U,T.hemisphereLights.needsUpdate=U}function ad(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return N},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(T,U,G){const H=A.get(T);H.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),A.get(T.texture).__webglTexture=U,A.get(T.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:G,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,U){const G=A.get(T);G.__webglFramebuffer=U,G.__useDefaultFramebuffer=U===void 0};const rd=k.createFramebuffer();this.setRenderTarget=function(T,U=0,G=0){I=T,F=U,N=G;let H=null,W=!1,pe=!1;if(T){const fe=A.get(T);if(fe.__useDefaultFramebuffer!==void 0){he.bindFramebuffer(k.FRAMEBUFFER,fe.__webglFramebuffer),K.copy(T.viewport),j.copy(T.scissor),ee=T.scissorTest,he.viewport(K),he.scissor(j),he.setScissorTest(ee),O=-1;return}else if(fe.__webglFramebuffer===void 0)M.setupRenderTarget(T);else if(fe.__hasExternalTextures)M.rebindTextures(T,A.get(T.texture).__webglTexture,A.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ue=T.depthTexture;if(fe.__boundDepthTexture!==Ue){if(Ue!==null&&A.has(Ue)&&(T.width!==Ue.image.width||T.height!==Ue.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");M.setupDepthRenderbuffer(T)}}const Me=T.texture;(Me.isData3DTexture||Me.isDataArrayTexture||Me.isCompressedArrayTexture)&&(pe=!0);const Te=A.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Te[U])?H=Te[U][G]:H=Te[U],W=!0):T.samples>0&&M.useMultisampledRTT(T)===!1?H=A.get(T).__webglMultisampledFramebuffer:Array.isArray(Te)?H=Te[G]:H=Te,K.copy(T.viewport),j.copy(T.scissor),ee=T.scissorTest}else K.copy(te).multiplyScalar(Pe).floor(),j.copy(we).multiplyScalar(Pe).floor(),ee=Ie;if(G!==0&&(H=rd),he.bindFramebuffer(k.FRAMEBUFFER,H)&&he.drawBuffers(T,H),he.viewport(K),he.scissor(j),he.setScissorTest(ee),W){const fe=A.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+U,fe.__webglTexture,G)}else if(pe){const fe=U;for(let Me=0;Me<T.textures.length;Me++){const Te=A.get(T.textures[Me]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+Me,Te.__webglTexture,G,fe)}}else if(T!==null&&G!==0){const fe=A.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,fe.__webglTexture,G)}O=-1},this.readRenderTargetPixels=function(T,U,G,H,W,pe,ve,fe=0){if(!(T&&T.isWebGLRenderTarget)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=A.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ve!==void 0&&(Me=Me[ve]),Me){he.bindFramebuffer(k.FRAMEBUFFER,Me);try{const Te=T.textures[fe],Ue=Te.format,Ve=Te.type;if(T.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+fe),!dt.textureFormatReadable(Ue)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!dt.textureTypeReadable(Ve)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=T.width-H&&G>=0&&G<=T.height-W&&k.readPixels(U,G,H,W,D.convert(Ue),D.convert(Ve),pe)}finally{const Te=I!==null?A.get(I).__webglFramebuffer:null;he.bindFramebuffer(k.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(T,U,G,H,W,pe,ve,fe=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=A.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ve!==void 0&&(Me=Me[ve]),Me)if(U>=0&&U<=T.width-H&&G>=0&&G<=T.height-W){he.bindFramebuffer(k.FRAMEBUFFER,Me);const Te=T.textures[fe],Ue=Te.format,Ve=Te.type;if(T.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+fe),!dt.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!dt.textureTypeReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ae=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Ae),k.bufferData(k.PIXEL_PACK_BUFFER,pe.byteLength,k.STREAM_READ),k.readPixels(U,G,H,W,D.convert(Ue),D.convert(Ve),0);const ot=I!==null?A.get(I).__webglFramebuffer:null;he.bindFramebuffer(k.FRAMEBUFFER,ot);const bt=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await Ff(k,bt,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Ae),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,pe),k.deleteBuffer(Ae),k.deleteSync(bt),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,U=null,G=0){const H=Math.pow(2,-G),W=Math.floor(T.image.width*H),pe=Math.floor(T.image.height*H),ve=U!==null?U.x:0,fe=U!==null?U.y:0;M.setTexture2D(T,0),k.copyTexSubImage2D(k.TEXTURE_2D,G,0,0,ve,fe,W,pe),he.unbindTexture()};const od=k.createFramebuffer(),ld=k.createFramebuffer();this.copyTextureToTexture=function(T,U,G=null,H=null,W=0,pe=0){let ve,fe,Me,Te,Ue,Ve,Ae,ot,bt;const _t=T.isCompressedTexture?T.mipmaps[pe]:T.image;if(G!==null)ve=G.max.x-G.min.x,fe=G.max.y-G.min.y,Me=G.isBox3?G.max.z-G.min.z:1,Te=G.min.x,Ue=G.min.y,Ve=G.isBox3?G.min.z:0;else{const Et=Math.pow(2,-W);ve=Math.floor(_t.width*Et),fe=Math.floor(_t.height*Et),T.isDataArrayTexture?Me=_t.depth:T.isData3DTexture?Me=Math.floor(_t.depth*Et):Me=1,Te=0,Ue=0,Ve=0}H!==null?(Ae=H.x,ot=H.y,bt=H.z):(Ae=0,ot=0,bt=0);const lt=D.convert(U.format),Bt=D.convert(U.type);let xe;U.isData3DTexture?(M.setTexture3D(U,0),xe=k.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(M.setTexture2DArray(U,0),xe=k.TEXTURE_2D_ARRAY):(M.setTexture2D(U,0),xe=k.TEXTURE_2D),he.activeTexture(k.TEXTURE0),he.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,U.flipY),he.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),he.pixelStorei(k.UNPACK_ALIGNMENT,U.unpackAlignment);const jt=he.getParameter(k.UNPACK_ROW_LENGTH),je=he.getParameter(k.UNPACK_IMAGE_HEIGHT),ni=he.getParameter(k.UNPACK_SKIP_PIXELS),Mi=he.getParameter(k.UNPACK_SKIP_ROWS),ji=he.getParameter(k.UNPACK_SKIP_IMAGES);he.pixelStorei(k.UNPACK_ROW_LENGTH,_t.width),he.pixelStorei(k.UNPACK_IMAGE_HEIGHT,_t.height),he.pixelStorei(k.UNPACK_SKIP_PIXELS,Te),he.pixelStorei(k.UNPACK_SKIP_ROWS,Ue),he.pixelStorei(k.UNPACK_SKIP_IMAGES,Ve);const Bn=T.isDataArrayTexture||T.isData3DTexture,ct=U.isDataArrayTexture||U.isData3DTexture;if(T.isDepthTexture){const Et=A.get(T),Ji=A.get(U),ft=A.get(Et.__renderTarget),Qi=A.get(Ji.__renderTarget);he.bindFramebuffer(k.READ_FRAMEBUFFER,ft.__webglFramebuffer),he.bindFramebuffer(k.DRAW_FRAMEBUFFER,Qi.__webglFramebuffer);for(let On=0;On<Me;On++)Bn&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,A.get(T).__webglTexture,W,Ve+On),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,A.get(U).__webglTexture,pe,bt+On)),k.blitFramebuffer(Te,Ue,ve,fe,Ae,ot,ve,fe,k.DEPTH_BUFFER_BIT,k.NEAREST);he.bindFramebuffer(k.READ_FRAMEBUFFER,null),he.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(W!==0||T.isRenderTargetTexture||A.has(T)){const Et=A.get(T),Ji=A.get(U);he.bindFramebuffer(k.READ_FRAMEBUFFER,od),he.bindFramebuffer(k.DRAW_FRAMEBUFFER,ld);for(let ft=0;ft<Me;ft++)Bn?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Et.__webglTexture,W,Ve+ft):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Et.__webglTexture,W),ct?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ji.__webglTexture,pe,bt+ft):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Ji.__webglTexture,pe),W!==0?k.blitFramebuffer(Te,Ue,ve,fe,Ae,ot,ve,fe,k.COLOR_BUFFER_BIT,k.NEAREST):ct?k.copyTexSubImage3D(xe,pe,Ae,ot,bt+ft,Te,Ue,ve,fe):k.copyTexSubImage2D(xe,pe,Ae,ot,Te,Ue,ve,fe);he.bindFramebuffer(k.READ_FRAMEBUFFER,null),he.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ct?T.isDataTexture||T.isData3DTexture?k.texSubImage3D(xe,pe,Ae,ot,bt,ve,fe,Me,lt,Bt,_t.data):U.isCompressedArrayTexture?k.compressedTexSubImage3D(xe,pe,Ae,ot,bt,ve,fe,Me,lt,_t.data):k.texSubImage3D(xe,pe,Ae,ot,bt,ve,fe,Me,lt,Bt,_t):T.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,pe,Ae,ot,ve,fe,lt,Bt,_t.data):T.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,pe,Ae,ot,_t.width,_t.height,lt,_t.data):k.texSubImage2D(k.TEXTURE_2D,pe,Ae,ot,ve,fe,lt,Bt,_t);he.pixelStorei(k.UNPACK_ROW_LENGTH,jt),he.pixelStorei(k.UNPACK_IMAGE_HEIGHT,je),he.pixelStorei(k.UNPACK_SKIP_PIXELS,ni),he.pixelStorei(k.UNPACK_SKIP_ROWS,Mi),he.pixelStorei(k.UNPACK_SKIP_IMAGES,ji),pe===0&&U.generateMipmaps&&k.generateMipmap(xe),he.unbindTexture()},this.initRenderTarget=function(T){A.get(T).__webglFramebuffer===void 0&&M.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?M.setTextureCube(T,0):T.isData3DTexture?M.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?M.setTexture2DArray(T,0):M.setTexture2D(T,0),he.unbindTexture()},this.resetState=function(){F=0,N=0,I=null,he.reset(),se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ai}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}}const es=80;class _y{constructor(){this.ready=!1,this.loadPromise=null,this._renderer=null,this._scene=null,this._camera=null,this._model=null,this._tmpCanvas=null,this._phases={}}init(){return this.loadPromise?this.loadPromise:(this.loadPromise=this._setup().catch(e=>{console.error("[CharacterRenderer] Failed to load model:",e)}),this.loadPromise)}draw(e,t,i,s,a,r,o){if(!this.ready)return!1;this._phases[t]||(this._phases[t]=0);const l=r>.3;l?this._phases[t]=(this._phases[t]+r*.09)%(Math.PI*2):this._phases[t]*=.88;const c=this._phases[t],h=this._model;h.rotation.y=-a+Math.PI/2,l?(h.position.y=Math.abs(Math.sin(c))*.04,h.rotation.z=Math.sin(c)*.08):o?(h.position.y=0,h.rotation.z=0,h.rotation.x=-.12):(h.position.y*=.85,h.rotation.z*=.85,h.rotation.x*=.85),this._renderer.render(this._scene,this._camera);const f=this._tmpCanvas.getContext("2d");return f.clearRect(0,0,es,es),f.drawImage(this._renderer.domElement,0,0),e.save(),e.translate(i,s),e.drawImage(this._tmpCanvas,-40,-44),e.restore(),!0}async _setup(){this._renderer=new xy({antialias:!0,alpha:!0,preserveDrawingBuffer:!0}),this._renderer.setSize(es,es),this._renderer.setPixelRatio(1),this._renderer.setClearColor(0,0),this._renderer.shadowMap.enabled=!1,this._tmpCanvas=document.createElement("canvas"),this._tmpCanvas.width=es,this._tmpCanvas.height=es,this._scene=new Qf;const e=.65;this._camera=new Za(-e,e,e,-e,.01,30),this._camera.position.set(0,9,0),this._camera.lookAt(0,0,0);const t=new vu(16777215,1.1);this._scene.add(t);const i=new vc(16777215,.9);i.position.set(1,8,2),this._scene.add(i);const s=new vc(11193599,.4);s.position.set(-2,5,-3),this._scene.add(s),this._model=await this._loadModel(),this._fitModel(this._model),this._scene.add(this._model),this.ready=!0,console.log("[CharacterRenderer] elf girl model loaded ✓")}createCustomRobotModel(){const e=new Cn,t=new on(8,5,20,8),i=new Nr({color:2040877,metalness:.95,roughness:.15,name:"robot-armor"}),s=new ht(t,i);s.position.y=20,e.add(s);const a=new on(2,2,2,8),r=new Cs({color:6749425}),o=new ht(a,r);o.rotation.x=Math.PI/2,o.position.set(0,23,7.5),e.add(o);const l=new Cn;l.position.set(0,33,0);const c=new Va(4.5,12,12),h=new ht(c,i);l.add(h);const f=new pn(7,1.2,4),d=new Cs({color:16727100}),u=new ht(f,d);u.position.set(0,1,3.2),l.add(u);const g=new on(.2,.2,6,4),v=new ht(g,i);v.position.set(-3.5,4,-1),v.rotation.z=-.25,l.add(v);const m=new ht(g,i);m.position.set(3.5,4,-1),m.rotation.z=.25,l.add(m),e.add(l);const p=new Va(4,8,8),b=new ht(p,i);b.position.set(-10,26,0),b.scale.set(1.2,1,1),e.add(b);const _=new ht(p,i);_.position.set(10,26,0),_.scale.set(1.2,1,1),e.add(_);const x=new Nr({color:1118481,metalness:.8,roughness:.4}),y=new on(1.5,1.2,10,6),E=new ht(y,x);E.position.set(-11,19,2),E.rotation.x=.4,e.add(E);const P=new ht(y,x);P.position.set(11,19,-2),P.rotation.x=-.4,e.add(P);const S=new pn(8,14,5),w=new ht(S,i);w.position.set(0,20,-6);const L=new on(1,1.8,4,8),R=new ht(L,x);R.position.set(-3,-8,0),w.add(R);const C=new ht(L,x);C.position.set(3,-8,0),w.add(C);const F=new on(1.2,.1,5,8),N=new Cs({color:16755200,transparent:!0,opacity:.8,blending:jr}),I=new ht(F,N);I.position.set(-3,-11,0),w.add(I);const O=new ht(F,N);O.position.set(3,-11,0),w.add(O),e.add(w);const B=new ht(y,x);B.position.set(-4,6,0),e.add(B);const K=new ht(y,x);K.position.set(4,6,0),e.add(K);const j=new pn(2,2.5,18),ee=new Nr({color:330776,metalness:.9,roughness:.2}),ue=new ht(j,ee);ue.position.set(7,16,-10),ue.rotation.y=.1,e.add(ue);const ge=new Cn;return ge.add(e),ge}_loadModel(){return Promise.resolve(this.createCustomRobotModel())}_fitModel(e){const t=new Un().setFromObject(e),i=new V;t.getSize(i);const s=new V;t.getCenter(s);const r=1.1/Math.max(i.x,i.y,i.z);e.scale.setScalar(r);const o=new Un().setFromObject(e),l=new V;o.getCenter(l),e.position.set(-l.x,-l.y,-l.z)}}const dn=new _y,da=[{id:"recruit",label:"RECRUIT",minRP:0,maxRP:999,color:"#8a9bb5",icon:"▪"},{id:"veteran",label:"VETERAN",minRP:1e3,maxRP:3999,color:"#e8c84a",icon:"◆"},{id:"elite",label:"ELITE",minRP:4e3,maxRP:1/0,color:"#ff6ef7",icon:"★"}],fa=80,ua=-40,qc={pistol:{name:"Tactical 9mm",damage:22,fireRate:300,accuracy:.95,magSize:12,range:400,reloadTime:1200,speedMultiplier:1,type:"Semi-Auto",recoil:3,bulletSpeed:14},rifle:{name:"Assault Rifle (M4A1)",damage:26,fireRate:110,accuracy:.88,magSize:30,range:600,reloadTime:2200,speedMultiplier:1,type:"Automatic",recoil:4.5,bulletSpeed:16},shotgun:{name:"Shotgun (Remington 870)",damage:14,fireRate:850,accuracy:.65,magSize:6,range:250,reloadTime:2800,speedMultiplier:1,type:"Pump-Action",pellets:7,recoil:12,bulletSpeed:12},sniper:{name:"Sniper Rifle (AWM)",damage:95,fireRate:1500,accuracy:.99,magSize:5,range:1200,reloadTime:2800,speedMultiplier:1,type:"Bolt-Action",recoil:18,bulletSpeed:24},smg:{name:"SMG (MP5)",damage:18,fireRate:75,accuracy:.82,magSize:30,range:350,reloadTime:1500,speedMultiplier:1,type:"Automatic",recoil:2.2,bulletSpeed:13},lmg:{name:"LMG (M249)",damage:25,fireRate:85,accuracy:.75,magSize:100,range:550,reloadTime:4500,speedMultiplier:1,type:"Automatic",recoil:6,bulletSpeed:15},dmr:{name:"DMR (M14 EBR)",damage:45,fireRate:400,accuracy:.94,magSize:20,range:800,reloadTime:2400,speedMultiplier:1,type:"Semi-Auto",recoil:8.5,bulletSpeed:20},knife:{name:"Tactical Knife",damage:55,fireRate:350,accuracy:1,magSize:1,range:60,reloadTime:0,speedMultiplier:1.15,type:"Melee",recoil:0,bulletSpeed:20},vector:{name:"Vector SMG",damage:14,fireRate:48,accuracy:.87,magSize:33,range:320,reloadTime:1100,speedMultiplier:1.02,type:"Automatic",recoil:1.8,bulletSpeed:14},famas:{name:"FAMAS Burst Carbine",damage:20,fireRate:450,accuracy:.93,magSize:25,range:550,reloadTime:1800,speedMultiplier:1,type:"Automatic",pellets:3,recoil:3.5,bulletSpeed:17},plasma:{name:"Plasma Rifle PL-45",damage:32,fireRate:150,accuracy:.92,magSize:20,range:600,reloadTime:2e3,speedMultiplier:1,type:"Automatic",recoil:2,bulletSpeed:10},railgun:{name:"Railgun RG-X",damage:85,fireRate:1400,accuracy:.99,magSize:5,range:1200,reloadTime:3500,speedMultiplier:.95,type:"Automatic",recoil:22,bulletSpeed:32}},ts={cyan:{body:"#3ba39f",armor:"#16202c",helmet:"#66fcf1"},green:{body:"#39db14",armor:"#133d07",helmet:"#5eff39"},purple:{body:"#9d3bff",armor:"#20083c",helmet:"#c47aff"},orange:{body:"#ff7f3b",armor:"#3f1b07",helmet:"#ff9d7a"},yellow:{body:"#ffd700",armor:"#3a3000",helmet:"#ffea70"},red:{body:"#ff3c3c",armor:"#3a0707",helmet:"#ff7a7a"}};class vy{constructor(e,t,i,s,a,r,o=!1,l=!1){this.id=e,this.x=t,this.y=i,this.vx=0,this.vy=0,this.radius=18,this.angle=0,this.name=s,this.isLocal=o,this.isBot=l,this.colorTheme=r||(o?"cyan":"red"),this.isTeammate=!1,this.health=100,this.maxHealth=100,this.score=0,this.rp=o?parseInt(localStorage.getItem("tacticstrike_rp")||"0"):0,this.rank=this._calcRank(this.rp),this.weaponKey=a,this.weapon={...qc[a]},this.primaryWeaponKey=a,this.activeSlot=1,this.primaryAmmoInMag=this.weapon.magSize,this.primaryReserveAmmo=this.weapon.magSize*3,this.ammoInMag=this.weapon.magSize,this.reserveAmmo=this.weapon.magSize*3,this.maxReserveAmmo=this.weapon.magSize*5,this.isReloading=!1,this.reloadStartTime=0,this.lastFiredTime=0,this.accel=.3,this.maxSpeed=3.4,this.friction=.84,this.muzzleFlash=0,this.footstepTimer=0,this.currentSpeed=0,this.flashGrenades=1,this.flashAlpha=0,this.throwFlashbangRequest=!1,this.botTargetX=t,this.botTargetY=i,this.botState="patrol",this.lastKnownPlayerPos=null,this.botReactTime=0,this.botLastDecisionTime=0,this.botShootDelay=0,this.flashlightActive=!0,this.botStrafeDir=Math.random()>.5?1:-1,this.botLastStrafeToggle=0,this.dashTrails=[],this.networkJustDashed=!1,this.weaponXP=0,this.weaponLevel=1,this.weaponLevelUpAlert=0,this.healthPacks=0,this.ammoPacks=0}_calcRank(e){for(let t=da.length-1;t>=0;t--)if(e>=da[t].minRP)return da[t];return da[0]}applyRankDelta(e){this.rp=Math.max(0,this.rp+e);const t=this._calcRank(this.rp),i=t.id!==this.rank.id;if(this.rank=t,this.isLocal)try{localStorage.setItem("tacticstrike_rp",String(this.rp))}catch{}return i}addWeaponXP(e){if(this.health<=0)return;this.weaponXP+=e;let t=!1;for(;this.weaponXP>=this.weaponLevel*100;)this.weaponXP-=this.weaponLevel*100,this.weaponLevel++,t=!0;t&&(this.weaponLevelUpAlert=4,this.isLocal&&!this.isBot&&this.updateHUD())}changeWeapon(e){this.weaponKey=e,this.weapon={...qc[e]},this.ammoInMag=this.weapon.magSize,this.reserveAmmo=this.weapon.magSize*3,this.isReloading=!1,e!=="knife"&&(this.primaryWeaponKey=e,this.primaryAmmoInMag=this.ammoInMag,this.primaryReserveAmmo=this.reserveAmmo)}switchSlot(e){e!==this.activeSlot&&(this.activeSlot===1&&(this.primaryAmmoInMag=this.ammoInMag,this.primaryReserveAmmo=this.reserveAmmo),this.activeSlot=e,e===1?(this.changeWeapon(this.primaryWeaponKey),this.ammoInMag=this.primaryAmmoInMag,this.reserveAmmo=this.primaryReserveAmmo):e===2&&(this.changeWeapon("knife"),this.ammoInMag=1,this.reserveAmmo=1/0),this.isLocal&&!this.isBot&&(this.updateHUD(),window.AppSocket&&window.AppSocket.emit("select-weapon",{weapon:this.weaponKey})))}update(e,t,i,s,a,r=null,o=null){if(this.health<=0)return;const l=window.gameEngine&&window.gameEngine.matchMode==="sabotage",c=Math.max(1,Math.min(150,a-(this.lastUpdateTime||a)));if(l)if(this.team===1){if(this.flashlightActive=!1,this.weaponKey="none",this.isLocal&&this.inVent){this.vx=0,this.vy=0,this.lastUpdateTime=a,this.health=Math.min(this.health,this.maxHealth),this.flashAlpha=Math.max(0,this.flashAlpha-c*5e-4);return}}else this.flashlightActive=!0;this.lastUpdateTime||(this.lastUpdateTime=a);const h=a-this.lastUpdateTime;this.lastUpdateTime=a;const f=Date.now();this.adrenalineActive=!!(this.adrenalineEndTime&&f<this.adrenalineEndTime),this.overdriveActive=!!(this.overdriveEndTime&&f<this.overdriveEndTime),this.updateBuffsHUD(f);const d=Math.max(1,Math.min(150,h)),u=d/16.67,v=window.gameEngine&&window.gameEngine.isRanked?1.25:1;if(this.isLocal&&!this.isBot){this.handleLocalInput(e,t,s,a,u),this.updateDashHUD(a);const L=window.gameEngine&&window.gameEngine.devCheatActive;if(this.maxHealth=L?200:100,this.aimbotHasLOS=!1,L){this.health>200&&(this.health=200);const R=this.team===1?2:1,C=window.gameEngine.players.filter(F=>F!==this&&F.health>0&&F.team===R);if(C.length>0){const F=window.gameEngine.map;C.sort((I,O)=>Math.hypot(this.x-I.x,this.y-I.y)-Math.hypot(this.x-O.x,this.y-O.y));let N=null;if(F&&(N=C.find(I=>this.checkLineOfSight(F,this.x,this.y,I.x,I.y))),N){const I=Math.hypot(this.x-N.x,this.y-N.y),O=this.weapon.range||400;if(I<=O){this.aimbotHasLOS=!0;const B=N.x-this.x,K=N.y-this.y,j=I>0?Math.max(0,I-22)/I:0,ee=B*j,ue=K*j,ge=this.weapon.bulletSpeed||15,De=N.vx||0,Xe=N.vy||0,Pe=De*De+Xe*Xe,Y=ge*ge-Pe,ae=-2*(ee*De+ue*Xe),te=-(ee*ee+ue*ue);let we=0;if(Math.abs(Y)>.001){const nt=ae*ae-4*Y*te;if(nt>=0){const Be=(-ae+Math.sqrt(nt))/(2*Y),Ze=(-ae-Math.sqrt(nt))/(2*Y);Be>0&&Ze>0?we=Math.min(Be,Ze):Be>0?we=Be:Ze>0&&(we=Ze)}}else if(Math.abs(ae)>.001){const nt=-te/ae;nt>0&&(we=nt)}const Ie=N.x+De*we,Re=N.y+Xe*we;this.angle=Math.atan2(Re-this.y,Ie-this.x)}}}}else this.health>100&&(this.health=100)}else this.isBot&&r&&this.handleBotAI(i,s,a,r,o,u);const m=this.isLocal&&e&&e.shift,p=this.adrenalineActive?1.35:1,b=this.weapon.speedMultiplier*(m?1.75:1)*v*p;let _=this.maxSpeed*b;this.lastDashTime&&a-this.lastDashTime<200&&(_=22,(!this.lastTrailSpawnTime||a-this.lastTrailSpawnTime>25)&&(this.dashTrails||(this.dashTrails=[]),this.dashTrails.push({x:this.x,y:this.y,angle:this.angle,time:a}),this.lastTrailSpawnTime=a)),this.dashTrails&&this.dashTrails.length>0&&(this.dashTrails=this.dashTrails.filter(L=>a-L.time<180)),this.vx*=Math.pow(this.friction,u),this.vy*=Math.pow(this.friction,u);const E=Math.sqrt(this.vx*this.vx+this.vy*this.vy);E>_&&(this.vx=this.vx/E*_,this.vy=this.vy/E*_),this.currentSpeed=E;const P=this.x+this.vx*u,S=this.y+this.vy*u,w=i.checkCircleCollision(P,S,this.radius);if(this.x=w.x,this.y=w.y,(Math.abs(this.vx)>.5||Math.abs(this.vy)>.5)&&(this.footstepTimer+=E,this.footstepTimer>120&&(this.footstepTimer=0,s))){const L=o?Math.hypot(this.x-o.x,this.y-o.y):0;(this.isLocal||L<450)&&s.playFootstep()}if(this.isReloading&&a-this.reloadStartTime>=this.weapon.reloadTime){const R=this.weapon.magSize-this.ammoInMag,C=Math.min(R,this.reserveAmmo);this.ammoInMag+=C,this.reserveAmmo-=C,this.isReloading=!1,this.isLocal&&!this.isBot&&this.updateHUD()}this.muzzleFlash>0&&(this.muzzleFlash=Math.max(0,this.muzzleFlash-.15*u)),this.flashAlpha>0&&(this.flashAlpha=Math.max(0,this.flashAlpha-.008*u)),this.weaponLevelUpAlert>0&&(this.weaponLevelUpAlert=Math.max(0,this.weaponLevelUpAlert-d/1e3))}handleLocalInput(e,t,i,s,a){if(window.gameEngine&&window.gameEngine.activeMinigame){this.vx=0,this.vy=0;return}const o=e&&e.shift?1.75:1;let c=window.gameEngine&&window.gameEngine.isRanked?1.25:1;this.adrenalineActive&&(c*=1.35);const h=this.accel*c;let f=0,d=0;if((e.w||e.arrowup)&&(d-=h*o),(e.s||e.arrowdown)&&(d+=h*o),(e.a||e.arrowleft)&&(f-=h*o),(e.d||e.arrowright)&&(f+=h*o),f!==0&&d!==0&&(f*=.7071,d*=.7071),this.vx+=f*a,this.vy+=d*a,this.angle=t.angle,e&&e[" "]&&(!this.lastDashTime||s-this.lastDashTime>1e4)){this.lastDashTime=s,this.justDashed=!0,this.networkJustDashed=!0;const g=22;if(this.vx=Math.cos(this.angle)*g,this.vy=Math.sin(this.angle)*g,i)try{i.playDashSound(0)}catch{}}(e.r||e.R)&&!this.isReloading&&this.ammoInMag<this.weapon.magSize&&this.reserveAmmo>0&&this.startReload(i,s)}startReload(e,t){if(this.isReloading=!0,this.reloadStartTime=t,e&&e.playReload(this.weaponKey),this.isLocal&&!this.isBot){const i=document.getElementById("reload-indicator");i&&(i.style.display="flex",setTimeout(()=>{i&&(i.style.display="none")},this.weapon.reloadTime))}}shoot(e,t,i=0){if(this.health<=0||this.isReloading||window.gameEngine&&window.gameEngine.matchMode==="sabotage"&&this.team===1)return null;window.gameEngine&&window.gameEngine.devCheatActive&&this.isLocal;const a=this.overdriveEndTime&&e<this.overdriveEndTime||this.overdriveActive?.5:1;if(e-this.lastFiredTime<this.weapon.fireRate*a)return null;if(this.weaponKey!=="knife"&&this.ammoInMag<=0)return t&&t.playDryFire(),this.lastFiredTime=e,this.reserveAmmo>0&&this.startReload(t,e),null;this.weaponKey!=="knife"&&this.ammoInMag--,this.lastFiredTime=e,this.muzzleFlash=this.weaponKey==="knife"?0:1;const r=this.weapon.recoil;return this.vx-=Math.cos(this.angle)*r*.15,this.vy-=Math.sin(this.angle)*r*.15,t&&t.playGunshot(this.weaponKey,i),this.isLocal&&!this.isBot&&this.updateHUD(),{playerId:this.id,x:this.x+Math.cos(this.angle)*22,y:this.y+Math.sin(this.angle)*22,angle:this.angle,weaponKey:this.weaponKey,damage:this.weapon.damage,bulletSpeed:this.weapon.bulletSpeed,range:this.weapon.range,recoil:r,pellets:this.weapon.pellets||1,accuracy:this.weapon.accuracy}}updateHUD(){const e=document.getElementById("hud-self-hp");e&&(e.style.width=`${Math.max(0,this.health)}%`);const t=document.getElementById("hud-self-hp-text");t&&(t.innerText=Math.round(Math.max(0,this.health)));const i=document.getElementById("hud-weapon-name");if(i&&this.weapon&&this.weapon.name){const l=this.weaponKey!=="knife"&&this.weaponKey!=="none"?` [LVL ${this.weaponLevel}]`:"";i.innerText=(this.weapon.name+l).toUpperCase()}const s=document.getElementById("hud-ammo-val");s&&(s.innerText=`${this.ammoInMag} / ${this.reserveAmmo}`);const a=document.getElementById("hud-flash-val");a&&(a.innerText=`FLASH [${this.flashGrenades!==void 0?this.flashGrenades:1}]`,this.flashGrenades<=0?(a.style.color="#ff3c3c",a.style.borderColor="rgba(255, 60, 60, 0.3)"):(a.style.color="#ffd700",a.style.borderColor="rgba(255, 215, 0, 0.3)"));const r=document.getElementById("hud-stashed-packs");r&&(r.innerHTML=`MEDKITS [${this.healthPacks||0}] &nbsp; AMMO PACKS [${this.ammoPacks||0}]`);const o=document.getElementById("hud-weapon-xp-wrapper");if(o)if(this.weaponKey!=="knife"&&this.weaponKey!=="none"){o.style.display="flex";const l=this.weaponLevel*100,c=this.weaponXP/l*100,h=document.getElementById("hud-weapon-xp");h&&(h.style.width=`${c}%`);const f=document.getElementById("hud-weapon-xp-text");f&&(f.innerText=`${this.weaponXP}/${l}`)}else o.style.display="none";for(let l=1;l<=3;l++){const c=document.getElementById(`inv-slot-${l}`);if(c){if(l===3)c.innerText=`[3] FLASH (${this.flashGrenades!==void 0?this.flashGrenades:1})`;else if(l===1){const h=this.primaryWeaponKey?this.primaryWeaponKey.toUpperCase():"PRIMARY";c.innerText=`[1] ${h}`}this.activeSlot===l?(c.style.background="rgba(102, 252, 241, 0.12)",c.style.borderColor="var(--neon-cyan)",c.style.color="#fff",c.style.boxShadow="0 0 8px rgba(102,252,241,0.2)"):(c.style.background="rgba(0, 0, 0, 0.4)",c.style.borderColor="rgba(255,255,255,0.08)",c.style.color="rgba(255,255,255,0.5)",c.style.boxShadow="none")}}}updateDashHUD(e){const i=document.getElementById("hud-dash-status"),s=document.getElementById("hud-dash-icon");if(i)if(!this.lastDashTime||e-this.lastDashTime>=1e4)i.innerText="DASH READY (SPACE)",i.style.color="var(--neon-cyan)",s&&(s.innerText="⚡",s.style.color="var(--neon-cyan)");else{const a=Math.ceil((1e4-(e-this.lastDashTime))/1e3);i.innerText=`DASH COOLDOWN: ${a}s`,i.style.color="#ff3c3c",s&&(s.innerText="⏳",s.style.color="#ff3c3c")}}takeDamage(e,t){if(!(this.health<=0)){if(this.health=Math.max(0,this.health-e),t&&t.playFleshHit(),this.isLocal&&!this.isBot){this.updateHUD();const i=document.getElementById("game-canvas");i&&(i.style.filter="drop-shadow(0 0 10px rgba(255, 0, 0, 0.4))",setTimeout(()=>i.style.filter="none",150))}if(this.isBot&&this.health>0){const i=Date.now();if((!this.lastDashTime||i-this.lastDashTime>3e3)&&Math.random()<.6){this.lastDashTime=i,this.networkJustDashed=!0;const a=this.angle+Math.PI/2*(Math.random()>.5?1:-1);if(this.vx=Math.cos(a)*20,this.vy=Math.sin(a)*20,t&&t.playFrictionalScrape)try{t.playFrictionalScrape(0,.4,.5)}catch{}}}}}checkPickups(e,t){this.health<=0||e.items.forEach(i=>{if(!i.active)return;if(Math.hypot(this.x-i.x,this.y-i.y)<this.radius+12){if(i.active=!1,i.type==="health"){if(this.health>=this.maxHealth)if(this.healthPacks<2)this.healthPacks++,t&&t.playPickup(),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+1 STASHED MEDKIT","#ff6ef7"));else{i.active=!0;return}else if(t&&t.playPickup(),this.health=Math.min(this.maxHealth,this.health+35),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+35 HEALTH"),window.AppSocket)){const r=window.gameEngine&&window.gameEngine.devCheatActive?Math.round(this.health/2):this.health;window.AppSocket.emit("sync-health",{playerId:this.id,health:r})}}else if(i.type==="ammo")if(this.reserveAmmo>=this.maxReserveAmmo)if(this.ammoPacks<2)this.ammoPacks++,t&&t.playPickup(),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+1 STASHED AMMO PACK","#ff6ef7"));else{i.active=!0;return}else{t&&t.playPickup();const a=this.weapon.magSize*2;this.reserveAmmo=Math.min(this.maxReserveAmmo,this.reserveAmmo+a),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+AMMO"))}else i.type==="adrenaline"?(t&&t.playPickup(),this.adrenalineEndTime=Date.now()+8e3,this.adrenalineActive=!0,this.isLocal&&!this.isBot&&this.showTextNotification("⚡ SPEED BOOST ACTIVE")):i.type==="overdrive"&&(this.overdriveEndTime=Date.now()+6e3,this.overdriveActive=!0,this.isLocal&&!this.isBot&&this.showTextNotification("🔥 OVERDRIVE CHARGED"));this.isLocal&&!this.isBot&&window.AppSocket&&window.AppSocket.emit("pickup-item",{itemId:i.id})}})}showTextNotification(e,t="#ffd700"){this.floatingText={text:e,timer:45,yOffset:-30,color:t}}handleBotAI(e,t,i,s,a,r){const o=Math.hypot(this.x-s.x,this.y-s.y),c=!s.inVent&&o<700&&this.checkLineOfSight(e,this.x,this.y,s.x,s.y);let f=Math.atan2(s.y-this.y,s.x-this.x)-this.angle;for(;f<-Math.PI;)f+=Math.PI*2;for(;f>Math.PI;)f-=Math.PI*2;const d=Math.abs(f)<=32.5*Math.PI/180,u=c&&(o<140||s.flashlightActive||this.flashlightActive&&d);i-s.lastFiredTime<60&&o<900&&!u&&this.botState!=="chase"&&(this.botState="search",this.lastKnownPlayerPos={x:s.x,y:s.y},this.botTargetX=s.x,this.botTargetY=s.y,this.angle=Math.atan2(s.y-this.y,s.x-this.x));let v=!1;if(window.gameEngine&&window.gameEngine.matchMode==="sabotage"){const R=window.gameEngine.tasks?window.gameEngine.tasks.filter(C=>C.alarmActive):[];if(R.length>0){R.sort((N,I)=>Math.hypot(this.x-N.x,this.y-N.y)-Math.hypot(this.x-I.x,this.y-I.y));const C=R[0];u&&o<120||(this.botState="search",this.botTargetX=C.x,this.botTargetY=C.y,this.angle=Math.atan2(C.y-this.y,C.x-this.x),this.botLastDecisionTime=i,v=!0)}}const m=i-this.botLastDecisionTime;if(!v&&m>250){if(this.botLastDecisionTime=i,i-this.botLastStrafeToggle>1e3&&(this.botStrafeDir=Math.random()>.5?1:-1,this.botLastStrafeToggle=i),this.health<35&&Math.random()<.3){const R=e.items.filter(C=>C.active&&C.type==="health");R.length>0&&(R.sort((C,F)=>Math.hypot(this.x-C.x,this.y-C.y)-Math.hypot(this.x-F.x,this.y-F.y)),this.botTargetX=R[0].x,this.botTargetY=R[0].y,this.botState="patrol")}if(u){if(this.botState="chase",this.lastKnownPlayerPos={x:s.x,y:s.y},this.angle=Math.atan2(s.y-this.y,s.x-this.x),this.flashGrenades>0&&o>220&&o<500&&Math.random()<.05&&(this.throwFlashbangRequest=!0),(!this.lastDashTime||i-this.lastDashTime>3e3)&&Math.random()<.04){this.lastDashTime=i,this.networkJustDashed=!0;const C=this.angle+(Math.random()<.3?0:Math.PI/2*(Math.random()>.5?1:-1));if(this.vx=Math.cos(C)*20,this.vy=Math.sin(C)*20,t)try{this.sound.playFrictionalScrape(0,.4,.5)}catch{}}if(this.isReloading)this.botTargetX=this.x-Math.cos(this.angle)*220,this.botTargetY=this.y-Math.sin(this.angle)*220;else if(this.weaponKey==="sniper")o<400?(this.botTargetX=this.x-Math.cos(this.angle)*200,this.botTargetY=this.y-Math.sin(this.angle)*200):(this.botTargetX=this.x,this.botTargetY=this.y);else if(this.weaponKey==="shotgun")this.botTargetX=s.x,this.botTargetY=s.y;else{const C=this.angle+Math.PI/2*this.botStrafeDir;this.botTargetX=s.x+Math.cos(C)*180+(Math.random()-.5)*60,this.botTargetY=s.y+Math.sin(C)*180+(Math.random()-.5)*60}this.ammoInMag===0&&!this.isReloading&&this.reserveAmmo>0&&this.startReload(t,i)}else this.botState==="chase"&&this.lastKnownPlayerPos?(this.botState="search",this.botTargetX=this.lastKnownPlayerPos.x,this.botTargetY=this.lastKnownPlayerPos.y):this.botState==="search"?Math.hypot(this.x-this.botTargetX,this.y-this.botTargetY)<50&&(this.botState="patrol",this.choosePatrolPoint(e)):(Math.hypot(this.x-this.botTargetX,this.y-this.botTargetY)<50||Math.random()<.02)&&this.choosePatrolPoint(e)}let p=this.botTargetX,b=this.botTargetY;if(!this.checkLineOfSight(e,this.x,this.y,this.botTargetX,this.botTargetY)){const R=this.getClosestRoomIndex(e,this.x,this.y),C=this.getClosestRoomIndex(e,this.botTargetX,this.botTargetY);if(R!==-1&&C!==-1&&R!==C){const F=this.findRoomPath(R,C);if(F.length>1){const N=F[1],I=this.getDoorway(e,R,N);if(Math.hypot(this.x-I.x,this.y-I.y)<35)if(F.length>2){const B=F[2],K=this.getDoorway(e,N,B);p=K.x,b=K.y}else p=this.botTargetX,b=this.botTargetY;else p=I.x,b=I.y}}}if(Math.hypot(this.x-p,this.y-b)>30?this.lastStuckCheckTime?i-this.lastStuckCheckTime>300&&(Math.hypot(this.x-this.lastStuckPosX,this.y-this.lastStuckPosY)<12?this.stuckDuration+=i-this.lastStuckCheckTime:this.stuckDuration=0,this.lastStuckCheckTime=i,this.lastStuckPosX=this.x,this.lastStuckPosY=this.y):(this.lastStuckCheckTime=i,this.lastStuckPosX=this.x,this.lastStuckPosY=this.y,this.stuckDuration=0):this.stuckDuration=0,this.stuckDuration>800&&(this.botState==="patrol"||this.botState==="search")&&(this.choosePatrolPoint(e),this.stuckDuration=0),this.stuckDuration>300){const R=this.x+Math.cos(this.angle)*45,C=this.y+Math.sin(this.angle)*45,F=e.walls.find(N=>N.type==="crate"&&R>=N.x&&R<=N.x+N.w&&C>=N.y&&C<=N.y+N.h);if(F&&(this.angle=Math.atan2(F.y+F.h/2-this.y,F.x+F.w/2-this.x),!this.isReloading&&this.ammoInMag>0&&i-this.lastFiredTime>=(this.weapon.fireRate||300))){const I=this.shoot(i,t,50);I&&window.OnBotShootCallback&&window.OnBotShootCallback(I)}}let E=window.gameEngine&&window.gameEngine.isRanked?1.25:1;this.adrenalineActive&&(E*=1.35);const P=this.accel*E;if(Math.hypot(this.x-p,this.y-b)>10){const R=Math.atan2(b-this.y,p-this.x);let C=R;if(this.stuckDuration>350)this.stuckSteerDir||(this.stuckSteerDir=Math.random()<.5?1:-1),C+=Math.PI/2*this.stuckSteerDir;else{this.stuckSteerDir=0;const F=85,N=60,I=.45,O={x:this.x+Math.cos(R)*F,y:this.y+Math.sin(R)*F},B={x:this.x+Math.cos(R-I)*N,y:this.y+Math.sin(R-I)*N},K={x:this.x+Math.cos(R+I)*N,y:this.y+Math.sin(R+I)*N},j=e.getLineIntersection({x:this.x,y:this.y},O),ee=e.getLineIntersection({x:this.x,y:this.y},B),ue=e.getLineIntersection({x:this.x,y:this.y},K);let ge=0,De=!1;const Xe=j?j.dist:F,Pe=ee?ee.dist:N,Y=ue?ue.dist:N;if(j){De=!0;const ae=1-Xe/F;Pe>Y?ge-=ae*1:Y>Pe?ge+=ae*1:ge-=ae*1}ee&&(De=!0,ge+=(1-Pe/N)*.8),ue&&(De=!0,ge-=(1-Y/N)*.8),De&&(ge=Math.max(-1,Math.min(1,ge)),C=R+ge*1.4)}this.botState!=="chase"&&(this.angle=R),this.vx+=Math.cos(C)*P*r,this.vy+=Math.sin(C)*P*r}let w=0,L=0;for(const R of e.walls){const C=Math.max(R.x,Math.min(this.x,R.x+R.w)),F=Math.max(R.y,Math.min(this.y,R.y+R.h)),N=this.x-C,I=this.y-F,O=Math.hypot(N,I);if(O<this.radius+20&&O>0){const B=(this.radius+20-O)/20;w+=N/O*B*.45,L+=I/O*B*.45}}if(this.vx+=w*r,this.vy+=L*r,u&&!this.isReloading&&this.ammoInMag>0){const R=i-this.lastFiredTime,C=this.weapon.fireRate||300;if(R>=C){const F=a?Math.hypot(this.x-a.x,this.y-a.y):0,N=this.shoot(i,t,F);N&&window.OnBotShootCallback&&window.OnBotShootCallback(N)}}}checkLineOfSight(e,t,i,s,a){return!e.getLineIntersection({x:t,y:i},{x:s,y:a})}choosePatrolPoint(e){if(!e||!e.rooms||e.rooms.length===0){this.botTargetX=Math.random()*(e.width-160)+80,this.botTargetY=Math.random()*(e.height-160)+80;return}const t=e.rooms.findIndex(r=>this.x>=r.x&&this.x<=r.x+r.w&&this.y>=r.y&&this.y<=r.y+r.h);let i=null;if(t!==-1&&Math.random()<.75){const r=t%3,o=Math.floor(t/3),l=[];for(let h=-1;h<=1;h++)for(let f=-1;f<=1;f++){const d=o+h,u=r+f;d>=0&&d<3&&u>=0&&u<3&&l.push(d*3+u)}const c=l[Math.floor(Math.random()*l.length)];i=e.rooms[c]}else i=e.rooms[Math.floor(Math.random()*e.rooms.length)];i||(i=e.rooms[0]);let s=0;const a=38;for(;s<100;){s++;const r=i.x+a+Math.random()*(i.w-a*2),o=i.y+a+Math.random()*(i.h-a*2);let l=!1;for(const c of e.walls)if(r+25>c.x&&r-25<c.x+c.w&&o+25>c.y&&o-25<c.y+c.h){l=!0;break}if(!l){this.botTargetX=r,this.botTargetY=o;return}}this.botTargetX=i.x+i.w/2,this.botTargetY=i.y+i.h/2}draw(e,t={laser:!0},i=null){var u,g;if(this.inVent)return;if(this.health<=0){e.save(),e.fillStyle="rgba(180, 0, 0, 0.35)",e.beginPath(),e.ellipse(this.x,this.y,this.radius+8,this.radius+4,0,0,Math.PI*2),e.fill(),dn.ready&&(e.save(),e.translate(this.x,this.y),e.rotate(this.angle+Math.PI/2),e.globalAlpha=.55,dn.draw(e,this.id+"_dead",0,0,0,0,!1,this.isLocal?"blue":"red"),e.restore()),e.restore();return}if(e.save(),this.health>0&&this.muzzleFlash>.15){e.save();const v=130*this.muzzleFlash,m=e.createRadialGradient(this.x,this.y,10,this.x,this.y,v);m.addColorStop(0,"rgba(255, 160, 40, 0.28)"),m.addColorStop(.5,"rgba(255, 100, 20, 0.10)"),m.addColorStop(1,"rgba(255, 50, 0, 0.0)"),e.fillStyle=m,e.beginPath(),e.arc(this.x,this.y,v,0,Math.PI*2),e.fill(),e.restore()}const s=window.gameEngine&&window.gameEngine.matchMode==="sabotage";if(t.laser&&this.isLocal&&!this.isReloading&&!s){const v=this.weapon&&this.weapon.range?this.weapon.range:1200;let m=this.x+Math.cos(this.angle)*v,p=this.y+Math.sin(this.angle)*v;if(i){const x=i.getLineIntersection({x:this.x,y:this.y},{x:m,y:p});x&&(m=x.x,p=x.y)}e.save(),e.strokeStyle=this.isLocal?"rgba(102, 252, 241, 0.5)":"rgba(255, 60, 60, 0.5)",e.lineWidth=1.2,e.beginPath(),e.moveTo(this.x,this.y),e.lineTo(m,p),e.stroke();const b=this.isLocal?"#66fcf1":"#ff3c3c",_=e.createRadialGradient(m,p,1,m,p,6);_.addColorStop(0,"#ffffff"),_.addColorStop(.3,b),_.addColorStop(1,"rgba(0, 0, 0, 0)"),e.fillStyle=_,e.beginPath(),e.arc(m,p,6,0,Math.PI*2),e.fill(),e.restore()}e.restore();const a=performance.now();this.dashTrails&&this.dashTrails.length>0&&this.dashTrails.forEach(v=>{const m=a-v.time,p=Math.max(0,.35*(1-m/180));if(p<=0)return;if(e.save(),e.globalAlpha=p,!dn.draw(e,this.id+"_trail",v.x,v.y,v.angle,0,!1)){e.save(),e.translate(v.x,v.y),e.rotate(v.angle);const _=ts[this.colorTheme]||ts[this.isLocal?"cyan":"red"];e.fillStyle=_.helmet||"#66fcf1",e.beginPath(),e.arc(0,0,this.radius,0,Math.PI*2),e.fill(),e.restore()}e.restore()});const r=Date.now(),o=this.adrenalineEndTime&&r<this.adrenalineEndTime||this.adrenalineActive,l=this.overdriveEndTime&&r<this.overdriveEndTime||this.overdriveActive;if(o||l){e.save(),e.shadowBlur=15,e.lineWidth=3,e.shadowColor=l?"#ffd700":"#39db14",e.strokeStyle=l?"rgba(255, 215, 0, 0.4)":"rgba(57, 219, 20, 0.4)";const v=this.radius+2+Math.sin(r/150)*2;e.beginPath(),e.arc(this.x,this.y,v,0,Math.PI*2),e.stroke(),e.restore()}const c=this.muzzleFlash>.1;if(!dn.draw(e,this.id,this.x,this.y,this.angle,this.currentSpeed||0,c,this.isLocal?"blue":"red")){e.save(),e.translate(this.x,this.y),e.rotate(this.angle);const v=ts[this.colorTheme]||ts[this.isLocal?"cyan":"red"],m=v.body,p=v.armor,b=v.helmet;let _=18,x=4;this.weaponKey==="rifle"&&(_=24,x=5),this.weaponKey==="shotgun"&&(_=22,x=6),this.weaponKey==="sniper"&&(_=32,x=4,e.fillStyle="#444",e.fillRect(8,-5,6,3)),this.weaponKey==="smg"&&(_=16,x=4),this.weaponKey==="lmg"&&(_=26,x=7,e.fillStyle="#222",e.fillRect(6,-8,6,16)),this.weaponKey==="dmr"&&(_=28,x=5,e.fillRect(10,-4,5,2)),this.weaponKey==="vector"&&(_=14,x=4,e.fillStyle="#333",e.fillRect(4,-6,5,12)),this.weaponKey==="famas"&&(_=20,x=5,e.fillStyle="#555",e.fillRect(6,-3,8,6)),this.weaponKey==="plasma"&&(e.fillStyle="#9b1fe8",_=20,x=5),this.weaponKey==="railgun"&&(e.fillStyle="#0d8a8a",_=30,x=6,e.fillStyle="#066",e.fillRect(6,-7,8,14)),e.fillStyle="#444",e.strokeStyle="#000",e.lineWidth=1,e.fillRect(10,-x/2,_,x),e.strokeRect(10,-x/2,_,x),e.fillStyle=p,e.strokeStyle="#000",e.lineWidth=1.5,e.beginPath(),e.arc(8,-10,5,0,Math.PI*2),e.fill(),e.stroke(),e.beginPath(),e.arc(14,6,5,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle=m,e.beginPath(),e.ellipse(0,0,this.radius,this.radius+3,0,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle=p,e.beginPath(),e.ellipse(-3,0,this.radius-4,this.radius-2,0,0,Math.PI*2),e.fill(),e.fillStyle=b,e.beginPath(),e.arc(-2,0,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#111",e.fillRect(1,-5,3,10),e.restore()}if(this.weaponKey!=="none"){e.save(),e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle=this.weaponKey==="knife"?"#b0b8c0":"#333",e.strokeStyle="rgba(0,0,0,0.7)",e.lineWidth=1;let v=18,m=3;if(this.weaponKey==="rifle"&&(v=26,m=4),this.weaponKey==="shotgun"&&(v=22,m=5),this.weaponKey==="sniper"&&(v=36,m=3),this.weaponKey==="smg"&&(v=16,m=3),this.weaponKey==="lmg"&&(v=28,m=5),this.weaponKey==="dmr"&&(v=30,m=4),this.weaponKey==="knife"&&(v=10,m=2),this.weaponKey==="vector"&&(v=14,m=3,e.fillStyle="#2a2a2a",e.fillRect(4,-5,4,10)),this.weaponKey==="famas"&&(v=20,m=4,e.fillStyle="#444",e.fillRect(5,-4,7,8)),this.weaponKey==="plasma"&&(e.fillStyle="#9b1fe8",v=20,m=5,e.fillStyle="#c455ff",e.fillRect(6,-4,6,8)),this.weaponKey==="railgun"&&(e.fillStyle="#0d8a8a",v=30,m=6,e.fillStyle="#0af",e.fillRect(4,-6,8,12)),e.fillRect(12,-m/2,v,m),e.strokeRect(12,-m/2,v,m),this.muzzleFlash>0){e.save(),e.translate(12+v,0);const p=e.createRadialGradient(0,0,2,0,0,16);p.addColorStop(0,"rgba(255, 255, 255, 1.0)"),p.addColorStop(.3,"rgba(255, 220, 0, 0.9)"),p.addColorStop(.7,"rgba(255, 80, 0, 0.5)"),p.addColorStop(1,"rgba(255, 0, 0, 0.0)"),e.fillStyle=p,e.beginPath(),e.arc(0,0,16,0,Math.PI*2),e.fill(),e.restore()}e.restore()}e.save(),e.textAlign="center";const f=this.isLocal?((u=ts[this.colorTheme])==null?void 0:u.helmet)||"#66fcf1":this.isTeammate?"#39db14":"#ff3c3c";if(this.rank){const v=this.y-this.radius-28,m=`${this.rank.icon} ${this.rank.label}`;e.font="bold 8px Orbitron";const b=e.measureText(m).width+10,_=12;e.fillStyle="rgba(0,0,0,0.65)",e.beginPath(),e.roundRect(this.x-b/2,v-_/2,b,_,3),e.fill(),e.strokeStyle=this.rank.color,e.lineWidth=1,e.stroke(),e.fillStyle=this.rank.color,e.fillText(m,this.x,v+4)}e.fillStyle=f,e.font="10px Orbitron",e.fillText(this.name.toUpperCase(),this.x,this.y-this.radius-12);const d=window.gameEngine&&window.gameEngine.matchMode==="sabotage";if(this.health>0&&!d){e.fillStyle="rgba(0,0,0,0.5)",e.fillRect(this.x-20,this.y-this.radius-8,40,4);const v=this.isLocal?((g=ts[this.colorTheme])==null?void 0:g.helmet)||"#66fcf1":this.isTeammate?"#39db14":"#ff3c3c";e.fillStyle=v,e.fillRect(this.x-20,this.y-this.radius-8,40*(this.health/this.maxHealth),4)}this.floatingText&&this.floatingText.timer>0&&(e.font="bold 9px Orbitron",e.fillStyle=this.floatingText.color||"#ffd700",e.shadowColor="#000000",e.shadowBlur=4,e.fillText(this.floatingText.text,this.x,this.y+this.floatingText.yOffset),this.floatingText.yOffset-=.4,this.floatingText.timer--),e.restore()}updateBuffsHUD(e){if(!this.isLocal||this.isBot)return;const t=document.getElementById("hud-active-buffs");if(!t)return;let i="";if(this.adrenalineActive){const s=Math.max(0,(this.adrenalineEndTime-e)/1e3).toFixed(1);i+=`<div style="font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; background: rgba(57, 219, 20, 0.15); border: 1px solid rgba(57, 219, 20, 0.4); color: #39db14; padding: 4px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 8px rgba(57, 219, 20, 0.2);">⚡ SPEED: ${s}s</div>`}if(this.overdriveActive){const s=Math.max(0,(this.overdriveEndTime-e)/1e3).toFixed(1);i+=`<div style="font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; background: rgba(255, 215, 0, 0.15); border: 1px solid rgba(255, 215, 0, 0.4); color: #ffd700; padding: 4px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);">🔥 OVERDRIVE: ${s}s</div>`}t.innerHTML=i}getRoomIndexAt(e,t,i){return!e||!e.rooms?-1:e.rooms.findIndex(s=>t>=s.x&&t<=s.x+s.w&&i>=s.y&&i<=s.y+s.h)}getClosestRoomIndex(e,t,i){const s=this.getRoomIndexAt(e,t,i);if(s!==-1)return s;if(!e||!e.rooms||e.rooms.length===0)return-1;let a=1/0,r=0;return e.rooms.forEach((o,l)=>{const c=o.x+o.w/2,h=o.y+o.h/2,f=Math.hypot(t-c,i-h);f<a&&(a=f,r=l)}),r}findRoomPath(e,t){if(e===t)return[e];const i=[[e]],s=new Set([e]);for(;i.length>0;){const a=i.shift(),r=a[a.length-1];if(r===t)return a;const o=Math.floor(r/3),l=r%3,c=[];o>0&&c.push(r-3),o<2&&c.push(r+3),l>0&&c.push(r-1),l<2&&c.push(r+1);for(const h of c)s.has(h)||(s.add(h),i.push([...a,h]))}return[e]}getDoorway(e,t,i){const s=e.rooms[t],a=e.rooms[i],r=Math.floor(t/3),o=t%3,l=Math.floor(i/3),c=i%3,h=s.x<a.x?a.x-(s.x+s.w):s.x-(a.x+a.w);if(r===l){const f=o<c?t:i,d=e.rooms[f],u=d.x+d.w,g=e.walls.filter(v=>Math.abs(v.x-u)<2&&v.y>=d.y-5&&v.y+v.h<=d.y+d.h+5);if(g.length>=2){g.sort((m,p)=>m.y-p.y);const v=(g[0].y+g[0].h+g[1].y)/2;return{x:u+h/2,y:v}}return{x:u+h/2,y:d.y+d.h/2}}else{const f=r<l?t:i,d=e.rooms[f],u=d.y+d.h,g=e.walls.filter(v=>Math.abs(v.y-u)<2&&v.x>=d.x-5&&v.x+v.w<=d.x+d.w+5);return g.length>=2?(g.sort((m,p)=>m.x-p.x),{x:(g[0].x+g[0].w+g[1].x)/2,y:u+h/2}):{x:d.x+d.w/2,y:u+h/2}}}}class pa{constructor(e){this.id=`${e.playerId}_bullet_${Date.now()}_${Math.floor(Math.random()*1e3)}`,this.playerId=e.playerId,this.x=e.x,this.y=e.y,this.prevX=e.x,this.prevY=e.y,this.angle=e.angle,this.speed=e.bulletSpeed,this.damage=e.damage,this.rangeRemaining=e.range,this.weaponKey=e.weaponKey;const s=(1-(window.gameEngine&&window.gameEngine.devCheatActive&&e.playerId===window.LocalPlayerId?1:e.accuracy))*(Math.random()-.5)*.5,a=this.angle+s;this.vx=Math.cos(a)*this.speed,this.vy=Math.sin(a)*this.speed,this.active=!0}update(e,t,i,s,a=1){if(!this.active)return;if(this.prevX=this.x,this.prevY=this.y,this.x+=this.vx*a,this.y+=this.vy*a,this.rangeRemaining-=this.speed*a,this.rangeRemaining<=0){this.active=!1;return}const r={x:this.prevX,y:this.prevY},o={x:this.x,y:this.y},l=e.getLineIntersection(r,o);if(l){if(this.x=l.x,this.y=l.y,this.active=!1,l.wall&&l.wall.type==="crate"){const c=l.wall.id,h=e.damageCrate(c,this.damage);h&&(h.broken?(s&&s.playCrateBreak(),i.spawnCrateSplinters(h.crateX,h.crateY),this.playerId===window.LocalPlayerId&&window.AppSocket&&window.AppSocket.emit("break-crate",{crateId:c,spawnedItem:h.item})):s&&s.playFleshHit())}i.spawnWallImpact(this.x,this.y,this.angle);return}for(const c of t){if(c.id===this.playerId||c.health<=0)continue;const h=t.find(d=>d.id===this.playerId);if(h&&h.team===c.team)continue;const f=this.getSegmentCircleIntersection(r,o,c);if(f){this.x=f.x,this.y=f.y,this.active=!1,i.spawnBloodSplatter(this.x,this.y,this.angle);const d=this.x-c.x,u=this.y-c.y,v=d*d+u*u<=36,m=v?1.5:1;if(window.IsOfflineMode){const p=e.checkZone?e.checkZone(this.x,this.y):null,b=p&&p.type==="damage"?p.multiplier:1,_=Math.round(this.damage*b*m),x=c.health>0;c.takeDamage(_,s);const y=x&&c.health<=0;if(this.playerId===window.LocalPlayerId){const E=t.find(P=>P.id===this.playerId);E&&E.addWeaponXP&&(y?(E.addWeaponXP(50),E.showTextNotification("+50 XP","#ffd700"),window.gameEngine&&window.gameEngine.registerLocalPlayerKill&&window.gameEngine.registerLocalPlayerKill(performance.now())):(E.addWeaponXP(10),E.showTextNotification("+10 XP","#ff6ef7"))),s&&(v?s.playCriticalHitMarker():s.playHitMarker()),v&&c.showTextNotification?c.showTextNotification("CRITICAL HEADSHOT!"):b>1&&c.showTextNotification&&c.showTextNotification(`×${b} ZONE!`),window.gameEngine&&window.gameEngine.triggerHitmarker(this.x,this.y,_,v),window.MatchStats&&(window.MatchStats.damageDealt+=_)}}else if(this.playerId===window.LocalPlayerId){const p=e.checkZone?e.checkZone(this.x,this.y):null,b=p&&p.type==="damage"?p.multiplier:1,_=Math.round(this.damage*b*m),x=c.health-_<=0,y=t.find(E=>E.id===this.playerId);y&&y.addWeaponXP&&(x?(y.addWeaponXP(50),y.showTextNotification("+50 XP","#ffd700"),window.gameEngine&&window.gameEngine.registerLocalPlayerKill&&window.gameEngine.registerLocalPlayerKill(performance.now())):(y.addWeaponXP(10),y.showTextNotification("+10 XP","#ff6ef7"))),s&&(v?s.playCriticalHitMarker():s.playHitMarker()),v&&c.showTextNotification?c.showTextNotification("CRITICAL HEADSHOT!"):b>1&&c.showTextNotification&&c.showTextNotification(`×${b} ZONE!`),window.gameEngine&&window.gameEngine.triggerHitmarker(this.x,this.y,_,v),window.MatchStats&&(window.MatchStats.damageDealt+=_),window.AppSocket&&window.AppSocket.emit("hit",{damage:_,shooterId:this.playerId,targetId:c.id,x:this.x,y:this.y,isHeadshot:v})}return}}}getSegmentCircleIntersection(e,t,i){const s=t.x-e.x,a=t.y-e.y,r=i.x-e.x,o=i.y-e.y,l=s*s+a*a;if(l===0)return null;let c=(r*s+o*a)/l;c=Math.max(0,Math.min(1,c));const h=e.x+c*s,f=e.y+c*a,d=i.x-h,u=i.y-f;return d*d+u*u<=i.radius*i.radius?{x:h,y:f}:null}draw(e){if(!this.active)return;const t=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode;if(this.weaponKey==="knife"){e.save(),e.lineWidth=3.5,e.lineCap="round",e.strokeStyle="rgba(230, 235, 255, 0.85)",t||(e.shadowColor="#66fcf1",e.shadowBlur=6),e.beginPath(),e.arc(this.x,this.y,18,this.angle-.6,this.angle+.6),e.stroke(),e.restore();return}if(this.weaponKey==="plasma"){e.save(),t||(e.shadowColor="#ff6ef7",e.shadowBlur=18);const a=e.createRadialGradient(this.x,this.y,1,this.x,this.y,7);a.addColorStop(0,"rgba(255, 200, 255, 1.0)"),a.addColorStop(.4,"rgba(230, 80, 255, 0.9)"),a.addColorStop(1,"rgba(120, 0, 180, 0.0)"),e.fillStyle=a,e.beginPath(),e.arc(this.x,this.y,7,0,Math.PI*2),e.fill(),e.restore();return}if(this.weaponKey==="railgun"){e.save(),t||(e.shadowColor="#66fcf1",e.shadowBlur=20),e.lineWidth=5,e.lineCap="round";const a=e.createLinearGradient(this.prevX,this.prevY,this.x,this.y);a.addColorStop(0,"rgba(102, 252, 241, 0.0)"),a.addColorStop(.3,"rgba(102, 252, 241, 0.7)"),a.addColorStop(1,"rgba(255, 255, 255, 1.0)"),e.strokeStyle=a,e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.lineWidth=2,e.strokeStyle="rgba(255,255,255,0.9)",e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.restore();return}e.save(),e.lineWidth=2.5,e.lineCap="round";const i=this.playerId===window.LocalPlayerId,s=e.createLinearGradient(this.prevX,this.prevY,this.x,this.y);i?(s.addColorStop(0,"rgba(102, 252, 241, 0.0)"),s.addColorStop(1,"rgba(102, 252, 241, 1.0)"),e.strokeStyle=s,t||(e.shadowColor="#66fcf1")):(s.addColorStop(0,"rgba(255, 60, 60, 0.0)"),s.addColorStop(1,"rgba(255, 60, 60, 1.0)"),e.strokeStyle=s,t||(e.shadowColor="#ff3c3c")),t||(e.shadowBlur=4),e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.restore()}}class Yc{constructor(e){this.seed=e}next(){const e=Math.sin(this.seed++)*1e4;return e-Math.floor(e)}range(e,t){return e+this.next()*(t-e)}}let Sy=class{constructor(e,t,i,s="manor"){this.width=e,this.height=t,this.seed=i,this.rng=new Yc(i),this.mapId=s,this.walls=[],this.items=[],this.zones=[],this.rooms=[],this.decorations=[],this.segments=[],this.ambientLights={},this.generateMap()}generateMap(){this.walls=[],this.items=[],this.zones=[],this.rooms=[],this.decorations=[],this.mapId==="cyberlab"?this.generateCyberLabMap():this.mapId==="arena"?this.generateArenaMap():this.generateManorMap(),this.initTerminals(),this.rebuildSegments()}generateManorMap(){const r=this.width-40,o=this.height-40,l=480,c=960,h=460,f=920,d=l-40,u=c-l-22,g=r-c-22,v=h-40,m=f-h-22,p=o-f-22,b=[{x:40,y:40,w:d,h:v,name:"Kitchen",floor:"tiles"},{x:l+22,y:40,w:u,h:v,name:"Living Room",floor:"carpet"},{x:c+22,y:40,w:g,h:v,name:"Office",floor:"wood"},{x:40,y:h+22,w:d,h:m,name:"Bathroom",floor:"tiles"},{x:l+22,y:h+22,w:u,h:m,name:"Hallway",floor:"concrete"},{x:c+22,y:h+22,w:g,h:m,name:"Bedroom 1",floor:"carpet"},{x:40,y:f+22,w:d,h:p,name:"Garage",floor:"concrete"},{x:l+22,y:f+22,w:u,h:p,name:"Master Bedroom",floor:"carpet"},{x:c+22,y:f+22,w:g,h:p,name:"Bedroom 2",floor:"wood"}];this.rooms=b,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(l,40,22,v,"v",Math.round(v*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l,h+22,22,m,"v",Math.round(m*.35-88/2),88,"wall","interior"),this._addWallWithDoorway(l,f+22,22,p,"v",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,40,22,v,"v",Math.round(v*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,h+22,22,m,"v",Math.round(m*.65-88/2),88,"wall","interior"),this._addWallWithDoorway(c,f+22,22,p,"v",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,h,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,h,u,22,"h",Math.round(u*.35-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,h,g,22,"h",Math.round(g*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,f,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,f,u,22,"h",Math.round(u*.65-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,f,g,22,"h",Math.round(g*.5-88/2),88,"wall","interior"),this._addFurniture(b),this._addDecorations(b);{const x=b[3];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.06,label:"MEDIC STATION"})}{const x=b[5];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.025,label:"REST ZONE"})}{const x=b[7];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.04,label:"RECOVERY ZONE"})}{const x=b[6];this.zones.push({x:x.x+60,y:x.y+60,w:x.w-120,h:x.h-120,type:"damage",multiplier:1.75,label:"EXPLOSIVE ZONE"})}{const x=b[1];this.zones.push({x:x.x+x.w/4,y:x.y+x.h/4,w:x.w/2,h:x.h/2,type:"damage",multiplier:1.4,label:"EXPOSED AREA"})}const _=["health","ammo","adrenaline","ammo","overdrive"];this._spawnRandomConsumables(_,"pickup"),this._spawnCrates(),this.ambientLights={brokenCeiling:{x:731,y:701,radius:240,on:!0,innerRadius:20,color:"rgba(200, 230, 255, 0.25)",colorMid:"rgba(200, 230, 255, 0.08)",pulseType:"none",fixtureType:"brokenCeiling"},lantern:{x:1171,y:250,radius:180,on:!0,innerRadius:5,color:"rgba(255, 140, 40, 0.22)",colorMid:"rgba(255, 140, 40, 0.10)",pulseType:"lantern",fixtureType:"lantern"},kitchen:{x:260,y:250,radius:200,on:!0,innerRadius:10,color:"rgba(102, 252, 241, 0.20)",colorMid:"rgba(102, 252, 241, 0.08)",pulseType:"none",fixtureType:"kitchen"},garage:{x:260,y:1150,radius:220,on:!0,innerRadius:10,color:"rgba(255, 60, 60, 0.22)",colorMid:"rgba(255, 60, 60, 0.09)",pulseType:"garage",fixtureType:"garage"},bedroom2:{x:1171,y:1150,radius:190,on:!0,innerRadius:10,color:"rgba(255, 110, 247, 0.20)",colorMid:"rgba(255, 110, 247, 0.08)",pulseType:"none",fixtureType:"bedroom2"}}}generateCyberLabMap(){const r=this.width-40,o=this.height-40,l=450,c=950,h=450,f=950,d=l-40,u=c-l-22,g=r-c-22,v=h-40,m=f-h-22,p=o-f-22,b=[{x:40,y:40,w:d,h:v,name:"Cyber Lounge",floor:"cybercarpet"},{x:l+22,y:40,w:u,h:v,name:"Quantum Lab",floor:"cybergrid"},{x:c+22,y:40,w:g,h:v,name:"Security Hub",floor:"nanogrid"},{x:40,y:h+22,w:d,h:m,name:"Server Room",floor:"cybergrid"},{x:l+22,y:h+22,w:u,h:m,name:"AI Core",floor:"cybergrid"},{x:c+22,y:h+22,w:g,h:m,name:"Cryo Chambers",floor:"nanogrid"},{x:40,y:f+22,w:d,h:p,name:"Weaponry Depot",floor:"concrete"},{x:l+22,y:f+22,w:u,h:p,name:"Reactor Matrix",floor:"reactor"},{x:c+22,y:f+22,w:g,h:p,name:"Matrix Hall",floor:"cybercarpet"}];this.rooms=b,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(l,40,22,v,"v",Math.round(v*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l,h+22,22,m,"v",Math.round(m*.45-88/2),88,"wall","interior"),this._addWallWithDoorway(l,f+22,22,p,"v",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,40,22,v,"v",Math.round(v*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,h+22,22,m,"v",Math.round(m*.55-88/2),88,"wall","interior"),this._addWallWithDoorway(c,f+22,22,p,"v",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,h,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,h,u,22,"h",Math.round(u*.45-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,h,g,22,"h",Math.round(g*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,f,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,f,u,22,"h",Math.round(u*.55-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,f,g,22,"h",Math.round(g*.5-88/2),88,"wall","interior"),this._addCyberLabFurniture(b);{const x=b[1];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.05,label:"QUANTUM STABILIZER"})}{const x=b[5];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.035,label:"CRYO RECOVERY"})}{const x=b[7];this.zones.push({x:x.x+50,y:x.y+50,w:x.w-100,h:x.h-100,type:"damage",multiplier:2,label:"REACTOR ENERGY CORE"})}const _=["health","ammo","health","adrenaline","health","ammo","overdrive"];this._spawnRandomConsumables(_,"pickup_cyber"),this._spawnCrates(),this.ambientLights={aiCore:{x:700,y:700,radius:260,on:!0,innerRadius:20,color:"rgba(102, 252, 241, 0.28)",colorMid:"rgba(102, 252, 241, 0.12)",pulseType:"quantum",fixtureType:"reactor_light"},quantumLab:{x:700,y:250,radius:220,on:!0,innerRadius:10,color:"rgba(157, 59, 255, 0.26)",colorMid:"rgba(157, 59, 255, 0.10)",pulseType:"none",fixtureType:"quantum"},reactor:{x:700,y:1150,radius:240,on:!0,innerRadius:15,color:"rgba(255, 127, 59, 0.28)",colorMid:"rgba(255, 127, 59, 0.12)",pulseType:"garage",fixtureType:"reactor_light"},serverRoom:{x:250,y:700,radius:220,on:!0,innerRadius:10,color:"rgba(57, 219, 20, 0.24)",colorMid:"rgba(57, 219, 20, 0.09)",pulseType:"none",fixtureType:"server_rack_light"},cryo:{x:1150,y:700,radius:220,on:!0,innerRadius:10,color:"rgba(102, 252, 241, 0.24)",colorMid:"rgba(102, 252, 241, 0.09)",pulseType:"none",fixtureType:"cryo_light"}}}generateArenaMap(){const r=this.width-40,o=this.height-40,l=240,c=300,h=240,f=240,d=300,u=240,g=40+l,v=g+20+c,m=40+f,p=m+20+d,b=[{x:40,y:40,w:l,h:f,name:"Alpha Spawn",floor:"concrete"},{x:g+20,y:40,w:c,h:f,name:"North Gallery",floor:"wood"},{x:v+20,y:40,w:h,h:f,name:"Omega Spawn",floor:"concrete"},{x:40,y:m+20,w:l,h:d,name:"West Corridor",floor:"tiles"},{x:g+20,y:m+20,w:c,h:d,name:"Central Core",floor:"tiles"},{x:v+20,y:m+20,w:h,h:d,name:"East Corridor",floor:"tiles"},{x:40,y:p+20,w:l,h:u,name:"Supply Vault",floor:"carpet"},{x:g+20,y:p+20,w:c,h:u,name:"South Gallery",floor:"wood"},{x:v+20,y:p+20,w:h,h:u,name:"Server Annex",floor:"carpet"}];this.rooms=b,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(g,40,20,f,"v",Math.round(f*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(g,m+20,20,d,"v",Math.round(d*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(g,p+20,20,u,"v",Math.round(u*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v,40,20,f,"v",Math.round(f*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v,m+20,20,d,"v",Math.round(d*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v,p+20,20,u,"v",Math.round(u*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(40,m,l,20,"h",Math.round(l*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(g+20,m,c,20,"h",Math.round(c*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v+20,m,h,20,"h",Math.round(h*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(40,p,l,20,"h",Math.round(l*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(g+20,p,c,20,"h",Math.round(c*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v+20,p,h,20,"h",Math.round(h*.5-80/2),80,"wall","interior");const _=b[4],x=E=>this._push({...E,type:"wall",material:"furniture"});x({x:_.x+40,y:_.y+40,w:40,h:40,label:"column"}),x({x:_.x+_.w-80,y:_.y+40,w:40,h:40,label:"column"}),x({x:_.x+40,y:_.y+_.h-80,w:40,h:40,label:"column"}),x({x:_.x+_.w-80,y:_.y+_.h-80,w:40,h:40,label:"column"}),this.zones.push({x:_.x+90,y:_.y+90,w:_.w-180,h:_.h-180,type:"healing",healRate:.05,label:"NANO MEDIC STATION"});const y=["health","ammo","adrenaline","overdrive"];this._spawnRandomConsumables(y,"pickup_arena"),this._spawnCrates(),this.ambientLights={centerSiren:{x:450,y:450,radius:180,on:!0,innerRadius:15,color:"rgba(102, 252, 241, 0.25)",colorMid:"rgba(102, 252, 241, 0.09)",pulseType:"quantum",fixtureType:"reactor_light"},alphaLight:{x:150,y:150,radius:150,on:!0,innerRadius:10,color:"rgba(255, 110, 247, 0.20)",colorMid:"rgba(255, 110, 247, 0.08)",pulseType:"none",fixtureType:"quantum"},omegaLight:{x:750,y:750,radius:150,on:!0,innerRadius:10,color:"rgba(255, 127, 59, 0.20)",colorMid:"rgba(255, 127, 59, 0.08)",pulseType:"none",fixtureType:"quantum"}}}_addCyberLabFurniture(e){const t=d=>this._push({...d,type:"wall",material:"furniture"}),i=e[0];t({x:i.x+50,y:i.y+50,w:90,h:32,label:"cyber_couch"}),t({x:i.x+50,y:i.y+120,w:90,h:32,label:"cyber_couch"}),t({x:i.x+i.w-82,y:i.y+50,w:32,h:100,label:"cyber_couch"}),t({x:i.x+i.w-150,y:i.y+80,w:45,h:45,label:"table"}),t({x:i.x+20,y:i.y+i.h-60,w:24,h:24,label:"plant"}),t({x:i.x+i.w-50,y:i.y+i.h-60,w:24,h:24,label:"plant"});const s=e[1];t({x:s.x+30,y:s.y+30,w:35,h:35,label:"containment_pod"}),t({x:s.x+s.w-65,y:s.y+30,w:35,h:35,label:"containment_pod"}),t({x:s.x+s.w/2-40,y:s.y+s.h-40,w:80,h:28,label:"cyber_console"}),t({x:s.x+30,y:s.y+s.h-100,w:35,h:35,label:"nano_charger"});const a=e[2];t({x:a.x+20,y:a.y+20,w:25,h:180,label:"shelf"}),t({x:a.x+70,y:a.y+60,w:100,h:40,label:"desk"}),t({x:a.x+105,y:a.y+110,w:30,h:30,label:"chair"});const r=e[3];t({x:r.x+40,y:r.y+30,w:24,h:100,label:"server_rack"}),t({x:r.x+110,y:r.y+30,w:24,h:100,label:"server_rack"}),t({x:r.x+40,y:r.y+190,w:24,h:100,label:"server_rack"}),t({x:r.x+110,y:r.y+190,w:24,h:100,label:"server_rack"}),t({x:r.x+r.w-50,y:r.y+r.h/2-30,w:32,h:60,label:"cyber_console"});const o=e[4];t({x:o.x+o.w/2-40,y:o.y+o.h/2-40,w:80,h:80,label:"reactor_core"}),t({x:o.x+40,y:o.y+o.h/2-15,w:45,h:30,label:"cyber_console"}),t({x:o.x+o.w-85,y:o.y+o.h/2-15,w:45,h:30,label:"cyber_console"}),t({x:o.x+o.w/2-22,y:o.y+40,w:44,h:28,label:"cyber_console"}),t({x:o.x+o.w/2-22,y:o.y+o.h-68,w:44,h:28,label:"cyber_console"});const l=e[5];t({x:l.x+30,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+85,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+140,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+l.w-50,y:l.y+l.h-100,w:32,h:65,label:"cyber_console"});const c=e[6];t({x:c.x+30,y:c.y+30,w:120,h:45,label:"desk"}),t({x:c.x+30,y:c.y+110,w:35,h:80,label:"cabinet"}),t({x:c.x+c.w-60,y:c.y+30,w:40,h:100,label:"shelf"});const h=e[7];t({x:h.x+h.w/2-30,y:h.y+h.h/2-30,w:60,h:60,label:"reactor_core"}),t({x:h.x+30,y:h.y+30,w:24,h:24,label:"plant"}),t({x:h.x+h.w-54,y:h.y+30,w:24,h:24,label:"plant"});const f=e[8];t({x:f.x+f.w/2-25,y:f.y+40,w:50,h:50,label:"table"}),t({x:f.x+50,y:f.y+f.h-70,w:80,h:32,label:"cyber_couch"}),t({x:f.x+f.w-130,y:f.y+f.h-70,w:80,h:32,label:"cyber_couch"})}_push(e){this.walls.push(e)}_addWallWithDoorway(e,t,i,s,a,r,o,l,c){if(a==="v"){const h=s,f=Math.max(12,Math.min(h-o-12,r)),d=f+o;f>0&&this._push({x:e,y:t,w:i,h:f,type:l,material:c}),d<h&&this._push({x:e,y:t+d,w:i,h:h-d,type:l,material:c})}else{const h=i,f=Math.max(12,Math.min(h-o-12,r)),d=f+o;f>0&&this._push({x:e,y:t,w:f,h:s,type:l,material:c}),d<h&&this._push({x:e+d,y:t,w:h-d,h:s,type:l,material:c})}}_addFurniture(e){const t=u=>this._push({...u,type:"wall",material:"furniture"}),i=u=>this._push({...u,type:"crate",health:40,maxHealth:40,material:"barrel"}),s=e[0];t({x:s.x+12,y:s.y+12,w:s.w-24,h:28,label:"counter"}),t({x:s.x+12,y:s.y+40,w:28,h:s.h/2-10,label:"counter"}),t({x:s.x+80,y:s.y+s.h-110,w:110,h:60,label:"table"}),t({x:s.x+80+42,y:s.y+s.h-138,w:26,h:26,label:"chair"}),t({x:s.x+80+42,y:s.y+s.h-48,w:26,h:26,label:"chair"}),t({x:s.x+18,y:s.y+s.h-50,w:24,h:24,label:"plant"}),t({x:s.x+s.w-60,y:s.y+12,w:40,h:80,label:"fridge"});const a=e[1];t({x:a.x+55,y:a.y+55,w:190,h:42,label:"sofa"}),t({x:a.x+55,y:a.y+97,w:42,h:90,label:"sofa"}),t({x:a.x+18,y:a.y+110,w:38,h:42,label:"sofa"}),t({x:a.x+a.w/2-55,y:a.y+130,w:110,h:55,label:"table"}),t({x:a.x+a.w-55,y:a.y+65,w:30,h:120,label:"tv"}),t({x:a.x+a.w-55,y:a.y+a.h-100,w:30,h:80,label:"shelf"}),t({x:a.x+a.w-50,y:a.y+18,w:24,h:24,label:"plant"});const r=e[2];t({x:r.x+18,y:r.y+18,w:140,h:52,label:"desk"}),t({x:r.x+18+55,y:r.y+18+56,w:30,h:30,label:"chair"}),t({x:r.x+r.w-38,y:r.y+12,w:22,h:210,label:"shelf"}),t({x:r.x+18,y:r.y+r.h-60,w:80,h:40,label:"cabinet"}),t({x:r.x+r.w-50,y:r.y+r.h-50,w:24,h:24,label:"plant"});const o=e[3];t({x:o.x+12,y:o.y+12,w:90,h:130,label:"tub"}),t({x:o.x+12,y:o.y+o.h-58,w:65,h:38,label:"sink"}),t({x:o.x+o.w-50,y:o.y+12,w:35,h:55,label:"cabinet"}),t({x:o.x+o.w-45,y:o.y+o.h-60,w:28,h:38,label:"toilet"});const l=e[4];t({x:l.x+l.w/2-80,y:l.y+l.h/2-45,w:160,h:90,label:"table"}),t({x:l.x+l.w/2-60,y:l.y+l.h/2-80,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2+30,y:l.y+l.h/2-80,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2-60,y:l.y+l.h/2+90,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2+30,y:l.y+l.h/2+90,w:26,h:26,label:"chair"});const c=e[5];t({x:c.x+12,y:c.y+20,w:115,h:80,label:"bed"}),t({x:c.x+12+120,y:c.y+20,w:32,h:32,label:"dresser"}),t({x:c.x+c.w-52,y:c.y+12,w:36,h:55,label:"dresser"}),t({x:c.x+c.w-52,y:c.y+80,w:36,h:55,label:"cabinet"}),t({x:c.x+12,y:c.y+c.h-90,w:80,h:40,label:"desk"}),t({x:c.x+12+27,y:c.y+c.h-46,w:26,h:26,label:"chair"});const h=e[6];t({x:h.x+40,y:h.y+75,w:210,h:130,label:"car"}),t({x:h.x+12,y:h.y+h.h-48,w:160,h:30,label:"bench"}),i({x:h.x+h.w-65,y:h.y+45,w:38,h:38,id:"barrel_0"}),i({x:h.x+h.w-65,y:h.y+93,w:38,h:38,id:"barrel_1"}),i({x:h.x+h.w-65,y:h.y+141,w:38,h:38,id:"barrel_2"});const f=e[7];t({x:f.x+f.w/2-90,y:f.y+18,w:180,h:110,label:"bed"}),t({x:f.x+f.w/2-130,y:f.y+18,w:32,h:32,label:"dresser"}),t({x:f.x+f.w/2+100,y:f.y+18,w:32,h:32,label:"dresser"}),t({x:f.x+12,y:f.y+12,w:45,h:65,label:"dresser"}),t({x:f.x+f.w-60,y:f.y+12,w:45,h:65,label:"dresser"}),t({x:f.x+18,y:f.y+f.h-50,w:24,h:24,label:"plant"});const d=e[8];t({x:d.x+12,y:d.y+20,w:130,h:90,label:"bed"}),t({x:d.x+12+135,y:d.y+20,w:32,h:32,label:"dresser"}),t({x:d.x+d.w-55,y:d.y+12,w:38,h:110,label:"shelf"}),t({x:d.x+d.w-110,y:d.y+d.h-60,w:90,h:40,label:"desk"}),t({x:d.x+d.w-78,y:d.y+d.h-95,w:26,h:26,label:"chair"}),t({x:d.x+12,y:d.y+d.h-55,w:80,h:38,label:"cabinet"})}_spawnCrates(){let i=0,s=0;for(;i<14&&s<400;){s++;const a=this.rng.range(60,this.width-100),r=this.rng.range(60,this.height-100);if(a<250&&r<250||a>this.width-250&&r>this.height-250||a<250&&r>this.height-250||a>this.width-250&&r<250)continue;let o=!1;const l=14;for(const c of this.walls)if(a+44+l>c.x&&a-l<c.x+c.w&&r+44+l>c.y&&r-l<c.y+c.h){o=!0;break}o||(this._push({x:a,y:r,w:44,h:44,type:"crate",health:50,maxHealth:50,id:`crate_${i}`,material:"crate"}),i++)}}_spawnRandomConsumables(e,t){e.forEach((s,a)=>{let r=!1,o=0;for(;!r&&o<150;){o++;const l=Math.floor(this.rng.next()*this.rooms.length),c=this.rooms[l],h=40,f=this.rng.range(c.x+h,c.x+c.w-h),d=this.rng.range(c.y+h,c.y+c.h-h);let u=!1;for(const g of this.walls)if(f+30>g.x&&f-30<g.x+g.w&&d+30>g.y&&d-30<g.y+g.h){u=!0;break}f<250&&d<250&&(u=!0),f>this.width-250&&d>this.height-250&&(u=!0),f<250&&d>this.height-250&&(u=!0),f>this.width-250&&d<250&&(u=!0),u||(this.items.push({id:`${t}_${a}`,x:f,y:d,type:s,active:!0}),r=!0)}if(!r){const l=Math.floor(this.rng.next()*this.rooms.length),c=this.rooms[l];this.items.push({id:`${t}_${a}`,x:c.x+c.w/2,y:c.y+c.h/2,type:s,active:!0})}})}checkZone(e,t){for(const i of this.zones)if(e>=i.x&&e<=i.x+i.w&&t>=i.y&&t<=i.y+i.h)return i;return null}rebuildSegments(){this.segments=[],this.walls.forEach(e=>{this.segments.push({p1:{x:e.x,y:e.y},p2:{x:e.x+e.w,y:e.y}}),this.segments.push({p1:{x:e.x+e.w,y:e.y},p2:{x:e.x+e.w,y:e.y+e.h}}),this.segments.push({p1:{x:e.x+e.w,y:e.y+e.h},p2:{x:e.x,y:e.y+e.h}}),this.segments.push({p1:{x:e.x,y:e.y+e.h},p2:{x:e.x,y:e.y}})})}checkCircleCollision(e,t,i){let s=e,a=t;for(const r of this.walls){const o=Math.max(r.x,Math.min(s,r.x+r.w)),l=Math.max(r.y,Math.min(a,r.y+r.h)),c=s-o,h=a-l,f=c*c+h*h;if(f<i*i){const d=Math.sqrt(f);if(d===0)continue;const u=i-d;s+=c/d*u,a+=h/d*u}}return{x:s,y:a}}getLineIntersection(e,t){let i=null;for(const s of this.walls){const a=[{p1:{x:s.x,y:s.y},p2:{x:s.x+s.w,y:s.y}},{p1:{x:s.x+s.w,y:s.y},p2:{x:s.x+s.w,y:s.y+s.h}},{p1:{x:s.x+s.w,y:s.y+s.h},p2:{x:s.x,y:s.y+s.h}},{p1:{x:s.x,y:s.y+s.h},p2:{x:s.x,y:s.y}}];for(const r of a){const o=this.getLineSegmentIntersection(e,t,r.p1,r.p2);if(o){const l=o.x-e.x,c=o.y-e.y,h=Math.sqrt(l*l+c*c);(!i||h<i.dist)&&(i={x:o.x,y:o.y,dist:h,wall:s})}}}return i}getLineSegmentIntersection(e,t,i,s){const a=t.x-e.x,r=t.y-e.y,o=s.x-i.x,l=s.y-i.y,c=-o*r+a*l;if(Math.abs(c)<1e-9)return null;const h=(-r*(e.x-i.x)+a*(e.y-i.y))/c,f=(o*(e.y-i.y)-l*(e.x-i.x))/c;return h>=0&&h<=1&&f>=0&&f<=1?{x:e.x+f*a,y:e.y+f*r}:null}damageCrate(e,t){const i=this.walls.findIndex(a=>a.id===e);if(i===-1)return null;const s=this.walls[i];if(s.health-=t,s.health<=0){this.walls.splice(i,1),this.rebuildSegments();let a=null;if(this.rng.next()<.5){const r=this.rng.next();let o="health";r<.4?o="health":r<.7?o="ammo":r<.85?o="adrenaline":o="overdrive",a={id:`item_${e}_${Date.now()}`,x:s.x+s.w/2,y:s.y+s.h/2,type:o,active:!0},this.items.push(a)}return{broken:!0,item:a,crateX:s.x+s.w/2,crateY:s.y+s.h/2}}return{broken:!1,health:s.health}}syncBreakCrate(e,t){const i=this.walls.findIndex(s=>s.id===e);i!==-1&&(this.walls.splice(i,1),this.rebuildSegments()),t&&!this.items.some(s=>s.id===t.id)&&this.items.push(t)}computeVisibilityPolygon(e,t,i,s=null,a=null){const r=new Set,o=f=>{let d=f;for(;d<-Math.PI;)d+=Math.PI*2;for(;d>Math.PI;)d-=Math.PI*2;return d},l=f=>{if(s===null||a===null)return!0;let d=f-s;for(;d<-Math.PI;)d+=Math.PI*2;for(;d>Math.PI;)d-=Math.PI*2;return Math.abs(d)<=a/2};if(this.walls.forEach(f=>{[{x:f.x,y:f.y},{x:f.x+f.w,y:f.y},{x:f.x+f.w,y:f.y+f.h},{x:f.x,y:f.y+f.h}].forEach(d=>{const u=Math.atan2(d.y-t,d.x-e);l(u)&&(r.add(o(u-1e-4)),r.add(u),r.add(o(u+1e-4)))})}),s!==null&&a!==null){const f=s-a/2,d=s+a/2;r.add(o(f)),r.add(o(d));for(let u=f;u<d;u+=Math.PI/18)r.add(o(u))}else for(let f=-Math.PI;f<Math.PI;f+=Math.PI/10)r.add(f);const c=[];r.forEach(f=>{const d={x:e+Math.cos(f)*i,y:t+Math.sin(f)*i},u=this.getLineIntersection({x:e,y:t},d);c.push(u&&u.dist<i?{x:u.x,y:u.y,angle:f}:{...d,angle:f})});const h=s!==null?s:0;return c.sort((f,d)=>{let u=f.angle-h;for(;u<-Math.PI;)u+=Math.PI*2;for(;u>Math.PI;)u-=Math.PI*2;let g=d.angle-h;for(;g<-Math.PI;)g+=Math.PI*2;for(;g>Math.PI;)g-=Math.PI*2;return u-g}),s!==null&&a!==null&&(c.unshift({x:e,y:t,angle:-999}),c.push({x:e,y:t,angle:999})),c}draw(e,t={shadows:!0},i=[],s=null,a=[]){this.rooms.forEach(l=>this._drawFloor(e,l)),this.decorations.forEach(l=>this._drawDecoration(e,l)),this.zones.forEach(l=>this._drawZone(e,l)),this.items.forEach(l=>{l.active&&this._drawItem(e,l)}),e.save();let r=this.width/2,o=this.height/2;if(s&&(r=s.x,o=s.y),this.walls.forEach(l=>this._drawWall(e,l,r,o)),e.restore(),this.terminals&&this.terminals.forEach(l=>{l.active&&this._drawTerminal(e,l)}),t.shadows&&i&&i.length>0){this.maskCanvas||(this.maskCanvas=document.createElement("canvas"),this.maskCtx=this.maskCanvas.getContext("2d"));const l=e.canvas.width,c=e.canvas.height;(this.maskCanvas.width!==l||this.maskCanvas.height!==c)&&(this.maskCanvas.width=l,this.maskCanvas.height=c),this.maskCtx.fillStyle="rgba(3, 4, 6, 0.995)",this.maskCtx.fillRect(0,0,l,c),this.maskCtx.save(),this.maskCtx.setTransform(e.getTransform());const h=Date.now(),d=Math.sin(h*.04)*Math.cos(h*.007)+Math.sin(h*.1)*.5>-.45;this.ambientLights.brokenCeiling&&(this.ambientLights.brokenCeiling.on=d),this.maskCtx.globalCompositeOperation="destination-out",this.maskCtx.fillStyle="white";for(const[u,g]of Object.entries(this.ambientLights)){if(!g.on)continue;const v=g.pulseType==="garage"?1+Math.sin(h/300)*.05:g.pulseType==="lantern"?1+Math.sin(h/200)*.04:g.pulseType==="quantum"?1+Math.sin(h/150)*.03:1,m=g.radius*v,p=this.maskCtx.createRadialGradient(g.x,g.y,g.innerRadius||10,g.x,g.y,m);p.addColorStop(0,"rgba(255, 255, 255, 1.0)"),p.addColorStop(.5,"rgba(255, 255, 255, 0.45)"),p.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=p,this.maskCtx.beginPath(),this.maskCtx.arc(g.x,g.y,m,0,Math.PI*2),this.maskCtx.fill()}i.forEach(u=>{if(!(u.health<=0)){if(u.flashlightActive&&u.lightPoly&&u.lightPoly.length>0){this.maskCtx.beginPath(),this.maskCtx.moveTo(u.lightPoly[0].x,u.lightPoly[0].y);for(let g=1;g<u.lightPoly.length;g++)this.maskCtx.lineTo(u.lightPoly[g].x,u.lightPoly[g].y);this.maskCtx.closePath(),this.maskCtx.fillStyle="white",this.maskCtx.fill()}if(window.gameEngine&&window.gameEngine.matchMode==="sabotage"&&u.isLocal){const g=this.maskCtx.createRadialGradient(u.x,u.y,10,u.x,u.y,150);g.addColorStop(0,"rgba(255, 255, 255, 1.0)"),g.addColorStop(.7,"rgba(255, 255, 255, 0.45)"),g.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=g,this.maskCtx.beginPath(),this.maskCtx.arc(u.x,u.y,150,0,Math.PI*2),this.maskCtx.fill()}}}),a&&a.length>0&&a.forEach(u=>{if(!u.active)return;const g=this.maskCtx.createRadialGradient(u.x,u.y,5,u.x,u.y,60);g.addColorStop(0,"rgba(255, 255, 255, 1.0)"),g.addColorStop(.5,"rgba(255, 255, 255, 0.45)"),g.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=g,this.maskCtx.beginPath(),this.maskCtx.arc(u.x,u.y,60,0,Math.PI*2),this.maskCtx.fill()}),i.forEach(u=>{if(u.health>0&&u.muzzleFlash>.15){const g=u.x+Math.cos(u.angle)*28,v=u.y+Math.sin(u.angle)*28,m=this.maskCtx.createRadialGradient(g,v,10,g,v,180*u.muzzleFlash);m.addColorStop(0,"rgba(255, 255, 255, 1.0)"),m.addColorStop(.4,"rgba(255, 255, 255, 0.5)"),m.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=m,this.maskCtx.beginPath(),this.maskCtx.arc(g,v,180*u.muzzleFlash,0,Math.PI*2),this.maskCtx.fill()}}),this.maskCtx.restore(),e.save(),e.setTransform(1,0,0,1,0,0),e.drawImage(this.maskCanvas,0,0),e.restore(),i.forEach(u=>{if(u.health>0&&u.flashlightActive&&u.lightPoly&&u.lightPoly.length>0){e.save(),e.beginPath(),e.moveTo(u.lightPoly[0].x,u.lightPoly[0].y);for(let y=1;y<u.lightPoly.length;y++)e.lineTo(u.lightPoly[y].x,u.lightPoly[y].y);e.closePath(),e.clip();const g=u.x,v=u.y,m=700,p=g+Math.cos(u.angle)*m,b=v+Math.sin(u.angle)*m,_=e.createLinearGradient(g,v,p,b);_.addColorStop(0,"rgba(255, 255, 230, 0.18)"),_.addColorStop(.35,"rgba(255, 255, 245, 0.10)"),_.addColorStop(1,"rgba(255, 255, 255, 0.0)"),e.fillStyle=_,e.fill();const x=e.createRadialGradient(g,v,10,g,v,100);x.addColorStop(0,"rgba(255, 255, 220, 0.08)"),x.addColorStop(1,"rgba(255, 255, 220, 0.0)"),e.fillStyle=x,e.fill(),e.restore()}}),e.save();for(const[u,g]of Object.entries(this.ambientLights)){if(!g.on)continue;const v=g.pulseType==="garage"?1+Math.sin(h/300)*.05:g.pulseType==="lantern"?1+Math.sin(h/200)*.04:g.pulseType==="quantum"?1+Math.sin(h/150)*.03:1,m=g.radius*v,p=e.createRadialGradient(g.x,g.y,g.innerRadius||5,g.x,g.y,m);p.addColorStop(0,g.color),p.addColorStop(.5,g.colorMid),p.addColorStop(1,"rgba(0, 0, 0, 0.0)"),e.fillStyle=p,e.beginPath(),e.arc(g.x,g.y,m,0,Math.PI*2),e.fill(),this._drawLightFixture(e,g,h)}e.restore()}}_drawLightFixture(e,t,i){const s=t.fixtureType;if(e.save(),s==="lantern")e.fillStyle="#222",e.strokeStyle="#d4af37",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="rgba(255, 180, 50, 0.9)",e.beginPath(),e.arc(t.x,t.y,3,0,Math.PI*2),e.fill();else if(s==="brokenCeiling")e.fillStyle="#333",e.strokeStyle="#555",e.lineWidth=1,e.fillRect(t.x-16,t.y-4,32,8),e.strokeRect(t.x-16,t.y-4,32,8),e.fillStyle=t.on?"#fff":"#111",e.shadowColor=t.on?"#6cf":"transparent",e.shadowBlur=t.on?10:0,e.fillRect(t.x-12,t.y-2,24,4),e.shadowBlur=0;else if(s==="kitchen")e.fillStyle="#333",e.strokeStyle="#555",e.lineWidth=1,e.fillRect(t.x-12,t.y-12,24,24),e.strokeRect(t.x-12,t.y-12,24,24),e.fillStyle="#66fcf1",e.beginPath(),e.arc(t.x,t.y,5,0,Math.PI*2),e.fill();else if(s==="garage")e.fillStyle="#222",e.strokeStyle="#ff3c3c",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ff3c3c",e.beginPath(),e.arc(t.x,t.y,3.5,0,Math.PI*2),e.fill();else if(s==="bedroom2")e.fillStyle="#2d1822",e.strokeStyle="#ff6ef7",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,9,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ff6ef7",e.beginPath(),e.arc(t.x,t.y,4,0,Math.PI*2),e.fill();else if(s==="quantum"){e.fillStyle="#100c1e",e.strokeStyle="#9d3bff",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,10,0,Math.PI*2),e.fill(),e.stroke();const a=i/100%(Math.PI*2);e.strokeStyle="#d473ff",e.lineWidth=1,e.beginPath(),e.moveTo(t.x-Math.cos(a)*8,t.y-Math.sin(a)*8),e.lineTo(t.x+Math.cos(a)*8,t.y+Math.sin(a)*8),e.stroke()}else s==="reactor_light"?(e.fillStyle="#201005",e.strokeStyle="#ff7f3b",e.lineWidth=2,e.beginPath(),e.arc(t.x,t.y,12,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x,t.y,6+Math.sin(i/200)*1.5,0,Math.PI*2),e.fill()):(s==="server_rack_light"||s==="cryo_light")&&(e.fillStyle="#111",e.strokeStyle=s==="cryo_light"?"#66fcf1":"#39db14",e.lineWidth=1.5,e.fillRect(t.x-6,t.y-6,12,12),e.strokeRect(t.x-6,t.y-6,12,12),e.fillStyle=s==="cryo_light"?"#66fcf1":"#39db14",e.beginPath(),e.arc(t.x,t.y,3,0,Math.PI*2),e.fill());e.restore()}isPointInAmbientLight(e,t,i=0){for(const[s,a]of Object.entries(this.ambientLights)){if(!a.on)continue;if(Math.hypot(e-a.x,t-a.y)<a.radius+i&&!this.getLineIntersection({x:a.x,y:a.y},{x:e,y:t}))return!0}return!1}_addDecorations(e){this.decorations=[];const t=e[0];this.decorations.push({x:t.x+50,y:t.y+55,w:120,h:40,type:"rug",style:"kitchen"});const i=e[1];this.decorations.push({x:i.x+i.w/2-120,y:i.y+110,w:240,h:160,type:"rug",style:"living"});const s=e[2];this.decorations.push({x:s.x+40,y:s.y+80,w:160,h:120,type:"rug",style:"office"});const a=e[3];this.decorations.push({x:a.x+110,y:a.y+40,w:60,h:90,type:"rug",style:"bath"});const r=e[4];this.decorations.push({x:r.x+r.w/2-180,y:r.y+40,w:360,h:60,type:"rug",style:"runner"});const o=e[5];this.decorations.push({x:o.x+30,y:o.y+110,w:140,h:160,type:"rug",style:"bedroom"});const l=e[7];this.decorations.push({x:l.x+l.w/2-120,y:l.y+80,w:240,h:220,type:"rug",style:"master"});const c=e[8];this.decorations.push({x:c.x+c.w/2-70,y:c.y+c.h/2-70,w:140,h:140,type:"rug",style:"circular"})}_drawDecoration(e,t){if(e.save(),t.type==="rug"){e.fillStyle="rgba(0,0,0,0.15)",e.fillRect(t.x+2,t.y+2,t.w,t.h);const s={kitchen:{bg:"#3a2d1f",border:"#aa8c66",text:"#55422d"},living:{bg:"#3b1c1c",border:"#d4af37",text:"#802020"},office:{bg:"#1c2d3b",border:"#66fcf1",text:"#204060"},bath:{bg:"#1f3c3a",border:"#39db14",text:"#152b2a"},runner:{bg:"#2b203c",border:"#9d3bff",text:"#4c2e73"},bedroom:{bg:"#3c3020",border:"#ffe6a3",text:"#5c4930"},master:{bg:"#222d32",border:"#66fcf1",text:"#435e6a"},circular:{bg:"#2d1822",border:"#ff6ef7",text:"#5e2540"}}[t.style]||{bg:"#222",border:"#444",text:"#333"};if(e.fillStyle=s.bg,e.strokeStyle=s.border,e.lineWidth=2,t.style==="circular")e.beginPath(),e.arc(t.x+t.w/2,t.y+t.h/2,t.w/2,0,Math.PI*2),e.fill(),e.stroke(),e.strokeStyle=s.text,e.lineWidth=1.5,e.beginPath(),e.arc(t.x+t.w/2,t.y+t.h/2,t.w/3,0,Math.PI*2),e.stroke();else{if(e.beginPath(),e.roundRect?e.roundRect(t.x,t.y,t.w,t.h,6):e.rect(t.x,t.y,t.w,t.h),e.fill(),e.stroke(),e.strokeStyle=s.border,e.lineWidth=1,e.beginPath(),t.w>t.h)for(let a=t.y+4;a<t.y+t.h;a+=6)e.moveTo(t.x,a),e.lineTo(t.x-4,a),e.moveTo(t.x+t.w,a),e.lineTo(t.x+t.w+4,a);else for(let a=t.x+4;a<t.x+t.w;a+=6)e.moveTo(a,t.y),e.lineTo(a,t.y-4),e.moveTo(a,t.y+t.h),e.lineTo(a,t.y+t.h+4);e.stroke()}}e.restore()}_drawFloor(e,t){if(e.save(),e.beginPath(),e.rect(t.x,t.y,t.w,t.h),e.clip(),t.floor==="tiles"){e.fillStyle="#121a28",e.fillRect(t.x,t.y,t.w,t.h);const i=44;for(let s=t.x;s<t.x+t.w;s+=i)for(let a=t.y;a<t.y+t.h;a+=i){const r=(Math.floor((s-t.x)/i)+Math.floor((a-t.y)/i))%2===0;e.fillStyle=r?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.04)",e.fillRect(s,a,i,i)}e.strokeStyle="rgba(40,80,120,0.25)",e.lineWidth=1;for(let s=t.x;s<=t.x+t.w;s+=i)e.beginPath(),e.moveTo(s,t.y),e.lineTo(s,t.y+t.h),e.stroke();for(let s=t.y;s<=t.y+t.h;s+=i)e.beginPath(),e.moveTo(t.x,s),e.lineTo(t.x+t.w,s),e.stroke()}else if(t.floor==="carpet"){e.fillStyle="#16102a",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(80,50,140,0.12)",e.lineWidth=1;for(let i=t.x;i<=t.x+t.w;i+=9)e.beginPath(),e.moveTo(i,t.y),e.lineTo(i,t.y+t.h),e.stroke();for(let i=t.y;i<=t.y+t.h;i+=9)e.beginPath(),e.moveTo(t.x,i),e.lineTo(t.x+t.w,i),e.stroke();e.strokeStyle="rgba(120,80,200,0.15)",e.lineWidth=3,e.strokeRect(t.x+15,t.y+15,t.w-30,t.h-30)}else if(t.floor==="wood"){e.fillStyle="#1a1208",e.fillRect(t.x,t.y,t.w,t.h);const i=32;for(let s=t.y;s<t.y+t.h;s+=i){const a=Math.floor((s-t.y)/i);e.fillStyle=a%2===0?"rgba(180,110,50,0.055)":"rgba(130,75,30,0.055)",e.fillRect(t.x,s,t.w,i-1),e.strokeStyle="rgba(70,45,18,0.35)",e.lineWidth=1,e.beginPath(),e.moveTo(t.x,s+i-1),e.lineTo(t.x+t.w,s+i-1),e.stroke(),e.strokeStyle="rgba(140,90,40,0.07)";for(let r=t.x+10;r<t.x+t.w-10;r+=t.w/5)e.beginPath(),e.moveTo(r,s),e.lineTo(r+12,s+i-1),e.stroke()}}else if(t.floor==="concrete"){e.fillStyle="#10101a",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(55,55,80,0.25)",e.lineWidth=1;const i=64;for(let s=t.x;s<=t.x+t.w;s+=i)e.beginPath(),e.moveTo(s,t.y),e.lineTo(s,t.y+t.h),e.stroke();for(let s=t.y;s<=t.y+t.h;s+=i)e.beginPath(),e.moveTo(t.x,s),e.lineTo(t.x+t.w,s),e.stroke();if(t.name==="Garage")e.fillStyle="rgba(30,25,10,0.4)",e.beginPath(),e.ellipse(t.x+150,t.y+230,60,30,.3,0,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(t.x+80,t.y+150,40,20,-.2,0,Math.PI*2),e.fill();else if(t.name==="Weaponry Depot"){e.strokeStyle="rgba(212, 175, 55, 0.15)",e.lineWidth=12,e.beginPath();for(let s=t.x;s<t.x+t.w;s+=60)e.moveTo(s,t.y),e.lineTo(s+40,t.y+40),e.moveTo(s,t.y+t.h-40),e.lineTo(s+40,t.y+t.h);e.stroke()}}else if(t.floor==="cybergrid"){e.fillStyle="#060a12",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(102, 252, 241, 0.08)",e.lineWidth=1;const i=50;for(let r=t.x;r<=t.x+t.w;r+=i)e.beginPath(),e.moveTo(r,t.y),e.lineTo(r,t.y+t.h),e.stroke();for(let r=t.y;r<=t.y+t.h;r+=i)e.beginPath(),e.moveTo(t.x,r),e.lineTo(t.x+t.w,r),e.stroke();const s=Date.now(),a=2+Math.sin(s/400)*.8;e.fillStyle="rgba(102, 252, 241, 0.45)";for(let r=t.x+i;r<t.x+t.w;r+=i)for(let o=t.y+i;o<t.y+t.h;o+=i)e.beginPath(),e.arc(r,o,a,0,Math.PI*2),e.fill()}else if(t.floor==="reactor"){e.fillStyle="#0f0a07",e.fillRect(t.x,t.y,t.w,t.h);const i=Date.now(),s=t.x+t.w/2,a=t.y+t.h/2;e.strokeStyle="rgba(255, 127, 59, 0.15)",e.lineWidth=4,e.strokeRect(t.x+8,t.y+8,t.w-16,t.h-16),e.lineWidth=2.5;const r=5;for(let l=1;l<=r;l++){const c=l*28,h=Math.sin(i/250-l*.5)*.15+.85;e.strokeStyle=`rgba(255, 127, 59, ${.08+(1-l/r)*.22})`,e.beginPath(),e.arc(s,a,c*h,0,Math.PI*2),e.stroke()}e.strokeStyle="rgba(255, 150, 80, 0.4)",e.lineWidth=1.5;const o=i/800%(Math.PI*2);e.beginPath(),e.arc(s,a,70,o,o+Math.PI*.4),e.stroke(),e.beginPath(),e.arc(s,a,110,o+Math.PI,o+Math.PI*1.4),e.stroke()}else if(t.floor==="nanogrid"){e.fillStyle="#050c08",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(57, 219, 20, 0.08)",e.lineWidth=1;const i=60;for(let r=t.x+30;r<t.x+t.w;r+=i)e.beginPath(),e.moveTo(r,t.y),e.lineTo(r,t.y+t.h),e.stroke();e.strokeStyle="rgba(57, 219, 20, 0.05)";for(let r=t.y+40;r<t.y+t.h;r+=80)e.beginPath(),e.moveTo(t.x,r),e.lineTo(t.x+t.w*.35,r),e.lineTo(t.x+t.w*.45,r-25),e.lineTo(t.x+t.w,r-25),e.stroke();const s=Date.now();e.fillStyle="rgba(57, 219, 20, 0.6)";const a=Math.floor(t.x*.7+t.y*1.3);for(let r=0;r<6;r++){const o=t.x+30+(a+r*39)%(t.w-60),l=t.y+30+(a*11+r*87)%(t.h-60);Math.floor(s/200+r)%3===0&&e.fillRect(o-2,l-2,4,4)}}else if(t.floor==="cybercarpet"){e.fillStyle="#0f081d",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(157, 59, 255, 0.04)",e.lineWidth=1.5;const i=30,s=i*Math.sqrt(3),a=i*2;for(let r=t.x-s;r<t.x+t.w+s;r+=s)for(let o=t.y-a;o<t.y+t.h+a;o+=a*.75){const l=Math.floor(o/(a*.75))%2*(s/2),c=r+l,h=o;e.beginPath();for(let f=0;f<6;f++){const d=f*Math.PI/3,u=c+i*Math.cos(d),g=h+i*Math.sin(d);f===0?e.moveTo(u,g):e.lineTo(u,g)}e.closePath(),e.stroke()}e.strokeStyle="rgba(157, 59, 255, 0.12)",e.lineWidth=3,e.strokeRect(t.x+20,t.y+20,t.w-40,t.h-40)}e.textAlign="center",e.font="bold 12px Orbitron",e.fillStyle="rgba(120,200,240,0.15)",e.fillText(t.name.toUpperCase(),t.x+t.w/2,t.y+22),e.restore()}_drawZone(e,t){e.save();const i=Math.sin(Date.now()/600)*.12+.12,s=t.type==="healing";e.fillStyle=s?`rgba(30,255,100,${i})`:`rgba(255,60,20,${i})`,e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle=s?`rgba(60,255,130,${i*2})`:`rgba(255,90,40,${i*2})`,e.lineWidth=2,e.setLineDash([8,8]),e.lineDashOffset=-(Date.now()/60%16),e.strokeRect(t.x,t.y,t.w,t.h),e.setLineDash([]);const a=14;e.lineWidth=2.5,[[t.x,t.y,1,1],[t.x+t.w,t.y,-1,1],[t.x,t.y+t.h,1,-1],[t.x+t.w,t.y+t.h,-1,-1]].forEach(([o,l,c,h])=>{e.beginPath(),e.moveTo(o,l+h*a),e.lineTo(o,l),e.lineTo(o+c*a,l),e.stroke()}),e.textAlign="center",e.font="bold 11px Orbitron",e.fillStyle=s?"rgba(80,255,140,0.55)":"rgba(255,110,60,0.55)",e.fillText(t.label,t.x+t.w/2,t.y+t.h/2-6);const r=s?`+${(t.healRate*60).toFixed(0)} HP/s`:`×${t.multiplier} DMG`;e.font="9px Orbitron",e.fillStyle=s?"rgba(80,255,140,0.4)":"rgba(255,110,60,0.4)",e.fillText(r,t.x+t.w/2,t.y+t.h/2+10),e.restore()}_drawItem(e,t){e.save();const i=1+Math.sin(Date.now()/180)*.14;t.type==="health"?(e.shadowColor="#ff2e2e",e.shadowBlur=14,e.fillStyle="#cc2020",e.beginPath(),e.arc(t.x,t.y,11*i,0,Math.PI*2),e.fill(),e.shadowBlur=0,e.fillStyle="#ffffff",e.fillRect(t.x-2.5,t.y-6.5*i,5,13*i),e.fillRect(t.x-6.5*i,t.y-2.5,13*i,5)):t.type==="ammo"?(e.shadowColor="#ffcc00",e.shadowBlur=10,e.fillStyle="#cc9900",e.fillRect(t.x-7,t.y-7,14,14),e.fillStyle="#ffe060",e.fillRect(t.x-2,t.y-5,4,8),e.beginPath(),e.arc(t.x,t.y-5,2,Math.PI,0),e.fill()):t.type==="adrenaline"?(e.shadowColor="#39db14",e.shadowBlur=15,e.fillStyle="#1b7d05",e.beginPath(),e.arc(t.x,t.y,11*i,0,Math.PI*2),e.fill(),e.fillStyle="#39db14",e.beginPath(),e.moveTo(t.x-1,t.y-6*i),e.lineTo(t.x-4,t.y+1),e.lineTo(t.x-1,t.y+1),e.lineTo(t.x-2.5,t.y+7*i),e.lineTo(t.x+3.5,t.y-1),e.lineTo(t.x+.5,t.y-1),e.closePath(),e.fill()):t.type==="overdrive"&&(e.shadowColor="#ffd700",e.shadowBlur=15,e.fillStyle="#aa7c11",e.beginPath(),e.moveTo(t.x,t.y-12*i),e.lineTo(t.x+10*i,t.y),e.lineTo(t.x,t.y+12*i),e.lineTo(t.x-10*i,t.y),e.closePath(),e.fill(),e.strokeStyle="#ffd700",e.lineWidth=2.5,e.lineCap="round",e.lineJoin="round",e.beginPath(),e.moveTo(t.x-4,t.y-4),e.lineTo(t.x-1,t.y),e.lineTo(t.x-4,t.y+4),e.stroke(),e.beginPath(),e.moveTo(t.x+1,t.y-4),e.lineTo(t.x+4,t.y),e.lineTo(t.x+1,t.y+4),e.stroke()),e.restore()}initTerminals(){this.terminals=[{id:"term_1",x:this.mapId==="cyberlab"?700:720,y:620,radius:24,hacked:!1,progress:0,active:!0,label:"REACTOR DATA CORE"},{id:"term_2",x:1220,y:1120,radius:24,hacked:!1,progress:0,active:!0,label:"SECURE CACHE SUPPLY"}]}_drawTerminal(e,t){e.save();const i=1+Math.sin(Date.now()/200)*.08,s=e.createRadialGradient(t.x,t.y,5,t.x,t.y,t.radius*1.5*i);s.addColorStop(0,t.hacked?"rgba(57, 255, 20, 0.25)":"rgba(102, 252, 241, 0.25)"),s.addColorStop(1,"rgba(0, 0, 0, 0.0)"),e.fillStyle=s,e.beginPath(),e.arc(t.x,t.y,t.radius*1.8*i,0,Math.PI*2),e.fill(),e.fillStyle="#1c1e24",e.strokeStyle="#2b2e38",e.lineWidth=2,e.beginPath(),e.arc(t.x,t.y,14,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#0b0c10",e.strokeStyle=t.hacked?"rgba(57, 255, 20, 0.8)":"rgba(102, 252, 241, 0.8)",e.lineWidth=1.5,e.beginPath(),e.roundRect?e.roundRect(t.x-12,t.y-12,24,16,3):e.rect(t.x-12,t.y-12,24,16),e.fill(),e.stroke(),e.fillStyle=t.hacked?"#39ff14":"#66fcf1",e.font="bold 5px monospace",e.textAlign="center",e.textBaseline="middle",e.fillText(t.hacked?"SECURE":"ACCESS",t.x,t.y-4),e.fillStyle=t.hacked?"#39ff14":"#ffd700",e.beginPath(),e.arc(t.x-6,t.y+7,2,0,Math.PI*2),e.arc(t.x+6,t.y+7,2,0,Math.PI*2),e.fill(),e.restore()}_drawExtrudedObject(e,t,i,s,a,r){const o={x:t.x,y:t.y},l={x:t.x+t.w,y:t.y},c={x:t.x+t.w,y:t.y+t.h},h={x:t.x,y:t.y+t.h},f={x:o.x+(o.x-i)*a,y:o.y+(o.y-s)*a},d={x:l.x+(l.x-i)*a,y:l.y+(l.y-s)*a},u={x:c.x+(c.x-i)*a,y:c.y+(c.y-s)*a},g={x:h.x+(h.x-i)*a,y:h.y+(h.y-s)*a};e.save(),e.fillStyle="rgba(2, 3, 5, 0.45)",e.beginPath(),e.moveTo(o.x,o.y),e.lineTo(l.x,l.y),e.lineTo(c.x,c.y),e.lineTo(h.x,h.y),e.closePath(),e.fill(),e.restore();const v=(b,_,x,y,E)=>{e.save(),e.fillStyle=E,e.beginPath(),e.moveTo(b.x,b.y),e.lineTo(_.x,_.y),e.lineTo(y.x,y.y),e.lineTo(x.x,x.y),e.closePath(),e.fill(),e.strokeStyle="rgba(0,0,0,0.25)",e.lineWidth=1,e.stroke(),e.restore()};v(o,l,f,d,s>t.y?"#090a0d":"#17181c"),v(l,c,d,u,i<t.x+t.w?"#0d0e12":"#1b1c21"),v(c,h,u,g,s<t.y+t.h?"#090a0d":"#17181c"),v(h,o,g,f,i>t.x?"#0d0e12":"#1b1c21"),e.save(),e.beginPath(),e.moveTo(f.x,f.y),e.lineTo(d.x,d.y),e.lineTo(u.x,u.y),e.lineTo(g.x,g.y),e.closePath(),e.clip();const m=f.x-t.x,p=f.y-t.y;e.translate(m,p),r(e,t),e.restore(),e.save(),e.beginPath(),e.moveTo(f.x,f.y),e.lineTo(d.x,d.y),e.lineTo(u.x,u.y),e.lineTo(g.x,g.y),e.closePath(),e.strokeStyle="rgba(255,255,255,0.12)",e.lineWidth=1.5,e.stroke(),e.restore()}_drawExtrudedBarrel(e,t,i,s){const r=t.x+t.w/2,o=t.y+t.h/2,l=t.w/2,c=r+(r-i)*.04,h=o+(o-s)*.04;e.save(),e.fillStyle="rgba(2, 3, 5, 0.45)",e.beginPath(),e.arc(r,o,l,0,Math.PI*2),e.fill(),e.restore();const f=Math.atan2(h-o,c-r)+Math.PI/2,d=Math.cos(f)*l,u=Math.sin(f)*l;e.save(),e.fillStyle="#1c1000",e.beginPath(),e.moveTo(r-d,o-u),e.lineTo(r+d,o-u),e.lineTo(c+d,h-u),e.lineTo(c-d,h-u),e.closePath(),e.fill(),e.strokeStyle="#3a2000",e.stroke(),e.restore(),e.save(),e.translate(c-r,h-o),this._drawBarrel(e,t),e.restore()}_drawWall(e,t,i,s){e.save();const a=.08,r=.04;switch(t.material){case"exterior":this._drawExtrudedObject(e,t,i,s,a,(o,l)=>this._drawExteriorWall(o,l));break;case"interior":this._drawExtrudedObject(e,t,i,s,a,(o,l)=>this._drawInteriorWall(o,l));break;case"furniture":this._drawExtrudedObject(e,t,i,s,r,(o,l)=>this._drawFurniturePiece(o,l));break;case"barrel":this._drawExtrudedBarrel(e,t,i,s);break;case"crate":this._drawExtrudedObject(e,t,i,s,r,(o,l)=>this._drawCratePiece(o,l));break;default:this._drawExtrudedObject(e,t,i,s,a,(o,l)=>this._drawInteriorWall(o,l))}e.restore()}_drawExteriorWall(e,t){e.fillStyle="#0b0b12",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(60,50,90,0.4)",e.lineWidth=1;const i=32,s=13;for(let a=t.x;a<t.x+t.w;a+=i)for(let r=t.y;r<t.y+t.h;r+=s){const o=Math.floor((r-t.y)/s)%2*(i/2);e.strokeRect(a+o,r,i,s)}e.strokeStyle="rgba(102,252,241,0.28)",e.lineWidth=2,e.strokeRect(t.x,t.y,t.w,t.h)}_drawInteriorWall(e,t){e.fillStyle="#1b1c22",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(90,130,170,0.45)",e.lineWidth=1.5,e.strokeRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(170,130,70,0.25)",e.lineWidth=1,t.w>t.h?(e.beginPath(),e.moveTo(t.x,t.y+3),e.lineTo(t.x+t.w,t.y+3),e.stroke(),e.beginPath(),e.moveTo(t.x,t.y+t.h-3),e.lineTo(t.x+t.w,t.y+t.h-3),e.stroke()):(e.beginPath(),e.moveTo(t.x+3,t.y),e.lineTo(t.x+3,t.y+t.h),e.stroke(),e.beginPath(),e.moveTo(t.x+t.w-3,t.y),e.lineTo(t.x+t.w-3,t.y+t.h),e.stroke())}_drawFurniturePiece(e,t){const i=t.label||"",a={sofa:{fill:"#261637",stroke:"#4a2a70"},table:{fill:"#241510",stroke:"#7a4a22"},bed:{fill:"#152030",stroke:"#2a5080"},counter:{fill:"#182215",stroke:"#3a7050"},desk:{fill:"#1e1408",stroke:"#5a3a18"},tub:{fill:"#0a1a2c",stroke:"#1a5a8a"},sink:{fill:"#0a1828",stroke:"#2a6090"},tv:{fill:"#0a0a14",stroke:"#4a4a70"},shelf:{fill:"#1e1006",stroke:"#5a3010"},car:{fill:"#1a1a28",stroke:"#3a3a5c"},bench:{fill:"#1c1408",stroke:"#5c4018"},fridge:{fill:"#141c24",stroke:"#3a5a78"},cabinet:{fill:"#18100a",stroke:"#5a3a1a"},dresser:{fill:"#1e1408",stroke:"#6a4020"},toilet:{fill:"#eee",stroke:"#555"},chair:{fill:"#2b1e16",stroke:"#5c402d"},plant:{fill:"#152d18",stroke:"#345a3a"},cyber_couch:{fill:"#110a24",stroke:"#9d3bff"},containment_pod:{fill:"#08181a",stroke:"#66fcf1"},server_rack:{fill:"#080c10",stroke:"#39db14"},cyber_console:{fill:"#050c18",stroke:"#1a7cd8"},reactor_core:{fill:"#150c05",stroke:"#ff7f3b"},nano_charger:{fill:"#051a0c",stroke:"#39db14"}}[i]||{fill:"#1a1a2a",stroke:"#4a4a80"};if(e.fillStyle=a.fill,e.strokeStyle=a.stroke,e.lineWidth=1.5,e.beginPath(),e.roundRect?e.roundRect(t.x,t.y,t.w,t.h,4):e.rect(t.x,t.y,t.w,t.h),e.fill(),e.stroke(),i==="bed"){e.fillStyle="rgba(255,255,255,0.05)",e.fillRect(t.x,t.y,t.w,10),e.strokeStyle=a.stroke,e.strokeRect(t.x,t.y,t.w,10),e.fillStyle="#223040",e.strokeStyle="rgba(255,255,255,0.1)",e.lineWidth=1;const r=Math.min(32,(t.w-16)/2),o=Math.min(18,t.h*.18),l=t.y+16;t.w>80?(e.fillRect(t.x+8,l,r,o),e.strokeRect(t.x+8,l,r,o),e.fillRect(t.x+t.w-8-r,l,r,o),e.strokeRect(t.x+t.w-8-r,l,r,o)):(e.fillRect(t.x+t.w/2-r/2,l,r,o),e.strokeRect(t.x+t.w/2-r/2,l,r,o)),e.strokeStyle="rgba(255, 255, 255, 0.08)",e.lineWidth=1.5,e.beginPath(),e.moveTo(t.x+4,t.y+t.h*.45),e.lineTo(t.x+t.w-4,t.y+t.h*.45),e.stroke(),e.beginPath(),e.moveTo(t.x+4,t.y+t.h*.45),e.lineTo(t.x+t.w/3,t.y+t.h*.65),e.moveTo(t.x+t.w-4,t.y+t.h*.45),e.lineTo(t.x+t.w*.66,t.y+t.h*.65),e.stroke()}else if(i==="sofa"){e.fillStyle="rgba(0,0,0,0.18)";const r=10;if(e.strokeStyle="rgba(255, 255, 255, 0.06)",t.w>t.h){e.fillRect(t.x,t.y,r,t.h),e.strokeRect(t.x,t.y,r,t.h),e.fillRect(t.x+t.w-r,t.y,r,t.h),e.strokeRect(t.x+t.w-r,t.y,r,t.h),e.fillRect(t.x+r,t.y,t.w-r*2,r),e.strokeRect(t.x+r,t.y,t.w-r*2,r);const o=(t.w-r*2)/3;for(let l=1;l<3;l++)e.beginPath(),e.moveTo(t.x+r+o*l,t.y+r),e.lineTo(t.x+r+o*l,t.y+t.h),e.stroke()}else{e.fillRect(t.x,t.y,t.w,r),e.strokeRect(t.x,t.y,t.w,r),e.fillRect(t.x,t.y+t.h-r,t.w,r),e.strokeRect(t.x,t.y+t.h-r,t.w,r),e.fillRect(t.x,t.y+r,r,t.h-r*2),e.strokeRect(t.x,t.y+r,r,t.h-r*2);const o=(t.h-r*2)/2;for(let l=1;l<2;l++)e.beginPath(),e.moveTo(t.x+r,t.y+r+o*l),e.lineTo(t.x+t.w,t.y+r+o*l),e.stroke()}}else if(i==="counter")if(e.strokeStyle="rgba(255,255,255,0.08)",e.lineWidth=1,t.w>t.h){e.fillStyle="#111b22",e.fillRect(t.x+t.w*.2,t.y+4,30,t.h-8),e.strokeRect(t.x+t.w*.2,t.y+4,30,t.h-8),e.strokeStyle="#8fa4b3",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+t.w*.2+15,t.y+2),e.lineTo(t.x+t.w*.2+15,t.y+8),e.stroke(),e.strokeStyle="#ff5c28",e.lineWidth=1;const r=t.x+t.w*.7,o=t.y+t.h/2;e.beginPath(),e.arc(r-12,o-6,4,0,Math.PI*2),e.arc(r+12,o-6,5,0,Math.PI*2),e.arc(r-12,o+6,5,0,Math.PI*2),e.arc(r+12,o+6,4,0,Math.PI*2),e.stroke()}else e.fillStyle="#111b22",e.fillRect(t.x+4,t.y+t.h*.3,t.w-8,30),e.strokeRect(t.x+4,t.y+t.h*.3,t.w-8,30),e.strokeStyle="#8fa4b3",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+2,t.y+t.h*.3+15),e.lineTo(t.x+8,t.y+t.h*.3+15),e.stroke();else if(i==="desk")e.fillStyle="rgba(0,0,0,0.15)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.fillStyle="#05050a",e.strokeStyle="#66fcf1",e.lineWidth=1.5,t.w>t.h?(e.fillRect(t.x+t.w/2-25,t.y+6,50,4),e.strokeRect(t.x+t.w/2-25,t.y+6,50,4),e.fillStyle="#222",e.fillRect(t.x+t.w/2-20,t.y+15,40,10)):(e.fillRect(t.x+6,t.y+t.h/2-25,4,50),e.strokeRect(t.x+6,t.y+t.h/2-25,4,50),e.fillStyle="#222",e.fillRect(t.x+15,t.y+t.h/2-20,10,40));else if(i==="shelf"){e.fillStyle="#3c2415",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4);const r=["#9e2a2b","#3e5c76","#ffe066","#a3b18a","#9b5de5","#ff9f1c"];e.lineWidth=1;const o=Math.round(t.x*13+t.y*37),l=new Yc(o);if(t.w>t.h){let c=t.x+4;for(;c<t.x+t.w-6;){const h=Math.floor(l.next()*4)+3,f=Math.floor(l.next()*8)+12;e.fillStyle=r[Math.floor(l.next()*r.length)],e.fillRect(c,t.y+t.h-2-f,h,f),e.strokeRect(c,t.y+t.h-2-f,h,f),c+=h+1}}else{let c=t.y+4;for(;c<t.y+t.h-6;){const h=Math.floor(l.next()*4)+3,f=Math.floor(l.next()*8)+12;e.fillStyle=r[Math.floor(l.next()*r.length)],e.fillRect(t.x+2,c,f,h),e.strokeRect(t.x+2,c,f,h),c+=h+1}}}else if(i==="dresser"||i==="cabinet")if(e.strokeStyle="rgba(255,255,255,0.06)",e.lineWidth=1,t.w>t.h){const o=t.w/2;for(let l=0;l<2;l++)e.strokeRect(t.x+o*l+2,t.y+2,o-4,t.h-4),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x+o*l+o/2,t.y+t.h-5,2,0,Math.PI*2),e.fill()}else{const o=t.h/3;for(let l=0;l<3;l++)e.strokeRect(t.x+2,t.y+o*l+2,t.w-4,o-4),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x+t.w-5,t.y+o*l+o/2,2,0,Math.PI*2),e.fill()}else if(i==="toilet")e.fillStyle="#eee",e.strokeStyle="#555",e.lineWidth=1.5,e.fillRect(t.x+4,t.y,t.w-8,12),e.strokeRect(t.x+4,t.y,t.w-8,12),e.beginPath(),e.arc(t.x+t.w/2,t.y+24,9,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#66c0f4",e.beginPath(),e.arc(t.x+t.w/2,t.y+24,5,0,Math.PI*2),e.fill();else if(i==="chair")e.fillStyle="rgba(0,0,0,0.1)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.strokeStyle=a.stroke,e.lineWidth=2.5,e.beginPath(),e.moveTo(t.x+2,t.y+2),e.lineTo(t.x+t.w-2,t.y+2),e.stroke();else if(i==="plant"){const r=t.x+t.w/2,o=t.y+t.h/2;e.fillStyle="#8c5a3c",e.strokeStyle="#5c3a26",e.beginPath(),e.arc(r,o,10,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#2a7c36",e.beginPath(),e.arc(r-6,o-4,7,0,Math.PI*2),e.arc(r+6,o-4,6,0,Math.PI*2),e.arc(r,o+6,8,0,Math.PI*2),e.arc(r-3,o+5,6,0,Math.PI*2),e.fill(),e.fillStyle="#4ea35b",e.beginPath(),e.arc(r-4,o-2,4,0,Math.PI*2),e.arc(r+4,o-2,3,0,Math.PI*2),e.arc(r,o+3,4,0,Math.PI*2),e.fill()}else if(i==="tub")e.fillStyle="#0d2535",e.fillRect(t.x+7,t.y+7,t.w-14,t.h-14),e.strokeStyle="rgba(50,170,255,0.25)",e.strokeRect(t.x+7,t.y+7,t.w-14,t.h-14);else if(i==="car")e.fillStyle="#0a1828",e.fillRect(t.x+28,t.y+18,65,38),e.fillRect(t.x+t.w-95,t.y+18,65,38),e.strokeStyle="rgba(80,120,200,0.3)",e.strokeRect(t.x+28,t.y+18,65,38),e.strokeRect(t.x+t.w-95,t.y+18,65,38),e.strokeStyle="rgba(100,100,180,0.4)",e.lineWidth=2,e.strokeRect(t.x+10,t.y+10,t.w-20,t.h-20);else if(i==="cyber_couch")e.fillStyle="rgba(0,0,0,0.2)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.strokeStyle="rgba(157, 59, 255, 0.25)",e.lineWidth=1,t.w>t.h?(e.strokeRect(t.x+6,t.y+4,t.w-12,6),e.beginPath(),e.moveTo(t.x+4,t.y+t.h-4),e.lineTo(t.x+t.w-4,t.y+t.h-4),e.strokeStyle="#9d3bff",e.stroke()):(e.strokeRect(t.x+4,t.y+6,6,t.h-12),e.beginPath(),e.moveTo(t.x+t.w-4,t.y+4),e.lineTo(t.x+t.w-4,t.y+t.h-4),e.strokeStyle="#9d3bff",e.stroke());else if(i==="containment_pod"){e.fillStyle="rgba(102, 252, 241, 0.05)",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.fillStyle="#222",e.strokeStyle="#66fcf1",e.lineWidth=1.5,t.w>t.h?(e.fillRect(t.x,t.y,8,t.h),e.strokeRect(t.x,t.y,8,t.h),e.fillRect(t.x+t.w-8,t.y,8,t.h),e.strokeRect(t.x+t.w-8,t.y,8,t.h)):(e.fillRect(t.x,t.y,t.w,8),e.strokeRect(t.x,t.y,t.w,8),e.fillRect(t.x,t.y+t.h-8,t.w,8),e.strokeRect(t.x,t.y+t.h-8,t.w,8));const r=Date.now();e.fillStyle="rgba(102, 252, 241, 0.4)";const o=Math.floor(t.x*2.3+t.y*1.7);for(let l=0;l<4;l++){const c=t.x+10+(o+l*29)%(t.w-20),h=t.y+10+((o*7+l*41-r*.04)%(t.h-20)+(t.h-20))%(t.h-20);e.beginPath(),e.arc(c,h,1.5+l%2,0,Math.PI*2),e.fill()}}else if(i==="server_rack"){e.fillStyle="#0a0d14",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.strokeStyle="rgba(255, 255, 255, 0.04)",e.lineWidth=1;const r=Date.now(),o=Math.floor(t.h/14);if(t.h>t.w)for(let l=0;l<o;l++){const c=t.y+4+l*14;e.strokeRect(t.x+3,c,t.w-6,10);const h=Math.floor(r/200+l)%4!==0,f=Math.floor(r/450+l*2)%6===0,d=Math.floor(r/300-l)%5===0;e.fillStyle=h?"#39db14":"#053005",e.fillRect(t.x+6,c+4,3,3),e.fillStyle=f?"#ff3c3c":"#400505",e.fillRect(t.x+12,c+4,3,3),e.fillStyle=d?"#66fcf1":"#052028",e.fillRect(t.x+18,c+4,3,3)}else{const l=Math.floor(t.w/14);for(let c=0;c<l;c++){const h=t.x+4+c*14;e.strokeRect(h,t.y+3,10,t.h-6);const f=Math.floor(r/200+c)%4!==0,d=Math.floor(r/450+c*2)%6===0;e.fillStyle=f?"#39db14":"#053005",e.fillRect(h+4,t.y+6,3,3),e.fillStyle=d?"#ff3c3c":"#400505",e.fillRect(h+4,t.y+12,3,3)}}}else if(i==="cyber_console")if(e.fillStyle="rgba(0,0,0,0.35)",e.fillRect(t.x+3,t.y+3,t.w-6,t.h-6),e.fillStyle="#09152b",e.strokeStyle="#1a7cd8",e.lineWidth=1.5,t.w>t.h){e.fillRect(t.x+5,t.y+t.h-12,t.w-10,8),e.strokeRect(t.x+5,t.y+t.h-12,t.w-10,8),e.fillStyle="rgba(26, 124, 216, 0.15)",e.fillRect(t.x+10,t.y+4,t.w-20,t.h-18),e.strokeRect(t.x+10,t.y+4,t.w-20,t.h-18),e.strokeStyle="#66fcf1",e.lineWidth=1,e.beginPath();const r=Date.now();for(let o=t.x+14;o<t.x+t.w-14;o+=4){const l=t.y+10+Math.sin(r*.005+o*.1)*3;o===t.x+14?e.moveTo(o,l):e.lineTo(o,l)}e.stroke()}else e.fillRect(t.x+4,t.y+5,8,t.h-10),e.strokeRect(t.x+4,t.y+5,8,t.h-10),e.fillStyle="rgba(26, 124, 216, 0.15)",e.fillRect(t.x+14,t.y+10,t.w-18,t.h-20),e.strokeRect(t.x+14,t.y+10,t.w-18,t.h-20);else if(i==="reactor_core"){const r=t.x+t.w/2,o=t.y+t.h/2,l=Math.min(t.w,t.h)/2,c=Date.now();e.fillStyle="#100a05",e.strokeStyle="#ff7f3b",e.lineWidth=2.5,e.beginPath(),e.arc(r,o,l-4,0,Math.PI*2),e.fill(),e.stroke();const h=3,f=c/400%(Math.PI*2);e.fillStyle="#ff7f3b";for(let d=0;d<h;d++){const u=f+d*Math.PI*2/h,g=r+Math.cos(u)*(l-12),v=o+Math.sin(u)*(l-12);e.beginPath(),e.arc(g,v,4,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(255, 215, 0, 0.25)",e.lineWidth=1.5,e.beginPath(),e.moveTo(r,o),e.lineTo(g,v),e.stroke()}e.fillStyle="#ffd700",e.shadowColor="#ff7f3b",e.shadowBlur=12,e.beginPath(),e.arc(r,o,6+Math.sin(c/150)*1.5,0,Math.PI*2),e.fill(),e.shadowBlur=0}else if(i==="nano_charger"){e.fillStyle="#06100a",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.fillStyle="rgba(57, 219, 20, 0.1)",e.strokeStyle="#39db14",e.lineWidth=1.5,e.strokeRect(t.x+4,t.y+4,t.w-8,t.h-8);const r=Date.now(),o=(t.h-12)*(.5+Math.sin(r/250)*.35);e.fillStyle="#39db14",e.fillRect(t.x+6,t.y+t.h-6-o,t.w-12,o)}else i==="fridge"?(e.strokeStyle="rgba(160,200,255,0.4)",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+t.w/2-10,t.y+12),e.lineTo(t.x+t.w/2+10,t.y+12),e.stroke()):(e.strokeStyle="rgba(255,255,255,0.06)",e.strokeRect(t.x+3,t.y+3,t.w-6,t.h-6))}_drawBarrel(e,t){const i=t.x+t.w/2,s=t.y+t.h/2,a=t.w/2;if(e.fillStyle="#2a1800",e.strokeStyle="#9a4800",e.lineWidth=2,e.beginPath(),e.arc(i,s,a,0,Math.PI*2),e.fill(),e.stroke(),e.strokeStyle="rgba(255,120,0,0.65)",e.lineWidth=2,e.beginPath(),e.arc(i,s,a-5,0,Math.PI*2),e.stroke(),e.strokeStyle="rgba(255,160,0,0.4)",e.lineWidth=1.5,e.beginPath(),e.moveTo(i-a*.4,s-a*.4),e.lineTo(i+a*.4,s+a*.4),e.moveTo(i+a*.4,s-a*.4),e.lineTo(i-a*.4,s+a*.4),e.stroke(),t.health<t.maxHealth){const r=t.health/t.maxHealth;e.fillStyle="rgba(0,0,0,0.6)",e.fillRect(t.x,t.y+2,t.w,4),e.fillStyle=r>.5?"#39ff14":"#ff3c3c",e.fillRect(t.x,t.y+2,t.w*r,4)}}_drawCratePiece(e,t){e.fillStyle="#3a2b1e",e.strokeStyle="#b8865c",e.lineWidth=1.5,e.fillRect(t.x,t.y,t.w,t.h),e.strokeRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(170,110,60,0.4)",e.lineWidth=1,e.beginPath(),e.moveTo(t.x+3,t.y+3),e.lineTo(t.x+t.w-3,t.y+t.h-3),e.moveTo(t.x+t.w-3,t.y+3),e.lineTo(t.x+3,t.y+t.h-3),e.stroke(),e.strokeStyle="rgba(210,150,80,0.7)",e.lineWidth=1.5;const i=8;if([[t.x,t.y,1,1],[t.x+t.w,t.y,-1,1],[t.x,t.y+t.h,1,-1],[t.x+t.w,t.y+t.h,-1,-1]].forEach(([s,a,r,o])=>{e.beginPath(),e.moveTo(s,a+o*i),e.lineTo(s,a),e.lineTo(s+r*i,a),e.stroke()}),t.health<t.maxHealth){const s=t.health/t.maxHealth;e.fillStyle="rgba(0,0,0,0.6)",e.fillRect(t.x+4,t.y+4,t.w-8,5),e.fillStyle=s>.5?"#39ff14":"#ff3c3c",e.fillRect(t.x+4,t.y+4,(t.w-8)*s,5)}}};class di{constructor(e,t,i,s,a,r,o,l,c="normal"){this.x=e,this.y=t,this.vx=i,this.vy=s,this.color=a,this.size=r,this.life=o,this.decay=l,this.type=c,this.angle=Math.random()*Math.PI*2,this.spin=(Math.random()-.5)*.3,this.bounceCount=0}update(e){if(this.life-=this.decay,this.type==="casing"||this.type==="splinter"){this.vx*=.95,this.vy*=.95,this.angle+=this.spin;const t=this.x+this.vx,i=this.y+this.vy,s=e.checkCircleCollision(t,i,this.size);(s.x!==t||s.y!==i)&&this.bounceCount<2?(this.bounceCount++,this.x=s.x,this.y=s.y,this.vx=-this.vx*.4,this.vy=-this.vy*.4):(this.x=s.x,this.y=s.y)}else this.x+=this.vx,this.y+=this.vy,this.vx*=.92,this.vy*=.92}draw(e){e.save(),e.globalAlpha=Math.max(0,this.life),this.type==="casing"?(e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle="#d4af37",e.strokeStyle="#996515",e.lineWidth=.5,e.fillRect(-this.size,-this.size/2,this.size*2,this.size),e.strokeRect(-this.size,-this.size/2,this.size*2,this.size)):this.type==="splinter"?(e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle="#8b5a2b",e.beginPath(),e.moveTo(-this.size,0),e.lineTo(this.size,-this.size/2),e.lineTo(this.size/2,this.size/2),e.closePath(),e.fill()):this.type==="blood"?(e.fillStyle=this.color,e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fill()):(e.fillStyle=this.color,!(window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode)&&(this.color.startsWith("#66fc")||this.color.startsWith("#ff3c"))&&(e.shadowColor=this.color,e.shadowBlur=4),e.beginPath(),e.arc(this.x,this.y,this.size*this.life,0,Math.PI*2),e.fill()),e.restore()}}class Hr{constructor(e,t,i,s,a="blood"){this.x=e,this.y=t,this.size=i,this.color=s,this.type=a,this.angle=Math.random()*Math.PI*2,this.scaleX=1+(Math.random()-.5)*.4,this.scaleY=1+(Math.random()-.5)*.4}draw(e){e.save(),e.translate(this.x,this.y),e.rotate(this.angle),e.globalAlpha=this.type==="blood"?.75:.9,this.type==="blood"?(e.fillStyle=this.color,e.beginPath(),e.ellipse(0,0,this.size*this.scaleX,this.size*this.scaleY,0,0,Math.PI*2),e.fill()):this.type==="casing"?(e.fillStyle="#b5921c",e.fillRect(-this.size,-this.size/2,this.size*2,this.size)):this.type==="splinter"&&(e.fillStyle="#6e441c",e.fillRect(-this.size,-this.size/3,this.size*1.5,this.size*.7)),e.restore()}}class My{constructor(){this.particles=[],this.decals=[],this.bloodEnabled=!0}clear(){this.particles=[],this.decals=[]}setBloodEnabled(e){this.bloodEnabled=e}update(e){for(let t=this.particles.length-1;t>=0;t--){const i=this.particles[t];i.update(e),i.life<=0&&(i.type==="blood"&&this.bloodEnabled&&Math.random()<.6?this.decals.push(new Hr(i.x,i.y,i.size*1.2,i.color,"blood")):i.type==="casing"?this.decals.push(new Hr(i.x,i.y,i.size,"#996515","casing")):i.type==="splinter"&&Math.random()<.4&&this.decals.push(new Hr(i.x,i.y,i.size,"#5c3917","splinter")),this.particles.splice(t,1))}this.decals.length>250&&this.decals.shift()}drawDecals(e){this.decals.forEach(t=>t.draw(e))}drawParticles(e){this.particles.forEach(t=>t.draw(e))}spawnWallImpact(e,t,i){const s=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,a=i+Math.PI,r=s?1:Math.floor(Math.random()*4)+3;for(let o=0;o<r;o++){const l=a+(Math.random()-.5)*1.2,c=Math.random()*3+2,h=Math.cos(l)*c,f=Math.sin(l)*c,d=Math.random()*2.2+1.2,u=Math.random()*.04+.04;this.particles.push(new di(e,t,h,f,Math.random()>.5?"#66fcf1":"#ffffff",d,1,u,"spark"))}s||this.particles.push(new di(e,t,(Math.random()-.5)*.3,(Math.random()-.5)*.3,"rgba(197, 198, 199, 0.25)",Math.random()*6+4,1,.03,"smoke"))}spawnBloodSplatter(e,t,i){if(!this.bloodEnabled)return;const a=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode?2:Math.floor(Math.random()*6)+6;for(let r=0;r<a;r++){const o=i+(Math.random()-.5)*1.1,l=Math.random()*4.5+2.5,c=Math.cos(o)*l,h=Math.sin(o)*l,f=Math.random()*3+1.5,d=Math.random()*.05+.04,g=`rgb(${Math.floor(Math.random()*60)+120}, 10, 10)`;this.particles.push(new di(e,t,c,h,g,f,1,d,"blood"))}}spawnGunCasing(e,t,i,s){if(window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode)return;const r=i+Math.PI/2+(Math.random()-.5)*.5,o=Math.random()*2+1.8,l=Math.cos(r)*o,c=Math.sin(r)*o,h=s==="sniper"?3.5:s==="pistol"?2:2.6,f=.02;this.particles.push(new di(e,t,l,c,"#d4af37",h,1,f,"casing"));const d=i+(Math.random()-.5)*.3,u=Math.random()*.6+.3;this.particles.push(new di(e+Math.cos(i)*6,t+Math.sin(i)*6,Math.cos(d)*u,Math.sin(d)*u,"rgba(200, 200, 200, 0.15)",Math.random()*5+3,1,.04,"smoke"))}spawnCrateSplinters(e,t){const i=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,s=i?3:Math.floor(Math.random()*12)+10;for(let a=0;a<s;a++){const r=Math.random()*Math.PI*2,o=Math.random()*4+1.5,l=Math.cos(r)*o,c=Math.sin(r)*o,h=Math.random()*4+2,f=Math.random()*.03+.02;this.particles.push(new di(e,t,l,c,"#8b5a2b",h,1,f,"splinter"))}if(!i)for(let a=0;a<4;a++)this.particles.push(new di(e+(Math.random()-.5)*10,t+(Math.random()-.5)*10,(Math.random()-.5)*.8,(Math.random()-.5)*.8,"rgba(140, 130, 120, 0.2)",Math.random()*12+8,1,.02,"smoke"))}spawnFlashbangBurst(e,t){const i=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,s=i?8:30;for(let a=0;a<s;a++){const r=Math.random()*Math.PI*2,o=Math.random()*7+3,l=Math.cos(r)*o,c=Math.sin(r)*o,h=Math.random()*4+2,f=Math.random()*.03+.02;this.particles.push(new di(e,t,l,c,Math.random()>.3?"#ffffff":"#66fcf1",h,1,f,"spark"))}if(!i)for(let a=0;a<10;a++){const r=Math.random()*Math.PI*2,o=Math.random()*2.5,l=Math.cos(r)*o,c=Math.sin(r)*o;this.particles.push(new di(e,t,l,c,"rgba(255, 255, 255, 0.4)",Math.random()*20+10,1,.015,"smoke"))}}spawnDashParticles(e,t,i,s="cyan"){const a=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,o={cyan:"#66fcf1",green:"#5eff39",purple:"#c47aff",orange:"#ff9d7a",yellow:"#ffea70",red:"#ff7a7a"}[s]||"#66fcf1",l=i+Math.PI,c=a?2:12;for(let f=0;f<c;f++){const d=l+(Math.random()-.5)*.6,u=Math.random()*2.5+1.2,g=Math.cos(d)*u,v=Math.sin(d)*u,m=Math.random()*7+4,p=Math.random()*.05+.03;this.particles.push(new di(e,t,g,v,"rgba(200, 200, 200, 0.18)",m,1,p,"smoke"))}const h=a?3:18;for(let f=0;f<h;f++){const d=i+(Math.random()-.5)*.7,u=Math.random()*8+4,g=Math.cos(d)*u,v=Math.sin(d)*u,m=Math.random()*2.5+1,p=Math.random()*.06+.04;this.particles.push(new di(e,t,g,v,o,m,1,p,"spark"))}}}class by{constructor(){this.ctx=null,this.masterVolume=null,this.volume=.5,this.noiseBuffer=null,this.shotgunBuffer=null,this.taskAlarms=new Map,this.bearMusic=null}init(){if(this.ctx)return;const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.masterVolume=this.ctx.createGain(),this.masterVolume.gain.value=this.volume,this.masterVolume.connect(this.ctx.destination);const t=this.ctx.sampleRate*2,i=this.ctx.createBuffer(1,t,this.ctx.sampleRate),s=i.getChannelData(0);for(let a=0;a<t;a++)s[a]=Math.random()*2-1;this.noiseBuffer=i,fetch("/dennish18-shotgun.mp3").then(a=>a.arrayBuffer()).then(a=>this.ctx.decodeAudioData(a)).then(a=>{this.shotgunBuffer=a}).catch(a=>console.error("Error loading shotgun sound:",a)),this._buildReverb()}_buildReverb(){if(!this.ctx||this.reverbNode)return;const e=Math.floor(this.ctx.sampleRate*.9),t=this.ctx.createBuffer(2,e,this.ctx.sampleRate);for(let i=0;i<2;i++){const s=t.getChannelData(i);for(let a=0;a<e;a++)s[a]=(Math.random()*2-1)*Math.pow(1-a/e,2.2)}this.reverbNode=this.ctx.createConvolver(),this.reverbNode.buffer=t,this.reverbGain=this.ctx.createGain(),this.reverbGain.gain.value=.28,this.reverbNode.connect(this.reverbGain),this.reverbGain.connect(this.masterVolume)}setVolume(e){this.volume=e,this.masterVolume&&(this.masterVolume.gain.value=e),this.bearMusic&&(this.bearMusic.volume=e*.3)}playGunshot(e,t=0){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const i=this.ctx.currentTime;let s=this.masterVolume;if(t>0){const p=this.ctx.createBiquadFilter();p.type="lowpass";const b=Math.max(220,4500*Math.pow(1-Math.min(1,t/1300),1.5));p.frequency.setValueAtTime(b,i);const _=Math.max(.01,Math.pow(1-Math.min(1,t/1400),1.2)),x=this.ctx.createGain();x.gain.setValueAtTime(_,i),p.connect(x),x.connect(this.masterVolume),s=p}const a=this.ctx.createBufferSource();a.buffer=this.noiseBuffer;const r=this.ctx.createBiquadFilter(),o=this.ctx.createGain();a.connect(r),r.connect(o),o.connect(s);const l=this.ctx.createOscillator(),c=this.ctx.createGain();l.connect(c),c.connect(s);let h=1e3,f=.1,d=.6,u=150,g=40,v=.08,m=.5;switch(e){case"pistol":h=1200,f=.12,d=.5,u=180,g=50,v=.06,m=.3;break;case"rifle":h=800,f=.18,d=.6,u=140,g=40,v=.1,m=.5;break;case"shotgun":if(this.shotgunBuffer)try{const p=this.ctx.createBufferSource();p.buffer=this.shotgunBuffer;const b=this.ctx.createGain();b.gain.setValueAtTime(.9,i),p.connect(b),b.connect(s),p.start(i);return}catch(p){console.error("Error playing custom shotgun audio:",p)}h=500,f=.35,d=.9,u=120,g=30,v=.25,m=.9,this.playMetallicClick(i+.05,800,.08,.3,t),this.playMetallicClick(i+.1,600,.05,.3,t);break;case"sniper":h=1500,f=.6,d=1,u=220,g=30,v=.4,m=1;break;case"knife":h=2e3,f=.12,d=.45,u=100,g=100,v=.01,m=0;break;case"vector":h=1600,f=.08,d=.42,u=200,g=80,v=.05,m=.25;break;case"famas":h=1e3,f=.14,d=.55,u=160,g=50,v=.09,m=.42;break;case"plasma":{h=3e3,f=.18,d=.3,u=600,g=120,v=.18,m=.55;try{const p=this.ctx.createOscillator(),b=this.ctx.createGain();p.type="sawtooth",p.frequency.setValueAtTime(800,i),p.frequency.exponentialRampToValueAtTime(200,i+.15),b.gain.setValueAtTime(.08,i),b.gain.exponentialRampToValueAtTime(.001,i+.15),p.connect(b),b.connect(s),p.start(i),p.stop(i+.17)}catch{}break}case"railgun":{h=600,f=.55,d=1,u=320,g=18,v=.45,m=1;try{const p=this.ctx.createOscillator(),b=this.ctx.createGain();p.type="square",p.frequency.setValueAtTime(180,i),p.frequency.exponentialRampToValueAtTime(40,i+.3),b.gain.setValueAtTime(.15,i),b.gain.exponentialRampToValueAtTime(.001,i+.3),p.connect(b),b.connect(s),p.start(i),p.stop(i+.32)}catch{}break}}r.type="bandpass",r.frequency.setValueAtTime(h,i),o.gain.setValueAtTime(d,i),o.gain.exponentialRampToValueAtTime(.001,i+f),l.type="sine",l.frequency.setValueAtTime(u,i),l.frequency.exponentialRampToValueAtTime(g,i+v),c.gain.setValueAtTime(m,i),c.gain.exponentialRampToValueAtTime(.001,i+v),a.start(i),a.stop(i+f+.05),l.start(i),l.stop(i+v+.05)}playReload(e){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime;e==="pistol"?(this.playMetallicClick(t,2e3,.05,.3),this.playMetallicClick(t+.4,1500,.08,.4),this.playMetallicClick(t+.5,2200,.04,.3)):e==="rifle"?(this.playMetallicClick(t,1800,.06,.3),this.playFrictionalScrape(t+.3,.2,.2),this.playMetallicClick(t+1.2,1200,.1,.5),this.playMetallicClick(t+1.35,2e3,.05,.4),this.playMetallicClick(t+1.8,1400,.08,.5),this.playMetallicClick(t+1.9,1e3,.08,.4)):e==="shotgun"?(this.playMetallicClick(t,1200,.06,.4),this.playFrictionalScrape(t+.05,.15,.3),this.playMetallicClick(t+.2,1800,.04,.4)):e==="sniper"&&(this.playMetallicClick(t,1400,.08,.4),this.playMetallicClick(t+.1,1e3,.06,.3),this.playMetallicClick(t+.5,900,.1,.4),this.playMetallicClick(t+.65,1200,.05,.3),this.playMetallicClick(t+1.2,1500,.1,.4),this.playMetallicClick(t+1.35,1800,.05,.3),this.playMetallicClick(t+1.9,1100,.08,.4),this.playMetallicClick(t+2.05,1600,.06,.4))}playDryFire(){this.init(),this.ctx&&this.playMetallicClick(this.ctx.currentTime,3e3,.03,.25)}playFootstep(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.setValueAtTime(220,e);const s=this.ctx.createGain();s.gain.setValueAtTime(.08,e),s.gain.exponentialRampToValueAtTime(.001,e+.1),t.connect(i),i.connect(s),s.connect(this.masterVolume),t.start(e),t.stop(e+.12)}playHitMarker(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(1600,e),i.gain.setValueAtTime(.15,e),i.gain.exponentialRampToValueAtTime(.001,e+.08),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.1)}playCriticalHitMarker(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(2300,e),i.gain.setValueAtTime(.25,e),i.gain.exponentialRampToValueAtTime(.001,e+.14),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.16)}playFleshHit(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.setValueAtTime(350,e);const s=this.ctx.createGain();s.gain.setValueAtTime(.35,e),s.gain.exponentialRampToValueAtTime(.001,e+.1),t.connect(i),i.connect(s),s.connect(this.masterVolume),t.start(e),t.stop(e+.12)}playCrateBreak(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.setValueAtTime(300,e);const s=this.ctx.createGain();s.gain.setValueAtTime(.7,e),s.gain.exponentialRampToValueAtTime(.001,e+.3),t.connect(i),i.connect(s),s.connect(this.masterVolume);const a=this.ctx.createBufferSource();a.buffer=this.noiseBuffer;const r=this.ctx.createBiquadFilter();r.type="highpass",r.frequency.setValueAtTime(2e3,e);const o=this.ctx.createGain();o.gain.setValueAtTime(.2,e),o.gain.exponentialRampToValueAtTime(.001,e+.15),a.connect(r),r.connect(o),o.connect(this.masterVolume),t.start(e),t.stop(e+.35),a.start(e),a.stop(e+.2)}playPickup(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(587.33,e),t.frequency.setValueAtTime(880,e+.08),i.gain.setValueAtTime(.12,e),i.gain.setValueAtTime(.12,e+.08),i.gain.exponentialRampToValueAtTime(.001,e+.25),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.28)}playMatchWin(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=(i,s,a,r)=>{const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="triangle",o.frequency.setValueAtTime(i,s),l.gain.setValueAtTime(r,s),l.gain.exponentialRampToValueAtTime(.001,s+a),o.connect(l),l.connect(this.masterVolume),o.start(s),o.stop(s+a+.05)};t(523.25,e,.4,.2),t(659.25,e+.15,.4,.2),t(783.99,e+.3,.4,.2),t(1046.5,e+.45,.6,.25)}playMatchLose(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=(i,s,a,r)=>{const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sawtooth",o.frequency.setValueAtTime(i,s);const c=this.ctx.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(500,s),l.gain.setValueAtTime(r,s),l.gain.exponentialRampToValueAtTime(.001,s+a),o.connect(c),c.connect(l),l.connect(this.masterVolume),o.start(s),o.stop(s+a+.05)};t(220,e,.5,.2),t(207.65,e+.2,.5,.2),t(196,e+.4,.5,.2),t(146.83,e+.6,.8,.25)}playMetallicClick(e,t,i,s=.3,a=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const r=typeof e=="number"&&e<10?Math.max(0,e):0,o=this.ctx.currentTime+r,l=this.ctx.createOscillator(),c=this.ctx.createGain();let h=this.masterVolume;if(a>0){const f=this.ctx.createBiquadFilter();f.type="lowpass";const d=Math.max(220,3e3*(1-Math.min(1,a/1200)));f.frequency.setValueAtTime(d,o);const u=this.ctx.createGain(),g=Math.max(.01,1-a/1300);u.gain.setValueAtTime(g,o),f.connect(u),u.connect(this.masterVolume),h=f}l.connect(c),c.connect(h),l.type="square",l.frequency.setValueAtTime(t,o),l.frequency.exponentialRampToValueAtTime(t*.5,o+i),c.gain.setValueAtTime(s,o),c.gain.exponentialRampToValueAtTime(.001,o+i),l.start(o),l.stop(o+i+.01)}catch{}}playFrictionalScrape(e,t,i=.2){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const s=typeof e=="number"&&e<10?Math.max(0,e):0,a=this.ctx.currentTime+s,r=this.ctx.createBufferSource();r.buffer=this.noiseBuffer;const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(800,a),o.frequency.exponentialRampToValueAtTime(1400,a+t);const l=this.ctx.createGain();l.gain.setValueAtTime(i,a),l.gain.linearRampToValueAtTime(i*.5,a+t*.5),l.gain.exponentialRampToValueAtTime(.001,a+t),r.connect(o),o.connect(l),l.connect(this.masterVolume),r.start(a),r.stop(a+t+.02)}catch{}}playFlashbangExplosion(e=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime,i=this.ctx.createOscillator(),s=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(160,t),i.frequency.exponentialRampToValueAtTime(10,t+.3);const a=Math.max(.1,1-e/1100);s.gain.setValueAtTime(.85*a,t),s.gain.exponentialRampToValueAtTime(.001,t+.35),i.connect(s),s.connect(this.masterVolume),i.start(t),i.stop(t+.4);const r=this.ctx.createOscillator(),o=this.ctx.createGain();r.type="sine",r.frequency.setValueAtTime(4500,t);const l=.35*Math.max(.01,1-e/700);o.gain.setValueAtTime(l,t),o.gain.linearRampToValueAtTime(l*.5,t+1),o.gain.exponentialRampToValueAtTime(.001,t+2.5),r.connect(o),o.connect(this.masterVolume),r.start(t),r.stop(t+2.6)}catch{}}playDashSound(e=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime,i=this.ctx.createOscillator(),s=this.ctx.createGain();let a=this.masterVolume;if(e>0){const r=this.ctx.createBiquadFilter();r.type="lowpass";const o=Math.max(220,3e3*(1-Math.min(1,e/1200)));r.frequency.setValueAtTime(o,t);const l=this.ctx.createGain(),c=Math.max(.01,1-e/1300);l.gain.setValueAtTime(c,t),r.connect(l),l.connect(this.masterVolume),a=r}i.connect(s),s.connect(a),i.type="sine",i.frequency.setValueAtTime(800,t),i.frequency.exponentialRampToValueAtTime(150,t+.2),s.gain.setValueAtTime(.35,t),s.gain.exponentialRampToValueAtTime(.001,t+.22),i.start(t),i.stop(t+.25)}catch{}}playAlarmForTask(e,t=0){if(this.init(),!this.ctx)return;if(this.ctx.state==="suspended"&&this.ctx.resume(),this.taskAlarms.has(e)){this.taskAlarms.get(e).distance=t;return}const i={intervalId:null,nodes:[],active:!0,distance:t};this.taskAlarms.set(e,i);const s=()=>{if(!i.active||!this.ctx)return;const a=i.distance,r=700,o=Math.max(0,Math.pow(1-Math.min(1,a/r),2.8)),l=Math.max(150,4e3*Math.pow(1-Math.min(1,a/r),2.5)),c=this.ctx.currentTime,h=this.ctx.createGain();h.gain.setValueAtTime(0,c),h.gain.linearRampToValueAtTime(o*.55,c+.04),h.gain.setValueAtTime(o*.55,c+.32),h.gain.linearRampToValueAtTime(0,c+.42);const f=this.ctx.createBiquadFilter();f.type="lowpass",f.frequency.setValueAtTime(l,c),f.Q.value=.9;const d=this.ctx.createOscillator();d.type="sawtooth",d.frequency.setValueAtTime(880,c),d.frequency.linearRampToValueAtTime(660,c+.2),d.frequency.linearRampToValueAtTime(880,c+.4);const u=this.ctx.createOscillator();u.type="square",u.frequency.setValueAtTime(1100,c),u.frequency.linearRampToValueAtTime(880,c+.2),u.frequency.linearRampToValueAtTime(1100,c+.4);const g=this.ctx.createGain();g.gain.value=.35;const v=this.ctx.createWaveShaper(),m=new Float32Array(256);for(let p=0;p<256;p++){const b=p*2/256-1;m[p]=(Math.PI+180)*b/(Math.PI+180*Math.abs(b))}if(v.curve=m,v.oversample="2x",d.connect(v),u.connect(g),g.connect(v),v.connect(f),f.connect(h),h.connect(this.masterVolume),this.reverbNode&&t<900){const p=this.ctx.createGain();p.gain.value=Math.max(0,.4*(1-t/900)),h.connect(p),p.connect(this.reverbNode)}d.start(c),u.start(c),d.stop(c+.45),u.stop(c+.45),i.nodes.push(d,u,h,f)};s(),i.intervalId=setInterval(s,600)}stopAlarmForTask(e){const t=this.taskAlarms.get(e);t&&(t.active=!1,t.intervalId!==null&&clearInterval(t.intervalId),t.nodes.forEach(i=>{try{i.stop&&i.stop()}catch{}}),this.taskAlarms.delete(e))}stopAllAlarms(){this.taskAlarms.forEach((e,t)=>this.stopAlarmForTask(t)),this.taskAlarms.clear()}playBearMusic(){this.bearMusic||(this.bearMusic=new Audio("/bear.mp3"),this.bearMusic.loop=!0),this.bearMusic.volume=this.volume*.3,this.bearMusic.paused&&(this.bearMusic.currentTime=0,this.bearMusic.play().catch(e=>console.warn("Error playing bear music:",e)))}stopBearMusic(){this.bearMusic&&(this.bearMusic.pause(),this.bearMusic.currentTime=0)}playHighBeep(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(2e3,e),t.frequency.exponentialRampToValueAtTime(3e3,e+.15),i.gain.setValueAtTime(.2,e),i.gain.exponentialRampToValueAtTime(.001,e+.2),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.22)}}class Ey{constructor(e,t,i,s,a,r,o){this.socket=e,this.localPlayer=t,this.opponent=i,this.map=s,this.particles=a,this.sound=r,this.engine=o,this.opponentStateBuffers=new Map,this.interpolationDelay=100,this.lastSentTime=0,this.sendInterval=1e3/60,window.AppSocket=this.socket,this.socket&&this.setupListeners()}setupListeners(){this.socket.on("opponent-state",e=>{if(!e.id)return;const t=this.engine.remotePlayers.get(e.id);if(!t)return;e.justDashed&&(t.justDashed=!0),e.droppedItem&&this.engine.spawnItemAt(e.droppedItem.x,e.droppedItem.y,e.droppedItem.type,e.droppedItem.id),e.health!==void 0&&(t.health=e.health);let i=this.opponentStateBuffers.get(e.id);i||(i=[],this.opponentStateBuffers.set(e.id,i)),i.push({time:Date.now(),x:e.x,y:e.y,angle:e.angle,vx:e.vx,vy:e.vy,health:e.health,weaponKey:e.weaponKey,isReloading:e.isReloading,muzzleFlash:e.muzzleFlash,flashlightActive:e.flashlightActive,inVent:e.inVent||!1}),i.length>30&&i.shift()}),this.socket.on("opponent-shoot",e=>{const t=this.engine.remotePlayers.get(e.playerId);if(t){if(t.muzzleFlash=1,t.angle=e.angle,this.particles.spawnGunCasing(t.x,t.y,t.angle,e.weaponKey),this.sound){const i=Math.hypot(t.x-this.localPlayer.x,t.y-this.localPlayer.y);this.sound.playGunshot(e.weaponKey,i)}this.engine.spawnBulletFromNetwork(e)}}),this.socket.on("damage-taken",e=>{if(this.engine.gameState==="playing"&&e.targetId===this.localPlayer.id){this.localPlayer.takeDamage(e.damage,this.sound);const i=this.engine.devCheatActive?Math.round(this.localPlayer.health/2):this.localPlayer.health;this.socket.emit("sync-health",{playerId:this.localPlayer.id,health:i}),this.engine.shakeCamera(e.damage*.45),this.engine.players.some(a=>a.health>0&&a.team===this.localPlayer.team)||this.socket.emit("player-died",{winnerId:e.shooterId,winnerName:"Opponents",loserId:this.localPlayer.id,roundNumber:this.engine.roundNumber})}}),this.socket.on("opponent-health-sync",e=>{const t=this.engine.remotePlayers.get(e.playerId);t&&(t.health=e.health)}),this.socket.on("opponent-break-crate",e=>{this.map.syncBreakCrate(e.crateId,e.spawnedItem),this.sound&&this.sound.playCrateBreak(),this.particles.spawnCrateSplinters(e.crateX||0,e.crateY||0)}),this.socket.on("opponent-pickup-item",e=>{const t=this.map.items.find(i=>i.id===e.itemId);t&&(t.active=!1,this.sound&&this.sound.playPickup())}),this.socket.on("opponent-sabotage-alarm",e=>{if(this.engine&&this.engine.tasks){const t=this.engine.tasks[e.idx];if(t&&(t.status="completed",t.alarmActive=!0,t.alarmTimer=15,this.sound)){const i=Math.hypot(this.localPlayer.x-t.x,this.localPlayer.y-t.y);try{this.sound.playAlarmForTask(t.id,i)}catch{}}}}),this.socket.on("opponent-chat",e=>{let t=e.name;const i=this.engine.remotePlayers.get(e.id);i&&(t=i.name);const s=new CustomEvent("opponent-chat-msg",{detail:{name:t,msg:e.msg}});window.dispatchEvent(s)}),this.socket.on("round-over",e=>{this.engine.handleServerRoundOver(e)}),this.socket.on("match-over",e=>{this.engine.handleServerMatchOver(e)})}sendState(e){if(this.socket&&e-this.lastSentTime>=this.sendInterval){this.lastSentTime=e;const i=this.engine.devCheatActive?Math.round(this.localPlayer.health/2):this.localPlayer.health,s={x:this.localPlayer.x,y:this.localPlayer.y,angle:this.localPlayer.angle,vx:this.localPlayer.vx,vy:this.localPlayer.vy,health:i,weaponKey:this.localPlayer.weaponKey,isReloading:this.localPlayer.isReloading,muzzleFlash:this.localPlayer.muzzleFlash,flashlightActive:this.localPlayer.flashlightActive,inVent:this.localPlayer.inVent||!1,justDashed:this.localPlayer.networkJustDashed||!1,droppedItem:this.localPlayer.networkDroppedItem||null};this.localPlayer.networkJustDashed=!1,this.localPlayer.networkDroppedItem=null,this.socket.emit("player-state",s)}}sendShoot(e){this.socket&&this.socket.emit("shoot",e)}interpolateOpponents(){const e=Date.now();this.lastInterpolateTime||(this.lastInterpolateTime=e);const t=e-this.lastInterpolateTime;this.lastInterpolateTime=e;const s=Math.max(1,Math.min(100,t))/16.67;this.engine.remotePlayers.forEach((a,r)=>{const o=this.opponentStateBuffers.get(r);if(!a||!o||o.length===0)return;const c=Date.now()-this.interpolationDelay;let h=null,f=null;for(let d=0;d<o.length;d++){const u=o[d];if(u.time<=c)h=u;else{f=u;break}}if(h&&f){const d=f.time-h.time,u=d>0?(c-h.time)/d:0;a.x=h.x+(f.x-h.x)*u,a.y=h.y+(f.y-h.y)*u,a.angle=this.lerpAngle(h.angle,f.angle,u),a.vx=h.vx+(f.vx-h.vx)*u,a.vy=h.vy+(f.vy-h.vy)*u,a.weaponKey=h.weaponKey,a.isReloading=h.isReloading,a.muzzleFlash=h.muzzleFlash,a.flashlightActive=h.flashlightActive,a.inVent=h.inVent||!1}else{const d=o[o.length-1],g=1-Math.pow(1-.25,s);a.x+=(d.x-a.x)*g,a.y+=(d.y-a.y)*g,a.angle=this.lerpAngle(a.angle,d.angle,g),a.vx=d.vx,a.vy=d.vy,a.weaponKey=d.weaponKey,a.isReloading=d.isReloading,a.muzzleFlash=d.muzzleFlash,a.flashlightActive=d.flashlightActive,a.inVent=d.inVent||!1}})}lerpAngle(e,t,i){let s=t-e;for(;s<-Math.PI;)s+=Math.PI*2;for(;s>Math.PI;)s-=Math.PI*2;return e+s*i}destroy(){this.socket&&(this.socket.off("opponent-state"),this.socket.off("opponent-shoot"),this.socket.off("damage-taken"),this.socket.off("opponent-health-sync"),this.socket.off("opponent-break-crate"),this.socket.off("opponent-pickup-item"),this.socket.off("opponent-sabotage-alarm"),this.socket.off("opponent-chat"),this.socket.off("round-over"),this.socket.off("match-over"))}}class $c{constructor(e,t,i,s,a){this.x=e,this.y=t,this.vx=i,this.vy=s,this.throwerId=a,this.radius=6,this.friction=.98,this.bounceFriction=.6,this.timer=1200,this.creationTime=performance.now(),this.active=!0}update(e,t){if(t-this.creationTime>=this.timer){this.active=!1;return}this.vx*=this.friction,this.vy*=this.friction;const s=this.x+this.vx,a=this.y+this.vy,r=e.checkCircleCollision(s,a,this.radius);if(r.x!==s||r.y!==a){const o=e.checkCircleCollision(s,this.y,this.radius),l=e.checkCircleCollision(this.x,a,this.radius);o.x!==s&&(this.vx=-this.vx*this.bounceFriction),l.y!==a&&(this.vy=-this.vy*this.bounceFriction),this.x=r.x,this.y=r.y}else this.x=s,this.y=a}draw(e){e.save(),e.beginPath(),e.arc(this.x,this.y,this.radius,0,Math.PI*2),e.fillStyle="#2d332f",e.strokeStyle="#66fcf1",e.lineWidth=1.5,e.fill(),e.stroke(),Math.floor(performance.now()/150)%2===0&&(e.beginPath(),e.arc(this.x,this.y,2,0,Math.PI*2),e.fillStyle="#ff3c3c",e.fill()),e.restore()}}class fl{constructor(e,t){try{this.canvas=document.getElementById(e),this.ctx=this.canvas.getContext("2d"),this.mode=t.mode,this.socket=t.socket,this.isRanked=!!t.isRanked,this.mapWidth=t.mapId==="arena"?900:1400,this.mapHeight=t.mapId==="arena"?900:1400,this.map=new Sy(this.mapWidth,this.mapHeight,t.seed,t.mapId),this.sound=new by,this.sound.setVolume(t.settings.volume!==void 0?t.settings.volume:.5),this.particles=new My,this.particles.setBloodEnabled(t.settings.blood);let i=!1;const s=t.matchMode||t.mode||"";if(this.matchMode=s,this.qpRenderStyle=t.qpRenderStyle,this.isRanked?s.includes("competitive")&&(i=!0):t.qpRenderStyle==="competitive"&&(i=!0),this.settings={...t.settings},this.matchMode==="sabotage"?(this.settings.performanceMode=!1,this.settings.shadows=!0):i?(this.settings.performanceMode=!0,this.settings.shadows=!1):(this.settings.performanceMode=!1,this.settings.shadows=!0),dn.init().catch(r=>console.warn("[Engine] CharacterRenderer init failed:",r)),window.LocalPlayerId=t.localPlayerId,window.IsOfflineMode=this.mode==="offline",this.spawns=[{x:150,y:150},{x:this.mapWidth-150,y:this.mapHeight-150},{x:150,y:this.mapHeight-150},{x:this.mapWidth-150,y:150}],this.players=[],this.localPlayer=null,this.remotePlayers=new Map,(t.players||[{id:t.localPlayerId,name:t.localPlayerName,weapon:t.localWeapon,color:t.localColor}]).forEach((r,o)=>{const l=this.spawns[o%this.spawns.length],c=r.id===t.localPlayerId,h=o%2===0?1:2,f=this.mode==="offline"&&!c,d=new vy(r.id,l.x,l.y,r.name,r.weapon||"pistol",r.color||"cyan",c,f);if(d.team=h,c)this.localPlayer=d,this.localPlayerIndex=o;else{const u=t.localPlayerIndex!==void 0?t.localPlayerIndex:0;d.isTeammate=o%2===u%2,this.remotePlayers.set(r.id,d)}this.players.push(d)}),this.bullets=[],this.grenades=[],this.activeHitmarkers=[],this.floatingNumbers=[],this.replayFrames=[],this.lastSnapshotTime=0,this.devCheatActive=!1,this.vents=[],this.tasks=[],this.activeTask=null,this.ventCooldown=0,this.currentVent=null,this.sweepAngle=0,this.sweepProgress=0,this.network=null,this.mode==="online"&&(this.network=new Ey(this.socket,this.localPlayer,null,this.map,this.particles,this.sound,this),this.socket.on("opponent-throw-grenade",r=>{const o=new $c(r.x,r.y,r.vx,r.vy,r.playerId);this.grenades.push(o);const l=Math.hypot(this.localPlayer.x-r.x,this.localPlayer.y-r.y);this.sound.playMetallicClick(0,1500,.08,.2,l)})),window.MatchStats={roundsWon:0,damageDealt:0,shotsFired:0,accuracy:0,hitsRegistered:0},this.onMatchEnd=t.onMatchEnd,this.onKillFeed=t.onKillFeed,this.lastKillTime=0,this.multiKillCount=0,this.combatBanner=null,this.camera={x:this.localPlayer.x,y:this.localPlayer.y,shakeX:0,shakeY:0},this.cameraShake=0,this.zoom=1,this.gameState="warmup",this.roundNumber=1,this.scoreSelf=0,this.scoreOpponent=0,this.countdownTimer=3,this.matchTime=120,this.lastTime=performance.now(),this.roundStartTime=0,this.countdownStart=0,this.matchTimerInterval=null,window.gameEngine=this,this.fpsFrameCount=0,this.fpsLastTick=performance.now(),this.currentFPS=0,this.keys={},this.mouse={x:0,y:0,gameX:0,gameY:0,angle:0,clicked:!1,buttons:{}},this.lastSprintTime=performance.now(),this.sprintTipVisible=!1,this.zone={active:!1,currentRadius:0,targetRadius:0,centerX:this.mapWidth/2,centerY:this.mapHeight/2,shrinkSpeed:0,damage:20,lastDamageTick:0,warnShown:!1},this.zoneTimer=null,this.resizeCanvas(),this.setupControls(),this.startRoundCycle(),this.active=!0,this.loop(),this.localPlayer.updateHUD(),this.updateScoreboardHUD(),this.matchMode==="sabotage"){const r=document.querySelector(".score-display");r&&(r.style.display="none");const o=document.querySelector(".timer-display");o&&(o.style.display="none");const l=document.querySelector(".bars-container.right-aligned");l&&(l.style.display="none");const c=document.querySelector(".opponent-weapon-display");c&&(c.style.display="none");const h=document.querySelector(".ammo-display");h&&(h.style.display="none");const f=document.querySelector(".inventory-display");f&&(f.style.display="none")}this.mode==="offline"&&(window.OnBotShootCallback=r=>{const o=this.players.find(l=>l.id===r.playerId);o&&this.particles.spawnGunCasing(o.x,o.y,o.angle,r.weaponKey),this.spawnBulletFromNetwork(r)})}catch(i){console.error("Engine Constructor Error:",i);try{const s=document.getElementById(e),a=s.getContext("2d");a.fillStyle="rgba(10, 10, 15, 0.95)",a.fillRect(0,0,s.width,s.height),a.fillStyle="#ff3c3c",a.font="bold 20px monospace",a.fillText("TACTICSTRIKE CONSTRUCTOR ERROR DETECTED",20,50),a.fillStyle="#ffffff",a.font="12px monospace";const r=(i.stack||i.toString()).split(`
`);let o=90;r.forEach(l=>{a.fillText(l,20,o),o+=18})}catch{}throw i}}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}setupControls(){this.resizeHandler=()=>this.resizeCanvas(),window.addEventListener("resize",this.resizeHandler),this.keydownHandler=s=>{const a=document.getElementById("chat-input");if(a&&document.activeElement===a)return;if(this.activeMinigame){s.preventDefault(),s.key==="Escape"?this.cancelHackingMinigame():this.handleMinigameKeyPress(s.key.toLowerCase());return}const r=s.key.toLowerCase()==="i",o=s.key==="9";if(r&&this.keys[9]||o&&this.keys.i){this.devCheatActive=!this.devCheatActive,this.devCheatActive&&this.localPlayer?(this.localPlayer.maxHealth=200,this.localPlayer.health=200):this.localPlayer&&(this.localPlayer.maxHealth=100,this.localPlayer.health>100&&(this.localPlayer.health=100));return}if(this.matchMode==="sabotage"&&this.localPlayer&&this.localPlayer.health>0){if(this.localPlayer.inVent&&this.currentVent){if(s.key>="1"&&s.key<="5"){s.preventDefault();const l=parseInt(s.key)-1,c=this.vents[l];if(c&&c.id!==this.currentVent.id){this.localPlayer.x=c.x,this.localPlayer.y=c.y,this.currentVent=c;try{this.sound.playFrictionalScrape(0,.3,.4)}catch{}}}else if(s.key===" "||s.key==="Spacebar"){s.preventDefault(),this.localPlayer.inVent=!1,this.currentVent=null;try{this.sound.playFrictionalScrape(0,.2,.3)}catch{}}return}if(this.activeTask){if(s.key===" "||s.key==="Spacebar"){s.preventDefault();const l=Math.abs(Math.sin(this.sweepAngle));if(l>=.4&&l<=.6){this.sweepProgress=Math.min(100,this.sweepProgress+20);try{this.sound.playMetallicClick(0,2e3,.08,.35)}catch{}if(this.sweepProgress>=100){const c=this.activeTask;c.status="completed",c.alarmActive=!0,c.alarmTimer=15,this.activeTask=null,this.localPlayer.showTextNotification("TASK COMPLETE! 🚨 ALARM TRIGGERED");const h=Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y);try{this.sound.playAlarmForTask(c.id,h)}catch{}if(this.matchMode==="sabotage"&&this.tasks.every(d=>d.status==="completed")){if(this.mode==="offline")this.endRound(1,"tasks completed");else if(this.localPlayer.team===1&&this.socket){const d=this.players.find(u=>u.team===2);d&&this.socket.emit("player-died",{winnerId:this.localPlayer.id,winnerName:this.localPlayer.name,loserId:d.id,roundNumber:this.roundNumber})}}}}else{this.sweepProgress=Math.max(0,this.sweepProgress-10);try{this.sound.playMetallicClick(0,500,.15,.25)}catch{}}}else(s.key==="Escape"||s.key.toLowerCase()==="f")&&this.activeTask&&(this.activeTask.status="pending",this.activeTask=null);return}if(s.key.toLowerCase()==="e"){const l=this.vents.find(c=>Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y)<50);if(l){if(this.ventCooldown>0)this.localPlayer.showTextNotification(`VENT COOLDOWN: ${this.ventCooldown.toFixed(1)}s`);else{this.localPlayer.inVent=!0,this.currentVent=l,this.ventCooldown=10;try{this.sound.playFrictionalScrape(0,.2,.35)}catch{}}return}}if(s.key.toLowerCase()==="f"){const l=this.tasks.find(c=>c.status==="pending"&&Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y)<40);if(l){this.activeTask=l,l.status="doing",this.sweepProgress=0,this.sweepAngle=0;return}}}if(s.key===" "&&s.preventDefault(),this.keys[s.key.toLowerCase()]=!0,s.key.toLowerCase()==="f"&&this.localPlayer&&this.localPlayer.health>0){this.localPlayer.flashlightActive=!this.localPlayer.flashlightActive;try{this.sound.playMetallicClick(0,1800,.05,.15)}catch{}}if(this.localPlayer&&this.localPlayer.health>0){if(s.key.toLowerCase()==="h"&&this.localPlayer.healthPacks>0){this.localPlayer.healthPacks--;const l=this.spawnItemAt(this.localPlayer.x,this.localPlayer.y,"health");this.localPlayer.showTextNotification("DROPPED HEALTH PACK","#ff6ef7"),this.localPlayer.updateHUD(),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:l,x:this.localPlayer.x,y:this.localPlayer.y,type:"health"})}if(s.key.toLowerCase()==="j"&&this.localPlayer.ammoPacks>0){this.localPlayer.ammoPacks--;const l=this.spawnItemAt(this.localPlayer.x,this.localPlayer.y,"ammo");this.localPlayer.showTextNotification("DROPPED AMMO PACK","#ff6ef7"),this.localPlayer.updateHUD(),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:l,x:this.localPlayer.x,y:this.localPlayer.y,type:"ammo"})}}s.key==="1"&&this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(1),s.key==="2"&&this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(2),s.key==="3"&&this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)},this.keyupHandler=s=>{this.keys[s.key.toLowerCase()]=!1},window.addEventListener("keydown",this.keydownHandler),window.addEventListener("keyup",this.keyupHandler),this.mousemoveHandler=s=>{if(this.mouse.x=s.clientX,this.mouse.y=s.clientY,this.firstPersonMode)this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.angle+=s.movementX*.0025);else{const a=this.mouse.x-this.canvas.width/2,r=this.mouse.y-this.canvas.height/2;this.mouse.angle=Math.atan2(r,a)}},this.mousedownHandler=s=>{if(this.mouse.buttons[s.button]=!0,s.button===0){const o=document.getElementById("chat-input");if(o&&document.activeElement===o||s.target.closest("#btn-game-menu")||s.target.closest(".inv-slot")||s.target.closest("button")||s.target.closest("input")||s.target.closest(".inventory-display"))return;this.mouse.clicked=!0,this.firstPersonMode&&(document.pointerLockElement===document.getElementById("game-container")||this.requestPointerLock())}const a=s.button===1,r=s.button===2;(a&&this.mouse.buttons[2]||r&&this.mouse.buttons[1])&&(this.devCheatActive=!this.devCheatActive,this.devCheatActive&&this.localPlayer?(this.localPlayer.maxHealth=200,this.localPlayer.health=200):this.localPlayer&&(this.localPlayer.maxHealth=100,this.localPlayer.health>100&&(this.localPlayer.health=100)))},this.mouseupHandler=s=>{this.mouse.buttons[s.button]=!1,s.button===0&&(this.mouse.clicked=!1)},this.wheelHandler=s=>{const a=document.getElementById("chat-input");a&&document.activeElement===a||this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)},window.addEventListener("mousemove",this.mousemoveHandler),window.addEventListener("mousedown",this.mousedownHandler),window.addEventListener("mouseup",this.mouseupHandler),window.addEventListener("wheel",this.wheelHandler,{passive:!0}),this.contextmenuHandler=s=>{s.preventDefault()},window.addEventListener("contextmenu",this.contextmenuHandler),this.invSlot1Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(1)},this.invSlot2Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(2)},this.invSlot3Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)};const e=document.getElementById("inv-slot-1"),t=document.getElementById("inv-slot-2"),i=document.getElementById("inv-slot-3");e&&e.addEventListener("click",this.invSlot1Handler),t&&t.addEventListener("click",this.invSlot2Handler),i&&i.addEventListener("click",this.invSlot3Handler),this.setupGamepad(),this.pointerLockChangeHandler=()=>{const s=document.pointerLockElement===document.getElementById("game-container"),a=this.matchMode&&this.matchMode.startsWith("firstperson");!s&&this.firstPersonMode&&!a&&this.toggleFirstPersonMode()},document.addEventListener("pointerlockchange",this.pointerLockChangeHandler)}setupGamepad(){this._gpState={prevButtons:[],deadzone:.18,aimAngle:0,aimActive:!1,frameCount:0,cachedGP:null}}pollGamepad(){if(!navigator.getGamepads)return;const e=this._gpState;if(e.frameCount++,e.frameCount%2===0){const d=navigator.getGamepads();e.cachedGP=null;for(let u=0;u<d.length;u++)if(d[u]){e.cachedGP=d[u];break}}const t=e.cachedGP;if(!t||!this.localPlayer||this.localPlayer.health<=0)return;const i=e.deadzone,s=d=>t.buttons[d],a=d=>!!(s(d)&&s(d).pressed),r=d=>s(d)?s(d).value:0,o=d=>!!e.prevButtons[d],l=Math.abs(t.axes[0])>i?t.axes[0]:0,c=Math.abs(t.axes[1])>i?t.axes[1]:0;this.keys.w=c<-i,this.keys.s=c>i,this.keys.a=l<-i,this.keys.d=l>i,this.keys.shift=a(10);const h=Math.abs(t.axes[2])>i?t.axes[2]:0,f=Math.abs(t.axes[3])>i?t.axes[3]:0;if(Math.hypot(h,f)>i?(e.aimAngle=Math.atan2(f,h),e.aimActive=!0):e.aimActive=!1,e.aimActive&&(this.mouse.angle=e.aimAngle,this.localPlayer.angle=e.aimAngle),this.mouse.clicked=r(7)>.3,a(4)&&!o(4)&&this.localPlayer.switchSlot(1),a(5)&&!o(5)&&this.localPlayer.switchSlot(2),a(1)&&!o(1)&&(this.keys.r=!0,setTimeout(()=>{this.keys.r=!1},80)),this.keys[" "]=a(0),a(3)&&!o(3)){this.localPlayer.flashlightActive=!this.localPlayer.flashlightActive;try{this.sound.playMetallicClick(0,1800,.05,.15)}catch{}}a(2)&&!o(2)&&this.localPlayer.flashGrenades>0&&(this.localPlayer.throwFlashbangRequest=!0),e.prevButtons=Array.from(t.buttons).map(d=>!!(d&&d.pressed))}toggleFirstPersonMode(){if(this.matchMode&&this.matchMode.startsWith("firstperson")&&this.firstPersonMode){const s=document.getElementById("btn-toggle-fpm");s&&(s.style.display="none");const a=document.getElementById("game-canvas-3d");a&&(a.style.display="block",this.firstPersonController&&this.firstPersonController.onResize()),this.firstPersonController.active=!0,this.requestPointerLock();return}this.firstPersonMode=!this.firstPersonMode;const t=document.getElementById("btn-toggle-fpm"),i=document.getElementById("game-canvas-3d");this.firstPersonMode?(t&&t.classList.add("active"),i&&(i.style.display="block"),this.firstPersonController.active=!0,this.firstPersonController&&this.firstPersonController.onResize(),this.requestPointerLock()):(t&&t.classList.remove("active"),i&&(i.style.display="none"),this.firstPersonController.active=!1,this.exitPointerLock())}requestPointerLock(){const e=document.getElementById("game-container");e&&e.requestPointerLock&&e.requestPointerLock()}exitPointerLock(){document.exitPointerLock&&document.exitPointerLock()}destroy(){this.active=!1,window.removeEventListener("resize",this.resizeHandler),window.removeEventListener("keydown",this.keydownHandler),window.removeEventListener("keyup",this.keyupHandler),window.removeEventListener("mousemove",this.mousemoveHandler),window.removeEventListener("mousedown",this.mousedownHandler),window.removeEventListener("mouseup",this.mouseupHandler),window.removeEventListener("wheel",this.wheelHandler),window.removeEventListener("contextmenu",this.contextmenuHandler);const e=document.getElementById("inv-slot-1"),t=document.getElementById("inv-slot-2"),i=document.getElementById("inv-slot-3");if(e&&this.invSlot1Handler&&e.removeEventListener("click",this.invSlot1Handler),t&&this.invSlot2Handler&&t.removeEventListener("click",this.invSlot2Handler),i&&this.invSlot3Handler&&i.removeEventListener("click",this.invSlot3Handler),this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.zoneTimer&&(clearTimeout(this.zoneTimer),this.zoneTimer=null),this.sound){try{this.sound.stopAllAlarms()}catch{}try{this.sound.stopBearMusic()}catch{}}this.network&&this.network.destroy();const s=document.querySelector(".score-display");s&&(s.style.display="");const a=document.querySelector(".timer-display");a&&(a.style.display="");const r=document.querySelector(".bars-container.right-aligned");r&&(r.style.display="");const o=document.querySelector(".opponent-weapon-display");o&&(o.style.display="");const l=document.querySelector(".ammo-display");l&&(l.style.display="");const c=document.querySelector(".inventory-display");c&&(c.style.display=""),this.socket&&this.socket.off("opponent-throw-grenade"),this.particles.clear(),window.OnBotShootCallback=null,window.AppSocket=null}updateSettings(e){this.sound&&this.sound.setVolume(e.volume),this.particles&&this.particles.setBloodEnabled(e.blood);let t=!1;const i=this.matchMode||this.mode||"";this.isRanked?i.includes("competitive")&&(t=!0):this.qpRenderStyle==="competitive"&&(t=!0),this.settings={...e},this.matchMode==="sabotage"?(this.settings.performanceMode=!1,this.settings.shadows=!0):t?(this.settings.performanceMode=!0,this.settings.shadows=!1):(this.settings.performanceMode=!1,this.settings.shadows=!0)}shakeCamera(e){this.cameraShake=Math.max(this.cameraShake,e)}spawnBulletFromNetwork(e){if(e.pellets&&e.pellets>1)for(let t=0;t<e.pellets;t++)this.bullets.push(new pa(e));else this.bullets.push(new pa(e))}startRoundCycle(){if(this.gameState="countdown",this.countdownTimer=3,this.countdownStart=performance.now(),this.matchMode==="sabotage"){this.vents=[{id:"vent_a",x:180,y:180,name:"North-West Vent"},{id:"vent_b",x:this.mapWidth-180,y:180,name:"North-East Vent"},{id:"vent_c",x:180,y:this.mapHeight-180,name:"South-West Vent"},{id:"vent_d",x:this.mapWidth-180,y:this.mapHeight-180,name:"South-East Vent"},{id:"vent_e",x:700,y:700,name:"Central Vent"}],this.ventCooldown=0,this.currentVent=null,this.activeTask=null,this.localPlayer&&(this.localPlayer.inVent=!1,this.localPlayer.weaponKey="none");const f=[];for(let v=0;v<9;v++){const m=this.map.rooms[v];m&&f.push({name:m.name||`Section ${v+1}`,x:Math.round(m.x+m.w/2),y:Math.round(m.y+m.h/2)})}f.push({name:"Central Corridors",x:700,y:700});const u=[...f].sort(()=>Math.random()-.5).slice(0,5),g=["Fix Wiring","Calibrate Core","Download Files","Clear Vent Filters","Stabilize Energy Grid","Align Antenna","Unlock Console","Refuel Engine","Inspect Sample","Reset Breakways"];this.tasks=u.map((v,m)=>({id:`task_r${this.roundNumber}_${m}`,x:v.x,y:v.y,name:g[m%g.length]+` in ${v.name}`,rawName:g[m%g.length],progress:0,targetProgress:100,status:"pending",alarmActive:!1,alarmTimer:0}))}this.lastSprintTime=performance.now(),this.sprintTipVisible=!1;const e=document.getElementById("sprint-tip-popup");e&&(e.style.display="none");const t=(this.map.seed||"default_seed")+"_"+this.roundNumber;let i=0;for(let f=0;f<t.length;f++)i=(i<<5)-i+t.charCodeAt(f),i|=0;const s=()=>(i=i*1664525+1013904223|0,(i>>>0)/4294967296),a=[this.spawns[0],this.spawns[2]],r=[this.spawns[1],this.spawns[3]],o=s()<.5?0:1,l=s()<.5?0:1;this.players.forEach((f,d)=>{let u;f.team===1?u=a[(o+d)%a.length]:u=r[(l+d)%r.length],f.x=u.x,f.y=u.y,f.vx=0,f.vy=0,f.health=f.isLocal&&this.devCheatActive?200:100,f.ammoInMag=f.weapon.magSize,f.reserveAmmo=f.weapon.magSize*3,f.isReloading=!1,f.floatingText=null,f.isDeadLogged=!1,f.flashGrenades=1,f.flashAlpha=0,f.isBot&&(f.botState="patrol",f.choosePatrolPoint(this.map))}),this.bullets=[],this.grenades=[],this.particles.clear(),this.map.generateMap(),this.localPlayer.updateHUD(),this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchTime=120;const c=document.getElementById("hud-status");c&&(c.innerText=`ROUND ${this.roundNumber} - COOLDOWN`),this.zoneTimer&&(clearTimeout(this.zoneTimer),this.zoneTimer=null);const h=Math.max(this.mapWidth,this.mapHeight)/2;this.zone.active=!1,this.zone.currentRadius=h*1.05,this.zone.targetRadius=h*1.05,this.zone.centerX=this.mapWidth/2,this.zone.centerY=this.mapHeight/2,this.zone.shrinkSpeed=0,this.zone.lastDamageTick=0,this.zone.warnShown=!1;try{this.sound.playFrictionalScrape(0,.5,.1)}catch{}}startRoundAction(){if(this.gameState="playing",this.roundStartTime=performance.now(),this.matchMode==="sabotage")try{this.sound.playBearMusic()}catch{}const e=document.getElementById("hud-status");e&&(e.innerText="ENGAGE TARGET"),this.matchMode!=="sabotage"&&(this.matchTimerInterval=setInterval(()=>{if(this.gameState==="playing"){this.matchTime--,this.matchTime<=0&&(this.matchTime=0,this.endRound(null,"TIME EXPIRED"));const t=Math.floor(this.matchTime/60).toString().padStart(2,"0"),i=(this.matchTime%60).toString().padStart(2,"0"),s=document.getElementById("game-timer");s&&(s.innerText=`${t}:${i}`)}},1e3)),this.matchMode!=="sabotage"&&(this.zoneTimer&&clearTimeout(this.zoneTimer),this.zoneTimer=setTimeout(()=>{if(this.gameState!=="playing")return;const t=Math.max(this.mapWidth,this.mapHeight)/2;this.zone.active=!0,this.zone.currentRadius=t*1.05,this.zone.targetRadius=t*.12,this.zone.shrinkSpeed=(this.zone.currentRadius-this.zone.targetRadius)/(60*60),this.zone.lastDamageTick=performance.now(),this.zone.centerX=this.mapWidth/2,this.zone.centerY=this.mapHeight/2;const i=document.getElementById("hud-status");i&&(i.innerText="⚠ ZONE CLOSING IN!",i.style.color="#ff3c3c",setTimeout(()=>{this.gameState==="playing"&&i&&(i.innerText="ENGAGE TARGET",i.style.color="")},2500))},4e4))}endRound(e,t=""){if(this.gameState!=="playing")return;if(this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchMode==="sabotage")try{this.sound.stopBearMusic()}catch{}let i=document.getElementById("hud-status");const s=this.localPlayer.team;e===s?(this.scoreSelf++,this.matchMode==="sabotage"&&(this.scoreSelf=3),i&&(i.innerText="ROUND WON",i.style.color="#39ff14")):e!==null?(this.scoreOpponent++,this.matchMode==="sabotage"&&(this.scoreOpponent=3),i&&(i.innerText="ROUND LOST",i.style.color="#ff3c3c")):i&&(i.innerText="ROUND DRAW",i.style.color="#ffd700"),this.updateScoreboardHUD();const a=()=>{this.scoreSelf>=3||this.scoreOpponent>=3?this.endMatch():(this.roundNumber++,this.startRoundCycle())};setTimeout(()=>{this.active&&this.startReplay(a)},0)}endMatch(){this.gameState="match-over",this.active=!1;const e=window.MatchStats.shotsFired||1,t=window.MatchStats.hitsRegistered/e*100;window.MatchStats.accuracy=t,window.MatchStats.roundsWon=this.scoreSelf;const i=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent?this.localPlayer.team:this.localPlayer.team===1?2:1:this.scoreSelf>=3?this.localPlayer.team:this.localPlayer.team===1?2:1,s=this.players.find(c=>c.team===i);window.MatchStats.winnerId=s?s.id:"unknown";const a=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent:this.scoreSelf>=3,r=this.localPlayer.rank?this.localPlayer.rank.label:"";let o=!1,l=0;this.isRanked&&(o=this.localPlayer.applyRankDelta(a?fa:ua),l=a?fa:ua),window.MatchStats.isWin=a,window.MatchStats.newRP=this.localPlayer.rp,window.MatchStats.newRank=this.localPlayer.rank,window.MatchStats.rpDelta=l,window.MatchStats.rankChanged=o,window.MatchStats.oldRankLabel=r,this.scoreSelf>=3?this.sound.playMatchWin():this.sound.playMatchLose(),this.onMatchEnd&&this.onMatchEnd(window.MatchStats)}endGameDueToDisconnect(e){this.gameState="match-over",this.active=!1,alert(e);const t=document.getElementById("btn-return-lobby");t&&t.click()}updateScoreboardHUD(){const e=document.getElementById("score-self");e&&(e.innerText=this.scoreSelf);const t=document.getElementById("score-opponent");t&&(t.innerText=this.scoreOpponent);const i=document.getElementById("hud-self-name");i&&(i.innerText=this.mode==="online"&&this.players.length>2?"YOUR TEAM":this.localPlayer.name.toUpperCase());const s=document.getElementById("hud-opponent-name");s&&(s.innerText=this.players.length>2?"OPPONENTS":"OPPONENT");const a=document.getElementById("hud-opponent-weapon");if(a)if(this.players.length>2)a.innerText="SQUAD LOADOUT";else{const o=this.players.find(l=>l.id!==this.localPlayer.id);a.innerText=o?o.weapon.name.toUpperCase():"UNKNOWN"}const r=document.getElementById("opponent-indicator");r&&(r.className="op-indicator online")}drawErrorOverlay(e){try{this.ctx.restore()}catch{}this.ctx.fillStyle="rgba(10, 10, 15, 0.95)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="#ff3c3c",this.ctx.font="bold 20px monospace",this.ctx.fillText("TACTICSTRIKE RUNTIME ERROR DETECTED",20,50),this.ctx.fillStyle="#ffffff",this.ctx.font="12px monospace";const t=(e.stack||e.toString()).split(`
`);let i=90;t.forEach(s=>{const a=Math.floor((this.canvas.width-40)/7);for(let r=0;r<s.length;r+=a)this.ctx.fillText(s.substring(r,r+a),20,i),i+=18})}loop(){if(!this.active)return;const e=performance.now();if(this.lastTime=e,this.fpsFrameCount++,e-this.fpsLastTick>=1e3){this.currentFPS=Math.round(this.fpsFrameCount*1e3/(e-this.fpsLastTick)),this.fpsFrameCount=0,this.fpsLastTick=e;const t=document.getElementById("fps-counter");t&&this.settings&&this.settings.showFps&&(t.innerText=`FPS: ${this.currentFPS}`)}try{this.update(e),this.render()}catch(t){console.error("Game Loop Crash:",t),this.drawErrorOverlay(t),this.active=!1;return}requestAnimationFrame(()=>this.loop())}triggerHitmarker(e,t,i,s){this.activeHitmarkers.push({x:e,y:t,age:0,duration:200,isHeadshot:!!s}),this.floatingNumbers.push({x:e,y:t-10,damage:i,age:0,duration:800,isHeadshot:!!s})}registerLocalPlayerKill(e){if(e-this.lastKillTime<4e3?this.multiKillCount++:this.multiKillCount=1,this.lastKillTime=e,this.multiKillCount>=2){let t="DOUBLE KILL!";if(this.multiKillCount===3?t="TRIPLE KILL!":this.multiKillCount>3&&(t="RAMPAGE!"),this.combatBanner={text:t,timer:3,scale:2},this.sound)try{this.sound.playHighBeep()}catch(i){console.warn(i)}}}update(e){this.lastUpdateTime||(this.lastUpdateTime=e);const t=e-this.lastUpdateTime;this.lastUpdateTime=e;const i=Math.max(1,Math.min(150,t));if(this.dtFactor=i/16.67,this.combatBanner&&(this.combatBanner.timer-=i/1e3,this.combatBanner.timer<=0&&(this.combatBanner=null)),this.activeMinigame){this.activeMinigame.timer-=i/1e3;const _=document.getElementById("minigame-timer-bar");_&&(_.style.width=`${Math.max(0,this.activeMinigame.timer/4*100)}%`),this.activeMinigame.timer<=0&&this.failHackingMinigame()}let s=null;this.map&&this.map.terminals&&this.localPlayer&&this.localPlayer.health>0&&(s=this.map.terminals.find(_=>!_.hacked&&Math.hypot(this.localPlayer.x-_.x,this.localPlayer.y-_.y)<55));const a=document.getElementById("hud-interaction-prompt");if(s&&this.gameState==="playing"?(a&&(a.style.display="block",a.innerText=this.keys.e?`HACKING... ${Math.round(this.hackingProgress)}%`:"HOLD [E] TO HACK TERMINAL"),this.keys.e&&!this.activeMinigame?(this.localPlayer.vx=0,this.localPlayer.vy=0,this.hackingProgress||(this.hackingProgress=0),this.hackingProgress+=i*.08,this.hackingProgress>=100&&(this.hackingProgress=0,this.startHackingMinigame(s))):this.activeMinigame||(this.hackingProgress=Math.max(0,(this.hackingProgress||0)-i*.1))):(a&&!this.activeMinigame&&(a.style.display="none"),this.hackingProgress=0),this.matchMode==="sabotage"&&(this.ventCooldown>0&&(this.ventCooldown=Math.max(0,this.ventCooldown-i/1e3)),this.activeTask&&(this.sweepAngle+=.06*this.dtFactor),this.tasks.forEach(_=>{if(_.alarmActive){_.alarmTimer-=i/1e3;const x=Math.hypot(this.localPlayer.x-_.x,this.localPlayer.y-_.y);try{this.sound.playAlarmForTask(_.id,x)}catch{}if(_.alarmTimer<=0){_.alarmActive=!1,_.lastBeepTime=0;try{this.sound.stopAlarmForTask(_.id)}catch{}}}else try{this.sound.stopAlarmForTask(_.id)}catch{}})),this.gameState==="replay"){if(this.replayIndex+=this.dtFactor,Math.floor(this.replayIndex)>=this.replayFrames.length&&this.postReplayCallback){const _=this.postReplayCallback;this.postReplayCallback=null,_()}return}if(this.pollGamepad(),this.gameState==="countdown"){const _=(e-this.countdownStart)/1e3,x=3-Math.floor(_);if(x!==this.countdownTimer&&x>=0){this.countdownTimer=x;try{this.sound.playMetallicClick(0,1e3,.05,.2)}catch{}}if(x>0){const y=document.getElementById("hud-status");y&&(y.innerText=`DEPLOYING IN ${x}...`)}else{try{this.sound.playMetallicClick(0,2e3,.15,.35)}catch{}this.startRoundAction()}}(this.gameState==="playing"||this.gameState==="countdown")&&(this.localPlayer.update(this.keys,this.mouse,this.map,this.sound,e,null,this.localPlayer),this.localPlayer.justDashed&&(this.localPlayer.justDashed=!1,this.particles.spawnDashParticles(this.localPlayer.x,this.localPlayer.y,this.localPlayer.angle,this.localPlayer.colorTheme)),this.mode==="offline"?this.players.forEach(_=>{if(_.isBot){const x=_.team===1?2:1,y=this.players.filter(E=>E.health>0&&E.team===x);y.length>0?(y.sort((E,P)=>Math.hypot(_.x-E.x,_.y-E.y)-Math.hypot(_.x-P.x,_.y-P.y)),_.update(null,null,this.map,this.sound,e,y[0],this.localPlayer)):_.update(null,null,this.map,this.sound,e,null,this.localPlayer)}}):this.network.interpolateOpponents(),this.players.forEach(_=>{if(_!==this.localPlayer&&_.justDashed&&(_.justDashed=!1,this.particles.spawnDashParticles(_.x,_.y,_.angle,_.colorTheme),this.sound)){const x=Math.hypot(_.x-this.localPlayer.x,_.y-this.localPlayer.y);this.sound.playDashSound(x)}}),this.localPlayer.checkPickups(this.map,this.sound),this.mode==="offline"&&this.players.forEach(_=>{_.isBot&&_.checkPickups(this.map,this.sound)}),this.players.forEach(_=>{if(this.gameState==="playing"&&_.throwFlashbangRequest&&_.flashGrenades>0){_.throwFlashbangRequest=!1,_.flashGrenades--,_.isLocal&&!_.isBot&&_.updateHUD();const x=11,y=Math.cos(_.angle)*x,E=Math.sin(_.angle)*x,P=new $c(_.x,_.y,y,E,_.id);this.grenades.push(P);try{this.sound.playMetallicClick(0,1500,.08,.2)}catch{}this.mode==="online"&&_.isLocal&&this.socket.emit("throw-grenade",{x:_.x,y:_.y,vx:y,vy:E})}else _.throwFlashbangRequest=!1}));const r=this.devCheatActive&&this.localPlayer.aimbotHasLOS;if(this.gameState==="playing"&&(this.mouse.clicked||r)&&!this.localPlayer.isReloading){const _=this.localPlayer.weapon.type==="Automatic"||r,x=e-this.localPlayer.lastFiredTime;if(_||x>this.localPlayer.weapon.fireRate){const y=this.localPlayer.shoot(e,this.sound);if(y){if(window.MatchStats.shotsFired+=y.pellets||1,this.shakeCamera(y.recoil*.7),this.particles.spawnGunCasing(this.localPlayer.x,this.localPlayer.y,this.localPlayer.angle,this.localPlayer.weaponKey),y.pellets&&y.pellets>1)for(let E=0;E<y.pellets;E++)this.bullets.push(new pa(y));else this.bullets.push(new pa(y));this.mode==="online"&&this.network.sendShoot(y),_||(this.mouse.clicked=!1)}}}for(let _=this.bullets.length-1;_>=0;_--){const x=this.bullets[_];x.update(this.map,this.players,this.particles,this.sound,this.dtFactor),x.active||(x.playerId===this.localPlayer.id&&window.MatchStats.hitsRegistered++,this.bullets.splice(_,1))}for(let _=this.grenades.length-1;_>=0;_--){const x=this.grenades[_];if(x.update(this.map,e),!x.active){this.particles.spawnFlashbangBurst(x.x,x.y);const y=Math.hypot(this.localPlayer.x-x.x,this.localPlayer.y-x.y);this.sound.playFlashbangExplosion(y),y<800&&this.shakeCamera(Math.max(1,15*(1-y/800))),this.players.forEach(E=>{if(E.health<=0)return;Math.hypot(E.x-x.x,E.y-x.y)<380&&E.checkLineOfSight(this.map,x.x,x.y,E.x,E.y)&&(E.flashAlpha=1,E.isLocal&&E.updateHUD())}),this.grenades.splice(_,1)}}this.particles.update(this.map);for(let _=this.activeHitmarkers.length-1;_>=0;_--){const x=this.activeHitmarkers[_];x.age+=i,x.age>=x.duration&&this.activeHitmarkers.splice(_,1)}for(let _=this.floatingNumbers.length-1;_>=0;_--){const x=this.floatingNumbers[_];x.age+=i,x.y-=1*this.dtFactor,x.age>=x.duration&&this.floatingNumbers.splice(_,1)}this.players.forEach(_=>{_.health<=0&&!_.isDeadLogged&&(_.isDeadLogged=!0,this.onKillFeed&&this.onKillFeed("Eliminated",_.name,_.weaponKey))});const o=this.players.filter(_=>_.team===this.localPlayer.team),l=o.reduce((_,x)=>{let y=x.health;return x.isLocal&&this.devCheatActive&&(y=Math.round(y/2)),_+y},0)/o.length,c=document.getElementById("hud-self-hp");c&&(c.style.width=`${Math.max(0,l)}%`);const h=document.getElementById("hud-self-hp-text");h&&(h.innerText=Math.round(Math.max(0,l)));const f=this.localPlayer.team===1?2:1,d=this.players.filter(_=>_.team===f),u=d.reduce((_,x)=>_+x.health,0)/d.length,g=document.getElementById("hud-opponent-hp");if(g&&(g.style.width=`${Math.max(0,u)}%`),this.zone.active&&this.gameState==="playing"){this.zone.currentRadius>this.zone.targetRadius&&(this.zone.currentRadius=Math.max(this.zone.targetRadius,this.zone.currentRadius-this.zone.shrinkSpeed*this.dtFactor));const _=e;_-this.zone.lastDamageTick>=1e3&&(this.zone.lastDamageTick=_,this.players.forEach(x=>{if(x.health<=0||this.mode==="online"&&!x.isLocal)return;const y=x.x-this.zone.centerX,E=x.y-this.zone.centerY;if(Math.sqrt(y*y+E*E)>this.zone.currentRadius&&(x.takeDamage(this.zone.damage,this.sound),x.isLocal&&!x.isBot&&(x.showTextNotification&&x.showTextNotification("-20 ZONE DAMAGE"),this.mode==="online"&&this.socket))){const w=this.devCheatActive?Math.round(x.health/2):x.health;this.socket.emit("sync-health",{playerId:x.id,health:w})}}))}if(this.gameState==="playing"){const _=this.players.some(y=>y.health>0&&y.team===1),x=this.players.some(y=>y.health>0&&y.team===2);_&&!x?this.mode==="offline"&&this.endRound(1,"eliminated"):!_&&x?this.mode==="offline"&&this.endRound(2,"eliminated"):!_&&!x&&this.mode==="offline"&&this.endRound(null,"both dead")}this.gameState==="playing"&&this.players.forEach(_=>{if(_.health<=0||_.health>=_.maxHealth)return;const x=this.map.checkZone(_.x,_.y);x&&x.type==="healing"&&(_.health=Math.min(_.maxHealth,_.health+x.healRate),_.isLocal&&!_.isBot&&_.updateHUD())});const v=.25,m=this.localPlayer.x+(this.mouse.x-this.canvas.width/2)*v,p=this.localPlayer.y+(this.mouse.y-this.canvas.height/2)*v,b=1-Math.pow(1-.085,this.dtFactor);if(this.camera.x+=(m-this.camera.x)*b,this.camera.y+=(p-this.camera.y)*b,this.cameraShake>.1?(this.camera.shakeX=(Math.random()-.5)*this.cameraShake,this.camera.shakeY=(Math.random()-.5)*this.cameraShake,this.cameraShake*=Math.pow(.88,this.dtFactor)):(this.camera.shakeX=0,this.camera.shakeY=0,this.cameraShake=0),this.gameState==="playing"){const _=this.keys.shift,x=document.getElementById("sprint-tip-popup");_?(this.lastSprintTime=e,this.sprintTipVisible&&(this.sprintTipVisible=!1,x&&(x.style.display="none"))):this.localPlayer&&(Math.abs(this.localPlayer.vx)>.2||Math.abs(this.localPlayer.vy)>.2)?e-this.lastSprintTime>9e3&&(this.sprintTipVisible||(this.sprintTipVisible=!0,x&&(x.style.display="flex"))):this.lastSprintTime=e}if(this.mode==="online"&&(this.gameState==="playing"||this.gameState==="countdown")&&this.network.sendState(e),this.gameState==="playing"&&e-this.lastSnapshotTime>=1e3/60){this.lastSnapshotTime=e;const _={players:this.players.map(x=>({id:x.id,x:x.x,y:x.y,angle:x.angle,health:x.health,maxHealth:x.maxHealth,weaponKey:x.weaponKey,muzzleFlash:x.muzzleFlash,isLocal:x.isLocal,isBot:x.isBot,isTeammate:x.isTeammate,color:x.colorTheme,name:x.name,flashlightActive:x.flashlightActive,flashAlpha:x.flashAlpha,radius:x.radius})),bullets:this.bullets.map(x=>({x:x.x,y:x.y,prevX:x.prevX,prevY:x.prevY,angle:x.angle,playerId:x.playerId,active:x.active,weaponKey:x.weaponKey})),grenades:this.grenades.map(x=>({x:x.x,y:x.y})),particles:this.particles.particles.map(x=>({x:x.x,y:x.y,type:x.type,angle:x.angle,size:x.size,color:x.color,life:x.life})),decals:this.particles.decals.map(x=>({x:x.x,y:x.y,type:x.type,size:x.size,color:x.color,angle:x.angle,scaleX:x.scaleX,scaleY:x.scaleY})),camera:{x:this.camera.x,y:this.camera.y},brokenLightOn:this.map.ambientLights.brokenCeiling?this.map.ambientLights.brokenCeiling.on:!0};this.replayFrames.push(_),this.replayFrames.length>300&&this.replayFrames.shift()}}startReplay(e){const t=this.players.some(i=>i.health<=0);if(this.replayFrames&&this.replayFrames.length>0&&t){this.gameState="replay",this.replayIndex=0,this.postReplayCallback=e;const i=document.getElementById("hud-status");i&&(i.innerText="● REPLAY / KILLCAM",i.style.color="#ff3c3c")}else e()}drawSnapshotPlayer(e,t){if(this.ctx.save(),t){this.ctx.fillStyle="rgba(180, 0, 0, 0.35)",this.ctx.beginPath(),this.ctx.ellipse(e.x,e.y,26,22,0,0,Math.PI*2),this.ctx.fill(),dn.ready&&(this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle+Math.PI/2),this.ctx.globalAlpha=.55,dn.draw(this.ctx,e.id+"_dead",0,0,0,0,!1,e.isLocal?"blue":"red"),this.ctx.restore()),this.ctx.restore();return}if(this.settings.laser&&e.isLocal&&this.matchMode!=="sabotage"){let c=e.x+Math.cos(e.angle)*1200,h=e.y+Math.sin(e.angle)*1200;const f=this.map.getLineIntersection({x:e.x,y:e.y},{x:c,y:h});f&&(c=f.x,h=f.y),this.ctx.save(),this.ctx.strokeStyle=e.isLocal?"rgba(102, 252, 241, 0.5)":"rgba(255, 60, 60, 0.5)",this.ctx.lineWidth=1.2,this.ctx.beginPath(),this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(c,h),this.ctx.stroke();const d=e.isLocal?"#66fcf1":"#ff3c3c",u=this.ctx.createRadialGradient(c,h,1,c,h,6);u.addColorStop(0,"#ffffff"),u.addColorStop(.3,d),u.addColorStop(1,"rgba(0, 0, 0, 0)"),this.ctx.fillStyle=u,this.ctx.beginPath(),this.ctx.arc(c,h,6,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}const i=e.muzzleFlash>.1;if(!dn.draw(this.ctx,e.id,e.x,e.y,e.angle,0,i,e.isLocal?"blue":"red")){this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle);const l={cyan:{body:"#3ba39f",armor:"#16202c",helmet:"#66fcf1"},green:{body:"#39db14",armor:"#133d07",helmet:"#5eff39"},purple:{body:"#9d3bff",armor:"#20083c",helmet:"#c47aff"},orange:{body:"#ff7f3b",armor:"#3f1b07",helmet:"#ff9d7a"},yellow:{body:"#ffd700",armor:"#3a3000",helmet:"#ffea70"},red:{body:"#ff3c3c",armor:"#3a0707",helmet:"#ff7a7a"}},c=l[e.color]||l[e.isLocal?"cyan":"red"],h=c.body,f=c.armor,d=c.helmet;let u=18,g=4;e.weaponKey==="rifle"&&(u=24,g=5),e.weaponKey==="shotgun"&&(u=22,g=6),e.weaponKey==="sniper"&&(u=32,g=4),e.weaponKey==="smg"&&(u=16,g=4),e.weaponKey==="lmg"&&(u=26,g=7),e.weaponKey==="dmr"&&(u=28,g=5),e.weaponKey==="knife"&&(u=10,g=2),this.ctx.fillStyle="#444",this.ctx.strokeStyle="#000",this.ctx.lineWidth=1,this.ctx.fillRect(10,-g/2,u,g),this.ctx.strokeRect(10,-g/2,u,g),this.ctx.fillStyle=f,this.ctx.strokeStyle="#000",this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.arc(8,-10,5,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.arc(14,6,5,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle=h,this.ctx.beginPath(),this.ctx.ellipse(0,0,18,21,0,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle=f,this.ctx.beginPath(),this.ctx.ellipse(-3,0,14,16,0,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle=d,this.ctx.beginPath(),this.ctx.arc(-2,0,8,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle="#111",this.ctx.fillRect(1,-5,3,10),this.ctx.restore()}this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle),this.ctx.fillStyle=e.weaponKey==="knife"?"#b0b8c0":"#333",this.ctx.strokeStyle="rgba(0,0,0,0.7)",this.ctx.lineWidth=1;let a=18,r=3;if(e.weaponKey==="rifle"&&(a=26,r=4),e.weaponKey==="shotgun"&&(a=22,r=5),e.weaponKey==="sniper"&&(a=36,r=3),e.weaponKey==="smg"&&(a=16,r=3),e.weaponKey==="lmg"&&(a=28,r=5),e.weaponKey==="dmr"&&(a=30,r=4),e.weaponKey==="knife"&&(a=10,r=2),this.ctx.fillRect(12,-r/2,a,r),this.ctx.strokeRect(12,-r/2,a,r),e.muzzleFlash>0){this.ctx.save(),this.ctx.translate(12+a,0);const l=this.ctx.createRadialGradient(0,0,2,0,0,16);l.addColorStop(0,"rgba(255, 255, 255, 1.0)"),l.addColorStop(.3,"rgba(255, 220, 0, 0.9)"),l.addColorStop(.7,"rgba(255, 80, 0, 0.5)"),l.addColorStop(1,"rgba(255, 0, 0, 0.0)"),this.ctx.fillStyle=l,this.ctx.beginPath(),this.ctx.arc(0,0,16,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}this.ctx.restore(),this.ctx.save(),this.ctx.textAlign="center";const o=e.isLocal?"#66fcf1":e.isTeammate?"#39db14":"#ff3c3c";if(this.ctx.fillStyle=o,this.ctx.font="10px Orbitron",this.ctx.fillText(e.name.toUpperCase(),e.x,e.y-30),!e.isLocal&&e.health>0){this.ctx.fillStyle="rgba(0,0,0,0.5)",this.ctx.fillRect(e.x-20,e.y-26,40,4);const l=e.isTeammate?"#39db14":"#ff3c3c";this.ctx.fillStyle=l,this.ctx.fillRect(e.x-20,e.y-26,40*(e.health/e.maxHealth),4)}this.ctx.restore(),this.ctx.restore()}render(){let e=null;if(this.gameState==="replay"){const y=Math.min(this.replayFrames.length-1,Math.floor(this.replayIndex));e=this.replayFrames[y]}if(this.gameState==="replay"&&!e)return;this.ctx.fillStyle="#06070a",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const t=1920,i=1080,s=this.canvas.width/t,a=this.canvas.height/i,r=Math.min(s,a);this.zoom=Math.max(.5,Math.min(1.35,r)),this.ctx.save(),this.ctx.translate(this.canvas.width/2,this.canvas.height/2),this.ctx.scale(this.zoom,this.zoom);const o=e?e.camera.x:this.camera.x,l=e?e.camera.y:this.camera.y,c=e?0:this.camera.shakeX,h=e?0:this.camera.shakeY,f=-o+c,d=-l+h;this.ctx.translate(f,d);const u=e?e.players:this.players,g=e?e.bullets:this.bullets,v=e?e.brokenLightOn:this.map.ambientLights.brokenCeiling?this.map.ambientLights.brokenCeiling.on:!0;this.map.ambientLights.brokenCeiling&&(this.map.ambientLights.brokenCeiling.on=v),u.forEach(y=>{y.health>0&&y.flashlightActive?y.lightPoly=this.map.computeVisibilityPolygon(y.x,y.y,700,y.angle,65*Math.PI/180):y.lightPoly=null}),e?e.decals.forEach(y=>{this.ctx.save(),this.ctx.translate(y.x,y.y),this.ctx.rotate(y.angle),this.ctx.globalAlpha=y.type==="blood"?.75:.9,y.type==="blood"?(this.ctx.fillStyle=y.color,this.ctx.beginPath(),this.ctx.ellipse(0,0,y.size*y.scaleX,y.size*y.scaleY,0,0,Math.PI*2),this.ctx.fill()):y.type==="casing"?(this.ctx.fillStyle="#b5921c",this.ctx.fillRect(-y.size,-y.size/2,y.size*2,y.size)):y.type==="splinter"&&(this.ctx.fillStyle="#6e441c",this.ctx.fillRect(-y.size,-y.size/3,y.size*1.5,y.size*.7)),this.ctx.restore()}):this.particles.drawDecals(this.ctx);const m=e?e.players.find(y=>y.isLocal):this.localPlayer;if(this.map.draw(this.ctx,this.settings,u,m,g),u.forEach(y=>{y.health<=0&&(e?this.drawSnapshotPlayer(y,!0):y.draw(this.ctx))}),u.forEach(y=>{if(y.health<=0)return;let E=!0;if(this.settings.shadows&&m&&m.health>0&&!y.isLocal){const P=m.flashlightActive&&m.lightPoly&&this.isPointInPolygon({x:y.x,y:y.y},m.lightPoly),S=!this.map.getLineIntersection({x:m.x,y:m.y},{x:y.x,y:y.y}),w=this.map.isPointInAmbientLight(y.x,y.y,y.radius||18);E=P||y.isTeammate||y.flashlightActive&&S||w&&S}E&&(e?this.drawSnapshotPlayer(y,!1):y.draw(this.ctx,this.settings,this.map))}),m&&m.health>0&&(this.ctx.save(),this.ctx.translate(m.x,m.y),this.ctx.strokeStyle="rgba(102, 252, 241, 0.15)",this.ctx.lineWidth=1,this.ctx.setLineDash([4,8]),this.ctx.beginPath(),this.ctx.arc(0,0,32,Date.now()/1500,Date.now()/1500+Math.PI*2),this.ctx.stroke(),this.ctx.restore()),this.ctx.save(),this.ctx.globalCompositeOperation="lighter",e?(e.bullets.forEach(y=>{if(y.active){if(this.ctx.save(),y.weaponKey==="knife")this.ctx.lineWidth=3.5,this.ctx.lineCap="round",this.ctx.strokeStyle="rgba(230, 235, 255, 0.85)",this.ctx.shadowColor="#66fcf1",this.ctx.shadowBlur=6,this.ctx.beginPath(),this.ctx.arc(y.x,y.y,18,y.angle-.6,y.angle+.6),this.ctx.stroke();else{this.ctx.lineWidth=2.5,this.ctx.lineCap="round";const E=y.playerId===(m==null?void 0:m.id),P=this.ctx.createLinearGradient(y.prevX,y.prevY,y.x,y.y);E?(P.addColorStop(0,"rgba(102, 252, 241, 0.0)"),P.addColorStop(1,"rgba(102, 252, 241, 1.0)"),this.ctx.strokeStyle=P,this.ctx.shadowColor="#66fcf1"):(P.addColorStop(0,"rgba(255, 60, 60, 0.0)"),P.addColorStop(1,"rgba(255, 60, 60, 1.0)"),this.ctx.strokeStyle=P,this.ctx.shadowColor="#ff3c3c"),this.ctx.shadowBlur=4,this.ctx.beginPath(),this.ctx.moveTo(y.prevX,y.prevY),this.ctx.lineTo(y.x,y.y),this.ctx.stroke()}this.ctx.restore()}}),e.particles.forEach(y=>{this.ctx.save(),this.ctx.globalAlpha=Math.max(0,y.life),y.type==="casing"?(this.ctx.translate(y.x,y.y),this.ctx.rotate(y.angle),this.ctx.fillStyle="#d4af37",this.ctx.strokeStyle="#996515",this.ctx.lineWidth=.5,this.ctx.fillRect(-y.size,-y.size/2,y.size*2,y.size),this.ctx.strokeRect(-y.size,-y.size/2,y.size*2,y.size)):y.type==="splinter"?(this.ctx.translate(y.x,y.y),this.ctx.rotate(y.angle),this.ctx.fillStyle="#8b5a2b",this.ctx.beginPath(),this.ctx.moveTo(-y.size,0),this.ctx.lineTo(y.size,-y.size/2),this.ctx.lineTo(y.size/2,y.size/2),this.ctx.closePath(),this.ctx.fill()):y.type==="blood"?(this.ctx.fillStyle=y.color,this.ctx.beginPath(),this.ctx.arc(y.x,y.y,y.size,0,Math.PI*2),this.ctx.fill()):(this.ctx.fillStyle=y.color,(y.color.startsWith("#66fc")||y.color.startsWith("#ff3c"))&&(this.ctx.shadowColor=y.color,this.ctx.shadowBlur=4),this.ctx.beginPath(),this.ctx.arc(y.x,y.y,y.size*y.life,0,Math.PI*2),this.ctx.fill()),this.ctx.restore()})):(this.bullets.forEach(y=>y.draw(this.ctx)),this.particles.drawParticles(this.ctx)),this.ctx.restore(),e&&e.grenades?e.grenades.forEach(y=>{this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(y.x,y.y,6,0,Math.PI*2),this.ctx.fillStyle="#2d332f",this.ctx.strokeStyle="#66fcf1",this.ctx.lineWidth=1.5,this.ctx.fill(),this.ctx.stroke(),this.ctx.restore()}):this.grenades&&this.grenades.forEach(y=>y.draw(this.ctx)),!e&&this.zone&&this.zone.active){const y=this.zone,E=Date.now(),P=Math.sin(E/300)*.15+.85;this.ctx.save(),this.ctx.beginPath(),this.ctx.rect(-100,-100,this.mapWidth+200,this.mapHeight+200),this.ctx.arc(y.centerX,y.centerY,y.currentRadius,0,Math.PI*2,!0),this.ctx.fillStyle=`rgba(255, 30, 30, ${.12*P})`,this.ctx.fill("evenodd"),this.ctx.beginPath(),this.ctx.arc(y.centerX,y.centerY,y.currentRadius,0,Math.PI*2),this.ctx.strokeStyle=`rgba(255, 50, 50, ${.85*P})`,this.ctx.lineWidth=4,this.ctx.shadowColor="#ff2222",this.ctx.shadowBlur=18,this.ctx.stroke(),this.ctx.shadowBlur=0,this.ctx.beginPath(),this.ctx.arc(y.centerX,y.centerY,y.currentRadius,0,Math.PI*2),this.ctx.strokeStyle=`rgba(255, 150, 150, ${.3*P})`,this.ctx.lineWidth=12,this.ctx.stroke(),this.ctx.restore()}this.matchMode==="sabotage"&&(this.vents.forEach(y=>{this.ctx.save(),this.ctx.translate(y.x,y.y),this.ctx.fillStyle="#1e2124",this.ctx.fillRect(-20,-15,40,30),this.ctx.strokeStyle="#535960",this.ctx.lineWidth=2.5,this.ctx.strokeRect(-20,-15,40,30),this.ctx.strokeStyle="#0f1112",this.ctx.lineWidth=2;for(let P=-12;P<=12;P+=6)this.ctx.beginPath(),this.ctx.moveTo(P,-10),this.ctx.lineTo(P,10),this.ctx.stroke();Math.hypot(this.localPlayer.x-y.x,this.localPlayer.y-y.y)<50&&this.localPlayer.health>0&&!this.localPlayer.inVent&&(this.ctx.fillStyle="#66fcf1",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("[E] VENT",0,-22)),this.ctx.restore()}),this.tasks.forEach(y=>{const E=Date.now();this.ctx.save(),this.ctx.translate(y.x,y.y);const S=E%1200/1200*Math.PI*2;if(y.alarmActive){const N=.7+.3*Math.abs(Math.sin(E/60+y.x)),I=90+20*Math.abs(Math.sin(E/200)),O=Math.PI/6;this.ctx.save(),this.ctx.createConicalGradient;for(let K=0;K<2;K++){const j=S+K*Math.PI;this.ctx.beginPath(),this.ctx.moveTo(0,-26),this.ctx.arc(0,-26,I,j-O,j+O),this.ctx.closePath();const ee=this.ctx.createRadialGradient(0,-26,0,0,-26,I);ee.addColorStop(0,`rgba(255, 60, 40, ${.55*N})`),ee.addColorStop(.45,`rgba(255, 80, 40, ${.18*N})`),ee.addColorStop(1,"rgba(255, 40, 0, 0)"),this.ctx.fillStyle=ee,this.ctx.fill()}const B=this.ctx.createRadialGradient(0,0,0,0,0,75);B.addColorStop(0,`rgba(255, 30, 10, ${.22*N})`),B.addColorStop(1,"rgba(255,0,0,0)"),this.ctx.fillStyle=B,this.ctx.beginPath(),this.ctx.ellipse(0,5,75,35,0,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}else if(y.status==="doing"){const N=.12+.1*Math.abs(Math.sin(E/350)),I=this.ctx.createRadialGradient(0,0,0,0,0,40);I.addColorStop(0,`rgba(255,220,50,${N})`),I.addColorStop(1,"rgba(255,200,0,0)"),this.ctx.fillStyle=I,this.ctx.beginPath(),this.ctx.ellipse(0,5,40,22,0,0,Math.PI*2),this.ctx.fill()}y.status,y.alarmActive||y.status,this.ctx.fillStyle="rgba(0,0,0,0.45)",this.ctx.beginPath(),this.ctx.ellipse(0,17,22,7,0,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle="#1a1f26",this.ctx.beginPath(),this.ctx.roundRect(-18,-18,36,32,3),this.ctx.fill(),this.ctx.strokeStyle="#3a4555",this.ctx.lineWidth=1.5,this.ctx.stroke(),this.ctx.fillStyle="#0d1117",this.ctx.fillRect(-13,-14,26,16),this.ctx.strokeStyle="#2a3340",this.ctx.lineWidth=1,this.ctx.strokeRect(-13,-14,26,16);const w=y.alarmActive?"#1a0000":"#001a0a";this.ctx.fillStyle=w,this.ctx.fillRect(-11,-12,22,12),this.ctx.strokeStyle=y.alarmActive?"rgba(255,20,20,0.06)":"rgba(0,255,100,0.07)",this.ctx.lineWidth=.8;for(let N=-11;N<0;N+=2)this.ctx.beginPath(),this.ctx.moveTo(-11,N),this.ctx.lineTo(11,N),this.ctx.stroke();y.alarmActive?(this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=6,this.ctx.fillStyle="#ff3c3c"):y.status==="completed"?(this.ctx.shadowColor="#66fcf1",this.ctx.shadowBlur=6,this.ctx.fillStyle="#66fcf1"):y.status==="doing"?(this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=5,this.ctx.fillStyle="#ffd700"):(this.ctx.shadowColor="#1aff8a",this.ctx.shadowBlur=4,this.ctx.fillStyle="#1aff8a"),this.ctx.font="bold 5px monospace",this.ctx.textAlign="center";const L=y.alarmActive?"ALARM":y.status==="completed"?"DONE":y.status==="doing"?"ACTIVE":"READY";this.ctx.fillText(L,0,-5),this.ctx.shadowBlur=0,this.ctx.fillStyle="#141a22",this.ctx.fillRect(-13,4,26,8);const R=y.alarmActive?`rgba(255,40,40,${.6+.4*Math.abs(Math.sin(E/90))})`:y.status==="completed"?"#66fcf1":y.status==="doing"?"#ffd700":"#1aff8a";this.ctx.fillStyle=R,y.alarmActive&&(this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=8),this.ctx.beginPath(),this.ctx.arc(-8,8,2.5,0,Math.PI*2),this.ctx.fill(),this.ctx.shadowBlur=0;for(let N=-1;N<=5;N+=3)this.ctx.fillStyle="#2a3545",this.ctx.fillRect(N,6,2.5,4);if(y.alarmActive){const N=.6+.4*Math.abs(Math.sin(E/45));this.ctx.fillStyle="#1a0a0a",this.ctx.beginPath(),this.ctx.arc(0,-26,6,Math.PI,0),this.ctx.fill(),this.ctx.save(),this.ctx.translate(0,-26),this.ctx.rotate(S),this.ctx.fillStyle=`rgba(255, 60, 10, ${N})`,this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=14,this.ctx.beginPath(),this.ctx.arc(0,0,4.5,0,Math.PI*2),this.ctx.fill(),this.ctx.shadowBlur=0,this.ctx.fillStyle=`rgba(255, 220, 180, ${.8*N})`,this.ctx.beginPath(),this.ctx.arc(0,0,2,0,Math.PI*2),this.ctx.fill(),this.ctx.restore(),this.ctx.strokeStyle="#2a1a1a",this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.moveTo(0,-20),this.ctx.lineTo(0,-22),this.ctx.stroke()}else this.ctx.fillStyle="#1a2030",this.ctx.beginPath(),this.ctx.arc(0,-22,4,Math.PI,0),this.ctx.fill(),this.ctx.fillStyle="#2a3040",this.ctx.beginPath(),this.ctx.arc(0,-22,2,0,Math.PI*2),this.ctx.fill();this.ctx.strokeStyle="#0a0f14",this.ctx.lineWidth=1.2,this.ctx.beginPath(),this.ctx.moveTo(-18,5),this.ctx.quadraticCurveTo(-26,10,-24,16),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(18,3),this.ctx.quadraticCurveTo(25,8,22,16),this.ctx.stroke(),[[-16,-16],[16,-16],[-16,12],[16,12]].forEach(([N,I])=>{this.ctx.fillStyle="#2c3545",this.ctx.beginPath(),this.ctx.arc(N,I,1.5,0,Math.PI*2),this.ctx.fill()}),Math.hypot(this.localPlayer.x-y.x,this.localPlayer.y-y.y)<40&&this.localPlayer.health>0&&y.status==="pending"&&(this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=8,this.ctx.fillStyle="#ffd700",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("[F] INTERACT",0,-36),this.ctx.shadowBlur=0),this.ctx.restore()})),this.activeHitmarkers.forEach(y=>{const E=y.age/y.duration;this.ctx.save(),this.ctx.translate(y.x,y.y);const P=1-E;this.ctx.strokeStyle=y.isHeadshot?`rgba(255, 215, 0, ${P})`:`rgba(255, 255, 255, ${P})`,this.ctx.lineWidth=y.isHeadshot?2.5:1.5;const S=5+E*5,w=2;this.ctx.beginPath(),this.ctx.moveTo(-w,-w),this.ctx.lineTo(-S,-S),this.ctx.moveTo(w,-w),this.ctx.lineTo(S,-S),this.ctx.moveTo(-w,w),this.ctx.lineTo(-S,S),this.ctx.moveTo(w,w),this.ctx.lineTo(S,S),this.ctx.stroke(),this.ctx.restore()}),this.floatingNumbers.forEach(y=>{const E=y.age/y.duration;this.ctx.save(),this.ctx.translate(y.x,y.y);const P=1-E;let S=1;E<.25?S=1+E/.25*.4:S=1.4-(E-.25)/.75*.4,this.ctx.scale(S,S),this.ctx.font=y.isHeadshot?"bold 14px 'Orbitron', sans-serif":"bold 11px 'Orbitron', sans-serif",this.ctx.textAlign="center",this.ctx.strokeStyle=`rgba(0, 0, 0, ${P})`,this.ctx.lineWidth=3,this.ctx.strokeText(y.damage,0,0),this.ctx.fillStyle=y.isHeadshot?`rgba(255, 215, 0, ${P})`:`rgba(255, 255, 255, ${P})`,this.ctx.fillText(y.damage,0,0),this.ctx.restore()}),this.ctx.restore(),this.ctx.save();const b=this.ctx.createRadialGradient(this.canvas.width/2,this.canvas.height/2,this.canvas.width/3,this.canvas.width/2,this.canvas.height/2,this.canvas.width/1.1);b.addColorStop(0,"rgba(0, 0, 0, 0)");let _="rgba(0, 0, 0, 0.82)";if(this.localPlayer){const y=Date.now(),E=this.localPlayer.adrenalineEndTime&&y<this.localPlayer.adrenalineEndTime||this.localPlayer.adrenalineActive,P=this.localPlayer.overdriveEndTime&&y<this.localPlayer.overdriveEndTime||this.localPlayer.overdriveActive;this.matchMode==="sabotage"&&this.tasks&&this.tasks.some(w=>w.alarmActive)?_=`rgba(255, 30, 30, ${Math.sin(y/100)*.15+.55})`:P?_=`rgba(255, 180, 0, ${Math.sin(y/150)*.12+.48})`:E&&(_=`rgba(57, 219, 20, ${Math.sin(y/150)*.12+.48})`)}b.addColorStop(1,_),this.ctx.fillStyle=b,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(255, 255, 255, 0.015)";for(let y=0;y<this.canvas.height;y+=4)this.ctx.fillRect(0,y,this.canvas.width,1);if(this.ctx.restore(),this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.health<35&&!e){this.ctx.save();const y=Math.sin(Date.now()/150)*.2+.3,E=this.ctx.createRadialGradient(this.canvas.width/2,this.canvas.height/2,this.canvas.width/3,this.canvas.width/2,this.canvas.height/2,this.canvas.width/1.1);E.addColorStop(0,"rgba(255, 0, 0, 0)"),E.addColorStop(1,`rgba(255, 0, 0, ${y})`),this.ctx.fillStyle=E,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.restore()}let x=0;if(e){const y=e.players.find(E=>E.isLocal);y&&(x=y.flashAlpha||0)}else this.localPlayer&&(x=this.localPlayer.flashAlpha||0);if(x>0&&(this.ctx.save(),this.ctx.fillStyle=`rgba(255, 255, 255, ${x})`,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.restore()),!e){const y=this.localPlayer&&this.localPlayer.health>0?this.map.checkZone(this.localPlayer.x,this.localPlayer.y):null;if(y)try{this.ctx.save();const E=y.type==="healing",P=Math.sin(Date.now()/400)*.25+.75,S=E?`rgba(80,255,130,${P})`:`rgba(255,100,60,${P})`,w=E?`rgba(40,255,110,${P*.18})`:`rgba(255,60,20,${P*.18})`,L=E?`rgba(80,255,130,${P*.8})`:`rgba(255,100,60,${P*.8})`,R=260,C=38,F=this.canvas.width/2-R/2,N=this.canvas.height-130;this.ctx.fillStyle=w,this.ctx.fillRect(F,N,R,C),this.ctx.strokeStyle=L,this.ctx.lineWidth=1.5,this.ctx.strokeRect(F,N,R,C),this.ctx.textAlign="center",this.ctx.font="bold 12px Orbitron",this.ctx.fillStyle=S;const I=E?"+":"!";this.ctx.fillText(`${I} ${y.label}`,this.canvas.width/2,N+15),this.ctx.font="9px Orbitron",this.ctx.fillStyle=E?"rgba(60,255,110,0.7)":"rgba(255,80,40,0.7)";const O=E?`+${(y.healRate*60).toFixed(0)} HP/s REGENERATION`:`DAMAGE x${y.multiplier} -- DANGER`;this.ctx.fillText(O,this.canvas.width/2,N+29),this.ctx.restore()}catch{}}if(this.matchMode==="sabotage"&&this.gameState==="playing"){this.ctx.save(),this.ctx.font="bold 11px 'Orbitron', sans-serif",this.ctx.textAlign="left";const y=20,E=120;this.ctx.fillStyle="#ff3c3c",this.ctx.fillText("MISSION TASKS:",y,E),this.tasks.forEach((P,S)=>{const w=E+20+S*18,L=P.status==="completed";this.ctx.fillStyle=L?"#39db14":"#fff",this.ctx.font=L?"10px 'Orbitron', sans-serif":"bold 10px 'Orbitron', sans-serif",this.ctx.strokeStyle=L?"#39db14":"#888",this.ctx.lineWidth=1,this.ctx.strokeRect(y,w-8,8,8),L&&(this.ctx.fillStyle="#39db14",this.ctx.fillRect(y+2,w-6,4,4)),this.ctx.fillText(P.name,y+15,w)}),this.ctx.restore()}if(this.matchMode==="sabotage"&&this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.inVent&&this.currentVent&&(this.ctx.save(),this.ctx.fillStyle="rgba(2, 4, 8, 0.85)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(102, 252, 241, 0.08)",this.ctx.strokeStyle="#66fcf1",this.ctx.lineWidth=2,this.ctx.fillRect(this.canvas.width/2-200,this.canvas.height/2-150,400,300),this.ctx.strokeRect(this.canvas.width/2-200,this.canvas.height/2-150,400,300),this.ctx.font="bold 16px 'Orbitron', sans-serif",this.ctx.fillStyle="#66fcf1",this.ctx.textAlign="center",this.ctx.fillText("VENT NETWORK SYSTEM",this.canvas.width/2,this.canvas.height/2-110),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#8892b0",this.ctx.fillText("Select destination vent code to travel:",this.canvas.width/2,this.canvas.height/2-80),this.vents.forEach((y,E)=>{const P=E+1,S=y.id===this.currentVent.id;this.ctx.fillStyle=S?"#ffd700":"#fff",this.ctx.fillText(`[${P}] ${y.name} ${S?"(CURRENT LOCATION)":""}`,this.canvas.width/2,this.canvas.height/2-40+E*30)}),this.ctx.font="bold 11px 'Orbitron', sans-serif",this.ctx.fillStyle="#ff3c3c",this.ctx.fillText("PRESS [SPACEBAR] TO EXIT VENT",this.canvas.width/2,this.canvas.height/2+120),this.ctx.restore()),this.activeTask)){this.ctx.save(),this.ctx.fillStyle="rgba(2, 4, 8, 0.85)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const y=this.canvas.width/2-200,E=this.canvas.height/2-140,P=400,S=280;this.ctx.fillStyle="#11151c",this.ctx.strokeStyle="#ffd700",this.ctx.lineWidth=3,this.ctx.fillRect(y,E,P,S),this.ctx.strokeRect(y,E,P,S),this.ctx.font="bold 15px 'Orbitron', sans-serif",this.ctx.fillStyle="#ffd700",this.ctx.textAlign="center",this.ctx.fillText(this.activeTask.name.toUpperCase(),this.canvas.width/2,E+35),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#888",this.ctx.fillText("TASK TYPE: GRID CALIBRATION",this.canvas.width/2,E+60);const w=this.canvas.width/2-120,L=E+100,R=240,C=40;this.ctx.fillStyle="#1a1d24",this.ctx.fillRect(w,L,R,C),this.ctx.strokeStyle="#333",this.ctx.strokeRect(w,L,R,C),this.ctx.fillStyle="rgba(57, 219, 20, 0.35)",this.ctx.fillRect(this.canvas.width/2-24,L,48,C),this.ctx.strokeStyle="#39db14",this.ctx.strokeRect(this.canvas.width/2-24,L,48,C);const F=Math.abs(Math.sin(this.sweepAngle)),N=w+F*R;this.ctx.strokeStyle="#fff",this.ctx.lineWidth=3,this.ctx.beginPath(),this.ctx.moveTo(N,L-5),this.ctx.lineTo(N,L+C+5),this.ctx.stroke();const I=this.canvas.width/2-120,O=E+175,B=240,K=20;this.ctx.fillStyle="#1a1d24",this.ctx.fillRect(I,O,B,K),this.ctx.fillStyle="#ffd700",this.ctx.fillRect(I,O,this.sweepProgress/100*B,K),this.ctx.strokeStyle="#ffd700",this.ctx.strokeRect(I,O,B,K),this.ctx.font="bold 10px 'Orbitron', sans-serif",this.ctx.fillStyle="#fff",this.ctx.fillText(`CALIBRATION PROGRESS: ${this.sweepProgress}%`,this.canvas.width/2,O+14),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#ffaa00",this.ctx.fillText("PRESS [SPACEBAR] WHEN LINE IS IN GREEN ZONE",this.canvas.width/2,E+230),this.ctx.fillStyle="#888",this.ctx.fillText("PRESS [ESC] OR [F] TO ABANDON TASK",this.canvas.width/2,E+255),this.ctx.restore()}if(!e&&this.gameState==="playing"&&(this.matchMode==="sabotage"||performance.now()-this.roundStartTime>2e4)){this.ctx.save();const y=150,P=this.canvas.width-y-20,S=100;this.ctx.fillStyle="rgba(6, 7, 10, 0.85)",this.ctx.fillRect(P,S,y,y),this.ctx.strokeStyle="hsla(43, 74%, 49%, 0.6)",this.ctx.lineWidth=2,this.ctx.strokeRect(P,S,y,y),this.ctx.fillStyle="hsla(43, 74%, 49%, 0.9)",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("TACTICAL MINIMAP",P+y/2,S-6);const w=y/this.map.width;if(this.ctx.fillStyle="rgba(255, 255, 255, 0.12)",this.map.walls.forEach(R=>{this.ctx.fillRect(P+R.x*w,S+R.y*w,R.w*w,R.h*w)}),this.localPlayer&&this.localPlayer.health>0){const R=P+this.localPlayer.x*w,C=S+this.localPlayer.y*w;this.ctx.fillStyle="#00ffff",this.ctx.beginPath(),this.ctx.arc(R,C,3.5,0,Math.PI*2),this.ctx.fill(),this.ctx.strokeStyle="rgba(0, 255, 255, 0.8)",this.ctx.lineWidth=1,this.ctx.beginPath(),this.ctx.moveTo(R,C),this.ctx.lineTo(R+Math.cos(this.localPlayer.angle)*7,C+Math.sin(this.localPlayer.angle)*7),this.ctx.stroke()}this.matchMode==="sabotage"&&this.tasks.forEach(R=>{if(R.status==="completed")return;const C=P+R.x*w,F=S+R.y*w,N=Math.abs(Math.sin(performance.now()/250));this.ctx.fillStyle=`rgba(255, 215, 0, ${.4+.6*N})`,this.ctx.beginPath(),this.ctx.arc(C,F,3.5+N*2,0,Math.PI*2),this.ctx.fill()});const L=Math.abs(Math.sin(performance.now()/200));this.players.forEach(R=>{if(R.health>0&&!R.isLocal){const C=P+R.x*w,F=S+R.y*w;if(R.isTeammate)this.ctx.fillStyle="#39ff14",this.ctx.beginPath(),this.ctx.arc(C,F,3,0,Math.PI*2),this.ctx.fill();else{if(this.matchMode==="sabotage")return;this.ctx.fillStyle=`rgba(255, 60, 60, ${.4+.6*L})`,this.ctx.beginPath(),this.ctx.arc(C,F,4+L*2.5,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle="#ff3c3c",this.ctx.beginPath(),this.ctx.arc(C,F,2,0,Math.PI*2),this.ctx.fill()}}}),this.ctx.restore()}if(e){this.ctx.save(),this.ctx.strokeStyle="rgba(255, 60, 60, 0.6)",this.ctx.lineWidth=12,this.ctx.strokeRect(0,0,this.canvas.width,this.canvas.height);const y=Math.floor(Date.now()/500)%2===0;this.ctx.fillStyle=y?"#ff3c3c":"rgba(255, 60, 60, 0.2)",this.ctx.beginPath(),this.ctx.arc(40,40,8,0,Math.PI*2),this.ctx.fill(),this.ctx.font="900 16px Orbitron",this.ctx.fillStyle="#ffffff",this.ctx.textAlign="left",this.ctx.fillText("KILLCAM REPLAY",60,46);const E=this.replayIndex/this.replayFrames.length,P=this.canvas.width-80;this.ctx.fillStyle="rgba(255, 255, 255, 0.15)",this.ctx.fillRect(40,this.canvas.height-40,P,6),this.ctx.fillStyle="#ff3c3c",this.ctx.fillRect(40,this.canvas.height-40,P*E,6),this.ctx.restore()}if(!e&&this.combatBanner){this.ctx.save(),this.ctx.textAlign="center",this.ctx.textBaseline="middle";const y=this.combatBanner.timer,E=this.combatBanner.text;let P=1;y<.5&&(P=y/.5);const S=1.5+Math.max(0,y-2.5)*2+.05*Math.sin(Date.now()/100);this.ctx.translate(this.canvas.width/2,this.canvas.height/2-180),this.ctx.scale(S,S),this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=20,this.ctx.font="italic 900 24px 'Orbitron', sans-serif";const w=this.ctx.createLinearGradient(-150,0,150,0);w.addColorStop(0,`rgba(255, 60, 60, ${P})`),w.addColorStop(.5,`rgba(255, 220, 0, ${P})`),w.addColorStop(1,`rgba(255, 60, 60, ${P})`),this.ctx.fillStyle=w,this.ctx.fillText(E,0,0),this.ctx.shadowBlur=0,this.ctx.strokeStyle=`rgba(255, 215, 0, ${P*.4})`,this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.moveTo(-100,18),this.ctx.lineTo(100,18),this.ctx.moveTo(-100,-18),this.ctx.lineTo(100,-18),this.ctx.stroke(),this.ctx.restore()}if(this.localPlayer&&this.localPlayer.weaponLevelUpAlert>0&&!e){this.ctx.save(),this.ctx.textAlign="center",this.ctx.textBaseline="middle";const y=this.localPlayer.weaponLevelUpAlert,E=Math.min(1,y),P=1+.15*Math.sin(Date.now()/150);this.ctx.translate(this.canvas.width/2,this.canvas.height/2-80),this.ctx.scale(P,P),this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=15,this.ctx.font="bold 28px 'Orbitron', sans-serif",this.ctx.fillStyle=`rgba(255, 215, 0, ${E})`,this.ctx.fillText("WEAPON UPGRADED",0,0),this.ctx.shadowBlur=0,this.ctx.font="bold 16px 'Orbitron', sans-serif",this.ctx.fillStyle=`rgba(255, 255, 255, ${E})`,this.ctx.fillText(`LVL ${this.localPlayer.weaponLevel}`,0,35),this.ctx.restore()}}isPointInPolygon(e,t){let i=!1;for(let s=0,a=t.length-1;s<t.length;a=s++){const r=t[s].x,o=t[s].y,l=t[a].x,c=t[a].y;o>e.y!=c>e.y&&e.x<(l-r)*(e.y-o)/(c-o)+r&&(i=!i)}return i}handleServerRoundOver(e){if(this.gameState!=="playing")return;if(this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchMode==="sabotage")try{this.sound.stopBearMusic()}catch{}let t=document.getElementById("hud-status");const i=this.localPlayer.team;e.winningTeam===i?t&&(t.innerText="ROUND WON",t.style.color="#39ff14"):t&&(t.innerText="ROUND LOST",t.style.color="#ff3c3c"),i===1?(this.scoreSelf=e.score1,this.scoreOpponent=e.score2):(this.scoreSelf=e.score2,this.scoreOpponent=e.score1),this.updateScoreboardHUD();const s=e.winningTeam===1?2:1;this.players.forEach(a=>{a.team===s&&(a.health=0)}),this.roundNumber=e.roundNumber,this.startReplay(()=>this.startRoundCycle())}handleServerMatchOver(e){if(this.gameState!=="playing"&&this.gameState!=="round-over")return;this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.localPlayer.team===1?(this.scoreSelf=e.score1,this.scoreOpponent=e.score2):(this.scoreSelf=e.score2,this.scoreOpponent=e.score1),this.updateScoreboardHUD();const i=window.MatchStats.shotsFired||1,s=window.MatchStats.hitsRegistered/i*100;window.MatchStats.accuracy=s,window.MatchStats.roundsWon=this.scoreSelf,window.MatchStats.winnerId=e.winnerId;const a=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent:this.scoreSelf>=3,r=this.localPlayer.rank?this.localPlayer.rank.label:"";let o=!1,l=0;this.isRanked&&(o=this.localPlayer.applyRankDelta(a?fa:ua),l=a?fa:ua),window.MatchStats.isWin=a,window.MatchStats.newRP=this.localPlayer.rp,window.MatchStats.newRank=this.localPlayer.rank,window.MatchStats.rpDelta=l,window.MatchStats.rankChanged=o,window.MatchStats.oldRankLabel=r;const h=(this.matchMode==="sabotage"?e.score1>e.score2?1:2:e.score1>=3?1:2)===1?2:1;this.players.forEach(d=>{d.team===h&&(d.health=0)});const f=()=>{this.gameState="match-over",this.active=!1,a?this.sound.playMatchWin():this.sound.playMatchLose(),this.onMatchEnd&&this.onMatchEnd(window.MatchStats)};this.startReplay(f)}spawnItemAt(e,t,i,s=null){const a=s||`item_${i}_${Date.now()}_${Math.round(Math.random()*1e3)}`;return this.map.items.some(r=>r.id===a)||this.map.items.push({id:a,x:e,y:t,type:i,active:!0}),a}generateRandomCode(){const e=["w","a","s","d","q","e","r","f"];let t="";for(let i=0;i<4;i++)t+=e[Math.floor(Math.random()*e.length)];return t}startHackingMinigame(e){const t=this.generateRandomCode();this.activeMinigame={terminal:e,code:t,input:"",timer:4},this.keys.e=!1;const i=document.getElementById("hacking-minigame-overlay");i&&(i.style.display="flex");const s=document.getElementById("hud-interaction-prompt");s&&(s.style.display="none"),this.renderMinigameKeys()}renderMinigameKeys(){const e=document.getElementById("minigame-keys-container");if(!e||!this.activeMinigame)return;e.innerHTML="";const t=this.activeMinigame.code,i=this.activeMinigame.input;for(let s=0;s<t.length;s++){const a=t[s],r=s<i.length,o=document.createElement("div");o.style.width="35px",o.style.height="35px",o.style.lineHeight="35px",o.style.borderRadius="4px",o.style.fontFamily="var(--font-title)",o.style.fontWeight="bold",o.style.fontSize="14px",o.style.textTransform="uppercase",o.style.border=r?"1px solid #39ff14":"1px solid rgba(255,255,255,0.15)",o.style.background=r?"rgba(57, 255, 20, 0.12)":"rgba(0,0,0,0.4)",o.style.color=r?"#39ff14":"rgba(255,255,255,0.7)",o.style.boxShadow=r?"0 0 6px rgba(57, 255, 20, 0.25)":"none",o.innerText=a,e.appendChild(o)}}handleMinigameKeyPress(e){if(!this.activeMinigame)return;const t=this.activeMinigame.code,i=this.activeMinigame.input,s=t[i.length];if(e===s){this.activeMinigame.input+=e,this.renderMinigameKeys();try{this.sound.playMetallicClick(0,2500,.04,.2)}catch{}this.activeMinigame.input===t&&this.successHackingMinigame()}else{this.activeMinigame.input="",this.renderMinigameKeys();try{this.sound.playMetallicClick(0,300,.15,.3)}catch{}}}cancelHackingMinigame(){this.activeMinigame=null;const e=document.getElementById("hacking-minigame-overlay");e&&(e.style.display="none")}successHackingMinigame(){if(!this.activeMinigame)return;const e=this.activeMinigame.terminal;e.hacked=!0;const t=this.spawnItemAt(e.x-22,e.y,"health"),i=this.spawnItemAt(e.x+22,e.y,"adrenaline");this.localPlayer.showTextNotification("HACK SUCCESSFUL! LOOT SPAWNED","#39ff14"),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:t,x:e.x-22,y:e.y,type:"health"}),this.localPlayer.networkDroppedItems.push({id:i,x:e.x+22,y:e.y,type:"adrenaline"});try{this.sound.playMetallicClick(0,3500,.25,.45)}catch{}this.cancelHackingMinigame()}failHackingMinigame(){this.localPlayer.showTextNotification("HACK FAILED!","#ff3c3c");try{this.sound.playMetallicClick(0,200,.3,.45)}catch{}this.cancelHackingMinigame()}}const Se={getItem(n){try{return localStorage.getItem(n)}catch(e){return console.warn("localStorage.getItem failed:",e),null}},setItem(n,e){try{localStorage.setItem(n,e)}catch(t){console.warn("localStorage.setItem failed:",t)}},removeItem(n){try{localStorage.removeItem(n)}catch(e){console.warn("localStorage.removeItem failed:",e)}}},ul="tacticstrike_account_session",pl="tacticstrike_admin_session";let oi={token:Se.getItem(ul),user:null},rs=Se.getItem(pl),ml=null;function gl(){return window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?window.location.port==="3000"?window.location.origin:"http://localhost:3000":window.location.hostname.endsWith("onrender.com")?window.location.origin:"https://topdownshooter.onrender.com"}async function qi(n,e={}){const t={"Content-Type":"application/json",...e.headers||{}};oi.token&&(t.Authorization=`Bearer ${oi.token}`);const i=await fetch(`${gl()}${n}`,{...e,headers:t}),s=i.status===204?null:await i.json().catch(()=>null);if(!i.ok){const a=new Error((s==null?void 0:s.message)||"The account server could not complete this request.");throw a.code=s==null?void 0:s.error,a.status=i.status,a}return s}async function ds(n,e={}){const t={"Content-Type":"application/json",...e.headers||{}};rs&&(t.Authorization=`Bearer ${rs}`);const i=await fetch(`${gl()}${n}`,{...e,headers:t}),s=i.status===204?null:await i.json().catch(()=>null);if(!i.ok){const a=new Error((s==null?void 0:s.message)||"The admin server could not complete this request.");throw a.code=s==null?void 0:s.error,a.status=i.status,a}return s}const mi={menu:document.getElementById("menu-screen"),lobby:document.getElementById("lobby-screen"),game:document.getElementById("game-screen"),matchmaking:document.getElementById("matchmaking-screen")},et={rankedRealistic:document.getElementById("btn-ranked-realistic"),rankedCompetitive:document.getElementById("btn-ranked-competitive"),createRoom:document.getElementById("btn-create-room"),joinRoom:document.getElementById("btn-join-room"),practiceBot:document.getElementById("btn-practice-bot"),openSettings:document.getElementById("btn-open-settings"),closeSettings:document.getElementById("btn-close-settings"),leaveLobby:document.getElementById("btn-leave-lobby"),readyToggle:document.getElementById("btn-ready-toggle"),copyCode:document.getElementById("btn-copy-code"),returnLobby:document.getElementById("btn-return-lobby"),btnAmongUs:document.getElementById("btn-among-us-mode")},Fe={name:document.getElementById("player-name-input"),roomCode:document.getElementById("room-code-input"),chat:document.getElementById("chat-input"),qpMapSelect:document.getElementById("qp-map-select"),lobbyMapSelect:document.getElementById("lobby-map-select"),lobbyModeSelect:document.getElementById("lobby-mode-select"),lobbyStyleSelect:document.getElementById("lobby-style-select")},at={roomCode:document.getElementById("room-code-display"),weaponStats:document.getElementById("weapon-stats-display"),playersList:document.getElementById("lobby-players-list"),chatMessages:document.getElementById("chat-messages"),chatDrawer:document.getElementById("chat-drawer")},pt={modal:document.getElementById("settings-modal"),volume:document.getElementById("setting-volume"),volumeVal:document.getElementById("volume-val"),blood:document.getElementById("setting-blood"),shadows:document.getElementById("setting-shadows"),laser:document.getElementById("setting-laser")},fn=document.getElementById("game-over-modal"),Qa={pistol:{name:"Tactical 9mm",damage:22,fireRate:35,accuracy:90,magSize:12,range:400,reloadTime:1200,speedMultiplier:1,type:"Semi-Auto",damagePct:33,fireRatePct:45},rifle:{name:"Assault Rifle (M4A1)",damage:28,fireRate:75,accuracy:70,magSize:30,range:600,reloadTime:2200,speedMultiplier:1,type:"Automatic",damagePct:65,fireRatePct:85},shotgun:{name:"Shotgun (Remington 870)",damage:15,fireRate:20,accuracy:40,magSize:6,range:250,reloadTime:3e3,speedMultiplier:1,type:"Pump-Action",damagePct:80,fireRatePct:20,pellets:8},sniper:{name:"Sniper Rifle (AWM)",damage:95,fireRate:10,accuracy:98,magSize:5,range:1e3,reloadTime:2800,speedMultiplier:1,type:"Bolt-Action",damagePct:100,fireRatePct:10},smg:{name:"SMG (MP5)",damage:18,fireRate:85,accuracy:82,magSize:30,range:350,reloadTime:1500,speedMultiplier:1,type:"Automatic",damagePct:30,fireRatePct:95},lmg:{name:"LMG (M249)",damage:25,fireRate:80,accuracy:75,magSize:100,range:550,reloadTime:4500,speedMultiplier:1,type:"Automatic",damagePct:55,fireRatePct:90},dmr:{name:"DMR (M14 EBR)",damage:45,fireRate:30,accuracy:94,magSize:20,range:800,reloadTime:2400,speedMultiplier:1,type:"Semi-Auto",damagePct:75,fireRatePct:35},vector:{name:"Vector SMG",damage:14,fireRate:95,accuracy:85,magSize:33,range:320,reloadTime:1100,speedMultiplier:1,type:"Automatic",damagePct:25,fireRatePct:98},famas:{name:"FAMAS Burst Carbine",damage:20,fireRate:55,accuracy:91,magSize:25,range:550,reloadTime:1800,speedMultiplier:1,type:"Burst-Fire",damagePct:45,fireRatePct:60},plasma:{name:"Plasma Rifle PL-45",damage:32,fireRate:65,accuracy:90,magSize:20,range:600,reloadTime:2e3,speedMultiplier:1,type:"Automatic",damagePct:60,fireRatePct:70},railgun:{name:"Railgun RG-X",damage:85,fireRate:8,accuracy:99,magSize:5,range:1200,reloadTime:3500,speedMultiplier:.95,type:"Single-Shot",damagePct:95,fireRatePct:8}},Ln={dmr:{rp:1e3,rank:"VETERAN",price:2200},sniper:{rp:1e3,rank:"VETERAN",price:2500},lmg:{rp:4e3,rank:"ELITE",price:4500},vector:{rp:1e3,rank:"VETERAN",price:2100},famas:{rp:1e3,rank:"VETERAN",price:2300},plasma:{rp:4e3,rank:"ELITE",price:4e3},railgun:{rp:4e3,rank:"ELITE",price:5e3}},Ty={dmr:{code:"M14",role:"PRECISION",tier:"ADVANCED",description:"A controlled semi-auto platform built for disciplined mid-to-long range fire."},sniper:{code:"AWM",role:"LONGSHOT",tier:"ADVANCED",description:"A high-impact bolt-action system engineered to end an engagement in one shot."},lmg:{code:"M249",role:"SUPPORT",tier:"ELITE",description:"Sustained suppressive fire with a deep belt and uncompromising lane control."},vector:{code:"VEC",role:"BREACH",tier:"ADVANCED",description:"Extreme close-range fire rate for operatives who fight inside the objective."},famas:{code:"FAM",role:"BURST",tier:"ADVANCED",description:"A precise burst carbine tuned for fast target acquisition and controlled recoil."},plasma:{code:"PL45",role:"PROTOTYPE",tier:"ELITE",description:"Experimental energy rifle with exceptional accuracy and balanced stopping power."},railgun:{code:"RG-X",role:"EXOTIC",tier:"ELITE",description:"Blacksite electromagnetic technology delivering devastating single-shot force."}},Ha={pistol:"Pistol",rifle:"Rifle",shotgun:"Shotgun",sniper:"Sniper",smg:"SMG",lmg:"LMG",dmr:"DMR",vector:"Vector",famas:"FAMAS",plasma:"Plasma",railgun:"Railgun"};function wy(n){const t=`; ${document.cookie}`.split(`; ${n}=`);return t.length===2?t.pop().split(";").shift():null}function Ay(n,e,t=365){const i=new Date;i.setTime(i.getTime()+t*24*60*60*1e3),document.cookie=`${n}=${e};expires=${i.toUTCString()};path=/;SameSite=Strict`}function yl(){let n=Se.getItem("tacticstrike_uuid");return n||(n=wy("tacticstrike_uuid")),n||(n="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){const t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})),Se.setItem("tacticstrike_uuid",n),Ay("tacticstrike_uuid",n,365),n}function xs(){try{const n=window.AudioContext||window.webkitAudioContext;if(!n)return;const e=new n,t=e.createOscillator(),i=e.createGain();t.type="sawtooth",t.frequency.setValueAtTime(120,e.currentTime),i.gain.setValueAtTime(.12,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.15),t.connect(i),i.connect(e.destination),t.start(),t.stop(e.currentTime+.15)}catch{}}function xl(){const n=parseInt(Se.getItem("tacticstrike_rp")||"0"),e=document.querySelectorAll("#menu-weapon-selector .weapon-btn");e.forEach(s=>{const a=s.dataset.weapon,r=Ln[a],o=Wr(a);if(r&&!o)s.classList.add("locked"),s.innerHTML=`🔒 ${Ha[a]} <span style="font-size:7px; display:block; color:#ff3c3c; margin-top:2.5px; font-family:var(--font-title); font-weight:bold;">${r.rank}</span>`;else{s.classList.remove("locked");let l=Ha[a]||a;try{JSON.parse(Se.getItem("tacticstrike_purchased_weapons")||"[]").includes(a)&&n<r.rp&&(l=`🛍️ ${l}`)}catch{}s.innerHTML=l}});const t=document.querySelectorAll(".weapon-option");t.forEach(s=>{const a=s.dataset.weapon,r=Ln[a],o=Wr(a);let l=s.querySelector(".lock-badge");r&&!o?(s.classList.add("locked"),l||(l=document.createElement("span"),l.className="lock-badge",s.appendChild(l)),l.innerHTML=`🔒 <span style="font-size:8px; font-weight:bold; color:#ff3c3c; margin-left:2px;">${r.rank}</span>`,l.style.display="inline-flex"):(s.classList.remove("locked"),l&&(l.style.display="none"))}),Ln[mt]&&!Wr(mt)&&(mt="pistol",Se.setItem("tacticstrike_player_weapon","pistol"),e.forEach(s=>{s.dataset.weapon==="pistol"?s.classList.add("active"):s.classList.remove("active")}),t.forEach(s=>{s.dataset.weapon==="pistol"?s.classList.add("active"):s.classList.remove("active")}),us("pistol"))}let ce=null,be=null,It=null,Ke="Operative",mt="pistol",ti="cyan",$t="1v1",Is=!1,Ia=[],xi="menu",gi=Se.getItem("tacticstrike_qp_style")||"realistic",is=Se.getItem("tacticstrike_selected_map")||"manor";function fs(){try{return JSON.parse(localStorage.getItem("tacticstrike_career")||'{"wins":0,"losses":0}')}catch{return{wins:0,losses:0}}}function qh(n){try{localStorage.setItem("tacticstrike_career",JSON.stringify(n))}catch{}}function _l(){const n=fs(),e=n.wins+n.losses,t=e>0?Math.round(n.wins/e*100):null,i=document.getElementById("stat-wins"),s=document.getElementById("stat-losses"),a=document.getElementById("stat-winpct");i&&(i.innerText=n.wins),s&&(s.innerText=n.losses),a&&(a.innerText=t!==null?`${t}%`:"—")}function er(n){const e=fs();n?e.wins++:e.losses++,qh(e),_l()}function Ry(n,e){if(n)try{const t=localStorage.getItem("tacticstrike_h2h")||"{}",i=JSON.parse(t);i[n]||(i[n]={wins:0,losses:0}),e?i[n].wins++:i[n].losses++,localStorage.setItem("tacticstrike_h2h",JSON.stringify(i))}catch(t){console.warn("Failed to record H2H result:",t)}}function Py(){const n=document.getElementById("h2h-history-container");if(!n)return;let e={};try{e=JSON.parse(localStorage.getItem("tacticstrike_h2h")||"{}")}catch{e={}}const t=Object.entries(e);if(t.length===0){n.innerHTML='<div style="color: var(--text-muted); font-size: 10px; text-align: center; padding: 10px 0; letter-spacing: 0.5px;">No head-to-head records found. Play a match to start tracking!</div>';return}t.sort((s,a)=>a[1].wins+a[1].losses-(s[1].wins+s[1].losses));let i="";t.forEach(([s,a])=>{const r=a.wins+a.losses,o=r>0?Math.round(a.wins/r*100):0;i+=`
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 4px; font-family: var(--font-title);">
        <span style="color: #fff; font-size: 11px; font-weight: bold; letter-spacing: 0.5px;">${Dn(s).toUpperCase()}</span>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 10px; color: var(--text-muted); letter-spacing: 0.5px;">RECORD: <strong style="color: #39db14;">${a.wins}W</strong> - <strong style="color: #ff3c3c;">${a.losses}L</strong></span>
          <span style="font-size: 9px; background: rgba(102, 252, 241, 0.1); border: 1px solid rgba(102, 252, 241, 0.3); color: #66fcf1; padding: 2px 5px; border-radius: 3px; font-weight: bold; letter-spacing: 0.5px;">${o}% WR</span>
        </div>
      </div>
    `}),n.innerHTML=i}const yt=new Audio("/Midnight_Deployment.mp3");yt.loop=!0;const Tt=new Audio("/Before_The_Starting_Bell.mp3");Tt.loop=!0;const St=new Audio("/Into_Darkness.mp3");St.loop=!0;let ma=!1,Ut=!1;const kt=new Audio("/Deployment_Sequence.mp3");kt.loop=!0;kt.volume=.15;function Yh(){if(!Ut)try{yt.pause(),yt.currentTime=0,Tt.pause(),Tt.currentTime=0,St.pause(),St.currentTime=0,kt.volume=.15,kt.loop=!0,kt.play().catch(()=>{})}catch{}}function Vt(){try{const n=window.AudioContext||window.webkitAudioContext;if(!n)return;const e=new n,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.setValueAtTime(1200,e.currentTime),t.frequency.exponentialRampToValueAtTime(600,e.currentTime+.08),i.gain.setValueAtTime(.1,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.08),t.connect(i),i.connect(e.destination),t.start(),t.stop(e.currentTime+.08)}catch{}}let Vi=null;function _i(n="tap"){if(!We.sfxMuted)try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;Vi||(Vi=new e),Vi.state==="suspended"&&Vi.resume().catch(()=>{});const t={open:{from:390,to:520,duration:.14},close:{from:510,to:370,duration:.12},confirm:{from:560,to:760,duration:.16},tap:{from:440,to:500,duration:.1}},i=t[n]||t.tap,s=Vi.currentTime,a=Vi.createOscillator(),r=Vi.createBiquadFilter(),o=Vi.createGain(),l=.035*Math.max(0,Math.min(1,We.volume));a.type="sine",a.frequency.setValueAtTime(i.from,s),a.frequency.exponentialRampToValueAtTime(i.to,s+i.duration),r.type="lowpass",r.frequency.setValueAtTime(1800,s),r.Q.setValueAtTime(.45,s),o.gain.setValueAtTime(1e-4,s),o.gain.exponentialRampToValueAtTime(Math.max(1e-4,l),s+.012),o.gain.exponentialRampToValueAtTime(1e-4,s+i.duration),a.connect(r),r.connect(o),o.connect(Vi.destination),a.start(s),a.stop(s+i.duration+.02)}catch{}}let Wa=null;const Cy=[{key:"knife",text:"Equip your Melee Knife (Press 2) to move 15% faster."},{key:"flashbang",text:"Throw a Flash Grenade (Press 3) to blind enemies in line-of-sight."},{key:"dash",text:"Press Space to dash forward in the direction you are facing (10s CD)."},{key:"flashlight",text:"Toggle your Flashlight (Press F) to spot enemies in dark rooms."}];function Xo(){const n=document.getElementById("gameplay-tips-panel");if(!n)return;const e=Cy.filter(s=>localStorage.getItem(`tacticstrike_hide_tip_${s.key}`)!=="true");if(e.length===0){n.style.display="none",Wa=null;return}const t=e[Math.floor(Math.random()*e.length)];Wa=t.key;const i=document.getElementById("tip-text");i&&(i.innerText=t.text),n.style.display="flex"}function Iy(){const n=document.getElementById("btn-dismiss-tip");n&&n.addEventListener("click",()=>{if(Wa){localStorage.setItem(`tacticstrike_hide_tip_${Wa}`,"true");const e=document.getElementById("gameplay-tips-panel");e&&(e.style.display="none"),setTimeout(Xo,1e3)}})}window.stopAllMusic=function(){try{yt.pause(),yt.currentTime=0,Tt.pause(),Tt.currentTime=0,kt.pause(),kt.currentTime=0,St.pause(),St.currentTime=0,be&&be.sound&&be.sound.stopBearMusic()}catch{}};function $h(){if(!Ut)try{yt.pause(),yt.currentTime=0,kt.pause(),kt.currentTime=0,St.pause(),St.currentTime=0,Tt.currentTime=0,Tt.play().catch(()=>{})}catch{}}function vl(){if(!Ut)try{Tt.pause(),Tt.currentTime=0,kt.pause(),kt.currentTime=0,St.pause(),St.currentTime=0,yt.currentTime=0,yt.play().catch(()=>{})}catch{}}function Kh(){try{if(Ut)return;if(St.pause(),St.currentTime=0,be&&be.matchMode==="sabotage"||xi==="practice"&&$t==="sabotage"){yt.pause(),yt.currentTime=0,Tt.pause(),Tt.currentTime=0,kt.pause(),kt.currentTime=0,be&&be.gameState==="playing"&&be.sound&&be.sound.playBearMusic();return}xi==="casual"?(yt.pause(),yt.currentTime=0,Tt.pause(),Tt.currentTime=0,kt.volume=.04,kt.loop=!0,kt.play().catch(()=>{})):(kt.pause(),kt.currentTime=0,Tt.pause(),Tt.currentTime=0,yt.volume=.04,yt.play().catch(()=>{}))}catch{}}function Sl(n){const e=document.getElementById("ranked-video-overlay"),t=document.getElementById("ranked-video");if(!e||!t){n();return}t.muted=!!We.sfxMuted,t.volume=typeof We.volume=="number"?We.volume:.5,t.currentTime=0,e.style.display="flex",e.offsetHeight,e.style.opacity="1",window.stopAllMusic(),t.play().then(()=>{const i=setTimeout(()=>{e.style.opacity="0"},4400),s=setTimeout(()=>{t.pause(),e.style.display="none",n()},5e3),a=()=>{clearTimeout(i),clearTimeout(s),e.style.opacity="0",setTimeout(()=>{e.style.display="none",n()},500),t.removeEventListener("ended",a)};t.addEventListener("ended",a)}).catch(i=>{console.warn("Ranked video playback failed or blocked by browser:",i),e.style.opacity="0",e.style.display="none",n()})}const ga=[{id:"recruit",label:"RECRUIT",minRP:0,maxRP:999,color:"#8a9bb5",icon:"▪"},{id:"veteran",label:"VETERAN",minRP:1e3,maxRP:3999,color:"#e8c84a",icon:"◆"},{id:"elite",label:"ELITE",minRP:4e3,maxRP:1/0,color:"#ff6ef7",icon:"★"}];function Ml(n){for(let e=ga.length-1;e>=0;e--)if(n>=ga[e].minRP)return ga[e];return ga[0]}function bl(){const n=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),e=Ml(n),t=document.getElementById("menu-rank-icon"),i=document.getElementById("menu-rank-label"),s=document.getElementById("menu-rank-rp");t&&(t.innerText=e.icon,t.style.color=e.color),i&&(i.innerText=e.label,i.style.color=e.color),s&&(s.innerText=`(${n} RP)`)}let La=!1,cn=null;yt.addEventListener("ended",()=>{Ut||(yt.currentTime=0,yt.play().catch(()=>{}))});Tt.addEventListener("ended",()=>{Ut||(Tt.currentTime=0,Tt.play().catch(()=>{}))});function Zh(){if(ma||Ut){ya();return}const n=document.querySelector(".screen.active");if(n&&n.id==="game"||mi.game&&mi.game.classList.contains("active"))return;const t=document.getElementById("deploy-modal");if(t&&t.classList.contains("active")){St.volume=.15,St.play().then(()=>{ma=!0,ya()}).catch(()=>{});return}n&&(n.id==="lobby-screen"||n.id==="matchmaking-screen")?Tt.play().then(()=>{ma=!0,ya()}).catch(()=>{}):yt.play().then(()=>{ma=!0,ya()}).catch(()=>{})}function ya(){["click","keydown","touchstart"].forEach(n=>{window.removeEventListener(n,Zh)})}["click","keydown","touchstart"].forEach(n=>{window.addEventListener(n,Zh)});function jh(){if(Ut)yt.volume=0,Tt.volume=0,St.volume=0;else{const n=mi.game&&mi.game.classList.contains("active");yt.volume=n?.04:.15,Tt.volume=.15,St.volume=.15}}function qo(){const n=document.getElementById("setting-music-toggle"),e=document.getElementById("settings-music-action"),t=document.getElementById("settings-music-status");n&&(n.classList.toggle("is-muted",Ut),n.setAttribute("aria-pressed",String(Ut)),e&&(e.innerText=Ut?"UNMUTE MUSIC":"MUTE MUSIC"),t&&(t.innerText=Ut?"MUSIC IS OFF":"MUSIC IS PLAYING"))}function Ly(n){if(We.musicMuted=n,Ut=n,Ut)window.stopAllMusic();else{const e=document.querySelector(".screen.active"),t=document.getElementById("deploy-modal");t&&t.classList.contains("active")?(St.currentTime=0,St.play().catch(()=>{})):e&&(e.id==="lobby-screen"||e.id==="matchmaking-screen")?$h():e&&e.id==="game-screen"?Kh():vl()}jh(),qo(),En()}const We={volume:.5,blood:!0,shadows:!0,laser:!0,musicMuted:!1,sfxMuted:!1,performanceMode:!1,showFps:!1};function Dy(){const n=Se.getItem("tacticstrike_settings"),e=document.getElementById("setting-show-fps");if(n)try{const s=JSON.parse(n);delete s.serverUrl,Object.assign(We,s),pt.volume&&(pt.volume.value=We.volume*100),pt.volumeVal&&(pt.volumeVal.innerText=`${Math.round(We.volume*100)}%`),pt.blood&&(pt.blood.checked=We.blood),pt.shadows&&(pt.shadows.checked=We.shadows),pt.laser&&(pt.laser.checked=We.laser),e&&(e.checked=!!We.showFps);const a=document.getElementById("fps-counter");a&&(a.style.display=We.showFps?"block":"none"),Ut=!!We.musicMuted;const r=document.getElementById("setting-mute-sfx");r&&(r.checked=!!We.sfxMuted)}catch(s){console.error(s)}qo(),e&&e.addEventListener("change",s=>{We.showFps=s.target.checked;const a=document.getElementById("fps-counter");a&&(a.style.display=We.showFps?"block":"none"),En()}),pt.volume&&pt.volume.addEventListener("input",s=>{const a=parseInt(s.target.value);We.volume=a/100,pt.volumeVal&&(pt.volumeVal.innerText=`${a}%`),En()}),pt.blood&&pt.blood.addEventListener("change",s=>{We.blood=s.target.checked,En()}),pt.shadows&&pt.shadows.addEventListener("change",s=>{We.shadows=s.target.checked,En()}),pt.laser&&pt.laser.addEventListener("change",s=>{We.laser=s.target.checked,En()});const t=document.getElementById("setting-music-toggle");t&&t.addEventListener("click",()=>{We.sfxMuted||Vt(),Ly(!Ut)});const i=document.getElementById("setting-mute-sfx");i&&i.addEventListener("change",s=>{We.sfxMuted=s.target.checked,En()}),et.openSettings&&et.openSettings.addEventListener("click",()=>{Py(),qo(),pt.modal&&pt.modal.classList.add("active")}),et.closeSettings&&et.closeSettings.addEventListener("click",()=>{pt.modal&&pt.modal.classList.remove("active")})}function En(){if(Se.setItem("tacticstrike_settings",JSON.stringify(We)),be){const n=We.sfxMuted?0:We.volume;be.updateSettings({...We,volume:n})}}function ei(n){const e=document.getElementById("deploy-modal");if(e&&e.classList.remove("active"),Object.keys(mi).forEach(t=>{t===n?(mi[t].classList.add("active"),(t==="matchmaking"||t==="lobby")&&(mi[t].style.display="flex")):(mi[t].classList.remove("active"),t==="matchmaking"&&(mi[t].style.display="none"))}),n!=="matchmaking"&&window.mmDotsInterval&&(clearInterval(window.mmDotsInterval),window.mmDotsInterval=null),n==="menu")vl();else if(n==="lobby")Yh();else if(n==="matchmaking")$h();else if(n==="game")Kh(),window.tipInterval&&clearInterval(window.tipInterval),Xo(),window.tipInterval=setInterval(Xo,18e3);else{window.tipInterval&&(clearInterval(window.tipInterval),window.tipInterval=null);const t=document.getElementById("gameplay-tips-panel");t&&(t.style.display="none")}n==="menu"&&at&&at.chatMessages&&(at.chatMessages.innerHTML=""),jh()}function Ny(){const n=document.querySelectorAll(".weapon-option");n.forEach(e=>{e.addEventListener("click",t=>{if(e.classList.contains("locked")){t.preventDefault(),t.stopPropagation(),xs();return}n.forEach(i=>i.classList.remove("active")),e.classList.add("active"),mt=e.dataset.weapon,Se.setItem("tacticstrike_player_weapon",mt),us(mt),Vt(),ce&&It&&ce.emit("select-weapon",{weapon:mt})})}),us("pistol")}function us(n){const e=Qa[n];if(!e||!at.weaponStats)return;const t=e.damagePct??Math.min(100,Math.round(e.damage/95*100)),i=e.fireRatePct??Math.min(100,Math.round(e.fireRate)),s=e.accuracy??75,r=n==="plasma"||n==="railgun"?"#ff6ef7":"",o=r?`background: ${r};`:"";at.weaponStats.innerHTML=`
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
  `}function Tn(n){var c;if(Ia=n,!at.playersList)return;at.playersList.innerHTML="";const e=$t==="2v2"?4:2;for(let h=0;h<e;h++){const f=n[h],d=document.createElement("div");if(f){d.className=`player-slot active ${f.ready?"ready":""}`;const u=((c=Qa[f.weapon])==null?void 0:c.name)||f.weapon,v={cyan:"#66fcf1",green:"#39db14",purple:"#9d3bff",orange:"#ff7f3b",yellow:"#ffd700",red:"#ff3c3c"}[f.color]||"#66fcf1",m=$t==="2v2"?`TEAM ${h%2===0?"1":"2"}`:h===0?"HOST":"GUEST",p=f.rp||0,b=Ml(p);d.innerHTML=`
        <div class="player-info">
          <span class="player-name" style="color: ${v};">
            <span style="color: ${b.color}; margin-right: 4px;">${b.icon}</span>${Dn(f.name)} ${f.id===ce.id?"(YOU)":""}
          </span>
          <span class="player-weapon-desc">RANK: <span style="color:${b.color}">${b.label}</span> | WEAPON: ${u}</span>
        </div>
        <div class="player-badge ${h%2===0?"host":"guest"}">
          ${m}
        </div>
        <div class="status-badge ${f.ready?"ready-status":"waiting"}">
          ${f.ready?"READY":"CHOOSING..."}
        </div>
      `}else{d.className="player-slot empty";const u=h+1,g=$t==="2v2"?` (TEAM ${h%2===0?"1":"2"})`:"";d.innerHTML=`<div class="slot-status">WAITING FOR OPERATIVE ${u}${g}...</div>`}if(at.playersList.appendChild(d),$t==="1v1"&&h===0){const u=document.createElement("div");u.className="vs-divider",u.innerText="VS",at.playersList.appendChild(u)}}const t=n.find(h=>h.id===ce.id);t&&et.readyToggle&&(Is=t.ready,et.readyToggle.className=Is?"btn secondary":"btn primary",et.readyToggle.innerText=Is?"CANCEL READY":"READY TO DEPLOY");const i=document.getElementById("lobby-map-selector-container"),s=document.getElementById("lobby-map-select");if(i&&s)if(xi==="ranked")i.style.display="none";else{i.style.display="block";const h=n[0]&&n[0].id===ce.id;s.disabled=!h}const a=document.getElementById("lobby-mode-selector-container"),r=document.getElementById("lobby-mode-select");if(a&&r)if(xi==="ranked")a.style.display="none";else{a.style.display="block";const h=n[0]&&n[0].id===ce.id;r.disabled=!h}const o=document.getElementById("lobby-style-selector-container"),l=document.getElementById("lobby-style-select");if(o&&l)if(xi==="ranked")o.style.display="none";else{o.style.display="block";const h=n[0]&&n[0].id===ce.id;l.disabled=!h}}function Da(){if(ce)return;const n=gl();ce=Ea(n),window.AppSocket=ce,ce.on("connect_error",()=>{console.warn("Failed to connect to multiplayer server."),Xr({total:1,quickplay:0,ranked_realistic:0,ranked_competitive:0})}),ce.on("disconnect",()=>{Xr({total:1,quickplay:0,ranked_realistic:0,ranked_competitive:0})}),ce.on("player-counts",e=>{Xr(e)}),ce.on("connect",()=>{console.log("Socket connected.");const e=yl(),t=parseInt(Se.getItem("tacticstrike_rp")||"0"),i=fs(),s=parseInt(Se.getItem("tacticstrike_credits")||"0");let a=[];try{a=JSON.parse(Se.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}ce.emit("sync-device",{uuid:e,rp:t,wins:i.wins,losses:i.losses,name:Ke,credits:s,purchasedWeapons:a})}),ce.on("device-synced",e=>{console.log("Device synced with database:",e);const t=parseInt(Se.getItem("tacticstrike_rp")||"0"),i=Math.max(t,e.rp||0);Se.setItem("tacticstrike_rp",String(i));const s=fs(),a=Math.max(s.wins,e.wins||0),r=Math.max(s.losses,e.losses||0);qh({wins:a,losses:r});const o=parseInt(Se.getItem("tacticstrike_credits")||"0"),l=Math.max(o,e.credits||0);Se.setItem("tacticstrike_credits",String(l));let c=[];try{c=JSON.parse(Se.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}const h=Array.from(new Set([...c,...e.purchasedWeapons||[]]));Se.setItem("tacticstrike_purchased_weapons",JSON.stringify(h)),e.name&&e.name!=="Operative"&&(Ke=e.name,Se.setItem("tacticstrike_player_name",Ke),Fe.name&&(Fe.name.value=Ke)),bl(),_l(),xl()}),ce.on("register-response",e=>{e.success||console.warn("Register failed:",e.error)}),ce.on("login-response",e=>{e.success||console.warn("Login failed:",e.error)}),ce.on("room-created",({roomId:e,players:t,autoMatch:i,mode:s,mapId:a,renderStyle:r,isRanked:o})=>{It=e,s&&($t=s),xi=o?"ranked":"casual",at.roomCode.innerText=e;const l=document.getElementById("lobby-map-select");l&&a&&(l.value=a);const c=document.getElementById("lobby-mode-select");c&&s&&(c.value=s);const h=document.getElementById("lobby-style-select");h&&r&&(h.value=r,gi=r),i?(Tn(t),Hi("Created matchmaking room. Waiting for opponent...")):(ei("lobby"),Tn(t),Hi(`Lobby created. Share code [${e}] with a friend.`))}),ce.on("room-joined",({roomId:e,players:t,mode:i,mapId:s,renderStyle:a,isRanked:r})=>{It=e,i&&($t=i),xi=r?"ranked":"casual",at.roomCode.innerText=e,ei("lobby"),Tn(t);const o=document.getElementById("lobby-map-select");o&&s&&(o.value=s);const l=document.getElementById("lobby-mode-select");l&&i&&(l.value=i);const c=document.getElementById("lobby-style-select");c&&a&&(c.value=a,gi=a),Hi(`Joined lobby: ${e}`),cn&&(clearTimeout(cn),cn=null),La=!1}),ce.on("room-error",e=>{alert(e)}),ce.on("player-joined",({players:e})=>{Tn(e);const t=e.find(s=>s.id!==ce.id);t&&Hi(`${t.name} entered the lobby.`);const i=document.querySelector(".screen.active");i&&i.id==="matchmaking-screen"&&ei("lobby")}),ce.on("players-update",({players:e})=>{Tn(e)}),ce.on("lobby-map-update",({mapId:e})=>{const t=document.getElementById("lobby-map-select");t&&(t.value=e),Hi(`Host updated mission area to: ${e==="cyberlab"?"Neon Cyber-Lab":e==="arena"?"Neon Arena":"Residential Manor"}`)}),ce.on("lobby-mode-update",({mode:e})=>{const t=document.getElementById("lobby-mode-select");t&&(t.value=e),$t=e;let i="Duel 1v1";e==="sabotage"&&(i="Sabotage (Task Survival)"),Hi(`Host updated game mode to: ${i}`)}),ce.on("lobby-style-update",({renderStyle:e})=>{const t=document.getElementById("lobby-style-select");t&&(t.value=e),gi=e,Hi(`Host updated render style to: ${e==="competitive"?"Competitive":"Realistic"}`)}),ce.on("player-left",({players:e,message:t})=>{Tn(e),Hi(t);const i=document.querySelector(".screen.active"),s=i&&i.id==="game-screen";if(be&&s)if(be.active&&be.mode==="online"&&(be.gameState==="playing"||be.gameState==="countdown"||be.gameState==="replay")){if(er(!0),be.isRanked){const r=parseInt(localStorage.getItem("tacticstrike_rp")||"0")+80;localStorage.setItem("tacticstrike_rp",String(r)),be.localPlayer&&(be.localPlayer.rp=r,be.localPlayer.rank=be.localPlayer._calcRank(r))}localStorage.removeItem("tacticstrike_active_match"),be.endGameDueToDisconnect(t)}else if(be.gameState==="match-over"){const a=document.getElementById("rematch-status");a&&(a.innerText="Opponent left the room.");const r=document.getElementById("btn-rematch");r&&(r.disabled=!0,r.innerText="OPPONENT LEFT")}else localStorage.removeItem("tacticstrike_active_match"),be.endGameDueToDisconnect(t)}),ce.on("match-start",({players:e,seed:t,isRanked:i,mode:s,mapId:a,renderStyle:r})=>{xi=i?"ranked":"casual",r&&(gi=r),fn&&fn.classList.remove("active"),Sl(()=>{const l=e.findIndex(c=>c.id===ce.id);at.chatMessages.innerHTML="",localStorage.setItem("tacticstrike_active_match",i?"ranked":"casual"),be&&be.destroy(),be=new fl("game-canvas",{mode:"online",socket:ce,localPlayerId:ce.id,localPlayerName:Ke,localWeapon:mt,localColor:ti,localPlayerIndex:l,players:e,seed:t,mapId:a||"manor",settings:{...We,volume:We.sfxMuted?0:We.volume},matchMode:s||$t,isRanked:!!i,qpRenderStyle:gi,onMatchEnd:El,onKillFeed:wl}),ei("game")})}),ce.on("opponent-requested-rematch",e=>{const t=document.getElementById("rematch-status");let i="Opponent";if(be&&e&&e.playerId){const s=be.players.find(a=>a.id===e.playerId);s&&(i=s.name)}t&&(t.innerText=`${i} requested a rematch! Click REMATCH to accept.`)})}function xa(){ce&&(ce.disconnect(),ce=null,It=null,window.AppSocket=null),at&&at.roomCode&&(at.roomCode.innerText="-----")}function Kc(){const n=document.getElementById("deploy-modal");n&&n.classList.remove("active"),xi="practice",Sl(()=>{at.chatMessages.innerHTML="",be&&be.destroy();const t=[{id:"player",name:Ke,weapon:mt,color:ti}];$t==="2v2"?(t.push({id:"bot_enemy_1",name:"Bot Miller (Enemy)",weapon:_a(),color:"red"}),t.push({id:"bot_teammate",name:"Bot Ramirez (Teammate)",weapon:_a(),color:"green"}),t.push({id:"bot_enemy_2",name:"Bot Cooper (Enemy)",weapon:_a(),color:"orange"})):t.push({id:"bot_enemy_1",name:"Bot Miller (Enemy)",weapon:_a(),color:"red"}),be=new fl("game-canvas",{mode:"offline",socket:null,localPlayerId:"player",localPlayerName:Ke,localWeapon:mt,localColor:ti,localPlayerIndex:0,players:t,seed:Math.random(),mapId:is,settings:{...We,volume:We.sfxMuted?0:We.volume},matchMode:$t,isRanked:!1,qpRenderStyle:gi,onMatchEnd:El,onKillFeed:wl}),ei("game")})}function _a(){return["pistol","rifle","shotgun","sniper","smg","lmg","dmr","vector","famas"][Math.floor(Math.random()*9)]}function El(n){localStorage.removeItem("tacticstrike_active_match"),fn&&fn.classList.add("active");const e=!!n.isWin;let t="";if(be&&be.mode==="online"){er(e);const g=be.players.find(p=>p.id!==ce.id);g&&Ry(g.name,e);const v=parseInt(Se.getItem("tacticstrike_credits")||"0");let m=v;if(be.isRanked&&e&&(m=v+50,Se.setItem("tacticstrike_credits",String(m)),t=' <span style="color:#ffd700; font-size:10px;">(+50 Credits Ranked Win Bonus!)</span>'),ce){const p=yl(),b=parseInt(Se.getItem("tacticstrike_rp")||"0"),_=fs();let x=[];try{x=JSON.parse(Se.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}ce.emit("sync-device",{uuid:p,rp:b,wins:_.wins,losses:_.losses,name:Ke,credits:m,purchasedWeapons:x})}}const i=document.getElementById("match-result-title"),s=document.getElementById("match-result-subtitle");i&&(e?(i.innerText="MISSION ACCOMPLISHED",i.className="result-title win"):(i.innerText="MISSION FAILED",i.className="result-title lose")),s&&(e?s.innerText="You successfully eliminated the target operative.":s.innerText="You were eliminated by the target operative.");let a="Unknown Operative";if(be){const g=be.players.find(v=>v.id===n.winnerId);g&&(a=g.name)}const r=document.getElementById("match-winner-name");r&&(r.innerText=`WINNER: ${a}`,r.style.color=e?"#39db14":"#ff3c3c");const o=document.getElementById("stat-rounds-won");o&&(o.innerText=n.roundsWon||0);const l=document.getElementById("stat-damage-dealt");l&&(l.innerText=Math.round(n.damageDealt||0));const c=document.getElementById("stat-accuracy");c&&(c.innerText=`${Math.round(n.accuracy||0)}%`);const h=document.getElementById("stat-shots-fired");h&&(h.innerText=n.shotsFired||0);const f=document.getElementById("rematch-status");f&&(f.innerText="");const d=document.getElementById("btn-rematch");d&&(d.disabled=!1,d.innerText="REMATCH"),et.returnLobby&&(be&&be.isRanked?et.returnLobby.innerText="RETURN TO MENU":et.returnLobby.innerText="RETURN TO LOBBY");const u=document.getElementById("rank-result-panel");if(u){if(be&&be.isRanked&&n.newRank){const g=n.newRank,v=n.rpDelta||0,m=v>=0?`+${v} RP`:`${v} RP`,p=v>=0?"#39ff14":"#ff3c3c";u.innerHTML=`
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
          ${n.rankChanged?`<div style="margin-top:10px;padding:6px 12px;background:rgba(${v>=0?"57,255,20":"255,60,60"},0.12);border:1px solid ${v>=0?"#39ff14":"#ff3c3c"};border-radius:6px;font-family:var(--font-title);font-size:10px;color:${v>=0?"#39ff14":"#ff3c3c"};text-align:center;letter-spacing:1px;">${v>=0?"▲ RANK UP!":"▼ RANK DOWN"} ${n.oldRankLabel} → ${g.label}</div>`:""}
        `,u.style.display="block"}else u.innerHTML='<div style="font-family:var(--font-title); font-size:10px; color:var(--text-muted); text-align:center; letter-spacing:1.5px;">CASUAL MATCH - NO RANK EFFECT</div>',u.style.display="block";if(t){const g=document.createElement("div");g.style.cssText="font-family:var(--font-title); font-size:10px; text-align:center; margin-top:8px;",g.innerHTML=t,u.appendChild(g)}}}function ky(){const n=document.getElementById("btn-deploy-main"),e=document.getElementById("btn-close-deploy"),t=document.getElementById("deploy-modal");n&&t&&n.addEventListener("click",()=>{t.classList.add("active"),Vt(),yt.pause(),yt.currentTime=0,Ut||(St.volume=.15,St.currentTime=0,St.play().catch(()=>{}))}),e&&t&&e.addEventListener("click",()=>{t.classList.remove("active"),Vt(),St.pause(),St.currentTime=0,Ut||vl()}),Fe.name&&Fe.name.addEventListener("change",()=>{Ke=Fe.name.value.trim()||"Operative",Se.setItem("tacticstrike_player_name",Ke),ce&&ce.connected&&ce.emit("change-name",{name:Ke})}),et.practiceBot&&et.practiceBot.addEventListener("click",()=>{Fe.name&&(Ke=Fe.name.value.trim()||"Operative"),Se.setItem("tacticstrike_player_name",Ke),Kc()}),et.btnAmongUs&&et.btnAmongUs.addEventListener("click",()=>{Fe.name&&(Ke=Fe.name.value.trim()||"Operative"),Se.setItem("tacticstrike_player_name",Ke);const h=document.getElementById("deploy-modal");h&&h.classList.remove("active"),xi="practice",Sl(()=>{at.chatMessages.innerHTML="",be&&be.destroy();const d=[{id:"player",name:Ke,weapon:"none",color:ti},{id:"bot_enemy_1",name:"Impostor Killer",weapon:"pistol",color:"red"}];be=new fl("game-canvas",{mode:"offline",socket:null,localPlayerId:"player",localPlayerName:Ke,localWeapon:"none",localColor:ti,localPlayerIndex:0,players:d,seed:Math.random(),mapId:is,settings:{...We,volume:We.sfxMuted?0:We.volume},matchMode:"sabotage",isRanked:!1,qpRenderStyle:gi,onMatchEnd:El,onKillFeed:wl}),ei("game")})}),et.createRoom&&et.createRoom.addEventListener("click",()=>{const h=document.getElementById("deploy-modal");h&&h.classList.remove("active"),Fe.name&&(Ke=Fe.name.value.trim()||"Operative"),Se.setItem("tacticstrike_player_name",Ke),Da(),ce&&ce.emit("create-room",{playerName:Ke,mode:$t,color:ti,mapId:is,weapon:mt,renderStyle:gi})}),et.joinRoom&&et.joinRoom.addEventListener("click",()=>{const h=document.getElementById("deploy-modal");h&&h.classList.remove("active");const f=Fe.roomCode?Fe.roomCode.value.toUpperCase().trim():"";if(!f||f.length!==5){alert("Please enter a valid 5-character room code.");return}Fe.name&&(Ke=Fe.name.value.trim()||"Operative"),Se.setItem("tacticstrike_player_name",Ke),Da(),ce&&ce.emit("join-room",{roomId:f,playerName:Ke,color:ti,weapon:mt})});function i(h){const f=document.getElementById("deploy-modal");if(f&&f.classList.remove("active"),Fe.name&&(Ke=Fe.name.value.trim()||"Operative"),Se.setItem("tacticstrike_player_name",Ke),Da(),ce){const d=parseInt(localStorage.getItem("tacticstrike_rp")||"0");La=!1;const u=$t+"_"+h;ce.emit("auto-match",{playerName:Ke,mode:u,color:ti,rp:d,rankStrict:!0,weapon:mt}),ei("matchmaking");const g=document.getElementById("mm-rank-display"),v=document.getElementById("mm-rank-icon"),m=document.getElementById("mm-timer"),p=document.getElementById("mm-expand-notice"),b=Ml(d);g&&(g.innerText=b.label),v&&(v.innerText=b.icon,v.style.color=b.color),m&&(m.innerText="0s"),p&&(p.innerText="Searching within your skill bracket...");let _=0;window.mmInterval&&clearInterval(window.mmInterval),window.mmInterval=setInterval(()=>{_++,m&&(m.innerText=`${_}s`)},1e3);let x=0;const y=document.getElementById("mm-dots");window.mmDotsInterval&&clearInterval(window.mmDotsInterval),window.mmDotsInterval=setInterval(()=>{x=(x+1)%4,y&&(y.innerText=".".repeat(x))},500),cn&&clearTimeout(cn),cn=setTimeout(()=>{!La&&ce&&ce.connected&&(!It||Ia&&Ia.length===1)&&(La=!0,Hi("⚡ Rank filter removed — expanding search to all ranks..."),p&&(p.innerText="⚡ Search expanded to all skill ranks!"),It&&(ce.emit("leave-room"),It=null),ce.emit("auto-match",{playerName:Ke,mode:u,color:ti,rp:d,rankStrict:!1,weapon:mt}))},2e3)}}et.rankedRealistic&&et.rankedRealistic.addEventListener("click",()=>i("realistic")),et.rankedCompetitive&&et.rankedCompetitive.addEventListener("click",()=>i("competitive"));const s=document.getElementById("btn-cancel-matchmaking");s&&s.addEventListener("click",()=>{window.mmInterval&&clearInterval(window.mmInterval),cn&&clearTimeout(cn),ce&&ce.emit("leave-room"),xa(),window.stopAllMusic(),ei("menu")}),et.leaveLobby&&et.leaveLobby.addEventListener("click",()=>{ce&&It&&ce.emit("leave-room"),xa(),ei("menu")}),et.readyToggle&&et.readyToggle.addEventListener("click",()=>{if(ce&&It){const h=!Is;ce.emit("player-ready",{ready:h}),Yh()}}),et.copyCode&&et.copyCode.addEventListener("click",()=>{It&&navigator.clipboard.writeText(It).then(()=>{et.copyCode.innerText="✅",setTimeout(()=>et.copyCode.innerText="📋",1500)})}),et.returnLobby&&et.returnLobby.addEventListener("click",()=>{fn&&fn.classList.remove("active");const h=document.getElementById("rank-result-panel");h&&(h.style.display="none",h.innerHTML=""),be&&(be.destroy(),be=null),bl(),ce&&It&&xi!=="ranked"?(ei("lobby"),Is=!1,Tn(Ia),us(mt)):(ce&&ce.emit("leave-room"),xa(),ei("menu"))});const a=document.getElementById("btn-game-menu"),r=document.getElementById("game-menu-overlay"),o=document.getElementById("btn-game-resume"),l=document.getElementById("btn-game-leave");a&&r&&a.addEventListener("click",()=>{r.classList.add("active")}),o&&r&&o.addEventListener("click",()=>{r.classList.remove("active")}),l&&r&&l.addEventListener("click",()=>{console.log("LEAVE MATCH clicked. Cleaning up game session...");try{if(r.classList.remove("active"),be){try{if(be.active&&be.mode==="online"&&(er(!1),be.isRanked)){const h=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),f=Math.max(0,h-40);localStorage.setItem("tacticstrike_rp",String(f))}}catch(h){console.error("Error recording match result during leave:",h)}localStorage.removeItem("tacticstrike_active_match");try{be.destroy()}catch(h){console.error("Error destroying gameEngine:",h)}be=null}}catch(h){console.error("Error in leave match handler pre-disconnect:",h)}try{ce&&It&&ce.emit("leave-room")}catch(h){console.error("Error emitting leave-room:",h)}try{xa()}catch(h){console.error("Error disconnecting socket:",h)}try{ei("menu")}catch(h){console.error("Error showing menu screen:",h)}});const c=document.getElementById("btn-rematch");c&&c.addEventListener("click",()=>{if(be&&be.mode==="offline")fn&&fn.classList.remove("active"),be&&(be.destroy(),be=null),Kc();else{c.disabled=!0,c.innerText="WAITING...";const h=document.getElementById("rematch-status");h&&(h.innerText="Rematch requested. Waiting for opponent..."),ce&&ce.emit("request-rematch")}}),window.addEventListener("keydown",h=>{h.key==="Enter"&&(h.preventDefault(),Fe.chat&&document.activeElement===Fe.chat?Uy():mi.game&&mi.game.classList.contains("active")&&at.chatDrawer&&Fe.chat&&(at.chatDrawer.classList.add("active"),Fe.chat.focus()))}),Fe.chat&&Fe.chat.addEventListener("blur",()=>{setTimeout(()=>{Fe.chat&&document.activeElement!==Fe.chat&&at.chatDrawer&&at.chatDrawer.classList.remove("active")},100)}),Fe.qpMapSelect&&(Fe.qpMapSelect.value=is,Fe.qpMapSelect.addEventListener("change",h=>{is=h.target.value,Se.setItem("tacticstrike_selected_map",is),Vt()})),Fe.lobbyMapSelect&&Fe.lobbyMapSelect.addEventListener("change",h=>{const f=h.target.value;ce&&It&&ce.emit("select-map",{mapId:f}),Vt()}),Fe.lobbyModeSelect&&Fe.lobbyModeSelect.addEventListener("change",h=>{const f=h.target.value;ce&&It&&ce.emit("select-game-mode",{mode:f}),Vt()}),Fe.lobbyStyleSelect&&Fe.lobbyStyleSelect.addEventListener("change",h=>{const f=h.target.value;ce&&It&&ce.emit("select-render-style",{renderStyle:f}),Vt()})}function Uy(){if(!Fe.chat)return;const n=Fe.chat.value.trim();n&&(Tl(Ke,n,"self"),ce&&It&&ce.emit("chat-message",{name:Ke,msg:n}),Fe.chat.value=""),Fe.chat.blur()}function Tl(n,e,t){const i=document.createElement("div");i.className=`chat-msg ${t}`,t==="system"?i.innerHTML=`<span class="message">${Dn(e)}</span>`:i.innerHTML=`
      <span class="author">${Dn(n)}:</span>
      <span class="message">${Dn(e)}</span>
    `,at.chatMessages&&(at.chatMessages.appendChild(i),at.chatMessages.scrollTop=at.chatMessages.scrollHeight),at.chatDrawer&&at.chatDrawer.classList.add("active"),window.chatTimeout&&clearTimeout(window.chatTimeout),window.chatTimeout=setTimeout(()=>{Fe.chat&&document.activeElement!==Fe.chat&&at.chatDrawer&&at.chatDrawer.classList.remove("active")},4e3)}function Hi(n){Tl("",n,"system")}function wl(n,e,t){var r;const i=document.getElementById("kill-feed");if(!i)return;const s=document.createElement("div");s.className="kill-msg";const a=((r=Qa[t])==null?void 0:r.name)||t;s.innerHTML=`
    <span class="killer">${Dn(n)}</span> 
    🔫 [<span class="weapon">${a}</span>] ➔ 
    <span class="victim">${Dn(e)}</span>
  `,i.appendChild(s),setTimeout(()=>s.remove(),5e3)}function Dn(n){return n.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]||e)}function Fy(){const n=document.querySelectorAll("#lobby-color-selector .color-option");n.forEach(t=>{t.addEventListener("click",()=>{n.forEach(s=>{s.classList.remove("active"),s.style.borderColor="transparent"}),t.classList.add("active"),ti=t.dataset.color;const i={cyan:"#66fcf1",green:"#39db14",purple:"#9d3bff",orange:"#ff7f3b",yellow:"#ffd700",red:"#ff3c3c"};t.style.borderColor=i[ti],Se.setItem("tacticstrike_player_color",ti),ce&&It&&ce.emit("select-color",{color:ti})})});const e=Se.getItem("tacticstrike_player_color");if(e){const t=document.querySelector(`#lobby-color-selector .color-option[data-color="${e}"]`);t&&t.click()}}function By(){document.querySelectorAll('input[name="match-mode"]').forEach(e=>{e.addEventListener("change",()=>{$t=e.value})})}function Oy(){const n=document.getElementById("btn-qp-style-realistic"),e=document.getElementById("btn-qp-style-competitive");if(!n||!e)return;function t(){gi==="competitive"?(e.classList.add("active"),n.classList.remove("active")):(n.classList.add("active"),e.classList.remove("active"))}n.addEventListener("click",()=>{gi="realistic",Se.setItem("tacticstrike_qp_style","realistic"),t(),Vt()}),e.addEventListener("click",()=>{gi="competitive",Se.setItem("tacticstrike_qp_style","competitive"),t(),Vt()}),t()}function zy(){const n=document.querySelectorAll("#menu-weapon-selector .weapon-btn");n.forEach(e=>{e.addEventListener("click",t=>{if(e.classList.contains("locked")){t.preventDefault(),t.stopPropagation(),xs();return}n.forEach(s=>s.classList.remove("active")),e.classList.add("active"),mt=e.dataset.weapon,Se.setItem("tacticstrike_player_weapon",mt),Vt(),document.querySelectorAll(".weapon-option").forEach(s=>{s.dataset.weapon===mt?s.classList.add("active"):s.classList.remove("active")}),us(mt),ce&&It&&ce.emit("select-weapon",{weapon:mt})})})}function yn(n,e=8e3){const t=document.getElementById("notification-container");if(!t)return;const i=document.createElement("div");i.className="custom-toast",i.style.cssText=`
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
  `,i.appendChild(s);const a=document.createElement("div");a.style.paddingLeft="6px",a.innerText=n,i.appendChild(a),i.addEventListener("click",()=>{i.style.opacity="0",i.style.transform="translateX(50px)",setTimeout(()=>i.remove(),350)}),t.appendChild(i),requestAnimationFrame(()=>{i.style.opacity="1",i.style.transform="translateX(0)"}),setTimeout(()=>{i.parentNode&&(i.style.opacity="0",i.style.transform="translateX(50px)",setTimeout(()=>i.remove(),350))},e)}document.addEventListener("DOMContentLoaded",()=>{if(/Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS/i.test(navigator.userAgent)||window.innerWidth<800){const r=document.getElementById("mobile-warning-screen");r&&(r.style.display="flex");return}const e=localStorage.getItem("tacticstrike_active_match");if(e){if(er(!1),e==="ranked"){const r=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),o=Math.max(0,r-40);localStorage.setItem("tacticstrike_rp",String(o))}localStorage.removeItem("tacticstrike_active_match"),alert("Forfeit detected: You disconnected from an active match. Recorded as a loss.")}Dy(),jy(),Vy(),Hy(),Wy(),$y(),Zy(),Jy(),Ny(),zy(),Fy(),By(),Oy(),ky(),Iy();const t=Se.getItem("tacticstrike_player_name");if(t)Ke=t;else{const r=["Viper","Ghost","Specter","Rex","Apex","Phantom","Onyx","Nova"];Ke=`${r[Math.floor(Math.random()*r.length)]}_${Math.floor(Math.random()*900+100)}`,Se.setItem("tacticstrike_player_name",Ke)}Fe.name&&(Fe.name.value=Ke),Da(),ei("menu"),_l(),bl(),mt=Se.getItem("tacticstrike_player_weapon")||"pistol",xl(),document.querySelectorAll("#menu-weapon-selector .weapon-btn").forEach(r=>{r.dataset.weapon===mt?r.classList.add("active"):r.classList.remove("active")}),document.querySelectorAll(".weapon-option").forEach(r=>{r.dataset.weapon===mt?r.classList.add("active"):r.classList.remove("active")}),us(mt)});function Wr(n){const e=Ln[n];if(!e)return!0;try{if(JSON.parse(Se.getItem("tacticstrike_purchased_weapons")||"[]").includes(n))return!0}catch{}return parseInt(Se.getItem("tacticstrike_rp")||"0")>=e.rp}function Vy(){const n=document.getElementById("news-modal"),e=document.getElementById("btn-close-news");if(!n||!e)return;sessionStorage.getItem("tacticstrike_news_seen")||n.classList.add("active"),e.addEventListener("click",()=>{n.classList.remove("active"),sessionStorage.setItem("tacticstrike_news_seen","true"),Vt()})}function Hy(){const n=document.getElementById("whats-new-modal"),e=document.getElementById("btn-open-whats-new"),t=document.getElementById("btn-close-whats-new");!n||!e||!t||(e.addEventListener("click",()=>{n.classList.add("active"),Vt()}),t.addEventListener("click",()=>{n.classList.remove("active"),Vt()}))}function Wy(){const n=document.getElementById("credit-shop-modal"),e=document.getElementById("btn-open-credit-shop"),t=document.getElementById("btn-close-credit-shop"),i=document.querySelectorAll("#credit-shop-modal [data-buy-credit-pack]");!n||!t||(e==null||e.addEventListener("click",()=>Yo("menu")),document.addEventListener("click",s=>{var r;const a=s.target.closest("[data-open-credit-shop]");a&&(a.closest("#account-modal")&&((r=document.getElementById("account-modal"))==null||r.classList.remove("active")),Yo(a.closest("#shop-modal")?"item-shop":"menu"))}),document.addEventListener("click",s=>{const a=s.target.closest("[data-buy-credit-pack]");a&&(s.preventDefault(),Gy(a.dataset.buyCreditPack))}),t.addEventListener("click",()=>{n.classList.remove("active"),_i("close")}),i.forEach(s=>s.addEventListener("click",()=>_i("confirm"))))}function Yo(n="menu"){const e=document.getElementById("credit-shop-modal");e&&(e.dataset.source=n,e.classList.add("active"),_i("open"))}async function Gy(n){if(!oi.user||!oi.token){Us("login","Sign in or create an account before purchasing credits.");return}const e=document.querySelector(`[data-buy-credit-pack="${n}"]`),t=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.textContent="OPENING SECURE CHECKOUT…");try{const i=await qi("/api/credits/checkout",{method:"POST",body:JSON.stringify({packageId:n})});_i("confirm"),window.location.assign(i.checkoutUrl)}catch(i){if(e&&(e.disabled=!1,e.innerHTML=t),i.status===401){Ga(),Us("login","Your session expired. Sign in again to continue.");return}yn(i.message,6e3),xs()}}function In(n="",e=""){const t=document.getElementById("purchase-support-message");t&&(t.textContent=n,t.className=`support-notice${e?` ${e}`:""}`)}function tr(n){const e=new Date(n);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{dateStyle:"medium",timeStyle:"short"})}function Al(n){return n.closed?"CLOSED":n.status==="approved"?`${n.creditsGranted.toLocaleString()} CREDITS ADDED`:n.status==="denied"?"DENIED":"AWAITING REVIEW"}function Jh(n){return n.closed?"closed":n.status||"open"}function Xy(n){return new Promise((e,t)=>{if(!n){t(new Error("Attach a receipt screenshot as proof of purchase."));return}if(!["image/png","image/jpeg","image/webp"].includes(n.type)){t(new Error("Upload a PNG, JPG, or WebP receipt image."));return}if(n.size>15e5){t(new Error("Receipt images must be smaller than 1.5 MB."));return}const i=new FileReader;i.onload=()=>e({name:n.name,data:i.result}),i.onerror=()=>t(new Error("The receipt image could not be read.")),i.readAsDataURL(n)})}function Qh(n){const e=document.createElement("div");e.className=`support-message-bubble ${n.senderRole}`;const t=document.createElement("div");t.className="support-message-meta";const i=document.createElement("span");i.textContent=n.senderRole==="admin"?"TACTICSTRIKE SUPPORT":"YOU";const s=document.createElement("span");if(s.textContent=tr(n.createdAt),t.append(i,s),e.appendChild(t),n.body){const a=document.createElement("div");a.textContent=n.body,e.appendChild(a)}if(n.proofData){const a=document.createElement("img");a.className="support-proof-image",a.src=n.proofData,a.alt=n.proofName?`Purchase proof: ${n.proofName}`:"Purchase proof",e.appendChild(a)}return e}function qy(n){if(!(n!=null&&n.id))return;const e=`tacticstrike_server_credits_seen_${n.id}`,t=Math.max(0,parseInt(Se.getItem(e)||"0")),i=Math.max(0,Number(n.credits||0));if(i>t){const s=Math.max(0,parseInt(Se.getItem("tacticstrike_credits")||"0"));Se.setItem("tacticstrike_credits",String(s+(i-t)))}Se.setItem(e,String(i))}async function Na(){var e;const n=document.getElementById("purchase-support-cases");if(n){n.innerHTML='<div class="support-empty-state">Loading secure conversations…</div>';try{const t=await qi("/api/purchase-support/cases");if(t.user&&(oi.user=t.user,ps()),!t.cases.length){n.innerHTML='<div class="support-empty-state">No purchase-verification chats yet.</div>';return}const i=await Promise.all(t.cases.map(s=>qi(`/api/purchase-support/cases/${s.id}`)));n.innerHTML="",i.forEach(s=>Yy(s.purchaseCase,n))}catch(t){if(t.status===401){Ga(),(e=document.getElementById("purchase-support-modal"))==null||e.classList.remove("active"),Us("login","Your session expired. Sign in again to view purchase support.");return}n.innerHTML='<div class="support-empty-state">Purchase chats could not be loaded. Try refreshing.</div>',In(t.message,"error")}}}function Yy(n,e){const t=document.createElement("article");t.className="support-case-card";const i=document.createElement("div");i.className="support-case-summary";const s=document.createElement("div"),a=document.createElement("strong");a.textContent=`ORDER ${n.orderNumber}`;const r=document.createElement("small");r.textContent=`${n.requestedCredits.toLocaleString()}-credit verification · opened ${tr(n.createdAt)}`,s.append(a,r);const o=document.createElement("span");o.className=`case-status ${Jh(n)}`,o.textContent=Al(n),i.append(s,o),t.appendChild(i);const l=document.createElement("div");if(l.className="support-message-list",n.messages.forEach(c=>l.appendChild(Qh(c))),t.appendChild(l),!n.closed){const c=document.createElement("form");c.className="support-reply-form";const h=document.createElement("input");h.type="text",h.maxLength=1500,h.required=!0,h.placeholder="Reply to support…";const f=document.createElement("button");f.type="submit",f.textContent="SEND",c.append(h,f),c.addEventListener("submit",async d=>{d.preventDefault(),f.disabled=!0;try{await qi(`/api/purchase-support/cases/${n.id}/messages`,{method:"POST",body:JSON.stringify({message:h.value})}),In("Reply sent securely.","success"),await Na()}catch(u){In(u.message,"error")}finally{f.disabled=!1}}),t.appendChild(c)}e.appendChild(t),requestAnimationFrame(()=>{l.scrollTop=l.scrollHeight})}function $y(){const n=document.getElementById("purchase-support-modal"),e=document.getElementById("btn-open-purchase-support"),t=document.getElementById("btn-close-purchase-support"),i=document.getElementById("btn-refresh-purchase-support"),s=document.getElementById("purchase-support-form");!n||!e||!t||!s||(e.addEventListener("click",()=>{if(!oi.user||!oi.token){Us("login","Sign in before submitting purchase proof.");return}n.classList.add("active"),In(),_i("open"),Na()}),t.addEventListener("click",()=>{n.classList.remove("active"),_i("close")}),i==null||i.addEventListener("click",Na),s.addEventListener("submit",async a=>{a.preventDefault();const r=s.querySelector('button[type="submit"]');r.disabled=!0,In("Encrypting and submitting your purchase proof…","info");try{const o=document.getElementById("purchase-proof-file").files[0],l=await Xy(o);await qi("/api/purchase-support/cases",{method:"POST",body:JSON.stringify({orderNumber:document.getElementById("purchase-order-number").value,packageId:document.getElementById("purchase-package").value,message:document.getElementById("purchase-support-text").value,proof:l})}),s.reset(),In("Purchase proof submitted. Support will reply within 1–12 hours.","success"),_i("confirm"),await Na()}catch(o){In(o.message,"error"),xs()}finally{r.disabled=!1}}))}function ns(n="",e=""){const t=document.getElementById("admin-login-message");t&&(t.textContent=n,t.className=`support-notice${e?` ${e}`:""}`)}function $o(n){const e=document.getElementById("admin-login-view"),t=document.getElementById("admin-dashboard-view");e&&(e.hidden=n),t&&(t.hidden=!n)}function Rl(){rs=null,ml=null,Se.removeItem(pl),$o(!1)}async function Ls(n=ml){const e=document.getElementById("admin-case-list"),t=document.getElementById("admin-case-detail");if(!(!e||!t)){e.innerHTML='<div class="support-empty-state">Loading purchase queue…</div>';try{const i=await ds("/api/admin/purchase-cases");if(!i.cases.length){e.innerHTML='<div class="support-empty-state">No messages submitted.</div>',t.innerHTML='<div class="support-empty-state">The verification queue is empty.</div>';return}e.innerHTML="",i.cases.forEach(a=>{const r=document.createElement("button");r.type="button",r.dataset.caseId=a.id,r.className=`admin-case-list-item${a.id===n?" active":""}`;const o=document.createElement("strong");o.textContent=a.userEmail||"Unknown account";const l=document.createElement("span");l.textContent=`Order ${a.orderNumber}`;const c=document.createElement("small");c.textContent=`${Al(a)} · ${tr(a.updatedAt)}`,r.append(o,l,c),r.addEventListener("click",()=>Zc(a.id)),e.appendChild(r)});const s=i.cases.some(a=>a.id===n)?n:i.cases[0].id;await Zc(s,!1)}catch(i){if(i.status===401){Rl(),ns("Admin session expired. Sign in again.","error");return}e.innerHTML='<div class="support-empty-state">The verification queue could not be loaded.</div>',t.innerHTML=""}}}async function Zc(n,e=!0){var i;const t=document.getElementById("admin-case-detail");if(t){ml=n,e&&(document.querySelectorAll(".admin-case-list-item").forEach(s=>s.classList.remove("active")),(i=document.querySelector(`.admin-case-list-item[data-case-id="${n}"]`))==null||i.classList.add("active")),t.innerHTML='<div class="support-empty-state">Loading secure chat…</div>';try{const s=await ds(`/api/admin/purchase-cases/${n}`);Ky(s.purchaseCase)}catch(s){if(s.status===401){Rl(),ns("Admin session expired. Sign in again.","error");return}t.innerHTML='<div class="support-empty-state">This purchase chat could not be loaded.</div>'}}}function Ky(n){const e=document.getElementById("admin-case-detail");if(!e)return;e.innerHTML="";const t=document.createElement("div");t.className="admin-case-detail-head";const i=document.createElement("div"),s=document.createElement("span");s.className="section-kicker",s.textContent=n.userEmail||"OPERATIVE ACCOUNT";const a=document.createElement("h3");a.textContent=`ORDER ${n.orderNumber}`;const r=document.createElement("p");r.textContent=`Requested package: ${n.requestedCredits.toLocaleString()} credits · opened ${tr(n.createdAt)}`,i.append(s,a,r);const o=document.createElement("span");o.className=`case-status ${Jh(n)}`,o.textContent=Al(n),t.append(i,o),e.appendChild(t);const l=document.createElement("div");if(l.className="support-message-list admin-message-list",n.messages.forEach(d=>l.appendChild(Qh(d))),e.appendChild(l),!n.closed){const d=document.createElement("form");d.className="support-reply-form admin-reply-form";const u=document.createElement("input");u.type="text",u.maxLength=1500,u.required=!0,u.placeholder="Reply to this user…";const g=document.createElement("button");g.type="submit",g.textContent="SEND REPLY",d.append(u,g),d.addEventListener("submit",async v=>{v.preventDefault(),g.disabled=!0;try{await ds(`/api/admin/purchase-cases/${n.id}/messages`,{method:"POST",body:JSON.stringify({message:u.value})}),await Ls(n.id)}catch(m){yn(m.message,5e3)}finally{g.disabled=!1}}),e.appendChild(d)}const c=document.createElement("div");c.className="admin-actions",[50,500,2e3].forEach(d=>{const u=document.createElement("button");u.type="button",u.textContent=`ADD ${d.toLocaleString()} CREDITS`,u.disabled=n.closed||n.status==="approved",u.addEventListener("click",()=>Gr(n,"grant",d)),c.appendChild(u)});const h=document.createElement("button");h.type="button",h.className="danger",h.textContent="DENY PROOF",h.disabled=n.closed||n.status==="approved",h.addEventListener("click",()=>Gr(n,"deny"));const f=document.createElement("button");f.type="button",f.className="close-chat",f.textContent="CLOSE CHAT",f.disabled=n.closed,f.addEventListener("click",()=>Gr(n,"close")),c.append(h,f),e.appendChild(c),requestAnimationFrame(()=>{l.scrollTop=l.scrollHeight})}async function Gr(n,e,t=0){const i=e==="grant"?`Add ${t.toLocaleString()} credits to ${n.userEmail}? This cannot be granted twice.`:e==="deny"?`Deny the proof submitted for order ${n.orderNumber}?`:"Close this chat? The user will no longer be able to reply.";if(window.confirm(i))try{await ds(`/api/admin/purchase-cases/${n.id}/decision`,{method:"POST",body:JSON.stringify({action:e,credits:t})}),yn(e==="grant"?`${t.toLocaleString()} credits added.`:e==="deny"?"Proof denied.":"Chat closed.",4500),await Ls(n.id)}catch(s){yn(s.message,5500),xs()}}function Zy(){var o,l;const n=document.getElementById("admin-modal"),e=document.getElementById("version-admin-trigger"),t=document.getElementById("btn-close-admin"),i=document.getElementById("admin-login-form");if(!n||!t||!i)return;const s=()=>{n.classList.add("active"),ns(),$o(!!rs),_i("open"),rs&&Ls()};let a=0,r=null;e==null||e.addEventListener("click",()=>{if(a+=1,clearTimeout(r),a>=5){a=0,s();return}r=setTimeout(()=>{a=0},2200)}),t.addEventListener("click",()=>{n.classList.remove("active"),_i("close")}),i.addEventListener("submit",async c=>{c.preventDefault();const h=i.querySelector('button[type="submit"]');h.disabled=!0,ns("Authenticating with the secure server…","info");try{const f=await ds("/api/admin/login",{method:"POST",body:JSON.stringify({username:document.getElementById("admin-username").value,password:document.getElementById("admin-password").value})});rs=f.token,Se.setItem(pl,f.token),i.reset(),$o(!0),await Ls()}catch(f){ns(f.message,"error")}finally{h.disabled=!1}}),(o=document.getElementById("btn-refresh-admin-cases"))==null||o.addEventListener("click",()=>Ls()),(l=document.getElementById("btn-admin-logout"))==null||l.addEventListener("click",async()=>{try{await ds("/api/admin/logout",{method:"POST"})}catch{}Rl(),ns("Signed out of the admin dashboard.","success")})}function Wi(n="",e=""){const t=document.getElementById("account-message");t&&(t.textContent=n,t.className=`account-message${e?` ${e}`:""}`)}function ka(n="login"){const e=document.getElementById("account-tab-login"),t=document.getElementById("account-tab-register"),i=document.getElementById("account-login-form"),s=document.getElementById("account-register-form"),a=n==="login";e==null||e.classList.toggle("active",a),t==null||t.classList.toggle("active",!a),e==null||e.setAttribute("aria-selected",String(a)),t==null||t.setAttribute("aria-selected",String(!a)),i&&(i.hidden=!a),s&&(s.hidden=a)}function ps(){const n=oi.user;n&&qy(n);const e=document.getElementById("btn-open-account"),t=document.getElementById("credit-shop-account-status"),i=document.getElementById("account-profile-email"),s=document.getElementById("account-profile-credits"),a=document.getElementById("account-auth-view"),r=document.getElementById("account-profile-view"),o=document.querySelectorAll("#credit-shop-modal [data-buy-credit-pack]");if(e&&(e.textContent=n?`ACCOUNT · ${n.displayName||n.email.split("@")[0]}`:"SIGN IN",e.classList.toggle("signed-in",!!n)),t){t.classList.toggle("signed-in",!!n);const l=t.querySelector("span:last-child");l&&(l.textContent=n?`SIGNED IN · ${n.email}`:"SIGN IN TO PURCHASE")}i&&(i.textContent=(n==null?void 0:n.email)||""),s&&(s.textContent=String((n==null?void 0:n.credits)||0)),a&&(a.hidden=!!n),r&&(r.hidden=!n),o.forEach(l=>{l.firstChild&&(l.firstChild.textContent=n?"CONTINUE TO CHECKOUT ":"SIGN IN TO BUY ")})}function jc(n){oi={token:n.token,user:n.user},Se.setItem(ul,n.token),ps()}function Ga(){oi={token:null,user:null},Se.removeItem(ul),ps()}function Us(n="login",e=""){var t;ka(n),Wi(e,e?"info":""),ps(),(t=document.getElementById("account-modal"))==null||t.classList.add("active"),_i("open")}function jy(){var s,a,r;const n=document.getElementById("account-modal"),e=document.getElementById("btn-close-account"),t=document.getElementById("account-login-form"),i=document.getElementById("account-register-form");!n||!e||!t||!i||(document.addEventListener("click",o=>{o.target.closest("[data-open-account], #btn-open-account")&&Us("login")}),e.addEventListener("click",()=>{n.classList.remove("active"),_i("close")}),(s=document.getElementById("account-tab-login"))==null||s.addEventListener("click",()=>{ka("login"),Wi()}),(a=document.getElementById("account-tab-register"))==null||a.addEventListener("click",()=>{ka("register"),Wi()}),t.addEventListener("submit",async o=>{o.preventDefault();const l=t.querySelector('button[type="submit"]');l.disabled=!0,Wi("Authenticating…","info");try{const c=await qi("/api/auth/login",{method:"POST",body:JSON.stringify({email:document.getElementById("account-login-email").value,password:document.getElementById("account-login-password").value})});jc(c),yn("Welcome back, operative.",4e3)}catch(c){Wi(c.message,"error")}finally{l.disabled=!1}}),i.addEventListener("submit",async o=>{o.preventDefault();const l=document.getElementById("account-register-password").value,c=document.getElementById("account-register-confirm").value;if(l!==c){Wi("Passcodes do not match.","error");return}const h=i.querySelector('button[type="submit"]');h.disabled=!0,Wi("Creating secure operative profile…","info");try{const f=await qi("/api/auth/register",{method:"POST",body:JSON.stringify({email:document.getElementById("account-register-email").value,password:l})});jc(f),yn("Operative account created.",4500)}catch(f){Wi(f.message,"error")}finally{h.disabled=!1}}),(r=document.getElementById("btn-account-logout"))==null||r.addEventListener("click",async()=>{try{await qi("/api/auth/logout",{method:"POST"})}catch{}Ga(),ka("login"),Wi("Signed out successfully.","success")}),ps(),oi.token&&qi("/api/auth/me").then(o=>{oi.user=o.user,ps()}).catch(()=>Ga()))}function Jy(){const n=document.getElementById("shop-modal"),e=document.getElementById("btn-open-shop"),t=document.getElementById("btn-close-shop");!n||!e||!t||(Se.getItem("tacticstrike_credits")===null&&Se.setItem("tacticstrike_credits","0"),e.addEventListener("click",()=>{ed(),n.classList.add("active"),Vt()}),t.addEventListener("click",()=>{n.classList.remove("active"),Vt()}))}function ed(){const n=document.getElementById("shop-items-container"),e=document.getElementById("shop-credits-display"),t=document.getElementById("shop-owned-count"),i=document.getElementById("shop-available-count");if(!n||!e)return;const s=parseInt(Se.getItem("tacticstrike_credits")||"0");e.innerText=s;let a=[];try{a=JSON.parse(Se.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}const r=parseInt(Se.getItem("tacticstrike_rp")||"0");n.innerHTML="";let o=0,l=0;Object.keys(Ln).forEach(c=>{const h=Ln[c],f=Ty[c],d=a.includes(c),u=r>=h.rp,g=s>=h.price,v=d||u;v?o+=1:g&&(l+=1);const m=document.createElement("article");m.className=`shop-item-card tier-${f.tier.toLowerCase()}${v?" is-owned":""}${!g&&!v?" needs-credits":""}`;let p="",b="";d?(p='<span class="shop-item-status owned"><i></i>ACQUIRED</span>',b='<button class="shop-buy-action owned" disabled>IN YOUR ARMORY</button>'):u?(p='<span class="shop-item-status rank"><i></i>RANK UNLOCKED</span>',b='<button class="shop-buy-action owned" disabled>AVAILABLE IN LOADOUT</button>'):(p=`<span class="shop-item-status locked"><i></i>${h.rank} CLEARANCE</span>`,g?b=`<button class="shop-buy-action buy-btn" data-weapon="${c}">UNLOCK EARLY <span>→</span></button>`:b=`<button class="shop-buy-action top-up" type="button" data-open-credit-shop>GET CREDITS <span>+${(h.price-s).toLocaleString()}</span></button>`);const _=Qa[c]||{name:c};m.innerHTML=`
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
        <span>STANDARD UNLOCK</span><strong>${h.rank} · ${h.rp.toLocaleString()} RP</strong>
      </div>
      <div class="shop-item-purchase">
        <div class="shop-item-price"><img class="mini-credit-mark" src="/tacticstrike-credit-stack.webp" alt="" aria-hidden="true"><strong>${h.price.toLocaleString()}</strong><small>CREDITS</small></div>
        ${b}
      </div>
    `,n.appendChild(m)}),t&&(t.textContent=o),i&&(i.textContent=l),n.querySelectorAll(".buy-btn").forEach(c=>{c.addEventListener("click",()=>{const h=c.dataset.weapon;Qy(h)})})}function Qy(n){const e=Ln[n];if(!e)return;const t=parseInt(Se.getItem("tacticstrike_credits")||"0");if(t<e.price){xs(),yn(`You need ${(e.price-t).toLocaleString()} more credits for ${Ha[n]}.`,4500),Yo("item-shop");return}const i=t-e.price;Se.setItem("tacticstrike_credits",String(i));let s=[];try{s=JSON.parse(Se.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}s.includes(n)||(s.push(n),Se.setItem("tacticstrike_purchased_weapons",JSON.stringify(s)));try{const a=window.AudioContext||window.webkitAudioContext;if(a){const r=new a,o=r.createOscillator(),l=r.createGain();o.type="sine",o.frequency.setValueAtTime(587.33,r.currentTime),o.frequency.setValueAtTime(880,r.currentTime+.1),l.gain.setValueAtTime(.15,r.currentTime),l.gain.exponentialRampToValueAtTime(.001,r.currentTime+.35),o.connect(l),l.connect(r.destination),o.start(),o.stop(r.currentTime+.38)}}catch{}if(yn(`Successfully unlocked ${Ha[n]} early!`,6e3),ce){const a=yl(),r=parseInt(Se.getItem("tacticstrike_rp")||"0"),o=fs();ce.emit("sync-device",{uuid:a,rp:r,wins:o.wins,losses:o.losses,name:Ke,credits:i,purchasedWeapons:s})}ed(),xl()}function Xr(n){const e=document.getElementById("total-player-count-value"),t=document.getElementById("qp-player-count"),i=document.getElementById("ranked-real-player-count"),s=document.getElementById("ranked-comp-player-count");e&&n&&n.total!==void 0&&(e.innerText=n.total),t&&n&&n.quickplay!==void 0&&(t.innerText=n.quickplay),i&&n&&n.ranked_realistic!==void 0&&(i.innerText=n.ranked_realistic),s&&n&&n.ranked_competitive!==void 0&&(s.innerText=n.ranked_competitive)}window.addEventListener("opponent-chat-msg",n=>{const{name:e,msg:t}=n.detail;Tl(e,t,"opponent")});
