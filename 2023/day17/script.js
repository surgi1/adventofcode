// DFS with priority queue sorted by loss desc
// runs fast only because of heap based fast priority queue taken from https://github.com/lemire/FastPriorityQueue.js/

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
const key = o => [...o.pos, o.dir, o.stepsInDir].join('_');

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
    let queue = new FastPriorityQueue((a, b) => b.loss > a.loss),
        seen = {};

    const addMove = (oldPos, dir, loss, steps = 1) => {
        let pos = addVect(oldPos, DS[dir]);
        if (onMap(pos)) queue.add({
            pos: pos,
            loss: loss + mapVal(pos),
            dir: dir,
            stepsInDir: steps
        });
    }

    queue.add({
        pos: [0, 0],
        dir: undefined,
        loss: 0,
        stepsInDir: 0,
    })

    while (!queue.isEmpty()) {
        let cur = queue.poll();

        if (cur.pos[0] == map.length-1 && cur.pos[1] == map[0].length-1 && ((part2 && cur.stepsInDir >= 4 ) || !part2)) return cur.loss;

        let k = key(cur);

        if (seen[k] !== undefined) continue;

        seen[k] = 1;

        // continue in the same direction
        if ((cur.dir !== undefined) && (cur.stepsInDir < (part2 ? 10 : 3)))
            addMove(cur.pos, cur.dir, cur.loss, cur.stepsInDir+1);

        // turn
        if ((part2 && cur.stepsInDir >= 4) || !part2 || cur.dir == undefined)
            getMoves(cur.dir).forEach(dir => addMove(cur.pos, dir, cur.loss))
    }
    return false;
}

console.log('p1', run());
console.log('p2', run(true));
