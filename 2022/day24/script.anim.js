// the speed-up: do not compute blizzard map for each minute repeatedly
// simple bfs with tracing visited triplets of x, y and time
const wallColors = ['#2f3f63', '#1f1f53'];
const grndColors = ['#e0e6f4', '#eee', '#eee', '#eee'];
const moves = {
    '<': [-1, 0],
    '^': [0, -1],
    'wait': [0, 0],
    '>': [1, 0],
    'v': [0, 1]
}
const elfSpriteIds = {
    'v': 0,
    '^': 1,
    '<': 2,
    'wait': 0,
    '>': 3
}
const keyMap = {
    ArrowLeft: '<',
    ArrowRight: '>',
    ArrowUp: '^',
    ArrowDown: 'v',
    KeyA: '<',
    KeyD: '>',
    KeyW: '^',
    KeyS: 'v',
    Space: 'wait'
};

let map = [], blizMaps = [], graves = [], dirs = Object.values(moves), movesEntries = Object.entries(moves),
    autoRun = false, elf = {}, step = 0, steps, start, end,
    canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), spriteSize = 32,
    drawing = false, frame = 0, stepStartFrame = false, keysPressed = {},
    resources = {elfSprites: {url: './elf.png'}, sprites: {url: './spritesheet.png'}};

const getBlizMap = t => {
    const safeMod = (a, b) => (a+b*100000000) % b;

    if (blizMaps[t]) return blizMaps[t];
    
    let h = map.length-2, w = map[0].length-2;
    let bmap = map.map(l => l.map(v => v == '#' ? 1 : 0 ));

    map.forEach((l, y) => l.forEach((v, x) => {
        if (v == '^') bmap[safeMod(y-1-t, h) + 1][x] = 1;
        if (v == 'v') bmap[((y-1+t) % h) + 1][x] = 1;
        if (v == '>') bmap[y][((x-1+t) % w) + 1] = 1;
        if (v == '<') bmap[y][safeMod(x-1-t, w) + 1] = 1;
    }))

    return blizMaps[t] = bmap;
}

const findBestPath = (start, end, t0) => {
    const key = p => p.x+'_'+p.y+'_'+ p.t;

    let paths = [{x: start.x, y: start.y, t: t0, steps: []}], seen = new Set();
    while (paths.length) {
        let p = paths.shift(), k = key(p);
        
        if (seen.has(k)) continue;
        seen.add(k);
        
        if (p.y == end.y && p.x == end.x) return p;
        
        let bmap = getBlizMap(p.t+1);
        dirs.forEach(([dx, dy]) => {
            if (bmap[p.y+dy] && bmap[p.y+dy][p.x+dx] == 0) {
                let steps = p.steps.slice();
                steps.push( movesEntries.filter(([k, v]) => v[0] == dx && v[1] == dy)[0][0]);
                paths.push({y: p.y+dy, x: p.x+dx, t: p.t+1, steps: steps})
            }
        })
    }
}

const createPlane = src => {
    let e = document.createElement('canvas');
    e.width = src.width;
    e.height = src.height;
    return e;
}

const initPlanes = () => {
    canvas.planes = {
        walls: createPlane(canvas),
        ground: createPlane(canvas)
    };
    
    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[0].length; x++) {
        let v = map[y][x], target = canvas.planes[v == '#' ? 'walls' : 'ground'].getContext('2d'),
            bgColor = v == '#' ? wallColors[Math.floor(Math.random()*wallColors.length)] : grndColors[Math.floor(Math.random()*grndColors.length)];
        target.beginPath();
        target.fillStyle = bgColor;
        target.rect(x*32, y*32, 32, 32);
        target.fill();
    }
}

const advanceBlizzards = blizs => blizs.map(b => {
    b.x += moves[b.t][0];
    b.y += moves[b.t][1];
    if (b.y < 1) b.y = map.length-2;
    if (b.x < 1) b.x = map[0].length-2;
    if (b.y > map.length-2) b.y = 1;
    if (b.x > map[0].length-2) b.x = 1;
    return b;
})

const adjust = (dir, animFrame, v) => moves[v][dir]*animFrame;
const drawSprite = (spriteId, [x, y], [ax, ay] = [0,0]) => ctx.drawImage(resources.sprites.data, spriteId*spriteSize, 0, spriteSize, spriteSize, x*spriteSize+ax, y*spriteSize+ay, spriteSize, spriteSize);
const drawElfSprite = (spriteId, [x, y], [ax, ay]) => ctx.drawImage(resources.elfSprites.data, spriteId[0]*24, spriteId[1]*32, 24, 32, x*32+ax+4, y*32+ay, 24, 32);

