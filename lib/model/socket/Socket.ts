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

    constructor() {
        this._subscribe = new Subscribe();
    }

    send(data){
        this._socket.send(JSON.stringify(data));
    }

    connect(endpoint: string): any {
        let _socket = this;

        this._socket = new WebSocket(endpoint);

        this._socket.onopen = function (e) {
            console.log('connected:', e);
            _socket._socket.send(JSON.stringify({
                handshake: true}));
            _socket._socket.send(JSON.stringify({
                auth:localStorage.getItem('oakframe-uuid')||''
            }));
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
        this._socket.onerror = function (e) {
            console.log('ERR', e);
            _socket.publish(JSON.parse('error'), e);
        }
    }

    subscribe(slug: string, fn): any {
        this._subscribe.subscribe(slug, fn);
    }

    publish(packet, data) {
        this._subscribe.publish(packet, data);
    }
}