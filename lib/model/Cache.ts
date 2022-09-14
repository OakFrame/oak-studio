import {Project} from "../Project";
import {Sprite} from "./rendering/Sprite";
import {slugify} from "./Utils";
import {Account} from "./Account";
import {v4 as uuidv4} from "uuid";
import {PathImage} from "./paint/PathImage";
import {TextComment} from "./graph/TextComment";
import {GameEventEmitter} from "./interactive/GameEvent";
import {ObjectSync} from "./ObjectSync";
import {SchemaProvider} from "../interface/Provider";

export class CacheModel extends GameEventEmitter {

    private dataProvider;
    private cache: ObjectSync;
    private projects: Resource<any>[] = [];
    public maxByteSize: number = 128;
    public memoryCache = [];
    private resourceTypes: string[] = [];

    getDataProvider() {
        return this.dataProvider;
    }

    getObjectSync() {
        return this.cache;
    }

    constructor(dataProvider: SchemaProvider) {

        super();
        this.cache = new ObjectSync(dataProvider);

        this.dataProvider = dataProvider;
        dataProvider.on("save", () => {
            this.mutate();
        })

        if (window.localStorage.getItem('kp-cache')) {
            console.log("LOADING CACHE FROM LOCAL");
            this.deserialize(JSON.parse(window.localStorage.getItem('kp-cache')));
        } else {
            console.log("NO LOCAL CACHE FOUND");
        }
        // PRELOAD CACHE IF NECESSARY
    }

    addProject = (b) => {
        this.projects.push(b);
    }

    deserialize = (props?) => {
        if (props) {
            console.log("DESERIALIZE FROM", props);
            //this.cache.projects = [];//props.projects ? props.projects : {};
            //this.cache.sprites = {};
            //this.cache.images = [];
            //props.sprites ? props.sprites : {};
            /*for (const prop in props.sprites) {
                let res = new Resource(props.sprites[prop]);
                this.cache.addResource("sprite", res);
            }
            for (const prop in props.comments) {
                let res = new Resource(props.comments[prop]);
                this.cache.addResource("comment", res);
            }
            if (props.images) {
                for (const prop in props.images) {
                    let res = new Resource(props.images[prop]);
                    res.data = new PathImage(props.images[prop].data);
                    this.cache.addResource("image", res);
                }
            }*/
        }
        console.log("CURRENT CAHCHEMODEL,", this.getSerializedResources())
    };

    serialize = () => {
        return JSON.stringify(this.getSerializedResources());
    }

    serializeFiltered = () => {
        return JSON.stringify(this.getSerializedResourcesFiltered());
    }

    mutate(key?, value?) {
        console.log('MUTATING CACHE', this.serialize());
        window.localStorage.setItem('kp-cache', this.serializeFiltered());
        this.publish('mutate', this.serialize());
    }

    async registerSprite(src) {
        let res = new Resource<Sprite>();
        res.data = new Sprite(src);
        await this.cache.addResource('sprite', res);
        //this.mutate();
        return res;
    }

    async registerImage(src, status: CacheResourceStatus = CacheResourceStatus.TEMP) {
        let res = new Resource();
        res.data = src;
        res.status = status;
        await this.cache.addResource('image', res);
        //this.mutate();
        return res;
    }


    /* getSpriteBySource(src){
         this.getResourceByUUID(schema, res.uuid).then(()=>{

         });
     }*/

    /*

    addPack(pack) {
        this.cache.packs.push(pack);
        console.log('adding pack', pack.name);
    }
*/
    async registerProject(project: Project) {
        let res = new Resource();
        res.data = project;
        await this.cache.addResource('project', res);
        //  this.mutate();
        // this.projects.push(res);
        return res;
    }

    getResources(res) {
        return this.cache.getResources(res);
    }

    getResource(res) {
        return (this.cache.getResources(res)).sort((a, b) => {
            return b._last_modified - a._last_modified;
        });
    }

    getProjects() {
        return this.cache.getResources('project');
    }

    /*    getImages() {
            return (this.cache.getResources("image")).sort((a, b) => {
                return b._last_modified - a._last_modified;
            });
        }

        getComments() {
            return (this.cache.getResources("comment")).sort((a, b) => {
                return b._last_modified - a._last_modified;
            });
        }*/

