let states = [], cols = input[0].length, rows = input.length, TREE = '|', LUMB = '#', SPACE = '.',
    state = input.map(row => row.split('')), freq = false, reps = 1000000000;

const count = (arr, what) => arr.reduce((res, v) => res += (v == what ? 1 : 0), 0)
const cmpStates = (s1, s2) => s1.every((row, y) => row.every((v, x) => v == s2[y][x]))

const adjacent = (map, u, v, adj = []) => {
    [-1, 0, 1].forEach(i => [-1, 0, 1].forEach(j => {
        let y = v+i, x = u+j;
        if (y < 0 || y >= rows || x < 0 || x >= cols || ((i == 0) && (j == 0))) return true;
        adj.push(map[y][x]);
    }))
    return adj;
}

const evolve = (val, adj) => {
    switch (val) {
        case SPACE: if (count(adj, TREE) >= 3) val = TREE; break;
        case TREE: if (count(adj, LUMB) >= 3) val = LUMB; break;
        case LUMB: val = ((count(adj, TREE) >= 1) && (count(adj, LUMB) >= 1)) ? LUMB : SPACE; break;
    }
    return val;
}

while (!freq) {
    states.push(state);
    state = state.map((row, y) => row.map((val, x) => evolve(val, adjacent(state, x, y))))
    states.forEach((s, i) => (cmpStates(s, state)) && (freq = states.length - i))
}

let firstDupe = states.length - freq;
let index = reps - freq*Math.floor((reps - firstDupe)/freq);

console.log('part 1', count(states[10].flat(), TREE)*count(states[10].flat(), LUMB))
console.log('part 2', count(states[index].flat(), TREE)*count(states[index].flat(), LUMB))
// trick for the part 2; 1 000 000 000 reps
// from states[firstDupe] the states repeat each freq states