let DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const init = input => {
    let guard = {x: 0, y: 0, dir: 0};
    let map = input.split("\n").map((line, y) => line.split('').map((v, x) => {
        if (v == '^') {
            guard.x = x;
            guard.y = y;
        }
        return v == '#' ? 1 : 0;
    }))
    return [guard, map]
}

const run = ([guard, map], p2 = false) => {
    const onMap = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows;

    let rows = map.length, cols = map[0].length,
        o = {}, seen = {}, loop = false;
    
    while (!loop) {
        o[guard.y+'_'+guard.x] = 1;
        seen[guard.y+'_'+guard.x+'_'+guard.dir] = 1;

        let x = guard.x+DIRS[guard.dir][0], y = guard.y+DIRS[guard.dir][1];

        while (onMap(x, y) && map[y][x] == 1) {
            guard.dir = (guard.dir+1) % 4;
            x = guard.x+DIRS[guard.dir][0];
            y = guard.y+DIRS[guard.dir][1];
        }

        if (seen[y+'_'+x+'_'+guard.dir] !== undefined) loop = true;

        if (onMap(x, y)) {
            if (map[y][x] == 0) {
                guard.x = x;
                guard.y = y;
            }
        } else break;
    }

    return p2 ? loop : o;
}

const p2 = ([guard, map]) => {
    let res = 0,
        visited = run([{...guard}, map]);

    console.log('p1', Object.keys(visited).length);

    map.forEach((row, y) => row.forEach((v, x) => {
        if (v == 1) return true;
        if (x == guard.x && y == guard.y) return true;
        if (visited[y+'_'+x] === undefined) return true;
        map[y][x] = 1;
        if (run([{...guard}, map], true)) res++;
        map[y][x] = 0;
    }))
    return res;
}

console.log('p2', p2(init(input)));
