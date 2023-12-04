
let pts = input.split("\n").map((l, i) => ({id: i, pos: l.match(/\d+/g).map(Number), inf: false}));

let minx = Math.min(...pts.map(o => o.pos[0]));
let maxx = Math.max(...pts.map(o => o.pos[0]));
let miny = Math.min(...pts.map(o => o.pos[1]));
let maxy = Math.max(...pts.map(o => o.pos[1]));

let map = Array.from({length: maxy+1}, () => Array(maxx+1).fill(999));

const mdist = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

const part1 = () => {
    for (let y = miny; y <= maxy; y++) {
        for (let x = minx; x <= maxx; x++) {
            let dists = pts.map(p => ({id: p.id, dist: mdist(p.pos, [x, y])})).sort((a, b) => a.dist-b.dist);
            if (dists[0].dist != dists[1].dist) map[y][x] = dists[0].id;
            if (x == minx || x == maxx || y == miny || y == maxy) pts[dists[0].id].inf = true;
        }
    }

    let fmap = map.flat();

    return pts.filter(o => o.inf === false).map(o => fmap.filter(v => v == o.id).length).sort((a, b) => b-a)[0];
}

console.log('p1', part1());

let maxd = 10000;
let p2 = 0;
for (let y = miny; y <= maxy; y++)
    for (let x = minx; x <= maxx; x++)
        if (pts.map(p => mdist(p.pos, [x, y])).reduce((a, v) => a+v, 0) <= maxd) p2++

console.log('p2', p2);