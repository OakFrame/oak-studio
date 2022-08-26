import {arrayGetAverage} from "./Utils";

export class DeltaT {
    samples: number[] = [];
    target: number;

    constructor(targetFPS = 60) {
        this.target = targetFPS;
    }

    sample() {
        this.samples.push((performance && performance.now()) || (Date.now()));
        if (this.samples.length > this.target * 0.5) {
            this.samples.shift();
        }
    }

    getMSPerFrame() {
        if (this.samples.length <= 3) {
            return 1000 / this.target;
        }
        let frame_times = [];
        for (let i = 1; i < this.samples.length; i++) {
            frame_times.push(this.samples[i] - this.samples[i - 1]);
        }
        return arrayGetAverage(frame_times);
    }

    getFPS() {
        return parseFloat((1000 / this.getMSPerFrame()).toFixed(4));
    }

    getDeltaT() {
        return this.target / this.getFPS();
    }
}
