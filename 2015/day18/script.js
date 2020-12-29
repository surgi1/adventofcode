let map = [], mapSize = input.length;
let steps = 100;

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

const adjustState = (state) => {
    state[0][0] = '#';
    state[0][mapSize-1] = '#';
    state[mapSize-1][0] = '#';
    state[mapSize-1][mapSize-1] = '#';
    return state;
}

const nextState = (lastState) => {
    adjustState(lastState);
    let newState = $.extend(true, [], lastState);

    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            let adj = getAdjacent(lastState, x, y);
            let lights = 0, alen = adj.length;
            for (let i = 0; i < alen; i++) {
                if (adj[i] == '#') lights++;
            }

            // rule 1: #
            if (lastState[y][x] == '#') {
                if (lights != 3 && lights != 2) newState[y][x] = '.';
            } else 
            // rule 2: .
            if (lastState[y][x] == '.') {
                if (lights == 3) newState[y][x] = '#';
            }

        }
    }
    adjustState(newState);

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

let newState = $.extend(true, [], map);

for (let i = 0; i < steps; i++) {
    newState = nextState(newState);
}

console.log('lights on', getCount(newState, '#'));
