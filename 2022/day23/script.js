const k = (x, y) => y+'_'+x;

const init = (input, elves = new Set(), s = '') => {
    const drawElf = (e, x, y) => s += `<div id="${e}" class="elf" style="top:${300+(y*16)}px;left:${300+(x*16)}px"></div>\n`

    input.split("\n").map((line, y) => {
        line.split('').map((v, x) => (v == '#') && elves.add(k(x,y)) && drawElf(k(x,y), x, y))
    })

    document.getElementById('root').innerHTML = s;
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
    N:  {xd:  0, yd: -1},
    NE: {xd:  1, yd: -1},
    NW: {xd: -1, yd: -1},
    S:  {xd:  0, yd:  1},
    SE: {xd:  1, yd:  1},
    SW: {xd: -1, yd:  1},
    W:  {xd: -1, yd:  0},
    E:  {xd:  1, yd:  0}}

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
            let elfEl = document.getElementById(e);
            let [y, x] = destinations[e].split('_').map(Number);
            elfEl.style.left = x*16+300+'px';
            elfEl.style.top = y*16+300+'px';
            elfEl.id = destinations[e];
        } else newElves.add(e);
    })

    startingLoc++;
    return [newElves, moved];
}

const getBounds = elves => {
    let minX = 4, maxX = 4, minY = 4, maxY = 4;
    elves.forEach(e => {
        let [y, x] = e.split('_').map(Number);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    })
    return [minX, maxX, minY, maxY];
}

const run = input => {
    let elves = init(input), rounds = 0, moved = true;
    const tick = () => {
        [elves, moved] = round(elves);
        rounds++;
        if (rounds == 10) {
            let [minX, maxX, minY, maxY] = getBounds(elves);
            console.log((1+Math.abs(maxY-minY))*(1+Math.abs(maxX-minX))-elves.size);
        }
        if (moved) setTimeout(tick, 10); else console.log(rounds);
    }
    tick();
}

run(input);