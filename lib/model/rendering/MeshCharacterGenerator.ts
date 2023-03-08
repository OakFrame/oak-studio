import {Vec3} from "../math/Vec3";
import {DegToRad} from "../Utils";
import {BufferedMesh} from "./BufferedMesh";
import {MeshCharacterOptions} from "./MeshCharacterOptions";
import {RGB} from "../RGB";
import {HumanoidArmatureTransform} from "./Armature";
import {MeshCube, MeshHumanHead00} from "./DefaultMesh";

let v0 = new Vec3();
v0.set(0, 0, 0);
let v05 = new Vec3();
v05.set(0.5, 0.5, 0.5);
let v1 = new Vec3();
v1.set(1, 1, 1);
let s1 = new Vec3();
s1.set(0, Math.sin(Date.now() / 1000), 0);
let z1 = new Vec3();
z1.set(0, 0, Math.sin(Date.now() / 1000));
let vF = new Vec3();
vF.set(0, 0, DegToRad(180));

export class MeshCharacterGenerator {
    mesh: BufferedMesh;
    options: MeshCharacterOptions;

    constructor(options: MeshCharacterOptions) {
        this.options = options;
    }

    getAttachmentPointsAndTransforms() {

        let data = {
            mesh: {
                head: this.getTransformedCube(this.options.sizes.head, this.options.color.head),
                torso: this.getTransformedCube(this.options.sizes.torso, this.options.color.torso),
                hip: this.getTransformedCube(this.options.sizes.hip, this.options.color.hip),
                leg1: this.getTransformedCube(this.options.sizes.leg, this.options.color.leg),
                //hip: this.getTransformedCube(this.options.sizes.hip, this.options.color.hip),
            }
        };
        return data;
    }

    getTransformedCube(size: Vec3, color: RGB) {
        /* let mesh = MeshCube.clone().scale(size);
         mesh.setColor(color);

         return {
             mesh,
             size,
             scale: v1,
             rotation: v0,
             position: (new Vec3()).set(0, 0, 0)
         }*/
    }

