import {Neuron} from "./Neuron";

export class Layer{
    neurons:Neuron[];
    constructor(numNeurons,numInputs){
        this.neurons = new Array(numNeurons);

        for (var i = 0; i < this.neurons.length; i++) {
            this.neurons[i] = new Neuron(numInputs);
        }
    }

    process(inputs){
        return this.neurons.map(function(neuron){
            return neuron.process(inputs)
        });
    }
}

