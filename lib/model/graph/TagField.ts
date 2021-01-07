import {Field} from "../Field";

export class TagField extends Field {
    _type: string;
    _value: any;

    _element = document.createElement('div');
    _displayArea = document.createElement('div');
    _inputArea = document.createElement('input');

    constructor(value?: any) {
        super("tag", value||[]);

        this._inputArea.placeholder = "Tag";

        this._inputArea.onkeyup = (kev) => {
            if (kev.key == "Enter" || kev.keyCode === 13){
                let option = this._inputArea.value;
                this._value.push(option);
                this._inputArea.value = "";

                this.publish("data", option);

                /*let pill = document.createElement('span');
                pill.innerHTML = `<span>${option}</span>`;
                let del = document.createElement('span');
                del.innerHTML = `<i class="far fa-times-circle"></i>`;

                pill.appendChild(del);

                this._displayArea.appendChild(pill);*/

            }
        }

        this._element.appendChild(this._displayArea);
        this._element.appendChild(this._inputArea);


    }

    getElement(){
        return this._element;
    }
}