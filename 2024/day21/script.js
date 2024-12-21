const init = input => input.split('\n')

const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const DIRS2 = ['^', '>', 'v', '<'];
const numpad = [['#', '#', '#', '#', '#'], ['#', '7', '8', '9', '#'], ['#', '4', '5', '6', '#'], ['#', '1', '2', '3', '#'], ['#', '#', '0', 'A', '#'], ['#', '#', '#', '#', '#']];
const dirpad = [['#', '#', '#', '#', '#'], ['#', '#', '^', 'A', '#'], ['#', '<', 'v', '>', '#'], ['#', '#', '#', '#', '#']];

const findAllMinPaths = (map, startVal, endVal) => {
    let start = [];
    map.forEach((row, y) => row.forEach((v, x) => {
        if (v == startVal) start = [x, y];
    }))
    let stack = [{p: start, path: [], cost: 0}], cur, seen = {}, paths = [], endPos;
    let minCost = Infinity;

    if (map[start[1]][start[0]] == endVal) return ['A'];

    while (cur = stack.shift()) {
        if (cur.dirId !== undefined) cur.path.push(DIRS2[cur.dirId]);
        if (map[cur.p[1]][cur.p[0]] === endVal) {
            endPos = cur.p.slice();
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

        DIRS.forEach((d, dirId) => {
            let p = [cur.p[0]+d[0], cur.p[1]+d[1]];
            if (map[p[1]][p[0]] == '#') return true;
            stack.push({
                path: cur.path.slice(),
                p: p,
                dirId: dirId,
                cost: cur.cost + 1
            })
        })
    }
    
    return paths.map(p => p.join('')+'A');
}

const execute = (map, code, depth, memo = {}) => {
    let k = code + '_' + depth;
    if (memo[k] !== undefined) return memo[k];

    let curPos = 'A', length = 0;
    
    code.split('').forEach(nextPos => {
        let paths = findAllMinPaths(map, curPos, nextPos);
        if (depth == 0) {
            length += paths[0].length;
        } else {
            length += Math.min(...paths.map(path => execute(dirpad, path, depth-1, memo)));
        }
        curPos = nextPos;
    })

    memo[k] = length;
    return length;
}

const run = (codes, robots = 2) => codes.reduce((res, code) => res + parseInt(code)*execute(numpad, code, robots), 0)

console.log('p1', run(init(input)))
console.log('p2', run(init(input), 25))

