/**
 * @constructor
 */
import {Vec3} from "./Vec3";
import {Vec2} from "./Vec2";
import {Surface} from "../rendering/Surface";
import {Camera} from "../interactive/Camera";

export class Projection {

    private d: Vec3;
    private u: Vec3;
    private v: Vec3;
    private mm: number;

    private p: Vec3;
    private s: Vec2;

    private tfov: number;
    private tfovpower: number;
    private tfovpoweraspect: number;

    private _set = false;


    constructor() {
        this.d = new Vec3();
        this.u = new Vec3();
        this.v = new Vec3();

        this.mm = 0;

        this.p = new Vec3();
        this.s = new Vec2();

        this.tfov = 1;
        this.tfovpower = 1;
        this.tfovpoweraspect = 1;
    }

    set(camera: Camera) {
        this._set = true;
        this.d.copy(camera.getToWithUserPosition()).sub(camera.getFromWithUserZoomPositionRotation());

        this.mm = Math.sqrt(this.d.x * this.d.x + this.d.y * this.d.y + this.d.z * this.d.z);

        this.d.divI(this.mm);
        this.u.copy(camera.up);
        this.mm = this.u.dot(this.d);

        this.u.x -= (this.mm * this.d.x);
        this.u.y -= (this.mm * this.d.y);
        this.u.z -= (this.mm * this.d.z);
        this.mm = Math.sqrt(this.u.x * this.u.x + this.u.y * this.u.y + this.u.z * this.u.z);

        this.u.divI(this.mm);

        this.tfov = Math.tan(camera.fov * Math.PI / 360);
        this.tfovpower = this.tfov * this.tfov;
        this.tfovpoweraspect = (camera.aspect * this.tfov) * (camera.aspect * this.tfov);

        this.u.mulI(this.tfov);

        this.v.set(this.u.y * this.d.z - this.d.y * this.u.z, this.u.z * this.d.x - this.d.z * this.u.x, this.u.x * this.d.y - this.d.x * this.u.y).mulI(camera.aspect);

    }

    toWorld(surface: Surface|any, mousePosition, from, target?):Vec3 {
        if (!this._set) {
            console.error("Projection has not been set from Camera source");
            this._set = true;
        }
        if (!target) {
            target = new Vec3();
        }
        this.s.x = (2 * (mousePosition.x)) / surface.getWidth() - 1;
        this.s.y = 1 - (2 * (mousePosition.y)) / surface.getHeight();
        //console.log("screen space", this.s);
        this.p.x = this.d.x + this.u.x * this.s.y + this.v.x * this.s.x;
        this.p.y = this.d.y + this.u.y * this.s.y + this.v.y * this.s.x;
        this.p.z = this.d.z + this.u.z * this.s.y + this.v.z * this.s.x;
        if (this.p.z != 0) {
            target.set(from.x - from.z * this.p.x / this.p.z, from.y - from.z * this.p.y / this.p.z, 0);
        } else {
            target.set(from.x - from.z * this.p.x, from.y - from.z * this.p.y, 0);
        }
        return target;
    }

    // @ts-ignore
    toScreen(surface: Surface|any, position: Vec3, from, target?):Vec2 {
        if (!this._set) {
            console.error("Projection has not been set from Camera source");
            this._set = true;
        }
        if (!target) {
            target = new Vec2();
        }
        this.p.set(position.x - from.x, position.y - from.y, position.z - from.z);
        this.mm = this.p.dot(this.d);
        if (this.mm > 0) {
            this.p.divI(this.mm);
            this.mm = this.p.dot(this.v) / this.tfovpoweraspect;
            target.x = (this.mm + 1) / 2 * surface.getWidth();
            this.mm = this.p.dot(this.u) / this.tfovpower;
            target.y = (1 - this.mm) / 2 * surface.getHeight();
        } else {
            target.set(-99, -99);
        }
        return target;
    }
}
