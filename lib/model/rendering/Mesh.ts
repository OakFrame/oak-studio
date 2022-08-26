import {Vec3} from "../math/Vec3";
import {Vec2} from "../math/Vec2";
import {RGB} from "../RGB";
import {Camera} from "../interactive/Camera";
import {replaceAll} from "../Utils";
import {Surface} from "./Surface";
import {PLYVertexProperty} from "./PLYVertexProperty";
import {PlyPropertyType} from "./PlyPropertyType";
import {PlyPropertyTypeToValue} from "./PLYPropertyTypeToValue";

var Tri3_Temp = {
    a: 0, i: 0, t: 0, e: 0, u: 0, v: 0, f: 0, g: 0, s: 0, c: 0, h: 0, M: 0
};

function rayTriangle(origin: Vec3, direction: Vec3, tri: Face3) { // rayTriangle(from:Vec3, direction:Vec3 triangle:Face3)
    Tri3_Temp.a = (tri.pos2.y - tri.pos1.y) * (tri.pos3.z - tri.pos1.z) - (tri.pos3.y - tri.pos1.y) * (tri.pos2.z - tri.pos1.z);
    Tri3_Temp.i = (tri.pos2.z - tri.pos1.z) * (tri.pos3.x - tri.pos1.x) - (tri.pos3.z - tri.pos1.z) * (tri.pos2.x - tri.pos1.x);
    Tri3_Temp.t = (tri.pos2.x - tri.pos1.x) * (tri.pos3.y - tri.pos1.y) - (tri.pos3.x - tri.pos1.x) * (tri.pos2.y - tri.pos1.y);
    Tri3_Temp.e = Math.sign(Tri3_Temp.a * (tri.pos1.x - origin.x) + Tri3_Temp.i * (tri.pos1.y - origin.y) + Tri3_Temp.t * (tri.pos1.z - origin.z));
    Tri3_Temp.u = direction.x * Tri3_Temp.a + direction.y * Tri3_Temp.i + direction.z * Tri3_Temp.t;
    if (Tri3_Temp.e != Math.sign(Tri3_Temp.u) || 0 == Tri3_Temp.e) return !1;
    Tri3_Temp.v = (Tri3_Temp.a * tri.pos1.x + Tri3_Temp.i * tri.pos1.y + Tri3_Temp.t * tri.pos1.z - (Tri3_Temp.a * origin.x + Tri3_Temp.i * origin.y + Tri3_Temp.t * origin.z)) / Tri3_Temp.u;
    Tri3_Temp.f = direction.x * Tri3_Temp.v + origin.x;
    Tri3_Temp.g = direction.y * Tri3_Temp.v + origin.y;
    Tri3_Temp.s = direction.z * Tri3_Temp.v + origin.z;
    Tri3_Temp.c = (tri.pos1.y - Tri3_Temp.g) * (tri.pos2.z - Tri3_Temp.s) - (tri.pos2.y - Tri3_Temp.g) * (tri.pos1.z - Tri3_Temp.s);
    Tri3_Temp.h = (tri.pos1.z - Tri3_Temp.s) * (tri.pos2.x - Tri3_Temp.f) - (tri.pos2.z - Tri3_Temp.s) * (tri.pos1.x - Tri3_Temp.f);
    Tri3_Temp.M = (tri.pos1.x - Tri3_Temp.f) * (tri.pos2.y - Tri3_Temp.g) - (tri.pos2.x - Tri3_Temp.f) * (tri.pos1.y - Tri3_Temp.g);
    if (0 > Tri3_Temp.c * Tri3_Temp.a + Tri3_Temp.h * Tri3_Temp.i + Tri3_Temp.M * Tri3_Temp.t) return !1;
    Tri3_Temp.c = (tri.pos2.y - Tri3_Temp.g) * (tri.pos3.z - Tri3_Temp.s) - (tri.pos3.y - Tri3_Temp.g) * (tri.pos2.z - Tri3_Temp.s);
    Tri3_Temp.h = (tri.pos2.z - Tri3_Temp.s) * (tri.pos3.x - Tri3_Temp.f) - (tri.pos3.z - Tri3_Temp.s) * (tri.pos2.x - Tri3_Temp.f);
    Tri3_Temp.M = (tri.pos2.x - Tri3_Temp.f) * (tri.pos3.y - Tri3_Temp.g) - (tri.pos3.x - Tri3_Temp.f) * (tri.pos2.y - Tri3_Temp.g);
    if (0 > Tri3_Temp.c * Tri3_Temp.a + Tri3_Temp.h * Tri3_Temp.i + Tri3_Temp.M * Tri3_Temp.t) return !1;
    Tri3_Temp.c = (tri.pos3.y - Tri3_Temp.g) * (tri.pos1.z - Tri3_Temp.s) - (tri.pos1.y - Tri3_Temp.g) * (tri.pos3.z - Tri3_Temp.s);
    Tri3_Temp.h = (tri.pos3.z - Tri3_Temp.s) * (tri.pos1.x - Tri3_Temp.f) - (tri.pos1.z - Tri3_Temp.s) * (tri.pos3.x - Tri3_Temp.f);
    Tri3_Temp.M = (tri.pos3.x - Tri3_Temp.f) * (tri.pos1.y - Tri3_Temp.g) - (tri.pos1.x - Tri3_Temp.f) * (tri.pos3.y - Tri3_Temp.g);
    return 0 > Tri3_Temp.c * Tri3_Temp.a + Tri3_Temp.h * Tri3_Temp.i + Tri3_Temp.M * Tri3_Temp.t ? !1 : new Vec3().set(Tri3_Temp.f, Tri3_Temp.g, Tri3_Temp.s); //[f, g, s, vecDist(y, [f, g, s])];
}

