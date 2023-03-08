import {mergeTypedArraysUnsafe, replaceAll} from "../Utils";
import {PlyPropertyType} from "./PlyPropertyType";
import {PLYVertexProperty} from "./PLYVertexProperty";
import {Vec3} from "../math/Vec3";
//import {positionVertexSize} from "./shader/VAOHandlerInterface";

function PlyPropertyTypeToValue(type, input) {
    switch (type) {
        case "float":
            return parseFloat(input);

        default:
            return parseInt(input, 10);
    }
}

export interface BufferedMeshDefaultParentType {
    color?;
    position?;
    scale?;
    rotation?;
}

export const BufferedMeshDefaultParent: BufferedMeshDefaultParentType = {
    color: {r: 255, g: 255, b: 255},
    position: Vec3.fromValues(0, 0, 0),
    scale: Vec3.fromValues(1, 1, 1),
    rotation: Vec3.fromValues(0, 0, 0),
}

const elementsPerTriangle = 3 * 3;
const bufferedMeshHeadroom = 64 * elementsPerTriangle;

function rotX(rad, arr) {
    return [arr[0], (arr[1] * Math.cos(rad) - arr[2] * Math.sin(rad)), (arr[1] * Math.sin(rad) + arr[2] * Math.cos(rad))]
}

function rotY(rad, arr) {
    return [(arr[0] * Math.cos(rad) - arr[2] * Math.sin(rad)), arr[1], (arr[0] * Math.sin(rad) + arr[2] * Math.cos(rad))]
}

function rotZ(rad, arr) {
    return [(arr[0] * Math.cos(rad) - arr[1] * Math.sin(rad)), (arr[0] * Math.sin(rad) + arr[1] * Math.cos(rad)), arr[2]]
}

export class BufferedMesh {

    positions: Float32Array = new Float32Array();
    colors: Float32Array = new Float32Array();
    normals: Float32Array = new Float32Array();
    attribCount: number = 0;
    lenMax: number = 0;

    _LODs: BufferedMesh[];

    constructor() {


    }

    set(pos, col, nor) {
        if (pos.length > this.lenMax) {
            this.lenMax = pos.length + bufferedMeshHeadroom;
            this.positions = new Float32Array(this.lenMax);
            this.colors = new Float32Array(this.lenMax);
            this.normals = new Float32Array(this.lenMax);
        }
        this.positions.set(pos);
        this.colors.set(col);
        this.normals.set(nor);
        this.attribCount = pos.length;
    }

    add(pos, col, nor) {
        let newlen = this.attribCount + pos.length;

        if (newlen > this.lenMax) {
            this.lenMax = newlen + bufferedMeshHeadroom;
            let p = (new Float32Array(this.lenMax));
            p.set(this.positions);
            this.positions = p;
            let c = (new Float32Array(this.lenMax));
            c.set(this.colors);
            this.colors = c;
            let n = (new Float32Array(this.lenMax));
            n.set(this.normals);
            this.normals = n;
        }

        this.positions.set(pos, this.attribCount);
        this.colors.set(col, this.attribCount);
        this.normals.set(nor, this.attribCount);
        this.attribCount += pos.length;
    }


    clear() {
        this.positions = new Float32Array(this.lenMax);
        this.colors = new Float32Array(this.lenMax);
        this.normals = new Float32Array(this.lenMax);
    }

    getSliced() {
        return {
            positions: this.positions.slice(0, this.attribCount),
            colors: this.colors.slice(0, this.attribCount),
            normals: this.normals.slice(0, this.attribCount)
        }
    }

    getRenderBuffered() {
        return {
            positions: this.positions.slice(0, this.attribCount).map((v, idx) => {
                return (idx % 3 === 0) ? -v : v;
            }),
            normals: this.normals.slice(0, this.attribCount).map((v, idx) => {
                return (idx % 3 === 0) ? -v : v;
            }),
            colors: this.colors.slice(0, this.attribCount)
        }
    }

