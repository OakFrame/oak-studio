// @ts-ignore
import {v4 as uuidv4} from 'uuid';
import {BufferedMesh} from "./BufferedMesh";
// @ts-ignore
import {mat4} from "gl-matrix";
import {VAOHandlerInterface} from "./VAOHandlerInterface";

export class VAOHandler extends VAOHandlerInterface {

    constructor() {
        super()
    }

}

export interface BufferedMeshVBOHandlerStates {
    uuid: string,
    dirty: boolean;
    last_queued: number,
    mesh: BufferedMesh;
}

export enum VBOHandlerUsageType {
    DYNAMIC = 0,
    STATIC = 1
}

