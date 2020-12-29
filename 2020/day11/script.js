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

// phase 1
const getAdjacentP1 = (map, xx, yy) => {
    let adj = [];
    for (let i = -1; i <= 1; i++) {
        let y = yy+i;
        if (y < 0 || y >= mapSizeY) continue;
        for (let j = -1; j <= 1; j++) {
            let x = xx+j;
            if (x < 0 || x >= mapSizeX) continue;
            if ((i == 0) && (j == 0)) continue;
            adj.push(map[y][x]);
        }
    }
    return adj;
}

// phase 2
const getAdjacent = (map, xx, yy) => {
    let adj = [];

    for (let vy = -1; vy <= 1; vy++) {
        for (let vx = -1; vx <= 1; vx++) {
            if ((vx == 0) && (vy == 0)) continue;
            let proceed = true;
            let dist = 1;
            while(proceed) {
                let x = xx+vx*dist;
                let y = yy+vy*dist;

                if (y < 0 || y >= mapSizeY || x < 0 || x >= mapSizeX) {
                    proceed = false;
                } else if (map[y][x] != '.') {
                    adj.push(map[y][x]);
                    proceed = false;
                }
                dist++;
            }
        }
    }
    return adj;
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

const nextState = (lastState) => {
    let newState = $.extend(true, [], lastState);

    for (let y = 0; y < mapSizeY; y++) {
        for (let x = 0; x < mapSizeX; x++) {
            let adj = getAdjacent(lastState, x, y);
            let occupied = 0, alen = adj.length;
            for (let i = 0; i < alen; i++) {
                if (adj[i] == '#') occupied++;
            }

            // rule 1
            if (lastState[y][x] == 'L') {
                if (occupied == 0) newState[y][x] = '#';
            } else 
            // rule 2
            if (lastState[y][x] == '#') {
                if (occupied >= 5) newState[y][x] = 'L';
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

readInput();

console.time('Execution time');

let oldState = map;
let newState = nextState(oldState);

let ticks = 0;

while (!cmpStates(oldState, newState)) {
    oldState = newState;
    newState = nextState(oldState);
    ticks++;
    if (ticks % 100000 == 99999) {
        console.log('iterations', ticks, newState);
        break;
    }
}

console.log(newState);

console.log('iterations', ticks, ' | occupied seats', getCount(newState, '#'));
console.timeEnd('Execution time');
