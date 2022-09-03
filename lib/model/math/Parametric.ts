import {RadToDeg, DegToRad} from "../Utils";

export function bias(bias:number, real:number) {
    return real / ((1 / bias - 2) * (1 - real) + 1);
}

export function angle_difference_rad(a1, a2){
    return ((((((a1) - (a2)) % 360) + 540) % 360) - 180);
}
export function angle_difference (a1, a2){
    return DegToRad(((((RadToDeg(a1) - RadToDeg(a2)) % 360) + 540) % 360) - 180);
}
