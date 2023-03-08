import {GameSurfaceGLProgramHandler} from "./GameSurfaceGLProgramHandler";
// @ts-ignore
import {mat4} from "gl-matrix";
import {DegToRad} from "../Utils";
import {VBOHandler} from "./VBOHandler";

export const positionVertexSize = 3;
export const positionNormalSize = 3;
export const colorVertexSize = 4;
export const vertexSizeInBytes = (positionNormalSize * Float32Array.BYTES_PER_ELEMENT) + (positionVertexSize * Float32Array.BYTES_PER_ELEMENT) + (colorVertexSize * Float32Array.BYTES_PER_ELEMENT);
export const vertexSizeInFloats = vertexSizeInBytes / Float32Array.BYTES_PER_ELEMENT;

// @ts-ignore
import {v4 as uuidv4} from 'uuid';
import {lerp} from "../math/Vec2";
import {GameSurfaceGLCamera, GameSurfaceGLLight} from "../../../client/neighbors/client/controller/PlayController";
import {CLEAR_COLOR} from "./GameSurfaceGL";

export const START = Date.now();

export class VAOHandlerInterface {


    uuid: string;
    gl: any;
    vao: any;
    program: GameSurfaceGLProgramHandler;
    f: string;
    v: string;
    renderedTris:number = 0;

    lastBufferedVBO: string;

    attributes: {
        vertPosition?,
        vertColor?
        vertNormal?
    }
    buffers: {
        vertPosition?,
        vertColor?
        vertNormal?
    }
    uniforms: {
        mWorld?,
        mProj?,
        sWorld?,
        sProj?,
        samplerUniform?,
        fTime?,
        mProp?
    }

    depthTextureVAOProvider;

    constructor(props?) {
        this.uuid = uuidv4();
    }

    protected _update(gl) {
        if (gl) {
            this.gl = gl;
        }

        if (this.gl) {

            /*if (this.gl.getError() !== 0){
                console.log(this.gl.getError());
                if (this.program && this.program.getProgram()) {
                        console.log(this.gl.getProgramInfoLog(this.program.getProgram()));
                } else {
                    console.log(`No binding to this.program.getProgram()`);
                }

            }*/

            if (!this.program) {
                if (this.f && this.v) {
                    this.program = this._compileProgram(this.v, this.f);
                    this._verifyProgram(this.uuid, this.program.getProgram());
                } else {
                    return false;
                }
            }
        }
        if (!this.program) {
            return false;
        }
        if (!this.vao) {
            this.vao = {}
        }

        this.renderedTris = 0;

        return true;
    }

    getVAOForUUID(uuid: string) {
        if (!this.vao) {
            return false;
        }
        if (!this.gl) {
            return false;
        }
        let vao = this.vao[uuid];
        if (!vao) {
            this.vao[uuid] = this.gl.createVertexArray();
        }
        return this.vao[uuid];
    }

    _verifyShader(name: string, shader) {
        const shaderCompileCheck = this.gl.getShaderInfoLog(shader);
        if (shaderCompileCheck && shaderCompileCheck.length > 0) { /* message may be an error or a warning */
            let errs = shaderCompileCheck.split("ERROR: ");
            errs.forEach((err) => {
                if (err && err.length) {
                    console.warn({message: `${name} Shader Compilation Failed`, data: `ERROR: ${err}`});
                }
            })
        }
    }

