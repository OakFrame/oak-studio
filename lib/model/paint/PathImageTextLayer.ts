import {PathImageEffectInterface} from "./PathImageEffect";
import {Vec2} from "../math/Vec2";

export interface PathImageTextLayerInterface {
    name: string;
    visible: boolean;
    effects: PathImageEffectInterface[];
    text: string;
    position: Vec2;
}

export class PathImageTextLayer implements PathImageTextLayerInterface {
    name: string;
    visible: boolean = true;
    effects: PathImageEffectInterface[] = [];
    text: string = "";
    position: Vec2 = new Vec2();

    constructor(serialized?: { name: string, visible?, paths?, effects? } | PathImageTextLayer | PathImageTextLayerInterface) {
        if (serialized) {
            if (serialized.name !== undefined) {
                this.name = serialized.name
            }
            if (serialized.visible !== undefined) {
                this.visible = serialized.visible;
            }

            if (serialized.position !== undefined) {
                this.position = serialized.position.clone();
            }
            if (serialized.text !== undefined) {
                this.text = serialized.text;
            }
            if (serialized.effects !== undefined) {
                this.effects = [];
            }
        }
    }

    render(context) {
        if (!this.visible) {
            return
        }
        /*this.paths.forEach((path) => {
            this.effects.forEach((eff) => {
                path = eff.applyPath(path);
            })
            path.render(context);
        })*/

        let sep = (Math.floor(Date.now() / 5000) % 2 === 0) ? "_" : "";

        context.font = ((20) * 1) + "px Krona One";
        context.fillStyle = '#000';
        context.fillText(this.text + sep, this.position.x, this.position.y);
    }

    copy(src: PathImageTextLayer) {
        this.name = src.name;
        this.visible = src.visible;
        this.text = src.text;
        return this;
    }

    clone() {
        return ((new PathImageTextLayer()).copy(this));
    }

}
