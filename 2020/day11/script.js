var map = [], states = [], mapSizeY = input.length, mapSizeX = input[0].length;
function readInput() {
    for (var y = 0; y < input.length; y++) {
        var line = input[y];
        map[y] = [];
        for (var x = 0; x < line.length; x++) {
            map[y][x] = line[x];
        }
    }
}

// phase 1
function getAdjacentP1(map, xx, yy) {
    var adj = [];
    for (var i = -1; i <= 1; i++) {
        var y = yy+i;
        if (y < 0 || y >= mapSizeY) continue;
        for (var j = -1; j <= 1; j++) {
            var x = xx+j;
            if (x < 0 || x >= mapSizeX) continue;
            if ((i == 0) && (j == 0)) continue;
            adj.push(map[y][x]);
        }
    }
    return adj;
}

// phase 2
function getAdjacent(map, xx, yy) {
    var adj = [];

    for (var vy = -1; vy <= 1; vy++) {
        for (var vx = -1; vx <= 1; vx++) {
            if ((vx == 0) && (vy == 0)) continue;
            var proceed = true;
            var dist = 1;
            while(proceed) {
                var x = xx+vx*dist;
                var y = yy+vy*dist;

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

function cmpStates(s1,s2) {
    var res = true;
    for (var y = 0; y < mapSizeY; y++) {
        for (var x = 0; x < mapSizeX; x++) {
            if (s1[y][x] != s2[y][x]) {
                res = false;
                break;
            }
        }
    }
    return res;
}

function nextState(lastState) {
    var newState = $.extend(true, [], lastState);

    for (var y = 0; y < mapSizeY; y++) {
        for (var x = 0; x < mapSizeX; x++) {
            var adj = getAdjacent(lastState, x, y);
            var occupied = 0, alen = adj.length;
            for (var i = 0; i < alen; i++) {
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


function getCount(map, what) {
    var count = 0;
    for (var y = 0; y < mapSizeY; y++) {
        for (var x = 0; x < mapSizeX; x++) {
            if (map[y][x] == what) count++;
        }
    }

    return count;
};

readInput();

console.time('Execution time');

var oldState = map;
var newState = nextState(oldState);

var ticks = 0;

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
