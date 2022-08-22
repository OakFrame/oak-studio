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
        this.position = new Vec2();
        this.velocity = new Vec2();
        this.sediment = 0;
        this.rateDeposit = 0.85;
        this.rateErosion = 0.003;
    }

    simulate(shipp:SHIPP<number>) {
        let checksize = 2;
        let checks = 0;
        let direction = new Vec3();

        let friction = 0.8;

        let last_position = this.position.clone();

        let currentHeight = shipp.getPosition(this.position.x, this.position.y);
       // console.log('current', this.position);

        for (let ix = -checksize; ix <= checksize; ix++) {
            for (let iy = -checksize; iy <= checksize; iy++) {
                if (!(Math.abs(ix) == 0 && Math.abs(iy) == 0)) {
                    let v = new Vec3();
                    let check_vector = new Vec2();
                    check_vector.set(ix, iy);
                    let x = this.position.x + check_vector.x;//(friction * this.velocity.x)
                    let y = this.position.y + check_vector.y;

                    let check_height = shipp.getPosition(x, y);

                    let dv = 1 - ((getDistance(0, 0, ix, iy) / (checksize * 1.45)));
                    v.set(ix, iy, 0);
                    if (dv > 0 && check_height < currentHeight) {
                      //  console.log('found lesser', x, y, check_height);
                        v.mulI(dv);
                        // v.rotZ(180);
                        // v.z = check_height;
                        //direction.x += check_vector.x;
                        //direction.y += check_vector.y;

                        direction.add(v);
                        checks++;
                    }

                    //let h_d = check_height - currentHeight;
                    //  v.set(ix, iy, h_d);
                    //if (h_d > 0) {
                    //  v.rotZ(180);
                    //}
                    //direction.add(v);
                }
            }
        }

       // console.log(direction, 'checks', checks);
       // console.log("A",direction);
        direction.normalize().mulI(1.5);//divI(Math.max(1,checks));
       // console.log("B",direction);
        let next_height = shipp.getPosition(this.position.x + direction.x, this.position.y + direction.y);
        let height_change = next_height - currentHeight;

       // console.log('next-height' ,height_change);

        this.velocity.mulI(friction);
        this.velocity.x += direction.x //* Math.max(0,-height_change);
        this.velocity.y += direction.y// * Math.max(0,-height_change);

        if (this.velocity.mag()>1){
            this.velocity.normalize();
        }

        let pct_max_speed = 0.2+ (this.velocity.mag() * 0.8);

       // console.log('height change', currentHeight, next_height, height_change);

        let next_lesser_height = (height_change<0);

        let height_difference_multiplier;

        height_difference_multiplier =  0.01 + ((Math.abs(height_change))*0.99);

       // if (next_lesser_height){
       //     height_difference_multiplier *= -1;//height_difference_multiplier = 0.2 + ((height_change+1)/2)*0.8;
        //}else{
            //
        //}

        let deposit = this.rateDeposit * this.sediment * (1-height_difference_multiplier);
        let erosion = this.rateErosion * currentHeight * pct_max_speed;

        this.sediment += (erosion - deposit);
        this.sediment = Math.max(0,this.sediment);
        //console.log('deposit/erosion',deposit, erosion, height_difference_multiplier);


        //if (Math.floor(this.position.x) !== Math.floor(last_position.x) || Math.floor(this.position.y) !== Math.floor(last_position.y)) {
            shipp.setPosition(last_position.x, last_position.y, currentHeight + (deposit - erosion));
        //}


        this.position.add(this.velocity);

    }

    end(shipp){
        let currentHeight = shipp.getPosition(this.position.x, this.position.y);
        shipp.setPosition(this.position.x, this.position.y, currentHeight + this.sediment);
        if (this.sediment<0){
            console.log('sediment', this);
        }
        this.sediment = 0;
        this.velocity.set(0,0);
    }
}
