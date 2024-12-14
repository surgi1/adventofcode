const init = input => input.split("\n").map(lit => lit.match(/(\d|-)+/g).map(Number));

const canvas = document.getElementById('root');
const ctx = canvas.getContext("2d");

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas, false);

const modulo = (n, mod)  => ((n % mod) + mod) % mod;

const run = (data, cols, rows, t = 100) => {
    let res = 0;
    let quadrants = [[0, 0], [0, 0]];
    let colsHalf = Math.floor(cols/2);
    let rowsHalf = Math.floor(rows/2);
    
    data.forEach(([sx, sy, vx, vy]) => {
        let x = modulo(sx + vx*t, cols);
        let y = modulo(sy + vy*t, rows);
        if (x == colsHalf || y == rowsHalf) return true;
        quadrants[y < rowsHalf ? 0 : 1][x < colsHalf ? 0 : 1]++;
    })

    return quadrants.flat().reduce((a, n) => a*n, 1);
}

const run2 = (data, cols, rows) => {
    resizeCanvas();

    // what are each bots periodicities?
    // for some reason it is rows*cols = 10403, I had to run the simulation to check

    let t = 0;
    let periodHoriz = rows; // rows; had to determine by eye
    let periodVert = cols; // cols; had to determine by eye
    let startHoriz = 65; // determine by eye the time where dots are assembling a 2 horizontal lines
    let startVert = 11; // determine by eye the time where dots are assembling a 2 vertical lines
    // candidate for correct t Horiz: 65, 65+rows, 65+2*rows, 65+3*rows, ...
    // candidate for correct t Vert: 11, 11+cols, 11+2*cols, 11+3*cols, ...
    // the correct t must satisfy t % cols = 11 and t % rows = 65
    // surely there is a better way to compute this, modulo math basic knowledge (lack of thereof) strikes again
    /*for (let n = startVert; n < 10403; n += periodVert) {
        if (n % periodHoriz == startHoriz) { t = n; break;}
    }*/

    // theres actually this one that works: see that it omits periodHoriz completely... why??
    t = startVert + periodVert*(startVert+startHoriz);

    const loop = () => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = "bold 16px Courier New";
        ctx.fillText('P2: '+t, 20, 32);
        let posx = {}, posy = {};
        data.forEach(([sx, sy, vx, vy], id) => {
            let x = modulo(sx + vx*t, cols);
            let y = modulo(sy + vy*t, rows);
            ctx.fillStyle = '#0f0';
            ctx.fillRect(x*5, y*5, 5, 5);
        })
        //setTimeout(() => requestAnimationFrame(loop), 500);
        t++;
    }

    requestAnimationFrame(loop);
    return t;
}

console.log('p1', run(init(input), 101, 103));
console.log('p2', run2(init(input), 101, 103));
