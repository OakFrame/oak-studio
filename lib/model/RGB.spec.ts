import {expect} from 'chai';
import {RGB, RGBA} from "./RGB";

describe('RGB', () => {

    const rgb = new RGB();
    rgb.set(15,15,15);

    it('should be created', () => {

        expect(rgb).not.equal(undefined);

    });

    it('should convert to hex', () => {

        rgb.set(255,0,0);
        expect(rgb.toHex()).equal("#ff0000");

    });

    it('should convert from hex', () => {

        rgb.fromHex("#00ff00");
        expect(rgb.r).equal(0);
        expect(rgb.g).equal(255);
        expect(rgb.b).equal(0);

    });


});