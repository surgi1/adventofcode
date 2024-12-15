const init = input => {
    let [gridLit, movesLit] = input.split("\n\n");
    return [
        gridLit.split("\n").map(lit => lit.split('')),
        movesLit.split('\n').join('').split('')
    ]
}

const DIRS = {
    '>': [1, 0],
    '<': [-1, 0],
    '^': [0, -1],
    'v': [0, 1]
}

const OBJECT_TYPE = {
    ROBOT: 0,
    BOX: 1,
}

const score = objects => objects.filter(o => o.type == OBJECT_TYPE.BOX).reduce((res, o) => res+o.pos[1]*100+o.pos[0], 0);
const cmpVect = (a, b) => a.length == b.length && a.every((v, i) => v === b[i]);
const addVect = (a, b) => a.map((v, i) => v + b[i]);

const run = (origMap, moves, width = 1) => {
    const mv = v => map[v[1]][v[0]];
    const getRobot = () => objects.filter(o => o.type == OBJECT_TYPE.ROBOT)[0];

    let objects = [];

    let map = origMap.map((row, y) => {
        let tmp = [];
        row.forEach((v, x) => {
            for (let i = 0; i < width; i++) tmp.push(v == '#' ? '#' : '.')
        })
        return tmp;
    })

    const move = (dirId, o) => {
        let dir = DIRS[dirId];
        let p = o.pos.map((v, i) => v+dir[i]);
        let p2 = addVect(p, addVect(o.size, [-1, -1]));
        
        if (mv(p) == '#' || mv(p2) == '#') return false;

        // collision detection
        let obstacles = objects.filter(ob => {
            if (cmpVect(ob.pos, o.pos)) return false; // same box
            if (ob.size[0] == 1) return cmpVect(ob.pos, p) || cmpVect(ob.pos, p2); // not happening in part 2
            return cmpVect(ob.pos, p) || cmpVect(ob.pos, p2) || cmpVect(addVect(ob.pos, [1, 0]), p);
        });

        if (obstacles.length === 0 || obstacles.every(ob => move(dirId, ob))) {
            o.pos = p;
            return true;
        } else {
            return false;
        }
    }

    origMap.forEach((row, y) => row.forEach((v, x) => {
        if (['#', '.'].includes(v)) return true;
        objects.push({
            pos: [x*width, y],
            type: v == '@' ? OBJECT_TYPE.ROBOT : OBJECT_TYPE.BOX,
            size: v == '@' ? [1, 1] : [width, 1]
        })
        origMap[y][x] = '.';
    }));

    moves.forEach(dirId => {
        let state = objects.map(a => ({pos: a.pos.slice(), size: a.size.slice(), type: a.type}));
        if (!move(dirId, getRobot())) objects = state;
    })
    return score(objects);
}

console.log('p1', run(...init(input)));
console.log('p1', run(...init(input), 2));
