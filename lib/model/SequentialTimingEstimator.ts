export class SequentialTimingEstimator{
    samples: number[] = [];

    add(time:number){
        this.samples.push(time);
    }
    getChallengeMap(){
        let map = [];

        let lowest_value = Infinity;
        let highest_value = -Infinity;

        this.samples.forEach((sample)=>{
            lowest_value = Math.min(lowest_value,sample);
            highest_value = Math.max(highest_value,sample);
        });

        for (let i=highest_value;i>=1;i++){

        }



        return map;
    }

    getEstimate(){
        return this.getChallengeMap();
    }
}
