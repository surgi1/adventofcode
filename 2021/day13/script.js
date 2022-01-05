const initScreen = (data, screen = []) => {
    let pts = data.map(l => l.split(',').map(n => parseInt(n))),
        dim = [0,1].map(k => Math.max(...pts.map(v => v[k]))+1);
    screen = Array.from({length: dim[1]}, v => Array(dim[0]).fill(0));
    pts.map(p => screen[p[1]][p[0]] = 1);
    return screen;
}

const folds = data => data.map(l => l.split('=').map((v, k) => !k ? v : parseInt(v)))

const fold = (prev, f, fId) => {
    let screen = Array.from({length: f[0]=='y' ? f[1] : prev.length},
        v => Array(f[0]=='x' ? f[1] : prev[0].length).fill(0));

    prev.forEach((row, y) => row.forEach((d, x) => {
        if (d == 0) return;
        let _x = f[0] == 'x' && x > f[1] ? prev[0].length-x-1 : x;
        let _y = f[0] == 'y' && y > f[1] ? prev.length-y-1 : y;
        screen[_y][_x] = 1;
    }))

    if (!fId) console.log(screen.flat().reduce((a, p) => a+p));
    return screen;
}

let screen = initScreen(screenData);
folds(foldData).map((f, i) => screen = fold(screen, f, i));

console.log(screen.map((row, y) => row.reduce((p, x) => p + (x == 1 ? '██' : '  '), '')));