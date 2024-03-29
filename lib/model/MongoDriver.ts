const {MongoClient} = require('mongodb');
export const ObjectID = require('mongodb').ObjectID;

export class MongoDriver {

    private connected;
    private client;
    private db;
    private collections;

    private name;

    constructor(mongo_uri, dbName) {

        this.connected = false;
        this.collections = [];
        this.name = "hello world";

        MongoClient.connect(mongo_uri, (err, client) => {
            if (err || !client){
                console.warn(err);
            }
            console.log("Connected successfully to mongo server");
            this.client = client;
            this.db = client.db(dbName);
            this.connected = true;

        });

    }



    getDB(){
        return this.db;
    }

    getCollection(collection){
        this.verifyCollection(collection);
        return this.collections[collection];
    }

    verifyCollection(collection) {
        if (!this.collections[collection]) {
            this.collections[collection] = this.db.collection(collection);
        }
    }

    findOrCreate(collection, search, data) {
        return new Promise((resolve, reject) => {
            this.verifyCollection(collection);
            this.collections[collection].findOne(search).then((document) => {
                if (document === null) {
                    this.insertOne(collection, data).then((inserted) => {
                        resolve({did_create:true,data:data});
                    });
                } else {
                    resolve({did_create:false,data:document});
                }
            });
        });
    }

    async insertOne(collection, data) {
        return new Promise(async (resolve, reject) => {
            await this.verifyCollection(collection);

            this.db.collection(collection).insertOne(data).then((document) => {
                resolve(document);
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }

    updateOne(collection,search, data) {
        this.verifyCollection(collection);
        return this.collections[collection].updateOne(search, data);
    }

    deleteMany(collection,search) {
        this.verifyCollection(collection);
        return new Promise((resolve, reject)=>{
            this.collections[collection].deleteMany(search, function(ret){
                resolve(ret);
            });
        });

    }

    update(collection,search, data) {
        return new Promise((resolve, reject) => {
            this.verifyCollection(collection);
            return this.collections[collection].update(search,
                data, function (err, result) {
                    resolve(result);
                });
        });
    }

    findOne(collection, search) {
        return new Promise((resolve, reject) => {
            this.verifyCollection(collection);
            this.collections[collection].findOne(search).then((document) => {
                if (document === null) {
                    reject(document);
                } else {
                    resolve(document);
                }
            });
        });
    }

    find(collection, search) {
        return new Promise(async (resolve, reject) => {
            await this.verifyCollection(collection);
            this.db.collection(collection).find(search).toArray(function (err, result) {
                if (err) {
                    console.error("ERRR",err);
                    resolve([]);
                    return;
                }
                resolve(result);

            });
        });
    }

    saveToCollection() {

    }

    close() {
        if (this.connected) {
            this.client.close();
        }
    }

    isConnected() {
        return this.connected;
    }

}
