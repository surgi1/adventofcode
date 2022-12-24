// the trick: the whole map state will repeat itself after lcm(h-2, w-2)
// let's precompute all those states (blizMaps)
// then it is simple bfs with tracing visited triplets of x, y and time

let map = [], blizMaps = [], t;

const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);
const negMod = (a, b) => (a+b*100000000) % b;

const dirs = [
  [-1, 0],
  [0, -1],
  [0, 0],
  [1, 0],
  [0, 1]
];

const init = input => {
    map = input.split("\n").map(l => l.split(''))

    let blizMapH = map.length-2,
        blizMapW = map[0].length-2;
    
    blizMaps = Array.from({length: lcm(blizMapH, blizMapW)}, () => map.map(l => l.map(v => v == '#' ? 1 : 0 )) )

    map.map((l, y) => l.map((v, x) => blizMaps.map((bmap, t) => {
        if (v == '^') bmap[negMod(y-1-t, blizMapH) + 1][x] = 1;
        if (v == 'v') bmap[((y-1+t) % blizMapH) + 1][x] = 1;
        if (v == '>') bmap[y][((x-1+t) % blizMapW) + 1] = 1;
        if (v == '<') bmap[y][negMod(x-1-t, blizMapW) + 1] = 1;
    })))
}

const run = (start, end, t0) => {
    const k = p => p.x+'_'+p.y+'_'+ p.t % blizMaps.length;

    let paths = [{x: start.x, y: start.y, t: t0}];
    let visited = new Set();

    while (paths.length) {
        let p = paths.shift();

        if (visited.has(k(p))) continue;
        visited.add(k(p));

        if (p.y == end.y && p.x == end.x) return p.t;

        dirs.forEach(([dy, dx]) => {
            if (!blizMaps[(p.t+1) % blizMaps.length][p.y+dy]) return true;
            if (blizMaps[(p.t+1) % blizMaps.length][p.y+dy][p.x+dx] == 0) 
                paths.push({y: p.y+dy, x: p.x+dx, t: p.t+1})
        })
    }
}

init(input);

let start = {x: map[0].indexOf('.'), y: 0};
let end = {x: map[map.length-1].indexOf('.'), y: map.length-1};

t = run(start, end, 0);
console.log('part 1', t);

t = run(end, start, t);
t = run(start, end, t);
console.log('part 2', t);