    search(schema?, filter?) {
        this.registerSchema(schema);
        return this.cache.search(schema, filter);
    }

    find(schema?, uuid?) {
        this.registerSchema(schema);
        return this.cache.getResourceByUUID(schema, uuid);
    }

    registerSchema(schema: string) {
        if (this.resourceTypes.indexOf(schema) == -1) {
            this.resourceTypes.push(schema);
        }
    }


    getSprite(id): Sprite {
        let str_id = JSON.stringify(id);
        if (this.memoryCache[str_id]) {
            return this.memoryCache[str_id];
        }
        let images = this.getResource("image");
        console.info('looking for sprite', id, images, typeof images);
        if (!Array.isArray(id)) {
            for (const image of images) {//:Resource<PathImage>
                if (image._id && image._id === id && image.data) {
                    console.log('found', id);

                    let spr = new Sprite((<PathImage>image.data).getImage());
                    this.memoryCache[str_id] = spr;
                    return spr;
                }
            }
        }
        let spr = new Sprite(id)
        this.memoryCache[str_id] = spr;
        return spr;
    }

    getProject(id) {
        let p;
        for (const prop in this.projects) {
            const projectResource = this.projects[prop];
            if (id === (projectResource.uuid)) {
                p = projectResource;
            }
        }
        return p;
    }

    /*addImage(imageResource: Resource) {
        this.cache.images.push(imageResource);
    }

    addResource(resource: Resource) {
        this.cache.push(resource);
    }

    getResource(id) {
        return id;
    }*/

    async addResource(schema: string, resource: Resource<any>) {
        this.registerSchema(schema);
        await this.cache.addResource(schema, resource);
    }

    getSerializedResources() {

        return {
            projects: this.cache.getResources('project'),
            packs: [],
            sprites: this.cache.getResources('sprite'),
            images: this.cache.getResources('image'),
            comments: this.cache.getResources('comment'),
            maps: this.cache.getResources('map')
        }
    }

    getSerializedResourcesFiltered() {

        let ob = {};
        this.resourceTypes.forEach((type) => {
            ob['type'] = this.cache.getResources(type).filter((p) => {
                return (p.status === CacheResourceStatus.THUMB || p.status === CacheResourceStatus.FULL)
            })
        });

        return ob;


        /*return {
            projects: this.cache.getResources('project').filter((p) => {
                return (p.status === CacheResourceStatus.THUMB || p.status === CacheResourceStatus.FULL)
            }),
            packs: [],
            sprites: this.cache.getResources('sprite').filter((p) => {
                return (p.status === CacheResourceStatus.THUMB || p.status === CacheResourceStatus.FULL)
            }),
            images: this.cache.getResources('image').filter((p) => {
                return (p.status === CacheResourceStatus.THUMB || p.status === CacheResourceStatus.FULL)
            }),
            comments: this.cache.getResources('comment').filter((p) => {
                return (p.status === CacheResourceStatus.THUMB || p.status === CacheResourceStatus.FULL)
            })
        }*/
    }

    byteLength(str) {
        // returns the byte length of an utf8 string
        var s = str.length;
        for (var i = str.length - 1; i >= 0; i--) {
            var code = str.charCodeAt(i);
            if (code > 0x7f && code <= 0x7ff) s++;
            else if (code > 0x7ff && code <= 0xffff) s += 2;
            if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
        }
        return s;
    }


    async getByteSize() {
        if (window.localStorage && !window.localStorage.getItem('kp-cachesize')) {
            var i = 0;
            const starting_size = (this.byteLength(JSON.stringify(this.getSerializedResources())) / 1024);
            try {
                // Test up to 10 MB
                for (i = starting_size; i <= starting_size + (1024 * 10); i += 1024) {
                    window.localStorage.setItem('kp-sizetest', new Array((i * 1024) + 1).join('a'));
                    this.maxByteSize = i * 1024;
                    await new Promise((r) => {
                        window.setTimeout(() => {
                            r(true);
                        }, 150)
                    });
                }

            } catch (e) {
                // localStorage.setItem('kp-cachesize', (i*1024).toString());
                //localStorage.removeItem('test');
            }
            window.localStorage.setItem('kp-cachesize', ((i) * 1024).toString());
            window.localStorage.removeItem('kp-sizetest');
            return i * 1024;
        }

        if (window.localStorage && window.localStorage.getItem('kp-cachesize')) {
            return this.maxByteSize = parseInt(window.localStorage.getItem('kp-cachesize'));
        }

        return 1024 * 1024;
    }

}

