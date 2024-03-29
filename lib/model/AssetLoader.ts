import {Sprite} from "./rendering/Sprite";

export class AssetLoader {
    public queued;
    public loaded;

    private spriteCache = [];

    constructor() {
        this.queued = 0;
        this.loaded = 0;
    }

    loadSprite(src, preload = true):Sprite {
        this.queued++;
        let s = new Sprite(src);
        this.spriteCache[src] = s;
        s.on('ready', () => {
            console.log('asset loaded ',src);
            this.loaded++;
            if (this.loaded >= this.queued) {
                this.publish("loaded", true);
            }
        });
        if (preload) {
            s.getImage();
        }
        return s;
    }

    getSpriteFromCache(src) {
        return this.spriteCache[src];
    }

    static loadFile(src, func) {
        var xmlhttp = new XMLHttpRequest();
        // @ts-ignore
        xmlhttp._loaded = false;
        xmlhttp.onreadystatechange = function () {
            // @ts-ignore
            if (!xmlhttp._loaded && xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.responseText)) {
                func(xmlhttp.responseText);
                // @ts-ignore
                xmlhttp._loaded = true;
            }
        };
        xmlhttp.open("GET", src, true);
        xmlhttp.send();
    }

    publish(key, value) {
        return null;
    }
}