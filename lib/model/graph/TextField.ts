import {Field} from "../Field";

export class TextField extends Field {

    _displayArea = document.createElement('div');
    _inputArea = document.createElement('input');

    constructor(value?,type?) {
        super(type || "Tag", value || []);
        this._type = type;
        this._inputArea.className="form-field";

        this._inputArea.onchange = () => {
            this._value = this._inputArea.value;
            this.publish('update', this._value);
        }

        this._inputArea.value = value;
        let label = document.createElement('label');
        label.className="form-label";
        label.innerText=this._type;
        this._displayArea.appendChild(label);
        this._displayArea.appendChild(this._inputArea);

    }

    getElement() {
        return this._displayArea;
    }
}
