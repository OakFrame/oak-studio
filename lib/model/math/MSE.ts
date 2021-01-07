export function MeanSquareErrors(errors) {
    var sum = errors.reduce(function(sum, i) { return sum + i * i }, 0)
    return sum / errors.length
}