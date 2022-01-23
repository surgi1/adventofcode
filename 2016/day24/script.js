const size = {x: input[0].length, y: input.length};
let part, map = [], start, keysTotal = 0;

const init = () => {
    keysTotal = 0;
    for (let y = 0; y < size.y; y++) {
        map[y] = [];
        for (let x = 0; x < size.x; x++) {
            map[y][x] = input[y][x];
            let num = parseInt(input[y][x]);
            if (!isNaN(num)) {
                if (input[y][x] != 0 || part == 2) keysTotal++;
                if (input[y][x] == 0) start = {x: x, y: y};
            }
        }
    }
}

const isKey = (num, keys) => {
    if (part == 1) {
        return !isNaN(parseInt(num)) && (parseInt(num) > 0);
    }
    return !isNaN(parseInt(num)) && (parseInt(num) > 0 || (keys.length == keysTotal-1));
}

const addKey = (keys, key) => {
    let res = keys.slice();
    res.push(key);
    return res;
}

const canMoveTo = (keys, x, y) => map[y] !== undefined && map[y][x] != '#';

const spread = (distanceMap, keys, x, y, dist) => {
    if (!(distanceMap[y][x]) || (distanceMap[y][x] > dist)) {
        distanceMap[y][x] = dist;
        if (canMoveTo(keys, x-1, y)) spread(distanceMap, keys, x-1, y, dist+1);
        if (canMoveTo(keys, x+1, y)) spread(distanceMap, keys, x+1, y, dist+1);
        if (canMoveTo(keys, x, y-1)) spread(distanceMap, keys, x, y-1, dist+1);
        if (canMoveTo(keys, x, y+1)) spread(distanceMap, keys, x, y+1, dist+1);
    }
}

const generateDistanceMap = point => {
    let distanceMap = [];
    for (let y = 0; y < size.y; y++) distanceMap[y] = [];
    spread(distanceMap, point.keys, point.x, point.y, point.dist);
    return distanceMap;
}

const nextPoints = point => {
    let distanceMap = generateDistanceMap(point);
    let points = [];

    for (let y = 0; y < size.y; y++) {
        for (let x = 0; x < size.x; x++) {
            if (distanceMap[y][x]) {
                if (isKey(map[y][x], point.keys) && !point.keys.includes(map[y][x])) {
                    points.push({x: x, y: y, dist: distanceMap[y][x], keys: addKey(point.keys, map[y][x])})
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

const getRoundTrips = () => {
    let paths = [];
    paths.push({id:0, steps:[{x: start.x, y: start.y, dist: 0, keys: []}], finished: false, roundTrip: false});

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
                let step = nextSteps[j], newPath, stopStep = false;
                // we need to kill those paths
                let ind = step.y*size.y+step.x;
                if (stepsReached[ind]) {
                    for (let sId = 0; sId < stepsReached[ind].length; sId++) {
                        let cmpStep = stepsReached[ind][sId];
                        if (cmpArr(cmpStep.keys, step.keys) && (cmpStep.keys[cmpStep.keys.length-1] == step.keys[step.keys.length-1])) {
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

                if (j > 0) newPath = {
                    id: pathId, finished: path.finished, roundTrip: path.roundTrip, steps: path.steps.map(s => Object({...s}))
                }; else newPath = path;
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

const run = setPartTo => {
    part = setPartTo;
    init();
    let roundTrips = getRoundTrips();
    let shortestPath = findShortest(roundTrips);
    console.log('part', setPartTo, 'shortest path', shortestPath, 'steps taken', shortestPath.steps[shortestPath.steps.length-1].dist);
}

run(1);
run(2);