    getInterleaved() {
        let render_buffered = this.getRenderBuffered();
        let verts_count = render_buffered.positions.length;
        let tris_count = verts_count / 3;

        let interleaved = [];

        for (let i = 0; i < verts_count; i += 3) {
//            let offset = i * (3 + 4);

            interleaved.push(...[
                render_buffered.positions[i],
                render_buffered.positions[i + 1],
                render_buffered.positions[i + 2],
                render_buffered.normals[i],
                render_buffered.normals[i + 1],
                render_buffered.normals[i + 2],
                render_buffered.colors[i],
                render_buffered.colors[i + 1],
                render_buffered.colors[i + 2],
                1//render_buffered.colors[i+3]
            ]);
        }

        return interleaved;
    }

    join(mesh: BufferedMesh, parent?: BufferedMeshDefaultParentType) {
        let s = mesh.getSliced();

        if (parent && parent.scale) {
            //this.translate(parent.position.invert());
            for (let i = 0; i < s.positions.length; i += 3) {
                s.positions[i] = ((s.positions[i] * parent.scale.x));
                s.positions[i + 1] = ((s.positions[i + 1] * parent.scale.y));
                s.positions[i + 2] = ((s.positions[i + 2] * parent.scale.z));
            }
        }
        if (parent && parent.rotation) {
            //this.translate(parent.position.invert());
            for (let i = 0; i < s.positions.length; i += 3) {
                let r = rotZ(parent.rotation.z, rotY(parent.rotation.y, rotX(parent.rotation.x, [s.positions[i], s.positions[i + 1], s.positions[i + 2]])));
                s.positions[i] = r[0];
                s.positions[i + 1] = r[1];
                s.positions[i + 2] = r[2];
                let rN = rotZ(parent.rotation.z, rotY(parent.rotation.y, rotX(parent.rotation.x, [s.normals[i], s.normals[i + 1], s.normals[i + 2]])));
                s.normals[i] = rN[0];
                s.normals[i + 1] = rN[1];
                s.normals[i + 2] = rN[2];
            }
        }
        if (parent && parent.position) {
            //this.translate(parent.position.invert());
            for (let i = 0; i < s.positions.length; i += 3) {
                s.positions[i] = ((s.positions[i]) + parent.position.x);
                s.positions[i + 1] = ((s.positions[i + 1]) + parent.position.y);
                s.positions[i + 2] = ((s.positions[i + 2]) + parent.position.z);
            }
        }

        if (parent && parent.color) {
            for (let i = 0; i < s.colors.length; i += 3) {
                s.colors[i] = ((parent && parent.color ? parent.color.r : 0) || s.colors[i]);
                s.colors[i + 1] = ((parent && parent.color ? parent.color.g : 0) || s.colors[i + 1]);
                s.colors[i + 2] = ((parent && parent.color ? parent.color.b : 0) || s.colors[i + 2]);
            }
        }
        this.add(s.positions, s.colors, s.normals);
        //this.positions = mergeTypedArraysUnsafe(this.positions, mesh.positions);
        //this.colors = mergeTypedArraysUnsafe(this.colors, mesh.colors);
        if (parent && parent.position) {
            //this.translate(parent.position.invert());
        }
        //this.attribCount += mesh.positions.length;
        /* for (let i = 0; i < mesh.positions.length; i += 3) {
              this.positions.push((mesh.positions[i]*(parent && parent.scale ? parent.scale.x : 1)) + (parent && parent.position ? parent.position.x : 0));
              this.positions.push((mesh.positions[i + 1]*(parent && parent.scale ? parent.scale.y : 1)) +  (parent && parent.position ? parent.position.y : 0));
              this.positions.push((mesh.positions[i + 2]*(parent && parent.scale ? parent.scale.z : 1)) +  (parent && parent.position ? parent.position.z : 0));
          }*/
        /* for (let i = 0; i < mesh.positions.length; i += 3) {
             this.colors.push((parent && parent.color ? parent.color.r : 0) || mesh.colors[i]);
             this.colors.push((parent && parent.color ? parent.color.g : 0) || mesh.colors[i + 1]);
             this.colors.push((parent && parent.color ? parent.color.b : 0) || mesh.colors[i + 2]);
         }
 */
    }

