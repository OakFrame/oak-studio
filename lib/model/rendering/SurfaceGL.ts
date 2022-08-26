// @ts-ignore
import {mat4, mat3, vec3, glMatrix} from "gl-matrix";
import {Mesh} from "./Mesh";
import {Camera} from "../interactive/Camera";
import {Vec3} from "../math/Vec3";
import {GLShader} from "./GLShader";
import {GLPositionColorShader} from "./GLPositionColorShader";
import {mergeTypedArraysUnsafe} from "../Utils";


var gl;
var modelMatrix = mat4.create();
var projectionMatrix = mat4.create();
var shaderProgram;

const camera = {
    from: (new Vec3()).set(0, 20, 20),
    to: (new Vec3()).set(0, 0, 1),
    up: (new Vec3()).set(0, 0, 1)
};


export class SurfaceGL {

    element;
    _scaling;
    bufferMesh;
    GLShader: GLShader;
    GLAttributesBuffer: {
        position?,
        color?
    }

    constructor(canvas) {
        this._scaling = (window.devicePixelRatio ? window.devicePixelRatio : 1);

        this.element = canvas;
        this.initGL(canvas);
        this.initShaders(GLPositionColorShader);

        this.GLAttributesBuffer = {};
        this.clearBuffers();
        this.initBuffers();


        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

    }

    setCamera(cam: Camera) {
        camera.from = cam.from;
        camera.to = cam.to;
        camera.up = cam.up;
    }

    clearBuffers() {

        this.bufferMesh = {
            position: new Float32Array(),
            uv: new Float32Array(),
            color: new Float32Array(),
            normal: new Float32Array()
        }
    }

    addMeshToRenderBuffer(mesh: Mesh) {

        if (mesh._buffered) {
            this.bufferMesh.position = mergeTypedArraysUnsafe(this.bufferMesh.position, mesh._buffered.position);
            this.bufferMesh.color = mergeTypedArraysUnsafe(this.bufferMesh.color, mesh._buffered.color);
            this.bufferMesh.uv = mergeTypedArraysUnsafe(this.bufferMesh.uv, mesh._buffered.uv);
            this.bufferMesh.normal = mergeTypedArraysUnsafe(this.bufferMesh.normal, mesh._buffered.normal);
            //  this.bufferMesh.position = this.bufferMesh.position.concat(mesh._buffered.position);
            // this.bufferMesh.color = this.bufferMesh.color.concat(mesh._buffered.color);
            // this.bufferMesh.uv = this.bufferMesh.uv.concat(mesh._buffered.uv);
            //this.bufferMesh.normal = this.bufferMesh.normal.concat(mesh._buffered.normal);
        }
        return;

        for (var i = 0; i < mesh._children.length; i++) {
            this.bufferMesh.position.push(-mesh._children[i].pos1.x);
            this.bufferMesh.position.push(mesh._children[i].pos1.y);
            this.bufferMesh.position.push(mesh._children[i].pos1.z);

            this.bufferMesh.position.push(-mesh._children[i].pos2.x);
            this.bufferMesh.position.push(mesh._children[i].pos2.y);
            this.bufferMesh.position.push(mesh._children[i].pos2.z);

            this.bufferMesh.position.push(-mesh._children[i].pos3.x);
            this.bufferMesh.position.push(mesh._children[i].pos3.y);
            this.bufferMesh.position.push(mesh._children[i].pos3.z);

            let v1Normal = mesh._children[i].getnormal();
            this.bufferMesh.normal.push(-v1Normal.x);
            this.bufferMesh.normal.push(v1Normal.y);
            this.bufferMesh.normal.push(v1Normal.z);

            this.bufferMesh.normal.push(-v1Normal.x);
            this.bufferMesh.normal.push(v1Normal.y);
            this.bufferMesh.normal.push(v1Normal.z);

            this.bufferMesh.normal.push(-v1Normal.x);
            this.bufferMesh.normal.push(v1Normal.y);
            this.bufferMesh.normal.push(v1Normal.z);


            this.bufferMesh.uv.push(mesh._children[i].uv1.x);
            this.bufferMesh.uv.push(mesh._children[i].uv1.y);

            this.bufferMesh.uv.push(mesh._children[i].uv2.x);
            this.bufferMesh.uv.push(mesh._children[i].uv2.y);

            this.bufferMesh.uv.push(mesh._children[i].uv3.x);
            this.bufferMesh.uv.push(mesh._children[i].uv3.y);

            this.bufferMesh.color.push(mesh._children[i].color1.r / 255);
            this.bufferMesh.color.push(mesh._children[i].color1.g / 255);
            this.bufferMesh.color.push(mesh._children[i].color1.b / 255);
            //this.bufferMesh.color.push(1);

            this.bufferMesh.color.push(mesh._children[i].color2.r / 255);
            this.bufferMesh.color.push(mesh._children[i].color2.g / 255);
            this.bufferMesh.color.push(mesh._children[i].color2.b / 255);
            //this.bufferMesh.color.push(1);

            this.bufferMesh.color.push(mesh._children[i].color3.r / 255);
            this.bufferMesh.color.push(mesh._children[i].color3.g / 255);
            this.bufferMesh.color.push(mesh._children[i].color3.b / 255);
            // this.bufferMesh.color.push(1);
        }
    }


