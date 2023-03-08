import {
    colorVertexSize,
    positionNormalSize,
    positionVertexSize, START,
    VAOHandlerInterface,
    vertexSizeInBytes
} from "./VAOHandlerInterface";
// @ts-ignore
import {mat4} from "gl-matrix";
import {lerp, Vec2} from "../math/Vec2";
//import {GameSurfaceGLCamera, GameSurfaceGLLight} from "../GameMapHandler";
import {DegToRad} from "../Utils";
import {GameSurfaceGLCamera, GameSurfaceGLLight} from "../../../client/neighbors/client/controller/PlayController";


export class VAOScreenSpaceHandler extends VAOHandlerInterface {

    textureResolution: Vec2 = (new Vec2()).set(512, 512);
    frameBuffer;
    texture2D = null;
    type: string = "ScreenSpace";

    constructor() {
        super()
    }

    public update(gl) {
        if (!this._update(gl)) {
            return;
        }

        if (!this.attributes) {
            this.attributes = {};
            this.attributes.vertPosition = this.gl.getAttribLocation(this.program.getProgram(), 'vertPosition');
            this.gl.enableVertexAttribArray(this.attributes.vertPosition);
            this.attributes.vertColor = this.gl.getAttribLocation(this.program.getProgram(), 'vertColor');
            this.gl.enableVertexAttribArray(this.attributes.vertColor);
            this.attributes.vertNormal = this.gl.getAttribLocation(this.program.getProgram(), 'vertNormal');
            this.gl.enableVertexAttribArray(this.attributes.vertNormal);
        }

        if (!(this.attributes.vertPosition)) {
            //   console.log({message: `VAOLightHandler getAttribLocation no camera attribute pointer vertPosition`})
        }
        if (!(this.attributes.vertColor)) {
            console.log({message: `VAOScreenSpaceHandler getAttribLocation no camera attribute pointer vertColor`})
        }
        if (!(this.attributes.vertNormal)) {
            console.log({message: `VAOScreenSpaceHandler getAttribLocation no camera attribute pointer vertNormal`})
        }

    }

    public attachUniforms() {
        if (!this.uniforms) {
            this.uniforms = {};
        }
        if (!this.uniforms.mProj) {
            this.uniforms.mProj = this.gl.getUniformLocation(this.program.getProgram(), 'mProj')
        }
        if (!this.uniforms.mWorld) {
            this.uniforms.mWorld = this.gl.getUniformLocation(this.program.getProgram(), 'mWorld')
        }
        if (!this.uniforms.sProj) {
            this.uniforms.sProj = this.gl.getUniformLocation(this.program.getProgram(), 'sProj')
        }
        if (!this.uniforms.sWorld) {
            this.uniforms.sWorld = this.gl.getUniformLocation(this.program.getProgram(), 'sWorld')
        }

        if (!this.uniforms.mProp) {
            this.uniforms.mProp = this.gl.getUniformLocation(this.program.getProgram(), 'mProp')
        }

        if (!this.uniforms.fTime) {
            this.uniforms.fTime = this.gl.getUniformLocation(this.program.getProgram(), 'fTime')
        }
        if (isNaN(this.uniforms.sProj) && typeof this.uniforms.sProj !== "object") {
            console.log({message: `getUniformLocation no camera uniform pointer sProj`})
        }
        if (isNaN(this.uniforms.sWorld) && typeof this.uniforms.sWorld !== "object") {
            console.log({message: `getUniformLocation no camera uniform pointer sWorld`})
        }
    }

    public bindAttribPointers() {
        if (!this.attributes) {
            return
        }
        this.gl.vertexAttribPointer(this.attributes.vertPosition, positionVertexSize, this.gl.FLOAT, false, vertexSizeInBytes, 0);
        this.gl.enableVertexAttribArray(this.attributes.vertPosition);

        this.gl.vertexAttribPointer(this.attributes.vertNormal, positionNormalSize, this.gl.FLOAT, false, vertexSizeInBytes, positionVertexSize * Float32Array.BYTES_PER_ELEMENT);
        this.gl.enableVertexAttribArray(this.attributes.vertNormal);

        this.gl.vertexAttribPointer(this.attributes.vertColor, colorVertexSize, this.gl.FLOAT, false, vertexSizeInBytes, (positionVertexSize + positionNormalSize) * Float32Array.BYTES_PER_ELEMENT);
        this.gl.enableVertexAttribArray(this.attributes.vertColor);
    }