/**
 * @constructor
 */
export class Face3 {

    public pos1: Vec3;
    public uv1: Vec2;
    public pos2: Vec3;
    public uv2: Vec2;
    public pos3: Vec3;
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
        this.uv1 = new Vec2();

        this.pos2 = new Vec3();
        this.uv2 = new Vec2();

        this.pos3 = new Vec3();
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

export class Mesh {

    _buffered: {
        position: Float32Array,
        color?,
        uv?,
        normal?
    }
    public _children: Face3[];
    private _bounds;
    private _tmpv;
    private _tmpr;
    private sortmeta;

    constructor() {
        this._children = [];
        this._bounds = [0, 0, 0, 0, 0, 0];
        this._tmpv = new Vec3();
        this._tmpr = new Vec3();
        this.sortmeta = {
            co: 0,
            sw: 0,
            index: 0,
            loop: 0,
            val: {},
            times: 0
        }

    }

    generateMeshBuffer() {

        let offset_3 = 9;
        let offset_2 = 6;

        this._buffered = {
            position: new Float32Array(this._children.length * offset_3),
            color: new Float32Array(this._children.length * offset_3),
            uv: new Float32Array(this._children.length * offset_2),
            normal: new Float32Array(this._children.length * offset_3)
        }

        for (var i = 0; i < this._children.length; i++) {

            this._buffered.position[(i * offset_3) + 0] = -this._children[i].pos1.x;
            this._buffered.position[(i * offset_3) + 1] = this._children[i].pos1.y;
            this._buffered.position[(i * offset_3) + 2] = this._children[i].pos1.z;

            this._buffered.position[(i * offset_3) + 3] = -this._children[i].pos2.x;
            this._buffered.position[(i * offset_3) + 4] = this._children[i].pos2.y;
            this._buffered.position[(i * offset_3) + 5] = this._children[i].pos2.z;

            this._buffered.position[(i * offset_3) + 6] = -this._children[i].pos3.x;
            this._buffered.position[(i * offset_3) + 7] = this._children[i].pos3.y;
            this._buffered.position[(i * offset_3) + 8] = this._children[i].pos3.z;

            let v1Normal = this._children[i].getnormal();

            this._buffered.normal[(i * offset_3) + 0] = -v1Normal.x;
            this._buffered.normal[(i * offset_3) + 1] = v1Normal.y;
            this._buffered.normal[(i * offset_3) + 2] = v1Normal.z;

            this._buffered.normal[(i * offset_3) + 3] = -v1Normal.x;
            this._buffered.normal[(i * offset_3) + 4] = v1Normal.y;
            this._buffered.normal[(i * offset_3) + 5] = v1Normal.z;

            this._buffered.normal[(i * offset_3) + 6] = -v1Normal.x;
            this._buffered.normal[(i * offset_3) + 7] = v1Normal.y;
            this._buffered.normal[(i * offset_3) + 8] = v1Normal.z;

            this._buffered.uv[(i * offset_2) + 0] = this._children[i].uv1.x;
            this._buffered.uv[(i * offset_2) + 1] = this._children[i].uv1.y;

            this._buffered.uv[(i * offset_2) + 2] = this._children[i].uv2.x;
            this._buffered.uv[(i * offset_2) + 3] = this._children[i].uv2.y;

            this._buffered.uv[(i * offset_2) + 4] = this._children[i].uv3.x;
            this._buffered.uv[(i * offset_2) + 5] = this._children[i].uv3.y;

            this._buffered.color[(i * offset_3) + 0] = this._children[i].color1.r / 255;
            this._buffered.color[(i * offset_3) + 1] = this._children[i].color1.g / 255;
            this._buffered.color[(i * offset_3) + 2] = this._children[i].color1.b / 255;

            this._buffered.color[(i * offset_3) + 3] = this._children[i].color2.r / 255;
            this._buffered.color[(i * offset_3) + 4] = this._children[i].color2.g / 255;
            this._buffered.color[(i * offset_3) + 5] = this._children[i].color2.b / 255;

            this._buffered.color[(i * offset_3) + 6] = this._children[i].color3.r / 255;
            this._buffered.color[(i * offset_3) + 7] = this._children[i].color3.g / 255;
            this._buffered.color[(i * offset_3) + 8] = this._children[i].color3.b / 255;

        }

        return this;
    }


