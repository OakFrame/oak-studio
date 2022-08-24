import {PathImageLayer} from "./PathImageLayer";
import {PathImage} from "./PathImage";
import {StrokePath} from "./StrokePath";

export interface PathImageActionInterface {

    apply(PathImage)

    undo(PathImage)
}

export class PathImageActionLayerAddPath implements PathImageActionInterface {

    public path: StrokePath;
    public index: number;
    public layer: number;

    apply(pi: PathImage) {
        pi.addPathToLayer(this.path, this.layer);
        this.index = pi.layers[this.layer].paths.length - 1;
    }

    undo(pi: PathImage) {
        pi.layers[this.layer].paths.splice(this.index, 1);
    }

}

export class PathImageActionAddLayer implements PathImageActionInterface {

    public index: number;

    apply(pi: PathImage) {
        pi.newLayer();
        this.index = pi.layers.length - 1;
    }

    undo(pi: PathImage) {
        pi.layers.splice(this.index, 1);
    }

}


export class PathImageActionDeleteLayer implements PathImageActionInterface {

    public index: number;
    public layer: PathImageLayer;

    apply(pi: PathImage) {
        this.layer = pi.layers.splice(this.index, 1)[0];
    }

    undo(pi: PathImage) {
        pi.layers.splice(this.index, 0, this.layer);
    }

}

export class PathImageActionDeletePath implements PathImageActionInterface {

    public pathIndex: number;
    public layerIndex: number;
    public pathData;

    apply(pi: PathImage) {
        this.pathData = pi.layers[this.layerIndex].paths.splice(this.pathIndex, 1)[0];
    }

    undo(pi: PathImage) {
        pi.layers[this.layerIndex].paths.splice(this.pathIndex, 0, this.pathData);
    }

}

export class PathImageActionLayerRename implements PathImageActionInterface {

    // TODO implement saving layer names instead of updating name on field update

    public layerIndex: number;
    public oldName: string;
    public newName: string;
    apply(pi: PathImage) {
        pi.layers[this.layerIndex].name = this.newName;
    }

    undo(pi: PathImage) {
        pi.layers[this.layerIndex].name = this.oldName;

    }

}
