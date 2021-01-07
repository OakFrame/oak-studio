import {Subscribe} from "./subscribe/Subscribe";

export class Field {
    _type: string;
    _value: any;
    _id: any;
    _element = document.createElement('div');
    _subscribe = new Subscribe();

    constructor(type: string, value?: any) {
        this._type = type;
        if (value) {
            this._value = value;
        } else {
            this._value = null;
        }
    }

    render(){

    }

    getElement():HTMLElement{
        return this._element;
    }

    subscribe(slug: string, fn): any {
        this._subscribe.subscribe(slug, fn);
    }

    publish(packet, data) {
        this._subscribe.publish(packet, data);
    }
}