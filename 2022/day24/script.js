// the speed-up: do not compute blizzard map for each minute repeatedly
// simple bfs with tracing visited triplets of x, y and time

let map = [], blizMaps = [];

const dirs = [
  [-1,  0],
  [ 0, -1],
  [ 0,  0], // waiting
  [ 1,  0],
  [ 0,  1]];

const getBlizMap = t => {
    const safeMod = (a, b) => (a+b*100000000) % b;

    if (blizMaps[t]) return blizMaps[t];
    
    let h = map.length-2, w = map[0].length-2;
    let bmap = map.map(l => l.map(v => v == '#' ? 1 : 0 ));

    map.forEach((l, y) => l.forEach((v, x) => {
        if (v == '^') bmap[safeMod(y-1-t, h) + 1][x] = 1;
        if (v == 'v') bmap[((y-1+t) % h) + 1][x] = 1;
        if (v == '>') bmap[y][((x-1+t) % w) + 1] = 1;
        if (v == '<') bmap[y][safeMod(x-1-t, w) + 1] = 1;
    }))

    return blizMaps[t] = bmap;
}

const run = (start, end, t0) => {
    const key = p => p.x+'_'+p.y+'_'+ p.t;

    let paths = [{x: start.x, y: start.y, t: t0}], seen = new Set();
    while (paths.length) {
        let p = paths.shift(), k = key(p);
        
        if (seen.has(k)) continue;
        seen.add(k);
        
        if (p.y == end.y && p.x == end.x) return p.t;
        
        let bmap = getBlizMap(p.t+1);
        dirs.forEach(([dx, dy]) => bmap[p.y+dy] && bmap[p.y+dy][p.x+dx] == 0 && paths.push({y: p.y+dy, x: p.x+dx, t: p.t+1}))
    }
}

map = input.split("\n").map(l => l.split(''));

let start = {x: map[0].indexOf('.'), y: 0};
let end = {x: map[map.length-1].indexOf('.'), y: map.length-1};

let t = run(start, end, 0);
console.log('part 1', t);
console.log('part 2', run(start, end, run(end, start, t)));