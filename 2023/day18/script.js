// idea for part 2: adaptive grid in x and y, works for part 1 as well
const D = {
    R: 0,
    D: 1,
    L: 2, 
    U: 3,
}

const DS = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
]

const addVect = (a, b) => a.map((v, c) => v+b[c]);
const mulVect = (a, o) => o.map(v => a*v);

const parseInputPart1 = (pos = [0, 0]) => input.split("\n").map(line => {
    let [dir, len, rgb] = line.split(' ');
    let posFrom = [...pos];
    pos = addVect(mulVect(Number(len), DS[D[dir]]), pos);

    return {
        dir: D[dir],
        len: Number(len),
        posFrom: posFrom,
        posTo: pos,
        min: [0, 1].map(c => Math.min(posFrom[c], pos[c])),
        max: [0, 1].map(c => Math.max(posFrom[c], pos[c])),
    }
})

const parseInputPart2 = (pos = [0, 0]) => input.split("\n").map(line => {
    let [dir, len, rgb] = line.split(' ');
    rgb = rgb.slice(1, -1);
    dir = Number(rgb.slice(-1));
    len = parseInt(rgb.slice(1, -1), 16)
    let posFrom = [...pos];
    pos = addVect(mulVect(len, DS[dir]), pos);

    return {
        dir: dir,
        len: len,
        posFrom: posFrom,
        posTo: pos,
        min: [0, 1].map(c => Math.min(posFrom[c], pos[c])),
        max: [0, 1].map(c => Math.max(posFrom[c], pos[c])),
    }
})

const run = (digs, canvas) => {
    let max = [0, 0], min = [0, 0],
        squares = [], grid = [[], []],
        volume = 0, trench = 0;

    for (let i = 0; i < digs.length; i++) {
        let dig = digs[i];
        [0, 1].forEach(c => {
            if (!grid[c].includes(dig.posFrom[c])) grid[c].push(dig.posFrom[c]);
        })
        max = max.map((v, c) => Math.max(v, dig.max[c]));
        min = min.map((v, c) => Math.min(v, dig.min[c]));
        trench += dig.len;
    }

    grid.forEach(c => c.sort((a, b) => a-b));

    for (let i = 0; i < grid[0].length-1; i++) for (let j = 0; j < grid[1].length-1; j++) {
        // calc middle of the square
        let pos = [(grid[0][i+1] + grid[0][i])/2, (grid[1][j+1] + grid[1][j])/2];

        // now we need to determine whether the center is inside
        if ([digs.filter(o => [D.L, D.R].includes(o.dir) && o.posTo[1] < pos[1] && o.min[0] < pos[0] && o.max[0] > pos[0]).length,
             digs.filter(o => [D.L, D.R].includes(o.dir) && o.posTo[1] > pos[1] && o.min[0] < pos[0] && o.max[0] > pos[0]).length,
             digs.filter(o => [D.U, D.D].includes(o.dir) && o.posTo[0] < pos[0] && o.min[1] < pos[1] && o.max[1] > pos[1]).length,
             digs.filter(o => [D.U, D.D].includes(o.dir) && o.posTo[0] > pos[0] && o.min[1] < pos[1] && o.max[1] > pos[1]).length].some(o => o % 2 == 0)) continue;

        volume += Math.abs(grid[0][i+1] - grid[0][i])*Math.abs(grid[1][j+1] - grid[1][j]);
        squares.push([grid[0][i], grid[0][i+1], grid[1][j], grid[1][j+1]]);
    }

    if (canvas !== undefined) draw(canvas, min, max, grid, digs, squares);

    return volume + trench/2 + 1;
}

const draw = (canvas, min, max, grid, digs, squares) => {
    ctx = canvas.getContext('2d');

    let zoom = 1000 / (max[0] - min[0]);
    canvas.width = (max[0] - min[0] + 1)*zoom;
    canvas.height = (max[1] - min[1] + 1)*zoom;

    ctx.translate(-min[0]*zoom, -min[1]*zoom);
    
    // grid
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 0.2;
    grid[0].forEach(x => {
        ctx.beginPath();
        ctx.moveTo(x*zoom, min[1]*zoom);
        ctx.lineTo(x*zoom, max[1]*zoom);
        ctx.stroke();
    })
    grid[1].forEach(y => {
        ctx.beginPath();
        ctx.moveTo(min[0]*zoom, y*zoom);
        ctx.lineTo(max[0]*zoom, y*zoom);
        ctx.stroke();
    })

    // trenches
    ctx.strokeStyle = '#f00';
    ctx.beginPath();
    ctx.moveTo(digs[0].posFrom[0]*zoom, digs[0].posFrom[1]*zoom);
    digs.forEach(o => ctx.lineTo(o.posTo[0]*zoom, o.posTo[1]*zoom))
    ctx.lineWidth = 1.0;
    ctx.stroke();

    ctx.globalAlpha = 0.2;
    // fill
    squares.forEach(bounds => ctx.fillRect(bounds[0]*zoom, bounds[2]*zoom, (bounds[1] - bounds[0])*zoom, (bounds[3] - bounds[2])*zoom))
}

console.log('p1', run(parseInputPart1(), document.getElementById('part1')));
console.log('p2', run(parseInputPart2(), document.getElementById('part2')));
