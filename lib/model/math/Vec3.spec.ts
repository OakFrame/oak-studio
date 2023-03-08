import {expect} from 'chai';
import {Vec3} from "./Vec3";


describe('Vector3', () => {

    it('should return cross product', () => {

       let v1 = Vec3.fromValues(1, 2, 3);
       let v2 = Vec3.fromValues(3, 4, 5);

       let cross = v1.cross(v2);

        expect(cross.x).equal(-2);
        expect(cross.y).equal(4);
        expect(cross.z).equal(-2);

    });

    it('should return dot product', () => {

       let v1 = Vec3.fromValues(1, 2, 3);
       let v2 = Vec3.fromValues(3, 4, 5);

       let dot = v1.dot(v2);

        expect(dot).equal(26);


    });


});
