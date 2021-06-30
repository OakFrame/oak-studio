/**
 * @constructor
 */
import {Vec3} from "../math/Vec3";
import {Projection} from "../math/Projection";
import {Vec2} from "../math/Vec2";
import {Surface} from "../rendering/Surface";
import {RoomObject} from "./RoomObject";
import {Face3} from "../rendering/Mesh";

export class Camera {

    public focus: Vec3;
    public from: Vec3;
    public to: Vec3;
    public up: Vec3;
    private tmpv: Vec3;
    public fov: number;
    private zoom: number;
    public aspect: number;
    public projection: Projection;
    private animation;
    focus: any;
    private _tmp;

    constructor() {
        this.from = new Vec3().set(0, 100, 30);
        this.to = new Vec3();
        this.up = new Vec3().set(0, 0, 1);
        this.tmpv = new Vec3();
        this.focus = new Vec3();
        this.fov = 45;
        this.zoom = 1;
        this.aspect = 1;
        this.projection = new Projection();
        this.animation = {
            active: false,
            startfrom: new Vec3(),
            startto: new Vec3(),
            pos: 0,
            gain: 0.5,
            speed: 1,
            finishfrom: new Vec3(),
            finishto: new Vec3()
        };
        this._tmp = {
            v1: new Vec3(),
            v2: new Vec3(),
            v3: new Vec3(),
            v4: new Vec3(),
            p1: new Vec2(),
            p2: new Vec2(),
            p3: new Vec2(),
            drawntris: 0,
            culltris: 0,
            _t: [],
            from_camera_scale_x: 0,
            from_camera_scale_y: 0,
            sr: 0,
            sh: 0,
            sc: 0,
            vx: 0,
            vy: 0,
            lightingvec: 0
        }
    }

    getProjection() {
        return this.projection;
    }

    animate(startfrom, finishfrom, startto, finishto, speed, gain) {
        this.animation.active = true;
        this.animation.startfrom.copy(startfrom);
        this.animation.finishfrom.copy(finishfrom);
        this.animation.startto.copy(startto);
        this.animation.finishto.copy(finishto);
        this.animation.gain = gain;
        this.animation.pos = 0;
        this.animation.speed = speed;
    }

    update() {
        /* if (this.animation.active) {
             this.from.x = lerp(this.animation.startfrom.x, this.animation.finishfrom.x, gain(this.animation.pos, this.animation.gain));
             this.from.y = lerp(this.animation.startfrom.y, this.animation.finishfrom.y, gain(this.animation.pos, this.animation.gain));
             this.from.z = lerp(this.animation.startfrom.z, this.animation.finishfrom.z, gain(this.animation.pos, this.animation.gain));

             this.to.x = lerp(this.animation.startto.x, this.animation.finishto.x, gain(this.animation.pos, this.animation.gain));
             this.to.y = lerp(this.animation.startto.y, this.animation.finishto.y, gain(this.animation.pos, this.animation.gain));
             this.to.z = lerp(this.animation.startto.z, this.animation.finishto.z, gain(this.animation.pos, this.animation.gain));

             this.animation.pos += this.animation.speed;
             if (this.animation.pos >= 1) {
                 this.animation.active = false;
             }
         }*/
    }