    translate(vec: Vec3) {
        for (let i = 0; i < this.positions.length; i += 3) {
            this.positions[i] += vec.x;
            this.positions[i + 1] += vec.y;
            this.positions[i + 2] += vec.z;
        }
    }

    setColor(cols: any) {
        for (let i = 0; i < this.colors.length; i += 3) {
            this.colors[i] += cols.r;
            this.colors[i + 1] += cols.g;
            this.colors[i + 2] += cols.b;
        }
    }

    rotZ(angle){
        for (let i = 0; i < this.positions.length; i += 3) {
            let r = rotZ(angle, rotY(0, rotX(0, [this.positions[i], this.positions[i + 1], this.positions[i + 2]])));
            this.positions[i] = r[0];
            this.positions[i + 1] = r[1];
            this.positions[i + 2] = r[2];
            let rN = rotZ(angle, rotY(0, rotX(0, [this.normals[i], this.normals[i + 1], this.normals[i + 2]])));
            this.normals[i] = rN[0];
            this.normals[i + 1] = rN[1];
            this.normals[i + 2] = rN[2];
        }
    }

    rotate(angle, axisx, axisy, axisz) {
        // Find squares of each axis component.
        let xsq = axisx * axisx;
        let ysq = axisy * axisy;
        let zsq = axisz * axisz;

        let x = axisx;
        let y = axisy;
        let z = axisz;

        // Test the axis's magnitude.
        let mag = xsq + ysq + zsq;

        // EPSILON is the smallest positive non-zero amount.
        // Return if the axis has no length or the point is < 0, 0, 0 >.
        if (mag < 0.000000001 || (axisx == 0.0 && axisy == 0.0 && axisz == 0.0)) {
            return this;
        } else if (mag > 1.0) {
            mag = 1.0 / Math.sqrt(mag);
            axisx *= mag;
            axisy *= mag;
            axisz *= mag;
            xsq = axisx * axisx;
            ysq = axisy * axisy;
            zsq = axisz * axisz;
        }

        let cosa = Math.cos(angle);
        let sina = Math.sin(angle);
        let complcos = 1.0 - cosa;

        let complxy = complcos * axisx * axisy;
        let complxz = complcos * axisx * axisz;
        let complyz = complcos * axisy * axisz;

        let sinx = sina * axisx;
        let siny = sina * axisy;
        let sinz = sina * axisz;

        // Right on the x axis (i).
        let ix = complcos * xsq + cosa; /* m00 */
        let iy = complxy + sinz; /* m10 */
        let iz = complxz - siny; /* m20 */

        // Up on the y axis (j).
        let jx = complxy - sinz; /* m01 */
        let jy = complcos * ysq + cosa; /* m11 */
        let jz = complyz + sinx; /* m21 */

        // Forward on the z axis (k).
        let kx = complxz + siny; /* m02 */
        let ky = complyz - sinx; /* m12 */
        let kz = complcos * zsq + cosa; /* m22 */

        let tempx = x;
        let tempy = y;
        x = ix * x + jx * y + kx * z;
        y = iy * tempx + jy * y + ky * z;
        z = iz * tempx + jz * tempy + kz * z;
        return [x, y, z]
    }