    clear() {
        this._children = [];
        this._bounds = [0, 0, 0, 0, 0, 0];
        return this;
    }

    clone(): Mesh {
        let m = new Mesh();
        this._children.forEach(function (face) {
            m._children.push(face.clone().recalc());
        });
        return m;
    }

    translate(vec: Vec3): Mesh {

        this._children.forEach(function (face) {
            face.translate(vec).recalc();
        });
        return this;
    }


    setColor(rgb: RGB) {
        this._children.forEach(function (face) {
            face.color1 = rgb;
            face.color2 = rgb;
            face.color3 = rgb;
        });
        return this;
    }

    join(mesh, parent) {
        var target = this;
        mesh._children.forEach(function (face) {
            target._children.push(face.clone().scale(parent.scale).rotY(parent.rotation.y).rotX(parent.rotation.x).rotZ(parent.rotation.z).translate(parent.position).recalc());
        });
        return this;
    };

    draw(surface2d: Surface, camera, parent) {
        this._children.forEach(function (tri) {
            camera.drawFace3(surface2d, tri.pos1, tri.pos2, tri.pos3, tri.color1.toHex());
        });
        return this;
    };

    scale(scale: Vec3) {
        this._children.forEach(function (tri: Face3) {

            tri.scale(scale);

        });
        return this;
    };

    rotate(rx, ry, rz) {
        this._children.forEach(function (tri) {

            tri.rotate(rx, ry, rz);

        });
        return this;
    };

    drawUV(surface, camera: Camera, parent, texture, scale, depth?) {
        this._children.forEach(function (tri) {
            //  tri.center=tri.getcenter().rotY(parent.rotation.y).add(parent.position)
            //if (tri._cullvec.copy(tri._dotvec.copy(tri.normal).mul(parent.scale).normalize().rotY(parent.rotation.y).rotX(parent.rotation.x).rotZ(parent.rotation.z)).dot(tri._dotvec.copy(tri.center).mul(parent.scale).rotZ(parent.rotation.z).add(parent.position).pointTo(camera.from).invert()) > 0) {
            camera.drawFace(surface, tri, parent, texture, scale, depth);
            // }
            //camera.drawFace3(canvas, tri.pos1, tri.pos2, tri.pos3, tri.color1.toHex());
        });
        return this;
    };

