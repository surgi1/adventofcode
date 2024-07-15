const transpose = arr => arr[0].map((col, i) => arr.map(row => row[i]))

const freqAnal = (arr, map = new Map()) => {
    arr.forEach(v => map.set(v, (map.get(v) ?? 0) + 1))
    return [...map].sort((a, b) => a[1]-b[1]);
}

let table = transpose(input.split('\n').map(line => line.split('')))

console.log('p1', table.reduce((s, row) => s + freqAnal(row).pop()[0], ''));
console.log('p2', table.reduce((s, row) => s + freqAnal(row).shift()[0], ''))