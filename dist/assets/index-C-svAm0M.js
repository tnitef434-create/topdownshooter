(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const Fi=Object.create(null);Fi.open="0";Fi.close="1";Fi.ping="2";Fi.pong="3";Fi.message="4";Fi.upgrade="5";Fi.noop="6";const Ia=Object.create(null);Object.keys(Fi).forEach(n=>{Ia[Fi[n]]=n});const ho={type:"error",data:"parser error"},bh=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Eh=typeof ArrayBuffer=="function",Th=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,yl=({type:n,data:e},t,i)=>bh&&e instanceof Blob?t?i(e):rc(e,i):Eh&&(e instanceof ArrayBuffer||Th(e))?t?i(e):rc(new Blob([e]),i):i(Fi[n]+(e||"")),rc=(n,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(n)};function oc(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let xr;function Od(n,e){if(bh&&n.data instanceof Blob)return n.data.arrayBuffer().then(oc).then(e);if(Eh&&(n.data instanceof ArrayBuffer||Th(n.data)))return e(oc(n.data));yl(n,!1,t=>{xr||(xr=new TextEncoder),e(xr.encode(t))})}const lc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Fs=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<lc.length;n++)Fs[lc.charCodeAt(n)]=n;const zd=n=>{let e=n.length*.75,t=n.length,i,s=0,a,r,o,l;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const c=new ArrayBuffer(e),h=new Uint8Array(c);for(i=0;i<t;i+=4)a=Fs[n.charCodeAt(i)],r=Fs[n.charCodeAt(i+1)],o=Fs[n.charCodeAt(i+2)],l=Fs[n.charCodeAt(i+3)],h[s++]=a<<2|r>>4,h[s++]=(r&15)<<4|o>>2,h[s++]=(o&3)<<6|l&63;return c},Vd=typeof ArrayBuffer=="function",xl=(n,e)=>{if(typeof n!="string")return{type:"message",data:wh(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:Hd(n.substring(1),e)}:Ia[t]?n.length>1?{type:Ia[t],data:n.substring(1)}:{type:Ia[t]}:ho},Hd=(n,e)=>{if(Vd){const t=zd(n);return wh(t,e)}else return{base64:!0,data:n}},wh=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},Ah="",Wd=(n,e)=>{const t=n.length,i=new Array(t);let s=0;n.forEach((a,r)=>{yl(a,!1,o=>{i[r]=o,++s===t&&e(i.join(Ah))})})},Gd=(n,e)=>{const t=n.split(Ah),i=[];for(let s=0;s<t.length;s++){const a=xl(t[s],e);if(i.push(a),a.type==="error")break}return i};function Xd(){return new TransformStream({transform(n,e){Od(n,t=>{const i=t.length;let s;if(i<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,i);else if(i<65536){s=new Uint8Array(3);const a=new DataView(s.buffer);a.setUint8(0,126),a.setUint16(1,i)}else{s=new Uint8Array(9);const a=new DataView(s.buffer);a.setUint8(0,127),a.setBigUint64(1,BigInt(i))}n.data&&typeof n.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(t)})}})}let vr;function ta(n){return n.reduce((e,t)=>e+t.length,0)}function ia(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let i=0;for(let s=0;s<e;s++)t[s]=n[0][i++],i===n[0].length&&(n.shift(),i=0);return n.length&&i<n[0].length&&(n[0]=n[0].slice(i)),t}function qd(n,e){vr||(vr=new TextDecoder);const t=[];let i=0,s=-1,a=!1;return new TransformStream({transform(r,o){for(t.push(r);;){if(i===0){if(ta(t)<1)break;const l=ia(t,1);a=(l[0]&128)===128,s=l[0]&127,s<126?i=3:s===126?i=1:i=2}else if(i===1){if(ta(t)<2)break;const l=ia(t,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),i=3}else if(i===2){if(ta(t)<8)break;const l=ia(t,8),c=new DataView(l.buffer,l.byteOffset,l.length),h=c.getUint32(0);if(h>Math.pow(2,21)-1){o.enqueue(ho);break}s=h*Math.pow(2,32)+c.getUint32(4),i=3}else{if(ta(t)<s)break;const l=ia(t,s);o.enqueue(xl(a?l:vr.decode(l),e)),i=0}if(s===0||s>n){o.enqueue(ho);break}}}})}const Rh=4;function Pt(n){if(n)return $d(n)}function $d(n){for(var e in Pt.prototype)n[e]=Pt.prototype[e];return n}Pt.prototype.on=Pt.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};Pt.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};Pt.prototype.off=Pt.prototype.removeListener=Pt.prototype.removeAllListeners=Pt.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var i,s=0;s<t.length;s++)if(i=t[s],i===e||i.fn===e){t.splice(s,1);break}return t.length===0&&delete this._callbacks["$"+n],this};Pt.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,s=t.length;i<s;++i)t[i].apply(this,e)}return this};Pt.prototype.emitReserved=Pt.prototype.emit;Pt.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};Pt.prototype.hasListeners=function(n){return!!this.listeners(n).length};const ar=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),di=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Yd="arraybuffer";function Ch(n,...e){return e.reduce((t,i)=>(n.hasOwnProperty(i)&&(t[i]=n[i]),t),{})}const Kd=di.setTimeout,jd=di.clearTimeout;function rr(n,e){e.useNativeTimers?(n.setTimeoutFn=Kd.bind(di),n.clearTimeoutFn=jd.bind(di)):(n.setTimeoutFn=di.setTimeout.bind(di),n.clearTimeoutFn=di.clearTimeout.bind(di))}const Zd=1.33;function Jd(n){return typeof n=="string"?Qd(n):Math.ceil((n.byteLength||n.size)*Zd)}function Qd(n){let e=0,t=0;for(let i=0,s=n.length;i<s;i++)e=n.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function Ph(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function eu(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function tu(n){let e={},t=n.split("&");for(let i=0,s=t.length;i<s;i++){let a=t[i].split("=");e[decodeURIComponent(a[0])]=decodeURIComponent(a[1])}return e}class iu extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class vl extends Pt{constructor(e){super(),this.writable=!1,rr(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new iu(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=xl(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=eu(e);return t.length?"?"+t:""}}class nu extends vl{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};Gd(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Wd(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=Ph()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let Ih=!1;try{Ih=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const su=Ih;function au(){}class ru extends nu{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(s,a)=>{this.onError("xhr post error",s,a)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class Ni extends Pt{constructor(e,t,i){super(),this.createRequest=e,rr(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=Ch(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&i.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var s;i.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=Ni.requestsCount++,Ni.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=au,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ni.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Ni.requestsCount=0;Ni.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",cc);else if(typeof addEventListener=="function"){const n="onpagehide"in di?"pagehide":"unload";addEventListener(n,cc,!1)}}function cc(){for(let n in Ni.requests)Ni.requests.hasOwnProperty(n)&&Ni.requests[n].abort()}const ou=function(){const n=Lh({xdomain:!1});return n&&n.responseType!==null}();class lu extends ru{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=ou&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Ni(Lh,this.uri(),e)}}function Lh(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||su))return new XMLHttpRequest}catch{}if(!e)try{return new di[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Dh=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class cu extends vl{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=Dh?{}:Ch(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;yl(i,this.supportsBinary,a=>{try{this.doWrite(i,a)}catch{}s&&ar(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=Ph()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const _r=di.WebSocket||di.MozWebSocket;class hu extends cu{createSocket(e,t,i){return Dh?new _r(e,t,i):t?new _r(e,t):new _r(e)}doWrite(e,t){this.ws.send(t)}}class du extends vl{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=qd(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),s=Xd();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const a=()=>{i.read().then(({done:o,value:l})=>{o||(this.onPacket(l),a())}).catch(o=>{})};a();const r={type:"open"};this.query.sid&&(r.data=`{"sid":"${this.query.sid}"}`),this._writer.write(r).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;this._writer.write(i).then(()=>{s&&ar(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const uu={websocket:hu,webtransport:du,polling:lu},fu=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,pu=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function uo(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),i=n.indexOf("]");t!=-1&&i!=-1&&(n=n.substring(0,t)+n.substring(t,i).replace(/:/g,";")+n.substring(i,n.length));let s=fu.exec(n||""),a={},r=14;for(;r--;)a[pu[r]]=s[r]||"";return t!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a.pathNames=mu(a,a.path),a.queryKey=gu(a,a.query),a}function mu(n,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function gu(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,s,a){s&&(t[s]=a)}),t}const fo=typeof addEventListener=="function"&&typeof removeEventListener=="function",La=[];fo&&addEventListener("offline",()=>{La.forEach(n=>n())},!1);class Sn extends Pt{constructor(e,t){if(super(),this.binaryType=Yd,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=uo(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=uo(t.host).host);rr(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const s=i.prototype.name;this.transports.push(s),this._transportsByName[s]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=tu(this.opts.query)),fo&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},La.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=Rh,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&Sn.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",Sn.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const s=this.writeBuffer[i].data;if(s&&(t+=Jd(s)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,ar(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,s){if(typeof t=="function"&&(s=t,t=void 0),typeof i=="function"&&(s=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const a={type:e,data:t,options:i};this.emitReserved("packetCreate",a),this.writeBuffer.push(a),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(Sn.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),fo&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=La.indexOf(this._offlineEventListener);i!==-1&&La.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}Sn.protocol=Rh;class yu extends Sn{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;Sn.priorWebsocketSuccess=!1;const s=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",u=>{if(!i)if(u.type==="pong"&&u.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;Sn.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(h(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const d=new Error("probe error");d.transport=t.name,this.emitReserved("upgradeError",d)}}))};function a(){i||(i=!0,h(),t.close(),t=null)}const r=u=>{const d=new Error("probe error: "+u);d.transport=t.name,a(),this.emitReserved("upgradeError",d)};function o(){r("transport closed")}function l(){r("socket closed")}function c(u){t&&u.name!==t.name&&a()}const h=()=>{t.removeListener("open",s),t.removeListener("error",r),t.removeListener("close",o),this.off("close",l),this.off("upgrading",c)};t.once("open",s),t.once("error",r),t.once("close",o),this.once("close",l),this.once("upgrading",c),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let xu=class extends yu{constructor(e,t={}){const i=typeof e=="object",s=i?{...e}:{...t};(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(a=>uu[a]).filter(a=>!!a)),super(i?s:e,s)}};function vu(n,e="",t){let i=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),i=uo(n)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const a=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+a+":"+i.port+e,i.href=i.protocol+"://"+a+(t&&t.port===i.port?"":":"+i.port),i}const _u=typeof ArrayBuffer=="function",Su=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,Nh=Object.prototype.toString,Mu=typeof Blob=="function"||typeof Blob<"u"&&Nh.call(Blob)==="[object BlobConstructor]",bu=typeof File=="function"||typeof File<"u"&&Nh.call(File)==="[object FileConstructor]";function _l(n){return _u&&(n instanceof ArrayBuffer||Su(n))||Mu&&n instanceof Blob||bu&&n instanceof File}function Da(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,i=n.length;t<i;t++)if(Da(n[t]))return!0;return!1}if(_l(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return Da(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&Da(n[t]))return!0;return!1}function Eu(n){const e=[],t=n.data,i=n;return i.data=Na(t,e),i.attachments=e.length,{packet:i,buffers:e}}function Na(n,e,t){if(!n)return n;if(_l(n)){const i={_placeholder:!0,num:e.length};return e.push(n),i}else if(Array.isArray(n)){const i=new Array(n.length);for(let s=0;s<n.length;s++)i[s]=Na(n[s],e);return i}else if(typeof n=="object"&&!(n instanceof Date)){if(n.toJSON&&typeof n.toJSON=="function"&&!t)return Na(n.toJSON(),e,!0);const i={};for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&(i[s]=Na(n[s],e));return i}return n}function Tu(n,e){return n.data=po(n.data,e),delete n.attachments,n}function po(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=po(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=po(n[t],e));return n}const wu=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var Ke;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(Ke||(Ke={}));class Au{constructor(e){this.replacer=e}encode(e){return(e.type===Ke.EVENT||e.type===Ke.ACK)&&Da(e)?this.encodeAsBinary({type:e.type===Ke.EVENT?Ke.BINARY_EVENT:Ke.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===Ke.BINARY_EVENT||e.type===Ke.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=Eu(e),i=this.encodeAsString(t.packet),s=t.buffers;return s.unshift(i),s}}class Sl extends Pt{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===Ke.BINARY_EVENT;i||t.type===Ke.BINARY_ACK?(t.type=i?Ke.EVENT:Ke.ACK,this.reconstructor=new Ru(t)):super.emitReserved("decoded",t)}else if(_l(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if(Ke[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===Ke.BINARY_EVENT||i.type===Ke.BINARY_ACK){const a=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const r=e.substring(a,t);if(r!=Number(r)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const o=Number(r);if(!Cu(o)||o<1)throw new Error("Illegal attachments");if(o>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=o}if(e.charAt(t+1)==="/"){const a=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(a,t)}else i.nsp="/";const s=e.charAt(t+1);if(s!==""&&Number(s)==s){const a=t+1;for(;++t;){const r=e.charAt(t);if(r==null||Number(r)!=r){--t;break}if(t===e.length)break}i.id=Number(e.substring(a,t+1))}if(e.charAt(++t)){const a=this.tryParse(e.substr(t));if(Sl.isPayloadValid(i.type,a))i.data=a;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case Ke.CONNECT:return hc(t);case Ke.DISCONNECT:return t===void 0;case Ke.CONNECT_ERROR:return typeof t=="string"||hc(t);case Ke.EVENT:case Ke.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&wu.indexOf(t[0])===-1);case Ke.ACK:case Ke.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Ru{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=Tu(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const Cu=Number.isInteger||function(n){return typeof n=="number"&&isFinite(n)&&Math.floor(n)===n};function hc(n){return Object.prototype.toString.call(n)==="[object Object]"}const Pu=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Sl,Encoder:Au,get PacketType(){return Ke}},Symbol.toStringTag,{value:"Module"}));function xi(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const Iu=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class kh extends Pt{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[xi(e,"open",this.onopen.bind(this)),xi(e,"packet",this.onpacket.bind(this)),xi(e,"error",this.onerror.bind(this)),xi(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,s,a;if(Iu.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const r={type:Ke.EVENT,data:t};if(r.options={},r.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const h=this.ids++,u=t.pop();this._registerAckCallback(h,u),r.id=h}const o=(s=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||s===void 0?void 0:s.writable,l=this.connected&&!(!((a=this.io.engine)===null||a===void 0)&&a._hasPingExpired());return this.flags.volatile&&!o||(l?(this.notifyOutgoingListeners(r),this.packet(r)):this.sendBuffer.push(r)),this.flags={},this}_registerAckCallback(e,t){var i;const s=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(s===void 0){this.acks[e]=t;return}const a=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let o=0;o<this.sendBuffer.length;o++)this.sendBuffer[o].id===e&&this.sendBuffer.splice(o,1);t.call(this,new Error("operation has timed out"))},s),r=(...o)=>{this.io.clearTimeoutFn(a),t.apply(this,o)};r.withError=!0,this.acks[e]=r}emitWithAck(e,...t){return new Promise((i,s)=>{const a=(r,o)=>r?s(r):i(o);a.withError=!0,t.push(a),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...a)=>(this._queue[0],s!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(s)):(this._queue.shift(),t&&t(null,...a)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:Ke.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case Ke.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case Ke.EVENT:case Ke.BINARY_EVENT:this.onevent(e);break;case Ke.ACK:case Ke.BINARY_ACK:this.onack(e);break;case Ke.DISCONNECT:this.ondisconnect();break;case Ke.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...s){i||(i=!0,t.packet({type:Ke.ACK,id:e,data:s}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:Ke.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function Ts(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}Ts.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};Ts.prototype.reset=function(){this.attempts=0};Ts.prototype.setMin=function(n){this.ms=n};Ts.prototype.setMax=function(n){this.max=n};Ts.prototype.setJitter=function(n){this.jitter=n};class mo extends Pt{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,rr(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new Ts({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const s=t.parser||Pu;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new xu(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const s=xi(t,"open",function(){i.onopen(),e&&e()}),a=o=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",o),e?e(o):this.maybeReconnectOnOpen()},r=xi(t,"error",a);if(this._timeout!==!1){const o=this._timeout,l=this.setTimeoutFn(()=>{s(),a(new Error("timeout")),t.close()},o);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(s),this.subs.push(r),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(xi(e,"ping",this.onping.bind(this)),xi(e,"data",this.ondata.bind(this)),xi(e,"error",this.onerror.bind(this)),xi(e,"close",this.onclose.bind(this)),xi(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){ar(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new kh(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Cs={};function ka(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=vu(n,e.path||"/socket.io"),i=t.source,s=t.id,a=t.path,r=Cs[s]&&a in Cs[s].nsps,o=e.forceNew||e["force new connection"]||e.multiplex===!1||r;let l;return o?l=new mo(i,e):(Cs[s]||(Cs[s]=new mo(i,e)),l=Cs[s]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(ka,{Manager:mo,Socket:kh,io:ka,connect:ka});/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ml="184",Lu=0,dc=1,Du=2,Ua=1,Nu=2,Os=3,bn=0,ii=1,ji=2,Qi=0,ps=1,go=2,uc=3,fc=4,ku=5,kn=100,Uu=101,Bu=102,Fu=103,Ou=104,zu=200,Vu=201,Hu=202,Wu=203,yo=204,xo=205,Gu=206,Xu=207,qu=208,$u=209,Yu=210,Ku=211,ju=212,Zu=213,Ju=214,vo=0,_o=1,So=2,ys=3,Mo=4,bo=5,Eo=6,To=7,Uh=0,Qu=1,ef=2,ki=0,Bh=1,Fh=2,Oh=3,zh=4,Vh=5,Hh=6,Wh=7,Gh=300,Gn=301,xs=302,Sr=303,Mr=304,or=306,wo=1e3,Zi=1001,Ao=1002,Vt=1003,tf=1004,na=1005,$t=1006,br=1007,Bn=1008,oi=1009,Xh=1010,qh=1011,qs=1012,bl=1013,Oi=1014,Li=1015,tn=1016,El=1017,Tl=1018,$s=1020,$h=35902,Yh=35899,Kh=1021,jh=1022,bi=1023,nn=1026,Fn=1027,Zh=1028,wl=1029,Xn=1030,Al=1031,Rl=1033,Ba=33776,Fa=33777,Oa=33778,za=33779,Ro=35840,Co=35841,Po=35842,Io=35843,Lo=36196,Do=37492,No=37496,ko=37488,Uo=37489,Xa=37490,Bo=37491,Fo=37808,Oo=37809,zo=37810,Vo=37811,Ho=37812,Wo=37813,Go=37814,Xo=37815,qo=37816,$o=37817,Yo=37818,Ko=37819,jo=37820,Zo=37821,Jo=36492,Qo=36494,el=36495,tl=36283,il=36284,qa=36285,nl=36286,nf=3200,sl=0,sf=1,pn="",hi="srgb",$a="srgb-linear",Ya="linear",ot="srgb",jn=7680,pc=519,af=512,rf=513,of=514,Cl=515,lf=516,cf=517,Pl=518,hf=519,mc=35044,gc="300 es",Di=2e3,Ys=2001;function df(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Ka(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function uf(){const n=Ka("canvas");return n.style.display="block",n}const yc={};function xc(...n){const e="THREE."+n.shift();console.log(e,...n)}function Jh(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ne(...n){n=Jh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Qe(...n){n=Jh(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function al(...n){const e=n.join(" ");e in yc||(yc[e]=!0,Ne(...n))}function ff(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}const pf={[vo]:_o,[So]:Eo,[Mo]:To,[ys]:bo,[_o]:vo,[Eo]:So,[To]:Mo,[bo]:ys};class $n{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const Gt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Er=Math.PI/180,rl=180/Math.PI;function Zs(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Gt[n&255]+Gt[n>>8&255]+Gt[n>>16&255]+Gt[n>>24&255]+"-"+Gt[e&255]+Gt[e>>8&255]+"-"+Gt[e>>16&15|64]+Gt[e>>24&255]+"-"+Gt[t&63|128]+Gt[t>>8&255]+"-"+Gt[t>>16&255]+Gt[t>>24&255]+Gt[i&255]+Gt[i>>8&255]+Gt[i>>16&255]+Gt[i>>24&255]).toLowerCase()}function Ze(n,e,t){return Math.max(e,Math.min(t,n))}function mf(n,e){return(n%e+e)%e}function Tr(n,e,t){return(1-t)*n+t*e}function Ps(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ei(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const $l=class $l{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};$l.prototype.isVector2=!0;let nt=$l;class ws{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],d=a[r+0],f=a[r+1],p=a[r+2],v=a[r+3];if(u!==v||l!==d||c!==f||h!==p){let g=l*d+c*f+h*p+u*v;g<0&&(d=-d,f=-f,p=-p,v=-v,g=-g);let m=1-o;if(g<.9995){const M=Math.acos(g),_=Math.sin(M);m=Math.sin(m*M)/_,o=Math.sin(o*M)/_,l=l*m+d*o,c=c*m+f*o,h=h*m+p*o,u=u*m+v*o}else{l=l*m+d*o,c=c*m+f*o,h=h*m+p*o,u=u*m+v*o;const M=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=M,c*=M,h*=M,u*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,a,r){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=a[r],d=a[r+1],f=a[r+2],p=a[r+3];return e[t]=o*p+h*u+l*f-c*d,e[t+1]=l*p+h*d+c*u-o*f,e[t+2]=c*p+h*f+o*d-l*u,e[t+3]=h*p-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(a/2),d=l(i/2),f=l(s/2),p=l(a/2);switch(r){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:Ne("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=i+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(a-c)*f,this._z=(r-s)*f}else if(i>o&&i>u){const f=2*Math.sqrt(1+i-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+r)/f,this._z=(a+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-i-u);this._w=(a-c)/f,this._x=(s+r)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-i-o);this._w=(r-s)/f,this._x=(a+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ze(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+r*o+s*c-a*l,this._y=s*h+r*l+a*o-i*c,this._z=a*h+r*c+i*l-s*o,this._w=r*h-i*o-s*l-a*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+a*t,this._w=this._w*l+r*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+a*t,this._w=this._w*l+r*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Yl=class Yl{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(vc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(vc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,o=e.z,l=e.w,c=2*(r*s-o*i),h=2*(o*t-a*s),u=2*(a*i-r*t);return this.x=t+l*c+r*u-o*h,this.y=i+l*h+o*c-a*u,this.z=s+l*u+a*h-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,o=t.y,l=t.z;return this.x=s*l-a*o,this.y=a*r-i*l,this.z=i*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return wr.copy(this).projectOnVector(e),this.sub(wr)}reflect(e){return this.sub(wr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Yl.prototype.isVector3=!0;let V=Yl;const wr=new V,vc=new ws,Kl=class Kl{constructor(e,t,i,s,a,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c)}set(e,t,i,s,a,r,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=a,h[5]=l,h[6]=i,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],p=i[8],v=s[0],g=s[3],m=s[6],M=s[1],_=s[4],x=s[7],y=s[2],E=s[5],A=s[8];return a[0]=r*v+o*M+l*y,a[3]=r*g+o*_+l*E,a[6]=r*m+o*x+l*A,a[1]=c*v+h*M+u*y,a[4]=c*g+h*_+u*E,a[7]=c*m+h*x+u*A,a[2]=d*v+f*M+p*y,a[5]=d*g+f*_+p*E,a[8]=d*m+f*x+p*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*r*h-t*o*c-i*a*h+i*o*l+s*a*c-s*r*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*r-o*c,d=o*l-h*a,f=c*a-r*l,p=t*u+i*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return e[0]=u*v,e[1]=(s*c-h*i)*v,e[2]=(o*i-s*r)*v,e[3]=d*v,e[4]=(h*t-s*l)*v,e[5]=(s*a-o*t)*v,e[6]=f*v,e[7]=(i*l-c*t)*v,e[8]=(r*t-i*a)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,o){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+e,-s*c,s*l,-s*(-c*r+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ar.makeScale(e,t)),this}rotate(e){return this.premultiply(Ar.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ar.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Kl.prototype.isMatrix3=!0;let Ue=Kl;const Ar=new Ue,_c=new Ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Sc=new Ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gf(){const n={enabled:!0,workingColorSpace:$a,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===ot&&(s.r=en(s.r),s.g=en(s.g),s.b=en(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===ot&&(s.r=ms(s.r),s.g=ms(s.g),s.b=ms(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===pn?Ya:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return al("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return al("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[$a]:{primaries:e,whitePoint:i,transfer:Ya,toXYZ:_c,fromXYZ:Sc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:hi},outputColorSpaceConfig:{drawingBufferColorSpace:hi}},[hi]:{primaries:e,whitePoint:i,transfer:ot,toXYZ:_c,fromXYZ:Sc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:hi}}}),n}const je=gf();function en(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ms(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Zn;class yf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Zn===void 0&&(Zn=Ka("canvas")),Zn.width=e.width,Zn.height=e.height;const s=Zn.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Zn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ka("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=en(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(en(t[i]/255)*255):t[i]=en(t[i]);return{data:t,width:e.width,height:e.height}}else return Ne("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xf=0;class Il{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xf++}),this.uuid=Zs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Rr(s[r].image)):a.push(Rr(s[r]))}else a=Rr(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function Rr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?yf.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ne("Texture: Unable to serialize Texture."),{})}let vf=0;const Cr=new V;class Jt extends $n{constructor(e=Jt.DEFAULT_IMAGE,t=Jt.DEFAULT_MAPPING,i=Zi,s=Zi,a=$t,r=Bn,o=bi,l=oi,c=Jt.DEFAULT_ANISOTROPY,h=pn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:vf++}),this.uuid=Zs(),this.name="",this.source=new Il(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new nt(0,0),this.repeat=new nt(1,1),this.center=new nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Cr).x}get height(){return this.source.getSize(Cr).y}get depth(){return this.source.getSize(Cr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ne(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ne(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Gh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case wo:e.x=e.x-Math.floor(e.x);break;case Zi:e.x=e.x<0?0:1;break;case Ao:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case wo:e.y=e.y-Math.floor(e.y);break;case Zi:e.y=e.y<0?0:1;break;case Ao:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Jt.DEFAULT_IMAGE=null;Jt.DEFAULT_MAPPING=Gh;Jt.DEFAULT_ANISOTROPY=1;const jl=class jl{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],v=l[2],g=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(c+1)/2,x=(f+1)/2,y=(m+1)/2,E=(h+d)/4,A=(u+v)/4,S=(p+g)/4;return _>x&&_>y?_<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(_),s=E/i,a=A/i):x>y?x<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(x),i=E/s,a=S/s):y<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(y),i=A/a,s=S/a),this.set(i,s,a,t),this}let M=Math.sqrt((g-p)*(g-p)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(g-p)/M,this.y=(u-v)/M,this.z=(d-h)/M,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this.w=Ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this.w=Ze(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};jl.prototype.isVector4=!0;let Mt=jl;class _f extends $n{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$t,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Mt(0,0,e,t),this.scissorTest=!1,this.viewport=new Mt(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},a=new Jt(s),r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:$t,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Il(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ui extends _f{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Qh extends Jt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=Zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Sf extends Jt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=Zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const sr=class sr{constructor(e,t,i,s,a,r,o,l,c,h,u,d,f,p,v,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c,h,u,d,f,p,v,g)}set(e,t,i,s,a,r,o,l,c,h,u,d,f,p,v,g){const m=this.elements;return m[0]=e,m[4]=t,m[8]=i,m[12]=s,m[1]=a,m[5]=r,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=p,m[11]=v,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new sr().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Jn.setFromMatrixColumn(e,0).length(),a=1/Jn.setFromMatrixColumn(e,1).length(),r=1/Jn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),u=Math.sin(a);if(e.order==="XYZ"){const d=r*h,f=r*u,p=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+p*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=p+f*c,t[10]=r*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,p=c*h,v=c*u;t[0]=d+v*o,t[4]=p*o-f,t[8]=r*c,t[1]=r*u,t[5]=r*h,t[9]=-o,t[2]=f*o-p,t[6]=v+d*o,t[10]=r*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,p=c*h,v=c*u;t[0]=d-v*o,t[4]=-r*u,t[8]=p+f*o,t[1]=f+p*o,t[5]=r*h,t[9]=v-d*o,t[2]=-r*c,t[6]=o,t[10]=r*l}else if(e.order==="ZYX"){const d=r*h,f=r*u,p=o*h,v=o*u;t[0]=l*h,t[4]=p*c-f,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=f*c-p,t[2]=-c,t[6]=o*l,t[10]=r*l}else if(e.order==="YZX"){const d=r*l,f=r*c,p=o*l,v=o*c;t[0]=l*h,t[4]=v-d*u,t[8]=p*u+f,t[1]=u,t[5]=r*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+p,t[10]=d-v*u}else if(e.order==="XZY"){const d=r*l,f=r*c,p=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=r*h,t[9]=f*u-p,t[2]=p*u-f,t[6]=o*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Mf,e,bf)}lookAt(e,t,i){const s=this.elements;return ai.subVectors(e,t),ai.lengthSq()===0&&(ai.z=1),ai.normalize(),on.crossVectors(i,ai),on.lengthSq()===0&&(Math.abs(i.z)===1?ai.x+=1e-4:ai.z+=1e-4,ai.normalize(),on.crossVectors(i,ai)),on.normalize(),sa.crossVectors(ai,on),s[0]=on.x,s[4]=sa.x,s[8]=ai.x,s[1]=on.y,s[5]=sa.y,s[9]=ai.y,s[2]=on.z,s[6]=sa.z,s[10]=ai.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],p=i[2],v=i[6],g=i[10],m=i[14],M=i[3],_=i[7],x=i[11],y=i[15],E=s[0],A=s[4],S=s[8],w=s[12],P=s[1],C=s[5],L=s[9],z=s[13],U=s[2],I=s[6],B=s[10],N=s[14],j=s[3],te=s[7],se=s[11],ue=s[15];return a[0]=r*E+o*P+l*U+c*j,a[4]=r*A+o*C+l*I+c*te,a[8]=r*S+o*L+l*B+c*se,a[12]=r*w+o*z+l*N+c*ue,a[1]=h*E+u*P+d*U+f*j,a[5]=h*A+u*C+d*I+f*te,a[9]=h*S+u*L+d*B+f*se,a[13]=h*w+u*z+d*N+f*ue,a[2]=p*E+v*P+g*U+m*j,a[6]=p*A+v*C+g*I+m*te,a[10]=p*S+v*L+g*B+m*se,a[14]=p*w+v*z+g*N+m*ue,a[3]=M*E+_*P+x*U+y*j,a[7]=M*A+_*C+x*I+y*te,a[11]=M*S+_*L+x*B+y*se,a[15]=M*w+_*z+x*N+y*ue,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],p=e[3],v=e[7],g=e[11],m=e[15],M=l*f-c*d,_=o*f-c*u,x=o*d-l*u,y=r*f-c*h,E=r*d-l*h,A=r*u-o*h;return t*(v*M-g*_+m*x)-i*(p*M-g*y+m*E)+s*(p*_-v*y+m*A)-a*(p*x-v*E+g*A)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],p=e[12],v=e[13],g=e[14],m=e[15],M=t*o-i*r,_=t*l-s*r,x=t*c-a*r,y=i*l-s*o,E=i*c-a*o,A=s*c-a*l,S=h*v-u*p,w=h*g-d*p,P=h*m-f*p,C=u*g-d*v,L=u*m-f*v,z=d*m-f*g,U=M*z-_*L+x*C+y*P-E*w+A*S;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/U;return e[0]=(o*z-l*L+c*C)*I,e[1]=(s*L-i*z-a*C)*I,e[2]=(v*A-g*E+m*y)*I,e[3]=(d*E-u*A-f*y)*I,e[4]=(l*P-r*z-c*w)*I,e[5]=(t*z-s*P+a*w)*I,e[6]=(g*x-p*A-m*_)*I,e[7]=(h*A-d*x+f*_)*I,e[8]=(r*L-o*P+c*S)*I,e[9]=(i*P-t*L-a*S)*I,e[10]=(p*E-v*x+m*M)*I,e[11]=(u*x-h*E-f*M)*I,e[12]=(o*w-r*C-l*S)*I,e[13]=(t*C-i*w+s*S)*I,e[14]=(v*_-p*y-g*M)*I,e[15]=(h*y-u*_+d*M)*I,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,o=e.y,l=e.z,c=a*r,h=a*o;return this.set(c*r+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*r,0,c*l-s*o,h*l+s*r,a*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,o=t._z,l=t._w,c=a+a,h=r+r,u=o+o,d=a*c,f=a*h,p=a*u,v=r*h,g=r*u,m=o*u,M=l*c,_=l*h,x=l*u,y=i.x,E=i.y,A=i.z;return s[0]=(1-(v+m))*y,s[1]=(f+x)*y,s[2]=(p-_)*y,s[3]=0,s[4]=(f-x)*E,s[5]=(1-(d+m))*E,s[6]=(g+M)*E,s[7]=0,s[8]=(p+_)*A,s[9]=(g-M)*A,s[10]=(1-(d+v))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const a=this.determinant();if(a===0)return i.set(1,1,1),t.identity(),this;let r=Jn.set(s[0],s[1],s[2]).length();const o=Jn.set(s[4],s[5],s[6]).length(),l=Jn.set(s[8],s[9],s[10]).length();a<0&&(r=-r),fi.copy(this);const c=1/r,h=1/o,u=1/l;return fi.elements[0]*=c,fi.elements[1]*=c,fi.elements[2]*=c,fi.elements[4]*=h,fi.elements[5]*=h,fi.elements[6]*=h,fi.elements[8]*=u,fi.elements[9]*=u,fi.elements[10]*=u,t.setFromRotationMatrix(fi),i.x=r,i.y=o,i.z=l,this}makePerspective(e,t,i,s,a,r,o=Di,l=!1){const c=this.elements,h=2*a/(t-e),u=2*a/(i-s),d=(t+e)/(t-e),f=(i+s)/(i-s);let p,v;if(l)p=a/(r-a),v=r*a/(r-a);else if(o===Di)p=-(r+a)/(r-a),v=-2*r*a/(r-a);else if(o===Ys)p=-r/(r-a),v=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,a,r,o=Di,l=!1){const c=this.elements,h=2/(t-e),u=2/(i-s),d=-(t+e)/(t-e),f=-(i+s)/(i-s);let p,v;if(l)p=1/(r-a),v=r/(r-a);else if(o===Di)p=-2/(r-a),v=-(r+a)/(r-a);else if(o===Ys)p=-1/(r-a),v=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};sr.prototype.isMatrix4=!0;let Rt=sr;const Jn=new V,fi=new Rt,Mf=new V(0,0,0),bf=new V(1,1,1),on=new V,sa=new V,ai=new V,Mc=new Rt,bc=new ws;class En{constructor(e=0,t=0,i=0,s=En.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-Ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(Ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ze(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ne("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Mc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Mc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return bc.setFromEuler(this),this.setFromQuaternion(bc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}En.DEFAULT_ORDER="XYZ";class ed{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Ef=0;const Ec=new V,Qn=new ws,Hi=new Rt,aa=new V,Is=new V,Tf=new V,wf=new ws,Tc=new V(1,0,0),wc=new V(0,1,0),Ac=new V(0,0,1),Rc={type:"added"},Af={type:"removed"},es={type:"childadded",child:null},Pr={type:"childremoved",child:null};class Yt extends $n{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=Zs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Yt.DEFAULT_UP.clone();const e=new V,t=new En,i=new ws,s=new V(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Rt},normalMatrix:{value:new Ue}}),this.matrix=new Rt,this.matrixWorld=new Rt,this.matrixAutoUpdate=Yt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ed,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Qn.setFromAxisAngle(e,t),this.quaternion.multiply(Qn),this}rotateOnWorldAxis(e,t){return Qn.setFromAxisAngle(e,t),this.quaternion.premultiply(Qn),this}rotateX(e){return this.rotateOnAxis(Tc,e)}rotateY(e){return this.rotateOnAxis(wc,e)}rotateZ(e){return this.rotateOnAxis(Ac,e)}translateOnAxis(e,t){return Ec.copy(e).applyQuaternion(this.quaternion),this.position.add(Ec.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Tc,e)}translateY(e){return this.translateOnAxis(wc,e)}translateZ(e){return this.translateOnAxis(Ac,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Hi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?aa.copy(e):aa.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Is.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hi.lookAt(Is,aa,this.up):Hi.lookAt(aa,Is,this.up),this.quaternion.setFromRotationMatrix(Hi),s&&(Hi.extractRotation(s.matrixWorld),Qn.setFromRotationMatrix(Hi),this.quaternion.premultiply(Qn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Qe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Rc),es.child=e,this.dispatchEvent(es),es.child=null):Qe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Af),Pr.child=e,this.dispatchEvent(Pr),Pr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Hi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Hi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Hi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Rc),es.child=e,this.dispatchEvent(es),es.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Is,e,Tf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Is,wf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,a=this.matrix.elements;a[12]+=t-a[0]*t-a[4]*i-a[8]*s,a[13]+=i-a[1]*t-a[5]*i-a[9]*s,a[14]+=s-a[2]*t-a[6]*i-a[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];a(e.shapes,u)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(a(e.animations,l))}}if(t){const o=r(e.geometries),l=r(e.materials),c=r(e.textures),h=r(e.images),u=r(e.shapes),d=r(e.skeletons),f=r(e.animations),p=r(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),p.length>0&&(i.nodes=p)}return i.object=s,i;function r(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Yt.DEFAULT_UP=new V(0,1,0);Yt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class On extends Yt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Rf={type:"move"};class Ir{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new On,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new On,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new On,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){r=!0;for(const v of e.hand.values()){const g=t.getJointPose(v,i),m=this._getHandJoint(c,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Rf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new On;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const td={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ln={h:0,s:0,l:0},ra={h:0,s:0,l:0};function Lr(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class at{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=hi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=je.workingColorSpace){return this.r=e,this.g=t,this.b=i,je.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=je.workingColorSpace){if(e=mf(e,1),t=Ze(t,0,1),i=Ze(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=Lr(r,a,e+1/3),this.g=Lr(r,a,e),this.b=Lr(r,a,e-1/3)}return je.colorSpaceToWorking(this,s),this}setStyle(e,t=hi){function i(a){a!==void 0&&parseFloat(a)<1&&Ne("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:Ne("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);Ne("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=hi){const i=td[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ne("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=en(e.r),this.g=en(e.g),this.b=en(e.b),this}copyLinearToSRGB(e){return this.r=ms(e.r),this.g=ms(e.g),this.b=ms(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=hi){return je.workingToColorSpace(Xt.copy(this),e),Math.round(Ze(Xt.r*255,0,255))*65536+Math.round(Ze(Xt.g*255,0,255))*256+Math.round(Ze(Xt.b*255,0,255))}getHexString(e=hi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.workingToColorSpace(Xt.copy(this),t);const i=Xt.r,s=Xt.g,a=Xt.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let l,c;const h=(o+r)/2;if(o===r)l=0,c=0;else{const u=r-o;switch(c=h<=.5?u/(r+o):u/(2-r-o),r){case i:l=(s-a)/u+(s<a?6:0);break;case s:l=(a-i)/u+2;break;case a:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=je.workingColorSpace){return je.workingToColorSpace(Xt.copy(this),t),e.r=Xt.r,e.g=Xt.g,e.b=Xt.b,e}getStyle(e=hi){je.workingToColorSpace(Xt.copy(this),e);const t=Xt.r,i=Xt.g,s=Xt.b;return e!==hi?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(ln),this.setHSL(ln.h+e,ln.s+t,ln.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ln),e.getHSL(ra);const i=Tr(ln.h,ra.h,t),s=Tr(ln.s,ra.s,t),a=Tr(ln.l,ra.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xt=new at;at.NAMES=td;class Cf extends Yt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new En,this.environmentIntensity=1,this.environmentRotation=new En,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const pi=new V,Wi=new V,Dr=new V,Gi=new V,ts=new V,is=new V,Cc=new V,Nr=new V,kr=new V,Ur=new V,Br=new Mt,Fr=new Mt,Or=new Mt;class _i{constructor(e=new V,t=new V,i=new V){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),pi.subVectors(e,t),s.cross(pi);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){pi.subVectors(s,t),Wi.subVectors(i,t),Dr.subVectors(e,t);const r=pi.dot(pi),o=pi.dot(Wi),l=pi.dot(Dr),c=Wi.dot(Wi),h=Wi.dot(Dr),u=r*c-o*o;if(u===0)return a.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,p=(r*h-o*l)*d;return a.set(1-f-p,p,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Gi)===null?!1:Gi.x>=0&&Gi.y>=0&&Gi.x+Gi.y<=1}static getInterpolation(e,t,i,s,a,r,o,l){return this.getBarycoord(e,t,i,s,Gi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Gi.x),l.addScaledVector(r,Gi.y),l.addScaledVector(o,Gi.z),l)}static getInterpolatedAttribute(e,t,i,s,a,r){return Br.setScalar(0),Fr.setScalar(0),Or.setScalar(0),Br.fromBufferAttribute(e,t),Fr.fromBufferAttribute(e,i),Or.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(Br,a.x),r.addScaledVector(Fr,a.y),r.addScaledVector(Or,a.z),r}static isFrontFacing(e,t,i,s){return pi.subVectors(i,t),Wi.subVectors(e,t),pi.cross(Wi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return pi.subVectors(this.c,this.b),Wi.subVectors(this.a,this.b),pi.cross(Wi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return _i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return _i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return _i.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return _i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return _i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,o;ts.subVectors(s,i),is.subVectors(a,i),Nr.subVectors(e,i);const l=ts.dot(Nr),c=is.dot(Nr);if(l<=0&&c<=0)return t.copy(i);kr.subVectors(e,s);const h=ts.dot(kr),u=is.dot(kr);if(h>=0&&u<=h)return t.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return r=l/(l-h),t.copy(i).addScaledVector(ts,r);Ur.subVectors(e,a);const f=ts.dot(Ur),p=is.dot(Ur);if(p>=0&&f<=p)return t.copy(a);const v=f*c-l*p;if(v<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(i).addScaledVector(is,o);const g=h*p-f*u;if(g<=0&&u-h>=0&&f-p>=0)return Cc.subVectors(a,s),o=(u-h)/(u-h+(f-p)),t.copy(s).addScaledVector(Cc,o);const m=1/(g+v+d);return r=v*m,o=d*m,t.copy(i).addScaledVector(ts,r).addScaledVector(is,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class qn{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(mi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(mi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=mi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,mi):mi.fromBufferAttribute(a,r),mi.applyMatrix4(e.matrixWorld),this.expandByPoint(mi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),oa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),oa.copy(i.boundingBox)),oa.applyMatrix4(e.matrixWorld),this.union(oa)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,mi),mi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ls),la.subVectors(this.max,Ls),ns.subVectors(e.a,Ls),ss.subVectors(e.b,Ls),as.subVectors(e.c,Ls),cn.subVectors(ss,ns),hn.subVectors(as,ss),An.subVectors(ns,as);let t=[0,-cn.z,cn.y,0,-hn.z,hn.y,0,-An.z,An.y,cn.z,0,-cn.x,hn.z,0,-hn.x,An.z,0,-An.x,-cn.y,cn.x,0,-hn.y,hn.x,0,-An.y,An.x,0];return!zr(t,ns,ss,as,la)||(t=[1,0,0,0,1,0,0,0,1],!zr(t,ns,ss,as,la))?!1:(ca.crossVectors(cn,hn),t=[ca.x,ca.y,ca.z],zr(t,ns,ss,as,la))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,mi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(mi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Xi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Xi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Xi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Xi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Xi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Xi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Xi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Xi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Xi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Xi=[new V,new V,new V,new V,new V,new V,new V,new V],mi=new V,oa=new qn,ns=new V,ss=new V,as=new V,cn=new V,hn=new V,An=new V,Ls=new V,la=new V,ca=new V,Rn=new V;function zr(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){Rn.fromArray(n,a);const o=s.x*Math.abs(Rn.x)+s.y*Math.abs(Rn.y)+s.z*Math.abs(Rn.z),l=e.dot(Rn),c=t.dot(Rn),h=i.dot(Rn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Ct=new V,ha=new nt;let Pf=0;class Bi extends $n{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Pf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=mc,this.updateRanges=[],this.gpuType=Li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)ha.fromBufferAttribute(this,t),ha.applyMatrix3(e),this.setXY(t,ha.x,ha.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ps(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ei(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ps(t,this.array)),t}setX(e,t){return this.normalized&&(t=ei(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ps(t,this.array)),t}setY(e,t){return this.normalized&&(t=ei(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ps(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ei(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ps(t,this.array)),t}setW(e,t){return this.normalized&&(t=ei(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ei(t,this.array),i=ei(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=ei(t,this.array),i=ei(i,this.array),s=ei(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=ei(t,this.array),i=ei(i,this.array),s=ei(s,this.array),a=ei(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==mc&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class id extends Bi{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class nd extends Bi{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Qt extends Bi{constructor(e,t,i){super(new Float32Array(e),t,i)}}const If=new qn,Ds=new V,Vr=new V;class Ll{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):If.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ds.subVectors(e,this.center);const t=Ds.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Ds,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Vr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ds.copy(e.center).add(Vr)),this.expandByPoint(Ds.copy(e.center).sub(Vr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Lf=0;const ci=new Rt,Hr=new Yt,rs=new V,ri=new qn,Ns=new qn,Ot=new V;class Ti extends $n{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Lf++}),this.uuid=Zs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(df(e)?nd:id)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Ue().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ci.makeRotationFromQuaternion(e),this.applyMatrix4(ci),this}rotateX(e){return ci.makeRotationX(e),this.applyMatrix4(ci),this}rotateY(e){return ci.makeRotationY(e),this.applyMatrix4(ci),this}rotateZ(e){return ci.makeRotationZ(e),this.applyMatrix4(ci),this}translate(e,t,i){return ci.makeTranslation(e,t,i),this.applyMatrix4(ci),this}scale(e,t,i){return ci.makeScale(e,t,i),this.applyMatrix4(ci),this}lookAt(e){return Hr.lookAt(e),Hr.updateMatrix(),this.applyMatrix4(Hr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rs).negate(),this.translate(rs.x,rs.y,rs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new Qt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&Ne("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];ri.setFromBufferAttribute(a),this.morphTargetsRelative?(Ot.addVectors(this.boundingBox.min,ri.min),this.boundingBox.expandByPoint(Ot),Ot.addVectors(this.boundingBox.max,ri.max),this.boundingBox.expandByPoint(Ot)):(this.boundingBox.expandByPoint(ri.min),this.boundingBox.expandByPoint(ri.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ll);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){const i=this.boundingSphere.center;if(ri.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];Ns.setFromBufferAttribute(o),this.morphTargetsRelative?(Ot.addVectors(ri.min,Ns.min),ri.expandByPoint(Ot),Ot.addVectors(ri.max,Ns.max),ri.expandByPoint(Ot)):(ri.expandByPoint(Ns.min),ri.expandByPoint(Ns.max))}ri.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)Ot.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(Ot));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ot.fromBufferAttribute(o,c),l&&(rs.fromBufferAttribute(e,c),Ot.add(rs)),s=Math.max(s,i.distanceToSquared(Ot))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bi(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],l=[];for(let S=0;S<i.count;S++)o[S]=new V,l[S]=new V;const c=new V,h=new V,u=new V,d=new nt,f=new nt,p=new nt,v=new V,g=new V;function m(S,w,P){c.fromBufferAttribute(i,S),h.fromBufferAttribute(i,w),u.fromBufferAttribute(i,P),d.fromBufferAttribute(a,S),f.fromBufferAttribute(a,w),p.fromBufferAttribute(a,P),h.sub(c),u.sub(c),f.sub(d),p.sub(d);const C=1/(f.x*p.y-p.x*f.y);isFinite(C)&&(v.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(C),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(C),o[S].add(v),o[w].add(v),o[P].add(v),l[S].add(g),l[w].add(g),l[P].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let S=0,w=M.length;S<w;++S){const P=M[S],C=P.start,L=P.count;for(let z=C,U=C+L;z<U;z+=3)m(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const _=new V,x=new V,y=new V,E=new V;function A(S){y.fromBufferAttribute(s,S),E.copy(y);const w=o[S];_.copy(w),_.sub(y.multiplyScalar(y.dot(w))).normalize(),x.crossVectors(E,w);const C=x.dot(l[S])<0?-1:1;r.setXYZW(S,_.x,_.y,_.z,C)}for(let S=0,w=M.length;S<w;++S){const P=M[S],C=P.start,L=P.count;for(let z=C,U=C+L;z<U;z+=3)A(e.getX(z+0)),A(e.getX(z+1)),A(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Bi(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new V,a=new V,r=new V,o=new V,l=new V,c=new V,h=new V,u=new V;if(e)for(let d=0,f=e.count;d<f;d+=3){const p=e.getX(d+0),v=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,p),a.fromBufferAttribute(t,v),r.fromBufferAttribute(t,g),h.subVectors(r,a),u.subVectors(s,a),h.cross(u),o.fromBufferAttribute(i,p),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,g),o.add(h),l.add(h),c.add(h),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),a.fromBufferAttribute(t,d+1),r.fromBufferAttribute(t,d+2),h.subVectors(r,a),u.subVectors(s,a),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ot.fromBufferAttribute(e,t),Ot.normalize(),e.setXYZ(t,Ot.x,Ot.y,Ot.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,p=0;for(let v=0,g=l.length;v<g;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*h;for(let m=0;m<h;m++)d[p++]=c[f++]}return new Bi(d,h,u)}if(this.index===null)return Ne("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ti,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const a=e.morphAttributes;for(const c in a){const h=[],u=a[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let c=0,h=r.length;c<h;c++){const u=r[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let Df=0;class Js extends $n{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Df++}),this.uuid=Zs(),this.name="",this.type="Material",this.blending=ps,this.side=bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=yo,this.blendDst=xo,this.blendEquation=kn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new at(0,0,0),this.blendAlpha=0,this.depthFunc=ys,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jn,this.stencilZFail=jn,this.stencilZPass=jn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ne(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ne(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ps&&(i.blending=this.blending),this.side!==bn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==yo&&(i.blendSrc=this.blendSrc),this.blendDst!==xo&&(i.blendDst=this.blendDst),this.blendEquation!==kn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ys&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==pc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==jn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==jn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==jn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const qi=new V,Wr=new V,da=new V,dn=new V,Gr=new V,ua=new V,Xr=new V;class Nf{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=qi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qi.copy(this.origin).addScaledVector(this.direction,t),qi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Wr.copy(e).add(t).multiplyScalar(.5),da.copy(t).sub(e).normalize(),dn.copy(this.origin).sub(Wr);const a=e.distanceTo(t)*.5,r=-this.direction.dot(da),o=dn.dot(this.direction),l=-dn.dot(da),c=dn.lengthSq(),h=Math.abs(1-r*r);let u,d,f,p;if(h>0)if(u=r*l-o,d=r*o-l,p=a*h,u>=0)if(d>=-p)if(d<=p){const v=1/h;u*=v,d*=v,f=u*(u+r*d+2*o)+d*(r*u+d+2*l)+c}else d=a,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;else d=-a,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-r*a+o)),d=u>0?-a:Math.min(Math.max(-a,-l),a),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-a,-l),a),f=d*(d+2*l)+c):(u=Math.max(0,-(r*a+o)),d=u>0?a:Math.min(Math.max(-a,-l),a),f=-u*u+d*(d+2*l)+c);else d=r>0?-a:a,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Wr).addScaledVector(da,d),f}intersectSphere(e,t){qi.subVectors(e.center,this.origin);const i=qi.dot(this.direction),s=qi.dot(qi)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(a=(e.min.y-d.y)*h,r=(e.max.y-d.y)*h):(a=(e.max.y-d.y)*h,r=(e.min.y-d.y)*h),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,qi)!==null}intersectTriangle(e,t,i,s,a){Gr.subVectors(t,e),ua.subVectors(i,e),Xr.crossVectors(Gr,ua);let r=this.direction.dot(Xr),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;dn.subVectors(this.origin,e);const l=o*this.direction.dot(ua.crossVectors(dn,ua));if(l<0)return null;const c=o*this.direction.dot(Gr.cross(dn));if(c<0||l+c>r)return null;const h=-o*dn.dot(Xr);return h<0?null:this.at(h/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Hs extends Js{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new at(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=Uh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Pc=new Rt,Cn=new Nf,fa=new Ll,Ic=new V,pa=new V,ma=new V,ga=new V,qr=new V,ya=new V,Lc=new V,xa=new V;class ft extends Yt{constructor(e=new Ti,t=new Hs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){ya.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=o[l],u=a[l];h!==0&&(qr.fromBufferAttribute(u,e),r?ya.addScaledVector(qr,h):ya.addScaledVector(qr.sub(t),h))}t.add(ya)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),fa.copy(i.boundingSphere),fa.applyMatrix4(a),Cn.copy(e.ray).recast(e.near),!(fa.containsPoint(Cn.origin)===!1&&(Cn.intersectSphere(fa,Ic)===null||Cn.origin.distanceToSquared(Ic)>(e.far-e.near)**2))&&(Pc.copy(a).invert(),Cn.copy(e.ray).applyMatrix4(Pc),!(i.boundingBox!==null&&Cn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Cn)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,u=a.attributes.normal,d=a.groups,f=a.drawRange;if(o!==null)if(Array.isArray(r))for(let p=0,v=d.length;p<v;p++){const g=d[p],m=r[g.materialIndex],M=Math.max(g.start,f.start),_=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let x=M,y=_;x<y;x+=3){const E=o.getX(x),A=o.getX(x+1),S=o.getX(x+2);s=va(this,m,e,i,c,h,u,E,A,S),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const p=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let g=p,m=v;g<m;g+=3){const M=o.getX(g),_=o.getX(g+1),x=o.getX(g+2);s=va(this,r,e,i,c,h,u,M,_,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let p=0,v=d.length;p<v;p++){const g=d[p],m=r[g.materialIndex],M=Math.max(g.start,f.start),_=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let x=M,y=_;x<y;x+=3){const E=x,A=x+1,S=x+2;s=va(this,m,e,i,c,h,u,E,A,S),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const p=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let g=p,m=v;g<m;g+=3){const M=g,_=g+1,x=g+2;s=va(this,r,e,i,c,h,u,M,_,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function kf(n,e,t,i,s,a,r,o){let l;if(e.side===ii?l=i.intersectTriangle(r,a,s,!0,o):l=i.intersectTriangle(s,a,r,e.side===bn,o),l===null)return null;xa.copy(o),xa.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(xa);return c<t.near||c>t.far?null:{distance:c,point:xa.clone(),object:n}}function va(n,e,t,i,s,a,r,o,l,c){n.getVertexPosition(o,pa),n.getVertexPosition(l,ma),n.getVertexPosition(c,ga);const h=kf(n,e,t,i,pa,ma,ga,Lc);if(h){const u=new V;_i.getBarycoord(Lc,pa,ma,ga,u),s&&(h.uv=_i.getInterpolatedAttribute(s,o,l,c,u,new nt)),a&&(h.uv1=_i.getInterpolatedAttribute(a,o,l,c,u,new nt)),r&&(h.normal=_i.getInterpolatedAttribute(r,o,l,c,u,new V),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new V,materialIndex:0};_i.getNormal(pa,ma,ga,d.normal),h.face=d,h.barycoord=u}return h}class Uf extends Jt{constructor(e=null,t=1,i=1,s,a,r,o,l,c=Vt,h=Vt,u,d){super(null,r,o,l,c,h,s,a,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const $r=new V,Bf=new V,Ff=new Ue;class In{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=$r.subVectors(i,t).cross(Bf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta($r),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/a;return i===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(s,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Ff.getNormalMatrix(e),s=this.coplanarPoint($r).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Pn=new Ll,Of=new nt(.5,.5),_a=new V;class Dl{constructor(e=new In,t=new In,i=new In,s=new In,a=new In,r=new In){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Di,i=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],l=a[2],c=a[3],h=a[4],u=a[5],d=a[6],f=a[7],p=a[8],v=a[9],g=a[10],m=a[11],M=a[12],_=a[13],x=a[14],y=a[15];if(s[0].setComponents(c-r,f-h,m-p,y-M).normalize(),s[1].setComponents(c+r,f+h,m+p,y+M).normalize(),s[2].setComponents(c+o,f+u,m+v,y+_).normalize(),s[3].setComponents(c-o,f-u,m-v,y-_).normalize(),i)s[4].setComponents(l,d,g,x).normalize(),s[5].setComponents(c-l,f-d,m-g,y-x).normalize();else if(s[4].setComponents(c-l,f-d,m-g,y-x).normalize(),t===Di)s[5].setComponents(c+l,f+d,m+g,y+x).normalize();else if(t===Ys)s[5].setComponents(l,d,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Pn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Pn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Pn)}intersectsSprite(e){Pn.center.set(0,0,0);const t=Of.distanceTo(e.center);return Pn.radius=.7071067811865476+t,Pn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Pn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(_a.x=s.normal.x>0?e.max.x:e.min.x,_a.y=s.normal.y>0?e.max.y:e.min.y,_a.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(_a)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class sd extends Jt{constructor(e=[],t=Gn,i,s,a,r,o,l,c,h){super(e,t,i,s,a,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class vs extends Jt{constructor(e,t,i=Oi,s,a,r,o=Vt,l=Vt,c,h=nn,u=1){if(h!==nn&&h!==Fn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,s,a,r,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Il(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class zf extends vs{constructor(e,t=Oi,i=Gn,s,a,r=Vt,o=Vt,l,c=nn){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,i,s,a,r,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class ad extends Jt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Mn extends Ti{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const l=[],c=[],h=[],u=[];let d=0,f=0;p("z","y","x",-1,-1,i,t,e,r,a,0),p("z","y","x",1,-1,i,t,-e,r,a,1),p("x","z","y",1,1,e,i,t,s,r,2),p("x","z","y",1,-1,e,i,-t,s,r,3),p("x","y","z",1,-1,e,t,i,s,a,4),p("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new Qt(c,3)),this.setAttribute("normal",new Qt(h,3)),this.setAttribute("uv",new Qt(u,2));function p(v,g,m,M,_,x,y,E,A,S,w){const P=x/A,C=y/S,L=x/2,z=y/2,U=E/2,I=A+1,B=S+1;let N=0,j=0;const te=new V;for(let se=0;se<B;se++){const ue=se*C-z;for(let $=0;$<I;$++){const q=$*P-L;te[v]=q*M,te[g]=ue*_,te[m]=U,c.push(te.x,te.y,te.z),te[v]=0,te[g]=0,te[m]=E>0?1:-1,h.push(te.x,te.y,te.z),u.push($/A),u.push(1-se/S),N+=1}}for(let se=0;se<S;se++)for(let ue=0;ue<A;ue++){const $=d+ue+I*se,q=d+ue+I*(se+1),fe=d+(ue+1)+I*(se+1),ye=d+(ue+1)+I*se;l.push($,q,ye),l.push(q,fe,ye),j+=6}o.addGroup(f,j,w),f+=j,d+=N}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class fn extends Ti{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const h=[],u=[],d=[],f=[];let p=0;const v=[],g=i/2;let m=0;M(),r===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new Qt(u,3)),this.setAttribute("normal",new Qt(d,3)),this.setAttribute("uv",new Qt(f,2));function M(){const x=new V,y=new V;let E=0;const A=(t-e)/i;for(let S=0;S<=a;S++){const w=[],P=S/a,C=P*(t-e)+e;for(let L=0;L<=s;L++){const z=L/s,U=z*l+o,I=Math.sin(U),B=Math.cos(U);y.x=C*I,y.y=-P*i+g,y.z=C*B,u.push(y.x,y.y,y.z),x.set(I,A,B).normalize(),d.push(x.x,x.y,x.z),f.push(z,1-P),w.push(p++)}v.push(w)}for(let S=0;S<s;S++)for(let w=0;w<a;w++){const P=v[w][S],C=v[w+1][S],L=v[w+1][S+1],z=v[w][S+1];(e>0||w!==0)&&(h.push(P,C,z),E+=3),(t>0||w!==a-1)&&(h.push(C,L,z),E+=3)}c.addGroup(m,E,0),m+=E}function _(x){const y=p,E=new nt,A=new V;let S=0;const w=x===!0?e:t,P=x===!0?1:-1;for(let L=1;L<=s;L++)u.push(0,g*P,0),d.push(0,P,0),f.push(.5,.5),p++;const C=p;for(let L=0;L<=s;L++){const U=L/s*l+o,I=Math.cos(U),B=Math.sin(U);A.x=w*B,A.y=g*P,A.z=w*I,u.push(A.x,A.y,A.z),d.push(0,P,0),E.x=I*.5+.5,E.y=B*.5*P+.5,f.push(E.x,E.y),p++}for(let L=0;L<s;L++){const z=y+L,U=C+L;x===!0?h.push(U,U+1,z):h.push(U+1,U,z),S+=3}c.addGroup(m,S,x===!0?1:2),m+=S}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class lr extends Ti{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,f=[],p=[],v=[],g=[];for(let m=0;m<h;m++){const M=m*d-r;for(let _=0;_<c;_++){const x=_*u-a;p.push(x,-M,0),v.push(0,0,1),g.push(_/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let M=0;M<o;M++){const _=M+c*m,x=M+c*(m+1),y=M+1+c*(m+1),E=M+1+c*m;f.push(_,x,E),f.push(x,y,E)}this.setIndex(f),this.setAttribute("position",new Qt(p,3)),this.setAttribute("normal",new Qt(v,3)),this.setAttribute("uv",new Qt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new lr(e.width,e.height,e.widthSegments,e.heightSegments)}}class ja extends Ti{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(r+o,Math.PI);let c=0;const h=[],u=new V,d=new V,f=[],p=[],v=[],g=[];for(let m=0;m<=i;m++){const M=[],_=m/i;let x=0;m===0&&r===0?x=.5/t:m===i&&l===Math.PI&&(x=-.5/t);for(let y=0;y<=t;y++){const E=y/t;u.x=-e*Math.cos(s+E*a)*Math.sin(r+_*o),u.y=e*Math.cos(r+_*o),u.z=e*Math.sin(s+E*a)*Math.sin(r+_*o),p.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),g.push(E+x,1-_),M.push(c++)}h.push(M)}for(let m=0;m<i;m++)for(let M=0;M<t;M++){const _=h[m][M+1],x=h[m][M],y=h[m+1][M],E=h[m+1][M+1];(m!==0||r>0)&&f.push(_,x,E),(m!==i-1||l<Math.PI)&&f.push(x,y,E)}this.setIndex(f),this.setAttribute("position",new Qt(p,3)),this.setAttribute("normal",new Qt(v,3)),this.setAttribute("uv",new Qt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ja(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function _s(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(Dc(s))s.isRenderTargetTexture?(Ne("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(Dc(s[0])){const a=[];for(let r=0,o=s.length;r<o;r++)a[r]=s[r].clone();e[t][i]=a}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Kt(n){const e={};for(let t=0;t<n.length;t++){const i=_s(n[t]);for(const s in i)e[s]=i[s]}return e}function Dc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Vf(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function rd(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}const Hf={clone:_s,merge:Kt};var Wf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Gf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class zi extends Js{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wf,this.fragmentShader=Gf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=_s(e.uniforms),this.uniformsGroups=Vf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Xf extends zi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Yr extends Js{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new at(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new at(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=sl,this.normalScale=new nt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class qf extends Js{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=nf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class $f extends Js{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class od extends Yt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new at(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const Kr=new Rt,Nc=new V,kc=new V;class Yf{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new nt(512,512),this.mapType=oi,this.map=null,this.mapPass=null,this.matrix=new Rt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Dl,this._frameExtents=new nt(1,1),this._viewportCount=1,this._viewports=[new Mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Nc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Nc),kc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(kc),t.updateMatrixWorld(),Kr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Kr,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Ys||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Kr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Sa=new V,Ma=new ws,Ri=new V;class ld extends Yt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Rt,this.projectionMatrix=new Rt,this.projectionMatrixInverse=new Rt,this.coordinateSystem=Di,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Sa,Ma,Ri),Ri.x===1&&Ri.y===1&&Ri.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Sa,Ma,Ri.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Sa,Ma,Ri),Ri.x===1&&Ri.y===1&&Ri.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Sa,Ma,Ri.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const un=new V,Uc=new nt,Bc=new nt;class vi extends ld{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=rl*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Er*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return rl*2*Math.atan(Math.tan(Er*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){un.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(un.x,un.y).multiplyScalar(-e/un.z),un.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(un.x,un.y).multiplyScalar(-e/un.z)}getViewSize(e,t){return this.getViewBounds(e,Uc,Bc),t.subVectors(Bc,Uc)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Er*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,t-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class cr extends ld{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Kf extends Yf{constructor(){super(new cr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fc extends od{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Yt.DEFAULT_UP),this.updateMatrix(),this.target=new Yt,this.shadow=new Kf}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class jf extends od{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const os=-90,ls=1;class Zf extends Yt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new vi(os,ls,e,t);s.layers=this.layers,this.add(s);const a=new vi(os,ls,e,t);a.layers=this.layers,this.add(a);const r=new vi(os,ls,e,t);r.layers=this.layers,this.add(r);const o=new vi(os,ls,e,t);o.layers=this.layers,this.add(o);const l=new vi(os,ls,e,t);l.layers=this.layers,this.add(l);const c=new vi(os,ls,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,o,l]=t;for(const c of t)this.remove(c);if(e===Di)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ys)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class Jf extends vi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Zl=class Zl{constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){const a=this.elements;return a[0]=e,a[2]=t,a[1]=i,a[3]=s,this}};Zl.prototype.isMatrix2=!0;let Oc=Zl;function zc(n,e,t,i){const s=Qf(i);switch(t){case Kh:return n*e;case Zh:return n*e/s.components*s.byteLength;case wl:return n*e/s.components*s.byteLength;case Xn:return n*e*2/s.components*s.byteLength;case Al:return n*e*2/s.components*s.byteLength;case jh:return n*e*3/s.components*s.byteLength;case bi:return n*e*4/s.components*s.byteLength;case Rl:return n*e*4/s.components*s.byteLength;case Ba:case Fa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Oa:case za:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Co:case Io:return Math.max(n,16)*Math.max(e,8)/4;case Ro:case Po:return Math.max(n,8)*Math.max(e,8)/2;case Lo:case Do:case ko:case Uo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case No:case Xa:case Bo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Oo:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case zo:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Vo:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ho:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Wo:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Go:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Xo:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case qo:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case $o:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Yo:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Ko:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case jo:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Zo:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Jo:case Qo:case el:return Math.ceil(n/4)*Math.ceil(e/4)*16;case tl:case il:return Math.ceil(n/4)*Math.ceil(e/4)*8;case qa:case nl:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Qf(n){switch(n){case oi:case Xh:return{byteLength:1,components:1};case qs:case qh:case tn:return{byteLength:2,components:1};case El:case Tl:return{byteLength:2,components:4};case Oi:case bl:case Li:return{byteLength:4,components:1};case $h:case Yh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ml}}));typeof window<"u"&&(window.__THREE__?Ne("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ml);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function cd(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function ep(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){const p=u[d],v=u[f];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){const v=u[f];n.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var tp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ip=`#ifdef USE_ALPHAHASH
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
#endif`,np=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,sp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ap=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,rp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,op=`#ifdef USE_AOMAP
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
#endif`,lp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,cp=`#ifdef USE_BATCHING
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
#endif`,hp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,dp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,up=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,fp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,pp=`#ifdef USE_IRIDESCENCE
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
#endif`,mp=`#ifdef USE_BUMPMAP
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
#endif`,gp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,yp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,xp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_p=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Sp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Mp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,bp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Ep=`#define PI 3.141592653589793
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
} // validated`,Tp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,wp=`vec3 transformedNormal = objectNormal;
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
#endif`,Ap=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Rp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Cp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Pp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ip="gl_FragColor = linearToOutputTexel( gl_FragColor );",Lp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Dp=`#ifdef USE_ENVMAP
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
#endif`,Np=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,kp=`#ifdef USE_ENVMAP
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
#endif`,Up=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Bp=`#ifdef USE_ENVMAP
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
#endif`,Fp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Op=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,zp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Vp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hp=`#ifdef USE_GRADIENTMAP
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
}`,Wp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Gp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Xp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qp=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,$p=`#ifdef USE_ENVMAP
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
#endif`,Yp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Kp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,jp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Jp=`PhysicalMaterial material;
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
#endif`,Qp=`uniform sampler2D dfgLUT;
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
}`,em=`
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
#endif`,tm=`#if defined( RE_IndirectDiffuse )
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
#endif`,im=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,nm=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,sm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,am=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,om=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,lm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,hm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,dm=`#if defined( USE_POINTS_UV )
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
#endif`,um=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,fm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,pm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,mm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ym=`#ifdef USE_MORPHTARGETS
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
#endif`,xm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,_m=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Sm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Em=`#ifdef USE_NORMALMAP
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
#endif`,Tm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,wm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Am=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Cm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Pm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Im=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Lm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Dm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Nm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,km=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Um=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Bm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Fm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Om=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,zm=`float getShadowMask() {
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
}`,Vm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Hm=`#ifdef USE_SKINNING
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
#endif`,Wm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Gm=`#ifdef USE_SKINNING
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
#endif`,Xm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,qm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,$m=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ym=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Km=`#ifdef USE_TRANSMISSION
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
#endif`,jm=`#ifdef USE_TRANSMISSION
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
#endif`,Zm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Qm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,e0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const t0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,i0=`uniform sampler2D t2D;
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
}`,n0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,s0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,a0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,r0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,o0=`#include <common>
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
}`,l0=`#if DEPTH_PACKING == 3200
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
}`,c0=`#define DISTANCE
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
}`,h0=`#define DISTANCE
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
}`,d0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,u0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,f0=`uniform float scale;
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
}`,p0=`uniform vec3 diffuse;
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
}`,m0=`#include <common>
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
}`,g0=`uniform vec3 diffuse;
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
}`,y0=`#define LAMBERT
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
}`,x0=`#define LAMBERT
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
}`,v0=`#define MATCAP
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
}`,_0=`#define MATCAP
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
}`,S0=`#define NORMAL
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
}`,M0=`#define NORMAL
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
}`,b0=`#define PHONG
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
}`,E0=`#define PHONG
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
}`,T0=`#define STANDARD
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
}`,w0=`#define STANDARD
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
}`,A0=`#define TOON
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
}`,R0=`#define TOON
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
}`,C0=`uniform float size;
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
}`,P0=`uniform vec3 diffuse;
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
}`,I0=`#include <common>
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
}`,L0=`uniform vec3 color;
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
}`,D0=`uniform float rotation;
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
}`,N0=`uniform vec3 diffuse;
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
}`,We={alphahash_fragment:tp,alphahash_pars_fragment:ip,alphamap_fragment:np,alphamap_pars_fragment:sp,alphatest_fragment:ap,alphatest_pars_fragment:rp,aomap_fragment:op,aomap_pars_fragment:lp,batching_pars_vertex:cp,batching_vertex:hp,begin_vertex:dp,beginnormal_vertex:up,bsdfs:fp,iridescence_fragment:pp,bumpmap_pars_fragment:mp,clipping_planes_fragment:gp,clipping_planes_pars_fragment:yp,clipping_planes_pars_vertex:xp,clipping_planes_vertex:vp,color_fragment:_p,color_pars_fragment:Sp,color_pars_vertex:Mp,color_vertex:bp,common:Ep,cube_uv_reflection_fragment:Tp,defaultnormal_vertex:wp,displacementmap_pars_vertex:Ap,displacementmap_vertex:Rp,emissivemap_fragment:Cp,emissivemap_pars_fragment:Pp,colorspace_fragment:Ip,colorspace_pars_fragment:Lp,envmap_fragment:Dp,envmap_common_pars_fragment:Np,envmap_pars_fragment:kp,envmap_pars_vertex:Up,envmap_physical_pars_fragment:$p,envmap_vertex:Bp,fog_vertex:Fp,fog_pars_vertex:Op,fog_fragment:zp,fog_pars_fragment:Vp,gradientmap_pars_fragment:Hp,lightmap_pars_fragment:Wp,lights_lambert_fragment:Gp,lights_lambert_pars_fragment:Xp,lights_pars_begin:qp,lights_toon_fragment:Yp,lights_toon_pars_fragment:Kp,lights_phong_fragment:jp,lights_phong_pars_fragment:Zp,lights_physical_fragment:Jp,lights_physical_pars_fragment:Qp,lights_fragment_begin:em,lights_fragment_maps:tm,lights_fragment_end:im,lightprobes_pars_fragment:nm,logdepthbuf_fragment:sm,logdepthbuf_pars_fragment:am,logdepthbuf_pars_vertex:rm,logdepthbuf_vertex:om,map_fragment:lm,map_pars_fragment:cm,map_particle_fragment:hm,map_particle_pars_fragment:dm,metalnessmap_fragment:um,metalnessmap_pars_fragment:fm,morphinstance_vertex:pm,morphcolor_vertex:mm,morphnormal_vertex:gm,morphtarget_pars_vertex:ym,morphtarget_vertex:xm,normal_fragment_begin:vm,normal_fragment_maps:_m,normal_pars_fragment:Sm,normal_pars_vertex:Mm,normal_vertex:bm,normalmap_pars_fragment:Em,clearcoat_normal_fragment_begin:Tm,clearcoat_normal_fragment_maps:wm,clearcoat_pars_fragment:Am,iridescence_pars_fragment:Rm,opaque_fragment:Cm,packing:Pm,premultiplied_alpha_fragment:Im,project_vertex:Lm,dithering_fragment:Dm,dithering_pars_fragment:Nm,roughnessmap_fragment:km,roughnessmap_pars_fragment:Um,shadowmap_pars_fragment:Bm,shadowmap_pars_vertex:Fm,shadowmap_vertex:Om,shadowmask_pars_fragment:zm,skinbase_vertex:Vm,skinning_pars_vertex:Hm,skinning_vertex:Wm,skinnormal_vertex:Gm,specularmap_fragment:Xm,specularmap_pars_fragment:qm,tonemapping_fragment:$m,tonemapping_pars_fragment:Ym,transmission_fragment:Km,transmission_pars_fragment:jm,uv_pars_fragment:Zm,uv_pars_vertex:Jm,uv_vertex:Qm,worldpos_vertex:e0,background_vert:t0,background_frag:i0,backgroundCube_vert:n0,backgroundCube_frag:s0,cube_vert:a0,cube_frag:r0,depth_vert:o0,depth_frag:l0,distance_vert:c0,distance_frag:h0,equirect_vert:d0,equirect_frag:u0,linedashed_vert:f0,linedashed_frag:p0,meshbasic_vert:m0,meshbasic_frag:g0,meshlambert_vert:y0,meshlambert_frag:x0,meshmatcap_vert:v0,meshmatcap_frag:_0,meshnormal_vert:S0,meshnormal_frag:M0,meshphong_vert:b0,meshphong_frag:E0,meshphysical_vert:T0,meshphysical_frag:w0,meshtoon_vert:A0,meshtoon_frag:R0,points_vert:C0,points_frag:P0,shadow_vert:I0,shadow_frag:L0,sprite_vert:D0,sprite_frag:N0},me={common:{diffuse:{value:new at(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new at(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new at(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new at(16777215)},opacity:{value:1},center:{value:new nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},Ii={basic:{uniforms:Kt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:Kt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new at(0)},envMapIntensity:{value:1}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:Kt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new at(0)},specular:{value:new at(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:Kt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new at(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:Kt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new at(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:Kt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:Kt([me.points,me.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:Kt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:Kt([me.common,me.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:Kt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:Kt([me.sprite,me.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distance:{uniforms:Kt([me.common,me.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distance_vert,fragmentShader:We.distance_frag},shadow:{uniforms:Kt([me.lights,me.fog,{color:{value:new at(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};Ii.physical={uniforms:Kt([Ii.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new at(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new at(0)},specularColor:{value:new at(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};const ba={r:0,b:0,g:0},k0=new Rt,hd=new Ue;hd.set(-1,0,0,0,1,0,0,0,1);function U0(n,e,t,i,s,a){const r=new at(0);let o=s===!0?0:1,l,c,h=null,u=0,d=null;function f(M){let _=M.isScene===!0?M.background:null;if(_&&_.isTexture){const x=M.backgroundBlurriness>0;_=e.get(_,x)}return _}function p(M){let _=!1;const x=f(M);x===null?g(r,o):x&&x.isColor&&(g(x,1),_=!0);const y=n.xr.getEnvironmentBlendMode();y==="additive"?t.buffers.color.setClear(0,0,0,1,a):y==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,a),(n.autoClear||_)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function v(M,_){const x=f(_);x&&(x.isCubeTexture||x.mapping===or)?(c===void 0&&(c=new ft(new Mn(1,1,1),new zi({name:"BackgroundCubeMaterial",uniforms:_s(Ii.backgroundCube.uniforms),vertexShader:Ii.backgroundCube.vertexShader,fragmentShader:Ii.backgroundCube.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(y,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(k0.makeRotationFromEuler(_.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(hd),c.material.toneMapped=je.getTransfer(x.colorSpace)!==ot,(h!==x||u!==x.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,h=x,u=x.version,d=n.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new ft(new lr(2,2),new zi({name:"BackgroundMaterial",uniforms:_s(Ii.background.uniforms),vertexShader:Ii.background.vertexShader,fragmentShader:Ii.background.fragmentShader,side:bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=je.getTransfer(x.colorSpace)!==ot,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||u!==x.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=x,u=x.version,d=n.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function g(M,_){M.getRGB(ba,rd(n)),t.buffers.color.setClear(ba.r,ba.g,ba.b,_,a)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(M,_=1){r.set(M),o=_,g(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,g(r,o)},render:p,addToRenderList:v,dispose:m}}function B0(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let a=s,r=!1;function o(C,L,z,U,I){let B=!1;const N=u(C,U,z,L);a!==N&&(a=N,c(a.object)),B=f(C,U,z,I),B&&p(C,U,z,I),I!==null&&e.update(I,n.ELEMENT_ARRAY_BUFFER),(B||r)&&(r=!1,x(C,L,z,U),I!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(I).buffer))}function l(){return n.createVertexArray()}function c(C){return n.bindVertexArray(C)}function h(C){return n.deleteVertexArray(C)}function u(C,L,z,U){const I=U.wireframe===!0;let B=i[L.id];B===void 0&&(B={},i[L.id]=B);const N=C.isInstancedMesh===!0?C.id:0;let j=B[N];j===void 0&&(j={},B[N]=j);let te=j[z.id];te===void 0&&(te={},j[z.id]=te);let se=te[I];return se===void 0&&(se=d(l()),te[I]=se),se}function d(C){const L=[],z=[],U=[];for(let I=0;I<t;I++)L[I]=0,z[I]=0,U[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:z,attributeDivisors:U,object:C,attributes:{},index:null}}function f(C,L,z,U){const I=a.attributes,B=L.attributes;let N=0;const j=z.getAttributes();for(const te in j)if(j[te].location>=0){const ue=I[te];let $=B[te];if($===void 0&&(te==="instanceMatrix"&&C.instanceMatrix&&($=C.instanceMatrix),te==="instanceColor"&&C.instanceColor&&($=C.instanceColor)),ue===void 0||ue.attribute!==$||$&&ue.data!==$.data)return!0;N++}return a.attributesNum!==N||a.index!==U}function p(C,L,z,U){const I={},B=L.attributes;let N=0;const j=z.getAttributes();for(const te in j)if(j[te].location>=0){let ue=B[te];ue===void 0&&(te==="instanceMatrix"&&C.instanceMatrix&&(ue=C.instanceMatrix),te==="instanceColor"&&C.instanceColor&&(ue=C.instanceColor));const $={};$.attribute=ue,ue&&ue.data&&($.data=ue.data),I[te]=$,N++}a.attributes=I,a.attributesNum=N,a.index=U}function v(){const C=a.newAttributes;for(let L=0,z=C.length;L<z;L++)C[L]=0}function g(C){m(C,0)}function m(C,L){const z=a.newAttributes,U=a.enabledAttributes,I=a.attributeDivisors;z[C]=1,U[C]===0&&(n.enableVertexAttribArray(C),U[C]=1),I[C]!==L&&(n.vertexAttribDivisor(C,L),I[C]=L)}function M(){const C=a.newAttributes,L=a.enabledAttributes;for(let z=0,U=L.length;z<U;z++)L[z]!==C[z]&&(n.disableVertexAttribArray(z),L[z]=0)}function _(C,L,z,U,I,B,N){N===!0?n.vertexAttribIPointer(C,L,z,I,B):n.vertexAttribPointer(C,L,z,U,I,B)}function x(C,L,z,U){v();const I=U.attributes,B=z.getAttributes(),N=L.defaultAttributeValues;for(const j in B){const te=B[j];if(te.location>=0){let se=I[j];if(se===void 0&&(j==="instanceMatrix"&&C.instanceMatrix&&(se=C.instanceMatrix),j==="instanceColor"&&C.instanceColor&&(se=C.instanceColor)),se!==void 0){const ue=se.normalized,$=se.itemSize,q=e.get(se);if(q===void 0)continue;const fe=q.buffer,ye=q.type,G=q.bytesPerElement,J=ye===n.INT||ye===n.UNSIGNED_INT||se.gpuType===bl;if(se.isInterleavedBufferAttribute){const K=se.data,we=K.stride,Ae=se.offset;if(K.isInstancedInterleavedBuffer){for(let Pe=0;Pe<te.locationSize;Pe++)m(te.location+Pe,K.meshPerAttribute);C.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Pe=0;Pe<te.locationSize;Pe++)g(te.location+Pe);n.bindBuffer(n.ARRAY_BUFFER,fe);for(let Pe=0;Pe<te.locationSize;Pe++)_(te.location+Pe,$/te.locationSize,ye,ue,we*G,(Ae+$/te.locationSize*Pe)*G,J)}else{if(se.isInstancedBufferAttribute){for(let K=0;K<te.locationSize;K++)m(te.location+K,se.meshPerAttribute);C.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let K=0;K<te.locationSize;K++)g(te.location+K);n.bindBuffer(n.ARRAY_BUFFER,fe);for(let K=0;K<te.locationSize;K++)_(te.location+K,$/te.locationSize,ye,ue,$*G,$/te.locationSize*K*G,J)}}else if(N!==void 0){const ue=N[j];if(ue!==void 0)switch(ue.length){case 2:n.vertexAttrib2fv(te.location,ue);break;case 3:n.vertexAttrib3fv(te.location,ue);break;case 4:n.vertexAttrib4fv(te.location,ue);break;default:n.vertexAttrib1fv(te.location,ue)}}}}M()}function y(){w();for(const C in i){const L=i[C];for(const z in L){const U=L[z];for(const I in U){const B=U[I];for(const N in B)h(B[N].object),delete B[N];delete U[I]}}delete i[C]}}function E(C){if(i[C.id]===void 0)return;const L=i[C.id];for(const z in L){const U=L[z];for(const I in U){const B=U[I];for(const N in B)h(B[N].object),delete B[N];delete U[I]}}delete i[C.id]}function A(C){for(const L in i){const z=i[L];for(const U in z){const I=z[U];if(I[C.id]===void 0)continue;const B=I[C.id];for(const N in B)h(B[N].object),delete B[N];delete I[C.id]}}}function S(C){for(const L in i){const z=i[L],U=C.isInstancedMesh===!0?C.id:0,I=z[U];if(I!==void 0){for(const B in I){const N=I[B];for(const j in N)h(N[j].object),delete N[j];delete I[B]}delete z[U],Object.keys(z).length===0&&delete i[L]}}}function w(){P(),r=!0,a!==s&&(a=s,c(a.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:P,dispose:y,releaseStatesOfGeometry:E,releaseStatesOfObject:S,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:g,disableUnusedAttributes:M}}function F0(n,e,t){let i;function s(l){i=l}function a(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function r(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,i,1)}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function O0(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(A){return!(A!==bi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const S=A===tn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==oi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Li&&!S)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Ne("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Ne("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),y=n.getParameter(n.MAX_SAMPLES),E=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:M,maxVaryings:_,maxFragmentUniforms:x,maxSamples:y,samples:E}}function z0(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new In,o=new Ue,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const p=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,m=n.get(u);if(!s||p===null||p.length===0||a&&!g)a?h(null):c();else{const M=a?0:i,_=M*4;let x=m.clippingState||null;l.value=x,x=h(p,d,_,f);for(let y=0;y!==_;++y)x[y]=t[y];m.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,d,f,p){const v=u!==null?u.length:0;let g=null;if(v!==0){if(g=l.value,p!==!0||g===null){const m=f+v*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(g===null||g.length<m)&&(g=new Float32Array(m));for(let _=0,x=f;_!==v;++_,x+=4)r.copy(u[_]).applyMatrix4(M,o),r.normal.toArray(g,x),g[x+3]=r.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}const mn=4,Vc=[.125,.215,.35,.446,.526,.582],Un=20,V0=256,ks=new cr,Hc=new at;let jr=null,Zr=0,Jr=0,Qr=!1;const H0=new V;class Wc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:o=H0}=a;jr=this._renderer.getRenderTarget(),Zr=this._renderer.getActiveCubeFace(),Jr=this._renderer.getActiveMipmapLevel(),Qr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(jr,Zr,Jr),this._renderer.xr.enabled=Qr,e.scissorTest=!1,cs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Gn||e.mapping===xs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),jr=this._renderer.getRenderTarget(),Zr=this._renderer.getActiveCubeFace(),Jr=this._renderer.getActiveMipmapLevel(),Qr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:$t,minFilter:$t,generateMipmaps:!1,type:tn,format:bi,colorSpace:$a,depthBuffer:!1},s=Gc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gc(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=W0(a)),this._blurMaterial=X0(a,e,t),this._ggxMaterial=G0(a,e,t)}return s}_compileMaterial(e){const t=new ft(new Ti,e);this._renderer.compile(t,ks)}_sceneToCubeUV(e,t,i,s,a){const l=new vi(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Hc),u.toneMapping=ki,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ft(new Mn,new Hs({name:"PMREM.Background",side:ii,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,g=v.material;let m=!1;const M=e.background;M?M.isColor&&(g.color.copy(M),e.background=null,m=!0):(g.color.copy(Hc),m=!0);for(let _=0;_<6;_++){const x=_%3;x===0?(l.up.set(0,c[_],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+h[_],a.y,a.z)):x===1?(l.up.set(0,0,c[_]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+h[_],a.z)):(l.up.set(0,c[_],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+h[_]));const y=this._cubeSize;cs(s,x*y,_>2?y:0,y,y),u.setRenderTarget(s),m&&u.render(v,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=M}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Gn||e.mapping===xs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=qc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xc());const a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;cs(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(r,ks)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;const l=r.uniforms,c=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,f=u*d,{_lodMax:p}=this,v=this._sizeLods[i],g=3*v*(i>p-mn?i-p+mn:0),m=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=p-t,cs(a,g,m,3*v,2*v),s.setRenderTarget(a),s.render(o,ks),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=p-i,cs(e,g,m,3*v,2*v),s.setRenderTarget(e),s.render(o,ks)}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,o){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&Qe("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=c;const d=c.uniforms,f=this._sizeLods[i]-1,p=isFinite(a)?Math.PI/(2*f):2*Math.PI/(2*Un-1),v=a/p,g=isFinite(a)?1+Math.floor(h*v):Un;g>Un&&Ne(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Un}`);const m=[];let M=0;for(let A=0;A<Un;++A){const S=A/v,w=Math.exp(-S*S/2);m.push(w),A===0?M+=w:A<g&&(M+=2*w)}for(let A=0;A<m.length;A++)m[A]=m[A]/M;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=r==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:_}=this;d.dTheta.value=p,d.mipInt.value=_-i;const x=this._sizeLods[s],y=3*x*(s>_-mn?s-_+mn:0),E=4*(this._cubeSize-x);cs(t,y,E,3*x,2*x),l.setRenderTarget(t),l.render(u,ks)}}function W0(n){const e=[],t=[],i=[];let s=n;const a=n-mn+1+Vc.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let l=1/o;r>n-mn?l=Vc[r-n+mn-1]:r===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,v=3,g=2,m=1,M=new Float32Array(v*p*f),_=new Float32Array(g*p*f),x=new Float32Array(m*p*f);for(let E=0;E<f;E++){const A=E%3*2/3-1,S=E>2?0:-1,w=[A,S,0,A+2/3,S,0,A+2/3,S+1,0,A,S,0,A+2/3,S+1,0,A,S+1,0];M.set(w,v*p*E),_.set(d,g*p*E);const P=[E,E,E,E,E,E];x.set(P,m*p*E)}const y=new Ti;y.setAttribute("position",new Bi(M,v)),y.setAttribute("uv",new Bi(_,g)),y.setAttribute("faceIndex",new Bi(x,m)),i.push(new ft(y,null)),s>mn&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function Gc(n,e,t){const i=new Ui(n,e,t);return i.texture.mapping=or,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function cs(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function G0(n,e,t){return new zi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:V0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:hr(),fragmentShader:`

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
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function X0(n,e,t){const i=new Float32Array(Un),s=new V(0,1,0);return new zi({name:"SphericalGaussianBlur",defines:{n:Un,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:hr(),fragmentShader:`

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
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Xc(){return new zi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:hr(),fragmentShader:`

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
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function qc(){return new zi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:hr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function hr(){return`

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
	`}class dd extends Ui{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new sd(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Mn(5,5,5),a=new zi({name:"CubemapFromEquirect",uniforms:_s(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ii,blending:Qi});a.uniforms.tEquirect.value=t;const r=new ft(s,a),o=t.minFilter;return t.minFilter===Bn&&(t.minFilter=$t),new Zf(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}function q0(n){let e=new WeakMap,t=new WeakMap,i=null;function s(d,f=!1){return d==null?null:f?r(d):a(d)}function a(d){if(d&&d.isTexture){const f=d.mapping;if(f===Sr||f===Mr)if(e.has(d)){const p=e.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const v=new dd(p.height);return v.fromEquirectangularTexture(n,d),e.set(d,v),d.addEventListener("dispose",c),o(v.texture,d.mapping)}else return null}}return d}function r(d){if(d&&d.isTexture){const f=d.mapping,p=f===Sr||f===Mr,v=f===Gn||f===xs;if(p||v){let g=t.get(d);const m=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return i===null&&(i=new Wc(n)),g=p?i.fromEquirectangular(d,g):i.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{const M=d.image;return p&&M&&M.height>0||v&&M&&l(M)?(i===null&&(i=new Wc(n)),g=p?i.fromEquirectangular(d):i.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function o(d,f){return f===Sr?d.mapping=Gn:f===Mr&&(d.mapping=xs),d}function l(d){let f=0;const p=6;for(let v=0;v<p;v++)d[v]!==void 0&&f++;return f===p}function c(d){const f=d.target;f.removeEventListener("dispose",c);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function u(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function $0(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&al("WebGLRenderer: "+i+" extension not supported."),s}}}function Y0(n,e,t,i){const s={},a=new WeakMap;function r(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",r),delete s[d.id];const f=a.get(d);f&&(e.remove(f),a.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",r),s[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,p=u.attributes.position;let v=0;if(p===void 0)return;if(f!==null){const M=f.array;v=f.version;for(let _=0,x=M.length;_<x;_+=3){const y=M[_+0],E=M[_+1],A=M[_+2];d.push(y,E,E,A,A,y)}}else{const M=p.array;v=p.version;for(let _=0,x=M.length/3-1;_<x;_+=3){const y=_+0,E=_+1,A=_+2;d.push(y,E,E,A,A,y)}}const g=new(p.count>=65535?nd:id)(d,1);g.version=v;const m=a.get(u);m&&e.remove(m),a.set(u,g)}function h(u){const d=a.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return a.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function K0(n,e,t){let i;function s(u){i=u}let a,r;function o(u){a=u.type,r=u.bytesPerElement}function l(u,d){n.drawElements(i,d,a,u*r),t.update(d,i,1)}function c(u,d,f){f!==0&&(n.drawElementsInstanced(i,d,a,u*r,f),t.update(d,i,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,a,u,0,f);let v=0;for(let g=0;g<f;g++)v+=d[g];t.update(v,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function j0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:Qe("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Z0(n,e,t){const i=new WeakMap,s=new Mt;function a(r,o,l){const c=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==u){let P=function(){S.dispose(),i.delete(o),o.removeEventListener("dispose",P)};var f=P;d!==void 0&&d.texture.dispose();const p=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let x=0;p===!0&&(x=1),v===!0&&(x=2),g===!0&&(x=3);let y=o.attributes.position.count*x,E=1;y>e.maxTextureSize&&(E=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const A=new Float32Array(y*E*4*u),S=new Qh(A,y,E,u);S.type=Li,S.needsUpdate=!0;const w=x*4;for(let C=0;C<u;C++){const L=m[C],z=M[C],U=_[C],I=y*E*4*C;for(let B=0;B<L.count;B++){const N=B*w;p===!0&&(s.fromBufferAttribute(L,B),A[I+N+0]=s.x,A[I+N+1]=s.y,A[I+N+2]=s.z,A[I+N+3]=0),v===!0&&(s.fromBufferAttribute(z,B),A[I+N+4]=s.x,A[I+N+5]=s.y,A[I+N+6]=s.z,A[I+N+7]=0),g===!0&&(s.fromBufferAttribute(U,B),A[I+N+8]=s.x,A[I+N+9]=s.y,A[I+N+10]=s.z,A[I+N+11]=U.itemSize===4?s.w:1)}}d={count:u,texture:S,size:new nt(y,E)},i.set(o,d),o.addEventListener("dispose",P)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];const v=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",v),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:a}}function J0(n,e,t,i,s){let a=new WeakMap;function r(c){const h=s.render.frame,u=c.geometry,d=e.get(c,u);if(a.get(d)!==h&&(e.update(d),a.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;a.get(f)!==h&&(f.update(),a.set(f,h))}return d}function o(){a=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}const Q0={[Bh]:"LINEAR_TONE_MAPPING",[Fh]:"REINHARD_TONE_MAPPING",[Oh]:"CINEON_TONE_MAPPING",[zh]:"ACES_FILMIC_TONE_MAPPING",[Hh]:"AGX_TONE_MAPPING",[Wh]:"NEUTRAL_TONE_MAPPING",[Vh]:"CUSTOM_TONE_MAPPING"};function eg(n,e,t,i,s){const a=new Ui(e,t,{type:n,depthBuffer:i,stencilBuffer:s,depthTexture:i?new vs(e,t):void 0}),r=new Ui(e,t,{type:tn,depthBuffer:!1,stencilBuffer:!1}),o=new Ti;o.setAttribute("position",new Qt([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new Qt([0,2,0,0,2,0],2));const l=new Xf({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),c=new ft(o,l),h=new cr(-1,1,1,-1,0,1);let u=null,d=null,f=!1,p,v=null,g=[],m=!1;this.setSize=function(M,_){a.setSize(M,_),r.setSize(M,_);for(let x=0;x<g.length;x++){const y=g[x];y.setSize&&y.setSize(M,_)}},this.setEffects=function(M){g=M,m=g.length>0&&g[0].isRenderPass===!0;const _=a.width,x=a.height;for(let y=0;y<g.length;y++){const E=g[y];E.setSize&&E.setSize(_,x)}},this.begin=function(M,_){if(f||M.toneMapping===ki&&g.length===0)return!1;if(v=_,_!==null){const x=_.width,y=_.height;(a.width!==x||a.height!==y)&&this.setSize(x,y)}return m===!1&&M.setRenderTarget(a),p=M.toneMapping,M.toneMapping=ki,!0},this.hasRenderPass=function(){return m},this.end=function(M,_){M.toneMapping=p,f=!0;let x=a,y=r;for(let E=0;E<g.length;E++){const A=g[E];if(A.enabled!==!1&&(A.render(M,y,x,_),A.needsSwap!==!1)){const S=x;x=y,y=S}}if(u!==M.outputColorSpace||d!==M.toneMapping){u=M.outputColorSpace,d=M.toneMapping,l.defines={},je.getTransfer(u)===ot&&(l.defines.SRGB_TRANSFER="");const E=Q0[d];E&&(l.defines[E]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=x.texture,M.setRenderTarget(v),M.render(c,h),v=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),r.dispose(),o.dispose(),l.dispose()}}const ud=new Jt,ol=new vs(1,1),fd=new Qh,pd=new Sf,md=new sd,$c=[],Yc=[],Kc=new Float32Array(16),jc=new Float32Array(9),Zc=new Float32Array(4);function As(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=$c[s];if(a===void 0&&(a=new Float32Array(s),$c[s]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,n[r].toArray(a,o)}return a}function Bt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ft(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function dr(n,e){let t=Yc[e];t===void 0&&(t=new Int32Array(e),Yc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function tg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function ig(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Bt(t,e))return;n.uniform2fv(this.addr,e),Ft(t,e)}}function ng(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Bt(t,e))return;n.uniform3fv(this.addr,e),Ft(t,e)}}function sg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Bt(t,e))return;n.uniform4fv(this.addr,e),Ft(t,e)}}function ag(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Bt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ft(t,e)}else{if(Bt(t,i))return;Zc.set(i),n.uniformMatrix2fv(this.addr,!1,Zc),Ft(t,i)}}function rg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Bt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ft(t,e)}else{if(Bt(t,i))return;jc.set(i),n.uniformMatrix3fv(this.addr,!1,jc),Ft(t,i)}}function og(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Bt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ft(t,e)}else{if(Bt(t,i))return;Kc.set(i),n.uniformMatrix4fv(this.addr,!1,Kc),Ft(t,i)}}function lg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function cg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Bt(t,e))return;n.uniform2iv(this.addr,e),Ft(t,e)}}function hg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Bt(t,e))return;n.uniform3iv(this.addr,e),Ft(t,e)}}function dg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Bt(t,e))return;n.uniform4iv(this.addr,e),Ft(t,e)}}function ug(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function fg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Bt(t,e))return;n.uniform2uiv(this.addr,e),Ft(t,e)}}function pg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Bt(t,e))return;n.uniform3uiv(this.addr,e),Ft(t,e)}}function mg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Bt(t,e))return;n.uniform4uiv(this.addr,e),Ft(t,e)}}function gg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(ol.compareFunction=t.isReversedDepthBuffer()?Pl:Cl,a=ol):a=ud,t.setTexture2D(e||a,s)}function yg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||pd,s)}function xg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||md,s)}function vg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||fd,s)}function _g(n){switch(n){case 5126:return tg;case 35664:return ig;case 35665:return ng;case 35666:return sg;case 35674:return ag;case 35675:return rg;case 35676:return og;case 5124:case 35670:return lg;case 35667:case 35671:return cg;case 35668:case 35672:return hg;case 35669:case 35673:return dg;case 5125:return ug;case 36294:return fg;case 36295:return pg;case 36296:return mg;case 35678:case 36198:case 36298:case 36306:case 35682:return gg;case 35679:case 36299:case 36307:return yg;case 35680:case 36300:case 36308:case 36293:return xg;case 36289:case 36303:case 36311:case 36292:return vg}}function Sg(n,e){n.uniform1fv(this.addr,e)}function Mg(n,e){const t=As(e,this.size,2);n.uniform2fv(this.addr,t)}function bg(n,e){const t=As(e,this.size,3);n.uniform3fv(this.addr,t)}function Eg(n,e){const t=As(e,this.size,4);n.uniform4fv(this.addr,t)}function Tg(n,e){const t=As(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function wg(n,e){const t=As(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Ag(n,e){const t=As(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Rg(n,e){n.uniform1iv(this.addr,e)}function Cg(n,e){n.uniform2iv(this.addr,e)}function Pg(n,e){n.uniform3iv(this.addr,e)}function Ig(n,e){n.uniform4iv(this.addr,e)}function Lg(n,e){n.uniform1uiv(this.addr,e)}function Dg(n,e){n.uniform2uiv(this.addr,e)}function Ng(n,e){n.uniform3uiv(this.addr,e)}function kg(n,e){n.uniform4uiv(this.addr,e)}function Ug(n,e,t){const i=this.cache,s=e.length,a=dr(t,s);Bt(i,a)||(n.uniform1iv(this.addr,a),Ft(i,a));let r;this.type===n.SAMPLER_2D_SHADOW?r=ol:r=ud;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||r,a[o])}function Bg(n,e,t){const i=this.cache,s=e.length,a=dr(t,s);Bt(i,a)||(n.uniform1iv(this.addr,a),Ft(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||pd,a[r])}function Fg(n,e,t){const i=this.cache,s=e.length,a=dr(t,s);Bt(i,a)||(n.uniform1iv(this.addr,a),Ft(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||md,a[r])}function Og(n,e,t){const i=this.cache,s=e.length,a=dr(t,s);Bt(i,a)||(n.uniform1iv(this.addr,a),Ft(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||fd,a[r])}function zg(n){switch(n){case 5126:return Sg;case 35664:return Mg;case 35665:return bg;case 35666:return Eg;case 35674:return Tg;case 35675:return wg;case 35676:return Ag;case 5124:case 35670:return Rg;case 35667:case 35671:return Cg;case 35668:case 35672:return Pg;case 35669:case 35673:return Ig;case 5125:return Lg;case 36294:return Dg;case 36295:return Ng;case 36296:return kg;case 35678:case 36198:case 36298:case 36306:case 35682:return Ug;case 35679:case 36299:case 36307:return Bg;case 35680:case 36300:case 36308:case 36293:return Fg;case 36289:case 36303:case 36311:case 36292:return Og}}class Vg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=_g(t.type)}}class Hg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=zg(t.type)}}class Wg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],i)}}}const eo=/(\w+)(\])?(\[|\.)?/g;function Jc(n,e){n.seq.push(e),n.map[e.id]=e}function Gg(n,e,t){const i=n.name,s=i.length;for(eo.lastIndex=0;;){const a=eo.exec(i),r=eo.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){Jc(t,c===void 0?new Vg(o,n,e):new Hg(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Wg(o),Jc(t,u)),t=u}}}class Va{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const o=e.getActiveUniform(t,r),l=e.getUniformLocation(t,o.name);Gg(o,l,this)}const s=[],a=[];for(const r of this.seq)r.type===e.SAMPLER_2D_SHADOW||r.type===e.SAMPLER_CUBE_SHADOW||r.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(r):a.push(r);s.length>0&&(this.seq=s.concat(a))}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function Qc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Xg=37297;let qg=0;function $g(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const eh=new Ue;function Yg(n){je._getMatrix(eh,je.workingColorSpace,n);const e=`mat3( ${eh.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(n)){case Ya:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return Ne("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function th(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+$g(n.getShaderSource(e),o)}else return a}function Kg(n,e){const t=Yg(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const jg={[Bh]:"Linear",[Fh]:"Reinhard",[Oh]:"Cineon",[zh]:"ACESFilmic",[Hh]:"AgX",[Wh]:"Neutral",[Vh]:"Custom"};function Zg(n,e){const t=jg[e];return t===void 0?(Ne("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ea=new V;function Jg(){je.getLuminanceCoefficients(Ea);const n=Ea.x.toFixed(4),e=Ea.y.toFixed(4),t=Ea.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Qg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(zs).join(`
`)}function ey(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function ty(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:o}}return t}function zs(n){return n!==""}function ih(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function nh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const iy=/^[ \t]*#include +<([\w\d./]+)>/gm;function ll(n){return n.replace(iy,sy)}const ny=new Map;function sy(n,e){let t=We[e];if(t===void 0){const i=ny.get(e);if(i!==void 0)t=We[i],Ne('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ll(t)}const ay=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function sh(n){return n.replace(ay,ry)}function ry(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function ah(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const oy={[Ua]:"SHADOWMAP_TYPE_PCF",[Os]:"SHADOWMAP_TYPE_VSM"};function ly(n){return oy[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const cy={[Gn]:"ENVMAP_TYPE_CUBE",[xs]:"ENVMAP_TYPE_CUBE",[or]:"ENVMAP_TYPE_CUBE_UV"};function hy(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":cy[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const dy={[xs]:"ENVMAP_MODE_REFRACTION"};function uy(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":dy[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const fy={[Uh]:"ENVMAP_BLENDING_MULTIPLY",[Qu]:"ENVMAP_BLENDING_MIX",[ef]:"ENVMAP_BLENDING_ADD"};function py(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":fy[n.combine]||"ENVMAP_BLENDING_NONE"}function my(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function gy(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const l=ly(t),c=hy(t),h=uy(t),u=py(t),d=my(t),f=Qg(t),p=ey(a),v=s.createProgram();let g,m,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(zs).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(zs).join(`
`),m.length>0&&(m+=`
`)):(g=[ah(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(zs).join(`
`),m=[ah(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ki?"#define TONE_MAPPING":"",t.toneMapping!==ki?We.tonemapping_pars_fragment:"",t.toneMapping!==ki?Zg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,Kg("linearToOutputTexel",t.outputColorSpace),Jg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(zs).join(`
`)),r=ll(r),r=ih(r,t),r=nh(r,t),o=ll(o),o=ih(o,t),o=nh(o,t),r=sh(r),o=sh(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===gc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===gc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const _=M+g+r,x=M+m+o,y=Qc(s,s.VERTEX_SHADER,_),E=Qc(s,s.FRAGMENT_SHADER,x);s.attachShader(v,y),s.attachShader(v,E),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(C){if(n.debug.checkShaderErrors){const L=s.getProgramInfoLog(v)||"",z=s.getShaderInfoLog(y)||"",U=s.getShaderInfoLog(E)||"",I=L.trim(),B=z.trim(),N=U.trim();let j=!0,te=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(j=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,y,E);else{const se=th(s,y,"vertex"),ue=th(s,E,"fragment");Qe("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+I+`
`+se+`
`+ue)}else I!==""?Ne("WebGLProgram: Program Info Log:",I):(B===""||N==="")&&(te=!1);te&&(C.diagnostics={runnable:j,programLog:I,vertexShader:{log:B,prefix:g},fragmentShader:{log:N,prefix:m}})}s.deleteShader(y),s.deleteShader(E),S=new Va(s,v),w=ty(s,v)}let S;this.getUniforms=function(){return S===void 0&&A(this),S};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(v,Xg)),P},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=qg++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=y,this.fragmentShader=E,this}let yy=0;class xy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new vy(e),t.set(e,i)),i}}class vy{constructor(e){this.id=yy++,this.code=e,this.usedTimes=0}}function _y(n){return n===Xn||n===Xa||n===qa}function Sy(n,e,t,i,s,a){const r=new ed,o=new xy,l=new Set,c=[],h=new Map,u=i.logarithmicDepthBuffer;let d=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(S){return l.add(S),S===0?"uv":`uv${S}`}function v(S,w,P,C,L,z){const U=C.fog,I=L.geometry,B=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?C.environment:null,N=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap,j=e.get(S.envMap||B,N),te=j&&j.mapping===or?j.image.height:null,se=f[S.type];S.precision!==null&&(d=i.getMaxPrecision(S.precision),d!==S.precision&&Ne("WebGLProgram.getParameters:",S.precision,"not supported, using",d,"instead."));const ue=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,$=ue!==void 0?ue.length:0;let q=0;I.morphAttributes.position!==void 0&&(q=1),I.morphAttributes.normal!==void 0&&(q=2),I.morphAttributes.color!==void 0&&(q=3);let fe,ye,G,J;if(se){const Be=Ii[se];fe=Be.vertexShader,ye=Be.fragmentShader}else fe=S.vertexShader,ye=S.fragmentShader,o.update(S),G=o.getVertexShaderID(S),J=o.getFragmentShaderID(S);const K=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),Ae=L.isInstancedMesh===!0,Pe=L.isBatchedMesh===!0,st=!!S.map,De=!!S.matcap,Xe=!!j,et=!!S.aoMap,He=!!S.lightMap,Lt=!!S.bumpMap,xt=!!S.normalMap,ni=!!S.displacementMap,k=!!S.emissiveMap,Dt=!!S.metalnessMap,qe=!!S.roughnessMap,pt=S.anisotropy>0,pe=S.clearcoat>0,_t=S.dispersion>0,R=S.iridescence>0,b=S.sheen>0,O=S.transmission>0,Q=pt&&!!S.anisotropyMap,ne=pe&&!!S.clearcoatMap,ae=pe&&!!S.clearcoatNormalMap,de=pe&&!!S.clearcoatRoughnessMap,Y=R&&!!S.iridescenceMap,ee=R&&!!S.iridescenceThicknessMap,_e=b&&!!S.sheenColorMap,Ee=b&&!!S.sheenRoughnessMap,ce=!!S.specularMap,re=!!S.specularColorMap,ke=!!S.specularIntensityMap,ze=O&&!!S.transmissionMap,tt=O&&!!S.thicknessMap,D=!!S.gradientMap,oe=!!S.alphaMap,Z=S.alphaTest>0,Se=!!S.alphaHash,he=!!S.extensions;let ie=ki;S.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(ie=n.toneMapping);const Ce={shaderID:se,shaderType:S.type,shaderName:S.name,vertexShader:fe,fragmentShader:ye,defines:S.defines,customVertexShaderID:G,customFragmentShaderID:J,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:d,batching:Pe,batchingColor:Pe&&L._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&L.instanceColor!==null,instancingMorph:Ae&&L.morphTexture!==null,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:je.workingColorSpace,alphaToCoverage:!!S.alphaToCoverage,map:st,matcap:De,envMap:Xe,envMapMode:Xe&&j.mapping,envMapCubeUVHeight:te,aoMap:et,lightMap:He,bumpMap:Lt,normalMap:xt,displacementMap:ni,emissiveMap:k,normalMapObjectSpace:xt&&S.normalMapType===sf,normalMapTangentSpace:xt&&S.normalMapType===sl,packedNormalMap:xt&&S.normalMapType===sl&&_y(S.normalMap.format),metalnessMap:Dt,roughnessMap:qe,anisotropy:pt,anisotropyMap:Q,clearcoat:pe,clearcoatMap:ne,clearcoatNormalMap:ae,clearcoatRoughnessMap:de,dispersion:_t,iridescence:R,iridescenceMap:Y,iridescenceThicknessMap:ee,sheen:b,sheenColorMap:_e,sheenRoughnessMap:Ee,specularMap:ce,specularColorMap:re,specularIntensityMap:ke,transmission:O,transmissionMap:ze,thicknessMap:tt,gradientMap:D,opaque:S.transparent===!1&&S.blending===ps&&S.alphaToCoverage===!1,alphaMap:oe,alphaTest:Z,alphaHash:Se,combine:S.combine,mapUv:st&&p(S.map.channel),aoMapUv:et&&p(S.aoMap.channel),lightMapUv:He&&p(S.lightMap.channel),bumpMapUv:Lt&&p(S.bumpMap.channel),normalMapUv:xt&&p(S.normalMap.channel),displacementMapUv:ni&&p(S.displacementMap.channel),emissiveMapUv:k&&p(S.emissiveMap.channel),metalnessMapUv:Dt&&p(S.metalnessMap.channel),roughnessMapUv:qe&&p(S.roughnessMap.channel),anisotropyMapUv:Q&&p(S.anisotropyMap.channel),clearcoatMapUv:ne&&p(S.clearcoatMap.channel),clearcoatNormalMapUv:ae&&p(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&p(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Y&&p(S.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&p(S.iridescenceThicknessMap.channel),sheenColorMapUv:_e&&p(S.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&p(S.sheenRoughnessMap.channel),specularMapUv:ce&&p(S.specularMap.channel),specularColorMapUv:re&&p(S.specularColorMap.channel),specularIntensityMapUv:ke&&p(S.specularIntensityMap.channel),transmissionMapUv:ze&&p(S.transmissionMap.channel),thicknessMapUv:tt&&p(S.thicknessMap.channel),alphaMapUv:oe&&p(S.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(xt||pt),vertexNormals:!!I.attributes.normal,vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!I.attributes.uv&&(st||oe),fog:!!U,useFog:S.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:S.wireframe===!1&&(S.flatShading===!0||I.attributes.normal===void 0&&xt===!1&&(S.isMeshLambertMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isMeshPhysicalMaterial)),sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:we,skinning:L.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:$,morphTextureStride:q,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:ie,decodeVideoTexture:st&&S.map.isVideoTexture===!0&&je.getTransfer(S.map.colorSpace)===ot,decodeVideoTextureEmissive:k&&S.emissiveMap.isVideoTexture===!0&&je.getTransfer(S.emissiveMap.colorSpace)===ot,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===ji,flipSided:S.side===ii,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:he&&S.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(he&&S.extensions.multiDraw===!0||Pe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Ce.vertexUv1s=l.has(1),Ce.vertexUv2s=l.has(2),Ce.vertexUv3s=l.has(3),l.clear(),Ce}function g(S){const w=[];if(S.shaderID?w.push(S.shaderID):(w.push(S.customVertexShaderID),w.push(S.customFragmentShaderID)),S.defines!==void 0)for(const P in S.defines)w.push(P),w.push(S.defines[P]);return S.isRawShaderMaterial===!1&&(m(w,S),M(w,S),w.push(n.outputColorSpace)),w.push(S.customProgramCacheKey),w.join()}function m(S,w){S.push(w.precision),S.push(w.outputColorSpace),S.push(w.envMapMode),S.push(w.envMapCubeUVHeight),S.push(w.mapUv),S.push(w.alphaMapUv),S.push(w.lightMapUv),S.push(w.aoMapUv),S.push(w.bumpMapUv),S.push(w.normalMapUv),S.push(w.displacementMapUv),S.push(w.emissiveMapUv),S.push(w.metalnessMapUv),S.push(w.roughnessMapUv),S.push(w.anisotropyMapUv),S.push(w.clearcoatMapUv),S.push(w.clearcoatNormalMapUv),S.push(w.clearcoatRoughnessMapUv),S.push(w.iridescenceMapUv),S.push(w.iridescenceThicknessMapUv),S.push(w.sheenColorMapUv),S.push(w.sheenRoughnessMapUv),S.push(w.specularMapUv),S.push(w.specularColorMapUv),S.push(w.specularIntensityMapUv),S.push(w.transmissionMapUv),S.push(w.thicknessMapUv),S.push(w.combine),S.push(w.fogExp2),S.push(w.sizeAttenuation),S.push(w.morphTargetsCount),S.push(w.morphAttributeCount),S.push(w.numDirLights),S.push(w.numPointLights),S.push(w.numSpotLights),S.push(w.numSpotLightMaps),S.push(w.numHemiLights),S.push(w.numRectAreaLights),S.push(w.numDirLightShadows),S.push(w.numPointLightShadows),S.push(w.numSpotLightShadows),S.push(w.numSpotLightShadowsWithMaps),S.push(w.numLightProbes),S.push(w.shadowMapType),S.push(w.toneMapping),S.push(w.numClippingPlanes),S.push(w.numClipIntersection),S.push(w.depthPacking)}function M(S,w){r.disableAll(),w.instancing&&r.enable(0),w.instancingColor&&r.enable(1),w.instancingMorph&&r.enable(2),w.matcap&&r.enable(3),w.envMap&&r.enable(4),w.normalMapObjectSpace&&r.enable(5),w.normalMapTangentSpace&&r.enable(6),w.clearcoat&&r.enable(7),w.iridescence&&r.enable(8),w.alphaTest&&r.enable(9),w.vertexColors&&r.enable(10),w.vertexAlphas&&r.enable(11),w.vertexUv1s&&r.enable(12),w.vertexUv2s&&r.enable(13),w.vertexUv3s&&r.enable(14),w.vertexTangents&&r.enable(15),w.anisotropy&&r.enable(16),w.alphaHash&&r.enable(17),w.batching&&r.enable(18),w.dispersion&&r.enable(19),w.batchingColor&&r.enable(20),w.gradientMap&&r.enable(21),w.packedNormalMap&&r.enable(22),w.vertexNormals&&r.enable(23),S.push(r.mask),r.disableAll(),w.fog&&r.enable(0),w.useFog&&r.enable(1),w.flatShading&&r.enable(2),w.logarithmicDepthBuffer&&r.enable(3),w.reversedDepthBuffer&&r.enable(4),w.skinning&&r.enable(5),w.morphTargets&&r.enable(6),w.morphNormals&&r.enable(7),w.morphColors&&r.enable(8),w.premultipliedAlpha&&r.enable(9),w.shadowMapEnabled&&r.enable(10),w.doubleSided&&r.enable(11),w.flipSided&&r.enable(12),w.useDepthPacking&&r.enable(13),w.dithering&&r.enable(14),w.transmission&&r.enable(15),w.sheen&&r.enable(16),w.opaque&&r.enable(17),w.pointsUvs&&r.enable(18),w.decodeVideoTexture&&r.enable(19),w.decodeVideoTextureEmissive&&r.enable(20),w.alphaToCoverage&&r.enable(21),w.numLightProbeGrids>0&&r.enable(22),S.push(r.mask)}function _(S){const w=f[S.type];let P;if(w){const C=Ii[w];P=Hf.clone(C.uniforms)}else P=S.uniforms;return P}function x(S,w){let P=h.get(w);return P!==void 0?++P.usedTimes:(P=new gy(n,w,S,s),c.push(P),h.set(w,P)),P}function y(S){if(--S.usedTimes===0){const w=c.indexOf(S);c[w]=c[c.length-1],c.pop(),h.delete(S.cacheKey),S.destroy()}}function E(S){o.remove(S)}function A(){o.dispose()}return{getParameters:v,getProgramCacheKey:g,getUniforms:_,acquireProgram:x,releaseProgram:y,releaseShaderCache:E,programs:c,dispose:A}}function My(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,l){n.get(r)[o]=l}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function by(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function rh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function oh(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,p,v,g,m){let M=n[e];return M===void 0?(M={id:d.id,object:d,geometry:f,material:p,materialVariant:r(d),groupOrder:v,renderOrder:d.renderOrder,z:g,group:m},n[e]=M):(M.id=d.id,M.object=d,M.geometry=f,M.material=p,M.materialVariant=r(d),M.groupOrder=v,M.renderOrder=d.renderOrder,M.z=g,M.group=m),e++,M}function l(d,f,p,v,g,m){const M=o(d,f,p,v,g,m);p.transmission>0?i.push(M):p.transparent===!0?s.push(M):t.push(M)}function c(d,f,p,v,g,m){const M=o(d,f,p,v,g,m);p.transmission>0?i.unshift(M):p.transparent===!0?s.unshift(M):t.unshift(M)}function h(d,f){t.length>1&&t.sort(d||by),i.length>1&&i.sort(f||rh),s.length>1&&s.sort(f||rh)}function u(){for(let d=e,f=n.length;d<f;d++){const p=n[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:l,unshift:c,finish:u,sort:h}}function Ey(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new oh,n.set(i,[r])):s>=a.length?(r=new oh,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function Ty(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new V,color:new at};break;case"SpotLight":t={position:new V,direction:new V,color:new at,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new V,color:new at,distance:0,decay:0};break;case"HemisphereLight":t={direction:new V,skyColor:new at,groundColor:new at};break;case"RectAreaLight":t={color:new at,position:new V,halfWidth:new V,halfHeight:new V};break}return n[e.id]=t,t}}}function wy(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Ay=0;function Ry(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Cy(n){const e=new Ty,t=wy(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);const s=new V,a=new Rt,r=new Rt;function o(c){let h=0,u=0,d=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let f=0,p=0,v=0,g=0,m=0,M=0,_=0,x=0,y=0,E=0,A=0;c.sort(Ry);for(let w=0,P=c.length;w<P;w++){const C=c[w],L=C.color,z=C.intensity,U=C.distance;let I=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===Xn?I=C.shadow.map.texture:I=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=L.r*z,u+=L.g*z,d+=L.b*z;else if(C.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(C.sh.coefficients[B],z);A++}else if(C.isDirectionalLight){const B=e.get(C);if(B.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const N=C.shadow,j=t.get(C);j.shadowIntensity=N.intensity,j.shadowBias=N.bias,j.shadowNormalBias=N.normalBias,j.shadowRadius=N.radius,j.shadowMapSize=N.mapSize,i.directionalShadow[f]=j,i.directionalShadowMap[f]=I,i.directionalShadowMatrix[f]=C.shadow.matrix,M++}i.directional[f]=B,f++}else if(C.isSpotLight){const B=e.get(C);B.position.setFromMatrixPosition(C.matrixWorld),B.color.copy(L).multiplyScalar(z),B.distance=U,B.coneCos=Math.cos(C.angle),B.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),B.decay=C.decay,i.spot[v]=B;const N=C.shadow;if(C.map&&(i.spotLightMap[y]=C.map,y++,N.updateMatrices(C),C.castShadow&&E++),i.spotLightMatrix[v]=N.matrix,C.castShadow){const j=t.get(C);j.shadowIntensity=N.intensity,j.shadowBias=N.bias,j.shadowNormalBias=N.normalBias,j.shadowRadius=N.radius,j.shadowMapSize=N.mapSize,i.spotShadow[v]=j,i.spotShadowMap[v]=I,x++}v++}else if(C.isRectAreaLight){const B=e.get(C);B.color.copy(L).multiplyScalar(z),B.halfWidth.set(C.width*.5,0,0),B.halfHeight.set(0,C.height*.5,0),i.rectArea[g]=B,g++}else if(C.isPointLight){const B=e.get(C);if(B.color.copy(C.color).multiplyScalar(C.intensity),B.distance=C.distance,B.decay=C.decay,C.castShadow){const N=C.shadow,j=t.get(C);j.shadowIntensity=N.intensity,j.shadowBias=N.bias,j.shadowNormalBias=N.normalBias,j.shadowRadius=N.radius,j.shadowMapSize=N.mapSize,j.shadowCameraNear=N.camera.near,j.shadowCameraFar=N.camera.far,i.pointShadow[p]=j,i.pointShadowMap[p]=I,i.pointShadowMatrix[p]=C.shadow.matrix,_++}i.point[p]=B,p++}else if(C.isHemisphereLight){const B=e.get(C);B.skyColor.copy(C.color).multiplyScalar(z),B.groundColor.copy(C.groundColor).multiplyScalar(z),i.hemi[m]=B,m++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const S=i.hash;(S.directionalLength!==f||S.pointLength!==p||S.spotLength!==v||S.rectAreaLength!==g||S.hemiLength!==m||S.numDirectionalShadows!==M||S.numPointShadows!==_||S.numSpotShadows!==x||S.numSpotMaps!==y||S.numLightProbes!==A)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=g,i.point.length=p,i.hemi.length=m,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=x+y-E,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,S.directionalLength=f,S.pointLength=p,S.spotLength=v,S.rectAreaLength=g,S.hemiLength=m,S.numDirectionalShadows=M,S.numPointShadows=_,S.numSpotShadows=x,S.numSpotMaps=y,S.numLightProbes=A,i.version=Ay++)}function l(c,h){let u=0,d=0,f=0,p=0,v=0;const g=h.matrixWorldInverse;for(let m=0,M=c.length;m<M;m++){const _=c[m];if(_.isDirectionalLight){const x=i.directional[u];x.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),u++}else if(_.isSpotLight){const x=i.spot[f];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),f++}else if(_.isRectAreaLight){const x=i.rectArea[p];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(g),r.identity(),a.copy(_.matrixWorld),a.premultiply(g),r.extractRotation(a),x.halfWidth.set(_.width*.5,0,0),x.halfHeight.set(0,_.height*.5,0),x.halfWidth.applyMatrix4(r),x.halfHeight.applyMatrix4(r),p++}else if(_.isPointLight){const x=i.point[d];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(g),d++}else if(_.isHemisphereLight){const x=i.hemi[v];x.direction.setFromMatrixPosition(_.matrixWorld),x.direction.transformDirection(g),v++}}}return{setup:o,setupView:l,state:i}}function lh(n){const e=new Cy(n),t=[],i=[],s=[];function a(d){u.camera=d,t.length=0,i.length=0,s.length=0}function r(d){t.push(d)}function o(d){i.push(d)}function l(d){s.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const u={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:c,setupLightsView:h,pushLight:r,pushShadow:o,pushLightProbeGrid:l}}function Py(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new lh(n),e.set(s,[o])):a>=r.length?(o=new lh(n),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Iy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ly=`uniform sampler2D shadow_pass;
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
}`,Dy=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],Ny=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],ch=new Rt,Us=new V,to=new V;function ky(n,e,t){let i=new Dl;const s=new nt,a=new nt,r=new Mt,o=new qf,l=new $f,c={},h=t.maxTextureSize,u={[bn]:ii,[ii]:bn,[ji]:ji},d=new zi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new nt},radius:{value:4}},vertexShader:Iy,fragmentShader:Ly}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new Ti;p.setAttribute("position",new Bi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ft(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ua;let m=this.type;this.render=function(E,A,S){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;this.type===Nu&&(Ne("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Ua);const w=n.getRenderTarget(),P=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),L=n.state;L.setBlending(Qi),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const z=m!==this.type;z&&A.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(I=>I.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,I=E.length;U<I;U++){const B=E[U],N=B.shadow;if(N===void 0){Ne("WebGLShadowMap:",B,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;s.copy(N.mapSize);const j=N.getFrameExtents();s.multiply(j),a.copy(N.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/j.x),s.x=a.x*j.x,N.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/j.y),s.y=a.y*j.y,N.mapSize.y=a.y));const te=n.state.buffers.depth.getReversed();if(N.camera._reversedDepth=te,N.map===null||z===!0){if(N.map!==null&&(N.map.depthTexture!==null&&(N.map.depthTexture.dispose(),N.map.depthTexture=null),N.map.dispose()),this.type===Os){if(B.isPointLight){Ne("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}N.map=new Ui(s.x,s.y,{format:Xn,type:tn,minFilter:$t,magFilter:$t,generateMipmaps:!1}),N.map.texture.name=B.name+".shadowMap",N.map.depthTexture=new vs(s.x,s.y,Li),N.map.depthTexture.name=B.name+".shadowMapDepth",N.map.depthTexture.format=nn,N.map.depthTexture.compareFunction=null,N.map.depthTexture.minFilter=Vt,N.map.depthTexture.magFilter=Vt}else B.isPointLight?(N.map=new dd(s.x),N.map.depthTexture=new zf(s.x,Oi)):(N.map=new Ui(s.x,s.y),N.map.depthTexture=new vs(s.x,s.y,Oi)),N.map.depthTexture.name=B.name+".shadowMap",N.map.depthTexture.format=nn,this.type===Ua?(N.map.depthTexture.compareFunction=te?Pl:Cl,N.map.depthTexture.minFilter=$t,N.map.depthTexture.magFilter=$t):(N.map.depthTexture.compareFunction=null,N.map.depthTexture.minFilter=Vt,N.map.depthTexture.magFilter=Vt);N.camera.updateProjectionMatrix()}const se=N.map.isWebGLCubeRenderTarget?6:1;for(let ue=0;ue<se;ue++){if(N.map.isWebGLCubeRenderTarget)n.setRenderTarget(N.map,ue),n.clear();else{ue===0&&(n.setRenderTarget(N.map),n.clear());const $=N.getViewport(ue);r.set(a.x*$.x,a.y*$.y,a.x*$.z,a.y*$.w),L.viewport(r)}if(B.isPointLight){const $=N.camera,q=N.matrix,fe=B.distance||$.far;fe!==$.far&&($.far=fe,$.updateProjectionMatrix()),Us.setFromMatrixPosition(B.matrixWorld),$.position.copy(Us),to.copy($.position),to.add(Dy[ue]),$.up.copy(Ny[ue]),$.lookAt(to),$.updateMatrixWorld(),q.makeTranslation(-Us.x,-Us.y,-Us.z),ch.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),N._frustum.setFromProjectionMatrix(ch,$.coordinateSystem,$.reversedDepth)}else N.updateMatrices(B);i=N.getFrustum(),x(A,S,N.camera,B,this.type)}N.isPointLightShadow!==!0&&this.type===Os&&M(N,S),N.needsUpdate=!1}m=this.type,g.needsUpdate=!1,n.setRenderTarget(w,P,C)};function M(E,A){const S=e.update(v);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Ui(s.x,s.y,{format:Xn,type:tn})),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(A,null,S,d,v,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(A,null,S,f,v,null)}function _(E,A,S,w){let P=null;const C=S.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(C!==void 0)P=C;else if(P=S.isPointLight===!0?l:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const L=P.uuid,z=A.uuid;let U=c[L];U===void 0&&(U={},c[L]=U);let I=U[z];I===void 0&&(I=P.clone(),U[z]=I,A.addEventListener("dispose",y)),P=I}if(P.visible=A.visible,P.wireframe=A.wireframe,w===Os?P.side=A.shadowSide!==null?A.shadowSide:A.side:P.side=A.shadowSide!==null?A.shadowSide:u[A.side],P.alphaMap=A.alphaMap,P.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,P.map=A.map,P.clipShadows=A.clipShadows,P.clippingPlanes=A.clippingPlanes,P.clipIntersection=A.clipIntersection,P.displacementMap=A.displacementMap,P.displacementScale=A.displacementScale,P.displacementBias=A.displacementBias,P.wireframeLinewidth=A.wireframeLinewidth,P.linewidth=A.linewidth,S.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const L=n.properties.get(P);L.light=S}return P}function x(E,A,S,w,P){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&P===Os)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,E.matrixWorld);const z=e.update(E),U=E.material;if(Array.isArray(U)){const I=z.groups;for(let B=0,N=I.length;B<N;B++){const j=I[B],te=U[j.materialIndex];if(te&&te.visible){const se=_(E,te,w,P);E.onBeforeShadow(n,E,A,S,z,se,j),n.renderBufferDirect(S,null,z,se,E,j),E.onAfterShadow(n,E,A,S,z,se,j)}}}else if(U.visible){const I=_(E,U,w,P);E.onBeforeShadow(n,E,A,S,z,I,null),n.renderBufferDirect(S,null,z,I,E,null),E.onAfterShadow(n,E,A,S,z,I,null)}}const L=E.children;for(let z=0,U=L.length;z<U;z++)x(L[z],A,S,w,P)}function y(E){E.target.removeEventListener("dispose",y);for(const S in c){const w=c[S],P=E.target.uuid;P in w&&(w[P].dispose(),delete w[P])}}}function Uy(n,e){function t(){let D=!1;const oe=new Mt;let Z=null;const Se=new Mt(0,0,0,0);return{setMask:function(he){Z!==he&&!D&&(n.colorMask(he,he,he,he),Z=he)},setLocked:function(he){D=he},setClear:function(he,ie,Ce,Be,bt){bt===!0&&(he*=Be,ie*=Be,Ce*=Be),oe.set(he,ie,Ce,Be),Se.equals(oe)===!1&&(n.clearColor(he,ie,Ce,Be),Se.copy(oe))},reset:function(){D=!1,Z=null,Se.set(-1,0,0,0)}}}function i(){let D=!1,oe=!1,Z=null,Se=null,he=null;return{setReversed:function(ie){if(oe!==ie){const Ce=e.get("EXT_clip_control");ie?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),oe=ie;const Be=he;he=null,this.setClear(Be)}},getReversed:function(){return oe},setTest:function(ie){ie?K(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(ie){Z!==ie&&!D&&(n.depthMask(ie),Z=ie)},setFunc:function(ie){if(oe&&(ie=pf[ie]),Se!==ie){switch(ie){case vo:n.depthFunc(n.NEVER);break;case _o:n.depthFunc(n.ALWAYS);break;case So:n.depthFunc(n.LESS);break;case ys:n.depthFunc(n.LEQUAL);break;case Mo:n.depthFunc(n.EQUAL);break;case bo:n.depthFunc(n.GEQUAL);break;case Eo:n.depthFunc(n.GREATER);break;case To:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Se=ie}},setLocked:function(ie){D=ie},setClear:function(ie){he!==ie&&(he=ie,oe&&(ie=1-ie),n.clearDepth(ie))},reset:function(){D=!1,Z=null,Se=null,he=null,oe=!1}}}function s(){let D=!1,oe=null,Z=null,Se=null,he=null,ie=null,Ce=null,Be=null,bt=null;return{setTest:function(lt){D||(lt?K(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(lt){oe!==lt&&!D&&(n.stencilMask(lt),oe=lt)},setFunc:function(lt,Vi,wi){(Z!==lt||Se!==Vi||he!==wi)&&(n.stencilFunc(lt,Vi,wi),Z=lt,Se=Vi,he=wi)},setOp:function(lt,Vi,wi){(ie!==lt||Ce!==Vi||Be!==wi)&&(n.stencilOp(lt,Vi,wi),ie=lt,Ce=Vi,Be=wi)},setLocked:function(lt){D=lt},setClear:function(lt){bt!==lt&&(n.clearStencil(lt),bt=lt)},reset:function(){D=!1,oe=null,Z=null,Se=null,he=null,ie=null,Ce=null,Be=null,bt=null}}}const a=new t,r=new i,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},d={},f=new WeakMap,p=[],v=null,g=!1,m=null,M=null,_=null,x=null,y=null,E=null,A=null,S=new at(0,0,0),w=0,P=!1,C=null,L=null,z=null,U=null,I=null;const B=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,j=0;const te=n.getParameter(n.VERSION);te.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(te)[1]),N=j>=1):te.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),N=j>=2);let se=null,ue={};const $=n.getParameter(n.SCISSOR_BOX),q=n.getParameter(n.VIEWPORT),fe=new Mt().fromArray($),ye=new Mt().fromArray(q);function G(D,oe,Z,Se){const he=new Uint8Array(4),ie=n.createTexture();n.bindTexture(D,ie),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ce=0;Ce<Z;Ce++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(oe,0,n.RGBA,1,1,Se,0,n.RGBA,n.UNSIGNED_BYTE,he):n.texImage2D(oe+Ce,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,he);return ie}const J={};J[n.TEXTURE_2D]=G(n.TEXTURE_2D,n.TEXTURE_2D,1),J[n.TEXTURE_CUBE_MAP]=G(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[n.TEXTURE_2D_ARRAY]=G(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),J[n.TEXTURE_3D]=G(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),K(n.DEPTH_TEST),r.setFunc(ys),Lt(!1),xt(dc),K(n.CULL_FACE),et(Qi);function K(D){h[D]!==!0&&(n.enable(D),h[D]=!0)}function we(D){h[D]!==!1&&(n.disable(D),h[D]=!1)}function Ae(D,oe){return d[D]!==oe?(n.bindFramebuffer(D,oe),d[D]=oe,D===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=oe),D===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=oe),!0):!1}function Pe(D,oe){let Z=p,Se=!1;if(D){Z=f.get(oe),Z===void 0&&(Z=[],f.set(oe,Z));const he=D.textures;if(Z.length!==he.length||Z[0]!==n.COLOR_ATTACHMENT0){for(let ie=0,Ce=he.length;ie<Ce;ie++)Z[ie]=n.COLOR_ATTACHMENT0+ie;Z.length=he.length,Se=!0}}else Z[0]!==n.BACK&&(Z[0]=n.BACK,Se=!0);Se&&n.drawBuffers(Z)}function st(D){return v!==D?(n.useProgram(D),v=D,!0):!1}const De={[kn]:n.FUNC_ADD,[Uu]:n.FUNC_SUBTRACT,[Bu]:n.FUNC_REVERSE_SUBTRACT};De[Fu]=n.MIN,De[Ou]=n.MAX;const Xe={[zu]:n.ZERO,[Vu]:n.ONE,[Hu]:n.SRC_COLOR,[yo]:n.SRC_ALPHA,[Yu]:n.SRC_ALPHA_SATURATE,[qu]:n.DST_COLOR,[Gu]:n.DST_ALPHA,[Wu]:n.ONE_MINUS_SRC_COLOR,[xo]:n.ONE_MINUS_SRC_ALPHA,[$u]:n.ONE_MINUS_DST_COLOR,[Xu]:n.ONE_MINUS_DST_ALPHA,[Ku]:n.CONSTANT_COLOR,[ju]:n.ONE_MINUS_CONSTANT_COLOR,[Zu]:n.CONSTANT_ALPHA,[Ju]:n.ONE_MINUS_CONSTANT_ALPHA};function et(D,oe,Z,Se,he,ie,Ce,Be,bt,lt){if(D===Qi){g===!0&&(we(n.BLEND),g=!1);return}if(g===!1&&(K(n.BLEND),g=!0),D!==ku){if(D!==m||lt!==P){if((M!==kn||y!==kn)&&(n.blendEquation(n.FUNC_ADD),M=kn,y=kn),lt)switch(D){case ps:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case go:n.blendFunc(n.ONE,n.ONE);break;case uc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case fc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Qe("WebGLState: Invalid blending: ",D);break}else switch(D){case ps:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case go:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case uc:Qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case fc:Qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Qe("WebGLState: Invalid blending: ",D);break}_=null,x=null,E=null,A=null,S.set(0,0,0),w=0,m=D,P=lt}return}he=he||oe,ie=ie||Z,Ce=Ce||Se,(oe!==M||he!==y)&&(n.blendEquationSeparate(De[oe],De[he]),M=oe,y=he),(Z!==_||Se!==x||ie!==E||Ce!==A)&&(n.blendFuncSeparate(Xe[Z],Xe[Se],Xe[ie],Xe[Ce]),_=Z,x=Se,E=ie,A=Ce),(Be.equals(S)===!1||bt!==w)&&(n.blendColor(Be.r,Be.g,Be.b,bt),S.copy(Be),w=bt),m=D,P=!1}function He(D,oe){D.side===ji?we(n.CULL_FACE):K(n.CULL_FACE);let Z=D.side===ii;oe&&(Z=!Z),Lt(Z),D.blending===ps&&D.transparent===!1?et(Qi):et(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),a.setMask(D.colorWrite);const Se=D.stencilWrite;o.setTest(Se),Se&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),k(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function Lt(D){C!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),C=D)}function xt(D){D!==Lu?(K(n.CULL_FACE),D!==L&&(D===dc?n.cullFace(n.BACK):D===Du?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),L=D}function ni(D){D!==z&&(N&&n.lineWidth(D),z=D)}function k(D,oe,Z){D?(K(n.POLYGON_OFFSET_FILL),(U!==oe||I!==Z)&&(U=oe,I=Z,r.getReversed()&&(oe=-oe),n.polygonOffset(oe,Z))):we(n.POLYGON_OFFSET_FILL)}function Dt(D){D?K(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function qe(D){D===void 0&&(D=n.TEXTURE0+B-1),se!==D&&(n.activeTexture(D),se=D)}function pt(D,oe,Z){Z===void 0&&(se===null?Z=n.TEXTURE0+B-1:Z=se);let Se=ue[Z];Se===void 0&&(Se={type:void 0,texture:void 0},ue[Z]=Se),(Se.type!==D||Se.texture!==oe)&&(se!==Z&&(n.activeTexture(Z),se=Z),n.bindTexture(D,oe||J[D]),Se.type=D,Se.texture=oe)}function pe(){const D=ue[se];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function _t(){try{n.compressedTexImage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function R(){try{n.compressedTexImage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function b(){try{n.texSubImage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function O(){try{n.texSubImage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function Q(){try{n.compressedTexSubImage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function ne(){try{n.compressedTexSubImage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function ae(){try{n.texStorage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function de(){try{n.texStorage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function Y(){try{n.texImage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function ee(){try{n.texImage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function _e(D){return u[D]!==void 0?u[D]:n.getParameter(D)}function Ee(D,oe){u[D]!==oe&&(n.pixelStorei(D,oe),u[D]=oe)}function ce(D){fe.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),fe.copy(D))}function re(D){ye.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),ye.copy(D))}function ke(D,oe){let Z=c.get(oe);Z===void 0&&(Z=new WeakMap,c.set(oe,Z));let Se=Z.get(D);Se===void 0&&(Se=n.getUniformBlockIndex(oe,D.name),Z.set(D,Se))}function ze(D,oe){const Se=c.get(oe).get(D);l.get(oe)!==Se&&(n.uniformBlockBinding(oe,Se,D.__bindingPointIndex),l.set(oe,Se))}function tt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},u={},se=null,ue={},d={},f=new WeakMap,p=[],v=null,g=!1,m=null,M=null,_=null,x=null,y=null,E=null,A=null,S=new at(0,0,0),w=0,P=!1,C=null,L=null,z=null,U=null,I=null,fe.set(0,0,n.canvas.width,n.canvas.height),ye.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:K,disable:we,bindFramebuffer:Ae,drawBuffers:Pe,useProgram:st,setBlending:et,setMaterial:He,setFlipSided:Lt,setCullFace:xt,setLineWidth:ni,setPolygonOffset:k,setScissorTest:Dt,activeTexture:qe,bindTexture:pt,unbindTexture:pe,compressedTexImage2D:_t,compressedTexImage3D:R,texImage2D:Y,texImage3D:ee,pixelStorei:Ee,getParameter:_e,updateUBOMapping:ke,uniformBlockBinding:ze,texStorage2D:ae,texStorage3D:de,texSubImage2D:b,texSubImage3D:O,compressedTexSubImage2D:Q,compressedTexSubImage3D:ne,scissor:ce,viewport:re,reset:tt}}function By(n,e,t,i,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new nt,h=new WeakMap,u=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(R,b){return p?new OffscreenCanvas(R,b):Ka("canvas")}function g(R,b,O){let Q=1;const ne=_t(R);if((ne.width>O||ne.height>O)&&(Q=O/Math.max(ne.width,ne.height)),Q<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const ae=Math.floor(Q*ne.width),de=Math.floor(Q*ne.height);d===void 0&&(d=v(ae,de));const Y=b?v(ae,de):d;return Y.width=ae,Y.height=de,Y.getContext("2d").drawImage(R,0,0,ae,de),Ne("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+ae+"x"+de+")."),Y}else return"data"in R&&Ne("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),R;return R}function m(R){return R.generateMipmaps}function M(R){n.generateMipmap(R)}function _(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(R,b,O,Q,ne,ae=!1){if(R!==null){if(n[R]!==void 0)return n[R];Ne("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let de;Q&&(de=e.get("EXT_texture_norm16"),de||Ne("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Y=b;if(b===n.RED&&(O===n.FLOAT&&(Y=n.R32F),O===n.HALF_FLOAT&&(Y=n.R16F),O===n.UNSIGNED_BYTE&&(Y=n.R8),O===n.UNSIGNED_SHORT&&de&&(Y=de.R16_EXT),O===n.SHORT&&de&&(Y=de.R16_SNORM_EXT)),b===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.R8UI),O===n.UNSIGNED_SHORT&&(Y=n.R16UI),O===n.UNSIGNED_INT&&(Y=n.R32UI),O===n.BYTE&&(Y=n.R8I),O===n.SHORT&&(Y=n.R16I),O===n.INT&&(Y=n.R32I)),b===n.RG&&(O===n.FLOAT&&(Y=n.RG32F),O===n.HALF_FLOAT&&(Y=n.RG16F),O===n.UNSIGNED_BYTE&&(Y=n.RG8),O===n.UNSIGNED_SHORT&&de&&(Y=de.RG16_EXT),O===n.SHORT&&de&&(Y=de.RG16_SNORM_EXT)),b===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RG8UI),O===n.UNSIGNED_SHORT&&(Y=n.RG16UI),O===n.UNSIGNED_INT&&(Y=n.RG32UI),O===n.BYTE&&(Y=n.RG8I),O===n.SHORT&&(Y=n.RG16I),O===n.INT&&(Y=n.RG32I)),b===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RGB8UI),O===n.UNSIGNED_SHORT&&(Y=n.RGB16UI),O===n.UNSIGNED_INT&&(Y=n.RGB32UI),O===n.BYTE&&(Y=n.RGB8I),O===n.SHORT&&(Y=n.RGB16I),O===n.INT&&(Y=n.RGB32I)),b===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(Y=n.RGBA16UI),O===n.UNSIGNED_INT&&(Y=n.RGBA32UI),O===n.BYTE&&(Y=n.RGBA8I),O===n.SHORT&&(Y=n.RGBA16I),O===n.INT&&(Y=n.RGBA32I)),b===n.RGB&&(O===n.UNSIGNED_SHORT&&de&&(Y=de.RGB16_EXT),O===n.SHORT&&de&&(Y=de.RGB16_SNORM_EXT),O===n.UNSIGNED_INT_5_9_9_9_REV&&(Y=n.RGB9_E5),O===n.UNSIGNED_INT_10F_11F_11F_REV&&(Y=n.R11F_G11F_B10F)),b===n.RGBA){const ee=ae?Ya:je.getTransfer(ne);O===n.FLOAT&&(Y=n.RGBA32F),O===n.HALF_FLOAT&&(Y=n.RGBA16F),O===n.UNSIGNED_BYTE&&(Y=ee===ot?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT&&de&&(Y=de.RGBA16_EXT),O===n.SHORT&&de&&(Y=de.RGBA16_SNORM_EXT),O===n.UNSIGNED_SHORT_4_4_4_4&&(Y=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(Y=n.RGB5_A1)}return(Y===n.R16F||Y===n.R32F||Y===n.RG16F||Y===n.RG32F||Y===n.RGBA16F||Y===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function y(R,b){let O;return R?b===null||b===Oi||b===$s?O=n.DEPTH24_STENCIL8:b===Li?O=n.DEPTH32F_STENCIL8:b===qs&&(O=n.DEPTH24_STENCIL8,Ne("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Oi||b===$s?O=n.DEPTH_COMPONENT24:b===Li?O=n.DEPTH_COMPONENT32F:b===qs&&(O=n.DEPTH_COMPONENT16),O}function E(R,b){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Vt&&R.minFilter!==$t?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}function A(R){const b=R.target;b.removeEventListener("dispose",A),w(b),b.isVideoTexture&&h.delete(b),b.isHTMLTexture&&u.delete(b)}function S(R){const b=R.target;b.removeEventListener("dispose",S),C(b)}function w(R){const b=i.get(R);if(b.__webglInit===void 0)return;const O=R.source,Q=f.get(O);if(Q){const ne=Q[b.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&P(R),Object.keys(Q).length===0&&f.delete(O)}i.remove(R)}function P(R){const b=i.get(R);n.deleteTexture(b.__webglTexture);const O=R.source,Q=f.get(O);delete Q[b.__cacheKey],r.memory.textures--}function C(R){const b=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(b.__webglFramebuffer[Q]))for(let ne=0;ne<b.__webglFramebuffer[Q].length;ne++)n.deleteFramebuffer(b.__webglFramebuffer[Q][ne]);else n.deleteFramebuffer(b.__webglFramebuffer[Q]);b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer[Q])}else{if(Array.isArray(b.__webglFramebuffer))for(let Q=0;Q<b.__webglFramebuffer.length;Q++)n.deleteFramebuffer(b.__webglFramebuffer[Q]);else n.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&n.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let Q=0;Q<b.__webglColorRenderbuffer.length;Q++)b.__webglColorRenderbuffer[Q]&&n.deleteRenderbuffer(b.__webglColorRenderbuffer[Q]);b.__webglDepthRenderbuffer&&n.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const O=R.textures;for(let Q=0,ne=O.length;Q<ne;Q++){const ae=i.get(O[Q]);ae.__webglTexture&&(n.deleteTexture(ae.__webglTexture),r.memory.textures--),i.remove(O[Q])}i.remove(R)}let L=0;function z(){L=0}function U(){return L}function I(R){L=R}function B(){const R=L;return R>=s.maxTextures&&Ne("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),L+=1,R}function N(R){const b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}function j(R,b){const O=i.get(R);if(R.isVideoTexture&&pt(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){const Q=R.image;if(Q===null)Ne("WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)Ne("WebGLRenderer: Texture marked for update but image is incomplete");else{we(O,R,b);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+b)}function te(R,b){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){we(O,R,b);return}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+b)}function se(R,b){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){we(O,R,b);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+b)}function ue(R,b){const O=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&O.__version!==R.version){Ae(O,R,b);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+b)}const $={[wo]:n.REPEAT,[Zi]:n.CLAMP_TO_EDGE,[Ao]:n.MIRRORED_REPEAT},q={[Vt]:n.NEAREST,[tf]:n.NEAREST_MIPMAP_NEAREST,[na]:n.NEAREST_MIPMAP_LINEAR,[$t]:n.LINEAR,[br]:n.LINEAR_MIPMAP_NEAREST,[Bn]:n.LINEAR_MIPMAP_LINEAR},fe={[af]:n.NEVER,[hf]:n.ALWAYS,[rf]:n.LESS,[Cl]:n.LEQUAL,[of]:n.EQUAL,[Pl]:n.GEQUAL,[lf]:n.GREATER,[cf]:n.NOTEQUAL};function ye(R,b){if(b.type===Li&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===$t||b.magFilter===br||b.magFilter===na||b.magFilter===Bn||b.minFilter===$t||b.minFilter===br||b.minFilter===na||b.minFilter===Bn)&&Ne("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,$[b.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,$[b.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,$[b.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,q[b.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,q[b.minFilter]),b.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,fe[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Vt||b.minFilter!==na&&b.minFilter!==Bn||b.type===Li&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function G(R,b){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",A));const Q=b.source;let ne=f.get(Q);ne===void 0&&(ne={},f.set(Q,ne));const ae=N(b);if(ae!==R.__cacheKey){ne[ae]===void 0&&(ne[ae]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,O=!0),ne[ae].usedTimes++;const de=ne[R.__cacheKey];de!==void 0&&(ne[R.__cacheKey].usedTimes--,de.usedTimes===0&&P(b)),R.__cacheKey=ae,R.__webglTexture=ne[ae].texture}return O}function J(R,b,O){return Math.floor(Math.floor(R/O)/b)}function K(R,b,O,Q){const ae=R.updateRanges;if(ae.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,b.width,b.height,O,Q,b.data);else{ae.sort((Ee,ce)=>Ee.start-ce.start);let de=0;for(let Ee=1;Ee<ae.length;Ee++){const ce=ae[de],re=ae[Ee],ke=ce.start+ce.count,ze=J(re.start,b.width,4),tt=J(ce.start,b.width,4);re.start<=ke+1&&ze===tt&&J(re.start+re.count-1,b.width,4)===ze?ce.count=Math.max(ce.count,re.start+re.count-ce.start):(++de,ae[de]=re)}ae.length=de+1;const Y=t.getParameter(n.UNPACK_ROW_LENGTH),ee=t.getParameter(n.UNPACK_SKIP_PIXELS),_e=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,b.width);for(let Ee=0,ce=ae.length;Ee<ce;Ee++){const re=ae[Ee],ke=Math.floor(re.start/4),ze=Math.ceil(re.count/4),tt=ke%b.width,D=Math.floor(ke/b.width),oe=ze,Z=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,tt),t.pixelStorei(n.UNPACK_SKIP_ROWS,D),t.texSubImage2D(n.TEXTURE_2D,0,tt,D,oe,Z,O,Q,b.data)}R.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,Y),t.pixelStorei(n.UNPACK_SKIP_PIXELS,ee),t.pixelStorei(n.UNPACK_SKIP_ROWS,_e)}}function we(R,b,O){let Q=n.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(Q=n.TEXTURE_2D_ARRAY),b.isData3DTexture&&(Q=n.TEXTURE_3D);const ne=G(R,b),ae=b.source;t.bindTexture(Q,R.__webglTexture,n.TEXTURE0+O);const de=i.get(ae);if(ae.version!==de.__version||ne===!0){if(t.activeTexture(n.TEXTURE0+O),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){const Z=je.getPrimaries(je.workingColorSpace),Se=b.colorSpace===pn?null:je.getPrimaries(b.colorSpace),he=b.colorSpace===pn||Z===Se?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,he)}t.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment);let ee=g(b.image,!1,s.maxTextureSize);ee=pe(b,ee);const _e=a.convert(b.format,b.colorSpace),Ee=a.convert(b.type);let ce=x(b.internalFormat,_e,Ee,b.normalized,b.colorSpace,b.isVideoTexture);ye(Q,b);let re;const ke=b.mipmaps,ze=b.isVideoTexture!==!0,tt=de.__version===void 0||ne===!0,D=ae.dataReady,oe=E(b,ee);if(b.isDepthTexture)ce=y(b.format===Fn,b.type),tt&&(ze?t.texStorage2D(n.TEXTURE_2D,1,ce,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,ce,ee.width,ee.height,0,_e,Ee,null));else if(b.isDataTexture)if(ke.length>0){ze&&tt&&t.texStorage2D(n.TEXTURE_2D,oe,ce,ke[0].width,ke[0].height);for(let Z=0,Se=ke.length;Z<Se;Z++)re=ke[Z],ze?D&&t.texSubImage2D(n.TEXTURE_2D,Z,0,0,re.width,re.height,_e,Ee,re.data):t.texImage2D(n.TEXTURE_2D,Z,ce,re.width,re.height,0,_e,Ee,re.data);b.generateMipmaps=!1}else ze?(tt&&t.texStorage2D(n.TEXTURE_2D,oe,ce,ee.width,ee.height),D&&K(b,ee,_e,Ee)):t.texImage2D(n.TEXTURE_2D,0,ce,ee.width,ee.height,0,_e,Ee,ee.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){ze&&tt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,oe,ce,ke[0].width,ke[0].height,ee.depth);for(let Z=0,Se=ke.length;Z<Se;Z++)if(re=ke[Z],b.format!==bi)if(_e!==null)if(ze){if(D)if(b.layerUpdates.size>0){const he=zc(re.width,re.height,b.format,b.type);for(const ie of b.layerUpdates){const Ce=re.data.subarray(ie*he/re.data.BYTES_PER_ELEMENT,(ie+1)*he/re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,ie,re.width,re.height,1,_e,Ce)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,0,re.width,re.height,ee.depth,_e,re.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Z,ce,re.width,re.height,ee.depth,0,re.data,0,0);else Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ze?D&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,0,re.width,re.height,ee.depth,_e,Ee,re.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Z,ce,re.width,re.height,ee.depth,0,_e,Ee,re.data)}else{ze&&tt&&t.texStorage2D(n.TEXTURE_2D,oe,ce,ke[0].width,ke[0].height);for(let Z=0,Se=ke.length;Z<Se;Z++)re=ke[Z],b.format!==bi?_e!==null?ze?D&&t.compressedTexSubImage2D(n.TEXTURE_2D,Z,0,0,re.width,re.height,_e,re.data):t.compressedTexImage2D(n.TEXTURE_2D,Z,ce,re.width,re.height,0,re.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ze?D&&t.texSubImage2D(n.TEXTURE_2D,Z,0,0,re.width,re.height,_e,Ee,re.data):t.texImage2D(n.TEXTURE_2D,Z,ce,re.width,re.height,0,_e,Ee,re.data)}else if(b.isDataArrayTexture)if(ze){if(tt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,oe,ce,ee.width,ee.height,ee.depth),D)if(b.layerUpdates.size>0){const Z=zc(ee.width,ee.height,b.format,b.type);for(const Se of b.layerUpdates){const he=ee.data.subarray(Se*Z/ee.data.BYTES_PER_ELEMENT,(Se+1)*Z/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Se,ee.width,ee.height,1,_e,Ee,he)}b.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,_e,Ee,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ce,ee.width,ee.height,ee.depth,0,_e,Ee,ee.data);else if(b.isData3DTexture)ze?(tt&&t.texStorage3D(n.TEXTURE_3D,oe,ce,ee.width,ee.height,ee.depth),D&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,_e,Ee,ee.data)):t.texImage3D(n.TEXTURE_3D,0,ce,ee.width,ee.height,ee.depth,0,_e,Ee,ee.data);else if(b.isFramebufferTexture){if(tt)if(ze)t.texStorage2D(n.TEXTURE_2D,oe,ce,ee.width,ee.height);else{let Z=ee.width,Se=ee.height;for(let he=0;he<oe;he++)t.texImage2D(n.TEXTURE_2D,he,ce,Z,Se,0,_e,Ee,null),Z>>=1,Se>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in n){const Z=n.canvas;if(Z.hasAttribute("layoutsubtree")||Z.setAttribute("layoutsubtree","true"),ee.parentNode!==Z){Z.appendChild(ee),u.add(b),Z.onpaint=Be=>{const bt=Be.changedElements;for(const lt of u)bt.includes(lt.image)&&(lt.needsUpdate=!0)},Z.requestPaint();return}const Se=0,he=n.RGBA,ie=n.RGBA,Ce=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,Se,he,ie,Ce,ee),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(ke.length>0){if(ze&&tt){const Z=_t(ke[0]);t.texStorage2D(n.TEXTURE_2D,oe,ce,Z.width,Z.height)}for(let Z=0,Se=ke.length;Z<Se;Z++)re=ke[Z],ze?D&&t.texSubImage2D(n.TEXTURE_2D,Z,0,0,_e,Ee,re):t.texImage2D(n.TEXTURE_2D,Z,ce,_e,Ee,re);b.generateMipmaps=!1}else if(ze){if(tt){const Z=_t(ee);t.texStorage2D(n.TEXTURE_2D,oe,ce,Z.width,Z.height)}D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,_e,Ee,ee)}else t.texImage2D(n.TEXTURE_2D,0,ce,_e,Ee,ee);m(b)&&M(Q),de.__version=ae.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function Ae(R,b,O){if(b.image.length!==6)return;const Q=G(R,b),ne=b.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+O);const ae=i.get(ne);if(ne.version!==ae.__version||Q===!0){t.activeTexture(n.TEXTURE0+O);const de=je.getPrimaries(je.workingColorSpace),Y=b.colorSpace===pn?null:je.getPrimaries(b.colorSpace),ee=b.colorSpace===pn||de===Y?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);const _e=b.isCompressedTexture||b.image[0].isCompressedTexture,Ee=b.image[0]&&b.image[0].isDataTexture,ce=[];for(let ie=0;ie<6;ie++)!_e&&!Ee?ce[ie]=g(b.image[ie],!0,s.maxCubemapSize):ce[ie]=Ee?b.image[ie].image:b.image[ie],ce[ie]=pe(b,ce[ie]);const re=ce[0],ke=a.convert(b.format,b.colorSpace),ze=a.convert(b.type),tt=x(b.internalFormat,ke,ze,b.normalized,b.colorSpace),D=b.isVideoTexture!==!0,oe=ae.__version===void 0||Q===!0,Z=ne.dataReady;let Se=E(b,re);ye(n.TEXTURE_CUBE_MAP,b);let he;if(_e){D&&oe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Se,tt,re.width,re.height);for(let ie=0;ie<6;ie++){he=ce[ie].mipmaps;for(let Ce=0;Ce<he.length;Ce++){const Be=he[Ce];b.format!==bi?ke!==null?D?Z&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce,0,0,Be.width,Be.height,ke,Be.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce,tt,Be.width,Be.height,0,Be.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?Z&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce,0,0,Be.width,Be.height,ke,ze,Be.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce,tt,Be.width,Be.height,0,ke,ze,Be.data)}}}else{if(he=b.mipmaps,D&&oe){he.length>0&&Se++;const ie=_t(ce[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Se,tt,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(Ee){D?Z&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,ce[ie].width,ce[ie].height,ke,ze,ce[ie].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,tt,ce[ie].width,ce[ie].height,0,ke,ze,ce[ie].data);for(let Ce=0;Ce<he.length;Ce++){const bt=he[Ce].image[ie].image;D?Z&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce+1,0,0,bt.width,bt.height,ke,ze,bt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce+1,tt,bt.width,bt.height,0,ke,ze,bt.data)}}else{D?Z&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,ke,ze,ce[ie]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,tt,ke,ze,ce[ie]);for(let Ce=0;Ce<he.length;Ce++){const Be=he[Ce];D?Z&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce+1,0,0,ke,ze,Be.image[ie]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce+1,tt,ke,ze,Be.image[ie])}}}m(b)&&M(n.TEXTURE_CUBE_MAP),ae.__version=ne.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function Pe(R,b,O,Q,ne,ae){const de=a.convert(O.format,O.colorSpace),Y=a.convert(O.type),ee=x(O.internalFormat,de,Y,O.normalized,O.colorSpace),_e=i.get(b),Ee=i.get(O);if(Ee.__renderTarget=b,!_e.__hasExternalTextures){const ce=Math.max(1,b.width>>ae),re=Math.max(1,b.height>>ae);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,ae,ee,ce,re,b.depth,0,de,Y,null):t.texImage2D(ne,ae,ee,ce,re,0,de,Y,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),qe(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,ne,Ee.__webglTexture,0,Dt(b)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Q,ne,Ee.__webglTexture,ae),t.bindFramebuffer(n.FRAMEBUFFER,null)}function st(R,b,O){if(n.bindRenderbuffer(n.RENDERBUFFER,R),b.depthBuffer){const Q=b.depthTexture,ne=Q&&Q.isDepthTexture?Q.type:null,ae=y(b.stencilBuffer,ne),de=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;qe(b)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Dt(b),ae,b.width,b.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,Dt(b),ae,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,ae,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,de,n.RENDERBUFFER,R)}else{const Q=b.textures;for(let ne=0;ne<Q.length;ne++){const ae=Q[ne],de=a.convert(ae.format,ae.colorSpace),Y=a.convert(ae.type),ee=x(ae.internalFormat,de,Y,ae.normalized,ae.colorSpace);qe(b)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Dt(b),ee,b.width,b.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,Dt(b),ee,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,ee,b.width,b.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function De(R,b,O){const Q=b.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ne=i.get(b.depthTexture);if(ne.__renderTarget=b,(!ne.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),Q){if(ne.__webglInit===void 0&&(ne.__webglInit=!0,b.depthTexture.addEventListener("dispose",A)),ne.__webglTexture===void 0){ne.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,ne.__webglTexture),ye(n.TEXTURE_CUBE_MAP,b.depthTexture);const _e=a.convert(b.depthTexture.format),Ee=a.convert(b.depthTexture.type);let ce;b.depthTexture.format===nn?ce=n.DEPTH_COMPONENT24:b.depthTexture.format===Fn&&(ce=n.DEPTH24_STENCIL8);for(let re=0;re<6;re++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ce,b.width,b.height,0,_e,Ee,null)}}else j(b.depthTexture,0);const ae=ne.__webglTexture,de=Dt(b),Y=Q?n.TEXTURE_CUBE_MAP_POSITIVE_X+O:n.TEXTURE_2D,ee=b.depthTexture.format===Fn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(b.depthTexture.format===nn)qe(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,Y,ae,0,de):n.framebufferTexture2D(n.FRAMEBUFFER,ee,Y,ae,0);else if(b.depthTexture.format===Fn)qe(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,Y,ae,0,de):n.framebufferTexture2D(n.FRAMEBUFFER,ee,Y,ae,0);else throw new Error("Unknown depthTexture format")}function Xe(R){const b=i.get(R),O=R.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==R.depthTexture){const Q=R.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),Q){const ne=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,Q.removeEventListener("dispose",ne)};Q.addEventListener("dispose",ne),b.__depthDisposeCallback=ne}b.__boundDepthTexture=Q}if(R.depthTexture&&!b.__autoAllocateDepthBuffer)if(O)for(let Q=0;Q<6;Q++)De(b.__webglFramebuffer[Q],R,Q);else{const Q=R.texture.mipmaps;Q&&Q.length>0?De(b.__webglFramebuffer[0],R,0):De(b.__webglFramebuffer,R,0)}else if(O){b.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[Q]),b.__webglDepthbuffer[Q]===void 0)b.__webglDepthbuffer[Q]=n.createRenderbuffer(),st(b.__webglDepthbuffer[Q],R,!1);else{const ne=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=b.__webglDepthbuffer[Q];n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,ae)}}else{const Q=R.texture.mipmaps;if(Q&&Q.length>0?t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=n.createRenderbuffer(),st(b.__webglDepthbuffer,R,!1);else{const ne=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=b.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,ae)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function et(R,b,O){const Q=i.get(R);b!==void 0&&Pe(Q.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Xe(R)}function He(R){const b=R.texture,O=i.get(R),Q=i.get(b);R.addEventListener("dispose",S);const ne=R.textures,ae=R.isWebGLCubeRenderTarget===!0,de=ne.length>1;if(de||(Q.__webglTexture===void 0&&(Q.__webglTexture=n.createTexture()),Q.__version=b.version,r.memory.textures++),ae){O.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer[Y]=[];for(let ee=0;ee<b.mipmaps.length;ee++)O.__webglFramebuffer[Y][ee]=n.createFramebuffer()}else O.__webglFramebuffer[Y]=n.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer=[];for(let Y=0;Y<b.mipmaps.length;Y++)O.__webglFramebuffer[Y]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(de)for(let Y=0,ee=ne.length;Y<ee;Y++){const _e=i.get(ne[Y]);_e.__webglTexture===void 0&&(_e.__webglTexture=n.createTexture(),r.memory.textures++)}if(R.samples>0&&qe(R)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let Y=0;Y<ne.length;Y++){const ee=ne[Y];O.__webglColorRenderbuffer[Y]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[Y]);const _e=a.convert(ee.format,ee.colorSpace),Ee=a.convert(ee.type),ce=x(ee.internalFormat,_e,Ee,ee.normalized,ee.colorSpace,R.isXRRenderTarget===!0),re=Dt(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,re,ce,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Y,n.RENDERBUFFER,O.__webglColorRenderbuffer[Y])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),st(O.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ae){t.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),ye(n.TEXTURE_CUBE_MAP,b);for(let Y=0;Y<6;Y++)if(b.mipmaps&&b.mipmaps.length>0)for(let ee=0;ee<b.mipmaps.length;ee++)Pe(O.__webglFramebuffer[Y][ee],R,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ee);else Pe(O.__webglFramebuffer[Y],R,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);m(b)&&M(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(de){for(let Y=0,ee=ne.length;Y<ee;Y++){const _e=ne[Y],Ee=i.get(_e);let ce=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ce=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ce,Ee.__webglTexture),ye(ce,_e),Pe(O.__webglFramebuffer,R,_e,n.COLOR_ATTACHMENT0+Y,ce,0),m(_e)&&M(ce)}t.unbindTexture()}else{let Y=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Y=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Y,Q.__webglTexture),ye(Y,b),b.mipmaps&&b.mipmaps.length>0)for(let ee=0;ee<b.mipmaps.length;ee++)Pe(O.__webglFramebuffer[ee],R,b,n.COLOR_ATTACHMENT0,Y,ee);else Pe(O.__webglFramebuffer,R,b,n.COLOR_ATTACHMENT0,Y,0);m(b)&&M(Y),t.unbindTexture()}R.depthBuffer&&Xe(R)}function Lt(R){const b=R.textures;for(let O=0,Q=b.length;O<Q;O++){const ne=b[O];if(m(ne)){const ae=_(R),de=i.get(ne).__webglTexture;t.bindTexture(ae,de),M(ae),t.unbindTexture()}}}const xt=[],ni=[];function k(R){if(R.samples>0){if(qe(R)===!1){const b=R.textures,O=R.width,Q=R.height;let ne=n.COLOR_BUFFER_BIT;const ae=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=i.get(R),Y=b.length>1;if(Y)for(let _e=0;_e<b.length;_e++)t.bindFramebuffer(n.FRAMEBUFFER,de.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,de.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);const ee=R.texture.mipmaps;ee&&ee.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let _e=0;_e<b.length;_e++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),Y){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,de.__webglColorRenderbuffer[_e]);const Ee=i.get(b[_e]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ee,0)}n.blitFramebuffer(0,0,O,Q,0,0,O,Q,ne,n.NEAREST),l===!0&&(xt.length=0,ni.length=0,xt.push(n.COLOR_ATTACHMENT0+_e),R.depthBuffer&&R.resolveDepthBuffer===!1&&(xt.push(ae),ni.push(ae),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ni)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,xt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Y)for(let _e=0;_e<b.length;_e++){t.bindFramebuffer(n.FRAMEBUFFER,de.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,de.__webglColorRenderbuffer[_e]);const Ee=i.get(b[_e]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,de.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,Ee,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const b=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[b])}}}function Dt(R){return Math.min(s.maxSamples,R.samples)}function qe(R){const b=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function pt(R){const b=r.render.frame;h.get(R)!==b&&(h.set(R,b),R.update())}function pe(R,b){const O=R.colorSpace,Q=R.format,ne=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==$a&&O!==pn&&(je.getTransfer(O)===ot?(Q!==bi||ne!==oi)&&Ne("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Qe("WebGLTextures: Unsupported texture color space:",O)),b}function _t(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=z,this.getTextureUnits=U,this.setTextureUnits=I,this.setTexture2D=j,this.setTexture2DArray=te,this.setTexture3D=se,this.setTextureCube=ue,this.rebindTextures=et,this.setupRenderTarget=He,this.updateRenderTargetMipmap=Lt,this.updateMultisampleRenderTarget=k,this.setupDepthRenderbuffer=Xe,this.setupFrameBufferTexture=Pe,this.useMultisampledRTT=qe,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Fy(n,e){function t(i,s=pn){let a;const r=je.getTransfer(s);if(i===oi)return n.UNSIGNED_BYTE;if(i===El)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Tl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===$h)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Yh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Xh)return n.BYTE;if(i===qh)return n.SHORT;if(i===qs)return n.UNSIGNED_SHORT;if(i===bl)return n.INT;if(i===Oi)return n.UNSIGNED_INT;if(i===Li)return n.FLOAT;if(i===tn)return n.HALF_FLOAT;if(i===Kh)return n.ALPHA;if(i===jh)return n.RGB;if(i===bi)return n.RGBA;if(i===nn)return n.DEPTH_COMPONENT;if(i===Fn)return n.DEPTH_STENCIL;if(i===Zh)return n.RED;if(i===wl)return n.RED_INTEGER;if(i===Xn)return n.RG;if(i===Al)return n.RG_INTEGER;if(i===Rl)return n.RGBA_INTEGER;if(i===Ba||i===Fa||i===Oa||i===za)if(r===ot)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Ba)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Fa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Oa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===za)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Ba)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Fa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Oa)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===za)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ro||i===Co||i===Po||i===Io)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Ro)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Co)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Po)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Io)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Lo||i===Do||i===No||i===ko||i===Uo||i===Xa||i===Bo)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===Lo||i===Do)return r===ot?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===No)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===ko)return a.COMPRESSED_R11_EAC;if(i===Uo)return a.COMPRESSED_SIGNED_R11_EAC;if(i===Xa)return a.COMPRESSED_RG11_EAC;if(i===Bo)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Fo||i===Oo||i===zo||i===Vo||i===Ho||i===Wo||i===Go||i===Xo||i===qo||i===$o||i===Yo||i===Ko||i===jo||i===Zo)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Fo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Oo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===zo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Vo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ho)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Wo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Go)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Xo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===qo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===$o)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Yo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ko)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===jo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Zo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Jo||i===Qo||i===el)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===Jo)return r===ot?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Qo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===el)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===tl||i===il||i===qa||i===nl)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===tl)return a.COMPRESSED_RED_RGTC1_EXT;if(i===il)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===qa)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===nl)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===$s?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Oy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zy=`
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

}`;class Vy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new ad(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new zi({vertexShader:Oy,fragmentShader:zy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ft(new lr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Hy extends $n{constructor(e,t){super();const i=this;let s=null,a=1,r=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,p=null;const v=typeof XRWebGLBinding<"u",g=new Vy,m={},M=t.getContextAttributes();let _=null,x=null;const y=[],E=[],A=new nt;let S=null;const w=new vi;w.viewport=new Mt;const P=new vi;P.viewport=new Mt;const C=[w,P],L=new Jf;let z=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let J=y[G];return J===void 0&&(J=new Ir,y[G]=J),J.getTargetRaySpace()},this.getControllerGrip=function(G){let J=y[G];return J===void 0&&(J=new Ir,y[G]=J),J.getGripSpace()},this.getHand=function(G){let J=y[G];return J===void 0&&(J=new Ir,y[G]=J),J.getHandSpace()};function I(G){const J=E.indexOf(G.inputSource);if(J===-1)return;const K=y[J];K!==void 0&&(K.update(G.inputSource,G.frame,c||r),K.dispatchEvent({type:G.type,data:G.inputSource}))}function B(){s.removeEventListener("select",I),s.removeEventListener("selectstart",I),s.removeEventListener("selectend",I),s.removeEventListener("squeeze",I),s.removeEventListener("squeezestart",I),s.removeEventListener("squeezeend",I),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",N);for(let G=0;G<y.length;G++){const J=E[G];J!==null&&(E[G]=null,y[G].disconnect(J))}z=null,U=null,g.reset();for(const G in m)delete m[G];e.setRenderTarget(_),f=null,d=null,u=null,s=null,x=null,ye.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){a=G,i.isPresenting===!0&&Ne("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){o=G,i.isPresenting===!0&&Ne("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(G){if(s=G,s!==null){if(_=e.getRenderTarget(),s.addEventListener("select",I),s.addEventListener("selectstart",I),s.addEventListener("selectend",I),s.addEventListener("squeeze",I),s.addEventListener("squeezestart",I),s.addEventListener("squeezeend",I),s.addEventListener("end",B),s.addEventListener("inputsourceschange",N),M.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let K=null,we=null,Ae=null;M.depth&&(Ae=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,K=M.stencil?Fn:nn,we=M.stencil?$s:Oi);const Pe={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:a};u=this.getBinding(),d=u.createProjectionLayer(Pe),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Ui(d.textureWidth,d.textureHeight,{format:bi,type:oi,depthTexture:new vs(d.textureWidth,d.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const K={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(s,t,K),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Ui(f.framebufferWidth,f.framebufferHeight,{format:bi,type:oi,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),ye.setContext(s),ye.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function N(G){for(let J=0;J<G.removed.length;J++){const K=G.removed[J],we=E.indexOf(K);we>=0&&(E[we]=null,y[we].disconnect(K))}for(let J=0;J<G.added.length;J++){const K=G.added[J];let we=E.indexOf(K);if(we===-1){for(let Pe=0;Pe<y.length;Pe++)if(Pe>=E.length){E.push(K),we=Pe;break}else if(E[Pe]===null){E[Pe]=K,we=Pe;break}if(we===-1)break}const Ae=y[we];Ae&&Ae.connect(K)}}const j=new V,te=new V;function se(G,J,K){j.setFromMatrixPosition(J.matrixWorld),te.setFromMatrixPosition(K.matrixWorld);const we=j.distanceTo(te),Ae=J.projectionMatrix.elements,Pe=K.projectionMatrix.elements,st=Ae[14]/(Ae[10]-1),De=Ae[14]/(Ae[10]+1),Xe=(Ae[9]+1)/Ae[5],et=(Ae[9]-1)/Ae[5],He=(Ae[8]-1)/Ae[0],Lt=(Pe[8]+1)/Pe[0],xt=st*He,ni=st*Lt,k=we/(-He+Lt),Dt=k*-He;if(J.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(Dt),G.translateZ(k),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert(),Ae[10]===-1)G.projectionMatrix.copy(J.projectionMatrix),G.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const qe=st+k,pt=De+k,pe=xt-Dt,_t=ni+(we-Dt),R=Xe*De/pt*qe,b=et*De/pt*qe;G.projectionMatrix.makePerspective(pe,_t,R,b,qe,pt),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}}function ue(G,J){J===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(J.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(s===null)return;let J=G.near,K=G.far;g.texture!==null&&(g.depthNear>0&&(J=g.depthNear),g.depthFar>0&&(K=g.depthFar)),L.near=P.near=w.near=J,L.far=P.far=w.far=K,(z!==L.near||U!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),z=L.near,U=L.far),L.layers.mask=G.layers.mask|6,w.layers.mask=L.layers.mask&-5,P.layers.mask=L.layers.mask&-3;const we=G.parent,Ae=L.cameras;ue(L,we);for(let Pe=0;Pe<Ae.length;Pe++)ue(Ae[Pe],we);Ae.length===2?se(L,w,P):L.projectionMatrix.copy(w.projectionMatrix),$(G,L,we)};function $(G,J,K){K===null?G.matrix.copy(J.matrixWorld):(G.matrix.copy(K.matrixWorld),G.matrix.invert(),G.matrix.multiply(J.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(J.projectionMatrix),G.projectionMatrixInverse.copy(J.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=rl*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(G){l=G,d!==null&&(d.fixedFoveation=G),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=G)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(L)},this.getCameraTexture=function(G){return m[G]};let q=null;function fe(G,J){if(h=J.getViewerPose(c||r),p=J,h!==null){const K=h.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let we=!1;K.length!==L.cameras.length&&(L.cameras.length=0,we=!0);for(let De=0;De<K.length;De++){const Xe=K[De];let et=null;if(f!==null)et=f.getViewport(Xe);else{const Lt=u.getViewSubImage(d,Xe);et=Lt.viewport,De===0&&(e.setRenderTargetTextures(x,Lt.colorTexture,Lt.depthStencilTexture),e.setRenderTarget(x))}let He=C[De];He===void 0&&(He=new vi,He.layers.enable(De),He.viewport=new Mt,C[De]=He),He.matrix.fromArray(Xe.transform.matrix),He.matrix.decompose(He.position,He.quaternion,He.scale),He.projectionMatrix.fromArray(Xe.projectionMatrix),He.projectionMatrixInverse.copy(He.projectionMatrix).invert(),He.viewport.set(et.x,et.y,et.width,et.height),De===0&&(L.matrix.copy(He.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),we===!0&&L.cameras.push(He)}const Ae=s.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=i.getBinding();const De=u.getDepthInformation(K[0]);De&&De.isValid&&De.texture&&g.init(De,s.renderState)}if(Ae&&Ae.includes("camera-access")&&v){e.state.unbindTexture(),u=i.getBinding();for(let De=0;De<K.length;De++){const Xe=K[De].camera;if(Xe){let et=m[Xe];et||(et=new ad,m[Xe]=et);const He=u.getCameraImage(Xe);et.sourceTexture=He}}}}for(let K=0;K<y.length;K++){const we=E[K],Ae=y[K];we!==null&&Ae!==void 0&&Ae.update(we,J,c||r)}q&&q(G,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),p=null}const ye=new cd;ye.setAnimationLoop(fe),this.setAnimationLoop=function(G){q=G},this.dispose=function(){}}}const Wy=new Rt,gd=new Ue;gd.set(-1,0,0,0,1,0,0,0,1);function Gy(n,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function i(g,m){m.color.getRGB(g.fogColor.value,rd(n)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,M,_,x){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?a(g,m):m.isMeshLambertMaterial?(a(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(a(g,m),u(g,m)):m.isMeshPhongMaterial?(a(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(a(g,m),d(g,m),m.isMeshPhysicalMaterial&&f(g,m,x)):m.isMeshMatcapMaterial?(a(g,m),p(g,m)):m.isMeshDepthMaterial?a(g,m):m.isMeshDistanceMaterial?(a(g,m),v(g,m)):m.isMeshNormalMaterial?a(g,m):m.isLineBasicMaterial?(r(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,M,_):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function a(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===ii&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===ii&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const M=e.get(m),_=M.envMap,x=M.envMapRotation;_&&(g.envMap.value=_,g.envMapRotation.value.setFromMatrix4(Wy.makeRotationFromEuler(x)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(gd),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function r(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,M,_){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*M,g.scale.value=_*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,M){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===ii&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function v(g,m){const M=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Xy(n,e,t,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,_){const x=_.program;i.uniformBlockBinding(M,x)}function c(M,_){let x=s[M.id];x===void 0&&(p(M),x=h(M),s[M.id]=x,M.addEventListener("dispose",g));const y=_.program;i.updateUBOMapping(M,y);const E=e.render.frame;a[M.id]!==E&&(d(M),a[M.id]=E)}function h(M){const _=u();M.__bindingPointIndex=_;const x=n.createBuffer(),y=M.__size,E=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,y,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,x),x}function u(){for(let M=0;M<o;M++)if(r.indexOf(M)===-1)return r.push(M),M;return Qe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const _=s[M.id],x=M.uniforms,y=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let E=0,A=x.length;E<A;E++){const S=Array.isArray(x[E])?x[E]:[x[E]];for(let w=0,P=S.length;w<P;w++){const C=S[w];if(f(C,E,w,y)===!0){const L=C.__offset,z=Array.isArray(C.value)?C.value:[C.value];let U=0;for(let I=0;I<z.length;I++){const B=z[I],N=v(B);typeof B=="number"||typeof B=="boolean"?(C.__data[0]=B,n.bufferSubData(n.UNIFORM_BUFFER,L+U,C.__data)):B.isMatrix3?(C.__data[0]=B.elements[0],C.__data[1]=B.elements[1],C.__data[2]=B.elements[2],C.__data[3]=0,C.__data[4]=B.elements[3],C.__data[5]=B.elements[4],C.__data[6]=B.elements[5],C.__data[7]=0,C.__data[8]=B.elements[6],C.__data[9]=B.elements[7],C.__data[10]=B.elements[8],C.__data[11]=0):ArrayBuffer.isView(B)?C.__data.set(new B.constructor(B.buffer,B.byteOffset,C.__data.length)):(B.toArray(C.__data,U),U+=N.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,L,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(M,_,x,y){const E=M.value,A=_+"_"+x;if(y[A]===void 0)return typeof E=="number"||typeof E=="boolean"?y[A]=E:ArrayBuffer.isView(E)?y[A]=E.slice():y[A]=E.clone(),!0;{const S=y[A];if(typeof E=="number"||typeof E=="boolean"){if(S!==E)return y[A]=E,!0}else{if(ArrayBuffer.isView(E))return!0;if(S.equals(E)===!1)return S.copy(E),!0}}return!1}function p(M){const _=M.uniforms;let x=0;const y=16;for(let A=0,S=_.length;A<S;A++){const w=Array.isArray(_[A])?_[A]:[_[A]];for(let P=0,C=w.length;P<C;P++){const L=w[P],z=Array.isArray(L.value)?L.value:[L.value];for(let U=0,I=z.length;U<I;U++){const B=z[U],N=v(B),j=x%y,te=j%N.boundary,se=j+te;x+=te,se!==0&&y-se<N.storage&&(x+=y-se),L.__data=new Float32Array(N.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=x,x+=N.storage}}}const E=x%y;return E>0&&(x+=y-E),M.__size=x,M.__cache={},this}function v(M){const _={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(_.boundary=4,_.storage=4):M.isVector2?(_.boundary=8,_.storage=8):M.isVector3||M.isColor?(_.boundary=16,_.storage=12):M.isVector4?(_.boundary=16,_.storage=16):M.isMatrix3?(_.boundary=48,_.storage=48):M.isMatrix4?(_.boundary=64,_.storage=64):M.isTexture?Ne("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(_.boundary=16,_.storage=M.byteLength):Ne("WebGLRenderer: Unsupported uniform value type.",M),_}function g(M){const _=M.target;_.removeEventListener("dispose",g);const x=r.indexOf(_.__bindingPointIndex);r.splice(x,1),n.deleteBuffer(s[_.id]),delete s[_.id],delete a[_.id]}function m(){for(const M in s)n.deleteBuffer(s[M]);r=[],s={},a={}}return{bind:l,update:c,dispose:m}}const qy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ci=null;function $y(){return Ci===null&&(Ci=new Uf(qy,16,16,Xn,tn),Ci.name="DFG_LUT",Ci.minFilter=$t,Ci.magFilter=$t,Ci.wrapS=Zi,Ci.wrapT=Zi,Ci.generateMipmaps=!1,Ci.needsUpdate=!0),Ci}class Yy{constructor(e={}){const{canvas:t=uf(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=oi}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=r;const v=f,g=new Set([Rl,Al,wl]),m=new Set([oi,Oi,qs,$s,El,Tl]),M=new Uint32Array(4),_=new Int32Array(4),x=new V;let y=null,E=null;const A=[],S=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ki,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let C=!1,L=null;this._outputColorSpace=hi;let z=0,U=0,I=null,B=-1,N=null;const j=new Mt,te=new Mt;let se=null;const ue=new at(0);let $=0,q=t.width,fe=t.height,ye=1,G=null,J=null;const K=new Mt(0,0,q,fe),we=new Mt(0,0,q,fe);let Ae=!1;const Pe=new Dl;let st=!1,De=!1;const Xe=new Rt,et=new V,He=new Mt,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let xt=!1;function ni(){return I===null?ye:1}let k=i;function Dt(T,F){return t.getContext(T,F)}try{const T={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ml}`),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",Ce,!1),t.addEventListener("webglcontextcreationerror",Be,!1),k===null){const F="webgl2";if(k=Dt(F,T),k===null)throw Dt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw Qe("WebGLRenderer: "+T.message),T}let qe,pt,pe,_t,R,b,O,Q,ne,ae,de,Y,ee,_e,Ee,ce,re,ke,ze,tt,D,oe,Z;function Se(){qe=new $0(k),qe.init(),D=new Fy(k,qe),pt=new O0(k,qe,e,D),pe=new Uy(k,qe),pt.reversedDepthBuffer&&d&&pe.buffers.depth.setReversed(!0),_t=new j0(k),R=new My,b=new By(k,qe,pe,R,pt,D,_t),O=new q0(P),Q=new ep(k),oe=new B0(k,Q),ne=new Y0(k,Q,_t,oe),ae=new J0(k,ne,Q,oe,_t),ke=new Z0(k,pt,b),Ee=new z0(R),de=new Sy(P,O,qe,pt,oe,Ee),Y=new Gy(P,R),ee=new Ey,_e=new Py(qe),re=new U0(P,O,pe,ae,p,l),ce=new ky(P,ae,pt),Z=new Xy(k,_t,pt,pe),ze=new F0(k,qe,_t),tt=new K0(k,qe,_t),_t.programs=de.programs,P.capabilities=pt,P.extensions=qe,P.properties=R,P.renderLists=ee,P.shadowMap=ce,P.state=pe,P.info=_t}Se(),v!==oi&&(w=new eg(v,t.width,t.height,s,a));const he=new Hy(P,k);this.xr=he,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const T=qe.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=qe.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ye},this.setPixelRatio=function(T){T!==void 0&&(ye=T,this.setSize(q,fe,!1))},this.getSize=function(T){return T.set(q,fe)},this.setSize=function(T,F,X=!0){if(he.isPresenting){Ne("WebGLRenderer: Can't change size while VR device is presenting.");return}q=T,fe=F,t.width=Math.floor(T*ye),t.height=Math.floor(F*ye),X===!0&&(t.style.width=T+"px",t.style.height=F+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,T,F)},this.getDrawingBufferSize=function(T){return T.set(q*ye,fe*ye).floor()},this.setDrawingBufferSize=function(T,F,X){q=T,fe=F,ye=X,t.width=Math.floor(T*X),t.height=Math.floor(F*X),this.setViewport(0,0,T,F)},this.setEffects=function(T){if(v===oi){Qe("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let F=0;F<T.length;F++)if(T[F].isOutputPass===!0){Ne("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(j)},this.getViewport=function(T){return T.copy(K)},this.setViewport=function(T,F,X,H){T.isVector4?K.set(T.x,T.y,T.z,T.w):K.set(T,F,X,H),pe.viewport(j.copy(K).multiplyScalar(ye).round())},this.getScissor=function(T){return T.copy(we)},this.setScissor=function(T,F,X,H){T.isVector4?we.set(T.x,T.y,T.z,T.w):we.set(T,F,X,H),pe.scissor(te.copy(we).multiplyScalar(ye).round())},this.getScissorTest=function(){return Ae},this.setScissorTest=function(T){pe.setScissorTest(Ae=T)},this.setOpaqueSort=function(T){G=T},this.setTransparentSort=function(T){J=T},this.getClearColor=function(T){return T.copy(re.getClearColor())},this.setClearColor=function(){re.setClearColor(...arguments)},this.getClearAlpha=function(){return re.getClearAlpha()},this.setClearAlpha=function(){re.setClearAlpha(...arguments)},this.clear=function(T=!0,F=!0,X=!0){let H=0;if(T){let W=!1;if(I!==null){const xe=I.texture.format;W=g.has(xe)}if(W){const xe=I.texture.type,Te=m.has(xe),ge=re.getClearColor(),Re=re.getClearAlpha(),Ie=ge.r,Fe=ge.g,Ge=ge.b;Te?(M[0]=Ie,M[1]=Fe,M[2]=Ge,M[3]=Re,k.clearBufferuiv(k.COLOR,0,M)):(_[0]=Ie,_[1]=Fe,_[2]=Ge,_[3]=Re,k.clearBufferiv(k.COLOR,0,_))}else H|=k.COLOR_BUFFER_BIT}F&&(H|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(H|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&k.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),L=T},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",Ce,!1),t.removeEventListener("webglcontextcreationerror",Be,!1),re.dispose(),ee.dispose(),_e.dispose(),R.dispose(),O.dispose(),ae.dispose(),oe.dispose(),Z.dispose(),de.dispose(),he.dispose(),he.removeEventListener("sessionstart",Jl),he.removeEventListener("sessionend",Ql),wn.stop()};function ie(T){T.preventDefault(),xc("WebGLRenderer: Context Lost."),C=!0}function Ce(){xc("WebGLRenderer: Context Restored."),C=!1;const T=_t.autoReset,F=ce.enabled,X=ce.autoUpdate,H=ce.needsUpdate,W=ce.type;Se(),_t.autoReset=T,ce.enabled=F,ce.autoUpdate=X,ce.needsUpdate=H,ce.type=W}function Be(T){Qe("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function bt(T){const F=T.target;F.removeEventListener("dispose",bt),lt(F)}function lt(T){Vi(T),R.remove(T)}function Vi(T){const F=R.get(T).programs;F!==void 0&&(F.forEach(function(X){de.releaseProgram(X)}),T.isShaderMaterial&&de.releaseShaderCache(T))}this.renderBufferDirect=function(T,F,X,H,W,xe){F===null&&(F=Lt);const Te=W.isMesh&&W.matrixWorld.determinant()<0,ge=Dd(T,F,X,H,W);pe.setMaterial(H,Te);let Re=X.index,Ie=1;if(H.wireframe===!0){if(Re=ne.getWireframeAttribute(X),Re===void 0)return;Ie=2}const Fe=X.drawRange,Ge=X.attributes.position;let Le=Fe.start*Ie,ct=(Fe.start+Fe.count)*Ie;xe!==null&&(Le=Math.max(Le,xe.start*Ie),ct=Math.min(ct,(xe.start+xe.count)*Ie)),Re!==null?(Le=Math.max(Le,0),ct=Math.min(ct,Re.count)):Ge!=null&&(Le=Math.max(Le,0),ct=Math.min(ct,Ge.count));const Et=ct-Le;if(Et<0||Et===1/0)return;oe.setup(W,H,ge,X,Re);let St,dt=ze;if(Re!==null&&(St=Q.get(Re),dt=tt,dt.setIndex(St)),W.isMesh)H.wireframe===!0?(pe.setLineWidth(H.wireframeLinewidth*ni()),dt.setMode(k.LINES)):dt.setMode(k.TRIANGLES);else if(W.isLine){let Wt=H.linewidth;Wt===void 0&&(Wt=1),pe.setLineWidth(Wt*ni()),W.isLineSegments?dt.setMode(k.LINES):W.isLineLoop?dt.setMode(k.LINE_LOOP):dt.setMode(k.LINE_STRIP)}else W.isPoints?dt.setMode(k.POINTS):W.isSprite&&dt.setMode(k.TRIANGLES);if(W.isBatchedMesh)if(qe.get("WEBGL_multi_draw"))dt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Wt=W._multiDrawStarts,Me=W._multiDrawCounts,si=W._multiDrawCount,Je=Re?Q.get(Re).bytesPerElement:1,li=R.get(H).currentProgram.getUniforms();for(let Ai=0;Ai<si;Ai++)li.setValue(k,"_gl_DrawID",Ai),dt.render(Wt[Ai]/Je,Me[Ai])}else if(W.isInstancedMesh)dt.renderInstances(Le,Et,W.count);else if(X.isInstancedBufferGeometry){const Wt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Me=Math.min(X.instanceCount,Wt);dt.renderInstances(Le,Et,Me)}else dt.render(Le,Et)};function wi(T,F,X){T.transparent===!0&&T.side===ji&&T.forceSinglePass===!1?(T.side=ii,T.needsUpdate=!0,ea(T,F,X),T.side=bn,T.needsUpdate=!0,ea(T,F,X),T.side=ji):ea(T,F,X)}this.compile=function(T,F,X=null){X===null&&(X=T),E=_e.get(X),E.init(F),S.push(E),X.traverseVisible(function(W){W.isLight&&W.layers.test(F.layers)&&(E.pushLight(W),W.castShadow&&E.pushShadow(W))}),T!==X&&T.traverseVisible(function(W){W.isLight&&W.layers.test(F.layers)&&(E.pushLight(W),W.castShadow&&E.pushShadow(W))}),E.setupLights();const H=new Set;return T.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const xe=W.material;if(xe)if(Array.isArray(xe))for(let Te=0;Te<xe.length;Te++){const ge=xe[Te];wi(ge,X,W),H.add(ge)}else wi(xe,X,W),H.add(xe)}),E=S.pop(),H},this.compileAsync=function(T,F,X=null){const H=this.compile(T,F,X);return new Promise(W=>{function xe(){if(H.forEach(function(Te){R.get(Te).currentProgram.isReady()&&H.delete(Te)}),H.size===0){W(T);return}setTimeout(xe,10)}qe.get("KHR_parallel_shader_compile")!==null?xe():setTimeout(xe,10)})};let gr=null;function Id(T){gr&&gr(T)}function Jl(){wn.stop()}function Ql(){wn.start()}const wn=new cd;wn.setAnimationLoop(Id),typeof self<"u"&&wn.setContext(self),this.setAnimationLoop=function(T){gr=T,he.setAnimationLoop(T),T===null?wn.stop():wn.start()},he.addEventListener("sessionstart",Jl),he.addEventListener("sessionend",Ql),this.render=function(T,F){if(F!==void 0&&F.isCamera!==!0){Qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;L!==null&&L.renderStart(T,F);const X=he.enabled===!0&&he.isPresenting===!0,H=w!==null&&(I===null||X)&&w.begin(P,I);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),he.enabled===!0&&he.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(he.cameraAutoUpdate===!0&&he.updateCamera(F),F=he.getCamera()),T.isScene===!0&&T.onBeforeRender(P,T,F,I),E=_e.get(T,S.length),E.init(F),E.state.textureUnits=b.getTextureUnits(),S.push(E),Xe.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Pe.setFromProjectionMatrix(Xe,Di,F.reversedDepth),De=this.localClippingEnabled,st=Ee.init(this.clippingPlanes,De),y=ee.get(T,A.length),y.init(),A.push(y),he.enabled===!0&&he.isPresenting===!0){const Te=P.xr.getDepthSensingMesh();Te!==null&&yr(Te,F,-1/0,P.sortObjects)}yr(T,F,0,P.sortObjects),y.finish(),P.sortObjects===!0&&y.sort(G,J),xt=he.enabled===!1||he.isPresenting===!1||he.hasDepthSensing()===!1,xt&&re.addToRenderList(y,T),this.info.render.frame++,st===!0&&Ee.beginShadows();const W=E.state.shadowsArray;if(ce.render(W,T,F),st===!0&&Ee.endShadows(),this.info.autoReset===!0&&this.info.reset(),(H&&w.hasRenderPass())===!1){const Te=y.opaque,ge=y.transmissive;if(E.setupLights(),F.isArrayCamera){const Re=F.cameras;if(ge.length>0)for(let Ie=0,Fe=Re.length;Ie<Fe;Ie++){const Ge=Re[Ie];tc(Te,ge,T,Ge)}xt&&re.render(T);for(let Ie=0,Fe=Re.length;Ie<Fe;Ie++){const Ge=Re[Ie];ec(y,T,Ge,Ge.viewport)}}else ge.length>0&&tc(Te,ge,T,F),xt&&re.render(T),ec(y,T,F)}I!==null&&U===0&&(b.updateMultisampleRenderTarget(I),b.updateRenderTargetMipmap(I)),H&&w.end(P),T.isScene===!0&&T.onAfterRender(P,T,F),oe.resetDefaultState(),B=-1,N=null,S.pop(),S.length>0?(E=S[S.length-1],b.setTextureUnits(E.state.textureUnits),st===!0&&Ee.setGlobalState(P.clippingPlanes,E.state.camera)):E=null,A.pop(),A.length>0?y=A[A.length-1]:y=null,L!==null&&L.renderEnd()};function yr(T,F,X,H){if(T.visible===!1)return;if(T.layers.test(F.layers)){if(T.isGroup)X=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(F);else if(T.isLightProbeGrid)E.pushLightProbeGrid(T);else if(T.isLight)E.pushLight(T),T.castShadow&&E.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Pe.intersectsSprite(T)){H&&He.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Xe);const Te=ae.update(T),ge=T.material;ge.visible&&y.push(T,Te,ge,X,He.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Pe.intersectsObject(T))){const Te=ae.update(T),ge=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),He.copy(T.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),He.copy(Te.boundingSphere.center)),He.applyMatrix4(T.matrixWorld).applyMatrix4(Xe)),Array.isArray(ge)){const Re=Te.groups;for(let Ie=0,Fe=Re.length;Ie<Fe;Ie++){const Ge=Re[Ie],Le=ge[Ge.materialIndex];Le&&Le.visible&&y.push(T,Te,Le,X,He.z,Ge)}}else ge.visible&&y.push(T,Te,ge,X,He.z,null)}}const xe=T.children;for(let Te=0,ge=xe.length;Te<ge;Te++)yr(xe[Te],F,X,H)}function ec(T,F,X,H){const{opaque:W,transmissive:xe,transparent:Te}=T;E.setupLightsView(X),st===!0&&Ee.setGlobalState(P.clippingPlanes,X),H&&pe.viewport(j.copy(H)),W.length>0&&Qs(W,F,X),xe.length>0&&Qs(xe,F,X),Te.length>0&&Qs(Te,F,X),pe.buffers.depth.setTest(!0),pe.buffers.depth.setMask(!0),pe.buffers.color.setMask(!0),pe.setPolygonOffset(!1)}function tc(T,F,X,H){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[H.id]===void 0){const Le=qe.has("EXT_color_buffer_half_float")||qe.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[H.id]=new Ui(1,1,{generateMipmaps:!0,type:Le?tn:oi,minFilter:Bn,samples:Math.max(4,pt.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace})}const xe=E.state.transmissionRenderTarget[H.id],Te=H.viewport||j;xe.setSize(Te.z*P.transmissionResolutionScale,Te.w*P.transmissionResolutionScale);const ge=P.getRenderTarget(),Re=P.getActiveCubeFace(),Ie=P.getActiveMipmapLevel();P.setRenderTarget(xe),P.getClearColor(ue),$=P.getClearAlpha(),$<1&&P.setClearColor(16777215,.5),P.clear(),xt&&re.render(X);const Fe=P.toneMapping;P.toneMapping=ki;const Ge=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),E.setupLightsView(H),st===!0&&Ee.setGlobalState(P.clippingPlanes,H),Qs(T,X,H),b.updateMultisampleRenderTarget(xe),b.updateRenderTargetMipmap(xe),qe.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let ct=0,Et=F.length;ct<Et;ct++){const St=F[ct],{object:dt,geometry:Wt,material:Me,group:si}=St;if(Me.side===ji&&dt.layers.test(H.layers)){const Je=Me.side;Me.side=ii,Me.needsUpdate=!0,ic(dt,X,H,Wt,Me,si),Me.side=Je,Me.needsUpdate=!0,Le=!0}}Le===!0&&(b.updateMultisampleRenderTarget(xe),b.updateRenderTargetMipmap(xe))}P.setRenderTarget(ge,Re,Ie),P.setClearColor(ue,$),Ge!==void 0&&(H.viewport=Ge),P.toneMapping=Fe}function Qs(T,F,X){const H=F.isScene===!0?F.overrideMaterial:null;for(let W=0,xe=T.length;W<xe;W++){const Te=T[W],{object:ge,geometry:Re,group:Ie}=Te;let Fe=Te.material;Fe.allowOverride===!0&&H!==null&&(Fe=H),ge.layers.test(X.layers)&&ic(ge,F,X,Re,Fe,Ie)}}function ic(T,F,X,H,W,xe){T.onBeforeRender(P,F,X,H,W,xe),T.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),W.onBeforeRender(P,F,X,H,T,xe),W.transparent===!0&&W.side===ji&&W.forceSinglePass===!1?(W.side=ii,W.needsUpdate=!0,P.renderBufferDirect(X,F,H,W,T,xe),W.side=bn,W.needsUpdate=!0,P.renderBufferDirect(X,F,H,W,T,xe),W.side=ji):P.renderBufferDirect(X,F,H,W,T,xe),T.onAfterRender(P,F,X,H,W,xe)}function ea(T,F,X){F.isScene!==!0&&(F=Lt);const H=R.get(T),W=E.state.lights,xe=E.state.shadowsArray,Te=W.state.version,ge=de.getParameters(T,W.state,xe,F,X,E.state.lightProbeGridArray),Re=de.getProgramCacheKey(ge);let Ie=H.programs;H.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?F.environment:null,H.fog=F.fog;const Fe=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;H.envMap=O.get(T.envMap||H.environment,Fe),H.envMapRotation=H.environment!==null&&T.envMap===null?F.environmentRotation:T.envMapRotation,Ie===void 0&&(T.addEventListener("dispose",bt),Ie=new Map,H.programs=Ie);let Ge=Ie.get(Re);if(Ge!==void 0){if(H.currentProgram===Ge&&H.lightsStateVersion===Te)return sc(T,ge),Ge}else ge.uniforms=de.getUniforms(T),L!==null&&T.isNodeMaterial&&L.build(T,X,ge),T.onBeforeCompile(ge,P),Ge=de.acquireProgram(ge,Re),Ie.set(Re,Ge),H.uniforms=ge.uniforms;const Le=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Le.clippingPlanes=Ee.uniform),sc(T,ge),H.needsLights=kd(T),H.lightsStateVersion=Te,H.needsLights&&(Le.ambientLightColor.value=W.state.ambient,Le.lightProbe.value=W.state.probe,Le.directionalLights.value=W.state.directional,Le.directionalLightShadows.value=W.state.directionalShadow,Le.spotLights.value=W.state.spot,Le.spotLightShadows.value=W.state.spotShadow,Le.rectAreaLights.value=W.state.rectArea,Le.ltc_1.value=W.state.rectAreaLTC1,Le.ltc_2.value=W.state.rectAreaLTC2,Le.pointLights.value=W.state.point,Le.pointLightShadows.value=W.state.pointShadow,Le.hemisphereLights.value=W.state.hemi,Le.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Le.spotLightMatrix.value=W.state.spotLightMatrix,Le.spotLightMap.value=W.state.spotLightMap,Le.pointShadowMatrix.value=W.state.pointShadowMatrix),H.lightProbeGrid=E.state.lightProbeGridArray.length>0,H.currentProgram=Ge,H.uniformsList=null,Ge}function nc(T){if(T.uniformsList===null){const F=T.currentProgram.getUniforms();T.uniformsList=Va.seqWithValue(F.seq,T.uniforms)}return T.uniformsList}function sc(T,F){const X=R.get(T);X.outputColorSpace=F.outputColorSpace,X.batching=F.batching,X.batchingColor=F.batchingColor,X.instancing=F.instancing,X.instancingColor=F.instancingColor,X.instancingMorph=F.instancingMorph,X.skinning=F.skinning,X.morphTargets=F.morphTargets,X.morphNormals=F.morphNormals,X.morphColors=F.morphColors,X.morphTargetsCount=F.morphTargetsCount,X.numClippingPlanes=F.numClippingPlanes,X.numIntersection=F.numClipIntersection,X.vertexAlphas=F.vertexAlphas,X.vertexTangents=F.vertexTangents,X.toneMapping=F.toneMapping}function Ld(T,F){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;x.setFromMatrixPosition(F.matrixWorld);for(let X=0,H=T.length;X<H;X++){const W=T[X];if(W.texture!==null&&W.boundingBox.containsPoint(x))return W}return null}function Dd(T,F,X,H,W){F.isScene!==!0&&(F=Lt),b.resetTextureUnits();const xe=F.fog,Te=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?F.environment:null,ge=I===null?P.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:je.workingColorSpace,Re=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ie=O.get(H.envMap||Te,Re),Fe=H.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ge=!!X.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Le=!!X.morphAttributes.position,ct=!!X.morphAttributes.normal,Et=!!X.morphAttributes.color;let St=ki;H.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(St=P.toneMapping);const dt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Wt=dt!==void 0?dt.length:0,Me=R.get(H),si=E.state.lights;if(st===!0&&(De===!0||T!==N)){const mt=T===N&&H.id===B;Ee.setState(H,T,mt)}let Je=!1;H.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==si.state.version||Me.outputColorSpace!==ge||W.isBatchedMesh&&Me.batching===!1||!W.isBatchedMesh&&Me.batching===!0||W.isBatchedMesh&&Me.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Me.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Me.instancing===!1||!W.isInstancedMesh&&Me.instancing===!0||W.isSkinnedMesh&&Me.skinning===!1||!W.isSkinnedMesh&&Me.skinning===!0||W.isInstancedMesh&&Me.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Me.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Me.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Me.instancingMorph===!1&&W.morphTexture!==null||Me.envMap!==Ie||H.fog===!0&&Me.fog!==xe||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==Ee.numPlanes||Me.numIntersection!==Ee.numIntersection)||Me.vertexAlphas!==Fe||Me.vertexTangents!==Ge||Me.morphTargets!==Le||Me.morphNormals!==ct||Me.morphColors!==Et||Me.toneMapping!==St||Me.morphTargetsCount!==Wt||!!Me.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(Je=!0):(Je=!0,Me.__version=H.version);let li=Me.currentProgram;Je===!0&&(li=ea(H,F,W),L&&H.isNodeMaterial&&L.onUpdateProgram(H,li,Me));let Ai=!1,sn=!1,Yn=!1;const ut=li.getUniforms(),Tt=Me.uniforms;if(pe.useProgram(li.program)&&(Ai=!0,sn=!0,Yn=!0),H.id!==B&&(B=H.id,sn=!0),Me.needsLights){const mt=Ld(E.state.lightProbeGridArray,W);Me.lightProbeGrid!==mt&&(Me.lightProbeGrid=mt,sn=!0)}if(Ai||N!==T){pe.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),ut.setValue(k,"projectionMatrix",T.projectionMatrix),ut.setValue(k,"viewMatrix",T.matrixWorldInverse);const rn=ut.map.cameraPosition;rn!==void 0&&rn.setValue(k,et.setFromMatrixPosition(T.matrixWorld)),pt.logarithmicDepthBuffer&&ut.setValue(k,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ut.setValue(k,"isOrthographic",T.isOrthographicCamera===!0),N!==T&&(N=T,sn=!0,Yn=!0)}if(Me.needsLights&&(si.state.directionalShadowMap.length>0&&ut.setValue(k,"directionalShadowMap",si.state.directionalShadowMap,b),si.state.spotShadowMap.length>0&&ut.setValue(k,"spotShadowMap",si.state.spotShadowMap,b),si.state.pointShadowMap.length>0&&ut.setValue(k,"pointShadowMap",si.state.pointShadowMap,b)),W.isSkinnedMesh){ut.setOptional(k,W,"bindMatrix"),ut.setOptional(k,W,"bindMatrixInverse");const mt=W.skeleton;mt&&(mt.boneTexture===null&&mt.computeBoneTexture(),ut.setValue(k,"boneTexture",mt.boneTexture,b))}W.isBatchedMesh&&(ut.setOptional(k,W,"batchingTexture"),ut.setValue(k,"batchingTexture",W._matricesTexture,b),ut.setOptional(k,W,"batchingIdTexture"),ut.setValue(k,"batchingIdTexture",W._indirectTexture,b),ut.setOptional(k,W,"batchingColorTexture"),W._colorsTexture!==null&&ut.setValue(k,"batchingColorTexture",W._colorsTexture,b));const an=X.morphAttributes;if((an.position!==void 0||an.normal!==void 0||an.color!==void 0)&&ke.update(W,X,li),(sn||Me.receiveShadow!==W.receiveShadow)&&(Me.receiveShadow=W.receiveShadow,ut.setValue(k,"receiveShadow",W.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&F.environment!==null&&(Tt.envMapIntensity.value=F.environmentIntensity),Tt.dfgLUT!==void 0&&(Tt.dfgLUT.value=$y()),sn){if(ut.setValue(k,"toneMappingExposure",P.toneMappingExposure),Me.needsLights&&Nd(Tt,Yn),xe&&H.fog===!0&&Y.refreshFogUniforms(Tt,xe),Y.refreshMaterialUniforms(Tt,H,ye,fe,E.state.transmissionRenderTarget[T.id]),Me.needsLights&&Me.lightProbeGrid){const mt=Me.lightProbeGrid;Tt.probesSH.value=mt.texture,Tt.probesMin.value.copy(mt.boundingBox.min),Tt.probesMax.value.copy(mt.boundingBox.max),Tt.probesResolution.value.copy(mt.resolution)}Va.upload(k,nc(Me),Tt,b)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Va.upload(k,nc(Me),Tt,b),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ut.setValue(k,"center",W.center),ut.setValue(k,"modelViewMatrix",W.modelViewMatrix),ut.setValue(k,"normalMatrix",W.normalMatrix),ut.setValue(k,"modelMatrix",W.matrixWorld),H.uniformsGroups!==void 0){const mt=H.uniformsGroups;for(let rn=0,Kn=mt.length;rn<Kn;rn++){const ac=mt[rn];Z.update(ac,li),Z.bind(ac,li)}}return li}function Nd(T,F){T.ambientLightColor.needsUpdate=F,T.lightProbe.needsUpdate=F,T.directionalLights.needsUpdate=F,T.directionalLightShadows.needsUpdate=F,T.pointLights.needsUpdate=F,T.pointLightShadows.needsUpdate=F,T.spotLights.needsUpdate=F,T.spotLightShadows.needsUpdate=F,T.rectAreaLights.needsUpdate=F,T.hemisphereLights.needsUpdate=F}function kd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return z},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(T,F,X){const H=R.get(T);H.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),R.get(T.texture).__webglTexture=F,R.get(T.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:X,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,F){const X=R.get(T);X.__webglFramebuffer=F,X.__useDefaultFramebuffer=F===void 0};const Ud=k.createFramebuffer();this.setRenderTarget=function(T,F=0,X=0){I=T,z=F,U=X;let H=null,W=!1,xe=!1;if(T){const ge=R.get(T);if(ge.__useDefaultFramebuffer!==void 0){pe.bindFramebuffer(k.FRAMEBUFFER,ge.__webglFramebuffer),j.copy(T.viewport),te.copy(T.scissor),se=T.scissorTest,pe.viewport(j),pe.scissor(te),pe.setScissorTest(se),B=-1;return}else if(ge.__webglFramebuffer===void 0)b.setupRenderTarget(T);else if(ge.__hasExternalTextures)b.rebindTextures(T,R.get(T.texture).__webglTexture,R.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Fe=T.depthTexture;if(ge.__boundDepthTexture!==Fe){if(Fe!==null&&R.has(Fe)&&(T.width!==Fe.image.width||T.height!==Fe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(T)}}const Re=T.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(xe=!0);const Ie=R.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ie[F])?H=Ie[F][X]:H=Ie[F],W=!0):T.samples>0&&b.useMultisampledRTT(T)===!1?H=R.get(T).__webglMultisampledFramebuffer:Array.isArray(Ie)?H=Ie[X]:H=Ie,j.copy(T.viewport),te.copy(T.scissor),se=T.scissorTest}else j.copy(K).multiplyScalar(ye).floor(),te.copy(we).multiplyScalar(ye).floor(),se=Ae;if(X!==0&&(H=Ud),pe.bindFramebuffer(k.FRAMEBUFFER,H)&&pe.drawBuffers(T,H),pe.viewport(j),pe.scissor(te),pe.setScissorTest(se),W){const ge=R.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+F,ge.__webglTexture,X)}else if(xe){const ge=F;for(let Re=0;Re<T.textures.length;Re++){const Ie=R.get(T.textures[Re]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+Re,Ie.__webglTexture,X,ge)}}else if(T!==null&&X!==0){const ge=R.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,ge.__webglTexture,X)}B=-1},this.readRenderTargetPixels=function(T,F,X,H,W,xe,Te,ge=0){if(!(T&&T.isWebGLRenderTarget)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=R.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Te!==void 0&&(Re=Re[Te]),Re){pe.bindFramebuffer(k.FRAMEBUFFER,Re);try{const Ie=T.textures[ge],Fe=Ie.format,Ge=Ie.type;if(T.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+ge),!pt.textureFormatReadable(Fe)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!pt.textureTypeReadable(Ge)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=T.width-H&&X>=0&&X<=T.height-W&&k.readPixels(F,X,H,W,D.convert(Fe),D.convert(Ge),xe)}finally{const Ie=I!==null?R.get(I).__webglFramebuffer:null;pe.bindFramebuffer(k.FRAMEBUFFER,Ie)}}},this.readRenderTargetPixelsAsync=async function(T,F,X,H,W,xe,Te,ge=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=R.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Te!==void 0&&(Re=Re[Te]),Re)if(F>=0&&F<=T.width-H&&X>=0&&X<=T.height-W){pe.bindFramebuffer(k.FRAMEBUFFER,Re);const Ie=T.textures[ge],Fe=Ie.format,Ge=Ie.type;if(T.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+ge),!pt.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!pt.textureTypeReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Le=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Le),k.bufferData(k.PIXEL_PACK_BUFFER,xe.byteLength,k.STREAM_READ),k.readPixels(F,X,H,W,D.convert(Fe),D.convert(Ge),0);const ct=I!==null?R.get(I).__webglFramebuffer:null;pe.bindFramebuffer(k.FRAMEBUFFER,ct);const Et=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await ff(k,Et,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Le),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,xe),k.deleteBuffer(Le),k.deleteSync(Et),xe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,F=null,X=0){const H=Math.pow(2,-X),W=Math.floor(T.image.width*H),xe=Math.floor(T.image.height*H),Te=F!==null?F.x:0,ge=F!==null?F.y:0;b.setTexture2D(T,0),k.copyTexSubImage2D(k.TEXTURE_2D,X,0,0,Te,ge,W,xe),pe.unbindTexture()};const Bd=k.createFramebuffer(),Fd=k.createFramebuffer();this.copyTextureToTexture=function(T,F,X=null,H=null,W=0,xe=0){let Te,ge,Re,Ie,Fe,Ge,Le,ct,Et;const St=T.isCompressedTexture?T.mipmaps[xe]:T.image;if(X!==null)Te=X.max.x-X.min.x,ge=X.max.y-X.min.y,Re=X.isBox3?X.max.z-X.min.z:1,Ie=X.min.x,Fe=X.min.y,Ge=X.isBox3?X.min.z:0;else{const Tt=Math.pow(2,-W);Te=Math.floor(St.width*Tt),ge=Math.floor(St.height*Tt),T.isDataArrayTexture?Re=St.depth:T.isData3DTexture?Re=Math.floor(St.depth*Tt):Re=1,Ie=0,Fe=0,Ge=0}H!==null?(Le=H.x,ct=H.y,Et=H.z):(Le=0,ct=0,Et=0);const dt=D.convert(F.format),Wt=D.convert(F.type);let Me;F.isData3DTexture?(b.setTexture3D(F,0),Me=k.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(b.setTexture2DArray(F,0),Me=k.TEXTURE_2D_ARRAY):(b.setTexture2D(F,0),Me=k.TEXTURE_2D),pe.activeTexture(k.TEXTURE0),pe.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,F.flipY),pe.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),pe.pixelStorei(k.UNPACK_ALIGNMENT,F.unpackAlignment);const si=pe.getParameter(k.UNPACK_ROW_LENGTH),Je=pe.getParameter(k.UNPACK_IMAGE_HEIGHT),li=pe.getParameter(k.UNPACK_SKIP_PIXELS),Ai=pe.getParameter(k.UNPACK_SKIP_ROWS),sn=pe.getParameter(k.UNPACK_SKIP_IMAGES);pe.pixelStorei(k.UNPACK_ROW_LENGTH,St.width),pe.pixelStorei(k.UNPACK_IMAGE_HEIGHT,St.height),pe.pixelStorei(k.UNPACK_SKIP_PIXELS,Ie),pe.pixelStorei(k.UNPACK_SKIP_ROWS,Fe),pe.pixelStorei(k.UNPACK_SKIP_IMAGES,Ge);const Yn=T.isDataArrayTexture||T.isData3DTexture,ut=F.isDataArrayTexture||F.isData3DTexture;if(T.isDepthTexture){const Tt=R.get(T),an=R.get(F),mt=R.get(Tt.__renderTarget),rn=R.get(an.__renderTarget);pe.bindFramebuffer(k.READ_FRAMEBUFFER,mt.__webglFramebuffer),pe.bindFramebuffer(k.DRAW_FRAMEBUFFER,rn.__webglFramebuffer);for(let Kn=0;Kn<Re;Kn++)Yn&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,R.get(T).__webglTexture,W,Ge+Kn),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,R.get(F).__webglTexture,xe,Et+Kn)),k.blitFramebuffer(Ie,Fe,Te,ge,Le,ct,Te,ge,k.DEPTH_BUFFER_BIT,k.NEAREST);pe.bindFramebuffer(k.READ_FRAMEBUFFER,null),pe.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(W!==0||T.isRenderTargetTexture||R.has(T)){const Tt=R.get(T),an=R.get(F);pe.bindFramebuffer(k.READ_FRAMEBUFFER,Bd),pe.bindFramebuffer(k.DRAW_FRAMEBUFFER,Fd);for(let mt=0;mt<Re;mt++)Yn?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Tt.__webglTexture,W,Ge+mt):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Tt.__webglTexture,W),ut?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,an.__webglTexture,xe,Et+mt):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,an.__webglTexture,xe),W!==0?k.blitFramebuffer(Ie,Fe,Te,ge,Le,ct,Te,ge,k.COLOR_BUFFER_BIT,k.NEAREST):ut?k.copyTexSubImage3D(Me,xe,Le,ct,Et+mt,Ie,Fe,Te,ge):k.copyTexSubImage2D(Me,xe,Le,ct,Ie,Fe,Te,ge);pe.bindFramebuffer(k.READ_FRAMEBUFFER,null),pe.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ut?T.isDataTexture||T.isData3DTexture?k.texSubImage3D(Me,xe,Le,ct,Et,Te,ge,Re,dt,Wt,St.data):F.isCompressedArrayTexture?k.compressedTexSubImage3D(Me,xe,Le,ct,Et,Te,ge,Re,dt,St.data):k.texSubImage3D(Me,xe,Le,ct,Et,Te,ge,Re,dt,Wt,St):T.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,xe,Le,ct,Te,ge,dt,Wt,St.data):T.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,xe,Le,ct,St.width,St.height,dt,St.data):k.texSubImage2D(k.TEXTURE_2D,xe,Le,ct,Te,ge,dt,Wt,St);pe.pixelStorei(k.UNPACK_ROW_LENGTH,si),pe.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Je),pe.pixelStorei(k.UNPACK_SKIP_PIXELS,li),pe.pixelStorei(k.UNPACK_SKIP_ROWS,Ai),pe.pixelStorei(k.UNPACK_SKIP_IMAGES,sn),xe===0&&F.generateMipmaps&&k.generateMipmap(Me),pe.unbindTexture()},this.initRenderTarget=function(T){R.get(T).__webglFramebuffer===void 0&&b.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?b.setTextureCube(T,0):T.isData3DTexture?b.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?b.setTexture2DArray(T,0):b.setTexture2D(T,0),pe.unbindTexture()},this.resetState=function(){z=0,U=0,I=null,pe.reset(),oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}}const hs=80;class Ky{constructor(){this.ready=!1,this.loadPromise=null,this._renderer=null,this._scene=null,this._camera=null,this._model=null,this._tmpCanvas=null,this._phases={}}init(){return this.loadPromise?this.loadPromise:(this.loadPromise=this._setup().catch(e=>{console.error("[CharacterRenderer] Failed to load model:",e)}),this.loadPromise)}draw(e,t,i,s,a,r,o){if(!this.ready)return!1;this._phases[t]||(this._phases[t]=0);const l=r>.3;l?this._phases[t]=(this._phases[t]+r*.09)%(Math.PI*2):this._phases[t]*=.88;const c=this._phases[t],h=this._model;h.rotation.y=-a+Math.PI/2,l?(h.position.y=Math.abs(Math.sin(c))*.04,h.rotation.z=Math.sin(c)*.08):o?(h.position.y=0,h.rotation.z=0,h.rotation.x=-.12):(h.position.y*=.85,h.rotation.z*=.85,h.rotation.x*=.85),this._renderer.render(this._scene,this._camera);const u=this._tmpCanvas.getContext("2d");return u.clearRect(0,0,hs,hs),u.drawImage(this._renderer.domElement,0,0),e.save(),e.translate(i,s),e.drawImage(this._tmpCanvas,-40,-44),e.restore(),!0}async _setup(){this._renderer=new Yy({antialias:!0,alpha:!0,preserveDrawingBuffer:!0}),this._renderer.setSize(hs,hs),this._renderer.setPixelRatio(1),this._renderer.setClearColor(0,0),this._renderer.shadowMap.enabled=!1,this._tmpCanvas=document.createElement("canvas"),this._tmpCanvas.width=hs,this._tmpCanvas.height=hs,this._scene=new Cf;const e=.65;this._camera=new cr(-e,e,e,-e,.01,30),this._camera.position.set(0,9,0),this._camera.lookAt(0,0,0);const t=new jf(16777215,1.1);this._scene.add(t);const i=new Fc(16777215,.9);i.position.set(1,8,2),this._scene.add(i);const s=new Fc(11193599,.4);s.position.set(-2,5,-3),this._scene.add(s),this._model=await this._loadModel(),this._fitModel(this._model),this._scene.add(this._model),this.ready=!0,console.log("[CharacterRenderer] elf girl model loaded ✓")}createCustomRobotModel(){const e=new On,t=new fn(8,5,20,8),i=new Yr({color:2040877,metalness:.95,roughness:.15,name:"robot-armor"}),s=new ft(t,i);s.position.y=20,e.add(s);const a=new fn(2,2,2,8),r=new Hs({color:6749425}),o=new ft(a,r);o.rotation.x=Math.PI/2,o.position.set(0,23,7.5),e.add(o);const l=new On;l.position.set(0,33,0);const c=new ja(4.5,12,12),h=new ft(c,i);l.add(h);const u=new Mn(7,1.2,4),d=new Hs({color:16727100}),f=new ft(u,d);f.position.set(0,1,3.2),l.add(f);const p=new fn(.2,.2,6,4),v=new ft(p,i);v.position.set(-3.5,4,-1),v.rotation.z=-.25,l.add(v);const g=new ft(p,i);g.position.set(3.5,4,-1),g.rotation.z=.25,l.add(g),e.add(l);const m=new ja(4,8,8),M=new ft(m,i);M.position.set(-10,26,0),M.scale.set(1.2,1,1),e.add(M);const _=new ft(m,i);_.position.set(10,26,0),_.scale.set(1.2,1,1),e.add(_);const x=new Yr({color:1118481,metalness:.8,roughness:.4}),y=new fn(1.5,1.2,10,6),E=new ft(y,x);E.position.set(-11,19,2),E.rotation.x=.4,e.add(E);const A=new ft(y,x);A.position.set(11,19,-2),A.rotation.x=-.4,e.add(A);const S=new Mn(8,14,5),w=new ft(S,i);w.position.set(0,20,-6);const P=new fn(1,1.8,4,8),C=new ft(P,x);C.position.set(-3,-8,0),w.add(C);const L=new ft(P,x);L.position.set(3,-8,0),w.add(L);const z=new fn(1.2,.1,5,8),U=new Hs({color:16755200,transparent:!0,opacity:.8,blending:go}),I=new ft(z,U);I.position.set(-3,-11,0),w.add(I);const B=new ft(z,U);B.position.set(3,-11,0),w.add(B),e.add(w);const N=new ft(y,x);N.position.set(-4,6,0),e.add(N);const j=new ft(y,x);j.position.set(4,6,0),e.add(j);const te=new Mn(2,2.5,18),se=new Yr({color:330776,metalness:.9,roughness:.2}),ue=new ft(te,se);ue.position.set(7,16,-10),ue.rotation.y=.1,e.add(ue);const $=new On;return $.add(e),$}_loadModel(){return Promise.resolve(this.createCustomRobotModel())}_fitModel(e){const t=new qn().setFromObject(e),i=new V;t.getSize(i);const s=new V;t.getCenter(s);const r=1.1/Math.max(i.x,i.y,i.z);e.scale.setScalar(r);const o=new qn().setFromObject(e),l=new V;o.getCenter(l),e.position.set(-l.x,-l.y,-l.z)}}const gn=new Ky,cl=4200,jy=900,Nt=n=>String((n==null?void 0:n.id)??n??""),hh=(n,e)=>{const t=((n==null?void 0:n.x)||0)-((e==null?void 0:e.x)||0),i=((n==null?void 0:n.y)||0)-((e==null?void 0:e.y)||0);return t*t+i*i};function dh(n=[],e=0){const t=new Map;for(const i of n)t.has(i.team)||t.set(i.team,{team:i.team,sightings:new Map,assignments:new Map,coverClaims:new Map,updatedAt:e});return t}function uh(n,e){var t;return((t=n==null?void 0:n.get)==null?void 0:t.call(n,e))||null}function Zy(n,e,t,i){if(!n||!t||t.health<=0)return null;const s=Nt(t),a=n.sightings.get(s),r=new Set((a==null?void 0:a.seenBy)||[]);r.add(Nt(e));const o={targetId:s,x:t.x,y:t.y,vx:Number.isFinite(t.vx)?t.vx:0,vy:Number.isFinite(t.vy)?t.vy:0,seenAt:i,seenBy:r};return n.sightings.set(s,o),n.updatedAt=i,o}function hl(n,e,t,i=cl){var a,r;const s=(r=(a=n==null?void 0:n.sightings)==null?void 0:a.get)==null?void 0:r.call(a,Nt(e));return s&&t-s.seenAt<=i?s:null}function yd(n,e,t=null){if(!n)return;const i=t?new Set([...t].map(Nt)):null;for(const[s,a]of n.sightings)(e-a.seenAt>cl||i&&!i.has(s))&&n.sightings.delete(s);for(const[s,a]of n.assignments)(i&&!i.has(a.targetId)||e>a.expiresAt+cl)&&n.assignments.delete(s);for(const[s,a]of n.coverClaims)e>a.expiresAt&&n.coverClaims.delete(s)}function Jy(n=[],e=[],t,i=0){const s=n.filter(c=>(c==null?void 0:c.health)>0).sort((c,h)=>Nt(c).localeCompare(Nt(h))),a=e.filter(c=>(c==null?void 0:c.health)>0).sort((c,h)=>Nt(c).localeCompare(Nt(h))),r=new Map;if(!t||s.length===0||a.length===0)return r;const o=new Map(a.map(c=>[Nt(c),c]));yd(t,i,o.keys());const l=new Set;for(const c of s){const h=Nt(c),u=t.assignments.get(h),d=u&&o.get(u.targetId);d&&u.expiresAt>=i&&!l.has(u.targetId)&&(r.set(h,d),l.add(u.targetId))}for(const c of s){const h=Nt(c);if(r.has(h))continue;let u=a.filter(p=>!l.has(Nt(p)));u.length===0&&(u=a),u.sort((p,v)=>{const g=hl(t,p.id,i)||p,m=hl(t,v.id,i)||v;return hh(c,g)-hh(c,m)||Nt(p).localeCompare(Nt(v))});const d=u[0],f=Nt(d);r.set(h,d),l.add(f),t.assignments.set(h,{targetId:f,assignedAt:i,expiresAt:i+jy})}return t.updatedAt=i,r}function Qy(n,e,t=null){if(!n)return[];yd(n,e);const i=Nt(t);return[...n.coverClaims.entries()].filter(([s])=>s!==i).map(([,s])=>({x:s.x,y:s.y}))}function ex(n,e,t,i,s=1600){if(!n||!t)return null;const a={x:t.x,y:t.y,expiresAt:i+s};return n.coverClaims.set(Nt(e),a),a}function tx(n,e){var t,i;(i=(t=n==null?void 0:n.coverClaims)==null?void 0:t.delete)==null||i.call(t,Nt(e))}function ix(n=[],e,t={}){const i=new Map,s=new Map;for(const a of n){const r=e instanceof Map?e.get(a.team):e==null?void 0:e[a.team];if(!(r!=null&&r.length))continue;const o=i.get(a.team)||0,c=((t instanceof Map?t.get(a.team)||0:(t==null?void 0:t[a.team])||0)+o)%r.length,h=r[c];s.set(Nt(a),{x:h.x,y:h.y,slot:c}),i.set(a.team,o+1)}return s}function nx(n,e,t=[],i=18){var r;const s=i*2+14,a=[[0,0],[s,0],[-s,0],[0,s],[0,-s],[s,s],[-s,s],[s,-s],[-s,-s],[s*2,0],[-s*2,0],[0,s*2],[0,-s*2]];for(const[o,l]of a){const c=((r=n==null?void 0:n.projectPoint)==null?void 0:r.call(n,e.x+o,e.y+l,i))||null;if(c&&!(n!=null&&n.isPointClear&&!n.isPointClear(c.x,c.y,i))&&t.every(h=>Math.hypot(h.x-c.x,h.y-c.y)>=s))return{x:c.x,y:c.y}}return null}function fh(){return{waypoints:[],index:0,target:null,plannedAt:-1/0,navRevision:null,purpose:"idle",complete:!1,partialEndpoint:null,partialSince:null,dirty:!0}}function io(n){n&&(n.dirty=!0)}function sx(n,e,t,i,s,a="move",r=!0){const o=n.partialEndpoint,l=n.partialSince;n.waypoints=(e||[]).filter(u=>Number.isFinite(u==null?void 0:u.x)&&Number.isFinite(u==null?void 0:u.y)),n.index=0,n.target=t?{x:t.x,y:t.y}:null,n.plannedAt=i,n.navRevision=s,n.purpose=a,n.complete=r;const c=n.waypoints.at(-1)||null,h=!r&&c&&o&&Math.hypot(c.x-o.x,c.y-o.y)<12;return n.partialEndpoint=r||!c?null:{x:c.x,y:c.y},n.partialSince=h?l:null,n.dirty=!1,n}function ax(n,e,t,i,s=24){return!n||n.complete||!n.partialEndpoint?{incomplete:!1,atEndpoint:!1,blockedFor:0}:Math.hypot(e-n.partialEndpoint.x,t-n.partialEndpoint.y)<=s?(Number.isFinite(n.partialSince)||(n.partialSince=i),{incomplete:!0,atEndpoint:!0,blockedFor:Math.max(0,i-n.partialSince)}):(n.partialSince=null,{incomplete:!0,atEndpoint:!1,blockedFor:0})}function rx(n,e,t,i={}){if(!n||n.dirty||!n.target||!n.waypoints.length||!e)return!0;const s=i.targetTolerance??42;return!!(Math.hypot(n.target.x-e.x,n.target.y-e.y)>s||t-n.plannedAt>(i.maxAge??1100)||i.stuck||i.navRevision!=null&&n.navRevision!==i.navRevision)}function ox(n,e,t,i=24){var s;if(!((s=n==null?void 0:n.waypoints)!=null&&s.length))return(n==null?void 0:n.target)||null;for(;n.index<n.waypoints.length-1;){const a=n.waypoints[n.index];if(Math.hypot(e-a.x,t-a.y)>i)break;n.index++}return n.waypoints[Math.min(n.index,n.waypoints.length-1)]||n.target}function lx(n,e,t,i=36){const s=Math.max(1,Number(t)||1),a=e.x-n.x,r=e.y-n.y,o=Math.min(i,Math.max(0,Math.hypot(a,r)-22)/s);return{x:e.x+(Number(e.vx)||0)*o,y:e.y+(Number(e.vy)||0)*o}}function ph(n,e,t){let i=e-n;for(;i<-Math.PI;)i+=Math.PI*2;for(;i>Math.PI;)i-=Math.PI*2;return n+Math.max(-t,Math.min(t,i))}function cx(n,e=[],t=72){let i=0,s=0;for(const a of e){if(!a||a===n||a.health<=0)continue;const r=n.x-a.x,o=n.y-a.y,l=Math.hypot(r,o);if(l>0&&l<t){const c=(t-l)/t;i+=r/l*c,s+=o/l*c}}return{x:i,y:s}}const Ta=[{id:"recruit",label:"RECRUIT",minRP:0,maxRP:999,color:"#8a9bb5",icon:"▪"},{id:"veteran",label:"VETERAN",minRP:1e3,maxRP:3999,color:"#e8c84a",icon:"◆"},{id:"elite",label:"ELITE",minRP:4e3,maxRP:1/0,color:"#ff6ef7",icon:"★"}],wa=80,Aa=-40,mh={pistol:{name:"Tactical 9mm",damage:22,fireRate:300,accuracy:.95,magSize:12,range:400,reloadTime:1200,speedMultiplier:1,type:"Semi-Auto",recoil:3,bulletSpeed:14},rifle:{name:"Assault Rifle (M4A1)",damage:26,fireRate:110,accuracy:.88,magSize:30,range:600,reloadTime:2200,speedMultiplier:1,type:"Automatic",recoil:4.5,bulletSpeed:16},shotgun:{name:"Shotgun (Remington 870)",damage:14,fireRate:850,accuracy:.65,magSize:6,range:250,reloadTime:2800,speedMultiplier:1,type:"Pump-Action",pellets:7,recoil:12,bulletSpeed:12},sniper:{name:"Sniper Rifle (AWM)",damage:95,fireRate:1500,accuracy:.99,magSize:5,range:1200,reloadTime:2800,speedMultiplier:1,type:"Bolt-Action",recoil:18,bulletSpeed:24},smg:{name:"SMG (MP5)",damage:18,fireRate:75,accuracy:.82,magSize:30,range:350,reloadTime:1500,speedMultiplier:1,type:"Automatic",recoil:2.2,bulletSpeed:13},lmg:{name:"LMG (M249)",damage:25,fireRate:85,accuracy:.75,magSize:100,range:550,reloadTime:4500,speedMultiplier:1,type:"Automatic",recoil:6,bulletSpeed:15},dmr:{name:"DMR (M14 EBR)",damage:45,fireRate:400,accuracy:.94,magSize:20,range:800,reloadTime:2400,speedMultiplier:1,type:"Semi-Auto",recoil:8.5,bulletSpeed:20},knife:{name:"Tactical Knife",damage:55,fireRate:350,accuracy:1,magSize:1,range:60,reloadTime:0,speedMultiplier:1.15,type:"Melee",recoil:0,bulletSpeed:20},vector:{name:"Vector SMG",damage:14,fireRate:48,accuracy:.87,magSize:33,range:320,reloadTime:1100,speedMultiplier:1.02,type:"Automatic",recoil:1.8,bulletSpeed:14},famas:{name:"FAMAS Burst Carbine",damage:20,fireRate:450,accuracy:.93,magSize:25,range:550,reloadTime:1800,speedMultiplier:1,type:"Automatic",pellets:3,recoil:3.5,bulletSpeed:17},plasma:{name:"Plasma Rifle PL-45",damage:32,fireRate:150,accuracy:.92,magSize:20,range:600,reloadTime:2e3,speedMultiplier:1,type:"Automatic",recoil:2,bulletSpeed:10},railgun:{name:"Railgun RG-X",damage:85,fireRate:1400,accuracy:.99,magSize:5,range:1200,reloadTime:3500,speedMultiplier:.95,type:"Automatic",recoil:22,bulletSpeed:32}},ds={cyan:{body:"#3ba39f",armor:"#16202c",helmet:"#66fcf1"},green:{body:"#39db14",armor:"#133d07",helmet:"#5eff39"},purple:{body:"#9d3bff",armor:"#20083c",helmet:"#c47aff"},orange:{body:"#ff7f3b",armor:"#3f1b07",helmet:"#ff9d7a"},yellow:{body:"#ffd700",armor:"#3a3000",helmet:"#ffea70"},red:{body:"#ff3c3c",armor:"#3a0707",helmet:"#ff7a7a"}};class hx{constructor(e,t,i,s,a,r,o=!1,l=!1){this.id=e,this.x=t,this.y=i,this.vx=0,this.vy=0,this.radius=18,this.angle=0,this.name=s,this.isLocal=o,this.isBot=l,this.colorTheme=r||(o?"cyan":"red"),this.isTeammate=!1,this.health=100,this.maxHealth=100,this.score=0,this.rp=o?parseInt(localStorage.getItem("tacticstrike_rp")||"0"):0,this.rank=this._calcRank(this.rp),this.weaponKey=a,this.weapon={...mh[a]},this.primaryWeaponKey=a,this.activeSlot=1,this.primaryAmmoInMag=this.weapon.magSize,this.primaryReserveAmmo=this.weapon.magSize*3,this.ammoInMag=this.weapon.magSize,this.reserveAmmo=this.weapon.magSize*3,this.maxReserveAmmo=this.weapon.magSize*5,this.isReloading=!1,this.reloadStartTime=0,this.lastFiredTime=0,this.accel=.3,this.maxSpeed=3.4,this.friction=.84,this.muzzleFlash=0,this.footstepTimer=0,this.currentSpeed=0,this.flashGrenades=1,this.flashAlpha=0,this.throwFlashbangRequest=!1,this.botTargetX=t,this.botTargetY=i,this.botState="patrol",this.lastKnownPlayerPos=null,this.botReactTime=0,this.botLastDecisionTime=0,this.botShootDelay=0,this.botRoute=fh(),this.botTargetPurpose="patrol",this.botAimReadyAt=0,this.botAimTargetId=null,this.botHadLOS=!1,this.botLastSeenAt=-1/0,this.botCoverUntil=0,this.botLaneSign=1,this.flashlightActive=!0,this.botStrafeDir=Math.random()>.5?1:-1,this.botLastStrafeToggle=0,this.dashTrails=[],this.networkJustDashed=!1,this.weaponXP=0,this.weaponLevel=1,this.weaponLevelUpAlert=0,this.healthPacks=0,this.ammoPacks=0}_calcRank(e){for(let t=Ta.length-1;t>=0;t--)if(e>=Ta[t].minRP)return Ta[t];return Ta[0]}applyRankDelta(e){this.rp=Math.max(0,this.rp+e);const t=this._calcRank(this.rp),i=t.id!==this.rank.id;if(this.rank=t,this.isLocal)try{localStorage.setItem("tacticstrike_rp",String(this.rp))}catch{}return i}addWeaponXP(e){if(this.health<=0)return;this.weaponXP+=e;let t=!1;for(;this.weaponXP>=this.weaponLevel*100;)this.weaponXP-=this.weaponLevel*100,this.weaponLevel++,t=!0;t&&(this.weaponLevelUpAlert=4,this.isLocal&&!this.isBot&&this.updateHUD())}changeWeapon(e){this.weaponKey=e,this.weapon={...mh[e]},this.ammoInMag=this.weapon.magSize,this.reserveAmmo=this.weapon.magSize*3,this.isReloading=!1,e!=="knife"&&(this.primaryWeaponKey=e,this.primaryAmmoInMag=this.ammoInMag,this.primaryReserveAmmo=this.reserveAmmo)}switchSlot(e){e!==this.activeSlot&&(this.activeSlot===1&&(this.primaryAmmoInMag=this.ammoInMag,this.primaryReserveAmmo=this.reserveAmmo),this.activeSlot=e,e===1?(this.changeWeapon(this.primaryWeaponKey),this.ammoInMag=this.primaryAmmoInMag,this.reserveAmmo=this.primaryReserveAmmo):e===2&&(this.changeWeapon("knife"),this.ammoInMag=1,this.reserveAmmo=1/0),this.isLocal&&!this.isBot&&(this.updateHUD(),window.AppSocket&&window.AppSocket.emit("select-weapon",{weapon:this.weaponKey})))}update(e,t,i,s,a,r=null,o=null,l=null){if(this.health<=0)return;const c=window.gameEngine&&window.gameEngine.matchMode==="sabotage",h=Math.max(1,Math.min(150,a-(this.lastUpdateTime||a)));if(c)if(this.team===1){if(this.flashlightActive=!1,this.weaponKey="none",this.isLocal&&this.inVent){this.vx=0,this.vy=0,this.lastUpdateTime=a,this.health=Math.min(this.health,this.maxHealth),this.flashAlpha=Math.max(0,this.flashAlpha-h*5e-4);return}}else this.flashlightActive=!0;this.lastUpdateTime||(this.lastUpdateTime=a);const u=a-this.lastUpdateTime;this.lastUpdateTime=a;const d=Date.now();this.adrenalineActive=!!(this.adrenalineEndTime&&d<this.adrenalineEndTime),this.overdriveActive=!!(this.overdriveEndTime&&d<this.overdriveEndTime),this.updateBuffsHUD(d);const f=Math.max(1,Math.min(150,u)),p=f/16.67,g=window.gameEngine&&window.gameEngine.isRanked?1.25:1;if(this.isLocal&&!this.isBot){this.handleLocalInput(e,t,s,a,p),this.updateDashHUD(a);const C=window.gameEngine&&window.gameEngine.devCheatActive;if(this.maxHealth=C?200:100,this.aimbotHasLOS=!1,C){this.health>200&&(this.health=200);const L=this.team===1?2:1,z=window.gameEngine.players.filter(U=>U!==this&&U.health>0&&U.team===L);if(z.length>0){const U=window.gameEngine.map;z.sort((B,N)=>Math.hypot(this.x-B.x,this.y-B.y)-Math.hypot(this.x-N.x,this.y-N.y));let I=null;if(U&&(I=z.find(B=>this.checkLineOfSight(U,this.x,this.y,B.x,B.y))),I){const B=Math.hypot(this.x-I.x,this.y-I.y),N=this.weapon.range||400;if(B<=N){this.aimbotHasLOS=!0;const j=I.x-this.x,te=I.y-this.y,se=B>0?Math.max(0,B-22)/B:0,ue=j*se,$=te*se,q=this.weapon.bulletSpeed||15,fe=I.vx||0,ye=I.vy||0,G=fe*fe+ye*ye,J=q*q-G,K=-2*(ue*fe+$*ye),we=-(ue*ue+$*$);let Ae=0;if(Math.abs(J)>.001){const De=K*K-4*J*we;if(De>=0){const Xe=(-K+Math.sqrt(De))/(2*J),et=(-K-Math.sqrt(De))/(2*J);Xe>0&&et>0?Ae=Math.min(Xe,et):Xe>0?Ae=Xe:et>0&&(Ae=et)}}else if(Math.abs(K)>.001){const De=-we/K;De>0&&(Ae=De)}const Pe=I.x+fe*Ae,st=I.y+ye*Ae;this.angle=Math.atan2(st-this.y,Pe-this.x)}}}}else this.health>100&&(this.health=100)}else this.isBot&&this.handleBotAI(i,s,a,r,o,p,l||{});const m=this.isLocal&&e&&e.shift,M=this.adrenalineActive?1.35:1,_=this.weapon.speedMultiplier*(m?1.75:1)*g*M;let x=this.maxSpeed*_;this.lastDashTime&&a-this.lastDashTime<200&&(x=22,(!this.lastTrailSpawnTime||a-this.lastTrailSpawnTime>25)&&(this.dashTrails||(this.dashTrails=[]),this.dashTrails.push({x:this.x,y:this.y,angle:this.angle,time:a}),this.lastTrailSpawnTime=a)),this.dashTrails&&this.dashTrails.length>0&&(this.dashTrails=this.dashTrails.filter(C=>a-C.time<180)),this.vx*=Math.pow(this.friction,p),this.vy*=Math.pow(this.friction,p);const A=Math.sqrt(this.vx*this.vx+this.vy*this.vy);A>x&&(this.vx=this.vx/A*x,this.vy=this.vy/A*x),this.currentSpeed=A;const S=this.x+this.vx*p,w=this.y+this.vy*p,P=i.moveCircle?i.moveCircle(this.x,this.y,this.vx*p,this.vy*p,this.radius):i.checkCircleCollision(S,w,this.radius);if(this.x=P.x,this.y=P.y,P.collided){const C=this.vx*P.normalX+this.vy*P.normalY;C<0&&(this.vx-=C*P.normalX,this.vy-=C*P.normalY)}if((Math.abs(this.vx)>.5||Math.abs(this.vy)>.5)&&(this.footstepTimer+=A,this.footstepTimer>120&&(this.footstepTimer=0,s))){const C=o?Math.hypot(this.x-o.x,this.y-o.y):0;(this.isLocal||C<450)&&s.playFootstep()}if(this.isReloading&&a-this.reloadStartTime>=this.weapon.reloadTime){const L=this.weapon.magSize-this.ammoInMag,z=Math.min(L,this.reserveAmmo);this.ammoInMag+=z,this.reserveAmmo-=z,this.isReloading=!1,this.isLocal&&!this.isBot&&this.updateHUD()}this.muzzleFlash>0&&(this.muzzleFlash=Math.max(0,this.muzzleFlash-.15*p)),this.flashAlpha>0&&(this.flashAlpha=Math.max(0,this.flashAlpha-.008*p)),this.weaponLevelUpAlert>0&&(this.weaponLevelUpAlert=Math.max(0,this.weaponLevelUpAlert-f/1e3))}handleLocalInput(e,t,i,s,a){if(window.gameEngine&&window.gameEngine.activeMinigame){this.vx=0,this.vy=0;return}const o=e&&e.shift?1.75:1;let c=window.gameEngine&&window.gameEngine.isRanked?1.25:1;this.adrenalineActive&&(c*=1.35);const h=this.accel*c;let u=0,d=0;if((e.w||e.arrowup)&&(d-=h*o),(e.s||e.arrowdown)&&(d+=h*o),(e.a||e.arrowleft)&&(u-=h*o),(e.d||e.arrowright)&&(u+=h*o),u!==0&&d!==0&&(u*=.7071,d*=.7071),this.vx+=u*a,this.vy+=d*a,this.angle=t.angle,e&&e[" "]&&(!this.lastDashTime||s-this.lastDashTime>1e4)){this.lastDashTime=s,this.justDashed=!0,this.networkJustDashed=!0;const p=22;if(this.vx=Math.cos(this.angle)*p,this.vy=Math.sin(this.angle)*p,i)try{i.playDashSound(0)}catch{}}(e.r||e.R)&&!this.isReloading&&this.ammoInMag<this.weapon.magSize&&this.reserveAmmo>0&&this.startReload(i,s)}startReload(e,t){if(this.isReloading=!0,this.reloadStartTime=t,e&&e.playReload(this.weaponKey),this.isLocal&&!this.isBot){const i=document.getElementById("reload-indicator");i&&(i.style.display="flex",setTimeout(()=>{i&&(i.style.display="none")},this.weapon.reloadTime))}}shoot(e,t,i=0){if(this.health<=0||this.isReloading||window.gameEngine&&window.gameEngine.matchMode==="sabotage"&&this.team===1)return null;window.gameEngine&&window.gameEngine.devCheatActive&&this.isLocal;const a=this.overdriveEndTime&&e<this.overdriveEndTime||this.overdriveActive?.5:1;if(e-this.lastFiredTime<this.weapon.fireRate*a)return null;if(this.weaponKey!=="knife"&&this.ammoInMag<=0)return t&&t.playDryFire(),this.lastFiredTime=e,this.reserveAmmo>0&&this.startReload(t,e),null;this.weaponKey!=="knife"&&this.ammoInMag--,this.lastFiredTime=e,this.muzzleFlash=this.weaponKey==="knife"?0:1;const r=this.weapon.recoil;return this.vx-=Math.cos(this.angle)*r*.15,this.vy-=Math.sin(this.angle)*r*.15,t&&t.playGunshot(this.weaponKey,i),this.isLocal&&!this.isBot&&this.updateHUD(),{playerId:this.id,x:this.x+Math.cos(this.angle)*22,y:this.y+Math.sin(this.angle)*22,angle:this.angle,weaponKey:this.weaponKey,damage:this.weapon.damage,bulletSpeed:this.weapon.bulletSpeed,range:this.weapon.range,recoil:r,pellets:this.weapon.pellets||1,accuracy:this.weapon.accuracy}}updateHUD(){const e=document.getElementById("hud-self-hp");e&&(e.style.width=`${Math.max(0,this.health)}%`);const t=document.getElementById("hud-self-hp-text");t&&(t.innerText=Math.round(Math.max(0,this.health)));const i=document.getElementById("hud-weapon-name");if(i&&this.weapon&&this.weapon.name){const l=this.weaponKey!=="knife"&&this.weaponKey!=="none"?` [LVL ${this.weaponLevel}]`:"";i.innerText=(this.weapon.name+l).toUpperCase()}const s=document.getElementById("hud-ammo-val");s&&(s.innerText=`${this.ammoInMag} / ${this.reserveAmmo}`);const a=document.getElementById("hud-flash-val");a&&(a.innerText=`FLASH [${this.flashGrenades!==void 0?this.flashGrenades:1}]`,this.flashGrenades<=0?(a.style.color="#ff3c3c",a.style.borderColor="rgba(255, 60, 60, 0.3)"):(a.style.color="#ffd700",a.style.borderColor="rgba(255, 215, 0, 0.3)"));const r=document.getElementById("hud-stashed-packs");r&&(r.innerHTML=`MEDKITS [${this.healthPacks||0}] &nbsp; AMMO PACKS [${this.ammoPacks||0}]`);const o=document.getElementById("hud-weapon-xp-wrapper");if(o)if(this.weaponKey!=="knife"&&this.weaponKey!=="none"){o.style.display="flex";const l=this.weaponLevel*100,c=this.weaponXP/l*100,h=document.getElementById("hud-weapon-xp");h&&(h.style.width=`${c}%`);const u=document.getElementById("hud-weapon-xp-text");u&&(u.innerText=`${this.weaponXP}/${l}`)}else o.style.display="none";for(let l=1;l<=3;l++){const c=document.getElementById(`inv-slot-${l}`);if(c){if(l===3)c.innerText=`[3] FLASH (${this.flashGrenades!==void 0?this.flashGrenades:1})`;else if(l===1){const h=this.primaryWeaponKey?this.primaryWeaponKey.toUpperCase():"PRIMARY";c.innerText=`[1] ${h}`}this.activeSlot===l?(c.style.background="rgba(102, 252, 241, 0.12)",c.style.borderColor="var(--neon-cyan)",c.style.color="#fff",c.style.boxShadow="0 0 8px rgba(102,252,241,0.2)"):(c.style.background="rgba(0, 0, 0, 0.4)",c.style.borderColor="rgba(255,255,255,0.08)",c.style.color="rgba(255,255,255,0.5)",c.style.boxShadow="none")}}}updateDashHUD(e){const i=document.getElementById("hud-dash-status"),s=document.getElementById("hud-dash-icon");if(i)if(!this.lastDashTime||e-this.lastDashTime>=1e4)i.innerText="DASH READY (SPACE)",i.style.color="var(--neon-cyan)",s&&(s.innerText="⚡",s.style.color="var(--neon-cyan)");else{const a=Math.ceil((1e4-(e-this.lastDashTime))/1e3);i.innerText=`DASH COOLDOWN: ${a}s`,i.style.color="#ff3c3c",s&&(s.innerText="⏳",s.style.color="#ff3c3c")}}takeDamage(e,t){if(!(this.health<=0)){if(this.health=Math.max(0,this.health-e),t&&t.playFleshHit(),this.isLocal&&!this.isBot){this.updateHUD();const i=document.getElementById("game-canvas");i&&(i.style.filter="drop-shadow(0 0 10px rgba(255, 0, 0, 0.4))",setTimeout(()=>i.style.filter="none",150))}if(this.isBot&&this.health>0){const i=Date.now();if((!this.lastDashTime||i-this.lastDashTime>3e3)&&Math.random()<.6){this.lastDashTime=i,this.networkJustDashed=!0;const a=this.angle+Math.PI/2*(Math.random()>.5?1:-1);if(this.vx=Math.cos(a)*20,this.vy=Math.sin(a)*20,t&&t.playFrictionalScrape)try{t.playFrictionalScrape(0,.4,.5)}catch{}}}}}checkPickups(e,t){this.health<=0||e.items.forEach(i=>{if(!i.active)return;if(Math.hypot(this.x-i.x,this.y-i.y)<this.radius+12){if(i.active=!1,i.type==="health"){if(this.health>=this.maxHealth)if(this.healthPacks<2)this.healthPacks++,t&&t.playPickup(),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+1 STASHED MEDKIT","#ff6ef7"));else{i.active=!0;return}else if(t&&t.playPickup(),this.health=Math.min(this.maxHealth,this.health+35),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+35 HEALTH"),window.AppSocket)){const r=window.gameEngine&&window.gameEngine.devCheatActive?Math.round(this.health/2):this.health;window.AppSocket.emit("sync-health",{playerId:this.id,health:r})}}else if(i.type==="ammo")if(this.reserveAmmo>=this.maxReserveAmmo)if(this.ammoPacks<2)this.ammoPacks++,t&&t.playPickup(),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+1 STASHED AMMO PACK","#ff6ef7"));else{i.active=!0;return}else{t&&t.playPickup();const a=this.weapon.magSize*2;this.reserveAmmo=Math.min(this.maxReserveAmmo,this.reserveAmmo+a),this.isLocal&&!this.isBot&&(this.updateHUD(),this.showTextNotification("+AMMO"))}else i.type==="adrenaline"?(t&&t.playPickup(),this.adrenalineEndTime=Date.now()+8e3,this.adrenalineActive=!0,this.isLocal&&!this.isBot&&this.showTextNotification("⚡ SPEED BOOST ACTIVE")):i.type==="overdrive"&&(this.overdriveEndTime=Date.now()+6e3,this.overdriveActive=!0,this.isLocal&&!this.isBot&&this.showTextNotification("🔥 OVERDRIVE CHARGED"));this.isLocal&&!this.isBot&&window.AppSocket&&window.AppSocket.emit("pickup-item",{itemId:i.id})}})}showTextNotification(e,t="#ffd700"){this.floatingText={text:e,timer:45,yOffset:-30,color:t}}handleBotAI(e,t,i,s,a,r,o={}){const l=o.navigation||null,c=o.blackboard||null,h=o.teammates||[],u=o.combatEnabled!==!1,d=!!(s&&s.health>0),f=d?Math.hypot(this.x-s.x,this.y-s.y):1/0,p=d&&!s.inVent&&f<760&&(l!=null&&l.hasClearPath?l.hasClearPath(this.x,this.y,s.x,s.y,1):this.checkLineOfSight(e,this.x,this.y,s.x,s.y));let g=(d?Math.atan2(s.y-this.y,s.x-this.x):this.angle)-this.angle;for(;g<-Math.PI;)g+=Math.PI*2;for(;g>Math.PI;)g-=Math.PI*2;const m=Math.abs(g)<=38*Math.PI/180,M=p&&(f<145||s.flashlightActive||this.flashlightActive&&m);M?(Zy(c,this,s,i),this.lastKnownPlayerPos={x:s.x,y:s.y},this.botLastSeenAt=i,(!this.botHadLOS||this.botAimTargetId!==String(s.id))&&(this.botAimTargetId=String(s.id),this.botAimReadyAt=i+105+Math.random()*120),this.botHadLOS=!0):i-this.botLastSeenAt>420&&(this.botHadLOS=!1);const _=d?hl(c,s.id,i):null;d&&i-s.lastFiredTime<520&&f<900&&!M&&(this.lastKnownPlayerPos={x:s.x,y:s.y},this.botState="search",this.setBotTarget(e,l,s.x,s.y,"gunshot",i));let y=!1;const E=typeof window<"u"?window.gameEngine:null;if((E==null?void 0:E.matchMode)==="sabotage"){const q=(E.tasks||[]).filter(fe=>fe.alarmActive);if(q.length&&!(M&&f<120)){const fe=q.reduce((ye,G)=>!ye||Math.hypot(this.x-G.x,this.y-G.y)<Math.hypot(this.x-ye.x,this.y-ye.y)?G:ye,null);fe&&this.setBotTarget(e,l,fe.x,fe.y,"alarm",i)&&(this.botState="search",y=!0)}}const A=i-this.botLastDecisionTime>230;if(!y&&A){this.botLastDecisionTime=i,i-this.botLastStrafeToggle>1100&&(this.botStrafeDir*=-1,this.botLastStrafeToggle=i),this.ammoInMag===0&&!this.isReloading&&this.reserveAmmo>0&&this.startReload(t,i);let q=!1;const fe=M?s:_;if(fe&&(this.health<46||this.isReloading)&&(l!=null&&l.findCoverPoint)){const G=Qy(c,i,this.id),J=l.findCoverPoint(this.x,this.y,fe.x,fe.y,{radius:this.radius,claimed:G});J&&this.setBotTarget(e,l,J.x,J.y,"cover",i)&&(ex(c,this.id,J,i),this.botState="cover",this.botCoverUntil=i+1250,q=!0)}if(!q&&this.health<38&&!M){const J=(e.items||[]).filter(K=>K.active&&K.type==="health").sort((K,we)=>Math.hypot(this.x-K.x,this.y-K.y)-Math.hypot(this.x-we.x,this.y-we.y)).find(K=>!l||l.projectPoint(K.x,K.y,this.radius));J&&this.setBotTarget(e,l,J.x,J.y,"health",i)&&(this.botState="health",q=!0)}if(!q&&M){tx(c,this.id),this.botState="chase",u&&this.flashGrenades>0&&f>240&&f<500&&Math.random()<.035&&(this.throwFlashbangRequest=!0);const G=s.x-this.x,J=s.y-this.y,K=f>1?1/f:0;let we,Ae;if(this.weaponKey==="sniper"&&f<430)we=this.x-G*K*210,Ae=this.y-J*K*210;else if(this.weaponKey==="shotgun")we=s.x-G*K*62,Ae=s.y-J*K*62;else{const Pe=this.botLaneSign||this.botStrafeDir||1,st=145+(o.laneIndex||0)%2*40;we=s.x+-J*K*st*Pe,Ae=s.y+G*K*st*Pe}this.setBotTarget(e,l,we,Ae,"chase",i)}else if(!q&&!M){const G=_||this.lastKnownPlayerPos;let J=Math.hypot(this.x-this.botTargetX,this.y-this.botTargetY);(this.botState==="cover"&&(i>=this.botCoverUntil||!this.isReloading&&this.health>=46)||this.botState==="health"&&(this.health>=55||J<42))&&(this.botState=G?"search":"patrol"),G&&(this.botState==="chase"||this.botState==="search"||_)&&(this.botState="search",this.setBotTarget(e,l,G.x,G.y,_?"shared-sighting":"search",i)),J=Math.hypot(this.x-this.botTargetX,this.y-this.botTargetY),(this.botState==="search"&&J<42||this.botState==="patrol"&&J<42||!Number.isFinite(this.botTargetX)||!Number.isFinite(this.botTargetY))&&(this.botState="patrol",this.choosePatrolPoint(e,l))}}let S=1/0;if(M){const q=lx(this,s,this.weapon.bulletSpeed||15,30),fe=Math.max(0,Math.min(1,(i-(this.botAimReadyAt-160))/420)),ye=i*.006+String(this.id).length*1.7,G=Math.sin(ye)*(.045-fe*.026),J=Math.atan2(q.y-this.y,q.x-this.x)+G;this.angle=ph(this.angle,J,.095*Math.max(.55,r));let K=J-this.angle;for(;K<-Math.PI;)K+=Math.PI*2;for(;K>Math.PI;)K-=Math.PI*2;S=Math.abs(K)}const w=this.validateBotTarget(e,l,this.botTargetX,this.botTargetY);w?(this.botTargetX=w.x,this.botTargetY=w.y):this.choosePatrolPoint(e,l);const P={x:this.botTargetX,y:this.botTargetY},C=(l==null?void 0:l.obstacleRevision)??null,L=this.botState==="chase"?620:1250,z=h.filter(q=>q&&q!==this&&q.health>0).map(q=>({x:q.x,y:q.y,radius:q.radius||18}));if(l&&rx(this.botRoute,P,i,{maxAge:L,targetTolerance:this.botState==="chase"?34:18,navRevision:C,stuck:(this.stuckDuration||0)>430})){const q=l.findPath(this.x,this.y,P.x,P.y,{radius:this.radius,avoidPoints:z}),fe=q!=null&&q.length?q:[{x:this.x,y:this.y}],ye=fe.at(-1),G=!!ye&&Math.hypot(ye.x-P.x,ye.y-P.y)<=this.radius+4;sx(this.botRoute,fe,P,i,C,this.botTargetPurpose,G)}const U=l?ox(this.botRoute,this.x,this.y,this.radius+7):P,I=(U==null?void 0:U.x)??P.x,B=(U==null?void 0:U.y)??P.y,N=Math.hypot(this.x-I,this.y-B),j=ax(this.botRoute,this.x,this.y,i,this.radius+8);if(N>28){if(!this.lastStuckCheckTime)this.lastStuckCheckTime=i,this.lastStuckPosX=this.x,this.lastStuckPosY=this.y,this.stuckDuration=0;else if(i-this.lastStuckCheckTime>300){const q=Math.hypot(this.x-this.lastStuckPosX,this.y-this.lastStuckPosY);this.stuckDuration=q<10?(this.stuckDuration||0)+i-this.lastStuckCheckTime:0,this.lastStuckCheckTime=i,this.lastStuckPosX=this.x,this.lastStuckPosY=this.y,this.stuckDuration>430&&io(this.botRoute)}}else this.stuckDuration=0;j.atEndpoint&&j.blockedFor>350&&io(this.botRoute);const te=Math.max(this.stuckDuration||0,j.blockedFor);if(te>650){const q=j.incomplete?Math.atan2(P.y-this.y,P.x-this.x):Math.atan2(B-this.y,I-this.x),fe=this.x+Math.cos(q)*45,ye=this.y+Math.sin(q)*45,G=(e.walls||[]).find(J=>J.type==="crate"&&fe>=J.x&&fe<=J.x+J.w&&ye>=J.y&&ye<=J.y+J.h);if(u&&G){if(this.angle=Math.atan2(G.y+G.h/2-this.y,G.x+G.w/2-this.x),this.ammoInMag===0&&!this.isReloading&&this.reserveAmmo>0)this.startReload(t,i);else if(!this.isReloading&&this.ammoInMag>0&&i-this.lastFiredTime>=(this.weapon.fireRate||300)){const J=this.shoot(i,t,50);J&&typeof window<"u"&&window.OnBotShootCallback&&window.OnBotShootCallback(J)}}else te>1800&&this.botTargetPurpose!=="alarm"&&(this.botState="patrol",this.choosePatrolPoint(e,l),this.stuckDuration=0)}const se=E==null?void 0:E.isRanked,ue=this.accel*(se?1.25:1)*(this.adrenalineActive?1.35:1);if(N>10){const q=Math.atan2(B-this.y,I-this.x);M||(this.angle=ph(this.angle,q,.14*Math.max(.7,r))),this.vx+=Math.cos(q)*ue*r,this.vy+=Math.sin(q)*ue*r}const $=cx(this,h);if(this.vx+=$.x*ue*1.15*r,this.vy+=$.y*ue*1.15*r,u&&M&&i>=this.botAimReadyAt&&S<.105&&!this.isReloading&&this.ammoInMag>0&&f<=(this.weapon.range||400)*1.08){const q=this.weapon.fireRate||300;if(i-this.lastFiredTime>=q){const fe=this.shoot(i,t,f);fe&&typeof window<"u"&&window.OnBotShootCallback&&window.OnBotShootCallback(fe)}}}checkLineOfSight(e,t,i,s,a){return!e.getLineIntersection({x:t,y:i},{x:s,y:a})}validateBotTarget(e,t,i,s){var o,l;if(!Number.isFinite(i)||!Number.isFinite(s))return null;if((o=t==null?void 0:t.isPointClear)!=null&&o.call(t,i,s,this.radius))return{x:i,y:s};const a=(l=t==null?void 0:t.projectPoint)==null?void 0:l.call(t,i,s,this.radius);if(a&&Number.isFinite(a.x)&&Number.isFinite(a.y))return a;if(!(e!=null&&e.checkCircleCollision))return null;const r=e.checkCircleCollision(i,s,this.radius);return Number.isFinite(r==null?void 0:r.x)&&Number.isFinite(r==null?void 0:r.y)?r:null}setBotTarget(e,t,i,s,a="move",r=0,o=!1){const l=this.validateBotTarget(e,t,i,s);if(!l)return!1;const c=Math.hypot(l.x-this.botTargetX,l.y-this.botTargetY)>12||this.botTargetPurpose!==a;return this.botTargetX=l.x,this.botTargetY=l.y,this.botTargetPurpose=a,(c||o)&&io(this.botRoute),!0}resetBotRound(e,t){return this.botRoute=fh(),this.botState="patrol",this.botTargetPurpose="patrol",this.botAimReadyAt=0,this.botAimTargetId=null,this.botHadLOS=!1,this.botLastSeenAt=-1/0,this.botCoverUntil=0,this.lastKnownPlayerPos=null,this.lastStuckCheckTime=0,this.stuckDuration=0,this.choosePatrolPoint(e,t)}choosePatrolPoint(e,t=null,i=Math.random){var r;const s=(r=t==null?void 0:t.choosePatrolPoint)==null?void 0:r.call(t,this.x,this.y,i);if(s&&this.setBotTarget(e,t,s.x,s.y,"patrol",0,!0))return s;const a=(e==null?void 0:e.rooms)||[];for(let o=0;o<30;o++){const l=a.length?a[Math.floor(i()*a.length)]:{x:60,y:60,w:Math.max(1,((e==null?void 0:e.width)||200)-120),h:Math.max(1,((e==null?void 0:e.height)||200)-120)},c=42,h=l.x+c+i()*Math.max(1,l.w-c*2),u=l.y+c+i()*Math.max(1,l.h-c*2),d=this.validateBotTarget(e,t,h,u);if(d&&this.setBotTarget(e,t,d.x,d.y,"patrol",0,!0))return d}return this.setBotTarget(e,t,this.x,this.y,"patrol",0,!0)?{x:this.botTargetX,y:this.botTargetY}:null}draw(e,t={laser:!0},i=null){var f,p;if(this.inVent)return;if(this.health<=0){e.save(),e.fillStyle="rgba(180, 0, 0, 0.35)",e.beginPath(),e.ellipse(this.x,this.y,this.radius+8,this.radius+4,0,0,Math.PI*2),e.fill(),gn.ready&&(e.save(),e.translate(this.x,this.y),e.rotate(this.angle+Math.PI/2),e.globalAlpha=.55,gn.draw(e,this.id+"_dead",0,0,0,0,!1,this.isLocal?"blue":"red"),e.restore()),e.restore();return}if(e.save(),this.health>0&&this.muzzleFlash>.15){e.save();const v=130*this.muzzleFlash,g=e.createRadialGradient(this.x,this.y,10,this.x,this.y,v);g.addColorStop(0,"rgba(255, 160, 40, 0.28)"),g.addColorStop(.5,"rgba(255, 100, 20, 0.10)"),g.addColorStop(1,"rgba(255, 50, 0, 0.0)"),e.fillStyle=g,e.beginPath(),e.arc(this.x,this.y,v,0,Math.PI*2),e.fill(),e.restore()}const s=window.gameEngine&&window.gameEngine.matchMode==="sabotage";if(t.laser&&this.isLocal&&!this.isReloading&&!s){const v=this.weapon&&this.weapon.range?this.weapon.range:1200;let g=this.x+Math.cos(this.angle)*v,m=this.y+Math.sin(this.angle)*v;if(i){const x=i.getLineIntersection({x:this.x,y:this.y},{x:g,y:m});x&&(g=x.x,m=x.y)}e.save(),e.strokeStyle=this.isLocal?"rgba(102, 252, 241, 0.5)":"rgba(255, 60, 60, 0.5)",e.lineWidth=1.2,e.beginPath(),e.moveTo(this.x,this.y),e.lineTo(g,m),e.stroke();const M=this.isLocal?"#66fcf1":"#ff3c3c",_=e.createRadialGradient(g,m,1,g,m,6);_.addColorStop(0,"#ffffff"),_.addColorStop(.3,M),_.addColorStop(1,"rgba(0, 0, 0, 0)"),e.fillStyle=_,e.beginPath(),e.arc(g,m,6,0,Math.PI*2),e.fill(),e.restore()}e.restore();const a=performance.now();this.dashTrails&&this.dashTrails.length>0&&this.dashTrails.forEach(v=>{const g=a-v.time,m=Math.max(0,.35*(1-g/180));if(m<=0)return;if(e.save(),e.globalAlpha=m,!gn.draw(e,this.id+"_trail",v.x,v.y,v.angle,0,!1)){e.save(),e.translate(v.x,v.y),e.rotate(v.angle);const _=ds[this.colorTheme]||ds[this.isLocal?"cyan":"red"];e.fillStyle=_.helmet||"#66fcf1",e.beginPath(),e.arc(0,0,this.radius,0,Math.PI*2),e.fill(),e.restore()}e.restore()});const r=Date.now(),o=this.adrenalineEndTime&&r<this.adrenalineEndTime||this.adrenalineActive,l=this.overdriveEndTime&&r<this.overdriveEndTime||this.overdriveActive;if(o||l){e.save(),e.shadowBlur=15,e.lineWidth=3,e.shadowColor=l?"#ffd700":"#39db14",e.strokeStyle=l?"rgba(255, 215, 0, 0.4)":"rgba(57, 219, 20, 0.4)";const v=this.radius+2+Math.sin(r/150)*2;e.beginPath(),e.arc(this.x,this.y,v,0,Math.PI*2),e.stroke(),e.restore()}const c=this.muzzleFlash>.1;if(!gn.draw(e,this.id,this.x,this.y,this.angle,this.currentSpeed||0,c,this.isLocal?"blue":"red")){e.save(),e.translate(this.x,this.y),e.rotate(this.angle);const v=ds[this.colorTheme]||ds[this.isLocal?"cyan":"red"],g=v.body,m=v.armor,M=v.helmet;let _=18,x=4;this.weaponKey==="rifle"&&(_=24,x=5),this.weaponKey==="shotgun"&&(_=22,x=6),this.weaponKey==="sniper"&&(_=32,x=4,e.fillStyle="#444",e.fillRect(8,-5,6,3)),this.weaponKey==="smg"&&(_=16,x=4),this.weaponKey==="lmg"&&(_=26,x=7,e.fillStyle="#222",e.fillRect(6,-8,6,16)),this.weaponKey==="dmr"&&(_=28,x=5,e.fillRect(10,-4,5,2)),this.weaponKey==="vector"&&(_=14,x=4,e.fillStyle="#333",e.fillRect(4,-6,5,12)),this.weaponKey==="famas"&&(_=20,x=5,e.fillStyle="#555",e.fillRect(6,-3,8,6)),this.weaponKey==="plasma"&&(e.fillStyle="#9b1fe8",_=20,x=5),this.weaponKey==="railgun"&&(e.fillStyle="#0d8a8a",_=30,x=6,e.fillStyle="#066",e.fillRect(6,-7,8,14)),e.fillStyle="#444",e.strokeStyle="#000",e.lineWidth=1,e.fillRect(10,-x/2,_,x),e.strokeRect(10,-x/2,_,x),e.fillStyle=m,e.strokeStyle="#000",e.lineWidth=1.5,e.beginPath(),e.arc(8,-10,5,0,Math.PI*2),e.fill(),e.stroke(),e.beginPath(),e.arc(14,6,5,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle=g,e.beginPath(),e.ellipse(0,0,this.radius,this.radius+3,0,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle=m,e.beginPath(),e.ellipse(-3,0,this.radius-4,this.radius-2,0,0,Math.PI*2),e.fill(),e.fillStyle=M,e.beginPath(),e.arc(-2,0,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#111",e.fillRect(1,-5,3,10),e.restore()}if(this.weaponKey!=="none"){e.save(),e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle=this.weaponKey==="knife"?"#b0b8c0":"#333",e.strokeStyle="rgba(0,0,0,0.7)",e.lineWidth=1;let v=18,g=3;if(this.weaponKey==="rifle"&&(v=26,g=4),this.weaponKey==="shotgun"&&(v=22,g=5),this.weaponKey==="sniper"&&(v=36,g=3),this.weaponKey==="smg"&&(v=16,g=3),this.weaponKey==="lmg"&&(v=28,g=5),this.weaponKey==="dmr"&&(v=30,g=4),this.weaponKey==="knife"&&(v=10,g=2),this.weaponKey==="vector"&&(v=14,g=3,e.fillStyle="#2a2a2a",e.fillRect(4,-5,4,10)),this.weaponKey==="famas"&&(v=20,g=4,e.fillStyle="#444",e.fillRect(5,-4,7,8)),this.weaponKey==="plasma"&&(e.fillStyle="#9b1fe8",v=20,g=5,e.fillStyle="#c455ff",e.fillRect(6,-4,6,8)),this.weaponKey==="railgun"&&(e.fillStyle="#0d8a8a",v=30,g=6,e.fillStyle="#0af",e.fillRect(4,-6,8,12)),e.fillRect(12,-g/2,v,g),e.strokeRect(12,-g/2,v,g),this.muzzleFlash>0){e.save(),e.translate(12+v,0);const m=e.createRadialGradient(0,0,2,0,0,16);m.addColorStop(0,"rgba(255, 255, 255, 1.0)"),m.addColorStop(.3,"rgba(255, 220, 0, 0.9)"),m.addColorStop(.7,"rgba(255, 80, 0, 0.5)"),m.addColorStop(1,"rgba(255, 0, 0, 0.0)"),e.fillStyle=m,e.beginPath(),e.arc(0,0,16,0,Math.PI*2),e.fill(),e.restore()}e.restore()}e.save(),e.textAlign="center";const u=this.isLocal?((f=ds[this.colorTheme])==null?void 0:f.helmet)||"#66fcf1":this.isTeammate?"#39db14":"#ff3c3c";if(this.rank){const v=this.y-this.radius-28,g=`${this.rank.icon} ${this.rank.label}`;e.font="bold 8px Orbitron";const M=e.measureText(g).width+10,_=12;e.fillStyle="rgba(0,0,0,0.65)",e.beginPath(),e.roundRect(this.x-M/2,v-_/2,M,_,3),e.fill(),e.strokeStyle=this.rank.color,e.lineWidth=1,e.stroke(),e.fillStyle=this.rank.color,e.fillText(g,this.x,v+4)}e.fillStyle=u,e.font="10px Orbitron",e.fillText(this.name.toUpperCase(),this.x,this.y-this.radius-12);const d=window.gameEngine&&window.gameEngine.matchMode==="sabotage";if(this.health>0&&!d){e.fillStyle="rgba(0,0,0,0.5)",e.fillRect(this.x-20,this.y-this.radius-8,40,4);const v=this.isLocal?((p=ds[this.colorTheme])==null?void 0:p.helmet)||"#66fcf1":this.isTeammate?"#39db14":"#ff3c3c";e.fillStyle=v,e.fillRect(this.x-20,this.y-this.radius-8,40*(this.health/this.maxHealth),4)}this.floatingText&&this.floatingText.timer>0&&(e.font="bold 9px Orbitron",e.fillStyle=this.floatingText.color||"#ffd700",e.shadowColor="#000000",e.shadowBlur=4,e.fillText(this.floatingText.text,this.x,this.y+this.floatingText.yOffset),this.floatingText.yOffset-=.4,this.floatingText.timer--),e.restore()}updateBuffsHUD(e){if(!this.isLocal||this.isBot)return;const t=document.getElementById("hud-active-buffs");if(!t)return;let i="";if(this.adrenalineActive){const s=Math.max(0,(this.adrenalineEndTime-e)/1e3).toFixed(1);i+=`<div style="font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; background: rgba(57, 219, 20, 0.15); border: 1px solid rgba(57, 219, 20, 0.4); color: #39db14; padding: 4px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 8px rgba(57, 219, 20, 0.2);">⚡ SPEED: ${s}s</div>`}if(this.overdriveActive){const s=Math.max(0,(this.overdriveEndTime-e)/1e3).toFixed(1);i+=`<div style="font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; background: rgba(255, 215, 0, 0.15); border: 1px solid rgba(255, 215, 0, 0.4); color: #ffd700; padding: 4px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);">🔥 OVERDRIVE: ${s}s</div>`}t.innerHTML=i}}class Ra{constructor(e){this.id=`${e.playerId}_bullet_${Date.now()}_${Math.floor(Math.random()*1e3)}`,this.playerId=e.playerId,this.x=e.x,this.y=e.y,this.prevX=e.x,this.prevY=e.y,this.angle=e.angle,this.speed=e.bulletSpeed,this.damage=e.damage,this.rangeRemaining=e.range,this.weaponKey=e.weaponKey;const s=(1-(window.gameEngine&&window.gameEngine.devCheatActive&&e.playerId===window.LocalPlayerId?1:e.accuracy))*(Math.random()-.5)*.5,a=this.angle+s;this.vx=Math.cos(a)*this.speed,this.vy=Math.sin(a)*this.speed,this.active=!0}update(e,t,i,s,a=1){if(!this.active)return;if(this.prevX=this.x,this.prevY=this.y,this.x+=this.vx*a,this.y+=this.vy*a,this.rangeRemaining-=this.speed*a,this.rangeRemaining<=0){this.active=!1;return}const r={x:this.prevX,y:this.prevY},o={x:this.x,y:this.y},l=e.getLineIntersection(r,o);if(l){if(this.x=l.x,this.y=l.y,this.active=!1,l.wall&&l.wall.type==="crate"){const c=l.wall.id,h=e.damageCrate(c,this.damage);h&&(h.broken?(s&&s.playCrateBreak(),i.spawnCrateSplinters(h.crateX,h.crateY),this.playerId===window.LocalPlayerId&&window.AppSocket&&window.AppSocket.emit("break-crate",{crateId:c,spawnedItem:h.item})):s&&s.playFleshHit())}i.spawnWallImpact(this.x,this.y,this.angle);return}for(const c of t){if(c.id===this.playerId||c.health<=0)continue;const h=t.find(d=>d.id===this.playerId);if(h&&h.team===c.team)continue;const u=this.getSegmentCircleIntersection(r,o,c);if(u){this.x=u.x,this.y=u.y,this.active=!1,i.spawnBloodSplatter(this.x,this.y,this.angle);const d=this.x-c.x,f=this.y-c.y,v=d*d+f*f<=36,g=v?1.5:1;if(window.IsOfflineMode){const m=e.checkZone?e.checkZone(this.x,this.y):null,M=m&&m.type==="damage"?m.multiplier:1,_=Math.round(this.damage*M*g),x=c.health>0;c.takeDamage(_,s);const y=x&&c.health<=0;if(this.playerId===window.LocalPlayerId){const E=t.find(A=>A.id===this.playerId);E&&E.addWeaponXP&&(y?(E.addWeaponXP(50),E.showTextNotification("+50 XP","#ffd700"),window.gameEngine&&window.gameEngine.registerLocalPlayerKill&&window.gameEngine.registerLocalPlayerKill(performance.now())):(E.addWeaponXP(10),E.showTextNotification("+10 XP","#ff6ef7"))),s&&(v?s.playCriticalHitMarker():s.playHitMarker()),v&&c.showTextNotification?c.showTextNotification("CRITICAL HEADSHOT!"):M>1&&c.showTextNotification&&c.showTextNotification(`×${M} ZONE!`),window.gameEngine&&window.gameEngine.triggerHitmarker(this.x,this.y,_,v),window.MatchStats&&(window.MatchStats.damageDealt+=_)}}else if(this.playerId===window.LocalPlayerId){const m=e.checkZone?e.checkZone(this.x,this.y):null,M=m&&m.type==="damage"?m.multiplier:1,_=Math.round(this.damage*M*g),x=c.health-_<=0,y=t.find(E=>E.id===this.playerId);y&&y.addWeaponXP&&(x?(y.addWeaponXP(50),y.showTextNotification("+50 XP","#ffd700"),window.gameEngine&&window.gameEngine.registerLocalPlayerKill&&window.gameEngine.registerLocalPlayerKill(performance.now())):(y.addWeaponXP(10),y.showTextNotification("+10 XP","#ff6ef7"))),s&&(v?s.playCriticalHitMarker():s.playHitMarker()),v&&c.showTextNotification?c.showTextNotification("CRITICAL HEADSHOT!"):M>1&&c.showTextNotification&&c.showTextNotification(`×${M} ZONE!`),window.gameEngine&&window.gameEngine.triggerHitmarker(this.x,this.y,_,v),window.MatchStats&&(window.MatchStats.damageDealt+=_),window.AppSocket&&window.AppSocket.emit("hit",{damage:_,shooterId:this.playerId,targetId:c.id,x:this.x,y:this.y,isHeadshot:v})}return}}}getSegmentCircleIntersection(e,t,i){const s=t.x-e.x,a=t.y-e.y,r=i.x-e.x,o=i.y-e.y,l=s*s+a*a;if(l===0)return null;let c=(r*s+o*a)/l;c=Math.max(0,Math.min(1,c));const h=e.x+c*s,u=e.y+c*a,d=i.x-h,f=i.y-u;return d*d+f*f<=i.radius*i.radius?{x:h,y:u}:null}draw(e){if(!this.active)return;const t=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode;if(this.weaponKey==="knife"){e.save(),e.lineWidth=3.5,e.lineCap="round",e.strokeStyle="rgba(230, 235, 255, 0.85)",t||(e.shadowColor="#66fcf1",e.shadowBlur=6),e.beginPath(),e.arc(this.x,this.y,18,this.angle-.6,this.angle+.6),e.stroke(),e.restore();return}if(this.weaponKey==="plasma"){e.save(),t||(e.shadowColor="#ff6ef7",e.shadowBlur=18);const a=e.createRadialGradient(this.x,this.y,1,this.x,this.y,7);a.addColorStop(0,"rgba(255, 200, 255, 1.0)"),a.addColorStop(.4,"rgba(230, 80, 255, 0.9)"),a.addColorStop(1,"rgba(120, 0, 180, 0.0)"),e.fillStyle=a,e.beginPath(),e.arc(this.x,this.y,7,0,Math.PI*2),e.fill(),e.restore();return}if(this.weaponKey==="railgun"){e.save(),t||(e.shadowColor="#66fcf1",e.shadowBlur=20),e.lineWidth=5,e.lineCap="round";const a=e.createLinearGradient(this.prevX,this.prevY,this.x,this.y);a.addColorStop(0,"rgba(102, 252, 241, 0.0)"),a.addColorStop(.3,"rgba(102, 252, 241, 0.7)"),a.addColorStop(1,"rgba(255, 255, 255, 1.0)"),e.strokeStyle=a,e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.lineWidth=2,e.strokeStyle="rgba(255,255,255,0.9)",e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.restore();return}e.save(),e.lineWidth=2.5,e.lineCap="round";const i=this.playerId===window.LocalPlayerId,s=e.createLinearGradient(this.prevX,this.prevY,this.x,this.y);i?(s.addColorStop(0,"rgba(102, 252, 241, 0.0)"),s.addColorStop(1,"rgba(102, 252, 241, 1.0)"),e.strokeStyle=s,t||(e.shadowColor="#66fcf1")):(s.addColorStop(0,"rgba(255, 60, 60, 0.0)"),s.addColorStop(1,"rgba(255, 60, 60, 1.0)"),e.strokeStyle=s,t||(e.shadowColor="#ff3c3c")),t||(e.shadowBlur=4),e.beginPath(),e.moveTo(this.prevX,this.prevY),e.lineTo(this.x,this.y),e.stroke(),e.restore()}}class no{constructor(e){this.seed=e}next(){const e=Math.sin(this.seed++)*1e4;return e-Math.floor(e)}range(e,t){return e+this.next()*(t-e)}}function gh(n,e){let t=2166136261;const i=`${String(n)}:${e}`;for(let s=0;s<i.length;s++)t^=i.charCodeAt(s),t=Math.imul(t,16777619);return t>>>0||1}let dx=class{constructor(e,t,i,s="manor"){this.width=e,this.height=t,this.seed=i,this.roundIndex=-1,this.navigationRevision=0,this.gameplayRng=new no(gh(i,"gameplay")),this.rng=this.gameplayRng,this.mapId=s,this.walls=[],this.items=[],this.zones=[],this.rooms=[],this.decorations=[],this.segments=[],this.ambientLights={},this.generateMap()}generateMap(e=null){const t=Number.isInteger(e)&&e>=0?e:this.roundIndex+1;this.roundIndex=t;const i=t===0?this.seed:gh(this.seed,`layout:${t}`);this.rng=new no(i);try{this.walls=[],this.items=[],this.zones=[],this.rooms=[],this.decorations=[],this.mapId==="cyberlab"?this.generateCyberLabMap():this.mapId==="arena"?this.generateArenaMap():this.generateManorMap(),this.initTerminals(),this.rebuildSegments()}finally{this.rng=this.gameplayRng}}generateManorMap(){const r=this.width-40,o=this.height-40,l=480,c=960,h=460,u=920,d=l-40,f=c-l-22,p=r-c-22,v=h-40,g=u-h-22,m=o-u-22,M=[{x:40,y:40,w:d,h:v,name:"Kitchen",floor:"tiles"},{x:l+22,y:40,w:f,h:v,name:"Living Room",floor:"carpet"},{x:c+22,y:40,w:p,h:v,name:"Office",floor:"wood"},{x:40,y:h+22,w:d,h:g,name:"Bathroom",floor:"tiles"},{x:l+22,y:h+22,w:f,h:g,name:"Hallway",floor:"concrete"},{x:c+22,y:h+22,w:p,h:g,name:"Bedroom 1",floor:"carpet"},{x:40,y:u+22,w:d,h:m,name:"Garage",floor:"concrete"},{x:l+22,y:u+22,w:f,h:m,name:"Master Bedroom",floor:"carpet"},{x:c+22,y:u+22,w:p,h:m,name:"Bedroom 2",floor:"wood"}];this.rooms=M,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(l,40,22,v,"v",Math.round(v*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l,h+22,22,g,"v",Math.round(g*.35-88/2),88,"wall","interior"),this._addWallWithDoorway(l,u+22,22,m,"v",Math.round(m*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,40,22,v,"v",Math.round(v*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,h+22,22,g,"v",Math.round(g*.65-88/2),88,"wall","interior"),this._addWallWithDoorway(c,u+22,22,m,"v",Math.round(m*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,h,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,h,f,22,"h",Math.round(f*.35-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,h,p,22,"h",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,u,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,u,f,22,"h",Math.round(f*.65-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,u,p,22,"h",Math.round(p*.5-88/2),88,"wall","interior"),this._addFurniture(M),this._addDecorations(M);{const x=M[3];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.06,label:"MEDIC STATION"})}{const x=M[5];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.025,label:"REST ZONE"})}{const x=M[7];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.04,label:"RECOVERY ZONE"})}{const x=M[6];this.zones.push({x:x.x+60,y:x.y+60,w:x.w-120,h:x.h-120,type:"damage",multiplier:1.75,label:"EXPLOSIVE ZONE"})}{const x=M[1];this.zones.push({x:x.x+x.w/4,y:x.y+x.h/4,w:x.w/2,h:x.h/2,type:"damage",multiplier:1.4,label:"EXPOSED AREA"})}const _=["health","ammo","adrenaline","ammo","overdrive"];this._spawnRandomConsumables(_,"pickup"),this._spawnCrates(),this.ambientLights={brokenCeiling:{x:731,y:701,radius:240,on:!0,innerRadius:20,color:"rgba(200, 230, 255, 0.25)",colorMid:"rgba(200, 230, 255, 0.08)",pulseType:"none",fixtureType:"brokenCeiling"},lantern:{x:1171,y:250,radius:180,on:!0,innerRadius:5,color:"rgba(255, 140, 40, 0.22)",colorMid:"rgba(255, 140, 40, 0.10)",pulseType:"lantern",fixtureType:"lantern"},kitchen:{x:260,y:250,radius:200,on:!0,innerRadius:10,color:"rgba(102, 252, 241, 0.20)",colorMid:"rgba(102, 252, 241, 0.08)",pulseType:"none",fixtureType:"kitchen"},garage:{x:260,y:1150,radius:220,on:!0,innerRadius:10,color:"rgba(255, 60, 60, 0.22)",colorMid:"rgba(255, 60, 60, 0.09)",pulseType:"garage",fixtureType:"garage"},bedroom2:{x:1171,y:1150,radius:190,on:!0,innerRadius:10,color:"rgba(255, 110, 247, 0.20)",colorMid:"rgba(255, 110, 247, 0.08)",pulseType:"none",fixtureType:"bedroom2"}}}generateCyberLabMap(){const r=this.width-40,o=this.height-40,l=450,c=950,h=450,u=950,d=l-40,f=c-l-22,p=r-c-22,v=h-40,g=u-h-22,m=o-u-22,M=[{x:40,y:40,w:d,h:v,name:"Cyber Lounge",floor:"cybercarpet"},{x:l+22,y:40,w:f,h:v,name:"Quantum Lab",floor:"cybergrid"},{x:c+22,y:40,w:p,h:v,name:"Security Hub",floor:"nanogrid"},{x:40,y:h+22,w:d,h:g,name:"Server Room",floor:"cybergrid"},{x:l+22,y:h+22,w:f,h:g,name:"AI Core",floor:"cybergrid"},{x:c+22,y:h+22,w:p,h:g,name:"Cryo Chambers",floor:"nanogrid"},{x:40,y:u+22,w:d,h:m,name:"Weaponry Depot",floor:"concrete"},{x:l+22,y:u+22,w:f,h:m,name:"Reactor Matrix",floor:"reactor"},{x:c+22,y:u+22,w:p,h:m,name:"Matrix Hall",floor:"cybercarpet"}];this.rooms=M,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(l,40,22,v,"v",Math.round(v*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l,h+22,22,g,"v",Math.round(g*.45-88/2),88,"wall","interior"),this._addWallWithDoorway(l,u+22,22,m,"v",Math.round(m*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,40,22,v,"v",Math.round(v*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(c,h+22,22,g,"v",Math.round(g*.55-88/2),88,"wall","interior"),this._addWallWithDoorway(c,u+22,22,m,"v",Math.round(m*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,h,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,h,f,22,"h",Math.round(f*.45-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,h,p,22,"h",Math.round(p*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(40,u,d,22,"h",Math.round(d*.5-88/2),88,"wall","interior"),this._addWallWithDoorway(l+22,u,f,22,"h",Math.round(f*.55-88/2),88,"wall","interior"),this._addWallWithDoorway(c+22,u,p,22,"h",Math.round(p*.5-88/2),88,"wall","interior"),this._addCyberLabFurniture(M);{const x=M[1];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.05,label:"QUANTUM STABILIZER"})}{const x=M[5];this.zones.push({x:x.x+30,y:x.y+30,w:x.w-60,h:x.h-60,type:"healing",healRate:.035,label:"CRYO RECOVERY"})}{const x=M[7];this.zones.push({x:x.x+50,y:x.y+50,w:x.w-100,h:x.h-100,type:"damage",multiplier:2,label:"REACTOR ENERGY CORE"})}const _=["health","ammo","health","adrenaline","health","ammo","overdrive"];this._spawnRandomConsumables(_,"pickup_cyber"),this._spawnCrates(),this.ambientLights={aiCore:{x:700,y:700,radius:260,on:!0,innerRadius:20,color:"rgba(102, 252, 241, 0.28)",colorMid:"rgba(102, 252, 241, 0.12)",pulseType:"quantum",fixtureType:"reactor_light"},quantumLab:{x:700,y:250,radius:220,on:!0,innerRadius:10,color:"rgba(157, 59, 255, 0.26)",colorMid:"rgba(157, 59, 255, 0.10)",pulseType:"none",fixtureType:"quantum"},reactor:{x:700,y:1150,radius:240,on:!0,innerRadius:15,color:"rgba(255, 127, 59, 0.28)",colorMid:"rgba(255, 127, 59, 0.12)",pulseType:"garage",fixtureType:"reactor_light"},serverRoom:{x:250,y:700,radius:220,on:!0,innerRadius:10,color:"rgba(57, 219, 20, 0.24)",colorMid:"rgba(57, 219, 20, 0.09)",pulseType:"none",fixtureType:"server_rack_light"},cryo:{x:1150,y:700,radius:220,on:!0,innerRadius:10,color:"rgba(102, 252, 241, 0.24)",colorMid:"rgba(102, 252, 241, 0.09)",pulseType:"none",fixtureType:"cryo_light"}}}generateArenaMap(){const r=this.width-40,o=this.height-40,l=240,c=300,h=240,u=240,d=300,f=240,p=40+l,v=p+20+c,g=40+u,m=g+20+d,M=[{x:40,y:40,w:l,h:u,name:"Alpha Spawn",floor:"concrete"},{x:p+20,y:40,w:c,h:u,name:"North Gallery",floor:"wood"},{x:v+20,y:40,w:h,h:u,name:"Omega Spawn",floor:"concrete"},{x:40,y:g+20,w:l,h:d,name:"West Corridor",floor:"tiles"},{x:p+20,y:g+20,w:c,h:d,name:"Central Core",floor:"tiles"},{x:v+20,y:g+20,w:h,h:d,name:"East Corridor",floor:"tiles"},{x:40,y:m+20,w:l,h:f,name:"Supply Vault",floor:"carpet"},{x:p+20,y:m+20,w:c,h:f,name:"South Gallery",floor:"wood"},{x:v+20,y:m+20,w:h,h:f,name:"Server Annex",floor:"carpet"}];this.rooms=M,this._push({x:0,y:0,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:o,w:this.width,h:40,type:"wall",material:"exterior"}),this._push({x:0,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._push({x:r,y:40,w:40,h:this.height-40*2,type:"wall",material:"exterior"}),this._addWallWithDoorway(p,40,20,u,"v",Math.round(u*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(p,g+20,20,d,"v",Math.round(d*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(p,m+20,20,f,"v",Math.round(f*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v,40,20,u,"v",Math.round(u*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v,g+20,20,d,"v",Math.round(d*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v,m+20,20,f,"v",Math.round(f*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(40,g,l,20,"h",Math.round(l*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(p+20,g,c,20,"h",Math.round(c*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v+20,g,h,20,"h",Math.round(h*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(40,m,l,20,"h",Math.round(l*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(p+20,m,c,20,"h",Math.round(c*.5-80/2),80,"wall","interior"),this._addWallWithDoorway(v+20,m,h,20,"h",Math.round(h*.5-80/2),80,"wall","interior");const _=M[4],x=E=>this._push({...E,type:"wall",material:"furniture"});x({x:_.x+40,y:_.y+40,w:40,h:40,label:"column"}),x({x:_.x+_.w-80,y:_.y+40,w:40,h:40,label:"column"}),x({x:_.x+40,y:_.y+_.h-80,w:40,h:40,label:"column"}),x({x:_.x+_.w-80,y:_.y+_.h-80,w:40,h:40,label:"column"}),this.zones.push({x:_.x+90,y:_.y+90,w:_.w-180,h:_.h-180,type:"healing",healRate:.05,label:"NANO MEDIC STATION"});const y=["health","ammo","adrenaline","overdrive"];this._spawnRandomConsumables(y,"pickup_arena"),this._spawnCrates(),this.ambientLights={centerSiren:{x:450,y:450,radius:180,on:!0,innerRadius:15,color:"rgba(102, 252, 241, 0.25)",colorMid:"rgba(102, 252, 241, 0.09)",pulseType:"quantum",fixtureType:"reactor_light"},alphaLight:{x:150,y:150,radius:150,on:!0,innerRadius:10,color:"rgba(255, 110, 247, 0.20)",colorMid:"rgba(255, 110, 247, 0.08)",pulseType:"none",fixtureType:"quantum"},omegaLight:{x:750,y:750,radius:150,on:!0,innerRadius:10,color:"rgba(255, 127, 59, 0.20)",colorMid:"rgba(255, 127, 59, 0.08)",pulseType:"none",fixtureType:"quantum"}}}_addCyberLabFurniture(e){const t=d=>this._push({...d,type:"wall",material:"furniture"}),i=e[0];t({x:i.x+50,y:i.y+50,w:90,h:32,label:"cyber_couch"}),t({x:i.x+50,y:i.y+120,w:90,h:32,label:"cyber_couch"}),t({x:i.x+i.w-82,y:i.y+50,w:32,h:100,label:"cyber_couch"}),t({x:i.x+i.w-150,y:i.y+80,w:45,h:45,label:"table"}),t({x:i.x+20,y:i.y+i.h-60,w:24,h:24,label:"plant"}),t({x:i.x+i.w-50,y:i.y+i.h-60,w:24,h:24,label:"plant"});const s=e[1];t({x:s.x+30,y:s.y+30,w:35,h:35,label:"containment_pod"}),t({x:s.x+s.w-65,y:s.y+30,w:35,h:35,label:"containment_pod"}),t({x:s.x+s.w/2-40,y:s.y+s.h-40,w:80,h:28,label:"cyber_console"}),t({x:s.x+30,y:s.y+s.h-100,w:35,h:35,label:"nano_charger"});const a=e[2];t({x:a.x+20,y:a.y+20,w:25,h:180,label:"shelf"}),t({x:a.x+70,y:a.y+60,w:100,h:40,label:"desk"}),t({x:a.x+105,y:a.y+110,w:30,h:30,label:"chair"});const r=e[3];t({x:r.x+40,y:r.y+30,w:24,h:100,label:"server_rack"}),t({x:r.x+110,y:r.y+30,w:24,h:100,label:"server_rack"}),t({x:r.x+40,y:r.y+190,w:24,h:100,label:"server_rack"}),t({x:r.x+110,y:r.y+190,w:24,h:100,label:"server_rack"}),t({x:r.x+r.w-50,y:r.y+r.h/2-30,w:32,h:60,label:"cyber_console"});const o=e[4];t({x:o.x+o.w/2-40,y:o.y+o.h/2-40,w:80,h:80,label:"reactor_core"}),t({x:o.x+40,y:o.y+o.h/2-15,w:45,h:30,label:"cyber_console"}),t({x:o.x+o.w-85,y:o.y+o.h/2-15,w:45,h:30,label:"cyber_console"}),t({x:o.x+o.w/2-22,y:o.y+40,w:44,h:28,label:"cyber_console"}),t({x:o.x+o.w/2-22,y:o.y+o.h-68,w:44,h:28,label:"cyber_console"});const l=e[5];t({x:l.x+30,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+85,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+140,y:l.y+30,w:35,h:55,label:"containment_pod"}),t({x:l.x+l.w-50,y:l.y+l.h-100,w:32,h:65,label:"cyber_console"});const c=e[6];t({x:c.x+30,y:c.y+30,w:120,h:45,label:"desk"}),t({x:c.x+30,y:c.y+110,w:35,h:80,label:"cabinet"}),t({x:c.x+c.w-60,y:c.y+30,w:40,h:100,label:"shelf"});const h=e[7];t({x:h.x+h.w/2-30,y:h.y+h.h/2-30,w:60,h:60,label:"reactor_core"}),t({x:h.x+30,y:h.y+30,w:24,h:24,label:"plant"}),t({x:h.x+h.w-54,y:h.y+30,w:24,h:24,label:"plant"});const u=e[8];t({x:u.x+u.w/2-25,y:u.y+40,w:50,h:50,label:"table"}),t({x:u.x+50,y:u.y+u.h-70,w:80,h:32,label:"cyber_couch"}),t({x:u.x+u.w-130,y:u.y+u.h-70,w:80,h:32,label:"cyber_couch"})}_push(e){this.walls.push(e)}_addWallWithDoorway(e,t,i,s,a,r,o,l,c){if(a==="v"){const h=s,u=Math.max(12,Math.min(h-o-12,r)),d=u+o;u>0&&this._push({x:e,y:t,w:i,h:u,type:l,material:c}),d<h&&this._push({x:e,y:t+d,w:i,h:h-d,type:l,material:c})}else{const h=i,u=Math.max(12,Math.min(h-o-12,r)),d=u+o;u>0&&this._push({x:e,y:t,w:u,h:s,type:l,material:c}),d<h&&this._push({x:e+d,y:t,w:h-d,h:s,type:l,material:c})}}_addFurniture(e){const t=f=>this._push({...f,type:"wall",material:"furniture"}),i=f=>this._push({...f,type:"crate",health:40,maxHealth:40,material:"barrel"}),s=e[0];t({x:s.x+12,y:s.y+12,w:s.w-24,h:28,label:"counter"}),t({x:s.x+12,y:s.y+40,w:28,h:s.h/2-10,label:"counter"}),t({x:s.x+80,y:s.y+s.h-110,w:110,h:60,label:"table"}),t({x:s.x+80+42,y:s.y+s.h-138,w:26,h:26,label:"chair"}),t({x:s.x+80+42,y:s.y+s.h-48,w:26,h:26,label:"chair"}),t({x:s.x+18,y:s.y+s.h-50,w:24,h:24,label:"plant"}),t({x:s.x+s.w-60,y:s.y+12,w:40,h:80,label:"fridge"});const a=e[1];t({x:a.x+55,y:a.y+55,w:190,h:42,label:"sofa"}),t({x:a.x+55,y:a.y+97,w:42,h:90,label:"sofa"}),t({x:a.x+18,y:a.y+110,w:38,h:42,label:"sofa"}),t({x:a.x+a.w/2-55,y:a.y+130,w:110,h:55,label:"table"}),t({x:a.x+a.w-55,y:a.y+65,w:30,h:120,label:"tv"}),t({x:a.x+a.w-55,y:a.y+a.h-100,w:30,h:80,label:"shelf"}),t({x:a.x+a.w-50,y:a.y+18,w:24,h:24,label:"plant"});const r=e[2];t({x:r.x+18,y:r.y+18,w:140,h:52,label:"desk"}),t({x:r.x+18+55,y:r.y+18+56,w:30,h:30,label:"chair"}),t({x:r.x+r.w-38,y:r.y+12,w:22,h:210,label:"shelf"}),t({x:r.x+18,y:r.y+r.h-60,w:80,h:40,label:"cabinet"}),t({x:r.x+r.w-50,y:r.y+r.h-50,w:24,h:24,label:"plant"});const o=e[3];t({x:o.x+12,y:o.y+12,w:90,h:130,label:"tub"}),t({x:o.x+12,y:o.y+o.h-58,w:65,h:38,label:"sink"}),t({x:o.x+o.w-50,y:o.y+12,w:35,h:55,label:"cabinet"}),t({x:o.x+o.w-45,y:o.y+o.h-60,w:28,h:38,label:"toilet"});const l=e[4];t({x:l.x+l.w/2-80,y:l.y+l.h/2-45,w:160,h:90,label:"table"}),t({x:l.x+l.w/2-60,y:l.y+l.h/2-80,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2+30,y:l.y+l.h/2-80,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2-60,y:l.y+l.h/2+90,w:26,h:26,label:"chair"}),t({x:l.x+l.w/2+30,y:l.y+l.h/2+90,w:26,h:26,label:"chair"});const c=e[5];t({x:c.x+12,y:c.y+20,w:115,h:80,label:"bed"}),t({x:c.x+12+120,y:c.y+20,w:32,h:32,label:"dresser"}),t({x:c.x+c.w-52,y:c.y+12,w:36,h:55,label:"dresser"}),t({x:c.x+c.w-52,y:c.y+80,w:36,h:55,label:"cabinet"}),t({x:c.x+12,y:c.y+c.h-90,w:80,h:40,label:"desk"}),t({x:c.x+12+27,y:c.y+c.h-46,w:26,h:26,label:"chair"});const h=e[6];t({x:h.x+40,y:h.y+75,w:210,h:130,label:"car"}),t({x:h.x+12,y:h.y+h.h-48,w:160,h:30,label:"bench"}),i({x:h.x+h.w-65,y:h.y+45,w:38,h:38,id:"barrel_0"}),i({x:h.x+h.w-65,y:h.y+93,w:38,h:38,id:"barrel_1"}),i({x:h.x+h.w-65,y:h.y+141,w:38,h:38,id:"barrel_2"});const u=e[7];t({x:u.x+u.w/2-90,y:u.y+18,w:180,h:110,label:"bed"}),t({x:u.x+u.w/2-130,y:u.y+18,w:32,h:32,label:"dresser"}),t({x:u.x+u.w/2+100,y:u.y+18,w:32,h:32,label:"dresser"}),t({x:u.x+12,y:u.y+12,w:45,h:65,label:"dresser"}),t({x:u.x+u.w-60,y:u.y+12,w:45,h:65,label:"dresser"}),t({x:u.x+18,y:u.y+u.h-50,w:24,h:24,label:"plant"});const d=e[8];t({x:d.x+12,y:d.y+20,w:130,h:90,label:"bed"}),t({x:d.x+12+135,y:d.y+20,w:32,h:32,label:"dresser"}),t({x:d.x+d.w-55,y:d.y+12,w:38,h:110,label:"shelf"}),t({x:d.x+d.w-110,y:d.y+d.h-60,w:90,h:40,label:"desk"}),t({x:d.x+d.w-78,y:d.y+d.h-95,w:26,h:26,label:"chair"}),t({x:d.x+12,y:d.y+d.h-55,w:80,h:38,label:"cabinet"})}_spawnCrates(){let i=0,s=0;for(;i<14&&s<400;){s++;const a=this.rng.range(60,this.width-100),r=this.rng.range(60,this.height-100);if(a<250&&r<250||a>this.width-250&&r>this.height-250||a<250&&r>this.height-250||a>this.width-250&&r<250)continue;let o=!1;const l=14;for(const c of this.walls)if(a+44+l>c.x&&a-l<c.x+c.w&&r+44+l>c.y&&r-l<c.y+c.h){o=!0;break}o||(this._push({x:a,y:r,w:44,h:44,type:"crate",health:50,maxHealth:50,id:`crate_${i}`,material:"crate"}),i++)}}_spawnRandomConsumables(e,t){e.forEach((s,a)=>{let r=!1,o=0;for(;!r&&o<150;){o++;const l=Math.floor(this.rng.next()*this.rooms.length),c=this.rooms[l],h=40,u=this.rng.range(c.x+h,c.x+c.w-h),d=this.rng.range(c.y+h,c.y+c.h-h);let f=!1;for(const p of this.walls)if(u+30>p.x&&u-30<p.x+p.w&&d+30>p.y&&d-30<p.y+p.h){f=!0;break}u<250&&d<250&&(f=!0),u>this.width-250&&d>this.height-250&&(f=!0),u<250&&d>this.height-250&&(f=!0),u>this.width-250&&d<250&&(f=!0),f||(this.items.push({id:`${t}_${a}`,x:u,y:d,type:s,active:!0}),r=!0)}if(!r){const l=Math.floor(this.rng.next()*this.rooms.length),c=this.rooms[l];this.items.push({id:`${t}_${a}`,x:c.x+c.w/2,y:c.y+c.h/2,type:s,active:!0})}})}checkZone(e,t){for(const i of this.zones)if(e>=i.x&&e<=i.x+i.w&&t>=i.y&&t<=i.y+i.h)return i;return null}rebuildSegments(){this.segments=[],this.walls.forEach(e=>{this.segments.push({p1:{x:e.x,y:e.y},p2:{x:e.x+e.w,y:e.y},wall:e}),this.segments.push({p1:{x:e.x+e.w,y:e.y},p2:{x:e.x+e.w,y:e.y+e.h},wall:e}),this.segments.push({p1:{x:e.x+e.w,y:e.y+e.h},p2:{x:e.x,y:e.y+e.h},wall:e}),this.segments.push({p1:{x:e.x,y:e.y+e.h},p2:{x:e.x,y:e.y},wall:e})}),this.navigationRevision=(Number(this.navigationRevision)||0)+1}checkCircleCollision(e,t,i){const s=this._depenetrateCircle(e,t,i);return{x:s.x,y:s.y}}moveCircle(e,t,i,s,a){const r=Math.max(.01,Number(a)||.01),o=this._depenetrateCircle(e,t,r);let l=o.x,c=o.y,h=o.collided,u=o.normalX,d=o.normalY;const f=Number.isFinite(Number(i))?Number(i):0,p=Number.isFinite(Number(s))?Number(s):0,v=Math.hypot(f,p),g=Math.max(2,Math.min(8,r*.45)),m=Math.max(1,Math.ceil(v/g)),M=f/m,_=p/m;for(let y=0;y<m;y++){if(M!==0){const E=l+M,A=this._depenetrateCircle(E,c,r);(Math.abs(A.x-E)>1e-6||Math.abs(A.y-c)>1e-6)&&(h=!0,u+=A.normalX,d+=A.normalY),l=A.x,c=A.y}if(_!==0){const E=c+_,A=this._depenetrateCircle(l,E,r);(Math.abs(A.x-l)>1e-6||Math.abs(A.y-E)>1e-6)&&(h=!0,u+=A.normalX,d+=A.normalY),l=A.x,c=A.y}}const x=Math.hypot(u,d);return{x:l,y:c,collided:h,normalX:x>1e-6?u/x:0,normalY:x>1e-6?d/x:0}}_depenetrateCircle(e,t,i){const s=Math.max(.01,Number(i)||.01);let a=Number.isFinite(Number(e))?Number(e):s,r=Number.isFinite(Number(t))?Number(t):s,o=!1,l=0,c=0;a=Math.max(s,Math.min(this.width-s,a)),r=Math.max(s,Math.min(this.height-s,r));const h=a,u=r;for(let d=0;d<16;d++){let f=!1;for(const p of this.walls){const v=Math.max(p.x,Math.min(a,p.x+p.w)),g=Math.max(p.y,Math.min(r,p.y+p.h)),m=a-v,M=r-g,_=m*m+M*M;if(!(_>=s*s-1e-9)){if(o=!0,f=!0,_>1e-12){const x=Math.sqrt(_),y=s-x+1e-6,E=m/x,A=M/x;a+=E*y,r+=A*y,l+=E,c+=A}else{const x=[{amount:p.x-s-a,nx:-1,ny:0,targetX:p.x-s,targetY:r},{amount:p.x+p.w+s-a,nx:1,ny:0,targetX:p.x+p.w+s,targetY:r},{amount:p.y-s-r,nx:0,ny:-1,targetX:a,targetY:p.y-s},{amount:p.y+p.h+s-r,nx:0,ny:1,targetX:a,targetY:p.y+p.h+s}],y=x.filter(S=>S.targetX>=s-1e-6&&S.targetX<=this.width-s+1e-6&&S.targetY>=s-1e-6&&S.targetY<=this.height-s+1e-6),E=y.length>0?y:x;E.sort((S,w)=>Math.abs(S.amount)-Math.abs(w.amount));const A=E[0];A.nx!==0?a=A.targetX+A.nx*1e-6:r=A.targetY+A.ny*1e-6,l+=A.nx,c+=A.ny}a=Math.max(s,Math.min(this.width-s,a)),r=Math.max(s,Math.min(this.height-s,r))}}if(!f)break}if(!this._circlePositionClear(a,r,s)){const d=this._nearestClearCirclePosition(h,u,s);if(d){const f=d.x-h,p=d.y-u,v=Math.hypot(f,p);a=d.x,r=d.y,o=!0,v>1e-6&&(l+=f/v,c+=p/v)}}return{x:a,y:r,collided:o,normalX:l,normalY:c}}_circlePositionClear(e,t,i){if(e<i||t<i||e>this.width-i||t>this.height-i)return!1;for(const s of this.walls){const a=Math.max(s.x,Math.min(e,s.x+s.w)),r=Math.max(s.y,Math.min(t,s.y+s.h)),o=e-a,l=t-r;if(o*o+l*l<i*i-1e-9)return!1}return!0}_nearestClearCirclePosition(e,t,i){if(this._circlePositionClear(e,t,i))return{x:e,y:t};const s=Math.max(4,Math.min(8,i*.35)),a=Math.max(192,i*12);for(let r=s;r<=a;r+=s){const o=Math.max(16,Math.ceil(Math.PI*2*r/s));for(let l=0;l<o;l++){const c=l/o*Math.PI*2,h=Math.max(i,Math.min(this.width-i,e+Math.cos(c)*r)),u=Math.max(i,Math.min(this.height-i,t+Math.sin(c)*r));if(this._circlePositionClear(h,u,i))return{x:h,y:u}}}return null}getLineIntersection(e,t){let i=null;for(const s of this.segments){const a=this.getLineSegmentIntersection(e,t,s.p1,s.p2);if(a){const r=a.x-e.x,o=a.y-e.y,l=Math.sqrt(r*r+o*o);(!i||l<i.dist)&&(i={x:a.x,y:a.y,dist:l,wall:s.wall})}}return i}getLineSegmentIntersection(e,t,i,s){const a=t.x-e.x,r=t.y-e.y,o=s.x-i.x,l=s.y-i.y,c=-o*r+a*l;if(Math.abs(c)<1e-9)return null;const h=(-r*(e.x-i.x)+a*(e.y-i.y))/c,u=(o*(e.y-i.y)-l*(e.x-i.x))/c;return h>=0&&h<=1&&u>=0&&u<=1?{x:e.x+u*a,y:e.y+u*r}:null}damageCrate(e,t){const i=this.walls.findIndex(a=>a.id===e);if(i===-1)return null;const s=this.walls[i];if(s.health-=t,s.health<=0){this.walls.splice(i,1),this.rebuildSegments();let a=null;if(this.rng.next()<.5){const r=this.rng.next();let o="health";r<.4?o="health":r<.7?o="ammo":r<.85?o="adrenaline":o="overdrive",a={id:`item_${e}_${Date.now()}`,x:s.x+s.w/2,y:s.y+s.h/2,type:o,active:!0},this.items.push(a)}return{broken:!0,item:a,crateX:s.x+s.w/2,crateY:s.y+s.h/2}}return{broken:!1,health:s.health}}syncBreakCrate(e,t){const i=this.walls.findIndex(s=>s.id===e);i!==-1&&(this.walls.splice(i,1),this.rebuildSegments()),t&&!this.items.some(s=>s.id===t.id)&&this.items.push(t)}computeVisibilityPolygon(e,t,i,s=null,a=null){const r=new Set,o=u=>{let d=u;for(;d<-Math.PI;)d+=Math.PI*2;for(;d>Math.PI;)d-=Math.PI*2;return d},l=u=>{if(s===null||a===null)return!0;let d=u-s;for(;d<-Math.PI;)d+=Math.PI*2;for(;d>Math.PI;)d-=Math.PI*2;return Math.abs(d)<=a/2};if(this.walls.forEach(u=>{[{x:u.x,y:u.y},{x:u.x+u.w,y:u.y},{x:u.x+u.w,y:u.y+u.h},{x:u.x,y:u.y+u.h}].forEach(d=>{const f=Math.atan2(d.y-t,d.x-e);l(f)&&(r.add(o(f-1e-4)),r.add(f),r.add(o(f+1e-4)))})}),s!==null&&a!==null){const u=s-a/2,d=s+a/2;r.add(o(u)),r.add(o(d));for(let f=u;f<d;f+=Math.PI/18)r.add(o(f))}else for(let u=-Math.PI;u<Math.PI;u+=Math.PI/10)r.add(u);const c=[];r.forEach(u=>{const d={x:e+Math.cos(u)*i,y:t+Math.sin(u)*i},f=this.getLineIntersection({x:e,y:t},d);c.push(f&&f.dist<i?{x:f.x,y:f.y,angle:u}:{...d,angle:u})});const h=s!==null?s:0;return c.sort((u,d)=>{let f=u.angle-h;for(;f<-Math.PI;)f+=Math.PI*2;for(;f>Math.PI;)f-=Math.PI*2;let p=d.angle-h;for(;p<-Math.PI;)p+=Math.PI*2;for(;p>Math.PI;)p-=Math.PI*2;return f-p}),s!==null&&a!==null&&(c.unshift({x:e,y:t,angle:-999}),c.push({x:e,y:t,angle:999})),c}draw(e,t={shadows:!0},i=[],s=null,a=[]){this.rooms.forEach(l=>this._drawFloor(e,l)),this.decorations.forEach(l=>this._drawDecoration(e,l)),this.zones.forEach(l=>this._drawZone(e,l)),this.items.forEach(l=>{l.active&&this._drawItem(e,l)}),e.save();let r=this.width/2,o=this.height/2;if(s&&(r=s.x,o=s.y),this.walls.forEach(l=>this._drawWall(e,l,r,o)),e.restore(),this.terminals&&this.terminals.forEach(l=>{l.active&&this._drawTerminal(e,l)}),t.shadows&&i&&i.length>0){this.maskCanvas||(this.maskCanvas=document.createElement("canvas"),this.maskCtx=this.maskCanvas.getContext("2d"));const l=e.canvas.width,c=e.canvas.height;(this.maskCanvas.width!==l||this.maskCanvas.height!==c)&&(this.maskCanvas.width=l,this.maskCanvas.height=c),this.maskCtx.fillStyle="rgba(3, 4, 6, 0.995)",this.maskCtx.fillRect(0,0,l,c),this.maskCtx.save(),this.maskCtx.setTransform(e.getTransform());const h=Date.now(),d=Math.sin(h*.04)*Math.cos(h*.007)+Math.sin(h*.1)*.5>-.45;this.ambientLights.brokenCeiling&&(this.ambientLights.brokenCeiling.on=d),this.maskCtx.globalCompositeOperation="destination-out",this.maskCtx.fillStyle="white";for(const[f,p]of Object.entries(this.ambientLights)){if(!p.on)continue;const v=p.pulseType==="garage"?1+Math.sin(h/300)*.05:p.pulseType==="lantern"?1+Math.sin(h/200)*.04:p.pulseType==="quantum"?1+Math.sin(h/150)*.03:1,g=p.radius*v,m=this.maskCtx.createRadialGradient(p.x,p.y,p.innerRadius||10,p.x,p.y,g);m.addColorStop(0,"rgba(255, 255, 255, 1.0)"),m.addColorStop(.5,"rgba(255, 255, 255, 0.45)"),m.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=m,this.maskCtx.beginPath(),this.maskCtx.arc(p.x,p.y,g,0,Math.PI*2),this.maskCtx.fill()}i.forEach(f=>{if(!(f.health<=0)){if(f.flashlightActive&&f.lightPoly&&f.lightPoly.length>0){this.maskCtx.beginPath(),this.maskCtx.moveTo(f.lightPoly[0].x,f.lightPoly[0].y);for(let p=1;p<f.lightPoly.length;p++)this.maskCtx.lineTo(f.lightPoly[p].x,f.lightPoly[p].y);this.maskCtx.closePath(),this.maskCtx.fillStyle="white",this.maskCtx.fill()}if(window.gameEngine&&window.gameEngine.matchMode==="sabotage"&&f.isLocal){const p=this.maskCtx.createRadialGradient(f.x,f.y,10,f.x,f.y,150);p.addColorStop(0,"rgba(255, 255, 255, 1.0)"),p.addColorStop(.7,"rgba(255, 255, 255, 0.45)"),p.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=p,this.maskCtx.beginPath(),this.maskCtx.arc(f.x,f.y,150,0,Math.PI*2),this.maskCtx.fill()}}}),a&&a.length>0&&a.forEach(f=>{if(!f.active)return;const p=this.maskCtx.createRadialGradient(f.x,f.y,5,f.x,f.y,60);p.addColorStop(0,"rgba(255, 255, 255, 1.0)"),p.addColorStop(.5,"rgba(255, 255, 255, 0.45)"),p.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=p,this.maskCtx.beginPath(),this.maskCtx.arc(f.x,f.y,60,0,Math.PI*2),this.maskCtx.fill()}),i.forEach(f=>{if(f.health>0&&f.muzzleFlash>.15){const p=f.x+Math.cos(f.angle)*28,v=f.y+Math.sin(f.angle)*28,g=this.maskCtx.createRadialGradient(p,v,10,p,v,180*f.muzzleFlash);g.addColorStop(0,"rgba(255, 255, 255, 1.0)"),g.addColorStop(.4,"rgba(255, 255, 255, 0.5)"),g.addColorStop(1,"rgba(255, 255, 255, 0.0)"),this.maskCtx.fillStyle=g,this.maskCtx.beginPath(),this.maskCtx.arc(p,v,180*f.muzzleFlash,0,Math.PI*2),this.maskCtx.fill()}}),this.maskCtx.restore(),e.save(),e.setTransform(1,0,0,1,0,0),e.drawImage(this.maskCanvas,0,0),e.restore(),i.forEach(f=>{if(f.health>0&&f.flashlightActive&&f.lightPoly&&f.lightPoly.length>0){e.save(),e.beginPath(),e.moveTo(f.lightPoly[0].x,f.lightPoly[0].y);for(let y=1;y<f.lightPoly.length;y++)e.lineTo(f.lightPoly[y].x,f.lightPoly[y].y);e.closePath(),e.clip();const p=f.x,v=f.y,g=700,m=p+Math.cos(f.angle)*g,M=v+Math.sin(f.angle)*g,_=e.createLinearGradient(p,v,m,M);_.addColorStop(0,"rgba(255, 255, 230, 0.18)"),_.addColorStop(.35,"rgba(255, 255, 245, 0.10)"),_.addColorStop(1,"rgba(255, 255, 255, 0.0)"),e.fillStyle=_,e.fill();const x=e.createRadialGradient(p,v,10,p,v,100);x.addColorStop(0,"rgba(255, 255, 220, 0.08)"),x.addColorStop(1,"rgba(255, 255, 220, 0.0)"),e.fillStyle=x,e.fill(),e.restore()}}),e.save();for(const[f,p]of Object.entries(this.ambientLights)){if(!p.on)continue;const v=p.pulseType==="garage"?1+Math.sin(h/300)*.05:p.pulseType==="lantern"?1+Math.sin(h/200)*.04:p.pulseType==="quantum"?1+Math.sin(h/150)*.03:1,g=p.radius*v,m=e.createRadialGradient(p.x,p.y,p.innerRadius||5,p.x,p.y,g);m.addColorStop(0,p.color),m.addColorStop(.5,p.colorMid),m.addColorStop(1,"rgba(0, 0, 0, 0.0)"),e.fillStyle=m,e.beginPath(),e.arc(p.x,p.y,g,0,Math.PI*2),e.fill(),this._drawLightFixture(e,p,h)}e.restore()}}_drawLightFixture(e,t,i){const s=t.fixtureType;if(e.save(),s==="lantern")e.fillStyle="#222",e.strokeStyle="#d4af37",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="rgba(255, 180, 50, 0.9)",e.beginPath(),e.arc(t.x,t.y,3,0,Math.PI*2),e.fill();else if(s==="brokenCeiling")e.fillStyle="#333",e.strokeStyle="#555",e.lineWidth=1,e.fillRect(t.x-16,t.y-4,32,8),e.strokeRect(t.x-16,t.y-4,32,8),e.fillStyle=t.on?"#fff":"#111",e.shadowColor=t.on?"#6cf":"transparent",e.shadowBlur=t.on?10:0,e.fillRect(t.x-12,t.y-2,24,4),e.shadowBlur=0;else if(s==="kitchen")e.fillStyle="#333",e.strokeStyle="#555",e.lineWidth=1,e.fillRect(t.x-12,t.y-12,24,24),e.strokeRect(t.x-12,t.y-12,24,24),e.fillStyle="#66fcf1",e.beginPath(),e.arc(t.x,t.y,5,0,Math.PI*2),e.fill();else if(s==="garage")e.fillStyle="#222",e.strokeStyle="#ff3c3c",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ff3c3c",e.beginPath(),e.arc(t.x,t.y,3.5,0,Math.PI*2),e.fill();else if(s==="bedroom2")e.fillStyle="#2d1822",e.strokeStyle="#ff6ef7",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,9,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ff6ef7",e.beginPath(),e.arc(t.x,t.y,4,0,Math.PI*2),e.fill();else if(s==="quantum"){e.fillStyle="#100c1e",e.strokeStyle="#9d3bff",e.lineWidth=1.5,e.beginPath(),e.arc(t.x,t.y,10,0,Math.PI*2),e.fill(),e.stroke();const a=i/100%(Math.PI*2);e.strokeStyle="#d473ff",e.lineWidth=1,e.beginPath(),e.moveTo(t.x-Math.cos(a)*8,t.y-Math.sin(a)*8),e.lineTo(t.x+Math.cos(a)*8,t.y+Math.sin(a)*8),e.stroke()}else s==="reactor_light"?(e.fillStyle="#201005",e.strokeStyle="#ff7f3b",e.lineWidth=2,e.beginPath(),e.arc(t.x,t.y,12,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x,t.y,6+Math.sin(i/200)*1.5,0,Math.PI*2),e.fill()):(s==="server_rack_light"||s==="cryo_light")&&(e.fillStyle="#111",e.strokeStyle=s==="cryo_light"?"#66fcf1":"#39db14",e.lineWidth=1.5,e.fillRect(t.x-6,t.y-6,12,12),e.strokeRect(t.x-6,t.y-6,12,12),e.fillStyle=s==="cryo_light"?"#66fcf1":"#39db14",e.beginPath(),e.arc(t.x,t.y,3,0,Math.PI*2),e.fill());e.restore()}isPointInAmbientLight(e,t,i=0){for(const[s,a]of Object.entries(this.ambientLights)){if(!a.on)continue;if(Math.hypot(e-a.x,t-a.y)<a.radius+i&&!this.getLineIntersection({x:a.x,y:a.y},{x:e,y:t}))return!0}return!1}_addDecorations(e){this.decorations=[];const t=e[0];this.decorations.push({x:t.x+50,y:t.y+55,w:120,h:40,type:"rug",style:"kitchen"});const i=e[1];this.decorations.push({x:i.x+i.w/2-120,y:i.y+110,w:240,h:160,type:"rug",style:"living"});const s=e[2];this.decorations.push({x:s.x+40,y:s.y+80,w:160,h:120,type:"rug",style:"office"});const a=e[3];this.decorations.push({x:a.x+110,y:a.y+40,w:60,h:90,type:"rug",style:"bath"});const r=e[4];this.decorations.push({x:r.x+r.w/2-180,y:r.y+40,w:360,h:60,type:"rug",style:"runner"});const o=e[5];this.decorations.push({x:o.x+30,y:o.y+110,w:140,h:160,type:"rug",style:"bedroom"});const l=e[7];this.decorations.push({x:l.x+l.w/2-120,y:l.y+80,w:240,h:220,type:"rug",style:"master"});const c=e[8];this.decorations.push({x:c.x+c.w/2-70,y:c.y+c.h/2-70,w:140,h:140,type:"rug",style:"circular"})}_drawDecoration(e,t){if(e.save(),t.type==="rug"){e.fillStyle="rgba(0,0,0,0.15)",e.fillRect(t.x+2,t.y+2,t.w,t.h);const s={kitchen:{bg:"#3a2d1f",border:"#aa8c66",text:"#55422d"},living:{bg:"#3b1c1c",border:"#d4af37",text:"#802020"},office:{bg:"#1c2d3b",border:"#66fcf1",text:"#204060"},bath:{bg:"#1f3c3a",border:"#39db14",text:"#152b2a"},runner:{bg:"#2b203c",border:"#9d3bff",text:"#4c2e73"},bedroom:{bg:"#3c3020",border:"#ffe6a3",text:"#5c4930"},master:{bg:"#222d32",border:"#66fcf1",text:"#435e6a"},circular:{bg:"#2d1822",border:"#ff6ef7",text:"#5e2540"}}[t.style]||{bg:"#222",border:"#444",text:"#333"};if(e.fillStyle=s.bg,e.strokeStyle=s.border,e.lineWidth=2,t.style==="circular")e.beginPath(),e.arc(t.x+t.w/2,t.y+t.h/2,t.w/2,0,Math.PI*2),e.fill(),e.stroke(),e.strokeStyle=s.text,e.lineWidth=1.5,e.beginPath(),e.arc(t.x+t.w/2,t.y+t.h/2,t.w/3,0,Math.PI*2),e.stroke();else{if(e.beginPath(),e.roundRect?e.roundRect(t.x,t.y,t.w,t.h,6):e.rect(t.x,t.y,t.w,t.h),e.fill(),e.stroke(),e.strokeStyle=s.border,e.lineWidth=1,e.beginPath(),t.w>t.h)for(let a=t.y+4;a<t.y+t.h;a+=6)e.moveTo(t.x,a),e.lineTo(t.x-4,a),e.moveTo(t.x+t.w,a),e.lineTo(t.x+t.w+4,a);else for(let a=t.x+4;a<t.x+t.w;a+=6)e.moveTo(a,t.y),e.lineTo(a,t.y-4),e.moveTo(a,t.y+t.h),e.lineTo(a,t.y+t.h+4);e.stroke()}}e.restore()}_drawFloor(e,t){if(e.save(),e.beginPath(),e.rect(t.x,t.y,t.w,t.h),e.clip(),t.floor==="tiles"){e.fillStyle="#121a28",e.fillRect(t.x,t.y,t.w,t.h);const i=44;for(let s=t.x;s<t.x+t.w;s+=i)for(let a=t.y;a<t.y+t.h;a+=i){const r=(Math.floor((s-t.x)/i)+Math.floor((a-t.y)/i))%2===0;e.fillStyle=r?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.04)",e.fillRect(s,a,i,i)}e.strokeStyle="rgba(40,80,120,0.25)",e.lineWidth=1;for(let s=t.x;s<=t.x+t.w;s+=i)e.beginPath(),e.moveTo(s,t.y),e.lineTo(s,t.y+t.h),e.stroke();for(let s=t.y;s<=t.y+t.h;s+=i)e.beginPath(),e.moveTo(t.x,s),e.lineTo(t.x+t.w,s),e.stroke()}else if(t.floor==="carpet"){e.fillStyle="#16102a",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(80,50,140,0.12)",e.lineWidth=1;for(let i=t.x;i<=t.x+t.w;i+=9)e.beginPath(),e.moveTo(i,t.y),e.lineTo(i,t.y+t.h),e.stroke();for(let i=t.y;i<=t.y+t.h;i+=9)e.beginPath(),e.moveTo(t.x,i),e.lineTo(t.x+t.w,i),e.stroke();e.strokeStyle="rgba(120,80,200,0.15)",e.lineWidth=3,e.strokeRect(t.x+15,t.y+15,t.w-30,t.h-30)}else if(t.floor==="wood"){e.fillStyle="#1a1208",e.fillRect(t.x,t.y,t.w,t.h);const i=32;for(let s=t.y;s<t.y+t.h;s+=i){const a=Math.floor((s-t.y)/i);e.fillStyle=a%2===0?"rgba(180,110,50,0.055)":"rgba(130,75,30,0.055)",e.fillRect(t.x,s,t.w,i-1),e.strokeStyle="rgba(70,45,18,0.35)",e.lineWidth=1,e.beginPath(),e.moveTo(t.x,s+i-1),e.lineTo(t.x+t.w,s+i-1),e.stroke(),e.strokeStyle="rgba(140,90,40,0.07)";for(let r=t.x+10;r<t.x+t.w-10;r+=t.w/5)e.beginPath(),e.moveTo(r,s),e.lineTo(r+12,s+i-1),e.stroke()}}else if(t.floor==="concrete"){e.fillStyle="#10101a",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(55,55,80,0.25)",e.lineWidth=1;const i=64;for(let s=t.x;s<=t.x+t.w;s+=i)e.beginPath(),e.moveTo(s,t.y),e.lineTo(s,t.y+t.h),e.stroke();for(let s=t.y;s<=t.y+t.h;s+=i)e.beginPath(),e.moveTo(t.x,s),e.lineTo(t.x+t.w,s),e.stroke();if(t.name==="Garage")e.fillStyle="rgba(30,25,10,0.4)",e.beginPath(),e.ellipse(t.x+150,t.y+230,60,30,.3,0,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(t.x+80,t.y+150,40,20,-.2,0,Math.PI*2),e.fill();else if(t.name==="Weaponry Depot"){e.strokeStyle="rgba(212, 175, 55, 0.15)",e.lineWidth=12,e.beginPath();for(let s=t.x;s<t.x+t.w;s+=60)e.moveTo(s,t.y),e.lineTo(s+40,t.y+40),e.moveTo(s,t.y+t.h-40),e.lineTo(s+40,t.y+t.h);e.stroke()}}else if(t.floor==="cybergrid"){e.fillStyle="#060a12",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(102, 252, 241, 0.08)",e.lineWidth=1;const i=50;for(let r=t.x;r<=t.x+t.w;r+=i)e.beginPath(),e.moveTo(r,t.y),e.lineTo(r,t.y+t.h),e.stroke();for(let r=t.y;r<=t.y+t.h;r+=i)e.beginPath(),e.moveTo(t.x,r),e.lineTo(t.x+t.w,r),e.stroke();const s=Date.now(),a=2+Math.sin(s/400)*.8;e.fillStyle="rgba(102, 252, 241, 0.45)";for(let r=t.x+i;r<t.x+t.w;r+=i)for(let o=t.y+i;o<t.y+t.h;o+=i)e.beginPath(),e.arc(r,o,a,0,Math.PI*2),e.fill()}else if(t.floor==="reactor"){e.fillStyle="#0f0a07",e.fillRect(t.x,t.y,t.w,t.h);const i=Date.now(),s=t.x+t.w/2,a=t.y+t.h/2;e.strokeStyle="rgba(255, 127, 59, 0.15)",e.lineWidth=4,e.strokeRect(t.x+8,t.y+8,t.w-16,t.h-16),e.lineWidth=2.5;const r=5;for(let l=1;l<=r;l++){const c=l*28,h=Math.sin(i/250-l*.5)*.15+.85;e.strokeStyle=`rgba(255, 127, 59, ${.08+(1-l/r)*.22})`,e.beginPath(),e.arc(s,a,c*h,0,Math.PI*2),e.stroke()}e.strokeStyle="rgba(255, 150, 80, 0.4)",e.lineWidth=1.5;const o=i/800%(Math.PI*2);e.beginPath(),e.arc(s,a,70,o,o+Math.PI*.4),e.stroke(),e.beginPath(),e.arc(s,a,110,o+Math.PI,o+Math.PI*1.4),e.stroke()}else if(t.floor==="nanogrid"){e.fillStyle="#050c08",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(57, 219, 20, 0.08)",e.lineWidth=1;const i=60;for(let r=t.x+30;r<t.x+t.w;r+=i)e.beginPath(),e.moveTo(r,t.y),e.lineTo(r,t.y+t.h),e.stroke();e.strokeStyle="rgba(57, 219, 20, 0.05)";for(let r=t.y+40;r<t.y+t.h;r+=80)e.beginPath(),e.moveTo(t.x,r),e.lineTo(t.x+t.w*.35,r),e.lineTo(t.x+t.w*.45,r-25),e.lineTo(t.x+t.w,r-25),e.stroke();const s=Date.now();e.fillStyle="rgba(57, 219, 20, 0.6)";const a=Math.floor(t.x*.7+t.y*1.3);for(let r=0;r<6;r++){const o=t.x+30+(a+r*39)%(t.w-60),l=t.y+30+(a*11+r*87)%(t.h-60);Math.floor(s/200+r)%3===0&&e.fillRect(o-2,l-2,4,4)}}else if(t.floor==="cybercarpet"){e.fillStyle="#0f081d",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(157, 59, 255, 0.04)",e.lineWidth=1.5;const i=30,s=i*Math.sqrt(3),a=i*2;for(let r=t.x-s;r<t.x+t.w+s;r+=s)for(let o=t.y-a;o<t.y+t.h+a;o+=a*.75){const l=Math.floor(o/(a*.75))%2*(s/2),c=r+l,h=o;e.beginPath();for(let u=0;u<6;u++){const d=u*Math.PI/3,f=c+i*Math.cos(d),p=h+i*Math.sin(d);u===0?e.moveTo(f,p):e.lineTo(f,p)}e.closePath(),e.stroke()}e.strokeStyle="rgba(157, 59, 255, 0.12)",e.lineWidth=3,e.strokeRect(t.x+20,t.y+20,t.w-40,t.h-40)}e.textAlign="center",e.font="bold 12px Orbitron",e.fillStyle="rgba(120,200,240,0.15)",e.fillText(t.name.toUpperCase(),t.x+t.w/2,t.y+22),e.restore()}_drawZone(e,t){e.save();const i=Math.sin(Date.now()/600)*.12+.12,s=t.type==="healing";e.fillStyle=s?`rgba(30,255,100,${i})`:`rgba(255,60,20,${i})`,e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle=s?`rgba(60,255,130,${i*2})`:`rgba(255,90,40,${i*2})`,e.lineWidth=2,e.setLineDash([8,8]),e.lineDashOffset=-(Date.now()/60%16),e.strokeRect(t.x,t.y,t.w,t.h),e.setLineDash([]);const a=14;e.lineWidth=2.5,[[t.x,t.y,1,1],[t.x+t.w,t.y,-1,1],[t.x,t.y+t.h,1,-1],[t.x+t.w,t.y+t.h,-1,-1]].forEach(([o,l,c,h])=>{e.beginPath(),e.moveTo(o,l+h*a),e.lineTo(o,l),e.lineTo(o+c*a,l),e.stroke()}),e.textAlign="center",e.font="bold 11px Orbitron",e.fillStyle=s?"rgba(80,255,140,0.55)":"rgba(255,110,60,0.55)",e.fillText(t.label,t.x+t.w/2,t.y+t.h/2-6);const r=s?`+${(t.healRate*60).toFixed(0)} HP/s`:`×${t.multiplier} DMG`;e.font="9px Orbitron",e.fillStyle=s?"rgba(80,255,140,0.4)":"rgba(255,110,60,0.4)",e.fillText(r,t.x+t.w/2,t.y+t.h/2+10),e.restore()}_drawItem(e,t){e.save();const i=1+Math.sin(Date.now()/180)*.14;t.type==="health"?(e.shadowColor="#ff2e2e",e.shadowBlur=14,e.fillStyle="#cc2020",e.beginPath(),e.arc(t.x,t.y,11*i,0,Math.PI*2),e.fill(),e.shadowBlur=0,e.fillStyle="#ffffff",e.fillRect(t.x-2.5,t.y-6.5*i,5,13*i),e.fillRect(t.x-6.5*i,t.y-2.5,13*i,5)):t.type==="ammo"?(e.shadowColor="#ffcc00",e.shadowBlur=10,e.fillStyle="#cc9900",e.fillRect(t.x-7,t.y-7,14,14),e.fillStyle="#ffe060",e.fillRect(t.x-2,t.y-5,4,8),e.beginPath(),e.arc(t.x,t.y-5,2,Math.PI,0),e.fill()):t.type==="adrenaline"?(e.shadowColor="#39db14",e.shadowBlur=15,e.fillStyle="#1b7d05",e.beginPath(),e.arc(t.x,t.y,11*i,0,Math.PI*2),e.fill(),e.fillStyle="#39db14",e.beginPath(),e.moveTo(t.x-1,t.y-6*i),e.lineTo(t.x-4,t.y+1),e.lineTo(t.x-1,t.y+1),e.lineTo(t.x-2.5,t.y+7*i),e.lineTo(t.x+3.5,t.y-1),e.lineTo(t.x+.5,t.y-1),e.closePath(),e.fill()):t.type==="overdrive"&&(e.shadowColor="#ffd700",e.shadowBlur=15,e.fillStyle="#aa7c11",e.beginPath(),e.moveTo(t.x,t.y-12*i),e.lineTo(t.x+10*i,t.y),e.lineTo(t.x,t.y+12*i),e.lineTo(t.x-10*i,t.y),e.closePath(),e.fill(),e.strokeStyle="#ffd700",e.lineWidth=2.5,e.lineCap="round",e.lineJoin="round",e.beginPath(),e.moveTo(t.x-4,t.y-4),e.lineTo(t.x-1,t.y),e.lineTo(t.x-4,t.y+4),e.stroke(),e.beginPath(),e.moveTo(t.x+1,t.y-4),e.lineTo(t.x+4,t.y),e.lineTo(t.x+1,t.y+4),e.stroke()),e.restore()}initTerminals(){this.terminals=[{id:"term_1",x:this.mapId==="cyberlab"?700:720,y:620,radius:24,hacked:!1,progress:0,active:!0,label:"REACTOR DATA CORE"},{id:"term_2",x:1220,y:1120,radius:24,hacked:!1,progress:0,active:!0,label:"SECURE CACHE SUPPLY"}]}_drawTerminal(e,t){e.save();const i=1+Math.sin(Date.now()/200)*.08,s=e.createRadialGradient(t.x,t.y,5,t.x,t.y,t.radius*1.5*i);s.addColorStop(0,t.hacked?"rgba(57, 255, 20, 0.25)":"rgba(102, 252, 241, 0.25)"),s.addColorStop(1,"rgba(0, 0, 0, 0.0)"),e.fillStyle=s,e.beginPath(),e.arc(t.x,t.y,t.radius*1.8*i,0,Math.PI*2),e.fill(),e.fillStyle="#1c1e24",e.strokeStyle="#2b2e38",e.lineWidth=2,e.beginPath(),e.arc(t.x,t.y,14,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#0b0c10",e.strokeStyle=t.hacked?"rgba(57, 255, 20, 0.8)":"rgba(102, 252, 241, 0.8)",e.lineWidth=1.5,e.beginPath(),e.roundRect?e.roundRect(t.x-12,t.y-12,24,16,3):e.rect(t.x-12,t.y-12,24,16),e.fill(),e.stroke(),e.fillStyle=t.hacked?"#39ff14":"#66fcf1",e.font="bold 5px monospace",e.textAlign="center",e.textBaseline="middle",e.fillText(t.hacked?"SECURE":"ACCESS",t.x,t.y-4),e.fillStyle=t.hacked?"#39ff14":"#ffd700",e.beginPath(),e.arc(t.x-6,t.y+7,2,0,Math.PI*2),e.arc(t.x+6,t.y+7,2,0,Math.PI*2),e.fill(),e.restore()}_drawExtrudedObject(e,t,i,s,a,r){const o={x:t.x,y:t.y},l={x:t.x+t.w,y:t.y},c={x:t.x+t.w,y:t.y+t.h},h={x:t.x,y:t.y+t.h},u={x:o.x+(o.x-i)*a,y:o.y+(o.y-s)*a},d={x:l.x+(l.x-i)*a,y:l.y+(l.y-s)*a},f={x:c.x+(c.x-i)*a,y:c.y+(c.y-s)*a},p={x:h.x+(h.x-i)*a,y:h.y+(h.y-s)*a};e.save(),e.fillStyle="rgba(2, 3, 5, 0.45)",e.beginPath(),e.moveTo(o.x,o.y),e.lineTo(l.x,l.y),e.lineTo(c.x,c.y),e.lineTo(h.x,h.y),e.closePath(),e.fill(),e.restore();const v=(M,_,x,y,E)=>{e.save(),e.fillStyle=E,e.beginPath(),e.moveTo(M.x,M.y),e.lineTo(_.x,_.y),e.lineTo(y.x,y.y),e.lineTo(x.x,x.y),e.closePath(),e.fill(),e.strokeStyle="rgba(0,0,0,0.25)",e.lineWidth=1,e.stroke(),e.restore()};v(o,l,u,d,s>t.y?"#090a0d":"#17181c"),v(l,c,d,f,i<t.x+t.w?"#0d0e12":"#1b1c21"),v(c,h,f,p,s<t.y+t.h?"#090a0d":"#17181c"),v(h,o,p,u,i>t.x?"#0d0e12":"#1b1c21"),e.save(),e.beginPath(),e.moveTo(u.x,u.y),e.lineTo(d.x,d.y),e.lineTo(f.x,f.y),e.lineTo(p.x,p.y),e.closePath(),e.clip();const g=u.x-t.x,m=u.y-t.y;e.translate(g,m),r(e,t),e.restore(),e.save(),e.beginPath(),e.moveTo(u.x,u.y),e.lineTo(d.x,d.y),e.lineTo(f.x,f.y),e.lineTo(p.x,p.y),e.closePath(),e.strokeStyle="rgba(255,255,255,0.12)",e.lineWidth=1.5,e.stroke(),e.restore()}_drawExtrudedBarrel(e,t,i,s){const r=t.x+t.w/2,o=t.y+t.h/2,l=t.w/2,c=r+(r-i)*.04,h=o+(o-s)*.04;e.save(),e.fillStyle="rgba(2, 3, 5, 0.45)",e.beginPath(),e.arc(r,o,l,0,Math.PI*2),e.fill(),e.restore();const u=Math.atan2(h-o,c-r)+Math.PI/2,d=Math.cos(u)*l,f=Math.sin(u)*l;e.save(),e.fillStyle="#1c1000",e.beginPath(),e.moveTo(r-d,o-f),e.lineTo(r+d,o-f),e.lineTo(c+d,h-f),e.lineTo(c-d,h-f),e.closePath(),e.fill(),e.strokeStyle="#3a2000",e.stroke(),e.restore(),e.save(),e.translate(c-r,h-o),this._drawBarrel(e,t),e.restore()}_drawWall(e,t,i,s){e.save();const a=.08,r=.04;switch(t.material){case"exterior":this._drawExtrudedObject(e,t,i,s,a,(o,l)=>this._drawExteriorWall(o,l));break;case"interior":this._drawExtrudedObject(e,t,i,s,a,(o,l)=>this._drawInteriorWall(o,l));break;case"furniture":this._drawExtrudedObject(e,t,i,s,r,(o,l)=>this._drawFurniturePiece(o,l));break;case"barrel":this._drawExtrudedBarrel(e,t,i,s);break;case"crate":this._drawExtrudedObject(e,t,i,s,r,(o,l)=>this._drawCratePiece(o,l));break;default:this._drawExtrudedObject(e,t,i,s,a,(o,l)=>this._drawInteriorWall(o,l))}e.restore()}_drawExteriorWall(e,t){e.fillStyle="#0b0b12",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(60,50,90,0.4)",e.lineWidth=1;const i=32,s=13;for(let a=t.x;a<t.x+t.w;a+=i)for(let r=t.y;r<t.y+t.h;r+=s){const o=Math.floor((r-t.y)/s)%2*(i/2);e.strokeRect(a+o,r,i,s)}e.strokeStyle="rgba(102,252,241,0.28)",e.lineWidth=2,e.strokeRect(t.x,t.y,t.w,t.h)}_drawInteriorWall(e,t){e.fillStyle="#1b1c22",e.fillRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(90,130,170,0.45)",e.lineWidth=1.5,e.strokeRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(170,130,70,0.25)",e.lineWidth=1,t.w>t.h?(e.beginPath(),e.moveTo(t.x,t.y+3),e.lineTo(t.x+t.w,t.y+3),e.stroke(),e.beginPath(),e.moveTo(t.x,t.y+t.h-3),e.lineTo(t.x+t.w,t.y+t.h-3),e.stroke()):(e.beginPath(),e.moveTo(t.x+3,t.y),e.lineTo(t.x+3,t.y+t.h),e.stroke(),e.beginPath(),e.moveTo(t.x+t.w-3,t.y),e.lineTo(t.x+t.w-3,t.y+t.h),e.stroke())}_drawFurniturePiece(e,t){const i=t.label||"",a={sofa:{fill:"#261637",stroke:"#4a2a70"},table:{fill:"#241510",stroke:"#7a4a22"},bed:{fill:"#152030",stroke:"#2a5080"},counter:{fill:"#182215",stroke:"#3a7050"},desk:{fill:"#1e1408",stroke:"#5a3a18"},tub:{fill:"#0a1a2c",stroke:"#1a5a8a"},sink:{fill:"#0a1828",stroke:"#2a6090"},tv:{fill:"#0a0a14",stroke:"#4a4a70"},shelf:{fill:"#1e1006",stroke:"#5a3010"},car:{fill:"#1a1a28",stroke:"#3a3a5c"},bench:{fill:"#1c1408",stroke:"#5c4018"},fridge:{fill:"#141c24",stroke:"#3a5a78"},cabinet:{fill:"#18100a",stroke:"#5a3a1a"},dresser:{fill:"#1e1408",stroke:"#6a4020"},toilet:{fill:"#eee",stroke:"#555"},chair:{fill:"#2b1e16",stroke:"#5c402d"},plant:{fill:"#152d18",stroke:"#345a3a"},cyber_couch:{fill:"#110a24",stroke:"#9d3bff"},containment_pod:{fill:"#08181a",stroke:"#66fcf1"},server_rack:{fill:"#080c10",stroke:"#39db14"},cyber_console:{fill:"#050c18",stroke:"#1a7cd8"},reactor_core:{fill:"#150c05",stroke:"#ff7f3b"},nano_charger:{fill:"#051a0c",stroke:"#39db14"}}[i]||{fill:"#1a1a2a",stroke:"#4a4a80"};if(e.fillStyle=a.fill,e.strokeStyle=a.stroke,e.lineWidth=1.5,e.beginPath(),e.roundRect?e.roundRect(t.x,t.y,t.w,t.h,4):e.rect(t.x,t.y,t.w,t.h),e.fill(),e.stroke(),i==="bed"){e.fillStyle="rgba(255,255,255,0.05)",e.fillRect(t.x,t.y,t.w,10),e.strokeStyle=a.stroke,e.strokeRect(t.x,t.y,t.w,10),e.fillStyle="#223040",e.strokeStyle="rgba(255,255,255,0.1)",e.lineWidth=1;const r=Math.min(32,(t.w-16)/2),o=Math.min(18,t.h*.18),l=t.y+16;t.w>80?(e.fillRect(t.x+8,l,r,o),e.strokeRect(t.x+8,l,r,o),e.fillRect(t.x+t.w-8-r,l,r,o),e.strokeRect(t.x+t.w-8-r,l,r,o)):(e.fillRect(t.x+t.w/2-r/2,l,r,o),e.strokeRect(t.x+t.w/2-r/2,l,r,o)),e.strokeStyle="rgba(255, 255, 255, 0.08)",e.lineWidth=1.5,e.beginPath(),e.moveTo(t.x+4,t.y+t.h*.45),e.lineTo(t.x+t.w-4,t.y+t.h*.45),e.stroke(),e.beginPath(),e.moveTo(t.x+4,t.y+t.h*.45),e.lineTo(t.x+t.w/3,t.y+t.h*.65),e.moveTo(t.x+t.w-4,t.y+t.h*.45),e.lineTo(t.x+t.w*.66,t.y+t.h*.65),e.stroke()}else if(i==="sofa"){e.fillStyle="rgba(0,0,0,0.18)";const r=10;if(e.strokeStyle="rgba(255, 255, 255, 0.06)",t.w>t.h){e.fillRect(t.x,t.y,r,t.h),e.strokeRect(t.x,t.y,r,t.h),e.fillRect(t.x+t.w-r,t.y,r,t.h),e.strokeRect(t.x+t.w-r,t.y,r,t.h),e.fillRect(t.x+r,t.y,t.w-r*2,r),e.strokeRect(t.x+r,t.y,t.w-r*2,r);const o=(t.w-r*2)/3;for(let l=1;l<3;l++)e.beginPath(),e.moveTo(t.x+r+o*l,t.y+r),e.lineTo(t.x+r+o*l,t.y+t.h),e.stroke()}else{e.fillRect(t.x,t.y,t.w,r),e.strokeRect(t.x,t.y,t.w,r),e.fillRect(t.x,t.y+t.h-r,t.w,r),e.strokeRect(t.x,t.y+t.h-r,t.w,r),e.fillRect(t.x,t.y+r,r,t.h-r*2),e.strokeRect(t.x,t.y+r,r,t.h-r*2);const o=(t.h-r*2)/2;for(let l=1;l<2;l++)e.beginPath(),e.moveTo(t.x+r,t.y+r+o*l),e.lineTo(t.x+t.w,t.y+r+o*l),e.stroke()}}else if(i==="counter")if(e.strokeStyle="rgba(255,255,255,0.08)",e.lineWidth=1,t.w>t.h){e.fillStyle="#111b22",e.fillRect(t.x+t.w*.2,t.y+4,30,t.h-8),e.strokeRect(t.x+t.w*.2,t.y+4,30,t.h-8),e.strokeStyle="#8fa4b3",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+t.w*.2+15,t.y+2),e.lineTo(t.x+t.w*.2+15,t.y+8),e.stroke(),e.strokeStyle="#ff5c28",e.lineWidth=1;const r=t.x+t.w*.7,o=t.y+t.h/2;e.beginPath(),e.arc(r-12,o-6,4,0,Math.PI*2),e.arc(r+12,o-6,5,0,Math.PI*2),e.arc(r-12,o+6,5,0,Math.PI*2),e.arc(r+12,o+6,4,0,Math.PI*2),e.stroke()}else e.fillStyle="#111b22",e.fillRect(t.x+4,t.y+t.h*.3,t.w-8,30),e.strokeRect(t.x+4,t.y+t.h*.3,t.w-8,30),e.strokeStyle="#8fa4b3",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+2,t.y+t.h*.3+15),e.lineTo(t.x+8,t.y+t.h*.3+15),e.stroke();else if(i==="desk")e.fillStyle="rgba(0,0,0,0.15)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.fillStyle="#05050a",e.strokeStyle="#66fcf1",e.lineWidth=1.5,t.w>t.h?(e.fillRect(t.x+t.w/2-25,t.y+6,50,4),e.strokeRect(t.x+t.w/2-25,t.y+6,50,4),e.fillStyle="#222",e.fillRect(t.x+t.w/2-20,t.y+15,40,10)):(e.fillRect(t.x+6,t.y+t.h/2-25,4,50),e.strokeRect(t.x+6,t.y+t.h/2-25,4,50),e.fillStyle="#222",e.fillRect(t.x+15,t.y+t.h/2-20,10,40));else if(i==="shelf"){e.fillStyle="#3c2415",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4);const r=["#9e2a2b","#3e5c76","#ffe066","#a3b18a","#9b5de5","#ff9f1c"];e.lineWidth=1;const o=Math.round(t.x*13+t.y*37),l=new no(o);if(t.w>t.h){let c=t.x+4;for(;c<t.x+t.w-6;){const h=Math.floor(l.next()*4)+3,u=Math.floor(l.next()*8)+12;e.fillStyle=r[Math.floor(l.next()*r.length)],e.fillRect(c,t.y+t.h-2-u,h,u),e.strokeRect(c,t.y+t.h-2-u,h,u),c+=h+1}}else{let c=t.y+4;for(;c<t.y+t.h-6;){const h=Math.floor(l.next()*4)+3,u=Math.floor(l.next()*8)+12;e.fillStyle=r[Math.floor(l.next()*r.length)],e.fillRect(t.x+2,c,u,h),e.strokeRect(t.x+2,c,u,h),c+=h+1}}}else if(i==="dresser"||i==="cabinet")if(e.strokeStyle="rgba(255,255,255,0.06)",e.lineWidth=1,t.w>t.h){const o=t.w/2;for(let l=0;l<2;l++)e.strokeRect(t.x+o*l+2,t.y+2,o-4,t.h-4),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x+o*l+o/2,t.y+t.h-5,2,0,Math.PI*2),e.fill()}else{const o=t.h/3;for(let l=0;l<3;l++)e.strokeRect(t.x+2,t.y+o*l+2,t.w-4,o-4),e.fillStyle="#ffd700",e.beginPath(),e.arc(t.x+t.w-5,t.y+o*l+o/2,2,0,Math.PI*2),e.fill()}else if(i==="toilet")e.fillStyle="#eee",e.strokeStyle="#555",e.lineWidth=1.5,e.fillRect(t.x+4,t.y,t.w-8,12),e.strokeRect(t.x+4,t.y,t.w-8,12),e.beginPath(),e.arc(t.x+t.w/2,t.y+24,9,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#66c0f4",e.beginPath(),e.arc(t.x+t.w/2,t.y+24,5,0,Math.PI*2),e.fill();else if(i==="chair")e.fillStyle="rgba(0,0,0,0.1)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.strokeStyle=a.stroke,e.lineWidth=2.5,e.beginPath(),e.moveTo(t.x+2,t.y+2),e.lineTo(t.x+t.w-2,t.y+2),e.stroke();else if(i==="plant"){const r=t.x+t.w/2,o=t.y+t.h/2;e.fillStyle="#8c5a3c",e.strokeStyle="#5c3a26",e.beginPath(),e.arc(r,o,10,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#2a7c36",e.beginPath(),e.arc(r-6,o-4,7,0,Math.PI*2),e.arc(r+6,o-4,6,0,Math.PI*2),e.arc(r,o+6,8,0,Math.PI*2),e.arc(r-3,o+5,6,0,Math.PI*2),e.fill(),e.fillStyle="#4ea35b",e.beginPath(),e.arc(r-4,o-2,4,0,Math.PI*2),e.arc(r+4,o-2,3,0,Math.PI*2),e.arc(r,o+3,4,0,Math.PI*2),e.fill()}else if(i==="tub")e.fillStyle="#0d2535",e.fillRect(t.x+7,t.y+7,t.w-14,t.h-14),e.strokeStyle="rgba(50,170,255,0.25)",e.strokeRect(t.x+7,t.y+7,t.w-14,t.h-14);else if(i==="car")e.fillStyle="#0a1828",e.fillRect(t.x+28,t.y+18,65,38),e.fillRect(t.x+t.w-95,t.y+18,65,38),e.strokeStyle="rgba(80,120,200,0.3)",e.strokeRect(t.x+28,t.y+18,65,38),e.strokeRect(t.x+t.w-95,t.y+18,65,38),e.strokeStyle="rgba(100,100,180,0.4)",e.lineWidth=2,e.strokeRect(t.x+10,t.y+10,t.w-20,t.h-20);else if(i==="cyber_couch")e.fillStyle="rgba(0,0,0,0.2)",e.fillRect(t.x+4,t.y+4,t.w-8,t.h-8),e.strokeStyle="rgba(157, 59, 255, 0.25)",e.lineWidth=1,t.w>t.h?(e.strokeRect(t.x+6,t.y+4,t.w-12,6),e.beginPath(),e.moveTo(t.x+4,t.y+t.h-4),e.lineTo(t.x+t.w-4,t.y+t.h-4),e.strokeStyle="#9d3bff",e.stroke()):(e.strokeRect(t.x+4,t.y+6,6,t.h-12),e.beginPath(),e.moveTo(t.x+t.w-4,t.y+4),e.lineTo(t.x+t.w-4,t.y+t.h-4),e.strokeStyle="#9d3bff",e.stroke());else if(i==="containment_pod"){e.fillStyle="rgba(102, 252, 241, 0.05)",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.fillStyle="#222",e.strokeStyle="#66fcf1",e.lineWidth=1.5,t.w>t.h?(e.fillRect(t.x,t.y,8,t.h),e.strokeRect(t.x,t.y,8,t.h),e.fillRect(t.x+t.w-8,t.y,8,t.h),e.strokeRect(t.x+t.w-8,t.y,8,t.h)):(e.fillRect(t.x,t.y,t.w,8),e.strokeRect(t.x,t.y,t.w,8),e.fillRect(t.x,t.y+t.h-8,t.w,8),e.strokeRect(t.x,t.y+t.h-8,t.w,8));const r=Date.now();e.fillStyle="rgba(102, 252, 241, 0.4)";const o=Math.floor(t.x*2.3+t.y*1.7);for(let l=0;l<4;l++){const c=t.x+10+(o+l*29)%(t.w-20),h=t.y+10+((o*7+l*41-r*.04)%(t.h-20)+(t.h-20))%(t.h-20);e.beginPath(),e.arc(c,h,1.5+l%2,0,Math.PI*2),e.fill()}}else if(i==="server_rack"){e.fillStyle="#0a0d14",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.strokeStyle="rgba(255, 255, 255, 0.04)",e.lineWidth=1;const r=Date.now(),o=Math.floor(t.h/14);if(t.h>t.w)for(let l=0;l<o;l++){const c=t.y+4+l*14;e.strokeRect(t.x+3,c,t.w-6,10);const h=Math.floor(r/200+l)%4!==0,u=Math.floor(r/450+l*2)%6===0,d=Math.floor(r/300-l)%5===0;e.fillStyle=h?"#39db14":"#053005",e.fillRect(t.x+6,c+4,3,3),e.fillStyle=u?"#ff3c3c":"#400505",e.fillRect(t.x+12,c+4,3,3),e.fillStyle=d?"#66fcf1":"#052028",e.fillRect(t.x+18,c+4,3,3)}else{const l=Math.floor(t.w/14);for(let c=0;c<l;c++){const h=t.x+4+c*14;e.strokeRect(h,t.y+3,10,t.h-6);const u=Math.floor(r/200+c)%4!==0,d=Math.floor(r/450+c*2)%6===0;e.fillStyle=u?"#39db14":"#053005",e.fillRect(h+4,t.y+6,3,3),e.fillStyle=d?"#ff3c3c":"#400505",e.fillRect(h+4,t.y+12,3,3)}}}else if(i==="cyber_console")if(e.fillStyle="rgba(0,0,0,0.35)",e.fillRect(t.x+3,t.y+3,t.w-6,t.h-6),e.fillStyle="#09152b",e.strokeStyle="#1a7cd8",e.lineWidth=1.5,t.w>t.h){e.fillRect(t.x+5,t.y+t.h-12,t.w-10,8),e.strokeRect(t.x+5,t.y+t.h-12,t.w-10,8),e.fillStyle="rgba(26, 124, 216, 0.15)",e.fillRect(t.x+10,t.y+4,t.w-20,t.h-18),e.strokeRect(t.x+10,t.y+4,t.w-20,t.h-18),e.strokeStyle="#66fcf1",e.lineWidth=1,e.beginPath();const r=Date.now();for(let o=t.x+14;o<t.x+t.w-14;o+=4){const l=t.y+10+Math.sin(r*.005+o*.1)*3;o===t.x+14?e.moveTo(o,l):e.lineTo(o,l)}e.stroke()}else e.fillRect(t.x+4,t.y+5,8,t.h-10),e.strokeRect(t.x+4,t.y+5,8,t.h-10),e.fillStyle="rgba(26, 124, 216, 0.15)",e.fillRect(t.x+14,t.y+10,t.w-18,t.h-20),e.strokeRect(t.x+14,t.y+10,t.w-18,t.h-20);else if(i==="reactor_core"){const r=t.x+t.w/2,o=t.y+t.h/2,l=Math.min(t.w,t.h)/2,c=Date.now();e.fillStyle="#100a05",e.strokeStyle="#ff7f3b",e.lineWidth=2.5,e.beginPath(),e.arc(r,o,l-4,0,Math.PI*2),e.fill(),e.stroke();const h=3,u=c/400%(Math.PI*2);e.fillStyle="#ff7f3b";for(let d=0;d<h;d++){const f=u+d*Math.PI*2/h,p=r+Math.cos(f)*(l-12),v=o+Math.sin(f)*(l-12);e.beginPath(),e.arc(p,v,4,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(255, 215, 0, 0.25)",e.lineWidth=1.5,e.beginPath(),e.moveTo(r,o),e.lineTo(p,v),e.stroke()}e.fillStyle="#ffd700",e.shadowColor="#ff7f3b",e.shadowBlur=12,e.beginPath(),e.arc(r,o,6+Math.sin(c/150)*1.5,0,Math.PI*2),e.fill(),e.shadowBlur=0}else if(i==="nano_charger"){e.fillStyle="#06100a",e.fillRect(t.x+2,t.y+2,t.w-4,t.h-4),e.fillStyle="rgba(57, 219, 20, 0.1)",e.strokeStyle="#39db14",e.lineWidth=1.5,e.strokeRect(t.x+4,t.y+4,t.w-8,t.h-8);const r=Date.now(),o=(t.h-12)*(.5+Math.sin(r/250)*.35);e.fillStyle="#39db14",e.fillRect(t.x+6,t.y+t.h-6-o,t.w-12,o)}else i==="fridge"?(e.strokeStyle="rgba(160,200,255,0.4)",e.lineWidth=2,e.beginPath(),e.moveTo(t.x+t.w/2-10,t.y+12),e.lineTo(t.x+t.w/2+10,t.y+12),e.stroke()):(e.strokeStyle="rgba(255,255,255,0.06)",e.strokeRect(t.x+3,t.y+3,t.w-6,t.h-6))}_drawBarrel(e,t){const i=t.x+t.w/2,s=t.y+t.h/2,a=t.w/2;if(e.fillStyle="#2a1800",e.strokeStyle="#9a4800",e.lineWidth=2,e.beginPath(),e.arc(i,s,a,0,Math.PI*2),e.fill(),e.stroke(),e.strokeStyle="rgba(255,120,0,0.65)",e.lineWidth=2,e.beginPath(),e.arc(i,s,a-5,0,Math.PI*2),e.stroke(),e.strokeStyle="rgba(255,160,0,0.4)",e.lineWidth=1.5,e.beginPath(),e.moveTo(i-a*.4,s-a*.4),e.lineTo(i+a*.4,s+a*.4),e.moveTo(i+a*.4,s-a*.4),e.lineTo(i-a*.4,s+a*.4),e.stroke(),t.health<t.maxHealth){const r=t.health/t.maxHealth;e.fillStyle="rgba(0,0,0,0.6)",e.fillRect(t.x,t.y+2,t.w,4),e.fillStyle=r>.5?"#39ff14":"#ff3c3c",e.fillRect(t.x,t.y+2,t.w*r,4)}}_drawCratePiece(e,t){e.fillStyle="#3a2b1e",e.strokeStyle="#b8865c",e.lineWidth=1.5,e.fillRect(t.x,t.y,t.w,t.h),e.strokeRect(t.x,t.y,t.w,t.h),e.strokeStyle="rgba(170,110,60,0.4)",e.lineWidth=1,e.beginPath(),e.moveTo(t.x+3,t.y+3),e.lineTo(t.x+t.w-3,t.y+t.h-3),e.moveTo(t.x+t.w-3,t.y+3),e.lineTo(t.x+3,t.y+t.h-3),e.stroke(),e.strokeStyle="rgba(210,150,80,0.7)",e.lineWidth=1.5;const i=8;if([[t.x,t.y,1,1],[t.x+t.w,t.y,-1,1],[t.x,t.y+t.h,1,-1],[t.x+t.w,t.y+t.h,-1,-1]].forEach(([s,a,r,o])=>{e.beginPath(),e.moveTo(s,a+o*i),e.lineTo(s,a),e.lineTo(s+r*i,a),e.stroke()}),t.health<t.maxHealth){const s=t.health/t.maxHealth;e.fillStyle="rgba(0,0,0,0.6)",e.fillRect(t.x+4,t.y+4,t.w-8,5),e.fillStyle=s>.5?"#39ff14":"#ff3c3c",e.fillRect(t.x+4,t.y+4,(t.w-8)*s,5)}}};class gi{constructor(e,t,i,s,a,r,o,l,c="normal"){this.x=e,this.y=t,this.vx=i,this.vy=s,this.color=a,this.size=r,this.life=o,this.decay=l,this.type=c,this.angle=Math.random()*Math.PI*2,this.spin=(Math.random()-.5)*.3,this.bounceCount=0}update(e){if(this.life-=this.decay,this.type==="casing"||this.type==="splinter"){this.vx*=.95,this.vy*=.95,this.angle+=this.spin;const t=this.x+this.vx,i=this.y+this.vy,s=e.checkCircleCollision(t,i,this.size);(s.x!==t||s.y!==i)&&this.bounceCount<2?(this.bounceCount++,this.x=s.x,this.y=s.y,this.vx=-this.vx*.4,this.vy=-this.vy*.4):(this.x=s.x,this.y=s.y)}else this.x+=this.vx,this.y+=this.vy,this.vx*=.92,this.vy*=.92}draw(e){e.save(),e.globalAlpha=Math.max(0,this.life),this.type==="casing"?(e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle="#d4af37",e.strokeStyle="#996515",e.lineWidth=.5,e.fillRect(-this.size,-this.size/2,this.size*2,this.size),e.strokeRect(-this.size,-this.size/2,this.size*2,this.size)):this.type==="splinter"?(e.translate(this.x,this.y),e.rotate(this.angle),e.fillStyle="#8b5a2b",e.beginPath(),e.moveTo(-this.size,0),e.lineTo(this.size,-this.size/2),e.lineTo(this.size/2,this.size/2),e.closePath(),e.fill()):this.type==="blood"?(e.fillStyle=this.color,e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fill()):(e.fillStyle=this.color,!(window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode)&&(this.color.startsWith("#66fc")||this.color.startsWith("#ff3c"))&&(e.shadowColor=this.color,e.shadowBlur=4),e.beginPath(),e.arc(this.x,this.y,this.size*this.life,0,Math.PI*2),e.fill()),e.restore()}}class so{constructor(e,t,i,s,a="blood"){this.x=e,this.y=t,this.size=i,this.color=s,this.type=a,this.angle=Math.random()*Math.PI*2,this.scaleX=1+(Math.random()-.5)*.4,this.scaleY=1+(Math.random()-.5)*.4}draw(e){e.save(),e.translate(this.x,this.y),e.rotate(this.angle),e.globalAlpha=this.type==="blood"?.75:.9,this.type==="blood"?(e.fillStyle=this.color,e.beginPath(),e.ellipse(0,0,this.size*this.scaleX,this.size*this.scaleY,0,0,Math.PI*2),e.fill()):this.type==="casing"?(e.fillStyle="#b5921c",e.fillRect(-this.size,-this.size/2,this.size*2,this.size)):this.type==="splinter"&&(e.fillStyle="#6e441c",e.fillRect(-this.size,-this.size/3,this.size*1.5,this.size*.7)),e.restore()}}class ux{constructor(){this.particles=[],this.decals=[],this.bloodEnabled=!0}clear(){this.particles=[],this.decals=[]}setBloodEnabled(e){this.bloodEnabled=e}update(e){for(let t=this.particles.length-1;t>=0;t--){const i=this.particles[t];i.update(e),i.life<=0&&(i.type==="blood"&&this.bloodEnabled&&Math.random()<.6?this.decals.push(new so(i.x,i.y,i.size*1.2,i.color,"blood")):i.type==="casing"?this.decals.push(new so(i.x,i.y,i.size,"#996515","casing")):i.type==="splinter"&&Math.random()<.4&&this.decals.push(new so(i.x,i.y,i.size,"#5c3917","splinter")),this.particles.splice(t,1))}this.decals.length>250&&this.decals.shift()}drawDecals(e){this.decals.forEach(t=>t.draw(e))}drawParticles(e){this.particles.forEach(t=>t.draw(e))}spawnWallImpact(e,t,i){const s=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,a=i+Math.PI,r=s?1:Math.floor(Math.random()*4)+3;for(let o=0;o<r;o++){const l=a+(Math.random()-.5)*1.2,c=Math.random()*3+2,h=Math.cos(l)*c,u=Math.sin(l)*c,d=Math.random()*2.2+1.2,f=Math.random()*.04+.04;this.particles.push(new gi(e,t,h,u,Math.random()>.5?"#66fcf1":"#ffffff",d,1,f,"spark"))}s||this.particles.push(new gi(e,t,(Math.random()-.5)*.3,(Math.random()-.5)*.3,"rgba(197, 198, 199, 0.25)",Math.random()*6+4,1,.03,"smoke"))}spawnBloodSplatter(e,t,i){if(!this.bloodEnabled)return;const a=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode?2:Math.floor(Math.random()*6)+6;for(let r=0;r<a;r++){const o=i+(Math.random()-.5)*1.1,l=Math.random()*4.5+2.5,c=Math.cos(o)*l,h=Math.sin(o)*l,u=Math.random()*3+1.5,d=Math.random()*.05+.04,p=`rgb(${Math.floor(Math.random()*60)+120}, 10, 10)`;this.particles.push(new gi(e,t,c,h,p,u,1,d,"blood"))}}spawnGunCasing(e,t,i,s){if(window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode)return;const r=i+Math.PI/2+(Math.random()-.5)*.5,o=Math.random()*2+1.8,l=Math.cos(r)*o,c=Math.sin(r)*o,h=s==="sniper"?3.5:s==="pistol"?2:2.6,u=.02;this.particles.push(new gi(e,t,l,c,"#d4af37",h,1,u,"casing"));const d=i+(Math.random()-.5)*.3,f=Math.random()*.6+.3;this.particles.push(new gi(e+Math.cos(i)*6,t+Math.sin(i)*6,Math.cos(d)*f,Math.sin(d)*f,"rgba(200, 200, 200, 0.15)",Math.random()*5+3,1,.04,"smoke"))}spawnCrateSplinters(e,t){const i=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,s=i?3:Math.floor(Math.random()*12)+10;for(let a=0;a<s;a++){const r=Math.random()*Math.PI*2,o=Math.random()*4+1.5,l=Math.cos(r)*o,c=Math.sin(r)*o,h=Math.random()*4+2,u=Math.random()*.03+.02;this.particles.push(new gi(e,t,l,c,"#8b5a2b",h,1,u,"splinter"))}if(!i)for(let a=0;a<4;a++)this.particles.push(new gi(e+(Math.random()-.5)*10,t+(Math.random()-.5)*10,(Math.random()-.5)*.8,(Math.random()-.5)*.8,"rgba(140, 130, 120, 0.2)",Math.random()*12+8,1,.02,"smoke"))}spawnFlashbangBurst(e,t){const i=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,s=i?8:30;for(let a=0;a<s;a++){const r=Math.random()*Math.PI*2,o=Math.random()*7+3,l=Math.cos(r)*o,c=Math.sin(r)*o,h=Math.random()*4+2,u=Math.random()*.03+.02;this.particles.push(new gi(e,t,l,c,Math.random()>.3?"#ffffff":"#66fcf1",h,1,u,"spark"))}if(!i)for(let a=0;a<10;a++){const r=Math.random()*Math.PI*2,o=Math.random()*2.5,l=Math.cos(r)*o,c=Math.sin(r)*o;this.particles.push(new gi(e,t,l,c,"rgba(255, 255, 255, 0.4)",Math.random()*20+10,1,.015,"smoke"))}}spawnDashParticles(e,t,i,s="cyan"){const a=window.gameEngine&&window.gameEngine.settings&&window.gameEngine.settings.performanceMode,o={cyan:"#66fcf1",green:"#5eff39",purple:"#c47aff",orange:"#ff9d7a",yellow:"#ffea70",red:"#ff7a7a"}[s]||"#66fcf1",l=i+Math.PI,c=a?2:12;for(let u=0;u<c;u++){const d=l+(Math.random()-.5)*.6,f=Math.random()*2.5+1.2,p=Math.cos(d)*f,v=Math.sin(d)*f,g=Math.random()*7+4,m=Math.random()*.05+.03;this.particles.push(new gi(e,t,p,v,"rgba(200, 200, 200, 0.18)",g,1,m,"smoke"))}const h=a?3:18;for(let u=0;u<h;u++){const d=i+(Math.random()-.5)*.7,f=Math.random()*8+4,p=Math.cos(d)*f,v=Math.sin(d)*f,g=Math.random()*2.5+1,m=Math.random()*.06+.04;this.particles.push(new gi(e,t,p,v,o,g,1,m,"spark"))}}}class fx{constructor(){this.ctx=null,this.masterVolume=null,this.volume=.5,this.noiseBuffer=null,this.shotgunBuffer=null,this.taskAlarms=new Map,this.bearMusic=null}init(){if(this.ctx)return;const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.masterVolume=this.ctx.createGain(),this.masterVolume.gain.value=this.volume,this.masterVolume.connect(this.ctx.destination);const t=this.ctx.sampleRate*2,i=this.ctx.createBuffer(1,t,this.ctx.sampleRate),s=i.getChannelData(0);for(let a=0;a<t;a++)s[a]=Math.random()*2-1;this.noiseBuffer=i,fetch("/dennish18-shotgun.mp3").then(a=>a.arrayBuffer()).then(a=>this.ctx.decodeAudioData(a)).then(a=>{this.shotgunBuffer=a}).catch(a=>console.error("Error loading shotgun sound:",a)),this._buildReverb()}_buildReverb(){if(!this.ctx||this.reverbNode)return;const e=Math.floor(this.ctx.sampleRate*.9),t=this.ctx.createBuffer(2,e,this.ctx.sampleRate);for(let i=0;i<2;i++){const s=t.getChannelData(i);for(let a=0;a<e;a++)s[a]=(Math.random()*2-1)*Math.pow(1-a/e,2.2)}this.reverbNode=this.ctx.createConvolver(),this.reverbNode.buffer=t,this.reverbGain=this.ctx.createGain(),this.reverbGain.gain.value=.28,this.reverbNode.connect(this.reverbGain),this.reverbGain.connect(this.masterVolume)}setVolume(e){this.volume=e,this.masterVolume&&(this.masterVolume.gain.value=e),this.bearMusic&&(this.bearMusic.volume=e*.3)}playGunshot(e,t=0){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const i=this.ctx.currentTime;let s=this.masterVolume;if(t>0){const m=this.ctx.createBiquadFilter();m.type="lowpass";const M=Math.max(220,4500*Math.pow(1-Math.min(1,t/1300),1.5));m.frequency.setValueAtTime(M,i);const _=Math.max(.01,Math.pow(1-Math.min(1,t/1400),1.2)),x=this.ctx.createGain();x.gain.setValueAtTime(_,i),m.connect(x),x.connect(this.masterVolume),s=m}const a=this.ctx.createBufferSource();a.buffer=this.noiseBuffer;const r=this.ctx.createBiquadFilter(),o=this.ctx.createGain();a.connect(r),r.connect(o),o.connect(s);const l=this.ctx.createOscillator(),c=this.ctx.createGain();l.connect(c),c.connect(s);let h=1e3,u=.1,d=.6,f=150,p=40,v=.08,g=.5;switch(e){case"pistol":h=1200,u=.12,d=.5,f=180,p=50,v=.06,g=.3;break;case"rifle":h=800,u=.18,d=.6,f=140,p=40,v=.1,g=.5;break;case"shotgun":if(this.shotgunBuffer)try{const m=this.ctx.createBufferSource();m.buffer=this.shotgunBuffer;const M=this.ctx.createGain();M.gain.setValueAtTime(.9,i),m.connect(M),M.connect(s),m.start(i);return}catch(m){console.error("Error playing custom shotgun audio:",m)}h=500,u=.35,d=.9,f=120,p=30,v=.25,g=.9,this.playMetallicClick(i+.05,800,.08,.3,t),this.playMetallicClick(i+.1,600,.05,.3,t);break;case"sniper":h=1500,u=.6,d=1,f=220,p=30,v=.4,g=1;break;case"knife":h=2e3,u=.12,d=.45,f=100,p=100,v=.01,g=0;break;case"vector":h=1600,u=.08,d=.42,f=200,p=80,v=.05,g=.25;break;case"famas":h=1e3,u=.14,d=.55,f=160,p=50,v=.09,g=.42;break;case"plasma":{h=3e3,u=.18,d=.3,f=600,p=120,v=.18,g=.55;try{const m=this.ctx.createOscillator(),M=this.ctx.createGain();m.type="sawtooth",m.frequency.setValueAtTime(800,i),m.frequency.exponentialRampToValueAtTime(200,i+.15),M.gain.setValueAtTime(.08,i),M.gain.exponentialRampToValueAtTime(.001,i+.15),m.connect(M),M.connect(s),m.start(i),m.stop(i+.17)}catch{}break}case"railgun":{h=600,u=.55,d=1,f=320,p=18,v=.45,g=1;try{const m=this.ctx.createOscillator(),M=this.ctx.createGain();m.type="square",m.frequency.setValueAtTime(180,i),m.frequency.exponentialRampToValueAtTime(40,i+.3),M.gain.setValueAtTime(.15,i),M.gain.exponentialRampToValueAtTime(.001,i+.3),m.connect(M),M.connect(s),m.start(i),m.stop(i+.32)}catch{}break}}r.type="bandpass",r.frequency.setValueAtTime(h,i),o.gain.setValueAtTime(d,i),o.gain.exponentialRampToValueAtTime(.001,i+u),l.type="sine",l.frequency.setValueAtTime(f,i),l.frequency.exponentialRampToValueAtTime(p,i+v),c.gain.setValueAtTime(g,i),c.gain.exponentialRampToValueAtTime(.001,i+v),a.start(i),a.stop(i+u+.05),l.start(i),l.stop(i+v+.05)}playReload(e){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime;e==="pistol"?(this.playMetallicClick(t,2e3,.05,.3),this.playMetallicClick(t+.4,1500,.08,.4),this.playMetallicClick(t+.5,2200,.04,.3)):e==="rifle"?(this.playMetallicClick(t,1800,.06,.3),this.playFrictionalScrape(t+.3,.2,.2),this.playMetallicClick(t+1.2,1200,.1,.5),this.playMetallicClick(t+1.35,2e3,.05,.4),this.playMetallicClick(t+1.8,1400,.08,.5),this.playMetallicClick(t+1.9,1e3,.08,.4)):e==="shotgun"?(this.playMetallicClick(t,1200,.06,.4),this.playFrictionalScrape(t+.05,.15,.3),this.playMetallicClick(t+.2,1800,.04,.4)):e==="sniper"&&(this.playMetallicClick(t,1400,.08,.4),this.playMetallicClick(t+.1,1e3,.06,.3),this.playMetallicClick(t+.5,900,.1,.4),this.playMetallicClick(t+.65,1200,.05,.3),this.playMetallicClick(t+1.2,1500,.1,.4),this.playMetallicClick(t+1.35,1800,.05,.3),this.playMetallicClick(t+1.9,1100,.08,.4),this.playMetallicClick(t+2.05,1600,.06,.4))}playDryFire(){this.init(),this.ctx&&this.playMetallicClick(this.ctx.currentTime,3e3,.03,.25)}playFootstep(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.setValueAtTime(220,e);const s=this.ctx.createGain();s.gain.setValueAtTime(.08,e),s.gain.exponentialRampToValueAtTime(.001,e+.1),t.connect(i),i.connect(s),s.connect(this.masterVolume),t.start(e),t.stop(e+.12)}playHitMarker(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(1600,e),i.gain.setValueAtTime(.15,e),i.gain.exponentialRampToValueAtTime(.001,e+.08),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.1)}playCriticalHitMarker(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(2300,e),i.gain.setValueAtTime(.25,e),i.gain.exponentialRampToValueAtTime(.001,e+.14),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.16)}playFleshHit(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.setValueAtTime(350,e);const s=this.ctx.createGain();s.gain.setValueAtTime(.35,e),s.gain.exponentialRampToValueAtTime(.001,e+.1),t.connect(i),i.connect(s),s.connect(this.masterVolume),t.start(e),t.stop(e+.12)}playCrateBreak(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.setValueAtTime(300,e);const s=this.ctx.createGain();s.gain.setValueAtTime(.7,e),s.gain.exponentialRampToValueAtTime(.001,e+.3),t.connect(i),i.connect(s),s.connect(this.masterVolume);const a=this.ctx.createBufferSource();a.buffer=this.noiseBuffer;const r=this.ctx.createBiquadFilter();r.type="highpass",r.frequency.setValueAtTime(2e3,e);const o=this.ctx.createGain();o.gain.setValueAtTime(.2,e),o.gain.exponentialRampToValueAtTime(.001,e+.15),a.connect(r),r.connect(o),o.connect(this.masterVolume),t.start(e),t.stop(e+.35),a.start(e),a.stop(e+.2)}playPickup(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(587.33,e),t.frequency.setValueAtTime(880,e+.08),i.gain.setValueAtTime(.12,e),i.gain.setValueAtTime(.12,e+.08),i.gain.exponentialRampToValueAtTime(.001,e+.25),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.28)}playMatchWin(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=(i,s,a,r)=>{const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="triangle",o.frequency.setValueAtTime(i,s),l.gain.setValueAtTime(r,s),l.gain.exponentialRampToValueAtTime(.001,s+a),o.connect(l),l.connect(this.masterVolume),o.start(s),o.stop(s+a+.05)};t(523.25,e,.4,.2),t(659.25,e+.15,.4,.2),t(783.99,e+.3,.4,.2),t(1046.5,e+.45,.6,.25)}playMatchLose(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=(i,s,a,r)=>{const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sawtooth",o.frequency.setValueAtTime(i,s);const c=this.ctx.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(500,s),l.gain.setValueAtTime(r,s),l.gain.exponentialRampToValueAtTime(.001,s+a),o.connect(c),c.connect(l),l.connect(this.masterVolume),o.start(s),o.stop(s+a+.05)};t(220,e,.5,.2),t(207.65,e+.2,.5,.2),t(196,e+.4,.5,.2),t(146.83,e+.6,.8,.25)}playMetallicClick(e,t,i,s=.3,a=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const r=typeof e=="number"&&e<10?Math.max(0,e):0,o=this.ctx.currentTime+r,l=this.ctx.createOscillator(),c=this.ctx.createGain();let h=this.masterVolume;if(a>0){const u=this.ctx.createBiquadFilter();u.type="lowpass";const d=Math.max(220,3e3*(1-Math.min(1,a/1200)));u.frequency.setValueAtTime(d,o);const f=this.ctx.createGain(),p=Math.max(.01,1-a/1300);f.gain.setValueAtTime(p,o),u.connect(f),f.connect(this.masterVolume),h=u}l.connect(c),c.connect(h),l.type="square",l.frequency.setValueAtTime(t,o),l.frequency.exponentialRampToValueAtTime(t*.5,o+i),c.gain.setValueAtTime(s,o),c.gain.exponentialRampToValueAtTime(.001,o+i),l.start(o),l.stop(o+i+.01)}catch{}}playFrictionalScrape(e,t,i=.2){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const s=typeof e=="number"&&e<10?Math.max(0,e):0,a=this.ctx.currentTime+s,r=this.ctx.createBufferSource();r.buffer=this.noiseBuffer;const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(800,a),o.frequency.exponentialRampToValueAtTime(1400,a+t);const l=this.ctx.createGain();l.gain.setValueAtTime(i,a),l.gain.linearRampToValueAtTime(i*.5,a+t*.5),l.gain.exponentialRampToValueAtTime(.001,a+t),r.connect(o),o.connect(l),l.connect(this.masterVolume),r.start(a),r.stop(a+t+.02)}catch{}}playFlashbangExplosion(e=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime,i=this.ctx.createOscillator(),s=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(160,t),i.frequency.exponentialRampToValueAtTime(10,t+.3);const a=Math.max(.1,1-e/1100);s.gain.setValueAtTime(.85*a,t),s.gain.exponentialRampToValueAtTime(.001,t+.35),i.connect(s),s.connect(this.masterVolume),i.start(t),i.stop(t+.4);const r=this.ctx.createOscillator(),o=this.ctx.createGain();r.type="sine",r.frequency.setValueAtTime(4500,t);const l=.35*Math.max(.01,1-e/700);o.gain.setValueAtTime(l,t),o.gain.linearRampToValueAtTime(l*.5,t+1),o.gain.exponentialRampToValueAtTime(.001,t+2.5),r.connect(o),o.connect(this.masterVolume),r.start(t),r.stop(t+2.6)}catch{}}playDashSound(e=0){try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const t=this.ctx.currentTime,i=this.ctx.createOscillator(),s=this.ctx.createGain();let a=this.masterVolume;if(e>0){const r=this.ctx.createBiquadFilter();r.type="lowpass";const o=Math.max(220,3e3*(1-Math.min(1,e/1200)));r.frequency.setValueAtTime(o,t);const l=this.ctx.createGain(),c=Math.max(.01,1-e/1300);l.gain.setValueAtTime(c,t),r.connect(l),l.connect(this.masterVolume),a=r}i.connect(s),s.connect(a),i.type="sine",i.frequency.setValueAtTime(800,t),i.frequency.exponentialRampToValueAtTime(150,t+.2),s.gain.setValueAtTime(.35,t),s.gain.exponentialRampToValueAtTime(.001,t+.22),i.start(t),i.stop(t+.25)}catch{}}playAlarmForTask(e,t=0){if(this.init(),!this.ctx)return;if(this.ctx.state==="suspended"&&this.ctx.resume(),this.taskAlarms.has(e)){this.taskAlarms.get(e).distance=t;return}const i={intervalId:null,nodes:[],active:!0,distance:t};this.taskAlarms.set(e,i);const s=()=>{if(!i.active||!this.ctx)return;const a=i.distance,r=700,o=Math.max(0,Math.pow(1-Math.min(1,a/r),2.8)),l=Math.max(150,4e3*Math.pow(1-Math.min(1,a/r),2.5)),c=this.ctx.currentTime,h=this.ctx.createGain();h.gain.setValueAtTime(0,c),h.gain.linearRampToValueAtTime(o*.55,c+.04),h.gain.setValueAtTime(o*.55,c+.32),h.gain.linearRampToValueAtTime(0,c+.42);const u=this.ctx.createBiquadFilter();u.type="lowpass",u.frequency.setValueAtTime(l,c),u.Q.value=.9;const d=this.ctx.createOscillator();d.type="sawtooth",d.frequency.setValueAtTime(880,c),d.frequency.linearRampToValueAtTime(660,c+.2),d.frequency.linearRampToValueAtTime(880,c+.4);const f=this.ctx.createOscillator();f.type="square",f.frequency.setValueAtTime(1100,c),f.frequency.linearRampToValueAtTime(880,c+.2),f.frequency.linearRampToValueAtTime(1100,c+.4);const p=this.ctx.createGain();p.gain.value=.35;const v=this.ctx.createWaveShaper(),g=new Float32Array(256);for(let m=0;m<256;m++){const M=m*2/256-1;g[m]=(Math.PI+180)*M/(Math.PI+180*Math.abs(M))}if(v.curve=g,v.oversample="2x",d.connect(v),f.connect(p),p.connect(v),v.connect(u),u.connect(h),h.connect(this.masterVolume),this.reverbNode&&t<900){const m=this.ctx.createGain();m.gain.value=Math.max(0,.4*(1-t/900)),h.connect(m),m.connect(this.reverbNode)}d.start(c),f.start(c),d.stop(c+.45),f.stop(c+.45),i.nodes.push(d,f,h,u)};s(),i.intervalId=setInterval(s,600)}stopAlarmForTask(e){const t=this.taskAlarms.get(e);t&&(t.active=!1,t.intervalId!==null&&clearInterval(t.intervalId),t.nodes.forEach(i=>{try{i.stop&&i.stop()}catch{}}),this.taskAlarms.delete(e))}stopAllAlarms(){this.taskAlarms.forEach((e,t)=>this.stopAlarmForTask(t)),this.taskAlarms.clear()}playBearMusic(){this.bearMusic||(this.bearMusic=new Audio("/bear.mp3"),this.bearMusic.loop=!0),this.bearMusic.volume=this.volume*.3,this.bearMusic.paused&&(this.bearMusic.currentTime=0,this.bearMusic.play().catch(e=>console.warn("Error playing bear music:",e)))}stopBearMusic(){this.bearMusic&&(this.bearMusic.pause(),this.bearMusic.currentTime=0)}playHighBeep(){if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(2e3,e),t.frequency.exponentialRampToValueAtTime(3e3,e+.15),i.gain.setValueAtTime(.2,e),i.gain.exponentialRampToValueAtTime(.001,e+.2),t.connect(i),i.connect(this.masterVolume),t.start(e),t.stop(e+.22)}}class px{constructor(e,t,i,s,a,r,o){this.socket=e,this.localPlayer=t,this.opponent=i,this.map=s,this.particles=a,this.sound=r,this.engine=o,this.opponentStateBuffers=new Map,this.interpolationDelay=100,this.lastSentTime=0,this.sendInterval=1e3/60,window.AppSocket=this.socket,this.socket&&this.setupListeners()}setupListeners(){this.socket.on("opponent-state",e=>{if(!e.id)return;const t=this.engine.remotePlayers.get(e.id);if(!t)return;e.justDashed&&(t.justDashed=!0),e.droppedItem&&this.engine.spawnItemAt(e.droppedItem.x,e.droppedItem.y,e.droppedItem.type,e.droppedItem.id),e.health!==void 0&&(t.health=e.health);let i=this.opponentStateBuffers.get(e.id);i||(i=[],this.opponentStateBuffers.set(e.id,i)),i.push({time:Date.now(),x:e.x,y:e.y,angle:e.angle,vx:e.vx,vy:e.vy,health:e.health,weaponKey:e.weaponKey,isReloading:e.isReloading,muzzleFlash:e.muzzleFlash,flashlightActive:e.flashlightActive,inVent:e.inVent||!1}),i.length>30&&i.shift()}),this.socket.on("opponent-shoot",e=>{const t=this.engine.remotePlayers.get(e.playerId);if(t){if(t.muzzleFlash=1,t.angle=e.angle,this.particles.spawnGunCasing(t.x,t.y,t.angle,e.weaponKey),this.sound){const i=Math.hypot(t.x-this.localPlayer.x,t.y-this.localPlayer.y);this.sound.playGunshot(e.weaponKey,i)}this.engine.spawnBulletFromNetwork(e)}}),this.socket.on("damage-taken",e=>{if(this.engine.gameState==="playing"&&e.targetId===this.localPlayer.id){this.localPlayer.takeDamage(e.damage,this.sound);const i=this.engine.devCheatActive?Math.round(this.localPlayer.health/2):this.localPlayer.health;this.socket.emit("sync-health",{playerId:this.localPlayer.id,health:i}),this.engine.shakeCamera(e.damage*.45),this.engine.players.some(a=>a.health>0&&a.team===this.localPlayer.team)||this.socket.emit("player-died",{winnerId:e.shooterId,winnerName:"Opponents",loserId:this.localPlayer.id,roundNumber:this.engine.roundNumber})}}),this.socket.on("opponent-health-sync",e=>{const t=this.engine.remotePlayers.get(e.playerId);t&&(t.health=e.health)}),this.socket.on("opponent-break-crate",e=>{this.map.syncBreakCrate(e.crateId,e.spawnedItem),this.sound&&this.sound.playCrateBreak(),this.particles.spawnCrateSplinters(e.crateX||0,e.crateY||0)}),this.socket.on("opponent-pickup-item",e=>{const t=this.map.items.find(i=>i.id===e.itemId);t&&(t.active=!1,this.sound&&this.sound.playPickup())}),this.socket.on("opponent-sabotage-alarm",e=>{if(this.engine&&this.engine.tasks){const t=this.engine.tasks[e.idx];if(t&&(t.status="completed",t.alarmActive=!0,t.alarmTimer=15,this.sound)){const i=Math.hypot(this.localPlayer.x-t.x,this.localPlayer.y-t.y);try{this.sound.playAlarmForTask(t.id,i)}catch{}}}}),this.socket.on("opponent-chat",e=>{let t=e.name;const i=this.engine.remotePlayers.get(e.id);i&&(t=i.name);const s=new CustomEvent("opponent-chat-msg",{detail:{name:t,msg:e.msg}});window.dispatchEvent(s)}),this.socket.on("round-over",e=>{this.engine.handleServerRoundOver(e)}),this.socket.on("match-over",e=>{this.engine.handleServerMatchOver(e)})}sendState(e){if(this.socket&&e-this.lastSentTime>=this.sendInterval){this.lastSentTime=e;const i=this.engine.devCheatActive?Math.round(this.localPlayer.health/2):this.localPlayer.health,s={x:this.localPlayer.x,y:this.localPlayer.y,angle:this.localPlayer.angle,vx:this.localPlayer.vx,vy:this.localPlayer.vy,health:i,weaponKey:this.localPlayer.weaponKey,isReloading:this.localPlayer.isReloading,muzzleFlash:this.localPlayer.muzzleFlash,flashlightActive:this.localPlayer.flashlightActive,inVent:this.localPlayer.inVent||!1,justDashed:this.localPlayer.networkJustDashed||!1,droppedItem:this.localPlayer.networkDroppedItem||null};this.localPlayer.networkJustDashed=!1,this.localPlayer.networkDroppedItem=null,this.socket.emit("player-state",s)}}sendShoot(e){this.socket&&this.socket.emit("shoot",e)}interpolateOpponents(){const e=Date.now();this.lastInterpolateTime||(this.lastInterpolateTime=e);const t=e-this.lastInterpolateTime;this.lastInterpolateTime=e;const s=Math.max(1,Math.min(100,t))/16.67;this.engine.remotePlayers.forEach((a,r)=>{const o=this.opponentStateBuffers.get(r);if(!a||!o||o.length===0)return;const c=Date.now()-this.interpolationDelay;let h=null,u=null;for(let d=0;d<o.length;d++){const f=o[d];if(f.time<=c)h=f;else{u=f;break}}if(h&&u){const d=u.time-h.time,f=d>0?(c-h.time)/d:0;a.x=h.x+(u.x-h.x)*f,a.y=h.y+(u.y-h.y)*f,a.angle=this.lerpAngle(h.angle,u.angle,f),a.vx=h.vx+(u.vx-h.vx)*f,a.vy=h.vy+(u.vy-h.vy)*f,a.weaponKey=h.weaponKey,a.isReloading=h.isReloading,a.muzzleFlash=h.muzzleFlash,a.flashlightActive=h.flashlightActive,a.inVent=h.inVent||!1}else{const d=o[o.length-1],p=1-Math.pow(1-.25,s);a.x+=(d.x-a.x)*p,a.y+=(d.y-a.y)*p,a.angle=this.lerpAngle(a.angle,d.angle,p),a.vx=d.vx,a.vy=d.vy,a.weaponKey=d.weaponKey,a.isReloading=d.isReloading,a.muzzleFlash=d.muzzleFlash,a.flashlightActive=d.flashlightActive,a.inVent=d.inVent||!1}})}lerpAngle(e,t,i){let s=t-e;for(;s<-Math.PI;)s+=Math.PI*2;for(;s>Math.PI;)s-=Math.PI*2;return e+s*i}destroy(){this.socket&&(this.socket.off("opponent-state"),this.socket.off("opponent-shoot"),this.socket.off("damage-taken"),this.socket.off("opponent-health-sync"),this.socket.off("opponent-break-crate"),this.socket.off("opponent-pickup-item"),this.socket.off("opponent-sabotage-alarm"),this.socket.off("opponent-chat"),this.socket.off("round-over"),this.socket.off("match-over"))}}const mx=26,gx=18,jt=1e-6,yh=new WeakMap,dl=Object.freeze([{dx:1,dy:0,cost:1,bit:1},{dx:-1,dy:0,cost:1,bit:2},{dx:0,dy:1,cost:1,bit:4},{dx:0,dy:-1,cost:1,bit:8}]),xd=Object.freeze([{dx:1,dy:1,cost:Math.SQRT2,bit:16},{dx:-1,dy:1,cost:Math.SQRT2,bit:32},{dx:1,dy:-1,cost:Math.SQRT2,bit:64},{dx:-1,dy:-1,cost:Math.SQRT2,bit:128}]),yx=Object.freeze([...dl,...xd]);function Ki(n,e,t){return Math.max(e,Math.min(t,Number(n)||0))}function $e(n,e=0){const t=Number(n);return Number.isFinite(t)?t:e}function ao(n){let e=0,t=n&255;for(;t;)t&=t-1,e++;return e}function ul(n,e,t,i){const s=Ki(n,i.x,i.x+i.w),a=Ki(e,i.y,i.y+i.h),r=n-s,o=e-a;return r*r+o*o<t*t-jt}function xx(n,e,t,i,s,a){const r=s.x-a,o=s.x+s.w+a,l=s.y-a,c=s.y+s.h+a,h=t-n,u=i-e;let d=0,f=1;const p=(v,g)=>{if(Math.abs(g)<jt)return v<=0;const m=v/g;if(g>0){if(m>f)return!1;m>d&&(d=m)}else{if(m<d)return!1;m<f&&(f=m)}return!0};return p(r-n,h)&&p(n-o,-h)&&p(l-e,u)&&p(e-c,-u)&&d<=f}function vx(n){if(n.length===0)return[];const e=n.map(([i,s])=>[Math.min(i,s),Math.max(i,s)]).sort((i,s)=>i[0]-s[0]||i[1]-s[1]),t=[e[0].slice()];for(let i=1;i<e.length;i++){const s=e[i],a=t[t.length-1];s[0]<=a[1]+jt?a[1]=Math.max(a[1],s[1]):t.push(s.slice())}return t}function _x(n,e,t){let i=2166136261;for(const s of[Math.round(n*10),Math.round(e*10),t|0])i^=s,i=Math.imul(i,16777619);return(i>>>0)/4294967296}function vd(n,e,t,i,s,a){const r=s-t,o=a-i,l=r*r+o*o;if(l<jt)return Math.hypot(n-t,e-i);const c=Ki(((n-t)*r+(e-i)*o)/l,0,1);return Math.hypot(n-(t+r*c),e-(i+o*c))}function Sx(n,e,t,i,s,a){return xx(n,e,t,i,a,0)||ul(n,e,s,a)||ul(t,i,s,a)?!0:[[a.x,a.y],[a.x+a.w,a.y],[a.x+a.w,a.y+a.h],[a.x,a.y+a.h]].some(([o,l])=>vd(o,l,n,e,t,i)<s-jt)}class Ws{constructor(){this.values=[]}get size(){return this.values.length}push(e){const t=this.values;t.push(e);let i=t.length-1;for(;i>0;){const s=i-1>>1;if(!Ws.before(t[i],t[s]))break;[t[i],t[s]]=[t[s],t[i]],i=s}}pop(){const e=this.values;if(e.length===0)return null;const t=e[0],i=e.pop();if(e.length>0){e[0]=i;let s=0;for(;;){const a=s*2+1,r=a+1;let o=s;if(a<e.length&&Ws.before(e[a],e[o])&&(o=a),r<e.length&&Ws.before(e[r],e[o])&&(o=r),o===s)break;[e[s],e[o]]=[e[o],e[s]],s=o}}return t}static before(e,t){return e.f<t.f||e.f===t.f&&(e.h<t.h||e.h===t.h&&e.index<t.index)}}class Mx{constructor(e,t=[],i={}){if(!e)throw new TypeError("BotNavigation requires a map");this.map=e,this.cellSize=Ki(i.cellSize||mx,24,28),this.agentRadius=Math.max(1,$e(i.agentRadius,gx)),this.obstacleRevision=-1,this.cols=0,this.rows=0,this.walkable=new Uint8Array(0),this.components=new Int32Array(0),this.neighborMask=new Uint8Array(0),this.componentCount=0,this.rooms=[],this.connections=[],this.doorways=[],this.deadEnds=[],this.deadEndRooms=[],this.spawns=[],this.safePatrolPoints=[],this.coverCandidates=[],this._spawnInputs=[],this.sync(t)}sync(e=this._spawnInputs){Array.isArray(e)&&(this._spawnInputs=e.map(i=>({...i})));const t=Number.isFinite(this.map.navigationRevision)?this.map.navigationRevision:0;return(t!==this.obstacleRevision||this.cols!==Math.ceil(this.map.width/this.cellSize)||this.rows!==Math.ceil(this.map.height/this.cellSize))&&(this.obstacleRevision=t,this._rebuild()),this._syncSpawns(),this}isPointClear(e,t,i=this.agentRadius){return this._ensureCurrent(),this._pointClear($e(e),$e(t),Math.max(0,$e(i,this.agentRadius)))}hasClearPath(e,t,i,s,a=this.agentRadius){return this._ensureCurrent(),this._segmentClear($e(e),$e(t),$e(i),$e(s),Math.max(0,$e(a,this.agentRadius)))}projectPoint(e,t,i=this.agentRadius){return this._ensureCurrent(),this._projectPointInternal($e(e),$e(t),Math.max(0,$e(i,this.agentRadius)))}findPath(e,t,i,s,a={}){this._ensureCurrent();const r=Math.max(0,$e(a.radius,this.agentRadius)),o=this._normalizeAvoidPoints(a.avoidPoints,a.avoidRadius,a.avoidWeight),l=this._projectPointInternal($e(e),$e(t),r);if(!l)return[];const c=this._projectPointInternal($e(i),$e(s),r,l.component);if(!c||l.component!==c.component)return[];if(this._segmentClear(l.x,l.y,c.x,c.y,r)&&!this._segmentTouchesAvoidance(l.x,l.y,c.x,c.y,o))return this._dedupePath([l,c]);const h=this.walkable.length,u=new Float64Array(h);u.fill(Number.POSITIVE_INFINITY);const d=new Int32Array(h);d.fill(-1);const f=new Uint8Array(h),p=new Ws;u[l.index]=0;const v=this._heuristic(l.index,c.index);p.push({index:l.index,f:v,h:v});const g=Math.max(1,Math.floor($e(a.maxIterations,h*4)));let m=0,M=!1;const _=r<=this.agentRadius+jt;for(;p.size>0&&m++<g;){const P=p.pop();if(!P||f[P.index])continue;if(P.index===c.index){M=!0;break}f[P.index]=1;const C=P.index%this.cols,L=Math.floor(P.index/this.cols),z=_?this.neighborMask[P.index]:0;for(const U of yx){if(_&&!(z&U.bit))continue;const I=C+U.dx,B=L+U.dy;if(!_&&!this._cellInBounds(I,B))continue;const N=this._index(I,B);if(f[N])continue;if(!_){if(!this._cellWalkable(N,r))continue;if(U.dx!==0&&U.dy!==0){const q=this._index(C+U.dx,L),fe=this._index(C,L+U.dy);if(!this._cellWalkable(q,r)||!this._cellWalkable(fe,r))continue}const ue=this._pointForIndex(P.index),$=this._pointForIndex(N);if(!this._segmentClear(ue.x,ue.y,$.x,$.y,r))continue}const j=this._avoidanceCost(N,o);if(!Number.isFinite(j))continue;const te=u[P.index]+U.cost+j;if(te+jt>=u[N])continue;u[N]=te,d[N]=P.index;const se=this._heuristic(N,c.index);p.push({index:N,f:te+se,h:se})}}if(!M)return[];const x=[];let y=c.index;for(;y!==-1&&(x.push(y),y!==l.index);)y=d[y];if(x[x.length-1]!==l.index)return[];x.reverse();const E=[l];for(let P=1;P<x.length-1;P++)E.push(this._pointForIndex(x[P]));E.push(c);const A=a.smooth===!1?E:this._smoothPath(E,r,o),S=this._dedupePath(A);if(this._pathClear(S,r))return S;const w=this._dedupePath(E);return this._pathClear(w,r)?w:[]}choosePatrolPoint(e,t,i){this._ensureCurrent();const s=this._projectPointInternal($e(e),$e(t),this.agentRadius);if(!s)return null;let a=this.safePatrolPoints.filter(c=>c.component===s.component);const r=a.filter(c=>Math.hypot(c.x-s.x,c.y-s.y)>=this.cellSize*2);if(r.length>0&&(a=r),a.length===0)return{...s};const o=typeof i=="function"?$e(i(),0):Number.isFinite(Number(i))?Number(i):_x(s.x,s.y,this.obstacleRevision),l=Math.min(a.length-1,Math.floor(Ki(o,0,.999999999)*a.length));return{...a[l]}}findCoverPoint(e,t,i,s,a={}){this._ensureCurrent();const r=Math.max(0,$e(a.radius,this.agentRadius)),o=this._projectPointInternal($e(e),$e(t),r);if(!o)return null;const l=Math.max(this.cellSize,$e(a.maxDistance,650)),c=Math.max(0,$e(a.minThreatDistance,60)),h=Math.max(0,$e(a.preferredDistance,180)),u=a.claimed||[],d=Math.max(0,$e(a.claimRadius,this.cellSize*1.5)),f=[];for(const p of this.coverCandidates){if(p.component!==o.component||!this._pointClear(p.x,p.y,r)||this._coverClaimed(p,u,d))continue;const v=Math.hypot(p.x-o.x,p.y-o.y);if(v>l)continue;const g=Math.hypot(p.x-i,p.y-s);if(g<c)continue;const m=this.map.getLineIntersection({x:$e(i),y:$e(s)},{x:p.x,y:p.y});if(!m||m.dist>=g-Math.max(2,r*.35))continue;const M=v+Math.abs(g-h)*.18;f.push({candidate:p,score:M})}f.sort((p,v)=>p.score-v.score||p.candidate.index-v.candidate.index);for(const p of f.slice(0,16)){const v=this.findPath(o.x,o.y,p.candidate.x,p.candidate.y,{radius:r,smooth:a.smooth!==!1,avoidPoints:a.avoidPoints,avoidRadius:a.avoidRadius,avoidWeight:a.avoidWeight});if(v.length>0)return{...p.candidate,path:v}}return null}snapshot(){return this._ensureCurrent(),{cellSize:this.cellSize,agentRadius:this.agentRadius,cols:this.cols,rows:this.rows,obstacleRevision:this.obstacleRevision,componentCount:this.componentCount,memory:{walkable:this.walkable.slice(),components:this.components.slice(),neighborMask:this.neighborMask.slice()},rooms:this.rooms.map(e=>({...e})),connections:this.connections.map(e=>({...e,rooms:[...e.rooms]})),doorways:this.doorways.map(e=>({...e,rooms:[...e.rooms]})),deadEnds:this.deadEnds.map(e=>({...e})),deadEndRooms:[...this.deadEndRooms],spawns:this.spawns.map(e=>({...e})),safePatrolPoints:this.safePatrolPoints.map(e=>({...e})),coverCandidates:this.coverCandidates.map(e=>({...e}))}}_ensureCurrent(){(Number.isFinite(this.map.navigationRevision)?this.map.navigationRevision:0)!==this.obstacleRevision&&this.sync(this._spawnInputs)}_rebuild(){this.cols=Math.ceil(this.map.width/this.cellSize),this.rows=Math.ceil(this.map.height/this.cellSize);const e=this.cols*this.rows;this.walkable=new Uint8Array(e),this.components=new Int32Array(e),this.components.fill(-1),this.neighborMask=new Uint8Array(e),this.rooms=(this.map.rooms||[]).map((t,i)=>({index:i,x:t.x,y:t.y,w:t.w,h:t.h,name:t.name||`Room ${i+1}`,floor:t.floor||""}));for(let t=0;t<this.rows;t++)for(let i=0;i<this.cols;i++){const s=this._index(i,t),a=this._pointForCell(i,t);this._pointClear(a.x,a.y,this.agentRadius)&&(this.walkable[s]=1)}this._buildComponentsAndNeighbors(),this._inferConnections(),this._buildDeadEnds(),this._buildPatrolPoints(),this._buildCoverCandidates()}_pointClear(e,t,i){if(e<i||t<i||e>this.map.width-i||t>this.map.height-i)return!1;for(const s of this.map.walls||[])if(ul(e,t,i,s))return!1;return!0}_segmentClear(e,t,i,s,a){if(!this._pointClear(e,t,a)||!this._pointClear(i,s,a))return!1;for(const r of this.map.walls||[])if(Sx(e,t,i,s,a,r))return!1;return!0}_index(e,t){return t*this.cols+e}_cellInBounds(e,t){return e>=0&&t>=0&&e<this.cols&&t<this.rows}_pointForCell(e,t){return{x:Math.min(this.map.width-this.agentRadius,(e+.5)*this.cellSize),y:Math.min(this.map.height-this.agentRadius,(t+.5)*this.cellSize)}}_pointForIndex(e){const t=e%this.cols,i=Math.floor(e/this.cols);return{...this._pointForCell(t,i),index:e,column:t,row:i,component:this.components[e],projected:!0}}_cellWalkable(e,t=this.agentRadius){if(e<0||e>=this.walkable.length||!this.walkable[e])return!1;if(t<=this.agentRadius+jt)return!0;const i=this._pointForIndex(e);return this._pointClear(i.x,i.y,t)}_locateWalkableCell(e,t,i,s=null){const a=Ki(Math.floor(e/this.cellSize),0,this.cols-1),r=Ki(Math.floor(t/this.cellSize),0,this.rows-1),o=this._index(a,r);if(this._cellWalkable(o,i)&&(s==null||this.components[o]===s))return o;let l=-1,c=Number.POSITIVE_INFINITY;for(let h=0;h<this.walkable.length;h++){if(!this._cellWalkable(h,i)||s!=null&&this.components[h]!==s)continue;const u=this._pointForIndex(h),d=(u.x-e)**2+(u.y-t)**2;(d<c-jt||Math.abs(d-c)<=jt&&h<l)&&(c=d,l=h)}return l}_projectPointInternal(e,t,i,s=null){const a=this._pointClear(e,t,i),r=this._locateWalkableCell(e,t,i,s);if(r===-1)return null;const o=this._pointForIndex(r),l=Ki(Math.floor(e/this.cellSize),0,this.cols-1),c=Ki(Math.floor(t/this.cellSize),0,this.rows-1),h=this._index(l,c);return a&&r===h&&(s==null||o.component===s)&&this._segmentClear(o.x,o.y,e,t,i)?{...o,x:e,y:t,projected:!1}:{...o,projected:!0}}_buildComponentsAndNeighbors(){let e=0;const t=new Int32Array(this.walkable.length);for(let i=0;i<this.walkable.length;i++){if(!this.walkable[i]||this.components[i]!==-1)continue;let s=0,a=0;for(t[a++]=i,this.components[i]=e;s<a;){const r=t[s++],o=r%this.cols,l=Math.floor(r/this.cols),c=this._pointForIndex(r);for(const h of dl){const u=o+h.dx,d=l+h.dy;if(!this._cellInBounds(u,d))continue;const f=this._index(u,d);if(!this.walkable[f]||this.components[f]!==-1)continue;const p=this._pointForIndex(f);this._segmentClear(c.x,c.y,p.x,p.y,this.agentRadius)&&(this.components[f]=e,t[a++]=f)}}e++}this.componentCount=e;for(let i=0;i<this.walkable.length;i++){if(!this.walkable[i])continue;const s=i%this.cols,a=Math.floor(i/this.cols);let r=0;for(const o of dl){const l=s+o.dx,c=a+o.dy;if(!this._cellInBounds(l,c))continue;const h=this._index(l,c);if(this.walkable[h]){const u=this._pointForIndex(i),d=this._pointForIndex(h);this._segmentClear(u.x,u.y,d.x,d.y,this.agentRadius)&&(r|=o.bit)}}for(const o of xd){const l=s+o.dx,c=a+o.dy;if(!this._cellInBounds(l,c))continue;const h=this._index(l,c),u=this._index(s+o.dx,a),d=this._index(s,a+o.dy);if(this.walkable[h]&&this.walkable[u]&&this.walkable[d]){const f=this._pointForIndex(i),p=this._pointForIndex(h);this._segmentClear(f.x,f.y,p.x,p.y,this.agentRadius)&&(r|=o.bit)}}this.neighborMask[i]=r}}_inferConnections(){this.connections=[],this.doorways=[];const e=this.cellSize*1.5;for(let t=0;t<this.rooms.length;t++)for(let i=t+1;i<this.rooms.length;i++){const s=this.rooms[t],a=this.rooms[i];let r="",o=0,l=0,c=0,h=0,u=s,d=a;const f=s.x+s.w,p=a.x+a.w,v=s.y+s.h,g=a.y+a.h,m=Math.max(s.y,a.y),M=Math.min(v,g),_=Math.max(s.x,a.x),x=Math.min(f,p);if(M>m&&(f<=a.x&&a.x-f<=e?(r="vertical",o=f,l=a.x,c=m,h=M):p<=s.x&&s.x-p<=e&&(r="vertical",o=p,l=s.x,c=m,h=M,u=a,d=s)),!r&&x>_&&(v<=a.y&&a.y-v<=e?(r="horizontal",o=v,l=a.y,c=_,h=x):g<=s.y&&s.y-g<=e&&(r="horizontal",o=g,l=s.y,c=_,h=x,u=a,d=s)),!r)continue;const y=(o+l)*.5,E=[];for(const P of this.map.walls||[])if(P.material==="interior")if(r==="vertical"){if(y<P.x-jt||y>P.x+P.w+jt)continue;const C=Math.max(c,P.y),L=Math.min(h,P.y+P.h);L>C&&E.push([C,L])}else{if(y<P.y-jt||y>P.y+P.h+jt)continue;const C=Math.max(c,P.x),L=Math.min(h,P.x+P.w);L>C&&E.push([C,L])}const A=vx(E),S=[];let w=c;for(const[P,C]of A)P-w>=this.agentRadius*2+2&&S.push([w,P]),w=Math.max(w,C);h-w>=this.agentRadius*2+2&&S.push([w,h]);for(const[P,C]of S){const L=r==="vertical"?{x:y,y:(P+C)*.5}:{x:(P+C)*.5,y},z=this.agentRadius+3,U=r==="vertical"?{x:u.x+u.w-z,y:L.y}:{x:L.x,y:u.y+u.h-z},I=r==="vertical"?{x:d.x+z,y:L.y}:{x:L.x,y:d.y+z},B=this._pointClear(L.x,L.y,this.agentRadius)&&this._segmentClear(U.x,U.y,I.x,I.y,this.agentRadius),N={id:`door-${t}-${i}-${this.doorways.length}`,rooms:[t,i],orientation:r,x:L.x,y:L.y,width:C-P,thickness:l-o,gapStart:P,gapEnd:C,traversable:B,blocked:!B};this.doorways.push(N),this.connections.push({...N})}}}_buildDeadEnds(){this.deadEnds=[];for(let t=0;t<this.walkable.length;t++){if(!this.walkable[t])continue;const i=this.neighborMask[t]&15;ao(i)<=1&&this.deadEnds.push(this._pointForIndex(t))}const e=new Uint8Array(this.rooms.length);for(const t of this.connections)t.traversable&&(e[t.rooms[0]]++,e[t.rooms[1]]++);this.deadEndRooms=[...e].map((t,i)=>({degree:t,index:i})).filter(({degree:t})=>t<=1).map(({index:t})=>t)}_buildPatrolPoints(){this.safePatrolPoints=[];for(const e of this.rooms){const t=[];for(let s=0;s<this.walkable.length;s++){if(!this.walkable[s]||ao(this.neighborMask[s])<5)continue;const a=this._pointForIndex(s);if(a.x<e.x+this.agentRadius||a.x>e.x+e.w-this.agentRadius||a.y<e.y+this.agentRadius||a.y>e.y+e.h-this.agentRadius)continue;const r=Math.hypot(a.x-(e.x+e.w*.5),a.y-(e.y+e.h*.5));t.push({...a,roomIndex:e.index,centerDistance:r})}t.sort((s,a)=>s.centerDistance-a.centerDistance||s.index-a.index);const i=[];for(const s of t){if(i.every(a=>Math.hypot(a.x-s.x,a.y-s.y)>=this.cellSize*2.5)){const{centerDistance:a,...r}=s;i.push(r)}if(i.length>=6)break}if(i.length===0){const s=this._projectPointInternal(e.x+e.w*.5,e.y+e.h*.5,this.agentRadius);s&&i.push({...s,roomIndex:e.index})}this.safePatrolPoints.push(...i)}}_buildCoverCandidates(){const e=new Set,t=[],i=this.agentRadius+7;for(let s=0;s<(this.map.walls||[]).length;s++){const a=this.map.walls[s];for(const r of[.25,.5,.75]){const o=a.x+a.w*r,l=a.y+a.h*r,c=[{x:o,y:a.y-i,side:"north"},{x:o,y:a.y+a.h+i,side:"south"},{x:a.x-i,y:l,side:"west"},{x:a.x+a.w+i,y:l,side:"east"}];for(const h of c){if(!this._pointClear(h.x,h.y,this.agentRadius))continue;const u=this._locateWalkableCell(h.x,h.y,this.agentRadius);if(u===-1||e.has(u)||ao(this.neighborMask[u])<3)continue;e.add(u);const d=this._pointForIndex(u);if(t.push({...d,wallIndex:s,wallType:a.type||"wall",material:a.material||"",side:h.side}),t.length>=640)break}if(t.length>=640)break}if(t.length>=640)break}this.coverCandidates=t}_syncSpawns(){this.spawns=[];for(let e=0;e<this._spawnInputs.length;e++){const t=this._spawnInputs[e]||{},i=this._projectPointInternal($e(t.x),$e(t.y),this.agentRadius);i&&this.spawns.push({...t,index:t.index??e,x:i.x,y:i.y,cellIndex:i.index,component:i.component,projected:i.projected})}}_heuristic(e,t){const i=e%this.cols,s=Math.floor(e/this.cols),a=t%this.cols,r=Math.floor(t/this.cols),o=Math.abs(i-a),l=Math.abs(s-r);return Math.max(o,l)+(Math.SQRT2-1)*Math.min(o,l)}_smoothPath(e,t,i=[]){if(e.length<=2)return e;const s=[e[0]];let a=0;for(;a<e.length-1;){let r=a+1;for(let o=e.length-1;o>a+1;o--)if(this._segmentClear(e[a].x,e[a].y,e[o].x,e[o].y,t)&&!this._segmentTouchesAvoidance(e[a].x,e[a].y,e[o].x,e[o].y,i)){r=o;break}s.push(e[r]),a=r}return s}_dedupePath(e){const t=[];for(const i of e){const s=t[t.length-1];s&&Math.hypot(s.x-i.x,s.y-i.y)<jt||t.push({...i})}return t}_pathClear(e,t){for(let i=1;i<e.length;i++)if(!this._segmentClear(e[i-1].x,e[i-1].y,e[i].x,e[i].y,t))return!1;return!0}_normalizeAvoidPoints(e,t,i){if(!Array.isArray(e))return[];const s=Math.max(1,$e(t,this.cellSize*1.35)),a=Math.max(0,$e(i,12));return e.filter(r=>r&&Number.isFinite(Number(r.x))&&Number.isFinite(Number(r.y))).map(r=>({x:Number(r.x),y:Number(r.y),radius:Math.max(1,$e(r.radius,s)),weight:Math.max(0,$e(r.weight,a)),hard:r.hard===!0}))}_avoidanceCost(e,t){if(t.length===0)return 0;const i=this._pointForIndex(e);let s=0;for(const a of t){const r=Math.hypot(i.x-a.x,i.y-a.y);if(!(r>=a.radius)){if(a.hard)return Number.POSITIVE_INFINITY;s+=(1-r/a.radius)*a.weight}}return s}_segmentTouchesAvoidance(e,t,i,s,a){return a.some(r=>vd(r.x,r.y,e,t,i,s)<r.radius)}_coverClaimed(e,t,i){if(t instanceof Set){if(t.has(e.index)||t.has(String(e.index))||t.has(`${e.x},${e.y}`))return!0;for(const s of t)if(s&&typeof s=="object"&&Number.isFinite(Number(s.x))&&Number.isFinite(Number(s.y))&&Math.hypot(e.x-Number(s.x),e.y-Number(s.y))<i)return!0;return!1}return Array.isArray(t)?t.some(s=>Number(s)===e.index?!0:s&&Number.isFinite(Number(s.x))&&Number.isFinite(Number(s.y))&&Math.hypot(e.x-Number(s.x),e.y-Number(s.y))<i):!1}}function bx(n,e){if(!n||typeof n!="object"&&typeof n!="function")throw new TypeError("getBotNavigation requires a map object");let t=yh.get(n);return t?t.sync(e):(t=new Mx(n,e),yh.set(n,t)),t}class xh{constructor(e,t,i,s,a){this.x=e,this.y=t,this.vx=i,this.vy=s,this.throwerId=a,this.radius=6,this.friction=.98,this.bounceFriction=.6,this.timer=1200,this.creationTime=performance.now(),this.active=!0}update(e,t){if(t-this.creationTime>=this.timer){this.active=!1;return}this.vx*=this.friction,this.vy*=this.friction;const s=this.x+this.vx,a=this.y+this.vy,r=e.checkCircleCollision(s,a,this.radius);if(r.x!==s||r.y!==a){const o=e.checkCircleCollision(s,this.y,this.radius),l=e.checkCircleCollision(this.x,a,this.radius);o.x!==s&&(this.vx=-this.vx*this.bounceFriction),l.y!==a&&(this.vy=-this.vy*this.bounceFriction),this.x=r.x,this.y=r.y}else this.x=s,this.y=a}draw(e){e.save(),e.beginPath(),e.arc(this.x,this.y,this.radius,0,Math.PI*2),e.fillStyle="#2d332f",e.strokeStyle="#66fcf1",e.lineWidth=1.5,e.fill(),e.stroke(),Math.floor(performance.now()/150)%2===0&&(e.beginPath(),e.arc(this.x,this.y,2,0,Math.PI*2),e.fillStyle="#ff3c3c",e.fill()),e.restore()}}class Za{constructor(e,t){try{this.canvas=document.getElementById(e),this.ctx=this.canvas.getContext("2d"),this.mode=t.mode,this.socket=t.socket,this.isRanked=!!t.isRanked,this.mapWidth=t.mapId==="arena"?900:1400,this.mapHeight=t.mapId==="arena"?900:1400,this.map=new dx(this.mapWidth,this.mapHeight,t.seed,t.mapId),this.sound=new fx,this.sound.setVolume(t.settings.volume!==void 0?t.settings.volume:.5),this.particles=new ux,this.particles.setBloodEnabled(t.settings.blood);let i=!1;const s=t.matchMode||t.mode||"";if(this.matchMode=s,this.qpRenderStyle=t.qpRenderStyle,this.isRanked?s.includes("competitive")&&(i=!0):t.qpRenderStyle==="competitive"&&(i=!0),this.settings={...t.settings},this.matchMode==="sabotage"?(this.settings.performanceMode=!1,this.settings.shadows=!0):i?(this.settings.performanceMode=!0,this.settings.shadows=!1):(this.settings.performanceMode=!1,this.settings.shadows=!0),gn.init().catch(r=>console.warn("[Engine] CharacterRenderer init failed:",r)),window.LocalPlayerId=t.localPlayerId,window.IsOfflineMode=this.mode==="offline",this.spawns=[{x:150,y:150},{x:this.mapWidth-150,y:this.mapHeight-150},{x:150,y:this.mapHeight-150},{x:this.mapWidth-150,y:150}],this.botNavigation=null,this.players=[],this.localPlayer=null,this.remotePlayers=new Map,(t.players||[{id:t.localPlayerId,name:t.localPlayerName,weapon:t.localWeapon,color:t.localColor}]).forEach((r,o)=>{const l=this.spawns[o%this.spawns.length],c=r.id===t.localPlayerId,h=o%2===0?1:2,u=this.mode==="offline"&&!c,d=new hx(r.id,l.x,l.y,r.name,r.weapon||"pistol",r.color||"cyan",c,u);if(d.team=h,c)this.localPlayer=d,this.localPlayerIndex=o;else{const f=t.localPlayerIndex!==void 0?t.localPlayerIndex:0;d.isTeammate=o%2===f%2,this.remotePlayers.set(r.id,d)}this.players.push(d)}),this.botBlackboards=dh(this.players,performance.now()),this.bullets=[],this.grenades=[],this.activeHitmarkers=[],this.floatingNumbers=[],this.replayFrames=[],this.lastSnapshotTime=0,this.devCheatActive=!1,this.vents=[],this.tasks=[],this.activeTask=null,this.ventCooldown=0,this.currentVent=null,this.sweepAngle=0,this.sweepProgress=0,this.network=null,this.mode==="online"&&(this.network=new px(this.socket,this.localPlayer,null,this.map,this.particles,this.sound,this),this.socket.on("opponent-throw-grenade",r=>{const o=new xh(r.x,r.y,r.vx,r.vy,r.playerId);this.grenades.push(o);const l=Math.hypot(this.localPlayer.x-r.x,this.localPlayer.y-r.y);this.sound.playMetallicClick(0,1500,.08,.2,l)})),window.MatchStats={roundsWon:0,damageDealt:0,shotsFired:0,accuracy:0,hitsRegistered:0},this.onMatchEnd=t.onMatchEnd,this.onKillFeed=t.onKillFeed,this.lastKillTime=0,this.multiKillCount=0,this.combatBanner=null,this.camera={x:this.localPlayer.x,y:this.localPlayer.y,shakeX:0,shakeY:0},this.cameraShake=0,this.zoom=1,this.gameState="warmup",this.roundNumber=1,this.scoreSelf=0,this.scoreOpponent=0,this.countdownTimer=3,this.matchTime=120,this.lastTime=performance.now(),this.roundStartTime=0,this.countdownStart=0,this.matchTimerInterval=null,window.gameEngine=this,this.fpsFrameCount=0,this.fpsLastTick=performance.now(),this.currentFPS=0,this.keys={},this.mouse={x:0,y:0,gameX:0,gameY:0,angle:0,clicked:!1,buttons:{}},this.lastSprintTime=performance.now(),this.sprintTipVisible=!1,this.zone={active:!1,currentRadius:0,targetRadius:0,centerX:this.mapWidth/2,centerY:this.mapHeight/2,shrinkSpeed:0,damage:20,lastDamageTick:0,warnShown:!1},this.zoneTimer=null,this.resizeCanvas(),this.setupControls(),this.startRoundCycle(),this.active=!0,this.loop(),this.localPlayer.updateHUD(),this.updateScoreboardHUD(),this.matchMode==="sabotage"){const r=document.querySelector(".score-display");r&&(r.style.display="none");const o=document.querySelector(".timer-display");o&&(o.style.display="none");const l=document.querySelector(".bars-container.right-aligned");l&&(l.style.display="none");const c=document.querySelector(".opponent-weapon-display");c&&(c.style.display="none");const h=document.querySelector(".ammo-display");h&&(h.style.display="none");const u=document.querySelector(".inventory-display");u&&(u.style.display="none")}this.mode==="offline"&&(window.OnBotShootCallback=r=>{const o=this.players.find(l=>l.id===r.playerId);o&&this.particles.spawnGunCasing(o.x,o.y,o.angle,r.weaponKey),this.spawnBulletFromNetwork(r)})}catch(i){console.error("Engine Constructor Error:",i);try{const s=document.getElementById(e),a=s.getContext("2d");a.fillStyle="rgba(10, 10, 15, 0.95)",a.fillRect(0,0,s.width,s.height),a.fillStyle="#ff3c3c",a.font="bold 20px monospace",a.fillText("TACTICSTRIKE CONSTRUCTOR ERROR DETECTED",20,50),a.fillStyle="#ffffff",a.font="12px monospace";const r=(i.stack||i.toString()).split(`
`);let o=90;r.forEach(l=>{a.fillText(l,20,o),o+=18})}catch{}throw i}}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}setupControls(){this.resizeHandler=()=>this.resizeCanvas(),window.addEventListener("resize",this.resizeHandler),this.keydownHandler=s=>{const a=document.getElementById("chat-input");if(a&&document.activeElement===a)return;if(this.activeMinigame){s.preventDefault(),s.key==="Escape"?this.cancelHackingMinigame():this.handleMinigameKeyPress(s.key.toLowerCase());return}const r=s.key.toLowerCase()==="i",o=s.key==="9";if(r&&this.keys[9]||o&&this.keys.i){this.devCheatActive=!this.devCheatActive,this.devCheatActive&&this.localPlayer?(this.localPlayer.maxHealth=200,this.localPlayer.health=200):this.localPlayer&&(this.localPlayer.maxHealth=100,this.localPlayer.health>100&&(this.localPlayer.health=100));return}if(this.matchMode==="sabotage"&&this.localPlayer&&this.localPlayer.health>0){if(this.localPlayer.inVent&&this.currentVent){if(s.key>="1"&&s.key<="5"){s.preventDefault();const l=parseInt(s.key)-1,c=this.vents[l];if(c&&c.id!==this.currentVent.id){this.localPlayer.x=c.x,this.localPlayer.y=c.y,this.currentVent=c;try{this.sound.playFrictionalScrape(0,.3,.4)}catch{}}}else if(s.key===" "||s.key==="Spacebar"){s.preventDefault(),this.localPlayer.inVent=!1,this.currentVent=null;try{this.sound.playFrictionalScrape(0,.2,.3)}catch{}}return}if(this.activeTask){if(s.key===" "||s.key==="Spacebar"){s.preventDefault();const l=Math.abs(Math.sin(this.sweepAngle));if(l>=.4&&l<=.6){this.sweepProgress=Math.min(100,this.sweepProgress+20);try{this.sound.playMetallicClick(0,2e3,.08,.35)}catch{}if(this.sweepProgress>=100){const c=this.activeTask;c.status="completed",c.alarmActive=!0,c.alarmTimer=15,this.activeTask=null,this.localPlayer.showTextNotification("TASK COMPLETE! 🚨 ALARM TRIGGERED");const h=Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y);try{this.sound.playAlarmForTask(c.id,h)}catch{}if(this.matchMode==="sabotage"&&this.tasks.every(d=>d.status==="completed")){if(this.mode==="offline")this.endRound(1,"tasks completed");else if(this.localPlayer.team===1&&this.socket){const d=this.players.find(f=>f.team===2);d&&this.socket.emit("player-died",{winnerId:this.localPlayer.id,winnerName:this.localPlayer.name,loserId:d.id,roundNumber:this.roundNumber})}}}}else{this.sweepProgress=Math.max(0,this.sweepProgress-10);try{this.sound.playMetallicClick(0,500,.15,.25)}catch{}}}else(s.key==="Escape"||s.key.toLowerCase()==="f")&&this.activeTask&&(this.activeTask.status="pending",this.activeTask=null);return}if(s.key.toLowerCase()==="e"){const l=this.vents.find(c=>Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y)<50);if(l){if(this.ventCooldown>0)this.localPlayer.showTextNotification(`VENT COOLDOWN: ${this.ventCooldown.toFixed(1)}s`);else{this.localPlayer.inVent=!0,this.currentVent=l,this.ventCooldown=10;try{this.sound.playFrictionalScrape(0,.2,.35)}catch{}}return}}if(s.key.toLowerCase()==="f"){const l=this.tasks.find(c=>c.status==="pending"&&Math.hypot(this.localPlayer.x-c.x,this.localPlayer.y-c.y)<40);if(l){this.activeTask=l,l.status="doing",this.sweepProgress=0,this.sweepAngle=0;return}}}if(s.key===" "&&s.preventDefault(),this.keys[s.key.toLowerCase()]=!0,s.key.toLowerCase()==="f"&&this.localPlayer&&this.localPlayer.health>0){this.localPlayer.flashlightActive=!this.localPlayer.flashlightActive;try{this.sound.playMetallicClick(0,1800,.05,.15)}catch{}}if(this.localPlayer&&this.localPlayer.health>0){if(s.key.toLowerCase()==="h"&&this.localPlayer.healthPacks>0){this.localPlayer.healthPacks--;const l=this.spawnItemAt(this.localPlayer.x,this.localPlayer.y,"health");this.localPlayer.showTextNotification("DROPPED HEALTH PACK","#ff6ef7"),this.localPlayer.updateHUD(),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:l,x:this.localPlayer.x,y:this.localPlayer.y,type:"health"})}if(s.key.toLowerCase()==="j"&&this.localPlayer.ammoPacks>0){this.localPlayer.ammoPacks--;const l=this.spawnItemAt(this.localPlayer.x,this.localPlayer.y,"ammo");this.localPlayer.showTextNotification("DROPPED AMMO PACK","#ff6ef7"),this.localPlayer.updateHUD(),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:l,x:this.localPlayer.x,y:this.localPlayer.y,type:"ammo"})}}s.key==="1"&&this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(1),s.key==="2"&&this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(2),s.key==="3"&&this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)},this.keyupHandler=s=>{this.keys[s.key.toLowerCase()]=!1},window.addEventListener("keydown",this.keydownHandler),window.addEventListener("keyup",this.keyupHandler),this.mousemoveHandler=s=>{if(this.mouse.x=s.clientX,this.mouse.y=s.clientY,this.firstPersonMode)this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.angle+=s.movementX*.0025);else{const a=this.mouse.x-this.canvas.width/2,r=this.mouse.y-this.canvas.height/2;this.mouse.angle=Math.atan2(r,a)}},this.mousedownHandler=s=>{if(this.mouse.buttons[s.button]=!0,s.button===0){const o=document.getElementById("chat-input");if(o&&document.activeElement===o||s.target.closest("#btn-game-menu")||s.target.closest(".inv-slot")||s.target.closest("button")||s.target.closest("input")||s.target.closest(".inventory-display"))return;this.mouse.clicked=!0,this.firstPersonMode&&(document.pointerLockElement===document.getElementById("game-container")||this.requestPointerLock())}const a=s.button===1,r=s.button===2;(a&&this.mouse.buttons[2]||r&&this.mouse.buttons[1])&&(this.devCheatActive=!this.devCheatActive,this.devCheatActive&&this.localPlayer?(this.localPlayer.maxHealth=200,this.localPlayer.health=200):this.localPlayer&&(this.localPlayer.maxHealth=100,this.localPlayer.health>100&&(this.localPlayer.health=100)))},this.mouseupHandler=s=>{this.mouse.buttons[s.button]=!1,s.button===0&&(this.mouse.clicked=!1)},this.wheelHandler=s=>{const a=document.getElementById("chat-input");a&&document.activeElement===a||this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)},window.addEventListener("mousemove",this.mousemoveHandler),window.addEventListener("mousedown",this.mousedownHandler),window.addEventListener("mouseup",this.mouseupHandler),window.addEventListener("wheel",this.wheelHandler,{passive:!0}),this.contextmenuHandler=s=>{s.preventDefault()},window.addEventListener("contextmenu",this.contextmenuHandler),this.invSlot1Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(1)},this.invSlot2Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.switchSlot(2)},this.invSlot3Handler=()=>{this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.throwFlashbangRequest=!0)};const e=document.getElementById("inv-slot-1"),t=document.getElementById("inv-slot-2"),i=document.getElementById("inv-slot-3");e&&e.addEventListener("click",this.invSlot1Handler),t&&t.addEventListener("click",this.invSlot2Handler),i&&i.addEventListener("click",this.invSlot3Handler),this.setupGamepad(),this.pointerLockChangeHandler=()=>{const s=document.pointerLockElement===document.getElementById("game-container"),a=this.matchMode&&this.matchMode.startsWith("firstperson");!s&&this.firstPersonMode&&!a&&this.toggleFirstPersonMode()},document.addEventListener("pointerlockchange",this.pointerLockChangeHandler)}setupGamepad(){this._gpState={prevButtons:[],deadzone:.18,aimAngle:0,aimActive:!1,frameCount:0,cachedGP:null}}pollGamepad(){if(!navigator.getGamepads)return;const e=this._gpState;if(e.frameCount++,e.frameCount%2===0){const d=navigator.getGamepads();e.cachedGP=null;for(let f=0;f<d.length;f++)if(d[f]){e.cachedGP=d[f];break}}const t=e.cachedGP;if(!t||!this.localPlayer||this.localPlayer.health<=0)return;const i=e.deadzone,s=d=>t.buttons[d],a=d=>!!(s(d)&&s(d).pressed),r=d=>s(d)?s(d).value:0,o=d=>!!e.prevButtons[d],l=Math.abs(t.axes[0])>i?t.axes[0]:0,c=Math.abs(t.axes[1])>i?t.axes[1]:0;this.keys.w=c<-i,this.keys.s=c>i,this.keys.a=l<-i,this.keys.d=l>i,this.keys.shift=a(10);const h=Math.abs(t.axes[2])>i?t.axes[2]:0,u=Math.abs(t.axes[3])>i?t.axes[3]:0;if(Math.hypot(h,u)>i?(e.aimAngle=Math.atan2(u,h),e.aimActive=!0):e.aimActive=!1,e.aimActive&&(this.mouse.angle=e.aimAngle,this.localPlayer.angle=e.aimAngle),this.mouse.clicked=r(7)>.3,a(4)&&!o(4)&&this.localPlayer.switchSlot(1),a(5)&&!o(5)&&this.localPlayer.switchSlot(2),a(1)&&!o(1)&&(this.keys.r=!0,setTimeout(()=>{this.keys.r=!1},80)),this.keys[" "]=a(0),a(3)&&!o(3)){this.localPlayer.flashlightActive=!this.localPlayer.flashlightActive;try{this.sound.playMetallicClick(0,1800,.05,.15)}catch{}}a(2)&&!o(2)&&this.localPlayer.flashGrenades>0&&(this.localPlayer.throwFlashbangRequest=!0),e.prevButtons=Array.from(t.buttons).map(d=>!!(d&&d.pressed))}toggleFirstPersonMode(){if(this.matchMode&&this.matchMode.startsWith("firstperson")&&this.firstPersonMode){const s=document.getElementById("btn-toggle-fpm");s&&(s.style.display="none");const a=document.getElementById("game-canvas-3d");a&&(a.style.display="block",this.firstPersonController&&this.firstPersonController.onResize()),this.firstPersonController.active=!0,this.requestPointerLock();return}this.firstPersonMode=!this.firstPersonMode;const t=document.getElementById("btn-toggle-fpm"),i=document.getElementById("game-canvas-3d");this.firstPersonMode?(t&&t.classList.add("active"),i&&(i.style.display="block"),this.firstPersonController.active=!0,this.firstPersonController&&this.firstPersonController.onResize(),this.requestPointerLock()):(t&&t.classList.remove("active"),i&&(i.style.display="none"),this.firstPersonController.active=!1,this.exitPointerLock())}requestPointerLock(){const e=document.getElementById("game-container");e&&e.requestPointerLock&&e.requestPointerLock()}exitPointerLock(){document.exitPointerLock&&document.exitPointerLock()}destroy(){this.active=!1,window.removeEventListener("resize",this.resizeHandler),window.removeEventListener("keydown",this.keydownHandler),window.removeEventListener("keyup",this.keyupHandler),window.removeEventListener("mousemove",this.mousemoveHandler),window.removeEventListener("mousedown",this.mousedownHandler),window.removeEventListener("mouseup",this.mouseupHandler),window.removeEventListener("wheel",this.wheelHandler),window.removeEventListener("contextmenu",this.contextmenuHandler);const e=document.getElementById("inv-slot-1"),t=document.getElementById("inv-slot-2"),i=document.getElementById("inv-slot-3");if(e&&this.invSlot1Handler&&e.removeEventListener("click",this.invSlot1Handler),t&&this.invSlot2Handler&&t.removeEventListener("click",this.invSlot2Handler),i&&this.invSlot3Handler&&i.removeEventListener("click",this.invSlot3Handler),this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.zoneTimer&&(clearTimeout(this.zoneTimer),this.zoneTimer=null),this.sound){try{this.sound.stopAllAlarms()}catch{}try{this.sound.stopBearMusic()}catch{}}this.network&&this.network.destroy();const s=document.querySelector(".score-display");s&&(s.style.display="");const a=document.querySelector(".timer-display");a&&(a.style.display="");const r=document.querySelector(".bars-container.right-aligned");r&&(r.style.display="");const o=document.querySelector(".opponent-weapon-display");o&&(o.style.display="");const l=document.querySelector(".ammo-display");l&&(l.style.display="");const c=document.querySelector(".inventory-display");c&&(c.style.display=""),this.socket&&this.socket.off("opponent-throw-grenade"),this.particles.clear(),window.OnBotShootCallback=null,window.AppSocket=null}updateSettings(e){this.sound&&this.sound.setVolume(e.volume),this.particles&&this.particles.setBloodEnabled(e.blood);let t=!1;const i=this.matchMode||this.mode||"";this.isRanked?i.includes("competitive")&&(t=!0):this.qpRenderStyle==="competitive"&&(t=!0),this.settings={...e},this.matchMode==="sabotage"?(this.settings.performanceMode=!1,this.settings.shadows=!0):t?(this.settings.performanceMode=!0,this.settings.shadows=!1):(this.settings.performanceMode=!1,this.settings.shadows=!0)}shakeCamera(e){this.cameraShake=Math.max(this.cameraShake,e)}spawnBulletFromNetwork(e){if(e.pellets&&e.pellets>1)for(let t=0;t<e.pellets;t++)this.bullets.push(new Ra(e));else this.bullets.push(new Ra(e))}startRoundCycle(){if(this.gameState="countdown",this.countdownTimer=3,this.countdownStart=performance.now(),this.map.generateMap(),this.mode==="offline"&&(this.botNavigation=bx(this.map,this.spawns)),this.botBlackboards=dh(this.players,this.countdownStart),this.matchMode==="sabotage"){this.vents=[{id:"vent_a",x:180,y:180,name:"North-West Vent"},{id:"vent_b",x:this.mapWidth-180,y:180,name:"North-East Vent"},{id:"vent_c",x:180,y:this.mapHeight-180,name:"South-West Vent"},{id:"vent_d",x:this.mapWidth-180,y:this.mapHeight-180,name:"South-East Vent"},{id:"vent_e",x:700,y:700,name:"Central Vent"}],this.ventCooldown=0,this.currentVent=null,this.activeTask=null,this.localPlayer&&(this.localPlayer.inVent=!1,this.localPlayer.weaponKey="none");const f=[];for(let m=0;m<9;m++){const M=this.map.rooms[m];M&&f.push({name:M.name||`Section ${m+1}`,x:Math.round(M.x+M.w/2),y:Math.round(M.y+M.h/2)})}f.push({name:"Central Corridors",x:700,y:700});const v=[...f].sort(()=>Math.random()-.5).slice(0,5),g=["Fix Wiring","Calibrate Core","Download Files","Clear Vent Filters","Stabilize Energy Grid","Align Antenna","Unlock Console","Refuel Engine","Inspect Sample","Reset Breakways"];this.tasks=v.map((m,M)=>({id:`task_r${this.roundNumber}_${M}`,x:m.x,y:m.y,name:g[M%g.length]+` in ${m.name}`,rawName:g[M%g.length],progress:0,targetProgress:100,status:"pending",alarmActive:!1,alarmTimer:0}))}this.lastSprintTime=performance.now(),this.sprintTipVisible=!1;const e=document.getElementById("sprint-tip-popup");e&&(e.style.display="none");const t=(this.map.seed||"default_seed")+"_"+this.roundNumber;let i=0;for(let f=0;f<t.length;f++)i=(i<<5)-i+t.charCodeAt(f),i|=0;const s=()=>(i=i*1664525+1013904223|0,(i>>>0)/4294967296),a={1:[this.spawns[0],this.spawns[2]],2:[this.spawns[1],this.spawns[3]]},r=s()<.5?0:1,o=s()<.5?0:1,l=ix(this.players,a,{1:r,2:o}),c=[],h=new Map;this.players.forEach(f=>{const p=l.get(String(f.id))||this.spawns[0];let v=p;if(this.botNavigation&&(v=nx(this.botNavigation,p,c,f.radius||18)||this.botNavigation.choosePatrolPoint(p.x,p.y,s)||this.botNavigation.projectPoint(p.x,p.y,f.radius||18)||p),c.push({x:v.x,y:v.y}),f.x=v.x,f.y=v.y,f.vx=0,f.vy=0,f.health=f.isLocal&&this.devCheatActive?200:100,f.ammoInMag=f.weapon.magSize,f.reserveAmmo=f.weapon.magSize*3,f.isReloading=!1,f.floatingText=null,f.isDeadLogged=!1,f.flashGrenades=1,f.flashAlpha=0,f.isBot){const g=h.get(f.team)||0;h.set(f.team,g+1),f.botLaneIndex=g,f.botLaneSign=g%2===0?-1:1,f.resetBotRound(this.map,this.botNavigation)}}),this.bullets=[],this.grenades=[],this.particles.clear(),this.localPlayer.updateHUD(),this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchTime=120;const u=document.getElementById("hud-status");u&&(u.innerText=`ROUND ${this.roundNumber} - COOLDOWN`),this.zoneTimer&&(clearTimeout(this.zoneTimer),this.zoneTimer=null);const d=Math.max(this.mapWidth,this.mapHeight)/2;this.zone.active=!1,this.zone.currentRadius=d*1.05,this.zone.targetRadius=d*1.05,this.zone.centerX=this.mapWidth/2,this.zone.centerY=this.mapHeight/2,this.zone.shrinkSpeed=0,this.zone.lastDamageTick=0,this.zone.warnShown=!1;try{this.sound.playFrictionalScrape(0,.5,.1)}catch{}}startRoundAction(){if(this.gameState="playing",this.roundStartTime=performance.now(),this.matchMode==="sabotage")try{this.sound.playBearMusic()}catch{}const e=document.getElementById("hud-status");e&&(e.innerText="ENGAGE TARGET"),this.matchMode!=="sabotage"&&(this.matchTimerInterval=setInterval(()=>{if(this.gameState==="playing"){this.matchTime--,this.matchTime<=0&&(this.matchTime=0,this.endRound(null,"TIME EXPIRED"));const t=Math.floor(this.matchTime/60).toString().padStart(2,"0"),i=(this.matchTime%60).toString().padStart(2,"0"),s=document.getElementById("game-timer");s&&(s.innerText=`${t}:${i}`)}},1e3)),this.matchMode!=="sabotage"&&(this.zoneTimer&&clearTimeout(this.zoneTimer),this.zoneTimer=setTimeout(()=>{if(this.gameState!=="playing")return;const t=Math.max(this.mapWidth,this.mapHeight)/2;this.zone.active=!0,this.zone.currentRadius=t*1.05,this.zone.targetRadius=t*.12,this.zone.shrinkSpeed=(this.zone.currentRadius-this.zone.targetRadius)/(60*60),this.zone.lastDamageTick=performance.now(),this.zone.centerX=this.mapWidth/2,this.zone.centerY=this.mapHeight/2;const i=document.getElementById("hud-status");i&&(i.innerText="⚠ ZONE CLOSING IN!",i.style.color="#ff3c3c",setTimeout(()=>{this.gameState==="playing"&&i&&(i.innerText="ENGAGE TARGET",i.style.color="")},2500))},4e4))}endRound(e,t=""){if(this.gameState!=="playing")return;if(this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchMode==="sabotage")try{this.sound.stopBearMusic()}catch{}let i=document.getElementById("hud-status");const s=this.localPlayer.team;e===s?(this.scoreSelf++,this.matchMode==="sabotage"&&(this.scoreSelf=3),i&&(i.innerText="ROUND WON",i.style.color="#39ff14")):e!==null?(this.scoreOpponent++,this.matchMode==="sabotage"&&(this.scoreOpponent=3),i&&(i.innerText="ROUND LOST",i.style.color="#ff3c3c")):i&&(i.innerText="ROUND DRAW",i.style.color="#ffd700"),this.updateScoreboardHUD();const a=()=>{this.scoreSelf>=3||this.scoreOpponent>=3?this.endMatch():(this.roundNumber++,this.startRoundCycle())};setTimeout(()=>{this.active&&this.startReplay(a)},0)}endMatch(){this.gameState="match-over",this.active=!1;const e=window.MatchStats.shotsFired||1,t=window.MatchStats.hitsRegistered/e*100;window.MatchStats.accuracy=t,window.MatchStats.roundsWon=this.scoreSelf;const i=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent?this.localPlayer.team:this.localPlayer.team===1?2:1:this.scoreSelf>=3?this.localPlayer.team:this.localPlayer.team===1?2:1,s=this.players.find(c=>c.team===i);window.MatchStats.winnerId=s?s.id:"unknown";const a=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent:this.scoreSelf>=3,r=this.localPlayer.rank?this.localPlayer.rank.label:"";let o=!1,l=0;this.isRanked&&(o=this.localPlayer.applyRankDelta(a?wa:Aa),l=a?wa:Aa),window.MatchStats.isWin=a,window.MatchStats.newRP=this.localPlayer.rp,window.MatchStats.newRank=this.localPlayer.rank,window.MatchStats.rpDelta=l,window.MatchStats.rankChanged=o,window.MatchStats.oldRankLabel=r,this.scoreSelf>=3?this.sound.playMatchWin():this.sound.playMatchLose(),this.onMatchEnd&&this.onMatchEnd(window.MatchStats)}endGameDueToDisconnect(e){this.gameState="match-over",this.active=!1,alert(e);const t=document.getElementById("btn-return-lobby");t&&t.click()}updateScoreboardHUD(){const e=document.getElementById("score-self");e&&(e.innerText=this.scoreSelf);const t=document.getElementById("score-opponent");t&&(t.innerText=this.scoreOpponent);const i=document.getElementById("hud-self-name");i&&(i.innerText=this.mode==="online"&&this.players.length>2?"YOUR TEAM":this.localPlayer.name.toUpperCase());const s=document.getElementById("hud-opponent-name");s&&(s.innerText=this.players.length>2?"OPPONENTS":"OPPONENT");const a=document.getElementById("hud-opponent-weapon");if(a)if(this.players.length>2)a.innerText="SQUAD LOADOUT";else{const o=this.players.find(l=>l.id!==this.localPlayer.id);a.innerText=o?o.weapon.name.toUpperCase():"UNKNOWN"}const r=document.getElementById("opponent-indicator");r&&(r.className="op-indicator online")}drawErrorOverlay(e){try{this.ctx.restore()}catch{}this.ctx.fillStyle="rgba(10, 10, 15, 0.95)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="#ff3c3c",this.ctx.font="bold 20px monospace",this.ctx.fillText("TACTICSTRIKE RUNTIME ERROR DETECTED",20,50),this.ctx.fillStyle="#ffffff",this.ctx.font="12px monospace";const t=(e.stack||e.toString()).split(`
`);let i=90;t.forEach(s=>{const a=Math.floor((this.canvas.width-40)/7);for(let r=0;r<s.length;r+=a)this.ctx.fillText(s.substring(r,r+a),20,i),i+=18})}loop(){if(!this.active)return;const e=performance.now();if(this.lastTime=e,this.fpsFrameCount++,e-this.fpsLastTick>=1e3){this.currentFPS=Math.round(this.fpsFrameCount*1e3/(e-this.fpsLastTick)),this.fpsFrameCount=0,this.fpsLastTick=e;const t=document.getElementById("fps-counter");t&&this.settings&&this.settings.showFps&&(t.innerText=`FPS: ${this.currentFPS}`)}try{this.update(e),this.render()}catch(t){console.error("Game Loop Crash:",t),this.drawErrorOverlay(t),this.active=!1;return}requestAnimationFrame(()=>this.loop())}triggerHitmarker(e,t,i,s){this.activeHitmarkers.push({x:e,y:t,age:0,duration:200,isHeadshot:!!s}),this.floatingNumbers.push({x:e,y:t-10,damage:i,age:0,duration:800,isHeadshot:!!s})}registerLocalPlayerKill(e){if(e-this.lastKillTime<4e3?this.multiKillCount++:this.multiKillCount=1,this.lastKillTime=e,this.multiKillCount>=2){let t="DOUBLE KILL!";if(this.multiKillCount===3?t="TRIPLE KILL!":this.multiKillCount>3&&(t="RAMPAGE!"),this.combatBanner={text:t,timer:3,scale:2},this.sound)try{this.sound.playHighBeep()}catch(i){console.warn(i)}}}update(e){this.lastUpdateTime||(this.lastUpdateTime=e);const t=e-this.lastUpdateTime;this.lastUpdateTime=e;const i=Math.max(1,Math.min(150,t));if(this.dtFactor=i/16.67,this.combatBanner&&(this.combatBanner.timer-=i/1e3,this.combatBanner.timer<=0&&(this.combatBanner=null)),this.activeMinigame){this.activeMinigame.timer-=i/1e3;const _=document.getElementById("minigame-timer-bar");_&&(_.style.width=`${Math.max(0,this.activeMinigame.timer/4*100)}%`),this.activeMinigame.timer<=0&&this.failHackingMinigame()}let s=null;this.map&&this.map.terminals&&this.localPlayer&&this.localPlayer.health>0&&(s=this.map.terminals.find(_=>!_.hacked&&Math.hypot(this.localPlayer.x-_.x,this.localPlayer.y-_.y)<55));const a=document.getElementById("hud-interaction-prompt");if(s&&this.gameState==="playing"?(a&&(a.style.display="block",a.innerText=this.keys.e?`HACKING... ${Math.round(this.hackingProgress)}%`:"HOLD [E] TO HACK TERMINAL"),this.keys.e&&!this.activeMinigame?(this.localPlayer.vx=0,this.localPlayer.vy=0,this.hackingProgress||(this.hackingProgress=0),this.hackingProgress+=i*.08,this.hackingProgress>=100&&(this.hackingProgress=0,this.startHackingMinigame(s))):this.activeMinigame||(this.hackingProgress=Math.max(0,(this.hackingProgress||0)-i*.1))):(a&&!this.activeMinigame&&(a.style.display="none"),this.hackingProgress=0),this.matchMode==="sabotage"&&(this.ventCooldown>0&&(this.ventCooldown=Math.max(0,this.ventCooldown-i/1e3)),this.activeTask&&(this.sweepAngle+=.06*this.dtFactor),this.tasks.forEach(_=>{if(_.alarmActive){_.alarmTimer-=i/1e3;const x=Math.hypot(this.localPlayer.x-_.x,this.localPlayer.y-_.y);try{this.sound.playAlarmForTask(_.id,x)}catch{}if(_.alarmTimer<=0){_.alarmActive=!1,_.lastBeepTime=0;try{this.sound.stopAlarmForTask(_.id)}catch{}}}else try{this.sound.stopAlarmForTask(_.id)}catch{}})),this.gameState==="replay"){if(this.replayIndex+=this.dtFactor,Math.floor(this.replayIndex)>=this.replayFrames.length&&this.postReplayCallback){const _=this.postReplayCallback;this.postReplayCallback=null,_()}return}if(this.pollGamepad(),this.gameState==="countdown"){const _=(e-this.countdownStart)/1e3,x=3-Math.floor(_);if(x!==this.countdownTimer&&x>=0){this.countdownTimer=x;try{this.sound.playMetallicClick(0,1e3,.05,.2)}catch{}}if(x>0){const y=document.getElementById("hud-status");y&&(y.innerText=`DEPLOYING IN ${x}...`)}else{try{this.sound.playMetallicClick(0,2e3,.15,.35)}catch{}this.startRoundAction()}}if(this.gameState==="playing"||this.gameState==="countdown"){if(this.localPlayer.update(this.keys,this.mouse,this.map,this.sound,e,null,this.localPlayer),this.localPlayer.justDashed&&(this.localPlayer.justDashed=!1,this.particles.spawnDashParticles(this.localPlayer.x,this.localPlayer.y,this.localPlayer.angle,this.localPlayer.colorTheme)),this.mode==="offline"){this.botNavigation&&this.map.navigationRevision!==this.botNavigation.obstacleRevision&&this.botNavigation.sync(this.spawns);const _=new Map,x=new Set(this.players.filter(y=>y.isBot&&y.health>0).map(y=>y.team));for(const y of x){const E=this.players.filter(w=>w.isBot&&w.health>0&&w.team===y),A=this.players.filter(w=>w.health>0&&w.team!==y),S=uh(this.botBlackboards,y);for(const[w,P]of Jy(E,A,S,e))_.set(w,P)}this.players.forEach(y=>{if(y.isBot){const E=_.get(String(y.id))||null,A=this.players.filter(S=>S!==y&&S.health>0&&S.team===y.team);y.update(null,null,this.map,this.sound,e,E,this.localPlayer,{navigation:this.botNavigation,blackboard:uh(this.botBlackboards,y.team),teammates:A,laneIndex:y.botLaneIndex||0,combatEnabled:this.gameState==="playing"})}})}else this.network.interpolateOpponents();this.players.forEach(_=>{if(_!==this.localPlayer&&_.justDashed&&(_.justDashed=!1,this.particles.spawnDashParticles(_.x,_.y,_.angle,_.colorTheme),this.sound)){const x=Math.hypot(_.x-this.localPlayer.x,_.y-this.localPlayer.y);this.sound.playDashSound(x)}}),this.localPlayer.checkPickups(this.map,this.sound),this.mode==="offline"&&this.players.forEach(_=>{_.isBot&&_.checkPickups(this.map,this.sound)}),this.players.forEach(_=>{if(this.gameState==="playing"&&_.throwFlashbangRequest&&_.flashGrenades>0){_.throwFlashbangRequest=!1,_.flashGrenades--,_.isLocal&&!_.isBot&&_.updateHUD();const x=11,y=Math.cos(_.angle)*x,E=Math.sin(_.angle)*x,A=new xh(_.x,_.y,y,E,_.id);this.grenades.push(A);try{this.sound.playMetallicClick(0,1500,.08,.2)}catch{}this.mode==="online"&&_.isLocal&&this.socket.emit("throw-grenade",{x:_.x,y:_.y,vx:y,vy:E})}else _.throwFlashbangRequest=!1})}const r=this.devCheatActive&&this.localPlayer.aimbotHasLOS;if(this.gameState==="playing"&&(this.mouse.clicked||r)&&!this.localPlayer.isReloading){const _=this.localPlayer.weapon.type==="Automatic"||r,x=e-this.localPlayer.lastFiredTime;if(_||x>this.localPlayer.weapon.fireRate){const y=this.localPlayer.shoot(e,this.sound);if(y){if(window.MatchStats.shotsFired+=y.pellets||1,this.shakeCamera(y.recoil*.7),this.particles.spawnGunCasing(this.localPlayer.x,this.localPlayer.y,this.localPlayer.angle,this.localPlayer.weaponKey),y.pellets&&y.pellets>1)for(let E=0;E<y.pellets;E++)this.bullets.push(new Ra(y));else this.bullets.push(new Ra(y));this.mode==="online"&&this.network.sendShoot(y),_||(this.mouse.clicked=!1)}}}for(let _=this.bullets.length-1;_>=0;_--){const x=this.bullets[_];x.update(this.map,this.players,this.particles,this.sound,this.dtFactor),x.active||(x.playerId===this.localPlayer.id&&window.MatchStats.hitsRegistered++,this.bullets.splice(_,1))}for(let _=this.grenades.length-1;_>=0;_--){const x=this.grenades[_];if(x.update(this.map,e),!x.active){this.particles.spawnFlashbangBurst(x.x,x.y);const y=Math.hypot(this.localPlayer.x-x.x,this.localPlayer.y-x.y);this.sound.playFlashbangExplosion(y),y<800&&this.shakeCamera(Math.max(1,15*(1-y/800))),this.players.forEach(E=>{if(E.health<=0)return;Math.hypot(E.x-x.x,E.y-x.y)<380&&E.checkLineOfSight(this.map,x.x,x.y,E.x,E.y)&&(E.flashAlpha=1,E.isLocal&&E.updateHUD())}),this.grenades.splice(_,1)}}this.particles.update(this.map);for(let _=this.activeHitmarkers.length-1;_>=0;_--){const x=this.activeHitmarkers[_];x.age+=i,x.age>=x.duration&&this.activeHitmarkers.splice(_,1)}for(let _=this.floatingNumbers.length-1;_>=0;_--){const x=this.floatingNumbers[_];x.age+=i,x.y-=1*this.dtFactor,x.age>=x.duration&&this.floatingNumbers.splice(_,1)}this.players.forEach(_=>{_.health<=0&&!_.isDeadLogged&&(_.isDeadLogged=!0,this.onKillFeed&&this.onKillFeed("Eliminated",_.name,_.weaponKey))});const o=this.players.filter(_=>_.team===this.localPlayer.team),l=o.reduce((_,x)=>{let y=x.health;return x.isLocal&&this.devCheatActive&&(y=Math.round(y/2)),_+y},0)/o.length,c=document.getElementById("hud-self-hp");c&&(c.style.width=`${Math.max(0,l)}%`);const h=document.getElementById("hud-self-hp-text");h&&(h.innerText=Math.round(Math.max(0,l)));const u=this.localPlayer.team===1?2:1,d=this.players.filter(_=>_.team===u),f=d.reduce((_,x)=>_+x.health,0)/d.length,p=document.getElementById("hud-opponent-hp");if(p&&(p.style.width=`${Math.max(0,f)}%`),this.zone.active&&this.gameState==="playing"){this.zone.currentRadius>this.zone.targetRadius&&(this.zone.currentRadius=Math.max(this.zone.targetRadius,this.zone.currentRadius-this.zone.shrinkSpeed*this.dtFactor));const _=e;_-this.zone.lastDamageTick>=1e3&&(this.zone.lastDamageTick=_,this.players.forEach(x=>{if(x.health<=0||this.mode==="online"&&!x.isLocal)return;const y=x.x-this.zone.centerX,E=x.y-this.zone.centerY;if(Math.sqrt(y*y+E*E)>this.zone.currentRadius&&(x.takeDamage(this.zone.damage,this.sound),x.isLocal&&!x.isBot&&(x.showTextNotification&&x.showTextNotification("-20 ZONE DAMAGE"),this.mode==="online"&&this.socket))){const w=this.devCheatActive?Math.round(x.health/2):x.health;this.socket.emit("sync-health",{playerId:x.id,health:w})}}))}if(this.gameState==="playing"){const _=this.players.some(y=>y.health>0&&y.team===1),x=this.players.some(y=>y.health>0&&y.team===2);_&&!x?this.mode==="offline"&&this.endRound(1,"eliminated"):!_&&x?this.mode==="offline"&&this.endRound(2,"eliminated"):!_&&!x&&this.mode==="offline"&&this.endRound(null,"both dead")}this.gameState==="playing"&&this.players.forEach(_=>{if(_.health<=0||_.health>=_.maxHealth)return;const x=this.map.checkZone(_.x,_.y);x&&x.type==="healing"&&(_.health=Math.min(_.maxHealth,_.health+x.healRate),_.isLocal&&!_.isBot&&_.updateHUD())});const v=.25,g=this.localPlayer.x+(this.mouse.x-this.canvas.width/2)*v,m=this.localPlayer.y+(this.mouse.y-this.canvas.height/2)*v,M=1-Math.pow(1-.085,this.dtFactor);if(this.camera.x+=(g-this.camera.x)*M,this.camera.y+=(m-this.camera.y)*M,this.cameraShake>.1?(this.camera.shakeX=(Math.random()-.5)*this.cameraShake,this.camera.shakeY=(Math.random()-.5)*this.cameraShake,this.cameraShake*=Math.pow(.88,this.dtFactor)):(this.camera.shakeX=0,this.camera.shakeY=0,this.cameraShake=0),this.gameState==="playing"){const _=this.keys.shift,x=document.getElementById("sprint-tip-popup");_?(this.lastSprintTime=e,this.sprintTipVisible&&(this.sprintTipVisible=!1,x&&(x.style.display="none"))):this.localPlayer&&(Math.abs(this.localPlayer.vx)>.2||Math.abs(this.localPlayer.vy)>.2)?e-this.lastSprintTime>9e3&&(this.sprintTipVisible||(this.sprintTipVisible=!0,x&&(x.style.display="flex"))):this.lastSprintTime=e}if(this.mode==="online"&&(this.gameState==="playing"||this.gameState==="countdown")&&this.network.sendState(e),this.gameState==="playing"&&e-this.lastSnapshotTime>=1e3/60){this.lastSnapshotTime=e;const _={players:this.players.map(x=>({id:x.id,x:x.x,y:x.y,angle:x.angle,health:x.health,maxHealth:x.maxHealth,weaponKey:x.weaponKey,muzzleFlash:x.muzzleFlash,isLocal:x.isLocal,isBot:x.isBot,isTeammate:x.isTeammate,color:x.colorTheme,name:x.name,flashlightActive:x.flashlightActive,flashAlpha:x.flashAlpha,radius:x.radius})),bullets:this.bullets.map(x=>({x:x.x,y:x.y,prevX:x.prevX,prevY:x.prevY,angle:x.angle,playerId:x.playerId,active:x.active,weaponKey:x.weaponKey})),grenades:this.grenades.map(x=>({x:x.x,y:x.y})),particles:this.particles.particles.map(x=>({x:x.x,y:x.y,type:x.type,angle:x.angle,size:x.size,color:x.color,life:x.life})),decals:this.particles.decals.map(x=>({x:x.x,y:x.y,type:x.type,size:x.size,color:x.color,angle:x.angle,scaleX:x.scaleX,scaleY:x.scaleY})),camera:{x:this.camera.x,y:this.camera.y},brokenLightOn:this.map.ambientLights.brokenCeiling?this.map.ambientLights.brokenCeiling.on:!0};this.replayFrames.push(_),this.replayFrames.length>300&&this.replayFrames.shift()}}startReplay(e){const t=this.players.some(i=>i.health<=0);if(this.replayFrames&&this.replayFrames.length>0&&t){this.gameState="replay",this.replayIndex=0,this.postReplayCallback=e;const i=document.getElementById("hud-status");i&&(i.innerText="● REPLAY / KILLCAM",i.style.color="#ff3c3c")}else e()}drawSnapshotPlayer(e,t){if(this.ctx.save(),t){this.ctx.fillStyle="rgba(180, 0, 0, 0.35)",this.ctx.beginPath(),this.ctx.ellipse(e.x,e.y,26,22,0,0,Math.PI*2),this.ctx.fill(),gn.ready&&(this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle+Math.PI/2),this.ctx.globalAlpha=.55,gn.draw(this.ctx,e.id+"_dead",0,0,0,0,!1,e.isLocal?"blue":"red"),this.ctx.restore()),this.ctx.restore();return}if(this.settings.laser&&e.isLocal&&this.matchMode!=="sabotage"){let c=e.x+Math.cos(e.angle)*1200,h=e.y+Math.sin(e.angle)*1200;const u=this.map.getLineIntersection({x:e.x,y:e.y},{x:c,y:h});u&&(c=u.x,h=u.y),this.ctx.save(),this.ctx.strokeStyle=e.isLocal?"rgba(102, 252, 241, 0.5)":"rgba(255, 60, 60, 0.5)",this.ctx.lineWidth=1.2,this.ctx.beginPath(),this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(c,h),this.ctx.stroke();const d=e.isLocal?"#66fcf1":"#ff3c3c",f=this.ctx.createRadialGradient(c,h,1,c,h,6);f.addColorStop(0,"#ffffff"),f.addColorStop(.3,d),f.addColorStop(1,"rgba(0, 0, 0, 0)"),this.ctx.fillStyle=f,this.ctx.beginPath(),this.ctx.arc(c,h,6,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}const i=e.muzzleFlash>.1;if(!gn.draw(this.ctx,e.id,e.x,e.y,e.angle,0,i,e.isLocal?"blue":"red")){this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle);const l={cyan:{body:"#3ba39f",armor:"#16202c",helmet:"#66fcf1"},green:{body:"#39db14",armor:"#133d07",helmet:"#5eff39"},purple:{body:"#9d3bff",armor:"#20083c",helmet:"#c47aff"},orange:{body:"#ff7f3b",armor:"#3f1b07",helmet:"#ff9d7a"},yellow:{body:"#ffd700",armor:"#3a3000",helmet:"#ffea70"},red:{body:"#ff3c3c",armor:"#3a0707",helmet:"#ff7a7a"}},c=l[e.color]||l[e.isLocal?"cyan":"red"],h=c.body,u=c.armor,d=c.helmet;let f=18,p=4;e.weaponKey==="rifle"&&(f=24,p=5),e.weaponKey==="shotgun"&&(f=22,p=6),e.weaponKey==="sniper"&&(f=32,p=4),e.weaponKey==="smg"&&(f=16,p=4),e.weaponKey==="lmg"&&(f=26,p=7),e.weaponKey==="dmr"&&(f=28,p=5),e.weaponKey==="knife"&&(f=10,p=2),this.ctx.fillStyle="#444",this.ctx.strokeStyle="#000",this.ctx.lineWidth=1,this.ctx.fillRect(10,-p/2,f,p),this.ctx.strokeRect(10,-p/2,f,p),this.ctx.fillStyle=u,this.ctx.strokeStyle="#000",this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.arc(8,-10,5,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.arc(14,6,5,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle=h,this.ctx.beginPath(),this.ctx.ellipse(0,0,18,21,0,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle=u,this.ctx.beginPath(),this.ctx.ellipse(-3,0,14,16,0,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle=d,this.ctx.beginPath(),this.ctx.arc(-2,0,8,0,Math.PI*2),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle="#111",this.ctx.fillRect(1,-5,3,10),this.ctx.restore()}this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle),this.ctx.fillStyle=e.weaponKey==="knife"?"#b0b8c0":"#333",this.ctx.strokeStyle="rgba(0,0,0,0.7)",this.ctx.lineWidth=1;let a=18,r=3;if(e.weaponKey==="rifle"&&(a=26,r=4),e.weaponKey==="shotgun"&&(a=22,r=5),e.weaponKey==="sniper"&&(a=36,r=3),e.weaponKey==="smg"&&(a=16,r=3),e.weaponKey==="lmg"&&(a=28,r=5),e.weaponKey==="dmr"&&(a=30,r=4),e.weaponKey==="knife"&&(a=10,r=2),this.ctx.fillRect(12,-r/2,a,r),this.ctx.strokeRect(12,-r/2,a,r),e.muzzleFlash>0){this.ctx.save(),this.ctx.translate(12+a,0);const l=this.ctx.createRadialGradient(0,0,2,0,0,16);l.addColorStop(0,"rgba(255, 255, 255, 1.0)"),l.addColorStop(.3,"rgba(255, 220, 0, 0.9)"),l.addColorStop(.7,"rgba(255, 80, 0, 0.5)"),l.addColorStop(1,"rgba(255, 0, 0, 0.0)"),this.ctx.fillStyle=l,this.ctx.beginPath(),this.ctx.arc(0,0,16,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}this.ctx.restore(),this.ctx.save(),this.ctx.textAlign="center";const o=e.isLocal?"#66fcf1":e.isTeammate?"#39db14":"#ff3c3c";if(this.ctx.fillStyle=o,this.ctx.font="10px Orbitron",this.ctx.fillText(e.name.toUpperCase(),e.x,e.y-30),!e.isLocal&&e.health>0){this.ctx.fillStyle="rgba(0,0,0,0.5)",this.ctx.fillRect(e.x-20,e.y-26,40,4);const l=e.isTeammate?"#39db14":"#ff3c3c";this.ctx.fillStyle=l,this.ctx.fillRect(e.x-20,e.y-26,40*(e.health/e.maxHealth),4)}this.ctx.restore(),this.ctx.restore()}render(){let e=null;if(this.gameState==="replay"){const y=Math.min(this.replayFrames.length-1,Math.floor(this.replayIndex));e=this.replayFrames[y]}if(this.gameState==="replay"&&!e)return;this.ctx.fillStyle="#06070a",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const t=1920,i=1080,s=this.canvas.width/t,a=this.canvas.height/i,r=Math.min(s,a);this.zoom=Math.max(.5,Math.min(1.35,r)),this.ctx.save(),this.ctx.translate(this.canvas.width/2,this.canvas.height/2),this.ctx.scale(this.zoom,this.zoom);const o=e?e.camera.x:this.camera.x,l=e?e.camera.y:this.camera.y,c=e?0:this.camera.shakeX,h=e?0:this.camera.shakeY,u=-o+c,d=-l+h;this.ctx.translate(u,d);const f=e?e.players:this.players,p=e?e.bullets:this.bullets,v=e?e.brokenLightOn:this.map.ambientLights.brokenCeiling?this.map.ambientLights.brokenCeiling.on:!0;this.map.ambientLights.brokenCeiling&&(this.map.ambientLights.brokenCeiling.on=v),f.forEach(y=>{y.health>0&&y.flashlightActive?y.lightPoly=this.map.computeVisibilityPolygon(y.x,y.y,700,y.angle,65*Math.PI/180):y.lightPoly=null}),e?e.decals.forEach(y=>{this.ctx.save(),this.ctx.translate(y.x,y.y),this.ctx.rotate(y.angle),this.ctx.globalAlpha=y.type==="blood"?.75:.9,y.type==="blood"?(this.ctx.fillStyle=y.color,this.ctx.beginPath(),this.ctx.ellipse(0,0,y.size*y.scaleX,y.size*y.scaleY,0,0,Math.PI*2),this.ctx.fill()):y.type==="casing"?(this.ctx.fillStyle="#b5921c",this.ctx.fillRect(-y.size,-y.size/2,y.size*2,y.size)):y.type==="splinter"&&(this.ctx.fillStyle="#6e441c",this.ctx.fillRect(-y.size,-y.size/3,y.size*1.5,y.size*.7)),this.ctx.restore()}):this.particles.drawDecals(this.ctx);const g=e?e.players.find(y=>y.isLocal):this.localPlayer;if(this.map.draw(this.ctx,this.settings,f,g,p),f.forEach(y=>{y.health<=0&&(e?this.drawSnapshotPlayer(y,!0):y.draw(this.ctx))}),f.forEach(y=>{if(y.health<=0)return;let E=!0;if(this.settings.shadows&&g&&g.health>0&&!y.isLocal){const A=g.flashlightActive&&g.lightPoly&&this.isPointInPolygon({x:y.x,y:y.y},g.lightPoly),S=!this.map.getLineIntersection({x:g.x,y:g.y},{x:y.x,y:y.y}),w=this.map.isPointInAmbientLight(y.x,y.y,y.radius||18);E=A||y.isTeammate||y.flashlightActive&&S||w&&S}E&&(e?this.drawSnapshotPlayer(y,!1):y.draw(this.ctx,this.settings,this.map))}),g&&g.health>0&&(this.ctx.save(),this.ctx.translate(g.x,g.y),this.ctx.strokeStyle="rgba(102, 252, 241, 0.15)",this.ctx.lineWidth=1,this.ctx.setLineDash([4,8]),this.ctx.beginPath(),this.ctx.arc(0,0,32,Date.now()/1500,Date.now()/1500+Math.PI*2),this.ctx.stroke(),this.ctx.restore()),this.ctx.save(),this.ctx.globalCompositeOperation="lighter",e?(e.bullets.forEach(y=>{if(y.active){if(this.ctx.save(),y.weaponKey==="knife")this.ctx.lineWidth=3.5,this.ctx.lineCap="round",this.ctx.strokeStyle="rgba(230, 235, 255, 0.85)",this.ctx.shadowColor="#66fcf1",this.ctx.shadowBlur=6,this.ctx.beginPath(),this.ctx.arc(y.x,y.y,18,y.angle-.6,y.angle+.6),this.ctx.stroke();else{this.ctx.lineWidth=2.5,this.ctx.lineCap="round";const E=y.playerId===(g==null?void 0:g.id),A=this.ctx.createLinearGradient(y.prevX,y.prevY,y.x,y.y);E?(A.addColorStop(0,"rgba(102, 252, 241, 0.0)"),A.addColorStop(1,"rgba(102, 252, 241, 1.0)"),this.ctx.strokeStyle=A,this.ctx.shadowColor="#66fcf1"):(A.addColorStop(0,"rgba(255, 60, 60, 0.0)"),A.addColorStop(1,"rgba(255, 60, 60, 1.0)"),this.ctx.strokeStyle=A,this.ctx.shadowColor="#ff3c3c"),this.ctx.shadowBlur=4,this.ctx.beginPath(),this.ctx.moveTo(y.prevX,y.prevY),this.ctx.lineTo(y.x,y.y),this.ctx.stroke()}this.ctx.restore()}}),e.particles.forEach(y=>{this.ctx.save(),this.ctx.globalAlpha=Math.max(0,y.life),y.type==="casing"?(this.ctx.translate(y.x,y.y),this.ctx.rotate(y.angle),this.ctx.fillStyle="#d4af37",this.ctx.strokeStyle="#996515",this.ctx.lineWidth=.5,this.ctx.fillRect(-y.size,-y.size/2,y.size*2,y.size),this.ctx.strokeRect(-y.size,-y.size/2,y.size*2,y.size)):y.type==="splinter"?(this.ctx.translate(y.x,y.y),this.ctx.rotate(y.angle),this.ctx.fillStyle="#8b5a2b",this.ctx.beginPath(),this.ctx.moveTo(-y.size,0),this.ctx.lineTo(y.size,-y.size/2),this.ctx.lineTo(y.size/2,y.size/2),this.ctx.closePath(),this.ctx.fill()):y.type==="blood"?(this.ctx.fillStyle=y.color,this.ctx.beginPath(),this.ctx.arc(y.x,y.y,y.size,0,Math.PI*2),this.ctx.fill()):(this.ctx.fillStyle=y.color,(y.color.startsWith("#66fc")||y.color.startsWith("#ff3c"))&&(this.ctx.shadowColor=y.color,this.ctx.shadowBlur=4),this.ctx.beginPath(),this.ctx.arc(y.x,y.y,y.size*y.life,0,Math.PI*2),this.ctx.fill()),this.ctx.restore()})):(this.bullets.forEach(y=>y.draw(this.ctx)),this.particles.drawParticles(this.ctx)),this.ctx.restore(),e&&e.grenades?e.grenades.forEach(y=>{this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(y.x,y.y,6,0,Math.PI*2),this.ctx.fillStyle="#2d332f",this.ctx.strokeStyle="#66fcf1",this.ctx.lineWidth=1.5,this.ctx.fill(),this.ctx.stroke(),this.ctx.restore()}):this.grenades&&this.grenades.forEach(y=>y.draw(this.ctx)),!e&&this.zone&&this.zone.active){const y=this.zone,E=Date.now(),A=Math.sin(E/300)*.15+.85;this.ctx.save(),this.ctx.beginPath(),this.ctx.rect(-100,-100,this.mapWidth+200,this.mapHeight+200),this.ctx.arc(y.centerX,y.centerY,y.currentRadius,0,Math.PI*2,!0),this.ctx.fillStyle=`rgba(255, 30, 30, ${.12*A})`,this.ctx.fill("evenodd"),this.ctx.beginPath(),this.ctx.arc(y.centerX,y.centerY,y.currentRadius,0,Math.PI*2),this.ctx.strokeStyle=`rgba(255, 50, 50, ${.85*A})`,this.ctx.lineWidth=4,this.ctx.shadowColor="#ff2222",this.ctx.shadowBlur=18,this.ctx.stroke(),this.ctx.shadowBlur=0,this.ctx.beginPath(),this.ctx.arc(y.centerX,y.centerY,y.currentRadius,0,Math.PI*2),this.ctx.strokeStyle=`rgba(255, 150, 150, ${.3*A})`,this.ctx.lineWidth=12,this.ctx.stroke(),this.ctx.restore()}this.matchMode==="sabotage"&&(this.vents.forEach(y=>{this.ctx.save(),this.ctx.translate(y.x,y.y),this.ctx.fillStyle="#1e2124",this.ctx.fillRect(-20,-15,40,30),this.ctx.strokeStyle="#535960",this.ctx.lineWidth=2.5,this.ctx.strokeRect(-20,-15,40,30),this.ctx.strokeStyle="#0f1112",this.ctx.lineWidth=2;for(let A=-12;A<=12;A+=6)this.ctx.beginPath(),this.ctx.moveTo(A,-10),this.ctx.lineTo(A,10),this.ctx.stroke();Math.hypot(this.localPlayer.x-y.x,this.localPlayer.y-y.y)<50&&this.localPlayer.health>0&&!this.localPlayer.inVent&&(this.ctx.fillStyle="#66fcf1",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("[E] VENT",0,-22)),this.ctx.restore()}),this.tasks.forEach(y=>{const E=Date.now();this.ctx.save(),this.ctx.translate(y.x,y.y);const S=E%1200/1200*Math.PI*2;if(y.alarmActive){const U=.7+.3*Math.abs(Math.sin(E/60+y.x)),I=90+20*Math.abs(Math.sin(E/200)),B=Math.PI/6;this.ctx.save(),this.ctx.createConicalGradient;for(let j=0;j<2;j++){const te=S+j*Math.PI;this.ctx.beginPath(),this.ctx.moveTo(0,-26),this.ctx.arc(0,-26,I,te-B,te+B),this.ctx.closePath();const se=this.ctx.createRadialGradient(0,-26,0,0,-26,I);se.addColorStop(0,`rgba(255, 60, 40, ${.55*U})`),se.addColorStop(.45,`rgba(255, 80, 40, ${.18*U})`),se.addColorStop(1,"rgba(255, 40, 0, 0)"),this.ctx.fillStyle=se,this.ctx.fill()}const N=this.ctx.createRadialGradient(0,0,0,0,0,75);N.addColorStop(0,`rgba(255, 30, 10, ${.22*U})`),N.addColorStop(1,"rgba(255,0,0,0)"),this.ctx.fillStyle=N,this.ctx.beginPath(),this.ctx.ellipse(0,5,75,35,0,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()}else if(y.status==="doing"){const U=.12+.1*Math.abs(Math.sin(E/350)),I=this.ctx.createRadialGradient(0,0,0,0,0,40);I.addColorStop(0,`rgba(255,220,50,${U})`),I.addColorStop(1,"rgba(255,200,0,0)"),this.ctx.fillStyle=I,this.ctx.beginPath(),this.ctx.ellipse(0,5,40,22,0,0,Math.PI*2),this.ctx.fill()}y.status,y.alarmActive||y.status,this.ctx.fillStyle="rgba(0,0,0,0.45)",this.ctx.beginPath(),this.ctx.ellipse(0,17,22,7,0,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle="#1a1f26",this.ctx.beginPath(),this.ctx.roundRect(-18,-18,36,32,3),this.ctx.fill(),this.ctx.strokeStyle="#3a4555",this.ctx.lineWidth=1.5,this.ctx.stroke(),this.ctx.fillStyle="#0d1117",this.ctx.fillRect(-13,-14,26,16),this.ctx.strokeStyle="#2a3340",this.ctx.lineWidth=1,this.ctx.strokeRect(-13,-14,26,16);const w=y.alarmActive?"#1a0000":"#001a0a";this.ctx.fillStyle=w,this.ctx.fillRect(-11,-12,22,12),this.ctx.strokeStyle=y.alarmActive?"rgba(255,20,20,0.06)":"rgba(0,255,100,0.07)",this.ctx.lineWidth=.8;for(let U=-11;U<0;U+=2)this.ctx.beginPath(),this.ctx.moveTo(-11,U),this.ctx.lineTo(11,U),this.ctx.stroke();y.alarmActive?(this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=6,this.ctx.fillStyle="#ff3c3c"):y.status==="completed"?(this.ctx.shadowColor="#66fcf1",this.ctx.shadowBlur=6,this.ctx.fillStyle="#66fcf1"):y.status==="doing"?(this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=5,this.ctx.fillStyle="#ffd700"):(this.ctx.shadowColor="#1aff8a",this.ctx.shadowBlur=4,this.ctx.fillStyle="#1aff8a"),this.ctx.font="bold 5px monospace",this.ctx.textAlign="center";const P=y.alarmActive?"ALARM":y.status==="completed"?"DONE":y.status==="doing"?"ACTIVE":"READY";this.ctx.fillText(P,0,-5),this.ctx.shadowBlur=0,this.ctx.fillStyle="#141a22",this.ctx.fillRect(-13,4,26,8);const C=y.alarmActive?`rgba(255,40,40,${.6+.4*Math.abs(Math.sin(E/90))})`:y.status==="completed"?"#66fcf1":y.status==="doing"?"#ffd700":"#1aff8a";this.ctx.fillStyle=C,y.alarmActive&&(this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=8),this.ctx.beginPath(),this.ctx.arc(-8,8,2.5,0,Math.PI*2),this.ctx.fill(),this.ctx.shadowBlur=0;for(let U=-1;U<=5;U+=3)this.ctx.fillStyle="#2a3545",this.ctx.fillRect(U,6,2.5,4);if(y.alarmActive){const U=.6+.4*Math.abs(Math.sin(E/45));this.ctx.fillStyle="#1a0a0a",this.ctx.beginPath(),this.ctx.arc(0,-26,6,Math.PI,0),this.ctx.fill(),this.ctx.save(),this.ctx.translate(0,-26),this.ctx.rotate(S),this.ctx.fillStyle=`rgba(255, 60, 10, ${U})`,this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=14,this.ctx.beginPath(),this.ctx.arc(0,0,4.5,0,Math.PI*2),this.ctx.fill(),this.ctx.shadowBlur=0,this.ctx.fillStyle=`rgba(255, 220, 180, ${.8*U})`,this.ctx.beginPath(),this.ctx.arc(0,0,2,0,Math.PI*2),this.ctx.fill(),this.ctx.restore(),this.ctx.strokeStyle="#2a1a1a",this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.moveTo(0,-20),this.ctx.lineTo(0,-22),this.ctx.stroke()}else this.ctx.fillStyle="#1a2030",this.ctx.beginPath(),this.ctx.arc(0,-22,4,Math.PI,0),this.ctx.fill(),this.ctx.fillStyle="#2a3040",this.ctx.beginPath(),this.ctx.arc(0,-22,2,0,Math.PI*2),this.ctx.fill();this.ctx.strokeStyle="#0a0f14",this.ctx.lineWidth=1.2,this.ctx.beginPath(),this.ctx.moveTo(-18,5),this.ctx.quadraticCurveTo(-26,10,-24,16),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(18,3),this.ctx.quadraticCurveTo(25,8,22,16),this.ctx.stroke(),[[-16,-16],[16,-16],[-16,12],[16,12]].forEach(([U,I])=>{this.ctx.fillStyle="#2c3545",this.ctx.beginPath(),this.ctx.arc(U,I,1.5,0,Math.PI*2),this.ctx.fill()}),Math.hypot(this.localPlayer.x-y.x,this.localPlayer.y-y.y)<40&&this.localPlayer.health>0&&y.status==="pending"&&(this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=8,this.ctx.fillStyle="#ffd700",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("[F] INTERACT",0,-36),this.ctx.shadowBlur=0),this.ctx.restore()})),this.activeHitmarkers.forEach(y=>{const E=y.age/y.duration;this.ctx.save(),this.ctx.translate(y.x,y.y);const A=1-E;this.ctx.strokeStyle=y.isHeadshot?`rgba(255, 215, 0, ${A})`:`rgba(255, 255, 255, ${A})`,this.ctx.lineWidth=y.isHeadshot?2.5:1.5;const S=5+E*5,w=2;this.ctx.beginPath(),this.ctx.moveTo(-w,-w),this.ctx.lineTo(-S,-S),this.ctx.moveTo(w,-w),this.ctx.lineTo(S,-S),this.ctx.moveTo(-w,w),this.ctx.lineTo(-S,S),this.ctx.moveTo(w,w),this.ctx.lineTo(S,S),this.ctx.stroke(),this.ctx.restore()}),this.floatingNumbers.forEach(y=>{const E=y.age/y.duration;this.ctx.save(),this.ctx.translate(y.x,y.y);const A=1-E;let S=1;E<.25?S=1+E/.25*.4:S=1.4-(E-.25)/.75*.4,this.ctx.scale(S,S),this.ctx.font=y.isHeadshot?"bold 14px 'Orbitron', sans-serif":"bold 11px 'Orbitron', sans-serif",this.ctx.textAlign="center",this.ctx.strokeStyle=`rgba(0, 0, 0, ${A})`,this.ctx.lineWidth=3,this.ctx.strokeText(y.damage,0,0),this.ctx.fillStyle=y.isHeadshot?`rgba(255, 215, 0, ${A})`:`rgba(255, 255, 255, ${A})`,this.ctx.fillText(y.damage,0,0),this.ctx.restore()}),this.ctx.restore(),this.ctx.save();const M=this.ctx.createRadialGradient(this.canvas.width/2,this.canvas.height/2,this.canvas.width/3,this.canvas.width/2,this.canvas.height/2,this.canvas.width/1.1);M.addColorStop(0,"rgba(0, 0, 0, 0)");let _="rgba(0, 0, 0, 0.82)";if(this.localPlayer){const y=Date.now(),E=this.localPlayer.adrenalineEndTime&&y<this.localPlayer.adrenalineEndTime||this.localPlayer.adrenalineActive,A=this.localPlayer.overdriveEndTime&&y<this.localPlayer.overdriveEndTime||this.localPlayer.overdriveActive;this.matchMode==="sabotage"&&this.tasks&&this.tasks.some(w=>w.alarmActive)?_=`rgba(255, 30, 30, ${Math.sin(y/100)*.15+.55})`:A?_=`rgba(255, 180, 0, ${Math.sin(y/150)*.12+.48})`:E&&(_=`rgba(57, 219, 20, ${Math.sin(y/150)*.12+.48})`)}M.addColorStop(1,_),this.ctx.fillStyle=M,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(255, 255, 255, 0.015)";for(let y=0;y<this.canvas.height;y+=4)this.ctx.fillRect(0,y,this.canvas.width,1);if(this.ctx.restore(),this.localPlayer&&this.localPlayer.health>0&&this.localPlayer.health<35&&!e){this.ctx.save();const y=Math.sin(Date.now()/150)*.2+.3,E=this.ctx.createRadialGradient(this.canvas.width/2,this.canvas.height/2,this.canvas.width/3,this.canvas.width/2,this.canvas.height/2,this.canvas.width/1.1);E.addColorStop(0,"rgba(255, 0, 0, 0)"),E.addColorStop(1,`rgba(255, 0, 0, ${y})`),this.ctx.fillStyle=E,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.restore()}let x=0;if(e){const y=e.players.find(E=>E.isLocal);y&&(x=y.flashAlpha||0)}else this.localPlayer&&(x=this.localPlayer.flashAlpha||0);if(x>0&&(this.ctx.save(),this.ctx.fillStyle=`rgba(255, 255, 255, ${x})`,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.restore()),!e){const y=this.localPlayer&&this.localPlayer.health>0?this.map.checkZone(this.localPlayer.x,this.localPlayer.y):null;if(y)try{this.ctx.save();const E=y.type==="healing",A=Math.sin(Date.now()/400)*.25+.75,S=E?`rgba(80,255,130,${A})`:`rgba(255,100,60,${A})`,w=E?`rgba(40,255,110,${A*.18})`:`rgba(255,60,20,${A*.18})`,P=E?`rgba(80,255,130,${A*.8})`:`rgba(255,100,60,${A*.8})`,C=260,L=38,z=this.canvas.width/2-C/2,U=this.canvas.height-130;this.ctx.fillStyle=w,this.ctx.fillRect(z,U,C,L),this.ctx.strokeStyle=P,this.ctx.lineWidth=1.5,this.ctx.strokeRect(z,U,C,L),this.ctx.textAlign="center",this.ctx.font="bold 12px Orbitron",this.ctx.fillStyle=S;const I=E?"+":"!";this.ctx.fillText(`${I} ${y.label}`,this.canvas.width/2,U+15),this.ctx.font="9px Orbitron",this.ctx.fillStyle=E?"rgba(60,255,110,0.7)":"rgba(255,80,40,0.7)";const B=E?`+${(y.healRate*60).toFixed(0)} HP/s REGENERATION`:`DAMAGE x${y.multiplier} -- DANGER`;this.ctx.fillText(B,this.canvas.width/2,U+29),this.ctx.restore()}catch{}}if(this.matchMode==="sabotage"&&this.gameState==="playing"){this.ctx.save(),this.ctx.font="bold 11px 'Orbitron', sans-serif",this.ctx.textAlign="left";const y=20,E=120;this.ctx.fillStyle="#ff3c3c",this.ctx.fillText("MISSION TASKS:",y,E),this.tasks.forEach((A,S)=>{const w=E+20+S*18,P=A.status==="completed";this.ctx.fillStyle=P?"#39db14":"#fff",this.ctx.font=P?"10px 'Orbitron', sans-serif":"bold 10px 'Orbitron', sans-serif",this.ctx.strokeStyle=P?"#39db14":"#888",this.ctx.lineWidth=1,this.ctx.strokeRect(y,w-8,8,8),P&&(this.ctx.fillStyle="#39db14",this.ctx.fillRect(y+2,w-6,4,4)),this.ctx.fillText(A.name,y+15,w)}),this.ctx.restore()}if(this.matchMode==="sabotage"&&this.localPlayer&&this.localPlayer.health>0&&(this.localPlayer.inVent&&this.currentVent&&(this.ctx.save(),this.ctx.fillStyle="rgba(2, 4, 8, 0.85)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(102, 252, 241, 0.08)",this.ctx.strokeStyle="#66fcf1",this.ctx.lineWidth=2,this.ctx.fillRect(this.canvas.width/2-200,this.canvas.height/2-150,400,300),this.ctx.strokeRect(this.canvas.width/2-200,this.canvas.height/2-150,400,300),this.ctx.font="bold 16px 'Orbitron', sans-serif",this.ctx.fillStyle="#66fcf1",this.ctx.textAlign="center",this.ctx.fillText("VENT NETWORK SYSTEM",this.canvas.width/2,this.canvas.height/2-110),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#8892b0",this.ctx.fillText("Select destination vent code to travel:",this.canvas.width/2,this.canvas.height/2-80),this.vents.forEach((y,E)=>{const A=E+1,S=y.id===this.currentVent.id;this.ctx.fillStyle=S?"#ffd700":"#fff",this.ctx.fillText(`[${A}] ${y.name} ${S?"(CURRENT LOCATION)":""}`,this.canvas.width/2,this.canvas.height/2-40+E*30)}),this.ctx.font="bold 11px 'Orbitron', sans-serif",this.ctx.fillStyle="#ff3c3c",this.ctx.fillText("PRESS [SPACEBAR] TO EXIT VENT",this.canvas.width/2,this.canvas.height/2+120),this.ctx.restore()),this.activeTask)){this.ctx.save(),this.ctx.fillStyle="rgba(2, 4, 8, 0.85)",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const y=this.canvas.width/2-200,E=this.canvas.height/2-140,A=400,S=280;this.ctx.fillStyle="#11151c",this.ctx.strokeStyle="#ffd700",this.ctx.lineWidth=3,this.ctx.fillRect(y,E,A,S),this.ctx.strokeRect(y,E,A,S),this.ctx.font="bold 15px 'Orbitron', sans-serif",this.ctx.fillStyle="#ffd700",this.ctx.textAlign="center",this.ctx.fillText(this.activeTask.name.toUpperCase(),this.canvas.width/2,E+35),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#888",this.ctx.fillText("TASK TYPE: GRID CALIBRATION",this.canvas.width/2,E+60);const w=this.canvas.width/2-120,P=E+100,C=240,L=40;this.ctx.fillStyle="#1a1d24",this.ctx.fillRect(w,P,C,L),this.ctx.strokeStyle="#333",this.ctx.strokeRect(w,P,C,L),this.ctx.fillStyle="rgba(57, 219, 20, 0.35)",this.ctx.fillRect(this.canvas.width/2-24,P,48,L),this.ctx.strokeStyle="#39db14",this.ctx.strokeRect(this.canvas.width/2-24,P,48,L);const z=Math.abs(Math.sin(this.sweepAngle)),U=w+z*C;this.ctx.strokeStyle="#fff",this.ctx.lineWidth=3,this.ctx.beginPath(),this.ctx.moveTo(U,P-5),this.ctx.lineTo(U,P+L+5),this.ctx.stroke();const I=this.canvas.width/2-120,B=E+175,N=240,j=20;this.ctx.fillStyle="#1a1d24",this.ctx.fillRect(I,B,N,j),this.ctx.fillStyle="#ffd700",this.ctx.fillRect(I,B,this.sweepProgress/100*N,j),this.ctx.strokeStyle="#ffd700",this.ctx.strokeRect(I,B,N,j),this.ctx.font="bold 10px 'Orbitron', sans-serif",this.ctx.fillStyle="#fff",this.ctx.fillText(`CALIBRATION PROGRESS: ${this.sweepProgress}%`,this.canvas.width/2,B+14),this.ctx.font="11px 'Orbitron', sans-serif",this.ctx.fillStyle="#ffaa00",this.ctx.fillText("PRESS [SPACEBAR] WHEN LINE IS IN GREEN ZONE",this.canvas.width/2,E+230),this.ctx.fillStyle="#888",this.ctx.fillText("PRESS [ESC] OR [F] TO ABANDON TASK",this.canvas.width/2,E+255),this.ctx.restore()}if(!e&&this.gameState==="playing"&&(this.matchMode==="sabotage"||performance.now()-this.roundStartTime>2e4)){this.ctx.save();const y=150,A=this.canvas.width-y-20,S=100;this.ctx.fillStyle="rgba(6, 7, 10, 0.85)",this.ctx.fillRect(A,S,y,y),this.ctx.strokeStyle="hsla(43, 74%, 49%, 0.6)",this.ctx.lineWidth=2,this.ctx.strokeRect(A,S,y,y),this.ctx.fillStyle="hsla(43, 74%, 49%, 0.9)",this.ctx.font="bold 9px Orbitron",this.ctx.textAlign="center",this.ctx.fillText("TACTICAL MINIMAP",A+y/2,S-6);const w=y/this.map.width;if(this.ctx.fillStyle="rgba(255, 255, 255, 0.12)",this.map.walls.forEach(C=>{this.ctx.fillRect(A+C.x*w,S+C.y*w,C.w*w,C.h*w)}),this.localPlayer&&this.localPlayer.health>0){const C=A+this.localPlayer.x*w,L=S+this.localPlayer.y*w;this.ctx.fillStyle="#00ffff",this.ctx.beginPath(),this.ctx.arc(C,L,3.5,0,Math.PI*2),this.ctx.fill(),this.ctx.strokeStyle="rgba(0, 255, 255, 0.8)",this.ctx.lineWidth=1,this.ctx.beginPath(),this.ctx.moveTo(C,L),this.ctx.lineTo(C+Math.cos(this.localPlayer.angle)*7,L+Math.sin(this.localPlayer.angle)*7),this.ctx.stroke()}this.matchMode==="sabotage"&&this.tasks.forEach(C=>{if(C.status==="completed")return;const L=A+C.x*w,z=S+C.y*w,U=Math.abs(Math.sin(performance.now()/250));this.ctx.fillStyle=`rgba(255, 215, 0, ${.4+.6*U})`,this.ctx.beginPath(),this.ctx.arc(L,z,3.5+U*2,0,Math.PI*2),this.ctx.fill()});const P=Math.abs(Math.sin(performance.now()/200));this.players.forEach(C=>{if(C.health>0&&!C.isLocal){const L=A+C.x*w,z=S+C.y*w;if(C.isTeammate)this.ctx.fillStyle="#39ff14",this.ctx.beginPath(),this.ctx.arc(L,z,3,0,Math.PI*2),this.ctx.fill();else{if(this.matchMode==="sabotage")return;this.ctx.fillStyle=`rgba(255, 60, 60, ${.4+.6*P})`,this.ctx.beginPath(),this.ctx.arc(L,z,4+P*2.5,0,Math.PI*2),this.ctx.fill(),this.ctx.fillStyle="#ff3c3c",this.ctx.beginPath(),this.ctx.arc(L,z,2,0,Math.PI*2),this.ctx.fill()}}}),this.ctx.restore()}if(e){this.ctx.save(),this.ctx.strokeStyle="rgba(255, 60, 60, 0.6)",this.ctx.lineWidth=12,this.ctx.strokeRect(0,0,this.canvas.width,this.canvas.height);const y=Math.floor(Date.now()/500)%2===0;this.ctx.fillStyle=y?"#ff3c3c":"rgba(255, 60, 60, 0.2)",this.ctx.beginPath(),this.ctx.arc(40,40,8,0,Math.PI*2),this.ctx.fill(),this.ctx.font="900 16px Orbitron",this.ctx.fillStyle="#ffffff",this.ctx.textAlign="left",this.ctx.fillText("KILLCAM REPLAY",60,46);const E=this.replayIndex/this.replayFrames.length,A=this.canvas.width-80;this.ctx.fillStyle="rgba(255, 255, 255, 0.15)",this.ctx.fillRect(40,this.canvas.height-40,A,6),this.ctx.fillStyle="#ff3c3c",this.ctx.fillRect(40,this.canvas.height-40,A*E,6),this.ctx.restore()}if(!e&&this.combatBanner){this.ctx.save(),this.ctx.textAlign="center",this.ctx.textBaseline="middle";const y=this.combatBanner.timer,E=this.combatBanner.text;let A=1;y<.5&&(A=y/.5);const S=1.5+Math.max(0,y-2.5)*2+.05*Math.sin(Date.now()/100);this.ctx.translate(this.canvas.width/2,this.canvas.height/2-180),this.ctx.scale(S,S),this.ctx.shadowColor="#ff3c3c",this.ctx.shadowBlur=20,this.ctx.font="italic 900 24px 'Orbitron', sans-serif";const w=this.ctx.createLinearGradient(-150,0,150,0);w.addColorStop(0,`rgba(255, 60, 60, ${A})`),w.addColorStop(.5,`rgba(255, 220, 0, ${A})`),w.addColorStop(1,`rgba(255, 60, 60, ${A})`),this.ctx.fillStyle=w,this.ctx.fillText(E,0,0),this.ctx.shadowBlur=0,this.ctx.strokeStyle=`rgba(255, 215, 0, ${A*.4})`,this.ctx.lineWidth=1.5,this.ctx.beginPath(),this.ctx.moveTo(-100,18),this.ctx.lineTo(100,18),this.ctx.moveTo(-100,-18),this.ctx.lineTo(100,-18),this.ctx.stroke(),this.ctx.restore()}if(this.localPlayer&&this.localPlayer.weaponLevelUpAlert>0&&!e){this.ctx.save(),this.ctx.textAlign="center",this.ctx.textBaseline="middle";const y=this.localPlayer.weaponLevelUpAlert,E=Math.min(1,y),A=1+.15*Math.sin(Date.now()/150);this.ctx.translate(this.canvas.width/2,this.canvas.height/2-80),this.ctx.scale(A,A),this.ctx.shadowColor="#ffd700",this.ctx.shadowBlur=15,this.ctx.font="bold 28px 'Orbitron', sans-serif",this.ctx.fillStyle=`rgba(255, 215, 0, ${E})`,this.ctx.fillText("WEAPON UPGRADED",0,0),this.ctx.shadowBlur=0,this.ctx.font="bold 16px 'Orbitron', sans-serif",this.ctx.fillStyle=`rgba(255, 255, 255, ${E})`,this.ctx.fillText(`LVL ${this.localPlayer.weaponLevel}`,0,35),this.ctx.restore()}}isPointInPolygon(e,t){let i=!1;for(let s=0,a=t.length-1;s<t.length;a=s++){const r=t[s].x,o=t[s].y,l=t[a].x,c=t[a].y;o>e.y!=c>e.y&&e.x<(l-r)*(e.y-o)/(c-o)+r&&(i=!i)}return i}handleServerRoundOver(e){if(this.gameState!=="playing")return;if(this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.matchMode==="sabotage")try{this.sound.stopBearMusic()}catch{}let t=document.getElementById("hud-status");const i=this.localPlayer.team;e.winningTeam===i?t&&(t.innerText="ROUND WON",t.style.color="#39ff14"):t&&(t.innerText="ROUND LOST",t.style.color="#ff3c3c"),i===1?(this.scoreSelf=e.score1,this.scoreOpponent=e.score2):(this.scoreSelf=e.score2,this.scoreOpponent=e.score1),this.updateScoreboardHUD();const s=e.winningTeam===1?2:1;this.players.forEach(a=>{a.team===s&&(a.health=0)}),this.roundNumber=e.roundNumber,this.startReplay(()=>this.startRoundCycle())}handleServerMatchOver(e){if(this.gameState!=="playing"&&this.gameState!=="round-over")return;this.gameState="round-over",this.matchTimerInterval&&clearInterval(this.matchTimerInterval),this.localPlayer.team===1?(this.scoreSelf=e.score1,this.scoreOpponent=e.score2):(this.scoreSelf=e.score2,this.scoreOpponent=e.score1),this.updateScoreboardHUD();const i=window.MatchStats.shotsFired||1,s=window.MatchStats.hitsRegistered/i*100;window.MatchStats.accuracy=s,window.MatchStats.roundsWon=this.scoreSelf,window.MatchStats.winnerId=e.winnerId;const a=this.matchMode==="sabotage"?this.scoreSelf>this.scoreOpponent:this.scoreSelf>=3,r=this.localPlayer.rank?this.localPlayer.rank.label:"";let o=!1,l=0;this.isRanked&&(o=this.localPlayer.applyRankDelta(a?wa:Aa),l=a?wa:Aa),window.MatchStats.isWin=a,window.MatchStats.newRP=this.localPlayer.rp,window.MatchStats.newRank=this.localPlayer.rank,window.MatchStats.rpDelta=l,window.MatchStats.rankChanged=o,window.MatchStats.oldRankLabel=r;const h=(this.matchMode==="sabotage"?e.score1>e.score2?1:2:e.score1>=3?1:2)===1?2:1;this.players.forEach(d=>{d.team===h&&(d.health=0)});const u=()=>{this.gameState="match-over",this.active=!1,a?this.sound.playMatchWin():this.sound.playMatchLose(),this.onMatchEnd&&this.onMatchEnd(window.MatchStats)};this.startReplay(u)}spawnItemAt(e,t,i,s=null){const a=s||`item_${i}_${Date.now()}_${Math.round(Math.random()*1e3)}`;return this.map.items.some(r=>r.id===a)||this.map.items.push({id:a,x:e,y:t,type:i,active:!0}),a}generateRandomCode(){const e=["w","a","s","d","q","e","r","f"];let t="";for(let i=0;i<4;i++)t+=e[Math.floor(Math.random()*e.length)];return t}startHackingMinigame(e){const t=this.generateRandomCode();this.activeMinigame={terminal:e,code:t,input:"",timer:4},this.keys.e=!1;const i=document.getElementById("hacking-minigame-overlay");i&&(i.style.display="flex");const s=document.getElementById("hud-interaction-prompt");s&&(s.style.display="none"),this.renderMinigameKeys()}renderMinigameKeys(){const e=document.getElementById("minigame-keys-container");if(!e||!this.activeMinigame)return;e.innerHTML="";const t=this.activeMinigame.code,i=this.activeMinigame.input;for(let s=0;s<t.length;s++){const a=t[s],r=s<i.length,o=document.createElement("div");o.style.width="35px",o.style.height="35px",o.style.lineHeight="35px",o.style.borderRadius="4px",o.style.fontFamily="var(--font-title)",o.style.fontWeight="bold",o.style.fontSize="14px",o.style.textTransform="uppercase",o.style.border=r?"1px solid #39ff14":"1px solid rgba(255,255,255,0.15)",o.style.background=r?"rgba(57, 255, 20, 0.12)":"rgba(0,0,0,0.4)",o.style.color=r?"#39ff14":"rgba(255,255,255,0.7)",o.style.boxShadow=r?"0 0 6px rgba(57, 255, 20, 0.25)":"none",o.innerText=a,e.appendChild(o)}}handleMinigameKeyPress(e){if(!this.activeMinigame)return;const t=this.activeMinigame.code,i=this.activeMinigame.input,s=t[i.length];if(e===s){this.activeMinigame.input+=e,this.renderMinigameKeys();try{this.sound.playMetallicClick(0,2500,.04,.2)}catch{}this.activeMinigame.input===t&&this.successHackingMinigame()}else{this.activeMinigame.input="",this.renderMinigameKeys();try{this.sound.playMetallicClick(0,300,.15,.3)}catch{}}}cancelHackingMinigame(){this.activeMinigame=null;const e=document.getElementById("hacking-minigame-overlay");e&&(e.style.display="none")}successHackingMinigame(){if(!this.activeMinigame)return;const e=this.activeMinigame.terminal;e.hacked=!0;const t=this.spawnItemAt(e.x-22,e.y,"health"),i=this.spawnItemAt(e.x+22,e.y,"adrenaline");this.localPlayer.showTextNotification("HACK SUCCESSFUL! LOOT SPAWNED","#39ff14"),this.localPlayer.networkDroppedItems||(this.localPlayer.networkDroppedItems=[]),this.localPlayer.networkDroppedItems.push({id:t,x:e.x-22,y:e.y,type:"health"}),this.localPlayer.networkDroppedItems.push({id:i,x:e.x+22,y:e.y,type:"adrenaline"});try{this.sound.playMetallicClick(0,3500,.25,.45)}catch{}this.cancelHackingMinigame()}failHackingMinigame(){this.localPlayer.showTextNotification("HACK FAILED!","#ff3c3c");try{this.sound.playMetallicClick(0,200,.3,.45)}catch{}this.cancelHackingMinigame()}}const be={getItem(n){try{return localStorage.getItem(n)}catch(e){return console.warn("localStorage.getItem failed:",e),null}},setItem(n,e){try{localStorage.setItem(n,e)}catch(t){console.warn("localStorage.setItem failed:",t)}},removeItem(n){try{localStorage.removeItem(n)}catch(e){console.warn("localStorage.removeItem failed:",e)}}},Nl="tacticstrike_account_session",Ss="tacticstrike_account_user",kl="tacticstrike_admin_session",Ex=performance.now();function Tx(){try{const n=JSON.parse(be.getItem(Ss)||"null");return n&&typeof n.email=="string"?n:null}catch{return be.removeItem(Ss),null}}let It={token:be.getItem(Nl),user:Tx()};It.token||(It.user=null);let Vn=!!It.token,gs=be.getItem(kl),Ul=null;function ro(n){return new Promise(e=>setTimeout(e,n))}function Bl({immediate:n=!1}={}){const e=document.getElementById("startup-overlay");if(document.body.classList.remove("is-starting"),!!e){if(e.setAttribute("aria-hidden","true"),n){e.remove();return}e.classList.add("is-exiting"),setTimeout(()=>e.remove(),650)}}setTimeout(()=>{document.body.classList.contains("is-starting")&&Bl()},6500);async function wx(n){const e=Math.max(0,1350-(performance.now()-Ex)),t=It.token&&!It.user?Promise.race([Promise.resolve(n),ro(3600)]):Promise.resolve();await Promise.all([ro(e),t]);const i=document.getElementById("startup-status");i&&(i.textContent=It.user?"OPERATIVE SESSION READY":"SYSTEMS ONLINE"),await ro(140),Bl()}function ur(){return window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?window.location.port==="3000"?window.location.origin:"http://localhost:3000":window.location.hostname.endsWith("onrender.com")?window.location.origin:"https://topdownshooter.onrender.com"}async function Ji(n,e={}){const t={"Content-Type":"application/json",...e.headers||{}};It.token&&(t.Authorization=`Bearer ${It.token}`);const i=await fetch(`${ur()}${n}`,{...e,headers:t}),s=i.status===204?null:await i.json().catch(()=>null);if(!i.ok){const a=new Error((s==null?void 0:s.message)||"The account server could not complete this request.");throw a.code=s==null?void 0:s.error,a.status=i.status,a}return s}async function Ms(n,e={}){const t={"Content-Type":"application/json",...e.headers||{}};gs&&(t.Authorization=`Bearer ${gs}`);const i=await fetch(`${ur()}${n}`,{...e,headers:t}),s=i.status===204?null:await i.json().catch(()=>null);if(!i.ok){const a=new Error((s==null?void 0:s.message)||"The admin server could not complete this request.");throw a.code=s==null?void 0:s.error,a.status=i.status,a}return s}const Si={menu:document.getElementById("menu-screen"),lobby:document.getElementById("lobby-screen"),game:document.getElementById("game-screen"),matchmaking:document.getElementById("matchmaking-screen")},it={rankedRealistic:document.getElementById("btn-ranked-realistic"),rankedCompetitive:document.getElementById("btn-ranked-competitive"),createRoom:document.getElementById("btn-create-room"),joinRoom:document.getElementById("btn-join-room"),practiceBot:document.getElementById("btn-practice-bot"),openMatchSettings:document.getElementById("btn-open-match-settings"),closeSettings:document.getElementById("btn-close-settings"),leaveLobby:document.getElementById("btn-leave-lobby"),readyToggle:document.getElementById("btn-ready-toggle"),copyCode:document.getElementById("btn-copy-code"),returnLobby:document.getElementById("btn-return-lobby"),btnAmongUs:document.getElementById("btn-among-us-mode")},Oe={name:document.getElementById("player-name-input"),roomCode:document.getElementById("room-code-input"),chat:document.getElementById("chat-input"),qpMapSelect:document.getElementById("qp-map-select"),lobbyMapSelect:document.getElementById("lobby-map-select"),lobbyModeSelect:document.getElementById("lobby-mode-select"),lobbyStyleSelect:document.getElementById("lobby-style-select")},rt={roomCode:document.getElementById("room-code-display"),weaponStats:document.getElementById("weapon-stats-display"),playersList:document.getElementById("lobby-players-list"),chatMessages:document.getElementById("chat-messages"),chatDrawer:document.getElementById("chat-drawer")},yt={modal:document.getElementById("settings-modal"),volume:document.getElementById("setting-volume"),volumeVal:document.getElementById("volume-val"),blood:document.getElementById("setting-blood"),shadows:document.getElementById("setting-shadows"),laser:document.getElementById("setting-laser")},yn=document.getElementById("game-over-modal"),fr={pistol:{name:"Tactical 9mm",damage:22,fireRate:35,accuracy:90,magSize:12,range:400,reloadTime:1200,speedMultiplier:1,type:"Semi-Auto",damagePct:33,fireRatePct:45},rifle:{name:"Assault Rifle (M4A1)",damage:28,fireRate:75,accuracy:70,magSize:30,range:600,reloadTime:2200,speedMultiplier:1,type:"Automatic",damagePct:65,fireRatePct:85},shotgun:{name:"Shotgun (Remington 870)",damage:15,fireRate:20,accuracy:40,magSize:6,range:250,reloadTime:3e3,speedMultiplier:1,type:"Pump-Action",damagePct:80,fireRatePct:20,pellets:8},sniper:{name:"Sniper Rifle (AWM)",damage:95,fireRate:10,accuracy:98,magSize:5,range:1e3,reloadTime:2800,speedMultiplier:1,type:"Bolt-Action",damagePct:100,fireRatePct:10},smg:{name:"SMG (MP5)",damage:18,fireRate:85,accuracy:82,magSize:30,range:350,reloadTime:1500,speedMultiplier:1,type:"Automatic",damagePct:30,fireRatePct:95},lmg:{name:"LMG (M249)",damage:25,fireRate:80,accuracy:75,magSize:100,range:550,reloadTime:4500,speedMultiplier:1,type:"Automatic",damagePct:55,fireRatePct:90},dmr:{name:"DMR (M14 EBR)",damage:45,fireRate:30,accuracy:94,magSize:20,range:800,reloadTime:2400,speedMultiplier:1,type:"Semi-Auto",damagePct:75,fireRatePct:35},vector:{name:"Vector SMG",damage:14,fireRate:95,accuracy:85,magSize:33,range:320,reloadTime:1100,speedMultiplier:1,type:"Automatic",damagePct:25,fireRatePct:98},famas:{name:"FAMAS Burst Carbine",damage:20,fireRate:55,accuracy:91,magSize:25,range:550,reloadTime:1800,speedMultiplier:1,type:"Burst-Fire",damagePct:45,fireRatePct:60},plasma:{name:"Plasma Rifle PL-45",damage:32,fireRate:65,accuracy:90,magSize:20,range:600,reloadTime:2e3,speedMultiplier:1,type:"Automatic",damagePct:60,fireRatePct:70},railgun:{name:"Railgun RG-X",damage:85,fireRate:8,accuracy:99,magSize:5,range:1200,reloadTime:3500,speedMultiplier:.95,type:"Single-Shot",damagePct:95,fireRatePct:8}},Hn={dmr:{rp:1e3,rank:"VETERAN",price:2200},sniper:{rp:1e3,rank:"VETERAN",price:2500},lmg:{rp:4e3,rank:"ELITE",price:4500},vector:{rp:1e3,rank:"VETERAN",price:2100},famas:{rp:1e3,rank:"VETERAN",price:2300},plasma:{rp:4e3,rank:"ELITE",price:4e3},railgun:{rp:4e3,rank:"ELITE",price:5e3}},Ax={dmr:{code:"M14",role:"PRECISION",tier:"ADVANCED",description:"A controlled semi-auto platform built for disciplined mid-to-long range fire."},sniper:{code:"AWM",role:"LONGSHOT",tier:"ADVANCED",description:"A high-impact bolt-action system engineered to end an engagement in one shot."},lmg:{code:"M249",role:"SUPPORT",tier:"ELITE",description:"Sustained suppressive fire with a deep belt and uncompromising lane control."},vector:{code:"VEC",role:"BREACH",tier:"ADVANCED",description:"Extreme close-range fire rate for operatives who fight inside the objective."},famas:{code:"FAM",role:"BURST",tier:"ADVANCED",description:"A precise burst carbine tuned for fast target acquisition and controlled recoil."},plasma:{code:"PL45",role:"PROTOTYPE",tier:"ELITE",description:"Experimental energy rifle with exceptional accuracy and balanced stopping power."},railgun:{code:"RG-X",role:"EXOTIC",tier:"ELITE",description:"Blacksite electromagnetic technology delivering devastating single-shot force."}},Ks={pistol:"Pistol",rifle:"Rifle",shotgun:"Shotgun",sniper:"Sniper",smg:"SMG",lmg:"LMG",dmr:"DMR",vector:"Vector",famas:"FAMAS",plasma:"Plasma",railgun:"Railgun"};function Rx(n){const t=`; ${document.cookie}`.split(`; ${n}=`);return t.length===2?t.pop().split(";").shift():null}function Cx(n,e,t=365){const i=new Date;i.setTime(i.getTime()+t*24*60*60*1e3),document.cookie=`${n}=${e};expires=${i.toUTCString()};path=/;SameSite=Strict`}function Fl(){let n=be.getItem("tacticstrike_uuid");return n||(n=Rx("tacticstrike_uuid")),n||(n="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){const t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})),be.setItem("tacticstrike_uuid",n),Cx("tacticstrike_uuid",n,365),n}function Rs(){try{const n=window.AudioContext||window.webkitAudioContext;if(!n)return;const e=new n,t=e.createOscillator(),i=e.createGain();t.type="sawtooth",t.frequency.setValueAtTime(120,e.currentTime),i.gain.setValueAtTime(.12,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.15),t.connect(i),i.connect(e.destination),t.start(),t.stop(e.currentTime+.15)}catch{}}function Ol(){const n=parseInt(be.getItem("tacticstrike_rp")||"0"),e=document.querySelectorAll("#menu-weapon-selector .weapon-btn");e.forEach(s=>{const a=s.dataset.weapon,r=Hn[a],o=oo(a);if(r&&!o)s.classList.add("locked"),s.innerHTML=`🔒 ${Ks[a]} <span style="font-size:7px; display:block; color:#ff3c3c; margin-top:2.5px; font-family:var(--font-title); font-weight:bold;">${r.rank}</span>`;else{s.classList.remove("locked");let l=Ks[a]||a;try{JSON.parse(be.getItem("tacticstrike_purchased_weapons")||"[]").includes(a)&&n<r.rp&&(l=`🛍️ ${l}`)}catch{}s.innerHTML=l}});const t=document.querySelectorAll(".weapon-option");t.forEach(s=>{const a=s.dataset.weapon,r=Hn[a],o=oo(a);let l=s.querySelector(".lock-badge");r&&!o?(s.classList.add("locked"),l||(l=document.createElement("span"),l.className="lock-badge",s.appendChild(l)),l.innerHTML=`🔒 <span style="font-size:8px; font-weight:bold; color:#ff3c3c; margin-left:2px;">${r.rank}</span>`,l.style.display="inline-flex"):(s.classList.remove("locked"),l&&(l.style.display="none"))}),Hn[ht]&&!oo(ht)&&(ht="pistol",be.setItem("tacticstrike_player_weapon","pistol"),e.forEach(s=>{s.dataset.weapon==="pistol"?s.classList.add("active"):s.classList.remove("active")}),t.forEach(s=>{s.dataset.weapon==="pistol"?s.classList.add("active"):s.classList.remove("active")}),Es("pistol"))}let le=null,ve=null,wt=null,Ye="Operative",ht="pistol",Zt="cyan",Ht="1v1",Gs=!1,us=[],ui="menu",Mi=be.getItem("tacticstrike_qp_style")||"realistic",Ln=be.getItem("tacticstrike_selected_map")||"manor";function bs(){try{return JSON.parse(localStorage.getItem("tacticstrike_career")||'{"wins":0,"losses":0}')}catch{return{wins:0,losses:0}}}function _d(n){try{localStorage.setItem("tacticstrike_career",JSON.stringify(n))}catch{}}function zl(){const n=bs(),e=n.wins+n.losses,t=e>0?Math.round(n.wins/e*100):null,i=document.getElementById("stat-wins"),s=document.getElementById("stat-losses"),a=document.getElementById("stat-winpct");i&&(i.innerText=n.wins),s&&(s.innerText=n.losses),a&&(a.innerText=t!==null?`${t}%`:"—")}function pr(n){const e=bs();n?e.wins++:e.losses++,_d(e),zl()}function Px(n,e){if(n)try{const t=localStorage.getItem("tacticstrike_h2h")||"{}",i=JSON.parse(t);i[n]||(i[n]={wins:0,losses:0}),e?i[n].wins++:i[n].losses++,localStorage.setItem("tacticstrike_h2h",JSON.stringify(i))}catch(t){console.warn("Failed to record H2H result:",t)}}function Ix(){const n=document.getElementById("h2h-history-container");if(!n)return;let e={};try{e=JSON.parse(localStorage.getItem("tacticstrike_h2h")||"{}")}catch{e={}}const t=Object.entries(e);if(t.length===0){n.innerHTML='<div style="color: var(--text-muted); font-size: 10px; text-align: center; padding: 10px 0; letter-spacing: 0.5px;">No head-to-head records found. Play a match to start tracking!</div>';return}t.sort((s,a)=>a[1].wins+a[1].losses-(s[1].wins+s[1].losses));let i="";t.forEach(([s,a])=>{const r=a.wins+a.losses,o=r>0?Math.round(a.wins/r*100):0;i+=`
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 4px; font-family: var(--font-title);">
        <span style="color: #fff; font-size: 11px; font-weight: bold; letter-spacing: 0.5px;">${Wn(s).toUpperCase()}</span>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 10px; color: var(--text-muted); letter-spacing: 0.5px;">RECORD: <strong style="color: #39db14;">${a.wins}W</strong> - <strong style="color: #ff3c3c;">${a.losses}L</strong></span>
          <span style="font-size: 9px; background: rgba(102, 252, 241, 0.1); border: 1px solid rgba(102, 252, 241, 0.3); color: #66fcf1; padding: 2px 5px; border-radius: 3px; font-weight: bold; letter-spacing: 0.5px;">${o}% WR</span>
        </div>
      </div>
    `}),n.innerHTML=i}const vt=new Audio("/Midnight_Deployment.mp3");vt.loop=!0;const At=new Audio("/Before_The_Starting_Bell.mp3");At.loop=!0;const gt=new Audio("/Into_Darkness.mp3");gt.loop=!0;let Ca=!1,Ut=!1;const zt=new Audio("/Deployment_Sequence.mp3");zt.loop=!0;zt.volume=.15;function Sd(){if(!Ut)try{vt.pause(),vt.currentTime=0,At.pause(),At.currentTime=0,gt.pause(),gt.currentTime=0,zt.volume=.15,zt.loop=!0,zt.play().catch(()=>{})}catch{}}function kt(){try{const n=window.AudioContext||window.webkitAudioContext;if(!n)return;const e=new n,t=e.createOscillator(),i=e.createGain();t.type="sine",t.frequency.setValueAtTime(1200,e.currentTime),t.frequency.exponentialRampToValueAtTime(600,e.currentTime+.08),i.gain.setValueAtTime(.1,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.08),t.connect(i),i.connect(e.destination),t.start(),t.stop(e.currentTime+.08)}catch{}}let $i=null;function Ei(n="tap"){if(!Ve.sfxMuted)try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;$i||($i=new e),$i.state==="suspended"&&$i.resume().catch(()=>{});const t={open:{from:390,to:520,duration:.14},close:{from:510,to:370,duration:.12},confirm:{from:560,to:760,duration:.16},tap:{from:440,to:500,duration:.1}},i=t[n]||t.tap,s=$i.currentTime,a=$i.createOscillator(),r=$i.createBiquadFilter(),o=$i.createGain(),l=.035*Math.max(0,Math.min(1,Ve.volume));a.type="sine",a.frequency.setValueAtTime(i.from,s),a.frequency.exponentialRampToValueAtTime(i.to,s+i.duration),r.type="lowpass",r.frequency.setValueAtTime(1800,s),r.Q.setValueAtTime(.45,s),o.gain.setValueAtTime(1e-4,s),o.gain.exponentialRampToValueAtTime(Math.max(1e-4,l),s+.012),o.gain.exponentialRampToValueAtTime(1e-4,s+i.duration),a.connect(r),r.connect(o),o.connect($i.destination),a.start(s),a.stop(s+i.duration+.02)}catch{}}let Ja=null;const Lx=[{key:"knife",text:"Equip your Melee Knife (Press 2) to move 15% faster."},{key:"flashbang",text:"Throw a Flash Grenade (Press 3) to blind enemies in line-of-sight."},{key:"dash",text:"Press Space to dash forward in the direction you are facing (10s CD)."},{key:"flashlight",text:"Toggle your Flashlight (Press F) to spot enemies in dark rooms."}];function fl(){const n=document.getElementById("gameplay-tips-panel");if(!n)return;const e=Lx.filter(s=>localStorage.getItem(`tacticstrike_hide_tip_${s.key}`)!=="true");if(e.length===0){n.style.display="none",Ja=null;return}const t=e[Math.floor(Math.random()*e.length)];Ja=t.key;const i=document.getElementById("tip-text");i&&(i.innerText=t.text),n.style.display="flex"}function Dx(){const n=document.getElementById("btn-dismiss-tip");n&&n.addEventListener("click",()=>{if(Ja){localStorage.setItem(`tacticstrike_hide_tip_${Ja}`,"true");const e=document.getElementById("gameplay-tips-panel");e&&(e.style.display="none"),setTimeout(fl,1e3)}})}window.stopAllMusic=function(){try{vt.pause(),vt.currentTime=0,At.pause(),At.currentTime=0,zt.pause(),zt.currentTime=0,gt.pause(),gt.currentTime=0,ve&&ve.sound&&ve.sound.stopBearMusic()}catch{}};function Md(){if(!Ut)try{vt.pause(),vt.currentTime=0,zt.pause(),zt.currentTime=0,gt.pause(),gt.currentTime=0,At.currentTime=0,At.play().catch(()=>{})}catch{}}function Vl(){if(!Ut)try{At.pause(),At.currentTime=0,zt.pause(),zt.currentTime=0,gt.pause(),gt.currentTime=0,vt.currentTime=0,vt.play().catch(()=>{})}catch{}}function bd(){try{if(Ut)return;if(gt.pause(),gt.currentTime=0,ve&&ve.matchMode==="sabotage"||ui==="practice"&&Ht==="sabotage"){vt.pause(),vt.currentTime=0,At.pause(),At.currentTime=0,zt.pause(),zt.currentTime=0,ve&&ve.gameState==="playing"&&ve.sound&&ve.sound.playBearMusic();return}ui==="casual"?(vt.pause(),vt.currentTime=0,At.pause(),At.currentTime=0,zt.volume=.04,zt.loop=!0,zt.play().catch(()=>{})):(zt.pause(),zt.currentTime=0,At.pause(),At.currentTime=0,vt.volume=.04,vt.play().catch(()=>{}))}catch{}}function Qa(n){const e=document.getElementById("ranked-video-overlay"),t=document.getElementById("ranked-video");if(!e||!t){n();return}t.muted=!!Ve.sfxMuted,t.volume=typeof Ve.volume=="number"?Ve.volume:.5,t.currentTime=0,e.style.display="flex",e.offsetHeight,e.style.opacity="1",window.stopAllMusic(),t.play().then(()=>{const i=setTimeout(()=>{e.style.opacity="0"},4400),s=setTimeout(()=>{t.pause(),e.style.display="none",n()},5e3),a=()=>{clearTimeout(i),clearTimeout(s),e.style.opacity="0",setTimeout(()=>{e.style.display="none",n()},500),t.removeEventListener("ended",a)};t.addEventListener("ended",a)}).catch(i=>{console.warn("Ranked video playback failed or blocked by browser:",i),e.style.opacity="0",e.style.display="none",n()})}const xn=[{id:"recruit",label:"RECRUIT",minRP:0,maxRP:999,color:"#8a9bb5",icon:"▪"},{id:"veteran",label:"VETERAN",minRP:1e3,maxRP:3999,color:"#e8c84a",icon:"◆"},{id:"elite",label:"ELITE",minRP:4e3,maxRP:1/0,color:"#ff6ef7",icon:"★"}];function Ed(n){for(let e=xn.length-1;e>=0;e--)if(n>=xn[e].minRP)return xn[e];return xn[0]}function Nx(n){for(let e=xn.length-1;e>=0;e--)if(n>=xn[e].minRP)return e;return 0}function Hl(){const n=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),e=Nx(n),t=xn[e],i=xn[e+1],s=document.getElementById("menu-rank-icon"),a=document.getElementById("menu-rank-label"),r=document.getElementById("menu-rank-rp"),o=document.getElementById("menu-rank-progress"),l=document.getElementById("menu-rank-progress-text");if(s&&(s.innerText=t.icon,s.style.color=t.color,s.style.textShadow=`0 0 14px ${t.color}80`),a&&(a.innerText=t.label,a.style.color=t.color,a.style.textShadow=`0 0 16px ${t.color}66`),r&&(r.innerText=`${n} RP`),o&&l)if(i){const c=i.minRP-t.minRP,h=Math.min(100,Math.max(0,(n-t.minRP)/c*100));o.style.width=`${h}%`,o.style.background=`linear-gradient(90deg, ${t.color}, ${i.color})`,o.style.boxShadow=`0 0 8px ${i.color}66`,l.innerText=`${n} / ${i.minRP} RP TO ${i.label}`}else o.style.width="100%",o.style.background=`linear-gradient(90deg, ${t.color}, ${t.color})`,o.style.boxShadow=`0 0 10px ${t.color}80`,l.innerText="MAX RANK ACHIEVED"}let Vs=!1,yi=null,qt=null;vt.addEventListener("ended",()=>{Ut||(vt.currentTime=0,vt.play().catch(()=>{}))});At.addEventListener("ended",()=>{Ut||(At.currentTime=0,At.play().catch(()=>{}))});function Td(){if(Ca||Ut){Pa();return}const n=document.querySelector(".screen.active");if(n&&n.id==="game"||Si.game&&Si.game.classList.contains("active"))return;const t=document.getElementById("deploy-modal");if(t&&t.classList.contains("active")){gt.volume=.15,gt.play().then(()=>{Ca=!0,Pa()}).catch(()=>{});return}n&&(n.id==="lobby-screen"||n.id==="matchmaking-screen")?At.play().then(()=>{Ca=!0,Pa()}).catch(()=>{}):vt.play().then(()=>{Ca=!0,Pa()}).catch(()=>{})}function Pa(){["click","keydown","touchstart"].forEach(n=>{window.removeEventListener(n,Td)})}["click","keydown","touchstart"].forEach(n=>{window.addEventListener(n,Td)});function wd(){if(Ut)vt.volume=0,At.volume=0,gt.volume=0;else{const n=Si.game&&Si.game.classList.contains("active");vt.volume=n?.04:.15,At.volume=.15,gt.volume=.15}}function pl(){const n=document.getElementById("setting-music-toggle"),e=document.getElementById("settings-music-action"),t=document.getElementById("settings-music-status");n&&(n.classList.toggle("is-muted",Ut),n.setAttribute("aria-pressed",String(Ut)),e&&(e.innerText=Ut?"UNMUTE MUSIC":"MUTE MUSIC"),t&&(t.innerText=Ut?"MUSIC IS OFF":"MUSIC IS PLAYING"))}function kx(n){if(Ve.musicMuted=n,Ut=n,Ut)window.stopAllMusic();else{const e=document.querySelector(".screen.active"),t=document.getElementById("deploy-modal");t&&t.classList.contains("active")?(gt.currentTime=0,gt.play().catch(()=>{})):e&&(e.id==="lobby-screen"||e.id==="matchmaking-screen")?Md():e&&e.id==="game-screen"?bd():Vl()}wd(),pl(),Dn()}const Ve={volume:.5,blood:!0,shadows:!0,laser:!0,musicMuted:!1,sfxMuted:!1,performanceMode:!1,showFps:!1};function Ux(){const n=be.getItem("tacticstrike_settings"),e=document.getElementById("setting-show-fps");if(n)try{const s=JSON.parse(n);delete s.serverUrl,Object.assign(Ve,s),yt.volume&&(yt.volume.value=Ve.volume*100),yt.volumeVal&&(yt.volumeVal.innerText=`${Math.round(Ve.volume*100)}%`),yt.blood&&(yt.blood.checked=Ve.blood),yt.shadows&&(yt.shadows.checked=Ve.shadows),yt.laser&&(yt.laser.checked=Ve.laser),e&&(e.checked=!!Ve.showFps);const a=document.getElementById("fps-counter");a&&(a.style.display=Ve.showFps?"block":"none"),Ut=!!Ve.musicMuted;const r=document.getElementById("setting-mute-sfx");r&&(r.checked=!!Ve.sfxMuted)}catch(s){console.error(s)}pl(),e&&e.addEventListener("change",s=>{Ve.showFps=s.target.checked;const a=document.getElementById("fps-counter");a&&(a.style.display=Ve.showFps?"block":"none"),Dn()}),yt.volume&&yt.volume.addEventListener("input",s=>{const a=parseInt(s.target.value);Ve.volume=a/100,yt.volumeVal&&(yt.volumeVal.innerText=`${a}%`),Dn()}),yt.blood&&yt.blood.addEventListener("change",s=>{Ve.blood=s.target.checked,Dn()}),yt.shadows&&yt.shadows.addEventListener("change",s=>{Ve.shadows=s.target.checked,Dn()}),yt.laser&&yt.laser.addEventListener("change",s=>{Ve.laser=s.target.checked,Dn()});const t=document.getElementById("setting-music-toggle");t&&t.addEventListener("click",()=>{Ve.sfxMuted||kt(),kx(!Ut)});const i=document.getElementById("setting-mute-sfx");i&&i.addEventListener("change",s=>{Ve.sfxMuted=s.target.checked,Dn()}),it.openMatchSettings&&it.openMatchSettings.addEventListener("click",()=>{Ve.sfxMuted||kt(),Ix(),pl(),yt.modal&&yt.modal.classList.add("active")}),it.closeSettings&&it.closeSettings.addEventListener("click",()=>{yt.modal&&yt.modal.classList.remove("active")})}function Dn(){if(be.setItem("tacticstrike_settings",JSON.stringify(Ve)),ve){const n=Ve.sfxMuted?0:Ve.volume;ve.updateSettings({...Ve,volume:n})}}function ti(n){const e=document.getElementById("deploy-modal");if(e&&e.classList.remove("active"),Object.keys(Si).forEach(t=>{t===n?(Si[t].classList.add("active"),(t==="matchmaking"||t==="lobby")&&(Si[t].style.display="flex")):(Si[t].classList.remove("active"),t==="matchmaking"&&(Si[t].style.display="none"))}),n!=="matchmaking"&&window.mmDotsInterval&&(clearInterval(window.mmDotsInterval),window.mmDotsInterval=null),n==="menu")Vl();else if(n==="lobby")Sd();else if(n==="matchmaking")Md();else if(n==="game")bd(),window.tipInterval&&clearInterval(window.tipInterval),fl(),window.tipInterval=setInterval(fl,18e3);else{window.tipInterval&&(clearInterval(window.tipInterval),window.tipInterval=null);const t=document.getElementById("gameplay-tips-panel");t&&(t.style.display="none")}n==="menu"&&rt&&rt.chatMessages&&(rt.chatMessages.innerHTML=""),wd()}function Bx(){const n=document.querySelectorAll(".weapon-option");n.forEach(e=>{e.addEventListener("click",t=>{if(e.classList.contains("locked")){t.preventDefault(),t.stopPropagation(),Rs();return}n.forEach(i=>i.classList.remove("active")),e.classList.add("active"),ht=e.dataset.weapon,be.setItem("tacticstrike_player_weapon",ht),Es(ht),kt(),le&&wt&&le.emit("select-weapon",{weapon:ht})})}),Es("pistol")}function Es(n){const e=fr[n];if(!e||!rt.weaponStats)return;const t=e.damagePct??Math.min(100,Math.round(e.damage/95*100)),i=e.fireRatePct??Math.min(100,Math.round(e.fireRate)),s=e.accuracy??75,r=n==="plasma"||n==="railgun"?"#ff6ef7":"",o=r?`background: ${r};`:"";rt.weaponStats.innerHTML=`
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
  `}function Nn(n){var c;if(us=n,!rt.playersList)return;rt.playersList.innerHTML="";const e=Ht==="2v2"?4:2;for(let h=0;h<e;h++){const u=n[h],d=document.createElement("div");if(u){d.className=`player-slot active ${u.ready?"ready":""}`;const f=((c=fr[u.weapon])==null?void 0:c.name)||u.weapon,v={cyan:"#66fcf1",green:"#39db14",purple:"#9d3bff",orange:"#ff7f3b",yellow:"#ffd700",red:"#ff3c3c"}[u.color]||"#66fcf1",g=Ht==="2v2"?`TEAM ${h%2===0?"1":"2"}`:h===0?"HOST":"GUEST",m=u.rp||0,M=Ed(m);d.innerHTML=`
        <div class="player-info">
          <span class="player-name" style="color: ${v};">
            <span style="color: ${M.color}; margin-right: 4px;">${M.icon}</span>${Wn(u.name)} ${u.id===le.id?"(YOU)":""}
          </span>
          <span class="player-weapon-desc">RANK: <span style="color:${M.color}">${M.label}</span> | WEAPON: ${f}</span>
        </div>
        <div class="player-badge ${h%2===0?"host":"guest"}">
          ${g}
        </div>
        <div class="status-badge ${u.ready?"ready-status":"waiting"}">
          ${u.ready?"READY":"CHOOSING..."}
        </div>
      `}else{d.className="player-slot empty";const f=h+1,p=Ht==="2v2"?` (TEAM ${h%2===0?"1":"2"})`:"";d.innerHTML=`<div class="slot-status">WAITING FOR OPERATIVE ${f}${p}...</div>`}if(rt.playersList.appendChild(d),Ht==="1v1"&&h===0){const f=document.createElement("div");f.className="vs-divider",f.innerText="VS",rt.playersList.appendChild(f)}}const t=n.find(h=>h.id===le.id);t&&it.readyToggle&&(Gs=t.ready,it.readyToggle.className=Gs?"btn secondary":"btn primary",it.readyToggle.innerText=Gs?"CANCEL READY":"READY TO DEPLOY");const i=document.getElementById("lobby-map-selector-container"),s=document.getElementById("lobby-map-select");if(i&&s)if(ui==="ranked")i.style.display="none";else{i.style.display="block";const h=n[0]&&n[0].id===le.id;s.disabled=!h}const a=document.getElementById("lobby-mode-selector-container"),r=document.getElementById("lobby-mode-select");if(a&&r)if(ui==="ranked")a.style.display="none";else{a.style.display="block";const h=n[0]&&n[0].id===le.id;r.disabled=!h}const o=document.getElementById("lobby-style-selector-container"),l=document.getElementById("lobby-style-select");if(o&&l)if(ui==="ranked")o.style.display="none";else{o.style.display="block";const h=n[0]&&n[0].id===le.id;l.disabled=!h}}function Ha(){if(le)return;const n=ur();le=ka(n),window.AppSocket=le,le.on("connect_error",()=>{console.warn("Failed to connect to multiplayer server."),nr()}),le.on("disconnect",()=>{nr()}),le.on("player-counts",e=>{Pd(e)}),le.on("connect",()=>{console.log("Socket connected.");const e=Fl(),t=parseInt(be.getItem("tacticstrike_rp")||"0"),i=bs(),s=parseInt(be.getItem("tacticstrike_credits")||"0");let a=[];try{a=JSON.parse(be.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}le.emit("sync-device",{uuid:e,rp:t,wins:i.wins,losses:i.losses,name:Ye,credits:s,purchasedWeapons:a})}),le.on("device-synced",e=>{console.log("Device synced with database:",e);const t=parseInt(be.getItem("tacticstrike_rp")||"0"),i=Math.max(t,e.rp||0);be.setItem("tacticstrike_rp",String(i));const s=bs(),a=Math.max(s.wins,e.wins||0),r=Math.max(s.losses,e.losses||0);_d({wins:a,losses:r});const o=parseInt(be.getItem("tacticstrike_credits")||"0"),l=Math.max(o,e.credits||0);be.setItem("tacticstrike_credits",String(l));let c=[];try{c=JSON.parse(be.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}const h=Array.from(new Set([...c,...e.purchasedWeapons||[]]));be.setItem("tacticstrike_purchased_weapons",JSON.stringify(h)),e.name&&e.name!=="Operative"&&(Ye=e.name,be.setItem("tacticstrike_player_name",Ye),Oe.name&&(Oe.name.value=Ye)),Hl(),zl(),Ol()}),le.on("register-response",e=>{e.success||console.warn("Register failed:",e.error)}),le.on("login-response",e=>{e.success||console.warn("Login failed:",e.error)}),le.on("room-created",({roomId:e,players:t,autoMatch:i,mode:s,mapId:a,renderStyle:r,isRanked:o})=>{wt=e,s&&(Ht=s),ui=o?"ranked":"casual",rt.roomCode.innerText=e;const l=document.getElementById("lobby-map-select");l&&a&&(l.value=a);const c=document.getElementById("lobby-mode-select");c&&s&&(c.value=s);const h=document.getElementById("lobby-style-select");h&&r&&(h.value=r,Mi=r),i?(Nn(t),Pi("Created matchmaking room. Waiting for opponent...")):(ti("lobby"),Nn(t),Pi(`Lobby created. Share code [${e}] with a friend.`))}),le.on("room-joined",({roomId:e,players:t,mode:i,mapId:s,renderStyle:a,isRanked:r})=>{wt=e,i&&(Ht=i),ui=r?"ranked":"casual",rt.roomCode.innerText=e,ti("lobby"),Nn(t);const o=document.getElementById("lobby-map-select");o&&s&&(o.value=s);const l=document.getElementById("lobby-mode-select");l&&i&&(l.value=i);const c=document.getElementById("lobby-style-select");c&&a&&(c.value=a,Mi=a),Pi(`Joined lobby: ${e}`),yi&&(clearTimeout(yi),yi=null),qt&&(clearTimeout(qt),qt=null),Vs=!1}),le.on("room-error",e=>{alert(e)}),le.on("player-joined",({players:e})=>{Nn(e);const t=e.find(s=>s.id!==le.id);t&&Pi(`${t.name} entered the lobby.`);const i=document.querySelector(".screen.active");i&&i.id==="matchmaking-screen"&&(qt&&(clearTimeout(qt),qt=null),ti("lobby"))}),le.on("players-update",({players:e})=>{Nn(e)}),le.on("lobby-map-update",({mapId:e})=>{const t=document.getElementById("lobby-map-select");t&&(t.value=e),Pi(`Host updated mission area to: ${e==="cyberlab"?"Neon Cyber-Lab":e==="arena"?"Neon Arena":"Residential Manor"}`)}),le.on("lobby-mode-update",({mode:e})=>{const t=document.getElementById("lobby-mode-select");t&&(t.value=e),Ht=e;let i="Duel 1v1";e==="sabotage"&&(i="Sabotage (Task Survival)"),Pi(`Host updated game mode to: ${i}`)}),le.on("lobby-style-update",({renderStyle:e})=>{const t=document.getElementById("lobby-style-select");t&&(t.value=e),Mi=e,Pi(`Host updated render style to: ${e==="competitive"?"Competitive":"Realistic"}`)}),le.on("player-left",({players:e,message:t})=>{Nn(e),Pi(t);const i=document.querySelector(".screen.active"),s=i&&i.id==="game-screen";if(ve&&s)if(ve.active&&ve.mode==="online"&&(ve.gameState==="playing"||ve.gameState==="countdown"||ve.gameState==="replay")){if(pr(!0),ve.isRanked){const r=parseInt(localStorage.getItem("tacticstrike_rp")||"0")+80;localStorage.setItem("tacticstrike_rp",String(r)),ve.localPlayer&&(ve.localPlayer.rp=r,ve.localPlayer.rank=ve.localPlayer._calcRank(r))}localStorage.removeItem("tacticstrike_active_match"),ve.endGameDueToDisconnect(t)}else if(ve.gameState==="match-over"){const a=document.getElementById("rematch-status");a&&(a.innerText="Opponent left the room.");const r=document.getElementById("btn-rematch");r&&(r.disabled=!0,r.innerText="OPPONENT LEFT")}else localStorage.removeItem("tacticstrike_active_match"),ve.endGameDueToDisconnect(t)}),le.on("match-start",({players:e,seed:t,isRanked:i,mode:s,mapId:a,renderStyle:r})=>{ui=i?"ranked":"casual",r&&(Mi=r),yn&&yn.classList.remove("active"),Qa(()=>{const l=e.findIndex(c=>c.id===le.id);rt.chatMessages.innerHTML="",localStorage.setItem("tacticstrike_active_match",i?"ranked":"casual"),ve&&ve.destroy(),ve=new Za("game-canvas",{mode:"online",socket:le,localPlayerId:le.id,localPlayerName:Ye,localWeapon:ht,localColor:Zt,localPlayerIndex:l,players:e,seed:t,mapId:a||"manor",settings:{...Ve,volume:Ve.sfxMuted?0:Ve.volume},matchMode:s||Ht,isRanked:!!i,qpRenderStyle:Mi,onMatchEnd:er,onKillFeed:tr}),ti("game")})}),le.on("opponent-requested-rematch",e=>{const t=document.getElementById("rematch-status");let i="Opponent";if(ve&&e&&e.playerId){const s=ve.players.find(a=>a.id===e.playerId);s&&(i=s.name)}t&&(t.innerText=`${i} requested a rematch! Click REMATCH to accept.`)})}function Bs(){le&&(le.disconnect(),le=null,wt=null,window.AppSocket=null),rt&&rt.roomCode&&(rt.roomCode.innerText="-----")}function vh(){const n=document.getElementById("deploy-modal");n&&n.classList.remove("active"),ui="practice",Qa(()=>{rt.chatMessages.innerHTML="",ve&&ve.destroy();const t=[{id:"player",name:Ye,weapon:ht,color:Zt}];Ht==="2v2"?(t.push({id:"bot_enemy_1",name:"Bot Miller (Enemy)",weapon:vn(),color:"red"}),t.push({id:"bot_teammate",name:"Bot Ramirez (Teammate)",weapon:vn(),color:"green"}),t.push({id:"bot_enemy_2",name:"Bot Cooper (Enemy)",weapon:vn(),color:"orange"})):t.push({id:"bot_enemy_1",name:"Bot Miller (Enemy)",weapon:vn(),color:"red"}),ve=new Za("game-canvas",{mode:"offline",socket:null,localPlayerId:"player",localPlayerName:Ye,localWeapon:ht,localColor:Zt,localPlayerIndex:0,players:t,seed:Math.random(),mapId:Ln,settings:{...Ve,volume:Ve.sfxMuted?0:Ve.volume},matchMode:Ht,isRanked:!1,qpRenderStyle:Mi,onMatchEnd:er,onKillFeed:tr}),ti("game")})}function vn(){return["pistol","rifle","shotgun","sniper","smg","lmg","dmr","vector","famas"][Math.floor(Math.random()*9)]}function er(n){localStorage.removeItem("tacticstrike_active_match"),yn&&yn.classList.add("active");const e=!!n.isWin;let t="";if(ve&&ve.mode==="online"){pr(e);const p=ve.players.find(m=>m.id!==le.id);p&&Px(p.name,e);const v=parseInt(be.getItem("tacticstrike_credits")||"0");let g=v;if(ve.isRanked&&e&&(g=v+50,be.setItem("tacticstrike_credits",String(g)),t=' <span style="color:#ffd700; font-size:10px;">(+50 Credits Ranked Win Bonus!)</span>'),le){const m=Fl(),M=parseInt(be.getItem("tacticstrike_rp")||"0"),_=bs();let x=[];try{x=JSON.parse(be.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}le.emit("sync-device",{uuid:m,rp:M,wins:_.wins,losses:_.losses,name:Ye,credits:g,purchasedWeapons:x})}}const i=document.getElementById("match-result-title"),s=document.getElementById("match-result-subtitle");i&&(e?(i.innerText="MISSION ACCOMPLISHED",i.className="result-title win"):(i.innerText="MISSION FAILED",i.className="result-title lose")),s&&(e?s.innerText="You successfully eliminated the target operative.":s.innerText="You were eliminated by the target operative.");let a="Unknown Operative";if(ve){const p=ve.players.find(v=>v.id===n.winnerId);p&&(a=p.name)}const r=document.getElementById("match-winner-name");r&&(r.innerText=`WINNER: ${a}`,r.style.color=e?"#39db14":"#ff3c3c");const o=document.getElementById("stat-rounds-won");o&&(o.innerText=n.roundsWon||0);const l=document.getElementById("stat-damage-dealt");l&&(l.innerText=Math.round(n.damageDealt||0));const c=document.getElementById("stat-accuracy");c&&(c.innerText=`${Math.round(n.accuracy||0)}%`);const h=document.getElementById("stat-shots-fired");h&&(h.innerText=n.shotsFired||0);const u=document.getElementById("rematch-status");u&&(u.innerText="");const d=document.getElementById("btn-rematch");d&&(d.disabled=!1,d.innerText="REMATCH"),it.returnLobby&&(ve&&ve.isRanked?it.returnLobby.innerText="RETURN TO MENU":it.returnLobby.innerText="RETURN TO LOBBY");const f=document.getElementById("rank-result-panel");if(f){if(ve&&ve.isRanked&&n.newRank){const p=n.newRank,v=n.rpDelta||0,g=v>=0?`+${v} RP`:`${v} RP`,m=v>=0?"#39ff14":"#ff3c3c";f.innerHTML=`
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
        `,f.style.display="block"}else f.innerHTML='<div style="font-family:var(--font-title); font-size:10px; color:var(--text-muted); text-align:center; letter-spacing:1.5px;">CASUAL MATCH - NO RANK EFFECT</div>',f.style.display="block";if(t){const p=document.createElement("div");p.style.cssText="font-family:var(--font-title); font-size:10px; text-align:center; margin-top:8px;",p.innerHTML=t,f.appendChild(p)}}}function Fx(){var ue;const n=document.getElementById("btn-deploy-main"),e=document.getElementById("btn-close-deploy"),t=document.getElementById("deploy-modal"),i=document.getElementById("btn-play-worldloom"),s=document.getElementById("btn-close-worldloom"),a=document.getElementById("btn-leave-worldloom-unsaved"),r=document.getElementById("btn-retry-worldloom"),o=document.getElementById("btn-return-worldloom"),l=document.getElementById("worldloom-site-screen"),c=document.getElementById("worldloom-frame"),h=document.getElementById("worldloom-frame-loading"),u=h==null?void 0:h.querySelector(".worldloom-frame-actions"),d=document.getElementById("worldloom-portal-status"),f=((ue=h==null?void 0:h.querySelector("small"))==null?void 0:ue.textContent)||"";let p=!1,v=!1,g=null,m=0,M=!1;const _=2500,x=new Map,y=l!=null&&l.parentElement?[...l.parentElement.children].filter($=>$!==l):[],E=new Map,A=$=>{y.forEach(q=>{$?(E.set(q,q.hasAttribute("inert")),q.setAttribute("inert","")):E.get(q)?q.setAttribute("inert",""):q.removeAttribute("inert")}),$||E.clear()},S=()=>{d&&(d.hidden=!0,d.textContent=""),a&&(a.hidden=!0),u&&(u.hidden=!0),h==null||h.classList.remove("has-error")},w=($,q=!0)=>{v=q,clearTimeout(g),g=null,h==null||h.classList.remove("is-hidden"),h==null||h.classList.toggle("has-error",q),h==null||h.setAttribute("aria-busy","false");const fe=h==null?void 0:h.querySelector("small");fe&&(fe.textContent=$),u&&(u.hidden=!1)},P=($=!1)=>{p=!1,v=!1,S(),h==null||h.classList.remove("is-hidden"),h==null||h.setAttribute("aria-busy","true");const q=h==null?void 0:h.querySelector("small");if(q&&(q.textContent=f),clearTimeout(g),g=setTimeout(()=>{!p&&!v&&w("Worldloom is taking longer than expected. You can keep waiting, retry, or return.",!1)},9e3),!c)return;const fe=(i==null?void 0:i.dataset.worldloomPath)||"./worldloom/index.html";$&&c.removeAttribute("src"),c.getAttribute("src")||c.setAttribute("src",fe)},C=()=>{if(!p||!(c!=null&&c.contentWindow))return Promise.resolve(null);const $=`worldloom-save-${Date.now()}-${++m}`;return new Promise(q=>{const fe=setTimeout(()=>{x.delete($),q(!1)},_);x.set($,ye=>{clearTimeout(fe),x.delete($),q(!!ye)}),c.contentWindow.postMessage({source:"tacticstrike",type:"request-save",requestId:$},window.location.origin)})};window.addEventListener("message",$=>{var fe;if($.origin!==window.location.origin||$.source!==(c==null?void 0:c.contentWindow))return;const q=$.data;(q==null?void 0:q.source)==="worldloom"&&(q.type==="ready"?(p=!0,v=!1,clearTimeout(g),g=null,S(),h==null||h.setAttribute("aria-busy","false"),h==null||h.classList.add("is-hidden")):q.type==="save-ack"?(fe=x.get(q.requestId))==null||fe(q.saved):q.type==="error"&&h&&w(q.message||"Worldloom could not start safely. Retry or return to TacticStrike."))}),n&&t&&n.addEventListener("click",()=>{t.classList.add("active");const $=t.querySelector(".deploy-card");$&&($.scrollTop=0),kt(),vt.pause(),vt.currentTime=0,Ut||(gt.volume=.15,gt.currentTime=0,gt.play().catch(()=>{}))}),e&&t&&e.addEventListener("click",()=>{t.classList.remove("active"),kt(),gt.pause(),gt.currentTime=0,Ut||Vl()}),i&&i.addEventListener("click",()=>{kt(),window.stopAllMusic(),t&&t.classList.remove("active"),l&&(l.classList.add("active"),l.setAttribute("aria-hidden","false")),document.body.classList.add("is-worldloom-open"),A(!0),P(!1),s==null||s.focus()}),c&&c.addEventListener("load",()=>{c.getAttribute("src")&&!p&&!v&&(h==null||h.setAttribute("aria-busy","true"))});const L=()=>{clearTimeout(g),g=null,p=!1,v=!1,c&&c.removeAttribute("src"),l&&(l.classList.remove("active"),l.setAttribute("aria-hidden","true")),document.body.classList.remove("is-worldloom-open"),A(!1),S(),h==null||h.classList.remove("is-hidden"),h==null||h.setAttribute("aria-busy","false"),t&&t.classList.add("active"),Ut||(gt.volume=.15,gt.currentTime=0,gt.play().catch(()=>{})),i==null||i.focus(),s&&(s.disabled=!1),M=!1};s&&s.addEventListener("click",async()=>{if(M)return;M=!0,s.disabled=!0,kt(),document.pointerLockElement&&document.exitPointerLock();const $=await C();if(p&&$===!1){d&&(d.textContent="SAVE FAILED — WORLD KEPT OPEN",d.hidden=!1),a&&(a.hidden=!1),s.disabled=!1,M=!1;return}L()}),a==null||a.addEventListener("click",()=>{l!=null&&l.classList.contains("active")&&L()}),r==null||r.addEventListener("click",()=>P(!0)),o==null||o.addEventListener("click",()=>s==null?void 0:s.click()),Oe.name&&Oe.name.addEventListener("change",()=>{Ye=Oe.name.value.trim()||"Operative",be.setItem("tacticstrike_player_name",Ye),le&&le.connected&&le.emit("change-name",{name:Ye})}),it.practiceBot&&it.practiceBot.addEventListener("click",()=>{Oe.name&&(Ye=Oe.name.value.trim()||"Operative"),be.setItem("tacticstrike_player_name",Ye),vh()}),it.btnAmongUs&&it.btnAmongUs.addEventListener("click",()=>{Oe.name&&(Ye=Oe.name.value.trim()||"Operative"),be.setItem("tacticstrike_player_name",Ye);const $=document.getElementById("deploy-modal");$&&$.classList.remove("active"),ui="practice",Qa(()=>{rt.chatMessages.innerHTML="",ve&&ve.destroy();const fe=[{id:"player",name:Ye,weapon:"none",color:Zt},{id:"bot_enemy_1",name:"Impostor Killer",weapon:"pistol",color:"red"}];ve=new Za("game-canvas",{mode:"offline",socket:null,localPlayerId:"player",localPlayerName:Ye,localWeapon:"none",localColor:Zt,localPlayerIndex:0,players:fe,seed:Math.random(),mapId:Ln,settings:{...Ve,volume:Ve.sfxMuted?0:Ve.volume},matchMode:"sabotage",isRanked:!1,qpRenderStyle:Mi,onMatchEnd:er,onKillFeed:tr}),ti("game")})}),it.createRoom&&it.createRoom.addEventListener("click",()=>{const $=document.getElementById("deploy-modal");$&&$.classList.remove("active"),Oe.name&&(Ye=Oe.name.value.trim()||"Operative"),be.setItem("tacticstrike_player_name",Ye),Ha(),le&&le.emit("create-room",{playerName:Ye,mode:Ht,color:Zt,mapId:Ln,weapon:ht,renderStyle:Mi})}),it.joinRoom&&it.joinRoom.addEventListener("click",()=>{const $=document.getElementById("deploy-modal");$&&$.classList.remove("active");const q=Oe.roomCode?Oe.roomCode.value.toUpperCase().trim():"";if(!q||q.length!==5){alert("Please enter a valid 5-character room code.");return}Oe.name&&(Ye=Oe.name.value.trim()||"Operative"),be.setItem("tacticstrike_player_name",Ye),Ha(),le&&le.emit("join-room",{roomId:q,playerName:Ye,color:Zt,weapon:ht})});function z($){const q=parseInt(localStorage.getItem("tacticstrike_mm_ban_until")||"0");if(Date.now()<q){const ye=q-Date.now(),G=Math.floor(ye/6e4),J=Math.floor(ye%6e4/1e3);alert(`MATCHMAKING BAN ACTIVE: ${G}:${String(J).padStart(2,"0")} remaining.

Leaving ranked matches results in a temporary ban.`);return}const fe=document.getElementById("deploy-modal");if(fe&&fe.classList.remove("active"),Oe.name&&(Ye=Oe.name.value.trim()||"Operative"),be.setItem("tacticstrike_player_name",Ye),Ha(),le){const ye=parseInt(localStorage.getItem("tacticstrike_rp")||"0");Vs=!1;const G=Ht+"_"+$;le.emit("auto-match",{playerName:Ye,mode:G,color:Zt,rp:ye,rankStrict:!0,weapon:ht}),ti("matchmaking");const J=document.getElementById("mm-rank-display"),K=document.getElementById("mm-rank-icon"),we=document.getElementById("mm-timer"),Ae=document.getElementById("mm-expand-notice"),Pe=Ed(ye);J&&(J.innerText=Pe.label),K&&(K.innerText=Pe.icon,K.style.color=Pe.color),we&&(we.innerText="0s"),Ae&&(Ae.innerText="Searching within your skill bracket...");let st=0;window.mmInterval&&clearInterval(window.mmInterval),window.mmInterval=setInterval(()=>{st++,we&&(we.innerText=`${st}s`)},1e3);let De=0;const Xe=document.getElementById("mm-dots");window.mmDotsInterval&&clearInterval(window.mmDotsInterval),window.mmDotsInterval=setInterval(()=>{De=(De+1)%4,Xe&&(Xe.innerText=".".repeat(De))},500),yi&&clearTimeout(yi),yi=setTimeout(()=>{!Vs&&le&&le.connected&&(!wt||us&&us.length===1)&&(Vs=!0,Pi("⚡ Rank filter removed — expanding search to all ranks..."),Ae&&(Ae.innerText="⚡ Search expanded to all skill ranks!"),wt&&(le.emit("leave-room"),wt=null),le.emit("auto-match",{playerName:Ye,mode:G,color:Zt,rp:ye,rankStrict:!1,weapon:ht}))},2e3);const et=15e3+Math.floor(Math.random()*46e3);qt&&clearTimeout(qt),qt=setTimeout(()=>{qt=null;const He=document.querySelector(".screen.active");!He||He.id!=="matchmaking-screen"||wt&&us&&us.length>1||U($)},et)}}function U($){window.mmInterval&&clearInterval(window.mmInterval),window.mmDotsInterval&&clearInterval(window.mmDotsInterval),yi&&(clearTimeout(yi),yi=null),qt&&(clearTimeout(qt),qt=null),Vs=!0;const q=document.getElementById("mm-expand-notice"),fe=document.getElementById("mm-dots"),ye=document.getElementById("mm-timer");q&&(q.innerText="GAME FOUND — DEPLOYING..."),fe&&(fe.innerText=""),ye&&(ye.innerText=""),le&&le.emit("leave-room"),Bs(),wt=null;const G=co();ui="ranked";const J=()=>{rt.chatMessages.innerHTML="",ve&&ve.destroy(),localStorage.setItem("tacticstrike_active_match","ranked");const K=[{id:"player",name:Ye,weapon:ht,color:Zt}];Ht==="2v2"?(K.push({id:"bot_enemy_1",name:G,weapon:vn(),color:"red"}),K.push({id:"bot_teammate",name:co(),weapon:vn(),color:"green"}),K.push({id:"bot_enemy_2",name:co(),weapon:vn(),color:"orange"})):K.push({id:"bot_enemy_1",name:G,weapon:vn(),color:"red"}),ve=new Za("game-canvas",{mode:"offline",socket:null,localPlayerId:"player",localPlayerName:Ye,localWeapon:ht,localColor:Zt,localPlayerIndex:0,players:K,seed:Math.random(),mapId:Ln,settings:{...Ve,volume:Ve.sfxMuted?0:Ve.volume},matchMode:Ht,isRanked:!0,qpRenderStyle:$,onMatchEnd:er,onKillFeed:tr}),Pi(`Game found! Playing against ${G}.`),ti("game")};setTimeout(()=>Qa(J),1200)}it.rankedRealistic&&it.rankedRealistic.addEventListener("click",()=>z("realistic")),it.rankedCompetitive&&it.rankedCompetitive.addEventListener("click",()=>z("competitive"));const I=document.getElementById("btn-cancel-matchmaking");I&&I.addEventListener("click",()=>{window.mmInterval&&clearInterval(window.mmInterval),yi&&clearTimeout(yi),qt&&(clearTimeout(qt),qt=null),le&&le.emit("leave-room"),Bs(),window.stopAllMusic(),ti("menu")}),it.leaveLobby&&it.leaveLobby.addEventListener("click",()=>{le&&wt&&le.emit("leave-room"),Bs(),ti("menu")}),it.readyToggle&&it.readyToggle.addEventListener("click",()=>{if(le&&wt){const $=!Gs;le.emit("player-ready",{ready:$}),Sd()}}),it.copyCode&&it.copyCode.addEventListener("click",()=>{wt&&navigator.clipboard.writeText(wt).then(()=>{it.copyCode.innerText="✅",setTimeout(()=>it.copyCode.innerText="📋",1500)})}),it.returnLobby&&it.returnLobby.addEventListener("click",()=>{yn&&yn.classList.remove("active");const $=document.getElementById("rank-result-panel");$&&($.style.display="none",$.innerHTML=""),ve&&(ve.destroy(),ve=null),Hl(),le&&wt&&ui!=="ranked"?(ti("lobby"),Gs=!1,Nn(us),Es(ht)):(le&&le.emit("leave-room"),Bs(),ti("menu"))});const B=document.getElementById("btn-game-menu"),N=document.getElementById("game-menu-overlay"),j=document.getElementById("btn-game-resume"),te=document.getElementById("btn-game-leave");B&&N&&B.addEventListener("click",()=>{N.classList.add("active")}),j&&N&&j.addEventListener("click",()=>{N.classList.remove("active")}),te&&N&&te.addEventListener("click",()=>{if(ve&&ve.active&&ve.gameState!=="match-over"){let q;if(ve.isRanked?q=`WARNING: Leaving this ranked match will count it as a LOSS (-40 RP) and give you a 5-minute MATCHMAKING BAN.

Leave anyway?`:ve.mode==="online"?q=`WARNING: Leaving this online match will count it as a LOSS.

Leave anyway?`:q="Leave this match? Your current match progress will be lost.",!confirm(q)){N.classList.remove("active");return}}console.log("LEAVE MATCH clicked. Cleaning up game session...");try{if(N.classList.remove("active"),ve){try{if(ve.active&&(ve.mode==="online"||ve.isRanked)&&ve.gameState!=="match-over"&&(pr(!1),ve.isRanked)){const q=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),fe=Math.max(0,q-40);localStorage.setItem("tacticstrike_rp",String(fe)),localStorage.setItem("tacticstrike_mm_ban_until",String(Date.now()+5*60*1e3))}}catch(q){console.error("Error recording match result during leave:",q)}localStorage.removeItem("tacticstrike_active_match");try{ve.destroy()}catch(q){console.error("Error destroying gameEngine:",q)}ve=null}}catch(q){console.error("Error in leave match handler pre-disconnect:",q)}try{le&&wt&&le.emit("leave-room")}catch(q){console.error("Error emitting leave-room:",q)}try{Bs()}catch(q){console.error("Error disconnecting socket:",q)}try{ti("menu")}catch(q){console.error("Error showing menu screen:",q)}}),window.addEventListener("beforeunload",$=>{if(ve&&ve.active&&ve.gameState!=="match-over")return $.preventDefault(),$.returnValue="",""});const se=document.getElementById("btn-rematch");se&&se.addEventListener("click",()=>{if(ve&&ve.mode==="offline")yn&&yn.classList.remove("active"),ve&&(ve.destroy(),ve=null),vh();else{se.disabled=!0,se.innerText="WAITING...";const $=document.getElementById("rematch-status");$&&($.innerText="Rematch requested. Waiting for opponent..."),le&&le.emit("request-rematch")}}),window.addEventListener("keydown",$=>{$.key==="Enter"&&($.preventDefault(),Oe.chat&&document.activeElement===Oe.chat?Ox():Si.game&&Si.game.classList.contains("active")&&rt.chatDrawer&&Oe.chat&&(rt.chatDrawer.classList.add("active"),Oe.chat.focus()))}),Oe.chat&&Oe.chat.addEventListener("blur",()=>{setTimeout(()=>{Oe.chat&&document.activeElement!==Oe.chat&&rt.chatDrawer&&rt.chatDrawer.classList.remove("active")},100)}),Oe.qpMapSelect&&(Oe.qpMapSelect.value=Ln,Oe.qpMapSelect.addEventListener("change",$=>{Ln=$.target.value,be.setItem("tacticstrike_selected_map",Ln),kt()})),Oe.lobbyMapSelect&&Oe.lobbyMapSelect.addEventListener("change",$=>{const q=$.target.value;le&&wt&&le.emit("select-map",{mapId:q}),kt()}),Oe.lobbyModeSelect&&Oe.lobbyModeSelect.addEventListener("change",$=>{const q=$.target.value;le&&wt&&le.emit("select-game-mode",{mode:q}),kt()}),Oe.lobbyStyleSelect&&Oe.lobbyStyleSelect.addEventListener("change",$=>{const q=$.target.value;le&&wt&&le.emit("select-render-style",{renderStyle:q}),kt()})}function Ox(){if(!Oe.chat)return;const n=Oe.chat.value.trim();n&&(Wl(Ye,n,"self"),le&&wt&&le.emit("chat-message",{name:Ye,msg:n}),Oe.chat.value=""),Oe.chat.blur()}function Wl(n,e,t){const i=document.createElement("div");i.className=`chat-msg ${t}`,t==="system"?i.innerHTML=`<span class="message">${Wn(e)}</span>`:i.innerHTML=`
      <span class="author">${Wn(n)}:</span>
      <span class="message">${Wn(e)}</span>
    `,rt.chatMessages&&(rt.chatMessages.appendChild(i),rt.chatMessages.scrollTop=rt.chatMessages.scrollHeight),rt.chatDrawer&&rt.chatDrawer.classList.add("active"),window.chatTimeout&&clearTimeout(window.chatTimeout),window.chatTimeout=setTimeout(()=>{Oe.chat&&document.activeElement!==Oe.chat&&rt.chatDrawer&&rt.chatDrawer.classList.remove("active")},4e3)}function Pi(n){Wl("",n,"system")}function tr(n,e,t){var r;const i=document.getElementById("kill-feed");if(!i)return;const s=document.createElement("div");s.className="kill-msg";const a=((r=fr[t])==null?void 0:r.name)||t;s.innerHTML=`
    <span class="killer">${Wn(n)}</span> 
    🔫 [<span class="weapon">${a}</span>] ➔ 
    <span class="victim">${Wn(e)}</span>
  `,i.appendChild(s),setTimeout(()=>s.remove(),5e3)}function Wn(n){return n.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]||e)}function zx(){const n=document.querySelectorAll("#lobby-color-selector .color-option");n.forEach(t=>{t.addEventListener("click",()=>{n.forEach(s=>{s.classList.remove("active"),s.style.borderColor="transparent"}),t.classList.add("active"),Zt=t.dataset.color;const i={cyan:"#66fcf1",green:"#39db14",purple:"#9d3bff",orange:"#ff7f3b",yellow:"#ffd700",red:"#ff3c3c"};t.style.borderColor=i[Zt],be.setItem("tacticstrike_player_color",Zt),le&&wt&&le.emit("select-color",{color:Zt})})});const e=be.getItem("tacticstrike_player_color");if(e){const t=document.querySelector(`#lobby-color-selector .color-option[data-color="${e}"]`);t&&t.click()}}function Vx(){document.querySelectorAll('input[name="match-mode"]').forEach(e=>{e.addEventListener("change",()=>{Ht=e.value,Gl()})})}function Gl(){const n=Ht==="2v2"?"2V2 SQUAD":"1V1 DUEL",e=(Ks[ht]||ht||"Pistol").toUpperCase(),t=document.getElementById("match-config-summary"),i=document.getElementById("match-loadout-value");t&&(t.textContent=`${n} / ${e}`),i&&(i.textContent=e)}function Hx(){const n=document.getElementById("btn-qp-style-realistic"),e=document.getElementById("btn-qp-style-competitive");if(!n||!e)return;function t(){Mi==="competitive"?(e.classList.add("active"),n.classList.remove("active")):(n.classList.add("active"),e.classList.remove("active"))}n.addEventListener("click",()=>{Mi="realistic",be.setItem("tacticstrike_qp_style","realistic"),t(),kt()}),e.addEventListener("click",()=>{Mi="competitive",be.setItem("tacticstrike_qp_style","competitive"),t(),kt()}),t()}function Wx(){const n=document.querySelectorAll("#menu-weapon-selector .weapon-btn");n.forEach(e=>{e.addEventListener("click",t=>{if(e.classList.contains("locked")){t.preventDefault(),t.stopPropagation(),Rs();return}n.forEach(s=>s.classList.remove("active")),e.classList.add("active"),ht=e.dataset.weapon,be.setItem("tacticstrike_player_weapon",ht),Gl(),kt(),document.querySelectorAll(".weapon-option").forEach(s=>{s.dataset.weapon===ht?s.classList.add("active"):s.classList.remove("active")}),Es(ht),le&&wt&&le.emit("select-weapon",{weapon:ht})})})}function Tn(n,e=8e3){const t=document.getElementById("notification-container");if(!t)return;const i=document.createElement("div");i.className="custom-toast",i.style.cssText=`
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
  `,i.appendChild(s);const a=document.createElement("div");a.style.paddingLeft="6px",a.innerText=n,i.appendChild(a),i.addEventListener("click",()=>{i.style.opacity="0",i.style.transform="translateX(50px)",setTimeout(()=>i.remove(),350)}),t.appendChild(i),requestAnimationFrame(()=>{i.style.opacity="1",i.style.transform="translateX(0)"}),setTimeout(()=>{i.parentNode&&(i.style.opacity="0",i.style.transform="translateX(50px)",setTimeout(()=>i.remove(),350))},e)}document.addEventListener("DOMContentLoaded",()=>{if(/Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS/i.test(navigator.userAgent)||window.innerWidth<800){Bl({immediate:!0});const l=document.getElementById("mobile-warning-screen");l&&(l.style.display="flex");return}const e=document.getElementById("startup-status");e&&It.token&&(e.textContent="RESTORING OPERATIVE SESSION");const t=localStorage.getItem("tacticstrike_active_match");if(t){if(pr(!1),t==="ranked"){const l=parseInt(localStorage.getItem("tacticstrike_rp")||"0"),c=Math.max(0,l-40);localStorage.setItem("tacticstrike_rp",String(c)),localStorage.setItem("tacticstrike_mm_ban_until",String(Date.now()+5*60*1e3)),alert(`GAME LOST

You left a ranked match. The result was recorded as a loss (-40 RP).

MATCHMAKING BAN: 5 minutes.`)}else alert(`GAME LOST

You disconnected from an active match. Recorded as a loss.`);localStorage.removeItem("tacticstrike_active_match")}Ux();const i=ev();Gx(),Xx(),qx(),Zx(),Qx(),tv(),Bx(),Wx(),zx(),Vx(),Hx(),Fx(),Dx();const s=be.getItem("tacticstrike_player_name");if(s)Ye=s;else{const l=["Viper","Ghost","Specter","Rex","Apex","Phantom","Onyx","Nova"];Ye=`${l[Math.floor(Math.random()*l.length)]}_${Math.floor(Math.random()*900+100)}`,be.setItem("tacticstrike_player_name",Ye)}Oe.name&&(Oe.name.value=Ye),Ha(),ti("menu"),nr(),setInterval(()=>{const l=document.querySelector(".screen.active");(!le||!le.connected)&&l&&l.id==="menu-screen"&&nr()},15e3),zl(),Hl(),ht=be.getItem("tacticstrike_player_weapon")||"pistol",Ol(),document.querySelectorAll("#menu-weapon-selector .weapon-btn").forEach(l=>{l.dataset.weapon===ht?l.classList.add("active"):l.classList.remove("active")}),document.querySelectorAll(".weapon-option").forEach(l=>{l.dataset.weapon===ht?l.classList.add("active"):l.classList.remove("active")}),Es(ht),Gl(),wx(i)});function oo(n){const e=Hn[n];if(!e)return!0;try{if(JSON.parse(be.getItem("tacticstrike_purchased_weapons")||"[]").includes(n))return!0}catch{}return parseInt(be.getItem("tacticstrike_rp")||"0")>=e.rp}function Gx(){const n=document.getElementById("news-modal"),e=document.getElementById("btn-close-news");if(!n||!e)return;sessionStorage.getItem("tacticstrike_news_seen")||n.classList.add("active"),e.addEventListener("click",()=>{n.classList.remove("active"),sessionStorage.setItem("tacticstrike_news_seen","true"),kt()})}function Xx(){const n=document.getElementById("whats-new-modal"),e=document.getElementById("btn-open-whats-new"),t=document.getElementById("btn-close-whats-new");!n||!e||!t||(e.addEventListener("click",()=>{n.classList.add("active"),kt()}),t.addEventListener("click",()=>{n.classList.remove("active"),kt()}))}function qx(){const n=document.getElementById("credit-shop-modal"),e=document.getElementById("btn-open-credit-shop"),t=document.getElementById("btn-close-credit-shop"),i=document.querySelectorAll("#credit-shop-modal [data-buy-credit-pack]");!n||!t||(e==null||e.addEventListener("click",()=>ml("menu")),document.addEventListener("click",s=>{var r;const a=s.target.closest("[data-open-credit-shop]");a&&(a.closest("#account-modal")&&((r=document.getElementById("account-modal"))==null||r.classList.remove("active")),ml(a.closest("#shop-modal")?"item-shop":"menu"))}),document.addEventListener("click",s=>{const a=s.target.closest("[data-buy-credit-pack]");a&&(s.preventDefault(),$x(a.dataset.buyCreditPack))}),t.addEventListener("click",()=>{n.classList.remove("active"),Ei("close")}),i.forEach(s=>s.addEventListener("click",()=>Ei("confirm"))))}function ml(n="menu"){const e=document.getElementById("credit-shop-modal");e&&(e.dataset.source=n,e.classList.add("active"),Ei("open"))}async function $x(n){if(!It.user||!It.token){js("login","Sign in or create an account before purchasing credits.");return}const e=document.querySelector(`[data-buy-credit-pack="${n}"]`),t=e==null?void 0:e.innerHTML;e&&(e.disabled=!0,e.textContent="OPENING SECURE CHECKOUT…");try{const i=await Ji("/api/credits/checkout",{method:"POST",body:JSON.stringify({packageId:n})});Ei("confirm"),window.location.assign(i.checkoutUrl)}catch(i){if(e&&(e.disabled=!1,e.innerHTML=t),i.status===401){ir(),js("login","Your session expired. Sign in again to continue.");return}Tn(i.message,6e3),Rs()}}function zn(n="",e=""){const t=document.getElementById("purchase-support-message");t&&(t.textContent=n,t.className=`support-notice${e?` ${e}`:""}`)}function mr(n){const e=new Date(n);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{dateStyle:"medium",timeStyle:"short"})}function Xl(n){return n.closed?"CLOSED":n.status==="approved"?`${n.creditsGranted.toLocaleString()} CREDITS ADDED`:n.status==="denied"?"DENIED":"AWAITING REVIEW"}function Ad(n){return n.closed?"closed":n.status||"open"}function Yx(n){return new Promise((e,t)=>{if(!n){t(new Error("Attach a receipt screenshot as proof of purchase."));return}if(!["image/png","image/jpeg","image/webp"].includes(n.type)){t(new Error("Upload a PNG, JPG, or WebP receipt image."));return}if(n.size>15e5){t(new Error("Receipt images must be smaller than 1.5 MB."));return}const i=new FileReader;i.onload=()=>e({name:n.name,data:i.result}),i.onerror=()=>t(new Error("The receipt image could not be read.")),i.readAsDataURL(n)})}function Rd(n){const e=document.createElement("div");e.className=`support-message-bubble ${n.senderRole}`;const t=document.createElement("div");t.className="support-message-meta";const i=document.createElement("span");i.textContent=n.senderRole==="admin"?"TACTICSTRIKE SUPPORT":"YOU";const s=document.createElement("span");if(s.textContent=mr(n.createdAt),t.append(i,s),e.appendChild(t),n.body){const a=document.createElement("div");a.textContent=n.body,e.appendChild(a)}if(n.proofData){const a=document.createElement("img");a.className="support-proof-image",a.src=n.proofData,a.alt=n.proofName?`Purchase proof: ${n.proofName}`:"Purchase proof",e.appendChild(a)}return e}function Kx(n){if(!(n!=null&&n.id))return;const e=`tacticstrike_server_credits_seen_${n.id}`,t=Math.max(0,parseInt(be.getItem(e)||"0")),i=Math.max(0,Number(n.credits||0));if(i>t){const s=Math.max(0,parseInt(be.getItem("tacticstrike_credits")||"0"));be.setItem("tacticstrike_credits",String(s+(i-t)))}be.setItem(e,String(i))}async function Wa(){var e;const n=document.getElementById("purchase-support-cases");if(n){n.innerHTML='<div class="support-empty-state">Loading secure conversations…</div>';try{const t=await Ji("/api/purchase-support/cases");if(t.user&&(It.user=t.user,_n()),!t.cases.length){n.innerHTML='<div class="support-empty-state">No purchase-verification chats yet.</div>';return}const i=await Promise.all(t.cases.map(s=>Ji(`/api/purchase-support/cases/${s.id}`)));n.innerHTML="",i.forEach(s=>jx(s.purchaseCase,n))}catch(t){if(t.status===401){ir(),(e=document.getElementById("purchase-support-modal"))==null||e.classList.remove("active"),js("login","Your session expired. Sign in again to view purchase support.");return}n.innerHTML='<div class="support-empty-state">Purchase chats could not be loaded. Try refreshing.</div>',zn(t.message,"error")}}}function jx(n,e){const t=document.createElement("article");t.className="support-case-card";const i=document.createElement("div");i.className="support-case-summary";const s=document.createElement("div"),a=document.createElement("strong");a.textContent=`ORDER ${n.orderNumber}`;const r=document.createElement("small");r.textContent=`${n.requestedCredits.toLocaleString()}-credit verification · opened ${mr(n.createdAt)}`,s.append(a,r);const o=document.createElement("span");o.className=`case-status ${Ad(n)}`,o.textContent=Xl(n),i.append(s,o),t.appendChild(i);const l=document.createElement("div");if(l.className="support-message-list",n.messages.forEach(c=>l.appendChild(Rd(c))),t.appendChild(l),!n.closed){const c=document.createElement("form");c.className="support-reply-form";const h=document.createElement("input");h.type="text",h.maxLength=1500,h.required=!0,h.placeholder="Reply to support…";const u=document.createElement("button");u.type="submit",u.textContent="SEND",c.append(h,u),c.addEventListener("submit",async d=>{d.preventDefault(),u.disabled=!0;try{await Ji(`/api/purchase-support/cases/${n.id}/messages`,{method:"POST",body:JSON.stringify({message:h.value})}),zn("Reply sent securely.","success"),await Wa()}catch(f){zn(f.message,"error")}finally{u.disabled=!1}}),t.appendChild(c)}e.appendChild(t),requestAnimationFrame(()=>{l.scrollTop=l.scrollHeight})}function Zx(){const n=document.getElementById("purchase-support-modal"),e=document.getElementById("btn-open-purchase-support"),t=document.getElementById("btn-close-purchase-support"),i=document.getElementById("btn-refresh-purchase-support"),s=document.getElementById("purchase-support-form");!n||!e||!t||!s||(e.addEventListener("click",()=>{if(!It.user||!It.token){js("login","Sign in before submitting purchase proof.");return}n.classList.add("active"),zn(),Ei("open"),Wa()}),t.addEventListener("click",()=>{n.classList.remove("active"),Ei("close")}),i==null||i.addEventListener("click",Wa),s.addEventListener("submit",async a=>{a.preventDefault();const r=s.querySelector('button[type="submit"]');r.disabled=!0,zn("Encrypting and submitting your purchase proof…","info");try{const o=document.getElementById("purchase-proof-file").files[0],l=await Yx(o);await Ji("/api/purchase-support/cases",{method:"POST",body:JSON.stringify({orderNumber:document.getElementById("purchase-order-number").value,packageId:document.getElementById("purchase-package").value,message:document.getElementById("purchase-support-text").value,proof:l})}),s.reset(),zn("Purchase proof submitted. Support will reply within 1–12 hours.","success"),Ei("confirm"),await Wa()}catch(o){zn(o.message,"error"),Rs()}finally{r.disabled=!1}}))}function fs(n="",e=""){const t=document.getElementById("admin-login-message");t&&(t.textContent=n,t.className=`support-notice${e?` ${e}`:""}`)}function gl(n){const e=document.getElementById("admin-login-view"),t=document.getElementById("admin-dashboard-view");e&&(e.hidden=n),t&&(t.hidden=!n)}function ql(){gs=null,Ul=null,be.removeItem(kl),gl(!1)}async function Xs(n=Ul){const e=document.getElementById("admin-case-list"),t=document.getElementById("admin-case-detail");if(!(!e||!t)){e.innerHTML='<div class="support-empty-state">Loading purchase queue…</div>';try{const i=await Ms("/api/admin/purchase-cases");if(!i.cases.length){e.innerHTML='<div class="support-empty-state">No messages submitted.</div>',t.innerHTML='<div class="support-empty-state">The verification queue is empty.</div>';return}e.innerHTML="",i.cases.forEach(a=>{const r=document.createElement("button");r.type="button",r.dataset.caseId=a.id,r.className=`admin-case-list-item${a.id===n?" active":""}`;const o=document.createElement("strong");o.textContent=a.userEmail||"Unknown account";const l=document.createElement("span");l.textContent=`Order ${a.orderNumber}`;const c=document.createElement("small");c.textContent=`${Xl(a)} · ${mr(a.updatedAt)}`,r.append(o,l,c),r.addEventListener("click",()=>_h(a.id)),e.appendChild(r)});const s=i.cases.some(a=>a.id===n)?n:i.cases[0].id;await _h(s,!1)}catch(i){if(i.status===401){ql(),fs("Admin session expired. Sign in again.","error");return}e.innerHTML='<div class="support-empty-state">The verification queue could not be loaded.</div>',t.innerHTML=""}}}async function _h(n,e=!0){var i;const t=document.getElementById("admin-case-detail");if(t){Ul=n,e&&(document.querySelectorAll(".admin-case-list-item").forEach(s=>s.classList.remove("active")),(i=document.querySelector(`.admin-case-list-item[data-case-id="${n}"]`))==null||i.classList.add("active")),t.innerHTML='<div class="support-empty-state">Loading secure chat…</div>';try{const s=await Ms(`/api/admin/purchase-cases/${n}`);Jx(s.purchaseCase)}catch(s){if(s.status===401){ql(),fs("Admin session expired. Sign in again.","error");return}t.innerHTML='<div class="support-empty-state">This purchase chat could not be loaded.</div>'}}}function Jx(n){const e=document.getElementById("admin-case-detail");if(!e)return;e.innerHTML="";const t=document.createElement("div");t.className="admin-case-detail-head";const i=document.createElement("div"),s=document.createElement("span");s.className="section-kicker",s.textContent=n.userEmail||"OPERATIVE ACCOUNT";const a=document.createElement("h3");a.textContent=`ORDER ${n.orderNumber}`;const r=document.createElement("p");r.textContent=`Requested package: ${n.requestedCredits.toLocaleString()} credits · opened ${mr(n.createdAt)}`,i.append(s,a,r);const o=document.createElement("span");o.className=`case-status ${Ad(n)}`,o.textContent=Xl(n),t.append(i,o),e.appendChild(t);const l=document.createElement("div");if(l.className="support-message-list admin-message-list",n.messages.forEach(d=>l.appendChild(Rd(d))),e.appendChild(l),!n.closed){const d=document.createElement("form");d.className="support-reply-form admin-reply-form";const f=document.createElement("input");f.type="text",f.maxLength=1500,f.required=!0,f.placeholder="Reply to this user…";const p=document.createElement("button");p.type="submit",p.textContent="SEND REPLY",d.append(f,p),d.addEventListener("submit",async v=>{v.preventDefault(),p.disabled=!0;try{await Ms(`/api/admin/purchase-cases/${n.id}/messages`,{method:"POST",body:JSON.stringify({message:f.value})}),await Xs(n.id)}catch(g){Tn(g.message,5e3)}finally{p.disabled=!1}}),e.appendChild(d)}const c=document.createElement("div");c.className="admin-actions",[50,500,2e3].forEach(d=>{const f=document.createElement("button");f.type="button",f.textContent=`ADD ${d.toLocaleString()} CREDITS`,f.disabled=n.closed||n.status==="approved",f.addEventListener("click",()=>lo(n,"grant",d)),c.appendChild(f)});const h=document.createElement("button");h.type="button",h.className="danger",h.textContent="DENY PROOF",h.disabled=n.closed||n.status==="approved",h.addEventListener("click",()=>lo(n,"deny"));const u=document.createElement("button");u.type="button",u.className="close-chat",u.textContent="CLOSE CHAT",u.disabled=n.closed,u.addEventListener("click",()=>lo(n,"close")),c.append(h,u),e.appendChild(c),requestAnimationFrame(()=>{l.scrollTop=l.scrollHeight})}async function lo(n,e,t=0){const i=e==="grant"?`Add ${t.toLocaleString()} credits to ${n.userEmail}? This cannot be granted twice.`:e==="deny"?`Deny the proof submitted for order ${n.orderNumber}?`:"Close this chat? The user will no longer be able to reply.";if(window.confirm(i))try{await Ms(`/api/admin/purchase-cases/${n.id}/decision`,{method:"POST",body:JSON.stringify({action:e,credits:t})}),Tn(e==="grant"?`${t.toLocaleString()} credits added.`:e==="deny"?"Proof denied.":"Chat closed.",4500),await Xs(n.id)}catch(s){Tn(s.message,5500),Rs()}}function Qx(){var o,l;const n=document.getElementById("admin-modal"),e=document.getElementById("version-admin-trigger"),t=document.getElementById("btn-close-admin"),i=document.getElementById("admin-login-form");if(!n||!t||!i)return;const s=()=>{n.classList.add("active"),fs(),gl(!!gs),Ei("open"),gs&&Xs()};let a=0,r=null;e==null||e.addEventListener("click",()=>{if(a+=1,clearTimeout(r),a>=5){a=0,s();return}r=setTimeout(()=>{a=0},2200)}),t.addEventListener("click",()=>{n.classList.remove("active"),Ei("close")}),i.addEventListener("submit",async c=>{c.preventDefault();const h=i.querySelector('button[type="submit"]');h.disabled=!0,fs("Authenticating with the secure server…","info");try{const u=await Ms("/api/admin/login",{method:"POST",body:JSON.stringify({username:document.getElementById("admin-username").value,password:document.getElementById("admin-password").value})});gs=u.token,be.setItem(kl,u.token),i.reset(),gl(!0),await Xs()}catch(u){fs(u.message,"error")}finally{h.disabled=!1}}),(o=document.getElementById("btn-refresh-admin-cases"))==null||o.addEventListener("click",()=>Xs()),(l=document.getElementById("btn-admin-logout"))==null||l.addEventListener("click",async()=>{try{await Ms("/api/admin/logout",{method:"POST"})}catch{}ql(),fs("Signed out of the admin dashboard.","success")})}function Yi(n="",e=""){const t=document.getElementById("account-message");t&&(t.textContent=n,t.className=`account-message${e?` ${e}`:""}`)}function Ga(n="login"){const e=document.getElementById("account-tab-login"),t=document.getElementById("account-tab-register"),i=document.getElementById("account-login-form"),s=document.getElementById("account-register-form"),a=n==="login";e==null||e.classList.toggle("active",a),t==null||t.classList.toggle("active",!a),e==null||e.setAttribute("aria-selected",String(a)),t==null||t.setAttribute("aria-selected",String(!a)),i&&(i.hidden=!a),s&&(s.hidden=a)}function _n(){const n=It.user;n&&(Kx(n),It.token&&be.setItem(Ss,JSON.stringify(n)));const e=document.getElementById("btn-open-account"),t=document.getElementById("credit-shop-account-status"),i=document.getElementById("account-profile-email"),s=document.getElementById("account-profile-credits"),a=document.getElementById("account-auth-view"),r=document.getElementById("account-profile-view"),o=document.querySelectorAll("#credit-shop-modal [data-buy-credit-pack]");if(e&&(e.textContent=n?`ACCOUNT · ${n.displayName||n.email.split("@")[0]}`:Vn?"ACCOUNT":"SIGN IN",e.classList.toggle("signed-in",!!n)),t){t.classList.toggle("signed-in",!!n);const l=t.querySelector("span:last-child");l&&(l.textContent=n?`SIGNED IN · ${n.email}`:Vn?"RESTORING ACCOUNT…":"SIGN IN TO PURCHASE")}i&&(i.textContent=(n==null?void 0:n.email)||""),s&&(s.textContent=String((n==null?void 0:n.credits)||0)),a&&(a.hidden=!!n),r&&(r.hidden=!n),o.forEach(l=>{l.firstChild&&(l.firstChild.textContent=n?"CONTINUE TO CHECKOUT ":Vn?"RESTORING ACCOUNT… ":"SIGN IN TO BUY ")})}function Sh(n){It={token:n.token,user:n.user},Vn=!1,be.setItem(Nl,n.token),be.setItem(Ss,JSON.stringify(n.user)),_n()}function ir(){It={token:null,user:null},Vn=!1,be.removeItem(Nl),be.removeItem(Ss),_n()}function js(n="login",e=""){var t;Ga(n),Yi(e,e?"info":""),_n(),(t=document.getElementById("account-modal"))==null||t.classList.add("active"),Ei("open")}function ev(){var s,a,r;const n=document.getElementById("account-modal"),e=document.getElementById("btn-close-account"),t=document.getElementById("account-login-form"),i=document.getElementById("account-register-form");return!n||!e||!t||!i?Promise.resolve():(document.addEventListener("click",o=>{o.target.closest("[data-open-account], #btn-open-account")&&js("login")}),e.addEventListener("click",()=>{n.classList.remove("active"),Ei("close")}),(s=document.getElementById("account-tab-login"))==null||s.addEventListener("click",()=>{Ga("login"),Yi()}),(a=document.getElementById("account-tab-register"))==null||a.addEventListener("click",()=>{Ga("register"),Yi()}),t.addEventListener("submit",async o=>{o.preventDefault();const l=t.querySelector('button[type="submit"]');l.disabled=!0,Yi("Authenticating…","info");try{const c=await Ji("/api/auth/login",{method:"POST",body:JSON.stringify({email:document.getElementById("account-login-email").value,password:document.getElementById("account-login-password").value})});Sh(c),Tn("Welcome back, operative.",4e3)}catch(c){Yi(c.message,"error")}finally{l.disabled=!1}}),i.addEventListener("submit",async o=>{o.preventDefault();const l=document.getElementById("account-register-password").value,c=document.getElementById("account-register-confirm").value;if(l!==c){Yi("Passcodes do not match.","error");return}const h=i.querySelector('button[type="submit"]');h.disabled=!0,Yi("Creating secure operative profile…","info");try{const u=await Ji("/api/auth/register",{method:"POST",body:JSON.stringify({email:document.getElementById("account-register-email").value,password:l})});Sh(u),Tn("Operative account created.",4500)}catch(u){Yi(u.message,"error")}finally{h.disabled=!1}}),(r=document.getElementById("btn-account-logout"))==null||r.addEventListener("click",async()=>{try{await Ji("/api/auth/logout",{method:"POST"})}catch{}ir(),Ga("login"),Yi("Signed out successfully.","success")}),_n(),It.token?Ji("/api/auth/me").then(l=>{It.user=l.user,be.setItem(Ss,JSON.stringify(l.user)),_n()}).catch(l=>{if(l.status===401){ir();return}console.warn("Account session validation was delayed:",l)}).finally(()=>{Vn=!1,_n()}):(Vn=!1,_n(),Promise.resolve()))}function tv(){const n=document.getElementById("shop-modal"),e=document.getElementById("btn-open-shop"),t=document.getElementById("btn-close-shop");!n||!e||!t||(be.getItem("tacticstrike_credits")===null&&be.setItem("tacticstrike_credits","0"),e.addEventListener("click",()=>{Cd(),n.classList.add("active"),kt()}),t.addEventListener("click",()=>{n.classList.remove("active"),kt()}))}function Cd(){const n=document.getElementById("shop-items-container"),e=document.getElementById("shop-credits-display"),t=document.getElementById("shop-owned-count"),i=document.getElementById("shop-available-count");if(!n||!e)return;const s=parseInt(be.getItem("tacticstrike_credits")||"0");e.innerText=s;let a=[];try{a=JSON.parse(be.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}const r=parseInt(be.getItem("tacticstrike_rp")||"0");n.innerHTML="";let o=0,l=0;Object.keys(Hn).forEach(c=>{const h=Hn[c],u=Ax[c],d=a.includes(c),f=r>=h.rp,p=s>=h.price,v=d||f;v?o+=1:p&&(l+=1);const g=document.createElement("article");g.className=`shop-item-card tier-${u.tier.toLowerCase()}${v?" is-owned":""}${!p&&!v?" needs-credits":""}`;let m="",M="";d?(m='<span class="shop-item-status owned"><i></i>ACQUIRED</span>',M='<button class="shop-buy-action owned" disabled>IN YOUR ARMORY</button>'):f?(m='<span class="shop-item-status rank"><i></i>RANK UNLOCKED</span>',M='<button class="shop-buy-action owned" disabled>AVAILABLE IN LOADOUT</button>'):(m=`<span class="shop-item-status locked"><i></i>${h.rank} CLEARANCE</span>`,p?M=`<button class="shop-buy-action buy-btn" data-weapon="${c}">UNLOCK EARLY <span>→</span></button>`:M=`<button class="shop-buy-action top-up" type="button" data-open-credit-shop>GET CREDITS <span>+${(h.price-s).toLocaleString()}</span></button>`);const _=fr[c]||{name:c};g.innerHTML=`
      <div class="shop-item-topline">
        <span>${u.tier} ISSUE</span>
        ${m}
      </div>
      <div class="shop-item-visual" aria-hidden="true">
        <span class="shop-item-code">${u.code}</span>
        <span class="shop-item-crosshair"></span>
        <small>${u.role}</small>
      </div>
      <div class="shop-item-copy">
        <h4>${_.name}</h4>
        <p>${u.description}</p>
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
    `,n.appendChild(g)}),t&&(t.textContent=o),i&&(i.textContent=l),n.querySelectorAll(".buy-btn").forEach(c=>{c.addEventListener("click",()=>{const h=c.dataset.weapon;iv(h)})})}function iv(n){const e=Hn[n];if(!e)return;const t=parseInt(be.getItem("tacticstrike_credits")||"0");if(t<e.price){Rs(),Tn(`You need ${(e.price-t).toLocaleString()} more credits for ${Ks[n]}.`,4500),ml("item-shop");return}const i=t-e.price;be.setItem("tacticstrike_credits",String(i));let s=[];try{s=JSON.parse(be.getItem("tacticstrike_purchased_weapons")||"[]")}catch{}s.includes(n)||(s.push(n),be.setItem("tacticstrike_purchased_weapons",JSON.stringify(s)));try{const a=window.AudioContext||window.webkitAudioContext;if(a){const r=new a,o=r.createOscillator(),l=r.createGain();o.type="sine",o.frequency.setValueAtTime(587.33,r.currentTime),o.frequency.setValueAtTime(880,r.currentTime+.1),l.gain.setValueAtTime(.15,r.currentTime),l.gain.exponentialRampToValueAtTime(.001,r.currentTime+.35),o.connect(l),l.connect(r.destination),o.start(),o.stop(r.currentTime+.38)}}catch{}if(Tn(`Successfully unlocked ${Ks[n]} early!`,6e3),le){const a=Fl(),r=parseInt(be.getItem("tacticstrike_rp")||"0"),o=bs();le.emit("sync-device",{uuid:a,rp:r,wins:o.wins,losses:o.losses,name:Ye,credits:i,purchasedWeapons:s})}Cd(),Ol()}async function nr(){try{const n=await fetch(`${ur()}/api/player-counts`);if(!n.ok)return;const e=await n.json();Pd(e)}catch{}}function Pd(n){const e=document.getElementById("total-player-count-value"),t=document.getElementById("qp-player-count"),i=document.getElementById("ranked-real-player-count"),s=document.getElementById("ranked-comp-player-count"),a=document.getElementById("sabotage-player-count"),r=document.getElementById("worldloom-player-count");e&&n&&n.total!==void 0&&(e.innerText=n.total),t&&n&&n.quickplay!==void 0&&(t.innerText=n.quickplay),i&&n&&n.ranked_realistic!==void 0&&(i.innerText=n.ranked_realistic),s&&n&&n.ranked_competitive!==void 0&&(s.innerText=n.ranked_competitive),a&&n&&n.sabotage!==void 0&&(a.innerText=n.sabotage),r&&n&&n.worldloom!==void 0&&(r.innerText=n.worldloom)}const Mh=["ShadowViper","NovaStrike","GhostPulse","IronTactic","DarkHavoc","StormRider","PhantomUnit","RogueAgent","BlitzKing","NightOwl","ToxicViper","CrimsonGhost","AlphaWolf","ReaperSix","Frostbite","VenomStrike","LoneWolf","SilentHawk","RapidFire","SteelRaven","VoidWalker","SnapAim","HeadshotHero","TacticalTurtle","QuickScope","MidnightFox","SavageOtter","WraithOne","BulletMagnet","ClutchMaster","DriftKing","ZeroFear","HavocWolf","PixelSniper","RushHourZ","CamperKing","NoScopeNate","EchoSquad","VexArcher","GrimReaperz","SmokeCheck","FragMovie","LagSwitch","SpawnCamper","OneTapWonder","SilentStep","HeadhunterPro","Warlord77","TacticalTed","ClutchGod"];function co(){const n=Mh[Math.floor(Math.random()*Mh.length)],e=Math.random();return e<.4?n+(Math.floor(Math.random()*90)+10):e<.55?n+"X":e<.65?"xX"+n+"Xx":e<.75?n+"_"+(Math.floor(Math.random()*90)+10):n}window.addEventListener("opponent-chat-msg",n=>{const{name:e,msg:t}=n.detail;Wl(e,t,"opponent")});
