let map = [], mapSize = input.length, steps = 100;

const init = input => {
    input.map((line, y) => {
        map[y] = [];
        line.split('').map((ch, x) => map[y][x] = ch);
    })
}

const getAdjacent = (map, xx, yy) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        let y = yy+i;
        if (y < 0 || y >= mapSize) continue;
        for (let j = -1; j <= 1; j++) {
            let x = xx+j;
            if (x < 0 || x >= mapSize) continue;
            if ((i == 0) && (j == 0)) continue;
            if (map[y][x] == '#') count++;
        }
    }
    return count;
}

const adjustState = state => {
    state[0][0] = '#';
    state[0][mapSize-1] = '#';
    state[mapSize-1][0] = '#';
    state[mapSize-1][mapSize-1] = '#';
    return state;
}

const nextState = (lastState, fixedCorners) => {
    let newState = lastState.map(row => row.slice());
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            let lights = getAdjacent(lastState, x, y);
            if (lastState[y][x] == '#') {
                if (lights != 3 && lights != 2) newState[y][x] = '.';
            } else if (lastState[y][x] == '.') {
                if (lights == 3) newState[y][x] = '#';
            }

        }
    }
    if (fixedCorners) adjustState(newState);
    return newState;
};

const getCount = (map, what) => {
    let count = 0;
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) if (map[y][x] == what) count++;
    }
    return count;
};

const run = (fixedCorners = false) => {
    init(input);
    let newState = map.map(row => row.slice());
    for (let i = 0; i < steps; i++) newState = nextState(newState, fixedCorners);
    console.log('lights on', getCount(newState, '#'));
}

run();
run(true);