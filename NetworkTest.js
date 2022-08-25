import { Network } from "./lib/model/neural/Network";
let network = new Network();
network.addLayer(2, 2);
network.addLayer(16);
network.addLayer(1);
let training_data = [
    [[-1, -1], [-1]],
    [[1, -1], [1]],
    [[-1, 1], [1]],
    [[1, 1], [-1]],
    /* [[0,0],[0]],
     [[1,0],[1]],
     [[0,1],[1]],
     [[1,1],[0]]*/
];
network.train(training_data);
console.log(network.process([0, 1]), 1);
console.log(network.process([1, 0]), 1);
console.log(network.process([0, 0]), 0);
console.log(network.process([1, 1]), 0);