    public bindUniforms() {
        if (!this.uniforms) {
            return;
        }
        let mProj = mat4.create(), mWorld = mat4.create();
        let camera_zoom_real = (GameSurfaceGLCamera.getZoom() / 40);
        mat4.perspective(mProj, DegToRad(GameSurfaceGLCamera.fov), this.gl.viewportWidth / this.gl.viewportHeight, 10, 1000 + (GameSurfaceGLCamera.zoom * 2))
        // @ts-ignore
        mWorld = mat4.lookAt(mWorld, GameSurfaceGLCamera.getFromWithUserZoomPositionRotationGL().toArray(), GameSurfaceGLCamera.getToWithUserPositionGL().toArray(), GameSurfaceGLCamera.up.toArray());

        this.gl.useProgram(this.program.getProgram());
        this.gl.uniformMatrix4fv(this.uniforms.mProj, false, mProj);
        this.gl.uniformMatrix4fv(this.uniforms.mWorld, false, mWorld);

        let sProj = mat4.create(), sWorld = mat4.create();
        let shadowFrustrumVolumeSize = lerp(15, 40, (GameSurfaceGLCamera.getZoom() / 40))

        GameSurfaceGLLight.to.copy(GameSurfaceGLCamera.getToWithUserPositionGL()).round();
        mat4.ortho(sProj, -shadowFrustrumVolumeSize, shadowFrustrumVolumeSize, -shadowFrustrumVolumeSize, shadowFrustrumVolumeSize, -20, 40);

        // @ts-ignore
        mat4.lookAt(sWorld, GameSurfaceGLLight.getFromWithUserZoomPositionRotationGL().toArray(), GameSurfaceGLLight.getToWithUserPositionGL().toArray(), GameSurfaceGLLight.up.toArray());

        this.gl.uniformMatrix4fv(this.uniforms.sProj, false, sProj);
        this.gl.uniformMatrix4fv(this.uniforms.sWorld, false, sWorld);

        this.gl.uniform1f(this.uniforms.fTime, Date.now() - START);
        let mProp = mat4.create();
        mProp[0] = 1;
        this.gl.uniformMatrix4fv(this.uniforms.mProp,false, mProp);


    }

    public setupFrameBuffer() {
        if (!this.frameBuffer) {
            console.log("GENERATING SCREENSPACE FRAME BUFFER");
            // this.gl.bindVertexArray(this.vao);
            this.frameBuffer = this.gl.createFramebuffer();

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

            this.texture2D = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture2D);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA32F, this.textureResolution.x, this.textureResolution.y, 0, this.gl.RGBA, this.gl.FLOAT, null);

            const renderBuffer = this.gl.createRenderbuffer();
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderBuffer);
            const ext = this.gl.getExtension('EXT_color_buffer_float');

            //this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.RGBA32F, 512, 512);

           this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT32F, this.textureResolution.x, this.textureResolution.y);

            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture2D, 0);
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.RGBA4, this.gl.RENDERBUFFER, renderBuffer);

            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
            //this.gl.bindVertexArray(null);
        }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
        //  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, 0);
        // Set the viewport to our shadow texture's size
        this.gl.viewport(0, 0, this.textureResolution.x, this.textureResolution.y);
        this.gl.clearColor(0, 1, 0, 1);
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


    }

    renderFrameBuffer() {
        if (!this.gl) {
            return
        }
        if (!this.frameBuffer) {
            return;
        }
        //  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        this.gl.bindFramebuffer(this.gl.READ_FRAMEBUFFER, this.frameBuffer);
        this.gl.readBuffer(this.gl.COLOR_ATTACHMENT0);
        this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, null);
        //this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // this.gl.viewport(0, 0, this.textureResolution.x, this.textureResolution.y);
        this.gl.blitFramebuffer(0, 0, this.textureResolution.x, this.textureResolution.y, 0, 0, 128, 128,
            this.gl.COLOR_BUFFER_BIT, this.gl.NEAREST);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

}
