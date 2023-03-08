// Tap, Tap Two, Tap Hold (Begin/End), Move, Scale, Rotate

import {Vec2} from "../math/Vec2";
import {angle_difference} from "../math/Parametric";
import {arrayMedian} from "../Utils";

const CONTEXT_MENU_OPEN = false;

export class QuickInput {

    tapSuccessionTimeout: number = 150; //ms in which
    dragContextTimeout: number;

    listeners: any[] = [];

    currentActions = [];

    element;

    singleTapTimeoutHandler;
    options: any = {
        //tap?,
        //tapTwo?
    };
    previousTouchPositions;

    changedTime: number = 0;
    changedDistance: number;
    dragDistanceThreshold: number = 20;

    willEmitTap: boolean = true;
    mousePos: Vec2 = new Vec2();

    inputType: "mouse" | "pointer" | false;

    pressedKeys = [];

    constructor(el, options?) {
        this.options = options;
        this.element = el;

        this.element.ontouchstart = this.element.onmousedown = (event) => {
            this.mousePos.copy({x: event.clientX, y: event.clientY});
            this.down(event);
        }

        this.element.ontouchmove = this.element.onmousemove = (event) => {
            this.mousePos.copy({x: event.clientX, y: event.clientY});
            this.move(event);
        }

        this.element.ontouchend = this.element.ontouchup = this.element.onmouseup = (event) => {
            this.mousePos.copy({x: event.clientX, y: event.clientY});
            this.up(event);
        }

        document.body.onkeydown = document.body.onkeypress = (event) => {
            if (this.pressedKeys.indexOf(event.code) == -1){
                this.pressedKeys.push(event.code);
            }
            this.key(event);
        };
        document.body.onkeyup = (event) => {
            if (this.pressedKeys.indexOf(event.code) !== -1){
                this.pressedKeys = this.pressedKeys.filter(e=>e!==event.code);
            }
           // this.key(event);
        };

        this.element.oncontextmenu = (event) => {
            //if (this.options && this.options.context) {
            // this.options.context({context: {x: event.clientX, y: event.clientY}});
            event.preventDefault();
            event.cancelBubble = true;
            // }
            return false;
        }

        this.element.ongesturestart = (e) => {
            console.log('gesture START', e);
        }
        this.element.ongesturechange = (e) => {
            console.log('gesture change', e);
        }
        this.element.ongestureend = (e) => {
            console.log('gesture end', e);
        }


        this.element.onwheel = (event) => {
            //this.inputType = "mouse";
            if (this.options && this.options.wheel) {
                this.options.wheel({
                    wheel: {
                        x: arrayMedian([-1, event.deltaX / 100, 1]),
                        y: arrayMedian([-1, event.deltaY / 100, 1])
                    }
                });
                if (event && event.ctrlKey) {
                    event.preventDefault();
                    event.cancelBubble = true;
                }
            }
        }

    }

    key(event) {
        if (!this.options.key) {
            return
        }
        this.options.key({key: event.code});
    }

    async down(event) {

        if (!this.dragContextTimeout) {
            this.dragContextTimeout = window.setTimeout(async () => {
                // console.log('CREATING DRAG TIMEOUT', this.dragContextTimeout);
                if (this.willEmitTap && !CONTEXT_MENU_OPEN) {
                    await this.options.context({context: this.mousePos});
                    this.willEmitTap = false;
                }
            }, 800);
            // console.log("SETUP TIMEOUT", this.dragContextTimeout);
        } else {
            //console.log("DRAGON TIMEOUT ALERADY EXISTS");
        }

        if (!CONTEXT_MENU_OPEN) {
            this.willEmitTap = true;
            this.updateMousePosFromEvent(event);
        }

        this.changedTime = Date.now();
        this.changedDistance = 0;
        /*
        let position = new Vec2();
        if (event) {
            if (event.touches) {
               // console.log('touches', event.touches);
            }
        }

        //console.log('DOWN EVENT', event);
        if (this.currentActions.length === 0) {

            if (this.options && !this.options.tapTwo) {
                return this.options.tap({position});
            }

            this.currentActions.push({type:"down", inputId: 0});

            this.singleTapTimeoutHandler = window.setTimeout(() => {
                this.clearHandlers();
                if (this.currentActions.length === 1) {
                    if (this.options && this.options.tap) {
                        this.options.tap({position});

                    }
                } else {

                }
                this.currentActions = [];
            }, this.tapSuccessionTimeout);
        } else {
            this.clearHandlers();
            if (this.options && this.options.tapTwo) {
                this.options.tapTwo({position});
            }
            this.currentActions = [];
        }
        */
    }


