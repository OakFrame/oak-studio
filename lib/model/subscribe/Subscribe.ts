import {Subscriber} from "./Subscriber";
import {SubscribeInterface} from "../../interface/SubscribeInterface";
import {v4 as uuidv4} from 'uuid';

export class Subscribe implements SubscribeInterface {

    private _subscribers: any[];

    constructor() {
        this._subscribers = [];
    }

    getSubscribers(identifier: string): any {
        if (!this._subscribers[identifier]) {
            this._subscribers[identifier] = [];
        }
        return this._subscribers[identifier];
    }

    subscribe(identifier: string, callback: any): string {
        if (!this._subscribers[identifier]) {
            this._subscribers[identifier] = [];
        }
        let u = uuidv4();
        this._subscribers[identifier].push({uuid: u, fn: callback});
        //TODO return UUID here
        return u;
    }

    unsubscribe(identifier, uuid) {
        if (this._subscribers[identifier]) {
            let idx = -1;
            this._subscribers[identifier].forEach(function (subOb, i) {
                if (uuid === subOb.uuid) {
                    idx = i;
                }
            });
            if (idx != -1) {
                this._subscribers[identifier].splice(idx, 1);
            }else{
                console.error('Failed to unsubscribe', uuid);
            }
        }
    }

    publish(identifier, data?): any {
        if (this._subscribers[identifier]) {
            this._subscribers[identifier].forEach(function (subscriber) {
                subscriber.fn(data);
            });
        }
    }
}
