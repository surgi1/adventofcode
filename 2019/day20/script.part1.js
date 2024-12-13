// part 1
var map = [], size = {}, start = [], portals = {};

function readInput(input) {
    size.y = input.length;
    size.x = input[0].length;
    for (var y = 0; y < size.y; y++) {
        if (!map[y]) map[y] = [];
        for (var x = 0; x < size.x; x++) {
            map[y][x] = input[y][x];
        }
    }
}

function identifyPortals() {
    for (var y = 0; y < size.y-1; y++) {
        for (var x = 0; x < size.x-1; x++) {
            if (map[y][x].match(/[A-z]/g)) {
                var name = map[y][x], entry = {};
                if (map[y][x+1].match(/[A-z]/g)) {
                    name += map[y][x+1];
                    // entrypoint is either left or right
                    if (x == 0) {
                        entry = {x: x+2, y: y}
                    } else if (x == size.x-2) {
                        entry = {x: x-1, y: y}
                    } else if (map[y][x+2] == '.') {
                        entry = {x: x+2, y: y}
                    } else if (map[y][x-2] == '.') {
                        entry = {x: x-1, y: y}
                    }
                } else if (map[y+1][x].match(/[A-z]/g)) {
                    name += map[y+1][x];
                    // entrypoint is either up or down
                    if (y == 0) {
                        entry = {x: x, y: y+2}
                    } else if (y == size.y-2) {
                        entry = {x: x, y: y-1}
                    } else if (map[y+2][x] == '.') {
                        entry = {x: x, y: y+2}
                    } else if (map[y-2][x] == '.') {
                        entry = {x: x, y: y-1}
                    }
                }
                if (name.length < 2) continue;
                if (!portals[name]) portals[name] = {junctions: []};
                portals[name].junctions.push(entry);
                if (name == 'AA') start = entry;
            }
        }
    }
    Object.entries(portals).map(([k,v]) => {
        v.junctions.map(j => map[j.y][j.x] = '*');
    })
}

function canMoveTo(x, y) {
    if (map[y][x] == '#') return false;
    if (map[y][x] == '.') return true;
    if (map[y][x] == '*') return true;
    return false
}

function findDestination(x, y) {
    var dest = false;
    Object.entries(portals).some(([k,v]) => {
        v.junctions.some((point, id) => {
            if ((point.x == x) && (point.y == y) && (v.junctions.length > 1)) {
                dest = (id == 0 ? v.junctions[1] : v.junctions[0]);
                return true;
            }
        });
        if (dest !== false) return true;
    })
    return dest;
}

function spread(distanceMap, x, y, dist) {
    if (!(distanceMap[y][x]) || (distanceMap[y][x] > dist)) {
        distanceMap[y][x] = dist;
        if (canMoveTo(x-1, y)) spread(distanceMap, x-1, y, dist+1);
        if (canMoveTo(x+1, y)) spread(distanceMap, x+1, y, dist+1);
        if (canMoveTo(x, y-1)) spread(distanceMap, x, y-1, dist+1);
        if (canMoveTo(x, y+1)) spread(distanceMap, x, y+1, dist+1);
        if (map[y][x] == '*') {
            // warp!
            var dest = findDestination(x, y);
            if (dest !== false) spread(distanceMap, dest.x, dest.y, dist+1);
        }
    }
}

function generateDistanceMap(point) {
    var distanceMap = [];
    for (var y = 0; y < size.y; y++) distanceMap[y] = [];
    spread(distanceMap, point.x, point.y, 0);
    return distanceMap;
}

function logDistance(dm) {
    var z = portals['ZZ'].junctions[0];
    console.log('shortest found distance from AA to ZZ', dm[z.y][z.x]);
}

var root = $('#root');
var pre = $('<pre />');
root.append(pre);

function renderScreen() {
    pre.empty();
    for (var y = 0; y < size.y; y++) {
        var line = '';
        for (var x = 0; x < size.x; x++) {
            line = line+map[y][x];
        }
        pre.append(line);
        pre.append('<br>');
    }
}

readInput(input);

identifyPortals();

renderScreen();

var dm = generateDistanceMap(start);

logDistance(dm);