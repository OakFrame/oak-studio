import {describe} from 'mocha';
import {expect} from 'chai';
import {SequentialTimingEstimator} from "./SequentialTimingEstimator";

describe('SequentialTimingEstimator', () => {


    it('should be created', () => {

        let seq = new SequentialTimingEstimator();

        seq.add( 10 );
        seq.add( 20 );
        seq.add( 30 );

        expect(seq).not.equal(undefined);
        expect(seq.samples.length).equal(3);

    });

    it('return some value', () => {
        let seq = new SequentialTimingEstimator();

        seq.add( 10 );
        seq.add( 20 );
        seq.add( 30 );

        let map = seq.getChallengeMap();
        console.log(map);
        let periodic = seq.getEstimate();
        console.log(periodic);

        expect(periodic.periodic).equal(10);
    });


    it('return some value2 ', () => {
        let seq = new SequentialTimingEstimator();

        seq.add( 10 );
        seq.add( 21 );
        seq.add( 30 );

        let map = seq.getChallengeMap();
        console.log(map);
        let periodic = seq.getEstimate();
        console.log(periodic);

        expect(periodic.periodic).equal(10);

    });

    it('return some value2 ', () => {
        let seq = new SequentialTimingEstimator();

        seq.add( 100 );
        seq.add( 150 );
        seq.add( 200 );
        seq.add( 250 );
        seq.add( 300 );
        seq.add( 350 );

        let map = seq.getChallengeMap();
        console.log(map);
        let periodic = seq.getEstimate();
        console.log(periodic);

        expect(periodic.periodic).equal(50);

    });

    it('return some value3 ', () => {
        let seq = new SequentialTimingEstimator();

        for (let i = 0;i<100;i+=1) {
            seq.add(10001 + (i*52) );
        }

        let map = seq.getChallengeMap();
        //console.log(map);
        let periodic = seq.getEstimate();
        console.log(periodic);

        expect(periodic.periodic).equal(100);

    });

});