    drawActor(surface: Surface, actor: RoomObject) {

        let _tick = Date.now() / 16;

        this.projection.toScreen(surface, actor.position, this.from, this._tmp.p1);
        this._tmp.v2.copy(this.from).z = 0;
        this._tmp.v1.copy(actor.position).pointTo(this._tmp.v2);
        this._tmp.v1.rotZ(90).add(actor.position);

        this.projection.toScreen(surface, this._tmp.v1, this.from, this._tmp.p2);

        this._tmp.from_camera_scale_x = (this._tmp.p2.dist(this._tmp.p1) / 24);
        this._tmp.from_camera_scale_y = this._tmp.from_camera_scale_x;
        this._tmp.sr = (((Math.sin(((_tick / 6)) + actor.rand)) * (Math.pow(actor.velocity.mag(), 2) * 4) * 1.5));

        this._tmp.sh = 1;//60 * (1 + (Math.sin((_tick / 2.5) + actor.rand) * 1)) * actor.velocity.mag() / 3;

        this._tmp.sc = actor.scale.x || 1;
        this._tmp.vx = this._tmp.p1.x - ((actor.getSprite().getImage().width / 2) * this._tmp.from_camera_scale_x * this._tmp.sc);
        this._tmp.vy = (this._tmp.p1.y - (actor.getSprite().getImage().height * this._tmp.from_camera_scale_y * this._tmp.sc) - this._tmp.sh) - ((((1 + Math.sin((_tick / 3))) * (Math.pow(actor.velocity.mag(), 2)) * 500.5)) * (this._tmp.from_camera_scale_x / 2));


        if (this._tmp.p1.x - (actor.getSprite().getImage().width * this._tmp.from_camera_scale_x * this._tmp.sc) / 2 > surface.getWidth() || this._tmp.p1.x + (actor.getSprite().getImage().width * this._tmp.from_camera_scale_x * this._tmp.sc) / 2 < 0 || this._tmp.p1.y < 0 || this._tmp.p1.y - (actor.getSprite().getImage().height * this._tmp.from_camera_scale_y * this._tmp.sc) > surface.getHeight()) { // horizontal

            return false;
        } else {


            surface.getContext().save();

            surface.getContext().translate((0.5 + this._tmp.vx + (actor.getSprite().getImage().width * this._tmp.from_camera_scale_x * this._tmp.sc / 2)), (0.5 + this._tmp.vy + (actor.getSprite().getImage().height * this._tmp.from_camera_scale_y * this._tmp.sc / 2)));
            //if (this._tmp.sr != 0) {
            surface.getContext().rotate(this._tmp.sr);
            // }

            surface.getContext().drawImage(actor.getSprite().getImage(), (0.5 - (actor.getSprite().getImage().width * this._tmp.sc * this._tmp.from_camera_scale_x / 2)), -(0.5 + (actor.getSprite().getImage().height * this._tmp.sc * this._tmp.from_camera_scale_y / 2)), actor.getSprite().getImage().width * this._tmp.from_camera_scale_x * this._tmp.sc, actor.getSprite().getImage().height * this._tmp.from_camera_scale_y * this._tmp.sc);
            // surface.fill("#111");

            surface.getContext().fillStyle = "#fff";

            // surface.drawText(0, 40, actor.timeline_index);

            if (actor.tags.indexOf('npc') !== -1) {
                let active = [];
                actor.getTaskManager().getCurrentTasks().forEach(function (t) {
                    active.push(t.getName());
                });

                if (actor.getTaskManager().getCurrentTasks().length) {
                    let ob = {
                        "name": actor.getTaskManager().getCurrentTasks()[0].getName(),
                        "task": actor.getTaskManager().getCurrentTasks()[0].events[0].type
                    };
                    //surface.drawText(0, 0, JSON.stringify(ob));
                }
                // surface.drawText(0, -20, JSON.stringify(actor.getBehavior()));

            }

            if (actor.bark) {
                surface.getContext().textAlign = "center";

                for (let i=1;i<=3*surface.getScaling();i++){
                surface.drawText(i, (-((actor.getSprite().getImage().height * this._tmp.from_camera_scale_y * this._tmp.sc / 2) + 40))+i, actor.bark, {
                    size: 40,
                    color: "#fffdf5",
                   // background: actor.primary_color||"#000"
                });}

                surface.drawText(0, -((actor.getSprite().getImage().height * this._tmp.from_camera_scale_y * this._tmp.sc / 2) + 40), actor.bark, {
                    size: 40,
                    color: actor.primary_color//"#fff",
                   // background: actor.primary_color||"#000"
                });
                surface.getContext().textAlign = "left";
            }

            surface.getContext().restore();

        }

    };

    drawFace3(surface: Surface, v1, v2, v3, color) {
        this.projection.toScreen(surface, v1, this.from, this._tmp.p1);
        this.projection.toScreen(surface, v2, this.from, this._tmp.p2);
        this.projection.toScreen(surface, v3, this.from, this._tmp.p3);

        var ax, ay, az, bx, by, bz, rx, ry, rz, m;
        ax = v2.x - v1.x;
        ay = v2.y - v1.y;
        az = v2.z - v1.z;
        bx = v3.x - v1.x;
        by = v3.y - v1.y;
        bz = v3.z - v1.z;
        rx = ay * bz - by * az;
        ry = az * bx - bz * ax;
        rz = ax * by - bx * ay;

        //triangleGrow(this._tmp.p1, this._tmp.p2, this._tmp.p3, 2);
        surface.getContext().fillStyle = color || "#000";
        surface.getContext().beginPath();
        surface.getContext().moveTo(this._tmp.p1.x, this._tmp.p1.y);
        surface.getContext().lineTo(this._tmp.p2.x, this._tmp.p2.y);
        surface.getContext().lineTo(this._tmp.p3.x, this._tmp.p3.y);
        surface.getContext().fill();

      //  surface.getContext().strokeStyle = color || '#f00';
       // surface.getContext().stroke();
    };

