import {Vec2} from "../math/Vec2";

export class JitterFactory {
    jitterIdx: Vec2[] = [];
    constructor() {
        window.setInterval(()=>{
            this.updateJitters();
        },220)
    }

    updateJitters(){
        this.jitterIdx.forEach((v)=>{
          //  if (Math.random() > 0.96) {
                v.random();//.mulI(10);
          //  }
        })
    }

    getJitterForIdx(idx){
        if (!this.jitterIdx[idx]){
                this.jitterIdx.push((new Vec2()).random());
        }
        return this.jitterIdx[idx]||(new Vec2());
    }
}
