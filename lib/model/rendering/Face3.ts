import {Vec3} from "../math/Vec3";
import {Vec2} from "../math/Vec2";
import {RGB} from "../RGB";

/**
 * @constructor
 */
export class Face3 {

    public pos1: Vec3;
    public norm1: Vec3;
    public uv1: Vec2;
    public pos2: Vec3;
    public norm2: Vec3;
    public uv2: Vec2;
    public pos3: Vec3;
    public norm3: Vec3;
    public uv3: Vec2;
    public color1: RGB;
    public color2: RGB;
    public color3: RGB;
    public center: Vec3;
    public normal: Vec3;
    public _cullvec: Vec3;
    public _dotvec: Vec3;
    public _depth: number;

    constructor() {

        this.pos1 = new Vec3();
        this.norm1 = new Vec3();
        this.uv1 = new Vec2();

        this.pos2 = new Vec3();
        this.norm2 = new Vec3();
        this.uv2 = new Vec2();

        this.pos3 = new Vec3();
        this.norm3 = new Vec3();
        this.uv3 = new Vec2();

        this.color1 = new RGB();
        this.color2 = new RGB();
        this.color3 = new RGB();

        this.center = new Vec3();
        this.normal = new Vec3();
        this._cullvec = new Vec3();
        this._dotvec = new Vec3();
        this._depth = 9999;
    }


    set(x1: number, y1: number, z1: number, u1: number, v1: number,
        x2: number, y2: number, z2: number, u2: number, v2: number,
        x3: number, y3: number, z3: number, u3: number, v3: number,
        r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, r3: number, g3: number, b3: number): Face3 {
        this.pos1.set(x1, y1, z1);
        this.uv1.set(u1, v1);

        this.pos2.set(x2, y2, z2);
        this.uv2.set(u2, v2);

        this.pos3.set(x3, y3, z3);
        this.uv3.set(u3, v3);

        this.center.copy(this.pos1).add(this.pos2).add(this.pos3).divI(3);
        this.getnormal();

        this.color1.set(r1, g1, b1);
        this.color2.set(r2, g2, b2);
        this.color3.set(r3, g3, b3);
        return this;
    };


    /**
     * @type {function():Vec3}
     */
    getcenter(): Vec3 {
        return new Vec3().set((this.pos1.x + this.pos2.x + this.pos3.x) / 3, (this.pos1.y + this.pos2.y + this.pos3.y) / 3, (this.pos1.z + this.pos2.z + this.pos3.z) / 3);
    };

    /**
     * @type {function():Vec3}
     */
    recalc(): Face3 {
        this.center.set((this.pos1.x + this.pos2.x + this.pos3.x) / 3, (this.pos1.y + this.pos2.y + this.pos3.y) / 3, (this.pos1.z + this.pos2.z + this.pos3.z) / 3);
        return this;
    };


    /**
     * @type {function():Vec3}
     */
    getnormal(): Vec3 {

        var ax, ay, az, bx, by, bz, rx, ry, rz, m;

        //point0 -> point1
        ax = this.pos2.x - this.pos1.x;
        ay = this.pos2.y - this.pos1.y;
        az = this.pos2.z - this.pos1.z;

        //point0 -> point2
        bx = this.pos3.x - this.pos1.x;
        by = this.pos3.y - this.pos1.y;
        bz = this.pos3.z - this.pos1.z;

        //cross product
        rx = ay * bz - by * az;
        ry = az * bx - bz * ax,
            rz = ax * by - bx * ay;

        //magnitude
        m = Math.sqrt(rx * rx + ry * ry + rz * rz);

        //normalize
        return this.normal.set(rx / m, ry / m, rz / m);
    };

    /**
     * @type {function():Face3}
     */
    clone(): Face3 {
        return new Face3().set(this.pos1.x, this.pos1.y, this.pos1.z, this.uv1.x, this.uv1.y,
            this.pos2.x, this.pos2.y, this.pos2.z, this.uv2.x, this.uv2.y,
            this.pos3.x, this.pos3.y, this.pos3.z, this.uv3.x, this.uv3.y,
            this.color1.r, this.color1.g, this.color1.b, this.color2.r, this.color2.g, this.color2.b, this.color3.r, this.color3.g, this.color3.b);
    };

//console.warn("function Face3().copy() is broken!");
    /**
     * @type {function(Face3):Face3}
     */
    copy(face3: Face3): Face3 {
        this.pos1.copy(face3.pos1);
        this.pos2.copy(face3.pos2);
        this.pos3.copy(face3.pos3);
        this.color1.copy(face3.color1);
        this.color2.copy(face3.color2);
        this.color3.copy(face3.color3);
        return this;
    };


    flipX(): Face3 {
        //this.pos1.flipX(vec3);
        //this.pos2.flipX(vec3);
        // this.pos3.flipX(vec3);
        return this;
    };


    translate(vec3: Vec3): Face3 {
        this.pos1.add(vec3);
        this.pos2.add(vec3);
        this.pos3.add(vec3);
        return this;
    };

    rotate(rx: number, ry: number, rz: number) {
        this.pos1.rotX(rx);
        this.pos2.rotX(rx);
        this.pos3.rotX(rx);
        this.pos1.rotY(ry);
        this.pos2.rotY(ry);
        this.pos3.rotY(ry);
        this.pos1.rotZ(rz);
        this.pos2.rotZ(rz);
        this.pos3.rotZ(rz);
        return this;
    };

    /**
     * @type {function(number):Face3}
     */
    rotX(rot: number) {
        this.pos1.rotX(rot);
        this.pos2.rotX(rot);
        this.pos3.rotX(rot);
        return this;
    };

    /**
     * @type {function(number):Face3}
     */
    rotY(rot: number) {
        this.pos1.rotY(rot);
        this.pos2.rotY(rot);
        this.pos3.rotY(rot);
        return this;
    };

    /**
     * @type {function(number):Face3}
     */
    rotZ(rot: number) {
        this.pos1.rotZ(rot);
        this.pos2.rotZ(rot);
        this.pos3.rotZ(rot);
        return this;
    };

    /**
     * @type {function(number):Face3}
     */
    scale(vec: Vec3) {
        this.pos1.mul(vec);
        this.pos2.mul(vec);
        this.pos3.mul(vec);
        return this;
    };

    size(): number {

        var r: any = {},
            n: any = {},
            t: any = {};
        return r.x = this.pos2.x - this.pos1.x, r.y = this.pos2.y - this.pos1.y, r.z = this.pos2.z - this.pos1.z, n.x = this.pos3.x - this.pos1.x, n.y = this.pos3.y - this.pos1.y, n.z = this.pos3.z - this.pos1.z, t.x = r.y * n.z - r.z * n.y, t.y = r.z * n.x - r.x * n.z, t.z = r.x * n.y - r.y * n.x, .5 * Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z);

    };
}