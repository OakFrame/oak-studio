import {RoomObject} from "../RoomObject";

export class PathComponent {
    constructor(){

    }
    update(entity:RoomObject){
        if (entity.position.dist(entity.path) > 1) {
            entity.velocity.copy(entity.position).pointTo(entity.path).normalize().divI(4);
        }

    }
}