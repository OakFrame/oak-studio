import {Vec3} from "../math/Vec3";
import {RGB} from "../RGB";
import {Camera} from "../interactive/Camera";
import {replaceAll} from "../Utils";
import {Surface} from "./Surface";
import {PLYVertexProperty} from "./PLYVertexProperty";
import {PlyPropertyType} from "./PlyPropertyType";
import {Face3} from "./Face3";

function PlyPropertyTypeToValue(type, input) {
    switch (type) {
        case "float":
            return parseFloat(input);

        default:
            return parseInt(input, 10);
    }
}


var Tri3_Temp = {
    a: 0, i: 0, t: 0, e: 0, u: 0, v: 0, f: 0, g: 0, s: 0, c: 0, h: 0, M: 0
};

export class Mesh {

    _buffered: {
        position: number[],
        color?,
        uv?,
        normal?
    };
    public _children: Face3[];
    private _bounds;
    private _tmpv;
    private _tmpr;
    private sortmeta;
    _meshLODs:Mesh[];

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
        this._buffered = {
            position: [],//new Float32Array(this._children.length * offset_3),
            color: [],//new Float32Array(this._children.length * offset_3),
            uv: [],//new Float32Array(this._children.length * offset_2),
            normal: []//new Float32Array(this._children.length * offset_3)
        };

    }

    generateMeshBuffer() {

        let offset_3 = 9;
        let offset_2 = 6;

       // this._buffered = {
       //     position: [],//new Float32Array(this._children.length * offset_3),
        //    color: [],//new Float32Array(this._children.length * offset_3),
         //   uv: [],//new Float32Array(this._children.length * offset_2),
          //  normal: []//new Float32Array(this._children.length * offset_3)
        //};

        for (var i = 0; i < this._children.length; i++) {

            this._buffered.position[(i * offset_3) ] = -this._children[i].pos1.x;
            this._buffered.position[(i * offset_3) + 1] = this._children[i].pos1.y;
            this._buffered.position[(i * offset_3) + 2] = this._children[i].pos1.z;

            this._buffered.position[(i * offset_3) + 3] = -this._children[i].pos2.x;
            this._buffered.position[(i * offset_3) + 4] = this._children[i].pos2.y;
            this._buffered.position[(i * offset_3) + 5] = this._children[i].pos2.z;

            this._buffered.position[(i * offset_3) + 6] = -this._children[i].pos3.x;
            this._buffered.position[(i * offset_3) + 7] = this._children[i].pos3.y;
            this._buffered.position[(i * offset_3) + 8] = this._children[i].pos3.z;

            let v1Normal = this._children[i].getnormal();

            this._buffered.normal[(i * offset_3) ] = -v1Normal.x;
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

    join(mesh, parent?) {
        if  (!parent){
            parent = {
                position:Vec3.fromValues(0,0,0),
                scale:Vec3.fromValues(1,1,1),
                rotation:Vec3.fromValues(0,0,0),
            }
        }
        var target = this;
        mesh._children.forEach(function (face) {
            target._children.push(face.clone().scale(parent.scale).rotY(parent.rotation.y).rotX(parent.rotation.x).rotZ(parent.rotation.z).translate(parent.position));
        });
        return this;
    };

    draw(surface2d: Surface, camera, parent?) {
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

    sort(from, parent?) {
        if  (!parent){
            parent = {
                position:Vec3.fromValues(0,0,0),
                scale:Vec3.fromValues(1,1,1),
                rotation:Vec3.fromValues(0,0,0),
            }
        }
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

        let totalTypesOfProperties = 11;

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

                    elements.vertices.push(vertex["s"] ); //u
                    elements.vertices.push(vertex["t"] ); //v

                    elements.vertices.push(vertex["red"]); //r
                    elements.vertices.push(vertex["green"]); //g
                    elements.vertices.push(vertex["blue"]); //b

                    elements.vertices.push(vertex["nx"] ); //nx
                    elements.vertices.push(vertex["ny"] ); //ny
                    elements.vertices.push(vertex["nz"] ); //nz

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
            let face = (new Face3()).set(
                elements.vertices[(elements.indeces[y + 1] * totalTypesOfProperties) + 0], //x1
                elements.vertices[(elements.indeces[y + 1] * totalTypesOfProperties) + 1], //y1
                elements.vertices[(elements.indeces[y + 1] * totalTypesOfProperties) + 2], //z1
                elements.vertices[(elements.indeces[y + 1] * totalTypesOfProperties) + 3], //u1
                1 - elements.vertices[(elements.indeces[y + 1] * 8) + 4], //v1

                elements.vertices[(elements.indeces[y + 2] * totalTypesOfProperties) + 0], //x2
                elements.vertices[(elements.indeces[y + 2] * totalTypesOfProperties) + 1], //y2
                elements.vertices[(elements.indeces[y + 2] * totalTypesOfProperties) + 2], //z2
                elements.vertices[(elements.indeces[y + 2] * totalTypesOfProperties) + 3], //u2
                1 - elements.vertices[(elements.indeces[y + 2] * totalTypesOfProperties) + 4], //v2

                elements.vertices[(elements.indeces[y + 3] * totalTypesOfProperties) + 0], //x3
                elements.vertices[(elements.indeces[y + 3] * totalTypesOfProperties) + 1], //y3
                elements.vertices[(elements.indeces[y + 3] * totalTypesOfProperties) + 2], //z3
                elements.vertices[(elements.indeces[y + 3] * totalTypesOfProperties) + 3], //u3
                1 - elements.vertices[(elements.indeces[y + 3] * totalTypesOfProperties) + 4], //v3

                Math.floor(elements.vertices[(elements.indeces[y + 1] * totalTypesOfProperties) + 5]), //r1
                Math.floor(elements.vertices[(elements.indeces[y + 1] * totalTypesOfProperties) + 6]), //g1
                Math.floor(elements.vertices[(elements.indeces[y + 1] * totalTypesOfProperties) + 7]), //b1

                Math.floor(elements.vertices[(elements.indeces[y + 2] * totalTypesOfProperties) + 5]), //r2
                Math.floor(elements.vertices[(elements.indeces[y + 2] * totalTypesOfProperties) + 6]), //g2
                Math.floor(elements.vertices[(elements.indeces[y + 2] * totalTypesOfProperties) + 7]), //b2

                Math.floor(elements.vertices[(elements.indeces[y + 3] * totalTypesOfProperties) + 5]), //r3
                Math.floor(elements.vertices[(elements.indeces[y + 3] * totalTypesOfProperties) + 6]), //g3
                Math.floor(elements.vertices[(elements.indeces[y + 3] * totalTypesOfProperties) + 7]) //b3
            );
            face.norm1.set(
                elements.vertices[(elements.indeces[y + 1] * totalTypesOfProperties) + 8],//nx1
                elements.vertices[(elements.indeces[y + 1] * totalTypesOfProperties) + 9],//ny1
                elements.vertices[(elements.indeces[y + 1] * totalTypesOfProperties) + 10],//nz1
            );
            face.norm2.set(
                elements.vertices[(elements.indeces[y + 2] * totalTypesOfProperties) + 8],//nx1
                elements.vertices[(elements.indeces[y + 2] * totalTypesOfProperties) + 9],//ny1
                elements.vertices[(elements.indeces[y + 2] * totalTypesOfProperties) + 10],//nz1
            );
            face.norm3.set(
                elements.vertices[(elements.indeces[y + 3] * totalTypesOfProperties) + 8],//nx1
                elements.vertices[(elements.indeces[y + 3] * totalTypesOfProperties) + 9],//ny1
                elements.vertices[(elements.indeces[y + 3] * totalTypesOfProperties) + 10],//nz1
            );
            model._children.push(face);
        }

        return this;
    };


    generatePLY() {
        this.generateMeshBuffer();
        let lines = [`ply`, `format ascii 1.0`, `comment Generated by Oak-Studio - oakframe.org`];

        let vertex_count = this._children.length *  3;
        let face_count = this._children.length;

        // element vertex count
        lines.push(`element vertex ${vertex_count}`);

        // vertex properties
        lines.push(`property float x`);
        lines.push(`property float y`);
        lines.push(`property float z`);

     //   lines.push(`property float nx`);
       // lines.push(`property float ny`);
      //  lines.push(`property float nz`);

      //  lines.push(`property float s`);
      //  lines.push(`property float t`);

        lines.push(`property uchar red`);
        lines.push(`property uchar green`);
        lines.push(`property uchar blue`);
        lines.push(`property uchar alpha`);

        lines.push(`element face ${face_count}`);

        lines.push(`property list uchar uint vertex_indices`);
        lines.push(`end_header`);

        // vertex list
        for (let i = 0; i < vertex_count; i++) {

            lines.push([
                ...Array.from(this._buffered.position.slice((i * 3), (i + 1) * 3)).map((v) => {
                    if (isNaN(v)) {
                        v = 0;
                    }
                    return (v.toFixed(6));
                }),
             /*   ...this._buffered.normal.slice((i * 3), (i + 1) * 3).map(v => {
                    if (isNaN(v)) {
                        return 0;
                    }
                    return (v.toFixed(6));
                }),
                ...this._buffered.uv.slice((i * 2), (i + 1) * 2).map(v => {
                    if (isNaN(v)) {
                        return 0;
                    }
                    return (v.toFixed(6));
                }),*/
                ...this._buffered.color.slice((i * 3), (i + 1) * 3).map(c => {
                    if (isNaN(c)) {
                        return 0;
                    }
                    return Math.floor(c * 255)
                }),
                255
            ].join(" "));

        }

        for (let i = 0; i < face_count; i++) {
            lines.push(
                [3, (i * 3), ((i) * 3) + 2, ((i) * 3) + 1].join(" ")
            );
        }


        // vertices


        return lines.join(`
`);
    }

}


