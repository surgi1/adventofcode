const initScreen = (data, xs = [], ys = [], screen = []) => {
    data.map(l => {
        let tmp = l.split(',').map(n => parseInt(n));
        xs.push(tmp[0]); ys.push(tmp[1]);
    })
    for (let y = 0, rows = Math.max(...ys), cols = Math.max(...xs); y <= rows; y++) screen[y] = Array(cols+1).fill(0);
    ys.map((y, i) => screen[y][xs[i]] = 1);
    return screen;
}

const initFolds = (data, folds = []) => {
    data.map(l => {
        let tmp = l.split('=');
        folds.push({axis: tmp[0], val: parseInt(tmp[1])})
    })
    return folds;
}

const fold = (oldScreen, rule, foldId, screen = []) => {
    oldScreen.forEach((row, y) => {
        if (rule.axis == 'x') screen[y] = Array(rule.val).fill(0); else {
            if (y < rule.val) screen[y] = Array(oldScreen[0].length).fill(0);
        }
        row.forEach((d, x) => {
            if (d == 0) return;
            if (rule.axis == 'x') {
                if (x < rule.val) screen[y][x] = 1; else screen[y][oldScreen[0].length-x-1] = 1;
            } else {
                if (y < rule.val) screen[y][x] = 1; else screen[oldScreen.length-y-1][x] = 1;
            }
        })
    })

    if (foldId == 0) console.log(screen.reduce((a, b) => a.concat(b)).reduce((acc, p) => acc+p));
    return screen;
}

let screen = initScreen(screenData), folds = initFolds(foldData);
folds.map((f, i) => screen = fold(screen, f, i));

console.log(screen.map((row, y) => row.reduce((p, x) => p + (x == 1 ? '#' : ' '), '')));