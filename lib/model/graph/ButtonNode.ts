import {Graph} from "./Graph";
import {GraphNode} from "../../interface/GraphNode";
import {GraphNodeHTMLElement} from "../../interface/GraphNodeHTMLElement";
import {SVGConnectionGenerator} from "./SVGConnectionGenerator";

/** @class ButtonNode **/
export class ButtonNode extends GraphNode {
    _value: any;
    _name: string = "Button";
    _display: any;
    _graph: Graph;
    _inputs: GraphNode[] = [];
    _outputs: GraphNode[] = [];
    _element: GraphNodeHTMLElement = new GraphNodeHTMLElement(this, 'div', 'node');

    constructor(graph: Graph) {
       super(graph);
    }

    attachOutput(node: GraphNode): any {
        this._outputs.push(node);
    }

    _render(element: HTMLElement): any {
        let self = this;
        let id = (((Math.random() * 120000) + 1) | 0) + "";
        this._element.element.innerHTML = `<div class="title">${this._name}<div class="help"></div></div><div class="parameter"><button id="${id}">Activate</button></div>`;

        console.log(element);
        console.log(this._name);
        element.appendChild(this._element.element);

        document.getElementById(id).onclick = function () {
            self._evaluate();
        }

    }

    _renderNodes(){


        let output_node = document.createElement("div");
        output_node.className = "output";
        // @ts-ignore
        output_node.Node = this;
        this._element.element.appendChild(output_node);

    }

    _evaluate(): void {
        console.log('button node evaluate');
        for (let i = 0; i < this._outputs.length; i++) {
            this._outputs[i]._evaluate({});
        }
    }

}