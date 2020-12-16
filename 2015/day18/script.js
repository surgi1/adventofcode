var map = [], mapSize = input.length;
var steps = 100;

function readInput() {
    for (var y = 0; y < input.length; y++) {
        var line = input[y];
        map[y] = [];
        for (var x = 0; x < line.length; x++) {
            map[y][x] = line[x];
        }
    }
}

function getAdjacent(map, xx, yy) {
    var adj = [];
    for (var i = -1; i <= 1; i++) {
        var y = yy+i;
        if (y < 0 || y >= mapSize) continue;
        for (var j = -1; j <= 1; j++) {
            var x = xx+j;
            if (x < 0 || x >= mapSize) continue;
            if ((i == 0) && (j == 0)) continue;
            adj.push(map[y][x]);
        }
    }
    return adj;
}

function adjustState(state) {
    state[0][0] = '#';
    state[0][mapSize-1] = '#';
    state[mapSize-1][0] = '#';
    state[mapSize-1][mapSize-1] = '#';
    return state;
}

function nextState(lastState) {
    adjustState(lastState);
    var newState = $.extend(true, [], lastState);

    for (var y = 0; y < mapSize; y++) {
        for (var x = 0; x < mapSize; x++) {
            var adj = getAdjacent(lastState, x, y);
            var lights = 0, alen = adj.length;
            for (var i = 0; i < alen; i++) {
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

function getCount(map, what) {
    var count = 0;
    for (var y = 0; y < mapSize; y++) {
        for (var x = 0; x < mapSize; x++) {
            if (map[y][x] == what) count++;
        }
    }

    return count;
};

readInput();

var newState = $.extend(true, [], map);

for (var i = 0; i < steps; i++) {
    newState = nextState(newState);
}

console.log('lights on', getCount(newState, '#'));