    getMesh(transforms?: HumanoidArmatureTransform, options?) {

        //  if (cachedCharacterModel) {
        //      return cachedCharacterModel;
        // }

        const _options = Object.assign({}, this.options);

        if (options) {
            this.options = Object.assign(this.options, options);
        }

        let d = Math.floor(Date.now() / 120);

        /*if (ticks % 10 === 0) {
            ticks++;
            this.options.sizes.torso.x = 0.2 + (Math.random() * 0.4);
            this.options.sizes.torso.y = 0.2 + (Math.random() * 0.4);
            this.options.sizes.torso.z = 0.2 + (Math.random() * 0.2);

            this.options.sizes.leg.z = 0.2 + (Math.random() * 0.8);
            this.options.sizes.leg.x = this.options.sizes.leg.y = 0.1 + (Math.random() * 0.075);

            this.options.sizes.arm.z = 0.2 + (Math.random() * 0.8);
            this.options.sizes.arm.x = this.options.sizes.arm.y = 0.1 + (Math.random() * 0.075);

            this.options.sizes.head.x = this.options.sizes.head.y = this.options.sizes.head.z = 0.2 + (Math.random() * 0.3);

            this.options.color.torso = new RGB(100+(145* Math.random()), 100+(145* Math.random()), 100+(145* Math.random()));
        }*/

        this.mesh = new BufferedMesh();


        /* let leg1 = MeshCube.clone().scale(this.options.sizes.leg);
         leg1.setColor(this.options.color.leg);
         leg1.rotate(, 0, 0);

         if (transforms && transforms.leg1) {
             if (transforms.leg1.forward) {
                 leg1.rotate((1.5708) * transforms.leg1.forward, 0, 0);
             }
             if (transforms.leg1.lift) {
                 leg1.rotate(0, -(1.5708) * transforms.leg1.lift, 0);
             }
         }*/
        //let leg1 = MeshCube

        /*  let leg2 = MeshCube.clone().scale(this.options.sizes.leg);
          leg2.setColor(this.options.color.leg);
          leg2.rotate(1.5708 * 2, 0, 0);

          if (transforms && transforms.leg2) {
              if (transforms.leg2.forward) {
                  leg2.rotate((1.5708) * transforms.leg2.forward, 0, 0);
              }
              if (transforms.leg2.lift) {
                  leg2.rotate(0, (1.5708) * transforms.leg2.lift, 0);
              }
          }

  */
        let hip1 = new BufferedMesh();
        hip1.join(MeshCube, { // HIPS
            scale: this.options.sizes.hip,
            position: (new Vec3()).set(0, 0, 0),
            color: this.options.color.hip.toReals()
        });
        //MeshCube.clone().scale(this.options.sizes.hip);
        //  hip1.setColor(this.options.color.hip);

        let leg1rot = Vec3.fromValues(1.5708 * 2, 0, 0);
        if (transforms && transforms.leg1 && transforms.leg1.rotate) {
            leg1rot.add(transforms.leg1.rotate);
        }

        let leg2rot = Vec3.fromValues(1.5708 * 2, 0, 0);
        if (transforms && transforms.leg2 && transforms.leg2.rotate) {
            leg2rot.add(transforms.leg2.rotate);
        }

        hip1.join(MeshCube, {
            scale: this.options.sizes.leg,
            rotation: leg1rot,//1.5708 * 2
            position: (new Vec3()).set(-this.options.sizes.legSpread, 0, 0),
            color: this.options.color.leg.toReals()
        });

        hip1.join(MeshCube, {
            scale: this.options.sizes.leg,
            rotation: leg2rot,//1.5708 * 2
            position: (new Vec3()).set(this.options.sizes.legSpread, 0, 0),
            color: this.options.color.leg.toReals()
        });


        let mTorso = new BufferedMesh();
        mTorso.join(MeshCube, {
            scale: this.options.sizes.torso,
            color: this.options.color.torso.toReals()
        });

        let arm1 = new BufferedMesh();
        arm1.join(MeshCube, {
            scale: this.options.sizes.arm,
            rotation: Vec3.fromValues(0, 1.5708, 0),
            color: this.options.color.arm.toReals()
        });

        if (transforms && transforms.arm1 && transforms.arm1.attachment){
            transforms.arm1.attachment.forEach((m)=>{
                arm1.join(m,{position:Vec3.fromValues(-(((this.options.sizes.torso.x) / 2) + this.options.sizes.arm.x*2),0,0)});
            });
        }

        let arm2 = new BufferedMesh();
        arm2.join(MeshCube, {
            scale: this.options.sizes.arm,
            rotation: Vec3.fromValues(0, -1.5708, 0),
            color: this.options.color.arm.toReals()
        });

        if (transforms && transforms.arm2 && transforms.arm2.attachment){
            transforms.arm2.attachment.forEach((m)=>{
                arm2.join(m,{position:Vec3.fromValues((((this.options.sizes.torso.x) / 2) + this.options.sizes.arm.x*2),0,0),rotation:vF});
            });
        }


        mTorso.join(arm1, { //arm 1
            rotation: (transforms && transforms.arm1 && transforms.arm1.rotate) ? transforms.arm1.rotate : v0,
            position: (new Vec3()).set(((-this.options.sizes.torso.x) / 2) - (this.options.sizes.arm.x / 5), 0, this.options.sizes.torso.z),
        });

        mTorso.join(arm2, { // arm 2
            rotation: (transforms && transforms.arm2 && transforms.arm2.rotate) ? transforms.arm2.rotate : v0,
            position: (new Vec3()).set(((this.options.sizes.torso.x) / 2) + (this.options.sizes.arm.x / 5), 0, this.options.sizes.torso.z),
        });


        let head = new BufferedMesh();

        head.join(MeshHumanHead00,{position:Vec3.fromValues(0,0,0),
            color: this.options.color.head.toReals()});

        if (transforms && transforms.head && transforms.head.attachment){
            transforms.head.attachment.forEach((m)=>{
                head.join(m,{position:Vec3.fromValues(0,0,0)});
            });
        }

        mTorso.join(head, { // head
            scale: this.options.sizes.head,
            rotation: (transforms && transforms.head && transforms.head.rotate) ? transforms.head.rotate : v0,
            position: (new Vec3()).set(0, 0, this.options.sizes.torso.z)
        });


        hip1.join(mTorso, {
            rotation: (transforms && transforms.torso && transforms.torso.rotate) ? transforms.torso.rotate : v0,
            position: (new Vec3()).set(0, 0, this.options.sizes.hip.z)
        });
        /* hip1.join(leg2, {
             scale: v1,
             rotation: v0,
             position: (new Vec3()).set(this.options.sizes.legSpread, 0, 0)
         });


         let arm1 = MeshCube.clone().scale(this.options.sizes.arm);
         arm1.setColor(this.options.color.arm);
         arm1.rotate(0, 1.5708, 0);
         let arm1AttachPoint = new Vec3();
         arm1AttachPoint.set(-this.options.sizes.arm.z, 0, 0);

         if (transforms && transforms.arm1) {
             if (transforms && transforms.arm1) {
                 attachments(transforms.arm1, arm1, {position: arm1AttachPoint, scale: v1, rotation: vF})
             }

             if (transforms.arm1.rotate) {
                 arm1.rotate(transforms.arm1.rotate.x, transforms.arm1.rotate.y, transforms.arm1.rotate.z);
             }
             if (transforms.arm1.lift) {
                 arm1.rotate(0, -(1.5708) * transforms.arm1.lift, 0);
             }
             if (transforms.arm1.forward) {
                 arm1.rotate(0, 0, (-1.5708) * transforms.arm1.forward);
             }
         }

         let arm2 = MeshCube.clone().scale(this.options.sizes.arm);
         arm2.setColor(this.options.color.arm);
         arm2.rotate(0, -1.5708, 0);
         let arm2AttachPoint = new Vec3();
         arm2AttachPoint.set(this.options.sizes.arm.z, 0, 0);

         if (transforms && transforms.arm2) {
             if (transforms && transforms.arm2) {
                 attachments(transforms.arm2, arm2, {position: arm2AttachPoint, scale: v1, rotation: vF})
             }
             //if (transforms.arm2.lift) {
             //    arm2.rotate(0, (1.5708) * transforms.arm2.lift, 0);
             // }
             // if (transforms.arm2.forward) {
             //     arm2.rotate(0, 0, (1.5708) * transforms.arm2.forward);
             // }
             if (transforms.arm2.rotate) {
                 arm2.rotate(transforms.arm2.rotate.x, transforms.arm2.rotate.y, transforms.arm2.rotate.z);
             }
         }





         let torso1 = MeshCube.clone().scale(this.options.sizes.torso);
         torso1.setColor(this.options.color.torso);

         torso1.join(arm1, {
             scale: v1,
             rotation: v0,
             position: (new Vec3()).set(((-this.options.sizes.torso.x) / 2) - (this.options.sizes.arm.x / 5), 0, this.options.sizes.torso.z)
         });

         torso1.join(arm2, {
             scale: v1,
             rotation: v0,
             position: (new Vec3()).set(((this.options.sizes.torso.x) / 2) + (this.options.sizes.arm.x / 5), 0, this.options.sizes.torso.z)
         });

         torso1.join(head1, {
             scale: v1,
             rotation: v0,
             position: (new Vec3()).set(0, 0, this.options.sizes.torso.z)
         });

         if (transforms && transforms.torso && transforms.torso.rotate) {
             torso1.rotate(transforms.torso.rotate.x, transforms.torso.rotate.y, transforms.torso.rotate.z);
         }
         if (transforms && transforms.torso && transforms.torso.translate) {
             torso1.translate(transforms.torso.translate);
         }

         hip1.join(torso1, {
             scale: v1,
             rotation: v0,
             position: (new Vec3()).set(0, 0, this.options.sizes.hip.z)
         });


         if (transforms && transforms.hip && transforms.hip.rotate) {
             hip1.rotate(transforms.hip.rotate.x, transforms.hip.rotate.y, transforms.hip.rotate.z);
         }

         if (transforms && transforms.hip && transforms.hip.translate) {
             hip1.translate(transforms.hip.translate);
         }
 */
        // TRANSFORM HIP
        this.mesh.join(hip1, {
            scale: v1,
            rotation: (transforms && transforms.hip && transforms.hip.rotate) ? transforms.hip.rotate : v0,
            position: (new Vec3()).set(0, 0, this.options.sizes.leg.z).add((transforms && transforms.hip && transforms.hip.translate) ? transforms.hip.translate : v0)
        });


        this.options = _options;

        // cachedCharacterModel=this.mesh;

        return this.mesh;

    }


}
