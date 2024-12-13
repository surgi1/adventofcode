// part 2 works only for inputs in the same shape as mine
// a fun twist: actually *all the real inputs are the same shape*!
// (my pocket troll-o-meter was stuck on 3.6 and then just melted down)

let map = [], cols = false, rows, size;
let pos = {row: 0, col: 0, dir: '>'}

const inc = {'>': [1, 0], 'v': [0, 1], '<': [-1, 0], '^': [0, -1]}
const dirValue = {'>': 0, 'v': 1, '<': 2, '^': 3}
const rotate = {
    L: {'>': '^', 'v': '>', '<': 'v', '^': '<'},
    R: {'>': 'v', 'v': '<', '<': '^', '^': '>'}
}

const val = pos => (pos.row+1)*1000+(pos.col+1)*4+dirValue[pos.dir]
const mapVal = pos => map[pos.row][pos.col];
const sideVal = pos => sideMap[Math.floor(pos.row / size)][Math.floor(pos.col / size)];

// this can definitely be simplified / made a lot more generic ¯\_(ツ)_/¯
const nextPosP2 = (p) => {
    let i = inc[p.dir];
    let pos = {...p};

    let sideFrom = sideVal(p);

    pos.row += i[1];
    pos.col += i[0];

    // check bounds as well
    let sideTo = (pos.row < 0 || pos.col < 0 || pos.row >= rows || pos.col >= cols) ? undefined : sideVal(pos);

    // no transition
    if (sideTo == sideFrom) return pos;

    // naturally supported transitions
    if (sideTo) return pos;

    // and now the fun part, this is tied to the specific shape of the cube map, check the image in the repo for better understanding
    // possible todo: locate sideFrom and sideTo on the minimap, use their col, row indices to replace the 50, 100, 150 numbers below
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
    let div = rows > cols ? [3, 4] : [4, 3]; // cols, rows
    size = cols/div[0];
    let miniMap = Array.from({length:div[1]}, () => Array(div[0])), side = 1;
    for (let row = 0; row < div[1]; row++)
        for (let col = 0; col < div[0]; col++)
            if (map[row*size][col*size] != undefined) miniMap[row][col] = side++;
    return miniMap;
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