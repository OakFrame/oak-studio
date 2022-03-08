///<reference path="GraphNodeHTMLElement.ts"/>

import {GraphNodeHTMLElement} from "./GraphNodeHTMLElement";
import {Graph} from "../model/graph/Graph";
import {Subscribe} from "../model/subscribe/Subscribe";

//** @interface GraphNode is an atomic unit within the node-graph relationship

export class GraphNode implements GraphNodeInterface{
    _inputs: GraphNode[];
    _outputs: GraphNode[];
    _name: string;
    _display: any;
    _graph: Graph;
    _element: GraphNodeHTMLElement;
    _subscribe:Subscribe = new Subscribe();
    _value: any;

    constructor(graph) {
        this._graph = graph;
    }

    _evaluate(input: any){
    }

    _render(element: HTMLElement): any {

    };

    _renderNodes(): void{

    };

    attachOutput(node: GraphNode): any{

    };

    subscribe(slug: string, fn){
        this._subscribe.subscribe(slug, fn);
    };

    publish(packet, data){
        this._subscribe.publish(packet, data)
    };

}

export interface GraphNodeInterface {
    _inputs: GraphNode[];
    _outputs: GraphNode[];
    _name: string;
    _display: any;
    _graph: Graph;
    _element: GraphNodeHTMLElement;

    _evaluate(input: any): any;

    _render(element: HTMLElement): any;

    _renderNodes(): void;

    _value: any;

    attachOutput(node: GraphNode): any;

    subscribe(slug: string, fn);

    publish(packet, data);

}