    initGL(canvas) {

        try {
            canvas = canvas || <HTMLCanvasElement>document.getElementById('canvas-play');

            gl = canvas.getContext('webgl');

            if (!gl) {
                console.log('WebGL not supported, falling back on experimental-webgl');
                gl = canvas.getContext('experimental-webgl');
            }

            if (!gl) {
                alert('Your browser does not support WebGL');
            }

            gl.enable(gl.DEPTH_TEST);
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL.");
        }

        gl.disable(gl.CULL_FACE);
    }

    getShader(gl, type, data) {

        var shader;
        if (type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, data);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    initShaders(shader: any) {

        // @ts-ignore
        this.GLShader = new shader();

        var fragmentShader = this.getShader(gl, "x-shader/x-fragment", this.GLShader.fragmentShader);
        var vertexShader = this.getShader(gl, "x-shader/x-vertex", this.GLShader.vertexShader);

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        for (const shaderAttribute in this.GLShader.vertexAttributeNames) {
            let i = shaderAttribute + "Attribute";
            let v = this.GLShader.vertexAttributeNames[shaderAttribute];
            shaderProgram[i] = gl.getAttribLocation(shaderProgram, v);
            gl.enableVertexAttribArray(shaderProgram[i]);
        }

        shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "mProj");
        shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "mWorld");
    }


    setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);
    }

    initBuffers() {

        for (const shaderAttribute in this.GLShader.vertexAttributeNames) {
            let i = shaderAttribute + "Attribute";
            let v = this.GLShader.vertexAttributeNames[shaderAttribute];

            if (!this.GLAttributesBuffer[shaderAttribute]) {
                this.GLAttributesBuffer[shaderAttribute] = gl.createBuffer();
            }

            switch (shaderAttribute) {
                case "position":
                    this.GLAttributesBuffer[shaderAttribute].itemSize = 3;
                    break;
                case "color":
                    this.GLAttributesBuffer[shaderAttribute].itemSize = 3;
                    break;
                case "normal":
                    this.GLAttributesBuffer[shaderAttribute].itemSize = 3;
                    break;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.GLAttributesBuffer[shaderAttribute]);
            gl.bufferData(gl.ARRAY_BUFFER, this.bufferMesh[shaderAttribute], gl.STATIC_DRAW);
            this.GLAttributesBuffer[shaderAttribute].numItems = this.bufferMesh[shaderAttribute].length / this.GLAttributesBuffer[shaderAttribute].itemSize;

        }

    }


    render() {
        this.initBuffers();

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0.98, 0.98, 0.98, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        var rads = 20 * (Math.PI / 180);

        mat4.perspective(projectionMatrix, rads, gl.viewportWidth / gl.viewportHeight, 10, 100.0);

        mat4.identity(modelMatrix);
        mat4.lookAt(modelMatrix, [-camera.from.x, camera.from.y, camera.from.z], [-camera.to.x, camera.to.y, camera.to.z], [-camera.up.x, camera.up.y, camera.up.z]);

        for (const shaderAttribute in this.GLShader.vertexAttributeNames) {
            let i = shaderAttribute + "Attribute";
            gl.bindBuffer(gl.ARRAY_BUFFER, this.GLAttributesBuffer[shaderAttribute]);
            gl.vertexAttribPointer(shaderProgram[i], this.GLAttributesBuffer[shaderAttribute].itemSize, gl.FLOAT, false, 0, 0);
        }

        this.setMatrixUniforms();

        gl.drawArrays(gl.TRIANGLES, 0, this.GLAttributesBuffer['position'].numItems);
    }

    maximize() {
        let w = window.innerWidth;
        let h = window.innerHeight;
        if (this.getWidth() !== w * this._scaling || this.getHeight() !== h * this._scaling) {
            this.resize(w * this._scaling, h * this._scaling);
        }
    }

    getWidth() {
        return this.element.offsetWidth;
    }

    getHeight() {
        return this.element.offsetHeight;
    }

    getElement() {
        return this.element;
    }

    resize(width, height) {
        this.element.width = width;
        this.element.height = height;
        gl.width = width;
        gl.height = height;
        gl.viewportWidth = width;
        gl.viewportHeight = height;

        gl.viewport(0, 0, width, height);

        if (this._scaling !== 1) {
            this.element.style.width = "100%";
        }

        return this;
    }


}
