const parse = input => input.split('\n').map(s => s.split(''));

const run = (map, p2 = false) => {
    let res = 0, changed = true;

    while (changed) {
        changed = false;

        map.forEach((row, y) => row.map((v, x) => {
            if (v != '@') return true;

            let adjacents = 0;

            for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
                if (i == 0 && j == 0 || map[y+i] === undefined || map[y+i][x+j] === undefined) continue;
                if (map[y+i][x+j] == '@') adjacents++;
            }

            if (adjacents < 4) {
                res++;
                if (p2) {
                    changed = true;
                    map[y][x] = '.';
                }
            }
        }))
    }

    return res;
}

console.log('p1', run(parse(input)));
console.log('p2', run(parse(input), true));
