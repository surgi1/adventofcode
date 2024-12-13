const run = steps => {
    const key = (x,y) => x+'_'+y;
    const step = (stepNr, newMap = {}) => {
        for (let y = min;y <= max; y++) for (let x = min; x <= max; x++) {
            let s = '';
            for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++)
                s += (map[key(x+j, y+i)] !== undefined) ? map[key(x+j, y+i)] : stepNr % 2;
            let patternIndex = parseInt(s, 2);
            newMap[key(x, y)] = pattern[patternIndex] == '#' ? 1 : 0;
        }
        min--; max++;
        map = newMap;
    }

    let map = {}, min = -1, max = input.length;

    input.map((line, y) => line.split('').map((d, x) => map[key(x,y)] = (d == '#' ? 1 : 0)))

    for (let i = 0; i < steps; i++) step(i);
    return Object.values(map).reduce((acc, v) => acc+v, 0);
}

console.log(run(2));
console.log(run(50));