    move(event) {

        if (event && Date.now() - this.changedTime > 10) {

            const currentTouchPositions = [];

            if (event && event.touches) {
                this.inputType = "pointer";

                for (let i = 0; i < event.touches.length; i++) {
                    const d = {
                        x: event.touches[i].clientX,
                        y: event.touches[i].clientY,
                        force: event.touches[i].force || 0
                    };
                    currentTouchPositions.push(d);
                    this.mousePos.copy(d);
                }
            } else {
                this.inputType = "mouse";

                if (event.buttons === 2 || event.which === 3) {
                    const d = {
                        x: event.clientX,
                        y: event.clientY
                    };
                    currentTouchPositions.push(d);
                    this.mousePos.copy(d);
                }

            }

            if (this.previousTouchPositions) {
                if (this.previousTouchPositions.length >= currentTouchPositions.length) {

                    // console.log("Multitouch",currentTouchPositions.length, "prev angle/dist", previousAngle, previousDist);


                    if (this.previousTouchPositions.length >= 2 && currentTouchPositions.length >= 2) {

                        let previousDelta = (new Vec2()).copy(this.previousTouchPositions[0]).sub((new Vec2()).copy(this.previousTouchPositions[1]));
                        let previousDist = previousDelta.mag()
                        let previousAngle = previousDelta.toDeg();

                        let currentDelta = (new Vec2()).copy(currentTouchPositions[0]).sub((new Vec2()).copy(currentTouchPositions[1]));
                        let currentDist = currentDelta.mag()
                        let currentAngle = currentDelta.toDeg();


                        this.willEmitTap = false;
                        let changeDist = currentDist / previousDist;
                        let changeAngle = angle_difference(previousAngle, currentAngle);
                        if (Math.abs(changeDist - 1) > 0.0001) {
                            if (this.options && this.options.scale) {
                                this.options.scale({scale: changeDist});
                            }
                        }

                        if (Math.abs(changeAngle) > 0.01) {
                            if (this.options && this.options.rotate) {
                                this.options.rotate({rotate: changeAngle});
                            }
                        }
                    } else if (this.previousTouchPositions.length === 1 && currentTouchPositions.length === 1) {

                        let previousPosition = (new Vec2()).copy(this.previousTouchPositions[0]);
                        let currentPosition = (new Vec2()).copy(currentTouchPositions[0]);
                        let offset = previousPosition.sub(currentPosition);

                        this.changedDistance += offset.mag();
                        if (this.changedDistance > 8 && offset.mag() > 1) {
                            this.willEmitTap = false;
                            if (this.options && this.options.drag) {
                                this.options.drag({drag: offset});
                            }
                        }

                    }

                }
            }

            this.previousTouchPositions = currentTouchPositions.concat([]);
            this.changedTime = Date.now();

            return;
        }


    }

    updateMousePosFromEvent(event) {
        if (event) {
            if (event.clientX && event.clientY) {
                this.mousePos.copy({x: event.clientX, y: event.clientY});
            } else if (event.touches && event.touches[0]) {
                //console.log("touches",event.touches,event.touches[0]);
                this.mousePos.copy({
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY,
                    force: event.touches[0].force || 0
                });
            } else if (event.changedTouches && event.changedTouches[0]) {
                //  console.log("changedTouches",event.changedTouches,event.changedTouches[0]);
                this.mousePos.copy({
                    x: event.changedTouches[0].clientX,
                    y: event.changedTouches[0].clientY,
                    force: event.changedTouches[0].force || 0
                });
            }
        }
    }

    async up(event) {

        if (CONTEXT_MENU_OPEN) {
            return
        }

        if (event && event.touches) {
            this.inputType = "pointer";
        } else {
            this.inputType = "mouse";
        }

        this.updateMousePosFromEvent(event);

        if (this.willEmitTap) {
            ////console.log(event);
            if (event.buttons === 1 || event.which === 1) {
                this.options && this.options.tap && this.options.tap({
                    tap: this.mousePos
                });
            } else if (event.buttons === 2 || event.which === 3) {
                await this.options.context({context: this.mousePos});
            }
        }

        if (this.dragContextTimeout) {
            //console.log('CLEAR ME', this.dragContextTimeout);
            window.clearTimeout(this.dragContextTimeout);
            this.dragContextTimeout = null;
        }
        this.willEmitTap = true;
        this.previousTouchPositions = null;
        this.changedDistance = 0;
    }

    clearHandlers() {
        if (this.singleTapTimeoutHandler) {
            window.clearTimeout(this.singleTapTimeoutHandler);
        }

        this.singleTapTimeoutHandler = null;
    }


    /*on(identifier, handler) {
        if (!this.listeners[identifier]) {
            this.listeners[identifier] = [];
        }
        this.listeners[identifier].push(handler)
    }

    publish(identifier, event: QuickInputEvent) {
        if (!this.listeners[identifier]) {
            this.listeners[identifier] = [];
        }
        this.listeners[identifier].forEach((handler)=>{
            handler(event);
        })
    }*/

}


export interface QuickInputEvent {
    wheel?: Vec2;
    position?: Vec2;
    scale?: number;
    rotate?: number;
    context?: Vec2;
    drag?: Vec2;
    tap?: Vec2;
    key?: string;
}
