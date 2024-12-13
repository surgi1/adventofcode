let DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const init = (input, guard) => {
    let map = input.split("\n").map((line, y) => line.split('').map((v, x) => {
        if (v == '^') guard = {x: x, y: y, dir: 0};
        return v == '#' ? 1 : 0;
    }))
    return [guard, map]
}

const run = (guard, map, ox = false, oy = false) => {
    const onMap = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows;
    const k = o => o.y+'_'+o.x+'_'+o.dir;

    let rows = map.length, cols = map[0].length,
        spots = {}, states = {}, x, y;

    if (ox !== false) map[oy][ox] = 1;
    
    while (states[k(guard)] == undefined && onMap(guard.x, guard.y)) {
        spots[guard.y+'_'+guard.x] = [guard.x, guard.y];
        states[k(guard)] = 1;

        x = guard.x+DIRS[guard.dir][0];
        y = guard.y+DIRS[guard.dir][1];

        while (onMap(x, y) && map[y][x] == 1) {
            guard.dir = ++guard.dir % 4;
            x = guard.x+DIRS[guard.dir][0];
            y = guard.y+DIRS[guard.dir][1];
        }

        guard.x = x;
        guard.y = y;
    }

    if (ox !== false) map[oy][ox] = 0;

    return ox !== false ? states[k(guard)] !== undefined : Object.values(spots);
}

const p2 = (guard, map) => run({...guard}, map).filter(([x, y]) => (x != guard.x || y != guard.y) && run({...guard}, map, x, y))

console.log('p1', run(...init(input)).length);
console.log('p2', p2(...init(input)).length);
