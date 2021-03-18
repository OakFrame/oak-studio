import {Project} from "../Project";
import {Sprite} from "./rendering/Sprite";
import {slugify} from "./Utils";
import {Account} from "./Account";
import {v4 as uuidv4} from "uuid";

export class CacheModel {

    private cache;

    constructor(cm?) {
        //this.projects = cm ? cm.projects : [];
        //this.packs = cm ? cm.packs : [];
        //this.sprites = cm ? cm.sprites : {};

        this.cache = cm ? cm.cache : {
            sprites: {},
            packs: {},
            projects: {}
        };

        if (window.localStorage.getItem('oakframe-cache')) {
            console.log("LOADING CACHE FROM LOCAL");
            this.deserialize(JSON.parse(window.localStorage.getItem('oakframe-cache')))
        } else {
            console.log("NO LOCAL CACHE FOUND");
        }
        // PRELOAD CACHE IF NECESSARY
    }

    deserialize = (props?) => {
        if (props) {
            this.cache.projects = props.projects ? props.projects : {};
            this.cache.sprites = {};
            //props.sprites ? props.sprites : {};
            for (const prop in props.sprites) {
                //  let sprite = props.sprites[prop];
                let res = new Resource(props.sprites[prop]);
                this.cache.sprites[prop] = res;
            }
        }
    };

    serialize = () => {
        return JSON.stringify(this.getSerializedResources());
    }

    mutate(key?, value?) {
        window.localStorage.setItem('oakframe-cache', this.serialize());
    }

    registerSprite(src) {
        let res = new Resource();
        res.data = new Sprite(src);
        this.cache.sprites[src] = res;
        //this.cache.sprites[src] = res.data;
        this.mutate();
        return res;
        // console.log('REGISTERED', this.sprites);
    }

    getSprite(src) {
        let cached = this.cache.sprites[src];
        if (!cached){
            let registered = this.registerSprite(src);
            return registered.data;
        }

        return cached.data||cached.thumbnail;
    }

    addPack(pack) {
        this.cache.packs.push(pack);
        console.log('adding pack', pack.name);
    }

    addProject(project: Project) {
        this.cache.projects.push(project);
    }

    getProjects() {
        return this.cache.projects;
    }

    getProject(id) {
        let p;
       for (const prop in this.cache.projects){
           let projectResource = this.cache.projects[prop];
          if (id === slugify(projectResource.data.name)){
              p = projectResource.data;
          }
       }
        return p;
    }

    addResource(resource: Resource) {
        this.cache.push(resource);
    }

    getResource(id) {
        return id;
    }

    getSerializedResources() {
        return {
            projects: this.cache.projects,
            packs: this.cache.packs,
            sprites: this.cache.sprites
        }
    }

}

export enum CacheResourceStatus {
    TEMP = 0,
    CLOUD = 1,
    THUMB = 2,
    FULL = 3
}

export class Resource {

    _id;
    uuid;
    type: String;
    data;
    thumbnail: any;
    status: CacheResourceStatus

    constructor(props?) {
        this.uuid = uuidv4();
        if (props) {
            if (props.type) {
                this.type = props.type;
            }
            if (props._id) {
                this._id = props._id;
            }
            if (props.uuid) {
                this.uuid = props.uuid;
            }
            if (props.data) {
                this.data = props.data;
            }
            if (props.thumbnail) {
                this.thumbnail = props.thumbnail;
            }
            if (props.status) {
                this.status = props.status;
            }
        }
    }

    serialize() {
        return {
            _id: this._id,
            uuid: this.uuid,
            type: this.type,
            data: this.data,
            thumbnail: this.thumbnail,
            status: this.status,
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
            console.log("PERCENT COMPLETE:::", percent_complete);
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