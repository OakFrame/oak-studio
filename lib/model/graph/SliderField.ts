import {Field} from "../Field";

export interface SliderFieldOptionInterface {
    value: number;
    text: string;
}

export class SliderField extends Field {
    _type: string;
    _value: number = 0;
    _text:string;

    _displayArea = document.createElement('div');
    _inputArea: HTMLInputElement = <HTMLInputElement>document.createElement('input');

    constructor(options: SliderFieldOptionInterface, value?) {
        super("Slider", value || 0);

        if (options){
            if (options.text){
                this._text=options.text;
            }
        }

        this._inputArea.className = "form-field";
        this._inputArea.type = "range";

        this._inputArea.onchange = this._inputArea.onmousemove = (w) => {
            console.log("UPDATED SLIDER", w,this._inputArea.value)
            this._value = parseFloat(this._inputArea.value);
            this.publish('update', this._value);
        }

        this._inputArea.value = value||0;
        let label = document.createElement('label');
        label.className = "form-label";
        label.innerText = this._text;

        this._displayArea.appendChild(label);
        this._displayArea.appendChild(this._inputArea);

    }

    getElement() {
        return this._displayArea;
    }
}