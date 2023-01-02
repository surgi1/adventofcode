import { clickHandle } from './game.js';
import { id } from './baseDOM.js';
import { eqVect } from './vect.js';
import { charVal } from './gameLogic.js';

const resources = {
    sprites: {
        url: './resources/spritesheet.png'
    }
};

const spriteSize = [84, 108];
const cellSize = [84, 84];

const mousePos = {};
const canvas = id('canvas');
const ctx = canvas.getContext('2d');

const spriteIds = {
    A: 6,
    B: 0, // 0 if r2d2 (1) not fit
    C: 5,
    D: 4,
    wallTop: 7,
    wall: 9,
    floor: 8,
}

let rows,
    frame = 0,
    drawing = false,
    animStartFrame = false;

const animationStart = () => animStartFrame = frame;
const animationStop = () => animStartFrame = false;

const createPlane = src => {
    let e = document.createElement('canvas');
    e.width = src.width;
    e.height = src.height;
    return e;
}

const drawBgSprite = (ctx, spriteId, [x, y]) => ctx.drawImage(
    resources.sprites.data,
    spriteId * spriteSize[0], 0,
    cellSize[0], cellSize[1],
    x * cellSize[0], y * cellSize[1],
    cellSize[0], cellSize[1]
);

const drawPodSprite = (type, highlighted, [x, y], [ax, ay] = [0, 0]) => ctx.drawImage(
    resources.sprites.data,
    (spriteIds[type] + (highlighted ? 10 : 0)) * spriteSize[0], 0,
    spriteSize[0], spriteSize[1],
    x * cellSize[0] + ax, y * cellSize[1] + ay - 24 - 20,
    spriteSize[0], spriteSize[1]
);

const drawEmblemSprite = (type, [x, y]) => ctx.drawImage(
    resources.sprites.data,
    (spriteIds[type]+10) * spriteSize[0], 0,
    spriteSize[0], 48,
    x * cellSize[0], y * cellSize[1] + 14,
    spriteSize[0], 48
);

const render = (pods, map, moves) => {
    if (drawing) return;
    drawing = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear
    ctx.drawImage(canvas.planes.bg, 0, 0);

    let hovered = pods.filter(p => eqVect(p, mousePos))?.[0],
        selected = pods.filter(p => p.highlighted)?.[0];

    if (map[mousePos.y] && !['#', ' ', undefined].includes(map[mousePos.y]?.[mousePos.x])) {
        let fillStyle = '#fff';
        if (!hovered && selected && !moves.some(m => eqVect(m, mousePos))) fillStyle = '#f00';
        rectOnPos(mousePos, fillStyle, 0.5);
    }

    pods.sort((a, b) => a.y - b.y).forEach((p, i) => drawPodSprite(p.type, p.highlighted, [p.x, p.y],
        [0, (animStartFrame !== false) && (animStartFrame + i > 0) ? 10*Math.sin(i + frame / 10) : 0]));

    Object.keys(charVal).forEach((v, i) => drawEmblemSprite(v, [3 + i*2, rows - 1]));

    frame++;
    drawing = false;
}

const initPlanes = map => {
    rows = map.length;

    canvas.style.height = cellSize[1] * rows + 'px';
    canvas.setAttribute('height', cellSize[1] * rows);

    canvas.planes = {
        bg: createPlane(canvas)
    };

    for (let y = 0; y < map.length; y++)
        for (let x = 0; x < map[0].length; x++) {
            let v = map[y][x],
                target = canvas.planes.bg.getContext('2d'),
                spriteId = ['#', ' ', undefined].includes(v) ? (y == 0 ? spriteIds.wallTop : spriteIds.wall) : spriteIds.floor;
            drawBgSprite(target, spriteId, [x, y]);
        }
}

const rectOnPos = (p, fillStyle, alpha) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.rect(
        p.x*cellSize[0], p.y*cellSize[1],
        cellSize[0], cellSize[1]
    );
    ctx.fill();
    ctx.restore();
}

const getMousePos = () => mousePos;

const getCursorPosition = e => {
    const rect = canvas.getBoundingClientRect();
    mousePos.x = Math.floor((e.clientX - rect.left) / cellSize[0]);
    mousePos.y = Math.floor((e.clientY - rect.top) / cellSize[1]);
}

const load = (run, resourcesLoaded = 0) => Object.values(resources).forEach(v => {
    v.data = new Image();
    v.data.onload = () => {
        if (++resourcesLoaded < Object.keys(resources).length) return;
        run();
    }
    v.data.src = v.url;
})

const init = run => {
    canvas.addEventListener('mousemove', e => getCursorPosition(e))
    canvas.addEventListener('mouseup', e => {
        if (animStartFrame === false) clickHandle(mousePos)
    })
    load(run);
}

export { init, initPlanes, render, animationStart, animationStop }