import {lerp, Vec2} from "../math/Vec2";
import CanvasBrokenView from "../../client/view/CanvasBroken.ejs";

//import cameraVertexGLSL from "./cameraVertex.glsl";
//import cameraFragmentGLSL from "./cameraFragment.glsl";
//import lightVertexGLSL from "./lightVertex.glsl";
//import lightFragmentGLSL from "./lightFragment.glsl";
//import {arrayToTable} from "../ArrayToTable";
import {DegToRad, mergeTypedArraysUnsafe} from "../Utils";
import {RGB} from "../RGB";
// @ts-ignore
import {mat4} from "gl-matrix";
import {Camera} from "../interactive/Camera";
import {Vec3} from "../math/Vec3";
//import {RememberLocalValue} from "../RememberLocalValue";
//import {StaticMeshManager} from "../StaticMeshManager";
import { GameSurfaceGLProgramHandler } from "./GameSurfaceGLProgramHandler";
import {BufferedMesh} from "./BufferedMesh";
//import {app, ejs, generateStateTemplate} from "../../client/app";
import {arrayToTable} from "../ArrayToTable";

export const shadowDepthTextureSize = 1024;

export const CLEAR_COLOR = new RGB(1, 1, 1);
export const TARGET_CLEAR_COLOR = new RGB(1, 1, 1);
/*
export const RENDER_SETTINGS = {
    USE_CLOUDS: new RememberLocalValue('USE_CLOUDS', false),
    USE_FOG: new RememberLocalValue('USE_FOG', false),
    USE_FOG_VOLUME: new RememberLocalValue('USE_FOG_VOLUME', false),
    USE_FOG_WARBLE: new RememberLocalValue('USE_FOG_WARBLE', false),
    USE_SHADOWS: new RememberLocalValue('USE_SHADOWS', true),
    USE_PCF: new RememberLocalValue('USE_PCF', false),
    USE_FBM: new RememberLocalValue('USE_FBM', false),
    USE_CARTOON: new RememberLocalValue('USE_CARTOON', false),
};
*/



export const bufferSize = {
    position: -1,
    color: -1
};

export const ActiveRenderBufferedMesh = new BufferedMesh();

export class GameSurfaceGL {

    element;
    canvas;
    scaling: number = (window.devicePixelRatio ? window.devicePixelRatio : 1);
    gl: any;
    errors = [];

    displaySize: Vec2 = new Vec2().set(0, 0);

    buffered: {
        vertPosition: Float32Array,
        vertColor: Float32Array
    };

    _meshsToRender = [];//number = 0;

    programs: any;
    attributes: any;
    uniforms: any;

    constructor(element?) {
        this.canvas = element || <HTMLCanvasElement>document.getElementById('GameSurfaceGL');
        this.programs = {};
        this.attributes = {};
        this.uniforms = {};
        this.buffered = {
            vertPosition: new Float32Array(0),
            vertColor: new Float32Array(0)
        };
    }

    setCanvas(element){
        this.canvas = element || <HTMLCanvasElement>document.getElementById('GameSurfaceGL');
    }

    checkGLCompatibility(): boolean {
        return true;
    }

    _createShader() {

    }

    _createProgram(vertex, frament) {
        //returns shader program;
    }

    _linkProgram() {

    }

    _unlinkProgram() {

    }

    // USABLE INTERFACES
    fillContainer() {

    }

    fullscreen() {

    }

    _addMeshToBuffer(mesh) {
        if (mesh.colors && mesh.positions) {
            // this.buffered.vertPosition = mergeTypedArraysUnsafe(this.buffered.vertPosition, mesh._buffered.position);
            //this.buffered.vertColor = mergeTypedArraysUnsafe(this.buffered.vertColor, mesh._buffered.color);
            //this.bufferMesh.uv = mergeTypedArraysUnsafe(this.bufferMesh.uv, mesh._buffered.uv);
            //this.bufferMesh.normal = mergeTypedArraysUnsafe(this.bufferMesh.normal, mesh._buffered.normal);
            //  this._meshsToRender.push(mesh);
            ActiveRenderBufferedMesh.join(mesh);
        }
    }

