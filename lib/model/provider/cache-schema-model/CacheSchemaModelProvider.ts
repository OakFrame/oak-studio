import {v4 as uuidv4} from 'uuid';

import {SchemaProvider} from "../../../interface/Provider";
import {Socket} from "../../socket/Socket";
import {GameEventEmitter} from "../../interactive/GameEvent";
import {ApplicationRouter} from "../../ApplicationRouter";

export class CacheSchemaModelProvider implements SchemaProvider, GameEventEmitter {

    socket: Socket;
    app: ApplicationRouter;
    _subscribers: any[] = [];

    constructor(app, socket) {
        this.app = app;
        this.socket = socket;
        this.socket.subscribe('schema', async (schema) => {
            // data
            console.warn(1, 'GOT SOCKET DATA FOR SCHEMA', schema);

            if (schema.name && schema.search) {
                schema.search.forEach(async (s) => {
                    await this.publish('register', {name: schema.name, register: s});
                });
                schema.search.forEach(async (s) => {
                    await this.updateDataBind({name: schema.name, register: s});
                });
            } else {
                await this.publish('register', schema);
                await this.updateDataBind(schema);
            }

        });
    }

    async updateDataBind(schema) {

        if (schema.name && schema.register) {
            await this.app.publish(`schema.*`, schema.register);
            await this.app.publish(`schema.${schema.name}`, schema.register);
            await this.app.publish(`schema.${schema.name}.load.${schema.register.uuid}`, schema.register);

            if (schema.register.data && schema.register) {
                for (const prop in schema.register.data) {
                    if (typeof schema.register.data[prop] === "string") {
                         await this.app.publish(`schema.${schema.name}.load.*.${prop}.${schema.register.data[prop]}`, schema.register.data[prop]);

                    }
                }
            }

            // console.log(`schema.${schema.name}.load.${schema.register.uuid}`,schema.register);
        } else {
            //  this.publish('register', schema);
            // this.updateDataBind(schema);
        }

    }

    async register(schema, object) {
        this.socket.send({schema: {name: schema, register: object}});
    }

    async load(schema_name, id) {
        this.socket.send({schema: {name: schema_name, load: id}});
    }

    close(callback: any): any {
        return undefined;
    }

    on(identifier: string, callback: any): string {

        if (!this._subscribers[identifier]) {
            this._subscribers[identifier] = [];
        }
        let u = uuidv4();
        this._subscribers[identifier].push({uuid: u, fn: callback});
        //TODO return UUID here
        return u;
    }

    async publish(identifier, data?): Promise<any> {
        if (this._subscribers[identifier]) {
            this._subscribers[identifier].forEach(async (subscriberOb) => {
                await subscriberOb.fn(data);
            });
        }
    }

    off(identifier: any, uuid: any): void {
        throw new Error("Method not implemented.");
    }

}
