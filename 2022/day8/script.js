let map = input.split("\n").map(l => l.split('').map(Number));
let size = map.length;

const part1 = () => {
    let map2 = input.split("\n").map(l => l.split('').map(Number));

    const checkDir = (x, y, vx, vy) => {
        let max = map[y][x];
        x += vx; y += vy;
        while (true) {
            if (x < 0 || y < 0 || x >= size || y >= size) break;
            if (map[y][x] > max) map2[y][x] = '@';
            max = Math.max(max, map[y][x]);
            x += vx; y += vy;
        }
    }

    for (let n = 1; n < size-1; n++) {
        checkDir(n, 0, 0, 1);
        checkDir(n, size-1, 0, -1);
        checkDir(0, n, 1, 0);
        checkDir(size-1, n, -1, 0);
    }

    return size*4-4 + map2.flat().filter(e => e == '@').length;
}

const part2 = () => {
    const dist = (x, y, vx, vy) => {
        let h = map[y][x], res = 0;
        x += vx; y += vy;
        while (true) {
            if (x < 0 || y < 0 || x >= size || y >= size) break;
            res++;
            if (map[y][x] >= h) break;
            x += vx; y += vy;
        }
        return res;
    }

    return Math.max(...map.map((r, y) => r.map((v, x) => dist(x, y, 1, 0)*dist(x, y, 0, 1)*dist(x, y, -1, 0)*dist(x, y, 0, -1))).flat())
}

console.log('part 1', part1());
console.log('part 2', part2());