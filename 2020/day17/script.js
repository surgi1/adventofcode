// just the 4-d version for part 2
var map = {};
var steps = 6;

function key(x, y, z, w) {
    return x+'_'+y+'_'+z+'_'+w;
}

function getPoint(map, x, y, z, w) {
    var result = false;
    var k = key(x, y, z, w);
    if (map[k]) return map[k];
    return false;
}

function setPoint(map, x, y, z, w, state) {
    var k = key(x, y, z, w);
    map[k] = state;
}

function readInput() {
    for (var y = 0; y < input.length; y++) {
        var line = input[y];
        for (var x = 0; x < line.length; x++) {
            if (line[x] == '#') setPoint(map, x,y,0,0, true);
        }
    }
}

function getAdjacentLights(map, xx, yy, zz, ww) {
    var count = 0;
    for (var l = -1; l <= 1; l++) {
        var w = ww+l;
        for (var k = -1; k <= 1; k++) {
            var z = zz+k;
            for (var i = -1; i <= 1; i++) {
                var y = yy+i;
                for (var j = -1; j <= 1; j++) {
                    var x = xx+j;
                    if ((i == 0) && (j == 0) && (k == 0) && (l == 0)) continue;
                    if (getPoint(map, x,y,z,w)) count++;
                }
            }
        }
    }
    return count;
}

function size(map) {
    var min = {}, max = {}, keys = Object.keys(map), len = keys.length;
    for (var i = 0; i < len; i++) {
        if (!map[keys[i]]) continue;
        var k = keys[i].split('_');
        ['x','y','z','w'].map((coord, index) => {
            if ((min[coord] == undefined) || k[index] < min[coord]) min[coord] = parseInt(k[index]);
            if ((max[coord] == undefined) || k[index] > max[coord]) max[coord] = parseInt(k[index]);
        })
    }
    return {min:min, max:max}
}

function nextState(lastState) {
    var newState = {};
    var dim = size(lastState);

    for (var w = dim.min.w-1; w <= dim.max.w+1; w++) {
        for (var z = dim.min.z-1; z <= dim.max.z+1; z++) {
            for (var y = dim.min.y-1; y <= dim.max.y+1; y++) {
                for (var x = dim.min.x-1; x <= dim.max.x+1; x++) {
                    var lights = getAdjacentLights(lastState, x, y, z, w);
                    // GOL rules
                    if (getPoint(lastState, x,y,z,w) === true) {
                        if (lights == 3 || lights == 2) setPoint(newState, x, y, z, w, true);
                    } else {
                        if (lights == 3) setPoint(newState, x, y, z, w, true)
                    }

                }
            }
        }
    }

    return newState;
};

function getCount(map) {
    return Object.values(map).length;
};

readInput();

var newState = map;
for (var i = 0; i < steps; i++) {
    newState = nextState(newState);
}

console.log('lights on', getCount(newState));
