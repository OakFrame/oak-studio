import {PathImageLayer} from "./PathImageLayer"
import {StrokePath} from "./StrokePath";
import {Vec2} from "../math/Vec2";
import {PathImageActionInterface} from "./PathImageActionInterface";

export class PathImage {

    layercount: number = 2;
    layers: PathImageLayer[] = [new PathImageLayer({name: "Background"}), new PathImageLayer({name: "Layer 1"})];

    private sprite:string;
    _history:PathImageActionInterface[] = [];

    constructor(serialized?: PathImage) {
        if (serialized) {
            this.layercount = serialized.layercount;
            if (Array.isArray(serialized.layers)) {
                serialized.layers.forEach((l) => {
                    this.layers.push(new PathImageLayer(l));
                })
            }
        }
    }

    render(context) {
        this.layers.forEach((layer) => {
            layer.render(context);
        });
    }

    addPathToLayer(stroke: StrokePath, layer?: number) {
        if (layer === null || layer === undefined || !this.layers[layer]) {
            layer = this.layers.length - 1;
        }

        this.layers[layer].paths.push(stroke);
    }

    newLayer() {
        this.layers.push(new PathImageLayer({name: `Layer ${this.layercount++}`}));
    }

    generateRenderContext(){
        let canvas:HTMLCanvasElement = document.createElement('canvas');
        let context = canvas.getContext('2d');


        let pos_min = (new Vec2()).set(100000,100000), pos_max = (new Vec2()).set(-100000,-100000);

        let w = 25, h = 25;

        this.layers.forEach((layer)=>{
            layer.paths.forEach((path)=>{
                path.strokes.forEach((stroke)=>{
                    pos_min.x = Math.min(pos_min.x,stroke.start.x-stroke.size);
                    pos_min.x = Math.min(pos_min.x,stroke.end.x-stroke.size);
                    pos_min.y = Math.min(pos_min.y,stroke.start.y-stroke.size);
                    pos_min.y = Math.min(pos_min.y,stroke.end.y-stroke.size);

                    pos_max.x = Math.max(pos_max.x,stroke.start.x+stroke.size);
                    pos_max.x = Math.max(pos_max.x,stroke.end.x+stroke.size);
                    pos_max.y = Math.max(pos_max.y,stroke.start.y+stroke.size);
                    pos_max.y = Math.max(pos_max.y,stroke.end.y+stroke.size);
                })
            })

            layer.paths.forEach((path)=>{
                path.strokes.forEach((stroke)=>{
                    stroke.start.sub(pos_min);
                    stroke.end.sub(pos_min);
                })
            })
        })

        if (pos_min.x < pos_max.x && pos_min.y < pos_max.y){
            w = (pos_max.x-pos_min.x);
            h = (pos_max.y-pos_min.y);
        }


        canvas.width = w;canvas.height = h;
        this.render(context);

        this.layers.forEach((layer)=>{

            layer.paths.forEach((path)=>{
                path.strokes.forEach((stroke)=>{
                    stroke.start.add(pos_min);
                    stroke.end.add(pos_min);
                })
            })
        })
        return canvas.toDataURL();
    }

    getImage():string{
        if (!this.sprite){
           // this.sprite = new Sprite(["/resource/image/"]);
            this.sprite = this.generateRenderContext();
            //console.log('got sprite image', this.sprite);
        }

        return this.sprite;
    }

}
