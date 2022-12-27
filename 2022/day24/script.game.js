// the speed-up: do not compute blizzard map for each minute repeatedly
// simple bfs with tracing visited triplets of x, y and time

const moves = {
    '<': [-1, 0],
    '^': [0, -1],
    'wait': [0, 0],
    '>': [1, 0],
    'v': [0, 1]
}

let map = [], blizMaps = [], dirs = Object.values(moves), movesEntries = Object.entries(moves), autoRun = false;

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

const run = (start, end, t0) => {
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

blizMaps = [];
map = input.split("\n").map(l => l.split(''));

let start = {x: map[0].indexOf('.'), y: 0};
let end = {x: map[map.length-1].indexOf('.'), y: map.length-1};

let p, steps;

let blizs = [];
input.split("\n").forEach((l, y) => l.split('').forEach((v, x) => {
    if ('<>^v'.indexOf(v) == -1) return true;
    blizs.push({x:x, y:y, t:v})
}));

const canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"), spriteSize = 32;
//const wallColors = ['#689', '#888', '#789'];
const wallColors = ['#2f3f63', '#1f1f53', /*'#3f3f53'*/];

const grndColors = ['#e0e6f4', '#eee', '#eee', '#eee'];
let drawing = false, sprites = new Image(), step = 0;
let elf = {x: start.x, y: start.y, spriteId: 2, action: 'wait', hp: 50}

const initBackground = () => {
    canvas.offscreenCanvas = document.createElement("canvas");
    canvas.offscreenCanvas.width = canvas.width;
    canvas.offscreenCanvas.height = canvas.height;

    canvas.offscreenCanvas2 = document.createElement("canvas");
    canvas.offscreenCanvas2.width = canvas.width;
    canvas.offscreenCanvas2.height = canvas.height;

    let octx = canvas.offscreenCanvas.getContext("2d");
    let octx2 = canvas.offscreenCanvas2.getContext("2d");
    
    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[0].length; x++) {
        let v = map[y][x], target = octx;
        let bgColor = v == '#' ? wallColors[Math.floor(Math.random()*wallColors.length)] : grndColors[Math.floor(Math.random()*grndColors.length)];
        if (v == '#') target = octx2;
        target.beginPath();
        target.fillStyle = bgColor;
        target.rect(x*32, y*32, 32, 32);
        target.fill();
    }

    setInterval(draw, 10);
}

const adjust = (dir, anim, v) => moves[v][dir]*anim

const drawSprite = (spriteId, x, y, ax, ay) => ctx.drawImage(sprites, spriteId*spriteSize, 0, spriteSize, spriteSize, x*spriteSize+ax, y*spriteSize+ay, spriteSize, spriteSize);

