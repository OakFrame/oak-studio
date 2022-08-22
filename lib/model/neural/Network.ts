import {Neuron} from "./Neuron";
import {Layer} from "./Layer";
import {MeanSquareErrors} from "../math/MSE";
import {Sum} from "../math/Sum";
import {TanhDerivative} from "../math/Tanh";

export class Network {
    layers: Layer[];
    iterations:number = 0;
    error:number = 1;
    errors: number[];

    constructor() {
        this.layers = [];
        this.errors = [];
    }

    process(inputs) {
        var outputs;

        this.layers.forEach(function (layer) {
            outputs = layer.process(inputs);
            inputs = outputs;
        });

        return outputs;
    }

    addLayer(numNeurons, numInputs?) {
        if (numInputs == null) {
            var previousLayer = this.layers[this.layers.length - 1];
            numInputs = previousLayer.neurons.length;
        }
        var layer = new Layer(numNeurons, numInputs);
        this.layers.push(layer);
    }

    train(examples, iterations=100000) { // Training with Back propagation algorithm

        if (examples.length === 0){
            return;
        }

        var outputLayer = this.layers[this.layers.length - 1]; // We make the difference between the output layer and the hidden layer
        var learningRate = 0.3;
        var errThreshold = 0.0000000001;

        for (var itr = 0 ; itr < iterations ; itr++){
            this.iterations++;
            for (var ex = 0 ; ex < examples.length ; ex++){ // Train the neural network for every example.
                var targets = examples[ex][1];
                var inputs = examples[ex][0];

                var outputs = this.process(inputs);

                // Let's start training the output layer
                for (var i = 0 ; i < outputLayer.neurons.length ; i++){
                    // Let's calculate the error for every neurons of the output layer.
                    var neuron = outputLayer.neurons[i];
                    neuron.error = targets[i] - outputs[i];
                    // Let's calculate the delta for every neurons of the output layer.
                    neuron.delta = TanhDerivative(neuron.lastOutput) * neuron.error;
                    // Done for the output layer.
                }

                // Moving on the hidden layers !
                for (var l = this.layers.length - 2 ; l >= 0 ; l--){

                    for (var i = 0 ; i < this.layers[l].neurons.length ; i++){ // For every neurons in that layer

                        var neuron = this.layers[l].neurons[i];

                        // Let's calculate the error for the neuron
                        // To do so, we need the next layer of the network
                        neuron.error = Sum(this.layers[l + 1].neurons.
                        map(function(n) { return Math.abs(n.weights[i] * n.delta) }))

                        // We have computed the error, let's calculate the delta

                        neuron.delta = TanhDerivative(neuron.lastOutput) * neuron.error;

                        for (var m = 0 ; m < this.layers[l+1].neurons.length; m++){ // For the neurons of the following layer
                            var nextNeur = this.layers[l+1].neurons[m];

                            for (var w = 0 ; w < nextNeur.weights.length ; w ++){ // Update the weights
                                nextNeur.weights[w] += learningRate * nextNeur.lastInputs[w] * nextNeur.delta;
                            }

                            nextNeur.bias += learningRate * nextNeur.delta;

                        }

                        // Done !
                    }

                }
            }

            var error = MeanSquareErrors(outputLayer.neurons.map(function(n) { return n.error }));
            this.errors.push(error);
            if (this.errors.length > 1000){
                this.errors.shift();
            }

            if (itr % 1000 == 0){
                console.log("Iteration : ",itr, " error : ",error);
                this.error = error;
            }

            this.error = Sum(this.errors)/this.errors.length;

            if (error < errThreshold){
                console.log("Stopped at iteration n°",itr, "error : ", error);
                return;
            }
        }
    }

    serialize() {
        return JSON.stringify(this);
    }

    deserialize(initialInput, serialstring) {
        var serialData = JSON.parse(serialstring);

        if (serialData) {
            this.layers.length = 0; // Empty any existing array

            // Initialize layers :
            this.addLayer(serialData.layers[0].neurons.length, initialInput);

            for (var l = 1; l < serialData.layers.length; l++) {
                this.addLayer(serialData.layers[l].neurons.length);
            }
            // Initialize neurons parameters for each neurons of each layers
            for (var i = 0; i < serialData.layers.length; i++) {
                for (var j = 0; j < serialData.layers[i].neurons.length; j++) {
                    this.layers[i].neurons[j].bias = serialData.layers[i].neurons[j].bias
                    this.layers[i].neurons[j].error = serialData.layers[i].neurons[j].error
                    this.layers[i].neurons[j].lastOutput = serialData.layers[i].neurons[j].lastOutput
                    this.layers[i].neurons[j].delta = serialData.layers[i].neurons[j].delta
                    // Take care of the weights
                    for (var w = 0; w < serialData.layers[i].neurons[j].weights.length; w++) {
                        this.layers[i].neurons[j].weights[w] = serialData.layers[i].neurons[j].weights[w];
                    }

                    // Take care of the lastInputs
                    this.layers[i].neurons[j].lastInputs = [];
                    for (var v = 0; v < serialData.layers[i].neurons[j].weights.length; v++) { // The neurons have never processed
                        this.layers[i].neurons[j].lastInputs.push(serialData.layers[i].neurons[j].lastInputs[v]);
                    }
                    // Done !
                }
            }
        } else {
            return false;
        }
    }
}
