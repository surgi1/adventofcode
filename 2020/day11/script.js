let map = [], states = [], mapSizeY = input.length, mapSizeX = input[0].length;

const readInput = () => {
    for (let y = 0; y < input.length; y++) {
        let line = input[y];
        map[y] = [];
        for (let x = 0; x < line.length; x++) {
            map[y][x] = line[x];
        }
    }
}

const getAdjacentPart1 = (map, xx, yy) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        let y = yy+i;
        if (y < 0 || y >= mapSizeY) continue;
        for (let j = -1; j <= 1; j++) {
            let x = xx+j;
            if (x < 0 || x >= mapSizeX) continue;
            if ((i == 0) && (j == 0)) continue;
            if (map[y][x] == '#') count++;
        }
    }
    return count;
}

const getAdjacentPart2 = (map, xx, yy) => {
    let count = 0;
    for (let vy = -1; vy <= 1; vy++) {
        for (let vx = -1; vx <= 1; vx++) {
            if ((vx == 0) && (vy == 0)) continue;
            let proceed = true, dist = 1;
            while (proceed) {
                let x = xx+vx*dist, y = yy+vy*dist;
                if (y < 0 || y >= mapSizeY || x < 0 || x >= mapSizeX) {
                    proceed = false;
                } else if (map[y][x] != '.') {
                    if (map[y][x] == '#') count++;
                    proceed = false;
                }
                dist++;
            }
        }
    }
    return count;
}

const cmpStates = (s1,s2) => {
    let res = true;
    for (let y = 0; y < mapSizeY; y++) {
        for (let x = 0; x < mapSizeX; x++) {
            if (s1[y][x] != s2[y][x]) {
                res = false;
                break;
            }
        }
    }
    return res;
}

const nextState = (lastState, adjFunction, occupiedParam) => {
    let newState = lastState.map(y => y.slice());
    for (let y = 0; y < mapSizeY; y++) {
        for (let x = 0; x < mapSizeX; x++) {
            let occupied = adjFunction(lastState, x, y);
            if (lastState[y][x] == 'L') {
                if (occupied == 0) newState[y][x] = '#';
            } else if (lastState[y][x] == '#') {
                if (occupied >= occupiedParam) newState[y][x] = 'L';
            }

        }
    }
    return newState;
};


const getCount = (map, what) => {
    let count = 0;
    for (let y = 0; y < mapSizeY; y++) {
        for (let x = 0; x < mapSizeX; x++) {
            if (map[y][x] == what) count++;
        }
    }
    return count;
};

const run = (adjFunction, occupiedParam) => {
    readInput();
    let oldState = map;
    let newState = nextState(oldState, adjFunction, occupiedParam);

    while (!cmpStates(oldState, newState)) {
        oldState = newState;
        newState = nextState(oldState, adjFunction, occupiedParam);
    }
    return getCount(newState, '#');
}

console.log('part 1', run(getAdjacentPart1, 4));
console.log('part 2', run(getAdjacentPart2, 5));