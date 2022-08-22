import {SchemaProvider} from "../../../interface/Provider";
import {v4 as uuidv4} from 'uuid';
import {Resource} from "../../Cache";
import {GameEventEmitter} from "../../interactive/GameEvent";
import {MongoDriver} from "../../../model/MongoDriver";

export class CacheSchemaServerProvider implements SchemaProvider, GameEventEmitter {

    db: MongoDriver;
    _subscribers: any[];

    constructor(db) {
        this.db = db;
        this._subscribers = [];
    }

    async load(schema_name, uuid) {

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

    publish(identifier, data?): any {
        if (this._subscribers[identifier]) {
            this._subscribers[identifier].forEach(function (subscriberOb) {
                subscriberOb.fn(data);
            });
        }
    }

    off(identifier: any, uuid: any): void {
        throw new Error("Method not implemented.");
    }

    async register(schema: string, res: Resource<any>) {
        if (!res._id) {
          //  console.log("THIS IS A NEW", schema, "ITEM??");

            const inserted = await <any>this.db.insertOne(schema, res);
            if (inserted) {
                //console.log('INSERTED', inserted);
                if (inserted.insertedCount) {
                    if (inserted.ops.length == 1) {
                        // console.log("ops",inserted.ops);

                        let ob = inserted.ops[0];
                        // console.log('WHAT', ob);
                        if (ob.data) {
                            delete ob.data;
                        }
                        return ob;
                    }
                }
            }

            return false;

            // res._id = uuidv4();
        } else {

            const existing: any = await this.db.findOne(schema, {_id: res._id});

            if (!existing) {
                console.log('COULD NOT FIND EXISTING FOR ', res._id);
                return null;
            }

            console.log('FOUND EXISTING', existing._id);

            //check if id exists


            // check if user has permissions for this _id,

            //if so, take the new submitted version and update it.
            if (res._last_modified > existing._last_modified) {
                console.log('new should overwrite');
            } else {
                console.log('existing takes precedent');
            }
        }


    }

}