export enum CacheResourceStatus {
    TEMP = 0,
    CLOUD = 1,
    THUMB = 2,
    FULL = 3
}

export interface ResourceData {
    getClientRequestView():any;
}

export class Resource<T> {

    _owner: string;
    _permissions: string[];
    _id?: string;
    _last_modified: number;
    uuid: string;
    type: string;
    // @ts-ignore
    data: any;
    _thumbnail: any;
    status: CacheResourceStatus;
    res: Sprite;


    constructor(props?, dataObject?) {
        this.uuid = uuidv4();
        this._last_modified = Date.now();
        if (props) {
            if (props._owner) {
                this._owner = props._owner;
            }
            if (props._permissions) {
                this._permissions = props._permissions;
            }
            if (props._last_modified) {
                this._last_modified = props._last_modified;
            }
            if (props.uuid) {
                this.uuid = props.uuid;
            }
            if (props.type) {
                this.type = props.type;
            }
            if (props._id) {
                this._id = props._id;
            }

            if (dataObject) {
                if (props.data) {
                    this.data = new dataObject(props.data);
                } else {
                    this.data = new dataObject();
                }
            } else {
                if (props.data) {
                    this.data = props.data;
                }
            }

            if (props._thumbnail) {
                this._thumbnail = props._thumbnail;
            }
            if (props.status) {
                this.status = props.status;
            }
        }
    }

    updateLastModified() {
        this._last_modified = Date.now();
    }

    setOwner(uuid: string) {
        this._owner = uuid;
    }

    getDataObject() {
        return this.data;
    }

    getClientRequestView(){
        return {
            uuid:this.uuid,
            type:this.type,
            data:this.data.getClientRequestView()
        }
    }

    serialize() {
        return {
            _id: this._id,
            _owner: this._owner,
            _permissions: this._permissions,
            uuid: this.uuid,
            type: this.type,
            data: this.data,
            _thumbnail: this._thumbnail,
            status: this.status,
            _last_modified: this._last_modified,
        }
    }


}

export class DataRequest {
    private filename;

    constructor(filename) {
        this.filename = filename;
    }

    fetch() {
        let request = new XMLHttpRequest();
        request.responseType = 'blob';
        request.open('get', this.filename, true);
        request.send();

        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var obj = window.URL.createObjectURL(this.response);
                // document.getElementById('save-file').setAttribute('href', obj);

                //document.getElementById('save-file').setAttribute('download', filename);
                setTimeout(function () {
                    window.URL.revokeObjectURL(obj);
                }, 60 * 1000);
            }
        };

        request.onprogress = function (e) {
            //progress.max = e.total;
            // progress.value = e.loaded;

            var percent_complete = (e.loaded / e.total) * 100;
            percent_complete = Math.floor(percent_complete);
            console.log("PERCENT COMPLETE", percent_complete);
            // progressText.innerHTML = percent_complete + "%";
        };

        request.onload = function (event) {
            var blob = request.response;
            console.log('got blob', blob)
            // var fileName = request.getResponseHeader("fileName") //if you have the fileName header available
            //var link=document.createElement('a');
            // link.href=window.URL.createObjectURL(blob);
            // link.download=fileName;
            // link.click();
        };
    }

}

export function generateFakePack() {

    let d = new Project();


    d.name = "project-" + ((Math.random() * 1000000) | 0);
    fetch("https://uselessfacts.jsph.pl/random.json").then(response => response.json())
        .then(data => {
            d.description = data.text;
            console.log(data);
        });

    //d.description = "project "+((Math.random()*1000000)|0)+" "+((Math.random()*1000000)|0)+" "+((Math.random()*1000000)|0)+" "+((Math.random()*1000000)|0)+" ";


    return d;
}
