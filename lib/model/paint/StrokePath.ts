import {PaintStroke} from "./PaintStroke";

export class StrokePath {
    name: string;
    strokes: PaintStroke[] = [];
    visible: boolean = true;

    constructor(serialized?:StrokePath) {
        if (serialized){
            this.name = serialized.name;
            this.visible = serialized.visible;
            this.strokes = [];
            if (serialized.strokes){
                serialized.strokes.forEach((stroke)=>{
                    this.strokes.push(new PaintStroke(stroke));
                })
            }
        }
    }

    render(context) {
        if (!this.visible) {
            return
        }
        this.strokes.forEach((stroke) => {
            stroke.render(context);
        })
    }

    addStroke(stroke) {
        this.strokes.push(stroke);
    }

    copy(src: StrokePath){
        this.name = src.name;
        this.visible = src.visible;
        this.strokes = []; src.strokes.forEach((stroke) => {
            this.strokes.push(stroke.clone());
        });
        return this;
    }

    clone(){
        return ((new StrokePath()).copy(this));
    }
}