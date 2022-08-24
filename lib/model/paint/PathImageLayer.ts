import {PaintStroke} from "./PaintStroke"
import {StrokePath} from "./StrokePath"
import {PathImageEffectInterface} from "./PathImageEffect";

export interface PathImageLayerInterface {
    name: string;
    visible: boolean;
    paths: StrokePath[];
    effects: PathImageEffectInterface[];
}

export class PathImageLayer {
    name: string;
    visible: boolean = true;
    paths: StrokePath[] = [];
    effects: PathImageEffectInterface[] = [];

    constructor(serialized?: { name: string, visible?, paths?, effects? } | PathImageLayer | PathImageLayerInterface) {
        if (serialized) {
            if (serialized.name !== undefined) {
                this.name = serialized.name
            }
            if (serialized.visible !== undefined) {
                this.visible = serialized.visible;
            }
            if (serialized.paths !== undefined) {
                this.paths = [];
                serialized.paths.forEach((l) => {
                    this.paths.push(new StrokePath(l));
                })
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
        this.paths.forEach((path) => {
            this.effects.forEach((eff) => {
                path = eff.applyPath(path);
            })
            path.render(context);
        })
    }

    copy(src: PathImageLayer) {
        this.name = src.name;
        this.visible = src.visible;
        this.paths = [];
        src.paths.forEach((path: StrokePath) => {
            // this.paths.push(path.clone());
        });
        return this;
    }

    clone() {
        return ((new PathImageLayer()).copy(this));
    }

}