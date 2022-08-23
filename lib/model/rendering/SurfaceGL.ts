import {Vec3} from "../math/Vec3";

// @ts-ignore
import {mat4, mat3, vec3, glMatrix} from "gl-matrix";
import {
    GLCameraShadowTextureShader, GLLightShadowTextureShader,
    GLShader,
    GLShaderBasic, GLShaderBasicPosition, GLShaderTexture
} from "./GLShaderBasic";
import {GLCubeBuffer, GLCubeBufferUV, GLPlaneBufferUV} from "./GLBuffer";
import {Sprite} from "./Sprite";
import {Mesh} from "./Mesh";


var gl;
var vertexPositionBuffer;
var vertexColorBuffer;
var modelMatrix = mat4.create();
var projectionMatrix = mat4.create();
var shaderProgram;
var cubeRotation = 0.0;


let camera = {
    from: (new Vec3()).set(0, 20, 20),
    to: (new Vec3()).set(0, 0, 0),
    up: (new Vec3()).set(0, 0, 1)
}


export class SurfaceGL {

    element;
    _scaling;
    bufferMesh;

    constructor(canvas) {
        //var canvas = document.getElementById("lesson01-canvas");
        this._scaling = (window.innerWidth < 600 ? 1 : window.devicePixelRatio) || 1;

        this.element = canvas;
        this.initGL(canvas);
        this.initShaders(GLShaderBasic);
        this.clearBuffers();
        this.initBuffers();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        //.   this.render();
    }


    clearBuffers() {

        this.bufferMesh = {
            vertices: [],
            uv: [],
            color: []
        }
    }

    addMeshToRenderBuffer(mesh: Mesh) {
        for (var i = 0; i < mesh._children.length; i++) {
            this.bufferMesh.vertices.push(mesh._children[i].pos1.x);
            this.bufferMesh.vertices.push(mesh._children[i].pos1.y);
            this.bufferMesh.vertices.push(mesh._children[i].pos1.z);

            this.bufferMesh.vertices.push(mesh._children[i].pos2.x);
            this.bufferMesh.vertices.push(mesh._children[i].pos2.y);
            this.bufferMesh.vertices.push(mesh._children[i].pos2.z);

            this.bufferMesh.vertices.push(mesh._children[i].pos3.x);
            this.bufferMesh.vertices.push(mesh._children[i].pos3.y);
            this.bufferMesh.vertices.push(mesh._children[i].pos3.z);

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
            alert("Could not initialise WebGL, sorry :-(");
        }
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
        let GLShader = new shader();

        var fragmentShader = this.getShader(gl, "x-shader/x-fragment", GLShader.fragmentShader);
        var vertexShader = this.getShader(gl, "x-shader/x-vertex", GLShader.vertexShader);

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertPosition");
        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertColor");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "mProj");
        shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "mWorld");
    }


    setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);
    }

    initBuffers() {

        vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferMesh.vertices), gl.STATIC_DRAW);
        vertexPositionBuffer.itemSize = 3;
        vertexPositionBuffer.numItems = this.bufferMesh.vertices.length / vertexPositionBuffer.itemSize;

        vertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferMesh.color), gl.STATIC_DRAW);
        vertexColorBuffer.itemSize = 3;
        vertexColorBuffer.numItems = this.bufferMesh.color.length / vertexColorBuffer.itemSize;
    }


    render() {

        this.initBuffers();

        // rot += 0.01;
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        console.log('rendering', 0, 0, gl.viewportWidth, gl.viewportHeight, this.bufferMesh);
        gl.clearColor(0.98, 0.98, 0.98, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        //  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var rads = 45 * (Math.PI / 180);

        mat4.perspective(projectionMatrix, rads, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

        mat4.identity(modelMatrix);
        // mat4.rotateY(modelMatrix, modelMatrix, rot);
        mat4.translate(modelMatrix, modelMatrix, [camera.from.x, camera.from.z, camera.from.y]); //camera position
        mat4.lookAt(modelMatrix, [camera.from.x, camera.from.z, camera.from.y], [camera.to.x, camera.to.z, camera.to.y], [camera.up.x, -camera.up.y, camera.up.z]);

        //   mat4.identity(modelMatrix);

        //  mat4.translate(modelMatrix, modelMatrix, [3.0, 0.0, 0.0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        this.setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numItems);
    }

    maximize() {
        //let node = this.getElement().parentNode;
        //if (node) {
        let w = window.innerWidth;// - (parseInt(node.style.paddingRight || "0", 10) + parseInt(node.style.paddingLeft || "0", 10) ) || 1;
        let h = window.innerHeight;// || this.getHeight() || 1;
        if (this.getWidth() !== w * this._scaling || this.getHeight() !== h * this._scaling) {
            this.resize(w * this._scaling, h * this._scaling);
        }
        // }*/
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
