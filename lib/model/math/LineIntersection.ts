import {Vec2} from "./Vec2";
import {Vec3} from "./Vec3";

export function rayIntersection(from1: Vec2, to1: Vec2, from2: Vec2, to2: Vec2): Vec2 {
 //  const ray1 = to1.clone().sub(from1);
   // const ray2 = to2.clone().sub(from2);
    const vec = new Vec2();

    let line1StartX = from1.x;
    let line1StartY = from1.y;
    let line1EndX = to1.x;
    let line1EndY = to1.y;
    let line2StartX = from2.x;
    let line2StartY = from2.y;
    let line2EndX = to2.x;
    let line2EndY = to2.y;

    var denominator, a, b, numerator1, numerator2;
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return vec;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    vec.x = line1StartX + (a * (line1EndX - line1StartX));
    vec.y = line1StartY + (a * (line1EndY - line1StartY));
    /*
            // it is worth noting that this should be the same as:
            x = line2StartX + (b * (line2EndX - line2StartX));
            y = line2StartX + (b * (line2EndY - line2StartY));
            */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        //result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
      //  result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true

   /* let p0e = [from1.x + ray1.x, from1.y + ray1.x];
    let p1e = [from2.x + ray2.x, from2.y + ray2.y];
    let m0 = (p0e[1] - from1.y) / (p0e[0] - from1.x);
    let m1 = (p1e[1] - from2.y) / (p1e[0] - from2.x);
    let b0 = from1.y - m0 * from1.x;
    let b1 = from2.y - m1 * from2.x;
    let x = (b1 - b0) / (m0 - m1);
    let y = m0 * x + b0;

  //  vec.set(x, y)*/

    return vec;

}


export function lineIntersection(from1: Vec2, to1: Vec2, from2: Vec2, to2: Vec2): Vec2 {
    const dX: number = to1.x - from1.x;
    const dY: number = to1.y - from1.y;
    const vec = new Vec2();


    const determinant: number = dX * (to2.y - from2.y) - (to2.x - from2.x) * dY;
    if (determinant === 0) return vec; // parallel lines

    const lambda: number = ((to2.y - from2.y) * (to2.x - from1.x) + (from2.x - to2.x) * (to2.y - from1.y)) / determinant;
    const gamma: number = ((from1.y - to1.y) * (to2.x - from1.x) + dX * (to2.y - from1.y)) / determinant;


    // check if there is an intersection
    if (!(0 <= lambda && lambda <= 1) || !(0 <= gamma && gamma <= 1)) return vec;

    vec.set(from1.x + lambda * dX, from1.y + lambda * dY);

    return vec;

}

export function closestPointOnLine2(point: Vec3, line: Vec3): Vec3 {
    const lineLengthSquared = line.lengthSquared();
    if (lineLengthSquared === 0) {
        return point.clone();
    }
    let t = point.dot(line) / lineLengthSquared;
    t = Math.max(0, Math.min(1, t));
    return line.clone().mulI(t).add(point);
}


export function closestPointOnLine(point: Vec3, p0: Vec3, dir: Vec3): Vec3 {
    const lineLengthSquared = dir.lengthSquared();
    if (lineLengthSquared === 0) {
        return point.clone();
    }
    let t = point.clone().sub(p0).dot(dir) / lineLengthSquared;
    return dir.clone().mulI(t).add(p0);
}
