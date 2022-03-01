const countFreq = (i, arr, what = '1') => arr.reduce((a, line) => a + (line[i] == what), 0)
const invert = s => s.split('').reduce((a, n) => a + (n == '1' ? '0' : '1'), '')
const gamma = arr => arr[0].split('').reduce((a, v, i) => a += countFreq(i, arr) < arr.length/2 ? '0' : '1')

const processArr = (inv = false, arr = input.slice(), bitId = 0) => {
    while (arr.length-1) {
        let keeps = (inv ^ countFreq(bitId, arr) < arr.length/2) ? '0' : '1';
        arr = arr.filter(line => line[bitId] == keeps);
        bitId++;
    }
    return arr[0];
}

console.log(parseInt(gamma(input), 2) * parseInt(invert(gamma(input)), 2));
console.log(parseInt(processArr(), 2) * parseInt(processArr(true), 2));