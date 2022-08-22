import {Sigmoid} from "../math/Sigmoid";

export class Neuron {

    weights:number[];
    bias:number;
     lastInputs:number[];
     lastOutput:number;

    public error:number;
    public delta:number;

    constructor(numberInputs) {
        this.weights = new Array(numberInputs);
        this.bias = (Math.random()*0.6)+0.2;

        for (var i = 0; i < this.weights.length; i++) {
            this.weights[i] = (Math.random()*0.6)+0.2;
        }

    }

    process  (inputs){
        this.lastInputs = inputs;

        var sum = 0;

        for (var i = 0 ; i < inputs.length ; i++){
            sum += inputs[i] * this.weights[i];
        }

        sum += this.bias;
        this.lastOutput = Math.tanh(sum);
        return this.lastOutput
    }
}
