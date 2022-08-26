import {arrayGetAverage} from "./Utils";

export class SequentialTimingEstimator {
    samples: number[] = [];

    add(time: number) {
        this.samples.push(time);
    }

    getChallengeMap() {
        let map = [];

        let lowest_value = Infinity;
        let highest_value = -Infinity;

        this.samples.forEach((sample) => {
            lowest_value = Math.min(lowest_value, sample);
            highest_value = Math.max(highest_value, sample);
        });

        for (let i = lowest_value; i > 1; i--) {
            let data = {
                periodic: i,
                periodicPerSample: [],
                periodicModuloSample: [],
                changePerSample: [],
                differencePerSample: [],
                average: Infinity,
                averageChangePerSample: Infinity,
                averageDifferencePerSample: Infinity,
                averageModuloPerSample:Infinity
            };
            this.samples.forEach((sample) => {
                data.periodicPerSample.push((sample / i));
                data.periodicModuloSample.push((sample) % i);
            });
            let prev = data.periodicPerSample[0];
            data.periodicPerSample.forEach((sample) => {
                let change = (sample - prev);
                data.changePerSample.push(change);
                prev = sample;
            });

            data.changePerSample.shift();
            let last_sample = data.changePerSample[0];
            data.changePerSample.forEach((sample) => {
                let change = Math.abs(sample - last_sample);
                data.differencePerSample.push(change);
                last_sample = sample;
            });
            data.differencePerSample.shift();
            data.average = arrayGetAverage(data.changePerSample)
            data.averageChangePerSample = arrayGetAverage(data.changePerSample)
            data.averageDifferencePerSample = arrayGetAverage(data.differencePerSample)
            data.averageModuloPerSample = arrayGetAverage(data.periodicModuloSample)
            map.push(data);
        }


        return map;
    }

    getEstimate() {

        let map = this.getChallengeMap();

        let highest_periodic;

        map.reverse().forEach(periodic_sample => {
            if (!highest_periodic || (
                periodic_sample.periodic > highest_periodic.periodic
                && periodic_sample.averageDifferencePerSample <= highest_periodic.averageDifferencePerSample
                && periodic_sample.averageChangePerSample <= highest_periodic.averageChangePerSample
                && periodic_sample.averageModuloPerSample <= highest_periodic.averageModuloPerSample
            )) {
                highest_periodic = periodic_sample;
            }
        })

        return highest_periodic;
    }
}