    drawLine2D(surface,x1,y1,x2,y2){
            this.projection.toScreen(surface, (new Vec3().set(x1,y1,0)), this.from, this._tmp.p1);
            this.projection.toScreen(surface, (new Vec3().set(x2,y2,0)), this.from, this._tmp.p2);

        surface.getContext().beginPath();
        surface.getContext().moveTo(this._tmp.p1.x, this._tmp.p1.y);
        surface.getContext().lineTo(this._tmp.p2.x, this._tmp.p2.y);
       // surface.getContext().fill();

        surface.getContext().strokeStyle = "black" || '#f00';
        surface.getContext().strokeWidth = "10";
        surface.getContext().stroke();
        surface.getContext().strokeWidth = 1;
    }

    drawFace(surface: Surface, face3: Face3, parent, texture, scale, depth = 3) {

        //this._tmp.drawntris++;

        if (/*face3.getcenter().dist(this.from) < Math.pow(2.8, depth - 1) && */depth >= 1) {

            let new_depth = depth - 1;

            let A = new Vec3().copy(face3.pos1);
            let B = new Vec3().copy(face3.pos2);
            let C = new Vec3().copy(face3.pos3);

            let d = (new Vec3()).add(A).add(B).divI(2);
            let e = (new Vec3()).add(B).add(C).divI(2);
            let f = (new Vec3()).add(C).add(A).divI(2);

            let uvA = new Vec2().copy(face3.uv1);
            let uvB = new Vec2().copy(face3.uv2);
            let uvC = new Vec2().copy(face3.uv3);

            let uvd = (new Vec2()).add(uvA).add(uvB).divI(2);
            let uve = (new Vec2()).add(uvB).add(uvC).divI(2);
            let uvf = (new Vec2()).add(uvC).add(uvA).divI(2);

            let color = face3.color1;

            let one = new Face3();
            one.pos1.copy(C);
            one.pos2.copy(f);
            one.pos3.copy(e);
            one.uv1.copy(uvC);
            one.uv2.copy(uvf);
            one.uv3.copy(uve);
            one.color1 = color;
            one.color2 = color;
            one.color3 = color;
            this.drawFace(surface, one, parent, texture, scale, new_depth);

            let two = new Face3();
            two.pos1.copy(e);
            two.pos2.copy(d);
            two.pos3.copy(B);
            two.uv1.copy(uve);
            two.uv2.copy(uvd);
            two.uv3.copy(uvB);
            two.color1 = color;
            two.color2 = color;
            two.color3 = color;
            this.drawFace(surface, two, parent, texture, scale, new_depth);

            let three = new Face3();
            three.pos1.copy(f);
            three.pos2.copy(A);
            three.pos3.copy(d);
            three.uv1.copy(uvf);
            three.uv2.copy(uvA);
            three.uv3.copy(uvd);
            three.color1 = color;
            three.color2 = color;
            three.color3 = color;
            this.drawFace(surface, three, parent, texture, scale, new_depth);

            let four = new Face3();
            four.pos1.copy(f);
            four.pos2.copy(e);
            four.pos3.copy(d);
            four.uv1.copy(uvf);
            four.uv2.copy(uve);
            four.uv3.copy(uvd);
            four.color1 = color;
            four.color2 = color;
            four.color3 = color;
            this.drawFace(surface, four, parent, texture, scale, new_depth);

            return false;
        }


        function triangleGrow(p1, p2, p3, amt) {
            var center = new Vec2();
            center.x = (p1.x + p2.x + p3.x) / 3;
            center.y = (p1.y + p2.y + p3.y) / 3;

            var nv = new Vec2();

            p1.sub(nv.copy(center).pointTo(p1).mulI(amt));
            p2.sub(nv.copy(center).pointTo(p2).mulI(amt));
            p3.sub(nv.copy(center).pointTo(p3).mulI(amt));
        }

        // console.log(tri);

        this.projection.toScreen(surface, this._tmp.v1.copy(parent.position).divI(1).add(this._tmp.v4.copy(face3.pos1).mulI(scale)), this.from, this._tmp.p1);
        this.projection.toScreen(surface, this._tmp.v2.copy(parent.position).divI(1).add(this._tmp.v4.copy(face3.pos2).mulI(scale)), this.from, this._tmp.p2);
        this.projection.toScreen(surface, this._tmp.v3.copy(parent.position).divI(1).add(this._tmp.v4.copy(face3.pos3).mulI(scale)), this.from, this._tmp.p3);

        // camera.projection.toScreen(this, tri.pos1, camera.from, this._tmp.p1);
        // camera.projection.toScreen(this, tri.pos2, camera.from, this._tmp.p2);
        // camera.projection.toScreen(this, tri.pos3, camera.from, this._tmp.p3);

        //console.log(this._tmp.p1,this._tmp.p2,this._tmp.p3);

        triangleGrow(this._tmp.p1, this._tmp.p2, this._tmp.p3, 0.45);


        /*if ((this._tmp.p3.x === -99 && this._tmp.p3.y === -99) || (this._tmp.p2.x === -99 && this._tmp.p2.y === -99) || (this._tmp.p1.x === -99 && this._tmp.p1.y === -99)) {
            return false;
        } else if ((this._tmp.p1.x < 0 && this._tmp.p2.x < 0 && this._tmp.p3.x < 0) || (this._tmp.p1.x > this._width && this._tmp.p2.x > this._width && this._tmp.p3.x > this._width) || (this._tmp.p1.y < 0 && this._tmp.p2.y < 0 && this._tmp.p3.y < 0) || (this._tmp.p1.y > this._height && this._tmp.p2.y > this._height && this._tmp.p3.y > this._height)) {

            return false;
        } else {*/

        //console.log('DRAWING');

        surface.getContext().beginPath();
        //   surface.getContext().strokeStyle = "#FFF";
        surface.getContext().moveTo((0.5 + this._tmp.p1.x), (0.5 + this._tmp.p1.y));
        surface.getContext().lineTo((0.5 + this._tmp.p2.x), (0.5 + this._tmp.p2.y));
        surface.getContext().lineTo((0.5 + this._tmp.p3.x), (0.5 + this._tmp.p3.y));

    //     surface.getContext().closePath();
        // surface.getContext().stroke();

        this._tmp._t[20] = 0;
        this._tmp._t[21] = 0;
        this._tmp._t[22] = texture.width;
        this._tmp._t[23] = texture.height;

        this._tmp._t[8] = this._tmp.p1.x;
        this._tmp._t[9] = this._tmp.p1.y;

        this._tmp._t[10] = this._tmp.p2.x;
        this._tmp._t[11] = this._tmp.p2.y;

        this._tmp._t[12] = this._tmp.p3.x;
        this._tmp._t[13] = this._tmp.p3.y;

        this._tmp._t[14] = (face3.uv1.x + this._tmp._t[20]) * this._tmp._t[22];
        this._tmp._t[15] = (face3.uv1.y + this._tmp._t[21]) * this._tmp._t[23];

        this._tmp._t[16] = (face3.uv2.x + this._tmp._t[20]) * this._tmp._t[22];
        this._tmp._t[17] = (face3.uv2.y + this._tmp._t[21]) * this._tmp._t[23];

        this._tmp._t[18] = (face3.uv3.x + this._tmp._t[20]) * this._tmp._t[22];
        this._tmp._t[19] = (face3.uv3.y + this._tmp._t[21]) * this._tmp._t[23];

        this._tmp._t[10] -= this._tmp._t[8];
        this._tmp._t[11] -= this._tmp._t[9];
        this._tmp._t[12] -= this._tmp._t[8];
        this._tmp._t[13] -= this._tmp._t[9];

        this._tmp._t[16] -= this._tmp._t[14];
        this._tmp._t[17] -= this._tmp._t[15];
        this._tmp._t[18] -= this._tmp._t[14];
        this._tmp._t[19] -= this._tmp._t[15];

        this._tmp._t[6] = this._tmp._t[16] * this._tmp._t[19] - this._tmp._t[18] * this._tmp._t[17];

        if (this._tmp._t[6] === 0) {
            return false;
        }

        this._tmp._t[7] = 1 / this._tmp._t[6];

        this._tmp._t[0] = (this._tmp._t[19] * this._tmp._t[10] - this._tmp._t[17] * this._tmp._t[12]) * this._tmp._t[7];
        this._tmp._t[1] = (this._tmp._t[19] * this._tmp._t[11] - this._tmp._t[17] * this._tmp._t[13]) * this._tmp._t[7];
        this._tmp._t[2] = (this._tmp._t[16] * this._tmp._t[12] - this._tmp._t[18] * this._tmp._t[10]) * this._tmp._t[7];
        this._tmp._t[3] = (this._tmp._t[16] * this._tmp._t[13] - this._tmp._t[18] * this._tmp._t[11]) * this._tmp._t[7];

        this._tmp._t[4] = this._tmp._t[8] - this._tmp._t[0] * this._tmp._t[14] - this._tmp._t[2] * this._tmp._t[15];
        this._tmp._t[5] = this._tmp._t[9] - this._tmp._t[1] * this._tmp._t[14] - this._tmp._t[3] * this._tmp._t[15];


        surface.getContext().save();
        surface.getContext().clip();
        surface.getContext().transform(this._tmp._t[0], this._tmp._t[1], this._tmp._t[2], this._tmp._t[3], this._tmp._t[4], this._tmp._t[5]);
        surface.getContext().drawImage(texture, 0, 0);
        surface.getContext().restore();

        //}
        //surface.context.strokeStyle = "red";
        //surface.context.stroke();
    };


    getZoom() {
        return this.zoom;
    }


}
