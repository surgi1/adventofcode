// idea for part 2: adaptive grid in x and y, works for part 1 as well
// however, much more efficient way for computing of volume of irregular polygon is Shoelace formula, see https://www.themathdoctors.org/polygon-coordinates-and-areas/
// let's use that one next time :shrug:

const DS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const  D = { R: 0,   D: 1,   L: 2,    U: 3 };

const addVect = (a, b) => a.map((v, c) => v+b[c]);
const mulVect = (a, o) => o.map(v => a*v);

const parseInputPart1 = (pos = [0, 0]) => input.split("\n").map(line => {
    let [dir, len, rgb] = line.split(' ');
    let posFrom = [...pos];
    pos = addVect(mulVect(Number(len), DS[D[dir]]), pos);

    return {
        dir: D[dir], len: Number(len),
        min: [0, 1].map(c => Math.min(posFrom[c], pos[c])),
        max: [0, 1].map(c => Math.max(posFrom[c], pos[c])),
    }
})

const parseInputPart2 = (pos = [0, 0]) => input.split("\n").map(line => {
    let [dir, len, rgb] = line.split(' ');
    dir = Number(rgb.slice(-2, -1));
    len = parseInt(rgb.slice(2, -2), 16);
    let posFrom = [...pos];
    pos = addVect(mulVect(len, DS[dir]), pos);

    return {
        dir: dir, len: len,
        min: [0, 1].map(c => Math.min(posFrom[c], pos[c])),
        max: [0, 1].map(c => Math.max(posFrom[c], pos[c])),
    }
})

const run = (digs, canvas) => {
    let max = [0, 0], min = [0, 0], // need these for the visuals
        squares = [], grid = [[], []],
        volume = 0, trench = 0;

    digs.forEach(o => {
        o.min.forEach((v, c) => (!grid[c].includes(v)) && grid[c].push(v));
        max = max.map((v, c) => Math.max(v, o.max[c]));
        min = min.map((v, c) => Math.min(v, o.min[c]));
        trench += o.len;
    })

    grid.forEach(c => c.sort((a, b) => a-b));

    for (let i = 0; i < grid[0].length-1; i++) for (let j = 0; j < grid[1].length-1; j++) {
        // calc middle of the square
        let pos = [(grid[0][i+1] + grid[0][i])/2, (grid[1][j+1] + grid[1][j])/2];

        // now we need to determine whether the center is inside - we do that by counting crosses to each border. Is this the shoelace theorem?
        // min[0] == max[0] for U/D, min[1] == max[1] for L/R
        if ([digs.filter(o => [D.L, D.R].includes(o.dir) && o.min[1] < pos[1] && o.min[0] < pos[0] && o.max[0] > pos[0]).length,
             digs.filter(o => [D.L, D.R].includes(o.dir) && o.min[1] > pos[1] && o.min[0] < pos[0] && o.max[0] > pos[0]).length,
             digs.filter(o => [D.U, D.D].includes(o.dir) && o.min[0] < pos[0] && o.min[1] < pos[1] && o.max[1] > pos[1]).length,
             digs.filter(o => [D.U, D.D].includes(o.dir) && o.min[0] > pos[0] && o.min[1] < pos[1] && o.max[1] > pos[1]).length].some(o => o % 2 == 0)) continue;

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
    ctx.lineWidth = 1.0;
    digs.forEach(o => {
        ctx.beginPath();
        ctx.moveTo(o.min[0]*zoom, o.min[1]*zoom);
        ctx.lineTo(o.max[0]*zoom, o.max[1]*zoom)
        ctx.stroke();
    })

    ctx.globalAlpha = 0.2;
    // fill
    squares.forEach(bounds => ctx.fillRect(bounds[0]*zoom, bounds[2]*zoom, (bounds[1] - bounds[0])*zoom, (bounds[3] - bounds[2])*zoom))
}

console.log('p1', run(parseInputPart1(), document.getElementById('part1')));
console.log('p2', run(parseInputPart2(), document.getElementById('part2')));
