const countFreq = (i, arr, what = '1') => arr.reduce((a, line) => a + (line[i] == what), 0)
const invert = s => s.split('').reduce((a, n) => a + (n == '1' ? '0' : '1'), '')

const p1 = () => {
    let len = input[0].length, gamma = '';
    for (let i = 0; i < len; i++) gamma += (countFreq(i, input) < input.length/2 ? '0' : '1');
    return parseInt(gamma, 2) * parseInt(invert(gamma), 2);    
}

const processArr = (inv = false) => {
    let arr = input.slice(), bitId = 0, keeps = '';
    while (arr.length > 1) {
        if (countFreq(bitId, arr) < arr.length/2) keeps = '0'; else keeps = '1';
        if (inv) keeps = invert(keeps);
        let tmp = [];
        arr.map(line => {
            if (line[bitId] == keeps) tmp.push(line);
        })
        arr = tmp.slice();
        bitId++;
    }
    return arr[0];
}

const p2 = () => parseInt(processArr(), 2) * parseInt(processArr(true), 2)

console.log(p1());
console.log(p2());