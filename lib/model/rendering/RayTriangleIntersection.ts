import {Vec3} from "../math/Vec3";
import {Face3} from "./Face3";

var Tri3_Temp = {
    a: 0, i: 0, t: 0, e: 0, u: 0, v: 0, f: 0, g: 0, s: 0, c: 0, h: 0, M: 0
};

function rayTriangle(origin: Vec3, direction: Vec3, tri: Face3) { // rayTriangle(from:Vec3, direction:Vec3 triangle:Face3)
    Tri3_Temp.a = (tri.pos2.y - tri.pos1.y) * (tri.pos3.z - tri.pos1.z) - (tri.pos3.y - tri.pos1.y) * (tri.pos2.z - tri.pos1.z);
    Tri3_Temp.i = (tri.pos2.z - tri.pos1.z) * (tri.pos3.x - tri.pos1.x) - (tri.pos3.z - tri.pos1.z) * (tri.pos2.x - tri.pos1.x);
    Tri3_Temp.t = (tri.pos2.x - tri.pos1.x) * (tri.pos3.y - tri.pos1.y) - (tri.pos3.x - tri.pos1.x) * (tri.pos2.y - tri.pos1.y);
    Tri3_Temp.e = Math.sign(Tri3_Temp.a * (tri.pos1.x - origin.x) + Tri3_Temp.i * (tri.pos1.y - origin.y) + Tri3_Temp.t * (tri.pos1.z - origin.z));
    Tri3_Temp.u = direction.x * Tri3_Temp.a + direction.y * Tri3_Temp.i + direction.z * Tri3_Temp.t;
    if (Tri3_Temp.e != Math.sign(Tri3_Temp.u) || 0 == Tri3_Temp.e) return !1;
    Tri3_Temp.v = (Tri3_Temp.a * tri.pos1.x + Tri3_Temp.i * tri.pos1.y + Tri3_Temp.t * tri.pos1.z - (Tri3_Temp.a * origin.x + Tri3_Temp.i * origin.y + Tri3_Temp.t * origin.z)) / Tri3_Temp.u;
    Tri3_Temp.f = direction.x * Tri3_Temp.v + origin.x;
    Tri3_Temp.g = direction.y * Tri3_Temp.v + origin.y;
    Tri3_Temp.s = direction.z * Tri3_Temp.v + origin.z;
    Tri3_Temp.c = (tri.pos1.y - Tri3_Temp.g) * (tri.pos2.z - Tri3_Temp.s) - (tri.pos2.y - Tri3_Temp.g) * (tri.pos1.z - Tri3_Temp.s);
    Tri3_Temp.h = (tri.pos1.z - Tri3_Temp.s) * (tri.pos2.x - Tri3_Temp.f) - (tri.pos2.z - Tri3_Temp.s) * (tri.pos1.x - Tri3_Temp.f);
    Tri3_Temp.M = (tri.pos1.x - Tri3_Temp.f) * (tri.pos2.y - Tri3_Temp.g) - (tri.pos2.x - Tri3_Temp.f) * (tri.pos1.y - Tri3_Temp.g);
    if (0 > Tri3_Temp.c * Tri3_Temp.a + Tri3_Temp.h * Tri3_Temp.i + Tri3_Temp.M * Tri3_Temp.t) return !1;
    Tri3_Temp.c = (tri.pos2.y - Tri3_Temp.g) * (tri.pos3.z - Tri3_Temp.s) - (tri.pos3.y - Tri3_Temp.g) * (tri.pos2.z - Tri3_Temp.s);
    Tri3_Temp.h = (tri.pos2.z - Tri3_Temp.s) * (tri.pos3.x - Tri3_Temp.f) - (tri.pos3.z - Tri3_Temp.s) * (tri.pos2.x - Tri3_Temp.f);
    Tri3_Temp.M = (tri.pos2.x - Tri3_Temp.f) * (tri.pos3.y - Tri3_Temp.g) - (tri.pos3.x - Tri3_Temp.f) * (tri.pos2.y - Tri3_Temp.g);
    if (0 > Tri3_Temp.c * Tri3_Temp.a + Tri3_Temp.h * Tri3_Temp.i + Tri3_Temp.M * Tri3_Temp.t) return !1;
    Tri3_Temp.c = (tri.pos3.y - Tri3_Temp.g) * (tri.pos1.z - Tri3_Temp.s) - (tri.pos1.y - Tri3_Temp.g) * (tri.pos3.z - Tri3_Temp.s);
    Tri3_Temp.h = (tri.pos3.z - Tri3_Temp.s) * (tri.pos1.x - Tri3_Temp.f) - (tri.pos1.z - Tri3_Temp.s) * (tri.pos3.x - Tri3_Temp.f);
    Tri3_Temp.M = (tri.pos3.x - Tri3_Temp.f) * (tri.pos1.y - Tri3_Temp.g) - (tri.pos1.x - Tri3_Temp.f) * (tri.pos3.y - Tri3_Temp.g);
    return 0 > Tri3_Temp.c * Tri3_Temp.a + Tri3_Temp.h * Tri3_Temp.i + Tri3_Temp.M * Tri3_Temp.t ? !1 : new Vec3().set(Tri3_Temp.f, Tri3_Temp.g, Tri3_Temp.s); //[f, g, s, vecDist(y, [f, g, s])];
}