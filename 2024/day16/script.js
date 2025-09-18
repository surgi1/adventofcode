const init = input => input.split("\n").map(line => line.split(''))

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const run = map => {
    let start = [0, 0, 0], // s, y, dirId, cost
        end = [0,0];
    
    map.forEach((row, y) => row.forEach((v, x) => {
        if (v == '#') return true;
        if (v == 'S') start = [x, y, 0];
        if (v == 'E') end = [x, y];
        map[y][x] = '.';
    }))

    const findAllMinPaths = (start, end) => {
        let stack = [{p: start, path: [], cost: 0}], cur, seen = {}, paths = [];
        let minCost = Infinity;
        while (cur = stack.shift()) {
            cur.path.push(cur.p[0]+'_'+cur.p[1]);
            if (cur.p[0] == end[0] && cur.p[1] == end[1]) {
                if (cur.cost < minCost) {
                    paths = [];
                    minCost = cur.cost;
                };
                if (cur.cost == minCost) paths.push(cur.path);
                continue;
            }

            let k = cur.p.join('_');
            if (seen[k] < cur.cost) continue;
            seen[k] = cur.cost;
            if (cur.cost > minCost) continue;

            let curD = DIRS[cur.p[2]];
            DIRS.forEach((d, dirId) => {
                if (d[0] == -curD[0] && d[1] == -curD[1]) return true; // no turns back
                let p = [cur.p[0]+d[0], cur.p[1]+d[1], dirId];
                if (map[p[1]][p[0]] == '#') return true;
                stack.push({
                    path: cur.path.slice(),
                    p: p,
                    cost: cur.cost + (p[2] == cur.p[2] ? 1 : 1001)
                })
            })
        }
        return [paths, minCost];
    }

    let [minPaths, minCost] = findAllMinPaths(start, end), o = {};
    minPaths.forEach(path => path.forEach(p => o[p] = 1));

    console.log('p1', minCost);
    console.log('p2', Object.keys(o).length);
}

run(init(input))
