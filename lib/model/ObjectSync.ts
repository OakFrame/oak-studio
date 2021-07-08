import {Resource} from "./Cache";
import {Provider, SchemaProvider} from "../interface/Provider";

export class ObjectSync {
    _registered: Resource[][];
    _resources: Resource[][];
    _provider: SchemaProvider;
    _cached_uuids: Resource[];
    _cached_ids: Resource[];

    constructor(provider: SchemaProvider) {
        this._registered = [];
        this._resources = [];
        this._provider = provider;

        this._provider.on("register", async (schema) => {
           await this.rectifyDifference(schema.name, schema.register);
          //  console.log(3, 'REGISTER', schema);
        })

        this._cached_uuids = [];
        this._cached_ids = [];
    }

    search(schema, filter){

    }

    getDifference(res, existing) {
        return [];
    }

    getResources(schema_name) {
        return this._resources[schema_name] || [];
    }

    async rectifyDifference(schema: string, res: Resource) {

        let existing;

        if (res._id) {
            existing = await this.getResourceById(schema, res._id);
        }

        if (!existing) {
            existing = await this.getResourceByUUID(schema, res.uuid);
            if (existing) {
                existing._id = res._id;
                this._provider.publish("save")
            }
        }

        if (!existing){
            let newres = new Resource(res);
            if (this._registered[schema]){
                newres.data = new this._registered[schema](res.data)
            }

            //newres.type=schema;
            //console.log(2, 'ADDING RESROUCE', schema, newres);
            this.addResource(schema, newres);

            return;
        }

        if (existing) {
            if (res._last_modified > existing._last_modified) {
                console.log('new should overwrite');

                let differences = this.getDifference(res, existing);

         //       console.log("object differences", differences);
//                this.addResource()

            } else {
                console.log('existing takes precedent', existing);
            }
        }

        return null;

    }

    registerSchema(name: string, schema: any) {
        this._registered[name] = schema;
    }

    async addResource(schema: string, res: Resource) {
        if (!this._resources[schema]) {
            this._resources[schema] = [];
        }
        this._resources[schema].push(res);
        if (res.uuid) {
            this._cached_uuids[res.uuid] = res;
        }
        if (res._id) {
            this._cached_ids[res._id] = res;
        } else {
            this._provider.register(schema, res);
        }
        return res;
    }

    getResourceByUUID(schema: string, uuid: string) {
        if (this._cached_uuids[uuid]) {
            return this._cached_uuids[uuid];
        }
        if (this._resources[schema]) {
            let item;
            this._resources[schema].forEach((res) => {
                if (res.uuid === uuid) {
                    item = res;
                }
            })
            if (item) {
                return item;
            }
        }
        return null;
    }

    getResourceById(schema, id: string) {
        return this._provider.load(schema, id);
    }
}