    _verifyProgram(name: string, program) {
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const linkErrLog = this.gl.getProgramInfoLog(program);
            // this.cleanup();
            console.warn({message: `Verify Program (${name}) did not link successfully.`, data: linkErrLog});
            return;
        } else {
            console.info('shader program setup');
        }
    }

    public update(gl) {

        if (!gl) {
            return;
        }
        this.gl = gl;

        if (!this._update(this.gl)) {
            return;
        }

        if (!this.attributes) {
            this.attributes = {};
            this.attributes.vertPosition = this.gl.getAttribLocation(this.program.getProgram(), 'vertPosition');
           // this.gl.enableVertexAttribArray(this.attributes.vertPosition);
            this.attributes.vertColor = this.gl.getAttribLocation(this.program.getProgram(), 'vertColor');
            //this.gl.enableVertexAttribArray(this.attributes.vertColor);
            this.attributes.vertNormal = this.gl.getAttribLocation(this.program.getProgram(), 'vertNormal');
         //   this.gl.enableVertexAttribArray(this.attributes.vertNormal);
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
        if (!this.uniforms.samplerUniform && this.depthTextureVAOProvider) {
            this.uniforms.samplerUniform = this.gl.getUniformLocation(this.program.getProgram(), 'depthColorTexture');
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
        mat4.ortho(sProj, -shadowFrustrumVolumeSize, shadowFrustrumVolumeSize, -shadowFrustrumVolumeSize, shadowFrustrumVolumeSize, -100, 100);

        // @ts-ignore
        mat4.lookAt(sWorld, GameSurfaceGLLight.getFromWithUserZoomPositionRotationGL().toArray(), GameSurfaceGLLight.getToWithUserPositionGL().toArray(), GameSurfaceGLLight.up.toArray());

        this.gl.uniformMatrix4fv(this.uniforms.sProj, false, sProj);
        this.gl.uniformMatrix4fv(this.uniforms.sWorld, false, sWorld);

        this.gl.uniform1f(this.uniforms.fTime, Date.now() - START);
        let mProp = mat4.create();
        mProp[0] = 1;
        this.gl.uniformMatrix4fv(this.uniforms.mProp,false, mProp);


    }


    private _bindVBO(vbo: VBOHandler) {

        if (!this.attributes || !this.vao) {
            return false;
        }

        //if (this.lastBufferedVBO !== vbo.uuid) {
         //   console.log('BUFFER DATA SWAP WTF');
       // }
        if (vbo.vbo && vbo.data) {
        this.renderedTris += (vbo.data.length/10)/3;
        }
        if (vbo.dirtyForVAO.indexOf(this.uuid) == -1) {
            if (!vbo.dynamic){console.log("SWAPPING BUFFERS");}
            this.gl.bindVertexArray(this.getVAOForUUID(vbo.uuid));
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo.vbo);
            if (vbo.vbo && vbo.data) {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, vbo.data, vbo.dynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW);
            } else {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, Float32Array.from(
                    [
                        -1, -1, 0, 1, 0.25, 0.23, 1,
                        1, -1, 0, 0.1, 0.25, 0.93, 1,
                        0, 2, 0, 0.3, 0.75, 0.23, 1
                    ]
                ), vbo.dynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW);
            }
            this.bindAttribPointers();

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            this.gl.bindVertexArray(null);
            vbo.dirtyForVAO.push(this.uuid);

           // this.lastBufferedVBO = vbo.uuid;
            //vbo.dirty = false;
        }
        //this.boundBuffers.push(vbo.uuid);
    }


    private _attachUniforms() {
        if (!this.gl) {
            return
        }
        if (!this.program) {
            return
        }
        this.attachUniforms();
    }

    setProgram(gl, v: string, f: string) {
        this.f = f;
        this.v = v;
        if (this.program) {
            return
        }
        if (!gl) {
            return
        }
        this.program = this._compileProgram(v, f);
    }

    getProgram() {
        return this.program;
    }

    private _bindAttributesAndUniforms() {

        if (!this.uniforms) {
            console.warn('NO UNIFORMS..?');
            return;
        }

        this.bindUniforms();

    }

    _bindDepthTexture() {
        if (!this.depthTextureVAOProvider) {
            return false;
        }
        this.gl.activeTexture(this.gl.TEXTURE0); // TODO Select proper active texture slot
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthTextureVAOProvider.depthTexture);
        this.gl.uniform1i(this.uniforms.samplerUniform, 0);
    }

    bindDepthTexturesVAOProvider(vao) {
        if (!this.program) {
            return false;
        }
        if (!this.uniforms) {
            return false;
        }
        this.depthTextureVAOProvider = vao;
    }


    setupFrameBuffer() {
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.clearColor(CLEAR_COLOR.r / 255, CLEAR_COLOR.g / 255, CLEAR_COLOR.b / 255, 1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    }


    renderVBO(vbos: VBOHandler | VBOHandler[]) {

        if (!this.program) {
            return
        }
        if (!this.gl){
            console.error('NO GL BINDING????');
        }
        this.gl.useProgram(this.program.getProgram());

        if (!Array.isArray(vbos)) {
            vbos = [vbos];
        }

        this._attachUniforms();
        this._bindAttributesAndUniforms();

        // TODO BIND TO CAMERA PROGRAM

        this.setupFrameBuffer();


        vbos.forEach((vbo) => {

            this._bindVBO(vbo);
            this.gl.bindVertexArray(this.getVAOForUUID(vbo.uuid));
            if (this.depthTextureVAOProvider) {
                if (this.depthTextureVAOProvider.depthTexture) {
                    this._bindDepthTexture();
                }
            }

            this.gl.drawArrays(this.gl.TRIANGLES, 0, (vbo.vbo && vbo.data) ? vbo.vertCount : 3);


        });
        this.gl.bindVertexArray(null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        //   this.gl.bindVertexArray(null);
        //  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    _compileProgram(vertexShaderGLSL, fragmentShaderGLSL): GameSurfaceGLProgramHandler {

        var _vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
        this.gl.shaderSource(_vertexShader, vertexShaderGLSL);
        this.gl.compileShader(_vertexShader);

        this._verifyShader(this.uuid + "-vertex", _vertexShader);

        var _fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        this.gl.shaderSource(_fragmentShader, fragmentShaderGLSL)
        this.gl.compileShader(_fragmentShader);

        this._verifyShader(this.uuid + "-fragment", _fragmentShader);

        const programHandler = new GameSurfaceGLProgramHandler(this.gl.createProgram());
        this.gl.attachShader(programHandler.getProgram(), _vertexShader)
        this.gl.attachShader(programHandler.getProgram(), _fragmentShader)
        this.gl.linkProgram(programHandler.getProgram())

        this.gl.detachShader(programHandler.getProgram(), _vertexShader);
        this.gl.detachShader(programHandler.getProgram(), _fragmentShader);
        this.gl.deleteShader(_vertexShader);
        this.gl.deleteShader(_fragmentShader);

        return programHandler;
    }
}
