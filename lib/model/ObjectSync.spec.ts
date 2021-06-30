import {expect} from 'chai';
import {CacheModel, Resource} from './Cache';
import {CacheSchemaModelProvider} from "./provider/cache-schema-model/CacheSchemaModelProvider";
import {SchemaProvider} from "../interface/Provider";
import {GameEventEmitter} from "./interactive/GameEvent";
import {ObjectSync} from './ObjectSync';

describe('ObjectSync', () => {

    class CacheSchemaMockProvider implements SchemaProvider, GameEventEmitter {
        _subscribers: any[];

        close(callback: any): any {
        }

        load(schema: string, id: string) {
            return {
                id:"1",
                uuid:"a",
                value1: "asd",
                value2: 123
            };
        }

        off(identifier, uuid): void {
        }

        on(identifier: string, callback: any): string {
            return "";
        }

        publish(identifier, data?): any {
        }

        register(schema: string, res: Resource) {
        }

    }



    class MockSchema {
        value1: string;
        value2: number;

        action(){
            return this.value1+this.value2.toString();
        }
    }

    const schema_name = "mock";

    const objectSync = new ObjectSync(new CacheSchemaMockProvider());


    it('should be created', () => {

        expect(objectSync).not.equal(undefined);
        expect(objectSync._registered).not.equal(undefined);
        expect(objectSync._resources).not.equal(undefined);
        expect(objectSync._cached_uuids).not.equal(undefined);
        expect(objectSync._cached_ids).not.equal(undefined);

    });

    it('register a schema type', () => {

        objectSync.registerSchema(schema_name, MockSchema);

        expect(objectSync._registered[schema_name]).not.equal(undefined);

    });

    it('return some value from tags', () => {

        let res = new Resource();
        res.data = new MockSchema();

        expect(objectSync._resources[schema_name]).equal(undefined);

        objectSync.addResource(schema_name,res);

        expect(objectSync._resources[schema_name]).not.equal(undefined);
        expect(objectSync._resources[schema_name].length).equal(1);


    });


});