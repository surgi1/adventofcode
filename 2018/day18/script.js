let map = [], states = [], mapSize = input.length;

const readInput = () => {
    for (let y = 0; y < input.length; y++) {
        let line = input[y];
        map[y] = [];
        for (let x = 0; x < line.length; x++) {
            map[y][x] = line[x];
        }
    }
}

const getAdjacent = (map, xx, yy) => {
    let adj = [];
    for (let i = -1; i <= 1; i++) {
        let y = yy+i;
        if (y < 0 || y >= mapSize) continue;
        for (let j = -1; j <= 1; j++) {
            let x = xx+j;
            if (x < 0 || x >= mapSize) continue;
            if ((i == 0) && (j == 0)) continue;
            adj.push(map[y][x]);
        }
    }
    return adj;
}

const cmpStates = (s1,s2) => {
    let res = true;
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            if (s1[y][x] != s2[y][x]) {
                res = false;
                break;
            }
        }
    }
    return res;
}

const nextState = (lastState) => {
    let newState = $.extend(true, [], lastState);

    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            let adj = getAdjacent(lastState, x, y);
            let trees = 0, lumbs = 0, alen = adj.length;
            for (let i = 0; i < alen; i++) {
                if (adj[i] == '|') trees++;
                if (adj[i] == '#') lumbs++;
            }

            // rule 1: . ->  | if 3 or more adjanced are trees
            if (lastState[y][x] == '.') {
                if (trees >= 3) newState[y][x] = '|';
            } else 
            // rule 2: | => #
            if (lastState[y][x] == '|') {
                if (lumbs >= 3) newState[y][x] = '#';
            } else 
            // rule 3: # -> # or .
            if (lastState[y][x] == '#') {
                if ((lumbs >= 1) && (trees >= 1)) newState[y][x] = '#'; else newState[y][x] = '.';
            }

        }
    }

    for (let i = 0; i < states.length;i++) {
        if (cmpStates(states[i], newState)) {
            console.log('duplicity detected!', i, states.length, states[i], newState);
            console.log('resource value', getCount(newState, '|')*getCount(newState, '#'));
        }
    }

    states.push(newState);

    return newState;
};


const getCount = (map, what) => {
    let count = 0;
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            if (map[y][x] == what) count++;
        }
    }

    return count;
};

readInput();

//console.log('adj', getAdjacent(map, 0, 0));

console.time('Execution time');
let newState = nextState(map);
for (let i = 1; i < 600;i++) newState = nextState(newState); // 1 000 000 000 ugh
// from states[508] the states repeat each 28 states, meaning 536 states is the same
// states[508] is state after 510 minutes
// 1 000 000 000
//   999 999 986 = 510+28*35714267
// so I need data for states[508+14] (522) // 196876 not correct ; too low | 523 - 197276 correct

console.log('resource value', getCount(newState, '|')*getCount(newState, '#'));
console.timeEnd('Execution time');

console.log(newState);
