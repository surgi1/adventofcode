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

let map = input.split("\n").map(line => line.split(''))

const run = (startPos, startDir) => {
    let stack = [{pos: [...startPos], dir: startDir}],
        energized = {}, seen = {};

    while (cur = stack.pop()) {
        let k = key(cur);

        let onMap = true;
        cur.pos.forEach((v, c) => {
            if (v < 0) onMap = false;
            if (v > map.length-1) onMap = false;
        })

        if (!onMap) continue;

        if (seen[k] !== undefined) continue;

        seen[k] = 1;
        energized[cur.pos.join('_')] = 1;

        let mapVal = map[cur.pos[1]][cur.pos[0]];

        if ( (mapVal == '.') || ((mapVal == '-') && [D.RIGHT, D.LEFT].includes(cur.dir)) || ((mapVal == '|') && [D.UP, D.DOWN].includes(cur.dir)) ) {
            stack.push({
                pos: addVect(cur.pos, dirs[cur.dir]),
                dir: cur.dir
            })
        } else if (mapVal == '|') {
            stack.push({
                pos: addVect(cur.pos, dirs[D.UP]),
                dir: D.UP
            }, {
                pos: addVect(cur.pos, dirs[D.DOWN]),
                dir: D.DOWN
            })
        } else if (mapVal == '-') {
            stack.push({
                pos: addVect(cur.pos, dirs[D.LEFT]),
                dir: D.LEFT
            }, {
                pos: addVect(cur.pos, dirs[D.RIGHT]),
                dir: D.RIGHT
            })
        } else if (mapVal == '/') { // / - rotate left, but in my notation it is facepalm
            let newDir;
            switch (cur.dir) {
                case D.RIGHT: newDir = D.UP; break;
                case D.LEFT: newDir = D.DOWN; break;
                case D.UP: newDir = D.RIGHT; break;
                case D.DOWN: newDir = D.LEFT; break;
            }
            stack.push({
                pos: addVect(cur.pos, dirs[newDir]),
                dir: newDir
            })
        } else if (mapVal == '7') { // \  - rotate right, facepalm
            let newDir;
            switch (cur.dir) {
                case D.RIGHT: newDir = D.DOWN; break;
                case D.LEFT: newDir = D.UP; break;
                case D.UP: newDir = D.LEFT; break;
                case D.DOWN: newDir = D.RIGHT; break;
            }
            stack.push({
                pos: addVect(cur.pos, dirs[newDir]),
                dir: newDir
            })
        }
    }

    return Object.keys(energized).length;
}

console.log('p1', run([0,0], D.RIGHT));

let max = 0;

for (let i = 0; i < map.length; i++) {
    max = Math.max(max,
        run([i, 0], D.DOWN),
        run([i, map.length-1], D.UP),
        run([0, i], D.RIGHT),
        run([map.length-1, i], D.LEFT),
    )
}

console.log('p2', max); // does not cover for extra directions cast from corners, was not needed for me
