let input = [
'.#.#.',
'.##..',
'.#...',
'.###.',
'##..#']

const init = (input) => {
    let map = [];
    input.map((line, y) => {
        map[y] = [];
        for (let x = 0; x < line.length; x++) {
            map[y][x] = (line[x] == '#' ? 1 : 0);
        }
    })
    return map;
}

const getAdjacentBugs = (map, xx, yy) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        let y = yy+i;
        if (y < 0 || y >= 5) continue;
        for (let j = -1; j <= 1; j++) {
            let x = xx+j;
            if (x < 0 || x >= 5) continue;
            if ((i == 0) && (j == 0)) continue;
            if (i != 0 && j != 0) continue;
            if (map[y][x] == 1) count++;
        }
    }
    return count;
}

const part1 = map => {
    const progressState = oldState => {
        let newState = $.extend(true, [], oldState);
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                var bugs = getAdjacentBugs(oldState, x, y);
                if (oldState[y][x] == 1) {
                    if (bugs != 1) newState[y][x] = 0;
                } else {
                    if (bugs == 1 || bugs == 2) newState[y][x] = 1;
                }
            }
        }
        return newState;
    }

    const stateToNum = state => {
        let s = '';
        for (let y = 4; y >= 0; y--) {
            for (let x = 4; x >= 0; x--) {
                s += state[y][x];
            }
        }
        return parseInt(s, 2);
    }

    let newState = map, stop = false, visitedStates = [], ticks = 0;

    while (!stop) {
        newState = progressState(newState);
        var biodiv = stateToNum(newState);
        if (visitedStates.includes(biodiv)) {
            console.log('we have a second visit with biodiversity of', biodiv);
            stop = true;
        } else {
            visitedStates.push(biodiv);
        }
        ticks++;
        if (ticks % 10000 == 0) console.log('done', ticks, 'state transformations');
    }
}

const part2 = map => {
    const emptyLevel = () => {
        let arr = [];
        for (let y = 0; y < 5; y++) arr[y] = new Array(5).fill(0);
        return arr;
    }

    const addPoint = (state, level, x, y, dir) => {
        var count = 0;
        return count;
    }

    const sumColumn = (arr, col) => {
        var count = 0;
        for (let y = 0; y < 5; y++) count += arr[y][col];
        return count;
    }

    const getAdjacentBugsRecursive = (state, level, x, y) => {
        let count = 0;

        if (x == 0) count += state[level-1][2][1];
        if (y == 0) count += state[level-1][1][2];

        if (x == 4) count += state[level-1][2][3];
        if (y == 4) count += state[level-1][3][2];

        if (x == 2 && y == 1) count += state[level+1][0].reduce((a, b) => a+b, 0);
        if (x == 2 && y == 3) count += state[level+1][4].reduce((a, b) => a+b, 0);

        if (x == 1 && y == 2) count += sumColumn(state[level+1], 0);
        if (x == 3 && y == 2) count += sumColumn(state[level+1], 4);

        // plus normal ones per part 1 method
        count += getAdjacentBugs(state[level], x, y);
        return count;
    }

    const progressState = oldState => {
        let newState = $.extend(true, [], oldState), levelStart = activeLevelMin-1, levelStop = activeLevelMax+1;
        for (let level = levelStart; level <= levelStop; level++) {
            for (let y = 0; y < 5; y++) {
                for (let x = 0; x < 5; x++) {
                    if (x == 2 && y == 2) continue;
                    var bugs = getAdjacentBugsRecursive(oldState, level, x, y);
                    if (oldState[level][y][x] == 1) {
                        if (bugs != 1) newState[level][y][x] = 0;
                    } else {
                        if (bugs == 1 || bugs == 2) {
                            newState[level][y][x] = 1;
                            if (level < activeLevelMin) activeLevelMin = level;
                            if (level > activeLevelMax) activeLevelMax = level;
                        }
                    }
                }
            }
        }
        return newState;
    }

    const getCount = state => {
        var count = 0;
        for (let level = activeLevelMin-1; level <= activeLevelMax+1; level++) {
            for (let y = 0; y < 5; y++) {
                for (let x = 0; x < 5; x++) {
                    if (x == 2 && y == 2) continue;
                    if (state[level][y][x] == 1) count++;
                }
            }
        }
        return count;
    }

    let levels = [], startingLevel = 110;

    for (let level = 0; level < 220; level++) {
        levels[level] = emptyLevel();
    }
    levels[startingLevel] = map;

    let activeLevelMin = startingLevel, activeLevelMax = startingLevel, newState = levels;

    for (var i = 0; i < 200; i++) {
        newState = progressState(newState);
    }

    console.log('total bugs', getCount(newState));
}

//part1(init(input));
part2(init(input));