export class GameSurfaceGLProgramHandler {
    attributes?;
    uniforms?;
    buffers?;
    _shaderProgram;
    frameBuffers?;
    textures?;

    constructor(program) {
        this._shaderProgram = program;
        this.attributes = {};
        this.uniforms = {};
        this.buffers = {};
        this.frameBuffers = {};
        this.textures = {};
    }

    getProgram() {
        return this._shaderProgram;
    }
}
