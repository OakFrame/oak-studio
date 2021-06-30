import { Resource } from "../model/Cache";
import {GameEventEmitter} from "../model/interactive/GameEvent";

//** @interface Provider is like a serializable promise
export interface Provider {
    close(callback: any): any;
}

//** @interface SchemaProvider is like a serializable promise
export interface SchemaProvider extends Provider, GameEventEmitter {
    register(schema:string, res:Resource);

    load(schema: string, id: string);
}