import {expect} from 'chai';
import {Vec2} from "./Vec2";
import {rayIntersection} from "./LineIntersection";

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

});