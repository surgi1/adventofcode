// DFS with priority queue sorted by loss desc, very slow
// todo: reimplement using Dijkstra + prio queue

const D = {
    UP: 0,
    LEFT: 1, 
    RIGHT: 2,
    DOWN: 3,
}

const DS = [
    [0, -1],
    [-1, 0],
    [1, 0],
    [0, 1]
]

const addVect = (a, b) => a.map((v, c) => v+b[c]);
const onMap = pos => !(pos[0] < 0 || pos[1] < 0 || pos[0] > map[0].length-1 || pos[1] > map.length-1);
const mapVal = pos => map[pos[1]][pos[0]];

const getMoves = dir => {
    if (dir === undefined) return [D.RIGHT, D.DOWN]; // from 0,0 we can only these
    switch (dir) {
        case D.RIGHT: return [D.UP, D.DOWN];
        case D.LEFT: return [D.UP, D.DOWN];
        case D.UP: return [D.RIGHT, D.LEFT];
        case D.DOWN: return [D.RIGHT, D.LEFT];
    }
}

let map = input.split("\n").map(line => line.split('').map(Number));

const run = (part2 = false) => {
    let queue = [{
        pos: [0, 0],
        dir: undefined,
        loss: 0,
        stepsInDir: 0,
    }], seen = {};

    while (queue.length > 0) {
        let cur = queue.sort((a, b) => b.loss - a.loss).pop();

        if (cur.pos[0] == map.length-1 && cur.pos[1] == map[0].length-1 && ((part2 && cur.stepsInDir >= 4 ) || !part2)) return cur.loss;

        let k = [...cur.pos, cur.dir, cur.stepsInDir].join('_');

        if (seen[k] !== undefined) continue;

        seen[k] = 1;

        // continued move in the same direction
        if ((cur.dir !== undefined) && (cur.stepsInDir < (part2 ? 10 : 3))) {
            let pos = addVect(cur.pos, DS[cur.dir])
            if (onMap(pos)) queue.push({
                pos: pos,
                loss: cur.loss + mapVal(pos),
                dir: cur.dir,
                stepsInDir: cur.stepsInDir+1
            });
        }

        // move in another direction
        if ((part2 && cur.stepsInDir >= 4) || !part2 || cur.dir == undefined) {
            getMoves(cur.dir).forEach(dir => {
                let pos = addVect(cur.pos, DS[dir]);
                if (onMap(pos)) queue.push({
                    pos: pos,
                    loss: cur.loss + mapVal(pos),
                    dir: dir,
                    stepsInDir: 1
                });
            })
        }
    }
    return false;
}

console.log('p1', run());
console.log('p2', run(true));