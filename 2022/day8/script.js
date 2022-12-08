let map = input.split("\n").map(l => l.split('').map(Number)),
    size = map.length,
    dirs = [[0,1], [0,-1], [1,0], [-1,0]];

const part1 = () => {
    let map2 = Array.from({length: size}, () => []); 

    const markDir = (x, y, vx, vy, max = map[y][x]) => {
        while (x >= 0 && y >= 0 && x < size && y < size) {
            if (map[y][x] > max) map2[y][x] = 1;
            max = Math.max(max, map[y][x]);
            x += vx; y += vy;
        }
    }

    for (let n = 1; n < size-1; n++) dirs.map(d => markDir(
            !d[0] ? n : (d[0] == 1 ? 0 : size-1),
            !d[1] ? n : (d[1] == 1 ? 0 : size-1), ...d
        ))

    return size*4-4 + map2.flat().length;
}

const visDir = (x, y, vx, vy, h = map[y][x], res = 0) => {
    x += vx; y += vy;
    while (x >= 0 && y >= 0 && x < size && y < size) {
        res++;
        if (map[y][x] >= h) break;
        x += vx; y += vy;
    }
    return res;
}

const part2 = () => Math.max(...map.map((r, y) => r.map((v, x) => dirs.reduce((a, d) => a*visDir(x,y, ...d), 1))).flat())

console.log('part 1', part1());
console.log('part 2', part2());