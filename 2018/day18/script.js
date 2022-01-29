let states = [], mapSize = input.length, TREE = '|', LUMB = '#', SPACE = '.', reps = 1000000000;

const readInput = input => input.map(row => row.split(''))
const getCount = (map, what) => map.reduce((count, v) => count += (v == what ? 1 : 0), 0)
const cmpStates = (s1, s2) => s1.every((row, y) => row.every((v, x) => v == s2[y][x]))

const getAdjacent = (map, xx, yy, adj = []) => {
    [-1, 0, 1].forEach(i => [-1, 0, 1].forEach(j => {
        let y = yy+i, x = xx+j;
        if (y < 0 || y >= mapSize || x < 0 || x >= mapSize || ((i == 0) && (j == 0))) return true;
        adj.push(map[y][x]);
    }))
    return adj;
}

const nextState = lastState => lastState.map((row, y) => row.map((val, x) => {
    let adj = getAdjacent(lastState, x, y);
    // rule 1: . ->  | if 3 or more adjanced are trees
    // rule 2: | => #
    // rule 3: # -> # or .
    switch (val) {
        case SPACE: if (getCount(adj, TREE) >= 3) val = TREE; break;
        case TREE: if (getCount(adj, LUMB) >= 3) val = LUMB; break;
        case LUMB: val = ((getCount(adj, TREE) >= 1) && (getCount(adj, LUMB) >= 1)) ? LUMB : SPACE; break;
    }

    return val;
}));

let map = readInput(input), newState = nextState(map), freq = false;

while (!freq) {
    newState = nextState(newState);
    states.forEach((s, i) => (cmpStates(s, newState)) && (freq = states.length - i))
    states.push(newState);
}

let firstDupe = states.length - freq;
let index = reps - 2 - freq*Math.floor((reps - firstDupe - 2)/freq);

console.log(getCount(states[index].flat(), TREE)*getCount(states[index].flat(), LUMB))
// 1 000 000 000 reps
// from states[508] the states repeat each 28 states, meaning 536 states is the same
// states[508] is state after 510 minutes (thus the +2 adjustment above)
// 1 000 000 000
//   999 999 986 = 510+28*35714267
// so I need data for states[508+14] (522) = 197276