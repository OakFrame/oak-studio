import {Vec3} from "../math/Vec3";
import {RGB} from "../RGB";
import {BufferedMesh} from "./BufferedMesh";

export class ArmaturePiece {
    mesh: BufferedMesh;
    size: Vec3;
    scale: Vec3;
    rotation: Vec3;
    position: Vec3;
}

export interface HumanoidArmatureTransform {
    arm1?: {
        attachment?:  BufferedMesh[];
        forward?: number;
        lift?: number;
        rotate?: Vec3;
    }
    arm2?: {
        attachment?: BufferedMesh[];
        forward?: number;
        lift?: number;
        rotate?: Vec3;
    }
    head?: {
        attachment?: BufferedMesh[];
        tilt?: number;
        angle?: number;
        rotate?: Vec3;
    }
    torso?: {
        tilt?: number;
        angle?: number;
        rotate?: Vec3,
        translate?: Vec3
    }
    hip?: {
        rotate?: Vec3
        translate?: Vec3
    }

    leg1?: {
        attachment?: BufferedMesh;
        forward?: number;
        lift?: number;
        rotate?: Vec3;
    }
    leg2?: {
        forward?: number;
        lift?: number;
        rotate?: Vec3;
    }
}

export class ArmatureMeshCharacterGenerator {
    constructor() {
    }

    transformMeshCharacter(armaturePiece, transforms?, attachments?) {

    }
}
