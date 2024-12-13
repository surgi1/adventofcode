const init = input => input.split("\n").map(line => line.split(''))

// clockwise
const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const FENCES_STARTS = [[0, 0], [1, 0], [1, 1], [0, 1]];
const FENCES_ENDS = [[1, 0], [1, 1], [0, 1], [0, 0]];

const run = (map, p2 = false) => {
    const offMap = (x, y) => x < 0 || y < 0 || x >= cols || y >= rows;

    let rows = map.length, cols = map[0].length, res = 0;
    let checked = map.map(row => row.slice().fill(0));

    const floodfill = (sx, sy) => {
        let resMap = map.map(row => row.slice().fill(0));
        let stack = [[sx, sy]], v = map[sy][sx], cur;
        while (cur = stack.pop()) {
            let [x, y] = cur;
            if (resMap[y][x] == 1) continue;
            resMap[y][x] = 1;
            DIRS.forEach(([dx, dy]) => {
                let nx = x+dx, ny = y+dy;
                if (offMap(nx, ny)) return true;
                if (resMap[ny][nx] == 1) return true;
                if (map[ny][nx] != v) return true;
                stack.push([nx, ny]);
            })
        }
        return resMap;
    }

    map.forEach((row, y) => row.forEach((v, x) => {
        if (checked[y][x] == 1) return true;
        
        let regionMap = floodfill(x, y); // floodfill from x, y
        let area = 0, perimeter = 0, fences = []; // fences in from, to format
        regionMap.forEach((rrow, ry) => rrow.forEach((rv, rx) => {
            if (rv == 0) return true;
            checked[ry][rx] = 1;
            area++;
            DIRS.forEach(([dx, dy], d) => {
                let nx = rx+dx, ny = ry+dy;
                if (offMap(nx, ny) || regionMap[ny][nx] !== 1) {
                    perimeter++;
                    fences.push([
                        [rx+FENCES_STARTS[d][0], ry+FENCES_STARTS[d][1]],
                        [rx+FENCES_ENDS[d][0], ry+FENCES_ENDS[d][1]]
                    ])
                }
            })
        }))

        // chunk fences into straight segments; this works because of the way we were adding fences;
        let segments = [];
        fences.forEach((f, fi) => {
            let df = [f[1][0] - f[0][0], f[1][1] - f[0][1]];
            let found = false;
            segments.some((seg, segId) => seg.some(s => {
                let ds = [s[1][0] - s[0][0], s[1][1] - s[0][1]];
                if (ds[0] != df[0] || ds[1] != df[1]) return false;
                if ((s[0][0] == f[1][0] && s[0][1] == f[1][1]) || (s[1][0] == f[0][0] && s[1][1] == f[0][1])) {
                    found = segId;
                    return true;
                }
                if (found !== false) return true;
            }))
            if (found !== false) segments[found].push(f); else segments.push([f]);
        })
        res += p2 ? area*segments.length : area*perimeter;
    }))
    return res;
}

console.log('p1', run(init(input)));
console.log('p2', run(init(input), true));