const draw = () => {
    if (drawing) return;
    drawing = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvas.offscreenCanvas, 0, 0);

    let anim = 0;

    if (stepStartFrame !== false) {
        if (frame - stepStartFrame < 32) {
            anim = frame - stepStartFrame;
        } else {
            // recompute blizs
            blizs = blizs.map(b => {
                b.x += moves[b.t][0];
                b.y += moves[b.t][1];

                if (b.y < 1) b.y = map.length-2;
                if (b.x < 1) b.x = map[0].length-2;
                if (b.y > map.length-2) b.y = 1;
                if (b.x > map[0].length-2) b.x = 1;

                return b;
            })

            // finish moving elf
            elf.x += moves[elf.action][0];
            elf.y += moves[elf.action][1];

            elf.hp -= blizs.filter(b => b.x == elf.x && b.y == elf.y).length;
            stepStartFrame = false;
            step++;
            if (elf.hp <= 0) restart();
        }
    }

    // draw elf
    drawSprite(elf.spriteId, elf.x, elf.y, adjust(0, anim, elf.action), adjust(1, anim, elf.action));
    // scroll to our tricky element
    let el = document.getElementById('elf');
    el.style.left = (elf.x*spriteSize-112+adjust(0, anim, elf.action))+'px';
    el.style.top = (elf.y*spriteSize-112+adjust(1, anim, elf.action))+'px';
    el.innerHTML = '❤'+elf.hp;//'❤'★
    el.scrollIntoViewIfNeeded({behavior: 'smooth', inline: 'center', block: 'center'});

    /*if (anim > 0) {
        ctx.save();
        ctx.globalAlpha = 0.5+Math.abs(anim-16)/32;
    }*/

    blizs.forEach(b => {
        let spriteId = 3+'<^v>'.indexOf(b.t);
        drawSprite(spriteId, b.x, b.y, adjust(0, anim, b.t), adjust(1, anim, b.t));
        
        // extra winds for the border transitions
        if (b.y*spriteSize+adjust(1, anim, b.t) < 32)
            drawSprite(spriteId, b.x, map.length-1, adjust(0, anim, b.t), adjust(1, anim, b.t));
        if (b.x*spriteSize+adjust(0, anim, b.t) < 32)
            drawSprite(spriteId, map[0].length-1, b.y, adjust(0, anim, b.t), adjust(1, anim, b.t));

        if (b.y*spriteSize+adjust(1, anim, b.t) > 32*(map.length-2))
            drawSprite(spriteId, b.x, 0, adjust(0, anim, b.t), adjust(1, anim, b.t));
        if (b.x*spriteSize+adjust(0, anim, b.t) > 32*(map[0].length-2))
            drawSprite(spriteId, 0, b.y, adjust(0, anim, b.t), adjust(1, anim, b.t));
    })

    //if (anim > 0) ctx.restore();

    ctx.drawImage(canvas.offscreenCanvas2, 0, 0);

    frame++;
    drawing = false;

    // auto run
    if (autoRun) {
        if (step < steps.length) action(steps[step]); else autoRun = false;
    } else {
        let keys = Object.entries(keysPressed).filter(([k, v]) => v === true);
        if (keys.length > 0) action(keyMap[keys[0][0]]);
    }
}

let frame = 0, stepStartFrame = false;

const elfSpriteIds = {
    '^': 0,
    '<': 1,
    'v': 2,
    'wait': 2,
    '>': 7
}

const action = v => {
    if (stepStartFrame !== false) return;
    elf.spriteId = elfSpriteIds[v];
    if (elf.y+moves[v][1] < 0 || elf.y+moves[v][1] > map.length-1) v = 'wait';
    if (map[elf.y+moves[v][1]][elf.x+moves[v][0]] == '#') v = 'wait';
    elf.action = v;
    stepStartFrame = frame;
}

let keyMap = {
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

let keysPressed = {};

window.addEventListener('keyup', e => {
    if (keyMap[e.code] !== undefined) keysPressed[e.code] = false;
});
window.addEventListener('keydown', e => {
    if (keyMap[e.code] !== undefined) {
        keysPressed[e.code] = true;
        e.preventDefault();
    }
});

const restart = () => {
    blizMaps = [];
    map = input.split("\n").map(l => l.split(''));
    step = 0;
    elf.x = 1; elf.y = 0; elf.hp = 50;
    blizs = [];
    input.split("\n").forEach((l, y) => l.split('').forEach((v, x) => {
        if ('<>^v'.indexOf(v) == -1) return true;
        blizs.push({x:x, y:y, t:v})
    }));
}

document.getElementById('auto').addEventListener('click', e => {
    if (autoRun) return;

    restart();

    p = run(start, end, 0);

    steps = p.steps.slice();
    console.log('part 1', p.t);
    p = run(end, start, p.t);
    steps = [...steps, ...p.steps];
    p = run(start, end, p.t)
    steps = [...steps, ...p.steps];
    console.log('part 2', p.t);

    autoRun = true;
})

document.getElementById('load').addEventListener('click', e => {
    autoRun = false;
    input = document.getElementById('custom').value;
    restart();
})

sprites.onload = () => initBackground();
sprites.src = './spritesheet.png';
// elf up, elf left, elf down, w left, w up, w down, w right, elf right