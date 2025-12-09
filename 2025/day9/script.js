const parse = input => input.split('\n').map(line => line.split(',').map(Number))

const run = (data) => {
    let max = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = i+1; j < data.length; j++) {
            let area = (Math.abs(data[i][0] - data[j][0])+1) * (Math.abs(data[i][1] - data[j][1])+1);
            max = Math.max(max, area);
        }
    }

    return max;
}

let canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');

const addv = (a, b) => a.map((v, i) => v+b[i]);
const mulv = (a, n) => a.map(v => v*n);
const cmpv = (a, b) => a.every((v, i) => v == b[i]);

const draw = (walls) => {
    const xformv = v => mulv(addv(v, offset), zoom);

    ctx.clearRect(0, 0, 1000, 1000);
    ctx.fillStyle = '#000';

    let max = [0,1].map(i => Math.max(...walls.map(d => d[i])));
    let min = [0,1].map(i => Math.min(...walls.map(d => d[i])));

    let spread = Math.max(...[0,1].map((_, c) => Math.abs(max[c] - min[c])));

    let zoom = 1000/spread;
    let offset = mulv(min, -1);

    ctx.beginPath();
    ctx.moveTo(...xformv(walls[0]));
    for (let i = 1; i < walls.length; i++) ctx.lineTo(...xformv(walls[i]));
    ctx.lineTo(...xformv(walls[0]))
    ctx.stroke();

    let colors = ['#f00', '#0f0'];
    ctx.fillStyle = colors[0];
    ctx.beginPath();
    ctx.arc(...xformv(walls[0]), 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = colors[1];
    ctx.beginPath();
    ctx.arc(...xformv(walls[1]), 3, 0, 2 * Math.PI);
    ctx.fill();
}

// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
const intersects = (a, b, c, d, p, q, r, s) => {
    let det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
};

const run2 = (data) => {
    draw(data);

    let lines = [];
    for (let i = 1; i < data.length; i++) lines.push([data[i-1], data[i]]);
    lines.push([data[data.length-1], data[0]]);
    
    // now we're searching for the same thing as in part 1, but omit intersection between any of the lines and doagonals of my rectangle
    let maxArea = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = i+1; j < data.length; j++) {
            if (data[i][0] == data[j][0] || data[i][1] == data[j][1]) continue;
            let rectLines = [
                [ data[i], data[j] ], 
                [ [data[i][0], data[j][1]], [data[j][0], data[i][1]] ]
            ]

            if (rectLines.some(rline => lines.some(line => intersects( ...rline.flat(), ...line.flat() ) ) )) {
                continue;
            }

            let area = (Math.abs(data[i][0] - data[j][0])+1) * (Math.abs(data[i][1] - data[j][1])+1);
            maxArea = Math.max(maxArea, area);
        }
    }

    return maxArea;
}

console.log('p1', run(parse(input)));
console.log('p2', run2(parse(input)));
