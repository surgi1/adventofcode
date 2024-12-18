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

const run1 = (bytes, from = 0, to = 1024, cols = 71, rows = 71) => {
    let dmap = distanceMap(constructGrid(bytes.slice(from, to), cols, rows), [0,0]);
    return dmap[rows-1][cols-1];
}

const run = (bytes, cols = 71, rows = 71) => {
    let int = [0, bytes.length];
    while (int[1] - int[0] > 1) {
        let half = Math.floor(int[0] + (int[1]-int[0])/2);
        let res = run1(bytes, 0, half, cols, rows);
        if (res === Infinity) int[1] = half; else int[0] = half;
    }
    return bytes[int[0]].join(',');
}

console.log('p1', run1(init(input)))
console.log('p2', run(init(input)))
