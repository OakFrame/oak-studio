export class Sprite {
    private src: Array<String>;
    public images: Array<HTMLImageElement>;
    private image_index;
    private image_speed;

    public ready;

    constructor(sprite: (Array<string> | string)) {
        this.src = [];
        this.images = [];
        if (sprite) {
            //this.src = ((sprite.src) ? (Array.isArray(sprite.src) ? sprite.src : [sprite.src]) : []);
            this.src = (Array.isArray(sprite) ? sprite : [sprite]);
        }
        // this.listener = new Listeners();
        this.ready = false;
    }

    getImage(): HTMLImageElement | false {
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
            return false;
        }

        if (img) {
            // @ts-ignore
            //if (img.isReady) {
            return img;
            // }
        }
        return false;
    }

    toString() {
        return JSON.stringify({src: this.src});
    }

    on(notice, callback) {
        //this.listener.subscribe(notice, callback);
    }

}