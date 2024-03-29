/**
 * @constructor
 */
export interface Vec2Interface {
    x: number;
    y: number;
}

export class Vec2 implements Vec2Interface {

    x: number;
    y: number;

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    /** @type {function():Vec2} */
    clear() {
        this.x = 0;
        this.y = 0;
        return this;
    }

    /** @type {function(number,number):Vec2} */
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /** @type {function(Vec2):Vec2} */
    add(vec2) {
        this.x += vec2.x;
        this.y += vec2.y;
        return this;
    }

    /** @type {function(Vec2):Vec2} */
    addI(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    /** @type {function(Vec2):Vec2} */
    sub(vec2) {
        this.x -= vec2.x;
        this.y -= vec2.y;
        return this;
    }

    /** @type {function(Vec2):Vec2} */
    subI(x, y) {
        this.x -= x;
        this.y -= y;
        return this;
    }

    /** @type {function(Vec2):Vec2} */
    mul(vec2) {
        this.x *= vec2.x;
        this.y *= vec2.y;
        return this;
    }

    /** @type {function(number):Vec2} */
    mulI(amt) {
        this.x *= amt;
        this.y *= amt;
        return this;
    }

    /** @type {function(number):Vec2} */
    divI(amt) {
        this.x /= amt;
        this.y /= amt;
        return this;
    }

    /** @type {function(Vec2):Vec2} */
    pointTo(vec) {
        //let a = this.clone();
        // a.sub(vec).divI(a.dist(vec));
        // let d = this.dist(vec);
        this.sub(vec).normalize();
        return this;
        // return a;
    }

    /** @type {function(Vec2):Vec2} */
    div(vec2: Vec2) {
        this.x /= vec2.x;
        this.y /= vec2.y;
        return this;
    }

    rotate(deg) {
        deg *= (Math.PI / 180);
        this.set(this.x * Math.cos(deg) - this.y * Math.sin(deg), this.x * Math.sin(deg) + this.y * Math.cos(deg));
        return this;
    }

    /** @type {function():number} */
    toDeg() {
        let normalized = this.clone().normalize();
        return (((Math.atan2(normalized.x, normalized.y + 0.0000001) / Math.PI) * 180) + 180) % 360;
    }

    toRad() {
        let normalized = this.clone().normalize();
        return (Math.atan2(normalized.x, normalized.y + 0.0000001));
    }

    /** @type {function():Vec2} */
    normalize() {
        let mag = this.mag();
        this.x /= mag;
        this.y /= mag;
        return this;
    }

    /** @type {function():Vec2} */
    random() {
        this.x = Math.random() - Math.random();
        this.y = Math.random() - Math.random();
        return this;
    }

    /** @type {function():Vec2} */
    flipY() {
        this.y *= -1;
        return this;
    }

    /** @type {function():Vec2} */
    flipX() {
        this.x *= -1;
        return this;
    }

    /** @type {function():number} */
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /** @type {function(Vec2):number} */
    dot(a) {
        return (this.x * a.x + this.y * a.y);
    }

    /** @type {function():Vec2} */
    clone() {
        return (new Vec2().set(this.x * 1, this.y * 1));
    }

    /** @type {function(Vec2):Vec2} */
    copy(a) {
        this.x = a.x;
        this.y = a.y;
        return this;
    }

    /** @type {function(Vec2):number} */
    dist(vec) {
        return Math.sqrt(Math.pow((this.x - vec.x), 2) + Math.pow((this.y - vec.y), 2));
    }

    /** @type {function(Vec2):number} */
    distEuclid(x, y) {
        return Math.sqrt(Math.pow((this.x - x), 2) + Math.pow((this.y - y), 2));
    }

    toArray() {
        return [this.x, this.y];
    }

    fromArray(arr) {
        this.x = arr[0];
        this.y = arr[1];
        return this;
    }

    /** @type {function():String} */
    toString() {
        return JSON.stringify(this);
    }

    static fromValues(x, y) {
        return (new Vec2()).set(x, y);
    }

}


export function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t
}

export function lerpVec2(real: number, v1: Vec2, v2: Vec2) {
    return ((new Vec2()).set(lerp(v1.x, v2.x, real), lerp(v1.y, v2.y, real)));
}
