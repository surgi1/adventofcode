// part 2
let map = [], maps = [], maxLevels = 100, size = {}, start = {level: 0}, portals = {};

const readInput = input => {
    size.y = input.length;
    size.x = input[0].length;
    for (let y = 0; y < size.y; y++) {
        if (!map[y]) map[y] = [];
        for (let x = 0; x < size.x; x++) {
            map[y][x] = input[y][x];
        }
    }
}

const initLevels = () => {
    for (let level = 0; level < maxLevels; level++) {
        maps[level] = $.extend(true, [], map);
        if (level == 0) {
            // disable all outer portals sans those with junctions.length == 1
            Object.entries(portals).filter(([k,v]) => v.junctions.length == 2).map(([k,v]) => {
                v.junctions.filter(j => j.type == 'outer').map(j => {
                    maps[level][j.y][j.x] = '#';
                });
            })
        } else {
            // disable AA and ZZ portals
            let a = portals['AA'].junctions[0], z = portals['ZZ'].junctions[0];
            maps[level][a.y][a.x] = '#';
            maps[level][z.y][z.x] = '#';
        }
    }
}

const identifyPortals = () => {
    for (let y = 0; y < size.y-1; y++) {
        for (let x = 0; x < size.x-1; x++) {
            if (map[y][x].match(/[A-z]/g)) {
                let name = map[y][x], entry = {};
                if (map[y][x+1].match(/[A-z]/g)) {
                    name += map[y][x+1];
                    // entrypoint is either left or right
                    if (x == 0) {
                        entry = {x: x+2, y: y, type: 'outer'}
                    } else if (x == size.x-2) {
                        entry = {x: x-1, y: y, type: 'outer'}
                    } else if (map[y][x+2] == '.') {
                        entry = {x: x+2, y: y, type: 'inner'}
                    } else if (map[y][x-2] == '.') {
                        entry = {x: x-1, y: y, type: 'inner'}
                    }
                } else if (map[y+1][x].match(/[A-z]/g)) {
                    name += map[y+1][x];
                    // entrypoint is either up or down
                    if (y == 0) {
                        entry = {x: x, y: y+2, type: 'outer'}
                    } else if (y == size.y-2) {
                        entry = {x: x, y: y-1, type: 'outer'}
                    } else if (map[y+2][x] == '.') {
                        entry = {x: x, y: y+2, type: 'inner'}
                    } else if (map[y-2][x] == '.') {
                        entry = {x: x, y: y-1, type: 'inner'}
                    }
                }
                if (name.length < 2) continue;
                if (!portals[name]) portals[name] = {junctions: [], sublevelEnteredBy: []};
                portals[name].junctions.push(entry);
                if (name == 'AA') {
                    start.x = entry.x;
                    start.y = entry.y;
                }
            }
        }
    }
    Object.entries(portals).map(([k,v]) => {
        v.junctions.map(j => map[j.y][j.x] = '*');
    })
}

const canMoveTo = (m, x, y) => {
    if (m[y][x] == '#') return false;
    if (m[y][x] == '.') return true;
    if (m[y][x] == '*') return true;
    return false;
}

const findDestination = (x, y, level) => {
    let dest = false, portal = false;
    Object.entries(portals).some(([k,v]) => {
        v.junctions.some((point, id) => {
            if ((point.x == x) && (point.y == y) && (v.junctions.length > 1)) {
                dest = (id == 0 ? v.junctions[1] : v.junctions[0]);
                portal = v;
                return true;
            }
        });
        if (dest !== false) return true;
    })
    if (dest !== false) {
        if (dest.type == 'outer') {
            if (portal.sublevelEnteredBy.includes(level)) {
                dest = false; // no infinite recursion!
            } else {
                portal.sublevelEnteredBy.push(level);
            }
        }
    }
    return dest;
}

const spread = (distanceMaps, x, y, dist, level) => {
    let points = [];
    points.push({
        x: x,
        y: y,
        dist: dist,
        level: level
    })
    let len = 0, lastp = -1;

    while (len < points.length) {
        len = points.length;

        for (let pId = lastp+1; pId < len; pId++) {
            let p = points[pId];

            let distanceMap = distanceMaps[p.level];
            if (!(distanceMap[p.y][p.x]) || (distanceMap[p.y][p.x] > p.dist)) {
                distanceMap[p.y][p.x] = p.dist;
                if (canMoveTo(maps[p.level], p.x-1, p.y)) points.push({x: p.x-1, y: p.y, dist: p.dist+1, level: p.level});
                if (canMoveTo(maps[p.level], p.x+1, p.y)) points.push({x: p.x+1, y: p.y, dist: p.dist+1, level: p.level});
                if (canMoveTo(maps[p.level], p.x, p.y-1)) points.push({x: p.x, y: p.y-1, dist: p.dist+1, level: p.level});
                if (canMoveTo(maps[p.level], p.x, p.y+1)) points.push({x: p.x, y: p.y+1, dist: p.dist+1, level: p.level});
                if (maps[p.level][p.y][p.x] == '*') {
                    // warp!
                    let dest = findDestination(p.x, p.y, p.level);
                    if (dest !== false) {
                        let newLevel = p.level;
                        if (dest.type == 'outer') newLevel++; else newLevel--; // entry was opposite of dest.type
                        if (newLevel >= 0 && newLevel < maxLevels) points.push({x: dest.x, y: dest.y, dist: p.dist+1, level: newLevel});
                    }
                }
            }
            lastp++;
        }
    }
}

const generateDistanceMaps = point => {
    let distanceMaps = [];
    for (let level = 0; level < maxLevels; level++) {
        distanceMaps[level] = [];
        for (let y = 0; y < size.y; y++) distanceMaps[level][y] = [];
    }
    spread(distanceMaps, point.x, point.y, 0, point.level);
    return distanceMaps;
}

const logDistance = dms => {
    let z = portals['ZZ'].junctions[0];
    console.log('shortest found distance from AA to ZZ', dms[0][z.y][z.x]);
}

readInput(input);
identifyPortals();
initLevels();

let dms = generateDistanceMaps(start);

logDistance(dms);