    sort(from, parent) {
        this.sortmeta.co = 0;
        this.sortmeta.sw = 0;

        for (this.sortmeta.index = 0; this.sortmeta.index < this._children.length; this.sortmeta.index++) {
            this._children[this.sortmeta.index]._depth = this._tmpv.copy(from).sub(parent.position).dist(this._tmpr.copy(this._children[this.sortmeta.index].center).mul(parent.scale).rotY(parent.rotation.y).rotX(parent.rotation.x).rotZ(parent.rotation.z));
        }
        this.sortmeta.loop = true;
        this.sortmeta.times = 0;

        do {
            this.sortmeta.loop = false;

            for (var i = 0; i < this._children.length - (1 + this.sortmeta.times); i++) {
                if (this._children[i]._depth < this._children[i + 1]._depth) {
                    this.sortmeta.val = this._children[i];
                    this._children[i] = this._children[i + 1];
                    this._children[i + 1] = this.sortmeta.val;
                    this.sortmeta.loop = true;
                }

            }
            this.sortmeta.times++;
        } while (this.sortmeta.loop);


        return this;
    };


    sortQ(from, parent) {
        this.sortmeta.co = 0;
        this.sortmeta.sw = 0;

        for (this.sortmeta.index = 0; this.sortmeta.index < this._children.length; this.sortmeta.index++) {
            this._children[this.sortmeta.index]._depth = this._tmpv.copy(from).dist(this._tmpr.copy(this._children[this.sortmeta.index].center)) + (this._children[this.sortmeta.index].size() / 2);
        }
        this.sortmeta.loop = true;
        this.sortmeta.times = 0;

        do {
            this.sortmeta.loop = false;

            for (var i = 0; i < this._children.length - (1 + this.sortmeta.times); i++) {
                //co += 1;
                if (this._children[i]._depth < this._children[i + 1]._depth) {
                    //sw += 1;
                    this.sortmeta.val = this._children[i];
                    this._children[i] = this._children[i + 1];
                    this._children[i + 1] = this.sortmeta.val;
                    this.sortmeta.loop = true;
                }

            }
            this.sortmeta.times++;
        } while (this.sortmeta.loop);


        return this;
    };


