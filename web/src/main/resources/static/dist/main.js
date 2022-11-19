(()=>{"use strict";const e="\n";class t{constructor(e){const{command:t,headers:s,body:n,binaryBody:i,escapeHeaderValues:o,skipContentLengthHeader:r}=e;this.command=t,this.headers=Object.assign({},s||{}),i?(this._binaryBody=i,this.isBinaryBody=!0):(this._body=n||"",this.isBinaryBody=!1),this.escapeHeaderValues=o||!1,this.skipContentLengthHeader=r||!1}get body(){return!this._body&&this.isBinaryBody&&(this._body=(new TextDecoder).decode(this._binaryBody)),this._body}get binaryBody(){return this._binaryBody||this.isBinaryBody||(this._binaryBody=(new TextEncoder).encode(this._body)),this._binaryBody}static fromRawFrame(e,s){const n={},i=e=>e.replace(/^\s+|\s+$/g,"");for(const o of e.headers.reverse()){o.indexOf(":");const r=i(o[0]);let c=i(o[1]);s&&"CONNECT"!==e.command&&"CONNECTED"!==e.command&&(c=t.hdrValueUnEscape(c)),n[r]=c}return new t({command:e.command,headers:n,binaryBody:e.binaryBody,escapeHeaderValues:s})}toString(){return this.serializeCmdAndHeaders()}serialize(){const e=this.serializeCmdAndHeaders();return this.isBinaryBody?t.toUnit8Array(e,this._binaryBody).buffer:e+this._body+"\0"}serializeCmdAndHeaders(){const s=[this.command];this.skipContentLengthHeader&&delete this.headers["content-length"];for(const e of Object.keys(this.headers||{})){const n=this.headers[e];this.escapeHeaderValues&&"CONNECT"!==this.command&&"CONNECTED"!==this.command?s.push(`${e}:${t.hdrValueEscape(`${n}`)}`):s.push(`${e}:${n}`)}return(this.isBinaryBody||!this.isBodyEmpty()&&!this.skipContentLengthHeader)&&s.push(`content-length:${this.bodyLength()}`),s.join(e)+e+e}isBodyEmpty(){return 0===this.bodyLength()}bodyLength(){const e=this.binaryBody;return e?e.length:0}static sizeOfUTF8(e){return e?(new TextEncoder).encode(e).length:0}static toUnit8Array(e,t){const s=(new TextEncoder).encode(e),n=new Uint8Array([0]),i=new Uint8Array(s.length+t.length+n.length);return i.set(s),i.set(t,s.length),i.set(n,s.length+t.length),i}static marshall(e){return new t(e).serialize()}static hdrValueEscape(e){return e.replace(/\\/g,"\\\\").replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/:/g,"\\c")}static hdrValueUnEscape(e){return e.replace(/\\r/g,"\r").replace(/\\n/g,"\n").replace(/\\c/g,":").replace(/\\\\/g,"\\")}}class s{constructor(e,t){this.onFrame=e,this.onIncomingPing=t,this._encoder=new TextEncoder,this._decoder=new TextDecoder,this._token=[],this._initState()}parseChunk(e,t=!1){let s;if(s=e instanceof ArrayBuffer?new Uint8Array(e):this._encoder.encode(e),t&&0!==s[s.length-1]){const e=new Uint8Array(s.length+1);e.set(s,0),e[s.length]=0,s=e}for(let e=0;e<s.length;e++){const t=s[e];this._onByte(t)}}_collectFrame(e){0!==e&&13!==e&&(10!==e?(this._onByte=this._collectCommand,this._reinjectByte(e)):this.onIncomingPing())}_collectCommand(e){if(13!==e)return 10===e?(this._results.command=this._consumeTokenAsUTF8(),void(this._onByte=this._collectHeaders)):void this._consumeByte(e)}_collectHeaders(e){13!==e&&(10!==e?(this._onByte=this._collectHeaderKey,this._reinjectByte(e)):this._setupCollectBody())}_reinjectByte(e){this._onByte(e)}_collectHeaderKey(e){if(58===e)return this._headerKey=this._consumeTokenAsUTF8(),void(this._onByte=this._collectHeaderValue);this._consumeByte(e)}_collectHeaderValue(e){if(13!==e)return 10===e?(this._results.headers.push([this._headerKey,this._consumeTokenAsUTF8()]),this._headerKey=void 0,void(this._onByte=this._collectHeaders)):void this._consumeByte(e)}_setupCollectBody(){const e=this._results.headers.filter((e=>"content-length"===e[0]))[0];e?(this._bodyBytesRemaining=parseInt(e[1],10),this._onByte=this._collectBodyFixedSize):this._onByte=this._collectBodyNullTerminated}_collectBodyNullTerminated(e){0!==e?this._consumeByte(e):this._retrievedBody()}_collectBodyFixedSize(e){0!=this._bodyBytesRemaining--?this._consumeByte(e):this._retrievedBody()}_retrievedBody(){this._results.binaryBody=this._consumeTokenAsRaw(),this.onFrame(this._results),this._initState()}_consumeByte(e){this._token.push(e)}_consumeTokenAsUTF8(){return this._decoder.decode(this._consumeTokenAsRaw())}_consumeTokenAsRaw(){const e=new Uint8Array(this._token);return this._token=[],e}_initState(){this._results={command:void 0,headers:[],binaryBody:void 0},this._token=[],this._headerKey=void 0,this._onByte=this._collectFrame}}var n,i;!function(e){e[e.CONNECTING=0]="CONNECTING",e[e.OPEN=1]="OPEN",e[e.CLOSING=2]="CLOSING",e[e.CLOSED=3]="CLOSED"}(n||(n={})),function(e){e[e.ACTIVE=0]="ACTIVE",e[e.DEACTIVATING=1]="DEACTIVATING",e[e.INACTIVE=2]="INACTIVE"}(i||(i={}));class o{constructor(e){this.versions=e}supportedVersions(){return this.versions.join(",")}protocolVersions(){return this.versions.map((e=>`v${e.replace(".","")}.stomp`))}}o.V1_0="1.0",o.V1_1="1.1",o.V1_2="1.2",o.default=new o([o.V1_0,o.V1_1,o.V1_2]);class r{constructor(e,t,s={}){this._client=e,this._webSocket=t,this._serverFrameHandlers={CONNECTED:e=>{this.debug(`connected to server ${e.headers.server}`),this._connected=!0,this._connectedVersion=e.headers.version,this._connectedVersion===o.V1_2&&(this._escapeHeaderValues=!0),this._setupHeartbeat(e.headers),this.onConnect(e)},MESSAGE:e=>{const t=e.headers.subscription,s=this._subscriptions[t]||this.onUnhandledMessage,n=e,i=this,r=this._connectedVersion===o.V1_2?n.headers.ack:n.headers["message-id"];n.ack=(e={})=>i.ack(r,t,e),n.nack=(e={})=>i.nack(r,t,e),s(n)},RECEIPT:e=>{const t=this._receiptWatchers[e.headers["receipt-id"]];t?(t(e),delete this._receiptWatchers[e.headers["receipt-id"]]):this.onUnhandledReceipt(e)},ERROR:e=>{this.onStompError(e)}},this._counter=0,this._subscriptions={},this._receiptWatchers={},this._partialData="",this._escapeHeaderValues=!1,this._lastServerActivityTS=Date.now(),this.configure(s)}get connectedVersion(){return this._connectedVersion}get connected(){return this._connected}configure(e){Object.assign(this,e)}start(){const e=new s((e=>{const s=t.fromRawFrame(e,this._escapeHeaderValues);this.logRawCommunication||this.debug(`<<< ${s}`),(this._serverFrameHandlers[s.command]||this.onUnhandledFrame)(s)}),(()=>{this.debug("<<< PONG")}));this._webSocket.onmessage=t=>{if(this.debug("Received data"),this._lastServerActivityTS=Date.now(),this.logRawCommunication){const e=t.data instanceof ArrayBuffer?(new TextDecoder).decode(t.data):t.data;this.debug(`<<< ${e}`)}e.parseChunk(t.data,this.appendMissingNULLonIncoming)},this._onclose=e=>{this.debug(`Connection closed to ${this._client.brokerURL}`),this._cleanUp(),this.onWebSocketClose(e)},this._webSocket.onclose=this._onclose,this._webSocket.onerror=e=>{this.onWebSocketError(e)},this._webSocket.onopen=()=>{const e=Object.assign({},this.connectHeaders);this.debug("Web Socket Opened..."),e["accept-version"]=this.stompVersions.supportedVersions(),e["heart-beat"]=[this.heartbeatOutgoing,this.heartbeatIncoming].join(","),this._transmit({command:"CONNECT",headers:e})}}_setupHeartbeat(t){if(t.version!==o.V1_1&&t.version!==o.V1_2)return;if(!t["heart-beat"])return;const[s,i]=t["heart-beat"].split(",").map((e=>parseInt(e,10)));if(0!==this.heartbeatOutgoing&&0!==i){const t=Math.max(this.heartbeatOutgoing,i);this.debug(`send PING every ${t}ms`),this._pinger=setInterval((()=>{this._webSocket.readyState===n.OPEN&&(this._webSocket.send(e),this.debug(">>> PING"))}),t)}if(0!==this.heartbeatIncoming&&0!==s){const e=Math.max(this.heartbeatIncoming,s);this.debug(`check PONG every ${e}ms`),this._ponger=setInterval((()=>{const t=Date.now()-this._lastServerActivityTS;t>2*e&&(this.debug(`did not receive server activity for the last ${t}ms`),this._closeOrDiscardWebsocket())}),e)}}_closeOrDiscardWebsocket(){this.discardWebsocketOnCommFailure?(this.debug("Discarding websocket, the underlying socket may linger for a while"),this._discardWebsocket()):(this.debug("Issuing close on the websocket"),this._closeWebsocket())}forceDisconnect(){this._webSocket&&(this._webSocket.readyState!==n.CONNECTING&&this._webSocket.readyState!==n.OPEN||this._closeOrDiscardWebsocket())}_closeWebsocket(){this._webSocket.onmessage=()=>{},this._webSocket.close()}_discardWebsocket(){var e,t;this._webSocket.terminate||(e=this._webSocket,t=e=>this.debug(e),e.terminate=function(){const e=()=>{};this.onerror=e,this.onmessage=e,this.onopen=e;const s=new Date,n=this.onclose;this.onclose=e=>{const n=(new Date).getTime()-s.getTime();t(`Discarded socket closed after ${n}ms, with code/reason: ${e.code}/${e.reason}`)},this.close(),n.call(this,{code:4001,reason:"Heartbeat failure, discarding the socket",wasClean:!1})}),this._webSocket.terminate()}_transmit(e){const{command:s,headers:n,body:i,binaryBody:o,skipContentLengthHeader:r}=e,c=new t({command:s,headers:n,body:i,binaryBody:o,escapeHeaderValues:this._escapeHeaderValues,skipContentLengthHeader:r});let a=c.serialize();if(this.logRawCommunication?this.debug(`>>> ${a}`):this.debug(`>>> ${c}`),this.forceBinaryWSFrames&&"string"==typeof a&&(a=(new TextEncoder).encode(a)),"string"==typeof a&&this.splitLargeFrames){let e=a;for(;e.length>0;){const t=e.substring(0,this.maxWebSocketChunkSize);e=e.substring(this.maxWebSocketChunkSize),this._webSocket.send(t),this.debug(`chunk sent = ${t.length}, remaining = ${e.length}`)}}else this._webSocket.send(a)}dispose(){if(this.connected)try{const e=Object.assign({},this.disconnectHeaders);e.receipt||(e.receipt="close-"+this._counter++),this.watchForReceipt(e.receipt,(e=>{this._closeWebsocket(),this._cleanUp(),this.onDisconnect(e)})),this._transmit({command:"DISCONNECT",headers:e})}catch(e){this.debug(`Ignoring error during disconnect ${e}`)}else this._webSocket.readyState!==n.CONNECTING&&this._webSocket.readyState!==n.OPEN||this._closeWebsocket()}_cleanUp(){this._connected=!1,this._pinger&&clearInterval(this._pinger),this._ponger&&clearInterval(this._ponger)}publish(e){const{destination:t,headers:s,body:n,binaryBody:i,skipContentLengthHeader:o}=e,r=Object.assign({destination:t},s);this._transmit({command:"SEND",headers:r,body:n,binaryBody:i,skipContentLengthHeader:o})}watchForReceipt(e,t){this._receiptWatchers[e]=t}subscribe(e,t,s={}){(s=Object.assign({},s)).id||(s.id="sub-"+this._counter++),s.destination=e,this._subscriptions[s.id]=t,this._transmit({command:"SUBSCRIBE",headers:s});const n=this;return{id:s.id,unsubscribe:e=>n.unsubscribe(s.id,e)}}unsubscribe(e,t={}){t=Object.assign({},t),delete this._subscriptions[e],t.id=e,this._transmit({command:"UNSUBSCRIBE",headers:t})}begin(e){const t=e||"tx-"+this._counter++;this._transmit({command:"BEGIN",headers:{transaction:t}});const s=this;return{id:t,commit(){s.commit(t)},abort(){s.abort(t)}}}commit(e){this._transmit({command:"COMMIT",headers:{transaction:e}})}abort(e){this._transmit({command:"ABORT",headers:{transaction:e}})}ack(e,t,s={}){s=Object.assign({},s),this._connectedVersion===o.V1_2?s.id=e:s["message-id"]=e,s.subscription=t,this._transmit({command:"ACK",headers:s})}nack(e,t,s={}){return s=Object.assign({},s),this._connectedVersion===o.V1_2?s.id=e:s["message-id"]=e,s.subscription=t,this._transmit({command:"NACK",headers:s})}}var c=function(e,t,s,n){return new(s||(s=Promise))((function(i,o){function r(e){try{a(n.next(e))}catch(e){o(e)}}function c(e){try{a(n.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(r,c)}a((n=n.apply(e,t||[])).next())}))};const a=new class{constructor(e={}){this.stompVersions=o.default,this.connectionTimeout=0,this.reconnectDelay=5e3,this.heartbeatIncoming=1e4,this.heartbeatOutgoing=1e4,this.splitLargeFrames=!1,this.maxWebSocketChunkSize=8192,this.forceBinaryWSFrames=!1,this.appendMissingNULLonIncoming=!1,this.state=i.INACTIVE;const t=()=>{};this.debug=t,this.beforeConnect=t,this.onConnect=t,this.onDisconnect=t,this.onUnhandledMessage=t,this.onUnhandledReceipt=t,this.onUnhandledFrame=t,this.onStompError=t,this.onWebSocketClose=t,this.onWebSocketError=t,this.logRawCommunication=!1,this.onChangeState=t,this.connectHeaders={},this._disconnectHeaders={},this.configure(e)}get webSocket(){return this._stompHandler?this._stompHandler._webSocket:void 0}get disconnectHeaders(){return this._disconnectHeaders}set disconnectHeaders(e){this._disconnectHeaders=e,this._stompHandler&&(this._stompHandler.disconnectHeaders=this._disconnectHeaders)}get connected(){return!!this._stompHandler&&this._stompHandler.connected}get connectedVersion(){return this._stompHandler?this._stompHandler.connectedVersion:void 0}get active(){return this.state===i.ACTIVE}_changeState(e){this.state=e,this.onChangeState(e)}configure(e){Object.assign(this,e)}activate(){if(this.state===i.DEACTIVATING)throw this.debug("Still DEACTIVATING, please await call to deactivate before trying to re-activate"),new Error("Still DEACTIVATING, can not activate now");this.active?this.debug("Already ACTIVE, ignoring request to activate"):(this._changeState(i.ACTIVE),this._connect())}_connect(){return c(this,void 0,void 0,(function*(){if(this.connected)return void this.debug("STOMP: already connected, nothing to do");if(yield this.beforeConnect(),!this.active)return void this.debug("Client has been marked inactive, will not attempt to connect");this.connectionTimeout>0&&(this._connectionWatcher&&clearTimeout(this._connectionWatcher),this._connectionWatcher=setTimeout((()=>{this.connected||(this.debug(`Connection not established in ${this.connectionTimeout}ms, closing socket`),this.forceDisconnect())}),this.connectionTimeout)),this.debug("Opening Web Socket...");const e=this._createWebSocket();this._stompHandler=new r(this,e,{debug:this.debug,stompVersions:this.stompVersions,connectHeaders:this.connectHeaders,disconnectHeaders:this._disconnectHeaders,heartbeatIncoming:this.heartbeatIncoming,heartbeatOutgoing:this.heartbeatOutgoing,splitLargeFrames:this.splitLargeFrames,maxWebSocketChunkSize:this.maxWebSocketChunkSize,forceBinaryWSFrames:this.forceBinaryWSFrames,logRawCommunication:this.logRawCommunication,appendMissingNULLonIncoming:this.appendMissingNULLonIncoming,discardWebsocketOnCommFailure:this.discardWebsocketOnCommFailure,onConnect:e=>{if(this._connectionWatcher&&(clearTimeout(this._connectionWatcher),this._connectionWatcher=void 0),!this.active)return this.debug("STOMP got connected while deactivate was issued, will disconnect now"),void this._disposeStompHandler();this.onConnect(e)},onDisconnect:e=>{this.onDisconnect(e)},onStompError:e=>{this.onStompError(e)},onWebSocketClose:e=>{this._stompHandler=void 0,this.state===i.DEACTIVATING&&(this._resolveSocketClose(),this._resolveSocketClose=void 0,this._changeState(i.INACTIVE)),this.onWebSocketClose(e),this.active&&this._schedule_reconnect()},onWebSocketError:e=>{this.onWebSocketError(e)},onUnhandledMessage:e=>{this.onUnhandledMessage(e)},onUnhandledReceipt:e=>{this.onUnhandledReceipt(e)},onUnhandledFrame:e=>{this.onUnhandledFrame(e)}}),this._stompHandler.start()}))}_createWebSocket(){let e;return e=this.webSocketFactory?this.webSocketFactory():new WebSocket(this.brokerURL,this.stompVersions.protocolVersions()),e.binaryType="arraybuffer",e}_schedule_reconnect(){this.reconnectDelay>0&&(this.debug(`STOMP: scheduling reconnection in ${this.reconnectDelay}ms`),this._reconnector=setTimeout((()=>{this._connect()}),this.reconnectDelay))}deactivate(){return c(this,void 0,void 0,(function*(){let e;return this.state!==i.ACTIVE?(this.debug(`Already ${i[this.state]}, ignoring call to deactivate`),Promise.resolve()):(this._changeState(i.DEACTIVATING),this._reconnector&&clearTimeout(this._reconnector),this._stompHandler&&this.webSocket.readyState!==n.CLOSED?(e=new Promise(((e,t)=>{this._resolveSocketClose=e})),this._disposeStompHandler(),e):(this._changeState(i.INACTIVE),Promise.resolve()))}))}forceDisconnect(){this._stompHandler&&this._stompHandler.forceDisconnect()}_disposeStompHandler(){this._stompHandler&&(this._stompHandler.dispose(),this._stompHandler=null)}publish(e){this._stompHandler.publish(e)}watchForReceipt(e,t){this._stompHandler.watchForReceipt(e,t)}subscribe(e,t,s={}){return this._stompHandler.subscribe(e,t,s)}unsubscribe(e,t={}){this._stompHandler.unsubscribe(e,t)}begin(e){return this._stompHandler.begin(e)}commit(e){this._stompHandler.commit(e)}abort(e){this._stompHandler.abort(e)}ack(e,t,s={}){this._stompHandler.ack(e,t,s)}nack(e,t,s={}){this._stompHandler.nack(e,t,s)}}({brokerURL:"ws://localhost:8080/hello",debug:function(e){console.log(e)},reconnectDelay:5e3,heartbeatIncoming:4e3,heartbeatOutgoing:4e3});a.onConnect=function(e){},a.onStompError=function(e){console.log("Broker reported error: "+e.headers.message),console.log("Additional details: "+e.body)},a.activate()})();