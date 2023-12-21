// p2 idea: since the whole row and line S is on is dots, it must be approximated by quadratic
// p2 observation: fully filled-out (sub) map will just oscilate between 2 states
// p2 observation: weird step number! 26501365 = 202300 * map.length + map.length/2
// reached(steps) grows quadraticly, with len = map.length we need to find reached(offset + i * len), offset is 65 in our case, i is integer
// we need to get to first 3 i's, then figure out the polynomial
// reached(steps) in my case as a fnc of i: i=0: 3703, i=1: 32957, i=2: 91379
// originally plugged this into https://www.dcode.fr/newton-interpolating-polynomial :shrug:
// later figured out we can use day9 and made the solution return actual result

const mod = (n, m) => ((n % m) + m) % m;

let pos = {};

const DS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const  D = { R: 0,   D: 1,   L: 2,    U: 3 };

const k = (x,y) => x+'_'+y;

let map = input.split("\n").map((line, y) => line.split('').map((v, x) => {
    if (v == 'S') {
        pos[k(x,y)] = [x, y, 1]
        return '.';
    }
    return v;
}))


// taken from day9
const diffs = row => row.map((v, i) => v - row[i - 1]).slice(1);
const run = arr => arr.map(step => {
    while (step.some(v => v !== 0)) {
        step = diffs(step);
        arr.push(step);
    }
    return arr.map(v => v[0]);
})

let len = map.length;

const step = pos => {
    let newPos = {};
    Object.values(pos).forEach(([x, y, v]) => {
        DS.forEach(([dx, dy]) => {
            if (map[mod(y+dy, len)][mod(x+dx, len)] == '.') newPos[k(x+dx,y+dy)] = [x+dx, y+dy];
        })
    })
    return newPos
}

let vals = [];

for (let i = 1; i <= 131*2+65; i++) {
    pos = step(pos);

    if (i == 64) console.log('p1', Object.keys(pos).length);

    if (i % 131 == 65) {
        vals.push(Object.keys(pos).length);
        console.log(i, Object.keys(pos).length);
    }
}

let ks = run([vals])[0];

console.log('polynom coeficients', ks);

let steps = (26501365 - 65) / 131; // 202300, map.length = 131

console.log('p2', ks[0] + ks[1]*steps + steps*(steps-1)*ks[2]/2);
