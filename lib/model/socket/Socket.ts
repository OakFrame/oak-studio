import {Subscribe} from "../subscribe/Subscribe";

var getCookie = function (name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
};

/** @class Socket is an interface to a WebSocketServer **/
export class Socket {
    private _socket: WebSocket;
    private _subscribe: Subscribe;
    private _queue: any[] = [];
    public connected: boolean = false;

    constructor() {
        this._subscribe = new Subscribe();
    }

    send(data) {
        if (this.connected) {
            try {
                this._socket.send(JSON.stringify(data));
            }catch (e){
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

        this._socket = new WebSocket(endpoint);

        this._socket.onopen = (e) => {
            console.log('connected:', e);
            this.connected = true;
            _socket._socket.send(JSON.stringify({
                handshake: true
            }));
            _socket._socket.send(JSON.stringify({
                auth: localStorage.getItem('oakframe-uuid') || ''
            }));

            this._queue.forEach((data) => {
                console.log('SENDING FROM QUEUE', data);

                this.send((data));
            });
            this._queue = [];
            this.publish('connect',{});
        };
        this._socket.onmessage = function (e) {
            let json = JSON.parse(e.data);
            for (var key in json) {
                if (json.hasOwnProperty(key)) {
                    let data = json[key];
                    _socket._subscribe.publish(key, data);
                }
            }
            _socket.publish(JSON.parse(e.data), this);
        };
        this._socket.onerror = (e) => {
            this.connected = false;
            console.log('ERR', e);
            _socket.publish('error', e);
            _socket.publish('disconnect', e);
        }
    }

    subscribe(slug: string, fn): any {
        this._subscribe.subscribe(slug, fn);
    }

    publish(packet, data) {
        this._subscribe.publish(packet, data);
    }
}
