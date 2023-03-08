import {Subscribe} from "../subscribe/Subscribe";

const LZUTF8 = require("lzutf8");

var getCookie = function (name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
};


function DecodeWSMessage(str:string){
      var output = JSON.parse(LZUTF8.decompress(str,{inputEncoding:"Base64"}));
    return output;//JSON.parse(str);
}


/** @class Socket is an interface to a WebSocketServer **/
export class Socket {
    private _socket: WebSocket;
    private _subscribe: Subscribe;
    private _queue: any[] = []; // TODO SAVE BETWEEN LOCAL SESSIONS
    public connected: boolean;
    private loop;
    private endpoint;

    constructor() {
        this._subscribe = new Subscribe();
        this.connected = false;
        //@ts-ignore
        if (window) {
            this.loop = window.setInterval(this.healthcheck(), 31250);
        } else {
            this.loop = setInterval(this.healthcheck(), 31250);
        }
    }

    isConnected() {
        return this.connected;
    }

    healthcheck() {
        return () => {
            if (!this.endpoint) {
                return
            }
            if (!this.connected || this._queue.length) {
                console.log('healthcheck connected', this.connected, "queue length", this._queue.length);
            }
            if (!this.connected) {
                console.info('Not connected to server, attemping');
                // TODO Check if we even are on wifi or cellular before continuing
                if (!this.endpoint) {
                    return;
                }
                // this.connect(this.endpoint);

            } else {
                this._socket.send(JSON.stringify({
                    ping: true
                }));
            }

        }
    }

    send(data) {
        if (this.connected) {
            try {
                this._socket.send(JSON.stringify(data));
            } catch (e) {
                console.log('failed to send packet, put in queue');
                this._queue.push(data);
                this.connected = false;
                this.publish('disconnect', e);
            }
        } else {
            console.log('NOT CONNECTED TO SOCKET SERVER YET.. QUEUEING', data);
            this._queue.push(data);
        }
    }

    connect(endpoint: string): any {
        let _socket = this;
        if (this._socket) {
            this._socket.close();
        }
        this.endpoint = endpoint;
        this._socket = new WebSocket(endpoint);

        this._socket.binaryType = "arraybuffer";

        this._socket.onopen = (e) => {
            console.log('connected:', e);
            this.connected = true;
            // _socket._socket.send(JSON.stringify({
            //     handshake: true
            // }));

            //  _socket._socket.send(JSON.stringify({
            //      auth: window.localStorage.getItem('oakframe-uuid') || ''
            // }));

            this._queue.forEach((data) => {
                console.log('SENDING FROM QUEUE', data);

                window.setTimeout(() => {
                    this.send((data));
                }, 20);
            });
            this._queue = [];
            this.publish('connect', {});
        };
        this._socket.onmessage = function (e) {
            console.log('a',e.data);
            let json = DecodeWSMessage(e.data);
            console.log(json)
            for (var key in json) {
                if (json.hasOwnProperty(key)) {
                    let data = json[key];
                    _socket._subscribe.publish(key, data);
                }
            }
            _socket.publish(json, this);
        };

        this._socket.onclose = this._socket.onerror = function (e) {

            this.close();
            console.error('socket disconnected');
        };

    }

    close() {
        if (!this._socket || !this.isConnected()) {
            return true;
        }
        this._socket.close();
        this.connected = false;
        this._queue = [];
    }

    subscribe(slug: string, fn): any {
        return this._subscribe.subscribe(slug, fn);
    }

    unsubscribe(slug: string, uuid): any {
        return this._subscribe.unsubscribe(slug, uuid);
    }

    publish(packet, data) {
        return this._subscribe.publish(packet, data);
    }
}
