let gals = [], exp = [[], []];

let mdist = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

let map = input.split("\n").map((line, y) => line.split('').map((v, x) => {
    if (v == '#') gals.push([x, y]);
    return v;
}))

for (let y = 0; y < map.length; y++)
    if (!map[y].includes('#')) exp[1].push(y);

for (let x = 0; x < map[0].length; x++) 
    if (!map.reduce((a, v, i) => a + v[x], '').includes('#')) exp[0].push(x);

const dists = mult => {
    let sum = 0;
    for (let i = 0; i < gals.length-1; i++) {
        for (let j = i+1; j < gals.length; j++) {
            let d = mdist(gals[i], gals[j]);
            // add up mult-times the crossed expanding columns and rows
            [0, 1].map(coord => {
                let min = Math.min(gals[i][coord], gals[j][coord]);
                let max = Math.max(gals[i][coord], gals[j][coord]);
                d += exp[coord].filter(o => o > min && o < max).length * (mult-1)
            })
            sum += d;
        }
    }
    return sum;
}

console.log('p1', dists(2));
console.log('p2', dists(1000000));
