import {expect} from 'chai';
import {Face3} from "./Face3";
import {Vec3} from "../math/Vec3";
import {sphereTriangle} from "./RayTriangleIntersection";

describe('Face3 Intersection', () => {

    let face = new Face3();

    face.pos1.set(0,0,0);
    face.pos2.set(1,0,0);
    face.pos3.set(1,1,0);


    it('should return false outside of triangle', () => {

        let test_point = Vec3.fromValues(2,0,0);
        let test_radius = 0.01;

        let sp_collision = sphereTriangle(test_point, test_radius, face);

        expect(sp_collision).equal(false);

    });

    it('should return true inside of triangle', () => {

        let test_point = Vec3.fromValues(0.5,0.25,0);
        let test_radius = 0.25;

        let sp_collision = sphereTriangle(test_point, test_radius, face);

        expect(sp_collision).to.deep.equal(Vec3.fromValues(0.5, 0.25, 0));

    });

    it('should return true intersecting triangle', () => {

        let test_point = Vec3.fromValues(1.1,-0.1,0);
        let test_radius = 0.2;

        let sp_collision = sphereTriangle(test_point, test_radius, face);

        expect(sp_collision).to.deep.equal(face.pos2);

    });


});
