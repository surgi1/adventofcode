const onesOnPos = (i, arr) => arr.filter(line => line[i] == '1').length
const gamma = arr => parseInt(arr[0].split('').reduce((a, v, i) => a += onesOnPos(i, arr) < arr.length/2 ? '0' : '1'), 2)

const processArr = (inv = false, arr = input.slice(), bitId = 0) => {
    while (arr.length-1) {
        let keeps = (inv ^ onesOnPos(bitId, arr) < arr.length/2) ? '0' : '1';
        arr = arr.filter(line => line[bitId] == keeps);
        bitId++;
    }
    return parseInt(arr[0], 2);
}

console.log(gamma(input) * (0xfff ^ gamma(input)));
console.log(processArr() * processArr(true));