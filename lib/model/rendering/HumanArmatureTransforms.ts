import {BufferedMesh} from "./BufferedMesh";
import {Vec3} from "../math/Vec3";
import {DegToRad} from "../Utils";


import HatPLY from "../../../client/neighbors/client/ply/HumanWizardHat01.ply";

export const MeshHumanWizardHat01 = new BufferedMesh();
MeshHumanWizardHat01.parsePLY(HatPLY);

import FacePLY from "../../../client/neighbors/client/ply/HumanFace01.ply";

export const MeshHumanFace01 = new BufferedMesh();
MeshHumanFace01.parsePLY(FacePLY);

import DaggerPLY from "../../../client/neighbors/client/ply/Dagger01.ply";

export const MeshDagger01 = new BufferedMesh();
MeshDagger01.parsePLY(DaggerPLY);

import BookPLY from "../../../client/neighbors/client/ply/Book01.ply";
import {HumanoidArmatureTransform} from "./Armature";

export const MeshBook01 = new BufferedMesh();
MeshBook01.parsePLY(BookPLY);

interface HumanoidTransformOptions {
    velocity?: Vec3;
    percent?: number;
}

export function getTransformsForMesh(type?: string, options?: HumanoidTransformOptions): HumanoidArmatureTransform {

    let time_remap = 100;

    let t = (Date.now() / time_remap);
    let tl = (Date.now() / time_remap) - 90;

    let s = Math.sin(t);
    let sl = Math.sin(t - 90);
    let sb = Math.sin(t + 5);
    let s2 = Math.sin(t * 2);
    let s2l = Math.sin((t * 2) - 90);

    let r0 = Math.sin((t / 10));
    let r1 = Math.sin((t / 8));
    let r2 = Math.sin((t / 4));
    let r3 = Math.sin(t / 1.6);
    let r4 = Math.sin(t * 1.6);

    let k0 = Math.sin((t / 260));
    let k1 = Math.sin((t / 180));
    let k2 = Math.sin((t / 115));
    let k3 = Math.sin(t / 76);
    let k4 = Math.sin(t / 42);
    let k5 = Math.sin(t / 28);
    let k6 = Math.sin(t / 15);
    let k7 = Math.sin(t / 12);

    let ARM1_RUN_FORWARD_OUT = (new Vec3()).set(DegToRad(-65 * (1 + (r1 * 0.0125))), DegToRad(35), DegToRad(45 + (-65 * (1 + (-sb * 0.4)))));
    let ARM2_RUN_FORWARD_OUT = (new Vec3()).set(DegToRad(-65 * (1 + (r1 * 0.0125))), DegToRad(-35), DegToRad(-45 + (65 * (1 + (sb * 0.4)))));

    let ARM1_HOLD_FORWARD_IN = (new Vec3()).set(DegToRad(-85 * (1 + (r1 * 0.0125))), DegToRad(75), DegToRad(-15 * (1 + (r1 * 0.06))));
    let ARM2_HOLD_FORWARD_IN = (new Vec3()).set(DegToRad(-85 * (1 + (r1 * 0.0125))), DegToRad(-75), DegToRad(15 * (1 + (r1 * 0.06))));

    if (!options) {
        options = {
            velocity: new Vec3(),
            percent: 0
        }
    }

    if (!options.velocity) {
        options.velocity = new Vec3()
    }

    if (isNaN(options.percent)) {
        options.percent = 0;
    }

    const mTerminalVel = Math.min(Math.abs(options.velocity.z   ), 1);


    switch (type) {
        case "jump":
            return {
                head: {},
                arm1: {
                    rotate: Vec3.fromValues(DegToRad(-85 * (1 + (r1 * 0.0125))), DegToRad(45 + (mTerminalVel*15)), 0)
                },
                arm2: {
                    rotate: Vec3.fromValues(DegToRad(-85 * (1 + (r1 * 0.0125))), DegToRad(-(45+ (mTerminalVel*15))), 0)
                },
                leg1: {
                    rotate: Vec3.fromValues(mTerminalVel*0.5, 0, 0),
                },
                leg2: {
                    rotate: Vec3.fromValues(mTerminalVel*-0.5, 0, 0),
                },
            };

        case "fall":
            return {
                head: {},
                arm1: {
                    rotate: Vec3.fromValues(DegToRad(-85 * (1 + (r1 * 0.0125)))*(1-mTerminalVel), DegToRad(-(20 + (mTerminalVel*40))), 0)
                },
                arm2: {
                    rotate: Vec3.fromValues(DegToRad(-85 * (1 + (r1 * 0.0125)))*(1-mTerminalVel), DegToRad(20 + (mTerminalVel*40)), 0)
                }, leg1: {
                    rotate: Vec3.fromValues(mTerminalVel*-0.5, 0, 0),
                },
                leg2: {
                    rotate: Vec3.fromValues(mTerminalVel*0.5, 0, 0),
                },
            };
        case "spell":

            return {
                head: {
                    attachment: [MeshHumanWizardHat01, MeshHumanFace01],
                },
                arm1: {
                    // attachment: MeshSword,
                    forward: -s * 0.1,
                    lift: 0.3
                },
                arm2: {
                    forward: s * 0.1,
                    lift: 0.5
                }

            };

        case "harvest":

            return {
                head: {},
                torso: {
                    rotate: Vec3.fromValues(-0.25 + (s * 0.5), 0, 0)
                },
                arm1: {
                    rotate: Vec3.fromValues(0, 0, DegToRad(-55) + (s * 0.5))
                },
                arm2: {
                    rotate: Vec3.fromValues(0, DegToRad(-45), (s2 * 0.5) / 10)
                }
            };

        case "attack":

            return {
                head: {},
                torso: {
                    rotate: Vec3.fromValues(0.25 - (options.percent * 0.5), 0, -DegToRad(options.percent*23))
                },
                arm1: {
                    rotate: (new Vec3()).set(DegToRad(-85 * (1 + (s * 0.0125))), 0, DegToRad(-15 * (1 + (options.percent * 8))))
                },
                arm2: {
                    rotate: ARM2_HOLD_FORWARD_IN
                }
            };

        case "run":

            return {

                head: {
                    attachment: [MeshHumanWizardHat01, MeshHumanFace01],
                    rotate: Vec3.fromValues(s2l * 0.1, sl * 0.12, 0),
                },
                leg1: {
                    rotate: Vec3.fromValues(s * 0.5, 0, 0),
                },
                leg2: {
                    rotate: Vec3.fromValues(s * -0.5, 0, 0),
                },
                torso: {
                    rotate: Vec3.fromValues(-0.10 + (s2 * 0.12), s * 0.1, s * 0.1)
                    //rotate: Vec3.fromValues(0.25,0,0)
                },
                hip: {
                    rotate: Vec3.fromValues(0, s * 0.05, s * 0.025),
                    translate: Vec3.fromValues(0, 0, Math.abs(s * 0.15))
                },
                arm1: {
                    attachment: [MeshDagger01],
                    //attachment: selectArm1(),
                    rotate: ARM1_RUN_FORWARD_OUT,
                },
                arm2: {
                    attachment: [MeshBook01],

                    // attachment: selectArm2(),
                    rotate: ARM2_RUN_FORWARD_OUT//Vec3.fromValues(0, DegToRad(-35) + (s * 0.1), DegToRad(5 + ((sb * 30)))),
                }

            }

        case "idle":

            return {
                head: {
                    attachment: [MeshHumanWizardHat01, MeshHumanFace01],
                },
                arm1: {
                    attachment: [MeshDagger01],
                    rotate: ARM1_HOLD_FORWARD_IN
                },
                arm2: {
                    attachment: [MeshBook01],
                    rotate: ARM2_HOLD_FORWARD_IN
                },
                torso: {
                    rotate: Vec3.fromValues(r2 * 0.02, 0, 10 * (k0 * 0.3) * (k3 * 0.2) * (k6 * 0.1)),
                    translate: Vec3.fromValues(0, 0, Math.abs(r1 * 0.02))
                },
                hip: {
                    rotate: Vec3.fromValues(0, 0, 0.2 * (r1 * 0.1) * (r2 * 0.1) * (r3 * 0.01))
                }

            }

        default:
            return {}
    }
}
