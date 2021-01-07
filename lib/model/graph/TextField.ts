import {Field} from "../Field";

export class TextField extends Field {
    _type: string;
    _value: any;

    _displayArea = document.createElement('div');
    _inputArea = document.createElement('input');

    constructor(value?) {
        super("Tag", value || []);

        this._inputArea.onchange = () => {
            this._value = this._inputArea.value;
        }

        this._displayArea.appendChild(this._inputArea);

    }

    getElement() {
        return this._displayArea;
    }
}