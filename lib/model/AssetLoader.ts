import {Sprite} from "./rendering/Sprite";

export class AssetLoader {
    public queued;
    public loaded;
    constructor (){
        this.queued = 0;
        this.loaded = 0;
    }
    loadSprite(src, preload = true){
        let self = this;
        this.queued ++;
        let s = new Sprite(src);
        s.on('load',function(){
            self.loaded++;
            if (self.loaded >= self.queued){
                self.publish("loaded",true)
            }
        });
        if (preload) { s.getImage(); }
        return s;
    }

    static loadFile(src, func) {
        //AssetManager.total_items++;

        var xmlhttp = new XMLHttpRequest();
        // @ts-ignore
        xmlhttp._loaded = false;
        xmlhttp.onreadystatechange = function () {
            //console.log(xmlhttp);
            // @ts-ignore
            if (!xmlhttp._loaded && xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.responseText)) {
                func(xmlhttp.responseText);
                //AssetManager.loaded_items++;
                //console.log('loaded!');
                // @ts-ignore
                xmlhttp._loaded = true;
            }
        };
        xmlhttp.open("GET", src, true);
        xmlhttp.send();
    }

    publish(key, value){
        return null;
    }
}