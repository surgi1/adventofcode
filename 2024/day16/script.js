const init = input => input.split("\n").map(line => line.split(''))

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const run = (map, p2 = false) => {
    let start = [0, 0, 0], // s, y, dirId, cost
        end = [0,0];
    
    map.forEach((row, y) => row.forEach((v, x) => {
        if (v == '#') return true;
        if (v == 'S') start = [x, y, 0];
        if (v == 'E') end = [x, y];
        map[y][x] = '.';
    }))

    const findMinCost = (start, end) => {
        let stack = [{p: start, cost: 0}], cur, seen = {};

        let minCost = Infinity;
        while (cur = stack.shift()) {
            if (cur.p[0] == end[0] && cur.p[1] == end[1]) {
                if (cur.cost < minCost) minCost = cur.cost;
                continue;
            }

            let k = cur.p.join('_');
            if (seen[k] < cur.cost) continue;
            seen[k] = cur.cost;

            let curD = DIRS[cur.p[2]];
            DIRS.forEach((d, dirId) => {
                if (d[0] == -curD && d[1] == -curD[1]) return true; // no turns back
                let p = [cur.p[0]+d[0], cur.p[1]+d[1], dirId];
                if (map[p[1]][p[0]] == '#') return true;
                stack.push({
                    p: p,
                    cost: cur.cost + (p[2] == cur.p[2] ? 1 : 1001)
                })
            })
        }
        return minCost;
    }

    const findAllMinPaths = (start, end, minCost) => {
        let stack = [{p: start, path: [start], cost: 0}], cur, seen = {}, paths = [];
        while (cur = stack.shift()) {
            if (cur.p[0] == end[0] && cur.p[1] == end[1]) {
                if (cur.cost == minCost) paths.push(cur.path);
                continue;
            }

            let k = cur.p.join('_');
            if (seen[k] < cur.cost) continue;
            seen[k] = cur.cost;
            if (cur.cost > minCost) continue;

            let curD = DIRS[cur.p[2]];
            DIRS.forEach((d, dirId) => {
                if (d[0] == -curD && d[1] == -curD[1]) return true; // no turns back
                let p = [cur.p[0]+d[0], cur.p[1]+d[1], dirId];
                if (map[p[1]][p[0]] == '#') return true;
                stack.push({
                    path: [...cur.path, [p[0], p[1]]],
                    p: p,
                    cost: cur.cost + (p[2] == cur.p[2] ? 1 : 1001)
                })
            })
        }
        return paths;
    }

    let minCost = findMinCost(start, end);

    if (!p2) return minCost; // p1

    let minPaths = findAllMinPaths(start, end, minCost);

    let o = {};
    minPaths.forEach(path => path.forEach(p => {
        let k = p.join('_');
        o[k] = 1;
    }))

    return Object.keys(o).length;
}

console.log('p1', run(init(input)));
console.log('p2', run(init(input), true));
