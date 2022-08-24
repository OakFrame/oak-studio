import {Vec2} from "../math/Vec2";
import {RGBA} from "../RGB";

export enum PaintStrokeSource {
    USER = 0,
    REMOVED = 1,
    GENERATED = 2
}

export class PaintStroke {
    start: Vec2 = new Vec2();
    end: Vec2 = new Vec2();
    size: number = 1;
    color: RGBA = new RGBA();
    brush: number = 0;
    angle: Vec2 = new Vec2();
    source: PaintStrokeSource;

    constructor(serialized?) {
        if (serialized){
            this.start.set(serialized.start.x, serialized.start.y);
            this.end.set(serialized.end.x, serialized.end.y);
            this.size = serialized.size;
            this.color.copy(serialized.color);
            this.brush = serialized.brush;
            this.angle.copy(serialized.angle);
            this.source = serialized.source;
        }
    }


    clone() {
        let ps = new PaintStroke();
        ps.start.copy(this.start);
        ps.end.copy(this.end);
        ps.size = this.size;
        ps.color = this.color.clone();
        ps.brush = this.brush;
        ps.angle.copy(this.angle);
        ps.source = this.source;
        return ps;
    }

    render(context) {
        context.lineCap = "round";
        context.strokeStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.color.a / 255 + ')';
        context.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.color.a / 255 + ')';
        context.lineWidth = this.size;

        let jitter = new Vec2(), jitter2 = new Vec2();

        switch (this.brush) {
            case 0: // pencil
                // jitter = new Vec2();// jitter.mulI(this.size / 10);
                //jitter2 = new Vec2();//jitter2.mulI(this.size / 10);
                context.beginPath();
                context.moveTo((this.start.x - (0)) + jitter.x, (this.start.y - (0)) + jitter.y);
                context.lineTo((this.end.x) + jitter2.x, (this.end.y) + jitter2.y);
                context.stroke();
                context.closePath();
                break;

            case 1:

                // jitter = jitter.mulI(this.size / 2);
                //jitter2 = jitter2.mulI(this.size / 2);

                let b1 = this.start.clone().add(this.angle.clone().mulI(this.size)).add(jitter);
                let b2 = this.start.clone().add(this.angle.clone().mulI(this.size).rotate(180)).add(jitter);

                let b3 = this.end.clone().add(this.angle.clone().mulI(this.size)).add(jitter2);
                let b4 = this.end.clone().add(this.angle.clone().mulI(this.size).rotate(180)).add(jitter2);

                context.beginPath();
                context.moveTo(b1.x, b1.y);
                context.lineTo(b2.x, b2.y);
                context.lineTo(b4.x, b4.y);
                context.lineTo(b3.x, b3.y);

                context.closePath();
                context.fill();

                context.beginPath();
                context.moveTo(b1.x, b1.y);
                context.lineTo(b2.x, b2.y);
                context.stroke();

                context.beginPath();
                context.moveTo(b2.x, b2.y);
                context.lineTo(b4.x, b4.y);
                context.stroke();

                context.beginPath();
                context.moveTo(b3.x, b3.y);
                context.lineTo(b4.x, b4.y);
                context.stroke();

                context.beginPath();
                context.moveTo(b3.x, b3.y);
                context.lineTo(b1.x, b1.y);
                context.stroke();
                context.closePath();
                break;

            case 2:
                context.globalCompositeOperation = 'destination-out';
                context.strokeStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.color.a / 255 + ')';

                context.beginPath();
                context.moveTo((this.start.x - (0)) + jitter.x, (this.start.y - (0)) + jitter.y);
                context.lineTo((this.end.x) + jitter2.x, (this.end.y) + jitter2.y);
                context.stroke();
                context.closePath();

                context.globalCompositeOperation = 'source-over';

                /*canvas_cover_context.globalCompositeOperation = 'destination-out';
                canvas_cover_context.strokeStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.color.a / 255 + ')';

                canvas_cover_context.beginPath();
                canvas_cover_context.moveTo((this.start.x - (0)) + jitter.x, (this.start.y - (0)) + jitter.y);
                canvas_cover_context.lineTo((this.end.x) + jitter2.x, (this.end.y) + jitter2.y);
                canvas_cover_context.stroke();
                canvas_cover_context.closePath();

                canvas_cover_context.globalCompositeOperation = 'source-over';*/
                break;

        }

    }
}