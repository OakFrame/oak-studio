import {Field} from "../Field";

export class ListField extends Field {
    _type: string = "List";
    _value: any[] = [];

    _displayArea = document.createElement('div');
    _inputArea = document.createElement('ul');

    constructor(value?,type?) {
        super(type || "List", value || []);
        this._type = type;
      //  this._inputArea.className="form-field";

       // this._inputArea.onchange = () => {
        //    this._value = this._inputArea.value;
        //    this.publish('update', this._value);
       // }

        this._inputArea.className="table-list";

        if (!value || !this._value){
            this._value = [];
        }
        this._value.forEach((v)=>{
            let e = document.createElement('li');
            e.innerHTML = v;
            this._inputArea.appendChild(e);
        })

        //this._inputArea.value = value;
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
