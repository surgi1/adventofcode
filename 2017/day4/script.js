const arrayCmp = (a, b) => a.length === b.length && a.every(v => b.includes(v))
const validate = (cmpFnc) => input.split('\n').filter(line => {
    let tmp = line.split(' ');
    return !tmp.some((a, i) => tmp.filter((b, j) => i !== j).some(b => cmpFnc(a, b)))
}).length

console.log('p1', validate((a, b) => a === b));
console.log('p2', validate((a, b) => arrayCmp(a.split(''), b.split(''))));