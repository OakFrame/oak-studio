///<reference path="GraphNodeHTMLElement.ts"/>

import {GraphNodeHTMLElement} from "./GraphNodeHTMLElement";
import {Graph} from "../model/graph/Graph";

//** @interface GraphNode is an atomic unit within the node-graph relationship
export interface GraphNode {
	_inputs: GraphNode[];
	_outputs: GraphNode[];
	_name: string;
	_display: any;
	_graph: Graph;
	_element: GraphNodeHTMLElement | HTMLElement;

	_evaluate(input: any): any;

	_render(element: HTMLElement): any;
	_renderNodes():void;

	_value: any;

	attachOutput(node: GraphNode): any;

}