const drawElf = animFrame => {
    let elfAnimAdj = [0,1].map(d => adjust(d, animFrame, elf.action));
    drawElfSprite([elf.action == 'wait' ? 0 : Math.round(animFrame/4) % 8, elf.spriteId], [elf.x, elf.y], elfAnimAdj);
    
    // scroll page into elf view, update hp
    const params = {behavior: 'smooth', inline: 'center', block: 'center'};
    let el = document.getElementById('elf');
    el.style.left = (elf.x*spriteSize - 112 + elfAnimAdj[0])+'px';
    el.style.top = (elf.y*spriteSize - 64 + elfAnimAdj[1])+'px';
    el.innerHTML = '❤'+elf.hp;//❤★
    if (el.scrollIntoViewIfNeeded) el.scrollIntoViewIfNeeded(params); else el.scrollIntoView(params);
}

const drawBlizzards = animFrame => {
    //if (animFrame > 0) { ctx.save(); ctx.globalAlpha = 0.5+Math.abs(animFrame-16)/32;}
    blizs.forEach(b => {
        let spriteId = '<^v>'.indexOf(b.t), animAdj = [0,1].map(d => adjust(d, animFrame, b.t));
        drawSprite(spriteId, [b.x, b.y], animAdj);
        
        // extra winds for the border transitions
        if (b.y*spriteSize+animAdj[1] < 32) drawSprite(spriteId, [b.x, map.length-1], animAdj);
        if (b.x*spriteSize+animAdj[0] < 32) drawSprite(spriteId, [map[0].length-1, b.y], animAdj);
        if (b.y*spriteSize+animAdj[1] > 32*(map.length-2))    drawSprite(spriteId, [b.x, 0], animAdj);
        if (b.x*spriteSize+animAdj[0] > 32*(map[0].length-2)) drawSprite(spriteId, [0, b.y], animAdj);
    })
    //if (animFrame > 0) ctx.restore();
}

const finishStep = () => {
    blizs = advanceBlizzards(blizs);

    // finish moving elf
    elf.x += moves[elf.action][0];
    elf.y += moves[elf.action][1];

    elf.hp -= blizs.filter(b => b.x == elf.x && b.y == elf.y).length;
    if ((elf.y == 0 || elf.y == map.length-1) && elf.hp < 50) elf.hp++;
    stepStartFrame = false;
    step++;
}

const draw = () => {
    if (drawing) return;
    drawing = true;

    let animFrame = 0;
    if (stepStartFrame !== false) {
        if (frame - stepStartFrame < 32) {
            animFrame = frame - stepStartFrame;
        } else {
            finishStep();
            if (elf.hp <= 0) {
                graves.push({...elf})
                restart();
            }
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear
    ctx.drawImage(canvas.planes.ground, 0, 0);
    graves.forEach(g => drawSprite(5, [g.x, g.y]));
    drawElf(animFrame);
    drawBlizzards(animFrame);
    ctx.drawImage(canvas.planes.walls, 0, 0);

    // apply controls
    if (autoRun) {
        if (step < steps.length) action(steps[step]); else autoRun = false;
    } else {
        let keys = Object.entries(keysPressed).filter(([k, v]) => v === true);
        if (keys.length > 0) action(keyMap[keys[0][0]]);
    }

    frame++;
    drawing = false;
}

const action = v => {
    if (stepStartFrame !== false) return;
    elf.spriteId = elfSpriteIds[v];
    if (elf.y+moves[v][1] < 0 || elf.y+moves[v][1] > map.length-1) v = 'wait';
    if (map[elf.y+moves[v][1]][elf.x+moves[v][0]] == '#') v = 'wait';
    elf.action = v;
    stepStartFrame = frame;
}

const restart = () => {
    blizMaps = [];
    map = input.split("\n").map(l => l.split(''));
    start = {x: map[0].indexOf('.'), y: 0};
    end = {x: map[map.length-1].indexOf('.'), y: map.length-1};
    step = 0;
    elf = {x: start.x, y: start.y, spriteId: 0, action: 'wait', hp: 50}
    blizs = [];
    input.split("\n").forEach((l, y) => l.split('').forEach((v, x) => {
        if ('<>^v'.indexOf(v) == -1) return true;
        blizs.push({x:x, y:y, t:v})
    }));
}

const initUI = () => {
    window.addEventListener('keyup', e => {
        if (keyMap[e.code] !== undefined) keysPressed[e.code] = false;
    });
    window.addEventListener('keydown', e => {
        if (keyMap[e.code] !== undefined) {
            keysPressed[e.code] = true;
            e.preventDefault();
        }
    });
    document.getElementById('auto').addEventListener('click', e => {
        if (autoRun) return;

        restart();

        let p = findBestPath(start, end, 0);
        steps = p.steps.slice();
        console.log('part 1', p.t);
        p = findBestPath(end, start, p.t);
        steps = [...steps, ...p.steps];
        p = findBestPath(start, end, p.t)
        steps = [...steps, ...p.steps];
        console.log('part 2', p.t);

        autoRun = true;
    });
    document.getElementById('load').addEventListener('click', e => {
        autoRun = false;
        input = document.getElementById('custom').value;
        restart();
        initPlanes();
    });
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
    restart();
    initUI();
    initPlanes();
    setInterval(draw, 10);
})