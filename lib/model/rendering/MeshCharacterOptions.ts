import {Vec3} from "../math/Vec3";
import {RGB} from "../RGB";

export interface MeshCharacterOptions {
    sizes?: {
        head?: Vec3;
        torso?: Vec3;
        arm?: Vec3;
        leg?: Vec3;
        hip?: Vec3;
        legSpread?: number;
    },
    color?: {
        head?: RGB;
        torso?: RGB;
        leg?: RGB;
        hip?: RGB;
        arm?: RGB;
    }
}
