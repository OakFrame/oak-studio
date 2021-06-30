export class TimingProfiler {
    LOG: number[]
    TIMING_RESULTS: any[]
    TIMING_START: number;
    TIMING_TOTAL: number;
    CALCULATED_FPS: number[];

    begin() {
        this.TIMING_RESULTS = [];
        this.CALCULATED_FPS = [];
        this.TIMING_START = performance.now();
        this.TIMING_TOTAL = 0;
    }

    reset() {
        this.CALCULATED_FPS.push(performance.now() - this.TIMING_START);
        if (this.CALCULATED_FPS.length > 10) {
            this.CALCULATED_FPS.shift();
        }
        this.TIMING_START = performance.now();
        this.TIMING_RESULTS = [];
    }

    time(text, c) {
        this.TIMING_RESULTS.push({name: text, count: (performance.now() - this.TIMING_START), color: c});
        this.TIMING_START = performance.now();
    }

    render(surface) {

        let fps = 1;
        if (this.CALCULATED_FPS.length) {
            fps = 1000/(this.CALCULATED_FPS.reduce(function (sum, choice) {
                return sum + choice;
            }, 0) / this.CALCULATED_FPS.length);



        }

        this.TIMING_TOTAL = this.TIMING_RESULTS.reduce(function (sum, choice) {
            return sum + choice.count;
        }, 0);
        this.TIMING_RESULTS.push({name: "free", count: ((1000 / fps) - this.TIMING_TOTAL), color: "#88CF8E"});
        this.TIMING_TOTAL = this.TIMING_RESULTS.reduce(function (sum, choice) {
            return sum + choice.count;
        }, 0);

        let RAM = [];
        RAM[1] = -0.5 * Math.PI;
        RAM[0] = 1;

        surface.getContext().beginPath();
        surface.getContext().textBaseline = "bottom";
        surface.getContext().textAlign = "left";
        surface.getContext().font = `${8 * surface.getScaling()}px DM Sans`;
        surface.getContext().fillText(  `FPS : ${fps}`, 64, 290 );
        surface.getContext().fill();


        this.TIMING_RESULTS.forEach((result) => {
            RAM[2] = (result.count / this.TIMING_TOTAL) * 2 * Math.PI;
            surface.getContext().beginPath();
            surface.getContext().arc(164, 164, 100, RAM[1], RAM[1] + RAM[2]);
            RAM[1] += RAM[2];
            surface.getContext().lineTo(164, 164);
            surface.getContext().fillStyle = result.color;
            surface.getContext().fill();
            surface.getContext().beginPath();
         //   surface.getContext().font = `${6 * surface.getScaling()}px DM Sans`;
            surface.getContext().fillText(result.name + ": " + result.count + "ms", 64, 290 + (RAM[0] * 24));
            surface.getContext().fill();
            RAM[0] += 1;
        });
    }
}