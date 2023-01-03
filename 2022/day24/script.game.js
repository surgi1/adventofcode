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

            if (x > 0 && y > 0 && x < map[0].length-1 && y < map.length-1) mat = [5, 0]; // inner wall material

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
    if (b.y < -32) b.y = map.length*32;
    if (b.x < -32) b.x = map[0].length*32;
    if (b.y > map.length*32) b.y = -32;
    if (b.x > map[0].length*32) b.x = -32;
    return b;
})

const drawSprite = (spriteId, [x, y]) => ctx.drawImage(resources.sprites.data, spriteId*spriteSize, 0, spriteSize, spriteSize, x, y, spriteSize, spriteSize);
const drawElfSprite = (spriteId, [x, y]) => ctx.drawImage(resources.elfSprites.data, spriteId[0]*24, spriteId[1]*32, 24, 32, x+4, y, 24, 32);

const drawElf = () => {
    drawElfSprite([elf.action == 'wait' ? 0 : Math.round(frame/4) % 8, elf.spriteId], [elf.x, elf.y]);
    
    // scroll page into elf view, update hp
    const params = {behavior: 'smooth', inline: 'center', block: 'center'};
    let el = document.getElementById('elf');
    el.style.left = (elf.x - 112)+'px';
    el.style.top = (elf.y - 64)+'px';
    el.innerHTML = '❤'+elf.hp;//❤★
    if (el.scrollIntoViewIfNeeded) el.scrollIntoViewIfNeeded(params); else el.scrollIntoView(params);
}

const drawBlizzards = () => {
    blizs.forEach(b => {
        let spriteId = '<^v>'.indexOf(b.t);
        drawSprite(spriteId, [b.x, b.y]);
    })
}

const drawGrues = animFrame => {
    ctx.save();
    ctx.globalAlpha = 0.6;
    grues.forEach(g => {
        let spriteId = 6 + '<v^>'.indexOf(g.t);
        drawSprite(spriteId, [g.x, g.y]);
    })
    ctx.restore();
}

const determineGrueAction = ({x, y, t}, blzs) => {
    let defaultMove = '';
    if (Math.abs(elf.x-x)+Math.abs(elf.y-y) < 500) {
        if (Math.abs(elf.x-x) > Math.abs(elf.y-y)) {
            // left or right
            defaultMove = (elf.x > x) ? '>' : '<';
        } else {
            defaultMove = (elf.y > y) ? 'v' : '^';
        }
    } else {
        if (frame % 64 == Math.floor(32*Math.random())) defaultMove = '<>^v'.charAt(Math.floor(4*Math.random()));
        else defaultMove = t;
    }

    if (x < 32) defaultMove = '>';
    if (y < 32) defaultMove = 'v';
    if (y > 32*(map.length-2)) defaultMove = '^';
    if (x > 32*(map[0].length-2)) defaultMove = '<';

    if (blzs.length > 0) {
        if (blzs.filter(b => b.t == defaultMove).length > 0) return defaultMove;
        return blzs[Math.floor(blzs.length*Math.random())].t;
    }

    return defaultMove;
}

const draw = () => {
    if (drawing) return;
    drawing = true;

    blizs = advanceBlizzards(blizs);

    grues.forEach(g => {
        g.x += moves[g.t][0]*1.1;
        g.y += moves[g.t][1]*1.1;
        let blzs = blizs.filter(b => Math.abs(b.x-g.x) <= 12 && Math.abs(b.y-g.y) <= 12);
        g.t = determineGrueAction(g, blzs);
        if (Math.abs(elf.x-g.x)+Math.abs(elf.y-g.y) <= 8) if (frame % 10 == 0) elf.hp -= 1;
    })

    if ((elf.y < 32 || elf.y > 32*(map.length-1)) && elf.hp < 100) if (frame % 3 == 0) elf.hp++;
    
    if (elf.hp <= 0) {
        graves.push({...elf})
        restart();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear
    ctx.drawImage(canvas.planes.ground, 0, 0);
    ctx.drawImage(canvas.planes.walls, 0, 0);
    graves.forEach(g => drawSprite(5, [g.x, g.y]));
    drawElf();
    drawBlizzards();
    drawGrues();

    // apply controls
    let keys = Object.entries(keysPressed).filter(([k, v]) => v === true);
    if (keys.length > 0) {
        let v = keyMap[keys[0][0]];
        let move = [0, 0];
        keys.forEach(k => {
            let v = keyMap[k[0]];
            move[0] += moves[v][0];
            move[1] += moves[v][1];
        })
        let moveNorm = Math.sqrt(move[0]*move[0]+move[1]*move[1]);
        move[0] = move[0]/moveNorm;
        move[1] = move[1]/moveNorm;

        elf.spriteId = elfSpriteIds[v];
        let mapY = Math.round((elf.y+move[1])/32),
            mapX = Math.round((elf.x+move[0])/32);
        
        if (gmap(mapY, mapX) != '#') {
            elf.x += move[0];
            elf.y += move[1];
            elf.action = v;
        }
    } else elf.action = 'wait';

    frame++;
    drawing = false;
}

const restart = () => {
    map = inputGame.split("\n").map(l => [...l.split('').slice(0, mapSize-2), ...l.split('').slice(-2)]);
    start = {x: map[0].indexOf('.'), y: 0};
    end = {x: map[map.length-1].indexOf('.'), y: map.length-1};
    step = 0;
    elf = {x: start.x*32, y: start.y*32, spriteId: 0, action: 'wait', hp: 100}
    blizs = [];
    map.forEach((row, y) => row.forEach((v, x) => {
        if ('<>^v'.indexOf(v) == -1) return true;
        if ((x*y) % 5 == Math.floor(5*Math.random())) blizs.push({x:x*32, y:y*32, t:v});
    }));

    grues = [];
    for (let i = 0; i < gruesCount; i++) grues.push({
        x: Math.floor(32*map[0].length*Math.random()),
        y: Math.floor(32*map.length*Math.random()),
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