///<reference path="../../interface/GraphEvent.ts"/>
///<reference path="../../interface/GraphNode.ts"/>

import {GraphNode, GraphNodeInterface} from "../../interface/GraphNode";
import {Subscribe} from "../subscribe/Subscribe";

export class Graph implements GraphEvent {
    public name: string;
    private _nodes: GraphNodeInterface[];
    private fromNode = null;
    private _subscribe = new Subscribe();

    constructor() {
        this.name = "Unnamed Graph";
        this._nodes = [];
    }

    attachNode(node: GraphNodeInterface): void {
        this._nodes.push(node);
    }

    render(element: HTMLElement) {

        element.innerHTML = `<canvas id="links"></canvas>`;

        let off_top = 0;
        this._nodes.forEach(function (node, i) {
            node._render(element);
            node._element.element.style.top = `${off_top}px`;
            off_top += node._element.element.offsetHeight;
            node._renderNodes();
        });

        var isMouseDown, initX, initY, clickX, clickY,
            height = 0,
            width = 0,
            draggingElem;

        document.body.addEventListener('mousedown', function (e: any) {
            let elem: any = e.srcElement || e.target;
            draggingElem = null;
            document.body.classList.add('no-select');

            if (elem.className.indexOf("node") !== -1) {
                draggingElem = elem;
            } else {
                if (e.path) {
                    for (let i = 0; i < e.path.length; i++) {
                        let el = e.path[i];
                        if (!draggingElem) {
                            if (!el || !el.className) {
                                return;
                            }
                            if (el.className == "output" || el.className == "out" || el.className == "in") {
                                break;
                            }
                            if (el.className.indexOf("node") !== -1) {
                                draggingElem = el;
                            }
                        }
                    }
                }
            }

            if (!draggingElem) {
                return;
            }

            isMouseDown = true;
            height = draggingElem.offsetHeight;
            width = draggingElem.offsetWidth;
        });

        document.addEventListener('mousemove', function (e) {
            if (isMouseDown && draggingElem) {
                if (!initX && !initY && !clickX && !clickY) {
                    clickX = e.pageX;
                    clickY = e.pageY;
                    initX = draggingElem.offsetLeft || 0;
                    initY = draggingElem.offsetTop || 0;
                }
                var cx = (e.pageX - clickX) + initX;
                var cy = ((((e.pageY) - clickY)) + initY);

                if (cx < 0) {
                    cx = 0;
                }
                if (cy < 0) {
                    cy = 0;
                }
                draggingElem.style.left = cx + 'px';
                draggingElem.style.top = cy + 'px';

            }
        });

        document.addEventListener('mouseup', function () {
            isMouseDown = false;
            draggingElem = null;
            initX = null;
            initY = null;
            clickX = null;
            clickY = null;
            document.body.classList.remove('no-select');
        });


        for (const prop of this._nodes){
            prop.subscribe("update",()=>{
                this.renderConnections();
                }
            );
        }

        this.renderConnections();
        this.setupLinking();

    }

    setupLinking() {


        window.addEventListener("mouseup", () => {
            if (!this.fromNode) {
                return;
            }
            delete this.fromNode.Node._outputs[0];
            this.fromNode.link = null;
            this.fromNode = null;
            document.body.className = "";
            console.log("hsould be unlinking ", this.fromNode);
        });

        // @ts-ignore
        var canvas: HTMLCanvasElement = document.getElementById("links");
        let context = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var outputs = document.querySelectorAll(".output, .out");


        let updateLinking = (event) => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = 0; i < outputs.length; ++i) {
                // @ts-ignore
                if (outputs[i].link && this.fromNode !== outputs[i]) {
                    // @ts-ignore
                    var position = outputs[i].getBoundingClientRect(),
                        // @ts-ignore
                        positionLink = outputs[i].link.getBoundingClientRect(),
                        width = positionLink.left - position.left;
                    context.beginPath();
                    context.moveTo(position.left + position.width / 2, position.top + position.height / 2);
                    context.bezierCurveTo(position.left + position.width / 2 + width / 2, position.top + position.height / 2, (positionLink.left + positionLink.width / 2) - width / 2, (positionLink.top + positionLink.height / 2), (positionLink.left + positionLink.width / 2), (positionLink.top + positionLink.height / 2));
                    context.strokeStyle = "hsl(0, 0%, 40%)";
                    context.lineWidth = 2;
                    context.stroke();
                    context.beginPath();
                    context.arc(position.left + position.width / 2, position.top + position.height / 2, 4, 0, 2 * Math.PI, false);
                    context.fillStyle = "hsl(0, 0%, 40%)";
                    context.fill();
                }
            }

