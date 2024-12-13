let gals = [], exp = [[], []];

const mdist = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
const gdist = (g1, g2, mult) => [0, 1].reduce((a, c) => a + exp[c].filter(o => o > Math.min(g1[c], g2[c]) && o < Math.max(g1[c], g2[c])).length * (mult-1), mdist(g1, g2))
const dists = mult => gals.map((g1, i) => gals.map((g2, j) => (j > i) * gdist(g1, g2, mult))).flat().reduce((a, v) => a+v, 0)

let map = input.split("\n").map((line, y) => line.split('').map((v, x) => {
    if (v == '#') gals.push([x, y]);
    return v;
}))

map.forEach((row, y) => (!row.includes('#')) && exp[1].push(y))
map[0].forEach((o, x) =>  (!map.map(v => v[x]).includes('#')) && exp[0].push(x))

console.log('p1', dists(2));
console.log('p2', dists(1000000));
