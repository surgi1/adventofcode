const parse = input => input.split('\n').map(line => line.split(''))

const run = map => {
    let start = [0,0];
    map[0].forEach((v, x) => {
        if (v == 'S') start[0] = x;
    })

    let rows = map.length;
    let cols = map[0].length;
    let queue = [start], cur, seen = {};

    while (cur = queue.pop()) {
        let [x, y] = cur;
        let k = x+'_'+y;
        if (seen[k] !== undefined) continue;
        seen[k] = 1;
        if (y == rows-1) continue;
        if (map[y][x] == '^') {
            queue.push([x-1, y+1]);
            queue.push([x+1, y+1]);
        } else {
            queue.push([x, y+1]);
        }
    }

    let res = 0;
    map.forEach((row, y) => row.forEach((v, x) => {
        if (v == '^' && seen[x+'_'+y] !== undefined) res++;
    }))
    return res;
}

const run2 = map => {
    let rows = map.length;
    let cols = map[0].length;
    let timelines = [];

    for (let y = 0; y < rows; y++) {
        timelines[y] = [];
        for (let x = 0; x < cols; x++) {
            let sum = 0;
            if (map[y][x] == 'S') sum++;
            if (y > 0 && map[y][x] == '.') {
                if (x > 0 && map[y][x-1] == '^') sum += timelines[y-1][x-1];
                if (x < cols-1 && map[y][x+1] == '^') sum += timelines[y-1][x+1];
                sum += timelines[y-1][x];
            }
            timelines[y][x] = sum;
        }
    }

    return timelines.pop().reduce((a, v) => a+v, 0);
}

console.log('p1', run(parse(input)));
console.log('p2', run2(parse(input)));
