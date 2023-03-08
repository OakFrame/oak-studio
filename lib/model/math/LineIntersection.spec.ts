import {expect} from 'chai';
import {Vec2} from "./Vec2";
import {closestPointOnLine, rayIntersection} from "./LineIntersection";
import {Vec3} from "./Vec3";

describe('Ray Intersection', () => {

    it('should return 0,1', () => {

        let from1 = (new Vec2()).set(-1,1);let to1 = (new Vec2()).set(1,1); //h
        let from2 = (new Vec2()).set(0,-1);let to2 = (new Vec2()).set(0,2);// v

        let intersection = rayIntersection(from1,to1, from2, to2);
        expect(intersection.x).equal(0);
        expect(intersection.y).equal(1);

    });

    it('should return 6,6', () => {

        let from1 = (new Vec2()).set(-1,-1);let to1 = (new Vec2()).set(0,0); //h
        let from2 = (new Vec2()).set(6,-1);let to2 = (new Vec2()).set(6,5);// v

        let intersection = rayIntersection(from1,to1, from2, to2);
        expect(intersection.x).equal(6);
        expect(intersection.y).equal(6);

    });


    it('should return 3,3', () => {

        let from1 = (new Vec2()).set(1,1);let to1 = (new Vec2()).set(2,2); //h
        let from2 = (new Vec2()).set(5,1);let to2 = (new Vec2()).set(4,2);// v

        let intersection = rayIntersection(from1,to1, from2, to2);
        expect(intersection.x).equal(3);
        expect(intersection.y).equal(3);

    });

    it('should return 3,3', () => {

        let from1 = (new Vec2()).set(2,2);let to1 = (new Vec2()).set(1,1); //h
        let from2 = (new Vec2()).set(5,1);let to2 = (new Vec2()).set(4,2);// v

        let intersection = rayIntersection(from1,to1, from2, to2);
        expect(intersection.x).equal(3);
        expect(intersection.y).equal(3);

    });
    const origin = new Vec3().copy({ x: 0, y: 0, z: 0 });

    it("returns the correct closest point on a non-zero length line", () => {
        const point = new Vec3().copy({ x: 2, y: 1, z: 0 });
        const line = new Vec3().copy({ x: 1, y: 0, z: 0 });
        const expected = new Vec3().copy({ x: 2, y: 0, z: 0 });
        const result = closestPointOnLine(point, origin, line);
        expect(result).to.deep.equal(expected);
    });

    it("returns the same point for a zero-length line", () => {
        const point = (new Vec3()).copy({ x: 1, y: 2, z: 3 });
        const line = (new Vec3()).copy({ x: 0, y: 0, z: 0 });

        const result = closestPointOnLine(point, origin,  line);
        expect(result).to.deep.equal(point);
    });

    it("returns the same point for a diagonal", () => {
        const point = (new Vec3()).copy({ x: 1, y: -1, z: 0 });
        const line = (new Vec3()).copy({ x: 1, y: 1, z: 0 });

        const result = closestPointOnLine(point, Vec3.fromValues(-1,-1,0),  line);
        expect(result).to.deep.equal(origin);
    });

    it("returns the closest point on a line with negative direction", () => {
        const point = new Vec3().copy({ x: 2, y: 1, z: 0 });
        const line = new Vec3().copy({ x: -1, y: 0, z: 0 });
        const expected = new Vec3().copy({ x: 2, y: 0, z: 0 });
        const result = closestPointOnLine(point,origin,  line);
        expect(result).to.deep.equal(expected);
    });

});
