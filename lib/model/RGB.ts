/**
 * @constructor
 */
export class RGB {
    r = 0;
    g = 0;
    b = 0;
    set = (r, g, b) => {
        this.r = r|0;
        this.g = g|0;
        this.b = b|0;
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

    fromHex = (hex, opacity) => {
        hex = hex.replace('#', '');

        this.r = parseInt(hex.substring(0, 2), 16);
        this.g = parseInt(hex.substring(2, 4), 16);
        this.b = parseInt(hex.substring(4, 6), 16);
        this.a = (((opacity || 1) * 255) | 0);
        return this;
    };
}

