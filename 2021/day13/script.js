const folds = data => data.map(l => l.split('=').map((v, k) => !k ? v : Number(v)))
const newScreen = (cols, rows) => Array.from({length: cols}, v => Array(rows).fill(0))

const initScreen = data => {
    let ps = data.map(l => l.split(',').map(Number)),
        screen = newScreen(Math.max(...ps.map(v => v[1]))+1, Math.max(...ps.map(v => v[0]))+1);
    ps.map(p => screen[p[1]][p[0]] = 1);
    return screen;
}

const fold = (prev, [axis, pos], fId, cols = prev[0].length, rows = prev.length) => {
    const xc = (ax, v, len) => axis == ax && v > pos ? len-v-1 : v
    let s = newScreen(axis == 'y' ? pos : rows, axis == 'x' ? pos : cols)

    prev.forEach((r, y) => r.forEach((d, x) => d && (s[xc('y', y, rows)][xc('x', x, cols)] = 1)))

    if (!fId) console.log(s.flat().reduce((a, p) => a+p));
    return s;
}

let screen = initScreen(screenData);
folds(foldData).map((f, i) => screen = fold(screen, f, i));

console.log(screen.map((row, y) => row.map(v => ['  ', '██'][v]).join('')).join("\n"));