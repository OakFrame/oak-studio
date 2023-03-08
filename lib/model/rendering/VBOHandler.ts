import {BufferedMesh} from "./BufferedMesh";
import {BufferedMeshVBOHandlerStates, VBOHandlerUsageType} from "./VAOHandler";
// @ts-ignore
import {v4 as uuidv4} from 'uuid';

export class VBOHandler {

    // @ts-ignore
    gl: WebGL2RenderingContext;
    uuid: string;
    bufferedMeshVBOHandlerStates: any[];
    dirtyForVAO: string[] = [];
    vbo;
    data;
    dirty: boolean;
    rebuild: boolean;
    type: VBOHandlerUsageType = VBOHandlerUsageType.DYNAMIC;
    vertCount: number = 0;
    renderedHistory: string[] = [];
    dynamic: boolean = false;
    setDynamic(bool) {
        this.dynamic = bool;
    }

    constructor() {
        this.uuid = uuidv4();
        this.bufferedMeshVBOHandlerStates = [];
    }

    update(gl) {

        if (gl) {
            this.gl = gl;
        }

        if (!this.gl) {
            return;
        }
        if (!this.vbo) {
            //this.gl = gl;
            this.vbo = this.gl.createBuffer();
        }

        let dirty = this.getDirty();

        if (dirty && dirty.length) {
            for (let i = 0; i < dirty.length; i++) {
                let state = dirty[i];
                if (!state.offset) {
                    if (state.mesh) {
                        this.rebuild = true;
                        dirty[i].dirty = false;
                    }
                }
            }

            if (this.rebuild) {
                this.dirtyForVAO = [];
                this.dirty = true;
                let offset = 0;
                let m = new BufferedMesh();
                for (let i = 0; i < this.bufferedMeshVBOHandlerStates.length; i++) {
                    if (this.bufferedMeshVBOHandlerStates[i].mesh) {
                        m.join(this.bufferedMeshVBOHandlerStates[i].mesh);
                        this.bufferedMeshVBOHandlerStates[i].offset = offset;
                        offset += m.attribCount;
                    }
                }

                let int = m.getInterleaved();
                this.vertCount = (int.length / 10);
                this.data = Float32Array.from(int);
                this.rebuild = false;
            } else {
                // this.dirty = false;
            }

        }


    }

    getElements() {
        return
    }

    getDirty() {
        const dirty = [];
        this.bufferedMeshVBOHandlerStates.forEach((state, i) => {

            if (this.renderedHistory.indexOf(state.uuid) == -1) {
                state.dirty = true;
                this.rebuild = true;
                this.bufferedMeshVBOHandlerStates.splice(this.getStateIndex(state.uuid), 1);
            }

            if (state.dirty || isNaN(state.offset)) {
                dirty.push(state);
            }
        })

        this.renderedHistory = [];

        return dirty;
    }

    getStateIndex(uuid: string) {
        let found;

        this.bufferedMeshVBOHandlerStates.forEach((state, i) => {
            if (state.uuid === uuid) {
                found = i;
                return i;
            }
        })

        return found;
    }

    queueBufferedMeshToBufferedMeshHandler(uuid, mesh, dirty = false) {
        this.renderedHistory.push(uuid);
        let queued: BufferedMeshVBOHandlerStates = this.selectedBufferedMeshHandlerByUUID(uuid);
        if (!queued || dirty) {
            const q = {
                uuid: uuid,
                dirty: true,
                last_queued: Date.now(),
                mesh: mesh
            }
            if (!queued) {
                this.bufferedMeshVBOHandlerStates.push(q);
            } else {
                this.bufferedMeshVBOHandlerStates[this.getStateIndex(uuid)].mesh = mesh;
                this.bufferedMeshVBOHandlerStates[this.getStateIndex(uuid)].dirty = true;
                this.bufferedMeshVBOHandlerStates[this.getStateIndex(uuid)].offset = null;
            }

            if (dirty) {
                if (!this.dynamic){console.error('DIRTY??!?')};
                this.dirty = true;
                this.dirtyForVAO = [];
            }
        }
    }

    selectedBufferedMeshHandlerByUUID(uuid: string) {
        let _bmh;
        // @ts-ignore
        this.bufferedMeshVBOHandlerStates.forEach((state) => {
            if (state.uuid === uuid) {
                _bmh = state;
                return _bmh;
            }
        })
        return _bmh;
    }


}
