import {Subscribe} from "../subscribe/Subscribe";
import {byteLength} from "../Utils";

var WebSocketClient = require('websocket').client


export class SocketClient {
    private _socket: any;
    private _subscribe: Subscribe;
    private _queue: any[] = []; // TODO SAVE BETWEEN LOCAL SESSIONS
    public connected: boolean;
    private loop;
    private endpoint;
    private connection;
    transfer: any;

    constructor() {
        this._subscribe = new Subscribe();
        this.connected = false;
        this.loop = setInterval(() => {
            this.healthcheck()
        }, 3250);
        this.transfer = {
            send: 0,
            receive: 0
        }
    }

    isConnected() {
        return this.connected;
    }

    healthcheck() {
        if (!this.endpoint) {
            return
        }
        // console.log('healthcheck', this.connected);
        if (!this.connected) {
            console.info('Not connected to server, attemping', this.connected, !!this._socket);
            // TODO Check if we even are on wifi or cellular before continuing

            this.connect(this.endpoint);

        } else {
            this.send({
                ping: true
            });
        }

    }

    send(data) {
        if (this.connected) {
            try {
                let s = JSON.stringify(data);
                this.connection.sendUTF(s);
                this.transfer.send += byteLength(s);
            } catch (e) {
                console.error('FAILED TO SEND', data, e);
                this.connected = false;
                this.publish('disconnect', e);
            }
        } else {
            console.log('NOT CONNECTED TO SOCKET SERVER YET.. QUEUEING', data);
            this._queue.push(data);
        }
    }

    connect(endpoint: string): any {

        if (this._socket) {
            this._socket.abort();
        }
        this.endpoint = endpoint;
        this._socket = new WebSocketClient();

        this._socket.on('connect', (connection: any) => {

            this.connected = true;
            this.connection = connection;

            connection.sendUTF(JSON.stringify({
                handshake: true
            }));

            this._queue.forEach((data) => {
                this.send(data);
            });
            this._queue = [];
            this.publish('connect', {});

            console.log('CONNECTED TO SOCKET THING', endpoint);

            connection.on('error', (error: any) => {
                console.log("Connection Error: " + error.toString());

                if (this.connected) {
                    this.publish('disconnect', error);
                }
                this.connected = false;
            });
            connection.on('close', () => {
                console.log('echo-protocol Connection Closed');

                if (this.connected) {
                    this.publish('disconnect', {});
                }
                this.connected = false;
            });

            connection.on('message', (message: any) => {
                console.log('MESSAGE', message);
                if (message.type === 'utf8') {
                    console.log("Received: '" + message.utf8Data + "'");
                    this.transfer.receive += byteLength(message.utf8Data);
                    let json;
                    try {
                        json = JSON.parse(message.utf8Data);
                        for (var key in json) {
                            if (json.hasOwnProperty(key)) {
                                let data = json[key];
                                this._subscribe.publish(key, message);
                            }
                        }
                        // _socket.publish(JSON.parse(e.data), this);
                    } catch (e) {
                        console.error('unable to parse message');
                        // process.exit(0);
                    }


                }
            });
        });

        this._socket.connect(endpoint, []);

    }

    subscribe(slug: string, fn): any {
        this._subscribe.subscribe(slug, fn);
    }

    publish(packet, data) {
        this._subscribe.publish(packet, data);
    }
}





