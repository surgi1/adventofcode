const init = input => input.split('\n').map(line => line.split('').map(Number))

const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const scores = (map, sx, sy, p2 = false) => {
    let res = {}, count = 0;
    let stack = [[sx, sy]], cur, cols = map[0].length, rows = map.length;

    const offMap = (x, y) => x < 0 || y < 0 || x >= cols || y >= rows;

    while (cur = stack.pop()) {
        let [x, y] = cur;
        let v = map[y][x];
        if (v == 9) {
            res[cur.join('_')] = 1;
            count++;
            continue;
        }
        DIRS.forEach(([dx, dy]) => {
            let nx = x+dx, ny = y+dy;
            if (offMap(nx, ny)) return true;
            if (map[ny][nx] != v+1) return true;
            stack.push([nx, ny]);
        })
    }

    return p2 ? count : Object.values(res).length
}

const run = (map, p2) => map.reduce((res, row, y) => res + row.reduce((a, v, x) => a + (v == 0 ? scores(map, x, y, p2) : 0), 0) , 0)

console.log('p1', run(init(input)));
console.log('p2', run(init(input), true));
