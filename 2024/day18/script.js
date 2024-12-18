const init = input => input.split("\n").map(line => line.split(',').map(Number));

const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];

// floodfill
const distanceMap = (map, from) => {
    const offMap = (x, y) => x < 0 || y < 0 || x >= cols || y >= rows;

    let cols = map[0].length, rows = map.length, cur;
    let filled = map.map(row => row.slice().fill(Infinity)),
        stack = [{
            pos: [...from],
            dist: 0
        }];

    while (cur = stack.shift()) {
        let [cx, cy] = cur.pos;

        if (filled[cy][cx] <= cur.dist) continue;
        filled[cy][cx] = cur.dist;

        DIRS.forEach(([dx, dy]) => {
            let [x, y] = [cx+dx, cy+dy];
            if (offMap(x, y)) return true;
            if (map[y][x] === 1) return true;
            stack.push({
                pos: [x, y],
                dist: cur.dist+1
            })
        })
    }
    return filled;
}

const constructGrid = (bytes, cols = 71, rows = 71) => {
    let map = Array.from({length: rows}, () => Array(cols).fill(0))
    bytes.forEach(([x, y]) => map[y][x] = 1);
    return map;
}

const run1 = (bytes, n = 1024, cols = 71, rows = 71) => {
    let map = constructGrid(bytes.slice(0, n), cols, rows)
    let dmap = distanceMap(map, [0,0]);
    return dmap[rows-1][cols-1];
}

const run = (bytes, n = 1024, cols = 71, rows = 71) => {
    while (n < bytes.length) {
        if (run1(bytes, n, cols, rows) == Infinity) break;
        n++;
    }
    return bytes[n-1].join(',');
}

console.log('p1', run1(init(input)))
console.log('p2', run(init(input)))
