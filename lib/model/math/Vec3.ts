/**
 * @constructor
 */
export interface Vec3Interface {
    x: number;
    y: number;
    z: number;
}
export class Vec3 {
    x: number;
    y: number;
    z: number;

    constructor() {
        this.x = 0 | 0;
        this.y = 0 | 0;
        this.z = 0 | 0
        return this;
    }

    /** @type {function():Vec3} */
    clear() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    }

    /** @type {function(number,number,number):Vec3} */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /** @type {function(Vec3):Vec3} */
    add(vec3) {
        this.x += vec3.x;
        this.y += vec3.y;
        this.z += vec3.z;
        return this;
    }

    /** @type {function(Vec3):Vec3} */
    sub(vec3) {
        this.x -= vec3.x;
        this.y -= vec3.y;
        this.z -= vec3.z;
        return this;
    }

    /** @type {function(Vec3):Vec3} */
    mul(vec3) {
        this.x *= vec3.x;
        this.y *= vec3.y;
        this.z *= vec3.z;
        return this;
    }

    /** @type {function(Vec3):Vec3} */
    div(vec3) {
        this.x /= vec3.x;
        this.y /= vec3.y;
        this.z /= vec3.z;
        return this;
    }

    /** @type {function(number):Vec3} */
    mulI(a: number) {
        this.x *= a;
        this.y *= a;
        this.z *= a;
        return this;
    }

    /** @type {function(number):Vec3} */
    divI(a: number) {
        this.x /= a;
        this.y /= a;
        this.z /= a;
        return this;
    }

    random() {
        this.x = Math.random();
        this.y = Math.random();
        this.z = Math.random();
        return this;
    }

    //console.warn('Function Vec3.rotations should be converted to radians, not degrees');
    /** @type {function(number):Vec3} */
    rotX(deg) {
        // deg *= (Math.PI / 180);
        Vec3_TempV.y = (this.y * Math.cos(deg) - this.z * Math.sin(deg));
        Vec3_TempV.z = (this.y * Math.sin(deg) + this.z * Math.cos(deg));
        this.y = Vec3_TempV.y;
        this.z = Vec3_TempV.z;
        return this;
    }

    /** @type {function(number):Vec3} */
    rotY(deg) {
        //deg *= (Math.PI / 180);
        Vec3_TempV.x = (this.x * Math.cos(deg) - this.z * Math.sin(deg));
        Vec3_TempV.z = (this.x * Math.sin(deg) + this.z * Math.cos(deg));
        this.x = Vec3_TempV.x;
        this.z = Vec3_TempV.z;
        return this;
    }

    /** @type {function(number):Vec3} */
    rotZ(rad) {
        //deg *= (Math.PI / 180);
        //let b = new Vec3().set((this.x * Math.cos(a) - this.y * Math.sin(a)), (this.x * Math.sin(a) + this.y * Math.cos(a)), this.z);
        Vec3_TempV.x = (this.x * Math.cos(rad) - this.y * Math.sin(rad));
        Vec3_TempV.y = (this.x * Math.sin(rad) + this.y * Math.cos(rad));
        this.x = Vec3_TempV.x;
        this.y = Vec3_TempV.y;
        return this;
    }

    /** @type {function():Vec3} */
    flipX() {
        this.x *= -1;
        return this;
    }

    flipZ() {
        this.z *= -1;
        return this;
    }

    /** @type {function():Vec3} */
    flipY() {
        this.y *= -1;
        return this;
    }

    /** @type {function(Vec3):number} */
    dot(a) {
        return (this.x * a.x + this.y * a.y + this.z * a.z);
    }

    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }

    /** @type {function(Vec3):Vec3} */
    copy(a) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        return this;
    }

    /** @type {function(Vec3):Vec3} */
    pointTo(vec:Vec3) {
        //let a = this.clone();
        // a.sub(vec).divI(a.dist(vec));
        // let d = this.dist(vec);
        this.sub(vec).invert().normalize();
        return this;
        // return a;
    }

    /** @type {function(Vec3):number} */
    dist(vec) {
        return Math.sqrt((this.x - vec.x) * (this.x - vec.x) + (this.y - vec.y) * (this.y - vec.y) + (this.z - vec.z) * (this.z - vec.z));
        // return Math.sqrt(Math.pow((this.x - vec.x), 2) + Math.pow((this.y - vec.y), 2) + Math.pow((this.z - vec.z), 2));
    }

    /** @type {function():number} */
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /** @type {function():Vec3} */
    normalize() {
        Vec3_TempI = this.mag() + 0.0000000000001;
        this.x /= Vec3_TempI;
        this.y /= Vec3_TempI;
        this.z /= Vec3_TempI;
        return this;
    }

    /** @type {function():Vec3} */
    clone() {
        return (new Vec3().set(this.x * 1, this.y * 1, this.z * 1));
    }

    /** @type {function():Vec3} */
    invert() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }

    /** @type {function():Array} */
    toArray():number[] {
        return [this.x, this.y, this.z];
    }

    /** @type {function():String} */
    toString() {
        return JSON.stringify(this);
    }

    static fromValues(x, y, z) {
        return (new Vec3()).set(x, y, z);
    }

    static fromArray(arr) {
        return (new Vec3()).set(arr[0], arr[1], arr[2]);
    }
}

//TEMP VECTOR3 CACHE
let Vec3_TempI = 0, Vec3_TempV = new Vec3();
//# sourceMappingURL=Vec3.js.map
