const init = input => input.split("\n").map(line => line.match(/\d+/g).map(Number));

const run = (data, p1 = true) => {
    let cols = [0, 1].map(i => data.map(row => row[i]).sort((a, b) => a-b));
    return cols[0].reduce((res, v, i) => res + (p1 ? Math.abs(v-cols[1][i]) : v*cols[1].filter(n => n == v).length), 0);
}

console.log('p1', run(init(input)));
console.log('p2', run(init(input), false));
