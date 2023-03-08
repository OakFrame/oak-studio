import {expect} from 'chai';
import {Face3} from "./Face3";
import {Vec3} from "../math/Vec3";

describe('Face3', () => {

    let face = new Face3();


    it('should be created', () => {

        expect(face).not.equal(undefined);

    });


    it('should have correct normal', () => {

        face.pos1.set(0, 0, 0);
        face.pos2.set(1, 0, 0);
        face.pos3.set(1, 1, 0);

        expect(face).not.equal(undefined);
        expect(face.getnormal().z).equal(1);

    });

    face.pos1.set(0, 0, 0);
    face.pos2.set(1, 0, 0);
    face.pos3.set(1, 1, 0);

    it('should return closest point v1', () => {


        let test_point = Vec3.fromValues(-1, 0, 0);

        let closest_point = face.closestPointToPoint(test_point);

        let expected_point = Vec3.fromValues(0, 0, 0); // closest point on edge between pos1 and pos2

        expect(closest_point).to.deep.equal(expected_point);
    });

    it('should return closest point v2', () => {

        let test_point = Vec3.fromValues(2, -1, 0);

        let closest_point = face.closestPointToPoint(test_point);
        expect(closest_point).to.deep.equal(face.pos2)

    });

    it('should return closest point v3', () => {

        let test_point = Vec3.fromValues(2, 2, 0);

        let closest_point = face.closestPointToPoint(test_point);

        expect(closest_point).to.deep.equal(face.pos3)

    });

    it('should return closest point edge', () => {

        let test_point = Vec3.fromValues(0.5, 0, 0);

        let closest_point = face.closestPointToPoint(test_point);

        expect(closest_point.x).equal(0.5);
        expect(closest_point.y).equal(0);
        expect(closest_point.z).equal(0);

    });

    it('should return closest inside tri', () => {

        let test_point = Vec3.fromValues(0.75, 0.25, 0);

        let closest_point = face.closestPointToPoint(test_point);

        expect(closest_point.x).equal(0.75);
        expect(closest_point.y).equal(0.25);
        expect(closest_point.z).equal(0);

    });


});
