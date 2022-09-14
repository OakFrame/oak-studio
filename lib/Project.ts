import {Room} from "./model/interactive/Room";
import {Vec3} from "./model/math/Vec3";
import {Timeline} from "./model/interactive/Timeline";
import {TextField} from "./model/graph/TextField";
import {ListField} from "./model/graph/ListField";
import {Graph} from "./model/graph/Graph";
import {ResourceData} from "./model/Cache";

export class DataPacker {

}

export class Project implements ResourceData {

    public name: String;
    public description: String;
    public rooms: Room[];
    public graphs: Graph[];
    public preview: String;
    public _helper_loading;
    public timelines: Timeline[];

    constructor(project?) {
        this.name = "Untitled Project";
        this.rooms = [];
        this.graphs = [];
        this.timelines = [];
        if (project){
            this.name = project.name;
            this.rooms = project.rooms;
            this.graphs = project.graphs;
            this.timelines = project.timelines;
        }
    }

    getClientRequestView() {
        throw new Error("Method not implemented.");
    }

    getElement() {
        let form = document.createElement('div');
        let name = new TextField(this.name, "Project Name");
        name.subscribe('update', (v) => {
            this.name = v;
        });

        let desc = new TextField(this.description, "Description");
        desc.subscribe('update', (v) => {
            this.description = v;
        });

        let rooms = new ListField(this.rooms.map((r) => {
            return r.getName();
        }), "Room");
        rooms.subscribe('update', (v) => {
            // this.name = v;
            console.log('LIST FIELD', v);
        });


        form.appendChild(name.getElement());
        form.appendChild(desc.getElement());
        //    form.appendChild(rooms.getElement());

        return form;
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
