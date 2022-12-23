const k = (x, y) => y+'_'+x;

const init = (input, elves = new Set()) => {
    startingLoc = 0;
    input.split("\n").map((line, y) => {
        line.split('').map((v, x) => (v == '#') && elves.add(k(x,y)))
    })
    return elves;
}

const locsToConsider = [
        {from: ['NW', 'NE', 'N'], to: 'N'},
        {from: ['SW', 'SE', 'S'], to: 'S'},
        {from: ['NW', 'SW', 'W'], to: 'W'},
        {from: ['SE', 'NE', 'E'], to: 'E'},
    ];
let startingLoc = 0;

const directions = {
    N:  {xd: 0, yd: -1},
    NE: {xd: 1, yd: -1},
    NW: {xd: -1, yd: -1},
    S:  {xd: 0, yd: 1},
    SE: {xd: 1, yd: 1},
    SW: {xd: -1, yd: 1},
    W:  {xd: -1, yd: 0},
    E:  {xd: 1, yd: 0}}

const round = elves => {
    let considerations = new Map(); // keyed by new loc, additive
    let destinations = new Map(); // per elf

    elves.forEach(e => {
        let [y, x] = e.split('_').map(Number), adj = new Set();

        Object.entries(directions).map(([_k, dir]) => (elves.has(k(x+dir.xd, y+dir.yd))) && adj.add(_k))

        if (adj.size == 0) return true;

        for (let locId = startingLoc; locId < startingLoc+4; locId++) {
            let loc = locsToConsider[locId % 4];
            if (loc.from.every(d => !adj.has(d))) {
                let _k = k(x+directions[loc.to].xd, y+directions[loc.to].yd);
                if (!considerations[_k]) considerations[_k] = 0;
                considerations[_k]++;
                destinations[e] = _k;
                break;
            }
        }
    })

    let newElves = new Set(), moved = false;
    elves.forEach(e => {
        if (destinations[e] && considerations[destinations[e]] == 1) {
            newElves.add(destinations[e]);
            moved = true;
            return true;
        }
        newElves.add(e);
    })

    startingLoc++;

    // graphics for deugging
    //console.log(input.split("\n").map((line, y) => line.split('').map((v, x) => elves.has(k(x,y) ? '#' : '.').join('')).join("\n"))

    return [newElves, moved];
}

const part1 = input => {
    let elves = init(input), rounds = 10;
    while (rounds--) elves = round(elves)[0];
    
    let minX = 4, maxX = 4, minY = 4, maxY = 4;
    elves.forEach(e => {
        let [y, x] = e.split('_').map(Number);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    })

    return (1+Math.abs(maxY-minY))*(1+Math.abs(maxX-minX))-elves.size;
}

const part2 = input => {
    let elves = init(input);
    let rounds = 0, moved = true;

    while (moved) {
        [elves, moved] = round(elves);
        rounds++;
    }

    return rounds;
}

console.log(part1(input));
console.log(part2(input));