const charVal = {A: 0, B: 1, C: 2, D: 3};

const distanceMap = (source, {x, y}) => {
    const canSpreadTo = (x, y) => map[y][x] == '.';
    const spread = (x, y, dist) => {
        if (canSpreadTo(x, y)) map[y][x] = dist;
        if (canSpreadTo(x - 1, y)) spread(x - 1, y, dist + 1);
        if (canSpreadTo(x + 1, y)) spread(x + 1, y, dist + 1);
        if (canSpreadTo(x, y - 1)) spread(x, y - 1, dist + 1);
        if (canSpreadTo(x, y + 1)) spread(x, y + 1, dist + 1);
    }
    let map = source.map(row => row.slice());
    spread(x, y, 0);
    return map;
}

const nextMoves = (map, from) => {
    let v = map[from.y][from.x],
        vHomeX = charVal[v]*2 + 3;

    const adjacentToCaves = (x, y) => y == 1 && [3, 5, 7, 9].includes(x);
    const isSubjectsHouse = (x, y) => (y > 1) && (x == vHomeX);
    const subjectsHouseIsClean = () => {
        for (let y = 2; y < map.length - 1; y++)
            if (!['.', v].includes(map[y][vHomeX])) return false;
        return true;
    }

    let cleanHouse = subjectsHouseIsClean(),
        targets = [],
        dMap = distanceMap(map, from);

    for (let y = 1; y < map.length - 1; y++) {
        if (from.y == 1 && y == 1) continue; // once moved out of cave, has to move only to the cave ..
        for (let x = 1; x < map[0].length - 1; x++) {
            if (isNaN(dMap[y][x])) continue; // only reachable spots are considered
            if (y > 1 && !isSubjectsHouse(x, y)) continue; // targetting non-top row and other house
            if (y > 1 && isSubjectsHouse(x, y) && !cleanHouse) continue; // targetting non-top row and our dirty house
            if (isSubjectsHouse(from.x, from.y) && isSubjectsHouse(x, y)) continue;
            if (isSubjectsHouse(x, y) && cleanHouse) {
                if (map[y + 1][x] != '#' && map[y + 1][x] != v) continue; // targetting its own house; a valid move is only to the lowest reachable
            };
            if (adjacentToCaves(x, y)) continue; // spots adjacent to caves are banned
            targets.push({
                x: x,
                y: y,
                dist: dMap[y][x]
            })
        }
    }
    return targets;
}

export { nextMoves, charVal, distanceMap }