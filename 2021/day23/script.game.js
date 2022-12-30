(function () {

/*
todos:
- introduce collection of maps
- save global score
- upload custom input (save to local storage as well?)
- maybe impose some code org?
*/

const spriteIds = {
    A: 6,
    B: 0, // 0 if r2d2 (1) not fit
    C: 5,
    D: 4,
    wallTop: 7,
    wall: 9,
    floor: 8,
}
const charVal = {A: 0, B: 1, C: 2, D: 3};

const cloneMap = source => source.map(row => row.slice())
const charCost = ch => Math.pow(10, charVal[ch]);
const stateVal = map => map.reduce((res, line) => res+line.join('').replace(/(#|\s)/g, ''), '')
const isSolved = map => stateVal(map) === '.'.repeat(11)+'ABCD'.repeat(map.length-3);
const id = k => document.getElementById(k);
const eqVect = (a, b) => a && b && a.x == b.x && a.y == b.y;

let map = [], pods = [], mousePos = {x:0, y:0}, solver, moves = [], difficulty = 1,
    canvas = id('canvas'), ctx = canvas.getContext('2d'), spriteSize = [84, 108], cellSize = [84, 84],
    drawing = false, frame = 0, keysPressed = {},
    resources = {sprites: {url: './spritesheet.png'}},
    dirs = [[0,1], [0,-1], [-1,0], [1,0]], score = 0, moveInProgress = false;

const createPlane = src => {
    let e = document.createElement('canvas');
    e.width = src.width;
    e.height = src.height;
    return e;
}

const drawBgSprite = (ctx, spriteId, [x, y]) => ctx.drawImage(resources.sprites.data, spriteId*spriteSize[0], 0, cellSize[0], cellSize[1], x*cellSize[0], y*cellSize[1], cellSize[0], cellSize[1]);
const drawPodSprite = (spriteId, [x, y], [ax, ay] = [0,0]) => ctx.drawImage(resources.sprites.data, spriteId*spriteSize[0], 0, spriteSize[0], spriteSize[1], x*cellSize[0]+ax, y*cellSize[1]+ay-24-20, spriteSize[0], spriteSize[1]);
const drawEmblemSprite = (spriteId, [x, y]) => ctx.drawImage(resources.sprites.data, spriteId*spriteSize[0], 0, spriteSize[0], 48, x*cellSize[0], y*cellSize[1]+14, spriteSize[0], 48);

const initPlanes = () => {
    canvas.planes = {
        bg: createPlane(canvas)
    };
    
    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[0].length; x++) {
        let v = map[y][x], target = canvas.planes.bg.getContext('2d'),
            spriteId = ['#', ' ', undefined].includes(v) ? (y == 0 ? spriteIds.wallTop : spriteIds.wall) : spriteIds.floor;
            drawBgSprite(target, spriteId, [x, y]);
    }
}

const draw = () => {
    if (drawing) return;
    drawing = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear
    ctx.drawImage(canvas.planes.bg, 0, 0);

    // highlight active cell
    let hovered = pods.filter(p => eqVect(p, mousePos))?.[0],
        selected = pods.filter(p => p.highlighted)?.[0];

    if (map[mousePos.y] && !['#', ' ', undefined].includes(map[mousePos.y]?.[mousePos.x])) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        if (!hovered && selected && !moves.some(m => eqVect(m, mousePos))) ctx.fillStyle = '#f00';
        ctx.rect(mousePos.x*cellSize[0], mousePos.y*cellSize[1], cellSize[0], cellSize[1]);
        ctx.fill();
        ctx.restore();
    }

    pods.sort((a, b) => a.y-b.y).forEach(p => drawPodSprite(p.highlighted ? p.spriteId+10:p.spriteId, [p.x, p.y]));

    'ABCD'.split('').forEach((v, i) => drawEmblemSprite(spriteIds[v]+10, [3+i*2, map.length-1]));

    frame++;
    drawing = false;
}

const setScore = v => {
    score = v;
    id('score').innerHTML = score;
    id('mbscore').innerHTML = score;
}

let solutionsCache = {};

const restart = () => {
    setScore(0);

    pods = [];
    let inputArr = input.split("\n");
    if (difficulty == 2) inputArr.splice(3, 0,'  #D#C#B#A#  ','  #D#B#A#C#  ');
    map = inputArr.map((l, y) => l.split('').map((v, x) => {
        if ('ABCD'.indexOf(v) > -1) pods.push({
            type: v, x:x, y:y, highlighted: false,
            spriteId: spriteIds[v]
        })
        return v;
    }));

    let k = stateVal(map);
    if (!solutionsCache[k]) {
        solver.postMessage( map.map(l => l.join('')).join("\n") );
    }

    canvas.style.height = cellSize[1]*map.length+'px';
    canvas.setAttribute('height', cellSize[1]*map.length);
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / cellSize[0])
    const y = Math.floor((event.clientY - rect.top) / cellSize[1])
    mousePos = {x:x, y:y};
}

const distanceMap = (map, {x, y}) => {
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

const doMove = (p, target) => {
    moveInProgress = true;
    if (eqVect(p, target)) {
        p.highlighted = false;
        moveInProgress = false;
        if (isSolved(map)) {
            id('candobetter').innerHTML = (solutionsCache[stateVal(map)] < score ? 'Maybe you can do better?' : 'Lowest cost reached, congratulations!');
            id('message').classList.toggle('out');
        }
        return;
    }

    let dMapFromTarget = distanceMap(cloneMap(map), target);
    let move = dirs.filter(d => !isNaN(dMapFromTarget[p.y+d[1]][p.x+d[0]])).map(d => ({x: p.x+d[0], y: p.y+d[1]}))[0];

    map[p.y][p.x] = '.';
    p.x = move.x;
    p.y = move.y;
    map[p.y][p.x] = p.type;
    setScore(score + charCost(p.type));

    setTimeout(() => doMove(p, target), 100);
}

const nextMoves = (map, from) => {
    let v = map[from.y][from.x], vHomeX = charVal[v]*2+3,
        rows = map.length, cols = map[0].length;

    const adjacentToCaves = (x, y) => y == 1 && [3, 5, 7, 9].includes(x);
    const isSubjectsHouse = (x, y) => (y > 1) && (x == vHomeX);

    const subjectsHouseIsClean = () => {
        for (let y = 2; y < rows-1; y++) {
            if (!['.', v].includes(map[y][vHomeX])) return false;
        }
        return true;
    }

    let cleanHouse = subjectsHouseIsClean(), targets = [],
        dMap = distanceMap(cloneMap(map), from);

    for (let y = 1; y < rows-1; y++) {
        if (from.y == 1 && y == 1) continue; // once moved out of cave, has to move only to the cave ..
        for (let x = 1; x < cols-1; x++) {
            if (isNaN(dMap[y][x])) continue; // only reachable spots are considered
            if (y > 1 && !isSubjectsHouse(x, y)) continue; // targetting non-top row and other house
            if (y > 1 && isSubjectsHouse(x, y) && !cleanHouse) continue; // targetting non-top row and our dirty house
            if (isSubjectsHouse(from.x, from.y) && isSubjectsHouse(x, y)) continue;
            if (isSubjectsHouse(x, y) && cleanHouse) {
                if (map[y+1][x] != '#' && map[y+1][x] != v) continue; // targetting its own house; a valid move is only to the lowest reachable
                // this is bugged a bit, if from == lowest spot in its house, it allows a move to the spot above it (tbd)
            };
            if (adjacentToCaves(x, y)) continue; // spots adjacent to caves are banned
            targets.push({x:x, y:y, dist: dMap[y][x]})
        }
    }
    return targets;
}


const clickHandle = () => {
    if (!map[mousePos.y] || ['#', ' ', undefined].includes(map[mousePos.y]?.[mousePos.x])) return;
    if (moveInProgress) return;

    let hovered = pods.filter(p => eqVect(p, mousePos))?.[0],
        selected = pods.filter(p => p.highlighted)?.[0];

    if (hovered) {
        if (eqVect(selected, mousePos)) {
            selected.highlighted = false;
            return;
        }
        pods.forEach(p => p.highlighted = false);
        hovered.highlighted = true;
        moves = nextMoves(map, hovered);
        return;
    }

    if (selected) {
        if (moves.some(m => eqVect(m, mousePos))) doMove(selected, {...mousePos});
    }
}

const initUI = () => {
    id('restart').addEventListener('click', e => {
        restart(map.length == 5 ? 1 : 2);
        initPlanes();
    });
    id('tryagain').addEventListener('click', e => {
        id('message').classList.toggle('out');
        restart(map.length == 5 ? 1 : 2);
        initPlanes();
    });
    id('nextmap').addEventListener('click', e => {
        id('message').classList.toggle('out');
        // switch map todo
        restart();
        initPlanes();
    });
    id('easymode').addEventListener('click', e => {
        id('easymode').classList.toggle('selected');
        id('hardmode').classList.toggle('selected');
        difficulty = 1;
        restart();
        initPlanes();
    });
    id('hardmode').addEventListener('click', e => {
        id('easymode').classList.toggle('selected');
        id('hardmode').classList.toggle('selected');
        difficulty = 2;
        restart();
        initPlanes();
    });
    canvas.addEventListener('mousemove', e => getCursorPosition(canvas, e))
    canvas.addEventListener('mouseup', e => clickHandle())
}

const load = (run, resourcesLoaded = 0) => Object.values(resources).forEach(v => {
    v.data = new Image();
    v.data.onload = () => {
        if (++resourcesLoaded < Object.keys(resources).length) return;
        run();
    }
    v.data.src = v.url;
});

const initSolver = () => {
    solver = new Worker('./worker.js');
    solver.onmessage = e => {
        solutionsCache[e.data[1]] = e.data[0];
        console.log(solutionsCache);
    }
}

load(() => {
    initSolver();
    restart();
    initUI();
    initPlanes();
    setInterval(draw, 10);
})

})();