    parsePLY(a) {

        var plyProperties = {
                verticesCount: 0,
                indecesCount: 0,
                comments: [],
                format: "",
                formatVersion: "",
                properties: []
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

                    elements.vertices.push(vertex["s"]); //u
                    elements.vertices.push(vertex["t"]); //v

                    elements.vertices.push(vertex["red"]); //r
                    elements.vertices.push(vertex["green"]); //g
                    elements.vertices.push(vertex["blue"]); //b

                    elements.vertices.push(vertex["nx"]); //nx
                    elements.vertices.push(vertex["ny"]); //ny
                    elements.vertices.push(vertex["nz"]); //nz

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

        // console.log(elements.indeces, exportedElements);
        let pos = [];
        let col = [];
        let nor = [];

        for (var y = 0; y < elements.indeces.length; y += 4) {

            pos.push(...[
                exportedElements.vertex[elements.indeces[y + 1]]["x"],
                exportedElements.vertex[elements.indeces[y + 1]]["y"],
                exportedElements.vertex[elements.indeces[y + 1]]["z"],

                exportedElements.vertex[elements.indeces[y + 2]]["x"],
                exportedElements.vertex[elements.indeces[y + 2]]["y"],
                exportedElements.vertex[elements.indeces[y + 2]]["z"],

                exportedElements.vertex[elements.indeces[y + 3]]["x"],
                exportedElements.vertex[elements.indeces[y + 3]]["y"],
                exportedElements.vertex[elements.indeces[y + 3]]["z"],
            ]);

            col.push(...[
                exportedElements.vertex[elements.indeces[y + 1]]["red"] / 255 || 0,
                exportedElements.vertex[elements.indeces[y + 1]]["green"] / 255 || 0,
                exportedElements.vertex[elements.indeces[y + 1]]["blue"] / 255 || 0,

                exportedElements.vertex[elements.indeces[y + 2]]["red"] / 255 || 0,
                exportedElements.vertex[elements.indeces[y + 2]]["green"] / 255 || 0,
                exportedElements.vertex[elements.indeces[y + 2]]["blue"] / 255 || 0,

                exportedElements.vertex[elements.indeces[y + 3]]["red"] / 255 || 0,
                exportedElements.vertex[elements.indeces[y + 3]]["green"] / 255 || 0,
                exportedElements.vertex[elements.indeces[y + 3]]["blue"] / 255 || 0,
            ]);

            nor.push(...[
                exportedElements.vertex[elements.indeces[y + 1]]["nx"],
                exportedElements.vertex[elements.indeces[y + 1]]["ny"],
                exportedElements.vertex[elements.indeces[y + 1]]["nz"],

                exportedElements.vertex[elements.indeces[y + 2]]["nx"],
                exportedElements.vertex[elements.indeces[y + 2]]["ny"],
                exportedElements.vertex[elements.indeces[y + 2]]["nz"],

                exportedElements.vertex[elements.indeces[y + 3]]["nx"],
                exportedElements.vertex[elements.indeces[y + 3]]["ny"],
                exportedElements.vertex[elements.indeces[y + 3]]["nz"],
            ]);

        }

        console.log("LENGTH OF NORMALS", nor);

        this.set(pos, col, nor);


        /* var c = 1;
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
*/
    }

    generatePLY() {
        let lines = [`ply`, `format ascii 1.0`, `comment Generated by Oak-Studio - oakframe.org`];

        let vertex_count = this.getSliced().positions.length / 3;
        let face_count = vertex_count / 3;

        // element vertex count
        lines.push(`element vertex ${vertex_count}`);

        // vertex properties
        lines.push(`property float x`);
        lines.push(`property float y`);
        lines.push(`property float z`);

        lines.push(`property float nx`);
        lines.push(`property float ny`);
        lines.push(`property float nz`);

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
                ...Array.from(this.getSliced().positions.slice((i * 3), (i + 1) * 3)).map((v) => {
                    if (isNaN(v)) {
                        v = 0;
                    }
                    return (v.toFixed(4));
                }),
                ...Array.from(this.getSliced().normals.slice((i * 3), (i + 1) * 3)).map((v) => {
                    if (isNaN(v)) {
                        v = 0;
                    }
                    return (v.toFixed(4));
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
                ...this.getSliced().colors.slice((i * 3), (i + 1) * 3).map(c => {
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
