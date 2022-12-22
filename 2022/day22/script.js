// part 2 works only for inputs in the same shape as mine, sorry jako

let map = [], cols = false, rows;
let pos = {row: 0, col: 0, dir: '>'}

const inc = {'>': [1, 0], 'v': [0, 1], '<': [-1, 0], '^': [0, -1]}
const dirValue = {'>': 0, 'v': 1, '<': 2, '^': 3}
const rotate = {
    L: {'>': '^', 'v': '>', '<': 'v', '^': '<'},
    R: {'>': 'v', 'v': '<', '<': '^', '^': '>'}
}

const startingCols = [50, 100, 50, 0, 50, 0];
const startingRows = [0, 0, 50, 100, 100, 150];

const val = pos => (pos.row+1)*1000+(pos.col+1)*4+dirValue[pos.dir]
const mapVal = pos => map[pos.row][pos.col];
const sideVal = pos => sideMap[pos.row][pos.col];

// this can definitely be simplified / made a lot more generic ¯\_(ツ)_/¯
const nextPosP2 = (p) => {
    let i = inc[p.dir];
    let pos = {...p};

    let sideFrom = sideVal(p);

    pos.row += i[1];
    pos.col += i[0];

    // check bounds as well
    let sideTo = (pos.row < 0 || pos.col < 0 || pos.row >= rows || pos.col >= cols) ? 123 : sideVal(pos);

    if (sideTo == sideFrom) return pos;

    // and now the fun part, this is tied to the specific shape of the cube map, check the image in the repo for better understanding

    // first the easy ones
    if (sideFrom == 1 && pos.dir == '>') return pos;
    if (sideFrom == 1 && pos.dir == 'v') return pos;
    if (sideFrom == 2 && pos.dir == '<') return pos;
    if (sideFrom == 3 && pos.dir == '^') return pos;
    if (sideFrom == 3 && pos.dir == 'v') return pos;
    if (sideFrom == 4 && pos.dir == '>') return pos;
    if (sideFrom == 4 && pos.dir == 'v') return pos;
    if (sideFrom == 5 && pos.dir == '^') return pos;
    if (sideFrom == 5 && pos.dir == '<') return pos;
    if (sideFrom == 6 && pos.dir == '^') return pos;

    if (sideFrom == 1 && pos.dir == '^') {
        // 1 to 6
        pos.dir = '>';
        pos.row = 150+p.col-50;
        pos.col = 0;
    } else if (sideFrom == 1 && pos.dir == '<') {
        // 1 to 4
        pos.dir = '>';
        pos.row = 100+49-p.row;
        pos.col = 0;
    }

    if (sideFrom == 2 && pos.dir == '^') {
        pos.col = p.col-100;
        pos.row = 199;
    } else if (sideFrom == 2 && pos.dir == '>') {
        // 2 to 5
        pos.dir = '<';
        pos.col = 99;
        pos.row = 100+49-p.row;
    } else if (sideFrom == 2 && pos.dir == 'v') {
        pos.dir = '<';
        pos.col = 99;
        pos.row = p.col-100+50;
    }

    if (sideFrom == 3 && pos.dir == '>') {
        // 3 -> 2
        pos.dir = '^'
        pos.col = p.row-50+100;
        pos.row = 49;
    } else if (sideFrom == 3 && pos.dir == '<') {
        // 3 -> 4
        pos.dir = 'v';
        pos.col = p.row-50+0;
        pos.row = 100;
    }

    if (sideFrom == 4 && pos.dir == '<') {
        // 4 -> 1
        pos.dir = '>';
        pos.col = 50;
        pos.row = 149-p.row;
    } else if (sideFrom == 4 && pos.dir == '^') {
        // 4 -> 3
        pos.dir = '>';
        pos.col = 50;
        pos.row = p.col+50;
    }

    if (sideFrom == 5 && pos.dir == '>') {
        // 5 -> 2
        pos.dir = '<';
        pos.col = 149;
        pos.row = 149-p.row;
    } else if (sideFrom == 5 && pos.dir == 'v') {
        // 5 -> 6
        pos.dir = '<';
        pos.col = 49;
        pos.row = p.col-50+150;
    }

    if (sideFrom == 6 && pos.dir == 'v') {
        // 6 to 2
        pos.col = p.col+100;
        pos.row = 0;
    } else if (sideFrom == 6 && pos.dir == '>') {
        // 6 -> 5
        pos.dir = '^';
        pos.col = p.row-150+50;
        pos.row = 149;
    } else if (sideFrom == 6 && pos.dir == '<') {
        // 6 -> 1
        pos.dir = 'v';
        pos.col = p.row-150+50;
        pos.row = 0;
    }

    return pos;
}

const nextPosP1 = (p) => {
    let i = inc[p.dir];
    let pos = {...p};
    const step = () => {
        pos.row += i[1];
        pos.col += i[0];
        if (pos.col >= cols) pos.col = 0;
        if (pos.row >= rows) pos.row = 0;
        if (pos.col < 0) pos.col = cols-1;
        if (pos.row < 0) pos.row = rows-1;
    }
    step();
    while (mapVal(pos) == undefined) step();
    return pos;
}

const move = (steps, nextPos) => {
    while (mapVal(nextPos(pos)) == '.' && steps) {steps--; pos = nextPos(pos)}
}

const genSideMap = () => {
    // construct clone of map but with cube sides
    let sideMap = Array.from({length:rows}, () => Array(cols));
    // mark sides
    for (let side = 0; side <= 5; side++)
        for (let row = 0; row < 50; row++)
            for (let col = 0; col < 50; col++)
                sideMap[row+startingRows[side]][col+startingCols[side]] = side+1;
    return sideMap;
}

const run = nextPosFnc => {
    pos = {dir: '>', col: map[0].indexOf('.'), row: 0}
    for (let i = 0; i <= forwards.length+rotations.length-1; i++) {
        if (i % 2 == 0) move(forwards[i/2], nextPosFnc);
        if (i % 2 == 1) pos.dir = rotate[rotations[(i-1)/2]][pos.dir];
    }
    return val(pos);
}

input.split("\n").map((line, row) => {
    cols = Math.max(cols, line.length);
    let tmp = Array(cols);
    line.split('').forEach((v, col) => {
        if (['.', '#'].includes(v)) tmp[col] = v;
    })
    map.push(tmp);
})

rows = map.length;

let forwards = inputPath.match(/\d+/g).map(Number);
let rotations = inputPath.match(/[RL]/g);
let sideMap = genSideMap();

console.log(run(nextPosP1)); // p1
console.log(run(nextPosP2)); // p2