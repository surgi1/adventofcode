const init = input => input.split("\n").map(line => line.split(''));

const run = map => {
    const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    const onMap = (x, y) => x >= 0 && y >= 0 && x < map[0].length && y < map.length;

    let res = 0;

    map.forEach((row, y) => row.forEach((v, x) => DIRS.forEach(([dx, dy]) => {
        let tmp = '';
        for (let n = 0; n < 4; n++) tmp += onMap(x+dx*n, y+dy*n) ? map[y+dy*n][x+dx*n] : '';
        if (tmp == 'XMAS') res++;
    })))

    return res;    
}

const run2 = map => {
    const onMap = (x, y) => x > 0 && y > 0 && x < map[0].length-1 && y < map.length-1;

    let res = 0;

    map.forEach((row, y) => row.forEach((v, x) => {
        if (!onMap(x, y) || v != 'A') return true;
        if ([map[y-1][x-1]+map[y+1][x+1], map[y-1][x+1]+map[y+1][x-1]].every(s => ['SM', 'MS'].includes(s))) res++;
    }))

    return res;    
}

console.log('p1', run(init(input)));
console.log('p2', run2(init(input)));
