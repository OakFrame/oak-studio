import {GBAttributeTypeToEditorPrimitive, GBObject, GBPrimitive, GBRoom} from "../../client/appventure/model/Project";

export class Workspace {

}

export class RoomWorkspace {
    room: GBRoom;
    constructor(room?){
        this.room = room;
    }
    getElement(){
        let el =// document.getElementById();
            document.createElement('div');
        el.innerText = "";
        if (this.room && this.room.attributes) {
            let thumb = document.createElement('div');
            thumb.innerText = this.room.thumbnail;
            thumb.className = "prefab-thumbnail";
            el.appendChild(thumb);
            this.room.attributes.forEach((attribute) => {
                let primitive = new (GBAttributeTypeToEditorPrimitive[attribute])(attribute);// new GBPrimitive();
                el.appendChild(primitive.getEditor(this.room,attribute));
            });
        }

        return el;
    }
}

export class PrefabWorkspace {

    prefab: GBObject;

    constructor(prefab?) {
        this.prefab = prefab;
    }

    getElement(){
        let el =// document.getElementById();
        document.createElement('div');
        el.innerText = "";
        if (this.prefab && this.prefab.attributes) {
            let thumb = document.createElement('div');
            thumb.innerText = this.prefab.thumbnail;
            thumb.className = "prefab-thumbnail";
            el.appendChild(thumb);
            this.prefab.attributes.forEach((attribute) => {
                let primitive = new (GBAttributeTypeToEditorPrimitive[attribute])(attribute);// new GBPrimitive();
                el.appendChild(primitive.getEditor(this.prefab,attribute));
            });
        }

        return el;
    }

}


