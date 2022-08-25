import {expect} from 'chai';

const fs = require('fs');

import {SHIPP} from "./SHIPP";
import {ErosionDrop} from "./shipp/ErosionDrop";

function drawPixel(context, x, y, color) {
    var roundedX = Math.round(x);
    var roundedY = Math.round(y);

    context.beginPath();
    context.fillStyle = color || '#000';
    context.fillRect(roundedX, roundedY, 1, 1);
    context.fill();
}

function renderSHIPPToImage(f, shipp) {
    const {createCanvas, loadImage, Image} = require('canvas')

    const canvas = createCanvas(shipp.getWidth(), shipp.getHeight());
    // canvas.width = shipp.getWidth();
    //canvas.height = shipp.getHeight();

    let context = canvas.getContext('2d');

    for (let x = 0; x < shipp.getWidth(); x++) {

        for (let y = 0; y < shipp.getHeight(); y++) {
            let v = shipp.getPosition(x, y);
            if  (typeof v === "number") {
                let c = Math.floor(v * 255);
                drawPixel(context, x, y, `rgb(${c},${c},${c})`)
            }else if (v && v.r &&  v.g && v.b){
                drawPixel(context, x, y, `rgb(${Math.floor(v.r)},${Math.floor(v.g)},${Math.floor(v.b)})`)
            }
        }

    }
    const buffer_i = canvas.toBuffer('image/png')

    fs.writeFileSync(f, buffer_i);
}

describe('SHIPP', () => {

    const export_shipp_to_image = true;

    it('should be created', () => {

        let shipp = new SHIPP({width: 2, height: 2});

        expect(shipp).not.equal(undefined);
        expect(shipp.getMap()).not.equal(undefined);
        expect(shipp.getMap().length).equal(4);

    });

    it('should set a position correctly', () => {

        let v = 0.25;

        let shipp = new SHIPP({width: 2, height: 2});

        shipp.setPosition(0, 0, v);
        shipp.setPosition(1, 0, v * 2);
        shipp.setPosition(0, 1, v * 3);
        shipp.setPosition(-1, -1, v * 4);

        expect(shipp.getMap()[0]).equal(v);
        expect(shipp.getMap()[1]).equal(v * 2);
        expect(shipp.getMap()[2]).equal(v * 3);
        expect(shipp.getMap()[3]).equal(v * 4);

    });

    it('should get a position correctly', () => {

        let v = 0.25;

        let shipp = new SHIPP({width: 2, height: 2});

        shipp.setPosition(0, 0, v);
        shipp.setPosition(1, 0, v * 2);
        shipp.setPosition(0, 1, v * 3);
        //shipp.setPosition(-1,-1, v*4);
        shipp.setPosition(1, 1, v * 4);

        expect(shipp.getPosition(0, 0)).equal(v);
        expect(shipp.getPosition(1, 0)).equal(v * 2);
        expect(shipp.getPosition(0, 1)).equal(v * 3);
        expect(shipp.getPosition(-1, -1)).equal(v * 4);
        expect(shipp.getPosition(1, 1)).equal(v * 4);

    });

    it('should place cluster', () => {


        let shipp = new SHIPP({width: 4, height: 4});

        shipp.placeCluster(1, 1, 2, 2, 1);

        expect(shipp.getPosition(0, 0)).equal(0);
        expect(shipp.getPosition(1, 1)).equal(1);
        expect(shipp.getPosition(2, 2)).equal(1);
        expect(shipp.getPosition(3, 3)).equal(0);
        //expect(shipp.getMap()).not.equal(undefined);
        //expect(shipp.getMap().length).equal(4);

    });

    it('should blur', () => {

        let shipp = new SHIPP({width: 9, height: 9});
        let blur = new SHIPP({width: 2, height: 1});
        //blur.setPosition(1,0,1);

        //shipp.addWide(blur);

        shipp.placeCluster(3, 3, 3, 3, 1);

        shipp.blur(2);

        expect(shipp.getMap().length).equal(9 * 9);

        if (export_shipp_to_image) {
            renderSHIPPToImage('./tmp/shipp/02.png', shipp);
        }

    });

    it('should erode', () => {

        let shipp = new SHIPP({width: 9, height: 9});
        shipp.placeCluster(3, 3, 3, 3, 1);

        //shipp.blur(1);

        let drop = new ErosionDrop();
        drop.position.set(3, 4);

        for (let i = 0; i < 3; i++) {
            drop.simulate(shipp);
            console.log('sed', drop.sediment);
        }
        console.log(drop);
        drop.end(shipp);
        expect(drop.velocity.x).lte(0);
        if (export_shipp_to_image) {
            renderSHIPPToImage('./tmp/shipp/03.png', shipp);
        }
        expect(shipp.getMap().length).equal(9 * 9);


    });

    it('should erode 2', () => {


        let shipp = new SHIPP({width: 20, height: 20});
        let shippB = new SHIPP({width: 9, height: 9});
        shippB.placeCluster(3, 3, 3, 3, 1);

        shipp.addWide(shippB);
        shipp.blur(2);

        for (let i = 0; i < 10; i++) {

            for (let x = 0; x < shipp.getWidth(); x++) {
                for (let y = 0; y < shipp.getHeight(); y++) {
                    let drop = new ErosionDrop();
                    drop.position.set(Math.random() * shipp.getWidth(), Math.random() * shipp.getHeight());

                    for (let i = 0; i < 128; i++) {
                        drop.simulate(shipp);
                        //console.log('sed', drop.sediment);
                        if (i > 20 && drop.velocity.mag() < 0.001) {
                            // console.log("BREAKING EARLY", drop);
                            break;
                        }
                    }
                    //console.log(drop)
                    drop.end(shipp);
                }
            }
        }

        // expect(drop.velocity.x).lt(0);

        //expect(shipp.getMap().length).equal(9 * 9);

        if (export_shipp_to_image) {
            renderSHIPPToImage('./tmp/shipp/04.png', shipp);
        }

    }).timeout(10000);




    it('get normal', () => {

        let shipp = new SHIPP({width: 3, height: 3});
        shipp.placeCluster(0, 0, 1, 3, 0);
        shipp.placeCluster(1, 0, 1, 3, 0.5);
        shipp.placeCluster(2, 0, 1, 3, 1);

        //shipp.blur(1);

        let normal = shipp.getNormalAtPosition(1,1);

        let drop = new ErosionDrop();
        drop.position.set(3, 4);

        for (let i = 0; i < 3; i++) {
            drop.simulate(shipp);
            console.log('sed', drop.sediment);
        }
        console.log(drop);
        drop.end(shipp);
        expect(drop.velocity.x).lte(0);
        if (export_shipp_to_image) {
            renderSHIPPToImage('./tmp/shipp/03.png', shipp);
        }
        expect(shipp.getMap().length).equal(9 * 9);


    });

    it('should pathfind', () => {

        let shipp = new SHIPP({width: 9, height: 9});
        shipp.placeCluster(3, 3, 3, 3, 1);

        //shipp.blur(1);

        let drop = new ErosionDrop();
        drop.position.set(3, 4);

        for (let i = 0; i < 3; i++) {
            drop.simulate(shipp);
            console.log('sed', drop.sediment);
        }
        console.log(drop);
        drop.end(shipp);
        expect(drop.velocity.x).lte(0);
        if (export_shipp_to_image) {
            renderSHIPPToImage('./tmp/shipp/03.png', shipp);
        }
        expect(shipp.getMap().length).equal(9 * 9);


    });


});
