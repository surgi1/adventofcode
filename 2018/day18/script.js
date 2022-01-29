let states = [], cols = input[0].length, rows = input.length, TREE = '|', LUMB = '#', SPACE = '.', reps = 1000000000;

const readInput = input => input.map(row => row.split(''))
const getCount = (map, what) => map.reduce((count, v) => count += (v == what ? 1 : 0), 0)
const cmpStates = (s1, s2) => s1.every((row, y) => row.every((v, x) => v == s2[y][x]))

const getAdjacent = (map, xx, yy, adj = []) => {
    [-1, 0, 1].forEach(i => [-1, 0, 1].forEach(j => {
        let y = yy+i, x = xx+j;
        if (y < 0 || y >= rows || x < 0 || x >= cols || ((i == 0) && (j == 0))) return true;
        adj.push(map[y][x]);
    }))
    return adj;
}

const nextState = lastState => lastState.map((row, y) => row.map((val, x) => {
    let adj = getAdjacent(lastState, x, y);
    switch (val) {
        case SPACE: if (getCount(adj, TREE) >= 3) val = TREE; break;
        case TREE: if (getCount(adj, LUMB) >= 3) val = LUMB; break;
        case LUMB: val = ((getCount(adj, TREE) >= 1) && (getCount(adj, LUMB) >= 1)) ? LUMB : SPACE; break;
    }
    return val;
}));

let newState = readInput(input), freq = false;

while (!freq) {
    states.push(newState);
    newState = nextState(newState);
    states.forEach((s, i) => (cmpStates(s, newState)) && (freq = states.length - i))
}

let firstDupe = states.length - freq;
let index = reps - freq*Math.floor((reps - firstDupe)/freq);

console.log('part 1', getCount(states[10].flat(), TREE)*getCount(states[10].flat(), LUMB))
console.log('part 2', getCount(states[index].flat(), TREE)*getCount(states[index].flat(), LUMB))
// trick for the part 2; 1 000 000 000 reps
// from states[firstDupe] the states repeat each freq states