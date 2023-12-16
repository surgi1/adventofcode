const D = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3 
}

const dirs = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
]

const addVect = (a, b) => a.map((v, c) => v+b[c]);
const key = v => [...v.pos, v.dir].join('_');

const getMoves = (dir, v) => {
    switch (v) {
        case '.': return [dir];
        case '-': return [D.LEFT, D.RIGHT].includes(dir) ? [dir] : [D.LEFT, D.RIGHT];
        case '|': return [D.LEFT, D.RIGHT].includes(dir) ? [D.UP, D.DOWN] : [dir];
        case '/': switch (dir) {
                case D.RIGHT: return [D.UP];
                case D.LEFT: return [D.DOWN];
                case D.UP: return [D.RIGHT];
                case D.DOWN: return [D.LEFT];
            }
        case '\\': switch (dir) {
                case D.RIGHT: return [D.DOWN];
                case D.LEFT: return [D.UP];
                case D.UP: return [D.LEFT];
                case D.DOWN: return [D.RIGHT];
            }
    }
}

const run = (startPos, startDir) => {
    let stack = [{pos: startPos, dir: startDir}],
        energized = {}, seen = {};

    while (cur = stack.pop()) {
        let k = key(cur);

        if (seen[k] !== undefined) continue;

        if (!map[cur.pos[1]] || !map[cur.pos[1]][cur.pos[0]]) continue; // out of map

        seen[k] = 1;
        energized[cur.pos] = 1;

        getMoves(cur.dir, map[cur.pos[1]][cur.pos[0]]).forEach(dir => stack.push({
            dir: dir,
            pos: addVect(cur.pos, dirs[dir]),
        }))
    }

    return Object.keys(energized).length;
}

let map = input.split("\n").map(line => line.split('')),
    max = 0;

console.log('p1', run([0,0], D.RIGHT));

for (let i = 0; i < map.length; i++) {
    max = Math.max(max,
        run([i, 0], D.DOWN),
        run([i, map.length-1], D.UP),
        run([0, i], D.RIGHT),
        run([map.length-1, i], D.LEFT),
    )
}

console.log('p2', max);
