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

const gruesCount = 20;
const mapSize = 50;

let map = [], graves = [], grues = [], dirs = Object.values(moves), movesEntries = Object.entries(moves),
    autoRun = false, elf = {}, step = 0, steps, start, end,
    canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), spriteSize = 32,
    drawing = false, frame = 0, stepStartFrame = false, keysPressed = {},
    resources = {
        elfSprites: {url: './elf.png'},
        sprites: {url: './spritesheet.png'},
        terrain: {url: './terrain_3.png'}
    };

// idea: skeletons (maybe resurrected from the grave?) that would attract the grues in the area

const createPlane = src => {
    let e = document.createElement('canvas');
    e.width = src.width;
    e.height = src.height;
    return e;
}

const drawTerrainSprite = (ctx, spriteId, [x, y]) => ctx.drawImage(resources.terrain.data, spriteId[0]*spriteSize, spriteId[1]*spriteSize, spriteSize, spriteSize, x*spriteSize, y*spriteSize, spriteSize, spriteSize);

const gmap = (y, x) => {
    if (x >= 0 && y >= 0 && x < map[0].length && y < map.length) return map[y][x];
    return '#'; // outside the map are only walls
}

const initPlanes = () => {
    canvas.planes = {
        walls: createPlane(canvas),
        ground: createPlane(canvas)
    };
    
    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[0].length; x++) {
        let v = map[y][x];
        // allways draw ground
        drawTerrainSprite(canvas.planes.ground.getContext('2d'), [ Math.random() < 0.05 ? 28 : 24+((x*y) % 4), 18], [x, y]);

        if (v == '#') {
            let mat = [6, 0]; // coordinates of the material in the terrain png; x, y
            let pos = [0, 0]; // sprite position relative to the material; x, y

            if (x > 0 && y > 0 && x < map[0].length-1 && y < map.length-1) mat = [5, 2]; // inner wall material

            if (![gmap(y-1, x-1), gmap(y-1, x), gmap(y-1, x+1), gmap(y, x-1), gmap(y, x+1), gmap(y+1, x-1), gmap(y+1, x), gmap(y+1, x+1)].includes('#')) {
                // sole hole
                drawTerrainSprite(canvas.planes.walls.getContext('2d'), [mat[0]*3, Math.round(mat[1]*6+Math.random())], [x, y]);
            } else {

                if (gmap(y-1, x) != '#') pos[1] = 2;
                else if (gmap(y+1, x) != '#') pos[1] = 4;
                else pos[1] = 3;

                if (gmap(y, x-1) != '#') pos[0] = 0;
                else if (gmap(y, x+1) != '#') pos[0] = 2;
                else pos[0] = 1;

                if (pos[0] == 1 && pos[1] == 3) {
                    // this might be a middle sprite
                    if (gmap(y-1, x-1) != '#') pos = [2, 1];
                    else if (gmap(y-1, x+1) != '#') pos = [1, 1];
                    else if (gmap(y+1, x-1) != '#') pos = [2, 0];
                    else if (gmap(y+1, x+1) != '#') pos = [1, 0];
                    else {
                        // it is a middle sprite
                        if (Math.random() < 0.2) {
                            drawTerrainSprite(canvas.planes.walls.getContext('2d'), [mat[0]*3+pos[0], mat[1]*6+pos[1]], [x, y]);
                            pos = [Math.floor(3*Math.random()), 5]; // extra graphics for breaking the still
                        }
                    }
                }

                drawTerrainSprite(canvas.planes.walls.getContext('2d'), [mat[0]*3+pos[0], mat[1]*6+pos[1]], [x, y]);
            }
        } else {
            // randoms
            if (Math.random() < 0.005)
                drawTerrainSprite(canvas.planes.ground.getContext('2d'), [30, 15], [x, y]);
            if (Math.random() < 0.01)
                drawTerrainSprite(canvas.planes.ground.getContext('2d'), [22, 5], [x, y]);
        }
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

const drawGrues = animFrame => {
    ctx.save();
    ctx.globalAlpha = 0.6;
    grues.forEach(g => {
        let spriteId = 6 + '<v^>'.indexOf(g.t), animAdj = [0,1].map(d => adjust(d, animFrame, g.t));
        drawSprite(spriteId, [g.x, g.y], animAdj);
    })
    ctx.restore();
}

const determineGrueAction = ({x, y}, blzs) => {
    let defaultMove = '';
    if (Math.abs(elf.x-x)+Math.abs(elf.y-y) < 13) {
        if (Math.abs(elf.x-x) > Math.abs(elf.y-y)) {
            // left or right
            defaultMove = (elf.x > x) ? '>' : '<';
        } else {
            defaultMove = (elf.y > y) ? 'v' : '^';
        }
    } else defaultMove = '<>^v'.charAt(Math.floor(4*Math.random()));

    if (blzs.length > 0) {
        if (blzs.filter(b => b.t == defaultMove).length > 0) return defaultMove;
        return blzs[Math.floor(blzs.length*Math.random())].t;
    }
    return defaultMove;
}

const finishStep = () => {
    blizs = advanceBlizzards(blizs);

    // finish moving elf
    elf.x += moves[elf.action][0];
    elf.y += moves[elf.action][1];

    // finish moving grues
    grues.forEach(g => {
        g.x += moves[g.t][0];
        g.y += moves[g.t][1];
        let blzs = blizs.filter(b => b.x == g.x && b.y == g.y);
        g.t = determineGrueAction(g, blzs);
        if (Math.abs(elf.x-g.x)+Math.abs(elf.y-g.y) <= 1) elf.hp -= 5;
    })

    //elf.hp -= blizs.filter(b => b.x == elf.x && b.y == elf.y).length;
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

    if ((elf.y == 0 || elf.y == map.length-1) && elf.hp < 100) elf.hp++;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear
    ctx.drawImage(canvas.planes.ground, 0, 0);
    graves.forEach(g => drawSprite(5, [g.x, g.y]));
    drawElf(animFrame);
    ctx.drawImage(canvas.planes.walls, 0, 0);
    drawBlizzards(animFrame);
    drawGrues(animFrame);

    // apply controls
    let keys = Object.entries(keysPressed).filter(([k, v]) => v === true);
    if (keys.length > 0) action(keyMap[keys[0][0]]); // else action('wait');

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
    map = inputGame.split("\n").map(l => [...l.split('').slice(0, mapSize-2), ...l.split('').slice(-2)]);
    start = {x: map[0].indexOf('.'), y: 0};
    end = {x: map[map.length-1].indexOf('.'), y: map.length-1};
    step = 0;
    elf = {x: start.x, y: start.y, spriteId: 0, action: 'wait', hp: 100}
    blizs = [];
    map.forEach((row, y) => row.forEach((v, x) => {
        if ('<>^v'.indexOf(v) == -1) return true;
        if ((x*y) % 5 == Math.floor(5*Math.random())) blizs.push({x:x, y:y, t:v});
    }));

    grues = [];
    for (let i = 0; i < gruesCount; i++) grues.push({
        x: Math.floor(map[0].length*Math.random()),
        y: Math.floor(map.length*Math.random()),
        t: 'v'
    })
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