    _generateStaticMesh() {

        this._clearMeshBuffers();
        //this._addMeshToBuffer(mesh_floor.clone().scale(Vec3.fromValues(30,30,0)).setColor(new RGB(70, 130, 86)).rotate(0, 0, 0).generateMeshBuffer());

        /* this._addMeshToBuffer((<Mesh>_MeshCharacter.getMesh(getTransformsForMesh(
             "idle"
         )).rotate(0, 0, 0).scale(Vec3.fromValues(3, 3, 3))).generateMeshBuffer())*/

    }


    // RUN  THE STACK BABY!!

    setupCanvas() {
        if (!this.canvas) {
            console.log('NO ATTACHED CANVA>....');
        }
    }

    getCanvas() {
        return this.canvas;
    }

    initWebGL() {
        if (this.gl){
            // return;
        }
        try {
            let gl = this.canvas.getContext('webgl2');

            if (!gl) {
                // @ts-ignore
                if (typeof WebGL2RenderingContext !== 'undefined') {
                    console.log('your browser appears to support WebGL2 but it might be disabled. Try updating your OS and/or video card drivers');
                } else {
                    console.log('your browser has no WebGL2 support at all');
                }
            } else {
                console.log('webgl2 selected!');
            }

            if (!gl) {
                gl = this.canvas.getContext('experimental-webgl');
                console.log('experimental-webgl selected!');

            }

            if (!gl) {
                gl = this.canvas.getContext('webgl');
                console.log('webgl1 selected!');
            }

            if (!gl) {
                // alert('Your browser does not support WebGL');
                this.setError({message: 'This browser may not support WebGL.'});
                return;
            }

            const ext = (
                gl.getExtension('OES_vertex_array_object') ||
                gl.getExtension('MOZ_OES_vertex_array_object') ||
                gl.getExtension('WEBKIT_OES_vertex_array_object')
            )
            console.log('WebGL Extensions', ext, "SUPPORTED",gl.getSupportedExtensions() );

            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.FRONT);
            gl.enable(gl.DEPTH_TEST);
            gl.viewportWidth = this.canvas.width;
            gl.viewportHeight = this.canvas.height;

            this.gl = gl;

        } catch (e) {
            this.setError({message: "Error in initializing WebGL.", data: e});
        }

