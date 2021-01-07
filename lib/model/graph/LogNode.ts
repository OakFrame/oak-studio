import {Graph} from "./Graph";
import {GraphNode, GraphNodeInterface} from "../../interface/GraphNode";
import {GraphNodeHTMLElement} from "../../interface/GraphNodeHTMLElement";
import {SVGConnectionGenerator} from "./SVGConnectionGenerator";

/** @class LogNode **/
export class LogNode extends GraphNode {
	_graph: Graph;
	_inputs: GraphNode[] = [];
	_outputs: GraphNode[] = [];
	_value: string[];
	_name: string = "Log";
	_display: any;
	_element: GraphNodeHTMLElement = new GraphNodeHTMLElement(this, 'div', 'node');

	constructor(graph: Graph) {
		super(graph);
		this._value = [];
	}

	attachOutput(node: GraphNode): any {
		this._outputs.push(node);
	}

	_render(element: HTMLElement): any {
		let str = `<div class="title">${this._name}<div class="help"></div></div>`;
		for (let i = 0; i < this._value.length; i++) {
			str = str + this._value[i] + '<br>';
		}
		this._element.element.innerHTML = str;
		console.log(element);
		console.log(this._name);
		element.appendChild(this._element.element);
	}


	_renderNodes(){
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

		/*this._outputs.forEach((graph_node:GraphNode)=>{
			let output_node = document.createElement("div");
			output_node.className = "output";
			this._element.element.appendChild(output_node);
		});*/
	}

	_evaluate(log: string): void {
		console.log('log node evaluate', this._value, log);
		this._value.push(<string>log);

		let str = `<div class="title">${this._name}<div class="help"></div></div>`;
		for (let i = 0; i < this._value.length; i++) {
			str = str + this._value[i] + '<br>';
		}

		this._element.element.innerHTML = str;

		this._renderNodes();
		for (let i = 0; i < this._outputs.length; i++) {
			this._outputs[i]._evaluate(this._value);
		}

		this._graph.renderConnections();
	}


}