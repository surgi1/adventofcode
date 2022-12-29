const parseInput = data => data.map((l => l.split('')));
const charVal = ch => ch.charCodeAt(0)-65;
const charCost = ch => Math.pow(10, charVal(ch));
const stateVal = map => map.reduce((res, line) => res+line.join('').replace(/(#|\s)/g, ''), '')
const cloneMap = source => source.map(row => row.slice())

const distanceMap = (map, x, y) => {
    const canSpreadTo = (x, y) => map[y][x] == '.';
    const spread = (x, y, dist) => {
        if (canSpreadTo(x,y)) map[y][x] = dist;
        if (canSpreadTo(x-1, y)) spread(x-1, y, dist+1);
        if (canSpreadTo(x+1, y)) spread(x+1, y, dist+1);
        if (canSpreadTo(x, y-1)) spread(x, y-1, dist+1);
        if (canSpreadTo(x, y+1)) spread(x, y+1, dist+1);
    }
    spread(x,y,0);
    return map;
}

const solve = (initState, finalStateVal) => {
    const nextMoves = (map, origX, origY) => {
        const adjacentToCaves = (x, y) => y == 1 && [3, 5, 7, 9].includes(x);
        const isSubjectsHouse = (x, y) => (y > 1) && (x == charVal(map[origY][origX])*2+3);

        const subjectsHouseIsClean = () => {
            let x = charVal(map[origY][origX])*2+3;
            for (let y = 2; y < rows-1; y++) {
                if (!['.', map[origY][origX]].includes(map[y][x])) return false;
            }
            return true;
        }

        let cleanHouse = subjectsHouseIsClean(), targets = [],
            dMap = distanceMap(cloneMap(map), origX, origY);

        for (let y = 1; y < rows-1; y++) for (let x = 1; x < cols-1; x++) {
            if (parseInt(dMap[y][x]) != dMap[y][x]) continue; // only reachable spots are considered
            if (origY == 1 && y == 1) continue; // once moved out of cave, has to move only to the cave ..
            if (origY == 1 && (!isSubjectsHouse(x, y) || !cleanHouse)) continue; // .. specifically into its own cave, once it is clean (or occupied by its bros only)
            if (origY == 1 && isSubjectsHouse(x, y) && cleanHouse) {
                if (!['#', map[origY][origX]].includes(map[y+1][x])) continue; // more to that, a valid move is only to the most bottom spot in the house
            };
            if (origY != 1 && y != 1) continue; // to limit possibilities, we allow moving from initial cave only to the top line
            if (origY != 1 && adjacentToCaves(x, y)) continue; // spots adjacent to caves are banned
            targets.push({x:x, y:y, dist: dMap[y][x]})
        }
        return targets;
    }

    let cols = initState[0].length, rows = initState.length,
        paths = [{state: parseInput(initState), cost: 0}], best = {}, final = [];

    while (paths.length > 0) {
        let p = paths.pop();
        for (let y = 1; y < rows-1; y++) for (let x = 1; x < cols-1; x++) {
            if (!('ABCD'.includes(p.state[y][x]))) continue;

            let ch = p.state[y][x], alreadyDone = false;
            if (x == charVal(ch)*2+3) {
                alreadyDone = true;
                for (let j = y+1; j < rows-1; j++) if (p.state[j][x] != ch) alreadyDone = false;
            }

            if (alreadyDone) continue;

            nextMoves(p.state, x,y).forEach(move => {
                let tmp = {state: cloneMap(p.state)};
                tmp.state[y][x] = '.';
                tmp.state[move.y][move.x] = p.state[y][x];
                tmp.val = stateVal(tmp.state);
                tmp.cost = p.cost+charCost(p.state[y][x])*move.dist;

                if (best[tmp.val] == undefined || best[tmp.val] > tmp.cost) {
                    best[tmp.val] = tmp.cost;
                    if (tmp.val == finalStateVal) final.push(tmp); else paths.push(tmp);
                }
            })
        }
    }

    return final.sort((a, b) => a.cost - b.cost)[0].cost;
}

let inputArr = input.split("\n");
console.log(solve(inputArr, '.'.repeat(11)+'ABCD'.repeat(2)));
inputArr.splice(3, 0,'  #D#C#B#A#  ','  #D#B#A#C#  ');
console.log(solve(inputArr, '.'.repeat(11)+'ABCD'.repeat(4)));