        if (!this.gl) {
            this.setError({message: "Could not initialise WebGL."});
        }
    }

    setupInputEvents() {
    }

    setupOptions() {
    }

    _verifyShader(name: string, shader) {
        const shaderCompileCheck = this.gl.getShaderInfoLog(shader);

        if (shaderCompileCheck && shaderCompileCheck.length > 0) { /* message may be an error or a warning */

            let errs = shaderCompileCheck.split("ERROR: ");
            errs.forEach((err) => {
                if (err && err.length) {
                    this.setError({message: `${name} Shader Compilation Failed`, data: `ERROR: ${err}`});
                }
            })
        }
    }

    _verifyProgram(name: string, program) {
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const linkErrLog = this.gl.getProgramInfoLog(program);
            // this.cleanup();
            this.setError({message: `Verify Program (${name}) did not link successfully.`, data: linkErrLog});
            return;
        } else {
            console.info('shader program setup');
        }
    }

    _compileProgram(vertexShaderGLSL, fragmentShaderGLSL): GameSurfaceGLProgramHandler {

        var cameraVertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
        this.gl.shaderSource(cameraVertexShader, vertexShaderGLSL);
        this.gl.compileShader(cameraVertexShader);

        this._verifyShader("Vertex", cameraVertexShader);

        var cameraFragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        this.gl.shaderSource(cameraFragmentShader, fragmentShaderGLSL)
        this.gl.compileShader(cameraFragmentShader);

        this._verifyShader("Fragment", cameraFragmentShader);

        const programHandler = new GameSurfaceGLProgramHandler(this.gl.createProgram());
        this.gl.attachShader(programHandler.getProgram(), cameraVertexShader)
        this.gl.attachShader(programHandler.getProgram(), cameraFragmentShader)
        this.gl.linkProgram(programHandler.getProgram())

        this.gl.detachShader(programHandler.getProgram(), cameraVertexShader);
        this.gl.detachShader(programHandler.getProgram(), cameraFragmentShader);
        this.gl.deleteShader(cameraVertexShader);
        this.gl.deleteShader(cameraFragmentShader);

        return programHandler;
    }

    buildShaderPrograms() {

        // let cameraShader = new GLShaderBasic();
        if (!this.gl) {
            this.setError("buildShaderPrograms failed. No GL binding");
        }

        //this.programs.camera = this._compileProgram(cameraVertexGLSL, cameraFragmentGLSL);
        //this._verifyProgram("Camera", this.programs.camera.getProgram())

        //this.programs.light = this._compileProgram(lightVertexGLSL, lightFragmentGLSL);
        //this._verifyProgram("Light", this.programs.light.getProgram())

    }


    _buildFrameBuffers() {

        this.gl.useProgram(this.programs.light.getProgram());
        this.programs.light.frameBuffers.shadowFramebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.programs.light.frameBuffers.shadowFramebuffer);

        this.programs.light.textures.shadowDepthTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.programs.light.textures.shadowDepthTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, shadowDepthTextureSize, shadowDepthTextureSize, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

        const renderBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, shadowDepthTextureSize, shadowDepthTextureSize);

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.programs.light.textures.shadowDepthTexture, 0);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, renderBuffer);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null)


    }

    _verifyAttributesAndUniforms() {
        console.log("VERIFY", this.programs.camera, typeof this.programs.camera.uniforms.mProj);
        if (isNaN(this.programs.camera.attributes.vertPosition)) {
            //  this.setError({message: `getAttribLocation no camera attribute pointer vertPosition`})
        }
        if (isNaN(this.programs.camera.attributes.vertColor)) {
            this.setError({message: `getAttribLocation no camera attribute pointer vertColor`})
        }
        if (isNaN(this.programs.camera.uniforms.mProj) && typeof this.programs.camera.uniforms.mProj !== "object") {
            this.setError({message: `getUniformLocation no camera uniform pointer mProj`})
        }
        if (isNaN(this.programs.camera.uniforms.mWorld) && typeof this.programs.camera.uniforms.mWorld !== "object") {
            this.setError({message: `getUniformLocation no camera uniform pointer mWorld`})
        }
        if (isNaN(this.programs.camera.uniforms.sWorld) && typeof this.programs.camera.uniforms.sWorld !== "object") {
            this.setError({message: `getUniformLocation no camera uniform pointer sWorld`})
        }
        if (isNaN(this.programs.camera.uniforms.sProj) && typeof this.programs.camera.uniforms.sProj !== "object") {
            this.setError({message: `getUniformLocation no camera uniform pointer sProj`})
        }
    }

    _buildAttributesAndUniforms() {

        this.gl.useProgram(this.programs.camera.getProgram())
        this.programs.camera.attributes.vertPosition = this.gl.getAttribLocation(this.programs.camera.getProgram(), 'vertPosition');
        console.info("this.programs.camera.attributes.vertPosition", this.programs.camera.attributes.vertPosition);
        this.gl.enableVertexAttribArray(this.programs.camera.attributes.vertPosition);
        this.programs.camera.buffers.vertPosition = this.gl.createBuffer();


        this.programs.camera.attributes.vertColor = this.gl.getAttribLocation(this.programs.camera.getProgram(), 'vertColor');
        this.gl.enableVertexAttribArray(this.programs.camera.attributes.vertColor);
        console.info("this.programs.camera.attributes.vertColor", this.programs.camera.attributes.vertColor);

        this.programs.camera.buffers.vertColor = this.gl.createBuffer();

        this.programs.camera.uniforms.USE_CLOUDS = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'USE_CLOUDS');
        this.programs.camera.uniforms.USE_FOG = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'USE_FOG');
        this.programs.camera.uniforms.USE_FOG_VOLUME = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'USE_FOG_VOLUME');
        this.programs.camera.uniforms.USE_FOG_WARBLE = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'USE_FOG_WARBLE');
        this.programs.camera.uniforms.USE_SHADOWS = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'USE_SHADOWS');
        this.programs.camera.uniforms.USE_PCF = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'USE_PCF');
        this.programs.camera.uniforms.USE_FBM = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'USE_FBM');
        this.programs.camera.uniforms.USE_CARTOON = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'USE_CARTOON');

        this.programs.camera.uniforms.mProj = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'mProj');
        this.programs.camera.uniforms.mWorld = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'mWorld');
        this.programs.camera.uniforms.sProj = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'sProj');
        this.programs.camera.uniforms.sWorld = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'sWorld');

        this.programs.camera.uniforms.PCFradius = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'PCFradius');
        this.programs.camera.uniforms.PCFcount = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'PCFcount');
        this.programs.camera.uniforms.PCFdensity = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'PCFdensity');

        this.programs.camera.uniforms.fogOrigin = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'fogOrigin');
        this.programs.camera.uniforms.fogColor = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'fogColor');

        this.programs.camera.uniforms.cameraOrigin = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'cameraOrigin');

        this.programs.camera.uniforms.worldTick = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'worldTick');
        //this.programs.camera.uniforms.worldClearColor = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'PCFdensity');

        this.programs.camera.uniforms.samplerUniform = this.gl.getUniformLocation(this.programs.camera.getProgram(), 'depthColorTexture');

        this.gl.useProgram(this.programs.light.getProgram())

        this.programs.light.attributes.vertPosition = this.gl.getAttribLocation(this.programs.light.getProgram(), 'vertPosition');
        this.gl.enableVertexAttribArray(this.programs.light.attributes.vertPosition);
        this.programs.light.buffers.vertPosition = this.gl.createBuffer();

        this.programs.light.uniforms.sProj = this.gl.getUniformLocation(this.programs.light.getProgram(), 'sProj');
        this.programs.light.uniforms.sWorld = this.gl.getUniformLocation(this.programs.light.getProgram(), 'sWorld');

    }

    _clearMeshBuffers() {
        //this._meshsToRender = [];
        ActiveRenderBufferedMesh.set([], [], [])
        // this.buffered = {
        //     vertPosition: new Float32Array(0),
        //     vertColor: new Float32Array(0)
        // };

        // TODO MAYBE CLEAR CAMERA SHADER BUFFERS AS WELL???
    }

    buildBuffers() {
        this._buildFrameBuffers();
        this._buildAttributesAndUniforms();
        this._verifyAttributesAndUniforms();

        this._clearMeshBuffers();

    }

    // "ATOMIC" STATE SETTERS use these for things like passing attributes and ... UNIFORMS??
    _bindAndSetContentsOfBuffer(bufferName: string, GLbuffer, dataBuffer, GLattribute, attributeSize = 3) { // THIS probably doesnt need to be called every frame, only when NEW data is required on the GPU
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, GLbuffer);
        //let _bS = this.gl.getBufferParameter(this.gl.ARRAY_BUFFER, this.gl.BUFFER_SIZE);
        //if (dataBuffer.byteLength !== bufferSize[bufferName]) {
        // console.log('BUFFER FULL DATA', _bS, dataBuffer.byteLength, bufferSize[bufferName]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, dataBuffer, this.gl.DYNAMIC_DRAW);
        //} else {
        // console.log('BUFFER SUB DATA SAME SIZE', _bS, dataBuffer.byteLength);
        //   this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, dataBuffer, dataBuffer.byteLength);
        // }
        //bufferSize[bufferName] = dataBuffer.byteLength;
        this.gl.vertexAttribPointer(GLattribute, attributeSize, this.gl.FLOAT, false, 0, 0);
    }

    bindAttributesAndUniforms() {
        /*
                let mProj = mat4.create(), mWorld = mat4.create();
                let camera_zoom_real = (GameSurfaceGLCamera.getZoom() / 40);
                mat4.perspective(mProj, DegToRad(GameSurfaceGLCamera.fov), this.gl.viewportWidth / this.gl.viewportHeight, GameSurfaceGLCamera.from.dist(GameSurfaceGLCamera.to)/2, 1000 + (GameSurfaceGLCamera.zoom))
                // mat4.translate(mWorld, mWorld, GameSurfaceGLCamera.getFromWithUserZoomPositionRotationGL().toArray());
                mWorld = mat4.lookAt(mWorld, GameSurfaceGLCamera.getFromWithUserZoomPositionRotationGL().toArray(), GameSurfaceGLCamera.getToWithUserPositionGL().toArray(), GameSurfaceGLCamera.up.toArray());

                let sProj = mat4.create(), sWorld = mat4.create();
                let shadowFrustrumVolumeSize = lerp(15, 40, (GameSurfaceGLCamera.getZoom() / 40))

                GameSurfaceGLLight.to.copy(GameSurfaceGLCamera.getToWithUserPositionGL()).round();
                mat4.ortho(sProj, -shadowFrustrumVolumeSize, shadowFrustrumVolumeSize, -shadowFrustrumVolumeSize, shadowFrustrumVolumeSize, -20, 40);

                mat4.lookAt(sWorld, GameSurfaceGLLight.getFromWithUserZoomPositionRotationGL().toArray(), GameSurfaceGLLight.getToWithUserPositionGL().toArray(), GameSurfaceGLLight.up.toArray());

                // you need to use location from current shader program
                this.gl.useProgram(this.programs.camera.getProgram());
                // ATTRIBUTES
                // TODO IF no buffered mesh, you might get warning INVALID_OPERATION: bufferData: no buffer
                this._bindAndSetContentsOfBuffer('position', this.programs.camera.buffers.vertPosition, ActiveRenderBufferedMesh.getRenderBuffered().positions.slice(0, ActiveRenderBufferedMesh.attribCount), this.programs.camera.attributes.vertPosition, 3)
                this._bindAndSetContentsOfBuffer('color', this.programs.camera.buffers.vertColor, ActiveRenderBufferedMesh.colors.slice(0, ActiveRenderBufferedMesh.attribCount), this.programs.camera.attributes.vertColor, 3);
                // UNIFORMS
                this.gl.uniform1i(this.programs.camera.uniforms.USE_CLOUDS,  RENDER_SETTINGS.USE_CLOUDS.getValue());
                this.gl.uniform1i(this.programs.camera.uniforms.USE_FOG,  RENDER_SETTINGS.USE_FOG.getValue());
                this.gl.uniform1i(this.programs.camera.uniforms.USE_FOG_VOLUME,  RENDER_SETTINGS.USE_FOG_VOLUME.getValue());
                this.gl.uniform1i(this.programs.camera.uniforms.USE_FOG_WARBLE,  RENDER_SETTINGS.USE_FOG_WARBLE.getValue());
                this.gl.uniform1i(this.programs.camera.uniforms.USE_SHADOWS,  RENDER_SETTINGS.USE_SHADOWS.getValue());
                this.gl.uniform1i(this.programs.camera.uniforms.USE_PCF,  RENDER_SETTINGS.USE_PCF.getValue());
                this.gl.uniform1i(this.programs.camera.uniforms.USE_FBM,  RENDER_SETTINGS.USE_FBM.getValue());
                this.gl.uniform1i(this.programs.camera.uniforms.USE_CARTOON, RENDER_SETTINGS.USE_CARTOON.getValue());

                this.gl.uniformMatrix4fv(this.programs.camera.uniforms.mProj, false, mProj);
                this.gl.uniformMatrix4fv(this.programs.camera.uniforms.mWorld, false, mWorld);
                this.gl.uniformMatrix4fv(this.programs.camera.uniforms.sProj, false, sProj);
                this.gl.uniformMatrix4fv(this.programs.camera.uniforms.sWorld, false, sWorld);

                this.gl.uniform1f(this.programs.camera.uniforms.PCFdensity, lerp(200, 100, camera_zoom_real));
                this.gl.uniform1i(this.programs.camera.uniforms.PCFradius, 0);
                 this.gl.uniform1i(this.programs.camera.uniforms.PCFcount, 4);

                this.gl.uniform3fv(this.programs.camera.uniforms.fogColor, [CLEAR_COLOR.r / 255, CLEAR_COLOR.g / 255, CLEAR_COLOR.b / 255]);
                this.gl.uniform1f(this.programs.camera.uniforms.worldTick, GameSurfaceGLCamera.tick);
                let fogOrigin = GameSurfaceGLCamera.getToWithUserPositionGL();
                this.gl.uniform3fv(this.programs.camera.uniforms.fogOrigin, new Float32Array([fogOrigin.x, fogOrigin.y, fogOrigin.z]));
                let cameraOrigin = GameSurfaceGLCamera.getToWithUserPositionGL();
                this.gl.uniform3fv(this.programs.camera.uniforms.cameraOrigin, new Float32Array(GameSurfaceGLCamera.getFromWithUserZoomPositionRotationGL().toArray()));



                // you need to use location from current shader program
                this.gl.useProgram(this.programs.light.getProgram());
                // ATTRIBUTES
                // TODO IF no buffered mesh, you might get warning INVALID_OPERATION: bufferData: no buffer
                this._bindAndSetContentsOfBuffer('position', this.programs.light.buffers.vertPosition, ActiveRenderBufferedMesh.getRenderBuffered().positions.slice(0, ActiveRenderBufferedMesh.attribCount), this.programs.light.attributes.vertPosition, 3)

                // UNIFORMS

                // mat4.translate(mWorld, mWorld, GameSurfaceGLCamera.getFromWithUserZoomPositionRotationGL().toArray());
                this.gl.uniformMatrix4fv(this.programs.light.uniforms.sProj, false, sProj);
                this.gl.uniformMatrix4fv(this.programs.light.uniforms.sWorld, false, sWorld);
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        */

    }

    setup() {
        this.buildShaderPrograms();
        this.buildBuffers();
        //  this.gameSurfaceGL.linkShaders();
        this._generateStaticMesh();

        //this.gameSurfaceGL.lightFrameBufferSetup()
        //this.gameSurfaceGL.lightShaderUniforms()
        //this.gameSurfaceGL.cameraShaderUniforms()
    }

    _getTriangleCountFromMeshBuffers() {
        let position = ActiveRenderBufferedMesh.attribCount;
        let color = ActiveRenderBufferedMesh.attribCount;
        return {
            position, color
        }
    }

    // DO THE LOOP HERE AND CALL THE OTHER FUNCTIONS ONLY WHEN YOU NEED THEM

    _renderShadowMap() {
        // TODO implement
        this.gl.useProgram(this.programs.light.getProgram());

        // Draw to our off screen drawing buffer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.programs.light.frameBuffers.shadowFramebuffer);

        // Set the viewport to our shadow texture's size
        this.gl.viewport(0, 0, shadowDepthTextureSize, shadowDepthTextureSize);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, castAndRecievePositionBuffer);
        /// this.gl.vertexAttribPointer(vertexPositionAttrib, 3, this.gl.FLOAT, false, 0, 0);

        // We draw our dragon onto our shadow hashMap texture
        //  const lightDragonMVMatrix = mat4.create();
        //mat4.rotateY(lightDragonMVMatrix, lightDragonMVMatrix, meshRotateY);
        //mat4.translate(lightDragonMVMatrix, lightDragonMVMatrix, [0, 0, 0]);
        // mat4.multiply(lightDragonMVMatrix, lightViewMatrix, lightDragonMVMatrix);
        // this.gl.uniformMatrix4fv(sWorld, false, lightDragonMVMatrix);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, (this._getTriangleCountFromMeshBuffers().position) / 3)

        //this.gl.drawArrays(this.gl.TRIANGLES, 0, castAndRecievePositions.length / 3);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    }

    _renderOccluders() {
        this.gl.useProgram(this.programs.camera.getProgram());
        // TODO BIND TO CAMERA PROGRAM
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.clearColor(CLEAR_COLOR.r / 255, CLEAR_COLOR.g / 255, CLEAR_COLOR.b / 255, 1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)


        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.programs.light.textures.shadowDepthTexture);
        this.gl.uniform1i(this.programs.camera.uniforms.samplerUniform, 0);

        // gl.drawElements(gl.TRIANGLES, dragonIndices.length, gl.UNSIGNED_SHORT, 0);
        //gl.drawArrays(gl.TRIANGLES, 0, (castAndRecievePositions.length) / 3)


        //this.gl.vertexAttribPointer(this.programs.attributes.vertPosition, 3, this.gl.FLOAT, false, 0, 0);

        // gl.drawElements(gl.TRIANGLES, dragonIndices.length, gl.UNSIGNED_SHORT, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, (this._getTriangleCountFromMeshBuffers().position) / 3);
        // DATA SHOULD ALREADY BE BUFFERED AND ONLY IF CHANGED
    }

    render() {
        this.bindAttributesAndUniforms();

        this._renderShadowMap();
        this._renderOccluders();
        // GameSurfaceGLLight.userRotation.z+= 0.01;
    }

    setError(error) {

        if (this.gl) {
            error.GLError = this.gl.getError();

            if (this.programs.camera && this.programs.camera.getProgram()) {
                error.GLProgramLog = this.gl.getProgramInfoLog(this.programs.camera.getProgram());
            } else {
                error.GLProgramLog = `No binding to this.programs.camera.getProgram()`;
            }

        }

        this.errors.push(error);
        console.error(`GameSurfaceGL Error`, error);
       // document.getElementById("canvas-surface-error-log").innerHTML = (app.render(CanvasBrokenView, Object.assign(generateStateTemplate(), {data: arrayToTable(this.errors)}), ejs.render));

    }

    maximize(fixed = false) {
        let parent = this.canvas.parentNode;
        if (!parent) {
            //return;
        }
        let w = Math.min(window.innerWidth, parent.offsetWidth);
        let h = Math.min(window.innerHeight, parent.offsetHeight);

        if (this.setSize(w, h) && fixed) {
            this.canvas.classList.add("fixed-canvas");
        }
    }

    setSize(w, h) {
        if (this.displaySize.x === w && this.displaySize.y === h) {
            return false;
        }
        this.displaySize.set(w, h);
        this.canvas.width = w * this.scaling;
        this.canvas.height = h * this.scaling;
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px";
        this.setViewPort(w * this.scaling, h * this.scaling);
        return true;
    }

    setViewPort(w, h) {
        if (!this.gl) {
            return
        }
        this.gl.viewportWidth = w;
        this.gl.viewportHeight = h;
    }

    getWidth() {
        return this.displaySize.x;
    }

    getHeight() {
        return this.displaySize.y;
    }

    getScaling() {
        return this.scaling;
    }

}


/* BIND BUFFER AND BIND DATA ESSENTIALLY JUST TELL THE GPU TO STORE SOME MEMORY ON THE DEVICE...
IN ORDER TO DESTORY WHICH IS OF WHAT WE HAVE BECOME.. THE STATE MACHINE..



 */
