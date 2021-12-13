const initScreen = (data, screen = []) => {
    let pts = data.map(l => l.split(',').map(n => parseInt(n))),
        dim = [0,1].map(k => Math.max(...pts.map(v => v[k]))+1);
    screen = Array.from({length: dim[1]}, v => Array(dim[0]).fill(0));
    pts.map(p => screen[p[1]][p[0]] = 1);
    return screen;
}

const folds = data => data.map(l => l.split('=').map((v, k) => !k ? v : parseInt(v)))

const fold = (oldScreen, rule, foldId, screen = []) => {
    oldScreen.forEach((row, y) => {
        if (rule[0] == 'x')
            screen[y] = Array(rule[1]).fill(0);
        else if (y < rule[1])
            screen[y] = Array(oldScreen[0].length).fill(0);

        row.forEach((d, x) => {
            if (d == 0) return;
            if (rule[0] == 'x') {
                if (x < rule[1]) screen[y][x] = 1; else screen[y][oldScreen[0].length-x-1] = 1;
            } else {
                if (y < rule[1]) screen[y][x] = 1; else screen[oldScreen.length-y-1][x] = 1;
            }
        })
    })

    if (!foldId) console.log(screen.reduce((n, m) => n.concat(m)).reduce((a, p) => a+p));
    return screen;
}

let screen = initScreen(screenData);
folds(foldData).map((f, i) => screen = fold(screen, f, i));

console.log(screen.map((row, y) => row.reduce((p, x) => p + (x == 1 ? '#' : ' '), '')));