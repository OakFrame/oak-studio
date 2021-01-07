import {Graph} from "./Graph";
import {GraphNode, GraphNodeInterface} from "../../interface/GraphNode";
import {GraphNodeHTMLElement} from "../../interface/GraphNodeHTMLElement";
import {SVGConnectionGenerator} from "./SVGConnectionGenerator";
import {DialogWindow} from "../../../client/keypiece/model/DialogWindow";
import {Field} from "../Field";
import {TextField} from "./TextField";
import {TagField} from "./TagField";

/** @class FetchNode **/
export class DialogNode extends GraphNode {
    _graph: Graph;
    _inputs: GraphNode[] = [];
    _outputs: GraphNode[] = [];
    _parameters: Field[] = [];
    _value: string = "";
    _name: string = "Dialog";
    _display: any;
    _element: GraphNodeHTMLElement = new GraphNodeHTMLElement(this, 'div', 'node string');

    constructor(graph: Graph) {
        super(graph);
        this._graph = graph;
      //  this._parameters.push(new SpriteField());
        this._parameters.push(new TextField());
        this._parameters.push(new TagField());
    }

    attachOutput(node: GraphNode): any {
        this._outputs.push(node);
    }

    _render(element: HTMLElement): any {
        let self = this;
        let id = (((Math.random() * 120000) + 1) | 0) + "";
        this._element.element.innerHTML = `<div class="title">${this._name}<div class="help"></div></div><div class="parameter"><input id="${id}" type="text" value="${this._value}" placeholder="//maag.tv"/></div>`;

        element.appendChild(this._element.element);

        let input = <HTMLInputElement>document.getElementById(id);
        input.onkeyup = function () {
            self._value = input.value;
        }
    }

    _renderNodes(){

        for (let prop of this._parameters){

            prop.subscribe("data", (data)=>{

                let param = document.createElement('div');
                param.className= "parameter";
                param.innerHTML = data;

                let output_node = document.createElement("div");
                output_node.className = "output";
                // @ts-ignore
                output_node.Node = this;
                param.appendChild(output_node);

                let del = document.createElement('span');
                del.innerHTML = `&nbsp;<i class="far fa-times-circle"></i>`;

                param.appendChild(del);

                this._element.element.appendChild(param);

                this.publish('update',{});

            });

            if (prop._type === "tag"){

            }

            this._element.element.appendChild(prop.getElement());

        }

        let input_node = document.createElement("div");
        input_node.className = "in";
        // @ts-ignore
        input_node.Node = this;
        this._element.element.appendChild(input_node);

        let output_node = document.createElement("div");
        output_node.className = "output";
        // @ts-ignore
        output_node.Node = this;
        this._element.element.appendChild(output_node);

    }

    _evaluate(input: any): boolean {
        console.log('fetch node evaluate', this._value);
        let self = this;

        let options = [];

        for (let prop of this._parameters) {
            if (prop._type === "tag"){
                options = prop._value;
            }
        }


        let dialog_window = new DialogWindow("/asset/sp_blank_character.svg","Hello!",options);

        for (let i = 0; i < self._outputs.length; i++) {

            self._outputs[i]._evaluate({});

        }

        return true;

    }

}