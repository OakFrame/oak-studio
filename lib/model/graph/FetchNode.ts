import {Graph} from "./Graph";
import {GraphNode} from "../../interface/GraphNode";
import {GraphNodeHTMLElement} from "../../interface/GraphNodeHTMLElement";

/** @class FetchNode **/
export class FetchNode implements GraphNode {
    _graph: Graph;
    _inputs: GraphNode[] = [];
    _outputs: GraphNode[] = [];
    _value: string = "";
    _name: string = "Text";
    _display: any;
    _element: GraphNodeHTMLElement = new GraphNodeHTMLElement(this, 'div', 'node');

    constructor(graph: Graph) {
        this._graph = graph;
    }

    attachOutput(node: GraphNode): any {
        this._outputs.push(node);
    }

    _render(element: HTMLElement): any {
        let self = this;
        let id = (((Math.random() * 120000) + 1) | 0) + "";
        this._element.element.innerHTML = `<p>${this._name}<br /><input id="${id}" type="text" value="${this._value}" placeholder="//maag.tv"/></p>`;
        console.log(element);
        console.log(this._name);
        element.appendChild(this._element.element);

        let input = <HTMLInputElement>document.getElementById(id);
        input.onkeyup = function () {
            self._value = input.value;
        }
    }

    _evaluate(input: any): void {
        console.log('fetch node evaluate', this._value);
        let self = this;

        fetch(this._value)
            .then(response => response.json())
            .then(data => {
                console.log("JSON RESPONSE",data);
                for (let i = 0; i < self._outputs.length; i++) {

                    self._outputs[i]._evaluate(data);

                }
            });


    }

}