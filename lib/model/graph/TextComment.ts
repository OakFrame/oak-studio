import {EventModel} from "../EventModel";

export class TextComment implements EventModel {

    body:string;
    parent:string;
    _date:number;

    constructor(props?) {
        if (props){
            this.deserialize(props);
        }
    }

    on(identifier: String, fn?: Function) {
        throw new Error("Method not implemented.");
    }

    deserialize(sprite){
        if (sprite.body){
            this.body = sprite.body;
        }
        if (sprite.parent){
            this.parent = sprite.parent;
        }if (sprite.date){
            this._date = sprite._date;
        }
        return this;
    }

}
