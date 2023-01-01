(function () {

/*
todos:
- maybe make modal available to have arbitrary height?
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
const storageScorePrefix = 'troopahs__best_cost_';
const storageLowestReachedPrefix = 'troopahs__lowest_reached_';
const storageCustomInputsPrefix = 'troopahs__custom_inputs_';

const cloneMap = source => source.map(row => row.slice())
const charCost = ch => Math.pow(10, charVal[ch]);
const stateVal = map => map.reduce((res, line) => res+line.join('').replace(/(#|\s)/g, ''), '')
const isSolved = map => stateVal(map) === '.'.repeat(11)+'ABCD'.repeat(map.length-3);
const id = k => document.getElementById(k);
const all = k => document.querySelectorAll(k);
const eqVect = (a, b) => a && b && a.x == b.x && a.y == b.y;
const parseInput = input => input.split("\n").map((l => l.split('')));

let map = [], pods = [], mousePos = {x:0, y:0}, solver, moves = [], difficulty = 1, inputId = 0, inputs,
    canvas = id('canvas'), ctx = canvas.getContext('2d'), spriteSize = [84, 108], cellSize = [84, 84],
    drawing = false, frame = 0, keysPressed = {}, animStartFrame = false,
    resources = {sprites: {url: './spritesheet.png'}},
    dirs = [[0,1], [0,-1], [-1,0], [1,0]], score = 0, moveInProgress = false,
    solutionsCache = {}, mapInitState = '';

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

    pods.sort((a, b) => a.y-b.y).forEach((p, i) => drawPodSprite(p.highlighted ? p.spriteId+10:p.spriteId, [p.x, p.y],
        [0, (animStartFrame !== false) && (animStartFrame+i > 0) ? 10*Math.sin(i+frame/10) : 0 ]));

    'ABCD'.split('').forEach((v, i) => drawEmblemSprite(spriteIds[v]+10, [3+i*2, map.length-1]));

    frame++;
    drawing = false;
}

const setScore = v => {
    score = v;
    id('score').innerHTML = score;
    id('mbscore').innerHTML = score;
}

const restart = () => {
    setScore(0);

    animStartFrame = false;

    pods = [];
    let inputArr = inputs[inputId].split("\n");
    if (difficulty == 2) inputArr.splice(3, 0,'  #D#C#B#A#  ','  #D#B#A#C#  ');
    map = inputArr.map((l, y) => l.split('').map((v, x) => {
        if ('ABCD'.indexOf(v) > -1) pods.push({
            type: v, x:x, y:y, highlighted: false,
            spriteId: spriteIds[v]
        })
        return v;
    }));

    mapInitState = stateVal(map);

    if (!solutionsCache[mapInitState]) {
        solver.postMessage( map.map(l => l.join('')).join("\n") );
    }

    let bestScore = localStorage.getItem(storageScorePrefix+mapInitState);
    let lowestReached = localStorage.getItem(storageLowestReachedPrefix+mapInitState);
    id('topscore').innerHTML = bestScore != undefined ? (bestScore +''+ (lowestReached == 1 ? '*' : '')): 'N/A';

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
            animStartFrame = frame;
            if (solutionsCache[mapInitState] < score) {
                id('victory').innerHTML = 'GOOD JOB!';
                id('candobetter').innerHTML = `You can save <b>${score-solutionsCache[mapInitState]}</b> more <img src="energyicon.png">!`;
            } else {
                id('victory').innerHTML = 'CONGRATULATIONS!';
                id('candobetter').innerHTML = 'Lowest <img src="energyicon.png"> cost reached!';
                localStorage.setItem(storageLowestReachedPrefix+mapInitState, 1);
            }
            id('message').classList.toggle('out');
            let bestScore = localStorage.getItem(storageScorePrefix+mapInitState);
            if (score <= bestScore || bestScore == undefined) {
                localStorage.setItem(storageScorePrefix+mapInitState, score);
                id('topscore').innerHTML = score+''+ (solutionsCache[mapInitState] == score ? '*' : '');
            }
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

const switchDifficulty = () => {
    id('easymode').classList.toggle('selected');
    id('hardmode').classList.toggle('selected');
    id('easymode').classList.toggle('link');
    id('hardmode').classList.toggle('link');
    if (difficulty == 1) difficulty = 2; else difficulty = 1;
    restart();
    initPlanes();
}

const renderMapsSwitch = () => {
    id('maps').innerHTML = '';
    inputs.forEach((inp, i) => {
        let el = document.createElement('span');
        
        if (i == inputId) el.classList.add('selected'); else el.classList.add('link');
        el.innerHTML = i+1+' ';
        el.addEventListener('click', e => {
            inputId = i;
            renderMapsSwitch();
            restart();
            initPlanes();
        })
        id('maps').appendChild(el);
    })
}


const initSolver = () => {
    solver = new Worker('./worker.js');
    solver.onmessage = e => {
        solutionsCache[e.data[1]] = e.data[0];
        console.log(solutionsCache);
    }
}

const addCustomInput = inputLiteral => {
    let customInputs = getCustomInputs();
    customInputs[stateVal(inputLiteral.split("\n").map(l => l.split('')))] = inputLiteral;
    localStorage.setItem(storageCustomInputsPrefix, JSON.stringify(customInputs));
    initInputs();
}

const getCustomInputs = () => {
    let customInputs = JSON.parse(localStorage.getItem(storageCustomInputsPrefix));
    if (customInputs) {
        return customInputs;
    }
    return {};
}

const initInputs = () => {
    inputs = [...baseInputs.slice(), ...Object.values(getCustomInputs())];
    renderMapsSwitch();
}

const onResize = () => {
    all('.message').forEach(el => el.style.left = Math.round((document.body.clientWidth-380)/2) +'px')
}

const initUI = () => {
    id('restart').addEventListener('click', e => {
        restart();
        initPlanes();
    });
    id('tryagain').addEventListener('click', e => {
        id('message').classList.toggle('out');
        restart();
        initPlanes();
    });
    id('nextmap').addEventListener('click', e => {
        id('message').classList.toggle('out');
        inputId++;
        if (inputId == inputs.length) inputId = 0;
        renderMapsSwitch();
        restart();
        initPlanes();
    });
    id('easymode').addEventListener('click', e => switchDifficulty());
    id('hardmode').addEventListener('click', e => switchDifficulty());

    id('openloadbox').addEventListener('click', e => id('loadbox').classList.toggle('out'));
    id('load').addEventListener('click', e => {
        addCustomInput(document.getElementById('custom').value);
        id('loadbox').classList.toggle('out');
    });
    id('closeloadbox').addEventListener('click', e => id('loadbox').classList.toggle('out'));

    id('openinstructions').addEventListener('click', e => id('instructions').classList.toggle('out'));
    id('closeinstructions').addEventListener('click', e => id('instructions').classList.toggle('out'));

    renderMapsSwitch();

    canvas.addEventListener('mousemove', e => getCursorPosition(canvas, e))
    canvas.addEventListener('mouseup', e => clickHandle())

    addEventListener("resize", e => onResize());
    onResize();
}

const load = (run, resourcesLoaded = 0) => Object.values(resources).forEach(v => {
    v.data = new Image();
    v.data.onload = () => {
        if (++resourcesLoaded < Object.keys(resources).length) return;
        run();
    }
    v.data.src = v.url;
});

load(() => {
    initInputs();
    initSolver();
    restart();
    initUI();
    initPlanes();
    setInterval(draw, 10);
})

})();