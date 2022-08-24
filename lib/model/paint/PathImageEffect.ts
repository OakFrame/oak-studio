import {PathImageLayer} from "./PathImageLayer";
import {StrokePath} from "./StrokePath";

export interface PathImageEffectInterface {
    getControlsElement: () => HTMLElement;
    applyLayer: (PathImageLayer) => PathImageLayer;
    applyPath: (StrokePath) => StrokePath;
    strength: number;
}