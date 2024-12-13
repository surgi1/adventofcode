const cols = input[0].length, rows = input.length, TREE = '|', LUMB = '#', SPACE = '.', reps = 1000000000;
let states = [], state = input.map(row => row.split('')), freq = false;

const count = (arr, what) => arr.reduce((res, v) => res += (v == what ? 1 : 0), 0)
const cmpStates = (s1, s2) => s1.every((row, y) => row.every((v, x) => v == s2[y][x]))
const resourceValue = state => count(state, TREE)*count(state, LUMB)

const adjacent = (map, u, v, res = []) => {
    [-1, 0, 1].forEach(i => [-1, 0, 1].forEach(j => {
        let y = v+i, x = u+j;
        if (y >= 0 && y < rows && x >= 0 && x < cols && (i != 0 || j != 0)) res.push(map[y][x]);
    }))
    return res;
}

const evolve = (val, adj) => {
    if (val == SPACE && count(adj, TREE) >= 3) return TREE;
    if (val == TREE && count(adj, LUMB) >= 3) return LUMB;
    if (val == LUMB) return resourceValue(adj) > 0 ? LUMB : SPACE;
    return val;
}

while (!freq) {
    states.push(state);
    state = state.map((row, y) => row.map((val, x) => evolve(val, adjacent(state, x, y))))
    states.forEach((s, i) => (cmpStates(s, state)) && (freq = states.length - i))
}

let firstDupe = states.length-freq, index = reps - freq*Math.floor((reps-firstDupe)/freq);

console.log('part 1', resourceValue(states[10].flat()))
console.log('part 2', resourceValue(states[index].flat()))
// trick for the part 2; 1 000 000 000 reps
// from states[firstDupe] the states repeat each freq states