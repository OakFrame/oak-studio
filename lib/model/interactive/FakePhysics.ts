import {BufferedMesh} from "../rendering/BufferedMesh";
import {Vec3} from "../math/Vec3";
import {rayTriangle, sphereTriangle} from "../rendering/RayTriangleIntersection";
import {Face3} from "../rendering/Face3";
import {Vec2} from "../math/Vec2";


let VecDown = Vec3.fromValues(0, 0, -1);
let VecRight = Vec3.fromValues(1, 0, 0);
let VecLeft = Vec3.fromValues(-1, 0, 0);

export class FakePhysicsObject {
    position: Vec3;
    rotation: Vec3;
    velocity: Vec3;
    direction: Vec3;
    onGround:boolean;

    constructor() {
        this.position = Vec3.fromValues(0, 0, 1);
        this.rotation = new Vec3();
        this.velocity = new Vec3();
        this.direction = new Vec3();
        this.onGround = false;
    }
}

export class FakePhysics {

    collisionMesh: BufferedMesh;
    actors: FakePhysicsObject[];

    gravity: number;
    friction: number;

    constructor() {
        this.collisionMesh = new BufferedMesh();
        this.actors = [];
        this.gravity = 0.04;
        this.friction = 0.4;
    }


    createBall() {
        let actor = new FakePhysicsObject();


        return actor;
    }

    runPhysicsForActor2(actor) {
        const triCheck = this.collisionMesh.getSliced();
        const face = new Face3();

        let ground_height = -99;

        for (let v = 0; v < triCheck.positions.length; v += 9) {
            face.pos1.set(triCheck.positions[v], triCheck.positions[v + 1], triCheck.positions[v + 2]);
            face.pos2.set(triCheck.positions[v + 3], triCheck.positions[v + 4], triCheck.positions[v + 5]);
            face.pos3.set(triCheck.positions[v + 6], triCheck.positions[v + 7], triCheck.positions[v + 8]);

            // Check for intersection with ground
            const rz = rayTriangle(
                Vec3.fromValues(actor.position.x, actor.position.y, actor.position.z + 1),
                VecDown,
                face
            );
            if (rz && rz.z > ground_height) {
                ground_height = rz.z;
            }

            // Check for intersection with sphere
            let inter = sphereTriangle(actor.position.clone().add(Vec3.fromValues(0, 0, 0.27)), 0.25, face);
            if (inter) {
                const normal = face.getnormal();
                const d = actor.position.dist(inter);
                const penetration = Math.max(0,0.25 - d);
                let vx = actor.velocity.clone();
                vx.z = 0;
                actor.position.add(normal.clone().mulI(penetration));

                // reflect velocity only if the actor is moving towards the wall
                const dot = vx.dot(normal);
                if (dot < 0) {
                    const vlen = vx.mag();
                    let rvx = vx.reflect(normal);
                    actor.velocity.x = rvx.x;
                    actor.velocity.y = rvx.y;
                }

                // move the actor out of the wall in the direction of the reflected velocity
                //actor.position.add(vx.clone().normalize().mulI(penetration));
            }
        }

        let offset_from_ground = actor.position.z - ground_height;
        const distance_to_travel = actor.velocity.mag(); // assuming 1 unit of distance = 1 unit of time

        if ((offset_from_ground <= distance_to_travel || actor.position.z < ground_height) && actor.velocity.z <= 0) {
            actor.position.z = ground_height;
            actor.velocity.z = 0;
        } else if (actor.position.z > ground_height) {
            actor.velocity.z -= Math.min(offset_from_ground,this.gravity);
        }
        actor.onGround = actor.position.z <= ground_height;


        actor.position.add(actor.velocity);
        actor.velocity.x *= this.friction;
        actor.velocity.y *= this.friction;
    }



    runPhysicsForActor(actor) {

        const triCheck = this.collisionMesh.getSliced();

        let ground_height = -99;

        let hitx = false;
        let hity = false;


        actor.velocity.x *= this.friction;
        actor.velocity.y *= this.friction;


        for (let v = 0; v < triCheck.positions.length; v += 9) {

            let f = new Face3();
            f.pos1.set(triCheck.positions[v], triCheck.positions[v + 1], triCheck.positions[v + 2]);
            f.pos2.set(triCheck.positions[v + 3], triCheck.positions[v + 4], triCheck.positions[v + 5]);
            f.pos3.set(triCheck.positions[v + 6], triCheck.positions[v + 7], triCheck.positions[v + 8]);


            let rz = rayTriangle(Vec3.fromValues(actor.position.x + (actor.velocity.x), actor.position.y + (actor.velocity.y), actor.position.z + 1), VecDown, f);

            if (rz) {
                if (rz.z > ground_height) {
                    ground_height = rz.z;
                }
            }

            if (Math.abs(actor.velocity.x) > 0.0001) {
                let rx = rayTriangle(Vec3.fromValues(actor.position.x + (actor.velocity.x), actor.position.y, actor.position.z + 0.27), Vec3.fromValues(actor.velocity.x, 0, 0), f);
                if (rx && rx.dist(actor.position) <= 0.5 + Math.abs(actor.velocity.x)) {
                    hitx = true;
                }
            }

            if (Math.abs(actor.velocity.y) > 0.0001) {
                let rx = rayTriangle(Vec3.fromValues(actor.position.x, actor.position.y + (actor.velocity.y), actor.position.z + 0.27), Vec3.fromValues(0, actor.velocity.y, 0), f);
                if (rx && rx.dist(actor.position) <= 0.5 + Math.abs(actor.velocity.y)) {
                    hity = true;
                }
            }


        }


        let offset_from_ground = actor.position.z - ground_height;
        const distance_to_travel = Math.abs(actor.velocity.z);

        if ((offset_from_ground <= distance_to_travel || actor.position.z <= ground_height) && actor.velocity.z <= 0) {
            actor.position.z = ground_height;
            actor.velocity.z = 0;
        } else if (actor.position.z > ground_height){

            actor.velocity.z -= Math.min(offset_from_ground,this.gravity);
        }

        actor.onGround = Math.abs(offset_from_ground) < 0.5 || actor.position.z <= (ground_height+0.15);


        if (hitx) {
            actor.velocity.x = 0;
        }
        if (hity) {
            actor.velocity.y = 0;
        }



        actor.position.add(actor.velocity);


    }

}
