const canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"), sandStart = [500,0];
const scale = 4, shift = 310;
let screen = [], sand = [], ticks = 0, octx, drawing = false, p1res = false;

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

const advanceSand = () => sand.filter(p => p.state == 'moving').forEach(p => {
    let moved = false;
    if (screen[p.pos[1]+1][p.pos[0]] == 0) { p.pos[1]++; moved = true }
    else if (screen[p.pos[1]+1][p.pos[0]-1] == 0) { p.pos[1]++; p.pos[0]--; moved = true }
    else if (screen[p.pos[1]+1][p.pos[0]+1] == 0) { p.pos[1]++; p.pos[0]++; moved = true }
    if (!moved) {
        screen[p.pos[1]][p.pos[0]] = 2;
        p.state = 'solid'
    }
    if (!p1res && p.pos[1] >= maxY+1) {
        console.log('part 1', sand.filter(g => g.state == 'solid').length);
        p1res = true;
    }
})

const dropSand = () => sand.push({pos: sandStart.slice(), state: 'moving', drawn: false})

const initBackground = () => {
    const drawLine = (from, to) => {
        octx.moveTo((from[0]-shift)*scale, from[1]*scale);
        octx.lineTo((to[0]-shift)*scale, to[1]*scale);
    }

    canvas.offscreenCanvas = document.createElement("canvas");
    canvas.offscreenCanvas.width = canvas.width;
    canvas.offscreenCanvas.height = canvas.height;

    octx = canvas.offscreenCanvas.getContext("2d");
    
    octx.lineWidth = 2;
    caves.forEach(point => point.forEach((p, i) => i && drawLine(point[i-1], p)))
    octx.stroke();

    // draw sand start point
    octx.fillStyle = '#f1b96F';
    octx.beginPath();
    octx.arc((sandStart[0]-shift)*scale, sandStart[1]*scale, scale*3, 0, 2 * Math.PI);
    octx.fill();
}

const drawGrain = (ctx, grain) => {
    ctx.fillStyle = grain.state == 'solid' ? '#F4A460' : '#ffc98F';
    ctx.beginPath();
    ctx.arc((grain.pos[0]-shift)*scale, grain.pos[1]*scale, scale, Math.random()*Math.PI/4, Math.random()* 3 * Math.PI);
    ctx.fill();
}

const draw = () => {
    if (drawing) return;
    drawing = true;
    sand.filter(g => !g.drawn && g.state == 'solid').map(g => {
        drawGrain(octx, g);
        g.drawn = true;
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvas.offscreenCanvas, 0, 0);

    sand.filter(g => !g.drawn).map(g => drawGrain(ctx, g))
    drawing = false;
}

const tick = () => {
    if (ticks % 2 == 0) dropSand();
    advanceSand();
    draw();
    ticks++;
    if (sand.filter(g => g.pos[1] == 0).length > 0) console.log('part 2', sand.length);
        else setTimeout(tick, 1);
}

init();
initBackground();

tick();