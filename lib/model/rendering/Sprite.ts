import {EventModel} from "../EventModel";
import {v4 as uuidv4} from "uuid";

export class Sprite implements EventModel {
    public src: Array<string>;
    public images: Array<HTMLImageElement>;
    public image_index;
    public image_speed;

    public ready;
    private listeners;
    public uuid;

    constructor(sprite?: (Array<string> | string)) {
        this.src = [];
        this.images = [];
        this.uuid = uuidv4();
        if (sprite) {
            //this.src = ((sprite.src) ? (Array.isArray(sprite.src) ? sprite.src : [sprite.src]) : []);
            this.src = (Array.isArray(sprite) ? sprite : [sprite]);
        }
        this.listeners = [];
        this.ready = false;
    }

    deserialize(sprite){
        if (sprite.uuid){
            this.uuid = sprite.uuid;
        }
        if (sprite.src){
            this.src = sprite.src;
        }
        return this;
    }

    getImageSrc():string{
        this.image_index = Math.floor(Date.now() / 250);
        this.image_index = this.image_index % this.src.length;
        return this.src[this.image_index];
    }

    getImage(): HTMLImageElement {
        this.image_index = Math.floor(Date.now() / 250);
        this.image_index = (this.image_index % this.src.length);

        let img = this.images[this.image_index];
        if (!img) {
            let new_img: any = new Image();
            console.log(new_img,this.src, this.images, this.image_index);
            new_img.src = this.src[this.image_index];
            new_img.isReady = false;
            new_img.onload = () => {
                new_img.isReady = true;
                this.publish('loaded',true);
            };

            this.images.push(new_img);
            return null;
        }

        if (img) {
            // @ts-ignore
            //if (img.isReady) {
            return img;
            // }
        }
        return null;
    }

    toString() {
        return JSON.stringify({src: this.src});
    }

    publish(notice, data) {
        if (!this.listeners[notice]) {
            return;
        }
        this.listeners[notice].forEach((cb) => {
            cb(data);
        });
    }

    on(notice, callback) {
        if (!this.listeners[notice]) {
            this.listeners[notice] = [];
        }
        this.listeners[notice].push(callback);
    }

    getClientRequestView(): any {
        console.warn('Not Implemented.');
    }

}
