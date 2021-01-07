/** @class AlertNode **/
import {GraphNode} from "../../interface/GraphNode";
import {Graph} from "./Graph";
import {GraphNodeHTMLElement} from "../../interface/GraphNodeHTMLElement";

export class AlertNode extends GraphNode {
	_value: any;
	_graph: Graph;
	_inputs: GraphNode[] = [];
	_outputs: GraphNode[] = [];
	_name: string = "Alert";
	_display: any;
	_element: GraphNodeHTMLElement = new GraphNodeHTMLElement(this, 'div', 'node');

	constructor(graph: Graph) {
		super(graph);
	}

	attachOutput(node: GraphNode): void {
		this._outputs.push(node);
	}

	_render(element: HTMLElement): void {
		this._element.element.innerHTML = this._name;
		console.log(element);
		console.log(this._name);
		element.appendChild(this._element.element);

	}

	_evaluate(input: string): void {
		console.log('FINISHED', input);
		alert(input);
		for (let i = 0; i < this._outputs.length; i++) {
			this._outputs[i]._evaluate({});
		}
	}

	_renderNodes(): void {
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

}