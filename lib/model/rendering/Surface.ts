import {Vec2} from "../math/Vec2";
import {Vec3} from "../math/Vec3";
import {Sprite} from "./Sprite";

export interface SurfaceTextOptions {
    size?: number;
    color?: string;
    background?: string;
    align?: string;
    font?: string;
}

export interface SurfaceImageOptions {
    position: Vec2 | Vec3;
    scale?: Vec2 | Vec3;
    origin?: Vec2 | Vec3;
    rotation?: number;
}

export class Surface {
    private element;
    private context;
    private _width;
    private _height;
    private _scaling;
    private _set_size;

    constructor(canvas?: HTMLElement | HTMLCanvasElement) {
        this.setElement(canvas);
        this._scaling = (window.innerWidth < 600 ? 1 : window.devicePixelRatio) || 1;
        this.context.font = (20 * this._scaling) + "px" //+" Font Name";
        return this;
    }

    drawText(x, y, text, options?: SurfaceTextOptions) {
        if (!options) {
            options = {};
        }
        this.context.font = ((options.size?options.size:20) * this._scaling) + "px " + ((options && options.font) ? " " + (options.font) : "mono") // + Font Name;

        if (options.align) {
            this.context.textAlign = options.align;
        }
        let w = this.context.measureText(text).width;
        let h = (((options.size || 20)) * this._scaling);
        if (options.background) {
            let padding = 10;
            this.context.fillStyle = options.background;
            this.getContext().beginPath();
            this.context.rect(x - (w / 2) - padding, (y - (h) - padding) + (h * 0.1), w + (padding * 2), h + (padding * 2));
            this.context.fill();
        }
        this.context.fillStyle = options.color || '#000';
        this.context.fillText(text, x, y);
        if (options.align) {
            this.context.textAlign = "left";
        }
    }

    resize(_width, _height) {
        if (_width == "100%") {
            let node = this.getElement().parentNode;
            _width = node.offsetWidth - (parseInt(node.style.paddingRight || "0", 10) + parseInt(node.style.paddingLeft || "0", 10) + parseInt(node.style.borderLeftWidth || "0", 10)) || 1
        }
        let width = _width * this._scaling;
        let height = _height * this._scaling;

        if (width === this.getWidth() && height === this.getHeight()) {
            return;
        }

        height = Math.min(height, window.innerHeight * this._scaling);
        width = Math.min(width, window.innerWidth * this._scaling);
        this.element.width = width;
        this._width = width;
        this.element.height = height;
        this._height = height;
        this.context.width = width;
        this.context.height = height;

        this.element.style.width = ((this._width / 2) | 0) + "px";
        this.element.style.height = ((this._height / 2) | 0) + "px";

        //this.element.style.transform = "scale(" + (1 / this._scaling) + ")";
        //this.element.style.WebkitTransform = "scale(" + (1 / this._scaling) + ")";
        //this.element.style.msTransform = "scale(" + (1 / this._scaling) + ")";
        //this.element.style.transformOrigin = "0 0";
        //this.element.style.WebkitTransformOrigin = "0 0";
        //this.element.style.msTransformOrigin = "0 0";

        return this;
    };

    maximize(fixed = false) {
        let parent = this.element.parentNode;
        if (!parent) {
            return;
        }
        let w = Math.min(window.innerWidth, parent.offsetWidth);
        let h = Math.min(window.innerHeight, parent.offsetHeight);

        // if (this.setSize(w, h) && fixed) {
        //    this.element.classList.add("fixed-canvas");
        //}
    }

    setSize(w, h) {
        this._set_size = true;
        this.resize(w, h);
    }

    attach(x: number, y: number) {
        document.body.appendChild(this.element);
        this.element.style.position = "fixed";
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        return this;
    };

    detach() {
        this.element.parentElement.removeChild(this.element);
    }

    fill(col) {
        if (!this._set_size) {
            this.maximize();
        }

        this.context.beginPath();
        this.context.fillStyle = col;
        this.context.rect(0, 0, this._width, this._height);
        this.context.fill();
        return this;
    };

    clear() {
        this.context.clearRect(0, 0, this._width, this._height);
        return this;
    }

    setElement(canvas){
        this.element = canvas || <HTMLCanvasElement>document.createElement('canvas');
        if (!this.element.getContext || !this.element.getContext("2d")) {
            console.error('canvas is not supported.');
        }
        this._set_size = false;
        this.context = this.element.getContext('2d');
        this._width = this.context.width || 300;
        this._height = this.context.height || 150;
    }

    getElement() {
        return this.element;
    }

    getContext() {
        return this.context;
    }

    getScaling() {
        return this._scaling;
    }

    getWidth() {
        return this._width;
    }

    getHeight() {
        return this._height;
    }

    getPerceptualWidth() {
        return this._width / this._scaling;
    }

    getPerceptualHeight() {
        return this._height / this._scaling;
    }

    drawImage(sprite, x, y) {
        this.context.drawImage(sprite.getImage(), x, y);
    }

    drawSprite(sprite: Sprite, options?: SurfaceImageOptions) {
        options = {
            position: options.position || (new Vec2()),
            origin: options.origin || (new Vec2()),
            scale: options.scale || ((new Vec2()).set(1, 1)),
            rotation: options.rotation || 0
        }

        let from_camera_scale_x = 1;

        let w = options.scale.x * sprite.getImage().width;
        let h = options.scale.y * sprite.getImage().height;

        let offx = 0;//w*options.origin.x;
        let offy = 0;// h*options.origin.y;

        this.context.drawImage(sprite.getImage(), options.position.x - offx, options.position.y - offy, w, h);

        let lower_x = offx + (0.5 - (sprite.getImage().width * options.scale.x * from_camera_scale_x / 2));
        let lower_y = offy + (-(0.5 + (sprite.getImage().height * options.scale.x * from_camera_scale_x / 2)));
        let upper_x = lower_x + (sprite.getImage().width * from_camera_scale_x * options.scale.x);
        let upper_y = lower_y + (sprite.getImage().height * from_camera_scale_x * options.scale.x); // should be options.scale.y?

        this.context.beginPath();
        this.context.rect(lower_x, lower_y, upper_x - lower_x, upper_y - lower_y);
        this.context.stroke();
    }

}
