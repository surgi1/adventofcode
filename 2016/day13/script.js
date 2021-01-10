const fav = 1362, part2Steps = 50, start = {x: 1, y: 1}, end = {x: 31, y: 39}, size = 100;

const cellValue = (x, y) => {
    let num = x*x + 3*x + 2*x*y + y + y*y + fav;
    let s = num.toString(2);
    let ones = 0;
    for (let i = 0; i < s.length; i++) if (s[i] == '1') ones++;
    return ones % 2;
}

const generateMap = size => {
    let map = [];
    for (let y = 0; y < size; y++) {
        map[y] = [];
        for (let x = 0; x < size; x++) map[y][x] = cellValue(x, y);
    }
    return map;
}

const canMoveTo = (map, x, y) => map[y] !== undefined && map[y][x] === 0;

const spread = (map, distanceMap, x, y, dist) => {
    if ((map[y] == undefined) || (map[y][x] == undefined)) return;
    if (!distanceMap[y]) distanceMap[y] = [];
    if (!(distanceMap[y][x]) || (distanceMap[y][x] > dist)) {
        distanceMap[y][x] = dist;
        if (canMoveTo(map, x-1, y)) spread(map, distanceMap, x-1, y, dist+1);
        if (canMoveTo(map, x+1, y)) spread(map, distanceMap, x+1, y, dist+1);
        if (canMoveTo(map, x, y-1)) spread(map, distanceMap, x, y-1, dist+1);
        if (canMoveTo(map, x, y+1)) spread(map, distanceMap, x, y+1, dist+1);
    }
}

const generateDistanceMap = map => {
    let dm = [];
    spread(map, dm, start.x, start.y, 0);
    return dm;
}

const countReachableLocations = (distanceMap, maxSteps) => {
    let locs = 0;
    for (let y = 0; y < size; y++) {
        if (!distanceMap[y]) continue;
        for (let x = 0; x < size; x++) if ((distanceMap[y][x] != undefined) && (distanceMap[y][x] <= maxSteps)) locs++;
    }
    return locs;
}

let map = generateMap(size);
let dm = generateDistanceMap(map);

console.log('part 1', dm[end.y][end.x]);
console.log('part 2', countReachableLocations(dm, part2Steps));