import {Field} from "../Field";

export interface SliderFieldOptionInterface {
    value: number;
    text: string;
    upper?:number;
    lower?:number;
    step?:number;
}

export class SliderField extends Field {
    _type: string;
    _value: number = 0;
    _text:string;
    _upper?:number = 10;
    _lower?:number = 1;
    _step:number = 1;

    _displayArea = document.createElement('div');
    _inputArea: HTMLInputElement = <HTMLInputElement>document.createElement('input');

    constructor(options: SliderFieldOptionInterface, value?) {
        super("Slider", value || 0);

        if (options){
           // if (options.text){
            this._value = options.value;
                this._text=options.text;
                this._upper=options.upper;
                this._lower=options.lower;
                this._step=options.step;
            //}
        }

        this._inputArea.className = "form-field";
        this._inputArea.type = "range";
        this._inputArea.min = this._lower.toString();
        this._inputArea.max = this._upper.toString();
        this._inputArea.step = this._step.toString();
        this._inputArea.onmousemove = (w) => {
           // this._value = parseFloat(this._inputArea.value);
            label_value.innerText = this._value.toString();
            //this.publish('update', this._value);
        }
        this._inputArea.onchange =  (w) => {
            this._value = parseFloat(this._inputArea.value);
            label_value.innerText = this._value.toString();
            this.publish('update', this._value);
        }

        this._inputArea.value = value||0;
        let label = document.createElement('label');
        label.className = "form-label";
        label.innerText = this._text;

        let label_value = document.createElement('label');
        label_value.className = "form-label";
        label_value.innerText = this._value.toString();

        this._displayArea.appendChild(label);
        this._displayArea.appendChild(this._inputArea);
        this._displayArea.appendChild(label_value);


    }

    getElement() {
        return this._displayArea;
    }
}
