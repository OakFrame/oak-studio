import { bias } from "../math/Parametric";
import {Vec2} from "../math/Vec2";
import {Vec3} from "../math/Vec3";
import {getDistance, SHIPP} from "../SHIPP";

export class ErosionDrop {
    position: Vec2;
    velocity: Vec2;
    sediment: number;
    rateDeposit: number;
    rateErosion: number;

    constructor() {
        let scale = 1;
        this.position = new Vec2();
        this.velocity = new Vec2();
        this.sediment = 0;
        this.rateDeposit = 0.002 * scale;
        this.rateErosion = 0.003 * scale;
    }

    simulate(shipp: SHIPP<number>) {

        let direction = new Vec3();

        let friction = 1;//0.999;

        let last_position = this.position.clone();

        let currentHeight = shipp.getPosition(this.position.x, this.position.y);


        direction = shipp.CalculateNormal(this.position.x, this.position.y);
       // let d = new Vec3();d.random();
       // d.x -= 0.5;d.y -= 0.5;d.z -= 0.5;
       // d.divI(100000);
       // direction.add(d);
        // console.log(direction, 'checks', checks);
        // console.log("A",direction);
        //direction.normalize().mulI(1.5);//divI(Math.max(1,checks));
        // console.log("B",direction);
        let next_height = shipp.getPosition(this.position.x + direction.x, this.position.y + direction.y);
        let height_change = next_height - currentHeight;

        // console.log('next-height' ,height_change);

        this.velocity.mulI(friction);
        this.velocity.x += direction.x/4 //* Math.max(0,-height_change);
        this.velocity.y += direction.y/4 // * Math.max(0,-height_change);

        //this.velocity.mulI(4);

        if (this.velocity.mag() > 1) {
            this.velocity.normalize();
        }
        //this.velocity.divI(4);


        let pct_max_speed = 0.2 + (this.velocity.mag() * 0.8);

        // console.log('height change', currentHeight, next_height, height_change);

//        let next_lesser_height = (height_change<0);

//        let height_difference_multiplier;

        //  height_difference_multiplier =  0.01 + ((Math.abs(height_change))*0.99);

        // if (next_lesser_height){
        //     height_difference_multiplier *= -1;//height_difference_multiplier = 0.2 + ((height_change+1)/2)*0.8;
        //}else{
        //
        //}

        let deposit = this.rateDeposit * this.sediment * (direction.z); // * ( 1-currentHeight );
        let erosion = Math.min(currentHeight, this.rateErosion * (((1 - direction.z))));

        //if (this.sediment > 0.1) {
            erosion = Math.max(0,erosion - (this.sediment/3));
            if (next_height > currentHeight){
                erosion = 0;
                deposit = this.sediment / 4;
            }
        //}


        this.sediment += (erosion - deposit);
        this.sediment = Math.max(0, this.sediment);
        //console.log('deposit/erosion',deposit, erosion, height_difference_multiplier);


        //if (Math.floor(this.position.x) !== Math.floor(last_position.x) || Math.floor(this.position.y) !== Math.floor(last_position.y)) {
        shipp.setPosition(last_position.x, last_position.y, currentHeight + (deposit - erosion));
        //}


        this.position.add(this.velocity);

    }

    end(shipp) {
        let currentHeight = shipp.getPosition(this.position.x, this.position.y);
        shipp.setPosition(this.position.x, this.position.y, currentHeight + this.sediment);
        // if (this.sediment<0){
        //   console.log('sediment', this);
        //}
        this.sediment = 0;
        this.velocity.set(0, 0);
    }
}
