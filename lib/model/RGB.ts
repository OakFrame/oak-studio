/**
 * @constructor
 */
export class RGB {
    r = 0;
    g = 0;
    b = 0;

    constructor(r=0, g=0, b=0) {
        this.r = r;
        this.g = g;
        this.b= b;
    }

    set = (r, g, b) => {
        this.r = r | 0;
        this.g = g | 0;
        this.b = b | 0;
        return this;
    }
    copy = (rgb) => {
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        return this;
    };
// Thanks to @cwolves on Stack Exchange
// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    toHex = () => {
        return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
    };
    toArray = () => {
        return [this.r, this.g, this.b]
    }

    fromHex = (hex) => {
        hex = hex.replace('#', '');

        this.r = parseInt(hex.substring(0, 2), 16);
        this.g = parseInt(hex.substring(2, 4), 16);
        this.b = parseInt(hex.substring(4, 6), 16);
        return this;
    }
}

/**
 * @constructor
 */
export class RGBA {
    r = 0;
    g = 0;
    b = 0;
    a = 1;
    constructor(r?, g?, b?, a?) {
        if (r){this.r= r;}
        if (g){this.g= g;}
        if (b){this.b= b;}
        if (a){this.a= a;}
    }

    set = (r, g, b, a) => {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        return this;
    };
    copy = (rgba) => {
        this.r = rgba.r;
        this.g = rgba.g;
        this.b = rgba.b;
        this.a = rgba.a;
        return this;
    };
    clone = () => {
        return (new RGBA()).copy(this);
    }

    fromHex = (hex, opacity) => {
        hex = hex.replace('#', '');

        this.r = parseInt(hex.substring(0, 2), 16);
        this.g = parseInt(hex.substring(2, 4), 16);
        this.b = parseInt(hex.substring(4, 6), 16);
        this.a = (((opacity || 1) * 255) | 0);
        return this;
    };
    mix = (rgba) => {
        let mixed = new RGBA();
        mixed.a = 1 - (1 - rgba.a) * (1 - this.a);
        mixed.set(Math.round((rgba.r * rgba.a / mixed.a) + (this.r * this.a * (1 - rgba.a) / mixed.a)),
            Math.round((rgba.g * rgba.a / mixed.a) + (this.g * this.a * (1 - rgba.a) / mixed.a)),
            Math.round((rgba.b * rgba.a / mixed.a) + (this.b * this.a * (1 - rgba.a) / mixed.a)),
            mixed.a);
        return mixed;
    }
}

