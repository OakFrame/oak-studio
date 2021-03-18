import {Field} from "../Field";

export interface SelectFieldOptionInterface {
    value:any;
    text:string;
}

export class SelectField extends Field {
    _type: string;
    _value: any;

    _displayArea = document.createElement('div');
    _inputArea = document.createElement('select');

    constructor(options:SelectFieldOptionInterface[], value?) {
        super("Select", value || []);

        this._inputArea.className="form-field";

        this._inputArea.onchange = (w) => {
            console.log("UPDATED SELECFT",w)
            this._value = this._inputArea.value;
            this.publish('update', this._value);
        }

        this._inputArea.value = value;
        let label = document.createElement('label');
        label.className="form-label";
        label.innerText=this._type;

        options.forEach((option)=>{
            let option_element = document.createElement("option");
            option_element.innerText=option.text;
            option_element.value=option.value;
            if (option.value === value){
                option_element.selected = true;
            }
            this._inputArea.appendChild(option_element);
        });

        this._displayArea.appendChild(label);
        this._displayArea.appendChild(this._inputArea);

    }

    getElement() {
        return this._displayArea;
    }
}