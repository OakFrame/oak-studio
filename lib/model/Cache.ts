import {Project} from "../Project";
import {Sprite} from "./rendering/Sprite";

export class CacheModel {

    private projects;
    private resources;
    private packs;
    private sprites;

    constructor(cm?) {
        this.projects = cm ? cm.projects : [];
        this.packs = cm ? cm.packs : [];
        this.resources = cm ? cm.resources : [];
        this.sprites = cm ? cm.sprites : [];
        // PRELOAD CACHE IF NECESSARY
    }

    registerSprite(src) {
        this.sprites[src] = new Sprite(src);
    }

    getSprite(src) {
        return this.sprites[src];
    }

    addPack(pack) {
        this.packs.push(pack);
        console.log('adding pack', pack.name);
    }

    addProject(project: Project) {
        this.projects.push(project);
    }

    getProjects() {
        return this.projects;
    }

    addResource(resource: Resource) {
        this.resources.push(resource);
    }

    getResource(id) {
        return id;
    }

    getSerializedResources() {
        return {
            packs: this.packs,
            resources: this.resources
        }
    }

}

export class Resource {

    _id;
    type: String;
    value;
    preview_uri;

    constructor(props?) {
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