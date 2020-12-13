import {EventModel} from "../EventModel";

export class Sprite implements EventModel {
    public src: Array<String>;
    public images: Array<HTMLImageElement>;
    private image_index;
    private image_speed;

    public ready;
    private listeners;

    constructor(sprite: (Array<string> | string)) {
        this.src = [];
        this.images = [];
        if (sprite) {
            //this.src = ((sprite.src) ? (Array.isArray(sprite.src) ? sprite.src : [sprite.src]) : []);
            this.src = (Array.isArray(sprite) ? sprite : [sprite]);
        }
        this.listeners = [];
        this.ready = false;
    }

    getImage(): HTMLImageElement {
        this.image_index = (Date.now() / 250) | 0;
        this.image_index = this.image_index % this.src.length;

        let img = this.images[this.image_index];
        if (!img) {
            let new_img: any = new Image();
            new_img.src = this.src[this.image_index];
            new_img.isReady = false;
            new_img.onload = () => {
                new_img.isReady = true;
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

}