            if (this.fromNode) {
                // @ts-ignore
                let value1 = 100;
                let value2 = 10;

                // @ts-ignore
                var position = this.fromNode.getBoundingClientRect(),
                    width = event.clientX - (position.left + position.width / 2), height = 0;
                height = Math.max(Math.min(200, Math.pow(Math.abs(event.clientY - (position.top + position.height / 2)), 1.6)) / Math.max(1, width / value2), 0) * -Math.sign(event.clientY - (position.top + position.height / 2));
                width = Math.max(value1 / Math.max(1, width / value2), Math.abs(width));

                context.beginPath();
                context.moveTo(position.left + position.width / 2, position.top + position.height / 2);
                context.bezierCurveTo(position.left + position.width / 2 + width / 2, position.top + position.height / 2 - height / 2, event.clientX - width / 2, event.clientY + height / 2, event.clientX, event.clientY);
                context.strokeStyle = "hsl(200, 100%, 50%)";
                context.lineWidth = 2;
                context.stroke();
                context.beginPath();
                context.arc(position.left + position.width / 2, position.top + position.height / 2, 4, 0, 2 * Math.PI, false);
                context.fillStyle = "hsl(200, 100%, 50%)";
                context.fill();
            }
        }

        window.addEventListener("mousemove", updateLinking);

        let graph_area = document.getElementById('graph-render-area');
        graph_area.addEventListener("scroll", updateLinking);

    }

    renderConnections() {

        Math.sign = function (x) {
            return x > 0 ? 1 : x < 0 ? -1 : 0;
        }

        var outputs: NodeListOf<HTMLElement> = document.querySelectorAll(".output, .out");


        for (var i = 0; i < outputs.length; ++i) {
            // @ts-ignore
            outputs[i].link = null;
            outputs[i].onmousedown = ((element) => {
                return (event) => {
                    event.preventDefault();
                    this.fromNode = element;
                    document.body.className = "linking";
                };
            })(outputs[i]);
        }

        var inputs: NodeListOf<HTMLElement> = document.querySelectorAll(".input, .in");
        for (var i = 0; i < inputs.length; ++i) {
            // @ts-ignore
            inputs[i].link = null;
            inputs[i].onmouseup = ((element) => {
                return (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (this.fromNode) {
                        this.fromNode.link = element;
                        // @ts-ignore
                        this.fromNode.Node._outputs[0] = element.Node;
                    }
                    this.fromNode = null;
                };
            })(inputs[i]);
        }

        this._nodes.forEach((node) => {
            node._outputs.forEach((output_node) => {
                let start_node = node._element.element.querySelector(".output");
                let end_node = output_node._element.element.querySelector(".in");
                if (start_node && end_node) {
                    // @ts-ignore
                    start_node.link = end_node;
                }
            })
        })


    }

    get onComplete(): any {
        return this._oncomplete;
    }

    set onComplete(evt) {
        this._oncomplete = evt;
    }

    _oncomplete(): any {

    }

    subscribe(slug: string, fn): any {
        this._subscribe.subscribe(slug, fn);
    }

    publish(packet, data) {
        this._subscribe.publish(packet, data);
    }

}
