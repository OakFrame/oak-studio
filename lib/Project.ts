import {Room} from "./model/interactive/Room";
import {Vec3} from "./model/math/Vec3";


export class DataPacker {

}

export class Project {

    public name: String;
    public description: String;
    public rooms: Room[];
    public preview: String;
    public _helper_loading;

    constructor() {
        this.rooms = [];
    }
}

export class Prefab {
    public scale: Vec3 = (new Vec3()).set(1, 1, 1,);
    public is_floor: boolean;
}

export class RoomObject {
    public src_object: Prefab;
    public position: Vec3 = new Vec3();
    public is_floor: boolean = false;

    constructor(prefab?: Prefab) {
        this.src_object = prefab;
    }

    setFloor(is_floor) {
        this.is_floor = is_floor;
    }
}