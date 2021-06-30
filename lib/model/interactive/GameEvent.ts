import {v4 as uuidv4} from 'uuid';
import {AABB2d} from "../math/AABB2d";

export interface RenderGameEventInterface {
    bounds: AABB2d;
}

export interface ClickGameEventInterface {
    button: number;
}

export class GameEventEmitter {
    _subscribers = [];

    on(identifier: string, callback: any): string {
        console.log("SUBSCRIBING TO ", identifier);
        if (!this._subscribers[identifier]) {
            this._subscribers[identifier] = [];
        }
        let u = uuidv4();
        this._subscribers[identifier].push({uuid: u, fn: callback});
        return u;
    }

    publish(identifier, data?): any {
        if (this._subscribers[identifier]) {
            this._subscribers[identifier].forEach(function (subscriberOb) {
                subscriberOb.fn(data);
            });
        }
    }

    off(identifier, uuid) {
        if (this._subscribers[identifier]) {
            let idx = -1;
            this._subscribers[identifier].forEach(function (subOb, i) {
                if (uuid === subOb.uuid) {
                    idx = i;
                }
            });
            if (idx != -1) {
                this._subscribers.splice(idx, 1);
            }
        }
    }
}