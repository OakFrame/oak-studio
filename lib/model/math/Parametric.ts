export function bias(bias:number, real:number) {
    return real / ((1 / bias - 2) * (1 - real) + 1);
}