    parsePLY(a) {
        var model = this;

        var plyProperties = {
                verticesCount: 0,
                indecesCount: 0,
                comments: [],
                format: "",
                formatVersion: "",
                properties: [],//PlyPropertyType[]
            },
            elements = {
                vertices: [],
                indeces: []
            },
            exportedElements = {
                vertex: [],
                index: []
            },
            arr = [],
            checkLineIndices = 0, //0-headers,verticesCount,indecesCount
            read_pos = 0;

        arr = replaceAll(a, "\r", "").split('\n');

        for (var i = 0; i < arr.length; i++) {
            var line_arr = arr[i].split(' ');
            if (checkLineIndices === 0) { // READING HEADER

                if (line_arr[0] === 'element') {
                    if (line_arr[1] === 'vertex') {
                        plyProperties.verticesCount = parseInt(line_arr[2], 10);
                    } else if (line_arr[1] === 'face') {
                        plyProperties.indecesCount = parseInt(line_arr[2], 10);
                    }
                } else if (line_arr[0] === 'comment') {
                    plyProperties.comments.push(line_arr.slice(1));
                } else if (line_arr[0] === 'format') {
                    plyProperties.format = line_arr[1];
                    plyProperties.formatVersion = line_arr[2];
                } else if (line_arr[0] === 'property') {

                    let prop: PlyPropertyType = {
                        name: line_arr[2],
                        type: line_arr[1]
                    }

                    plyProperties.properties.push(prop);


                } else if (line_arr[0] === 'ply') {

                } else if (line_arr[0] === 'end_header') {
                    checkLineIndices = 1;
                }
            } else if (checkLineIndices === 1) { // READING VERTICES
                if (line_arr[0]) {

                    // @ts-ignore
                    let vertex: PLYVertexProperty = {};
                    for (let p = 0; p < plyProperties.properties.length; p++) {
                        let prop = plyProperties.properties[p];
                        vertex[prop.name] = PlyPropertyTypeToValue(prop.type, line_arr[p]);
                    }
                    exportedElements.vertex.push(vertex);

                    elements.vertices.push(vertex["x"]); //x
                    elements.vertices.push(vertex["y"]); //y
                    elements.vertices.push(vertex["z"]); //z
                    elements.vertices.push(vertex["s"] || 0); //u
                    elements.vertices.push(vertex["t"] || 0); //v
                    elements.vertices.push(vertex["red"]); //r
                    elements.vertices.push(vertex["green"]); //g
                    elements.vertices.push(vertex["blue"]); //b

                    model._bounds[0] = Math.min(model._bounds[0], vertex["x"]);
                    model._bounds[1] = Math.min(model._bounds[1], vertex["y"]);
                    model._bounds[2] = Math.min(model._bounds[2], vertex["z"]);

                    model._bounds[3] = Math.max(model._bounds[3], vertex["x"]);
                    model._bounds[4] = Math.max(model._bounds[4], vertex["y"]);
                    model._bounds[5] = Math.max(model._bounds[5], vertex["z"]);

                }
                plyProperties.verticesCount--;
                if (plyProperties.verticesCount === 0) {
                    checkLineIndices = 2;
                }
            } else if (checkLineIndices === 2) { // READING INDICES
                if (line_arr[0]) {
                    elements.indeces.push(parseInt(line_arr[0], 10)); //facedefinition
                    elements.indeces.push(parseInt(line_arr[1], 10)); //v1
                    elements.indeces.push(parseInt(line_arr[2], 10)); //v2
                    elements.indeces.push(parseInt(line_arr[3], 10)); //v3
                }
                plyProperties.indecesCount--;
                if (plyProperties.indecesCount === 0) {
                    checkLineIndices = 3;
                }
            }
        }

        //  model.name = file;


        for (var y = 0; y < elements.indeces.length; y += 4) {
            var c = 1;

            model._children.push(new Face3().set(
                elements.vertices[(elements.indeces[y + 1] * 8) + 0], //x1
                elements.vertices[(elements.indeces[y + 1] * 8) + 1], //y1
                elements.vertices[(elements.indeces[y + 1] * 8) + 2], //z1
                elements.vertices[(elements.indeces[y + 1] * 8) + 3], //u1
                1 - elements.vertices[(elements.indeces[y + 1] * 8) + 4], //v1

                elements.vertices[(elements.indeces[y + 2] * 8) + 0], //x2
                elements.vertices[(elements.indeces[y + 2] * 8) + 1], //y2
                elements.vertices[(elements.indeces[y + 2] * 8) + 2], //z2
                elements.vertices[(elements.indeces[y + 2] * 8) + 3], //u2
                1 - elements.vertices[(elements.indeces[y + 2] * 8) + 4], //v2

                elements.vertices[(elements.indeces[y + 3] * 8) + 0], //x3
                elements.vertices[(elements.indeces[y + 3] * 8) + 1], //y3
                elements.vertices[(elements.indeces[y + 3] * 8) + 2], //z3
                elements.vertices[(elements.indeces[y + 3] * 8) + 3], //u3
                1 - elements.vertices[(elements.indeces[y + 3] * 8) + 4], //v3

                Math.floor(elements.vertices[(elements.indeces[y + 1] * 8) + 5]), //r1
                Math.floor(elements.vertices[(elements.indeces[y + 1] * 8) + 6]), //g1
                Math.floor(elements.vertices[(elements.indeces[y + 1] * 8) + 7]), //b1

                Math.floor(elements.vertices[(elements.indeces[y + 2] * 8) + 5]), //r2
                Math.floor(elements.vertices[(elements.indeces[y + 2] * 8) + 6]), //g2
                Math.floor(elements.vertices[(elements.indeces[y + 2] * 8) + 7]), //b2

                Math.floor(elements.vertices[(elements.indeces[y + 3] * 8) + 5]), //r3
                Math.floor(elements.vertices[(elements.indeces[y + 3] * 8) + 6]), //g3
                Math.floor(elements.vertices[(elements.indeces[y + 3] * 8) + 7]) //b3

            ));

        }

        return this;
    };

}


