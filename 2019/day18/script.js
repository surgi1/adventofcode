// part 2 is pretty slow, end with tick 27

let map = [], size = {}, start = [], keysTotal = 0;

const readInput = (input) => {
    size.y = input.length;
    size.x = input[0].length;
    for (let y = 0; y < size.y; y++) {
        if (!map[y]) map[y] = [];
        for (let x = 0; x < size.x; x++) {
            if (input[y][x] == '#') {
                map[y][x] = 1; // wall
            } else if (input[y][x] == '.') {
                map[y][x] = 0; // empty space
            } else if (input[y][x] == '@') {
                map[y][x] = 0; // empty space
                start.push({x: x, y: y});
            } else {
                map[y][x] = input[y].charCodeAt(x); // 65-90 doors (unpassable unless key is in possession), 97-122 keys to door id -32
                if (map[y][x] > 96) keysTotal++;
            }
        }
    }
}

const isDoor = (num) => {
    return num > 64 && num < 91;
}

const isKey = (num) => {
    return num > 96 && num < 123;
}

const canOpenDoor = (door, keys) => {
    return keys.includes(door+32);
}

const canMoveTo = (keys, x, y) => {
    // return true is map[y][x] can be reached
    // is not wall or uppercase letter not having lowercase counterpart in keys
    if (map[y][x] == 0) return true;
    if (map[y][x] == 1) return false;
    if (isKey(map[y][x])) return true;
    if (isDoor(map[y][x])) return canOpenDoor(map[y][x], keys);
}

const spread = (distanceMap, keys, x, y, dist) => {
    if (!(distanceMap[y][x]) || (distanceMap[y][x] > dist)) {
        distanceMap[y][x] = dist;
        if (canMoveTo(keys, x-1, y)) spread(distanceMap, keys, x-1, y, dist+1);
        if (canMoveTo(keys, x+1, y)) spread(distanceMap, keys, x+1, y, dist+1);
        if (canMoveTo(keys, x, y-1)) spread(distanceMap, keys, x, y-1, dist+1);
        if (canMoveTo(keys, x, y+1)) spread(distanceMap, keys, x, y+1, dist+1);
    }
}

const generateDistanceMap = (point) => {
    let distanceMap = [];
    for (let y = 0; y < size.y; y++) distanceMap[y] = [];
    spread(distanceMap, point.keys, point.x, point.y, point.dist);
    return distanceMap;
}

const addKey = (keys, key) => {
    let res = keys.slice();
    res.push(key);
    return res;
}

const nextPoints = (point) => {
    let distanceMaps = [];
    for (let i = 0; i < point.positions.length; i++) {
        distanceMaps[i] = generateDistanceMap({
            keys: point.keys,
            dist: point.dist,
            x: point.positions[i].x,
            y: point.positions[i].y
        });
    }
    let points = [];

    for (let y = 0;y < size.y; y++) {
        for (let x = 0; x < size.x; x++) {
            for (let i = 0; i < point.positions.length; i++) {
                if (distanceMaps[i][y][x]) {
                    if (isKey(map[y][x]) && !point.keys.includes(map[y][x])) {
                        let positions = $.extend(true, [], point.positions);
                        positions[i] = {x: x, y: y};
                        points.push({positions: positions, dist: distanceMaps[i][y][x], keys: addKey(point.keys, map[y][x]), lastAdvancedPositionId: i})
                    }
                }
            }
        }
    }
    return points;
}

const cmpArr = (a1, a2) => {
    let match = true, l1 = a1.length, l2 = a2.length;
    if (l1 != l2) return false;
    for (let i = 0; i < l1; i++) {
        if (!a2.includes(a1[i])) {
            match = false;
            break;
        }
    }
    return match;
}

const findShortest = (paths) => {
    return paths.filter(p => p.roundTrip).sort((a, b) => {
        let dist1 = a.steps[a.steps.length-1].dist;
        let dist2 = b.steps[b.steps.length-1].dist;
        return dist1-dist2;
    })[0];
}

// at each step, consider all reachable keys and distance to those, spam all those paths
// path stripping mechanism: at given path point (always a loc of a key), do not progress this path further if there is another path with the same picked keys and fewer steps

const getRoundTrips = () => {
    let paths = [];
    let startingPositions = [];
    start.map(pos => startingPositions.push(pos))
    paths.push({id:0, steps:[{positions: startingPositions, dist: 0, keys: []}], finished: false, roundTrip: false});

    let stepsReached = [];

    let ticks = 0;
    let finishedLength = -1;

    while (finishedLength != paths.filter(p => !p.finished).length) {
        let len = paths.length;
        finishedLength = paths.filter(p => !p.finished).length;
        for (let i = 0; i < len; i++) {
            let path = paths[i];
            if (path.finished || path.roundTrip) continue;
            let lastStep = path.steps[path.steps.length-1];
            let nextSteps = nextPoints(lastStep);
            let pathAdvanced = false;
            for (let j = 0; j < nextSteps.length; j++) {
                let step = nextSteps[j], stepPos = step.positions[step.lastAdvancedPositionId], newPath, stopStep = false;
                // we need to kill those paths
                let ind = stepPos.y*size.y+stepPos.x;
                if (stepsReached[ind]) {
                    for (let sId = 0; sId < stepsReached[ind].length; sId++) {
                        let cmpStep = stepsReached[ind][sId];
                        if (cmpArr(cmpStep.keys, step.keys)) {
                            if (cmpStep.dist < step.dist) {
                                stopStep = true;
                                break;
                            } else {
                                paths[cmpStep.pathId].finished = true;
                            }
                        }
                    }
                }

                if (stopStep) continue;
                pathAdvanced = true;
                let pathId = path.id;
                if (j > 0) pathId = paths.length;
                step.pathId = pathId;

                if (!stepsReached[ind]) stepsReached[ind] = [];
                stepsReached[ind].push(step);

                if (j > 0) newPath = $.extend(true, {}, path, {id: pathId}); else newPath = path;
                newPath.steps.push(step);
                if (step.keys.length >= keysTotal) {
                    newPath.finished = true;
                    newPath.roundTrip = true;
                }
                if (j > 0) paths.push(newPath);
            }
            if (!pathAdvanced) path.finished = true;
        }

        ticks++;
        console.log('tick', ticks, paths.filter(p => !p.finished).length, paths.filter(p => p.roundTrip).length);
    }

    return paths.filter(p => p.roundTrip);
}

//readInput(inputPart1); // part 1
readInput(inputPart2); // part 2

let roundTrips = getRoundTrips();

console.log('shortest path', findShortest(roundTrips));