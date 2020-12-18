var map = [], size = input.length;

function readInput() {
    input.map((line, y) => {
        if (!map[y]) map[y] = [];
        for (var x = 0; x < line.length; x++) {
            map[y][x] = (line[x] == '#' ? 1 : 0)
        }
    })
}

function processMap(callback) {
    for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
            callback(x,y);
        }
    }
}

function lineOfSight(p1,p2) {
    var dist = {x: p2.x-p1.x, y: p2.y-p1.y}
    var pos = $.extend(true, {}, p1);
    var lineOfSightBlocked = false;
    if (dist.y != 0) {
        var x2y = dist.x/dist.y;
        while (pos.y != p2.y) {
            if (pos.y != p1.y) {
                var checkX = p1.x+x2y*(pos.y-p1.y);
                if (Math.round(checkX) == checkX) {
                    if (map[pos.y][checkX] != 0) {
                        lineOfSightBlocked = true;
                        break;
                    }
                }
            }
            if (dist.y > 0) pos.y++; else pos.y--;
        }
    } else {
        while (pos.x != p2.x) {
            if (pos.x != p1.x) {
                if (map[pos.y][pos.x] != 0) {
                    lineOfSightBlocked = true;
                    break;
                }
            }
            if (dist.x > 0) pos.x++; else pos.x--;
        }
    }
    return !lineOfSightBlocked;
}

function getVisibles(x,y) {
    var result = []
    processMap((x2,y2) => {
        if (!((x == x2) && (y == y2)) && (map[y2][x2] != 0)) {
            if (lineOfSight({x:x, y:y}, {x:x2, y:y2})) result.push({x:x2,y:y2});
        }
    })
    return result;
}

function getMaximum() {
    var max = 0, pos;
    processMap((x,y) => {
        if (map[y][x] > max) {
            max = map[y][x];
            pos = {x:x, y:y}
        }
    })
    return {max:max, pos:pos};
}

function rad2Degrees(radians) {
    var res = radians*(180/Math.PI);
    return res;
}

// add angles (0 pointing up)
function getAngle(pos1, pos2) {
    var diff = {x: pos2.x-pos1.x, y: pos2.y-pos1.y};
    var angle;
    if (diff.y != 0) {
        if (diff.x != 0) {
            if ((diff.x > 0) && (diff.y < 0)) angle = rad2Degrees(-Math.atan(diff.x/diff.y));
            if ((diff.x > 0) && (diff.y > 0)) angle = rad2Degrees(Math.PI - Math.atan(diff.x/diff.y));
            if ((diff.x < 0) && (diff.y > 0)) angle = rad2Degrees(Math.PI + Math.atan(-diff.x/diff.y));
            if ((diff.x < 0) && (diff.y < 0)) angle = rad2Degrees(2*Math.PI - Math.atan(diff.x/diff.y));
        } else {
            angle = rad2Degrees(0+(diff.y > 0)*Math.PI);
        }
    } else {
        angle = rad2Degrees(Math.PI/2+(diff.x < 0)*Math.PI);
    }

    return angle;
}

readInput();

processMap((x,y) => {
    if (map[y][x] != 0) {
        map[y][x] = getVisibles(x,y).length;
    }
})

var part1Result = getMaximum();
var basePos = part1Result.pos;

console.log('maximum of observed asteroids', part1Result.max, 'new base position', part1Result.pos);

var visiblesFromBase = getVisibles(basePos.x,basePos.y);

visiblesFromBase.map(pos => {
    pos.angle = getAngle(basePos, pos);
})

visiblesFromBase.sort((a,b) => a.angle-b.angle).map((pos,i) => {
    console.log('The asteroid nr. ',i+1,' to be vaporized is at ', pos);
})
