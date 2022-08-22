export class FuzzyLayer {
    public input_weights;
    public bias;

    constructor(output_length?) {
        this.input_weights = [];
        this.bias = [];
        for (let i = 0; i < output_length || 0; i++) {
            this.bias[i] = Math.random() - Math.random();
        }
    }

    run(input) {
        let out = [];
        for (let b = 0; b < this.bias.length; b++) {
            out[b] = 0;
            for (let i = 0; i < input.length; i++) {
                if (!this.input_weights[b]) {
                    this.input_weights[b] = [];//Math.random() - Math.random();
                }
                if (!this.input_weights[b][i]) {
                    this.input_weights[b][i] = Math.random() - Math.random();
                }
                out[b] += ((input[i] * this.input_weights[b][i]));
            }
            out[b] = Math.tanh(this.bias[b] + out[b]);
        }
        return out;
    }

    mutate() {
        this.input_weights = this.input_weights.map((iw) => {
            return iw.map((v) => {
                if (Math.random() > 0.4) { // 60 Percent Chance to Stay the Same
                    return v;
                }
                if (Math.random() < 0.5) {
                    return v + 0.01;
                } else {
                    return v - 0.01;
                }
            });
        });

        this.bias = this.bias.map((v) => {
            if (Math.random() > 0.1) { // 90 Percent Chance to Stay the Same
                return v;
            }
            if (Math.random() < 0.5) {
                return v + 0.01;
            } else {
                return v - 0.01;
            }
        });
    }

    toJSON() {
        return {
            bias: this.bias,
            input_weights: this.input_weights
        }
    }

}

export class ANN {
    public layers;

    constructor() {
        this.layers = []
    }

    guess(inputs) {
        let o = this.layers[0].run(inputs);
        for (let i = 1; i < this.layers.length; i++) {
            o = this.layers[i].run(o);
        }
        return this.layers[this.layers.length - 1].run(o);
    }

    mutate() {
        this.layers.forEach((layer) => {
            layer.mutate();
        });
    }

    clone() {
        let ann = new ANN();
        this.layers.forEach((layer) => {
            let l = new FuzzyLayer();
            Array.prototype.push.apply(l.input_weights, layer.input_weights)
            Array.prototype.push.apply(l.bias, layer.bias)
            ann.layers.push(l);
        });
        return ann;
    }

    toJSON() {
        return {
            layers: this.layers.map((l) => {
                return l.toJSON()
            })
        };
    }

    fromJSON(ann) {
        this.layers = [];
        ann.layers.forEach((layer) => {
            let l = new FuzzyLayer();
            Array.prototype.push.apply(l.input_weights, layer.input_weights);
            Array.prototype.push.apply(l.bias, layer.bias)
            this.layers.push(l);
        });
    }

}