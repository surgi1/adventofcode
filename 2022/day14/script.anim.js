const canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"); sandStart = [500,0];
const scale = 4, shift = 300;
let screen = [], sand = [], ticks = 0;

let caves = input.split("\n").map(row => row.split(' -> ').map(p => p.split(',').map(Number))),
    maxX = Math.max(...caves.flat().map(v => v[0]))*2,
    maxY = Math.max(...caves.flat().map(v => v[1]));

caves.push([[0,maxY+2], [maxX*2,maxY+2]]);

const init = () => {
    const line = (from, to) => {
        let min = [ Math.min(from[0], to[0]), Math.min(from[1], to[1]) ],
            max = [ Math.max(from[0], to[0]), Math.max(from[1], to[1]) ];
        for (let i = min[0]; i <= max[0]; i++) for (let j = min[1]; j <= max[1]; j++) screen[j][i] = 1;
    }

    screen = Array.from({length: maxY+3}, () => Array(maxX).fill(0));
    caves.forEach(point => point.forEach((p, i) => i && line(point[i-1], p)))
}

const advanceSand = () => {
    sand.filter(p => p.state == 'moving').forEach(p => {
        let moved = false;
        if (screen[p.pos[1]+1][p.pos[0]] == 0) { p.pos[1]++; moved = true }
        if (screen[p.pos[1]+1][p.pos[0]-1] == 0) { p.pos[1]++; p.pos[0]--; moved = true }
        if (screen[p.pos[1]+1][p.pos[0]+1] == 0) { p.pos[1]++; p.pos[0]++; moved = true }
        if (!moved) {
            screen[p.pos[1]][p.pos[0]] = 2;
            p.state = 'solid'
        }
    })
}

const dropSand = () => sand.push({pos: sandStart.slice(), state: 'moving', drawn: false})

const initBackground = () => {
    const drawLine = (from, to) => {
        ctx.moveTo((from[0]-shift)*scale, from[1]*scale);
        ctx.lineTo((to[0]-shift)*scale, to[1]*scale);
    }

    canvas.offscreenCanvas = document.createElement("canvas");
    canvas.offscreenCanvas.width = canvas.width;
    canvas.offscreenCanvas.height = canvas.height;

    let ctx = canvas.offscreenCanvas.getContext("2d")
    
    ctx.lineWidth = scale;
    caves.forEach(point => point.forEach((p, i) => i && drawLine(point[i-1], p)))
    ctx.stroke();

    // draw sand start point
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(Math.round((sandStart[0]-shift)*scale-scale/2), sandStart[1]*scale, scale, scale);
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvas.offscreenCanvas, 0, 0);
    sand.forEach(p => {
        let targetCtx = ctx;
        ctx.fillStyle = p.state == 'solid' ? '#888888' : '#aaaaaa';
        ctx.fillRect(Math.round((p.pos[0]-shift)*scale-scale/2), Math.round(p.pos[1]*scale-scale/2), scale, scale);
    })
}

const tick = () => {
    if (ticks % 2 == 0) dropSand();
    advanceSand();
    if (ticks % 3 == 0)
        draw();
    ticks++;
}

init();
initBackground();

setInterval(tick, 5);